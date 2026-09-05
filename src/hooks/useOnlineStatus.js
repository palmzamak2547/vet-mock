// ──────────────────────────────────────────────────────────────────
// useOnlineStatus — track connectivity with both navigator.onLine
// and an active reachability ping.
//
// Why a ping?  navigator.onLine on iOS Safari and several Android
// WebViews returns `true` whenever there is *any* network interface,
// even if it can't actually reach the public internet (captive
// portal, tethered with no service, dropped Wi-Fi but DNS still
// resolving). The Chrome team has long recommended pairing it with a
// real fetch. We do a lightweight HEAD against /favicon.ico every
// 30s while the tab is visible. Fast, same-origin, no CORS, and
// already cached so it costs essentially nothing on a healthy link.
//
// Returns { online, justChanged }:
//   online       — best-guess current connectivity
//   justChanged  — true for ~3.5s after a transition (for toast UI)
// ──────────────────────────────────────────────────────────────────
import { useEffect, useState } from 'react';

const PING_URL = '/favicon.ico';
const PING_INTERVAL_MS = 30_000;
const PING_TIMEOUT_MS = 4_000;

async function pingReachable() {
  if (typeof fetch === 'undefined') return true;
  // AbortController for a hard timeout — some WebViews hang fetch
  // calls indefinitely when the connection silently drops.
  const ac = new AbortController();
  const t = setTimeout(() => ac.abort(), PING_TIMEOUT_MS);
  try {
    // cache: 'no-store' so we don't trust a stale cached response.
    const r = await fetch(`${PING_URL}?t=${Date.now()}`, {
      method: 'HEAD',
      cache: 'no-store',
      signal: ac.signal,
    });
    clearTimeout(t);
    return r.ok;
  } catch {
    clearTimeout(t);
    return false;
  }
}

export function useOnlineStatus() {
  const [online, setOnline] = useState(() =>
    typeof navigator === 'undefined' ? true : navigator.onLine
  );
  const [justChanged, setJustChanged] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let toastTimer;
    let pingTimer;
    let retryTimer;
    let probeVersion = 0;
    let failedProbes = 0;
    let disposed = false;
    let lastSeen = navigator.onLine;

    const flash = () => {
      setJustChanged(true);
      clearTimeout(toastTimer);
      toastTimer = setTimeout(() => setJustChanged(false), 3500);
    };

    const setStatus = (next) => {
      if (next !== lastSeen) {
        lastSeen = next;
        setOnline(next);
        flash();
      }
    };

    // Browser events — fastest signal; trust them but verify on the
    // "online" edge because they sometimes lie.
    const onUp = () => {
      failedProbes = 0;
      setStatus(true);
      tick();
    };
    const onDown = () => {
      probeVersion += 1; // an older successful ping cannot undo this event
      failedProbes = 0;
      clearTimeout(retryTimer);
      setStatus(false);
    };

    window.addEventListener('online', onUp);
    window.addEventListener('offline', onDown);

    // Periodic ping — covers the "navigator says online but isn't"
    // case. Only runs while the tab is visible so we don't waste
    // cycles when the user is in another tab.
    const tick = async () => {
      if (disposed || document.hidden) return;
      const version = ++probeVersion;
      const reachable = await pingReachable();
      if (disposed || version !== probeVersion) return;
      clearTimeout(retryTimer);
      if (reachable) {
        failedProbes = 0;
        // A real network response is stronger than a stale OS/interface flag.
        setStatus(true);
      } else if (!navigator.onLine || ++failedProbes >= 2) {
        setStatus(false);
      } else {
        // A single delayed HEAD during a busy page load is not proof that the
        // connection is gone. Confirm promptly instead of flashing offline.
        retryTimer = setTimeout(tick, 2000);
      }
    };
    pingTimer = setInterval(tick, PING_INTERVAL_MS);

    // Run an initial verification shortly after mount so the very
    // first render reflects reality, not just the cached
    // navigator.onLine flag.
    const initial = setTimeout(tick, 1500);

    // When the tab becomes visible again, immediately verify — the
    // user has likely just unlocked the phone or come back from
    // another app. Don't wait the full 30s.
    const onVisibility = () => { if (!document.hidden) tick(); };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      disposed = true;
      probeVersion += 1;
      window.removeEventListener('online', onUp);
      window.removeEventListener('offline', onDown);
      document.removeEventListener('visibilitychange', onVisibility);
      clearTimeout(toastTimer);
      clearTimeout(initial);
      clearTimeout(retryTimer);
      clearInterval(pingTimer);
    };
  }, []);

  return { online, justChanged };
}
