import { getSupabase } from './supabase.js';

// All cloud-sync calls await getSupabase() so anonymous visitors never
// pay the 190KB SDK download cost — the chunk only fetches once a
// logged-in user actually performs a sync, group, or leaderboard op.

// ==========================================================
// HELPER: Make sure user has a profile (call before ops that need it)
// ==========================================================
async function ensureProfile() {
  const supabase = await getSupabase();
  if (!supabase) return;
  try { await supabase.rpc('ensure_profile'); } catch (e) { /* ignore */ }
}

// ==========================================================
// GROUPS
// ==========================================================
function randomCode(len = 6) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

export async function createGroup(name, userId) {
  await ensureProfile();
  const supabase = await getSupabase();
  const code = randomCode();
  const { data: group, error } = await supabase.from('groups')
    .insert({ name, code, created_by: userId })
    .select().single();
  if (error) throw error;
  await supabase.from('group_members').insert({ group_id: group.id, user_id: userId, role: 'admin' });
  return group;
}

export async function joinGroupByCode(code, userId) {
  await ensureProfile();
  const supabase = await getSupabase();
  const { data: group, error } = await supabase.from('groups')
    .select('*').eq('code', code.toUpperCase()).single();
  if (error) throw new Error('ไม่พบกลุ่มรหัสนี้');
  const { error: err2 } = await supabase.from('group_members')
    .insert({ group_id: group.id, user_id: userId, role: 'member' });
  if (err2 && err2.code !== '23505') throw err2;
  return group;
}

export async function leaveGroup(groupId, userId) {
  const supabase = await getSupabase();
  const { error } = await supabase.from('group_members')
    .delete().eq('group_id', groupId).eq('user_id', userId);
  if (error) throw error;
}

export async function getMyGroups(userId) {
  const supabase = await getSupabase();
  const { data, error } = await supabase.from('group_members')
    .select('group_id, role, groups(id, name, code, created_at)')
    .eq('user_id', userId);
  if (error) throw error;
  return data.map((r) => ({ ...r.groups, role: r.role }));
}

export async function getGroupMembers(groupId) {
  const supabase = await getSupabase();
  const { data, error } = await supabase.from('group_members')
    .select('user_id, role, joined_at, profiles(id, username, avatar_emoji)')
    .eq('group_id', groupId);
  if (error) throw error;
  return data.map((r) => ({ ...r.profiles, role: r.role, joined_at: r.joined_at }));
}

// ==========================================================
// SHARED QUESTIONS
// ==========================================================
export async function shareQuestion(groupId, questionData, authorId, authorName) {
  const supabase = await getSupabase();
  // Sanitize image URLs at the source — group members rendering shared
  // content would leak IP/UA via tracking pixels otherwise. Allow-list
  // logic in src/lib/safe-url.js. Defense-in-depth: same check also runs
  // at every <img src> sink (Question.jsx, ReviewView, SRSessionView).
  const { sanitizeSharedQuestionData } = await import('./safe-url.js');
  const safeData = sanitizeSharedQuestionData(questionData);
  const { data, error } = await supabase.from('shared_questions')
    .insert({ group_id: groupId, author_id: authorId, author_name: authorName, data: safeData })
    .select().single();
  if (error) throw error;
  return data;
}

