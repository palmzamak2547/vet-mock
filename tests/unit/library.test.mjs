import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import test from 'node:test';

import {
  LIBRARY_KINDS,
  SEMESTERS,
  buddhistYear,
  canStream,
  cdnUrlFor,
  filterIndexed,
  formatBytes,
  groupByYearSubject,
  indexDocs,
  isSafeStorageKey,
  kindLabel,
  normalizeCdnBase,
  semesterLabel,
} from '../../src/lib/library.js';
import { hashFile } from '../../src/lib/pdf-annotations.js';

const doc = (over = {}) => ({
  id: 'id-1',
  slug: 'doc-1',
  title: 'Cardiac physiology handout',
  description: 'ระบบหัวใจและหลอดเลือด',
  kind: 'handout',
  subject: 'com5',
  year: 5,
  semester: 1,
  academic_year: 2026,
  cohort: 'Vet 86',
  lecturer: 'Sawita Santiviparat',
  sequence: 0,
  topics: ['cardio', 'ecg'],
  storage_provider: 'r2',
  storage_bucket: 'library-docs',
  storage_key: 'docs/5bc3744aa1c8635c/cardiac.pdf',
  mime: 'application/pdf',
  byte_size: 4 * 1024 * 1024,
  sha256_16: '5bc3744aa1c8635c',
  linearized: true,
  license: 'internal-original',
  status: 'public',
  ...over,
});

test('CDN base must be an absolute https origin', () => {
  assert.equal(normalizeCdnBase('https://files.example.com/'), 'https://files.example.com');
  assert.equal(normalizeCdnBase('https://files.example.com///'), 'https://files.example.com');
  // A base that silently became relative would resolve every object URL
  // against the app origin and 404 on each open.
  assert.equal(normalizeCdnBase('/files'), '');
  assert.equal(normalizeCdnBase('files.example.com'), '');
  // Plaintext http would downgrade every download on an HSTS-preloaded site.
  assert.equal(normalizeCdnBase('http://files.example.com'), '');
  assert.equal(normalizeCdnBase(''), '');
  assert.equal(normalizeCdnBase(undefined), '');
});

test('storage keys carrying traversal or whitespace are rejected', () => {
  assert.equal(isSafeStorageKey('docs/abc123/file.pdf'), true);
  assert.equal(isSafeStorageKey('/docs/abc/file.pdf'), false, 'leading slash escapes the prefix');
  assert.equal(isSafeStorageKey('docs/../../etc/passwd'), false);
  assert.equal(isSafeStorageKey('docs//file.pdf'), false);
  assert.equal(isSafeStorageKey('docs/a b.pdf'), false, 'space would break the URL');
  assert.equal(isSafeStorageKey('docs/a?x=1.pdf'), false, 'query separator is not part of a key');
  assert.equal(isSafeStorageKey(''), false);
  assert.equal(isSafeStorageKey(null), false);
});

test('CDN URLs are only built from a configured base and a safe key', () => {
  assert.equal(
    cdnUrlFor(doc(), 'https://files.example.com'),
    'https://files.example.com/docs/5bc3744aa1c8635c/cardiac.pdf',
  );
  // Unconfigured base must fail closed rather than produce a relative URL.
  assert.equal(cdnUrlFor(doc(), ''), null);
  assert.equal(cdnUrlFor(doc({ storage_key: '../secret.pdf' }), 'https://files.example.com'), null);
});

test('streaming is claimed for linearized PDFs or verified range-capable archives', () => {
  assert.equal(canStream(doc()), true);
  // Without a front-loaded hint table pdf.js would chase the cross-reference
  // table over dozens of ranges — slower than one sequential download.
  assert.equal(canStream(doc({ linearized: false })), false);
  assert.equal(canStream(doc({ linearized: false, range_supported: true })), true);
  assert.equal(canStream(doc({ mime: 'application/zip' })), false);
  assert.equal(canStream(null), false);
});

