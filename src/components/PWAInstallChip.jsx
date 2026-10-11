// ============================================================
// PWAInstallChip — A2HS prompt entry point
// ============================================================
//
// Renders a small "📲 ติดตั้งแอปลงเครื่อง" chip ONLY when:
//   • Browser supports beforeinstallprompt (Chrome/Edge/Samsung)
//   • OR running in iOS Safari (which doesn't fire the event but
//     supports A2HS via Share → Add to Home Screen)
//   • AND user hasn't dismissed for this version
//   • AND not already installed (display-mode: standalone)
//
// The install event itself is caught once at boot by lib/install-prompt.js
// and read from there: Chromium raises it once per page load, so a chip that
// mounts later (the profile hub's) would otherwise never see it.
//
// In the profile hub (`hub`) the chip is the permanent way to install: it
// ignores the dismissal Home's chip stores, has no "don't show again", and
// says how to install by hand when the browser offers nothing.
//
// On Chrome-family: tapping fires the native prompt.
// On iOS: opens an instructional modal explaining the manual flow.
// iPadOS 15+ keeps the Safari toolbar at the TOP of the screen, so the
// modal swaps the step wording for iPad instead of naming a bottom bar.
// ============================================================

import { useState, useSyncExternalStore } from 'react';
import { useModalFocus } from '../hooks/useModalFocus.js';
import { clearInstallPrompt, getInstallPrompt, subscribeInstallPrompt } from '../lib/install-prompt.js';

const DISMISS_KEY = 'vmx-pwa-install-dismissed';

function isStandalone() {
  if (typeof window === 'undefined') return false;
  if (window.matchMedia?.('(display-mode: standalone)').matches) return true;
  if (window.navigator.standalone === true) return true; // iOS Safari
  return false;
}

function isIOSSafari() {
  if (typeof window === 'undefined') return false;
  const ua = window.navigator.userAgent;
  // iPadOS 13+ reports a Mac user agent — `iPad` no longer in UA.
  // Distinguish a touch-Mac (real iPad) from a real Mac via touchpoint
  // count + 'ontouchend' presence. Apple has confirmed this is the
  // sanctioned detection path.
  const isIOSDevice =
    /iPad|iPhone|iPod/.test(ua) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1) ||
    (/Macintosh/.test(ua) && 'ontouchend' in document);
  if (!isIOSDevice) return false;
  // On iOS, Chrome/Firefox/Edge all run on WebKit but identify with their
  // own UA tokens. We only want plain Safari since other browsers don't
  // expose A2HS — they'd send the user to a dead end if we showed the tip.
  const isSafari = /Safari/.test(ua) && !/CriOS|FxiOS|EdgiOS/.test(ua);
  return isSafari;
}

// iPad vs iPhone decides WHICH Safari toolbar the instructions name.
// iPadOS 13+ gives Safari a desktop Mac UA, exactly like isIOSSafari() says
// above: `iPad` disappears from the UA and a real iPad shows up as a touch
// Mac. That is the same sanctioned detection path (a Mac platform with more
// than one touch point, or `ontouchend` present on the document), so an iPad
// on iPadOS 17 reads the same as one on iPadOS 12 that still says `iPad`.
// Read once per page load: a user agent never changes while a tab is open, so
// re-sniffing on every render would only cost work.
const IS_IPAD = (() => {
  if (typeof window === 'undefined') return false;
  const ua = window.navigator.userAgent;
  if (/iPad/.test(ua)) return true; // iPadOS 12 and older, still identified
  const isTouchMac = navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1;
  return isTouchMac || (/Macintosh/.test(ua) && 'ontouchend' in document);
})();

const noInstallPrompt = () => null;

