// ============================================================
// StreakHeatmap — GitHub-style year activity grid
// ============================================================
// Visualizes daily practice volume over the last 53 weeks. Each cell
// = one day; color intensity = Qs answered. SVG-based, no library.
// Click a cell to see that day's count + a hint to filter history.
//
// Layout: 7 rows (Sun-Sat) × N weeks. Right-most column = today;
// cells fill leftward. Month labels above. Day labels for Mon/Wed/Fri.
//
// Why: encouragement loop — visible streaks + small daily commits
// reward consistent study, identical to GitHub's contribution graph
// that makes devs habit-form their commit cadence.
// ============================================================

import { useMemo, useState } from 'react';

const CELL = 12;            // px per day cell
const GAP = 3;              // gap between cells
const ROWS = 7;             // days per week (Sun=0..Sat=6)
const WEEKS = 53;
const PAD_TOP = 18;         // space for month labels
const PAD_LEFT = 22;        // space for day labels

// Bucket → CSS color. 5 levels using warm gold/amber gradient
// matching the app's streak theme (fire/gold palette).
function bucket(n) {
  if (n === 0) return 0;
  if (n < 5) return 1;
  if (n < 15) return 2;
  if (n < 30) return 3;
  return 4;
}

const FILL = {
  0: 'var(--clr-surface-2, #ebedf0)',
  1: 'var(--clr-gold-soft, #e8d4a8)',
  2: 'var(--clr-gold-text, #76511e)',
  3: 'var(--clr-gold, #b88940)',
  4: '#d4a020',
};

export default function StreakHeatmap({ history = [] }) {
  const [hovered, setHovered] = useState(null);

  // Build 7 × WEEKS grid keyed by (week, dow) where week is days-back / 7
  // and dow is the day-of-week in our column. We anchor on today's date
  // so the right-most column is the current week, fading into the past.
  const grid = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const totalDays = WEEKS * 7;
    // Map historic dates to count (only count the date day, not time)
    const counts = new Map();
    for (const h of history) {
      const d = new Date(h.date);
      d.setHours(0, 0, 0, 0);
      const key = d.getTime();
      counts.set(key, (counts.get(key) || 0) + 1);
    }
    // Compute the very-leftmost day in the grid: today - (totalDays-1)
    // then snap to the start of THAT week (Sun) so the grid aligns
    const startMs = today.getTime() - (totalDays - 1) * 86400000;
    const startD = new Date(startMs);
    const dow = startD.getDay(); // 0=Sun
    const gridStart = new Date(startMs - dow * 86400000); // back to Sunday
    const cells = [];
    let total = 0;
    for (let w = 0; w < WEEKS + 1; w++) {
      for (let d = 0; d < ROWS; d++) {
        const cellDate = new Date(gridStart.getTime() + (w * 7 + d) * 86400000);
        if (cellDate > today) break;
        const c = counts.get(cellDate.getTime()) || 0;
        total += c;
        cells.push({ w, d, date: cellDate, count: c });
      }
    }
    return { cells, total };
  }, [history]);

  if (grid.cells.length === 0) {
    return (
      <div className="vmx-empty" style={{ fontSize: 13 }}>
        ยังไม่มีข้อมูลเลย — เริ่มทำข้อสอบเพื่อดูสถิติ
      </div>
    );
  }

  // Find unique month labels (for column labels — first cell of each month)
  const monthLabels = [];
  let lastMonth = -1;
  for (const c of grid.cells) {
    if (c.d !== 0) continue; // only Sundays for top label alignment
    const m = c.date.getMonth();
    if (m !== lastMonth) {
      monthLabels.push({ w: c.w, label: c.date.toLocaleDateString('th-TH', { month: 'short' }) });
      lastMonth = m;
    }
  }

  const SVG_W = PAD_LEFT + (WEEKS + 1) * (CELL + GAP);
  const SVG_H = PAD_TOP + ROWS * (CELL + GAP);

  return (
    <div className="vmx-heatmap-wrapper">
      <div className="vmx-heatmap-header">
        <span className="vmx-heatmap-total">
          🔥 {grid.total.toLocaleString('en-US')} ข้อใน 12 เดือน
        </span>
        {hovered && (
          <span className="vmx-heatmap-tooltip">
            {hovered.date.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' })}, {hovered.count} ข้อ
          </span>
        )}
      </div>
      <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
        <svg width={SVG_W} height={SVG_H} role="img" aria-label="แผนที่ความหนาแน่นกิจกรรม 12 เดือน">
          {/* Month labels */}
          {monthLabels.map((m) => (
            <text
              key={`${m.w}-${m.label}`}
              x={PAD_LEFT + m.w * (CELL + GAP)}
              y={12}
              fontSize="10"
              fontFamily="var(--vmx-mono)"
              fill="var(--clr-ink-soft)"
            >
              {m.label}
            </text>
          ))}
          {/* Day labels (Mon/Wed/Fri) */}
          {[1, 3, 5].map((d) => (
            <text
              key={d}
              x={2}
              y={PAD_TOP + d * (CELL + GAP) + 9}
              fontSize="9"
              fontFamily="var(--vmx-mono)"
              fill="var(--clr-ink-soft)"
            >
              {['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'][d]}
            </text>
          ))}
          {/* Cells */}
          {grid.cells.map((c) => {
            const x = PAD_LEFT + c.w * (CELL + GAP);
            const y = PAD_TOP + c.d * (CELL + GAP);
            const isHovered = hovered && hovered.w === c.w && hovered.d === c.d;
            const lvl = bucket(c.count);
            return (
              <rect
                key={`${c.w}-${c.d}`}
                x={x}
                y={y}
                width={CELL}
                height={CELL}
                rx="2"
                fill={FILL[lvl]}
                stroke={isHovered ? 'var(--clr-gold)' : 'transparent'}
                strokeWidth={isHovered ? 2 : 0}
                onMouseEnter={() => setHovered(c)}
                onMouseLeave={() => setHovered(null)}
                style={{ cursor: 'pointer', transition: 'fill 0.15s, stroke 0.15s' }}
              >
                <title>{c.date.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' })}, {c.count} ข้อ</title>
              </rect>
            );
          })}
        </svg>
      </div>
      {/* Legend */}
      <div className="vmx-heatmap-legend">
        <span>น้อย</span>
        {[0, 1, 2, 3, 4].map((b) => (
          <span key={b} className={`vmx-heatmap-legend-dot ${b >= 3 ? 'vmx-heatmap-legend-hot' : ''}`} style={{ background: FILL[b] }} />
        ))}
        <span>มาก 🔥</span>
      </div>
    </div>
  );
}
