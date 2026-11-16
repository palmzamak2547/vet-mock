import { useLayoutEffect, useRef, useState } from 'react';

/**
 * The frame a wide note table scrolls in, in the notes reader and the VetWiki
 * article. On a phone a five-column table ran past the screen with its last
 * column cut and nothing to say there was more. When the table is wider than
 * its frame, the frame says so: the edge still to be scrolled to fades, a line
 * under it says the table scrolls sideways, and the frame takes focus so the
 * arrow keys scroll it (the same as RichTable for question tables).
 *
 * Each frame is named so a screen reader's list of regions tells them apart:
 * the table's caption, else its first header cells, else its place on the page.
 */
export function frameName(el) {
  const caption = el.querySelector('caption')?.textContent?.replace(/s+/g, ' ').trim();
  if (caption) return `ตาราง ${caption}`;
  const heads = [...el.querySelectorAll('th')].map((th) => th.textContent.replace(/s+/g, ' ').trim()).filter(Boolean).slice(0, 3);
  if (heads.length) return `ตาราง ${heads.join(', ')}`;
  const all = [...document.querySelectorAll('.vmx-scroll-frame')];
  return `ตารางที่ ${all.indexOf(el) + 1}`;
}

export default function ScrollFrame({ children, className = '', style, label }) {
  const frame = useRef(null);
  const [wide, setWide] = useState(false);
  const [atEnd, setAtEnd] = useState(false);
  const [name, setName] = useState('ตาราง');
  useLayoutEffect(() => {
    const el = frame.current;
    if (!el) return undefined;
    const measure = () => {
      const isWide = el.scrollWidth > el.clientWidth + 1;
      setWide(isWide);
      if (isWide) setName(frameName(el));
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
        aria-label={wide ? `${label || name} เลื่อนไปด้านข้างได้` : undefined}
        tabIndex={wide ? 0 : undefined}
      >
        {children}
      </div>
      {wide && <p className="vmx-scroll-hint">เลื่อนตารางไปด้านข้างเพื่อดูคอลัมน์ที่เหลือ <span aria-hidden="true">→</span></p>}
    </>
  );
}
