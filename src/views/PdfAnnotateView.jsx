// ============================================================
// PdfAnnotateView — PDF import + annotate
// ============================================================
//
// Three states:
//   empty   — drag-drop zone + file input + recent-PDFs list
//   loading — spinner while pdfjs parses the upload + renders p.1
//   viewing — page canvas + transparent draw overlay + thumb sidebar
//
// Strokes save per-page into localStorage (debounced 500 ms) keyed by
// SHA-256(file bytes) — see lib/pdf-annotations.js. PDF bytes are
// NEVER stored; user re-uploads to resume. Toast on view-load when
// resuming via cache so the contract is obvious.
//
// Canvas uses 2× DPR for retina. The annotation overlay uses Pointer
// Events so finger / Apple Pencil / mouse all work — `touch-action:
// none` on the overlay prevents the page scrolling under a stroke.
// ============================================================

import { useState, useEffect, useRef, useCallback } from 'react';
import BackBar from '../components/BackBar.jsx';
import { thaiError } from '../lib/errors.js';
import PdfThumbnailSidebar from '../components/PdfThumbnailSidebar.jsx';
import {
  hashFile,
  loadAnnotations,
  saveAnnotations,
  listRecentPdfs,
  deleteAnnotations,
} from '../lib/pdf-annotations.js';

