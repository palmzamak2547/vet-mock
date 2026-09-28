// The analysed-data CSV and the SPSS and R scripts that re-run the report [M2-DESIGN.md 6.3, 6.4]: the CSV
// holds the rows in use without hidden PII, with names both programs accept; each script reads that CSV,
// labels the codebook's levels and reference, writes VetMock Research's numbers as comments, runs the
// matching command per method, claims agreement with R 4.6.0 only for an envelope verified against it,
// and says so when a program has no command. The scripts are text; nothing here runs them. OWNER: report role.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { analysedCsv, scriptColumns, cellText } from '../../src/lib/export/analysed-data.js';
import { buildSps, cmt } from '../../src/lib/export/sps.js';
import { buildRScript } from '../../src/lib/export/rscript.js';
import { envNumbers, matchesR, scriptAnalyses } from '../../src/lib/export/script-common.js';
import { tOf, sampleAnalyses, CODEBOOK, TABLE } from './export-helpers.mjs';

const input = (lang, analyses = sampleAnalyses()) => {
  const data = analysedCsv(TABLE, CODEBOOK, lang);
  return { analyses, codebook: CODEBOOK, csvName: 'sero-analysed-data.csv', lang, t: tOf(lang), columns: data.columns, version: '0.2.0', date: '28 Sep 2026 CE' };
};

test('the analysed CSV: rows in use, codebook order, hidden PII out, blanks for missing, round-trip numbers', () => {
  const { csv, columns, rows } = analysedCsv(TABLE, CODEBOOK, 'en');
  assert.ok(csv.startsWith('﻿'), 'UTF-8 BOM for Excel and read.csv(fileEncoding = "UTF-8-BOM")');
  const lines = csv.slice(1).split('\r\n');
  assert.equal(lines[0], 'animal_id,elisa,vaccine,farm,c6', 'a header that is not a valid name falls back to its key; the phone column is gone');
  assert.equal(rows, 4, 'r4 was excluded by a recipe step');
  assert.deepEqual(lines.slice(1, 5), ['A1,pos,yes,F1,412.5', 'A2,neg,yes,F1,0.30000000000000004', 'A3,pos,no,F2,380', 'A5,,no,F2,0']);
  assert.ok(!csv.includes('081'), 'hidden PII never leaves');
  assert.deepEqual(columns.map((c) => c.type), ['string', 'string', 'string', 'string', 'number']);
  assert.equal(Number(lines[2].split(',')[4]), 0.1 + 0.2, 'shortest text that reads back to the same double');
});

test('names SPSS and R both accept: reserved words and duplicates take the key', () => {
  const cb = { columns: [
    { key: 'c1', name: 'TO', type: 'continuous', levels: [] },
    { key: 'c2', name: 'weight', type: 'continuous', levels: [] },
    { key: 'c3', name: 'Weight', type: 'continuous', levels: [] },
    { key: 'c4', name: '2nd dose', type: 'continuous', levels: [] },
    { key: 'c5', name: 'น้ำหนัก', type: 'continuous', levels: [] },
  ] };
  assert.deepEqual(scriptColumns(cb).map((c) => c.name), ['c1', 'weight', 'c3', 'c4', 'c5']);
});

test('dates are ISO 8601 in the Common Era', () => {
  assert.equal(cellText({ kind: 'date', values: new Float64Array([20724]), missing: new Uint8Array(1) }, 0), '2026-09-28');
});

