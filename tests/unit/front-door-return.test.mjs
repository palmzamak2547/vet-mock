// A shared /app/* link to a year-scoped page opened before any year was picked: the front door
// (landing, year, phase) comes first, then the page the link named, not Home.
import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { loadModule, mount, findAll, textOf } from '../helpers/fake-react.mjs';
import { rememberFrontDoorReturn, takeFrontDoorReturn, settleFrontDoorReturn, atFrontDoor, rememberPhaseReturn, FRONT_DOOR_RETURN_KEY } from '../../src/lib/phase-return.js';

const APP = readFileSync(new URL('../../src/App.jsx', import.meta.url), 'utf8').replace(/\r\n/g, '\n');

const stubs = [
  { match: '\\.css$', contents: '' },
  { match: '/components/Mochi\\.jsx$', contents: 'export default () => null;' },
  { match: '/hooks/useMotionPreferences\\.js$', contents: 'export const useMotionPreferences = () => ({ reduced: true });' },
];
const { default: PhaseSelectView } = await loadModule('src/views/PhaseSelectView.jsx', { stubs });
const { default: YearSelectView } = await loadModule('src/views/YearSelectView.jsx', { stubs });

function browser(t) {
  const storage = () => { const m = new Map(); return { getItem: (k) => m.get(k) ?? null, setItem: (k, v) => m.set(k, String(v)), removeItem: (k) => m.delete(k) }; };
  globalThis.sessionStorage = storage();
  globalThis.localStorage = storage();
  globalThis.window = { sessionStorage, localStorage, location: new URL('https://fixture.test/app/review'), addEventListener() {}, removeEventListener() {} };
  t.after(() => { delete globalThis.window; delete globalThis.sessionStorage; delete globalThis.localStorage; });
}
const phaseCards = (tree) => findAll(tree, (n) => n.type === 'button' && n.props.className === 'vmx-mode-card');

test('only the year-scoped pages a link can name are kept, and only once', (t) => {
  browser(t);
  rememberFrontDoorReturn('exam');
  assert.equal(sessionStorage.getItem(FRONT_DOOR_RETURN_KEY), null, 'a view outside the list is never stored');
  rememberFrontDoorReturn('sr-session');
  assert.equal(takeFrontDoorReturn(), 'sr-session');
  assert.equal(takeFrontDoorReturn(), null, 'taken once');
  sessionStorage.setItem(FRONT_DOOR_RETURN_KEY, 'admin');
  assert.equal(takeFrontDoorReturn(), null, 'a forged value routes nowhere');
});

test('the phase pick opens the page the link named', (t) => {
  browser(t);
  rememberFrontDoorReturn('sr-session');
  const views = [];
  const view = mount(PhaseSelectView, { goHome() {}, selectedYear: 5, selectedPhase: null, setSelectedPhase() {}, setView: (v) => views.push(v) });
  phaseCards(view.tree)[0].props.onClick();
  assert.deepEqual(views, ['sr-session']);
  view.unmount();
});

test('the topic screen\'s own return still wins over a link, and Home clears both', (t) => {
  browser(t);
  rememberFrontDoorReturn('dashboard');
  rememberPhaseReturn('topic-select');
  const views = [];
  let view = mount(PhaseSelectView, { goHome() {}, selectedYear: 5, selectedPhase: null, setSelectedPhase() {}, setView: (v) => views.push(v) });
  phaseCards(view.tree)[0].props.onClick();
  assert.deepEqual(views, ['topic-select']);
  view.unmount();
  let home = 0;
  view = mount(PhaseSelectView, { goHome: () => { home++; }, selectedYear: 5, selectedPhase: null, setSelectedPhase() {}, setView: (v) => views.push(v) });
  findAll(view.tree, (n) => n.type === 'button' && n.props.children === 'หน้าแรก')[0].props.onClick();
  assert.equal(home, 1);
  assert.equal(takeFrontDoorReturn(), null, 'choosing Home forgets the link');
  view.unmount();
});

test('a shared reading-list link opens the reading list after the picks, like the other year pages', (t) => {
  browser(t);
  rememberFrontDoorReturn('reading-checklist');
  const views = [];
  const view = mount(PhaseSelectView, { goHome() {}, selectedYear: 5, selectedPhase: null, setSelectedPhase() {}, setView: (v) => views.push(v) });
  phaseCards(view.tree)[0].props.onClick();
  assert.deepEqual(views, ['reading-checklist']);
  view.unmount();
});

test('the page waits only inside the front door; any other page drawn forgets it', (t) => {
  browser(t);
  // The terms open from the landing's sign-in box and from the wall as a full
  // page load, and Back returns to the landing: reading them is not leaving.
  for (const view of ['landing', 'auth', 'privacy', 'year-select', 'phase-select']) {
    rememberFrontDoorReturn('dashboard');
    settleFrontDoorReturn(view);
    assert.equal(sessionStorage.getItem(FRONT_DOOR_RETURN_KEY), 'dashboard', `${view} is the front door itself`);
  }
  // The landing's subject card opens the topic screen, its Lab button the Lab;
  // Back from the picker returns to the library. The visitor left another way.
  for (const view of ['topic-select', 'lab', 'library', 'home', 'notes']) {
    rememberFrontDoorReturn('dashboard');
    settleFrontDoorReturn(view);
    assert.equal(takeFrontDoorReturn(), null, `${view} drawn: the link's page must not wait any longer`);
    assert.equal(atFrontDoor(view), false, view);
  }
  for (const view of ['landing', 'auth', 'privacy', 'year-select', 'phase-select']) assert.equal(atFrontDoor(view), true, view);
});

