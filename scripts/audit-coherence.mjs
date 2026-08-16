#!/usr/bin/env node
// ============================================================
// audit-coherence.mjs — does the corpus agree with itself?
// ============================================================
// Usage: node scripts/audit-coherence.mjs
//
// The individual gates each guard one rule. This asks a different question:
// where does the corpus contradict ITSELF -- a question filed under a topic its
// subject does not have, an image referenced that is not on disk, a bank whose
// year disagrees with the curriculum, four different ways of writing a page
// number in the same field.
//
// Reports only. Nothing here writes.
// ============================================================

import fs from 'node:fs';
import path from 'node:path';
import { bankFiles, readBank } from './lib/bank-file.mjs';

const { SUBJECTS, SUBJECTS_BY_YEAR, YEARS } = await import('../src/data/curriculum.js');

const yearOf = new Map();
const semOf = new Map();
for (const y of YEARS) for (const s of (SUBJECTS_BY_YEAR[y.id] || [])) { yearOf.set(s.id, y.id); semOf.set(s.id, s.semester); }
const topicsOf = new Map(SUBJECTS.map((s) => [s.id, new Set((s.topics || []).map((t) => t.id))]));

const all = [];
const bankOf = new Map();
for (const f of bankFiles()) {
  const { questions } = await readBank(f);
  for (const q of questions) { all.push(q); bankOf.set(q.id, path.basename(f)); }
}

const findings = [];
const add = (sev, area, msg, detail) => findings.push({ sev, area, msg, detail });

// ── 1. every question's subject exists, and its year matches the curriculum ──
{
  const unknownSubject = new Map();
  const yearMismatch = [];
  for (const q of all) {
    if (!yearOf.has(q.subject)) {
      if (!unknownSubject.has(q.subject)) unknownSubject.set(q.subject, 0);
      unknownSubject.set(q.subject, unknownSubject.get(q.subject) + 1);
      continue;
    }
    const y = yearOf.get(q.subject);
    if (q.year != null && Number(q.year) !== y) yearMismatch.push(`#${q.id} ${q.subject}: q.year=${q.year} curriculum=${y}`);
  }
  for (const [s, n] of unknownSubject) add('HIGH', 'curriculum', `subject "${s}" is not in the curriculum`, `${n} question(s)`);
  if (yearMismatch.length) add('HIGH', 'curriculum', `${yearMismatch.length} question(s) disagree with the curriculum about their year`, yearMismatch.slice(0, 6).join(' · '));
}

// ── 2. every topic id belongs to its own subject ──
{
  const bad = [];
  for (const q of all) {
    const set = topicsOf.get(q.subject);
    if (!set || !q.topic) continue;
    if (set.size && !set.has(q.topic)) bad.push(`#${q.id} ${q.subject}/${q.topic}`);
  }
  if (bad.length) add('HIGH', 'curriculum', `${bad.length} question(s) filed under a topic their subject does not list`, bad.slice(0, 6).join(' · '));
}

