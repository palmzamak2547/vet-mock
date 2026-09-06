// A direct Atlas link should not boot exam banks, account sync or the Home view.
// The same AtlasView is also lazy-loaded inside the main VetMock app.
import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import AtlasView from './views/AtlasView.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import { useLocalStorage } from './hooks/useStorage.js';
import { startWebVitals } from './lib/web-vitals.js';
import './lib/dom-compat.js';
import './lib/app-lifecycle.js';
import './styles.css';

function AtlasShell() {
  const [theme, setTheme] = useLocalStorage(
    'vmx-theme',
    document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light',
  );
  const [update, setUpdate] = useState(false);
  useEffect(() => {
    document.documentElement.dataset.theme = theme === 'dark' ? 'dark' : 'light';
    document.documentElement.style.colorScheme = theme === 'dark' ? 'dark' : 'light';
    document.documentElement.style.background = 'var(--clr-bg)';
  }, [theme]);
  useEffect(() => {
    const announce = (event) => {
      if (event.detail?.state === 'ready') setUpdate(true);
    };
    window.addEventListener('vmx-sw-update', announce);
    if (window.__VMX_UPDATE_STATUS__?.state === 'ready') setUpdate(true);
    return () => window.removeEventListener('vmx-sw-update', announce);
  }, []);
  const goHome = () => window.location.assign('/');
  return (
    <div className="vmx-app is-focus">
      <a href="#main" className="vmx-skip-link">
        ข้ามไปเนื้อหาหลัก
      </a>
      <main id="main" className="vmx-main vmx-main--wide" tabIndex={-1}>
        {update && (
          <div className="vmx-atlas-notice" role="status">
            <span>มี Atlas เวอร์ชันใหม่พร้อมแล้ว</span>
            <button type="button" onClick={() => window.dispatchEvent(new Event('vmx-sw-apply-update'))}>
              อัปเดตตอนนี้
            </button>
          </div>
        )}
        <ErrorBoundary onReset={goHome}>
          <AtlasView
            goHome={goHome}
            theme={theme}
            onToggleTheme={() => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))}
          />
        </ErrorBoundary>
      </main>
    </div>
  );
}

startWebVitals();
createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AtlasShell />
  </React.StrictMode>,
);
