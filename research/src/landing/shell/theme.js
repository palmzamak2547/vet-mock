// Theme switch shared by the landing header and (if the workspace wants it) the workspace top bar.
// The effective theme is data-theme on <html> (main.jsx sets it before the first render from
// prefs.theme, default the system setting); the switch stores an explicit choice per device through
// prefs.js, the only module that touches localStorage. OWNER: landing role.
import { useEffect, useState } from 'react';
import { writePrefs } from '../../lib/store/prefs.js';

/** @returns {'light'|'dark'} */
export function currentTheme() {
  return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
}

/** @param {'light'|'dark'} theme */
export function setTheme(theme) {
  writePrefs({ theme });
  document.documentElement.dataset.theme = theme;
}

/**
 * The effective theme, updated when anything changes data-theme on <html> (this switch, the system
 * setting through main.jsx, another component).
 * @returns {'light'|'dark'}
 */
export function useTheme() {
  const [theme, set] = useState(currentTheme);
  useEffect(() => {
    const mo = new MutationObserver(() => set(currentTheme()));
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => mo.disconnect();
  }, []);
  return theme;
}

/** @returns {boolean} prefers-reduced-motion: reduce, kept current */
const REDUCE_QUERY = '(prefers-reduced-motion: reduce)';
const reduceQuery = () => (typeof window !== 'undefined' && window.matchMedia ? window.matchMedia(REDUCE_QUERY) : null);

export function useReducedMotion() {
  const [reduce, set] = useState(() => Boolean(reduceQuery()?.matches));
  useEffect(() => {
    const q = reduceQuery();
    if (!q) return undefined;
    const on = () => set(q.matches);
    on();
    q.addEventListener?.('change', on);
    return () => q.removeEventListener?.('change', on);
  }, []);
  return reduce;
}
