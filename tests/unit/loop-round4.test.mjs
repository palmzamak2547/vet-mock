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

const src = (p) => readFileSync(new URL(`../../${p}`, import.meta.url), 'utf8');
const APP = src('src/App.jsx');

test('the global leaderboard reports an RPC failure instead of showing a board of one', () => {
  const api = src('src/lib/api.js');
  const fn = api.slice(api.indexOf('export async function getLeaderboard'), api.indexOf('/** Per-user stats'));
  const afterRpc = fn.slice(fn.indexOf("supabase.rpc('get_global_leaderboard'"));
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

test('a jump into ConfigView from a pin or the palette clears the previous topic', () => {
  const pin = src('src/views/PinboardView.jsx');
  assert.ok(pin.includes('setTopic,'), 'PinboardView must receive setTopic');
  assert.ok(pin.split("setTopic(null)").length >= 3, 'both the question and the note pin must clear the topic');
  assert.ok(APP.includes('<PinboardView {...{ goHome, setView, setSubject, setTopic,'), 'App must pass setTopic to PinboardView');
  const pal = src('src/components/CommandPalette.jsx');
  assert.ok(pal.includes("case 'question':   setSubject?.(item.payload.subject); setTopic?.(null);"));
  assert.ok(pal.includes("case 'q-note':     setTopic?.(null);"));
  assert.ok(pal.includes("case 'bookmarks': setTopic?.(null);"));
  const palBlock = APP.slice(APP.indexOf('<CommandPalette'), APP.indexOf('/>', APP.indexOf('<CommandPalette')));
  assert.ok(palBlock.includes('setTopic={setTopic}'), 'App must pass setTopic to CommandPalette');
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
