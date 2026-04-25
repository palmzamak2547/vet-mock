import { supabase } from './supabase.js';

// ==========================================================
// HELPER: Make sure user has a profile (call before ops that need it)
// ==========================================================
async function ensureProfile() {
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
  await ensureProfile();  // ← ensure profile exists first
  const code = randomCode();
  const { data: group, error } = await supabase.from('groups')
    .insert({ name, code, created_by: userId })
    .select().single();
  if (error) throw error;
  // Add creator as admin
  await supabase.from('group_members').insert({ group_id: group.id, user_id: userId, role: 'admin' });
  return group;
}

export async function joinGroupByCode(code, userId) {
  await ensureProfile();  // ← ensure profile exists first
  // Find group by code
  const { data: group, error } = await supabase.from('groups')
    .select('*').eq('code', code.toUpperCase()).single();
  if (error) throw new Error('ไม่พบกลุ่มรหัสนี้');
  // Add as member
  const { error: err2 } = await supabase.from('group_members')
    .insert({ group_id: group.id, user_id: userId, role: 'member' });
  if (err2 && err2.code !== '23505') throw err2; // ignore duplicate
  return group;
}

export async function leaveGroup(groupId, userId) {
  const { error } = await supabase.from('group_members')
    .delete().eq('group_id', groupId).eq('user_id', userId);
  if (error) throw error;
}

export async function getMyGroups(userId) {
  const { data, error } = await supabase.from('group_members')
    .select('group_id, role, groups(id, name, code, created_at)')
    .eq('user_id', userId);
  if (error) throw error;
  return data.map((r) => ({ ...r.groups, role: r.role }));
}

export async function getGroupMembers(groupId) {
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
  const { data, error } = await supabase.from('shared_questions')
    .insert({ group_id: groupId, author_id: authorId, author_name: authorName, data: questionData })
    .select().single();
  if (error) throw error;
  return data;
}

export async function getSharedQuestions(groupId) {
  const { data, error } = await supabase.from('shared_questions')
    .select('*').eq('group_id', groupId).order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function deleteSharedQuestion(id) {
  const { error } = await supabase.from('shared_questions').delete().eq('id', id);
  if (error) throw error;
}

// ==========================================================
// EXAM RESULTS (Leaderboard)
// ==========================================================
export async function saveExamResult(result) {
  const { error } = await supabase.from('exam_results').insert(result);
  if (error) console.error('Save result error:', error);
}

export async function getLeaderboard(groupId = null, limit = 200) {
  // Get top scores - join with profiles to get username
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
  const { data, error } = await supabase.from('user_data')
    .select('*').eq('user_id', userId).maybeSingle();
  if (error) throw error;
  return data;
}

export async function pushUserData(userId, patch) {
  const { error } = await supabase.from('user_data')
    .upsert({ user_id: userId, ...patch, updated_at: new Date().toISOString() });
  if (error) throw error;
}

// Debounced push (to avoid hitting API on every keystroke)
let pushTimer = null;
export function pushUserDataDebounced(userId, patch, delay = 2000) {
  clearTimeout(pushTimer);
  pushTimer = setTimeout(() => {
    pushUserData(userId, patch).catch((e) => console.error('Sync error:', e));
  }, delay);
}
