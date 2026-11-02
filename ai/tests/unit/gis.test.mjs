// Google's own sign-in button (lib/gis.js): only on the origin the OAuth client lists, the domain
// hint passed on, One Tap beside the button, and the nonce Google sees is the SHA-256 of the one
// handed back with the token (signInWithIdToken checks the pair).
import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';

const { GIS_CLIENT_ID, gisOriginAllowed, gisUsable, renderGoogleButton, noncePair, buttonDrawn, DRAWN_MS } = await import('../../src/lib/gis.js');

test('a slot with no drawn button is empty, so the house button takes its place after 4 s', () => {
  const slot = (frame) => ({ querySelector: (sel) => (sel === 'iframe' ? frame : null) });
  assert.equal(DRAWN_MS, 4000);
  assert.equal(buttonDrawn(slot({ getBoundingClientRect: () => ({ width: 300, height: 40 }) })), true);
  assert.equal(buttonDrawn(slot({ getBoundingClientRect: () => ({ width: 0, height: 0 }) })), false, 'a frame that never drew');
  assert.equal(buttonDrawn(slot(null)), false, 'nothing inserted');
  assert.equal(buttonDrawn(null), false);
});

function fakeGoogle() {
  const calls = { initialize: [], renderButton: [], prompt: 0, cancel: 0 };
  const id = {
    initialize: (opts) => calls.initialize.push(opts),
    renderButton: (el, opts) => calls.renderButton.push(opts),
    prompt: () => { calls.prompt += 1; },
    cancel: () => { calls.cancel += 1; },
  };
  globalThis.window = { google: { accounts: { id } } };
  return calls;
}

test('Google\'s button only where the OAuth client lists the origin; the client id falls back to VetMock\'s', () => {
  assert.equal(GIS_CLIENT_ID, '807323754507-v4kctbouiqucot3e0isqju1mq1jl9k2u.apps.googleusercontent.com');
  assert.equal(gisOriginAllowed('https://ai.vetmock.com'), true);
  for (const origin of ['http://localhost:43130', 'https://vetmock-ai.vercel.app', 'https://evil.example', 'https://ai.vetmock.com.evil.example', undefined]) {
    assert.equal(gisOriginAllowed(origin), false, String(origin));
  }
  assert.equal(gisUsable('https://ai.vetmock.com'), true);
  assert.equal(gisUsable('http://127.0.0.1:43190'), false, 'a preview or a dev server keeps the redirect');
});

test('the nonce pair: Google gets the SHA-256, the account gets the raw one', async () => {
  const { raw, hashed } = await noncePair();
  assert.match(raw, /^[0-9a-f]{32}$/);
  assert.equal(hashed, createHash('sha256').update(raw).digest('hex'));
});

test('the button is drawn with the Chula domain, in Thai, One Tap beside it, and the token comes back with its nonce', async () => {
  const calls = fakeGoogle();
  const el = { clientWidth: 520, cleared: false, replaceChildren() { this.cleared = true; } };
  const got = [];
  const undo = await renderGoogleButton(el, { hd: 'student.chula.ac.th', theme: 'filled_black', prompt: true, onCredential: (token, nonce) => got.push([token, nonce]) });
  const init = calls.initialize[0];
  assert.equal(init.client_id, GIS_CLIENT_ID);
  assert.equal(init.hd, 'student.chula.ac.th');
  assert.equal(init.ux_mode, 'popup');
  assert.equal(init.auto_select, false);
  assert.deepEqual({ ...calls.renderButton[0] }, { type: 'standard', theme: 'filled_black', size: 'large', shape: 'pill', text: 'signin_with', logo_alignment: 'left', locale: 'th', width: 400 });
  assert.equal(calls.prompt, 1, 'One Tap beside the button');
  init.callback({ credential: 'id-token' });
  init.callback({});
  assert.equal(got.length, 1, 'no credential, nothing to trade');
  assert.equal(got[0][0], 'id-token');
  assert.equal(init.nonce, createHash('sha256').update(got[0][1]).digest('hex'), 'the raw nonce hashes to what Google was given');
  undo();
  assert.equal(el.cleared, true);
  assert.equal(calls.cancel, 1, 'One Tap closes with the button');
});

test('no hint for no domain, no One Tap unless asked, and a narrow slot still gets Google\'s minimum', async () => {
  const calls = fakeGoogle();
  await renderGoogleButton({ clientWidth: 150, replaceChildren() {} }, { onCredential() {} });
  assert.equal('hd' in calls.initialize[0], false);
  assert.equal(calls.renderButton[0].theme, 'outline');
  assert.equal(calls.renderButton[0].width, 200);
  assert.equal(calls.prompt, 0);
  await assert.rejects(renderGoogleButton(null, { onCredential() {} }), /container/);
  await assert.rejects(renderGoogleButton({}, { clientId: '', onCredential() {} }), /NO_GOOGLE_CLIENT_ID/);
});

test('an empty slot is judged only after the delay and once the page is idle', async () => {
  const { watchDrawn } = await import('../../src/lib/gis.js');
  // A fake window: timers and idle callbacks run only when the test says so.
  const timers = [];
  const idles = [];
  const win = {
    setTimeout: (fn) => timers.push(fn),
    clearTimeout: (id) => { if (id) timers[id - 1] = null; },
    requestIdleCallback: (fn) => idles.push(fn),
    cancelIdleCallback: (id) => { if (id) idles[id - 1] = null; },
  };
  let drawn = false;
  let empties = 0;
  const el = { querySelector: () => (drawn ? { getBoundingClientRect: () => ({ width: 300, height: 40 }) } : null) };
  watchDrawn(el, () => { empties += 1; }, { win });
  timers[0]();
  assert.equal(empties, 0, 'the delay passing on a busy page judges nothing yet');
  drawn = true;
  idles[0]();
  assert.equal(empties, 0, "Google's button that drew while the page was busy keeps its place");
  drawn = false;
  watchDrawn(el, () => { empties += 1; }, { win });
  timers[1]();
  idles[1]();
  assert.equal(empties, 1, 'still empty once the page is idle: the fallback button takes over');
  const stop = watchDrawn(el, () => { empties += 1; }, { win });
  stop();
  assert.equal(timers[2], null, 'cancelled with the component, never judged');
});
