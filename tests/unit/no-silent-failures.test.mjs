// Nothing fails silently (15 Nov 2026). Each test here fails if one swallow found that night
// comes back: work said to be saved that was not, an empty screen standing in for "could not
// load", a refusal asked again on every render, and failures nobody could see at all.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { scrubMessage, diagnosticRecord, installClientDiagnostics, FAILURE_KINDS } from '../../src/lib/client-diagnostics.js';
import { reportFailure, FAILURE_EVENT } from '../../src/lib/report-failure.js';
import { isAccessRefusal } from '../../src/lib/library.js';
import { automationVerdict, recordMissing, AUTOMATIONS, runsUrl } from '../../src/lib/failure-report.js';

const src = (p) => readFileSync(new URL(`../../${p}`, import.meta.url), 'utf8').replace(/\r\n/g, '\n');

test('a scrubbed message keeps the shape of the failure and nothing of a person', () => {
  assert.equal(scrubMessage("Cannot read properties of undefined (reading 'name')"), "Cannot read properties of undefined (reading '…')");
  assert.equal(scrubMessage('ข้อความของนิสิต failed at row 6512345678'), '… failed at row #');
  assert.equal(scrubMessage('mail a.b+c@student.chula.ac.th at https://vetmock.com/app?x=1'), 'mail <mail> at <url>');
  assert.equal(scrubMessage('Unexpected token "my answer is B" in JSON'), 'Unexpected token "…" in JSON');
  assert.ok(scrubMessage('x'.repeat(500)).length <= 120);
  assert.equal(scrubMessage(undefined), '');
});

test('save, sync, chunk and load failures are counted like thrown errors', async () => {
  for (const kind of ['save', 'sync', 'chunk', 'load']) assert.ok(FAILURE_KINDS.includes(kind));
  assert.equal(diagnosticRecord({ name: 'QuotaExceededError' }, 'notes', 'save').category, 'QuotaExceededError');
  assert.equal(diagnosticRecord({}, 'notes', 'something-else').kind, 'error');
  const target = new EventTarget(), sent = [];
  const stop = installClientDiagnostics({ target, getView: () => 'notes', send: (v) => sent.push(v) });
  reportFailure('save', Object.assign(new Error('The quota has been exceeded.'), { name: 'QuotaExceededError' }), target);
  await Promise.resolve(); await Promise.resolve();
  assert.deepEqual(sent.map((v) => [v.kind, v.category, v.message]), [['save', 'QuotaExceededError', 'The quota has been exceeded.']]);
  stop();
  assert.equal(FAILURE_EVENT, 'vmx-failure');
  assert.doesNotThrow(() => reportFailure('save', null, null), 'reporting never throws');
});

test('failure counts run for every visitor, not only after an analytics opt-in', () => {
  const app = src('src/App.jsx');
  const block = app.slice(app.indexOf("import('./lib/client-diagnostics.js')") - 400, app.indexOf("import('./lib/client-diagnostics.js')") + 300);
  assert.match(block, /if \(IS_LOCAL_HOST\) return;/);
  assert.doesNotMatch(block, /analyticsAllowed/);
  assert.match(src('src/components/ErrorBoundary.jsx'), /detail: \{ name: error\?\.name, message: error\?\.message \}/);
});

