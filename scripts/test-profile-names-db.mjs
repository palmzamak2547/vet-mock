// The public-name steps of release 5.228.0 in a disposable database only
// (supabase/migrations/20261115140000..140300, docs/releases/5.228.0.md "Database steps, final").
// Local: PGLITE_MODULE=/path/to/@electric-sql/pglite/dist/index.js node scripts/test-profile-names-db.mjs
// CI:    PG_CONTAINER=<postgres:17.6 service ID> node scripts/test-profile-names-db.mjs --backend=postgres
// Never accepts a database URL: the native adapter only talks to the dedicated CI container.
//
// Every name and address here is made up. The recogniser and the rules are run on the
// same names as the app's own functions (identity-gate.js, public-display.js,
// public-identity.js), so the two halves cannot drift apart unnoticed. The count
// queries are read from the migrations' own comments and run as written.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { isAutoName, identityIntroDue } from '../src/lib/identity-gate.js';
import { shownName } from '../src/lib/public-display.js';
import { checkPublicName, compactName } from '../src/lib/public-identity.js';

const ROOT = fileURLToPath(new URL('../', import.meta.url));
const file = (name) => fs.readFileSync(path.join(ROOT, 'supabase/migrations', name), 'utf8').replace(/\r\n/g, '\n');
const RULES = file('20261115140000_profile_name_rules.sql');
const APPLY = file('20261115140100_profile_neutral_handles_apply.sql');
const GUARD = file('20261115140200_profile_identity_guard.sql');
const INDEX = file('20261115140300_profiles_username_folded_unique.sql');
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
  const database = `vmx_profile_names_${crypto.randomBytes(8).toString('hex')}`;
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

// A request as PostgREST makes it: role and claims for one transaction. test.try runs
// the statement as that role and returns 'ok <rows>' or '<sqlstate> <message>'.
const claimsFor = (role, sub) => JSON.stringify(sub ? { role, sub } : { role });
const as = (role, sub, statement) => run(`begin; set local role ${role};
  set local "request.jwt.claim.sub" = ${q(sub || '')}; set local "request.jwt.claims" = ${q(claimsFor(role, sub))};
  select test.try(${q(statement)}); commit;`);
const json = async (sql) => JSON.parse(await run(`select coalesce((${sql})::text, 'null');`));
const commentSql = (text, start) => {
  const comments = text.split('\n').filter((l) => l.startsWith('--')).map((l) => l.replace(/^--\s?/, '')).join('\n');
  const at = comments.indexOf(start);
  assert(at >= 0, `count query starting "${start}" not found in the migration's comments`);
  return comments.slice(at, comments.indexOf(';', at));
};
const asRow = (query) => json(`select row_to_json(t) from (${query}) t`);
const HANDLE = /^user_[a-f]{6}$/;

const checks = [];
async function check(name, fn) {
  try { await fn(); checks.push({ name, ok: true }); } catch (error) { checks.push({ name, ok: false, error: String(error.message).slice(0, 900) }); }
}

// Made-up accounts, present before the migrations as production's are.
const A = uid(); // a Chula account whose name is its own student number, typed at signup
const B = uid(); // a mail account whose name is its mail local part
const C = uid(); // an ordinary Thai name
const D = uid(); // an ordinary English name
const E = uid(); // digits that are not a student number
const F = uid(); // digits joined by a space, six in all
const G = uid(); // someone's ten-digit number on a mail account
const H = uid(); // the local part as handle_new_user stores it (the dot dropped)

