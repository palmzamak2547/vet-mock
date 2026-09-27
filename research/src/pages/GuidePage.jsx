// A short user guide in plain Thai and English: from a raw file to a report, what each guardrail means, and the example datasets [M2-DESIGN.md 11.3].
// OWNER: trust role. STUB(m2): renders the placeholder until its owner builds the page.
import { useEffect } from 'react';
import { useT } from '../i18n/index.js';

export default function Page() {
  const { t } = useT();
  useEffect(() => { document.title = `${t('trust.page.guide.title')} | ${t('common.appName')}`; }, [t]);
  return (
    <main id="rs-main" className="rs-main rs-main--narrow">
      <h1 className="rs-h1" tabIndex={-1}>{t('trust.page.guide.title')}</h1>
      <p>{t('common.notBuilt')}</p>
    </main>
  );
}
