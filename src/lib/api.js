import { getSupabase } from './supabase.js';
import { normalizeUserDataRow } from './user-data-row.js';
import { LEADERBOARD_MIN_QUESTIONS } from './leaderboard-gate.js';
import { thaiError } from './errors.js';

// All cloud-sync calls await getSupabase() so anonymous visitors never
// pay the 190KB SDK download cost — the chunk only fetches once a
// logged-in user actually performs a sync, group, or leaderboard op.
//
// Static imports above: row normalization + curriculum are tiny utility
// modules already in the main bundle (statically imported by main.jsx
// and most views) — using top-level static imports here avoids Vite's
// "dynamic import will not move module into another chunk" warnings.

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
function rpcRow(data) {
  const row = Array.isArray(data) ? data[0] : data;
  return row?.id ? row : null;
}

export async function createGroup(name, _userId) {
  await ensureProfile();
  const supabase = await getSupabase();
  if (!supabase) throw new Error('ต้อง login ก่อน');
  // Atomic server-side creation binds created_by + the admin membership to
  // auth.uid(). The old two-request flow trusted a caller-supplied userId and
  // could leave an orphan group if membership insertion failed.
  const { data, error } = await supabase.rpc('create_study_group', {
    group_name: String(name || '').trim(),
  });
  if (error) throw error;
  const group = rpcRow(data);
  if (!group) throw new Error('สร้างกลุ่มไม่สำเร็จ');
  return group;
}

export async function joinGroupByCode(code, _userId) {
  await ensureProfile();
  const supabase = await getSupabase();
  if (!supabase) throw new Error('ต้อง login ก่อน');
  // The RPC verifies the invite and inserts the membership in one
  // transaction. Group UUIDs and role values are no longer client authority.
  const { data, error } = await supabase.rpc('join_study_group', {
    invite_code: String(code || '').trim().toUpperCase(),
  });
  if (error) throw new Error('ไม่พบกลุ่มรหัสนี้');
  const group = rpcRow(data);
  if (!group) throw new Error('ไม่พบกลุ่มรหัสนี้');
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
  // Two queries, joined here, because there is no relationship to embed:
  // group_members' foreign keys go to auth.users and groups, never to
  // profiles, so asking PostgREST for `profiles(...)` answered 400 PGRST200
  // and the member list was empty for every group that ever existed.
  // Adding the missing key would also work, but it would have to hold for
  // every historical row on a live database; reading the two tables cannot
  // fail that way. profiles is readable by design (username and emoji only),
  // so the second query returns the other members, not just the caller.
  const { data: rows, error } = await supabase.from('group_members')
    .select('user_id, role, joined_at')
    .eq('group_id', groupId);
  if (error) throw error;
  const ids = [...new Set((rows || []).map((r) => r.user_id).filter(Boolean))];
  let byId = new Map();
  if (ids.length) {
    const { data: people, error: peopleErr } = await supabase.from('profiles')
      .select('id, username, avatar_emoji')
      .in('id', ids);
    if (peopleErr) throw peopleErr;
    byId = new Map((people || []).map((p) => [p.id, p]));
  }
  // A member whose profile row is missing is still a member: show them rather
  // than dropping them from the count.
  return (rows || []).map((r) => ({
    ...(byId.get(r.user_id) || { id: r.user_id, username: null, avatar_emoji: null }),
    role: r.role,
    joined_at: r.joined_at,
  }));
}

/** A study group's board. Nothing writes exam_results.group_id (record_exam_receipt
 *  has no such column and no exam flow carries a group), so a group_id query
 *  could never rank anyone. The group board is the verified global board
 *  narrowed to the group's members (lib/group-board.js): same 5-question
 *  floor, same show_on_leaderboard choice. Its own member-id read keeps it
 *  independent of the members tab's request. */
export async function getGroupLeaderboard(groupId) {
  if (!groupId) return [];
  const supabase = await getSupabase();
  const [{ groupBoardRows, GROUP_BOARD_SOURCE_LIMIT }, members] = await Promise.all([
    import('./group-board.js'),
    supabase.from('group_members').select('user_id').eq('group_id', groupId),
  ]);
  if (members.error) throw members.error;
  const ids = (members.data || []).map((row) => row.user_id);
  if (!ids.length) return [];
  const board = await getLeaderboard({ scoreSource: 'server', limit: GROUP_BOARD_SOURCE_LIMIT });
  return groupBoardRows(ids, board);
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

// shared_questions.data is JSON another member wrote (the app has no share
// action yet, so today only a direct API insert can put a row there), and it
// was handed to the page exactly as stored: one row whose tags was a string
// blanked the whole Shared Q tab with "q.data.tags.map is not a function".
// The question text decides whether a row can be shown; the fields around it
// are made safe rather than fatal. A row that cannot be shown is kept and
// flagged, so the list stays honest and its author can still delete it.
export function readSharedQuestion(row) {
  const data = row?.data;
  const readable = !!data && typeof data === 'object' && !Array.isArray(data)
    && typeof data.q === 'string' && data.q.trim() !== '';
  if (!readable) return { ...row, invalid: true };
  return {
    ...row,
    invalid: false,
    data: {
      ...data,
      subject: typeof data.subject === 'string' && data.subject ? data.subject : null,
      tags: Array.isArray(data.tags) ? data.tags.filter((t) => typeof t === 'string' && t.trim() !== '') : [],
    },
  };
}

export async function getSharedQuestions(groupId) {
  const supabase = await getSupabase();
  const { data, error } = await supabase.from('shared_questions')
    .select('*').eq('group_id', groupId).order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []).map(readSharedQuestion);
}

