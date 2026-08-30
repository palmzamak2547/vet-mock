// ============================================================
// clipboard — robust copy-to-clipboard with multi-tier fallback
// ============================================================
//
// `navigator.clipboard.writeText` is gated on secure context (HTTPS).
// In-app browsers (LINE, Facebook, Instagram WebView) and older
// Safari (< 13.4) often expose the API but reject the call OR don't
// expose it at all.
//
// Naïve usage like `navigator.clipboard?.writeText(t)` is a trap:
// when `navigator.clipboard` is undefined, `?.` short-circuits and
// the expression resolves to `undefined`. `await undefined` returns
// `undefined` WITHOUT throwing — so a try/catch can't detect failure.
// The user clicks "Copy" and sees a success toast, but nothing was
// actually copied.
//
// This helper:
//   1. Tries the async Clipboard API IF it exists (proper detection,
//      not `?.`).
//   2. Falls back to the classic `document.execCommand('copy')` via
//      a hidden textarea — works in iOS in-app browsers + older Safari.
//   3. Reports a real success/failure result so callers can toast the
//      right message.
//
// Must be called from inside a user gesture (click/touch handler) —
// both paths are restricted to gesture context by all browsers.
// ============================================================

export async function copyText(text) {
  if (typeof text !== 'string' || !text) {
    return { ok: false, reason: 'empty' };
  }

  // Path A — modern Clipboard API. Detect the method directly, not via
  // optional chaining, so undefined methods don't masquerade as success.
  if (typeof navigator !== 'undefined'
    && navigator.clipboard
    && typeof navigator.clipboard.writeText === 'function') {
    try {
      await navigator.clipboard.writeText(text);
      return { ok: true, method: 'clipboard' };
    } catch {
      // Fall through to execCommand path — Clipboard API can reject
      // in iframes, non-HTTPS dev origins, or sandboxed in-app browsers.
    }
  }

  // Path B — legacy textarea + execCommand. Still works in iOS LINE,
  // Facebook, Instagram in-app browsers where Clipboard API is absent.
  if (typeof document === 'undefined') {
    return { ok: false, reason: 'no-dom' };
  }
  try {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    // Off-screen but in the layout tree — required for iOS to select
    ta.style.position = 'fixed';
    ta.style.top = '0';
    ta.style.left = '0';
    ta.style.opacity = '0';
    ta.style.pointerEvents = 'none';
    document.body.appendChild(ta);

    // iOS Safari needs contentEditable + readonly + setSelectionRange
    // to actually allow programmatic selection of textarea content.
    const isIOS = /iPad|iPhone|iPod/.test(navigator?.userAgent || '');
    if (isIOS) {
      ta.contentEditable = 'true';
      const range = document.createRange();
      range.selectNodeContents(ta);
      const sel = window.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(range);
      ta.setSelectionRange(0, text.length);
    } else {
      ta.select();
    }

    const ok = document.execCommand('copy');
    ta.remove();
    if (ok) return { ok: true, method: 'execCommand' };
    return { ok: false, reason: 'execCommand-failed' };
  } catch (e) {
    return { ok: false, reason: 'exception', error: e?.message };
  }
}
