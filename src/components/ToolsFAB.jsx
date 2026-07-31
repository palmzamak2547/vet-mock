// ============================================================
// ToolsFAB — single floating button that fans out into mini tools
// ============================================================
//
// Replaces what used to be two separate fixed-bottom-right buttons
// (🧮 VetCalculator + 🎨 Sketchpad) stacked 64px apart. Two floats
// on a phone are noisy and easy to mis-tap; one tap to expand keeps
// the screen calmer until the user actually needs a tool.
//
// Behavior:
//   • Default: single 🛠 button bottom-right.
//   • Tap → opens a mini popover above the button with each tool as
//     a small labelled row. Tap outside / Esc closes.
//   • Calculator open: dispatches the `vmx-open-vetcalc` window event,
//     which VetCalculator listens for (controlled-from-outside mode).
//   • Sketchpad open: calls `onSketch()` so App.jsx can mount
//     ImageAnnotator in sketch mode.
//
// Mounted in App.jsx alongside `<VetCalculator showFab={false} />`.
// ============================================================

import { useEffect, useRef, useState } from 'react';
// Quick-access tools come from the shared feature registry (flagged `fab`)
// so the floating menu can't drift from the home grid / ⌘K. Adding a new
// quick tool = set fab:true on its registry entry; nothing here changes.
import { fabFeatures } from '../lib/feature-registry.js';

export default function ToolsFAB({ onSketch, onLab }) {
  const [open, setOpen] = useState(false);
  const popRef = useRef(null);
  const btnRef = useRef(null);

  // Dispatch a registry invoke descriptor. Lab routes through the onLab
  // prop (App owns the #lab hash nav); calc fires its window event;
  // sketch calls onSketch. Mirrors FeatureMenu/CommandPalette dispatch.
  const dispatch = (inv) => {
    setOpen(false);
    if (!inv) return;
    switch (inv.kind) {
      case 'event': try { window.dispatchEvent(new Event(inv.event)); } catch { /* no-op */ } return;
      case 'sketch': onSketch?.(); return;
      case 'view': if (inv.view === 'lab') onLab?.(); return;
      default: return;
    }
  };
  // The lab tool only appears when App wired an onLab handler (it's hidden
  // during exam/auth). Filter it out of the FAB when that prop is absent.
  const items = fabFeatures().filter((f) => f.id !== 'lab' || !!onLab);

  // Outside-click + Esc close. Only attach the listeners while open
  // so the dormant FAB has zero global event cost.
  useEffect(() => {
    if (!open) return;
    const onDocPointer = (e) => {
      if (popRef.current?.contains(e.target)) return;
      if (btnRef.current?.contains(e.target)) return;
      setOpen(false);
    };
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onDocPointer);
    document.addEventListener('touchstart', onDocPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDocPointer);
      document.removeEventListener('touchstart', onDocPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <>
      {open && (
        <div
          ref={popRef}
          role="menu"
          aria-label="เครื่องมือ"
          style={{
            position: 'fixed',
            right: 16,
            // Sit just above the FAB. 52 (FAB height) + 16 (FAB bottom)
            // + 10 (gap) = 78. Plus iOS safe-area inset, plus the mobile
            // bottom-nav height so the panel clears it (0 on desktop).
            bottom: 'calc(var(--vmx-bottom-nav-h, 0px) + 78px + env(safe-area-inset-bottom))',
            zIndex: 901,
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
            padding: 8,
            borderRadius: 14,
            background: 'var(--clr-surface)',
            border: '1px solid var(--clr-border)',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.18)',
            minWidth: 168,
            animation: 'vmx-fab-pop 140ms cubic-bezier(0.32, 0.72, 0, 1)',
          }}
        >
          {items.map((f) => (
            <FabMenuItem
              key={f.id}
              icon={f.icon}
              label={f.label}
              hint={f.fabHint || f.hint}
              onClick={() => dispatch(f.invoke)}
            />
          ))}
        </div>
      )}

      <button
        ref={btnRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        title={open ? 'ปิดเครื่องมือ' : 'เครื่องมือ — เครื่องคิดเลข + กระดานวาด'}
        aria-label="เครื่องมือ"
        aria-expanded={open}
        style={{
          position: 'fixed',
          right: 16,
          // Lift above the mobile bottom-nav (0 on desktop where there is none).
          bottom: 'calc(var(--vmx-bottom-nav-h, 0px) + max(16px, env(safe-area-inset-bottom)))',
          zIndex: 900,
          width: 52,
          height: 52,
          borderRadius: '50%',
          border: '1px solid var(--clr-border)',
          background: open ? 'var(--clr-ink)' : 'var(--clr-surface)',
          color: open ? 'var(--clr-bg)' : 'var(--clr-ink)',
          fontSize: 22,
          cursor: 'pointer',
          boxShadow: '0 4px 14px rgba(0, 0, 0, 0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'inherit',
          transition: 'transform 140ms cubic-bezier(0.32, 0.72, 0, 1), background 140ms, color 140ms',
          transform: open ? 'rotate(45deg)' : 'rotate(0)',
        }}
      >
        {open ? '×' : '🛠'}
      </button>

      <style>{`
        @keyframes vmx-fab-pop {
          from { opacity: 0; transform: translateY(6px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0)   scale(1); }
        }
      `}</style>
    </>
  );
}

function FabMenuItem({ icon, label, hint, onClick }) {
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onClick}
      style={{
        all: 'unset',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '8px 10px',
        borderRadius: 10,
        fontFamily: 'inherit',
        background: 'transparent',
        transition: 'background 100ms',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--clr-surface-2)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
    >
      <span style={{ fontSize: 20, lineHeight: 1, flex: '0 0 auto' }}>{icon}</span>
      <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--clr-ink)' }}>{label}</span>
        <span style={{ fontSize: 10, fontFamily: 'var(--vmx-mono)', color: 'var(--clr-ink-soft)' }}>{hint}</span>
      </span>
    </button>
  );
}
