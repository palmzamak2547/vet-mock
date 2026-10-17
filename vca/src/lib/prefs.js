// The theme: follows the device until the student picks one. public/theme-boot.js paints the
// same rule before the first frame; keep the key and values in step with it.

import { useSyncExternalStore } from 'react';
import { createStore } from './storage.js';
import { themeTransition } from './motion.js';

const THEMES = ['system', 'light', 'dark'];

export const prefsStore = createStore('vca:prefs', { theme: 'system' }, (raw) => ({
  theme: THEMES.includes(raw?.theme) ? raw.theme : 'system',
}));

const media = () => (typeof window !== 'undefined' && window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null);

export function effectiveTheme(theme = prefsStore.get().theme) {
  if (theme === 'dark' || theme === 'light') return theme;
  return media()?.matches ? 'dark' : 'light';
}

export function applyTheme() {
  const theme = effectiveTheme();
  document.documentElement.dataset.theme = theme;
  const meta = document.querySelectorAll('meta[name="theme-color"]');
  meta.forEach((m) => m.setAttribute('content', theme === 'dark' ? '#0c0e10' : '#f2f0eb'));
}

export function watchTheme() {
  applyTheme();
  const unsubscribe = prefsStore.subscribe(applyTheme);
  const mq = media();
  mq?.addEventListener?.('change', applyTheme);
  return () => { unsubscribe(); mq?.removeEventListener?.('change', applyTheme); };
}

/**
 * Light ↔ dark from whatever is on screen now; the pick sticks until changed again. Given the
 * point it was asked from, the new theme spreads from there.
 */
export function toggleTheme(x = innerWidth - 60, y = 40) {
  const next = effectiveTheme() === 'dark' ? 'light' : 'dark';
  themeTransition(() => prefsStore.set({ theme: next }), x, y);
}

export function useTheme() {
  const prefs = useSyncExternalStore(prefsStore.subscribe, prefsStore.get, prefsStore.get);
  return { theme: prefs.theme, effective: effectiveTheme(prefs.theme) };
}
