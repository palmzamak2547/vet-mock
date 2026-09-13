// ============================================================
// scripts/lib/og-head.mjs — rewrite a built shell's <head> for one route
// ============================================================
// Shared by scripts/prerender-og.mjs and its test. Pure string work: give it
// the built index.html and a route's metadata, get back the same document
// with the social tags pointing at that route.
//
// The tags come in pairs that must agree or the card breaks in a way nobody
// sees until it is shared: og:image with og:image:width/height, og:image
// with twitter:image, and a summary_large_image card with an image that is
// actually wide. The old shell declared a large card and served a 512px
// square icon, so every link previewed as a cropped logo.
// ============================================================

export const esc = (s) => String(s || '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

/** Replace a tag in the head, or append it when the shell has none. */
export function setMeta(html, matcher, replacement) {
  return matcher.test(html)
    ? html.replace(matcher, replacement)
    : html.replace('</head>', `    ${replacement}\n  </head>`);
}

export function buildOgHead(html, {
  title,
  description,
  url,
  image,
  imageAlt,
  indexable = false,
  width = 1200,
  height = 630,
  type = 'website',
}) {
  // "VetMock — VetMock" helps nobody; the brand is already the site name.
  const fullTitle = title === 'VetMock' ? title : `${title} — VetMock`;
  let out = html;

  out = setMeta(out, /<title>[\s\S]*?<\/title>/, `<title>${esc(fullTitle)}</title>`);
  out = setMeta(out, /<meta name="description"[^>]*>/, `<meta name="description" content="${esc(description)}" />`);
  out = setMeta(out, /<link rel="canonical"[^>]*>/, `<link rel="canonical" href="${esc(url)}" />`);

  out = setMeta(out, /<meta property="og:type"[^>]*>/, `<meta property="og:type" content="${esc(type)}" />`);
  out = setMeta(out, /<meta property="og:title"[^>]*>/, `<meta property="og:title" content="${esc(fullTitle)}" />`);
  out = setMeta(out, /<meta property="og:description"[^>]*>/, `<meta property="og:description" content="${esc(description)}" />`);
  out = setMeta(out, /<meta property="og:url"[^>]*>/, `<meta property="og:url" content="${esc(url)}" />`);
  // The closing quote in `og:image"` is what keeps this off og:image:width.
  out = setMeta(out, /<meta property="og:image"[^>]*>/, `<meta property="og:image" content="${esc(image)}" />`);
  out = setMeta(out, /<meta property="og:image:width"[^>]*>/, `<meta property="og:image:width" content="${width}" />`);
  out = setMeta(out, /<meta property="og:image:height"[^>]*>/, `<meta property="og:image:height" content="${height}" />`);
  out = setMeta(out, /<meta property="og:image:type"[^>]*>/, `<meta property="og:image:type" content="image/png" />`);
  out = setMeta(out, /<meta property="og:image:alt"[^>]*>/, `<meta property="og:image:alt" content="${esc(imageAlt)}" />`);

  out = setMeta(out, /<meta name="twitter:title"[^>]*>/, `<meta name="twitter:title" content="${esc(fullTitle)}" />`);
  out = setMeta(out, /<meta name="twitter:description"[^>]*>/, `<meta name="twitter:description" content="${esc(description)}" />`);
  out = setMeta(out, /<meta name="twitter:image"[^>]*>/, `<meta name="twitter:image" content="${esc(image)}" />`);
  out = setMeta(out, /<meta name="twitter:image:alt"[^>]*>/, `<meta name="twitter:image:alt" content="${esc(imageAlt)}" />`);

  // An application screen is shareable but is not a page a search engine
  // should hold: it needs a year or an account before it means anything.
  // noindex does not affect link previews — they read the OG tags either way.
  // Keep the shell's own rich directive on pages that stay indexable —
  // max-image-preview:large is what lets Google show the cover at full size,
  // so flattening it to a bare "index, follow" would quietly shrink the very
  // preview this change exists to produce.
  const INDEX_DIRECTIVE = 'index, follow, max-snippet:-1, max-image-preview:large';
  out = setMeta(out, /<meta name="robots"[^>]*>/,
    `<meta name="robots" content="${indexable ? INDEX_DIRECTIVE : 'noindex, follow'}" />`);

  return out;
}
