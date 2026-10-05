// Actual user-data operation migration in a disposable database only.
// PGLITE_MODULE=/path/to/pglite/dist/index.js node scripts/test-user-data-db.mjs --migration=supabase/migrations/FILE.sql
// CI: PG_CONTAINER=<postgres:17.6 service ID> node scripts/test-user-data-db.mjs --backend=postgres --migration=...
// Native adapter follows test-annotation-db.mjs: never accepts a database URL.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawn, spawnSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { normalizeUserHistory } from '../src/lib/user-data-row.js';
import { stableItemKey } from '../src/lib/user-data-sync.js';

const ROOT = fileURLToPath(new URL('../', import.meta.url));
const option = (name, fallback) => process.argv.find(arg => arg.startsWith(`--${name}=`))?.slice(name.length + 3) || fallback;
const backend = option('backend', 'pglite');
assert(['pglite', 'postgres'].includes(backend));
const receiptPath = path.resolve(ROOT, option('receipt', `work/release-20261005/sync/review/db-${backend}.json`));
const migrationPath = path.resolve(ROOT, option('migration', 'supabase/migrations/20261005140235_user_data_operation_sync.sql'));
assert(migrationPath.startsWith(path.resolve(ROOT, 'supabase/migrations') + path.sep), 'Use only a checked-in candidate migration');
const q = value => `'${String(value).replaceAll("'", "''")}'`;
const json = value => `${q(JSON.stringify(value))}::jsonb`;
const hash = value => crypto.createHash('sha256').update(value.replace(/\r\n/g, '\n')).digest('hex');
const scope = (sql, owner) => owner === undefined ? sql : `begin; set local role ${owner === null ? 'anon' : 'authenticated'}; set local "request.jwt.claim.sub"=${q(owner || '')}; ${sql} commit;`;
const report = { startedAt: new Date().toISOString(), backend, productionConnectionUsed: false, realUserDataUsed: false,
  migration: path.relative(ROOT, migrationPath), checks: [], nativeRaces: [], performance: [],
  limitation: backend === 'pglite' ? 'One PostgreSQL WASM backend; native PostgreSQL 17.6 is required for concurrent-lock proof.' : null };
const head = spawnSync('git', ['rev-parse', 'HEAD'], { cwd: ROOT, encoding: 'utf8', windowsHide: true });
if (head.status === 0) report.sourceHead = head.stdout.trim();
report.checkSha256 = hash(fs.readFileSync(fileURLToPath(import.meta.url), 'utf8'));
let db, pglite, nativeDatabase, nativeCreated = false, nativeArgs, nativeEnv;
const createdRoles = [];

function psqlActor(database) {
  const child = spawn(nativeArgs.command, [...nativeArgs.prefix, '-X', '-qAt', '-P', 'pager=off', '-v', 'ON_ERROR_STOP=1', '-v', 'VERBOSITY=verbose', '-U', nativeArgs.user, '-d', database], { env: nativeEnv, stdio: ['pipe', 'pipe', 'pipe'], windowsHide: true });
  let out = '', err = '', ended;
  const listeners = new Set();
  child.stdout.on('data', chunk => { out += chunk; for (const notify of listeners) notify(); });
  child.stderr.on('data', chunk => { err += chunk; });
  const done = new Promise((resolve, reject) => {
    child.once('error', reject);
    child.once('close', (code, signal) => {
      ended = { code, signal }; for (const notify of listeners) notify();
      code === 0 ? resolve(out) : reject(new Error(`psql exit ${code}/${signal}: ${err.slice(-1800)}`));
    });
  });
  done.catch(() => {});
  return { child, done, send: sql => child.stdin.write(sql + '\n'), end: () => child.stdin.end(),
    wait: (pattern, timeout = 15_000) => new Promise((resolve, reject) => {
      const timer = setTimeout(() => { listeners.delete(check); reject(new Error(`Timed out at native barrier ${pattern}`)); }, timeout);
      function check() {
        const match = out.match(pattern);
        if (match) { clearTimeout(timer); listeners.delete(check); resolve(match); }
        else if (ended) { clearTimeout(timer); listeners.delete(check); reject(new Error(`Actor ended before ${pattern}: ${err.slice(-1000)}`)); }
      }
      listeners.add(check); check();
    }) };
}
async function nativeExec(sql, database = nativeDatabase) {
  const actor = psqlActor(database); actor.send(sql); actor.end(); return actor.done;
}
async function execute(sql, owner) { return db.exec(scope(sql, owner)); }
async function read(sql, owner) {
  const result = await execute(sql, owner);
  if (backend === 'postgres') {
    const line = result.trim().split(/\r?\n/).filter(Boolean).at(-1); return line ? JSON.parse(line) : null;
  }
  const row = result.flatMap(item => item.rows || []).at(-1);
  return row ? typeof row.value === 'string' ? JSON.parse(row.value) : row.value : null;
}
async function rejects(sql, owner) {
  let failure;
  try { await execute(sql, owner); } catch (error) { failure = error; }
  assert(failure, 'Database must refuse the operation');
  return String(failure.message).slice(0, 400);
}
async function check(name, fn) {
  const started = performance.now();
  try { const detail = await fn(); report.checks.push({ name, ok: true, ms: performance.now() - started, ...(detail || {}) }); console.log(`PASS ${name}`); }
  catch (error) { report.checks.push({ name, ok: false, ms: performance.now() - started, error: String(error.message).slice(0, 1600) }); console.log(`FAIL ${name}: ${String(error.message).slice(0, 400)}`); }
}
async function owner() {
  const id = crypto.randomUUID(); await execute(`insert into auth.users(id) values(${q(id)});`); return id;
}
const getRow = id => read(`select to_jsonb(u)::text as value from public.user_data u where user_id=${q(id)};`);
const legacyWrite = (id, notes) => `insert into public.user_data(user_id,notes) values(${q(id)},${json(notes)}) on conflict(user_id) do update set notes=excluded.notes;`;
const rpcSql = operations => `select public.sync_user_data_v2(${json(operations)})::text as value;`;
const rpc = (id, operations) => read(rpcSql(operations), id);
const op = (changes, clock = 1, id = crypto.randomUUID()) => ({ id, clock, changes });
const notes = (set = {}, remove = []) => ({ notes: { set, remove } });
const acked = (result, operation) => assert(result.acknowledged.includes(operation.id), 'exact operation must be acknowledged');

