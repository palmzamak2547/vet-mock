// Shared by the runtime role's e2e specs (network silence, offline, persistence). Not a spec file
// (Playwright collects *.spec.js only). OWNER: runtime role.
import { readdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

export const PREFS_KEY = 'vmx-research-prefs-v1';
export const DB_NAME = 'vmx-research-v1';

/** Skip the first-visit entrance so specs reach the project list at once; Thai is the default. */
export async function seenEntrance(page, lang = 'th') {
  await page.addInitScript(([key, value]) => {
    try { if (!window.localStorage.getItem(key)) window.localStorage.setItem(key, value); } catch { /* private mode */ }
  }, [PREFS_KEY, JSON.stringify({ entranceSeen: true, lang })]);
}

/**
 * Record every request the page, its workers and the service worker make. `offOrigin()` lists the
 * ones that left the app's origin (data: and blob: URLs never leave the device).
 */
export function recordRequests(context, baseURL) {
  const origin = new URL(baseURL).origin;
  const all = [];
  const sockets = [];
  context.on('request', (r) => all.push(r.url()));
  context.on('page', (p) => p.on('websocket', (ws) => sockets.push(ws.url())));
  return {
    all,
    sockets,
    watch(page) { page.on('websocket', (ws) => sockets.push(ws.url())); },
    offOrigin() {
      return all.filter((u) => !/^(data|blob|about|chrome-extension):/.test(u) && new URL(u).origin !== origin);
    },
  };
}

/** The shipped module worker's URL: from the page's resource timing, else from the built dist/assets. */
export async function engineWorkerUrl(page) {
  const fromPage = await page.evaluate(() => performance.getEntriesByType('resource').map((e) => e.name).find((n) => /engine\.worker[-.][^/]*\.js/.test(n)) || null);
  if (fromPage) return fromPage;
  const dir = fileURLToPath(new URL('../../dist/assets/', import.meta.url));
  if (!existsSync(dir)) return null;
  const file = readdirSync(dir).find((f) => /^engine\.worker.*\.js$/.test(f));
  return file ? new URL(`/assets/${file}`, page.url()).href : null;
}

/** JSON-safe copy of a WorkingTable: typed arrays become { __typed, data }. */
export function packTable(table) {
  const columns = {};
  for (const [k, col] of Object.entries(table.columns)) {
    const pack = (a) => (ArrayBuffer.isView(a) ? { __typed: a.constructor.name, data: Array.from(a, (x) => (Number.isNaN(x) ? null : x)) } : a);
    columns[k] = { ...col, values: pack(col.values), missing: pack(col.missing) };
  }
  return { ...table, columns };
}

/**
 * Run requests on the shipped module worker inside the page and return the replies. Runs in the
 * browser: revives packed tables, posts, waits with a watchdog, terminates the worker at the end.
 * @param {import('@playwright/test').Page} page
 * @param {string} workerUrl
 * @param {{ op: string, payload: any }[]} requests
 */
export async function runInWorker(page, workerUrl, requests) {
  return page.evaluate(async ({ url, reqs }) => {
    const revive = (t) => {
      if (!t || !t.columns) return t;
      const cols = {};
      for (const [k, c] of Object.entries(t.columns)) {
        const un = (a) => (a && a.__typed ? (a.__typed === 'Float64Array' ? Float64Array.from(a.data, (x) => (x === null ? NaN : x)) : new self[a.__typed](a.data)) : a);
        cols[k] = { ...c, values: un(c.values), missing: un(c.missing) };
      }
      return { ...t, columns: cols };
    };
    const w = new Worker(url, { type: 'module' });
    let seq = 0;
    const call = (op, payload) => new Promise((resolve) => {
      const id = ++seq;
      const timer = setTimeout(() => resolve({ type: 'error', error: { code: 'timeout' } }), 30000);
      const on = (e) => {
        if (e.data?.id !== id || e.data.type === 'progress') return;
        clearTimeout(timer);
        w.removeEventListener('message', on);
        resolve(e.data);
      };
      w.addEventListener('message', on);
      w.postMessage({ id, op, payload });
    });
    const out = [];
    try {
      out.push(await call('hello', {}));
      for (const r of reqs) {
        const payload = r.payload?.table ? { ...r.payload, table: revive(r.payload.table) } : r.payload;
        const reply = await call(r.op, payload);
        const env = reply.result;
        out.push({ type: reply.type, error: reply.error || null, method: env?.method?.id, status: env?.status, engineVersion: env?.provenance?.engineVersion, values: env ? Object.keys(env.values || {}).length : 0, stops: env?.guard?.stops?.map((s) => s.id) || [] });
      }
    } finally {
      w.terminate();
    }
    return out;
  }, { url: workerUrl, reqs: requests });
}

/**
 * The design stored for the (only) project in this browser, read from IndexedDB. The design radio shows the
 * choice at once and writes it a moment later; a full page load before the write lands aborts it in WebKit,
 * so a spec waits for this before navigating away (review round 4).
 */
export const storedDesign = (page) => page.evaluate((name) => new Promise((resolve) => {
  const req = indexedDB.open(name);
  req.onerror = () => resolve(null);
  req.onsuccess = () => {
    const db = req.result;
    const all = db.transaction('projects', 'readonly').objectStore('projects').getAll();
    all.onsuccess = () => { resolve(all.result[0]?.design ?? null); db.close(); };
    all.onerror = () => { resolve(null); db.close(); };
  };
}), DB_NAME);
