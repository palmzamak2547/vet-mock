// ============================================================
// source-label.js — a citation a student can read
// ============================================================
// Questions and the exam wrap-ups cite where a fact came from, and the
// pointers were written the way the authors work: "7XyI0SjnuBA [12:34]",
// "deck oh-vet-role.pdf p4", "MID 86 audit p71". An eleven-character
// YouTube id means nothing to the นิสิต reading it at midnight; the same
// pointer as "คาบ 1 (4 ส.ค.) นาที 12:34" means the recording they sat in.
//
// Only the DISPLAY changes. The stored pointer stays exactly as written, so
// it still traces back to the source and the lints that read it are
// unaffected. Anything this cannot recognise is returned untouched, because
// an honest raw pointer beats a pretty guess.
// ============================================================
import { LECTURER_SETS } from '../data/lecturer-sets.js';

const TH_MONTH = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
const thaiDate = (iso) => {
  const [, m, d] = String(iso || '').split('-').map(Number);
  return m ? `${d} ${TH_MONTH[m - 1]}` : '';
};

/** videoId -> the session(s) that recording is. One recording can carry two
 *  timetabled sessions (One Health 9 and 16 ก.ย. share a video). */
const SESSIONS = (() => {
  const map = new Map();
  for (const set of Object.values(LECTURER_SETS)) {
    for (const lec of set.lecturers) {
      for (const s of lec.sessions) {
        if (!s.videoId) continue;
        const row = map.get(s.videoId) || { ns: [], dates: [] };
        row.ns.push(s.n);
        row.dates.push(s.date);
        map.set(s.videoId, row);
      }
    }
  }
  return map;
})();

/** "คาบ 1 (4 ส.ค.)" for a recording, or null when it is not a taught session. */
export function sessionLabel(videoId) {
  const row = SESSIONS.get(videoId);
  if (!row) return null;
  const ns = [...new Set(row.ns)];
  const date = thaiDate(row.dates[0]);
  return `คาบ ${ns.join(' และ ')}${date ? ` (${date})` : ''}`;
}

// A YouTube id is 11 characters of [A-Za-z0-9_-]. Matching it anywhere would
// hit ordinary words, so each pattern below also requires the shape the
// authors write around it: a timestamp bracket, or a "VET86 " prefix.
const ID = '[0-9A-Za-z_-]{11}';

/**
 * One citation string, rewritten for a reader. Unrecognised text is kept.
 * Examples:
 *   "7XyI0SjnuBA [12:34]"            -> "คาบ 1 (4 ส.ค.) นาที 12:34"
 *   "VET86 8ekNMuG25gI [6:15-7:09]"  -> "คาบ 2 (11 ส.ค.) นาที 6:15-7:09"
 *   "deck oh-vet-role.pdf p4, p7"    -> "สไลด์ หน้า 4, 7"
 *   "MID 86 audit p71"               -> "บันทึกรุ่นพี่ หน้า 71"
 *   "TJ p5, ข้อสอบเก่า 202275"        -> "ชีทรุ่นพี่ หน้า 5, ข้อสอบเก่า 202275"
 */
export function humanSource(raw) {
  let s = String(raw ?? '').trim();
  if (!s) return '';

  // A recording, with or without the VET86 prefix, followed by its brackets.
  // The authors write runs like "[5:24], [3:47-4:01]", so commas between
  // brackets belong to the same citation.
  s = s.replace(new RegExp(`(?:VET86\\s+)?(${ID})((?:\\s*,?\\s*\\[[^\\]]*\\])+)`, 'g'), (whole, id, stamps) => {
    const label = sessionLabel(id);
    if (!label) return whole;
    const times = [...stamps.matchAll(/\[([^\]]*)\]/g)].map((m) => m[1].trim()).filter(Boolean);
    return times.length ? `${label} นาที ${times.join(', ')}` : label;
  });
  // A recording named on its own, no timestamp.
  s = s.replace(new RegExp(`(?:VET86\\s+)?(${ID})(?![0-9A-Za-z_-])`, 'g'), (whole, id) => sessionLabel(id) || whole);

  // A page list, written as "p4, p7" or "p12-13": the reader wants the
  // numbers, not the repeated p.
  const pages = '\\d+(?:\\s*[-–]\\s*\\d+)?(?:\\s*,\\s*p?\\.?\\s*\\d+(?:\\s*[-–]\\s*\\d+)?)*';
  const tidyPages = (list) => list.replace(/p\.?\s*/gi, '').replace(/\s*,\s*/g, ', ').trim();
  const pageRule = (pattern, label) => {
    s = s.replace(new RegExp(`${pattern}\\s*p\\.?\\s*(${pages})`, 'gi'), (_w, list) => `${label} หน้า ${tidyPages(list)}`);
  };

  // Slides. The file name is the deck the cover already shows, so only the
  // page numbers carry information here.
  pageRule('\\bdeck\\s+[\\w.-]*\\.pdf', 'สไลด์');
  pageRule('\\bdeck', 'สไลด์');
  pageRule('\\bslide', 'สไลด์');

  // The compilations.
  pageRule('\\b(?:MID\\s*86\\s+)?audit', 'บันทึกรุ่นพี่');
  pageRule('\\bTJ', 'ชีทรุ่นพี่');

  // A past paper that arrived as a graded export, cited by part and item number.
  // The stored pointer keeps the paper's short name so it still traces back; the
  // reader only needs to know which part and which number.
  s = s.replace(/\bRUM\s*MID\s+(tf|mcq)\s*(\d+)\b/gi, (_w, kind, n) => `ข้อสอบเก่า ตอน${kind.toLowerCase() === 'tf' ? 'ถูก/ผิด' : 'ปรนัย'} ข้อ ${n}`);

  // The governed notes, written as "notes-85 avian-nd 1.2_IBV p.2".
  s = s.replace(/\bnotes-(?:85|y5)\s+[\w-]+\s*/gi, 'โน้ตวิชา ');

  // A scanned page of a senior's paper, stored by its file path. The path is
  // the ingest's business; the reader only needs to know it is a scan.
  s = s.replace(/\bimages\/[\w-]+\.(?:jpe?g|png|webp)\s*/gi, 'ภาพสแกนข้อสอบเก่า ');

  return s.replace(/\s{2,}/g, ' ').trim();
}

