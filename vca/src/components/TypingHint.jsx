// What to type, shown by typing it: placed right after an empty input or textarea, the examples
// type themselves out, pause, and erase, one after another. It only runs while the field is
// empty, unfocused, on screen and in a visible tab, and never when motion is reduced; otherwise
// the field's own placeholder (the same examples, still) is what shows. Screen readers get that
// placeholder too: the moving copy is aria-hidden.
//
//   <input value={q} placeholder="เช่น Leptospira, PCV2" ... />
//   <TypingHint examples={['Leptospira', 'PCV2']} />

import { useEffect, useRef } from 'react';
import { reducedMotion } from '../lib/motion.js';

// Thai is typed a whole character at a time (consonant with its vowel and tone marks), so a
// mark never shows up floating on its own.
const SEGMENTER = typeof Intl !== 'undefined' && Intl.Segmenter ? new Intl.Segmenter('th', { granularity: 'grapheme' }) : null;
const graphemes = (s) => (SEGMENTER ? [...SEGMENTER.segment(s)].map((g) => g.segment) : Array.from(s));

// Timing, from people typing. A 60 wpm typist makes 60 x 5 = 300 characters a minute, 200 ms
// each; a demo at about 2.3 times that pace (85 ms) still reads as someone typing. Real gaps
// between keys spread log-normally, so each gap is 85 ms times e^(0.3 z), clamped to 0.55 to 1.8
// of it; a space adds a beat, the pause between words. Erasing runs at a held Backspace's repeat
// rate, about 30 a second (33 ms). The finished example stays long enough to read: 900 ms plus
// 40 ms a character (about 25 characters a second), between 1.2 and 2.6 s.
const TYPE_MS = 85;
const SIGMA = 0.3;
const SPACE_MS = 110;
const ERASE_MS = 33;
const START_MS = 650; // after the page's entrances (motion.css runs them for about 600 ms)
const NEXT_MS = 380;
const holdMs = (n) => Math.min(2600, Math.max(1200, 900 + 40 * n));
const keyGap = () => {
  const z = Math.sqrt(-2 * Math.log(1 - Math.random())) * Math.cos(2 * Math.PI * Math.random());
  return TYPE_MS * Math.min(1.8, Math.max(0.55, Math.exp(SIGMA * z)));
};

const COPY = ['fontFamily', 'fontSize', 'fontWeight', 'fontStyle', 'letterSpacing', 'lineHeight', 'textAlign'];

export function TypingHint({ examples }) {
  const ghost = useRef(null);
  const recheck = useRef(null);
  const key = (examples || []).join('\n');

  // The parent re-renders when the field's value changes, including a value set from code (a
  // search cleared by a button, a reply sent), which fires no input event.
  useEffect(() => { recheck.current?.(); });

  useEffect(() => {
    const out = ghost.current;
    const field = out?.previousElementSibling;
    const list = key ? key.split('\n') : [];
    if (!out || !field || !/^(INPUT|TEXTAREA)$/.test(field.tagName) || !list.length || reducedMotion()) return undefined;
    const text = document.createTextNode('');
    out.insertBefore(text, out.firstChild);
    // The copy is placed from the field's offsets, so both must measure from the same box.
    const holder = out.parentElement;
    if (getComputedStyle(holder).position === 'static') holder.style.position = 'relative';
    const multiline = field.tagName === 'TEXTAREA';

    // Sit exactly where the field's own text starts, in its font.
    const place = () => {
      const cs = getComputedStyle(field);
      const left = field.offsetLeft + parseFloat(cs.borderLeftWidth) + parseFloat(cs.paddingLeft);
      const width = field.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
      out.style.left = `${left}px`;
      out.style.width = `${Math.max(0, width)}px`;
      if (multiline) {
        out.style.top = `${field.offsetTop + parseFloat(cs.borderTopWidth) + parseFloat(cs.paddingTop)}px`;
        out.style.height = '';
      } else {
        out.style.top = `${field.offsetTop + parseFloat(cs.borderTopWidth)}px`;
        out.style.height = `${field.clientHeight}px`;
      }
      for (const p of COPY) out.style[p] = cs[p];
    };

    let timer = 0;
    let inView = false;
    let which = 0;
    let parts = [];
    let n = 0;
    const can = () => inView && !document.hidden && !field.value && document.activeElement !== field;
    const show = (on) => {
      out.classList.toggle('is-on', on);
      if (on) field.dataset.typing = ''; else delete field.dataset.typing;
    };
    const write = () => { text.nodeValue = parts.slice(0, n).join(''); };
    const stop = () => {
      clearTimeout(timer);
      timer = 0;
      n = 0;
      text.nodeValue = '';
      out.classList.remove('is-holding');
      show(false);
    };
    const type = () => {
      if (!can()) { stop(); return; }
      n += 1;
      write();
      if (n >= parts.length) {
        out.classList.add('is-holding');
        timer = setTimeout(() => { out.classList.remove('is-holding'); erase(); }, holdMs(parts.length));
        return;
      }
      timer = setTimeout(type, keyGap() + (parts[n - 1] === ' ' ? SPACE_MS : 0));
    };
    const erase = () => {
      if (!can()) { stop(); return; }
      n -= 1;
      write();
      if (n > 0) { timer = setTimeout(erase, ERASE_MS); return; }
      which = (which + 1) % list.length;
      parts = graphemes(list[which]);
      timer = setTimeout(type, NEXT_MS);
    };
    const check = () => {
      if (!can()) { if (timer || out.classList.contains('is-on')) stop(); return; }
      if (timer) return;
      place();
      parts = graphemes(list[which]);
      n = 0;
      write();
      show(true);
      timer = setTimeout(type, START_MS);
    };

    const io = new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; check(); });
    io.observe(field);
    const ro = typeof ResizeObserver === 'function' ? new ResizeObserver(() => { if (timer) place(); }) : null;
    ro?.observe(field);
    const events = ['focus', 'blur', 'input'];
    events.forEach((e) => field.addEventListener(e, check));
    document.addEventListener('visibilitychange', check);
    recheck.current = check;
    return () => {
      io.disconnect();
      ro?.disconnect();
      events.forEach((e) => field.removeEventListener(e, check));
      document.removeEventListener('visibilitychange', check);
      recheck.current = null;
      stop();
      text.remove();
    };
  }, [key]);

  return (
    <span ref={ghost} className="typing-hint" aria-hidden="true"><i className="typing-caret" /></span>
  );
}
