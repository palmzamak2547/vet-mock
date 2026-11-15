// ============================================================
// wrap-cite.js — a wrap-up line's citation, with its clip minutes openable
// ============================================================
// A wrap-up bullet cites where it was said: "2_2M9bEGpmE [8:39];
// 2_2M9bEGpmE [5:28]; เดค Swine Enteric Diseases หน้า 97". humanSource turns
// that into words, but the minutes stayed text: finding 8:39 meant opening the
// clip and scrubbing. This splits the citation into the clips it names, each
// with the minutes that open it (recordingMoments, momentHref in
// source-label.js), and the rest as readable text.
//
// One clip cited in two pieces of the citation is one entry, at the place it
// was first named, its minutes in the order written and each once. A
// recording the app cannot name (no session, no summarised clip) stays in the
// text exactly as humanSource leaves it, so nothing cited is dropped.
// ============================================================
import { humanSource, questionPointers, recordingMoments, sessionLabel } from './source-label.js';

/**
 * One word for a slide on the wrap-up. The authors wrote "เดค" in their
 * citations and notes, while the page's key and the deck say "สไลด์";
 * src/data/glossary.js names neither, so the page says สไลด์ everywhere.
 * Display only: the stored text keeps "เดค", which lib/wrap-slide.js reads.
 */
export const slideWord = (text) => String(text ?? '').replace(/เดค/g, 'สไลด์');

/**
 * A text piece with the questions it cites taken out as their own parts, so
 * no bank id is printed: [{ kind: 'text', text } | { kind: 'question', pointer }].
 */
function textParts(text, { human = true } = {}) {
  const out = [];
  const s = human ? humanSource(text) : String(text ?? '');
  let at = 0;
  const push = (t) => {
    const clean = human ? slideWord(t).replace(/^[\s,;/+]+|[\s,;/+]+$/g, '').replace(/\s{2,}/g, ' ') : slideWord(t);
    if (clean) out.push({ kind: 'text', text: clean });
  };
  for (const p of questionPointers(s)) {
    push(s.slice(at, p.start));
    out.push({ kind: 'question', pointer: { kind: p.kind, ids: p.ids, remarks: p.remarks, ...(p.range ? { range: true } : {}) } });
    at = p.end;
  }
  push(s.slice(at));
  return out;
}

// The same shape source-label.js reads: an id, then its bracketed times.
// No lookbehind (iOS 14): a start inside a longer token is checked by hand.
const RECORDING = /(?:VET86\s+)?([0-9A-Za-z_-]{11})((?:\s*,?\s*\[[^\]]*\])+)/g;
const ID_CHAR = /[0-9A-Za-z_-]/;

/** The citation with every recording the app can name taken out. */
function withoutNamedRecordings(part) {
  return part.replace(RECORDING, (whole, id, _stamps, offset, all) => {
    if (offset > 0 && ID_CHAR.test(all[offset - 1])) return whole;
    return sessionLabel(id) ? ' ' : whole;
  });
}

/**
 * The clip's name as the page should print it. On a course's own wrap-up,
 * "คลิป อายุรศาสตร์สุกร (7 ต.ค.)" repeats the page's title on every line, so
 * a clip of that course is named by its date alone: "คลิป 7 ต.ค.". A clip of
 * another course, or a taught session ("คาบ 1 (4 ส.ค.)"), keeps its name.
 */
export function shortSession(session, course = '') {
  const m = /^คลิป (.+) \(([^)]+)\)$/.exec(String(session || ''));
  if (m && course && m[1] === course) return `คลิป ${m[2]}`;
  return session;
}

/**
 * [{ kind: 'clip', videoId, session, moments: [{ seconds, stamp, label }] }
 *  | { kind: 'question', pointer: { kind, ids, remarks } } | { kind: 'text', text }]
 * in the order the citation names them.
 * `course` is the page's course name, for shortSession.
 */
export function citeParts(raw, course = '') {
  const out = [];
  const clips = new Map();
  for (const piece of String(raw ?? '').split(/\s*;\s*/)) {
    if (!piece.trim()) continue;
    const moments = recordingMoments(piece);
    if (!moments.length) {
      out.push(...textParts(piece));
      continue;
    }
    // What the piece says besides its clips ("TJ ข้อ 53 (บล็อก 6),") comes first.
    const rest = withoutNamedRecordings(piece).replace(/^[\s,/+]+|[\s,/+]+$/g, '').replace(/\s{2,}/g, ' ');
    if (rest) out.push(...textParts(rest));
    for (const m of moments) {
      let clip = clips.get(m.videoId);
      if (!clip) {
        clip = { kind: 'clip', videoId: m.videoId, session: shortSession(m.session, course), moments: [] };
        clips.set(m.videoId, clip);
        out.push(clip);
      }
      if (!clip.moments.some((x) => x.seconds === m.seconds)) {
        clip.moments.push({ videoId: m.videoId, seconds: m.seconds, stamp: m.stamp, label: m.label });
      }
    }
  }
  return out;
}

/**
 * The wrap-up as the page draws it: every word a student reads says สไลด์
 * (slideWord). Citations (`src`, `sources`) are left as stored: they are
 * parsed for clips, slides and cited questions, and drawn through citeParts,
 * which applies the same word.
 */
export function readingCopy(wrapup) {
  if (!wrapup) return wrapup;
  const line = (l) => (l && typeof l.text === 'string' ? { ...l, text: slideWord(l.text) } : l);
  const text = (t) => (typeof t === 'string' ? slideWord(t) : t);
  return {
    ...wrapup,
    intro: text(wrapup.intro),
    groups: (wrapup.groups || []).map((g) => ({
      ...g,
      formatNote: text(g.formatNote),
      items: (g.items || []).map((it) => ({
        ...it,
        th: text(it.th),
        agent: text(it.agent),
        pitfall: text(it.pitfall),
        keywords: Array.isArray(it.keywords) ? it.keywords.map(text) : it.keywords,
        emphasis: Array.isArray(it.emphasis) ? it.emphasis.map(line) : it.emphasis,
        examined: Array.isArray(it.examined) ? it.examined.map(line) : it.examined,
      })),
    })),
  };
}

/**
 * A sentence the page prints (a line, a pitfall, a lecturer's note) with the
 * questions it names taken out as their own parts, the rest kept exactly as
 * written but for สไลด์: [{ kind: 'text', text } | { kind: 'question', pointer }].
 * `human` also reads the recordings and pages it cites (humanSource), for a
 * note written in citation form.
 */
export const citedText = (text, { human = false } = {}) => textParts(text, { human });
