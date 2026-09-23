// ============================================================
// group-account-switch.test.mjs — what reaches the group pages, and whose
// ============================================================
// Two defects on the same two views, tested through the same harness.
//
// PF-20. A group page loaded its three sections (members, shared questions,
// the board) with one Promise.allSettled and cleared its spinner only when
// all three had settled, so the tab on screen waited for the slowest hidden
// request. A failed section was also only a banner: its own tab then drew an
// empty list, as though the group had no members or nobody had scored.
// Each section now paints when its own request lands, and a failed one says
// so in its own tab.
//
// DA-01. GroupsView loaded once, on mount, and GroupDetailView followed only
// the group id. When the session switched straight from account A to
// account B (B's email link opened in the same browser while A's list was on
// screen), the page kept showing A's groups and invite codes under B, and
// never asked for B's.
//
// The views are driven through their real source: JSX compiled with the
// esbuild Vite ships, the module's imports swapped for fakes the test
// controls, and React's hooks for a small deterministic harness.
// ============================================================

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const { transformWithEsbuild } = await import('vite');

// ── Harness ────────────────────────────────────────────────────────────────
const h = (type, props, ...children) => ({ type, props: props || {}, children: children.flat(Infinity) });

async function loadView(file, deps) {
  const src = readFileSync(resolve(process.cwd(), file), 'utf8');
  const name = src.match(/export default function (\w+)/)[1];
  const body = src.replace(/^import[^\n]*\n/gm, '').replace('export default function ', 'function ');
  const { code } = await transformWithEsbuild(body, file, {
    loader: 'jsx', jsx: 'transform', jsxFactory: 'h', jsxFragment: 'Fragment',
  });
  const imported = [...src.matchAll(/^import\s+(?:(\w+)|\{([^}]+)\})\s+from\s+'[^']+';$/gm)]
    .flatMap(([, def, named]) => (def ? [def] : named.split(',').map((n) => n.trim()).filter(Boolean)));
  return (hooks) => {
    const scope = { h, Fragment: 'Fragment' };
    for (const n of imported) {
      scope[n] = n in hooks ? hooks[n]
        : n in deps ? deps[n]
          : /^[A-Z]/.test(n) ? n
            : () => { throw new Error(`the test did not expect ${n}()`); };
    }
    return new Function(...Object.keys(scope), `${code}\nreturn ${name};`)(...Object.values(scope));
  };
}

function mount(make, props) {
  const slots = [];
  const effects = [];
  let cursor = 0;
  let effectCursor = 0;
  let dirty = false;
  const queued = [];
  const hooks = {
    useState(init) {
      const i = cursor++;
      if (!(i in slots)) slots[i] = typeof init === 'function' ? init() : init;
      return [slots[i], (v) => {
        const next = typeof v === 'function' ? v(slots[i]) : v;
        if (!Object.is(next, slots[i])) { slots[i] = next; dirty = true; }
      }];
    },
    useRef(init) {
      const i = cursor++;
      if (!(i in slots)) slots[i] = { current: init };
      return slots[i];
    },
    useEffect(fn, deps) {
      const i = effectCursor++;
      const prev = effects[i];
      if (!prev || !deps || deps.some((d, n) => !Object.is(d, prev.deps[n]))) queued.push({ i, fn, deps });
    },
  };
  const Component = make(hooks);
  const view = {
    props,
    tree: null,
    // Every tree this mount ever produced, so a test can ask whether some
    // frame, not only the last one, showed something it should not have.
    frames: [],
    render(next = view.props) {
      view.props = next;
      let guard = 0;
      do {
        if (++guard > 20) throw new Error('render loop');
        cursor = 0; effectCursor = 0; dirty = false;
        view.tree = Component(view.props);
        view.frames.push(view.tree);
        for (const e of queued.splice(0)) {
          effects[e.i]?.cleanup?.();
          const cleanup = e.fn();
          effects[e.i] = { deps: e.deps, cleanup: typeof cleanup === 'function' ? cleanup : null };
        }
      } while (dirty);
      return view;
    },
    async settle() {
      for (let quiet = 0, n = 0; n < 100 && quiet < 4; n++) {
        await new Promise((r) => setImmediate(r));
        if (dirty) { quiet = 0; view.render(); } else quiet++;
      }
      return view;
    },
  };
  return view.render(props);
}

