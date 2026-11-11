// Search engines and the wiki. An unknown /wiki/* URL used to answer with the
// home shell (`index, follow`, canonical "/"), so a mistyped or retired topic
// could be indexed as the home page. vercel.json now rewrites it to the
// noindex shell prerender-wiki.mjs writes, while a real topic is still its own
// prerendered file with its own title, canonical and `index`. This serves
// dist/ the way production does (tests/helpers/vercel-static.mjs).
import { readdirSync, readFileSync } from 'node:fs';
import { test, expect } from './fixtures.js';
import { serveDist } from '../helpers/vercel-static.mjs';

const head = (html, re) => re.exec(html)?.[1] ?? null;
const robots = (html) => head(html, /<meta name="robots" content="([^"]*)"/);
const canonical = (html) => head(html, /<link rel="canonical" href="([^"]*)"/);
const title = (html) => head(html, /<title>([^<]*)<\/title>/);

// One real topic, read from what the build prerendered.
const subject = readdirSync('dist/wiki', { withFileTypes: true }).find((d) => d.isDirectory()).name;
const topic = readdirSync(`dist/wiki/${subject}`, { withFileTypes: true }).find((d) => d.isDirectory()).name;

test.describe('wiki URLs under production rewrites', () => {
  // Plain HTTP reads of built files: one engine is enough.
  test.skip(({ browserName }) => browserName !== 'chromium', 'no browser rendering involved');
  let server;
  test.beforeAll(async () => { server = await serveDist(); });
  test.afterAll(async () => { await server?.close(); });

  test('a real topic keeps its own title, canonical and index', async ({ request }) => {
    const html = await (await request.get(`${server.origin}/wiki/${subject}/${topic}`)).text();
    expect(robots(html)).toMatch(/^index, follow/);
    expect(canonical(html)).toBe(`https://vetmock.com/wiki/${subject}/${topic}`);
    expect(title(html)).toMatch(/ — VetWiki — VetMock$/);
    const index = await (await request.get(`${server.origin}/wiki`)).text();
    expect(robots(index)).toMatch(/^index, follow/);
    expect(canonical(index)).toBe('https://vetmock.com/wiki');
  });

  test('an unknown wiki path is noindex and never claims to be the home page', async ({ request }) => {
    for (const path of ['/wiki/zzz/nonexistent', `/wiki/${subject}/zzz-not-a-topic`, '/wiki/zzz']) {
      const res = await request.get(`${server.origin}${path}`);
      const html = await res.text();
      expect(robots(html), path).toBe('noindex, follow');
      expect(canonical(html), path).not.toBe('https://vetmock.com/');
      expect(html, `${path} still boots the app`).toContain('<div id="root">');
    }
  });

  test('the sitemap lists no page that needs a sign-in', async () => {
    const xml = readFileSync('dist/sitemap.xml', 'utf8');
    const app = [...xml.matchAll(/<loc>https:\/\/vetmock\.com(\/app\/[^<]*)<\/loc>/g)].map((m) => m[1]);
    expect(app).toEqual(['/app/privacy']);
    expect(xml).toContain(`<loc>https://vetmock.com/wiki/${subject}/${topic}</loc>`);
  });
});
