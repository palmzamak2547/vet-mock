// ============================================================
// card-style.test.mjs: "การ์ดของฉัน"
// ============================================================
// The token a style is stored as, what a student may wear, the promise that
// the studio's preview, a classmate's card and the share image are one
// picture (same words, same colours, same crop of the plate), and the
// classmate's view with the database column present and absent.
// ============================================================
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { registerHooks } from 'node:module';
import { transformSync } from 'esbuild';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

const sourceRoot = new URL('../../src/', import.meta.url).href;
registerHooks({
  load(url, context, nextLoad) {
    if (url.startsWith(sourceRoot) && url.endsWith('.css')) return { format: 'module', shortCircuit: true, source: '' };
    if (url.startsWith(sourceRoot) && url.endsWith('.jsx')) {
      const { code } = transformSync(readFileSync(new URL(url), 'utf8'), { loader: 'jsx', jsx: 'automatic', format: 'esm', sourcefile: url });
      return { format: 'module', shortCircuit: true, source: code };
    }
    return nextLoad(url, context);
  },
});

const {
  parseCardToken, encodeCard, readCard, cardFace, cardAllowance, wearable, BADGE_IDS, CARD_BACKDROPS, DEFAULT_CARD, isDefaultCard, darkPlatePixel,
} = await import('../../src/lib/card-style.js');
const { BADGE_ART } = await import('../../src/data/art.js');
const { fetchCardStyles, saveCardStyle, resetCardStyleRemote, cardStylesAbsent } = await import('../../src/lib/card-style-remote.js');
const { drawStudentCard, coverCrop, cardBox } = await import('../../src/lib/share-card/student-card.js');
const { default: StudentCard } = await import('../../src/components/StudentCard.jsx');
const { memberFaces } = await import('../../src/components/MemberCards.jsx');

// ── Tokens ─────────────────────────────────────────────────────────────────
test('a style round-trips through its token, and hostile strings are no style', () => {
  const card = { backdrop: 'field', frame: 'gilt', title: 'streak-7', trophies: ['streak-7', 'questions-100'] };
  const token = encodeCard(card);
  assert.equal(token, 'c1.bfield.fgilt.tstreak-7.sstreak-7,questions-100');
  assert.deepEqual(parseCardToken(token), card);
  for (const bad of [null, '', 'c2.bfield', 'c1.bfield<script>', `c1.${'s'.repeat(130)}`, 'C1.bfield', '__proto__']) {
    assert.equal(parseCardToken(bad), null, String(bad));
  }
  assert.deepEqual(parseCardToken('c1.bnope.fnope.tnope.x1'), { ...DEFAULT_CARD, trophies: [] }, 'values off their lists fall back');
  assert.equal(parseCardToken('c1.sstreak-7,streak-7,perfect,night-owl,early-bird').trophies.length, 3);
  assert.deepEqual(readCard('garbage'), { ...DEFAULT_CARD, trophies: [] });
  assert.ok(isDefaultCard(DEFAULT_CARD));
  assert.deepEqual([...BADGE_IDS].sort(), Object.keys(BADGE_ART).sort());
  for (const id of CARD_BACKDROPS) assert.equal(readCard(encodeCard({ ...DEFAULT_CARD, backdrop: id })).backdrop, id);
  assert.ok(CARD_BACKDROPS.every((id) => id === 'paper' || cardFace({ card: { backdrop: id } }).backdrop.src), 'every backdrop but plain paper has its plate');
});

test('a student wears only what they earned; the rest falls back to the free choice', () => {
  const none = cardAllowance({ history: [], srCards: {}, currentStreak: 0 });
  const worn = wearable({ backdrop: 'field', frame: 'foil', title: 'streak-30', trophies: ['streak-30'] }, none);
  assert.deepEqual(worn, { backdrop: 'field', frame: 'plain', title: null, trophies: [] });
  const day = (d) => `2026-10-${String(d).padStart(2, '0')}T10:00:00+07:00`;
  const history = Array.from({ length: 120 }, (_, i) => ({ date: day(1 + (i % 8)), correct: true, subject: 's' }));
  const some = cardAllowance({ history, srCards: {}, currentStreak: 8 });
  assert.ok(some.frames.includes('ledger'), '100 answers earn the double rule');
  assert.ok(some.frames.includes('gilt'), 'a 7-day streak earns the gold edge');
  assert.ok(!some.frames.includes('seal'));
});

