// ============================================================
// tts-text — the words a read-aloud says, shared by the browser and
// the clip generator (scripts/tts-clips.mjs)
// ============================================================
//
// Pre-generated question audio is looked up by a hash of the exact text
// sent to the voice. The page and the generator must therefore build that
// text with the same code, which is why it lives here and nowhere else.
// Changing anything below changes the hashes: every clip becomes a miss
// (the page falls back to the live voices) until the generator reruns.
// ============================================================

// Markdown and stray markup sound wrong when spoken.
export function stripForSpeech(s) {
  if (!s) return '';
  return String(s)
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/_([^_]+)_/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/[#>~]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// Symbols that confuse TTS — replace with words appropriate to the
// surrounding language. Also handles fill-in-blank underscore runs
// (Pattara would read "_____" as "ขีดล่างๆๆๆๆๆ" — ugly) and dash
// ranges like "5-10" (Pattara reads as "5 ลบ 10" subtraction).
export function normalizeSymbols(text, lang) {
  if (!text) return text;
  const isEn = lang === 'en';
  return text
    // Fill-in-the-blank: 2+ underscores in a row → "ช่องว่าง" / "blank"
    // Single underscore (e.g. in a variable name) kept as-is.
    .replace(/_{2,}/g, isEn ? ' blank ' : ' ช่องว่าง ')
    // Numeric ranges with hyphen/dash/en-dash: "5-10" / "5–10" → "5 ถึง 10"
    // Run BEFORE we touch unit slashes so we don't accidentally absorb the
    // hyphen inside drug names like "Sulfa-Trimethoprim".
    .replace(/(\d+(?:\.\d+)?)\s*[-–]\s*(\d+(?:\.\d+)?)/g, (m, a, b) => `${a} ${isEn ? 'to' : 'ถึง'} ${b}`)
    // Three-or-more dots (ellipsis) → comma pause (browser ignores literal dots)
    .replace(/\.{3,}/g, ', ')
    .replace(/…/g, ', ')
    // Arrows
    .replace(/→|⇒|->/g, isEn ? ' to ' : ' ไป ')
    .replace(/×/g, isEn ? ' times ' : ' คูณ ')
    .replace(/±/g, isEn ? ' plus or minus ' : ' บวกลบ ')
    .replace(/≥/g, isEn ? ' greater than or equal to ' : ' มากกว่าหรือเท่ากับ ')
    .replace(/≤/g, isEn ? ' less than or equal to ' : ' น้อยกว่าหรือเท่ากับ ')
    .replace(/%/g, isEn ? ' percent' : ' เปอร์เซ็นต์')
    // "5 mg/kg" → "5 mg per kg" (preprocessor for unit expansion below)
    .replace(/(\d+(?:\.\d+)?\s*[a-zA-Zµμ]+)\/([a-zA-Zµμ]+)/g, (m, a, b) => `${a} ${isEn ? 'per' : 'ต่อ'} ${b}`)
    // Trailing "/min", "/hr"
    .replace(/\/min\b/g, isEn ? ' per minute' : ' ต่อนาที')
    .replace(/\/hr\b|\/h\b/g, isEn ? ' per hour' : ' ต่อชั่วโมง')
    .replace(/\/day\b|\/d\b/g, isEn ? ' per day' : ' ต่อวัน')
    // Veterinary dosing frequency — "q12h" / "q4h" / "q8h" etc.
    // Format: q<number>h means "every N hours". Pattara reads "q12h"
    // letter-by-letter ("คิว ทเวลฟ์ เอช") — confusing. Replace with
    // natural Thai/English phrasing.
    .replace(/\bq(\d+)h\b/gi, (m, n) => isEn ? `every ${n} hours` : `ทุก ${n} ชั่วโมง`)
    // Latin abbreviations for daily frequency (SID/BID/TID/QID).
    // SID = once a day, BID = twice, TID = 3×, QID = 4×.
    .replace(/\bSID\b/g, isEn ? 'once a day' : 'วันละครั้ง')
    .replace(/\bBID\b/g, isEn ? 'twice a day' : 'วันละสองครั้ง')
    .replace(/\bTID\b/g, isEn ? 'three times a day' : 'วันละสามครั้ง')
    .replace(/\bQID\b/g, isEn ? 'four times a day' : 'วันละสี่ครั้ง')
    // PRN = as needed
    .replace(/\bPRN\b/g, isEn ? 'as needed' : 'เมื่อจำเป็น');
}

// Common clinical units. Thai voices mangle these letter-by-letter.
const UNIT_TH = {
  mg: 'มิลลิกรัม', kg: 'กิโลกรัม', g: 'กรัม', ml: 'มิลลิลิตร', mL: 'มิลลิลิตร',
  l: 'ลิตร', L: 'ลิตร', µg: 'ไมโครกรัม', mcg: 'ไมโครกรัม', ug: 'ไมโครกรัม',
  bpm: 'ครั้งต่อนาที', mmHg: 'มิลลิเมตรปรอท', cm: 'เซนติเมตร', mm: 'มิลลิเมตร',
  hr: 'ชั่วโมง', min: 'นาที', sec: 'วินาที',
};
const UNIT_EN = {
  mg: 'milligrams', kg: 'kilograms', g: 'grams', ml: 'milliliters', mL: 'milliliters',
  l: 'liters', L: 'liters', µg: 'micrograms', mcg: 'micrograms', ug: 'micrograms',
  bpm: 'beats per minute', mmHg: 'millimeters of mercury',
  cm: 'centimeters', mm: 'millimeters',
  hr: 'hours', min: 'minutes', sec: 'seconds',
};
export function expandUnits(text, lang) {
  if (!text) return text;
  const map = lang === 'en' ? UNIT_EN : UNIT_TH;
  return text
    // "5 mg" / "0.5 mcg" — number-prefixed units
    .replace(/(\d+(?:\.\d+)?)\s*([a-zA-Zµμ]{1,5})\b/g, (m, num, unit) => {
      const expanded = map[unit];
      if (!expanded) return m;
      return `${num} ${expanded}`;
    })
    // "ต่อ kg" / "per kg" — bare units after a preposition word
    // (normalizeSymbols above turns "mg/kg" into "mg ต่อ kg", so the
    // trailing "kg" loses its leading number and needs this catch).
    .replace(/(ต่อ|per)\s+([a-zA-Zµμ]{1,5})\b/g, (m, prep, unit) => {
      const expanded = map[unit];
      if (!expanded) return m;
      return `${prep} ${expanded}`;
    });
}


const THAI_RE = /[฀-๿]/;
const ENG_RE = /[A-Za-z]/;

// One voice language per question, decided by the stem: Thai unless Thai
// letters are under a quarter of the stem's letters (see speakQuestion).
export function questionLang(stem, options = []) {
  const target = (stem || '').trim() || ((stem || '') + ' ' + options.join(' '));
  let th = 0, en = 0;
  for (const ch of target) {
    if (THAI_RE.test(ch)) th++;
    else if (ENG_RE.test(ch)) en++;
  }
  const total = th + en;
  return (total > 0 && th / total < 0.25 && en > 0) ? 'en' : 'th';
}

// ── Shared pre-generated clips (Gemini 3.8 Flash TTS, voice Kore) ──
// Stored on R2 behind tts.vetmock.com, one AAC file per piece of text,
// named by the hash below. The model reads English terms itself, so the
// clip text skips the Thai phonetic spelling the device voices need; it
// keeps symbol and unit words (mg/kg, q12h, BID) so they read as words.
export const SHARED_TTS = Object.freeze({
  model: 'gemini-3.8-flash-tts',
  voice: 'Kore',
  base: 'https://tts.vetmock.com',
  gen: 'g1',
});

export function clipText(raw, lang) {
  return expandUnits(normalizeSymbols(stripForSpeech(raw), lang), lang).replace(/\s+/g, ' ').trim();
}

// The label read before each option: the same letter the option's chip shows.
export function optionLabel(displayIdx, lang) {
  const letter = String.fromCharCode(65 + displayIdx);
  return lang === 'en' ? `Option ${letter}.` : `ตัวเลือก ${letter}`;
}

// 64-bit hex name of a clip: model, voice and the exact text.
export async function clipKey(text) {
  const data = new TextEncoder().encode(`${SHARED_TTS.model}|${SHARED_TTS.voice}|${text}`);
  const buf = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(buf)).slice(0, 8).map((b) => b.toString(16).padStart(2, '0')).join('');
}

// .mp4, not .m4a: Cloudflare's edge caches .mp4 by default (72 ms against
// 230 ms from the bucket, measured 2026-10-21) and has no rule for .m4a.
export const clipUrl = (key) => `${SHARED_TTS.base}/${SHARED_TTS.gen}/${key}.mp4`;
export const manifestUrl = (subject) => `${SHARED_TTS.base}/${SHARED_TTS.gen}/m/${encodeURIComponent(subject)}.json`;