export default function PWAInstallChip({ hub = false }) {
  const deferredPrompt = useSyncExternalStore(subscribeInstallPrompt, getInstallPrompt, noInstallPrompt);
  const [showIosTip, setShowIosTip] = useState(false);
  const [installed, setInstalled] = useState(false);
  const dialogRef = useModalFocus({ active: showIosTip, onClose: () => setShowIosTip(false) });
  const [dismissed, setDismissed] = useState(() => {
    try { return window.localStorage.getItem(DISMISS_KEY) === '1'; } catch { return false; }
  });

  if (installed || isStandalone() || (dismissed && !hub)) return null;

  // Show on iOS Safari even without beforeinstallprompt — the path is
  // manual (Share → Add to Home Screen) but the chip helps users find
  // it. Hidden in iOS Chrome/Firefox (they piggyback on Safari quirks
  // and don't have a clean A2HS path either).
  const canPrompt = !!deferredPrompt;
  const canIosTip = isIOSSafari();
  if (!canPrompt && !canIosTip) {
    // The hub is where a student goes on purpose to install, so an empty slot
    // is a dead end: say how to do it by hand (in-app browsers, Firefox, or
    // a browser that has not offered the install yet).
    return hub ? (
      <p style={{ margin: 0, fontSize: 13, lineHeight: 1.7, color: 'var(--clr-ink-soft)' }}>
        เปิดด้วย Chrome หรือ Safari แล้วเลือกติดตั้งแอปหรือเพิ่มที่หน้าจอโฮมจากเมนูของเบราว์เซอร์
      </p>
    ) : null;
  }

  const handleClick = async () => {
    if (canPrompt && deferredPrompt) {
      // A prompt can be shown once, so it leaves the store as it is used.
      clearInstallPrompt();
      try {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
          // Native prompt closes itself; clear and persist dismissal
          try { window.localStorage.setItem(DISMISS_KEY, '1'); } catch {}
          setDismissed(true);
          setInstalled(true);
        }
      } catch {}
    } else if (canIosTip) {
      setShowIosTip(true);
    }
  };

  const dismiss = () => {
    try { window.localStorage.setItem(DISMISS_KEY, '1'); } catch {}
    setDismissed(true);
    setShowIosTip(false);
  };

  // The student reporting the bug is on an iPad: the share button sits in the
  // toolbar at the TOP of Safari, not the bottom one iPhone uses, so the old
  // single wording sent them looking at a bar that is not on their screen.
  const shareRow = IS_IPAD ? 'แถบบน' : 'แถบล่าง';

  return (
    <>
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        padding: '6px 12px', borderRadius: 999,
        background: 'rgba(74, 107, 74, 0.10)',
        border: '1px solid var(--clr-sage)',
        fontSize: 13,
        color: 'var(--clr-sage-text)',
      }}>
        <button
          type="button"
          className="vmx-link-btn"
          onClick={handleClick}
          style={{ all: 'unset', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4 }}
          aria-label="ติดตั้ง VetMock เป็นแอปบนเครื่อง"
          title="ติดตั้งแล้วไม่มีแถบด้านบนทั้งหน้าจอ เปิดเหมือนแอปในเครื่อง"
        >
          📲 ติดตั้งแอป
        </button>
        {!hub && (
          <button
            type="button"
            className="vmx-link-btn"
            onClick={dismiss}
            aria-label="ปิดข้อความนี้"
            title="ไม่แสดงอีก"
            style={{ all: 'unset', cursor: 'pointer', color: 'var(--clr-ink-soft)', fontSize: 14, lineHeight: 1 }}
          >×</button>
        )}
      </div>

      {showIosTip && (
        <div
          className="vmx-modal-overlay"
          onClick={() => setShowIosTip(false)}
        >
          <div
            ref={dialogRef}
            className="vmx-modal"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: 420 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="vmx-pwa-ios-title"
            tabIndex={-1}
            data-vmx-modal="true"
          >
            <h3 id="vmx-pwa-ios-title" style={{ margin: '0 0 8px', fontSize: 18 }}>ติดตั้งบน iPhone / iPad</h3>
            <ol style={{ paddingLeft: 20, margin: 0, fontSize: 14, lineHeight: 1.7 }}>
              <li>กดปุ่ม <strong>Share</strong> ⬆ ที่{shareRow} Safari</li>
              <li>เลื่อนหา <strong>"Add to Home Screen"</strong> (เพิ่มที่หน้าจอโฮม)</li>
              <li>กด <strong>Add</strong> มุมขวาบน</li>
            </ol>
            <p style={{ marginTop: 12, fontSize: 12, color: 'var(--clr-ink-soft)' }}>
              หลังติดตั้งแล้วจะไม่มีแถบด้านบนทั้งหน้าจอ เปิดเหมือนแอปในเครื่องและเร็วกว่าเดิม
            </p>
            <div className="vmx-btn-row" style={{ marginTop: 14 }}>
              <button className="vmx-btn vmx-btn-ghost" onClick={() => setShowIosTip(false)} type="button">ปิด</button>
              {!hub && <button className="vmx-btn vmx-btn-ghost" onClick={dismiss} type="button">ไม่แสดงอีก</button>}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
