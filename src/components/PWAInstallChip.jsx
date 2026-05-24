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
// On Chrome-family: tapping fires the native prompt.
// On iOS: opens an instructional modal explaining the manual flow.
// ============================================================

import { useEffect, useState } from 'react';

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

export default function PWAInstallChip() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showIosTip, setShowIosTip] = useState(false);
  const [dismissed, setDismissed] = useState(() => {
    try { return window.localStorage.getItem(DISMISS_KEY) === '1'; } catch { return false; }
  });

  useEffect(() => {
    if (isStandalone()) return; // already installed
    const onBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', onBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', onBeforeInstall);
  }, []);

  if (dismissed || isStandalone()) return null;

  // Show on iOS Safari even without beforeinstallprompt — the path is
  // manual (Share → Add to Home Screen) but the chip helps users find
  // it. Hidden in iOS Chrome/Firefox (they piggyback on Safari quirks
  // and don't have a clean A2HS path either).
  const canPrompt = !!deferredPrompt;
  const canIosTip = isIOSSafari();
  if (!canPrompt && !canIosTip) return null;

  const handleClick = async () => {
    if (canPrompt && deferredPrompt) {
      try {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
          // Native prompt closes itself; clear and persist dismissal
          try { window.localStorage.setItem(DISMISS_KEY, '1'); } catch {}
          setDismissed(true);
        }
        setDeferredPrompt(null);
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
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        padding: '6px 12px', borderRadius: 999,
        background: 'rgba(74, 107, 74, 0.10)',
        border: '1px solid var(--clr-sage)',
        fontSize: 13,
        color: 'var(--clr-sage)',
      }}>
        <button
          type="button"
          className="vmx-link-btn"
          onClick={handleClick}
          style={{ all: 'unset', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4 }}
          aria-label="ติดตั้ง VetMock เป็นแอปบนเครื่อง"
        >
          📲 ติดตั้งแอป
        </button>
        <button
          type="button"
          className="vmx-link-btn"
          onClick={dismiss}
          aria-label="ปิดข้อความนี้"
          title="ไม่แสดงอีก"
          style={{ all: 'unset', cursor: 'pointer', color: 'var(--clr-ink-soft)', fontSize: 14, lineHeight: 1 }}
        >×</button>
      </div>

      {showIosTip && (
        <div
          className="vmx-modal-overlay"
          onClick={() => setShowIosTip(false)}
          role="dialog"
          aria-label="วิธีติดตั้งบน iOS"
        >
          <div
            className="vmx-modal"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: 420 }}
          >
            <h3 style={{ margin: '0 0 8px', fontSize: 18 }}>📲 ติดตั้งบน iPhone / iPad</h3>
            <ol style={{ paddingLeft: 20, margin: 0, fontSize: 14, lineHeight: 1.7 }}>
              <li>กดปุ่ม <strong>Share</strong> ⬆ ที่แถบล่าง Safari</li>
              <li>เลื่อนหา <strong>"Add to Home Screen"</strong> (เพิ่มที่หน้าจอโฮม)</li>
              <li>กด <strong>Add</strong> มุมขวาบน</li>
            </ol>
            <p style={{ marginTop: 12, fontSize: 12, color: 'var(--clr-ink-soft)' }}>
              เปิดจาก home screen จะได้ประสบการณ์เหมือน native app · เร็วกว่า · ไม่มีแถบ browser
            </p>
            <div className="vmx-btn-row" style={{ marginTop: 14 }}>
              <button className="vmx-btn vmx-btn-ghost" onClick={() => setShowIosTip(false)} type="button">ปิด</button>
              <button className="vmx-btn vmx-btn-ghost" onClick={dismiss} type="button">ไม่แสดงอีก</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
