// ============================================================
// auth-utils.js — small pure helpers for AuthView's smart UX
// ============================================================
// Kept separate from AuthView so they can be unit-tested and reused
// (e.g. by a future profile-edit form).
// ============================================================

/**
 * Derive a sensible username from an email's local-part.
 *   palm@gmail.com → 'palm'
 *   john.doe+tag@example.com → 'john_doe'
 *   a@b.c → 'a' (just the local-part)
 *
 * Rules mirror the SQL trigger's sanitizer:
 *   - keep [A-Za-z0-9_]
 *   - first 25 chars
 *   - empty → ''
 */
export function deriveUsernameFromEmail(email) {
  if (!email || typeof email !== 'string') return '';
  const local = email.split('@')[0] || '';
  // Replace common separators with underscore for readability
  const normalized = local.replace(/[.\-+]/g, '_');
  // Strip anything else
  const clean = normalized.replace(/[^a-zA-Z0-9_]/g, '');
  return clean.slice(0, 25);
}

/**
 * Sanitize a username candidate to the same charset the SQL trigger
 * accepts, so the user sees exactly what will be persisted.
 */
export function sanitizeUsername(value) {
  return String(value || '').replace(/[^a-zA-Z0-9_]/g, '').slice(0, 30);
}

/**
 * Validate a username for client-side display before hitting Supabase.
 * Returns { ok: boolean, reason?: string }.
 */
export function validateUsername(value) {
  const v = String(value || '');
  if (v.length === 0) return { ok: false, reason: 'ใส่ชื่อ' };
  if (v.length < 3) return { ok: false, reason: 'สั้นเกินไป (อย่างน้อย 3 ตัว)' };
  if (v.length > 30) return { ok: false, reason: 'ยาวเกินไป (สูงสุด 30 ตัว)' };
  if (!/^[a-zA-Z0-9_]+$/.test(v)) return { ok: false, reason: 'ใช้ได้แค่ a-z, A-Z, 0-9, _' };
  return { ok: true };
}

/**
 * Compute password strength as an integer 0-4 + label.
 *
 * Heuristic (simple, no zxcvbn dependency):
 *   +1 length ≥ 8
 *   +1 length ≥ 12
 *   +1 has both lowercase and uppercase
 *   +1 has a digit
 *   +1 has a symbol
 *
 * Score is then capped/labeled into 4 buckets so the UI bar reads
 * cleanly.
 */
export function passwordStrength(password) {
  const p = String(password || '');
  if (p.length === 0) return { score: 0, label: '', color: 'var(--clr-border)', percent: 0 };
  if (p.length < 6) return { score: 0, label: 'สั้นเกินไป', color: 'var(--clr-rose)', percent: 15 };

  let score = 0;
  if (p.length >= 8) score++;
  if (p.length >= 12) score++;
  if (/[a-z]/.test(p) && /[A-Z]/.test(p)) score++;
  if (/[0-9]/.test(p)) score++;
  if (/[^A-Za-z0-9]/.test(p)) score++;

  // Map raw score (0-5) to bucket
  if (score <= 1) return { score: 1, label: 'อ่อน',     color: 'var(--clr-rose)',  percent: 30 };
  if (score === 2) return { score: 2, label: 'พอใช้',   color: 'var(--clr-gold)',  percent: 55 };
  if (score === 3) return { score: 3, label: 'ดี',     color: 'var(--clr-sage)',  percent: 80 };
  return            { score: 4, label: 'แข็งแรงมาก', color: 'var(--clr-sage)',  percent: 100 };
}
