// ============================================================
// account-local-purge — after a confirmed account deletion, the device
// forgets that account too
// ============================================================
// The delete-account function purges the server. Before this, the client
// only signed out, so every answer with its timing, the account's history,
// notes, bookmarks and SR cards, its pending sync operations, the in-flight
// exam and its PDF ink stayed on the device for the next person to use it.
//
// Only stores keyed to this account id are touched. The signed-out
// workspace, other accounts on the same browser, and the device tools in
// local-extras.js (flashcards, image-occlusion decks, pinboard: not keyed to
// any account) are left alone.
//
// The key prefixes mirror src/lib/user-data-sync.js (tests pin them), which
// does not export them and belongs to the sync package.
// ============================================================

const USER_DATA_PREFIXES = ['vmx-user-data-v1:', 'vmx-user-sync-v1:', 'vmx-user-data-v2:', 'vmx-external-docs-v2:'];
const OPERATION_PREFIXES = ['vmx-user-op-v1:', 'vmx-user-intent-v2:'];
const LEGACY_INFLIGHT = 'vmx-inflight-exam';

async function defaults() {
  const [events, pdf] = await Promise.all([import('./study-event-log.js'), import('./pdf-annotations.js')]);
  return {
    storage: typeof window !== 'undefined' ? window.localStorage : null,
    clearStudyEvents: events.clearStudyEvents,
    listRecentPdfs: pdf.listRecentPdfs,
    deleteAnnotations: pdf.deleteAnnotations,
  };
}

/** Returns { ok } — ok is false when any store could not be cleared, so the
 *  caller can say so rather than claim the device is clean. */
export async function purgeLocalAccountData(userId, deps = {}) {
  if (!userId) return { ok: false };
  const d = { ...(await defaults().catch(() => ({}))), ...deps };
  let ok = true;

  try {
    const storage = d.storage;
    const id = encodeURIComponent(userId);
    const exact = new Set([...USER_DATA_PREFIXES.map((p) => `${p}${id}`), `vmx-inflight-exam:user:${userId}`]);
    const ops = OPERATION_PREFIXES.map(prefix => `${prefix}${id}:`);
    const doomed = [];
    for (let i = 0; i < storage.length; i++) {
      const key = storage.key(i);
      if (exact.has(key) || (key && ops.some(prefix => key.startsWith(prefix)))) doomed.push(key);
    }
    try {
      const legacy = JSON.parse(storage.getItem(LEGACY_INFLIGHT) || 'null');
      if (legacy && legacy.ownerId === userId) doomed.push(LEGACY_INFLIGHT);
    } catch { /* an unreadable legacy row is not provably this account's */ }
    for (const key of doomed) storage.removeItem(key);
  } catch { ok = false; }

  try {
    const cleared = await d.clearStudyEvents(userId);
    if (!cleared?.ok) ok = false;
  } catch { ok = false; }

  try {
    const docs = await d.listRecentPdfs(userId);
    for (const doc of docs || []) {
      const res = await d.deleteAnnotations(doc.hash, userId);
      if (res && res.ok === false) ok = false;
    }
  } catch { ok = false; }

  return { ok };
}
