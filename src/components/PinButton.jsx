// ============================================================
// PinButton — toggles a pinboard entry for a (type, payload) pair
// ============================================================
//
// Props:
//   type     'question' | 'summary' | 'flashcard' | 'note'
//   payload  type-specific object. payloadKey() in lib/pinboard.js
//            extracts the dedup key.
//   label    short human-readable label shown in PinboardView
//   compact  bool — render the 36 px icon-only variant for cramped
//            UIs (modal header, toolbar). Default 44 px hit target.
//   style    optional inline-style override (positioning, etc.)
//
// State syncs across instances via the `vmx-pinboard-changed`
// CustomEvent — no polling, no React context needed.

import { useEffect, useState, useCallback } from 'react';
import { addPin, removePinByKey, isPinned, payloadKey, PINBOARD_EVENT } from '../lib/pinboard.js';
import NavIcon from './NavIcon.jsx';

export default function PinButton({ type, payload, label, compact = false, style }) {
  const key = payloadKey(type, payload);
  const [pinned, setPinned] = useState(() => isPinned(type, key));
  const [bumped, setBumped] = useState(false);

  // Re-read on mount + listen for cross-component changes (other
  // PinButton instance, PinboardView clear-all, etc.).
  useEffect(() => {
    setPinned(isPinned(type, key));
    const onChange = () => setPinned(isPinned(type, key));
    window.addEventListener(PINBOARD_EVENT, onChange);
    return () => window.removeEventListener(PINBOARD_EVENT, onChange);
  }, [type, key]);

  const onClick = useCallback((e) => {
    e?.stopPropagation?.();
    e?.preventDefault?.();
    if (!type || !key) return;
    if (pinned) {
      removePinByKey(type, key);
    } else {
      addPin({ type, payload, label });
    }
    // Tiny scale bounce so users get tactile feedback without needing
    // a toast layer. Cleared by setTimeout in a hook below.
    setBumped(true);
  }, [type, key, payload, label, pinned]);

  useEffect(() => {
    if (!bumped) return;
    const t = setTimeout(() => setBumped(false), 220);
    return () => clearTimeout(t);
  }, [bumped]);

  const size = compact ? 36 : 44;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={pinned ? 'ปลดหมุดจาก Pinboard' : 'เพิ่มเข้า Pinboard'}
      title={pinned ? 'ปลดหมุด (อยู่ใน Pinboard)' : 'หมุดเก็บไว้ใน Pinboard'}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: size,
        height: size,
        minWidth: size,
        minHeight: size,
        padding: 0,
        background: pinned ? 'var(--clr-gold-soft, #f4e7c5)' : 'transparent',
        color: 'var(--clr-ink)',
        border: '1px solid ' + (pinned ? 'var(--clr-gold, #c8a64b)' : 'var(--clr-border)'),
        borderRadius: 10,
        cursor: 'pointer',
        fontSize: compact ? 16 : 18,
        lineHeight: 1,
        transform: bumped ? 'scale(1.18)' : 'scale(1)',
        transition: 'transform 180ms ease, background 180ms ease, border-color 180ms ease',
        WebkitTapHighlightColor: 'transparent',
        touchAction: 'manipulation',
        ...style,
      }}
    >
      <NavIcon name="pin" size={17} filled={pinned} />
    </button>
  );
}
