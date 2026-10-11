import { useEffect, useId, useRef, useState } from 'react';
import { BUDDIES, pickBuddy } from '../lib/buddy.js';
import { BUDDY_CHANGED_EVENT, formatBuddyTime, getBuddyStats } from '../lib/buddy-stats.js';
import { artImgFallback } from '../lib/art-fallback.js';
import '../styles-buddy.css';

/**
 * The buddy row: Mochi and the nine clinic mascots, the same on Pomodoro and
 * the Mochi page. A tap keeps that buddy (lib/buddy.js) for every screen and
 * the avatar gives a small hop; the chosen chip carries a ring and a check.
 * On a phone the row scrolls sideways and opens with the chosen buddy in view.
 */
export default function BuddySelector({ selectedId, onSelect, label = 'เลือกคู่หูอ่านหนังสือ', showTime = true }) {
  const labelId = useId();
  const row = useRef(null);
  const [minutes, setMinutes] = useState(readMinutes);
  // The id that was just picked and a counter, so picking it again hops again.
  const [hello, setHello] = useState({ id: null, n: 0 });

  useEffect(() => {
    const refresh = () => setMinutes(readMinutes());
    window.addEventListener(BUDDY_CHANGED_EVENT, refresh);
    return () => window.removeEventListener(BUDDY_CHANGED_EVENT, refresh);
  }, []);

  // A chosen buddy past the edge of a phone row is brought into view, with
  // no animation and only sideways: this corrects where the row starts.
  useEffect(() => {
    const el = row.current;
    const chip = el?.querySelector?.('[aria-pressed="true"]');
    if (el && chip) el.scrollLeft = scrollToReveal(el, chip);
  }, [selectedId]);

  const pick = (id) => {
    pickBuddy(id);
    setHello((h) => ({ id, n: h.n + 1 }));
    onSelect?.(id);
  };

  return (
    <div className="vmx-buddy-picker">
      <div className="vmx-buddy-picker-head">
        <span className="vmx-buddy-picker-label" id={labelId}>{label}</span>
        {showTime && selectedId && (
          <span className="vmx-buddy-picker-time">อ่านด้วยกัน {formatBuddyTime(minutes[selectedId] || 0)}</span>
        )}
      </div>
      <div ref={row} className="vmx-buddy-row" role="group" aria-labelledby={labelId}>
        {BUDDIES.map((buddy) => {
          const selected = buddy.id === selectedId;
          const mins = minutes[buddy.id] || 0;
          return (
            <button
              key={buddy.id}
              type="button"
              className="vmx-buddy-chip"
              aria-pressed={selected}
              onClick={() => pick(buddy.id)}
            >
              {/* Two alternating animation names restart the hop on a second
                  tap without remounting the picture. */}
              <span
                className="vmx-buddy-chip-avatar"
                data-hello={hello.id === buddy.id ? (hello.n % 2 ? 'a' : 'b') : undefined}
                aria-hidden="true"
              >
                <img src={buddy.src} alt="" width={28} height={28} decoding="async" onError={artImgFallback} />
                {selected && (
                  <svg className="vmx-buddy-check" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
                    <path d="M4.5 8.3 7 10.7 11.5 5.6" />
                  </svg>
                )}
              </span>
              <span className="vmx-buddy-chip-name">{buddy.nameTh}</span>
              {showTime && mins > 0 && <span className="vmx-buddy-chip-time">{formatBuddyTime(mins)}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function readMinutes() {
  const out = {};
  for (const buddy of BUDDIES) out[buddy.id] = getBuddyStats(buddy.id).minutes;
  return out;
}

/** The scrollLeft for `row` so `chip` shows: a chip already in full view
 *  stays put (a tap never moves the row under the finger); one cut by an edge
 *  is brought to the middle, with buddies on both sides of it. Clamped to the
 *  row. Pure, for tests. */
export function scrollToReveal(row, chip, margin = 8) {
  const left = chip.offsetLeft - margin;
  const right = chip.offsetLeft + chip.offsetWidth + margin;
  const max = Math.max(0, row.scrollWidth - row.clientWidth);
  if (left >= row.scrollLeft && right <= row.scrollLeft + row.clientWidth) return row.scrollLeft;
  const centred = chip.offsetLeft + chip.offsetWidth / 2 - row.clientWidth / 2;
  return Math.min(max, Math.max(0, centred));
}
