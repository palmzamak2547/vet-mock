// The VetMock family list (src/lib/family): one name and one sentence per site, the same on every
// site, every site reachable from every surface that lists them, and a crossing that carries only
// the theme and the language.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { CHOSEN_ATTR, CROSSING, FAMILY, FAMILY_TITLE, VISIT_KEY, chosenTheme, crossingHref, dropVisit, familyMember, keepVisit, memberOfUrl, takeCrossing, visitPrefs } from '../../src/lib/family/family.js';
import { FEATURES } from '../../src/lib/feature-registry.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const read = (rel) => fs.readFileSync(path.join(ROOT, rel), 'utf8');

test('four sites, each with one name, one Thai and one English sentence, on its own vetmock.com origin', () => {
  assert.deepEqual(FAMILY.map((m) => m.id), ['main', 'vca', 'ai', 'research']);
  const origins = new Set();
  for (const m of FAMILY) {
    const url = new URL(m.url);
    assert.equal(url.protocol, 'https:', m.id);
    assert.ok(url.hostname === 'vetmock.com' || url.hostname.endsWith('.vetmock.com'), m.id);
    assert.equal(url.pathname, '/', m.id);
    origins.add(url.origin);
    assert.ok(m.name.startsWith('VetMock'), m.id);
    for (const line of [m.th, m.en]) {
      assert.ok(line.length > 10 && line.length <= 80, `${m.id}: ${line}`);
      assert.ok(!line.includes('·'), `${m.id}: no middle dot`);
      assert.ok(!/[\u{1F300}-\u{1FAFF}☀-➿]/u.test(line), `${m.id}: no emoji`);
    }
    assert.ok(/[฀-๿]/.test(m.th), `${m.id}: Thai line is Thai`);
    assert.ok(!/[฀-๿]/.test(m.en), `${m.id}: English line has no Thai`);
  }
  assert.equal(origins.size, FAMILY.length);
  assert.ok(FAMILY_TITLE.th && FAMILY_TITLE.en);
});

test('the main app\'s registry lists every other site, with the family\'s own name, sentence and address', () => {
  for (const m of FAMILY.filter((x) => x.id !== 'main')) {
    const f = FEATURES.find((x) => x.invoke?.kind === 'external' && memberOfUrl(x.invoke.url)?.id === m.id);
    assert.ok(f, `${m.id} is in the feature registry (home grid, palette, menus)`);
    assert.equal(f.label, m.name, m.id);
    assert.equal(f.hint, m.th, m.id);
    assert.ok(!f.adminOnly && !f.flag && !f.auth && f.rail !== false, `${m.id} is shown to every student`);
  }
});

test('a crossing carries the theme, and the language only to a site that has one', () => {
  const vca = new URL(crossingHref('vca', { theme: 'dark', lang: 'en' }));
  assert.equal(vca.origin, 'https://vca.vetmock.com');
  assert.equal(vca.searchParams.get(CROSSING.theme), 'dark');
  assert.equal(vca.searchParams.has(CROSSING.lang), false, 'VCA has no language switch');

  const research = new URL(crossingHref('https://research.vetmock.com/app?x=1#h', { theme: 'light', lang: 'en' }));
  assert.equal(research.searchParams.get(CROSSING.theme), 'light');
  assert.equal(research.searchParams.get(CROSSING.lang), 'en');
  assert.equal(research.searchParams.get('x'), '1');
  assert.equal(research.hash, '#h');

  // only known values travel; anything else is dropped, never passed through
  const odd = new URL(crossingHref('main', { theme: '"><script>', lang: 'de' }));
  assert.equal(odd.search, '');
  // a stale value in the address is replaced, not doubled
  const again = new URL(crossingHref('https://ai.vetmock.com/?vmt=light', { theme: 'dark' }));
  assert.deepEqual(again.searchParams.getAll(CROSSING.theme), ['dark']);
  // an address outside the family never gains the parameters
  assert.equal(crossingHref('https://imaging.cuvetsmo.com', { theme: 'dark', lang: 'en' }), 'https://imaging.cuvetsmo.com');
  assert.equal(crossingHref('https://vetmock.com.evil.example/', { theme: 'dark' }), 'https://vetmock.com.evil.example/');
  assert.equal(familyMember('nope'), null);
});

test('arriving, the parameters are read once and taken out of the address', () => {
  const calls = [];
  const hist = { state: { a: 1 }, replaceState: (...args) => calls.push(args) };
  const got = takeCrossing({ href: 'https://vetmock.com/wiki/a/b?vmt=dark&vml=en&keep=1#sec' }, hist);
  assert.deepEqual(got, { theme: 'dark', lang: 'en' });
  assert.deepEqual(calls, [[{ a: 1 }, '', '/wiki/a/b?keep=1#sec']]);

  const bad = takeCrossing({ href: 'https://vetmock.com/?vmt=blue&vml=xx' }, { state: null, replaceState() {} });
  assert.deepEqual(bad, { theme: null, lang: null });

  let touched = false;
  takeCrossing({ href: 'https://vetmock.com/?x=1' }, { replaceState() { touched = true; } });
  assert.equal(touched, false, 'an address without them is left alone');
});

test('every site\'s boot reads the same two names before its first paint', () => {
  for (const file of ['index.html', 'vca/public/theme-boot.js', 'ai/public/theme-boot.js']) {
    const src = read(file);
    assert.ok(src.includes(`'${CROSSING.theme}'`), `${file} reads ?${CROSSING.theme}`);
    assert.ok(src.includes(`'${CROSSING.lang}'`), `${file} removes ?${CROSSING.lang}`);
    assert.ok(/history\.replaceState/.test(src), `${file} takes them out of the address`);
    assert.ok(src.includes(`'${VISIT_KEY}'`), `${file} keeps what arrived for this visit only`);
    assert.ok(src.includes(`'${CHOSEN_ATTR}'`), `${file} marks the theme that may travel on`);
  }
  assert.match(read('research/src/main.jsx'), /keepVisit\(takeCrossing\(\)\)/);
});

