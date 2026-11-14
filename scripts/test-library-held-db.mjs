// A document held for personal data (text_status = 'pii_held') reaches no member
// through any door, in a disposable database only.
// Local: PGLITE_MODULE=/path/to/@electric-sql/pglite/dist/index.js node scripts/test-library-held-db.mjs
// CI:    PG_CONTAINER=<postgres:17.6 service ID> node scripts/test-library-held-db.mjs --backend=postgres
// Never accepts a database URL: the native adapter only talks to the dedicated CI container.
//
// The doors: the catalogue (library_docs), the file (library_doc_for_signing, which
// /api/library-file signs from), page text (library_doc_pages), search
// (library_search), topic links (library_doc_links, library_related) and the
// 'library-docs' storage bucket, whose read policies ask library_docs as the caller.
// Each is walked as a member, as anon with the wall off, and as the admin, who
// must still see a held document to review it.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = fileURLToPath(new URL('../', import.meta.url));
// Applied in order, as production has them.
const MIGRATIONS = [
  '20260827000000_library_docs_init.sql',
  '20260828000000_library_doc_for_signing_rpc.sql',
  '20261020230000_library_doc_pages.sql',
  '20261021120000_library_doc_links.sql',
  '20261101170000_chula_wall.sql',
  '20261102190000_chula_hook_wording.sql',
  '20261107140012_library_pii_held_not_served.sql',
  '20261107141605_library_search_asks_the_wall.sql',
  '20261114120000_library_held_not_listed_or_opened.sql',
].map((name) => path.join(ROOT, 'supabase/migrations', name));
const LATEST = MIGRATIONS.at(-1);
const backend = process.argv.find((a) => a.startsWith('--backend='))?.slice(10) || 'pglite';
assert(['pglite', 'postgres'].includes(backend));

const q = (v) => `'${String(v).replaceAll("'", "''")}'`;
const uid = () => crypto.randomUUID();
const U = { member: uid(), gmail: uid(), admin: uid() };

