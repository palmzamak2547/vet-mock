// ============================================================
// admin-range-label.test.mjs — a range label names the numbers under it
// ============================================================
// The back-office has range chips (7 / 30 / 90 วัน / ทั้งหมด). Pressing one
// changed every label on the page at once: "ใหม่ 12 ใน 7 วัน", "บัญชีที่
// เข้าระบบใน 7 วัน", the chart's day count, "ทำใน 7 วัน" in the people table.
// The numbers under those labels were still the 30-day ones until the five
// reports for 7 days came back, and if they never came back (a timeout, or
// one of the five failing) the page kept saying 7 วัน over 30-day numbers
// for good, with a separate "โหลดไม่สำเร็จ" card that did not say which
// range had failed.
//
// Now the numbers carry the range they were loaded for. Every label, the
// chart and the table header follow that range; the pressed chip follows
// what was asked for; and while the two differ one status line says which
// range is loading, or that it failed, and which range is still on screen.
//
// AdminView.jsx is JSX and imports Supabase, so it cannot load in plain
// node. The test compiles the real file with esbuild (the transformer Vite
// itself ships with), swaps the modules that need a browser or a backend
// for stubs through node's module hooks, and renders it with a small hook
// harness: state slots, effects with cleanups, and an admin RPC whose
// every answer the test releases by hand.
// ============================================================

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { registerHooks } from 'node:module';
import { transformSync } from 'esbuild';

const VIEW_FILE = join(resolve(process.cwd()), 'src/views/AdminView.jsx');
const VIEW_URL = pathToFileURL(VIEW_FILE).href;
const COMPILED = 'vetmock-test:admin-view';
const STUB = 'vetmock-test:admin-stub:';

// Everything else AdminView imports (curriculum, counts, changelog, the pure
// question-quality helpers) is the real module.
const STUBS = {
  react: [
    'const h = () => globalThis.__vmxHooks;',
    'export const useState = (v) => h().useState(v);',
    'export const useEffect = (f, d) => h().useEffect(f, d);',
    'export const useMemo = (f, d) => h().useMemo(f, d);',
    'export const useRef = (v) => h().useRef(v);',
  ].join('\n'),
  'react/jsx-runtime': [
    "export const Fragment = 'fragment';",
    'export const jsx = (type, props) => ({ type, props: props || {} });',
    'export const jsxs = jsx;',
  ].join('\n'),
  '../lib/admin-api.js': [
    'export const checkIsAdmin = () => globalThis.__vmxAdmin.checkIsAdmin();',
    'export const adminRpc = (name, args) => globalThis.__vmxAdmin.rpc(name, args);',
    "export const isForbidden = (err) => err?.code === '42501' || /forbidden/i.test(String(err?.message || ''));",
  ].join('\n'),
  '../lib/supabase.js': 'export const hasSupabase = true;',
  '../components/PrivateNotes.jsx': 'export default function PrivateNotes() { return null; }',
  '../data/bank-registry.generated.js': 'export const BANK_REGISTRY = [];',
  '../styles-admin.css': '',
};

registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier === COMPILED) return { url: COMPILED, shortCircuit: true };
    if (context.parentURL === COMPILED) {
      if (Object.hasOwn(STUBS, specifier)) return { url: STUB + specifier, shortCircuit: true };
      return nextResolve(specifier, { ...context, parentURL: VIEW_URL });
    }
    return nextResolve(specifier, context);
  },
  load(url, context, nextLoad) {
    if (url === COMPILED) {
      const { code } = transformSync(readFileSync(VIEW_FILE, 'utf8'), { loader: 'jsx', jsx: 'automatic', format: 'esm', sourcefile: VIEW_FILE });
      return { format: 'module', shortCircuit: true, source: code };
    }
    if (url.startsWith(STUB)) return { format: 'module', shortCircuit: true, source: STUBS[url.slice(STUB.length)] };
    return nextLoad(url, context);
  },
});

const { default: AdminView } = await import(COMPILED);

// ---------- a hook harness just big enough for this view ----------

const nextTurn = () => new Promise((r) => setImmediate(r));