try {
  for (const role of ['anon', 'authenticated', 'authenticator', 'supabase_auth_admin']) {
    await run(`do $$ begin if not exists (select 1 from pg_roles where rolname = ${q(role)}) then create role ${role} nologin; end if; end $$;`);
  }
  await run(`do $$ begin if not exists (select 1 from pg_roles where rolname = 'service_role') then create role service_role nologin bypassrls; end if; end $$;`);
  // The parts of production these files meet: auth.users, auth.uid(), the private
  // schema members may use, public.profiles with its grants, constraints and policies,
  // and handle_new_user exactly as supabase-schema.sql defines it.
  await run(`
    create schema auth;
    create table auth.users (id uuid primary key, email text, raw_user_meta_data jsonb not null default '{}'::jsonb);
    create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
    grant usage on schema auth to anon, authenticated, service_role;
    grant execute on function auth.uid() to anon, authenticated, service_role;
    create schema private;
    revoke all on schema private from public;
    grant usage on schema private to authenticated;
    create table public.profiles (
      id uuid primary key references auth.users(id) on delete cascade,
      username text unique not null,
      avatar_emoji text default '🐾',
      total_attempts int default 0,
      total_correct int default 0,
      streak int default 0,
      last_study_date date,
      created_at timestamptz default now()
    );
    alter table public.profiles add constraint profiles_username_length_check check (char_length(username) between 2 and 30) not valid;
    alter table public.profiles add constraint profiles_avatar_length_check check (avatar_emoji is null or char_length(avatar_emoji) <= 32) not valid;
    alter table public.profiles enable row level security;
    create policy profiles_select_members on public.profiles for select to authenticated using (true);
    create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id);
    revoke all on table public.profiles from anon, authenticated;
    grant select (id, username, avatar_emoji, created_at) on table public.profiles to authenticated;
    grant update (username, avatar_emoji) on table public.profiles to authenticated;
    create table public.shared_questions (id uuid primary key default gen_random_uuid(), group_id uuid not null,
      author_id uuid not null, author_name text, data jsonb not null);
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
    grant usage on schema test to anon, authenticated, service_role;
    grant execute on function test.try(text) to anon, authenticated, service_role;
  `);
  const schema = fs.readFileSync(path.join(ROOT, 'supabase-schema.sql'), 'utf8').replace(/\r\n/g, '\n');
  const handleNewUser = schema.match(/CREATE OR REPLACE FUNCTION handle_new_user\(\)[\s\S]+?\n\$\$;/);
  assert(handleNewUser, 'handle_new_user not found in supabase-schema.sql');
  await run(`${handleNewUser[0]}
    create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();`);

  const signUp = (id, email, meta = {}) => run(`insert into auth.users (id, email, raw_user_meta_data) values (${q(id)}, ${q(email)}, ${q(JSON.stringify(meta))}::jsonb);`);
  const setName = (id, name) => run(`update public.profiles set username = ${q(name)} where id = ${q(id)};`);
  const nameOf = async (id) => run(`select coalesce(username, '<none>') from public.profiles where id = ${q(id)};`);
  const metaOf = async (id) => json(`select raw_user_meta_data from auth.users where id = ${q(id)}`);
  const fingerprint = () => run(`select md5(string_agg(id::text || ':' || username || ':' || coalesce(avatar_emoji, ''), ',' order by id)) from public.profiles;`);

  await signUp(A, '6631234531@student.chula.ac.th', { username: '6631234531', identity_intro_done: true, show_on_leaderboard: false, xp_quests: 40 });
  await signUp(B, 'somchai.j@gmail.com', { name: 'สมชาย', identity_intro_done: true });
  await signUp(C, '6631234532@student.chula.ac.th', { name: 'นิดา' });
  await signUp(D, 'ploy.s@gmail.com', { name: 'พลอย' });
  await signUp(E, '6631234533@student.chula.ac.th', {});
  await signUp(F, 'vet86@gmail.com', { name: 'ต้น' });
  await signUp(G, 'gift.k@gmail.com', { name: 'กิฟต์' });
  await signUp(H, 'nok.p@gmail.com', { name: 'นก' });
  await setName(B, 'somchai.j');
  await setName(C, 'น้องหมูเด้ง');
  await setName(D, 'Ploy Siriporn');
  await setName(E, 'ploy55555');
  await setName(F, 'vet86 2567');
  await setName(G, '6601234567');
  await setName(H, 'nokp');
  await run(`insert into public.shared_questions (group_id, author_id, author_name, data)
    values (gen_random_uuid(), ${q(G)}, '6601234567', '{"q":"x"}'), (gen_random_uuid(), ${q(C)}, 'น้องหมูเด้ง', '{"q":"y"}');`);

  await check('file 1 adds functions and an empty table, and changes no row', async () => {
    const before = await fingerprint();
    await run(RULES);
    assert.equal(await fingerprint(), before);
    assert.equal(await run(commentSql(RULES, 'select count(*) as undo_rows')), '0');
  });

  // [name, email, expected reason or null]
  const LEAK_CASES = [
    ['6601234567', 'someone@gmail.com', 'student number'],
    ['6631234531', '6631234531@student.chula.ac.th', 'student number'],
    ['663 123 4531', 'x@gmail.com', 'student number'],
    ['663-123-4531', 'x@gmail.com', 'student number'],
    ['๖๖๓๑๒๓๔๕๓๑', 'x@gmail.com', 'student number'],
    ['６６３１２３４５３１', 'x@gmail.com', 'student number'],
    ['6631​234531', 'x@gmail.com', 'student number'],
    ['643่1234567', 'x@gmail.com', 'student number'],
    ['12345', 'x@gmail.com', 'student number'],
    ['somchai.j', 'somchai.j@gmail.com', 'email'],
    ['SOMCHAI.J', 'Somchai.J@Gmail.com', 'email'],
    ['somchaij', 'somchai.j@gmail.com', 'email'],
    ['somchaij_2', 'somchai.j@gmail.com', 'email'],
    ['ploy@home', 'x@gmail.com', 'address'],
    ['www.ploy', 'x@gmail.com', 'address'],
    ['somchai.j', 'other@gmail.com', null],
    ['น้องหมูเด้ง', '6631234532@student.chula.ac.th', null],
    ['สมชาย ใจดี', 'x@gmail.com', null],
    ['Ploy Siriporn', 'ploy.s@gmail.com', null],
    ['ploy55555', 'x@gmail.com', null],
    ['vet86 2567', 'vet86@gmail.com', null],
    ['Room 101', 'x@gmail.com', null],
    ['user_12', 'x@gmail.com', null],
    ['user_abcdef', 'x@gmail.com', null],
    ['', 'x@gmail.com', null],
    [null, 'x@gmail.com', null],
  ];

  await check(`the recogniser on ${LEAK_CASES.length} made-up names`, async () => {
    const values = LEAK_CASES.map(([n, e], i) => `(${i}, ${q(n)}, ${q(e)})`).join(', ');
    const got = await json(`select json_agg(private.public_name_leak(n, e) order by i) from (values ${values}) v(i, n, e)`);
    const wrong = LEAK_CASES.map(([n, e, want], i) => (got[i] === want ? null : `${JSON.stringify(n)} / ${e}: ${got[i]} (want ${want})`)).filter(Boolean);
    assert.deepEqual(wrong, []);
  });

  await check('the recogniser matches what the app already hides or treats as not chosen', async () => {
    // The app: shownName draws it as "นิสิต", or isAutoName says nobody chose it (bare
    // digits, the local part). The database adds two forms the app does not know:
    // handle_new_user's stored local part and a mark hiding a digit run.
    const extra = new Set(['somchaij', 'somchaij_2', '643่1234567']);
    const wrong = [];
    for (const [n, e, want] of LEAK_CASES) {
      if (n === null || n === '' || extra.has(n)) continue;
      const app = shownName(n) === 'นิสิต' || (/^\d{5,}$/.test(n.trim()) || isAutoName(n, e)) && !/^user/.test(n);
      if (app !== (want !== null)) wrong.push(`${n}: app ${app}, database ${want}`);
    }
    assert.deepEqual(wrong, []);
  });

  const RULE_CASES = [
    'Ploy', 'น้องหมูเด้ง', 'ทำดี', 'ploy.s', 'Rootbeer', 'Ownerin', 'Vet86', 'A-B', 'Room 101', 'ploy5555', 'สมชาย ใจดี',
    'ab', 'a'.repeat(25), '6631234531', 'ploy55555', '663-12', '6่', 'ploy@home', 'ploy.com', 'www.x', ' Ploy', 'Ploy_', 'Ploy  S',
    '1234', '___', 'admin', 'Admin_2', 'staff', 'root.beer', 'mod', 'อาจารย์ปิง', 'ทีมงานVet', 'Ploy😀', 'somchai.j', 'adm1n', 'user_2',
  ];

  await check('the rules for a new name: every database refusal is also an app refusal, and an app name passes', async () => {
    const email = 'somchai.j@gmail.com';
    const values = RULE_CASES.map((n, i) => `(${i}, ${q(n)})`).join(', ');
    const got = await json(`select json_agg(private.public_name_problem(n, ${q(email)}) order by i) from (values ${values}) v(i, n)`);
    const wrong = [];
    RULE_CASES.forEach((n, i) => {
      const app = checkPublicName(n, { email });
      if (got[i] !== null && app.ok && app.value === n) wrong.push(`${JSON.stringify(n)}: database refuses (${got[i]}), app allows`);
      if (got[i] === null && !app.ok && app.value === n && !['adm1n', 'user_2'].includes(n)) wrong.push(`${JSON.stringify(n)}: app refuses (${app.reason}), database allows`);
    });
    assert.deepEqual(wrong, []);
    // The app sends the normalised value: whatever it accepts, the database accepts as sent.
    for (const n of ['Ploy', 'น้องหมูเด้ง', 'ทำดี', 'ploy.s', 'Rootbeer', 'Vet86', 'Room 101', 'สมชาย ใจดี']) {
      const app = checkPublicName(n, { email });
      assert.equal(app.ok, true, n);
      assert.equal(await run(`select coalesce(private.public_name_problem(${q(app.value)}, ${q(email)}), 'none');`), 'none', n);
    }
  });

  await check('the folded form is the app\'s compactName', async () => {
    const names = ['Ploy', 'pIoy', 'P.loy', 'PL0Y', 'ทํา', 'ทำ', 'Som chai', '６６３', 'a​b', 'O_o', 'น้องหมูเด้ง'];
    const values = names.map((n, i) => `(${i}, ${q(n)})`).join(', ');
    const got = await json(`select json_agg(private.compact_name(n) order by i) from (values ${values}) v(i, n)`);
    assert.deepEqual(got, names.map((n) => compactName(n)));
  });

  const countQuery = commentSql(APPLY, "select count(*) filter (where reason = 'student number')");
  const sharedQuery = commentSql(APPLY, 'select count(*) as shared_question_names');

  await check('the count query before file 2 gives counts only, by reason', async () => {
    assert.deepEqual(await asRow(countQuery), { student_number: 2, email: 2, address: 0, accounts: 4 });
    assert.equal(await run(sharedQuery), '1');
  });

  await check('file 2 gives the four a neutral handle, prints only the count, and the first-run step asks again', async () => {
    const before = Object.fromEntries(await Promise.all([C, D, E, F].map(async (id) => [id, await nameOf(id)])));
    const metaBeforeA = await metaOf(A);
    assert.equal(await run(APPLY), '4');
    for (const id of [A, B, G, H]) {
      const name = await nameOf(id);
      assert.match(name, HANDLE);
      assert.equal(isAutoName(name), true, name);
      const meta = await metaOf(id);
      assert.equal('identity_intro_done' in meta, false);
      const email = await run(`select email from auth.users where id = ${q(id)};`);
      const created = await run(`select created_at::text from public.profiles where id = ${q(id)};`);
      assert.equal(identityIntroDue({ user: { id, email, user_metadata: meta }, profile: { id, username: name, created_at: created }, view: 'home' }), true);
    }
    const metaA = await metaOf(A);
    const { identity_intro_done: _drop, ...keptA } = metaBeforeA;
    assert.deepEqual(metaA, keptA);
    for (const id of [C, D, E, F]) assert.equal(await nameOf(id), before[id]);
    assert.deepEqual(await asRow(countQuery), { student_number: 0, email: 0, address: 0, accounts: 0 });
    assert.equal(await run(`select count(*) from private.profile_name_undo where undone_at is null and reason <> 'collision';`), '4');
    assert.equal(await run(`select string_agg(reason, ',' order by reason) from private.profile_name_undo;`), 'email,email,student number,student number');
    assert.equal(await run(sharedQuery), '1', 'a shared question keeps the name it was shared under');
    assert.equal(await run(APPLY), '0', 'running it again changes nothing');
  });

  await check('a member, a visitor and the service role cannot read the undo table or run the steps', async () => {
    for (const [role, sub] of [['authenticated', A], ['anon', null], ['service_role', null]]) {
      assert.match(await as(role, sub, 'select count(*) from private.profile_name_undo'), /^42501 /, role);
    }
    for (const call of [`select private.give_neutral_handle(${q(C)}, 'email')`, `select private.undo_neutral_handle(${q(A)})`,
      'select private.neutralise_leaking_names()', 'select private.neutralise_folded_collisions()', 'select private.neutral_handle()',
      `select private.public_name_leak('x', 'y')`]) {
      assert.match(await as('authenticated', A, call), /^42501 /, call);
    }
    assert.match(await as('authenticated', A, 'select id, username from public.profiles'), /^ok 8$/);
  });

  await check('undo puts back one account, and leaves an account whose student chose a name since', async () => {
    assert.equal(await run(`select private.undo_neutral_handle(${q(B)})::text;`), 'true');
    assert.equal(await nameOf(B), 'somchai.j');
    assert.equal((await metaOf(B)).identity_intro_done, true);
    assert.equal(await run(`select private.undo_neutral_handle(${q(B)})::text;`), 'false');
    await setName(G, 'Gift');
    assert.equal(await run(`select private.undo_neutral_handle(${q(G)})::text;`), 'false');
    assert.equal(await nameOf(G), 'Gift');
    assert.equal(await run(`select count(*) from private.profile_name_undo where undone_at is not null;`), '1');
  });

  await check('file 3: the guard refuses what the app refuses, with 23514 and a reason, and lets the rest through', async () => {
    const before = await fingerprint();
    assert.equal(await asRow(commentSql(GUARD, 'select count(*) filter (where private.public_name_problem')).then((r) => r.names_outside_rules >= 0), true);
    await run(GUARD);
    assert.equal(await fingerprint(), before, 'applying it changes no row');
    const rename = (id, name) => as('authenticated', id, `update public.profiles set username = ${q(name)} where id = ${q(id)}`);
    assert.equal(await rename(A, 'Mint'), 'ok 1');
    assert.match(await rename(A, '6631234531'), /^23514 public name refused: digits$/);
    assert.match(await rename(A, 'ab'), /^23514 public name refused: length$/);
    assert.match(await rename(A, 'admin'), /^23514 public name refused: reserved$/);
    assert.match(await rename(A, 'อาจารย์ปิง'), /^23514 public name refused: reserved$/);
    assert.match(await rename(A, 'ploy@home'), /^23514 public name refused: address$/);
    assert.match(await rename(B, 'Somchai.J'), /^23514 public name refused: email$/);
    assert.equal(await rename(A, 'Ploy Siriporn').then((r) => r.startsWith('23505 ')), true, 'the exact unique index still answers first');
    assert.equal(await as('authenticated', B, `update public.profiles set avatar_emoji = '🐶' where id = ${q(B)}`), 'ok 1', 'a picture alone, beside an old name');
    assert.match(await as('authenticated', B, `update public.profiles set avatar_emoji = 'อาจารย์' where id = ${q(B)}`), /^23514 public picture refused$/);
    assert.equal(await rename(E, 'ploy55555'), 'ok 1', 'a name that is not changed is not checked');
    assert.equal(await as('authenticated', A, `update public.profiles set username = 'Taken over' where id = ${q(C)}`), 'ok 0', 'own row only');
    assert.equal(await nameOf(A), 'Mint');
  });

  await check('file 3: a new row never starts with a number, a mail local part, a Google name or a taken folded name', async () => {
    const fresh = { mail: uid(), chula: uid(), google: uid(), thai: uid(), typed: uid(), alike: uid() };
    await signUp(fresh.mail, 'newbie.x@gmail.com', {});
    await signUp(fresh.chula, '6631234599@student.chula.ac.th', {});
    await signUp(fresh.google, 'jane.d@gmail.com', { full_name: 'Jane Doe', name: 'Jane Doe' });
    await signUp(fresh.thai, '6631234598@student.chula.ac.th', { full_name: 'สมหญิง ดีใจ', name: 'สมหญิง ดีใจ' });
    await signUp(fresh.typed, 'sweet.tooth@gmail.com', { username: 'Kanom' });
    await signUp(fresh.alike, 'other@gmail.com', { username: 'M1nt' });
    for (const id of [fresh.mail, fresh.chula, fresh.google, fresh.alike]) assert.match(await nameOf(id), HANDLE);
    assert.match(await nameOf(fresh.thai), /^user(_\d{1,2})?$/);
    assert.equal(await nameOf(fresh.typed), 'Kanom');
    await run(`delete from auth.users where id in (${Object.values(fresh).map(q).join(', ')});`);
  });

  await check('file 4: the collision count, the pass that clears it, then the folded unique index', async () => {
    const collisions = commentSql(INDEX, 'select count(*) as folded_groups');
    await run(`update public.profiles set created_at = '2026-09-01' where id = ${q(D)}; update public.profiles set created_at = '2026-10-01' where id = ${q(E)};`);
    await setName(D, 'PL0Y55555');
    assert.deepEqual(await asRow(collisions), { folded_groups: 1, rows_in_groups: 2 });
    const build = backend === 'pglite' ? INDEX.replace(/index concurrently/g, 'index') : INDEX;
    await assert.rejects(run(build), /could not create unique index|duplicate key/);
    await run('drop index if exists public.profiles_username_folded_key;');
    assert.equal(await run('select private.neutralise_folded_collisions();'), '1');
    assert.match(await nameOf(E), HANDLE, 'the later account gives way');
    assert.equal(await nameOf(D), 'PL0Y55555', 'the older account keeps its name');
    assert.deepEqual(await asRow(collisions), { folded_groups: 0, rows_in_groups: 0 });
    await run(build);
    assert.equal(await run(`select indisvalid::text from pg_index where indexrelid = 'public.profiles_username_folded_key'::regclass;`), 'true');
    const rename = (id, name) => as('authenticated', id, `update public.profiles set username = ${q(name)} where id = ${q(id)}`);
    assert.match(await rename(F, 'M.int'), /^23505 /, 'alike once folded to Mint');
    assert.equal(await rename(F, 'Fresh Name'), 'ok 1', 'a member can still rename with the index in place');
  });
} catch (error) {
  checks.push({ name: 'setup', ok: false, error: String(error.message).slice(0, 1500) });
} finally {
  try { await cleanup(); } catch (error) { checks.push({ name: 'cleanup', ok: false, error: String(error.message).slice(0, 600) }); }
}

const failed = checks.filter((c) => !c.ok);
for (const c of checks) console.log(`${c.ok ? 'ok  ' : 'FAIL'} ${c.name}${c.ok ? '' : `\n     ${c.error}`}`);
console.log(JSON.stringify({ backend, passed: checks.length - failed.length, failed: failed.length }));
process.exitCode = failed.length || checks.length < 12 ? 1 : 0;
