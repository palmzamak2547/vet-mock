// ============================================================
// dependabot-merge-gate.mjs — may this Dependabot pull request merge itself now?
// ============================================================
// Read by .github/workflows/dependency-updates.yml, which runs it from main
// (never from the pull request) once per open Dependabot pull request:
//
//   node scripts/dependabot-merge-gate.mjs <pr.json> <pass|wait>
//
// <pr.json> is `gh pr view --json author,isDraft,createdAt,commits`, and the
// second argument says whether its required checks are all green. It prints
// one line, "merge: why" or "wait: why", and always exits 0. Anything it
// cannot read is a "wait": a person can always merge by hand, while a wrong
// merge reaches every student at once.
//
// A pull request merges only when all of these hold:
//   - Dependabot opened it and wrote its only commit (nobody added a commit);
//   - every dependency it moves is a minor or patch update, as Dependabot's
//     own commit message states (a major, or a missing level, waits for a person);
//   - it is not a draft (marking it draft is how a person holds one);
//   - its required checks are green;
//   - no exam is near: from FREEZE_DAYS_BEFORE days before an exam period of
//     the current term starts until that period ends, Bangkok time. The
//     periods come from src/data/semester.js, so a new term needs no edit here;
//   - it has been open SOAK_HOURS, so a person has two days to stop it.
// ============================================================
import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { SEMESTER } from '../src/data/semester.js';

export const FREEZE_DAYS_BEFORE = 7;
export const SOAK_HOURS = 48;
const DAY = 24 * 60 * 60 * 1000;
const BOTS = new Set(['dependabot', 'dependabot[bot]', 'app/dependabot']);

/** Midnight at the start of a YYYY-MM-DD day in Bangkok, as epoch ms. */
function bangkokMidnight(ymd) {
  const ms = /^\d{4}-\d{2}-\d{2}$/.test(ymd || '') ? Date.parse(`${ymd}T00:00:00+07:00`) : NaN;
  if (Number.isNaN(ms)) throw new Error(`exam period date ${JSON.stringify(ymd)} is not YYYY-MM-DD`);
  return ms;
}

const bangkokDay = (ms) => new Date(ms + 7 * 60 * 60 * 1000).toISOString().slice(0, 10);

/**
 * The exam freeze around `now`: every `*Period` of the term with a start and an
 * end freezes merges from FREEZE_DAYS_BEFORE days before its first day until
 * its last day is over. Throws on a period whose dates do not parse.
 */
export function examFreeze(now, semester = SEMESTER) {
  for (const [key, period] of Object.entries(semester || {})) {
    if (!/Period$/.test(key) || !period || (!period.start && !period.end)) continue;
    const from = bangkokMidnight(period.start) - FREEZE_DAYS_BEFORE * DAY;
    const until = bangkokMidnight(period.end) + DAY;
    if (until <= from) throw new Error(`${key} ends before it starts`);
    if (now >= from && now < until) {
      return { frozen: true, period: period.labelTh || key, from, until, mergesFrom: bangkokDay(until) };
    }
  }
  return { frozen: false };
}

/**
 * The update level of every dependency a Dependabot commit message lists in
 * its `updated-dependencies:` block, e.g. ['version-update:semver-minor'];
 * null for an entry that names no level.
 */
export function updateTypes(message) {
  const text = String(message || '').replace(/\r\n/g, '\n');
  const at = text.indexOf('updated-dependencies:');
  if (at < 0) return [];
  return text.slice(at).split(/\n-\s+dependency-name:/).slice(1)
    .map((entry) => entry.match(/\n\s+update-type:\s*([\w:-]+)/)?.[1] ?? null);
}

const SAFE_LEVELS = new Set(['version-update:semver-minor', 'version-update:semver-patch']);

/** The decision for one pull request: { merge, reason }. */
export function decide({ pr, checks, now = Date.now(), semester = SEMESTER }) {
  const wait = (reason) => ({ merge: false, reason });
  if (!BOTS.has(pr?.author?.login)) return wait('not opened by Dependabot');
  const commits = pr.commits || [];
  if (commits.length !== 1) return wait(`${commits.length} commits: a person changed it, so a person merges it`);
  const authors = (commits[0].authors || []).map((a) => a.login);
  if (!authors.length || !authors.every((login) => BOTS.has(login))) return wait('a commit not written by Dependabot');

  const levels = updateTypes(`${commits[0].messageHeadline || ''}\n\n${commits[0].messageBody || ''}`);
  if (!levels.length) return wait('the commit message lists no updated dependency');
  const unsafe = levels.filter((level) => !SAFE_LEVELS.has(level));
  if (unsafe.length) return wait(`${unsafe.map((l) => l || 'unknown level').join(', ')}: a major update waits for a person`);

  if (pr.isDraft) return wait('draft: a person is holding it');
  if (checks !== 'pass') return wait('required checks are not all green');

  const freeze = examFreeze(now, semester);
  if (freeze.frozen) return wait(`exam freeze (${freeze.period}): merges from ${freeze.mergesFrom}`);

  const opened = Date.parse(pr.createdAt);
  if (Number.isNaN(opened)) return wait('no opening time');
  if (now - opened < SOAK_HOURS * 60 * 60 * 1000) {
    return wait(`open less than ${SOAK_HOURS} h, merges from ${new Date(opened + SOAK_HOURS * 3600000).toISOString()}`);
  }
  return { merge: true, reason: `${levels.length} minor/patch update(s), checks green, no exam near` };
}

if (import.meta.url === pathToFileURL(process.argv[1] || '').href) {
  try {
    const pr = JSON.parse(readFileSync(process.argv[2], 'utf8'));
    const { merge, reason } = decide({ pr, checks: process.argv[3] });
    console.log(`${merge ? 'merge' : 'wait'}: ${reason}`);
  } catch (err) {
    console.log(`wait: could not decide (${err.message})`);
  }
}
