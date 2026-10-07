// ============================================================
// LandingBody — hero to footer for LandingView
// ============================================================
// Redesigned 2026-10-07. One story, built from the real product and real
// numbers:
//   1. Daylight: the hero is a real bank question you can answer over a horse
//      skull from a CT scan (it turns to the incisors once you answer), then
//      the wall of pre-exam worries and the card that answers them, then the
//      four things every question does.
//   2. Night: Panic Mode, sized by the same PANIC_SIZE the app uses.
//   3. The reading room: a CC BY 4.0 radiograph with the dataset's own label
//      and a dog skull from a CT scan drawn as an X-ray.
//   4. Morning: what else the app holds, the real subject list, your home
//      (a recording of the real app), the last call.
// Nothing here is a typed-in number: counts come from q-counts.js, dates from
// the faculty timetable, sizes from exam-pool.js, review gaps from sm2.js, the
// notes figures from the notes registry, the release from the changelog.
//
// Motion is CSS (transform and opacity) switched on by IntersectionObserver
// classes; there is no scroll listener and no hover physics (the contract in
// tests/unit/ui-interaction-contract.test.mjs). Pointer events exist only for
// direct manipulation (dragging a note, turning a skull). Reduced motion is
// decided per effect in styles-landing.css.
//
// Receives everything as props from LandingView (single state owner).
// ============================================================

import { useEffect, useMemo, useRef, useState } from 'react';
import Mochi from '../../components/Mochi.jsx';
import NavIcon from '../../components/NavIcon.jsx';
import XraySkull from './XraySkull.jsx';
import { HERO_QUESTION } from './dict.js';
import { Q_COUNTS_BY_SUBJECT, Q_VISIBLE_COUNTS_BY_SUBJECT } from '../../data/q-counts.js';
import { SEMESTER } from '../../data/semester.js';
import { NOTE_TOPIC_KEYS, SUBJECTS_WITH_NOTES } from '../../data/notes-registry.generated.js';
import { LATEST_CHANGELOG } from '../../data/latest-changelog.generated.js';
import { ATLAS_ASSETS } from '../../data/atlas-assets.generated.js';
import { EMPTY_ART, BADGE_ART, SQUAD_MASCOTS, SUBJECT_MOCHI } from '../../data/art.js';
import { PANIC_SIZE } from '../../lib/exam-pool.js';
import { initCard, updateCard } from '../../hooks/sm2.js';
import { facultyExamWindow, splitCountdown } from '../../lib/exam-countdown.js';

// ---- Numbers, derived once at module load from the generated data ----
const SUBJECTS_WITH_QUESTIONS = Object.values(Q_COUNTS_BY_SUBJECT).filter((n) => n > 0).length;
// The number a student can open today: hidden topics are not on offer.
const VISIBLE_TOTAL = Object.values(Q_VISIBLE_COUNTS_BY_SUBJECT).reduce((a, b) => a + b, 0);
// The review gaps a card gets when it keeps being answered "good", straight
// from the app's own SM-2: no copy of the schedule lives on this page.
const REVIEW_GAPS = (() => {
  let card = initCard('landing');
  return [0, 1, 2].map(() => { card = updateCard(card, 2); return card.interval; });
})();
const NOTE_TOPICS = NOTE_TOPIC_KEYS.size;
const NOTE_SUBJECTS = SUBJECTS_WITH_NOTES.size;
// Atlas specimens by id, so a regenerated asset hash never breaks the page.
const asset = (id, profile) => ({ model: ATLAS_ASSETS[id]?.profiles?.[profile]?.model, poster: ATLAS_ASSETS[id]?.poster });
const HORSE = asset('equine-skull-edinburgh', 'detail');
const DOG = asset('canine-skull-nih282', 'quick');
// In the hero the skull floats in the top of its lightbox, above the card:
// the view centre sits below the skull.
const HORSE_REST = { yaw: -0.5, pitch: 0.1, dist: 4, at: [0, -0.62, 0] };
const two = (n) => String(n).padStart(2, '0');
const LETTERS = 'ABCDEFGHIJ';

// ---- Thai-safe word units ----
// Thai has no spaces, so splitting on whitespace would animate a whole line
// as one word. Intl.Segmenter gives real word boundaries; each word becomes an
// inline-block, which also gives the browser a clean place to break the line.
const segmenter = typeof Intl !== 'undefined' && Intl.Segmenter ? new Intl.Segmenter(['th', 'en'], { granularity: 'word' }) : null;
function wordsOf(text) {
  if (!text) return [];
  if (!segmenter) return [text];
  return Array.from(segmenter.segment(text), (s) => s.segment);
}

/** Words that rise out of a mask. `start` offsets the stagger so lines chain.
 *  Each word is an inline-block, and accessible names put a space between
 *  inline-blocks ("ซ้อม โจทย์ ทุก วิชา"), so a screen reader gets the line once,
 *  as written, and the animated copy is hidden from it. */
function Rise({ text, start = 0 }) {
  return (
    <>
      <span className="lp-sr">{text}</span>
      <span aria-hidden="true">
        {wordsOf(text).map((w, i) => (
          /^\s+$/.test(w)
            ? <span key={i}>{w}</span>
            : <span key={i} className="lp-w"><span className="lp-w-in" style={{ '--i': start + i }}>{w}</span></span>
        ))}
      </span>
    </>
  );
}

/** Copy with \n becomes one block line per part, so Thai breaks between phrases. */
function Lines({ text }) {
  const parts = String(text || '').split('\n');
  if (parts.length === 1) return text;
  return parts.map((part, i) => <span key={i} className="lp-line">{part}</span>);
}

/** Becomes true once the element has been on screen (and stays true). */
function useSeen(ref, { rootMargin = '0px 0px -12% 0px', threshold = 0.15 } = {}) {
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (typeof IntersectionObserver === 'undefined') { setSeen(true); return undefined; }
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setSeen(true); io.disconnect(); }
    }, { rootMargin, threshold });
    io.observe(el);
    return () => io.disconnect();
  }, [ref, rootMargin, threshold]);
  return seen;
}

/** True while the element is on screen. */
function useOnScreen(ref, rootMargin = '0px') {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return undefined;
    const io = new IntersectionObserver(([entry]) => setOn(entry.isIntersecting), { rootMargin });
    io.observe(el);
    return () => io.disconnect();
  }, [ref, rootMargin]);
  return on;
}

