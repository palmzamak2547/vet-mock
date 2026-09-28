// The Word export is checked by opening the file it writes: unzip with fflate, every part declared in
// [Content_Types].xml, every XML part well formed under a strict parser, every result table a real w:tbl
// whose header row repeats and whose cells are the envelope's numbers through the stats formatter, figures
// sized width mm x 36000 EMU with a PNG that declares 300 dpi (11811 px/m), and Thai in the complex-script
// slot with a named fallback [M2-DESIGN.md 6.1]. The parser and the cell check are shown to fail on a
// broken part and on a changed number. OWNER: report role.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { unzipSync, strFromU8, strToU8, zipSync } from 'fflate';
import { buildReportModel } from '../../src/lib/export/report-model.js';
import { buildDocx, EMU_PER_MM, MAX_FIGURE_MM, THAI_FONT, FALLBACK_FONT } from '../../src/lib/export/docx.js';
import { readPngDpi } from '../../src/lib/export/png.js';
import { formatNumber, formatCi } from '../../src/lib/stats/format.js';
import { tOf, parseXml, findAll, textOf, makePng, sampleAnalyses, CODEBOOK, TABLE, STEPS } from './export-helpers.mjs';

const TODAY = '2026-09-28';

async function build(lang, figures = []) {
  const t = tOf(lang);
  const model = buildReportModel({ project: { name: 'Serosurvey', design: 'cross-sectional' }, dataset: { codebook: CODEBOOK, table: TABLE, steps: STEPS, rawRows: 4 }, analyses: sampleAnalyses(), log: [], lang, t, figures, today: TODAY });
  const calls = [];
  const bytes = await buildDocx(model, {
    t,
    today: TODAY,
    rasterize: async (svg, widthMm, dpi) => { calls.push({ widthMm, dpi }); return makePng(Math.round((widthMm / 25.4) * dpi), 400); },
  });
  return { model, bytes, calls, files: unzipSync(bytes) };
}

/** Every part must be covered by a Default (extension) or an Override (part name). */
function undeclared(files) {
  const types = parseXml(strFromU8(files['[Content_Types].xml']));
  const defaults = new Set(findAll(types, 'Default').map((d) => d.attrs.Extension.toLowerCase()));
  const overrides = new Set(findAll(types, 'Override').map((d) => d.attrs.PartName));
  return Object.keys(files).filter((p) => p !== '[Content_Types].xml' && !overrides.has(`/${p}`) && !defaults.has(p.split('.').pop().toLowerCase()));
}

/** The text of each cell of each w:tbl, table by table. */
function tablesOf(docXml) {
  const doc = parseXml(docXml);
  return findAll(doc, 'w:tbl').map((tbl) => findAll(tbl, 'w:tr').map((tr) => findAll(tr, 'w:tc').map((tc) => findAll(tc, 'w:t').map(textOf).join(''))));
}

