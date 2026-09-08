// ============================================================
// library-ingest-local-path.test.mjs — a manifest item may carry `path`
// ============================================================
// SharePoint/OneDrive shares behind the university sign-in cannot be fetched
// by the script, so the file is saved by hand and the manifest item carries
// its `path`; `url` stays the share link so the catalogue row still points
// home. Pinned at the source like the other ingest contracts (the loop lives
// inside main(), which needs R2 + Supabase env to run).
// ============================================================

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const src = readFileSync(new URL('../../scripts/ingest-library.mjs', import.meta.url), 'utf8').replace(/\r\n/g, '\n');

test('a manifest item with `path` is read from disk instead of fetched, and keeps `url` as its source', () => {
  const loop = src.slice(src.indexOf('for (let i = 0; i < n; i++)'), src.indexOf('if (DRY) {'));
  assert.ok(loop.includes("if (!it.path && !/^https?:\\/\\/mycourseville/i.test(it.url)) { skipped++; continue; }"), 'the mirrorable gate must let a local file through');
  assert.ok(loop.includes('buf = readFileSync(it.path);'), 'a local file is read, not fetched');
  assert.ok(loop.includes("const fileName = it.path ? String(it.path).split(/[\\\\/]/).pop() : it.url.split('?')[0];"), 'extension and mime come from the local file name');
  assert.ok(loop.includes('const mime = mimeFor(fileName);'));
  assert.ok(src.includes('source_url: it.url,'), 'the share link stays the provenance link');
});
