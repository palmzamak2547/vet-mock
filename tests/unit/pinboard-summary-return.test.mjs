import test from 'node:test';
import assert from 'node:assert/strict';
import { loadModule, mount, settle, findAll, textOf } from '../helpers/fake-react.mjs';
import { loadVideoSummaryClip } from '../../src/data/video-summaries.js';
import { addPin } from '../../src/lib/pinboard.js';

const first = await loadVideoSummaryClip('WRttiWQ7D9s');
const second = await loadVideoSummaryClip('j44XnjxUPFI');
const calls = [], alerts = [];
globalThis.__summaryReturn = { load: async id => { calls.push(id); return id === first.videoId ? first : second; }, alerts };
const stubs = [
  { match: '/data/video-summaries\\.js$', contents: 'export const loadVideoSummaryClip = id => globalThis.__summaryReturn.load(id);' },
  { match: '/lib/dialog\\.js$', contents: 'export const alertDialog = text => globalThis.__summaryReturn.alerts.push(text); export const confirmDialog = async () => true;' },
  { match: '/components/Mochi\\.jsx$', contents: 'export default () => null;' },
  { match: '/hooks/useMotionPreferences\\.js$', contents: 'export const useMotionPreferences = () => ({ reduced: true });' },
  { match: '^react-dom$', contents: 'export const createPortal = node => node;' },
];
const { default: VideoView } = await loadModule('src/views/VideoView.jsx', { stubs });
const { default: PinboardView } = await loadModule('src/views/PinboardView.jsx', { stubs });

function browser(t, search = '') {
  const values = new Map(), tickets = new Map(), listeners = new Map();
  const storage = map => ({ getItem: key => map.get(key) ?? null, setItem: (key, value) => map.set(key, String(value)), removeItem: key => map.delete(key) });
  globalThis.localStorage = storage(values);
  globalThis.sessionStorage = storage(tickets);
  globalThis.window = { localStorage, sessionStorage, location: new URL(`https://fixture.test/app/videos${search}`),
    addEventListener: (name, handler) => listeners.set(name, handler), removeEventListener: name => listeners.delete(name),
    dispatchEvent() {}, history: { state: {}, replaceState(state, _title, url) {
      this.state = state;
      window.location = Object.assign(new URL(url, window.location.href), { reload: window.location.reload });
    } } };
  calls.length = 0; alerts.length = 0;
  t.after(() => { delete globalThis.window; delete globalThis.localStorage; delete globalThis.sessionStorage; });
  return {
    ticket: (id, extra = {}) => sessionStorage.setItem('vmx-video-pending-clip', JSON.stringify({ videoId: id, at: Date.now(), ...extra })),
    intent: (id, openSummary = true) => listeners.get('vmx-view-intent')({ detail: { view: 'videos', navigationState: { videoId: id, openSummary, subject: 'surg2' } } }),
  };
}
const readers = view => findAll(view.tree, node => node.props.id === 'vmx-summary-title');
const players = view => findAll(view.tree, node => node.props['aria-label'] === 'ปิดเครื่องเล่นวิดีโอ');

test('the real summary pin returns to its authored reader without mounting the player', async t => {
  browser(t);
  const pin = addPin({ type: 'summary', label: first.title, payload: { videoId: first.videoId, title: first.title,
    subject: first.subject, instructor: first.instructor, date: first.date } });
  const navigation = [];
  const board = mount(PinboardView, { selectedYear: 5, setView: (...args) => navigation.push(args) });
  const card = findAll(board.tree, node => node.props.role === 'button' && textOf(node).includes(pin.label))[0];
  await card.props.onClick();
  assert.equal(JSON.parse(sessionStorage.getItem('vmx-video-pending-clip'))?.openSummary, true, 'the pin must hand off a reader intent');
  assert.deepEqual(navigation, [['videos', { videoId: first.videoId, openSummary: true, subject: first.subject }]]);
  board.unmount();
  const view = mount(VideoView, { initialSubject: first.subject });
  assert.equal(players(view).length, 0);
  await settle(view);
  assert.deepEqual(calls, [first.videoId]);
  assert.equal(textOf(readers(view)[0]), first.title);
  const prose = findAll(view.tree, node => node.props.dangerouslySetInnerHTML?.__html);
  assert.ok(prose.some(node => node.props.dangerouslySetInnerHTML.__html.includes('ante-mortem')));
  assert.equal(players(view).length, 0);
  assert.equal(sessionStorage.getItem('vmx-video-pending-clip'), null);
  view.unmount();
});

