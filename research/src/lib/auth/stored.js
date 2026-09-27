// The account this device last kept a session for, read from the auth client's own storage entry
// without loading the auth client (the landing uses it too). OWNER: runtime role.

/** The key the auth client keeps its session under (client.js storageKey). */
export const AUTH_STORAGE_KEY = 'vmx-research-auth';

/** @returns {string|null} the stored session's user id */
export function storedUserId(storage = globalThis.localStorage) {
  try {
    const raw = storage?.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    const j = JSON.parse(raw);
    const id = j?.user?.id ?? j?.currentSession?.user?.id ?? null;
    return typeof id === 'string' ? id : null;
  } catch {
    return null;
  }
}

/** The owner scope this device would open as, from the stored session alone ('guest' without one). */
export function storedOwner(storage = globalThis.localStorage) {
  const id = storedUserId(storage);
  return id && /^[0-9a-f-]{8,64}$/i.test(id) ? `u.${id}` : 'guest';
}
