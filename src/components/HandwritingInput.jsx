// ============================================================
// HandwritingInput — write by hand, get text back to edit
// ============================================================
// The written paper is handwritten. This is the optional third way in,
// beside typing and the microphone: write with a finger, a stylus or an
// Apple Pencil on the pad, or photograph a page written on paper, and the
// words appear in the answer box a few seconds later — as text the student
// checks and edits before submitting. Nothing about grading changes; the
// answer that is graded is the text in the box.
//
// The pad keeps every stroke as points (x, y, width). That is what makes a
// pen feel like a pen (pressure sets the width, coalesced events keep the
// curve, the palm is ignored once the pen is down), what lets a stroke be
// undone, and what the model reads: not a screenshot of the pad but the
// ink alone, cropped and redrawn at up to four times the size, so tone
// marks and the vowels above and below the line survive.
//
// The transcription happens on the server (/api/transcribe-handwriting,
// a vision model told to copy, never to correct). When that route is not
// configured the status says so and typing still works.
// ============================================================

import { useEffect, useRef, useState } from 'react';
import { createPointerPolicy, strokeWidth, padHeight, inkBounds, fitScale } from '../lib/handwriting-pad.js';

const INK = '#141414';
const PAPER = '#ffffff';
const GUIDE = '#e3e3e3';
const GUIDE_GAP = 84; // CSS px between the ruled lines on the pad
const EXPORT_MARGIN = 24;

function toBase64(dataUrl) {
  const comma = dataUrl.indexOf(',');
  return { mime: dataUrl.slice(5, dataUrl.indexOf(';')), image: dataUrl.slice(comma + 1) };
}

// A photo is downsized on the device to the size the model reads at full
// detail; pixels past that are dropped by the provider anyway, and the
// request stays small on a phone connection.
function photoToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const scale = fitScale(img.naturalWidth, img.naturalHeight, { min: 0, max: 1 });
      const c = document.createElement('canvas');
      c.width = Math.max(1, Math.round(img.naturalWidth * scale));
      c.height = Math.max(1, Math.round(img.naturalHeight * scale));
      const ctx = c.getContext('2d');
      ctx.fillStyle = PAPER;
      ctx.fillRect(0, 0, c.width, c.height);
      ctx.drawImage(img, 0, 0, c.width, c.height);
      URL.revokeObjectURL(url);
      resolve(c.toDataURL('image/jpeg', 0.9));
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('image')); };
    img.src = url;
  });
}

// White paper, optionally ruled. The ruling is only on the visible pad; the
// export redraws the strokes on plain white.
function paintPaper(ctx, w, h, ruled) {
  ctx.fillStyle = PAPER;
  ctx.fillRect(0, 0, w, h);
  if (!ruled) return;
  ctx.strokeStyle = GUIDE;
  ctx.lineWidth = 1;
  for (let y = GUIDE_GAP; y < h - 12; y += GUIDE_GAP) {
    ctx.beginPath();
    ctx.moveTo(12, y + 0.5);
    ctx.lineTo(w - 12, y + 0.5);
    ctx.stroke();
  }
}

// Each segment at its own width, so a pen stroke thins and thickens with
// pressure; round caps and joins hide the seams.
function drawStroke(ctx, pts) {
  if (!pts.length) return;
  ctx.strokeStyle = INK;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  if (pts.length === 1) {
    const [x, y, w] = pts[0];
    ctx.beginPath();
    ctx.lineWidth = w;
    ctx.moveTo(x, y);
    ctx.lineTo(x + 0.1, y + 0.1);
    ctx.stroke();
    return;
  }
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0, w0] = pts[i - 1];
    const [x1, y1, w1] = pts[i];
    ctx.beginPath();
    ctx.lineWidth = (w0 + w1) / 2;
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.stroke();
  }
}

