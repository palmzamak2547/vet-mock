// ============================================================
// landing-webkit-transitions.test.mjs — no View Transition on WebKit
// ============================================================
// App's withTransition keeps View Transitions off on WebKit: mobile Safari
// hard-crashed while snapshotting a large React view (config to exam). Every
// iOS browser is WebKit, LINE's in-app browser included. The landing's start
// buttons mount the whole app inside its own transition, so the landing has
// to keep the same rule, read here from the source and run on real user
// agents.
// ============================================================

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const src = readFileSync(fileURLToPath(new URL('../../src/views/LandingView.jsx', import.meta.url)), 'utf8');

test('the landing skips View Transitions on every WebKit browser', () => {
  const m = src.match(/const WEBKIT = ([\s\S]*?);\r?\n/);
  assert.ok(m, 'LandingView no longer decides WebKit once, at the top');
  // eslint-disable-next-line no-new-func
  const isWebKit = (userAgent) => new Function('navigator', `return ${m[1]};`)({ userAgent });
  const webkit = [
    'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/129.0.6668.69 Mobile/15E148 Safari/604.1',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Safari Line/14.16.0',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Safari/605.1.15',
  ];
  const others = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Mobile Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36 Edg/129.0.0.0',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:131.0) Gecko/20100101 Firefox/131.0',
  ];
  for (const ua of webkit) assert.equal(isWebKit(ua), true, ua);
  for (const ua of others) assert.equal(isWebKit(ua), false, ua);
  assert.match(src, /if \(!doc\.startViewTransition \|\| reduce\.current \|\| WEBKIT\) \{ run\(\); return; \}/,
    'the transition helper must fall back to a plain call on WebKit');
});

// The landing's way in starts a transition and the app's next screen starts
// another, which skips the first: Chromium and Firefox then reject its
// promises ("Transition was skipped"), and unhandled they reach the console
// as page errors (the onboarding smoke test caught it, 2026-10-08).
test('a skipped landing transition never leaves an unhandled rejection', async () => {
  const start = src.indexOf('const vt = doc.startViewTransition(');
  const body = src.slice(start, src.indexOf('} catch {', start));
  assert.ok(start > 0, 'the transition helper moved');
  for (const name of ['ready', 'updateCallbackDone', 'finished']) {
    assert.match(body, new RegExp(`vt\\.${name}\\??\\.catch\\(`), `vt.${name} has no rejection handler`);
  }
  // Run it against a transition that is skipped, the way a browser does.
  const unhandled = [];
  const onUnhandled = (reason) => unhandled.push(String(reason));
  process.on('unhandledRejection', onUnhandled);
  const skipped = () => Promise.reject(new Error('Transition was skipped'));
  const vt = { ready: skipped(), updateCallbackDone: Promise.resolve(), finished: skipped() };
  const root = { classList: { remove() {} } };
  const kind = 'portal';
  // eslint-disable-next-line no-new-func
  new Function('vt', 'root', 'kind', body.replace(/^const vt = doc\.startViewTransition\([^\n]*\n/, ''))(vt, root, kind);
  await new Promise((r) => setTimeout(r, 20));
  process.off('unhandledRejection', onUnhandled);
  assert.deepEqual(unhandled, []);
});
