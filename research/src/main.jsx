// Boot [M1-DESIGN.md 2]. Sets the theme before the first render (no inline script: the CSP is
// script-src 'self'), mounts the app, then registers the service worker after the first paint on a Studio route.
// OWNER: runtime role.
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/base.css';
import { App } from './App.jsx';
import { readPrefs } from './lib/store/prefs.js';
import { CHOSEN_ATTR, keepVisit, takeCrossing, visitPrefs } from '../../src/lib/family/family.js';
import { registerWhenInStudio } from './lib/runtime/sw-register.js';

function applyTheme() {
  const prefs = readPrefs();
  const visit = visitPrefs();
  const theme = visit.theme || prefs.theme;
  const lang = visit.lang || prefs.lang;
  const dark = theme === 'dark' || (theme === 'system' && window.matchMedia?.('(prefers-color-scheme: dark)').matches);
  document.documentElement.dataset.theme = dark ? 'dark' : 'light';
  document.documentElement.lang = lang;
  // Only a theme the student chose (or arrived with) travels to another VetMock site.
  if (theme === 'light' || theme === 'dark') document.documentElement.setAttribute(CHOSEN_ATTR, theme);
  else document.documentElement.removeAttribute(CHOSEN_ATTR);
}

// Arriving from another VetMock site: the theme and language the student was looking at there
// (?vmt, ?vml) apply to this visit only, never over the saved choice, and leave the address
// (src/lib/family). A pick made here replaces them.
keepVisit(takeCrossing());

applyTheme();
window.matchMedia?.('(prefers-color-scheme: dark)').addEventListener?.('change', applyTheme);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

window.requestAnimationFrame(() => {
  window.setTimeout(() => {
    registerWhenInStudio();
  }, 0);
});