// ── One picture: the preview and the share image ───────────────────────────
// A recording 2D context: every text with its colour, every picture with its
// source rectangle and alpha, every fill colour.
function recorder() {
  const log = { texts: [], images: [], fills: [], puts: [] };
  const state = { font: '10px x', fillStyle: '#000', globalAlpha: 1 };
  const stack = [];
  const sizeOf = () => Number(/(\d+(?:\.\d+)?)px/.exec(state.font)?.[1] || 10);
  const ctx = new Proxy({}, {
    get(_, key) {
      if (key in state) return state[key];
      if (key === 'measureText') return (s) => { const w = String(s).length * sizeOf() * 0.5; return { width: w, actualBoundingBoxAscent: sizeOf() * 0.8, actualBoundingBoxDescent: sizeOf() * 0.2, actualBoundingBoxLeft: 0, actualBoundingBoxRight: w }; };
      if (key === 'fillText') return (s) => log.texts.push({ text: String(s), color: state.fillStyle });
      if (key === 'drawImage') return (img, ...a) => log.images.push({ src: img.src, args: a, alpha: state.globalAlpha });
      if (key === 'fill') return () => log.fills.push(state.fillStyle);
      if (key === 'save') return () => stack.push({ ...state });
      if (key === 'restore') return () => Object.assign(state, stack.pop() || {});
      // Every pixel the paper of a plate: the negative must turn it dark.
      if (key === 'getImageData') return (x, y, w, h) => ({ data: new Uint8ClampedArray(w * h * 4).fill(245) });
      if (key === 'putImageData') return (d) => log.puts.push([...d.data.slice(0, 3)]);
      if (key === 'createLinearGradient' || key === 'createConicGradient') return () => ({ addColorStop() {} });
      return () => {};
    },
    set(_, key, value) { state[key] = value; return true; },
  });
  return { ctx, log };
}

function withCanvas(fn) {
  const rec = recorder();
  const prev = globalThis.document;
  globalThis.document = { createElement: () => ({ width: 0, height: 0, getContext: () => rec.ctx }), documentElement: { dataset: {} } };
  try { fn(); } finally { globalThis.document = prev; }
  return rec.log;
}

const preset = { backdrop: 'field', frame: 'gilt', title: 'streak-7', trophies: ['streak-7', 'questions-100'] };
const plate = { src: '/art/ig-backgrounds/field.webp', naturalWidth: 1080, naturalHeight: 1350 };

for (const theme of ['light', 'dark']) {
  test(`the studio's preview and the share image show one card (${theme})`, () => {
    const face = cardFace({ card: preset, name: 'หมอปาล์ม', picture: '🐶', yearLine: 'ปี 5', stats: { answered: 1234, streak: 9, trophies: 4 }, theme });
    const html = renderToStaticMarkup(createElement(StudentCard, { face, still: true }));
    const art = { plate, trophies: face.trophies.map((t) => ({ src: t.src, naturalWidth: 64, naturalHeight: 64 })) };
    const log = withCanvas(() => drawStudentCard(face, { art }));
    // The share card keeps a number and its unit on one line with a no-break space.
    const drawn = (text) => log.texts.find((t) => t.text.replace(/\u00a0/g, ' ') === text);

    // The same words, in the same inks.
    for (const [text, colour] of [['หมอปาล์ม', face.colours.ink], [face.title, face.colours.title], ['VetMock', face.colours.brand], ['ปี 5', face.colours.soft], ['1,234', face.colours.ink]]) {
      assert.ok(html.includes(text), `preview shows ${text}`);
      assert.equal(drawn(text)?.color, colour, `share image draws ${text} in ${colour}`);
    }
    for (const s of face.stats) {
      assert.ok(html.includes(`<dt>${s.label}</dt>`) && drawn(s.label), s.label);
      assert.ok(html.includes(`<small>${s.unit}</small>`) && drawn(s.unit), s.unit);
    }
    // The same colours: the preview's variables are the share image's paint.
    for (const [v, c] of [['--sc-stock', face.colours.stock], ['--sc-ink', face.colours.ink], ['--sc-title', face.colours.title], ['--sc-gold', face.colours.gold]]) {
      assert.ok(html.includes(`${v}:${c}`), `${v} is ${c}`);
    }
    assert.ok(log.fills.includes(face.colours.stock), 'the card stock is painted');
    assert.ok(html.includes(`--sc-plate:${face.colours.plateOpacity}`));
    // The same plate, cropped the same way (cover, anchored bottom centre).
    assert.ok(html.includes(`src="${plate.src}"`) && html.includes('is-frame-gilt'));
    assert.ok(html.includes(`--sc-plate-filter:${face.colours.plateFilter}`));
    const box = cardBox();
    const crop = coverCrop(1080, 1350, box.w, box.h);
    assert.equal(crop.sy + crop.sh, 1350, 'the crop keeps the bottom of the plate, as object-position 50% 100%');
    // The plate is cut from the source as the preview cuts it.
    const cut = log.images.find((i) => i.src === plate.src);
    assert.deepEqual(cut.args.slice(0, 4).map(Math.round), [crop.sx, crop.sy, crop.sw, crop.sh].map(Math.round));
    if (theme === 'dark') {
      // In dark the preview prints the plate in negative (CSS filter); so does the image.
      assert.equal(face.colours.plateFilter, 'invert(1) hue-rotate(180deg)');
      assert.deepEqual(log.puts[0], darkPlatePixel(245, 245, 245));
      const shown = log.images.find((i) => i.src === undefined && i.args.length === 4);
      assert.deepEqual(shown.args.map(Math.round), [box.x, box.y, box.w, box.h].map(Math.round));
      assert.equal(shown.alpha, face.colours.plateOpacity);
    } else {
      assert.equal(face.colours.plateFilter, 'none');
      assert.equal(log.puts.length, 0);
      assert.equal(cut.alpha, face.colours.plateOpacity);
    }
    // The same trophies.
    for (const t of face.trophies) {
      assert.ok(html.includes(`alt="${t.label}"`));
      assert.ok(log.images.some((i) => i.src === t.src));
    }
  });
}

