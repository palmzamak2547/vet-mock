import { useEffect, useState, useSyncExternalStore } from 'react';
import { readMotionPreferences, subscribeMotionPreferences, MOTION_DEFAULTS } from '../lib/motion-preferences.js';

export function useMotionPreferences() {
  const preferences = useSyncExternalStore(subscribeMotionPreferences, readMotionPreferences, () => MOTION_DEFAULTS);
  const [systemReduced, setSystemReduced] = useState(() => typeof window !== 'undefined' && Boolean(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches));
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const change = () => setSystemReduced(media.matches);
    media.addEventListener('change', change);
    change();
    return () => media.removeEventListener('change', change);
  }, []);
  return { preferences, systemReduced, reduced: systemReduced || preferences.mode !== 'auto' };
}