const textOf = (node) => (node == null || typeof node === 'boolean' ? ''
  : typeof node !== 'object' ? String(node)
    : Array.isArray(node) ? node.map(textOf).join('')
      : textOf(node.children));
function findAll(node, pred, out = []) {
  if (!node || typeof node !== 'object') return out;
  if (Array.isArray(node)) { for (const n of node) findAll(n, pred, out); return out; }
  if (pred(node)) out.push(node);
  return findAll(node.children, pred, out);
}
const find = (node, pred) => findAll(node, pred)[0] || null;
const panel = (tree, kind) => find(tree, (n) => n.type === 'StatePanel' && n.props.kind === kind);

function deferred() {
  let resolve, reject;
  const promise = new Promise((res, rej) => { resolve = res; reject = rej; });
  return { promise, resolve, reject };
}

// ── Group detail ──────────────────────────────────────────────────────────
const GROUP = { id: 'g-A', name: 'A study group', code: 'AAAAAA', openedBy: 'A' };
const BOARD = [{ id: 'r1', user_id: 'A', profiles: { username: 'palm' }, mode: 'exam', subject: null, pct: 90, correct: 45, total: 50 }];
const MEMBERS = [{ id: 'A', username: 'palm', role: 'admin' }, { id: 'M2', username: 'friend', role: 'member' }];
const QUESTIONS = [{ id: 'q1', author_id: 'M2', author_name: 'friend', data: { subject: 'com5', q: 'Which drug?', tags: [] } }];

async function detailView({ members, questions, board, props = {}, deps = {} } = {}) {
  const calls = { members: 0, questions: 0, board: 0, deleted: [] };
  const answer = (spec, fallback) => (typeof spec === 'function' ? spec() : Promise.resolve(spec ?? fallback));
  const make = await loadView('src/views/GroupDetailView.jsx', {
    getGroupMembers: () => { calls.members++; return answer(members, MEMBERS); },
    getSharedQuestions: () => { calls.questions++; return answer(questions, QUESTIONS); },
    getLeaderboard: () => { calls.board++; return answer(board, BOARD); },
    deleteSharedQuestion: async (id) => { calls.deleted.push(id); },
    qualifiesForLeaderboard: () => true,
    copyText: async () => ({ ok: true }),
    SUBJECTS: [{ id: 'com5', name: 'Companion V' }],
    confirmDialog: async () => true,
    alertDialog: () => {},
    thaiError: (e, fallback) => e?.message || fallback,
    ...deps,
  });
  const view = mount(make, { group: GROUP, user: { id: 'A' }, goBack() {}, ...props });
  await view.settle();
  return { view, calls };
}

const tabButton = (tree, label) => find(tree, (n) => n.type === 'button' && textOf(n).startsWith(label));
function openTab(view, label) {
  tabButton(view.tree, label).props.onClick();
  return view.render();
}

test('PF-20: the tab on screen paints when ITS request lands, not the slowest hidden one', async () => {
  const slowMembers = deferred();
  const { view } = await detailView({ members: () => slowMembers.promise });
  // The board (the default tab) has answered; the members request has not.
  assert.equal(panel(view.tree, 'loading'), null, 'the board must not wait behind the members list');
  assert.match(textOf(view.tree), /palm/, 'the board row is on screen');
  assert.match(textOf(view.tree), /90%/);
  openTab(view, '👤 Members');
  assert.ok(panel(view.tree, 'loading'), 'the members tab is still loading, and says so');
  slowMembers.resolve(MEMBERS);
  await view.settle();
  assert.equal(panel(view.tree, 'loading'), null);
  assert.match(textOf(view.tree), /friend/);
});

