// The pure logic behind the performance budgets (scripts/lib/perf-logic.mjs): the manifest walk with
// gzip sums, the size check, and the median-absolute-deviation comparison `npm run perf` judges timings by.
// Nothing here builds the app or opens a browser; perf-budgets.json is only read for its shape.
import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs';
import zlib from 'node:zlib';
import {
  HEADROOM, gzipBytes, findKey, entryFiles, routeSizes, budgetFor, requestBudgetFor, ceil4, clsBudgetFor, checkSizes, unitOf, judgeMetrics,
  median, mad, summarize, allowance, compareMetric,
} from '../../scripts/lib/perf-logic.mjs';

// A made-up Vite manifest in the real one's shape: entries keyed by source path, a chunk other chunks also
// import statically keyed "_<file>" (no source path), `imports` and `dynamicImports` as manifest keys, `css`
// and `assets` as files.
const manifest = {
  'index.html': {
    file: 'assets/main-AAA.js', name: 'main', src: 'index.html', isEntry: true,
    imports: ['_vendor-react-BBB.js', '_shared-CCC.js'],
    dynamicImports: ['src/views/HomeView.jsx', 'src/views/ExamView.jsx', '_WikiView-HHH.js'],
    css: ['assets/main-AAA.css'],
    assets: ['assets/logo-ZZZ.svg'],
  },
  '_vendor-react-BBB.js': { file: 'assets/vendor-react-BBB.js', name: 'vendor-react' },
  '_shared-CCC.js': { file: 'assets/shared-CCC.js', name: 'shared', imports: ['_vendor-react-BBB.js'], css: ['assets/shared-CCC.css'] },
  '_home-lib-EEE.js': { file: 'assets/home-lib-EEE.js', name: 'home-lib', imports: ['_vendor-react-BBB.js'] },
  'src/views/HomeView.jsx': {
    file: 'assets/HomeView-DDD.js', name: 'HomeView', src: 'src/views/HomeView.jsx', isDynamicEntry: true,
    imports: ['_shared-CCC.js', '_home-lib-EEE.js', 'index.html'], css: ['assets/HomeView-DDD.css'],
    dynamicImports: ['src/data/questions-big.js'],
  },
  'src/views/ExamView.jsx': {
    file: 'assets/ExamView-FFF.js', name: 'ExamView', src: 'src/views/ExamView.jsx', isDynamicEntry: true,
    imports: ['_shared-CCC.js', '_home-lib-EEE.js'],
  },
  '_WikiView-HHH.js': { file: 'assets/WikiView-HHH.js', name: 'WikiView', isDynamicEntry: true, imports: ['_shared-CCC.js'], css: ['assets/WikiView-HHH.css'] },
  'src/lib/wiki-data/subject-a.js': { file: 'assets/subject-a-III.js', name: 'subject-a', src: 'src/lib/wiki-data/subject-a.js', isDynamicEntry: true },
  'src/data/questions-big.js': { file: 'assets/data-q-big-GGG.js', name: 'data-q-big', src: 'src/data/questions-big.js', isDynamicEntry: true },
};

// Every file gets distinct, compressible content, so each has its own gzip size.
const bytes = (file) => Buffer.from(`${file}\n`.repeat(40 + file.length * 3));
const read = (file) => bytes(file);
const gz = (file) => zlib.gzipSync(bytes(file), { level: 9 }).length;

test('gzip is the standard container at level 9: an empty file is 20 bytes, the same input always the same size', () => {
  assert.equal(gzipBytes(Buffer.alloc(0)), 20);
  const data = bytes('assets/x.js');
  assert.equal(gzipBytes(data), gzipBytes(Buffer.from(data)));
  assert.ok(gzipBytes(data) < data.length / 5, 'repetitive text compresses a lot');
});

test('a selector is a manifest key, or the one chunk with that name', () => {
  assert.equal(findKey(manifest, 'index.html'), 'index.html');
  assert.equal(findKey(manifest, 'src/views/HomeView.jsx'), 'src/views/HomeView.jsx');
  // A chunk with no source path has a key with a hash in it, which changes on every build.
  assert.equal(findKey(manifest, 'WikiView'), '_WikiView-HHH.js');
  assert.equal(findKey(manifest, 'HomeView'), 'src/views/HomeView.jsx');
  assert.throws(() => findKey(manifest, 'NoSuchView'), /no entry or chunk called "NoSuchView"/);
  const twice = { ...manifest, 'src/other/HomeView.jsx': { file: 'assets/HomeView-JJJ.js', name: 'HomeView' } };
  assert.throws(() => findKey(twice, 'HomeView'), /names 2 manifest entries/);
});

