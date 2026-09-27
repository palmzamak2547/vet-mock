// Public pages outside the workspace: /methods, /cite, /guide [M2-DESIGN.md 11]. A lazy root of its own,
// so the landing never downloads them and they never download the grid or the engine. Registers the
// dictionaries its pages read. OWNER: trust role.
import { Suspense, lazy } from 'react';
import { registerArea, useT } from '../i18n/index.js';
import trust from '../i18n/trust.js';
import runtime from '../i18n/runtime.js';
import '../styles/workspace.css';

registerArea('trust', trust);
registerArea('runtime', runtime);

const PAGES = {
  methods: lazy(() => import('./MethodsPage.jsx')),
  cite: lazy(() => import('./CitePage.jsx')),
  guide: lazy(() => import('./GuidePage.jsx')),
};

/** @param {{ route: import('../router.js').Route }} props */
export default function Public({ route }) {
  const { t } = useT();
  const Page = PAGES[route.name];
  return (
    <Suspense fallback={<div className="rs-boot" role="status">{t('common.loading')}</div>}>
      {Page ? <Page /> : null}
    </Suspense>
  );
}
