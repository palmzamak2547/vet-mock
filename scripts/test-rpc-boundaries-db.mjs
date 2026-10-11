// Round-2 package H: the six server-boundary migrations, each proven red
// (the old behaviour reproduced on the real previous definition) and then
// green, in a disposable database only. Never a production connection.
//
//   PGLITE_MODULE=/path/to/pglite/dist/index.js node scripts/test-rpc-boundaries-db.mjs [--only=h1,h4]
//   CI: PG_CONTAINER=<postgres:17.6 service ID> node scripts/test-rpc-boundaries-db.mjs --backend=postgres
//
// The native adapter follows test-user-data-db.mjs: it accepts only the
// dedicated GitHub Actions container and never a database URL. Do not fold
// this into test-user-data-db.mjs; that file is the sync engine's harness.
//
// What is loaded before the candidates, in this order, so "before" means the
// definition production runs today (live equals repo for every function
// replaced here, compared on 2026-10-11):
//   20260513000000_imaging_lab_init.sql           (H1 before: "owner all")
//   20260907060250_verified_exam_results.sql       (H2 before)
//   20260907060309_authenticated_races.sql         (H6 before)
//   20260907061646_race_question_revisions.sql     (H6 before, question_versions)
//   20260915133000_admin_backoffice_v3.sql         (H3 before)
// q_comments, realtime.messages and the live imaging grants have no repo
// migration with the live text, so the fixture declares them as production
// has them (pg_policies / grants read 2026-10-11).
//
// PGlite ships no pgcrypto: extensions.hmac and extensions.gen_random_bytes
// are stand-ins there (a keyed md5 pair, random bytes); the receipt logic
// under test does not depend on the digest algorithm. Native mode uses the
// real pgcrypto.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawn, spawnSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = fileURLToPath(new URL('../', import.meta.url));
const option = (name, fallback) => process.argv.find(arg => arg.startsWith(`--${name}=`))?.slice(name.length + 3) || fallback;
const backend = option('backend', 'pglite');
assert(['pglite', 'postgres'].includes(backend));
const only = new Set(option('only', 'h1,h2,h3,h4,h5,h6').toLowerCase().split(',').map(s => s.trim()).filter(Boolean));
const receiptPath = path.resolve(ROOT, option('receipt', `work/polish-1011/round2/H/rpc-boundaries-${backend}.json`));
const MIGRATIONS = path.join(ROOT, 'supabase/migrations');
const migrationFile = name => { const file = path.join(MIGRATIONS, name); assert(fs.existsSync(file), `missing ${name}`); return file; };
const BASE = [
  '20260513000000_imaging_lab_init.sql',
  '20260907060250_verified_exam_results.sql',
  '20260907060309_authenticated_races.sql',
  '20260907061646_race_question_revisions.sql',
  '20260915133000_admin_backoffice_v3.sql',
];
const CANDIDATES = {
  h1: '20261011120100_imaging_policies_match_live.sql',
  h2: '20261011120200_exam_receipt_idempotent_ack.sql',
  h3: '20261011120300_admin_answers_by_version.sql',
  h4: '20261011120400_q_comments_admin_delete.sql',
  h5: '20261011120500_study_buddies_private_channel.sql',
  h6: '20261011120600_race_join_rate_limit.sql',
};
// Read from production on 2026-10-11 (read-only): the imaging policy digest
// the H1 apply must leave unchanged, and the q_comments digest before H4.
const LIVE = {
  imagingPolicyDigest: 'cdba5c0abf14b27db16a614ecf5b251f', imagingPolicyRows: 6,
  qCommentsPolicyDigestBefore: 'b57f1f0159264213086bc454b9f39766', qCommentsPolicyRows: 4,
};
const POLICY_DIGEST = (where) => `select jsonb_build_object('digest', md5(string_agg(tablename || '|' || policyname || '|' || cmd || '|' || roles::text || '|' || permissive || '|' || coalesce(qual,'') || '|' || coalesce(with_check,''), E'\\n' order by tablename, policyname)), 'n', count(*))::text as value from pg_policies where schemaname = 'public' and ${where};`;

const q = value => `'${String(value).replaceAll("'", "''")}'`;
const json = value => `${q(JSON.stringify(value))}::jsonb`;
const hash = value => crypto.createHash('sha256').update(value.replace(/\r\n/g, '\n')).digest('hex');
// actor: undefined = superuser, null = anon, { id, session } = a signed-in student with a live session row.
const scope = (sql, actor) => actor === undefined ? sql
  : actor === null ? `begin; set local role anon; set local "request.jwt.claim.sub"=''; set local "request.jwt.claims"='{"role":"anon"}'; ${sql} commit;`
  : `begin; set local role authenticated; set local "request.jwt.claim.sub"=${q(actor.id)}; set local "request.jwt.claims"=${q(JSON.stringify({ sub: actor.id, role: 'authenticated', session_id: actor.session || '' }))}; ${sql} commit;`;
const report = { startedAt: new Date().toISOString(), backend, productionConnectionUsed: false, realUserDataUsed: false,
  base: BASE, candidates: {}, checks: [], liveReference: LIVE,
  limitation: backend === 'pglite' ? 'One PostgreSQL WASM backend (PGlite, no pgcrypto: hmac/gen_random_bytes are stand-ins). Native PostgreSQL 17.6 on CI runs the same checks with pgcrypto.' : null };
