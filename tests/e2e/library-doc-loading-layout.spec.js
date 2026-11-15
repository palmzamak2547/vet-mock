import http from 'node:http';
import { expect, test } from './fixtures.js';

// The reader's loading screen for a shelf deck, while a large file arrives.
// On a 412 px Android phone (15 Nov 2026, a 24.5 MB VCA deck) the mascot's paw
// was drawn over the second line of the deck's title and the large percentage
// over "กำลังโหลด 1.3 / 24.5 MB". Both were positioned outside the loader's own
// 40 px box, so the next element in flow sat under them at any width.
//
// Two code paths write the progress: a deck read by range goes through
// pdf.js's onProgress, any other deck is read whole by fetch (readWithProgress).
// Each is held here at a known size by a local server that sends a
// Content-Length of 24.5 MB, about 1.3 MB of it, and then only a trickle.

test.use({ serviceWorkers: 'block' });

const TOTAL = Math.round(24.5 * 1048576);
const SENT = Math.round(1.3 * 1048576);

let server;
let port;
const sockets = new Set();

test.beforeAll(async () => {
  server = http.createServer((req, res) => {
    // No Accept-Ranges: pdf.js reads the whole response and counts it, which
    // is the path a range-capable deck takes until its first range arrives.
    // ?unsized: no Content-Length, so the reader cannot know a percentage.
    const sized = !req.url.includes('unsized');
    res.writeHead(200, { 'content-type': 'application/pdf', ...(sized ? { 'content-length': String(TOTAL) } : {}), 'cache-control': 'no-store', 'access-control-allow-origin': '*' });
    const head = Buffer.from('%PDF-1.4\n');
    let sent = 0;
    const step = 65536;
    const tick = () => {
      if (res.destroyed) return;
      // After about 1.3 MB the rest only trickles, so the reader keeps
      // repainting a status that no longer moves (it repaints on arrival).
      const n = sent < SENT ? Math.min(step, SENT - sent) : 16;
      const chunk = Buffer.alloc(n, 0x20);
      if (sent === 0) head.copy(chunk);
      res.write(chunk);
      sent += n;
      setTimeout(tick, sent < SENT ? 30 : 300);
    };
    tick();
  });
  server.on('connection', (s) => { sockets.add(s); s.on('close', () => sockets.delete(s)); });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  port = server.address().port;
});

test.afterAll(async () => {
  for (const s of sockets) s.destroy();
  await new Promise((resolve) => server.close(resolve));
});

const TITLES = {
  two: '2025 VCA FOR CUVET84 (Helminths and Protozoa) (ไฟล์ย่อ)',
  // At 820 px the reader's column is 720 px wide, so the name needs more words to wrap.
  wide: 'Parasitology 2025 VCA FOR CUVET84 (Helminths and Protozoa) ชุดรวมข้อสอบเก่าพร้อมเฉลย (ไฟล์ย่อ)',
  long: '2025 VCA FOR CUVET84 (Helminths and Protozoa) ชุดรวมข้อสอบเก่าพร้อมเฉลยละเอียดทุกข้อ ปรสิตวิทยาและโปรโตซัว ฉบับรวมเล่มสำหรับอ่านก่อนสอบ (ไฟล์ย่อ)',
};

