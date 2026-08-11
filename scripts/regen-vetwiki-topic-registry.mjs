// Generate the browser-light VetWiki topic catalog from the canonical note
// corpus. The full VetWiki index is intentionally a build-time dependency
// here: browser callers import the generated catalog instead, so checking
// article availability never downloads verification/source payloads.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'src/lib/vetwiki/topic-registry.generated.js');
const CHECK = process.argv.includes('--check');

const { listTopics } = await import(
  new URL(`../src/lib/vetwiki/index.js?registry=${Date.now()}`, import.meta.url).href
);

const topics = listTopics();
const output = `// ============================================================
// VetWiki topic registry -- GENERATED, do not hand-edit
// ============================================================
// Source: the canonical note corpus exposed by ./index.js.
// Regenerate with: node scripts/regen-vetwiki-topic-registry.mjs

export const VETWIKI_TOPICS = ${JSON.stringify(topics, null, 2)};

export default VETWIKI_TOPICS;
`;

if (CHECK) {
  const current = fs.existsSync(OUT) ? fs.readFileSync(OUT, 'utf8') : '';
  if (current !== output) {
    console.error('VetWiki topic registry is stale. Run node scripts/regen-vetwiki-topic-registry.mjs');
    process.exit(1);
  }
  console.log(`VetWiki topic registry is current (${topics.length} topics)`);
} else {
  fs.writeFileSync(OUT, output, 'utf8');
  console.log(`Wrote ${path.relative(ROOT, OUT)} (${topics.length} topics)`);
}
