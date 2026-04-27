// ============================================================
// CommandPalette — ⌘K / Ctrl+K instant search-jump
// ============================================================
// Single keyboard shortcut → fuzzy search across:
//   • Quick actions (Dashboard, Schedule, Videos, Bookmarks, …)
//   • Subjects (COM III / IV / V / EngProf)
//   • Video summaries (by title)
//
// Lightweight, no external lib. Thai-friendly fuzzy match
// (substring + per-token + tolerance for word order).
//
// Wired in App.jsx via global keydown listener — only opens when
// the user is NOT typing in an input/textarea/contenteditable.
// ============================================================

import { useState, useEffect, useMemo, useRef } from 'react';
import { SUBJECTS } from '../data/curriculum.js';
import { VIDEO_SUMMARIES } from '../data/video-summaries.js';

// Build the searchable item index. Memoized below — items don't
// change between renders so this only runs once per mount.
function buildIndex({ goView, setSubject, setPracticeMode }) {
  const items = [];

  // Quick actions / views
  const actions = [
    { label: 'หน้าแรก', hint: 'Home', icon: '🏠', kw: 'home หน้าแรก main', run: () => goView('home') },
    { label: 'Dashboard / สถิติ', hint: 'Dashboard', icon: '📊', kw: 'dashboard stats สถิติ analytics', run: () => goView('dashboard') },
    { label: 'ตารางสอบ', hint: 'Schedule', icon: '📅', kw: 'schedule exam ตาราง สอบ', run: () => goView('schedule') },
    { label: 'คลิปย้อนหลัง', hint: 'Videos', icon: '🎬', kw: 'video clip คลิป ย้อนหลัง summary', run: () => goView('videos') },
    { label: 'Reading Checklist', hint: 'Checklist', icon: '📖', kw: 'reading checklist อ่าน หัวข้อ', run: () => goView('reading-checklist') },
    { label: 'Bookmarks', hint: 'Saved questions', icon: '⭐', kw: 'bookmark saved star ⭐ ข้อ', run: () => { setPracticeMode?.('bookmarks'); goView('config'); } },
    { label: 'Question Manager', hint: 'Custom Q', icon: '✏️', kw: 'manage edit custom question จัดการ', run: () => goView('question-manager') },
    { label: 'Spaced Repetition', hint: 'SR review', icon: '🧠', kw: 'sr spaced repetition review flashcard ทบทวน', run: () => goView('sr-session') },
    { label: 'คะแนนล่าสุด', hint: 'Scores', icon: '🏆', kw: 'score คะแนน history ประวัติ', run: () => goView('scores') },
    { label: 'About', hint: 'เกี่ยวกับ', icon: 'ℹ️', kw: 'about info เกี่ยวกับ', run: () => goView('about') },
    { label: 'แจ้งปัญหา / Feedback', hint: 'Feedback', icon: '🐛', kw: 'feedback bug แจ้ง ปัญหา ติชม', run: () => goView('feedback') },
  ];
  actions.forEach((a) => items.push({ ...a, type: 'action' }));

  // Subjects — jump straight to topic-select for that subject
  SUBJECTS.filter((s) => s.id !== 'all').forEach((s) => {
    items.push({
      type: 'subject',
      label: s.name,
      hint: s.name_en || s.code || '',
      icon: s.icon || '📚',
      kw: `${s.id} ${s.name} ${s.name_en || ''} ${s.code || ''}`,
      run: () => { setSubject?.(s.id); goView('topic-select'); },
    });
  });

  // Video summaries — title-indexed so users can jump straight
  // to a clip's summary modal. Routes to videos view (user opens
  // the matching clip from there for now).
  Object.values(VIDEO_SUMMARIES || {}).forEach((s) => {
    if (!s?.title) return;
    items.push({
      type: 'summary',
      label: s.title,
      hint: `📝 สรุปคลิป · ${(s.subject || '').toUpperCase()}`,
      icon: '📝',
      kw: `${s.title} ${s.subject || ''} ${s.instructor || ''} summary สรุป คลิป`,
      run: () => goView('videos'),
    });
  });

  return items;
}

// Lightweight fuzzy match: tokenizes query by whitespace and
// requires every token to appear (substring) in the item's
// searchable string. Order doesn't matter. Score = sum of
// (1 / token_position_in_string + 1) so earlier matches rank
// higher. Empty query returns all items in original order.
function fuzzyFilter(items, query) {
  const q = query.trim().toLowerCase();
  if (!q) return items;
  const tokens = q.split(/\s+/).filter(Boolean);

  const scored = [];
  for (const item of items) {
    const hay = `${item.label} ${item.kw}`.toLowerCase();
    let score = 0;
    let allMatch = true;
    for (const t of tokens) {
      const pos = hay.indexOf(t);
      if (pos < 0) { allMatch = false; break; }
      // Earlier matches in label get bonus
      const labelPos = item.label.toLowerCase().indexOf(t);
      score += labelPos >= 0 ? (100 - labelPos) : (50 - Math.min(50, pos));
      // Exact label-start match = big bonus
      if (item.label.toLowerCase().startsWith(t)) score += 200;
    }
    if (allMatch) scored.push({ item, score });
  }
  scored.sort((a, b) => b.score - a.score);
  return scored.map((s) => s.item);
}

