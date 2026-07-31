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

  // Crossing a level is the one moment in the XP system worth marking, and it
  // was passing in complete silence: xp.js dispatches the event with
  // { amount, reason, total }, and this listener threw all of it away and
  // just re-read state. Comparing the level before and after gives us the
  // crossing for free; .vmx-pop-in is the spring the header chips already use.
  const [levelUp, setLevelUp] = useState(false);
  useEffect(() => {
    const refresh = () => {
      setState((prev) => {
        const next = getXpState();
        if (levelFor(next.totalXp) > levelFor(prev.totalXp)) {
          setLevelUp(true);
          window.setTimeout(() => setLevelUp(false), 700);
        }
        return next;
      });
    };
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

  // Nothing earned yet? Say nothing. This chip sat in the most valuable slot
  // in the header telling a brand-new student they have zero, next to an
  // empty progress bar — a scoreboard before the game starts. It appears on
  // its own the first time XP lands, which makes it a reward instead of a
  // reminder. (The XP_EVENT listener above is what brings it back.)
  if (state.totalXp <= 0) return null;

  return (
    <div ref={wrapRef} style={{ position: 'relative' }}>
      <button
        type="button"
        // Re-keyed on levelUp so the spring actually replays; a class that is
        // already present does not restart its animation.
        key={levelUp ? 'lv-up' : 'lv'}
        className={`vmx-xp-chip${levelUp ? ' vmx-pop-in' : ''}`}
        onClick={() => setOpen((v) => !v)}
        title={`Lv ${lvl}, ${state.totalXp.toLocaleString()} XP, อีก ${prog.needed - prog.current} XP ไปอีก level`}
        aria-label={`ระดับ ${lvl}, ${state.totalXp} XP`}
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
          fontFamily: 'var(--vmx-mono)',
          color: 'var(--clr-sage, #4a6b4a)',
          lineHeight: 1.1,
        }}
      >
        <span><strong>Lv {lvl}</strong></span>
        {/* A hairline, not punctuation — "Lv 0" and "0 XP" sitting in a flex
            row with only a gap between them read as one number, "Lv 0 0 XP". */}
        <span
          className="vmx-xp-chip-total"
          style={{ opacity: 0.75, paddingLeft: 8, borderLeft: '1px solid currentColor' }}
        >
          {state.totalXp.toLocaleString()} XP
        </span>
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
            fontFamily: 'var(--vmx-mono)',
            fontSize: 12,
            color: 'var(--clr-ink)',
            lineHeight: 1.5,
          }}
        >
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}>
            Level {lvl}
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
