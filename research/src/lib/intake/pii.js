// Personal-identifier columns [M1-DESIGN.md 8.3; methods.md 5.9]. Detected at import, hidden from the
// grid and every export by default, masked on screen when shown ('ช*** ร***', '08x-xxx-xx07').
// A design default under Thailand's PDPA, not legal advice. OWNER: intake role.
import { thaiDigitsToArabic } from './thai.js';
import { CANDIDATE_MISSING_CODES } from './missing.js';

const H_PHONE = /โทร|เบอร์|มือถือ|phone|tel\b|telephone|mobile|contact\s*no/i;
const H_PERSON = /นามสกุล|เจ้าของ|ผู้เลี้ยง|เกษตรกร|ผู้ตอบ|owner|farmer|respondent|first\s*name|last\s*name|surname/i;
const H_NAME = /ชื่อ|\bname\b/i;
const H_NOT_PERSON = /สัตว์|สุนัข|หมา|แมว|โค|วัว|สุกร|หมู|ไก่|ม้า|ยา|วัคซีน|ฟาร์ม|พันธุ์|โรค|เชื้อ|animal|pet|dog|cat|cow|cattle|pig|horse|drug|vaccine|farm|breed|disease|species/i;
const H_ADDRESS = /ที่อยู่|บ้านเลขที่|address/i;
const H_LINE = /line|ไลน์/i;
const H_NATIONAL = /บัตรประชาชน|เลขประจำตัว|citizen|national\s*id/i;

const TITLES = /^(นาย|นางสาว|นาง|น\.ส\.|ด\.ช\.|ด\.ญ\.|ดร\.|mr\.?|mrs\.?|ms\.?|miss|dr\.?)\s*/i;
const THAI_WORD = /^[ก-๎]+$/u;
const LATIN_NAME_WORD = /^[A-Z][a-z'-]+$/;
const EMAIL = /^[^@\s]+@[^@\s]+\.[A-Za-z]{2,}$/;
const LINE_ID = /^@?[A-Za-z0-9._-]{3,30}$/;
const ADDRESS_WORDS = /(หมู่|ม\.\s?\d|ต\.|อ\.|จ\.|ตำบล|อำเภอ|จังหวัด|ถนน|ถ\.|ซอย|ซ\.|แขวง|เขต|\bmoo\b|\broad\b|\bsoi\b|district|province)/i;

const digitsOf = (s) => thaiDigitsToArabic(s).replace(/\D/g, '');

/** Thai 13-digit national ID checksum: sum of d_i x (13 - i) over the first 12 digits; check = (11 - sum mod 11) mod 10. */
export function isThaiNationalId(value) {
  const s = thaiDigitsToArabic(String(value).trim());
  if (!/^\d[\d\s-]*$/.test(s)) return false;
  const d = s.replace(/\D/g, '');
  if (d.length !== 13) return false;
  let sum = 0;
  for (let i = 0; i < 12; i++) sum += Number(d[i]) * (13 - i);
  return (11 - (sum % 11)) % 10 === Number(d[12]);
}

/**
 * A Thai phone number shape: 9 or 10 digits starting with 0 (landline 02-xxx-xxxx, mobile
 * 08x-xxx-xxxx), or +66 / 66 with the leading 0 dropped; separators - . space ( ) allowed.
 */
export function isThaiPhone(value) {
  const s = thaiDigitsToArabic(String(value).trim());
  if (!/^[+\d][\d\s().-]*$/.test(s)) return false;
  const d = s.replace(/\D/g, '');
  if (/^0\d{8,9}$/.test(d)) return true;
  return /^66\d{8,9}$/.test(d) && (s.startsWith('+66') || s.startsWith('66'));
}

function looksLikeName(v) {
  const s = v.replace(TITLES, '').trim();
  if (!s) return false;
  const words = s.split(' ');
  if (words.length < 1 || words.length > 4) return false;
  return words.every((w) => THAI_WORD.test(w)) || words.every((w) => LATIN_NAME_WORD.test(w));
}

const share = (vals, pred) => (vals.length ? vals.filter(pred).length / vals.length : 0);

/**
 * @param {string[]} values   cleaned cell text
 * @param {string} header
 * @returns {{ kind: 'name'|'phone'|'national-id'|'address'|'line-id'|'email', share: number } | null}
 *   share = fraction of the non-missing values that fit the kind. national-id checks the 13-digit
 *   Thai ID checksum; phone matches Thai mobile and landline shapes
 */
export function detectPii(values, header) {
  const h = String(header || '');
  const vals = values.map((v) => (v == null ? '' : String(v).trim())).filter((v) => !CANDIDATE_MISSING_CODES.includes(v));
  if (!vals.length) return null;
  const nid = share(vals, isThaiNationalId);
  if (nid >= 0.6 || (H_NATIONAL.test(h) && nid >= 0.3)) return { kind: 'national-id', share: nid };
  const email = share(vals, (v) => EMAIL.test(v));
  if (email >= 0.6) return { kind: 'email', share: email };
  const phone = share(vals, isThaiPhone);
  if (phone >= 0.6 || (H_PHONE.test(h) && phone >= 0.3)) return { kind: 'phone', share: phone };
  if (H_LINE.test(h) && !H_PHONE.test(h)) {
    const line = share(vals, (v) => LINE_ID.test(v));
    if (line >= 0.6) return { kind: 'line-id', share: line };
  }
  const addr = share(vals, (v) => ADDRESS_WORDS.test(v) && /\d/.test(thaiDigitsToArabic(v)));
  if ((H_ADDRESS.test(h) && addr >= 0.3) || addr >= 0.6) return { kind: 'address', share: addr };
  const titled = share(vals, (v) => TITLES.test(v));
  const named = share(vals, looksLikeName);
  if (titled >= 0.5) return { kind: 'name', share: Math.max(titled, named) };
  const personHeader = H_PERSON.test(h) || (H_NAME.test(h) && !H_NOT_PERSON.test(h));
  if (personHeader && named >= 0.6) return { kind: 'name', share: named };
  return null;
}

/**
 * Mask a value for display. Phone and ID keep their separators; names keep the first letter of each word.
 * @param {string} value @param {'name'|'phone'|'national-id'|'address'|'line-id'|'email'} kind @returns {string}
 */
export function maskValue(value, kind) {
  const s = value == null ? '' : String(value);
  if (!s.trim()) return s;
  if (kind === 'phone' || kind === 'national-id') {
    const total = digitsOf(s).length;
    const keepHead = kind === 'phone' ? 2 : 0;
    const keepTail = kind === 'phone' ? 2 : 4;
    let i = 0;
    let out = '';
    for (const ch of thaiDigitsToArabic(s)) {
      if (/\d/.test(ch)) {
        out += i < keepHead || i >= total - keepTail ? ch : 'x';
        i += 1;
      } else out += ch;
    }
    return out;
  }
  if (kind === 'email') {
    const at = s.indexOf('@');
    return at > 0 ? `${Array.from(s)[0]}***${s.slice(at)}` : '***';
  }
  if (kind === 'address') return '***';
  // name and line-id: the first letter of each word, then three stars
  return s.trim().split(/\s+/).map((w) => `${Array.from(w)[0]}***`).join(' ');
}
