// ============================================================
// library-ingest-local-path.test.mjs — a manifest item may carry `path`
// ============================================================
// SharePoint/OneDrive shares behind the university sign-in cannot be fetched
// by the script, so the file is saved by hand and the manifest item carries
// its `path`; `url` stays the share link so the catalogue row still points
// home. The loop lives inside main(), which needs R2 + Supabase env to run, so
// its two branches are pinned at the source; what it does with the bytes is
// shelfEntry(), which is called here.
// ============================================================

import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { shelfEntry } from '../../scripts/ingest-library.mjs';

const src = readFileSync(new URL('../../scripts/ingest-library.mjs', import.meta.url), 'utf8').replace(/\r\n/g, '\n');

test('a manifest item with `path` is read from disk instead of fetched, and keeps `url` as its source', () => {
  const loop = src.slice(src.indexOf('for (let i = 0; i < n; i++)'), src.indexOf('if (DRY) {'));
  assert.ok(loop.includes("if (!it.path && !/^https?:\\/\\/mycourseville/i.test(it.url)) { skipped++; continue; }"), 'the mirrorable gate must let a local file through');
  assert.ok(loop.includes('buf = readFileSync(it.path);'), 'a local file is read, not fetched');
  assert.ok(loop.includes('shelfEntry(it, buf, { name, publication, bucket: cfg.bucket })'), 'the key and the row come from shelfEntry');

  const share = 'https://chula-my.sharepoint.com/:b:/g/personal/someone/EXample';
  const bytes = Buffer.from('a deck saved by hand');
  const sha = createHash('sha256').update(bytes).digest('hex').slice(0, 16);
  const publication = { license: 'instructor-permission', status: 'public', permissionEvidence: 'recorded' };
  const local = shelfEntry({ name: 'Eq Infectious Dz', path: 'C:\\saved\\Eq Infectious Dz.PPTX', url: share, courseNo: '3106510', folder: 'Lecture Slides' }, bytes, { publication, bucket: 'vetmock-library' });
  // Extension and mime come from the local file name, not from a share link that has neither.
  assert.equal(local.key, `docs/${sha}/eq-infectious-dz-${sha.slice(0, 6)}.pptx`);
  assert.equal(local.mime, 'application/vnd.openxmlformats-officedocument.presentationml.presentation');
  assert.equal(local.sha, sha);
  assert.equal(local.row.source_url, share, 'the share link stays the provenance link');
  assert.equal(local.row.storage_key, local.key);
  assert.equal(local.row.byte_size, bytes.length);
  assert.equal(local.row.permission_evidence, 'recorded');

  // A MyCourseVille file has no path: the name in its URL decides.
  const fetched = shelfEntry({ name: 'Urinary 2', url: 'https://mycourseville-default.s3.ap-southeast-1.amazonaws.com/m/urinary_2-838816-17561234.pdf?x=1', courseNo: '3106414' }, bytes, { publication, bucket: 'vetmock-library' });
  assert.equal(fetched.key, `docs/${sha}/urinary-2-${sha.slice(0, 6)}.pdf`);
  assert.equal(fetched.mime, 'application/pdf');
});
