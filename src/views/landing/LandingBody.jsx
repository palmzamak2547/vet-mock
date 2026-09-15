// ============================================================
// LandingBody — hero → footer for LandingView
// ============================================================
// Rebuilt 2026-09-15. What it replaced was twelve sections in one rhythm
// (label, headline with one italic word, three cards) carrying a fake 72%
// readiness gauge, a fake dashboard, invented weakness cards and emoji for
// icons — the SaaS template, in Thai that had been translated rather than
// spoken. Seven sections now, no two alike, and nothing on the page is a
// typed-in number: counts come from q-counts.js, dates from the timetable.
//
// Real, wired to existing systems: sign-in, the subject grid, every CTA,
// the countdown (faculty timetable via exam-countdown.js). Interactive
// examples that never touch progress: the hero question and the lab
// station. Art slots A1 to A6 are reserved for the illustrated set Palm is
// generating; the layout stands without them.
//
// Receives everything as props from LandingView (single state owner).
// ============================================================

import { useEffect, useRef, useState } from 'react';
import Mochi from '../../components/Mochi.jsx';
import NavIcon from '../../components/NavIcon.jsx';
import { QB_TOTAL, Q_COUNTS_BY_SUBJECT, Q_PANIC_COUNTS_BY_SUBJECT, Q_PAST_PAPER_COUNTS_BY_TOPIC } from '../../data/q-counts.js';
import { SUBJECTS_BY_YEAR } from '../../data/curriculum.js';
import { SEMESTER } from '../../data/semester.js';
import { facultyExamWindow, splitCountdown } from '../../lib/exam-countdown.js';

// Derived once at module load, regenerated with the bank, so it cannot drift.
const SUBJECTS_WITH_QUESTIONS = Object.values(Q_COUNTS_BY_SUBJECT).filter((n) => n > 0).length;
const PAST_PAPER_TOTAL = Object.values(Q_PAST_PAPER_COUNTS_BY_TOPIC)
  .reduce((sum, byTopic) => sum + Object.values(byTopic).reduce((a, b) => a + b, 0), 0);
const SUBJECTS_WITH_PAST_PAPERS = Object.values(Q_PANIC_COUNTS_BY_SUBJECT).filter((n) => n > 0).length;
const ALL_SUBJECTS = Object.values(SUBJECTS_BY_YEAR).flat();
const subjectName = (id) => ALL_SUBJECTS.find((s) => s.id === id)?.name || id;
const two = (n) => String(n).padStart(2, '0');

function OptionRow({ opt, onClick, disabled }) {
  return (
    <button type="button" className={`vmx-option ${opt.cls}`} style={opt.style} onClick={onClick} disabled={disabled}>
      <span className="vmx-option-letter">{opt.letter}</span>
      <span className="vmx-option-text">{opt.text}</span>
      {opt.mark && <span style={opt.markStyle}>{opt.mark}</span>}
    </button>
  );
}

// Thai headlines: no negative tracking (it makes glyphs collide) and a line
// height with room for a stacked vowel and tone mark under the descender of
// the line above. 1.15 is the app's own h1 value; 1.06 clipped "ครึ่ง" into "รุ่ง".
const h2 = { fontFamily: 'var(--vmx-display)', fontWeight: 500, fontSize: 'clamp(28px,4vw,42px)', lineHeight: 1.2, letterSpacing: 0, color: 'var(--clr-ink)', margin: 0, textWrap: 'balance' };
const em = { fontStyle: 'italic', fontWeight: 400, color: 'var(--clr-sage-text)' };
const container = { maxWidth: 1200, margin: '0 auto' };
const chip = (active) => `vmx-chip${active ? ' active' : ''}`;

/** Wall clock once a second, paused while the tab is hidden. */
function useNow() {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    let id = 0;
    const stop = () => { if (id) { window.clearInterval(id); id = 0; } };
    const start = () => { stop(); setNow(Date.now()); id = window.setInterval(() => setNow(Date.now()), 1000); };
    const onVisibility = () => (document.hidden ? stop() : start());
    start();
    document.addEventListener('visibilitychange', onVisibility);
    return () => { stop(); document.removeEventListener('visibilitychange', onVisibility); };
  }, []);
  return now;
}

/** Count up from 0 the first time the element is on screen. Reduced motion
 *  shows the final value at once. */
function useCountUp(target, ref) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduced || typeof IntersectionObserver === 'undefined') { setValue(target); return undefined; }
    let raf = 0;
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      io.disconnect();
      const t0 = performance.now();
      const tick = (t) => {
        const p = Math.min(1, (t - t0) / 900);
        const eased = 1 - (1 - p) * (1 - p) * (1 - p);
        setValue(Math.round(target * eased));
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, { threshold: 0.4 });
    if (ref.current) io.observe(ref.current);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [target, ref]);
  return value;
}

