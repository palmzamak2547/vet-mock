// ============================================================
// PaletteShell — the one search dialog, from the tap to the close
// ============================================================
// The search box first appears as a frame (PaletteFrame.jsx, in the entry
// chunk) while the palette's code downloads, then the palette takes over. Each
// used to draw a dialog of its own, so the arrival swapped one dialog for
// another under the student's fingers: a key pressed in that instant could land
// on a dialog that was already gone. This shell is the dialog element both draw
// into, so it stays the same element across the swap; the frame and the palette
// each render only what is inside it.
//
// The palette's focus handling (useModalFocus) is pointed at this element, and
// whoever is inside registers what a tap on the dim background does. A child
// finds this element from its own nodes (closest), not through this ref: a
// child's layout effect runs before a parent's ref is attached. Nothing inside
// sets state here, so the shell never re-renders while the palette's code is
// on its way (a state update from the frame made the palette's arrival get
// lost now and then).
// ============================================================

import { createContext, useMemo, useRef } from 'react';

export const PaletteShellContext = createContext(null);

export default function PaletteShell({ onClose, children }) {
  const dialogRef = useRef(null);
  const closer = useRef(null);
  const shell = useMemo(() => ({
    dialogRef,
    setCloser(fn) { closer.current = fn || null; },
  }), []);
  return (
    <div
      className="vmx-modal-overlay"
      onClick={() => (closer.current || onClose)?.()}
      style={{ alignItems: 'flex-start', paddingTop: 'min(12vh, 90px)', backdropFilter: 'blur(5px)' }}
    >
      <div
        ref={dialogRef}
        className="vmx-modal"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: 640, padding: 0, overflow: 'hidden' }}
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
        data-vmx-modal="true"
        aria-label="ค้นหาอัจฉริยะ"
      >
        <PaletteShellContext.Provider value={shell}>{children}</PaletteShellContext.Provider>
      </div>
    </div>
  );
}
