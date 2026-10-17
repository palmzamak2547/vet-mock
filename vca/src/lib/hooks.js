import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { progressStore } from './progress.js';
import { sessionStore, resultsStore } from './session.js';

export const useProgress = () => useSyncExternalStore(progressStore.subscribe, progressStore.get, progressStore.get);
export const useActiveSession = () => useSyncExternalStore(sessionStore.subscribe, sessionStore.get, sessionStore.get);
export const useResults = () => useSyncExternalStore(resultsStore.subscribe, resultsStore.get, resultsStore.get);

/** Re-render every `ms` while `on`; the value is the current time. */
export function useNow(ms = 1000, on = true) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (!on) return undefined;
    const tick = () => setNow(Date.now());
    const id = setInterval(tick, ms);
    // A phone that slept wakes to a stale clock; read it again the moment the page shows.
    document.addEventListener('visibilitychange', tick);
    return () => { clearInterval(id); document.removeEventListener('visibilitychange', tick); };
  }, [ms, on]);
  return now;
}

/** Document title per page. */
export function useTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} | VetMock VCA` : 'VetMock VCA | ซ้อมสอบใบประกอบวิชาชีพสัตวแพทย์';
  }, [title]);
}

/** Load something async once per key, with retry. */
export function useAsync(fn, key) {
  const [state, setState] = useState({ status: 'loading', value: null, error: null });
  const [attempt, setAttempt] = useState(0);
  const fnRef = useRef(fn);
  fnRef.current = fn;
  useEffect(() => {
    let live = true;
    setState((s) => (s.status === 'ready' && s.key === key ? s : { status: 'loading', value: null, error: null }));
    fnRef.current().then(
      (value) => { if (live) setState({ status: 'ready', value, error: null, key }); },
      (error) => { if (live) setState({ status: 'error', value: null, error, key }); },
    );
    return () => { live = false; };
  }, [key, attempt]);
  return { ...state, retry: () => setAttempt((n) => n + 1) };
}

/** Matches a media query, live. */
export function useMedia(query) {
  const get = () => (typeof window !== 'undefined' && window.matchMedia ? window.matchMedia(query).matches : false);
  const [match, setMatch] = useState(get);
  useEffect(() => {
    const mq = window.matchMedia?.(query);
    if (!mq) return undefined;
    const on = () => setMatch(mq.matches);
    on();
    mq.addEventListener?.('change', on);
    return () => mq.removeEventListener?.('change', on);
  }, [query]);
  return match;
}
