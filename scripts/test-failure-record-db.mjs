// The failure record (supabase/migrations/20261115230000_failure_record.sql) in a
// disposable database only.
// Local: PGLITE_MODULE=/path/to/@electric-sql/pglite/dist/index.js node scripts/test-failure-record-db.mjs
// CI:    PG_CONTAINER=<postgres:17.6 service ID> node scripts/test-failure-record-db.mjs --backend=postgres
// Never accepts a database URL: the native adapter only talks to the dedicated CI container.
//
// What it holds: a sign-up whose profile insert fails still creates the account and is
// counted (no id, no name); a browser report keeps its scrubbed message; old rows survive
// the key change; only the admin reads admin_failures; the header's count queries run.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = fileURLToPath(new URL('../', import.meta.url));
const file = (name) => fs.readFileSync(path.join(ROOT, 'supabase/migrations', name), 'utf8').replace(/\r\n/g, '\n');
const BASE = file('20260907061044_private_error_counts.sql');
const RECORD = file('20261115230000_failure_record.sql');
const backend = process.argv.find((a) => a.startsWith('--backend='))?.slice(10) || 'pglite';
assert(['pglite', 'postgres'].includes(backend));
const q = (v) => (v === null || v === undefined ? 'null' : `'${String(v).replaceAll("'", "''")}'`);
const uid = () => crypto.randomUUID();

let run, cleanup = async () => {};
if (backend === 'pglite') {
  const modulePath = process.env.PGLITE_MODULE;
  assert(modulePath, 'Set PGLITE_MODULE to @electric-sql/pglite/dist/index.js');
  const { PGlite } = await import(pathToFileURL(path.resolve(modulePath)).href);
  const pg = new PGlite();
  await pg.waitReady;
  run = async (sql) => {
    try {
      const results = await pg.exec(sql);
      const last = [...results].reverse().find((r) => r.fields?.length);
      return last?.rows?.[0] ? String(Object.values(last.rows[0])[0] ?? '') : null;
    } catch (error) {
      await pg.exec('rollback;').catch(() => {});
      throw error;
    }
  };
  cleanup = () => pg.close();
} else {
  assert.equal(process.env.GITHUB_ACTIONS, 'true', 'Native mode requires the dedicated GitHub Actions test service');
  const container = process.env.PG_CONTAINER;
  assert(/^[a-f0-9]{64}$/.test(container || ''), 'Missing dedicated CI container ID');
  const env = Object.fromEntries(Object.entries(process.env).filter(([k]) => !k.startsWith('PG') && k !== 'DATABASE_URL'));
  const image = spawnSync('docker', ['inspect', '--format', '{{.Config.Image}}', container], { env, encoding: 'utf8' });
  assert.equal(image.stdout.trim(), 'postgres:17.6', 'Use the dedicated exact-version CI test service');
  const database = `vmx_failure_record_${crypto.randomBytes(8).toString('hex')}`;
  const psql = (sql, db) => {
    const r = spawnSync('docker', ['exec', '-i', container, 'psql', '-X', '-qAt', '-v', 'ON_ERROR_STOP=1', '-U', 'postgres', '-d', db],
      { env, input: sql, encoding: 'utf8', maxBuffer: 16 << 20 });
    if (r.status !== 0) throw new Error(r.stderr.slice(-1500));
    return r.stdout.trim().split('\n').filter(Boolean).at(-1) ?? null;
  };
  psql(`create database ${database};`, 'postgres');
  run = async (sql) => psql(sql, database);
  cleanup = async () => {
    psql(`drop database ${database} with (force);`, 'postgres');
    for (const role of ['anon', 'authenticated', 'service_role']) {
      try { psql(`drop owned by ${role}; drop role ${role};`, 'postgres'); } catch { /* shared with another database */ }
    }
  };
}

const as = (role, sub, statement) => run(`begin; set local role ${role};
  set local "request.jwt.claim.sub" = ${q(sub || '')};
  select test.try(${q(statement)}); commit;`);
const commentSql = (start) => {
  const comments = RECORD.split('\n').filter((l) => l.startsWith('--')).map((l) => l.replace(/^--\s?/, '')).join('\n');
  const at = comments.indexOf(start);
  assert(at >= 0, `count query starting "${start}" not found in the migration's comments`);
  return comments.slice(at, comments.indexOf(';', at));
};

