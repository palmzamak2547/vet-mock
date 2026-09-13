// ============================================================
// glossary-scope.test.mjs
// ============================================================
// The term card used to define inflammatory bowel disease on a poultry
// Infectious Bursal Disease question, because the detector never looked
// at which subject the student was in. These tests pin the rule that
// replaced it: a card opens only where its definition is true, and when
// nothing is true it opens nothing at all.
// ============================================================
import { test } from 'node:test';
import assert from 'node:assert/strict';

import {
  GLOSSARY,
  SCOPE_FAMILIES,
  expandScope,
  entryKey,
  resolveGlossaryEntry,
} from '../../src/data/glossary.js';
import { detectTerms } from '../../src/lib/term-detect.js';

const termsOf = (text, subject) => detectTerms(text, subject).map((h) => h.term);

// ── resolution ───────────────────────────────────────────────────
test('a term with one meaning per discipline resolves to the right one', () => {
  const smallAnimal = resolveGlossaryEntry('IBD', 'com4');
  assert.ok(smallAnimal, 'IBD should resolve in small-animal medicine');
  assert.match(`${smallAnimal.thai} ${smallAnimal.defShort}`, /enteropathy|bowel|ลำไส้/i);
});

test('a scoped card never opens in a discipline it was not written for', () => {
  // If no avian IBD entry exists yet, the answer must be "nothing" —
  // never the small-animal card. That is the whole fix.
  const avian = resolveGlossaryEntry('IBD', 'avian-medicine');
  if (avian) {
    assert.notMatch(`${avian.thai} ${avian.defShort} ${avian.defLong}`, /inflammatory bowel|chronic enteropathy|ลำไส้อักเสบเรื้อรัง/i,
      'the small-animal IBD card must not be what opens on an avian question');
  }
});

test('a term with no in-scope entry resolves to nothing, not to a guess', () => {
  assert.equal(resolveGlossaryEntry('pyometra', 'equine-repro'), null);
  assert.equal(resolveGlossaryEntry('enrofloxacin', 'poultry'), null);
});

test('universal entries resolve in every subject', () => {
  for (const subject of ['com3', 'avian-medicine', 'milk-meat-hygiene', 'equine-medicine']) {
    assert.ok(resolveGlossaryEntry('azotemia', subject), `azotemia should resolve in ${subject}`);
  }
});

test('without a subject only a universal entry can answer', () => {
  assert.ok(resolveGlossaryEntry('azotemia', null));
  assert.equal(resolveGlossaryEntry('FLUTD', null), null);
});

// ── detection ────────────────────────────────────────────────────
test('detection is subject-aware, not just lookup', () => {
  const stem = 'ข้อใดเป็นรอยโรคของ Infectious bursal disease (IBD/Gumboro)';
  assert.deepEqual(termsOf(stem, 'com4'), ['IBD']);
  const avian = termsOf(stem, 'avian-medicine');
  assert.ok(!avian.includes('IBD') || resolveGlossaryEntry('IBD', 'avian-medicine'),
    'IBD may only be underlined in avian once an avian entry exists');
});

test('a qualifier that changes the meaning suppresses the card', () => {
  assert.deepEqual(termsOf('สุนัขมี mitral regurgitation', 'com3'), []);
  assert.deepEqual(termsOf('regurgitation หลังกินอาหาร', 'com3'), ['regurgitation']);
  assert.deepEqual(termsOf('uterine edema เกรด 3', 'equine-repro'), []);
});

test('match offsets point at the term itself', () => {
  const text = 'ค่า BUN และ creatinine สูง';
  for (const hit of detectTerms(text, 'com3')) {
    assert.equal(text.slice(hit.start, hit.end), hit.term);
  }
});

test('a term flanked by letters is not a match', () => {
  assert.deepEqual(termsOf('BUNDLE branch block', 'com3'), []);
});

// ── the iOS floor ────────────────────────────────────────────────
test('no lookbehind reaches the browser', async () => {
  // package.json declares `ios >= 14`; lookbehind is Safari 16.4+, and a
  // module-scope RegExp that uses it throws while the module loads —
  // taking the question stem with it. Keep it out of the shipped path.
  const fs = await import('node:fs');
  for (const file of ['src/lib/term-detect.js', 'src/components/TermLinkedRichText.jsx']) {
    const src = fs.readFileSync(new URL(`../../${file}`, import.meta.url), 'utf8');
    assert.ok(!/\(\?<[=!]/.test(src), `${file} must not use regex lookbehind`);
  }
});

// ── data integrity ───────────────────────────────────────────────
test('every entry declares where it is true', () => {
  for (const e of GLOSSARY) {
    assert.ok(e.scope !== undefined, `${e.term} has no scope`);
    if (e.scope !== 'universal') {
      assert.ok(Array.isArray(e.scope) && e.scope.length, `${e.term} has an empty scope`);
    }
  }
});

test('scope families expand to subject ids', () => {
  const s = expandScope(['avian']);
  assert.ok(s.has('poultry') && s.has('avian-medicine'));
  assert.equal(expandScope('universal'), 'universal');
  for (const fam of Object.values(SCOPE_FAMILIES)) assert.ok(fam.length > 0);
});

test('entry identity is stable and unique', () => {
  const seen = new Set();
  for (const e of GLOSSARY) {
    const k = entryKey(e);
    assert.ok(!seen.has(k), `duplicate entry identity ${k}`);
    seen.add(k);
  }
});

test('no two entries answer to the same term in the same subject', () => {
  const byKey = new Map();
  for (const e of GLOSSARY) {
    for (const key of [e.term, ...(e.aliases || [])]) {
      const k = String(key).toLowerCase();
      if (!byKey.has(k)) byKey.set(k, []);
      byKey.get(k).push(e);
    }
  }
  for (const [key, list] of byKey) {
    if (list.length < 2) continue;
    const scopedSets = list.map((e) => expandScope(e.scope)).filter((s) => s !== 'universal');
    for (let i = 0; i < scopedSets.length; i++) {
      for (let j = i + 1; j < scopedSets.length; j++) {
        const shared = [...scopedSets[i]].filter((s) => scopedSets[j].has(s));
        assert.equal(shared.length, 0, `"${key}" is ambiguous in ${shared.join(', ')}`);
      }
    }
  }
});

// ── the related-question index ───────────────────────────────────
test('related-question counts come from the build-time index', async () => {
  const { GLOSSARY_RELATED } = await import('../../src/data/glossary-related.generated.js');
  const keys = Object.keys(GLOSSARY_RELATED);
  assert.ok(keys.length > 0, 'the index should not be empty');
  for (const k of keys) {
    assert.ok(Array.isArray(GLOSSARY_RELATED[k]), `${k} should map to an id array`);
    assert.ok(GLOSSARY_RELATED[k].length > 0, `${k} should not be listed with zero questions`);
  }
  // Every indexed key must belong to a real entry, or the card would show
  // a count for something that cannot open.
  const live = new Set(GLOSSARY.map(entryKey));
  for (const k of keys) assert.ok(live.has(k), `${k} in the index has no entry`);
});