const head = spawnSync('git', ['rev-parse', 'HEAD'], { cwd: ROOT, encoding: 'utf8', windowsHide: true });
if (head.status === 0) report.sourceHead = head.stdout.trim();
report.checkSha256 = hash(fs.readFileSync(fileURLToPath(import.meta.url), 'utf8'));
let db, pglite, nativeDatabase, nativeCreated = false, nativeArgs, nativeEnv;
const createdRoles = [];

function psqlActor(database) {
  const child = spawn(nativeArgs.command, [...nativeArgs.prefix, '-X', '-qAt', '-P', 'pager=off', '-v', 'ON_ERROR_STOP=1', '-v', 'VERBOSITY=verbose', '-U', nativeArgs.user, '-d', database], { env: nativeEnv, stdio: ['pipe', 'pipe', 'pipe'], windowsHide: true });
  let out = '', err = '';
  child.stdout.on('data', chunk => { out += chunk; });
  child.stderr.on('data', chunk => { err += chunk; });
  const done = new Promise((resolve, reject) => {
    child.once('error', reject);
    child.once('close', (code, signal) => code === 0 ? resolve(out) : reject(new Error(`psql exit ${code}/${signal}: ${err.slice(-1800)}`)));
  });
  done.catch(() => {});
  return { child, done, send: sql => child.stdin.write(sql + '\n'), end: () => child.stdin.end() };
}
async function nativeExec(sql, database = nativeDatabase) { const actor = psqlActor(database); actor.send(sql); actor.end(); return actor.done; }
async function execute(sql, actor) { return db.exec(scope(sql, actor)); }
async function read(sql, actor) {
  const result = await execute(sql, actor);
  if (backend === 'postgres') { const line = result.trim().split(/\r?\n/).filter(Boolean).at(-1); return line ? JSON.parse(line) : null; }
  const row = result.flatMap(item => item.rows || []).at(-1);
  return row ? typeof row.value === 'string' ? JSON.parse(row.value) : row.value : null;
}
async function rejects(sql, actor, pattern) {
  let failure;
  try { await execute(sql, actor); } catch (error) { failure = error; }
  assert(failure, 'Database must refuse the operation');
  const message = String(failure.message).slice(0, 400);
  if (pattern) assert.match(message, pattern);
  return message;
}
async function check(name, fn) {
  const started = performance.now();
  try { const detail = await fn(); report.checks.push({ name, ok: true, ms: Math.round(performance.now() - started), ...(detail || {}) }); console.log(`PASS ${name}`); }
  catch (error) { report.checks.push({ name, ok: false, ms: Math.round(performance.now() - started), error: String(error.message).slice(0, 1600) }); console.log(`FAIL ${name}: ${String(error.message).slice(0, 400)}`); }
}
const SIGNING_SECRET = 'rpc-boundaries-disposable-secret-0123456789abcdef';
// The stand-in must agree with extensions.hmac below in each backend.
const sign = payload => backend === 'postgres'
  ? crypto.createHmac('sha256', SIGNING_SECRET).update(payload).digest('hex')
  : crypto.createHash('md5').update(`${SIGNING_SECRET}:${payload}`).digest('hex') + crypto.createHash('md5').update(`${payload}:${SIGNING_SECRET}`).digest('hex');
async function student(username = 'student') {
  const id = crypto.randomUUID(), session = crypto.randomUUID();
  await execute(`insert into auth.users(id) values(${q(id)}); insert into auth.sessions(id, user_id) values(${q(session)}, ${q(id)}); insert into public.profiles(id, username) values(${q(id)}, ${q(`${username}-${id.slice(0, 4)}`)});`);
  return { id, session };
}
// The functions each candidate replaces: after the apply the receipt records
// md5(pg_get_functiondef(...)), the value the integrator reads back from
// production (pg_get_functiondef is header plus verbatim body, the same text
// in PostgreSQL 17 and 18).
const REPLACED = {
  h2: ['public.record_exam_receipt(text, text)'],
  h3: ['public.admin_questions(int, int, int)', 'public.admin_question_detail(bigint)'],
  h6: ['public.enter_race(text)'],
};
async function applyCandidate(key) {
  const file = migrationFile(CANDIDATES[key]);
  const sql = fs.readFileSync(file, 'utf8');
  report.candidates[key] = { file: path.relative(ROOT, file).replaceAll('\\', '/'), sha256: hash(sql) };
  await execute(sql); await execute(sql); // idempotent: a second apply is a no-op
  report.candidates[key].appliedTwice = true;
  for (const signature of REPLACED[key] || []) {
    report.candidates[key].functionDefMd5 ??= {};
    report.candidates[key].functionDefMd5[signature] = await read(`select to_jsonb(md5(pg_get_functiondef(${q(signature)}::regprocedure)))::text as value;`);
  }
}
async function functionFacts(signature) {
  return read(`select jsonb_build_object('definer', p.prosecdef, 'config', p.proconfig, 'anon', has_function_privilege('anon', p.oid, 'execute'), 'authenticated', has_function_privilege('authenticated', p.oid, 'execute'))::text as value from pg_proc p where p.oid = ${q(signature)}::regprocedure;`);
}

