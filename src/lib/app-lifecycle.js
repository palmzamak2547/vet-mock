// An update never replaces a running document. A lazy import may fail
// offline or because an old hash is no longer served. Preserve the rejection
// so the importing view can offer its existing explicit retry; preventing the
// Vite event would turn a rejected import into an undefined module instead.
import { publishUpdateStatus } from './update-safety.js'

window.addEventListener('vite:preloadError', () => {
  if (navigator.onLine === false) return
  publishUpdateStatus(window, 'preload-error')
})

// ── Reclaim storage the app has stopped needing ───────────────────
// Existing installs already carry months of dead keys — a daily-question
// record and a pulse flag per calendar day, expired playlist caches, back-off
// markers whose moment passed. Nothing removed them, so localStorage filled
// and every save started failing with "พื้นที่จัดเก็บในเครื่องไม่พอ". Sweeping
// on boot is what clears the backlog for someone already stuck; the write
// paths keep it from building up again. Runs when the browser is idle so it
// never competes with first paint, and it never touches a student's own work.
window.addEventListener('load', () => {
  const sweep = () => {
    Promise.all([import('./storage-gc.js'), import('./daily-q.js'), import('./user-data-sync.js')])
      .then(([gc, daily, sync]) => {
        const freed = gc.sweepStaleKeys(window.localStorage, { today: daily.todayKey() });
        // Outbox records from tabs that were closed or crashed are the other
        // family that accumulates, and nothing swept them until a write
        // failed. An older record is not always a copy of the snapshot:
        // another open window writes its snapshot a few seconds after its
        // last edit. The sync module folds each record into its account's
        // snapshot before the record goes.
        const dropped = sync.sweepOutbox(window.localStorage);
        freed.removed.push(...dropped.removed);
        freed.bytes += dropped.bytes;
        if (freed.removed.length) {
          console.info(`[storage] reclaimed ${freed.removed.length} dead key(s), ${(freed.bytes / 1024).toFixed(0)} KB`);
        }
      })
      .catch(() => { /* a sweep that cannot run must never break the app */ });
  };
  if (typeof requestIdleCallback === 'function') requestIdleCallback(sweep, { timeout: 8000 });
  else setTimeout(sweep, 4000);
});

// ── Service worker — true offline + asset caching ─────────────────
// Registered after window.load to avoid contending with first paint.
// Updates install automatically. The browser activates the waiting worker
// after all documents using the old worker close; existing tabs keep their
// current document and controller. Online new documents already get the latest
// build through network-first navigation, without an update button.
//
// In dev mode we deliberately UNREGISTER any prior SW so HMR works;
// the SW is production-only.
// Waiting status is informational. Never request an early worker takeover: an
// older document may have armed its own controllerchange reload handler.
const announceWaitingWorker = (worker) => {
  if (!worker || !navigator.serviceWorker.controller || worker.state === 'redundant') return
  publishUpdateStatus(window, 'service-worker')
}

window.addEventListener('pagehide', (event) => {
  // BFCache keeps this document alive. A real departure gives the worker a
  // chance to trim old assets after the last window closes, never mid-study.
  if (event.persisted) return
  try { navigator.serviceWorker?.controller?.postMessage('TRIM_ASSETS_IF_UNUSED') }
  catch { /* Closing a page must never depend on optional cache cleanup. */ }
})

window.addEventListener('load', () => {
  if (!('serviceWorker' in navigator)) return
  if (import.meta.env?.MODE !== 'production') {
    // Dev mode — clear any stale SW so HMR flows freely
    navigator.serviceWorker.getRegistrations()
      .then((regs) => regs.forEach((r) => r.unregister()))
      .catch(() => {})
    return
  }
  navigator.serviceWorker.register('/sw.js').then((reg) => {
    // A worker may already be waiting when this tab opens.
    announceWaitingWorker(reg.waiting)

    // A tab left open for days never asked for a new worker again, so the
    // update it eventually got was already several releases stale. Check
    // hourly and whenever the tab comes back into view.
    // Visibility and hourly events can overlap; share one discovery request.
    let updateCheck = null
    const check = () => {
      if (updateCheck) return updateCheck
      updateCheck = reg.update().catch(() => {})
        .then(() => announceWaitingWorker(reg.waiting))
        .finally(() => { updateCheck = null })
      return updateCheck
    }
    setInterval(check, 60 * 60 * 1000)
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') check()
    })

    // When a new worker is installed *after* one was already controlling
    // this page, prepare it for the next document.
    reg.addEventListener('updatefound', () => {
      const nw = reg.installing
      if (!nw) return
      nw.addEventListener('statechange', () => {
        if (nw.state === 'installed' && navigator.serviceWorker.controller) {
          announceWaitingWorker(reg.waiting || nw)
        }
      })
    })
  }).catch((err) => {
    console.warn('[sw] registration failed:', err)
  })
})
