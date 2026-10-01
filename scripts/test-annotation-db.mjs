// Actual annotation migrations + the existing JS oracle, in a disposable DB only.
// PGLITE_MODULE=/path/to/pglite/dist/index.js node scripts/test-annotation-db.mjs
// CI: PG_CONTAINER=<postgres:17.6 service ID> node scripts/test-annotation-db.mjs --backend=postgres
// Native mode accepts only a dedicated GitHub Actions test container, never a DB address.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawn, spawnSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { mergeRecords, packStroke } from '../src/lib/pdf-annotations.js';
import { fitShape } from '../src/lib/shape-fit.js';

const ROOT = fileURLToPath(new URL('../', import.meta.url));
const option = (name, fallback) => process.argv.find(arg => arg.startsWith(`--${name}=`))?.slice(name.length + 3) || fallback;
const backend = option('backend', 'pglite');
assert(['pglite', 'postgres'].includes(backend));
const receiptPath = option('receipt', path.join(ROOT, `work/loop-20260930/annotation-pg-lab/check-${backend}.json`));
const migrationPath = path.join(ROOT, 'supabase/migrations/20261001030000_pdf_annotations_atomic_merge.sql');
const basePath = path.join(ROOT, 'supabase/migrations/20260902000000_pdf_annotations_copy_of_record.sql');
const OWNER = '11111111-1111-4111-8111-111111111111';
const OTHER = '22222222-2222-4222-8222-222222222222';
const q = value => `'${String(value).replaceAll("'", "''")}'`;
const json = value => `${q(JSON.stringify(value))}::jsonb`;
const payload = (ink = {}, deleted = [], extra = {}) => ({ fileName: 'lab.pdf', pageCount: 3, strokesByPage: ink, deleted, lastPage: 1, lastOpened: 100, ...extra });
const stroke = (id, extra = {}) => ({ id, tool: 'pen', points: [[0.1, 0.2, 0.4], [0.3, 0.4]], ...extra });
const projection = value => Object.fromEntries(['fileName', 'pageCount', 'strokesByPage', 'deleted', 'lastPage', 'lastOpened', 'slug'].filter(key => key in value).map(key => [key, value[key]]));
const oracle = (incoming, stored) => projection(mergeRecords(incoming, stored));
let docNumber = 100;
const doc = () => (++docNumber).toString(16).padStart(16, '0');
const upsert = (hash, value, owner = OWNER) => `insert into public.pdf_annotations(user_id,doc_hash,data) values(${q(owner)},${q(hash)},${json(value)}) on conflict(user_id,doc_hash) do update set data=excluded.data,updated_at=excluded.updated_at;`;
const scope = (sql, owner) => owner === undefined || owner === 'admin' ? sql : `begin; set local role ${owner === null ? 'anon' : 'authenticated'}; set local "request.jwt.claim.sub"=${q(owner || '')}; ${sql} commit;`;
const report = { startedAt: new Date().toISOString(), backend, productionConnectionUsed: false, realUserDataUsed: false, migrations: [path.relative(ROOT, basePath), path.relative(ROOT, migrationPath)], checks: [], nativeRaces: [], limitation: backend === 'pglite' ? 'One PostgreSQL WASM backend; cannot prove multi-backend locking. Native PostgreSQL 17.6 CI is required.' : null };
const sourceHead = spawnSync('git', ['rev-parse', 'HEAD'], { cwd: ROOT, encoding: 'utf8', windowsHide: true });
if (sourceHead.status === 0) report.sourceHead = sourceHead.stdout.trim();
report.oracleSha256 = crypto.createHash('sha256').update(fs.readFileSync(path.join(ROOT, 'src/lib/pdf-annotations.js'), 'utf8').replace(/\r\n/g, '\n')).digest('hex');
report.checkSha256 = crypto.createHash('sha256').update(fs.readFileSync(fileURLToPath(import.meta.url), 'utf8').replace(/\r\n/g, '\n')).digest('hex');
let db, pglite, nativeDatabase, nativeCreated = false;
let createdRoles = [];
let nativeArgs;
let nativeEnv;

