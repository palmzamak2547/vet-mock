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

import { useState, useEffect, useLayoutEffect, useRef, useCallback, useMemo } from 'react';
import BackBar from '../components/BackBar.jsx';
import { thaiError } from '../lib/errors.js';
import PdfThumbnailSidebar from '../components/PdfThumbnailSidebar.jsx';
import NavIcon from '../components/NavIcon.jsx';
import PdfPage from '../components/PdfPage.jsx';
import { drawStroke, applyBrush, resetBrush, widthAt, strokeAsOnePath, redrawInk, tiltOf, inkDpr } from '../lib/ink.js';
import {
  hashFile,
  loadAnnotations,
  saveAnnotations,
  listRecentPdfs,
  deleteAnnotations,
  storageHealth,
  newStrokeId,
  peekAnnotations,
  mergeRecords,
} from '../lib/pdf-annotations.js';
import { pullAndMerge, schedulePush, flushPushes, onSyncState, syncState, subscribeLive } from '../lib/annotation-sync.js';
import { searchPages, pageTextFromItems } from '../lib/thai-search.js';
import { fitShape, strokeHit } from '../lib/shape-fit.js';
import { exportAnnotatedPdf, exportFileName, downloadBlob } from '../lib/pdf-export.js';

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
  // A colour the palette does not carry, chosen with the system picker. Kept
  // per instrument and remembered across sessions — a student who mixes
  // "their" purple wants it back tomorrow.
  const [customPen, setCustomPen] = useState(() => {
    try { return localStorage.getItem('vmx-pdf-custom-pen') || null; } catch { return null; }
  });
  const [customHl, setCustomHl] = useState(() => {
    try { return localStorage.getItem('vmx-pdf-custom-hl') || null; } catch { return null; }
  });
  // 'pixel' rubs ink out where the eraser passes; 'stroke' removes the whole
  // stroke it touches. Pixel stays the default because it is what the eraser
  // has always done here.
  const [eraserMode, setEraserMode] = useState('pixel');
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
  // The hovering-stylus ring is driven straight through the DOM. It updates
  // on every pointermove of a hovering Pencil — as state, each of those was a
  // re-render of the whole view and its 51 pages.
  const hoverRingRef = useRef(null);
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
  const wrapperRef = useRef(null);
  const drawingRef = useRef({ on: false, points: [] });
  const renderTaskRef = useRef(null);
  useEffect(() => {
    try {
      if (customPen) localStorage.setItem('vmx-pdf-custom-pen', customPen);
      if (customHl) localStorage.setItem('vmx-pdf-custom-hl', customHl);
    } catch { /* remembering a colour is a nicety, never a requirement */ }
  }, [customPen, customHl]);

  const saveTimerRef = useRef(null);
  // Draw-and-hold shape snap: armed on the last movement of a stroke, fires
  // if the pen then stays put.
  const holdTimerRef = useRef(null);
  // A live-sync ping that arrived while the pen was down; honoured on lift.
  const pendingPullRef = useRef(false);
  const currentStrokesRef = useRef([]); // live mirror for autosave
  // Rendered-page cache. Re-rasterising a page the reader just looked at is
  // pure waste — flipping back and forth through a deck was paying the full
  // render every time. Capped at 3 because one 2x-DPR A4 bitmap is ~15 MB of
  // GPU memory and a phone will not forgive a dozen of them.
  const pageCacheRef = useRef(new Map()); // `${hash}:${page}@${scale}x${dpr}` -> ImageBitmap
  const prerenderRef = useRef(null);
  const panRef = useRef(null);
  // The page a stroke is being drawn ON, which is NOT necessarily the page
  // the toolbar calls current: `currentPage` follows the reader's eye down
  // the column, and a slow stroke near a page boundary would otherwise be
  // filed under whichever page happened to scroll into view while the pen was
  // still down.
  const drawPageRef = useRef(1);
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
  // How to read the original bytes again at export time. Deliberately a way
  // BACK to the file rather than a copy of it: pdf.js takes ownership of the
  // ArrayBuffer it is handed, and keeping a second copy of a 14 MB deck alive
  // for the whole session is exactly the kind of memory an iPad kills a tab
  // over. The browser already holds a local File on disk, and a library
  // document re-reads from cache.
  const sourceRef = useRef(null);
  const [exporting, setExporting] = useState(null); // null | {done,total}
  // Page text, extracted once per document and reused for every later search.
  const textRef = useRef({ hash: null, pages: null });
  const searchAbortRef = useRef(0);

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

  // While a document is open the app shell's decorative bottom padding (48px
  // on .vmx-app) would spill the page past the viewport and grow a second
  // scrollbar under the reader's own. A body class lets styles.css drop that
  // padding for exactly this state — deterministic, no measuring loop.
  useEffect(() => {
    if (!pdfDoc) return undefined;
    document.body.classList.add('vmx-reading');
    return () => document.body.classList.remove('vmx-reading');
  }, [pdfDoc]);

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
      sourceRef.current = { kind: 'file', file };
      const doc = await pdfjs.getDocument({ data: buf }).promise;
      const local = await loadAnnotations(hash);
      const existing = await pullAndMerge(hash, local);
      const restoredStrokes = existing?.strokesByPage || {};
      setDeleted(existing?.deleted || []);
      const startPage = Math.min(Math.max(1, Number(existing?.lastPage) || 1), doc.numPages);
      resumeTo.current = startPage > 1 ? startPage : 0;
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
        sourceRef.current = { kind: 'url', url };
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
        sourceRef.current = { kind: 'url', url };
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
      resumeTo.current = startPage > 1 ? startPage : 0;
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

  // ── The scale every page is drawn at ───────────────────────
  // One number for the whole column: fit-to-width of the frame, times the
  // reader's zoom. Measured from the frame rather than the window because the
  // thumbnail rail takes a slice of it.
  const [fitScale, setFitScale] = useState(1);
  useLayoutEffect(() => {
    if (!pdfDoc) return undefined;
    let cancelled = false;
    const measure = async () => {
      const wrap = wrapperRef.current;
      if (!wrap) return;
      try {
        const page = await pdfDoc.getPage(1);
        if (cancelled) return;
        const natural = page.getViewport({ scale: 1 });
        const avail = Math.max(160, wrap.clientWidth - 24);
        const fit = Math.min(2, Math.max(0.4, avail / natural.width));
        setFitScale((prev) => (Math.abs(prev - fit) < 0.001 ? prev : fit));
      } catch { /* the column falls back to its default scale */ }
    };
    measure();
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(measure) : null;
    if (ro && wrapperRef.current) ro.observe(wrapperRef.current);
    window.addEventListener('resize', measure);
    return () => { cancelled = true; ro?.disconnect(); window.removeEventListener('resize', measure); };
  }, [pdfDoc, sidebarOpen]);

  const pageScale = fitScale * zoom;

  // ── Which page is being read ───────────────────────────────
  // Derived from the scroll position rather than set by a button: in a
  // scrolling column the current page is whichever one the reader is looking
  // at, and everything keyed off it (undo, clear, the position that is
  // remembered, the thumbnail highlight) should follow the eye.
  const suppressScrollSync = useRef(0);
  useEffect(() => {
    const wrap = wrapperRef.current;
    if (!wrap || !pdfDoc) return undefined;
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        if (Date.now() < suppressScrollSync.current) return;
        const mid = wrap.scrollTop + wrap.clientHeight * 0.35;
        let best = 1;
        for (const el of wrap.querySelectorAll('[data-page]')) {
          if (el.offsetTop <= mid) best = Number(el.dataset.page);
          else break;
        }
        setCurrentPage((prev) => (prev === best ? prev : best));
      });
    };
    wrap.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => { wrap.removeEventListener('scroll', onScroll); if (raf) cancelAnimationFrame(raf); };
  }, [pdfDoc, pageCount]);

  // Scrolls a page into view. `suppressScrollSync` stops the scroll listener
  // from fighting the jump it is causing — without it, a smooth scroll to page
  // 40 sets currentPage to every page it passes on the way.
  const goToPage = useCallback((n, behavior = 'smooth') => {
    const wrap = wrapperRef.current;
    if (!wrap) return;
    const target = wrap.querySelector(`[data-page="${n}"]`);
    if (!target) return;
    suppressScrollSync.current = Date.now() + (behavior === 'smooth' ? 700 : 120);
    setCurrentPage(n);
    wrap.scrollTo({ top: Math.max(0, target.offsetTop - 8), behavior });
  }, []);

  // Opening a document lands on the page that was last read. Waits for that
  // page to exist in the column, because the row cannot be scrolled to before
  // it is mounted.
  const resumeTo = useRef(0);
  useEffect(() => {
    if (!pdfDoc || !resumeTo.current) return undefined;
    const want = resumeTo.current;
    let tries = 0;
    const t = setInterval(() => {
      tries += 1;
      const wrap = wrapperRef.current;
      if (wrap?.querySelector(`[data-page="${want}"]`)) {
        goToPage(want, 'auto');
        resumeTo.current = 0;
        clearInterval(t);
      } else if (tries > 40) {
        resumeTo.current = 0;
        clearInterval(t);
      }
    }, 50);
    return () => clearInterval(t);
  }, [pdfDoc, goToPage]);

  // ── Page raster cache ──────────────────────────────────────
  function cachedMegapixels() {
    let mp = 0;
    for (const bmp of pageCacheRef.current.values()) {
      mp += ((bmp?.width || 0) * (bmp?.height || 0)) / 1e6;
    }
    return mp;
  }

  const getCachedPage = useCallback((key) => pageCacheRef.current.get(key) || null, []);

  const cachePage = useCallback((key, canvas) => {
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
  }, []);

  // ── Overlay drawing helpers ────────────────────────────────
  // The renderers live in lib/ink.js so this view, every page in the column
  // and the exporter all draw a stroke the same way.

  // The overlay of a given page, registered by that page as it mounts.
  const overlaysRef = useRef(new Map());
  const registerOverlay = useCallback((pageNum, ref) => {
    if (ref) overlaysRef.current.set(pageNum, ref);
    else overlaysRef.current.delete(pageNum);
  }, []);

  function overlayFor(pageNum) {
    return overlaysRef.current.get(pageNum)?.current || null;
  }

  function inkCtxFor(pageNum) {
    const c = overlayFor(pageNum);
    return c ? c.getContext('2d', { desynchronized: true }) : null;
  }

  function redrawOverlay(strokes, pageNum = drawPageRef.current) {
    const c = overlayFor(pageNum);
    if (c && c.width) redrawInk(c, strokes, inkDpr() * pageScale);
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
    // The event's own target is the page it happened on. Using a single
    // stored canvas would put every stroke in the column into page 1's
    // coordinate space.
    const c = e.currentTarget?.tagName === 'CANVAS' ? e.currentTarget : overlayFor(drawPageRef.current);
    if (!c) return [0, 0];
    const rect = c.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const cx = Math.max(0, Math.min(1, x));
    const cy = Math.max(0, Math.min(1, y));
    // Some pens report 0 for a genuine contact; treat that as a normal press
    // rather than a zero-width line the student cannot see.
    return pressure > 0 ? [cx, cy, pressure] : [cx, cy];
  }

  // Re-pulls the account copy and folds it into what is on screen. The fold
  // uses the LIVE state, not just the saved record — a stroke made in the
  // last half-second may not have autosaved yet, and a remote pull must never
  // be the thing that eats it. mergeRecords is a two-phase set, so this is a
  // safe union whichever side is ahead.
  async function pullLatest() {
    const l = latestRef.current;
    if (!l.fileHash) return;
    const merged = await pullAndMerge(l.fileHash, peekAnnotations(l.fileHash));
    if (!merged) return;
    const live = mergeRecords(merged, {
      hash: l.fileHash,
      fileName: l.fileName,
      pageCount: l.pageCount,
      strokesByPage: latestRef.current.strokesByPage,
      deleted: latestRef.current.deleted,
    });
    latestRef.current.deleted = live.deleted || [];
    setDeleted(live.deleted || []);
    setStrokesByPage(live.strokesByPage || {});
    currentStrokesRef.current = (live.strokesByPage || {})[drawPageRef.current] || [];
    // An autosave armed by the last stroke still holds the PRE-merge
    // snapshot. Left alone it fires after this merge and writes — then
    // pushes — a record without the other device's strokes, telling the
    // server they were never there. Re-arm it with the merged record.
    if (saveTimerRef.current) scheduleSave(live.strokesByPage || {}, live.deleted || []);
  }

  // Live cross-device sync: the server says this document's row changed (the
  // student's other iPad, their laptop) and this device folds it in as it
  // happens. Mid-stroke the ping is parked — merging under a moving pen is
  // how half-drawn lines get weird — and honoured the moment the pen lifts.
  useEffect(() => {
    if (!fileHash) return undefined;
    let dead = false;
    let cleanup = () => {};
    subscribeLive(fileHash, () => {
      if (drawingRef.current?.on) { pendingPullRef.current = true; return; }
      pullLatest();
    }).then((fn) => {
      if (dead) fn(); else cleanup = fn;
    });
    return () => { dead = true; cleanup(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fileHash]);

  // The rgb the given instrument would draw with right now — the one place
  // that knows about the custom slot.
  function resolveToolColor(t) {
    if (t === 'highlighter') {
      if (hlColor === 'custom' && customHl) return customHl;
      return HL_COLORS.find((c) => c.id === hlColor)?.rgb || HL_COLORS[0].rgb;
    }
    if (color === 'custom' && customPen) return customPen;
    return PEN_COLORS.find((c) => c.id === color)?.rgb || PEN_COLORS[0].rgb;
  }

  // Whole-stroke eraser: everything the point touches goes, as a tombstone,
  // which is the same shape deletion always takes here — so undo, redo and
  // cross-device sync need no new rules for it.
  function eraseAt(e) {
    const page = drawPageRef.current;
    const c = e.currentTarget?.tagName === 'CANVAS' ? e.currentTarget : overlayFor(page);
    if (!c) return;
    const rect = c.getBoundingClientRect();
    const x = (e.clientX - rect.left) / Math.max(1, rect.width);
    const y = (e.clientY - rect.top) / Math.max(1, rect.height);
    const aspect = rect.width / Math.max(1, rect.height);
    // The eraser's visual radius in normalised units, plus a small grace so a
    // hairline stroke is still catchable.
    const reach = ((size * 4 * inkDpr() * pageScale) / 2) / Math.max(1, c.height) + 0.004;
    setStrokesByPage((prev) => {
      const list = prev[page] || [];
      const gone = list.filter((st) => strokeHit(st, x, y, reach, aspect));
      if (!gone.length) return prev;
      const kept = list.filter((st) => !gone.includes(st));
      const next = { ...prev, [page]: kept };
      currentStrokesRef.current = kept;
      redrawOverlay(kept, page);
      setRedoStack((r) => [...r, ...gone.map((st) => ({ page, stroke: st }))].slice(-40));
      scheduleSave(next, addTomb(...gone.map((st) => st.id).filter(Boolean)));
      return next;
    });
  }

  // Hold a rough shape still for a beat and it snaps clean. The timer arms on
  // the stroke's LAST movement — a still hand adds no points (the coalesced
  // dedupe drops them), so the timer simply ripens.
  function scheduleShapeSnap() {
    clearTimeout(holdTimerRef.current);
    const ref = drawingRef.current;
    if (!ref?.on || !ref.stroke || ref.stroke.mode === 'eraser') return;
    const forId = ref.pointerId;
    holdTimerRef.current = setTimeout(() => {
      const cur = drawingRef.current;
      if (!cur?.on || cur.pointerId !== forId || !cur.stroke) return;
      const page = drawPageRef.current;
      const c = overlayFor(page);
      if (!c || !c.width) return;
      const shape = fitShape(cur.stroke.points, c.width / Math.max(1, c.height));
      if (!shape) return;
      // Replace the wobble with the clean shape — still plain points, so
      // storage, sync, undo and export need to know nothing about shapes.
      cur.stroke.points = shape.points;
      redrawOverlay(currentStrokesRef.current, page);
      const ctx = inkCtxFor(page);
      if (ctx) drawStroke(ctx, cur.stroke, c.width, c.height, inkDpr() * pageScale);
    }, 600);
  }

  // A live-sync ping that arrived mid-stroke waits for the pen to lift.
  function maybePullAfterStroke() {
    if (pendingPullRef.current) {
      pendingPullRef.current = false;
      pullLatest();
    }
  }

  function onPointerDown(e) {
    if (!pdfDoc) return;
    const onPage = Number(e.currentTarget?.dataset?.page || e.currentTarget?.parentElement?.dataset?.page || 0);
    if (onPage) drawPageRef.current = onPage;
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
    // Capture on the canvas the stroke started on, so a line that runs past
    // the bottom of a page keeps reporting to that page instead of jumping to
    // the next one mid-stroke.
    try { e.currentTarget?.setPointerCapture?.(e.pointerId); } catch { /* synthetic pointer */ }
    const usePressure = e.pointerType === 'pen';
    const useTilt = usePressure;
    // Surface, Wacom and S Pen styluses report the eraser barrel as button 5
    // / buttons bit 32. Flipping the stylus over is how people expect to
    // erase, and honouring it costs one test — the toolbar selection stays, so
    // turning the pen back over resumes drawing with the same pen.
    const barrelEraser = e.pointerType === 'pen' && (e.button === 5 || (e.buttons & 32) !== 0);
    const usedTool = barrelEraser ? 'eraser' : tool;
    if (usedTool === 'eraser' && eraserMode === 'stroke') {
      drawingRef.current = { on: true, pointerId: e.pointerId, erase: true, points: [] };
      eraseAt(e);
      return;
    }
    const pt = withTilt(pointFromEvent(e, usePressure ? e.pressure : 0), useTilt ? tiltOf(e) : 0);
    drawingRef.current = {
      on: true,
      pointerId: e.pointerId,
      stroke: {
        id: newStrokeId(),
        mode: usedTool,
        color: resolveToolColor(usedTool),
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
      hoverRing(e.clientX, e.clientY);
      return;
    }
    const ref = drawingRef.current;
    if (!ref?.on || e.pointerId !== ref.pointerId) return;
    e.preventDefault();
    if (ref.erase) { eraseAt(e); return; }
    const stroke = ref.stroke;
    const c = overlayFor(drawPageRef.current);
    if (!c) return;
    const ctx = inkCtxFor(drawPageRef.current);
    if (!ctx) return;
    const dpr = inkDpr();

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
    scheduleShapeSnap();

    if (stroke.mode === 'highlighter') {
      // Cannot extend a translucent stroke in place; repaint the page's
      // settled strokes and lay the live one over them as a single path. A
      // highlighter swipe is short, so this stays cheap.
      redrawOverlay(currentStrokesRef.current);
      applyBrush(ctx, stroke);
      strokeAsOnePath(ctx, stroke.points, c.width, c.height, widthAt(stroke, stroke.points[0], dpr * pageScale));
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
      ctx.lineWidth = widthAt(stroke, stroke.points[i], dpr * pageScale);
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
    clearTimeout(holdTimerRef.current);
    if (e?.pointerType === 'pen' && drawingRef.current?.on && !drawingRef.current.erase) {
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
            const list = prev[drawPageRef.current] || [];
            // The FIRST tap was committed as a stroke; drop it too.
            const trimmed = list.length && (list[list.length - 1].points || []).length <= 2
              ? list.slice(0, -1) : list;
            const next = { ...prev, [drawPageRef.current]: trimmed };
            currentStrokesRef.current = trimmed;
            redrawOverlay(trimmed, drawPageRef.current);
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
    if (ref.erase) { maybePullAfterStroke(); return; }
    if (!ref.stroke || ref.stroke.points.length < 1) { maybePullAfterStroke(); return; }
    // A tap never reaches onPointerMove, which is the only thing that paints a
    // stroke as it is made — so a single-point stroke went into the record and
    // never appeared until something else forced a redraw (a page flip, an
    // undo, a zoom). Pre-existing; the dot is drawn here instead.
    if (ref.stroke.points.length < 2) {
      const c = overlayFor(drawPageRef.current);
      const ctx = c && inkCtxFor(drawPageRef.current);
      if (ctx) drawStroke(ctx, ref.stroke, c.width, c.height, inkDpr() * pageScale);
    }
    setStrokesByPage((prev) => {
      const page = drawPageRef.current;
      const pageList = [...(prev[page] || []), ref.stroke];
      const next = { ...prev, [page]: pageList };
      currentStrokesRef.current = pageList;
      // A finished highlighter stroke is repainted from scratch: drawn
      // incrementally its own overlaps multiply into a dark smear, drawn once
      // it is the flat wash a highlighter actually makes.
      if (ref.stroke.mode === 'highlighter') redrawOverlay(pageList, drawPageRef.current);
      scheduleSave(next);
      return next;
    });
    // A new stroke is a new branch, so anything undone before it is now gone.
    setRedoStack([]);
    maybePullAfterStroke();
  }

  // ── Autosave (debounced) ───────────────────────────────────
  function scheduleSave(strokesObj, deletedList) {
    if (!fileHash) return;
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(async () => {
      // The ref means "a save is pending". Once this callback runs it is
      // not: leaving the spent timer id behind made pullLatest read a
      // stale truthy ref on every live-sync ping, re-arm a save and a
      // push, hear its own row change echoed back, and loop every few
      // seconds for as long as the document stayed open.
      saveTimerRef.current = null;
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
    saveTimerRef.current = null; // same contract as above: pending means pending
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
      redrawOverlay(trimmed, currentPage);
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
        redrawOverlay(pageList, currentPage);
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
      redrawOverlay([], currentPage);
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
      clearTimeout(holdTimerRef.current);
      drawingRef.current = { on: false, points: [] };
      redrawOverlay(currentStrokesRef.current, drawPageRef.current);
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

  // There is deliberately NO JavaScript frame-height measurement any more.
  // Three generations of it each failed a different way: the first let the
  // window grow a second scrollbar, the second fought the ResizeObserver at
  // 60fps, the third accumulated phantom spill on iPad Safari (innerHeight
  // lies around the dynamic bars) until the reader was a strip on Palm's
  // real device — and a pure POSITION shift (Thai fonts settling shrinks the
  // header above) wakes no observer at all. While a document is open,
  // body.vmx-reading turns the app shell into a 100dvh flex column
  // (styles.css) and every level down to the page frame is flex:1/min-height
  // 0 — the browser re-solves the height natively on font load, bar dance,
  // rotation, everything, with nothing left to measure or get wrong.

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
      if (found.length) goToPage(found[0].page);
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
    goToPage(shownHits[next].page);
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
    // Tapping the tool already in hand opens its options — the way every
    // notes app does it, and the eraser's only door (it has no swatch).
    if (tool === next) {
      setOptionsOpen((v) => !v);
      setMenuOpen(false);
      return;
    }
    setTool(next);
    setOptionsOpen(false);
    setMenuOpen(false);
  }

  // ── Export ─────────────────────────────────────────────────
  async function readOriginalBytes() {
    const src = sourceRef.current;
    if (!src) throw new Error('ไม่พบไฟล์ต้นฉบับ ลองเปิดเอกสารใหม่อีกครั้ง');
    if (src.kind === 'file') return src.file.arrayBuffer();
    // The signed link is minted against fixed hour boundaries and the service
    // worker caches by content hash, so this is normally a cache hit rather
    // than a second download.
    const res = await fetch(src.url);
    if (!res.ok) throw new Error(`โหลดไฟล์ต้นฉบับไม่สำเร็จ (${res.status})`);
    return res.arrayBuffer();
  }

  async function runExport(annotatedOnly) {
    if (exporting) return;
    setMenuOpen(false);
    const pagesWithInk = Object.values(strokesByPage).filter((a) => a?.length).length;
    if (pagesWithInk === 0) {
      showToast('ยังไม่มีรอยเขียนในเอกสารนี้ ลองเขียนก่อนแล้วค่อยส่งออก', 4000);
      return;
    }
    setExporting({ done: 0, total: pagesWithInk });
    try {
      const bytes = await readOriginalBytes();
      const blob = await exportAnnotatedPdf({
        bytes,
        strokesByPage,
        annotatedOnly,
        // The reader's own renderer, so an exported page cannot look
        // different from the page it was copied off.
        paint: (ctx, strokes, w, h, scale) => {
          for (const st of strokes) drawStroke(ctx, st, w, h, scale);
        },
        onProgress: (done, total) => setExporting({ done, total }),
      });
      downloadBlob(blob, exportFileName(fileName, annotatedOnly));
      showToast('ส่งออกไฟล์แล้ว', 3000);
    } catch (e) {
      console.error('[pdf-annotate] export failed:', e);
      showToast(e?.code === 'no-annotations'
        ? 'ยังไม่มีรอยเขียนในเอกสารนี้'
        : thaiError(e, 'ส่งออกไฟล์ไม่สำเร็จ ลองใหม่อีกครั้ง'), 5000);
    } finally {
      setExporting(null);
    }
  }

  // Positions and sizes the hover ring imperatively. Reads the CURRENT tool
  // state because it is only ever called from the handler trampoline, whose
  // closure is refreshed every render.
  function hoverRing(x, y) {
    const el = hoverRingRef.current;
    if (!el) return;
    if (x == null) { el.style.display = 'none'; return; }
    const d = Math.max(8, size * (tool === 'highlighter' ? 4.5 : tool === 'eraser' ? 4 : 1) * zoom);
    const col = tool === 'eraser' ? '#ffffff' : resolveToolColor(tool);
    el.style.display = 'block';
    el.style.left = x + 'px';
    el.style.top = y + 'px';
    el.style.width = d + 'px';
    el.style.height = d + 'px';
    el.style.borderRadius = tool === 'highlighter' ? '3px' : '50%';
    el.style.borderColor = col;
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
    const wrap = wrapperRef.current;
    if (!wrap) return;
    const r = wrap.getBoundingClientRect();
    // Anchor in frame-viewport space; fall back to the middle of what is on
    // screen when the gesture has no natural point (the toolbar buttons).
    const ax = clientX == null ? r.width / 2 : clientX - r.left;
    const ay = clientY == null ? r.height / 2 : clientY - r.top;
    // The page row under (or nearest to) the anchor point. Anchoring to a
    // page rather than to a fraction of the whole column is what survives 51
    // rows resizing asynchronously after the zoom.
    const px = r.left + ax;
    const py = r.top + ay;
    let best = null;
    for (const row of wrap.querySelectorAll('[data-page]')) {
      const b = row.getBoundingClientRect();
      const d = py < b.top ? b.top - py : py > b.bottom ? py - b.bottom : 0;
      if (!best || d < best.d) best = { d, row, b };
      if (d === 0) break;
    }
    if (!best) return;
    zoomAnchorRef.current = {
      ax,
      ay,
      page: Number(best.row.dataset.page),
      fx: (px - best.b.left) / Math.max(1, best.b.width),
      fy: (py - best.b.top) / Math.max(1, best.b.height),
      until: performance.now() + 450,
    };
  }

  function setZoomAt(next, clientX, clientY) {
    setZoom((z) => {
      const v = typeof next === 'function' ? next(z) : next;
      if (v === z) return z;
      captureAnchor(clientX, clientY);
      return v;
    });
  }

  // Restores the anchor after a zoom. Measured in client space and applied as
  // a DELTA each frame — wherever the row currently is versus wherever the
  // anchor says it should be — which is immune to padding, borders and
  // whatever else sits between the frame's scroll origin and the row. The
  // loop runs until the row's height has been stable for a few frames (all
  // rows have adopted the new scale) or 450ms, whichever comes first.
  useLayoutEffect(() => {
    const a = zoomAnchorRef.current;
    const wrap = wrapperRef.current;
    if (!a || !wrap) return undefined;
    let raf = 0;
    let lastH = -1;
    let stable = 0;
    const place = () => {
      const row = wrap.querySelector(`[data-page="${a.page}"]`);
      if (row) {
        const rw = wrap.getBoundingClientRect();
        const rb = row.getBoundingClientRect();
        wrap.scrollTop += (rb.top + a.fy * rb.height) - (rw.top + a.ay);
        wrap.scrollLeft += (rb.left + a.fx * rb.width) - (rw.left + a.ax);
        stable = Math.abs(rb.height - lastH) < 0.5 ? stable + 1 : 0;
        lastH = rb.height;
      }
      if (performance.now() < a.until && stable < 3) {
        raf = requestAnimationFrame(place);
      } else {
        zoomAnchorRef.current = null;
      }
    };
    place();
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zoom]);

  function zoomIn(e) {
    setZoomAt((z) => ZOOM_STEPS.find((v) => v > z + 0.001) ?? z, e?.clientX, e?.clientY);
  }
  function zoomOut(e) {
    setZoomAt((z) => [...ZOOM_STEPS].reverse().find((v) => v < z - 0.001) ?? z, e?.clientX, e?.clientY);
  }
  const canRedo = redoStack.length > 0 && redoStack[redoStack.length - 1].page === currentPage;
  // Stable identities through a ref trampoline: the handler functions close
  // over fresh state every render, but the OBJECT handed to the pages never
  // changes — which is what lets React.memo skip all of them when this view
  // re-renders for a toast, a sync badge, or a panel.
  const handlersRef = useRef({});
  handlersRef.current = { onPointerDown, onPointerMove, onPointerUp, hoverRing };
  const pageHandlers = useMemo(() => ({
    onPointerDown: (e) => handlersRef.current.onPointerDown(e),
    onPointerMove: (e) => handlersRef.current.onPointerMove(e),
    onPointerUp: (e) => handlersRef.current.onPointerUp(e),
    onPointerCancel: (e) => handlersRef.current.onPointerUp(e),
    onPointerLeave: (e) => { handlersRef.current.hoverRing(null); handlersRef.current.onPointerUp(e); },
    onPointerOut: (e) => { if (e.pointerType === 'pen') handlersRef.current.hoverRing(null); },
  }), []);
  const activeColor = (() => {
    if (tool === 'highlighter') {
      if (hlColor === 'custom' && customHl) return { id: 'custom', rgb: customHl, name: 'กำหนดเอง' };
      return HL_COLORS.find((c) => c.id === hlColor) || HL_COLORS[0];
    }
    if (color === 'custom' && customPen) return { id: 'custom', rgb: customPen, name: 'กำหนดเอง' };
    return PEN_COLORS.find((c) => c.id === color) || PEN_COLORS[0];
  })();

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
    <div ref={rootRef} className="vmx-reader" style={{ display: 'flex', flexDirection: 'column', minHeight: 0, flex: 1 }}>
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
        <ToolButton
          icon="eraser"
          label={tool === 'eraser' ? 'ยางลบ, แตะซ้ำเพื่อเลือกโหมดลบ' : 'ยางลบ'}
          active={tool === 'eraser'}
          onClick={() => pickTool('eraser')}
        />

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

      {/* Colour, size and — for the eraser — mode, for the tool in hand. */}
      {optionsOpen && (
        <div
          role="dialog"
          aria-label={tool === 'eraser' ? 'โหมดและขนาดยางลบ' : 'สีและขนาดของเครื่องมือ'}
          style={{
            display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap',
            padding: '8px 12px', borderBottom: '1px solid var(--clr-border, #e1ddd2)',
            background: 'var(--clr-bg, #fff)',
          }}
        >
          {tool === 'eraser' ? (
            <div role="group" aria-label="โหมดยางลบ" style={{ display: 'flex', gap: 6 }}>
              {[
                { id: 'pixel', name: 'ลบเฉพาะที่ถู' },
                { id: 'stroke', name: 'ลบทั้งเส้นที่แตะ' },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  className="vmx-btn vmx-btn-sm"
                  onClick={() => setEraserMode(m.id)}
                  aria-pressed={eraserMode === m.id}
                  style={{
                    borderRadius: 999,
                    border: eraserMode === m.id ? '2px solid var(--clr-ink, #222)' : '1px solid var(--clr-border, #d8d3c4)',
                    background: eraserMode === m.id ? 'var(--clr-surface-2, #efece3)' : 'transparent',
                    fontWeight: eraserMode === m.id ? 700 : 400,
                  }}
                >{m.name}</button>
              ))}
            </div>
          ) : (
            <>
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
              {/* The custom slot: a native colour picker dressed as a swatch.
                  Until a colour has been mixed it shows a wheel. */}
              {(() => {
                const custom = tool === 'highlighter' ? customHl : customPen;
                const on = (tool === 'highlighter' ? hlColor : color) === 'custom';
                return (
                  <label
                    title="สีกำหนดเอง"
                    style={{
                      position: 'relative',
                      width: 40, height: 40, minWidth: 40, padding: 8,
                      borderRadius: tool === 'highlighter' ? 8 : '50%',
                      border: on ? '2px solid var(--clr-ink, #222)' : '1px solid var(--clr-border, #d8d3c4)',
                      background: custom || 'conic-gradient(#e74c3c, #f1c40f, #2ecc71, #3498db, #9b59b6, #e74c3c)',
                      backgroundClip: 'content-box',
                      cursor: 'pointer',
                      display: 'inline-block',
                    }}
                  >
                    <input
                      type="color"
                      aria-label="สีกำหนดเอง"
                      value={custom || '#7b3ff2'}
                      onInput={(e) => {
                        const v = e.target.value;
                        if (tool === 'highlighter') { setCustomHl(v); setHlColor('custom'); } else { setCustomPen(v); setColor('custom'); }
                      }}
                      style={{ position: 'absolute', inset: 0, opacity: 0, width: '100%', height: '100%', cursor: 'pointer' }}
                    />
                  </label>
                );
              })()}
            </>
          )}
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
          <span aria-hidden="true" style={{ width: 1, alignSelf: 'stretch', background: 'var(--clr-border)' }} />
          <button type="button" role="menuitem" className="vmx-btn vmx-btn-ghost vmx-btn-sm"
            onClick={() => runExport(false)} disabled={!!exporting || annotatedPages.size === 0}>
            ส่งออกทั้งเล่มพร้อมรอยเขียน
          </button>
          <button type="button" role="menuitem" className="vmx-btn vmx-btn-ghost vmx-btn-sm"
            onClick={() => runExport(true)} disabled={!!exporting || annotatedPages.size === 0}>
            ส่งออกเฉพาะ {annotatedPages.size} หน้าที่เขียนไว้
          </button>
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

      {/* Body — thumbnail rail + the scrolling column of pages */}
      <div className="vmx-pdf-body" style={{ flex: 1, display: 'flex', minHeight: 0 }}>
        {/* overflow:hidden on the rail wrapper is load-bearing: the inner
            list is as tall as every thumbnail stacked (10,000px on a 51-page
            deck) and without the cage it blew the WHOLE PAGE out to that
            height — a window scrollbar on top of the frame's own, which is
            what made the reader feel both cut off and stiff. */}
        {sidebarOpen && (
          <div className="vmx-pdf-sidebar-wrap" style={{ width: 140, flexShrink: 0, overflow: 'hidden', height: '100%' }}>
            <PdfThumbnailSidebar
              pdfDoc={pdfDoc}
              currentPage={currentPage}
              onPageSelect={(n) => goToPage(n)}
              annotatedPages={annotatedPages}
            />
          </div>
        )}
        <div
          ref={wrapperRef}
          style={{
            flex: 1,
            minHeight: 0,
            overflow: 'auto',
            WebkitOverflowScrolling: 'touch',
            background: '#2a2a2a',
            padding: 12,
            minWidth: 0,
            // The column scrolls inside this frame; `contain` would refuse to
            // pass the wheel to the page and is deliberately absent — see the
            // left-rail incident in styles.css.
            overscrollBehavior: 'auto',
          }}
        >
          {Array.from({ length: pageCount }, (_, i) => i + 1).map((n) => (
            <PdfPage
              key={n}
              pdfDoc={pdfDoc}
              pageNum={n}
              scale={pageScale}
              strokes={strokesByPage[n]}
              cacheKeyPrefix={fileHash || 'x'}
              getCached={getCachedPage}
              putCached={cachePage}
              registerOverlay={registerOverlay}
              active={n === currentPage}
              cursor="crosshair"
              handlers={pageHandlers}
              scrollRoot={wrapperRef}
            />
          ))}
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
          onClick={() => goToPage(Math.max(1, currentPage - 1))}
          disabled={currentPage <= 1}
        >← ก่อน</button>
        <span style={{ fontSize: 13, fontFamily: 'var(--vmx-mono)' }}>
          หน้า <strong>{currentPage}</strong> / {pageCount}
        </span>
        <button
          type="button"
          className="vmx-btn vmx-btn-ghost vmx-btn-sm"
          onClick={() => goToPage(Math.min(pageCount, currentPage + 1))}
          disabled={currentPage >= pageCount}
        >ถัดไป →</button>
      </div>

      {/* Hovering-stylus ring. Purely a readout of where the nib is and how
          wide the current brush is — pointer-events off so it can never sit
          between the pen and the canvas. */}
      <div
        ref={hoverRingRef}
        aria-hidden="true"
        style={{
          display: 'none',
          position: 'fixed',
          transform: 'translate(-50%, -50%)',
          border: '1.5px solid #c0392b',
          boxShadow: '0 0 0 1px rgba(0,0,0,0.35)',
          pointerEvents: 'none',
          zIndex: 900,
        }}
      />

      {exporting && (
        <div
          role="status"
          aria-live="polite"
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
          }}
        >
          <div style={{ background: 'var(--clr-bg, #fff)', color: 'var(--clr-ink)', padding: '16px 20px', borderRadius: 10, minWidth: 240 }}>
            <div style={{ fontSize: 14, marginBottom: 8 }}>
              กำลังสร้างไฟล์ {exporting.done} / {exporting.total} หน้า
            </div>
            <div style={{ height: 6, borderRadius: 999, background: 'var(--clr-border, #e1ddd2)', overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                width: `${Math.round((exporting.done / Math.max(1, exporting.total)) * 100)}%`,
                background: 'var(--vmx-color-accent, #4a6b4a)',
                transition: 'width 160ms linear',
              }} />
            </div>
          </div>
        </div>
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
