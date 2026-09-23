// Read and rewrite a question bank without needing it to be valid JSON.
//
// Older banks carry section comments inside the array — "// ── Chromatography
// (Q1-9, Final Lab 2022) ──" — so JSON.parse throws on them. A linter that
// wrapped that parse in try/catch went on to report the whole corpus clean
// while silently skipping 37 of 65 banks and 2,846 questions. Anything that
// reads banks should use this instead.
//
// Reading imports the module, which is the same thing the app does. Removing a
// question edits the text around it, so comments and formatting elsewhere in
// the file survive untouched.

import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

export function bankFiles(dir = 'src/data') {
  return fs.readdirSync(dir)
    .filter((f) => /^questions-.*\.js$/.test(f))
    .map((f) => path.join(dir, f));
}

export async function readBank(file) {
  const mod = await import(`${pathToFileURL(path.resolve(file)).href}?t=${Date.now()}`);
  const questions = Object.values(mod).find(Array.isArray) || [];
  return { file, questions };
}

/** Locate `id: N`. Some banks are JSON-shaped ("id": 5), others are plain JS
 *  object literals ({ id: 5 ). Matching only the quoted form made a drop
 *  silently do nothing — which the caller's count check caught. */
function idAt(src, id) {
  return src.search(new RegExp(String.raw`(?:"id"|\bid)\s*:\s*${id}\b`));
}

/** Scan forward from the opening quote at `i` to its unescaped partner.
 *  Returns the index just past the closing quote, or -1. */
function endOfString(src, i) {
  const quote = src[i];
  for (i++; i < src.length; i++) {
    if (src[i] === '\\') { i++; continue; }
    if (src[i] === quote) return i + 1;
  }
  return -1;
}

/** Find the string literal that follows `key:` (quoted or bare) after `from`.
 *  Returns [start, end] spanning the literal including its quotes.
 *
 *  The corpus is written four ways — bare or quoted keys, single or double
 *  quoted values — and single-quoted Thai carries escaped apostrophes
 *  ("Bloom\'s taxonomy"). Assuming double quotes made this return null, which
 *  the caller reads as "not found". */
function stringAfter(src, from, key) {
  const m = new RegExp(String.raw`(?:"${key}"|'${key}'|\b${key})\s*:\s*`).exec(src.slice(from));
  if (!m) return null;
  const start = from + m.index + m[0].length;
  if (src[start] !== '"' && src[start] !== "'") return null;   // not a plain string
  const end = endOfString(src, start);
  return end === -1 ? null : [start, end];
}

/** Replace the `q` of each id. Values are re-encoded with JSON.stringify, so
 *  quotes and backslashes in Thai prose cannot break the file. */
export function updateStems(file, stems) {
  return updateField(file, 'q', stems);
}

/** Replace one string field per id. Values are re-encoded with JSON.stringify,
 *  so quotes, backslashes and newlines in Thai prose cannot break the file. */
export function updateField(file, field, values) {
  if (!values.size) return 0;
  let src = fs.readFileSync(file, 'utf8');
  let n = 0;
  for (const [id, value] of values) {
    const at = idAt(src, id);
    if (at === -1) continue;
    const span = stringAfter(src, at, field);
    if (!span) continue;
    src = src.slice(0, span[0]) + JSON.stringify(value) + src.slice(span[1]);
    n++;
  }
  if (n) fs.writeFileSync(file, src);
  return n;
}

// A wrap-up page names the question behind a bullet by id: "ข้อสอบเก่า 105728,
// 105729" for a sat paper, "แนวข้อสอบ 202275" for one written from a senior's
// exam guidance. The id is the only link back to the bank, so the wrap-up test
// and removeQuestions below read it the same way.
const WRAPUP_CITE = /(ข้อสอบเก่า|แนวข้อสอบ)(?:ปี\s*\d)?\s*((?:\d{3,6}(?:\s*,\s*|\s*และ\s*)?)+)/g;

/** Every question id a wrap-up string cites, with the label it is cited under. */
export function wrapUpCites(text) {
  const out = [];
  for (const m of String(text ?? '').matchAll(WRAPUP_CITE)) {
    for (const id of m[2].split(/\s*,\s*|\s*และ\s*/).filter(Boolean)) out.push({ label: m[1], id });
  }
  return out;
}

/** The wrap-up files in `dir` that cite any of `ids`. */
export function wrapUpCitations(ids, dir) {
  if (!ids.size || !fs.existsSync(dir)) return [];
  const want = new Set([...ids].map(String));
  const hits = [];
  for (const f of fs.readdirSync(dir).filter((x) => x.endsWith('.js'))) {
    for (const c of wrapUpCites(fs.readFileSync(path.join(dir, f), 'utf8'))) {
      if (want.has(c.id)) hits.push({ file: f, ...c });
    }
  }
  return hits;
}

/** Cut the objects carrying these ids out of the file's text.
 *
 *  Brace counting, skipping anything inside a string so a `{` in Thai prose or
 *  an escaped quote cannot end the object early. Returns the number removed.
 *
 *  A wrap-up that still cites a removed id is named on stderr: the dedupe that
 *  merged #105730 into #207464 left the milk wrap-up pointing at nothing. */
export function removeQuestions(file, ids) {
  if (!ids.size) return 0;
  let src = fs.readFileSync(file, 'utf8');
  let removed = 0;
  const gone = new Set();

  for (const id of ids) {
    const at = idAt(src, id);
    if (at === -1) continue;

    // walk back to the '{' that opens this object
    let start = src.lastIndexOf('{', at);
    if (start === -1) continue;

    // walk forward to its matching '}', skipping string contents so a '{' in
    // Thai prose cannot close the object early. Both quote styles are in use.
    let depth = 0, i = start;
    for (; i < src.length; i++) {
      const c = src[i];
      if (c === '"' || c === "'") { const e = endOfString(src, i); if (e === -1) break; i = e - 1; continue; }
      if (c === '{') depth++;
      else if (c === '}') { depth--; if (depth === 0) break; }
    }
    if (depth !== 0) continue;                       // unbalanced — leave it alone

    let end = i + 1;
    if (src[end] === ',') end++;                     // its separator
    while (start > 0 && /[ \t]/.test(src[start - 1])) start--;   // its indent
    while (/[ \t\r]/.test(src[end])) end++;
    if (src[end] === '\n') end++;                    // its terminator, and ONLY its own

    // Taking the NEWLINE BEFORE it as well would join the previous line to the
    // next one. When the previous line is `// ── Chromatography ──`, that puts
    // the following question inside a comment and deletes it too.

    src = src.slice(0, start) + src.slice(end);
    removed++;
    gone.add(id);
  }

  if (removed) {
    fs.writeFileSync(file, src);
    for (const c of wrapUpCitations(gone, path.join(path.dirname(file), 'wrapups'))) {
      console.warn(`removeQuestions: wrapups/${c.file} still cites "${c.label} ${c.id}", point it at the question that replaces it`);
    }
  }
  return removed;
}
