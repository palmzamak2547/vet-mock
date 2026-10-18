// Boot: the theme was painted by public/theme-boot.js; keep it following the pick and the
// device from here on, keep the browser's install prompt for when it is asked for, then mount.
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/tokens.css';
import './styles/base.css';
import './styles/components.css';
import './styles/pages.css';
import './styles/motion.css';
import { App } from './App.jsx';
import { watchTheme } from './lib/prefs.js';
import { watchInstall } from './lib/install.js';
import { initScroll } from './lib/scroll.js';

watchTheme();
watchInstall();
// Back, Forward and a reload put a page back where the reader was (lib/scroll.js). Before the first
// render, so its listener for history moves comes ahead of the router's own.
initScroll();

// Offline practice and installability, in the built site only (a dev server's modules change).
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => { navigator.serviceWorker.register('/sw.js').catch(() => {}); });
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
