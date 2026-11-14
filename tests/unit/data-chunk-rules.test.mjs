// Every question bank and note file is its own chunk (AGENTS "Content and banks"): a bank that
// shares a chunk with another is exported under a short name the bank retry cannot read, and a data
// file pulled into a screen's chunk downloads on every visit to that screen. vite.config.js claims
// each file with a hand-typed `id.includes('questions-…')` rule, matched first to last, and until
// now only lint:bank-chunks noticed a mistake, after a full build. This reads src/data and the
// rules before any build and fails when:
//   - a rule's text is the start of another file's name, so the rule claims that file too
//     (questions-vca grabbing a new questions-vca-2570.js), or two files land in one chunk;
//   - a rule claims no file (a bank renamed under its rule);
//   - a file is not loaded through a dynamic import(), the thing that makes it a chunk;
//   - a new file arrives with no rule of its own.
// 83 files have no rule today and are their own chunk only by Rollup's default for a dynamic
// import (lint:bank-chunks confirms that after each build). They are listed below; the list may
// only shrink, and a file leaves it by gaining an exact rule.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import config from '../../vite.config.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const manualChunks = config.build.rollupOptions.output.manualChunks;
const CONFIG = readFileSync(path.join(ROOT, 'vite.config.js'), 'utf8');
const DATA = path.join(ROOT, 'src', 'data');

// Not data chunks: the generated index of note titles, imported statically on purpose.
const NOT_DATA = { 'notes-registry.generated.js': 'the note index study-catalog.js reads at boot' };
const FILES = readdirSync(DATA).filter((f) => /^(questions|notes)-.+\.js$/.test(f) && !NOT_DATA[f]).sort();
const stem = (f) => f.replace(/\.js$/, '');

// Rules in the order Vite tries them.
const RULES = [...CONFIG.matchAll(/id\.includes\('((?:questions|notes)-[^']+)'\)\) return '([^']+)'/g)]
  .map((m) => ({ needle: m[1], chunk: m[2] }));
const ruleFor = (f) => RULES.find((r) => `src/data/${f}`.includes(r.needle)) || null;

const NO_RULE_YET = `
notes-85-aquatic-clinic notes-85-avian-medicine notes-85-equine-medicine notes-85-equine-repro
notes-85-food-industry notes-85-milk-meat-hygiene notes-85-one-health notes-85-poa-clinical
notes-85-swine-clinic notes-85-zoonoses notes-y2-biochem-2 notes-y2-histo notes-y2-microbio-1
notes-y2-neuroanat notes-y2-parasit-1 notes-y2-physio-3 notes-y2-physio-lab-1 notes-y2-physio-lab-2
notes-y5-aquatic notes-y5-avian-medicine notes-y5-epidemiology notes-y5-fiqc notes-y5-one-health notes-y5-poa
questions-biochem-lab questions-biochem-lect questions-biochem-lect2 questions-biochem-lect3
questions-biochem-lect4 questions-biochem-midterm questions-mid86-aquatic-clinic
questions-mid86-avian-medicine questions-mid86-equine-medicine questions-mid86-equine-repro
questions-mid86-food-industry questions-mid86-milk-meat-hygiene questions-mid86-one-health
questions-mid86-swine-clinic questions-mid86-zoonoses questions-vet-dev questions-vet-pharm2
questions-y2-histo questions-y2-neuroanat questions-y5-aquatic-0924 questions-y5-aquatic-2026-b
questions-y5-aquatic-2026 questions-y5-aquatic-tj questions-y5-avian-2026-b questions-y5-avian-2026-c
questions-y5-avian-2026-d questions-y5-avian-2026 questions-y5-avian-ae-bacterial
questions-y5-avian-parasitic questions-y5-avian-pastpaper questions-y5-epidemiology-2026-b
questions-y5-epidemiology-2026-c questions-y5-epidemiology-2026 questions-y5-eqrepro-2026
questions-y5-equine-2026-b questions-y5-equine-2026 questions-y5-fiqc-2026-b questions-y5-fiqc-2026-c
questions-y5-fiqc-2026 questions-y5-fiqc-pastpaper questions-y5-milk-2026-b questions-y5-milk-2026-c
questions-y5-milk-hygiene-2026 questions-y5-milk-hygiene-pastpaper questions-y5-one-health-2026-b
questions-y5-one-health-2026-c questions-y5-one-health-2026 questions-y5-one-health-pastpaper
questions-y5-poa-2026-b questions-y5-poa-2026-c questions-y5-poa-2026 questions-y5-swine-0924
questions-y5-swine-2026-b questions-y5-zoonoses-0925 questions-y5-zoonoses-0925b questions-y5-zoonoses-2026-b
questions-y5-zoonoses-2026-c questions-y5-zoonoses-2026-d questions-y5-zoonoses-2026
`.trim().split(/\s+/);

test('the rules are read the way Vite reads them', () => {
  assert.ok(RULES.length >= 55, `rules found: ${RULES.length}`);
  for (const f of FILES) {
    const rule = ruleFor(f);
    assert.equal(manualChunks(path.join(DATA, f)) ?? null, rule ? rule.chunk : null, `${f}: the parsed rules and vite.config.js disagree`);
  }
});

test('a rule claims exactly the file it is named after, and no two files share a chunk', () => {
  const owner = new Map();
  for (const f of FILES) {
    const rule = ruleFor(f);
    if (!rule) continue;
    assert.equal(rule.needle, stem(f), `${f} is claimed by the rule for ${rule.needle} (chunk ${rule.chunk}): give it an exact rule above that one`);
    assert.ok(!owner.has(rule.chunk), `${f} and ${owner.get(rule.chunk)} would share chunk ${rule.chunk}`);
    owner.set(rule.chunk, f);
  }
  for (const r of RULES) assert.ok(FILES.includes(`${r.needle}.js`), `vite.config.js has a rule for ${r.needle}, but src/data has no ${r.needle}.js`);
});

test('every data file is loaded through a dynamic import', () => {
  const dynamic = new Set();
  const walk = (dir) => {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) walk(p);
      // The data files themselves load nothing, and reading 100 MB of them would be most of the time.
      else if (/\.(js|jsx)$/.test(e.name) && !/^(questions|notes|video-summaries)-|^verification-generated\.js$/.test(e.name)) {
        for (const m of readFileSync(p, 'utf8').matchAll(/import\(\s*['"][^'"]*\/((?:questions|notes)-[^'"/]+\.js)['"]\s*\)/g)) dynamic.add(m[1]);
      }
    }
  };
  walk(path.join(ROOT, 'src'));
  for (const f of FILES) assert.ok(dynamic.has(f), `${f} is never import()ed, so it is not a chunk of its own`);
});

test('a data file without a rule of its own is one of the files listed today, and the list only shrinks', () => {
  const without = FILES.filter((f) => !ruleFor(f)).map(stem);
  for (const s of without) assert.ok(NO_RULE_YET.includes(s), `${s}.js has no chunk rule in vite.config.js: add if (id.includes('${s}')) return 'data-…'`);
  for (const s of NO_RULE_YET) {
    assert.ok(FILES.includes(`${s}.js`), `NO_RULE_YET lists ${s}, which src/data no longer has: drop it from the list`);
    assert.ok(!ruleFor(`${s}.js`), `${s} has a rule now: drop it from NO_RULE_YET`);
  }
});