export default function HandwritingInput({ onText, maxChars = 1000 }) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [strokeCount, setStrokeCount] = useState(0);
  const [status, setStatus] = useState('');
  const [height, setHeight] = useState(() => padHeight(typeof window !== 'undefined' ? window.innerWidth : 375));
  const padRef = useRef(null);
  const strokes = useRef([]);      // finished strokes: arrays of [x, y, width] in CSS px
  const current = useRef(null);    // { id: pointerId, pts }
  const policy = useRef(createPointerPolicy());
  const onTextRef = useRef(onText);
  useEffect(() => { onTextRef.current = onText; });

  const padSize = () => [padRef.current?.clientWidth || 320, height];

  // Size the backing store to the box at device resolution and paint every
  // stroke again — the pad survives a rotation or a resize with its ink.
  const redraw = () => {
    const c = padRef.current;
    if (!c) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 3);
    const [w, h] = padSize();
    c.width = Math.round(w * dpr);
    c.height = Math.round(h * dpr);
    const ctx = c.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    paintPaper(ctx, w, h, true);
    for (const pts of strokes.current) drawStroke(ctx, pts);
  };
  useEffect(() => {
    if (!open) return undefined;
    redraw();
    const onResize = () => { setHeight(padHeight(window.innerWidth)); redraw(); };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [open, height]); // eslint-disable-line react-hooks/exhaustive-deps

  const point = (ev) => {
    const r = padRef.current.getBoundingClientRect();
    return [ev.clientX - r.left, ev.clientY - r.top, strokeWidth(ev.pointerType, ev.pressure)];
  };
  const down = (e) => {
    if (busy || current.current) return;
    if (!policy.current.accept(e.pointerType)) return;
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    e.preventDefault();
    padRef.current.setPointerCapture?.(e.pointerId);
    const p = point(e);
    current.current = { id: e.pointerId, pts: [p] };
    drawStroke(padRef.current.getContext('2d'), [p]);
  };
  const move = (e) => {
    const cur = current.current;
    if (!cur || e.pointerId !== cur.id) return;
    // A pencil reports up to 240 samples a second; the browser hands the
    // ones between two frames as coalesced events, which keep the curve.
    const native = e.nativeEvent;
    const batch = typeof native.getCoalescedEvents === 'function' ? native.getCoalescedEvents() : [];
    const list = batch.length ? batch : [native];
    const ctx = padRef.current.getContext('2d');
    for (const ev of list) {
      const p = point(ev);
      const prev = cur.pts[cur.pts.length - 1];
      if (Math.hypot(p[0] - prev[0], p[1] - prev[1]) < 0.5) continue;
      cur.pts.push(p);
      drawStroke(ctx, [prev, p]);
    }
  };
  const up = (e) => {
    const cur = current.current;
    if (!cur || (e && e.pointerId !== cur.id)) return;
    strokes.current.push(cur.pts);
    current.current = null;
    setStrokeCount(strokes.current.length);
  };

  const undo = () => {
    if (busy || !strokes.current.length) return;
    strokes.current.pop();
    setStrokeCount(strokes.current.length);
    redraw();
  };
  const clear = () => {
    strokes.current = [];
    current.current = null;
    policy.current.reset();
    setStrokeCount(0);
    redraw();
  };

  // The ink alone, cropped with a margin and redrawn on white at the size the
  // model reads at full detail.
  const exportPad = () => {
    const [w, h] = padSize();
    const box = inkBounds(strokes.current, { margin: EXPORT_MARGIN, width: w, height: h });
    if (!box) return null;
    const scale = fitScale(box.w, box.h);
    const c = document.createElement('canvas');
    c.width = Math.round(box.w * scale);
    c.height = Math.round(box.h * scale);
    const ctx = c.getContext('2d');
    paintPaper(ctx, c.width, c.height, false);
    ctx.setTransform(scale, 0, 0, scale, -box.x * scale, -box.y * scale);
    for (const pts of strokes.current) drawStroke(ctx, pts);
    return c.toDataURL('image/png');
  };

  async function transcribe(dataUrl) {
    setBusy(true);
    setStatus('กำลังอ่านลายมือ');
    try {
      const res = await fetch('/api/transcribe-handwriting', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(toBase64(dataUrl)),
        signal: AbortSignal.timeout(50000),
      });
      const data = await res.json().catch(() => null);
      if (res.status === 503) { setStatus('ยังไม่เปิดใช้บนเซิร์ฟเวอร์นี้ พิมพ์หรือพูดได้ตามเดิม'); return; }
      if (res.status === 429) { setStatus('ใช้บ่อยเกินไป รอสักครู่แล้วลองใหม่'); return; }
      if (!res.ok || typeof data?.text !== 'string') { setStatus('อ่านไม่สำเร็จ ลองอีกครั้ง'); return; }
      const text = data.text.trim();
      if (!text) { setStatus('อ่านไม่ออก ลองเขียนให้ใหญ่ขึ้น หรือถ่ายให้ชัดขึ้น'); return; }
      onTextRef.current?.(text.slice(0, maxChars));
      setStatus('ถอดแล้ว ตรวจและแก้ในช่องคำตอบได้เลย');
      clear();
    } catch {
      setStatus('เชื่อมต่อไม่ได้ ลองอีกครั้ง');
    } finally {
      setBusy(false);
    }
  }

  const convertPad = () => {
    const dataUrl = exportPad();
    if (dataUrl) transcribe(dataUrl);
  };
  const onFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    try {
      transcribe(await photoToDataUrl(file));
    } catch {
      setStatus('เปิดรูปไม่ได้');
    }
  };

  if (!open) {
    return (
      <button type="button" className="vmx-hand-toggle" onClick={() => { setOpen(true); setStatus(''); }}>
        ✍️ เขียนมือแทนพิมพ์ (นิ้ว ปากกา Apple Pencil หรือถ่ายรูปที่เขียนบนกระดาษ)
      </button>
    );
  }

  const hasInk = strokeCount > 0;
  return (
    <div className="vmx-hand" aria-label="เขียนคำตอบด้วยลายมือ">
      <p className="vmx-hand-hint">
        เขียนในกรอบด้วยนิ้ว ปากกา หรือ Apple Pencil (เมื่อใช้ปากกา ฝ่ามือที่วางบนจอจะไม่ถูกนับ) แล้วกด แปลงเป็นข้อความ — ข้อความจะไปต่อท้ายในช่องคำตอบให้ตรวจและแก้ก่อนส่ง เขียนตัวใหญ่ตามเส้นบรรทัด ทีละหนึ่งหรือสองบรรทัด อ่านได้แม่นกว่า
      </p>
      <canvas
        ref={padRef}
        className="vmx-hand-pad"
        style={{ height }}
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={up}
        onPointerCancel={up}
        onPointerLeave={up}
        onContextMenu={(e) => e.preventDefault()}
      />
      <div className="vmx-hand-actions">
        <button type="button" className="is-primary" onClick={convertPad} disabled={busy || !hasInk}>แปลงเป็นข้อความ</button>
        <button type="button" onClick={undo} disabled={busy || !hasInk}>ย้อนเส้นล่าสุด</button>
        <button type="button" onClick={clear} disabled={busy || !hasInk}>ล้าง</button>
        <label className="vmx-hand-file">
          ถ่ายรูปที่เขียนบนกระดาษ
          <input type="file" accept="image/*" capture="environment" hidden disabled={busy} onChange={onFile} />
        </label>
        <button type="button" onClick={() => setOpen(false)} disabled={busy}>ปิด</button>
        {status && <span className="vmx-hand-status" role="status">{status}</span>}
      </div>
    </div>
  );
}
