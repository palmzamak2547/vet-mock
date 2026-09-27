// Storage health shown to the student [M1-DESIGN.md 9.6]. OWNER: runtime role.

/**
 * @returns {Promise<{ mode: 'idb'|'memory', usage: number|null, quota: number|null, persisted: boolean|null, safariEviction: boolean }>}
 *   safariEviction: true on Safari outside an installed web app (seven-day rule), so the UI nudges a download.
 */
export async function storageHealth() {
  throw new Error('not implemented: store/health.storageHealth');
}
