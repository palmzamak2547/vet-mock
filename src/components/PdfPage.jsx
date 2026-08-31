// ============================================================
// PdfPage — one page of the scrolling reader
// ============================================================
//
// The reader used to render a single page and swap it on prev/next. Reading a
// deck that way means pressing a button between every slide, which is not how
// anyone reads and not how the apps students compare this to behave.
//
// So the reader is a scrolling column and this is one row of it. Each page:
//
//   • knows its own number, which is what a stroke drawn here is filed under
//   • renders itself only when it comes near the viewport, and lets go of its
//     bitmap when it goes far away again — a 300-page textbook cannot hold 300
//     rasters, and on iOS a tab that tries is killed with no error at all
//   • reserves its height BEFORE it renders, so the column does not jump under
//     the reader's hand as pages arrive
//
// Drawing state (the stroke in progress, the pinch, the pan) lives in the
// parent, because a gesture can begin on one page and end on another. This
// component only supplies its own page number to the handlers it is given.

import { useEffect, useRef, useState } from 'react';
import { redrawInk, inkDpr } from '../lib/ink.js';

// How far outside the viewport a page still renders. One viewport of runway
// each way is enough to make scrolling feel continuous without rendering the
// whole document.
const RUNWAY = 1.0;

export default function PdfPage({
  pdfDoc,
  pageNum,
  scale,
  strokes,
  cacheKeyPrefix,
  getCached,
  putCached,
  handlers,
  onSize,
  registerOverlay,
  active,
  cursor,
  scrollRoot,
}) {
  const rowRef = useRef(null);
  const baseRef = useRef(null);
  const overlayRef = useRef(null);
  const taskRef = useRef(null);
  const [near, setNear] = useState(false);
  const [size, setSize] = useState(null); // { w, h } in CSS px at this scale

  // ── near the viewport? ───────────────────────────────────────────────
  useEffect(() => {
    const el = rowRef.current;
    if (!el) return undefined;
    if (typeof IntersectionObserver === 'undefined') { setNear(true); return undefined; }
    // The root MUST be the scrolling frame, not the viewport. With a null root
    // the browser clips the target against every scrolling ancestor BEFORE it
    // applies rootMargin, so a row scrolled out of the frame is already gone
    // and no amount of runway brings it back — measured: exactly one page
    // rendered at a time, and a page only started drawing once it was already
    // on screen.
    const root = scrollRoot?.current || el.parentElement || null;
    const io = new IntersectionObserver(
      (entries) => { for (const e of entries) setNear(e.isIntersecting); },
      { root, rootMargin: `${Math.round(RUNWAY * 100)}% 0px` },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [scrollRoot]);

  // ── the page's own size, known before it is drawn ────────────────────
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!pdfDoc) return;
      try {
        const page = await pdfDoc.getPage(pageNum);
        if (cancelled) return;
        const vp = page.getViewport({ scale });
        const s = { w: Math.floor(vp.width), h: Math.floor(vp.height) };
        setSize(s);
        onSize?.(pageNum, s);
      } catch { /* a page that will not measure will not render either */ }
    })();
    return () => { cancelled = true; };
  }, [pdfDoc, pageNum, scale, onSize]);

  // ── render, and release when far away ────────────────────────────────
  useEffect(() => {
    if (!pdfDoc || !size) return undefined;
    let cancelled = false;
    const base = baseRef.current;
    const overlay = overlayRef.current;
    if (!base || !overlay) return undefined;

    if (!near) {
      // Let the bitmap go. Setting width to 0 is what actually frees it;
      // clearing the context leaves the backing store allocated.
      base.width = 0; base.height = 0;
      overlay.width = 0; overlay.height = 0;
      return undefined;
    }

    const dpr = inkDpr();
    (async () => {
      try {
        if (taskRef.current) { try { taskRef.current.cancel(); } catch { /* already done */ } taskRef.current = null; }
        const page = await pdfDoc.getPage(pageNum);
        if (cancelled) return;
        const w = size.w; const h = size.h;
        base.width = w * dpr; base.height = h * dpr;
        base.style.width = `${w}px`; base.style.height = `${h}px`;
        overlay.width = w * dpr; overlay.height = h * dpr;
        overlay.style.width = `${w}px`; overlay.style.height = `${h}px`;

        const ctx = base.getContext('2d');
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, base.width, base.height);

        const key = `${cacheKeyPrefix}:${pageNum}@${scale.toFixed(3)}x${dpr}`;
        const cached = getCached?.(key);
        if (cached) {
          ctx.drawImage(cached, 0, 0);
        } else {
          const task = page.render({
            canvasContext: ctx,
            viewport: page.getViewport({ scale: scale * dpr }),
          });
          taskRef.current = task;
          await task.promise;
          if (cancelled) return;
          taskRef.current = null;
          putCached?.(key, base);
        }
        redrawInk(overlay, strokes, dpr * scale);
      } catch (e) {
        if (e?.name !== 'RenderingCancelledException') {
          console.error('[pdf-page] render failed on page', pageNum, e);
        }
      }
    })();
    return () => {
      cancelled = true;
      if (taskRef.current) { try { taskRef.current.cancel(); } catch { /* already done */ } }
    };
    // `strokes` is deliberately absent: repainting the ink does not need the
    // page rendered again, and the effect below does it on its own.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pdfDoc, pageNum, scale, near, size?.w, size?.h, cacheKeyPrefix]);

  // ── ink follows its strokes ──────────────────────────────────────────
  useEffect(() => {
    if (!near || !size) return;
    const overlay = overlayRef.current;
    if (!overlay || !overlay.width) return;
    redrawInk(overlay, strokes, inkDpr() * scale);
  }, [strokes, near, size, scale]);

  useEffect(() => {
    registerOverlay?.(pageNum, overlayRef);
    return () => registerOverlay?.(pageNum, null);
  }, [pageNum, registerOverlay]);

  const h = size?.h ?? Math.round((scale || 1) * 800);
  const w = size?.w ?? Math.round((scale || 1) * 600);
  const hasInk = (strokes?.length || 0) > 0;

  return (
    <div
      ref={rowRef}
      data-page={pageNum}
      className="vmx-pdf-page"
      style={{ position: 'relative', width: w, height: h, margin: '0 auto 14px', lineHeight: 0 }}
    >
      <canvas
        ref={baseRef}
        style={{
          display: 'block', width: w, height: h, background: '#fff',
          boxShadow: active ? '0 0 0 2px var(--vmx-color-accent, #4a6b4a), 0 4px 24px rgba(0,0,0,0.4)'
            : '0 4px 24px rgba(0,0,0,0.4)',
        }}
      />
      <canvas
        ref={overlayRef}
        {...(handlers || {})}
        style={{
          position: 'absolute', top: 0, left: 0, width: w, height: h,
          touchAction: 'none', cursor,
          WebkitTouchCallout: 'none', WebkitUserSelect: 'none', userSelect: 'none',
        }}
      />
      {/* The page number sits on the page itself, because in a scrolling
          column the one at the bottom of the screen is not the one the
          toolbar is talking about. */}
      <span
        aria-hidden="true"
        style={{
          position: 'absolute', bottom: 6, right: 8, padding: '2px 7px', borderRadius: 999,
          fontSize: 11, fontFamily: 'var(--vmx-mono)', lineHeight: 1.6,
          background: 'rgba(20,20,20,0.62)', color: '#fff', pointerEvents: 'none',
        }}
      >{pageNum}{hasInk ? ' ✍' : ''}</span>
    </div>
  );
}
