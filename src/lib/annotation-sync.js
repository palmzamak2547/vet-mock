// ============================================================
// annotation-sync — the same pen marks on every device
// ============================================================
//
// Ordering rule, inherited from lib/user-data-sync.js: IndexedDB is the
// immediate source of truth and a failed remote write never discards a local
// change. Nothing here is allowed to block, slow or fail the act of drawing.
//
// The merge itself lives in pdf-annotations.js (`mergeRecords`) and is a
// two-phase set — union of strokes by id, minus the union of tombstones. It is
// commutative, associative and idempotent, so:
//
//   • it does not matter which device syncs first
//   • merging the same pair twice changes nothing
//   • two iPads annotating the same deck on a plane both keep their work
//
// There is no server-side reconciliation and no "latest version wins" — which
// is the point, because last-write-wins on a jsonb column would quietly throw
// away whichever afternoon of notes arrived second.
//
// Signed out, none of this runs and the reader behaves exactly as it did
// before sync existed: local, private, complete.

import { annotationKey, mergeRecords, putRecord, peekAnnotations } from './pdf-annotations.js';

const TABLE = 'pdf_annotations';
const PUSH_DEBOUNCE_MS = 4000;
// Postgres will take a much larger jsonb than this, but a student on mobile
// data should not have a 20 MB body pushed out from under them every few
// seconds. Past the cap the document stays local and says so, rather than
// half-syncing.
const MAX_PUSH_BYTES = 4 * 1024 * 1024;

const pushTimers = new Map(); // qualified document key -> captured owner/record
const states = new Map();
const listeners = new Set();

function setState(status, extra = {}, ownerId = null) {
  const state = { status, at: Date.now(), ...extra };
  states.set(ownerId, state);
  for (const item of listeners) {
    if (item.ownerId === ownerId) { try { item.fn(state); } catch { /* listener isolation */ } }
  }
}

export function syncState(ownerId = null) { return states.get(ownerId) || { status: 'off', at: 0 }; }
export function onSyncState(fn, ownerId = null) {
  const item = { fn, ownerId };
  listeners.add(item);
  return () => listeners.delete(item);
}

// Resolves to a client only when there is a real session. Deliberately does
// NOT trigger a login, and deliberately does not import the Supabase SDK until
// something actually wants to sync — the reader must stay fast for the many
// people who are not signed in.
async function authed() {
  try {
    const { getSupabase, hasSupabase } = await import('./supabase.js');
    if (!hasSupabase) return null;
    const sb = await getSupabase();
    const { data: { session } = {} } = await sb.auth.getSession();
    return session?.user ? { sb, userId: session.user.id } : null;
  } catch {
    return null;
  }
}

/** A record's identity for sync purposes: which strokes exist and which are
 *  tombstoned. Two records with the same signature need no push between them
 *  — comparing this is what stops live sync ping-ponging: device A pushes,
 *  the event reaches device B, B pulls and merges, and because the merge
 *  changed nothing relative to the remote copy B stays quiet instead of
 *  pushing an identical record back and waking A again. */
export function recSig(rec) {
  const ids = [];
  const pages = rec?.strokesByPage || {};
  for (const page of Object.keys(pages)) {
    for (const st of pages[page] || []) if (st?.id) ids.push(st.id);
  }
  ids.sort();
  const tombs = [...(rec?.deleted || [])].sort();
  return `${ids.join(',')}|${tombs.join(',')}`;
}

/** Merges whatever the account already holds for this document into the local
 *  record, and returns the merged record (or the local one unchanged). Safe to
 *  call on every open; safe to call when signed out. */
export async function pullAndMerge(hash, local, ownerId = null) {
  if (!hash) return local;
  if (!ownerId || (local && local.ownerId !== ownerId)) return local;
  const conn = await authed();
  if (!conn || conn.userId !== ownerId) { setState('off', {}, ownerId); return local; }
  setState('syncing', {}, ownerId);
  try {
    const { data, error } = await conn.sb
      .from(TABLE)
      .select('data')
      .eq('user_id', ownerId)
      .eq('doc_hash', hash)
      .maybeSingle();
    if (error) { setState('error', { reason: error.message }, ownerId); return local; }
    if (!data?.data) {
      // Nothing on the account yet. Push what this device has so the next
      // device to open the document starts from it.
      setState('idle', {}, ownerId);
      if (local) schedulePush(hash, local, ownerId);
      return local;
    }
    const remote = { ...data.data, hash, ownerId };
    const merged = mergeRecords(local, remote);
    const saved = await putRecord(merged, ownerId);
    const current = saved.record || peekAnnotations(hash, ownerId) || merged;
    setState(saved.ok ? 'idle' : 'error', saved.ok ? {} : { reason: 'บันทึกลายเส้นในเครื่องไม่สำเร็จ' }, ownerId);
    // Push only when the merge holds something the remote copy does not —
    // an unconditional push here would echo forever once live sync delivers
    // every push back to this device as an event.
    if (recSig(current) !== recSig(remote)) schedulePush(hash, current, ownerId);
    return current;
  } catch (e) {
    setState('error', { reason: String(e?.message || e) }, ownerId);
    return local;
  }
}

