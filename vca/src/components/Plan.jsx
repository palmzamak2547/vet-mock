// The exam date the student sets, and the daily pace that would cover the bank by then.

import { Icon } from './Icon.jsx';
import { Nw } from './bits.jsx';
import { Link } from './Link.jsx';
import { BANK } from '../lib/bank.js';
import { useProgress } from '../lib/hooks.js';
import { statsFor, daysToExam, dailyPace, progressStore } from '../lib/progress.js';
import { localDay } from '../lib/dates.js';
import { num, thaiDay } from '../lib/format.js';
import { upcomingRounds } from '../data/exam.js';

export function Plan({ compact = false }) {
  const progress = useProgress();
  const left = BANK.total - statsFor(progress).seen;
  const setDate = (v) => progressStore.set((s) => ({ ...s, examDate: /^\d{4}-\d{2}-\d{2}$/.test(v) ? v : null }));
  // Until the student sets a date, the plan reads from the next announced round: the date is
  // known, and an empty plan asked for it twice (home and the exam page). Nothing is stored
  // until they choose; the announced round stays one tap away once another date is set.
  const rounds = upcomingRounds(localDay());
  const round = rounds[0] || null;
  const assumed = !progress.examDate && round ? round : null;
  const date = progress.examDate || assumed?.parts[0].date || null;
  const days = daysToExam({ ...progress, examDate: date }, localDay());
  const pace = dailyPace(left, days);
  // Every announced round the chosen date is not, so a student sitting a later round finds it too.
  const suggest = rounds.filter((r) => r.parts[0].date !== date);
  // A heavy daily amount gets a smaller first goal beside it: the past papers and VCA-style
  // questions, the closest thing to the paper itself.
  const heavy = pace != null && pace > 40;
  return (
    <section className={`plan glass${compact ? ' plan-compact' : ''}`} aria-labelledby="plan-h">
      <div>
        <h2 id="plan-h" className="plan-h">สอบวันไหน</h2>
        <p className="plan-p">ตั้งวันสอบ แล้วรู้ว่าต้องทำวันละกี่ข้อ ถึงจะครบทั้งคลังก่อนวันจริง</p>
      </div>
      <div className="plan-pick">
        <label className="plan-date">
          <span className="label">วันสอบ</span>
          <input type="date" value={date || ''} min={localDay()} onChange={(e) => setDate(e.target.value)} />
        </label>
        {assumed && <span className="hint plan-assumed">ใช้วันสอบรอบ {assumed.id} ไว้ก่อน เปลี่ยนได้</span>}
        {suggest.map((r) => (
          <button key={r.id} type="button" className="chip plan-suggest" onClick={() => setDate(r.parts[0].date)}>
            <Icon name="calendar" size={16} />ใช้รอบ {r.id} <span className="plan-suggest-d">{thaiDay(r.parts[0].date)}</span>
          </button>
        ))}
      </div>
      <div className="plan-out" aria-live="polite">
        {days == null ? (
          <span className="hint">ยังไม่ได้ตั้งวันสอบ</span>
        ) : days < 0 ? (
          <span>วันสอบผ่านไปแล้ว ตั้งวันใหม่ได้เลย</span>
        ) : (
          <>
            <span className="plan-n">{num(days)}<small>วัน</small></span>
            <span className="plan-t">{days === 0
              ? 'สอบวันนี้ ขอให้โชคดี'
              : left <= 0 ? 'ทำครบทั้งคลังแล้ว ทบทวนข้อที่พลาดต่อได้เลย'
                : <>ทำวันละ <b>{num(pace)}</b> ข้อ ก็ครบ <Nw>{num(left)} ข้อ</Nw>ที่ยังไม่เคยทำก่อนวันสอบ</>}</span>
            {heavy && left > 0 && <Link to="/practice?src=paper" className="text-link plan-first">ยังไม่ต้องครบทุกข้อ เริ่มจากข้อสอบเก่าและแนว VCA ก่อนได้ <Icon name="arrowRight" size={16} /></Link>}
          </>
        )}
      </div>
    </section>
  );
}
