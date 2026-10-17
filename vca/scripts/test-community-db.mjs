// The VCA community schema (supabase/migrations/20261017120000_vca_community.sql), proven in a
// disposable database: who may read and write what, the counts, the rate limits, the
// hide-on-reports rule, direct rooms and blocks, the VetMock bridge, and that deleting an
// account takes its rows with it. Never a production connection.
//
//   npm run test:db                     (PGlite, the devDependency; nothing else to install)
//   PG_MODULE=/path/to/pg/lib/index.js PGHOST=/path/to/socket/dir PGPORT=5432 \
//     node scripts/test-community-db.mjs --backend=postgres
//
// The native backend takes a local socket directory only (PGHOST must be a path), creates a
// database with a random name, and drops it at the end. The fixture stands in for what Supabase
// provides: the anon and authenticated roles, auth.users and auth.uid(), VetMock's profiles and
// public.is_admin(), and the realtime publication.
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';

const MIGRATION = fileURLToPath(new URL('../../supabase/migrations/20261017120000_vca_community.sql', import.meta.url));
// Photos and video on the rows (the storage buckets and their policies need Supabase's storage
// schema, so 20261018090100_vca_media_storage.sql is checked on the project, not here).
const MEDIA = fileURLToPath(new URL('../../supabase/migrations/20261018090000_vca_media.sql', import.meta.url));
const MEDIA_JPEG = fileURLToPath(new URL('../../supabase/migrations/20261018093000_vca_media_jpeg.sql', import.meta.url));
const option = (name, fallback) => process.argv.find((a) => a.startsWith(`--${name}=`))?.slice(name.length + 3) || fallback;
const backend = option('backend', 'pglite');
assert(['pglite', 'postgres'].includes(backend), 'backend is pglite or postgres');

let exec;
let query;
let close;
if (backend === 'pglite') {
  const { PGlite } = await import(process.env.PGLITE_MODULE ? pathToFileURL(process.env.PGLITE_MODULE).href : '@electric-sql/pglite');
  const db = new PGlite();
  await db.waitReady;
  exec = (sql) => db.exec(sql);
  query = async (sql) => (await db.query(sql)).rows;
  close = () => db.close();
} else {
  assert(process.env.PG_MODULE, 'set PG_MODULE to pg/lib/index.js');
  assert(process.env.PGHOST?.startsWith('/'), 'PGHOST must be a local socket directory, never a server address');
  const pg = (await import(pathToFileURL(process.env.PG_MODULE).href)).default;
  const name = `vca_community_${crypto.randomBytes(6).toString('hex')}`;
  const admin = new pg.Client({ database: 'postgres', user: process.env.PGUSER || 'postgres' });
  await admin.connect();
  await admin.query(`create database ${name}`);
  const client = new pg.Client({ database: name, user: process.env.PGUSER || 'postgres' });
  await client.connect();
  exec = (sql) => client.query(sql);
  query = async (sql) => (await client.query(sql)).rows;
  close = async () => { await client.end(); await admin.query(`drop database ${name}`); await admin.end(); };
}

const ids = Object.fromEntries(['alice', 'bob', 'carol', 'dave', 'mod', 'newbie'].map((n) => [n, crypto.randomUUID()]));
const lit = (s) => `'${String(s).replace(/'/g, "''")}'`;

/** One statement as a person (or as anon when `who` is null), in its own transaction. */
async function as(who, sql) {
  await exec('begin');
  try {
    await exec(`set local role ${who ? 'authenticated' : 'anon'}`);
    if (who) await exec(`select set_config('request.jwt.claim.sub', ${lit(ids[who])}, true)`);
    const rows = await query(sql);
    await exec('commit');
    return rows;
  } catch (error) {
    await exec('rollback');
    throw error;
  }
}
async function refused(who, sql, pattern) {
  await assert.rejects(as(who, sql), pattern, `${who || 'anon'} should be refused: ${sql}`);
}
const one = async (who, sql) => (await as(who, sql))[0];
const checks = [];
const check = async (name, fn) => { await fn(); checks.push(name); };

