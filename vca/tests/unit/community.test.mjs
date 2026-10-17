// The community's vocabulary (online/shapes.js), its addresses, and the demo backend that stands
// in for Supabase in development and the end-to-end tests: it must answer the way live.js does.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  HANDLE, handleProblem, suggestHandle, excerpt, ago, dayOf, groupMessages, statsFrom, problemText,
  toProfile, fromProfile, toPost, KIND_LABEL, OPEN_ROOMS, REPORT_REASONS, TONES,
} from '../../src/online/shapes.js';
import { parseRoute } from '../../src/router.js';

const NOW = new Date('2026-10-17T10:00:00+07:00').getTime();
const before = (ms) => new Date(NOW - ms).toISOString();

test('a handle is 3 to 20 of a-z, digits and _, and some names are kept back', () => {
  assert.equal(handleProblem('palm_vet'), null);
  assert.equal(handleProblem('a1'), 'อย่างน้อย 3 ตัว');
  assert.match(handleProblem('_palm'), /ขึ้นต้น/);
  assert.match(handleProblem('Palm'), /a-z/);
  assert.match(handleProblem('ploy.k'), /a-z/);
  assert.equal(handleProblem('x'.repeat(21)), 'ไม่เกิน 20 ตัว');
  for (const h of ['admin', 'vetmock', 'vetmock_team', 'admin2', 'new', 'support']) assert.equal(handleProblem(h), 'ชื่อนี้สงวนไว้', h);
  assert.equal(handleProblem(''), 'ตั้งชื่อผู้ใช้ก่อน');
  // The database holds the same rule (supabase/migrations/*_vca_community.sql).
  assert.equal(HANDLE.source, '^[a-z0-9][a-z0-9_]{2,19}$');
});

test('a suggested handle comes from the first seed that makes a usable one', () => {
  assert.equal(suggestHandle('มินตรา', 'mintra.k@example.com'), 'mintra_k');
  assert.equal(suggestHandle('Palm Vet'), 'palm_vet');
  assert.equal(suggestHandle('', 'admin@x.com', 'tanakorn'), 'tanakorn');
  assert.equal(suggestHandle('ab', ''), '');
  assert.ok(suggestHandle('a'.repeat(40)).length <= 20);
});

test('an excerpt keeps whole words and says when it stopped', () => {
  assert.equal(excerpt('สั้น ๆ'), 'สั้น ๆ');
  const long = `${'คำ '.repeat(80)}ท้าย`;
  const cut = excerpt(long, 50);
  assert.ok(cut.endsWith('…'));
  assert.ok(cut.length <= 51);
  assert.equal(excerpt('a\n\n  b'), 'a b');
});

test('when something happened reads the way a person says it', () => {
  assert.equal(ago(before(20 * 1000), NOW), 'เมื่อสักครู่');
  assert.equal(ago(before(5 * 60000), NOW), '5 นาทีที่แล้ว');
  assert.equal(ago(before(3 * 3600000), NOW), '3 ชั่วโมงที่แล้ว');
  assert.equal(ago(before(26 * 3600000), NOW), 'เมื่อวาน');
  assert.equal(ago(before(4 * 86400000), NOW), '4 วันที่แล้ว');
  assert.match(ago(before(40 * 86400000), NOW), /ก\.ย\.|ก.ย./);
  assert.equal(ago('not a date', NOW), '');
  assert.equal(dayOf(before(60000), NOW), 'วันนี้');
  assert.equal(dayOf(before(86400000), NOW), 'เมื่อวาน');
});

test('messages run together by author within five minutes, behind a divider per day', () => {
  const m = (id, authorId, msAgo) => ({ id, authorId, body: `m${id}`, createdAt: before(msAgo) });
  const groups = groupMessages([
    m(1, 'a', 2 * 86400000),
    m(2, 'a', 2 * 86400000 - 60000),
    m(3, 'b', 30 * 60000),
    m(4, 'b', 28 * 60000),
    m(5, 'b', 10 * 60000),
    m(6, 'a', 9 * 60000),
  ], NOW);
  const shape = groups.map((g) => (g.divider ? `|${g.divider}` : `${g.authorId}:${g.messages.map((x) => x.id).join(',')}`));
  assert.equal(shape[1], 'a:1,2');
  assert.deepEqual(shape.slice(2), ['|วันนี้', 'b:3,4', 'b:5', 'a:6']);
  assert.ok(shape[0].startsWith('|'));
  assert.equal(new Set(groups.map((g) => g.key)).size, groups.length, 'keys are unique');
});