// Each actor runs in a separate psql backend. B must visibly block on A's
// real database lock before the test releases A; a pair of serial calls is not a race.
async function nativeRace(name, id, sqlA, sqlB, verify, bMustReject = false) {
  const lock = Math.floor(Math.random() * 1e8) + 7e8;
  const gate = psqlActor(nativeDatabase), a = psqlActor(nativeDatabase), b = psqlActor(nativeDatabase);
  try {
    gate.send(`select pg_advisory_lock(${lock});\n\\echo GATE_READY`); await gate.wait(/GATE_READY/);
    const auth = `set local role authenticated; set local "request.jwt.claim.sub"=${q(id)};`;
    a.send(`begin; ${auth} select 'A_PID:'||pg_backend_pid(); ${sqlA}\n\\echo A_WRITTEN\nselect pg_advisory_xact_lock(${lock}); commit;\n\\echo A_COMMITTED`); a.end();
    const aPid = Number((await a.wait(/A_PID:(\d+)/))[1]); await a.wait(/A_WRITTEN/);
    b.send(`begin; ${auth} select 'B_PID:'||pg_backend_pid(); ${sqlB} commit;\n\\echo B_COMMITTED`); b.end();
    const bPid = Number((await b.wait(/B_PID:(\d+)/))[1]); assert.notEqual(aPid, bPid);
    let blocked = false;
    const deadline = Date.now() + 15_000;
    while (!blocked && Date.now() < deadline) {
      blocked = await read(`select exists(select 1 from pg_locks where pid=${bPid} and not granted)::text as value;`);
      if (!blocked) await new Promise(resolve => setTimeout(resolve, 25));
    }
    assert.equal(blocked, true, 'B must wait on an actual database lock');
    gate.send(`select pg_advisory_unlock(${lock});`); gate.end();
    const results = await Promise.allSettled([gate.done, a.done, b.done]);
    assert.equal(results[0].status, 'fulfilled'); assert.equal(results[1].status, 'fulfilled');
    assert.equal(results[2].status, bMustReject ? 'rejected' : 'fulfilled', JSON.stringify(results[2]));
    await verify();
    report.nativeRaces.push({ name, aBackendPid: aPid, bBackendPid: bPid, bLockWaitObserved: true, separateBackends: true, bRefused: bMustReject, expectedResultVerified: true });
  } finally { for (const actor of [gate, a, b]) if (actor.child.exitCode === null) actor.child.kill(); }
}

