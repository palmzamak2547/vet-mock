// ============================================================
// ai/health.js — is the AI able to answer, without asking it anything
// ============================================================
// GET /api/ai-chat?health=1, read by the scheduled watch
// (.github/workflows/production-watch.yml). It spends no token: DeepSeek's
// GET /user/balance is free, and the fallback is judged only by whether its
// key is set. No secret, amount or vendor message leaves the server: only
// three words and two booleans.
//
//   ok        the first provider has balance
//   degraded  it has none (or did not answer) and a fallback is configured
//   down      it has none and nothing stands behind it
//
// One answer is kept per instance for CACHE_MS, so a burst of reads makes one
// balance call; the route also lets the edge hold it for as long.
// ============================================================

export const CACHE_MS = 3 * 60 * 1000;
const BALANCE_URL = 'https://api.deepseek.com/user/balance';
const CHECK_MS = 5000;

let cached = null;

async function primaryBalance(env, fetchImpl) {
  if (!env.DEEPSEEK_API_KEY) return 'none';
  try {
    const res = await fetchImpl(BALANCE_URL, {
      redirect: 'error',
      headers: { authorization: `Bearer ${env.DEEPSEEK_API_KEY}` },
      signal: AbortSignal.timeout(CHECK_MS),
    });
    if (res.status === 402) return 'empty';
    if (!res.ok) return 'unknown';
    const j = await res.json();
    if (j?.is_available === false) return 'empty';
    return j?.is_available === true ? 'available' : 'unknown';
  } catch {
    return 'unknown';
  }
}

/** The health answer, computed at most once per CACHE_MS in this instance. */
export async function aiHealth({ env = process.env, fetchImpl = fetch, now = Date.now() } = {}) {
  if (cached && now - cached.at < CACHE_MS) return cached.value;
  const balance = await primaryBalance(env, fetchImpl);
  const fallback = !!env.ANTHROPIC_API_KEY;
  const health = balance === 'available' ? 'ok' : fallback ? 'degraded' : 'down';
  const value = {
    health,
    primary: { configured: !!env.DEEPSEEK_API_KEY, balance },
    fallback: { configured: fallback },
    checkedAt: new Date(now).toISOString(),
  };
  cached = { at: now, value };
  return value;
}

/** Tests only. */
export function resetAiHealth() {
  cached = null;
}
