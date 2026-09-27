// Writes research/src/data/cuvet-methods.json: the table the landing chapter "what statistics CUVET
// papers use" prints, joined from the two committed Europe PMC files in this folder through the
// catalogue's families (src/lib/runtime/catalog.js FAMILIES[].evidence). Run from research/:
//   node src/landing/evidence/build-cuvet-methods.mjs           write the file
//   node src/landing/evidence/build-cuvet-methods.mjs --check   exit 1 when the file is stale
// tests/unit/landing-chart.test.mjs runs the same comparison. OWNER: landing role.
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { FAMILIES } from '../../lib/runtime/catalog.js';
import { EVIDENCE_FILES, joinEvidence } from '../chart/rows.js';

const here = new URL('./', import.meta.url);
const out = fileURLToPath(new URL('../../data/cuvet-methods.json', import.meta.url));
const files = Object.fromEntries(EVIDENCE_FILES.map((f) => [f, JSON.parse(readFileSync(fileURLToPath(new URL(f, here)), 'utf8'))]));
const text = `${JSON.stringify(joinEvidence(FAMILIES, files), null, 1)}\n`;

if (process.argv.includes('--check')) {
  let current = '';
  try {
    current = readFileSync(out, 'utf8');
  } catch {
    current = '';
  }
  if (current !== text) {
    console.error('research/src/data/cuvet-methods.json is stale: run node src/landing/evidence/build-cuvet-methods.mjs');
    process.exit(1);
  }
  console.log('cuvet-methods.json is current');
} else {
  writeFileSync(out, text, 'utf8');
  console.log(`wrote src/data/cuvet-methods.json (${JSON.parse(text).families.length} families)`);
}
