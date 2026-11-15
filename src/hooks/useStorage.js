import { useState, useEffect, useRef } from 'react';
import { readStoredJson } from '../lib/stored-json.js';
import { reportFailure } from '../lib/report-failure.js';

export const storage = {
  // A missing key, an unreadable value and a stored JSON null all read as the
  // caller's default. A stored null used to come back as null: with
  // `vmx-consent-prefs` holding "null" the app read `consentPrefs.analytics`
  // at boot and drew nothing at all (screen leftovers, 11 Nov 2026). No caller
  // stores null to mean something other than its default
  // (tests/unit/use-storage.test.mjs lists them).
  get(key, fallback) {
    return readStoredJson(key, fallback);
  },
  // True when the value is kept. False when the browser refused (storage
  // full, blocked, a private window): the failure is counted for the owner,
  // and a caller holding the student's own words says so on screen.
  set(key, value) {
    try { window.localStorage.setItem(key, JSON.stringify(value)); return true; } catch (error) { reportFailure('save', error); return false; }
  },
  remove(key) {
    try { window.localStorage.removeItem(key); } catch {}
  },
};

// useLocalStorage — persist state in localStorage. The third element is
// false while a value the student changed could not be kept in this browser
// (the write on mount is the stored value itself, so its failure says nothing
// about the student's work and shows nothing).
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => storage.get(key, initialValue));
  const [saved, setSaved] = useState(true);
  const first = useRef(true);
  useEffect(() => {
    const ok = storage.set(key, value);
    if (first.current) { first.current = false; return; }
    setSaved(ok);
  }, [key, value]);
  return [value, setValue, saved];
}
