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

import { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { useDropdownAnchor } from '../hooks/useDropdownAnchor.js';
import NavIcon from './NavIcon.jsx';

// The menu's rows are rows of src/lib/prefs/table.js, drawn by the panel,
// which loads on the first open: only the button is on first load.
const ThemePickerPanel = lazy(() => import('./ThemePickerPanel.jsx'));

// theme, themePref, setTheme, palette and setPalette are still passed by the
// header and the hub; the panel reads and writes the table itself, and App's
// state follows the table's change event (hooks/useStorage.js).
export default function ThemePicker({ theme }) {
  // A pick closes the menu and hands focus back to the button that opened it,
  // as Escape does, instead of dropping it on the page.
  const choose = (apply) => {
    apply();
    setOpen(false);
    wrapRef.current?.querySelector('button')?.focus();
  };
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);
  const DROPDOWN_MIN_W = 220;
  const anchorSide = useDropdownAnchor(wrapRef, open, DROPDOWN_MIN_W);
  useEffect(() => {
    if (!open) return;
    const onDoc = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    const onKeyDown = (e) => {
      if (e.key !== 'Escape') return;
      setOpen(false);
      wrapRef.current?.querySelector('button')?.focus();
    };
    // Defer attaching the outside-click listener until after the click
    // that opened the menu has finished bubbling (otherwise the same
    // pointerdown closes the menu we just opened).
    const raf = requestAnimationFrame(() => {
      document.addEventListener('pointerdown', onDoc);
      document.addEventListener('keydown', onKeyDown);
    });
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('pointerdown', onDoc);
      document.removeEventListener('keydown', onKeyDown);
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
        <NavIcon name={theme === 'light' ? 'moon' : 'sun'} size={18} />
      </button>
      {open && (
        <div
          role="dialog"
          aria-label="ตั้งค่าธีมและจานสี"
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
            width: DROPDOWN_MIN_W,
            maxWidth: 'calc(100vw - 24px)',
            maxHeight: 'min(75dvh, 620px)',
            overflowY: 'auto',
          }}
        >
          <Suspense fallback={<p style={{ margin: 0, fontSize: 14, color: 'var(--clr-ink-soft)' }}>กำลังโหลด</p>}>
            <ThemePickerPanel choose={choose} />
          </Suspense>
        </div>
      )}
    </div>
  );
}
