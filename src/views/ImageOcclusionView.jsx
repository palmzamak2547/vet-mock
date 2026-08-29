// ============================================================
// ImageOcclusionView — manage Image Occlusion decks
// ============================================================
// 3 sub-states:
//   • empty  — no decks yet → CTA + drop zone
//   • list   — grid of existing decks
//   • editor — ImageOcclusionEditor mounted full-screen
//
// Decks live in localStorage (`vmx-image-occlusion-decks` via
// lib/image-occlusion.js). Each mask becomes one SR card with
// type === 'image-occlusion' once the orchestrator wires it.
// ============================================================

import { lazy, Suspense, useEffect, useState, useCallback } from 'react';
import {
  loadDecks, saveDeck, deleteDeck, touchDeck,
  IMAGE_OCCLUSION_EVENT,
} from '../lib/image-occlusion.js';
import { confirmDialog } from '../lib/dialog.js';

const ImageOcclusionEditor = lazy(() => import('../components/ImageOcclusionEditor.jsx'));

function formatThaiDate(ts) {
  if (!ts) return '';
  try {
    return new Date(ts).toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' });
  } catch {
    return '';
  }
}

function DeckCard({ deck, onOpen, onDelete }) {
  return (
    <article
      style={{
        border: '1px solid var(--clr-border)',
        borderRadius: 12,
        background: 'var(--clr-surface)',
        overflow: 'hidden',
        position: 'relative',
        transition: 'transform 120ms ease, box-shadow 120ms ease',
      }}
    >
      <button
        type="button"
        onClick={() => onOpen(deck)}
        aria-label={`เปิด deck ${deck.name}, ${deck.masks?.length || 0} กล่อง`}
        style={{ all: 'unset', cursor: 'pointer', display: 'flex', flexDirection: 'column', width: '100%', color: 'inherit', fontFamily: 'inherit' }}
      >
        <span style={{
        position: 'relative',
        display: 'block',
        aspectRatio: '16 / 10',
        background: '#0a0a0a',
        overflow: 'hidden',
        }}>
        {deck.imageDataUrl ? (
          <img
            src={deck.imageDataUrl}
            alt={deck.name}
            draggable={false}
            style={{ width: '100%', height: '100%', objectFit: 'contain', pointerEvents: 'none' }}
          />
        ) : (
          <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--clr-ink-soft)' }}>
            (ไม่มีรูป)
          </span>
        )}
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
        >
          {(deck.masks || []).map((m) => (
            <rect
              key={m.id}
              x={m.x * 100}
              y={m.y * 100}
              width={m.w * 100}
              height={m.h * 100}
              fill="#4A90E2"
              fillOpacity={0.65}
              stroke="#1f63a8"
              strokeWidth={0.2}
              vectorEffect="non-scaling-stroke"
            />
          ))}
        </svg>
        </span>
        <span style={{ padding: '10px 56px 10px 12px', display: 'block', minWidth: 0 }}>
          <span style={{
            display: 'block',
            fontWeight: 600,
            fontSize: 14,
            color: 'var(--clr-ink)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}>
            {deck.name}
          </span>
          <span style={{ display: 'block', fontSize: 12, color: 'var(--clr-ink-soft)', marginTop: 2 }}>
            {(deck.masks?.length || 0)} กล่อง, {formatThaiDate(deck.createdAt)}
          </span>
        </span>
      </button>
      <button
        type="button"
        className="vmx-btn vmx-btn-ghost vmx-btn-sm"
        style={{ position: 'absolute', right: 8, bottom: 8, minHeight: 44, minWidth: 44, padding: '0 8px' }}
        onClick={() => onDelete(deck)}
        aria-label={`ลบ ${deck.name}`}
        title="ลบ deck"
      >
        🗑
      </button>
    </article>
  );
}

export default function ImageOcclusionView({ goHome /*, setView */ }) {
  const [decks, setDecks] = useState(() => loadDecks());
  const [editing, setEditing] = useState(null); // null | {} (new) | deck (existing)
  const [dragOver, setDragOver] = useState(false);
  const [toast, setToast] = useState('');

  // Re-load when another tab / component mutates the store
  useEffect(() => {
    const onChange = () => setDecks(loadDecks());
    window.addEventListener(IMAGE_OCCLUSION_EVENT, onChange);
    window.addEventListener('storage', (e) => {
      if (e.key === null || e.key === 'vmx-image-occlusion-decks') onChange();
    });
    return () => {
      window.removeEventListener(IMAGE_OCCLUSION_EVENT, onChange);
    };
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(''), 2400);
    return () => clearTimeout(t);
  }, [toast]);

  const openNew = useCallback(() => setEditing({}), []);
  const openExisting = useCallback((deck) => {
    touchDeck(deck.id);
    setEditing(deck);
  }, []);

  const handleSave = useCallback((deckPayload) => {
    const saved = saveDeck(deckPayload);
    if (!saved) {
      setToast('บันทึกไม่สำเร็จ');
      return false;
    }
    setDecks(loadDecks());
    setEditing(null);
    setToast(`บันทึก "${saved.name}" แล้ว (${saved.masks.length} กล่อง)`);
    return saved;
  }, []);

  const handleDelete = useCallback(async (deck) => {
    if (!(await confirmDialog({ title: `ลบ deck "${deck.name}"?`, note: 'ย้อนกลับไม่ได้', confirmLabel: 'ลบ deck', tone: 'danger' }))) return;
    deleteDeck(deck.id);
    setDecks(loadDecks());
    setToast(`ลบ "${deck.name}" แล้ว`);
  }, []);

  // Drag-drop on the empty zone — auto-open new editor with file
  const onDropFile = useCallback((file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setToast('ไฟล์ไม่ใช่รูป');
      return;
    }
    // Open a fresh editor; the file is pre-staged in editing._initialFile.
    // Editor reads it via FileReader on mount.
    setEditing({ _bootstrapFile: file });
  }, []);

  if (editing !== null) {
    // If user dropped a file straight into the empty zone, push that
    // through to the editor as initialFile (it reads via FileReader).
    // The editor itself accepts initialDeck = { imageDataUrl, masks }, so
    // we resolve the file-to-dataUrl here before mounting.
    return (
      <Suspense fallback={<div style={{ padding: 40, textAlign: 'center' }}>กำลังโหลด editor…</div>}>
        <EditorBootstrap
          initial={editing}
          onSave={handleSave}
          onClose={() => setEditing(null)}
        />
      </Suspense>
    );
  }

  return (
    <div
      style={{
        minHeight: '100dvh',
        paddingTop: 'env(safe-area-inset-top)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      <div style={{
        maxWidth: 1100,
        margin: '0 auto',
        padding: '14px 14px 80px',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <button
            type="button"
            className="vmx-btn vmx-btn-ghost vmx-btn-sm"
            style={{ minHeight: 44 }}
            onClick={goHome}
          >
            ← หน้าแรก
          </button>
          <div style={{ flex: 1 }}>
            <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: 'var(--clr-ink)' }}>
              Image Occlusion
            </h1>
            <div style={{ fontSize: 12, color: 'var(--clr-ink-soft)', marginTop: 2 }}>
              อัปโหลดรูป → วาดกล่องทับ label → กลายเป็น flashcard อัตโนมัติ
            </div>
          </div>
          {decks.length > 0 && (
            <button
              type="button"
              className="vmx-btn vmx-btn-sm"
              style={{ minHeight: 44 }}
              onClick={openNew}
            >
              + สร้าง deck
            </button>
          )}
        </div>

        {decks.length === 0 ? (
          // Empty state — drop zone + CTA
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              onDropFile(e.dataTransfer?.files?.[0]);
            }}
            style={{
              border: `2px dashed ${dragOver ? 'var(--clr-sage)' : 'var(--clr-border)'}`,
              borderRadius: 14,
              padding: '60px 20px',
              textAlign: 'center',
              background: dragOver ? 'var(--clr-sage-soft)' : 'var(--clr-surface)',
              color: 'var(--clr-ink-soft)',
              marginTop: 20,
            }}
          >
            <div style={{ fontSize: 48, marginBottom: 12 }}>🖼</div>
            <div style={{ fontWeight: 600, color: 'var(--clr-ink)', fontSize: 18, marginBottom: 6 }}>
              📷 สร้าง deck แรก
            </div>
            <div style={{ fontSize: 14, marginBottom: 12 }}>
              เลือกรูป หรือ ลากรูปมาวาง, รองรับ PNG / JPG / WebP / SVG
            </div>
            <button type="button" className="vmx-btn vmx-btn-primary" onClick={openNew} style={{ marginBottom: 12 }}>
              เลือกรูปและสร้าง deck
            </button>
            <div style={{ fontSize: 12, color: 'var(--clr-ink-soft)' }}>
              เหมาะกับ anatomy lateral, radiograph, histology, microbe colony plate
            </div>
          </div>
        ) : (
          // List grid
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: 14,
          }}>
            {decks.map((d) => (
              <DeckCard key={d.id} deck={d} onOpen={openExisting} onDelete={handleDelete} />
            ))}
          </div>
        )}

        <div style={{ marginTop: 20, fontSize: 12, color: 'var(--clr-ink-soft)', textAlign: 'center' }}>
          {decks.length}/30 decks, เก็บใน localStorage ของ device นี้เท่านั้น
        </div>
      </div>

      {toast && (
        <div style={{
          position: 'fixed',
          bottom: 'calc(var(--vmx-bottom-nav-h, 0px) + 24px + env(safe-area-inset-bottom))',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(0,0,0,0.85)',
          color: '#fff',
          padding: '10px 16px',
          borderRadius: 999,
          fontSize: 13,
          // Toast rung — 9999 is reserved for the skip link and loading bar.
          zIndex: 1500,
          maxWidth: '90%',
        }}>
          {toast}
        </div>
      )}
    </div>
  );
}

