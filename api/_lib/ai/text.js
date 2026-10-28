// ============================================================
// ai/text.js — turning course material into plain text, and back out
// ============================================================
// Three jobs, all string-in string-out:
//
//   1. Flatten. Notes and VetWiki sections are structured (strings, bullet
//      lists, sub-sections, tables, callouts); the model and the snippet need
//      lines of text. flattenBody keeps the structure readable ("- " bullets,
//      "a | b" table rows) because a table flattened into one run-on sentence
//      is where a model starts pairing the wrong row with the wrong value.
//
//   2. Show. A snippet is the real source text, cut around the words that
//      matched, with markdown marks and decoration removed. Removing marks is
//      not rewriting: every word in a snippet is in the source.
//
//   3. Guard the output. The primary model is Chinese-trained and drops CJK
//      fragments into Thai under load (grounding.js documents the live case).
//      The house style also forbids emoji and the middle dot as a separator.
//      createOutputFilter applies all three to a stream of chunks, holding back
//      a trailing space run so " · " split across two chunks still reads as one.
// ============================================================

// Same coverage as llm.js hasCJK: CJK punctuation, kana, unified and ext-A
// ideographs, compatibility forms, half/full-width forms.
const CJK_G = /[　-〿぀-ヿ㐀-䶿一-鿿豈-﫿！-｠ｦ-ﾟ]/g;
// Pictographs and dingbats, but not the arrows (→ carries meaning in notes)
// and not ♀ ♂ (U+2640, U+2642), which the notes use for sex.
const EMOJI_G = /(?:[\u{1F000}-\u{1FAFF}]|[☀-☿♃-➿]|[⬀-⯿]|[⌚⌛⏩-⏳⏸-⏺]|ℹ|️|‍|⃣)/gu;

// The replacement character and control codes: a model trained on text with
// broken encodings writes U+FFFD itself now and then ("ใบหน้า�หรือคอ" on a
// phone, 10-28), and PDF text layers carry it too. Never part of an answer.
const BROKEN_G = /[�\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F]/g;
export const stripBroken = (s) => String(s ?? '').replace(BROKEN_G, '');

export const stripCJK = (s) => String(s ?? '').replace(CJK_G, '');
export const stripEmoji = (s) => String(s ?? '').replace(EMOJI_G, '');
export const countCJK = (s) => (String(s ?? '').match(CJK_G) || []).length;

/** Collapse whitespace and cut to n characters, marking the cut. */
export function clip(s, n) {
  const t = String(s ?? '').replace(/\s+/g, ' ').trim();
  return t.length > n ? `${t.slice(0, Math.max(0, n - 1)).trimEnd()}…` : t;
}

