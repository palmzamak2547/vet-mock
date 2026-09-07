// Shared quotas use Upstash in deployed environments. A configured limiter
// outage returns a retryable 503; it never grants a fresh instance-local budget.
// The in-memory backend is only for development without shared credentials.

// --- In-memory fallback (current behavior) ---
const buckets = new Map();

// A bucket is garbage only once its OWN window has closed. The sweep used to
// drop any bucket idle for a minute regardless of its window, so on an
// instance running without Upstash the 24-hour provider budgets
// (provider:llm:daily, provider:resend:daily, ...) quietly reset after sixty
// quiet seconds — a cap that only held while traffic never paused.
// Exported for the unit test; the 1% random trigger below is not testable.
export function sweepInMemory(now = Date.now()) {
  for (const [k, v] of buckets) {
    if (now - v.first > v.winMs) buckets.delete(k);
  }
}

function rateLimitInMemory(key, max, winMs) {
  const now = Date.now();
  if (Math.random() < 0.01) sweepInMemory(now);
  let b = buckets.get(key);
  if (!b || now - b.first > winMs) {
    b = { first: now, winMs, count: 1 };
    buckets.set(key, b);
    return { ok: true, retryAfter: 0 };
  }
  b.count++;
  if (b.count > max) {
    // Never 0: a Retry-After of zero invites an immediate retry into the
    // same closed window.
    return { ok: false, retryAfter: Math.max(1, Math.ceil((winMs - (now - b.first)) / 1000)) };
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
let lastFailureLog = 0;
const SHARED_TIMEOUT_MS = 1800;

function unavailable() {
  if (Date.now() - lastFailureLog > 60_000) {
    console.warn('[rate-limit] shared limiter unavailable; request deferred');
    lastFailureLog = Date.now();
  }
  return { ok: false, unavailable: true, retryAfter: 30 };
}

export function sendRateLimitFailure(res, limit) {
  res.setHeader('Cache-Control', 'private, no-store');
  res.setHeader('Retry-After', String(limit.retryAfter));
  return res.status(limit.unavailable ? 503 : 429).json({
    error: limit.unavailable ? 'Service temporarily unavailable' : 'Too many requests',
    reason: limit.unavailable ? 'temporarily_unavailable' : 'rate_limited',
    retryAfter: limit.retryAfter,
  });
}

async function upstashPipeline(commands) {
  // Upstash REST pipeline: POST array of commands → array of results.
  const res = await fetch(`${UPSTASH_URL}/pipeline`, {
    method: 'POST',
    signal: AbortSignal.timeout(SHARED_TIMEOUT_MS),
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
    if (!Number.isFinite(count) || results[0]?.error || results[1]?.error
      || typeof results[1]?.result !== 'number') {
      return unavailable();
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
    // A local counter cannot enforce a shared spending ceiling. Keep the
    // request retryable instead of silently granting fresh quotas per instance.
    return unavailable();
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
  const sharedRequired = process.env.VERCEL_ENV === 'production' || process.env.NODE_ENV === 'production';
  if (!_loggedBackend) {
    console.log(`[rate-limit] using ${HAS_UPSTASH ? 'upstash' : sharedRequired ? 'unconfigured' : 'in-memory'}`);
    _loggedBackend = true;
  }
  if (HAS_UPSTASH) return rateLimitUpstash(key, max, winMs);
  if (sharedRequired) return unavailable();
  return rateLimitInMemory(key, max, winMs);
}

// --- Shared Upstash KV (same DB, same REST client) ------------------
// Small best-effort JSON cache, used by the AI answer cache. A missing
// or failing backend reads as a miss and writes vanish silently — the
// caller must always be correct without it.

export async function kvGetJSON(key) {
  if (!HAS_UPSTASH) return null;
  try {
    const r = await upstashPipeline([['GET', key]]);
    const raw = r?.[0]?.result;
    if (typeof raw !== 'string') return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export async function kvSetJSON(key, value, ttlSec) {
  if (!HAS_UPSTASH) return;
  try {
    const raw = JSON.stringify(value);
    if (raw.length > 100_000) return; // keep the shared rate-limit DB lean
    await upstashPipeline([['SET', key, raw, 'EX', String(Math.max(1, Math.floor(ttlSec)))]]);
  } catch {
    // best-effort
  }
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
