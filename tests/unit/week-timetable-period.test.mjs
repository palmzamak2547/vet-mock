// ============================================================
// week-timetable-period.test.mjs — the weekly timetable knows the term
// ============================================================
// OV-tools-35. The timetable titled itself "ตารางเรียนสัปดาห์นี้" and marked
// "วันนี้" on every day of the term, including the exam weeks, when the
// faculty suspends classes, and after the last paper, when it describes a
// term that is over. It also read today's weekday and the current class on the
// device's clock, so a phone set to another zone marked the wrong day.
//
// Every instant below carries its zone and every answer is Bangkok's. The
// answers must not depend on the zone that reads them, so the cases are
// replayed in fresh node processes under zones either side of Bangkok, the
// way exam-tz.test.mjs does. The component itself is bundled from source and
// rendered with react-dom/server inside those processes.
// ============================================================
import test, { after, before } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { build } from 'esbuild';

const repoRoot = fileURLToPath(new URL('../../', import.meta.url));
const dir = mkdtempSync(join(tmpdir(), 'week-timetable-'));
const outfile = join(dir, 'week.cjs');
after(() => rmSync(dir, { recursive: true, force: true }));

before(async () => {
  await build({
    stdin: {
      contents: [
        "import { createElement } from 'react';",
        "import { renderToStaticMarkup } from 'react-dom/server';",
        "import WeekTimetable from './src/components/WeekTimetable.jsx';",
        'export const render = (props) => renderToStaticMarkup(createElement(WeekTimetable, props));',
        "import * as schedule from './src/data/schedule.js';",
        'export const bangkokClock = schedule.bangkokClock;',
        'export const termPhase = schedule.termPhase;',
        'export const getCurrentClass = schedule.getCurrentClass;',
      ].join(String.fromCharCode(10)),
      resolveDir: repoRoot,
      loader: 'jsx',
    },
    bundle: true,
    format: 'cjs',
    platform: 'node',
    jsx: 'automatic',
    define: { 'process.env.NODE_ENV': '"production"' },
    outfile,
    logLevel: 'silent',
  });
});

// [instant, what it is in Bangkok, expected]. Year 5 on Wednesday has
// MILK HYGIENE AND MEAT INSPECTION 09:00-12:00 (3109503).
const CASES = [
  {
    name: 'a class week, Wednesday 09:30 in Bangkok',
    at: '2026-09-16T02:30:00Z',
    clock: { ymd: '2026-09-16', dow: 3, hhmm: '09:30' },
    phase: 'classes',
    current: '3109503',
    html: { grid: true, today: 'พุธ', now: true, examNotice: false },
  },
  {
    name: 'a class week, Thursday 03:00 in Bangkok (still Wednesday on a phone in UTC)',
    at: '2026-09-16T20:00:00Z',
    clock: { ymd: '2026-09-17', dow: 4, hhmm: '03:00' },
    phase: 'classes',
    current: null,
    html: { grid: true, today: 'พฤหัสบดี', now: false, examNotice: false },
  },
  {
    name: 'the midterm week, Monday 10:00 in Bangkok',
    at: '2026-09-21T03:00:00Z',
    clock: { ymd: '2026-09-21', dow: 1, hhmm: '10:00' },
    phase: 'midterm',
    current: null,
    html: { grid: false, today: null, now: false, examNotice: true },
  },
  {
    name: 'the first minutes of the midterm week (still Sunday in UTC)',
    at: '2026-09-20T17:30:00Z',
    clock: { ymd: '2026-09-21', dow: 1, hhmm: '00:30' },
    phase: 'midterm',
    current: null,
    html: { grid: false, today: null, now: false, examNotice: true },
  },
  {
    name: 'the last evening of the midterm week',
    at: '2026-09-25T16:30:00Z',
    clock: { ymd: '2026-09-25', dow: 5, hhmm: '23:30' },
    phase: 'midterm',
    current: null,
    html: { grid: false, today: null, now: false, examNotice: true },
  },
  {
    name: 'the day after the midterm week is a class day again',
    at: '2026-09-25T17:30:00Z',
    clock: { ymd: '2026-09-26', dow: 6, hhmm: '00:30' },
    phase: 'classes',
    current: null,
    html: { grid: true, today: null, now: false, examNotice: false },
  },
  {
    name: 'the final week, Monday in Bangkok',
    at: '2026-11-23T03:00:00Z',
    clock: { ymd: '2026-11-23', dow: 1, hhmm: '10:00' },
    phase: 'final',
    current: null,
    html: { grid: false, today: null, now: false, examNotice: true },
  },
  {
    name: 'the last minute of the final week',
    at: '2026-12-04T16:59:00Z',
    clock: { ymd: '2026-12-04', dow: 5, hhmm: '23:59' },
    phase: 'final',
    current: null,
    html: { grid: false, today: null, now: false, examNotice: true },
  },
  {
    name: 'midnight after the last paper, the term is over',
    at: '2026-12-04T17:00:00Z',
    clock: { ymd: '2026-12-05', dow: 6, hhmm: '00:00' },
    phase: 'after',
    current: null,
    html: null,
  },
  {
    name: 'weeks after the finals',
    at: '2027-01-12T03:00:00Z',
    clock: { ymd: '2027-01-12', dow: 2, hhmm: '10:00' },
    phase: 'after',
    current: null,
    html: null,
  },
];