test('stats shown on a profile come only from what the device counted', () => {
  assert.deepEqual(statsFrom({ seen: 200, correct: 150, streak: 4, mocks: 2 }), { answered: 200, accuracy: 75, streak: 4, mocks: 2 });
  assert.deepEqual(statsFrom(), { answered: 0, accuracy: null, streak: 0, mocks: 0 });
});

test('a backend error becomes something a student can act on', () => {
  assert.equal(problemText(new Error('too many comments; try again later')), 'ตอบถี่เกินไป พักสักครู่แล้วลองใหม่');
  assert.equal(problemText(new Error('too many messages; slow down')), 'ส่งข้อความถี่เกินไป รอสักครู่');
  assert.equal(problemText(new Error('duplicate key value violates unique constraint "profiles_handle_key"')), 'ชื่อผู้ใช้นี้มีคนใช้แล้ว');
  assert.equal(problemText(new TypeError('Failed to fetch')), 'เชื่อมต่อไม่ได้ ตรวจอินเทอร์เน็ตแล้วลองใหม่');
  assert.equal(problemText(Object.assign(new Error('x'), { code: '42501' })), 'เข้าสู่ระบบใหม่อีกครั้งแล้วลองใหม่');
  assert.equal(problemText(null), 'ทำรายการไม่สำเร็จ ลองอีกครั้ง');
});

test('rows become the shapes the pages read, and a profile form becomes its row', () => {
  const row = { user_id: 'u1', handle: 'palm_vet', display_name: 'ปาล์ม', avatar: '🐶', tone: 'nope', school: null, target_round: '2/2569', stats: null, from_vetmock: true, created_at: 't' };
  const p = toProfile(row);
  assert.equal(p.tone, 'verd', 'an unknown tone falls back');
  assert.deepEqual(p.stats, {});
  assert.equal(p.round, '2/2569');
  const back = fromProfile({ ...p, name: '  ปาล์ม  ', school: '  ', bio: '' });
  assert.equal(back.display_name, 'ปาล์ม');
  assert.equal(back.school, null);
  assert.equal(back.bio, null);
  assert.equal(back.target_round, '2/2569');
  assert.equal(toProfile(null), null);
  const post = toPost({ id: 'p', author_id: 'gone', author: null, kind: 'tip', title: 't', body: 'b', created_at: 'c' });
  assert.equal(post.author.name, 'ผู้ใช้', 'a post whose author left still reads');
  assert.equal(post.activeAt, 'c');
});

test('the vocabulary matches the database checks', () => {
  assert.deepEqual(Object.keys(KIND_LABEL), ['question', 'tip', 'experience', 'general']);
  assert.deepEqual(REPORT_REASONS.map((r) => r.id), ['spam', 'rude', 'wrong', 'leak', 'other']);
  assert.deepEqual(TONES, ['verd', 'brass', 'cinn', 'cobalt', 'plum', 'ink']);
  assert.deepEqual(OPEN_ROOMS.map((r) => r.slug), ['lobby', 'bio', 'species', 'clinic', 'public']);
});

test('the community has its own addresses', () => {
  assert.equal(parseRoute('/community').name, 'community');
  assert.equal(parseRoute('/community/new').name, 'compose');
  const id = '3f1c2a9e-5b7d-4c1e-9a0b-1234567890ab';
  assert.deepEqual(parseRoute(`/community/p/${id}`), { name: 'post', params: { id }, query: new URLSearchParams() });
  assert.deepEqual(parseRoute(`/community/p/${id}/edit`).params, { id });
  assert.equal(parseRoute(`/community/p/${id}/edit`).name, 'compose');
  assert.deepEqual(parseRoute('/chat/lobby').params, { room: 'lobby' });
  assert.equal(parseRoute('/chat').name, 'chat');
  assert.deepEqual(parseRoute('/u/palm_vet').params, { handle: 'palm_vet' });
  assert.equal(parseRoute('/u/Palm').name, 'notFound');
  assert.equal(parseRoute('/me').name, 'profile');
  assert.deepEqual(parseRoute('/auth/callback').params, { via: 'callback' });
  assert.deepEqual(parseRoute('/auth/line').params, { via: 'line' });
  assert.equal(parseRoute('/auth/other').name, 'notFound');
});

