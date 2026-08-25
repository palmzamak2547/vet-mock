// ============================================================
// Rate limiter — dual-backend (Upstash KV when configured, else
// in-memory fallback).
// ============================================================
// Original: in-memory only, so rate limits reset every cold start
// and didn't share across Vercel instances. A user could burst past
// the limit just by hitting different regions.
//
// Now: if env vars UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN
// are present, we use a Redis-backed atomic INCR counter via Upstash's
// REST API (works in Vercel edge + node runtimes, no SDK install
// needed — fetch is universal). Otherwise we fall back to the
// in-memory Map (still fine for local dev).
//
// ACTIVATED 2026-05-26 via Vercel MCP:
//   - DB: vetmock-ratelimit on Upstash (Free plan, 10k req/day)
//   - Region picked to match our Vercel lambda region (iad1 = US East)
//     so RTT < 1ms intra-region. NOTE: an older comment in this file
//     said ap-southeast-1 / Singapore — that was wrong, our Vercel
//     functionDefaultRegion is iad1 not sin1.
//   - Env vars (Production + Preview): UPSTASH_REDIS_REST_URL +
//     UPSTASH_REDIS_REST_TOKEN. Created in Vercel under the project
//     env vars; never put values in this repo.
//   - Confirmation log on first request after deploy:
//     "[rate-limit] using upstash"
//
// If env vars are missing (e.g. local `vercel dev` without a pulled
// .env or a Preview deploy without the vars), behavior gracefully
// degrades to in-memory + a one-time console.log of the active backend.
// ============================================================

// --- In-memory fallback (current behavior) ---
const buckets = new Map();

function sweepInMemory(now) {
  for (const [k, v] of buckets) {
    if (now - v.last > 60_000) buckets.delete(k);
  }
}

function rateLimitInMemory(key, max, winMs) {
  const now = Date.now();
  if (Math.random() < 0.01) sweepInMemory(now);
  let b = buckets.get(key);
  if (!b || now - b.first > winMs) {
    b = { first: now, last: now, count: 1 };
    buckets.set(key, b);
    return { ok: true, retryAfter: 0 };
  }
  b.last = now;
  b.count++;
  if (b.count > max) {
    return { ok: false, retryAfter: Math.ceil((winMs - (now - b.first)) / 1000) };
  }
  return { ok: true, retryAfter: 0 };
}

// --- Upstash KV backend (used when env vars present) ---
// Uses a sliding-window counter via SET … EX + INCR atomic ops over
// REST. No SDK install required — universal fetch.

const UPSTASH_URL = (typeof process !== 'undefined' && process.env?.UPSTASH_REDIS_REST_URL) || '';
const UPSTASH_TOKEN = (typeof process !== 'undefined' && process.env?.UPSTASH_REDIS_REST_TOKEN) || '';
const HAS_UPSTASH = !!(UPSTASH_URL && UPSTASH_TOKEN);
let _loggedBackend = false;

async function upstashPipeline(commands) {
  // Upstash REST pipeline: POST array of commands → array of results.
  const res = await fetch(`${UPSTASH_URL}/pipeline`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${UPSTASH_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(commands),
  });
  if (!res.ok) throw new Error(`upstash ${res.status}`);
  return res.json();
}

