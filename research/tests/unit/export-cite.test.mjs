// RIS and BibTeX for a known article (DeLong, DeLong and Clarke-Pearson 1988, Biometrics 44(3):837-845,
// doi 10.2307/2531595, resolved on Crossref on 28 Sep 2026) compared with strings written by hand, the
// software record without an invented DOI, the citation line in both languages with its era, and the
// reference list of src/data/references.js (every entry carries a DOI or null and the date it was
// checked) [M2-DESIGN.md 6.5, 11.2]. OWNER: report role.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { toRis, toBibtex, softwareRecord, citationText, referenceLine, dateWithEra, SOFTWARE_URL } from '../../src/lib/export/cite.js';
import { REFERENCES, referencesFor } from '../../src/data/references.js';
import { METHODS } from '../../src/lib/runtime/catalog.js';
import { tOf } from './export-helpers.mjs';

const DELONG = REFERENCES.find((r) => r.id === 'delong1988');

test('RIS of a known article, as written by hand', () => {
  const expected = [
    'TY  - JOUR',
    'AU  - DeLong, Elizabeth R.',
    'AU  - DeLong, David M.',
    'AU  - Clarke-Pearson, Daniel L.',
    'TI  - Comparing the areas under two or more correlated receiver operating characteristic curves: a nonparametric approach',
    'T2  - Biometrics',
    'JO  - Biometrics',
    'PY  - 1988',
    'VL  - 44',
    'IS  - 3',
    'SP  - 837',
    'EP  - 845',
    'DO  - 10.2307/2531595',
    'UR  - https://doi.org/10.2307/2531595',
    'ER  - ',
    '',
  ].join('\r\n');
  assert.equal(toRis([DELONG]), expected);
});

test('BibTeX of a known article, as written by hand', () => {
  const expected = '@article{delong1988,\n'
    + '  author = {DeLong, Elizabeth R. and DeLong, David M. and Clarke-Pearson, Daniel L.},\n'
    + '  title = {{Comparing the areas under two or more correlated receiver operating characteristic curves: a nonparametric approach}},\n'
    + '  journal = {Biometrics},\n'
    + '  year = {1988},\n'
    + '  volume = {44},\n'
    + '  number = {3},\n'
    + '  pages = {837--845},\n'
    + '  doi = {10.2307/2531595}\n'
    + '}\n';
  assert.equal(toBibtex([DELONG]), expected);
});

test('BibTeX escapes what TeX reads as commands and keeps Thai and accented letters', () => {
  const out = toBibtex([{ id: 'x', type: 'article', authors: ['Ersbøll, A. K.'], title: 'ผล 50% & more_under', year: 2026, journal: 'J #1' }]);
  assert.ok(out.includes('author = {Ersbøll, A. K.}'));
  assert.ok(out.includes('title = {{ผล 50\\% \\& more\\_under}}'));
  assert.ok(out.includes('journal = {J \\#1}'));
  // A program or an organisation as author is braced whole, so BibTeX does not read "Research, VetMock".
  assert.ok(toBibtex([{ id: 'v', type: 'software', authors: ['VetMock Research'], title: 'VetMock Research', year: 2026 }]).includes('author = {{VetMock Research}}'));
});

test('the software record: version, year, address, access date, no DOI until one exists', () => {
  const rec = softwareRecord({ version: '0.2.0', year: 2026 }, '2026-09-28');
  assert.deepEqual(rec.authors, []);
  assert.equal(rec.doi, null);
  const ris = toRis([rec]);
  assert.equal(ris, ['TY  - COMP', 'TI  - VetMock Research', 'PY  - 2026', 'ET  - 0.2.0', `UR  - ${SOFTWARE_URL}`, 'Y2  - 2026/09/28', 'ER  - ', ''].join('\r\n'));
  assert.ok(!/DO {2}- /.test(ris));
  const bib = toBibtex([rec]);
  assert.equal(bib, `@software{vetmockResearch020,\n  title = {{VetMock Research}},\n  year = {2026},\n  version = {0.2.0},\n  url = {${SOFTWARE_URL}},\n  urldate = {2026-09-28}\n}\n`);
  assert.ok(!bib.includes('doi'));
  // A DOI is written only when the release carries one.
  assert.ok(toRis([softwareRecord({ version: '1.0.0', year: 2027, doi: '10.5281/zenodo.0000000' }, '2027-01-02')]).includes('DO  - 10.5281/zenodo.0000000'));
});

test('the citation line in Thai and English, with the era written', () => {
  const release = { version: '0.2.0', year: 2026 };
  const th = citationText(release, { lang: 'th', t: tOf('th'), accessed: '2026-09-28' });
  assert.equal(th, `VetMock Research รุ่น 0.2.0 [ซอฟต์แวร์] พ.ศ. 2569 (ค.ศ. 2026) เข้าถึงได้จาก ${SOFTWARE_URL} (เข้าถึงเมื่อ 28 ก.ย. พ.ศ. 2569)`);
  const en = citationText(release, { lang: 'en', t: tOf('en'), accessed: '2026-09-28' });
  assert.equal(en, `VetMock Research, version 0.2.0 [software]. 2026. Available from ${SOFTWARE_URL} (accessed 28 Sep 2026 CE)`);
  assert.ok(!/doi/i.test(th + en));
  assert.equal(dateWithEra('2026-09-28', 'th', tOf('th')), '28 ก.ย. พ.ศ. 2569');
});

test('a printed reference line in Vancouver order', () => {
  const words = { software: 'software', version: 'Version', available: 'Available from', accessed: 'accessed', accessedDate: '28 Sep 2026 CE' };
  assert.equal(referenceLine(DELONG, 1, words), '1. DeLong ER, DeLong DM, Clarke-Pearson DL. Comparing the areas under two or more correlated receiver operating characteristic curves: a nonparametric approach. Biometrics. 1988;44(3):837-845. doi:10.2307/2531595');
  assert.equal(referenceLine(softwareRecord({ version: '0.2.0', year: 2026 }, '2026-09-28'), 2, words), `2. VetMock Research [software]. Version 0.2.0. 2026. Available from ${SOFTWARE_URL} (accessed 28 Sep 2026 CE).`);
});

test('every reference was checked, has a real-looking DOI or null, and names catalogue methods', () => {
  const ids = new Set(METHODS.map((m) => m.id));
  const seen = new Set();
  for (const r of REFERENCES) {
    assert.ok(!seen.has(r.id), `duplicate ${r.id}`);
    seen.add(r.id);
    assert.match(r.checked, /^\d{4}-\d{2}-\d{2}$/);
    assert.ok(r.doi === null || /^10\.\d{4,9}\/\S+$/.test(r.doi), r.id);
    assert.ok(r.authors.length && r.title && r.year && r.journal, r.id);
    for (const m of r.methods) assert.ok(ids.has(m) || /^(route|report)\./.test(m), `${r.id} names ${m}`);
  }
  // The M2 methods whose sources are in the list are cited when used.
  const got = referencesFor([{ method: 'roc.delong' }, { method: 'reg.logistic', route: 'robust' }, { method: 'rel.cronbach' }], { flow: true }).map((r) => r.id);
  assert.deepEqual(got, ['delong1988', 'youden1950', 'nelderWedderburn1972', 'liangZeger1986', 'cronbach1951', 'feldt1965', 'strobeVet2016']);
});
