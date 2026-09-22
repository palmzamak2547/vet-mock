// ============================================================
// presence-store.test.mjs — a classmate's next question is not a reason to
// rebuild this student's screen
// ============================================================
// useStudyBuddies used to keep the presence map in App state and replace it
// on every Realtime sync of the global channel. Every signed-in student is on
// that channel and each one re-announces on every question (coalesced to one
// track per 1.5 s pause), so with a class online the whole app, Home shell
// and exam screen included, rebuilt from the top whenever anyone moved.
//
// The real hook runs here against a small hook host (the same seam
// use-auth-events.test.mjs uses) and a fake Realtime channel. Several hosts
// share one evaluation of the module, the way App, ExamView and the Home
// panel share one presence store in the browser. What is pinned:
//   - App renders zero times for any presence sync;
//   - the exam screen's count renders only when someone enters or leaves
//     that student's own question;
//   - the Home panel renders only when what it prints changes (who is online
//     and on which subject, with which name and avatar);
//   - what the panel and the chip show is what they showed before.
// ============================================================

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const source = readFileSync(new URL('../../src/hooks/useStudyBuddies.js', import.meta.url), 'utf8').replace(/\r\n/g, '\n');

// Hooks are dispatched to whichever host is rendering, like React's own
// dispatcher, so several components can share one module instance.
const dispatcher = { current: null };

function createHost(component) {
  const slots = [];
  let cursor = 0;
  let scheduled = false;
  let queue = [];
  const host = { renders: 0, result: null };
  const changed = (a, b) => !a || !b || a.length !== b.length || a.some((d, k) => !Object.is(d, b[k]));
  const schedule = () => {
    if (scheduled || host.unmounted) return;
    scheduled = true;
    queueMicrotask(render);
  };
  host.react = {
    useState(init) {
      const k = cursor++;
      if (!slots[k]) {
        const slot = { value: typeof init === 'function' ? init() : init };
        slot.set = (update) => {
          const next = typeof update === 'function' ? update(slot.value) : update;
          if (Object.is(next, slot.value)) return;
          slot.value = next;
          schedule();
        };
        slots[k] = slot;
      }
      return [slots[k].value, slots[k].set];
    },
    useRef(init) {
      const k = cursor++;
      if (!slots[k]) slots[k] = { current: init };
      return slots[k];
    },
    useEffect(fn, deps) {
      const k = cursor++;
      if (slots[k] && !changed(slots[k].deps, deps)) return;
      slots[k] = { deps, cleanup: slots[k]?.cleanup };
      queue.push([k, fn]);
    },
    useSyncExternalStore(subscribe, getSnapshot) {
      const k = cursor++;
      const value = getSnapshot();
      // React calls getSnapshot again and loops forever if the answer is a
      // fresh object each time; a selector must hand back a cached value.
      assert.ok(Object.is(value, getSnapshot()), 'getSnapshot returns a cached value');
      if (!slots[k]) {
        const slot = { getSnapshot, value };
        slot.unsubscribe = subscribe(() => {
          const next = slot.getSnapshot();
          if (Object.is(next, slot.value)) return;
          slot.value = next;
          schedule();
        });
        slots[k] = slot;
      }
      slots[k].getSnapshot = getSnapshot;
      slots[k].value = value;
      return value;
    },
  };
  function render() {
    scheduled = false;
    if (host.unmounted) return;
    host.renders++;
    cursor = 0;
    const prev = dispatcher.current;
    dispatcher.current = host;
    try { host.result = component(host.props); } finally { dispatcher.current = prev; }
    const effects = queue;
    queue = [];
    for (const [k, fn] of effects) {
      if (typeof slots[k].cleanup === 'function') slots[k].cleanup();
      slots[k].cleanup = fn();
    }
  }
  host.mount = (props) => { host.props = props; render(); return host; };
  host.rerender = (props) => { host.props = props; render(); };
  host.unmount = () => {
    host.unmounted = true;
    for (const slot of slots) {
      if (typeof slot?.cleanup === 'function') slot.cleanup();
      if (typeof slot?.unsubscribe === 'function') slot.unsubscribe();
    }
  };
  return host;
}

// Every pending microtask, promise chain and zero-delay timer has run.
const settle = async () => {
  for (let n = 0; n < 30; n++) await new Promise((r) => setImmediate(r));
};

