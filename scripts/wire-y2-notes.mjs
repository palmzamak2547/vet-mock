// Register every notes-y2-*.js module with the two places that read notes.
//
// NotesView renders them and vetwiki/index.js governs them. Both keep a
// hand-written subject → module map, and a note that reaches one but not the
// other is invisible in exactly one surface — the kind of drift nobody
// notices until a student asks why an article is empty. Thirteen subjects is
// twenty-six edits, so this does them.
//
// Idempotent: run it again after adding a subject and it only adds what is
// missing.
//
// A subject reaches NotesView as soon as it has notes, but reaches the wiki
// only once every one of its sections carries an external source — the wiki
// promises verification and the notes tab does not. List a subject in GOVERNED
// when `npm run lint:wiki-coverage` passes for it.
//
//   node scripts/wire-y2-notes.mjs [--write]

import fs from 'node:fs';

const WRITE = process.argv.includes('--write');

// Subjects whose sections are all externally sourced. Everything else renders
// in NotesView and stays out of the wiki until its coverage gate is clean.
const GOVERNED = new Set([]);

const NOTES_VIEW = 'src/views/NotesView.jsx';
const WIKI_INDEX = 'src/lib/vetwiki/index.js';
// The wiki's browser runtime keeps its own lazy map. A subject registered in
// the other two but missing here lists in the wiki index and then fails to
// open — which is exactly what happened to the first year-2 subject.
const WIKI_RUNTIME = 'src/lib/vetwiki/runtime.js';

const mods = fs.readdirSync('src/data')
  .filter((f) => /^notes-y2-.+\.js$/.test(f))
  .sort()
  .map((file) => {
    const slug = file.replace(/^notes-y2-/, '').replace(/\.js$/, '');
    const src = fs.readFileSync(`src/data/${file}`, 'utf8');
    const konst = (src.match(/export const (NOTES_Y2_[A-Z0-9_]+)/) || [])[1];
    if (!konst) throw new Error(`${file} has no NOTES_Y2_* export`);
    // curriculum ids keep the vet- prefix that the file name drops
    const subjectId = /^(physio|anat|histo|microbio|parasit|neuroanat)/.test(slug) ? `vet-${slug}` : slug;
    return { file, slug, konst, subjectId };
  });

if (!mods.length) { console.log('no notes-y2-*.js modules yet'); process.exit(0); }

function wire(target, mods, { importAfter, mapAnchor, mapIndent }) {
  let src = fs.readFileSync(target, 'utf8');
  const eol = src.includes('\r\n') ? '\r\n' : '\n';
  const added = [];

  for (const m of mods) {
    const importLine = `import { ${m.konst} } from '${importAfter.path}${m.file}';`;
    if (!src.includes(importLine)) {
      const at = src.lastIndexOf(importAfter.marker);
      if (at === -1) throw new Error(`${target}: import anchor not found`);
      const lineEnd = src.indexOf('\n', at) + 1;
      src = src.slice(0, lineEnd) + importLine + eol + src.slice(lineEnd);
      added.push(`import ${m.konst}`);
    }

    const mapLine = `${mapIndent}'${m.subjectId}': ${m.konst},`;
    if (!new RegExp(`['"]?${m.subjectId}['"]?\\s*:\\s*${m.konst}\\b`).test(src)) {
      const at = src.indexOf(mapAnchor);
      if (at === -1) throw new Error(`${target}: map anchor "${mapAnchor}" not found`);
      const lineEnd = src.indexOf('\n', at) + 1;
      src = src.slice(0, lineEnd) + mapLine + eol + src.slice(lineEnd);
      added.push(`map ${m.subjectId}`);
    }
  }

  if (added.length && WRITE) fs.writeFileSync(target, src);
  console.log(`${WRITE ? '✓' : '·'} ${target}: ${added.length ? added.join(', ') : 'already wired'}`);
  return added.length;
}

// The runtime map holds lazy importers rather than imported symbols, so it
// gets its own pass instead of the shared import+map shape.
function wireRuntime(mods) {
  let src = fs.readFileSync(WIKI_RUNTIME, 'utf8');
  const eol = src.includes('\r\n') ? '\r\n' : '\n';
  const added = [];

  for (const m of mods) {
    if (new RegExp(`['"]?${m.subjectId}['"]?\\s*:\\s*async`).test(src)) continue;
    const line = `  '${m.subjectId}': async () => [(await import('../../data/${m.file}')).${m.konst}],`;
    const at = src.indexOf('const LOADERS = {');
    if (at === -1) throw new Error(`${WIKI_RUNTIME}: LOADERS map not found`);
    const lineEnd = src.indexOf('\n', at) + 1;
    src = src.slice(0, lineEnd) + line + eol + src.slice(lineEnd);
    added.push(m.subjectId);
  }

  if (added.length && WRITE) fs.writeFileSync(WIKI_RUNTIME, src);
  console.log(`${WRITE ? '✓' : '·'} ${WIKI_RUNTIME}: ${added.length ? added.join(', ') : 'already wired'}`);
  return added.length;
}

const governed = mods.filter((m) => GOVERNED.has(m.subjectId));

let n = 0;
n += wireRuntime(governed);
n += wire(NOTES_VIEW, mods, {
  importAfter: { marker: "from '../data/notes-", path: '../data/' },
  mapAnchor: 'const NOTES_BY_SUBJECT = {',
  mapIndent: '  ',
});
n += wire(WIKI_INDEX, governed, {
  importAfter: { marker: "from '../../data/notes-", path: '../../data/' },
  mapAnchor: 'const NOTES_BY_SUBJECT_BASE = {',
  mapIndent: '  ',
});

console.log(`${mods.length} year-2 module(s): ${mods.map((m) => m.subjectId).join(', ')}`);
if (!WRITE && n) console.log('(dry run — pass --write)');
