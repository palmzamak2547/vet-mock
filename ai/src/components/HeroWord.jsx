import { useLayoutEffect, useRef } from 'react';
import { graphemes } from '../lib/graphemes.js';

// The changing end of the hero line. The old word thins back into the sea's
// glyph ramp (dense to sparse), the new one condenses out of it (sparse to
// dense) piece by piece, left to right, and the box springs to the new width.
// Direct DOM, no React state per frame. Tapping it asks for the next word.
const RAMP = '.:-=+*#%@';
const STEP = 26; // ms per glyph
const OUT_STAGGER = 22;
const IN_STAGGER = 38;

function paint(el, word, hidden) {
  el.textContent = '';
  for (const g of graphemes(word)) {
    const s = document.createElement('span');
    s.className = hidden ? 'hw-c is-g' : 'hw-c';
    s.textContent = g;
    el.appendChild(s);
  }
}

/** Run every piece through the ramp on its own clock; resolves when all are done. */
function ramp(spans, dir, stagger, keep) {
  let raf = 0;
  const done = new Promise((resolve) => {
    const t0 = performance.now();
    const n = RAMP.length;
    const tick = (now) => {
      let left = false;
      spans.forEach((s, i) => {
        const k = Math.floor((now - t0 - i * stagger) / STEP);
        if (k < 0) { left = true; return; }
        if (k < n) {
          left = true;
          s.className = 'hw-c is-g';
          s.dataset.g = RAMP[dir === 'in' ? k : n - 1 - k];
        } else {
          s.className = dir === 'in' ? 'hw-c' : 'hw-c is-gone';
        }
      });
      if (left) raf = requestAnimationFrame(tick);
      else resolve();
    };
    raf = requestAnimationFrame(tick);
  });
  keep.cancel = () => cancelAnimationFrame(raf);
  return done;
}

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

export default function HeroWord({ word, onSwap, onTap }) {
  const box = useRef(null);
  const ink = useRef(null);
  const shown = useRef(null);
  const run = useRef({ cancel() {} });
  // a parent re-render must not restart (or cut) a swap in flight
  const swapRef = useRef(onSwap);
  swapRef.current = onSwap;

  useLayoutEffect(() => {
    const b = box.current;
    const el = ink.current;
    if (shown.current === null || matchMedia('(prefers-reduced-motion: reduce)').matches) {
      paint(el, word, false);
      shown.current = word;
      return undefined;
    }
    if (word === shown.current) return undefined;
    shown.current = word;
    run.current.cancel();
    let alive = true;
    (async () => {
      // hold the current width, so the line does not jump while the word is swapped
      b.style.width = `${b.offsetWidth}px`;
      await ramp([...el.children], 'out', OUT_STAGGER, run.current);
      if (!alive) return;
      paint(el, word, true);
      const r = b.getBoundingClientRect();
      swapRef.current?.(r.left + r.width / 2, r.top + r.height * 0.62);
      b.style.width = `${el.offsetWidth}px`; // springs (CSS transition on width)
      // the spring settles in ~560 ms; only then hand the width back
      await Promise.all([ramp([...el.children], 'in', IN_STAGGER, run.current), wait(620)]);
      if (!alive) return;
      b.style.width = ''; // its own width again: fonts and window size can change it
    })();
    return () => { alive = false; run.current.cancel(); };
  }, [word]);

  return (
    <span ref={box} className="hw" onPointerDown={onTap}>
      <span ref={ink} className="hw-ink" />
    </span>
  );
}
