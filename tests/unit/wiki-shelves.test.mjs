// ============================================================
// wiki-shelves.test.mjs: the VetWiki index as a library
// ============================================================
// The index shows each subject as a volume on its year's shelf. Its size and
// cloth are data (lib/vetwiki/shelf.generated.js, written by the registry
// generator), and the masthead's figures come from the same counts as the
// content inventory, so the page can never claim a number the corpus lacks.
// ============================================================

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { loadModule, mount, settle, findAll, textOf } from '../helpers/fake-react.mjs';
import { SHELF_TOTALS, SHELF_SUBJECTS } from '../../src/lib/vetwiki/shelf.generated.js';
import { SUBJECTS } from '../../src/data/curriculum.js';

const { default: WikiShelves, WikiFeatured, spineSize, spineLabel, spineFontSize, thaiDay } = await loadModule('src/components/WikiShelves.jsx', { stubs: [
  { match: '(^|/)Mochi\\.jsx$', contents: 'export default () => null;' },
] });

test('a spine is as thick as its topics and as tall as its subsections, never under the touch floor', () => {
  assert.deepEqual(spineSize({ topics: 3, sections: 20 }), { width: 44, height: 180 });
  assert.equal(spineSize({ topics: 1, sections: 5 }).width, 44, 'a thin subject still takes a 44 px tap');
  assert.equal(spineSize({ topics: 23, sections: 20 }).width, 74);
  assert.equal(spineSize({ topics: 3, sections: 239 }).height, 260, 'the deepest subject on a logarithm, not 4 m tall');
  for (const [id, s] of Object.entries(SHELF_SUBJECTS)) {
    const { width, height } = spineSize(s);
    assert.ok(width >= 44 && height >= 180 && height <= 270, `${id}: ${width} x ${height}`);
  }
});

test('the spine carries the name before a comma or a bracket, and it fits the spine', () => {
  assert.equal(spineLabel('POA, การแก้ปัญหาคลินิกสัตว์เล็ก'), 'POA');
  assert.equal(spineLabel('อุตสาหกรรมอาหาร (FIQC)'), 'อุตสาหกรรมอาหาร');
  assert.equal(spineLabel('COM V'), 'COM V');
  // The title steps down from 15 px until it fits, and no real subject needs
  // to go under 14 px; a made-up long one stops at the floor.
  for (const [id, s] of Object.entries(SHELF_SUBJECTS)) {
    const label = spineLabel(SUBJECTS.find((x) => x.id === id)?.name || id);
    assert.ok(spineFontSize(label, spineSize(s).height) >= 14, `${id}: "${label}" on a ${spineSize(s).height} px spine`);
  }
  assert.equal(spineFontSize('ก'.repeat(60), 180), 14, 'Thai never under 14 px');
  assert.equal(spineFontSize('x'.repeat(60), 180), 13);
});

test('the masthead counts are the content inventory\'s', () => {
  const inv = readFileSync(new URL('../../docs/content-inventory.md', import.meta.url), 'utf8');
  const row = (label) => Number(new RegExp(`\\| ${label} \\| (\\d+) \\|`).exec(inv)?.[1]);
  assert.equal(SHELF_TOTALS.topics, row('Governed topics'));
  assert.equal(SHELF_TOTALS.sections, row('Governed sections'));
  assert.equal(SHELF_TOTALS.claims, row('Claims verified against an external source'));
  assert.equal(SHELF_TOTALS.sources, row('Distinct external sources cited'));
  const subjects = Object.values(SHELF_SUBJECTS);
  assert.equal(SHELF_TOTALS.subjects, subjects.length);
  assert.equal(subjects.reduce((n, s) => n + s.topics, 0), SHELF_TOTALS.topics);
  assert.equal(subjects.reduce((n, s) => n + s.conflicts, 0), SHELF_TOTALS.conflicts);
  assert.equal(thaiDay('2026-10-06'), '6 ต.ค. 2569');
});

