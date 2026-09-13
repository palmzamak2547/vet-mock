// ============================================================
// grounding.js — what a generated sentence must survive to be shown
// ============================================================
// Three study features ask a language model to write text that a student
// will read as if it were course material. The model is never the source of
// truth in any of them: it is given material we already hold and asked to
// re-frame it. These checks are what turn that intention into a property.
//
// The rule that matters most: a figure the student reads must have come from
// the material. A model that invents "5 mg/kg" is not slightly wrong, it is
// worse than silence — and unlike a wrong sentence, a wrong number is exactly
// the thing a student copies into an exam. So every number in the output is
// matched against every number in the input, and anything new fails the block
// it appeared in rather than being shown with a disclaimer.
//
// These are deliberately blunt. They cannot tell a true sentence from a false
// one; they only stop a narrow class of fabrication that is both common and
// expensive. Everything else rests on the prompt and on the material being
// correct in the first place.
// ============================================================

// Thai digits appear in scanned course material often enough to matter.
const THAI_DIGITS = { '๐': '0', '๑': '1', '๒': '2', '๓': '3', '๔': '4', '๕': '5', '๖': '6', '๗': '7', '๘': '8', '๙': '9' };
const NUM_RE = /\d+(?:,\d{3})*(?:\.\d+)?/g;

function arabicise(s) {
  return String(s ?? '').replace(/[๐-๙]/g, (d) => THAI_DIGITS[d]);
}

/** "1,200" "1200" "1200.0" all key the same; "0.5" and ".5" do not differ. */
function normNumber(raw) {
  const n = Number(String(raw).replace(/,/g, ''));
  return Number.isFinite(n) ? String(n) : null;
}

export function numbersIn(text) {
  const out = new Set();
  for (const m of arabicise(text).match(NUM_RE) || []) {
    const k = normNumber(m);
    if (k !== null) out.add(k);
  }
  return out;
}

/**
 * Numbers in `text` that do not appear anywhere in `context`.
 * An empty result is the only passing result.
 */
export function ungroundedNumbers(text, context) {
  const known = numbersIn(context);
  return [...numbersIn(text)].filter((n) => !known.has(n));
}

// The primary provider is Chinese-trained and drops CJK fragments into Thai
// output under load; wiki-explain hit this live. Re-checked here because this
// route does not use that route's regeneration path.
const CJK_RE = /[　-〿぀-ヿ㐀-䶿一-鿿豈-﫿！-｠ｦ-ﾟ]/;

/**
 * Everything a block of generated prose has to pass.
 * @returns {{ ok: true } | { ok: false, reason: string, detail?: string[] }}
 */
export function checkText(text, context, { maxChars = 400 } = {}) {
  const s = String(text ?? '').trim();
  if (!s) return { ok: false, reason: 'empty' };
  if (s.length > maxChars) return { ok: false, reason: 'too-long' };
  if (CJK_RE.test(s)) return { ok: false, reason: 'cjk' };
  const bad = ungroundedNumbers(s, context);
  if (bad.length) return { ok: false, reason: 'ungrounded-number', detail: bad };
  return { ok: true };
}

/** Whitespace-insensitive containment — the model re-wraps lines when it
 *  copies, and a quote that is only different by a line break is still a
 *  quote. Anything beyond that is not. */
export function quotesFrom(quote, source) {
  const flat = (s) => arabicise(s).replace(/\s+/g, ' ').trim();
  const q = flat(quote);
  if (q.length < 8) return false;
  return flat(source).includes(q);
}

/**
 * A verbatim quote is proof of provenance, not something a student should have
 * to read as source text. The summaries are markdown, so a line copied exactly
 * out of one arrives carrying its formatting: `| **MERS** | Camels |` for a
 * table row, an orphan `**` where the model started copying mid-emphasis, a
 * leading bullet or star.
 *
 * Run this AFTER quotesFrom has passed, never before — the check is against
 * what the summary really says, and this only decides how it is shown.
 */
export function tidyQuote(quote) {
  let s = String(quote ?? '').trim();
  // A table row becomes its cells, in order, rather than its pipes.
  if (/^\|.*\|?$/.test(s) && s.includes('|')) {
    const cells = s.split('|').map((c) => c.trim()).filter(Boolean);
    if (cells.length) s = cells.join(' — ');
  }
  return s
    .replace(/\*\*|__|`/g, '')                       // emphasis, opened or not
    .replace(/^[\s>#*\-•⭐🔻🎯⚠️💡📋🔹]+/u, '')        // heading, bullet and callout marks
    .replace(/[\s|]+$/, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
}
