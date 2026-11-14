// The built sitemap lists every public page and nothing behind the sign-in
// wall (scripts/lib/sitemap.mjs, used by every build step that writes it).
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { addToSitemap, appRoutes, listedRoutes, wikiRoutes } from '../../scripts/lib/sitemap.mjs';
import { GATE_PUBLIC_VIEWS } from '../../src/lib/gate-public-views.js';
import { OG_COVERS } from '../../src/data/og-covers.js';

const ORIGIN = 'https://vetmock.com';
const read = (p) => readFileSync(new URL(`../../${p}`, import.meta.url), 'utf8');

// The same steps, in the same order, as `npm run build` after vite copies public/.
async function builtSitemap() {
  const vw = await import('../../src/lib/vetwiki/index.js');
  const topics = vw.listTopics().filter((t) => vw.loadTopic(t.subject, t.topic));
  let xml = read('public/sitemap.xml');
  xml = addToSitemap(xml, ORIGIN, wikiRoutes(topics), { lastmod: '2026-11-11' }); // prerender-wiki
  xml = addToSitemap(xml, ORIGIN, ['/atlas/']); // prerender-atlas
  xml = addToSitemap(xml, ORIGIN, appRoutes(OG_COVERS, GATE_PUBLIC_VIEWS)); // prerender-og
  return { xml, topics };
}

test('every prerendered VetWiki topic is in the sitemap, with the wiki index and the atlas', async () => {
  const { xml, topics } = await builtSitemap();
  const listed = new Set(listedRoutes(xml, ORIGIN));
  assert.ok(topics.length >= 200, `expected the governed topics, found ${topics.length}`);
  const missing = wikiRoutes(topics).filter((r) => !listed.has(r));
  assert.deepEqual(missing, []);
  assert.ok(listed.has('/atlas/'));
  assert.ok(listed.has('/'));
  assert.equal(listedRoutes(xml, ORIGIN).length, listed.size, 'no route listed twice');
});

test('nothing behind the sign-in wall is listed', async () => {
  const { xml } = await builtSitemap();
  const wrong = listedRoutes(xml, ORIGIN).filter((r) => r.startsWith('/api/')
    || (r.startsWith('/app/') && !GATE_PUBLIC_VIEWS.has(r.slice(5).split('/')[0])));
  assert.deepEqual(wrong, []);
  assert.ok(!appRoutes([{ route: '/app/about', indexable: true }], GATE_PUBLIC_VIEWS).length, 'an indexable screen behind the wall is still left out');
  assert.deepEqual(appRoutes([{ route: '/app/privacy', indexable: true }, { route: '/app/landing', indexable: false }], GATE_PUBLIC_VIEWS), ['/app/privacy']);
});

test('the build steps write the sitemap through the shared rules', () => {
  assert.match(read('scripts/prerender-wiki.mjs'), /addToSitemap\(xml, ORIGIN, written/);
  assert.match(read('scripts/prerender-atlas.mjs'), /addToSitemap\(/);
  assert.match(read('scripts/prerender-og.mjs'), /appRoutes\(OG_COVERS, GATE_PUBLIC_VIEWS\)/);
  for (const f of ['scripts/prerender-wiki.mjs', 'scripts/prerender-atlas.mjs', 'scripts/prerender-og.mjs']) {
    assert.doesNotMatch(read(f), /replace\('<\/urlset>'/, `${f} adds to the sitemap only through scripts/lib/sitemap.mjs`);
  }
  assert.match(read('src/App.jsx'), /import \{ GATE_PUBLIC_VIEWS \} from '\.\/lib\/gate-public-views\.js'/, 'the wall and the sitemap read one list');
});
