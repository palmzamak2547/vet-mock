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
import { humanSource, recordingMoments, sessionLabel } from './source-label.js';

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
 *  | { kind: 'text', text }] in the order the citation names them.
 * `course` is the page's course name, for shortSession.
 */
export function citeParts(raw, course = '') {
  const out = [];
  const clips = new Map();
  for (const piece of String(raw ?? '').split(/\s*;\s*/)) {
    if (!piece.trim()) continue;
    const moments = recordingMoments(piece);
    if (!moments.length) {
      const text = humanSource(piece);
      if (text) out.push({ kind: 'text', text });
      continue;
    }
    // What the piece says besides its clips ("TJ ข้อ 53 (บล็อก 6),") comes first.
    const rest = withoutNamedRecordings(piece).replace(/^[\s,/+]+|[\s,/+]+$/g, '').replace(/\s{2,}/g, ' ');
    const text = rest ? humanSource(rest) : '';
    if (text) out.push({ kind: 'text', text });
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
