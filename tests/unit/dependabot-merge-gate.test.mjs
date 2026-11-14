// The gate that lets a Dependabot pull request merge itself
// (scripts/dependabot-merge-gate.mjs, run by .github/workflows/dependency-updates.yml).
// Every instant here is written with its Bangkok offset, so the suite reads the
// same under TZ=UTC on the runner as on a Bangkok laptop.
import test from 'node:test';
import assert from 'node:assert/strict';
import { decide, examFreeze, updateTypes, FREEZE_DAYS_BEFORE, SOAK_HOURS } from '../../scripts/dependabot-merge-gate.mjs';
import { SEMESTER } from '../../src/data/semester.js';

const at = (s) => Date.parse(s);
const HOUR = 60 * 60 * 1000;

const message = (...levels) => [
  'Bump the npm-production group across 5 directories with 2 updates',
  '',
  'Bumps the npm-production group with 2 updates.',
  '',
  '---',
  'updated-dependencies:',
  ...levels.flatMap((level, i) => [
    `- dependency-name: pkg-${i}`,
    '  dependency-version: 1.2.3',
    '  dependency-type: direct:production',
    ...(level ? [`  update-type: ${level}`] : []),
    '  dependency-group: npm-production',
  ]),
  '...',
].join('\n');

const pr = ({ levels = ['version-update:semver-minor', 'version-update:semver-patch'], createdAt = '2027-01-10T03:00:00Z', ...rest } = {}) => {
  const [messageHeadline, ...body] = message(...levels).split('\n');
  return {
    author: { login: 'app/dependabot', is_bot: true },
    isDraft: false,
    createdAt,
    commits: [{ authors: [{ login: 'dependabot[bot]' }], messageHeadline, messageBody: body.join('\n') }],
    ...rest,
  };
};

const OUT_OF_TERM = at('2027-01-15T10:00:00+07:00');

test('the term data the rule reads is the calendar file', () => {
  assert.equal(SEMESTER.finalPeriod.start, '2026-11-23');
  assert.equal(SEMESTER.finalPeriod.end, '2026-12-04');
  assert.equal(FREEZE_DAYS_BEFORE, 7);
});

test('the freeze runs from 7 days before an exam period until its last day ends, Bangkok time', () => {
  assert.equal(examFreeze(at('2026-11-15T23:59:59+07:00')).frozen, false);
  assert.equal(examFreeze(at('2026-11-16T00:00:00+07:00')).frozen, true);
  assert.equal(examFreeze(at('2026-11-15T17:00:00Z')).frozen, true, '16 Nov 00:00 Bangkok written in UTC');
  for (let t = at('2026-11-16T00:00:00+07:00'); t < at('2026-12-05T00:00:00+07:00'); t += HOUR) {
    assert.equal(examFreeze(t).frozen, true, new Date(t).toISOString());
  }
  assert.equal(examFreeze(at('2026-12-04T23:59:59+07:00')).mergesFrom, '2026-12-05');
  assert.equal(examFreeze(at('2026-12-05T00:00:00+07:00')).frozen, false);
  // The midterm period of the same term freezes the same way.
  assert.equal(examFreeze(at('2026-09-13T23:59:59+07:00')).frozen, false);
  assert.equal(examFreeze(at('2026-09-14T00:00:00+07:00')).frozen, true);
  assert.equal(examFreeze(at('2026-09-25T23:59:59+07:00')).frozen, true);
  assert.equal(examFreeze(at('2026-09-26T00:00:00+07:00')).frozen, false);
});

test('next term needs no edit: the freeze follows whatever periods the calendar holds', () => {
  const next = { id: '2569-2', midtermPeriod: { start: '2027-03-01', end: '2027-03-05' }, finalPeriod: { start: '2027-05-10', end: '2027-05-21' } };
  assert.equal(examFreeze(at('2027-02-22T00:00:00+07:00'), next).frozen, true);
  assert.equal(examFreeze(at('2027-02-21T23:00:00+07:00'), next).frozen, false);
  assert.equal(examFreeze(at('2027-05-21T22:00:00+07:00'), next).frozen, true);
  assert.equal(examFreeze(at('2027-05-22T00:00:00+07:00'), next).frozen, false);
  assert.equal(examFreeze(OUT_OF_TERM, { id: 'x' }).frozen, false, 'a term with no exam periods freezes nothing');
});

