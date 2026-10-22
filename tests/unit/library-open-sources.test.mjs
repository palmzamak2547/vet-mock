// The library's sources from outside Chula (src/data/library-open-sources.js):
// every entry is complete and checkable, a copy is kept only under a licence
// that allows it, and a link entry opens the publisher's page in a new tab.
import test from 'node:test';
import assert from 'node:assert/strict';
import { OPEN_SOURCES } from '../../src/data/library-open-sources.js';
import { OPEN_LICENSES, OPEN_TIERS, openSourceDocs, openSourceLine, openSourceUrl, withOpenLabels } from '../../src/lib/open-sources.js';
import { SUBJECTS } from '../../src/data/curriculum.js';
import { docOpenMode, resolveDocUrl, LIBRARY_KINDS } from '../../src/lib/library.js';

const SUBJECT = new Map(SUBJECTS.map((s) => [s.id, s]));
const KINDS = new Set(LIBRARY_KINDS.map((k) => k.id).filter((k) => k !== 'all'));
const LINK_ONLY = new Set(['all-rights-reserved', 'not-stated']);

test('every entry is complete, checkable and placed on a real subject', () => {
  assert.ok(OPEN_SOURCES.length > 0, 'the registry is empty');
  const ids = new Set();
  for (const e of OPEN_SOURCES) {
    assert.match(e.id, /^[a-z0-9-]+$/, `id ${e.id}`);
    assert.ok(!ids.has(e.id), `${e.id} twice`);
    ids.add(e.id);
    for (const f of ['title', 'org', 'description', 'licenseEvidence', 'checked']) assert.ok(String(e[f] || '').trim(), `${e.id}.${f}`);
    assert.ok(Number.isInteger(e.year) && e.year > 1950 && e.year <= 2026, `${e.id}.year`);
    assert.ok(openSourceUrl(e.url), `${e.id}.url is not https`);
    assert.ok(openSourceUrl(e.licenseEvidenceUrl), `${e.id}.licenseEvidenceUrl is not https`);
    assert.ok(e.license in OPEN_LICENSES, `${e.id}: licence ${e.license} is not one VetMock knows`);
    assert.ok(e.tier in OPEN_TIERS, `${e.id}.tier`);
    assert.ok(KINDS.has(e.kind), `${e.id}.kind ${e.kind}`);
    assert.ok(['en', 'th'].includes(e.lang), `${e.id}.lang`);
    assert.match(e.checked, /^\d{4}-\d{2}-\d{2}$/, `${e.id}.checked`);
    const subject = SUBJECT.get(e.subject);
    assert.ok(subject, `${e.id}: subject ${e.subject}`);
    const topics = new Set((subject.topics || []).map((t) => t.id));
    for (const t of e.topics || []) assert.ok(topics.has(t), `${e.id}: topic ${t} is not in ${e.subject}`);
    assert.doesNotMatch(`${e.title} ${e.description}`, /·/, `${e.id}: middle dot`);
    if (e.hosted) {
      assert.ok(!LINK_ONLY.has(e.license), `${e.id} is hosted under ${e.license}`);
      assert.match(e.hosted, /^[a-z0-9-]+$/, `${e.id}.hosted`);
    }
  }
});

test('a link entry is a public shelf row that opens the publisher in a new tab', async () => {
  const entry = { id: 'x', title: 'T', org: 'WHO', year: 2018, url: 'https://iris.who.int/handle/10665/272364', license: 'all-rights-reserved', tier: 'official', kind: 'guideline', lang: 'en', subject: 'zoonoses', topics: ['zoo-rabies'], description: 'd' };
  const [doc] = openSourceDocs([entry, { ...entry, id: 'y', hosted: 'some-slug' }]);
  assert.equal(doc.slug, 'open-x');
  assert.equal(doc.status, 'public');
  assert.equal(doc.year, 5);
  assert.deepEqual(docOpenMode(doc), { action: 'tab', label: 'เปิดที่เว็บต้นทาง' });
  assert.equal(await resolveDocUrl(doc), 'https://iris.who.int/handle/10665/272364');
  await assert.rejects(resolveDocUrl({ ...doc, external_url: 'javascript:alert(1)' }));
  assert.equal(openSourceUrl('http://example.org/x'), null);
  assert.equal(openSourceLine(entry), 'WHO 2018, แนวทางจากหน่วยงานทางการ, สงวนลิขสิทธิ์ อ่านฟรีที่เว็บต้นทาง');
});

test('a hosted row keeps its own data and gains only the label', () => {
  const entry = { id: 'y', hosted: 'who-trs-1012', org: 'WHO', year: 2018, tier: 'official', license: 'CC-BY-NC-SA-3.0-IGO' };
  const rows = [{ slug: 'who-trs-1012', title: 'Row', storage_provider: 'r2' }, { slug: 'other' }];
  const [hosted, other] = withOpenLabels(rows, [entry]);
  assert.equal(hosted.title, 'Row');
  assert.equal(hosted.storage_provider, 'r2');
  assert.equal(hosted.open, entry);
  assert.equal(other.open, undefined);
  assert.equal(openSourceLine(entry), 'WHO 2018, แนวทางจากหน่วยงานทางการ, CC BY-NC-SA 3.0 IGO');
});
