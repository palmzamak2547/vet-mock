// ============================================================
// HandwritingInput — write by hand, get text back to edit
// ============================================================
// The written paper is handwritten. This is the optional third way in,
// beside typing and the microphone: write with a finger or a pen on the
// pad, or photograph a page written on paper, and the words appear in the
// answer box a few seconds later — as text the student checks and edits
// before submitting. Nothing about grading changes; the answer that is
// graded is the text in the box.
//
// The transcription happens on the server (/api/transcribe-handwriting,
// a vision model told to copy, never to correct). When that route is not
// configured the status says so and typing still works.
// ============================================================

import { useEffect, useRef, useState } from 'react';

const PAD_HEIGHT = 220;
const PHOTO_MAX_EDGE = 1400;
const INK = '#141414';
const PAPER = '#ffffff';

function toBase64(dataUrl) {
  const comma = dataUrl.indexOf(',');
  return { mime: dataUrl.slice(5, dataUrl.indexOf(';')), image: dataUrl.slice(comma + 1) };
}

// A photo is downsized on the device: the model reads 1400 px fine and the
// request stays small on a phone connection.
function photoToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, PHOTO_MAX_EDGE / Math.max(img.naturalWidth, img.naturalHeight));
      const c = document.createElement('canvas');
      c.width = Math.max(1, Math.round(img.naturalWidth * scale));
      c.height = Math.max(1, Math.round(img.naturalHeight * scale));
      const ctx = c.getContext('2d');
      ctx.fillStyle = PAPER;
      ctx.fillRect(0, 0, c.width, c.height);
      ctx.drawImage(img, 0, 0, c.width, c.height);
      URL.revokeObjectURL(url);
      resolve(c.toDataURL('image/jpeg', 0.82));
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('image')); };
    img.src = url;
  });
}

export default function HandwritingInput({ onText, maxChars = 1000 }) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [hasInk, setHasInk] = useState(false);
  const [status, setStatus] = useState('');
  const padRef = useRef(null);
  const drawing = useRef(false);
  const onTextRef = useRef(onText);
  useEffect(() => { onTextRef.current = onText; });

  // Size the pad to its box at device resolution once it is shown; the
  // white fill is the paper the model reads against.
  useEffect(() => {
    if (!open) return;
    const c = padRef.current;
    if (!c) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 3);
    const w = c.clientWidth || 320;
    c.width = Math.round(w * dpr);
    c.height = Math.round(PAD_HEIGHT * dpr);
    const ctx = c.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = PAPER;
    ctx.fillRect(0, 0, w, PAD_HEIGHT);
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = INK;
    setHasInk(false);
  }, [open]);

  const point = (e) => {
    const r = padRef.current.getBoundingClientRect();
    return [e.clientX - r.left, e.clientY - r.top];
  };
  const down = (e) => {
    if (busy) return;
    drawing.current = true;
    padRef.current.setPointerCapture?.(e.pointerId);
    const ctx = padRef.current.getContext('2d');
    const [x, y] = point(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + 0.1, y + 0.1);
    ctx.stroke();
    setHasInk(true);
  };
  const move = (e) => {
    if (!drawing.current) return;
    const ctx = padRef.current.getContext('2d');
    const [x, y] = point(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };
  const up = () => { drawing.current = false; };

  const clear = () => {
    const c = padRef.current;
    if (!c) return;
    const ctx = c.getContext('2d');
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = PAPER;
    ctx.fillRect(0, 0, c.width, c.height);
    ctx.restore();
    setHasInk(false);
  };

  async function transcribe(dataUrl) {
    setBusy(true);
    setStatus('กำลังอ่านลายมือ');
    try {
      const res = await fetch('/api/transcribe-handwriting', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(toBase64(dataUrl)),
        signal: AbortSignal.timeout(35000),
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
    if (!padRef.current || !hasInk) return;
    transcribe(padRef.current.toDataURL('image/png'));
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
        ✍️ เขียนมือแทนพิมพ์ (เขียนบนหน้าจอ หรือถ่ายรูปที่เขียนบนกระดาษ)
      </button>
    );
  }

  return (
    <div className="vmx-hand" aria-label="เขียนคำตอบด้วยลายมือ">
      <p className="vmx-hand-hint">
        เขียนด้วยนิ้วหรือปากกาในกรอบ แล้วกด แปลงเป็นข้อความ — ข้อความจะไปต่อท้ายในช่องคำตอบให้ตรวจและแก้ก่อนส่ง เขียนทีละบรรทัดหรือสองบรรทัดจะอ่านได้แม่นกว่า
      </p>
      <canvas
        ref={padRef}
        className="vmx-hand-pad"
        style={{ height: PAD_HEIGHT }}
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={up}
        onPointerCancel={up}
        onPointerLeave={up}
      />
      <div className="vmx-hand-actions">
        <button type="button" className="is-primary" onClick={convertPad} disabled={busy || !hasInk}>แปลงเป็นข้อความ</button>
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