test('a summary ticket selects the canonical subject; normal palette and citation playback are unchanged', async t => {
  const fixture = browser(t, '?subject=surg2');
  fixture.ticket(first.videoId, { openSummary: true });
  let view = mount(VideoView, { initialSubject: 'surg2' });
  await settle(view);
  assert.equal(new URL(window.location.href).searchParams.get('subject'), first.subject);
  assert.equal(players(view).length, 0);
  assert.equal(textOf(readers(view)[0]), first.title);
  fixture.intent(first.videoId, false);
  view.flush();
  assert.equal(players(view).length, 1, 'a normal same-view video intent still opens playback');
  assert.equal(readers(view).length, 0);
  view.unmount();
  fixture.ticket(first.videoId); // Existing palette ticket does not request the reader.
  view = mount(VideoView, {});
  assert.equal(players(view).length, 1);
  assert.equal(readers(view).length, 0);
  view.unmount();
  fixture.ticket(first.videoId, { openSummary: 'true' });
  view = mount(VideoView, {});
  assert.equal(players(view).length, 1, 'only the exact boolean requests a reader');
  assert.equal(readers(view).length, 0);
  view.unmount();
  window.location = new URL(`https://fixture.test/app/videos?v=${first.videoId}&at=30`);
  view = mount(VideoView, {});
  assert.equal(players(view).length, 1);
  assert.equal(readers(view).length, 0);
  view.unmount();
});

test('a newer normal-video intent overrides a fresh same-ID reader ticket', async t => {
  const fixture = browser(t);
  const view = mount(VideoView, {});
  fixture.ticket(first.videoId, { openSummary: true });
  fixture.intent(first.videoId, false);
  view.flush();
  await settle(view);
  assert.equal(players(view).length, 1, 'the current navigation mode must win over the saved ticket');
  assert.equal(readers(view).length, 0);
  assert.deepEqual(calls, []);
  assert.equal(sessionStorage.getItem('vmx-video-pending-clip'), null);
  view.unmount();
});

test('a failed summary ticket write reports failure and opens only a safe shelf', async t => {
  const fixture = browser(t);
  fixture.ticket(first.videoId); // An earlier playback request must not open now.
  const writeTicket = sessionStorage.setItem;
  sessionStorage.setItem = () => { throw new Error('quota'); };
  const pin = addPin({ type: 'summary', label: first.title, payload: { videoId: first.videoId, subject: first.subject } });
  const navigation = [];
  const board = mount(PinboardView, { selectedYear: 5, setView: (...args) => navigation.push(args) });
  const card = findAll(board.tree, node => node.props.role === 'button' && textOf(node).includes(pin.label))[0];
  await card.props.onClick();
  board.unmount();
  const view = mount(VideoView, {});
  await settle(view);
  assert.equal(players(view).length, 0, 'a failed handoff must not replay a retained old ticket');
  assert.equal(readers(view).length, 0);
  assert.deepEqual(calls, []);
  assert.deepEqual(navigation, [['videos']]);
  assert.equal(alerts.length, 1);
  assert.match(alerts[0], /เปิดสรุปคลิปนี้ไม่สำเร็จ/);
  view.unmount();
  writeTicket('vmx-video-pending-clip', JSON.stringify({ videoId: first.videoId, at: Date.now() }));
  sessionStorage.removeItem = () => { throw new Error('cannot remove retained ticket'); };
  const blocked = mount(PinboardView, { selectedYear: 5, setView: (...args) => navigation.push(args) });
  await findAll(blocked.tree, node => node.props.role === 'button' && textOf(node).includes(pin.label))[0].props.onClick();
  assert.deepEqual(navigation, [['videos']], 'unsafe ticket cleanup failure must not trigger another navigation');
  assert.equal(alerts.length, 2);
  blocked.unmount();
});

test('newer reader intent wins over a late load, and an unmounted load cannot alert', async t => {
  const fixture = browser(t);
  const pending = new Map();
  globalThis.__summaryReturn.load = id => { calls.push(id); return new Promise((resolve, reject) => pending.set(id, { resolve, reject })); };
  const view = mount(VideoView, {});
  fixture.intent(first.videoId);
  view.flush();
  fixture.ticket(first.videoId, { openSummary: true });
  fixture.intent(second.videoId);
  view.flush();
  assert.ok(pending.has(second.videoId), 'the mounted view must load the selected summary');
  pending.get(second.videoId).resolve(second);
  await settle(view);
  assert.equal(textOf(readers(view)[0]), second.title);
  pending.get(first.videoId).resolve(first);
  await settle(view);
  assert.equal(textOf(readers(view)[0]), second.title);
  assert.equal(players(view).length, 0);
  fixture.intent(first.videoId);
  view.flush();
  view.unmount();
  pending.get(first.videoId).reject(new Error('offline after unmount'));
  await new Promise(resolve => setTimeout(resolve, 0));
  assert.deepEqual(alerts, []);
});