/* ---- Countdown: the FACULTY exam week, live, with no year in it ----
   A signed-out reader has no year yet. Every year sits the same week, so the
   page counts to the week the faculty published, and tells the reader that
   their own papers appear once they pick a year inside the app. Palm, on
   the first cut that said "CUVET86": "ปีอื่นเข้ามาเห็นละ จะไม่งงหรอ". */
function Countdown({ t, variant = 'hero' }) {
  const now = useNow();
  const w = facultyExamWindow(new Date(now));
  if (!w) return null;
  const c = splitCountdown(w.targetMs - now);
  const cells = [c.days, c.hours, c.minutes, c.seconds];
  const term = w.during ? `${t.cdDuring}${w.label}` : w.label;
  const line = w.during ? t.cdDuringLine : variant === 'night' ? t.cdPanicLine : t.cdLine;
  return (
    <div className={`lp-countdown is-${variant}${w.during ? ' is-sitting' : ''}`} role="group" aria-label={`${term} ${SEMESTER.short}, ${w.range}, ${line}`}>
      <div className="lp-countdown-head">
        <span className="lp-countdown-term">{term} {SEMESTER.short}</span>
        <span className="lp-countdown-range">{w.range}</span>
      </div>
      <div className="lp-countdown-cells" aria-hidden="true">
        {cells.map((v, i) => (
          <span key={t.cdUnits[i]} className="lp-countdown-cell">
            <b>{i === 0 ? v : two(v)}</b>
            <i>{t.cdUnits[i]}</i>
          </span>
        ))}
      </div>
      <p className="lp-countdown-line">{line}</p>
    </div>
  );
}

