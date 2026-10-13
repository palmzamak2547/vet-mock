// ============================================================
// Navigation surfaces — one list, one order, one icon language
// ============================================================
// lib/nav.js now owns three things the rail, the bottom bar and the phone
// quick grid all read: the primary destinations (and their one name), the
// owner's order for the learn group, and the line icon a registry feature
// draws on a navigation surface. These tests pin that contract and the two
// consumers built on it: the quick grid at the top of a phone's Home, and
// the feature menu's panic card, which used to do nothing when tapped.

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { loadModule, mount, findAll, textOf } from '../helpers/fake-react.mjs';
import {
  NAV_ITEMS, navItemsFor, RAIL_LEARN_IDS, LEARN_OWNER_ORDER, FEATURE_LINE_ICON, featureLineIcon,
  learnInOwnerOrder, splitLearnForRail, splitForQuickGrid,
  HOME_MENU_HIDDEN, HOME_MENU_ADMIN_ONLY, HOME_MENU_GROUP, homeMenuGroup, homeMenuVisible,
} from '../../src/lib/nav.js';
import { FEATURES, FEATURE_CATEGORIES, featuresByCategory, visibleFeatures, fabFeatures } from '../../src/lib/feature-registry.js';

const read = (path) => readFileSync(new URL(path, import.meta.url), 'utf8');

// The NavIcon names that exist, read from the component's own table.
const ICON_NAMES = new Set(
  [...read('../../src/components/NavIcon.jsx').matchAll(/^  '?([a-z0-9-]+)'?: /gm)].map((m) => m[1]),
);

test('the bottom bar and the rail call every destination by one name, from one list', () => {
  const bar = navItemsFor('bar');
  const rail = navItemsFor('rail');
  for (const item of NAV_ITEMS) {
    assert.ok(ICON_NAMES.has(item.icon), `${item.id} draws an icon NavIcon does not have: ${item.icon}`);
    if (bar.includes(item) && rail.includes(item)) {
      // Drawn on both surfaces: one word, not a long one and a short one.
      assert.equal(item.short, item.label, `${item.id}: the bar says "${item.short}" while the rail says "${item.label}"`);
    } else {
      // Drawn on one surface: a shortening is allowed, but it is the same term's head.
      assert.ok(item.label.startsWith(item.short), `${item.id}: "${item.short}" is not a head of "${item.label}"`);
    }
  }
  // Five slots on the phone; the rail keeps the owner's starred ความคืบหน้า,
  // the bar gives that slot to the daily review queue; both end at โปรไฟล์.
  assert.deepEqual(bar.map((i) => i.id), ['home', 'subject-select', 'mock-exam', 'sr-session', 'profile']);
  assert.deepEqual(rail.map((i) => i.id), ['home', 'subject-select', 'mock-exam', 'dashboard', 'profile']);
  assert.ok(bar.length <= 5);
  assert.equal(bar.at(-1).id, 'profile');
  assert.equal(rail.at(-1).id, 'profile');
  // Every item is drawn on at least one surface.
  for (const item of NAV_ITEMS) assert.ok(bar.includes(item) || rail.includes(item), `${item.id} is on neither surface`);
});

test('Home\'s menu policy demotes what opens elsewhere and files Atlas under tools; nothing it names is unregistered', () => {
  const byId = new Map(FEATURES.map((f) => [f.id, f]));
  for (const id of [...HOME_MENU_HIDDEN, ...HOME_MENU_ADMIN_ONLY, ...Object.keys(HOME_MENU_GROUP)]) {
    assert.ok(byId.has(id), `${id} is not a registered feature`);
  }
  for (const [, group] of Object.entries(HOME_MENU_GROUP)) {
    assert.ok(FEATURE_CATEGORIES.some((c) => c.id === group), `${group} is not a category`);
  }
  assert.equal(homeMenuGroup(byId.get('atlas')), 'tools');
  assert.equal(homeMenuGroup(byId.get('library')), 'learn');
  // The clips keep their door on Home (a walked student path); the faculty
  // index and the score weights open from elsewhere.
  assert.equal(homeMenuVisible(byId.get('videos')), true);
  assert.equal(homeMenuVisible(byId.get('faculty')), false);
  assert.equal(homeMenuVisible(byId.get('scores')), false);
  assert.equal(homeMenuVisible(byId.get('ig-cards')), false);
  assert.equal(homeMenuVisible(byId.get('ig-cards'), { isAdmin: true }), true);
  assert.equal(homeMenuVisible(byId.get('library')), true);
  assert.equal(homeMenuVisible(undefined), false);
  // Demoted, not deleted: the clips and the faculty index still have a view to open.
  for (const id of HOME_MENU_HIDDEN) assert.equal(byId.get(id).invoke.kind, 'view');
});

