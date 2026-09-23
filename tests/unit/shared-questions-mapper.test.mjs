// ============================================================
// shared-questions-mapper.test.mjs — the Shared Q tab tells the truth
// ============================================================
// DA-09. The group page's Shared Q tab told students to add a question in
// Question Manager and press "Share". There has never been a Share button:
// api.js exports shareQuestion, and nothing in the app has ever called it.
// The Groups hero promised "แชร์ข้อสอบ" the same way. Until a share action
// exists, the copy says sharing into a group is not available yet.
//
// DA-05. shared_questions.data is JSON another member wrote, returned by
// getSharedQuestions exactly as stored, and the tab dereferenced it blind:
// one row whose tags was a string blanked the whole page with
// "q.data.tags.map is not a function". Rows now pass through a mapper at the
// read boundary: the question text decides whether a row can be shown, the
// fields around it are made safe, and an unreadable row stays in the list as
// one line that its author can still delete.
// ============================================================

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const ROOT = resolve(process.cwd());
const src = (p) => readFileSync(join(ROOT, p), 'utf8');

function sourceFiles(dir, out = []) {
  for (const name of readdirSync(join(ROOT, dir))) {
    const rel = `${dir}/${name}`;
    if (statSync(join(ROOT, rel)).isDirectory()) sourceFiles(rel, out);
    else if (/\.(jsx?|mjs)$/.test(name)) out.push(rel);
  }
  return out;
}

/** Every place in src that CALLS shareQuestion, not the one that defines it. */
let callers = null;
function shareCallers() {
  callers ??= sourceFiles('src').filter((file) => {
    const code = src(file).replace(/export async function shareQuestion\(/g, '');
    return /\bshareQuestion\(/.test(code);
  });
  return callers;
}

test('DA-09: the Shared Q tab does not send students to a Share button that does not exist', () => {
  if (shareCallers().length) return; // a real share action exists; the copy may point at it
  const detail = src('src/views/GroupDetailView.jsx');
  assert.doesNotMatch(detail, /กด\s*"Share"/, 'there is no Share button to press');
  assert.doesNotMatch(detail, /Question Manager/, 'Question Manager has no group action');
  assert.match(detail, /ยังแชร์ข้อสอบเข้ากลุ่มไม่ได้/, 'the tab says sharing is not available yet');
  assert.match(detail, /ยังไม่มีข้อสอบที่แชร์/, 'the empty state stays');
});

test('DA-09: the Groups hero does not promise sharing questions', () => {
  if (shareCallers().length) return;
  const groups = src('src/views/GroupsView.jsx');
  const hero = groups.slice(groups.indexOf('<div className="vmx-hero">'), groups.indexOf('</div>', groups.indexOf('<div className="vmx-hero">')));
  assert.ok(hero.includes('แข่งคะแนน'), 'the hero is still there');
  assert.doesNotMatch(hero, /แชร์ข้อสอบ/);
});

test('DA-09: the new copy keeps the house rules', () => {
  for (const file of ['src/views/GroupDetailView.jsx', 'src/views/GroupsView.jsx']) {
    const code = src(file);
    assert.doesNotMatch(code, /·/, `${file}: no middle dot in UI copy`);
    assert.doesNotMatch(code, /นักศึกษา/, `${file}: นิสิต, never นักศึกษา`);
  }
});

// ── DA-05: the read boundary ──────────────────────────────────────────────
// api.js imports supabase.js, which reads import.meta.env at load and cannot
// run under node. That one import is swapped for a stub whose client each
// test controls; everything else, and every function body, is the real one.
const API_PATH = join(ROOT, 'src/lib/api.js');
const supabaseStub = 'data:text/javascript,' + encodeURIComponent(
  'export const hasSupabase = true;\n'
  + 'export function getSupabase() { return Promise.resolve(globalThis.__vmxTestSupabase); }\n',
);
const rewritten = src('src/lib/api.js').replace(/from '(\.[^']+)'/g, (_m, spec) => (
  spec === './supabase.js'
    ? `from '${supabaseStub}'`
    : `from '${pathToFileURL(resolve(dirname(API_PATH), spec)).href}'`
));
const api = await import('data:text/javascript;base64,'
  + Buffer.from(rewritten + '\n//# sourceURL=api-under-test.mjs').toString('base64'));

/** A shared_questions table answering every read with `rows`. */
function serve(rows) {
  const q = {
    select() { return q; },
    eq() { return q; },
    order() { return q; },
    then(res, rej) { return Promise.resolve({ data: rows, error: null }).then(res, rej); },
  };
  globalThis.__vmxTestSupabase = { from: () => q };
}

const row = (id, data, extra = {}) => ({ id, group_id: 'g', author_id: 'M2', author_name: 'friend', data, ...extra });
const MIXED = [
  row('ok', { subject: 'com5', q: 'Which drug?', tags: ['pharm'] }),
  row('null-data', null),
  row('string-tags', { subject: 'com5', q: 'Still readable', tags: 'oops' }),
  row('object-q', { subject: 'com5', q: { text: 'nested' }, tags: [] }),
  row('no-subject', { q: 'No subject given' }),
  row('odd-tags', { q: 'Mixed tags', tags: ['ok', 3, { x: 1 }, '', null] }),
  row('array-data', ['not', 'an', 'object']),
  row('blank-q', { subject: 'com5', q: '   ' }),
  row('mine-broken', 42, { author_id: 'A', author_name: 'palm' }),
];

