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
import { subjectText } from '../hooks/utils.js';
import { loadPins, removePin, clearPinboard, PINBOARD_EVENT, PINBOARD_MAX } from '../lib/pinboard.js';
import { SUBJECTS_BY_YEAR } from '../data/curriculum.js';
import { confirmDialog } from '../lib/dialog.js';

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
    case 'summary':   return [p.subject?.toUpperCase?.(), p.instructor, p.date].filter(Boolean).join(', ');
    case 'flashcard': return p.back || p.front || '';
    case 'note':      return p.snapshot || p.text || '';
    default:          return '';
  }
}

export default function PinboardView({ goHome, setView, setSubject, setTopic, setPracticeMode, notes, selectedYear = 4, selectedPhase }) {
  const [pins, setPins] = useState(() => loadPins());
  const [filter, setFilter] = useState('all');
  // Year scope — 'current' shows only pins whose source subject lives in
  // the user's selected year. 'all' is the lifetime view.
  const [yearScope, setYearScope] = useState(() => {
    try { return localStorage.getItem('vmx-pinboard-year-scope') || 'current'; }
    catch { return 'current'; }
  });
  useEffect(() => {
    try { localStorage.setItem('vmx-pinboard-year-scope', yearScope); } catch { /* noop */ }
  }, [yearScope]);

  // Build subject → year map once.
  const subjectYear = useMemo(() => {
    const m = {};
    for (const [yr, subjects] of Object.entries(SUBJECTS_BY_YEAR || {})) {
      for (const s of subjects || []) m[s.id] = Number(yr);
    }
    return m;
  }, []);

  // Re-load when another component (PinButton in Question.jsx,
  // SummaryModal) mutates the store.
  useEffect(() => {
    const onChange = () => setPins(loadPins());
    window.addEventListener(PINBOARD_EVENT, onChange);
    return () => window.removeEventListener(PINBOARD_EVENT, onChange);
  }, []);

  // Year filter is applied FIRST so type counts (below) reflect what
  // the user actually sees with their year scope.
  const yearFilteredPins = useMemo(() => {
    if (yearScope === 'all') return pins;
    return pins.filter((p) => {
      const subj = p?.payload?.subject;
      if (!subj) return true; // year-agnostic pins (summaries without subject, etc.) stay visible
      const yr = subjectYear[subj];
      return yr == null || yr === selectedYear;
    });
  }, [pins, yearScope, subjectYear, selectedYear]);

  const filtered = useMemo(() => {
    if (filter === 'all') return yearFilteredPins;
    return yearFilteredPins.filter((p) => p.type === filter);
  }, [yearFilteredPins, filter]);

  const counts = useMemo(() => {
    const c = { all: yearFilteredPins.length, question: 0, summary: 0, flashcard: 0, note: 0 };
    for (const p of yearFilteredPins) c[p.type] = (c[p.type] || 0) + 1;
    return c;
  }, [yearFilteredPins]);

  const hiddenByYearScope = pins.length - yearFilteredPins.length;

  const onOpen = useCallback((pin) => {
    const p = pin.payload || {};
    switch (pin.type) {
      case 'question': {
        if (p.subject && typeof setSubject === 'function') setSubject(p.subject);
        // A topic picked for another subject used to survive the jump and
        // leave ConfigView with an empty pool and a disabled start button.
        if (typeof setTopic === 'function') setTopic(null);
        if (typeof setPracticeMode === 'function') setPracticeMode('bookmarks');
        if (typeof setView === 'function') setView('config');
        return;
      }
      case 'note': {
        if (p.subject && typeof setSubject === 'function') setSubject(p.subject);
        if (typeof setTopic === 'function') setTopic(null);
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
  }, [setView, setSubject, setTopic, setPracticeMode]);

  const onClearAll = useCallback(async () => {
    if (!pins.length) return;
    const ok = await confirmDialog({
      title: `ล้างพินทั้งหมด ${pins.length} รายการ?`,
      note: 'กู้คืนไม่ได้',
      confirmLabel: 'ล้างทั้งหมด',
      tone: 'danger',
    });
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
          style={{ minHeight: 44 }}
        >
          ← Home
        </button>
        <h1 style={{ margin: 0, fontFamily: 'Fraunces, serif', fontSize: 22, fontWeight: 600, flex: 1, minWidth: 200 }}>
          Pinboard
          <span style={{ marginLeft: 10, fontSize: 13, color: 'var(--clr-ink-soft)', fontWeight: 400, fontFamily: 'var(--vmx-mono)' }}>
            {pins.length} / {PINBOARD_MAX}
          </span>
        </h1>
        {pins.length > 0 && (
          <button
            className="vmx-btn vmx-btn-ghost vmx-btn-sm"
            onClick={onClearAll}
            title="ล้างพินทั้งหมด"
            style={{ minHeight: 44 }}
          >
            ล้างทั้งหมด
          </button>
        )}
      </div>

      {/* Year-scope chips */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center', marginBottom: 10 }}>
        <span style={{ fontSize: 11, fontFamily: 'var(--vmx-mono)', color: 'var(--clr-ink-soft)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          📅
        </span>
        <button
          type="button"
          onClick={() => setYearScope('current')}
          style={{
            minHeight: 44, padding: '4px 10px', borderRadius: 999,
            border: '1px solid ' + (yearScope === 'current' ? 'var(--clr-ink)' : 'var(--clr-border)'),
            background: yearScope === 'current' ? 'var(--clr-ink)' : 'transparent',
            color: yearScope === 'current' ? 'var(--clr-surface, #fff)' : 'var(--clr-ink)',
            fontSize: 12, cursor: 'pointer',
          }}
        >
          ปี {selectedYear}
        </button>
        <button
          type="button"
          onClick={() => setYearScope('all')}
          style={{
            minHeight: 44, padding: '4px 10px', borderRadius: 999,
            border: '1px solid ' + (yearScope === 'all' ? 'var(--clr-ink)' : 'var(--clr-border)'),
            background: yearScope === 'all' ? 'var(--clr-ink)' : 'transparent',
            color: yearScope === 'all' ? 'var(--clr-surface, #fff)' : 'var(--clr-ink)',
            fontSize: 12, cursor: 'pointer',
          }}
        >
          🌐 ทุกปี
        </button>
        {hiddenByYearScope > 0 && (
          <span style={{ fontSize: 11, color: 'var(--clr-ink-soft)', fontStyle: 'italic' }}>
            +{hiddenByYearScope} ปีอื่น
          </span>
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
                minHeight: 44,
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
              <span style={{ marginLeft: 6, opacity: 0.7, fontFamily: 'var(--vmx-mono)', fontSize: 11 }}>{n}</span>
            </button>
          );
        })}
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="vmx-empty">
          {pins.length === 0 ? (
            <>
              <div style={{ fontWeight: 600, color: 'var(--clr-ink)', marginBottom: 6 }}>ไม่มีรายการบันทึก</div>
              <div style={{ fontSize: 14 }}>กดปุ่มพินในข้อสอบหรือสรุปเพื่อบันทึกเนื้อหาเก็บไว้ทบทวน</div>
            </>
          ) : (
            <div style={{ fontSize: 14 }}>ไม่มีพินในหมวด <strong>{TYPE_META[filter]?.label || filter}</strong> โปรดเลือกหมวดอื่น</div>
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
                      fontFamily: 'var(--vmx-mono)',
                      color: subjectText(meta.color),
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
                {pin.type === 'question' && (() => {
                  const noteContent = notes?.[pin.payload?.id] || (pin.payload?.subject && notes?.[`${pin.payload.subject}:${pin.payload.id}`]);
                  if (!noteContent || !String(noteContent).trim()) return null;
                  return (
                    <div
                      style={{
                        marginTop: 4,
                        padding: '6px 8px',
                        background: 'var(--clr-surface-2, #f5f0eb)',
                        borderRadius: 6,
                        border: '1px solid var(--clr-border)',
                      }}
                    >
                      <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--clr-ink-soft)', marginBottom: 2 }}>
                        บันทึกส่วนตัว
                      </div>
                      <div
                        style={{
                          fontSize: 11,
                          color: 'var(--clr-ink)',
                          lineHeight: 1.4,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          whiteSpace: 'pre-wrap',
                          wordBreak: 'break-word',
                        }}
                      >
                        {String(noteContent).trim()}
                      </div>
                    </div>
                  );
                })()}
                <div style={{ marginTop: 'auto', fontSize: 11, color: 'var(--clr-ink-soft)', fontFamily: 'var(--vmx-mono)', opacity: 0.8 }}>
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
