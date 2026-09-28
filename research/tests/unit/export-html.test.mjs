// The HTML export is one self-contained file: `lang` on the root, inline CSS, inline SVG figures cleaned of
// anything that could run or fetch, and no string a browser could turn into a request (the test scans for
// http, src=, @import and url() as M2-DESIGN.md 6.2 asks). OWNER: report role.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildReportModel } from '../../src/lib/export/report-model.js';
import { buildHtml, inlineSvg } from '../../src/lib/export/html.js';
import { formatNumber } from '../../src/lib/stats/format.js';
import { tOf, sampleAnalyses, CODEBOOK, TABLE, STEPS } from './export-helpers.mjs';

const FIGURE = '<?xml version="1.0"?><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 10 10">'
  + '<script>alert(1)</script><image href="http://evil.example/x.png"/><rect width="10" height="10" onclick="x()" fill="url(http://evil.example/p)"/>'
  + '<a xlink:href="https://evil.example">x</a><use href="#m"/></svg>';

for (const lang of ['th', 'en']) {
  test(`${lang}: one file, no request of any kind`, () => {
    const t = tOf(lang);
    const model = buildReportModel({ project: { name: 'Serosurvey <draft>', design: 'cross-sectional' }, dataset: { codebook: CODEBOOK, table: TABLE, steps: STEPS, rawRows: 4 }, analyses: sampleAnalyses(), log: [], lang, t, figures: [{ analysisId: 'a1', svg: FIGURE, widthMm: 90, caption: 'CI' }], today: '2026-09-28' });
    const html = buildHtml(model, { t, accessedText: '28 Sep 2026 CE' });
    assert.match(html, new RegExp(`^<!doctype html>\\n<html lang="${lang}">`));
    for (const bad of [/http/i, /src=/i, /@import/i, /url\(/i, /<script/i, /<link/i, /<image/i, /onclick/i, /<iframe/i]) assert.ok(!bad.test(html), `found ${bad}`);
    assert.ok(html.includes('<style>'), 'inline CSS');
    assert.equal((html.match(/<svg\b/g) || []).length, 2, 'the flow and the chart are inline SVG');
    assert.ok(html.includes('Serosurvey &lt;draft&gt;'), 'text is escaped');
    assert.ok(html.includes(`<td class="num">${formatNumber(2.1739214756712502, { kind: 'ratio' })}</td>`), 'numbers right-aligned');
    // The address of VetMock Research is still written, as a character reference the page shows as text.
    assert.ok(html.includes('&#104;ttps://research.vetmock.com'));
    assert.ok(!html.includes('[report.') && !html.includes('[ws.'));
  });
}

test('an inlined SVG keeps its drawing and loses scripts, images, events and outside links', () => {
  const out = inlineSvg(FIGURE);
  assert.ok(out.startsWith('<svg viewBox="0 0 10 10">'));
  assert.ok(out.includes('<rect width="10" height="10" fill="none"/>'));
  assert.ok(out.includes('<use href="#m"/>'), 'an internal reference stays');
  for (const bad of ['script', 'image', 'onclick', 'evil', 'xmlns']) assert.ok(!out.includes(bad), bad);
});
