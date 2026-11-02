// Which app's built-in browser, if any, this page is open in. Links tapped in LINE, Facebook,
// Messenger, Instagram, TikTok and X open in the app's own browser, where Google refuses to sign
// anyone in (embedded webviews, Google, 2021) and where storage is the app's, not Safari's or
// Chrome's. The detection is the main app's (src/lib/inapp.js), so every VetMock origin names
// the same apps; the Chula sign-in wall and the sign-in sheet both read it.
// ponytail: user-agent sniffing; these apps announce themselves there and offer no other signal.

const APPS = [
  ['line', /\bLine\/\d/i],
  // iOS writes FBAN/MessengerForiOS; Android writes FB_IAB/MESSENGER.
  ['messenger', /\bFB_IAB\/MESSENGER\b|\bFBAN\/Messenger|\bMessenger(?:ForiOS|Lite)?\//i],
  ['facebook', /\bFBAN\/|\bFBAV\/|\bFB_IAB\/|\bFBIOS\b/],
  ['instagram', /\bInstagram\b/],
  ['tiktok', /\bmusical_ly\b|\bBytedanceWebview\b|\bTikTok\b/i],
  ['twitter', /\bTwitter(?:Android)?\b/],
];

/** What each app is called on screen. */
export const APP_NAMES = { line: 'LINE', messenger: 'Messenger', facebook: 'Facebook', instagram: 'Instagram', tiktok: 'TikTok', twitter: 'X' };

/** @returns {'line'|'messenger'|'facebook'|'instagram'|'tiktok'|'twitter'|null} */
export function inAppBrowser(ua = typeof navigator === 'undefined' ? '' : navigator.userAgent) {
  const s = String(ua || '');
  for (const [id, re] of APPS) if (re.test(s)) return id;
  return null;
}

/**
 * This address, asking LINE to open it in the phone's own browser. LINE honours the parameter
 * on links opened from LINE (developers.line.biz, "Using LINE URL scheme").
 */
export function lineExternalUrl(href) {
  const url = new URL(href);
  url.searchParams.set('openExternalBrowser', '1');
  return url.href;
}
