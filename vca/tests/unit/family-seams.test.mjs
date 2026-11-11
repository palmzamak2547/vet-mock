// Where VCA meets the rest of VetMock: a question's own address and its twin in the VetMock app,
// a sign-in's return path that never leaves the origin, and copy that says what the wall does.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { parseRoute } from '../../src/router.js';
import { questionPath, twinUrl } from '../../src/lib/twin.js';

const read = (rel) => fs.readFileSync(new URL(`../../${rel}`, import.meta.url), 'utf8');

test('a question has an address, and the router reads it back', () => {
  assert.equal(questionPath('anatomy', 12), '/d/anatomy/12');
  const r = parseRoute('/d/anatomy/12');
  assert.equal(r.name, 'question');
  assert.deepEqual(r.params, { domain: 'anatomy', no: '12' });
  assert.equal(parseRoute('/d/anatomy').name, 'domain', 'the domain page is unchanged');
  for (const [d, n] of [['anatomy', 'x'], ['Anatomy', 1], ['../x', 1], ['anatomy', '1/2'], ['', 3]]) {
    assert.equal(questionPath(d, n), null, `${d} ${n}`);
  }
  assert.equal(parseRoute('/d/anatomy/12/x').name, 'notFound');
});

test('the twin is the same question in the VetMock app, by the app\'s own shared-question link', () => {
  const url = new URL(twinUrl({ subject: 'vetanat', id: 12 }));
  assert.equal(url.origin, 'https://vetmock.com');
  assert.equal(url.pathname, '/');
  const set = JSON.parse(Buffer.from(url.searchParams.get('qset'), 'base64url').toString('utf8'));
  assert.deepEqual(set, [{ s: 'vetanat', i: 12 }]);
  assert.equal(twinUrl({ subject: 'x', id: 60_001 }), null, 'a custom question cannot travel');
  assert.equal(twinUrl(null), null);
});

test('the sign-in return path keeps the hash and refuses anything off the origin', () => {
  const src = read('src/online/account.js');
  assert.match(src, /safeReturnPath\(path\)/);
  assert.match(src, /window\.location\.hash/);
  assert.doesNotMatch(src, /path\.startsWith\('\/'\) && !path\.startsWith\('\/\/'\)/, 'the old check let /\\host through');
});

test('no page says VCA needs no account while the wall covers every page', () => {
  for (const file of ['public/manifest.webmanifest', 'src/pages/About.jsx', 'src/pages/Progress.jsx', 'src/online/ui/SignInSheet.jsx', 'index.html']) {
    const src = read(file);
    for (const claim of ['ไม่ต้องมีบัญชี', 'ไม่ต้องสมัคร', 'ไม่ต้องเข้าสู่ระบบก็ฝึกได้']) {
      assert.ok(!src.includes(claim), `${file}: ${claim}`);
    }
  }
});

test('the cover prints the profile\'s real host in one piece', () => {
  const src = read('src/online/cover.js');
  assert.match(src, /'vca\.vetmock\.com\/u\/'/);
  assert.doesNotMatch(src, /`\.vetmock\.com\/u\/\$\{handle\}`/);
});
