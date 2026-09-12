// ============================================================
// loop-round4.test.mjs — eleven audit findings, pinned at the source
// ============================================================
// Each of these was found by the 2026-09-04 audit and was still in the tree
// on 2026-09-05. They live inside React components and App.jsx, which cannot
// be imported without React, so the shape of the fix is pinned the way
// resume-keeps-mode.test.mjs and exam-engine-contracts.test.mjs pin theirs.
// No \b anywhere in this file (see resume-keeps-mode for why).
// ============================================================

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';

const src = (p) => readFileSync(new URL(`../../${p}`, import.meta.url), 'utf8').replace(/\r\n/g, '\n');
const APP = src('src/App.jsx');

test('the global leaderboard reports an RPC failure instead of showing a board of one', () => {
  const api = src('src/lib/api.js');
  const fn = api.slice(api.indexOf('export async function getLeaderboard'), api.indexOf('/** Per-user stats'));
  const afterRpc = fn.slice(fn.indexOf("await supabase.rpc("));
  assert.ok(!afterRpc.includes('await rlsQuery()'), 'the global path must not substitute the RLS-scoped query');
  assert.ok(afterRpc.includes('โหลดกระดานอันดับไม่สำเร็จ'), 'the failure must be said in Thai');
  assert.ok(fn.includes("if (groupId) {") && fn.includes('await rlsQuery()'), 'the group board still uses the RLS query');
});

test('CommandPalette declares every hook above its early return', () => {
  const s = src('src/components/CommandPalette.jsx');
  const ret = s.indexOf('if (!open) return null;');
  assert.notEqual(ret, -1);
  const hook = s.indexOf("const lastAutoAsk = useRef('')");
  assert.ok(hook !== -1 && hook < ret, 'lastAutoAsk must be declared before the early return');
  const eff = s.indexOf('useEffect(() => {\n    if (!open) return;', hook);
  assert.ok(eff !== -1 && eff < ret, 'the auto-ask effect must sit above the early return and no-op when closed');
  assert.equal(s.slice(ret).includes('useRef('), false, 'no hook may follow the early return');
  assert.equal(s.slice(ret).includes('useEffect('), false, 'no hook may follow the early return');
});

test('a pin or a palette hit on a question opens that question, and any pool fallback clears the topic', () => {
  // Superseded the 2026-09 shape, which asserted the exact one-liners that
  // routed a named question into ConfigView. Clearing the topic was only ever
  // damage control for landing in a pool at all: the student had chosen ONE
  // question, so the destination is that question. The topic-clearing
  // assertion is kept for the paths that do still end in a pool.
  const pin = src('src/views/PinboardView.jsx');
  assert.ok(pin.includes('setTopic,'), 'PinboardView must receive setTopic');
  assert.ok(pin.includes('onOpenQuestion'), 'PinboardView must be able to open the pinned question itself');
  assert.ok(pin.includes('await onOpenQuestion(p.id)'), 'the pinned id must be what is opened');
  assert.ok(pin.includes('setTopic(null)'), 'the pool fallback must still clear the topic');
  assert.ok(APP.includes('<PinboardView {...{ goHome, setView, setSubject, setTopic,'), 'App must pass setTopic to PinboardView');
  assert.ok(APP.includes('onOpenQuestion: openQuestionById'), 'App must give PinboardView a way to open one question');

  const pal = src('src/components/CommandPalette.jsx');
  assert.ok(pal.includes("case 'question':\n    case 'q-note': {"), 'both named-question rows share one handler');
  assert.ok(pal.includes('onOpenQuestion(id).then'), 'the palette must open the found question');
  assert.ok(pal.includes("case 'bookmarks': setTopic?.(null);"), 'the bookmarks pool row still clears the topic');
  // Every remaining route into ConfigView from this handler must clear the
  // topic, or a leftover topic silently scopes the set again.
  const handler = pal.slice(pal.indexOf("case 'question':"), pal.indexOf("case 'flashcard':"));
  const configRoutes = handler.split("goView?.('config')").length - 1;
  const clears = handler.split('setTopic?.(null)').length - 1;
  assert.ok(configRoutes > 0 && clears >= configRoutes,
    `every ConfigView fallback must clear the topic (${configRoutes} routes, ${clears} clears)`);

  const palBlock = APP.slice(APP.indexOf('<CommandPalette'), APP.indexOf('/>', APP.indexOf('<CommandPalette')));
  assert.ok(palBlock.includes('setTopic={setTopic}'), 'App must pass setTopic to CommandPalette');
  assert.ok(palBlock.includes('onOpenQuestion={openQuestionById}'), 'App must pass the question opener to the palette');
});