test('DA-05: the mapper keeps what can be read and flags what cannot', () => {
  const { readSharedQuestion } = api;
  assert.equal(typeof readSharedQuestion, 'function', 'api.js exports the mapper');
  const byId = Object.fromEntries(MIXED.map((r) => [r.id, readSharedQuestion(r)]));
  assert.equal(byId['null-data'].invalid, true, 'data null');
  assert.equal(byId['object-q'].invalid, true, 'q as an object cannot be drawn as text');
  assert.equal(byId['array-data'].invalid, true);
  assert.equal(byId['blank-q'].invalid, true, 'an empty question is not a question');
  assert.equal(byId['mine-broken'].invalid, true);
  assert.equal(byId.ok.invalid, false);
  assert.deepEqual(byId.ok.data.tags, ['pharm']);
  assert.equal(byId['string-tags'].invalid, false, 'bad tags do not cost the question');
  assert.deepEqual(byId['string-tags'].data.tags, []);
  assert.equal(byId['no-subject'].invalid, false, 'a missing subject does not either');
  assert.equal(byId['no-subject'].data.subject, null);
  assert.deepEqual(byId['odd-tags'].data.tags, ['ok'], 'only non-empty string tags reach the page');
  for (const r of Object.values(byId)) {
    assert.ok(r.id && 'author_id' in r, 'the row keeps its id and author, so its author can delete it');
  }
});

test('DA-05: getSharedQuestions hands the view mapped rows, valid ones intact and in order', async () => {
  serve(MIXED);
  const out = await api.getSharedQuestions('g');
  assert.deepEqual(out.map((r) => r.id), MIXED.map((r) => r.id), 'nothing dropped, nothing reordered');
  assert.deepEqual(out.filter((r) => !r.invalid).map((r) => r.id), ['ok', 'string-tags', 'no-subject', 'odd-tags']);
  assert.equal(out[0].data.q, 'Which drug?');
  serve(null);
  assert.deepEqual(await api.getSharedQuestions('g'), [], 'no rows is an empty list, not a crash');
});

// ── DA-05: the tab renders a mixed list ───────────────────────────────────
const { transformWithEsbuild } = await import('vite');
const h = (type, props, ...children) => ({ type, props: props || {}, children: children.flat(Infinity) });
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

/** The real GroupDetailView, its imports replaced by `deps`, rendered with a
 *  minimal hook harness until its requests have settled, on the Shared Q tab. */
async function renderSharedTab(deps, props) {
  const file = 'src/views/GroupDetailView.jsx';
  const source = src(file);
  const name = source.match(/export default function (\w+)/)[1];
  const body = source.replace(/^import[^\n]*\n/gm, '').replace('export default function ', 'function ');
  const { code } = await transformWithEsbuild(body, file, {
    loader: 'jsx', jsx: 'transform', jsxFactory: 'h', jsxFragment: 'Fragment',
  });
  const slots = [];
  const effects = [];
  const queued = [];
  let cursor = 0;
  let effectCursor = 0;
  let dirty = false;
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
    useEffect(fn, d) {
      const i = effectCursor++;
      const prev = effects[i];
      if (!prev || !d || d.some((x, n) => !Object.is(x, prev.d[n]))) queued.push({ i, fn, d });
    },
  };
  const scope = { h, Fragment: 'Fragment', Mochi: 'Mochi', StatePanel: 'StatePanel', ...hooks, ...deps };
  const View = new Function(...Object.keys(scope), `${code}\nreturn ${name};`)(...Object.values(scope));
  let tree;
  const render = () => {
    do {
      cursor = 0; effectCursor = 0; dirty = false;
      tree = View(props);
      for (const e of queued.splice(0)) effects[e.i] = { d: e.d, cleanup: e.fn() };
    } while (dirty);
  };
  render();
  for (let n = 0; n < 20; n++) {
    await new Promise((r) => setImmediate(r));
    if (dirty) render();
  }
  findAll(tree, (n) => n.type === 'button' && textOf(n).startsWith('Shared Q'))[0].props.onClick();
  render();
  return tree;
}

test('DA-05: one malformed shared question no longer blanks the tab', async () => {
  serve(MIXED);
  const tree = await renderSharedTab({
    getGroupMembers: async () => [],
    getSharedQuestions: api.getSharedQuestions, // the real read, over the fake table above
    getLeaderboard: async () => [],
    deleteSharedQuestion: async () => {},
    qualifiesForLeaderboard: () => true,
    copyText: async () => ({ ok: true }),
    SUBJECTS: [{ id: 'com5', name: 'Companion V' }],
    confirmDialog: async () => true,
    alertDialog: () => {},
    thaiError: (e, fallback) => e?.message || fallback,
  }, { group: { id: 'g', name: 'group', code: 'ABCDEF', openedBy: 'A' }, user: { id: 'A' }, goBack() {} });
  const text = textOf(tree);
  for (const shown of ['Which drug?', 'Still readable', 'No subject given', 'Mixed tags']) {
    assert.ok(text.includes(shown), `the readable question "${shown}" is on screen`);
  }
  assert.ok(text.includes('#pharm') && text.includes('#ok'), 'valid tags still render');
  assert.ok(text.includes('Companion V'), 'a known subject still shows its name');
  const items = findAll(tree, (n) => n.props.className === 'vmx-review-item');
  assert.equal(items.length, MIXED.length, 'every row keeps its place in the list');
  const unreadable = items.filter((n) => /แสดงข้อนี้ไม่ได้/.test(textOf(n)));
  assert.equal(unreadable.length, 5, 'each unreadable row is one line saying it cannot be shown');
  const mine = unreadable.find((n) => textOf(n).includes('palm'));
  assert.equal(findAll(mine, (n) => n.type === 'button' && textOf(n) === '🗑').length, 1,
    'its author can still delete a row that cannot be shown');
});