// ── Tiny wrapper: if the user dropped a raw File in the empty state,
//    we need to convert it to a dataUrl before mounting the editor.
//    Otherwise we pass initialDeck (existing) or undefined (new) along.
function EditorBootstrap({ initial, onSave, onClose }) {
  const [resolved, setResolved] = useState(() => {
    if (initial && initial._bootstrapFile) return null; // wait for FileReader
    return initial && initial.id ? initial : null;     // existing deck or new (null)
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (!initial || !initial._bootstrapFile) return;
    const reader = new FileReader();
    reader.onload = () => {
      setResolved({ imageDataUrl: reader.result, masks: [], name: '' });
    };
    reader.onerror = () => setError('อ่านไฟล์ไม่ได้');
    reader.readAsDataURL(initial._bootstrapFile);
  }, [initial]);

  if (error) {
    return (
      <div style={{ padding: 40, textAlign: 'center', color: 'var(--clr-rose-text)' }}>
        {error}
        <div style={{ marginTop: 12 }}>
          <button type="button" className="vmx-btn vmx-btn-ghost" onClick={onClose}>ปิด</button>
        </div>
      </div>
    );
  }

  // For a "new deck" (initial === {}), resolved stays null and we still
  // mount the editor — it just starts with no image.
  return (
    <ImageOcclusionEditor
      initialDeck={resolved}
      onSave={onSave}
      onClose={onClose}
    />
  );
}
