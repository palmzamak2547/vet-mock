import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { registerHooks } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { transformSync } from 'esbuild';
import {
  humanSource, humanSourceParts, sessionLabel,
  citeSeconds, recordingMoments, momentHref, momentFromSearch,
} from '../../src/lib/source-label.js';
import { QB, loadQB } from '../../src/data/questions.js';

test('a recording becomes the session a student sat in', () => {
  // avian คาบแรก, 4 ส.ค.
  assert.equal(sessionLabel('7XyI0SjnuBA'), 'คาบ 1 (4 ส.ค.)');
  assert.equal(humanSource('7XyI0SjnuBA [12:34]'), 'คาบ 1 (4 ส.ค.) นาที 12:34');
  assert.equal(humanSource('VET86 7XyI0SjnuBA [6:15-7:09]'), 'คาบ 1 (4 ส.ค.) นาที 6:15-7:09');
  assert.equal(humanSource('7XyI0SjnuBA [5:24], [3:47-4:01]'), 'คาบ 1 (4 ส.ค.) นาที 5:24, 3:47-4:01');
});

test('one recording that carries two timetabled sessions names both', () => {
  // One Health 9 ก.ย. and 16 ก.ย. are the same video
  assert.equal(sessionLabel('xkJw4A0OS7A'), 'คาบ 5 และ 6 (9 ก.ย.)');
});

test('an id that is not a taught session is left exactly as written', () => {
  assert.equal(sessionLabel('ZZZZZZZZZZZ'), null);
  assert.equal(humanSource('ZZZZZZZZZZZ [1:00]'), 'ZZZZZZZZZZZ [1:00]');
});

test('decks, compilations and notes read as what they are', () => {
  assert.equal(humanSource('deck oh-vet-role.pdf p4, p7'), 'สไลด์ หน้า 4, 7');
  assert.equal(humanSource('deck oh-eid.pdf p12-13'), 'สไลด์ หน้า 12-13');
  assert.equal(humanSource('TJ p5, p6'), 'ชีทรุ่นพี่ หน้า 5, 6');
  assert.equal(humanSource('deck p9'), 'สไลด์ หน้า 9');
  assert.equal(humanSource('MID 86 audit p71'), 'บันทึกรุ่นพี่ หน้า 71');
  assert.equal(humanSource('audit p12'), 'บันทึกรุ่นพี่ หน้า 12');
  assert.equal(humanSource('TJ p5'), 'ชีทรุ่นพี่ หน้า 5');
});

test('a scanned page of a senior paper reads as a scan, not as a file path', () => {
  assert.equal(
    humanSource('images/7.jpg ข้อ 15 ลักษณะเชื้อ Mycoplasma'),
    'ภาพสแกนข้อสอบเก่า ข้อ 15 ลักษณะเชื้อ Mycoplasma',
  );
});

test('a past-paper pointer is already readable and is not touched', () => {
  assert.equal(humanSource('ข้อสอบเก่า 203013'), 'ข้อสอบเก่า 203013');
  assert.equal(humanSource('TJ p5, ข้อสอบเก่า 202275'), 'ชีทรุ่นพี่ หน้า 5, ข้อสอบเก่า 202275');
});

test('empty and rubbish input do not throw', () => {
  assert.equal(humanSource(''), '');
  assert.equal(humanSource(null), '');
  assert.equal(humanSource(undefined), '');
  assert.equal(humanSource('   '), '');
});

test('a compound citation splits into readable pieces', () => {
  assert.deepEqual(
    humanSourceParts('7XyI0SjnuBA [8:15-8:42]; deck oh-vet-role.pdf p4'),
    ['คาบ 1 (4 ส.ค.) นาที 8:15-8:42', 'สไลด์ หน้า 4'],
  );
});

// ============================================================
// The source chip under every question, rendered
// ============================================================
// QSourceChip.jsx and VideoView.jsx are JSX, so the test compiles the real
// files with esbuild and renders them with a stub React whose elements are
// plain { type, props } objects. Function components the chip draws (its
// Row) are called; everything else is read off the tree.

