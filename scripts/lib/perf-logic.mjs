// The pure logic behind VetMock's performance budgets: no files, no browser, no clock.
// scripts/perf-budget.mjs (size budgets, run by the gate and CI) and scripts/perf.mjs (timing, run by
// hand) call it, and tests/unit/perf-budget.test.mjs drives it with a made-up manifest.
//
// Two kinds of number live here, and they are judged differently on purpose:
//   • Sizes are exact. The same sources build to the same files and gzip is deterministic, so a budget
//     is a plain ceiling: the size measured when it was set, plus a stated headroom (HEADROOM).
//   • Timings are noisy. They are compared with the baseline's own spread (median absolute deviation),
//     so a slow minute on the machine does not read as a regression.
import zlib from 'node:zlib';

export const HEADROOM = 0.03;
export const GZIP_LEVEL = 9;

// ── Sizes ──────────────────────────────────────────────────────────────

/** Size in bytes of `data` gzipped at level 9 with Node's zlib (deterministic for one zlib build). */
export const gzipBytes = (data) => zlib.gzipSync(data, { level: GZIP_LEVEL }).length;

/**
 * The manifest key a selector names: an exact key ("index.html", "src/lib/vetwiki/runtime-adapter.js"), or the one
 * chunk with that name ("HomeView"). A chunk that other chunks import statically as well loses its source path
 * and is keyed "_KnowledgeView-<hash>.js", and the hash changes with every build, so a budget names it by name.
 */
export function findKey(manifest, selector) {
  if (manifest[selector]) return selector;
  const named = Object.keys(manifest).filter((key) => manifest[key].name === selector);
  if (named.length === 1) return named[0];
  throw new Error(named.length
    ? `"${selector}" names ${named.length} manifest entries (${named.join(', ')}); name one by its key`
    : `the manifest has no entry or chunk called "${selector}"`);
}

/**
 * Every file the manifest entries named by `selectors` need before they can run: their own chunks, the chunks
 * they import statically (and theirs, recursively) and the stylesheets of all of them. A dynamic import is not
 * followed, because it loads on demand, and neither are `assets` (images and fonts): the budget is JavaScript
 * and CSS. Files come back sorted and unique.
 */
export function entryFiles(manifest, selectors) {
  const seen = new Set();
  const js = new Set();
  const css = new Set();
  const visit = (key, from) => {
    if (seen.has(key)) return;
    seen.add(key);
    const chunk = manifest[key];
    if (!chunk) throw new Error(`the manifest entry "${from}" imports "${key}", which it does not list`);
    if (chunk.file) (/\.css$/i.test(chunk.file) ? css : js).add(chunk.file);
    for (const file of chunk.css || []) css.add(file);
    for (const imported of chunk.imports || []) visit(imported, key);
  };
  for (const selector of [selectors].flat()) {
    const key = findKey(manifest, selector);
    visit(key, key);
  }
  return { js: [...js].sort(), css: [...css].sort() };
}

/**
 * What one route costs, in gzipped bytes. With `except` (another entryFiles result, normally the
 * first load) the files that are already there are left out, which is what opening the route after the
 * first load adds. Each file is gzipped on its own, as the browser fetches it; `read(file)` returns its bytes.
 */
export function routeSizes(manifest, selectors, read, { except = null } = {}) {
  const all = entryFiles(manifest, selectors);
  const have = new Set(except ? [...except.js, ...except.css] : []);
  const js = all.js.filter((file) => !have.has(file));
  const css = all.css.filter((file) => !have.has(file));
  const sum = (files) => files.reduce((total, file) => total + gzipBytes(read(file)), 0);
  return { js: sum(js), css: sum(css), files: { js, css } };
}

/** `measured` plus the headroom, rounded up to the next 100 bytes. */
export const budgetFor = (measured, headroom = HEADROOM) => Math.max(0, Math.ceil((measured * (1 + headroom)) / 100 - 1e-9) * 100);

/** A request count's budget: the measured count plus the headroom, rounded up to a whole request. */
export const requestBudgetFor = (measured, headroom = HEADROOM) => Math.max(0, Math.ceil(measured * (1 + headroom) - 1e-9));

/** A layout shift rounded up to four decimals, the precision the budgets are written at. */
export const ceil4 = (x) => Math.ceil(x * 1e4 - 1e-9) / 1e4;

/**
 * A layout-shift budget: the limit (0.01), or, for a page that is not under it yet, the value measured when the
 * budget was written, so the budget is never red on the day it is set and the gap to the limit stays written down.
 */
export const clsBudgetFor = (limit, measured) => Math.max(limit, ceil4(measured));

/**
 * The size budgets against the measured sizes. `routes` is perf-budgets.json's bundle.routes
 * ({ name: { manifestKey, js: { budget }, css: { budget } } }), `sizes` the measured { name: { js, css } }.
 * A route that is budgeted but not measured is a failure, never a skip: a renamed view must not retire its budget silently.
 */
