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
  { match: /email not confirmed|email_not_confirmed/i, th: 'ยังไม่ได้ยืนยันอีเมล — กรุณาเช็คอีเมลแล้วคลิกลิงก์ยืนยันก่อน' },
  { match: /user not found/i, th: 'ไม่พบบัญชีนี้ — สมัครก่อนหรือลองอีเมลอื่น' },
  { match: /too many requests|rate.limit/i, th: 'ลองใหม่เยอะเกินไป — รอสักครู่แล้วลองอีกครั้ง' },

  // Sign-up failures
  { match: /already registered|user already|email.*exists/i, th: 'อีเมลนี้มีบัญชีอยู่แล้ว — Login แทนการสมัคร' },
  { match: /password.*at least|password.*6|weak.password/i, th: 'รหัสผ่านสั้นเกินไป — ต้องยาวอย่างน้อย 6 ตัว' },
  { match: /signup.*disabled|signups.*not allowed/i, th: 'การสมัครถูกปิดชั่วคราว' },
  { match: /unable to validate email|invalid email/i, th: 'รูปแบบอีเมลไม่ถูกต้อง' },

  // Network / config
  { match: /network|fetch.*failed|failed to fetch/i, th: 'เน็ตหลุด — เช็กสัญญาณแล้วลองใหม่' },
  { match: /not configured/i, th: 'ระบบยังตั้งค่าไม่ครบ — แจ้ง admin' },

  // Password reset
  { match: /token.*expired|otp.*expired/i, th: 'ลิงก์/รหัสยืนยันหมดอายุแล้ว — ขอใหม่' },
  { match: /token.*invalid|invalid.*token/i, th: 'ลิงก์/รหัสไม่ถูกต้อง' },
  { match: /auth session missing|session.*not.*found|no.*session/i, th: 'ลิงก์รีเซ็ตหมดอายุหรือใช้ไปแล้ว — ขอลิงก์ใหม่จากหน้า "ลืมรหัสผ่าน"' },
  { match: /same.*password|new password should be different/i, th: 'รหัสผ่านใหม่ต้องไม่ใช่รหัสเดิม' },
];

export function thaiAuthError(err) {
  if (!err) return '';
  const raw = typeof err === 'string' ? err : (err.message || err.error_description || err.code || '');
  for (const p of PATTERNS) {
    if (p.match.test(raw)) return p.th;
  }
  return raw || 'เกิดข้อผิดพลาด';
}
