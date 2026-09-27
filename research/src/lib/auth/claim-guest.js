// On first sign-in in this browser, guest projects move into the account automatically, and the
// move is written to each project's log (research-m1-brief.md decision 11) [M1-DESIGN.md 9.7].
// One readwrite transaction per project: re-key projects, datasets, blocks, analyses and log from
// 'guest/...' to 'u.<id>/...'. OWNER: runtime role.

/**
 * @param {import('../store/db.js').ResearchDb} db
 * @param {`u.${string}`} owner
 * @returns {Promise<{ moved: number }>}
 */
export async function claimGuestProjects(db, owner) { void db; void owner; throw new Error('not implemented: auth/claim-guest.claimGuestProjects'); }
