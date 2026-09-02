// Generate the browser-light VetWiki topic catalog from the canonical note
// corpus. The full VetWiki index is intentionally a build-time dependency
// here: browser callers import the generated catalog instead, so checking
// article availability never downloads verification/source payloads.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Line endings normalised before comparing. Git checks these files out
// with CRLF on Windows while the generator writes LF, so a byte-for-byte
// comparison called the file STALE on every Windows machine until someone
// regenerated locally — and then called it stale again after the next
// checkout. Same shape as the localeCompare collation bug this file
// already documents: a check that is red for reasons unrelated to its
// subject teaches people to ignore it.
const eol = (s) => String(s).replace(/\r\n/g, '\n');


const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'src/lib/vetwiki/topic-registry.generated.js');
// The slim companion: topic ids only. Views that merely ask "is there an
// article for this question" (results, review, spaced repetition) import
// it instead of the full catalog, which carries titles and section lists
// they never render — and which Home prefetches on their behalf.
const OUT_KEYS = path.join(ROOT, 'src/lib/vetwiki/topic-keys.generated.js');
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
const keysOutput = `// ============================================================
// VetWiki topic keys -- GENERATED, do not hand-edit
// ============================================================
// The ids from topic-registry.generated.js and nothing else, for callers
// that only check whether an article exists. Regenerated together with the
// registry by node scripts/regen-vetwiki-topic-registry.mjs.

export const VETWIKI_TOPIC_KEYS = ${JSON.stringify(topics.map((t) => t.id), null, 2)};
`;

if (CHECK) {
  const current = fs.existsSync(OUT) ? fs.readFileSync(OUT, 'utf8') : '';
  const currentKeys = fs.existsSync(OUT_KEYS) ? fs.readFileSync(OUT_KEYS, 'utf8') : '';
  if (eol(current) !== eol(output) || eol(currentKeys) !== eol(keysOutput)) {
    console.error('VetWiki topic registry is stale. Run node scripts/regen-vetwiki-topic-registry.mjs');
    process.exit(1);
  }
  console.log(`VetWiki topic registry is current (${topics.length} topics)`);
} else {
  fs.writeFileSync(OUT, output, 'utf8');
  fs.writeFileSync(OUT_KEYS, keysOutput, 'utf8');
  console.log(`Wrote ${path.relative(ROOT, OUT)} and ${path.relative(ROOT, OUT_KEYS)} (${topics.length} topics)`);
}
