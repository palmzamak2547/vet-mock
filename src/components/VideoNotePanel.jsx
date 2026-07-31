// ============================================================
// VideoNotePanel.jsx — audio-synced notes for a YouTube lecture.
//
// Notes are time-stamped to the video. Each row is clickable and
// seeks the YT.Player to that timestamp. Survives reloads via
// localStorage (see ../lib/video-notes.js).
//
// Props:
//   videoId      — YT video ID (string). Panel re-loads when it changes.
//   playerRef    — React ref to a YT.Player instance owned by VideoView.
//   currentTime  — Number, seconds. VideoView polls every 500ms.
// ============================================================

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  loadNotes,
  addNote,
  updateNote,
  deleteNote,
  formatTimestamp,
} from '../lib/video-notes.js';
import { confirmDialog } from '../lib/dialog.js';

export default function VideoNotePanel({ videoId, playerRef, currentTime }) {
  const [notes, setNotes] = useState(() => (videoId ? loadNotes(videoId) : []));
  const [composing, setComposing] = useState(false); // showing the new-note textarea
  const [composeText, setComposeText] = useState('');
  const [composeT, setComposeT] = useState(0);
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState('');
  const [showFab, setShowFab] = useState(false);

  const panelRef = useRef(null);
  const composeRef = useRef(null);
  const editRef = useRef(null);

  // Reload when video changes
  useEffect(() => {
    setNotes(videoId ? loadNotes(videoId) : []);
    setComposing(false);
    setEditingId(null);
  }, [videoId]);

  // Focus the textarea when it opens
  useEffect(() => { if (composing && composeRef.current) composeRef.current.focus(); }, [composing]);
  useEffect(() => { if (editingId != null && editRef.current) editRef.current.focus(); }, [editingId]);

  // Show floating FAB once the panel header has scrolled out of view
  useEffect(() => {
    if (!panelRef.current) return;
    const el = panelRef.current;
    const io = new IntersectionObserver(
      ([entry]) => setShowFab(!entry.isIntersecting),
      { root: null, threshold: 0, rootMargin: '-40px 0px 0px 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [videoId]);

  // Which note is "playing right now" — the latest note whose t <= currentTime.
  const playingId = useMemo(() => {
    if (!notes.length) return null;
    let pick = null;
    for (const n of notes) {
      if (n.t <= currentTime) pick = n;
      else break;
    }
    return pick ? pick.id : null;
  }, [notes, currentTime]);

  // Read a fresh timestamp from the YT player at the moment of click.
  // Falls back to the polled `currentTime` if the player ref isn't ready.
  const grabT = useCallback(() => {
    try {
      const p = playerRef && playerRef.current;
      if (p && typeof p.getCurrentTime === 'function') {
        const t = p.getCurrentTime();
        if (typeof t === 'number' && !Number.isNaN(t)) return t;
      }
    } catch {}
    return currentTime || 0;
  }, [playerRef, currentTime]);

  const seekTo = useCallback((t) => {
    try {
      const p = playerRef && playerRef.current;
      if (p && typeof p.seekTo === 'function') {
        p.seekTo(t, true);
        if (typeof p.playVideo === 'function') p.playVideo();
      }
    } catch {}
  }, [playerRef]);

  const openCompose = () => {
    setComposeT(grabT());
    setComposeText('');
    setComposing(true);
  };

  const cancelCompose = () => {
    setComposing(false);
    setComposeText('');
  };

  const saveCompose = () => {
    const text = composeText.trim();
    if (!text) { cancelCompose(); return; }
    addNote(videoId, composeT, text);
    setNotes(loadNotes(videoId));
    setComposing(false);
    setComposeText('');
  };

  const beginEdit = (note) => {
    setEditingId(note.id);
    setEditingText(note.text);
  };
  const cancelEdit = () => {
    setEditingId(null);
    setEditingText('');
  };
  const saveEdit = () => {
    if (editingId == null) return;
    const text = editingText.trim();
    if (!text) {
      // Empty → just close, leave the original alone.
      cancelEdit();
      return;
    }
    updateNote(videoId, editingId, text);
    setNotes(loadNotes(videoId));
    cancelEdit();
  };

  const removeNote = async (id) => {
    if (!(await confirmDialog({ title: 'ลบโน้ตนี้?', confirmLabel: 'ลบ', tone: 'danger' }))) return;
    deleteNote(videoId, id);
    setNotes(loadNotes(videoId));
  };

  if (!videoId) return null;

  const rowBase = {
    display: 'flex', alignItems: 'flex-start', gap: 8, padding: '8px 10px',
    borderRadius: 8, border: '1px solid var(--clr-border)',
    background: 'var(--clr-bg)',
    minHeight: 44,
  };
  const tsBtn = {
    flexShrink: 0, minWidth: 64, minHeight: 36,
    padding: '4px 8px', borderRadius: 6,
    fontFamily: 'var(--vmx-mono)', fontSize: 12, fontWeight: 600,
    background: 'var(--clr-surface-2)', color: 'var(--clr-sage)',
    border: '1px solid var(--clr-border)', cursor: 'pointer',
  };

  return (
    <div
      ref={panelRef}
      style={{
        marginTop: 16,
        padding: 14,
        borderRadius: 12,
        background: 'var(--clr-surface-2)',
        border: '1px solid var(--clr-border)',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 10 }}>
        <div style={{ flex: 1, minWidth: 160, fontSize: 14, fontWeight: 600, color: 'var(--clr-ink)' }}>
          โน้ตของคุณ <span style={{ fontFamily: 'var(--vmx-mono)', fontSize: 12, color: 'var(--clr-ink-soft)', fontWeight: 400, marginLeft: 4 }}>({notes.length})</span>
        </div>
        <button
          className="vmx-btn vmx-btn-primary vmx-btn-sm"
          onClick={openCompose}
          disabled={composing}
          style={{ minHeight: 36 }}
          title="จดโน้ตที่ตำแหน่งปัจจุบันของวิดีโอ"
        >
          + จด ณ เวลานี้
        </button>
      </div>

      {/* Compose row */}
      {composing && (
        <div style={{ ...rowBase, flexDirection: 'column', alignItems: 'stretch', marginBottom: 10, gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ ...tsBtn, cursor: 'default' }}>{formatTimestamp(composeT)}</span>
            <span style={{ fontSize: 11, color: 'var(--clr-ink-soft)', fontFamily: 'var(--vmx-mono)' }}>
             , timestamp ตอนกดปุ่ม
            </span>
          </div>
          <textarea
            ref={composeRef}
            value={composeText}
            onChange={(e) => setComposeText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); saveCompose(); }
              else if (e.key === 'Escape') { e.preventDefault(); cancelCompose(); }
            }}
            placeholder="พิมพ์โน้ต… (Enter = save, Shift+Enter = ขึ้นบรรทัด, Esc = ยกเลิก)"
            rows={2}
            style={{
              width: '100%', padding: '8px 10px', fontSize: 13,
              borderRadius: 6, border: '1px solid var(--clr-border)',
              background: 'var(--clr-bg)', color: 'var(--clr-ink)',
              fontFamily: 'inherit', resize: 'vertical', minHeight: 60,
            }}
          />
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <button className="vmx-btn vmx-btn-ghost vmx-btn-sm" onClick={cancelCompose} style={{ minHeight: 36 }}>ยกเลิก</button>
            <button className="vmx-btn vmx-btn-primary vmx-btn-sm" onClick={saveCompose} disabled={!composeText.trim()} style={{ minHeight: 36 }}>บันทึก</button>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!notes.length && !composing && (
        <div style={{ padding: '14px 10px', fontSize: 13, color: 'var(--clr-ink-soft)', textAlign: 'center', lineHeight: 1.6 }}>
          ยังไม่มีโน้ต — กด <strong>+ จด ณ เวลานี้</strong> เพื่อจดในจังหวะที่สำคัญ
        </div>
      )}

      {/* Note list */}
      {notes.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {notes.map((n) => {
            const isPlaying = n.id === playingId;
            const isEditing = n.id === editingId;
            return (
              <div
                key={n.id}
                style={{
                  ...rowBase,
                  borderColor: isPlaying ? 'var(--clr-sage)' : 'var(--clr-border)',
                  boxShadow: isPlaying ? '0 0 0 1px var(--clr-sage)' : 'none',
                }}
              >
                <button
                  onClick={() => seekTo(n.t)}
                  style={tsBtn}
                  title="กระโดดไปจุดนี้ในวิดีโอ"
                >
                  {formatTimestamp(n.t)}
                </button>

                {isEditing ? (
                  <textarea
                    ref={editRef}
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    onBlur={saveEdit}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); saveEdit(); }
                      else if (e.key === 'Escape') { e.preventDefault(); cancelEdit(); }
                    }}
                    rows={2}
                    style={{
                      flex: 1, minWidth: 0, padding: '6px 8px', fontSize: 13,
                      borderRadius: 6, border: '1px solid var(--clr-border)',
                      background: 'var(--clr-bg)', color: 'var(--clr-ink)',
                      fontFamily: 'inherit', resize: 'vertical',
                    }}
                  />
                ) : (
                  <div
                    onClick={() => beginEdit(n)}
                    style={{
                      flex: 1, minWidth: 0, fontSize: 13, lineHeight: 1.5,
                      color: 'var(--clr-ink)', whiteSpace: 'pre-wrap', wordBreak: 'break-word',
                      cursor: 'text', padding: '6px 4px', minHeight: 32,
                    }}
                    title="คลิกเพื่อแก้ไข"
                  >
                    {n.text}
                  </div>
                )}

                {isPlaying && (
                  <span
                    title="กำลังเล่นช่วงนี้"
                    style={{
                      flexShrink: 0, fontSize: 10, fontWeight: 700,
                      color: 'var(--clr-sage)', fontFamily: 'var(--vmx-mono)',
                      alignSelf: 'center', letterSpacing: '0.06em',
                    }}
                  >
                    ● PLAYING
                  </span>
                )}

                <button
                  onClick={() => removeNote(n.id)}
                  className="vmx-btn vmx-btn-ghost vmx-btn-sm"
                  style={{ flexShrink: 0, minWidth: 36, minHeight: 36, padding: '4px 8px' }}
                  title="ลบโน้ต"
                  aria-label="ลบโน้ต"
                >
                  🗑
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Floating "+ จด" — shows once the header has scrolled out of view */}
      {showFab && !composing && (
        <button
          onClick={openCompose}
          aria-label="จดโน้ต ณ เวลานี้"
          style={{
            position: 'fixed',
            right: 'calc(env(safe-area-inset-right, 0px) + 18px)',
            bottom: 'calc(env(safe-area-inset-bottom, 0px) + 18px)',
            zIndex: 1000,
            minWidth: 56, minHeight: 56,
            padding: '0 18px',
            borderRadius: 28,
            border: 'none',
            background: 'var(--clr-sage)',
            color: 'white',
            fontSize: 14, fontWeight: 600,
            boxShadow: '0 6px 20px rgba(0,0,0,0.25)',
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 6,
          }}
        >
          + จด
        </button>
      )}
    </div>
  );
}
