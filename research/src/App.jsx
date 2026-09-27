// Route shell [M1-DESIGN.md 2]. The landing and the workspace are separate lazy chunks, so the front
// door never downloads the grid, the engine client or the sign-in client, and the workspace never
// downloads the WebGL herd. OWNER: workspace role.
import { Suspense, lazy } from 'react';
import { I18nProvider, useT } from './i18n/index.js';
import { useRoute } from './router.js';

const Landing = lazy(() => import('./landing/Landing.jsx'));
const Workspace = lazy(() => import('./workspace/Workspace.jsx'));

function Boot() {
  const { t } = useT();
  return (
    <div className="rs-boot" role="status">
      {t('common.loading')}
    </div>
  );
}

function Routes() {
  const route = useRoute();
  return (
    <Suspense fallback={<Boot />}>
      {route.name === 'landing' ? <Landing /> : <Workspace route={route} />}
    </Suspense>
  );
}

export function App() {
  return (
    <I18nProvider>
      <Routes />
    </I18nProvider>
  );
}
