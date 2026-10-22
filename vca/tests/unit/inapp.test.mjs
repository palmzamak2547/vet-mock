// The app browsers that Google sign-in does not work in, told apart from ordinary browsers.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { inAppBrowser, lineExternalUrl } from '../../src/lib/inapp.js';

const UA = {
  lineIos: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Safari Line/15.10.0',
  lineAndroid: 'Mozilla/5.0 (Linux; Android 14; Pixel 7; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/130.0.0.0 Mobile Safari/537.36 Line/15.10.0/IAB',
  fbIos: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 [FBAN/FBIOS;FBAV/480.0.0;FBLC/th_TH]',
  messenger: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 [FBAN/MessengerForiOS;FBAV/480.0]',
  igAndroid: 'Mozilla/5.0 (Linux; Android 14; Pixel 7; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/130.0.0.0 Mobile Safari/537.36 Instagram 350.0.0.0 Android',
  safari: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1',
  chrome: 'Mozilla/5.0 (Linux; Android 14; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Mobile Safari/537.36',
  // "Online" contains "line": only LINE's own token counts.
  desk: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36 Online/1',
};

test('LINE, Facebook, Messenger and Instagram are named; ordinary browsers are not', () => {
  assert.equal(inAppBrowser(UA.lineIos), 'line');
  assert.equal(inAppBrowser(UA.lineAndroid), 'line');
  assert.equal(inAppBrowser(UA.fbIos), 'facebook');
  assert.equal(inAppBrowser(UA.messenger), 'facebook');
  assert.equal(inAppBrowser(UA.igAndroid), 'instagram');
  assert.equal(inAppBrowser(UA.safari), null);
  assert.equal(inAppBrowser(UA.chrome), null);
  assert.equal(inAppBrowser(UA.desk), null);
  assert.equal(inAppBrowser(''), null);
});

test('the LINE hand-off keeps the page and its query, and adds the parameter once', () => {
  assert.equal(lineExternalUrl('https://vca.vetmock.com/exam'), 'https://vca.vetmock.com/exam?openExternalBrowser=1');
  assert.equal(lineExternalUrl('https://vca.vetmock.com/practice?mode=mock#x'), 'https://vca.vetmock.com/practice?mode=mock&openExternalBrowser=1#x');
  assert.equal(lineExternalUrl('https://vca.vetmock.com/?openExternalBrowser=1'), 'https://vca.vetmock.com/?openExternalBrowser=1');
});
