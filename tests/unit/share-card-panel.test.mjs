// ============================================================
// share-card-panel.test.mjs: one picture, drawn before the tap, handed out
// ============================================================
// The share panel (components/ShareCardPanel.jsx) under the recap, the daily
// question and the score card. It draws when it opens, in the app's theme,
// and every way out hands over that same file; the old daily card shared
// text only on a first tap and the recap drew its PNG after the tap, past
// the moment Safari allows a share. Inside LINE or Instagram, where a file
// can be neither shared nor downloaded, the panel says to press and hold.
//
// deliverCard (lib/share-card/share.js) is tested on its own below.
// ============================================================

import test from 'node:test';
import assert from 'node:assert/strict';
import { loadModule, mount, settle, findAll, textOf } from '../helpers/fake-react.mjs';
import { deliverCard } from '../../src/lib/share-card/share.js';

const STUBS = [
  { match: '/lib/share-card/fonts\\.js$', contents: 'export const ensureCardFonts = async () => ({ ready: true, missing: [] });' },
  { match: '/lib/share-card/kit\\.js$', contents: 'export const toBlob = async (canvas) => canvas.blob; export const feedCut = (card) => card.post;' },
  { match: '/lib/share-card/share\\.js$', contents: `
    export const deliverCard = async (blob, opts) => { globalThis.__share.delivered.push({ blob, opts }); await globalThis.__share.hold; return { outcome: globalThis.__share.outcome }; };
    export const triggerDownload = (blob, name) => globalThis.__share.downloads.push({ blob, name });` },
  { match: '/lib/inapp\\.js$', contents: `
    export const inAppBrowser = () => globalThis.__share.inApp;
    export const externalUrl = (app, href) => (app === 'line' ? href + '?openExternalBrowser=1' : null);
    export const APP_NAMES = { line: 'LINE', instagram: 'Instagram' };` },
  { match: '/lib/clipboard\\.js$', contents: 'export const copyText = async (t) => { globalThis.__share.copied.push(t); return { ok: true }; };' },
];

function fakeDraw() {
  const calls = [];
  const draw = (theme) => {
    calls.push(theme);
    const story = { blob: new Blob([`story-${theme}`], { type: 'image/png' }) };
    const post = { blob: new Blob([`post-${theme}`], { type: 'image/png' }) };
    return { card: { canvas: story, post } };
  };
  return { draw, calls };
}

// Node has its own read-only navigator; a test page gets its own.
const setGlobal = (name, value) => Object.defineProperty(globalThis, name, { value, configurable: true, writable: true });

const button = (tree, label) => findAll(tree, (n) => n.type === 'button' && textOf(n) === label)[0];

async function setup({ appTheme = 'dark', inApp = null, outcome = 'shared' } = {}) {
  globalThis.__share = { delivered: [], downloads: [], copied: [], inApp, outcome };
  globalThis.document = { documentElement: { dataset: { theme: appTheme } } };
  setGlobal('navigator', { userAgent: inApp ? 'Line/14' : 'Mozilla/5.0' });
  globalThis.window = { location: { href: 'https://vetmock.com/app/wrapped' } };
  globalThis.FileReader = class { readAsDataURL(blob) { blob.text().then((t) => { this.result = `data:image/png;base64,${t}`; this.onload(); }); } };
  const { default: Panel } = await loadModule('src/components/ShareCardPanel.jsx', { stubs: STUBS });
  const { draw, calls } = fakeDraw();
  const inst = mount(Panel, { draw, fileBase: 'vetmock-wrapped-1-mid-2569', title: 'สรุป', shareText: 'สรุปเป็นข้อความ', alt: 'ภาพสรุป' });
  await settle(inst);
  return { inst, calls };
}

test('opens in the app theme, draws once, and every share hands out that same file', async () => {
  const { inst, calls } = await setup({ appTheme: 'dark' });
  assert.deepEqual(calls, ['dark'], 'the first picture follows the app theme');
  const img = findAll(inst.tree, (n) => n.type === 'img')[0];
  assert.ok(img, 'the preview is the picture itself');
  assert.equal(img.props.alt, 'ภาพสรุป');
  await button(inst.tree, 'แชร์รูป').props.onClick();
  await button(inst.tree, 'แชร์รูป').props.onClick();
  const { delivered } = globalThis.__share;
  assert.equal(delivered.length, 2);
  assert.equal(await delivered[0].blob.text(), 'story-dark');
  assert.equal(delivered[0].blob, delivered[1].blob, 'a second share reuses the drawn file');
  assert.equal(delivered[0].opts.filename, 'vetmock-wrapped-1-mid-2569-9x16-dark.png');
  assert.equal(delivered[0].opts.text, 'สรุปเป็นข้อความ');
  assert.deepEqual(calls, ['dark'], 'sharing never draws again');
});