for (const lang of ['th', 'en']) {
  test(`${lang}: SPSS syntax reads the CSV, labels the data and runs each analysis`, () => {
    const sps = buildSps(input(lang));
    assert.ok(sps.startsWith('﻿*'));
    assert.ok(sps.includes("GET DATA /TYPE=TXT\r\n  /FILE='sero-analysed-data.csv'\r\n  /ENCODING='UTF8'\r\n  /DELIMITERS=\",\"\r\n  /QUALIFIER='\"'\r\n  /ARRANGEMENT=DELIMITED\r\n  /FIRSTCASE=2\r\n  /VARIABLES="));
    assert.ok(sps.includes('    elisa A3\r\n'), 'string width in UTF-8 bytes');
    assert.ok(sps.includes('    c6 F40.0\r\n'));
    assert.ok(sps.includes("/vaccine 'yes' "), 'value labels from the codebook');
    assert.ok(sps.includes('CROSSTABS /TABLES=vaccine BY elisa /STATISTICS=CHISQ RISK /CELLS=COUNT ROW.'));
    assert.ok(sps.includes('CASESTOVARS /ID=animal_id farm /INDEX=vaccine /GROUPBY=VARIABLE.'));
    assert.ok(sps.includes('GLM c6.yes c6.no BY farm /WSFACTOR=time 2 Polynomial /METHOD=SSTYPE(3)'));
    assert.ok(sps.includes('*   PR = 2.17392 [1.4691, 3.2167].'), 'our numbers as comments');
    // Every comment line is a command that ends with a full stop (SPSS ends a comment at a line-final full stop).
    for (const line of sps.split('\r\n').filter((l) => l.startsWith('*'))) assert.ok(line.endsWith('.'), line);
    assert.ok(!sps.includes('[report.'));
  });

  test(`${lang}: the R script reads the CSV with the codebook's levels and runs each analysis`, () => {
    const r = buildRScript(input(lang));
    assert.ok(r.includes('d <- read.csv("sero-analysed-data.csv", fileEncoding = "UTF-8-BOM", na.strings = "", stringsAsFactors = FALSE, check.names = FALSE)'));
    assert.ok(r.includes('d$vaccine <- factor(d$vaccine, levels = c("yes", "no")); d$vaccine <- relevel(d$vaccine, ref = "no")'));
    assert.ok(r.includes('library(epiR)'));
    assert.ok(r.includes('epi.2by2(dat = tab, method = "cross.sectional", conf.level = 0.95)'));
    assert.ok(r.includes('summary(aov(c6 ~ factor(farm) * vaccine + Error(animal_id / vaccine), data = b))'));
    assert.ok(r.includes('anova(fit, X = ~1, test = "Spherical")'));
    const t = tOf(lang);
    const blocks = r.split('\n## ').slice(1);
    assert.equal(blocks.length, 2);
    assert.ok(blocks[0].includes(t('report.script.matched')), 'the 2x2 envelope is verified against r-4.6.0');
    assert.ok(!blocks[1].includes(t('report.script.matched')) && blocks[1].includes(t('report.script.compare')), 'the unverified one asks to compare');
    assert.ok(!r.includes('[report.'));
  });
}

test('the agreement claim needs a verified envelope with the r-4.6.0 family', () => {
  const [a1] = sampleAnalyses();
  assert.equal(matchesR(a1.envelope), true);
  assert.equal(matchesR({ ...a1.envelope, verified: false }), false);
  assert.equal(matchesR({ ...a1.envelope, provenance: { ...a1.envelope.provenance, validatedAgainst: ['serosurvey-numbers'] } }), false);
});

test('an analysis kept twice with the same settings is scripted once; a stopped one is not scripted', () => {
  const [a1, a2] = sampleAnalyses();
  const stopped = { ...a2, id: 'a3', envelope: { ...a2.envelope, status: 'stopped' } };
  assert.deepEqual(scriptAnalyses([a1, { ...a1, id: 'a1b' }, stopped, a2]).map((x) => x.id), ['a1', 'a2']);
});

test('comments carry every value and test, never a rounded-away p', () => {
  const nums = envNumbers(sampleAnalyses()[1].envelope);
  assert.deepEqual(nums, ['epsGG = 0.61', 'epsHF = 0.87', 'group: F = 4.31651, df = 1, 6, p = 0.08301', 'time: F = 134.618, df = 3, 18, p = 1.62e-12', 'groupTime: F = 3.17341, df = 3, 18, p = 0.085']);
  assert.deepEqual(cmt('a. b.'), ['* a. b.']);
});

