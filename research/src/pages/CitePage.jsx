// How to cite VetMock Research: the line for this release (version, year, URL, access date, and the DOI once one is minted, never an invented one), with RIS and BibTeX downloads built on the device [M2-DESIGN.md 11.2].
// OWNER: trust role. STUB(m2): renders the placeholder until its owner builds the page.
import { useEffect } from 'react';
import { useT } from '../i18n/index.js';

export default function Page() {
  const { t } = useT();
  useEffect(() => { document.title = `${t('trust.page.cite.title')} | ${t('common.appName')}`; }, [t]);
  return (
    <main id="rs-main" className="rs-main rs-main--narrow">
      <h1 className="rs-h1" tabIndex={-1}>{t('trust.page.cite.title')}</h1>
      <p>{t('common.notBuilt')}</p>
    </main>
  );
}
