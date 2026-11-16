// Profile pictures (supabase/migrations/20261116120000_profile_pictures.sql) in a
// disposable database only.
// Local: PGLITE_MODULE=/path/to/@electric-sql/pglite/dist/index.js node scripts/test-profile-pictures-db.mjs
// CI:    PG_CONTAINER=<postgres:17.6 service ID> node scripts/test-profile-pictures-db.mjs --backend=postgres
// Never accepts a database URL: the native adapter only talks to the dedicated CI container.
//
// What it holds: a client's own token never writes the picture columns; only a
// signed server request sets a picture; a member sees a shown picture, the owner
// also a hidden one, a guest or an outside account nothing; three distinct
// reporters hide a picture and a new picture starts clean; reporters read only
// their own reports and write none directly; only the admin lists, hides and
// restores; deleting an account takes its reports, made and received; the undo
// at the top of the file takes everything back out.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = fileURLToPath(new URL('../', import.meta.url));
const MIGRATION = fs.readFileSync(path.join(ROOT, 'supabase/migrations/20261116120000_profile_pictures.sql'), 'utf8').replace(/\r\n/g, '\n');
const backend = process.argv.find((a) => a.startsWith('--backend='))?.slice(10) || 'pglite';
assert(['pglite', 'postgres'].includes(backend));
const q = (v) => (v === null || v === undefined ? 'null' : `'${String(v).replaceAll("'", "''")}'`);
const uid = () => crypto.randomUUID();
const key = () => `profile-pictures/${crypto.randomUUID()}.webp`;

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
  const database = `vmx_profile_pictures_${crypto.randomBytes(8).toString('hex')}`;
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

// One statement as a role, answered 'ok <rows>' or '<sqlstate> <message>'.
const as = (role, sub, statement) => run(`begin; set local role ${role};
  set local "request.jwt.claim.sub" = ${q(sub || '')};
  select test.try(${q(statement)}); commit;`);
// One query's first value, as a role.
const read = (role, sub, query) => run(`begin; set local role ${role};
  set local "request.jwt.claim.sub" = ${q(sub || '')};
  ${query}; commit;`);
const comments = MIGRATION.split('\n').filter((l) => l.startsWith('--')).map((l) => l.replace(/^--\s?/, '')).join('\n');
const between = (start, end) => {
  const at = comments.indexOf(start);
  assert(at >= 0, `"${start}" not found in the migration's comments`);
  return comments.slice(at, comments.indexOf(end, at) + end.length);
};

const checks = [];
async function check(name, fn) {
  try { await fn(); checks.push({ name, ok: true }); } catch (error) { checks.push({ name, ok: false, error: String(error.message).slice(0, 900) }); }
}

const ADMIN = uid(), OWNER = uid(), R1 = uid(), R2 = uid(), R3 = uid(), OUTSIDER = uid();
// A request as api/_lib/app-backend.js signs it; the signature comes from the database's own hmac.
const setPicture = async (user, pictureKey, { purpose = 'profile-picture', signature } = {}) => {
  const payload = JSON.stringify({ purpose, issuedAt: Math.floor(Date.now() / 1000), data: { user_id: user, key: pictureKey } });
  const sig = signature || await run(`select encode(extensions.hmac(${q(payload)}, 'k', 'sha256'), 'hex');`);
  return run(`begin; set local role authenticated; set local "request.jwt.claim.sub" = ${q(user)};
    select public.set_profile_picture(${q(payload)}, ${q(sig)})::text; commit;`);
};
const report = (reporter, owner) => read('authenticated', reporter, `select public.report_profile_picture(${q(owner)})::text`);
const stateOf = (user) => run(`select picture_state from public.profiles where id = ${q(user)};`);
const visibleTo = (viewer, users) => read('authenticated', viewer,
  `select coalesce(string_agg(user_id::text || ':' || picture_state, ',' order by user_id), '') from public.profile_pictures_for(array[${users.map((u) => `${q(u)}::uuid`).join(',')}])`);

