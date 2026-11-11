// ============================================================
// public-identity.js — a student's public name and picture
// ============================================================
// What a student picks here is shown to every member: the header, the
// profile hub, the leaderboard, group boards, comments and the online list
// all read profiles.username and profiles.avatar_emoji. So the rules are
// strict, and they are the client's half only: the database holds the other
// half (profiles_username_length_check: 2 to 30 characters, a unique
// username, own row only, columns username and avatar_emoji only). Nothing
// here replaces a database check; a name that passes here can still be
// refused there, and the refusal is shown as it is.
//
// The database today allows any character, so Thai is allowed. What it does
// NOT enforce (reserved words, an email, a student number, a picture outside
// the set, case-insensitive uniqueness) is only enforced here until the
// migration written in the release notes lands.
// ============================================================

import { emailLocalPart, isAutoName } from './identity-gate.js';

export { isAutoName, emailLocalPart };

export const NAME_MIN = 3;
export const NAME_MAX = 24;

import { PICTURES, DEFAULT_PICTURE, isPicture, INVISIBLE } from './public-display.js';

export { PICTURES, DEFAULT_PICTURE, isPicture };
export const pictureLabel = (value) => PICTURES.find((p) => p.emoji === value)?.label || 'รูปที่ตั้งไว้';

// Words that would read as the app, its staff or the faculty speaking.
// Latin words are refused as the whole name or at its start followed by a
// separator or a digit ("admin", "Staff_1", "vetmock2"), so a name that only
// begins with the same letters stays free ("Rootbeer", "Staffy", "Owner" is
// refused, "Ownerin" is not). Thai words are refused anywhere in the name:
// Thai is written without spaces, so "อาจารย์ปิง" would read as a lecturer.
//   admin, administrator, moderator, mod, แอดมิน, ผู้ดูแล   run the app
//   staff, support, ทีมงาน, เจ้าหน้าที่                   speak for it
//   vetmock, official, system                       read as the app itself
//   owner, root                                     claim the account
//   อาจารย์                                          impersonates faculty
export const RESERVED = Object.freeze([
  'admin', 'administrator', 'staff', 'vetmock', 'moderator', 'support', 'system',
  'official', 'owner', 'root',
  'แอดมิน', 'ทีมงาน', 'ผู้ดูแล', 'เจ้าหน้าที่', 'อาจารย์',
]);
const isThaiWord = (w) => /[\u0e00-\u0e7f]/.test(w);
function reservedHit(value) {
  const lower = normalizePublicName(value).toLowerCase();
  const folded = compactName(value);
  return RESERVED.find((w) => {
    if (isThaiWord(w)) return lower.replace(/[\s._-]/g, '').includes(w);
    const head = lower.startsWith(w) || folded.startsWith(compactName(w));
    if (!head) return false;
    const rest = lower.startsWith(w) ? lower.slice(w.length) : '';
    return lower === w || folded === compactName(w) || rest === '' || /^[\s._\-0-9\u0e50-\u0e59]/.test(rest);
  });
}
const RESERVED_EXACT = Object.freeze(['mod', 'dev', 'team', 'null', 'undefined']);

const ALLOWED = /^[\p{Script=Thai}A-Za-z0-9_ .-]+$/u;
const HAS_LETTER = /[ก-ฮA-Za-z]/;
// Thai vowel and tone marks that sit on the letter before them.
const THAI_MARK = /[ัิ-ฺ็-๎]/;
const toAsciiDigits = (s) => s.replace(/[๐-๙]/g, (d) => String(d.charCodeAt(0) - 0x0e50));

/** The name as it will be stored: NFKC (one form for look-alike letters and
 *  digits), sara am recomposed so the typed and the precomposed spelling are
 *  one name, no invisible characters, one space. */
