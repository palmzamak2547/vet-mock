// Browser-side helpers shared by tests/e2e/perf-budget.spec.js and scripts/perf.mjs, so the two decide in
// the same way that a screen has settled. Nothing here imports Playwright: it works on the context and the
// page it is handed.

/**
 * Every http(s) request the context starts, kept so a screen's cost can be read once it has settled, and a
 * "quiet" test that means what it says: no request in flight for half a second. Playwright's own
 * `networkidle` fires once per navigation and then stays fired, so it cannot see the work an app starts
 * later (the idle prefetch of the next screens).
 */
export function watchNetwork(context, origin) {
  const started = [];
  const inflight = new Set();
  let lastEvent = Date.now();
  const done = (request) => { inflight.delete(request); lastEvent = Date.now(); };
  context.on('request', (request) => {
    if (!/^https?:/.test(request.url())) return;
    started.push(request);
    inflight.add(request);
    lastEvent = Date.now();
  });
  context.on('requestfinished', done);
  context.on('requestfailed', done);
  return {
    /** Resolves when nothing has been in flight for `ms`; throws, naming what is, after `timeout`. */
    async quiet(ms = 500, timeout = 20_000) {
      const t0 = Date.now();
      while (Date.now() - t0 < timeout) {
        if (inflight.size === 0 && Date.now() - lastEvent >= ms) return;
        await new Promise((r) => setTimeout(r, 50));
      }
      throw new Error(`the network was not quiet after ${timeout} ms; in flight: ${[...inflight].map((r) => r.url()).join(', ')}`);
    },
    /** Resolves once a request whose URL matches `pattern` has been started (it may already have been); throws after `timeout`. */
    async seen(pattern, timeout = 20_000) {
      const t0 = Date.now();
      while (!started.some((request) => pattern.test(request.url()))) {
        if (Date.now() - t0 > timeout) throw new Error(`no request matching ${pattern} within ${timeout} ms`);
        await new Promise((r) => setTimeout(r, 50));
      }
    },
    /** Requests started, same-origin image bytes, and how many requests went to another host. */
    async summary() {
      let imageBytes = 0;
      for (const request of started) {
        if (request.resourceType() !== 'image' || new URL(request.url()).origin !== origin) continue;
        try { imageBytes += (await request.sizes()).responseBodySize; } catch { /* aborted or failed: no bytes */ }
      }
      return { requests: started.length, imageBytes, external: started.filter((r) => new URL(r.url()).origin !== origin).length };
    },
  };
}

/**
 * The screen has stopped changing: fonts decoded, the images in view decoded, two frames drawn, the app's own
 * idle work run (it asks for idle time to fetch the next screens once it is up; this callback queues behind that
 * one, so what it starts has started by the time the network is checked), and the network quiet.
 */
export async function settlePage(page, network) {
  await page.evaluate(async () => {
    await document.fonts.ready;
    const visible = [...document.images].filter((img) => {
      const r = img.getBoundingClientRect();
      return img.currentSrc && r.width > 0 && r.height > 0 && r.bottom > 0 && r.top < innerHeight;
    });
    await Promise.all(visible.map((img) => Promise.race([img.decode().catch(() => {}), new Promise((r) => setTimeout(r, 5000))])));
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
    await new Promise((r) => (window.requestIdleCallback ? window.requestIdleCallback(() => r(), { timeout: 5000 }) : setTimeout(r, 1500)));
  });
  await network.quiet();
}
