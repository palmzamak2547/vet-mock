// ============================================================
// ImageOcclusionEditor — draw rectangles over an uploaded image
// ============================================================
// One-deck editor. User uploads an image (or it's already on the
// initialDeck), draws / moves / resizes rectangles, and types a
// short label + full answer per rectangle.
//
// Rendering: <img> as background + absolutely-positioned SVG
// overlay for masks. Coordinates are stored NORMALIZED [0..1] so
// the same deck renders correctly across viewport widths.
//
// Pointer events (not touch / mouse) so pen + finger + mouse all
// work the same way. touch-action: none on the canvas so a stroke
// doesn't accidentally scroll the page.
// ============================================================

import { useEffect, useRef, useState, useCallback } from 'react';
import { genMaskId } from '../lib/image-occlusion.js';
import { useModalFocus } from '../hooks/useModalFocus.js';

const ACCEPT_TYPES = 'image/png,image/jpeg,image/jpg,image/webp,image/svg+xml';
const WARN_SIZE_BYTES = 2 * 1024 * 1024; // 2 MB → warn but allow
const HANDLE_PX = 12; // resize-handle hit target (visual is smaller)
const HIT_PAD = 6; // extra slop around handles for touch users

// 8 resize handles + 1 body drag. Handle key encodes which edges move.
const HANDLES = [
  { k: 'nw', cx: 0,    cy: 0    },
  { k: 'n',  cx: 0.5,  cy: 0    },
  { k: 'ne', cx: 1,    cy: 0    },
  { k: 'e',  cx: 1,    cy: 0.5  },
  { k: 'se', cx: 1,    cy: 1    },
  { k: 's',  cx: 0.5,  cy: 1    },
  { k: 'sw', cx: 0,    cy: 1    },
  { k: 'w',  cx: 0,    cy: 0.5  },
];

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result);
    r.onerror = () => reject(r.error || new Error('read failed'));
    r.readAsDataURL(file);
  });
}