test('the first load is the entry, its static imports (recursively, once each) and the CSS of all of them', () => {
  assert.deepEqual(entryFiles(manifest, 'index.html'), {
    js: ['assets/main-AAA.js', 'assets/shared-CCC.js', 'assets/vendor-react-BBB.js'],
    css: ['assets/main-AAA.css', 'assets/shared-CCC.css'],
  });
});

test('a dynamic import and an asset are not part of what a chunk needs to run', () => {
  const { js, css } = entryFiles(manifest, 'HomeView');
  assert.deepEqual(js, ['assets/HomeView-DDD.js', 'assets/home-lib-EEE.js', 'assets/main-AAA.js', 'assets/shared-CCC.js', 'assets/vendor-react-BBB.js']);
  assert.deepEqual(css, ['assets/HomeView-DDD.css', 'assets/main-AAA.css', 'assets/shared-CCC.css']);
  assert.ok(![...js, ...css].some((f) => /data-q-big|logo-ZZZ/.test(f)));
});

test('a route can load several entries, and their shared files count once', () => {
  const both = entryFiles(manifest, ['WikiView', 'src/lib/wiki-data/subject-a.js']);
  assert.deepEqual(both, {
    js: ['assets/WikiView-HHH.js', 'assets/shared-CCC.js', 'assets/subject-a-III.js', 'assets/vendor-react-BBB.js'],
    css: ['assets/WikiView-HHH.css', 'assets/shared-CCC.css'],
  });
});

test('route sizes are the sum of each file gzipped on its own', () => {
  const first = routeSizes(manifest, 'index.html', read);
  assert.equal(first.js, gz('assets/main-AAA.js') + gz('assets/shared-CCC.js') + gz('assets/vendor-react-BBB.js'));
  assert.equal(first.css, gz('assets/main-AAA.css') + gz('assets/shared-CCC.css'));
  // Not one gzip of the joined bytes: the browser fetches the files separately.
  const joined = gzipBytes(Buffer.concat(first.files.js.map(read)));
  assert.notEqual(first.js, joined);
});

test('a lazy route counts only what the first load does not already hold', () => {
  const firstLoad = entryFiles(manifest, 'index.html');
  // HomeView imports the entry chunk itself, as the real views do; that is part of the first load.
  const home = routeSizes(manifest, 'HomeView', read, { except: firstLoad });
  assert.deepEqual(home.files, { js: ['assets/HomeView-DDD.js', 'assets/home-lib-EEE.js'], css: ['assets/HomeView-DDD.css'] });
  assert.equal(home.js, gz('assets/HomeView-DDD.js') + gz('assets/home-lib-EEE.js'));
  assert.equal(home.css, gz('assets/HomeView-DDD.css'));
  // A route that adds no CSS of its own has none to count.
  const exam = routeSizes(manifest, 'ExamView', read, { except: firstLoad });
  assert.equal(exam.css, 0);
  assert.equal(exam.js, gz('assets/ExamView-FFF.js') + gz('assets/home-lib-EEE.js'));
});

test('an entry the manifest lacks, or an import it does not list, stops the walk with the name', () => {
  assert.throws(() => entryFiles(manifest, 'src/views/Gone.jsx'), /no entry or chunk called "src\/views\/Gone\.jsx"/);
  const broken = { ...manifest, 'index.html': { ...manifest['index.html'], imports: ['_missing-HHH.js'] } };
  assert.throws(() => entryFiles(broken, 'index.html'), /"index\.html" imports "_missing-HHH\.js"/);
});

test('a budget is the measured size plus 3%, rounded up to the next 100 bytes', () => {
  assert.equal(HEADROOM, 0.03);
  assert.equal(budgetFor(10000), 10300);
  assert.equal(budgetFor(10001), 10400);
  assert.equal(budgetFor(0), 0);
  assert.equal(budgetFor(10000, 0.1), 11000);
  // 3% of a request count, up to a whole request: the budget is never below the count measured.
  assert.equal(requestBudgetFor(100), 103);
  assert.equal(requestBudgetFor(41), 43);
  assert.equal(requestBudgetFor(0), 0);
});

test('a layout-shift budget is 0.01, or the measured value where the page is not under it yet', () => {
  assert.equal(ceil4(0.01234), 0.0124);
  assert.equal(ceil4(0.0123), 0.0123, 'a value already at four decimals is left alone');
  assert.equal(clsBudgetFor(0.01, 0), 0.01);
  assert.equal(clsBudgetFor(0.01, 0.0099), 0.01);
  assert.equal(clsBudgetFor(0.01, 0.0321), 0.0321, 'a gap is budgeted at its measured value and stays visible');
  assert.equal(clsBudgetFor(0.01, 0.03211), 0.0322);
});