export default function LandingBody(p) {
  const { t } = p;
  return (
    <main id="lp-main">
      {/* ================= HERO ================= */}
      {/* Art slot A1 (the study-desk scene) is decided once the art exists —
          the live question card stays the hero object until then. */}
      <section id="lp-top" data-screen-label="Hero" className="lp-pad" style={{ padding: '64px 24px 72px', scrollMarginTop: 80, position: 'relative', overflow: 'hidden' }}>
        <div className="lp-stack" style={{ ...container, display: 'grid', gridTemplateColumns: '1.02fr 1.12fr', gap: 54, alignItems: 'center' }}>
          <div className="lp-reveal lp-center-md">
            <div className="lp-hero-eyebrow">
              <Mochi state="wave" size={32} animate slot="landing-welcome" />{t.heroEyebrow}
            </div>
            <h1 className="lp-hero-title">
              {t.heroPre}<em style={em}>{t.heroEm}</em>{t.heroPost}
            </h1>
            <p style={{ fontSize: 17, lineHeight: 1.62, color: 'var(--clr-ink-soft)', maxWidth: '50ch', margin: '0 0 24px' }}>{t.heroSub}</p>
            <div className="lp-center-md lp-flex" style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 26 }}>
              <button type="button" onClick={p.onEnterApp} className="vmx-btn vmx-btn-primary lp-feature-cta" style={{ fontSize: 15, padding: '15px 26px' }}>{t.heroCta1} <span style={{ fontFamily: 'var(--vmx-mono)' }}>→</span></button>
              <a href="#subjects" className="vmx-btn vmx-btn-ghost" style={{ fontSize: 15, padding: '15px 26px' }}>{t.heroCta2}</a>
            </div>
            <Countdown t={t} variant="hero" />
          </div>

          {/* hero exam preview — real bank classes, non-scoring */}
          <div className="lp-reveal" style={{ position: 'relative' }}>
            <div className="lp-stack" style={{ position: 'relative', zIndex: 2, display: 'flex', gap: 14, alignItems: 'stretch' }}>
              <div className="vmx-question-card" style={{ flex: 1, minWidth: 0, padding: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 14, paddingBottom: 14, borderBottom: '1px dashed var(--clr-border)' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontFamily: 'var(--vmx-mono)', fontSize: 11, fontWeight: 600, padding: '4px 9px', borderRadius: 999, background: 'color-mix(in srgb, var(--clr-sage) 12%, transparent)', color: 'var(--clr-sage-text)', flexShrink: 0 }}>✓ {t.heroBankLabel}</span>
                  <span style={{ flex: 1, minWidth: 0, fontFamily: 'var(--vmx-mono)', fontSize: 11.5, color: 'var(--clr-ink-soft)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.heroBankLine}</span>
                  <button type="button" onClick={p.onEnterApp} style={{ flexShrink: 0, padding: '6px 13px', borderRadius: 999, border: 'none', background: 'var(--clr-sage)', color: 'var(--clr-surface)', fontFamily: 'inherit', fontSize: 12, fontWeight: 600, cursor: 'pointer', minHeight: 32 }}>{t.startPractice}</button>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                  <span className="vmx-qtype-badge" style={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>MCQ — {t.heroTag}</span>
                  <span className="vmx-timer" style={{ marginLeft: 'auto', flexShrink: 0 }}>01:24</span>
                  {/* the app's .vmx-bookmark-btn is position:absolute in the
                      exam view; inline here, so force it back into flow. */}
                  <button
                    type="button"
                    className={`vmx-bookmark-btn ${p.heroBookmarked ? 'active' : ''}`}
                    style={{ position: 'static', flexShrink: 0 }}
                    onClick={() => p.setHeroBookmarked((bookmarked) => !bookmarked)}
                    aria-label={p.heroBookmarked ? t.unbookmark : t.bookmark}
                    aria-pressed={p.heroBookmarked}
                  >
                    <NavIcon name="bookmark" size={18} filled={p.heroBookmarked} />
                  </button>
                </div>
                <div className="vmx-progress-bar" style={{ marginBottom: 16 }}><div className="vmx-progress-fill" style={{ width: '20%' }} /></div>
                <div className="vmx-qtext" style={{ marginBottom: 18 }}>{t.heroQ}</div>
                <div className="vmx-options" style={{ marginBottom: 18 }}>
                  {p.heroOptions.map((opt, i) => <OptionRow key={i} opt={opt} onClick={() => { if (!p.heroRevealed) p.setHeroPicked(i); }} />)}
                </div>
                <div style={{ marginBottom: 6 }}>
                  <div style={{ fontSize: 12, color: 'var(--clr-ink-soft)', marginBottom: 8 }}>{t.heroConfQ}</div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {t.conf.map((c, i) => <button key={i} type="button" className={chip(p.heroConfidence === i)} style={{ minHeight: 36, padding: '7px 14px' }} onClick={() => p.setHeroConfidence(i)}>{c}</button>)}
                  </div>
                </div>
                {p.heroRevealed && <div className="vmx-explain" style={{ marginTop: 16 }}><span className="k">{t.why}</span>{t.heroExplain}</div>}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 16 }}>
                  {p.heroRevealed
                    ? <span style={{ fontFamily: 'var(--vmx-mono)', fontSize: 13, fontWeight: 700, color: p.heroPicked === 1 ? 'var(--clr-sage-text)' : 'var(--clr-rose-text)' }}>{p.heroPicked === 1 ? `✓ ${t.correct}` : `✗ ${t.wrong}`}</span>
                    : <span style={{ fontFamily: 'var(--vmx-mono)', fontSize: 11, color: 'var(--clr-ink-soft)' }}>{t.demoNote}</span>}
                  <button type="button" className="vmx-btn vmx-btn-primary" style={{ marginLeft: 'auto' }} disabled={p.heroPicked === null || p.heroRevealed} onClick={p.onCheckHero}>{t.check}</button>
                </div>
              </div>
              {/* mini exam navigator (desktop only) */}
              <div className="lp-hide-md" style={{ width: 120, flexShrink: 0, background: 'var(--clr-surface)', border: '1px solid var(--clr-border)', borderRadius: 16, padding: 14, display: 'flex', flexDirection: 'column', gap: 11 }}>
                <div style={{ fontFamily: 'var(--vmx-display)', fontWeight: 600, fontSize: 13, color: 'var(--clr-ink)' }}>{t.navTitle}</div>
                <div style={{ fontFamily: 'var(--vmx-mono)', fontSize: 22, fontWeight: 600, color: 'var(--clr-ink)', lineHeight: 1 }}>04<span style={{ fontSize: 13, color: 'var(--clr-ink-soft)' }}> / 20</span></div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 5 }}>
                  {Array.from({ length: 20 }).map((_, i) => {
                    const base = { aspectRatio: '1', borderRadius: 5, border: '1px solid var(--clr-border)', fontFamily: 'var(--vmx-mono)', fontSize: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--clr-surface-2)', color: 'var(--clr-ink-soft)' };
                    let st = base;
                    if (i < 3) st = { ...base, background: 'var(--clr-sage)', color: 'var(--clr-surface)', borderColor: 'var(--clr-sage)' };
                    else if (i === 3) st = { ...base, background: 'var(--clr-ink)', color: 'var(--clr-bg)', borderColor: 'var(--clr-ink)' };
                    else if (i === 7) st = { ...base, background: 'var(--clr-gold)', color: 'var(--clr-gold-on)', borderColor: 'var(--clr-gold)' };
                    return <div key={i} style={st}>{i + 1}</div>;
                  })}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontFamily: 'var(--vmx-mono)', fontSize: 9, color: 'var(--clr-ink-soft)', marginTop: 2 }}>
                  {[[t.legAnswered, 'var(--clr-sage)'], [t.legCurrent, 'var(--clr-ink)'], [t.legFlagged, 'var(--clr-gold)']].map(([lbl, c]) => (
                    <span key={lbl} style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ width: 9, height: 9, borderRadius: 3, background: c }} />{lbl}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= PROOF: real numbers, real subjects ================= */}
      <ProofBand p={p} />

      {/* ================= THREE THINGS ================= */}
      <ThreeThings p={p} />

      {/* ================= PANIC MODE ================= */}
      <PanicBand p={p} />

      {/* ================= SUBJECTS (real + showcase) ================= */}
      <SubjectsSection p={p} />

      {/* ================= LAB SIMULATION ================= */}
      <LabSection p={p} />

      {/* ================= YOUR HOME (real screenshot) ================= */}
      <section id="progress" data-screen-label="Your home" className="lp-pad" style={{ padding: '92px 24px', scrollMarginTop: 80 }}>
        <div className="lp-stack lp-home-grid" style={{ ...container, display: 'grid', gridTemplateColumns: '0.9fr 1.3fr', gap: 44, alignItems: 'center' }}>
          <div className="lp-reveal">
            <h2 style={h2}>{t.progHead}</h2>
            <p style={{ fontSize: 16, lineHeight: 1.6, color: 'var(--clr-ink-soft)', maxWidth: '46ch', margin: '16px 0 22px' }}>{t.progSub}</p>
            <button type="button" onClick={p.onEnterApp} className="vmx-btn vmx-btn-primary" style={{ fontSize: 15, padding: '14px 24px' }}>{t.start} →</button>
          </div>
          <figure className="lp-reveal lp-shot">
            <img src="/images/landing/home-desktop.jpg" width={1024} height={560} alt={t.progAlt} loading="lazy" decoding="async" />
            <figcaption>{t.progCaption}</figcaption>
          </figure>
        </div>
      </section>

      {/* ================= FINAL CTA ================= */}
      {/* Art slot A4 (the procession) walks in along the bottom edge once it exists. */}
      <section id="cta" data-screen-label="Final CTA" className="lp-pad" style={{ padding: '40px 24px 100px', scrollMarginTop: 80 }}>
        {/* The panel is the FIRST child div of .lp-reveal: styles-landing.css
            draws the gradient edge and the ink fill on `#cta .lp-reveal > div`.
            Putting lp-reveal on the panel itself handed that treatment to the
            Mochi wrapper instead — a bordered strip around the mascot. */}
        <div className="lp-reveal" style={{ maxWidth: 920, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', background: 'var(--clr-ink)', borderRadius: 26, padding: '52px 40px 58px' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
              <Mochi state="wave" size={88} animate slot="landing-cta" />
            </div>
            <h2 style={{ fontFamily: 'var(--vmx-display)', fontWeight: 500, fontSize: 'clamp(30px,4.5vw,46px)', lineHeight: 1.2, letterSpacing: 0, color: 'var(--clr-bg)', margin: '0 0 26px', textWrap: 'balance' }}>{t.ctaPre}<em style={{ fontStyle: 'italic', fontWeight: 400, color: 'var(--clr-sage-soft)' }}>{t.ctaEm}</em>{t.ctaPost}</h2>
            <button type="button" onClick={p.onEnterApp} className="vmx-btn" style={{ background: 'var(--clr-surface)', color: 'var(--clr-ink)', fontSize: 15, padding: '15px 28px' }}>{t.cta1} →</button>
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer data-screen-label="Footer" className="lp-pad" style={{ padding: '52px 24px 40px', borderTop: '1px solid var(--clr-border)' }}>
        <div style={container}>
          <div className="lp-stack" style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 30, alignItems: 'start', marginBottom: 36 }}>
            <div>
              <a href="#lp-top" style={{ display: 'inline-flex', alignItems: 'center', gap: 9, fontFamily: 'var(--vmx-display)', fontWeight: 800, fontSize: 22, letterSpacing: '-.02em', color: 'var(--clr-ink)', marginBottom: 12 }}>
                <img src="/vetmock-logo.svg" width={28} height={28} style={{ borderRadius: 7, display: 'block' }} alt="VetMock logo" />
                Vet<span style={{ color: 'var(--clr-rose-text)', fontStyle: 'italic', fontWeight: 500 }}>Mock</span>
              </a>
              <p style={{ fontFamily: 'var(--vmx-display)', fontStyle: 'italic', fontSize: 15, color: 'var(--clr-ink-soft)', margin: '0 0 8px' }}>{t.footTagline}</p>
              <p style={{ fontSize: 12.5, lineHeight: 1.55, color: 'var(--clr-ink-soft)', maxWidth: '46ch', margin: 0 }}>{t.footIndependent}</p>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px 28px' }}>
              <a href="/app/privacy" style={{ minHeight: 44, display: 'inline-flex', alignItems: 'center' }}>ข้อมูลและความเป็นส่วนตัว</a>
              {t.footLinks.map((l) => <a key={l.label} href={l.href} style={{ fontSize: 13.5, color: 'var(--clr-ink-soft)' }}>{l.label}</a>)}
            </div>
          </div>
          <div style={{ paddingTop: 20, borderTop: '1px dashed var(--clr-border)', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 8, fontFamily: 'var(--vmx-mono)', fontSize: 12, color: 'var(--clr-ink-soft)' }}>
            <span>{t.copyright}</span>
            <span>Practice before the real exam.</span>
          </div>
        </div>
      </footer>
    </main>
  );
}