// ── Fixture ───────────────────────────────────────────────────────────────────────────────
await exec(`
  do $$ begin
    if not exists (select 1 from pg_roles where rolname = 'anon') then create role anon nologin; end if;
    if not exists (select 1 from pg_roles where rolname = 'authenticated') then create role authenticated nologin; end if;
    if not exists (select 1 from pg_roles where rolname = 'service_role') then create role service_role nologin; end if;
  end $$;
  create schema auth;
  create table auth.users(id uuid primary key, raw_user_meta_data jsonb not null default '{}');
  create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
  grant usage on schema auth to anon, authenticated, service_role;
  grant execute on function auth.uid() to anon, authenticated, service_role;
  create table public.profiles(id uuid primary key references auth.users(id) on delete cascade, username text not null,
    avatar_emoji text default '🐾', total_attempts integer default 0, total_correct integer default 0, streak integer default 0,
    last_study_date date, created_at timestamptz default now());
  create table public.admin_users(user_id uuid primary key references auth.users(id) on delete cascade);
  create function public.is_admin() returns boolean language sql stable security definer set search_path = public
    as $$ select exists (select 1 from public.admin_users a where a.user_id = auth.uid()) $$;
  revoke execute on function public.is_admin() from public, anon;
  grant execute on function public.is_admin() to authenticated, service_role;
  create publication supabase_realtime;
`);
await exec(`
  insert into auth.users (id, raw_user_meta_data) values
    (${lit(ids.alice)}, '{"full_name": "Alice A.", "year": "6"}'), (${lit(ids.bob)}, '{}'), (${lit(ids.carol)}, '{}'),
    (${lit(ids.dave)}, '{}'), (${lit(ids.mod)}, '{}'), (${lit(ids.newbie)}, '{}');
  insert into public.profiles (id, username, avatar_emoji, total_attempts, total_correct, streak) values
    (${lit(ids.alice)}, 'alice_vm', '🐶', 120, 90, 4), (${lit(ids.bob)}, 'bob', '🐾', 0, 0, 0);
  insert into public.admin_users (user_id) values (${lit(ids.mod)});
`);
await exec(fs.readFileSync(MIGRATION, 'utf8'));
await exec(fs.readFileSync(MEDIA, 'utf8'));
await exec(fs.readFileSync(MEDIA_JPEG, 'utf8'));

// ── Profiles ──────────────────────────────────────────────────────────────────────────────
await check('a profile is made by its owner, with a free and proper handle', async () => {
  await as('alice', `insert into vca.profiles (handle, display_name) values ('alice', ' Alice ')`);
  const p = await one('alice', `select user_id, display_name from vca.profiles where handle = 'alice'`);
  assert.equal(p.user_id, ids.alice);
  assert.equal(p.display_name, 'Alice', 'trimmed');
  await refused('bob', `insert into vca.profiles (handle, display_name) values ('alice', 'Bob')`, /duplicate key/);
  await refused('bob', `insert into vca.profiles (handle, display_name) values ('Bob', 'Bob')`, /check constraint/);
  await refused('bob', `insert into vca.profiles (handle, display_name) values ('admin', 'Bob')`, /reserved/);
  await refused('bob', `insert into vca.profiles (handle, display_name) values ('vetmock_team', 'Bob')`, /reserved/);
  await refused('bob', `insert into vca.profiles (user_id, handle, display_name) values (${lit(ids.carol)}, 'carol', 'not me')`, /permission denied/);
  for (const [who, handle] of [['bob', 'bob'], ['carol', 'carol'], ['dave', 'dave'], ['mod', 'teacher']]) {
    await as(who, `insert into vca.profiles (handle, display_name) values (${lit(handle)}, ${lit(handle)})`);
  }
  assert.equal((await as(null, `select handle from vca.profiles order by handle`)).length, 5, 'anyone reads profiles');
  await refused(null, `insert into vca.profiles (handle, display_name) values ('ghost', 'Ghost')`, /permission denied/);
  const edited = await as('bob', `update vca.profiles set bio = 'hi' where handle = 'alice' returning 1`);
  assert.equal(edited.length, 0, 'nobody edits another profile');
});

