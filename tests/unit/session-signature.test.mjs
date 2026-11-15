// The gate checks a session token's signature before it asks the database
// (api/_lib/session-keys.js, api/_lib/chula-gate.js).
//
// Before: any token shaped like a session cost one database call, so 500
// forgeries made 501 calls. Now a token that names one of the project's
// published keys and is not signed by it is no token at all. Everything the
// published keys cannot judge still goes to the database, so the check can
// turn away a forgery and nobody else: the tests below hold both halves.
//
// The keys here are made by the test; the first test checks the verifier
// against a signature this file did not make (RFC 7515, appendix A.3).
import test from 'node:test';
import assert from 'node:assert/strict';
import { createPublicKey, generateKeyPairSync, randomBytes, randomUUID, sign } from 'node:crypto';
import { bearerOf, chulaGate, resetChulaGate } from '../../api/_lib/chula-gate.js';
import { signedBy, signatureVerdict } from '../../api/_lib/session-keys.js';

const PROJECT = 'https://x.supabase.co';
const ANON = 'anon-key-0123456789abcdef';
const ENV = { VITE_SUPABASE_URL: PROJECT, VITE_SUPABASE_ANON_KEY: ANON };
const KEYS_URL = `${PROJECT}/auth/v1/.well-known/jwks.json`;
const STATE_URL = `${PROJECT}/rest/v1/rpc/chula_access_state`;

const b64 = (value) => Buffer.from(JSON.stringify(value)).toString('base64url');

/** A signing key as the project holds it, with the public half as it is published. */
function signingKey(curve = 'P-256') {
  const pair = generateKeyPairSync('ec', { namedCurve: curve });
  const kid = randomUUID();
  return { kid, privateKey: pair.privateKey, jwk: { ...pair.publicKey.export({ format: 'jwk' }), kid, alg: 'ES256', use: 'sig', key_ops: ['verify'], ext: true } };
}

function claimsFor(sub, extra = {}) {
  const now = Math.floor(Date.now() / 1000);
  return { iss: `${PROJECT}/auth/v1`, sub, aud: 'authenticated', exp: now + 3600, iat: now, role: 'authenticated', ...extra };
}

/** A session token as the auth server issues it: ES256, the key's id in the header. */
function issue(key, claims, header = {}) {
  const input = `${b64({ alg: 'ES256', kid: key.kid, typ: 'JWT', ...header })}.${b64(claims)}`;
  const signature = sign('sha256', Buffer.from(input), { key: key.privateKey, dsaEncoding: 'ieee-p1363' });
  return `${input}.${signature.toString('base64url')}`;
}

/** The same header and signature over other claims: what a forger with one real token can make. */
function retarget(token, claims) {
  const [head, , signature] = token.split('.');
  return `${head}.${b64(claims)}.${signature}`;
}

/** The project: its published keys and its database. `members` maps a token to its account. */
function project({ keys = [], members = new Map(), enforce = true, keysAnswer = null } = {}) {
  const p = { keys, members, enforce, keysAnswer, keyReads: 0, asked: [] };
  p.fetchImpl = async (url, init = {}) => {
    if (url === KEYS_URL) {
      p.keyReads++;
      assert.equal(init.redirect, 'error', 'the key list is never taken from a redirect');
      assert.equal(init.headers, undefined, 'the key list is public: the request carries nothing');
      return p.keysAnswer ? p.keysAnswer() : Response.json({ keys: p.keys.map((k) => k.jwk) });
    }
    assert.equal(url, STATE_URL);
    const bearer = init.headers.Authorization.slice(7);
    p.asked.push(bearer);
    if (p.members.has(bearer)) return Response.json({ enforce: p.enforce, signed_in: true, member: true, uid: p.members.get(bearer) });
    if (bearer === ANON) return Response.json({ enforce: p.enforce, signed_in: false, member: false, uid: null });
    return new Response('{"message":"invalid JWT"}', { status: 401 });
  };
  return p;
}

const gate = (p, token, now = Date.now) => chulaGate({ headers: { authorization: `Bearer ${token}` } }, { env: ENV, fetchImpl: p.fetchImpl, now });