function psqlActor(database) {
  const child = spawn(nativeArgs.command, [...nativeArgs.prefix, '-X', '-qAt', '-P', 'pager=off', '-v', 'ON_ERROR_STOP=1', '-v', 'VERBOSITY=verbose', '-U', nativeArgs.user, '-d', database], { env: nativeEnv, stdio: ['pipe', 'pipe', 'pipe'], windowsHide: true });
  let out = '', err = '', ended;
  const listeners = new Set();
  child.stdout.on('data', chunk => { out += chunk; for (const notify of listeners) notify(); });
  child.stderr.on('data', chunk => { err += chunk; });
  const done = new Promise((resolve, reject) => {
    child.once('error', reject);
    child.once('close', (code, signal) => { ended = { code, signal }; for (const notify of listeners) notify(); code === 0 ? resolve(out) : reject(new Error(`psql exit ${code}/${signal}: ${err.slice(-1600)}`)); });
  });
  // A controlled actor can reject before its caller awaits completion.
  done.catch(() => {});
  return {
    child, done,
    send: sql => child.stdin.write(sql + '\n'),
    end: () => child.stdin.end(),
    wait: (pattern, timeout = 15_000) => new Promise((resolve, reject) => {
      const timer = setTimeout(() => { listeners.delete(check); reject(new Error(`Timed out at native barrier ${pattern}`)); }, timeout);
      function check() { const match = out.match(pattern); if (match) { clearTimeout(timer); listeners.delete(check); resolve(match); } else if (ended) { clearTimeout(timer); listeners.delete(check); reject(new Error(`Native actor ended before ${pattern}: ${err.slice(-1000)}`)); } }
      listeners.add(check); check();
    }),
  };
}
async function nativeExec(sql, database = nativeDatabase) {
  const actor = psqlActor(database); actor.send(sql); actor.end(); return actor.done;
}
async function execute(sql, owner) { return db.exec(scope(sql, owner)); }
async function read(sql, owner) {
  const rows = await execute(sql, owner);
  if (backend === 'postgres') { const line = rows.trim().split(/\r?\n/).filter(Boolean).at(-1); return line ? JSON.parse(line) : null; }
  const row = rows.flatMap(result => result.rows || []).at(-1); return row ? typeof row.value === 'string' ? JSON.parse(row.value) : row.value : null;
}
const get = (hash, owner = OWNER, caller) => read(`select coalesce(jsonb_agg(data),'[]'::jsonb)::text as value from public.pdf_annotations where user_id=${q(owner)} and doc_hash=${q(hash)};`, caller);
const digest = (hash, owner = OWNER) => read(`select jsonb_build_object('data',md5(data::text),'updated_at',updated_at)::text as value from public.pdf_annotations where user_id=${q(owner)} and doc_hash=${q(hash)};`);
async function rejects(sql, owner = OWNER) {
  let failure;
  try { await execute(sql, owner); } catch (error) { failure = error; }
  assert(failure, 'The database must reject this write/read');
  return String(failure.message).slice(0, 300);
}
async function check(name, fn) {
  const started = performance.now();
  try { const detail = await fn(); report.checks.push({ name, ok: true, ms: performance.now() - started, ...(detail || {}) }); console.log(`PASS ${name}`); }
  catch (error) { report.checks.push({ name, ok: false, ms: performance.now() - started, error: String(error.message).slice(0, 1400) }); console.log(`FAIL ${name}: ${String(error.message).slice(0, 350)}`); }
}

