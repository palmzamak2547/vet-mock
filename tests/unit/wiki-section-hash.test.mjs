import assert from 'node:assert/strict';
import test from 'node:test';

import {
  extractSectionBody,
  normaliseSectionBody,
  sectionContentHash,
} from '../../scripts/lib/wiki-section-hash.mjs';

// A question's wikiRef stamps the hash of the section it cites, and
// validate-wiki errors when that hash stops matching. Two failure modes make
// the mechanism worthless and both are cheap to guard:
//   • too sensitive  — line endings or reflow break every hash on every
//                      machine, the gate cries wolf and gets switched off
//   • not sensitive enough — a changed dose or organism slips through and a
//                      question keeps citing a section that no longer says it

const PAGE = [
  '---',
  'id: test-page',
  '---',
  '',
  '# Test page',
  '',
  '<a id="first"></a>',
  '## First section',
  '',
  '<!-- wiki-section-meta',
  'anchorId: first',
  'reviewedAt: 2026-01-01',
  '-->',
  '',
  '- **Canine Parvovirus** is non-enveloped, ssDNA',
  '- survives 5–7 months in the environment',
  '',
  '<a id="second"></a>',
  '## Second section',
  '',
  '- pasteurisation at **72°C for 15 s**',
  '',
].join('\n');

test('extracts only the requested section, not its neighbours', () => {
  const first = extractSectionBody(PAGE, 'first');
  assert.ok(first.includes('Canine Parvovirus'));
  assert.ok(!first.includes('pasteurisation'), 'first section must not bleed into the second');

  const second = extractSectionBody(PAGE, 'second');
  assert.ok(second.includes('pasteurisation'));
  assert.ok(!second.includes('Canine Parvovirus'));
});

test('a missing anchor resolves to null rather than hashing the whole page', () => {
  assert.equal(extractSectionBody(PAGE, 'nope'), null);
  assert.equal(sectionContentHash(PAGE, 'nope'), null);
});

test('hash is stable across things that are not content changes', () => {
  const base = sectionContentHash(PAGE, 'first');
  assert.match(base, /^sha256:[0-9a-f]{16}$/);

  // CRLF: this repo checks out CRLF on Windows and LF in CI
  assert.equal(sectionContentHash(PAGE.replace(/\n/g, '\r\n'), 'first'), base);
  // reflowing / re-indenting prose
  assert.equal(sectionContentHash(PAGE.replace(/\n/g, '\n   '), 'first'), base);
  // review metadata churn is not a content change
  assert.equal(sectionContentHash(PAGE.replace('2026-01-01', '2099-12-31'), 'first'), base);
  // unicode normalisation form of Thai combining marks
  const decomposed = PAGE.normalize('NFD');
  assert.equal(sectionContentHash(decomposed, 'first'), base);
});

test('hash breaks on changes that would invalidate a citing question', () => {
  const base = sectionContentHash(PAGE, 'first');
  const changed = [
    ['a number', PAGE.replace('5–7 months', '5–9 months')],
    ['an organism', PAGE.replace('Canine Parvovirus', 'Canine Coronavirus')],
    ['a negation', PAGE.replace('non-enveloped', 'enveloped')],
    ['a deleted claim', PAGE.replace('- survives 5–7 months in the environment\n', '')],
    ['emphasis that carries the exam term', PAGE.replace('**Canine Parvovirus**', 'Canine Parvovirus')],
  ];
  for (const [what, mutated] of changed) {
    assert.notEqual(sectionContentHash(mutated, 'first'), base, `${what} must break the hash`);
  }
});

test('editing one section leaves the other section untouched', () => {
  const secondBefore = sectionContentHash(PAGE, 'second');
  const mutated = PAGE.replace('5–7 months', '5–9 months');
  assert.notEqual(sectionContentHash(mutated, 'first'), sectionContentHash(PAGE, 'first'));
  assert.equal(sectionContentHash(mutated, 'second'), secondBefore);
});

test('normalisation drops structure but keeps meaning-bearing punctuation', () => {
  const n = normaliseSectionBody(extractSectionBody(PAGE, 'second'));
  assert.ok(!n.includes('<a '), 'html anchors stripped');
  assert.ok(!n.includes('wiki-section-meta'), 'meta comment stripped');
  assert.ok(n.includes('72°C'), 'numbers and units kept verbatim');
  assert.ok(n.includes('**'), 'emphasis kept — it marks the examinable term');
});
