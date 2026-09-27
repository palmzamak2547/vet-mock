// Every method in the catalogue with its status, milestone, the fixture families it passes and the files and sources behind them, from catalog.js, verified.generated.js and fixtures.generated.js; nothing typed by hand [M2-DESIGN.md 11.1].
// OWNER: trust role. STUB(m2): renders the placeholder until its owner builds the page.
import { useEffect } from 'react';
import { useT } from '../i18n/index.js';

export default function Page() {
  const { t } = useT();
  useEffect(() => { document.title = `${t('trust.page.methods.title')} | ${t('common.appName')}`; }, [t]);
  return (
    <main id="rs-main" className="rs-main rs-main--narrow">
      <h1 className="rs-h1" tabIndex={-1}>{t('trust.page.methods.title')}</h1>
      <p>{t('common.notBuilt')}</p>
    </main>
  );
}