for (const lang of ['th', 'en']) {
  test(`${lang}: every part is declared and every XML part is well formed`, async () => {
    const { files } = await build(lang);
    for (const need of ['[Content_Types].xml', '_rels/.rels', 'word/document.xml', 'word/styles.xml', 'word/settings.xml', 'word/_rels/document.xml.rels', 'docProps/core.xml', 'docProps/app.xml']) assert.ok(files[need], `missing ${need}`);
    assert.deepEqual(undeclared(files), []);
    for (const [name, bytes] of Object.entries(files)) if (/\.(xml|rels)$/.test(name)) assert.doesNotThrow(() => parseXml(strFromU8(bytes)), name);
    // Every relationship target of the document exists in the package.
    const rels = parseXml(strFromU8(files['word/_rels/document.xml.rels']));
    for (const r of findAll(rels, 'Relationship')) assert.ok(files[`word/${r.attrs.Target}`], `missing target ${r.attrs.Target}`);
  });

  test(`${lang}: result tables are real Word tables holding the envelope's formatted numbers`, async () => {
    const { files } = await build(lang);
    const docXml = strFromU8(files['word/document.xml']);
    const tables = tablesOf(docXml);
    assert.equal(tables.length, 3, 'the 2x2 values, its counts, the repeated-measures ANOVA');
    const env = sampleAnalyses()[0].envelope;
    const pr = env.values.PR;
    const bounds = formatCi({ value: pr.value, ci: pr.ci, kind: 'ratio' }, lang).replace(/^.*?\(/, '').replace(/\)$/, '');
    const row = tables[0].find((r) => r[0].includes('(PR)'));
    assert.ok(row, 'a PR row');
    assert.equal(row[1], formatNumber(pr.value, { kind: 'ratio' }));
    assert.equal(row[2], bounds);
    const counts = tables[1];
    assert.deepEqual(counts.slice(1).map((r) => r.slice(1)), [['30', '70', '100'], ['12', '88', '100']]);
    // The header row is marked to repeat on each page; numbers are right-aligned in tabular figures.
    const doc = parseXml(docXml);
    for (const tbl of findAll(doc, 'w:tbl')) {
      const first = findAll(tbl, 'w:tr')[0];
      assert.equal(findAll(first, 'w:tblHeader').length, 1);
    }
    assert.match(docXml, /<w:jc w:val="right"\/><\/w:pPr><w:r><w:rPr><w14:numSpacing w14:val="tabular"\/><\/w:rPr><w:t xml:space="preserve">2\.17</);
  });

  test(`${lang}: figures are 300 dpi PNGs sized width mm x 36000 EMU`, async () => {
    const svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 50"><rect width="100" height="50"/></svg>';
    const { files, calls } = await build(lang, [{ analysisId: 'a1', svg, widthMm: 90, caption: 'CI plot' }]);
    assert.deepEqual(calls.map((c) => c.dpi), [300, 300]);
    const widths = calls.map((c) => c.widthMm);
    assert.deepEqual(widths, [MAX_FIGURE_MM, 90], 'the flow is held to the text width, the chart keeps its 90 mm');
    const doc = parseXml(strFromU8(files['word/document.xml']));
    const extents = findAll(doc, 'wp:extent').map((e) => Number(e.attrs.cx));
    assert.deepEqual(extents, widths.map((w) => Math.round(w * EMU_PER_MM)));
    const pngs = Object.keys(files).filter((k) => k.startsWith('word/media/'));
    assert.equal(pngs.length, 2);
    for (const k of pngs) {
      assert.equal(readPngDpi(files[k]), 300);
      const v = new DataView(files[k].buffer, files[k].byteOffset);
      let off = 8;
      let ppm = null;
      while (off < files[k].length) {
        const len = v.getUint32(off);
        const type = String.fromCharCode(...files[k].subarray(off + 4, off + 8));
        if (type === 'pHYs') ppm = v.getUint32(off + 8);
        off += 12 + len;
      }
      assert.equal(ppm, 11811, 'pHYs says 11811 pixels per metre');
    }
  });

  test(`${lang}: Thai sits in the complex-script slot with TH Sarabun New 16 pt and a named fallback`, async () => {
    const { files } = await build(lang);
    const styles = parseXml(strFromU8(files['word/styles.xml']));
    const fonts = findAll(styles, 'w:rFonts')[0];
    assert.equal(fonts.attrs['w:cs'], THAI_FONT);
    assert.equal(fonts.attrs['w:ascii'], lang === 'th' ? THAI_FONT : 'Calibri');
    assert.equal(findAll(styles, 'w:szCs')[0].attrs['w:val'], '32', '16 pt');
    assert.equal(findAll(styles, 'w:lang')[0].attrs['w:bidi'], 'th-TH');
    const table = parseXml(strFromU8(files['word/fontTable.xml']));
    const sarabun = findAll(table, 'w:font').find((f) => f.attrs['w:name'] === THAI_FONT);
    assert.equal(findAll(sarabun, 'w:altName')[0].attrs['w:val'], FALLBACK_FONT);
    assert.equal(findAll(sarabun, 'w:charset')[0].attrs['w:val'], 'DE');
  });

  test(`${lang}: the methods and results paragraphs are in the chosen language, with the references`, async () => {
    const { files, model } = await build(lang);
    const text = textOf(parseXml(strFromU8(files['word/document.xml'])));
    const t = tOf(lang);
    assert.ok(text.includes(t('report.doc.methods')) && text.includes(t('report.doc.results')));
    assert.ok(!text.includes('[report.') && !text.includes('[ws.'), 'no missing dictionary key');
    const thaiLetters = (text.match(/[฀-๿]/g) || []).length;
    if (lang === 'th') assert.ok(thaiLetters > 200);
    // English still carries the Thai the data were written in (none in this sample's English labels).
    if (lang === 'en') assert.ok(thaiLetters < 20, `${thaiLetters} Thai letters in the English file`);
    assert.ok(text.includes('doi:10.1007/BF02289823'), 'Greenhouse-Geisser is cited for the repeated-measures ANOVA');
    assert.ok(text.includes('VetMock Research'), 'the software is cited');
    assert.ok(!/doi:10\.\d+\/vetmock/i.test(text), 'no DOI for VetMock Research while none exists');
    assert.equal(model.left.length, 0);
  });
}

test('the same model gives the same bytes (a fixed zip time, no clock inside the file)', async () => {
  const a = await build('th');
  const b = await build('th');
  assert.deepEqual(a.bytes, b.bytes);
});

test('the strict parser and the cell check catch a broken part and a changed number', async () => {
  const { files } = await build('en');
  const docXml = strFromU8(files['word/document.xml']);
  assert.throws(() => parseXml(docXml.replace('</w:body>', '')), /xml/);
  assert.throws(() => parseXml(docXml.replace('<w:body>', '<w:body a="1" a="2">')), /duplicate attribute/);
  assert.throws(() => parseXml('<a>x & y</a>'), /bad entity/);
  // A wrong number in the file is seen by the same comparison the test above makes.
  const tampered = docXml.replace('>2.17<', '>2.18<');
  const row = tablesOf(tampered)[0].find((r) => r[0].includes('(PR)'));
  assert.notEqual(row[1], formatNumber(sampleAnalyses()[0].envelope.values.PR.value, { kind: 'ratio' }));
  // An undeclared part is reported.
  const extra = unzipSync(zipSync({ ...Object.fromEntries(Object.entries(files).map(([k, v]) => [k, v])), 'word/extra.bin': strToU8('x') }));
  assert.deepEqual(undeclared(extra), ['word/extra.bin']);
});

test('a figure the rasterizer cannot draw is said so in place, never dropped', async () => {
  const t = tOf('en');
  const model = buildReportModel({ project: { name: 'P' }, dataset: { codebook: CODEBOOK, table: TABLE, steps: STEPS, rawRows: 4 }, analyses: sampleAnalyses(), log: [], lang: 'en', t, today: TODAY });
  const bytes = await buildDocx(model, { t, today: TODAY, rasterize: async () => { throw new Error('no canvas'); } });
  const files = unzipSync(bytes);
  const text = textOf(parseXml(strFromU8(files['word/document.xml'])));
  assert.ok(text.includes(t('report.docx.figureFailed')));
  assert.ok(text.includes(t('report.doc.flowTitle')));
  assert.equal(Object.keys(files).filter((k) => k.startsWith('word/media/')).length, 0);
});
