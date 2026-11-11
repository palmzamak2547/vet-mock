// ============================================================
// provider-breaker.js — skip a provider that has said "no balance"
// ============================================================
// On 11 Nov 2026 DeepSeek's account ran below zero and answered 402 for hours.
// Every request still spent its attempts on DeepSeek before Anthropic answered.
// A provider that says it has no balance will say so again on the next request,
// so this remembers it, in this function instance only, for OPEN_MS, and the
// chains in llm.js and ai/writer.js go straight to the next provider meanwhile.
//
// Only a balance answer opens it: a 402, or a 4xx whose body says the balance
// or credit is gone. A 500, a 429, a timeout or a transport error never does,
// so whenever no provider reports an empty balance the chains run as before.
// ============================================================

export const OPEN_MS = 10 * 60 * 1000;

const NO_BALANCE_RE = /insufficient[ _]balance|credit balance is too low/i;
const openUntil = new Map();

/** The provider's own error words ({ error: { message, type } }), never the rest of the
 *  body, so a prompt echoed back in an error cannot open the breaker. */
function errorWords(body) {
  try {
    const e = JSON.parse(String(body || ''))?.error;
    return typeof e === 'string' ? e : [e?.message, e?.type].filter((x) => typeof x === 'string').join(' ');
  } catch {
    return '';
  }
}

/** Whether a provider's error answer means its account has no balance. */
export function isNoBalance(status, body = '') {
  if (status === 402) return true;
  return status >= 400 && status < 500 && status !== 429 && NO_BALANCE_RE.test(errorWords(body));
}

/** True while the provider is being skipped; logs once when the window ends. */
export function breakerOpen(provider, now = Date.now()) {
  const until = openUntil.get(provider);
  if (until == null) return false;
  if (now < until) return true;
  openUntil.delete(provider);
  console.error('[llm] breaker closed', provider, 'trying it again');
  return false;
}

/** Remember that the provider answered "no balance". Logs when it opens. */
export function tripBreaker(provider, status, now = Date.now()) {
  if (!breakerOpen(provider, now)) {
    console.error('[llm] breaker open', provider, status, `skipped for ${OPEN_MS / 60_000} min`);
  }
  openUntil.set(provider, now + OPEN_MS);
}

/** Tests only. */
export function resetBreakers() {
  openUntil.clear();
}