test('openQuestionById resolves across years and is not pinned to the first render', () => {
  // The bank is empty on the first render and fills in asynchronously, so a
  // memoized-with-[] lookup would search an empty array forever — the same
  // trap that once stamped a null account onto a whole exam set.
  const open = APP.slice(APP.indexOf('const openQuestionById'), APP.indexOf('const isBookmarked'));
  assert.ok(open.includes('const openQuestionById = async (id)'),
    'openQuestionById must be a plain per-render function, not a [] useCallback');
  assert.ok(open.includes('isQBFullyLoaded()') && open.includes('await loadQB()'),
    'a pin can name another year: load the rest of the bank before reporting not-found');
  assert.ok(open.includes('replayQuestions([q])'), 'a found question opens as a one-question round');
  assert.ok(open.includes('return false'), 'not-found must be reported so callers can say so');
});

test('the review screen shows the share link when the clipboard refuses it', () => {
  const s = src('src/views/ReviewView.jsx');
  assert.ok(s.includes("'คัดลอกไม่ได้: ' + (res.url || '')"), 'the built link must be shown, like ResultsView');
});

test('group and account error panels speak Thai', () => {
  assert.ok(src('src/views/GroupsView.jsx').includes("thaiError(e, 'โหลดกลุ่มไม่สำเร็จ')"));
  assert.ok(src('src/views/GroupDetailView.jsx').includes("thaiError(err, 'โหลดข้อมูลกลุ่มไม่สำเร็จ')"));
  const acct = src('src/views/AccountSettingsView.jsx');
  assert.ok(acct.includes("thaiError(err, 'ส่งออกไม่สำเร็จ"), 'export failure must not print the raw exception');
  assert.ok(acct.includes("import { thaiError } from '../lib/errors.js'"));
});

test('the subject selector waits for the SELECTED year, and counts once per bank change', () => {
  const s = src('src/views/SubjectSelectView.jsx');
  assert.ok(s.includes('!isQBYearLoaded(selectedYear)'), 'loading must track the selected year, not the first one');
  assert.ok(s.includes('!yearIsScaffold'), 'a scaffold year has no banks to wait for');
  assert.ok(s.includes('const countBySubject = useMemo('), 'counts must be memoised');
  const render = s.slice(s.indexOf('group.items.map((s) =>'));
  assert.ok(render.includes('countBySubject.get(y.id)'), 'the all-card must read the memo');
  assert.equal((render.match(/visibleQuestionCount\(y\.id/g) || []).length, 0, 'no per-render bank scan for the all-card');
});

test('the skip link is the first tab stop, before the desktop sidebar', () => {
  const skip = APP.indexOf('className="vmx-skip-link"');
  const sidebar = APP.indexOf('<Sidebar');
  assert.ok(skip !== -1 && sidebar !== -1);
  assert.ok(skip < sidebar, 'the skip link must come before <Sidebar> in DOM order');
  assert.equal((APP.match(/className="vmx-skip-link"/g) || []).length, 1, 'exactly one skip link');
});

test('App.jsx reads SEMESTER without pulling schedule.js into the boot chunk', () => {
  assert.ok(APP.includes("import { SEMESTER } from './data/semester.js';"));
  assert.equal(APP.includes("from './data/schedule.js'"), false, 'schedule.js must stay out of the entry chunk');
  assert.ok(existsSync(new URL('../../src/data/semester.js', import.meta.url)));
  assert.ok(src('src/data/schedule.js').includes("export { SEMESTER } from './semester.js';"), 'schedule.js must re-export it for its other consumers');
  assert.ok(src('src/data/semester.js').includes("id: '2569-1'"), 'the semester data moved intact');
});

test('buildExamPool caches the hidden-topic set per subject', () => {
  const fn = APP.slice(APP.indexOf('function buildExamPool'), APP.indexOf('export default function App'));
  assert.ok(fn.includes('const hiddenBySubject = new Map();'));
  assert.equal(fn.includes('!hiddenTopicIdsFor(q.subject).has(q.topic)'), false, 'the per-question call is gone');
});

test('the worker precaches the shell one entry at a time', () => {
  const sw = src('public/sw.js');
  assert.equal(sw.includes('cache.addAll('), false, 'addAll is atomic — one failed icon cost the whole shell');
  assert.ok(sw.includes('Promise.allSettled(['), 'entries must settle independently');
  assert.ok(sw.includes("].map((url) => cache.add(url))"));
});
