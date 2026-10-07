// ============================================================
// External doc reader — the api side contracts
// ============================================================
// Seam 1: normalizeExternalDocUrl — the only door the fetcher opens.
// A user-pasted URL is untrusted input to a serverless fetch: the
// allowlist IS the SSRF boundary, so the tests pin exact hosts, exact
// path shapes, and the bypass attempts (lookalike hosts, credentials,
// non-https, wrong product paths).
// ============================================================

import test from 'node:test';
import assert from 'node:assert/strict';

import {
  normalizeExternalDocUrl,
  csvToMarkdownTable,
  notionBlocksToMarkdown,
} from '../../api/_lib/external-doc.js';

const HEX = 'a1b2c3d4e5f60123456789abcdef0123';
const DASHED = 'a1b2c3d4-e5f6-0123-4567-89abcdef0123';

test('a Google Docs link yields markdown-then-text export URLs', () => {
  const n = normalizeExternalDocUrl('https://docs.google.com/document/d/DOC123/edit?usp=sharing');
  assert.equal(n.provider, 'gdocs');
  assert.equal(n.id, 'DOC123');
  assert.equal(n.exportUrls.length, 2);
  assert.match(n.exportUrls[0], /\/export\?format=md$/);
  assert.match(n.exportUrls[1], /\/export\?format=txt$/);
});

test('a Google Sheets link exports CSV and keeps its sheet gid', () => {
  const n = normalizeExternalDocUrl('https://docs.google.com/spreadsheets/d/SHEET9/edit#gid=42');
  assert.equal(n.provider, 'gsheets');
  assert.equal(n.id, 'SHEET9');
  assert.match(n.exportUrls[0], /\/export\?format=csv&gid=42$/);
  assert.match(n.exportUrls[1], /gviz\/tq\?tqx=out:csv&gid=42$/);
});

test('a Notion page id is the trailing 32 hex characters, dashes stripped', () => {
  const titled = normalizeExternalDocUrl(`https://www.notion.so/Vet-Notes-${DASHED}`);
  assert.equal(titled.provider, 'notion');
  assert.equal(titled.id, HEX);
  const bare = normalizeExternalDocUrl(`https://notion.so/${HEX}`);
  assert.equal(bare.provider, 'notion');
  assert.equal(bare.id, HEX);
  const site = normalizeExternalDocUrl(`https://team.notion.site/Public-page-${HEX}`);
  assert.equal(site.provider, 'notion');
  assert.equal(site.id, HEX);
});

test('lookalike hosts, other products and non-https links are refused', () => {
  for (const raw of [
    'http://docs.google.com/document/d/DOC123/edit',          // not https
    'https://evil-docs.google.com/document/d/DOC123/edit',    // host is not docs.google.com
    'https://docs.google.com.evil.test/document/d/X/edit',    // suffix trick
    'https://docs.google.com/presentation/d/PRE/edit',        // slides are not in scope
    'https://drive.google.com/file/d/FIL123/view',            // binary drive files have a reader already
    'https://user:pass@docs.google.com/document/d/X/edit',    // credentials in URL
    'https://docs.google.com:8443/document/d/X/edit',         // odd port
    `https://notion.site.evil.test/${HEX}`,                   // suffix trick on notion
    'https://notion.so/not-a-hex-page',                       // no page id to ask the api for
    'https://docs.google.com/document/other/DOC/edit',        // missing /d/<id>/
    '', null, undefined, 42, 'just some text',
  ]) {
    assert.equal(normalizeExternalDocUrl(raw), null, JSON.stringify(raw));
  }
});

test('CSV becomes a markdown table the renderer can draw', () => {
  const csv = 'ชื่อ,ค่า\nสุนัข,"มี, ลูกน้ำ"\nแมว,"บรรทัด\nต่อ"';
  const md = csvToMarkdownTable(csv);
  assert.equal(
    md,
    [
      '| ชื่อ | ค่า |',
      '| --- | --- |',
      '| สุนัข | มี, ลูกน้ำ |',
      '| แมว | บรรทัด ต่อ |',
    ].join('\n'),
  );
});

test('CSV cells cannot break out of the table and the table cannot grow forever', () => {
  // A pipe in a cell would close it early and leak markup into the row.
  assert.match(csvToMarkdownTable('a,b\n"x|y",2'), /x\\|y/);
  const many = ['h1,h2', ...Array.from({ length: 500 }, (_, i) => `r${i},x`)].join('\n');
  const rows = csvToMarkdownTable(many, { maxRows: 50 }).split('\n').length;
  assert.ok(rows <= 52, `expected the clamp to hold, got ${rows} lines`);
  const wide = csvToMarkdownTable('h,' + Array.from({ length: 40 }, (_, i) => `c${i}`).join(','));
  assert.equal(wide.split('\n')[0].split('|').length, 21 + 1, 'maxCols=20 + the leading split artifact');
});