const COMPILED = {
  'vetmock-test:q-source-chip': 'src/components/QSourceChip.jsx',
  'vetmock-test:video-view': 'src/views/VideoView.jsx',
};
const STUB = 'vetmock-test:stub:';
const STUBS = {
  react: [
    'const h = () => globalThis.__vmxHooks;',
    'export const useState = (v) => h().useState(v);',
    'export const useEffect = (f, d) => h().useEffect(f, d);',
    'export const useMemo = (f) => f();',
    'export const useRef = (v) => h().useRef(v);',
    'export const useCallback = (f) => f;',
  ].join('\n'),
  'react/jsx-runtime': [
    "export const Fragment = 'fragment';",
    'export const jsx = (type, props, key) => ({ type, props: props || {}, key });',
    'export const jsxs = jsx;',
  ].join('\n'),
  // VideoView's children that need a browser. The test reads the tree
  // VideoView and its player build, not the insides of these.
  '../components/BackBar.jsx': 'export default function BackBar() { return null; }',
  '../components/SummaryModal.jsx': 'export default function SummaryModal() { return null; }',
  '../components/VideoNotePanel.jsx': 'export default function VideoNotePanel() { return null; }',
  '../hooks/useModalFocus.js': 'export const useModalFocus = () => ({ current: null });',
};
const repoRoot = fileURLToPath(new URL('../../', import.meta.url));
const fileUrl = (rel) => pathToFileURL(repoRoot + rel).href;

registerHooks({
  resolve(specifier, context, nextResolve) {
    if (Object.hasOwn(COMPILED, specifier)) return { url: specifier, shortCircuit: true };
    if (Object.hasOwn(COMPILED, context.parentURL || '')) {
      if (Object.hasOwn(STUBS, specifier)) return { url: STUB + specifier, shortCircuit: true };
      return nextResolve(specifier, { ...context, parentURL: fileUrl(COMPILED[context.parentURL]) });
    }
    return nextResolve(specifier, context);
  },
  load(url, context, nextLoad) {
    if (Object.hasOwn(COMPILED, url)) {
      const file = repoRoot + COMPILED[url];
      const { code } = transformSync(readFileSync(file, 'utf8'), { loader: 'jsx', jsx: 'automatic', format: 'esm', sourcefile: file });
      return { format: 'module', shortCircuit: true, source: code };
    }
    if (url.startsWith(STUB)) return { format: 'module', shortCircuit: true, source: STUBS[url.slice(STUB.length)] };
    return nextLoad(url, context);
  },
});

const { default: QSourceChip } = await import('vetmock-test:q-source-chip');
await loadQB();

/** A hook set for one render: state starts at its initial value, effects are kept to run by hand. */
function hooks({ open } = {}) {
  const effects = [];
  return {
    effects,
    useState: (v) => [v === false && open !== undefined ? open : (typeof v === 'function' ? v() : v), () => {}],
    useEffect: (fn, deps) => { effects.push({ fn, deps }); },
    useRef: (v) => ({ current: v }),
  };
}

/** Call every function component in a tree, so what remains is host elements and text. */
function expand(node) {
  if (node == null || typeof node === 'boolean') return null;
  if (Array.isArray(node)) return node.map(expand);
  if (typeof node !== 'object') return node;
  if (typeof node.type === 'function') return expand(node.type(node.props));
  return { ...node, props: { ...node.props, children: expand(node.props.children) } };
}
const textOf = (node) => {
  if (node == null) return '';
  if (Array.isArray(node)) return node.map(textOf).join('');
  if (typeof node !== 'object') return String(node);
  return textOf(node.props.children);
};
const findAll = (node, pred, out = []) => {
  if (!node || typeof node !== 'object') return out;
  if (Array.isArray(node)) { for (const c of node) findAll(c, pred, out); return out; }
  if (pred(node)) out.push(node);
  findAll(node.props?.children, pred, out);
  return out;
};

function renderChip(q, { open = false } = {}) {
  globalThis.__vmxHooks = hooks({ open });
  const tree = expand(QSourceChip({ q }));
  return { tree, text: textOf(tree).replace(/\s+/g, ' ') };
}
const bankRow = (subject, id) => {
  const q = QB.find((x) => x.subject === subject && x.id === id);
  assert.ok(q, `${subject}#${id} is in the bank`);
  return q;
};

