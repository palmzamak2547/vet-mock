// ============================================================
// PWAInstallChip — A2HS prompt entry point
// ============================================================
//
// Renders a small "📲 ติดตั้งแอปลงเครื่อง" chip ONLY when:
//   • Browser supports beforeinstallprompt (Chrome/Edge/Samsung)
//   • OR running in iOS Safari itself (which doesn't fire the event but
//     supports A2HS via Share → Add to Home Screen). Never an app's own
//     browser (LINE, Facebook, Instagram, ...): it cannot add the page, even
//     when its user agent says "Safari"; the hub says to open a browser first.
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
// On iOS: opens an instructional modal explaining the manual flow. The steps
// live in lib/install-guide.js (iPad and iPhone differ, and iOS 26 moved Share
// behind a More button), so a wording slip fails a test.
// ============================================================

import { useState, useSyncExternalStore } from 'react';
import { useModalFocus } from '../hooks/useModalFocus.js';
import { clearInstallPrompt, getInstallPrompt, subscribeInstallPrompt } from '../lib/install-prompt.js';
import { installEnvironment, iosSteps } from '../lib/install-guide.js';

const DISMISS_KEY = 'vmx-pwa-install-dismissed';

function isStandalone() {
  if (typeof window === 'undefined') return false;
  if (window.matchMedia?.('(display-mode: standalone)').matches) return true;
  if (window.navigator.standalone === true) return true; // iOS Safari
  return false;
}

// Which browser this is decides which steps are true (src/lib/install-guide.js):
// Safari itself, an iPad versus an iPhone, and never an app's own browser (LINE,
// Facebook, ...), which has no Add to Home Screen of Safari's even when its user
// agent says "Safari". Read once per page load: a user agent never changes while
// a tab is open, so re-sniffing on every render would only cost work.
const ENVIRONMENT = (() => {
  if (typeof window === 'undefined') return installEnvironment();
  const nav = window.navigator;
  return installEnvironment({
    ua: nav.userAgent,
    platform: nav.platform,
    maxTouchPoints: nav.maxTouchPoints,
    touchEnd: typeof document !== 'undefined' && 'ontouchend' in document,
  });
})();

// Words in “quotes” are labels on the phone's own screen: print them bold.
const withBoldLabels = (text) => text.split(/(“[^”]+”)/).map((part, i) => (
  part.startsWith('“') ? <strong key={i}>{part}</strong> : part
));

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
  const canIosTip = ENVIRONMENT.iosSafari;
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

  return (
    <>
      {/* 44 px tall pill; both buttons fill its height so the whole chip
          is the tap target. No `all: unset`: it also removed the focus ring. */}
      <div style={{
        display: 'inline-flex', alignItems: 'stretch',
        minHeight: 'var(--touch-min)', padding: hub ? '0 14px' : '0 0 0 14px', borderRadius: 999,
        background: 'rgba(74, 107, 74, 0.10)',
        border: '1px solid var(--clr-sage)',
        fontSize: 13,
        color: 'var(--clr-sage-text)',
      }}>
        <button
          type="button"
          className="vmx-link-btn"
          onClick={handleClick}
          style={{ background: 'none', border: 0, padding: 0, font: 'inherit', color: 'inherit', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4, borderRadius: 999 }}
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
            style={{ background: 'none', border: 0, padding: 0, font: 'inherit', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minWidth: 'var(--touch-min)', color: 'var(--clr-ink-soft)', fontSize: 16, lineHeight: 1, borderRadius: 999 }}
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
              {iosSteps({ ipad: ENVIRONMENT.ipad }).map((step) => <li key={step}>{withBoldLabels(step)}</li>)}
            </ol>
            <p style={{ marginTop: 12, fontSize: 12, color: 'var(--clr-ink-soft)' }}>
              หลังติดตั้งแล้วจะไม่มีแถบด้านบนทั้งหน้าจอ เปิดเหมือนแอปในเครื่อง
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
