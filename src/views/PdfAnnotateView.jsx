// ============================================================
// PdfAnnotateView — PDF import + annotate
// ============================================================
//
// Three states:
//   empty   — drag-drop zone + file input + recent-PDFs list
//   loading — spinner while pdfjs parses the upload + renders p.1
//   viewing — page canvas + transparent draw overlay + thumb sidebar
//
// Strokes save per-page into IndexedDB (debounced 500 ms, flushed on the way
// out) keyed by SHA-256(file bytes) — see lib/pdf-annotations.js. PDF bytes
// are NEVER stored; an uploaded file must be re-picked to resume, while a
// library document reopens from the shelf.
//
// The page raster and the ink live on two stacked canvases. The page is
// rendered at 2x DPR and cached as an ImageBitmap so flipping back is free;
// the ink layer asks for `desynchronized` so a stylus draws with the least
// latency the browser will give.
//
// Input is Pointer Events throughout, which is what makes one code path work
// for finger, mouse, Apple Pencil, S Pen and Surface Pen: pressure comes from
// `e.pressure`, every sample between frames from `getCoalescedEvents()`, palm
// rejection from `pointerType`, and the eraser barrel from the button bits.
// `touch-action: none` keeps the page from scrolling under a stroke, so
// two-finger pinch is handled here rather than by the browser.
// ============================================================

import { useState, useEffect, useLayoutEffect, useRef, useCallback } from 'react';
import BackBar from '../components/BackBar.jsx';
import { thaiError } from '../lib/errors.js';
import PdfThumbnailSidebar from '../components/PdfThumbnailSidebar.jsx';
import NavIcon from '../components/NavIcon.jsx';
import {
  hashFile,
  loadAnnotations,
  saveAnnotations,
  listRecentPdfs,
  deleteAnnotations,
  storageHealth,
  newStrokeId,
  peekAnnotations,
} from '../lib/pdf-annotations.js';
import { pullAndMerge, schedulePush, flushPushes, onSyncState, syncState } from '../lib/annotation-sync.js';
import { searchPages, pageTextFromItems } from '../lib/thai-search.js';

const PEN_COLORS = [
  { id: 'red',  rgb: '#c0392b', name: 'แดง' },
  { id: 'blue', rgb: '#2980b9', name: 'น้ำเงิน' },
  { id: 'gold', rgb: '#b88940', name: 'ทอง' },
];
// Highlighter is not a colour of pen, it is a different instrument: wide,
// translucent, flat, and it must sit UNDER nothing — a student marking a
// lecture slide expects the text to stay readable through it.
const HL_COLORS = [
  { id: 'yellow', rgb: '#f7d94c', name: 'เหลือง' },
  { id: 'green',  rgb: '#8fd694', name: 'เขียว' },
  { id: 'pink',   rgb: '#f5a3c7', name: 'ชมพู' },
];
const ZOOM_STEPS = [1, 1.25, 1.5, 2, 2.5, 3];

// iPadOS Safari has reported a desktop "Macintosh" user agent since iPadOS 13,
// so sniffing the UA for "iPad" finds nothing. A Mac has no touch points; an
// iPad reports five.
const isIOS = () => typeof navigator !== 'undefined'
  && /iPad|iPhone|iPod/.test(navigator.userAgent)
  || (typeof navigator !== 'undefined'
      && navigator.platform === 'MacIntel'
      && (navigator.maxTouchPoints || 0) > 1);

// WebKit on iOS kills a tab that uses too much memory WITHOUT an error, an
// unload event, or anything JavaScript can catch — it simply reloads. The
// rendered-page cache is the largest thing this view holds, so it is budgeted
// in megapixels rather than in pages: three A4 pages at 2x DPR and 300% zoom
// would be roughly 130 MB of bitmaps, which is exactly the kind of number that
// makes an iPad drop the tab mid-annotation.
const CACHE_BUDGET_MP = () => (isIOS() ? 24 : 64);

const SIZE_WARN_MB = 30;
const SIZE_HARD_MB = 60;
const AUTOSAVE_MS = 500;

// pdfjs is lazy-loaded on first upload so the worker chunk doesn't
// ship with the home bundle. Worker URL uses `?url` so Vite emits it
// as a static asset — confirmed compatible with vite.config.js's
// `worker: { format: 'es' }`.
let _pdfjsPromise = null;
async function loadPdfjs() {
  if (_pdfjsPromise) return _pdfjsPromise;
  _pdfjsPromise = (async () => {
    const pdfjs = await import('pdfjs-dist');
    try {
      const workerUrl = (await import('pdfjs-dist/build/pdf.worker.min.mjs?url')).default;
      pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;
    } catch {
      // Fallback for environments where the ?url suffix isn't honored.
      pdfjs.GlobalWorkerOptions.workerSrc = new URL(
        'pdfjs-dist/build/pdf.worker.min.mjs',
        import.meta.url,
      ).toString();
    }
    return pdfjs;
  })();
  return _pdfjsPromise;
}

