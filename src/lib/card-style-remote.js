// ============================================================
// card-style-remote.js: the card style classmates see
// ============================================================
// profiles.card_style arrives with a reviewed migration
// (supabase/migrations/20261116150000_profiles_card_style.sql), applied by
// hand after this release ships. Until then the column is not there, so the
// app never names it in a query: it reads and writes only through the two
// functions the same file adds,
//   card_styles(p_ids uuid[]) -> (id, card_style)   classmates' styles
//   set_card_style(p_style text) -> boolean         the student's own
// A database without them answers "function not found" (PGRST202, or 404).
// That answer is remembered for the session: no second call, every
// classmate shows the default card, and the student's own style stays on
// this device and says so. Any other failure is a failure to save, said as
// one, and is tried again on the next change.
// ============================================================

import { parseCardToken } from './card-style.js';

// Loaded when first asked, so a test or a screen that never saves pays nothing.
const getSupabase = async () => (await import('./supabase.js')).getSupabase();

let absent = false;

/** True once the database has said it has no card styles yet. */
export const cardStylesAbsent = () => absent;

/** For tests: forget what the database said. */
export function resetCardStyleRemote() { absent = false; }

function isMissingFunction(error) {
  if (!error) return false;
  const code = String(error.code || '');
  const status = Number(error.status || 0);
  return code === 'PGRST202' || code === '42883' || status === 404
    || /could not find the function/i.test(String(error.message || ''));
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Classmates' card tokens by id. Only valid tokens are kept; a database
 * without card styles, or any error, gives an empty map (default cards).
 */
export async function fetchCardStyles(ids, { client = null } = {}) {
  const wanted = [...new Set((Array.isArray(ids) ? ids : []).filter((id) => typeof id === 'string' && UUID.test(id)))].slice(0, 200);
  const out = new Map();
  if (absent || wanted.length === 0) return out;
  let supabase = client;
  try { supabase = supabase || await getSupabase(); } catch { return out; }
  if (!supabase) return out;
  try {
    const { data, error } = await supabase.rpc('card_styles', { p_ids: wanted });
    if (error) {
      if (isMissingFunction(error)) absent = true;
      return out;
    }
    for (const row of Array.isArray(data) ? data : []) {
      if (row && typeof row.id === 'string' && parseCardToken(row.card_style)) out.set(row.id, row.card_style);
    }
  } catch { /* offline or blocked: default cards */ }
  return out;
}

/**
 * Save the student's own style for classmates.
 * 'saved'   the database holds it
 * 'device'  the database has no card styles yet (kept on this device)
 * 'offline' no connection; try again when it is back
 * 'failed'  the database refused or did not answer
 */
export async function saveCardStyle(token, { client = null, online = typeof navigator === 'undefined' ? true : navigator.onLine !== false } = {}) {
  if (!parseCardToken(token)) return 'failed';
  if (absent) return 'device';
  if (!online) return 'offline';
  let supabase = client;
  try { supabase = supabase || await getSupabase(); } catch { return 'failed'; }
  if (!supabase) return 'device';
  try {
    const { data, error } = await supabase.rpc('set_card_style', { p_style: token });
    if (error) {
      if (isMissingFunction(error)) { absent = true; return 'device'; }
      return 'failed';
    }
    return data === false ? 'failed' : 'saved';
  } catch {
    return 'failed';
  }
}
