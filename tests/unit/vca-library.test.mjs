import assert from 'node:assert/strict';
import test from 'node:test';
import { VCA_MATERIALS } from '../../src/data/vca-materials.js';
import { googleDriveSourceUrl, mergeLibrarySources, vcaLibraryDocs } from '../../src/lib/vca-library.js';
import { docOpenMode, resolveDocUrl, indexDocs, filterIndexed } from '../../src/lib/library.js';

test('each inventoried source is reachable exactly once without advertising an unverified current exam year', async () => {
  const ids = new Set();
  for (const material of VCA_MATERIALS) {
    assert.ok(material.title && material.categories.length);
    for (const file of material.files) {
      assert.ok(!ids.has(file.id), `duplicate Drive file ${file.id}`);
      ids.add(file.id);
      assert.ok(googleDriveSourceUrl(file.url), `invalid source URL ${file.id}`);
    }
  }
  const docs = vcaLibraryDocs(VCA_MATERIALS);
  assert.equal(new Set(docs.map((doc) => doc.id)).size, docs.length);
  for (const doc of docs) {
    assert.equal(doc.academic_year, null);
    assert.equal(docOpenMode(doc).action, 'tab', 'Drive preview is never treated as PDF bytes');
    assert.equal(await resolveDocUrl(doc), googleDriveSourceUrl(doc.external_url));
  }
  assert.ok(filterIndexed(indexDocs(docs), { query: 'VCA Pharmacology' }).length > 0);
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
