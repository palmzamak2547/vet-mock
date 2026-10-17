// Path routes for vca.vetmock.com. History API, no router dependency; vercel.json sends every
// page path to index.html, and scripts/prerender.mjs writes each public page its own head.
// A change of page runs inside a view transition where the browser has them (lib/motion.js);
// a change of query (a filter, a search) updates in place.

import { useEffect, useState } from 'react';
import { pageTransition } from './lib/motion.js';

export const PAGES = {
  '/': 'home',
  '/practice': 'practice',
  '/session': 'session',
  '/bank': 'bank',
  '/library': 'library',
  '/progress': 'progress',
  '/exam': 'exam',
  '/about': 'about',
  // The community (online/): open to read, signed in to join.
  '/community': 'community',
  '/community/new': 'compose',
  '/chat': 'chat',
  '/me': 'profile',
};

/** @returns {{ name: string, params: Record<string,string>, query: URLSearchParams }} */
export function parseRoute(pathname, search = '') {
  const path = pathname.replace(/\/+$/, '') || '/';
  const query = new URLSearchParams(search);
  if (PAGES[path]) return { name: PAGES[path], params: {}, query };
  let m = /^\/d\/([a-z-]{2,40})$/.exec(path);
  if (m) return { name: 'domain', params: { id: m[1] }, query };
  m = /^\/result\/([a-z0-9-]{4,40})$/.exec(path);
  if (m) return { name: 'result', params: { id: m[1] }, query };
  m = /^\/community\/p\/([0-9a-f-]{8,40})(\/edit)?$/.exec(path);
  if (m) return { name: m[2] ? 'compose' : 'post', params: { id: m[1] }, query };
  m = /^\/chat\/([a-z0-9-]{2,48})$/.exec(path);
  if (m) return { name: 'chat', params: { room: m[1] }, query };
  m = /^\/u\/([a-z0-9_]{3,20})$/.exec(path);
  if (m) return { name: 'profile', params: { handle: m[1] }, query };
  m = /^\/auth\/(callback|line)$/.exec(path);
  if (m) return { name: 'auth', params: { via: m[1] }, query };
  return { name: 'notFound', params: {}, query };
}

const EVENT = 'vca:navigate';

export function navigate(to, { replace = false } = {}) {
  if (to === window.location.pathname + window.location.search) return;
  const samePage = new URL(to, window.location.href).pathname === window.location.pathname;
  const update = () => {
    if (replace) window.history.replaceState({}, '', to);
    else window.history.pushState({}, '', to);
    window.dispatchEvent(new Event(EVENT));
  };
  if (samePage || replace) update();
  else pageTransition(update);
}

export function useRoute() {
  const read = () => parseRoute(window.location.pathname, window.location.search);
  const [route, setRoute] = useState(read);
  useEffect(() => {
    const update = () => setRoute(read());
    window.addEventListener('popstate', update);
    window.addEventListener(EVENT, update);
    return () => {
      window.removeEventListener('popstate', update);
      window.removeEventListener(EVENT, update);
    };
  }, []);
  return route;
}

/** Click handler for in-app links: plain clicks route in place, modified clicks open as usual. */
export function onLinkClick(event, to) {
  if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  event.preventDefault();
  navigate(to);
}

export function withQuery(path, params) {
  const q = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === null || v === '' || (Array.isArray(v) && !v.length)) continue;
    q.set(k, Array.isArray(v) ? v.join(',') : String(v));
  }
  const s = q.toString();
  return s ? `${path}?${s}` : path;
}
