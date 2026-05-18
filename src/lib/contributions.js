// ============================================================
// contributions — Q submission + review pipeline
// ============================================================
//
// Wraps the public.q_submissions / submission_reviews /
// contributor_reputation tables + 3 RPCs defined in migration
// q_contribution_workflow (2026-05-18).
//
// Quality strategy (Palm directive):
//   • Open submission (anyone with a vetmock account can submit)
//   • Strict 4-tier review:
//       TIER 0  auto-screen — DB function, lint + schema gates
//       TIER 1  peer review — 2 verified contributors must approve
//       TIER 2  founder final — Palm's review queue
//       TIER 3  observability — post-publish (out of scope here)
//   • Reputation gates upgrade path: contributor → verified → senior
//
// All RPCs use SECURITY DEFINER + locked search_path. Client only
// dispatches; auth.uid() is read inside the function.
// ============================================================

import { getSupabase } from './supabase.js';

// ─── Client-side pre-submission lint ───────────────────────────
// Mirrors the DB-side auto-screen so the contributor can fix issues
// BEFORE submitting. Keeps the same banned-word list as the
// scripts/lint-academic-safety.mjs subset that's most impactful.
const BANNED_PATTERNS = [
  { pattern: /โพย/g, rule: 'academic_safety', label: 'คำว่า "โพย" — เลี่ยงใช้ "สรุป" แทน' },
  { pattern: /ออกตามนี้/gi, rule: 'academic_safety', label: '"ออกตามนี้" — ใช้ "อิงแนวสอบ" แทน' },
  { pattern: /ตรงข้อสอบ/gi, rule: 'academic_safety', label: '"ตรงข้อสอบ" — ใช้ "ตรงตามแนวสอบ" แทน' },
  { pattern: /ตรงเป๊ะ/gi, rule: 'academic_safety', label: '"ตรงเป๊ะ" — ใช้ "ใกล้เคียง" แทน' },
  { pattern: /ข้อสอบรั่ว|ข้อสอบหลุด/gi, rule: 'academic_safety', label: 'คำส่อนัยรั่วสอบ — ใช้ "เอกสารบันทึกหลังสอบ"' },
  { pattern: /leaked exam/gi, rule: 'academic_safety', label: '"leaked exam" — ใช้ "past-paper note"' },
  { pattern: /ซซดาวที่ออก/gi, rule: 'academic_safety', label: 'sr-attribution — ใช้ "ซซดาวบันทึก"' },
];

const SOURCE_TYPES = [
  { id: 'exam-past', label: '📝 ข้อสอบเก่า (past exam)' },
  { id: 'slide', label: '📊 สไลด์อาจารย์' },
  { id: 'textbook', label: '📚 ตำรา / textbook' },
  { id: 'lecture-note', label: '🎤 เลคเชอร์โน้ต' },
  { id: 'clinical-experience', label: '🩺 ประสบการณ์คลินิก' },
  { id: 'other', label: '📌 อื่นๆ' },
];

export const CONTRIBUTION_SOURCE_TYPES = SOURCE_TYPES;

// ─── Schema validation (client-mirrored from DB function) ──────
export function validateSubmission(p) {
  const errors = [];
  const warnings = [];

  if (!p.q_text || p.q_text.length < 10) errors.push({ field: 'q_text', msg: 'โจทย์ต้องยาวอย่างน้อย 10 ตัวอักษร' });
  if (p.q_text && p.q_text.length > 2000) errors.push({ field: 'q_text', msg: 'โจทย์ยาวเกิน 2000 ตัวอักษร' });

  if (!Array.isArray(p.options) || p.options.length < 2) errors.push({ field: 'options', msg: 'ต้องมีตัวเลือกอย่างน้อย 2 ข้อ' });
  if (Array.isArray(p.options) && p.options.length > 6) errors.push({ field: 'options', msg: 'ตัวเลือกไม่เกิน 6 ข้อ' });
  if (Array.isArray(p.options)) {
    p.options.forEach((o, i) => {
      if (!o || !o.trim()) errors.push({ field: `options[${i}]`, msg: `ตัวเลือก ${i + 1} ว่าง` });
      // Length-bias check (warning, not blocker)
      if (i > 0 && p.options[0] && o && Math.abs(o.length - p.options[0].length) > 50) {
        warnings.push({ field: `options[${i}]`, msg: `ตัวเลือก ${i + 1} ยาว/สั้นกว่าตัวเลือกอื่นมาก — อาจเป็น length-bias` });
      }
      // ★ + bold strip (info)
      if (o && /★|\*\*[^*]+\*\*|__[^_]+__/.test(o)) {
        warnings.push({ field: `options[${i}]`, msg: `ตัวเลือก ${i + 1} มี ★ หรือ markdown bold — จะถูก strip` });
      }
    });
  }

  if (typeof p.answer_idx !== 'number' || !Number.isInteger(p.answer_idx)) {
    errors.push({ field: 'answer_idx', msg: 'ต้องเลือกคำตอบที่ถูก' });
  } else if (Array.isArray(p.options) && (p.answer_idx < 0 || p.answer_idx >= p.options.length)) {
    errors.push({ field: 'answer_idx', msg: 'ดัชนีคำตอบไม่ถูกต้อง' });
  }

  if (!p.explain_text || p.explain_text.length < 30) {
    errors.push({ field: 'explain_text', msg: 'เหตุผล/เฉลยต้องอธิบายอย่างน้อย 30 ตัวอักษร' });
  }

  if (!p.subject) errors.push({ field: 'subject', msg: 'เลือกวิชา' });
  if (!p.source_type) errors.push({ field: 'source_type', msg: 'ระบุประเภทแหล่งที่มา' });
  if (!p.source_ref || p.source_ref.length < 3) errors.push({ field: 'source_ref', msg: 'อธิบายแหล่งที่มา (เช่น "Aj. Nan slide สัปดาห์ 3")' });

  // Banned-word scan across stem + options + explain
  const combined = [p.q_text, ...(p.options || []), p.explain_text]
    .filter(Boolean).join('\n');
  for (const b of BANNED_PATTERNS) {
    const matches = combined.match(b.pattern);
    if (matches && matches.length > 0) {
      errors.push({ field: 'academic_safety', msg: b.label, count: matches.length });
    }
  }

  return { errors, warnings, canSubmit: errors.length === 0 };
}