export default function PdfAnnotateView({ goHome, initialDoc = null, onExit = null }) {
  const [pdfDoc, setPdfDoc] = useState(null);
  const [fileHash, setFileHash] = useState(null);
  const [fileName, setFileName] = useState('');
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [strokesByPage, setStrokesByPage] = useState({}); // { [pageNum]: Stroke[] }
  const [tool, setTool] = useState('pen'); // 'pen' | 'highlighter' | 'eraser'
  const [color, setColor] = useState('red');
  const [hlColor, setHlColor] = useState('yellow');
  const [size, setSize] = useState(3);
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState('');
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [recent, setRecent] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  // Fit-to-width is the wrong size for writing. At 100% a lecture slide's
  // body text is ~11 px tall on a laptop and handwriting on top of it is
  // illegible; every serious annotation app zooms, so this one does too.
  const [zoom, setZoom] = useState(1);
  // Redo. Undo without it makes people afraid to undo.
  const [redoStack, setRedoStack] = useState([]);
  // Apple Pencil users rest a hand on the glass. Pointer Events name the
  // input, so a pen-only mode is a one-line test rather than heuristics.
  const [penOnly, setPenOnly] = useState(false);
  const [sawPen, setSawPen] = useState(false);
  // Removals are recorded, not merely absent — see lib/pdf-annotations.js.
  // Without tombstones a merge would resurrect every stroke the student has
  // ever rubbed out, on their other device.
  const [deleted, setDeleted] = useState([]);
  // Where a hovering stylus is pointing, in client coordinates. Null on every
  // device that cannot hover, which is most of them.
  const [hoverPt, setHover] = useState(null);
  // Finding the slide about a thing is the single most common reason to open
  // a lecture deck, and until now the only way was flipping pages by hand.
  const [query, setQuery] = useState('');
  const [hits, setHits] = useState(null); // null = not searched, [] = nothing found
  const [hitIdx, setHitIdx] = useState(0);
  const [searching, setSearching] = useState(false);
  // Handwriting is not recognised — no OCR here, and none pretended. What IS
  // exact is WHERE the writing is: the strokes are vectors with page numbers,
  // so "the slide about rabies that I annotated" is answerable with certainty
  // while "what did I write" is not.
  const [onlyMine, setOnlyMine] = useState(false);
  const [optionsOpen, setOptionsOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [sync, setSync] = useState(() => syncState());

  const fileInputRef = useRef(null);
  const baseCanvasRef = useRef(null);
  const overlayCanvasRef = useRef(null);
  const wrapperRef = useRef(null);
  const drawingRef = useRef({ on: false, points: [] });
  const renderTaskRef = useRef(null);
  const saveTimerRef = useRef(null);
  const currentStrokesRef = useRef([]); // live mirror for autosave
  // Rendered-page cache. Re-rasterising a page the reader just looked at is
  // pure waste — flipping back and forth through a deck was paying the full
  // render every time. Capped at 3 because one 2x-DPR A4 bitmap is ~15 MB of
  // GPU memory and a phone will not forgive a dozen of them.
  const pageCacheRef = useRef(new Map()); // `${hash}:${page}@${scale}x${dpr}` -> ImageBitmap
  const prerenderRef = useRef(null);
  const panRef = useRef(null);
  // Apple Pencil's own double-tap is native-only: it arrives through
  // UIPencilInteraction in UIKit and is not exposed to JavaScript in Safari
  // web content at all. What a page CAN see is the nib itself tapping the
  // glass, so the same gesture is offered from the same hand — two quick taps
  // of the tip toggles the eraser, which is what the Pencil's default setting
  // does natively.
  const tapRef = useRef({ at: 0, x: 0, y: 0 });
  const [sawDoubleTap, setSawDoubleTap] = useState(false);
  // What to come back to when the eraser is toggled off.
  const lastPenToolRef = useRef('pen');
  const footRef = useRef(null);
  const rootRef = useRef(null);
  // The flush lives inside an effect (it needs the listeners' lifetime) but
  // the exit path needs to call it too.
  const flushRef = useRef(null);
  // Page text, extracted once per document and reused for every later search.
  const textRef = useRef({ hash: null, pages: null });
  const searchAbortRef = useRef(0);
  const [frameH, setFrameH] = useState(null);
  // What a flush should write, always current. A flush that closes over
  // render-time state writes whatever was true when its effect last ran, and
  // an effect that depends on the strokes re-runs on every stroke — the two
  // together silently replaced each correct pending save with the snapshot
  // from before that stroke, so nothing a student drew ever reached storage.
  const latestRef = useRef({});
  latestRef.current = { fileHash, fileName, pageCount, strokesByPage, currentPage, deleted };

  // Appends tombstones and returns the new list synchronously, because the
  // caller needs to hand it to the same save that carries the strokes — two
  // separate writes could interleave and drop one half.
  function addTomb(...ids) {
    const fresh = ids.filter(Boolean);
    if (!fresh.length) return latestRef.current.deleted || [];
    const next = [...(latestRef.current.deleted || []), ...fresh];
    latestRef.current.deleted = next;
    setDeleted(next);
    return next;
  }

  // The store moved to IndexedDB, so the recent list arrives a tick late
  // instead of during render. Nothing depends on it being there immediately.
  const refreshRecent = useCallback(() => {
    listRecentPdfs().then(setRecent).catch(() => {});
  }, []);
  useEffect(() => { refreshRecent(); }, [refreshRecent]);
  useEffect(() => onSyncState(setSync), []);

  // ── Toast helper ───────────────────────────────────────────
  const showToast = useCallback((msg, ms = 2500) => {
    setToast(msg);
    setTimeout(() => setToast((t) => (t === msg ? null : t)), ms);
  }, []);

  // ── File ingest ────────────────────────────────────────────
  const ingestFile = useCallback(async (file) => {
    if (!file) return;
    setError(null);
    const isPdf = file.type === 'application/pdf'
      || file.name.toLowerCase().endsWith('.pdf');
    if (!isPdf) {
      setError('ไฟล์ต้องเป็น PDF เท่านั้น');
      return;
    }
    const sizeMB = file.size / (1024 * 1024);
    if (sizeMB > SIZE_HARD_MB) {
      setError(`ไฟล์ใหญ่เกิน ${SIZE_HARD_MB} MB — แยกไฟล์ก่อนอัปโหลด`);
      return;
    }
    if (sizeMB > SIZE_WARN_MB) {
      showToast(`ไฟล์ขนาด ${sizeMB.toFixed(1)} MB — อาจโหลดช้า`, 4000);
    }
    setLoading(true);
    setLoadingMsg('กำลังอ่านไฟล์…');
    try {
      const hash = await hashFile(file);
      setLoadingMsg('กำลังแกะ PDF…');
      const pdfjs = await loadPdfjs();
      const buf = await file.arrayBuffer();
      const doc = await pdfjs.getDocument({ data: buf }).promise;
      const local = await loadAnnotations(hash);
      const existing = await pullAndMerge(hash, local);
      const restoredStrokes = existing?.strokesByPage || {};
      setDeleted(existing?.deleted || []);
      const startPage = Math.min(Math.max(1, Number(existing?.lastPage) || 1), doc.numPages);
      setPdfDoc(doc);
      setFileHash(hash);
      setFileName(file.name);
      setPageCount(doc.numPages);
      setStrokesByPage(restoredStrokes);
      setCurrentPage(startPage);
      currentStrokesRef.current = restoredStrokes[startPage] || [];
      // Persist file metadata immediately (creates the cache entry
      // even before the user draws anything — so the "Recent" list
      // remembers this file on next visit).
      await saveAnnotations(hash, {
        fileName: file.name,
        pageCount: doc.numPages,
        strokesByPage: restoredStrokes,
      });
      refreshRecent();
      if (existing && Object.keys(restoredStrokes).length > 0) {
        showToast('นำรอยเขียนเดิมกลับมาแล้ว', 3000);
      } else {
        showToast('รอบหน้าเลือกไฟล์เดิมอีกครั้ง แล้วรอยเขียนจะกลับมาเอง', 4500);
      }
    } catch (e) {
      console.error('[pdf-annotate] load failed:', e);
      // pdf.js says things like "Invalid PDF structure." — true, in English,
      // and not something a student can act on. The remote path already went
      // through thaiError; this one had been left behind.
      setError(thaiError(e, 'เปิดไฟล์นี้ไม่สำเร็จ ไฟล์อาจเสียหรือไม่ใช่ PDF'));
    } finally {
      setLoading(false);
      setLoadingMsg('');
    }
  }, [showToast, refreshRecent]);

  // ── Remote ingest (study library) ──────────────────────────
  // A library document arrives as metadata, not as bytes. That difference is
  // the whole point: the catalog already carries the SHA-256 the annotation
  // store keys on, so we never have to download a 200 MB textbook just to
  // learn which strokes belong to it.
  //
  // Linearized PDFs are handed to pdf.js as a URL and stream by HTTP range —
  // page 1 paints after ~100 KB instead of after the whole file. Everything
  // else is fetched whole, because chasing a trailing cross-reference table
  // over dozens of small ranges is slower than one sequential download.
  const ingestRemote = useCallback(async (doc) => {
    if (!doc?.url && !doc?.resolve) return;
    setError(null);
    setLoading(true);
    setLoadingMsg('กำลังเปิดเอกสาร…');
    try {
      // `resolve` defers the signed-link mint until here, overlapping it
      // with the pdf.js chunk load — the shelf navigates instantly instead
      // of freezing its button for the mint round-trip.
      const [pdfjs, url] = await Promise.all([
        loadPdfjs(),
        doc.url ? Promise.resolve(doc.url) : doc.resolve(),
      ]);
      const stream = !!doc.linearized;
      let task;
      if (stream) {
        task = pdfjs.getDocument({ url, rangeChunkSize: 65536 });
      } else {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        // Read the body as a stream so the wait can be counted out loud.
        // Exactly one document in the shelf of 1,383 is linearized, so this
        // branch IS the reader: everyone waits for the whole file before page
        // one can paint, and half the shelf is over 5 MB. A spinner that says
        // nothing for fifteen seconds is indistinguishable from a hang — and
        // a student who cannot tell the difference reloads, which starts the
        // download again from zero.
        const buf = await readWithProgress(res, setLoadingMsg);
        task = pdfjs.getDocument({ data: buf });
      }
      setLoadingMsg('กำลังแกะ PDF…');
      const pdf = await task.promise;
      // library_docs.sha256_16 is NOT NULL, so this normally comes straight
      // from the catalog. The slug fallback exists only so a malformed row
      // degrades to "annotations scoped to this document" rather than
      // scattering strokes across a fresh key on every open — deriving it
      // from bytes here would mean downloading the whole file to name it,
      // which is exactly what streaming avoids.
      const hash = doc.sha256 || (doc.slug ? `slug:${doc.slug}` : null);
      if (!hash) throw new Error('เอกสารนี้ไม่มีรหัสอ้างอิง');
      const local = await loadAnnotations(hash);
      // Bring in whatever this account already holds for the document. Merging
      // is a union, so a device that has been offline contributes rather than
      // overwrites; signed out this returns the local record untouched.
      const existing = await pullAndMerge(hash, local);
      const restoredStrokes = existing?.strokesByPage || {};
      setDeleted(existing?.deleted || []);
      // Resume where the reader left off — a 300-page textbook that always
      // reopened at page 1 made every return trip start with scrolling.
      const startPage = Math.min(Math.max(1, Number(existing?.lastPage) || 1), pdf.numPages);
      setPdfDoc(pdf);
      setFileHash(hash);
      setFileName(doc.fileName || 'document.pdf');
      setPageCount(pdf.numPages);
      setStrokesByPage(restoredStrokes);
      setCurrentPage(startPage);
      currentStrokesRef.current = restoredStrokes[startPage] || [];
      await saveAnnotations(hash, {
        fileName: doc.fileName || 'document.pdf',
        pageCount: pdf.numPages,
        strokesByPage: restoredStrokes,
      });
      refreshRecent();
      if (!storageHealth().persistent) {
        showToast('เบราว์เซอร์นี้เก็บรอยเขียนถาวรไม่ได้ รอยที่เขียนจะอยู่แค่จนกว่าจะปิดแท็บ', 6000);
      }
      if (startPage > 1) {
        showToast(`เปิดต่อที่หน้า ${startPage} ✓`, 2500);
      } else if (existing && Object.keys(restoredStrokes).length > 0) {
        showToast('นำรอยเขียนเดิมกลับมาแล้ว', 3000);
      }
    } catch (e) {
      console.error('[pdf-annotate] remote load failed:', e);
      // The old line pasted raw pdf.js/HTTP text into Thai and then asserted
      // 'ลิงก์อาจหมดอายุ' as the cause for every failure, expiry or not.
      setError(thaiError(e, 'เปิดเอกสารจากคลังไม่สำเร็จ ลองกดลองเปิดอีกครั้ง'));
    } finally {
      setLoading(false);
      setLoadingMsg('');
    }
  }, [showToast, refreshRecent]);

  // Opening straight into a library document. Keyed by slug + url so
  // navigating from one library item to another inside the same mount (the
  // command palette can do this) re-ingests instead of showing the previous
  // PDF; navigate-first payloads carry no url, only slug + resolve().
  useEffect(() => {
    if (initialDoc?.url || initialDoc?.resolve) ingestRemote(initialDoc);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialDoc?.url, initialDoc?.slug]);

  // Remember where the reader is, debounced past quick flips. Passing no
  // strokesByPage on purpose — saveAnnotations merges field-by-field, so
  // this can never clobber a stroke autosave racing beside it.
  useEffect(() => {
    if (!pdfDoc || !fileHash) return undefined;
    const t = setTimeout(() => {
      saveAnnotations(fileHash, { fileName, pageCount, lastPage: currentPage })
        .catch(() => { /* the reading position is a convenience, not the work */ });
    }, 800);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, pdfDoc, fileHash]);

  // ── Render current page ────────────────────────────────────
  useEffect(() => {
    if (!pdfDoc) return;
    let cancelled = false;
    (async () => {
      try {
        // Cancel any in-flight render before starting a new one — pdfjs
        // throws "Rendering cancelled" otherwise when the user flips
        // pages quickly through the thumbnail sidebar.
        if (renderTaskRef.current) {
          try { renderTaskRef.current.cancel(); } catch {}
          renderTaskRef.current = null;
        }
        const page = await pdfDoc.getPage(currentPage);
        if (cancelled) return;
        const wrap = wrapperRef.current;
        const baseCanvas = baseCanvasRef.current;
        const overlay = overlayCanvasRef.current;
        if (!baseCanvas || !overlay) return;

        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        // Fit-to-width relative to the available wrapper, clamped so the
        // canvas is never larger than the PDF's intrinsic 1.5× scale.
        const wrapW = (wrap?.clientWidth || 800) - 16;
        const naturalViewport = page.getViewport({ scale: 1 });
        const fitScale = Math.min(2, Math.max(0.6, wrapW / naturalViewport.width)) * zoom;
        const viewport = page.getViewport({ scale: fitScale });

        const cssW = Math.floor(viewport.width);
        const cssH = Math.floor(viewport.height);
        baseCanvas.width = cssW * dpr;
        baseCanvas.height = cssH * dpr;
        baseCanvas.style.width = cssW + 'px';
        baseCanvas.style.height = cssH + 'px';
        overlay.width = cssW * dpr;
        overlay.height = cssH * dpr;
        overlay.style.width = cssW + 'px';
        overlay.style.height = cssH + 'px';
        // The canvas has its new size; put the reader back where they were
        // looking before the scale changed.
        applyAnchor();

        const ctx = baseCanvas.getContext('2d');
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, baseCanvas.width, baseCanvas.height);

        const cacheKey = `${fileHash || 'x'}:${currentPage}@${fitScale.toFixed(3)}x${dpr}`;
        const cached = pageCacheRef.current.get(cacheKey);
        if (cached) {
          ctx.drawImage(cached, 0, 0);
        } else {
          const dprViewport = page.getViewport({ scale: fitScale * dpr });
          const task = page.render({ canvasContext: ctx, viewport: dprViewport });
          renderTaskRef.current = task;
          await task.promise;
          if (cancelled) return;
          renderTaskRef.current = null;
          cachePage(cacheKey, baseCanvas);
        }
        // Redraw saved strokes for this page on the overlay
        redrawOverlay(strokesByPage[currentPage] || []);
        // With the page on screen the worker is idle again — spend that idle
        // on the page the reader is most likely to ask for next.
        schedulePrerender(currentPage + 1, fitScale, dpr);
      } catch (e) {
        if (e?.name === 'RenderingCancelledException') return;
        console.error('[pdf-annotate] render failed:', e);
      }
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pdfDoc, currentPage, zoom]);

  // ── Page raster cache ──────────────────────────────────────
  function cachedMegapixels() {
    let mp = 0;
    for (const bmp of pageCacheRef.current.values()) {
      mp += ((bmp?.width || 0) * (bmp?.height || 0)) / 1e6;
    }
    return mp;
  }

  function cachePage(key, canvas) {
    if (typeof createImageBitmap !== 'function') return;
    const budget = CACHE_BUDGET_MP();
    // A single page can exceed the whole budget at high zoom on a small
    // device. Caching it would evict everything and still not fit, so don't.
    if ((canvas.width * canvas.height) / 1e6 > budget) return;
    createImageBitmap(canvas).then((bmp) => {
      const c = pageCacheRef.current;
      if (c.has(key)) { bmp.close?.(); return; }
      c.set(key, bmp);
      // Evict in insertion order — the oldest entry is the page furthest
      // behind the reader. close() actually frees it; dropping the reference
      // alone leaves the bitmap alive until the collector gets to it.
      while (c.size > 1 && (c.size > 3 || cachedMegapixels() > budget)) {
        const oldest = c.keys().next().value;
        c.get(oldest)?.close?.();
        c.delete(oldest);
      }
    }).catch(() => { /* cache is an optimisation, never a requirement */ });
  }

  function schedulePrerender(pageNum, fitScale, dpr) {
    if (!pdfDoc || pageNum < 1 || pageNum > pdfDoc.numPages) return;
    const key = `${fileHash || 'x'}:${pageNum}@${fitScale.toFixed(3)}x${dpr}`;
    if (pageCacheRef.current.has(key)) return;
    if (prerenderRef.current) clearTimeout(prerenderRef.current);
    prerenderRef.current = setTimeout(async () => {
      try {
        const page = await pdfDoc.getPage(pageNum);
        // The reader may have moved on while this was queued; a prerender that
        // lands after the fact would evict a page that IS on screen.
        if (pageCacheRef.current.has(key)) return;
        const vp = page.getViewport({ scale: fitScale * dpr });
        const off = document.createElement('canvas');
        off.width = Math.floor(vp.width);
        off.height = Math.floor(vp.height);
        await page.render({ canvasContext: off.getContext('2d'), viewport: vp }).promise;
        cachePage(key, off);
      } catch { /* a prerender that fails costs nothing */ }
    }, 300);
  }

  // ── Overlay drawing helpers ────────────────────────────────
  // One context object for the ink layer, requested with the low-latency
  // hint. getContext returns the same context for the same canvas, so asking
  // repeatedly is free, but the attributes only apply on the FIRST call for
  // that canvas — hence a single helper every path goes through, rather than
  // scattered getContext('2d') calls where whichever ran first would decide
  // whether the whole feature got low latency or not.
  function inkCtx() {
    const c = overlayCanvasRef.current;
    if (!c) return null;
    return c.getContext('2d', { desynchronized: true });
  }

  function redrawOverlay(strokes) {
    const c = overlayCanvasRef.current;
    if (!c) return;
    const ctx = inkCtx();
    if (!ctx) return;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, c.width, c.height);
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    for (const stroke of strokes || []) {
      // Widths are authored in CSS pixels; the canvas is DPR-scaled and zoomed,
      // so a stroke drawn at 100% must not become hairline at 300%.
      drawStroke(ctx, stroke, c.width, c.height, dpr * zoom);
    }
  }

  // Sets up the context for one instrument. Shared by the live draw and the
  // redraw so a finished stroke can never look different from the one the
  // student watched themselves make.
  function applyBrush(ctx, stroke) {
    ctx.lineJoin = 'round';
    if (stroke.mode === 'eraser') {
      ctx.lineCap = 'round';
      ctx.globalCompositeOperation = 'destination-out';
      ctx.globalAlpha = 1;
      ctx.strokeStyle = 'rgba(0,0,0,1)';
    } else if (stroke.mode === 'highlighter') {
      // Flat cap and a squat, translucent line: the point of a highlighter is
      // that the words underneath stay readable.
      ctx.lineCap = 'butt';
      ctx.globalCompositeOperation = 'multiply';
      ctx.globalAlpha = 0.38;
      ctx.strokeStyle = stroke.color;
    } else {
      ctx.lineCap = 'round';
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;
      ctx.strokeStyle = stroke.color;
    }
  }

  function resetBrush(ctx) {
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }

  // Width for one point. A pen that reports real pressure (Apple Pencil, S
  // Pen) gets a line that thickens as it is pressed; a mouse reports a
  // constant 0.5 and would only get noise from this, so it keeps a even line.
  function widthAt(stroke, pt, scale) {
    const base = stroke.mode === 'eraser' ? stroke.size * 4
      : stroke.mode === 'highlighter' ? stroke.size * 4.5
        : stroke.size;
    if (!stroke.pressure || pt.length < 3) return base * scale;
    // Pressure is the main term. Tilt adds up to half again on top, the way a
    // pencil laid over on its side covers more paper — and is simply absent on
    // hardware that does not report it.
    const tilt = pt.length > 3 ? (pt[3] || 0) : 0;
    return base * scale * (0.45 + pt[2] * 1.1) * (1 + tilt * 0.5);
  }

  // Draws a stroke as a chain of quadratic curves through the midpoints of
  // consecutive samples, which is what turns a polyline of pointer events into
  // something that reads as handwriting. Each segment is stroked on its own so
  // the width can follow pressure along the line.
  function drawStroke(ctx, stroke, canvasW, canvasH, scale = 1) {
    const pts = stroke?.points;
    if (!pts || pts.length === 0) return;
    applyBrush(ctx, stroke);
    const X = (i) => pts[i][0] * canvasW;
    const Y = (i) => pts[i][1] * canvasH;

    if (stroke.mode === 'highlighter') {
      strokeAsOnePath(ctx, pts, canvasW, canvasH, widthAt(stroke, pts[0], scale));
      resetBrush(ctx);
      return;
    }

    if (pts.length === 1) {
      // A tap is a dot, not nothing.
      ctx.lineWidth = widthAt(stroke, pts[0], scale);
      ctx.beginPath();
      ctx.moveTo(X(0), Y(0));
      ctx.lineTo(X(0) + 0.01, Y(0));
      ctx.stroke();
      resetBrush(ctx);
      return;
    }
    let px = X(0); let py = Y(0);
    for (let i = 1; i < pts.length; i++) {
      const mx = (px + X(i)) / 2;
      const my = (py + Y(i)) / 2;
      ctx.lineWidth = widthAt(stroke, pts[i], scale);
      ctx.beginPath();
      ctx.moveTo(px, py);
      ctx.quadraticCurveTo(px, py, mx, my);
      ctx.lineTo(X(i), Y(i));
      ctx.stroke();
      px = X(i); py = Y(i);
    }
    resetBrush(ctx);
  }

  // One path, one stroke() — the only way a translucent instrument keeps an
  // even tone across its own overlaps.
  function strokeAsOnePath(ctx, pts, canvasW, canvasH, width) {
    ctx.lineWidth = width;
    ctx.beginPath();
    ctx.moveTo(pts[0][0] * canvasW, pts[0][1] * canvasH);
    if (pts.length === 1) {
      ctx.lineTo(pts[0][0] * canvasW + 0.01, pts[0][1] * canvasH);
    } else {
      for (let i = 1; i < pts.length; i++) {
        const x = pts[i][0] * canvasW;
        const y = pts[i][1] * canvasH;
        const px = pts[i - 1][0] * canvasW;
        const py = pts[i - 1][1] * canvasH;
        ctx.quadraticCurveTo(px, py, (px + x) / 2, (py + y) / 2);
      }
      ctx.lineTo(pts[pts.length - 1][0] * canvasW, pts[pts.length - 1][1] * canvasH);
    }
    ctx.stroke();
  }

  // ── Pointer handlers (annotation overlay) ─────────────────
  // How far from upright the stylus is, 0 (vertical) to 1 (almost flat).
  // Safari has reported altitudeAngle since 16.4 and it is the accurate
  // source; tiltX/tiltY are the older, wider-support fallback. Anything that
  // reports neither returns 0 and the brush behaves exactly as before.
  // Tilt rides as a fourth component, so a point stays [x, y] on hardware
  // that reports nothing and never grows for a mouse or a finger.
  function withTilt(pt, tilt) {
    if (!tilt || pt.length < 3) return pt;
    return [pt[0], pt[1], pt[2], Math.round(tilt * 100) / 100];
  }

  function tiltOf(e) {
    if (typeof e.altitudeAngle === 'number' && e.altitudeAngle > 0) {
      // altitudeAngle is radians from the surface: PI/2 is upright.
      return Math.min(1, Math.max(0, 1 - e.altitudeAngle / (Math.PI / 2)));
    }
    const tx = e.tiltX || 0;
    const ty = e.tiltY || 0;
    if (!tx && !ty) return 0;
    return Math.min(1, Math.hypot(tx, ty) / 90);
  }

  function pointFromEvent(e, pressure = 0) {
    const c = overlayCanvasRef.current;
    const rect = c.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const cx = Math.max(0, Math.min(1, x));
    const cy = Math.max(0, Math.min(1, y));
    // Some pens report 0 for a genuine contact; treat that as a normal press
    // rather than a zero-width line the student cannot see.
    return pressure > 0 ? [cx, cy, pressure] : [cx, cy];
  }

  function onPointerDown(e) {
    if (!pdfDoc) return;
    // Anything aimed at the page dismisses the panels, the way a menu closes
    // when you go back to work. Done here rather than with a document-level
    // listener so it cannot fight the toolbar's own buttons.
    if (menuOpen) setMenuOpen(false);
    if (optionsOpen) setOptionsOpen(false);
    if (gestureDown(e)) return;
    // A stylus anywhere on the page proves this device has one, which is what
    // makes offering pen-only mode honest rather than a setting for hardware
    // that may not exist.
    if (e.pointerType === 'pen' && !sawPen) {
      setSawPen(true);
      // Seeing a stylus for the first time turns on palm rejection, because
      // the reason someone picks up an Apple Pencil is to rest their hand on
      // the glass. Announced rather than silent, and one tap undoes it.
      setPenOnly(true);
      showToast('พบปากกา เปิดโหมดเฉพาะปากกาให้แล้ว วางมือบนจอได้ (ปิดได้ที่แถบเครื่องมือ)', 5000);
    }
    // Palm rejection: with a stylus in hand, a hand resting on the glass is
    // not a drawing gesture. But a finger still has a job — it scrolls, the
    // way it does in every notes app that offers this mode. Without that,
    // `touch-action: none` would leave a zoomed page with no way to move
    // around it except two-finger pinching.
    if (penOnly && e.pointerType !== 'pen') {
      const wrap = scroller();
      if (wrap) {
        panRef.current = {
          id: e.pointerId, el: wrap, x: e.clientX, y: e.clientY,
          left: wrap.scrollLeft, top: wrap.scrollTop,
        };
      }
      return;
    }
    e.preventDefault();
    overlayCanvasRef.current?.setPointerCapture?.(e.pointerId);
    const usePressure = e.pointerType === 'pen';
    const useTilt = usePressure;
    // Surface, Wacom and S Pen styluses report the eraser barrel as button 5
    // / buttons bit 32. Flipping the stylus over is how people expect to
    // erase, and honouring it costs one test — the toolbar selection stays, so
    // turning the pen back over resumes drawing with the same pen.
    const barrelEraser = e.pointerType === 'pen' && (e.button === 5 || (e.buttons & 32) !== 0);
    const usedTool = barrelEraser ? 'eraser' : tool;
    const pt = withTilt(pointFromEvent(e, usePressure ? e.pressure : 0), useTilt ? tiltOf(e) : 0);
    drawingRef.current = {
      on: true,
      pointerId: e.pointerId,
      stroke: {
        id: newStrokeId(),
        mode: usedTool,
        color: usedTool === 'highlighter'
          ? (HL_COLORS.find((c) => c.id === hlColor)?.rgb || HL_COLORS[0].rgb)
          : (PEN_COLORS.find((p) => p.id === color)?.rgb || PEN_COLORS[0].rgb),
        size,
        pressure: usePressure,
        points: [pt],
      },
    };
  }

  function onPointerMove(e) {
    if (gestureMove(e)) return;
    const pan = panRef.current;
    if (pan && e.pointerId === pan.id) {
      const wrap = panRef.current.el || scroller();
      if (wrap) {
        wrap.scrollLeft = pan.left - (e.clientX - pan.x);
        wrap.scrollTop = pan.top - (e.clientY - pan.y);
      }
      return;
    }
    // A hovering Apple Pencil (M2 iPad Pro and later) reports movement with no
    // buttons pressed. Showing where the nib will land, at the real brush
    // size, is the difference between aiming and guessing.
    if (e.pointerType === 'pen' && e.buttons === 0) {
      setHover({ x: e.clientX, y: e.clientY });
      return;
    }
    const ref = drawingRef.current;
    if (!ref?.on || e.pointerId !== ref.pointerId) return;
    e.preventDefault();
    const stroke = ref.stroke;
    const c = overlayCanvasRef.current;
    if (!c) return;
    const ctx = inkCtx();
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    // getCoalescedEvents returns every sample the digitiser took since the
    // last frame. A pen runs at ~240 Hz against a 60 Hz screen, so without
    // this three of every four points a student writes are thrown away, which
    // is the single biggest reason fast handwriting comes out angular.
    const raw = typeof e.getCoalescedEvents === 'function' ? e.getCoalescedEvents() : [];
    const samples = raw.length ? raw : [e];
    let added = 0;
    for (const se of samples) {
      const pt = withTilt(
        pointFromEvent(se, stroke.pressure ? se.pressure : 0),
        stroke.pressure ? tiltOf(se) : 0,
      );
      const last = stroke.points[stroke.points.length - 1];
      // Drop near-duplicates so a still hand does not grow the array.
      if (Math.abs(last[0] - pt[0]) < 0.0004 && Math.abs(last[1] - pt[1]) < 0.0004) continue;
      stroke.points.push(pt);
      added++;
    }
    if (!added || stroke.points.length < 2) return;

    if (stroke.mode === 'highlighter') {
      // Cannot extend a translucent stroke in place; repaint the page's
      // settled strokes and lay the live one over them as a single path. A
      // highlighter swipe is short, so this stays cheap.
      redrawOverlay(currentStrokesRef.current);
      applyBrush(ctx, stroke);
      strokeAsOnePath(ctx, stroke.points, c.width, c.height, widthAt(stroke, stroke.points[0], dpr * zoom));
      resetBrush(ctx);
      return;
    }

    // Repaint only the tail the new samples changed, so extending a long
    // stroke stays as cheap as starting a short one.
    const n = stroke.points.length;
    const from = Math.max(1, n - added);
    applyBrush(ctx, stroke);
    let px = stroke.points[from - 1][0] * c.width;
    let py = stroke.points[from - 1][1] * c.height;
    for (let i = from; i < n; i++) {
      const x = stroke.points[i][0] * c.width;
      const y = stroke.points[i][1] * c.height;
      ctx.lineWidth = widthAt(stroke, stroke.points[i], dpr * zoom);
      ctx.beginPath();
      ctx.moveTo(px, py);
      ctx.quadraticCurveTo(px, py, (px + x) / 2, (py + y) / 2);
      ctx.lineTo(x, y);
      ctx.stroke();
      px = x; py = y;
    }
    resetBrush(ctx);
  }

  function onPointerUp(e) {
    // A tap is a pointer that went down and came up in the same place, quickly
    // and without drawing anything worth keeping. Two of them in a row, from a
    // stylus, mean the reader wants the eraser.
    if (e?.pointerType === 'pen' && drawingRef.current?.on) {
      const st = drawingRef.current.stroke;
      const moved = st?.points?.length > 1
        ? Math.hypot(st.points[st.points.length - 1][0] - st.points[0][0],
                     st.points[st.points.length - 1][1] - st.points[0][1])
        : 0;
      const now = Date.now();
      const near = Math.hypot(e.clientX - tapRef.current.x, e.clientY - tapRef.current.y);
      if (moved < 0.01) {
        if (now - tapRef.current.at < 400 && near < 36) {
          // Second tap: switch, and take back the two dots the taps left.
          tapRef.current = { at: 0, x: 0, y: 0 };
          drawingRef.current = { on: false, points: [] };
          setStrokesByPage((prev) => {
            const list = prev[currentPage] || [];
            // The FIRST tap was committed as a stroke; drop it too.
            const trimmed = list.length && (list[list.length - 1].points || []).length <= 2
              ? list.slice(0, -1) : list;
            const next = { ...prev, [currentPage]: trimmed };
            currentStrokesRef.current = trimmed;
            redrawOverlay(trimmed);
            const dropped = list.length !== trimmed.length ? list[list.length - 1] : null;
            scheduleSave(next, dropped?.id ? addTomb(dropped.id) : undefined);
            return next;
          });
          setTool((t) => (t === 'eraser' ? (lastPenToolRef.current || 'pen') : (lastPenToolRef.current = t, 'eraser')));
          if (!sawDoubleTap) {
            setSawDoubleTap(true);
            showToast('เคาะปลายปากกาสองทีเพื่อสลับยางลบ (Apple Pencil ไม่ส่งการเคาะที่ตัวปากกามาให้เว็บ)', 5000);
          }
          return;
        }
        tapRef.current = { at: now, x: e.clientX, y: e.clientY };
      } else {
        tapRef.current = { at: 0, x: 0, y: 0 };
      }
    }
    if (e && panRef.current && e.pointerId === panRef.current.id) {
      panRef.current = null;
      return;
    }
    if (e && gestureUp(e)) return;
    const ref = drawingRef.current;
    if (!ref?.on) return;
    if (e && e.pointerId !== undefined && e.pointerId !== ref.pointerId) return;
    drawingRef.current = { on: false, points: [] };
    if (!ref.stroke || ref.stroke.points.length < 1) return;
    // A tap never reaches onPointerMove, which is the only thing that paints a
    // stroke as it is made — so a single-point stroke went into the record and
    // never appeared until something else forced a redraw (a page flip, an
    // undo, a zoom). Pre-existing; the dot is drawn here instead.
    if (ref.stroke.points.length < 2) {
      const c = overlayCanvasRef.current;
      const ctx = c && inkCtx();
      if (ctx) drawStroke(ctx, ref.stroke, c.width, c.height,
        Math.min(window.devicePixelRatio || 1, 2) * zoom);
    }
    setStrokesByPage((prev) => {
      const pageList = [...(prev[currentPage] || []), ref.stroke];
      const next = { ...prev, [currentPage]: pageList };
      currentStrokesRef.current = pageList;
      // A finished highlighter stroke is repainted from scratch: drawn
      // incrementally its own overlaps multiply into a dark smear, drawn once
      // it is the flat wash a highlighter actually makes.
      if (ref.stroke.mode === 'highlighter') redrawOverlay(pageList);
      scheduleSave(next);
      return next;
    });
    // A new stroke is a new branch, so anything undone before it is now gone.
    setRedoStack([]);
  }

  // ── Autosave (debounced) ───────────────────────────────────
  function scheduleSave(strokesObj, deletedList) {
    if (!fileHash) return;
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(async () => {
      const res = await saveAnnotations(fileHash, {
        fileName,
        pageCount,
        strokesByPage: strokesObj,
        deleted: deletedList || latestRef.current.deleted,
      });
      // Local first, always. The upload is debounced separately and can fail
      // freely — the marks are already safe on this device by the time it runs.
      if (res?.ok) schedulePush(fileHash, peekAnnotations(fileHash));
      refreshRecent();
      // Autosave is silent on success by design, but it must not be silent
      // when the writing is not being kept — that is the one thing the
      // student needs to know while they are still drawing.
      if (!res?.ok) showToast('บันทึกอัตโนมัติไม่สำเร็จ รอยเขียนจะอยู่แค่จนกว่าจะปิดแท็บ');
    }, AUTOSAVE_MS);
  }

  async function saveNow() {
    if (!fileHash) return;
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    // "บันทึกแล้ว ✓" used to appear whatever happened — the storage layer
    // swallowed the failure and handed the caller nothing to check, so a
    // student whose device storage was full was told their pen marks were
    // safe when nothing had been written.
    const res = await saveAnnotations(fileHash, {
      fileName,
      pageCount,
      strokesByPage,
      deleted,
    });
    refreshRecent();
    if (res?.ok) schedulePush(fileHash, peekAnnotations(fileHash));
    if (!res?.ok) {
      showToast('บันทึกไม่สำเร็จ เบราว์เซอร์นี้เก็บข้อมูลถาวรไม่ได้');
    } else {
      showToast('บันทึกแล้ว ✓');
    }
  }

  function undoLast() {
    setStrokesByPage((prev) => {
      const pageList = prev[currentPage] || [];
      if (pageList.length === 0) return prev;
      const undone = pageList[pageList.length - 1];
      const trimmed = pageList.slice(0, -1);
      const next = { ...prev, [currentPage]: trimmed };
      currentStrokesRef.current = trimmed;
      redrawOverlay(trimmed);
      const tombs = undone?.id ? addTomb(undone.id) : latestRef.current.deleted;
      scheduleSave(next, tombs);
      setRedoStack((r) => [...r, { page: currentPage, stroke: undone }].slice(-40));
      return next;
    });
  }

  function redoLast() {
    setRedoStack((stack) => {
      const top = stack[stack.length - 1];
      // Undo history belongs to the page the stroke was made on. Replaying it
      // onto whichever page happens to be open would move a student's mark to
      // a page they never drew it on.
      if (!top || top.page !== currentPage) return stack;
      setStrokesByPage((prev) => {
        // A new id, not the old one. Tombstones only ever grow; un-deleting an
        // id would break the property that makes cross-device merging safe.
        const revived = { ...top.stroke, id: newStrokeId() };
        const pageList = [...(prev[currentPage] || []), revived];
        const next = { ...prev, [currentPage]: pageList };
        currentStrokesRef.current = pageList;
        redrawOverlay(pageList);
        scheduleSave(next);
        return next;
      });
      return stack.slice(0, -1);
    });
  }

  function clearPage() {
    setStrokesByPage((prev) => {
      const cleared = prev[currentPage] || [];
      if (cleared.length) {
        setRedoStack((r) => [...r, ...cleared.map((st) => ({ page: currentPage, stroke: st }))].slice(-40));
      }
      const next = { ...prev, [currentPage]: [] };
      currentStrokesRef.current = [];
      redrawOverlay([]);
      const tombs = addTomb(...cleared.map((st) => st.id).filter(Boolean));
      scheduleSave(next, tombs);
      return next;
    });
  }

  // Two-finger pinch. `touch-action: none` on the overlay is what makes
  // single-finger drawing possible, and it also swallows the browser's own
  // pinch — so on the one device this feature is really for, an iPad with a
  // Pencil, there would otherwise be no way to zoom except the toolbar.
  const gestureRef = useRef(null);
  const activePointers = useRef(new Map());

  function gestureDown(e) {
    activePointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (activePointers.current.size !== 2) return false;
    // A second finger means this was never a stroke. Throw away what the
    // first finger drew rather than leaving a stray mark behind every pinch.
    const d = drawingRef.current;
    if (d?.on) {
      drawingRef.current = { on: false, points: [] };
      redrawOverlay(currentStrokesRef.current);
    }
    const [a, b] = [...activePointers.current.values()];
    gestureRef.current = {
      startDist: Math.hypot(a.x - b.x, a.y - b.y),
      startZoom: zoom,
      // The midpoint between the fingers is the point the reader expects to
      // stay put — it is the thing they are pinching.
      cx: (a.x + b.x) / 2,
      cy: (a.y + b.y) / 2,
    };
    return true;
  }

  function gestureMove(e) {
    if (!activePointers.current.has(e.pointerId)) return false;
    activePointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const g = gestureRef.current;
    if (!g || activePointers.current.size < 2) return false;
    const [a, b] = [...activePointers.current.values()];
    const dist = Math.hypot(a.x - b.x, a.y - b.y);
    if (g.startDist > 0) {
      const want = g.startZoom * (dist / g.startDist);
      // Snap to the same fixed steps the buttons use, so a pinch and a tap
      // can never leave the page at two slightly different scales — and so
      // the rendered-page cache keeps hitting.
      const nearest = ZOOM_STEPS.reduce((best, v) =>
        (Math.abs(v - want) < Math.abs(best - want) ? v : best), ZOOM_STEPS[0]);
      setZoomAt(nearest, (a.x + b.x) / 2, (a.y + b.y) / 2);
    }
    return true;
  }

  function gestureUp(e) {
    activePointers.current.delete(e.pointerId);
    if (activePointers.current.size < 2) gestureRef.current = null;
    return activePointers.current.size > 0;
  }

  // Undo, redo and zoom from the keyboard. A laptop reader annotating with a
  // trackpad reaches for these before they reach for the toolbar.
  useEffect(() => {
    if (!pdfDoc) return undefined;
    const onKey = (e) => {
      const t = e.target;
      const typing = !!t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable);
      // Escape is handled BEFORE the typing guard. Opening search focuses its
      // box, so with the guard first the one key that closes things stopped
      // working exactly when the most chrome was open — found on production,
      // where the probe opened the panels in the order a person would.
      if (e.key === 'Escape' && (optionsOpen || menuOpen || searchOpen)) {
        e.preventDefault();
        if (optionsOpen || menuOpen) {
          setOptionsOpen(false);
          setMenuOpen(false);
        } else {
          // Nothing else is open, so Escape is about the search. Close the row
          // and put the reader back on the button that opened it; the results
          // are kept, because someone who just found page 41 did not ask to
          // lose it.
          setSearchOpen(false);
          document.querySelector('button[aria-label="ค้นหาในเอกสาร"]')?.focus();
        }
        return;
      }
      if (typing) return;
      const mod = e.metaKey || e.ctrlKey;
      if (mod && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (e.shiftKey) redoLast(); else undoLast();
      } else if (mod && (e.key === '=' || e.key === '+')) {
        e.preventDefault(); zoomIn();
      } else if (mod && e.key === '-') {
        e.preventDefault(); zoomOut();
      } else if (mod && e.key === '0') {
        e.preventDefault(); setZoom(1);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pdfDoc, currentPage, redoStack, strokesByPage, optionsOpen, menuOpen, searchOpen]);

  // Height of the page frame: everything left between the top of the frame and
  // the bottom of the window, less the page-nav bar and any bottom chrome.
  //
  // Measured against the frame's CURRENT top edge every time the chrome above
  // it can change. The first version measured once and observed the frame's
  // own parent, which never resizes — so opening the colour panel, the
  // overflow menu and search on a phone pushed the frame 56 px past the bottom
  // of the window and the page started scrolling again, which is the exact
  // thing this height exists to prevent (measured: top 204 -> 379, height
  // stuck at 341).
  useLayoutEffect(() => {
    if (!pdfDoc) return undefined;
    const measure = () => {
      const wrap = wrapperRef.current;
      if (!wrap) return;
      // Read the top from the element itself: it moves as rows open and close
      // above it, and nothing else reports that.
      const top = wrap.getBoundingClientRect().top;
      const navH = footRef.current?.getBoundingClientRect().height || 0;
      const bottom = parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue('--vmx-bottom-nav-h'),
      ) || 0;
      const h = Math.max(180, window.innerHeight - top - navH - bottom);
      setFrameH((prev) => (prev !== null && Math.abs(prev - h) < 1 ? prev : h));
    };
    measure();
    window.addEventListener('resize', measure);
    window.addEventListener('orientationchange', measure);
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(measure) : null;
    // Observe the reader's root, not the frame's parent: what changes height
    // is the stack of rows ABOVE the frame, and the parent is sized by them.
    if (ro && rootRef.current) ro.observe(rootRef.current);
    return () => {
      window.removeEventListener('resize', measure);
      window.removeEventListener('orientationchange', measure);
      ro?.disconnect();
    };
    // Every piece of chrome that can open above the frame is a dependency,
    // because each one moves the frame's top edge.
  }, [pdfDoc, sidebarOpen, optionsOpen, menuOpen, searchOpen, hits, hitIdx, sync.status]);

  // ── Search ─────────────────────────────────────────────────
  // pdf.js already carries the text layer, so this needs no new dependency and
  // no server round trip: pull each page's text content once, cache it for the
  // document, and match against it.
  //
  // Extraction is incremental and abortable — a 300-page textbook must not
  // freeze the reader while it is read, and typing a new query must not leave
  // the old one still working in the background.
  async function ensureText() {
    if (!pdfDoc) return [];
    if (textRef.current.hash === fileHash && textRef.current.pages) return textRef.current.pages;
    const pages = [];
    const token = ++searchAbortRef.current;
    for (let i = 1; i <= pdfDoc.numPages; i++) {
      if (token !== searchAbortRef.current) return pages;
      try {
        const page = await pdfDoc.getPage(i);
        const tc = await page.getTextContent();
        pages[i] = pageTextFromItems(tc.items);
      } catch {
        pages[i] = '';
      }
    }
    textRef.current = { hash: fileHash, pages };
    return pages;
  }

  async function runSearch(q) {
    const needle = q.trim();
    if (!needle) { setHits(null); return; }
    setSearching(true);
    try {
      const pages = await ensureText();
      // lib/thai-search.js, not indexOf: a Thai word broken across pdf.js text
      // runs, a zero-width space, a decomposed สระอำ or a Thai digit each make
      // a plain substring match come back empty on text that is right there on
      // the slide.
      const found = searchPages(pages, needle);
      setHits(found);
      setHitIdx(0);
      if (found.length) setCurrentPage(found[0].page);
    } finally {
      setSearching(false);
    }
  }

  // Results, with each one marked according to whether this reader wrote on
  // that page, and optionally narrowed to those.
  const shownHits = (() => {
    if (!hits) return null;
    const marked = hits.map((h) => ({ ...h, mine: (strokesByPage[h.page] || []).length > 0 }));
    return onlyMine ? marked.filter((h) => h.mine) : marked;
  })();

  function gotoHit(delta) {
    if (!shownHits?.length) return;
    const next = (hitIdx + delta + shownHits.length) % shownHits.length;
    setHitIdx(next);
    setCurrentPage(shownHits[next].page);
  }

  // A new document invalidates the extracted text, and abandons any extraction
  // still running for the previous one.
  useEffect(() => {
    searchAbortRef.current += 1;
    textRef.current = { hash: null, pages: null };
    setQuery('');
    setHits(null);
  }, [fileHash]);

  // Choosing a tool closes whatever was open. The colour panel is hidden while
  // the eraser is selected, so leaving `optionsOpen` true meant it sprang back
  // by itself the moment the reader picked the pen up again.
  function pickTool(next) {
    setTool(next);
    setOptionsOpen(false);
    setMenuOpen(false);
  }

  // ── Zoom ───────────────────────────────────────────────────
  // Fixed steps rather than a free slider: every step is a scale the page
  // cache can hold and reuse, and a student pressing + wants a predictable
  // jump, not a value they have to hunt for.
  // Zoom keeps the point under the anchor fixed. Without this, scaling happens
  // about the canvas origin and whatever the reader was looking at slides off
  // screen — which at 300% means hunting for the paragraph you were annotating.
  //
  // Captured BEFORE the state change as a fraction of the content, then
  // restored after the canvas has been resized (see the render effect).
  const zoomAnchorRef = useRef(null);

  // The frame is the scroller now, but a layout where it is not (a very short
  // window, an older cached build) must still zoom sensibly rather than
  // silently do nothing — so ask which element is really scrolling.
  function scroller() {
    const wrap = wrapperRef.current;
    if (wrap && wrap.scrollHeight > wrap.clientHeight + 1) return wrap;
    if (wrap && wrap.scrollWidth > wrap.clientWidth + 1) return wrap;
    return document.scrollingElement || document.documentElement;
  }

  function captureAnchor(clientX, clientY) {
    const wrap = scroller();
    if (!wrap) return;
    const r = wrap === document.scrollingElement || wrap === document.documentElement
      ? { left: 0, top: 0, width: window.innerWidth, height: window.innerHeight }
      : wrap.getBoundingClientRect();
    // Anchor in wrapper-viewport space; fall back to the middle of what is on
    // screen when the gesture has no natural point (the toolbar buttons).
    const ax = clientX == null ? r.width / 2 : clientX - r.left;
    const ay = clientY == null ? r.height / 2 : clientY - r.top;
    zoomAnchorRef.current = {
      ax,
      ay,
      // Fractions of the whole scrollable content, which survive the resize.
      fx: (wrap.scrollLeft + ax) / Math.max(1, wrap.scrollWidth),
      fy: (wrap.scrollTop + ay) / Math.max(1, wrap.scrollHeight),
    };
  }

  function applyAnchor() {
    const a = zoomAnchorRef.current;
    if (!a) return;
    zoomAnchorRef.current = null;
    const wrap = scroller();
    if (!wrap) return;
    wrap.scrollLeft = a.fx * wrap.scrollWidth - a.ax;
    wrap.scrollTop = a.fy * wrap.scrollHeight - a.ay;
  }

  function setZoomAt(next, clientX, clientY) {
    setZoom((z) => {
      const v = typeof next === 'function' ? next(z) : next;
      if (v === z) return z;
      captureAnchor(clientX, clientY);
      return v;
    });
  }

  function zoomIn(e) {
    setZoomAt((z) => ZOOM_STEPS.find((v) => v > z + 0.001) ?? z, e?.clientX, e?.clientY);
  }
  function zoomOut(e) {
    setZoomAt((z) => [...ZOOM_STEPS].reverse().find((v) => v < z - 0.001) ?? z, e?.clientX, e?.clientY);
  }
  const canRedo = redoStack.length > 0 && redoStack[redoStack.length - 1].page === currentPage;
  const activeColor = (tool === 'highlighter'
    ? HL_COLORS.find((c) => c.id === hlColor)
    : PEN_COLORS.find((c) => c.id === color)) || PEN_COLORS[0];

  // Ctrl / ⌘ + wheel over the page, which is what a trackpad pinch sends and
  // what every document reader does. Bound natively rather than through React
  // because it must be non-passive to preventDefault the browser's own zoom.
  useEffect(() => {
    const wrap = wrapperRef.current;
    if (!wrap || !pdfDoc) return undefined;
    const onWheel = (e) => {
      if (!e.ctrlKey && !e.metaKey) return;
      e.preventDefault();
      if (e.deltaY < 0) zoomIn(e); else zoomOut(e);
    };
    wrap.addEventListener('wheel', onWheel, { passive: false });
    return () => wrap.removeEventListener('wheel', onWheel);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pdfDoc, zoom]);

  // ── Drag & drop ────────────────────────────────────────────
  function onDragOver(e) {
    e.preventDefault();
    setDragging(true);
  }
  function onDragLeave() {
    setDragging(false);
  }
  function onDrop(e) {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer?.files?.[0];
    if (f) ingestFile(f);
  }

  function onFilePicked(e) {
    const f = e.target.files?.[0];
    if (f) ingestFile(f);
    e.target.value = ''; // allow re-pick of same file
  }

  function pickRecent(hash) {
    // We can't restore a PDF without re-uploaded bytes — prompt the user.
    const entry = recent.find((r) => r.hash === hash);
    if (!entry) return;
    setError(null);
    showToast(`เลือกไฟล์ "${entry.fileName}" อีกครั้งเพื่อเขียนต่อ`, 4000);
    fileInputRef.current?.click();
  }

  function removeRecent(hash, ev) {
    ev?.stopPropagation?.();
    deleteAnnotations(hash).then(refreshRecent).catch(() => {});
  }

  function backToEmpty() {
    // Flush, do not cancel. Cancelling here is what threw away a stroke made
    // in the half second before leaving.
    flushRef.current?.();
    // A library document has no local file behind it, so the drag-drop empty
    // state would be a dead end — send the reader back where they came from.
    if (onExit) { saveNow(); onExit(); return; }
    setPdfDoc(null);
    setFileHash(null);
    setFileName('');
    setPageCount(0);
    setStrokesByPage({});
    setCurrentPage(1);
    setError(null);
    refreshRecent();
  }

  // The autosave is debounced 500 ms. Closing the tab, switching apps, or a
  // phone locking within that window used to drop whatever had just been
  // written — the exact moment a person is most likely to walk away. Flush on
  // the way out. `visibilitychange` is the only one of these that fires
  // reliably on iOS, which is the platform this matters most on.
  useEffect(() => {
    if (!pdfDoc || !fileHash) return undefined;
    // Reads latestRef, never the render's own values, and depends only on the
    // document — so it subscribes once per document instead of once per
    // stroke, and what it writes is always the newest thing there is.
    const flush = () => {
      clearTimeout(saveTimerRef.current);
      saveTimerRef.current = null;
      const l = latestRef.current;
      if (!l.fileHash) return;
      // Writes whether or not a save was pending. A record written twice is
      // the same record; a record never written is an afternoon of notes.
      saveAnnotations(l.fileHash, {
        fileName: l.fileName,
        pageCount: l.pageCount,
        strokesByPage: l.strokesByPage,
        deleted: l.deleted,
        lastPage: l.currentPage,
      }).then(() => flushPushes()).catch(() => {});
    };
    flushRef.current = flush;
    const onHide = () => { if (document.visibilityState === 'hidden') flush(); };
    document.addEventListener('visibilitychange', onHide);
    window.addEventListener('pagehide', flush);
    return () => {
      document.removeEventListener('visibilitychange', onHide);
      window.removeEventListener('pagehide', flush);
      // Leaving the reader is also a way out — going back to the shelf must
      // not discard a stroke made in the last half second.
      flush();
      flushRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pdfDoc, fileHash]);

  // Cleanup on unmount
  useEffect(() => () => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    if (prerenderRef.current) clearTimeout(prerenderRef.current);
    if (renderTaskRef.current) { try { renderTaskRef.current.cancel(); } catch {} }
    for (const bmp of pageCacheRef.current.values()) bmp?.close?.();
    pageCacheRef.current.clear();
  }, []);

  // Free the previous document's bitmaps. Correctness does not rest on this
  // — the cache key carries the file hash, so a stale entry can never be
  // shown against the wrong document even if this effect runs out of order
  // with the render effect. This is purely about not holding ~45 MB of a deck
  // nobody is reading any more.
  useEffect(() => {
    for (const bmp of pageCacheRef.current.values()) bmp?.close?.();
    pageCacheRef.current.clear();
  }, [pdfDoc]);

  const annotatedPages = new Set(
    Object.entries(strokesByPage)
      .filter(([, arr]) => Array.isArray(arr) && arr.length > 0)
      .map(([k]) => Number(k))
  );

  // ── Empty state ────────────────────────────────────────────
  if (!pdfDoc) {
    return (
      <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}>
        <BackBar onBack={goHome} label="กลับหน้าแรก" subtitle="เขียนทับ PDF" />
        <div style={{ padding: '8px 16px 24px', maxWidth: 720, margin: '0 auto', width: '100%' }}>
          <div style={{ fontSize: 11, fontFamily: 'var(--vmx-mono)', color: 'var(--clr-ink-soft)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            สไลด์บรรยาย และตำรา
          </div>
          <h1 style={{ margin: '6px 0 4px', fontSize: 22 }}>เปิด PDF แล้วเขียนทับได้เลย</h1>
          <p style={{ color: 'var(--clr-ink-soft)', fontSize: 13, margin: '0 0 16px' }}>
            ลากไฟล์มาวางหรือกดเลือกไฟล์ รอยเขียนบันทึกให้เองในเครื่อง
            และถ้าเข้าสู่ระบบไว้จะตามไปทุกเครื่องด้วย ส่วนตัวไฟล์ PDF ไม่ได้ถูกเก็บไว้
            จึงต้องเลือกไฟล์เดิมอีกครั้งเมื่อจะเขียนต่อ
          </p>

          <label
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              padding: '32px 16px',
              borderRadius: 12,
              border: `2px dashed ${dragging ? 'var(--clr-accent, #4a6b4a)' : 'var(--clr-border, #d8d3c4)'}`,
              background: dragging ? 'var(--clr-accent-soft, #e8efe4)' : 'var(--clr-surface, #f7f7f4)',
              cursor: 'pointer',
              transition: 'background 120ms, border-color 120ms',
            }}
          >
            <span aria-hidden="true" style={{ color: 'var(--clr-ink-soft)' }}>
              <NavIcon name="files" size={30} />
            </span>
            <strong style={{ fontSize: 15 }}>ลาก PDF มาวางที่นี่</strong>
            <span style={{ fontSize: 12, color: 'var(--clr-ink-soft)' }}>หรือกดเพื่อเลือกไฟล์, สูงสุด {SIZE_HARD_MB} MB</span>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf,.pdf"
              onChange={onFilePicked}
              style={{ display: 'none' }}
            />
          </label>

          {error && (
            <div className="vmx-error" style={{ marginTop: 12, padding: 10, borderRadius: 8, background: '#fdecea', color: '#8a1f15', fontSize: 13 }}>
              {error}
              {(initialDoc?.resolve || initialDoc?.url) && (
                <div style={{ marginTop: 8 }}>
                  <button
                    type="button"
                    className="vmx-btn vmx-btn-sm"
                    onClick={() => ingestRemote(initialDoc)}
                  >
                    ลองเปิดอีกครั้ง
                  </button>
                </div>
              )}
            </div>
          )}

          {loading && (
            <div style={{ marginTop: 16, textAlign: 'center', color: 'var(--clr-ink-soft)', fontSize: 13 }}>
              <div style={{ marginBottom: 6 }}>⏳ {loadingMsg || 'กำลังประมวลผล…'}</div>
            </div>
          )}

          {recent.length > 0 && (
            <div style={{ marginTop: 24 }}>
              <div style={{ fontSize: 11, fontFamily: 'var(--vmx-mono)', color: 'var(--clr-ink-soft)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
                ไฟล์ล่าสุด และรอยเขียนที่บันทึกไว้
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
                {recent.map((r) => (
                  <li key={r.hash}>
                    <div
                      onClick={() => pickRecent(r.hash)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pickRecent(r.hash); } }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        padding: '10px 12px',
                        minHeight: 44,
                        borderRadius: 8,
                        border: '1px solid var(--clr-border, #e1ddd2)',
                        background: 'var(--clr-bg, #fff)',
                        cursor: 'pointer',
                      }}
                    >
                      <span aria-hidden="true" style={{ color: 'var(--clr-ink-soft)', display: 'flex' }}>
                        <NavIcon name="files" size={18} />
                      </span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 14, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.fileName}</div>
                        <div style={{ fontSize: 11, color: 'var(--clr-ink-soft)' }}>
                          {r.pageCount} หน้า, เขียนไว้ {r.annotatedPageCount} หน้า, {fmtDate(r.lastOpened)}
                        </div>
                      </div>
                      <button
                        type="button"
                        className="vmx-btn vmx-btn-ghost vmx-btn-sm"
                        onClick={(e) => removeRecent(r.hash, e)}
                        title="ลบรอยเขียนของไฟล์นี้"
                        aria-label={`ลบรอยเขียนของ ${r.fileName}`}
                      ><NavIcon name="trash" size={16} /></button>
                    </div>
                  </li>
                ))}
              </ul>
              <p style={{ fontSize: 11, color: 'var(--clr-ink-soft)', marginTop: 8 }}>
                เบราว์เซอร์เก็บตัวไฟล์ PDF ไว้ให้ไม่ได้ เลือกไฟล์เดิมอีกครั้งแล้วรอยเขียนจะกลับมาเอง
              </p>
            </div>
          )}
        </div>
        {toast && <Toast text={toast} />}
      </div>
    );
  }

  // ── Viewing state ──────────────────────────────────────────
  return (
    <div ref={rootRef} style={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      <BackBar onBack={backToEmpty} label="เปลี่ยน PDF" subtitle={fileName} />
      {/* Toolbar — one row.
          It used to be a wall of labelled chips: 207 px tall on a phone, which
          with the search row put 264 px of chrome above an 812 px screen
          before any of the document showed. Tools are icons with accessible
          names, the two settings that belong to a tool live in a popover
          behind its own swatch, and the actions nobody reaches for mid-stroke
          moved into an overflow menu. */}
      <div className="vmx-pdf-toolbar" style={{
        display: 'flex',
        gap: 4,
        padding: '6px 10px',
        borderBottom: '1px solid var(--clr-border, #e1ddd2)',
        background: 'var(--clr-surface, #f7f7f4)',
        alignItems: 'center',
        flexWrap: 'nowrap',
        overflowX: 'auto',
      }}>
        <ToolButton icon="pen" label="ปากกา" active={tool === 'pen'} onClick={() => pickTool('pen')} />
        <ToolButton icon="highlighter" label="ปากกาไฮไลต์" active={tool === 'highlighter'} onClick={() => pickTool('highlighter')} />
        <ToolButton icon="eraser" label="ยางลบ" active={tool === 'eraser'} onClick={() => pickTool('eraser')} />

        {/* The swatch is both the current colour and the way to change it. */}
        {tool !== 'eraser' && (
          <button
            type="button"
            className="vmx-pdf-swatch"
            aria-label={`สีและขนาด, ตอนนี้คือ ${activeColor.name} ขนาด ${size}`}
            aria-expanded={optionsOpen}
            aria-haspopup="dialog"
            onClick={() => setOptionsOpen((v) => !v)}
            style={{
              width: 40, height: 40, minWidth: 40, padding: 9,
              borderRadius: tool === 'highlighter' ? 9 : '50%',
              border: '1px solid var(--clr-border, #d8d3c4)',
              background: activeColor.rgb, backgroundClip: 'content-box',
              cursor: 'pointer',
            }}
          />
        )}

        <span aria-hidden="true" style={{ width: 1, height: 22, background: 'var(--clr-border)', margin: '0 2px', flexShrink: 0 }} />

        <ToolButton icon="undo" label="ย้อนกลับ" onClick={undoLast} disabled={(strokesByPage[currentPage] || []).length === 0} />
        <ToolButton icon="redo" label="ทำซ้ำ" onClick={redoLast} disabled={!canRedo} />

        <span aria-hidden="true" style={{ width: 1, height: 22, background: 'var(--clr-border)', margin: '0 2px', flexShrink: 0 }} />

        <ToolButton icon="zoom-out" label="ย่อ" onClick={() => zoomOut()} disabled={zoom <= ZOOM_STEPS[0]} />
        <button
          type="button"
          className="vmx-btn vmx-btn-ghost vmx-btn-sm"
          onClick={() => setZoomAt(1)}
          title="กลับไปพอดีความกว้าง"
          style={{ minWidth: 52, fontFamily: 'var(--vmx-mono)', flexShrink: 0 }}
        >{Math.round(zoom * 100)}%</button>
        <ToolButton icon="zoom-in" label="ขยาย" onClick={() => zoomIn()} disabled={zoom >= ZOOM_STEPS[ZOOM_STEPS.length - 1]} />

        {sawPen && (
          <ToolButton
            icon="hand"
            label="รับเฉพาะปากกา วางมือบนจอได้ นิ้วใช้เลื่อนหน้า"
            active={penOnly}
            onClick={() => setPenOnly((v) => !v)}
          />
        )}

        <ToolButton icon="search" label="ค้นหาในเอกสาร" active={searchOpen}
          onClick={() => { setSearchOpen((v) => !v); setTimeout(() => document.getElementById('vmx-pdf-search')?.focus(), 30); }} />

        <span style={{ flex: 1, minWidth: 4 }} />
        <SyncBadge state={sync} />
        <ToolButton icon="more" label="เครื่องมืออื่น" active={menuOpen}
          onClick={() => setMenuOpen((v) => !v)} expanded={menuOpen} />
      </div>

      {/* Colour and size for the tool in hand. */}
      {optionsOpen && tool !== 'eraser' && (
        <div
          role="dialog"
          aria-label="สีและขนาดของเครื่องมือ"
          style={{
            display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap',
            padding: '8px 12px', borderBottom: '1px solid var(--clr-border, #e1ddd2)',
            background: 'var(--clr-bg, #fff)',
          }}
        >
          {(tool === 'highlighter' ? HL_COLORS : PEN_COLORS).map((c) => {
            const on = tool === 'highlighter' ? hlColor === c.id : color === c.id;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => (tool === 'highlighter' ? setHlColor(c.id) : setColor(c.id))}
                title={c.name}
                aria-label={`สี ${c.name}`}
                aria-pressed={on}
                style={{
                  width: 40, height: 40, minWidth: 40, padding: 8,
                  borderRadius: tool === 'highlighter' ? 8 : '50%',
                  border: on ? '2px solid var(--clr-ink, #222)' : '1px solid transparent',
                  background: c.rgb, backgroundClip: 'content-box',
                  cursor: 'pointer',
                }}
              />
            );
          })}
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, flex: 1, minWidth: 160 }}>
            ขนาด
            <input
              type="range" min="1" max="10" value={size}
              onChange={(e) => setSize(parseInt(e.target.value, 10))}
              style={{ flex: 1, minWidth: 80 }}
            />
            <span style={{ fontFamily: 'var(--vmx-mono)', minWidth: 18, textAlign: 'right' }}>{size}</span>
          </label>
        </div>
      )}

      {/* The rest — deliberate actions, not things reached for mid-stroke. */}
      {menuOpen && (
        <div
          role="menu"
          aria-label="เครื่องมืออื่น"
          style={{
            display: 'flex', gap: 8, flexWrap: 'wrap',
            padding: '8px 12px', borderBottom: '1px solid var(--clr-border, #e1ddd2)',
            background: 'var(--clr-bg, #fff)',
          }}
        >
          <button type="button" role="menuitem" className="vmx-btn vmx-btn-ghost vmx-btn-sm"
            onClick={() => { setSidebarOpen((o) => !o); setMenuOpen(false); }} aria-pressed={sidebarOpen}>
            {sidebarOpen ? 'ซ่อน' : 'แสดง'}หน้าทั้งหมด ({pageCount})
          </button>
          <button type="button" role="menuitem" className="vmx-btn vmx-btn-ghost vmx-btn-sm"
            onClick={() => { saveNow(); setMenuOpen(false); }}>บันทึกเดี๋ยวนี้</button>
          <button type="button" role="menuitem" className="vmx-btn vmx-btn-ghost vmx-btn-sm"
            onClick={() => { clearPage(); setMenuOpen(false); }}
            disabled={(strokesByPage[currentPage] || []).length === 0}>ล้างรอยเขียนหน้านี้</button>
        </div>
      )}

      {/* Search, opened from the toolbar rather than always present: on a
          phone every permanent row costs a twelfth of the screen. */}
      {searchOpen && (
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px',
        borderBottom: '1px solid var(--clr-border, #e1ddd2)',
        background: 'var(--clr-bg, #fff)', flexWrap: 'wrap',
      }}>
        <form
          onSubmit={(e) => { e.preventDefault(); runSearch(query); }}
          style={{ display: 'flex', alignItems: 'center', gap: 6, flex: 1, minWidth: 200 }}
        >
          <label htmlFor="vmx-pdf-search" className="vmx-sr-only">ค้นหาในเอกสาร</label>
          <input
            id="vmx-pdf-search"
            type="search"
            value={query}
            onChange={(e) => { setQuery(e.target.value); if (!e.target.value.trim()) setHits(null); }}
            placeholder={`ค้นหาในเอกสาร ${pageCount} หน้า`}
            style={{
              flex: 1, minWidth: 0, minHeight: 36, padding: '6px 10px',
              border: '1px solid var(--clr-border, #d8d3c4)', borderRadius: 8,
              background: 'var(--clr-surface, #fff)', color: 'var(--clr-ink)', fontSize: 13,
            }}
          />
          <button type="submit" className="vmx-btn vmx-btn-sm" disabled={searching || !query.trim()}>
            {searching ? 'กำลังค้น…' : 'ค้นหา'}
          </button>
          <button
            type="button"
            className={`vmx-chip ${onlyMine ? 'active' : ''}`}
            aria-pressed={onlyMine}
            onClick={() => { setOnlyMine((v) => !v); setHitIdx(0); }}
            title="แสดงเฉพาะหน้าที่คุณเขียนไว้ ตำแหน่งรอยเขียนเก็บไว้แน่นอน ไม่ได้เดาจากลายมือ"
          >✍ หน้าที่ผมเขียน</button>
        </form>
        {shownHits && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--clr-ink-soft)' }}>
            {shownHits.length === 0 ? (
              <span>{onlyMine ? 'ไม่พบคำนี้ในหน้าที่คุณเขียนไว้' : 'ไม่พบคำนี้ในเอกสาร'}</span>
            ) : (
              <>
                <button type="button" className="vmx-btn vmx-btn-ghost vmx-btn-sm" onClick={() => gotoHit(-1)} aria-label="ผลก่อนหน้า">↑</button>
                <span style={{ fontFamily: 'var(--vmx-mono)', whiteSpace: 'nowrap' }}>
                  {hitIdx + 1}/{shownHits.length} หน้า {shownHits[hitIdx]?.page}
                  {shownHits[hitIdx]?.mine ? ' ✍' : ''}
                </span>
                {shownHits.some((h) => h.loose) && (
                  <span title="ไม่พบคำที่ตรงทุกตัว จึงค้นแบบไม่สนวรรณยุกต์และสระบน-ล่างให้">
                    เทียบแบบไม่สนวรรณยุกต์
                  </span>
                )}
                <button type="button" className="vmx-btn vmx-btn-ghost vmx-btn-sm" onClick={() => gotoHit(1)} aria-label="ผลถัดไป">↓</button>
              </>
            )}
          </div>
        )}
      </div>
      )}
      {searchOpen && shownHits?.length > 0 && shownHits[hitIdx]?.quote && (
        <div style={{
          padding: '4px 12px 8px', fontSize: 12, color: 'var(--clr-ink-soft)',
          borderBottom: '1px solid var(--clr-border, #e1ddd2)',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>{shownHits[hitIdx].quote}</div>
      )}

      {/* Body — sidebar + page canvas */}
      <div className="vmx-pdf-body" style={{ flex: 1, display: 'flex', minHeight: 0 }}>
        {sidebarOpen && (
          <div className="vmx-pdf-sidebar-wrap" style={{ width: 140, flexShrink: 0, maxHeight: 'calc(100dvh - 120px)' }}>
            <PdfThumbnailSidebar
              pdfDoc={pdfDoc}
              currentPage={currentPage}
              onPageSelect={setCurrentPage}
              annotatedPages={annotatedPages}
            />
          </div>
        )}
        <div
          ref={wrapperRef}
          style={{
            flex: 1,
            minHeight: 0,
            height: frameH ? `${frameH}px` : undefined,
            overflow: 'auto',
            background: '#2a2a2a',
            display: 'flex',
            alignItems: 'flex-start',
            padding: 12,
            minWidth: 0,
            // Not `justify-content: center`: a centred flex item that grows
            // past its container is clipped at the START edge and cannot be
            // scrolled back to. `margin: auto` centres the same way while
            // leaving both edges reachable once the page is zoomed in.
            overscrollBehavior: 'contain',
          }}
        >
          <div style={{
            position: 'relative', display: 'inline-block', lineHeight: 0, margin: 'auto',
            // iOS pops a callout (Copy / Look Up / Share) on a long press, and
            // a slow deliberate pen stroke reads as exactly that. These are
            // the two properties that stop it; both are inert elsewhere.
            WebkitTouchCallout: 'none',
            WebkitUserSelect: 'none',
            userSelect: 'none',
          }}>
            <canvas ref={baseCanvasRef} style={{ display: 'block', background: '#fff', boxShadow: '0 4px 24px rgba(0,0,0,0.4)' }} />
            <canvas
              ref={overlayCanvasRef}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
              onPointerLeave={(e) => { setHover(null); onPointerUp(e); }}
              onPointerOut={(e) => { if (e.pointerType === 'pen') setHover(null); }}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                touchAction: 'none',
                cursor: tool === 'eraser' ? 'crosshair' : 'crosshair',
              }}
            />
          </div>
        </div>
      </div>

      {/* Bottom page nav */}
      <div ref={footRef} style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        padding: '8px 12px',
        borderTop: '1px solid var(--clr-border, #e1ddd2)',
        background: 'var(--clr-surface, #f7f7f4)',
      }}>
        <button
          type="button"
          className="vmx-btn vmx-btn-ghost vmx-btn-sm"
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={currentPage <= 1}
        >← ก่อน</button>
        <span style={{ fontSize: 13, fontFamily: 'var(--vmx-mono)' }}>
          หน้า <strong>{currentPage}</strong> / {pageCount}
        </span>
        <button
          type="button"
          className="vmx-btn vmx-btn-ghost vmx-btn-sm"
          onClick={() => setCurrentPage((p) => Math.min(pageCount, p + 1))}
          disabled={currentPage >= pageCount}
        >ถัดไป →</button>
      </div>

      {/* Hovering-stylus ring. Purely a readout of where the nib is and how
          wide the current brush is — pointer-events off so it can never sit
          between the pen and the canvas. */}
      {hoverPt && !loading && (
        <div
          aria-hidden="true"
          style={{
            position: 'fixed',
            left: hoverPt.x,
            top: hoverPt.y,
            width: Math.max(8, size * (tool === 'highlighter' ? 4.5 : tool === 'eraser' ? 4 : 1) * zoom),
            height: Math.max(8, size * (tool === 'highlighter' ? 4.5 : tool === 'eraser' ? 4 : 1) * zoom),
            transform: 'translate(-50%, -50%)',
            borderRadius: tool === 'highlighter' ? 3 : '50%',
            border: `1.5px solid ${tool === 'eraser' ? '#ffffff' : (tool === 'highlighter'
              ? (HL_COLORS.find((c) => c.id === hlColor)?.rgb || '#f7d94c')
              : (PEN_COLORS.find((c) => c.id === color)?.rgb || '#c0392b'))}`,
            boxShadow: '0 0 0 1px rgba(0,0,0,0.35)',
            pointerEvents: 'none',
            zIndex: 900,
          }}
        />
      )}

      {loading && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', zIndex: 1000,
        }}>
          <div style={{ background: '#fff', color: 'var(--clr-ink)', padding: 16, borderRadius: 8 }}>
            ⏳ {loadingMsg || 'กำลังโหลด…'}
          </div>
        </div>
      )}
      {toast && <Toast text={toast} />}

      {/* Mobile: collapse the sidebar into a bottom sheet trigger */}
      <style>{`
        @media (max-width: 700px) {
          .vmx-pdf-sidebar-wrap { width: 100px !important; }
        }
        @media (max-width: 500px) {
          .vmx-pdf-sidebar-wrap { display: none !important; }
        }
      `}</style>
    </div>
  );
}