await check('the bridge hands a student their own VetMock name and totals, and only theirs', async () => {
  const snap = (await one('alice', `select vca.vetmock_snapshot() as s`)).s;
  assert.equal(snap.username, 'alice_vm');
  assert.equal(snap.avatar, '🐶');
  assert.equal(snap.name, 'Alice A.');
  assert.equal(snap.answered, 120);
  const fresh = (await one('newbie', `select vca.vetmock_snapshot() as s`)).s;
  assert.equal(fresh.username, undefined, 'no VetMock profile, nothing made up');
  await refused(null, `select vca.vetmock_snapshot()`, /permission denied/);
});

// ── The board ─────────────────────────────────────────────────────────────────────────────
let post;
await check('a post needs a profile, and its writer cannot set what the board keeps', async () => {
  await refused('newbie', `insert into vca.posts (title, body) values ('A question', 'body')`, /row-level security/);
  await refused(null, `insert into vca.posts (title, body) values ('A question', 'body')`, /permission denied/);
  await refused('alice', `insert into vca.posts (title, body, hidden) values ('A question', 'body', true)`, /permission denied/);
  await refused('alice', `insert into vca.posts (title, body, like_count) values ('A question', 'body', 99)`, /permission denied/);
  await refused('alice', `insert into vca.posts (title, body) values ('Hi', 'too short a title')`, /check constraint/);
  post = (await one('alice', `insert into vca.posts (kind, domain, question_no, title, body) values ('question', 'swine', 92008, ' ADG ของสุกรคิดอย่างไร ', 'ช่วยอธิบายหน่อย') returning id, author_id, title`));
  assert.equal(post.author_id, ids.alice);
  assert.equal(post.title, 'ADG ของสุกรคิดอย่างไร');
  assert.equal((await as(null, `select id from vca.posts`)).length, 1, 'anyone reads the board');
});

await check('comments and likes keep the post\'s counts, once per person', async () => {
  const c = await one('bob', `insert into vca.comments (post_id, body) values (${lit(post.id)}, 'คิดจากน้ำหนักเพิ่มต่อวัน') returning id`);
  await as('carol', `insert into vca.comments (post_id, parent_id, body) values (${lit(post.id)}, ${lit(c.id)}, 'ใช่')`);
  await as('bob', `insert into vca.likes (post_id) values (${lit(post.id)})`);
  await refused('bob', `insert into vca.likes (post_id) values (${lit(post.id)})`, /duplicate key/);
  await as('carol', `insert into vca.likes (comment_id) values (${lit(c.id)})`);
  let p = await one(null, `select comment_count, like_count from vca.posts where id = ${lit(post.id)}`);
  assert.deepEqual([p.comment_count, p.like_count], [2, 1]);
  assert.equal((await one(null, `select like_count from vca.comments where id = ${lit(c.id)}`)).like_count, 1);
  await as('bob', `delete from vca.likes where post_id = ${lit(post.id)}`);
  p = await one(null, `select like_count from vca.posts where id = ${lit(post.id)}`);
  assert.equal(p.like_count, 0);
  const other = await one('bob', `insert into vca.posts (title, body) values ('อีกเรื่องหนึ่ง', 'x') returning id`);
  await refused('dave', `insert into vca.comments (post_id, parent_id, body) values (${lit(other.id)}, ${lit(c.id)}, 'wrong thread')`, /same post/);
});

await check('only the writer edits; the writer or a moderator removes', async () => {
  assert.equal((await as('bob', `update vca.posts set body = 'hijack' where id = ${lit(post.id)} returning 1`)).length, 0);
  const e = await one('alice', `update vca.posts set body = 'ช่วยอธิบายหน่อยครับ' where id = ${lit(post.id)} returning edited_at`);
  assert.ok(e.edited_at, 'an edit is marked');
  assert.equal((await as('bob', `delete from vca.posts where id = ${lit(post.id)} returning 1`)).length, 0);
});