test('the rest place is one card on Home; the timer and the game open from it and stay in search', () => {
  // Owner 2026-10-12, "รวมเมนูพักใจ": three cards (พักกับ Mochi, จับเวลาโฟกัส,
  // มินิเกม) were one place. The menu's own filter, signed out and in.
  for (const signedIn of [false, true]) {
    const onHome = (group) => visibleFeatures(
      FEATURES.filter((f) => homeMenuGroup(f) === group && !f.primary),
      { signedIn, scaffold: false, hasSupabase: true, selectedYear: 4 },
    ).filter((f) => homeMenuVisible(f)).map((f) => f.id);
    assert.deepEqual(onHome('focus'), ['mochi'], `signedIn=${signedIn}`);
    // The social group keeps the account features; signed out it has none, so it is not drawn.
    assert.deepEqual(onHome('social'), signedIn ? ['race', 'groups'] : [], `signedIn=${signedIn}`);
  }
  const byId = new Map(FEATURES.map((f) => [f.id, f]));
  assert.equal(byId.get('mochi').label, 'พักใจ');
  // The game belongs to the rest place, under one name (the door's).
  assert.equal(byId.get('offline-game').category, 'focus');
  assert.equal(byId.get('offline-game').label, 'เกมลูกไก่หนีเชื้อโรค');
  assert.equal(byId.get('mochi').invoke.view, 'mochi');
  // Demoted, not deleted: search and the rest page's doors still open both.
  assert.equal(byId.get('pomodoro').invoke.view, 'pomodoro');
  assert.equal(byId.get('offline-game').invoke.view, 'offline-game');
  // The desktop tools button keeps the timer (a tool), not a second door to the page.
  const fab = fabFeatures().map((f) => f.id);
  assert.ok(fab.includes('pomodoro'));
  assert.ok(!fab.includes('mochi'));
  // The footer's "มินิเกม" sat under เกี่ยวกับ; the game has one home now.
  assert.doesNotMatch(read('../../src/components/Footer.jsx'), /offline-game/);
});

test('the starred rail rows are real learn features, and every mapped line icon exists', () => {
  const byId = new Map(FEATURES.map((f) => [f.id, f]));
  for (const id of RAIL_LEARN_IDS) {
    assert.ok(byId.has(id), `${id} is not a registered feature`);
    assert.equal(byId.get(id).category, 'learn', `${id} is not in the learn group`);
  }
  for (const [id, icon] of Object.entries(FEATURE_LINE_ICON)) {
    assert.ok(byId.has(id), `icon map names an unregistered feature: ${id}`);
    assert.ok(ICON_NAMES.has(icon), `${id} maps to an icon NavIcon does not draw: ${icon}`);
  }
  assert.equal(featureLineIcon('vetwiki'), 'wiki');
  assert.equal(featureLineIcon('no-such-feature'), null);
});