function mount(props) {
  const slots = [];
  let cursor = 0;
  let dirty = false;
  let effects = [];
  const hooks = {
    useState(init) {
      const i = cursor++;
      if (!(i in slots)) slots[i] = { value: typeof init === 'function' ? init() : init };
      const slot = slots[i];
      return [slot.value, (v) => {
        const next = typeof v === 'function' ? v(slot.value) : v;
        if (!Object.is(next, slot.value)) { slot.value = next; dirty = true; }
      }];
    },
    useEffect(fn, deps) {
      const i = cursor++;
      const slot = slots[i] || (slots[i] = { ran: false });
      if (!slot.ran || !deps || deps.some((d, k) => !Object.is(d, slot.deps[k]))) effects.push({ slot, fn, deps });
    },
    useMemo(fn) { cursor++; return fn(); },
    useRef(v) { const i = cursor++; if (!(i in slots)) slots[i] = { current: v }; return slots[i]; },
  };
  let tree = null;
  const render = () => {
    globalThis.__vmxHooks = hooks;
    cursor = 0;
    dirty = false;
    tree = AdminView(props);
    const run = effects;
    effects = [];
    for (const { slot, fn, deps } of run) {
      if (typeof slot.cleanup === 'function') slot.cleanup();
      slot.cleanup = fn();
      slot.deps = deps;
      slot.ran = true;
    }
  };
  return {
    get tree() { return tree; },
    /** Render until nothing changes: effects fire, promises land, state settles. */
    async settle() {
      for (let n = 0; n < 40; n++) {
        render();
        await nextTurn(); await nextTurn();
        if (!dirty && effects.length === 0) return;
      }
      throw new Error('the view never settled');
    },
  };
}

// ---------- a backend whose every answer the test releases ----------

const NEW_ACCOUNTS = { 7: 3, 30: 12, 90: 20, 0: 40 };
const SIGNINS = { 7: 11, 30: 33, 90: 36, 0: 38 };
const report = (days) => ({
  admin_overview: {
    accounts_total: 40, accounts_new: NEW_ACCOUNTS[days], users_active: 9, users_synced: 30,
    attempts: 100 * (days || 365), correct: 60 * (days || 365), questions_touched: 800,
    exams: 50, exams_avg_pct: 70, daily: [], generated_at: '2026-09-22T05:00:00Z',
    history_rows_total: 10000, attempt_events: 60, library_docs: 3, submissions_open: 0,
  },
  admin_questions: [],
  admin_subjects: [],
  admin_users_list: [],
  admin_extras: { signins_range: SIGNINS[days], identities: {}, recent_signins: [] },
});

function makeBackend() {
  const pending = [];
  const take = (days) => {
    const out = pending.filter((c) => c.days === days);
    for (const c of out) pending.splice(pending.indexOf(c), 1);
    assert.ok(out.length > 0, `no request for days=${days} is waiting`);
    return out;
  };
  return {
    checkIsAdmin: async () => true,
    rpc: (name, args) => new Promise((ok, fail) => pending.push({ name, days: args.days, ok, fail })),
    /** Answer every waiting report for `days`; the names in `failing` reject instead. */
    answer(days, { failing = [] } = {}) {
      for (const c of take(days)) {
        if (failing.includes(c.name)) c.fail(Object.assign(new Error('synthetic timeout'), { code: 'TIMEOUT' }));
        else c.ok(report(days)[c.name]);
      }
    },
    fail(days) { this.answer(days, { failing: Object.keys(report(days)) }); },
  };
}

// ---------- reading the rendered tree ----------

const text = (node) => {
  if (node == null || typeof node === 'boolean') return '';
  if (typeof node !== 'object') return String(node);
  if (Array.isArray(node)) return node.map(text).join('');
  return text(node.props?.children);
};
const findAll = (node, pred, out = []) => {
  if (!node || typeof node !== 'object') return out;
  if (Array.isArray(node)) { for (const c of node) findAll(c, pred, out); return out; }
  if (pred(node)) out.push(node);
  findAll(node.props?.children, pred, out);
  return out;
};
const kpi = (tree, label) => {
  const el = findAll(tree, (n) => n.type?.name === 'Kpi' && n.props.label === label)[0];
  assert.ok(el, `no KPI tile "${label}"`);
  return `${el.props.value} | ${el.props.sub}`;
};
const chartDays = (tree) => findAll(tree, (n) => n.type?.name === 'DailyChart')[0]?.props.days;
/** The sentence under the page title that says which range the numbers are for. */
const description = (tree) => {
  const head = findAll(tree, (n) => n.type === 'header')[0];
  assert.ok(head, 'no page header');
  return text(findAll(head, (n) => n.type === 'p')[0]);
};
const status = (tree) => {
  const lines = findAll(tree, (n) => n.props?.role === 'status');
  assert.ok(lines.length <= 1, 'one status line at most');
  return lines[0] ? text(lines[0]) : null;
};
const pressed = (tree) => findAll(tree, (n) => n.type === 'button' && n.props['aria-pressed'] === true).map(text);
const peopleRangeHeader = (tree) => findAll(tree, (n) => n.type === 'th').map(text).find((t) => t.startsWith('ทำใน'));
const pageText = (tree) => {
  // Kpi is not expanded by the harness; its copy lives in props.
  const kpis = findAll(tree, (n) => n.type?.name === 'Kpi').map((k) => `${k.props.label} ${k.props.value} ${k.props.sub || ''}`);
  return `${text(tree)} ${kpis.join(' ')}`;
};
const click = (tree, label) => {
  const btn = findAll(tree, (n) => n.type === 'button' && text(n) === label)[0];
  assert.ok(btn, `no button "${label}"`);
  btn.props.onClick();
};

