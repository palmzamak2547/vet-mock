// ============================================================
// video-phone-shelf — the clip shelf on a phone starts at the reader's year
// ============================================================
// At 390px the subject filter was 35 chips in five headed groups, two and a
// half screens before the first clip, and the full shelf opened on a year-4
// lab. The reader's year now leads both the chips and the clips, every other
// year folds behind one control on a phone (wider screens keep it open, and
// a shelf already filtered to one of those years opens it), and a custom
// clip's edit and delete buttons say what they do.
// ============================================================

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { loadModule, mount, settle, findAll, textOf } from '../helpers/fake-react.mjs';
import { COMPACT_READING_QUERY } from '../../src/lib/reading-layout.js';
import { yearForSubject } from '../../src/data/curriculum.js';
import { VIDEO_LIBRARY } from '../../src/data/videos.js';

const { default: VideoView } = await loadModule('src/views/VideoView.jsx', { stubs: [
  { match: '\\.css$', contents: '' },
  { match: 'Mochi\\.jsx$', contents: 'export default () => null;' },
  { match: '/components/(BackBar|FeatureTip|SummaryModal|VideoNotePanel)\\.jsx$', contents: 'export default () => null;' },
] });

function browser(t, { compact, href = 'https://vetmock.com/app/videos' }) {
  const mem = () => { const m = new Map(); return { getItem: (k) => m.get(k) ?? null, setItem: (k, v) => m.set(k, String(v)), removeItem: (k) => m.delete(k) }; };
  globalThis.localStorage = mem();
  globalThis.sessionStorage = mem();
  globalThis.window = {
    localStorage, sessionStorage, location: new URL(href),
    matchMedia: (q) => ({ matches: compact && q === COMPACT_READING_QUERY }),
    history: { state: null, replaceState(state, _t, url) { this.state = state; window.location = new URL(url, window.location.href); } },
    addEventListener() {}, removeEventListener() {},
  };
  globalThis.IntersectionObserver = class { observe() {} disconnect() {} unobserve() {} };
  t.after(() => { for (const k of ['window', 'localStorage', 'sessionStorage', 'IntersectionObserver']) delete globalThis[k]; });
}
const otherToggle = (v) => findAll(v.tree, (n) => n.type === 'button' && n.props.className === 'vmx-video-other-toggle')[0];
const cardTitles = (v) => findAll(v.tree, (n) => n.props?.className === 'vmx-video-card-title').map(textOf);

test('on a phone the reader\'s year leads and the other years fold behind one control', async (t) => {
  browser(t, { compact: true });
  const v = mount(VideoView, { goHome() {}, selectedYear: 5 });
  await settle(v);
  const toggle = otherToggle(v);
  assert.ok(toggle, 'one control for every other year');
  assert.equal(toggle.props['aria-expanded'], false);
  assert.match(textOf(toggle), /วิชาปีอื่น \d+ วิชา/);
  const panel = findAll(v.tree, (n) => n.props?.id === 'vmx-video-other-years')[0];
  assert.equal(panel.props.hidden, true);
  const first = VIDEO_LIBRARY.find((clip) => clip.topic === cardTitles(v)[0]);
  assert.equal(yearForSubject(first.subject), 5, 'the first clip on the full shelf is the reader\'s year');
  toggle.props.onClick();
  v.flush();
  assert.equal(otherToggle(v).props['aria-expanded'], true);
  v.unmount();
});

test('wider screens keep the other years open', async (t) => {
  browser(t, { compact: false });
  const v = mount(VideoView, { goHome() {}, selectedYear: 5 });
  await settle(v);
  assert.equal(otherToggle(v).props['aria-expanded'], true);
  v.unmount();
});

test('custom clip actions are named, 44px controls', () => {
  const src = readFileSync(new URL('../../src/views/VideoView.jsx', import.meta.url), 'utf8');
  assert.match(src, /aria-label=\{`แก้ไขคลิป \$\{video\.topic\}`\}/);
  assert.match(src, /aria-label=\{`ลบคลิป \$\{video\.topic\}`\}/);
  const css = readFileSync(new URL('../../src/styles.css', import.meta.url), 'utf8');
  assert.match(css, /\.vmx-video-card-action \{[^}]*width: var\(--touch-min\); height: var\(--touch-min\)/);
});
