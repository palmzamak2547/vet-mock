// The notes reader draws each section's source line through noteSourceLabel.
// Rendering only: the stored line is never rewritten, and a line this does not
// recognise comes out character for character as it went in.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import * as SourceLabel from '../../src/lib/source-label.js';
import { SOURCE_DOCS } from '../../src/data/source-docs.js';
import { NOTE_SOURCE_TITLES } from '../../src/data/note-source-titles.generated.js';
import { generateNoteSourceTitles, registeredTitleFor, OUT as TITLES_FILE } from '../../scripts/regen-note-source-titles.mjs';
import { sameGenerated } from '../../scripts/lib/same-generated.mjs';

const { sessionLabel } = SourceLabel;
// Here the real registry answers; the reader answers from the generated titles.
const label = (raw) => SourceLabel.noteSourceLabel(raw, (name) => registeredTitleFor(name, SOURCE_DOCS));

test('a recording pointer gets the dated label the rest of the app uses, minutes kept', () => {
  const raw = 'Import Risk Assessment (Present) p.11, 17, 20; คลิป hLl7taXYRWQ [47:11-49:08, 55:12-57:52]';
  assert.equal(sessionLabel('hLl7taXYRWQ'), 'คลิป One Health (7 ต.ค.)');
  assert.equal(
    label(raw),
    'Import Risk Assessment (Present) p.11, 17, 20; คลิป One Health (7 ต.ค.) นาที 47:11-49:08, 55:12-57:52',
  );
  // an id with an underscore is still an id
  assert.equal(
    label('One Health approach to address environmental health risks I p.2; คลิป pj_zkis2ziU [10:15-14:48]'),
    `One Health approach to address environmental health risks I p.2; ${sessionLabel('pj_zkis2ziU')} นาที 10:15-14:48`,
  );
});

test('the word คลิป before an id is not printed twice', () => {
  const out = label('คลิป hLl7taXYRWQ [47:11-49:08]');
  assert.equal(out, 'คลิป One Health (7 ต.ค.) นาที 47:11-49:08');
  assert.ok(!out.includes('คลิป คลิป'));
  // the question chip's own formatter had the same doubled prefix
  assert.equal(SourceLabel.humanSource('คลิป hLl7taXYRWQ [47:11-49:08]'), 'คลิป One Health (7 ต.ค.) นาที 47:11-49:08');
});

test('a file name that is a registered document shows the registered title, page kept', () => {
  const doc = SOURCE_DOCS.find((d) => d.slug === 'equine-med-mid86');
  assert.ok(doc, 'fixture document is registered');
  assert.equal(label('EQUINE MED MID 86.pdf p.21'), `${doc.title} p.21`);
  const patho = SOURCE_DOCS.find((d) => d.slug === 'final-patho-prac');
  assert.equal(label('Final Patho prac.pdf p.3'), `${patho.title} p.3`);
  // a title that differs from the file name is what proves the registry is read
  const other = SOURCE_DOCS.find((d) => d.slug === 'oh-env-risks-1-2569');
  assert.ok(other.title.includes('_21 Oct 26'), 'fixture title carries its own date suffix');
});

test('any other file-style name loses its extension and shows underscores as spaces', () => {
  assert.equal(label('Derm__4_Bacterial_skin_diseases.pdf p.1'), 'Derm 4 Bacterial skin diseases p.1');
  assert.equal(label('CVE.pdf p.5-6 + COM V FINAL 86 p.4'), 'CVE p.5-6 + COM V FINAL 86 p.4');
  assert.equal(label('โรคติดเชื้อ.pptx + EXOTIC FINAL 86'), 'โรคติดเชื้อ + EXOTIC FINAL 86');
  assert.equal(label('Lecture slides.docx'), 'Lecture slides');
  assert.equal(label('5 - Acupuncture_BW_Sep_2024_CU_.pdf p.2'), '5 - Acupuncture BW Sep 2024 CU p.2');
  assert.equal(label('Role_of_Vet_in_One_Health_Saharuetai_2026 p.2-5'), 'Role of Vet in One Health Saharuetai 2026 p.2-5');
  assert.equal(label('6 - Protozoal_zoonosis_(Dr._Woraporn).pdf p.4-22'), '6 - Protozoal zoonosis (Dr. Woraporn) p.4-22');
});

test('a line that is neither a recording nor a file name comes out exactly as stored', () => {
  for (const raw of [
    'บันทึกคาบ 27 ส.ค. 2569 [40:41-45:00]',
    'Equine GI I 5th year 1-2026 p.16-18',
    'Import Risk Assessment (Present) p.5-8; Import Risk Assessment (Reading Material) p.1',
    'docs/vet-standards/README.md — เอกสารทางการของ WOAH (woah.org)',
    'OneHealth final น.6 และ น.8',
    'deck oh-vet-role p4, p7',
    'TJ p5, ข้อสอบเก่า 202275',
    'ZZZZZZZZZZZ [1:00]',
    'คลิป ZZZZZZZZZZZ [1:00]',
    'คลิป pj_unknwnXX [1:00]',
    '  spaced   out  ',
    '',
  ]) {
    assert.equal(label(raw), raw, JSON.stringify(raw));
  }
  assert.equal(label(undefined), '');
});

test('each part of a line with several is transformed on its own', () => {
  assert.equal(
    label('CVE.pdf p.2; Rabies.pdf p.7-9, Equine GI I 5th year 1-2026 p.16-18, Vaccination_guideline.pdf p.9, 32 + COM V FINAL 86 p.4; คลิป hLl7taXYRWQ [35:29-40:35]'),
    'CVE p.2; Rabies p.7-9, Equine GI I 5th year 1-2026 p.16-18, Vaccination guideline p.9, 32 + COM V FINAL 86 p.4; คลิป One Health (7 ต.ค.) นาที 35:29-40:35',
  );
  assert.equal(
    label('Role_of_Vet_in_One_Health p.2; Global_One_Health p.3'),
    'Role of Vet in One Health p.2; Global One Health p.3',
  );
});

test('the notes reader draws the source line through the label function', () => {
  const view = readFileSync(new URL('../../src/views/NotesView.jsx', import.meta.url), 'utf8');
  assert.match(view, /noteSourceLabel\(/);
  assert.match(view, /from '\.\.\/lib\/source-label\.js'/);
  assert.doesNotMatch(view, /\{section\.source\.replace\(/, 'the stored line must not be printed directly');
});

test('the reader resolves registered titles from the generated list, which matches the registry', async () => {
  assert.equal(
    SourceLabel.noteSourceLabel('4 - Helminthic zoonoses.pdf p.4-69', (n) => NOTE_SOURCE_TITLES[n]),
    'Helminthic Zoonoses p.4-69',
  );
  const fresh = await generateNoteSourceTitles();
  assert.ok(sameGenerated(readFileSync(TITLES_FILE, 'utf8'), fresh),
    'src/data/note-source-titles.generated.js is stale; run node scripts/regen-note-source-titles.mjs');
});

test('noteFileNames lists the names a line holds and never a recording id', () => {
  assert.deepEqual(
    SourceLabel.noteFileNames('CVE.pdf p.5-6 + Role_of_Vet p.2; คลิป pj_zkis2ziU [10:15-14:48]'),
    ['CVE.pdf', 'Role_of_Vet'],
  );
});