// An icon-only toolbar button. The name lives on aria-label and title rather
// than in visible text, which is what lets the whole toolbar be one row —
// grouped and separated the way an editor toolbar reads.
function ToolButton({ icon, label, active = false, disabled = false, onClick, expanded }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={label}
      aria-label={label}
      aria-pressed={expanded === undefined ? active : undefined}
      aria-expanded={expanded}
      className={`vmx-pdf-tool${active ? ' is-active' : ''}`}
    >
      <NavIcon name={icon} size={20} />
    </button>
  );
}

// Says what is true and nothing more. Signed out is not a failure and is not
// shown as one — the reader has always worked this way and still does.
function SyncBadge({ state }) {
  if (!state || state.status === 'off') return null;
  const label = state.status === 'syncing' ? 'กำลังซิงก์…'
    : state.status === 'idle' ? 'ซิงก์แล้ว'
      : state.status === 'too-big' ? 'ไฟล์นี้ใหญ่เกินซิงก์ เก็บในเครื่องนี้'
        : 'ซิงก์ไม่สำเร็จ เก็บในเครื่องนี้ไว้แล้ว';
  const tone = state.status === 'idle' ? 'var(--clr-ink-soft, #6b6b6b)'
    : state.status === 'syncing' ? 'var(--clr-ink-soft, #6b6b6b)'
      : '#8a1f15';
  return (
    <span
      role="status"
      aria-live="polite"
      title={state.reason || undefined}
      style={{ fontSize: 11, color: tone, fontFamily: 'var(--vmx-mono)', whiteSpace: 'nowrap' }}
    >{label}</span>
  );
}

