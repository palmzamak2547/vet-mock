// The app browsers Thai students open links from: a copy of src/lib/inapp.js in the main app
// (research/ never imports ../src). Google refuses OAuth sign-in inside them
// ("disallowed_useragent"), so the Chula sign-in wall offers the way out instead: LINE opens the
// system browser for openExternalBrowser=1, the others need the app's own menu. No network, no
// storage. OWNER: runtime role.

const APPS = [
  ['line', /\bLine\/\d/i],
  // iOS writes FBAN/MessengerForiOS; Android writes FB_IAB/MESSENGER.
  ['messenger', /\bFB_IAB\/MESSENGER\b|\bFBAN\/Messenger|\bMessenger(?:ForiOS|Lite)?\//i],
  ['facebook', /\bFBAN\/|\bFBAV\/|\bFB_IAB\/|\bFBIOS\b/],
  ['instagram', /\bInstagram\b/],
  ['tiktok', /\bmusical_ly\b|\bBytedanceWebview\b|\bTikTok\b/i],
  ['twitter', /\bTwitter(?:Android)?\b/],
];

/** What each app is called on screen, in either language. */
export const APP_NAMES = { line: 'LINE', messenger: 'Messenger', facebook: 'Facebook', instagram: 'Instagram', tiktok: 'TikTok', twitter: 'X' };

/** Which app browser this user agent belongs to, or null. */
export function inAppBrowser(ua) {
  const s = String(ua || '');
  for (const [id, re] of APPS) if (re.test(s)) return id;
  return null;
}

/** A URL that leaves the app for the system browser, where one exists. */
export function externalUrl(app, href) {
  if (app !== 'line') return null;
  try {
    const u = new URL(href);
    u.searchParams.set('openExternalBrowser', '1');
    return u.toString();
  } catch {
    return null;
  }
}
