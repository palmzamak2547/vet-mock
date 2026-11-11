// ============================================================
// identity-write.js — the one write path for a public name and picture
// ============================================================
// Its own module so the screens that edit an identity (all lazy) carry it,
// not the first-load supabase helpers every visit downloads.
// ============================================================

import { getSupabase } from './supabase.js';
import { compactName } from './public-identity.js';

// The same signal lib/supabase.js sends after any auth change: useAuth
// re-reads the session (and so the metadata) when it hears it.
function notifyAuthChanged() {
  if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('vmx-auth-changed'));
}

// ─── A student's public name and picture: the one write path ─────
// Every screen that shows a student to others reads profiles.username and
// profiles.avatar_emoji (header, hub, leaderboard, groups, comments, the
// online list). So the choice is written THERE, first, and only then
// mirrored into user_metadata, which the leaderboard RPCs read for the board
// choice (show_on_leaderboard) and the first-run step reads to stay away.
// Until 5.x the picture went to metadata only and no screen ever showed it.
//
// The update carries only the two columns members may write (column grant
// `update (username, avatar_emoji)`, policy own row USING and WITH CHECK
// auth.uid() = id); never the primary key. A refusal from the database
// (unique name, length check, policy) is thrown with its code, so the caller
// shows identityWriteError(err) rather than a guess.
//
// Order: when the student chooses to be hidden, the metadata (which the
// boards read) is written FIRST, so a failure in between can never leave a
// renamed student on the board; otherwise the profile row comes first. The
// session's account must still be the one the editor was opened for
// (`expectUserId`), and ensure_profile runs first so a missing row is made
// rather than failing as a generic error.
//
// Returns { profile, metaSaved }: metaSaved is false when the profile row
// was saved but the metadata mirror was not (the board choice then did not
// change, and the caller says so).
export async function saveIdentity({ username, avatarEmoji, showOnLeaderboard, introDone = true, expectUserId = null } = {}) {
  const supabase = await getSupabase();
  if (!supabase) throw new Error('Supabase not configured');
  const { data: sess } = await supabase.auth.getSession();
  const userId = sess?.session?.user?.id;
  if (!userId) throw Object.assign(new Error('not signed in'), { code: 'not_signed_in' });
  if (expectUserId && expectUserId !== userId) throw Object.assign(new Error('account changed'), { code: 'session_changed' });
  const patch = {};
  if (typeof username === 'string' && username) patch.username = username;
  if (typeof avatarEmoji === 'string' && avatarEmoji) patch.avatar_emoji = avatarEmoji;
  const meta = {};
  if (patch.username) meta.username = patch.username;
  if (patch.avatar_emoji) meta.avatar_emoji = patch.avatar_emoji;
  if (typeof showOnLeaderboard === 'boolean') meta.show_on_leaderboard = showOnLeaderboard;
  if (introDone) meta.identity_intro_done = true;

  const writeMeta = async () => {
    if (!Object.keys(meta).length) return true;
    const { error } = await supabase.auth.updateUser({ data: meta });
    if (!error) notifyAuthChanged();
    return !error;
  };
  const writeProfile = async () => {
    if (!Object.keys(patch).length) return null;
    try { await supabase.rpc('ensure_profile'); } catch { /* the update below reports */ }
    const { data, error } = await supabase
      .from('profiles')
      .update(patch)
      .eq('id', userId)
      .select('id, username, avatar_emoji, created_at')
      .single();
    if (error) throw error;
    return data;
  };

  if (showOnLeaderboard === false) {
    // Hidden first: a refused metadata write stops here, before any rename.
    const ok = await writeMeta();
    if (!ok) throw Object.assign(new Error('could not hide'), { code: 'meta_failed' });
    const profile = await writeProfile();
    return { profile, metaSaved: true };
  }
  const profile = await writeProfile();
  const metaSaved = await writeMeta();
  return { profile, metaSaved };
}

/** Whether no other member holds this name, ignoring case (the database's
 *  unique index is exact, so "Ping" and "ping" could both be taken there).
 *  true free, false taken, null unknown. */
export async function isPublicNameFree(name, selfId) {
  const supabase = await getSupabase();
  if (!supabase || !name) return null;
  // One wildcard (_) for every letter that has a look-alike, so "Somchal"
  // finds "SomchaI"; the candidates are then compared in compactName form.
  const pattern = [...String(name)].map((c) => (/[il1|o0]/i.test(c) ? '_' : /[\%_]/.test(c) ? `\${c}` : c)).join('');
  let query = supabase.from('profiles').select('id, username').ilike('username', pattern).limit(20);
  if (selfId) query = query.neq('id', selfId);
  const { data, error } = await query;
  if (error) return null;
  const mine = compactName(name);
  return !(data || []).some((row) => compactName(row.username) === mine);
}

/**
 * Add to the account's carried XP (lib/xp.js): quest points to `xp_quests`
 * (added on top of the account's current copy, read just before writing)
 * and this device's one-time carry to `xp_carry[device]` (set, not added, so
 * writing it twice is the same). Only the student's own metadata is written.
 * Returns the new metadata, or null when it could not be written.
 */
export async function writeAccountXp({ addQuests = 0, carry = null } = {}) {
  const add = Math.max(0, Math.floor(Number(addQuests) || 0));
  if (!add && !carry) return null;
  const supabase = await getSupabase();
  if (!supabase) return null;
  const { data: fresh, error: readError } = await supabase.auth.getUser();
  if (readError || !fresh?.user) return null;
  const md = fresh.user.user_metadata || {};
  const data = {};
  if (add) data.xp_quests = Math.max(0, Math.floor(Number(md.xp_quests) || 0)) + add;
  if (carry) {
    const prior = md.xp_carry && typeof md.xp_carry === 'object' ? md.xp_carry : {};
    data.xp_carry = { ...prior, [carry.device]: Math.max(0, Math.floor(Number(carry.value) || 0)) };
  }
  const { data: saved, error } = await supabase.auth.updateUser({ data });
  if (error) return null;
  notifyAuthChanged();
  return saved?.user?.user_metadata || { ...md, ...data };
}