/** Debounced upload. Called from the same places that autosave locally, so a
 *  push can never be the reason a stroke is lost: the local write already
 *  happened before this is reached. */
export function schedulePush(hash, rec, ownerId = null) {
  if (!hash || !rec || !ownerId || rec.ownerId !== ownerId) return;
  const key = annotationKey(hash, ownerId);
  clearTimeout(pushTimers.get(key)?.timer);
  const timer = setTimeout(() => { pushNow(hash, rec, ownerId).catch(() => {}); }, PUSH_DEBOUNCE_MS);
  pushTimers.set(key, { hash, ownerId, rec, timer });
}

export async function pushNow(hash, recArg, ownerId = null) {
  const rec = recArg || peekAnnotations(hash, ownerId);
  if (!hash || !rec) return { ok: false };
  const key = annotationKey(hash, ownerId);
  clearTimeout(pushTimers.get(key)?.timer);
  pushTimers.delete(key);
  if (!ownerId || rec.ownerId !== ownerId) return { ok: false, reason: 'owner-mismatch' };
  const conn = await authed();
  if (!conn || conn.userId !== ownerId) {
    setState('off', {}, ownerId);
    return { ok: false, reason: 'signed-out' };
  }

  const payload = {
    fileName: rec.fileName,
    pageCount: rec.pageCount,
    strokesByPage: rec.strokesByPage || {},
    deleted: rec.deleted || [],
    lastPage: rec.lastPage ?? 1,
    lastOpened: rec.lastOpened || Date.now(),
  };
  const body = JSON.stringify(payload);
  const byteLength = new TextEncoder().encode(body).byteLength;
  if (byteLength > MAX_PUSH_BYTES) {
    setState('too-big', { bytes: byteLength }, ownerId);
    return { ok: false, reason: 'too-big' };
  }

  setState('syncing', {}, ownerId);
  try {
    const { error } = await conn.sb.from(TABLE).upsert({
      user_id: ownerId,
      doc_hash: hash,
      data: payload,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id,doc_hash' });
    if (error) { setState('error', { reason: error.message }, ownerId); return { ok: false }; }
    setState('idle', {}, ownerId);
    return { ok: true };
  } catch (e) {
    setState('error', { reason: String(e?.message || e) }, ownerId);
    return { ok: false };
  }
}

/**
 * Live channel: notifies when THIS user's row for this document changes on
 * the server (their other iPad, their laptop). The event is treated as a
 * PING only — realtime may truncate a large jsonb payload, so the caller
 * re-pulls through pullAndMerge, which reads the full row and merges safely.
 * postgres_changes is RLS-filtered, so no one hears about anyone else's ink.
 *
 * Returns a cleanup function; resolves to a no-op when signed out.
 */
export async function subscribeLive(hash, onRemoteChange, ownerId = null) {
  if (!hash || !ownerId || typeof onRemoteChange !== 'function') return () => {};
  const conn = await authed();
  if (!conn || conn.userId !== ownerId) return () => {};
  try {
    const channel = conn.sb
      .channel(`pdf-ann-${ownerId}-${hash}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: TABLE,
        filter: `doc_hash=eq.${hash}`,
      }, () => { try { onRemoteChange(); } catch { /* a listener must not break sync */ } })
      .subscribe();
    return () => { try { conn.sb.removeChannel(channel); } catch { /* leaving anyway */ } };
  } catch {
    return () => {};
  }
}

/** Flush every pending push immediately — for the way out of the reader. */
export function flushPushes(ownerId = null) {
  const pending = [];
  for (const [key, entry] of pushTimers) {
    if (entry.ownerId !== ownerId) continue;
    clearTimeout(entry.timer);
    pushTimers.delete(key);
    pending.push(pushNow(entry.hash, peekAnnotations(entry.hash, ownerId) || entry.rec, ownerId));
  }
  return Promise.allSettled(pending);
}