test('an ES256 signature is checked as the standard writes it (RFC 7515, appendix A.3)', () => {
  const key = createPublicKey({ format: 'jwk', key: { kty: 'EC', crv: 'P-256', x: 'f83OJ3D2xF1Bg8vub9tLe1gHMzV76e8Tus9uPHvRVEU', y: 'x_FEzRu9m36HLN_tue659LNpXW6pCyStikYjKIWI5a0' } });
  const head = 'eyJhbGciOiJFUzI1NiJ9';
  const body = 'eyJpc3MiOiJqb2UiLA0KICJleHAiOjEzMDA4MTkzODAsDQogImh0dHA6Ly9leGFtcGxlLmNvbS9pc19yb290Ijp0cnVlfQ';
  const signature = 'DtEhU3ljbEg8L38VWAfUAqOyKAM6-Xx-F4GawxaepmXFCgfTjDxw5djxLa8ISlSApmWQxfKTUJqPP3-Kg6NU1Q';
  assert.equal(signedBy(`${head}.${body}.${signature}`, key), true, 'the standard\'s own example');
  assert.equal(signedBy(`${head}.${body.replace('eyJpc3MiOiJqb2Ui', 'eyJpc3MiOiJqb2Vi')}.${signature}`, key), false, 'other claims under the same signature');
  assert.equal(signedBy(`${head}.${body}.${signature.replace('DtEh', 'DtEi')}`, key), false, 'one character of the signature');
  for (const bytes of [1, 63, 64, 65, 4096]) {
    assert.equal(signedBy(`${head}.${body}.${Buffer.alloc(bytes, 7).toString('base64url')}`, key), false, `${bytes} bytes of filler are not a signature`);
  }
  assert.equal(signedBy(`${head}.${body}.${Buffer.alloc(64).toString('base64url')}`, key), false, 'zeros');
  assert.equal(signedBy(`${head}.${body}.`, key), false, 'no signature');
  // The same signature in DER, the form outside JWS, is not this token's signature.
  const pair = signingKey();
  const input = `${head}.${body}`;
  const der = sign('sha256', Buffer.from(input), pair.privateKey);
  assert.equal(signedBy(`${input}.${der.toString('base64url')}`, createPublicKey(pair.privateKey)), false);
  assert.equal(signedBy(issue(pair, claimsFor('u')), createPublicKey(pair.privateKey)), true);
});

test('a member\'s own token reaches the database and is served', async () => {
  resetChulaGate();
  const key = signingKey();
  const mine = issue(key, claimsFor('u-member'));
  const p = project({ keys: [key], members: new Map([[mine, 'u-member']]) });
  const g = await gate(p, mine);
  assert.deepEqual(g, { ok: true, userId: 'u-member', token: mine, member: true });
  assert.deepEqual(p.asked, [mine]);
  assert.equal(p.keyReads, 1);
});

test('forgeries that name the project\'s key never reach the database', async () => {
  resetChulaGate();
  const key = signingKey();
  const stranger = signingKey();
  const mine = issue(key, claimsFor('u-member'));
  const p = project({ keys: [key], members: new Map([[mine, 'u-member']]) });
  const clock = () => 1_000_000; // one switch window
  const forgeries = [
    // One real token, its claims rewritten to another account.
    retarget(mine, claimsFor('u-victim')),
    retarget(mine, claimsFor('u-member', { role: 'service_role' })),
    // Signed, by a key that is not the project's, under the project's key id.
    issue({ kid: key.kid, privateKey: stranger.privateKey }, claimsFor('u-victim')),
    // The right claims with no real signature.
    `${mine.split('.').slice(0, 2).join('.')}.${Buffer.alloc(64).toString('base64url')}`,
    `${mine.split('.').slice(0, 2).join('.')}.c2ln`,
    `${mine.split('.').slice(0, 2).join('.')}.${sign('sha256', Buffer.from(mine.split('.').slice(0, 2).join('.')), stranger.privateKey).toString('base64url')}`,
  ];
  for (let i = 0; i < 500; i++) {
    const input = `${b64({ alg: 'ES256', kid: key.kid, typ: 'JWT' })}.${b64(claimsFor(`forged-${i}`))}`;
    forgeries.push(`${input}.${randomBytes(64).toString('base64url')}`);
  }
  for (const forged of forgeries) {
    const g = await gate(p, forged, clock);
    assert.equal(g.status, 401, 'a forgery is a guest');
    assert.equal(g.body.error, 'signin_required');
  }
  assert.deepEqual(p.asked, [ANON], `${forgeries.length} forgeries: the database was asked once, for the switch, and never shown one`);
  assert.equal(p.keyReads, 1, 'and the key list was read once');
  // Replays cost nothing either.
  for (let i = 0; i < 100; i++) await gate(p, forgeries[0], clock);
  assert.deepEqual(p.asked, [ANON]);
  const honest = await gate(p, mine, clock);
  assert.equal(honest.member, true, 'the member is served after them');
});

