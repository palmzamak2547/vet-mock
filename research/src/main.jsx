// Boot [M1-DESIGN.md 2]. Sets the theme before the first render (no inline script: the CSP is
// script-src 'self'), mounts the app, then registers the service worker after the first paint on a Studio route.
// OWNER: runtime role.
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/base.css';
import { App } from './App.jsx';
import { readPrefs, writePrefs } from './lib/store/prefs.js';
import { takeCrossing } from '@vetmock/lib/family/family.js';
import { registerWhenInStudio } from './lib/runtime/sw-register.js';

function applyTheme() {
  const { theme, lang } = readPrefs();
  const dark = theme === 'dark' || (theme === 'system' && window.matchMedia?.('(prefers-color-scheme: dark)').matches);
  document.documentElement.dataset.theme = dark ? 'dark' : 'light';
  document.documentElement.lang = lang;
}

// Arriving from another VetMock site: the theme and language the student was looking at there
// (?vmt, ?vml) become this site's own, once, and leave the address (src/lib/family).
{
  const { theme, lang } = takeCrossing();
  if (theme || lang) writePrefs({ ...(theme ? { theme } : {}), ...(lang ? { lang } : {}) });
}

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