test('a value that arrives in an address never overwrites the saved choice', () => {
  // Each saved key, and the boot or entry that must never write it from an address.
  const SAVED = {
    'index.html': [/localStorage\.setItem\('vmx-theme'/, /localStorage\.setItem\('vmx-landing-lang'/],
    'vca/public/theme-boot.js': [/localStorage\.setItem\('vca:prefs'/],
    'ai/public/theme-boot.js': [/localStorage\.setItem\('vmai-theme'/],
    'research/src/main.jsx': [/writePrefs\(/],
  };
  for (const [file, writes] of Object.entries(SAVED)) {
    const src = read(file);
    for (const w of writes) assert.doesNotMatch(src, w, `${file} writes a saved choice from the address`);
  }
  // and each site's own pick replaces what the visit arrived with
  for (const file of ['src/App.jsx', 'vca/src/lib/prefs.js', 'ai/src/App.jsx', 'research/src/landing/shell/theme.js', 'research/src/workspace/components/AccountMenu.jsx', 'research/src/i18n/index.js']) {
    assert.match(read(file), /dropVisit\('(theme|lang)'\)/, `${file}: a pick replaces the visit's value`);
  }
});

function memoryStore() {
  const m = new Map();
  return { getItem: (k) => (m.has(k) ? m.get(k) : null), setItem: (k, v) => m.set(k, String(v)), removeItem: (k) => m.delete(k), size: () => m.size };
}

test('the visit keeps only valid values, and a pick drops them', () => {
  const store = memoryStore();
  assert.deepEqual(visitPrefs(store), { theme: null, lang: null });
  keepVisit({ theme: 'dark', lang: 'en' }, store);
  assert.deepEqual(visitPrefs(store), { theme: 'dark', lang: 'en' });
  keepVisit({ theme: 'blue', lang: null }, store);
  assert.deepEqual(visitPrefs(store), { theme: 'dark', lang: 'en' }, 'an invalid value changes nothing');
  dropVisit('theme', store);
  assert.deepEqual(visitPrefs(store), { theme: null, lang: 'en' });
  dropVisit('lang', store);
  assert.equal(store.size(), 0);
  store.setItem(VISIT_KEY, '{"theme":"<b>","lang":"xx"}');
  assert.deepEqual(visitPrefs(store), { theme: null, lang: null });
});

test('a student who follows the system theme sends none', () => {
  const doc = (attrs) => ({ documentElement: { getAttribute: (n) => attrs[n] ?? null } });
  assert.equal(chosenTheme(doc({ 'data-theme': 'dark' })), null, 'the theme on screen alone is the system\'s');
  assert.equal(chosenTheme(doc({ 'data-theme': 'dark', [CHOSEN_ATTR]: 'dark' })), 'dark');
  assert.equal(chosenTheme(doc({ [CHOSEN_ATTR]: 'purple' })), null);
  assert.equal(new URL(crossingHref('vca', { theme: chosenTheme(doc({ 'data-theme': 'light' })) })).search, '');
});

// Each surface renders the list through the shared components, which map over FAMILY; so a site
// added to the list appears on all of them, and none can carry a copied name or address.
const SURFACES = {
  'src/components/Footer.jsx': ['FamilyLinks'],
  'src/views/landing/LandingBody.jsx': ['FamilyLinks'],
  'vca/src/components/Shell.jsx': ['FamilyMenu', 'FamilyLinks'],
  'ai/src/components/Chrome.jsx': ['FamilyMenu', 'FamilyLinks'],
  'research/src/landing/shell/SiteHeader.jsx': ['FamilyMenu', 'FamilyLinks'],
  'research/src/landing/shell/SiteFooter.jsx': ['FamilyLinks'],
  'research/src/workspace/components/TopBar.jsx': ['FamilyMenu'],
  'research/src/pages/PublicShell.jsx': ['FamilyMenu'],
};

test('the registry takes every sibling address from the list', () => {
  const src = read('src/lib/feature-registry.js');
  for (const host of ['vca.vetmock.com', 'ai.vetmock.com', 'research.vetmock.com']) assert.ok(!src.includes(host), `feature-registry.js writes ${host} by hand`);
});

test('every surface lists the family from the one list, with no copied address', () => {
  for (const [file, parts] of Object.entries(SURFACES)) {
    const src = read(file);
    assert.match(src, /from '(?:\.\.\/)*(?:src\/)?lib\/family\/FamilyMenu\.jsx'|from '@vetmock\/lib\/family\/FamilyMenu\.jsx'/, `${file} imports the shared list`);
    for (const part of parts) assert.ok(new RegExp(`<${part}\\b`).test(src), `${file} renders <${part}>`);
    for (const host of ['vca.vetmock.com', 'ai.vetmock.com', 'research.vetmock.com']) {
      assert.ok(!src.includes(`https://${host}`), `${file} links ${host} by hand`);
    }
  }
});

test('the shared menu and list map over every member', () => {
  const src = read('src/lib/family/FamilyMenu.jsx');
  assert.match(src, /FAMILY\.map\(/);
  assert.match(src, /FAMILY\.filter\(\(m\) => m\.id !== self\)\.map\(/);
  assert.match(src, /stampCrossing\(/, 'a followed link carries the theme');
});