test('owner order: the starred four lead, the crossed-out three close, and an unlisted feature follows in registry order', () => {
  const byId = new Map(FEATURES.map((f) => [f.id, f]));
  for (const id of LEARN_OWNER_ORDER) assert.equal(byId.get(id)?.category, 'learn', `${id} is not a learn feature`);
  assert.deepEqual(LEARN_OWNER_ORDER.slice(0, RAIL_LEARN_IDS.length), [...RAIL_LEARN_IDS]);
  assert.deepEqual(LEARN_OWNER_ORDER.slice(-3), ['videos', 'atlas', 'faculty'], 'the three crossed out of the first level come last');

  const learn = featuresByCategory('learn').filter((f) => f.rail !== false);
  const ordered = learnInOwnerOrder(learn);
  const listed = LEARN_OWNER_ORDER.filter((id) => learn.some((f) => f.id === id));
  assert.deepEqual(ordered.slice(0, listed.length).map((f) => f.id), listed);
  const unlisted = learn.map((f) => f.id).filter((id) => !LEARN_OWNER_ORDER.includes(id));
  assert.deepEqual(ordered.slice(listed.length).map((f) => f.id), unlisted, 'anything unlisted keeps registry order');
  // A feature registered tomorrow lands after the list, not nowhere.
  const withNew = [...learn, { id: 'new-learn-thing', category: 'learn', invoke: { kind: 'view', view: 'x' } }];
  assert.equal(learnInOwnerOrder(withNew).at(-1).id, 'new-learn-thing');
  // Stable and pure: the input is untouched and a re-run agrees.
  assert.deepEqual(learnInOwnerOrder(learn).map((f) => f.id), ordered.map((f) => f.id));
  assert.deepEqual(learnInOwnerOrder([]), []);
  assert.deepEqual(learnInOwnerOrder(undefined), []);
});

test('the rail shows the starred rows and hands the rest to the overflow row', () => {
  const learn = featuresByCategory('learn').filter((f) => f.rail !== false && f.invoke?.view !== 'subject-select');
  const { visible, rest } = splitLearnForRail(learn);
  assert.deepEqual(visible.map((f) => f.id), [...RAIL_LEARN_IDS]);
  assert.ok(rest.every((f) => !RAIL_LEARN_IDS.includes(f.id)));
  assert.ok(rest.some((f) => f.id === 'atlas') && rest.some((f) => f.id === 'faculty') && rest.some((f) => f.id === 'videos'),
    'the crossed-out features stay reachable behind ทั้งหมด');
  // A starred feature gated away (no timetable on a scaffold year) simply leaves the list.
  const gated = splitLearnForRail(learn.filter((f) => f.id !== 'schedule'));
  assert.deepEqual(gated.visible.map((f) => f.id), RAIL_LEARN_IDS.filter((id) => id !== 'schedule'));
});

test('the quick grid shows eight tiles and folds the rest, unless the rest is a single tile', () => {
  const ten = Array.from({ length: 10 }, (_, i) => ({ id: `f${i}` }));
  const split = splitForQuickGrid(ten);
  assert.equal(split.visible.length, 8);
  assert.equal(split.rest.length, 2);
  const nine = ten.slice(0, 9);
  assert.equal(splitForQuickGrid(nine).visible.length, 9, 'one hidden tile is not worth a "1 more" tile');
  assert.equal(splitForQuickGrid(nine).rest.length, 0);
  assert.deepEqual(splitForQuickGrid([]), { visible: [], rest: [] });
});

// ── The two consumers ──────────────────────────────────────────────────
// loadModule matches a stub against the import specifier as written, so the
// patterns name the file, not its folder (`./MotionFeedback.jsx`).
const stubs = [
  { match: '\\.css$', contents: '' },
  // MotionButton is a plain button here; the effect layer is not under test.
  { match: 'MotionFeedback\\.jsx$', contents: "export const MotionButton = ({ effect, children, ...props }) => globalThis.__fakeReact.createElement('button', props, children);" },
  { match: 'NavIcon\\.jsx$', contents: "export default ({ name }) => globalThis.__fakeReact.createElement('svg', { 'data-icon': name });" },
];

function sessionStorageStub() {
  const map = new Map();
  globalThis.sessionStorage = {
    getItem: (k) => (map.has(k) ? map.get(k) : null),
    setItem: (k, v) => map.set(k, String(v)),
    removeItem: (k) => map.delete(k),
  };
  return () => { delete globalThis.sessionStorage; };
}