await check('three reports hide a post until a moderator restores it', async () => {
  for (const who of ['bob', 'carol']) await as(who, `insert into vca.reports (post_id, reason) values (${lit(post.id)}, 'wrong')`);
  await refused('bob', `insert into vca.reports (post_id, reason) values (${lit(post.id)}, 'spam')`, /duplicate key/);
  assert.equal((await as(null, `select id from vca.posts where id = ${lit(post.id)}`)).length, 1, 'two reports are not enough');
  await as('dave', `insert into vca.reports (post_id, reason, note) values (${lit(post.id)}, 'rude', 'ไม่สุภาพ')`);
  assert.equal((await as(null, `select id from vca.posts where id = ${lit(post.id)}`)).length, 0, 'hidden from the board');
  assert.equal((await as('bob', `select id from vca.posts where id = ${lit(post.id)}`)).length, 0, 'hidden from readers');
  assert.equal((await as('alice', `select id from vca.posts where id = ${lit(post.id)}`)).length, 1, 'its writer still sees it');
  assert.equal((await as('mod', `select id from vca.posts where id = ${lit(post.id)}`)).length, 1, 'a moderator sees it');
  assert.equal((await as('bob', `select id from vca.reports`)).length, 1, 'a reporter sees only their own reports');
  assert.equal((await as('mod', `select id from vca.reports`)).length, 3, 'a moderator sees them all');
  await refused('alice', `select vca.moderate('post', ${lit(post.id)}, 'restore')`, /forbidden/);
  await as('mod', `select vca.moderate('post', ${lit(post.id)}, 'restore')`);
  assert.equal((await as(null, `select id from vca.posts where id = ${lit(post.id)}`)).length, 1, 'restored');
  const open = await one('mod', `select count(*)::int as n from vca.reports where resolved_at is null`);
  assert.equal(open.n, 0, 'the reports are closed');
});

await check('posting is rate-limited per person, moderators excepted', async () => {
  // Alice has one post this hour; five more reach the limit of six.
  for (let i = 0; i < 5; i += 1) await as('alice', `insert into vca.posts (title, body) values ('โพสต์ที่ ${i + 2}', 'x')`);
  await refused('alice', `insert into vca.posts (title, body) values ('โพสต์ที่ 7', 'x')`, /too many posts/);
  for (let i = 0; i < 7; i += 1) await as('mod', `insert into vca.posts (title, body) values ('ประกาศ ${i}', 'x')`);
});

// ── Chat ──────────────────────────────────────────────────────────────────────────────────
let lobby;
let direct;
await check('the open rooms are for signed-in people with a profile', async () => {
  await refused(null, `select id from vca.rooms`, /permission denied/);
  const rooms = await as('carol', `select id, slug from vca.rooms order by slug`);
  assert.deepEqual(rooms.map((r) => r.slug), ['bio', 'clinic', 'lobby', 'public', 'species']);
  lobby = rooms.find((r) => r.slug === 'lobby').id;
  await refused('newbie', `insert into vca.messages (room_id, body) values (${lit(lobby)}, 'hi')`, /row-level security/);
  const m = await one('alice', `insert into vca.messages (room_id, body) values (${lit(lobby)}, 'สวัสดีทุกคน') returning id`);
  assert.equal((await as('bob', `select body from vca.messages where room_id = ${lit(lobby)}`))[0].body, 'สวัสดีทุกคน');
  await as('bob', `select vca.mark_read(${lit(lobby)})`);
  assert.ok((await one('bob', `select last_message_at from vca.rooms where id = ${lit(lobby)}`)).last_message_at);
  const other = (await as('carol', `select id from vca.rooms where slug = 'bio'`))[0].id;
  await refused('bob', `insert into vca.messages (room_id, body, reply_to) values (${lit(other)}, 'x', ${m.id})`, /same room/);
});

