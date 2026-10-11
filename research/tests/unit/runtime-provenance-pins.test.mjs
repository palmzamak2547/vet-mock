// The provenance line and options panel of every M1 and M2 method are pinned, in both languages
// (tests/fixtures/runtime/provenance-m1-m2.json, captured before the M3a option words were added). M3a gave
// provenance.js words for options no older method carries ("Firth's correction", "Livak method", "4PL"); an
// option of an older method must never read differently because a newer one did. Also: a name two methods share
// (`method`, `test`) never borrows the other's words, which is how a Firth result once read "p-values adjusted by
// firth". OWNER: data role.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { handleRequest } from '../../src/lib/runtime/engine-core.js';
import { noFarm } from './runtime-m1-specs.mjs';
import { allSpecs } from './runtime-area-specs.mjs';
import { registerArea, translate } from '../../src/i18n/index.js';
import { provenanceLines, provenanceOptions, SCOPED_OPTIONS } from '../../src/lib/runtime/provenance.js';
import { METHODS } from '../../src/lib/runtime/catalog.js';
import { DEFAULT_OPTIONS, ALLOWED } from '../../src/lib/runtime/spec.js';

for (const area of ['workspace', 'report', 'intake', 'stats', 'epi', 'runtime', 'lab', 'models', 'measure', 'data', 'graphs', 'tools']) {
  registerArea(area, (await import(`../../src/i18n/${area}.js`)).default);
}
const PINS = JSON.parse(readFileSync(fileURLToPath(new URL('../fixtures/runtime/provenance-m1-m2.json', import.meta.url)), 'utf8')).methods;
const older = new Set(METHODS.filter((m) => m.milestone === 'M1' || m.milestone === 'M2').map((m) => m.id));
const { base, cases } = await allSpecs();

test('the pin covers every M1 and M2 method that has an end-to-end case, and no other', () => {
  const withCase = cases.map((c) => c.spec.method).filter((m) => older.has(m));
  assert.deepEqual(Object.keys(PINS).sort(), [...new Set(withCase)].sort());
});

for (const c of cases.filter((x) => older.has(x.spec.method))) {
  const m = c.spec.method;
  test(`${m}: the provenance line and options panel read as they did before M3a`, async () => {
    const codebook = c.codebook || (c.needsFarm ? base.codebook : noFarm(base.codebook));
    const { result: env } = await handleRequest('run', { spec: c.spec, table: c.spec.input.kind === 'dataset' ? (c.table || base.table) : null, codebook, steps: c.steps || base.steps }, { mode: 'worker' });
    assert.equal(env.status, 'ok');
    for (const lang of ['th', 'en']) {
      const t = (k, p) => translate(lang, k, p);
      assert.equal(provenanceLines(env, lang, t, (k) => k)[0], PINS[m][lang].line, `${lang} line`);
      assert.deepEqual(provenanceOptions(env, t), PINS[m][lang].panel, `${lang} panel`);
    }
  });
}

// ---- the M3a words ---------------------------------------------------------------------------------------------
/** An envelope with only what the provenance reads (a value with an interval, so the line names the level). */
function envFor(methodId, options, extra = {}) {
  return {
    status: 'ok',
    method: { id: methodId },
    spec: { method: methodId, options, input: { kind: 'dataset' }, cluster: { route: null, column: null } },
    values: { estimate: { value: 1, ci: [0, 2], ciLevel: 0.95 } }, tests: [],
    provenance: { methodId, options: { confLevel: 0.95, alternative: 'two.sided', ...options }, engineVersion: 'x', rowsUsed: 10, rowsDropped: [], dataFingerprint: null, validatedAgainst: [] },
    verified: false,
    ...extra,
  };
}
const lineOf = (env, lang) => provenanceLines(env, lang, (k, p) => translate(lang, k, p))[0];

test("Firth's correction is named as such, with the interval it reports, and is not a p-value adjustment", () => {
  const firth = envFor('reg.logistic', { ciMethod: 'profile', method: 'firth' }, { values: { 'b:age': { value: 1, ci: [0, 2], ciLevel: 0.95, ciMethod: 'profile-penalised' } } });
  assert.equal(lineOf(firth, 'en'), "Logistic regression | 95% CI (profile penalised likelihood) | Firth's correction (penalised likelihood)");
  assert.ok(lineOf(firth, 'th').endsWith("| 95% CI (profile penalised likelihood) | Firth's correction (penalised likelihood)"), lineOf(firth, 'th'));
  assert.ok(!/adjust|ปรับค่า p/.test(lineOf(firth, 'en') + lineOf(firth, 'th')));
  const wald = envFor('reg.logistic', { ciMethod: 'wald', method: 'firth' }, { values: { 'b:age': { value: 1, ci: [0, 2], ciLevel: 0.95, ciMethod: 'wald' } } });
  assert.equal(lineOf(wald, 'en'), "Logistic regression | 95% CI (Wald) | Firth's correction (penalised likelihood)");
});