const PEN_COLORS = [
  { id: 'red',  rgb: '#c0392b', name: 'แดง' },
  { id: 'blue', rgb: '#2980b9', name: 'น้ำเงิน' },
  { id: 'gold', rgb: '#b88940', name: 'ทอง' },
];
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
  const [tool, setTool] = useState('pen'); // 'pen' | 'eraser'
  const [color, setColor] = useState('red');
  const [size, setSize] = useState(3);
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState('');
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [recent, setRecent] = useState(() => listRecentPdfs());
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const fileInputRef = useRef(null);
  const baseCanvasRef = useRef(null);
  const overlayCanvasRef = useRef(null);
  const wrapperRef = useRef(null);
  const drawingRef = useRef({ on: false, points: [] });
  const renderTaskRef = useRef(null);
  const saveTimerRef = useRef(null);
  const currentStrokesRef = useRef([]); // live mirror for autosave

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
      const existing = loadAnnotations(hash);
      const restoredStrokes = existing?.strokesByPage || {};
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
      saveAnnotations(hash, {
        fileName: file.name,
        pageCount: doc.numPages,
        strokesByPage: restoredStrokes,
      });
      setRecent(listRecentPdfs());
      if (existing && Object.keys(restoredStrokes).length > 0) {
        showToast('โหลด annotation เดิมกลับมาแล้ว ✓', 3000);
      } else {
        showToast('อัปโหลดไฟล์เดิมอีกครั้งเพื่อทำต่อในรอบหน้า', 4500);
      }
    } catch (e) {
      console.error('[pdf-annotate] load failed:', e);
      setError('โหลด PDF ไม่สำเร็จ: ' + (e?.message || 'ไฟล์อาจเสีย'));
    } finally {
      setLoading(false);
      setLoadingMsg('');
    }
  }, [showToast]);

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
        const buf = await res.arrayBuffer();
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
      const existing = loadAnnotations(hash);
      const restoredStrokes = existing?.strokesByPage || {};
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
      saveAnnotations(hash, {
        fileName: doc.fileName || 'document.pdf',
        pageCount: pdf.numPages,
        strokesByPage: restoredStrokes,
      });
      setRecent(listRecentPdfs());
      if (startPage > 1) {
        showToast(`เปิดต่อที่หน้า ${startPage} ✓`, 2500);
      } else if (existing && Object.keys(restoredStrokes).length > 0) {
        showToast('โหลด annotation เดิมกลับมาแล้ว ✓', 3000);
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
  }, [showToast]);

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
      saveAnnotations(fileHash, { fileName, pageCount, lastPage: currentPage });
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
        const fitScale = Math.min(2, Math.max(0.6, wrapW / naturalViewport.width));
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

        const ctx = baseCanvas.getContext('2d');
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, baseCanvas.width, baseCanvas.height);
        const dprViewport = page.getViewport({ scale: fitScale * dpr });
        const task = page.render({ canvasContext: ctx, viewport: dprViewport });
        renderTaskRef.current = task;
        await task.promise;
        if (cancelled) return;
        renderTaskRef.current = null;
        // Redraw saved strokes for this page on the overlay
        redrawOverlay(strokesByPage[currentPage] || []);
      } catch (e) {
        if (e?.name === 'RenderingCancelledException') return;
        console.error('[pdf-annotate] render failed:', e);
      }
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pdfDoc, currentPage]);

  // ── Overlay drawing helpers ────────────────────────────────
  function redrawOverlay(strokes) {
    const c = overlayCanvasRef.current;
    if (!c) return;
    const ctx = c.getContext('2d');
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, c.width, c.height);
    for (const stroke of strokes || []) {
      drawStroke(ctx, stroke, c.width, c.height);
    }
  }

  function drawStroke(ctx, stroke, canvasW, canvasH) {
    if (!stroke?.points || stroke.points.length === 0) return;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    if (stroke.mode === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.strokeStyle = 'rgba(0,0,0,1)';
      ctx.lineWidth = stroke.size * 4;
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = stroke.color;
      ctx.lineWidth = stroke.size;
    }
    ctx.beginPath();
    // Stroke points are stored in normalized [0..1] space so the same
    // strokes redraw correctly when the viewport scale changes.
    const pts = stroke.points;
    ctx.moveTo(pts[0][0] * canvasW, pts[0][1] * canvasH);
    for (let i = 1; i < pts.length; i++) {
      ctx.lineTo(pts[i][0] * canvasW, pts[i][1] * canvasH);
    }
    ctx.stroke();
    ctx.globalCompositeOperation = 'source-over';
  }

  // ── Pointer handlers (annotation overlay) ─────────────────
  function pointFromEvent(e) {
    const c = overlayCanvasRef.current;
    const rect = c.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    return [Math.max(0, Math.min(1, x)), Math.max(0, Math.min(1, y))];
  }

  function onPointerDown(e) {
    if (!pdfDoc) return;
    e.preventDefault();
    overlayCanvasRef.current?.setPointerCapture?.(e.pointerId);
    const pt = pointFromEvent(e);
    drawingRef.current = {
      on: true,
      stroke: {
        mode: tool,
        color: PEN_COLORS.find((p) => p.id === color)?.rgb || PEN_COLORS[0].rgb,
        size,
        points: [pt],
      },
    };
  }

  function onPointerMove(e) {
    const ref = drawingRef.current;
    if (!ref?.on) return;
    e.preventDefault();
    const pt = pointFromEvent(e);
    const stroke = ref.stroke;
    const prev = stroke.points[stroke.points.length - 1];
    // Skip near-duplicate points to keep the stroke arrays compact
    if (Math.abs(prev[0] - pt[0]) < 0.001 && Math.abs(prev[1] - pt[1]) < 0.001) return;
    stroke.points.push(pt);
    // Draw just the new segment incrementally so the user sees a
    // live line — full redraw would be O(strokes) per move event.
    const c = overlayCanvasRef.current;
    if (!c) return;
    const ctx = c.getContext('2d');
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    if (stroke.mode === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.strokeStyle = 'rgba(0,0,0,1)';
      ctx.lineWidth = stroke.size * 4;
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = stroke.color;
      ctx.lineWidth = stroke.size;
    }
    ctx.beginPath();
    ctx.moveTo(prev[0] * c.width, prev[1] * c.height);
    ctx.lineTo(pt[0] * c.width, pt[1] * c.height);
    ctx.stroke();
    ctx.globalCompositeOperation = 'source-over';
  }

  function onPointerUp() {
    const ref = drawingRef.current;
    if (!ref?.on) return;
    drawingRef.current = { on: false, points: [] };
    if (!ref.stroke || ref.stroke.points.length < 1) return;
    setStrokesByPage((prev) => {
      const pageList = [...(prev[currentPage] || []), ref.stroke];
      const next = { ...prev, [currentPage]: pageList };
      currentStrokesRef.current = pageList;
      scheduleSave(next);
      return next;
    });
  }

  // ── Autosave (debounced) ───────────────────────────────────
  function scheduleSave(strokesObj) {
    if (!fileHash) return;
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      saveAnnotations(fileHash, {
        fileName,
        pageCount,
        strokesByPage: strokesObj,
      });
      setRecent(listRecentPdfs());
    }, AUTOSAVE_MS);
  }

  function saveNow() {
    if (!fileHash) return;
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveAnnotations(fileHash, {
      fileName,
      pageCount,
      strokesByPage,
    });
    setRecent(listRecentPdfs());
    showToast('บันทึกแล้ว ✓');
  }

  function undoLast() {
    setStrokesByPage((prev) => {
      const pageList = prev[currentPage] || [];
      if (pageList.length === 0) return prev;
      const trimmed = pageList.slice(0, -1);
      const next = { ...prev, [currentPage]: trimmed };
      currentStrokesRef.current = trimmed;
      redrawOverlay(trimmed);
      scheduleSave(next);
      return next;
    });
  }

  function clearPage() {
    setStrokesByPage((prev) => {
      const next = { ...prev, [currentPage]: [] };
      currentStrokesRef.current = [];
      redrawOverlay([]);
      scheduleSave(next);
      return next;
    });
  }

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
    showToast(`อัปโหลด "${entry.fileName}" อีกครั้งเพื่อทำต่อ`, 4000);
    fileInputRef.current?.click();
  }

  function removeRecent(hash, ev) {
    ev?.stopPropagation?.();
    deleteAnnotations(hash);
    setRecent(listRecentPdfs());
  }

  function backToEmpty() {
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
      saveTimerRef.current = null;
    }
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
    setRecent(listRecentPdfs());
  }

  // Cleanup on unmount
  useEffect(() => () => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    if (renderTaskRef.current) { try { renderTaskRef.current.cancel(); } catch {} }
  }, []);

  const annotatedPages = new Set(
    Object.entries(strokesByPage)
      .filter(([, arr]) => Array.isArray(arr) && arr.length > 0)
      .map(([k]) => Number(k))
  );

  // ── Empty state ────────────────────────────────────────────
  if (!pdfDoc) {
    return (
      <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}>
        <BackBar onBack={goHome} label="กลับหน้าแรก" subtitle="PDF + วาดทับ" />
        <div style={{ padding: '8px 16px 24px', maxWidth: 720, margin: '0 auto', width: '100%' }}>
          <div style={{ fontSize: 11, fontFamily: 'var(--vmx-mono)', color: 'var(--clr-ink-soft)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            📑 Lecture-slide / textbook annotation
          </div>
          <h1 style={{ margin: '6px 0 4px', fontSize: 22 }}>อัปโหลด PDF แล้วเขียนทับ</h1>
          <p style={{ color: 'var(--clr-ink-soft)', fontSize: 13, margin: '0 0 16px' }}>
            ลากไฟล์มาวาง หรือกดเลือกไฟล์, บันทึก stroke อัตโนมัติในเบราว์เซอร์, ตัวไฟล์ PDF ไม่ถูกเก็บไว้ (อัปโหลดอีกครั้งเพื่อทำต่อ)
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
            <span style={{ fontSize: 32 }}>📑</span>
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
                PDF ล่าสุด (annotation ที่บันทึกไว้)
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
                      <span style={{ fontSize: 18 }}>📄</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 14, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.fileName}</div>
                        <div style={{ fontSize: 11, color: 'var(--clr-ink-soft)' }}>
                          {r.pageCount} หน้า, {r.annotatedPageCount} หน้ามี annotation, {fmtDate(r.lastOpened)}
                        </div>
                      </div>
                      <button
                        type="button"
                        className="vmx-btn vmx-btn-ghost vmx-btn-sm"
                        onClick={(e) => removeRecent(r.hash, e)}
                        title="ลบ annotation นี้"
                        aria-label={`ลบ annotation ของ ${r.fileName}`}
                      >🗑</button>
                    </div>
                  </li>
                ))}
              </ul>
              <p style={{ fontSize: 11, color: 'var(--clr-ink-soft)', marginTop: 8 }}>
                ⓘ ตัวไฟล์ PDF เก็บไว้ไม่ได้ในเบราว์เซอร์ — อัปโหลดไฟล์เดิมอีกครั้ง strokes จะกลับมาเอง
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
    <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}>
      <BackBar onBack={backToEmpty} label="เปลี่ยน PDF" subtitle={fileName} />
      {/* Toolbar */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 6,
        padding: '6px 12px',
        borderBottom: '1px solid var(--clr-border, #e1ddd2)',
        background: 'var(--clr-surface, #f7f7f4)',
        alignItems: 'center',
      }}>
        <button type="button" className={`vmx-chip ${tool === 'pen' ? 'active' : ''}`} onClick={() => setTool('pen')}>ปากกา</button>
        <button type="button" className={`vmx-chip ${tool === 'eraser' ? 'active' : ''}`} onClick={() => setTool('eraser')}>🧽 ลบ</button>
        <span style={{ width: 1, height: 20, background: 'var(--clr-border)', margin: '0 4px' }} />
        {tool === 'pen' && PEN_COLORS.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setColor(c.id)}
            title={c.name}
            aria-label={`สี ${c.name}`}
            style={{
              width: 24, height: 24, borderRadius: '50%',
              border: color === c.id ? '2px solid var(--clr-ink, #222)' : '1px solid var(--clr-border, #ccc)',
              background: c.rgb, cursor: 'pointer', padding: 0,
            }}
          />
        ))}
        <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
          ขนาด
          <input
            type="range"
            min="1"
            max="10"
            value={size}
            onChange={(e) => setSize(parseInt(e.target.value, 10))}
            style={{ width: 70 }}
          />
        </label>
        <span style={{ width: 1, height: 20, background: 'var(--clr-border)', margin: '0 4px' }} />
        <button type="button" className="vmx-btn vmx-btn-ghost vmx-btn-sm" onClick={undoLast}>↶ Undo</button>
        <button type="button" className="vmx-btn vmx-btn-ghost vmx-btn-sm" onClick={clearPage}>ล้างหน้านี้</button>
        <button type="button" className="vmx-btn vmx-btn-ghost vmx-btn-sm" onClick={saveNow}>บันทึก</button>
        <span style={{ flex: 1 }} />
        <button
          type="button"
          className="vmx-btn vmx-btn-ghost vmx-btn-sm"
          onClick={() => setSidebarOpen((o) => !o)}
          aria-pressed={sidebarOpen}
          title="แสดง / ซ่อนหน้าทั้งหมด"
        >หน้า ({pageCount})</button>
      </div>

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
            overflow: 'auto',
            background: '#2a2a2a',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start',
            padding: 12,
            minWidth: 0,
          }}
        >
          <div style={{ position: 'relative', display: 'inline-block', lineHeight: 0 }}>
            <canvas ref={baseCanvasRef} style={{ display: 'block', background: '#fff', boxShadow: '0 4px 24px rgba(0,0,0,0.4)' }} />
            <canvas
              ref={overlayCanvasRef}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
              onPointerLeave={onPointerUp}
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
      <div style={{
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