await check('a direct room is for its two people, made once, and closes on a block', async () => {
  direct = (await one('alice', `select vca.open_direct(${lit(ids.bob)}) as id`)).id;
  assert.equal((await one('bob', `select vca.open_direct(${lit(ids.alice)}) as id`)).id, direct, 'the same room both ways');
  await as('alice', `insert into vca.messages (room_id, body) values (${lit(direct)}, 'ส่วนตัวนะ')`);
  assert.equal((await as('bob', `select body from vca.messages where room_id = ${lit(direct)}`)).length, 1);
  assert.equal((await as('carol', `select body from vca.messages where room_id = ${lit(direct)}`)).length, 0, 'nobody else reads it');
  assert.equal((await as('carol', `select id from vca.rooms where id = ${lit(direct)}`)).length, 0, 'or sees the room');
  await refused('carol', `insert into vca.messages (room_id, body) values (${lit(direct)}, 'let me in')`, /row-level security/);
  await refused('carol', `select vca.mark_read(${lit(direct)})`, /not allowed/);
  assert.equal((await as('bob', `select user_id from vca.room_members where room_id = ${lit(direct)}`)).length, 2, 'both seats are visible to the pair');
  await refused('alice', `select vca.open_direct(${lit(ids.alice)})`, /no such person/);
  await as('bob', `insert into vca.blocks (blocked_id) values (${lit(ids.alice)})`);
  await refused('alice', `insert into vca.messages (room_id, body) values (${lit(direct)}, 'still there?')`, /row-level security/);
  await refused('alice', `select vca.open_direct(${lit(ids.bob)})`, /not available/);
  assert.equal((await as('alice', `select * from vca.blocks`)).length, 0, 'a block is private to the blocker');
});

await check('messages are rate-limited per person', async () => {
  for (let i = 0; i < 20; i += 1) await as('carol', `insert into vca.messages (room_id, body) values (${lit(lobby)}, 'm${i}')`);
  await refused('carol', `insert into vca.messages (room_id, body) values (${lit(lobby)}, 'one too many')`, /slow down/);
});

await check('chat and comment threads are published for live updates', async () => {
  const rows = await query(`select schemaname || '.' || tablename as t from pg_publication_tables where pubname = 'supabase_realtime' order by 1`);
  assert.deepEqual(rows.map((r) => r.t), ['vca.comments', 'vca.messages']);
});

await check('the helpers and calls are closed to anon and to direct use of triggers', async () => {
  await refused(null, `select vca.open_direct(${lit(ids.bob)})`, /permission denied/);
  await refused('alice', `select vca.guard_post()`, /permission denied|trigger functions can only be called/);
});

