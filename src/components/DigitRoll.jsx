// ============================================================
// DigitRoll — odometer number reveal
// ============================================================
// Each digit is a vertical 0-9 strip that rolls to its place (technique
// studied from 21st "Rolling Digits", rebuilt CSS-only in the vmx idiom —
// no animation library, compositor transforms only).
//
// Honesty contract: the FIRST render — server, crawler, no-JS, reduced
// motion — is the final formatted string at its final offsets. The roll
// plays once, after the element scrolls into view, by snapping the strips
// to 0 with transitions off and letting them transition back to the exact
// same resting place. Later value changes roll through the same
// transition. Screen readers get one plain-text value via aria-label,
// never ten digits per column.

import { useEffect, useRef } from 'react';

const DIGITS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

export default function DigitRoll({ value, format, className }) {
  const text = format ? format(value) : String(value);
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        // Snap to 0 with transitions off, then restore each strip's own
        // resting offset next frame so it rolls up into place. The restore
        // writes the SAME value React last rendered, so later re-renders
        // (live value changes) diff cleanly on top of it.
        const strips = el.querySelectorAll('[data-target]');
        strips.forEach((s) => { s.style.transition = 'none'; s.style.transform = 'translateY(0)'; });
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            strips.forEach((s) => { s.style.transition = ''; s.style.transform = s.dataset.target || ''; });
          });
        });
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    // aria-label on a bare <span> has no role to attach to, and every child
    // here is aria-hidden — so the number could be announced as nothing at all.
    // A visually-hidden text node is the reliable way to say it once.
    <span ref={ref} className={`vmx-roll ${className || ''}`}>
      <span className="vmx-sr-only">{text}</span>
      {Array.from(text).map((ch, i) => (
        /\d/.test(ch) ? (
          <span key={i} aria-hidden="true" className="vmx-digit">
            <span
              className="vmx-digit-strip"
              data-target={`translateY(-${Number(ch)}em)`}
              style={{
                transform: `translateY(-${Number(ch)}em)`,
                // Columns settle left to right, so the number "arrives".
                transitionDelay: `${i * 45}ms`,
              }}
            >
              {DIGITS.map((d) => <span key={d}>{d}</span>)}
            </span>
          </span>
        ) : (
          <span key={i} aria-hidden="true">{ch}</span>
        )
      ))}
    </span>
  );
}
