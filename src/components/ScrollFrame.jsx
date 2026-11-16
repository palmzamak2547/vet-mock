import { useLayoutEffect, useRef, useState } from 'react';

/**
 * The frame a wide note table scrolls in, in the notes reader and the VetWiki
 * article. On a phone a five-column table ran past the screen with its last
 * column cut and nothing to say there was more. When the table is wider than
 * its frame, the frame says so: the edge still to be scrolled to fades, a line
 * under it says the table scrolls sideways, and the frame takes focus so the
 * arrow keys scroll it (the same as RichTable for question tables).
 */
export default function ScrollFrame({ children, className = '', style, label = 'ตาราง' }) {
  const frame = useRef(null);
  const [wide, setWide] = useState(false);
  const [atEnd, setAtEnd] = useState(false);
  useLayoutEffect(() => {
    const el = frame.current;
    if (!el) return undefined;
    const measure = () => {
      setWide(el.scrollWidth > el.clientWidth + 1);
      setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 1);
    };
    measure();
    el.addEventListener('scroll', measure, { passive: true });
    let watch = null;
    if (typeof ResizeObserver !== 'undefined') {
      watch = new ResizeObserver(measure);
      watch.observe(el);
      if (el.firstElementChild) watch.observe(el.firstElementChild);
    }
    return () => {
      el.removeEventListener('scroll', measure);
      watch?.disconnect();
    };
  }, []);
  return (
    <>
      <div
        ref={frame}
        className={`vmx-scroll-frame${wide ? ' is-wide' : ''}${wide && atEnd ? ' is-at-end' : ''}${className ? ` ${className}` : ''}`}
        style={style}
        role={wide ? 'region' : undefined}
        aria-label={wide ? `${label} เลื่อนไปด้านข้างได้` : undefined}
        tabIndex={wide ? 0 : undefined}
      >
        {children}
      </div>
      {wide && <p className="vmx-scroll-hint">เลื่อนตารางไปด้านข้างเพื่อดูคอลัมน์ที่เหลือ <span aria-hidden="true">→</span></p>}
    </>
  );
}
