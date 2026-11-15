// The sitemap's one set of rules, used by every build step that adds to
// dist/sitemap.xml (prerender-wiki, prerender-atlas, prerender-og) and by the
// unit test that holds them (tests/unit/sitemap.test.mjs).
//
// public/sitemap.xml holds the hand-kept pages (the front door and the blog);
// the build adds every prerendered VetWiki article, the wiki index, the atlas,
// and the /app screens that are both indexable and open before sign-in. An
// /app screen behind the Chula wall is never listed: a crawler would find the
// sign-in screen there, not the page.

/** Add each route not yet listed; returns the new XML. */
export function addToSitemap(xml, origin, routes, { lastmod } = {}) {
  const entries = [];
  for (const route of routes) {
    const loc = `${origin}${route}`;
    if (xml.includes(`<loc>${loc}</loc>`) || entries.some((e) => e.includes(`<loc>${loc}</loc>`))) continue;
    entries.push(`  <url><loc>${loc}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ''}<changefreq>monthly</changefreq></url>`);
  }
  return entries.length ? xml.replace('</urlset>', `${entries.join('\n')}\n</urlset>`) : xml;
}

/** Every VetWiki page the build prerenders: the index and each topic. */
export function wikiRoutes(topics) {
  return ['/wiki', ...topics.map((t) => `/wiki/${t.subject}/${t.topic}`)];
}

/** The /app screens the sitemap may list: indexable, and open before sign-in. */
export function appRoutes(covers, publicViews) {
  return covers
    .filter((c) => c.indexable && c.route.startsWith('/app/') && publicViews.has(c.route.slice('/app/'.length).split('/')[0]))
    .map((c) => c.route);
}

/** Routes listed in a sitemap XML, origin removed. */
export function listedRoutes(xml, origin) {
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].replace(origin, '') || '/');
}