test('a size is over its budget by one byte, or missing, and both fail', () => {
  const routes = {
    initial: { js: { budget: 1000 }, css: { budget: 200 } },
    exam: { js: { budget: 500 } },
    gone: { js: { budget: 100 } },
  };
  const rows = checkSizes(routes, { initial: { js: 1000, css: 201 }, exam: { js: 499, css: 99999 } });
  const row = (name, kind) => rows.find((r) => r.name === name && r.kind === kind);
  assert.equal(row('initial', 'js').ok, true, 'exactly at the budget passes');
  assert.equal(row('initial', 'css').ok, false, 'one byte over fails');
  assert.equal(row('exam', 'js').ok, true);
  assert.equal(row('exam', 'css'), undefined, 'a kind without a budget is not judged');
  assert.equal(row('gone', 'js').ok, false, 'a budgeted route that was not measured is a failure, not a skip');
  assert.equal(row('gone', 'js').measured, null);
});

test('median and median absolute deviation ignore one wild run', () => {
  assert.equal(median([5, 1, 3]), 3);
  assert.equal(median([1, 2, 3, 4]), 2.5);
  assert.equal(median([]), null);
  assert.equal(median([NaN, 7, undefined, 9]), 8, 'only finite numbers count');
  // Deviations from 3 are 2, 1, 0, 1, 97, whose median is 1: the 100 does not move it.
  assert.equal(mad([1, 2, 3, 4, 100]), 1);
  assert.equal(mad([4, 4, 4, 4]), 0);
  assert.equal(mad([]), null);
  assert.deepEqual(summarize([10, 12, 11, 40, 11]), { median: 11, mad: 1, n: 5 });
});

test('the allowance is the largest of three spreads, 3 MAD, 5% of the median, and the unit floor', () => {
  assert.equal(allowance({ median: 100, mad: 10 }), 30, '3 x MAD wins on a noisy metric');
  assert.equal(allowance({ median: 200, mad: 0 }), 10, '5% wins on a steady, large one');
  assert.equal(allowance({ median: 10, mad: 0 }), 2, '2 ms floor wins on a steady, small one');
  assert.equal(allowance({ median: 10, mad: 0 }, 'count'), 1, 'a count moves by whole units');
});

test('an interaction moves in steps of 8 ms and a frame in whole refreshes, so one step is not a regression', () => {
  // Event Timing rounds to 8 ms: a steady 96 ms that reads 104 once has not become slower.
  assert.equal(allowance({ median: 96, mad: 0 }, 'event'), 8);
  assert.equal(compareMetric(104, { median: 96, mad: 0 }, 'event').regressed, false);
  assert.equal(compareMetric(112, { median: 96, mad: 0 }, 'event').regressed, true, 'two steps is');
  // A frame is a whole number of refreshes: a p95 that goes from one 60 Hz frame to two is a dropped frame, not a trend...
  assert.equal(allowance({ median: 16.7, mad: 0 }, 'frame', 1000 / 60), 1000 / 60);
  assert.equal(compareMetric(30, { median: 16.7, mad: 0 }, 'frame', 1000 / 60).regressed, false);
  // ...and a p95 of three refreshes (50 ms) is.
  assert.equal(compareMetric(50, { median: 16.7, mad: 0 }, 'frame', 1000 / 60).regressed, true);
  // The floor follows the display: at 120 Hz a refresh is 8.3 ms.
  assert.equal(allowance({ median: 8.3, mad: 0 }, 'frame', 1000 / 120), 1000 / 120);
});

test('only going up past the allowance is a regression', () => {
  const base = { median: 100, mad: 4 }; // allowance max(12, 5, 2) = 12
  assert.deepEqual(compareMetric(112, base), { delta: 12, allowed: 12, regressed: false });
  assert.equal(compareMetric(112.5, base).regressed, true);
  assert.equal(compareMetric(60, base).regressed, false, 'faster is never a regression');
  assert.equal(compareMetric(100, base).delta, 0);
});

test('a metric is judged in the unit its name says', () => {
  assert.equal(unitOf('answer.inp'), 'event');
  assert.equal(unitOf('home.scrollP95'), 'frame');
  assert.equal(unitOf('practice.openP95'), 'frame');
  assert.equal(unitOf('interactions.longTasks'), 'count');
  assert.equal(unitOf('results.scrollOver50'), 'count');
  assert.equal(unitOf('wiki.lcp'), 'ms');
  assert.equal(unitOf('interactions.blocking'), 'ms');
});

