// A lazy screen whose code or stylesheet could not be downloaded (offline, or a
// release replaced the files). Engines word it differently; Vite throws its own
// "Unable to preload CSS" when only the stylesheet failed.
export function isChunkLoadError(error) {
  const msg = error?.message || (error ? String(error) : '');
  return /dynamically imported module|module script|loading chunk|ChunkLoadError|Importing a module script failed|Unable to preload CSS/i.test(msg);
}

// Chromium keeps a failed dynamic import failed for the life of the page:
// importing the same URL again rejects without a request, so a retry once the
// connection is back fails until a reload. Its error names the URL (Firefox's
// too), and that URL under a fresh query is a new module and a new fetch.
// WebKit's error names no URL, so there is nothing to fetch afresh. On the
// dev server it fetched the original again by itself; from a production build
// Playwright's WebKit fetched a chunk that once failed no more, on a retry or
// after a reload (29 Oct).
// questions.js importBank does the same for question banks.
let retrySerial = 0;

/**
 * `load()` (a lazy `import()`), and when it fails to download, the module it
 * named once more under a fresh `?retry=N`. Anything else, or a URL from
 * another origin, rejects with the first error.
 */
export function importFresh(load, {
  importer = (href) => import(/* @vite-ignore */ href),
  origin = typeof location === 'undefined' ? null : location.origin,
} = {}) {
  return load().catch((err) => {
    if (!isChunkLoadError(err)) throw err;
    const found = /https?:\/\/[^\s'"]+?\.(?:m?js|jsx)(?=[?#\s'"]|$)/.exec(String(err?.message || ''))?.[0];
    let url = null;
    try { url = found ? new URL(found) : null; } catch { url = null; }
    if (!url || url.origin !== origin) throw err;
    url.searchParams.set('retry', String(++retrySerial));
    return importer(url.href).catch(() => { throw err; });
  });
}
