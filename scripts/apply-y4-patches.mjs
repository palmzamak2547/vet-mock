#!/usr/bin/env node
// ============================================================
// apply-y4-patches.mjs — apply Y4 Sem 1 + Y4 Sem 2 Mid patches
// ============================================================
//
// Reads tmp/y4-patches/<subject>.json produced by parallel extraction
// agents and writes them into src/data/questions-*.js (creates new
// files for Y4 Sem 1 scaffolds, appends to existing for Y4 Sem 2 mid
// additions).
//
// Run after agents finish:
//   node scripts/apply-y4-patches.mjs
//   node scripts/apply-y4-patches.mjs --dry        # plan only
//   node scripts/apply-y4-patches.mjs --topics-out tmp/curriculum-topics.json
//
// Idempotency:
//   - NEW files: overwrites — running twice with same JSON produces
//     identical output (safe).
//   - APPEND files: uses comment markers to find + replace previously
//     injected block, so re-runs don't duplicate Qs.
//
// Schema enforced per Q:
//   { id:int, subject:str, topic:str, year:int, source:str,
//     type:'mcq', q:str, options:str[≥2], answer:int|null,
//     explain:str, verified:str?, examOrigin:str?,
//     tags:str[]?, flag:str? }
//
// Sanitization:
//   "โพย" family → "สรุป"/"เฉลย"/"สรุปรวม" applied defensively across
//   q/options/explain/verified/examOrigin (user-visible per Palm rule).
//   source/topic/tags untouched.
// ============================================================

import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const PATCHES_DIR = join(ROOT, 'tmp/y4-patches');
const DATA_DIR = join(ROOT, 'src/data');

const args = process.argv.slice(2);
const DRY = args.includes('--dry');
const TOPICS_OUT_IDX = args.indexOf('--topics-out');
const TOPICS_OUT = TOPICS_OUT_IDX >= 0 ? args[TOPICS_OUT_IDX + 1] : null;

// ── Target metadata ─────────────────────────────────────────
// kind:'new'    → create new questions-{slug}.js with full export
// kind:'append' → inject into existing questions-{file}.js before `];`
const TARGETS = {
  // ── Y4 Sem 1 NEW files ──
  'com1':           { kind: 'new', file: 'questions-com1.js',           exp: 'QB_COM1',           desc: 'COM I — Companion Animal Clinical Sciences I (Y4 Sem 1)' },
  'com2':           { kind: 'new', file: 'questions-com2.js',           exp: 'QB_COM2',           desc: 'COM II — Companion Animal Clinical Sciences II (Y4 Sem 1)' },
  'vet-imaging':    { kind: 'new', file: 'questions-vet-imaging.js',    exp: 'QB_VET_IMAGING',    desc: 'Veterinary Imaging (Y4 Sem 1)' },
  'swine-repro':    { kind: 'new', file: 'questions-swine-repro.js',    exp: 'QB_SWINE_REPRO',    desc: 'Swine Reproduction (Y4 Sem 1)' },
  'swine-herd':     { kind: 'new', file: 'questions-swine-herd.js',     exp: 'QB_SWINE_HERD',     desc: 'Swine Herd Health Management (Y4 Sem 1)' },
  'food-safety-y4': { kind: 'new', file: 'questions-food-safety-y4.js', exp: 'QB_FOOD_SAFETY_Y4', desc: 'Food Safety (Y4 Sem 1)' },
  'vet-juris':      { kind: 'new', file: 'questions-vet-juris.js',      exp: 'QB_VET_JURIS',      desc: 'Veterinary Jurisprudence + Ethics + Animal Welfare (Y4 Sem 1)' },
  'engprof1':       { kind: 'new', file: 'questions-engprof1.js',       exp: 'QB_ENGPROF1',       desc: 'English for Veterinary Profession I (Y4 Sem 1)' },

  // ── Y4 Sem 2 Mid APPENDS ──
  'exotic-mid':     { kind: 'append', file: 'questions-exotic.js', exp: 'QB_EXOTIC', desc: 'Exotic (Y4 Sem 2 Mid 86 additions)' },
  'com3-mid':       { kind: 'append', file: 'questions-com3.js',   exp: 'QB_COM3',   desc: 'COM III (Y4 Sem 2 Mid 86 additions)' },
};

