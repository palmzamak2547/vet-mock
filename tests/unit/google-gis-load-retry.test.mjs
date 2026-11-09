// ============================================================
// google-gis-load-retry.test.mjs — a failed load of Google's script is tried again
// ============================================================
// google-gis.js loads Google's sign-in script once and keeps the promise. A load
// that failed (campus wifi dropping, a page opened offline) stayed in that
// promise for the life of the tab: every later Google button and sign-in failed
// at once, the button never drew again, and sign-in fell back to the redirect
// that shows the raw supabase.co address, until the student thought to reload.
//
// google-gis.js runs as shipped, compiled with import.meta.env inlined (the
// replacement Vite makes at build time). The page is a stand-in: a script tag
// appended to <head> loads a moment later, defining window.google as Google's
// script does, or fails while the network is down.
// ============================================================

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { registerHooks } from 'node:module';
import { transformSync } from 'esbuild';

const GIS = new URL('../../src/lib/google-gis.js', import.meta.url).href;
const ENV = { VITE_GOOGLE_CLIENT_ID: 'client.apps.googleusercontent.com' };
registerHooks({
  load(url, context, nextLoad) {
    if (url.split('?')[0] !== GIS) return nextLoad(url, context);
    const { code } = transformSync(readFileSync(new URL(GIS), 'utf8'), {
      format: 'esm', define: { 'import.meta.env': JSON.stringify(ENV) },
    });
    return { format: 'module', shortCircuit: true, source: code };
  },
});

// Every page load is a fresh copy of the module, as in the browser.
let pages = 0;
const loadPage = () => import(`${GIS}?page=${++pages}`);

function page() {
  const net = { up: false, requests: 0 };
  const head = [];
  const google = { accounts: { id: {
    initialize: (config) => { net.config = config; },
    renderButton: (container) => { container.drawn = (container.drawn || 0) + 1; },
    // One Tap with the student tapping their account at once.
    prompt: () => { net.config.callback({ credential: 'google-id-token' }); },
    cancel: () => {},
  } } };
  const fire = (el, type) => {
    el[`on${type}`]?.();
    for (const listener of el.listeners[type] || []) listener();
  };
  const createElement = () => {
    const el = {
      listeners: {},
      addEventListener: (type, listener) => { (el.listeners[type] ||= []).push(listener); },
      remove: () => { if (head.includes(el)) head.splice(head.indexOf(el), 1); },
    };
    return el;
  };
  globalThis.window = new EventTarget();
  globalThis.document = {
    createElement,
    querySelector: (selector) => head.find((el) => selector === `script[src="${el.src}"]`) || null,
    head: {
      appendChild: (el) => {
        head.push(el);
        net.requests++;
        setTimeout(() => {
          if (!net.up) return fire(el, 'error');
          window.google = google;
          return fire(el, 'load');
        }, 0);
        return el;
      },
    },
  };
  return { net, head };
}

const NO_SUPABASE_CALL = { auth: {} };

test('Google\'s button draws once the network is back, after a load that failed', { timeout: 5000 }, async () => {
  const { net, head } = page();
  const gis = await loadPage();
  const container = { clientWidth: 320, innerHTML: '' };
  await assert.rejects(gis.renderGoogleGisButton(container, { supabase: NO_SUPABASE_CALL }), /GIS load failed/);
  assert.equal(head.length, 0, 'the failed tag is taken out, so nothing waits on it');

  net.up = true;
  const teardown = await gis.renderGoogleGisButton(container, { supabase: NO_SUPABASE_CALL });
  assert.equal(typeof teardown, 'function');
  assert.equal(container.drawn, 1, 'Google drew its button');
  assert.equal(net.requests, 2, 'the script was asked for again');
  assert.equal(head.length, 1);
});

test('Google sign-in works on the next try, after a load that failed', { timeout: 5000 }, async () => {
  const { net } = page();
  const gis = await loadPage();
  const session = { access_token: 'access', user: { id: 'student-1' } };
  const supabase = { auth: { signInWithIdToken: async ({ provider, token }) => {
    assert.deepEqual([provider, token], ['google', 'google-id-token']);
    return { data: { session }, error: null };
  } } };
  await assert.rejects(gis.signInWithGoogleGis({ supabase, hd: 'student.chula.ac.th' }), /GIS load failed/);
  net.up = true;
  const data = await gis.signInWithGoogleGis({ supabase, hd: 'student.chula.ac.th' });
  assert.equal(data.session, session);
});

test('one load still serves every caller, and a loaded script is not asked for again', { timeout: 5000 }, async () => {
  const { net } = page();
  net.up = true;
  const gis = await loadPage();
  const a = { clientWidth: 320 };
  const b = { clientWidth: 320 };
  await Promise.all([
    gis.renderGoogleGisButton(a, { supabase: NO_SUPABASE_CALL }),
    gis.renderGoogleGisButton(b, { supabase: NO_SUPABASE_CALL }),
  ]);
  await gis.renderGoogleGisButton(a, { supabase: NO_SUPABASE_CALL });
  assert.equal(net.requests, 1);
  assert.deepEqual([a.drawn, b.drawn], [2, 1]);
});
