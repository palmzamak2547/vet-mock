// One screen, every list it belongs to. A view id is written by hand in App.jsx (its render
// branch and the WIDE/FOCUS/AUTH sets), src/app/lazy-views.js (its chunk), src/lib/view-route.js
// (its /app address), src/data/og-covers.js (its link preview), src/lib/feature-registry.js (the
// palette, Home and the rail), src/lib/nav.js (titles, menus, icons) and src/lib/mochi-presence.js.
// Forget one and nothing fails: a route that opens a blank page, a palette entry that goes
// nowhere, a link that previews as the generic shell, a header with no title. This test reads the
// screens App.jsx actually draws and holds every list to them. A screen that is deliberately
// missing from a list is named below with the reason, so adding a screen is a decision per list.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { APP_VIEW_ROUTES, YEAR_SCOPED_VIEW_IDS } from '../../src/lib/view-route.js';
import { OG_COVERS } from '../../src/data/og-covers.js';
import { FEATURES } from '../../src/lib/feature-registry.js';
import {
  NAV_ITEMS, HOME_MENU_HIDDEN, HOME_MENU_ADMIN_ONLY, HOME_MENU_GROUP, RAIL_LEARN_IDS,
  LEARN_OWNER_ORDER, FEATURE_LINE_ICON, viewTitle,
} from '../../src/lib/nav.js';
import { MOCHI_PAGE_POSES } from '../../src/lib/mochi-presence.js';

const read = (p) => readFileSync(new URL(`../../${p}`, import.meta.url), 'utf8').replace(/\r\n/g, '\n');
const APP = read('src/App.jsx');
const LAZY = read('src/app/lazy-views.js');