async function rateLimitUpstash(key, max, winMs) {
  const winSec = Math.ceil(winMs / 1000);
  const k = `rl:${key}`;
  try {
    // Atomic: INCR + (set TTL only if first time via SET NX EX)
    // We use a 2-command pipeline: INCR k, EXPIRE k winSec NX
    // (NX = only set TTL if not already set — preserves the original
    //  window start across requests within the same window)
    const results = await upstashPipeline([
      ['INCR', k],
      ['EXPIRE', k, String(winSec), 'NX'],
    ]);
    const count = Array.isArray(results) && results[0]?.result;
    if (typeof count !== 'number') {
      // Unexpected shape — graceful degrade to in-memory
      return rateLimitInMemory(key, max, winMs);
    }
    if (count > max) {
      // Get current TTL to surface a useful retryAfter
      try {
        const ttlRes = await upstashPipeline([['TTL', k]]);
        const ttl = ttlRes?.[0]?.result;
        return { ok: false, retryAfter: typeof ttl === 'number' && ttl > 0 ? ttl : winSec };
      } catch {
        return { ok: false, retryAfter: winSec };
      }
    }
    return { ok: true, retryAfter: 0 };
  } catch (err) {
    // Network/auth failure → fall back to in-memory so the API stays
    // up. Better an unprotected burst than an outage.
    if (!_loggedBackend) {
      console.warn('[rate-limit] upstash failed, falling back to in-memory:', err?.message || err);
    }
    return rateLimitInMemory(key, max, winMs);
  }
}

/**
 * Sliding-window rate limit. Async (was sync before — callers must
 * `await`). API: returns { ok, retryAfter } same as before.
 *
 * @param {string} key   — identifier (usually IP)
 * @param {number} max   — max requests in window
 * @param {number} winMs — window size (ms)
 * @returns {Promise<{ ok: boolean, retryAfter: number }>}
 */
export async function rateLimit(key, max, winMs) {
  if (!_loggedBackend) {
    console.log(`[rate-limit] using ${HAS_UPSTASH ? 'upstash' : 'in-memory'}`);
    _loggedBackend = true;
  }
  if (HAS_UPSTASH) return rateLimitUpstash(key, max, winMs);
  return rateLimitInMemory(key, max, winMs);
}

/** Best-effort client IP extraction for rate-limit keys (not auth!). */
export function clientIP(req) {
  // Vercel documents x-vercel-forwarded-for as its platform-owned copy of
  // x-forwarded-for. Prefer it so a future proxy in front of Vercel cannot
  // replace the generic header and mint arbitrary rate-limit buckets.
  const candidates = [
    req.headers['x-vercel-forwarded-for'],
    req.headers['x-forwarded-for'],
    req.headers['x-real-ip'],
    req.socket?.remoteAddress,
  ];
  for (const value of candidates) {
    if (value === null || value === undefined || value === '') continue;
    const first = String(value).split(',')[0].trim().slice(0, 128);
    if (first) return first;
  }
  return 'unknown';
}

/**
 * Allowed origins for CORS (returns the origin if allowed, else null).
 *
 * Two checks, in order:
 *   1) **Same-origin auto-allow** — if the request's Origin host matches
 *      the request's own Host header, it's coming from the same Vercel
 *      deployment that's serving the API. Trustworthy by definition;
 *      auto-allow without needing manual allowlist updates. This handles
 *      custom domains, every Vercel preview URL, project rename, etc.
 *   2) **Static allowlist fallback** — for cross-origin requests we
 *      genuinely want to support (e.g. local dev hitting prod API).
 */
export function allowedOrigin(req) {
  const origin = req.headers.origin;
  if (!origin) return null;

  // (1) Same-origin auto-allow
  const host = req.headers.host;
  if (host) {
    try {
      const u = new URL(origin);
      if (u.host === host) return origin;
    } catch {
      // malformed Origin → fall through to allowlist
    }
  }

  // (2) Static allowlist (for legitimate cross-origin scenarios)
  const allow = [
    'https://vetmock.vercel.app',
    'https://vet-mock.vercel.app',
    /^https:\/\/vetmock-[\w-]+\.vercel\.app$/,    // Preview deployments
    /^https:\/\/vet-mock-[\w-]+\.vercel\.app$/,   // Legacy preview pattern
    'http://localhost:5173',
    'http://localhost:4173',
    'http://localhost:4174',
  ];
  for (const a of allow) {
    if (typeof a === 'string' && origin === a) return origin;
    if (a instanceof RegExp && a.test(origin)) return origin;
  }
  return null;
}
