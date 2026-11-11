// ============================================================
// identity-write.js — the one write path for a public name and picture
// ============================================================
// Its own module so the screens that edit an identity (all lazy) carry it,
// not the first-load supabase helpers every visit downloads.
// ============================================================

import { getSupabase } from './supabase.js';

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
// Returns { profile, metaSaved }: metaSaved is false when the profile row
// was saved but the metadata mirror was not (the board choice then did not
// change, and the caller says so).
export async function saveIdentity({ username, avatarEmoji, showOnLeaderboard, introDone = true } = {}) {
  const supabase = await getSupabase();
  if (!supabase) throw new Error('Supabase not configured');
  const { data: sess } = await supabase.auth.getSession();
  const userId = sess?.session?.user?.id;
  if (!userId) throw Object.assign(new Error('not signed in'), { code: 'not_signed_in' });
  const patch = {};
  if (typeof username === 'string' && username) patch.username = username;
  if (typeof avatarEmoji === 'string' && avatarEmoji) patch.avatar_emoji = avatarEmoji;
  let profile = null;
  if (Object.keys(patch).length) {
    const { data, error } = await supabase
      .from('profiles')
      .update(patch)
      .eq('id', userId)
      .select('id, username, avatar_emoji, created_at')
      .single();
    if (error) throw error;
    profile = data;
  }
  const meta = {};
  if (patch.username) meta.username = patch.username;
  if (patch.avatar_emoji) meta.avatar_emoji = patch.avatar_emoji;
  if (typeof showOnLeaderboard === 'boolean') meta.show_on_leaderboard = showOnLeaderboard;
  if (introDone) meta.identity_intro_done = true;
  let metaSaved = true;
  if (Object.keys(meta).length) {
    const { error } = await supabase.auth.updateUser({ data: meta });
    metaSaved = !error;
    if (!error) notifyAuthChanged();
  }
  return { profile, metaSaved };
}

/** Whether no other member holds this name, ignoring case (the database's
 *  unique index is exact, so "Ping" and "ping" could both be taken there).
 *  true free, false taken, null unknown. */
export async function isPublicNameFree(name, selfId) {
  const supabase = await getSupabase();
  if (!supabase || !name) return null;
  const pattern = String(name).replace(/[\\%_]/g, (c) => `\\${c}`);
  let query = supabase.from('profiles').select('id').ilike('username', pattern).limit(1);
  if (selfId) query = query.neq('id', selfId);
  const { data, error } = await query;
  if (error) return null;
  return (data || []).length === 0;
}
