// ============================================================
// inapp.js — the app browsers Thai students open links from
// ============================================================
// A VetMock link shared in a LINE group, a Facebook post or an Instagram bio
// opens inside that app's own browser. Google refuses OAuth sign-in in most
// of them ("disallowed_useragent"), and their storage is separate from the
// system browser's, so the landing's sign-in says so before the reader tries.
// LINE documents a way out: add openExternalBrowser=1 and it opens the
// default browser. The others need the app's own menu.
// ============================================================

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
