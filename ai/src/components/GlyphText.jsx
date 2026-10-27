import { useRef } from 'react';

// Letters that spin through glyphs when a pointer passes, then settle back.
// Latin text only (a Thai syllable cannot be split into spinning letters).
// Each letter settles on its own clock: delay i * 28 ms, 6 to 9 frames of 32 ms.
const POOL = '.:-=+*#%@/\\|<>~^';

export default function GlyphText({ text, className = '' }) {
  const ref = useRef(null);
  const busy = useRef(false);
  const spin = () => {
    const el = ref.current;
    if (!el || busy.current || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    busy.current = true;
    const spans = [...el.querySelectorAll('span[data-c]')];
    let left = spans.length;
    spans.forEach((s, i) => {
      const real = s.dataset.c;
      if (real === ' ') { left--; return; }
      let n = 6 + ((i * 7) % 4);
      setTimeout(function tick() {
        if (n-- > 0) {
          s.textContent = POOL[(Math.random() * POOL.length) | 0];
          setTimeout(tick, 32);
        } else {
          s.textContent = real;
          if (--left <= 0) busy.current = false;
        }
      }, i * 28);
    });
  };
  // the spinning letters are hidden from screen readers; the word itself is read
  // from a visually hidden copy (aria-label on a plain span is not announced)
  return (
    <span ref={ref} className={`glyph-text ${className}`} onPointerEnter={spin}>
      <span className="sr-only">{text}</span>
      {[...text].map((c, i) => (
        <span key={i} data-c={c} aria-hidden="true">{c}</span>
      ))}
    </span>
  );
}
