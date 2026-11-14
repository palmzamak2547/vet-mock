// ============================================================
// production-watch — the verdict the scheduled run gives the AI health answer
// ============================================================
// The workflow reads /api/ai-chat?health=1 and turns three words into red,
// a warning or nothing. The part that decides is plain shell between the
// `verdict:begin` and `verdict:end` markers, so this test runs that very text
// under bash with the variables the workflow's jq lines would set. It checks
// the case the watch exists for (the fallback's model retired: red, with a
// message that names where to change it) and the two that must not page
// anyone: no Anthropic key, and a model that could not be asked about.
// ============================================================

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

const yml = readFileSync('.github/workflows/production-watch.yml', 'utf8').replace(/\r\n/g, '\n');
const begin = yml.indexOf('# verdict:begin');
const end = yml.indexOf('# verdict:end');
assert.ok(begin > 0 && end > begin, 'the verdict block is marked in the workflow');
const block = yml.slice(yml.indexOf('\n', begin) + 1, end).split('\n').map((l) => l.replace(/^ {10}/, '')).join('\n');

function verdict({ health = 'ok', balance = 'available', model = 'served', code = '200' }) {
  const script = [
    'fail=0',
    'bad() { echo "::error::$1"; fail=1; }',
    `code='${code}'; health='${health}'; balance='${balance}'; model='${model}'`,
    block,
    'echo "FAIL=$fail"',
  ].join('\n');
  const run = spawnSync('bash', ['-c', script], { encoding: 'utf8' });
  assert.equal(run.status, 0, run.stderr);
  const lines = run.stdout.split('\n').filter(Boolean);
  return {
    red: lines.includes('FAIL=1'),
    errors: lines.filter((l) => l.startsWith('::error::')),
    warnings: lines.filter((l) => l.startsWith('::warning::')),
  };
}

test('served: green and silent', () => {
  const v = verdict({ model: 'served' });
  assert.deepEqual(v, { red: false, errors: [], warnings: [] });
});

test('retired: red, with a message that says what to change', () => {
  const v = verdict({ model: 'retired' });
  assert.equal(v.red, true);
  assert.equal(v.errors.length, 1);
  assert.match(v.errors[0], /no longer serves/);
  assert.match(v.errors[0], /ANTHROPIC_MODEL in api\/_lib\/llm\.js/);
  assert.match(v.errors[0], /AI_GRADER_MODEL/);
});

test('retired while DeepSeek is down too: the health word is down and the run is red once more', () => {
  const v = verdict({ model: 'retired', health: 'down', balance: 'empty' });
  assert.equal(v.red, true);
  assert.equal(v.errors.length, 3, 'balance, model and health each say their own thing');
  assert.match(v.errors[0], /DeepSeek balance is empty/);
  assert.match(v.errors[1], /no longer serves/);
});

test('cannot tell: a warning, never red', () => {
  const v = verdict({ model: 'unknown', health: 'ok' });
  assert.equal(v.red, false);
  assert.deepEqual(v.errors, []);
  assert.equal(v.warnings.length, 1);
  assert.match(v.warnings[0], /could not be asked/);
  assert.match(v.warnings[0], /not a retirement/);
});

test('no Anthropic key is a supported state: green and silent', () => {
  assert.deepEqual(verdict({ model: 'none' }), { red: false, errors: [], warnings: [] });
});

test('an older deployment with no model field is not a failure', () => {
  assert.deepEqual(verdict({ model: 'unreadable' }), { red: false, errors: [], warnings: [] });
});

test('the existing verdicts are unchanged', () => {
  assert.equal(verdict({ balance: 'empty', health: 'degraded' }).red, true, 'an empty DeepSeek balance is red');
  assert.equal(verdict({ health: 'down', balance: 'none', model: 'none' }).red, true);
  assert.equal(verdict({ health: 'unreadable', balance: 'unreadable', model: 'unreadable', code: '503' }).red, true);
  const degraded = verdict({ health: 'degraded', balance: 'unknown', model: 'served' });
  assert.equal(degraded.red, false);
  assert.equal(degraded.warnings.length, 1);
});
