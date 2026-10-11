// ============================================================
// install-guide.test.mjs — which install steps are true for this browser
// ============================================================
// The install chip may only offer steps that work where the student is. Three
// things decide that, and each has gone wrong before or could:
//
//   - Safari proper on an iPhone or iPad has "Add to Home Screen"; Chrome and
//     Firefox on iOS and the app browsers inside LINE, Facebook, Instagram,
//     TikTok, Messenger and X do not offer the same sheet. LINE's iOS browser
//     writes "Safari" into its user agent, so it used to be taken for Safari
//     and was sent to a Share sheet that cannot add the page.
//   - An iPad reports a Mac user agent since iPadOS 13, so a Mac with touch is
//     an iPad and a Mac without is not.
//   - Apple moved the Share button behind a "More" button in iOS 26 (still a
//     plain button on an iPad, and on an iPhone set to a bottom or top tab bar),
//     and added an "Open as Web App" switch: without it the icon opens Safari.
//     The steps say all of that, in words that are true on older versions too.
//
// The steps are data here so a wording slip fails a test instead of reaching a
// student who is standing in front of the sheet.
// ============================================================
import test from 'node:test';
import assert from 'node:assert/strict';
import { installEnvironment, iosSteps } from '../../src/lib/install-guide.js';

const IPHONE = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1';
// Safari 26 freezes the OS version it writes at 18_6 and says 26 as its own.
const IPHONE_26 = 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1';
const IPAD_OLD = 'Mozilla/5.0 (iPad; CPU OS 12_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.1.2 Mobile/15E148 Safari/604.1';
const MAC_UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Safari/605.1.15';
const ANDROID = 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Mobile Safari/537.36';

test('Safari on an iPhone is Safari, on any iOS version', () => {
  for (const ua of [IPHONE, IPHONE_26]) {
    assert.deepEqual(installEnvironment({ ua }), { inApp: null, ios: true, ipad: false, iosSafari: true });
  }
});

test('an iPad is an iPad however it introduces itself, and a Mac is not', () => {
  assert.deepEqual(installEnvironment({ ua: IPAD_OLD }), { inApp: null, ios: true, ipad: true, iosSafari: true });
  // iPadOS 13 and later: a Mac user agent on a machine with touch points.
  assert.equal(installEnvironment({ ua: MAC_UA, platform: 'MacIntel', maxTouchPoints: 5 }).ipad, true);
  assert.equal(installEnvironment({ ua: MAC_UA, platform: 'MacIntel', maxTouchPoints: 5 }).iosSafari, true);
  // The other sanctioned test: touch events exist on the document.
  assert.equal(installEnvironment({ ua: MAC_UA, touchEnd: true }).ipad, true);
  // A real Mac has neither.
  const mac = installEnvironment({ ua: MAC_UA, platform: 'MacIntel', maxTouchPoints: 0, touchEnd: false });
  assert.deepEqual(mac, { inApp: null, ios: false, ipad: false, iosSafari: false });
});

test('Chrome, Firefox and Edge on iOS are not Safari, and Android is not iOS at all', () => {
  for (const token of ['CriOS/130.0.6723.90', 'FxiOS/131.0', 'EdgiOS/130.0.2849.80']) {
    const env = installEnvironment({ ua: IPHONE.replace('Version/17.5', token) });
    assert.equal(env.ios, true, token);
    assert.equal(env.iosSafari, false, `${token} has no Add to Home Screen sheet of Safari's`);
  }
  assert.deepEqual(installEnvironment({ ua: ANDROID }), { inApp: null, ios: false, ipad: false, iosSafari: false });
  assert.deepEqual(installEnvironment({}), { inApp: null, ios: false, ipad: false, iosSafari: false }, 'no user agent, no claim');
});

test('an app\'s own browser is never offered the Safari steps, even when it writes "Safari" in its user agent', () => {
  const cases = {
    // LINE on iOS keeps the Safari token. This is the one that used to slip through.
    line: `${IPHONE.replace(' Version/17.5', '')} Line/14.16.0`,
    facebook: `${IPHONE} [FBAN/FBIOS;FBAV/482.0.0.38.109;FBBV/650000000;FBDV/iPhone15,2;FBMD/iPhone;FBSN/iOS;FBSV/17.5]`,
    messenger: `${IPHONE} [FBAN/MessengerForiOS;FBAV/482.0.0.27.109;FBBV/650000001]`,
    instagram: `${IPHONE} Instagram 350.0.0.36.89 (iPhone15,2; iOS 17_5; th_TH; th; scale=3.00; 1179x2556; 640000000)`,
    tiktok: `${IPHONE} musical_ly_2023607030 JsSdk/1.0 NetType/WIFI BytedanceWebview/d8a21c6`,
    twitter: `${IPHONE} Twitter for iPhone/10.60`,
  };
  for (const [app, ua] of Object.entries(cases)) {
    const env = installEnvironment({ ua });
    assert.equal(env.inApp, app, `${app} is recognised`);
    assert.equal(env.ios, true, app);
    assert.equal(env.iosSafari, false, `${app}: no Share-sheet steps inside an app's own browser`);
  }
});

const STEP_LABELS = ['Share', 'Add to Home Screen', 'Open as Web App', 'Add'];

test('iPhone steps: More, then Share (or the Share button where Apple left it), Add to Home Screen, Open as Web App, Add', () => {
  const steps = iosSteps({ ipad: false });
  assert.equal(steps.length, 3, 'three steps, as many as there are sheets to pass');
  assert.match(steps[0], /⋯/, 'iOS 26 puts Share behind the More button');
  assert.match(steps[0], /“Share”/);
  assert.match(steps[0], /ถ้าเห็นปุ่ม Share/, 'and where the button is still there, it says so');
  assert.match(steps[1], /“Add to Home Screen”/);
  assert.match(steps[1], /View More/, 'the action may be one tap further down the sheet');
  assert.match(steps[2], /“Open as Web App”/, 'without that switch the icon opens Safari, not an app');
  assert.match(steps[2], /ถ้ามี/, 'older iOS versions have no such switch');
  assert.match(steps[2], /“Add”/);
  for (const label of STEP_LABELS) assert.ok(steps.join('\n').includes(label), label);
});

test('iPad steps: the Share button in the bar at the top, and nothing that is only true on an iPhone', () => {
  const steps = iosSteps({ ipad: true });
  assert.equal(steps.length, 3);
  assert.match(steps[0], /“Share”/);
  assert.match(steps[0], /แถบบน/);
  assert.ok(!/แถบล่าง/.test(steps.join('\n')), 'an iPad has no bottom bar to look at');
  assert.ok(!/⋯/.test(steps[0]), 'on an iPad Apple names the Share button itself');
  assert.deepEqual(steps.slice(1), iosSteps({ ipad: false }).slice(1), 'the sheet after Share is the same');
});

test('the steps are plain Thai: no dot separators, no tool talk, and every step ends clean', () => {
  for (const ipad of [false, true]) {
    for (const step of iosSteps({ ipad })) {
      assert.ok(!step.includes('·') && !step.includes('•'), step);
      assert.ok(!/\bAI\b|Claude|build|deploy/i.test(step), step);
      assert.ok(!/[ ,;]$/.test(step), `"${step}" ends on a stray separator`);
      assert.ok(step.length < 140, `short enough to read standing at the sheet (${step.length})`);
    }
  }
});