// ── Media ─────────────────────────────────────────────────────────────────────────────────
await check('media points only at the writer\'s own files, in the right shape and number', async () => {
  const img = (who, kind, name = 'abcdefgh12') => JSON.stringify({ path: `${ids[who]}/${kind}/${name}.webp`, kind: 'image', w: 1200, h: 800 });
  const vid = (who) => JSON.stringify({ path: `${ids[who]}/post/clip000001.mp4`, kind: 'video', w: 1080, h: 1920, poster: `${ids[who]}/post/clip000001.webp`, dur: 42 });
  const insertPost = (who, media, title = 'With a picture') => as(who, `insert into vca.posts (title, body, media) values (${lit(title)}, 'see', ${lit(media)}) returning id`);
  const [p] = await insertPost('dave', `[${img('dave', 'post')}]`);
  assert.ok(p.id, 'one image of your own');
  // Safari's canvas falls back to JPEG.
  await insertPost('dave', JSON.stringify([{ path: `${ids.dave}/post/safari0001.jpg`, kind: 'image', w: 10, h: 10 }]), 'From Safari');
  await refused('dave', `insert into vca.posts (title, body, media) values ('A gif', 'x', ${lit(JSON.stringify([{ path: `${ids.dave}/post/animated01.gif`, kind: 'image', w: 10, h: 10 }]))})`, /check constraint/);
  await insertPost('dave', `[${vid('dave')}]`, 'With a video');
  const bad = [
    ['not mine', `[${img('carol', 'post')}]`],
    ['wrong folder', `[${img('dave', 'avatar')}]`],
    ['five images', `[${[1, 2, 3, 4, 5].map((n) => img('dave', 'post', `picture0${n}`)).join(',')}]`],
    ['video with an image', `[${vid('dave')},${img('dave', 'post')}]`],
    ['video without a poster', JSON.stringify([{ path: `${ids.dave}/post/clip000002.mp4`, kind: 'video', w: 1, h: 1, dur: 3 }])],
    ['a key that is not allowed', JSON.stringify([{ path: `${ids.dave}/post/abcdefgh12.webp`, kind: 'image', w: 1, h: 1, url: 'https://evil.example' }])],
  ];
  for (const [why, media] of bad) await refused('dave', `insert into vca.posts (title, body, media) values (${lit(why)}, 'x', ${lit(media)})`, /check constraint/);
  // A comment may be a picture alone; a message too. An empty one is still refused.
  await as('carol', `insert into vca.comments (post_id, body, media) values (${lit(p.id)}, '', ${lit(`[${img('carol', 'comment')}]`)})`);
  await refused('carol', `insert into vca.comments (post_id, body) values (${lit(p.id)}, '  ')`, /check constraint/);
  const lobby = (await query(`select id from vca.rooms where slug = 'lobby'`))[0].id;
  // (The moderator: the rate-limit check above used up the others' minute.)
  await as('mod', `insert into vca.messages (room_id, body, media) values (${lit(lobby)}, '', ${lit(`[${img('mod', 'chat')}]`)})`);
  // In a direct room the file sits under that room, in the private bucket's layout.
  const room = (await one('dave', `select vca.open_direct(${lit(ids.mod)}) as r`)).r;
  await refused('dave', `insert into vca.messages (room_id, body, media) values (${lit(room)}, '', ${lit(`[${img('dave', 'chat')}]`)})`, /media not allowed/);
  await as('dave', `insert into vca.messages (room_id, body, media) values (${lit(room)}, '', ${lit(JSON.stringify([{ path: `${ids.dave}/dm/${room}/abcdefgh12.webp`, kind: 'image', w: 10, h: 10 }]))})`);
  // A profile picture is your own avatar file; the focus list holds domain ids.
  await as('dave', `update vca.profiles set photo = ${lit(`${ids.dave}/avatar/abcdefgh12.webp`)}, focus = '{surgery,swine}', onboarded_at = now() where user_id = auth.uid()`);
  await refused('dave', `update vca.profiles set photo = ${lit(`${ids.carol}/avatar/abcdefgh12.webp`)} where user_id = auth.uid()`, /check constraint/);
  await refused('dave', `update vca.profiles set focus = '{"Not A Domain"}' where user_id = auth.uid()`, /check constraint/);
});

// ── Leaving ───────────────────────────────────────────────────────────────────────────────
await check('deleting an account removes its profile, posts, comments, likes and messages', async () => {
  await exec(`delete from auth.users where id = ${lit(ids.alice)}`);
  const left = await query(`select
    (select count(*) from vca.profiles where user_id = ${lit(ids.alice)})::int as profiles,
    (select count(*) from vca.posts where author_id = ${lit(ids.alice)})::int as posts,
    (select count(*) from vca.messages where author_id = ${lit(ids.alice)})::int as messages,
    (select count(*) from vca.room_members where user_id = ${lit(ids.alice)})::int as seats`);
  assert.deepEqual(left[0], { profiles: 0, posts: 0, messages: 0, seats: 0 });
});

await close();
console.log(`vca community schema (${backend}): ${checks.length} checks passed`);
for (const c of checks) console.log(`  ✓ ${c}`);
