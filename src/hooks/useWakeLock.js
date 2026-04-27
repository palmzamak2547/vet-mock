// ============================================================
// useWakeLock — keep the screen on while exam is in progress
// ============================================================
// Uses the Screen Wake Lock API. Falls back gracefully when not
// supported (older Safari, Firefox without flag) — no error,
// just no wake lock.
//
// Usage:
//   useWakeLock(view === 'exam')   // active while truthy
//
// Auto-reacquires when user returns to the tab (browsers drop
// the lock on visibilitychange → 'hidden').
// ============================================================

import { useEffect, useRef } from 'react';

export function useWakeLock(active) {
  const sentinelRef = useRef(null);

  useEffect(() => {
    if (!active) return;
    if (typeof navigator === 'undefined' || !('wakeLock' in navigator)) return;

    let cancelled = false;

    const acquire = async () => {
      try {
        const sentinel = await navigator.wakeLock.request('screen');
        if (cancelled) {
          // Effect was cleaned up while awaiting — release immediately
          try { await sentinel.release(); } catch {}
          return;
        }
        sentinelRef.current = sentinel;
        // sentinel will fire 'release' when system drops it (e.g., tab
        // hidden). We re-acquire on visibility change below.
      } catch (err) {
        // Common: page not active, permission policy denies, etc.
        // No-op — just means screen will time out normally.
      }
    };

    const handleVisibility = () => {
      // Re-acquire when the tab becomes visible again. Browsers
      // auto-release the lock when the tab is hidden, so coming back
      // we either have no sentinel or sentinel.released === true.
      // (Original draft had the boolean flipped — fixed.)
      if (!active) return;
      if (document.visibilityState !== 'visible') return;
      const cur = sentinelRef.current;
      if (!cur || cur.released) acquire();
    };

    acquire();
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      cancelled = true;
      document.removeEventListener('visibilitychange', handleVisibility);
      const sentinel = sentinelRef.current;
      sentinelRef.current = null;
      if (sentinel) {
        try { sentinel.release(); } catch {}
      }
    };
  }, [active]);
}
