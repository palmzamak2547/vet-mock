// ============================================================
// Web Vitals — zero-dependency Core Web Vitals monitor
// ============================================================
// Observes LCP / CLS / INP / FCP / TTFB using native PerformanceObserver
// instead of pulling in `web-vitals` (~5KB). Persists last 50 samples
// to localStorage so DashboardView can plot trends offline. Console
// logs in dev mode so we spot regressions before they ship.
//
// What each metric means:
//   • LCP (Largest Contentful Paint)  — when the biggest visible thing
//     painted. Target: <2.5s.
//   • CLS (Cumulative Layout Shift)   — total unexpected movement.
//     Target: <0.1.
//   • INP (Interaction to Next Paint) — slowest tap/keypress response.
//     Target: <200ms.
//   • FCP (First Contentful Paint)    — first visible pixel of content.
//     Target: <1.8s.
//   • TTFB (Time to First Byte)       — server-response latency.
//     Target: <800ms.
//
// All metrics are best-effort. Browsers without PerformanceObserver
// silently skip — no errors, no UI impact.
// ============================================================

const STORAGE_KEY = 'vmx-web-vitals';
const MAX_SAMPLES = 50;
const isDev = import.meta.env?.MODE !== 'production';

// In-memory state for the current session — persisted on each update
const session = {
  ts: Date.now(),
  url: typeof window !== 'undefined' ? window.location.pathname : '/',
  lcp: null,
  cls: 0,
  inp: null,
  fcp: null,
  ttfb: null,
  reported: false,
};

function persist() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    if (!session.reported) {
      arr.push({ ...session });
      session.reported = true;
    } else {
      arr[arr.length - 1] = { ...session };
    }
    // Trim to last MAX_SAMPLES
    while (arr.length > MAX_SAMPLES) arr.shift();
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
  } catch {
    // localStorage may be full or disabled (private mode) — fail silent
  }
}

function logDev(metric, value, rating) {
  if (!isDev) return;
  const color = rating === 'good' ? 'color:#4a6b4a' : rating === 'needs-improvement' ? 'color:#b88940' : 'color:#c0392b';
  console.log(`%c[vitals] ${metric} = ${typeof value === 'number' ? value.toFixed(0) : value} (${rating})`, color);
}

function rate(metric, value) {
  if (value == null) return 'unknown';
  switch (metric) {
    case 'lcp': return value < 2500 ? 'good' : value < 4000 ? 'needs-improvement' : 'poor';
    case 'cls': return value < 0.1 ? 'good' : value < 0.25 ? 'needs-improvement' : 'poor';
    case 'inp': return value < 200 ? 'good' : value < 500 ? 'needs-improvement' : 'poor';
    case 'fcp': return value < 1800 ? 'good' : value < 3000 ? 'needs-improvement' : 'poor';
    case 'ttfb': return value < 800 ? 'good' : value < 1800 ? 'needs-improvement' : 'poor';
    default: return 'unknown';
  }
}

function safeObserve(type, cb, options) {
  try {
    if (typeof PerformanceObserver === 'undefined') return null;
    if (!PerformanceObserver.supportedEntryTypes?.includes(type)) return null;
    const obs = new PerformanceObserver(cb);
    obs.observe(options || { type, buffered: true });
    return obs;
  } catch {
    return null;
  }
}

export function startWebVitals() {
  if (typeof window === 'undefined') return;
  if (window.__vmxWebVitalsStarted) return;
  window.__vmxWebVitalsStarted = true;

  // ── TTFB — from navigation timing ─────────────────────────────
  try {
    const nav = performance.getEntriesByType?.('navigation')?.[0];
    if (nav && nav.responseStart > 0) {
      session.ttfb = Math.round(nav.responseStart);
      logDev('ttfb', session.ttfb, rate('ttfb', session.ttfb));
    }
  } catch {}

  // ── FCP ───────────────────────────────────────────────────────
  safeObserve('paint', (list) => {
    for (const entry of list.getEntries()) {
      if (entry.name === 'first-contentful-paint') {
        session.fcp = Math.round(entry.startTime);
        logDev('fcp', session.fcp, rate('fcp', session.fcp));
        persist();
      }
    }
  });

  // ── LCP — use largest reported value over page lifetime ───────
  let lcpValue = 0;
  safeObserve('largest-contentful-paint', (list) => {
    const entries = list.getEntries();
    const last = entries[entries.length - 1];
    if (last && last.startTime > lcpValue) {
      lcpValue = last.startTime;
      session.lcp = Math.round(lcpValue);
      logDev('lcp', session.lcp, rate('lcp', session.lcp));
      persist();
    }
  });

  // ── CLS — sum non-input layout shifts in 5s+1s session windows
  let clsValue = 0;
  let clsEntries = [];
  let sessionValue = 0;
  let sessionEntries = [];
  safeObserve('layout-shift', (list) => {
    for (const entry of list.getEntries()) {
      if (entry.hadRecentInput) continue;
      const firstSession = sessionEntries[0];
      const lastSession = sessionEntries[sessionEntries.length - 1];
      // Belongs to current session if <1s gap from last + <5s from first
      if (
        sessionValue &&
        entry.startTime - lastSession.startTime < 1000 &&
        entry.startTime - firstSession.startTime < 5000
      ) {
        sessionValue += entry.value;
        sessionEntries.push(entry);
      } else {
        sessionValue = entry.value;
        sessionEntries = [entry];
      }
      if (sessionValue > clsValue) {
        clsValue = sessionValue;
        clsEntries = sessionEntries;
        session.cls = Math.round(clsValue * 1000) / 1000;
        logDev('cls', session.cls, rate('cls', session.cls));
        persist();
      }
    }
  });

  // ── INP — slowest interaction (event timing API) ──────────────
  let inpMax = 0;
  safeObserve('event', (list) => {
    for (const entry of list.getEntries()) {
      // Only count interactions (have interactionId), ignore others
      if (!entry.interactionId) continue;
      const dur = entry.duration;
      if (dur > inpMax) {
        inpMax = dur;
        session.inp = Math.round(inpMax);
        logDev('inp', session.inp, rate('inp', session.inp));
        persist();
      }
    }
  }, { type: 'event', buffered: true, durationThreshold: 16 });

  // ── Persist final state on unload ─────────────────────────────
  // visibilitychange fires reliably across mobile + tab close,
  // pagehide is the iOS Safari fallback.
  const flushOnce = () => persist();
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') flushOnce();
  });
  window.addEventListener('pagehide', flushOnce);

  // Initial persist so we have at least one sample even if the user
  // closes the tab before any metric fires.
  setTimeout(persist, 1000);
}

// Read for DashboardView / debug — returns array of last samples
export function getWebVitalsSamples() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

// Compute simple aggregate stats (median, p75) for a metric
export function summarize(samples, key) {
  const values = samples
    .map((s) => s[key])
    .filter((v) => typeof v === 'number')
    .sort((a, b) => a - b);
  if (!values.length) return null;
  const median = values[Math.floor(values.length / 2)];
  const p75 = values[Math.floor(values.length * 0.75)];
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  return { median, p75, mean: Math.round(mean), count: values.length };
}
