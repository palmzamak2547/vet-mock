// ============================================================
// FeatureTip — the once-a-day usage hint itself
// ============================================================
// Renders one short usage hint the first time a day a student opens a
// feature. When lib/first-tip.js says the tip was already seen today this
// component renders NOTHING — the decision is taken before any DOM exists,
// so a hinted student never sees a flash of content that then disappears.
//
// House language, borrowed from LabView's onboarding card and the home
// welcome strip: a quiet bordered card, a strong first line, a soft bullet
// list, and a ✕ that records the dismissal. No animation of its own — every
// surface here respects prefers-reduced-motion by not adding any.
//
// Accessibility, deliberately:
//   • No live-region role. The card enters the page already holding its text,
//     and a live region only announces changes made to a region that was
//     there first, so a role here would promise an announcement that most
//     screen readers never make. It is ordinary in-flow content that a reader
//     meets in reading order.
//   • The ✕ is a real <button>, so Tab reaches it and Enter/Space dismisses.
//   • No focus trap, no autofocus: dismissal hands focus nowhere, and the
//     page stays exactly where the student left it.
//   • Plain in-flow content, never fixed or absolute — on a phone it pushes
//     the page down instead of covering it.
// ============================================================

import { useEffect, useState } from 'react';
import { decideTip, dismissTip, markTipSeen } from '../lib/first-tip.js';

const cardStyle = {
  padding: 'var(--space-3) var(--space-4)',
  background: 'var(--clr-surface-2)',
  border: '1px solid var(--clr-border)',
  borderRadius: 'var(--r-sm)',
  marginBottom: 'var(--space-4)',
};

const closeStyle = {
  width: 28,
  height: 28,
  border: '1px solid var(--clr-border)',
  background: 'var(--clr-surface)',
  borderRadius: 4,
  cursor: 'pointer',
  fontSize: '0.85rem',
  color: 'var(--clr-ink-soft)',
  flexShrink: 0,
};

export default function FeatureTip({ id, title, children, icon = '💡' }) {
  // Whether to show is decided ONCE per id, before the first paint, and kept.
  // Re-reading the record after the effect below has written it would hide
  // the very card that wrote it (React.StrictMode runs the effect twice in
  // development), so the decision is only taken again when the id changes.
  const [decision, setDecision] = useState(() => decideTip(null, id));
  const current = decideTip(decision, id);
  if (current !== decision) setDecision(current);

  // Being SHOWN is itself the record: the day's hint ends the moment the
  // student has seen it, exactly like a dismissal, so it never returns on the
  // next visit. Without this the ✕ alone would gate the day and the hint
  // would reappear every visit. A hint that was not shown marks nothing.
  useEffect(() => {
    if (current.show) markTipSeen(id);
  }, [id, current.show]);

  const dismiss = () => {
    if (!id) return;
    dismissTip(id);
    setDecision({ id, show: false });
  };

  if (!current.show) return null;

  return (
    <div className="vmx-feature-tip" style={cardStyle}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <strong style={{ fontSize: '0.95rem' }}>
            {icon ? <span aria-hidden="true">{icon} </span> : null}
            {title}
          </strong>
          <div style={{ margin: '6px 0 0', fontSize: '0.85rem', lineHeight: 1.6, color: 'var(--clr-ink-soft)' }}>
            {children}
          </div>
        </div>
        <button
          type="button"
          onClick={dismiss}
          className="vmx-tap"
          style={closeStyle}
          aria-label="ปิดคำแนะนำ"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
