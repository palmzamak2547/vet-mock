// ============================================================
// PanicCard — the first cell of a subject's topic grid during its exam week
// ============================================================
// From the design kit, and the parts that are easy to get wrong:
//
//   • It is ONE grid cell beside รวมทุกหัวข้อ, at the same height. Not a
//     poster above the tabs, not a full-width row — that version was built
//     first and was wrong.
//   • The whole card is a single button. No nested control: "เริ่มทบทวน →"
//     is drawn inside that one button, not as a button of its own.
//   • The artwork is the illustration ALONE on transparency. Every word on
//     the card is real text, so it scales, follows the theme and is read out
//     properly. Nothing here is baked into a picture.
//   • The illustration is sized from the card's HEIGHT and given room above
//     and below to move. It is never `cover`: these are square drawings and
//     cropping them takes the chicken's head, the horse's ears, the fish's
//     fins.
//   • Motion runs once for 3.2s and stops — on mount, hover, focus and press.
//     Only the picture moves; the type, the call to action and the card edge
//     hold still. It stops when the tab is hidden and never starts under
//     prefers-reduced-motion.
//
// The split into two layers is what makes the movement read as an animal
// rather than a sticker sliding: `cut` is where the drawing divides, so a
// chicken's body lifts while its feet stay on the ground.
// ============================================================

import { useCallback, useEffect, useRef, useState } from 'react';
import { panicCardFor } from '../data/panic-cards.js';

const PLAY_MS = 3400;
// The ripple only makes sense where the animal is in water.
const RIPPLE_SUBJECTS = new Set(['aquatic-clinic', 'milk-meat-hygiene']);

export default function PanicCard({ subjectId, subjectName, onStart, questionCount = 25 }) {
  const card = panicCardFor(subjectId);
  const [playing, setPlaying] = useState(false);
  const timer = useRef(0);
  const reduced = useRef(false);

  const stop = useCallback(() => {
    clearTimeout(timer.current);
    setPlaying(false);
  }, []);

  const play = useCallback(() => {
    if (reduced.current || document.hidden) return;
    clearTimeout(timer.current);
    // Off and on again in two frames, so a second press replays rather than
    // landing mid-cycle on a class that is already there.
    setPlaying(false);
    requestAnimationFrame(() => requestAnimationFrame(() => {
      if (reduced.current || document.hidden) return;
      setPlaying(true);
      timer.current = setTimeout(() => setPlaying(false), PLAY_MS);
    }));
  }, []);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => { reduced.current = media.matches; if (media.matches) stop(); };
    sync();
    media.addEventListener('change', sync);
    const onHide = () => { if (document.hidden) stop(); };
    document.addEventListener('visibilitychange', onHide);
    return () => {
      media.removeEventListener('change', sync);
      document.removeEventListener('visibilitychange', onHide);
      clearTimeout(timer.current);
    };
  }, [stop]);

  // Arriving on the subject is one of the moments the kit plays on.
  useEffect(() => { play(); return stop; }, [subjectId, play, stop]);

  if (!card) return null;
  const m = card.motion || { cut: 68, dx: 3, lift: 3, turn: 1 };

  return (
    <button
      type="button"
      className={`vmx-subject-card vmx-panic-card${playing ? ' is-playing' : ''}`}
      data-motif={subjectId}
      onClick={() => { play(); onStart?.(subjectId); }}
      onFocus={play}
      onPointerEnter={(e) => { if (e.pointerType === 'mouse') play(); }}
      aria-label={`Panic Mode เริ่มทบทวนเร่งด่วน ${questionCount} ข้อ วิชา${subjectName || card.th}`}
      style={{
        '--panic-ink': card.ink,
        '--panic-paper': card.paper,
        '--panic-cut': `${m.cut}%`,
        '--panic-dx': `${m.dx}px`,
        '--panic-lift': `${m.lift}px`,
        '--panic-turn': `${m.turn}deg`,
      }}
    >
      {/* Two copies of one drawing: the upper part travels, the lower part
          stays put. Decorative — the button's own label already names the
          subject, so announcing the picture would only repeat it. */}
      <span className="vmx-panic-art vmx-panic-art-base" aria-hidden="true"
        style={{ backgroundImage: `url(${card.art})` }} />
      <span className="vmx-panic-art vmx-panic-art-main" aria-hidden="true"
        style={{ backgroundImage: `url(${card.art})` }} />
      <span className="vmx-panic-scrim" aria-hidden="true" />
      {/* Two rings, for the two subjects whose animal is in water. */}
      {RIPPLE_SUBJECTS.has(subjectId) && (
        <>
          <span className="vmx-panic-ripple" aria-hidden="true" />
          <span className="vmx-panic-ripple" aria-hidden="true" />
        </>
      )}

      <span className="vmx-panic-copy">
        <span className="vmx-panic-kicker">ปี 5 · เทอม 1 · กลางภาค</span>
        <span className="vmx-panic-title">Panic Mode</span>
        <span className="vmx-panic-sub">ทบทวนเร่งด่วน</span>
        <span className="vmx-panic-sub">{subjectName || card.th}</span>
      </span>
      {/* One tap, so the tap has to say what it gives. It used to read just
          "เริ่มทบทวน", and the set it opened was 25 questions for no reason
          the card ever stated. */}
      <span className="vmx-panic-cta">
        <span>เริ่มทบทวน {questionCount} ข้อ</span>
        <span className="vmx-panic-arrow" aria-hidden="true">→</span>
      </span>
    </button>
  );
}
