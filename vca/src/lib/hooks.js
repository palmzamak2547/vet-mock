import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { progressStore } from './progress.js';
import { sessionStore, resultsStore } from './session.js';
import { localDay } from './dates.js';

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

/** Today as 'YYYY-MM-DD' on this device, turning over at midnight (and when the page shows
 *  again after the phone slept), so a countdown left open does not stay a day behind. */
export function useToday() {
  const [day, setDay] = useState(() => localDay());
  useEffect(() => {
    let t = 0;
    const check = () => setDay(localDay());
    const arm = () => {
      const now = new Date();
      const next = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 1);
      t = setTimeout(() => { check(); arm(); }, next - now);
    };
    arm();
    document.addEventListener('visibilitychange', check);
    return () => { clearTimeout(t); document.removeEventListener('visibilitychange', check); };
  }, []);
  return day;
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

/**
 * A sticky panel that steps out of the way on a phone: it slides up out of sight while the
 * reader scrolls down the list under it, and comes back the moment they scroll up, or reach for
 * it. A panel being typed in stays put.
 */
export function useTuck(ref, query = '(max-width: 760px)') {
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof window === 'undefined' || !window.matchMedia) return undefined;
    const mq = window.matchMedia(query);
    let lastY = window.scrollY;
    let frame = 0;
    // Where the panel starts sticking: its place in the page, less the gap it keeps from the top.
    const sticksAt = () => {
      el.classList.remove('is-tucked');
      return el.getBoundingClientRect().top + window.scrollY - (parseFloat(getComputedStyle(el).top) || 0);
    };
    let start = window.scrollY < 4 ? sticksAt() : Infinity;
    const check = () => {
      frame = 0;
      const y = window.scrollY;
      if (start === Infinity && y < 4) start = sticksAt();
      const dy = y - lastY;
      if (Math.abs(dy) < 8) return;
      lastY = y;
      const typing = el.contains(document.activeElement) && document.activeElement.matches('input, select');
      el.classList.toggle('is-tucked', mq.matches && dy > 0 && y > Math.min(start, 600) + 40 && !typing);
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(check); };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(frame); el.classList.remove('is-tucked'); };
  }, [ref, query]);
}
