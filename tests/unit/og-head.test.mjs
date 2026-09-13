// ============================================================
// og-head.test.mjs
// ============================================================
// The head rewriter that gives every route its own link preview. These
// assertions are all about pairs of tags that have to agree: an image and
// the dimensions declared for it, og:image and twitter:image, a large-card
// declaration and an image wide enough to fill it. Get one half right and
// the card still breaks, and it breaks somewhere nobody on the team looks —
// inside someone else's chat app.
// ============================================================
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

import { buildOgHead, esc } from '../../scripts/lib/og-head.mjs';
import { OG_COVERS, OG_IMAGE_WIDTH, OG_IMAGE_HEIGHT, ogCoverForRoute, ogCoverFor } from '../../src/data/og-covers.js';
import { APP_VIEW_ROUTES } from '../../src/lib/view-route.js';

const SHELL = fs.readFileSync(new URL('../../index.html', import.meta.url), 'utf8');

const meta = (html, attr, name) => {
  const re = new RegExp(`<meta ${attr}="${name.replace(/[:]/g, ':')}" content="([^"]*)"`);
  const m = re.exec(html);
  return m ? m[1] : null;
};
const prop = (html, name) => meta(html, 'property', name);
const named = (html, name) => meta(html, 'name', name);

const ROUTE_ARGS = {
  title: 'จับเวลาโฟกัส',
  description: 'โฟกัสครั้งละ 25 นาที',
  url: 'https://vetmock.vercel.app/app/focus',
  image: 'https://vetmock.vercel.app/og/pomodoro.png',
  imageAlt: 'อยู่กับ หน้าตรงนี้ — จับเวลาโฟกัส บน VetMock',
};

// ── the tags that must agree ─────────────────────────────────────
test('the image and the dimensions declared for it stay together', () => {
  const out = buildOgHead(SHELL, { ...ROUTE_ARGS, width: OG_IMAGE_WIDTH, height: OG_IMAGE_HEIGHT });
  assert.equal(prop(out, 'og:image'), ROUTE_ARGS.image);
  assert.equal(prop(out, 'og:image:width'), String(OG_IMAGE_WIDTH));
  assert.equal(prop(out, 'og:image:height'), String(OG_IMAGE_HEIGHT));
  assert.equal(prop(out, 'og:image:type'), 'image/png');
});

test('replacing og:image does not swallow og:image:width', () => {
  // `og:image` is a prefix of `og:image:width`; only the closing quote keeps
  // the two apart. If that ever regresses, width disappears entirely.
  const out = buildOgHead(SHELL, { ...ROUTE_ARGS, width: 1200, height: 630 });
  assert.ok(out.includes('property="og:image:width"'), 'og:image:width must survive');
  assert.equal((out.match(/property="og:image"/g) || []).length, 1, 'exactly one og:image');
});

test('twitter gets the same image, not the old square icon', () => {
  const out = buildOgHead(SHELL, ROUTE_ARGS);
  assert.equal(named(out, 'twitter:image'), ROUTE_ARGS.image);
  assert.equal(named(out, 'twitter:image:alt'), ROUTE_ARGS.imageAlt);
  assert.ok(!out.includes('icon-512.png'), 'no tag may still point at the 512px icon');
});

test('a large-summary card is never paired with a square image', () => {
  const out = buildOgHead(SHELL, { ...ROUTE_ARGS, width: OG_IMAGE_WIDTH, height: OG_IMAGE_HEIGHT });
  if (named(out, 'twitter:card') === 'summary_large_image') {
    assert.ok(Number(prop(out, 'og:image:width')) > Number(prop(out, 'og:image:height')),
      'summary_large_image needs a landscape image');
  }
});

