// ============================================================
// LandingView — VetMock marketing landing (signed-out front door)
// ============================================================
// Redesigned 2026-10-07 (LandingBody.jsx has the story). This file stays the
// single state owner and keeps every contract the old page earned:
//   • REAL, wired to existing systems:
//       - Sign In  → real signInWithGoogle / signInWithMagicLink (App props)
//       - Subjects → real curriculum (SUBJECTS_BY_YEAR) + real q-counts;
//                    each card enters the real practice flow
//       - Every CTA runs its real destination (practice, Panic Mode, lab)
//       - Cookie consent → real gate for @vercel/analytics (App owns it)
//       - Theme / language toggles → real
//   • INTERACTIVE EXAMPLES that never touch progress: the hero question
//     (bank item 202358, word for word) and the radiograph station.
//   • Entering the app opens through a View Transition that grows from the
//     button that was pressed; browsers without the API, and reduced motion,
//     get the plain state change.
//
// The landing stylesheet travels with this lazy view, so students who never
// see the landing never download it (tests/unit/boot-weight.test.mjs).
// ============================================================

import { useState, useEffect, useLayoutEffect, useRef, useMemo, useCallback } from 'react';
import { flushSync } from 'react-dom';
import { subjectText } from '../hooks/utils.js';
import { SUBJECTS_BY_YEAR, YEARS } from '../data/curriculum.js';
import { Q_VISIBLE_COUNTS_BY_SUBJECT } from '../data/q-counts.js';
import { DICT, HERO_QUESTION } from './landing/dict.js';
import LandingBody from './landing/LandingBody.jsx';
import { useLandingMotion } from './landing/useLandingMotion.js';
import NavIcon from '../components/NavIcon.jsx';
import { EMPTY_ART } from '../data/art.js';
import { inAppBrowser, externalUrl, APP_NAMES } from '../lib/inapp.js';
import '../styles-landing.css';

// Every iOS browser is WebKit, which can crash while snapshotting a large
// React view for a View Transition, so the transitions below stay off there.
// Same test as App's withTransition (desktop Chromium also says AppleWebKit).
const WEBKIT = typeof navigator !== 'undefined'
  && /AppleWebKit/i.test(navigator.userAgent || '')
  && !/(Chrome|Chromium|Edg|OPR|SamsungBrowser)/i.test(navigator.userAgent || '');

const FOCUSABLE_SELECTOR = 'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])';

// Real subjects with REAL question counts. Each is a working destination
// into the practice flow.
function buildRealSubjects(year) {
  const list = SUBJECTS_BY_YEAR[year] || [];
  return list.map((s) => ({
    id: s.id,
    year,
    name: s.name,
    sub: s.name_en || s.code || '',
    color: subjectText(s.color),
    count: Q_VISIBLE_COUNTS_BY_SUBJECT[s.id] || 0,
  })).filter((s) => s.count > 0);
}