test('the feature menu runs the panic card through onPanic, with the palette\'s default time', async (t) => {
  t.after(sessionStorageStub());
  const { default: FeatureMenu } = await loadModule('src/components/FeatureMenu.jsx', { stubs });
  const calls = [];
  const inst = mount(FeatureMenu, {
    setView: (v) => calls.push(['view', v]),
    onPanic: (key) => calls.push(['panic', key]),
    signedIn: false, scaffold: false, hasSupabase: true, selectedYear: 5,
  });
  const cards = findAll(inst.tree, (n) => n.props?.className === 'vmx-feature-card');
  const panic = cards.find((n) => textOf(n).includes('ทบทวนเร่งด่วน'));
  assert.ok(panic, 'the panic card is on the menu');
  panic.props.onClick();
  assert.deepEqual(calls, [['panic', '30']], 'tapping the card starts a 30-minute panic session');
  // The learn group is marked so the stylesheet can hand it to the quick grid on a phone.
  const learnGroup = findAll(inst.tree, (n) => n.props?.['data-category'] === 'learn');
  assert.equal(learnGroup.length, 1);
  for (const cat of FEATURE_CATEGORIES) {
    assert.ok(findAll(inst.tree, (n) => n.props?.['data-category'] === cat.id).length <= 1);
  }
  // Home's policy: the clips, the faculty index and the score weights open
  // from elsewhere; Atlas is filed under tools; the IG studio is the admin's.
  const titles = (root) => findAll(root, (n) => n.props?.className === 'vmx-feature-card-title').map((n) => textOf(n).trim());
  const all = titles(inst.tree);
  for (const id of ['faculty', 'scores', 'ig-cards']) {
    const f = FEATURES.find((x) => x.id === id);
    assert.ok(!all.includes(f.label), `${f.label} is still on the student's Home menu`);
  }
  // The clips stay on Home (the learn group previews four; expand it to see all).
  const learnMore = findAll(findAll(inst.tree, (n) => n.props?.['data-category'] === 'learn')[0], (n) => n.props?.className === 'vmx-feature-more')[0];
  if (learnMore) { learnMore.props.onClick(); inst.flush(); }
  assert.ok(titles(findAll(inst.tree, (n) => n.props?.['data-category'] === 'learn')[0]).includes('คลิปย้อนหลัง'));
  const tools = findAll(inst.tree, (n) => n.props?.['data-category'] === 'tools')[0];
  const toolsMore = findAll(tools, (n) => n.props?.className === 'vmx-feature-more')[0];
  if (toolsMore) { toolsMore.props.onClick(); inst.flush(); }
  const toolsAfter = findAll(inst.tree, (n) => n.props?.['data-category'] === 'tools')[0];
  assert.ok(titles(toolsAfter).includes('Atlas สัตว์'), 'Atlas sits under tools');
  const learnAfter = findAll(inst.tree, (n) => n.props?.['data-category'] === 'learn')[0];
  assert.ok(!titles(learnAfter).includes('Atlas สัตว์'), 'and not under learn');
  // The admin still gets the studio.
  const admin = mount(FeatureMenu, { setView: () => {}, signedIn: true, scaffold: false, hasSupabase: true, selectedYear: 5, isAdmin: true });
  for (const group of findAll(admin.tree, (n) => n.props?.className === 'vmx-feature-more')) { group.props.onClick(); }
  admin.flush();
  assert.ok(titles(admin.tree).includes('IG Card Studio'));
});