/** Inline markdown marks that carry emphasis, not words. */
export function stripInline(s) {
  return String(s ?? '')
    .replace(/\*\*|__|`/g, '')
    .replace(/(^|[\s(])\*(?=\S)|(?<=\S)\*(?=[\s).,]|$)/g, '$1')
    .replace(/\[(\d{1,2}:\d{2}(?::\d{2})?(?:\s*[-–]\s*\d{1,2}:\d{2}(?::\d{2})?)?(?:\s*,\s*\d{1,2}:\d{2}(?::\d{2})?)*)\]/g, '($1)');
}

/** A note/VetWiki body as readable lines. */
export function flattenBody(body, out = [], depth = 0) {
  for (const item of body || []) {
    if (typeof item === 'string') { out.push(item); continue; }
    if (!item || typeof item !== 'object') continue;
    if (item.bullets) {
      for (const b of item.bullets) out.push(`- ${typeof b === 'string' ? b : `${b.label}: ${b.value}`}`);
    }
    if (item.sub) {
      out.push(`${depth ? '####' : '###'} ${item.sub}`);
      flattenBody(item.body, out, depth + 1);
    }
    if (item.callout) out.push(`> ${item.callout}`);
    if (item.table) {
      if ((item.table.headers || []).length) out.push(item.table.headers.join(' | '));
      for (const row of item.table.rows || []) out.push(row.join(' | '));
    }
  }
  return out;
}

/** Markdown → plain text for snippets: no marks, no decoration, one line.
 *  A middle dot the notes use as a separator becomes a comma here too: a
 *  snippet is shown on the page, where the house style forbids it. */
export function plainText(md) {
  return stripEmoji(stripInline(md))
    .replace(/[ \t]*·[ \t]*/g, ', ')
    .replace(/^\s{0,3}#{1,6}\s+/gm, '')
    .replace(/^\s{0,3}>\s?/gm, '')
    .replace(/^\s*[-*+]\s+/gm, '')
    .replace(/^\s*\|?\s*:?-{3,}[-:|\s]*$/gm, '')
    .replace(/\s*\|\s*/g, ' | ')
    .replace(/^\s*\|\s*|\s*\|\s*$/gm, '')
    .replace(/[★☆]+/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Text for the model: decoration removed, line structure kept. A bracketed
 *  number already in the material ("[3]" pointing at the lecture's own
 *  reference list) is re-written as "(3)": inside the answer, square brackets
 *  mean OUR numbered sources, and a copied "[3]" would cite the wrong thing. */
export function contextText(md) {
  return stripEmoji(stripInline(md))
    .replace(/\[(\d{1,3})\]/g, '($1)')
    .replace(/[★☆]+/g, '')
    .replace(/^\s*\|?\s*:?-{3,}[-:|\s]*$/gm, '')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/**
 * The window of `text` (plain) around the first needle found, up to n chars.
 * Needles are { thai } substrings or { re } regexes over the lowercased text.
 * With no hit, the start of the text.
 */
export function snippetAround(text, needles = [], n = 220) {
  const t = String(text ?? '');
  if (t.length <= n) return t;
  const lc = t.toLowerCase();
  let at = -1;
  for (const nd of needles) {
    let i = -1;
    if (nd?.thai) i = lc.indexOf(nd.thai);
    else if (nd?.re) {
      const re = new RegExp(nd.re.source, nd.re.flags.replace('g', ''));
      const m = re.exec(lc);
      i = m ? m.index : -1;
    }
    if (i >= 0 && (at < 0 || i < at)) at = i;
  }
  if (at < 0) return clip(t, n);
  let start = Math.max(0, at - Math.floor(n / 3));
  // Start at a word boundary when one is near, so the snippet does not open
  // on half a word.
  const space = t.lastIndexOf(' ', start + 20);
  if (space > start - 30 && space >= 0 && space < at) start = space + 1;
  const body = t.slice(start, start + n - (start > 0 ? 2 : 1));
  return `${start > 0 ? '…' : ''}${body.trimEnd()}${start + body.length < t.length ? '…' : ''}`;
}

// Words the model sometimes slips in from Vietnamese ("วัคซีนรวม cùng CAV",
// production 2026-10-28): a word with a letter only Vietnamese uses goes, and
// so do its commonest small words, which are spelled with French accents.
const LATIN = 'A-Za-z\\u00C0-\\u024F\\u1E00-\\u1EFF';
const VIET_ONLY = 'ăâđêôơưạảấầẩẫậắằẳẵặẹẻẽếềểễệỉịọỏốồổỗộớờởỡợụủứừửữựỳỵỷỹ';
const FOREIGN_WORD_G = new RegExp(`(?<![${LATIN}])(?:[${LATIN}]*[${VIET_ONLY}][${LATIN}]*|cùng|và|là|các|này|có)(?![${LATIN}])`, 'giu');
const LATIN_TAIL = new RegExp(`[${LATIN}]*[ \\t·]*$`);

/**
 * Filter for a stream of answer chunks: drops CJK, emoji and stray Vietnamese
 * words, turns a middle dot used as a separator into a comma. push() returns
 * what can be shown now (a word still being written waits for its end);
 * flush() returns what was held back at the end.
 */
export function createOutputFilter() {
  let carry = '';
  let dropped = 0;
  const foreign = (s) => {
    let out = s.replace(FOREIGN_WORD_G, '');
    if (out.length === s.length) return s;
    dropped += s.length - out.length;
    // the space before the dropped word may already be on screen
    if (lastChar === ' ' && out.startsWith(' ')) out = out.slice(1);
    return out;
  };
  // The last character already shown: a run of spaces is collapsed unless it
  // indents a new line (markdown code and nested lists need indentation).
  let lastChar = '';
  const strip = (s) => {
    const out = s.replace(CJK_G, '').replace(EMOJI_G, '').replace(BROKEN_G, '');
    dropped += s.length - out.length;
    return out;
  };
  const tidy = (s) => {
    const out = s
      .replace(/[ \t]*·[ \t]*/g, ', ')
      .replace(/[ \t]{2,}/g, (run, offset, str) => {
        const prev = offset > 0 ? str[offset - 1] : lastChar;
        return prev === '\n' || prev === '' ? run : ' ';
      });
    if (out) lastChar = out[out.length - 1];
    return out;
  };
  return {
    push(chunk) {
      // Strip first, then hold back the trailing spaces and dots (the next
      // chunk decides whether " ·" is a separator and how many spaces remain)
      // and a Latin word still being written (it may be a stray foreign one).
      let s = strip(carry + String(chunk ?? ''));
      carry = s.match(LATIN_TAIL)[0];
      if (carry) s = s.slice(0, -carry.length);
      return tidy(foreign(s));
    },
    flush() {
      const s = tidy(foreign(carry));
      carry = '';
      return s;
    },
    dropped: () => dropped,
  };
}