const checks = [];
async function check(name, fn) {
  try { await fn(); checks.push({ name, ok: true }); } catch (error) { checks.push({ name, ok: false, error: String(error.message).slice(0, 900) }); }
}

const ADMIN = uid(), MEMBER = uid(), BROKEN = uid(), FINE = uid();
// A signed report as api/_lib/app-backend.js builds it; the signature is made by the
// database's own hmac so the stub below and real pgcrypto both agree.
const report = async (data) => {
  const payload = JSON.stringify({ purpose: 'client-diagnostic', issuedAt: Math.floor(Date.now() / 1000), data });
  const signature = await run(`select encode(extensions.hmac(${q(payload)}, 'k', 'sha256'), 'hex');`);
  return run(`select public.record_client_diagnostic(${q(payload)}, ${q(signature)})::text;`);
};

try {
  for (const role of ['anon', 'authenticated']) {
    await run(`do $$ begin if not exists (select 1 from pg_roles where rolname = ${q(role)}) then create role ${role} nologin; end if; end $$;`);
  }
  await run(`do $$ begin if not exists (select 1 from pg_roles where rolname = 'service_role') then create role service_role nologin bypassrls; end if; end $$;`);
  await run(`
    create schema auth;
    create table auth.users (id uuid primary key, email text, raw_user_meta_data jsonb not null default '{}'::jsonb);
    create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
    grant usage on schema auth to anon, authenticated, service_role;
    grant execute on function auth.uid() to anon, authenticated, service_role;
    create schema private;
    revoke all on schema private from public;
    create table private.application_signing_keys (name text primary key, secret text not null);
    insert into private.application_signing_keys values ('app-rpc', 'k');
    create schema extensions;
    create table public.profiles (id uuid primary key references auth.users(id) on delete cascade, username text unique not null);
    alter table public.profiles add constraint profiles_username_length_check check (char_length(username) between 2 and 30);
    create table public.user_data (user_id uuid primary key);
    create table public.admin_users (user_id uuid primary key);
    create function public.is_admin() returns boolean language sql stable security definer set search_path = '' as
      $$ select exists (select 1 from public.admin_users where user_id = auth.uid()) $$;
    grant execute on function public.is_admin() to authenticated;
    create schema test;
    create function test.try(statement text) returns text language plpgsql as $$
    declare n bigint;
    begin
      execute statement;
      get diagnostics n = row_count;
      return 'ok ' || n;
    exception when others then
      return sqlstate || ' ' || sqlerrm;
    end $$;
    grant usage on schema test to anon, authenticated;
    grant execute on function test.try(text) to anon, authenticated;
  `);
  // pgcrypto where the server has it (CI's postgres:17.6); a stand-in hmac otherwise.
  try {
    await run('create extension if not exists pgcrypto schema extensions;');
  } catch {
    await run(`create function extensions.hmac(data text, key text, alg text) returns bytea language sql immutable as
      $$ select decode(md5(key || data) || md5(data || key), 'hex') $$;`);
  }
  await run(BASE);
  // production's triggers on the tables they sit on
  await run(`
    create function public.handle_new_user() returns trigger language plpgsql as $$ begin return new; end $$;
    create function public.handle_new_user_data() returns trigger language plpgsql as $$ begin return new; end $$;
    create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();
    create trigger on_profile_created after insert on public.profiles for each row execute function public.handle_new_user_data();
  `);
  await report({ release: '5.238.0', view: 'home', kind: 'error', category: 'TypeError' });

  await check('the header count queries run before applying', async () => {
    assert.equal(await run(commentSql('select count(*) as error_rows')), '1');
  });

  await run(RECORD);
  await run(`insert into public.admin_users values (${q(ADMIN)});`);

  await check('old rows survive the key change, with an empty message', async () => {
    assert.equal(await run(commentSql('select count(*) as error_rows')), '1');
    assert.equal(await run(`select message from private.client_error_counts;`), '');
    assert.equal(await run(commentSql('select count(*) as setup_failure_rows')), '0');
  });

  await check('a report keeps its scrubbed message, and a repeat counts instead of adding a row', async () => {
    const data = { release: '5.239.0', view: 'notes', kind: 'save', category: 'QuotaExceededError', message: 'The quota has been exceeded.' };
    assert.match(await report(data), /"ok": ?true/);
    await report(data);
    assert.equal(await run(`select count::text from private.client_error_counts where kind = 'save';`), '2');
    assert.equal(await run(`select message from private.client_error_counts where kind = 'save';`), 'The quota has been exceeded.');
    await report({ ...data, message: 'x'.repeat(400) });
    assert.equal(await run(`select max(length(message))::text from private.client_error_counts;`), '160');
  });

  await check('a report with a wrong signature is refused', async () => {
    const payload = JSON.stringify({ purpose: 'client-diagnostic', issuedAt: Math.floor(Date.now() / 1000), data: {} });
    await assert.rejects(run(`select public.record_client_diagnostic(${q(payload)}, ${q('0'.repeat(64))});`), /Invalid report/);
  });

  await check('a sign-up whose profile fails still makes the account, and the failure is counted', async () => {
    // a one-letter name breaks the length check: the path production swallowed silently
    await run(`insert into auth.users (id, email, raw_user_meta_data) values (${q(BROKEN)}, 'a@example.invalid', '{"username":"x"}');`);
    assert.equal(await run(`select count(*)::text from auth.users where id = ${q(BROKEN)};`), '1');
    assert.equal(await run(`select count(*)::text from public.profiles where id = ${q(BROKEN)};`), '0');
    assert.equal(await run(`select step || ' ' || sqlstate || ' ' || count from private.account_setup_failures;`), 'handle_new_user 23514 1');
    const columns = await run(`select string_agg(column_name, ',' order by column_name) from information_schema.columns
      where table_schema = 'private' and table_name = 'account_setup_failures';`);
    assert.equal(columns, 'count,day,last_at,sqlstate,step', 'no account id, name or address is kept');
  });

  await check('an ordinary sign-up gets its profile and user_data row', async () => {
    await run(`insert into auth.users (id, email, raw_user_meta_data) values (${q(FINE)}, 'fine@example.invalid', '{"username":"Fine_Name"}');`);
    assert.equal(await run(`select username from public.profiles where id = ${q(FINE)};`), 'Fine_Name');
    assert.equal(await run(`select count(*)::text from public.user_data where user_id = ${q(FINE)};`), '1');
  });

  await check('only the admin reads admin_failures; members and visitors are refused', async () => {
    await run(`insert into auth.users (id, email) values (${q(ADMIN)}, 'admin@example.invalid'), (${q(MEMBER)}, 'member@example.invalid');`);
    assert.match(await as('authenticated', MEMBER, 'select public.admin_failures(24)'), /^42501 /);
    assert.match(await as('anon', null, 'select public.admin_failures(24)'), /^42501 /);
    const out = JSON.parse(await run(`begin; set local role authenticated; set local "request.jwt.claim.sub" = ${q(ADMIN)};
      select public.admin_failures(24)::text; commit;`));
    assert.equal(out.setup_failures.length, 1);
    assert.equal(out.without_profile, 1, 'the broken sign-up is the one without a profile');
    assert.ok(out.errors.some((e) => e.kind === 'save' && e.count === 2));
    assert.ok(out.errors.every((e) => !('user_id' in e)));
  });

  await check('no new grant reaches anon; private stays private', async () => {
    assert.equal(await run(`select has_function_privilege('anon', 'public.admin_failures(int)', 'execute')::text;`), 'false');
    assert.equal(await run(`select has_table_privilege('authenticated', 'private.account_setup_failures', 'select')::text;`), 'false');
    assert.equal(await run(`select has_function_privilege('authenticated', 'private.count_account_setup_failure(text,text)', 'execute')::text;`), 'false');
  });
} catch (error) {
  checks.push({ name: 'setup', ok: false, error: String(error.message).slice(0, 1500) });
} finally {
  try { await cleanup(); } catch (error) { checks.push({ name: 'cleanup', ok: false, error: String(error.message).slice(0, 600) }); }
}

const failed = checks.filter((c) => !c.ok);
for (const c of checks) console.log(`${c.ok ? 'ok  ' : 'FAIL'} ${c.name}${c.ok ? '' : `\n     ${c.error}`}`);
console.log(JSON.stringify({ backend, passed: checks.length - failed.length, failed: failed.length }));
process.exitCode = failed.length || checks.length < 8 ? 1 : 0;