test('PF-20: a failed hidden section leaves the tab on screen and says so; its own tab shows the failure', async () => {
  let failMembers = true;
  const { view, calls } = await detailView({
    members: () => (failMembers ? Promise.reject(new Error('โหลดรายชื่อไม่ได้')) : Promise.resolve(MEMBERS)),
  });
  assert.match(textOf(view.tree), /90%/, 'the board that loaded stays on screen');
  assert.match(textOf(view.tree), /บางส่วนของกลุ่มโหลดไม่สำเร็จ/, 'a hidden failure is announced');
  openTab(view, '👤 Members');
  const error = panel(view.tree, 'error');
  assert.ok(error, 'the members tab must not pass off a failed load as an empty group');
  assert.equal(findAll(view.tree, (n) => n.props.className === 'vmx-dash-card').length, 0);
  failMembers = false;
  const before = { ...calls };
  error.props.onAction();
  await view.settle();
  assert.equal(calls.members, before.members + 1, 'retry asks for the members again');
  assert.equal(calls.board, before.board, 'and does not reload what was already fine');
  assert.equal(panel(view.tree, 'error'), null);
  assert.match(textOf(view.tree), /friend/);
  assert.doesNotMatch(textOf(view.tree), /บางส่วนของกลุ่มโหลดไม่สำเร็จ/, 'the banner goes once nothing is failing');
});

test('PF-20: a failed board is an error, not "nobody has scored yet"', async () => {
  const { view } = await detailView({ board: () => Promise.reject(new Error('offline')) });
  assert.ok(panel(view.tree, 'error'), 'the active tab failed, so it shows its own error panel');
  assert.doesNotMatch(textOf(view.tree), /ยังไม่มีใครทำข้อสอบในกลุ่มนี้/);
});

test('PF-20: tab switching and deleting a shared question still work', async () => {
  let rows = [...QUESTIONS, { id: 'q2', author_id: 'A', author_name: 'palm', data: { subject: 'com5', q: 'Mine to delete', tags: ['x'] } }];
  const { view, calls } = await detailView({ questions: () => Promise.resolve(rows) });
  openTab(view, 'Shared Q');
  assert.match(textOf(view.tree), /Which drug\?/);
  assert.match(textOf(view.tree), /Mine to delete/);
  const del = find(view.tree, (n) => n.type === 'button' && textOf(n) === '🗑');
  rows = rows.filter((q) => q.id !== 'q2');
  await del.props.onClick();
  await view.settle();
  assert.deepEqual(calls.deleted, ['q2']);
  assert.doesNotMatch(textOf(view.tree), /Mine to delete/, 'the deleted row leaves the list');
  openTab(view, 'อันดับคะแนน');
  assert.match(textOf(view.tree), /90%/);
});

test('PF-20: an answer from a superseded load cannot overwrite a newer one', async () => {
  const first = deferred();
  const second = deferred();
  const queue = [first, second];
  const mine = { id: 'q2', author_id: 'A', author_name: 'palm', data: { subject: 'com5', q: 'Mine', tags: [] } };
  const { view } = await detailView({ board: () => queue.shift().promise, questions: [mine] });
  // The board's first request is slow. Meanwhile the student deletes a shared
  // question, which reloads the page and asks for the board again.
  openTab(view, 'Shared Q');
  const deleting = find(view.tree, (n) => n.type === 'button' && textOf(n) === '🗑').props.onClick();
  second.resolve([{ ...BOARD[0], pct: 70 }]);
  await deleting;
  await view.settle();
  first.resolve([{ ...BOARD[0], pct: 10 }]); // the old answer lands last
  await view.settle();
  openTab(view, 'อันดับคะแนน');
  assert.match(textOf(view.tree), /70%/, 'the newer answer stays');
  assert.doesNotMatch(textOf(view.tree), /10%/, 'the stale answer must not replace it');
});

// ── DA-01: a direct switch from account A to account B ────────────────────
const A_GROUP = { id: 'g-A', name: 'A-only group', code: 'AAAAAA', role: 'admin' };
const B_GROUP = { id: 'g-B', name: 'B group', code: 'BBBBBB', role: 'member' };
const leaksA = (tree) => /A-only group|AAAAAA/.test(JSON.stringify(tree));

async function groupsView({ getMyGroups, deps = {}, props = {} } = {}) {
  const calls = { load: [], opened: [], alerts: [] };
  const make = await loadView('src/views/GroupsView.jsx', {
    getMyGroups: (id) => { calls.load.push(id); return getMyGroups ? getMyGroups(id) : Promise.resolve(id === 'A' ? [A_GROUP] : [B_GROUP]); },
    createGroup: async (name) => ({ id: 'g-new', name, code: 'NEWNEW' }),
    joinGroupByCode: async () => ({}),
    leaveGroup: async () => {},
    thaiError: (e, fallback) => e?.message || fallback,
    confirmDialog: async () => true,
    alertDialog: (msg) => { calls.alerts.push(msg); },
    EMPTY_ART: { groups: '' },
    ...deps,
  });
  const view = mount(make, {
    user: { id: 'A' }, goHome() {}, setView() {}, setActiveGroup: (g) => calls.opened.push(g), ...props,
  });
  await view.settle();
  return { view, calls };
}

