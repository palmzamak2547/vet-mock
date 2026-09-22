// Compare-and-set write of the owner's user_data row.
//
// The sync engine re-reads the row before every write and rebases its own
// edits onto what it read. An unconditional upsert let a second device, which
// had read the same row a moment earlier, replace the first device's write
// after both had said "synced". This write names the updated_at it read: when
// another device has written since, no row matches, nothing is written, and
// the engine re-reads and tries again.
//
// No schema change. Clients from before this change keep their upsert; each of
// their writes still moves updated_at, so these writes notice them.
//
// Pure (no import.meta.env), so it runs under node --test.

export const SYNC_CONFLICT = 'SYNC_CONFLICT';

function conflict() {
  return Object.assign(new Error('user_data changed since it was read'), { code: SYNC_CONFLICT });
}

/** A write token strictly later than the one it replaces, so a row's
 *  updated_at never returns to a value another device is still holding. The
 *  expected value is compared as the RAW string PostgREST returned (some rows
 *  carry microseconds); it is parsed only to order the new one. */
export function nextSyncToken(expectedUpdatedAt, nowMs = Date.now()) {
  const prior = Date.parse(expectedUpdatedAt ?? '');
  return new Date(Number.isFinite(prior) ? Math.max(nowMs, prior + 1) : nowMs).toISOString();
}

/** precondition = { rowExists, expectedUpdatedAt } from the read that the
 *  payload was rebased on. Resolves { updatedAt } or rejects with code
 *  SYNC_CONFLICT when the row is no longer the one that was read. */
export async function casWriteUserData(supabase, userId, patch, precondition, nowMs = Date.now()) {
  const updated_at = nextSyncToken(precondition?.expectedUpdatedAt, nowMs);
  if (!precondition?.rowExists) {
    const { data, error } = await supabase.from('user_data')
      .insert({ ...patch, user_id: userId, updated_at })
      .select('updated_at');
    if (error?.code === '23505') throw conflict();   // another device created it first
    if (error) throw error;
    return { updatedAt: data?.[0]?.updated_at ?? updated_at };
  }
  let query = supabase.from('user_data')
    .update({ ...patch, updated_at })
    .eq('user_id', userId);
  query = precondition.expectedUpdatedAt == null
    ? query.is('updated_at', null)
    : query.eq('updated_at', precondition.expectedUpdatedAt);
  const { data, error } = await query.select('updated_at');
  if (error) throw error;
  if (!Array.isArray(data) || data.length === 0) throw conflict();
  return { updatedAt: data[0].updated_at };
}
