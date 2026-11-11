// Where VCA meets the rest of VetMock: a question's own address and its twin in the VetMock app,
// a sign-in's return path that never leaves the origin, and copy that says what the wall does.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { parseRoute } from '../../src/router.js';
import { questionPath, twinUrl } from '../../src/lib/twin.js';
import { assertUniqueNumbers } from '../../scripts/bank-shards.mjs';

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

// The profile sheet's "โชว์สถิติการฝึกบนโปรไฟล์" saves the totals (answered, accuracy, streak, mocks) to
// the account, where others see them: no line may say nothing reaches the account.
const SHOWN_TOTALS = 'ยอดรวมที่เลือกโชว์บนโปรไฟล์จะบันทึกไว้ในบัญชี';

test('the pages that say where answers live also say the shown totals are saved to the account', () => {
  assert.match(read('src/online/ui/ProfileSheet.jsx'), /stats: showStats \? local : \{\}/, 'the opt-in this wording describes');
  for (const file of ['src/pages/About.jsx', 'src/pages/Progress.jsx', 'src/online/ui/SignInSheet.jsx']) {
    const src = read(file);
    assert.ok(src.includes(SHOWN_TOTALS), `${file} says the shown totals are saved`);
    assert.ok(!src.includes('ไม่ส่งขึ้นบัญชี'), `${file} must not say nothing reaches the account`);
  }
});

test('no line depends on the wall being on: the switch can turn it off', () => {
  for (const file of ['public/manifest.webmanifest', 'src/pages/About.jsx']) {
    assert.ok(!read(file).includes('เข้าใช้ด้วยบัญชี Google ของจุฬาฯ'), file);
  }
});

test('the cover prints the profile\'s real host in one piece', () => {
  const src = read('src/online/cover.js');
  assert.match(src, /'vca\.vetmock\.com\/u\/'/);
  assert.doesNotMatch(src, /`\.vetmock\.com\/u\/\$\{handle\}`/);
});

test('a question number opens one question: the bank build refuses a number two subjects share in a domain', () => {
  assert.doesNotThrow(() => assertUniqueNumbers('anatomy', [{ subject: 'a', id: 1 }, { subject: 'a', id: 2 }, { subject: 'b', id: 3 }]));
  assert.throws(() => assertUniqueNumbers('anatomy', [{ subject: 'a', id: 7 }, { subject: 'b', id: 7 }]), /No\. 7 is both a:7 and b:7/);
  assert.throws(() => assertUniqueNumbers('anatomy', [{ subject: 'a', id: 7 }, { subject: 'a', id: '7' }]), /numbers must be unique/);
  assert.ok(read('scripts/build-bank.mjs').includes('assertUniqueNumbers(d.id, items)'), 'the build runs it on every domain');
});

test('a question that could not be loaded is not called withdrawn', () => {
  const src = read('src/components/QuestionPeek.jsx');
  assert.ok(src.includes('.catch(() => { if (live) setFailed(true); })'), 'a failed load is its own state');
  assert.ok(src.includes('ตอนนี้อาจไม่ได้ต่อเน็ต') && src.includes('ลองอีกครั้ง'), 'it says so and offers to try again');
  assert.ok(!/\.catch\([^)]*setQ\(null\)/.test(src), 'a failure never reads as "not in the bank"');
});