test('DA-01: the group list reloads for account B and never shows A\'s groups under B', async () => {
  const { view, calls } = await groupsView();
  assert.ok(leaksA(view.tree), 'precondition: A sees A\'s group');
  const from = view.frames.length;
  view.render({ ...view.props, user: { id: 'B' } });
  await view.settle();
  assert.deepEqual(calls.load, ['A', 'B'], 'B\'s groups must be asked for');
  assert.ok(!view.frames.slice(from).some(leaksA), 'no frame under B may carry A\'s group or invite code');
  assert.match(textOf(view.tree), /B group/);
});

test('DA-01: A\'s answer that lands after the switch is dropped', async () => {
  const slowA = deferred();
  const { view } = await groupsView({ getMyGroups: (id) => (id === 'A' ? slowA.promise : Promise.resolve([B_GROUP])) });
  const from = view.frames.length;
  view.render({ ...view.props, user: { id: 'B' } });
  await view.settle();
  slowA.resolve([A_GROUP]);
  await view.settle();
  assert.ok(!view.frames.slice(from).some(leaksA), 'A\'s late list must not replace B\'s');
  assert.match(textOf(view.tree), /B group/);
});

test('DA-01: a create still out when the account switches is not added to B\'s list', async () => {
  const created = deferred();
  const { view, calls } = await groupsView({ deps: { createGroup: () => created.promise } });
  find(view.tree, (n) => n.type === 'button' && textOf(n) === 'สร้างกลุ่ม').props.onClick();
  view.render();
  find(view.tree, (n) => n.props.id === 'vmx-group-name').props.onChange({ target: { value: 'A new one' } });
  view.render();
  const run = find(view.tree, (n) => n.type === 'form').props.onSubmit({ preventDefault() {} });
  view.render({ ...view.props, user: { id: 'B' } });
  await view.settle();
  created.resolve({ id: 'g-A2', name: 'A new one', code: 'AAAAAA' });
  await run;
  await view.settle();
  assert.doesNotMatch(textOf(view.tree), /A new one/, 'A\'s new group is not B\'s');
  assert.ok(!calls.alerts.some((m) => m.includes('AAAAAA')), 'A\'s new invite code is not announced to B');
});

test('DA-01: a group opened from the list remembers which account opened it', async () => {
  const { view, calls } = await groupsView();
  find(view.tree, (n) => n.type === 'button' && textOf(n) === 'เปิด →').props.onClick();
  assert.equal(calls.opened[0].id, 'g-A');
  assert.equal(calls.opened[0].openedBy, 'A');
});

test('DA-01: a group page opened by A is left, not drawn, once the session is B', async () => {
  let back = 0;
  const { view, calls } = await detailView({ props: { goBack: () => { back++; } } });
  assert.match(JSON.stringify(view.tree), /AAAAAA/, 'precondition: A sees the invite code');
  const before = { ...calls };
  const from = view.frames.length;
  view.render({ ...view.props, user: { id: 'B' } });
  await view.settle();
  assert.equal(back, 1, 'the page returns to the group list, which loads B\'s groups');
  assert.ok(!view.frames.slice(from).some((t) => /AAAAAA|A study group/.test(JSON.stringify(t))),
    'A\'s group name and invite code never appear under B');
  assert.deepEqual({ ...calls }, before, 'nothing of A\'s group is fetched under B');
});

test('DA-01: A\'s group reopened for B after a sign-out in between is not drawn either', async () => {
  // A signs out in another tab (the page shows the sign-in prompt), then B
  // signs in: App mounts the page afresh with the group A had open.
  let back = 0;
  const { view, calls } = await detailView({ props: { user: { id: 'B' }, goBack: () => { back++; } } });
  assert.equal(back, 1);
  assert.ok(!view.frames.some((t) => /AAAAAA|A study group/.test(JSON.stringify(t))));
  assert.deepEqual([calls.members, calls.questions, calls.board], [0, 0, 0]);
});