try {
  if (backend === 'pglite') {
    const modulePath = process.env.PGLITE_MODULE || path.join(ROOT, 'node_modules/@electric-sql/pglite/dist/index.js');
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
    nativeDatabase = `vmx_rpc_boundaries_${crypto.randomBytes(8).toString('hex')}`;
    await nativeExec(`create database ${nativeDatabase};`, 'postgres'); nativeCreated = true;
    db = { exec: sql => nativeExec(sql) };
  }
  report.serverVersion = await read(`select to_jsonb(current_setting('server_version'))::text as value;`);
  for (const role of ['anon', 'authenticated', 'service_role']) {
    const exists = await read(`select exists(select 1 from pg_roles where rolname=${q(role)})::text as value;`);
    if (!exists) { await execute(`create role ${role} nologin;`); createdRoles.push(role); }
  }

  // ── Fixture: the schemas and tables the five base migrations and the six candidates touch ──
  await execute(`
    create schema auth; create schema extensions; create schema private; create schema realtime;
    create table auth.users(id uuid primary key, raw_user_meta_data jsonb not null default '{}');
    create table auth.sessions(id uuid primary key, user_id uuid not null references auth.users(id) on delete cascade);
    create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
    create function auth.jwt() returns jsonb language sql stable as $$ select coalesce(nullif(current_setting('request.jwt.claims', true), ''), '{}')::jsonb $$;
    grant usage on schema auth to anon, authenticated, service_role;
    grant execute on function auth.uid(), auth.jwt() to anon, authenticated, service_role;
    grant usage on schema extensions to anon, authenticated, service_role;
    grant usage on schema private to authenticated;
    create table public.profiles(id uuid primary key references auth.users(id) on delete cascade, username text not null, avatar_emoji text default '🐾',
      total_attempts integer default 0, total_correct integer default 0, streak integer default 0, last_study_date date, created_at timestamptz default now());
    alter table public.profiles enable row level security;
    create table public.exam_results(id uuid primary key default gen_random_uuid(), user_id uuid references auth.users(id) on delete cascade, group_id uuid,
      mode text not null, subject text, total integer not null, correct integer not null, pct integer not null, duration_sec integer,
      created_at timestamptz default now(), year integer, phase text);
    alter table public.exam_results enable row level security;
    grant select, insert, update, delete on public.exam_results to authenticated;
    create function private.is_current_user_group_member(group_id uuid) returns boolean language sql stable as $$ select false $$;
    create table public.user_data(user_id uuid primary key references auth.users(id) on delete cascade, history jsonb default '[]', updated_at timestamptz default now());
    alter table public.user_data enable row level security;
    create table public.study_event_batches(user_id uuid not null references auth.users(id) on delete cascade, session_id uuid not null,
      events jsonb not null default '{}', updated_at timestamptz not null default now(), primary key (user_id, session_id));
    alter table public.study_event_batches enable row level security;
    create table public.admin_users(user_id uuid primary key references auth.users(id) on delete cascade, added_at timestamptz not null default now());
    alter table public.admin_users enable row level security;
    revoke all on table public.admin_users from public, anon, authenticated;
    create or replace function public.is_admin() returns boolean language sql stable security definer set search_path = public as $$
      select exists (select 1 from public.admin_users a where a.user_id = auth.uid()); $$;
    revoke execute on function public.is_admin() from public, anon;
    grant execute on function public.is_admin() to authenticated, service_role;
    create table public.q_comments(id uuid primary key default gen_random_uuid(), q_subject text not null, q_id integer not null,
      user_id uuid not null references public.profiles(id) on delete cascade, body text not null check (char_length(body) between 1 and 2000),
      parent_id uuid references public.q_comments(id) on delete cascade, created_at timestamptz not null default now(), updated_at timestamptz not null default now());
    alter table public.q_comments enable row level security;
    grant select on public.q_comments to anon, authenticated; grant insert, update, delete on public.q_comments to authenticated;
    create policy "qc_select_all" on public.q_comments for select using (true);
    create policy "qc_insert_own" on public.q_comments for insert with check ((select auth.uid()) = user_id);
    create policy "qc_update_own" on public.q_comments for update using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
    create policy "users self-delete q_comments" on public.q_comments for delete to authenticated using ((select auth.uid()) = user_id);
    create table public.race_results(id uuid primary key default gen_random_uuid(), race_code text not null, user_id uuid not null references public.profiles(id) on delete cascade,
      subject text not null, question_count integer not null, correct_count integer not null, duration_ms integer not null,
      created_at timestamptz not null default now(), year integer, phase text);
    alter table public.race_results enable row level security;
    grant select, insert on public.race_results to authenticated;
    create table realtime.messages(topic text, extension text, payload jsonb, event text, private boolean, updated_at timestamp default now(),
      inserted_at timestamp default now(), id uuid default gen_random_uuid()) partition by range (inserted_at);
    create table realtime.messages_fixture partition of realtime.messages for values from ('2020-01-01') to ('2100-01-01');
    alter table realtime.messages enable row level security;
    create function realtime.topic() returns text language sql stable as $$ select nullif(current_setting('realtime.topic', true), '')::text $$;
    grant usage on schema realtime to anon, authenticated, service_role;
    grant select, insert, update on realtime.messages to anon, authenticated, service_role;
    grant execute on function realtime.topic() to anon, authenticated, service_role;
  `);
  if (backend === 'postgres') await execute(`create extension if not exists pgcrypto with schema extensions;`);
  else await execute(`
    create function extensions.hmac(data text, key text, algo text) returns bytea language sql immutable as $$ select decode(md5(key || ':' || data) || md5(data || ':' || key), 'hex') $$;
    create function extensions.gen_random_bytes(n integer) returns bytea language sql volatile as $$ select decode(lpad(to_hex((random() * 4294967295)::bigint), 8, '0'), 'hex') $$;
  `);
  for (const name of BASE) { const sql = fs.readFileSync(migrationFile(name), 'utf8'); await execute(sql); }
  // Grants production holds that the base files above do not restate. The
  // imaging_cases column grant is the live one (20260824180000) minus the
  // license columns the fixture table lacks: no created_by, so a browser
  // addresses its own case by id, as the app does.
  await execute(`
    grant insert, update, delete on public.imaging_cases to authenticated;
    grant select (id, slug, title, species, signalment, history, body_part, modality, learning_objectives, difficulty, status, created_at, updated_at)
      on table public.imaging_cases to anon, authenticated;
    grant select, insert, update, delete on public.imaging_case_files, public.imaging_attempts to authenticated;
    grant execute on function public.admin_questions(int, int, int), public.admin_question_detail(bigint) to authenticated, service_role;
    insert into private.application_signing_keys(name, secret) values ('app-rpc', ${q(SIGNING_SECRET)});
  `);

  // ── H1: imaging policies ─────────────────────────────────────────────────
  const publishAttempt = (actor, status, id = crypto.randomUUID()) => `insert into public.imaging_cases(id, slug, title, status, created_by) values (${q(id)}, ${q(`case-${id.slice(0, 8)}`)}, 'x', ${q(status)}, ${q(actor.id)});`;
  const casesOf = actor => read(`select jsonb_agg(status order by status)::text as value from public.imaging_cases where created_by = ${q(actor.id)};`);
  const titleOf = id => read(`select to_jsonb(title)::text as value from public.imaging_cases where id = ${q(id)};`);
  if (only.has('h1')) {
    await check('H1 red: the repo policy "owner all" lets a student publish their own case', async () => {
      const palm = await student('imaging');
      await execute(publishAttempt(palm, 'public'), palm);
      assert.deepEqual(await casesOf(palm), ['public'], 'the looser repo policy accepted status public');
      const before = await read(POLICY_DIGEST("tablename like 'imaging_%'"));
      assert.equal(before.n, 4, 'the repo defines four imaging policies');
      assert.notEqual(before.digest, LIVE.imagingPolicyDigest, 'the repo state differs from production');
      return { repoPolicyDigest: before.digest };
    });
    await applyCandidate('h1');
    await check('H1 green: a student may insert or update only a non-public case; owner delete and reads keep working', async () => {
      const palm = await student('imaging'), other = await student('other');
      const draft = crypto.randomUUID(), kept = crypto.randomUUID();
      await rejects(publishAttempt(palm, 'public'), palm, /row-level security/i);
      await execute(publishAttempt(palm, 'draft', draft), palm);
      await execute(publishAttempt(palm, 'private', kept), palm);
      assert.deepEqual(await casesOf(palm), ['draft', 'private']);
      await rejects(`update public.imaging_cases set status = 'public' where id = ${q(kept)};`, palm, /row-level security/i);
      await execute(`update public.imaging_cases set title = 'renamed' where id = ${q(kept)};`, palm);
      await execute(`delete from public.imaging_cases where id = ${q(draft)};`, palm);
      assert.deepEqual(await casesOf(palm), ['private']);
      // Another student cannot touch it: the update and delete policies are owner-bound, so both statements match no row.
      await execute(`delete from public.imaging_cases where id = ${q(kept)};`, other);
      await execute(`update public.imaging_cases set title = 'stolen' where id = ${q(kept)};`, other);
      assert.deepEqual(await casesOf(palm), ['private']);
      assert.equal(await titleOf(kept), 'renamed');
      // The read policy: the owner sees their private case, another student does not; a public case is visible to both.
      const mine = (actor, id) => read(`select to_jsonb(count(*))::text as value from public.imaging_cases where id = ${q(id)};`, actor);
      assert.equal(await mine(palm, kept), 1); assert.equal(await mine(other, kept), 0);
      const shown = crypto.randomUUID();
      await execute(`insert into public.imaging_cases(id, slug, title, status, created_by) values (${q(shown)}, 'case-public', 'shown', 'public', ${q(palm.id)});`);
      assert.equal(await mine(other, shown), 1); assert.equal(await mine(null, shown), 1, 'anon reads a public case through the column grant');
    });
    await check('H1 green: the policy digest equals the production digest, so the apply changes nothing live', async () => {
      const after = await read(POLICY_DIGEST("tablename like 'imaging_%'"));
      assert.equal(after.n, LIVE.imagingPolicyRows);
      assert.equal(after.digest, LIVE.imagingPolicyDigest, `pg_policies text must match production byte for byte: ${JSON.stringify(after)}`);
      return { imagingPolicyDigest: after.digest };
    });
  }

  // ── H2: exam receipt ────────────────────────────────────────────────────
  const receipt = (actor, id, data) => {
    const payload = JSON.stringify({ purpose: 'exam-result', issuedAt: Math.floor(Date.now() / 1000), data: {
      id, user_id: actor.id, mode: 'exam', subject: 'com5', total: 10, correct: 8, pct: 80, duration_sec: 120, year: 5, phase: '1-mid',
      score_source: 'server', submission_fingerprint: 'fp-' + id.slice(0, 8), ...data } });
    return read(`select public.record_exam_receipt(${q(payload)}, ${q(sign(payload))})::text as value;`, actor);
  };
  if (only.has('h2')) {
    await check('H2 red: a retry of the same run with a recomputed score_source and subject is refused as result_conflict', async () => {
      const palm = await student('exam'); const id = crypto.randomUUID();
      assert.deepEqual(await receipt(palm, id, {}), { ok: true, id, verification: 'server' });
      const retry = await receipt(palm, id, { score_source: 'client', subject: 'com3', year: 4 });
      assert.deepEqual(retry, { ok: false, id, error: 'result_conflict' }, 'the old definition refuses the row the student already owns');
    });
    await applyCandidate('h2');
    await check('H2 green: the same fingerprint acknowledges the stored run with its stored verification', async () => {
      const palm = await student('exam'); const id = crypto.randomUUID();
      assert.deepEqual(await receipt(palm, id, {}), { ok: true, id, verification: 'server' });
      const retry = await receipt(palm, id, { score_source: 'client', subject: 'com3', year: 4 });
      assert.deepEqual(retry, { ok: true, id, verification: 'server' });
      const stored = await read(`select jsonb_build_object('score_source', score_source, 'subject', subject, 'year', year)::text as value from public.exam_results where id = ${q(id)};`);
      assert.deepEqual(stored, { score_source: 'server', subject: 'com5', year: 5 }, 'the stored row is untouched by the retry');
      assert.deepEqual(await receipt(palm, id, {}), { ok: true, id, verification: 'server' }, 'an identical retry still acknowledges');
    });
    await check('H2 green: a different fingerprint, another account, or a row without a fingerprint keep the old refusals', async () => {
      const palm = await student('exam'), other = await student('other'); const id = crypto.randomUUID();
      await receipt(palm, id, {});
      assert.deepEqual(await receipt(palm, id, { submission_fingerprint: 'fp-other-run' }), { ok: false, id, error: 'result_conflict' });
      await rejects(`select public.record_exam_receipt('{}', '${'0'.repeat(64)}');`, other, /Invalid receipt/);
      const payload = JSON.stringify({ purpose: 'exam-result', issuedAt: Math.floor(Date.now() / 1000), data: { id, user_id: other.id, mode: 'exam', subject: 'com5', total: 10, correct: 8, pct: 80, duration_sec: 120, year: 5, phase: '1-mid', score_source: 'server', submission_fingerprint: 'fp-' + id.slice(0, 8) } });
      await rejects(`select public.record_exam_receipt(${q(payload)}, ${q(sign(payload))});`, other, /Receipt unavailable/);
      // A row the browser inserted directly has no fingerprint (the trigger strips it): compared field by field, as before.
      const legacy = crypto.randomUUID();
      await execute(`insert into public.exam_results(id, user_id, mode, subject, total, correct, pct, duration_sec, year, phase, score_source, submission_fingerprint)
        values (${q(legacy)}, ${q(palm.id)}, 'exam', 'com5', 10, 8, 80, 120, 5, '1-mid', 'server', 'fp-claimed');`, palm);
      assert.equal(await read(`select to_jsonb(submission_fingerprint is null)::text as value from public.exam_results where id = ${q(legacy)};`), true);
      assert.deepEqual(await receipt(palm, legacy, {}), { ok: false, id: legacy, error: 'result_conflict' });
      const facts = await functionFacts('public.record_exam_receipt(text, text)');
      assert.deepEqual(facts, { definer: true, config: ['search_path=""'], anon: false, authenticated: true });
      return { facts };
    });
  }

  // ── H3: admin answers by version ────────────────────────────────────────
  const QID = 7001;
  async function seedAttempts() {
    const admin = await student('admin'), a = await student('a'), b = await student('b');
    await execute(`insert into public.admin_users(user_id) values (${q(admin.id)});`);
    const history = who => json([{ questionId: QID, subject: 'com5', correct: false, date: Date.now() - 1000 }, { questionId: QID, subject: 'com5', correct: true, date: Date.now() - 500 }]);
    await execute(`insert into public.user_data(user_id, history) values (${q(a.id)}, ${history()}), (${q(b.id)}, ${history()});`);
    const ev = (version, answer, questionId = QID) => ({ kind: 'attempt', questionId, answer, ...(version ? { questionVersion: version } : {}) });
    await execute(`insert into public.study_event_batches(user_id, session_id, events) values
      (${q(a.id)}, ${q(crypto.randomUUID())}, ${json({ 'attempt:s1:7001': ev('q1-aaaa0001', 1), 'attempt:s1:7002': ev('q1-zzzz', 0, 7002) })}),
      (${q(a.id)}, ${q(crypto.randomUUID())}, ${json({ 'attempt:s2:7001': ev('q1-aaaa0001', 2) })}),
      (${q(b.id)}, ${q(crypto.randomUUID())}, ${json({ 'attempt:s3:7001': ev('q1-bbbb0002', 1), 'attempt:s4:7001': ev(null, 3), 'review:x': { kind: 'review', questionId: QID } })});`);
    return { admin, a, b };
  }
  const adminRows = actor => read(`select public.admin_questions(0, 1, 80)::text as value;`, actor);
  const adminDetail = actor => read(`select public.admin_question_detail(${QID})::text as value;`, actor);
  const sum = dist => Object.values(dist || {}).reduce((s, n) => s + Number(n), 0);
  if (only.has('h3')) {
    let seeded;
    await check('H3 red: the admin readers merge every question version into one answer distribution', async () => {
      seeded = await seedAttempts();
      const rows = await adminRows(seeded.admin);
      const row = rows.find(r => r.question_id === QID);
      assert.ok(row, 'the question is listed');
      assert.deepEqual(row.answers, { 1: 2, 2: 1, 3: 1 });
      assert.equal('answers_by_version' in row, false, 'no per-version split before');
      assert.equal('answers_by_version' in (await adminDetail(seeded.admin)), false);
    });
    await applyCandidate('h3');
    await check('H3 green: answers_by_version splits by questionVersion and sums to answers, with every other key unchanged', async () => {
      const rows = await adminRows(seeded.admin);
      const row = rows.find(r => r.question_id === QID);
      assert.deepEqual(Object.keys(row).sort(), ['answers', 'answers_by_version', 'attempts', 'last_at', 'question_id', 'subject', 'users', 'users_wrong', 'wrong']);
      assert.deepEqual(row.answers, { 1: 2, 2: 1, 3: 1 });
      assert.deepEqual(row.answers_by_version, { 'q1-aaaa0001': { 1: 1, 2: 1 }, 'q1-bbbb0002': { 1: 1 }, unknown: { 3: 1 } });
      assert.equal(row.attempts, 4); assert.equal(row.wrong, 2); assert.equal(row.users, 2);
      for (const r of rows) assert.equal(sum(r.answers), Object.values(r.answers_by_version).reduce((s, d) => s + sum(d), 0), `sums agree for ${r.question_id}`);
      const detail = await adminDetail(seeded.admin);
      assert.deepEqual(Object.keys(detail).sort(), ['answers', 'answers_by_version', 'attempts', 'question_id', 'recent', 'users', 'wrong']);
      assert.deepEqual(detail.answers, row.answers);
      assert.deepEqual(detail.answers_by_version, row.answers_by_version);
      assert.equal(detail.attempts, 4); assert.equal(detail.users.length, 2); assert.equal(detail.recent.length, 4);
    });
    await check('H3 green: a signed-in non-admin and anon are still refused; definer facts match live', async () => {
      await rejects(`select public.admin_questions(0, 1, 80);`, seeded.a, /forbidden/);
      await rejects(`select public.admin_question_detail(${QID});`, seeded.b, /forbidden/);
      await rejects(`select public.admin_questions(0, 1, 80);`, null, /permission denied/);
      const facts = [await functionFacts('public.admin_questions(int, int, int)'), await functionFacts('public.admin_question_detail(bigint)')];
      for (const f of facts) assert.deepEqual(f, { definer: true, config: ['search_path=public'], anon: false, authenticated: true });
      return { facts };
    });
  }

  // ── H4: q_comments admin delete ─────────────────────────────────────────
  const comment = async (author, body) => { const id = crypto.randomUUID(); await execute(`insert into public.q_comments(id, q_subject, q_id, user_id, body) values (${q(id)}, 'com5', 42, ${q(author.id)}, ${q(body)});`, author); return id; };
  const commentExists = id => read(`select to_jsonb(exists(select 1 from public.q_comments where id = ${q(id)}))::text as value;`);
  if (only.has('h4')) {
    let people;
    await check('H4 red: the admin account deletes 0 rows of someone else\'s comment and gets no error', async () => {
      const admin = await student('admin'), bee = await student('bee'), other = await student('other');
      await execute(`insert into public.admin_users(user_id) values (${q(admin.id)});`);
      people = { admin, bee, other };
      const id = await comment(bee, 'wrong key, see slide 12');
      await execute(`delete from public.q_comments where id = ${q(id)};`, admin);
      assert.equal(await commentExists(id), true, 'RLS deleted nothing and reported nothing');
      await execute(`delete from public.q_comments where id = ${q(id)};`, other);
      assert.equal(await commentExists(id), true);
      await execute(`delete from public.q_comments where id = ${q(id)};`, bee);
      assert.equal(await commentExists(id), false, 'the author could always delete their own');
      const before = await read(POLICY_DIGEST("tablename = 'q_comments'"));
      assert.deepEqual(before, { digest: LIVE.qCommentsPolicyDigestBefore, n: LIVE.qCommentsPolicyRows }, 'the fixture is the live policy set');
    });
    await applyCandidate('h4');
    await check('H4 green: the admin deletes any comment; a non-admin still deletes only their own; anon cannot delete at all', async () => {
      const { admin, bee, other } = people;
      const byBee = await comment(bee, 'to be moderated');
      await execute(`delete from public.q_comments where id = ${q(byBee)};`, other);
      assert.equal(await commentExists(byBee), true, 'a non-admin still cannot delete a classmate\'s comment');
      await rejects(`delete from public.q_comments where id = ${q(byBee)};`, null, /permission denied/);
      await execute(`delete from public.q_comments where id = ${q(byBee)};`, admin);
      assert.equal(await commentExists(byBee), false, 'the admin removed it');
      const own = await comment(other, 'mine');
      await execute(`delete from public.q_comments where id = ${q(own)};`, other);
      assert.equal(await commentExists(own), false, 'own delete keeps working');
      const policies = await read(`select jsonb_agg(jsonb_build_object('name', policyname, 'cmd', cmd, 'roles', roles::text) order by policyname)::text as value from pg_policies where tablename = 'q_comments';`);
      assert.equal(policies.filter(p => p.cmd === 'DELETE').length, 1, 'one permissive DELETE policy per role, as production keeps it');
      assert.deepEqual(policies.find(p => p.cmd === 'DELETE'), { name: 'qc_delete_own_or_admin', cmd: 'DELETE', roles: '{authenticated}' });
      const after = await read(POLICY_DIGEST("tablename = 'q_comments'"));
      return { qCommentsPolicyDigestAfter: after.digest, n: after.n, policies };
    });
  }

  // ── H5: realtime.messages policies for the private buddies channel ──────
  const presenceRead = (actor, topic) => read(`set local realtime.topic = ${q(topic)}; select jsonb_agg(extension order by extension)::text as value from realtime.messages;`, actor);
  const presenceWrite = (actor, topic, extension) => execute(`set local realtime.topic = ${q(topic)}; insert into realtime.messages(topic, extension, payload, event, private) values (${q(topic)}, ${q(extension)}, '{}', 'track', true);`, actor);
  if (only.has('h5')) {
    await check('H5 red: with RLS on and no policy, a signed-in student can neither read nor publish buddies presence', async () => {
      await execute(`insert into realtime.messages(topic, extension, payload, event, private) values
        ('vet-mock-buddies', 'presence', '{}', 'track', true), ('vet-mock-buddies', 'broadcast', '{}', 'msg', true), ('other-room', 'presence', '{}', 'track', true);`);
      const palm = await student('buddy');
      assert.equal(await presenceRead(palm, 'vet-mock-buddies'), null, 'nothing is readable');
      await rejects(`set local realtime.topic = 'vet-mock-buddies'; insert into realtime.messages(topic, extension, payload, event, private) values ('vet-mock-buddies', 'presence', '{}', 'track', true);`, palm, /row-level security/i);
    });
    await applyCandidate('h5');
    await check('H5 green: authenticated reads and writes presence on vet-mock-buddies only; anon and other topics or extensions are refused', async () => {
      const palm = await student('buddy');
      // The policy keys on the channel topic the server sets (realtime.topic())
      // and on the extension, Supabase's documented form: with the buddies
      // topic set, presence rows are readable and broadcast rows are not.
      assert.deepEqual(await presenceRead(palm, 'vet-mock-buddies'), ['presence', 'presence'], 'presence rows only, never the broadcast row');
      assert.equal(await presenceRead(palm, 'other-room'), null, 'another channel topic reads nothing');
      assert.equal(await presenceRead(null, 'vet-mock-buddies'), null, 'anon reads nothing');
      await presenceWrite(palm, 'vet-mock-buddies', 'presence');
      await rejects(`set local realtime.topic = 'vet-mock-buddies'; insert into realtime.messages(topic, extension, payload, event, private) values ('vet-mock-buddies', 'broadcast', '{}', 'msg', true);`, palm, /row-level security/i);
      await rejects(`set local realtime.topic = 'other-room'; insert into realtime.messages(topic, extension, payload, event, private) values ('other-room', 'presence', '{}', 'track', true);`, palm, /row-level security/i);
      await rejects(`set local realtime.topic = 'vet-mock-buddies'; insert into realtime.messages(topic, extension, payload, event, private) values ('vet-mock-buddies', 'presence', '{}', 'track', true);`, null, /row-level security/i);
      const policies = await read(`select jsonb_agg(jsonb_build_object('name', policyname, 'cmd', cmd, 'roles', roles::text, 'qual', qual, 'check', with_check) order by policyname)::text as value from pg_policies where schemaname = 'realtime';`);
      assert.equal(policies.length, 2);
      assert.ok(policies.every(p => p.roles === '{authenticated}'), 'nothing for anon');
      return { policies };
    });
  }

  // ── H6: race join rate limit ────────────────────────────────────────────
  const enter = (actor, code) => read(`select coalesce(public.enter_race(${code === null ? 'null' : q(code)})::text, 'null') as value;`, actor);
  const wrongCodes = n => Array.from({ length: n }, (_, i) => (0x100000 + i * 7919).toString(16).toUpperCase().slice(0, 6).padStart(6, 'F'));
  if (only.has('h6')) {
    let room, host;
    await check('H6 red: 21 missed codes each raise, and the correct code is still accepted afterwards', async () => {
      host = await student('host'); const guesser = await student('guesser');
      room = await enter(host, null);
      assert.match(room.code, /^[0-9A-F]{6}$/);
      for (const code of wrongCodes(21)) await rejects(`select public.enter_race(${q(code)});`, guesser, /Room unavailable/);
      const joined = await enter(guesser, room.code);
      assert.equal(joined.code, room.code, 'no counter: the correct code goes through after 21 misses');
      assert.equal(await read(`select to_jsonb(exists(select 1 from pg_tables where schemaname = 'private' and tablename = 'race_join_rate_limits'))::text as value;`), false);
    });
    await applyCandidate('h6');
    await check('H6 green: misses return null and commit the counter; the correct code is refused inside the window and accepted after it', async () => {
      const guesser = await student('guesser');
      for (const code of wrongCodes(21)) assert.equal(await enter(guesser, code), null, 'a miss is a null, not a raise');
      assert.equal(await read(`select to_jsonb(attempts)::text as value from private.race_join_rate_limits where user_id = ${q(guesser.id)};`), 21, 'every miss committed');
      assert.equal(await enter(guesser, room.code), null, 'the correct code is refused past 20 attempts in the window');
      assert.equal(await read(`select to_jsonb(exists(select 1 from private.race_members where user_id = ${q(guesser.id)}))::text as value;`), false);
      await execute(`update private.race_join_rate_limits set window_started_at = now() - interval '11 minutes' where user_id = ${q(guesser.id)};`);
      const joined = await enter(guesser, room.code);
      assert.equal(joined.code, room.code, 'accepted once the window has passed');
      assert.equal(await read(`select to_jsonb(attempts)::text as value from private.race_join_rate_limits where user_id = ${q(guesser.id)};`), 1, 'the window reset');
      // The red check's guesser joined this room before the migration, so the
      // room holds three members; the snapshot lists this one and the host.
      assert.ok(host.id in joined.participants && guesser.id in joined.participants, 'the snapshot lists the host and the new member');
    });
    await check('H6 green: a lower-case or padded correct code joins, the started and full refusals still raise, room creation is unchanged', async () => {
      const late = await student('late');
      assert.equal((await enter(late, ` ${room.code.toLowerCase()} `)).code, room.code);
      await execute(`update private.race_rooms set started_at = now() where code = ${q(room.code)};`);
      const after = await student('after-start');
      await rejects(`select public.enter_race(${q(room.code)});`, after, /Race already started/);
      const second = await enter(host, null);
      assert.notEqual(second.code, room.code);
      const fillers = [];
      for (let i = 0; i < 9; i++) { const s = await student(`filler${i}`); fillers.push(s); await execute(`insert into private.race_members(room_id, user_id) select id, ${q(s.id)} from private.race_rooms where code = ${q(second.code)};`); }
      const eleventh = await student('eleventh');
      await rejects(`select public.enter_race(${q(second.code)});`, eleventh, /Room full/);
      await rejects(`select * from private.race_join_rate_limits;`, late, /permission denied/);
      await rejects(`select * from private.race_join_rate_limits;`, null, /permission denied/);
      const facts = await functionFacts('public.enter_race(text)');
      assert.deepEqual(facts, { definer: true, config: ['search_path=""'], anon: false, authenticated: true });
      return { facts };
    });
  }
} catch (error) { report.fatal = String(error.stack || error.message).slice(0, 2400); console.error(report.fatal); }
finally {
  try {
    if (pglite) { await pglite.close(); report.disposableDatabaseClosed = true; }
    if (nativeCreated) { await nativeExec(`drop database ${nativeDatabase} with (force);`, 'postgres'); for (const role of createdRoles) await nativeExec(`drop role ${role};`, 'postgres'); report.disposableDatabaseDropped = true; }
  } catch (error) { report.cleanupError = String(error.message).slice(0, 1400); }
  report.finishedAt = new Date().toISOString(); report.passed = report.checks.filter(item => item.ok).length; report.failed = report.checks.filter(item => !item.ok).length;
  report.checkSourceUnchanged = report.checkSha256 === hash(fs.readFileSync(fileURLToPath(import.meta.url), 'utf8'));
  report.candidateSourceUnchanged = Object.entries(report.candidates).every(([, c]) => c.sha256 === hash(fs.readFileSync(path.join(ROOT, c.file), 'utf8')));
  report.ok = !report.fatal && !report.cleanupError && report.failed === 0 && report.checks.length >= 2 && report.checkSourceUnchanged && report.candidateSourceUnchanged;
  fs.mkdirSync(path.dirname(receiptPath), { recursive: true }); fs.writeFileSync(receiptPath, JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify({ backend, passed: report.passed, failed: report.failed, fatal: report.fatal ? report.fatal.split('\n')[0] : null, receiptPath, ok: report.ok }));
  process.exitCode = report.ok ? 0 : 1;
}
