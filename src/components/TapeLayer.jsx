// TapeLayer: the strips covering answers on one page, and the one being laid.
//
// Each tape is a button: tap to peel it (it lifts and goes see-through, the
// answer shows), tap the faint outline to stick it back. Whether a tape is
// peeled lives only in this sitting (the reader's `peeled` set), so a deck
// always opens with its answers covered. Geometry is normalised page space,
// laid out in the page's CSS px.
import React from 'react';
import { tapeRect } from '../lib/tape.js';

export default function TapeLayer({ w, h, tapes = [], draft = null, peeled, onToggle, interactive = true }) {
  return (
    <div className="vmx-tapes">
      {tapes.map((t, i) => {
        const r = tapeRect(t);
        const open = peeled?.has(t.id);
        return (
          <button
            key={t.id}
            type="button"
            className={`vmx-tape${open ? ' is-peeled' : ''}`}
            style={{
              left: r.x * w, top: r.y * h, width: r.w * w, height: r.h * h, '--tape': t.color,
              // A slight, fixed tilt per tape, so a page of them reads as hand-laid.
              '--tilt': `${((i * 37) % 5) - 2}deg`,
              pointerEvents: interactive ? 'auto' : 'none',
            }}
            aria-pressed={open}
            aria-label={open ? 'เทปที่ลอกแล้ว แตะเพื่อปิดคำตอบอีกครั้ง' : 'เทปปิดคำตอบ แตะเพื่อลอกดู'}
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => onToggle?.(t.id)}
          />
        );
      })}
      {draft && (() => {
        const r = tapeRect(draft);
        return <span className="vmx-tape is-draft" aria-hidden="true"
          style={{ left: r.x * w, top: r.y * h, width: r.w * w, height: r.h * h, '--tape': draft.color }} />;
      })()}
    </div>
  );
}