test('M2 methods: each has its command, or says the program has none', () => {
  const base = sampleAnalyses()[0];
  const mk = (method, roles, extra = {}) => ({ id: method, spec: null, envelope: { ...base.envelope, verified: false, method: { id: method }, spec: { ...base.envelope.spec, method, roles, levels: { outcomePositive: 'pos', referencePositive: 'pos', controlLevel: 'F1' }, options: { confLevel: 0.95 }, ...extra } } });
  const analyses = [
    mk('anova.twoWay', { outcome: 'c6', group: 'c3', factorB: 'c4' }),
    mk('test.friedman', { outcome: 'c6', group: 'c3', subject: 'c1' }),
    mk('posthoc.dunn', { outcome: 'c6', group: 'c4' }),
    mk('posthoc.gamesHowell', { outcome: 'c6', group: 'c4' }),
    mk('posthoc.dunnett', { outcome: 'c6', group: 'c4' }),
    mk('diag.shapiro', { outcome: 'c6', group: 'c4' }),
    mk('diag.brownForsythe', { outcome: 'c6', group: 'c4' }),
    mk('reg.logistic', { outcome: 'c2', covariates: ['c3', 'c6'] }),
    mk('reg.poisson', { outcome: 'c6', covariates: ['c3'] }),
    mk('surv.kaplanMeier', { time: 'c6', event: 'c2', group: 'c3' }),
    mk('roc.delong', { test: 'c6', reference: 'c2' }),
    mk('agree.blandAltman', { raterA: 'c6', raterB: 'c6' }),
    mk('rel.cronbach', { items: ['c6', 'c6'] }),
    mk('power.tTest', {}, { input: { kind: 'params', params: { delta: 1, sd: 1, power: 0.9 } } }),
  ];
  const r = buildRScript(input('en', analyses));
  for (const want of ['drop1(fit, . ~ ., test = "F")  # Type III', 'friedman.test(c6 ~ vaccine | animal_id, data = b)', 'dunn_test <- function', 'games_howell <- function', 'mcp(farm = "Dunnett")', 'shapiro.test(residuals(', 'ave(b$c6, b$farm, FUN = median)', 'family = binomial', 'confint(fit, level = 0.95)', 'family = poisson', 'survfit(Surv(c6, event01) ~ vaccine', 'survdiff(', 'roc(b$elisa == "pos", b$c6, levels = c(FALSE, TRUE), direction = "<")', 'ci.auc(r1, conf.level = 0.95, method = "delong")', 'loa <- bias + c(-1, 1) * 1.96 * s', 'psych::alpha(X)', 'power.t.test(delta = 1, sd = 1, power = 0.9, sig.level = 0.05, type = "two.sample")']) {
    assert.ok(r.includes(want), `R lacks ${want}`);
  }
  assert.ok(r.includes('library(survival)') && r.includes('library(pROC)') && r.includes('library(multcomp)') && r.includes('library(psych)'));
  const sps = buildSps(input('en', analyses));
  for (const want of ['UNIANOVA c6 BY vaccine farm /METHOD=SSTYPE(3)', 'NPAR TESTS /FRIEDMAN=c6.yes c6.no.', 'KRUSKAL_WALLIS(COMPARE=PAIRWISE)', '/POSTHOC=GH', '/POSTHOC=DUNNETT(1)', 'EXAMINE VARIABLES=res_sw /PLOT NPPLOT', '/STATISTICS HOMOGENEITY', "COMPUTE y01 = (elisa = 'pos').", '/CONTRAST (vaccine)=Indicator(1)', 'DISTRIBUTION=POISSON LINK=LOG', 'KM c6 BY vaccine /STATUS=event01(1)', '/COMPARE OVERALL POOLED', 'ROC c6 BY ref01 (1)', 'TESTPOS(LARGE)', 'RELIABILITY /VARIABLES=c6 c6', '/MODEL=ALPHA']) {
    assert.ok(sps.includes(want), `SPSS lacks ${want}`);
  }
  assert.ok(sps.includes(tOf('en')('report.script.spss.noCommand')), 'power in SPSS: said, not guessed');
  assert.ok(sps.includes(tOf('en')('report.script.spss.reference', { column: 'vaccine', level: 'no' })));
});
