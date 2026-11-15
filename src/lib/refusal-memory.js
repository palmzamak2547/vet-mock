// How long the library keeps a refusal from the sign-in wall before asking
// again. Remembered only for a signed-out browser (a signed-in member is never
// held refused), forgotten on any auth event (sign-in, token refresh,
// sign-out) and on the student's own retry, and expired by itself after a
// minute, so nothing waits for a reload. Pure, so it is tested directly.
export const REFUSAL_TTL_MS = 60_000;

export function createRefusalMemory({ ttl = REFUSAL_TTL_MS, now = () => Date.now() } = {}) {
  let at = 0;
  return {
    /** Keep a refusal; false (nothing kept) for a signed-in account. */
    remember(signedIn) {
      if (signedIn) { at = 0; return false; }
      at = now();
      return true;
    },
    /** True once a kept refusal is older than ttl; it is then dropped. */
    expired() {
      if (!at || now() - at <= ttl) return false;
      at = 0;
      return true;
    },
    held: () => at !== 0,
    forget() { const was = at !== 0; at = 0; return was; },
  };
}
