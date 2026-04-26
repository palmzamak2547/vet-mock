// ============================================================
// Tiny in-memory rate limiter for Vercel serverless functions
// ============================================================
// Note: Vercel functions are stateless across instances — this map
// only protects within ONE running instance. Cold starts reset it.
// For stronger protection upgrade to Vercel KV / Upstash Redis.
// Still useful: stops single-burst spam from one user.
// ============================================================

const buckets = new Map();

// Sweep stale entries periodically
function sweep(now) {
  for (const [k, v] of buckets) {
    if (now - v.last > 60_000) buckets.delete(k);
  }
}

/**
 * Simple sliding-window limiter.
 * @param {string} key   — identifier (usually IP)
 * @param {number} max   — max requests in window
 * @param {number} winMs — window size (ms)
 * @returns {{ ok: boolean, retryAfter: number }}
 */
export function rateLimit(key, max, winMs) {
  const now = Date.now();
  if (Math.random() < 0.01) sweep(now); // 1% sweep
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

/** Best-effort client IP extraction for rate-limit keys (not auth!). */
export function clientIP(req) {
  const fwd = req.headers['x-forwarded-for'];
  if (typeof fwd === 'string' && fwd) return fwd.split(',')[0].trim();
  return req.headers['x-real-ip'] || req.socket?.remoteAddress || 'unknown';
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
  // Production hostname is vetmock.vercel.app (no hyphen). The hyphenated
  // form was the original Vercel project name; kept here in case any
  // bookmark / preview / branch URL still resolves to it. Same-origin
  // auto-allow above (#1) means most legitimate visits never reach this
  // list anyway.
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
