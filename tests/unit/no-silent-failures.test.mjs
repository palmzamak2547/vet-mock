// Nothing fails silently (15 Nov 2026). Each test here fails if one swallow found that night
// comes back: work said to be saved that was not, an empty screen standing in for "could not
// load", a refusal asked again on every render, and failures nobody could see at all.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { safeMessage, safeFrame, diagnosticRecord, installClientDiagnostics, FAILURE_KINDS, DIAGNOSTIC_FIELDS } from '../../src/lib/client-diagnostics.js';
import { reportFailure, FAILURE_EVENT } from '../../src/lib/report-failure.js';
import { isAccessRefusal } from '../../src/lib/library.js';
import { createRefusalMemory, REFUSAL_TTL_MS } from '../../src/lib/refusal-memory.js';
import { automationVerdict, recordMissing, AUTOMATIONS, runsUrl } from '../../src/lib/failure-report.js';

const src = (p) => readFileSync(new URL(`../../${p}`, import.meta.url), 'utf8').replace(/\r\n/g, '\n');

// Personal or secret text, each with the fragment that must never be stored. The first
// group is the second reader's own leak cases on the earlier scrubber (review of #284).
const JWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjMiLCJlbWFpbCI6InNvbWNoYWkua0BzdHVkZW50LmNodWxhLmFjLnRoIn0.c2lnbmF0dXJl';
const LEAKS = [
  ['Failed for user somchai.k in group VetA', ['somchai', 'VetA']],
  [`${JWT} is not a function`, ['eyJ', 'IUzI']],
  ['Cannot load /storage/v1/object/sign/lib/Somchai_notes.pdf?token=abcDEF', ['Somchai', 'abcDEF', 'storage']],
  ['Bad link www.vetmock.com/app/doc/x?ticket=QWErty', ['QWErty', 'vetmock.com']],
  [`Cannot read properties of undefined (reading '${'private answer text '.repeat(30)}`, ['private answer']],
  ['สมชาย ใจดี is not a function', ['สมชาย', 'ใจดี']],
  ['Lookup failed for 6512345678', ['6512345678']],
  ['Invite sent to somchai.k@student.chula.ac.th', ['somchai', 'chula']],
  ['Refresh failed: sbp_a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6', ['sbp_', 'a1b2c3']],
  ['Failed to fetch https://abc.supabase.co/storage/v1/object/sign/x.pdf?token=eyJxyz.abc&expires=1', ['token', 'eyJxyz', 'supabase']],
  ['Could not open "Lecture 5 Canine Parvovirus Somchai notes.pdf"', ['Lecture', 'Parvovirus', 'Somchai']],
  ['The answer is that the dog has parvovirus and needs fluids', ['answer', 'parvovirus', 'fluids']],
  ['คำตอบคือสุนัขเป็นโรคลำไส้อักเสบจากไวรัส', ['คำตอบ', 'สุนัข']],
];

test('a message is stored only when the engine or the browser wrote it; everything else is a hash', () => {
  for (const [text, fragments] of LEAKS) {
    const record = diagnosticRecord({ name: 'TypeError', message: text, stack: `TypeError: ${text}\n    at f (https://vetmock.com/doc?name=${encodeURIComponent(text)}:1:2)` }, '/app/doc/secret', 'error');
    const stored = JSON.stringify(record);
    for (const f of fragments) assert.ok(!stored.includes(f), `"${f}" must not be stored (from ${text.slice(0, 40)})`);
    assert.equal(record.view, 'other', 'an address never becomes the page');
    assert.equal(record.frame, '', 'a frame that is not one of our bundle files is dropped');
  }
  const hashed = safeMessage('Failed for user somchai.k in group VetA');
  assert.match(hashed, /^h:[0-9a-f]{8}$/);
  assert.equal(safeMessage('Failed for user somchai.k in group VetA'), hashed, 'the same text always gives the same hash');
  assert.equal(safeMessage(hashed), hashed, 'the endpoint can apply the rule again');
});

test('engine and browser messages keep their shape, with data replaced by a mark', () => {
  const kept = [
    ["Cannot read properties of undefined (reading 'name')", "Cannot read properties of undefined (reading '…')"],
    ['this.props.onSave is not a function', 'this.props.onSave is not a function'],
    ['Failed to fetch', 'Failed to fetch'],
    ['Loading chunk 123 failed.', 'Loading chunk 123 failed.'],
    ['Failed to fetch dynamically imported module: https://vetmock.com/assets/x-abc.js?v=2', 'Failed to fetch dynamically imported module: <url>'],
    ['The quota has been exceeded.', 'The quota has been exceeded.'],
    [`Unexpected token '<', "<!doctype "... is not valid JSON`, `Unexpected token '…', "…"... is not valid JSON`],
    ['HTTP 503', 'HTTP 503'],
  ];
  for (const [text, out] of kept) {
    assert.equal(safeMessage(text), out);
    assert.equal(safeMessage(out), out, 'stable when applied again on arrival');
  }
  assert.equal(safeMessage(undefined), '');
  assert.equal(safeFrame('TypeError: x\n    at f (https://vetmock.com/assets/index-Ab12.js?v=1:12:345)'), 'assets/index-Ab12.js:12:345');
  assert.equal(safeFrame('at f (https://evil.example/steal.js:1:2)'), '');
  // Only this site's own bundle: an extension's frame or another site's script
  // is dropped even when its path ends in assets/x.js, and the first own frame
  // below them is the one kept.
  const extension = 'TypeError: x\n    at e (chrome-extension://abcdefghijklmnop/assets/content-Zz9.js:3:14)';
  assert.equal(safeFrame(extension), '');
  assert.equal(safeFrame('at e (moz-extension://1234-5678/assets/inject.js:1:1)'), '');
  const thirdParty = 'at t (https://cdn.example.com/assets/tracker-Q1.js:7:8)';
  assert.equal(safeFrame(thirdParty), '');
  assert.equal(safeFrame(`${extension}\n${thirdParty}\n    at g (https://vetmock.com/assets/index-Ab12.js:40:2)`), 'assets/index-Ab12.js:40:2');
  // A preview deployment counts its own origin as ours, and no other.
  const preview = 'https://vet-mock-git-x.vercel.app';
  assert.equal(safeFrame(`at g (${preview}/assets/index-P.js:1:2)`, preview), 'assets/index-P.js:1:2');
  assert.equal(safeFrame('at g (https://vet-mock-git-y.vercel.app/assets/index-P.js:1:2)', preview), '');
});