try {
  if (backend === 'pglite') {
    const modulePath = process.env.PGLITE_MODULE || path.join(ROOT, 'work/loop-20260930/annotation-pg-lab/node_modules/@electric-sql/pglite/dist/index.js');
    const { PGlite } = await import(modulePath.startsWith('file:') ? modulePath : pathToFileURL(path.resolve(modulePath)).href);
    pglite = new PGlite(); await pglite.waitReady;
    db = { exec: async sql => { try { return await pglite.exec(sql); } catch (error) { await pglite.exec('rollback;').catch(() => {}); throw error; } } };
  } else {
    nativeEnv = { ...process.env };
    for (const name of Object.keys(nativeEnv)) if (name.startsWith('PG') || name === 'DATABASE_URL') delete nativeEnv[name];
    assert.equal(process.env.GITHUB_ACTIONS, 'true', 'Native mode requires the dedicated GitHub Actions test service');
    const container = process.env.PG_CONTAINER; assert(/^[a-f0-9]{64}$/.test(container || ''), 'Missing dedicated CI container ID');
    const inspected = spawnSync('docker', ['inspect', '--format', '{{.Config.Image}}', container], { env: nativeEnv, encoding: 'utf8', windowsHide: true });
    assert.equal(inspected.status, 0, inspected.stderr); assert.equal(inspected.stdout.trim(), 'postgres:17.6');
    nativeArgs = { command: 'docker', prefix: ['exec', '-i', container, 'psql'], user: 'postgres' };
    nativeDatabase = `vmx_user_data_lab_${crypto.randomBytes(8).toString('hex')}`;
    assert(/^vmx_user_data_lab_[0-9a-f]{16}$/.test(nativeDatabase));
    await nativeExec(`create database ${nativeDatabase};`, 'postgres'); nativeCreated = true;
    db = { exec: sql => nativeExec(sql) };
  }
  report.serverVersion = await read(`select to_jsonb(current_setting('server_version'))::text as value;`);
  if (backend === 'postgres') assert(/^17\.6(?:\D|$)/.test(report.serverVersion));
  for (const role of ['anon', 'authenticated']) {
    const exists = await read(`select exists(select 1 from pg_roles where rolname=${q(role)})::text as value;`);
    if (!exists) { await execute(`create role ${role} nologin;`); createdRoles.push(role); }
  }
  const roles = await read(`select jsonb_agg(jsonb_build_object('role',rolname,'super',rolsuper,'bypass',rolbypassrls))::text as value from pg_roles where rolname in ('anon','authenticated');`);
  assert(roles.every(role => !role.super && !role.bypass));
  await execute(`create schema auth; create table auth.users(id uuid primary key); create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$; grant usage on schema auth to anon,authenticated; grant execute on function auth.uid() to anon,authenticated;`);

  // Disposable fixture matches the existing API's public.user_data columns;
  // operation metadata/receipt tables must come from the actual migration.
  await execute(`create table public.user_data (
    user_id uuid primary key references auth.users(id) on delete cascade,
    bookmarks jsonb default '[]', history jsonb default '[]', notes jsonb default '{}',
    sr_cards jsonb default '{}', custom_questions jsonb default '[]',
    streak_data jsonb default '{}', reading_checklist jsonb not null default '{}' check(jsonb_typeof(reading_checklist)='object'),
    updated_at timestamptz default now()
  ); alter table public.user_data enable row level security;
  create policy user_data_owner on public.user_data to authenticated using (user_id=auth.uid()) with check (user_id=auth.uid());
  grant select,insert,update,delete on public.user_data to authenticated;`);
  await check('baseline full-row upsert overwrites an acknowledged independent note', async () => {
    const id = await owner(); await execute(legacyWrite(id, { first: 'A' }), id); await execute(legacyWrite(id, { second: 'B' }), id);
    assert.deepEqual((await getRow(id)).notes, { second: 'B' }); return { originalDataLossReproduced: true };
  });
  const migration = fs.readFileSync(migrationPath, 'utf8'); report.migrationSha256 = hash(migration);
  await execute(migration); await execute(migration);
  await check('actual RPC is owner-scoped definer with restricted EXECUTE and private receipts', async () => {
    const fn = await read(`select jsonb_build_object('definer',prosecdef,'config',proconfig)::text as value from pg_proc where oid='public.sync_user_data_v2(jsonb)'::regprocedure;`);
    assert.equal(fn.definer, true); assert(fn.config.some(value => /^search_path=pg_catalog(?:,\s*private,\s*public)?$/.test(value)));
    assert.equal(await read(`select has_function_privilege('anon','public.sync_user_data_v2(jsonb)','execute')::text as value;`), false);
    assert.equal(await read(`select has_function_privilege('authenticated','public.sync_user_data_v2(jsonb)','execute')::text as value;`), true);
    const id = await owner(); await rejects('select * from private.user_data_sync_receipts;', id);
    assert.equal(await read(`select relrowsecurity::text as value from pg_class where oid='private.user_data_sync_receipts'::regclass;`), true);
  });

  await check('empty RPC enrolls owner, preserves legacy values and increments no data by itself', async () => {
    const id = await owner(); await execute(legacyWrite(id, { existing: 'preserved' }), id);
    const result = await rpc(id, []);
    assert.equal(result.row.user_id, id); assert.equal(result.row.sync_version, 2);
    assert.deepEqual(result.row.notes, { existing: 'preserved' }); assert.deepEqual(result.acknowledged, []);
  });
  const legacyHistory = [
    ['old-id-dated-without-id', { subject: 'engprof', questionId: 1100, correct: true, date: 1700000000000 }],
    ['old-id-explicit-attempt-id', { id: 'attempt-2', subject: 'engprof', questionId: 1101, correct: false, date: 1700000000001 }],
    ['old-id-json-fallback-without-date', { subject: 'engprof', questionId: 1102, correct: true }],
    ['explicit-null-year-preserved', { subject: 'engprof', questionId: 1103, correct: false, year: null, phase: '1-mid' }],
    ['unknown-subject-remains-unknown', { subject: 'unknown-subject', questionId: 'external-id', correct: true }],
  ];
  for (const [label, item] of legacyHistory) await check(`history normalization matches current JS restore and remains removable: ${label}`, async () => {
    const expected = normalizeUserHistory([structuredClone(item)])[0];
    const hydratedOwner = await owner();
    await execute(`insert into public.user_data(user_id,history) values(${q(hydratedOwner)},${json([item])});`, hydratedOwner);
    const enrolled = await rpc(hydratedOwner, []); assert.deepEqual(enrolled.row.history, [expected]);
    if (Object.hasOwn(item, 'id')) assert.equal(enrolled.row.history[0].id, item.id);
    await rpc(hydratedOwner, [op({ history: { put: [], remove: [stableItemKey(item)] } })]);
    assert.deepEqual((await getRow(hydratedOwner)).history, [], 'legacy removal alias must target the normalized row');
    const putOwner = await owner();
    const inserted = await rpc(putOwner, [op({ history: { put: [item], remove: [] } })]);
    assert.deepEqual(inserted.row.history, [expected]);
    await rpc(putOwner, [op({ history: { put: [], remove: [stableItemKey(expected)] } }, 2)]);
    assert.deepEqual((await getRow(putOwner)).history, [], 'current-client removal must target the same normalized identity');
  });
  await check('distinct owned notes survive independent writes and deletion touches only its key', async () => {
    const id = await owner(); const a = op(notes({ A: 'first' })), b = op(notes({ B: 'second' }), 2);
    acked(await rpc(id, [a]), a); acked(await rpc(id, [b]), b);
    assert.deepEqual((await getRow(id)).notes, { A: 'first', B: 'second' });
    const removed = op(notes({}, ['A']), 3); acked(await rpc(id, [removed]), removed);
    assert.deepEqual((await getRow(id)).notes, { B: 'second' });
  });
  await check('lost reply retry cannot replace a later acknowledged value and returns current row', async () => {
    const id = await owner(), first = op(notes({ key: 'first' }), 10), later = op(notes({ key: 'later' }), 20);
    await rpc(id, [first]); await rpc(id, [later]); const before = await getRow(id);
    const duplicate = await rpc(id, [first]); acked(duplicate, first);
    assert.deepEqual(duplicate.row.notes, { key: 'later' }); assert.deepEqual(await getRow(id), before);
  });
  await check('same operation ID with different immutable content refuses without a partial change', async () => {
    const id = await owner(), original = op(notes({ key: 'saved' }), 10);
    await rpc(id, [original]); const before = await getRow(id);
    await rejects(rpcSql([{ ...original, changes: notes({ key: 'changed body' }) }]), id);
    await rejects(rpcSql([{ ...original, clock: 11 }]), id);
    assert.deepEqual(await getRow(id), before);
  });
  await check('causally older unique operation is suppressed and its conflict is visible', async () => {
    const id = await owner(), newer = op(notes({ key: 'newer' }), 100), old = op(notes({ key: 'older' }), 90);
    await rpc(id, [newer]); const result = await rpc(id, [old]);
    assert.deepEqual(result.row.notes, { key: 'newer' }); acked(result, old);
    assert(result.conflicts.length > 0, 'suppressed keys must not be reported as applied without conflict evidence');
    const retry = await rpc(id, [old]); assert.deepEqual(retry.row.notes, { key: 'newer' });
  });
  await check('tombstones retain a later delete across delayed first delivery and exact replay', async () => {
    const id = await owner(), add = op(notes({ key: 'old addition' }), 10), del = op(notes({}, ['key']), 20);
    await rpc(id, [del]); const result = await rpc(id, [add]);
    assert.deepEqual(result.row.notes, {}); assert(result.conflicts.length > 0);
    await rpc(id, [del]); assert.deepEqual((await getRow(id)).notes, {});
    await rpc(id, [op(notes({ key: 'intentional re-add' }), 30)]);
    assert.deepEqual((await getRow(id)).notes, { key: 'intentional re-add' });
  });
  await check('explicit cancellation stops a never-applied captured operation, including late retry', async () => {
    const id = await owner(), captured = op(notes({ discarded: 'late captured value' }), 10);
    const cancel = { ...op({}, 20), cancel: [captured.id] };
    acked(await rpc(id, [cancel]), cancel);
    const late = await rpc(id, [captured]); acked(late, captured); assert.deepEqual(late.row.notes, {});
    const changedLateBody = await rpc(id, [{ ...captured, changes: notes({ discarded: 'changed but still cancelled' }) }]);
    assert.deepEqual(changedLateBody.row.notes, {});
    const retriedCancel = await rpc(id, [cancel]); assert.deepEqual(retriedCancel.row.notes, {});
  });
  await check('cancellation does not erase a previously committed operation or weaken its immutable receipt', async () => {
    const id = await owner(), applied = op(notes({ retained: 'already committed' }), 10);
    await rpc(id, [applied]); await rpc(id, [{ ...op({}, 20), cancel: [applied.id] }]);
    assert.deepEqual((await getRow(id)).notes, { retained: 'already committed' });
    await rejects(rpcSql([{ ...applied, changes: notes({ retained: 'changed body' }) }]), id);
  });
  await check('a rolled-back cancellation cannot suppress the captured edit on its next delivery', async () => {
    const id = await owner(), captured = op(notes({ retained: 'retry after rollback' }), 10);
    const cancel = { ...op({}, 20), cancel: [captured.id] };
    await rejects(rpcSql([cancel, { ...op({}, 30), id: 'bad' }]), id);
    const result = await rpc(id, [captured]); acked(result, captured);
    assert.deepEqual(result.row.notes, { retained: 'retry after rollback' });
  });
  await check('equal clocks use a deterministic UUID tie-break in either arrival order', async () => {
    const low = op(notes({ key: 'low' }), 100, '00000000-0000-4000-8000-000000000001');
    const high = op(notes({ key: 'high' }), 100, '00000000-0000-4000-8000-000000000002');
    for (const order of [[low, high], [high, low]]) {
      const id = await owner(); for (const operation of order) await rpc(id, [operation]);
      assert.deepEqual((await getRow(id)).notes, { key: 'high' });
    }
  });
  await check('array stable identities preserve numeric and string bookmarks as distinct entries', async () => {
    const id = await owner(); await rpc(id, [op({ bookmarks: { put: [1, '1'], remove: [] } })]);
    await rpc(id, [op({ bookmarks: { put: [], remove: ['json:1'] } }, 2)]);
    assert.deepEqual((await getRow(id)).bookmarks, ['1']);
    const quote = 'q"\\ก'; await rpc(id, [op({ bookmarks: { put: [quote], remove: [] } }, 3)]);
    await rpc(id, [op({ bookmarks: { put: [], remove: ['json:' + JSON.stringify(quote)] } }, 4)]);
    assert.deepEqual((await getRow(id)).bookmarks, ['1']);
  });
  await check('numeric JSON scale is normalized to the identity a JavaScript client removes', async () => {
    const id = await owner(), operation = op({ bookmarks: { put: [1], remove: [] } });
    const scaled = JSON.stringify([operation]).replace('"put":[1]', '"put":[1.0]');
    await read(`select public.sync_user_data_v2(${q(scaled)}::jsonb)::text as value;`, id);
    await rpc(id, [op({ bookmarks: { put: [], remove: ['json:1'] } }, 2)]);
    assert.deepEqual((await getRow(id)).bookmarks, []);
    const undated = { questionId: 3, correct: true, nested: { value: 1 } };
    const legacy = JSON.stringify([op({ history: { put: [undated], remove: [] } }, 3)]).replace('"value":1', '"value":1.0');
    await read(`select public.sync_user_data_v2(${q(legacy)}::jsonb)::text as value;`, id);
    await rpc(id, [op({ history: { put: [], remove: ['json:' + JSON.stringify(undated)] } }, 4)]);
    assert.deepEqual((await getRow(id)).history, []);
  });
  await check('history date and question identity normalize numeric scale before a client removal', async () => {
    const id = await owner(), history = { questionId: 9, date: 123, subject: 'study', correct: false };
    const scaled = JSON.stringify([op({ history: { put: [history], remove: [] } })])
      .replace('"questionId":9', '"questionId":9.0').replace('"date":123', '"date":123.0');
    await read(`select public.sync_user_data_v2(${q(scaled)}::jsonb)::text as value;`, id);
    await rpc(id, [op({ history: { put: [], remove: ['history:123:study:9'] } }, 2)]);
    assert.deepEqual((await getRow(id)).history, []);
  });
  await check('history compound key and custom-question ID preserve updates and exact deletion', async () => {
    const id = await owner(), history = { questionId: 9, date: 123, subject: 'ก', correct: false };
    const custom = { id: 60001, q: 'Question', type: 'mcq', subject: 'user', options: ['A', 'B'], answer: 0 };
    await rpc(id, [op({ history: { put: [history], remove: [] }, custom_questions: { put: [custom], remove: [], created: ['id:60001'] } })]);
    await rpc(id, [op({ custom_questions: { put: [{ ...custom, q: 'Edited' }], remove: [] } }, 2)]);
    assert.equal((await getRow(id)).custom_questions[0].q, 'Edited');
    await rpc(id, [op({ history: { put: [], remove: ['history:123:ก:9'] }, custom_questions: { put: [], remove: ['id:60001'] } }, 3)]);
    assert.deepEqual((await getRow(id)).history, []); assert.deepEqual((await getRow(id)).custom_questions, []);
  });
  await check('updating an existing array item preserves its position and new puts retain authored order', async () => {
    const id = await owner(), first = { id: 60001, q: 'first' }, second = { id: 60002, q: 'second' };
    await rpc(id, [op({ custom_questions: { put: [first, second], remove: [], created: ['id:60001', 'id:60002'] } })]);
    const result = await rpc(id, [op({ custom_questions: {
      put: [{ ...first, q: 'edited first' }, { id: 60004, q: 'new before third' }, { id: 60003, q: 'third' }],
      remove: [], created: ['id:60004', 'id:60003'],
    } }, 2)]);
    assert.deepEqual(result.row.custom_questions.map(item => item.id), [60001, 60002, 60004, 60003]);
    assert.equal(result.row.custom_questions[0].q, 'edited first');
  });
  await check('new custom question collision refuses and keeps both the stored row and batch unapplied', async () => {
    const id = await owner(), a = { id: 60001, q: 'A' }, b = { id: 60001, q: 'B' };
    await rpc(id, [op({ custom_questions: { put: [a], remove: [], created: ['id:60001'] } })]);
    const before = await getRow(id), earlierInBatch = op(notes({ shouldRollback: 'yes' }), 2);
    const conflicting = op({ custom_questions: { put: [b], remove: [], created: ['id:60001'] } }, 3);
    const error = await rejects(rpcSql([earlierInBatch, conflicting]), id);
    assert(error.includes('VMX_CUSTOM_ID_CONFLICT')); assert.deepEqual(await getRow(id), before);
    acked(await rpc(id, [earlierInBatch]), earlierInBatch);
    assert.equal((await getRow(id)).notes.shouldRollback, 'yes', 'rolled-back receipt must not suppress a valid retry');
  });
  const retiredFixtures = [
    ['compound note reference', `notes='{"study:60000":"old note"}'::jsonb`],
    ['compound bookmark reference', `bookmarks='["study:60000"]'::jsonb`],
    ['numeric history question reference', `history='[{"questionId":60000,"date":1,"subject":"study","correct":true}]'::jsonb`],
    ['review-card dictionary identity', `sr_cards='{"60000":{"questionId":60000,"totalReviews":1}}'::jsonb`],
    ['review-card value identity under another dictionary key', `sr_cards='{"legacy-key":{"questionId":60000,"totalReviews":1}}'::jsonb`],
    ['scaled history question reference', `history='[{"questionId":60000.0,"date":1,"subject":"study","correct":true}]'::jsonb`],
    ['scaled numeric bookmark reference', `bookmarks='[60000.0]'::jsonb`],
    ['scaled review-card value identity', `sr_cards='{"legacy-key":{"questionId":60000.0,"totalReviews":1}}'::jsonb`],
  ];
  for (const [label, fixture] of retiredFixtures) await check(`retired custom ID cannot be reused through ${label}`, async () => {
    const id = await owner(); await rpc(id, []); await execute(`update public.user_data set ${fixture} where user_id=${q(id)};`);
    const before = await getRow(id), created = op({ custom_questions: { put: [{ id: 60000, q: 'new unrelated question' }], remove: [], created: ['id:60000'] } }, 10);
    const failure = await rejects(rpcSql([created]), id); assert(failure.includes('VMX_CUSTOM_ID_CONFLICT'));
    assert.deepEqual(await getRow(id), before);
  });
  await check('a deleted custom-question tombstone protects its ID without surviving visible references', async () => {
    const id = await owner(); await rpc(id, [op({ custom_questions: { put: [{ id: 60000, q: 'original' }], remove: [], created: ['id:60000'] } })]);
    await rpc(id, [op({ custom_questions: { put: [], remove: ['id:60000'] } }, 2)]);
    const before = await getRow(id); assert.deepEqual(before.custom_questions, []);
    await rejects(rpcSql([op({ custom_questions: { put: [{ id: 60000, q: 'unrelated replacement' }], remove: [], created: ['id:60000'] } }, 3)]), id);
    assert.deepEqual(await getRow(id), before);
  });
  await check('string custom IDs use literal compound suffixes instead of SQL wildcard matching', async () => {
    const id = await owner(); await rpc(id, [op(notes({ 'study:axb': 'unrelated note' }))]);
    const result = await rpc(id, [op({ custom_questions: { put: [{ id: 'a_b', q: 'Distinct ID' }], remove: [], created: ['id:a_b'] } }, 2)]);
    assert.equal(result.row.custom_questions[0].id, 'a_b');
  });
  await check('streak value, reading checklist and review-card maps use their declared field shapes', async () => {
    const id = await owner(), sr = { questionId: 11, totalReviews: 2, nextReview: 123 };
    const result = await rpc(id, [op({ streak_data: { value: { streak: 2, lastDate: '2026-10-05' } },
      reading_checklist: { set: { 'topic:a/b': 100 }, remove: [] }, sr_cards: { set: { 11: sr }, remove: [] } })]);
    assert.equal(result.row.streak_data.streak, 2); assert.equal(result.row.reading_checklist['topic:a/b'], 100);
    assert.deepEqual(result.row.sr_cards['11'], sr);
  });
  const malformed = [null, {}, 12, [null], [{}], [op(notes(), -1)], [op(notes(), 1.5)], [op(notes(), Number.MAX_SAFE_INTEGER + 1)],
    [{ ...op(notes()), id: 'not-a-uuid' }], [op({ unknown_field: { value: 1 } })],
    [op({ notes: { set: [], remove: [] } })], [op({ notes: { set: {}, remove: [12] } })],
    [op({ bookmarks: { put: {}, remove: [] } })], [op({ history: { put: [], remove: [12] } })],
    [op({ streak_data: { value: [] } })], Array.from({ length: 201 }, () => op(notes())),
    [op({ custom_questions: { put: [], remove: [], created: {} } })],
    [op({ custom_questions: { put: [{ id: 1 }], remove: [], created: [12] } })],
    [op({ custom_questions: { put: [{ id: 1 }], remove: [], created: [null] } })],
    [op({ custom_questions: { put: [{ id: 1 }], remove: [], created: ['id:2'] } })],
    [op({ bookmarks: { put: [1, 1], remove: [] } })],
    [op({ custom_questions: { put: [{ id: 1, q: 'A' }, { id: 1, q: 'B' }], remove: [] } })],
    [op({ notes: { set: {}, remove: ['safe', 'safe'] } })],
    [op({ notes: { set: { safe: 'replacement' }, remove: ['safe'] } })],
    [{ ...op({}), cancel: {} }], [{ ...op({}), cancel: ['not-a-uuid'] }],
    [{ ...op({}), cancel: Array.from({ length: 201 }, () => crypto.randomUUID()) }]];
  for (const [index, value] of malformed.entries()) await check(`malformed operation/batch ${index + 1} is refused atomically`, async () => {
    const id = await owner(); await rpc(id, [op(notes({ safe: 'retained' }))]); const before = await getRow(id);
    await rejects(rpcSql(value), id); assert.deepEqual(await getRow(id), before);
  });
  await check('oversized request is refused before row or receipts are changed', async () => {
    const id = await owner(); await rpc(id, []); const before = await getRow(id);
    await rejects(rpcSql([op(notes({ oversized: 'x'.repeat(8 * 1024 * 1024 + 1) }))]), id);
    assert.deepEqual(await getRow(id), before);
  });
  await check('post-merge 32 MiB row cap rolls back new data and its receipt', async () => {
    const id = await owner(); await rpc(id, []);
    await execute(`update public.user_data set notes=jsonb_build_object('large',repeat('x',33553000)) where user_id=${q(id)};`);
    const digest = () => read(`select to_jsonb(md5(to_jsonb(u)::text))::text as value from public.user_data u where user_id=${q(id)};`);
    const before = await digest(), addition = op(notes({ addition: 'y'.repeat(3000) }));
    await rejects(rpcSql([addition]), id); assert.equal(await digest(), before);
    assert.equal(await read(`select count(*)::text as value from private.user_data_sync_receipts where user_id=${q(id)} and operation_id=${q(addition.id)};`), 0);
  });
  await check('bad second operation rolls back the first change and its receipt', async () => {
    const id = await owner(), first = op(notes({ saved: 'after explicit retry' }));
    await rpc(id, []); const before = await getRow(id);
    await rejects(rpcSql([first, { ...op(notes()), clock: -1 }]), id); assert.deepEqual(await getRow(id), before);
    acked(await rpc(id, [first]), first); assert.equal((await getRow(id)).notes.saved, 'after explicit retry');
  });
  await check('self-cancellation is refused without enrolling or recording the operation', async () => {
    const id = await owner(), self = op({}); self.cancel = [self.id];
    await rejects(rpcSql([self]), id); assert.equal(await getRow(id), null);
  });
  await check('aggregate cancellation work above 10000 IDs is refused before any receipt is written', async () => {
    const id = await owner();
    const operations = Array.from({ length: 51 }, (_, clock) => ({ ...op({}, clock), cancel: Array.from({ length: 200 }, () => crypto.randomUUID()) }));
    await rejects(rpcSql(operations), id); assert.equal(await getRow(id), null);
    assert.equal(await read(`select count(*)::text as value from private.user_data_sync_receipts where user_id=${q(id)};`), 0);
  });
  await check('owner RLS, anonymous denial and operation IDs stay isolated by account', async () => {
    const a = await owner(), b = await owner(), id = crypto.randomUUID();
    await rpc(a, [op(notes({ own: 'A' }), 1, id)]); await rpc(b, [op(notes({ own: 'B' }), 1, id)]);
    assert.deepEqual((await getRow(a)).notes, { own: 'A' }); assert.deepEqual((await getRow(b)).notes, { own: 'B' });
    assert.equal(await read(`select count(*)::text as value from public.user_data where user_id=${q(a)};`, b), 0);
    await rejects(legacyWrite(a, { intruder: 'B' }), b); await rejects(rpcSql([]), null);
    await rejects(`select public.sync_user_data_v2('[]'::jsonb);`, '');
  });
  await check('enrolled rows refuse direct old-client writes and marker rollback', async () => {
    const id = await owner(); await execute(legacyWrite(id, { oldClient: 'before enrollment' }), id);
    await rpc(id, [op(notes({ newClient: 'acknowledged' }))]); const before = await getRow(id);
    await rejects(legacyWrite(id, { stale: 'old client' }), id);
    await execute(`update public.user_data set sync_version=1,notes='{}' where user_id=${q(id)};`, id);
    await execute(`delete from public.user_data where user_id=${q(id)};`, id);
    assert.deepEqual(await getRow(id), before);
  });
  await check('account deletion can cascade while direct enrolled-row deletion is protected', async () => {
    const id = await owner(); await rpc(id, [op(notes({ personal: 'remove with account' }))]);
    await execute(`delete from auth.users where id=${q(id)};`); assert.equal(await getRow(id), null);
  });
  if (backend === 'postgres') {
    for (const count of [1000, 2000]) await check(`native performance: ${count} history puts on a populated account under the actual 8s timeout`, async () => {
      const id = await owner(); await rpc(id, []);
      // Real production maximum observed on 2026-10-05 was 792454 bytes.
      // 6000 realistic history rows make a comparably sized populated account.
      const entry = `jsonb_build_object('questionId',g,'date',1700000000000+g,'subject','study','correct',true,'year',5,'phase','1-mid')`;
      await execute(`update public.user_data set history=(select jsonb_agg(${entry} order by g) from generate_series(1,6000) g) where user_id=${q(id)};`);
      const beforeBytes = await read(`select octet_length(to_jsonb(u)::text)::text as value from public.user_data u where user_id=${q(id)};`);
      const operationId = crypto.randomUUID(), start = performance.now();
      const measured = await read(`set local statement_timeout='8s';
        with started as materialized (select clock_timestamp() as at),
        result as materialized (select public.sync_user_data_v2(jsonb_build_array(jsonb_build_object(
          'id',${q(operationId)},'clock',10,'changes',jsonb_build_object('history',jsonb_build_object(
            'put',(select jsonb_agg(${entry} order by g) from generate_series(6001,${6000 + count}) g),'remove','[]'::jsonb))))) as data from started)
        select jsonb_build_object('serverMs',extract(epoch from clock_timestamp()-started.at)*1000,
          'historyCount',jsonb_array_length(result.data->'row'->'history'),
          'afterBytes',octet_length((result.data->'row')::text),
          'acknowledged',result.data->'acknowledged')::text as value from started cross join result;`, id);
      assert.equal(measured.historyCount, 6000 + count); assert(measured.acknowledged.includes(operationId));
      assert(Number.isFinite(measured.serverMs) && measured.serverMs < 8000);
      const detail = { historyPuts: count, initialHistoryRows: 6000, beforeBytes, afterBytes: measured.afterBytes,
        serverMs: measured.serverMs, clientMs: performance.now() - start, enforcedStatementTimeoutMs: 8000,
        headroomMs: 8000 - measured.serverMs, native: true };
      report.performance.push(detail); console.log(JSON.stringify({ nativeHistoryPerformance: detail }));
      return detail;
    });
    await check('native existing-row concurrent independent note writes', async () => {
      const id = await owner(); await rpc(id, []);
      await nativeRace('existing-disjoint', id, rpcSql([op(notes({ A: 'one' }), 10)]), rpcSql([op(notes({ B: 'two' }), 20)]), async () => {
        assert.deepEqual((await getRow(id)).notes, { A: 'one', B: 'two' });
      });
    });
    await check('native competing first enrollment preserves both operations', async () => {
      const id = await owner();
      await nativeRace('first-enrollment', id, rpcSql([op(notes({ A: 'one' }), 10)]), rpcSql([op(notes({ B: 'two' }), 20)]), async () => {
        assert.deepEqual((await getRow(id)).notes, { A: 'one', B: 'two' });
      });
    });
    await check('native duplicate operation retry commits one semantic change', async () => {
      const id = await owner(), operation = op(notes({ once: 'one' })); await rpc(id, []);
      await nativeRace('duplicate', id, rpcSql([operation]), rpcSql([operation]), async () => {
        const before = await getRow(id); assert.deepEqual(before.notes, { once: 'one' });
        await rpc(id, [operation]); assert.deepEqual(await getRow(id), before);
      });
    });
    await check('native old upsert waiting behind enrollment is refused after the lock releases', async () => {
      const id = await owner(); await execute(legacyWrite(id, { before: 'legacy' }), id);
      await nativeRace('old-write-behind-enrollment', id, rpcSql([op(notes({ enrolled: 'protected' }))]), legacyWrite(id, { stale: 'erase' }), async () => {
        assert.deepEqual((await getRow(id)).notes, { before: 'legacy', enrolled: 'protected' });
      }, true);
    });
    await check('native cancellation commits before a late captured operation arrives', async () => {
      const id = await owner(), captured = op(notes({ discarded: 'captured' }), 10);
      const cancel = { ...op({}, 20), cancel: [captured.id] }; await rpc(id, []);
      await nativeRace('cancel-before-captured', id, rpcSql([cancel]), rpcSql([captured]), async () => {
        assert.deepEqual((await getRow(id)).notes, {});
      });
    });
    await check('native cancellation waits for and preserves an already-applied captured operation', async () => {
      const id = await owner(), captured = op(notes({ retained: 'applied before cancellation' }), 10);
      const cancel = { ...op({}, 20), cancel: [captured.id] }; await rpc(id, []);
      await nativeRace('cancel-after-captured', id, rpcSql([captured]), rpcSql([cancel]), async () => {
        assert.deepEqual((await getRow(id)).notes, { retained: 'applied before cancellation' });
      });
    });
  }
} catch (error) { report.fatal = String(error.message).slice(0, 2000); }
finally {
  try {
    if (pglite) { await pglite.close(); report.disposableDatabaseClosed = true; }
    if (nativeCreated) { await nativeExec(`drop database ${nativeDatabase} with (force);`, 'postgres'); for (const role of createdRoles) await nativeExec(`drop role ${role};`, 'postgres'); report.disposableDatabaseDropped = true; }
  } catch (error) { report.cleanupError = String(error.message).slice(0, 1400); }
  report.finishedAt = new Date().toISOString(); report.passed = report.checks.filter(item => item.ok).length; report.failed = report.checks.filter(item => !item.ok).length;
  report.nativeMultiBackendProof = report.nativeRaces.length === 6 && report.nativeRaces.every(item => item.bLockWaitObserved && item.expectedResultVerified);
  report.checkSourceUnchanged = report.checkSha256 === hash(fs.readFileSync(fileURLToPath(import.meta.url), 'utf8'));
  report.migrationSourceUnchanged = !!report.migrationSha256 && report.migrationSha256 === hash(fs.readFileSync(migrationPath, 'utf8'));
  report.ok = !report.fatal && !report.cleanupError && report.failed === 0 && report.checks.length > 1 && report.checkSourceUnchanged && report.migrationSourceUnchanged && (backend === 'pglite' || report.nativeMultiBackendProof);
  fs.mkdirSync(path.dirname(receiptPath), { recursive: true }); fs.writeFileSync(receiptPath, JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify({ backend, passed: report.passed, failed: report.failed, fatal: report.fatal || null, nativeMultiBackendProof: report.nativeMultiBackendProof, receiptPath, ok: report.ok }));
  process.exitCode = report.ok ? 0 : 1;
}
