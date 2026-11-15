// ============================================================
// ActivityFigure — four weeks of answers, as a small figure
// ============================================================
// One bar a Bangkok day, oldest on the left: its height is the answers given
// that day, the sage part the ones answered right, so a day's accuracy is the
// share of its bar that is sage. A dashed line marks the median of the days
// that had any answers (what an ordinary study day looks like for this
// student); week ticks name the Monday of each week. The axis states its top
// value instead of drawing a scale. Same language as the explanation figures:
// one accent (sage, the colour of a right answer), ink for data, tabular
// numerals.
//
// Motion: the bars rise from the baseline once, on first paint, with the
// figures' damped spring (response 0.35 s, damping 0.82) and a geometric
// stagger that totals under 300 ms. Only transform moves; under reduced
// motion the finished figure is drawn.
// ============================================================

import { useMemo } from 'react';

const W = 280;
const H = 72;
const GAP = 2;
const MONTHS = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];

/** The numbers the figure draws, pure so a test can read them. */
export function activityModel(days) {
  const list = Array.isArray(days) ? days : [];
  const active = list.filter((d) => d.count > 0);
  const total = active.reduce((s, d) => s + d.count, 0);
  const correct = active.reduce((s, d) => s + (d.correct || 0), 0);
  const max = Math.max(1, ...list.map((d) => d.count));
  const sorted = active.map((d) => d.count).sort((a, b) => a - b);
  const median = sorted.length === 0 ? 0
    : sorted.length % 2 ? sorted[(sorted.length - 1) / 2]
      : (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2;
  return { total, correct, activeDays: active.length, max, median, days: list.length };
}

export default function ActivityFigure({ days }) {
  const m = useMemo(() => activityModel(days), [days]);
  const n = days.length || 1;
  const bw = (W - GAP * (n - 1)) / n;
  const y = (v) => H - (v / m.max) * H;
  const pct = m.total > 0 ? Math.round((m.correct / m.total) * 100) : null;
  const summary = m.total > 0
    ? `${m.days} วันล่าสุด ทำ ${m.total} ข้อ ใน ${m.activeDays} วัน ตอบถูก ${pct}% วันที่ทำมากที่สุด ${m.max} ข้อ`
    : `${m.days} วันล่าสุด ยังไม่มีข้อที่ทำ`;

  return (
    <figure className="vmx-actfig">
      <div className="vmx-actfig-top" aria-hidden="true">
        <span>{m.days} วันล่าสุด</span>
        <span className="vmx-hub-num">สูงสุด {m.max} ข้อต่อวัน</span>
      </div>
      <svg className="vmx-actfig-plot" viewBox={`0 0 ${W} ${H + 8}`} role="img" aria-label={summary} preserveAspectRatio="none">
        <line className="vmx-actfig-base" x1="0" x2={W} y1={H + 0.5} y2={H + 0.5} vectorEffect="non-scaling-stroke" />
        {days.map((d, i) => {
          const x = i * (bw + GAP);
          const hAll = (d.count / m.max) * H;
          const hRight = ((d.correct || 0) / m.max) * H;
          // Geometric stagger: each bar a little sooner than the last one, so
          // the whole row is moving within 280 ms whatever the count.
          const delay = Math.round(280 * (1 - 0.92 ** i) / (1 - 0.92 ** n));
          return (
            <g key={d.date} className="vmx-actfig-day" style={{ transitionDelay: `${delay}ms` }}>
              {d.count > 0 && <rect className="vmx-actfig-all" x={x} y={H - hAll} width={bw} height={hAll} />}
              {d.correct > 0 && <rect className="vmx-actfig-right" x={x} y={H - hRight} width={bw} height={hRight} />}
            </g>
          );
        })}
        {m.activeDays >= 3 && (
          <line className="vmx-actfig-median" x1="0" x2={W} y1={y(m.median)} y2={y(m.median)} vectorEffect="non-scaling-stroke" />
        )}
      </svg>
      <div className="vmx-actfig-axis" aria-hidden="true" style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }}>
        {days.map((d, i) => (d.dow === 1 && i <= n - 4
          ? <span key={d.date} style={{ gridColumn: `${i + 1} / span 4` }}>{d.day} {MONTHS[Number(d.date.slice(5, 7)) - 1]}</span>
          : null))}
      </div>
      <figcaption>
        {m.total > 0 ? (
          <>
            <span><span className="vmx-actfig-key is-right" aria-hidden="true" />ถูก</span>
            <span><span className="vmx-actfig-key" aria-hidden="true" />ผิด</span>
            {m.activeDays >= 3 && <span><span className="vmx-actfig-key is-median" aria-hidden="true" />ปกติวันละ {Math.round(m.median)} ข้อ</span>}
            <span className="vmx-actfig-sum">{m.days} วัน ทำ {m.total.toLocaleString()} ข้อ ใน {m.activeDays} วัน</span>
          </>
        ) : (
          <span>{m.days} วันล่าสุด ยังไม่มีข้อที่ทำ</span>
        )}
      </figcaption>
    </figure>
  );
}
