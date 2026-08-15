// Link each extracted lecture text file to the curriculum topic it belongs to.
//
// The text files were named by sanitising the PDF's own file name, and the
// topic ids were slugified from that same name, so the link is recoverable
// exactly rather than by fuzzy title matching — which put a checklist under a
// Thai topic label on the first attempt and would have attached notes to the
// wrong article.
//
// Emits map.json: [{ subjectId, topicId, label, txt, section, notExamined }]
//
//   node scripts/map-y2-text.mjs --text <dir> --out <map.json>

import fs from 'node:fs';
import path from 'node:path';
import { SUBJECTS_BY_YEAR } from '../src/data/curriculum.js';

const argOf = (f, d) => { const i = process.argv.indexOf(f); return i === -1 ? d : process.argv[i + 1]; };
const ROOT = argOf('--root', 'C:/Users/palmz/Desktop/📚 เรียน/CUVET ปี 2');
const TEXT = argOf('--text', null);
const OUT = argOf('--out', null);
if (!TEXT || !OUT) { console.error('need --text and --out'); process.exit(1); }

// Same sanitisation the extractor used: keep [A-Za-z0-9 .()-], spaces to
// underscores, first 48 characters.
const txtName = (base) =>
  base.replace(/[^A-Za-z0-9 .()-]/g, '').replace(/ /g, '_').slice(0, 48);

// Subject folder → the directory the extractor wrote into (non-alphanumerics
// stripped), and → the curriculum subject id.
const FOLDERS = {
  'Biochemistry II': 'biochem-2',
  'Prin Anl Hus II': 'husbandry-2',
  'Vet Anat II': 'vet-anat-2',
  'Vet Histol': 'vet-histo',
  'Vet Physiol I': 'vet-physio-1',
  'Vet Physiol lab I': 'vet-physio-lab-1',
  'ANI BREEDING': 'animal-breeding',
  'VET MICRO I': 'vet-microbio-1',
  'VET NEURO': 'vet-neuroanat',
  'VET PARASITOL I': 'vet-parasit-1',
  'VET PHYSIOL II': 'vet-physio-2',
  'VET PHYSIOL II LAB': 'vet-physio-lab-2',
  'VET PHYSIOL III': 'vet-physio-3',
};
const textDirOf = (folder) => folder.replace(/[^A-Za-z0-9]/g, '');

// A topic id is the only thing that has to agree with curriculum.js, so match
// on it rather than re-deriving titles.
const topicsOf = {};
for (const s of SUBJECTS_BY_YEAR[2]) topicsOf[s.id] = s.topics || [];

const norm = (s) => s.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, '');

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (e.name.toLowerCase().endsWith('.pdf')) out.push(p);
  }
  return out;
}

const rows = [];
const unmatched = [];
const seen = new Set();

for (const file of walk(ROOT)) {
  const rel = path.relative(ROOT, file).split(path.sep);
  const subjectId = FOLDERS[rel[1]];
  if (!subjectId) continue;

  const base = path.basename(file, '.pdf');
  const txt = path.join(TEXT, textDirOf(rel[1]), `${txtName(base)}.txt`);
  if (!fs.existsSync(txt)) continue;          // Thai or image-only, handled elsewhere

  // The topic label came from the same base name, so recover the topic by
  // normalising both sides of that one transformation.
  const stem = norm(base.replace(/-\d{6}-\d{10,}\s*$/, '').replace(/\.นิสิต\s*$/, ''));
  const cands = topicsOf[subjectId] || [];
  const hit =
    cands.find((t) => norm(t.label) === stem) ||
    cands.find((t) => stem.endsWith(norm(t.label)) && norm(t.label).length >= 6) ||
    cands.find((t) => stem.startsWith(norm(t.label)) && norm(t.label).length >= 6);

  if (!hit) { unmatched.push(path.basename(txt)); continue; }

  const head = fs.readFileSync(txt, 'utf8').slice(0, 200);
  rows.push({
    exact: norm(hit.label) === stem,
    subjectId,
    topicId: hit.id,
    label: hit.label,
    txt,
    section: (head.match(/^SECTION=(.*)$/m) || [, ''])[1].trim(),
    pages: Number((head.match(/^PAGES=(\d+)/m) || [, 0])[1]),
    notExamined: !!hit.notExamined,
    chars: fs.statSync(txt).size,
  });
}

// A topic can attract more than one file — "Metencephalon.txt" and
// "Metencephalon_checklist.txt" both point at the same lecture. Keep the file
// that names the topic exactly, and otherwise the longest one, because the
// checklist that hijacked the first attempt held 662 characters against the
// lecture's 7,192.
const best = new Map();
for (const r of rows) {
  const cur = best.get(r.topicId);
  const better = !cur
    || (r.exact && !cur.exact)
    || (r.exact === cur.exact && r.chars > cur.chars);
  if (better) best.set(r.topicId, r);
}
const picked = [...best.values()].map(({ exact, ...r }) => r);

picked.sort((a, b) => a.subjectId.localeCompare(b.subjectId) || b.chars - a.chars);
fs.writeFileSync(OUT, JSON.stringify(picked, null, 2));
rows.length = 0;
rows.push(...picked);

const bySubj = {};
for (const r of rows) bySubj[r.subjectId] = (bySubj[r.subjectId] || 0) + 1;
for (const [s, n] of Object.entries(bySubj)) console.log(`${s.padEnd(20)} ${n} decks`);
console.log(`\n${rows.length} text decks mapped to topics → ${OUT}`);
if (unmatched.length) {
  console.log(`${unmatched.length} text file(s) matched no topic (classified out of the taxonomy):`);
  for (const u of unmatched.slice(0, 12)) console.log(`   ${u}`);
}