export async function deleteSharedQuestion(id) {
  const supabase = await getSupabase();
  const { error } = await supabase.from('shared_questions').delete().eq('id', id);
  if (error) throw error;
}

// ==========================================================
// EXAM RESULTS (Leaderboard)
// ==========================================================
// Year/phase scoping — Palm directive 2026-05-18 data-layer audit.
// exam_results table got year+phase columns + backfill (migration
// year_phase_columns_and_backfill). Writes go through here so the
// columns get populated; reads optionally filter by year (per Palm
// Q2=C, user-toggle).

// ── Double-submit guard ─────────────────────────────────────
// Palm bug 2026-05-24: leaderboard surfaced a near-duplicate row
// (user_id 03df... / com5 / pct 50 / two rows 12.77 SECONDS apart).
// Root cause class: React StrictMode double-invoke OR client-side
// retry storm OR user double-tap "Submit" before the first save
// resolves. The DB had no unique constraint (rule 12 of STABILITY.md
// covers why a strict UNIQUE breaks legitimate edge cases — replay,
// retry-after-network-blip, etc.).
//
// This guard collapses identical writes within a short window
// (5 seconds default) into ONE insert. The signature key is the
// deterministic part of the result: user_id + mode + subject + total
// + correct + pct. If a second save arrives within the window with
// the same signature, we return the in-flight promise instead of
// hitting the DB again.
//
// Defense-in-depth: even with this guard, the DB has 2 FKs on
// exam_results.user_id (auth.users + profiles) plus RLS, so a true
// adversarial flood still bounces at the auth layer.
const _saveDedupeMap = new Map(); // key → { promise, ts }
const SAVE_DEDUPE_WINDOW_MS = 5000;
function _saveSignature(r) {
  if (!r || typeof r !== 'object') return null;
  if (r.id) return `${r.user_id}|${r.id}`;
  return [
    r.user_id || '',
    r.mode || '',
    r.subject || '',
    r.total ?? '',
    r.correct ?? '',
    r.pct ?? '',
  ].join('|');
}
function _purgeStaleSaves(now) {
  for (const [key, val] of _saveDedupeMap) {
    if (now - val.ts > SAVE_DEDUPE_WINDOW_MS) _saveDedupeMap.delete(key);
  }
}

