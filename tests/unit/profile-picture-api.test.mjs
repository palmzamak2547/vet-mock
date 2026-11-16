// /api/profile-picture with fixture files: what a student's upload becomes, and
// what is refused. The store, the database and the gate are stand-ins; the
// decoding and re-encoding are the real ones.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { createHandler, RATES } from '../../api/profile-picture.js';
import { verifyBlobToken } from '../../api/_lib/blob-token.js';
import { writeObject } from '../../api/_lib/r2.js';

test('storage receives exactly the redrawn bytes, at a signed private address', async () => {
  const calls = [];
  const fetchImpl = async (url, init) => { calls.push({ url: String(url), method: init.method, bytes: Buffer.from(await new Response(init.body).arrayBuffer()), type: init.headers['Content-Type'] }); return new Response('', { status: 200 }); };
  const keys = { R2_ACCOUNT_ID: 'acct', R2_ACCESS_KEY_ID: 'id', R2_SECRET_ACCESS_KEY: 'secret' };
  const bytes = Buffer.from([1, 2, 3, 250]);
  assert.equal(await writeObject('PUT', 'profile-pictures/a.webp', { body: bytes, mime: 'image/webp', bucket: 'b', env: keys, fetchImpl }), true);
  assert.equal(calls[0].method, 'PUT');
  assert.match(calls[0].url, /^https:\/\/acct\.r2\.cloudflarestorage\.com\/b\/profile-pictures\/a\.webp\?.*X-Amz-Signature=/);
  assert.deepEqual([...calls[0].bytes], [...bytes]);
  assert.equal(calls[0].type, 'image/webp');
  const gone = async () => new Response('', { status: 404 });
  assert.equal(await writeObject('DELETE', 'profile-pictures/a.webp', { env: keys, fetchImpl: gone }), true, 'already gone counts as removed');
});

const DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), '../fixtures/profile-picture');
const fixture = (name) => fs.readFileSync(path.join(DIR, name));
const ME = '11111111-1111-4111-8111-111111111111';
const OTHER = '22222222-2222-4222-8222-222222222222';
const env = { CLOUDFLARE_API_TOKEN: 'test-token', R2_ACCOUNT_ID: 'acct' };
const MEMBER = { ok: true, userId: ME, token: 'member-token', member: true };

function harness({ who = MEMBER, own = null, rows = null, rpcStatus = 200, signedResult = { ok: true, previous_key: null }, limited = null, deleteResult = true } = {}) {
  const log = { stored: [], deleted: [], rpc: [], signed: [], errors: [] };
  const handler = createHandler({
    env,
    gate: async () => who,
    limit: async (_req, _gate, route) => { log.route = route; return limited || { ok: true }; },
    rpc: async (name, args) => {
      log.rpc.push({ name, args });
      if (rpcStatus !== 200) return { status: rpcStatus, data: null };
      if (name === 'profile_pictures_for') {
        if (rows) return { status: 200, data: rows };
        return { status: 200, data: own ? [{ user_id: ME, ...own }] : [] };
      }
      if (name === 'report_profile_picture') return { status: 200, data: { reported: true, hidden: false } };
      return { status: 404, data: null };
    },
    signed: async (name, purpose, data) => { log.signed.push({ name, purpose, data }); return signedResult; },
    store: async (method, key, opts) => {
      if (method === 'PUT') { log.stored.push({ key, ...opts }); return true; }
      log.deleted.push(key);
      if (deleteResult instanceof Error) throw deleteResult;
      return deleteResult;
    },
    log: { error: (line) => log.errors.push(line) },
  });
  return { handler, log };
}

function request(method, { query = '', body, headers = {} } = {}) {
  return { method, url: `/api/profile-picture${query}`, headers: { 'content-type': 'application/vmx-b64', ...headers }, body };
}
const b64 = (bytes) => `b64:${bytes.toString('base64')}`;

async function call(handler, req) {
  const res = {
    statusCode: 200, headers: {}, text: '',
    setHeader(k, v) { this.headers[k.toLowerCase()] = v; },
    status(code) { this.statusCode = code; return this; },
    json(body) { this.text = JSON.stringify(body); return this; },
    end(text = '') { this.text = text; },
  };
  await handler(req, res);
  return { status: res.statusCode, body: res.text ? JSON.parse(res.text) : null, headers: res.headers };
}

async function uploads(name) {
  const { handler, log } = harness();
  const answer = await call(handler, request('POST', { body: b64(fixture(name)) }));
  return { answer, log };
}

