import assert from 'node:assert/strict';
import test from 'node:test';
import { VCA_MATERIALS } from '../../src/data/vca-materials.js';
import { archivedSourceUrl, googleDriveSourceUrl, mergeLibrarySources, vcaFileDoc, vcaLibraryDocs } from '../../src/lib/vca-library.js';
import { docOpenMode, indexDocs, filterIndexed, readerPayload } from '../../src/lib/library.js';

test('each inventoried source is reachable exactly once without advertising an unverified current exam year', async () => {
  const ids = new Set();
  for (const material of VCA_MATERIALS) {
    assert.ok(material.title && material.categories.length);
    for (const file of material.files) {
      assert.ok(!ids.has(file.id), `duplicate Drive file ${file.id}`);
      ids.add(file.id);
      assert.ok(googleDriveSourceUrl(file.url), `invalid source URL ${file.id}`);
      assert.ok(file.backups?.length > 0, `missing archive ${file.id}`);
      for (const copy of file.backups) {
        assert.match(copy.sha256, /^[0-9a-f]{64}$/);
        assert.ok(copy.bytes > 0);
        assert.ok(copy.slug);
      }
      if (file.mime.startsWith('application/vnd.google-apps.')) {
        assert.ok(file.backups.some((copy) => copy.format === 'pdf'));
        assert.ok(file.backups.some((copy) => ['docx', 'xlsx'].includes(copy.format)));
      }
    }
  }
  const docs = vcaLibraryDocs(VCA_MATERIALS);
  assert.equal(new Set(docs.map((doc) => doc.id)).size, docs.length);
  for (const doc of docs) {
    assert.equal(doc.academic_year, null);
    assert.equal(doc.storage_provider, 'r2');
    assert.ok(doc.source_files.every((file) => !file.archiveOnly));
    if (doc.mime === 'application/pdf') {
      assert.equal(docOpenMode(doc).action, 'read');
      assert.equal(readerPayload(doc).rangeSupported, true);
    }
  }
  assert.ok(filterIndexed(indexDocs(docs), { query: 'VCA Pharmacology' }).length > 0);
});

test('archive aliases use the library gate and match their original Drive identity', () => {
  const source = { id: '1234567890', url: 'https://drive.google.com/file/d/1234567890/view' };
  assert.equal(archivedSourceUrl(source), '/api/library-file?source=1234567890&open=1');
  assert.equal(archivedSourceUrl({ ...source, id: 'different-id' }), null);
  assert.equal(archivedSourceUrl({ ...source, url: 'javascript:alert(1)' }), null);
});

test('alternate object rows share an editorial card without hiding unrelated catalog docs', () => {
  const file = { id: 'source', title: 'Source', backups: [{ slug: 'owned-pdf', mime: 'application/pdf', sha256: 'abc', bytes: 5 }, { slug: 'owned-docx', mime: 'word', sha256: 'def', bytes: 6 }] };
  const source = { ...vcaFileDoc(file), id: 'editorial-card', source_files: [file] };
  const merged = mergeLibrarySources([{ id: 'db-pdf', slug: 'owned-pdf' }, { id: 'db-docx', slug: 'owned-docx' }, { id: 'unrelated', slug: 'other' }], [source]);
  assert.deepEqual(merged.map((doc) => doc.id), ['unrelated', 'editorial-card']);
  assert.equal(filterIndexed(indexDocs([{ ...source, title: 'Canonical', source_files: [{ title: 'Alternate edition 2567' }] }]), { query: 'Alternate edition 2567' }).length, 1);
});

test('Drive source links reject credentials, lookalike domains and unrelated redirect endpoints', () => {
  for (const url of ['javascript:alert(1)', 'https://drive.google.com.evil.test/file/d/abc/view',
    'https://user:secret@drive.google.com/file/d/abc/view', 'http://drive.google.com/file/d/abc/view',
    'https://drive.google.com/redirect?url=https://evil.test', 'https://docs.google.com:1234/document/d/abc/edit']) {
    assert.equal(googleDriveSourceUrl(url), null);
  }
});

test('the library reuses an existing document when its verified content hash matches', () => {
  const original = { id: 'hosted', sha256_16: 'abc123' };
  const source = { id: 'source', sha256_16: 'abc123' };
  assert.deepEqual(mergeLibrarySources([original], [source]), [original]);
  assert.equal(mergeLibrarySources([original], [{ id: 'new' }]).length, 2);
  const combined = mergeLibrarySources([], [
    { ...source, source_files: [{ id: 'pdf' }] },
    { id: 'copy', sha256_16: 'abc123', source_files: [{ id: 'copy-pdf' }, { id: 'docx' }] },
  ]);
  assert.equal(combined.length, 1);
  assert.deepEqual(combined[0].source_files.map((file) => file.id), ['pdf', 'copy-pdf', 'docx']);
});
