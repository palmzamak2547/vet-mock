// ============================================================
// LandingView — VetMock marketing landing (signed-out front door)
// ============================================================
// Recreates design_handoff_vetmock_landing in the app's real stack
// (React 19 + Vite + the existing vmx-* design system in styles.css).
//
// Integration model (per the production brief):
//   • REAL, wired to existing systems:
//       - Sign In  → real signInWithGoogle / signInWithMagicLink (App props)
//       - Subjects → real curriculum (SUBJECTS_BY_YEAR) + real q-counts;
//                    each card enters the real practice flow
//       - "Start Practicing" / hero / CTA → enter the real app
//       - Cookie consent → real gate for @vercel/analytics (App owns it)
//       - Theme / language toggles → real
//   • INTERACTIVE EXAMPLES:
//       - hero question, lab station, panic mode, readiness, and insights.
//     They are clearly non-scoring, never touch real progress, and every
//     CTA bridges into a feature that ships in the real app.
//
// State: local component state only, matching the design's state model.
// ============================================================

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { SUBJECTS_BY_YEAR, YEARS } from '../data/curriculum.js';
import { Q_COUNTS_BY_SUBJECT } from '../data/q-counts.js';
import { DICT } from './landing/dict.js';
import LandingBody from './landing/LandingBody.jsx';
import { useLandingMotion } from './landing/useLandingMotion.js';

// ---- Demo fixtures for the interactive examples (isolated, non-scoring) ----
const HERO_OPTIONS = ['Abdominal radiographs', 'Low-dose dexamethasone suppression test (LDDST)', 'Serum fructosamine', 'Total T4 (thyroid panel)'];
const HERO_ANSWER = 1;
const LAB_OPTIONS = ['Left atrial enlargement with cardiogenic pulmonary oedema', 'Pleural effusion', 'Spontaneous pneumothorax', 'Megaesophagus'];
const LAB_ANSWER = 0;
const PANIC_DATA = { '15': { c: 8, t: 5, q: 12, w: 2 }, '30': { c: 15, t: 10, q: 25, w: 3 }, '60': { c: 30, t: 20, q: 50, w: 5 }, tonight: { c: 60, t: 40, q: 120, w: 6 } };
const READINESS = { score: 72 };

// Real subjects (year-4 default = current cohort) with REAL question
// counts. Each is a working destination into the practice flow.
function buildRealSubjects(year) {
  const list = SUBJECTS_BY_YEAR[year] || [];
  return list.map((s) => ({
    id: s.id,
    year,
    name: s.name,
    sub: s.name_en || s.code || '',
    emoji: s.icon || '📘',
    color: s.color || 'var(--clr-sage)',
    count: Q_COUNTS_BY_SUBJECT[s.id] || 0,
    hasQ: (Q_COUNTS_BY_SUBJECT[s.id] || 0) > 0,
  })).filter((s) => s.hasQ);
}

function buildOptions(texts, ans, picked, revealed) {
  const markBase = { marginLeft: 'auto', fontFamily: 'var(--vmx-mono)', fontWeight: 700, fontSize: 16 };
  return texts.map((text, i) => {
    let cls = '', style = {}, mark = '', markStyle = markBase;
    if (!revealed) { if (picked === i) cls = 'selected'; }
    else if (i === ans) { style = { background: 'var(--clr-sage)', color: 'var(--clr-surface)', borderColor: 'var(--clr-sage)' }; mark = '✓'; markStyle = { ...markBase, color: 'var(--clr-surface)' }; }
    else if (picked === i) { style = { borderColor: 'var(--clr-rose)', background: 'var(--clr-rose-soft)' }; mark = '✗'; markStyle = { ...markBase, color: 'var(--clr-rose-text)' }; }
    return { letter: String.fromCharCode(65 + i), text, cls, style, mark, markStyle };
  });
}

