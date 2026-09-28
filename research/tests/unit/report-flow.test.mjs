// The STROBE-Vet participant flow (item 13) from the recipe and the provenance: counts come from what the
// replay removed (the working table's `excluded` map), exclusions keep their category and written reason,
// a filter is a subset and not an exclusion, each kept analysis branches with its own missing drops, an
// unknown count is null (drawn "—", never 0), and the flow marks items 13, 12(c) and 14(b) [M2-DESIGN.md
// 4.7]. The drawing is a standalone SVG that parses as XML. OWNER: report role.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { strobeFlow, flowSvg, flowComplete, wrapText } from '../../src/workspace/report/flow.js';
import { strobeStatus } from '../../src/workspace/report/strobe.js';
import { tOf, parseXml, findAll, textOf, sampleAnalyses, CODEBOOK } from './export-helpers.mjs';

const steps = [
  { id: 's1', seq: 1, kind: 'import-conversions', params: {} },
  { id: 's2', seq: 2, kind: 'row-exclude', params: { rowId: 'r2', category: 'duplicate' }, reason: 'typed twice' },
  { id: 's3', seq: 3, kind: 'exclude-where', params: { conditions: [], combine: 'and', category: 'ineligible' }, reason: 'calves under 6 months' },
  { id: 's4', seq: 4, kind: 'filter', params: { conditions: [], combine: 'and' }, reason: 'Nakhon Pathom only' },
  { id: 's5', seq: 5, kind: 'row-add', params: { rowId: 'r11', values: {} } },
];
const excluded = { r2: 's2', r3: 's3', r4: 's3', r5: 's3', r6: 's4', r7: 's4' };

test('counts from the replay, exclusions by category with their reasons, a filter kept apart', () => {
  const flow = strobeFlow({ rawRows: 10, steps, analyses: sampleAnalyses(), codebook: CODEBOOK, excluded });
  const box = (id) => flow.boxes.find((b) => b.id === id);
  assert.equal(box('imported').count, 10);
  assert.equal(box('added').count, 1);
  assert.equal(box('excluded').count, 4);
  assert.deepEqual(box('excluded').params.byCategory, [{ category: 'ineligible', count: 3 }, { category: 'duplicate', count: 1 }]);
  assert.deepEqual(flow.exclusions, [
    { stepId: 's2', category: 'duplicate', reason: 'typed twice', count: 1 },
    { stepId: 's3', category: 'ineligible', reason: 'calves under 6 months', count: 3 },
  ]);
  assert.equal(box('included').count, 7, '10 imported + 1 added - 4 excluded');
  assert.equal(box('filtered').count, 2);
  assert.equal(box('inScope').count, 5);
  const a = flow.boxes.filter((b) => b.id.startsWith('analysis.'));
  assert.deepEqual(a.map((b) => [b.id, b.count, b.params.missing]), [['analysis.a1', 3, 1], ['analysis.a2', 3, 1]]);
  assert.deepEqual(a[0].params.missingByColumn, [{ column: 'c2', reason: 'missing', count: 1 }]);
  assert.equal(flowComplete(flow), true);
});

test('a count the recipe cannot give is null, never 0, and the totals after it are null', () => {
  const flow = strobeFlow({ rawRows: 10, steps, analyses: [], codebook: null });
  const box = (id) => flow.boxes.find((b) => b.id === id);
  assert.equal(flow.exclusions.find((e) => e.stepId === 's3').count, null, 'exclude-where without the table');
  assert.equal(box('excluded').count, null);
  assert.equal(box('included').count, null);
  assert.equal(flowComplete(flow), false, 'no analysis yet');
  const svg = flowSvg(flow, { t: tOf('en'), methodName: (id) => id });
  assert.ok(svg.text.some((l) => l.includes('— rows excluded')));
});

