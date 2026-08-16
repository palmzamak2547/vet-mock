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

/** Cut the objects carrying these ids out of the file's text.
 *
 *  Brace counting, skipping anything inside a string so a `{` in Thai prose or
 *  an escaped quote cannot end the object early. Returns the number removed. */
export function removeQuestions(file, ids) {
  if (!ids.size) return 0;
  let src = fs.readFileSync(file, 'utf8');
  let removed = 0;

  for (const id of ids) {
    const at = src.search(new RegExp(`"id"\\s*:\\s*${id}\\b`));
    if (at === -1) continue;

    // walk back to the '{' that opens this object
    let start = src.lastIndexOf('{', at);
    if (start === -1) continue;

    // walk forward to its matching '}'
    let depth = 0, i = start, inStr = false, esc = false;
    for (; i < src.length; i++) {
      const c = src[i];
      if (inStr) {
        if (esc) esc = false;
        else if (c === '\\') esc = true;
        else if (c === '"') inStr = false;
        continue;
      }
      if (c === '"') { inStr = true; continue; }
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
  }

  if (removed) fs.writeFileSync(file, src);
  return removed;
}
