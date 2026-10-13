// ============================================================
// richtext-silent-finals.test.mjs: a line never starts with "ร์"
// ============================================================
// VetWiki, 5.146.0: Chromium broke "เลกเชอร์" as "เลกเชอ" / "ร์และตำรา",
// because a loanword missing from its Thai dictionary can break before its
// silent final. RichText (and the wiki title and dek) keep the silent final
// with the letter before it, in a span that holds whole clusters only.
// ============================================================

import test from 'node:test';
import assert from 'node:assert/strict';
import { loadModule, textOf } from '../helpers/fake-react.mjs';

const { keepSilentFinals, RichText } = await loadModule('src/lib/richtext.jsx');
const held = (out) => (Array.isArray(out) ? out.filter((p) => typeof p !== 'string').map(textOf) : []);
const MARK = /^\p{M}/u;

test('a silent final is held with the cluster before it', () => {
  assert.deepEqual(held(keepSilentFinals('คำตอบต้องไปหาจากเลกเชอร์และตำรา')), ['ชอร์']);
  assert.deepEqual(held(keepSilentFinals('ศาสตร์และจันทร์')), ['สตร์', 'นทร์']);
  assert.equal(keepSilentFinals('ไม่มีการันต์'.replace('การันต์', 'การันต')), 'ไม่มีการันต', 'text without one comes back as it was');
});

test('the span never starts with a mark cut from its base, and the text is unchanged', () => {
  for (const s of ['สัตว์แพทย์', 'ฮอร์โมนเพศ', 'กษัตริย์', 'เอนไซม์ย่อยอาหาร', 'พันธุ์']) {
    const out = keepSilentFinals(s);
    for (const piece of held(out)) assert.doesNotMatch(piece, MARK, `${s}: "${piece}"`);
    assert.equal((Array.isArray(out) ? out.map((p) => (typeof p === 'string' ? p : textOf(p))) : [out]).join(''), s);
  }
});

test('RichText holds silent finals in its plain text and keeps a search highlight as it was', () => {
  const tree = RichText({ text: 'อ่าน**เลกเชอร์**ก่อน' });
  assert.equal(textOf(tree), 'อ่านเลกเชอร์ก่อน');
  assert.match(JSON.stringify(tree), /"whiteSpace":"nowrap"/);
  assert.doesNotMatch(JSON.stringify(RichText({ text: 'เลกเชอร์', highlight: 'เลก' })), /nowrap/);
});
