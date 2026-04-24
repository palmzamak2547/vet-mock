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
  return [value, setValue];
}