// Stands in for the global 'vet-mock-buddies' channel. sync() is the server
// telling this client the whole presence map, as Realtime does.
function fakeRealtime() {
  let state = {};
  let onSync = null;
  const tracked = [];
  const channel = {
    on(type, filter, cb) {
      if (type === 'presence' && filter?.event === 'sync') onSync = cb;
      return channel;
    },
    presenceState: () => state,
    async subscribe(cb) { cb('SUBSCRIBED'); return channel; },
    track(payload) { tracked.push(payload); },
    untrack() {},
    unsubscribe() { onSync = null; },
  };
  const sync = (map) => {
    // Realtime hands out fresh objects on every sync.
    state = Object.fromEntries(Object.entries(map).map(([k, meta]) => [k, [{ ...meta, phx_ref: Math.random().toString(36) }]]));
    onSync?.();
  };
  return { sb: { channel: () => channel }, sync, tracked };
}

function loadModule(fake) {
  const reactImport = source.match(/^import \{([^}]*)\} from 'react';$/m);
  assert.ok(reactImport, 'useStudyBuddies.js imports its hooks from react by name');
  const hookNames = reactImport[1].split(',').map((s) => s.trim()).filter(Boolean);
  const exported = [...source.matchAll(/^export (?:function|const|let) (\w+)/gm)].map((m) => m[1]);
  const body = source.replace(/^import .*$/gm, '').replace(/^export /gm, '');
  const win = { requestIdleCallback: (cb) => setImmediate(cb) };
  const doc = Object.assign(new EventTarget(), { visibilityState: 'visible' });
  const hooks = hookNames.map((name) => (...args) => {
    const impl = dispatcher.current?.react[name];
    assert.ok(impl, `the hook host implements ${name}`);
    return impl(...args);
  });
  return new Function(
    ...hookNames, 'hasSupabase', 'getSupabase', 'window', 'document',
    `${body}\nreturn { ${exported.join(', ')} };`,
  )(...hooks, true, async () => fake.sb, win, doc);
}

const ME = { id: 'me' };
const PROFILE = { username: 'palm', avatar_emoji: '🐾' };
const meOnline = { username: 'palm', avatar: '🐾', subject: null, view: 'home', qKey: null, joined_at: 1 };
const classmate = (over = {}) => ({ username: 'bee', avatar: '🐶', subject: 'zoonoses', view: 'exam', qKey: 'zoonoses:q1', joined_at: 2, ...over });

async function boot() {
  const fake = fakeRealtime();
  const mod = loadModule(fake);
  // App calls the hook once and owns the channel; it renders nothing here.
  const app = createHost(() => { mod.useStudyBuddies({ user: ME, profile: PROFILE, subject: null, view: 'home', qKey: null }); return null; }).mount();
  await settle();
  fake.sync({ me: meOnline, b: classmate() });
  await settle();
  return { fake, mod, app };
}

test('a classmate moving through ten questions and switching subjects renders App zero times', async () => {
  const { fake, app } = await boot();
  const before = app.renders;
  for (let i = 2; i <= 11; i++) {
    fake.sync({ me: meOnline, b: classmate({ qKey: `zoonoses:q${i}` }) });
    await settle();
  }
  fake.sync({ me: meOnline, b: classmate({ subject: 'swine-clinic', qKey: 'swine-clinic:q1' }) });
  await settle();
  fake.sync({ me: meOnline });
  await settle();
  assert.equal(app.renders - before, 0, 'App re-rendered on a presence sync');
  app.unmount();
});

test('the exam chip renders only when someone enters or leaves this question', async () => {
  const { fake, mod, app } = await boot();
  const exam = createHost(({ qKey }) => mod.useBuddyCountOnQ(qKey, ME.id)).mount({ qKey: 'zoonoses:q5' });
  assert.equal(exam.result, 0);
  const at = (q) => fake.sync({ me: { ...meOnline, view: 'exam', qKey: 'zoonoses:q5' }, b: classmate({ qKey: q }) });

  const start = exam.renders;
  for (const q of ['zoonoses:q2', 'zoonoses:q3', 'zoonoses:q4']) { at(q); await settle(); }
  assert.equal(exam.renders - start, 0, 'another question elsewhere rendered the exam screen');

  at('zoonoses:q5'); await settle();
  assert.equal(exam.result, 1, 'the classmate on this question is counted');
  assert.equal(exam.renders - start, 1);

  at('zoonoses:q6'); await settle();
  assert.equal(exam.result, 0, 'the classmate left this question');
  assert.equal(exam.renders - start, 2);

  // The student's own presence on the question never counts.
  fake.sync({ me: { ...meOnline, view: 'exam', qKey: 'zoonoses:q5' } }); await settle();
  assert.equal(exam.result, 0);
  exam.unmount();
  app.unmount();
});

