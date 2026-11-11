import { useState, useEffect } from 'react';

export const storage = {
  get(key, fallback) {
    try {
      const v = window.localStorage.getItem(key);
      return v ? JSON.parse(v) : fallback;
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
  // A value written elsewhere in this tab (src/lib/prefs/table.js) is read back.
  useEffect(() => {
    const on = (e) => { if (e.detail?.key === key) setValue(storage.get(key, initialValue)); };
    window.addEventListener('vmx-pref-change', on);
    return () => window.removeEventListener('vmx-pref-change', on);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  return [value, setValue];
}
