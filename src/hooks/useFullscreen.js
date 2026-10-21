// useFullscreen: one writing surface fills the screen.
//
// The PDF reader, the handwriting pad and the image markup all let a student
// write, and all three sat inside the app's header, sidebar and bottom nav.
// "Full screen" is two layers, so it works on every device:
//   1. Always: the element is pinned over the whole viewport (.is-fullscreen)
//      and body.vmx-fullscreen hides the app chrome and stops the page behind
//      it from scrolling. This alone is what an iPhone gets, since Safari on
//      iPhone does not let a page take an element full screen.
//   2. Where the browser allows it, the PAGE asks for real fullscreen
//      (documentElement.requestFullscreen), which hides the browser's own
//      bars. The page, not the element: in element fullscreen everything
//      outside it is hidden, and the app's dialogs (DialogHost, at the root)
//      would wait for an answer nobody can see.
// Leaving by the button, by Esc, or by the browser's own exit (a swipe, the
// system Esc) all end both layers together.
import { useCallback, useEffect, useRef, useState } from 'react';

const fsElement = () => (typeof document === 'undefined' ? null
  : document.fullscreenElement || document.webkitFullscreenElement || null);

export function useFullscreen(ref) {
  const [on, setOn] = useState(false);
  const onRef = useRef(false);
  const exitedAt = useRef(0);

  const exit = useCallback(() => {
    if (!onRef.current) return;
    onRef.current = false;
    exitedAt.current = Date.now();
    setOn(false);
    if (fsElement()) {
      const leave = document.exitFullscreen || document.webkitExitFullscreen;
      try { leave?.call(document)?.catch?.(() => {}); } catch { /* already out */ }
    }
  }, []);

  const enter = useCallback(() => {
    if (!ref.current || onRef.current) return;
    onRef.current = true;
    setOn(true);
    if (fsElement()) return;
    const root = document.documentElement;
    const ask = root.requestFullscreen || root.webkitRequestFullscreen;
    // Refused (iPhone, an iframe, a policy) is fine: layer 1 already holds.
    try { ask?.call(root, { navigationUI: 'hide' })?.catch?.(() => {}); } catch { /* layer 1 only */ }
  }, [ref]);

  const toggle = useCallback(() => (onRef.current ? exit() : enter()), [enter, exit]);

  useEffect(() => {
    if (!on) return undefined;
    document.body.classList.add('vmx-fullscreen');
    // The browser left real fullscreen on its own (Esc, a gesture): follow it.
    const onChange = () => { if (!fsElement()) exit(); };
    // Esc closes an open dialog first; only a bare Esc leaves full screen.
    const onKey = (e) => {
      if (e.key !== 'Escape' || e.defaultPrevented) return;
      if (document.querySelector('[data-vmx-modal="true"], [role="dialog"][aria-modal="true"]')) return;
      exit();
    };
    document.addEventListener('fullscreenchange', onChange);
    document.addEventListener('webkitfullscreenchange', onChange);
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.classList.remove('vmx-fullscreen');
      document.removeEventListener('fullscreenchange', onChange);
      document.removeEventListener('webkitfullscreenchange', onChange);
      window.removeEventListener('keydown', onKey);
    };
  }, [on, exit]);

  // Leaving the screen while full screen must not leave the page locked.
  useEffect(() => () => {
    if (onRef.current && fsElement()) {
      const leave = document.exitFullscreen || document.webkitExitFullscreen;
      try { leave?.call(document)?.catch?.(() => {}); } catch { /* already out */ }
    }
  }, []);

  // True just after leaving: a browser that ends real fullscreen on Esc may
  // still hand that same Esc to the page, and a dialog must not then close.
  const justExited = useCallback(() => Date.now() - exitedAt.current < 400, []);

  return { on, enter, exit, toggle, justExited };
}