test('with the wall off a forgery is a guest like any other, and still is not sent', async () => {
  resetChulaGate();
  const key = signingKey();
  const mine = issue(key, claimsFor('u-member'));
  const p = project({ keys: [key], enforce: false });
  const forged = retarget(mine, claimsFor('u-victim'));
  assert.deepEqual(await gate(p, forged), { ok: true, userId: null, token: null, member: false });
  assert.deepEqual(p.asked, [ANON]);
});

test('a token the published keys cannot judge goes to the database, which decides', async () => {
  const key = signingKey();
  const unpublished = signingKey();
  const claims = claimsFor('u-member');
  const [, body, signature] = issue(key, claims).split('.');
  const shapes = {
    'a key id that is not published (a key newer than the list)': issue(unpublished, claims),
    'no key id': issue(key, claims, { kid: undefined }),
    'an empty key id': issue(key, claims, { kid: '' }),
    'a key id that is not text': issue(key, claims, { kid: 7 }),
    'the shared secret\'s algorithm': `${b64({ alg: 'HS256', kid: key.kid, typ: 'JWT' })}.${body}.${signature}`,
    'another curve\'s algorithm': `${b64({ alg: 'ES384', kid: key.kid, typ: 'JWT' })}.${body}.${signature}`,
    'no algorithm': `${b64({ alg: 'none', kid: key.kid, typ: 'JWT' })}.${body}.${signature}`,
    'a header that is not an object': `${b64('ES256')}.${body}.${signature}`,
    'a header that is not JSON': `${Buffer.from('{alg:ES256').toString('base64url')}.${body}.${signature}`,
  };
  for (const [name, token] of Object.entries(shapes)) {
    resetChulaGate();
    // The database accepts it: the gate must serve it, whatever it thought of the header.
    const p = project({ keys: [key], members: new Map([[token, 'u-member']]) });
    const g = await gate(p, token);
    assert.ok(p.asked.includes(token), `${name}: reached the database`);
    assert.equal(g.member, true, `${name}: a member when the database says so`);
    // And when the database refuses it, that is the database's answer.
    resetChulaGate();
    const q = project({ keys: [key] });
    assert.equal((await gate(q, token)).status, 401, name);
    assert.ok(q.asked.includes(token), `${name}: refused by the database, not here`);
  }
});

test('a key list that cannot be read refuses nobody, and is asked again only after a minute', async () => {
  const key = signingKey();
  const mine = issue(key, claimsFor('u-member'));
  const forged = retarget(mine, claimsFor('u-victim'));
  const failures = {
    'a server error': () => new Response('upstream', { status: 500 }),
    'not found': () => new Response('{}', { status: 404 }),
    'no answer': () => { throw new TypeError('fetch failed'); },
    'a redirect': () => { throw new TypeError('fetch failed: redirect mode is set to error'); },
    'a page instead of a list': () => new Response('<!doctype html>', { status: 200 }),
    'an object with no list': () => Response.json({}),
    'a list that is not a list': () => Response.json({ keys: 'ES256' }),
    'nothing': () => Response.json(null),
  };
  for (const [name, keysAnswer] of Object.entries(failures)) {
    resetChulaGate();
    let clock = 5_000_000;
    const p = project({ keys: [key], members: new Map([[mine, 'u-member']]), keysAnswer });
    assert.equal((await gate(p, mine, () => clock)).member, true, `${name}: the member is served`);
    assert.equal((await gate(p, forged, () => clock)).status, 401, name);
    assert.ok(p.asked.includes(forged), `${name}: with no keys the database judges a forgery, as before`);
    assert.equal(p.keyReads, 1, `${name}: one try, not one a request`);
    clock += 59_000;
    await gate(p, forged, () => clock);
    assert.equal(p.keyReads, 1, `${name}: still inside the minute`);
    clock += 2_000;
    p.keysAnswer = null; // the list is back
    p.asked.length = 0;
    assert.equal((await gate(p, forged, () => clock)).status, 401);
    assert.equal(p.keyReads, 2, `${name}: asked again after a minute`);
    assert.ok(!p.asked.includes(forged), `${name}: and the forgery is stopped again`);
  }
});

