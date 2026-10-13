// ============================================================
// DailyQShareCard — share the daily question's week
// ============================================================
//
// Mounted on top of TodaysQModal after the student has revealed an answer.
// The picture (lib/share-card/daily-card.js) is a row of seven drawn slides,
// one a day; the text that travels with it is the emoji grid the chat apps
// render natively (lib/daily-q-history.js), so copying it still works.
// ============================================================

import { useCallback, useMemo } from 'react';
import {
  buildShareText,
  daysCorrect,
  getDailyQHistory,
} from '../lib/daily-q-history.js';
import { dailyQStreak, todayKey } from '../lib/daily-q.js';
import { drawDailyCard, DAILY_STRIP } from '../lib/share-card/daily-card.js';
import { thaiDate, picture } from '../lib/share-card/kit.js';
import { MOCHI_POSE_ASSETS } from '../data/mochi-poses.generated.js';
import ShareCardSheet from './ShareCardSheet.jsx';

export default function DailyQShareCard({ todayResult, streak: streakProp, onClose }) {
  // Snapshot history + streak at mount, so the picture and the text never
  // change between opening the sheet and sharing it.
  const history = useMemo(() => getDailyQHistory(7), []);
  const streak = useMemo(
    () => (typeof streakProp === 'number' ? streakProp : dailyQStreak()),
    [streakProp],
  );
  const todayDate = useMemo(() => todayKey(), []);
  // The parent passes the freshly computed result, so the card reflects what
  // the student just did rather than a storage read that may lag.
  const todayStatus =
    todayResult === true || todayResult === 'correct' ? 'correct' :
    todayResult === false || todayResult === 'wrong' ? 'wrong' :
    history[history.length - 1]?.status || 'missed';

  const rows = useMemo(
    () => history.map((row, i) => (i === history.length - 1 ? { ...row, status: todayStatus } : row)),
    [history, todayStatus],
  );
  const shareText = useMemo(
    () => buildShareText({ history: rows, streak, todayDate, todayStatus }),
    [rows, streak, todayDate, todayStatus],
  );
  const draw = useCallback(async (theme) => {
    const pose = todayStatus === 'correct' ? 'correct' : todayStatus === 'wrong' ? 'encourage' : 'idle';
    const [mochi, strip] = await Promise.all([picture(MOCHI_POSE_ASSETS[pose]), picture(DAILY_STRIP)]);
    return drawDailyCard({ history: rows, streak, todayDate, todayStatus }, { theme, mochi, strip });
  }, [rows, streak, todayDate, todayStatus]);
  const correct = daysCorrect(rows);

  return (
    <ShareCardSheet
      title="แชร์ข้อประจำวัน"
      onClose={onClose}
      draw={draw}
      fileBase={`vetmock-daily-${todayDate}`}
      shareText={shareText}
      alt={`ข้อประจำวัน ${thaiDate(todayDate)}: ตอบถูก ${correct} จาก ${rows.length} วัน${streak >= 2 ? ` ต่อเนื่อง ${streak} วัน` : ''}`}
    />
  );
}