// The screens App.jsx draws: each `{view === 'x' && <Component` branch of the main render, and
// the landing page's early return. The component is the first element the branch renders.
function renderedViews() {
  const views = new Map();
  const branch = /\{\(?((?:view === '[^']+'(?:\s*\|\|\s*)?)+)\)?((?:\s*&&\s*[!\w?.]+)*)\s*&&\s*\(?\s*<([A-Z]\w*)/g;
  for (const m of APP.matchAll(branch)) {
    for (const [, id] of m[1].matchAll(/view === '([^']+)'/g)) views.set(id, [...new Set([...(views.get(id) || []), m[3]])]);
  }
  assert.ok(views.size > 40, `render branches found: ${views.size}`);
  assert.match(APP, /if \(view === 'landing'\) \{[\s\S]{0,400}<LandingView/, 'the landing page is still the early return');
  views.set('landing', ['LandingView']);
  return views;
}

const RENDERED = renderedViews();
const setOf = (name) => {
  const m = APP.match(new RegExp(`const ${name} = new Set\\(\\[([\\s\\S]*?)\\]\\)`));
  assert.ok(m, `App.jsx still declares ${name}`);
  return [...m[1].matchAll(/'([^']+)'/g)].map((x) => x[1]);
};

// Screens with no /app address, and why. A new screen gets an address and a cover, or a line here.
const NO_ROUTE = {
  landing: 'the signed-out front door is "/" itself',
  auth: 'sign-in is a step on the way to another screen, never a destination to share',
  'topic-select': 'stateful: needs the subject chosen on the screen before (view-route.js header)',
  config: 'stateful: a set being configured',
  exam: 'stateful: an active set',
  results: 'stateful: one finished set',
  review: 'stateful: one finished set',
  wrapup: 'stateful: opened for one subject and paper from Home',
  notes: 'opened for one subject; the shareable reading address is /wiki',
  knowledge: 'VetWiki has its own /wiki/* pages (prerendered), not an /app address',
  wiki: 'VetWiki has its own /wiki/* pages (prerendered), not an /app address',
  profile: 'a personal hub with no shareable link (view-route.js header)',
  lab: 'the Imaging lab owns the shareable #lab hash instead (App.jsx initial view)',
  'group-detail': 'one group, opened from the groups list; needs the group in state',
  'connect-apps': 'reached from the profile and account screens only; a reload lands on Home',
  'mock-exam': 'legacy id kept so old state does not crash; draws only the fallback',
  'mock-results': 'legacy id kept so old state does not crash; draws only the fallback',
};

// Screens viewTitle() gives no header title, and why.
const NO_TITLE = {
  landing: 'full-bleed page with its own heading',
  home: 'Home is the app name',
  knowledge: 'the article draws its own title (TITLE_OWNED_ELSEWHERE)',
  wiki: 'the article draws its own title (TITLE_OWNED_ELSEWHERE)',
  lab: 'the lab draws its own title (TITLE_OWNED_ELSEWHERE)',
  atlas: 'the atlas draws its own title (TITLE_OWNED_ELSEWHERE)',
};

// Components a branch may draw that are not lazy screens.
const NOT_A_SCREEN = {
  ViewFallback: 'the loading placeholder (exam before its question, legacy mock ids)',
  AuthUnavailableState: 'the sign-in screen when the build has no Supabase',
};

test('every screen App.jsx draws is a lazy view, and every lazy view is drawn', () => {
  const lazyViews = new Map([...LAZY.matchAll(/export const (\w+) = lazy\(\(\) => import\('\.\.\/views\/(\w+)\.jsx'\)\)/g)]
    .map((m) => [m[1], m[2]]));
  assert.ok(lazyViews.size > 40, `lazy views found: ${lazyViews.size}`);
  for (const [view, comps] of RENDERED) {
    for (const c of comps) assert.ok(lazyViews.has(c) || NOT_A_SCREEN[c], `${view} draws <${c}>, which is not a lazy view in src/app/lazy-views.js`);
  }
  const drawn = new Set([...APP.matchAll(/<([A-Z]\w*)[\s/>]/g)].map((m) => m[1]));
  for (const name of lazyViews.keys()) assert.ok(drawn.has(name), `${name} is declared in lazy-views.js but App.jsx never draws it`);
});

test('every /app route opens a screen, and every screen has a route or says why not', () => {
  for (const view of Object.keys(APP_VIEW_ROUTES)) assert.ok(RENDERED.has(view), `route ${APP_VIEW_ROUTES[view]} names ${view}, which App.jsx never draws`);
  for (const view of RENDERED.keys()) {
    assert.ok(APP_VIEW_ROUTES[view] || NO_ROUTE[view], `${view} has no /app route in view-route.js and no reason in NO_ROUTE here`);
    assert.ok(!(APP_VIEW_ROUTES[view] && NO_ROUTE[view]), `${view} has a route now: drop it from NO_ROUTE`);
  }
  for (const view of Object.keys(NO_ROUTE)) assert.ok(RENDERED.has(view), `NO_ROUTE names ${view}, which App.jsx no longer draws`);
});

test('every route has its own share cover, and every app cover names a screen', () => {
  for (const [view, route] of Object.entries(APP_VIEW_ROUTES)) {
    const cover = OG_COVERS.find((c) => c.route === route);
    assert.ok(cover, `${route} (${view}) has no cover in src/data/og-covers.js`);
    assert.equal(cover.id, view, `the cover for ${route} is filed as ${cover.id}, not ${view}`);
  }
  // Covers for pages that are not app screens.
  const OFF_APP = { 'external-docs': 'a retired path still shared in old links (APP_PATH_ALIASES)', blog: 'static /blog/ pages', wiki: 'the /wiki shelf, served by the prerender' };
  for (const c of OG_COVERS) {
    if (c.route === '/' || OFF_APP[c.id]) continue;
    assert.ok(APP_VIEW_ROUTES[c.id] === c.route, `cover ${c.id} (${c.route}) matches no route in view-route.js`);
  }
});

test('the registry, the shell sets and the decoration lists name only screens that exist', () => {
  for (const f of FEATURES) {
    if (f.invoke?.kind === 'view') assert.ok(RENDERED.has(f.invoke.view), `feature ${f.id} opens ${f.invoke.view}, which App.jsx never draws`);
  }
  for (const name of ['WIDE_VIEWS', 'FOCUS_VIEWS', 'GATE_PUBLIC_VIEWS', 'FOOTER_VIEWS', 'AUTH_REQUIRED_VIEWS']) {
    for (const view of setOf(name)) assert.ok(RENDERED.has(view), `App.jsx ${name} names ${view}, which it never draws`);
  }
  for (const view of YEAR_SCOPED_VIEW_IDS) assert.ok(RENDERED.has(view), `YEAR_SCOPED_VIEWS names ${view}, which App.jsx never draws`);
  for (const view of Object.keys(MOCHI_PAGE_POSES)) assert.ok(RENDERED.has(view), `MOCHI_PAGE_POSES names ${view}, which App.jsx never draws`);
  for (const item of NAV_ITEMS) assert.ok(RENDERED.has(item.id), `nav item ${item.id} opens no screen`);
});

test('a screen drawn only for a signed-in student is in AUTH_REQUIRED_VIEWS, and the reverse', () => {
  const needsUser = [...APP.matchAll(/\{view === '([^']+)' && user &&/g)].map((m) => m[1]).sort();
  assert.deepEqual(needsUser, [...setOf('AUTH_REQUIRED_VIEWS')].sort(),
    'a branch guarded by `user &&` draws nothing for a guest unless AUTH_REQUIRED_VIEWS sends them to sign in');
});

test('nav.js names only features the registry has', () => {
  const ids = new Set(FEATURES.map((f) => f.id));
  // FEATURE_LINE_ICON also serves the rail's own items, which are views rather than features.
  const railOwn = new Set(['sr-session']);
  const lists = { HOME_MENU_HIDDEN, HOME_MENU_ADMIN_ONLY, RAIL_LEARN_IDS, LEARN_OWNER_ORDER, HOME_MENU_GROUP: Object.keys(HOME_MENU_GROUP), FEATURE_LINE_ICON: Object.keys(FEATURE_LINE_ICON) };
  for (const [name, list] of Object.entries(lists)) {
    for (const id of list) assert.ok(ids.has(id) || railOwn.has(id), `nav.js ${name} names ${id}, which is not a feature in feature-registry.js`);
  }
});

test('every screen has a header title or says why it draws its own', () => {
  for (const view of RENDERED.keys()) {
    assert.ok(viewTitle(view) || NO_TITLE[view], `${view} has no title (nav item, feature label or TITLE_EXTRAS) and no reason in NO_TITLE`);
  }
  for (const view of Object.keys(NO_TITLE)) assert.equal(viewTitle(view), null, `${view} has a title now: drop it from NO_TITLE`);
});