/** Open the page as the admin and let the default 30-day report land. */
async function openAdmin() {
  const backend = makeBackend();
  globalThis.__vmxAdmin = backend;
  const page = mount({ goHome() {}, user: { id: 'owner' }, onOpenQuestion() {} });
  await page.settle();
  backend.answer(30);
  await page.settle();
  assert.equal(kpi(page.tree, 'บัญชี'), '40 | ใหม่ 12 ใน 30 วัน');
  return { page, backend };
}

/** Every place a range is named next to a number, as one comparable record. */
const labels = (tree) => ({
  accounts: kpi(tree, 'บัญชี'),
  signins: kpi(tree, 'เข้าระบบ'),
  chartDays: chartDays(tree),
  people: peopleRangeHeader(tree),
});
const LABELS_30 = { accounts: '40 | ใหม่ 12 ใน 30 วัน', signins: '33 | บัญชีที่เข้าระบบใน 30 วัน', chartDays: 30, people: 'ทำใน 30 วัน' };
const LABELS_7 = { accounts: '40 | ใหม่ 3 ใน 7 วัน', signins: '11 | บัญชีที่เข้าระบบใน 7 วัน', chartDays: 7, people: 'ทำใน 7 วัน' };

// ---------- the tests ----------

test('a failed 7-day load leaves the 30-day numbers labelled 30 days and says 7 days failed', async () => {
  const { page, backend } = await openAdmin();
  click(page.tree, '7 วัน');
  await page.settle();
  backend.fail(7);
  await page.settle();

  assert.deepEqual(labels(page.tree), LABELS_30, 'the labels must name the range the numbers came from');
  assert.match(description(page.tree), /ช่วง 30 วัน/);
  assert.doesNotMatch(description(page.tree), /7 วัน/);
  assert.deepEqual(pressed(page.tree), ['7 วัน'], 'the chip still shows what was asked for');

  const line = status(page.tree);
  assert.ok(line, 'a status line must say the 7-day load failed');
  assert.match(line, /7 วัน/);
  assert.match(line, /ไม่สำเร็จ/);
  assert.match(line, /30 วัน/, 'and which range is still on screen');
  assert.equal(pageText(page.tree).split('ไม่สำเร็จ').length - 1, 1, 'one failure message, not a status line and a card');
});

test('while 7 days is loading the labels stay on 30 days, then move with the numbers', async () => {
  const { page, backend } = await openAdmin();
  click(page.tree, '7 วัน');
  await page.settle();

  assert.deepEqual(labels(page.tree), LABELS_30);
  const line = status(page.tree);
  assert.ok(line, 'a status line must say 7 days is loading');
  assert.match(line, /กำลังโหลด/);
  assert.match(line, /7 วัน/);
  assert.match(line, /30 วัน/);

  backend.answer(7);
  await page.settle();
  assert.deepEqual(labels(page.tree), LABELS_7);
  assert.match(description(page.tree), /ช่วง 7 วัน/);
  assert.equal(status(page.tree), null, 'the status line goes once the numbers match the chip');
});

test('one report failing out of five does not put 7-day numbers beside 30-day ones', async () => {
  const { page, backend } = await openAdmin();
  click(page.tree, '7 วัน');
  await page.settle();
  backend.answer(7, { failing: ['admin_extras'] });
  await page.settle();

  assert.deepEqual(labels(page.tree), LABELS_30, 'admin_overview answered for 7 days, but the page must not half-switch');
  assert.match(status(page.tree) || '', /7 วัน.*ไม่สำเร็จ|ไม่สำเร็จ.*7 วัน/);
});