// The shelf snapshot answers findLibraryDoc first, so a deck of any shape can
// be put on this device's shelf without a database (CI builds without one).
// It is written by an init script in the reader's own document, and every
// caches.open waits for that write: Playwright's WebKit keeps Cache Storage
// only for the document that wrote it (measured 15 Nov 2026: put, navigate,
// match finds nothing), so a snapshot written on an earlier page never reached
// the reader there and the deck came up "not found", with no download at all.
// The link names the slow server itself, so the body streams from a real
// socket on every engine (a plain WebKit fetch from that server streams 1.3 MB
// in 49 reads before the end, as Chromium does).
async function openShelved(page, { slug, title, ranged, sized = true }) {
  await page.route(/\/_vercel\/(insights|speed-insights)\/script[^/]*\.js|va\.vercel-scripts\.com\/.*script/,
    (route) => route.fulfill({ contentType: 'application/javascript', body: '' }));
  await page.route('**/api/library-file?slug=*', (route) => route.fulfill({ json: { url: `http://127.0.0.1:${port}/deck.pdf${sized ? '' : '?unsized'}` } }));
  await page.addInitScript((doc) => {
    if (typeof caches === 'undefined') return;
    const proto = Object.getPrototypeOf(caches);
    const open = proto.open;
    const ready = open.call(caches, 'vmx-library-catalog-v1')
      .then((cache) => cache.put('/__vmx/library-catalog.json', new Response(JSON.stringify({ at: Date.now(), docs: [doc] }),
        { headers: { 'content-type': 'application/json' } })))
      .catch(() => {});
    proto.open = function openAfterSeed(name) { return ready.then(() => open.call(this, name)); };
  }, {
    id: slug, slug, title, status: 'public', mime: 'application/pdf', storage_provider: 'r2',
    storage_key: `test/${slug}.pdf`, byte_size: TOTAL, page_count: 40, sha256_16: null,
    linearized: false, range_supported: ranged, subject: 'vca', year: 5,
  });
  await page.goto(`/app/tools/pdf?doc=${slug}`);
}

// The four boxes that must never share a pixel. The mascot is the paw inside
// the bar; the percentage and the size line are whatever element shows them.
async function boxes(page) {
  return page.evaluate(() => {
    const rect = (el) => {
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return r.width && r.height ? { left: r.left, top: r.top, right: r.right, bottom: r.bottom } : null;
    };
    const root = document.querySelector('.vmx-document-loading');
    const value = [...(root?.querySelectorAll('.vm-progress-value, [data-loading-percent]') || [])]
      .find((el) => getComputedStyle(el).display !== 'none' && el.getBoundingClientRect().height > 0);
    return {
      title: rect(document.querySelector('.vmx-doc-opening h1')),
      titleLines: (() => {
        const h = document.querySelector('.vmx-doc-opening h1');
        return h ? Math.round(h.getBoundingClientRect().height / parseFloat(getComputedStyle(h).lineHeight)) : 0;
      })(),
      mascot: rect(root?.querySelector('.vm-progress-fill svg')),
      percent: rect(value),
      size: rect(root?.querySelector('[data-loading-size]') || root?.querySelector(':scope > span:not(.vmx-motion-loader)')),
      sizeText: (root?.querySelector('[data-loading-size]') || root?.querySelector(':scope > span:not(.vmx-motion-loader)'))?.textContent || '',
    };
  });
}

const overlap = (a, b) => !!(a && b && a.left < b.right - 0.5 && b.left < a.right - 0.5 && a.top < b.bottom - 0.5 && b.top < a.bottom - 0.5);

function intersections(b) {
  const names = ['title', 'mascot', 'percent', 'size'];
  const out = [];
  for (let i = 0; i < names.length; i++) {
    for (let j = i + 1; j < names.length; j++) {
      if (overlap(b[names[i]], b[names[j]])) out.push(`${names[i]} x ${names[j]}`);
    }
  }
  return out;
}

const SIZES = [
  { width: 390, height: 664 },
  { width: 412, height: 915 },
  { width: 820, height: 1180 },
];
const PATHS = [
  { name: 'read by range (pdf.js progress)', ranged: true },
  { name: 'read whole (fetch progress)', ranged: false },
];

