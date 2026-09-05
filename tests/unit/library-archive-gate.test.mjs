import assert from 'node:assert/strict';
import test from 'node:test';
import handler from '../../api/library-file.js';
import { VCA_MATERIALS } from '../../src/data/vca-materials.js';
import { verifyBlobToken } from '../../api/_lib/blob-token.js';
const fakeRes = () => ({ statusCode: 0, headers: {}, body: '', setHeader(key, value) { this.headers[key] = value; }, end(body = '') { this.body = body; } });

test('source aliases sign an owned copy and retain its filename without forwarding arbitrary redirects', async (t) => {
  const file = VCA_MATERIALS.flatMap((m) => m.files).find((f) => !f.archiveOnly && f.backups?.[0]?.mime === 'application/pdf');
  assert.ok(file, 'archive inventory must be populated');
  const copy = file.backups[0]; const seen = [];
  const previous = { ...process.env }; const previousFetch = globalThis.fetch;
  Object.assign(process.env, { VITE_SUPABASE_URL: 'https://example.supabase.co', VITE_SUPABASE_ANON_KEY: 'anon-key', CLOUDFLARE_API_TOKEN: 'test-only' });
  t.after(() => { process.env = previous; globalThis.fetch = previousFetch; });
  const row = { slug: copy.slug, status: 'public', storage_provider: 'r2', storage_bucket: 'vetmock-library', storage_key: `archives/vca/objects/${copy.sha256}.pdf`, mime: 'application/pdf', byte_size: copy.bytes };
  globalThis.fetch = async (_url, init) => { seen.push(JSON.parse(init.body)); return Response.json([row]); };
  const res = fakeRes();
  await handler({ method: 'GET', url: `/api/library-file?source=${file.id}&open=1&redirect=https://evil.test`, headers: {} }, res);
  assert.equal(res.statusCode, 302);
  const location = new URL(res.headers.Location);
  assert.equal(location.origin, 'https://vetmock-library-archive.palmzamak2547.workers.dev');
  assert.equal(seen[0].p_slug, copy.slug);
  const payload = verifyBlobToken(location.searchParams.get('t'), location.searchParams.get('s'));
  assert.equal(payload.k, row.storage_key);
  assert.equal(payload.n, copy.bytes);
  assert.ok(payload.f.endsWith('.pdf'));
  row.storage_key = null; row.status = 'restricted';
  const denied = fakeRes();
  await handler({ method: 'GET', url: `/api/library-file?source=${file.id}&open=1`, headers: {} }, denied);
  assert.equal(denied.statusCode, 401);
  assert.equal(denied.headers.Location, undefined);
  for (const file of VCA_MATERIALS.flatMap((m) => m.files).filter((f) => f.archiveOnly)) {
    const hidden = fakeRes();
    await handler({ method: 'GET', url: `/api/library-file?source=${file.id}&open=1`, headers: {} }, hidden);
    assert.equal(hidden.statusCode, 404, 'owner-lock files must remain archive-only');
  }
});
