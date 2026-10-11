// ============================================================
// web-app-manifest.test.mjs — what makes an install from vetmock.com a real app
// ============================================================
// Installed from vetmock.com, VetMock should open without the browser's bar on
// every page of the site. That holds only while the page's address stays inside
// the manifest's scope, the identity stays one app, and the files the install
// sheet needs are really there. These pin the parts a later edit could break
// without anyone noticing until a student installs it on a phone:
//
//   - id, start_url and scope are one app on the origin root, so an app
//     installed today is still the same app after its start page changes;
//   - the icons exist, at the sizes the manifest says, with a maskable one at
//     both sizes Chrome asks for;
//   - every shortcut stays in scope and names a route the host really serves;
//   - the page head carries the iOS and Android app meta and the touch icon;
//   - nothing in the app builds a link to another VetMock address (the old
//     host, a www host) that would put the browser's bar back over the page.
// ============================================================
import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = new URL('../../', import.meta.url);
const read = (path) => readFileSync(new URL(path, ROOT), 'utf8');
const MANIFEST = JSON.parse(read('public/manifest.webmanifest'));
const HTML = read('index.html');
const VERCEL = JSON.parse(read('vercel.json'));
const PRODUCTION = 'https://vetmock.com/';

// A PNG's size is in its header: the IHDR chunk's first two big-endian words.
function pngSize(path) {
  const bytes = readFileSync(new URL(path, ROOT));
  assert.equal(bytes.subarray(1, 4).toString('latin1'), 'PNG', `${path} is a PNG`);
  return { width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) };
}
const fileOf = (src) => `public${src}`;

test('id, start_url and scope are one app at the origin root', () => {
  assert.equal(typeof MANIFEST.id, 'string', 'an explicit id keeps the app the same app if start_url ever changes');
  const id = new URL(MANIFEST.id, PRODUCTION);
  const start = new URL(MANIFEST.start_url, PRODUCTION);
  const scope = new URL(MANIFEST.scope, PRODUCTION);
  assert.equal(scope.href, PRODUCTION, 'the scope is the whole site, so no page of it shows the browser\'s bar');
  assert.ok(start.href.startsWith(scope.href), 'the start page is inside the scope');
  assert.equal(id.href, start.href, 'the id is what the browser derived before there was one, so installed apps keep their identity');
  assert.equal(id.origin, PRODUCTION.slice(0, -1));
});

