// The exam date the student sets, and the daily pace that would cover the bank by then.

import { Icon } from './Icon.jsx';
import { Nw } from './bits.jsx';
import { BANK } from '../lib/bank.js';
import { useProgress } from '../lib/hooks.js';
import { statsFor, daysToExam, dailyPace, progressStore } from '../lib/progress.js';
import { localDay } from '../lib/dates.js';
import { num, thaiDay } from '../lib/format.js';
import { upcomingRound } from '../data/exam.js';

export function Plan({ compact = false }) {
  const progress = useProgress();
  const left = BANK.total - statsFor(progress).seen;
  const days = daysToExam(progress, localDay());
  const pace = dailyPace(left, days);
  const setDate = (v) => progressStore.set((s) => ({ ...s, examDate: /^\d{4}-\d{2}-\d{2}$/.test(v) ? v : null }));
  // The announced round, one tap away, until it is the date already set.
  const round = upcomingRound(localDay());
  const suggest = round && progress.examDate !== round.parts[0].date ? round : null;
  return (
    <section className={`plan glass${compact ? ' plan-compact' : ''}`} aria-labelledby="plan-h">
      <div>
        <h2 id="plan-h" className="plan-h">สอบวันไหน</h2>
        <p className="plan-p">ตั้งวันสอบ แล้วรู้ว่าต้องทำวันละกี่ข้อ ถึงจะครบทั้งคลังก่อนวันจริง</p>
      </div>
      <div className="plan-pick">
        <label className="plan-date">
          <span className="label">วันสอบ</span>
          <input type="date" value={progress.examDate || ''} min={localDay()} onChange={(e) => setDate(e.target.value)} />
        </label>
        {suggest && (
          <button type="button" className="chip plan-suggest" onClick={() => setDate(suggest.parts[0].date)}>
            <Icon name="calendar" size={16} />ใช้รอบ {suggest.id} <span className="plan-suggest-d">{thaiDay(suggest.parts[0].date)}</span>
          </button>
        )}
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
                : <>ทำวันละ <b>{num(pace)}</b> ข้อ จะครบอีก <Nw>{num(left)} ข้อ</Nw>ที่ยังไม่เคยทำก่อนวันสอบ</>}</span>
          </>
        )}
      </div>
    </section>
  );
}