const prefersReduced = () => typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

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

/** A number whose digits roll into place like a counter, once seen. Each
 *  column is as wide as its own final digit (an invisible copy sets it), so
 *  the landed number spaces like plain text. */
function Roll({ value, on }) {
  const text = value.toLocaleString('en-US');
  let digit = 0;
  return (
    <span className="lp-roll">
      <span className="lp-sr">{text}</span>
      {[...text].map((ch, i) => {
        if (!/\d/.test(ch)) return <span key={i} className="lp-roll-sep" aria-hidden="true">{ch}</span>;
        const order = digit++;
        return (
          <span key={i} className="lp-roll-col" aria-hidden="true">
            <span className="lp-roll-size">{ch}</span>
            <span className="lp-roll-strip" style={{ '--d': on ? Number(ch) : 0, '--i': order }}>
              {'0123456789'.split('').map((d) => <span key={d}>{d}</span>)}
            </span>
          </span>
        );
      })}
    </span>
  );
}

/* ---- Countdown: the FACULTY exam week, live, with no year in it ----
   A signed-out reader has no year yet. Every year sits the same week, so the
   page counts to the week the faculty published, and tells the reader that
   their own papers appear once they pick a year inside the app. */
function Countdown({ t, variant = 'hero' }) {
  const now = useNow();
  const w = facultyExamWindow(new Date(now));
  if (!w) return null;
  const c = splitCountdown(w.targetMs - now);
  const cells = [c.days, c.hours, c.minutes, c.seconds];
  const termName = t.cdTerm?.[w.term] || w.label;
  const term = w.during ? `${t.cdDuring}${termName}` : termName;
  const semester = t.cdSemester || SEMESTER.short;
  const range = t.cdRange ? t.cdRange(w.start, w.end) : w.range;
  const line = w.during ? t.cdDuringLine : variant === 'night' ? t.cdPanicLine : t.cdLine;
  return (
    <div className={`lp-countdown is-${variant}${w.during ? ' is-sitting' : ''}`} role="group" aria-label={`${term} ${semester}, ${range}, ${line}`}>
      <div className="lp-countdown-head">
        <span className="lp-countdown-term">{term} {semester}</span>
        <span className="lp-countdown-range">{range}</span>
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

/** A hand-drawn ring and strike, drawn on when they mount. */
function PenRing() {
  return (
    <svg className="lp-pen-ring" viewBox="0 0 400 80" preserveAspectRatio="none" aria-hidden="true">
      <path pathLength="1" d="M18 44C20 18 120 6 214 8c96 2 172 12 170 34-2 24-96 32-190 31C96 72 12 66 14 42c1-12 22-22 60-28" />
    </svg>
  );
}
function PenStrike() {
  return (
    <svg className="lp-pen-strike" viewBox="0 0 400 20" preserveAspectRatio="none" aria-hidden="true">
      <path pathLength="1" d="M4 12C90 7 180 15 260 9s110 2 136-1" />
    </svg>
  );
}

/** One single-choice question as native radios: arrow keys, screen readers
 *  and form semantics come with the platform. */
// The group is named by the visible question, whose id is the radios' name.
function ChoiceList({ name, options, picked, revealed, answer, onPick, wrong, dark = false, columns = 1 }) {
  return (
    <fieldset className={`lp-choices${columns === 2 ? ' is-two' : ''}`} aria-labelledby={name}>
      {options.map((text, i) => {
        const isAnswer = i === answer;
        const state = !revealed ? (picked === i ? 'is-picked' : '') : isAnswer ? 'is-answer' : picked === i ? 'is-miss' : 'is-other';
        return (
          <label key={text} className={`lp-opt ${dark ? 'is-dark ' : ''}${state}`} style={{ '--i': i }}>
            <input
              type="radio"
              className="lp-opt-input"
              name={name}
              value={i}
              checked={picked === i}
              disabled={revealed}
              onChange={() => onPick(i)}
            />
            <span className="lp-opt-letter" aria-hidden="true">{LETTERS[i]}</span>
            <span className="lp-opt-body">
              <span className="lp-opt-text" lang={/[ก-๛]/.test(text) ? 'th' : undefined}>{text}{revealed && !isAnswer && <PenStrike />}</span>
              {revealed && !isAnswer && wrong?.[i] && <span className="lp-opt-why" lang="th">{wrong[i]}</span>}
            </span>
            {revealed && isAnswer && <PenRing />}
          </label>
        );
      })}
    </fieldset>
  );
}

// ============================================================
// Hero
// ============================================================
function QuestionCard({ p }) {
  const { t } = p;
  const Q = HERO_QUESTION;
  const ref = useRef(null);
  const onScreen = useOnScreen(ref);
  const [elapsed, setElapsed] = useState(0);
  const revealed = p.heroRevealed;
  // A "time on this question" clock, like the app's, only while the card is
  // on screen and unanswered.
  useEffect(() => {
    if (!onScreen || revealed) return undefined;
    const id = window.setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => window.clearInterval(id);
  }, [onScreen, revealed]);
  const picked = p.heroPicked;
  const right = picked === Q.answer;
  return (
    <div ref={ref} className={`lp-qcard${revealed ? ' is-revealed' : ''}`}>
      <div className="lp-qcard-top">
        <span className="lp-qcard-label"><NavIcon name="check" size={13} />{t.cardLabel}</span>
        <span className="lp-qcard-meta">{Q.tag}, {t.cardTopic}</span>
        <button
          type="button"
          className={`lp-qcard-save${p.heroBookmarked ? ' is-on' : ''}`}
          onClick={() => p.setHeroBookmarked((b) => !b)}
          aria-label={p.heroBookmarked ? t.unbookmark : t.bookmark}
          aria-pressed={p.heroBookmarked}
        >
          <NavIcon name="bookmark" size={18} filled={p.heroBookmarked} />
        </button>
      </div>
      <div className="lp-qcard-bar" aria-hidden="true"><span style={{ '--p': revealed ? 1 : picked !== null ? 0.6 : 0.2 }} /></div>
      <div className="lp-qcard-clock" aria-hidden="true">{two(Math.floor(elapsed / 60))}:{two(elapsed % 60)}</div>
      <p className="lp-qcard-q" id="lp-hero-q" lang="th">{Q.q}</p>
      {t.cardThaiNote && <p className="lp-qcard-note">{t.cardThaiNote}</p>}
      <ChoiceList
        name="lp-hero-q"
        options={Q.options}
        picked={picked}
        revealed={revealed}
        answer={Q.answer}
        wrong={Q.wrong}
        onPick={(i) => { if (!revealed) p.setHeroPicked(i); }}
      />
      {!revealed && (
        <div className="lp-qcard-conf">
          <span id="lp-conf-q">{t.heroConfQ}</span>
          <div role="group" aria-labelledby="lp-conf-q">
            {t.conf.map((c, i) => (
              <button key={c} type="button" className={`lp-chip${p.heroConfidence === i ? ' is-on' : ''}`} aria-pressed={p.heroConfidence === i} onClick={() => p.setHeroConfidence(i)}>{c}</button>
            ))}
          </div>
        </div>
      )}
      {revealed && (
        <div className="lp-qcard-explain" aria-live="polite">
          <div className="lp-qcard-verdict-row">
            <Mochi state={right ? 'correct' : 'encourage'} size={44} animate slot="landing-verdict" />
            <p className={`lp-qcard-verdict ${right ? 'is-right' : 'is-wrong'}`}>{right ? t.correct : t.wrong}</p>
          </div>
          <p className="lp-qcard-why" lang="th"><b>{t.why}</b> {Q.why}</p>
          <details className="lp-qcard-note2">
            <summary>{t.noteHead}</summary>
            <p lang="th">{Q.note}</p>
          </details>
          <p className="lp-qcard-src"><b>{t.sourceLabel}</b> {t.sourceDoc}</p>
          {!right && <p className="lp-qcard-kept"><NavIcon name="repeat" size={15} />{t.keptLine}</p>}
          <div className="lp-sticky" role="note"><b>{t.tipLabel}</b><span lang="th">{Q.tip}</span></div>
        </div>
      )}
      <div className="lp-qcard-foot">
        {revealed ? (
          <>
            <button type="button" className="lp-link-btn" onClick={() => { p.setHeroPicked(null); p.setHeroRevealed(false); setElapsed(0); }}>{t.reset}</button>
            <button type="button" className="vmx-btn vmx-btn-primary lp-go" onClick={(e) => p.portal(() => p.onPickSubject(Q.year, Q.subject))(e)}>
              {t.keepGoing} <span aria-hidden="true">→</span>
            </button>
          </>
        ) : (
          <>
            <span className="lp-qcard-demo">{t.demoNote}</span>
            <button type="button" className="vmx-btn vmx-btn-primary" disabled={picked === null} onClick={p.onCheckHero}>{t.check}</button>
          </>
        )}
      </div>
    </div>
  );
}

function Hero({ p }) {
  const { t } = p;
  const statsRef = useRef(null);
  const statsSeen = useSeen(statsRef, { rootMargin: '0px', threshold: 0 });
  const l1 = wordsOf(t.heroL1).length;
  const l2 = wordsOf(t.heroL2).length;
  return (
    <section id="lp-top" data-screen-label="Hero" className="lp-hero">
      <div className="lp-hero-paper" aria-hidden="true" />
      <div className="lp-wrap lp-hero-grid">
        <div className="lp-hero-copy">
          <p className="lp-eyebrow lp-in" style={{ '--i': 0 }}>
            <Mochi state="wave" size={30} animate slot="landing-welcome" />
            <span>{t.heroEyebrow}</span>
          </p>
          <h1 className="lp-hero-title">
            <span className="lp-line"><Rise text={t.heroL1} start={1} /></span>
            <span className="lp-line">
              {t.heroL2 && <><Rise text={t.heroL2} start={1 + l1} />{' '}</>}
              <em className="lp-mark"><Rise text={t.heroEm} start={1 + l1 + l2} /></em>
            </span>
          </h1>
          <p className="lp-hero-sub lp-in" style={{ '--i': 6 }}>{t.heroSub}</p>
          <div className="lp-hero-ctas lp-in" style={{ '--i': 7 }}>
            <button type="button" onClick={p.portal(p.onEnterApp)} className="vmx-btn vmx-btn-primary lp-cta-main lp-cta-glow">
              {t.heroCta1} <span aria-hidden="true">→</span>
            </button>
            <a href="#subjects" className="vmx-btn vmx-btn-ghost lp-cta-ghost">{t.heroCta2}</a>
          </div>
          <dl ref={statsRef} className="lp-stats lp-in" style={{ '--i': 8 }} aria-label={t.statsLabel}>
            <div><dt>{t.statOpen}</dt><dd><Roll value={VISIBLE_TOTAL} on={statsSeen} /></dd></div>
            <div><dt>{t.statSubjects}</dt><dd><Roll value={SUBJECTS_WITH_QUESTIONS} on={statsSeen} /></dd></div>
            <div><dt>{t.statNotes}</dt><dd><Roll value={NOTE_TOPICS} on={statsSeen} /></dd></div>
          </dl>
        </div>
        <div className="lp-hero-stage lp-in" style={{ '--i': 3 }}>
          {HORSE.model && (
            <div className="lp-lightbox">
              <XraySkull
                model={HORSE.model}
                poster={HORSE.poster}
                label={t.skullLabel}
                rest={HORSE_REST}
                spin={0.18}
                className="is-hero"
              />
              <span className="lp-lightbox-credit">{t.skullCredit}</span>
            </div>
          )}
          <QuestionCard p={p} />
        </div>
      </div>
      <div className="lp-wrap lp-hero-count lp-in" style={{ '--i': 9 }}>
        <Countdown t={t} variant="hero" />
      </div>
    </section>
  );
}

// ============================================================
// Marquee of every real subject
// ============================================================
const subjectLabel = (t, s) => t.subjNames?.[s.id] || s.name;

function Marquee({ p }) {
  const { t } = p;
  const chips = p.realSubjects;
  const half = Math.ceil(chips.length / 2);
  const rows = [chips.slice(0, half), chips.slice(half)];
  return (
    <section className="lp-marquee" aria-label={t.marqueeLabel}>
      {rows.map((row, r) => (
        <div key={r} className={`lp-marquee-viewport${r ? ' is-reverse' : ''}`}>
          <div className="lp-marquee-track">
            {[0, 1].map((copy) => (
              <div key={copy} className="lp-marquee-run" aria-hidden={copy === 1 ? 'true' : undefined}>
                {row.map((s) => (
                  <button key={`${copy}-${s.id}`} type="button" className="lp-marquee-chip" style={{ '--chip': s.color }} onClick={(e) => p.portal(() => p.onPickSubject(s.year, s.id))(e)} tabIndex={copy === 1 ? -1 : 0}>
                    <span className="lp-marquee-dot" aria-hidden="true" />
                    <span className="lp-marquee-name">{subjectLabel(t, s)}</span>
                    <span className="lp-marquee-count">{s.count.toLocaleString('en-US')} {t.qWord}</span>
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}

// ============================================================
// The wall of pre-exam worries, and the card that answers them
// ============================================================
// Positions are design, not data: where each note sits and leans.
const NOTE_LAYOUT = [
  { x: 4, y: 6, r: -6, c: 'gold' },
  { x: 36, y: 2, r: 3, c: 'sage' },
  { x: 68, y: 8, r: -2, c: 'rose' },
  { x: 10, y: 50, r: 4, c: 'sky' },
  { x: 42, y: 46, r: -4, c: 'gold' },
  { x: 72, y: 52, r: 5, c: 'sage' },
];

function Note({ text, layout, index }) {
  const ref = useRef(null);
  // Drag to move: direct manipulation only, translate by ref (no re-render
  // per frame). The note stays readable and in place without it.
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    let sx = 0, sy = 0, ox = 0, oy = 0, dragging = false, id = null;
    const down = (e) => {
      if (e.button != null && e.button !== 0) return;
      dragging = true; id = e.pointerId; sx = e.clientX; sy = e.clientY;
      el.setPointerCapture?.(id);
      el.classList.add('is-dragging');
    };
    const move = (e) => {
      if (!dragging || e.pointerId !== id) return;
      el.style.setProperty('--dx', `${ox + e.clientX - sx}px`);
      el.style.setProperty('--dy', `${oy + e.clientY - sy}px`);
    };
    const up = (e) => {
      if (!dragging || e.pointerId !== id) return;
      dragging = false;
      ox += e.clientX - sx; oy += e.clientY - sy;
      el.classList.remove('is-dragging');
    };
    el.addEventListener('pointerdown', down);
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerup', up);
    el.addEventListener('pointercancel', up);
    return () => {
      el.removeEventListener('pointerdown', down);
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerup', up);
      el.removeEventListener('pointercancel', up);
    };
  }, []);
  return (
    <li
      ref={ref}
      className={`lp-note is-${layout.c}`}
      style={{ '--x': `${layout.x}%`, '--y': `${layout.y}%`, '--r': `${layout.r}deg`, '--i': index }}
    >
      <span lang="th"><Lines text={text} /></span>
    </li>
  );
}

function Wall({ p }) {
  const { t } = p;
  const ref = useRef(null);
  const seen = useSeen(ref, { threshold: 0.2 });
  return (
    <section ref={ref} className={`lp-wall${seen ? ' is-in' : ''}`} data-screen-label="Worries">
      <div className="lp-wall-board">
        <div className="lp-wrap">
          <p className="lp-kicker lp-reveal">{t.wallKicker}</p>
          <h2 className="lp-h2 lp-reveal"><Lines text={t.wallHead} /></h2>
          <ul className="lp-notes" aria-label={t.wallKicker}>
            {t.wallNotes.map((text, i) => <Note key={text} text={text} layout={NOTE_LAYOUT[i % NOTE_LAYOUT.length]} index={i} />)}
          </ul>
          <p className="lp-wall-drag" aria-hidden="true">{t.wallDrag}</p>
        </div>
      </div>
      <div className="lp-wall-answer">
        <div className="lp-wrap">
          <div className="lp-answer-card lp-reveal">
            <h3>{t.wallAnswerHead}</h3>
            <ul>
              {t.wallAnswers.map((a) => <li key={a}><NavIcon name="check" size={18} /><span>{a}</span></li>)}
            </ul>
            <p className="lp-answer-free">
              {t.wallFreePre}
              <span className="lp-circled">
                {t.wallFree}
                <svg viewBox="0 0 120 60" preserveAspectRatio="none" aria-hidden="true"><path pathLength="1" d="M70 8C38 2 6 14 8 32s40 24 70 20 38-16 32-30C104 8 80 4 52 8" /></svg>
              </span>
              {t.wallFreePost}
            </p>
            <button type="button" className="vmx-btn vmx-btn-primary lp-cta-main" onClick={p.portal(p.onEnterApp)}>{t.start} <span aria-hidden="true">→</span></button>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// How every question works: a pinned stage and four steps
// ============================================================
const TOP_BANK = Object.entries(Q_VISIBLE_COUNTS_BY_SUBJECT).filter(([, n]) => n > 0).sort((a, b) => b[1] - a[1]).slice(0, 5);

function StepVisual({ step, t, names }) {
  const Q = HERO_QUESTION;
  if (step === 'bank') {
    return (
      <div className="lp-vis lp-vis-bank">
        <p className="lp-vis-label">{t.howBankLabel}</p>
        {TOP_BANK.map(([id, n], i) => (
          <div key={id} className="lp-bar" style={{ '--i': i, '--w': n / TOP_BANK[0][1] }}>
            <span className="lp-bar-name">{names[id] || id}</span>
            <span className="lp-bar-track"><span /></span>
            <span className="lp-bar-n">{n.toLocaleString('en-US')}</span>
          </div>
        ))}
      </div>
    );
  }
  if (step === 'why') {
    return (
      <div className="lp-vis lp-vis-why">
        {Q.options.map((text, i) => (
          <div key={text} className={`lp-vis-opt${i === Q.answer ? ' is-answer' : ''}`} style={{ '--i': i }} lang="th">
            <span className="lp-vis-opt-text">{text}{i !== Q.answer && <PenStrike />}</span>
            {i !== Q.answer && <span className="lp-vis-opt-why">{Q.wrong[i]}</span>}
            {i === Q.answer && <PenRing />}
          </div>
        ))}
        <p className="lp-vis-note"><b>{t.noteHead}</b> <span lang="th">{Q.noteLead}</span></p>
      </div>
    );
  }
  if (step === 'source') {
    return (
      <div className="lp-vis lp-vis-source">
        <div className="lp-doc" aria-hidden="true">
          <span /><span /><span />
          <b>{Q.page}</b>
        </div>
        <div className="lp-cite">
          <p><span>{t.sourceLabel}</span>{t.sourceDoc}</p>
          <p><span>{t.shelfLabel}</span>{t.shelfLine}</p>
        </div>
      </div>
    );
  }
  return (
    <div className="lp-vis lp-vis-review">
      <p className="lp-vis-label">{t.howReviewLabel}</p>
      <div className="lp-cards">
        {REVIEW_GAPS.map((d, i) => (
          <div key={d} className="lp-card" style={{ '--i': i }}>
            <span className="lp-card-day">{t.howReviewDays(d)}</span>
            <span className="lp-card-q" lang="th">{Q.q}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function HowItWorks({ p }) {
  const { t } = p;
  const [active, setActive] = useState(0);
  const listRef = useRef(null);
  const names = useMemo(() => Object.fromEntries(p.realSubjects.map((s) => [s.id, subjectLabel(t, s)])), [p.realSubjects, t]);
  useEffect(() => {
    const list = listRef.current;
    if (!list || typeof IntersectionObserver === 'undefined') return undefined;
    const steps = Array.from(list.querySelectorAll('[data-step]'));
    // A step is current while it crosses the middle band of the screen.
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) setActive(Number(e.target.dataset.step)); });
    }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });
    steps.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);
  return (
    <section id="solution" data-screen-label="How it works" className="lp-how">
      <div className="lp-wrap">
        <h2 className="lp-h2 lp-reveal">{t.howHead}</h2>
        <div className="lp-how-grid">
          <div className="lp-how-stage" aria-hidden="true">
            <div className="lp-how-frame">
              {t.howSteps.map((s, i) => (
                <div key={s.key} className={`lp-how-panel${active === i ? ' is-on' : ''}`}><StepVisual step={s.key} t={t} names={names} /></div>
              ))}
              <div className="lp-how-dots">{t.howSteps.map((s, i) => <span key={s.key} className={active === i ? 'is-on' : ''} />)}</div>
            </div>
          </div>
          {/* React owns className; the reveal observer adds `in` with classList,
              so per-step state rides on data-on instead of a class. */}
          <ol ref={listRef} className="lp-how-steps">
            {t.howSteps.map((s, i) => (
              <li key={s.key} data-step={i} data-on={active === i ? 'true' : 'false'} className="lp-how-step lp-reveal">
                <span className="lp-how-num" aria-hidden="true">{two(i + 1)}</span>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
                <div className="lp-how-inline" aria-hidden="true"><StepVisual step={s.key} t={t} names={names} /></div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// Night: Panic Mode
// ============================================================
const DECK_MAX = 24;
function NightPanic({ p }) {
  const { t } = p;
  const ref = useRef(null);
  const lit = useSeen(ref, { threshold: 0.2 });
  const n = PANIC_SIZE[p.panicTime] || PANIC_SIZE['30'];
  const timed = p.panicTime !== 'tonight';
  const shown = Math.min(n, DECK_MAX);
  return (
    <section id="panic" ref={ref} data-screen-label="Panic Mode" className={`lp-night${lit ? ' is-lit' : ''}`}>
      <div className="lp-night-glow" aria-hidden="true" />
      <div className="lp-dust" aria-hidden="true">{Array.from({ length: 14 }, (_, i) => <span key={i} style={{ '--i': i, '--x': `${((i * 37) % 46) + 50}%`, '--y': `${((i * 53 + 17) % 70) + 10}%` }} />)}</div>
      <div className="lp-wrap lp-night-grid">
        <div className="lp-night-copy">
          <p className="lp-kicker lp-reveal">{t.panicKicker}</p>
          <h2 className="lp-h2 lp-reveal"><Lines text={t.panicHead} /></h2>
          <p className="lp-night-calm lp-reveal">{t.panicCalm}</p>
          <p className="lp-night-desc lp-reveal">{t.panicDesc}</p>
          <div className="lp-night-pick lp-reveal">
            <p id="lp-panic-q">{t.panicTimeQ}</p>
            <div role="group" aria-labelledby="lp-panic-q">
              {t.panicTimes.map((pt) => (
                <button key={pt.key} type="button" className={`lp-chip is-night${p.panicTime === pt.key ? ' is-on' : ''}`} aria-pressed={p.panicTime === pt.key} onClick={() => p.setPanicTime(pt.key)}>{pt.label}</button>
              ))}
            </div>
            <p className="lp-night-size" aria-live="polite">{t.panicSize(n, timed)}</p>
          </div>
          <div className="lp-reveal">
            <button type="button" onClick={(e) => p.portal(() => p.onStartPanic(p.panicTime))(e)} className="vmx-btn lp-cta-gold">{t.panicCta} <span aria-hidden="true">→</span></button>
          </div>
        </div>
        <div className="lp-night-side">
          <div className="lp-deck" aria-hidden="true">
            {Array.from({ length: DECK_MAX }, (_, i) => (
              <span key={i} className={i < shown ? 'is-on' : ''} style={{ '--i': i, '--k': (i - (shown - 1) / 2) / Math.max(1, shown - 1) }} />
            ))}
            <b className="lp-deck-n">{n}</b>
          </div>
          <Countdown t={t} variant="night" />
        </div>
      </div>
    </section>
  );
}

// ============================================================
// The reading room: a real radiograph and the Atlas skull
// ============================================================
function ReadingRoom({ p }) {
  const { t } = p;
  const ref = useRef(null);
  const seen = useSeen(ref, { threshold: 0.25 });
  const onScreen = useOnScreen(ref);
  const [left, setLeft] = useState(300);
  useEffect(() => {
    if (!onScreen || p.labRevealed || left <= 0) return undefined;
    const id = window.setInterval(() => setLeft((s) => Math.max(0, s - 1)), 1000);
    return () => window.clearInterval(id);
  }, [onScreen, p.labRevealed, left]);
  const zoom = p.labZoom;
  return (
    <section id="lab" ref={ref} data-screen-label="Lab" className={`lp-room${seen ? ' is-in' : ''}`}>
      <div className="lp-wrap">
        <p className="lp-kicker lp-reveal">{t.labKicker}</p>
        <h2 className="lp-h2 lp-reveal"><Lines text={t.labSecHead} /></h2>
        <p className="lp-room-sub lp-reveal">{t.labSecSub}</p>
        <div className="lp-room-grid">
          <div className="lp-station lp-reveal">
            <div className="lp-station-head">
              <span>{t.labStation}</span>
              <span className="lp-station-clock" role="timer" aria-label={t.labTimer}>{two(Math.floor(left / 60))}:{two(left % 60)}</span>
            </div>
            <div className="lp-film">
              <div className="lp-film-zoom" style={{ '--z': zoom }}>
                <img
                  src="/landing/vetxray-canine-cardiomegaly-1600.webp"
                  srcSet="/landing/vetxray-canine-cardiomegaly-960.webp 960w, /landing/vetxray-canine-cardiomegaly-1600.webp 1600w"
                  sizes="(max-width: 900px) 92vw, 640px"
                  width={1600}
                  height={1231}
                  alt={t.labImgAlt}
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <span className="lp-film-scan" aria-hidden="true" />
              <div className="lp-film-tools">
                <button type="button" className="lp-tool" onClick={() => p.setLabZoom((z) => Math.max(1, +(z - 0.5).toFixed(1)))} aria-label={t.labZoomOut} disabled={zoom <= 1}><NavIcon name="zoom-out" size={16} /></button>
                <span className="lp-tool-z" aria-live="polite">{Math.round(zoom * 100)}%</span>
                <button type="button" className="lp-tool" onClick={() => p.setLabZoom((z) => Math.min(3, +(z + 0.5).toFixed(1)))} aria-label={t.labZoomIn} disabled={zoom >= 3}><NavIcon name="zoom-in" size={16} /></button>
                <button type="button" className="lp-tool" onClick={() => p.setLabZoom(1)} aria-label={t.labZoomReset} disabled={zoom === 1}><NavIcon name="undo" size={15} /></button>
              </div>
            </div>
            <p className="lp-station-prompt" id="lp-lab-q">{t.labPrompt}</p>
            <ChoiceList
              name="lp-lab-q"
              options={t.labOptions}
              picked={p.labPicked}
              revealed={p.labRevealed}
              answer={0}
              onPick={(i) => { if (!p.labRevealed) p.setLabPicked(i); }}
              dark
              columns={2}
            />
            {p.labRevealed && <p className="lp-station-explain" aria-live="polite">{t.labExplain}</p>}
            <div className="lp-station-foot">
              <span className="lp-station-credit">{t.labCredit}</span>
              {p.labRevealed
                ? <button type="button" className="vmx-btn lp-cta-light" onClick={(e) => p.portal(p.onOpenLab)(e)}>{t.labNext} <span aria-hidden="true">→</span></button>
                : <button type="button" className="vmx-btn lp-cta-light" disabled={p.labPicked === null} onClick={p.onCheckLab}>{t.check}</button>}
            </div>
          </div>
          <div className="lp-atlas lp-reveal">
            {DOG.model && <XraySkull model={DOG.model} poster={DOG.poster} label={t.atlasLabel} hint={t.atlasHint} />}
            <h3><Lines text={t.atlasHead} /></h3>
            <p>{t.atlasBody}</p>
            <a className="lp-atlas-cta" href="/app/atlas">{t.atlasCta} <span aria-hidden="true">→</span></a>
            <p className="lp-atlas-credit">{t.atlasCredit}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// Morning: what else the app holds, each tile a small working demo
// ============================================================
const BADGE_ROW = ['streak-7', 'questions-1000', 'night-owl', 'panic-survivor'].map((k) => BADGE_ART[k]).filter(Boolean);

function TileDemo({ kind, t }) {
  if (kind === 'exam') {
    return (
      <div className="lp-demo lp-demo-exam" aria-hidden="true">
        <svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="50" className="lp-ring-bg" /><circle cx="60" cy="60" r="50" pathLength="1" className="lp-ring" /></svg>
        <span className="lp-demo-exam-q">{t.demoExamQ(7, 50)}</span>
      </div>
    );
  }
  if (kind === 'notes') {
    return (
      <div className="lp-demo lp-demo-notes" aria-hidden="true">
        <img src={EMPTY_ART.reading.src} alt="" width={240} height={180} loading="lazy" decoding="async" />
        <span className="lp-demo-line is-hl" /><span className="lp-demo-line" /><span className="lp-demo-line is-short" />
      </div>
    );
  }
  if (kind === 'videos') {
    return (
      <div className="lp-demo lp-demo-video" aria-hidden="true">
        <div className="lp-demo-screen"><span className="lp-demo-play" /><span className="lp-demo-progress"><span /></span></div>
        <span className="lp-demo-line" /><span className="lp-demo-line is-short" />
      </div>
    );
  }
  if (kind === 'library') {
    return (
      <div className="lp-demo lp-demo-library" aria-hidden="true">
        <img src={EMPTY_ART.library.src} alt="" width={240} height={180} loading="lazy" decoding="async" />
        <svg viewBox="0 0 200 60" className="lp-demo-ink"><path pathLength="1" d="M8 40c20-24 34 14 54-6s30 10 48-8 34 16 50-4 22 6 32-2" /></svg>
      </div>
    );
  }
  if (kind === 'groups') {
    return (
      <div className="lp-demo lp-demo-race" aria-hidden="true">
        {[0.82, 0.64, 0.9].map((w, i) => <span key={i} className="lp-demo-lane" style={{ '--w': w, '--i': i }}><b /></span>)}
      </div>
    );
  }
  return (
    <div className="lp-badge-row" aria-hidden="true">
      {BADGE_ROW.map((b, j) => <img key={b.src} src={b.src} alt="" width={96} height={96} loading="lazy" decoding="async" style={{ '--j': j }} />)}
    </div>
  );
}

function More({ p }) {
  const { t } = p;
  return (
    <section className="lp-more" data-screen-label="More">
      <div className="lp-wrap">
        <h2 className="lp-h2 lp-reveal">{t.moreHead}</h2>
        <div className="lp-bento">
          {t.more.map((m, i) => (
            <article key={m.key} className={`lp-tile lp-tile-${m.key} lp-reveal`} style={{ '--i': i }}>
              <div className="lp-tile-copy">
                <h3>{m.title}</h3>
                <p>{typeof m.body === 'function' ? m.body(NOTE_TOPICS, NOTE_SUBJECTS) : m.body}</p>
              </div>
              <TileDemo kind={m.key} t={t} />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================
// Subjects: the real list, filterable
// ============================================================
// Words that say nothing about which subject it is, skipped when building
// the two-letter mark for a subject without its own illustration.
const MONO_SKIP = new Set(['veterinary', 'vet', 'and', 'of', 'the', 'for', 'in', 'animal', 'animals', 'companion', 'clinical', 'science', 'sciences', 'c', 'ani', 'cli', 'sci', 'lab', 'laboratory', 'lecture', 'management', 'health', 'practice', 'profession', 'mgt', 'pp']);
const ROMAN = { i: '1', ii: '2', iii: '3', iv: '4', v: '5' };
function monogram(s) {
  const caps = `${s.name || ''} ${s.sub || ''}`.match(/\b[A-Z]{2,4}\b/);
  const capsRoman = String(s.name || '').match(/\b(I{1,3}|IV|V)\b/);
  if (caps) return caps[0] + (capsRoman ? ROMAN[capsRoman[1].toLowerCase()] : '');
  const short = String(s.name || '').trim();
  if (/^[A-Za-z]+ [IVX]+$/.test(short)) return short.split(' ')[0].slice(0, 3).toUpperCase() + (ROMAN[short.split(' ')[1].toLowerCase()] || '');
  const words = String(s.sub || s.name || '').replace(/[^A-Za-z ]/g, ' ').toLowerCase().split(/\s+/).filter(Boolean);
  const roman = words.map((w) => ROMAN[w]).find(Boolean) || '';
  const keep = words.filter((w) => !MONO_SKIP.has(w) && !ROMAN[w]);
  const letters = keep.length >= 2 ? keep[0][0] + keep[1][0] : keep.length === 1 ? keep[0].slice(0, 2) : (s.name || '?').slice(0, 1);
  return (letters + roman).toUpperCase();
}

const FIRST_SHOWN = 12;

function Subjects({ p }) {
  const { t } = p;
  const [year, setYear] = useState(0);
  const [query, setQuery] = useState('');
  const [all, setAll] = useState(false);
  const years = useMemo(() => Array.from(new Set(p.realSubjects.map((s) => s.year))).sort(), [p.realSubjects]);
  const byCount = useMemo(() => [...p.realSubjects].sort((a, b) => b.count - a.count), [p.realSubjects]);
  const q = query.trim().toLowerCase();
  const filtered = p.realSubjects.filter((s) => (!year || s.year === year)
    && (!q || subjectLabel(t, s).toLowerCase().includes(q) || s.name.toLowerCase().includes(q) || String(s.sub).toLowerCase().includes(q)));
  // With no filter, open on the biggest subjects and let the rest unfold.
  const windowed = !year && !q && !all;
  const list = windowed ? byCount.slice(0, FIRST_SHOWN) : filtered;

  // The heading's subject word and the search hint cycle through real names.
  const ref = useRef(null);
  const onScreen = useOnScreen(ref);
  const [tick, setTick] = useState(0);
  useEffect(() => {
    if (!onScreen || prefersReduced()) return undefined;
    const id = window.setInterval(() => setTick((n) => n + 1), 2600);
    return () => window.clearInterval(id);
  }, [onScreen]);
  const cycle = byCount.slice(0, 8);
  const current = cycle.length ? subjectLabel(t, cycle[tick % cycle.length]) : '';

  return (
    <section id="subjects" ref={ref} data-screen-label="Subjects" className="lp-subjects">
      <div className="lp-wrap">
        <div className="lp-subjects-head lp-reveal">
          <div>
            <h2 className="lp-h2 lp-subjects-title" aria-label={t.subjHeadPlain}>
              <span aria-hidden="true">{t.subjHeadPre}<span className="lp-swap"><span key={current} className="lp-swap-in">{current}</span></span>{t.subjHeadPost}</span>
            </h2>
            <p className="lp-lead">{t.subjSub}</p>
          </div>
          <div className="lp-subjects-tools">
            <div className="lp-seg" role="group" aria-label={t.subjAll}>
              <button type="button" className={year === 0 ? 'is-on' : ''} aria-pressed={year === 0} onClick={() => setYear(0)}>{t.subjAll}</button>
              {years.map((y) => <button key={y} type="button" className={year === y ? 'is-on' : ''} aria-pressed={year === y} onClick={() => setYear(y)}>{t.subjYear(y)}</button>)}
            </div>
            <label className="lp-search">
              <NavIcon name="search" size={16} />
              <span className="lp-sr">{t.subjSearch}</span>
              <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder={query ? '' : t.subjSearchTry(current)} enterKeyHint="search" />
            </label>
          </div>
        </div>
        {list.length === 0 ? (
          <p className="lp-subjects-empty">{t.subjEmpty}</p>
        ) : (
          <div className="lp-subject-grid">
            {list.map((s, i) => {
              const art = SUBJECT_MOCHI[s.id];
              return (
                <button key={s.id} type="button" className="lp-subject" style={{ '--chip': s.color, '--i': Math.min(i, 12) }} onClick={(e) => p.portal(() => p.onPickSubject(s.year, s.id))(e)}>
                  <span className="lp-subject-art" aria-hidden="true">
                    {art ? <img src={art.src} alt="" width={72} height={72} loading="lazy" decoding="async" /> : <b>{monogram(s)}</b>}
                  </span>
                  <span className="lp-subject-copy">
                    <span className="lp-subject-year">{t.subjYear(s.year)}</span>
                    <span className="lp-subject-name">{subjectLabel(t, s)}</span>
                    {s.sub && s.sub !== s.name && <span className="lp-subject-sub">{s.sub}</span>}
                  </span>
                  <span className="lp-subject-count"><b>{s.count.toLocaleString('en-US')}</b> {t.qWord}</span>
                  <span className="lp-subject-go" aria-hidden="true">{t.startPractice} →</span>
                </button>
              );
            })}
          </div>
        )}
        {!year && !q && p.realSubjects.length > FIRST_SHOWN && (
          <div className="lp-subjects-more">
            <button type="button" className="vmx-btn vmx-btn-ghost" onClick={() => setAll((v) => !v)} aria-expanded={all}>
              {all ? t.subjLess : t.subjMore(p.realSubjects.length)}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

// ============================================================
// Your home: the real app, recorded, and the desktop screenshot
// ============================================================
function PhoneVideo({ label }) {
  const ref = useRef(null);
  const [failed, setFailed] = useState(false);
  // Plays only while on screen; never under reduced motion or Save-Data,
  // where the first frame (the poster) stays.
  useEffect(() => {
    const v = ref.current;
    if (!v || typeof IntersectionObserver === 'undefined') return undefined;
    const saveData = typeof navigator !== 'undefined' && navigator.connection?.saveData;
    if (prefersReduced() || saveData) return undefined;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        if (v.preload !== 'auto') { v.preload = 'auto'; }
        v.play?.().catch(() => {});
      } else v.pause?.();
    }, { threshold: 0.35 });
    io.observe(v);
    return () => io.disconnect();
  }, []);
  return (
    <div className="lp-phone">
      <div className="lp-phone-notch" aria-hidden="true" />
      {failed ? (
        <img src="/landing/app-tour-poster.webp" alt={label} width={390} height={844} loading="lazy" decoding="async" />
      ) : (
        <video
          ref={ref}
          muted
          loop
          playsInline
          preload="none"
          poster="/landing/app-tour-poster.webp"
          aria-label={label}
          onError={() => setFailed(true)}
        >
          <source src="/landing/app-tour.mp4" type="video/mp4" />
          <source src="/landing/app-tour.webm" type="video/webm" />
        </video>
      )}
    </div>
  );
}

function YourHome({ p }) {
  const { t } = p;
  return (
    <section id="progress" data-screen-label="Your home" className="lp-home">
      <div className="lp-wrap lp-home-grid">
        <div className="lp-reveal">
          <h2 className="lp-h2 lp-home-title">{t.progHead}</h2>
          <p className="lp-lead">{t.progSub}</p>
          <button type="button" onClick={p.portal(p.onEnterApp)} className="vmx-btn vmx-btn-primary lp-cta-main">{t.start} <span aria-hidden="true">→</span></button>
        </div>
        <figure className="lp-devices lp-reveal">
          <div className="lp-shot">
            <div className="lp-shot-chrome" aria-hidden="true"><span /><span /><span /><i>vetmock.com</i></div>
            <img src="/images/landing/home-desktop.jpg" width={1024} height={560} alt={t.progAlt} loading="lazy" decoding="async" />
          </div>
          <PhoneVideo label={t.progVideoLabel} />
          <figcaption>{t.progCaption}</figcaption>
        </figure>
      </div>
    </section>
  );
}

// ============================================================
// The final call and the footer
// ============================================================
const SQUAD = ['clover', 'moocha', 'porky', 'oto', 'glidy'].map((k) => SQUAD_MASCOTS[k]).filter(Boolean);

function FinalCta({ p }) {
  const { t } = p;
  const parts = String(t.ctaPre).split('\n');
  return (
    <section id="cta" data-screen-label="Final CTA" className="lp-final">
      <div className="lp-wrap">
        <div className="lp-final-panel lp-reveal">
          <div className="lp-squad" aria-hidden="true">
            {SQUAD.map((m, i) => <img key={m.id} src={m.src} alt="" width={120} height={120} loading="lazy" decoding="async" style={{ '--i': i }} />)}
          </div>
          <h2 className="lp-final-title">
            {parts.map((part, i) => (
              <span key={i} className="lp-line">
                {part}
                {i === parts.length - 1 && <em className="lp-mark is-night">{t.ctaEm}</em>}
                {i === parts.length - 1 && t.ctaPost}
              </span>
            ))}
          </h2>
          <div className="lp-final-ctas">
            <button type="button" onClick={p.portal(p.onEnterApp)} className="vmx-btn lp-cta-light">{t.cta1} <span aria-hidden="true">→</span></button>
            <a href="#subjects" className="lp-link-light">{t.cta2}</a>
          </div>
        </div>
      </div>
    </section>
  );
}

function formatDate(iso, lang) {
  const [y, m, d] = String(iso).split('-').map(Number);
  if (!y) return iso;
  return new Date(y, m - 1, d).toLocaleDateString(lang === 'th' ? 'th-TH' : 'en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

function Footer({ p }) {
  const { t, lang } = p;
  return (
    <footer data-screen-label="Footer" className="lp-foot">
      <div className="lp-wrap">
        <div className="lp-foot-grid">
          <div>
            <a href="#lp-top" className="lp-brand">
              <img src="/vetmock-logo.svg" width={28} height={28} alt="VetMock logo" />
              <span className="lp-wordmark">Vet<span>Mock</span></span>
            </a>
            <p className="lp-foot-tag">{t.footTagline}</p>
            <p className="lp-foot-small">{t.footIndependent}</p>
            <p className="lp-foot-small">{t.footRelease(LATEST_CHANGELOG.version, formatDate(LATEST_CHANGELOG.date, lang))}</p>
          </div>
          <nav className="lp-foot-links" aria-label={t.menuNavLabel}>
            <a href="/app/privacy#terms">{t.footTerms}</a>
            <a href="/app/privacy#privacy">{t.footPrivacy}</a>
            {t.footLinks.map((l) => <a key={l.href} href={l.href}>{l.label}</a>)}
          </nav>
        </div>
        <details className="lp-credits">
          <summary>{t.footCredits}</summary>
          <ul>
            <li>{t.labCredit}, doi:10.5281/zenodo.19051776</li>
            <li>{t.atlasCredit}</li>
            <li>Horse skull: CT information Dr. Tobias Schwarz; adapted and prepared by Brian Mather, The University of Edinburgh Open.Ed, Royal (Dick) School of Veterinary Studies. CC BY 4.0. Converted and drawn as an X-ray by VetMock.</li>
          </ul>
        </details>
        <div className="lp-foot-bottom">
          <span>{t.copyright}</span>
          <span>{t.footTagline}</span>
        </div>
      </div>
    </footer>
  );
}

export default function LandingBody(p) {
  return (
    <main id="lp-main">
      <Hero p={p} />
      <Marquee p={p} />
      <Wall p={p} />
      <HowItWorks p={p} />
      <NightPanic p={p} />
      <ReadingRoom p={p} />
      <More p={p} />
      <Subjects p={p} />
      <YourHome p={p} />
      <FinalCta p={p} />
      <Footer p={p} />
    </main>
  );
}
