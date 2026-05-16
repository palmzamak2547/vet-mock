// ============================================================
// PdfThumbnailSidebar — page thumbnails for PdfAnnotateView
// ============================================================
//
// Renders one small canvas per page at ~50% scale, but only when
// the canvas scrolls into view (IntersectionObserver). For a
// 200-page slide deck that means we lazily render ~10 pages at
// a time instead of all 200 up front — keeps the worker idle and
// memory flat.
//
// Orange dot in the corner of pages that have at least one stroke
// (annotatedPages: Set<number>) so the user can scan their work.
// Active page gets an accent border + bold caption.
//
// 44 px min row height for touch targets (iOS HIG).
// ============================================================

import { useEffect, useRef, useState } from 'react';

export default function PdfThumbnailSidebar({ pdfDoc, currentPage, onPageSelect, annotatedPages }) {
  if (!pdfDoc) return null;
  const total = pdfDoc.numPages || 0;
  return (
    <div
      className="vmx-pdf-sidebar"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        padding: 8,
        background: 'var(--clr-surface, #f7f7f4)',
        borderRight: '1px solid var(--clr-border, #e1ddd2)',
        overflowY: 'auto',
        minWidth: 0,
      }}
      role="list"
      aria-label="หน้าของ PDF"
    >
      {Array.from({ length: total }, (_, i) => i + 1).map((pageNum) => (
        <ThumbItem
          key={pageNum}
          pdfDoc={pdfDoc}
          pageNum={pageNum}
          isActive={pageNum === currentPage}
          hasAnnotation={annotatedPages?.has(pageNum) || false}
          onSelect={onPageSelect}
        />
      ))}
    </div>
  );
}

function ThumbItem({ pdfDoc, pageNum, isActive, hasAnnotation, onSelect }) {
  const rowRef = useRef(null);
  const canvasRef = useRef(null);
  const [rendered, setRendered] = useState(false);
  const [visible, setVisible] = useState(false);

  // IntersectionObserver: flip `visible` true the first time the row
  // enters the viewport, then stop observing. We never un-render once
  // drawn — re-rasterising on every scroll-back would thrash pdfjs.
  useEffect(() => {
    const el = rowRef.current;
    if (!el || rendered) return;
    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          setVisible(true);
          io.disconnect();
          break;
        }
      }
    }, { rootMargin: '200px 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, [rendered]);

  useEffect(() => {
    if (!visible || rendered) return;
    let cancelled = false;
    (async () => {
      try {
        const page = await pdfDoc.getPage(pageNum);
        if (cancelled) return;
        const viewport = page.getViewport({ scale: 0.25 });
        const canvas = canvasRef.current;
        if (!canvas) return;
        canvas.width = Math.floor(viewport.width);
        canvas.height = Math.floor(viewport.height);
        const ctx = canvas.getContext('2d');
        await page.render({ canvasContext: ctx, viewport }).promise;
        if (!cancelled) setRendered(true);
      } catch {
        // Page failed to render — show placeholder. The main viewer
        // will surface the real error if the user clicks through.
        if (!cancelled) setRendered(true);
      }
    })();
    return () => { cancelled = true; };
  }, [visible, rendered, pdfDoc, pageNum]);

  return (
    <button
      ref={rowRef}
      type="button"
      onClick={() => onSelect?.(pageNum)}
      className="vmx-pdf-thumb"
      style={{
        position: 'relative',
        minHeight: 44,
        padding: 6,
        borderRadius: 8,
        border: isActive
          ? '2px solid var(--clr-accent, #4a6b4a)'
          : '1px solid var(--clr-border, #e1ddd2)',
        background: isActive ? 'var(--clr-accent-soft, #e8efe4)' : 'transparent',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 4,
      }}
      aria-current={isActive ? 'page' : undefined}
      aria-label={`หน้า ${pageNum}${hasAnnotation ? ' (มี annotation)' : ''}`}
    >
      <div style={{ position: 'relative', lineHeight: 0 }}>
        <canvas
          ref={canvasRef}
          style={{
            display: 'block',
            maxWidth: '100%',
            height: 'auto',
            background: '#fff',
            boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
            borderRadius: 2,
          }}
        />
        {!rendered && (
          <div
            aria-hidden="true"
            style={{
              width: 90, height: 120, background: '#eee',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 10, color: '#888',
            }}
          >…</div>
        )}
        {hasAnnotation && (
          <span
            aria-hidden="true"
            style={{
              position: 'absolute', top: 4, right: 4,
              width: 10, height: 10, borderRadius: '50%',
              background: '#e67e22',
              border: '1.5px solid #fff',
              boxShadow: '0 1px 2px rgba(0,0,0,0.25)',
            }}
          />
        )}
      </div>
      <span style={{
        fontSize: 11,
        fontFamily: 'JetBrains Mono, monospace',
        fontWeight: isActive ? 700 : 400,
        color: isActive ? 'var(--clr-accent, #4a6b4a)' : 'var(--clr-ink-soft, #777)',
      }}>{pageNum}</span>
    </button>
  );
}