export default function LandingView({
  onEnterApp,          // () => enter the real practice app
  onStartMockExam,     // () => run the REAL timed mock exam this page advertises
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

  // Full motion layer (scroll rail + scroll-spy underline + magnetic
  // buttons + card tilt + spotlight). Progressive enhancement — self-
  // disables on touch / reduced-motion, fully cleaned on unmount.
  useLandingMotion();

  // ---- UI state ----
  const [mobileOpen, setMobileOpen] = useState(false);
  const [muted, setMuted] = useState(true);
  const [heroWord, setHeroWord] = useState(0);
  const [navScrolled, setNavScrolled] = useState(false);

  // hero exam demo
  const [heroPicked, setHeroPicked] = useState(null);
  const [heroRevealed, setHeroRevealed] = useState(false);
  const [heroBookmarked, setHeroBookmarked] = useState(false);
  const [heroConfidence, setHeroConfidence] = useState(null);

  // subjects
  const [subjectTab, setSubjectTab] = useState('all');
  const [showcaseMode, setShowcaseMode] = useState(false); // false = real subjects, true = full breadth showcase

  // panic
  const [panicTime, setPanicTime] = useState('30');

  // lab
  const [labPicked, setLabPicked] = useState(null);
  const [labRevealed, setLabRevealed] = useState(false);
  const [labZoom, setLabZoom] = useState(1);
  const [labTool, setLabTool] = useState(null);

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

  // sync language from prop
  useEffect(() => { if (langProp && langProp !== lang) setLang(langProp); }, [langProp]); // eslint-disable-line

  // ---- mount-only: flag <html> so it paints the landing background
  // (the landing renders before .vmx-app, which normally paints it) and
  // lock scroll to the top so we never open mid-page. Cleaned on unmount
  // so the practice app isn't left with the class. ----
  useEffect(() => {
    document.documentElement.classList.add('lp-active');
    return () => document.documentElement.classList.remove('lp-active');
  }, []);

  // ---- mount: motion prefs, reveal, nav scroll, rotating word, escape ----
  useEffect(() => {
    reduce.current = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const els = Array.from(document.querySelectorAll('.lp-reveal'));
    let io;
    if (reduce.current || !('IntersectionObserver' in window)) {
      els.forEach((e) => e.classList.add('in'));
    } else {
      // Immediately reveal all elements near or above fold
      els.forEach((e) => {
        const r = e.getBoundingClientRect();
        if (e.closest('#lp-top') || e.closest('header') || r.top < window.innerHeight * 1.5) {
          e.classList.add('in');
        }
      });
      io = new IntersectionObserver((ents) => {
        ents.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add('in');
            io.unobserve(en.target);
          }
        });
      }, { threshold: 0, rootMargin: '200px 0px 200px 0px' });
      els.forEach((e) => {
        if (!e.classList.contains('in')) io.observe(e);
      });
    }
    const onScroll = () => setNavScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    let wordTimer;
    if (!reduce.current) wordTimer = setInterval(() => { if (!document.hidden) setHeroWord((w) => (w + 1) % L.heroWords.length); }, 2600);
    const onKey = (e) => { if (e.key === 'Escape') { setLoginOpen(false); setMobileOpen(false); } };
    window.addEventListener('keydown', onKey);
    return () => {
      if (io) io.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('keydown', onKey);
      if (wordTimer) clearInterval(wordTimer);
    };
    // eslint-disable-next-line
  }, [lang]);

  const beep = useCallback(() => {
    if (muted) return;
    try {
      const A = window.AudioContext || window.webkitAudioContext; if (!A) return;
      const ac = new A(); const o = ac.createOscillator(), g = ac.createGain();
      o.frequency.value = 660; g.gain.value = 0.05; o.connect(g); g.connect(ac.destination); o.start();
      g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + 0.18); o.stop(ac.currentTime + 0.2);
    } catch { /* no-op */ }
  }, [muted]);

  const chooseLang = (l) => { setLang(l); onSetLang && onSetLang(l); setMobileOpen(false); };

  // ---- derived ----
  const heroOptions = useMemo(() => buildOptions(HERO_OPTIONS, HERO_ANSWER, heroPicked, heroRevealed), [heroPicked, heroRevealed]);
  const labOptions = useMemo(() => buildOptions(LAB_OPTIONS, LAB_ANSWER, labPicked, labRevealed), [labPicked, labRevealed]);

  const liveYears = YEARS.filter((y) => !y.scaffold).map((y) => y.id);
  // Real subjects are CUVET year-based (no preclinical/paraclinical/clinical
  // grouping in the data), so they always show every live year's subjects.
  // The subjectTab (all/preclinical/…) is a SHOWCASE-only filter — reusing
  // it here would call buildRealSubjects(NaN) for a category tab and blank
  // the grid. Kept independent so switching modes never empties the list.
  const realSubjects = useMemo(() => liveYears.flatMap((y) => buildRealSubjects(y)), []); // eslint-disable-line

  const panic = PANIC_DATA[panicTime] || PANIC_DATA['30'];
  const readinessRing = `conic-gradient(var(--clr-sage) 0% ${READINESS.score}%, var(--clr-surface-2) ${READINESS.score}% 100%)`;

  // ---- interactions (all sims respect reduced-motion) ----
  const onCheckHero = () => { if (heroPicked === null) return; setHeroRevealed(true); beep(); };
  const onCheckLab = () => { if (labPicked === null) return; setLabRevealed(true); beep(); };

  // ---- real login ----
  const openLogin = () => { setLoginError(''); setLoginStep('email'); setLoginOpen(true); setMobileOpen(false); };
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
  const themeIcon = theme === 'dark' ? '☀️' : '🌙';

  // ================= RENDER =================
  return (
    <div className="lp-root">
      <a className="lp-skip" href="#lp-main">Skip to content</a>

      {/* ---- NAV ---- */}
      <header id="vm-nav" className={`lp-nav ${navScrolled ? 'is-scrolled' : ''}`}>
        <div className="lp-pad" style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 16, padding: '11px 24px' }}>
          <a href="#lp-top" style={{ display: 'inline-flex', alignItems: 'center', gap: 9, fontFamily: 'Fraunces, serif', fontWeight: 800, fontSize: 22, letterSpacing: '-.02em', color: 'var(--clr-ink)' }}>
            <img src="/vetmock-logo.svg" width={30} height={30} style={{ borderRadius: 7, display: 'block' }} alt="VetMock logo" />
            Vet<span style={{ color: 'var(--clr-rose-text)', fontStyle: 'italic', fontWeight: 500 }}>Mock</span>
          </a>
          <span className="lp-only-desktop lp-ctx" title="Your study context" style={{ display: 'inline-flex', alignItems: 'center', gap: 7, flexShrink: 0, padding: '6px 11px', marginLeft: 2, border: '1px solid var(--clr-border)', borderRadius: 10, background: 'var(--clr-surface)', fontFamily: 'var(--vmx-mono)', fontSize: 11, color: 'var(--clr-ink-soft)' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--clr-sage)' }} />{t.ctxChip}
          </span>
          <nav className="lp-only-desktop" style={{ display: 'flex', alignItems: 'center', gap: 2, marginLeft: 10 }}>
            {t.nav.map((l) => <a key={l.href} href={l.href} className="lp-navlink">{l.label}</a>)}
          </nav>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 9 }}>
            <div className="lp-only-desktop" style={{ flexShrink: 0, display: 'inline-flex', border: '1px solid var(--clr-border)', borderRadius: 999, overflow: 'hidden' }}>
              <button type="button" aria-pressed={lang === 'en'} onClick={() => chooseLang('en')} style={segStyle(lang === 'en')}>EN</button>
              <button type="button" aria-pressed={lang === 'th'} onClick={() => chooseLang('th')} style={segStyle(lang === 'th')}>ไทย</button>
            </div>
            <button type="button" onClick={() => setMuted((m) => !m)} aria-label={t.muteLabel} className="lp-only-desktop lp-iconbtn" style={{ fontSize: 15 }}>{muted ? '🔇' : '🔊'}</button>
            <button type="button" onClick={onToggleTheme} aria-label="Toggle theme" className="lp-iconbtn" style={{ fontSize: 16 }}>{themeIcon}</button>
            <button type="button" onClick={openLogin} className="lp-only-desktop vmx-btn vmx-btn-ghost vmx-btn-sm" style={{ flexShrink: 0 }}>{t.signIn}</button>
            <button type="button" onClick={onEnterApp} className="vmx-btn vmx-btn-primary vmx-btn-sm" style={{ flexShrink: 0 }}>{t.start}</button>
            <button type="button" className="lp-nav-burger lp-iconbtn" onClick={() => setMobileOpen((o) => !o)} aria-label="Menu" aria-expanded={mobileOpen} style={{ fontSize: 16 }}>☰</button>
          </div>
        </div>
        {mobileOpen && (
          <div className="lp-only-mobile" style={{ flexDirection: 'column', padding: '8px 20px calc(18px + env(safe-area-inset-bottom, 0px))', borderTop: '1px solid var(--clr-border)', gap: 2 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '8px 4px 12px', fontFamily: 'var(--vmx-mono)', fontSize: 11, color: 'var(--clr-ink-soft)', borderBottom: '1px dashed var(--clr-border)', marginBottom: 6 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--clr-sage)' }} />{t.ctxChip}
            </div>
            {t.nav.map((l) => <a key={l.href} href={l.href} onClick={() => setMobileOpen(false)} style={{ padding: '12px 4px', fontSize: 15, fontWeight: 600, color: 'var(--clr-ink)', borderBottom: '1px dashed var(--clr-border)' }}>{l.label}</a>)}
            <div style={{ display: 'flex', gap: 10, marginTop: 14, alignItems: 'center' }}>
              <button type="button" onClick={openLogin} className="vmx-btn vmx-btn-ghost vmx-btn-sm" style={{ flex: 1 }}>{t.signIn}</button>
              <div style={{ flexShrink: 0, display: 'inline-flex', border: '1px solid var(--clr-border)', borderRadius: 999, overflow: 'hidden' }}>
                <button type="button" aria-pressed={lang === 'en'} onClick={() => chooseLang('en')} style={segStyle(lang === 'en')}>EN</button>
                <button type="button" aria-pressed={lang === 'th'} onClick={() => chooseLang('th')} style={segStyle(lang === 'th')}>ไทย</button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* body sections rendered from a dedicated module for readability */}
      <LandingBody
        {...{ t, lang, heroWord, heroOptions, heroPicked, heroRevealed, heroBookmarked, heroConfidence,
          setHeroPicked, setHeroBookmarked, setHeroConfidence, onCheckHero,
          subjectTab, setSubjectTab, showcaseMode, setShowcaseMode, realSubjects,
          panicTime, setPanicTime, panic,
          labOptions, labPicked, labRevealed, labZoom, labTool, setLabPicked, setLabZoom, setLabTool, onCheckLab,
          readinessRing, onEnterApp, onPickSubject, openLogin,
          onStartMockExam, onStartPanic, onOpenLab }}
      />

      {/* ---- Cookie consent (real) ---- */}
      {cookieOpen && (
        <div className="lp-pad" style={{ position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: 95, display: 'flex', justifyContent: 'center', padding: 16, paddingBottom: 'calc(16px + env(safe-area-inset-bottom, 0px))', pointerEvents: 'none' }}>
          <div style={{ pointerEvents: 'auto', width: 430, maxWidth: '100%', background: 'var(--clr-surface)', border: '1px solid var(--clr-border)', borderRadius: 18, boxShadow: 'var(--shadow-lg)', padding: 20, animation: reduce.current ? 'none' : 'lp-rise .5s cubic-bezier(.16,1,.3,1)' }}>
            {!cookiePrefs ? (
              <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                <svg width={46} height={46} viewBox="0 0 44 44" fill="none" style={{ flexShrink: 0, marginTop: 2 }} aria-hidden="true">
                  <circle cx={22} cy={22} r={18} fill="var(--clr-gold-soft)" stroke="var(--clr-gold)" strokeWidth={1.5} />
                  <circle cx={15} cy={17} r={2.4} fill="var(--clr-sage)" /><circle cx={27} cy={14.5} r={2} fill="var(--clr-ink)" />
                  <circle cx={30} cy={26} r={2.6} fill="var(--clr-sage)" /><circle cx={16} cy={28} r={1.8} fill="var(--clr-ink)" />
                  <path d="M18.5 22.5l2.4 2.4 4.4-4.8" stroke="var(--clr-sage)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: 'Fraunces, serif', fontWeight: 600, fontSize: 16, color: 'var(--clr-ink)', marginBottom: 6 }}>{t.ckHead}</div>
                  <p style={{ fontSize: 12.5, lineHeight: 1.55, color: 'var(--clr-ink-soft)', margin: '0 0 14px' }}>{t.ckBody}</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
                    <button type="button" onClick={cookieAccept} className="vmx-btn vmx-btn-primary vmx-btn-sm">{t.ckAccept}</button>
                    <button type="button" onClick={cookieEssential} className="vmx-btn vmx-btn-ghost vmx-btn-sm">{t.ckEssential}</button>
                    <button type="button" onClick={() => setCookiePrefs(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 12.5, fontWeight: 600, color: 'var(--clr-sage)', padding: '8px 4px' }}>{t.ckPrefs}</button>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <div style={{ fontFamily: 'Fraunces, serif', fontWeight: 600, fontSize: 16, color: 'var(--clr-ink)', marginBottom: 8 }}>{t.ckPrefs}</div>
                <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '12px 0', borderTop: '1px dashed var(--clr-border)' }}>
                  <div style={{ flex: 1 }}><div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--clr-ink)' }}>{t.ckEssentialT}</div><div style={{ fontSize: 12, color: 'var(--clr-ink-soft)', lineHeight: 1.5 }}>{t.ckEssentialD}</div></div>
                  <span style={{ fontFamily: 'var(--vmx-mono)', fontSize: 10, color: 'var(--clr-sage)', flexShrink: 0, marginTop: 3 }}>{t.ckAlways}</span>
                </div>
                <CookieRow title={t.ckAnalyticsT} desc={t.ckAnalyticsD} on={cAnalytics} onToggle={() => setCAnalytics((v) => !v)} />
                <CookieRow title={t.ckPersonalT} desc={t.ckPersonalD} on={cPersonal} onToggle={() => setCPersonal((v) => !v)} border />
                <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
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
        <div onClick={() => setLoginOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(43,36,25,.5)', zIndex: 110, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'max(20px, env(safe-area-inset-top, 0px)) 20px max(20px, env(safe-area-inset-bottom, 0px))' }}>
          <div onClick={(e) => e.stopPropagation()} className="lp-stack" role="dialog" aria-modal="true" aria-label={t.lgHead} style={{ width: 800, maxWidth: '100%', maxHeight: '92dvh', overflow: 'auto', background: 'var(--clr-surface)', border: '1px solid var(--clr-border)', borderRadius: 20, boxShadow: 'var(--shadow-lg)', display: 'grid', gridTemplateColumns: '1fr 1fr', animation: reduce.current ? 'none' : 'lp-rise .45s cubic-bezier(.16,1,.3,1)' }}>
            <div className="lp-hide-md" style={{ background: 'var(--clr-bg)', borderRight: '1px solid var(--clr-border)', padding: 26, display: 'flex', flexDirection: 'column', gap: 14 }}>
              <span style={{ fontFamily: 'var(--vmx-mono)', fontSize: 10, textTransform: 'uppercase', color: 'var(--clr-ink-soft)' }}>{t.lgReturn}</span>
              <div style={{ background: 'var(--clr-surface)', border: '1px solid var(--clr-border)', borderRadius: 14, padding: 18 }}>
                <div style={{ fontFamily: 'Fraunces, serif', fontWeight: 600, fontSize: 16, color: 'var(--clr-ink)', marginBottom: 10 }}>Canine Endocrinology</div>
                <div style={{ fontFamily: 'var(--vmx-mono)', fontSize: 11, color: 'var(--clr-ink-soft)', marginBottom: 8 }}>{t.lgReturnCase}</div>
                <div className="vmx-bar"><div className="vmx-bar-fill" style={{ width: '58%' }} /></div>
              </div>
              <div style={{ fontFamily: 'Fraunces, serif', fontStyle: 'italic', fontSize: 13, color: 'var(--clr-ocean)' }}>“I always mix these two up.”</div>
              <div style={{ marginTop: 'auto', fontFamily: 'var(--vmx-mono)', fontSize: 11, color: 'var(--clr-ink-soft)' }}>{t.lgCtx}</div>
            </div>
            <div style={{ padding: 26, display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontFamily: 'Fraunces, serif', fontWeight: 800, fontSize: 20 }}>Vet<span style={{ color: 'var(--clr-rose-text)', fontStyle: 'italic', fontWeight: 500 }}>Mock</span></span>
                <button type="button" onClick={() => setLoginOpen(false)} aria-label="Close" className="lp-iconbtn" style={{ width: 34, height: 34, fontSize: 14, background: 'var(--clr-bg)' }}>✕</button>
              </div>
              {loginStep === 'email' ? (
                <div>
                  <h3 style={{ fontFamily: 'Fraunces, serif', fontWeight: 600, fontSize: 22, letterSpacing: '-.01em', color: 'var(--clr-ink)', margin: '0 0 6px' }}>{t.lgHead}</h3>
                  <p style={{ fontSize: 14, lineHeight: 1.55, color: 'var(--clr-ink-soft)', margin: '0 0 18px' }}>{t.lgBody}</p>
                  <button type="button" onClick={doGoogle} className="vmx-btn vmx-btn-ghost" style={{ width: '100%', justifyContent: 'center' }}>{t.lgGoogle}</button>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '14px 0', color: 'var(--clr-ink-soft)', fontSize: 11, fontFamily: 'var(--vmx-mono)' }}><span style={{ flex: 1, height: 1, background: 'var(--clr-border)' }} />{t.lgOr}<span style={{ flex: 1, height: 1, background: 'var(--clr-border)' }} /></div>
                  <label htmlFor="vm-login-email" style={{ fontSize: 12, fontWeight: 600, color: 'var(--clr-ink)', display: 'block', marginBottom: 6 }}>{t.lgEmailLabel}</label>
                  <input id="vm-login-email" type="email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} placeholder="you@example.com" className="vmx-fill-input" style={{ marginBottom: loginError ? 6 : 12 }} onKeyDown={(e) => { if (e.key === 'Enter') doMagic(); }} />
                  {loginError && <div role="alert" style={{ fontSize: 12, color: 'var(--clr-rose-text)', margin: '0 0 12px', lineHeight: 1.4 }}>{loginError}</div>}
                  <button type="button" onClick={doMagic} disabled={loginSending} className="vmx-btn vmx-btn-primary" style={{ width: '100%', justifyContent: 'center', marginBottom: 10 }}>{loginSending ? t.lgSending : t.lgSend}</button>
                  <button type="button" onClick={() => { setLoginOpen(false); onOpenAuth && onOpenAuth(); }} className="vmx-btn vmx-btn-ghost vmx-btn-sm" style={{ width: '100%', justifyContent: 'center', marginBottom: 6 }}>{t.lgPassword}</button>
                  <button type="button" onClick={() => setLoginOpen(false)} className="vmx-btn vmx-btn-ghost vmx-btn-sm" style={{ width: '100%', justifyContent: 'center' }}>{t.lgGuest}</button>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginTop: 14, fontSize: 11, color: 'var(--clr-sage)', fontFamily: 'var(--vmx-mono)' }}><span>✓</span>{t.lgSaved}</div>
                  <p style={{ fontSize: 11, color: 'var(--clr-ink-soft)', margin: '8px 0 0', lineHeight: 1.5 }}>{t.lgIndependent}</p>
                </div>
              ) : (
                <div>
                  <h3 style={{ fontFamily: 'Fraunces, serif', fontWeight: 600, fontSize: 22, letterSpacing: '-.01em', color: 'var(--clr-ink)', margin: '0 0 6px' }}>{t.lgSentHead}</h3>
                  <p style={{ fontSize: 14, lineHeight: 1.55, color: 'var(--clr-ink-soft)', margin: '0 0 18px' }}>{t.lgSentBody} <strong style={{ color: 'var(--clr-ink)' }}>{loginEmail}</strong>. {t.lgSentHint}</p>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '16px 18px', borderRadius: 12, background: 'var(--clr-bg)', border: '1px solid var(--clr-border)', marginBottom: 16 }}>
                    <span style={{ fontSize: 26 }}>📬</span>
                    <span style={{ fontSize: 13, color: 'var(--clr-ink-soft)', lineHeight: 1.5 }}>{t.lgSentTip}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 16 }}>
                    <button type="button" onClick={doMagic} disabled={loginSending} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12.5, fontWeight: 600, color: 'var(--clr-sage)', padding: 0, fontFamily: 'inherit' }}>{loginSending ? t.lgSending : t.lgResend}</button>
                    <button type="button" onClick={() => { setLoginStep('email'); setLoginError(''); }} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12.5, color: 'var(--clr-ink-soft)', padding: 0, fontFamily: 'inherit' }}>{t.lgBack}</button>
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

// small helpers kept local to the view
function segStyle(active) {
  return { padding: '6px 12px', border: 'none', background: active ? 'var(--clr-ink)' : 'transparent', color: active ? 'var(--clr-bg)' : 'var(--clr-ink-soft)', fontFamily: 'var(--vmx-mono)', fontSize: 11, fontWeight: 600, cursor: 'pointer', minHeight: 32 };
}
function CookieRow({ title, desc, on, onToggle, border }) {
  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '12px 0', borderTop: '1px dashed var(--clr-border)', ...(border ? { borderBottom: '1px dashed var(--clr-border)', marginBottom: 14 } : {}) }}>
      <div style={{ flex: 1 }}><div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--clr-ink)' }}>{title}</div><div style={{ fontSize: 12, color: 'var(--clr-ink-soft)', lineHeight: 1.5 }}>{desc}</div></div>
      <button type="button" role="switch" aria-checked={on} aria-label={title} onClick={onToggle} className={`vmx-toggle ${on ? 'on' : ''}`} style={{ flexShrink: 0, marginTop: 2 }} />
    </div>
  );
}