export default function ImageOcclusionEditor({ initialDeck, onSave, onClose }) {
  const [name, setName] = useState(initialDeck?.name || '');
  const [imageDataUrl, setImageDataUrl] = useState(initialDeck?.imageDataUrl || '');
  const [masks, setMasks] = useState(() => (initialDeck?.masks || []).map((m) => ({ ...m })));
  const [selectedId, setSelectedId] = useState(null);
  const [tool, setTool] = useState('select'); // 'select' | 'rect'
  const [dragOver, setDragOver] = useState(false);
  const [toast, setToast] = useState('');

  const canvasRef = useRef(null);
  const imgRef = useRef(null);
  const fileInputRef = useRef(null);
  const drag = useRef(null); // { kind: 'create' | 'move' | 'resize', maskId?, handle?, startX, startY, startMask }
  const dialogRef = useModalFocus({ onClose });

  // Toast auto-dismiss
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(''), 2400);
    return () => clearTimeout(t);
  }, [toast]);

  // Keyboard shortcuts — backspace to delete selected, esc to deselect
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setSelectedId(null);
        return;
      }
      if ((e.key === 'Backspace' || e.key === 'Delete') && selectedId) {
        // Only when the focus isn't inside an input/textarea
        const tag = (e.target?.tagName || '').toLowerCase();
        if (tag === 'input' || tag === 'textarea') return;
        e.preventDefault();
        setMasks((m) => m.filter((x) => x.id !== selectedId));
        setSelectedId(null);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selectedId]);

  const onFile = useCallback(async (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setToast('ไฟล์ไม่ใช่รูป — รองรับ PNG / JPG / WebP / SVG');
      return;
    }
    if (file.size > WARN_SIZE_BYTES) {
      setToast(`รูปใหญ่ ${(file.size / 1024 / 1024).toFixed(1)} MB — อาจช้าหรือเต็มที่เก็บข้อมูล`);
    }
    try {
      const dataUrl = await readFileAsDataUrl(file);
      setImageDataUrl(dataUrl);
      // Reset masks when image swaps — coordinates are normalized but
      // user almost certainly wants to re-mark from scratch.
      if (initialDeck?.imageDataUrl && initialDeck.imageDataUrl !== dataUrl) {
        setMasks([]);
      }
    } catch {
      setToast('อ่านไฟล์ไม่ได้');
    }
  }, [initialDeck]);

  // Drag-drop on the canvas zone
  const onDragOver = (e) => { e.preventDefault(); setDragOver(true); };
  const onDragLeave = () => setDragOver(false);
  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer?.files?.[0];
    if (file) onFile(file);
  };

  const selectedMask = masks.find((m) => m.id === selectedId) || null;

  // Pointer-to-normalized coords
  const pointerToNorm = useCallback((ev) => {
    const el = canvasRef.current;
    if (!el) return { x: 0, y: 0 };
    const r = el.getBoundingClientRect();
    return {
      x: Math.max(0, Math.min(1, (ev.clientX - r.left) / r.width)),
      y: Math.max(0, Math.min(1, (ev.clientY - r.top) / r.height)),
    };
  }, []);

  const onPointerDown = (e) => {
    if (!imageDataUrl) return;
    const target = e.target;
    const role = target?.dataset?.role; // 'handle' | 'mask' | undefined
    const p = pointerToNorm(e);

    if (role === 'handle') {
      const maskId = target.dataset.mask;
      const handle = target.dataset.handle;
      const m = masks.find((x) => x.id === maskId);
      if (!m) return;
      e.preventDefault();
      try { target.setPointerCapture(e.pointerId); } catch { /* no-op */ }
      drag.current = { kind: 'resize', maskId, handle, startX: p.x, startY: p.y, startMask: { ...m } };
      setSelectedId(maskId);
      return;
    }

    if (role === 'mask') {
      const maskId = target.dataset.mask;
      const m = masks.find((x) => x.id === maskId);
      if (!m) return;
      e.preventDefault();
      try { canvasRef.current.setPointerCapture(e.pointerId); } catch { /* no-op */ }
      drag.current = { kind: 'move', maskId, startX: p.x, startY: p.y, startMask: { ...m } };
      setSelectedId(maskId);
      return;
    }

    // Empty canvas — depending on tool either deselect or start a new rect.
    if (tool === 'rect') {
      e.preventDefault();
      const id = genMaskId();
      const newMask = { id, x: p.x, y: p.y, w: 0, h: 0, label: '', answer: '' };
      try { canvasRef.current.setPointerCapture(e.pointerId); } catch { /* no-op */ }
      setMasks((prev) => [...prev, newMask]);
      setSelectedId(id);
      drag.current = { kind: 'create', maskId: id, startX: p.x, startY: p.y };
    } else {
      setSelectedId(null);
    }
  };

  const onPointerMove = (e) => {
    const d = drag.current;
    if (!d) return;
    e.preventDefault();
    const p = pointerToNorm(e);
    const dx = p.x - d.startX;
    const dy = p.y - d.startY;

    setMasks((prev) => prev.map((m) => {
      if (m.id !== d.maskId) return m;
      if (d.kind === 'create') {
        return {
          ...m,
          x: Math.min(d.startX, p.x),
          y: Math.min(d.startY, p.y),
          w: Math.abs(p.x - d.startX),
          h: Math.abs(p.y - d.startY),
        };
      }
      if (d.kind === 'move') {
        const w = d.startMask.w;
        const h = d.startMask.h;
        return {
          ...m,
          x: Math.max(0, Math.min(1 - w, d.startMask.x + dx)),
          y: Math.max(0, Math.min(1 - h, d.startMask.y + dy)),
        };
      }
      if (d.kind === 'resize') {
        let { x, y, w, h } = d.startMask;
        const k = d.handle;
        if (k.includes('e')) w = Math.max(0.005, d.startMask.w + dx);
        if (k.includes('s')) h = Math.max(0.005, d.startMask.h + dy);
        if (k.includes('w')) {
          const nx = Math.min(d.startMask.x + dx, d.startMask.x + d.startMask.w - 0.005);
          w = d.startMask.x + d.startMask.w - nx;
          x = nx;
        }
        if (k.includes('n')) {
          const ny = Math.min(d.startMask.y + dy, d.startMask.y + d.startMask.h - 0.005);
          h = d.startMask.y + d.startMask.h - ny;
          y = ny;
        }
        x = Math.max(0, Math.min(1, x));
        y = Math.max(0, Math.min(1, y));
        w = Math.max(0.005, Math.min(1 - x, w));
        h = Math.max(0.005, Math.min(1 - y, h));
        return { ...m, x, y, w, h };
      }
      return m;
    }));
  };

  const onPointerUp = (e) => {
    const d = drag.current;
    if (!d) return;
    drag.current = null;
    // Drop too-small "accidental" rects from create gesture
    if (d.kind === 'create') {
      setMasks((prev) => {
        const m = prev.find((x) => x.id === d.maskId);
        if (m && (m.w < 0.01 || m.h < 0.01)) {
          setSelectedId(null);
          return prev.filter((x) => x.id !== d.maskId);
        }
        return prev;
      });
    }
    try { canvasRef.current?.releasePointerCapture?.(e.pointerId); } catch { /* no-op */ }
  };

  const updateMask = (id, patch) => {
    setMasks((prev) => prev.map((m) => (m.id === id ? { ...m, ...patch } : m)));
  };

  const deleteMask = (id) => {
    setMasks((prev) => prev.filter((m) => m.id !== id));
    if (selectedId === id) setSelectedId(null);
  };

  const handleSave = () => {
    if (!imageDataUrl) {
      setToast('ยังไม่มีรูป — กดอัปโหลดก่อน');
      return;
    }
    // Drop masks with no answer text — saving a blank rect is almost
    // certainly a mistake. Keep ones with at least answer OR label.
    const valid = masks.filter((m) => (m.answer || m.label || '').trim());
    if (!valid.length) {
      setToast('ยังไม่มีกล่องที่กรอกคำตอบ');
      return;
    }
    const trimmedName = name.trim() || 'Deck ' + new Date().toLocaleDateString('th-TH');
    const saved = onSave?.({
      ...(initialDeck || {}),
      name: trimmedName,
      imageDataUrl,
      masks: valid.map((m) => ({
        id: m.id,
        x: m.x,
        y: m.y,
        w: m.w,
        h: m.h,
        label: (m.label || '').trim(),
        answer: (m.answer || '').trim(),
      })),
    });
    if (saved === false) setToast('บันทึกไม่สำเร็จ');
  };

  return (
    <div
      className="vmx-modal-overlay"
      style={{ alignItems: 'flex-start', padding: 'env(safe-area-inset-top) 0 env(safe-area-inset-bottom)', overflow: 'auto' }}
    >
      <div
        ref={dialogRef}
        className="vmx-modal"
        style={{
          maxWidth: 980,
          width: '96%',
          margin: '12px auto',
          padding: 14,
          maxHeight: 'none',
        }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="แก้ไข Image Occlusion deck"
        tabIndex={-1}
        data-vmx-modal="true"
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
          <input
            type="text"
            aria-label="ชื่อ Image Occlusion deck"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="ชื่อ deck (เช่น Cardiac anatomy lateral)"
            style={{
              flex: '1 1 200px',
              minWidth: 0,
              padding: '8px 10px',
              borderRadius: 8,
              border: '1px solid var(--clr-border)',
              background: 'var(--clr-surface)',
              color: 'var(--clr-ink)',
              fontSize: 15,
            }}
          />
          <button type="button" className="vmx-btn vmx-btn-ghost vmx-btn-sm" style={{ minHeight: 44 }} onClick={onClose}>
            ✕ ปิด
          </button>
          <button type="button" className="vmx-btn vmx-btn-sm" style={{ minHeight: 44 }} onClick={handleSave}>
            ✓ บันทึก
          </button>
        </div>

        {/* Toolbar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
          <input
            ref={fileInputRef}
            type="file"
            accept={ACCEPT_TYPES}
            onChange={(e) => onFile(e.target.files?.[0])}
            style={{ display: 'none' }}
          />
          <button
            type="button"
            className="vmx-btn vmx-btn-ghost vmx-btn-sm"
            style={{ minHeight: 44 }}
            onClick={() => fileInputRef.current?.click()}
          >
            📷 {imageDataUrl ? 'เปลี่ยนรูป' : 'อัปโหลดรูป'}
          </button>
          <button
            type="button"
            className={`vmx-btn vmx-btn-sm ${tool === 'select' ? '' : 'vmx-btn-ghost'}`}
            style={{ minHeight: 44 }}
            onClick={() => setTool('select')}
            title="เลือก / ย้าย / ปรับขนาด"
          >
            ↖ เลือก
          </button>
          <button
            type="button"
            className={`vmx-btn vmx-btn-sm ${tool === 'rect' ? '' : 'vmx-btn-ghost'}`}
            style={{ minHeight: 44 }}
            onClick={() => setTool('rect')}
            title="ลากเพื่อสร้างกล่อง"
          >
            🟦 วาดกล่อง
          </button>
          <button
            type="button"
            className="vmx-btn vmx-btn-ghost vmx-btn-sm"
            style={{ minHeight: 44 }}
            disabled={!selectedId}
            onClick={() => selectedId && deleteMask(selectedId)}
          >
            ลบกล่อง
          </button>
          <span style={{ flex: 1 }} />
          <span style={{ fontSize: 12, color: 'var(--clr-ink-soft)' }}>
            {masks.length} กล่อง
          </span>
        </div>

        {/* Canvas area */}
        {!imageDataUrl ? (
          <div
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            onClick={() => fileInputRef.current?.click()}
            style={{
              border: `2px dashed ${dragOver ? 'var(--clr-sage)' : 'var(--clr-border)'}`,
              borderRadius: 12,
              padding: '60px 20px',
              textAlign: 'center',
              cursor: 'pointer',
              background: dragOver ? 'var(--clr-sage-soft)' : 'var(--clr-surface)',
              color: 'var(--clr-ink-soft)',
            }}
          >
            <div style={{ fontSize: 36, marginBottom: 8 }}>📷</div>
            <div style={{ fontWeight: 600, color: 'var(--clr-ink)', marginBottom: 4 }}>
              อัปโหลดรูป
            </div>
            <div style={{ fontSize: 13 }}>คลิก หรือ ลากไฟล์มาวาง, PNG / JPG / WebP / SVG</div>
          </div>
        ) : (
          <div
            ref={canvasRef}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            style={{
              position: 'relative',
              width: '100%',
              borderRadius: 10,
              overflow: 'hidden',
              background: '#000',
              touchAction: 'none',
              userSelect: 'none',
              cursor: tool === 'rect' ? 'crosshair' : 'default',
            }}
          >
            <img
              ref={imgRef}
              src={imageDataUrl}
              alt=""
              draggable={false}
              style={{ display: 'block', width: '100%', height: 'auto', pointerEvents: 'none' }}
            />
            <svg
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
              }}
            >
              {masks.map((m) => {
                const isSel = m.id === selectedId;
                return (
                  <g key={m.id}>
                    <rect
                      data-role="mask"
                      data-mask={m.id}
                      x={m.x * 100}
                      y={m.y * 100}
                      width={m.w * 100}
                      height={m.h * 100}
                      fill={isSel ? '#F39C12' : '#4A90E2'}
                      fillOpacity={isSel ? 0.55 : 0.7}
                      stroke={isSel ? '#F39C12' : '#1f63a8'}
                      strokeWidth={isSel ? 0.35 : 0.2}
                      vectorEffect="non-scaling-stroke"
                      style={{ pointerEvents: 'auto', cursor: 'move' }}
                    />
                    {isSel && HANDLES.map((h) => {
                      const cx = (m.x + m.w * h.cx) * 100;
                      const cy = (m.y + m.h * h.cy) * 100;
                      const cursor = (
                        h.k === 'n' || h.k === 's' ? 'ns-resize' :
                        h.k === 'e' || h.k === 'w' ? 'ew-resize' :
                        h.k === 'ne' || h.k === 'sw' ? 'nesw-resize' :
                        'nwse-resize'
                      );
                      return (
                        <rect
                          key={h.k}
                          data-role="handle"
                          data-mask={m.id}
                          data-handle={h.k}
                          x={cx - 1.3}
                          y={cy - 1.3}
                          width={2.6}
                          height={2.6}
                          fill="#fff"
                          stroke="#F39C12"
                          strokeWidth={0.3}
                          vectorEffect="non-scaling-stroke"
                          style={{ pointerEvents: 'auto', cursor }}
                        />
                      );
                    })}
                  </g>
                );
              })}
            </svg>
            {dragOver && (
              <div style={{
                position: 'absolute', inset: 0, background: 'rgba(74,107,74,0.18)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontWeight: 700, fontSize: 18,
                pointerEvents: 'none',
              }}>
                วางไฟล์เพื่อเปลี่ยนรูป
              </div>
            )}
          </div>
        )}

        {/* Selected-mask editor */}
        {selectedMask && (
          <div style={{
            marginTop: 12,
            padding: 12,
            borderRadius: 10,
            background: 'var(--clr-surface-2, var(--clr-surface))',
            border: '1px solid var(--clr-border)',
          }}>
            <div style={{ fontSize: 12, color: 'var(--clr-ink-soft)', marginBottom: 6, fontFamily: 'var(--vmx-mono)' }}>
              กล่องที่เลือก
            </div>
            <input
              type="text"
              aria-label="ชื่อกล่องที่เลือก"
              value={selectedMask.label}
              onChange={(e) => updateMask(selectedMask.id, { label: e.target.value })}
              placeholder="Label (สั้น เช่น 'A1', 'aorta')"
              style={{
                width: '100%',
                padding: '8px 10px',
                borderRadius: 8,
                border: '1px solid var(--clr-border)',
                background: 'var(--clr-surface)',
                color: 'var(--clr-ink)',
                fontSize: 14,
                marginBottom: 8,
              }}
            />
            <textarea
              aria-label="คำตอบของกล่องที่เลือก"
              value={selectedMask.answer}
              onChange={(e) => updateMask(selectedMask.id, { answer: e.target.value })}
              placeholder="คำตอบเต็ม (เช่น 'aortic arch — left subclavian origin')"
              rows={2}
              style={{
                width: '100%',
                padding: '8px 10px',
                borderRadius: 8,
                border: '1px solid var(--clr-border)',
                background: 'var(--clr-surface)',
                color: 'var(--clr-ink)',
                fontSize: 14,
                resize: 'vertical',
                fontFamily: 'inherit',
              }}
            />
          </div>
        )}

        {/* Mask list (mobile-friendly fallback) */}
        {masks.length > 0 && (
          <details style={{ marginTop: 10 }}>
            <summary style={{ fontSize: 13, color: 'var(--clr-ink-soft)', cursor: 'pointer' }}>
              รายการกล่อง ({masks.length})
            </summary>
            <ul style={{ listStyle: 'none', padding: 0, margin: '8px 0 0' }}>
              {masks.map((m, i) => (
                <li
                  key={m.id}
                  onClick={() => setSelectedId(m.id)}
                  style={{
                    padding: '8px 10px',
                    borderRadius: 8,
                    border: '1px solid var(--clr-border)',
                    marginBottom: 6,
                    cursor: 'pointer',
                    background: m.id === selectedId ? 'var(--clr-sage-soft)' : 'transparent',
                    fontSize: 13,
                  }}
                >
                  <strong>#{i + 1}</strong>, {m.label || '(no label)'} → {m.answer || <em style={{ color: 'var(--clr-rose-text)' }}>(ยังไม่มีคำตอบ)</em>}
                </li>
              ))}
            </ul>
          </details>
        )}

        {toast && (
          <div style={{
            position: 'fixed',
            bottom: 'calc(24px + env(safe-area-inset-bottom))',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(0,0,0,0.85)',
            color: '#fff',
            padding: '10px 16px',
            borderRadius: 999,
            fontSize: 13,
            zIndex: 9999,
            maxWidth: '90%',
          }}>
            {toast}
          </div>
        )}
      </div>
    </div>
  );
}
