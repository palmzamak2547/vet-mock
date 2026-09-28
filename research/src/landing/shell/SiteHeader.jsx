// The front door's header [M1-DESIGN.md 15.4]: wordmark, section links with a sliding indicator (the
// chapter comes from the scroll story as a data attribute on the landing root, so nothing re-renders
// per frame), the ไทย/EN switch, the theme switch and the way into the Studio. On a phone the section
// links move into a menu dialog that traps focus and closes on Escape. OWNER: landing role.
import { useEffect, useRef, useState } from 'react';
import { useT } from '../../i18n/index.js';
import { setTheme, useTheme } from './theme.js';
import { appLinkProps } from './nav.js';

export const SECTIONS = Object.freeze([
  ['how', 'landing.nav.how'],
  ['acc', 'landing.nav.acc'],
  ['res', 'landing.nav.res'],
  ['priv', 'landing.nav.priv'],
  ['papers', 'landing.nav.papers'],
]);

/** Nine dots, the centre one gold: one farm with one positive. */
export function Mark({ size = 26 }) {
  const dots = [];
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      const centre = r === 1 && c === 1;
      dots.push(<circle key={`${r}${c}`} cx={6 + c * 7} cy={6 + r * 7} r={centre ? 3.2 : 2.6} className={centre ? 'rs-l-mark-gold' : 'rs-l-mark-dot'} />);
    }
  }
  return (
    <svg width={size} height={size} viewBox="0 0 26 26" fill="none" aria-hidden="true" focusable="false">
      {dots}
    </svg>
  );
}

export function LangSwitch({ className = '' }) {
  const { lang, setLang, t } = useT();
  return (
    <div className={`rs-l-seg ${className}`} role="group" aria-label={t('common.lang.group')} data-lang={lang}>
      <span className="rs-l-seg-thumb" aria-hidden="true" />
      <button type="button" className="rs-l-seg-btn" lang="th" aria-pressed={lang === 'th'} onClick={() => setLang('th')}>
        {t('common.lang.th')}
      </button>
      <button type="button" className="rs-l-seg-btn rs-mono" lang="en" aria-pressed={lang === 'en'} onClick={() => setLang('en')}>
        {t('common.lang.en')}
      </button>
    </div>
  );
}

export function ThemeSwitch({ className = '' }) {
  const { t } = useT();
  const theme = useTheme();
  const dark = theme === 'dark';
  return (
    <button type="button" className={`rs-l-icon-btn ${className}`} aria-label={t(dark ? 'landing.theme.toLight' : 'landing.theme.toDark')} title={t(dark ? 'landing.theme.toLight' : 'landing.theme.toDark')} onClick={() => setTheme(dark ? 'light' : 'dark')}>
      {dark ? (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.7" />
          <path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M5.3 18.7l1.6-1.6M17.1 6.9l1.6-1.6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        </svg>
      ) : (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
        </svg>
      )}
    </button>
  );
}

function Menu({ onClose }) {
  const { t } = useT();
  const ref = useRef(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  useEffect(() => {
    const onClose = () => closeRef.current();
    const el = ref.current;
    const first = el?.querySelector('button, a[href]');
    first?.focus();
    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== 'Tab' || !el) return;
      const f = [...el.querySelectorAll('a[href], button')];
      if (!f.length) return;
      if (e.shiftKey && document.activeElement === f[0]) {
        e.preventDefault();
        f[f.length - 1].focus();
      } else if (!e.shiftKey && document.activeElement === f[f.length - 1]) {
        e.preventDefault();
        f[0].focus();
      }
    };
    el?.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      el?.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, []);
  return (
    <div className="rs-l-menu" role="dialog" aria-modal="true" aria-label={t('landing.menu.title')} ref={ref}>
      <div className="rs-l-menu-top">
        <span className="rs-l-wordmark">
          VetMock <span className="rs-mono rs-l-wordmark-sub">Research</span>
        </span>
        <button type="button" className="rs-l-icon-btn" aria-label={t('landing.menu.close')} onClick={onClose}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M3.5 3.5 L12.5 12.5 M12.5 3.5 L3.5 12.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
          </svg>
        </button>
      </div>
      <nav className="rs-l-menu-nav" aria-label={t('landing.nav.label')}>
        {SECTIONS.map(([id, key], i) => (
          <a key={id} href={`#rs-${id}`} className="rs-l-menu-link" onClick={onClose}>
            <span className="rs-mono rs-l-menu-num">{String(i + 1).padStart(2, '0')}</span>
            <span>{t(key)}</span>
          </a>
        ))}
      </nav>
      <div className="rs-l-menu-tools">
        <LangSwitch />
        <ThemeSwitch />
      </div>
      <span className="rs-l-grow" />
      <a className="rs-l-btn rs-l-btn-primary rs-l-menu-cta" {...appLinkProps('/app', () => onClose())}>
        {t('landing.nav.open')}
      </a>
    </div>
  );
}

export default function SiteHeader() {
  const { t } = useT();
  const [menu, setMenu] = useState(false);
  const btnRef = useRef(null);
  const close = useRef(() => {});
  close.current = () => {
    setMenu(false);
    window.setTimeout(() => btnRef.current?.focus(), 0);
  };
  return (
    <header className="rs-l-header">
      <a className="rs-l-skip" href="#rs-main">
        {t('landing.skip')}
      </a>
      <div className="rs-l-header-bg" aria-hidden="true" />
      <a className="rs-l-brand" href="#rs-top" aria-label={t('landing.brand.home')}>
        <Mark />
        <span className="rs-l-wordmark">VetMock</span>
        <span className="rs-l-brand-rule" aria-hidden="true" />
        <span className="rs-mono rs-l-wordmark-sub">Research</span>
      </a>
      <nav className="rs-l-nav" aria-label={t('landing.nav.label')}>
        <span className="rs-l-nav-ind" aria-hidden="true" />
        {SECTIONS.map(([id, key], i) => (
          <a key={id} href={`#rs-${id}`} className="rs-l-navi" data-n={i + 1}>
            {t(key)}
          </a>
        ))}
      </nav>
      <div className="rs-l-header-tools">
        <LangSwitch className="rs-l-hide-phone" />
        <ThemeSwitch className="rs-l-hide-phone" />
        <a className="rs-l-btn rs-l-btn-primary rs-l-btn-sm rs-l-hide-phone" {...appLinkProps('/app')}>
          {t('landing.nav.open')}
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M3 7 H11 M7.5 3.5 L11 7 L7.5 10.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
        <button type="button" ref={btnRef} className="rs-l-icon-btn rs-l-icon-btn-sage rs-l-show-phone" aria-label={t('landing.menu.open')} aria-expanded={menu} onClick={() => setMenu(true)}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
            <path d="M3 5.5 H15 M3 9 H15 M3 12.5 H11" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
          </svg>
        </button>
      </div>
      {menu ? <Menu onClose={() => close.current()} /> : null}
    </header>
  );
}
