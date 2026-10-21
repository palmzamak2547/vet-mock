// Which app's built-in browser, if any, this page is open in. Links tapped in LINE, Facebook,
// Messenger and Instagram open in the app's own browser, where Google refuses to sign anyone in
// (embedded webviews, Google, 2021) and where storage is the app's, not Safari's or Chrome's.
// ponytail: user-agent sniffing; these apps announce themselves there and offer no other signal.

/** @returns {'line'|'facebook'|'instagram'|null} */
export function inAppBrowser(ua = typeof navigator === 'undefined' ? '' : navigator.userAgent) {
  if (/\bLine\/\d/i.test(ua)) return 'line';
  if (/Instagram/i.test(ua)) return 'instagram';
  if (/FBAN|FBAV|FB_IAB|FBIOS|Messenger/i.test(ua)) return 'facebook';
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
