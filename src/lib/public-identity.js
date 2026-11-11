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

/** The pictures a student can pick: animals a vet student meets. */
export const PICTURES = Object.freeze([
  { emoji: '🐾', label: 'รอยเท้า' },
  { emoji: '🐶', label: 'สุนัข' },
  { emoji: '🐱', label: 'แมว' },
  { emoji: '🐰', label: 'กระต่าย' },
  { emoji: '🐹', label: 'แฮมสเตอร์' },
  { emoji: '🐴', label: 'ม้า' },
  { emoji: '🐮', label: 'วัว' },
  { emoji: '🐷', label: 'หมู' },
  { emoji: '🐑', label: 'แกะ' },
  { emoji: '🐐', label: 'แพะ' },
  { emoji: '🐔', label: 'ไก่' },
  { emoji: '🦆', label: 'เป็ด' },
  { emoji: '🐢', label: 'เต่า' },
  { emoji: '🐠', label: 'ปลา' },
  { emoji: '🦜', label: 'นกแก้ว' },
  { emoji: '🐍', label: 'งู' },
]);
export const DEFAULT_PICTURE = '🐾';
export const isPicture = (value) => PICTURES.some((p) => p.emoji === value);
export const pictureLabel = (value) => PICTURES.find((p) => p.emoji === value)?.label || 'รูปที่ตั้งไว้';

// Words a name may not contain: they would read as the app or its staff
// speaking. Compared without case, spaces, dots, dashes or underscores.
export const RESERVED = Object.freeze([
  'admin', 'administrator', 'staff', 'vetmock', 'moderator', 'support', 'system',
  'official', 'owner', 'root',
  'แอดมิน', 'ทีมงาน', 'ผู้ดูแล', 'เจ้าหน้าที่', 'อาจารย์',
]);
const RESERVED_EXACT = Object.freeze(['mod', 'dev', 'team', 'null', 'undefined']);

// Invisible characters that let two names look the same, or reorder text.
const INVISIBLE = /[\u0000-\u001f\u007f-\u009f­؜᠎​-‏‪-‮⁠-⁯﻿]/g;
const ALLOWED = /^[\p{Script=Thai}A-Za-z0-9_ .-]+$/u;
const HAS_LETTER = /[ก-ฮA-Za-z]/;
const toAsciiDigits = (s) => s.replace(/[๐-๙]/g, (d) => String(d.charCodeAt(0) - 0x0e50));

/** The name as it will be stored: NFC, no invisible characters, one space. */
export function normalizePublicName(raw) {
  return String(raw ?? '')
    .normalize('NFC')
    .replace(INVISIBLE, '')
    .replace(/\s+/g, ' ')
    .trim();
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
  if (/\d{5,}/.test(toAsciiDigits(value).replace(/[ ._-]/g, ''))) {
    return no('มีตัวเลขติดกันมากไป อาจอ่านเป็นรหัสนิสิต ใช้ไม่เกิน 4 ตัว');
  }
  if (!HAS_LETTER.test(value)) return no('ต้องมีตัวอักษรอย่างน้อยหนึ่งตัว');
  const local = emailLocalPart(email);
  if (local && value.toLowerCase() === local) return no('ชื่อนี้มาจากอีเมลของคุณ เลือกชื่ออื่น');
  const compact = value.toLowerCase().replace(/[\s._-]/g, '');
  if (RESERVED_EXACT.includes(compact) || RESERVED.some((word) => compact.includes(word))) {
    return no('ชื่อนี้ใช้ไม่ได้ เพราะอ่านเหมือนทีมงานของแอป');
  }
  if (isAutoName(value, email)) return no('ชื่อนี้ระบบตั้งให้ เลือกชื่อของคุณเอง');
  return { ok: true, value };
}

/** Thai for what the database said when it refused a profile write. */
export function identityWriteError(error) {
  const code = error?.code || '';
  const text = `${code} ${error?.message || ''} ${error?.details || ''}`;
  if (code === '23505' || /duplicate key|unique/i.test(text)) return 'ชื่อนี้มีคนใช้แล้ว ลองชื่ออื่น';
  if (code === '23514' || /check constraint/i.test(text)) return `ชื่อต้องยาว ${NAME_MIN} ถึง ${NAME_MAX} ตัวอักษร`;
  if (code === '42501' || /row-level security|permission denied/i.test(text)) return 'บันทึกไม่ได้ เพราะบัญชีนี้ไม่มีสิทธิ์แก้ข้อมูลนี้ ลองออกจากระบบแล้วเข้าใหม่';
  if (/fetch|network|timeout|offline/i.test(text)) return 'บันทึกไม่สำเร็จ เพราะการเชื่อมต่อขาดหาย ลองอีกครั้ง';
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
  { id: 'online', label: 'รายชื่อคนที่กำลังอ่าน', shows: 'ชื่อและรูป ขณะเปิดแอป', followsChoice: true },
  { id: 'comments', label: 'ความเห็นในข้อสอบ', shows: 'ชื่อและรูป ข้างความเห็นที่คุณเขียน', followsChoice: false },
  { id: 'group-members', label: 'สมาชิกกลุ่มที่คุณเข้า', shows: 'ชื่อและรูป', followsChoice: false },
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
