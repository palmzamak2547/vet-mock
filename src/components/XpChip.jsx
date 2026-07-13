// XpChip — compact "Lv N · XXX XP" pill with thin progress bar.
// Lives in the header next to the 🔥 streak chip. Listens for the
// `vmx-xp-changed` custom event so awards from any code path (exam
// finish, SR grade, quest claim, notes read) light it up live.
//
// Tap → opens a small popover showing total XP + today's XP +
// lifetime question count.

import { useEffect, useRef, useState } from 'react';
import { getXpState, levelFor, xpForNextLevel, XP_EVENT } from '../lib/xp.js';
import { useDropdownAnchor } from '../hooks/useDropdownAnchor.js';

export default function XpChip() {
  const [state, setState] = useState(() => getXpState());
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);
  const DROPDOWN_MIN_W = 200;
  // Same viewport-aware anchor logic — see useDropdownAnchor + STABILITY.md.
  const anchorSide = useDropdownAnchor(wrapRef, open, DROPDOWN_MIN_W);

  useEffect(() => {
    const refresh = () => setState(getXpState());
    window.addEventListener(XP_EVENT, refresh);
    // Also refresh on focus — covers the case where another tab
    // edited XP while this one was backgrounded.
    window.addEventListener('focus', refresh);
    return () => {
      window.removeEventListener(XP_EVENT, refresh);
      window.removeEventListener('focus', refresh);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    const raf = requestAnimationFrame(() => {
      document.addEventListener('pointerdown', onDoc);
    });
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('pointerdown', onDoc);
    };
  }, [open]);

  const lvl = levelFor(state.totalXp);
  const prog = xpForNextLevel(state.totalXp);

  return (
    <div ref={wrapRef} style={{ position: 'relative' }}>
      <button
        type="button"
        className="vmx-xp-chip vmx-pop-in"
        onClick={() => setOpen((v) => !v)}
        title={`Lv ${lvl} · ${state.totalXp.toLocaleString()} XP · อีก ${prog.needed - prog.current} XP ไปอีก level`}
        aria-label={`ระดับ ${lvl} · ${state.totalXp} XP`}
        aria-expanded={open}
        style={{
          all: 'unset',
          cursor: 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          minHeight: 36,
          padding: '6px 12px',
          borderRadius: 999,
          background: 'rgba(74, 107, 74, 0.10)',
          border: '1px solid var(--clr-sage, #4a6b4a)',
          fontSize: 13,
          fontFamily: 'JetBrains Mono, monospace',
          color: 'var(--clr-sage, #4a6b4a)',
          lineHeight: 1.1,
        }}
      >
        <span style={{ fontSize: 14 }}>✨</span>
        <span><strong>Lv {lvl}</strong></span>
        <span className="vmx-xp-chip-total" style={{ opacity: 0.75 }}>· {state.totalXp.toLocaleString()} XP</span>
        <span
          aria-hidden
          className="vmx-xp-chip-progress"
          style={{
            position: 'relative',
            width: 36,
            height: 4,
            borderRadius: 2,
            background: 'rgba(74, 107, 74, 0.20)',
            overflow: 'hidden',
            marginLeft: 4,
          }}
        >
          <span
            style={{
              position: 'absolute',
              inset: 0,
              width: `${prog.pct}%`,
              background: 'var(--clr-sage, #4a6b4a)',
              transition: 'width 320ms ease',
            }}
          />
        </span>
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
            padding: 12,
            boxShadow: '0 6px 24px rgba(0,0,0,0.18)',
            minWidth: DROPDOWN_MIN_W,
            maxWidth: 'calc(100vw - 24px)',
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: 12,
            color: 'var(--clr-ink)',
            lineHeight: 1.5,
          }}
        >
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}>
            ✨ Level {lvl}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ color: 'var(--clr-ink-soft)' }}>Total XP</span>
            <span><strong>{state.totalXp.toLocaleString()}</strong></span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ color: 'var(--clr-ink-soft)' }}>วันนี้</span>
            <span>+{(state.todayXp || 0).toLocaleString()} XP</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ color: 'var(--clr-ink-soft)' }}>Lifetime Qs</span>
            <span>{(state.lifetimeQs || 0).toLocaleString()}</span>
          </div>
          <div style={{ fontSize: 11, color: 'var(--clr-ink-soft)', borderTop: '1px solid var(--clr-border)', paddingTop: 8 }}>
            อีก <strong>{(prog.needed - prog.current).toLocaleString()}</strong> XP ไป Lv {prog.nextLevel}
          </div>
        </div>
      )}
    </div>
  );
}