for (const name of ['valid.jpg', 'valid.png', 'valid.webp']) {
  test(`${name} is kept as a 256 px square WebP at a key the server chose`, async () => {
    const { answer, log } = await uploads(name);
    assert.equal(answer.status, 200, JSON.stringify(answer.body));
    assert.equal(log.stored.length, 1);
    const kept = log.stored[0];
    assert.match(kept.key, /^profile-pictures\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.webp$/);
    assert.ok(!kept.key.includes(ME), 'the key never carries the account id');
    assert.equal(kept.mime, 'image/webp');
    const meta = await sharp(kept.body).metadata();
    assert.deepEqual([meta.format, meta.width, meta.height], ['webp', 256, 256]);
    assert.deepEqual(log.signed[0].data, { user_id: ME, key: kept.key });
    // The answer is a short-lived signed link to that key, never a public address.
    assert.match(answer.body.url, /^\/api\/library-blob\?t=/);
    const params = new URL(answer.body.url, 'http://x').searchParams;
    const token = verifyBlobToken(params.get('t'), params.get('s'), { env });
    assert.equal(token.k, kept.key);
    assert.equal(token.a, 'restricted');
    assert.ok(token.e - Date.now() / 1000 <= 20 * 60, 'the link lives at most 20 minutes');
    assert.equal(answer.headers['cache-control'], 'private, no-store');
  });
}

test('the location and camera written into a JPEG are gone from what is kept', async () => {
  const original = fixture('with-location.jpg');
  const before = await sharp(original).metadata();
  assert.ok(before.exif, 'the fixture really carries EXIF');
  assert.ok(original.includes(Buffer.from('FixtureCam')));
  const { answer, log } = await uploads('with-location.jpg');
  assert.equal(answer.status, 200);
  const kept = log.stored[0].body;
  const after = await sharp(kept).metadata();
  assert.equal(after.exif, undefined);
  assert.equal(after.icc, undefined);
  assert.equal(after.xmp, undefined);
  assert.ok(!kept.includes(Buffer.from('FixtureCam')));
  assert.ok(!kept.includes(Buffer.from('Exif')));
});

test('a file over 2 MB is refused before it is decoded, and nothing is stored', async () => {
  const big = Buffer.concat([fixture('valid.jpg'), Buffer.alloc(2 * 1024 * 1024)]);
  const { handler, log } = harness();
  const answer = await call(handler, request('POST', { body: b64(big) }));
  assert.equal(answer.status, 413);
  assert.equal(answer.body.error, 'too_large');
  assert.equal(log.stored.length, 0);
  // The declared length alone is enough to refuse.
  const declared = await call(handler, request('POST', { body: 'b64:', headers: { 'content-length': String(4 * 1024 * 1024) } }));
  assert.equal(declared.status, 413);
});

test('a text file named .jpg is not a picture', async () => {
  const { answer, log } = await uploads('not-a-picture.jpg');
  assert.equal(answer.status, 415);
  assert.equal(answer.body.error, 'not_picture');
  assert.equal(log.stored.length, 0);
});

test('an SVG is refused, whatever it claims to be', async () => {
  const { handler, log } = harness();
  const answer = await call(handler, request('POST', { body: b64(fixture('drawing.svg')), headers: { 'content-type': 'image/jpeg' } }));
  assert.equal(answer.status, 415);
  assert.equal(log.stored.length, 0);
});

test('a picture claiming 30000 x 30000 pixels is refused without decoding it', async () => {
  const started = Date.now();
  const { answer, log } = await uploads('huge-dimensions.png');
  assert.equal(answer.status, 422);
  assert.equal(answer.body.error, 'too_many_pixels');
  assert.equal(log.stored.length, 0);
  assert.ok(Date.now() - started < 3000);
});

test('an animated picture is refused', async () => {
  const { answer, log } = await uploads('animated.webp');
  assert.equal(answer.status, 415);
  assert.equal(answer.body.error, 'animated');
  assert.equal(log.stored.length, 0);
});

test('raw bytes without the b64 envelope are not read as a picture', async () => {
  const { handler } = harness();
  const answer = await call(handler, request('POST', { body: fixture('valid.png').toString('latin1') }));
  assert.equal(answer.status, 415);
});

test('a guest and an account outside the university get nothing, on every route', async () => {
  for (const who of [{ ok: true, userId: null, token: null, member: false }, { ok: true, userId: ME, token: 't', member: false }]) {
    const { handler, log } = harness({ who });
    for (const req of [
      request('POST', { body: b64(fixture('valid.png')) }),
      request('GET', { query: `?users=${ME}` }),
      request('POST', { query: `?report=${OTHER}` }),
      request('DELETE'),
    ]) {
      const answer = await call(handler, req);
      assert.ok([401, 403].includes(answer.status), `${req.method} ${req.url} answered ${answer.status}`);
    }
    assert.equal(log.stored.length + log.rpc.length + log.signed.length, 0);
  }
});