/** Several citations separated by ; or , kept as separate readable pieces. */
export function humanSourceParts(raw) {
  return String(raw ?? '')
    .split(/\s*;\s*/)
    .map((p) => humanSource(p))
    .filter(Boolean);
}

// ── A cited moment a student can open ─────────────────────────────
// "คาบ 3 นาที 26:48" tells the นิสิต where the fact was taught, but finding
// that minute meant opening the clip and scrubbing to it by hand. These turn
// the same pointer into the clip and the second it names.

/**
 * A bracketed time as the authors write it, in seconds: "26:48", "129:25"
 * (a long recording's player counts minutes past the hour) or "1:02:03".
 * null when the text is not a time.
 */
export function citeSeconds(stamp) {
  const m = /^(\d{1,3}):(\d{2})(?::(\d{2}))?$/.exec(String(stamp ?? '').trim());
  if (!m) return null;
  const [a, b] = [Number(m[1]), Number(m[2])];
  if (b > 59) return null;
  if (m[3] === undefined) return a * 60 + b;
  const c = Number(m[3]);
  return c > 59 ? null : a * 3600 + b * 60 + c;
}

const RECORDING = new RegExp(`(?<![0-9A-Za-z_-])(?:VET86\\s+)?(${ID})((?:\\s*,?\\s*\\[[^\\]]*\\])+)`, 'g');

/**
 * Every moment of a taught session one citation names, in order and once
 * each: { videoId, seconds, stamp, session, label }. A bracket can hold a list
 * ("[131:42-133:10, 121:47]"), and a range opens at its first second. An id
 * that is not a taught session is skipped, as humanSource leaves it unnamed.
 */
export function recordingMoments(raw) {
  const out = [];
  const seen = new Set();
  for (const [, videoId, brackets] of String(raw ?? '').matchAll(RECORDING)) {
    const session = sessionLabel(videoId);
    if (!session) continue;
    for (const [, inside] of brackets.matchAll(/\[([^\]]*)\]/g)) {
      for (const item of inside.split(',')) {
        const stamp = item.trim();
        const seconds = citeSeconds(stamp.split(/\s*[-–]\s*/)[0]);
        if (seconds === null || seen.has(`${videoId}@${seconds}`)) continue;
        seen.add(`${videoId}@${seconds}`);
        out.push({ videoId, seconds, stamp, session, label: `${session} นาที ${stamp}` });
      }
    }
  }
  return out;
}

// The second rides as "at", not YouTube's "t": App reads "t" on any address it
// boots on as a shared quiz's sender time (share-link.js), and a moment link
// carrying it opened a tab that believed a friend had sent a challenge.
export const MOMENT_SECOND_PARAM = 'at';

/** Where a moment opens: the clip page, playing that clip from that second. */
export function momentHref({ videoId, seconds }) {
  return `/app/videos?v=${encodeURIComponent(videoId)}&${MOMENT_SECOND_PARAM}=${seconds}`;
}

/** The moment a /app/videos address asks for, or null when it names no clip. */
export function momentFromSearch(search) {
  const params = new URLSearchParams(search || '');
  const videoId = params.get('v') || '';
  if (!new RegExp(`^${ID}$`).test(videoId)) return null;
  const seconds = Number(params.get(MOMENT_SECOND_PARAM) || 0);
  // A second that is not one plays the clip from its start rather than not at all.
  return { videoId, seconds: Number.isInteger(seconds) && seconds >= 0 && seconds <= 86400 ? seconds : 0 };
}