// ── "โพย" sanitization (defensive — agents should have done this) ──
const SAN_REPLACEMENTS = [
  ['เฉลยโพย', 'เฉลย'],
  ['รวมโพย', 'สรุปรวม'],
  ['โพยรุ่นพี่', 'สรุปจากรุ่นพี่'],
  ['ในโพย', 'ในสรุป'],
  ['ตามโพย', 'ตามสรุป'],
  ['จากโพย', 'จากสรุป'],
  ['โพยของ', 'สรุปของ'],
  ['โพยพี่', 'สรุปพี่'],
  ['โพย', 'สรุป'],
];

function sanitizeStr(s) {
  if (typeof s !== 'string') return s;
  let out = s;
  for (const [from, to] of SAN_REPLACEMENTS) out = out.split(from).join(to);
  return out;
}

// `source` is shown in the verified panel — must also be sanitized.
const SAN_USER_FIELDS = ['q', 'explain', 'verified', 'examOrigin', 'source'];
function sanitizeQ(q) {
  const out = { ...q };
  for (const f of SAN_USER_FIELDS) {
    if (typeof out[f] === 'string') out[f] = sanitizeStr(out[f]);
  }
  if (Array.isArray(out.options)) {
    out.options = out.options.map(sanitizeStr);
  }
  // Clean up tags — if any tag accidentally contains "โพย", drop it
  if (Array.isArray(out.tags)) {
    out.tags = out.tags.filter((t) => typeof t === 'string' && !t.includes('โพย'));
  }
  return out;
}

// ── Validation ──────────────────────────────────────────────
function validateQ(q, idx, subject) {
  const errs = [];
  if (typeof q.id !== 'number') errs.push(`q[${idx}]: missing id`);
  if (q.subject && q.subject !== subject && !subject.includes('-mid')) {
    // For mid-append subjects (exotic-mid → exotic, com3-mid → com3),
    // the Q's `subject` field should match the existing file's subject,
    // not the patch slug.
    const baseSubj = subject.replace(/-mid$/, '');
    if (q.subject !== baseSubj) {
      errs.push(`q[${idx}]: subject ${q.subject} ≠ expected ${baseSubj}`);
    }
  }
  if (typeof q.topic !== 'string') errs.push(`q[${idx}]: missing topic slug`);
  if (q.type !== 'mcq') errs.push(`q[${idx}]: type=${q.type} (expected mcq)`);
  if (typeof q.q !== 'string' || !q.q.trim()) errs.push(`q[${idx}]: missing q stem`);
  if (!Array.isArray(q.options) || q.options.length < 2) {
    errs.push(`q[${idx}]: options not array of ≥2`);
  }
  if (q.flag === 'unclear' && (q.answer === null || q.answer === undefined)) {
    // OK — explicitly unclear
  } else if (typeof q.answer !== 'number' || q.answer < 0 || q.answer >= (q.options?.length || 0)) {
    errs.push(`q[${idx}]: answer index ${q.answer} out of range 0..${(q.options?.length || 0) - 1}`);
  }
  if (typeof q.explain !== 'string') errs.push(`q[${idx}]: missing explain`);
  // Visual answer-tell guard
  for (let i = 0; i < (q.options?.length || 0); i++) {
    const o = q.options[i];
    if (typeof o !== 'string') { errs.push(`q[${idx}]: options[${i}] not a string`); continue; }
    if (o.includes('★')) errs.push(`q[${idx}]: options[${i}] contains ★ (visible answer tell)`);
    if (o.includes('**')) errs.push(`q[${idx}]: options[${i}] contains ** (visible answer tell)`);
    if (o.endsWith('…') || o.endsWith('...')) errs.push(`q[${idx}]: options[${i}] truncated with ellipsis`);
  }
  return errs;
}

// ── Serialization ───────────────────────────────────────────
// Use JSON.stringify (valid JSON is valid JS). Indent 2 spaces, then
// indent the whole block by 2 more so it sits inside `export const X = [ ... ]`.
function serializeQ(q) {
  return JSON.stringify(q, null, 2).split('\n').map((l) => '  ' + l).join('\n');
}

