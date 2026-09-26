import { test as base, expect as defaultExpect } from './fixtures.js';
import { readFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { UPDATE_UNSAFE_VIEWS as legacyUnsafeViews } from '../fixtures/legacy-update-e6ab5ea2/update-safety.js';

// Exercise the real worker and lifecycle in an isolated origin. The tiny
// document makes any reload observable without depending on the app's data,
// authentication or external services. No production worker is touched.
const workerSource = readFileSync(new URL('../../public/sw.js', import.meta.url), 'utf8');
const lifecycleSource = readFileSync(new URL('../../src/lib/app-lifecycle.js', import.meta.url), 'utf8')
  .replace('import.meta.env?.MODE', '"production"')
  // Fixture-only scope lets an uncontrolled same-origin document observe the
  // browser's activation boundary without opening another controlled client.
  .replace("register('/sw.js')", "register('/sw.js', { scope: '/app/' })");
const policySource = readFileSync(new URL('../../src/lib/update-safety.js', import.meta.url), 'utf8');
// Exact production source at e6ab5ea2, before this release. A modern/modern
// transition alone cannot expose the legacy controllerchange reload handler.
const legacyLifecycleSource = readFileSync(new URL('../fixtures/legacy-update-e6ab5ea2/app-lifecycle.js', import.meta.url), 'utf8')
  .replace('import.meta.env?.MODE', '"production"')
  .replace("register('/sw.js')", "register('/sw.js', { scope: '/app/' })");
const legacyPolicySource = readFileSync(new URL('../fixtures/legacy-update-e6ab5ea2/update-safety.js', import.meta.url), 'utf8');

const test = base.extend({
  updateServer: async ({ context }, use) => {
    let revision = 'A', legacyFirst = false, failPrecache = false, disconnected = false, failedRequests = 0;
    const server = createServer((request, reply) => {
      if (disconnected) { failedRequests++; reply.destroy(); return; }
      const path = new URL(request.url, 'http://127.0.0.1').pathname;
      reply.setHeader('Cache-Control', 'no-store');
      if (path === '/__observer') {
        reply.setHeader('Content-Type', 'text/html');
        reply.end('<!doctype html><title>Uncontrolled update observer</title>');
        return;
      }
      if (path === '/sw.js') {
        reply.setHeader('Content-Type', 'application/javascript');
        reply.end(workerSource.replace(/const SW_VERSION = '[^']+';/, `const SW_VERSION = 'browser-test-${revision}';`));
        return;
      }
      if (path === `/assets/entry-${revision}.js`) {
        reply.setHeader('Content-Type', 'application/javascript');
        reply.end(`document.documentElement.dataset.entryBuild = '${revision}';\n`
          + (legacyFirst && revision === 'A' ? legacyLifecycleSource : lifecycleSource)
            .replace("'./update-safety.js'", legacyFirst && revision === 'A' ? "'../update-safety-legacy.js'" : "'../update-safety.js'"));
        return;
      }
      if (path === '/update-safety.js') {
        reply.setHeader('Content-Type', 'application/javascript'); reply.end(policySource); return;
      }
      if (path === '/update-safety-legacy.js') {
        reply.setHeader('Content-Type', 'application/javascript'); reply.end(legacyPolicySource); return;
      }
      if (path === '/assets/storage-gc.js' || path === '/assets/daily-q.js') {
        // The unrelated idle storage sweep is outside this update fixture.
        reply.setHeader('Content-Type', 'application/javascript');
        reply.end(path === '/assets/daily-q.js'
          ? 'export const todayKey = () => "2026-09-19";'
          : 'export const sweepStaleKeys = () => ({removed:[],bytes:0}); export const outboxPrefixes = () => [];');
        return;
      }
      if (failPrecache && ['/', '/manifest.webmanifest', '/favicon.svg', '/icon-192.png'].includes(path)) {
        reply.destroy(); return;
      }
      if (path === '/manifest.webmanifest') {
        reply.setHeader('Content-Type', 'application/manifest+json'); reply.end('{}'); return;
      }
      if (path === '/favicon.svg' || path === '/icon-192.png') {
        reply.setHeader('Content-Type', 'image/svg+xml'); reply.end('<svg xmlns="http://www.w3.org/2000/svg"/>'); return;
      }
      if (path === '/' || path.startsWith('/app/')) {
        reply.setHeader('Content-Type', 'text/html; charset=utf-8');
        reply.end(`<!doctype html><html><head><meta charset="utf-8"><title>Update session fixture</title></head>
          <body data-build="${revision}"><label>Study draft<textarea id="draft"></textarea></label>
          <p id="position">Reading position</p><script>
            window.documentIdentity = crypto.randomUUID();
            window.controllerChanges = 0;
            history.replaceState({vmxView:'notes'}, '', location.href);
            navigator.serviceWorker.addEventListener('controllerchange', () => { window.controllerChanges++; });
            ${legacyFirst && revision === 'A' ? `
            // Reproduce App.jsx e6ab5ea2's pendingUpdateRef/applyPendingUpdate
            // bridge. The actual fixture lifecycle arms its own private reload
            // flag when this bridge emits vmx-sw-apply-update.
            const unsafeViews = ${JSON.stringify(legacyUnsafeViews)};
            window.legacyPendingReason = null;
            window.legacyApplyCount = 0;
            window.addEventListener('vmx-sw-update', event => {
              window.legacyPendingReason = event.detail?.reason || 'pending';
            });
            const applyLegacyPendingUpdate = leavingView => {
              const reason = window.legacyPendingReason;
              if (!reason || unsafeViews.includes(leavingView) || unsafeViews.includes(history.state?.vmxView)) return;
              window.legacyPendingReason = null;
              window.legacyApplyCount++;
              if (reason === 'service-worker') window.dispatchEvent(new Event('vmx-sw-apply-update'));
              else location.reload();
            };
            document.addEventListener('visibilitychange', () => {
              if (document.visibilityState === 'hidden') applyLegacyPendingUpdate();
            });
            window.legacyNavigate = next => {
              const previous = history.state?.vmxView;
              history.pushState({vmxView:next}, '', '/app/' + next);
              applyLegacyPendingUpdate(previous);
            };
            ` : ''}
          </script><script type="module" src="/assets/entry-${revision}.js"></script></body></html>`);
        return;
      }
      reply.writeHead(404); reply.end('not found');
    });
    await new Promise((resolve, reject) => {
      server.once('error', reject);
      server.listen(0, '127.0.0.1', resolve);
    });
    let observer;
    try {
      observer = await context.newPage();
      await observer.goto(`http://127.0.0.1:${server.address().port}/__observer`);
      await use({
        origin: `http://127.0.0.1:${server.address().port}`,
        observer,
        useLegacyFirstDocument() { legacyFirst = true; },
        deploy(next, { failShell = false } = {}) { revision = next; failPrecache = failShell; },
        disconnect() { disconnected = true; },
        reconnect() { disconnected = false; },
        failedRequests() { return failedRequests; },
      });
    } finally {
      await observer?.close();
      await new Promise(resolve => {
        server.close(resolve);
        server.closeAllConnections();
      });
    }
  },
});

test.use({ serviceWorkers: 'allow' });
// Every wait in this file is a wait on a service worker: the browser starting
// one so it can answer, or serving a document's entry chunk through it. On a
// loaded runner those steps regularly outlast the suite's 15s default, and a
// document whose entry chunk has not run yet reports the attribute as null.
// An expect timeout is how long a condition may take to become true, so
// nothing below is weakened — the worker is only measured on its own clock.
const expect = defaultExpect.configure({ timeout: 30_000 });
test.setTimeout(90_000);

// `which` picks the document's own controller or the registration's active
// worker. A browser may have to start the worker before it can answer, so a
// single round trip is never proof of anything: null means "nothing answered
// yet", and every call site polls rather than reading it as a version.
async function workerVersion(page, which = 'controller') {
  return page.evaluate(async (pick) => {
    const worker = pick === 'controller'
      ? navigator.serviceWorker.controller
      : (await navigator.serviceWorker.getRegistration('/app/'))?.active;
    if (!worker) return null;
    return new Promise(resolve => {
      const channel = new MessageChannel();
      const timer = setTimeout(() => { channel.port1.close(); resolve(null); }, 5000);
      channel.port1.onmessage = event => {
        clearTimeout(timer); channel.port1.close(); resolve(event.data?.version || null);
      };
      worker.postMessage('GET_VERSION', [channel.port2]);
    });
  }, which);
}

async function triggerUpdateCheck(page) {
  // Ask the browser to check now instead of waiting for its hourly schedule.
  // Installation/activation still belongs entirely to the real lifecycle.
  await page.evaluate(async () => {
    const registration = await navigator.serviceWorker.getRegistration();
    await registration.update();
  });
}

async function prepareVisitedShell(page) {
  // A controlled response can reach the document before waitUntil finishes
  // storing it. Establish actual durable A resources before simulating deploy
  // or disconnection; do not seed CacheStorage with test-created responses.
  await page.evaluate(async () => {
    for (const path of ['/', '/assets/entry-A.js', '/update-safety.js']) {
      const result = await fetch(path, { cache: 'reload' });
      if (!result.ok) throw new Error(`Cannot prepare visited shell: ${path} (${result.status})`);
      await result.arrayBuffer();
    }
  });
  await expect.poll(() => page.evaluate(async () => {
    const runtime = await caches.open('vmx-runtime-browser-test-A');
    return (await Promise.all(['/', '/update-safety.js'].map(path => runtime.match(path)))).every(Boolean)
      && Boolean(await (await caches.open('vmx-assets-v1')).match('/assets/entry-A.js'));
  })).toBe(true);
}

async function waitForInstalledUpdate(page) {
  await expect.poll(() => page.evaluate(async () => (await navigator.serviceWorker.getRegistration())?.waiting?.state)).toBe('installed');
}

async function waitForNaturalActivation(observer) {
  expect(await observer.evaluate(() => navigator.serviceWorker.controller)).toBeNull();
  // Ask the new worker itself instead of reading a state string off this page.
  // WebKit never delivers the activating→activated transition to a client it
  // does not control, so an uncontrolled observer reports 'activating' for the
  // rest of its life while a window opened beside it is already controlled by
  // the activated worker — measured directly: a stalled observer and a fresh
  // page reporting activated, controlled and build B at the same instant.
  // Nothing waiting plus the new worker answering is that same guarantee,
  // taken where the browser actually keeps it current.
  await expect.poll(async () => ({
    waiting: await observer.evaluate(async () => Boolean((await navigator.serviceWorker.getRegistration('/app/'))?.waiting)),
    version: await workerVersion(observer, 'active'),
  })).toEqual({ waiting: false, version: 'browser-test-B' });
}

async function reopenAfterAllDocumentsClose(context, origin, documents, observer) {
  for (const document of documents) await document.close();
  await waitForNaturalActivation(observer);
  const reopened = await context.newPage();
  await reopened.goto(origin + '/app/notes');
  await expect(reopened.locator('html')).toHaveAttribute('data-entry-build', 'B');
  await expect.poll(() => workerVersion(reopened)).toBe('browser-test-B');
  return reopened;
}

test('updates preserve every open document while new documents get the new UI', async ({ page, context, updateServer }) => {
  await page.goto(updateServer.origin + '/app/notes');
  await expect.poll(() => workerVersion(page)).toBe('browser-test-A');
  const second = await context.newPage();
  await second.goto(updateServer.origin + '/app/pdf');
  await expect.poll(() => workerVersion(second)).toBe('browser-test-A');
  await prepareVisitedShell(second);
  const documents = [page, second];
  const identities = await Promise.all(documents.map(tab => tab.evaluate(() => window.documentIdentity)));
  const changes = await Promise.all(documents.map(tab => tab.evaluate(() => window.controllerChanges)));
  await page.getByLabel('Study draft').fill('คำตอบที่ยังทำไม่เสร็จ');
  await second.getByLabel('Study draft').fill('สรุปจากเอกสารอีกแท็บ');

  updateServer.deploy('B'); await triggerUpdateCheck(page); await waitForInstalledUpdate(page);
  for (let index = 0; index < documents.length; index++) {
    const tab = documents[index];
    const defaultPrevented = await tab.evaluate(() => {
      const preload = new Event('vite:preloadError', { cancelable: true }); window.dispatchEvent(preload);
      Object.defineProperty(document, 'visibilityState', { configurable: true, value: 'hidden' });
      document.dispatchEvent(new Event('visibilitychange')); delete document.visibilityState;
      window.dispatchEvent(new PageTransitionEvent('pagehide', { persisted: true }));
      history.pushState({ vmxView: 'library' }, '', '/app/library');
      window.dispatchEvent(new PopStateEvent('popstate', { state: history.state }));
      window.dispatchEvent(new Event('vmx-sw-apply-update'));
      return preload.defaultPrevented;
    });
    expect(defaultPrevented).toBe(false);
    await expect.poll(() => workerVersion(tab)).toBe('browser-test-A');
    expect(await tab.evaluate(() => window.controllerChanges)).toBe(changes[index]);
    expect(await tab.evaluate(() => window.documentIdentity)).toBe(identities[index]);
    await expect(tab.locator('body')).toHaveAttribute('data-build', 'A');
  }
  await expect(page.getByLabel('Study draft')).toHaveValue('คำตอบที่ยังทำไม่เสร็จ');
  await expect(second.getByLabel('Study draft')).toHaveValue('สรุปจากเอกสารอีกแท็บ');

  // B is installed but has never loaded a document. Offline keeps the visited A shell.
  updateServer.disconnect();
  try {
    const offline = await context.newPage();
    await offline.goto(updateServer.origin + '/app/unvisited-offline-route', { waitUntil: 'domcontentloaded' });
    await expect(offline.locator('body')).toHaveAttribute('data-build', 'A');
    await expect(offline.locator('html')).toHaveAttribute('data-entry-build', 'A');
    await expect.poll(() => workerVersion(offline)).toBe('browser-test-A');
    expect(updateServer.failedRequests()).toBeGreaterThan(0);
    await offline.close();
  } finally { updateServer.reconnect(); }

  const modern = await context.newPage(); await modern.goto(updateServer.origin + '/app/pdf');
  await expect(modern.locator('body')).toHaveAttribute('data-build', 'B');
  await expect(modern.locator('html')).toHaveAttribute('data-entry-build', 'B');
  await expect.poll(() => workerVersion(modern)).toBe('browser-test-A');
  await modern.getByLabel('Study draft').fill('งานในหน้ารุ่นใหม่');
  const modernIdentity = await modern.evaluate(() => window.documentIdentity);
  await page.close(); await second.close();
  await expect.poll(() => workerVersion(modern)).toBe('browser-test-A');
  expect(await modern.evaluate(() => window.documentIdentity)).toBe(modernIdentity);
  await expect(modern.getByLabel('Study draft')).toHaveValue('งานในหน้ารุ่นใหม่');
  await reopenAfterAllDocumentsClose(context, updateServer.origin, [modern], updateServer.observer);
});

test('failed B precaching still opens the cached A shell offline after natural activation', async ({ page, context, updateServer }) => {
  await page.goto(updateServer.origin + '/app/notes');
  await expect.poll(() => workerVersion(page)).toBe('browser-test-A');
  await prepareVisitedShell(page);
  await page.getByLabel('Study draft').fill('งานเดิมยังอยู่');
  const identity = await page.evaluate(() => window.documentIdentity);
  updateServer.deploy('B', { failShell: true });
  await triggerUpdateCheck(page); await waitForInstalledUpdate(page);
  await expect.poll(() => workerVersion(page)).toBe('browser-test-A');
  expect(await page.evaluate(() => window.documentIdentity)).toBe(identity);
  await expect(page.getByLabel('Study draft')).toHaveValue('งานเดิมยังอยู่');

  await page.close(); await waitForNaturalActivation(updateServer.observer); updateServer.disconnect();
  try {
    const offline = await context.newPage();
    await offline.goto(updateServer.origin + '/app/offline-reader');
    await expect(offline.locator('body')).toHaveAttribute('data-build', 'A');
    await expect(offline.locator('html')).toHaveAttribute('data-entry-build', 'A');
    await expect(offline.getByLabel('Study draft')).toBeVisible();
    await expect.poll(() => workerVersion(offline)).toBe('browser-test-B');
    expect(updateServer.failedRequests()).toBeGreaterThan(0);
  } finally { updateServer.reconnect(); }
});

for (const legacyTrigger of ['hidden tab', 'navigation', 'repeated update signals']) {
  test('armed production legacy and modern documents survive ' + legacyTrigger + ' until every window closes', async ({ page, context, updateServer }) => {
    updateServer.useLegacyFirstDocument();
    await page.goto(updateServer.origin + '/app/notes');
    await expect.poll(() => workerVersion(page)).toBe('browser-test-A');
    await page.getByLabel('Study draft').fill('งานจากรุ่นเดิมต้องไม่หาย');
    const legacyIdentity = await page.evaluate(() => window.documentIdentity);
    updateServer.deploy('B'); await triggerUpdateCheck(page); await waitForInstalledUpdate(page);
    await expect.poll(() => page.evaluate(() => window.legacyPendingReason)).toBe('service-worker');
    await page.evaluate(trigger => {
      if (trigger === 'hidden tab') {
        Object.defineProperty(document, 'visibilityState', { configurable: true, value: 'hidden' });
        document.dispatchEvent(new Event('visibilitychange')); delete document.visibilityState;
      } else window.legacyNavigate('library');
      if (trigger === 'repeated update signals') {
        window.dispatchEvent(new Event('vmx-sw-apply-update'));
        window.dispatchEvent(new PageTransitionEvent('pagehide', { persisted: true }));
      }
    }, legacyTrigger);
    expect(await page.evaluate(() => window.legacyApplyCount)).toBe(1);

    const modern = await context.newPage(); await modern.goto(updateServer.origin + '/app/pdf');
    await expect(modern.locator('html')).toHaveAttribute('data-entry-build', 'B');
    await modern.getByLabel('Study draft').fill('งานในแท็บรุ่นใหม่');
    const modernIdentity = await modern.evaluate(() => window.documentIdentity);
    await expect.poll(() => workerVersion(page)).toBe('browser-test-A');
    await expect.poll(() => workerVersion(modern)).toBe('browser-test-A');
    expect(await page.evaluate(() => window.documentIdentity)).toBe(legacyIdentity);
    await expect(page.getByLabel('Study draft')).toHaveValue('งานจากรุ่นเดิมต้องไม่หาย');
    await page.close();
    await modern.evaluate(() => {
      Object.defineProperty(document, 'visibilityState', { configurable: true, value: 'visible' });
      document.dispatchEvent(new Event('visibilitychange')); delete document.visibilityState;
      window.dispatchEvent(new Event('vmx-sw-apply-update'));
    });
    await expect.poll(() => workerVersion(modern)).toBe('browser-test-A');
    expect(await modern.evaluate(() => window.documentIdentity)).toBe(modernIdentity);
    await expect(modern.getByLabel('Study draft')).toHaveValue('งานในแท็บรุ่นใหม่');
    await reopenAfterAllDocumentsClose(context, updateServer.origin, [modern], updateServer.observer);
  });
}
