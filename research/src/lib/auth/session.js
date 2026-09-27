// The owner scope of the current page [M1-DESIGN.md 9.7]. OWNER: runtime role.

/**
 * React hook: 'guest' until a session exists, then 'u.<user id>'. Subscribes to auth changes; the
 * workspace remounts on owner change (key={owner}) so nothing from one owner is shown to another.
 * @returns {{ owner: import('../runtime/types.js').OwnerScope, user: { id: string, email: string|null } | null, ready: boolean }}
 */
export function useOwner() {
  throw new Error('not implemented: auth/session.useOwner');
}