// ─── RPC wrappers ──────────────────────────────────────────────
export async function ensureContributorRow() {
  const supabase = await getSupabase();
  if (!supabase) return null;
  await supabase.rpc('ensure_contributor_row').catch(() => {});
  return true;
}

export async function submitProposal(payload) {
  const supabase = await getSupabase();
  if (!supabase) throw new Error('NOT_SIGNED_IN');
  const { data, error } = await supabase.rpc('submit_q_proposal', { payload });
  if (error) throw error;
  return data; // returns new submission UUID
}

export async function castReviewVote({ submissionId, verdict, feedback }) {
  const supabase = await getSupabase();
  if (!supabase) throw new Error('NOT_SIGNED_IN');
  const { data, error } = await supabase.rpc('cast_review_vote', {
    sub_id: submissionId,
    verdict_val: verdict,
    feedback_val: feedback ?? null,
  });
  if (error) throw error;
  return data; // returns new status string
}

// ─── Fetchers ──────────────────────────────────────────────────
export async function fetchMyReputation() {
  const supabase = await getSupabase();
  if (!supabase) return null;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase
    .from('contributor_reputation')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle();
  return data;
}

export async function fetchMySubmissions(limit = 50) {
  const supabase = await getSupabase();
  if (!supabase) return [];
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];
  const { data, error } = await supabase
    .from('q_submissions')
    .select('id, subject, topic, q_text, status, screen_log, rejection_reason, created_at, reviewed_at, approved_at')
    .eq('contributor_id', user.id)
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) return [];
  return data || [];
}

// Reviewers see in_peer_review (Tier 1) + palm_review (Tier 2 if founder)
export async function fetchReviewQueue({ founderOnly = false, limit = 50 } = {}) {
  const supabase = await getSupabase();
  if (!supabase) return [];
  let q = supabase
    .from('q_submissions')
    .select('*')
    .order('created_at', { ascending: true })
    .limit(limit);
  q = founderOnly ? q.eq('status', 'palm_review') : q.in('status', ['in_peer_review', 'palm_review']);
  const { data, error } = await q;
  if (error) return [];
  return data || [];
}

export async function fetchSubmissionReviews(submissionId) {
  const supabase = await getSupabase();
  if (!supabase) return [];
  const { data } = await supabase
    .from('submission_reviews')
    .select('id, reviewer_id, verdict, feedback, is_palm_review, created_at')
    .eq('submission_id', submissionId)
    .order('created_at', { ascending: true });
  return data || [];
}

export async function fetchLeaderboard(limit = 20) {
  const supabase = await getSupabase();
  if (!supabase) return [];
  const { data } = await supabase
    .from('contributor_reputation')
    .select('user_id, display_name, score, role, submissions_total, approved_count, reviews_done')
    .neq('role', 'banned')
    .order('score', { ascending: false })
    .order('approved_count', { ascending: false })
    .limit(limit);
  return data || [];
}

// ─── Status display helpers ────────────────────────────────────
export const STATUS_META = {
  draft: { label: 'ร่าง', color: '#888', icon: '📝' },
  submitted: { label: 'ส่งแล้ว · รอ screen', color: '#5db4d3', icon: '📨' },
  screen_failed: { label: 'auto-screen ไม่ผ่าน', color: '#a73d4a', icon: '⚠️' },
  in_peer_review: { label: 'รอ peer review (2 คน)', color: '#b88940', icon: '👁️' },
  peer_failed: { label: 'peer review ไม่ผ่าน', color: '#a73d4a', icon: '❌' },
  palm_review: { label: 'รอ Palm final review', color: '#4a6b4a', icon: '🎯' },
  approved: { label: '✓ อนุมัติแล้ว', color: '#4a6b4a', icon: '✅' },
  published: { label: '📚 publish เข้า Q bank', color: '#4a6b4a', icon: '🎉' },
  rejected: { label: '✗ ไม่ผ่าน', color: '#a73d4a', icon: '🛑' },
};

export function statusMeta(status) {
  return STATUS_META[status] || { label: status, color: '#888', icon: '?' };
}

export const ROLE_META = {
  contributor: { label: 'Contributor', icon: '🐣', color: '#5db4d3' },
  verified: { label: 'Verified', icon: '✓', color: '#4a6b4a' },
  senior: { label: 'Senior', icon: '🥇', color: '#b88940' },
  founder: { label: 'Founder', icon: '👑', color: '#a73d4a' },
  banned: { label: 'Banned', icon: '🚫', color: '#666' },
};

export function isPalmFounder(rep) {
  return rep?.role === 'founder';
}
export function isReviewer(rep) {
  return ['verified', 'senior', 'founder'].includes(rep?.role || '');
}
