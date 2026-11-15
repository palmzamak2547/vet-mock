// The Chula sign-in wall migration in a disposable database only (docs/CHULA-SIGNIN.md).
// Local: PGLITE_MODULE=/path/to/@electric-sql/pglite/dist/index.js node scripts/test-chula-wall-db.mjs
// CI:    PG_CONTAINER=<postgres:17.6 service ID> node scripts/test-chula-wall-db.mjs --backend=postgres
// Never accepts a database URL: the native adapter only talks to the dedicated CI container.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = fileURLToPath(new URL('../', import.meta.url));
// Applied in order, as production has them. The last one adds the trial pass for the assistant
// (docs/CHULA-SIGNIN.md, "Trial links") and re-creates the pre-request with one more public call.
const MIGRATIONS = ['20261101170000_chula_wall.sql', '20261102190000_chula_hook_wording.sql', '20261115080000_ai_guest_pass.sql']
  .map((name) => path.join(ROOT, 'supabase/migrations', name));
const backend = process.argv.find((a) => a.startsWith('--backend='))?.slice(10) || 'pglite';
assert(['pglite', 'postgres'].includes(backend));

const q = (v) => `'${String(v).replaceAll("'", "''")}'`;
const uid = () => crypto.randomUUID();
const U = { member: uid(), staff: uid(), personal: uid(), gmail: uid(), unverified: uid(), pwChula: uid(), admin: uid(), sub: uid(), fresh: uid() };

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
      return last?.rows?.[0] ? String(Object.values(last.rows[0])[0]) : null;
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
  const database = `vmx_chula_lab_${crypto.randomBytes(8).toString('hex')}`;
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
    for (const role of ['anon', 'authenticated', 'service_role', 'authenticator', 'supabase_auth_admin']) {
      try { psql(`drop owned by ${role}; drop role ${role};`, 'postgres'); } catch { /* shared with another database */ }
    }
  };
}

// A request as PostgREST makes it: role, claims and path set for one transaction.
const as = (role, sub, sql, reqPath = '/notes') =>
  `begin; set local role ${role}; set local "request.jwt.claim.sub" = ${q(sub || '')}; set local "request.path" = ${q(reqPath)}; ${sql}; commit;`;
// Booleans are read through ::text: psql prints t/f where PGlite gives true/false.
const value = async (sql) => run(sql);
const rejects = async (sql, pattern) => {
  let error = null;
  try { await run(sql); } catch (e) { error = e; }
  assert(error, `expected an error matching ${pattern}`);
  assert.match(String(error.message), pattern);
};
const setWall = (on) => run(`update private.chula_wall set enforce = ${on ? 'true' : 'false'};`);

const checks = [];
async function check(name, fn) {
  try { await fn(); checks.push({ name, ok: true }); } catch (error) { checks.push({ name, ok: false, error: String(error.message).slice(0, 600) }); }
}

