// ============================================================
// group-create-guard.test.mjs — one tap, one group
// ============================================================
// GroupsView's create form had no in-flight guard. A double tap on สร้าง, or
// Enter followed by a click, ran handleCreate twice before the first request
// came back: create_study_group minted two groups with the same name and two
// invite codes, and the list showed only the second, because each handler
// appended to the array its own render had captured. The student found the
// other group only after a reload. Join had the same gap.
//
// These tests drive the real component source. JSX is compiled with the
// esbuild that Vite already ships, the module's imports are replaced by fakes
// the test controls, and React's hooks by a small deterministic harness, so
// the handlers under test are exactly the ones a student's tap runs.
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
    render(next = view.props) {
      view.props = next;
      let guard = 0;
      do {
        if (++guard > 20) throw new Error('render loop');
        cursor = 0; effectCursor = 0; dirty = false;
        view.tree = Component(view.props);
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
const button = (tree, label) => find(tree, (n) => n.type === 'button' && textOf(n).trim() === label);

function deferred() {
  let resolve, reject;
  const promise = new Promise((res, rej) => { resolve = res; reject = rej; });
  return { promise, resolve, reject };
}

// ── The view ──────────────────────────────────────────────────────────────
async function groupsView(overrides = {}) {
  const calls = { create: [], join: [], load: [] };
  const deps = {
    getMyGroups: async (id) => { calls.load.push(id); return []; },
    createGroup: async (name) => { calls.create.push(name); return { id: 'g1', name, code: 'AAAAAA' }; },
    joinGroupByCode: async (code) => { calls.join.push(code); return { id: 'gj', name: 'joined', code }; },
    leaveGroup: async () => {},
    thaiError: (e, fallback) => e?.message || fallback,
    confirmDialog: async () => true,
    alertDialog: () => {},
    EMPTY_ART: { groups: '' },
    ...overrides.deps,
  };
  const make = await loadView('src/views/GroupsView.jsx', deps);
  const view = mount(make, { user: { id: 'A' }, goHome() {}, setView() {}, setActiveGroup() {}, ...overrides.props });
  await view.settle();
  return { view, calls };
}

function openCreate(view, name = 'Vet 86 Final') {
  button(view.tree, 'สร้างกลุ่ม').props.onClick();
  view.render();
  find(view.tree, (n) => n.props.id === 'vmx-group-name').props.onChange({ target: { value: name } });
  view.render();
  return find(view.tree, (n) => n.type === 'form');
}

const submit = (form) => form.props.onSubmit({ preventDefault() {} });
const rowNames = (view) => findAll(view.tree, (n) => n.type === 'h3').map(textOf);

test('two submits before the first answer send ONE create', async () => {
  const pending = [];
  const { view, calls } = await groupsView({
    deps: { createGroup: (name) => { calls.create.push(name); const d = deferred(); pending.push(d); return d.promise; } },
  });
  const form = openCreate(view);
  // A double tap, or Enter and then a click: the same form, submitted twice
  // from the same render before anything has come back.
  const a = submit(form);
  const b = submit(form);
  assert.equal(calls.create.length, 1, 'the second submit must not mint a second group');
  pending[0].resolve({ id: 'g1', name: 'Vet 86 Final', code: 'AAAAAA' });
  await Promise.all([a, b]);
  await view.settle();
  assert.deepEqual(rowNames(view), ['Vet 86 Final'], 'the one group created is listed once');
});

test('the submit button is disabled while the create is in flight', async () => {
  const d = deferred();
  const { view } = await groupsView({ deps: { createGroup: () => d.promise } });
  const form = openCreate(view);
  const run = submit(form);
  view.render();
  const create = find(view.tree, (n) => n.type === 'button' && n.props.type === 'submit');
  assert.equal(create.props.disabled, true, 'a second tap must have nothing to press');
  d.resolve({ id: 'g1', name: 'Vet 86 Final', code: 'AAAAAA' });
  await run;
  await view.settle();
});

test('a failed create clears the guard, and the retry goes through', async () => {
  let attempt = 0;
  const { view, calls } = await groupsView({
    deps: {
      createGroup: async (name) => {
        calls.create.push(name);
        attempt += 1;
        if (attempt === 1) throw new Error('เครือข่ายขัดข้อง');
        return { id: 'g1', name, code: 'AAAAAA' };
      },
    },
  });
  const form = openCreate(view);
  await submit(form);
  await view.settle();
  assert.match(textOf(view.tree), /เครือข่ายขัดข้อง/, 'the failure is said on screen');
  const retry = find(view.tree, (n) => n.type === 'form');
  await submit(retry);
  await view.settle();
  assert.equal(calls.create.length, 2, 'the retry must reach the server');
  assert.deepEqual(rowNames(view), ['Vet 86 Final']);
  assert.doesNotMatch(textOf(view.tree), /เครือข่ายขัดข้อง/, 'the old error goes once the retry works');
});

test('a create does not wipe rows that loaded while it was pending', async () => {
  const list = deferred();
  const created = deferred();
  const { view } = await groupsView({
    deps: {
      getMyGroups: () => list.promise,
      createGroup: () => created.promise,
    },
  });
  // A slow first load: the student creates a group before their existing
  // groups have arrived. Appending to the array the submit's render captured
  // (still empty) used to drop the groups that landed in between.
  const form = openCreate(view, 'New group');
  const run = submit(form);
  list.resolve([{ id: 'g0', name: 'Earlier group', code: 'ZZZZZZ', role: 'member' }]);
  await view.settle();
  created.resolve({ id: 'g1', name: 'New group', code: 'AAAAAA' });
  await run;
  await view.settle();
  assert.deepEqual(rowNames(view), ['Earlier group', 'New group']);
});

test('Join has the same guard', async () => {
  const d = deferred();
  const { view, calls } = await groupsView({
    deps: { joinGroupByCode: (code) => { calls.join.push(code); return d.promise; } },
  });
  button(view.tree, '🔑 Join ด้วย Code').props.onClick();
  view.render();
  find(view.tree, (n) => n.props.id === 'vmx-group-code').props.onChange({ target: { value: 'abc123' } });
  view.render();
  const form = find(view.tree, (n) => n.type === 'form');
  const a = submit(form);
  const b = submit(form);
  view.render();
  assert.equal(calls.join.length, 1, 'one join request per tap sequence');
  const join = find(view.tree, (n) => n.type === 'button' && n.props.type === 'submit');
  assert.equal(join.props.disabled, true);
  d.resolve({ id: 'gj', name: 'joined', code: 'ABC123' });
  await Promise.all([a, b]);
  await view.settle();
});