for (const path of PATHS) {
  for (const size of SIZES) {
    test(`loading a large deck, ${path.name}, ${size.width}x${size.height}: title, mascot, percentage and size never overlap`, async ({ page }, info) => {
      await page.setViewportSize(size);
      const slug = `slow-deck-${path.ranged ? 'range' : 'whole'}`;
      await openShelved(page, { slug, title: size.width > 600 ? TITLES.wide : TITLES.two, ranged: path.ranged });
      const status = page.locator('.vmx-document-loading');
      await expect(status).toContainText(/1\.[0-9] \/ 24\.5 MB/, { timeout: 30_000 });
      await expect(status.locator('.vmx-motion-loader.is-measured')).toBeVisible();
      if (process.env.VMX_SHOT_DIR) {
        await page.screenshot({ path: `${process.env.VMX_SHOT_DIR}/${process.env.VMX_SHOT_TAG || 'shot'}-${path.ranged ? 'range' : 'whole'}-${size.width}x${size.height}.png` });
      }
      const b = await boxes(page);
      expect(b.titleLines, 'the title wraps to two lines here').toBeGreaterThanOrEqual(2);
      expect(b.mascot, 'the mascot is drawn').not.toBeNull();
      expect(b.percent, 'a percentage is shown').not.toBeNull();
      expect(intersections(b), JSON.stringify(b)).toEqual([]);
      // One status: the percentage sits on the size line's row, not on a line of its own.
      expect(Math.abs((b.percent.top + b.percent.bottom) / 2 - (b.size.top + b.size.bottom) / 2) < 12
        || b.percent.top >= b.size.bottom || b.size.top >= b.percent.bottom).toBe(true);
      info.annotations.push({ type: 'boxes', description: JSON.stringify(b) });
    });
  }
}

// Longer titles and everything drawn 125% larger (the sizes are px tokens, so a
// root font size alone would not grow them), on the phone width that reported it.
for (const path of PATHS) {
  test(`loading a large deck, ${path.name}: a title of four lines or more, enlarged 125%, still leaves each its own place`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 664 });
    const slug = `slow-deck-long-${path.ranged ? 'range' : 'whole'}`;
    await page.addInitScript(() => {
      document.addEventListener('DOMContentLoaded', () => { document.documentElement.style.zoom = '1.25'; });
    });
    await openShelved(page, { slug, title: TITLES.long, ranged: path.ranged });
    const status = page.locator('.vmx-document-loading');
    await expect(status).toContainText(/1\.[0-9] \/ 24\.5 MB/, { timeout: 30_000 });
    if (process.env.VMX_SHOT_DIR) {
      await page.screenshot({ path: `${process.env.VMX_SHOT_DIR}/${process.env.VMX_SHOT_TAG || 'shot'}-${path.ranged ? 'range' : 'whole'}-long-zoom125.png` });
    }
    const b = await boxes(page);
    expect(b.titleLines).toBeGreaterThanOrEqual(3);
    expect(intersections(b), JSON.stringify(b)).toEqual([]);
  });
}

// With no known size there is no bar and no percentage: the small loader and
// the received size still sit under the title, each in its own place.
for (const path of PATHS) {
  test(`loading a deck of unknown size, ${path.name}: title, loader and status never overlap`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 664 });
    const slug = `unsized-deck-${path.ranged ? 'range' : 'whole'}`;
    await openShelved(page, { slug, title: TITLES.two, ranged: path.ranged, sized: false });
    const status = page.locator('.vmx-document-loading');
    await expect(status).toContainText(/กำลังโหลด/, { timeout: 30_000 });
    await expect(status.locator('[data-loading-percent]')).toHaveCount(0);
    const b = await page.evaluate(() => {
      const rect = (el) => { const r = el?.getBoundingClientRect(); return r && r.width && r.height ? { left: r.left, top: r.top, right: r.right, bottom: r.bottom } : null; };
      return {
        title: rect(document.querySelector('.vmx-doc-opening h1')),
        mascot: rect(document.querySelector('.vmx-document-loading .vmx-motion-loader')),
        percent: null,
        size: rect(document.querySelector('.vmx-document-loading [data-loading-size]')),
      };
    });
    expect(b.size).not.toBeNull();
    expect(intersections(b), JSON.stringify(b)).toEqual([]);
  });
}
