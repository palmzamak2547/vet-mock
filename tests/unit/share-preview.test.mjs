// api/s.js: the preview of a /s/ link. A real set gets its subject's name, the
// count and the minutes, the subject's cover, and a person is sent on to the
// app's own ?qset= form built from the decoded numbers. Anything else gets the
// not-found page with the site's tags. No input text ever reaches the page.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync, statSync } from 'node:fs';
import handler, { readSet } from '../../api/s.js';
import { encodeShareCode, decodeQuizSet, SHARE_SUBJECTS } from '../../src/lib/share-link.js';
import { SHARE_BANK } from '../../api/_lib/share-bank.generated.js';
import { setCoverId } from '../../src/data/og-covers.js';

function call(query) {
  const res = {
    headers: {},
    setHeader(k, v) { this.headers[k.toLowerCase()] = v; },
    status(c) { this.statusCode = c; return this; },
    send(b) { this.body = b; return this; },
  };
  handler({ query, headers: { host: 'evil.example' } }, res);
  return res;
}
const firstIds = (subject, n) => {
  const out = [];
  for (const [a, b] of SHARE_BANK[subject].runs) for (let id = a; id <= b && out.length < n; id++) out.push(id);
  return out;
};
const metas = (html) => [...html.matchAll(/<meta [^>]*content="([^"]*)"/g)].map((m) => m[1]);
const set = firstIds('epidemiology', 10).map((id) => ({ subject: 'epidemiology', id }));
const code = encodeShareCode(set);

test('a real set previews with its subject, count, minutes and cover, and sends a person to ?qset=', () => {
  const res = call({ code });
  assert.equal(res.statusCode, 200);
  assert.match(res.body, /<title>ชุดโจทย์ ระบาดวิทยา 10 ข้อ \| VetMock<\/title>/);
  assert.match(res.body, /เพื่อนส่งชุดโจทย์ 10 ข้อมาให้ลองทำ ใช้เวลาราว 10 นาที/);
  assert.match(res.body, /content="https:\/\/vetmock\.com\/og\/set-epidemiology\.png\?v=\d+"/);
  assert.match(res.body, new RegExp(`content="https://vetmock\\.com/s/${code}"`));
  const target = res.body.match(/location\.replace\("\/\?qset=([A-Za-z0-9_-]+)"\)/);
  assert.ok(target, 'a person is sent on');
  assert.deepEqual(decodeQuizSet(target[1]), set);
  assert.doesNotMatch(res.body, /evil\.example/, 'the Host header is never used');
  assert.match(res.headers['cache-control'], /s-maxage=86400/);
  assert.equal(res.headers['x-robots-tag'], 'noindex');
  assert.match(res.headers['content-security-policy'], /default-src 'none'/);
});

test('no question text and no answer reaches any tag', async () => {
  const { QB, loadQB } = await import('../../src/data/questions.js');
  await loadQB();
  const res = call({ code });
  for (const { id } of set) {
    const q = QB.find((x) => x.subject === 'epidemiology' && x.id === id);
    assert.ok(q, `${id} is in the bank`);
    assert.ok(!res.body.includes(q.q.slice(0, 20)), `stem of ${id}`);
    for (const opt of q.options || []) if (String(opt).length > 8) assert.ok(!res.body.includes(String(opt).slice(0, 20)), `option of ${id}`);
  }
});

test('ids the bank does not have, and every hostile code, get the safe not-found page', () => {
  const missingId = encodeShareCode([{ subject: 'epidemiology', id: 999999 }]);
  const hostile = [
    missingId, '', 'A'.repeat(5000), '<script>alert(1)</script>', '"><img src=x onerror=alert(1)>',
    '__proto__', 'constructor', 'toString', 'Zm9v', '%00', 'AQ', 'AQoMgA',
  ];
  for (const bad of hostile) {
    const res = call({ code: bad });
    assert.equal(res.statusCode, 404, JSON.stringify(bad).slice(0, 40));
    assert.match(res.body, /<title>ไม่พบชุดนี้ \| VetMock<\/title>/);
    assert.match(res.body, /og\/home\.png/);
    assert.doesNotMatch(res.body, /<script>location/);
    if (bad.length > 3) assert.ok(!res.body.includes(bad), 'the input is never echoed');
  }
  for (const query of [{}, { code: [code, code] }, { code: { a: 1 } }, null]) {
    assert.equal(call(query).statusCode, 404);
  }
});

test('the tags hold no input text: every content value is one of our own strings', () => {
  const res = call({ code });
  for (const value of metas(res.body)) {
    assert.doesNotMatch(value, /[<>]/);
    if (value.startsWith('https://')) assert.match(value, /^https:\/\/vetmock\.com\//);
  }
  // The only part of the code in the page is the same code written again from the decoded set.
  assert.equal(res.body.split(code).length - 1, 1);
});

test('the bank check refuses a subject\'s id that belongs to another subject', () => {
  const zoonosesId = firstIds('zoonoses', 1)[0];
  assert.equal(readSet(encodeShareCode([{ subject: 'zoonoses', id: zoonosesId }])).length, 1);
  const other = SHARE_SUBJECTS.find((s) => s !== 'zoonoses' && !firstIds(s, 10000).includes(zoonosesId));
  assert.equal(readSet(encodeShareCode([{ subject: other, id: zoonosesId }])), null);
});

test('every subject a link can name has its cover, 1200x630 and 150 KB at most', () => {
  for (const subject of SHARE_SUBJECTS) {
    const file = `public/og/${setCoverId(subject)}.png`;
    assert.ok(existsSync(file), file);
    assert.ok(statSync(file).size <= 150 * 1024, `${file} is ${statSync(file).size} bytes`);
    const head = readFileSync(file).subarray(0, 24);
    assert.equal(head.readUInt32BE(16), 1200);
    assert.equal(head.readUInt32BE(20), 630);
  }
});
