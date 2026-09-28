// How to cite VetMock Research: the line for this release (version, year, URL, access date, and the DOI once
// one is minted, never an invented one), with RIS and BibTeX downloads built on the device by the report
// role's export/cite.js, loaded only when a button is pressed [M2-DESIGN.md 11.2]. OWNER: trust role.
import { useEffect, useState } from 'react';
import { useT } from '../i18n/index.js';
import { currentRelease, softwareReference } from '../data/cite.js';
import PublicShell from './PublicShell.jsx';
import { eraYear, formatDate, localIsoDate } from './model.js';
import '../styles/pages.css';

function download(text, fileName, type) {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export default function Page() {
  const { t, lang } = useT();
  const release = currentRelease();
  const [accessed] = useState(() => localIsoDate());
  const [copyState, setCopyState] = useState(/** @type {'idle'|'copied'|'failed'} */ ('idle'));
  const [fileFailed, setFileFailed] = useState(false);
  useEffect(() => { document.title = `${t('trust.page.cite.title')} | ${t('common.appName')}`; }, [t]);
  useEffect(() => { window.scrollTo(0, 0); }, []);

  const appName = t('common.appName');
  const line = release
    ? t('trust.cite.text', {
      author: release.authors.length ? release.authors.join(', ') : appName,
      year: eraYear(release.year, lang),
      title: appName,
      version: release.version,
      url: release.doi ? `https://doi.org/${release.doi}` : release.url,
      accessed: formatDate(accessed, lang),
    })
    : '';

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(line);
      setCopyState('copied');
    } catch {
      setCopyState('failed');
    }
  };

  const file = async (format) => {
    setFileFailed(false);
    try {
      const m = await import('../lib/export/cite.js');
      const ref = softwareReference(release, accessed, appName);
      if (format === 'ris') download(m.toRis([ref]), `vetmock-research-${release.version}.ris`, 'application/x-research-info-systems');
      else download(m.toBibtex([ref]), `vetmock-research-${release.version}.bib`, 'application/x-bibtex');
    } catch {
      setFileFailed(true);
    }
  };

  return (
    <PublicShell current="cite">
      <main id="rs-main" className="rs-main rs-main--narrow rs-pub-main">
        <h1 className="rs-h1" tabIndex={-1}>{t('trust.page.cite.title')}</h1>
        <p className="rs-sub">{t('trust.cite.intro')}</p>
        {release ? (
          <>
            <section className="rs-panel rs-pub-cite" aria-labelledby="rs-cite-line">
              <p className="rs-soft rs-small">
                {t('trust.cite.version')}: <strong className="rs-mono">{release.version}</strong>, {t('trust.cite.released', { date: formatDate(release.released, lang) })}
              </p>
              <h2 id="rs-cite-line" className="rs-pub-h3">{t('trust.cite.line')}</h2>
              <p className="rs-pub-citeline">{line}</p>
              <p className="rs-soft rs-small">{t('trust.cite.accessedNote')}</p>
              {release.doi ? (
                <p>{t('trust.cite.doi')}: <a className="rs-mono" href={`https://doi.org/${release.doi}`}>{release.doi}</a></p>
              ) : (
                <p className="rs-soft rs-small">{t('trust.cite.noDoi')}</p>
              )}
              <div className="rs-pub-actions">
                <button type="button" className="rs-btn rs-btn--sm" onClick={copy}>{t(copyState === 'copied' ? 'trust.cite.copied' : 'trust.cite.copy')}</button>
                <button type="button" className="rs-btn rs-btn--sm" onClick={() => file('ris')}>{t('trust.cite.ris')}</button>
                <button type="button" className="rs-btn rs-btn--sm" onClick={() => file('bibtex')}>{t('trust.cite.bibtex')}</button>
              </div>
              <p className="rs-soft rs-small" role="status">
                {copyState === 'failed' ? t('trust.cite.copyFailed') : fileFailed ? t('trust.cite.downloadFailed') : t('trust.cite.downloadNote')}
              </p>
            </section>
            <section aria-labelledby="rs-cite-methods">
              <h2 id="rs-cite-methods" className="rs-h2">{t('trust.cite.methodsTitle')}</h2>
              <p>{t('trust.cite.methodsBody')}</p>
            </section>
          </>
        ) : (
          <p>{t('trust.cite.none')}</p>
        )}
      </main>
    </PublicShell>
  );
}
