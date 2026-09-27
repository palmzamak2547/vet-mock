// Path routes for research.vetmock.com [M1-DESIGN.md 2]. History API, no router dependency. URLs
// carry only random ids (project and analysis UUIDs), never names or values, so nothing about the
// data appears in a URL, a history entry or a referrer. OWNER: workspace role.
import { useEffect, useState } from 'react';

export const PANES = Object.freeze(['import', 'codebook', 'data', 'design', 'prev', 'assoc', 'table1', 'report']);
const ID = '[A-Za-z0-9-]{1,64}';

/**
 * @typedef {{ name: 'landing' } | { name: 'projects' } | { name: 'project', projectId: string, pane: string|null }
 *   | { name: 'result', projectId: string, analysisId: string } | { name: 'sampleSize' } | { name: 'licenses' } | { name: 'notFound' }} Route
 */

/** @param {string} pathname @returns {Route} */
export function parseRoute(pathname) {
  const path = pathname.replace(/\/+$/, '') || '/';
  if (path === '/') return { name: 'landing' };
  if (path === '/app') return { name: 'projects' };
  if (path === '/app/tools/sample-size') return { name: 'sampleSize' };
  if (path === '/licenses') return { name: 'licenses' };
  let m = new RegExp(`^/app/p/(${ID})/r/(${ID})$`).exec(path);
  if (m) return { name: 'result', projectId: m[1], analysisId: m[2] };
  m = new RegExp(`^/app/p/(${ID})(?:/([a-z0-9]+))?$`).exec(path);
  if (m && (!m[2] || PANES.includes(m[2]))) return { name: 'project', projectId: m[1], pane: m[2] || null };
  return { name: 'notFound' };
}

/** @param {Route} route @returns {string} */
export function routePath(route) {
  switch (route.name) {
    case 'landing': return '/';
    case 'projects': return '/app';
    case 'sampleSize': return '/app/tools/sample-size';
    case 'licenses': return '/licenses';
    case 'project': return `/app/p/${route.projectId}${route.pane ? `/${route.pane}` : ''}`;
    case 'result': return `/app/p/${route.projectId}/r/${route.analysisId}`;
    default: return '/';
  }
}

const EVENT = 'rs:navigate';

/** @param {string} path @param {{ replace?: boolean }} [opts] */
export function navigate(path, opts = {}) {
  if (opts.replace) window.history.replaceState({}, '', path);
  else window.history.pushState({}, '', path);
  window.dispatchEvent(new Event(EVENT));
}

/** @returns {Route} the current route, updated on back/forward and navigate() */
export function useRoute() {
  const [route, setRoute] = useState(() => parseRoute(window.location.pathname));
  useEffect(() => {
    const update = () => setRoute(parseRoute(window.location.pathname));
    window.addEventListener('popstate', update);
    window.addEventListener(EVENT, update);
    return () => {
      window.removeEventListener('popstate', update);
      window.removeEventListener(EVENT, update);
    };
  }, []);
  return route;
}

/**
 * Click handler for an in-app <a href>: plain left clicks navigate without a reload; modified clicks
 * (new tab, new window) keep the browser's own behaviour.
 * @param {string} path
 * @param {{ replace?: boolean }} [opts]
 * @returns {(e: MouseEvent) => void}
 */
export function linkHandler(path, opts = {}) {
  return (e) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    navigate(path, opts);
  };
}
