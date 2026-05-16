// ============================================================
// PinboardView — personal study workspace
// ============================================================
//
// Shows all pinned items (Qs, video summaries, flashcards, per-Q notes)
// as a responsive grid. Click a card to navigate to its source view;
// 🗑 to remove that pin; filter chips by type; "🗑 ล้างทั้งหมด" wipes
// all (with confirm).
//
// Props (any subset App passes is fine):
//   goHome              () => void
//   setView             (view) => void
//   setSubject          (subjectId) => void
//   setPracticeMode     (mode) => void

import { useEffect, useMemo, useState, useCallback } from 'react';
import { loadPins, removePin, clearPinboard, PINBOARD_EVENT, PINBOARD_MAX } from '../lib/pinboard.js';

const TYPE_META = {
  question:  { label: 'ข้อสอบ',     icon: '❓', color: '#c26d6d' },
  summary:   { label: 'สรุปคลิป',    icon: '🎬', color: '#4a6b4a' },
  flashcard: { label: 'Flashcard',  icon: '🃏', color: '#7d4a7d' },
  note:      { label: 'โน้ตข้อ',     icon: '📝', color: '#c8a64b' },
};

// Thai relative time. Falls back to a manual format if RTF is missing.
let _rtf = null;
function relTime(ts) {
  if (!ts) return '';
  const now = Date.now();
  const diffSec = Math.round((ts - now) / 1000);
  try {
    if (!_rtf) _rtf = new Intl.RelativeTimeFormat('th', { numeric: 'auto' });
    const abs = Math.abs(diffSec);
    if (abs < 60)       return _rtf.format(Math.round(diffSec), 'second');
    if (abs < 3600)     return _rtf.format(Math.round(diffSec / 60), 'minute');
    if (abs < 86400)    return _rtf.format(Math.round(diffSec / 3600), 'hour');
    if (abs < 2592000)  return _rtf.format(Math.round(diffSec / 86400), 'day');
    if (abs < 31536000) return _rtf.format(Math.round(diffSec / 2592000), 'month');
    return _rtf.format(Math.round(diffSec / 31536000), 'year');
  } catch {
    const d = new Date(ts);
    return d.toLocaleDateString('th-TH');
  }
}

function snippetFor(pin) {
  const p = pin.payload || {};
  switch (pin.type) {
    case 'question':  return p.stem || p.q || '';
    case 'summary':   return [p.subject?.toUpperCase?.(), p.instructor, p.date].filter(Boolean).join(' · ');
    case 'flashcard': return p.back || p.front || '';
    case 'note':      return p.snapshot || p.text || '';
    default:          return '';
  }
}

