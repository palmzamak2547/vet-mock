import { useEffect, useRef } from 'react';

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'area[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

// iOS/WebKit does not consistently focus a button after a tap. Remember the
// actual pointer launcher so closing a lazily-mounted modal can still return
// focus to the control the user used, rather than dropping it on <body>.
let lastPointerLauncher = null;
if (typeof document !== 'undefined') {
  document.addEventListener('pointerdown', (event) => {
    const target = event.target instanceof Element
      ? event.target.closest('button, a[href], input, select, textarea, [role="button"]')
      : null;
    if (target instanceof HTMLElement) lastPointerLauncher = target;
  }, true);
}

function isAvailable(element) {
  if (!(element instanceof HTMLElement)) return false;
  if (element.closest('[aria-hidden="true"], [inert]')) return false;
  return element.getClientRects().length > 0;
}

function getFocusableElements(container) {
  if (!container) return [];
  return Array.from(container.querySelectorAll(FOCUSABLE_SELECTOR)).filter(isAvailable);
}

/**
 * Consistent keyboard behavior for the app's modal dialogs.
 *
 * The hook deliberately owns behavior only. Views keep their own visual shell,
 * while focus entry, focus trapping, Escape, nested-modal ordering, and focus
 * restoration stay identical across features.
 */
export function useModalFocus({ active = true, onClose, initialFocusRef } = {}) {
  const dialogRef = useRef(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  useEffect(() => {
    if (!active) return undefined;

    const activeElement = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;
    const returnTarget = activeElement && activeElement !== document.body
      ? activeElement
      : lastPointerLauncher?.isConnected ? lastPointerLauncher : null;
    lastPointerLauncher = null;

    const focusDialog = () => {
      const target = initialFocusRef?.current
        || getFocusableElements(dialogRef.current)[0]
        || dialogRef.current;
      target?.focus({ preventScroll: true });
    };

    const frame = window.requestAnimationFrame(focusDialog);

    const onKeyDown = (event) => {
      const dialog = dialogRef.current;
      if (!dialog) return;

      // Only the visually top-most migrated modal handles the event. This
      // prevents Escape in a share/summary modal from also closing its parent.
      const openDialogs = document.querySelectorAll('[data-vmx-modal="true"]');
      if (openDialogs.length && openDialogs[openDialogs.length - 1] !== dialog) return;

      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
        closeRef.current?.();
        return;
      }

      if (event.key !== 'Tab') return;

      const focusable = getFocusableElements(dialog);
      if (focusable.length === 0) {
        event.preventDefault();
        dialog.focus({ preventScroll: true });
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const current = document.activeElement;

      if (event.shiftKey && (current === first || !dialog.contains(current))) {
        event.preventDefault();
        last.focus({ preventScroll: true });
      } else if (!event.shiftKey && (current === last || !dialog.contains(current))) {
        event.preventDefault();
        first.focus({ preventScroll: true });
      }
    };

    document.addEventListener('keydown', onKeyDown, true);
    return () => {
      window.cancelAnimationFrame(frame);
      document.removeEventListener('keydown', onKeyDown, true);
      if (returnTarget?.isConnected) returnTarget.focus({ preventScroll: true });
    };
  }, [active, initialFocusRef]);

  return dialogRef;
}
