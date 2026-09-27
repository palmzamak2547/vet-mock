// A modal dialog: traps focus, closes on Escape, gives focus back to what opened it, and labels
// itself with its heading. Used for confirmations, the account menu on phones, and forms.
// OWNER: workspace role.
import { useEffect, useRef } from 'react';
import { useT } from '../../i18n/index.js';
import Icon from './Icon.jsx';

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * @param {{ open: boolean, onClose: () => void, title: string, children: any, footer?: any, wide?: boolean, labelledBy?: string }} props
 */
export default function Dialog({ open, onClose, title, children, footer = null, wide = false }) {
  const { t } = useT();
  const ref = useRef(null);
  const back = useRef(null);
  const titleId = useRef(`rs-dlg-${Math.random().toString(36).slice(2, 9)}`).current;

  useEffect(() => {
    if (!open) return undefined;
    back.current = document.activeElement;
    const node = ref.current;
    const first = node?.querySelector('[data-autofocus]') || node?.querySelector(FOCUSABLE);
    (first || node)?.focus();
    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
        return;
      }
      if (e.key !== 'Tab' || !node) return;
      const items = [...node.querySelectorAll(FOCUSABLE)].filter((el) => el.offsetParent !== null || el === document.activeElement);
      if (!items.length) return;
      const firstEl = items[0];
      const lastEl = items[items.length - 1];
      if (e.shiftKey && document.activeElement === firstEl) { e.preventDefault(); lastEl.focus(); }
      else if (!e.shiftKey && document.activeElement === lastEl) { e.preventDefault(); firstEl.focus(); }
    };
    node?.addEventListener('keydown', onKey);
    return () => {
      node?.removeEventListener('keydown', onKey);
      if (back.current && typeof back.current.focus === 'function') back.current.focus();
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="rs-dlg-scrim" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div ref={ref} className={`rs-dlg${wide ? ' rs-dlg--wide' : ''}`} role="dialog" aria-modal="true" aria-labelledby={titleId} tabIndex={-1}>
        <div className="rs-dlg-head">
          <h2 id={titleId} className="rs-dlg-title">{title}</h2>
          <button type="button" className="rs-iconbtn" onClick={onClose} aria-label={t('ws.dialog.close')}>
            <Icon name="close" />
          </button>
        </div>
        <div className="rs-dlg-body">{children}</div>
        {footer ? <div className="rs-dlg-foot">{footer}</div> : null}
      </div>
    </div>
  );
}