test('a calendar date that does not parse never lets a merge through', () => {
  const broken = { finalPeriod: { start: '23 Nov 2026', end: '2026-12-04' } };
  assert.throws(() => examFreeze(OUT_OF_TERM, broken));
  assert.throws(() => decide({ pr: pr(), checks: 'pass', now: OUT_OF_TERM, semester: broken }));
});

test('today, 14 Nov 2026: an update opened now cannot merge itself before the finals end on 4 Dec', () => {
  const opened = '2026-11-14T03:00:00Z'; // 10:00 Bangkok
  const p = pr({ createdAt: opened });
  assert.match(decide({ pr: p, checks: 'pass', now: at(opened) }).reason, /open less than 48 h/);
  for (let t = at(opened); t < at('2026-12-05T00:00:00+07:00'); t += HOUR) {
    const verdict = decide({ pr: p, checks: 'pass', now: t });
    assert.equal(verdict.merge, false, `${new Date(t).toISOString()}: ${verdict.reason}`);
  }
  assert.match(decide({ pr: p, checks: 'pass', now: at('2026-11-16T10:00:00+07:00') }).reason, /exam freeze .* merges from 2026-12-05/);
  assert.equal(decide({ pr: p, checks: 'pass', now: at('2026-12-05T00:00:00+07:00') }).merge, true);
});

test('a green minor or patch update merges once it has been open 48 hours', () => {
  const p = pr({ createdAt: '2027-01-10T03:00:00Z' });
  assert.equal(SOAK_HOURS, 48);
  assert.equal(decide({ pr: p, checks: 'pass', now: at('2027-01-12T02:59:59Z') }).merge, false);
  assert.deepEqual(decide({ pr: p, checks: 'pass', now: at('2027-01-12T03:00:00Z') }).merge, true);
});

test('a major update never merges itself, nor one whose level is unknown', () => {
  for (const levels of [['version-update:semver-major'], ['version-update:semver-patch', 'version-update:semver-major'], [null], []]) {
    const verdict = decide({ pr: pr({ levels }), checks: 'pass', now: OUT_OF_TERM });
    assert.equal(verdict.merge, false, JSON.stringify(levels));
  }
  assert.match(decide({ pr: pr({ levels: ['version-update:semver-major'] }), checks: 'pass', now: OUT_OF_TERM }).reason, /waits for a person/);
});

test('red or pending checks, a draft, another author or a commit a person added all wait', () => {
  const base = pr();
  assert.equal(decide({ pr: base, checks: 'pass', now: OUT_OF_TERM }).merge, true);
  assert.equal(decide({ pr: base, checks: 'wait', now: OUT_OF_TERM }).merge, false);
  assert.equal(decide({ pr: { ...base, isDraft: true }, checks: 'pass', now: OUT_OF_TERM }).merge, false);
  assert.equal(decide({ pr: { ...base, author: { login: 'palmzamak2547' } }, checks: 'pass', now: OUT_OF_TERM }).merge, false);
  const added = { ...base, commits: [...base.commits, { authors: [{ login: 'palmzamak2547' }], messageHeadline: 'fix', messageBody: '' }] };
  assert.equal(decide({ pr: added, checks: 'pass', now: OUT_OF_TERM }).merge, false);
  const rewritten = { ...base, commits: [{ ...base.commits[0], authors: [{ login: 'palmzamak2547' }] }] };
  assert.equal(decide({ pr: rewritten, checks: 'pass', now: OUT_OF_TERM }).merge, false);
});

test('update levels are read from the updated-dependencies block, CRLF or not', () => {
  assert.deepEqual(updateTypes(message('version-update:semver-minor', null)), ['version-update:semver-minor', null]);
  assert.deepEqual(updateTypes(message('version-update:semver-patch').replace(/\n/g, '\r\n')), ['version-update:semver-patch']);
  assert.deepEqual(updateTypes('Bump react from 18.3.1 to 18.3.2'), []);
});