test('byte sizes render in the unit a student can judge', () => {
  assert.equal(formatBytes(0), '—');
  assert.equal(formatBytes(null), '—');
  assert.equal(formatBytes(512), '512 B');
  assert.equal(formatBytes(200 * 1024), '200 KB');
  assert.equal(formatBytes(4 * 1024 * 1024), '4.0 MB');
  assert.equal(formatBytes(240 * 1024 * 1024), '240 MB');
  assert.equal(formatBytes(3 * 1024 * 1024 * 1024), '3.0 GB');
});

test('every kind id has a label and unknown kinds fall back', () => {
  for (const k of LIBRARY_KINDS) assert.ok(kindLabel(k.id), `${k.id} needs a label`);
  assert.equal(kindLabel('not-a-kind'), kindLabel('other'));
});

test('the search haystack is lowered once, not per keystroke', () => {
  const index = indexDocs([doc()]);
  assert.equal(index.length, 1);
  assert.equal(index[0]._hayLc, index[0]._hayLc.toLowerCase());
  assert.ok(index[0]._hayLc.includes('cardio'), 'topics belong in the haystack');
  assert.ok(index[0]._hayLc.includes('ระบบหัวใจ'), 'Thai description belongs in the haystack');
  assert.equal(index[0].doc.id, 'id-1', 'the original row rides along, not a copy');
});

test('filters compose and every term must match', () => {
  const docs = [
    doc({ id: 'a', title: 'Cardiac handout', kind: 'handout', year: 5, subject: 'com5' }),
    doc({ id: 'b', title: 'Renal textbook', kind: 'textbook', year: 4, subject: 'com4', topics: ['renal'], description: null }),
  ];
  const index = indexDocs(docs);

  assert.deepEqual(filterIndexed(index, {}).map((d) => d.id), ['a', 'b']);
  assert.deepEqual(filterIndexed(index, { kind: 'textbook' }).map((d) => d.id), ['b']);
  assert.deepEqual(filterIndexed(index, { year: 5 }).map((d) => d.id), ['a']);
  assert.deepEqual(filterIndexed(index, { year: '5' }).map((d) => d.id), ['a'], 'chip values arrive as strings');
  assert.deepEqual(filterIndexed(index, { subject: 'com4' }).map((d) => d.id), ['b']);
  assert.deepEqual(filterIndexed(index, { query: 'renal' }).map((d) => d.id), ['b']);
  assert.deepEqual(filterIndexed(index, { query: 'CARDIAC' }).map((d) => d.id), ['a'], 'query is case-insensitive');
  // Multi-term search is AND, so a second word narrows instead of widening.
  assert.deepEqual(filterIndexed(index, { query: 'renal textbook' }).map((d) => d.id), ['b']);
  assert.deepEqual(filterIndexed(index, { query: 'renal cardiac' }).map((d) => d.id), []);
  assert.deepEqual(filterIndexed(index, { kind: 'textbook', year: 5 }).map((d) => d.id), []);
  assert.deepEqual(filterIndexed(null, {}), []);
});

// The ingest script writes library_docs.sha256_16 and the reader keys its
// strokes on hashFile(). If the two ever disagree on the digest or the slice,
// every annotation on every library document silently orphans.
test('catalog sha256_16 matches the annotation key the reader derives', async () => {
  const bytes = Buffer.from('VetMock library contract', 'utf8');
  const fromIngest = createHash('sha256').update(bytes).digest('hex').slice(0, 16);
  const fromReader = await hashFile(new Blob([bytes]));

  assert.equal(fromReader, fromIngest);
  assert.match(fromIngest, /^[0-9a-f]{16}$/, 'must satisfy the schema CHECK constraint');
});

test('ปีการศึกษา renders in the era Thai students actually read', () => {
  // Stored CE to match curriculum.js `lecturer_year`; shown as พ.ศ.
  assert.equal(buddhistYear(2026), 2569);
  assert.equal(buddhistYear('2026'), 2569);
  // Number(null) and Number('') are 0, so these must be rejected before the
  // arithmetic or a missing year renders as "543".
  assert.equal(buddhistYear(null), null);
  assert.equal(buddhistYear(undefined), null);
  assert.equal(buddhistYear(''), null);
  assert.equal(buddhistYear('not-a-year'), null);
});