// ── A classmate's view, with the column present and absent ────────────────
const ME = '11111111-1111-4111-8111-111111111111';
const PAT = '22222222-2222-4222-8222-222222222222';
const members = [{ id: ME, username: 'palm', avatar_emoji: '🐶', role: 'admin' }, { id: PAT, username: 'pat', avatar_emoji: '🐱', role: 'member' }];

function fakeClient(rpc) {
  const calls = [];
  return {
    calls,
    rpc: async (name, args) => { calls.push({ rpc: name, args }); return rpc(name, args); },
    from: (table) => { calls.push({ from: table }); throw new Error('the card never reads a table directly'); },
  };
}

test('before the migration: no column is asked for, classmates show the default card, the own style stays on the device', async () => {
  resetCardStyleRemote();
  const client = fakeClient(() => ({ data: null, error: { code: 'PGRST202', message: 'Could not find the function public.card_styles(p_ids) in the schema cache' } }));
  const styles = await fetchCardStyles([ME, PAT], { client });
  assert.equal(styles.size, 0);
  assert.ok(cardStylesAbsent());
  await fetchCardStyles([PAT], { client });
  await fetchCardStyles([PAT], { client });
  assert.equal(client.calls.length, 1, 'asked once, then remembered for the session');
  assert.equal(await saveCardStyle('c1.bfield', { client }), 'device');
  assert.ok(client.calls.every((c) => !c.from && !JSON.stringify(c).includes('"card_style"')), 'no request names the column');
  const faces = memberFaces(members, styles, { selfId: ME, selfToken: 'c1.bfield.fgilt' });
  assert.equal(faces[1].face.backdrop.id, DEFAULT_CARD.backdrop, 'a classmate shows the default card');
  assert.equal(faces[1].face.frame, 'plain');
  assert.equal(faces[0].face.backdrop.id, 'field', 'my own card is the one on this device');
  assert.equal(faces[1].face.stats.length, 0, "a classmate's numbers are never shown");
  const html = renderToStaticMarkup(createElement(StudentCard, { face: faces[1].face, compact: true, still: true }));
  assert.ok(html.includes(`data-backdrop="${DEFAULT_CARD.backdrop}"`));
});

test('after the migration: a classmate sees the style the student chose, and a bad stored value is the default', async () => {
  resetCardStyleRemote();
  const client = fakeClient((name) => (name === 'card_styles'
    ? { data: [{ id: PAT, card_style: 'c1.bmicroscope.fseal.tperfect' }, { id: ME, card_style: '<b>nope' }], error: null }
    : { data: true, error: null }));
  const styles = await fetchCardStyles([ME, PAT, 'not-an-id'], { client });
  assert.deepEqual(client.calls[0].args, { p_ids: [ME, PAT] });
  assert.equal(styles.get(PAT), 'c1.bmicroscope.fseal.tperfect');
  assert.ok(!styles.has(ME), 'a value that is not a token is dropped');
  const pat = memberFaces(members, styles, { selfId: ME })[1].face;
  assert.equal(pat.backdrop.id, 'microscope');
  assert.equal(pat.frame, 'seal');
  assert.equal(pat.title, BADGE_ART.perfect.label);
  const html = renderToStaticMarkup(createElement(StudentCard, { face: pat, compact: true, still: true }));
  assert.ok(html.includes('data-backdrop="microscope"') && html.includes('is-frame-seal') && html.includes(BADGE_ART.perfect.label));
  assert.equal(await saveCardStyle('c1.bfield', { client }), 'saved');
  assert.deepEqual(client.calls.at(-1), { rpc: 'set_card_style', args: { p_style: 'c1.bfield' } });
});

test('saving says what happened: offline, refused, and a value that is not a style', async () => {
  resetCardStyleRemote();
  const refused = fakeClient(() => ({ data: null, error: { code: '42501', message: 'permission denied' } }));
  assert.equal(await saveCardStyle('c1.bfield', { client: refused }), 'failed');
  assert.ok(!cardStylesAbsent(), 'a refusal is not "no column"');
  assert.equal(await saveCardStyle('c1.bfield', { client: refused, online: false }), 'offline');
  assert.equal(await saveCardStyle('<script>', { client: refused }), 'failed');
  const thrown = fakeClient(() => { throw new Error('network'); });
  assert.equal(await saveCardStyle('c1.bfield', { client: thrown }), 'failed');
  assert.equal((await fetchCardStyles([PAT], { client: thrown })).size, 0);
});
