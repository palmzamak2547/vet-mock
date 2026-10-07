// ============================================================
// inapp-browser.test.mjs — telling the app browsers apart
// ============================================================
// A link shared in LINE, Facebook, Messenger, Instagram, TikTok or X opens in
// that app's own browser, where Google refuses OAuth sign-in. src/lib/inapp.js
// names the app from its user agent so the sign-in can say so first, and
// builds LINE's documented way out (openExternalBrowser=1).
//
// The user agents are the shapes each app sends; the ones that must stay
// null are the system browsers and a word that only looks like LINE's token.
// ============================================================

import test from 'node:test';
import assert from 'node:assert/strict';
import { inAppBrowser, externalUrl, APP_NAMES } from '../../src/lib/inapp.js';

const IOS = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148';
const ANDROID = 'Mozilla/5.0 (Linux; Android 14; SM-S918B Build/UP1A.231005.007; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/129.0.6668.100 Mobile Safari/537.36';

test('each app browser is named from its user agent', () => {
  const cases = [
    [`${IOS} Safari Line/14.16.0`, 'line'],
    [`${ANDROID} Line/14.16.2/IAB`, 'line'],
    [`${IOS} [FBAN/FBIOS;FBAV/482.0.0.38.109;FBBV/650000000;FBDV/iPhone15,2;FBMD/iPhone;FBSN/iOS;FBSV/17.5]`, 'facebook'],
    [`${ANDROID} [FB_IAB/FB4A;FBAV/482.0.0.42.109;]`, 'facebook'],
    [`${IOS} [FBAN/MessengerForiOS;FBAV/482.0.0.27.109;FBBV/650000001]`, 'messenger'],
    [`${ANDROID} [FB_IAB/MESSENGER;FBAV/482.0.0.12.108;]`, 'messenger'],
    [`${IOS} Instagram 350.0.0.36.89 (iPhone15,2; iOS 17_5; th_TH; th; scale=3.00; 1179x2556; 640000000)`, 'instagram'],
    [`${ANDROID} musical_ly_2023607030 JsSdk/1.0 NetType/WIFI Channel/googleplay AppName/musical_ly app_version/36.7.3 ByteLocale/th-TH BytedanceWebview/d8a21c6`, 'tiktok'],
    [`${IOS} Twitter for iPhone/10.60`, 'twitter'],
  ];
  for (const [ua, app] of cases) {
    assert.equal(inAppBrowser(ua), app, ua);
    assert.ok(APP_NAMES[app], `the note has no name to show for ${app}`);
  }
});

test('system browsers and look-alike words are not app browsers', () => {
  for (const ua of [
    `${IOS} Version/17.5 Mobile/15E148 Safari/604.1`,
    'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Mobile Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36 Edg/129.0.0.0',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Safari/605.1.15',
    `${IOS} Safari Online/2.0`,
    '',
    undefined,
  ]) assert.equal(inAppBrowser(ua), null, String(ua));
});

test('LINE gets a link out to the system browser, the others do not', () => {
  assert.equal(externalUrl('line', 'https://vetmock.com/'), 'https://vetmock.com/?openExternalBrowser=1');
  // An existing query and fragment survive.
  assert.equal(externalUrl('line', 'https://vetmock.com/app/privacy?x=1#terms'), 'https://vetmock.com/app/privacy?x=1&openExternalBrowser=1#terms');
  // Asking twice does not stack the parameter.
  assert.equal(externalUrl('line', 'https://vetmock.com/?openExternalBrowser=1'), 'https://vetmock.com/?openExternalBrowser=1');
  for (const app of ['facebook', 'messenger', 'instagram', 'tiktok', 'twitter', null]) {
    assert.equal(externalUrl(app, 'https://vetmock.com/'), null, String(app));
  }
  assert.equal(externalUrl('line', 'not a url'), null);
});
