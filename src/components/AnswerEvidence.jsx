import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { cropOf, evidenceBase, evidenceFor, forgetEvidenceBase, hasEvidence, knownBase, prefetchEvidence, slideUrl } from '../lib/evidence.js';
import { useModalFocus } from '../hooks/useModalFocus.js';
import '../styles-evidence.css';

// The slide a revealed answer rests on: the lines that state it, highlighted
// on the real page (docs/ANSWER-EVIDENCE.md). Inline it shows the part of the
// page around those lines; a tap opens the whole page.
//
// Nothing here may move the page after the verdict has painted. The frame is
// drawn only when the address of the images is already known, and with the
// shape the filed record gives it, so neither the image arriving nor the image
// failing changes a height. A visitor the wall does not serve, and a device
// that asks to save data, get the citation line (and, for the latter, a
// button), from the first paint.

// EvidenceSlot.jsx reaches these through this chunk, so the card itself carries none of it.
export const lookup = evidenceFor;
/** A subject's index, and the images' address when the subject has slides: asked for while the question is read. */
export async function warm(subject) {
  await prefetchEvidence(subject);
  if (hasEvidence(subject)) await evidenceBase();
}

// Another account, or none: the address is asked for again.
if (typeof window !== 'undefined') window.addEventListener('vmx-auth-changed', () => forgetEvidenceBase());

const KIND = { slide: 'สไลด์', handout: 'เอกสารประกอบ' };
const pct = (v) => `${Math.round(v * 10000) / 100}%`;

/** The whole page with its highlights; the parent sizes and places it. */
function Page({ src, rec, alt, lazy = false, onLoad, onError, style }) {
  return (
    <div className="vmx-evi-page" style={{ aspectRatio: `${rec.w} / ${rec.h}`, ...style }}>
      <img src={src} alt={alt} decoding="async" loading={lazy ? 'lazy' : undefined} onLoad={onLoad} onError={onError} draggable={false} />
      {rec.boxes.map(([x, y, w, h], i) => (
        <span key={i} className="vmx-evi-mark" aria-hidden="true" style={{ left: pct(x / 1000), top: pct(y / 1000), width: pct(w / 1000), height: pct(h / 1000) }} />
      ))}
    </div>
  );
}