test('an analysis on farm rows says farms and the animals behind them; typed-parameter results stay out', () => {
  const [a1] = sampleAnalyses();
  const agg = { ...a1, id: 'agg', envelope: { ...a1.envelope, provenance: { ...a1.envelope.provenance, rowsUsed: 49, rowsDropped: [{ reason: 'aggregated', column: null, count: 679 }] } } };
  const params = { id: 'ss', envelope: { status: 'ok', spec: { method: 'ss.proportion', input: { kind: 'params', params: {} } }, provenance: { rowsUsed: 0, rowsDropped: [] } } };
  const flow = strobeFlow({ rawRows: 728, steps: [], analyses: [agg, params], codebook: CODEBOOK, excluded: {} });
  const a = flow.boxes.filter((b) => b.id.startsWith('analysis.'));
  assert.equal(a.length, 1);
  assert.equal(a[0].labelKey, 'report.flow.analysedFarms');
  assert.equal(a[0].params.animals, 728);
  assert.equal(tOf('en')(a[0].labelKey, { n: 49, method: '2x2 table', animals: 728 }), '49 farms used in 2x2 table (from 728 animals)');
});

for (const lang of ['th', 'en']) {
  test(`${lang}: the drawing is a standalone SVG with every box and reason`, () => {
    const t = tOf(lang);
    const flow = strobeFlow({ rawRows: 10, steps, analyses: sampleAnalyses(), codebook: CODEBOOK, excluded });
    const { svg, width, height, text } = flowSvg(flow, { t, methodName: (id) => id });
    const root = parseXml(svg);
    assert.equal(root.name, 'svg');
    assert.equal(root.attrs.viewBox, `0 0 ${width} ${height}`);
    assert.ok(!/<(script|image|foreignObject)/.test(svg) && !/href=/.test(svg));
    const drawn = findAll(root, 'text').map(textOf).join(' ');
    assert.ok(drawn.includes('typed twice') && drawn.includes('calves under 6 months') && drawn.includes('Nakhon Pathom only'));
    assert.ok(!drawn.includes('[report.'));
    assert.equal(findAll(root, 'rect').length, 1 + flow.boxes.length, 'a background and one box per stage');
    assert.equal(text.length, flow.boxes.length);
  });
}

test('Thai text wraps at word boundaries, never inside a word', () => {
  const lines = wrapText('ตัดออกจากการศึกษาเพราะวัดผิดพลาดซ้ำสองครั้ง', 12);
  assert.ok(lines.length > 1);
  assert.equal(lines.join(''), 'ตัดออกจากการศึกษาเพราะวัดผิดพลาดซ้ำสองครั้ง');
  for (const l of lines) assert.ok(!/^[ัิ-ฺ็-๎]/.test(l), `a line starts with a combining mark: ${l}`);
});

test('the flow marks STROBE-Vet items 13, 12(c) and 14(b)', () => {
  const none = strobeStatus({ analyses: [], steps: [], codebook: CODEBOOK, flow: strobeFlow({ rawRows: 10, steps: [], analyses: [], codebook: CODEBOOK, excluded: {} }) });
  assert.equal(none.find((s) => s.item === '13').ok, false);
  const flow = strobeFlow({ rawRows: 10, steps, analyses: sampleAnalyses(), codebook: CODEBOOK, excluded });
  const s = strobeStatus({ analyses: sampleAnalyses(), steps, codebook: CODEBOOK, flow });
  assert.equal(s.find((x) => x.item === '13').ok, true);
  assert.equal(s.find((x) => x.item === '12(c)').ok, true);
  const b = s.find((x) => x.item === '14(b)');
  assert.deepEqual([b.key, b.ok, b.ns], ['missingPerVariableFlow', true, 'report']);
  // Without a flow and without a farm column: no farm route rows, and item 13 lists no farms (review round 3;
  // the workspace i18n coverage test reads these keys).
  assert.deepEqual(strobeStatus({ analyses: [], steps: [], codebook: null }).map((x) => x.key), ['clusteringNoFarm', 'missing', 'flowNoFarm', 'missingPerVariable', 'crudeAdjusted', 'cutpointsNone']);
});
