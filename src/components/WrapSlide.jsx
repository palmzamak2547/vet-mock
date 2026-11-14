// ============================================================
// WrapSlide — the real slide under the wrap-up line that cites it
// ============================================================
// Words read next to the picture they came from are remembered better than
// the words alone, so a line that cites a deck page shows that page under it.
// The picture and who may see it are the answer evidence's
// (docs/ANSWER-EVIDENCE.md): the page images sit behind an address that
// /api/evidence-pass gives to Chula members only, and the record of which
// pages exist and their sizes ships in src/data/evidence/. lib/wrap-slide.js
// matches a citation to that record.
//
// The frame is drawn only once the address is known (the view asks once per
// page), at the page's own shape, so the image arriving or failing moves
// nothing under it. A visitor the wall does not serve sees the citation and
// no frame; a page with no picture shows nothing at all, never an empty box.
// ============================================================
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { evidenceBase, forgetEvidenceBase, knownBase, slideUrl } from '../lib/evidence.js';
import { useModalFocus } from '../hooks/useModalFocus.js';
import '../styles-evidence.css';

const KIND = { slide: 'สไลด์', handout: 'เอกสารประกอบ' };
const isOffline = () => typeof navigator !== 'undefined' && navigator.onLine === false;

/**
 * The address of the page images for this tab: a string for a member, null for
 * anyone else or while offline. Asked once, only when the page has a picture to
 * show, again when the connection comes back or the account changes.
 */
export function useSlideBase(wanted) {
  // undefined while it is still being asked, so the page can wait for the answer before it draws.
  const [base, setBase] = useState(() => knownBase());
  const [round, setRound] = useState(0);
  useEffect(() => {
    if (!wanted) return undefined;
    let live = true;
    const known = knownBase();
    if (typeof known === 'string' || known === null) { setBase(known); return undefined; }
    // Offline the wall cannot be asked; a refusal now would hold for minutes.
    if (isOffline()) { setBase(null); return undefined; }
    evidenceBase().then((b) => { if (live) setBase(b); });
    return () => { live = false; };
  }, [wanted, round]);
  useEffect(() => {
    if (!wanted || typeof window === 'undefined') return undefined;
    const again = () => setRound((n) => n + 1);
    const changed = () => { forgetEvidenceBase(); setBase(null); again(); };
    window.addEventListener('online', again);
    window.addEventListener('vmx-auth-changed', changed);
    return () => { window.removeEventListener('online', again); window.removeEventListener('vmx-auth-changed', changed); };
  }, [wanted]);
  return base;
}

/** The slide under one line: rec from slideFor, base from useSlideBase. */
export default function WrapSlide({ rec, base }) {
  // wait | ready | failed | offline
  const [state, setState] = useState(() => (isOffline() ? 'offline' : 'wait'));
  const [attempt, setAttempt] = useState(0);
  const [open, setOpen] = useState(false);
  const triggerRef = useRef(null);
  const closeRef = useRef(null);
  const close = () => {
    setOpen(false);
    window.requestAnimationFrame(() => triggerRef.current?.focus({ preventScroll: true }));
  };
  const dialogRef = useModalFocus({ active: open, onClose: close, initialFocusRef: closeRef });

  // Offline, an image that has not arrived waits for the connection, then tries once more.
  useEffect(() => {
    if (state !== 'offline' && state !== 'failed') return undefined;
    const back = () => { setState('wait'); setAttempt((n) => n + 1); };
    window.addEventListener('online', back);
    return () => window.removeEventListener('online', back);
  }, [state]);

  useEffect(() => {
    if (!open) return undefined;
    const before = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = before; };
  }, [open]);

  // Read once: on a phone a landscape page opens magnified, panned by dragging.
  const [narrow] = useState(() => typeof window !== 'undefined' && window.matchMedia?.('(max-width: 640px)').matches === true);
  if (typeof base !== 'string' || !rec) return null;
  const kind = KIND[rec.kind] || 'เอกสาร';
  const cite = `${rec.title} หน้า ${rec.page}`;
  const alt = `${kind} ${cite}`;
  const src = `${slideUrl(base, rec)}${attempt ? `?r=${attempt}` : ''}`;
  const ratio = rec.w / rec.h;
  const zoom = narrow && ratio > 1.2 ? 2 : 1;

  const retry = () => {
    if (isOffline()) { setState('offline'); return; }
    // The address may have moved (docs/ANSWER-EVIDENCE.md): ask again, then reload the image.
    forgetEvidenceBase();
    evidenceBase().finally(() => { setState('wait'); setAttempt((n) => n + 1); });
  };

  return (
    <div className="vmx-wrap-slide" data-state={state}>
      <button
        ref={triggerRef}
        type="button"
        className={`vmx-evi-frame vmx-wrap-slide-frame${state === 'ready' ? ' is-ready' : ''}`}
        style={{ aspectRatio: `${rec.w} / ${rec.h}` }}
        onClick={() => { if (state === 'ready') setOpen(true); else if (state === 'failed' || state === 'offline') retry(); }}
        aria-busy={state === 'wait' || undefined}
        aria-label={
          state === 'ready' ? `ดูเต็มจอ: ${alt}`
            : state === 'failed' ? `โหลดภาพไม่ได้ แตะเพื่อลองอีกครั้ง: ${alt}`
              : state === 'offline' ? `ยังไม่ได้ต่ออินเทอร์เน็ต: ${alt}`
                : `กำลังโหลด: ${alt}`
        }
      >
        {state !== 'failed' && state !== 'offline' && (
          <span className="vmx-evi-page" style={{ inset: 0, width: '100%', height: '100%' }}>
            <img
              key={attempt}
              src={src}
              alt={alt}
              loading="lazy"
              decoding="async"
              draggable={false}
              onLoad={() => setState('ready')}
              onError={() => setState(isOffline() ? 'offline' : 'failed')}
            />
          </span>
        )}
        {state === 'failed' && <span className="vmx-evi-note">โหลดภาพสไลด์ไม่ได้ แตะเพื่อลองอีกครั้ง</span>}
        {state === 'offline' && <span className="vmx-evi-note">ยังไม่ได้ต่ออินเทอร์เน็ต สไลด์จะขึ้นเมื่อต่อได้</span>}
        {state === 'ready' && (
          <span className="vmx-evi-hint" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" /></svg>
            <span className="vmx-evi-hint-text">ดูเต็มจอ</span>
          </span>
        )}
      </button>
      {open && createPortal((
        <div
          ref={dialogRef}
          onClick={close}
          role="dialog"
          aria-modal="true"
          aria-label={alt}
          data-vmx-modal="true"
          tabIndex={-1}
          className="vmx-image-lightbox"
        >
          <button ref={closeRef} type="button" onClick={(e) => { e.stopPropagation(); close(); }} aria-label="ปิด" className="vmx-image-lightbox__close">×</button>
          <div
            className="vmx-evi-scroll"
            style={narrow ? undefined : { width: `min(100%, calc((100vh - 120px) * ${ratio}))` }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="vmx-evi-full" style={{ aspectRatio: `${rec.w} / ${rec.h}`, width: `${zoom * 100}%` }}>
              <span className="vmx-evi-page" style={{ position: 'absolute', inset: 0 }}>
                <img src={src} alt={alt} decoding="async" draggable={false} />
              </span>
            </div>
          </div>
          <div className="vmx-image-lightbox__hint">{cite}</div>
        </div>
      ), document.body)}
    </div>
  );
}
