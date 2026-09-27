// The homogeneity sentence says which strata the test summed (review round 3, numbers): on the
// serosurvey within-farm route Woolf's test sums only the farms with a positive in both groups, so
// "Woolf, p = 0.37" alone reads as if all farms agreed. And a value judged against a threshold keeps
// its side of it when printed (an expected count of 4.996 is not "5.00").
// OWNER: workspace role.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { buildPreview, answerPreview } from '../../src/lib/intake/preview.js';
import { applyRecipe } from '../../src/lib/intake/recipe.js';
import { runAnalysis } from '../../src/lib/runtime/run.js';
import { DESIGNS } from '../../src/lib/epi/design.js';
import { getMethod } from '../../src/lib/runtime/catalog.js';
import { formatCi, formatNumber, formatP } from '../../src/lib/stats/format.js';
import { questionsOf } from '../../src/workspace/lib/import-questions.js';
import { buildSpec } from '../../src/workspace/lib/method-ui.js';
import { valueCells } from '../../src/workspace/lib/result-model.js';
import { resultParagraphs } from '../../src/workspace/report/build.js';
import { registerArea, translate } from '../../src/i18n/index.js';
import workspace from '../../src/i18n/workspace.js';
import report from '../../src/i18n/report.js';
import epi from '../../src/i18n/epi.js';
import stats from '../../src/i18n/stats.js';
import runtime from '../../src/i18n/runtime.js';
import intake from '../../src/i18n/intake.js';

for (const [area, dict] of Object.entries({ workspace, report, epi, stats, runtime, intake })) registerArea(area, dict);
const FMT = { formatNumber, formatP, formatCi };
const tOf = (lang) => (key, params) => translate(lang, key, params);

async function withinFarm() {
  const bytes = readFileSync(new URL('../fixtures/serosurvey/serosurvey-2569.csv', import.meta.url));
  let pv = await buildPreview(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength), { fileName: 'serosurvey-2569.csv' });
  for (const q of questionsOf(pv).filter((x) => x.waiting)) pv = answerPreview(pv, { [q.questionId]: q.options[0].value });
  const table = applyRecipe(pv.raw, pv.codebook, [pv.importStep]);
  const key = (name) => table.codebook.columns.find((x) => x.name === name).key;
  const env = runAnalysis(buildSpec({
    datasetId: 'ds', recipeRev: table.recipeRev, design: 'cross-sectional', method: 'epi.twoByTwo',
    roles: { outcome: key('ผล ELISA'), exposure: key('วัคซีนใน 6 เดือน') },
    levels: { outcomePositive: 'บวก', exposureLevel: 'ฉีด', referenceLevel: 'ไม่ฉีด' },
    cluster: { route: 'mh-within', column: table.codebook.clusterKey },
  }), table, table.codebook, { steps: [pv.importStep] });
  assert.equal(env.status, 'ok');
  return { env, codebook: table.codebook };
}

test('the Woolf sentence on the within-farm route names the 10 farms it summed out of all strata', async () => {
  const { env, codebook } = await withinFarm();
  const hom = env.tests.find((x) => x.id === 'homogeneity');
  assert.equal(hom.strataIncluded.length, 10);
  const all = env.values.strataUsed.value;
  assert.ok(all > 10, `strataUsed ${all}`);
  const say = (lang) => resultParagraphs(env, { t: tOf(lang), fmt: FMT, lang, codebook, designRow: DESIGNS.find((d) => d.id === 'cross-sectional'), nameKeyOf: (id) => getMethod(id)?.nameKey || null }).results;
  const en = say('en');
  const th = say('th');
  assert.ok(en.includes(`Woolf test over the 10 of ${all} strata with a positive in both groups`), en);
  assert.ok(th.includes(`Woolf test คิดจาก 10 ชั้นที่มีผลบวกในทั้งสองกลุ่ม จากทั้งหมด ${all} ชั้น`), th);
  assert.ok(!en.includes('[') && !th.includes('['), 'no missing keys');
  if (process.env.SAY) console.log(`${en}\n${th}`);
});

test('a value judged against a threshold keeps its side of it when printed', () => {
  const t = tOf('en');
  // Cochran's 5: 4.996 is below it, so it must not print as 5.00 (G5 says "below 5" beside it).
  assert.equal(valueCells({ name: 'minExpected', kind: 'statistic', value: 4.996, below: [1, 5] }, FMT, 'en', t).est, '4.996');
  // Without the threshold the same number rounds to the other side: the check bites.
  assert.notEqual(valueCells({ name: 'minExpected', kind: 'statistic', value: 4.996 }, FMT, 'en', t).est, '4.996');
});