test('the privacy page names every stored field, and only those', () => {
  const record = diagnosticRecord({ name: 'TypeError', message: 'Failed to fetch' }, 'home', 'error');
  assert.deepEqual(Object.keys(record).sort(), Object.keys(DIAGNOSTIC_FIELDS).sort(), 'a new field needs its words on the privacy page');
  const page = src('src/views/PrivacyView.jsx');
  const sentence = page.match(/<p data-diagnostic-fields>([^<]+)<\/p>/)?.[1];
  assert.ok(sentence, 'the privacy page has the stored-fields sentence');
  for (const [field, words] of Object.entries(DIAGNOSTIC_FIELDS)) assert.ok(sentence.includes(words), `${field}: "${words}" is on the privacy page`);
  assert.match(sentence, /รหัสสั้นแทน ไม่เก็บตัวข้อความ/);
  assert.match(sentence, /ไม่เก็บชื่อ อีเมล บัญชี คำตอบ หรือโน้ตของใคร/);
  assert.match(sentence, /ไม่ใช่ที่อยู่เว็บ/);
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
  assert.match(src('src/components/ErrorBoundary.jsx'), /detail: \{ name: error\?\.name, message: error\?\.message, stack: error\?\.stack \}/);
});

test('the endpoint applies the same rule on arrival, refuses a large body and logs why it could not record', () => {
  const api = src('api/client-diagnostic.js');
  assert.match(api, /diagnosticRecord\(\{ name: body\.category, message: body\.message, stack: body\.frame \}/);
  assert.match(api, /JSON\.stringify\(body\)\.length > 512\) return res\.status\(413\)/);
  assert.match(api, /console\.error\('client-diagnostic: could not record'/);
  assert.doesNotMatch(api, /catch \{ return res\.status\(503\)/);
});

test('what counts as a refusal from the sign-in wall', () => {
  assert.equal(isAccessRefusal({ code: '42501', message: 'chula_member_required' }), true);
  assert.equal(isAccessRefusal(new Error('wrapped', { cause: { code: '42501' } })), true);
  assert.equal(isAccessRefusal({ status: 401 }), true);
  assert.equal(isAccessRefusal({ code: '57014', message: 'statement timeout' }), false, 'an outage is asked again');
  assert.equal(isAccessRefusal(new TypeError('Failed to fetch')), false);
});

test('a refusal is remembered only while signed out, and expires by itself', () => {
  let t = 1000;
  const memory = createRefusalMemory({ now: () => t });
  assert.equal(memory.remember(true), false, 'a signed-in member is never held refused');
  assert.equal(memory.held(), false);
  assert.equal(memory.remember(false), true);
  assert.equal(memory.expired(), false);
  t += REFUSAL_TTL_MS + 1;
  assert.equal(memory.expired(), true, 'asked again after a short while, with no reload');
  assert.equal(memory.held(), false);
  memory.remember(false);
  assert.equal(memory.forget(), true, 'retry and auth events forget it');
  assert.equal(memory.held(), false);
  assert.ok(REFUSAL_TTL_MS <= 2 * 60_000);
});

test('the library forgets a refusal on sign-in, token refresh, any auth event and the retry button', () => {
  const lib = src('src/lib/library.js');
  assert.match(lib, /_catalogRefusal\.remember\(_librarySignedIn\)/);
  assert.match(lib, /_relatedRefusal\.remember\(_librarySignedIn\)/);
  assert.match(lib, /if \(_catalogRefusal\.expired\(\)\) _catalogPromise = null;/);
  assert.match(lib, /window\.addEventListener\('vmx-auth-state', \(\) => forgetLibraryRefusals\(\)\)/);
  const auth = src('src/hooks/useAuth.js');
  const handler = auth.slice(auth.indexOf('onAuthStateChange((event, s) => {'), auth.indexOf('subscriptionRef.current = data.subscription'));
  assert.match(handler, /dispatchEvent\(new CustomEvent\('vmx-auth-state', \{ detail: \{ event \} \}\)\)/, 'every event: SIGNED_IN, TOKEN_REFRESHED, SIGNED_OUT');
  assert.doesNotMatch(handler.slice(0, handler.indexOf("'vmx-auth-state'")), /if \(event ===[^\n]*\n[^\n]*vmx-auth-state/, 'not limited to one event');
  const view = src('src/views/LibraryView.jsx');
  assert.equal((view.match(/onClick=\{\(\) => \{ forgetLibraryRefusals\(\); setError\(null\);/g) || []).length, 2, 'both retry buttons ask again');
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

test('a failed Android measurement says where it stopped, in the summary and on the pull request', () => {
  const wf = src('.github/workflows/android.yml');
  assert.match(wf, /cat measure-out\/failure\.txt/);
  assert.doesNotMatch(wf, /no results, see the Measure step/);
  const measure = src('mobile/scripts/measure.py');
  assert.match(measure, /\(out \/ "failure\.txt"\)\.write_text/);
  assert.match(measure, /except BaseException as e:[\s\S]*raise$/m, 'the step still fails');
});
