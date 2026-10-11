// ============================================================
// qcomments-admin-delete — the back-office may remove a comment, honestly
// ============================================================
// OV-critic-4. q_comments allowed delete of one's own rows only, so no one
// could take down a comment that should not stay. Migration
// 20261011120400_q_comments_admin_delete lets is_admin() delete any row.
// The thread shows the delete control to the admin, and because
// deleteQComment reports no error when RLS deleted nothing, a row leaves the
// screen only on the realtime DELETE event or a read-back that no longer
// holds it. A delete the database refused stays visible and says so.
//
// COPY-08: the guest's button and placeholder say เข้าสู่ระบบ, not Login.
// ============================================================

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { loadModule, mount, settle, findAll, textOf } from '../helpers/fake-react.mjs';

const source = readFileSync(new URL('../../src/components/QComments.jsx', import.meta.url), 'utf8');

// The thread re-reads on visibilitychange, so its effect listens on document;
// node has none. Each test file runs in its own process, so this stays local.
globalThis.document ??= Object.assign(new EventTarget(), { visibilityState: 'visible' });

const stubs = [
  { match: 'lib/supabase\\.js$', contents: 'export const hasSupabase = true; export const getSupabase = async () => null;' },
  { match: 'lib/api\\.js$', contents: `
    export const listQComments = (...a) => globalThis.__qc.list(...a);
    export const postQComment = async () => { throw new Error('not in this test'); };
    export const deleteQComment = (...a) => globalThis.__qc.del(...a);
    export const updateQComment = async () => {};
    export const subscribeQComments = async (s, q, onEvent) => { globalThis.__qc.onEvent = onEvent; return { unsubscribe() {} }; };` },
  { match: 'lib/dialog\\.js$', contents: 'export const confirmDialog = async () => true;' },
  { match: 'lib/admin-api\\.js$', contents: 'export const checkIsAdmin = async () => globalThis.__qc.admin;' },
];
const { default: QComments } = await loadModule('src/components/QComments.jsx', { stubs });

const ME = 'me-1111', BEE = 'bee-2222';
const row = (id, user_id, body) => ({ id, user_id, body, created_at: '2026-10-11T10:00:00Z', profiles: { username: user_id === ME ? 'palm' : 'bee', avatar_emoji: '🐾' } });
const deleteButtons = (tree) => findAll(tree, (n) => n.type === 'button' && n.props['aria-label'] === 'ลบความคิดเห็น');

function thread({ admin, rows }) {
  const state = { admin, rows: rows.slice(), deleted: [] };
  globalThis.__qc = {
    admin,
    list: async () => state.rows.slice(),
    del: async (id) => { state.deleted.push(id); },
    onEvent: null,
  };
  const panel = mount(QComments, { qSubject: 'com5', qId: 42, user: { id: ME }, setView() {} });
  return { state, panel };
}

test('a student sees delete on their own comment only; the admin sees it on every comment', async (t) => {
  const student = thread({ admin: false, rows: [row('c1', ME, 'mine'), row('c2', BEE, 'bee')] });
  t.after(() => student.panel.unmount());
  await settle(student.panel);
  assert.equal(deleteButtons(student.panel.tree).length, 1, 'own comment only');

  const admin = thread({ admin: true, rows: [row('c1', ME, 'mine'), row('c2', BEE, 'bee')] });
  t.after(() => admin.panel.unmount());
  await settle(admin.panel);
  assert.equal(deleteButtons(admin.panel.tree).length, 2, 'the admin may remove a classmate\'s comment');
});

test('a delete the database refused keeps the row on screen and says so', async (t) => {
  const { state, panel } = thread({ admin: true, rows: [row('c1', ME, 'mine'), row('c2', BEE, 'bee')] });
  t.after(() => panel.unmount());
  await settle(panel);
  const [, beeDelete] = deleteButtons(panel.tree);
  // RLS deleted 0 rows: the read-back still holds c2.
  await beeDelete.props.onClick();
  await settle(panel);
  assert.deepEqual(state.deleted, ['c2']);
  const shown = textOf(panel.tree);
  assert.ok(shown.includes('bee'), 'the comment the server kept is still shown');
  assert.match(shown, /ลบไม่สำเร็จ ความเห็นนี้ยังอยู่/);
});

test('the row leaves the screen on the read-back that no longer holds it, or on the realtime DELETE event', async (t) => {
  const readBack = thread({ admin: true, rows: [row('c1', ME, 'mine'), row('c2', BEE, 'bee')] });
  t.after(() => readBack.panel.unmount());
  await settle(readBack.panel);
  readBack.state.rows = readBack.state.rows.filter((c) => c.id !== 'c2'); // the server deleted it
  await deleteButtons(readBack.panel.tree)[1].props.onClick();
  await settle(readBack.panel);
  assert.ok(!textOf(readBack.panel.tree).includes('bee'), 'gone after the read-back');
  assert.doesNotMatch(textOf(readBack.panel.tree), /ลบไม่สำเร็จ/);

  const event = thread({ admin: true, rows: [row('c1', ME, 'mine'), row('c2', BEE, 'bee')] });
  t.after(() => event.panel.unmount());
  await settle(event.panel);
  globalThis.__qc.list = () => new Promise(() => {}); // the read-back never answers
  const click = deleteButtons(event.panel.tree)[1].props.onClick();
  await settle(event.panel);
  assert.ok(textOf(event.panel.tree).includes('bee'), 'nothing is removed on the client\'s own say-so');
  globalThis.__qc.onEvent({ eventType: 'DELETE', old: { id: 'c2' } });
  await settle(event.panel);
  assert.ok(!textOf(event.panel.tree).includes('bee'), 'the realtime DELETE event removes it');
  void click;
});

test('the source removes a comment only through the realtime event or a read-back', () => {
  assert.doesNotMatch(source, /await deleteQComment\(id\);\s*setComments\(\(prev\) => prev\.filter/, 'no optimistic removal after delete');
  assert.match(source, /rows = await listQComments\(qSubject, qId\)/);
  assert.match(source, /\(mine \|\| isAdmin\) &&/);
});

test('a guest is asked to เข้าสู่ระบบ, not to Login', async (t) => {
  globalThis.__qc = { admin: false, list: async () => [], del: async () => {}, onEvent: null };
  const panel = mount(QComments, { qSubject: 'com5', qId: 42, user: null, setView() {} });
  t.after(() => panel.unmount());
  await settle(panel);
  const shown = textOf(panel.tree);
  assert.match(shown, /เข้าสู่ระบบ/);
  assert.doesNotMatch(shown, /\bLogin\b/);
  const [textarea] = findAll(panel.tree, (n) => n.type === 'textarea');
  assert.doesNotMatch(textarea.props.placeholder, /login/i);
  assert.doesNotMatch(textarea.props.placeholder, /·|—/, 'plain Thai, no separators');
});