test('Notion blocks flatten to the markdown the reader already speaks', () => {
  const blocks = [
    { type: 'heading_1', heading_1: { rich_text: [{ plain_text: 'วินิจฉัย' }] } },
    { type: 'paragraph', paragraph: { rich_text: [{ plain_text: 'พิจารณา ' }, { plain_text: 'ยืนยัน', annotations: { bold: true } }] } },
    { type: 'bulleted_list_item', bulleted_list_item: { rich_text: [{ plain_text: 'ข้อ หนึ่ง' }] } },
    { type: 'numbered_list_item', numbered_list_item: { rich_text: [{ plain_text: 'ขั้น หนึ่ง' }] } },
    { type: 'to_do', to_do: { rich_text: [{ plain_text: 'ทำแล้ว' }], checked: true } },
    { type: 'quote', quote: { rich_text: [{ plain_text: 'คำพูดอาจารย์' }] } },
    { type: 'code', code: { rich_text: [{ plain_text: 'dose = 5' }] } },
    { type: 'divider', divider: {} },
  ];
  assert.equal(
    notionBlocksToMarkdown(blocks),
    [
      '# วินิจฉัย',
      'พิจารณา **ยืนยัน**',
      '- ข้อ หนึ่ง',
      '1. ขั้น หนึ่ง',
      '- [x] ทำแล้ว',
      '> คำพูดอาจารย์',
      '```\ndose = 5\n```',
      '---',
    ].join('\n'),
  );
});

test('Notion rich text keeps links and escapes nothing — escaping is the job of the renderer', () => {
  const blocks = [
    { type: 'paragraph', paragraph: { rich_text: [{ plain_text: 'อ่านเพิ่ม', href: 'https://go.vet/x' }] } },
  ];
  assert.equal(notionBlocksToMarkdown(blocks), '[อ่านเพิ่ม](https://go.vet/x)');
});

// ── /api/fetch-external-doc — the real handler, fetch stubbed ────────

import handler from '../../api/fetch-external-doc.js';
import { isAllowedUpstreamHost } from '../../api/_lib/external-doc.js';

function fakeRes() {
  const res = {
    statusCode: 200, headers: {}, body: undefined,
    setHeader(k, v) { res.headers[k.toLowerCase()] = v; },
    status(c) { res.statusCode = c; return res; },
    json(b) { res.body = b; return res; },
    end() { return res; },
  };
  return res;
}

async function withFetch(stub, fn) {
  const real = globalThis.fetch;
  globalThis.fetch = stub;
  try { return await fn(); } finally { globalThis.fetch = real; }
}

const req = (body, method = 'POST') => ({
  method,
  headers: { host: 'vetmock.test' },
  socket: { remoteAddress: `10.0.0.${Math.floor(Math.random() * 250)}` },
  ...(method === 'POST' ? { body } : {}),
});

test('the upstream redirect target stays inside the allowlist', () => {
  assert.equal(isAllowedUpstreamHost('docs.google.com'), true);
  assert.equal(isAllowedUpstreamHost('www.notion.so'), true);
  assert.equal(isAllowedUpstreamHost('team.notion.site'), true);
  assert.equal(isAllowedUpstreamHost('evil.test'), false);
  assert.equal(isAllowedUpstreamHost('docs.google.com.evil.test'), false);
});

test('only same-origin POST with a supported link gets through the door', async () => {
  const res405 = fakeRes();
  await handler(req({}, 'GET'), res405);
  assert.equal(res405.statusCode, 405);

  const resNoUrl = fakeRes();
  await handler(req({}), resNoUrl);
  assert.equal(resNoUrl.statusCode, 400);

  const resBad = fakeRes();
  await handler(req({ url: 'https://evil.test/page' }), resBad);
  assert.equal(resBad.statusCode, 400);
  assert.equal(resBad.body.reason, 'unsupported_link');
});

test('a public Google Doc comes back as markdown in one fetch', async () => {
  const calls = [];
  const res = fakeRes();
  await withFetch(async (url) => {
    calls.push(String(url));
    return { ok: true, status: 200, url: String(url), text: async () => '# หัวข้อ\nเนื้อหา' };
  }, () => handler(req({ url: 'https://docs.google.com/document/d/DOC123/edit' }), res));
  assert.equal(res.statusCode, 200, JSON.stringify(res.body));
  assert.equal(res.body.provider, 'gdocs');
  assert.equal(res.body.markdown, '# หัวข้อ\nเนื้อหา');
  assert.equal(calls.length, 1);
  assert.match(calls[0], /format=md$/);
});

test('a private-looking markdown export falls back to the text export', async () => {
  const calls = [];
  const res = fakeRes();
  await withFetch(async (url) => {
    calls.push(String(url));
    const isMd = /format=md$/.test(String(url));
    return {
      ok: true, status: 200, url: String(url),
      text: async () => (isMd ? '<!DOCTYPE html><html><body>Sign in</body></html>' : 'บรรทัดเดียว'),
    };
  }, () => handler(req({ url: 'https://docs.google.com/document/d/DOC123/edit' }), res));
  assert.equal(res.statusCode, 200);
  assert.equal(res.body.markdown, 'บรรทัดเดียว');
  assert.equal(calls.length, 2);
});

