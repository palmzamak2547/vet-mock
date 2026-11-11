import { useState, useEffect } from 'react';

export const storage = {
  // A missing key, an unreadable value and a stored JSON null all read as the
  // caller's default. A stored null used to come back as null: with
  // `vmx-consent-prefs` holding "null" the app read `consentPrefs.analytics`
  // at boot and drew nothing at all (screen leftovers, 11 Nov 2026). No caller
  // stores null to mean something other than its default
  // (tests/unit/use-storage.test.mjs lists them).
  get(key, fallback) {
    try {
      const v = window.localStorage.getItem(key);
      if (!v) return fallback;
      const parsed = JSON.parse(v);
      return parsed === null ? fallback : parsed;
    } catch { return fallback; }
  },
  set(key, value) {
    try { window.localStorage.setItem(key, JSON.stringify(value)); } catch {}
  },
  remove(key) {
    try { window.localStorage.removeItem(key); } catch {}
  },
};

// useLocalStorage — persist state in localStorage
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => storage.get(key, initialValue));
  useEffect(() => { storage.set(key, value); }, [key, value]);
  return [value, setValue];
}
