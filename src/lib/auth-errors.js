// ============================================================
// auth-errors.js — translate Supabase auth errors into Thai
// ============================================================
// Supabase returns English error messages keyed by code/text. Map
// the common ones to friendly Thai. Fall back to the original
// message when unmapped (better than nothing for debugging).
//
// Codes vary across Supabase Auth versions — match by both the
// `code` field and the `message` substring to be resilient.
// ============================================================

const PATTERNS = [
  // Sign-in failures
  { match: /invalid login credentials|invalid_credentials/i, th: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' },
  { match: /email not confirmed|email_not_confirmed/i, th: 'โปรดยืนยันอีเมลก่อนเข้าสู่ระบบ (กรุณาตรวจสอบในกล่องจดหมายของคุณ)' },
  { match: /user not found/i, th: 'ไม่พบบัญชีนี้ — โปรดสมัครสมาชิกหรือลองอีเมลอื่น' },
  { match: /too many requests|rate.limit/i, th: 'เข้าสู่ระบบหลายครั้งเกินไป — โปรดรอสักครู่แล้วลองอีกครั้ง' },

  // Sign-up failures
  { match: /already registered|user already|email.*exists/i, th: 'อีเมลนี้มีบัญชีอยู่แล้ว — โปรดเข้าสู่ระบบแทนการสมัคร' },
  { match: /password.*at least|password.*6|weak.password/i, th: 'รหัสผ่านสั้นเกินไป — ต้องยาวอย่างน้อย 6 ตัวอักษร' },
  // Magic-link-specific: vetmock sets shouldCreateUser:false so OTP
  // signup is intentionally blocked — but Supabase's generic
  // "Signups not allowed for otp" reads as "the whole site is closed",
  // which scares users. Detect the OTP suffix and rewrite to actionable
  // direction (sign up first via email/password or Google).
  { match: /signups? not allowed for otp|otp signups? (disabled|blocked|not allowed)/i,
    th: 'ไม่พบบัญชีนี้ — โปรดสมัครสมาชิกก่อน (ผ่านอีเมล+รหัสผ่าน หรือ Google) แล้วจึงใช้ Magic Link ในครั้งต่อไป' },
  { match: /signup.*disabled|signups.*not allowed/i, th: 'การสมัครสมาชิกถูกปิดชั่วคราว' },
  { match: /unable to validate email|invalid email/i, th: 'รูปแบบอีเมลไม่ถูกต้อง' },

  // Network / config
  { match: /network|fetch.*failed|failed to fetch/i, th: 'การเชื่อมต่อเครือข่ายมีปัญหา — โปรดตรวจสอบสัญญาณแล้วลองใหม่' },
  { match: /not configured/i, th: 'ระบบยังตั้งค่าไม่ครบ — โปรดแจ้งผู้ดูแลระบบ' },

  // Password reset
  { match: /token.*expired|otp.*expired/i, th: 'ลิงก์หรือรหัสยืนยันหมดอายุแล้ว — โปรดขอใหม่' },
  { match: /token.*invalid|invalid.*token/i, th: 'ลิงก์หรือรหัสยืนยันไม่ถูกต้อง' },
  { match: /auth session missing|session.*not.*found|no.*session/i, th: 'ลิงก์รีเซ็ตหมดอายุหรือใช้งานไปแล้ว — ขอลิงก์ใหม่จากหน้าลืมรหัสผ่าน' },
  { match: /same.*password|new password should be different/i, th: 'รหัสผ่านใหม่ต้องไม่ซ้ำกับรหัสผ่านเดิม' },
];

/**
 * True when a WebAuthn ceremony ended because the person dismissed the
 * browser/OS prompt, it timed out, or the device holds no matching passkey.
 * Browsers report all of these as NotAllowedError (AbortError when the page
 * aborts the ceremony). auth-js wraps that DOMException before it reaches the
 * app: `code` becomes ERROR_PASSTHROUGH_SEE_CAUSE_PROPERTY or
 * ERROR_CEREMONY_ABORTED, while the original name survives on `name` and
 * `cause`. Checking `code || name` alone therefore misses every dismissal and
 * turns a normal "no thanks" into a red sign-in failure banner.
 *
 * Server-side outcomes such as webauthn_credential_not_found are not
 * dismissals; callers keep their own messages for those.
 */
export function isWebAuthnDismissal(err) {
  if (!err) return false;
  const parts = [err.code, err.name, err.cause?.name, err.originalError?.name, err.message]
    .filter((v) => typeof v === 'string')
    .join(' ');
  return /NotAllowedError|AbortError|ERROR_CEREMONY_ABORTED|cancel/i.test(parts);
}

export function thaiAuthError(err) {
  if (!err) return '';
  const raw = typeof err === 'string' ? err : (err.message || err.error_description || err.code || '');
  for (const p of PATTERNS) {
    if (p.match.test(raw)) return p.th;
  }
  // Thai already? It came from our own code — pass it through.
  if (/[ก-๙]/.test(raw)) return raw;
  // Otherwise this is an unmapped provider string in English ("Database error
  // saving new user", "Invalid Refresh Token: Already Used"). It used to be
  // printed verbatim across every login and account screen, which is debugging
  // output on a student's sign-in page. Keep it for the console, show a
  // sentence they can act on.
  if (raw) console.warn('[auth] unmapped error:', raw);
  return 'เข้าสู่ระบบไม่สำเร็จ ลองใหม่อีกครั้ง หรือใช้วิธีเข้าสู่ระบบแบบอื่น';
}
