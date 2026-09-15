// Wordmark — the paw mark plus "VetMock", used by both navs.
//
// The mark lived only on the signed-out landing page; inside the product the
// brand was a bare text wordmark in the sidebar and the mobile header. Same
// mark, same art as /vetmock-logo.svg (619 bytes), rendered small.
//
// It keeps its own sage/cream fills rather than theming — it reads as an app
// icon, and app icons don't invert with the interface around them.
//
// ── Why the art is inline rather than <img> ──────────────────────────────
// An <img> is a sealed box: nothing inside it can move. Inlining costs the
// same bytes (they now ship in the bundle instead of a second request, so
// the mark also stops arriving a frame late) and lets the pad and the toes
// move against each other.
//
// That distinction matters at this size. At 22-24px a toe is about 3px
// across, so animating the four of them separately reads as fuzz, not as
// craft. What DOES read is the paw articulating as a whole: toes lift a
// hair while the pad swells, and the mark leans into the gesture. The
// landing pages keep the plain <img> — they are a different surface and are
// not what this is for.
//
// The settle plays ONCE per page load, not on every mount. App.jsx drops the
// Sidebar for focus views, so leaving an exam remounts this component, and a
// brand that re-animates every time you come back from a question would go
// from charming to nagging by the third one.
//
// ── The cycle (sidebar only) ─────────────────────────────────────────────
// The wordmark is already two voices: a bold lead and a rose italic tail.
// Every phrase below keeps that split, so "CU 86" is set exactly the way
// "VetMock" is and the brand never changes typeface, only words. Phrases
// swap by rising into place, the tail a beat behind the lead — the same
// two-voice gesture the hover already makes.
//
// It holds still while the pointer is on the button (you are about to
// click it; it should not change under you), while the tab is hidden, and
// entirely under prefers-reduced-motion, where it stays "VetMock".

import { useEffect, useRef, useState } from 'react';

let settledThisLoad = false;

// [lead, tail]. A trailing space on the lead is the gap between the words —
// the tail is an inline-block, so a leading space inside it would collapse.
// "CU Vet" is the faculty. A cohort is written the way the faculty writes
// it, CUVET86, one token — never "CU 86" (Palm: "CU Vet ก็ถูก แต่ CU86 ไม่ถูก").
// The cohorts are every year in the building right now: CUVET86 is in year 5
// as of ภาคต้น 2569 (curriculum.js, YEARS.current). Bump all five together.
const PHRASES = [
  ['Vet', 'Mock'],
  ['Mock ', 'Love'],
  ['CU ', 'Vet'],
  ['CUVET', '86'],
  ['CUVET', '87'],
  ['CUVET', '88'],
  ['CUVET', '89'],
  ['CUVET', '90'],
  ['Vet', 'Mochi'],
];
// The brand name gets the long dwell; the wordplay is a passing wink.
const DWELL_MS = (i) => (i === 0 ? 6400 : 3200);
const FIRST_SWAP_MS = 5200; // after the settle, not on top of it

export default function Wordmark({ size = 22, cycle = false }) {
  // Read on first render and never again, so the flag flips exactly once
  // and re-renders cannot restart the animation.
  const playSettle = useRef(!settledThisLoad);
  settledThisLoad = true;

  const [phrase, setPhrase] = useState({ cur: 0, prev: -1 });
  const textRef = useRef(null);

  useEffect(() => {
    if (!cycle) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    let timer = 0;
    let cur = 0;
    const tick = () => {
      const held = document.hidden || textRef.current?.closest('button')?.matches(':hover');
      if (!held) {
        const next = (cur + 1) % PHRASES.length;
        setPhrase({ cur: next, prev: cur });
        cur = next;
      }
      // A held tick retries on the short dwell instead of waiting out a
      // 6-second hold on the brand phrase.
      timer = window.setTimeout(tick, held ? DWELL_MS(1) : DWELL_MS(cur));
    };
    timer = window.setTimeout(tick, FIRST_SWAP_MS);
    return () => window.clearTimeout(timer);
  }, [cycle]);

  const settleText = playSettle.current ? ' vmx-mark-settle-text' : '';

  return (
    <>
      <span
        className={`vmx-mark${playSettle.current ? ' vmx-mark-settle' : ''}`}
        style={{ width: size, height: size, borderRadius: size * 0.22 }}
      >
        <svg viewBox="0 0 512 512" width={size} height={size} aria-hidden="true" focusable="false">
          <rect width="512" height="512" rx="96" ry="96" fill="#4a6b4a" />
          <g fill="#fdf8ef">
            <ellipse className="vmx-mark-pad" cx="256" cy="338" rx="92" ry="74" />
            <g className="vmx-mark-toes">
              <ellipse cx="148" cy="232" rx="36" ry="48" transform="rotate(-18 148 232)" />
              <ellipse cx="212" cy="158" rx="34" ry="46" transform="rotate(-6 212 158)" />
              <ellipse cx="300" cy="158" rx="34" ry="46" transform="rotate(6 300 158)" />
              <ellipse cx="364" cy="232" rx="36" ry="48" transform="rotate(18 364 232)" />
            </g>
          </g>
        </svg>
      </span>
      {cycle ? (
        // Every phrase is stacked in one grid cell, so the button is as wide
        // as the widest phrase from the start and nothing shifts on a swap.
        // The button carries the accessible name; this is decoration.
        <span ref={textRef} className={`vmx-wordmark-text vmx-wordmark-cycle${settleText}`} aria-hidden="true">
          {PHRASES.map(([lead, tail], i) => (
            <span
              key={lead + tail}
              className={`vmx-wordmark-phrase${i === phrase.cur ? ' is-in' : i === phrase.prev ? ' is-out' : ''}`}
            >
              {lead}<span className="vmx-wordmark-tail">{tail}</span>
            </span>
          ))}
        </span>
      ) : (
        <span className={`vmx-wordmark-text${settleText}`}>
          Vet<span className="vmx-wordmark-tail">Mock</span>
        </span>
      )}
    </>
  );
}
