// The nineteen domains, and what the site serves: VCA material only. A question lands in exactly
// one domain or in none; a VCA question is named by a source or kept out on purpose; and no
// other subject's question reaches the site: a new source is a decision, not a gap.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { FAMILIES, DOMAINS, DOMAIN_BY_ID, MAPPED_SUBJECTS, NOT_VCA, SERVED_SUBJECT, VCA_SOURCES, thPlain, domainOf, vcaSource } from '../../src/data/domains.js';
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

test('a VCA topic decides the domain; nothing else does', () => {
  assert.equal(domainOf({ subject: 'vca', topic: 'swine' }), 'swine');
  assert.equal(domainOf({ subject: 'vca', topic: 'neurology' }), 'neuro-ophtho');
  assert.equal(domainOf({ subject: 'vca', topic: 'dogcat' }), 'small-animal');
  assert.equal(domainOf({ subject: 'vca', topic: 'imaging' }), 'imaging');
  assert.equal(domainOf({ subject: 'vca', topic: 'pathology' }), 'pathology');
  assert.equal(domainOf({ subject: 'com1', topic: 'anything' }), null, 'a course bank maps nowhere');
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

test('every rule names a VCA topic, so the site maps nothing but VCA questions', () => {
  assert.deepEqual(MAPPED_SUBJECTS, [SERVED_SUBJECT]);
  for (const d of DOMAINS) for (const r of d.from) assert.ok(r.subject === SERVED_SUBJECT && r.topic, `${d.id}: ${JSON.stringify(r)}`);
});

test('the VCA sources and the exclusions are named, explained and told apart', () => {
  const ids = [...VCA_SOURCES, ...NOT_VCA].map((s) => s.id);
  assert.equal(new Set(ids).size, ids.length);
  for (const s of VCA_SOURCES) assert.ok(['paper', 'vca'].includes(s.kind) && s.th.trim(), s.id);
  for (const s of NOT_VCA) assert.ok(s.th.trim(), s.id);
  const q = (fields) => ({ subject: 'vca', ...fields });
  assert.equal(vcaSource(q({ examOrigin: 'VCA รอบ 1/2569 หมวด 3 (บันทึกหลังสอบ)' })), 'recall');
  assert.equal(vcaSource(q({ examOrigin: 'ข้อสอบเก่า VCA ที่รุ่นพี่บันทึกหลังสอบ รวบรวมในชุด Super สรุป (@Fukfangfluffy_channel)' })), 'compilation');
  assert.equal(vcaSource(q({ source: 'แบบฝึกปรับจาก Swine medicine (VCA58-68).pdf หน้า 3 ข้อ 2' })), 'compilation-adapted');
  assert.equal(vcaSource(q({ source: '@Fukfangfluffy_channel, VCA ผ่านชัวร์' })), 'vca-sure');
  assert.equal(vcaSource(q({ examOrigin: 'Vet 80 past paper · Vet 83 update commentary' })), 'not:vet80-final');
  assert.equal(vcaSource(q({ source: 'written from a lecture' })), null, 'a VCA question nothing names');
  assert.equal(vcaSource({ subject: 'com5', examOrigin: 'VCA รอบ 1/2569 หมวด 2 (บันทึกหลังสอบ)' }), null, 'another subject is never served');
});

test('every served VCA question has a domain (generator report)', () => {
  assert.deepEqual(CATALOG.unmapped, {}, `map these topics in src/data/domains.js: ${JSON.stringify(CATALOG.unmapped)}`);
});

test('every domain\'s bookplate is one of the main app\'s covers', () => {
  for (const d of DOMAINS) {
    const cover = SUBJECT_COVERS[d.art];
    assert.ok(cover, `${d.id}: no cover ${d.art}`);
    assert.ok(cover.src && cover.paper, `${d.id}: cover has art and paper colour`);
  }
});
