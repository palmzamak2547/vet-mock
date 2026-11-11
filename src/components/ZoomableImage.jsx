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

// Two arrows pulling apart: the strip under a picture reads as a control, not as a caption.
const ExpandIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
    <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
  </svg>
);
const RetryIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
    <path d="M3 12a9 9 0 0 1 15.5-6.2L21 8M21 3v5h-5M21 12a9 9 0 0 1-15.5 6.2L3 16M3 21v-5h5" />
  </svg>
);

// Inline image that opens in a full-screen lightbox modal when tapped.
// Tap anywhere outside the image (or the × button, or press Esc) to close.
//
// Why a modal instead of `target="_blank"`:
//   On PWA standalone mode (iOS Safari especially) opening a new tab can
//   trap the user — no obvious back button, can't close the tab. A modal
//   we own with explicit dismiss is reliable across browsers and PWA.
//
// The figure keeps one box through all three of its states: while its file is
// on the way, once it is in, and when it did not come. The stem and the
// options under it never move for a picture.
export default function ZoomableImage({
  src,
  alt = 'ภาพประกอบคำถาม',
  caption,
  credit,
  sourceUrl,
  maxHeight = 360,
}) {
  const [open, setOpen] = useState(false);
  // What became of the file, kept with the address it is true of: a card that
  // moves to the next question reads 'loading' for the new picture at once,
  // with no effect to race the picture's own load event.
  const [seen, setSeen] = useState({ src, state: 'loading', attempt: 0, zoomed: false });
  const now = seen.src === src ? seen : { src, state: 'loading', attempt: 0, zoomed: false };
  const mark = (change) => setSeen((prev) => ({ ...(prev.src === src ? prev : { src, state: 'loading', attempt: 0, zoomed: false }), ...change }));
  const failed = now.state === 'failed';
  const triggerRef = useRef(null);
  const closeRef = useRef(null);
  const focusTrigger = useRef(false);
  const closeLightbox = () => {
    setOpen(false);
    // Mobile WebKit does not always restore focus to a control activated by
    // touch. Keep an explicit trigger ref in addition to the shared modal hook.
    window.requestAnimationFrame(() => triggerRef.current?.focus({ preventScroll: true }));
  };
  const dialogRef = useModalFocus({
    active: open && !failed,
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

  // A picture already in the browser's memory can be complete before React
  // hears its load event.
  const imageRef = useRef(null);
  useEffect(() => {
    const el = imageRef.current;
    if (el && el.complete && el.naturalWidth > 0 && now.state === 'loading') mark({ state: 'ready' });
  });

  const retry = () => {
    focusTrigger.current = true;
    mark({ state: 'loading', attempt: now.attempt + 1, zoomed: false });
  };
  // The picture is asked for again by itself when the connection comes back.
  useEffect(() => {
    if (!failed) return undefined;
    const again = () => mark({ state: 'loading', attempt: now.attempt + 1, zoomed: false });
    window.addEventListener('online', again);
    return () => window.removeEventListener('online', again);
  }, [failed, src, now.attempt]); // eslint-disable-line react-hooks/exhaustive-deps
  // The retry button leaves with the note it stood under: focus goes to the picture.
  useEffect(() => {
    if (!focusTrigger.current || failed) return;
    focusTrigger.current = false;
    triggerRef.current?.focus?.({ preventScroll: true });
  }, [failed, now.attempt]);

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
          // The frame the picture would have had, to the pixel: the note takes
          // the picture's place and the retry takes the strip's.
          <div className="vmx-zoom-trigger is-failed">
            <div
              className="vmx-zoom-missing"
              style={size ? { aspectRatio: `${size.width} / ${size.height}`, maxHeight } : { maxHeight }}
            >
              <p className="vmx-zoom-missing-note" role="status">ภาพโหลดไม่ได้</p>
              <p className="vmx-zoom-missing-alt">{alt}</p>
            </div>
            <button type="button" className="vmx-zoom-hint vmx-zoom-retry" onClick={retry}>
              <RetryIcon />
              ลองโหลดอีกครั้ง
            </button>
          </div>
        ) : (
          <button
            ref={triggerRef}
            type="button"
            className="vmx-zoom-trigger"
            onClick={() => setOpen(true)}
            aria-label={`เปิดภาพขยาย: ${alt}`}
          >
            <span className={`vmx-zoom-frame${now.state === 'ready' ? ' is-loaded' : ''}`}>
              <img
                key={now.attempt}
                ref={imageRef}
                src={src}
                alt={alt}
                width={size?.width}
                height={size?.height}
                loading="lazy"
                decoding="async"
                onLoad={() => mark({ state: 'ready' })}
                onError={() => { mark({ state: 'failed' }); setOpen(false); }}
                className="vmx-zoom-inline"
                style={{ maxHeight, height: 'auto' }}
              />
            </span>
            <span className="vmx-zoom-hint" aria-hidden="true"><ExpandIcon />ขยายภาพ</span>
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
          aria-label="ภาพขยาย"
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
          {/* The largest box of the picture's own shape that fits the screen, so
              a small picture is drawn larger here, never smaller than on the
              card, and the box is there before the file is. */}
          <div
            className={`vmx-image-lightbox__frame${size ? ' is-sized' : ''}${now.zoomed ? ' is-loaded' : ''}`}
            style={size ? { '--zoom-ratio': String(size.width / size.height) } : undefined}
            onClick={(e) => e.stopPropagation()}
          >
            {!now.zoomed && <span className="vmx-image-lightbox__wait" aria-hidden="true">กำลังโหลดภาพ</span>}
            <img
              src={src}
              alt={alt}
              width={size?.width}
              height={size?.height}
              onLoad={() => mark({ zoomed: true })}
              onError={() => { mark({ state: 'failed' }); setOpen(false); }}
              className="vmx-image-lightbox__image"
            />
          </div>
          <div className="vmx-image-lightbox__hint">
            แตะนอกภาพ, กด ×, Esc เพื่อปิด
          </div>
        </div>
      )}
    </>
  );
}
