// Emit compact Workflow payloads, one per batch of Year-2 subjects.
//
// Workflow scripts have no filesystem access, so the deck list travels as an
// argument. Paths go as a root plus short names because 50 decks repeating the
// same absolute prefix is most of the payload.
//
//   node scripts/y2-batches.mjs --map <y2map.json> --root <scratchpad>

import fs from 'node:fs';
import path from 'node:path';
import { SUBJECTS_BY_YEAR } from '../src/data/curriculum.js';

const argOf = (f, d) => { const i = process.argv.indexOf(f); return i === -1 ? d : process.argv[i + 1]; };
const MAP = argOf('--map', null);
const ROOT = argOf('--root', null);
if (!MAP || !ROOT) { console.error('need --map and --root'); process.exit(1); }

const BATCHES = {
  N: ['vet-neuroanat'],
  A: ['vet-histo', 'vet-microbio-1'],
  B: ['vet-physio-1', 'vet-anat-2'],
  C: ['vet-physio-2', 'vet-physio-3', 'biochem-2'],
  D: ['vet-parasit-1', 'vet-physio-lab-1', 'vet-physio-lab-2', 'animal-breeding'],
};

const names = {};
for (const s of SUBJECTS_BY_YEAR[2]) names[s.id] = `${s.name} (${s.name_en})`;

const map = JSON.parse(fs.readFileSync(MAP, 'utf8'));

for (const [key, subs] of Object.entries(BATCHES)) {
  const decks = map.filter((r) => subs.includes(r.subjectId)).map((r) => {
    const parts = r.txt.split(/[\\/]/);
    return {
      s: r.subjectId,
      t: r.topicId,
      label: r.label,
      dir: parts[parts.length - 2],
      f: parts[parts.length - 1],
      section: r.section,
    };
  });
  const payload = {
    root: ROOT,
    names: Object.fromEntries(subs.map((s) => [s, names[s]])),
    decks,
  };
  const out = path.join(ROOT, `wf-${key}.json`);
  fs.writeFileSync(out, JSON.stringify(payload));
  for (const s of subs) fs.mkdirSync(path.join(ROOT, 'y2notes', s), { recursive: true });
  console.log(`${key}  ${String(decks.length).padStart(3)} decks  ${(JSON.stringify(payload).length / 1024).toFixed(1)} KB  ${subs.join(' ')}`);
}
