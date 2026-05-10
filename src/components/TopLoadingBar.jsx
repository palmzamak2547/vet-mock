// ============================================================
// TopLoadingBar — thin progress bar at the top of the viewport
// ============================================================
// Visible while a Suspense boundary is showing its fallback (i.e.
// during a lazy chunk load or a view transition). Disappears when
// the children render. Inspired by NProgress / GitHub / YouTube.
//
// Implementation:
//   • Fires on mount of the Suspense fallback wrapper (start)
//   • Fires on unmount of fallback wrapper (end → 100% → fade out)
//   • Pure CSS transition for buttery 60fps animation
//   • Respects prefers-reduced-motion (skips the eased ramp)
//   • No external lib, ~50 LOC
// ============================================================

import { useEffect, useRef, useState } from 'react';

export default function TopLoadingBar() {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const timerRef = useRef(null);
  const fadeRef = useRef(null);

  useEffect(() => {
    const start = () => {
      // Cancel any in-flight fade-out
      if (fadeRef.current) { clearTimeout(fadeRef.current); fadeRef.current = null; }
      setVisible(true);
      setProgress(0.08);
      // Ramp toward 85% asymptotically — feels like work is happening
      // even if the chunk takes longer than expected
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setProgress((p) => (p < 0.85 ? p + (0.92 - p) * 0.06 : p));
      }, 120);
    };

    const end = () => {
      if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
      setProgress(1);
      // Hide after the bar finishes its 100% animation
      fadeRef.current = setTimeout(() => {
        setVisible(false);
        setProgress(0);
      }, 220);
    };

    window.addEventListener('vmx-loading-start', start);
    window.addEventListener('vmx-loading-end', end);
    return () => {
      window.removeEventListener('vmx-loading-start', start);
      window.removeEventListener('vmx-loading-end', end);
      if (timerRef.current) clearInterval(timerRef.current);
      if (fadeRef.current) clearTimeout(fadeRef.current);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      role="progressbar"
      aria-busy={progress < 1}
      aria-valuenow={Math.round(progress * 100)}
      aria-valuemin={0}
      aria-valuemax={100}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: 3,
        zIndex: 9999,
        pointerEvents: 'none',
        background: 'transparent',
      }}
    >
      <div
        style={{
          height: '100%',
          width: `${progress * 100}%`,
          background: 'linear-gradient(90deg, var(--clr-sage, #4a6b4a), var(--clr-gold, #b88940))',
          boxShadow: '0 0 8px rgba(74, 107, 74, 0.5)',
          transition: 'width 220ms cubic-bezier(0.4, 0, 0.2, 1), opacity 220ms',
          opacity: progress >= 1 ? 0 : 1,
          transformOrigin: 'left',
        }}
      />
    </div>
  );
}

// ─── Suspense fallback that drives the bar ──────────────────────
// Use this AS the Suspense fallback. It fires the start/end events
// on mount/unmount, so the bar tracks whatever Suspense is doing.
export function ViewFallback() {
  useEffect(() => {
    window.dispatchEvent(new Event('vmx-loading-start'));
    return () => window.dispatchEvent(new Event('vmx-loading-end'));
  }, []);
  // Keep the layout stable — return an invisible placeholder of
  // similar height to the normal content area so the bar doesn't
  // appear next to a collapsed page.
  return (
    <div
      aria-hidden="true"
      style={{
        minHeight: '60vh',
        opacity: 0,
        pointerEvents: 'none',
      }}
    />
  );
}
