// A modal sheet: rises from the bottom on a phone, centred on a desk, and leaves the way it
// came. Owns focus while open (the marked control or the first one in, Tab kept inside,
// Escape and a tap outside close) and returns it after. It is drawn straight into <body>: a
// parent with a transform, a filter or a backdrop-filter (every glass pane has one) becomes the
// containing block of a fixed child, and the sheet would open as a clipped box inside it.

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from './Icon.jsx';
import { reducedMotion } from '../lib/motion.js';

const FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]),select,textarea,[tabindex]:not([tabindex="-1"])';
const EXIT_MS = 200;

export function Sheet({ open, onClose, title, children, wide = false, labelledBy }) {
  const ref = useRef(null);
  const back = useRef(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  // Stay on screen through the exit animation; the content is kept from the last open render.
  const [shown, setShown] = useState(open);
  const [closing, setClosing] = useState(false);
  // True from the render that opens the sheet until its exit is done. A ref and not `shown`: an
  // Escape that lands before the opening's own effects have run closes it while `shown` is still
  // false in that render's closure, and the sheet would stay on screen, shut to its keys and stuck.
  const onScreen = useRef(open);
  if (open) onScreen.current = true;
  const last = useRef(children);
  if (open) last.current = children;

  useEffect(() => {
    if (open) { setShown(true); setClosing(false); return undefined; }
    if (!onScreen.current) return undefined;
    if (reducedMotion()) { onScreen.current = false; setShown(false); return undefined; }
    setClosing(true);
    const t = setTimeout(() => { onScreen.current = false; setShown(false); setClosing(false); }, EXIT_MS);
    return () => clearTimeout(t);
  }, [open]);

  // Keys from a layout effect, so an Escape pressed as the sheet appears is never lost.
  useLayoutEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') { e.stopPropagation(); onCloseRef.current(); return; }
      if (e.key !== 'Tab' || !ref.current) return;
      const items = [...ref.current.querySelectorAll(FOCUSABLE)].filter((el) => el.offsetParent !== null);
      if (!items.length) return;
      const first = items[0];
      const lastItem = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); lastItem.focus(); }
      else if (!e.shiftKey && document.activeElement === lastItem) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', onKey, true);
    return () => document.removeEventListener('keydown', onKey, true);
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    back.current = document.activeElement;
    const el = ref.current?.querySelector('[data-autofocus]') || ref.current?.querySelector(FOCUSABLE);
    el?.focus({ preventScroll: true });
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = overflow;
      if (back.current && document.contains(back.current)) back.current.focus({ preventScroll: true });
    };
  }, [open]);

  if ((!shown && !open) || typeof document === 'undefined') return null;
  const headingId = labelledBy || 'sheet-title';
  return createPortal(
    <div className={`sheet-veil${closing ? ' is-closing' : ''}`} onMouseDown={(e) => { if (e.target === e.currentTarget && open) onClose(); }}>
      <div className={`sheet glass${wide ? ' sheet-wide' : ''}`} role="dialog" aria-modal="true" aria-labelledby={headingId} ref={ref} inert={closing ? '' : undefined}>
        <div className="sheet-head">
          {title && <h2 id={headingId} className="sheet-title">{title}</h2>}
          <button type="button" className="icon-btn" onClick={onClose} aria-label="ปิด"><Icon name="x" /></button>
        </div>
        <div className="sheet-body">{open ? children : last.current}</div>
      </div>
    </div>,
    document.body,
  );
}

/**
 * A question with two answers, in the site's own sheet. window.confirm is not drawn at all in
 * some in-app browsers (LINE's among them), where a delete would silently do nothing or, worse,
 * go ahead unasked. Cancel holds focus first, so a stray Enter never deletes.
 */
export function ConfirmSheet({ open, onClose, onConfirm, title, children, confirm = 'ลบ', cancel = 'ยกเลิก' }) {
  return (
    <Sheet open={open} onClose={onClose} title={title}>
      <p className="sheet-p">{children}</p>
      <div className="sheet-actions">
        <button type="button" className="btn btn-ghost" onClick={onClose} data-autofocus>{cancel}</button>
        <button type="button" className="btn btn-danger" onClick={onConfirm}>{confirm}</button>
      </div>
    </Sheet>
  );
}
