// Links from the landing into the workspace go through the router (no page load), so the workspace
// chunk and the entrance start at once. Modified clicks (new tab, new window) keep the browser's
// default. A link into the workspace also starts downloading the workspace code when it is pressed or
// focused (preloadWorkspace, M1 round 3 carried item 6), so the entrance does not wait on a "loading"
// beat; nothing is downloaded on page load. OWNER: landing role (trust in M2).
import { navigate } from '../../router.js';
import { preloadWorkspace } from '../../preload.js';

/** @param {string} path @returns {(e: MouseEvent) => void} */
export function appLink(path) {
  return (e) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    navigate(path);
    window.scrollTo(0, 0);
  };
}

/** Paths the workspace root serves (everything except the landing and the public pages). */
export function servedByWorkspace(path) {
  return path === '/app' || path.startsWith('/app/') || path === '/licenses';
}

/**
 * Props for an <a> into the app: href, the router click, and the preload on press and focus when the
 * path belongs to the workspace.
 * @param {string} path
 * @param {(e: MouseEvent) => void} [before] runs first on click (e.g. closing the phone menu)
 */
export function appLinkProps(path, before) {
  const go = appLink(path);
  const props = { href: path, onClick: before ? (e) => { before(e); go(e); } : go };
  return servedByWorkspace(path) ? { ...props, onPointerDown: preloadWorkspace, onFocus: preloadWorkspace } : props;
}