test('the Home panel renders when who is where changes, not when anyone moves a question', async () => {
  const { fake, mod, app } = await boot();
  const panel = createHost(() => mod.useBuddyPanel()).mount();
  const start = panel.renders;
  const first = panel.result;
  assert.deepEqual(Object.keys(first), ['me', 'b']);

  for (let i = 2; i <= 6; i++) {
    fake.sync({ me: meOnline, b: classmate({ qKey: `zoonoses:q${i}`, view: i % 2 ? 'exam' : 'review' }) });
    await settle();
  }
  assert.equal(panel.renders - start, 0, 'a question or view change re-rendered the panel');
  assert.equal(panel.result, first, 'the panel kept the same map');

  fake.sync({ me: meOnline, b: classmate({ subject: 'swine-clinic', qKey: 'swine-clinic:q1' }) }); await settle();
  assert.equal(panel.renders - start, 1, 'a subject switch is what the panel shows');
  assert.equal(panel.result.b.subject, 'swine-clinic');

  fake.sync({ me: meOnline, b: classmate({ subject: 'swine-clinic', qKey: 'swine-clinic:q1' }), c: classmate({ username: 'cat', avatar: '🐱' }) }); await settle();
  assert.equal(panel.renders - start, 2, 'a classmate joining is what the panel shows');
  assert.deepEqual(Object.keys(panel.result), ['me', 'b', 'c']);

  fake.sync({ me: meOnline, c: classmate({ username: 'cat', avatar: '🐱' }) }); await settle();
  assert.equal(panel.renders - start, 3, 'a classmate leaving is what the panel shows');
  assert.deepEqual(Object.keys(panel.result), ['me', 'c']);
  panel.unmount();
  app.unmount();
});

test('the panel and the chip read what they read before', async () => {
  const { fake, mod, app } = await boot();
  const raw = {
    me: meOnline,
    b: classmate({ qKey: 'zoonoses:q7' }),
    c: classmate({ username: 'cat', avatar: '🐱', qKey: 'zoonoses:q7' }),
    d: { username: null, avatar: null, subject: null, view: 'home', qKey: null, joined_at: 3 },
  };
  fake.sync(raw);
  await settle();
  const panel = createHost(() => mod.useBuddyPanel()).mount();
  // StudyBuddiesPanel reads subject, username and avatar, keyed by user id,
  // and Home shows it when more than one key is present.
  assert.deepEqual(Object.keys(panel.result), Object.keys(raw));
  for (const [k, b] of Object.entries(raw)) {
    assert.equal(panel.result[k].subject || '_idle', b.subject || '_idle', `${k} subject`);
    assert.equal(panel.result[k].username || 'guest', b.username || 'guest', `${k} username`);
    assert.equal(panel.result[k].avatar || '🐾', b.avatar || '🐾', `${k} avatar`);
  }
  const exam = createHost(({ qKey }) => mod.useBuddyCountOnQ(qKey, ME.id)).mount({ qKey: 'zoonoses:q7' });
  assert.equal(exam.result, mod.countBuddiesOnQ(raw, 'zoonoses:q7', ME.id));
  assert.equal(exam.result, 2);
  exam.rerender({ qKey: null });
  assert.equal(exam.result, 0, 'no question, no chip');
  panel.unmount();
  exam.unmount();
  app.unmount();
});

test('signing out empties the store, and the channel still tracks this student', async () => {
  const { fake, mod, app } = await boot();
  const panel = createHost(() => mod.useBuddyPanel()).mount();
  assert.equal(Object.keys(panel.result).length, 2);
  // The payload the channel carries is unchanged by the store.
  assert.deepEqual(fake.tracked[0], { username: 'palm', avatar: '🐾', subject: null, view: 'home', qKey: null, joined_at: fake.tracked[0].joined_at });
  app.rerender();
  app.unmount();
  await settle();
  assert.deepEqual(panel.result, {}, 'a closed channel leaves no classmates on screen');
  panel.unmount();

  const signedOut = createHost(() => { mod.useStudyBuddies({ user: null, profile: null, subject: null, view: 'home', qKey: null }); return null; }).mount();
  await settle();
  const after = createHost(() => mod.useBuddyPanel()).mount();
  assert.deepEqual(after.result, {});
  after.unmount();
  signedOut.unmount();
});