test('ทั้งหมด (days 0) is a range like any other, from 30 and from 7', async () => {
  const { page, backend } = await openAdmin();
  click(page.tree, 'ทั้งหมด');
  await page.settle();
  assert.deepEqual(labels(page.tree), LABELS_30, 'nothing moves before the all-time numbers land');
  assert.match(status(page.tree) || '', /ทั้งหมด/);
  backend.answer(0);
  await page.settle();
  assert.equal(kpi(page.tree, 'บัญชี'), '40 | ใหม่ 40 ใน ทั้งหมด');
  assert.equal(chartDays(page.tree), 0);
  assert.equal(status(page.tree), null);

  click(page.tree, '7 วัน');
  await page.settle();
  backend.answer(7);
  await page.settle();
  assert.deepEqual(labels(page.tree), LABELS_7);

  click(page.tree, 'ทั้งหมด');
  await page.settle();
  assert.deepEqual(labels(page.tree), LABELS_7, '7 to ทั้งหมด: the 7-day labels stay until the all-time numbers land');
  backend.answer(0);
  await page.settle();
  assert.equal(kpi(page.tree, 'เข้าระบบ'), '38 | บัญชีที่เข้าระบบใน ทั้งหมด');
});

test('rapid switching shows only the last range asked for, whichever answer lands first', async () => {
  {
    const { page, backend } = await openAdmin();
    click(page.tree, '7 วัน');
    await page.settle();
    click(page.tree, '90 วัน');
    await page.settle();
    backend.answer(7); // superseded: must be dropped
    await page.settle();
    assert.deepEqual(labels(page.tree), LABELS_30, 'the late 7-day answer is not what was asked for last');
    assert.match(status(page.tree) || '', /90 วัน/);
    backend.answer(90);
    await page.settle();
    assert.equal(kpi(page.tree, 'บัญชี'), '40 | ใหม่ 20 ใน 90 วัน');
    assert.equal(chartDays(page.tree), 90);
    assert.equal(status(page.tree), null);
  }
  {
    const { page, backend } = await openAdmin();
    click(page.tree, '7 วัน');
    await page.settle();
    click(page.tree, '90 วัน');
    await page.settle();
    backend.answer(90);
    await page.settle();
    backend.answer(7); // arrives after 90 landed
    await page.settle();
    assert.equal(kpi(page.tree, 'บัญชี'), '40 | ใหม่ 20 ใน 90 วัน');
    assert.equal(kpi(page.tree, 'เข้าระบบ'), '36 | บัญชีที่เข้าระบบใน 90 วัน');
    assert.deepEqual(pressed(page.tree), ['90 วัน']);
  }
});

test('ดึงใหม่ after a failed switch retries the chosen range and clears the status line', async () => {
  const { page, backend } = await openAdmin();
  click(page.tree, '7 วัน');
  await page.settle();
  backend.fail(7);
  await page.settle();
  click(page.tree, 'ดึงใหม่');
  await page.settle();
  assert.match(status(page.tree) || '', /กำลังโหลด/, 'the retry is shown as loading, not as the old failure');
  backend.answer(7);
  await page.settle();
  assert.deepEqual(labels(page.tree), LABELS_7);
  assert.equal(status(page.tree), null);
});

test('a failed first load and a failed refresh of the range on screen still show the error card', async () => {
  const backend = makeBackend();
  globalThis.__vmxAdmin = backend;
  const page = mount({ goHome() {}, user: { id: 'owner' }, onOpenQuestion() {} });
  await page.settle();
  backend.fail(30);
  await page.settle();
  assert.match(text(page.tree), /โหลดไม่สำเร็จ: synthetic timeout/);
  assert.equal(findAll(page.tree, (n) => n.type?.name === 'Kpi').length, 0, 'no numbers to show yet');

  click(page.tree, 'ดึงใหม่');
  await page.settle();
  backend.answer(30);
  await page.settle();
  assert.deepEqual(labels(page.tree), LABELS_30);

  click(page.tree, 'ดึงใหม่');
  await page.settle();
  backend.fail(30);
  await page.settle();
  assert.deepEqual(labels(page.tree), LABELS_30, 'the numbers on screen are still the 30-day ones');
  assert.match(text(page.tree), /โหลดไม่สำเร็จ: synthetic timeout/);
  assert.equal(status(page.tree), null, 'no range mismatch, so no range status line');
});

test('the new copy carries no middle dot', async () => {
  const { page, backend } = await openAdmin();
  click(page.tree, '7 วัน');
  await page.settle();
  assert.doesNotMatch(status(page.tree) || '', /·/);
  backend.fail(7);
  await page.settle();
  assert.doesNotMatch(status(page.tree) || '', /·/);
});
