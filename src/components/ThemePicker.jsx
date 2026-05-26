// ============================================================
// ThemePicker — theme/palette popover (extracted from App.jsx)
// ============================================================
// Click → opens a small popover with light/dark toggle + 6 palette
// swatches. Closes on outside click (pointerdown on document).
//
// Mobile-clipping fix history: see STABILITY.md rule 11 + the
// useDropdownAnchor hook docstring. Hardcoded `right: 0` clipped
// the 220px dropdown 160px off-screen-left on mobile (button at
// x=16). The hook flips anchor side based on viewport room.
// ============================================================

import { useState, useEffect, useRef } from 'react';
import { useDropdownAnchor } from '../hooks/useDropdownAnchor.js';

const PALETTES = [
  { id: 'default', name: 'Sage + Gold', dot: '#4a6b4a' },
  { id: 'forest',  name: 'Forest',      dot: '#2d5a3d' },
  { id: 'ocean',   name: 'Ocean',       dot: '#3d6b82' },
  { id: 'plum',    name: 'Plum',        dot: '#7d4a7d' },
  { id: 'cherry',  name: 'Cherry',      dot: '#c26d6d' },
  { id: 'mono',    name: 'Mono',        dot: '#4a4a4a' },
];

export default function ThemePicker({ theme, setTheme, palette, setPalette }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);
  const DROPDOWN_MIN_W = 220;
  const anchorSide = useDropdownAnchor(wrapRef, open, DROPDOWN_MIN_W);
  useEffect(() => {
    if (!open) return;
    const onDoc = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    // Defer attaching the outside-click listener until after the click
    // that opened the menu has finished bubbling (otherwise the same
    // pointerdown closes the menu we just opened).
    const raf = requestAnimationFrame(() => {
      document.addEventListener('pointerdown', onDoc);
    });
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('pointerdown', onDoc);
    };
  }, [open]);
  return (
    <div ref={wrapRef} style={{ position: 'relative' }}>
      <button
        className="vmx-theme-btn"
        onClick={() => setOpen((o) => !o)}
        title="ธีมและสี"
        aria-label="ตัวเลือกธีมและจานสี"
        aria-expanded={open}
      >
        {theme === 'light' ? '🌙' : '☀️'}
      </button>
      {open && (
        <div
          role="menu"
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            ...(anchorSide === 'left' ? { left: 0 } : { right: 0 }),
            zIndex: 950,
            background: 'var(--clr-surface)',
            border: '1px solid var(--clr-border)',
            borderRadius: 10,
            padding: 10,
            boxShadow: '0 6px 24px rgba(0,0,0,0.18)',
            minWidth: DROPDOWN_MIN_W,
            maxWidth: 'calc(100vw - 24px)',
          }}
        >
          <div style={{ fontSize: 11, color: 'var(--clr-ink-soft)', textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: 'JetBrains Mono, monospace', marginBottom: 6 }}>
            โหมด
          </div>
          <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
            <button
              type="button"
              onClick={() => setTheme('light')}
              className={`vmx-chip ${theme === 'light' ? 'active' : ''}`}
              style={{ flex: 1 }}
            >☀️ Light</button>
            <button
              type="button"
              onClick={() => setTheme('dark')}
              className={`vmx-chip ${theme === 'dark' ? 'active' : ''}`}
              style={{ flex: 1 }}
            >🌙 Dark</button>
          </div>
          <div style={{ fontSize: 11, color: 'var(--clr-ink-soft)', textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: 'JetBrains Mono, monospace', marginBottom: 6 }}>
            จานสี
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 6 }}>
            {PALETTES.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setPalette(p.id)}
                className={`vmx-chip ${palette === p.id ? 'active' : ''}`}
                style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, padding: '5px 10px' }}
              >
                <span style={{ width: 12, height: 12, borderRadius: '50%', background: p.dot, border: '1px solid var(--clr-border)' }} />
                {p.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
