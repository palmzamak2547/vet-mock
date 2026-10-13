// ============================================================
// share.js: one way out for every share card
// ============================================================
// 1. The system share sheet with the image file (Safari on iOS, Chrome on
//    Android). The image is rendered when the card opens, not on the tap:
//    Safari allows a share only shortly after the tap, and a 3840 px render
//    on every tap could outlast it (NotAllowedError).
// 2. Inside an app's own browser (LINE, Instagram, Facebook, TikTok, X) a file
//    share is usually missing and a download link does nothing while the old
//    cards still said "downloaded". The caller shows the image to long-press
//    and save instead.
// 3. Anywhere else, a download.
// ============================================================

import { inAppBrowser } from '../inapp.js';

export function triggerDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  // The download has its own copy once started; free the URL a little later.
  setTimeout(() => URL.revokeObjectURL(url), 60_000);
}

/**
 * Hand a rendered card to the student.
 * @returns {Promise<{ outcome: 'shared' | 'cancelled' | 'show' | 'downloaded' }>}
 *   'show': the caller displays the image to long-press and save.
 */
export async function deliverCard(blob, {
  filename,
  title,
  text,
  share = true,
  nav = typeof navigator === 'undefined' ? null : navigator,
  ua = typeof navigator === 'undefined' ? '' : navigator.userAgent,
  download = triggerDownload,
} = {}) {
  const inApp = inAppBrowser(ua);
  if (share && nav && typeof nav.share === 'function' && typeof File !== 'undefined') {
    const file = new File([blob], filename, { type: blob.type || 'image/png' });
    if (typeof nav.canShare === 'function' && nav.canShare({ files: [file] })) {
      try {
        await nav.share({ files: [file], title, text });
        return { outcome: 'shared' };
      } catch (err) {
        // InvalidStateError: a share sheet is already open (a second tap).
        if (err?.name === 'AbortError' || err?.name === 'InvalidStateError') return { outcome: 'cancelled' };
        // NotAllowedError or a share target that failed: fall through to save.
      }
    }
  }
  if (inApp) return { outcome: 'show' };
  download(blob, filename);
  return { outcome: 'downloaded' };
}
