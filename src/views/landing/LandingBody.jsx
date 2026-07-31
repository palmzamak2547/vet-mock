// ============================================================
// LandingBody — hero → footer for LandingView
// ============================================================
// Split out of LandingView.jsx so each file stays focused. Receives
// everything as props from LandingView (single state owner). Pure
// presentation + the design's simulated interactions.
// ============================================================

import { QB_TOTAL, Q_COUNTS_BY_SUBJECT } from '../../data/q-counts.js';

// Derived once at module load — the number of subjects that actually ship
// questions today. Regenerated with the bank, so it can't drift.
const SUBJECTS_WITH_QUESTIONS = Object.values(Q_COUNTS_BY_SUBJECT).filter((n) => n > 0).length;

function OptionRow({ opt, onClick, disabled }) {
  return (
    <button type="button" className={`vmx-option ${opt.cls}`} style={opt.style} onClick={onClick} disabled={disabled}>
      <span className="vmx-option-letter">{opt.letter}</span>
      <span className="vmx-option-text">{opt.text}</span>
      {opt.mark && <span style={opt.markStyle}>{opt.mark}</span>}
    </button>
  );
}
// Section eyebrow. NO letterSpacing: these labels are Thai in the TH
// locale (e.g. 'ปัญหาที่เจอ') and tracking breaks Thai glyph shaping —
// a forbidden project rule. textTransform:uppercase is a no-op on Thai
// and only affects the Latin labels, which is fine.
const label = (color) => ({ fontFamily: 'var(--vmx-mono)', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', color: color || 'var(--clr-sage)', marginBottom: 14 });
const h2 = { fontFamily: 'Fraunces, serif', fontWeight: 500, fontSize: 'clamp(28px,4vw,42px)', lineHeight: 1.04, letterSpacing: '-.03em', color: 'var(--clr-ink)', margin: 0, textWrap: 'balance' };
const em = { fontStyle: 'italic', fontWeight: 400, color: 'var(--clr-sage)' };
const container = { maxWidth: 1200, margin: '0 auto' };
const chip = (active) => `vmx-chip${active ? ' active' : ''}`;

export default function LandingBody(p) {
  const { t } = p;
  return (
    <main id="lp-main">
      {/* ================= HERO ================= */}
      <section id="lp-top" data-screen-label="Hero" className="lp-pad" style={{ padding: '74px 24px 88px', scrollMarginTop: 80, position: 'relative', overflow: 'hidden' }}>
        {/* Decorative floating orbs — CSS animates these, aria-hidden so SR skips */}
        <div className="lp-stack" style={{ ...container, display: 'grid', gridTemplateColumns: '1.02fr 1.12fr', gap: 54, alignItems: 'center' }}>
          <div className="lp-reveal lp-center-md">
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 14px', border: '1px solid var(--clr-border)', borderRadius: 999, background: 'var(--clr-surface)', fontFamily: 'var(--vmx-mono)', fontSize: 11, textTransform: 'uppercase', color: 'var(--clr-sage)', marginBottom: 22 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--clr-sage)' }} />{t.heroEyebrow}
            </div>
            <h1 style={{ fontFamily: 'Fraunces, serif', fontWeight: 500, fontSize: 'clamp(38px,5.4vw,60px)', lineHeight: .98, letterSpacing: '-.035em', color: 'var(--clr-ink)', margin: '0 0 20px', textWrap: 'balance' }}>
              {t.heroPre}<em style={em}>{t.heroEm}</em>{t.heroPost}
            </h1>
            <p style={{ fontSize: 17, lineHeight: 1.62, color: 'var(--clr-ink-soft)', maxWidth: '52ch', margin: '0 0 28px' }}>{t.heroSub}</p>
            <div className="lp-center-md lp-flex" style={{ display: 'flex', gap: 8, alignItems: 'center', fontFamily: 'var(--vmx-mono)', fontSize: 12.5, color: 'var(--clr-ink-soft)', margin: '0 0 22px' }}>
              <span>{t.heroFocusLine}</span><span style={{ color: 'var(--clr-sage)', fontWeight: 600, fontFamily: 'IBM Plex Sans Thai, sans-serif', fontSize: 14 }}>{t.heroWords[p.heroWord]} →</span>
            </div>
            <div className="lp-center-md lp-flex" style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 18 }}>
              <button type="button" onClick={p.onStartMockExam || p.onEnterApp} className="vmx-btn vmx-btn-primary" style={{ fontSize: 15, padding: '15px 26px' }}>{t.heroCta1} <span style={{ fontFamily: 'var(--vmx-mono)' }}>→</span></button>
              <a href="#subjects" className="vmx-btn vmx-btn-ghost" style={{ fontSize: 15, padding: '15px 26px' }}>{t.heroCta2}</a>
            </div>
            {/* Hero stats — every figure DERIVED from the shipped question
                bank, never typed by hand. (This block used to read
                "10K+ Questions / 500+ Students / 95% Pass Rate": the bank
                actually holds QB_TOTAL questions, and the app has never
                measured a student count or an exam pass rate — the subject
                grid further down this same page renders the honest counts,
                so the page was contradicting itself.) */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', marginTop: '28px', paddingTop: '24px', borderTop: '1px solid var(--clr-border)' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ fontFamily: 'Fraunces, serif', fontWeight: 600, fontSize: '28px', color: 'var(--clr-sage)', lineHeight: 1 }}>{QB_TOTAL.toLocaleString('en-US')}</div>
                <div style={{ fontSize: '12px', color: 'var(--clr-ink-soft)', textTransform: 'uppercase', letterSpacing: '.05em' }}>{t.statQuestions}</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ fontFamily: 'Fraunces, serif', fontWeight: 600, fontSize: '28px', color: 'var(--clr-gold-text)', lineHeight: 1 }}>{SUBJECTS_WITH_QUESTIONS}</div>
                <div style={{ fontSize: '12px', color: 'var(--clr-ink-soft)', textTransform: 'uppercase', letterSpacing: '.05em' }}>{t.statSubjects}</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ fontFamily: 'Fraunces, serif', fontWeight: 600, fontSize: '28px', color: 'var(--clr-ocean)', lineHeight: 1 }}>{t.statFreeValue}</div>
                <div style={{ fontSize: '12px', color: 'var(--clr-ink-soft)', textTransform: 'uppercase', letterSpacing: '.05em' }}>{t.statFree}</div>
              </div>
            </div>
          </div>

          {/* hero exam preview */}
          <div className="lp-reveal" style={{ position: 'relative' }}>
            <div className="lp-stack" style={{ position: 'relative', zIndex: 2, display: 'flex', gap: 14, alignItems: 'stretch' }}>
              <div className="vmx-question-card" style={{ flex: 1, minWidth: 0, padding: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 14, paddingBottom: 14, borderBottom: '1px dashed var(--clr-border)' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontFamily: 'var(--vmx-mono)', fontSize: 10, fontWeight: 600, padding: '4px 9px', borderRadius: 999, background: 'color-mix(in srgb, var(--clr-sage) 12%, transparent)', color: 'var(--clr-sage)', flexShrink: 0 }}>✓ {t.heroBankLabel}</span>
                  <span style={{ flex: 1, minWidth: 0, fontFamily: 'var(--vmx-mono)', fontSize: 11.5, color: 'var(--clr-ink-soft)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.heroBankLine}</span>
                  <button type="button" onClick={p.onEnterApp} style={{ flexShrink: 0, padding: '6px 13px', borderRadius: 999, border: 'none', background: 'var(--clr-sage)', color: 'var(--clr-surface)', fontFamily: 'inherit', fontSize: 12, fontWeight: 600, cursor: 'pointer', minHeight: 32 }}>{t.startPractice}</button>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                  {/* badge shrinks + truncates so the timer never overlaps the
                      bookmark on narrow cards; timer + bookmark stay fixed-size */}
                  <span className="vmx-qtype-badge" style={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>MCQ — {t.heroTag}</span>
                  <span className="vmx-timer" style={{ marginLeft: 'auto', flexShrink: 0 }}>01:24</span>
                  {/* the app's .vmx-bookmark-btn is position:absolute (pins to a
                      card corner in the exam view); on the landing it sits inline
                      in this flex row, so force it back into flow or it floats to
                      the corner and overlaps the timer/question. */}
                  <button type="button" className={`vmx-bookmark-btn ${p.heroBookmarked ? 'active' : ''}`} style={{ position: 'static', flexShrink: 0 }} onClick={() => p.setHeroBookmarked((b) => !b)} aria-label="Bookmark" aria-pressed={p.heroBookmarked}>🔖</button>
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
                    ? <span style={{ fontFamily: 'var(--vmx-mono)', fontSize: 13, fontWeight: 700, color: p.heroPicked === 1 ? 'var(--clr-sage)' : 'var(--clr-rose-text)' }}>{p.heroPicked === 1 ? `✓ ${t.correct}` : `✗ ${t.wrong}`}</span>
                    : <span style={{ fontFamily: 'var(--vmx-mono)', fontSize: 11, color: 'var(--clr-ink-soft)' }}>{t.demoNote}</span>}
                  <button type="button" className="vmx-btn vmx-btn-primary" style={{ marginLeft: 'auto' }} disabled={p.heroPicked === null || p.heroRevealed} onClick={p.onCheckHero}>{t.check}</button>
                </div>
              </div>
              {/* mini exam navigator (desktop only) */}
              <div className="lp-hide-md" style={{ width: 120, flexShrink: 0, background: 'var(--clr-surface)', border: '1px solid var(--clr-border)', borderRadius: 16, padding: 14, display: 'flex', flexDirection: 'column', gap: 11 }}>
                <div style={{ fontFamily: 'Fraunces, serif', fontWeight: 600, fontSize: 13, color: 'var(--clr-ink)' }}>{t.navTitle}</div>
                <div style={{ fontFamily: 'var(--vmx-mono)', fontSize: 22, fontWeight: 600, color: 'var(--clr-ink)', lineHeight: 1 }}>04<span style={{ fontSize: 13, color: 'var(--clr-ink-soft)' }}> / 20</span></div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 5 }}>
                  {Array.from({ length: 20 }).map((_, i) => {
                    const base = { aspectRatio: '1', borderRadius: 5, border: '1px solid var(--clr-border)', fontFamily: 'var(--vmx-mono)', fontSize: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--clr-surface-2)', color: 'var(--clr-ink-soft)' };
                    let st = base;
                    if (i < 3) st = { ...base, background: 'var(--clr-sage)', color: 'var(--clr-surface)', borderColor: 'var(--clr-sage)' };
                    else if (i === 3) st = { ...base, background: 'var(--clr-ink)', color: 'var(--clr-bg)', borderColor: 'var(--clr-ink)' };
                    else if (i === 7) st = { ...base, background: 'var(--clr-gold)', color: 'var(--clr-surface)', borderColor: 'var(--clr-gold)' };
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

      {/* ================= TRUST BAND ================= */}
      <section id="why" data-screen-label="Trust" className="lp-pad" style={{ padding: '32px 24px', background: 'var(--clr-surface)', borderTop: '1px solid var(--clr-border)', borderBottom: '1px solid var(--clr-border)' }}>
        <div className="lp-reveal" style={{ ...container, display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '14px 30px' }}>
          <span style={{ fontFamily: 'var(--vmx-mono)', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', color: 'var(--clr-sage)' }}>{t.trustLabel}</span>
          {t.trust.map((tp) => <span key={tp} style={{ display: 'flex', alignItems: 'center', gap: 9, fontSize: 14, color: 'var(--clr-ink)', fontWeight: 500 }}><span style={{ color: 'var(--clr-sage)', fontSize: 15 }}>✓</span>{tp}</span>)}
        </div>
      </section>

      {/* ================= PROBLEM ================= */}
      <section data-screen-label="Problem" className="lp-pad" style={{ padding: '92px 24px', scrollMarginTop: 80 }}>
        <div style={container}>
          <div className="lp-reveal" style={{ maxWidth: 660, marginBottom: 44 }}>
            <div style={label()}>{t.probLabel}</div>
            <h2 style={h2}>{t.probHead}</h2>
          </div>
          <div className="lp-reveal" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 20 }}>
            {t.problems.map((pr) => (
              <div key={pr.title} style={{ background: 'var(--clr-surface)', border: '1px solid var(--clr-border)', borderRadius: 18, padding: 28, display: 'flex', flexDirection: 'column', gap: 13 }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: 'var(--clr-bg)', border: '1px solid var(--clr-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>{pr.emoji}</div>
                <h3 style={{ fontFamily: 'Fraunces, serif', fontWeight: 600, fontSize: 19, letterSpacing: '-.01em', color: 'var(--clr-ink)', margin: 0, lineHeight: 1.25 }}>{pr.title}</h3>
                <p style={{ fontSize: 14.5, lineHeight: 1.6, color: 'var(--clr-ink-soft)', margin: 0 }}>{pr.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= SOLUTION / FEATURES ================= */}
      <section id="solution" data-screen-label="Features" className="lp-pad" style={{ padding: '92px 24px', scrollMarginTop: 80, background: 'var(--clr-surface)', borderTop: '1px dashed var(--clr-border)' }}>
        <div style={container}>
          <div className="lp-reveal" style={{ maxWidth: 680, marginBottom: 44 }}>
            <div style={label()}>{t.solLabel}</div>
            <h2 style={h2}>{t.solPre}<em style={em}>{t.solEm}</em>{t.solPost}</h2>
            <p style={{ fontSize: 16, lineHeight: 1.6, color: 'var(--clr-ink-soft)', maxWidth: '58ch', margin: '14px 0 0' }}>{t.solSub}</p>
          </div>
          <div className="lp-stack lp-reveal" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 22 }}>
            <div style={{ background: 'var(--clr-bg)', border: '1px solid var(--clr-border)', borderRadius: 20, padding: 30, display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 46, height: 46, borderRadius: 12, background: 'var(--clr-sage)', color: 'var(--clr-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>🎓</div>
                <h3 style={{ fontFamily: 'Fraunces, serif', fontWeight: 600, fontSize: 23, letterSpacing: '-.02em', margin: 0, color: 'var(--clr-ink)' }}>{t.mockName}</h3>
              </div>
              <p style={{ fontSize: 15, lineHeight: 1.6, color: 'var(--clr-ink-soft)', margin: 0 }}>{t.mockDesc}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 4 }}>
                {t.mockBullets.map((b) => <div key={b} style={{ display: 'flex', alignItems: 'center', gap: 11, fontSize: 14, color: 'var(--clr-ink)' }}><span style={{ color: 'var(--clr-sage)', fontFamily: 'var(--vmx-mono)', flexShrink: 0 }}>✓</span>{b}</div>)}
              </div>
              <button type="button" onClick={p.onStartMockExam || p.onEnterApp} className="vmx-btn vmx-btn-primary vmx-btn-sm" style={{ alignSelf: 'flex-start', marginTop: 4 }}>{t.heroCta1} →</button>
            </div>
            <div style={{ background: 'var(--clr-bg)', border: '1px solid var(--clr-border)', borderRadius: 20, padding: 30, display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 46, height: 46, borderRadius: 12, background: 'var(--clr-ocean)', color: 'var(--clr-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>🔬</div>
                <h3 style={{ fontFamily: 'Fraunces, serif', fontWeight: 600, fontSize: 23, letterSpacing: '-.02em', margin: 0, color: 'var(--clr-ink)' }}>{t.labFName}</h3>
              </div>
              <p style={{ fontSize: 15, lineHeight: 1.6, color: 'var(--clr-ink-soft)', margin: 0 }}>{t.labFDesc}</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 4 }}>
                {t.labExamples.map((e) => <div key={e.label} style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '11px 12px', background: 'var(--clr-surface)', border: '1px solid var(--clr-border)', borderRadius: 11, fontSize: 12.5, color: 'var(--clr-ink)' }}><span style={{ fontSize: 16, flexShrink: 0 }}>{e.emoji}</span>{e.label}</div>)}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= PANIC MODE ================= */}
      <section id="panic" data-screen-label="Panic Mode" className="lp-pad" style={{ padding: '92px 24px', scrollMarginTop: 80, borderTop: '1px dashed var(--clr-border)' }}>
        <div className="lp-stack" style={{ ...container, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 46, alignItems: 'center' }}>
          <div className="lp-reveal">
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 14px', border: '1px solid var(--clr-gold)', borderRadius: 999, background: 'var(--clr-gold-soft)', fontFamily: 'var(--vmx-mono)', fontSize: 11, textTransform: 'uppercase', color: 'var(--clr-ink)', marginBottom: 18 }}>
              <span>🚨</span>{t.panicLabel}
            </div>
            <h2 style={{ ...h2, fontSize: 'clamp(32px,4.6vw,50px)', lineHeight: 1, margin: '0 0 8px' }}>{t.panicHead}</h2>
            <p style={{ fontFamily: 'Fraunces, serif', fontStyle: 'italic', fontSize: 19, color: 'var(--clr-ink-soft)', margin: '0 0 14px' }}>{t.panicCalm}</p>
            <p style={{ fontSize: 16, lineHeight: 1.6, color: 'var(--clr-ink-soft)', maxWidth: '48ch', margin: 0 }}>{t.panicDesc}</p>
            <div style={{ margin: '24px 0 22px' }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--clr-ink)', marginBottom: 11 }}>{t.panicTimeQ}</div>
              <div style={{ display: 'flex', gap: 9, flexWrap: 'wrap' }}>
                {t.panicTimes.map((pt) => <button key={pt.key} type="button" className={chip(p.panicTime === pt.key)} onClick={() => p.setPanicTime(pt.key)}>{pt.label}</button>)}
              </div>
            </div>
            {/* Runs a REAL cram session sized to the time the user just picked
                (weak topics when there's enough history to know them). */}
            <button type="button" onClick={() => (p.onStartPanic ? p.onStartPanic(p.panicTime) : p.onEnterApp())} className="vmx-btn" style={{ background: 'var(--clr-gold)', color: 'var(--clr-surface)', fontSize: 15, padding: '15px 26px' }}>{t.panicCta} →</button>
          </div>
          <div className="lp-reveal" style={{ background: 'var(--clr-surface)', border: '1px solid var(--clr-border)', borderTop: '3px solid var(--clr-gold)', borderRadius: 20, padding: 28, boxShadow: 'var(--shadow-md)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
              <span style={{ fontFamily: 'Fraunces, serif', fontWeight: 600, fontSize: 18, color: 'var(--clr-ink)' }}>{t.panicPlanTitle}</span>
              {/* This card recomputes as the time chips change, but the
                  numbers are an illustrative example set, not a live feed
                  — so it's framed as a preview, not "LIVE". */}
              <span className="vmx-badge-live" style={{ background: 'var(--clr-surface-2)', color: 'var(--clr-ink-soft)' }}>{t.previewBadge}</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
              {[[p.panic.c, t.panicStatConcepts, 'var(--clr-ink)'], [p.panic.t, t.panicStatTraps, 'var(--clr-gold)'], [p.panic.q, t.panicStatQ, 'var(--clr-sage)'], [p.panic.w, t.panicStatWeak, 'var(--clr-rose)']].map(([v, lbl, c]) => (
                <div key={lbl} style={{ background: 'var(--clr-bg)', border: '1px solid var(--clr-border)', borderRadius: 13, padding: 15 }}>
                  <div style={{ fontFamily: 'Fraunces, serif', fontWeight: 600, fontSize: 30, lineHeight: 1, color: c }}>{v}</div>
                  <div style={{ fontSize: 11, textTransform: 'uppercase', color: 'var(--clr-ink-soft)', marginTop: 6 }}>{lbl}</div>
                </div>
              ))}
            </div>
            <div style={{ fontFamily: 'var(--vmx-mono)', fontSize: 11, textTransform: 'uppercase', color: 'var(--clr-ink-soft)', marginBottom: 10 }}>{t.panicFocusTitle}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {t.panicFocus.slice(0, p.panic.w).map((f, i) => (
                <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '11px 13px', background: 'var(--clr-bg)', border: '1px solid var(--clr-border)', borderRadius: 11, fontSize: 13.5, color: 'var(--clr-ink)' }}>
                  <span style={{ fontFamily: 'var(--vmx-mono)', fontSize: 11, color: 'var(--clr-gold-text)', fontWeight: 700, flexShrink: 0 }}>{String(i + 1).padStart(2, '0')}</span>{f}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section data-screen-label="How it works" className="lp-pad" style={{ padding: '92px 24px', scrollMarginTop: 80, background: 'var(--clr-surface)', borderTop: '1px dashed var(--clr-border)' }}>
        <div style={container}>
          <div className="lp-reveal" style={{ maxWidth: 640, marginBottom: 44 }}><div style={label()}>{t.howLabel}</div><h2 style={h2}>{t.howHead}</h2></div>
          <div className="lp-reveal" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(250px,1fr))', gap: 20 }}>
            {t.steps.map((s, i) => (
              <div key={s.title} style={{ background: 'var(--clr-bg)', border: '1px solid var(--clr-border)', borderRadius: 18, padding: 28, display: 'flex', flexDirection: 'column', gap: 13 }}>
                <div style={{ fontFamily: 'var(--vmx-mono)', fontWeight: 600, fontSize: 14, width: 44, height: 44, borderRadius: '50%', background: 'var(--clr-sage)', color: 'var(--clr-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{i + 1}</div>
                <h3 style={{ fontFamily: 'Fraunces, serif', fontWeight: 600, fontSize: 19, letterSpacing: '-.01em', color: 'var(--clr-ink)', margin: 0, lineHeight: 1.25 }}>{s.title}</h3>
                <p style={{ fontSize: 14.5, lineHeight: 1.6, color: 'var(--clr-ink-soft)', margin: 0 }}>{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= SUBJECTS (real + showcase) ================= */}
      <SubjectsSection p={p} />

      {/* ================= LAB SIMULATION ================= */}
      <LabSection p={p} />

      {/* ================= ANALYTICS ================= */}
      <AnalyticsSection p={p} />

      {/* ================= READINESS ================= */}
      <section data-screen-label="Readiness" className="lp-pad" style={{ padding: '92px 24px', scrollMarginTop: 80, background: 'var(--clr-surface)', borderTop: '1px dashed var(--clr-border)' }}>
        <div style={container}>
          <div className="lp-reveal" style={{ maxWidth: 640, marginBottom: 38 }}><div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}><div style={label()}>{t.rLabel}</div><span className="vmx-badge-live" style={{ background: 'var(--clr-surface-2)', color: 'var(--clr-ink-soft)' }}>{t.previewBadge}</span></div><h2 style={h2}>{t.rHeadPre}<em style={em}>{t.rHeadEm}</em>{t.rHeadPost}</h2></div>
          <div className="lp-stack lp-reveal" style={{ display: 'grid', gridTemplateColumns: '290px 1fr', gap: 38, alignItems: 'center', background: 'var(--clr-bg)', border: '1px solid var(--clr-border)', borderRadius: 22, padding: 34 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
              <div style={{ position: 'relative', width: 200, height: 200, borderRadius: '50%', background: p.readinessRing, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: 150, height: 150, borderRadius: '50%', background: 'var(--clr-bg)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontFamily: 'Fraunces, serif', fontWeight: 800, fontSize: 54, lineHeight: 1, color: 'var(--clr-sage)' }}>72<span style={{ fontSize: 22 }}>%</span></span>
                  <span style={{ fontFamily: 'var(--vmx-mono)', fontSize: 10, textTransform: 'uppercase', color: 'var(--clr-ink-soft)', marginTop: 2 }}>{t.rScoreWord}</span>
                </div>
              </div>
              <p style={{ fontFamily: 'Fraunces, serif', fontStyle: 'italic', fontSize: 16, color: 'var(--clr-ink-soft)', textAlign: 'center', margin: 0 }}>{t.rMsg}</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {t.rMetricLabels.map((lbl, i) => {
                const pct = [78, 68, 64, 81, 70][i];
                const cls = pct >= 75 ? '' : pct >= 60 ? 'mid' : 'low';
                return (
                  <div key={lbl}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 6, color: 'var(--clr-ink)' }}><span>{lbl}</span><span style={{ fontFamily: 'var(--vmx-mono)', color: 'var(--clr-ink-soft)' }}>{pct}%</span></div>
                    <div className="vmx-bar" style={{ height: 9 }}><div className={`vmx-bar-fill ${cls}`} style={{ width: `${pct}%`, transition: 'width .8s ease' }} /></div>
                  </div>
                );
              })}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 9, marginTop: 6, padding: '12px 14px', background: 'var(--clr-surface-2)', borderRadius: 11, fontSize: 12.5, lineHeight: 1.5, color: 'var(--clr-ink-soft)' }}><span style={{ color: 'var(--clr-gold-text)', flexShrink: 0 }}>ⓘ</span>{t.rDisclaimer}</div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= WEAKNESS ================= */}
      <section id="weakness" data-screen-label="Weakness detection" className="lp-pad" style={{ padding: '92px 24px', scrollMarginTop: 80 }}>
        <div style={container}>
          <div className="lp-reveal" style={{ maxWidth: 660, marginBottom: 34 }}><div style={label()}>{t.weakLabel}</div><h2 style={h2}>{t.weakHead}</h2><p style={{ fontSize: 16, lineHeight: 1.6, color: 'var(--clr-ink-soft)', maxWidth: '58ch', margin: '14px 0 0' }}>{t.weakSub}</p><p style={{ fontSize: 13, color: 'var(--clr-ink-soft)', margin: '10px 0 0', fontStyle: 'italic' }}>{t.weakPreviewNote}</p></div>
          <div className="lp-reveal" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(250px,1fr))', gap: 16, marginBottom: 26 }}>
            {t.weaknessCards.map((w) => (
              <div key={w.text} style={{ background: 'var(--clr-surface)', border: '1px solid var(--clr-border)', borderTop: `3px solid ${w.color}`, borderRadius: 16, padding: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
                <span style={{ fontFamily: 'var(--vmx-mono)', fontSize: 10, textTransform: 'uppercase', fontWeight: 700, color: w.color }}>{w.tag}</span>
                <p style={{ fontSize: 14.5, lineHeight: 1.5, color: 'var(--clr-ink)', margin: 0 }}>{w.text}</p>
              </div>
            ))}
          </div>
          <div className="lp-reveal" style={{ textAlign: 'center' }}><button type="button" onClick={p.onEnterApp} className="vmx-btn vmx-btn-primary" style={{ fontSize: 15, padding: '15px 28px' }}>{t.weakCta} →</button></div>
        </div>
      </section>

      {/* ================= FINAL CTA ================= */}
      <section id="cta" data-screen-label="Final CTA" className="lp-pad" style={{ padding: '100px 24px', scrollMarginTop: 80 }}>
        <div className="lp-reveal" style={{ maxWidth: 920, margin: '0 auto', textAlign: 'center', background: 'var(--clr-ink)', borderRadius: 26, padding: '64px 40px' }}>
          <h2 style={{ fontFamily: 'Fraunces, serif', fontWeight: 500, fontSize: 'clamp(30px,4.5vw,46px)', lineHeight: 1.05, letterSpacing: '-.03em', color: 'var(--clr-bg)', margin: '0 0 18px', textWrap: 'balance' }}>{t.ctaPre}<em style={{ fontStyle: 'italic', fontWeight: 400, color: 'var(--clr-sage-soft)' }}>{t.ctaEm}</em>{t.ctaPost}</h2>
          {/* On the inverted (--clr-ink) panel, text/border derive from
              --clr-bg via color-mix so they stay legible in BOTH themes
              (a hardcoded cream would vanish on the cream box dark mode
              produces). */}
          <p style={{ fontSize: 16, lineHeight: 1.6, color: 'color-mix(in srgb, var(--clr-bg) 72%, transparent)', maxWidth: '52ch', margin: '0 auto 30px' }}>{t.ctaSub}</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center' }}>
            <button type="button" onClick={p.onEnterApp} className="vmx-btn" style={{ background: 'var(--clr-surface)', color: 'var(--clr-ink)', fontSize: 15, padding: '15px 28px' }}>{t.cta1} →</button>
            <a href="#subjects" className="vmx-btn" style={{ background: 'transparent', color: 'var(--clr-bg)', border: '1.5px solid color-mix(in srgb, var(--clr-bg) 30%, transparent)', fontSize: 15, padding: '15px 28px' }}>{t.cta2}</a>
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer data-screen-label="Footer" className="lp-pad" style={{ padding: '52px 24px 40px', borderTop: '1px solid var(--clr-border)' }}>
        <div style={container}>
          <div className="lp-stack" style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 30, alignItems: 'start', marginBottom: 36 }}>
            <div>
              <a href="#lp-top" style={{ display: 'inline-flex', alignItems: 'center', gap: 9, fontFamily: 'Fraunces, serif', fontWeight: 800, fontSize: 22, letterSpacing: '-.02em', color: 'var(--clr-ink)', marginBottom: 12 }}>
                <img src="/vetmock-logo.svg" width={28} height={28} style={{ borderRadius: 7, display: 'block' }} alt="VetMock logo" />
                Vet<span style={{ color: 'var(--clr-rose-text)', fontStyle: 'italic', fontWeight: 500 }}>Mock</span>
              </a>
              <p style={{ fontFamily: 'Fraunces, serif', fontStyle: 'italic', fontSize: 15, color: 'var(--clr-ink-soft)', margin: '0 0 8px' }}>{t.footTagline}</p>
              <p style={{ fontSize: 12.5, lineHeight: 1.55, color: 'var(--clr-ink-soft)', maxWidth: '46ch', margin: 0 }}>{t.footIndependent}</p>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px 28px' }}>
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

/* ---- Subjects (real curriculum + showcase toggle) ---- */
function SubjectsSection({ p }) {
  const { t } = p;
  const showcase = p.showcaseMode;
  const cards = showcase
    ? SHOWCASE_FILTER(p.subjectTab)
    : p.realSubjects;
  return (
    <section id="subjects" data-screen-label="Subjects" className="lp-pad" style={{ padding: '92px 24px', scrollMarginTop: 80 }}>
      <div style={container}>
        <div className="lp-reveal" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', gap: 22, marginBottom: 30 }}>
          <div style={{ maxWidth: 620 }}>
            <div style={label()}>{t.subjLabel}</div>
            <h2 style={h2}>{t.subjPre}<em style={em}>{t.subjEm}</em>{t.subjPost}</h2>
            <p style={{ fontSize: 16, lineHeight: 1.6, color: 'var(--clr-ink-soft)', maxWidth: '52ch', margin: '14px 0 4px' }}>{t.subjSub}</p>
            <p style={{ fontSize: 13, color: showcase ? 'var(--clr-ink-soft)' : 'var(--clr-sage)', margin: 0, fontWeight: 500 }}>{showcase ? t.subjShowcaseNote : t.subjRealNote}</p>
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
                <span className="count">{showcase ? '' : `${s.count} ${t.qWord}`}{clickable ? '' : ''}</span>
                {clickable && <span style={{ fontFamily: 'var(--vmx-mono)', fontSize: 10, color: 'var(--clr-sage)', marginTop: 2 }}>{t.startPractice} →</span>}
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

/* ---- Lab simulation ---- */
function LabSection({ p }) {
  const { t } = p;
  return (
    <section id="lab" data-screen-label="Lab simulation" className="lp-pad" style={{ padding: '92px 24px', scrollMarginTop: 80, background: 'var(--clr-surface)', borderTop: '1px dashed var(--clr-border)' }}>
      <div style={container}>
        <div className="lp-reveal" style={{ maxWidth: 680, marginBottom: 38 }}><div style={label()}>{t.labSecLabel}</div><h2 style={h2}>{t.labSecHead}</h2><p style={{ fontSize: 16, lineHeight: 1.6, color: 'var(--clr-ink-soft)', maxWidth: '60ch', margin: '14px 0 0' }}>{t.labSecSub}</p></div>
        <div className="lp-stack lp-reveal" style={{ background: 'var(--clr-bg)', border: '1px solid var(--clr-border)', borderRadius: 22, padding: 22, display: 'grid', gridTemplateColumns: '1.15fr 1fr', gap: 22 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {/* letterSpacing:normal overrides the shared vmx-qtype-badge's
                  .1em tracking, which would otherwise sit on the Thai
                  labStation string in the TH locale. */}
              <span className="vmx-qtype-badge" style={{ background: 'var(--clr-ink)', color: 'var(--clr-bg)', borderColor: 'var(--clr-ink)', whiteSpace: 'nowrap', flexShrink: 0, letterSpacing: 'normal' }}>{t.labStation}</span>
              <span style={{ fontFamily: 'var(--vmx-mono)', fontSize: 10, color: 'var(--clr-ink-soft)', fontStyle: 'italic' }}>{t.labDemoNote}</span>
              <span className="vmx-timer" style={{ marginLeft: 'auto' }}>04:59</span>
            </div>
            <div style={{ position: 'relative', aspectRatio: '4 / 3', background: '#0a0a0c', border: '1px solid var(--clr-border)', borderRadius: 14, overflow: 'hidden', cursor: p.labTool ? 'crosshair' : 'default' }}>
              {/* Main Radiograph Image */}
              <div style={{ position: 'absolute', inset: 0, transform: `scale(${p.labZoom})`, transition: 'transform .25s ease', transformOrigin: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img
                  src="/images/thoracic-xray.jpg"
                  alt="Canine Lateral Thoracic Radiograph"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
                
                {/* Interactive Annotate Overlay */}
                {p.labTool === 'annotate' && (
                  <div style={{ position: 'absolute', top: '48%', left: '42%', width: 84, height: 84, borderRadius: '50%', border: '2px dashed #4ade80', boxShadow: '0 0 12px rgba(74,222,128,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', animation: 'lp-pulse 2s infinite' }}>
                    <span style={{ position: 'absolute', top: -20, background: 'rgba(0,0,0,0.85)', color: '#4ade80', fontSize: 10, fontFamily: 'var(--vmx-mono)', padding: '2px 6px', borderRadius: 4, whiteSpace: 'nowrap', border: '1px solid #4ade80' }}>
                      ROI 1: Cardiomegaly
                    </span>
                  </div>
                )}

                {/* Interactive Measure Overlay */}
                {p.labTool === 'measure' && (
                  <div style={{ position: 'absolute', top: '40%', left: '35%', width: 140, height: 2, background: '#f59e0b', pointerEvents: 'none' }}>
                    <div style={{ position: 'absolute', left: 0, top: -4, width: 2, height: 10, background: '#f59e0b' }} />
                    <div style={{ position: 'absolute', right: 0, top: -4, width: 2, height: 10, background: '#f59e0b' }} />
                    <span style={{ position: 'absolute', top: 6, left: '50%', transform: 'translateX(-50%)', background: 'rgba(0,0,0,0.85)', color: '#f59e0b', fontSize: 10, fontFamily: 'var(--vmx-mono)', padding: '2px 6px', borderRadius: 4, whiteSpace: 'nowrap', border: '1px solid #f59e0b' }}>
                      VHS = 11.4v (Elevated)
                    </span>
                  </div>
                )}
              </div>

              {/* DICOM HUD Info Overlay */}
              <div style={{ position: 'absolute', top: 10, left: 10, pointerEvents: 'none', background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)', padding: '5px 9px', borderRadius: 6, fontFamily: 'var(--vmx-mono)', fontSize: 9.5, color: 'rgba(255,255,255,0.85)', display: 'flex', flexDirection: 'column', gap: 2, border: '1px solid rgba(255,255,255,0.1)' }}>
                <span>PATIENT: BUSTER (CANINE, 8Y MN)</span>
                <span>VIEW: LATERAL THORAX (DR)</span>
                <span style={{ color: 'var(--clr-sage)' }}>W: 350 L: 40 (CHEST WINDOW)</span>
              </div>

              <div style={{ position: 'absolute', right: 10, bottom: 10, display: 'flex', alignItems: 'center', gap: 6, zIndex: 2 }}>
                <button type="button" onClick={() => p.setLabZoom((z) => Math.max(1, +(z - 0.25).toFixed(2)))} aria-label="Zoom out" style={labZoomBtn}>−</button>
                <span style={{ display: 'flex', alignItems: 'center', padding: '0 9px', height: 28, fontFamily: 'var(--vmx-mono)', fontSize: 11, color: '#fff', background: 'rgba(0,0,0,.5)', borderRadius: 999 }}>{Math.round(p.labZoom * 100)}%</span>
                <button type="button" onClick={() => p.setLabZoom((z) => Math.min(3, +(z + 0.25).toFixed(2)))} aria-label="Zoom in" style={labZoomBtn}>+</button>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <button type="button" onClick={() => p.setLabTool((x) => x === 'annotate' ? null : 'annotate')} style={labTool(p.labTool === 'annotate')}>✏️ {t.toolAnnotate}</button>
              <button type="button" onClick={() => p.setLabTool((x) => x === 'measure' ? null : 'measure')} style={labTool(p.labTool === 'measure')}>📏 {t.toolMeasure}</button>
              <button type="button" onClick={() => { p.setLabZoom(1); p.setLabTool(null); }} style={labTool(false)}>↺ {t.toolReset}</button>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div className="vmx-qtext" style={{ fontSize: 16 }}>{t.labPrompt}</div>
            <div className="vmx-options">
              {p.labOptions.map((opt, i) => <OptionRow key={i} opt={opt} onClick={() => { if (!p.labRevealed) p.setLabPicked(i); }} />)}
            </div>
            {p.labRevealed && <div className="vmx-explain"><span className="k">{t.why}</span>{t.labExplain}</div>}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 'auto' }}>
              {p.labRevealed && <span style={{ fontFamily: 'var(--vmx-mono)', fontSize: 13, fontWeight: 700, color: p.labPicked === 0 ? 'var(--clr-sage)' : 'var(--clr-rose-text)' }}>{p.labPicked === 0 ? `✓ ${t.correct}` : `✗ ${t.wrong}`}</span>}
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
const labTool = (active) => ({ padding: '9px 14px', borderRadius: 10, border: `1px solid ${active ? 'var(--clr-sage)' : 'var(--clr-border)'}`, background: active ? 'color-mix(in srgb, var(--clr-sage) 12%, transparent)' : 'var(--clr-surface)', color: active ? 'var(--clr-sage)' : 'var(--clr-ink)', fontFamily: 'inherit', fontSize: 12.5, cursor: 'pointer', minHeight: 40 });

/* ---- Analytics ---- */
function AnalyticsSection({ p }) {
  const { t } = p;
  const ACTIVITY = [3, 7, 5, 9, 6, 11, 8]; const maxA = Math.max(...ACTIVITY);
  const MASTERY = [{ name: 'Pharmacology', pct: 82 }, { name: 'Physiology', pct: 76 }, { name: 'Surgery', pct: 69 }, { name: 'Pathology', pct: 61 }, { name: 'Parasitology', pct: 51 }];
  const statColors = ['var(--clr-sage)', 'var(--clr-ink)', 'var(--clr-sage)', 'var(--clr-rose)'];
  return (
    <section id="progress" data-screen-label="Progress" className="lp-pad" style={{ padding: '92px 24px', scrollMarginTop: 80 }}>
      <div style={container}>
        <div className="lp-reveal" style={{ maxWidth: 640, marginBottom: 38 }}><div style={label()}>{t.aLabel}</div><h2 style={h2}>{t.aHead}</h2><p style={{ fontSize: 16, lineHeight: 1.6, color: 'var(--clr-ink-soft)', maxWidth: '56ch', margin: '14px 0 0' }}>{t.aSub}</p></div>
        <div className="lp-reveal" style={{ background: 'var(--clr-surface)', border: '1px solid var(--clr-border)', borderRadius: 22, padding: 26, boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
            <span style={{ fontFamily: 'Fraunces, serif', fontWeight: 600, fontSize: 16, color: 'var(--clr-ink)' }}>📊 {t.progressTitle}</span>
            <span className="vmx-tag-pill" style={{ marginLeft: 'auto' }}>{t.aSample}</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(148px,1fr))', gap: 12, marginBottom: 20 }}>
            {t.aStatLabels.map((lbl, i) => (
              <div key={lbl} className="vmx-stat-card" style={{ textAlign: 'left' }}>
                <div className="vmx-stat-num" style={{ color: statColors[i], fontSize: 26 }}>{t.aStatVals[i]}</div>
                <div className="vmx-stat-lbl">{lbl}</div>
              </div>
            ))}
          </div>
          <div className="lp-stack" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div style={{ background: 'var(--clr-bg)', border: '1px solid var(--clr-border)', borderRadius: 16, padding: 18 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 16 }}>
                <span style={{ fontFamily: 'Fraunces, serif', fontWeight: 600, fontSize: 15, color: 'var(--clr-ink)' }}>{t.aActivityTitle}</span>
                <span style={{ fontFamily: 'var(--vmx-mono)', fontSize: 10, color: 'var(--clr-ink-soft)' }}>{t.aActivitySub}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 112 }}>
                {ACTIVITY.map((v, i) => (
                  <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, height: '100%', justifyContent: 'flex-end' }}>
                    <div style={{ width: '100%', maxWidth: 26, height: `${Math.round((v / maxA) * 100)}%`, background: 'var(--clr-sage)', borderRadius: '6px 6px 0 0', minHeight: 5 }} />
                    <span style={{ fontFamily: 'var(--vmx-mono)', fontSize: 10, color: 'var(--clr-ink-soft)' }}>{t.aDays[i]}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ background: 'var(--clr-bg)', border: '1px solid var(--clr-border)', borderRadius: 16, padding: 18, display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <div style={{ fontFamily: 'Fraunces, serif', fontWeight: 600, fontSize: 15, color: 'var(--clr-ink)', marginBottom: 11 }}>{t.aMasteryTitle}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                  {MASTERY.map((m) => {
                    const cls = m.pct >= 75 ? '' : m.pct >= 60 ? 'mid' : 'low';
                    return (
                      <div key={m.name}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, marginBottom: 4, color: 'var(--clr-ink)' }}><span>{m.name}</span><span style={{ fontFamily: 'var(--vmx-mono)', color: 'var(--clr-ink-soft)' }}>{m.pct}%</span></div>
                        <div className="vmx-bar"><div className={`vmx-bar-fill ${cls}`} style={{ width: `${m.pct}%`, transition: 'width .8s ease' }} /></div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div style={{ borderTop: '1px dashed var(--clr-border)', paddingTop: 13 }}>
                <div style={{ fontFamily: 'Fraunces, serif', fontWeight: 600, fontSize: 15, color: 'var(--clr-ink)', marginBottom: 10 }}>{t.aConfTitle}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12.5, color: 'var(--clr-ink)' }}><span style={{ width: 92, color: 'var(--clr-ink-soft)', flexShrink: 0 }}>{t.aConfConfident}</span><div className="vmx-bar" style={{ flex: 1 }}><div className="vmx-bar-fill" style={{ width: '88%' }} /></div><span style={{ fontFamily: 'var(--vmx-mono)', flexShrink: 0 }}>88%</span></div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12.5, color: 'var(--clr-ink)' }}><span style={{ width: 92, color: 'var(--clr-ink-soft)', flexShrink: 0 }}>{t.aConfUnsure}</span><div className="vmx-bar" style={{ flex: 1 }}><div className="vmx-bar-fill low" style={{ width: '44%' }} /></div><span style={{ fontFamily: 'var(--vmx-mono)', flexShrink: 0 }}>44%</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
