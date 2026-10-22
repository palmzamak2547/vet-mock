// A shared /app/* link to a year-scoped page opened before any year was picked: the front door
// (landing, year, phase) comes first, then the page the link named, not Home.
import assert from 'node:assert/strict';
import test from 'node:test';
import { loadModule, mount, findAll, textOf } from '../helpers/fake-react.mjs';
import { rememberFrontDoorReturn, takeFrontDoorReturn, rememberPhaseReturn, FRONT_DOOR_RETURN_KEY } from '../../src/lib/phase-return.js';

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

test('a year with a phase pick leaves the page for that pick', (t) => {
  browser(t);
  rememberFrontDoorReturn('subject-select');
  const views = [];
  const view = mount(YearSelectView, { goHome() {}, selectedYear: null, setSelectedYear() {}, setSelectedPhase() {}, setView: (v) => views.push(v), firstTime: true });
  const year5 = findAll(view.tree, (n) => n.type === 'button' && typeof n.props.onClick === 'function' && textOf(n).includes('ปี 5'))[0];
  assert.ok(year5, 'the year 5 card is drawn');
  year5.props.onClick();
  assert.deepEqual(views, ['phase-select']);
  assert.equal(takeFrontDoorReturn(), 'subject-select', 'still waiting for the phase pick');
  view.unmount();
});
