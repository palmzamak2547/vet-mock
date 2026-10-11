// ============================================================
// FeatureTip — the once-a-day usage hint itself
// ============================================================
// Owner review: "เวลาทำอะไรอยู่ฟีเจอร์ไหนอยากให้มีป๊อปอัพแนะนำการใช้งานโผล่ออก
// มาในครั้งแรกของวัน เช่นเนื้อหาสามารถกดปริ้น pdf file ได้". One short hint
// the first time a day a student opens a feature, then quiet for the day.
//
//   <FeatureTip id="notes" />                    the notes page
//   <FeatureTip id="knowledge" surface="article" /> one of two screens sharing an id
//
// The words live in data/how-to.js (FEATURE_TIPS), where a unit suite holds
// every button name they quote to the screen that draws it. A feature may
// carry several hints: lib/first-tip.js decides whether today is a hint day
// AND which turn it is, once per id, before anything is drawn, so the hint on
// screen never changes or vanishes under the reader when the card records
// itself as seen (React.StrictMode runs that effect twice in development).
//
// Accessibility, deliberately:
//   • No live-region role. The card enters the page already holding its text,
//     and a live region only announces changes made to a region that was
//     there first. It is in-flow content met in reading order.
//   • The close control is a real 44px <button> named "ปิดคำแนะนำ"; the
//     optional "ดูวิธีใช้เรื่องนี้ทั้งหมด" is a real button too, offered only
//     while the app listens for it (lib/guide-progress.js), never dead.
//   • No focus trap, no autofocus: the page stays where the student left it.
//   • In flow, never fixed or absolute: on a phone it pushes the page down
//     instead of covering it. One soft entrance, opacity only under reduced
//     motion (styles.css, night-b block).
// ============================================================

import { useEffect, useState } from 'react';
import NavIcon from './NavIcon.jsx';
import HowToText from './HowToText.jsx';
import { decideTip, dismissTip, markTipSeen } from '../lib/first-tip.js';
import { FEATURE_TIPS, pickTip } from '../data/how-to.js';
import { canOpenGuide, openGuide } from '../lib/guide-progress.js';

export default function FeatureTip({ id, surface = null, title: legacyTitle = null, children = null }) {
  // Whether to show, and which hint, is decided ONCE per id and kept.
  const [decision, setDecision] = useState(() => decideTip(null, id));
  const current = decideTip(decision, id);
  if (current !== decision) setDecision(current);

  const tip = pickTip(id, { surface, turn: current.turn });
  // A caller that still passes its own words (an id with no entry in
  // FEATURE_TIPS) keeps working; a hint with nothing to say shows nothing.
  const content = tip || (legacyTitle ? { title: legacyTitle, body: children } : null);
  const shown = current.show && Boolean(content);

  // Being SHOWN is itself the record: the day's hint ends the moment the
  // student has seen it, exactly like a dismissal. A hint that was not shown
  // marks nothing, so a screen with no hint does not spend the day.
  useEffect(() => {
    if (shown) markTipSeen(id);
  }, [id, shown]);

  if (!shown) return null;

  const guide = tip ? FEATURE_TIPS[id]?.guide : null;
  const linkable = Boolean(guide) && canOpenGuide();
  const dismiss = () => {
    if (!id) return;
    dismissTip(id);
    setDecision({ ...current, show: false });
  };

  return (
    <div className="vmx-feature-tip" data-tip-id={id}>
      <span className="vmx-feature-tip-icon" aria-hidden="true">
        <NavIcon name="bulb" size={18} />
      </span>
      <div className="vmx-feature-tip-copy">
        <p className="vmx-feature-tip-title">{content.title}</p>
        <div className="vmx-feature-tip-text">
          {tip ? <HowToText text={tip.text} /> : content.body}
        </div>
        {linkable && (
          <button
            type="button"
            className="vmx-feature-tip-more"
            onClick={(event) => openGuide(guide, event.currentTarget)}
          >
            ดูวิธีใช้เรื่องนี้ทั้งหมด <span aria-hidden="true">›</span>
          </button>
        )}
      </div>
      <button
        type="button"
        onClick={dismiss}
        className="vmx-icon-close vmx-feature-tip-close"
        aria-label="ปิดคำแนะนำ"
      >
        <NavIcon name="close" size={16} />
      </button>
    </div>
  );
}
