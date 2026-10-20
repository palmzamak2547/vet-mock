// The public pages [M2-DESIGN.md 11]: /methods is built only from the catalogue, verified.generated.js and
// fixtures.generated.js (which must be current), the fixture facts are read from the files and never
// guessed, every word the pages show exists in both languages, the guide covers the workflows and the
// guardrails the design names, and the citation record matches the running engine. OWNER: trust role.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { collect, describe, readDates, renderFixtures } from '../../scripts/regen-verified.mjs';
import { FIXTURES } from '../../src/lib/runtime/fixtures.generated.js';
import { getCatalog, METHODS } from '../../src/lib/runtime/catalog.js';
import { REGISTERED } from '../../src/lib/runtime/registered.js';
import { ENGINE_VERSION } from '../../src/lib/runtime/protocol.js';
import { EXAMPLES } from '../../src/data/examples.js';
import { RELEASES, currentRelease, softwareReference } from '../../src/data/cite.js';
import { GUIDE, buildMethodsModel, formatDate, eraYear, guideKeys, guidePageFromHash, toleranceWords } from '../../src/pages/model.js';
import trust from '../../src/i18n/trust.js';

const here = (p) => fileURLToPath(new URL(p, import.meta.url));
// Fixture paths are joined, not written out, so this test does not count as a test that reads them
// (scripts/regen-verified.mjs looks for the literal path in test sources).
const fx = (...parts) => parts.join('/');

test('fixtures.generated.js is current (run node scripts/regen-verified.mjs)', () => {
  const current = readFileSync(here('../../src/lib/runtime/fixtures.generated.js'), 'utf8').replace(/\r\n/g, '\n');
  const { declarations } = collect({ fixturesDir: here('../fixtures'), unitDir: here('.') });
  assert.equal(current, renderFixtures(declarations, readDates(current)));
});

test('a fixture whose text changed loses its pass date until its tests run again', () => {
  const { declarations } = collect({ fixturesDir: here('../fixtures'), unitDir: here('.') });
  const d = declarations.find((x) => x.file === fx('r', 'out', 'anova.json'));
  assert.ok(d && d.referenced);
  const dates = { [fx('r', 'out', 'anova.json')]: { sha: d.sha, lastPassed: '2026-09-28' } };
  assert.match(renderFixtures([d], dates), /"lastPassed": "2026-09-28"/);
  const changed = { ...d, sha: '0000000000000000' };
  assert.match(renderFixtures([changed], dates), /"lastPassed": null/);
});

test('fixture facts are read from the files: R versions, packages, tolerances, NIST digits, the course commit', () => {
  const r = describe(JSON.parse(readFileSync(here(`../fixtures/${fx('r', 'out', 'samplesize.json')}`), 'utf8')));
  assert.equal(r.source.r, 'R version 4.6.0 (2026-04-24)');
  assert.equal(r.source.webR, '0.6.0');
  assert.deepEqual(r.source.packages, { epiR: '2.0.93', pwr: '1.3.0' });
  assert.deepEqual(r.tolerance.find((x) => x.scope === 'closed'), { scope: 'closed', rel: '1e-10' });
  const nist = describe(JSON.parse(readFileSync(here(`../fixtures/${fx('published', 'nist', 'fixture.json')}`), 'utf8')));
  assert.deepEqual(nist.tolerance.find((x) => x.scope === 'Norris coef'), { scope: 'Norris coef', lre: 9 });
  assert.deepEqual(nist.source.urls, ['https://www.itl.nist.gov/div898/strd/lls/lls.shtml']);
  const course = describe(JSON.parse(readFileSync(here(`../fixtures/${fx('course', 'epi-course-2026.json')}`), 'utf8')));
  assert.equal(course.source.file, 'src/data/questions-y5-epidemiology-2026-c.js');
  assert.match(course.source.commit, /^[0-9a-f]{40}$/);
  // Nothing is invented for a file that says nothing.
  assert.deepEqual(describe({ _fixture: { family: 'x', kind: 'pin', methods: [] } }), {
    source: { text: null, r: null, webR: null, packages: null, python: null, script: null, urls: [], file: null, commit: null, date: null },
    tolerance: [],
  });
});

