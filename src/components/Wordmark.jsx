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

import { useRef } from 'react';

let settledThisLoad = false;

export default function Wordmark({ size = 22 }) {
  // Read on first render and never again, so the flag flips exactly once
  // and re-renders cannot restart the animation.
  const playSettle = useRef(!settledThisLoad);
  settledThisLoad = true;

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
      <span className={`vmx-wordmark-text${playSettle.current ? ' vmx-mark-settle-text' : ''}`}>
        Vet<span>Mock</span>
      </span>
    </>
  );
}
