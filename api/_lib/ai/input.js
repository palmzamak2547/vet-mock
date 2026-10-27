// ============================================================
// ai/input.js — what a chat request must look like before anything is spent
// ============================================================
// Runs before the rate limiter and long before a model: a request that fails
// here costs nothing and gets a 400 with a Thai sentence the page can show.
//
// The contract caps (config.js) are applied with one asymmetry, on purpose:
//   - the CURRENT turn (the last message) is the student's own words, so a
//     turn over the per-message cap is refused and the student is told why;
//   - the HISTORY is what the page echoes back, so it is trimmed instead of
//     refused (oldest messages first, an over-long old answer clipped).
//     A long earlier answer must never make the next question impossible.
//
// The image is checked by its first bytes, not only by the label the page put
// on it: a file named image/png that is not a PNG never reaches the vision
// model.
// ============================================================

import {
  MAX_MESSAGES, MAX_MESSAGE_CHARS, MAX_TOTAL_CHARS, MAX_IMAGE_BYTES, IMAGE_TYPES,
} from './config.js';

export const INPUT_MESSAGES = Object.freeze({
  shape: 'รูปแบบคำขอไม่ถูกต้อง ลองส่งใหม่อีกครั้ง',
  empty: 'ยังไม่มีคำถามที่จะส่ง',
  tooLong: `ข้อความยาวเกิน ${MAX_MESSAGE_CHARS.toLocaleString('en-US')} ตัวอักษร ลองย่อให้สั้นลง`,
  imageType: 'ภาพต้องเป็นไฟล์ JPEG, PNG หรือ WebP',
  imageSize: 'ภาพใหญ่เกิน 3.5 MB ลองย่อขนาดภาพก่อนส่ง',
  imageBad: 'อ่านไฟล์ภาพไม่ได้ หรือไฟล์ไม่ตรงกับชนิดที่ระบุ',
});

const fail = (key) => ({ ok: false, message: INPUT_MESSAGES[key], reason: key });

// Control characters other than tab and newline are never typed by a person;
// they are how a pasted payload hides instructions from the reader.
const clean = (s) => s.replace(/\r\n?/g, '\n').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '');

/** Bytes a base64 string decodes to, without decoding it. */
export function base64Bytes(b64) {
  const s = String(b64 || '');
  const pad = s.endsWith('==') ? 2 : s.endsWith('=') ? 1 : 0;
  return Math.floor((s.length * 3) / 4) - pad;
}

// The first bytes each accepted type must start with.
function magicMatches(mediaType, head) {
  if (mediaType === 'image/jpeg') return head[0] === 0xff && head[1] === 0xd8 && head[2] === 0xff;
  if (mediaType === 'image/png') return head[0] === 0x89 && head[1] === 0x50 && head[2] === 0x4e && head[3] === 0x47;
  if (mediaType === 'image/webp') {
    return head.subarray(0, 4).toString('latin1') === 'RIFF' && head.subarray(8, 12).toString('latin1') === 'WEBP';
  }
  return false;
}

function validateImage(raw) {
  if (raw === null || raw === undefined) return { ok: true, image: null };
  if (typeof raw !== 'object' || Array.isArray(raw)) return fail('imageBad');
  const mediaType = String(raw.mediaType || '').toLowerCase();
  if (!IMAGE_TYPES.includes(mediaType)) return fail('imageType');
  let data = typeof raw.data === 'string' ? raw.data : '';
  // A data URL is the same bytes with a label in front; accept it rather than
  // refuse a page that forgot to cut the prefix off.
  const comma = data.startsWith('data:') ? data.indexOf(',') : -1;
  if (comma >= 0) data = data.slice(comma + 1);
  data = data.replace(/\s+/g, '');
  if (!data || !/^[A-Za-z0-9+/]+={0,2}$/.test(data)) return fail('imageBad');
  if (base64Bytes(data) > MAX_IMAGE_BYTES) return fail('imageSize');
  const head = Buffer.from(data.slice(0, 24), 'base64');
  if (head.length < 12 || !magicMatches(mediaType, head)) return fail('imageBad');
  return { ok: true, image: { mediaType, data } };
}

/**
 * @returns {{ ok: true, messages: Array<{role,content}>, image: {mediaType,data}|null, question: string, trimmed: number }
 *         | { ok: false, message: string, reason: string }}
 */
export function validateChatInput(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return fail('shape');
  const raw = body.messages;
  if (!Array.isArray(raw) || raw.length === 0) return fail('empty');

  const messages = [];
  for (const m of raw) {
    if (!m || typeof m !== 'object') return fail('shape');
    if (m.role !== 'user' && m.role !== 'assistant') return fail('shape');
    if (typeof m.content !== 'string') return fail('shape');
    messages.push({ role: m.role, content: clean(m.content) });
  }

  const imageCheck = validateImage(body.image);
  if (!imageCheck.ok) return imageCheck;
  const image = imageCheck.image;

  const last = messages[messages.length - 1];
  if (last.role !== 'user') return fail('shape');
  if (last.content.length > MAX_MESSAGE_CHARS) return fail('tooLong');
  if (!last.content.trim() && !image) return fail('empty');

  // History: newest MAX_MESSAGES, each clipped, then oldest dropped until the
  // whole conversation fits the character budget.
  let kept = messages.slice(-MAX_MESSAGES).map((m, i, all) => (
    i === all.length - 1 ? m : { ...m, content: m.content.slice(0, MAX_MESSAGE_CHARS) }
  ));
  let total = kept.reduce((n, m) => n + m.content.length, 0);
  while (kept.length > 1 && total > MAX_TOTAL_CHARS) {
    total -= kept[0].content.length;
    kept = kept.slice(1);
  }
  // A conversation handed to a model starts with the student speaking.
  while (kept.length > 1 && kept[0].role !== 'user') kept = kept.slice(1);

  return {
    ok: true,
    messages: kept,
    image,
    question: last.content.trim(),
    trimmed: messages.length - kept.length,
  };
}