export async function getSharedQuestions(groupId) {
  const supabase = await getSupabase();
  const { data, error } = await supabase.from('shared_questions')
    .select('*').eq('group_id', groupId).order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function deleteSharedQuestion(id) {
  const supabase = await getSupabase();
  const { error } = await supabase.from('shared_questions').delete().eq('id', id);
  if (error) throw error;
}

// ==========================================================
// EXAM RESULTS (Leaderboard)
// ==========================================================
export async function saveExamResult(result) {
  const supabase = await getSupabase();
  if (!supabase) return;
  const { error } = await supabase.from('exam_results').insert(result);
  if (error) console.error('Save result error:', error);
}

export async function getLeaderboard(groupId = null, limit = 200) {
  const supabase = await getSupabase();
  let query = supabase.from('exam_results')
    .select('id, user_id, mode, subject, total, correct, pct, created_at, profiles(username, avatar_emoji)')
    .order('pct', { ascending: false }).order('correct', { ascending: false });
  if (limit && limit > 0) query = query.limit(limit);
  if (groupId) query = query.eq('group_id', groupId);
  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function getUserStats(userId, limit = 1000) {
  const supabase = await getSupabase();
  let query = supabase.from('exam_results')
    .select('pct, correct, total, mode, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (limit && limit > 0) query = query.limit(limit);
  const { data, error } = await query;
  if (error) throw error;
  return data;
}

// ==========================================================
// CLOUD SYNC (user_data)
// ==========================================================
export async function pullUserData(userId) {
  const supabase = await getSupabase();
  if (!supabase) return null;
  const { data, error } = await supabase.from('user_data')
    .select('*').eq('user_id', userId).maybeSingle();
  if (error) throw error;
  return data;
}

export async function pushUserData(userId, patch) {
  const supabase = await getSupabase();
  if (!supabase) return;
  const { error } = await supabase.from('user_data')
    .upsert({ user_id: userId, ...patch, updated_at: new Date().toISOString() });
  if (error) throw error;
}

// Debounced push (avoid hitting API on every keystroke)
let pushTimer = null;
export function pushUserDataDebounced(userId, patch, delay = 2000) {
  clearTimeout(pushTimer);
  pushTimer = setTimeout(() => {
    pushUserData(userId, patch).catch((e) => console.error('Sync error:', e));
  }, delay);
}

// ==========================================================
// Q COMMENTS — discussion threads per question
// ==========================================================
// q_comments uses compound key (q_subject, q_id) since Q ids alone
// aren't unique across the bank (known dupe-ID issue, see vault).

export async function listQComments(qSubject, qId) {
  const supabase = await getSupabase();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('q_comments')
    .select('id, q_subject, q_id, user_id, body, parent_id, created_at, updated_at, profiles ( username, avatar_emoji )')
    .eq('q_subject', qSubject)
    .eq('q_id', qId)
    .order('created_at', { ascending: true })
    .limit(200);
  if (error) {
    console.warn('[qcomments] list failed:', error.message);
    return [];
  }
  return data || [];
}

export async function postQComment(qSubject, qId, body, userId, parentId = null) {
  await ensureProfile();
  const supabase = await getSupabase();
  if (!supabase) throw new Error('ต้อง login ก่อน');
  const text = String(body || '').trim();
  if (!text) throw new Error('ข้อความว่าง');
  if (text.length > 2000) throw new Error('ยาวเกิน 2000 ตัวอักษร');
  const { data, error } = await supabase
    .from('q_comments')
    .insert({ q_subject: qSubject, q_id: qId, user_id: userId, body: text, parent_id: parentId })
    .select('id, q_subject, q_id, user_id, body, parent_id, created_at, updated_at, profiles ( username, avatar_emoji )')
    .single();
  if (error) throw error;
  return data;
}

export async function deleteQComment(commentId) {
  const supabase = await getSupabase();
  if (!supabase) throw new Error('ต้อง login ก่อน');
  const { error } = await supabase.from('q_comments').delete().eq('id', commentId);
  if (error) throw error;
}

export async function updateQComment(commentId, body) {
  const supabase = await getSupabase();
  if (!supabase) throw new Error('ต้อง login ก่อน');
  const text = String(body || '').trim();
  if (!text) throw new Error('ข้อความว่าง');
  const { data, error } = await supabase
    .from('q_comments')
    .update({ body: text })
    .eq('id', commentId)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// Subscribe to live comment changes for a single question. Returns the
// channel so the caller can `.unsubscribe()` on cleanup.
export async function subscribeQComments(qSubject, qId, onEvent) {
  const supabase = await getSupabase();
  if (!supabase) return null;
  const channel = supabase
    .channel(`qc:${qSubject}:${qId}`)
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'q_comments', filter: `q_subject=eq.${qSubject}` },
      (payload) => {
        // Server-side filter only narrows by subject — final filter on q_id
        // happens here so we don't depend on multi-column filter syntax.
        const row = payload.new || payload.old;
        if (row && row.q_id === qId) onEvent(payload);
      },
    )
    .subscribe();
  return channel;
}

// ==========================================================
// RACE RESULTS — final scores from multiplayer races
// ==========================================================
export async function recordRaceResult(raceCode, userId, subject, questionCount, correctCount, durationMs) {
  await ensureProfile();
  const supabase = await getSupabase();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('race_results')
    .insert({
      race_code: raceCode,
      user_id: userId,
      subject,
      question_count: questionCount,
      correct_count: correctCount,
      duration_ms: durationMs,
    })
    .select()
    .single();
  if (error) {
    console.warn('[race] record failed:', error.message);
    return null;
  }
  return data;
}

export async function listRaceResults(raceCode) {
  const supabase = await getSupabase();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('race_results')
    .select('*, profiles ( username, avatar_emoji )')
    .eq('race_code', raceCode)
    .order('correct_count', { ascending: false })
    .order('duration_ms', { ascending: true })
    .limit(20);
  if (error) return [];
  return data || [];
}