test('the options redraw once each and come back from the cache', async () => {
  const { inst, calls } = await setup({ appTheme: 'light' });
  button(inst.tree, 'โพสต์ 4:5').props.onClick();
  await settle(inst);
  button(inst.tree, 'มืด').props.onClick();
  await settle(inst);
  button(inst.tree, 'สตอรี่ 9:16').props.onClick();
  await settle(inst);
  button(inst.tree, 'สว่าง').props.onClick();
  await settle(inst);
  assert.deepEqual(calls, ['light', 'light', 'dark', 'dark'], 'each theme and shape is drawn once');
  await button(inst.tree, 'แชร์รูป').props.onClick();
  assert.equal(await globalThis.__share.delivered[0].blob.text(), 'story-light');
  button(inst.tree, 'โพสต์ 4:5').props.onClick();
  await settle(inst);
  assert.equal(calls.length, 4, 'a shape already drawn is not drawn again');
  await button(inst.tree, 'บันทึกรูป').props.onClick();
  const [saved] = globalThis.__share.downloads;
  assert.equal(await saved.blob.text(), 'post-light');
  assert.equal(saved.name, 'vetmock-wrapped-1-mid-2569-4x5-light.png');
});

test('inside LINE the panel says to press and hold, and sends no one to a browser without their answers', async () => {
  const { inst } = await setup({ inApp: 'line', outcome: 'show' });
  const img = findAll(inst.tree, (n) => n.type === 'img')[0];
  assert.match(img.props.src, /^data:image\/png/, 'a data: URL, which a long press can save');
  await button(inst.tree, 'แชร์รูป').props.onClick();
  inst.flush();
  const note = findAll(inst.tree, (n) => n.props?.role === 'note')[0];
  assert.ok(note, 'the press-and-hold note appears');
  assert.match(textOf(note), /กดค้างที่รูปด้านบน แล้วเลือกบันทึกรูป/);
  // The system browser has none of the answers LINE's own browser keeps, so
  // the recap it opened was empty.
  assert.equal(findAll(note, (n) => n.type === 'a').length, 0);
  assert.doesNotMatch(textOf(note), /เบราว์เซอร์/);
  await button(inst.tree, 'บันทึกรูป').props.onClick();
  assert.equal(globalThis.__share.downloads.length, 0, 'a download that does nothing in LINE is not attempted');
});

test('a drawing that fails says so and can be tried again', async () => {
  globalThis.__share = { delivered: [], downloads: [], copied: [], inApp: null, outcome: 'shared' };
  globalThis.document = { documentElement: { dataset: { theme: 'light' } } };
  setGlobal('navigator', { userAgent: 'Mozilla/5.0' });
  const { default: Panel } = await loadModule('src/components/ShareCardPanel.jsx', { stubs: STUBS });
  let fail = true;
  const inst = mount(Panel, { draw: () => { if (fail) throw new Error('no canvas'); return { card: { canvas: { blob: new Blob(['ok']) } } }; }, fileBase: 'x', title: 't', alt: 'a' });
  await settle(inst);
  assert.match(textOf(inst.tree), /สร้างรูปไม่สำเร็จ/);
  assert.equal(button(inst.tree, 'แชร์รูป').props.disabled, true);
  fail = false;
  await button(inst.tree, 'ลองอีกครั้ง').props.onClick();
  await settle(inst);
  assert.ok(findAll(inst.tree, (n) => n.type === 'img')[0], 'the retry draws the picture');
});

// ── deliverCard ───────────────────────────────────────────────────────────
const png = new Blob(['png'], { type: 'image/png' });

