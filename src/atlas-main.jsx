// A direct Atlas link should not boot exam banks, account sync or the Home view.
// The same AtlasView is also lazy-loaded inside the main VetMock app.
import React, { useEffect } from 'react';
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
  useEffect(() => {
    document.documentElement.dataset.theme = theme === 'dark' ? 'dark' : 'light';
    document.documentElement.style.colorScheme = theme === 'dark' ? 'dark' : 'light';
    document.documentElement.style.background = 'var(--clr-bg)';
  }, [theme]);
  const goHome = () => window.location.assign('/');
  return (
    <div className="vmx-app is-focus">
      <a href="#main" className="vmx-skip-link">
        ข้ามไปเนื้อหาหลัก
      </a>
      <main id="main" className="vmx-main vmx-main--wide" tabIndex={-1}>
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