test('a doc that is not shared publicly is a 422 the client can explain', async () => {
  const res = fakeRes();
  await withFetch(async (url) => ({
    ok: true, status: 200, url: String(url),
    text: async () => '<!DOCTYPE html><html><body>Sign in required</body></html>',
  }), () => handler(req({ url: 'https://docs.google.com/document/d/PRIVATE/edit' }), res));
  assert.equal(res.statusCode, 422);
  assert.equal(res.body.reason, 'not_public');
});

test('a redirect that leaves the allowlist never gets read', async () => {
  const res = fakeRes();
  await withFetch(async () => ({
    ok: true, status: 200, url: 'https://evil.test/stolen',
    text: async () => 'secret',
  }), () => handler(req({ url: 'https://docs.google.com/document/d/DOC123/edit' }), res));
  assert.equal(res.statusCode, 422);
  assert.equal(res.body.reason, 'not_public');
});

test('a document larger than the cap is refused, not truncated silently', async () => {
  const res = fakeRes();
  await withFetch(async (url) => ({
    ok: true, status: 200, url: String(url),
    text: async () => 'a'.repeat(200_001),
  }), () => handler(req({ url: 'https://docs.google.com/document/d/BIG/edit' }), res));
  assert.equal(res.statusCode, 413);
  assert.equal(res.body.reason, 'too_large');
});

test('Notion without a configured token degrades as not configured', async () => {
  delete process.env.NOTION_TOKEN;
  const res = fakeRes();
  await handler(req({ url: `https://notion.so/${'a'.repeat(32)}` }), res);
  assert.equal(res.statusCode, 503);
  assert.equal(res.body.reason, 'not_configured');
});

test('Notion reads blocks through the token and titles the page when it can', async () => {
  process.env.NOTION_TOKEN = 'test-token';
  const calls = [];
  const res = fakeRes();
  await withFetch(async (url) => {
    calls.push(String(url));
    if (String(url).includes('/pages/')) {
      return { ok: true, status: 200, url: String(url), json: async () => ({ properties: { p: { type: 'title', title: [{ plain_text: 'หน้าตัวอย่าง' }] } } }) };
    }
    return {
      ok: true, status: 200, url: String(url),
      json: async () => ({
        results: [{ type: 'heading_1', heading_1: { rich_text: [{ plain_text: 'ส่วนหัว' }] } }],
        next_cursor: null,
      }),
    };
  }, () => handler(req({ url: `https://www.notion.so/Page-${'a1b2c3d4-e5f6-0123-4567-89abcdef0123'}` }), res));
  assert.equal(res.statusCode, 200, JSON.stringify(res.body));
  assert.equal(res.body.provider, 'notion');
  assert.equal(res.body.title, 'หน้าตัวอย่าง');
  assert.match(res.body.markdown, /# ส่วนหัว/);
  assert.ok(calls.some((c) => c.includes('/blocks/')), 'blocks endpoint was called');
  assert.ok(calls.every((c) => !c.startsWith('https://evil')), 'no call left the allowlist');
  delete process.env.NOTION_TOKEN;
});

test('a Notion page that was never shared with the integration says so', async () => {
  process.env.NOTION_TOKEN = 'test-token';
  const res = fakeRes();
  await withFetch(async (url) => ({ ok: false, status: 404, url: String(url) }), () =>
    handler(req({ url: `https://notion.so/${'a'.repeat(32)}` }), res));
  assert.equal(res.statusCode, 422);
  assert.equal(res.body.reason, 'not_public');
  delete process.env.NOTION_TOKEN;
});

test('the Notion markdown endpoint answers directly without the block walk', async () => {
  process.env.NOTION_TOKEN = 'test-token';
  const calls = [];
  const res = fakeRes();
  await withFetch(async (url) => {
    calls.push(String(url));
    if (String(url).endsWith('/markdown')) {
      return { ok: true, status: 200, url: String(url), text: async () => '# เพจสาธารณะ\nเนื้อหาจาก endpoint' };
    }
    if (String(url).includes('/pages/')) {
      return { ok: true, status: 200, url: String(url), json: async () => ({ properties: { p: { type: 'title', title: [{ plain_text: 'ชื่อเพจ' }] } } }) };
    }
    throw new Error(`unexpected call ${url}`);
  }, () => handler(req({ url: `https://notion.so/${'f'.repeat(32)}` }), res));
  assert.equal(res.statusCode, 200, JSON.stringify(res.body));
  assert.equal(res.body.markdown, '# เพจสาธารณะ\nเนื้อหาจาก endpoint');
  assert.equal(res.body.title, 'ชื่อเพจ');
  assert.ok(!calls.some((c) => c.includes('/blocks/')), 'the block walk must not run when markdown answered');
  delete process.env.NOTION_TOKEN;
});
