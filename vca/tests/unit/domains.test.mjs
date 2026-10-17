// The nineteen domains and how the main bank's subjects map onto them. A question lands in
// exactly one domain or in none, and a subject with questions is either mapped or excluded on
// purpose: a new course bank is a decision, not a gap.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { FAMILIES, DOMAINS, DOMAIN_BY_ID, EXCLUDED_SUBJECTS, MAPPED_SUBJECTS, thPlain, domainOf } from '../../src/data/domains.js';
import { CATALOG } from '../../src/generated/catalog.js';
import { SUBJECT_COVERS } from '../../../src/data/subject-covers.js';

test('nineteen domains, unique ids, plates 1 to 19 in order', () => {
  assert.equal(DOMAINS.length, 19);
  assert.equal(new Set(DOMAINS.map((d) => d.id)).size, 19);
  assert.deepEqual(DOMAINS.map((d) => d.plate), Array.from({ length: 19 }, (_, i) => i + 1));
  for (const d of DOMAINS) {
    assert.match(d.id, /^[a-z-]{2,40}$/, `${d.id} fits the /d/:id route`);
    assert.ok(d.th && d.en && d.tag && d.art, `${d.id}: names, tag and art`);
    assert.ok(d.from.length > 0, `${d.id}: draws from something`);
  }
  assert.equal(DOMAIN_BY_ID.swine.plate, 9);
});

test('four families, and every domain in one of them', () => {
  assert.deepEqual(FAMILIES.map((f) => f.numeral), ['I', 'II', 'III', 'IV']);
  const families = new Set(FAMILIES.map((f) => f.id));
  for (const d of DOMAINS) assert.ok(families.has(d.family), `${d.id}: family ${d.family}`);
  for (const f of FAMILIES) assert.ok(DOMAINS.some((d) => d.family === f.id), `${f.id} holds a domain`);
  // The wall hangs families in order: plates never go back to an earlier family.
  const order = FAMILIES.map((f) => f.id);
  for (let i = 1; i < DOMAINS.length; i += 1) assert.ok(order.indexOf(DOMAINS[i].family) >= order.indexOf(DOMAINS[i - 1].family));
});

test('thPlain strips the line-break marks', () => {
  assert.equal(thPlain('ประสาท|และจักษุวิทยา'), 'ประสาทและจักษุวิทยา');
  assert.equal(thPlain('โค กระบือ แพะ แกะ'), 'โค กระบือ แพะ แกะ');
  for (const d of DOMAINS) assert.ok(!thPlain(d.th).includes('|'));
});

test('a subject + topic rule wins over a subject rule', () => {
  assert.equal(domainOf({ subject: 'vca', topic: 'swine' }), 'swine');
  assert.equal(domainOf({ subject: 'vca', topic: 'neurology' }), 'neuro-ophtho');
  assert.equal(domainOf({ subject: 'vca', topic: 'dogcat' }), 'small-animal');
  assert.equal(domainOf({ subject: 'com1', topic: 'anything' }), 'small-animal');
  assert.equal(domainOf({ subject: 'vca', topic: 'no-such-topic' }), null);
  assert.equal(domainOf({ subject: 'no-such-subject' }), null);
  assert.equal(domainOf(null), null);
});

test('every rule is claimed by exactly one domain', () => {
  const seen = new Map();
  for (const d of DOMAINS) {
    for (const r of d.from) {
      const key = `${r.subject}/${r.topic || '*'}`;
      assert.ok(!seen.has(key), `${key} is claimed by ${seen.get(key)} and ${d.id}`);
      seen.set(key, d.id);
      assert.equal(domainOf({ subject: r.subject, topic: r.topic }), d.id, `${key} lands in ${d.id}`);
    }
  }
});

test('every mapped subject maps, and none is also excluded', () => {
  assert.deepEqual(MAPPED_SUBJECTS, [...new Set(MAPPED_SUBJECTS)]);
  for (const subject of MAPPED_SUBJECTS) {
    const subjectWide = domainOf({ subject });
    const byTopic = DOMAINS.some((d) => d.from.some((r) => r.subject === subject && r.topic));
    assert.ok(subjectWide || byTopic, `${subject} maps nowhere`);
    assert.ok(!(subject in EXCLUDED_SUBJECTS), `${subject} is both mapped and excluded`);
  }
  for (const [subject, why] of Object.entries(EXCLUDED_SUBJECTS)) assert.ok(why.trim(), `${subject}: a reason`);
});

test('every subject with servable questions is mapped or excluded (generator report)', () => {
  assert.deepEqual(CATALOG.unmapped, {}, `map these in src/data/domains.js or list them in EXCLUDED_SUBJECTS: ${JSON.stringify(CATALOG.unmapped)}`);
});

test('every domain\'s bookplate is one of the main app\'s covers', () => {
  for (const d of DOMAINS) {
    const cover = SUBJECT_COVERS[d.art];
    assert.ok(cover, `${d.id}: no cover ${d.art}`);
    assert.ok(cover.src && cover.paper, `${d.id}: cover has art and paper colour`);
  }
});