test('uploads are counted per account and refused past the limit', async () => {
  assert.ok(RATES.write.max <= 20);
  const { handler, log } = harness({ limited: { ok: false, retryAfter: 600 } });
  const answer = await call(handler, request('POST', { body: b64(fixture('valid.png')) }));
  assert.equal(answer.status, 429);
  assert.equal(log.route, 'profile-picture-write');
  assert.equal(log.stored.length, 0);
});

test('a picture the admin hid cannot be replaced until it is restored', async () => {
  const { handler, log } = harness({ own: { picture_key: 'profile-pictures/x.webp', picture_state: 'hidden_admin' } });
  const answer = await call(handler, request('POST', { body: b64(fixture('valid.png')) }));
  assert.equal(answer.status, 403);
  assert.equal(answer.body.error, 'refused');
  assert.equal(log.stored.length, 0);
});

test("the admin's block outlives the picture: removed, then a new upload is still refused", async () => {
  const { handler, log } = harness({ own: { picture_key: null, picture_state: 'none', blocked: true } });
  const answer = await call(handler, request('POST', { body: b64(fixture('valid.png')) }));
  assert.equal(answer.status, 403);
  assert.equal(answer.body.error, 'refused');
  assert.equal(log.stored.length + log.signed.length, 0, 'nothing stored, nothing signed');
  const read = await call(handler, request('GET', { query: `?users=${ME}` }));
  assert.deepEqual(read.body.pictures[ME], { url: null, state: 'blocked' });
});

test('removing is never refused by the rate limit, so account deletion can always clear the picture', async () => {
  const { handler, log } = harness({ own: { picture_key: 'profile-pictures/00000000-0000-4000-8000-000000000000.webp', picture_state: 'shown' }, limited: { ok: false, retryAfter: 600 } });
  const answer = await call(handler, request('DELETE'));
  assert.equal(answer.status, 200);
  assert.equal(log.route, undefined);
});

test('every link comes with its real expiry, at least 5 and at most 20 minutes away', async () => {
  const { handler } = harness({ rows: [{ user_id: OTHER, picture_key: 'profile-pictures/11111111-0000-4000-8000-000000000000.webp', picture_state: 'shown' }] });
  const answer = await call(handler, request('GET', { query: `?users=${OTHER}` }));
  const { url, expiresAt } = answer.body.pictures[OTHER];
  const params = new URL(url, 'http://x').searchParams;
  assert.equal(verifyBlobToken(params.get('t'), params.get('s'), { env }).e * 1000, expiresAt);
  const left = expiresAt - Date.now();
  assert.ok(left >= 5 * 60 * 1000 - 2000 && left <= 20 * 60 * 1000, String(left));
  const uploaded = await uploads('valid.png');
  assert.ok(uploaded.answer.body.expiresAt > Date.now());
});

test('a replaced picture is deleted from storage, and so is a removed one', async () => {
  const old = 'profile-pictures/00000000-0000-4000-8000-000000000000.webp';
  const replaced = harness({ own: { picture_key: old, picture_state: 'shown' }, signedResult: { ok: true, previous_key: old } });
  assert.equal((await call(replaced.handler, request('POST', { body: b64(fixture('valid.jpg')) }))).status, 200);
  assert.deepEqual(replaced.log.deleted, [old]);

  const removed = harness({ own: { picture_key: old, picture_state: 'shown' }, signedResult: { ok: true, previous_key: old } });
  const answer = await call(removed.handler, request('DELETE'));
  assert.equal(answer.status, 200);
  assert.deepEqual(removed.log.signed[0].data, { user_id: ME, key: null });
  assert.deepEqual(removed.log.deleted, [old]);
});