export default function AnswerEvidence({ rec, late = false }) {
  const saveData = typeof navigator !== 'undefined' && navigator.connection?.saveData === true;
  const [wanted, setWanted] = useState(!saveData);   // on a data-saving device the slide waits for a tap
  // The address as this tab knows it now: a string, null (the wall refused) or undefined (still being asked).
  const [base, setBase] = useState(() => knownBase());
  const [state, setState] = useState('wait');        // wait | ready | failed
  const [open, setOpen] = useState(false);
  const triggerRef = useRef(null);
  const closeRef = useRef(null);
  const scrollRef = useRef(null);
  const close = () => {
    setOpen(false);
    window.requestAnimationFrame(() => triggerRef.current?.focus({ preventScroll: true }));
  };
  const dialogRef = useModalFocus({ active: open, onClose: close, initialFocusRef: closeRef });

  // An address that was still on its way when this block appeared may join a review row, or follow the tap of
  // a data-saving device. The practice card keeps what it painted first.
  const mayJoin = late || saveData;
  useEffect(() => {
    if (base !== undefined || !wanted) return undefined;
    let live = true;
    evidenceBase().then((b) => { if (live && mayJoin) setBase(b); });
    return () => { live = false; };
  }, [base, wanted, mayJoin]);

  useEffect(() => {
    if (!open) return undefined;
    const before = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = before; };
  }, [open]);

  // Read once: the frame keeps its shape if the phone is turned, so nothing under it moves.
  const [narrow] = useState(() => typeof window !== 'undefined' && window.matchMedia?.('(max-width: 640px)').matches === true);
  const crop = cropOf(rec, { narrow });
  const zoom = narrow ? (rec.w > rec.h * 1.2 ? 2.2 : 1.6) : 1;
  useEffect(() => {
    const box = scrollRef.current;
    if (!open || !box || zoom === 1 || !rec.boxes.length) return;
    const [x, y, w, h] = rec.boxes[0];
    box.scrollLeft = ((x + w / 2) / 1000) * box.scrollWidth - box.clientWidth / 2;
    box.scrollTop = ((y + h / 2) / 1000) * box.scrollHeight - box.clientHeight / 2;
  }, [open, zoom, rec]);

  const kind = KIND[rec.kind] || 'เอกสาร';
  const cite = `${rec.title} หน้า ${rec.page}`;
  const alt = `${kind} ${cite} ไฮไลต์คือข้อความที่ใช้เฉลยข้อนี้`;
  const src = typeof base === 'string' ? slideUrl(base, rec) : null;
  const ratio = rec.w / rec.h;

  return (
    <div className="vmx-evi">
      <div className="vmx-evi-head">
        <span className="k">จาก{kind}ที่เรียน</span>
        <span className="vmx-evi-cite">{cite}</span>
      </div>
      {!wanted && (
        <button type="button" className="vmx-evi-ask" onClick={() => setWanted(true)}>ดูสไลด์ที่ใช้เฉลย</button>
      )}
      {wanted && src && (
        <button
          ref={triggerRef}
          type="button"
          className={`vmx-evi-frame${state === 'ready' ? ' is-ready' : ''}`}
          style={{ aspectRatio: String(crop.shape) }}
          onClick={() => state === 'ready' && setOpen(true)}
          aria-disabled={state !== 'ready' || undefined}
          aria-label={state === 'failed' ? `โหลดภาพไม่ได้: ${alt}` : `เปิดเต็มหน้า: ${alt}`}
        >
          {state !== 'failed' && (
            <Page
              src={src}
              rec={rec}
              alt={alt}
              lazy={late}
              onLoad={() => setState('ready')}
              // The box stays: a note takes the image's place. The address is asked for again with the next
              // question, which is what repairs a tab that kept an address from before the folder was moved.
              onError={() => { setState('failed'); forgetEvidenceBase(); }}
              style={{ width: pct(1 / crop.cw), left: pct(-crop.cx / crop.cw), top: pct(-crop.cy / crop.ch) }}
            />
          )}
          {state === 'failed' && <span className="vmx-evi-note">โหลดภาพสไลด์ไม่ได้</span>}
          {state === 'ready' && (
            <span className="vmx-evi-hint" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" /></svg>
              <span className="vmx-evi-hint-text">ดูเต็มหน้า</span>
            </span>
          )}
        </button>
      )}
      {/* In <body>, not inside the verdict panel: that panel is a live region, and it animates with a transform. */}
      {open && src && createPortal((
        <div
          ref={dialogRef}
          onClick={close}
          role="dialog"
          aria-modal="true"
          aria-label={`${kind} ${cite}`}
          data-vmx-modal="true"
          tabIndex={-1}
          className="vmx-image-lightbox"
        >
          <button ref={closeRef} type="button" onClick={(e) => { e.stopPropagation(); close(); }} aria-label="ปิด" className="vmx-image-lightbox__close">×</button>
          {/* On a phone a landscape slide at screen width is too small to read: it opens magnified,
              scrolled to the highlighted lines, and is panned by dragging. */}
          <div
            className="vmx-evi-scroll"
            ref={scrollRef}
            style={narrow ? undefined : { width: `min(100%, calc((100vh - 120px) * ${ratio}))` }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="vmx-evi-full" style={{ aspectRatio: `${rec.w} / ${rec.h}`, width: pct(zoom) }}>
              <Page src={src} rec={rec} alt={alt} style={{ width: '100%' }} />
            </div>
          </div>
          <div className="vmx-image-lightbox__hint">{cite}</div>
        </div>
      ), document.body)}
    </div>
  );
}