test('a run is judged metric by metric against the baseline, and only the slower ones are flagged', () => {
  const baseline = {
    metrics: {
      'wiki.lcp': { scenario: 'wiki', median: 1000, mad: 20 },        // allowance max(60, 50, 2) = 60
      'answer.inp': { scenario: 'journey', median: 96, mad: 0 },      // allowance 8: one Event Timing step
      'home.scrollP95': { scenario: 'journey', median: 16.7, mad: 0 }, // allowance one refresh
      'next.inp': { scenario: 'journey', median: 40, mad: 4 },        // in the baseline, not measured now
    },
  };
  const samples = {
    wiki: { 'wiki.lcp': [1030, 1050, 1040, 1090, 1010], 'wiki.scrollOver50': [0, 0, 1, 0, 0] },
    journey: { 'answer.inp': [104, 104, 104, 96, 104], 'home.scrollP95': [33.3, 33.3, 16.7, 33.3, 16.7] },
  };
  const rows = judgeMetrics(samples, baseline, 1000 / 60);
  const row = (m) => rows.find((r) => r.metric === m);
  assert.deepEqual(rows.map((r) => r.metric), ['answer.inp', 'home.scrollP95', 'next.inp', 'wiki.lcp', 'wiki.scrollOver50']);
  assert.equal(row('wiki.lcp').now.median, 1040);
  assert.equal(row('wiki.lcp').regressed, false, '+40 ms is inside 3 x MAD');
  assert.equal(row('answer.inp').regressed, false, 'one 8 ms step is not a regression');
  assert.equal(row('home.scrollP95').now.median, 33.3);
  assert.equal(row('home.scrollP95').regressed, false, 'one dropped refresh is not a regression');
  assert.equal(row('next.inp').now, null, 'a baseline metric the run did not measure is kept, unjudged');
  assert.equal(row('next.inp').scenario, 'journey');
  assert.equal(row('wiki.scrollOver50').base, null, 'a metric with no baseline is new, unjudged');
  assert.equal(row('wiki.scrollOver50').regressed, undefined);
  // The same run with a wiki LCP that moved by 120 ms is flagged, and names its scenario for the second look.
  const slower = judgeMetrics({ ...samples, wiki: { 'wiki.lcp': [1120, 1130, 1125, 1140, 1115] } }, baseline, 1000 / 60);
  const flagged = slower.filter((r) => r.regressed);
  assert.deepEqual(flagged.map((r) => [r.metric, r.scenario]), [['wiki.lcp', 'wiki']]);
});

// perf-budgets.json carries the numbers CI holds the build to. Its bundle section is rewritten by
// `node scripts/perf-budget.mjs --write`, the rest by UPDATE_PERF_BUDGETS=1 on tests/e2e/perf-budget.spec.js,
// and by nothing else: a budget is the measured value plus the stated rule, so raising one means
// measuring again, in the open, in the pull request.
test('perf-budgets.json: every budget is its measured value plus the stated rule, nothing looser', () => {
  const file = JSON.parse(fs.readFileSync(new URL('../../perf-budgets.json', import.meta.url), 'utf8'));
  assert.equal(file.headroom, HEADROOM);

  const routes = Object.entries(file.bundle.routes);
  assert.ok(routes.length >= 6, 'the first load and the key lazy views are all budgeted');
  for (const [name, route] of routes) {
    assert.ok(Array.isArray(route.entries) && route.entries.length, `${name} names its manifest entries`);
    if (route.after) assert.ok(file.bundle.routes[route.after], `${name} comes after a route that exists`);
    for (const kind of ['js', 'css']) {
      const { measured, budget } = route[kind];
      assert.ok(Number.isInteger(measured) && measured >= 0, `${name}.${kind} measured`);
      assert.equal(budget, budgetFor(measured), `${name}.${kind}: budget is not measured + ${HEADROOM * 100}% (run node scripts/perf-budget.mjs --write after a measured change)`);
    }
  }

  const projects = ['chromium-desktop', 'chromium-mobile'];
  assert.deepEqual(Object.keys(file.firstLoad.projects).sort(), projects);
  for (const [project, row] of Object.entries(file.firstLoad.projects)) {
    assert.ok(Number.isInteger(row.requests.measured) && row.requests.measured > 0, `${project} requests measured`);
    assert.equal(row.requests.budget, requestBudgetFor(row.requests.measured), `${project}: request budget is not measured + 3%`);
    assert.ok(Number.isInteger(row.imageBytes.measured) && row.imageBytes.measured >= 0, `${project} image bytes measured`);
    assert.equal(row.imageBytes.budget, budgetFor(row.imageBytes.measured), `${project}: image-byte budget is not measured + 3%`);
  }

  assert.equal(file.cls.limit, 0.01);
  assert.deepEqual(Object.keys(file.cls.projects).sort(), projects);
  for (const [project, pages] of Object.entries(file.cls.projects)) {
    assert.deepEqual(Object.keys(pages).sort(), ['home', 'practice', 'results', 'wikiArticle'], `${project} budgets every page`);
    for (const [page, row] of Object.entries(pages)) {
      assert.ok(Number.isFinite(row.measured) && row.measured >= 0, `${project} ${page} measured`);
      assert.equal(row.budget, clsBudgetFor(file.cls.limit, row.measured), `${project} ${page}: CLS budget is neither 0.01 nor the measured value`);
    }
  }
});
