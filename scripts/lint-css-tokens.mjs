#!/usr/bin/env node
// ============================================================
// lint-css-tokens.mjs — every var(--token) must name a real token
// ============================================================
// Usage: node scripts/lint-css-tokens.mjs [--write]
//
// TermPopup and TermPopover painted their card with
// `var(--clr-surface-1, #fff)`. `--clr-surface-1` is defined nowhere —
// styles.css has `--clr-surface` and `--clr-surface-2` and nothing else — so
// both popovers always used the hardcoded white, while the text beside it
// used `--clr-ink`, which DOES resolve and turns cream in dark mode. Cream on
// white measures 1.24:1. The typo was invisible in review because a var()
// with a fallback never errors; it just quietly stops being themed.
//
// A token with no fallback is worse still: the whole declaration is invalid
// at computed-value time and the property falls back to inherited or initial,
// which for a background can mean transparent.
//
// Same one-way ratchet as lint-hex-budget: the tokens already referenced
// without a definition are recorded in docs/css-token-baseline.json, a NEW
// one fails the build, and a token that stops being referenced has to be
// removed from the baseline with --write.
// ============================================================

import fs from 'node:fs';
import { resolve, join, sep } from 'node:path';

const ROOT = resolve(import.meta.dirname, '..');
const BASELINE_PATH = resolve(ROOT, 'docs/css-token-baseline.json');
const STYLESHEETS = ['src/styles.css', 'src/styles-landing.css'];

function definedTokens() {
  const css = STYLESHEETS
    .map((f) => { try { return fs.readFileSync(join(ROOT, f), 'utf8'); } catch { return ''; } })
    .join('\n');
  return new Set([...css.matchAll(/(--[a-z0-9-]+)\s*:/gi)].map((m) => m[1]));
}

function sourceFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const full = join(dir, e.name);
    if (e.isDirectory()) return sourceFiles(full);
    if (!/\.(jsx?|mjs|css)$/.test(e.name)) return [];
    if (STYLESHEETS.some((s) => full.endsWith(s.split('/').join(sep)))) return [];
    return [full];
  });
}

const defined = definedTokens();
const found = new Map(); // token -> { files:Set, noFallback:number }

for (const file of sourceFiles(resolve(ROOT, 'src'))) {
  // Strip comments so an explanatory mention of a token does not count.
  const code = fs.readFileSync(file, 'utf8')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\/\/.*$/gm, '');
  for (const m of code.matchAll(/var\(\s*(--[a-z0-9-]+)\s*(,[^)]*)?\)/gi)) {
    const [, token, fallback] = m;
    if (defined.has(token)) continue;
    if (!found.has(token)) found.set(token, { files: new Set(), noFallback: 0 });
    const rec = found.get(token);
    rec.files.add(file.slice(ROOT.length + 1).split(sep).join('/'));
    if (!fallback) rec.noFallback += 1;
  }
}

const baseline = JSON.parse(fs.readFileSync(BASELINE_PATH, 'utf8'));
const known = new Set(baseline.undefinedTokens || []);

if (process.argv.includes('--write')) {
  fs.writeFileSync(
    BASELINE_PATH,
    `${JSON.stringify({ undefinedTokens: [...found.keys()].sort() }, null, 2)}\n`,
  );
  console.log(`lint:css-tokens — recorded ${found.size} undefined token(s)`);
  process.exit(0);
}

const failures = [];
// A token with no fallback anywhere is a live bug, baselined or not: the
// declaration is simply dropped.
for (const [token, rec] of found) {
  if (rec.noFallback > 0) {
    failures.push(`${token} is used ${rec.noFallback}× WITHOUT a fallback (${[...rec.files].join(', ')})`);
  } else if (!known.has(token)) {
    failures.push(`${token} is not defined in ${STYLESHEETS.join(' or ')} (${[...rec.files].join(', ')})`);
  }
}
const gone = [...known].filter((t) => !found.has(t));

if (failures.length) {
  console.error('lint:css-tokens — var() references a token that does not exist:');
  for (const f of failures) console.error(`  ${f}`);
  console.error('Point it at a real token, or record it with --write if the fallback is deliberate.');
  process.exit(1);
}
if (gone.length) {
  console.error('lint:css-tokens — baseline lists tokens nothing references any more; run --write:');
  for (const t of gone) console.error(`  ${t}`);
  process.exit(1);
}
console.log(`lint:css-tokens — OK (${defined.size} defined, ${found.size} baselined fallback-only)`);
