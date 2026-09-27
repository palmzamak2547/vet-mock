// Boot [M1-DESIGN.md 2]. Sets the theme before the first render (no inline script: the CSP is
// script-src 'self'), mounts the app, then registers the service worker after the first paint.
// OWNER: runtime role.
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/base.css';
import { App } from './App.jsx';
import { readPrefs } from './lib/store/prefs.js';
import { registerServiceWorker } from './lib/runtime/sw-register.js';

function applyTheme() {
  const { theme, lang } = readPrefs();
  const dark = theme === 'dark' || (theme === 'system' && window.matchMedia?.('(prefers-color-scheme: dark)').matches);
  document.documentElement.dataset.theme = dark ? 'dark' : 'light';
  document.documentElement.lang = lang;
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
    registerServiceWorker();
  }, 0);
});