test('the demo backend answers the way the live one does', async () => {
  const b = await import('../../src/online/demo.js');
  assert.deepEqual(Object.keys(b).sort(), ['auth', 'board', 'chat', 'media', 'profiles', 'safety']);
  const live = await import('../../src/online/live.js');
  for (const part of ['auth', 'profiles', 'board', 'chat', 'safety', 'media']) {
    assert.deepEqual(Object.keys(b[part]).sort(), Object.keys(live[part]).sort(), `${part} offers the same calls`);
  }

  assert.equal(await b.auth.session(), null);
  const seen = [];
  const stop = b.auth.onChange((s) => seen.push(!!s));
  await b.auth.google();
  assert.deepEqual(seen, [true]);
  stop();
  assert.equal(await b.profiles.mine(), null, 'a first sign-in has no profile');
  await assert.rejects(b.board.create({ kind: 'tip', title: 'ไม่มีโปรไฟล์', body: 'x' }), /โปรไฟล์/);

  assert.equal(await b.profiles.taken('mintra_vet'), true);
  const me = await b.profiles.save({ name: 'ปาล์ม', handle: 'palm_vet', avatar: '🐶', tone: 'verd', stats: {} }, { create: true });
  assert.equal(me.handle, 'palm_vet');
  await assert.rejects(b.profiles.save({ ...me, handle: 'mintra_vet' }, { create: false }), /มีคนใช้แล้ว/);

  const post = await b.board.create({ kind: 'question', domain: 'ruminant', questionNo: '1234', title: 'ข้อนี้ตอบอะไร', body: 'ช่วยด้วย' });
  assert.equal(post.questionNo, 1234);
  const { posts } = await b.board.list({ questionNo: 1234 });
  assert.deepEqual(posts.map((p) => p.id), [post.id]);
  const first = (await b.board.list()).posts[0];
  assert.equal(first.id, post.id, 'the newest activity leads');

  let heard = 0;
  const unwatch = b.board.watchComments(post.id, () => { heard += 1; });
  const c = await b.board.comment(post.id, 'ตอบเอง');
  assert.equal(heard, 1, 'a reply reaches whoever watches the thread');
  unwatch();
  assert.equal((await b.board.get(post.id)).comments, 1);
  await b.board.like('comment', c.id, true);
  await b.board.like('comment', c.id, true);
  assert.equal((await b.board.comments(post.id))[0].likes, 1, 'a second like by the same person counts once');
  assert.deepEqual([...await b.board.myLikes({ comments: [c.id] })], [c.id]);

  const rooms = await b.chat.rooms();
  const lobby = rooms.find((r) => r.slug === 'lobby');
  assert.ok(lobby && lobby.kind === 'open');
  const events = [];
  const quiet = b.chat.watch(lobby.id, (e) => events.push(e.type));
  const msg = await b.chat.send(lobby.id, 'สวัสดี');
  await b.chat.remove(msg.id);
  quiet();
  assert.deepEqual(events, ['insert', 'delete']);
  const older = await b.chat.messages(lobby.id, { before: 3, limit: 50 });
  assert.ok(older.every((m) => m.id < 3));

  const dm = await b.chat.openDirect('a1');
  assert.equal(await b.chat.openDirect('a1'), dm, 'one conversation per pair');
  assert.ok((await b.chat.rooms()).some((r) => r.id === dm && r.other?.handle === 'mintra_vet'));
  await b.safety.block('a1');
  assert.ok((await b.safety.blocked()).has('a1'));
  await b.safety.unblock('a1');
  assert.equal((await b.safety.blocked()).size, 0);

  await b.auth.signOut();
  assert.equal(await b.auth.session(), null);
});

test('media on a row: only well-formed items reach the page, and go back as the database stores them', async () => {
  const { toMedia, fromMedia } = await import('../../src/online/shapes.js');
  const raw = [
    { path: 'u/post/abcdefgh12.webp', kind: 'image', w: 1200, h: 800 },
    { path: 'u/post/clip0001.mp4', kind: 'video', w: 1080, h: 1920, poster: 'u/post/clip0001.webp', dur: 42.37 },
    { path: 'u/post/x.gif', kind: 'gif', w: 1, h: 1 },
    null,
    { kind: 'image', w: 1, h: 1 },
  ];
  const m = toMedia(raw);
  assert.equal(m.length, 2);
  assert.equal(toMedia('nope').length, 0);
  const back = fromMedia(m);
  assert.deepEqual(back[0], { path: 'u/post/abcdefgh12.webp', kind: 'image', w: 1200, h: 800 });
  assert.equal(back[1].dur, 42.4);
  assert.equal(back[1].poster, 'u/post/clip0001.webp');
});