test('the source panel reads in Thai, with no internal ids or status words', () => {
  // A row with every citation field: source, verified, a flag and tags.
  const full = bankRow('com5', 568);
  const { text } = renderChip(full, { open: true });
  for (const english of ['Source', 'Verified', 'Flag', 'Tags']) {
    assert.doesNotMatch(text, new RegExp(`\\b${english}\\b`), `"${english}" is still a row label`);
  }
  for (const thai of ['ที่มา', 'ตรวจกับ', 'หมายเหตุ', 'แท็ก']) assert.ok(text.includes(thai), `no "${thai}" label`);
  // ReviewView's wording for a major flag.
  const major = renderChip({ ...full, flag: { ...full.flag, severity: 'major' } }, { open: true });
  assert.ok(major.text.includes('ข้อควรระวังสำคัญ'));

  // An approved VetWiki citation shows its title, not "page#anchor".
  const cited = renderChip(bankRow('com5', 501), { open: true });
  assert.ok(cited.text.includes('Clinical Presentation & Risk Factors'));
  assert.doesNotMatch(cited.text, /com5-canine-viral-enteritis|#clinical-presentation|เปิดบทความ:/);

  // A displayable wiki reference with no approved citation behind it.
  const refOnly = renderChip({
    id: 999999999, subject: 'no-such-subject', source: 'deck p9',
    wikiRefs: [{ pageId: 'com5-rabies', anchorId: 'anchor-12', label: 'Rabies: clinical signs', status: 'approved', mappingStatus: 'verified' }],
  }, { open: true });
  assert.ok(refOnly.text.includes('Rabies: clinical signs'));
  assert.doesNotMatch(refOnly.text, /Target|Status|Mapping|com5-rabies|anchor-12|#|approved|verified/);
});

// ── the source line ─────────────────────────────────────────────────
// 46 food-industry rows store their source as "WRttiWQ7D9s [28:22]" with no
// examOrigin, so the chip's one visible line printed the bare YouTube id.
const RAW_MOMENT = /(?<![0-9A-Za-z_-])[0-9A-Za-z_-]{11}\s*,?\s*\[\d/;

test('the source line under a question names the lecture, not a YouTube id', () => {
  const q = bankRow('food-industry', 207001);
  assert.equal(q.source, 'WRttiWQ7D9s [28:22]', 'the stored pointer is unchanged');
  const closed = renderChip(q);
  assert.match(closed.text, /ที่มา: คาบ 3 \(2 ก\.ย\.\) นาที 28:22/);
  assert.doesNotMatch(closed.text, /WRttiWQ7D9s/);
  const opened = renderChip(q, { open: true });
  assert.doesNotMatch(opened.text, /WRttiWQ7D9s/, 'the expanded source row is read through humanSource too');
});

test('no row that cites a recording shows its raw id anywhere on the chip', () => {
  const rows = QB.filter((q) => RAW_MOMENT.test(String(q.source || '')));
  assert.ok(rows.length >= 53, `the bank still holds the rows this is about (${rows.length})`);
  const shown = [];
  for (const q of rows) {
    for (const open of [false, true]) {
      const { text } = renderChip(q, { open });
      if (RAW_MOMENT.test(text)) shown.push(`${q.subject}#${q.id}${open ? ' (open)' : ''}`);
    }
  }
  assert.deepEqual(shown, []);
});

// ============================================================
// A cited moment a student can open
// ============================================================
// 546 questions cite a lecture moment, "WRttiWQ7D9s [26:48]", and none of
// those citations could be opened: the student read "คาบ 3 นาที 26:48" and
// then had to find the clip and scrub to that minute by hand. The citation
// now carries the clip and the second, and the clip page plays from there.

test('a bracketed time is the second the recording is at', () => {
  assert.equal(citeSeconds('26:48'), 1608);
  assert.equal(citeSeconds('0:05'), 5);
  // A long recording's player counts minutes past the hour.
  assert.equal(citeSeconds('129:25'), 7765);
  assert.equal(citeSeconds('1:02:03'), 3723);
  assert.equal(citeSeconds(' 6:15 '), 375);
  for (const bad of ['', '6', '6:5', '6:75', '1:75:00', '1:02:75', 'p12', null, undefined]) {
    assert.equal(citeSeconds(bad), null, JSON.stringify(bad));
  }
});

test('each cited moment is a clip and a second, in order and once each', () => {
  assert.deepEqual(recordingMoments('MID 86 audit p12; WRttiWQ7D9s [26:48]'), [
    { videoId: 'WRttiWQ7D9s', seconds: 1608, stamp: '26:48', session: 'คาบ 3 (2 ก.ย.)', label: 'คาบ 3 (2 ก.ย.) นาที 26:48' },
  ]);
  // A range opens where it starts; a bracket may hold a list.
  assert.deepEqual(
    recordingMoments('VET86 7XyI0SjnuBA [5:24], [3:47-4:01]').map((m) => [m.seconds, m.stamp]),
    [[324, '5:24'], [227, '3:47-4:01']],
  );
  assert.deepEqual(
    recordingMoments('7XyI0SjnuBA [131:42-133:10, 121:47]').map((m) => m.seconds),
    [7902, 7307],
  );
  // The same second cited twice is one moment.
  assert.equal(recordingMoments('7XyI0SjnuBA [5:24] + 7XyI0SjnuBA [5:24-6:00]').length, 1);
});

test('text with no taught recording has no moment', () => {
  assert.deepEqual(recordingMoments('ZZZZZZZZZZZ [1:00]'), []);
  assert.deepEqual(recordingMoments('deck oh-vet-role.pdf p4, p7'), []);
  assert.deepEqual(recordingMoments('7XyI0SjnuBA'), []);
  assert.deepEqual(recordingMoments('xx7XyI0SjnuBA [1:00]'), [], 'an id is never read out of a longer token');
  assert.deepEqual(recordingMoments(null), []);
});

test('a moment is an address on the clip page, and the address reads back', () => {
  const href = momentHref({ videoId: 'WRttiWQ7D9s', seconds: 1608 });
  assert.equal(href, '/app/videos?v=WRttiWQ7D9s&t=1608');
  assert.deepEqual(momentFromSearch(href.slice(href.indexOf('?'))), { videoId: 'WRttiWQ7D9s', seconds: 1608 });
  assert.deepEqual(momentFromSearch('?subject=food-industry&v=-9iGaiDgagI'), { videoId: '-9iGaiDgagI', seconds: 0 });
  assert.deepEqual(momentFromSearch('?v=WRttiWQ7D9s&t=abc'), { videoId: 'WRttiWQ7D9s', seconds: 0 });
  for (const none of ['', '?subject=food-industry', '?v=short', '?v=<script>alert</script>', null]) {
    assert.equal(momentFromSearch(none), null, JSON.stringify(none));
  }
});

const momentLinks = (tree) => findAll(tree, (n) => n.type === 'a' && String(n.props.href || '').startsWith('/app/videos'));

test('a cited moment opens its clip at that second, in a tab of its own', () => {
  // #207000 cites [26:48] in source and [26:48-28:22] in verified: one moment.
  const { tree } = renderChip(bankRow('food-industry', 207000), { open: true });
  assert.deepEqual(momentLinks(tree).map((a) => a.props.href), ['/app/videos?v=WRttiWQ7D9s&t=1608']);
  // #207001 cites [26:48-28:22] and [28:22]: two moments of one clip.
  const two = renderChip(bankRow('food-industry', 207001), { open: true });
  const links = momentLinks(two.tree);
  assert.deepEqual(links.map((a) => a.props.href), ['/app/videos?v=WRttiWQ7D9s&t=1608', '/app/videos?v=WRttiWQ7D9s&t=1702']);
  for (const a of links) {
    // The question the student is on stays open behind it.
    assert.equal(a.props.target, '_blank');
    assert.match(a.props.rel, /noopener/);
    assert.match(a.props['aria-label'], /คาบ 3 \(2 ก\.ย\.\) นาที/);
  }
  // Closed, the chip is one line and links nowhere.
  assert.equal(findAll(renderChip(bankRow('food-industry', 207000)).tree, (n) => n.type === 'a').length, 0);
});

test('a question that cites no moment gets no clip link', () => {
  for (const q of [bankRow('com5', 568), bankRow('com5', 501)]) {
    const { tree } = renderChip(q, { open: true });
    assert.equal(findAll(tree, (n) => String(n.props?.href || '').startsWith('/app/videos')).length, 0, `${q.subject}#${q.id}`);
  }
});

// ── the clip page ───────────────────────────────────────────────────

// VideoView reads the address and the browser's storage when it renders.
const memoryStorage = () => {
  const m = new Map();
  return { getItem: (k) => (m.has(k) ? m.get(k) : null), setItem: (k, v) => m.set(k, String(v)), removeItem: (k) => m.delete(k) };
};
globalThis.window = {
  location: { search: '', href: 'https://vetmock.vercel.app/app/videos', pathname: '/app/videos' },
  history: { state: null, replaceState() {}, pushState() {} },
  localStorage: memoryStorage(),
  addEventListener() {},
  removeEventListener() {},
};
globalThis.document = { hidden: false, addEventListener() {}, removeEventListener() {} };

const { default: VideoView } = await import('vetmock-test:video-view');

function renderVideoView(search) {
  window.location.search = search;
  window.location.href = `https://vetmock.vercel.app/app/videos${search}`;
  globalThis.__vmxHooks = hooks();
  return VideoView({ goHome() {} });
}
const playerIn = (tree) => findAll(tree, (n) => n.type?.name === 'PlayerModal')[0] || null;

/** Mount the player a PlayerModal element describes and return what YT.Player was given. */
async function mountPlayer(modal) {
  const h = hooks();
  globalThis.__vmxHooks = h;
  const tree = modal.type(modal.props);
  const box = findAll(tree, (n) => n.type === 'div' && String(n.key || '').startsWith('yt-'))[0];
  assert.ok(box, 'the player box is drawn');
  box.props.ref.current = {};
  const made = [];
  window.YT = { Player: function Player(node, opts) { made.push(opts); this.destroy = () => {}; } };
  try {
    const effect = h.effects.find((e) => e.deps?.length === 2 && typeof e.deps[0] === 'string' && e.deps[0].length === 11);
    assert.ok(effect, 'the player effect is registered for this clip');
    effect.fn();
    await new Promise((r) => setTimeout(r, 0));
  } finally {
    delete window.YT;
  }
  assert.equal(made.length, 1);
  return { opts: made[0], tree };
}

test('the clip page opens a cited moment at once and plays from that second', async () => {
  const modal = playerIn(renderVideoView('?v=WRttiWQ7D9s&t=1608'));
  assert.ok(modal, 'the player opens without a tap');
  const { opts, tree } = await mountPlayer(modal);
  assert.equal(opts.videoId, 'WRttiWQ7D9s');
  assert.equal(opts.playerVars.start, 1608);
  assert.equal(opts.playerVars.autoplay, 1);
  // The way out to YouTube, for when the in-app player cannot start, lands on
  // the same second.
  const out = findAll(tree, (n) => n.type === 'a' && String(n.props.href || '').startsWith('https://www.youtube.com/watch'))[0];
  assert.equal(out.props.href, 'https://www.youtube.com/watch?v=WRttiWQ7D9s&t=1608s');
});

test('closing a cited clip takes the moment out of the address, and nothing else', () => {
  const writes = [];
  const replaceState = window.history.replaceState;
  window.history.replaceState = (state, _title, url) => writes.push(String(url));
  try {
    playerIn(renderVideoView('?subject=food-industry&v=WRttiWQ7D9s&t=1608')).props.onClose();
    assert.deepEqual(writes, ['https://vetmock.vercel.app/app/videos?subject=food-industry']);
    // A clip opened from a card leaves the address alone, as before.
    writes.length = 0;
    const modal = playerIn(renderVideoView('?v=WRttiWQ7D9s&t=1608'));
    window.location.href = 'https://vetmock.vercel.app/app/videos?subject=food-industry';
    modal.props.onClose();
    assert.deepEqual(writes, []);
  } finally {
    window.history.replaceState = replaceState;
  }
});

test('the clip page without a moment behaves as it always did', async () => {
  assert.equal(playerIn(renderVideoView('')), null, 'nothing opens by itself');
  assert.equal(playerIn(renderVideoView('?subject=food-industry')), null);
  // A clip opened from a card plays from its start.
  const modal = playerIn(renderVideoView('?v=WRttiWQ7D9s&t=1608'));
  const card = { ...modal, props: { ...modal.props, video: { url: 'https://www.youtube.com/watch?v=WRttiWQ7D9s', topic: 'x', subject: 'food-industry' } } };
  const { opts, tree } = await mountPlayer(card);
  assert.equal('start' in opts.playerVars, false);
  const out = findAll(tree, (n) => n.type === 'a' && String(n.props.href || '').startsWith('https://www.youtube.com/watch'))[0];
  assert.equal(out.props.href, 'https://www.youtube.com/watch?v=WRttiWQ7D9s');
});
