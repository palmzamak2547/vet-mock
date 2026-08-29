// User-facing error text. Raw exception messages are English infrastructure
// speak ("Failed to fetch", "JWT expired") dropped into an all-Thai UI — map
// the common classes to a sentence a student can act on. A message that is
// already Thai (thrown by our own code) passes through untouched.
export function thaiError(e, fallback = 'เกิดข้อผิดพลาด ลองใหม่อีกครั้ง') {
  const msg = String(e?.message || e || '');
  if (/[ก-๙]/.test(msg)) return msg;
  if (/failed to fetch|networkerror|fetch failed|load failed|ERR_INTERNET|ERR_NETWORK/i.test(msg)) {
    return 'เชื่อมต่อไม่ได้ — ตรวจอินเทอร์เน็ตแล้วลองใหม่';
  }
  if (/jwt|token.*expired|unauthorized|401/i.test(msg)) {
    return 'เซสชันหมดอายุ — เข้าสู่ระบบใหม่อีกครั้ง';
  }
  if (/timeout|timed ?out|aborted/i.test(msg)) {
    return 'เซิร์ฟเวอร์ตอบช้าเกินไป — ลองใหม่อีกครั้ง';
  }
  return fallback;
}