test('the key list is read once in ten minutes per instance, also when requests arrive together', async () => {
  resetChulaGate();
  const key = signingKey();
  const p = project({ keys: [key] });
  let clock = 9_000_000;
  // A cold instance and forty requests at once: one read, shared.
  await Promise.all(Array.from({ length: 40 }, (_, i) => gate(p, issue(key, claimsFor(`u-${i}`)), () => clock)));
  assert.equal(p.keyReads, 1);
  for (let i = 0; i < 200; i++) await gate(p, issue(key, claimsFor(`later-${i}`)), () => clock);
  clock += 10 * 60_000 - 1;
  await gate(p, issue(key, claimsFor('u-last')), () => clock);
  assert.equal(p.keyReads, 1, 'inside ten minutes');
  clock += 2;
  await gate(p, issue(key, claimsFor('u-next')), () => clock);
  assert.equal(p.keyReads, 2, 'after them');
});

test('a new signing key refuses nobody: its tokens are the database\'s to judge until the list is read again', async () => {
  resetChulaGate();
  const first = signingKey();
  const second = signingKey();
  let clock = 20_000_000;
  const before = issue(first, claimsFor('u-a'));
  const after = issue(second, claimsFor('u-b'));
  const p = project({ keys: [first], members: new Map([[before, 'u-a'], [after, 'u-b']]) });
  assert.equal((await gate(p, before, () => clock)).member, true);
  // The project starts signing with a second key. This instance still holds the old list.
  p.keys = [first, second];
  const served = await gate(p, after, () => clock);
  assert.equal(served.member, true, 'a member signed by the new key is served at once');
  assert.equal(served.userId, 'u-b');
  assert.equal(p.keyReads, 1, 'without reading the list again');
  const forged = retarget(after, claimsFor('u-victim'));
  await gate(p, forged, () => clock);
  assert.ok(p.asked.includes(forged), 'a forgery under the new key id costs a call until the list is read');
  // Ten minutes on the list is read again, and the new key judges its own forgeries.
  clock += 10 * 60_000 + 1;
  p.asked.length = 0;
  assert.equal((await gate(p, forged, () => clock)).status, 401);
  assert.equal(p.keyReads, 2);
  assert.ok(!p.asked.includes(forged));
  // A stale list whose refresh fails keeps the keys it had.
  clock += 10 * 60_000 + 1;
  p.keysAnswer = () => new Response('', { status: 503 });
  p.asked.length = 0;
  await gate(p, retarget(before, claimsFor('u-victim')), () => clock);
  assert.equal(p.keyReads, 3);
  assert.deepEqual(p.asked.filter((b) => b !== ANON), [], 'the old key still stops its forgeries during the outage');
});

test('a published key that cannot be trusted or used is left to the database', async () => {
  const good = signingKey();
  const other = signingKey();
  const wide = signingKey('P-384');
  const rsa = generateKeyPairSync('rsa', { modulusLength: 2048 }).publicKey.export({ format: 'jwk' });
  const lists = {
    'two keys under one id': [good.jwk, { ...other.jwk, kid: good.kid }],
    'two keys under one id, the real one last': [{ ...other.jwk, kid: good.kid }, good.jwk],
    'a key published for another algorithm': [{ ...good.jwk, alg: 'ES384' }],
    'a key on another curve': [{ ...wide.jwk, kid: good.kid }],
    'an RSA key': [{ ...rsa, kid: good.kid, alg: 'RS256', use: 'sig' }],
    'a key with half its point missing': [{ ...good.jwk, y: undefined }],
    'a key whose point is not on the curve': [{ ...good.jwk, x: good.jwk.y, y: good.jwk.x }],
    'entries that are not keys': [null, 'ES256', 7, [], { kid: good.kid }],
  };
  const token = retarget(issue(good, claimsFor('u-member')), claimsFor('u-other'));
  for (const [name, keys] of Object.entries(lists)) {
    resetChulaGate();
    const p = project({ keysAnswer: () => Response.json({ keys }), members: new Map([[token, 'u-other']]) });
    const g = await gate(p, token);
    assert.ok(p.asked.includes(token), `${name}: the database is asked`);
    assert.equal(g.member, true, `${name}: and its answer stands`);
  }
});