test('deliverCard shares the file where the browser can, and a cancel is not an error', async () => {
  const shared = [];
  const nav = { canShare: () => true, share: async (p) => shared.push(p) };
  assert.deepEqual(await deliverCard(png, { filename: 'a.png', title: 't', text: 'x', nav, ua: '' }), { outcome: 'shared' });
  assert.equal(shared[0].files[0].name, 'a.png');
  assert.equal(await shared[0].files[0].text(), 'png');
  const abort = { canShare: () => true, share: async () => { throw Object.assign(new Error('x'), { name: 'AbortError' }); } };
  assert.deepEqual(await deliverCard(png, { filename: 'a.png', nav: abort, ua: '' }), { outcome: 'cancelled' });
});

test('deliverCard falls back to a download, or to the press-and-hold note inside an app', async () => {
  const downloads = [];
  const download = (b, name) => downloads.push(name);
  const refused = { canShare: () => true, share: async () => { throw Object.assign(new Error('x'), { name: 'NotAllowedError' }); } };
  assert.deepEqual(await deliverCard(png, { filename: 'a.png', nav: refused, ua: 'Mozilla/5.0', download }), { outcome: 'downloaded' });
  assert.deepEqual(downloads, ['a.png']);
  const none = {};
  assert.deepEqual(await deliverCard(png, { filename: 'a.png', nav: none, ua: 'Mozilla/5.0 Instagram 300.0', download }), { outcome: 'show' });
  assert.deepEqual(await deliverCard(png, { filename: 'a.png', nav: { canShare: () => false, share: async () => {} }, ua: 'Line/14.2', download }), { outcome: 'show' });
  assert.equal(downloads.length, 1, 'no download is tried inside an app');
});

test('new numbers draw a new picture instead of showing the cached one', async () => {
  const { inst } = await setup({ appTheme: 'light' });
  const calls = [];
  const draw = (theme) => {
    calls.push(theme);
    return { card: { canvas: { blob: new Blob([`story-${theme}-new`], { type: 'image/png' }) } } };
  };
  inst.update({ draw });
  await settle(inst);
  assert.deepEqual(calls, ['light']);
  await button(inst.tree, 'แชร์รูป').props.onClick();
  assert.equal(await globalThis.__share.delivered[0].blob.text(), 'story-light-new');
});

test('closing the panel while it draws leaves no object URL behind', async () => {
  const made = [];
  const freed = [];
  const { createObjectURL, revokeObjectURL } = URL;
  URL.createObjectURL = () => { made.push(`blob:test/${made.length}`); return made[made.length - 1]; };
  URL.revokeObjectURL = (u) => freed.push(u);
  try {
    globalThis.__share = { delivered: [], downloads: [], copied: [], inApp: null, outcome: 'shared' };
    globalThis.document = { documentElement: { dataset: { theme: 'light' } } };
    setGlobal('navigator', { userAgent: 'Mozilla/5.0' });
    const { default: Panel } = await loadModule('src/components/ShareCardPanel.jsx', { stubs: STUBS });
    let finish;
    const pending = new Promise((resolve) => { finish = resolve; });
    const inst = mount(Panel, { draw: () => pending, fileBase: 'x', title: 't', alt: 'a' });
    await settle(inst);
    inst.unmount();
    finish({ card: { canvas: { blob: new Blob(['late']) } } });
    await new Promise((resolve) => setTimeout(resolve, 10));
    assert.deepEqual(made.filter((u) => !freed.includes(u)), [], 'a picture finished after closing kept its URL');
  } finally {
    URL.createObjectURL = createObjectURL;
    URL.revokeObjectURL = revokeObjectURL;
  }
});

test('a second tap while the share sheet is open does nothing, and a sheet already open is no failure', async () => {
  const { inst } = await setup({ appTheme: 'light' });
  let release;
  globalThis.__share.hold = new Promise((resolve) => { release = resolve; });
  const first = button(inst.tree, 'แชร์รูป').props.onClick();
  const second = button(inst.tree, 'แชร์รูป').props.onClick();
  release();
  await Promise.all([first, second]);
  assert.equal(globalThis.__share.delivered.length, 1, 'the second tap was handed out too');
  assert.equal(globalThis.__share.downloads.length, 0);

  const downloads = [];
  const busy = { canShare: () => true, share: async () => { throw Object.assign(new Error('x'), { name: 'InvalidStateError' }); } };
  assert.deepEqual(await deliverCard(png, { filename: 'a.png', nav: busy, ua: 'Mozilla/5.0', download: (b, n) => downloads.push(n) }), { outcome: 'cancelled' });
  assert.equal(downloads.length, 0, 'a second share sheet request used to fall back to a download');
});