export function normalizePublicName(raw) {
  return String(raw ?? '')
    .normalize('NFKC')
    .replace(/ํ([่-๋]?)า/g, '$1ำ')
    .replace(INVISIBLE, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/** The form two names are compared in: no case, no separators, and the
 *  letters that look alike in the app's fonts folded together (I l 1, O 0). */
export function compactName(value) {
  return normalizePublicName(value).toLowerCase()
    .replace(/[\s._-]/g, '')
    .replace(/[il1|]/g, 'l')
    .replace(/[o0]/g, 'o');
}

/** Code points, as Postgres char_length counts them. */
export const nameLength = (value) => [...String(value ?? '')].length;

/**
 * Whether a name may be someone's public name.
 * @returns {{ ok: true, value: string } | { ok: false, value: string, reason: string }}
 */
export function checkPublicName(raw, { email = '' } = {}) {
  const value = normalizePublicName(raw);
  const no = (reason) => ({ ok: false, value, reason });
  if (!value) return no('ใส่ชื่อที่อยากให้เพื่อนเห็น');
  const len = nameLength(value);
  if (len < NAME_MIN) return no(`สั้นไป ใช้อย่างน้อย ${NAME_MIN} ตัวอักษร`);
  if (len > NAME_MAX) return no(`ยาวไป ไม่เกิน ${NAME_MAX} ตัวอักษร`);
  if (/@/.test(value) || /(^|\.)(com|net|org|ac\.th|co\.th|in\.th)$/i.test(value) || /www\.|https?:/i.test(value)) {
    return no('ชื่อต้องไม่เป็นอีเมลหรือที่อยู่เว็บ');
  }
  if (!ALLOWED.test(value)) return no('ใช้ได้เฉพาะอักษรไทย อังกฤษ ตัวเลข ช่องว่าง และ _ . -');
  if (/^[ ._-]|[ ._-]$/.test(value)) return no('ขึ้นต้นและลงท้ายด้วยตัวอักษรหรือตัวเลข');
  // A mark has no place on a digit, and marks or separators between digits
  // would hide a student number from the count below.
  if (new RegExp(`[0-9๐-๙]${THAI_MARK.source}`).test(value)) return no('วางวรรณยุกต์หรือสระบนตัวเลขไม่ได้');
  const digitsOnly = toAsciiDigits(value).replace(/[ ._-]/g, '').replace(new RegExp(THAI_MARK.source, 'g'), '');
  if (/\d{5,}/.test(digitsOnly)) {
    return no('มีตัวเลขติดกันมากไป อาจอ่านเป็นรหัสนิสิต ใช้ไม่เกิน 4 ตัว');
  }
  if (!HAS_LETTER.test(value)) return no('ต้องมีตัวอักษรอย่างน้อยหนึ่งตัว');
  const local = emailLocalPart(email);
  if (local && value.toLowerCase() === local) return no('ชื่อนี้มาจากอีเมลของคุณ เลือกชื่ออื่น');
  const plain = value.toLowerCase().replace(/[\s._-]/g, '');
  const word = RESERVED_EXACT.includes(plain) ? plain : reservedHit(value);
  if (word) return no(`มีคำว่า ${word} ซึ่งอ่านเหมือนทีมงาน`);
  if (isAutoName(value, email)) return no('ชื่อนี้ระบบตั้งให้ เลือกชื่อของคุณเอง');
  return { ok: true, value };
}

/** Thai for what the database said when it refused a profile write. */
export function identityWriteError(error) {
  const code = error?.code || '';
  const text = `${code} ${error?.message || ''} ${error?.details || ''}`;
  if (code === '23505' || /duplicate key|unique/i.test(text)) return 'ชื่อนี้มีคนใช้แล้ว ลองชื่ออื่น';
  if ((code === '23514' || /check constraint/i.test(text)) && /length/i.test(text)) return `ชื่อต้องยาว ${NAME_MIN} ถึง ${NAME_MAX} ตัวอักษร`;
  if (code === '23514' || /check constraint/i.test(text)) return 'ชื่อหรือรูปนี้ใช้ไม่ได้ ลองชื่ออื่น';
  if (code === '42501' || /row-level security|permission denied/i.test(text)) return 'บันทึกไม่ได้ เพราะบัญชีนี้ไม่มีสิทธิ์แก้ข้อมูลนี้ ลองออกจากระบบแล้วเข้าใหม่';
  if (/fetch|network|timeout|offline/i.test(text)) return 'บันทึกไม่สำเร็จ เพราะการเชื่อมต่อขาดหาย ลองอีกครั้ง';
  if (code === 'session_changed') return 'บัญชีที่เข้าอยู่เปลี่ยนไปแล้ว ปิดหน้านี้แล้วเปิดใหม่';
  if (code === 'meta_failed') return 'บันทึกไม่สำเร็จ ยังไม่ได้เปลี่ยนอะไร ลองอีกครั้ง';
  return 'บันทึกไม่สำเร็จ ลองอีกครั้ง';
}

/** Whether this account appears on the boards (the database reads the same
 *  flag, auth metadata show_on_leaderboard, defaulting to shown). */
export const showsOnBoards = (user) => user?.user_metadata?.show_on_leaderboard !== false;

/**
 * Every place another member can see this student, and whether the board
 * choice hides them there. Kept true to the code: comments and the member
 * list of a group the student joined read profiles directly and never read
 * the flag, so they say so.
 */
export const SURFACES = Object.freeze([
  { id: 'leaderboard', label: 'กระดานอันดับ', shows: 'ชื่อ รูป และคะแนนสูงสุดของชุดที่ส่ง', followsChoice: true },
  { id: 'group-board', label: 'อันดับในกลุ่มติว', shows: 'ชื่อ รูป และคะแนนสูงสุด', followsChoice: true },
  // Not tracked at all when hidden (useStudyBuddies): no entry, not counted.
  { id: 'online', label: 'รายชื่อคนที่กำลังอ่าน', shows: 'ชื่อ รูป และวิชาที่อ่าน ขณะเปิดแอป', followsChoice: true },
  { id: 'comments', label: 'ความเห็นในข้อสอบ', shows: 'ชื่อและรูป ข้างความเห็นที่คุณเขียน', followsChoice: false },
  { id: 'group-members', label: 'สมาชิกกลุ่มที่คุณเข้า', shows: 'ชื่อและรูป', followsChoice: false },
  // RaceView puts the name of everyone in a room on its board.
  { id: 'race', label: 'ห้องแข่งที่คุณเข้าเอง', shows: 'ชื่อและคะแนนในห้องนั้น', followsChoice: false },
  // shared_questions.author_name is written once, when a question is shared.
  { id: 'shared', label: 'ข้อที่คุณเคยแชร์ในกลุ่ม', shows: 'ชื่อตอนที่แชร์ ไม่เปลี่ยนตามชื่อใหม่', followsChoice: false },
]);

/** "Vet 86" for a year, from the semester's own note ("Vet 86 = ชั้นปีที่ 5"). */
export function cohortForYear(year, cohortNote = '') {
  const m = /Vet\s*(\d+)\s*=\s*ชั้นปีที่\s*(\d+)/.exec(cohortNote || '');
  const y = Number(year);
  if (!m || !Number.isInteger(y) || y < 1 || y > 6) return null;
  return `Vet ${Number(m[1]) + Number(m[2]) - y}`;
}

/**
 * Where this student stands on a board's rows (best attempt per student, in
 * rank order), as one of:
 *   { kind: 'hidden' }                 opted out: not on any board, by choice
 *   { kind: 'ranked', rank, of }       on the board
 *   { kind: 'absent', of, capped }     shown, but no ranked set here yet
 *                                      (capped: the list is cut at `limit`)
 * null for a guest or rows not loaded.
 */
export function boardStanding(user, rows, { limit = 200 } = {}) {
  if (!user?.id) return null;
  if (!showsOnBoards(user)) return { kind: 'hidden' };
  if (!Array.isArray(rows)) return null;
  const i = rows.findIndex((r) => r?.user_id === user.id);
  if (i >= 0) return { kind: 'ranked', rank: i + 1, of: rows.length };
  return { kind: 'absent', of: rows.length, capped: rows.length >= limit };
}
