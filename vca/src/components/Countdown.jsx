// Days to the exam, as a pill that opens the exam page. The student's own date wins when they
// have set one; otherwise the next round the evaluation centre has announced.

import { Link } from './Link.jsx';
import { Icon } from './Icon.jsx';
import { upcomingRound } from '../data/exam.js';
import { daysBetween } from '../lib/dates.js';
import { num } from '../lib/format.js';
import { useProgress, useToday } from '../lib/hooks.js';

export function Countdown({ className = '' }) {
  const progress = useProgress();
  const today = useToday();
  const round = upcomingRound(today);
  const own = progress.examDate && progress.examDate >= today ? progress.examDate : null;
  const roundDay = round?.parts[0].date;
  // Under way (the second day of the round): count to its last day, as the exam page does.
  const lastDay = round?.parts[round.parts.length - 1].date;
  const day = own || (roundDay && roundDay >= today ? roundDay : lastDay && lastDay >= today ? lastDay : null);
  const days = day ? daysBetween(today, day) : null;
  const label = own && own !== roundDay ? 'วันสอบของคุณ' : round ? `สอบรอบ ${round.id}` : 'รอบสอบถัดไป';
  return (
    <Link to="/exam" className={`countdown glass ${className}`}>
      <span className="countdown-dot" aria-hidden="true" />
      <span className="countdown-k">{label}</span>
      <b className="countdown-n">{days === null ? 'รอประกาศ' : days === 0 ? 'วันนี้' : `อีก ${num(days)} วัน`}</b>
      <Icon name="arrowRight" size={16} />
    </Link>
  );
}