try {
  // A Supabase-shaped skeleton: the roles, auth.uid(), auth.users/identities, and one
  // table per schema the migration covers, each with an ordinary permissive policy.
  for (const role of ['anon', 'authenticated', 'authenticator', 'supabase_auth_admin']) {
    await run(`do $$ begin if not exists (select 1 from pg_roles where rolname = ${q(role)}) then create role ${role} nologin; end if; end $$;`);
  }
  await run(`do $$ begin if not exists (select 1 from pg_roles where rolname = 'service_role') then create role service_role nologin bypassrls; end if; end $$;`);
  await run(`
    create schema auth;
    create table auth.users (id uuid primary key, email text, raw_app_meta_data jsonb not null default '{}'::jsonb);
    create table auth.identities (id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id), provider text not null, identity_data jsonb not null);
    create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
    grant usage on schema auth to anon, authenticated, service_role;
    grant execute on function auth.uid() to anon, authenticated, service_role;
    create table public.admin_users (user_id uuid primary key);
    alter table public.admin_users enable row level security;
    create function public.is_admin() returns boolean language sql stable security definer set search_path = public
      as $$ select exists (select 1 from public.admin_users a where a.user_id = auth.uid()) $$;
    create table public.notes (id serial primary key, owner uuid not null, body text);
    alter table public.notes enable row level security;
    create policy notes_own on public.notes for all to authenticated using (owner = auth.uid()) with check (owner = auth.uid());
    create policy notes_public_read on public.notes for select to anon using (true);
    grant select, insert, update, delete on public.notes to anon, authenticated, service_role;
    grant usage, select on sequence public.notes_id_seq to anon, authenticated, service_role;
    create schema vca;
    create table vca.posts (id serial primary key, body text);
    alter table vca.posts enable row level security;
    create policy posts_read on vca.posts for select to anon, authenticated using (true);
    grant usage on schema vca to anon, authenticated;
    grant select on vca.posts to anon, authenticated;
    create schema storage;
    create table storage.objects (id serial primary key, bucket_id text);
    alter table storage.objects enable row level security;
    create policy objects_read on storage.objects for select to anon, authenticated using (true);
    grant usage on schema storage to anon, authenticated;
    grant select on storage.objects to anon, authenticated;
    create schema realtime;
    create table realtime.messages (id serial primary key, topic text);
    alter table realtime.messages enable row level security;
    create policy rt_read on realtime.messages for select to authenticated using (true);
    grant usage on schema realtime to authenticated;
    grant select on realtime.messages to authenticated;
  `);
  // The shape Supabase stores for a Google identity: the email, Google's verified
  // flag and its hosted-domain claim (every real student identity carries hd).
  const google = (email, verified = true, hd) => JSON.stringify({ email, email_verified: verified, ...(hd ? { custom_claims: { hd } } : {}) });
  const seed = [
    [U.member, '6631234531@student.chula.ac.th', 'google', google('6631234531@student.chula.ac.th', true, 'student.chula.ac.th')],
    [U.staff, 'somchai.j@chula.ac.th', 'google', google('Somchai.J@CHULA.AC.TH', true, 'chula.ac.th')],
    [U.personal, '6631234534@student.chula.ac.th', 'google', google('6631234534@student.chula.ac.th')],
    [U.gmail, 'someone@gmail.com', 'google', google('someone@gmail.com')],
    [U.unverified, '6631234532@student.chula.ac.th', 'google', google('6631234532@student.chula.ac.th', false, 'student.chula.ac.th')],
    [U.pwChula, '6631234533@student.chula.ac.th', 'email', '{"email":"6631234533@student.chula.ac.th","email_verified":false}'],
    [U.admin, 'owner@gmail.com', 'google', google('owner@gmail.com')],
    [U.sub, 'lecturer@vet.chula.ac.th', 'google', google('lecturer@vet.chula.ac.th')],
  ];
  for (const [id, email, provider, data] of seed) {
    await run(`insert into auth.users (id, email, raw_app_meta_data) values (${q(id)}, ${q(email)}, ${q(JSON.stringify({ provider }))});
      insert into auth.identities (user_id, provider, identity_data) values (${q(id)}, ${q(provider)}, ${q(data)}::jsonb);`);
  }
  await run(`insert into public.admin_users values (${q(U.admin)});
    insert into public.notes (owner, body) values (${q(U.member)}, 'member note'), (${q(U.gmail)}, 'gmail note');
    insert into vca.posts (body) values ('board'); insert into storage.objects (bucket_id) values ('b'); insert into realtime.messages (topic) values ('t');`);

  // The accounts above exist before the migration, as production's do (the two
  // email/password Chula accounts included); the migration is applied on top.
  for (const file of MIGRATIONS) await run(fs.readFileSync(file, 'utf8'));

  await check('the migration ships the wall off, and off changes nothing', async () => {
    assert.equal(await value(`select public.chula_wall_enforced()::text`), 'false');
    assert.equal(await value(as('anon', null, `select count(*) from public.notes`)), '2');
    assert.equal(await value(as('authenticated', U.gmail, `select count(*) from public.notes`)), '1');
    await run(as('authenticated', U.gmail, `select public.chula_pre_request()`));
    assert.equal(await value(`select public.hook_before_user_created('{"user":{"email":"x@gmail.com","app_metadata":{"provider":"email"}}}')::text`), '{}');
  });

  await check('wall off or on, nobody reserves a Chula address with a password or another provider', async () => {
    const hook = (email, provider) => value(`select public.hook_before_user_created(${q(JSON.stringify({ user: { email, app_metadata: { provider } } }))}::jsonb)::text`);
    for (const provider of ['email', 'discord', 'apple']) {
      const out = JSON.parse(await hook('squat@student.chula.ac.th', provider));
      assert.equal(out.error?.http_code, 403, provider);
      // A Chula address is told to use the Google button, never that it is not a Chula email.
      assert.match(out.error.message, /ปุ่ม Google/, provider);
      assert.doesNotMatch(out.error.message, /ไม่ใช่อีเมลจุฬา/, provider);
    }
    assert.equal(await hook('fresh@student.chula.ac.th', 'google'), '{}');
    await rejects(`insert into auth.users (id, email, raw_app_meta_data) values (gen_random_uuid(), 'squat2@student.chula.ac.th', '{"provider":"email"}')`, /chula_only/);
    await run(`insert into auth.users (id, email, raw_app_meta_data) values (gen_random_uuid(), 'ok-off@gmail.com', '{"provider":"email"}');`);
  });

  await check('an unverified OAuth identity never joins an existing account', async () => {
    const identity = (uid, provider, data) => `insert into auth.identities (user_id, provider, identity_data) values (${q(uid)}, ${q(provider)}, ${q(JSON.stringify(data))}::jsonb)`;
    await rejects(identity(U.member, 'discord', { email: '6631234531@student.chula.ac.th', email_verified: false }), /unverified_identity_link/);
    await rejects(identity(U.admin, 'discord', { email: 'owner@gmail.com' }), /unverified_identity_link/);
    await run(`${identity(U.gmail, 'discord', { email: 'someone@gmail.com', email_verified: true })};`);
    await run(`${identity(U.gmail, 'email', { email: 'someone@gmail.com', email_verified: false })};`);
    await run(`insert into auth.users (id, email, raw_app_meta_data) values (${q(U.fresh)}, 'fresh-discord@gmail.com', '{"provider":"discord"}');`);
    await run(`${identity(U.fresh, 'discord', { email: 'fresh-discord@gmail.com', email_verified: false })};`);
  });

  await check('the domain rule: exact Chula domains, nothing else', async () => {
    const cases = {
      '6631234531@student.chula.ac.th': true, 'A.B@Chula.ac.th': true, ' x@chula.ac.th ': true,
      'x@vet.chula.ac.th': false, 'x@chula.ac.th.evil.com': false, 'x@evilchula.ac.th': false, 'x@student.chula.ac.th.': false,
      'a@b@chula.ac.th': false, 'chula.ac.th': false, '': false, 'x@gmail.com': false,
    };
    for (const [email, expected] of Object.entries(cases)) {
      assert.equal(await value(`select public.is_chula_email(${q(email)})::text`), String(expected), email);
    }
    assert.equal(await value(`select public.is_chula_email(null)::text`), 'false');
  });

  await check('who is let in: verified Chula Google identities on Chula Workspace (hd), and the admin', async () => {
    const expected = { member: true, staff: true, personal: false, gmail: false, unverified: false, pwChula: false, admin: true, sub: false };
    for (const [key, allowed] of Object.entries(expected)) {
      assert.equal(await value(`select public.chula_allowed(${q(U[key])})::text`), String(allowed), key);
    }
    assert.equal(await value(`select public.chula_allowed(null)::text`), 'false');
  });

  await setWall(true);

  await check('the Auth hook refuses every new account but Google with a Chula address', async () => {
    const hook = (email, provider) => value(`select public.hook_before_user_created(${q(JSON.stringify({ user: { email, app_metadata: provider ? { provider } : {} } }))}::jsonb)::text`);
    assert.equal(await hook('new@student.chula.ac.th', 'google'), '{}');
    assert.equal(await hook('new@chula.ac.th', 'google'), '{}');
    for (const [email, provider] of [['x@gmail.com', 'google'], ['new@student.chula.ac.th', 'email'], ['new@student.chula.ac.th', 'discord'],
      ['x@vet.chula.ac.th', 'google'], ['new@student.chula.ac.th', null], ['', 'google']]) {
      const out = JSON.parse(await hook(email, provider));
      assert.equal(out.error?.http_code, 403, `${email} ${provider}`);
      assert.match(out.error.message, /อีเมลจุฬา/);
      const chulaAddress = /@(student\.)?chula\.ac\.th$/.test(email);
      assert.match(out.error.message, chulaAddress ? /ปุ่ม Google/ : /ไม่ใช่อีเมลจุฬา/, `${email} ${provider}`);
    }
  });

  await check('the auth.users trigger refuses the same accounts inside the schema', async () => {
    const insert = (email, provider) => `insert into auth.users (id, email, raw_app_meta_data) values (gen_random_uuid(), ${q(email)}, ${q(JSON.stringify(provider ? { provider } : {}))})`;
    await rejects(insert('x@gmail.com', 'google'), /chula_only/);
    await rejects(insert('new@student.chula.ac.th', 'email'), /chula_only/);
    await rejects(insert(null, 'google').replace(`'null'`, 'null'), /chula_only/);
    await run(`${insert('new1@student.chula.ac.th', 'google')};`);
    await run(`${insert('new2@student.chula.ac.th', null)};`);
  });

  await check('the pre-request lets in members, the admin, service_role and five public calls', async () => {
    await rejects(as('anon', null, `select public.chula_pre_request()`), /chula_member_required/);
    await rejects(as('authenticated', U.gmail, `select public.chula_pre_request()`), /chula_member_required/);
    await rejects(as('authenticated', U.pwChula, `select public.chula_pre_request()`), /chula_member_required/);
    await rejects(as('authenticated', U.unverified, `select public.chula_pre_request()`), /chula_member_required/);
    await rejects(as('authenticated', U.gmail, `select public.chula_pre_request()`, '/rpc/sync_user_data_v2'), /chula_member_required/);
    await run(as('authenticated', U.member, `select public.chula_pre_request()`));
    await run(as('authenticated', U.staff, `select public.chula_pre_request()`));
    await run(as('authenticated', U.admin, `select public.chula_pre_request()`));
    await run(as('service_role', null, `select public.chula_pre_request()`));
    for (const open of ['/rpc/chula_access_state', '/rpc/seeside_public_stats', '/rpc/record_client_diagnostic', '/rpc/library_doc_for_signing', '/rpc/ai_guest_pass_use']) {
      await run(as('anon', null, `select public.chula_pre_request()`, open));
    }
    await rejects(as('anon', null, `select public.chula_pre_request()`, '/rpc/chula_access_state/../notes'), /chula_member_required/);
    await rejects(as('anon', null, `select public.chula_pre_request()`, '/rpc/ai_guest_pass_use/../notes'), /chula_member_required/);
    await rejects(as('anon', null, `select public.chula_pre_request()`, '/rpc/library_search'), /chula_member_required/);
  });

  // The wall is on from here: a trial pass (20261115080000_ai_guest_pass.sql) is asked about by the
  // public key, as the Vercel API asks (api/_lib/guest-pass.js).
  await check('a trial pass: only its hash is kept, each use counts once up to the cap, every refusal has its reason', async () => {
    const code = 'harness-code_not-a-pass-000001';
    const hash = crypto.createHash('sha256').update(code).digest('hex');
    const use = async (c, count = true, role = 'anon', sub = null) =>
      JSON.parse(await value(as(role, sub, `select public.ai_guest_pass_use(${c === null ? 'null' : q(c)}, ${count ? 'true' : 'false'})::text`, '/rpc/ai_guest_pass_use')));
    const row = (column) => value(`select ${column}::text from private.ai_guest_pass where code_sha256 = ${q(hash)}`);
    const invalid = { ok: false, reason: 'invalid' };

    assert.deepEqual(await use(code), invalid, 'no pass exists until one is inserted');
    // the way the docs make one: the hash is computed outside the database, so the code is never in a statement
    await run(`insert into private.ai_guest_pass (code_sha256, note, expires_at, max_messages) values (${q(hash)}, 'harness', now() + interval '1 day', 2);`);

    const peek = await use(code, false);
    assert.equal(peek.ok, true);
    assert.equal(peek.left, 2);
    assert.ok(Date.parse(peek.expires_at) > Date.now());
    assert.equal((await use(code, false)).left, 2, 'a check without counting uses nothing');
    assert.equal((await use(code)).left, 1);
    assert.equal(JSON.parse(await value(as('anon', null, `select public.ai_guest_pass_use(${q(code)})::text`, '/rpc/ai_guest_pass_use'))).left, 0, 'counting is the default');
    assert.deepEqual(await use(code), { ok: false, reason: 'spent' });
    assert.deepEqual(await use(code, false), { ok: false, reason: 'spent' });
    assert.equal(await row('used_messages'), '2', 'never past the cap');

    for (const bad of ['harness-code_not-a-pass-000002', 'short', 'a'.repeat(21), 'a'.repeat(65), `${'a'.repeat(21)}%`, `${'a'.repeat(22)}\n`,
      `${'a'.repeat(22)}'; delete from private.ai_guest_pass; --`, hash, '', null]) {
      assert.deepEqual(await use(bad), invalid, String(bad).slice(0, 30));
      assert.deepEqual(await use(bad, false), invalid, String(bad).slice(0, 30));
    }

    await run(`update private.ai_guest_pass set used_messages = 0, expires_at = now() - interval '1 second' where code_sha256 = ${q(hash)};`);
    assert.deepEqual(await use(code), { ok: false, reason: 'expired' });
    assert.deepEqual(await use(code, false), { ok: false, reason: 'expired' });
    await run(`update private.ai_guest_pass set expires_at = now() + interval '1 day', revoked_at = now() where code_sha256 = ${q(hash)};`);
    assert.deepEqual(await use(code), invalid, 'a revoked pass reads as an unknown one');
    assert.deepEqual(await use(code, false), invalid);
    assert.equal(await row('used_messages'), '0', 'a refused use counts nothing');
    await run(`update private.ai_guest_pass set revoked_at = null where code_sha256 = ${q(hash)};`);
    assert.equal((await use(code, true, 'authenticated', U.gmail)).left, 1, 'the answer is about the code, whoever asks');

    // the code is in no column, and a value that is not a hash cannot be stored
    assert.equal(await value(`select count(*) from private.ai_guest_pass p where to_jsonb(p)::text like ${q(`%${code}%`)}`), '0');
    await rejects(`insert into private.ai_guest_pass (code_sha256, expires_at) values (${q(code)}, now() + interval '1 day')`, /check constraint/);
    await rejects(`insert into private.ai_guest_pass (code_sha256, expires_at, max_messages) values (${q('0'.repeat(64))}, now() + interval '1 day', 0)`, /check constraint/);
    await rejects(`insert into private.ai_guest_pass (code_sha256, expires_at) values (${q(hash)}, now() + interval '1 day')`, /duplicate key/);

    // browser roles reach the function and nothing under it
    for (const sql of [`select count(*) from private.ai_guest_pass`, `update private.ai_guest_pass set max_messages = 100000`,
      `insert into private.ai_guest_pass (code_sha256, expires_at) values (${q('1'.repeat(64))}, now() + interval '1 day')`]) {
      await rejects(as('anon', null, sql, '/rpc/ai_guest_pass_use'), /permission denied/);
      await rejects(as('authenticated', U.member, sql), /permission denied/);
    }
    // a pass opens no row: the caller is still nobody to every policy
    assert.equal(await value(as('anon', null, `select count(*) from public.notes`, '/rpc/ai_guest_pass_use')), '0');
    assert.equal(await value(`select public.chula_wall_enforced()::text`), 'true', 'the switch is as it was');
  });

  await check('row security: non-members read and write nothing, members keep their own rows', async () => {
    assert.equal(await value(as('anon', null, `select count(*) from public.notes`)), '0');
    assert.equal(await value(as('authenticated', U.gmail, `select count(*) from public.notes`)), '0');
    assert.equal(await value(as('authenticated', U.member, `select count(*) from public.notes`)), '1');
    await rejects(as('authenticated', U.gmail, `insert into public.notes (owner, body) values (${q(U.gmail)}, 'x')`), /row-level security/);
    assert.equal(await value(as('authenticated', U.gmail, `with d as (delete from public.notes returning 1) select count(*) from d`)), '0');
    await run(as('authenticated', U.member, `insert into public.notes (owner, body) values (${q(U.member)}, 'second')`));
    await rejects(as('authenticated', U.member, `insert into public.notes (owner, body) values (${q(U.gmail)}, 'not yours')`), /row-level security/);
    for (const table of ['vca.posts', 'storage.objects']) {
      assert.equal(await value(as('anon', null, `select count(*) from ${table}`)), '0', table);
      assert.equal(await value(as('authenticated', U.member, `select count(*) from ${table}`)), '1', table);
    }
    assert.equal(await value(as('authenticated', U.gmail, `select count(*) from realtime.messages`)), '0');
    assert.equal(await value(as('authenticated', U.member, `select count(*) from realtime.messages`)), '1');
    assert.equal(await value(as('service_role', null, `select count(*) from public.notes`)), '3');
  });

  await check('chula_access_state tells each caller about itself only', async () => {
    const state = async (role, sub) => JSON.parse(await value(as(role, sub, `select public.chula_access_state()::text`, '/rpc/chula_access_state')));
    assert.deepEqual(await state('anon', null), { enforce: true, signed_in: false, member: false, uid: null });
    assert.deepEqual(await state('authenticated', U.member), { enforce: true, signed_in: true, member: true, uid: U.member });
    assert.equal((await state('authenticated', U.gmail)).member, false);
    assert.equal((await state('authenticated', U.admin)).member, true);
  });

  await check('only the admin flips the switch, and off restores every layer', async () => {
    await rejects(as('authenticated', U.gmail, `select public.admin_set_chula_wall(false)`), /admin_only/);
    await rejects(as('authenticated', U.member, `select public.admin_set_chula_wall(false)`), /admin_only/);
    await rejects(as('authenticated', U.admin, `select public.admin_set_chula_wall(null)`), /enforce must be/);
    const off = JSON.parse(await value(as('authenticated', U.admin, `select public.admin_set_chula_wall(false)::text`)));
    assert.equal(off.enforce, false);
    assert.equal(await value(as('authenticated', U.gmail, `select count(*) from public.notes`)), '1');
    assert.equal(await value(as('anon', null, `select count(*) from public.notes`)), '3');
    await run(as('anon', null, `select public.chula_pre_request()`));
    await run(`insert into auth.users (id, email, raw_app_meta_data) values (gen_random_uuid(), 'later@gmail.com', '{"provider":"google"}');`);
    const on = JSON.parse(await value(as('authenticated', U.admin, `select public.admin_set_chula_wall(true)::text`)));
    assert.equal(on.enforce, true);
  });

  await check('a deleted switch reads as on', async () => {
    await run(`delete from private.chula_wall;`);
    assert.equal(await value(`select public.chula_wall_enforced()::text`), 'true');
    await run(`insert into private.chula_wall (id, enforce) values (true, true);`);
  });

  await check('browser roles cannot call the internals or read the switch', async () => {
    for (const sql of [`select public.chula_allowed(${q(U.member)})`, `select public.chula_wall_enforced()::text`,
      `select public.hook_before_user_created('{}'::jsonb)`, `select enforce from private.chula_wall`]) {
      await rejects(as('anon', null, sql, '/rpc/chula_access_state'), /permission denied/);
      await rejects(as('authenticated', U.member, sql), /permission denied/);
    }
  });

  await check('the pre-request is registered on the authenticator role', async () => {
    const setting = await value(`select array_to_string(setconfig, ',') from pg_db_role_setting s join pg_roles r on r.oid = s.setrole where r.rolname = 'authenticator'`);
    assert.match(setting || '', /pgrst\.db_pre_request=public\.chula_pre_request/);
  });

  await check('the migrations apply twice without error and keep the switch', async () => {
    for (const file of MIGRATIONS) await run(fs.readFileSync(file, 'utf8'));
    assert.equal(await value(`select public.chula_wall_enforced()::text`), 'true');
    const tables = await value(`select count(*) + 2 from pg_class c join pg_namespace n on n.oid = c.relnamespace where c.relkind in ('r', 'p') and n.nspname in ('public', 'vca')`);
    assert.equal(await value(`select count(*) from pg_policies where policyname = 'chula members only'`), tables);
  });
} catch (error) {
  checks.push({ name: 'setup', ok: false, error: String(error.message).slice(0, 1500) });
} finally {
  try { await cleanup(); } catch (error) { checks.push({ name: 'cleanup', ok: false, error: String(error.message).slice(0, 600) }); }
}

const failed = checks.filter((c) => !c.ok);
for (const c of checks) console.log(`${c.ok ? 'ok  ' : 'FAIL'} ${c.name}${c.ok ? '' : `\n     ${c.error}`}`);
console.log(JSON.stringify({ backend, passed: checks.length - failed.length, failed: failed.length }));
process.exitCode = failed.length || checks.length < 10 ? 1 : 0;
