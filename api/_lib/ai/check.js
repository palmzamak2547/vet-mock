// ============================================================
// ai/check.js — what the finished answer is checked against
// ============================================================
// Sent as the `check` event after the last word. Two lists, both facts the
// page can show without judging the answer itself:
//
//   ungrounded       numbers the answer states that its sources do not. A
//                    number in a CITED stretch of text ("... 2-3 เดือน [2]")
//                    must appear in the text of the source(s) that stretch
//                    cites; a number in uncited text must appear in some
//                    source. Either way, a number the student wrote (their
//                    messages, the text read off their image) is theirs and
//                    passes. A dose or an interval the model brought from
//                    nowhere is exactly the figure a student copies into an
//                    exam, so it is named rather than silently trusted.
//                    Checking against the CITED source (not the whole
//                    context) matters: measured live, a rabies answer put
//                    "2-3 เดือน" on a source that says "1 ถึง 3 เดือน" about
//                    humans; 2 and 3 both occurred somewhere in the eight
//                    sources, so a context-wide check passed it.
//   invalidCitations [n] markers that point at no source we sent.
//
// Before numbers are compared, three kinds of digits that are not claims are
// taken out: ordered-list markers ("1. ", "2) "), the [n] citation markers
// themselves, and digits inside URLs. The comparison itself is grounding.js's
// (Thai digits, thousands separators and "1200.0" vs "1200" handled there).
// ============================================================

import { numbersIn, ungroundedNumbers } from '../grounding.js';

const CITE_RE = /\[(\d{1,3}(?:\s*[,–-]\s*\d{1,3})*)\]/g;
// One or more citation markers in a row ("[1][3]", "[2] [4]").
const CITE_RUN_RE = /(?:\[\d{1,3}(?:\s*[,–-]\s*\d{1,3})*\]\s*)+/g;

const stripLinks = (s) => String(s ?? '')
  .replace(/\]\((?:[^()\s]|\([^()\s]*\))*\)/g, '] ')
  .replace(/https?:\/\/[^\s)>\]]+/g, ' ');
const LIST_MARKER = /^[ \t]*(?:#{1,6}[ \t]*)?(?:[-*+][ \t]+)?\d{1,3}[.)](?=[ \t]|$)/;

/** The answer with non-claim digits removed (see header). */
export function answerForNumberCheck(answer) {
  return stripLinks(answer)
    .replace(CITE_RE, ' ')
    .split('\n').map((l) => l.replace(LIST_MARKER, ' ')).join('\n');
}

function expand(group) {
  const out = [];
  for (const m of group.matchAll(CITE_RE)) {
    for (const part of m[1].split(/\s*,\s*/)) {
      const [a, b = a] = part.split(/\s*[–-]\s*/).map(Number);
      if (!Number.isInteger(a) || !Number.isInteger(b)) continue;
      // A range is expanded only when it is small; "[1-500]" is not a citation.
      const lo = Math.min(a, b);
      const hi = Math.max(a, b);
      for (let n = lo; n <= hi && n - lo < 20; n++) if (!out.includes(n)) out.push(n);
    }
  }
  return out;
}

/** Every source number an answer cites, in order of first appearance. */
export function citationsIn(answer) {
  const out = [];
  for (const m of String(answer ?? '').matchAll(CITE_RUN_RE)) for (const n of expand(m[0])) if (!out.includes(n)) out.push(n);
  return out;
}

/**
 * The answer cut into stretches, each with the citations that close it.
 * Text after a line's last citation (or a line with none) has no citations.
 */
export function citedSegments(answer) {
  const segments = [];
  for (const rawLine of stripLinks(answer).split('\n')) {
    const line = rawLine.replace(LIST_MARKER, ' ');
    let last = 0;
    for (const m of line.matchAll(CITE_RUN_RE)) {
      segments.push({ text: line.slice(last, m.index), cites: expand(m[0]) });
      last = m.index + m[0].length;
    }
    if (last < line.length) segments.push({ text: line.slice(last), cites: [] });
  }
  return segments.filter((s) => s.text.trim());
}

// English sources spell small numbers out ("three NADC30-like variants",
// "six were validated in vivo") and a Thai answer writes them as digits; the
// spelled-out form in a source counts as that number.
const NUMBER_WORDS = {
  zero: 0, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
  eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15, sixteen: 16, seventeen: 17,
  eighteen: 18, nineteen: 19, twenty: 20, thirty: 30, forty: 40, fifty: 50, hundred: 100,
  single: 1, double: 2, twice: 2, triple: 3, dozen: 12,
};
const NUMBER_WORD_RE = new RegExp(`\\b(${Object.keys(NUMBER_WORDS).join('|')})\\b`, 'gi');
export const withNumberWords = (text) => String(text ?? '').replace(NUMBER_WORD_RE, (w) => `${w} ${NUMBER_WORDS[w.toLowerCase()]} `);

/**
 * @param {string} answer         the text the student saw
 * @param {object} o
 * @param {number} o.sourceCount  how many numbered sources were sent (n = 1..count)
 * @param {string} o.context      every text the answer may draw numbers from
 * @param {string[]} [o.sourceTexts] each source's text, index n-1; enables the
 *                                per-citation check
 * @param {string} [o.studentText] what the student supplied (always allowed)
 * @returns {{ ungrounded: string[], invalidCitations: number[] }}
 */
export function computeCheck(answer, { sourceCount = 0, context = '', sourceTexts = null, studentText = '' } = {}) {
  const invalidCitations = citationsIn(answer).filter((n) => n < 1 || n > sourceCount).sort((a, b) => a - b);
  if (!Array.isArray(sourceTexts)) {
    return { ungrounded: ungroundedNumbers(answerForNumberCheck(answer), withNumberWords(`${context}\n${studentText}`)), invalidCitations };
  }
  const anywhere = numbersIn(withNumberWords(`${context}\n${studentText}\n${sourceTexts.join('\n')}`));
  const student = numbersIn(studentText);
  const per = sourceTexts.map((t) => numbersIn(withNumberWords(t)));
  const out = [];
  for (const seg of citedSegments(answer)) {
    const cites = seg.cites.filter((n) => n >= 1 && n <= per.length);
    for (const x of numbersIn(seg.text)) {
      const ok = cites.length
        ? student.has(x) || cites.some((n) => per[n - 1].has(x))
        : anywhere.has(x);
      if (!ok && !out.includes(x)) out.push(x);
    }
  }
  return { ungrounded: out, invalidCitations };
}
