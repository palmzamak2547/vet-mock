// A module that loads when a page first needs it, and can be asked for again.
//
// The catalog and the document library are generated modules, fetched with import() the first
// time a page wants them. On a phone the connection drops halfway, the import fails, and the page
// shows its error with a button. For that button to do anything two things must hold:
//
//   1. A failure is never remembered. The next call starts a new attempt (a cached rejected
//      promise is a button that answers with the old error forever).
//   2. The new attempt can succeed. Chromium keeps a failed import() failed for the life of the
//      page: the same address fails again after the network is back, without a request, until a
//      reload (checked on this build in Chromium 148 and 152). WebKit fetches the original address
//      again by itself, as VetMock's own bank loader found (src/data/questions.js importBank), so
//      it never needs the fallback. The same address under a fresh query is a new module and a
//      new fetch, so after a failure the module is asked for again as /assets/name-HASH.js?retry=N,
//      the address Chromium's and Firefox's error message names.
//
// The second only works for a chunk that stands alone and exports what the page picks, which is
// what a generated data module is (tests/unit/lazy-module.test.mjs holds the source side of it);
// anything else keeps the first error rather than resolving to nothing.

const ADDRESS = /https?:\/\/[^\s'"]+?\.js/;

/** The failed chunk's address under a fresh query, or null when the error does not name one of ours. */
function freshAddress(err, origin, serial) {
  const named = ADDRESS.exec(String(err?.message || ''))?.[0];
  if (!named) return null;
  let url;
  try { url = new URL(named); } catch { return null; }
  // Our own hashed chunks only: never an address a message happened to contain.
  if (!origin || url.origin !== origin || !url.pathname.startsWith('/assets/')) return null;
  url.searchParams.set('retry', String(serial));
  return url.href;
}

/**
 * @template T
 * @param {() => Promise<any>} load the page's own `() => import('../generated/x.js')`
 * @param {(mod: any) => T} pick what the page wants out of the module; null or undefined means the module is not the one asked for
 * @param {{ importer?: (href: string) => Promise<any>, origin?: string|null }} [options] for tests
 * @returns {() => Promise<T>} a function that returns the value, loading it on the first call
 */
export function lazyModule(load, pick, {
  importer = (href) => import(/* @vite-ignore */ href),
  origin = typeof location === 'undefined' ? null : location.origin,
} = {}) {
  let value;
  let loaded = false;
  let pending = null;
  let retries = 0;

  const unwrap = (mod) => {
    const picked = pick(mod);
    if (picked === undefined || picked === null) throw new Error('the module does not export what the page asked for');
    return picked;
  };

  const attempt = () => Promise.resolve().then(load).then(unwrap).catch((err) => {
    const href = freshAddress(err, origin, retries + 1);
    if (!href) throw err;
    retries += 1;
    return importer(href).then((mod) => {
      try { return unwrap(mod); } catch { throw err; }
    });
  });

  return function get() {
    if (loaded) return Promise.resolve(value);
    if (pending) return pending;
    pending = attempt().then(
      (picked) => { value = picked; loaded = true; pending = null; return picked; },
      (err) => { pending = null; throw err; },
    );
    return pending;
  };
}