export default function PinboardView({ goHome, setView, setSubject, setPracticeMode }) {
  const [pins, setPins] = useState(() => loadPins());
  const [filter, setFilter] = useState('all');

  // Re-load when another component (PinButton in Question.jsx,
  // SummaryModal) mutates the store.
  useEffect(() => {
    const onChange = () => setPins(loadPins());
    window.addEventListener(PINBOARD_EVENT, onChange);
    return () => window.removeEventListener(PINBOARD_EVENT, onChange);
  }, []);

  const filtered = useMemo(() => {
    if (filter === 'all') return pins;
    return pins.filter((p) => p.type === filter);
  }, [pins, filter]);

  const counts = useMemo(() => {
    const c = { all: pins.length, question: 0, summary: 0, flashcard: 0, note: 0 };
    for (const p of pins) c[p.type] = (c[p.type] || 0) + 1;
    return c;
  }, [pins]);

  const onOpen = useCallback((pin) => {
    const p = pin.payload || {};
    switch (pin.type) {
      case 'question': {
        if (p.subject && typeof setSubject === 'function') setSubject(p.subject);
        if (typeof setPracticeMode === 'function') setPracticeMode('bookmarks');
        if (typeof setView === 'function') setView('config');
        return;
      }
      case 'note': {
        if (p.subject && typeof setSubject === 'function') setSubject(p.subject);
        if (typeof setPracticeMode === 'function') setPracticeMode('bookmarks');
        if (typeof setView === 'function') setView('config');
        return;
      }
      case 'summary': {
        // v1 — drop the user on the videos list; they tap the card
        // to re-open the summary modal themselves. Deep-link is
        // intentionally deferred (no shared video registry yet).
        if (typeof setView === 'function') setView('videos');
        return;
      }
      case 'flashcard': {
        if (typeof setView === 'function') setView('sr-session');
        return;
      }
      default: return;
    }
  }, [setView, setSubject, setPracticeMode]);

  const onClearAll = useCallback(() => {
    if (!pins.length) return;
    const ok = typeof window !== 'undefined' && window.confirm
      ? window.confirm('ล้างพินทั้งหมด ' + pins.length + ' รายการ?')
      : true;
    if (ok) clearPinboard();
  }, [pins.length]);

  return (
    <div
      style={{
        minHeight: '100dvh',
        paddingBottom: 'max(24px, env(safe-area-inset-bottom))',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 14 }}>
        <button
          className="vmx-btn vmx-btn-ghost vmx-btn-sm"
          onClick={() => (typeof goHome === 'function' ? goHome() : setView?.('home'))}
          style={{ minHeight: 36 }}
        >
          ← Home
        </button>
        <h1 style={{ margin: 0, fontFamily: 'Fraunces, serif', fontSize: 22, fontWeight: 600, flex: 1, minWidth: 200 }}>
          📌 Pinboard
          <span style={{ marginLeft: 10, fontSize: 13, color: 'var(--clr-ink-soft)', fontWeight: 400, fontFamily: 'JetBrains Mono, monospace' }}>
            {pins.length} / {PINBOARD_MAX}
          </span>
        </h1>
        {pins.length > 0 && (
          <button
            className="vmx-btn vmx-btn-ghost vmx-btn-sm"
            onClick={onClearAll}
            title="ล้างพินทั้งหมด"
            style={{ minHeight: 36 }}
          >
            🗑 ล้างทั้งหมด
          </button>
        )}
      </div>

      {/* Filter chips */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 18 }}>
        {[
          { id: 'all',       label: 'ทั้งหมด',    icon: '✦' },
          { id: 'question',  label: 'ข้อสอบ',     icon: TYPE_META.question.icon },
          { id: 'summary',   label: 'สรุปคลิป',    icon: TYPE_META.summary.icon },
          { id: 'flashcard', label: 'Flashcard', icon: TYPE_META.flashcard.icon },
          { id: 'note',      label: 'โน้ตข้อ',     icon: TYPE_META.note.icon },
        ].map((chip) => {
          const active = filter === chip.id;
          const n = counts[chip.id] || 0;
          return (
            <button
              key={chip.id}
              type="button"
              onClick={() => setFilter(chip.id)}
              style={{
                minHeight: 36,
                padding: '6px 12px',
                borderRadius: 999,
                border: '1px solid ' + (active ? 'var(--clr-ink)' : 'var(--clr-border)'),
                background: active ? 'var(--clr-ink)' : 'transparent',
                color: active ? 'var(--clr-surface, #fff)' : 'var(--clr-ink)',
                fontSize: 13,
                cursor: 'pointer',
                touchAction: 'manipulation',
                WebkitTapHighlightColor: 'transparent',
              }}
            >
              <span style={{ marginRight: 6 }}>{chip.icon}</span>
              {chip.label}
              <span style={{ marginLeft: 6, opacity: 0.7, fontFamily: 'JetBrains Mono, monospace', fontSize: 11 }}>{n}</span>
            </button>
          );
        })}
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div
          style={{
            padding: '40px 20px',
            textAlign: 'center',
            border: '1px dashed var(--clr-border)',
            borderRadius: 14,
            color: 'var(--clr-ink-soft)',
            lineHeight: 1.7,
          }}
        >
          <div style={{ fontSize: 42, marginBottom: 8 }}>📌</div>
          {pins.length === 0 ? (
            <>
              <div style={{ fontWeight: 600, color: 'var(--clr-ink)' }}>ยังไม่มีพินอะไรในนี้</div>
              <div style={{ marginTop: 6, fontSize: 14 }}>
                กด 📌 ที่ข้อสอบ / สรุปคลิป / flashcard เพื่อบันทึกไว้รวมกันที่นี่
              </div>
            </>
          ) : (
            <div style={{ fontSize: 14 }}>ไม่มีพินในหมวด <strong>{TYPE_META[filter]?.label || filter}</strong> ลองเลือกหมวดอื่น</div>
          )}
        </div>
      )}

      {/* Grid */}
      {filtered.length > 0 && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 12,
          }}
        >
          {filtered.map((pin) => {
            const meta = TYPE_META[pin.type] || { label: pin.type, icon: '•', color: 'var(--clr-ink-soft)' };
            const snip = snippetFor(pin);
            return (
              <div
                key={pin.id}
                role="button"
                tabIndex={0}
                onClick={() => onOpen(pin)}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onOpen(pin); } }}
                style={{
                  position: 'relative',
                  background: 'var(--clr-surface, #fff)',
                  border: '1px solid var(--clr-border)',
                  borderLeft: `4px solid ${meta.color}`,
                  borderRadius: 12,
                  padding: '12px 14px 14px',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 6,
                  minHeight: 120,
                  WebkitTapHighlightColor: 'transparent',
                  touchAction: 'manipulation',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 16 }} aria-hidden="true">{meta.icon}</span>
                  <span
                    style={{
                      fontSize: 11,
                      fontFamily: 'JetBrains Mono, monospace',
                      color: meta.color,
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                      fontWeight: 600,
                    }}
                  >
                    {meta.label}
                  </span>
                  <span style={{ flex: 1 }} />
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); removePin(pin.id); }}
                    aria-label="ลบพินนี้"
                    title="ลบพินนี้"
                    style={{
                      width: 36,
                      height: 36,
                      minWidth: 36,
                      padding: 0,
                      background: 'transparent',
                      border: '1px solid var(--clr-border)',
                      borderRadius: 8,
                      cursor: 'pointer',
                      fontSize: 14,
                      lineHeight: 1,
                      color: 'var(--clr-ink-soft)',
                      WebkitTapHighlightColor: 'transparent',
                      touchAction: 'manipulation',
                    }}
                  >
                    🗑
                  </button>
                </div>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: 'var(--clr-ink)',
                    lineHeight: 1.4,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {pin.label || '(ไม่มีชื่อ)'}
                </div>
                {snip && (
                  <div
                    style={{
                      fontSize: 12,
                      color: 'var(--clr-ink-soft)',
                      lineHeight: 1.5,
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {snip}
                  </div>
                )}
                <div style={{ marginTop: 'auto', fontSize: 11, color: 'var(--clr-ink-soft)', fontFamily: 'JetBrains Mono, monospace', opacity: 0.8 }}>
                  เพิ่มเมื่อ {relTime(pin.addedAt)}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