test('it opens as an app, in Thai, with colours the browser can use', () => {
  assert.equal(MANIFEST.display, 'standalone');
  assert.equal(MANIFEST.display_override, undefined, 'a fallback chain would only matter for a mode this app does not use');
  assert.equal(MANIFEST.lang, 'th');
  assert.equal(MANIFEST.prefer_related_applications, undefined, 'nothing sends the learner to a store');
  assert.match(MANIFEST.theme_color, /^#[0-9a-f]{6}$/i);
  assert.match(MANIFEST.background_color, /^#[0-9a-f]{6}$/i);
  assert.ok(MANIFEST.name && MANIFEST.short_name && MANIFEST.short_name.length <= 12, 'a launcher label that fits under an icon');
  assert.ok(!/·/.test(JSON.stringify(MANIFEST)), 'no middle dot as a separator');
  assert.ok(!/ข้อสอบเก่า/.test(JSON.stringify(MANIFEST)));
});

test('every icon exists at the size it declares, and 192 and 512 each come maskable', () => {
  const sized = MANIFEST.icons.filter((icon) => /^\d+x\d+$/.test(icon.sizes));
  assert.ok(sized.length >= 3);
  for (const icon of MANIFEST.icons) {
    assert.ok(existsSync(new URL(fileOf(icon.src), ROOT)), `${icon.src} exists`);
    assert.ok(!icon.src.startsWith('http'), 'icons are served from the same origin');
  }
  for (const icon of sized) {
    const [w, h] = icon.sizes.split('x').map(Number);
    assert.deepEqual(pngSize(fileOf(icon.src)), { width: w, height: h }, `${icon.src} really is ${icon.sizes}`);
  }
  for (const size of ['192x192', '512x512']) {
    const forSize = sized.filter((icon) => icon.sizes === size);
    assert.ok(forSize.some((icon) => /\bany\b/.test(icon.purpose || 'any')), `${size} has an icon for the home screen`);
    assert.ok(forSize.some((icon) => /\bmaskable\b/.test(icon.purpose || '')), `${size} has a maskable icon for Android's round and squircle masks`);
  }
  const iconsFile = statSync(new URL('public/icon-512.png', ROOT));
  assert.ok(iconsFile.size < 100_000, 'the install sheet does not wait on a heavy icon');
});

test('every shortcut stays in scope and names a route the host serves', () => {
  const scope = new URL(MANIFEST.scope, PRODUCTION);
  const sources = VERCEL.rewrites.map((r) => r.source);
  const served = (path) => sources.some((source) => new RegExp(`^${source.replace(/:path\*/g, '.*')}$`).test(path));
  for (const shortcut of MANIFEST.shortcuts || []) {
    const url = new URL(shortcut.url, PRODUCTION);
    assert.ok(url.href.startsWith(scope.href), `${shortcut.name} stays inside the app`);
    assert.ok(served(url.pathname), `${shortcut.url} is rewritten to a page, not a 404`);
    assert.ok(shortcut.name && shortcut.short_name);
    for (const icon of shortcut.icons || []) assert.ok(existsSync(new URL(fileOf(icon.src), ROOT)), icon.src);
  }
});

test('the page head carries the manifest, the iOS and Android app meta and a touch icon that exists', () => {
  assert.match(HTML, /<link rel="manifest" href="\/manifest\.webmanifest"\s*\/?>/);
  assert.match(HTML, /<meta name="apple-mobile-web-app-capable" content="yes"/);
  assert.match(HTML, /<meta name="mobile-web-app-capable" content="yes"/);
  assert.match(HTML, /<meta name="apple-mobile-web-app-title" content="VetMock"/);
  assert.match(HTML, /<meta name="apple-mobile-web-app-status-bar-style" content="default"/);
  assert.match(HTML, /<meta name="viewport"[^>]*viewport-fit=cover/);
  assert.match(HTML, /<meta name="theme-color" content="#4a6b4a" media="\(prefers-color-scheme: light\)"/);
  assert.match(HTML, /<meta name="theme-color" content="#2b2419" media="\(prefers-color-scheme: dark\)"/);
  const touch = /<link rel="apple-touch-icon" href="([^"]+)"/.exec(HTML)?.[1];
  assert.ok(touch && existsSync(new URL(fileOf(touch), ROOT)), 'the iOS home-screen icon exists');
  assert.deepEqual(pngSize(fileOf(touch)), { width: 180, height: 180 });
});

test('the manifest is revalidated within the hour, and never cached like an asset', () => {
  const rule = VERCEL.headers.find((h) => h.source === '/manifest.webmanifest');
  const cache = rule?.headers.find((h) => h.key === 'Cache-Control')?.value || '';
  assert.match(cache, /max-age=\d+/);
  assert.ok(Number(/max-age=(\d+)/.exec(cache)[1]) <= 3600);
  assert.ok(!/immutable/.test(cache));
});

// The scope is the origin. A link to the old host or to a www host would leave
// it, and an installed app would show the browser's bar there. The old host may
// be named (allowlists, the move notice, comments); it may not be a destination.
function sourceFiles(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    if (entry === 'data') continue; // content, not navigation
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) sourceFiles(full, out);
    else if (/\.(jsx?|mjs)$/.test(entry)) out.push(full);
  }
  return out;
}

test('nothing in the app links to another VetMock address, so no page leaves the installed scope', () => {
  const other = '(?:vetmock\\.vercel\\.app|www\\.vetmock\\.com)';
  const destinations = [
    new RegExp(`(?:href|src|action)\\s*=\\s*[{"'\`][^"'\`}]*${other}`),
    new RegExp(`(?:window\\.open|location\\.(?:assign|replace)|navigate)\\(\\s*[^)]*${other}`),
    new RegExp(`location(?:\\.href)?\\s*=\\s*[^;\\n]*${other}`),
  ];
  const offenders = [];
  for (const file of sourceFiles(fileURLToPath(new URL('src/', ROOT)))) {
    const text = readFileSync(file, 'utf8');
    text.split('\n').forEach((line, i) => {
      if (/^\s*(\/\/|\*|\/\*)/.test(line)) return;
      if (destinations.some((re) => re.test(line))) offenders.push(`${file}:${i + 1}: ${line.trim()}`);
    });
  }
  assert.deepEqual(offenders, []);
});