test('maximum likelihood is what a logistic fit is, so the line does not announce it; the panel still lists it', () => {
  const none = envFor('reg.logistic', { ciMethod: 'profile' });
  const ml = envFor('reg.logistic', { ciMethod: 'profile', method: 'ml' });
  assert.equal(lineOf(ml, 'en'), lineOf(none, 'en'));
  assert.equal(lineOf(none, 'en'), 'Logistic regression | 95% CI (profile likelihood)');
  const rows = provenanceOptions(ml, (k, p) => translate('en', k, p));
  assert.deepEqual(rows.find((r) => r[0] === 'Estimation method'), ['Estimation method', 'maximum likelihood']);
});

test('qPCR names its fold-change method, and the two-group test only when a t-test ran', () => {
  const t = envFor('qpcr.relative', { method: 'livak', efficiency: {}, test: 'welch' }, { tests: [{ id: 'tTest' }] });
  assert.equal(lineOf(t, 'en'), 'qPCR relative quantification (2-ΔΔCt) | 95% CI | Livak method | Welch t-test on ΔCt');
  const pf = envFor('qpcr.relative', { method: 'pfaffl', efficiency: { c3: 1.97 }, test: 'pooled' }, { tests: [{ id: 'tTest' }] });
  assert.equal(lineOf(pf, 'en'), 'qPCR relative quantification (2-ΔΔCt) | 95% CI | Pfaffl method (corrected for the amplification efficiency of each gene) | pooled-variance t-test on ΔCt');
  const three = envFor('qpcr.relative', { method: 'livak', efficiency: {}, test: 'welch' }, { tests: [{ id: 'anova' }] });
  assert.equal(lineOf(three, 'en'), 'qPCR relative quantification (2-ΔΔCt) | 95% CI | Livak method', 'three groups run the F test; "test: welch" would be untrue');
  const rows = provenanceOptions(pf, (k, p) => translate('en', k, p));
  assert.deepEqual(rows.find((r) => r[0] === 'Amplification factor of each gene'), ['Amplification factor of each gene', 'c3: 1.97']);
  assert.deepEqual(provenanceOptions(t, (k, p) => translate('en', k, p)).find((r) => r[0] === 'Amplification factor of each gene')[1], 'every gene taken as 2 (doubling each cycle)');
});

test('adjust.pValues keeps its words: it is the only method whose `method` is a p-value adjustment', () => {
  assert.equal(lineOf(envFor('adjust.pValues', { method: 'holm' }), 'en'), 'Adjust p-values for multiple tests | p-values adjusted by Holm');
  const unscoped = METHODS.map((m) => m.id).filter((id) => ALLOWED[id] && 'method' in ALLOWED[id] && !SCOPED_OPTIONS[id]?.method);
  assert.deepEqual(unscoped, ['adjust.pValues'], 'a method with a `method` option needs its own words in provenance.js SCOPED_OPTIONS');
});

test('every scoped option has a label and a phrase for every value it allows, in Thai and English', () => {
  const problems = [];
  for (const [methodId, names] of Object.entries(SCOPED_OPTIONS)) {
    assert.ok(DEFAULT_OPTIONS[methodId], `${methodId} is not a method`);
    for (const [name, slug] of Object.entries(names)) {
      const schema = ALLOWED[methodId][name];
      assert.ok(schema, `${methodId} has no option ${name}`);
      const keys = [`runtime.optName.${slug}`];
      if (schema.type === 'picklist') for (const v of schema.options) keys.push(`runtime.opt.${slug}.${String(v).replace(/[^A-Za-z0-9]+(.)?/g, (_m, ch) => (ch ? ch.toUpperCase() : ''))}`);
      else if (schema.type === 'boolean') keys.push(`runtime.opt.${slug}.on`, `runtime.opt.${slug}.off`);
      else if (schema.type === 'record') keys.push(`runtime.opt.${slug}.empty`);
      else problems.push(`${methodId}.${name}: option type ${schema.type} has no phrase rule`);
      for (const k of keys) for (const lang of ['th', 'en']) if (translate(lang, k) === `[${k}]`) problems.push(`${lang} ${k}`);
    }
  }
  assert.deepEqual(problems, []);
});

test('every scoped option is in the end-to-end case of its method: a default with no phrase would print a bracket', async () => {
  const bracket = /\[[a-zA-Z][\w.:-]*\]/;
  for (const c of cases.filter((x) => SCOPED_OPTIONS[x.spec.method])) {
    const codebook = c.codebook || (c.needsFarm ? base.codebook : noFarm(base.codebook));
    const { result: env } = await handleRequest('run', { spec: c.spec, table: c.spec.input.kind === 'dataset' ? (c.table || base.table) : null, codebook, steps: c.steps || base.steps }, { mode: 'worker' });
    for (const lang of ['th', 'en']) {
      const t = (k, p) => translate(lang, k, p);
      const text = [...provenanceLines(env, lang, t, (k) => k), ...provenanceOptions(env, t).flat()].join(' | ');
      assert.ok(!bracket.test(text), `${c.spec.method} ${lang}: ${text}`);
    }
  }
});