export default function CommandPalette({ open, onClose, ...handlers }) {
  const [query, setQuery] = useState('');
  const [activeIdx, setActiveIdx] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  const items = useMemo(() => buildIndex(handlers), [handlers]);
  const filtered = useMemo(() => fuzzyFilter(items, query), [items, query]);

  // Reset on open / close
  useEffect(() => {
    if (open) {
      setQuery('');
      setActiveIdx(0);
      // Defer focus until modal is in DOM
      const t = setTimeout(() => inputRef.current?.focus(), 0);
      return () => clearTimeout(t);
    }
  }, [open]);

  // Reset active index when filter changes
  useEffect(() => { setActiveIdx(0); }, [query]);

  // Keep active item in view when navigating with arrows
  useEffect(() => {
    if (!listRef.current) return;
    const el = listRef.current.children[activeIdx];
    if (el && typeof el.scrollIntoView === 'function') {
      el.scrollIntoView({ block: 'nearest' });
    }
  }, [activeIdx]);

  if (!open) return null;

  const handleKey = (e) => {
    if (e.key === 'Escape') { e.preventDefault(); onClose(); }
    else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIdx((i) => Math.min(filtered.length - 1, i + 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIdx((i) => Math.max(0, i - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const item = filtered[activeIdx];
      if (item) { item.run(); onClose(); }
    }
  };

  return (
    <div
      className="vmx-modal-overlay"
      onClick={onClose}
      style={{ alignItems: 'flex-start', paddingTop: 'min(15vh, 100px)' }}
    >
      <div
        className="vmx-modal"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: 600, padding: 0, overflow: 'hidden' }}
        role="dialog"
        aria-label="Command palette"
      >
        {/* Search input */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '16px 20px',
          borderBottom: '1px solid var(--clr-border)',
        }}>
          <span style={{ fontSize: 18, color: 'var(--clr-ink-soft)' }}>🔍</span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKey}
            placeholder="ค้นหาทุกอย่าง — subject, summary, เมนู…"
            style={{
              all: 'unset',
              flex: 1,
              fontSize: 16,
              color: 'var(--clr-ink)',
              fontFamily: 'inherit',
              minWidth: 0,
            }}
            autoComplete="off"
            spellCheck="false"
          />
          <span style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: 11,
            color: 'var(--clr-ink-soft)',
            padding: '2px 6px',
            border: '1px solid var(--clr-border)',
            borderRadius: 4,
          }}>esc</span>
        </div>

        {/* Results list */}
        <div
          ref={listRef}
          style={{
            maxHeight: '50vh',
            overflowY: 'auto',
            padding: 4,
          }}
        >
          {filtered.length === 0 && (
            <div style={{
              padding: '32px 20px',
              textAlign: 'center',
              color: 'var(--clr-ink-soft)',
              fontSize: 14,
            }}>
              ไม่พบที่ตรงกับ "{query}"
            </div>
          )}
          {filtered.map((item, i) => {
            const active = i === activeIdx;
            return (
              <button
                key={`${item.type}-${item.label}-${i}`}
                onClick={() => { item.run(); onClose(); }}
                onMouseEnter={() => setActiveIdx(i)}
                style={{
                  all: 'unset',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  width: '100%',
                  boxSizing: 'border-box',
                  padding: '10px 16px',
                  borderRadius: 8,
                  background: active ? 'var(--clr-surface-2)' : 'transparent',
                  transition: 'background 0.05s',
                }}
              >
                <span style={{ fontSize: 20, flex: '0 0 auto' }}>{item.icon}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: 14,
                    fontWeight: 500,
                    color: 'var(--clr-ink)',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}>
                    {item.label}
                  </div>
                  {item.hint && (
                    <div style={{
                      fontSize: 11,
                      color: 'var(--clr-ink-soft)',
                      fontFamily: 'JetBrains Mono, monospace',
                      marginTop: 2,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}>
                      {item.hint}
                    </div>
                  )}
                </div>
                {active && (
                  <span style={{
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: 11,
                    color: 'var(--clr-ink-soft)',
                    flex: '0 0 auto',
                  }}>↵</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Footer hint */}
        <div style={{
          padding: '10px 16px',
          borderTop: '1px solid var(--clr-border)',
          background: 'var(--clr-bg)',
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: 10,
          color: 'var(--clr-ink-soft)',
          display: 'flex',
          gap: 16,
          flexWrap: 'wrap',
        }}>
          <span>↑↓ เลื่อน</span>
          <span>↵ เลือก</span>
          <span>esc ปิด</span>
          <span style={{ marginLeft: 'auto' }}>{filtered.length} ผลลัพธ์</span>
        </div>
      </div>
    </div>
  );
}
