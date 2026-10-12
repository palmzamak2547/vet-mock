#!/usr/bin/env node
// lint-bank-chunks.mjs: every question bank is its own chunk, and imports none.
//
// importBank (src/data/questions.js) recovers a bank whose import failed by
// importing the same chunk under a fresh query and reading the bank's export by
// its registry name. That holds only when each bank file is a chunk of its own:
// - two banks in one chunk (questions-vca and questions-vca-reviewed matched
//   one manualChunks rule) export namespace objects under short names, so the
//   retry read undefined and 437 VCA questions went missing without an error;
// - a bank chunk that imports another chunk (COM IV took two SVGs from COM
//   III's) keeps failing after a failed attempt, because its import of the
//   other chunk is still the failed URL.
// Reads the build manifest, so it runs after `vite build` (npm run lint:dist).
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const manifestPath = path.join(ROOT, 'dist', '.vite', 'manifest.json');
if (!existsSync(manifestPath)) {
  console.error('lint:bank-chunks: dist/.vite/manifest.json not found; run vite build first');
  process.exit(1);
}
const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
const { BANK_REGISTRY } = await import(new URL('../src/data/bank-registry.generated.js', import.meta.url));

const errors = [];
const owner = new Map();
for (const bank of BANK_REGISTRY) {
  const entry = manifest[`src/data/${bank.file}`];
  if (!entry) { errors.push(`${bank.file}: no chunk of its own (merged into another chunk?)`); continue; }
  if (owner.has(entry.file)) errors.push(`${bank.file}: shares ${entry.file} with ${owner.get(entry.file)}`);
  owner.set(entry.file, bank.file);
  if ((entry.imports || []).length) errors.push(`${bank.file}: its chunk imports ${entry.imports.join(', ')}`);
  const code = readFileSync(path.join(ROOT, 'dist', entry.file), 'utf8');
  if (!new RegExp(`\\bas ${bank.export}\\b|export\\s*\\{[^}]*\\b${bank.export}\\b`).test(code)) {
    errors.push(`${bank.file}: ${entry.file} does not export ${bank.export} by name`);
  }
}
const bankFiles = readdirSync(path.join(ROOT, 'src', 'data')).filter((f) => /^questions-.+\.js$/.test(f));
const registered = new Set(BANK_REGISTRY.map((b) => b.file));
for (const f of bankFiles) if (!registered.has(f)) errors.push(`${f}: not in bank-registry.generated.js (npm run regen:registry)`);

if (errors.length) {
  console.error(`lint:bank-chunks: ${errors.length} problem(s)`);
  for (const e of errors) console.error(`  ${e}`);
  process.exit(1);
}
console.log(`lint:bank-chunks: ${BANK_REGISTRY.length} banks, each its own chunk, none importing another`);