async function nativeRace(name, stored, incomingA, incomingB) {
  const hash = doc(); if (stored) await execute(upsert(hash, stored), OWNER);
  const key = Math.floor(Math.random() * 1e8) + 7e8;
  const gate = psqlActor(nativeDatabase), a = psqlActor(nativeDatabase), b = psqlActor(nativeDatabase);
  try {
    gate.send(`select pg_advisory_lock(${key}); \n\\echo GATE_READY`); await gate.wait(/GATE_READY/);
    a.send(`begin; set local role authenticated; set local "request.jwt.claim.sub"=${q(OWNER)}; select 'A_PID:'||pg_backend_pid(); ${upsert(hash, incomingA)} \n\\echo A_WRITTEN\n select pg_advisory_xact_lock(${key}); commit; \n\\echo A_COMMITTED`); a.end();
    const aPid = Number((await a.wait(/A_PID:(\d+)/))[1]); await a.wait(/A_WRITTEN/);
    b.send(`begin; set local role authenticated; set local "request.jwt.claim.sub"=${q(OWNER)}; select 'B_PID:'||pg_backend_pid(); ${upsert(hash, incomingB)} commit; \n\\echo B_COMMITTED`); b.end();
    const bPid = Number((await b.wait(/B_PID:(\d+)/))[1]); assert.notEqual(aPid, bPid);
    let blocked = false;
    const deadline = Date.now() + 15_000;
    while (!blocked && Date.now() < deadline) {
      blocked = await read(`select exists(select 1 from pg_locks where pid=${bPid} and not granted)::text as value;`);
      if (!blocked) await new Promise(resolve => setTimeout(resolve, 25));
    }
    assert.equal(blocked, true, 'B must be observed waiting on an actual database lock before release');
    gate.send(`select pg_advisory_unlock(${key});`); gate.end();
    await Promise.all([gate.done, a.done, b.done]);
    const expectedA = stored ? oracle(incomingA, stored) : incomingA;
    const [actual] = await get(hash); assert.deepEqual(projection(actual), oracle(incomingB, expectedA));
    report.nativeRaces.push({ name, aBackendPid: aPid, bBackendPid: bPid, bLockWaitObserved: true, separateBackends: true, finalOracleMatch: true });
  } finally { for (const actor of [gate, a, b]) { if (actor.child.exitCode === null) actor.child.kill(); } }
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
    const inspect = spawnSync('docker', ['inspect', '--format', '{{.Config.Image}}', container], { env: nativeEnv, encoding: 'utf8', windowsHide: true });
    assert.equal(inspect.status, 0, inspect.stderr); assert.equal(inspect.stdout.trim(), 'postgres:17.6', 'Use the dedicated exact-version CI test service');
    nativeArgs = { command: 'docker', prefix: ['exec', '-i', container, 'psql'], user: 'postgres' };
    nativeDatabase = `vmx_annotation_lab_${crypto.randomBytes(8).toString('hex')}`;
    assert(/^vmx_annotation_lab_[0-9a-f]{16}$/.test(nativeDatabase));
    await nativeExec(`create database ${nativeDatabase};`, 'postgres'); nativeCreated = true;
    db = { exec: sql => nativeExec(sql) };
  }
  report.serverVersion = await read(`select to_jsonb(current_setting('server_version'))::text as value;`);
  if (backend === 'postgres') assert(/^17\.6(?:\D|$)/.test(report.serverVersion), `Native server must be 17.6, received ${report.serverVersion}`);
  for (const role of ['anon', 'authenticated']) {
    const exists = await read(`select exists(select 1 from pg_roles where rolname=${q(role)})::text as value;`);
    if (!exists) { await execute(`create role ${role} nologin;`); createdRoles.push(role); }
  }
  const roles = await read(`select jsonb_agg(jsonb_build_object('role',rolname,'super',rolsuper,'bypass',rolbypassrls))::text as value from pg_roles where rolname in ('anon','authenticated');`);
  assert(roles.every(role => !role.super && !role.bypass), 'Test browser roles must be nonprivileged');
  await execute(`create schema auth; create table auth.users(id uuid primary key); insert into auth.users values(${q(OWNER)}),(${q(OTHER)}); create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$; grant usage on schema auth to anon,authenticated; grant execute on function auth.uid() to anon,authenticated;`);
  await execute('create publication supabase_realtime;');
  await execute(fs.readFileSync(basePath, 'utf8'));
  await check('baseline unconditional upsert loses a retired local writer', async () => {
    const hash = doc(), initial = payload({ 1: [stroke('base')] });
    const a = payload({ 1: [stroke('base'), stroke('A')] }), b = payload({ 1: [stroke('base'), stroke('B')] });
    await execute(upsert(hash, initial), OWNER); await execute(upsert(hash, a), OWNER);
    const writerARetiredLocalCopy = null; assert.equal(writerARetiredLocalCopy, null);
    await execute(upsert(hash, b), OWNER); const [actual] = await get(hash);
    assert.deepEqual(actual.strokesByPage[1].map(s => s.id), ['base', 'B']);
    assert.notDeepEqual(projection(actual), oracle(b, oracle(a, initial)));
    return { originalDataLossReproduced: true, localWriterRetired: true };
  });
  const migration = fs.readFileSync(migrationPath, 'utf8'); report.migrationSha256 = crypto.createHash('sha256').update(migration.replace(/\r\n/g, '\n')).digest('hex');
  await execute(migration); await execute(migration);
  await check('actual migration is idempotent and trigger is an invoker', async () => {
    const fn = await read(`select jsonb_build_object('definer',prosecdef,'config',proconfig)::text as value from pg_proc where oid='public.pdf_annotations_atomic_merge()'::regprocedure;`);
    assert.equal(fn.definer, false); assert(fn.config.includes('search_path=pg_catalog'));
    assert.equal(await read(`select count(*)::text as value from pg_trigger where tgrelid='public.pdf_annotations'::regclass and tgname='pdf_annotations_atomic_merge_before_write' and not tgisinternal;`), 1);
  });
  await check('first INSERT retains a valid legacy empty object', async () => { const hash = doc(); await execute(upsert(hash, {}), OWNER); assert.deepEqual(await get(hash), [{}]); });
  await check('same-old-snapshot adds survive after local retirement', async () => {
    const hash = doc(), old = payload({ 1: [stroke('base')] }), a = payload({ 1: [stroke('base'), stroke('A')] }), b = payload({ 1: [stroke('base'), stroke('B')] });
    let localWriterA = a;
    await execute(upsert(hash, old), OWNER); await execute(upsert(hash, localWriterA), OWNER); localWriterA = null; await execute(upsert(hash, b), OWNER);
    const [actual] = await get(hash); assert.deepEqual(projection(actual), oracle(b, oracle(a, old))); assert(actual.strokesByPage[1].some(s => s.id === 'A'));
    assert.equal(localWriterA, null); return { syntheticLocalSnapshotRetiredAfterSuccessfulWrite: true };
  });
  await check('first-insert ON CONFLICT merges both initial writers', async () => { const hash = doc(), a = payload({ 1: [stroke('A')] }), b = payload({ 1: [stroke('B')] }); await execute(upsert(hash, a), OWNER); await execute(upsert(hash, b), OWNER); assert.deepEqual(projection((await get(hash))[0]), oracle(b, a)); });
  for (const order of ['add-delete', 'delete-add']) await check(`${order}: tombstones win and concurrent new ink survives`, async () => {
    const hash = doc(), old = payload({ 1: [stroke('erased')] }), add = payload({ 1: [stroke('erased'), stroke('added')] }), erase = payload({}, ['erased']);
    const writes = order === 'add-delete' ? [add, erase] : [erase, add]; await execute(upsert(hash, old), OWNER); let expected = old;
    for (const value of writes) { await execute(upsert(hash, value), OWNER); expected = oracle(value, expected); }
    const actual = (await get(hash))[0]; assert.deepEqual(projection(actual), expected); assert.deepEqual(actual.strokesByPage[1].map(s => s.id), ['added']); assert(actual.deleted.includes('erased'));
  });
  await check('metadata, reading ties, collision value and first-seen order match JS', async () => {
    const hash = doc(), old = payload({ 1: [stroke('same', { paint: 'old-first' }), stroke('old'), stroke('same', { paint: 'old-last' })] }, ['old-tomb'], { fileName: 'old.pdf', pageCount: 7, lastPage: 2, lastOpened: 200, slug: 'old-shelf', legacyFlag: 'keep' });
    const incoming = payload({ 1: [stroke('new'), stroke('same', { paint: 'new-first' }), stroke('same', { paint: 'new-last' }), stroke('deleted-new')] }, ['deleted-new', 'new-tomb', 'old-tomb', 'new-tomb'], { fileName: 'new.pdf', pageCount: 4, lastPage: 5, lastOpened: 200, slug: 'new-shelf' });
    await execute(upsert(hash, old), OWNER); await execute(upsert(hash, incoming), OWNER); const actual = (await get(hash))[0];
    assert.deepEqual(projection(actual), oracle(incoming, old)); assert.equal(actual.legacyFlag, 'keep'); assert.equal(actual.lastPage, 5); assert.equal(actual.pageCount, 7);
    assert.deepEqual(actual.strokesByPage[1].map(s => s.id), ['new', 'same', 'old']); assert.equal(actual.strokesByPage[1][1].paint, 'old-last');
    await execute(upsert(hash, actual), OWNER); assert.deepEqual((await get(hash))[0], actual);
  });
  await check('older arrivals preserve newest cursor and empty fields fall back', async () => {
    const hash = doc(), old = payload({ 2: [stroke('old-page')] }, [], { fileName: 'known.pdf', pageCount: 8, lastPage: 6, lastOpened: 300, slug: 'known-shelf' });
    const incoming = { fileName: '', pageCount: 0, lastOpened: 100, slug: null, strokesByPage: { 1: [stroke('new-page')] } };
    await execute(upsert(hash, old), OWNER); await execute(upsert(hash, incoming), OWNER); assert.deepEqual(projection((await get(hash))[0]), oracle(incoming, old));
  });
  await check('case/Unicode IDs stay distinct; modern and legacy tuples survive', async () => {
    const hash = doc(), old = payload({ 1: [stroke('A'), stroke('é', { pts: [[1, 2, 3, 4]], legacyPaint: true })] }), incoming = payload({ 1: [stroke('a'), stroke('e')] });
    await execute(upsert(hash, old), OWNER); await execute(upsert(hash, incoming), OWNER); assert.deepEqual(projection((await get(hash))[0]), oracle(incoming, old));
  });
  await check('actual emitted packed pen/highlighter/snapped-shape payloads are accepted', async () => {
    const pen = packStroke({ id: 'emitted-pen', mode: 'pen', color: 'ink', size: 2, pressure: true, points: [[0.112345, 0.234567, 0.555], [0.345678, 0.456789, 0.777]] });
    const highlighter = packStroke({ id: 'emitted-highlighter', mode: 'highlighter', color: 'yellow', size: 8, pressure: false, points: [[0.1, 0.2], [0.3, 0.4]] });
    const shape = fitShape(Array.from({ length: 20 }, (_, i) => [0.1 + i * 0.02, 0.2 + i * 0.01]), 1); assert(shape);
    const snapped = packStroke({ id: 'emitted-shape', mode: 'pen', color: 'ink', size: 2, pressure: false, points: shape.points });
    const hash = doc(), old = payload({ 1: [pen, highlighter] }), incoming = payload({ 1: [snapped] });
    await execute(upsert(hash, old), OWNER); await execute(upsert(hash, incoming), OWNER); assert.deepEqual(projection((await get(hash))[0]), oracle(incoming, old));
    return { currentCodecUsed: true, shapeKind: shape.kind, strokeModes: ['pen', 'highlighter', 'snapped-pen'] };
  });
  const malformed = [[], null, { strokesByPage: [] }, { strokesByPage: { 1: {} } }, { strokesByPage: { 0: [] } }, { strokesByPage: { 1: [null] } }, { strokesByPage: { 1: [{ id: '' }] } }, { strokesByPage: { 1: [{ id: 12 }] } }, { strokesByPage: { 1: [{ id: 'point', points: 'bad' }] } }, { strokesByPage: { 1: [{ id: 'point', pts: [[1]] }] } }, { strokesByPage: { 1: [{ id: 'point', points: [[1, 'bad']] }] } }, { deleted: {} }, { deleted: [false] }, { deleted: [' '] }, { fileName: 42 }, { lastOpened: 'later' }, { lastPage: null }, { slug: [] }];
  for (const [i, bad] of malformed.entries()) await check(`malformed ${i + 1} fails without changing stored data`, async () => {
    const hash = doc(); await execute(upsert(hash, payload({ 1: [stroke('safe')] })), OWNER); const before = await digest(hash); await rejects(upsert(hash, bad)); assert.deepEqual(await digest(hash), before);
  });
  await check('malformed first INSERT creates no row', async () => { const hash = doc(); await rejects(upsert(hash, { deleted: [null] })); assert.deepEqual(await get(hash), []); });
  await check('untrusted numeric overflow cannot introduce nonfinite metadata or points', async () => {
    const hash = doc(); await execute(upsert(hash, payload({ 1: [stroke('safe')] })), OWNER); const before = await digest(hash);
    for (const raw of ['{"lastOpened":1e309}', '{"strokesByPage":{"1":[{"id":"overflow","points":[[1,1e309]]}]}}']) {
      await rejects(`insert into public.pdf_annotations(user_id,doc_hash,data) values(${q(OWNER)},${q(hash)},${q(raw)}::jsonb) on conflict(user_id,doc_hash) do update set data=excluded.data;`); assert.deepEqual(await digest(hash), before);
    }
  });
  await check('malformed locked OLD rejects instead of silently repairing it', async () => {
    const hash = doc(); await execute(`alter table public.pdf_annotations disable trigger pdf_annotations_atomic_merge_before_write; ${upsert(hash, { strokesByPage: { 1: 'bad' } })} alter table public.pdf_annotations enable trigger pdf_annotations_atomic_merge_before_write;`);
    const before = await digest(hash); await rejects(upsert(hash, payload({ 1: [stroke('new')] }))); assert.deepEqual(await digest(hash), before);
  });
  await check('one bad member rolls back an entire multi-row statement', async () => {
    const a = doc(), b = doc(); await execute(upsert(a, payload({ 1: [stroke('kept')] })), OWNER); const before = await digest(a);
    await rejects(`insert into public.pdf_annotations(user_id,doc_hash,data) values(${q(OWNER)},${q(a)},${json(payload({ 1: [stroke('added')] }))}),(${q(OWNER)},${q(b)},${json({ deleted: [123] })}) on conflict(user_id,doc_hash) do update set data=excluded.data;`);
    assert.deepEqual(await digest(a), before); assert.deepEqual(await get(b), []);
  });
  await check('8 MiB CHECK is evaluated after union; failure retains all old work', async () => {
    const hash = doc(), a = payload({ 1: [stroke('largeA', { padding: crypto.randomBytes(3 * 1024 * 1024 + 128 * 1024).toString('base64') })] }), b = payload({ 1: [stroke('largeB', { padding: crypto.randomBytes(3 * 1024 * 1024 + 128 * 1024).toString('base64') })] });
    const sizes = await read(`select jsonb_build_object('a',pg_column_size(${json(a)}),'b',pg_column_size(${json(b)}))::text as value;`); assert(sizes.a < 8 * 1024 * 1024 && sizes.b < 8 * 1024 * 1024);
    await execute(upsert(hash, a), OWNER); const before = await digest(hash); const error = await rejects(upsert(hash, b)); assert(error.includes('pdf_annotations_data_size'), 'The actual postmerge size constraint must reject'); assert.deepEqual(await digest(hash), before);
    return { eachIncomingBelowCap: true, afterMergeConstraintRejected: true, incomingSizes: sizes };
  });
  await check('row user/document identities cannot be reassigned even by lab admin', async () => {
    const hash = doc(); await execute(upsert(hash, payload({ 1: [stroke('owned')] })), OWNER); const before = await digest(hash);
    await rejects(`update public.pdf_annotations set user_id=${q(OTHER)} where user_id=${q(OWNER)} and doc_hash=${q(hash)};`, 'admin');
    await rejects(`update public.pdf_annotations set doc_hash=${q(doc())} where user_id=${q(OWNER)} and doc_hash=${q(hash)};`);
    assert.deepEqual(await digest(hash), before);
  });
  await check('authenticated owner positive, same document other owner isolated, anon negative', async () => {
    const hash = doc(); await execute(upsert(hash, payload({ 1: [stroke('owner')] })), OWNER); assert.equal((await get(hash, OWNER, OWNER)).length, 1); assert.deepEqual(await get(hash, OWNER, OTHER), []);
    await rejects(upsert(hash, payload({ 1: [stroke('intruder')] }), OWNER), OTHER); await execute(upsert(hash, payload({ 1: [stroke('other')] }), OTHER), OTHER);
    assert.deepEqual((await get(hash, OTHER, OTHER))[0].strokesByPage[1].map(s => s.id), ['other']); assert.deepEqual((await get(hash))[0].strokesByPage[1].map(s => s.id), ['owner']);
    await rejects(`select data from public.pdf_annotations;`, null); await rejects(upsert(doc(), payload()), null);
  });
  if (backend === 'postgres') {
    const old = payload({ 1: [stroke('base')] }), addA = payload({ 1: [stroke('base'), stroke('A')] }), addB = payload({ 1: [stroke('base'), stroke('B')] }), erase = payload({}, ['base']);
    await check('native barrier: two adds from an existing old snapshot', () => nativeRace('existing-add-add', old, addA, addB));
    await check('native barrier: conflicting first INSERT writers', () => nativeRace('first-insert', null, payload({ 1: [stroke('A')] }), payload({ 1: [stroke('B')] })));
    await check('native barrier: add followed by stale erase', () => nativeRace('add-delete', old, addA, erase));
    await check('native barrier: erase followed by stale add', () => nativeRace('delete-add', old, erase, addA));
  }
} catch (error) { report.fatal = String(error.message).slice(0, 2000); }
finally {
  try {
    if (pglite) { await pglite.close(); report.disposableDatabaseClosed = true; }
    if (nativeCreated) { await nativeExec(`drop database ${nativeDatabase} with (force);`, 'postgres'); for (const role of createdRoles) await nativeExec(`drop role ${role};`, 'postgres'); report.disposableDatabaseDropped = true; }
  } catch (error) { report.cleanupError = String(error.message).slice(0, 1400); }
  report.finishedAt = new Date().toISOString(); report.passed = report.checks.filter(check => check.ok).length; report.failed = report.checks.filter(check => !check.ok).length; report.nativeMultiBackendProof = report.nativeRaces.length === 4 && report.nativeRaces.every(race => race.bLockWaitObserved);
  report.checkSourceUnchanged = report.checkSha256 === crypto.createHash('sha256').update(fs.readFileSync(fileURLToPath(import.meta.url), 'utf8').replace(/\r\n/g, '\n')).digest('hex');
  report.oracleSourceUnchanged = report.oracleSha256 === crypto.createHash('sha256').update(fs.readFileSync(path.join(ROOT, 'src/lib/pdf-annotations.js'), 'utf8').replace(/\r\n/g, '\n')).digest('hex');
  report.migrationSourceUnchanged = !!report.migrationSha256 && report.migrationSha256 === crypto.createHash('sha256').update(fs.readFileSync(migrationPath, 'utf8').replace(/\r\n/g, '\n')).digest('hex');
  report.ok = !report.fatal && !report.cleanupError && report.failed === 0 && report.checks.length > 0 && report.checkSourceUnchanged && report.oracleSourceUnchanged && report.migrationSourceUnchanged && (backend === 'pglite' || report.nativeMultiBackendProof);
  fs.mkdirSync(path.dirname(receiptPath), { recursive: true }); fs.writeFileSync(receiptPath, JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify({ backend, serverVersion: report.serverVersion, passed: report.passed, failed: report.failed, fatal: report.fatal || null, cleanupError: report.cleanupError || null, nativeMultiBackendProof: report.nativeMultiBackendProof, limitation: report.limitation, receiptPath, ok: report.ok }));
  process.exitCode = report.ok ? 0 : 1;
}