export function checkSizes(routes, sizes) {
  const rows = [];
  for (const [name, route] of Object.entries(routes)) {
    for (const kind of ['js', 'css']) {
      const budget = route[kind]?.budget;
      if (budget === undefined) continue;
      const measured = sizes[name]?.[kind];
      rows.push({
        name, kind, budget, measured: measured ?? null,
        ok: typeof measured === 'number' && measured <= budget,
      });
    }
  }
  return rows;
}

// ── Timings ────────────────────────────────────────────────────────────

/** Median of the finite numbers in `xs` (the mean of the two middle ones when there is an even count); null when there are none. */
export function median(xs) {
  const v = xs.filter((x) => Number.isFinite(x)).sort((a, b) => a - b);
  if (!v.length) return null;
  const mid = v.length >> 1;
  return v.length % 2 ? v[mid] : (v[mid - 1] + v[mid]) / 2;
}

/** Median absolute deviation: the median distance from the median, a spread that one wild run cannot stretch. */
export function mad(xs) {
  const m = median(xs);
  return m === null ? null : median(xs.filter((x) => Number.isFinite(x)).map((x) => Math.abs(x - m)));
}

/** { median, mad, n } of the finite numbers in `xs`. */
export function summarize(xs) {
  const v = xs.filter((x) => Number.isFinite(x));
  return { median: median(v), mad: mad(v), n: v.length };
}

// The smallest difference worth calling a change, by what the metric is measured in. A duration in
// milliseconds moves by 2 at least; a count moves in whole units; Event Timing rounds an interaction to
// 8 ms; a frame time can only be a whole number of display refreshes (see allowance), so one step of
// either is how the metric is read, not a change in the app.
export const FLOORS = { ms: 2, count: 1, event: 8 };

/**
 * How far above the baseline median a metric may sit before it is a regression: three times the
 * baseline's own spread, or 5% of its median, or the unit's floor, whichever is largest. For a
 * frame time the floor is one display refresh (`frameMs`, 16.7 at 60 Hz).
 */
export function allowance(base, unit = 'ms', frameMs = 1000 / 60) {
  const floor = unit === 'frame' ? frameMs : (FLOORS[unit] ?? FLOORS.ms);
  return Math.max(3 * base.mad, 0.05 * base.median, floor);
}

/** One metric against its baseline: how far it moved, how far it may, and whether that is a regression (only going up is). */
export function compareMetric(current, base, unit = 'ms', frameMs) {
  const allowed = allowance(base, unit, frameMs);
  const delta = current - base.median;
  return { delta, allowed, regressed: delta > allowed };
}

/**
 * What a metric is measured in, from its name, because the smallest change that counts depends on it
 * (FLOORS): an interaction (.inp) is rounded to 8 ms by Event Timing, a frame time (...P95) is a whole
 * number of display refreshes, a count (longTasks, ...Over50) moves in whole units, the rest are milliseconds.
 */
export function unitOf(metric) {
  if (/\.inp$/.test(metric)) return 'event';
  if (/P95$/.test(metric)) return 'frame';
  if (/(longTasks|Over50)$/.test(metric)) return 'count';
  return 'ms';
}

/**
 * Every metric of a run against the baseline. `samples` is { scenario: { metric: [one value per run] } },
 * `baseline` the parsed perf-baseline.json (or null). Rows come back sorted by metric name with
 * { metric, scenario, now, base } and, where both exist, { delta, allowed, regressed }.
 */
export function judgeMetrics(samples, baseline, frameMs) {
  const names = new Set([...Object.keys(baseline?.metrics ?? {}), ...Object.values(samples).flatMap((s) => Object.keys(s))]);
  return [...names].sort().map((metric) => {
    const scenario = Object.keys(samples).find((s) => metric in samples[s]);
    const now = scenario ? summarize(samples[scenario][metric]) : null;
    const base = baseline?.metrics?.[metric] ?? null;
    const row = { metric, scenario: scenario ?? base?.scenario, now, base };
    if (now && base) Object.assign(row, compareMetric(now.median, base, unitOf(metric), frameMs));
    return row;
  });
}

/** A number rounded to two decimals, so a baseline reads 12.1 and not 12.099999999999909. */
export const round2 = (x) => Math.round(x * 100) / 100;

/** The baseline's metrics from a judged run (judgeMetrics rows): median, spread and run count of each metric that was measured. */
export function baselineMetrics(rows) {
  const metrics = {};
  for (const r of rows) {
    if (!r.now) continue;
    metrics[r.metric] = { scenario: r.scenario, unit: unitOf(r.metric), median: round2(r.now.median), mad: round2(r.now.mad), n: r.now.n };
  }
  return metrics;
}