test('the methods page lists every catalogue method once, with the catalogue\'s status and every fixture that names it', () => {
  const catalog = getCatalog();
  const model = buildMethodsModel(catalog, FIXTURES);
  assert.equal(model.total, METHODS.length);
  assert.deepEqual(model.rows.map((r) => r.id).sort(), METHODS.map((m) => m.id).sort());
  assert.equal(model.shipped, REGISTERED.length);
  for (const r of model.rows) {
    const c = catalog.find((x) => x.id === r.id);
    assert.equal(r.status === 'verified', c.verified, r.id);
    assert.equal(r.group === 'now', c.shipped, r.id);
    assert.deepEqual(r.fixtures.map((f) => f.file).sort(), FIXTURES.filter((f) => f.methods.includes(r.id)).map((f) => f.file).sort(), r.id);
    // A method counted as checked has at least one fixture of kind pin behind it.
    if (r.status === 'verified') assert.ok(r.fixtures.some((f) => f.kind === 'pin'), r.id);
  }
  assert.deepEqual(model.groups.map((g) => g.id), ['now', 'M1', 'M2', 'M3', 'later'].filter((g) => model.rows.some((r) => r.group === g)));
  // The public page shows only what the program does today: no roadmap, no filter for it.
  const page = readFileSync(here('../../src/pages/MethodsPage.jsx'), 'utf8');
  assert.ok(page.includes("model.groups.filter((g) => g.id === 'now')"));
  for (const k of Object.keys(trust.th).filter((k) => k.startsWith('trust.methods.'))) assert.doesNotMatch(trust.th[k], /วางแผน|ยังไม่มีกำหนด|ยังไม่เปิดให้ใช้/, k);
  // The page follows the data it is given: a method with no fixture shows no checks.
  const bare = buildMethodsModel(catalog, []);
  assert.ok(bare.rows.every((r) => r.fixtures.length === 0));
});

const has = (key) => Boolean(trust.th[key] && trust.en[key]);

