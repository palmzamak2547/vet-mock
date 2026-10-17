// A number that counts up the first time it comes into view. Screen readers get the final
// value at once; "reduce motion" shows it at once too.

import { useEffect, useRef, useState } from 'react';
import { reducedMotion } from '../lib/motion.js';
import { num } from '../lib/format.js';

export function CountUp({ value, format = num, duration = 1200, className }) {
  const ref = useRef(null);
  const [shown, setShown] = useState(() => (reducedMotion() || typeof IntersectionObserver === 'undefined' ? value : 0));
  useEffect(() => {
    if (reducedMotion() || typeof IntersectionObserver === 'undefined') { setShown(value); return undefined; }
    let raf = 0;
    let started = false;
    const run = () => {
      const t0 = performance.now();
      const step = (t) => {
        const k = Math.min(1, (t - t0) / duration);
        const eased = 1 - (1 - k) ** 4;
        setShown(value * eased);
        if (k < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    };
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started) { started = true; io.disconnect(); run(); }
    }, { threshold: 0.3 });
    if (ref.current) io.observe(ref.current);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [value, duration]);
  const whole = Number.isInteger(value);
  return (
    <span ref={ref} className={className}>
      <span className="sr">{format(value)}</span>
      <span aria-hidden="true">{format(whole ? Math.round(shown) : shown)}</span>
    </span>
  );
}
