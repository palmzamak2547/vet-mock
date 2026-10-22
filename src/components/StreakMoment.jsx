// ============================================================
// StreakMoment — the day count, after the first set of a day
// ============================================================
// Reads lib/streak-moment.js: what this set did to the saved streak. The
// words follow the record's own rule (hooks/utils.js updateStreak), so the
// pause day is described the way it is actually earned. No card for a second
// set on the same day: nothing changed.
// ============================================================

import NavIcon from './NavIcon.jsx';

const COPY = {
  started: () => ['เริ่มนับวันต่อเนื่องแล้ว', 'วันนี้เป็นวันที่ 1 พรุ่งนี้ทำอีกชุดจะเป็น 2 วัน'],
  extended: (days, milestone) => [milestone ? `ครบ ${days} วันติดต่อกัน` : `ต่อเนื่อง ${days} วัน`, 'วันนี้ทำแล้ว พรุ่งนี้มาต่ออีกวัน'],
  kept: (days) => [`ยังต่อเนื่อง ${days} วัน`, 'เมื่อวานเว้นไป 1 วัน แต่ทำติดกันมาตั้งแต่ 5 วันขึ้นไป จึงนับต่อให้ได้หนึ่งครั้ง'],
  restarted: () => ['เริ่มนับวันต่อเนื่องใหม่', 'วันนี้เป็นวันที่ 1 มาทำต่อทุกวันเพื่อสะสมอีกครั้ง'],
};

export default function StreakMoment({ moment, className = '', style }) {
  const copy = moment && COPY[moment.kind];
  if (!copy) return null;
  const [title, sub] = copy(moment.days, moment.milestone);
  const classes = ['vmx-streak-moment', `is-${moment.kind}`, moment.first && 'is-first', moment.milestone && 'is-milestone', className].filter(Boolean).join(' ');
  return (
    <div className={classes} style={style}>
      <span className="vmx-streak-moment-flame" aria-hidden="true"><NavIcon name="flame" size={28} /></span>
      <div className="vmx-streak-moment-text">
        <strong>{title}</strong>
        <span>{sub}</span>
      </div>
      {Array.isArray(moment.week) && (
        <span className="vmx-streak-moment-week" aria-hidden="true">
          {moment.week.map((d) => <i key={d.date} className={[d.studied && 'is-on', d.isToday && 'is-today'].filter(Boolean).join(' ')} />)}
        </span>
      )}
    </div>
  );
}
