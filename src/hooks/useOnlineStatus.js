// ──────────────────────────────────────────────────────────────────
// useOnlineStatus — track navigator.onLine + show transient banners
//
// Returns { online, justChanged } where justChanged is true for ~3s
// after a transition so the UI can flash a "back online" / "offline"
// toast without persisting indefinitely.
//
// navigator.onLine alone lies on some platforms (it just means there
// is a network interface, not that the internet is reachable). We
// keep it as the primary signal because it's fast + cheap, and pair
// it with manual fetch() pings only when needed.
// ──────────────────────────────────────────────────────────────────
import { useEffect, useState } from 'react';

export function useOnlineStatus() {
  const [online, setOnline] = useState(() =>
    typeof navigator === 'undefined' ? true : navigator.onLine
  );
  const [justChanged, setJustChanged] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let toastTimer;
    const flash = () => {
      setJustChanged(true);
      clearTimeout(toastTimer);
      toastTimer = setTimeout(() => setJustChanged(false), 3500);
    };
    const onUp = () => { setOnline(true); flash(); };
    const onDown = () => { setOnline(false); flash(); };

    window.addEventListener('online', onUp);
    window.addEventListener('offline', onDown);
    return () => {
      window.removeEventListener('online', onUp);
      window.removeEventListener('offline', onDown);
      clearTimeout(toastTimer);
    };
  }, []);

  return { online, justChanged };
}