/* ---- Proof band: three counted-up numbers and a marquee of real subjects ---- */
function ProofBand({ p }) {
  const { t } = p;
  const ref = useRef(null);
  const total = useCountUp(QB_TOTAL, ref);
  const past = useCountUp(PAST_PAPER_TOTAL, ref);
  const subjects = useCountUp(SUBJECTS_WITH_QUESTIONS, ref);
  const chips = p.realSubjects;
  return (
    <section id="proof" data-screen-label="Proof" className="lp-proof" aria-label={t.proofMarqueeLabel}>
      <div className="lp-pad" style={{ ...container, padding: '0 24px' }}>
        <div ref={ref} className="lp-proof-stats">
          <span><b>{total.toLocaleString('en-US')}</b><i>{t.proofQuestions}</i></span>
          <span><b>{past.toLocaleString('en-US')}</b><i>{t.proofPast}</i></span>
          <span><b>{subjects}</b><i>{t.proofSubjects}</i></span>
        </div>
      </div>
      {/* Two copies of the row make the loop seamless; the second is hidden
          from assistive tech and, under reduced motion, from everyone. The
          viewport is a real horizontal scroller (overflow-x: auto, scrollbar
          hidden), not overflow: hidden — the mobile audit exempts children of
          a scroller that fits the screen, and clipping would have reported
          every off-screen chip as an overflow. */}
      <div className="lp-marquee-viewport">
        <div className="lp-marquee">
          {[0, 1].map((copy) => (
            <div key={copy} className="lp-marquee-track" aria-hidden={copy === 1 ? 'true' : undefined} data-copy={copy}>
              {chips.map((s) => (
                <button key={`${copy}-${s.id}`} type="button" className="lp-marquee-chip" style={{ '--chip-color': s.color }} onClick={() => p.onPickSubject(s.year, s.id)} tabIndex={copy === 1 ? -1 : 0}>
                  <span className="lp-marquee-dot" />
                  <span className="lp-marquee-name">{s.name}</span>
                  <span className="lp-marquee-count">{s.count} {t.qWord}</span>
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---- Three things: numbered, each with a live piece of the real product ---- */
function ThreeThings({ p }) {
  const { t } = p;
  const topPast = Object.entries(Q_PANIC_COUNTS_BY_SUBJECT)
    .filter(([, n]) => n > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);
  const visuals = [
    // 01 — which subjects hold the most past-paper questions, today
    <div key="v1" className="lp-three-card">
      <div className="lp-three-card-label">{t.threePastLabel}</div>
      {topPast.map(([id, n], i) => (
        <div key={id} className="lp-three-row" style={{ '--i': i }}>
          <span className="lp-three-row-name">{subjectName(id)}</span>
          <span className="lp-three-row-bar"><span style={{ width: `${Math.round((n / topPast[0][1]) * 100)}%` }} /></span>
          <span className="lp-three-row-n">{n}</span>
        </div>
      ))}
    </div>,
    // 02 — an explanation the way the app writes them, and the slide button
    <div key="v2" className="lp-three-card">
      <div className="vmx-explain" style={{ marginTop: 0 }}><span className="k">{t.why}</span>{t.heroExplain}</div>
      <button type="button" className="vmx-btn vmx-btn-ghost vmx-btn-sm" style={{ marginTop: 12 }} onClick={p.onEnterApp}>
        <NavIcon name="files" size={16} /> {t.threeSlideBtn}
      </button>
    </div>,
    // 03 — the time chips, live, and the real count for the paper that is next
    <div key="v3" className="lp-three-card">
      <div className="lp-three-card-label">{t.panicTimeQ}</div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {t.panicTimes.map((pt) => <button key={pt.key} type="button" className={chip(p.panicTime === pt.key)} onClick={() => p.setPanicTime(pt.key)}>{pt.label}</button>)}
      </div>
      <p className="lp-three-note">{t.threePanicLine(PAST_PAPER_TOTAL, SUBJECTS_WITH_PAST_PAPERS)}</p>
      <a href="#panic" className="lp-three-link">{t.panicCta} →</a>
    </div>,
  ];
  return (
    <section id="solution" data-screen-label="Three things" className="lp-pad" style={{ padding: '96px 24px 80px', scrollMarginTop: 80 }}>
      <div style={container}>
        <h2 className="lp-reveal" style={{ ...h2, marginBottom: 48 }}>{t.threeHead}</h2>
        <ol className="lp-three">
          {t.three.map((item, i) => (
            <li key={item.title} className="lp-reveal lp-three-item">
              <span className="lp-three-num" aria-hidden="true">{two(i + 1)}</span>
              <div className="lp-three-copy">
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </div>
              <div className="lp-three-visual">{visuals[i]}</div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ---- Panic Mode: the night before, as a dark band ---- */
function PanicBand({ p }) {
  const { t } = p;
  return (
    <section id="panic" data-screen-label="Panic Mode" className="lp-pad" style={{ padding: '0 24px 92px', scrollMarginTop: 80 }}>
      {/* Art slot A2 (the 2 a.m. window) becomes this band's backdrop, two layers. */}
      <div className="lp-reveal lp-panic" style={container}>
        <div className="lp-stack lp-panic-grid">
          <div>
            <h2 className="lp-panic-head">{t.panicHead}</h2>
            <p className="lp-panic-calm">{t.panicCalm}</p>
            <p className="lp-panic-desc">{t.panicDesc}</p>
            <div style={{ margin: '22px 0 20px' }}>
              <div className="lp-panic-q">{t.panicTimeQ}</div>
              <div style={{ display: 'flex', gap: 9, flexWrap: 'wrap' }}>
                {t.panicTimes.map((pt) => <button key={pt.key} type="button" className={`lp-panic-chip${p.panicTime === pt.key ? ' active' : ''}`} onClick={() => p.setPanicTime(pt.key)}>{pt.label}</button>)}
              </div>
            </div>
            {/* Runs a REAL cram session sized to the time just picked. */}
            <button type="button" onClick={() => (p.onStartPanic ? p.onStartPanic(p.panicTime) : p.onEnterApp())} className="vmx-btn" style={{ background: 'var(--clr-gold)', color: 'var(--clr-gold-on)', fontSize: 15, padding: '15px 26px' }}>{t.panicCta} →</button>
          </div>
          <div className="lp-panic-side">
            <Countdown t={t} variant="night" />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---- Subjects (real curriculum + showcase toggle) ---- */
function SubjectsSection({ p }) {
  const { t } = p;
  const showcase = p.showcaseMode;
  const cards = showcase
    ? SHOWCASE_FILTER(p.subjectTab)
    : p.realSubjects;
  return (
    <section id="subjects" data-screen-label="Subjects" className="lp-pad" style={{ padding: '92px 24px', scrollMarginTop: 80, background: 'var(--clr-surface)', borderTop: '1px dashed var(--clr-border)' }}>
      <div style={container}>
        <div className="lp-reveal" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', gap: 22, marginBottom: 30 }}>
          <div style={{ maxWidth: 620 }}>
            <h2 style={h2}>{t.subjPre}<em style={em}>{t.subjEm}</em>{t.subjPost}</h2>
            <p style={{ fontSize: 16, lineHeight: 1.6, color: 'var(--clr-ink-soft)', maxWidth: '52ch', margin: '14px 0 4px' }}>{t.subjSub}</p>
            <p style={{ fontSize: 13, color: showcase ? 'var(--clr-ink-soft)' : 'var(--clr-sage-text)', margin: 0, fontWeight: 500 }}>{showcase ? t.subjShowcaseNote : t.subjRealNote}</p>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button type="button" className={`vmx-nav-btn ${!showcase ? 'active' : ''}`} style={{ minHeight: 38 }} onClick={() => p.setShowcaseMode(false)}>{t.subjToggleReal}</button>
            <button type="button" className={`vmx-nav-btn ${showcase ? 'active' : ''}`} style={{ minHeight: 38 }} onClick={() => p.setShowcaseMode(true)}>{t.subjToggleShowcase}</button>
          </div>
        </div>
        {showcase && (
          <div className="lp-reveal" style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
            {t.tabs.map((tb) => <button key={tb.key} type="button" className={`vmx-nav-btn ${p.subjectTab === tb.key ? 'active' : ''}`} style={{ minHeight: 38 }} onClick={() => p.setSubjectTab(tb.key)}>{tb.label}</button>)}
          </div>
        )}
        <div className="lp-reveal" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(208px,1fr))', gap: 14 }}>
          {cards.map((s) => {
            const clickable = !showcase && s.hasQ;
            return (
              <div key={s.id || s.name} className="vmx-subject-card" tabIndex={0} role={clickable ? 'button' : undefined}
                onClick={clickable ? () => p.onPickSubject(s.year, s.id) : undefined}
                onKeyDown={clickable ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); p.onPickSubject(s.year, s.id); } } : undefined}
                style={clickable ? { cursor: 'pointer' } : undefined}>
                <span className="accent" style={{ background: s.color }} />
                <span className="icon">{s.emoji}</span>
                <span className="title">{s.name}</span>
                <span className="sub">{s.sub}</span>
                <span className="count">{showcase ? '' : `${s.count} ${t.qWord}`}</span>
                {clickable && <span style={{ fontFamily: 'var(--vmx-mono)', fontSize: 11, color: 'var(--clr-sage-text)', marginTop: 2 }}>{t.startPractice} →</span>}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

const SHOWCASE = [
  { emoji: '🦴', name: 'Anatomy', sub: 'Gross & Systemic', color: '#4a6b4a', group: 'preclinical' },
  { emoji: '🫀', name: 'Physiology', sub: 'Body Systems', color: '#3d6b82', group: 'preclinical' },
  { emoji: '🔬', name: 'Pathology', sub: 'General & Systemic', color: '#7d4a7d', group: 'paraclinical' },
  { emoji: '💊', name: 'Pharmacology', sub: 'Drugs & Dosing', color: '#b88940', group: 'paraclinical' },
  { emoji: '🦠', name: 'Microbiology', sub: 'Bacteria & Virology', color: '#4a6b4a', group: 'paraclinical' },
  { emoji: '🪱', name: 'Parasitology', sub: 'Endo & Ecto', color: '#c26d6d', group: 'paraclinical' },
  { emoji: '🛡️', name: 'Immunology', sub: 'Immune Response', color: '#3d6b82', group: 'paraclinical' },
  { emoji: '🩻', name: 'Diagnostic Imaging', sub: 'Radiology & US', color: '#7d4a7d', group: 'paraclinical' },
  { emoji: '📈', name: 'Epidemiology', sub: 'Disease & Herd', color: '#b88940', group: 'paraclinical' },
  { emoji: '🔪', name: 'Surgery', sub: 'Soft Tissue & Ortho', color: '#c26d6d', group: 'clinical' },
  { emoji: '🩺', name: 'Internal Medicine', sub: 'Small & Large Animal', color: '#4a6b4a', group: 'clinical' },
  { emoji: '🐄', name: 'Theriogenology', sub: 'Reproduction', color: '#b88940', group: 'clinical' },
  { emoji: '🐕', name: 'Small Animal Medicine', sub: 'Dogs & Cats', color: '#3d6b82', group: 'clinical' },
  { emoji: '🐂', name: 'Large Animal Medicine', sub: 'Ruminants & Equine', color: '#7d4a7d', group: 'clinical' },
  { emoji: '🦜', name: 'Exotic Animal Medicine', sub: 'Wildlife & Exotic', color: '#c26d6d', group: 'clinical' },
];
function SHOWCASE_FILTER(tab) {
  return tab === 'all' ? SHOWCASE : SHOWCASE.filter((s) => s.group === tab);
}

/* ---- Lab simulation (kept: a real radiograph, a real station) ---- */
function LabSection({ p }) {
  const { t } = p;
  return (
    <section id="lab" data-screen-label="Lab simulation" className="lp-pad" style={{ padding: '92px 24px', scrollMarginTop: 80, borderTop: '1px dashed var(--clr-border)' }}>
      {/* Art slot A3 (the lab bench) heads this section once it exists. */}
      <div style={container}>
        <div className="lp-reveal" style={{ maxWidth: 680, marginBottom: 38 }}><h2 style={h2}>{t.labSecHead}</h2><p style={{ fontSize: 16, lineHeight: 1.6, color: 'var(--clr-ink-soft)', maxWidth: '60ch', margin: '14px 0 0' }}>{t.labSecSub}</p></div>
        <div className="lp-stack lp-reveal lp-card lp-lab" style={{ background: 'var(--clr-surface)', border: '1px solid var(--clr-border)', borderRadius: 22, padding: 22, display: 'grid', gridTemplateColumns: '1.15fr 1fr', gap: 22 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <span className="vmx-qtype-badge" style={{ background: 'var(--clr-ink)', color: 'var(--clr-bg)', borderColor: 'var(--clr-ink)', whiteSpace: 'nowrap', flexShrink: 0, letterSpacing: 'normal' }}>{t.labStation}</span>
              <span style={{ fontFamily: 'var(--vmx-mono)', fontSize: 11, color: 'var(--clr-ink-soft)', fontStyle: 'italic' }}>{t.labDemoNote}</span>
              <span className="vmx-timer" style={{ marginLeft: 'auto' }}>04:59</span>
            </div>
            <div className="lp-lab-film" style={{ position: 'relative', aspectRatio: '4 / 3', background: '#0a0a0c', border: '1px solid var(--clr-border)', borderRadius: 14, overflow: 'hidden', cursor: p.labTool ? 'crosshair' : 'default' }}>
              <div style={{ position: 'absolute', inset: 0, transform: `scale(${p.labZoom})`, transition: 'transform .25s ease', transformOrigin: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img
                  src="/images/thoracic-xray.jpg"
                  alt="Canine Lateral Thoracic Radiograph"
                  loading="lazy"
                  decoding="async"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
                {p.labTool === 'annotate' && (
                  <div style={{ position: 'absolute', top: '48%', left: '42%', width: 84, height: 84, borderRadius: '50%', border: '2px dashed #4ade80', boxShadow: '0 0 12px rgba(74,222,128,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', animation: 'lp-pulse 2s infinite' }}>
                    <span style={{ position: 'absolute', top: -20, background: 'rgba(0,0,0,0.85)', color: '#4ade80', fontSize: 11, fontFamily: 'var(--vmx-mono)', padding: '2px 6px', borderRadius: 4, whiteSpace: 'nowrap', border: '1px solid #4ade80' }}>
                      ROI 1: Cardiomegaly
                    </span>
                  </div>
                )}
                {p.labTool === 'measure' && (
                  <div style={{ position: 'absolute', top: '40%', left: '35%', width: 140, height: 2, background: '#f59e0b', pointerEvents: 'none' }}>
                    <div style={{ position: 'absolute', left: 0, top: -4, width: 2, height: 10, background: '#f59e0b' }} />
                    <div style={{ position: 'absolute', right: 0, top: -4, width: 2, height: 10, background: '#f59e0b' }} />
                    <span style={{ position: 'absolute', top: 6, left: '50%', transform: 'translateX(-50%)', background: 'rgba(0,0,0,0.85)', color: '#f59e0b', fontSize: 11, fontFamily: 'var(--vmx-mono)', padding: '2px 6px', borderRadius: 4, whiteSpace: 'nowrap', border: '1px solid #f59e0b' }}>
                      VHS = 11.4v (Elevated)
                    </span>
                  </div>
                )}
              </div>
              <div style={{ position: 'absolute', top: 10, left: 10, pointerEvents: 'none', background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)', padding: '5px 9px', borderRadius: 6, fontFamily: 'var(--vmx-mono)', fontSize: 9.5, color: 'rgba(255,255,255,0.85)', display: 'flex', flexDirection: 'column', gap: 2, border: '1px solid rgba(255,255,255,0.1)' }}>
                <span>PATIENT: BUSTER (CANINE, 8Y MN)</span>
                <span>VIEW: LATERAL THORAX (DR)</span>
                {/* Viewer green, not an app token: it sits on a near-black radiograph in both themes. */}
                <span style={{ color: '#7fd18a' }}>W: 350 L: 40 (CHEST WINDOW)</span>
              </div>
              <div style={{ position: 'absolute', right: 10, bottom: 10, display: 'flex', alignItems: 'center', gap: 6, zIndex: 2 }}>
                <button type="button" onClick={() => p.setLabZoom((z) => Math.max(1, +(z - 0.25).toFixed(2)))} aria-label="Zoom out" style={labZoomBtn}>−</button>
                <span style={{ display: 'flex', alignItems: 'center', padding: '0 9px', height: 28, fontFamily: 'var(--vmx-mono)', fontSize: 11, color: '#fff', background: 'rgba(0,0,0,.5)', borderRadius: 999 }}>{Math.round(p.labZoom * 100)}%</span>
                <button type="button" onClick={() => p.setLabZoom((z) => Math.min(3, +(z + 0.25).toFixed(2)))} aria-label="Zoom in" style={labZoomBtn}>+</button>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <button type="button" onClick={() => p.setLabTool((x) => x === 'annotate' ? null : 'annotate')} style={labTool(p.labTool === 'annotate')}>{t.toolAnnotate}</button>
              <button type="button" onClick={() => p.setLabTool((x) => x === 'measure' ? null : 'measure')} style={labTool(p.labTool === 'measure')}>{t.toolMeasure}</button>
              <button type="button" onClick={() => { p.setLabZoom(1); p.setLabTool(null); }} style={labTool(false)}>{t.toolReset}</button>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div className="vmx-qtext" style={{ fontSize: 16 }}>{t.labPrompt}</div>
            <div className="vmx-options">
              {p.labOptions.map((opt, i) => <OptionRow key={i} opt={opt} onClick={() => { if (!p.labRevealed) p.setLabPicked(i); }} />)}
            </div>
            {p.labRevealed && <div className="vmx-explain"><span className="k">{t.why}</span>{t.labExplain}</div>}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 'auto' }}>
              {p.labRevealed && <span style={{ fontFamily: 'var(--vmx-mono)', fontSize: 13, fontWeight: 700, color: p.labPicked === 0 ? 'var(--clr-sage-text)' : 'var(--clr-rose-text)' }}>{p.labPicked === 0 ? `✓ ${t.correct}` : `✗ ${t.wrong}`}</span>}
              <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
                <button type="button" className="vmx-btn vmx-btn-primary vmx-btn-sm" disabled={p.labPicked === null || p.labRevealed} onClick={p.onCheckLab}>{t.check}</button>
                <button type="button" onClick={p.onOpenLab || p.onEnterApp} className="vmx-btn vmx-btn-ghost vmx-btn-sm">{t.labNext} →</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
const labZoomBtn = { width: 32, height: 32, borderRadius: '50%', border: '1px solid rgba(255,255,255,.25)', background: 'rgba(0,0,0,.5)', color: '#fff', fontSize: 17, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' };
const labTool = (active) => ({ padding: '9px 14px', borderRadius: 10, border: `1px solid ${active ? 'var(--clr-sage)' : 'var(--clr-border)'}`, background: active ? 'color-mix(in srgb, var(--clr-sage) 12%, transparent)' : 'var(--clr-surface)', color: active ? 'var(--clr-sage-text)' : 'var(--clr-ink)', fontFamily: 'inherit', fontSize: 12.5, cursor: 'pointer', minHeight: 40 });
