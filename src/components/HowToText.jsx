// ============================================================
// HowToText — one line of guide or hint copy, with its button names marked
// ============================================================
// Copy in data/how-to.js names buttons with placeholders. This draws the
// plain words as text and each named control as a quiet label: the word the
// student will look for on screen, in the same weight wherever it appears.
// A bottom-bar destination carries the line icon the bar itself draws, so
// "ฝึกข้อสอบ" in a step looks like the thing the thumb is about to press.
//
// Labels are deliberately NOT styled as buttons (no border, no shadow, no
// pointer): they cannot be pressed, and a control-shaped word that does
// nothing is a false promise. The real way there is the step's own button.
// ============================================================

import NavIcon from './NavIcon.jsx';
import { navIconFor, parseHowTo, resolveSegment } from '../data/how-to.js';

export default function HowToText({ text }) {
  return parseHowTo(text).map((seg, i) => {
    if (seg.t === 'text') return seg.v;
    const icon = navIconFor(seg);
    return (
      <span key={i} className="vmx-guide-ui">
        {icon && <NavIcon name={icon} size={14} />}
        {resolveSegment(seg)}
      </span>
    );
  });
}