test('every word the public pages show exists in Thai and English', () => {
  const dir = here('../../src/pages/');
  for (const f of readdirSync(dir).filter((x) => x.endsWith('.jsx') || x.endsWith('.js'))) {
    const src = readFileSync(dir + f, 'utf8');
    for (const m of src.matchAll(/t\('(trust\.[A-Za-z0-9_.-]+)'/g)) assert.ok(has(m[1]), `${f}: ${m[1]}`);
  }
  for (const k of guideKeys()) assert.ok(has(k), k);
  assert.ok(has('trust.methods.group.now'));
  for (const s of ['verified', 'shipped']) assert.ok(has(`trust.methods.status.${s}`), s);
  for (const k of ['pin', 'crosscheck']) assert.ok(has(`trust.methods.kind.${k}`), k);
  const tolerances = FIXTURES.flatMap((f) => f.tolerance);
  for (const tol of [...tolerances, { scope: 'all', rel: '1e-6' }, { scope: 'all', text: 'x' }]) assert.ok(has(toleranceWords(tol).key), JSON.stringify(tol));
});

test('the guide has one page per workflow, the guardrails the design names, and a made-up example for each', () => {
  assert.deepEqual(GUIDE.map((p) => p.id), ['start', 'farms', 'lab', 'repeated', 'assays', 'models', 'survival', 'diagnostic', 'agreement', 'prepare', 'warnings']);
  assert.deepEqual(GUIDE.find((p) => p.id === 'warnings').warnings, ['G1', 'G3', 'G5', 'G7', 'G8', 'G14', 'G26']);
  const ids = new Set(EXAMPLES.map((e) => e.id));
  for (const p of GUIDE) {
    assert.ok(Array.isArray(p.examples), p.id);
    for (const x of p.examples) assert.ok(ids.has(x), `${p.id}: ${x}`);
  }
  // Every example is offered on the page its `guide` names, so no example is left without a walk-through.
  for (const e of EXAMPLES) assert.ok(GUIDE.find((p) => p.id === e.guide)?.examples.includes(e.id), `${e.id}: guide ${e.guide}`);
  // The M3a lab page walks through one example per family: standard curve, dose-response, area under the
  // curve, qPCR, PCA (M3-DESIGN.md 7).
  const fam = (id) => EXAMPLES.find((e) => e.id === id).methods;
  assert.deepEqual(GUIDE.find((p) => p.id === 'assays').examples.map(fam).flat().filter((m) => m !== 'anova.repeated'),
    ['nls.fourPL', 'nls.doseResponse', 'calc.auc', 'qpcr.relative', 'mv.pca']);
  assert.equal(guidePageFromHash('#lab').id, 'lab');
  assert.equal(guidePageFromHash('#assays').id, 'assays');
  assert.equal(guidePageFromHash(''), null);
  assert.equal(guidePageFromHash('#nothing'), null);
});

test('the M3a guide pages say what M3-DESIGN.md 7 asks, in Thai and in English', () => {
  const page = (id, lang) => {
    const p = GUIDE.find((x) => x.id === id);
    const keys = [`trust.guide.${id}.lead`, ...Array.from({ length: p.steps }, (_, k) => `trust.guide.${id}.step${k + 1}`),
      ...Array.from({ length: p.watch }, (_, k) => `trust.guide.${id}.watch${k + 1}`)];
    return keys.map((k) => trust[lang][k]).join('\n');
  };
  // Each point once per language: the words a student will meet on the result screens.
  const points = {
    assays: {
      both: [/EC50/, /IC50/, /4PL/, /extra sum-of-squares F test/, /AICc/, /ΔCt/, /fold change/, /dilution series/, /90 ถึง 110%|90 to 110%/, /Pfaffl/, /loading/, /biplot/, /eigenvalue/],
      th: [/นอกช่วงของ standard curve/, /ไม่ต่อเส้นออกไปเดาค่า/, /เฉพาะความไม่แน่นอนของตัวเส้น/, /ตัวเลขเดียว/, /ไม่ได้นำมาทดสอบ/, /ไม่ใช่กฎ/],
      en: [/outside the standard curve/, /does not extend the curve/, /uncertainty of the curve only/, /one number/, /never tested/, /not a rule/],
    },
    models: {
      both: [/Firth's correction/, /separation/, /negative binomial regression/, /overdispersion/, /theta/, /G14/, /G23/],
      th: [/ไม่เปลี่ยนไปใช้ Firth's correction ให้เอง/],
      en: [/never switches to Firth's correction/],
    },
  };
  for (const [id, p] of Object.entries(points)) {
    for (const lang of ['th', 'en']) {
      const text = page(id, lang);
      for (const re of [...p.both, ...p[lang]]) assert.match(text, re, `${id} ${lang}`);
    }
  }
});

test('a fixture\'s tolerance is read under either spelling of its minimum-digits field (the NIST nonlinear sets say minLre)', () => {
  const nls = describe(JSON.parse(readFileSync(here(`../fixtures/${fx('stats', 'nist-strd-nls', 'fixture.json')}`), 'utf8')));
  assert.deepEqual(nls.tolerance, [{ scope: 'lower', lre: 6 }, { scope: 'higher', lre: 5 }]);
  assert.match(nls.source.text, /NIST\/ITL Statistical Reference Datasets, nonlinear regression/);
  assert.deepEqual(describe({ _fixture: {}, minLre: { a: 7 } }).tolerance, [{ scope: 'a', lre: 7 }]);
});

test('dates show their era', () => {
  assert.equal(formatDate('2026-09-28', 'th'), '28 ก.ย. พ.ศ. 2569');
  assert.equal(formatDate('2026-09-28', 'en'), '28 Sep 2026 CE');
  assert.equal(eraYear(2026, 'th'), 'พ.ศ. 2569');
  assert.equal(eraYear(2026, 'en'), '2026');
});

test('the citation record is the running engine\'s release, with no invented DOI', () => {
  const r = currentRelease();
  assert.ok(r);
  assert.ok(ENGINE_VERSION.endsWith(`-${r.version}`), `add a RELEASES record for ${ENGINE_VERSION} in src/data/cite.js`);
  for (const x of RELEASES) {
    assert.ok(x.doi === null || /^10\.\d{4,9}\/\S+$/.test(x.doi), x.version);
    assert.match(x.released, /^\d{4}-\d{2}-\d{2}$/);
    assert.equal(Number(x.released.slice(0, 4)), x.year);
    assert.equal(x.url, 'https://research.vetmock.com');
  }
  const ref = softwareReference(r, '2026-09-28', 'VetMock Research');
  assert.deepEqual(ref.authors, r.authors.length ? r.authors : ['VetMock Research']);
  assert.equal(ref.type, 'software');
  assert.equal(ref.doi, r.doi);
});