test('the quick grid is the kept learn group in owner order, seven tiles, each named like the menu card', async (t) => {
  t.after(sessionStorageStub());
  const { default: HomeQuickGrid } = await loadModule('src/components/HomeQuickGrid.jsx', { stubs });
  const views = [];
  const inst = mount(HomeQuickGrid, { setView: (v) => views.push(v), signedIn: false, scaffold: false, hasSupabase: true, selectedYear: 5 });

  const section = findAll(inst.tree, (n) => n.props?.className === 'vmx-quick-grid')[0];
  assert.equal(section?.props['aria-label'], 'เรียน & ทบทวน', 'the grid is the region the rail\'s group is named after');
  const tiles = findAll(inst.tree, (n) => n.props?.['data-feature']);
  // The seven kept destinations, starred first; the faculty index and Atlas
  // are not here (subject pages and search; tools).
  assert.deepEqual(tiles.map((n) => n.props['data-feature']), ['vetwiki', 'library', 'reading-checklist', 'schedule', 'notes', 'pinboard', 'videos']);
  assert.equal(findAll(inst.tree, (n) => n.props?.['aria-expanded'] !== undefined).length, 0, 'nothing left to fold');

  // A tile's accessible text is "label hint", exactly what the menu card reads as.
  const pinboard = tiles.find((n) => n.props['data-feature'] === 'pinboard');
  const pinFeature = FEATURES.find((f) => f.id === 'pinboard');
  assert.match(textOf(pinboard).replace(/\s+/g, ' ').trim(), new RegExp(`^${pinFeature.label} ${pinFeature.hint}$`));
  const icons = findAll(pinboard, (n) => n.props?.['data-icon']);
  assert.equal(icons[0]?.props['data-icon'], 'pin', 'a mapped feature draws its line icon');

  // Tapping a tile opens its view through the shared intent hand-off.
  tiles.find((n) => n.props['data-feature'] === 'notes').props.onClick();
  assert.deepEqual(views, ['subject-select']);
  assert.equal(globalThis.sessionStorage.getItem('vmx-view-intent'), 'notes');

  // Seven tiles leave the 4-across grid's last slot to "เมนูทั้งหมด", which
  // takes the student to the rest of the menu below and puts focus there.
  const all = findAll(inst.tree, (n) => n.props?.['data-all-menu'] !== undefined);
  assert.equal(all.length, 1, 'one tile leads to the whole menu when nothing is folded');
  assert.equal(textOf(all[0]).trim(), 'เมนูทั้งหมด');
  const seen = [];
  const heading = { scrollIntoView: (o) => seen.push(['scroll', o.behavior]), setAttribute: (k, v) => seen.push([k, v]), focus: () => seen.push(['focus']) };
  const realDoc = globalThis.document;
  globalThis.document = { getElementById: (id) => (id === 'vmx-feature-menu-title' ? heading : null) };
  try { all[0].props.onClick(); } finally { globalThis.document = realDoc; }
  assert.deepEqual(seen.map((s) => s[0]), ['scroll', 'tabindex', 'focus']);
});

test('the quick grid folds anything beyond its limit behind one expanding tile', async (t) => {
  t.after(sessionStorageStub());
  // All nine learn features through the real gating, at a limit of four:
  // the fold holds five. The component's own `../lib/nav.js` import is
  // stubbed to switch the Home policy off and lower the limit; the stub
  // reaches the real module by a path the pattern does not match, so it
  // cannot stub itself.
  const { default: HomeQuickGrid } = await loadModule('src/components/HomeQuickGrid.jsx', {
    stubs: [...stubs, {
      match: '\\.\\./lib/nav\\.js$',
      contents: `import { splitForQuickGrid as real } from './src/lib/nav.js'; export * from './src/lib/nav.js';
        export const splitForQuickGrid = (f) => real(f, 4); export const homeMenuVisible = () => true; export const homeMenuGroup = (f) => f.category;`,
    }],
  });
  const inst = mount(HomeQuickGrid, { setView: () => {}, signedIn: false, scaffold: false, hasSupabase: true, selectedYear: 5 });
  const expected = learnInOwnerOrder(visibleFeatures(featuresByCategory('learn'), { signedIn: false, scaffold: false, hasSupabase: true, selectedYear: 5 })
    .filter((f) => f.rail !== false));
  const { visible, rest } = splitForQuickGrid(expected, 4);
  assert.ok(rest.length > 1, 'this fixture has a fold');
  let tiles = findAll(inst.tree, (n) => n.props?.['data-feature']);
  assert.deepEqual(tiles.map((n) => n.props['data-feature']), visible.map((f) => f.id));
  const more = findAll(inst.tree, (n) => n.props?.['aria-expanded'] !== undefined)[0];
  assert.ok(more, 'the rest sits behind one tile');
  assert.equal(more.props['aria-expanded'], false);
  assert.equal(textOf(more).trim(), `ดูอีก ${rest.length}`);
  more.props.onClick();
  inst.flush();
  tiles = findAll(inst.tree, (n) => n.props?.['data-feature']);
  assert.deepEqual(tiles.map((n) => n.props['data-feature']), expected.map((f) => f.id));
  assert.equal(findAll(inst.tree, (n) => n.props?.['aria-expanded'] !== undefined)[0].props['aria-expanded'], true);
});
