// A profile picture: pick a photo, frame it in a circle (drag to move, the slider or two fingers
// to zoom), and it is cropped and sent as a 512 px square (online/media.js). The animal and the
// colour stay as the fallback, and "remove" goes back to them.

import { useEffect, useRef, useState } from 'react';
import { Icon } from '../../components/Icon.jsx';
import { getBackend } from '../account.js';
import { MediaProblem, cropAvatar, loadForCrop } from '../media.js';
import { problemText } from '../shapes.js';
import '../community.css';

const VIEW = 264; // the framing square, in CSS pixels

function Cropper({ bmp, onCancel, onDone }) {
  const [zoom, setZoom] = useState(1);
  const [pos, setPos] = useState({ x: 0, y: 0 }); // offset of the image centre from the frame centre, CSS px
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const pointers = useRef(new Map());
  const pinch = useRef(null);
  // At zoom 1 the photo's short side fills the frame.
  const base = VIEW / Math.min(bmp.width, bmp.height);
  const scale = base * zoom;
  const w = bmp.width * scale;
  const h = bmp.height * scale;
  const clampPos = (p, s = scale) => {
    const mx = Math.max(0, (bmp.width * s - VIEW) / 2);
    const my = Math.max(0, (bmp.height * s - VIEW) / 2);
    return { x: Math.min(mx, Math.max(-mx, p.x)), y: Math.min(my, Math.max(-my, p.y)) };
  };
  const canvas = useRef(null);
  useEffect(() => {
    const c = canvas.current;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    c.width = VIEW * dpr;
    c.height = VIEW * dpr;
    const ctx = c.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, VIEW, VIEW);
    ctx.drawImage(bmp, VIEW / 2 - w / 2 + pos.x, VIEW / 2 - h / 2 + pos.y, w, h);
  }, [bmp, w, h, pos]);

  const setZoomTo = (z) => {
    const nz = Math.min(4, Math.max(1, z));
    setZoom(nz);
    setPos((p) => clampPos(p, base * nz));
  };
  const down = (e) => { e.currentTarget.setPointerCapture(e.pointerId); pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY }); };
  const move = (e) => {
    const prev = pointers.current.get(e.pointerId);
    if (!prev) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      const d = Math.hypot(a.x - b.x, a.y - b.y);
      if (pinch.current) setZoomTo(zoom * (d / pinch.current));
      pinch.current = d;
      return;
    }
    setPos((p) => clampPos({ x: p.x + e.clientX - prev.x, y: p.y + e.clientY - prev.y }));
  };
  const up = (e) => { pointers.current.delete(e.pointerId); if (pointers.current.size < 2) pinch.current = null; };
  const key = (e) => {
    const step = e.shiftKey ? 24 : 8;
    const moves = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] };
    if (moves[e.key]) { e.preventDefault(); setPos((p) => clampPos({ x: p.x + moves[e.key][0], y: p.y + moves[e.key][1] })); }
    if (e.key === '+' || e.key === '=') setZoomTo(zoom + 0.2);
    if (e.key === '-') setZoomTo(zoom - 0.2);
  };

  const save = async () => {
    setBusy(true);
    setError('');
    try {
      // The frame, in the photo's own pixels.
      const size = VIEW / scale;
      const x = bmp.width / 2 - pos.x / scale - size / 2;
      const y = bmp.height / 2 - pos.y / scale - size / 2;
      const file = await cropAvatar(bmp, { x, y, size });
      const b = await getBackend();
      const path = await b.media.upload('avatar', file);
      onDone(path);
    } catch (err) {
      setError(err instanceof MediaProblem ? err.message : problemText(err));
      setBusy(false);
    }
  };

  return (
    <div className="crop">
      <div className="crop-stage" role="application" aria-label="จัดรูปให้อยู่ในวงกลม ลากเพื่อเลื่อน ใช้ลูกศรหรือปุ่ม + - ก็ได้" tabIndex={0}
        onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} onKeyDown={key}
        onWheel={(e) => setZoomTo(zoom - e.deltaY * 0.002)} style={{ width: VIEW, height: VIEW }}>
        <canvas ref={canvas} style={{ width: VIEW, height: VIEW }} />
        <span className="crop-ring" aria-hidden="true" />
      </div>
      <label className="crop-zoom">
        <Icon name="image" size={16} />
        <input type="range" min="1" max="4" step="0.01" value={zoom} onChange={(e) => setZoomTo(Number(e.target.value))} aria-label="ซูม" />
        <Icon name="image" size={22} />
      </label>
      {error && <p className="form-error" role="alert">{error}</p>}
      <div className="crop-go">
        <button type="button" className="btn btn-ink" onClick={save} disabled={busy}>
          {busy ? <span className="spinner" aria-hidden="true" /> : <Icon name="check" size={18} />}ใช้รูปนี้
        </button>
        <button type="button" className="btn btn-ghost" onClick={onCancel} disabled={busy}>ยกเลิก</button>
      </div>
    </div>
  );
}

/**
 * The buttons beside the avatar: choose a photo (opens the cropper), or remove it.
 * @param {{ photo: string|null, onChange: (path: string|null) => void, onCropping?: (on: boolean) => void }} props
 */
export function PhotoPicker({ photo, onChange, onCropping }) {
  const input = useRef(null);
  const [bmp, setBmp] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  useEffect(() => { onCropping?.(!!bmp); }, [bmp]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => () => bmp?.close?.(), [bmp]);

  const pick = async (file) => {
    if (!file) return;
    setError('');
    setLoading(true);
    try { setBmp(await loadForCrop(file)); } catch (err) { setError(err instanceof MediaProblem ? err.message : 'เปิดรูปนี้ไม่ได้ ลองรูปอื่น'); }
    setLoading(false);
  };

  if (bmp) return <Cropper bmp={bmp} onCancel={() => setBmp(null)} onDone={(path) => { setBmp(null); onChange(path); }} />;
  return (
    <div className="photo-pick">
      <button type="button" className="btn btn-ghost btn-sm" onClick={() => input.current?.click()} disabled={loading}>
        {loading ? <span className="spinner" aria-hidden="true" /> : <Icon name="camera" size={18} />}{photo ? 'เปลี่ยนรูป' : 'ใส่รูปของคุณ'}
      </button>
      {photo && <button type="button" className="btn btn-ghost btn-sm" onClick={() => onChange(null)}>ใช้สัตว์แทน</button>}
      <input ref={input} type="file" accept="image/*" hidden onChange={(e) => { pick(e.target.files?.[0]); e.target.value = ''; }} />
      {error && <p className="form-error" role="alert">{error}</p>}
    </div>
  );
}
