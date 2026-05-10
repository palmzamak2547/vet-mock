import { useEffect, useState } from 'react';

// Inline image that opens in a full-screen lightbox modal when tapped.
// Tap anywhere outside the image (or the × button, or press Esc) to close.
//
// Why a modal instead of `target="_blank"`:
//   On PWA standalone mode (iOS Safari especially) opening a new tab can
//   trap the user — no obvious back button, can't close the tab. A modal
//   we own with explicit dismiss is reliable across browsers and PWA.
export default function ZoomableImage({ src, alt = 'ภาพประกอบคำถาม', maxHeight = 360 }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    // Lock background scroll while modal open
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  return (
    <>
      <div style={{ textAlign: 'center', margin: '12px 0' }}>
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onClick={() => setOpen(true)}
          style={{
            maxWidth: '100%',
            maxHeight,
            borderRadius: 8,
            border: '1px solid var(--clr-border, #ddd)',
            cursor: 'zoom-in',
          }}
        />
      </div>
      {open && (
        <div
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="ภาพขยาย — กดที่ใดก็ได้เพื่อปิด"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.92)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 16,
            cursor: 'zoom-out',
          }}
        >
          <button
            onClick={(e) => { e.stopPropagation(); setOpen(false); }}
            aria-label="ปิด"
            style={{
              position: 'absolute',
              top: 16,
              right: 16,
              width: 44,
              height: 44,
              borderRadius: '50%',
              border: 'none',
              background: 'rgba(255, 255, 255, 0.15)',
              color: 'white',
              fontSize: 24,
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backdropFilter: 'blur(8px)',
            }}
          >
            ×
          </button>
          <img
            src={src}
            alt={alt}
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'contain',
              cursor: 'default',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: 16,
              left: '50%',
              transform: 'translateX(-50%)',
              fontSize: 12,
              color: 'rgba(255, 255, 255, 0.7)',
              fontFamily: 'JetBrains Mono, monospace',
              pointerEvents: 'none',
            }}
          >
            แตะนอกภาพ, กด ×, Esc เพื่อปิด
          </div>
        </div>
      )}
    </>
  );
}