let run, cleanup = async () => {};
if (backend === 'pglite') {
  const modulePath = process.env.PGLITE_MODULE;
  assert(modulePath, 'Set PGLITE_MODULE to @electric-sql/pglite/dist/index.js');
  const { PGlite } = await import(pathToFileURL(path.resolve(modulePath)).href);
  const { pg_trgm } = await import(pathToFileURL(path.join(path.dirname(path.resolve(modulePath)), 'contrib', 'pg_trgm.js')).href);
  const pg = new PGlite({ extensions: { pg_trgm } });
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
  const database = `vmx_library_held_${crypto.randomBytes(8).toString('hex')}`;
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
const as = (role, sub, sql) =>
  `begin; set local role ${role}; set local "request.jwt.claim.sub" = ${q(sub || '')}; set local "request.jwt.claim.role" = ${q(role)}; ${sql}; commit;`;
// One text cell: a list is aggregated in the query, so both backends print the same.
const value = async (sql) => run(sql);
const list = async (role, sub, sql) => (await value(as(role, sub, `select coalesce(string_agg(x, ',' order by x collate "C"), '') from (${sql}) s(x)`))) || '';
const setWall = (on) => run(`update private.chula_wall set enforce = ${on ? 'true' : 'false'};`);

const checks = [];
async function check(name, fn) {
  try { await fn(); checks.push({ name, ok: true }); } catch (error) { checks.push({ name, ok: false, error: String(error.message).slice(0, 600) }); }
}

// The documents: slug -> [status, text_status].
const DOCS = {
  'open-deck': ['public', 'ok'],
  'plain-deck': ['public', null],
  'held-deck': ['public', 'pii_held'],
  'login-deck': ['restricted', 'ok'],
  'login-held': ['restricted', 'pii_held'],
  'gone-held': ['archived', 'pii_held'],
};
const SERVED_TO_MEMBER = 'login-deck,open-deck,plain-deck';
const SERVED_TO_ANON = 'open-deck,plain-deck';
const ADMIN_SEES = 'held-deck,login-deck,login-held,open-deck,plain-deck';

// Every door a member could reach a document through, each answering a sorted slug list.
const doors = {
  catalogue: () => `select slug from public.library_docs`,
  oneRow: (slug) => `select slug from public.library_docs where slug = ${q(slug)}`,
  signing: (slug) => `select slug from public.library_doc_for_signing(${q(slug)}) where storage_key is not null`,
  signingRow: (slug) => `select slug from public.library_doc_for_signing(${q(slug)})`,
  signingHeld: (slug) => `select slug from public.library_doc_for_signing(${q(slug)}) where held`,
  search: () => `select slug from public.library_search('parvovirus enteritis', 30)`,
  pages: () => `select d.slug from public.library_doc_pages p join public.library_docs d on d.id = p.doc_id`,
  pagesById: () => `select p.doc_id::text from public.library_doc_pages p`,
  links: () => `select l.doc_id::text from public.library_doc_links l`,
  related: () => `select slug from public.library_related(array['topic-parvo'], 'topic', 20)`,
  storage: () => `select name from storage.objects where bucket_id = 'library-docs'`,
};
const ids = {};
const idList = (slugs) => slugs.split(',').filter(Boolean).map((s) => ids[s]).sort().join(',');

try {
  // A Supabase-shaped skeleton: the roles, auth.uid()/auth.role(), auth.users and
  // identities, admin_users/is_admin(), the helper the library migration reuses,
  // and a storage.objects stand-in with production's two library-docs read policies.
  for (const role of ['anon', 'authenticated', 'authenticator', 'supabase_auth_admin']) {
    await run(`do $$ begin if not exists (select 1 from pg_roles where rolname = ${q(role)}) then create role ${role} nologin; end if; end $$;`);
  }
  await run(`do $$ begin if not exists (select 1 from pg_roles where rolname = 'service_role') then create role service_role nologin bypassrls; end if; end $$;`);
  await run(`
    create schema auth;
    create schema extensions;
    grant usage on schema extensions to anon, authenticated, service_role;
    create table auth.users (id uuid primary key, email text, raw_app_meta_data jsonb not null default '{}'::jsonb);
    create table auth.identities (id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id), provider text not null, identity_data jsonb not null);
    create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
    create function auth.role() returns text language sql stable as $$ select nullif(current_setting('request.jwt.claim.role', true), '') $$;
    grant usage on schema auth to anon, authenticated, service_role;
    grant execute on function auth.uid() to anon, authenticated, service_role;
    grant execute on function auth.role() to anon, authenticated, service_role;
    grant usage on schema public to anon, authenticated, service_role;
    -- Supabase's default privileges: every new table is granted to the API roles, and
    -- each migration revokes what browsers may not do (library_docs: every write).
    alter default privileges in schema public grant all on tables to anon, authenticated, service_role;
    create table public.admin_users (user_id uuid primary key);
    alter table public.admin_users enable row level security;
    create function public.is_admin() returns boolean language sql stable security definer set search_path = public
      as $$ select exists (select 1 from public.admin_users a where a.user_id = auth.uid()) $$;
    -- As on production: anon may not call is_admin(), so a policy that anon passes through
    -- must never call it (the signing function calls it as its owner).
    revoke all on function public.is_admin() from public;
    grant execute on function public.is_admin() to authenticated;
    create function public.touch_updated_at() returns trigger language plpgsql as $$ begin new.updated_at := now(); return new; end $$;
    create schema storage;
    create table storage.objects (id serial primary key, bucket_id text, name text);
    alter table storage.objects enable row level security;
    grant usage on schema storage to anon, authenticated;
    grant select on storage.objects to anon, authenticated;
    create schema realtime;
    create table realtime.messages (id serial primary key, topic text);
    alter table realtime.messages enable row level security;
  `);
  const google = (email, hd) => JSON.stringify({ email, email_verified: true, ...(hd ? { custom_claims: { hd } } : {}) });
  for (const [id, email, data] of [
    [U.member, '6631234531@student.chula.ac.th', google('6631234531@student.chula.ac.th', 'student.chula.ac.th')],
    [U.gmail, 'someone@gmail.com', google('someone@gmail.com')],
    [U.admin, 'owner@gmail.com', google('owner@gmail.com')],
  ]) {
    await run(`insert into auth.users (id, email, raw_app_meta_data) values (${q(id)}, ${q(email)}, '{"provider":"google"}');
      insert into auth.identities (user_id, provider, identity_data) values (${q(id)}, 'google', ${q(data)}::jsonb);`);
  }
  await run(`insert into public.admin_users values (${q(U.admin)});`);

  for (const file of MIGRATIONS.slice(0, 2)) await run(fs.readFileSync(file, 'utf8'));
  // Production's storage read policies (made in the dashboard, owned by the storage role).
  await run(`
    create policy "library-docs read for members" on storage.objects for select to authenticated
      using (bucket_id = 'library-docs' and exists (select 1 from public.library_docs d
        where d.storage_key = objects.name and d.storage_bucket = 'library-docs' and d.status = any (array['public', 'restricted'])));
    create policy "library-docs read for public documents" on storage.objects for select to anon, authenticated
      using (bucket_id = 'library-docs' and exists (select 1 from public.library_docs d
        where d.storage_key = objects.name and d.storage_bucket = 'library-docs' and d.status = 'public'));
  `);
  for (const file of MIGRATIONS.slice(2)) await run(fs.readFileSync(file, 'utf8'));

  // The rows: every document gets a page and a topic link while it is still unheld
  // (the link trigger refuses a held one), then the held ones are flagged, as on
  // 7 Nov 2026, when stored pages were flagged after the fact.
  let n = 0;
  for (const [slug, [status]] of Object.entries(DOCS)) {
    n += 1;
    const sha = crypto.createHash('sha256').update(slug).digest('hex').slice(0, 16);
    ids[slug] = await value(`insert into public.library_docs (slug, title, storage_key, storage_bucket, storage_provider, byte_size, sha256_16, license, status, text_status)
      values (${q(slug)}, ${q(slug)}, ${q(`docs/${slug}.pdf`)}, 'library-docs', 'supabase', 1000, ${q(sha)}, 'test', ${q(status)}, 'ok') returning id::text;`);
    await run(`insert into public.library_doc_pages (doc_id, page, body) values (${q(ids[slug])}, 1, ${q(`${slug}: canine parvovirus enteritis, student 66312345${30 + n}`)});
      insert into public.library_doc_links (doc_id, page, target_kind, target_id, term, evidence, method, rank)
        values (${q(ids[slug])}, 1, 'topic', 'topic-parvo', 'parvovirus', 'canine parvovirus enteritis', 'term', ${n});
      insert into storage.objects (bucket_id, name) values ('library-docs', ${q(`docs/${slug}.pdf`)});`);
  }
  for (const [slug, [, textStatus]] of Object.entries(DOCS)) {
    await run(`update public.library_docs set text_status = ${textStatus === null ? 'null' : q(textStatus)} where slug = ${q(slug)};`);
  }
  await setWall(true);

  // One check per door, so a regression names the door it reopened.
  const m = (sql) => list('authenticated', U.member, sql);
  const HELD = ['held-deck', 'login-held', 'gone-held'];
  await check('a member: the catalogue lists no held document', async () => {
    assert.equal(await m(doors.catalogue()), SERVED_TO_MEMBER);
    for (const held of HELD) assert.equal(await m(doors.oneRow(held)), '', held);
  });
  await check('a member: library_doc_for_signing answers no row for a held document', async () => {
    for (const held of HELD) assert.equal(await m(doors.signingRow(held)), '', `${held}: as for a missing slug`);
  });
  await check('a member: library_search finds no held document', async () => {
    assert.equal(await m(doors.search()), SERVED_TO_MEMBER);
  });
  await check('a member: no page of a held document is read', async () => {
    assert.equal(await m(doors.pages()), SERVED_TO_MEMBER);
    assert.equal(await m(doors.pagesById()), idList(SERVED_TO_MEMBER), 'read without the join');
  });
  await check('a member: no topic link points at a held document', async () => {
    assert.equal(await m(doors.links()), idList(SERVED_TO_MEMBER), 'links');
    assert.equal(await m(doors.related()), SERVED_TO_MEMBER, 'library_related');
  });
  await check('a member: the library-docs bucket serves no held file', async () => {
    assert.equal(await m(doors.storage()), SERVED_TO_MEMBER.split(',').map((s) => `docs/${s}.pdf`).join(','));
  });

  await check('a member: every unheld document still opens', async () => {
    for (const slug of SERVED_TO_MEMBER.split(',')) {
      assert.equal(await list('authenticated', U.member, doors.signing(slug)), slug, slug);
    }
  });

  await check('a non-member signed in reaches nothing, held or not', async () => {
    const g = (sql) => list('authenticated', U.gmail, sql);
    for (const door of ['catalogue', 'search', 'pages', 'links', 'related', 'storage']) assert.equal(await g(doors[door]()), '', door);
  });

  await check('the admin still lists and opens a held document to review it', async () => {
    const a = (sql) => list('authenticated', U.admin, sql);
    assert.equal(await a(doors.catalogue()), ADMIN_SEES);
    assert.equal(await a(doors.signing('held-deck')), 'held-deck');
    assert.equal(await a(doors.signing('login-held')), 'login-held');
    assert.equal(await a(doors.signingHeld('held-deck')), 'held-deck', 'and says so, so the API signs it as restricted');
    assert.equal(await a(doors.signingHeld('open-deck')), '', 'an unheld row is not marked held');
    assert.equal(await a(doors.signingRow('gone-held')), '', 'archived stays unserved, admin or not');
    assert.equal(await a(doors.storage()), ADMIN_SEES.split(',').map((s) => `docs/${s}.pdf`).join(','));
    // Its text stays unserved to everyone: what to do with it is decided from the file.
    assert.equal(await a(doors.search()), SERVED_TO_MEMBER);
    assert.equal(await a(doors.pages()), SERVED_TO_MEMBER);
  });

  await check('with the wall off, anon reaches public unheld documents only', async () => {
    await setWall(false);
    try {
      const n2 = (sql) => list('anon', null, sql);
      assert.equal(await n2(doors.catalogue()), SERVED_TO_ANON, 'catalogue');
      assert.equal(await n2(doors.signingRow('held-deck')), '', 'signing a held public row');
      assert.equal(await n2(doors.signing('open-deck')), 'open-deck', 'signing an unheld public row');
      assert.equal(await n2(doors.signingRow('login-deck')), 'login-deck', 'a restricted row answers, keyless');
      assert.equal(await n2(doors.signing('login-deck')), '', 'and without its key');
      assert.equal(await n2(doors.search()), SERVED_TO_ANON, 'search');
      assert.equal(await n2(doors.pages()), SERVED_TO_ANON, 'pages');
      assert.equal(await n2(doors.related()), SERVED_TO_ANON, 'related');
      assert.equal(await n2(doors.storage()), SERVED_TO_ANON.split(',').map((s) => `docs/${s}.pdf`).join(','), 'storage');
    } finally {
      await setWall(true);
    }
  });

  await check('clearing the flag serves the document again at once', async () => {
    await run(`update public.library_docs set text_status = 'ok' where slug = 'held-deck';`);
    try {
      const m = (sql) => list('authenticated', U.member, sql);
      assert.match(await m(doors.catalogue()), /held-deck/);
      assert.equal(await m(doors.signing('held-deck')), 'held-deck');
      assert.match(await m(doors.search()), /held-deck/);
    } finally {
      await run(`update public.library_docs set text_status = 'pii_held' where slug = 'held-deck';`);
    }
    assert.equal(await list('authenticated', U.member, doors.signingRow('held-deck')), '');
  });

  await check('browser roles still cannot write the catalogue', async () => {
    for (const sql of [`update public.library_docs set text_status = 'ok' where slug = 'held-deck'`,
      `insert into public.library_docs (slug, title, storage_key, byte_size, sha256_16, license) values ('x', 'x', 'x', 1, '0123456789abcdef', 'x')`]) {
      let error = null;
      try { await run(as('authenticated', U.admin, sql)); } catch (e) { error = e; }
      assert(error && /permission denied/.test(String(error.message)), sql);
    }
  });

  await check('the migration applies twice and leaves exactly the two select policies', async () => {
    await run(fs.readFileSync(LATEST, 'utf8'));
    assert.equal(await value(`select string_agg(policyname, ',' order by policyname) from pg_policies where schemaname = 'public' and tablename = 'library_docs'`),
      'chula members only,library_docs anon read,library_docs member read');
    assert.equal(await list('authenticated', U.member, doors.catalogue()), SERVED_TO_MEMBER);
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