// ── 3. images: referenced but missing, or on disk and orphaned ──
{
  const referenced = new Set();
  const missing = [];
  for (const q of all) {
    for (const key of ['image', 'imagePath']) {
      const v = q[key];
      if (!v || typeof v !== 'string' || !v.startsWith('/')) continue;
      referenced.add(v);
      if (!fs.existsSync(path.join('public', v.replace(/^\//, '')))) missing.push(`#${q.id} ${v}`);
    }
  }
  if (missing.length) add('HIGH', 'images', `${missing.length} question image(s) referenced but not on disk`, missing.slice(0, 6).join(' · '));

  const dir = 'public/figures/questions';
  if (fs.existsSync(dir)) {
    const orphans = fs.readdirSync(dir).filter((f) => !referenced.has(`/figures/questions/${f}`));
    if (orphans.length) add('MED', 'images', `${orphans.length} figure(s) on disk that no question uses`, orphans.slice(0, 8).join(' · '));
  }
}

// ── 4. provenance shape: is a bank internally consistent? ──
{
  const perBank = new Map();
  for (const q of all) {
    const b = bankOf.get(q.id);
    if (!perBank.has(b)) perBank.set(b, []);
    perBank.get(b).push(q);
  }
  const mixed = [];
  for (const [b, list] of perBank) {
    const withVerified = list.filter((q) => q.verified).length;
    const withSource = list.filter((q) => q.source).length;
    const withTags = list.filter((q) => (q.tags || []).length).length;
    // a bank where a field is present on some but not most is the drift worth seeing
    for (const [name, n] of [['verified', withVerified], ['source', withSource], ['tags', withTags]]) {
      const frac = n / list.length;
      if (frac > 0.15 && frac < 0.85) mixed.push(`${b}: ${name} on ${n}/${list.length}`);
    }
  }
  if (mixed.length) add('LOW', 'provenance', `${mixed.length} bank(s) carry a provenance field on only some questions`, mixed.slice(0, 8).join(' · '));
}

// ── 5. how many ways do we write a page number? ──
{
  const forms = new Map();
  for (const q of all) {
    const v = String(q.verified || '');
    for (const m of v.matchAll(/(p\.|pp\.|น\.|หน้า|page\s|slide\s)\s?\d/gi)) {
      const k = m[1].trim().toLowerCase();
      forms.set(k, (forms.get(k) || 0) + 1);
    }
  }
  // "p." (English deck page), "น." (Thai deck page) and "slide" (a pptx, where
  // slide number is the locator) are three different things, not three
  // spellings of one. Only flag the synonyms.
  const SYNONYMS = { page: 'p.', 'pp.': 'p.', หน้า: 'น.' };
  const strays = [...forms].filter(([k]) => SYNONYMS[k]);
  if (strays.length) {
    add('LOW', 'style', `${strays.reduce((a, [, n]) => a + n, 0)} locator(s) use a synonym of an established prefix`,
      strays.map(([k, n]) => `"${k}" ×${n} → write "${SYNONYMS[k]}"`).join(' · '));
  } else {
    add('INFO', 'style', 'page locators are consistent', [...forms].map(([k, n]) => `${k} ${n}`).join(' · '));
  }
}

// ── 6. answer position, per subject ──
{
  const bySub = new Map();
  for (const q of all) {
    if (typeof q.answer !== 'number' || !Array.isArray(q.options)) continue;
    if (!bySub.has(q.subject)) bySub.set(q.subject, []);
    bySub.get(q.subject).push(q.answer);
  }
  const skewed = [];
  for (const [s, list] of bySub) {
    if (list.length < 20) continue;
    const c = {};
    for (const a of list) c[a] = (c[a] || 0) + 1;
    const worst = Math.max(...Object.values(c));
    const pct = worst / list.length;
    if (pct > 0.45) skewed.push(`${s} ${Math.round(pct * 100)}% at index ${Object.entries(c).find(([, v]) => v === worst)[0]} (n=${list.length})`);
  }
  // INFO, not a defect: Question.jsx shuffles options per question at render
  // (stable per id, catch-all tail kept last), so the stored index is never
  // what a student sees. Worth watching for authoring habits, not worth
  // rewriting data over.
  if (skewed.length) add('INFO', 'answer-bias', `${skewed.length} subject(s) store the answer at one index — harmless, the UI shuffles per question`, skewed.slice(0, 5).join(' · '));
}

// ── 7. option-count uniformity ──
{
  const byYear = new Map();
  for (const q of all) {
    const y = yearOf.get(q.subject);
    if (!Array.isArray(q.options) || !q.options.length) continue;
    if (!byYear.has(y)) byYear.set(y, new Map());
    const m = byYear.get(y);
    m.set(q.options.length, (m.get(q.options.length) || 0) + 1);
  }
  const rows = [...byYear].sort((a, b) => a[0] - b[0])
    .map(([y, m]) => `ปี${y}: ${[...m].sort((a, b) => a[0] - b[0]).map(([n, c]) => `${n}opt×${c}`).join(' ')}`);
  add('INFO', 'shape', 'option counts by year', rows.join('  |  '));
}

// ── 8. explanation shape, by year ──
{
  const byYear = new Map();
  for (const q of all) {
    const y = yearOf.get(q.subject);
    if (!byYear.has(y)) byYear.set(y, { n: 0, why: 0, hook: 0, empty: 0 });
    const r = byYear.get(y);
    r.n++;
    if (/ทำไมข้ออื่นผิด|❌/.test(q.explain || '')) r.why++;
    if (/💡/.test(q.explain || '')) r.hook++;
    if (!String(q.explain || '').trim()) r.empty++;
  }
  const empties = [...byYear].filter(([, r]) => r.empty);
  if (empties.length) add('MED', 'explain', `${empties.reduce((a, [, r]) => a + r.empty, 0)} question(s) have no explanation at all`, empties.map(([y, r]) => `ปี${y}: ${r.empty}`).join(' · '));
}

// ── 9. can a student reach the notes behind every governed wiki article? ──
//
// NotesView holds TWO maps, NOTES_BY_SUBJECT and NOTES_85_BY_SUBJECT, and its
// subject switcher is the union of both. An earlier version of this check read
// only the first and reported equine-repro as missing when it is simply in the
// other one — a false HIGH, which is the failure mode this whole audit exists
// to avoid. Compare the union.
{
  const src = (() => { try { return fs.readFileSync('src/views/NotesView.jsx', 'utf8'); } catch { return ''; } })();
  const reachable = new Set();
  for (const m of src.matchAll(/const (NOTES\w*_BY_SUBJECT)\s*=\s*\{/g)) {
    const open = src.indexOf('{', m.index);
    let d = 0, i = open;
    for (; i < src.length; i++) { if (src[i] === '{') d++; else if (src[i] === '}') { d--; if (!d) break; } }
    // keys come both quoted ('vet-physio-3':) and bare (com5:)
    for (const k of src.slice(open, i).matchAll(/(?:['"]([a-z][a-z0-9-]*)['"]|^\s*([a-z][a-z0-9-]*))\s*:/gim)) {
      reachable.add(k[1] || k[2]);
    }
  }

  const { listTopics } = await import('../src/lib/vetwiki/index.js');
  const governed = new Set((await listTopics()).map((t) => t.subject));

  if (!reachable.size) {
    add('LOW', 'notes-maps', 'could not read NotesView subject maps', 'check the NOTES*_BY_SUBJECT declarations');
  } else {
    const unreachable = [...governed].filter((s) => !reachable.has(s));
    if (unreachable.length) add('HIGH', 'notes-maps', `${unreachable.length} governed wiki subject(s) have no notes entry in NotesView`, unreachable.join(' · '));
    else add('INFO', 'notes-maps', 'every governed wiki subject is reachable from NotesView', `${governed.size} governed · ${reachable.size} with notes`);
  }
}

// ── 10. duplicate questions ──
//
// The key includes the passage. Reading-comprehension items legitimately reuse
// a stem across different articles — "What was the purpose of the study?" is
// asked about dogs-versus-cats, baboon bone loss, Newcastle disease in Oman and
// MRSP pyoderma. Keying on the stem alone called all six of those duplicates.
{
  const norm = (s) => String(s).toLowerCase().replace(/\s+/g, ' ').replace(/[^\p{L}\p{N} ]/gu, '').trim();
  const seen = new Map();
  const dupes = [];
  for (const q of all) {
    const k = `${norm(q.q)}||${norm(q.passage_title ?? '')}||${norm(String(q.passage ?? '').slice(0, 200))}`;
    if (norm(q.q).length < 25) continue;
    if (seen.has(k)) dupes.push(`#${seen.get(k)} ≡ #${q.id}`);
    else seen.set(k, q.id);
  }
  if (dupes.length) add('MED', 'duplicates', `${dupes.length} question(s) duplicate another, same stem AND same passage`, dupes.slice(0, 8).join(' · '));
}

// ── report ─────────────────────────────────────────────────────────
const ORDER = { HIGH: 0, MED: 1, LOW: 2, INFO: 3 };
findings.sort((x, y) => ORDER[x.sev] - ORDER[y.sev]);
console.log(`\n${all.length} questions · ${bankFiles().length} banks · ${SUBJECTS.length} subjects\n`);
for (const f of findings) {
  console.log(`[${f.sev.padEnd(4)}] ${f.area.padEnd(12)} ${f.msg}`);
  if (f.detail) console.log(`               ${f.detail}`);
}
const high = findings.filter((f) => f.sev === 'HIGH').length;
console.log(`\n${findings.length} finding(s), ${high} high`);