test('a stored picture that cannot be removed is logged with its key and the reason', async () => {
  const old = 'profile-pictures/00000000-0000-4000-8000-000000000000.webp';
  const refused = harness({ own: { picture_key: old, picture_state: 'shown' }, signedResult: { ok: true, previous_key: old }, deleteResult: false });
  assert.equal((await call(refused.handler, request('DELETE'))).status, 200, 'the student is still answered');
  assert.equal(refused.log.errors.length, 1);
  assert.ok(refused.log.errors[0].includes(old) && /removed/.test(refused.log.errors[0]) && /did not accept/.test(refused.log.errors[0]), refused.log.errors[0]);

  const thrown = harness({ own: { picture_key: old, picture_state: 'shown' }, signedResult: { ok: true, previous_key: old }, deleteResult: new Error('network down') });
  assert.equal((await call(thrown.handler, request('POST', { body: b64(fixture('valid.png')) }))).status, 200);
  assert.ok(thrown.log.errors[0].includes(old) && /replaced/.test(thrown.log.errors[0]) && /network down/.test(thrown.log.errors[0]), thrown.log.errors[0]);

  const unsaved = harness({ signedResult: { ok: false, reason: 'refused' }, deleteResult: false });
  await call(unsaved.handler, request('POST', { body: b64(fixture('valid.png')) }));
  assert.ok(unsaved.log.errors[0].includes(unsaved.log.stored[0].key), unsaved.log.errors[0]);

  const fine = harness({ own: { picture_key: old, picture_state: 'shown' }, signedResult: { ok: true, previous_key: old } });
  await call(fine.handler, request('DELETE'));
  assert.equal(fine.log.errors.length, 0, 'nothing logged when the delete works');
});

test('a link is kept by the seconds the server says are left, whatever this device clock says', async () => {
  const { keepUntil } = await import('../../src/lib/profile-picture.js');
  const { handler } = harness({ rows: [{ user_id: OTHER, picture_key: 'profile-pictures/11111111-0000-4000-8000-000000000000.webp', picture_state: 'shown' }] });
  const row = (await call(handler, request('GET', { query: `?users=${OTHER}` }))).body.pictures[OTHER];
  assert.ok(Math.abs(row.expiresIn - (row.expiresAt - Date.now()) / 1000) <= 1.5, 'expiresIn matches expiresAt on the server clock');
  for (const skew of [-5 * 60 * 1000, 0, 5 * 60 * 1000]) {
    const deviceNow = Date.now() + skew;
    const until = keepUntil(row, deviceNow);
    assert.equal(until - deviceNow, row.expiresIn * 1000 - 60 * 1000, `clock off by ${skew / 60000} min`);
  }
  assert.equal(keepUntil({ url: null }, 1000), 1000 + 4 * 60 * 1000, 'no link: asked again after 4 minutes');
  assert.equal(keepUntil({ url: 'x', expiresAt: 600000 }, 0), 540000, 'an older answer falls back to expiresAt');
});

test('a database refusal after storing removes the new object again', async () => {
  const { handler, log } = harness({ signedResult: { ok: false, reason: 'refused' } });
  const answer = await call(handler, request('POST', { body: b64(fixture('valid.png')) }));
  assert.equal(answer.status, 403);
  assert.deepEqual(log.deleted, [log.stored[0].key]);
});

test('reading pictures: only what the database lets this member see, as signed links', async () => {
  const { handler } = harness({ rows: [
    { user_id: OTHER, picture_key: 'profile-pictures/11111111-0000-4000-8000-000000000000.webp', picture_state: 'shown' },
    { user_id: ME, picture_key: 'profile-pictures/22222222-0000-4000-8000-000000000000.webp', picture_state: 'hidden_reports' },
  ] });
  const answer = await call(handler, request('GET', { query: `?users=${ME},${OTHER}` }));
  assert.equal(answer.status, 200);
  assert.equal(answer.body.pictures[OTHER].state, 'shown');
  assert.equal(answer.body.pictures[ME].state, 'hidden_reports');
  assert.match(answer.body.pictures[OTHER].url, /^\/api\/library-blob\?t=/);
  assert.equal((await call(handler, request('GET', { query: '?users=not-an-id' }))).status, 400);
  const many = Array.from({ length: 61 }, (_, i) => `00000000-0000-4000-8000-${String(i).padStart(12, '0')}`).join(',');
  assert.equal((await call(handler, request('GET', { query: `?users=${many}` }))).status, 400);
});

test('before the migration is applied everyone keeps the ready-made picture', async () => {
  const { handler } = harness({ rpcStatus: 404 });
  const read = await call(handler, request('GET', { query: `?users=${ME}` }));
  assert.equal(read.status, 200);
  assert.deepEqual(read.body.pictures, {});
  const upload = await call(handler, request('POST', { body: b64(fixture('valid.png')) }));
  assert.equal(upload.status, 503);
  assert.equal(upload.body.error, 'not_ready');
});

test('a member reports another member, never themselves', async () => {
  const { handler, log } = harness();
  const answer = await call(handler, request('POST', { query: `?report=${OTHER}` }));
  assert.equal(answer.status, 200);
  assert.deepEqual(log.rpc.at(-1), { name: 'report_profile_picture', args: { p_owner: OTHER } });
  assert.equal(log.route, 'profile-picture-report');
  assert.equal((await call(handler, request('POST', { query: `?report=${ME}` }))).status, 400);
});