test('every semester id has a label and unknown ones stay null', () => {
  for (const s of SEMESTERS) assert.ok(semesterLabel(s.id), `${s.id} needs a label`);
  assert.equal(semesterLabel(1), 'ภาคต้น');
  assert.equal(semesterLabel('2'), 'ภาคปลาย', 'chip values arrive as strings');
  assert.equal(semesterLabel(4), null);
  assert.equal(semesterLabel(null), null);
});

test('semester and ปีการศึกษา filter alongside the existing dimensions', () => {
  const index = indexDocs([
    doc({ id: 'a', semester: 1, academic_year: 2026 }),
    doc({ id: 'b', semester: 2, academic_year: 2026 }),
    doc({ id: 'c', semester: 1, academic_year: 2025 }),
  ]);
  assert.deepEqual(filterIndexed(index, { semester: 1 }).map((d) => d.id), ['a', 'c']);
  assert.deepEqual(filterIndexed(index, { semester: '1' }).map((d) => d.id), ['a', 'c']);
  assert.deepEqual(filterIndexed(index, { academicYear: 2026 }).map((d) => d.id), ['a', 'b']);
  assert.deepEqual(filterIndexed(index, { semester: 1, academicYear: 2026 }).map((d) => d.id), ['a']);
});

test('lecturer, cohort and ปีการศึกษา are all searchable', () => {
  const index = indexDocs([doc()]);
  const hay = index[0]._hayLc;
  assert.ok(hay.includes('sawita'), 'lecturer');
  assert.ok(hay.includes('vet 86'), 'cohort');
  assert.ok(hay.includes('2569'), 'พ.ศ. is searchable even though CE is stored');
  assert.ok(hay.includes('2026'), 'CE is searchable too');
});

test('browse groups by ชั้นปี then วิชา, ordered for reading', () => {
  const groups = groupByYearSubject([
    doc({ id: 'y5-eq-2', year: 5, semester: 1, subject: 'equine-medicine', sequence: 2, title: 'GI II' }),
    doc({ id: 'y5-eq-1', year: 5, semester: 1, subject: 'equine-medicine', sequence: 1, title: 'GI I' }),
    doc({ id: 'y5-epi', year: 5, semester: 2, subject: 'epidemiology' }),
    doc({ id: 'y4-com', year: 4, semester: 1, subject: 'com4' }),
    doc({ id: 'loose', year: null, subject: null }),
  ]);

  assert.deepEqual(groups.map((g) => g.year), [4, 5, null], 'years ascend, unclassified last');
  assert.equal(groups[1].count, 3);
  assert.equal(groups[1].subjects.length, 2);
  // เทอม 1 subjects before เทอม 2.
  assert.deepEqual(groups[1].subjects.map((s) => s.subject), ['equine-medicine', 'epidemiology']);
  // `sequence` beats title: a plain sort would put "GI II" before "GI I"? No —
  // it would put "GI I" first by luck here, but "GI X" before "GI II" in
  // general. sequence is what makes multi-part decks reliable.
  assert.deepEqual(groups[1].subjects[0].docs.map((d) => d.id), ['y5-eq-1', 'y5-eq-2']);
  assert.deepEqual(groupByYearSubject([]), []);
  assert.deepEqual(groupByYearSubject(null), []);
});

// ── subjectMeta — the shelf's name/icon resolution ────────────────────────

test('subjectMeta resolves curriculum subjects and external courses alike', async () => {
  const { subjectMeta } = await import('../../src/lib/library.js');
  // a curriculum subject — the same id the question bank uses
  assert.equal(typeof subjectMeta('vet-juris')?.name, 'string');
  assert.equal(subjectMeta('vet-juris').code, '3100403');
  // a gen-ed course carried by library-courses.js under its course number
  assert.equal(subjectMeta('5100101')?.name, 'Population and Development');
  // unknown ids resolve to nothing, not a throw
  assert.equal(subjectMeta('nope'), null);
  assert.equal(subjectMeta(null), null);
});