test('the endpoint scrubs again and logs why it could not record', () => {
  const api = src('api/client-diagnostic.js');
  assert.match(api, /diagnosticRecord\(\{ name: body\.category, message: body\.message \}/);
  assert.match(api, /console\.error\('client-diagnostic: could not record'/);
  assert.doesNotMatch(api, /catch \{ return res\.status\(503\)/);
});

test('a refusal from the sign-in wall is remembered until the account changes', () => {
  assert.equal(isAccessRefusal({ code: '42501', message: 'chula_member_required' }), true);
  assert.equal(isAccessRefusal(new Error('wrapped', { cause: { code: '42501' } })), true);
  assert.equal(isAccessRefusal({ status: 401 }), true);
  assert.equal(isAccessRefusal({ code: '57014', message: 'statement timeout' }), false, 'an outage is asked again');
  assert.equal(isAccessRefusal(new TypeError('Failed to fetch')), false);
  const lib = src('src/lib/library.js');
  assert.match(lib, /if \(!isAccessRefusal\(err\)\) _catalogPromise = null;/);
  assert.match(lib, /if \(!isAccessRefusal\(error\)\) _related\.delete\(key\);/);
  assert.match(lib, /_related\.clear\(\);/);
});

test('an account the sign-up trigger left without a profile is repaired, and a failed repair is counted', () => {
  const auth = src('src/hooks/useAuth.js');
  assert.match(auth, /if \(!cancelled && !unreachable && !repaired\) \{/);
  assert.match(auth, /rpc\('ensure_profile'\)/);
  assert.match(auth, /reportFailure\('load', \{ name: 'ProfileRepair'/);
});

test('an out-of-credit voice provider is skipped for the page, like an unconfigured one', () => {
  assert.match(src('src/lib/tts-iapp.js'), /response\.status === 503 \|\| response\.status === 402/);
});

test('the case library calls only a missing table empty', () => {
  const lib = src('src/components/lab/CaseLibrary.jsx');
  assert.match(lib, /isPreMigration = \['PGRST205', '42P01'\]\.includes/);
  assert.doesNotMatch(lib, /schema cache\|imaging_cases/);
});

test('an OSCE round that was not kept says so', () => {
  const osce = src('src/components/OSCEDrill.jsx');
  assert.match(osce, /setNotKept\(!saveAttempt\(/);
  assert.match(osce, /\{notKept && /);
  assert.doesNotMatch(osce, /setItem\(ATTEMPTS_KEY[^\n]*\n\s*\} catch \{\}/);
});

test('quests and XP that cannot be kept are counted for the owner', () => {
  assert.match(src('src/lib/quests.js'), /reportFailure\('save', error\)/);
  assert.match(src('src/lib/xp.js'), /reportFailure\('save', error\)/);
});

test('the admin screen reads the failure record and every automation, and an unreadable part says so', () => {
  assert.equal(recordMissing({ code: 'PGRST202' }), true);
  assert.equal(recordMissing({ code: '42501' }), false, 'a refusal is not "not installed"');
  const now = Date.parse('2026-11-15T12:00:00Z');
  const watch = AUTOMATIONS.find((a) => a.file === 'production-watch.yml');
  assert.equal(automationVerdict(watch, { status: 'completed', conclusion: 'success', created_at: '2026-11-15T06:41:00Z' }, now).state, 'ok');
  assert.equal(automationVerdict(watch, { status: 'completed', conclusion: 'success', created_at: '2026-11-14T06:41:00Z' }, now).state, 'late', 'a schedule that stopped running reads as late');
  assert.equal(automationVerdict(watch, { status: 'completed', conclusion: 'failure', created_at: '2026-11-15T11:00:00Z' }, now).state, 'failed');
  assert.equal(automationVerdict(watch, undefined, now).state, 'unknown');
  assert.match(runsUrl(watch), /actions\/workflows\/production-watch\.yml\/runs\?per_page=1&event=schedule$/);
  const admin = src('src/views/AdminView.jsx');
  assert.match(admin, /<AdminFailures tick=\{tick\} \/>/);
  const card = src('src/components/AdminFailures.jsx');
  assert.match(card, /adminRpc\('admin_failures', \{ p_hours: 24 \}\)/);
  assert.match(card, /record\.missing \?/);
});

test('the failure-record migration keeps no identity and never refuses a sign-up', () => {
  const sql = src('supabase/migrations/20261115230000_failure_record.sql');
  const table = sql.slice(sql.indexOf('create table if not exists private.account_setup_failures'), sql.indexOf(');', sql.indexOf('create table if not exists private.account_setup_failures')));
  assert.doesNotMatch(table, /user_id|email|name|uuid/i);
  for (const fn of ['handle_new_user', 'handle_new_user_data']) {
    const body = sql.slice(sql.indexOf(`FUNCTION public.${fn}()`));
    const handler = body.slice(body.indexOf('WHEN OTHERS THEN'), body.indexOf('END;', body.indexOf('WHEN OTHERS THEN')));
    assert.match(handler, /PERFORM private\.count_account_setup_failure/);
    assert.match(handler, /RETURN NEW;/, `${fn} still lets the sign-up through`);
  }
  assert.match(sql, /if not public\.is_admin\(\) then raise exception 'forbidden'/);
  assert.match(sql, /revoke all on function public\.admin_failures\(int\) from public, anon;/);
  assert.match(sql, /HOW TO COUNT BEFORE APPLYING/);
  assert.match(src('.github/workflows/smoke-e2e.yml'), /node scripts\/test-failure-record-db\.mjs --backend=postgres/);
});

test('a red automation reaches someone: an issue for every scheduled workflow and for Build on main', () => {
  const red = src('.github/workflows/scheduled-red.yml');
  const names = red.match(/workflows: \[([^\]]+)\]/)[1].split(',').map((s) => s.trim().replace(/^'|'$/g, ''));
  const declared = new Map();
  for (const file of ['production-watch.yml', 'dependency-updates.yml', 'android.yml', 'build.yml']) {
    const wf = src(`.github/workflows/${file}`);
    declared.set(file, wf.match(/^name: (.+)$/m)[1].trim());
  }
  for (const [file, name] of declared) assert.ok(names.includes(name), `${file} ("${name}") is watched`);
  for (const file of ['production-watch.yml', 'dependency-updates.yml', 'android.yml']) {
    assert.match(src(`.github/workflows/${file}`), /schedule:\n\s+- cron:/, `${file} runs on a schedule, so its silence would go unseen`);
  }
});

test('the dependency merge step fails its run when a merge did not happen', () => {
  const wf = src('.github/workflows/dependency-updates.yml');
  assert.match(wf, /could not be merged"; failed=1;/);
  assert.match(wf, /exit "\$failed"/);
  assert.doesNotMatch(wf, /headRefOid > "pr-\$n\.json" \|\| continue/);
});

test('the Android emulator stays on the build that last passed until a green run moves it', () => {
  assert.match(src('.github/workflows/android.yml'), /emulator-build: 16428233/);
});
