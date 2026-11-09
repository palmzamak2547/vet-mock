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
import { csvToMarkdownTable } from '../../api/_lib/external-doc.js';

// What a browser reads back from the output: the five entities the renderer
// writes, decoded once.
const ENTITY = { '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#039;': "'" };
const decode = (s) => s.replace(/&(?:amp|lt|gt|quot|#039);/g, (e) => ENTITY[e]);
const hrefs = (html) => [...html.matchAll(/<a href="([^"]*)"/g)].map((m) => decode(m[1]));
const tableRows = (html) => [...html.matchAll(/<tr>(.*?)<\/tr>/g)]
  .map((row) => [...row[1].matchAll(/<t[hd]>(.*?)<\/t[hd]>/g)].map((cell) => decode(cell[1])));
// Every tag the renderer writes for paragraphs, lists, tables and links.
// Anything else in the output is markup that came through from the source.
const OWN_TAGS = new Set([
  '<p class="vmx-md-p">', '</p>', '<br/>', '<ul class="vmx-md-ul">', '</ul>', '<li>', '</li>',
  '<table class="vmx-md-table">', '</table>', '<thead>', '</thead>', '<tbody>', '</tbody>',
  '<tr>', '</tr>', '<th>', '</th>', '<td>', '</td>', '<strong>', '</strong>', '<em>', '</em>',
  '<code class="vmx-md-code">', '</code>', '</a>',
]);
const OWN_LINK = /^<a href="[^"<>]*" target="_blank" rel="noopener noreferrer">$/;
const foreignTags = (html) => (html.match(/<[^>]*>/g) || []).filter((tag) => !OWN_TAGS.has(tag) && !OWN_LINK.test(tag));
// The same line as a paragraph, a list item and a table cell.
const everyPlace = (line) => [line, `- ${line}`, `| ${line} | ข้าง |\n| --- | --- |\n| ${line} | ข้าง |`]
  .map((md) => renderMarkdown(md));

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
  // An unsafe protocol must not become an anchor. (A ')' after the target
  // may survive as text — the contract is "no <a", which is what
  // SummaryModal's renderer has always honoured.)
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

test('an escaped pipe stays inside its table cell, without its backslash', () => {
  const out = renderMarkdown([
    '| Drug | Dose \\| route | Note |',
    '| --- | --- | --- |',
    '| Meloxicam | 0.1\\|0.2 mg/kg | PO |',
    '| [ลิงก์](https://ok.example/a\\|b) | `x\\|y` | z |',
  ].join('\n'));
  assert.deepEqual(tableRows(out), [
    ['Drug', 'Dose | route', 'Note'],
    ['Meloxicam', '0.1|0.2 mg/kg', 'PO'],
    ['<a href="https://ok.example/a|b" target="_blank" rel="noopener noreferrer">ลิงก์</a>', '<code class="vmx-md-code">x|y</code>', 'z'],
  ]);
});

test('a sheet cell holding "|" comes back as written, under its own header', () => {
  // The sheet converter writes a literal "|" as "\|" so it cannot end the
  // cell; the renderer has to read it back the same way.
  const md = csvToMarkdownTable('Drug,Dose,Route\nMeloxicam,"0.1|0.2 mg/kg",PO\nPath,"C:\\|x",IV');
  assert.deepEqual(tableRows(renderMarkdown(md)), [
    ['Drug', 'Dose', 'Route'],
    ['Meloxicam', '0.1|0.2 mg/kg', 'PO'],
    ['Path', 'C:\\|x', 'IV'],
  ]);
});

test('a link opens the address it was written with', () => {
  for (const url of [
    "https://en.wikipedia.org/wiki/Cushing's_syndrome",
    'https://en.wikipedia.org/wiki/Mange_(animal)',
    'https://example.org/search?q="feline"',
    'https://example.org/search?q=<x>',
    'https://go.vet/x?a=1&b=2',
    'https://example.org/a&lt;b', // an entity typed as text stays text
  ]) {
    const out = renderInline(`[อ่านต่อ](${url})`);
    assert.deepEqual(hrefs(out), [new URL(url).href], out);
    assert.ok(out.endsWith('</a>'), `nothing of the address is left after the link: ${out}`);
  }
});

test('parentheses around a link stay text, and each link on a line keeps its own address', () => {
  assert.equal(
    renderInline('(ดู [หนึ่ง](https://a.example/1)) และ [สอง](https://b.example/(2))'),
    '(ดู <a href="https://a.example/1" target="_blank" rel="noopener noreferrer">หนึ่ง</a>)'
      + ' และ <a href="https://b.example/(2)" target="_blank" rel="noopener noreferrer">สอง</a>',
  );
  assert.equal(renderInline('[คลิก](javascript:alert(1))'), 'คลิก', 'an unsafe target leaves only its label');
});

test('javascript:, data: and vbscript: targets never become a link, wherever the line sits', () => {
  for (const target of [
    'javascript:alert(1)',
    'JaVaScRiPt:alert(document.cookie)',
    ' javascript:alert(1)',
    'javascript&#58;alert(1)',
    '&#106;avascript:alert(1)',
    'javascript&colon;alert(1)',
    'data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==',
    'data:text/html,<script>alert(1)</script>',
    'vbscript:msgbox(1)',
    'VBScript:MsgBox("x")',
    'http://insecure.test/',
    '//evil.example/x',
    '/\\evil.example/x',
    'https://user:pass@evil.example/',
  ]) {
    for (const out of everyPlace(`[คลิก](${target})`)) {
      assert.ok(!out.includes('<a'), `${target}: ${out}`);
      assert.ok(out.includes('คลิก'), `${target} keeps its label: ${out}`);
      assert.deepEqual(foreignTags(out), [], `${target}: ${out}`);
    }
  }
});

test('raw html stays text, and a link target cannot open an attribute', () => {
  for (const line of [
    '<script>alert(1)</script>',
    '<img src=x onerror=alert(1)>',
    '<a href="javascript:alert(1)">x</a>',
    '<svg onload=alert(1)>',
    '"><img src=x onerror=alert(1)>',
    "'><img src=x onerror=alert(1)>",
    'ก\\|<img src=x onerror=alert(1)>',
    '[<img src=x onerror=alert(1)>](https://ok.example/)',
    '[x](https://ok.example/"onmouseover="alert(1))',
    "[x](https://ok.example/'onmouseover='alert(1))",
    '[x](#"onmouseover="alert(1))',
    '[x](/a"onmouseover="alert(1))',
  ]) {
    for (const out of everyPlace(line)) {
      assert.deepEqual(foreignTags(out), [], `${line}: ${out}`);
      for (const href of hrefs(out)) assert.match(href, /^(https:\/\/|\/(?!\/)|#)/, `${line}: ${out}`);
    }
  }
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