export async function saveExamResult(result) {
  const supabase = await getSupabase();
  if (!supabase) throw new Error('ยังเชื่อมต่อบัญชีไม่ได้ ผลสอบยังรอส่งอยู่');
  if (Array.isArray(result.question_ids)) {
    const { data: { session } = {} } = await supabase.auth.getSession();
    if (session?.user?.id !== result.user_id) throw new Error('กรุณาเข้าสู่บัญชีเดิมเพื่อส่งผลสอบ');
    const response = await fetch('/api/exam-result', {
      method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}` },
      body: JSON.stringify(result), signal: AbortSignal.timeout(30000),
    });
    const receipt = await response.json().catch(() => null);
    if (!response.ok || receipt?.ok !== true || receipt.id !== result.id) {
      const error = new Error(receipt?.error === 'result_conflict'
        ? 'ชุดนี้ถูกส่งจากอีกแท็บด้วยคำตอบต่างกันแล้ว กรุณาสำรองผลชุดนี้'
        : 'ผลสอบยังรอส่ง ระบบจะลองใหม่เมื่อเชื่อมต่อได้');
      error.retryAfter = Number(receipt?.retryAfter) || 0;
      // The outbox sets aside a result the server refuses for good (400, 409,
      // 413) so it cannot hold every later result on the device.
      error.status = response.ok ? 0 : response.status;
      throw error;
    }
    return receipt;
  }
  const sig = _saveSignature(result);
  const now = Date.now();
  if (sig) {
    _purgeStaleSaves(now);
    const inflight = _saveDedupeMap.get(sig);
    if (inflight && now - inflight.ts < SAVE_DEDUPE_WINDOW_MS) {
      // Same result already saving / just saved — return the
      // existing promise so callers get the same resolution.
      return inflight.promise;
    }
  }
  const promise = (async () => {
    const { question_ids: _ids, answers: _answers, question_versions: _versions, ...row } = result;
    const { error } = await supabase.from('exam_results').insert(row).abortSignal(AbortSignal.timeout(15_000));
    if (error?.code === '23505' && result.id) {
      // An offline retry after a lost response must acknowledge the same run,
      // not insert it twice or accept a colliding row belonging to someone else.
      const { data, error: readError } = await supabase.from('exam_results')
        .select('id,user_id,total,correct,pct').eq('id', result.id).eq('user_id', result.user_id)
        .abortSignal(AbortSignal.timeout(15_000)).maybeSingle();
      if (!readError && data && data.total === result.total && data.correct === result.correct && data.pct === result.pct) return;
    }
    if (error) {
      // A refused insert must not resolve like a saved one, and it must
      // not sit in the dedupe window looking like an attempt that landed:
      // drop it so a retry really hits the DB, and reject so the caller
      // knows this score never reached the leaderboard.
      // Only drop OUR entry. A slow failure landing after a retry has already
      // re-populated the same signature would otherwise delete the retry's
      // in-flight entry and let a second identical insert through.
      if (sig && _saveDedupeMap.get(sig)?.promise === promise) _saveDedupeMap.delete(sig);
      console.error('Save result error:', error);
      throw new Error(thaiError(error, 'บันทึกคะแนนไม่สำเร็จ คะแนนนี้ยังไม่ขึ้นกระดานอันดับ'));
    }
  })();
  if (sig) _saveDedupeMap.set(sig, { promise, ts: now });
  try { return await promise; }
  catch (error) {
    if (sig && _saveDedupeMap.get(sig)?.promise === promise) _saveDedupeMap.delete(sig);
    throw error;
  }
}

/** Leaderboard query.
 *  @param opts.groupId — restrict to a group (existing behavior).
 *  @param opts.year — when set (1-6), filter to that curriculum year.
 *                     Null/undefined = lifetime (cross-year).
 *  @param opts.phase — optional phase tag (1-mid / 2-final / etc.)
 *  @param opts.limit — row cap, default 200.
 *
 *  Two data paths, split by RLS scope:
 *   • Group leaderboard → direct exam_results query. The SELECT policy
 *     only exposes rows of groups the caller belongs to, so RLS does
 *     the scoping.
 *   • Global leaderboard → get_global_leaderboard() SECURITY DEFINER
 *     RPC. Row-level SELECT no longer exposes other users' solo
 *     attempts (that read clause exposed full histories by user_id),
 *     so cross-user ranking goes through the RPC, which returns only
 *     leaderboard-safe fields and honors show_on_leaderboard. If the
 *     RPC fails the board reports the failure — an RLS-scoped fallback
 *     would show the caller their own rows under a global heading.
 *
 *  Both paths drop runs under LEADERBOARD_MIN_QUESTIONS — the RPC has
 *  the same floor baked in (p_min_total), so client and data layer
 *  agree even across a deploy skew.
 */
export async function getLeaderboard(opts = {}) {
  // Back-compat: older callers passed (groupId, limit) positionally.
  if (typeof opts === 'string' || opts === null) {
    opts = { groupId: opts, limit: arguments[1] };
  }
  const { groupId = null, year = null, phase = null, limit = 200 } = opts;
  const supabase = await getSupabase();

  const rlsQuery = () => {
    let query = supabase.from('exam_results')
      .select('id, user_id, mode, subject, total, correct, pct, year, phase, created_at, profiles(username, avatar_emoji)')
      .order('pct', { ascending: false }).order('correct', { ascending: false })
      // Same min-questions gate as the RPC — the fallback path must
      // not rank tiny runs the data layer already refuses to rank.
      .gte('total', LEADERBOARD_MIN_QUESTIONS);
    if (limit && limit > 0) query = query.limit(limit);
    if (groupId) query = query.eq('group_id', groupId);
    if (Number.isFinite(year)) query = query.eq('year', year);
    if (phase) query = query.eq('phase', phase);
    return query;
  };

  if (groupId) {
    const { data, error } = await rlsQuery();
    if (error) throw error;
    return data;
  }
  const { data, error } = await supabase.rpc(opts.scoreSource ? 'get_leaderboard_by_source' : 'get_global_leaderboard', {
    p_year: Number.isFinite(year) ? year : null,
    p_phase: phase || null,
    p_limit: limit && limit > 0 ? limit : 200,
    ...(opts.scoreSource ? { p_source: opts.scoreSource } : {}),
  });
  if (!error) return data || [];
  // No fallback here. The old one re-ran rlsQuery() with no group filter,
  // and the SELECT policy on exam_results only exposes the caller's own
  // rows (plus their groups'), so the "global board" quietly became a
  // board of one and the view's error state never fired. Say it failed.
  console.warn('[leaderboard] RPC failed:', error.message);
  throw new Error(thaiError(error, 'โหลดกระดานอันดับไม่สำเร็จ ลองใหม่อีกครั้ง'));
}

/** Per-user stats. Optional year filter scopes to a single curriculum
 *  year (Q2=C: user toggles "ปี 4 / ทั้งหมด"). */
export async function getUserStats(userId, opts = {}) {
  // Back-compat: older callers passed (userId, limit) positionally.
  if (typeof opts === 'number') opts = { limit: opts };
  const { year = null, limit = 1000 } = opts;
  const supabase = await getSupabase();
  let query = supabase.from('exam_results')
    .select('pct, correct, total, mode, year, phase, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (limit && limit > 0) query = query.limit(limit);
  if (Number.isFinite(year)) query = query.eq('year', year);
  const { data, error } = await query;
  if (error) throw error;
  return data;
}

// ==========================================================
// CLOUD SYNC (user_data)
// ==========================================================
async function userDataRequest(supabase, userId, request) {
  const checkPrincipal = async () => {
    const { data: { session } = {} } = await supabase.auth.getSession();
    if (!userId || session?.user?.id !== userId) {
      throw Object.assign(new Error('กรุณาเข้าสู่บัญชีเดิมเพื่อซิงก์ข้อมูล'), { code: 'STALE_PRINCIPAL' });
    }
  };
  await checkPrincipal();
  // React's account effect may lag SDK sign-out/account deletion. Neither a
  // successful receipt nor a rejected old request may restore the old owner.
  try { return await request(); }
  finally { await checkPrincipal(); }
}

export async function pullUserData(userId) {
  const supabase = await getSupabase();
  if (!supabase) return null;
  const { data, error } = await userDataRequest(supabase, userId, () => supabase.from('user_data')
    .select('*').eq('user_id', userId).abortSignal(AbortSignal.timeout(30_000)).maybeSingle());
  if (error) throw error;
  return normalizeUserDataRow(data);
}

/** One transaction applies immutable intent and records its receipt. */
export async function applyUserDataOperations(userId, operations) {
  const supabase = await getSupabase();
  if (!supabase) throw new Error('ยังเชื่อมต่อบัญชีไม่ได้ ข้อมูลในเครื่องยังอยู่ครบ');
  const { data, error } = await userDataRequest(supabase, userId, () => supabase.rpc('sync_user_data_v2', { p_operations: operations })
    .abortSignal(AbortSignal.timeout(30_000)));
  if (error) throw error;
  return data ? { ...data, row: normalizeUserDataRow(data.row) } : data;
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
    // Returning [] here made a dropped connection read as an empty thread
    // (ยังไม่มีความเห็น) and let a failed background refetch wipe a thread
    // that was already on screen. Reject with a Thai message instead, so
    // the caller can show it as-is and keep what it already has.
    console.warn('[qcomments] list failed:', error.message);
    throw new Error(thaiError(error, 'โหลดความเห็นไม่สำเร็จ ลองใหม่อีกครั้ง'));
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
        // A DELETE on an RLS table carries only the primary key, so it has no
        // q_id to match; it is handled by the unfiltered listener below.
        if (payload.eventType === 'DELETE') return;
        // Server-side filter only narrows by subject — final filter on q_id
        // happens here so we don't depend on multi-column filter syntax.
        const row = payload.new || payload.old;
        if (!row || row.q_id !== qId) return;
        if (payload.eventType !== 'INSERT') { onEvent(payload); return; }
        // The realtime row has no profiles join, so a classmate's new comment
        // drew as "ผู้ใช้ 🐾" until a reload. Read it back with its author.
        // A row that is already gone (posted then deleted) is not shown.
        supabase.from('q_comments')
          .select('id, q_subject, q_id, user_id, body, parent_id, created_at, updated_at, profiles ( username, avatar_emoji )')
          .eq('id', row.id)
          .maybeSingle()
          .then(({ data, error }) => {
            if (error) { onEvent(payload); return; }
            if (data) onEvent({ ...payload, new: data });
          }, () => onEvent(payload));
      },
    )
    // Realtime cannot evaluate a column filter on a DELETE (the old row holds
    // only the key), so deletions are heard unfiltered and matched by id in
    // the thread, which ignores ids it does not hold.
    .on(
      'postgres_changes',
      { event: 'DELETE', schema: 'public', table: 'q_comments' },
      (payload) => { if (payload?.old?.id != null) onEvent(payload); },
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