test('the verdict itself: signed, forged, and unknown for everything else', async () => {
  resetChulaGate();
  const key = signingKey();
  const p = project({ keys: [key] });
  const o = { fetchImpl: p.fetchImpl, now: () => 30_000_000 };
  const mine = issue(key, claimsFor('u-member'));
  assert.equal(await signatureVerdict(mine, PROJECT, o), 'signed');
  assert.equal(await signatureVerdict(mine, `${PROJECT}/`, o), 'signed', 'a trailing slash on the configured address is the same project');
  assert.equal(await signatureVerdict(retarget(mine, claimsFor('u-x')), PROJECT, o), 'forged');
  for (const junk of ['', 'a.b.c', '...', 'no dots', null, undefined, 42]) {
    assert.equal(await signatureVerdict(junk, PROJECT, o), 'unknown', String(junk));
  }
  assert.equal(p.keyReads, 1, 'the two addresses are one list');
});

// ── The length cap ──────────────────────────────────────────────────────────
// A token carries the account's profile, so a full profile is a long token.

test('the cap leaves room for the fullest profile the app lets a student write', async () => {
  resetChulaGate();
  const key = signingKey();
  const thai = (n) => 'ก'.repeat(n);
  const email = `${'a'.repeat(35)}@student.chula.ac.th`;
  const picture = `https://lh3.googleusercontent.com/a/${'A'.repeat(64)}=s96-c`;
  const lineSub = `U${'f'.repeat(32)}`;
  const now = Math.floor(Date.now() / 1000);
  const fullest = issue(key, {
    ...claimsFor(randomUUID()), email, phone: '',
    app_metadata: { provider: 'google', providers: ['google', 'email'], line_sub: lineSub },
    user_metadata: {
      // What Google sign-in stores.
      avatar_url: picture, picture, custom_claims: { hd: 'student.chula.ac.th' }, email, email_verified: true, phone_verified: false,
      full_name: thai(40), name: thai(40), iss: 'https://accounts.google.com', provider_id: '1'.repeat(21), sub: '1'.repeat(21),
      // The profile screen's own limits: a 30-character username, a 140-character bio.
      username: 'u'.repeat(30), year: 6, cohort: 'Vet 86', avatar_emoji: '\u{1F43E}', bio: thai(140), show_on_leaderboard: true, onboarded: true,
      // A linked LINE account.
      line_sub: lineSub, line_name: thai(20), line_picture: `https://profile.line-scdn.net/${'x'.repeat(120)}`, provider: 'line',
    },
    aal: 'aal2', amr: [{ method: 'totp', timestamp: now }, { method: 'oauth', timestamp: now }], session_id: randomUUID(), is_anonymous: false,
  });
  assert.ok(fullest.length > 3000, `the fullest profile's token is ${fullest.length} characters`);
  assert.equal(bearerOf({ headers: { authorization: `Bearer ${fullest}` } }), fullest, `a ${fullest.length}-character token is a session`);
  const p = project({ keys: [key], members: new Map([[fullest, 'u-full']]) });
  assert.equal((await gate(p, fullest)).member, true);
});

test('a bearer over the cap is not a session and is never sent', async () => {
  // Well-formed claims, the third part sized so the whole is exactly `length` characters.
  const sized = (length) => {
    const start = `${b64({ alg: 'ES256', typ: 'JWT' })}.${b64(claimsFor('u-long'))}.`;
    return start + 'A'.repeat(length - start.length);
  };
  const atCap = sized(4096);
  const over = sized(4097);
  assert.equal(bearerOf({ headers: { authorization: `Bearer ${atCap}` } }), atCap);
  assert.equal(bearerOf({ headers: { authorization: `Bearer ${over}` } }), '');
  resetChulaGate();
  const p = project({ members: new Map([[atCap, 'u-long'], [over, 'u-long']]) });
  assert.equal((await gate(p, atCap)).member, true, 'at the cap the database decides');
  assert.equal((await gate(p, over)).status, 401, 'one character over is a guest');
  assert.ok(!p.asked.includes(over));
});