export default function LandingView({
  onEnterApp,          // () => enter the real practice app
  onStartMockExam,     // () => run the REAL timed mock exam
  onStartPanic,        // (timeKey) => run a REAL cram session sized to the time left
  onOpenLab,           // () => open the REAL imaging lab
  onPickSubject,       // (year, subjectId) => enter real practice for that subject
  onOpenAuth,          // () => hand off to real AuthView (password / signup)
  onGoogle,            // () => real signInWithGoogle()
  onMagicLink,         // async (email) => real signInWithMagicLink()
  hasSupabase = false, // gate real auth methods honestly
  theme = 'light',
  onToggleTheme,       // () => flip real theme
  lang: langProp,      // 'en' | 'th'
  onSetLang,           // (l) => persist real language
  consent = 'ask',     // 'ask' | 'all' | 'essential'
  onConsent,           // (choice, prefs) => persist real consent (gates analytics)
}) {
  const [lang, setLang] = useState(langProp || 'en');
  const L = DICT[lang];
  const reduce = useRef(false);

  // Scroll-spy for the nav, observer-driven (no scroll listener).
  useLandingMotion();

  // ---- UI state ----
  const [mobileOpen, setMobileOpen] = useState(false);
  const [muted, setMuted] = useState(true);
  const [navScrolled, setNavScrolled] = useState(false);

  // hero question (non-scoring)
  const [heroPicked, setHeroPicked] = useState(null);
  const [heroRevealed, setHeroRevealed] = useState(false);
  const [heroBookmarked, setHeroBookmarked] = useState(false);
  const [heroConfidence, setHeroConfidence] = useState(null);

  // panic
  const [panicTime, setPanicTime] = useState('30');

  // radiograph station (non-scoring)
  const [labPicked, setLabPicked] = useState(null);
  const [labRevealed, setLabRevealed] = useState(false);
  const [labZoom, setLabZoom] = useState(1);

  // cookie + login
  const [cookieOpen, setCookieOpen] = useState(consent === 'ask');
  const [cookiePrefs, setCookiePrefs] = useState(false);
  const [cAnalytics, setCAnalytics] = useState(true);
  const [cPersonal, setCPersonal] = useState(true);
  const [loginOpen, setLoginOpen] = useState(false);
  const [loginStep, setLoginStep] = useState('email'); // email | sent
  const [loginEmail, setLoginEmail] = useState('');
  const [loginSending, setLoginSending] = useState(false);
  const [loginError, setLoginError] = useState('');
  const cookiePanelRef = useRef(null);
  const loginDialogRef = useRef(null);
  const loginReturnFocusRef = useRef(null);
  const mobileMenuButtonRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const navSentinelRef = useRef(null);
  const closeLogin = useCallback(() => setLoginOpen(false), []);
  // LINE, Facebook, Instagram and TikTok open links in their own browsers,
  // where Google often refuses sign-in; the dialog says so up front.
  const inApp = useMemo(() => (typeof navigator === 'undefined' ? null : inAppBrowser(navigator.userAgent)), []);
  const inAppExit = useMemo(() => (inApp && typeof window !== 'undefined' ? externalUrl(inApp, window.location.href) : null), [inApp]);
  const closeMobileMenu = useCallback(() => setMobileOpen(false), []);

  // sync language from prop
  useEffect(() => { if (langProp && langProp !== lang) setLang(langProp); }, [langProp]); // eslint-disable-line

  // Progressive enhancement: the page is fully visible without JS or the
  // observer. With motion enabled, this class arms the entrance and reveal
  // transitions; the observer below removes them section by section.
  useLayoutEffect(() => {
    reduce.current = !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const motionReady = !reduce.current && 'IntersectionObserver' in window;
    if (motionReady) document.documentElement.classList.add('lp-motion-ready');
    return () => document.documentElement.classList.remove('lp-motion-ready');
  }, []);

  // The compact consent summary swaps to a preferences panel. Move focus to
  // the first switch because the trigger itself is removed by that swap.
  useEffect(() => {
    if (!cookieOpen || !cookiePrefs) return undefined;
    const frame = window.requestAnimationFrame(() => {
      cookiePanelRef.current?.querySelector('[role="switch"]')?.focus();
    });
    return () => window.cancelAnimationFrame(frame);
  }, [cookieOpen, cookiePrefs]);

  // Flag <html> so it paints the landing background (the landing renders
  // before .vmx-app, which normally paints it). Cleaned on unmount so the
  // practice app is not left with the class.
  useEffect(() => {
    document.documentElement.classList.add('lp-active');
    return () => document.documentElement.classList.remove('lp-active');
  }, []);

  // Reveal sections as they arrive; the nav knows when the page left its top.
  useEffect(() => {
    reduce.current = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    // The hero's entrance plays on the next frame so its first paint is the
    // resting layout (no flash of hidden text if this effect runs late).
    const raf = window.requestAnimationFrame(() => document.documentElement.classList.add('lp-entered'));
    const els = Array.from(document.querySelectorAll('.lp-reveal'));
    let io;
    if (reduce.current || !('IntersectionObserver' in window)) {
      els.forEach((e) => e.classList.add('in'));
    } else {
      io = new IntersectionObserver((ents) => {
        ents.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add('in');
            io.unobserve(en.target);
          }
        });
      }, { threshold: 0, rootMargin: '0px 0px -8% 0px' });
      els.forEach((e) => {
        if (!e.classList.contains('in')) io.observe(e);
      });
    }
    // One 1px sentinel replaces a React state update on every scroll event.
    let navObserver;
    const sentinel = navSentinelRef.current;
    if (sentinel && 'IntersectionObserver' in window) {
      navObserver = new IntersectionObserver(([entry]) => {
        setNavScrolled(!entry.isIntersecting);
      }, { threshold: 0 });
      navObserver.observe(sentinel);
    } else {
      setNavScrolled(window.scrollY > 8);
    }
    return () => {
      window.cancelAnimationFrame(raf);
      document.documentElement.classList.remove('lp-entered');
      if (io) io.disconnect();
      if (navObserver) navObserver.disconnect();
    };
    // eslint-disable-next-line
  }, [lang]);

  // The landing menu is a real modal navigation surface on compact screens.
  // It stays mounted while closed so links remain in the document, then
  // visibility + inert keep it out of interaction until opened. Opening moves
  // focus inside, locks the page scroller, traps Tab, and closing returns
  // focus to the trigger.
  useEffect(() => {
    if (!mobileOpen) return undefined;
    const menu = mobileMenuRef.current;
    if (!menu) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const focusables = () => {
      const inside = Array.from(menu.querySelectorAll(FOCUSABLE_SELECTOR));
      return mobileMenuButtonRef.current ? [mobileMenuButtonRef.current, ...inside] : inside;
    };
    const onMenuKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeMobileMenu();
        return;
      }
      if (event.key !== 'Tab') return;
      const items = focusables();
      if (items.length === 0) {
        event.preventDefault();
        menu.focus();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      if (!menu.contains(document.activeElement)) {
        // The trigger is part of the compact menu's focus circuit even though
        // it sits in the sticky header above the dialog.
        if (!event.shiftKey && document.activeElement === mobileMenuButtonRef.current && items[1]) {
          event.preventDefault();
          items[1].focus();
        } else {
          event.preventDefault();
          (event.shiftKey ? last : first).focus();
        }
      } else if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onMenuKeyDown);
    const frame = window.requestAnimationFrame(() => {
      (menu.querySelector('.lp-mobile-menu-link') || menu).focus();
    });

    return () => {
      window.cancelAnimationFrame(frame);
      document.removeEventListener('keydown', onMenuKeyDown);
      document.body.style.overflow = previousOverflow;
      mobileMenuButtonRef.current?.focus?.();
    };
  }, [closeMobileMenu, mobileOpen]);

  // CSS owns the compact breakpoint. Observe whether that stylesheet has
  // hidden the trigger instead of duplicating its pixel value here; rotating a
  // phone or widening a tablet must never leave body scroll locked.
  useEffect(() => {
    if (!mobileOpen) return undefined;
    const trigger = mobileMenuButtonRef.current;
    if (!trigger) return undefined;
    const closeWhenCssHidesTrigger = () => {
      if (window.getComputedStyle(trigger).display === 'none') closeMobileMenu();
    };
    closeWhenCssHidesTrigger();
    if ('ResizeObserver' in window) {
      const observer = new ResizeObserver(closeWhenCssHidesTrigger);
      observer.observe(document.documentElement);
      return () => observer.disconnect();
    }
    window.addEventListener('resize', closeWhenCssHidesTrigger, { passive: true });
    return () => {
      window.removeEventListener('resize', closeWhenCssHidesTrigger);
    };
  }, [closeMobileMenu, mobileOpen]);

  // Focus-managed login dialog: focus moves inside, Tab stays inside, body
  // scroll is locked, and closing returns focus to the control that opened it.
  useEffect(() => {
    if (!loginOpen) return undefined;
    const dialog = loginDialogRef.current;
    if (!dialog) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const focusables = () => Array.from(dialog.querySelectorAll(FOCUSABLE_SELECTOR));
    const onDialogKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeLogin();
        return;
      }
      if (event.key !== 'Tab') return;
      const items = focusables();
      if (items.length === 0) {
        event.preventDefault();
        dialog.focus();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      if (!dialog.contains(document.activeElement)) {
        event.preventDefault();
        (event.shiftKey ? last : first).focus();
      } else if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    // Listen at document scope: changing from the email form to the
    // confirmation step unmounts the focused submit button, and browsers may
    // briefly place focus on <body>. The trap still recovers on the next Tab.
    document.addEventListener('keydown', onDialogKeyDown);
    return () => {
      document.removeEventListener('keydown', onDialogKeyDown);
      document.body.style.overflow = previousOverflow;
      loginReturnFocusRef.current?.focus?.();
    };
  }, [closeLogin, loginOpen]);

  // Put focus on the meaningful control for each dialog step.
  useEffect(() => {
    if (!loginOpen) return undefined;
    const frame = window.requestAnimationFrame(() => {
      const dialog = loginDialogRef.current;
      if (!dialog) return;
      const target = loginStep === 'email'
        ? dialog.querySelector('#vm-login-email')
        : dialog.querySelector('#vmx-login-title');
      (target || dialog).focus();
    });
    return () => window.cancelAnimationFrame(frame);
  }, [loginOpen, loginStep]);

  const beep = useCallback((good) => {
    if (muted) return;
    try {
      const A = window.AudioContext || window.webkitAudioContext; if (!A) return;
      const ac = new A();
      // Two soft partials a fifth apart for a right answer, one lower for a miss.
      (good ? [660, 990] : [440]).forEach((f, i) => {
        const o = ac.createOscillator(), g = ac.createGain();
        o.type = 'sine'; o.frequency.value = f;
        g.gain.setValueAtTime(0, ac.currentTime);
        g.gain.linearRampToValueAtTime(0.045 / (i + 1), ac.currentTime + 0.012);
        g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + 0.32);
        o.connect(g); g.connect(ac.destination); o.start(); o.stop(ac.currentTime + 0.34);
      });
    } catch { /* no-op */ }
  }, [muted]);

  // Runs a state change inside a View Transition that grows from the point
  // that was pressed. Used for every way into the app and for the language
  // switch; without the API, with reduced motion, or on WebKit it is a plain call.
  const transition = useCallback((run, event, kind = 'portal') => {
    const doc = document;
    if (!doc.startViewTransition || reduce.current || WEBKIT) { run(); return; }
    const root = doc.documentElement;
    const x = event?.clientX || window.innerWidth / 2;
    const y = event?.clientY || window.innerHeight / 2;
    root.style.setProperty('--lp-vt-x', `${Math.round(x)}px`);
    root.style.setProperty('--lp-vt-y', `${Math.round(y)}px`);
    root.classList.add(`lp-vt-${kind}`);
    try {
      const vt = doc.startViewTransition(() => { flushSync(run); });
      // A transition that starts while this one runs (the app's own, on the
      // next screen) skips it and rejects these. That is a normal skip, not
      // an error, as in App's withTransition.
      vt.ready?.catch(() => {});
      vt.updateCallbackDone?.catch(() => {});
      vt.finished.catch(() => {}).then(() => root.classList.remove(`lp-vt-${kind}`));
    } catch {
      root.classList.remove(`lp-vt-${kind}`);
      run();
    }
  }, []);
  const portal = useCallback((fn) => (event) => transition(() => fn && fn(), event, 'portal'), [transition]);

  const chooseLang = (l, event) => {
    setMobileOpen(false);
    if (l === lang) return;
    transition(() => { setLang(l); onSetLang && onSetLang(l); }, event, 'fade');
  };

  // ---- derived ----
  const liveYears = YEARS.filter((y) => !y.scaffold).map((y) => y.id);
  const realSubjects = useMemo(() => liveYears.flatMap((y) => buildRealSubjects(y)), []); // eslint-disable-line

  // ---- interactions (all non-scoring) ----
  const onCheckHero = () => { if (heroPicked === null) return; setHeroRevealed(true); beep(heroPicked === HERO_QUESTION.answer); };
  const onCheckLab = () => { if (labPicked === null) return; setLabRevealed(true); beep(labPicked === 0); };

  // ---- real login ----
  const openLogin = (event) => {
    // Mobile Safari/WebKit does not focus a button when it is tapped, so
    // document.activeElement can still be <body>. The click target is the
    // reliable opener across pointer and keyboard activation.
    const opener = event?.currentTarget || document.activeElement;
    loginReturnFocusRef.current = opener?.closest?.('.lp-only-mobile')
      ? mobileMenuButtonRef.current
      : opener;
    setLoginError('');
    setLoginStep('email');
    setLoginOpen(true);
    setMobileOpen(false);
  };
  const doGoogle = () => { if (!hasSupabase) { onOpenAuth && onOpenAuth(); return; } onGoogle && onGoogle(); };
  const doMagic = async () => {
    const email = loginEmail.trim();
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) { setLoginError(L.lgErrEmail); return; }
    if (!hasSupabase) { onOpenAuth && onOpenAuth(); return; }
    setLoginSending(true); setLoginError('');
    try {
      await onMagicLink(email);
      setLoginStep('sent');
    } catch (e) {
      // shouldCreateUser:false → unknown email surfaces here honestly
      const msg = String(e && e.message || '');
      setLoginError(/rate|too many/i.test(msg) ? L.lgErrRate : /not found|signup|user/i.test(msg) ? L.lgErrNoUser : L.lgErrGeneric);
    } finally {
      setLoginSending(false);
    }
  };

  // ---- cookie consent (real, gates analytics via App) ----
  const cookieAccept = () => { setCookieOpen(false); onConsent && onConsent('all', { analytics: true, personal: true }); };
  const cookieEssential = () => { setCookieOpen(false); onConsent && onConsent('essential', { analytics: false, personal: false }); };
  const cookieSave = () => { setCookieOpen(false); onConsent && onConsent(cAnalytics ? 'custom' : 'essential', { analytics: cAnalytics, personal: cPersonal }); };

  const t = L; // alias
  // ================= RENDER =================
  return (
    <div className="lp-root" lang={lang}>
      <span ref={navSentinelRef} className="lp-nav-sentinel" aria-hidden="true" />
      <a className="lp-skip" href="#lp-main">{t.skip}</a>

      {/* ---- NAV ---- */}
      <header id="vm-nav" className={`lp-nav ${navScrolled ? 'is-scrolled' : ''}`}>
        <div className="lp-pad lp-nav-row">
          <a href="#lp-top" className="lp-brand">
            <img src="/vetmock-logo.svg" width={30} height={30} alt="VetMock logo" />
            <span className="lp-wordmark">Vet<span>Mock</span></span>
          </a>
          <nav className="lp-only-desktop lp-nav-links" aria-label={t.menuNavLabel}>
            {t.nav.map((l) => <a key={l.href} href={l.href} className="lp-navlink">{l.label}</a>)}
          </nav>
          <div className="lp-nav-actions">
            <div className="lp-only-desktop lp-lang" role="group" aria-label={t.menuLanguageLabel}>
              <button type="button" aria-pressed={lang === 'en'} onClick={(e) => chooseLang('en', e)}>EN</button>
              <button type="button" aria-pressed={lang === 'th'} onClick={(e) => chooseLang('th', e)}>ไทย</button>
            </div>
            <button type="button" onClick={() => setMuted((current) => !current)} aria-label={muted ? t.soundOn : t.soundOff} className="lp-only-desktop lp-iconbtn lp-sound-toggle">
              <NavIcon name={muted ? 'speaker-off' : 'speaker'} size={17} />
            </button>
            <button type="button" onClick={onToggleTheme} aria-label={theme === 'dark' ? t.themeToLight : t.themeToDark} className="lp-iconbtn lp-theme-toggle">
              <NavIcon name={theme === 'dark' ? 'sun' : 'moon'} size={18} />
            </button>
            <button type="button" onClick={openLogin} className="lp-only-desktop vmx-btn vmx-btn-ghost vmx-btn-sm lp-nav-signin">{t.signIn}</button>
            <button type="button" onClick={portal(onEnterApp)} className="vmx-btn vmx-btn-primary vmx-btn-sm lp-nav-start">{t.start}</button>
            <button
              ref={mobileMenuButtonRef}
              type="button"
              className={`lp-nav-burger lp-iconbtn${mobileOpen ? ' is-open' : ''}`}
              onClick={() => setMobileOpen((open) => !open)}
              aria-label={mobileOpen ? t.menuClose : t.menuOpen}
              aria-expanded={mobileOpen}
              aria-controls="lp-mobile-menu"
            >
              <NavIcon name={mobileOpen ? 'close' : 'menu'} size={19} />
            </button>
          </div>
        </div>
      </header>

      {/* Always mounted: visibility + inert close this curtain without
          deleting the navigation tree. */}
      <div
        ref={mobileMenuRef}
        id="lp-mobile-menu"
        className={`lp-only-mobile lp-mobile-menu${mobileOpen ? ' is-open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="lp-mobile-menu-title"
        aria-hidden={!mobileOpen}
        inert={mobileOpen ? undefined : ''}
        tabIndex={-1}
      >
        <div className="lp-mobile-menu-inner">
          <div className="lp-mobile-menu-head">
            <p id="lp-mobile-menu-title" className="lp-mobile-menu-title">{t.menuTitle}</p>
            <p className="lp-mobile-menu-context"><span>{t.menuContext}</span>{t.ctxChip}</p>
          </div>

          <nav className="lp-mobile-menu-nav" aria-label={t.menuNavLabel}>
            {t.nav.map((link, i) => (
              <a
                key={link.href}
                href={link.href}
                className="lp-mobile-menu-link"
                style={{ '--i': i }}
                onClick={closeMobileMenu}
              >
                <span>{link.label}</span>
                <span aria-hidden="true">→</span>
              </a>
            ))}
          </nav>

          <div className="lp-mobile-menu-foot">
            <button type="button" onClick={openLogin} className="vmx-btn vmx-btn-ghost">{t.signIn}</button>
            <div className="lp-lang lp-mobile-menu-language" role="group" aria-label={t.menuLanguageLabel}>
              <button type="button" aria-pressed={lang === 'en'} onClick={(e) => chooseLang('en', e)}>EN</button>
              <button type="button" aria-pressed={lang === 'th'} onClick={(e) => chooseLang('th', e)}>ไทย</button>
            </div>
          </div>
        </div>
      </div>

      <LandingBody
        {...{ t, lang,
          heroPicked, heroRevealed, heroBookmarked, heroConfidence,
          setHeroPicked, setHeroRevealed, setHeroBookmarked, setHeroConfidence, onCheckHero,
          realSubjects,
          panicTime, setPanicTime,
          labPicked, labRevealed, labZoom, setLabPicked, setLabZoom, onCheckLab,
          portal, onEnterApp, onPickSubject, openLogin,
          onStartMockExam, onStartPanic, onOpenLab }}
      />

      {/* ---- Cookie consent (real) ---- */}
      {cookieOpen && (
        <div className="lp-cookie-dock" role="region" aria-labelledby="lp-cookie-title">
          <div ref={cookiePanelRef} className="lp-cookie-card">
            {!cookiePrefs ? (
              <div className="lp-cookie-summary">
                <svg className="lp-cookie-icon" width={38} height={38} viewBox="0 0 44 44" fill="none" aria-hidden="true">
                  <circle cx={22} cy={22} r={18} fill="var(--clr-gold-soft)" stroke="var(--clr-gold)" strokeWidth={1.5} />
                  <circle cx={15} cy={17} r={2.4} fill="var(--clr-sage)" /><circle cx={27} cy={14.5} r={2} fill="var(--clr-ink)" />
                  <circle cx={30} cy={26} r={2.6} fill="var(--clr-sage)" /><circle cx={16} cy={28} r={1.8} fill="var(--clr-ink)" />
                  <path d="M18.5 22.5l2.4 2.4 4.4-4.8" stroke="var(--clr-sage)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div className="lp-cookie-copy">
                  <div id="lp-cookie-title" className="lp-cookie-title">{t.ckHead}</div>
                  <p className="lp-cookie-body">{t.ckBody}</p>
                  <div className="lp-cookie-actions">
                    <button type="button" onClick={cookieAccept} className="vmx-btn vmx-btn-primary vmx-btn-sm">{t.ckAccept}</button>
                    <button type="button" onClick={cookieEssential} className="vmx-btn vmx-btn-ghost vmx-btn-sm">{t.ckEssential}</button>
                    <button type="button" onClick={() => setCookiePrefs(true)} className="lp-cookie-prefs">{t.ckPrefs}</button>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <div id="lp-cookie-title" className="lp-cookie-title lp-cookie-title-prefs">{t.ckPrefs}</div>
                <div className="lp-cookie-row">
                  <div><div className="lp-cookie-row-t">{t.ckEssentialT}</div><div className="lp-cookie-row-d">{t.ckEssentialD}</div></div>
                  <span className="lp-cookie-always">{t.ckAlways}</span>
                </div>
                <CookieRow title={t.ckAnalyticsT} desc={t.ckAnalyticsD} on={cAnalytics} onToggle={() => setCAnalytics((v) => !v)} />
                <CookieRow title={t.ckPersonalT} desc={t.ckPersonalD} on={cPersonal} onToggle={() => setCPersonal((v) => !v)} last />
                <div className="lp-cookie-actions">
                  <button type="button" onClick={cookieSave} className="vmx-btn vmx-btn-primary vmx-btn-sm">{t.ckSave}</button>
                  <button type="button" onClick={cookieAccept} className="vmx-btn vmx-btn-ghost vmx-btn-sm">{t.ckAccept}</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ---- Login modal (real auth) ---- */}
      {loginOpen && (
        <div className="lp-login">
          <div aria-hidden="true" onClick={closeLogin} className="lp-login-scrim" />
          <div ref={loginDialogRef} tabIndex={-1} className="lp-login-card" role="dialog" aria-modal="true" aria-labelledby="vmx-login-title">
            <div className="lp-login-side lp-hide-md">
              <p className="lp-login-side-head">{t.lgPerksHead}</p>
              <ul>
                {t.lgPerks.map((perk) => <li key={perk}><NavIcon name="check" size={15} /><span>{perk}</span></li>)}
              </ul>
              <img src={EMPTY_ART['sr-session'].src} alt="" width={240} height={180} loading="lazy" decoding="async" className="lp-login-art" />
            </div>
            <div className="lp-login-main">
              <div className="lp-login-top">
                <span className="lp-wordmark">Vet<span>Mock</span></span>
                <button type="button" onClick={closeLogin} aria-label={t.lgClose} className="lp-iconbtn">
                  <NavIcon name="close" size={17} />
                </button>
              </div>
              {loginStep === 'email' ? (
                <div>
                  <h3 id="vmx-login-title" className="lp-login-title">{t.lgHead}</h3>
                  <p className="lp-login-body">{t.lgBody}</p>
                  {inApp && (
                    <div className="lp-inapp" role="note">
                      <b>{t.inAppHead(APP_NAMES[inApp])}</b>
                      <p>{t.inAppBody}</p>
                      {inAppExit
                        ? <a className="vmx-btn vmx-btn-ghost" href={inAppExit}>{t.inAppOpen}</a>
                        : <p>{t.inAppSteps}</p>}
                    </div>
                  )}
                  <button type="button" onClick={doGoogle} className="vmx-btn vmx-btn-ghost lp-login-wide">{t.lgGoogle}</button>
                  <div className="lp-login-or"><span />{t.lgOr}<span /></div>
                  <label htmlFor="vm-login-email" className="lp-login-label">{t.lgEmailLabel}</label>
                  <input id="vm-login-email" type="email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} placeholder="you@example.com" className="vmx-fill-input lp-login-input" aria-invalid={Boolean(loginError)} aria-describedby={loginError ? 'vm-login-error' : undefined} onKeyDown={(e) => { if (e.key === 'Enter') doMagic(); }} />
                  {loginError && <div id="vm-login-error" role="alert" className="lp-login-error">{loginError}</div>}
                  <button type="button" onClick={doMagic} disabled={loginSending} className="vmx-btn vmx-btn-primary lp-login-wide">{loginSending ? t.lgSending : t.lgSend}</button>
                  <button type="button" onClick={() => { closeLogin(); onOpenAuth && onOpenAuth(); }} className="vmx-btn vmx-btn-ghost vmx-btn-sm lp-login-wide">{t.lgPassword}</button>
                  <button type="button" onClick={closeLogin} className="vmx-btn vmx-btn-ghost vmx-btn-sm lp-login-wide">{t.lgGuest}</button>
                  <p className="lp-login-fine">{t.lgIndependent}</p>
                  <p className="lp-login-fine">{t.lgTermsPre}<a href="/app/privacy#terms">{t.lgTerms}</a>{t.lgTermsMid}<a href="/app/privacy#privacy">{t.lgPrivacy}</a>{t.lgTermsPost}</p>
                </div>
              ) : (
                <div>
                  <h3 id="vmx-login-title" tabIndex={-1} className="lp-login-title">{t.lgSentHead}</h3>
                  <p className="lp-login-body">{t.lgSentBody} <strong>{loginEmail}</strong>. {t.lgSentHint}</p>
                  <div className="lp-login-tip">{t.lgSentTip}</div>
                  <div className="lp-login-links">
                    <button type="button" onClick={doMagic} disabled={loginSending} className="lp-link-btn">{loginSending ? t.lgSending : t.lgResend}</button>
                    <button type="button" onClick={() => { setLoginStep('email'); setLoginError(''); }} className="lp-link-btn is-quiet">{t.lgBack}</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CookieRow({ title, desc, on, onToggle, last }) {
  return (
    <div className={`lp-cookie-row${last ? ' is-last' : ''}`}>
      <div><div className="lp-cookie-row-t">{title}</div><div className="lp-cookie-row-d">{desc}</div></div>
      <button type="button" role="switch" aria-checked={on} aria-label={title} onClick={onToggle} className={`vmx-toggle ${on ? 'on' : ''}`} />
    </div>
  );
}
