// ============================================================
// canvas-wrap — wrap text on a canvas without breaking Thai
// ============================================================
// canvas has no layout engine, so a card has to cut its own lines. The first
// version split on spaces only, and Thai has none: a long Thai stem was one
// "word", measured once, and ran straight past the edge of the card.
//
// This breaks lines the way the browser would for running text:
//
//   1. Break points come from Intl.Segmenter('th', word). Its Thai
//      dictionary finds the word boundaries, so a line ends between words.
//      Punctuation stays with the word it follows; an opening bracket or
//      quote stays with the word it opens.
//   2. A word wider than a whole line is broken by grapheme, the last
//      resort, and it still never separates a base character from the marks
//      that belong to it. Thai needs two extra rules on top of graphemes: a
//      following vowel (ะ า ำ ๅ ๆ) cannot start a line, and a leading vowel
//      (เ แ โ ใ ไ) cannot end one.
//   3. Without Intl.Segmenter (old engines) the text is cut at spaces and, for
//      a word wider than the line, by the same grapheme rule.
//
// `measure(text)` returns the width in pixels, so the module is pure and
// testable without a canvas; drawWrappedText wires it to a 2D context.
// ============================================================

// ะ ั า ำ ิ-ฺ ๅ ๆ ็-๎ : follow a consonant, so they cannot begin a line.
const NO_LINE_START = /^[ะ-ฺๅ-๎]/;
// เ แ โ ใ ไ : typed before their consonant, so they cannot end a line.
const NO_LINE_END = /[เ-ไ]$/;
const SPACE = /^\s+$/;
const PUNCT_ONLY = /^[\p{P}\p{S}]+$/u;
const OPENING = /^[\p{Ps}\p{Pi}]+$/u;

let wordSegmenter;
let graphemeSegmenter;
function segmenters() {
  if (wordSegmenter === undefined) {
    try {
      wordSegmenter = typeof Intl !== 'undefined' && Intl.Segmenter
        ? new Intl.Segmenter('th', { granularity: 'word' })
        : null;
      graphemeSegmenter = wordSegmenter ? new Intl.Segmenter('th', { granularity: 'grapheme' }) : null;
    } catch {
      wordSegmenter = null;
      graphemeSegmenter = null;
    }
  }
  return { word: wordSegmenter, grapheme: graphemeSegmenter };
}

const pieces = (segmenter, text) => Array.from(segmenter.segment(text), (s) => s.segment);

/**
 * Join pieces that must not be pulled apart; whitespace pieces are never
 * merged. With `punctuation`, a closing mark sticks to the word before it and
 * an opening mark (or any mark that follows a space) sticks to the word after.
 * The Thai vowel rules always apply.
 */
function glue(parts, { punctuation }) {
  const out = [];
  let carry = '';
  for (const part of parts) {
    if (SPACE.test(part)) {
      if (carry) { out.push(carry); carry = ''; }
      out.push(part);
      continue;
    }
    const prev = out[out.length - 1];
    const afterWord = prev !== undefined && !SPACE.test(prev);
    const mark = punctuation && PUNCT_ONLY.test(part);
    if (mark && (OPENING.test(part) || !afterWord)) {
      carry += part;
      continue;
    }
    const piece = carry + part;
    carry = '';
    if (afterWord && (mark || NO_LINE_START.test(piece) || NO_LINE_END.test(prev))) {
      out[out.length - 1] = prev + piece;
      continue;
    }
    out.push(piece);
  }
  if (carry) out.push(carry);
  return out;
}

// 38.0-39.2 reads as one figure, so a range is not broken at its hyphen.
function joinRanges(units) {
  const out = [];
  for (const unit of units) {
    const prev = out[out.length - 1];
    if (prev !== undefined && /\d\p{Pd}$/u.test(prev) && /^\d/.test(unit)) out[out.length - 1] = prev + unit;
    else out.push(unit);
  }
  return out;
}

/** Words and spaces, in order: the places a line may break are between them. */
export function breakUnits(text, { segment = true } = {}) {
  const s = String(text ?? '');
  if (!s) return [];
  const { word } = segment ? segmenters() : {};
  if (!word) return glue(s.split(/(\s+)/).filter(Boolean), { punctuation: false });
  return joinRanges(glue(pieces(word, s), { punctuation: true }));
}

/** Graphemes, with the Thai vowel rules applied: the last-resort break points. */
export function breakClusters(text, { segment = true } = {}) {
  const s = String(text ?? '');
  if (!s) return [];
  const { grapheme } = segment ? segmenters() : {};
  const raw = grapheme ? pieces(grapheme, s) : (s.match(/\P{M}\p{M}*/gu) || [s]);
  return glue(raw, { punctuation: false });
}

function ellipsize(measure, line, maxW, ellipsis, options) {
  const units = breakUnits(line, options);
  while (units.length > 1 && measure(units.join('').trimEnd() + ellipsis) > maxW) units.pop();
  let out = units.join('').trimEnd();
  if (measure(out + ellipsis) > maxW) {
    // One word on its own is still too wide: cut it by grapheme.
    const clusters = breakClusters(out, options);
    while (clusters.length > 1 && measure(clusters.join('').trimEnd() + ellipsis) > maxW) clusters.pop();
    out = clusters.join('').trimEnd();
  }
  return out + ellipsis;
}

/**
 * Cut `text` into lines no wider than `maxW`.
 *
 * measure(str) => width. Whitespace between words collapses to a single space
 * and is dropped at a break. With maxLines, the last line ends in `ellipsis`
 * if there was more text. A single grapheme wider than maxW is the only thing
 * that can make a line too wide.
 */
export function wrapLines(measure, text, maxW, { maxLines = Infinity, ellipsis = '…', segment = true } = {}) {
  const options = { segment };
  const lines = [];
  let line = '';
  const fits = (s) => measure(s) <= maxW;

  for (const unit of breakUnits(text, options)) {
    if (SPACE.test(unit)) {
      if (line && !line.endsWith(' ')) line += ' ';
      continue;
    }
    if (fits(line + unit)) {
      line += unit;
      continue;
    }
    if (line.trim()) lines.push(line.trimEnd());
    line = '';
    if (fits(unit)) {
      line = unit;
      continue;
    }
    // Wider than a whole line: break it by grapheme.
    let piece = '';
    for (const cluster of breakClusters(unit, options)) {
      if (!piece || fits(piece + cluster)) {
        piece += cluster;
      } else {
        lines.push(piece);
        piece = cluster;
      }
    }
    line = piece;
  }
  if (line.trim()) lines.push(line.trimEnd());

  if (lines.length > maxLines && maxLines >= 1) {
    const kept = lines.slice(0, maxLines);
    kept[maxLines - 1] = ellipsize(measure, kept[maxLines - 1], maxW, ellipsis, options);
    return kept;
  }
  return lines;
}

/**
 * Draw wrapped text with the context's current font and fill. Returns the
 * number of lines drawn, so the caller can lay out what comes next.
 */
export function drawWrappedText(ctx, text, x, y, maxW, lineH, maxLines = Infinity, options = {}) {
  const lines = wrapLines((s) => ctx.measureText(s).width, text, maxW, { ...options, maxLines });
  lines.forEach((line, i) => ctx.fillText(line, x, y + i * lineH));
  return lines.length;
}