try {
  for (const role of ['anon', 'authenticated']) {
    await run(`do $$ begin if not exists (select 1 from pg_roles where rolname = ${q(role)}) then create role ${role} nologin; end if; end $$;`);
  }
  await run(`do $$ begin if not exists (select 1 from pg_roles where rolname = 'service_role') then create role service_role nologin bypassrls; end if; end $$;`);
  await run(`
    create schema auth;
    create table auth.users (id uuid primary key, email text);
    create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
    grant usage on schema auth to anon, authenticated, service_role;
    grant execute on function auth.uid() to anon, authenticated, service_role;
    create schema private;
    revoke all on schema private from public;
    create table private.application_signing_keys (name text primary key, secret text not null);
    insert into private.application_signing_keys values ('app-rpc', 'k');
    create schema extensions;
    create table public.profiles (id uuid primary key references auth.users(id) on delete cascade, username text not null, avatar_emoji text);
    alter table public.profiles enable row level security;
    grant select, insert, update on public.profiles to authenticated;
    grant select on public.profiles to anon;
    create policy profiles_read on public.profiles for select to anon, authenticated using (true);
    create policy profiles_insert_own on public.profiles for insert to authenticated with check (id = auth.uid());
    create policy profiles_update_own on public.profiles for update to authenticated using (id = auth.uid()) with check (id = auth.uid());
    create table public.admin_users (user_id uuid primary key);
    create table public.members (user_id uuid primary key);
    create function public.is_admin() returns boolean language sql stable security definer set search_path = '' as
      $$ select exists (select 1 from public.admin_users where user_id = auth.uid()) $$;
    create function public.chula_allowed(p uuid) returns boolean language sql stable security definer set search_path = '' as
      $$ select p is not null and (exists (select 1 from public.members m where m.user_id = p) or exists (select 1 from public.admin_users a where a.user_id = p)) $$;
    create function public.chula_access() returns boolean language sql stable security definer set search_path = '' as
      $$ select public.chula_allowed(auth.uid()) $$;
    grant execute on function public.is_admin() to authenticated;
    grant execute on function public.chula_allowed(uuid) to anon, authenticated;
    grant execute on function public.chula_access() to anon, authenticated;
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
  try {
    await run('create extension if not exists pgcrypto schema extensions;');
  } catch {
    await run(`create function extensions.hmac(data text, key text, alg text) returns bytea language sql immutable as
      $$ select decode(md5(key || data) || md5(data || key), 'hex') $$;`);
  }
  const people = [ADMIN, OWNER, R1, R2, R3, OUTSIDER];
  await run(`insert into auth.users (id) values ${people.map((p) => `(${q(p)})`).join(',')};
    insert into public.profiles (id, username, avatar_emoji) values ${people.map((p, i) => `(${q(p)}, 'name_${i}', '🐾')`).join(',')};
    insert into public.admin_users values (${q(ADMIN)});
    insert into public.members values ${[OWNER, R1, R2, R3].map((p) => `(${q(p)})`).join(',')};`);

  await run(MIGRATION);

  await check('the count queries in the header run', async () => {
    for (const start of ['select count(*) as pictures_shown', 'select count(*) as pictures_hidden', 'select count(*) as picture_reports']) {
      assert.equal(await run(between(start, ';')), '0');
    }
  });

  await check("a student's own token never writes the picture columns, and still changes their name", async () => {
    assert.match(await as('authenticated', OWNER, `update public.profiles set picture_key = '${key()}', picture_state = 'shown' where id = '${OWNER}'`), /^42501 /);
    assert.match(await as('authenticated', OWNER, `update public.profiles set picture_state = 'shown' where id = '${OWNER}'`), /^42501 /);
    assert.equal(await as('authenticated', OWNER, `update public.profiles set username = 'renamed' where id = '${OWNER}'`), 'ok 1');
    const fresh = uid();
    await run(`insert into auth.users (id) values (${q(fresh)});`);
    assert.match(await as('authenticated', fresh, `insert into public.profiles (id, username, picture_key, picture_state) values ('${fresh}', 'n', '${key()}', 'shown')`), /^42501 /);
    assert.equal(await as('authenticated', fresh, `insert into public.profiles (id, username) values ('${fresh}', 'n2')`), 'ok 1');
  });

  await check('only a signed server request sets a picture, and the key must be one the server makes', async () => {
    await assert.rejects(setPicture(OWNER, key(), { signature: '0'.repeat(64) }), /invalid picture request/);
    await assert.rejects(setPicture(OWNER, key(), { purpose: 'client-diagnostic' }), /invalid picture request/);
    await assert.rejects(setPicture(OWNER, 'profile-pictures/../library/deck.pdf'), /profiles_picture_key_shape/);
    assert.match(await setPicture(OWNER, key()), /"ok": ?true/);
    assert.equal(await stateOf(OWNER), 'shown');
  });

  await check('a member sees a shown picture; a guest or an outside account sees nothing', async () => {
    assert.equal(await visibleTo(R1, [OWNER]), `${OWNER}:shown`);
    assert.match(await as('anon', null, `select * from public.profile_pictures_for(array['${OWNER}'::uuid])`), /^42501 /);
    assert.match(await as('authenticated', OUTSIDER, `select * from public.profile_pictures_for(array['${OWNER}'::uuid])`), /^42501 /);
    const many = Array.from({ length: 61 }, () => `'${uid()}'::uuid`).join(',');
    assert.match(await as('authenticated', R1, `select * from public.profile_pictures_for(array[${many}])`), /^22023 /);
  });

  await check('three distinct reporters hide a picture; a repeat or a self report does not count', async () => {
    assert.match(await report(R1, OWNER), /"hidden": ?false/);
    assert.match(await report(R1, OWNER), /"hidden": ?false/);
    assert.match(await as('authenticated', OWNER, `select public.report_profile_picture('${OWNER}')`), /^22023 /);
    assert.match(await as('authenticated', OUTSIDER, `select public.report_profile_picture('${OWNER}')`), /^42501 /);
    assert.match(await report(R2, OWNER), /"hidden": ?false/);
    assert.equal(await stateOf(OWNER), 'shown');
    assert.match(await report(R3, OWNER), /"hidden": ?true/);
    assert.equal(await stateOf(OWNER), 'hidden_reports');
  });

  await check('a hidden picture reaches its owner and the admin, nobody else', async () => {
    assert.equal(await visibleTo(R1, [OWNER]), '');
    assert.equal(await visibleTo(OWNER, [OWNER]), `${OWNER}:hidden_reports`);
    assert.equal(await visibleTo(ADMIN, [OWNER]), `${OWNER}:hidden_reports`);
  });

  await check('reporters read only their own reports and write none directly', async () => {
    assert.equal(await read('authenticated', R1, 'select count(*)::text from public.profile_picture_reports'), '1');
    assert.equal(await read('authenticated', OWNER, 'select count(*)::text from public.profile_picture_reports'), '0');
    assert.match(await as('authenticated', R1, `insert into public.profile_picture_reports (owner_id, picture_key, reporter_id) values ('${OWNER}', '${key()}', '${R1}')`), /^42501 /);
    assert.match(await as('authenticated', R1, 'delete from public.profile_picture_reports'), /^42501 /);
    assert.match(await as('anon', null, 'select count(*) from public.profile_picture_reports'), /^42501 /);
  });

  await check('a new picture starts clean: reports of the old one do not count', async () => {
    assert.match(await setPicture(OWNER, key()), /"previous_key"/);
    assert.equal(await stateOf(OWNER), 'shown');
    assert.match(await report(R1, OWNER), /"hidden": ?false/);
    assert.equal(await stateOf(OWNER), 'shown');
  });

  await check('only the admin lists, hides and restores; a picture the admin hid is not replaced', async () => {
    assert.match(await as('authenticated', R1, 'select public.admin_profile_pictures()'), /^42501 /);
    assert.match(await as('authenticated', R1, `select public.admin_set_profile_picture('${OWNER}', 'hidden_admin')`), /^42501 /);
    const listed = JSON.parse(await read('authenticated', ADMIN, 'select public.admin_profile_pictures()::text'));
    assert.equal(listed.length, 1);
    assert.equal(listed[0].reports, 1);
    assert.match(await read('authenticated', ADMIN, `select public.admin_set_profile_picture('${OWNER}', 'hidden_admin')::text`), /"ok": ?true/);
    assert.equal(await stateOf(OWNER), 'hidden_admin');
    assert.match(await setPicture(OWNER, key()), /"refused"/);
    assert.match(await read('authenticated', ADMIN, `select public.admin_set_profile_picture('${OWNER}', 'shown')::text`), /"ok": ?true/);
    assert.equal(await stateOf(OWNER), 'shown');
    assert.equal(await run(`select count(*)::text from public.profile_picture_reports where owner_id = ${q(OWNER)};`), '3', 'the restored picture\'s report is cleared; the three of the earlier picture stay');
    assert.equal(await visibleTo(R2, [OWNER]), `${OWNER}:shown`);
  });

  await check('clearing a picture goes back to none', async () => {
    assert.match(await setPicture(R2, key()), /"ok": ?true/);
    assert.match(await setPicture(R2, null), /"previous_key": ?"profile-pictures/);
    assert.equal(await stateOf(R2), 'none');
  });

  await check('deleting an account takes its reports, made and received', async () => {
    await report(R3, OWNER);
    await run(`delete from auth.users where id = ${q(R1)};`);
    assert.equal(await run(`select count(*)::text from public.profile_picture_reports where reporter_id = ${q(R1)};`), '0');
    await run(`delete from auth.users where id = ${q(OWNER)};`);
    assert.equal(await run(`select count(*)::text from public.profile_picture_reports;`), '0');
  });

  await check('no grant reaches anon', async () => {
    for (const fn of ['public.profile_pictures_for(uuid[])', 'public.set_profile_picture(text,text)', 'public.report_profile_picture(uuid)', 'public.admin_profile_pictures()', 'public.admin_set_profile_picture(uuid,text)']) {
      assert.equal(await run(`select has_function_privilege('anon', '${fn}', 'execute')::text;`), 'false', fn);
    }
    assert.equal(await run(`select has_function_privilege('authenticated', 'private.guard_profile_picture()', 'execute')::text;`), 'false');
    assert.equal(await run(`select has_table_privilege('authenticated', 'public.profile_picture_reports', 'insert')::text;`), 'false');
  });

  await check('the undo at the top of the file takes everything out, and the file applies again', async () => {
    await run(between('begin;', 'commit;'));
    assert.equal(await run(`select count(*)::text from information_schema.columns where table_name = 'profiles' and column_name like 'picture%';`), '0');
    assert.equal(await run(`select (to_regclass('public.profile_picture_reports') is null)::text;`), 'true');
    assert.equal(await run(`select count(*)::text from pg_proc where proname like '%profile_picture%';`), '0');
    await run(MIGRATION);
    assert.equal(await run(`select count(*)::text from information_schema.columns where table_name = 'profiles' and column_name like 'picture%';`), '3');
  });
} catch (error) {
  checks.push({ name: 'setup', ok: false, error: String(error.message).slice(0, 1500) });
} finally {
  try { await cleanup(); } catch (error) { checks.push({ name: 'cleanup', ok: false, error: String(error.message).slice(0, 600) }); }
}

const failed = checks.filter((c) => !c.ok);
for (const c of checks) console.log(`${c.ok ? 'ok  ' : 'FAIL'} ${c.name}${c.ok ? '' : `\n     ${c.error}`}`);
console.log(JSON.stringify({ backend, passed: checks.length - failed.length, failed: failed.length }));
process.exitCode = failed.length || checks.length < 13 ? 1 : 0;
