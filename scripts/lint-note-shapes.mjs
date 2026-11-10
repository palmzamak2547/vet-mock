#!/usr/bin/env node
// ============================================================
// lint-note-shapes.mjs — every item of a note's body is a shape the readers draw
// ============================================================
// Usage: node scripts/lint-note-shapes.mjs [--write]
//
// A section's body is a list of items, and many readers walk it, each with
// its own walker: the notes view (NotesView.jsx BodyItem), the wiki article
// (KnowledgeView.jsx NoteBody), the wiki search (src/lib/vetwiki/search.js),
// the static wiki pages (scripts/lib/wiki-static.mjs), the wiki's runtime
// data (scripts/regen-vetwiki-runtime-data.mjs), the AI's corpus
// (api/_lib/ai/text.js) and the grounding of the explain and voice routes
// (api/wiki-explain.js, api/_lib/mochi-voice.js). They all know five shapes:
//
//   "a paragraph"                          a plain string
//   { bullets: [string | { label, value }] }
//   { sub, body: [...] }                   a sub-section, the same shapes inside
//   { table: { headers, rows } }
//   { callout, kind }                      kind: tip | warn | flag
//
// The notes workflow writes a paragraph as { text }, and no reader drew it. By
// November 2026 the files held 3,334 paragraphs that were on no screen, in no
// search and in no AI answer, and 147 sections showed a heading with nothing
// under it. A shape outside the five fails here, so what is written is what
// is read. To add a shape, teach every reader above first, then this list.
//
// --write turns { text } into the plain string, and { text, bullets } into
// the string followed by its bullets. Run it on a new batch of notes.
// ============================================================
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const KINDS = new Set(['tip', 'warn', 'flag']);
const keysOf = (item) => Object.keys(item).sort().join('+');

/** What is wrong with one body item, or null when a reader can draw it. */
export function shapeProblem(item) {
  if (typeof item === 'string') return item.trim() ? null : 'an empty paragraph';
  if (!item || typeof item !== 'object' || Array.isArray(item)) return `neither a string nor an object: ${JSON.stringify(item ?? null).slice(0, 40)}`;
  switch (keysOf(item)) {
    case 'bullets':
      return Array.isArray(item.bullets) && item.bullets.every((b) => typeof b === 'string' || (b && typeof b.label === 'string' && b.value != null))
        ? null : 'bullets is a list of strings or of { label, value }';
    case 'body+sub':
      return typeof item.sub === 'string' && Array.isArray(item.body) ? null : 'sub is a string and body is a list';
    case 'table':
      return item.table && Array.isArray(item.table.rows) ? null : 'table holds headers and rows';
    case 'callout':
    case 'callout+kind':
      return typeof item.callout === 'string' && (item.kind == null || KINDS.has(item.kind)) ? null : 'callout is a string and kind is tip, warn or flag';
    default:
      return `{ ${Object.keys(item).join(', ')} } is not a shape the readers draw${typeof item.text === 'string' ? ' (write a paragraph as a plain string: run this script with --write)' : ''}`;
  }
}

/** Every problem in a body, sub-sections included, each with the words it starts with. */
export function bodyProblems(body, where = '') {
  const out = [];
  (body || []).forEach((item, i) => {
    const problem = shapeProblem(item);
    if (problem) out.push(`${where}[${i}] ${problem}`);
    if (item && typeof item === 'object' && Array.isArray(item.body)) out.push(...bodyProblems(item.body, `${where}[${i}].body`));
  });
  return out;
}

/** { text } is a paragraph: the plain string. { text, bullets } is the paragraph, then its bullets. */
export function normalizeBody(body) {
  const out = [];
  for (const item of body || []) {
    if (item && typeof item === 'object' && !Array.isArray(item) && typeof item.text === 'string') {
      const { text, ...rest } = item;
      out.push(text);
      if (Object.keys(rest).length) out.push(...normalizeBody([rest]));
    } else if (item && typeof item === 'object' && Array.isArray(item.body)) {
      out.push({ ...item, body: normalizeBody(item.body) });
    } else out.push(item);
  }
  return out;
}

export const noteFiles = (dir = 'src/data') => fs.readdirSync(dir)
  .filter((f) => /^notes-.*\.js$/.test(f) && !/registry|generated/.test(f))
  .map((f) => path.join(dir, f));

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const WRITE = process.argv.includes('--write');
  const problems = [];
  let items = 0;
  let rewritten = 0;
  for (const file of noteFiles()) {
    const mod = await import(`${pathToFileURL(path.resolve(file)).href}?t=${Date.now()}`);
    const notes = Object.values(mod).find((v) => v && typeof v === 'object');
    const found = [];
    for (const [id, note] of Object.entries(notes || {})) {
      for (const [n, section] of (note?.sections || []).entries()) {
        const count = (body) => (body || []).reduce((sum, it) => sum + 1 + (it && Array.isArray(it.body) ? count(it.body) : 0), 0);
        items += count(section.body);
        for (const p of bodyProblems(section.body)) found.push(`${path.basename(file)} ${id} section ${n + 1} "${String(section.heading || '').slice(0, 40)}" body${p}`);
      }
    }
    if (!found.length) continue;
    if (!WRITE) { problems.push(...found); continue; }

    // The data sits in the file as JSON.stringify(notes, null, 2), so a rewrite changes only the items it must.
    const src = fs.readFileSync(file, 'utf8');
    const eol = src.includes('\r\n') ? '\r\n' : '\n';
    const open = src.indexOf('{', src.indexOf('export const'));
    const close = src.lastIndexOf('}');
    const region = src.slice(open, close + 1).replace(/\r\n/g, '\n');
    let data;
    try { data = JSON.parse(region); } catch { data = null; }
    if (!data || JSON.stringify(data, null, 2) !== region) {
      problems.push(...found, `${path.basename(file)}: not written as JSON, so --write leaves it; fix the items above by hand`);
      continue;
    }
    for (const note of Object.values(data)) for (const section of note.sections || []) section.body = normalizeBody(section.body);
    const left = Object.entries(data).flatMap(([id, note]) => (note.sections || []).flatMap((s, n) => bodyProblems(s.body).map((p) => `${path.basename(file)} ${id} section ${n + 1} body${p}`)));
    problems.push(...left);
    fs.writeFileSync(file, src.slice(0, open) + JSON.stringify(data, null, 2).replace(/\n/g, eol) + src.slice(close + 1));
    rewritten += found.length - left.length;
  }
  if (WRITE) console.log(`rewrote ${rewritten} item${rewritten === 1 ? '' : 's'}`);
  if (problems.length) {
    console.error(`✗ note shapes: ${problems.length} body item${problems.length === 1 ? '' : 's'} no reader draws`);
    for (const p of problems.slice(0, 30)) console.error(`  ${p}`);
    if (problems.length > 30) console.error(`  … ${problems.length - 30} more`);
    process.exit(1);
  }
  console.log(`✓ note shapes: ${items} body items, every one a shape the readers draw`);
}