// ── indexing ─────────────────────────────────────────────────────
test('an app screen is shareable but not indexable', () => {
  const out = buildOgHead(SHELL, { ...ROUTE_ARGS, indexable: false });
  assert.equal(named(out, 'robots'), 'noindex, follow');
  // noindex must not strip what a preview reads.
  assert.equal(prop(out, 'og:image'), ROUTE_ARGS.image);
  assert.equal(prop(out, 'og:title'), 'จับเวลาโฟกัส — VetMock');
});

test('an indexable page keeps the rich directive, not a flattened one', () => {
  const out = buildOgHead(SHELL, { ...ROUTE_ARGS, indexable: true });
  assert.match(named(out, 'robots'), /max-image-preview:large/,
    'flattening this shrinks the very preview the covers exist to produce');
});

// ── titles and escaping ──────────────────────────────────────────
test('the brand is not repeated in its own title', () => {
  const out = buildOgHead(SHELL, { ...ROUTE_ARGS, title: 'VetMock' });
  assert.equal(prop(out, 'og:title'), 'VetMock');
});

test('quotes in copy cannot break out of an attribute', () => {
  const out = buildOgHead(SHELL, { ...ROUTE_ARGS, description: 'a "quoted" <b>bit</b>' });
  assert.ok(!out.includes('content="a "quoted"'), 'the attribute must stay closed');
  assert.equal(esc('a "b" <c>'), 'a &quot;b&quot; &lt;c&gt;');
});

test('canonical and og:url point at the same place', () => {
  const out = buildOgHead(SHELL, ROUTE_ARGS);
  assert.equal(prop(out, 'og:url'), ROUTE_ARGS.url);
  assert.match(out, new RegExp(`<link rel="canonical" href="${ROUTE_ARGS.url}"`));
});

test('a shell missing a tag gets it appended rather than dropped', () => {
  const bare = '<html><head><title>x</title></head><body></body></html>';
  const out = buildOgHead(bare, ROUTE_ARGS);
  assert.equal(prop(out, 'og:image'), ROUTE_ARGS.image);
  assert.equal(named(out, 'twitter:image'), ROUTE_ARGS.image);
  assert.ok(out.includes('</head>'));
});

// ── the data behind it ───────────────────────────────────────────
test('every route the router can reach has a cover', () => {
  for (const [view, route] of Object.entries(APP_VIEW_ROUTES)) {
    assert.ok(ogCoverForRoute(route), `${view} (${route}) has no share cover`);
  }
});

test('a trailing slash resolves to the same cover', () => {
  assert.equal(ogCoverForRoute('/app/library/')?.id, ogCoverForRoute('/app/library')?.id);
  assert.equal(ogCoverForRoute('/')?.id, 'home');
});

test('every cover ships the image it names', () => {
  for (const c of OG_COVERS) {
    const file = new URL(`../../public/og/${c.id}.png`, import.meta.url);
    assert.ok(fs.existsSync(file), `public/og/${c.id}.png is missing`);
  }
});

test('alt text describes the image, not the route', () => {
  // `cover` is the headline printed on the PNG. It becomes the alt text, so
  // it has to be what the picture actually says — inventing a nicer line
  // describes an image that does not exist.
  for (const c of OG_COVERS) {
    assert.ok(c.cover && c.cover.trim().length > 0, `${c.id} has no cover headline`);
  }
});

test('descriptions are short enough to survive a preview', () => {
  for (const c of OG_COVERS) {
    assert.ok(c.description.length <= 200, `${c.id} description is ${c.description.length} chars`);
    assert.ok(c.title.length <= 70, `${c.id} title is ${c.title.length} chars`);
  }
});

test('only genuinely public pages are indexable', () => {
  const indexable = OG_COVERS.filter((c) => c.indexable).map((c) => c.id).sort();
  assert.deepEqual(indexable, ['about', 'blog', 'home', 'privacy', 'wiki'],
    'an app screen that needs a year or an account is not a page a search engine should hold');
});

test('ogCoverFor finds by id', () => {
  assert.equal(ogCoverFor('pomodoro')?.route, '/app/focus');
  assert.equal(ogCoverFor('nope'), null);
});
