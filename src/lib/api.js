import { getSupabase } from './supabase.js';
import { migrateHistoryArray } from './id-migration.js';
import { yearForSubject } from '../data/curriculum.js';

// All cloud-sync calls await getSupabase() so anonymous visitors never
// pay the 190KB SDK download cost — the chunk only fetches once a
// logged-in user actually performs a sync, group, or leaderboard op.
//
// Static imports above: id-migration + curriculum are tiny utility
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
  return Array.isArray(data) ? (data[0] || null) : (data || null);
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
  if (!supabase) return;
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
    const { error } = await supabase.from('exam_results').insert(result);
    if (error) console.error('Save result error:', error);
  })();
  if (sig) _saveDedupeMap.set(sig, { promise, ts: now });
  return promise;
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
 *     attempts (that read clause leaked full histories by user_id),
 *     so cross-user ranking goes through the RPC, which returns only
 *     leaderboard-safe fields and honors show_on_leaderboard. If the
 *     RPC isn't on the live DB yet (migration pending), fall back to
 *     the RLS-scoped query rather than erroring the whole board.
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
      .order('pct', { ascending: false }).order('correct', { ascending: false });
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
  const { data, error } = await supabase.rpc('get_global_leaderboard', {
    p_year: Number.isFinite(year) ? year : null,
    p_phase: phase || null,
    p_limit: limit && limit > 0 ? limit : 200,
  });
  if (!error) return data || [];
  console.warn('[leaderboard] RPC unavailable, falling back to RLS-scoped query:', error.message);
  const { data: fbData, error: fbError } = await rlsQuery();
  if (fbError) throw fbError;
  return fbData;
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
export async function pullUserData(userId) {
  const supabase = await getSupabase();
  if (!supabase) return null;
  const { data, error } = await supabase.from('user_data')
    .select('*').eq('user_id', userId).maybeSingle();
  if (error) throw error;
  if (!data) return null;
  // Apply ID-migration v1 to cloud history on restore (mirrors the
  // local-storage migration in src/lib/id-migration.js). Idempotent —
  // already-migrated entries are no-ops.
  // Palm build-warning audit 2026-05-24: id-migration.js + curriculum.js
  // are statically imported by main.jsx / every view, so dynamic
  // import() here added no chunk-split benefit and produced Vite
  // warnings ("dynamic import will not move module into another chunk").
  // Use the static imports added at the top of this file instead.
  if (Array.isArray(data.history)) {
    data.history = migrateHistoryArray(data.history);

    // Year-enrich legacy cloud history rows (data-layer audit 2026-05-19).
    // Cloud may hold rows written before App.jsx finishExam started
    // tagging entries with `year`. Without enrichment, these rows
    // would bypass DashboardView scopedHistory's year filter and
    // appear in cross-year cards. Local-storage backfill runs once
    // on mount but only against the local copy; cloud data restored
    // later needs the same treatment.
    const needs = data.history.some((h) => h && typeof h.year === 'undefined');
    if (needs) {
      data.history = data.history.map((h) =>
        h && typeof h.year === 'undefined'
          ? { ...h, year: yearForSubject(h.subject) ?? null, phase: h.phase ?? null }
          : h
      );
    }
  }
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