// A cold /app/progress, then a subject card on the landing (the year is set and
// the topic screen opens), then a phase change from the header later in the tab.
test('a subject picked on the landing ends the wait: a later phase change still lands on Home', (t) => {
  browser(t);
  rememberFrontDoorReturn('dashboard');
  settleFrontDoorReturn('topic-select');
  const views = [];
  const view = mount(PhaseSelectView, { goHome() {}, selectedYear: 5, selectedPhase: '1-mid', setSelectedPhase() {}, setView: (v) => views.push(v) });
  phaseCards(view.tree)[1].props.onClick();
  assert.deepEqual(views, ['home']);
  view.unmount();
});

test('a phase pick that goes back to the topic screen ends the link\'s wait too', (t) => {
  browser(t);
  rememberFrontDoorReturn('dashboard');
  rememberPhaseReturn('topic-select');
  const views = [];
  let view = mount(PhaseSelectView, { goHome() {}, selectedYear: 5, selectedPhase: null, setSelectedPhase() {}, setView: (v) => views.push(v) });
  phaseCards(view.tree)[0].props.onClick();
  view.unmount();
  settleFrontDoorReturn('topic-select');
  view = mount(PhaseSelectView, { goHome() {}, selectedYear: 5, selectedPhase: '1-mid', setSelectedPhase() {}, setView: (v) => views.push(v) });
  phaseCards(view.tree)[1].props.onClick();
  assert.deepEqual(views, ['topic-select', 'home']);
  view.unmount();
});

// Rendering App is not something node can do, so its two steps are pinned as constructs.
test('App settles the wait on every page it draws, and a landing button outranks the link', () => {
  assert.match(APP, /const door = yearGateFor\(view, selectedYearStored\);\s*if \(!door\) \{\s*settleFrontDoorReturn\(view\);/,
    'App never drops a link\'s page once the visitor has left the front door');
  const goLanding = APP.slice(APP.indexOf('const goLanding = (intent) => {'), APP.indexOf('const startPanicSession'));
  assert.ok(goLanding.length > 0, 'goLanding moved: re-point this guard');
  const forget = goLanding.indexOf('takeFrontDoorReturn();');
  assert.ok(forget > 0, 'Start mock exam, Panic and the Lab on the landing still give the picks to the link\'s page');
  assert.ok(forget < goLanding.indexOf('landingIntentRef.current = intent;'), 'the link is forgotten before the button\'s own destination is parked');
  assert.ok(forget < goLanding.indexOf("if (intent?.kind === 'lab')"), 'the Lab button forgets the link too');
});

test('a year whose timetable picks the paper goes straight to the page, with that paper', (t) => {
  browser(t);
  rememberFrontDoorReturn('subject-select');
  const views = [];
  const phases = [];
  // 25 Sep 2026: year 5's midterm is sat and the final is ahead.
  const view = mount(YearSelectView, { goHome() {}, selectedYear: null, setSelectedYear() {}, setSelectedPhase: (p) => phases.push(p), setView: (v) => views.push(v), firstTime: true, now: () => new Date('2026-09-25T18:15:00+07:00') });
  const year5 = findAll(view.tree, (n) => n.type === 'button' && typeof n.props.onClick === 'function' && textOf(n).includes('ปี 5'))[0];
  assert.ok(year5, 'the year 5 card is drawn');
  year5.props.onClick();
  assert.deepEqual(phases, ['1-final'], 'the paper the timetable names, as the แนะนำ card would have set');
  assert.deepEqual(views, ['subject-select'], 'no stop at the phase screen');
  assert.equal(sessionStorage.getItem('vmx-decide:why:home'), 'ตามตารางสอบ', 'Home says why, beside the paper it names');
  view.unmount();
});

test('a year whose timetable cannot pick a paper still asks, as before', (t) => {
  browser(t);
  rememberFrontDoorReturn('subject-select');
  const views = [];
  const phases = [];
  // 20 Dec 2026: every paper of the term sat, the next term's table not in.
  const view = mount(YearSelectView, { goHome() {}, selectedYear: null, setSelectedYear() {}, setSelectedPhase: (p) => phases.push(p), setView: (v) => views.push(v), firstTime: true, now: () => new Date('2026-12-20T10:00:00+07:00') });
  findAll(view.tree, (n) => n.type === 'button' && typeof n.props.onClick === 'function' && textOf(n).includes('ปี 5'))[0].props.onClick();
  assert.deepEqual(phases, [null]);
  assert.deepEqual(views, ['phase-select']);
  assert.equal(takeFrontDoorReturn(), 'subject-select', 'still waiting for the phase pick');
  view.unmount();
});
