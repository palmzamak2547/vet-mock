// ============================================================
// PaletteFrame — the search box, on screen before the palette's code
// ============================================================
// CommandPalette is a lazy chunk with the whole search index behind it. On a
// cold phone that chunk queued behind the year's question banks and took 4 to
// 9 s to arrive, and nothing on screen meant the tap had worked, so a student
// tapped again or gave up. This frame lives in the entry chunk: the same
// shell, a focused box that keeps what is typed (palette-handoff.js hands it
// to the palette when it mounts), and, when the chunk fails, a line that says
// so with a retry. It owns no search of its own.
// ============================================================

import { useContext, useLayoutEffect, useRef, useState } from 'react';
import { PaletteShellContext } from './PaletteShell.jsx';
import { pointerLauncher } from '../hooks/useModalFocus.js';
import {
  beginPaletteHandoff, clearPaletteHandoff, peekPaletteHandoff, setPaletteHandoffText,
} from '../lib/palette-handoff.js';

export default function PaletteFrame({ onClose, failed = false, onRetry }) {
  const inputRef = useRef(null);
  const [text, setText] = useState(() => peekPaletteHandoff()?.text || '');

  // Layout effect: the box is focused in the commit that shows it, so a key
  // pressed straight after the tap lands in it. The return target is read
  // here, before focus moves.
  useLayoutEffect(() => {
    const active = document.activeElement instanceof HTMLElement && document.activeElement !== document.body
      ? document.activeElement : null;
    const launcher = pointerLauncher();
    beginPaletteHandoff(launcher?.isConnected ? launcher : active);
    const input = inputRef.current;
    if (input) {
      input.focus({ preventScroll: true });
      const end = input.value.length;
      try { input.setSelectionRange(end, end); } catch { /* not a text box */ }
    }
  }, [failed]);

  const close = () => {
    const target = peekPaletteHandoff()?.returnTarget;
    clearPaletteHandoff();
    onClose?.();
    if (target?.isConnected) target.focus({ preventScroll: true });
  };

  // Drawn inside the one search dialog (PaletteShell): mark it as the frame while
  // shown, and let a tap on the dim background close the frame the frame's way.
  const shell = useContext(PaletteShellContext);
  const closeRef = useRef(close);
  closeRef.current = close;
  const bodyRef = useRef(null);
  useLayoutEffect(() => {
    // The dialog is this body's parent in the DOM already; the shell's ref may not be attached yet.
    const dialog = bodyRef.current?.closest('[data-vmx-modal="true"]');
    if (!shell || !dialog) return undefined;
    dialog.setAttribute('data-palette-frame', failed ? 'failed' : 'pending');
    shell.setCloser(() => closeRef.current());
    return () => {
      dialog.removeAttribute('data-palette-frame');
      shell.setCloser(null);
    };
  }, [shell, failed]);

  const onKeyDown = (e) => {
    if (e.nativeEvent?.isComposing || e.keyCode === 229) return;
    if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); close(); return; }
    // One box and, when failed, two buttons: Tab stays inside.
    if (e.key === 'Tab' && !failed) e.preventDefault();
  };

  // Keys are handled on a wrapper that draws no box of its own (display: contents).
  return (
    <div ref={bodyRef} className="vmx-palette-frame-body" onKeyDown={onKeyDown} style={{ display: 'contents' }}>
        <div className="vmx-omni-topbar" aria-hidden="true" />
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12, padding: '16px 20px',
          borderBottom: '1px solid var(--clr-border)',
        }}>
          <span className="vmx-omni-spark" aria-hidden="true" style={{ fontSize: 18, color: 'var(--clr-sage-text)' }}>✦</span>
          <input
            ref={inputRef}
            type="text"
            value={text}
            onChange={(e) => { setText(e.target.value); setPaletteHandoffText(e.target.value); }}
            data-vmx-owns-escape="true"
            placeholder="ค้นหาหรือถามได้เลย"
            aria-label="ค้นหาใน VetMock"
            role="combobox"
            aria-autocomplete="list"
            aria-expanded="false"
            style={{
              all: 'unset', flex: 1, fontSize: 16, color: 'var(--clr-ink)',
              fontFamily: 'inherit', minWidth: 0, textOverflow: 'ellipsis',
            }}
            autoComplete="off"
            spellCheck="false"
          />
        </div>
        {failed ? (
          <div role="alert" style={{ padding: '16px 20px', display: 'grid', gap: 12 }}>
            <p style={{ margin: 0, fontSize: 15, lineHeight: 1.6, color: 'var(--clr-ink)' }}>
              เปิดการค้นหาไม่สำเร็จ ตรวจการเชื่อมต่อแล้วลองอีกครั้ง
            </p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <button type="button" className="vmx-btn vmx-btn-primary" onClick={() => onRetry?.()}>ลองอีกครั้ง</button>
              <button type="button" className="vmx-btn vmx-btn-ghost" onClick={close}>ปิด</button>
            </div>
          </div>
        ) : (
          <p role="status" style={{ margin: 0, padding: '14px 20px', fontSize: 14, color: 'var(--clr-ink-soft)' }}>
            กำลังเปิดการค้นหา พิมพ์รอไว้ได้เลย
          </p>
        )}
    </div>
  );
}