// ── New-file builder ────────────────────────────────────────
function buildNewFile(meta, subject, qs) {
  const date = new Date().toISOString().slice(0, 10);
  const minId = Math.min(...qs.map((q) => q.id));
  const maxId = Math.max(...qs.map((q) => q.id));
  const topicSet = new Set(qs.map((q) => q.topic).filter(Boolean));
  const flagged = qs.filter((q) => q.flag).length;

  const header = [
    '// ============================================================',
    `// ${meta.desc}`,
    '// ============================================================',
    '//',
    `// AUTO-MERGED from tmp/y4-patches/${subject}.json via`,
    '// scripts/apply-y4-patches.mjs.',
    `// Built: ${date}`,
    '//',
    `// Subject slug: ${subject}`,
    `// ID range: ${minId}–${maxId} (${qs.length} Qs)`,
    `// Topics: ${[...topicSet].sort().join(', ')}`,
    `// Flagged: ${flagged}${flagged > 0 ? ' (see flag:"minor"|"unclear" — verify before locking)' : ''}`,
    '//',
    '// Sources: Y4 Sem 1 past-paper PDFs (Vet 86 study folder).',
    '// Each Q cross-checked against ≥2 sources per extraction-agent brief.',
    '// Academic-safety vocab sanitized across q/options/explain/verified/',
    '// examOrigin/source per Palm rule (lint:academic-safety gates commits).',
    '// ============================================================',
    '',
    `export const ${meta.exp} = [`,
  ];

  const body = qs.map((q, i) => serializeQ(q) + (i < qs.length - 1 ? ',' : ''));
  const footer = ['];', ''];

  return [...header, ...body, ...footer].join('\n');
}

// ── Append-into-existing builder ────────────────────────────
const APPEND_MARKER_START = '  // ─── Y4 Sem 2 Mid 86 additions (auto-injected) ───';
const APPEND_MARKER_END   = '  // ─── End Y4 Sem 2 Mid 86 additions ───';

function appendToFile(meta, subject, existingSrc, qs) {
  const blockLines = [
    APPEND_MARKER_START,
    `  // Source: tmp/y4-patches/${subject}.json — built ${new Date().toISOString().slice(0, 10)}`,
    `  // ${qs.length} Qs · IDs ${Math.min(...qs.map((q) => q.id))}-${Math.max(...qs.map((q) => q.id))}`,
    ...qs.map((q, i) => '  ' + JSON.stringify(q) + (i < qs.length - 1 ? ',' : ',')),
    APPEND_MARKER_END,
  ];
  const block = blockLines.join('\n');

  // Replace existing auto-injected block if present
  const escStart = APPEND_MARKER_START.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const escEnd   = APPEND_MARKER_END.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const reBlock  = new RegExp(escStart + '[\\s\\S]*?' + escEnd, 'm');

  if (reBlock.test(existingSrc)) {
    return existingSrc.replace(reBlock, block);
  }

  // First injection — insert before the LAST `];` (closing of QB_X array)
  const closingIdx = existingSrc.lastIndexOf('];');
  if (closingIdx < 0) {
    throw new Error(`Cannot find closing ]; in ${meta.file}`);
  }
  return (
    existingSrc.slice(0, closingIdx).replace(/\s*$/, '\n') +
    block + '\n' +
    existingSrc.slice(closingIdx)
  );
}

