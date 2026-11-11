// Where a student was going when a sign-in sent them away to Google, so they arrive there when
// it brings them back. Used by vetmock.com, vca/ and ai/ for the redirect fallback only (Google's
// own button signs in on the page and never leaves it).
//
// The value is kept in sessionStorage (this tab only, never in an address, a cookie or a log) and
// is trusted only as a relative path on this origin: anything that could leave the origin is
// refused, whoever wrote it.
//
// No imports: every site's boot path may load this file.

const MAX = 2048;
const MAX_AGE_MS = 15 * 60 * 1000;
// Unreserved, sub-delims, ':' and '%' for escapes, '/' '?' '#'. No '@' (credentials), no '\',
// no whitespace or control characters, nothing above ASCII (the browser escapes those itself).
const ALLOWED = /^\/[A-Za-z0-9\-._~!$&'()*+,;=:%/?#]*$/;
const BASE = 'https://return.invalid';

function decodedOnce(s) {
  try { return decodeURIComponent(s); } catch { return null; }
}

/**
 * A safe same-origin path ("/x?y#z"), or null. Never a full URL: a value must start with one
 * "/" and stay on the origin when resolved, also after its escapes are decoded once (a router may
 * decode before it navigates).
 * @param {unknown} value
 */
export function safeReturnPath(value) {
  if (typeof value !== 'string' || !value || value.length > MAX) return null;
  if (!ALLOWED.test(value)) return null;
  if (value.startsWith('//')) return null;
  // Decoded, the path must still be an ordinary path: no "//host", no "\", no "@", no space or
  // control character. The query and hash may hold an escaped space (a title search), never a
  // control character.
  const cut = value.search(/[?#]/);
  const decodedPath = decodedOnce(cut < 0 ? value : value.slice(0, cut));
  const decodedAll = decodedOnce(value);
  if (decodedPath == null || decodedAll == null) return null;
  if (!decodedPath.startsWith('/') || decodedPath.startsWith('//') || /[\\@\s\u0000-\u001f\u007f]/.test(decodedPath)) return null;
  if (/[\\\u0000-\u001f\u007f]/.test(decodedAll)) return null;
  let url;
  try { url = new URL(value, BASE); } catch { return null; }
  if (url.origin !== BASE || url.username || url.password) return null;
  return `${url.pathname}${url.search}${url.hash}`;
}

/** The path, query and hash of this page, without what a sign-in itself adds to an address. */
export function currentPath(loc = globalThis.location, drop = []) {
  try {
    const url = new URL(loc.href);
    for (const name of drop) url.searchParams.delete(name);
    return `${url.pathname}${url.search}${url.hash}`;
  } catch { return null; }
}

/** Remember where to come back to (sessionStorage, with the time, so a stale one is ignored). */
export function keepDestination(key, path, { store = globalThis.sessionStorage, now = Date.now() } = {}) {
  const safe = safeReturnPath(path);
  try {
    if (!safe) { store?.removeItem(key); return null; }
    store?.setItem(key, JSON.stringify({ path: safe, at: now }));
  } catch { /* storage blocked: the student lands where the sign-in returns them */ }
  return safe;
}

/** Take the remembered destination once: a safe path no older than 15 minutes, or null. */
export function takeDestination(key, { store = globalThis.sessionStorage, now = Date.now() } = {}) {
  let raw = null;
  try {
    raw = store?.getItem(key) ?? null;
    store?.removeItem(key);
  } catch { return null; }
  if (!raw) return null;
  let v;
  try { v = JSON.parse(raw); } catch { return null; }
  if (!v || typeof v !== 'object' || typeof v.at !== 'number') return null;
  if (now - v.at > MAX_AGE_MS || now < v.at - 60_000) return null;
  return safeReturnPath(v.path);
}

/**
 * For a site whose sign-in returns to the same path and query but not the hash (vetmock.com):
 * the hash to put back, or null. Only when the remembered destination is this very page (the
 * names in `drop` aside, which the sign-in adds or removes) and the address has no hash now.
 * @param {string|null} dest  a path from takeDestination
 * @param {string} href       this page's address
 */
export function hashToRestore(dest, href, drop = []) {
  const safe = safeReturnPath(dest);
  if (!safe) return null;
  let here;
  let want;
  try {
    here = new URL(href);
    want = new URL(safe, here.origin);
  } catch { return null; }
  for (const name of drop) { here.searchParams.delete(name); want.searchParams.delete(name); }
  if (want.pathname !== here.pathname || want.search !== here.search) return null;
  if (!want.hash || (here.hash && here.hash !== '#')) return null;
  return want.hash;
}
