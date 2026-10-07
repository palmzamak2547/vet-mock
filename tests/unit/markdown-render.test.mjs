// ============================================================
// markdown-render — the reader's escape-first contract
// ============================================================
// The external-doc reader renders markdown fetched from OTHER people's
// servers (Notion, Google), so unlike authored summaries this input is
// hostile: every render must escape HTML FIRST and only then apply the
// markdown subset, and every link target must pass safeLinkUrl. These
// tests pin that order — a refactor that renders raw input before
// escaping fails here, not in a student's browser.
// ============================================================

import test from 'node:test';
import assert from 'node:assert/strict';

import { renderMarkdown, renderInline } from '../../src/lib/markdown-render.js';

test('html in the source never reaches the output as markup', () => {
  const out = renderMarkdown('<script>alert(1)</script>\n\n<img src=x onerror=alert(1)>');
  assert.ok(!out.includes('<script>'), out);
  assert.ok(!out.includes('<img'), out);
  assert.ok(out.includes('&lt;script&gt;'), out);
});

test('inline markup survives: bold, italic, code', () => {
  assert.equal(renderInline('**ตัวหนา**'), '<strong>ตัวหนา</strong>');
  assert.equal(renderInline('*เอียง*'), '<em>เอียง</em>');
  assert.equal(renderInline('`โค้ด`'), '<code class="vmx-md-code">โค้ด</code>');
});

test('links render only when the target is safe, and never carry opener', () => {
  const ok = renderInline('[แหล่งอ้างอิง](https://go.vet/x?a=1&b=2)');
  assert.match(ok, /^<a href="https:\/\/go\.vet\/x\?a=1&(?:amp;)?b=2" target="_blank" rel="noopener noreferrer">/);
  // An unsafe protocol must not become an anchor. (The link regex stops at
  // the first ')', so a ')' may survive as text — the contract is "no <a",
  // which is what SummaryModal's renderer has always honoured.)
  const js = renderInline('[คลิก](javascript:alert(1))');
  assert.ok(!js.includes('<a'), js);
  assert.ok(js.includes('คลิก'), js);
  assert.equal(renderInline('[คลิก](http://insecure.test/)'), 'คลิก');
});

test('block structure: headings, lists, quote, rule, fence', () => {
  const out = renderMarkdown([
    '# หัวใหญ่',
    '## หัวกลาง',
    '- ลิสต์ หนึ่ง',
    '- ลิสต์ สอง',
    '1. ขั้น หนึ่ง',
    '1. ขั้น สอง',
    '> คำพูด',
    '---',
    '```',
    'dose = 5',
    '```',
  ].join('\n'));
  assert.match(out, /<h1 class="vmx-md-h1">หัวใหญ่<\/h1>/);
  assert.match(out, /<h2 class="vmx-md-h2">หัวกลาง<\/h2>/);
  assert.match(out, /<ul class="vmx-md-ul">.*ลิสต์ หนึ่ง.*ลิสต์ สอง.*<\/ul>/s);
  assert.match(out, /<ol class="vmx-md-ol">.*ขั้น หนึ่ง.*ขั้น สอง.*<\/ol>/s);
  assert.match(out, /<blockquote class="vmx-md-quote">คำพูด<\/blockquote>/);
  assert.match(out, /<hr class="vmx-md-hr" \/>/);
  assert.match(out, /<pre class="vmx-md-pre"><code>dose = 5<\/code><\/pre>/);
});

test('a table renders with the shared table classes', () => {
  const out = renderMarkdown([
    '| ชื่อ | ค่า |',
    '| --- | --- |',
    '| สุนัข | 2 |',
  ].join('\n'));
  assert.match(out, /<table class="vmx-md-table"><thead><tr><th>ชื่อ<\/th><th>ค่า<\/th><\/tr><\/thead><tbody><tr><td>สุนัข<\/td><td>2<\/td><\/tr><\/tbody><\/table>/);
});

test('markup inside a fence stays literal text', () => {
  const out = renderMarkdown('```\n**not bold** <b>\n```');
  assert.ok(!out.includes('<strong>'), out);
  assert.ok(!out.includes('<b>'), out);
  assert.match(out, /\*\*not bold\*\*/);
});

test('empty input renders empty, null input renders empty', () => {
  assert.equal(renderMarkdown(''), '');
  assert.equal(renderMarkdown(null), '');
  assert.equal(renderMarkdown(undefined), '');
});