test('every cloth carries its title at 4.5:1 or more, in both themes', () => {
  const css = readFileSync(new URL('../../src/styles.css', import.meta.url), 'utf8');
  const inks = [...css.matchAll(/--clr-ink:\s*(#[0-9a-fA-F]{6})/g)].map((m) => m[1]);
  assert.equal(inks.length >= 2, true, 'light and dark ink tokens');
  const [lightInk, darkInk] = inks;
  const lum = (h) => {
    const [r, g, b] = [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m); return (x + 0.05) / (y + 0.05); };
  for (const [id, s] of Object.entries(SHELF_SUBJECTS)) {
    assert.ok(ratio(s.cloth.light, lightInk) >= 4.5, `${id} light ${s.cloth.light}`);
    assert.ok(ratio(s.cloth.dark, darkInk) >= 4.5, `${id} dark ${s.cloth.dark}`);
  }
});

test('a spine pulls its volume out and the volume opens a chapter', async () => {
  const opened = [];
  const topics = new Map([['com5', [{ id: 'com5--rabies', title: 'Rabies' }, { id: 'com5--cve', title: 'CVE' }]]]);
  const v = mount(WikiShelves, {
    years: [[4, ['com5']]], ownYear: 4, topicsBySubject: topics,
    subjectInfo: () => ({ name: 'COM V', code: '3107417' }), onOpenTopic: (id) => opened.push(id),
  });
  await settle(v);
  const spine = findAll(v.tree, (n) => n.type === 'button' && /vw-spine/.test(n.props.className || ''))[0];
  assert.equal(spine.props['aria-label'], `COM V, ${SHELF_SUBJECTS.com5.topics} หัวข้อ`);
  assert.equal(spine.props['aria-expanded'], false);
  spine.props.onClick();
  v.flush();
  const open = findAll(v.tree, (n) => n.type === 'button' && /vw-spine/.test(n.props.className || ''))[0];
  assert.equal(open.props['aria-expanded'], true);
  assert.match(textOf(v.tree), /เปิดเล่ม COM V มี \d+ หัวข้อ/, 'announced');
  const chapter = findAll(v.tree, (n) => n.type === 'button' && textOf(n).includes('Rabies'))[0];
  chapter.props.onClick();
  assert.deepEqual(opened, ['com5--rabies']);
  const close = findAll(v.tree, (n) => n.type === 'button' && textOf(n) === 'ปิดเล่ม')[0];
  close.props.onClick();
  v.flush();
  assert.equal(findAll(v.tree, (n) => n.props?.role === 'region').length, 0, 'put back');
  v.unmount();
});

test('the index opens on the shelves: every subject a volume, the masthead counted, a book to start from', async (t) => {
  const { default: KnowledgeView } = await loadModule('src/views/KnowledgeView.jsx', { stubs: [
    { match: '\\.css$', contents: '' },
    { match: 'Mochi\\.jsx$', contents: 'export default () => null;' },
    { match: '/components/(FeatureTip|ReadingEffects|ReportConcern|SlideFigures|ConflictNote|StatePanel|OptionalFeature)\\.jsx$',
      contents: 'export default (p) => (p && p.children) || null;' },
  ] });
  const stored = new Map([['vmx-selected-year', '5']]);
  const local = { getItem: (k) => stored.get(k) ?? null, setItem: (k, v) => stored.set(k, String(v)), removeItem: (k) => stored.delete(k) };
  globalThis.localStorage = local;
  globalThis.sessionStorage = { getItem: () => null, setItem() {}, removeItem() {} };
  globalThis.window = {
    localStorage: local, location: new URL('https://vetmock.com/wiki'),
    matchMedia: () => ({ matches: false }),
    history: { state: null, pushState() {}, replaceState() {} },
    addEventListener() {}, removeEventListener() {}, scrollTo() {},
    setTimeout, clearTimeout,
  };
  t.after(() => { for (const k of ['window', 'localStorage', 'sessionStorage']) delete globalThis[k]; });

  const v = mount(KnowledgeView, { goHome() {}, setView() {} });
  await settle(v);
  const spines = () => findAll(v.tree, (n) => n.type === 'button' && /vw-spine/.test(n.props.className || ''));
  assert.equal(spines().length, SHELF_TOTALS.subjects, 'one volume per subject');
  const text = textOf(v.tree);
  for (const figure of [SHELF_TOTALS.topics, SHELF_TOTALS.sections, SHELF_TOTALS.claims, SHELF_TOTALS.sources]) {
    assert.ok(text.includes(figure.toLocaleString('en-US')), `the masthead shows ${figure}`);
  }
  assert.match(text, /เริ่มอ่านที่นี่/);
  assert.match(text, /หัวข้อที่มีโจทย์ฝึกมากที่สุดในปี 5/, 'the ranking says its basis');
  // The list is one tap away, and the choice is remembered.
  findAll(v.tree, (n) => n.type === 'button' && textOf(n) === 'รายการ')[0].props.onClick();
  v.flush();
  assert.equal(stored.get('vmx-wiki-layout'), 'list');
  assert.equal(spines().length, 0);
  v.unmount();
});

test('a shelf is a bookcase: its rows share its tallest spine, so one board pitch fits every row', async () => {
  const ids = Object.keys(SHELF_SUBJECTS).slice(0, 6);
  const v = mount(WikiShelves, {
    years: [[5, ids]], ownYear: null, topicsBySubject: new Map(),
    subjectInfo: (id) => ({ name: id, code: '' }), onOpenTopic() {},
  });
  await settle(v);
  const ul = findAll(v.tree, (n) => n.type === 'ul' && n.props.className === 'vw-spines')[0];
  const tallest = Math.max(...ids.map((id) => spineSize(SHELF_SUBJECTS[id]).height));
  assert.equal(ul.props.style['--vw-row-h'], `${tallest}px`);
  v.unmount();
});

test('the featured cover sets each language of its title on its own line', async () => {
  const v = mount(WikiFeatured, {
    flagship: { id: 'com5--rabies', subject: 'com5', title: 'Rabies — โรคพิษสุนัขบ้า' }, ranked: [], heading: '',
    subjectInfo: () => ({ name: 'COM V', code: '' }), onOpenTopic() {},
  });
  await settle(v);
  const title = findAll(v.tree, (n) => n.props?.className === 'vw-book-title')[0];
  assert.deepEqual(findAll(title, (n) => n.type === 'span' && n !== title).map(textOf), ['Rabies', 'โรคพิษสุนัขบ้า']);
  v.unmount();
});

test('no two subjects on one shelf share a cloth, in either theme', async () => {
  // Review of 5.146.0: the old picker gave up after 16 hue turns and left
  // COM IV and Repro Lecture 0.0045 apart on year 4's shelf.
  const { hexToOklch, CLOTH_APART } = await import('../../scripts/lib/vetwiki-shelf.mjs');
  const { yearForSubject } = await import('../../src/data/curriculum.js');
  const lab = (hex) => { const { L, C, H } = hexToOklch(hex); return [L, C * Math.cos(H), C * Math.sin(H)]; };
  const dist = (a, b) => { const [x, y] = [lab(a), lab(b)]; return Math.hypot(x[0] - y[0], x[1] - y[1], x[2] - y[2]); };
  const ids = Object.keys(SHELF_SUBJECTS);
  let pairs = 0;
  for (let i = 0; i < ids.length; i++) {
    for (let j = i + 1; j < ids.length; j++) {
      if (yearForSubject(ids[i]) !== yearForSubject(ids[j])) continue;
      pairs += 1;
      for (const theme of ['light', 'dark']) {
        const d = dist(SHELF_SUBJECTS[ids[i]].cloth[theme], SHELF_SUBJECTS[ids[j]].cloth[theme]);
        assert.ok(d >= CLOTH_APART, `${ids[i]} and ${ids[j]} (${theme}) are ${d.toFixed(4)} apart`);
      }
    }
  }
  assert.ok(pairs > 50, `every pair on a shelf was compared (${pairs})`);
});

test('a shelf is one Tab stop, Escape from anywhere puts the volume back, and Back finds it open', async (t) => {
  // Review of 5.146.0: 11 Tabs from a spine to its own chapters; Escape lost
  // in Safari, which does not focus a clicked button; Back from a chapter
  // returned to a closed volume somewhere else on the page.
  const listeners = new Map();
  globalThis.document = {
    addEventListener: (k, f) => listeners.set(k, f),
    removeEventListener: (k, f) => { if (listeners.get(k) === f) listeners.delete(k); },
    getElementById: () => null,
  };
  globalThis.window = {
    history: { state: { vetwiki: null, vetwikiPulled: 'com5' }, replaceState(s) { this.state = s; } },
    innerHeight: 800, matchMedia: () => ({ matches: false }),
  };
  t.after(() => { delete globalThis.document; delete globalThis.window; });
  const topics = new Map([['com4', [{ id: 'com4--ibd', title: 'IBD' }]], ['com5', [{ id: 'com5--rabies', title: 'Rabies' }]]]);
  const v = mount(WikiShelves, {
    years: [[4, ['com4', 'com5']]], ownYear: 4, topicsBySubject: topics,
    subjectInfo: (id) => ({ name: id.toUpperCase(), code: '' }), onOpenTopic() {},
  });
  await settle(v);
  const spines = () => findAll(v.tree, (n) => n.type === 'button' && /vw-spine/.test(n.props.className || ''));
  const volumes = () => findAll(v.tree, (n) => n.props?.role === 'region').length;
  assert.equal(volumes(), 1, 'the volume this history entry left open is open again');
  assert.deepEqual(spines().map((s) => s.props.tabIndex), [-1, 0], "the open volume's spine is the shelf's one Tab stop");
  listeners.get('keydown')({ key: 'Escape', defaultPrevented: false });
  v.flush();
  assert.equal(volumes(), 0, 'Escape from anywhere puts it back');
  assert.equal(window.history.state.vetwikiPulled, null, 'and the history entry forgets it');
  assert.equal(window.history.state.vetwiki, null, "the entry's own state is kept");
  assert.deepEqual(spines().map((s) => s.props.tabIndex), [0, -1], 'with nothing open, the first spine is the stop');
  v.unmount();
});

test('a volume with a topic read in the reading list carries a ribbon, and its contents say which', async () => {
  const topics = new Map([['com5', [{ id: 'com5--rabies', subject: 'com5', topic: 'rabies', title: 'Rabies' }, { id: 'com5--cve', subject: 'com5', topic: 'cve', title: 'CVE' }]]]);
  const spineOf = (v) => findAll(v.tree, (n) => n.type === 'button' && /vw-spine/.test(n.props.className || ''))[0];
  const ribbons = (v) => findAll(v.tree, (n) => n.props?.className === 'vw-spine-ribbon').length;
  const unread = mount(WikiShelves, {
    years: [[4, ['com5']]], ownYear: 4, topicsBySubject: topics,
    subjectInfo: () => ({ name: 'COM V', code: '3107417' }), onOpenTopic() {},
  });
  await settle(unread);
  assert.equal(ribbons(unread), 0, 'no reading list, no ribbon');
  unread.unmount();
  const v = mount(WikiShelves, {
    years: [[4, ['com5']]], ownYear: 4, topicsBySubject: topics,
    subjectInfo: () => ({ name: 'COM V', code: '3107417' }), onOpenTopic() {},
    isRead: (t) => t.id === 'com5--rabies',
  });
  await settle(v);
  assert.equal(ribbons(v), 1);
  assert.equal(spineOf(v).props['aria-label'], `COM V, ${SHELF_SUBJECTS.com5.topics} หัวข้อ, อ่านแล้ว 1 หัวข้อ`);
  assert.match(textOf(v.tree), /ริบบิ้นคือเล่มที่มีหัวข้ออ่านแล้ว/, 'the legend says what a ribbon means');
  spineOf(v).props.onClick();
  v.flush();
  const text = textOf(v.tree);
  assert.match(text, /อ่านแล้ว\s*1\s*จาก 2 หัวข้อ/);
  const marks = findAll(v.tree, (n) => n.props?.className === 'vw-read-mark');
  assert.equal(marks.length, 1);
  v.unmount();
  // Out of the topics the reading list holds: a VetWiki-only page cannot be marked.
  const listedOnly = mount(WikiShelves, {
    years: [[4, ['com5']]], ownYear: 4, topicsBySubject: topics,
    subjectInfo: () => ({ name: 'COM V', code: '3107417' }), onOpenTopic() {},
    isRead: (t) => t.id === 'com5--rabies', isListed: (t) => t.id === 'com5--rabies',
  });
  await settle(listedOnly);
  spineOf(listedOnly).props.onClick();
  listedOnly.flush();
  assert.match(textOf(listedOnly.tree), /อ่านแล้ว\s*1\s*จาก 1 หัวข้อ/);
  listedOnly.unmount();
});