test('unknown, expired and missing summaries refuse safely; a failed reader load can recover', async t => {
  const fixture = browser(t);
  for (const [id, extra] of [['zzzzzzzzzzz', { openSummary: true }], [first.videoId, { openSummary: true, at: Date.now() - 31_000 }]]) {
    fixture.ticket(id, extra);
    const view = mount(VideoView, {});
    await settle(view);
    assert.equal(readers(view).length, 0);
    assert.equal(players(view).length, 0);
    view.unmount();
  }
  globalThis.__summaryReturn.load = async () => null;
  fixture.ticket(first.videoId, { openSummary: true });
  let view = mount(VideoView, {});
  await settle(view);
  assert.equal(readers(view).length, 0);
  assert.equal(players(view).length, 0);
  assert.equal(alerts.length, 1);
  view.unmount();
  globalThis.__summaryReturn.load = async () => { throw new Error('offline'); };
  fixture.ticket(first.videoId, { openSummary: true });
  view = mount(VideoView, {});
  await settle(view);
  assert.equal(textOf(readers(view)[0]), first.title);
  assert.ok(findAll(view.tree, node => node.props.dangerouslySetInnerHTML?.__html).some(node => node.props.dangerouslySetInnerHTML.__html.includes('โหลดสรุปคลิปไม่สำเร็จ')));
  assert.equal(players(view).length, 0);
  globalThis.__summaryReturn.load = async () => first;
  fixture.intent(first.videoId);
  view.flush();
  await settle(view);
  assert.equal(textOf(readers(view)[0]), first.title);
  assert.ok(findAll(view.tree, node => node.props.dangerouslySetInnerHTML?.__html).some(node => node.props.dangerouslySetInnerHTML.__html.includes('ante-mortem')));
  view.unmount();
});

test('explicit reader reload commits its exact ticket first, clears old citation and stays on write failure', async t => {
  const fixture = browser(t);
  const pin = addPin({ type: 'summary', label: first.title, payload: { videoId: first.videoId, subject: first.subject } });
  const savedPins = localStorage.getItem('vmx-pinboard');
  globalThis.__summaryReturn.load = async () => { throw new Error('failed module'); };
  fixture.ticket(first.videoId, { openSummary: true });
  const view = mount(VideoView, {});
  await settle(view);
  const reloadButton = findAll(view.tree, node => node.type === 'button' && textOf(node) === 'โหลดหน้าใหม่แล้วเปิดสรุป')[0];
  assert.ok(reloadButton, 'a failed reader offers explicit native recovery');
  const actions = [];
  window.location = new URL(`https://fixture.test/app/videos?subject=${first.subject}&v=${second.videoId}&at=30`);
  window.location.reload = () => actions.push(['reload', JSON.parse(sessionStorage.getItem('vmx-video-pending-clip'))]);
  assert.deepEqual(actions, [], 'failure never reloads automatically');
  const write = sessionStorage.setItem;
  sessionStorage.setItem = () => { throw new Error('quota'); };
  reloadButton.props.onClick();
  assert.deepEqual(actions, []);
  assert.equal(alerts.length, 1);
  assert.match(alerts[0], /เปิดสรุปใหม่ไม่สำเร็จ/);
  assert.equal(window.location.searchParams.get('v'), second.videoId, 'a denied ticket does not navigate');
  sessionStorage.setItem = (key, value) => { actions.push(['ticket', key]); write(key, value); };
  reloadButton.props.onClick();
  assert.equal(actions[0][0], 'ticket');
  assert.equal(actions[1][0], 'reload');
  assert.equal(actions[1][1].videoId, first.videoId);
  assert.equal(actions[1][1].openSummary, true);
  assert.ok(Date.now() - actions[1][1].at < 1000);
  assert.equal(window.location.searchParams.has('v'), false);
  assert.equal(window.location.searchParams.has('at'), false);
  assert.equal(localStorage.getItem('vmx-pinboard'), savedPins);
  assert.ok(JSON.parse(savedPins).some(row => row.id === pin.id));
  assert.equal(players(view).length, 0);
  view.unmount();
});

test('an uncommitted video render retains its ticket, and commit never removes a newer replacement', async t => {
  const fixture = browser(t);
  globalThis.__summaryReturn.load = async id => { calls.push(id); return id === first.videoId ? first : second; };
  fixture.ticket(first.videoId, { openSummary: true });
  const captured = sessionStorage.getItem('vmx-video-pending-clip');
  assert.throws(() => mount(props => {
    VideoView(props); // Real initializers run, but this render never commits its effects.
    throw new Error('discard-before-commit');
  }, {}), /discard-before-commit/);
  assert.equal(sessionStorage.getItem('vmx-video-pending-clip'), captured, 'an abandoned render cannot consume the intent');
  assert.deepEqual(calls, []);
  let view = mount(VideoView, {});
  await settle(view);
  assert.equal(textOf(readers(view)[0]), first.title);
  assert.equal(sessionStorage.getItem('vmx-video-pending-clip'), null, 'a surviving commit consumes the captured intent');
  view.unmount();
  fixture.ticket(first.videoId, { openSummary: true });
  const newer = JSON.stringify({ videoId: second.videoId, openSummary: true, at: Date.now() });
  let replace = true;
  view = mount(props => {
    const tree = VideoView(props);
    if (replace) { replace = false; sessionStorage.setItem('vmx-video-pending-clip', newer); }
    return tree;
  }, {});
  await settle(view);
  assert.equal(sessionStorage.getItem('vmx-video-pending-clip'), newer, 'the commit only acknowledges its exact captured raw row');
  view.unmount();
  view = mount(VideoView, {});
  await settle(view);
  assert.equal(textOf(readers(view)[0]), second.title);
  assert.equal(sessionStorage.getItem('vmx-video-pending-clip'), null);
  view.unmount();
});