function Toast({ text }) {
  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: 'fixed',
        bottom: 'calc(var(--vmx-bottom-nav-h, 0px) + max(24px, env(safe-area-inset-bottom)))',
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'rgba(33,33,33,0.95)',
        color: '#fff',
        padding: '10px 16px',
        borderRadius: 999,
        fontSize: 13,
        boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
        zIndex: 1100,
        maxWidth: '90vw',
        textAlign: 'center',
      }}
    >{text}</div>
  );
}

// Streams a response body, reporting progress in real megabytes.
//
// Falls back to arrayBuffer() whenever the stream is unavailable — no
// getReader (older Safari), or an unknown length. Progress is a nicety; the
// bytes are not, so nothing here may become a reason a document fails to open.
async function readWithProgress(res, onProgress) {
  const total = Number(res.headers.get('content-length')) || 0;
  if (!res.body?.getReader) return res.arrayBuffer();
  try {
    const reader = res.body.getReader();
    const chunks = [];
    let got = 0;
    let lastPaint = 0;
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
      got += value.length;
      // Repainting on every chunk would fight the download for the main
      // thread; four times a second reads as continuous to a person.
      const now = Date.now();
      if (now - lastPaint > 250) {
        lastPaint = now;
        onProgress(total
          ? `กำลังโหลด ${mb(got)} / ${mb(total)} MB (${Math.round((got / total) * 100)}%)`
          : `กำลังโหลด ${mb(got)} MB`);
      }
    }
    // Concatenate once at the end rather than growing a buffer per chunk.
    const out = new Uint8Array(got);
    let at = 0;
    for (const c of chunks) { out.set(c, at); at += c.length; }
    return out.buffer;
  } catch {
    // A stream that breaks mid-read cannot be replayed from this response.
    // Say so plainly instead of handing pdf.js a truncated file, which would
    // surface as "ไฟล์เสีย" and send the reader looking for the wrong problem.
    throw new Error('ดาวน์โหลดไฟล์ไม่ครบ ลองเปิดอีกครั้ง');
  }
}

const mb = (n) => (n / 1048576).toFixed(1);

function fmtDate(ts) {
  if (!ts) return '';
  try {
    const d = new Date(ts);
    const now = Date.now();
    const diffMin = Math.floor((now - ts) / 60000);
    if (diffMin < 1) return 'เมื่อกี้';
    if (diffMin < 60) return `${diffMin} นาทีที่แล้ว`;
    if (diffMin < 24 * 60) return `${Math.floor(diffMin / 60)} ชม.ที่แล้ว`;
    return d.toLocaleDateString('th-TH', { day: 'numeric', month: 'short' });
  } catch {
    return '';
  }
}
