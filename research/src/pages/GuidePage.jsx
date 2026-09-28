// A short user guide in plain Thai and English [M2-DESIGN.md 11.3; competitor-gaps.md D7]: one page per
// kind of work (from a raw file to a report, animals from several farms, a lab experiment, repeated
// measures, survival, a diagnostic test, agreement and questionnaires, preparing data) plus what each
// guardrail means. The page shown is the location hash (/guide#lab), so every page has its own link and
// the browser's back button moves between them. Each page names the made-up example that walks
// through it. The structure is GUIDE in ./model.js; every word is in i18n/trust.js. OWNER: trust role.
import { useEffect, useState } from 'react';
import { useT } from '../i18n/index.js';
import { getExample } from '../data/examples.js';
import PublicShell from './PublicShell.jsx';
import { GUIDE, guidePageFromHash } from './model.js';
import '../styles/pages.css';

function useHashPage() {
  const [page, setPage] = useState(() => guidePageFromHash(typeof window === 'undefined' ? '' : window.location.hash));
  useEffect(() => {
    const update = () => setPage(guidePageFromHash(window.location.hash));
    window.addEventListener('hashchange', update);
    window.addEventListener('popstate', update);
    return () => {
      window.removeEventListener('hashchange', update);
      window.removeEventListener('popstate', update);
    };
  }, []);
  return page;
}

function Contents() {
  const { t } = useT();
  return (
    <nav aria-labelledby="rs-guide-pages">
      <h2 id="rs-guide-pages" className="rs-h2">{t('trust.guide.pages')}</h2>
      <ol className="rs-pub-toc">
        {GUIDE.map((p) => (
          <li key={p.id}>
            <a href={`#${p.id}`} className="rs-pub-toc-link">
              <span className="rs-pub-toc-title">{t(`trust.guide.${p.id}.title`)}</span>
              <span className="rs-soft rs-small">{t(`trust.guide.${p.id}.lead`)}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

function GuideBody({ page }) {
  const { t } = useT();
  const example = page.example ? getExample(page.example) : null;
  const i = GUIDE.findIndex((p) => p.id === page.id);
  const next = GUIDE[i + 1] || null;
  const steps = Array.from({ length: page.steps }, (_, k) => `trust.guide.${page.id}.step${k + 1}`);
  const watch = Array.from({ length: page.watch }, (_, k) => `trust.guide.${page.id}.watch${k + 1}`);
  return (
    <article className="rs-pub-guide" aria-labelledby="rs-guide-title">
      <p><a href="#" className="rs-pub-back">{t('trust.guide.back')}</a></p>
      <h2 id="rs-guide-title" className="rs-h2 rs-pub-guide-title" tabIndex={-1}>{t(`trust.guide.${page.id}.title`)}</h2>
      <p className="rs-sub">{t(`trust.guide.${page.id}.lead`)}</p>
      {steps.length ? (
        <section aria-labelledby="rs-guide-steps">
          <h3 id="rs-guide-steps" className="rs-pub-h3">{t('trust.guide.steps')}</h3>
          <ol className="rs-pub-steps">{steps.map((k) => <li key={k}>{t(k)}</li>)}</ol>
        </section>
      ) : null}
      {page.warnings ? (
        <ul className="rs-pub-warnlist">{page.warnings.map((g) => <li key={g}>{t(`trust.guide.${page.id}.${g}`)}</li>)}</ul>
      ) : null}
      {watch.length ? (
        <section aria-labelledby="rs-guide-watch" className="rs-panel rs-pub-watch">
          <h3 id="rs-guide-watch" className="rs-pub-h3">{t('trust.guide.watch')}</h3>
          <ul>{watch.map((k) => <li key={k}>{t(k)}</li>)}</ul>
        </section>
      ) : null}
      {page.warnings || watch.length ? <p className="rs-soft rs-small">{t('trust.guide.warnFromData')}</p> : null}
      {example ? (
        <section aria-labelledby="rs-guide-try" className="rs-pub-try">
          <h3 id="rs-guide-try" className="rs-pub-h3">
            {t('trust.guide.try')} <span className="rs-chip rs-chip--gold rs-chip--inline">{t('trust.madeUp')}</span>
          </h3>
          <p>{t('trust.guide.tryBody', { title: t(example.titleKey) })}</p>
          <p className="rs-soft">{t(example.descKey)}</p>
        </section>
      ) : null}
      {next ? <p><a href={`#${next.id}`} className="rs-pub-next">{t('trust.guide.next', { title: t(`trust.guide.${next.id}.title`) })}</a></p> : null}
    </article>
  );
}

export default function Page() {
  const { t } = useT();
  const page = useHashPage();
  useEffect(() => {
    const title = page ? `${t(`trust.guide.${page.id}.title`)} | ${t('trust.page.guide.title')}` : t('trust.page.guide.title');
    document.title = `${title} | ${t('common.appName')}`;
  }, [t, page]);
  useEffect(() => {
    window.scrollTo(0, 0);
    if (page) document.getElementById('rs-guide-title')?.focus({ preventScroll: true });
  }, [page]);
  return (
    <PublicShell current="guide">
      <main id="rs-main" className="rs-main rs-main--narrow rs-pub-main">
        <h1 className="rs-h1" tabIndex={-1}>{t('trust.page.guide.title')}</h1>
        {page ? <GuideBody page={page} /> : (
          <>
            <p className="rs-sub">{t('trust.guide.intro')}</p>
            <Contents />
          </>
        )}
      </main>
    </PublicShell>
  );
}