// ── Main ────────────────────────────────────────────────────
function main() {
  if (!existsSync(PATCHES_DIR)) {
    console.error(`✗ Patches dir missing: ${PATCHES_DIR}`);
    process.exit(1);
  }
  const patchFiles = readdirSync(PATCHES_DIR).filter((f) => f.endsWith('.json')).sort();
  console.log(`━━━ Y4 patch applier ━━━`);
  console.log(`Patches found: ${patchFiles.length}`);
  if (DRY) console.log(`(dry run — no writes)`);
  console.log('');

  const results = [];
  const allTopicsBySubject = {};

  for (const pf of patchFiles) {
    const key = pf.replace(/\.json$/, '');
    const meta = TARGETS[key];
    if (!meta) {
      console.warn(`⚠️ unknown patch subject: ${key} — skipping`);
      continue;
    }

    let patch;
    try {
      patch = JSON.parse(readFileSync(join(PATCHES_DIR, pf), 'utf8'));
    } catch (e) {
      console.error(`✗ ${pf}: JSON parse error — ${e.message}`);
      continue;
    }

    const rawQs = Array.isArray(patch.qs) ? patch.qs : [];
    if (!rawQs.length) {
      console.warn(`⚠️ ${pf}: empty qs[] — skipping`);
      continue;
    }

    // Validate + sanitize
    const errs = [];
    const qs = rawQs.map((q, i) => {
      errs.push(...validateQ(q, i, patch.subject || key));
      return sanitizeQ(q);
    });
    if (errs.length) {
      console.error(`✗ ${pf}: ${errs.length} validation errors:`);
      errs.slice(0, 10).forEach((e) => console.error(`   - ${e}`));
      if (errs.length > 10) console.error(`   ... +${errs.length - 10} more`);
      console.error('   (skipping patch)');
      continue;
    }

    // Topic aggregation for curriculum.js patch
    const baseSubj = (meta.kind === 'append') ? (patch.subject || key.replace(/-mid$/, '')) : key;
    allTopicsBySubject[baseSubj] = allTopicsBySubject[baseSubj] || new Set();
    qs.forEach((q) => { if (q.topic) allTopicsBySubject[baseSubj].add(q.topic); });

    // ID uniqueness within this patch
    const idSet = new Set();
    let dup = 0;
    qs.forEach((q) => { if (idSet.has(q.id)) dup++; idSet.add(q.id); });
    if (dup) {
      console.error(`✗ ${pf}: ${dup} duplicate IDs within patch — skipping`);
      continue;
    }

    const outPath = join(DATA_DIR, meta.file);

    if (meta.kind === 'new') {
      const content = buildNewFile(meta, key, qs);
      if (!DRY) writeFileSync(outPath, content, 'utf8');
      console.log(`✓ ${key.padEnd(16)} → ${meta.file} (created, ${qs.length} Qs, IDs ${Math.min(...qs.map(q => q.id))}-${Math.max(...qs.map(q => q.id))})`);
      results.push({ subj: key, file: meta.file, action: 'created', count: qs.length });
    } else if (meta.kind === 'append') {
      if (!existsSync(outPath)) {
        console.error(`✗ ${key}: target ${meta.file} doesn't exist — cannot append`);
        continue;
      }
      const existing = readFileSync(outPath, 'utf8');
      const next = appendToFile(meta, key, existing, qs);
      if (!DRY) writeFileSync(outPath, next, 'utf8');
      console.log(`✓ ${key.padEnd(16)} → ${meta.file} (appended, +${qs.length} Qs, IDs ${Math.min(...qs.map(q => q.id))}-${Math.max(...qs.map(q => q.id))})`);
      results.push({ subj: key, file: meta.file, action: 'appended', count: qs.length });
    }
  }

  // ── Summary ──
  console.log('');
  console.log('━━━ Summary ━━━');
  const totalQs = results.reduce((s, r) => s + r.count, 0);
  console.log(`Patches applied: ${results.length}/${patchFiles.length}`);
  console.log(`Qs total:        ${totalQs}`);
  console.log(`Created files:   ${results.filter((r) => r.action === 'created').length}`);
  console.log(`Appended files:  ${results.filter((r) => r.action === 'appended').length}`);

  // ── Curriculum topics output ──
  const topicsReport = {};
  for (const [subj, set] of Object.entries(allTopicsBySubject)) {
    topicsReport[subj] = [...set].sort();
  }
  if (TOPICS_OUT) {
    // Topics-out always writes (it's a planning artifact, not a code change).
    writeFileSync(TOPICS_OUT, JSON.stringify(topicsReport, null, 2), 'utf8');
    console.log(`Topics report:   ${TOPICS_OUT}`);
  } else {
    console.log('');
    console.log('━━━ Topics extracted per subject (for curriculum.js patch) ━━━');
    for (const [subj, slugs] of Object.entries(topicsReport)) {
      console.log(`  ${subj}: ${slugs.length} topics — ${slugs.slice(0, 6).join(', ')}${slugs.length > 6 ? ', …' : ''}`);
    }
  }

  console.log('');
  console.log('Next steps:');
  console.log('  1. Add LOADERS entries to src/data/questions.js (8 new files).');
  console.log('  2. Add manualChunks rules to vite.config.js (engprof1 BEFORE engprof).');
  console.log('  3. Flip scaffold:false + has_questions:true + topics in src/data/curriculum.js.');
  console.log('  4. npm run lint:academic-safety && npm run lint:q-ids && npm run lint:q-dupes');
  console.log('  5. npm run regen:q-counts');
  console.log('  6. npm run build');
}

main();
