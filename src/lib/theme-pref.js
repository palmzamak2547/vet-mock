// ============================================================
// theme-pref.js — which theme is on screen
// ============================================================
// vmx-theme holds the student's pick: 'light' or 'dark'. Anything else (a new
// device, or 'system' picked in the theme menu) follows the phone, live, so a
// phone that turns dark at night takes VetMock with it. index.html paints the
// same rule before React loads.
// ============================================================

import { useEffect, useState } from 'react';

export const THEME_SYSTEM = 'system';

const DARK_QUERY = '(prefers-color-scheme: dark)';

export function systemPrefersDark() {
  return typeof window !== 'undefined' && Boolean(window.matchMedia?.(DARK_QUERY).matches);
}

export function effectiveTheme(pref, osDark) {
  if (pref === 'light' || pref === 'dark') return pref;
  return osDark ? 'dark' : 'light';
}

/** The phone's light or dark setting, updated when it changes. */
export function useSystemDark() {
  const [dark, setDark] = useState(systemPrefersDark);
  useEffect(() => {
    const mq = typeof window !== 'undefined' ? window.matchMedia?.(DARK_QUERY) : null;
    if (!mq) return undefined;
    const onChange = (e) => setDark(e.matches);
    mq.addEventListener?.('change', onChange);
    // A change between the first render and this subscription fires no event
    // (WebKit leaves 100-200 ms there): read it again now that we listen.
    setDark(mq.matches);
    return () => mq.removeEventListener?.('change', onChange);
  }, []);
  return dark;
}