test('search haystack carries the subject NAME, not just its id', async () => {
  const { indexDocs } = await import('../../src/lib/library.js');
  const [entry] = indexDocs([{ title: 'x', subject: '5100101' }]);
  assert.ok(entry._hayLc.includes('population and development'));
});

// ── docOpenMode — what tapping a card actually does ───────────────────────

test('docOpenMode routes every shelf mime family to an action a browser can perform', async () => {
  const { docOpenMode, docTypeLabel } = await import('../../src/lib/library.js');
  assert.equal(docOpenMode({ mime: 'application/pdf' }).action, 'read');
  assert.equal(docOpenMode({ mime: 'video/mp4' }).action, 'tab');
  assert.equal(docOpenMode({ mime: 'image/png' }).action, 'tab');
  assert.equal(docOpenMode({ mime: 'audio/mpeg' }).action, 'tab');
  // Office files and unknowns download — pdf.js cannot render a .pptx, and
  // feeding it one was exactly the failure this helper exists to prevent.
  assert.equal(docOpenMode({ mime: 'application/vnd.openxmlformats-officedocument.presentationml.presentation' }).action, 'download');
  assert.equal(docOpenMode({ mime: 'application/octet-stream' }).action, 'download');
  assert.equal(docOpenMode({}).action, 'download');
  assert.equal(docTypeLabel('application/vnd.ms-excel'), 'Excel');
  assert.equal(docTypeLabel('application/zip'), 'ZIP');
});

test('readerPayload defers the mint behind resolve() and keys strokes by sha256', async () => {
  const { readerPayload } = await import('../../src/lib/library.js');
  const p = readerPayload({ slug: 's', title: 'T', sha256_16: 'abc', linearized: false, subject: 'com4' });
  assert.equal(typeof p.resolve, 'function');
  assert.equal(p.sha256, 'abc');
  assert.equal(p.fileName, 'T.pdf');
  assert.equal(p.url, undefined, 'no url yet — the reader resolves it while its chunk loads');
});

// ── snapshot + recents — localStorage guards ──────────────────────────────

function fakeWindow(seed = []) {
  const store = new Map(seed);
  return {
    localStorage: {
      getItem: (k) => store.get(k) ?? null,
      setItem: (k, v) => store.set(k, v),
      removeItem: (k) => store.delete(k),
    },
    addEventListener: () => {},
    _store: store,
  };
}

test('catalog snapshot survives corrupt or empty localStorage without throwing', async () => {
  const { readCatalogSnapshot } = await import('../../src/lib/library.js');
  globalThis.window = fakeWindow([['vmx-library-catalog-v1', '{corrupt']]);
  try {
    assert.equal(readCatalogSnapshot(), null);
    window._store.set('vmx-library-catalog-v1', JSON.stringify({ at: 1, docs: [] }));
    assert.equal(readCatalogSnapshot(), null, 'an empty snapshot is no snapshot');
    window._store.set('vmx-library-catalog-v1', JSON.stringify({ at: 5, docs: [{ slug: 'a', title: 'T', status: 'public' }] }));
    assert.equal(readCatalogSnapshot().docs[0].slug, 'a');
  } finally {
    delete globalThis.window;
  }
});

test('recent docs record newest-first, dedupe by slug, and cap at 8', async () => {
  const { recordRecentDoc, listRecentDocs } = await import('../../src/lib/library.js');
  globalThis.window = fakeWindow();
  try {
    for (let i = 1; i <= 10; i++) recordRecentDoc({ slug: `s${i}`, title: `T${i}` });
    recordRecentDoc({ slug: 's10', title: 'T10 again' });
    const list = listRecentDocs();
    assert.equal(list.length, 8);
    assert.equal(list[0].slug, 's10');
    assert.equal(list[0].title, 'T10 again');
    assert.equal(list.filter((r) => r.slug === 's10').length, 1);
  } finally {
    delete globalThis.window;
  }
});