// What the screen prints and which class is on, using only what shipped
// before: the component and getCurrentClass. Written as one function so the
// zone replays can run the same source in a child process.
function observeScreen(api, at) {
  const now = new Date(at);
  const html = api.render({ year: 5, now });
  const todayTag = /<strong[^>]*>([^<]+)<\/strong><span[^>]*>วันนี้<\/span>/.exec(html);
  return {
    current: api.getCurrentClass(5, now)?.code ?? null,
    html: html === '' ? null : {
      grid: html.includes('MILK HYGIENE AND MEAT INSPECTION'),
      today: todayTag ? todayTag[1] : null,
      now: html.includes('กำลังเรียน'),
      examNotice: html.includes('ช่วงสอบ งดเรียนตามตาราง'),
      title: html.includes('ตารางเรียนสัปดาห์นี้'),
    },
  };
}

// The Bangkok day, weekday and clock, and the phase of the term.
function observeClock(api, at) {
  const now = new Date(at);
  return { clock: api.bangkokClock(now), phase: api.termPhase(now).phase };
}

function assertScreen(seen, c, where) {
  assert.equal(seen.current, c.current, `${c.name}: the class in progress (${where})`);
  assert.deepEqual(seen.html, c.html && { ...c.html, title: true }, `${c.name}: what the timetable prints (${where})`);
}

function assertClock(seen, c, where) {
  assert.deepEqual(seen.clock, c.clock, `${c.name}: the Bangkok clock (${where})`);
  assert.equal(seen.phase, c.phase, `${c.name}: the term phase (${where})`);
}

const loadApi = async () => (await import(pathToFileURL(outfile).href)).default;

test('in this process, the screen shows what Bangkok is doing', async () => {
  const api = await loadApi();
  for (const c of CASES) assertScreen(observeScreen(api, c.at), c, 'in-process');
});

test('in this process, the Bangkok clock and the term phase', async () => {
  const api = await loadApi();
  for (const c of CASES) assertClock(observeClock(api, c.at), c, 'in-process');
});

for (const tz of ['UTC', 'America/Los_Angeles', 'Pacific/Auckland', 'Asia/Tokyo']) {
  test(`the same answers under TZ=${tz}`, () => {
    const script = `
      const api = (await import(${JSON.stringify(pathToFileURL(outfile).href)})).default;
      const observeScreen = ${observeScreen.toString()};
      const observeClock = ${observeClock.toString()};
      const cases = ${JSON.stringify(CASES.map((c) => c.at))};
      process.stdout.write(JSON.stringify({
        tz: Intl.DateTimeFormat().resolvedOptions().timeZone,
        screen: cases.map((at) => observeScreen(api, at)),
        clock: cases.map((at) => { try { return observeClock(api, at); } catch (e) { return { error: String(e) }; } }),
      }));
    `;
    const run = spawnSync(process.execPath, ['--input-type=module', '-e', script], {
      env: { ...process.env, TZ: tz },
      encoding: 'utf8',
    });
    assert.equal(run.status, 0, run.stderr);
    const { tz: seen, screen, clock } = JSON.parse(run.stdout);
    assert.equal(seen, tz, 'the child really ran in the zone under test');
    CASES.forEach((c, i) => assertScreen(screen[i], c, `TZ=${tz}`));
    CASES.forEach((c, i) => assertClock(clock[i], c, `TZ=${tz}`));
  });
}

test('the exam notice names the period it is in', async () => {
  const api = await loadApi();
  assert.match(api.render({ year: 5, now: new Date('2026-09-22T03:00:00Z') }), /สอบกลางภาค 21-25 ก\.ย\. 69/);
  assert.match(api.render({ year: 5, now: new Date('2026-11-30T03:00:00Z') }), /สอบปลายภาค 23 พ\.ย\. - 4 ธ\.ค\. 69/);
});

test('once the term is over no class is offered anywhere', async () => {
  const api = await loadApi();
  const schedule = await import('../../src/data/schedule.js');
  const after = new Date('2027-01-12T03:00:00Z');
  assert.equal(api.getCurrentClass(5, after), null);
  assert.deepEqual(schedule.getClassesForDay(5, after), []);
  assert.equal(schedule.getNextClass(5, after), null, 'the Home chip has nothing stale to offer');
  // A class week inside the term is untouched.
  assert.ok(schedule.getClassesForDay(5, new Date(2026, 8, 16, 12, 0)).length > 0);
});

test('a year with no timetable still renders nothing', async () => {
  const api = await loadApi();
  assert.equal(api.render({ year: 1, now: new Date('2026-09-16T03:00:00Z') }), '');
});
