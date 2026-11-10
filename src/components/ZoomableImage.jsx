import { useEffect, useRef, useState } from 'react';
import { useModalFocus } from '../hooks/useModalFocus.js';
import { loadMediaSizes, mediaSize, mediaSizesLoaded } from '../lib/media-size.js';

const OFFICIAL_SOURCE_HOSTS = [
  /(^|\.)who\.int$/i,
  /(^|\.)cdc\.gov$/i,
  /(^|\.)ncbi\.nlm\.nih\.gov$/i,
  /(^|\.)doi\.org$/i,
  /(^|\.)woah\.org$/i,
  /(^|\.)fao\.org$/i,
];

function safeOfficialSourceUrl(value) {
  if (!value || typeof value !== 'string') return null;
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:') return null;
    return OFFICIAL_SOURCE_HOSTS.some((pattern) => pattern.test(url.hostname))
      ? url.href
      : null;
  } catch {
    return null;
  }
}

// Inline image that opens in a full-screen lightbox modal when tapped.
// Tap anywhere outside the image (or the × button, or press Esc) to close.
//
// Why a modal instead of `target="_blank"`:
//   On PWA standalone mode (iOS Safari especially) opening a new tab can
//   trap the user — no obvious back button, can't close the tab. A modal
//   we own with explicit dismiss is reliable across browsers and PWA.
export default function ZoomableImage({
  src,
  alt = 'ภาพประกอบคำถาม',
  caption,
  credit,
  sourceUrl,
  maxHeight = 360,
}) {
  const [open, setOpen] = useState(false);
  const [failed, setFailed] = useState(false);
  const triggerRef = useRef(null);
  const closeRef = useRef(null);
  const closeLightbox = () => {
    setOpen(false);
    // Mobile WebKit does not always restore focus to a control activated by
    // touch. Keep an explicit trigger ref in addition to the shared modal hook.
    window.requestAnimationFrame(() => triggerRef.current?.focus({ preventScroll: true }));
  };
  const dialogRef = useModalFocus({
    active: open,
    onClose: closeLightbox,
    initialFocusRef: closeRef,
  });
  const officialSourceUrl = safeOfficialSourceUrl(sourceUrl);
  // The figure's pixel size, known before its file arrives (lib/media-size.js).
  // With it the browser gives the image its final box at once (full width,
  // height by the ratio, never past maxHeight), so nothing below moves when
  // the picture loads.
  const size = mediaSize(src);
  const sized = Boolean(size);
  // The sizes arrive with the question banks, before a set can start. A card
  // drawn ahead of them (a set kept on this device, opened the moment the app
  // does) asks for them itself and is drawn again when they land.
  const [, sizesLanded] = useState(false);
  useEffect(() => {
    if (sized || mediaSizesLoaded()) return undefined;
    let alive = true;
    loadMediaSizes().then(() => { if (alive) sizesLanded(true); });
    return () => { alive = false; };
  }, [src, sized]);

  useEffect(() => { setFailed(false); }, [src]);

  useEffect(() => {
    if (!open) return;
    // Lock background scroll while modal open
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  return (
    <>
      <figure className="vmx-zoom-figure">
        {failed ? (
          <div className="vmx-image-error" role="status">
            ภาพประกอบโหลดไม่ได้ — ตรวจการเชื่อมต่อแล้วลองใหม่
          </div>
        ) : (
          <button
            ref={triggerRef}
            type="button"
            className="vmx-zoom-trigger"
            onClick={() => setOpen(true)}
            aria-label={`เปิดภาพขยาย: ${alt}`}
          >
            <img
              src={src}
              alt={alt}
              width={size?.width}
              height={size?.height}
              loading="lazy"
              decoding="async"
              onError={() => setFailed(true)}
              className="vmx-zoom-inline"
              style={{ maxHeight, height: 'auto' }}
            />
            <span className="vmx-zoom-hint" aria-hidden="true">ขยายภาพ</span>
          </button>
        )}
        {(caption || credit || officialSourceUrl) && (
          <figcaption className="vmx-figure-caption">
            {caption && <span>{caption}</span>}
            {(credit || officialSourceUrl) && (
              <span className="vmx-figure-credit">
                {credit}
                {officialSourceUrl && (
                  <>
                    {credit ? ' — ' : ''}
                    <a href={officialSourceUrl} target="_blank" rel="noreferrer">เปิดแหล่งที่มา</a>
                  </>
                )}
              </span>
            )}
          </figcaption>
        )}
      </figure>
      {open && !failed && (
        <div
          ref={dialogRef}
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
          aria-label="ภาพขยาย — กดที่ใดก็ได้เพื่อปิด"
          data-vmx-modal="true"
          tabIndex={-1}
          className="vmx-image-lightbox"
        >
          <button
            ref={closeRef}
            type="button"
            onClick={(e) => { e.stopPropagation(); closeLightbox(); }}
            aria-label="ปิดภาพขยาย"
            className="vmx-image-lightbox__close"
          >
            ×
          </button>
          <img
            src={src}
            alt={alt}
            onClick={(e) => e.stopPropagation()}
            className="vmx-image-lightbox__image"
          />
          <div className="vmx-image-lightbox__hint">
            แตะนอกภาพ, กด ×, Esc เพื่อปิด
          </div>
        </div>
      )}
    </>
  );
}
