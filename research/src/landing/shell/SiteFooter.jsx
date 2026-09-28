// Footer of the front door [M1-DESIGN.md 15.4]: the closing call to open a file, then the footer
// proper with where every number comes from (the Europe PMC query and files, the course example the
// simulated herd copies, STROBE-Vet), the Studio's own pages and the rest of VetMock. The headline
// words rise in once when the footer comes into view (data-footer on the landing root, set by an
// IntersectionObserver); under reduced motion they are simply there. OWNER: landing role.
import { Fragment } from 'react';
import { useT } from '../../i18n/index.js';
import { HERD_DESIGN } from '../herd/data.js';
import { EVIDENCE_BASE_URL } from '../chart/rows.js';
import { currentYear } from './dates.js';
import { Mark } from './SiteHeader.jsx';
import { appLinkProps } from './nav.js';

const VETMOCK = 'https://vetmock.vercel.app';
const COURSE_FIXTURE = 'https://github.com/palmzamak2547/vet-mock/blob/main/research/tests/fixtures/course/epi-course-2026.json';
const STROBE_VET = 'https://doi.org/10.1111/jvim.14592';

export function CtaSection() {
  const { t } = useT();
  return (
    <section id="rs-cta" className="rs-l-cta" aria-labelledby="rs-cta-title">
      <p className="rs-l-eyebrow">{t('landing.cta.eyebrow')}</p>
      <h2 id="rs-cta-title" className="rs-l-cta-title">{t('landing.cta.title')}</h2>
      <p className="rs-l-cta-body">{t('landing.cta.body')}</p>
      <div className="rs-l-cta-actions">
        <a className="rs-l-btn rs-l-btn-primary rs-l-btn-lg" {...appLinkProps('/app')}>
          {t('landing.cta.open')}
        </a>
        <a className="rs-l-btn rs-l-btn-ghost rs-l-btn-lg" {...appLinkProps('/app/tools/sample-size')}>
          {t('landing.cta.sampleSize')}
        </a>
      </div>
    </section>
  );
}

// The space sits outside the clipping word box: inside an inline-block with overflow hidden a trailing
// space collapses, and the English headline read "Realdata. Numbersyoucancheck." (review round 1).
function Words({ text }) {
  const words = text.split(' ');
  return words.map((w, i) => (
    <Fragment key={i}>
      <span className="rs-l-wm">
        <span className="rs-l-w" style={{ transitionDelay: `${i * 60}ms` }}>
          {w}
        </span>
      </span>
      {i < words.length - 1 ? ' ' : null}
    </Fragment>
  ));
}

export default function SiteFooter() {
  const { t, lang } = useT();
  return (
    <footer className="rs-l-footer" data-rs="footer">
      <p className="rs-l-footer-headline" aria-label={`${t('landing.footer.headline1')} ${t('landing.footer.headline2')}`}>
        <span aria-hidden="true">
          <Words text={t('landing.footer.headline1')} />
          <br />
          <Words text={t('landing.footer.headline2')} />
        </span>
      </p>
      <div className="rs-l-footer-grid">
        <div className="rs-l-footer-brand">
          <div className="rs-l-footer-mark">
            <Mark size={22} />
            <span className="rs-l-wordmark">VetMock Research</span>
          </div>
          <p>{t('landing.footer.tagline')}</p>
        </div>
        <nav aria-labelledby="rs-f-studio" className="rs-l-footer-col">
          <h2 id="rs-f-studio" className="rs-l-footer-h">{t('landing.footer.studio')}</h2>
          <a {...appLinkProps('/app')}>{t('landing.footer.openStudio')}</a>
          <a {...appLinkProps('/app/tools/sample-size')}>{t('landing.footer.sampleSize')}</a>
          <a {...appLinkProps('/methods')}>{t('landing.footer.methods')}</a>
          <a {...appLinkProps('/guide')}>{t('landing.footer.guide')}</a>
          <a {...appLinkProps('/cite')}>{t('landing.footer.cite')}</a>
          <a {...appLinkProps('/licenses')}>{t('landing.footer.licenses')}</a>
        </nav>
        <nav aria-labelledby="rs-f-sources" className="rs-l-footer-col rs-l-footer-col-wide">
          <h2 id="rs-f-sources" className="rs-l-footer-h">{t('landing.footer.sources')}</h2>
          <a href={`${EVIDENCE_BASE_URL}README.md`} rel="noopener">{t('landing.footer.srcEpmc')}</a>
          <a href={COURSE_FIXTURE} rel="noopener">{t('landing.footer.srcCourse', { code: HERD_DESIGN.courseCode })}</a>
          <a href={STROBE_VET} rel="noopener">{t('landing.footer.srcStrobe')}</a>
        </nav>
        <nav aria-labelledby="rs-f-vetmock" className="rs-l-footer-col">
          <h2 id="rs-f-vetmock" className="rs-l-footer-h">{t('landing.footer.vetmock')}</h2>
          <a href={`${VETMOCK}/`} rel="noopener">{t('landing.footer.bank')}</a>
          <a href={`${VETMOCK}/app/privacy`} rel="noopener">{t('landing.footer.privacy')}</a>
          <a href={`${VETMOCK}/app/feedback`} rel="noopener">{t('landing.footer.feedback')}</a>
        </nav>
      </div>
      <div className="rs-l-footer-base">
        <span>{t('landing.footer.copy', { year: currentYear(lang) })}</span>
        <span className="rs-l-grow">{t('landing.footer.note')}</span>
        <a href="#rs-top">{t('landing.footer.top')}</a>
      </div>
      <div className="rs-l-footer-ghost" aria-hidden="true">
        research.vetmock<span>.</span>com
      </div>
    </footer>
  );
}
