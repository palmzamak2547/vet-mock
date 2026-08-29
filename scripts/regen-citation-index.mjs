// Generate the browser-light citation index for the ask guard. The client's
// isomorphic re-validation of an AI answer needs, per sectionId, exactly what
// answer.js allowedFromSections() produces: the owning topicId and whether the
// section carries a reference-verified claim. Nothing else — no bodies, no
// headings. Importing the full corpus for that pulled the 4.8 MB verification
// barrel plus every notes chunk into the first ask; this file is the same
// derivation frozen at build time, drift-gated like every other registry.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Line endings normalised before comparing (Windows checkout writes CRLF,
// the generator writes LF — see regen-vetwiki-topic-registry.mjs).
const eol = (s) => String(s).replace(/\r\n/g, '\n');

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'src/lib/vetwiki/citation-index.generated.js');
const CHECK = process.argv.includes('--check');

const { listTopics, loadTopic } = await import(
  new URL(`../src/lib/vetwiki/index.js?citation=${Date.now()}`, import.meta.url).href
);
const { allowedFromSections } = await import(
  new URL(`../src/lib/vetwiki/answer.js?citation=${Date.now()}`, import.meta.url).href
);

const index = {};
let topics = 0;
for (const t of listTopics()) {
  const k = loadTopic(t.subject, t.topic);
  if (!k) continue;
  topics += 1;
  for (const [id, v] of allowedFromSections(k.id, k.sections)) {
    index[id] = [v.topicId, v.verified ? 1 : 0];
  }
}

const sections = Object.keys(index).length;
const output = `// ============================================================
// VetWiki citation index -- GENERATED, do not hand-edit
// ============================================================
// Source: allowedFromSections() over every governed topic in ./index.js.
// { [sectionId]: [topicId, verified ? 1 : 0] } — exactly the fields
// validateAnswer() consumes, so the ask guard never needs the corpus.
// Regenerate with: node scripts/regen-citation-index.mjs

export const CITATION_INDEX = ${JSON.stringify(index)};

export default CITATION_INDEX;
`;

if (CHECK) {
  const current = fs.existsSync(OUT) ? fs.readFileSync(OUT, 'utf8') : '';
  if (eol(current) !== eol(output)) {
    console.error('Citation index is stale. Run node scripts/regen-citation-index.mjs');
    process.exit(1);
  }
  console.log(`Citation index is current (${sections} sections / ${topics} topics)`);
} else {
  fs.writeFileSync(OUT, output, 'utf8');
  console.log(`Wrote ${path.relative(ROOT, OUT)} (${sections} sections / ${topics} topics)`);
}
