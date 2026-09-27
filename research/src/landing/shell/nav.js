// Links from the landing into the workspace go through the router (no page load), so the workspace
// chunk and the entrance start at once. Modified clicks (new tab, new window) keep the browser's
// default. OWNER: landing role.
import { navigate } from '../../router.js';

/** @param {string} path @returns {(e: MouseEvent) => void} */
export function appLink(path) {
  return (e) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    navigate(path);
    window.scrollTo(0, 0);
  };
}
