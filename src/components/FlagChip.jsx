import { useState } from 'react';
import NavIcon from './NavIcon.jsx';
import { cautionChipShown, CAUTION_CHIP_TEXT } from '../lib/source-line.js';

// ────────────────────────────────────────────────────────────────
// FlagChip — "ข้อควรระวัง": the key of this question is in dispute (a
// `severity: 'major'` flag). Tap to read the note and its sources. Any other
// flag draws nothing here; a minor note is a row of the source panel.
// ────────────────────────────────────────────────────────────────
// It shows with the key and never before (11 Nov 2026): before the answer
// there is no answer to be careful with, and in a timed paper a red chip told
// the student the official answer was disputed. It sits in the verdict panel,
// under the key, so its arrival moves no option under the student's finger;
// after a submitted paper, Review prints the same note. (5.189.2 measured
// what the note opened: it named the key on 26 of the 94 flagged questions.)
// Exported for the leak test.
export default function FlagChip({ flag, revealed = false }) {
  const [open, setOpen] = useState(false);
  if (!revealed || !cautionChipShown(flag)) return null;
  // `text` is the accent as TEXT on a 12% tint of itself — the raw accent
  // reads 2.65 there. The -text variant is what that role is for; border
  // and bg keep the accent, where nothing reads on top of it.
  const palette = { bg: 'rgba(194, 109, 109, 0.12)', border: 'var(--clr-rose)', text: 'var(--clr-rose-text)' };

  return (
    <div className="vmx-caution">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        data-flag-chip={flag.severity}
        style={{
          all: 'unset',
          cursor: 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          minHeight: 44,
          boxSizing: 'border-box',
          padding: '0 14px',
          background: palette.bg,
          border: `1px solid ${palette.border}`,
          borderRadius: 999,
          fontSize: 14,
          fontWeight: 600,
          color: palette.text,
        }}
        title={open ? 'ซ่อนข้อควรระวัง' : 'เฉลยข้อนี้มีข้อควรระวัง กดอ่าน'}
      >
        <NavIcon name="flag" size={13} filled /> {CAUTION_CHIP_TEXT} {open ? '▾' : '▸'}
      </button>

      {open && (
        <div style={{
          marginTop: 8,
          padding: '12px 14px',
          background: palette.bg,
          borderLeft: `3px solid ${palette.border}`,
          borderRadius: '0 8px 8px 0',
          fontSize: 14,
          lineHeight: 1.6,
          color: 'var(--clr-ink)',
        }}>
          <div>{flag.note}</div>
          {/* The card's own text, not 11px mono: it is read, not scanned. */}
          {flag.sources?.length > 0 && (
            <div style={{ marginTop: 8, color: 'var(--clr-ink-soft)', overflowWrap: 'anywhere' }}>
              แหล่งที่มา: {flag.sources.join(', ')}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

