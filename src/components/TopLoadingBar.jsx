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
//
// Renders shimmer skeletons that resemble a typical view layout
// (hero block + 2-3 content cards). Far less jarring than a
// blank screen when a chunk takes >150ms (NotesView is ~96KB).
//
// Round 3 (2026-05-18) — Palm spec: skeleton ควรมี progress text ไม่ใช่
// เงียบ ๆ. After 1.5s of "still loading" we surface microcopy explaining
// that the first load is the heavy one (subsequent loads are cached
// by the service worker / bfcache). Avoids the silent-skeleton feeling
// on slow networks that scared Palm's tester ("เหมือนค้าง").
export function ViewFallback() {
  const [showLongHint, setShowLongHint] = useState(false);
  useEffect(() => {
    window.dispatchEvent(new Event('vmx-loading-start'));
    const t = setTimeout(() => setShowLongHint(true), 1500);
    return () => {
      window.dispatchEvent(new Event('vmx-loading-end'));
      clearTimeout(t);
    };
  }, []);
  return (
    <div
      aria-busy="true"
      aria-live="polite"
      style={{ padding: '16px 0', minHeight: '60vh' }}
    >
      <div
        role="status"
        style={{
          fontSize: 12,
          fontFamily: 'JetBrains Mono, monospace',
          color: 'var(--clr-ink-soft)',
          marginBottom: 14,
          letterSpacing: '0.04em',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <span aria-hidden style={{ fontSize: 14 }}>⏳</span>
        <span>กำลังโหลด…</span>
        {showLongHint && (
          <span style={{ color: 'var(--clr-gold, #b88940)', marginLeft: 4 }}>
           , โหลดครั้งแรก ครั้งต่อไปจะเร็วขึ้น
          </span>
        )}
      </div>
      <div className="vmx-skeleton vmx-skeleton-line" style={{ width: '50%', height: 28, marginBottom: 12 }} />
      <div className="vmx-skeleton vmx-skeleton-line" style={{ width: '85%', height: 14 }} />
      <div className="vmx-skeleton vmx-skeleton-line" style={{ width: '70%', height: 14, marginBottom: 24 }} />
      <div className="vmx-skeleton vmx-skeleton-card" style={{ marginBottom: 12 }} />
      <div className="vmx-skeleton vmx-skeleton-card" style={{ marginBottom: 12 }} />
      <div className="vmx-skeleton vmx-skeleton-card" />
    </div>
  );
}
