// Shared utility functions

export const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

export const fmtTime = (s) => {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
};

export const fmtDate = (ts) => {
  const d = new Date(ts);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const compareDate = new Date(ts);
  compareDate.setHours(0, 0, 0, 0);
  const diffDays = Math.round((compareDate - today) / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return 'วันนี้';
  if (diffDays === 1) return 'พรุ่งนี้';
  if (diffDays === -1) return 'เมื่อวาน';
  if (diffDays > 0) return `อีก ${diffDays} วัน`;
  return `${Math.abs(diffDays)} วันที่แล้ว`;
};

export const isCorrect = (q, ua) => {
  if (ua === null || ua === undefined) return false;
  if (q.type === 'mcq' || q.type === 'tf') return ua === q.answer;
  if (q.type === 'fill') {
    if (!Array.isArray(ua)) return false;
    return q.blanks.every((b, i) => {
      const u = (ua[i] || '').toLowerCase().trim();
      const bl = b.toLowerCase().trim();
      return u === bl || (u.length > 2 && (u.includes(bl) || bl.includes(u)));
    });
  }
  if (q.type === 'match') {
    if (!ua || typeof ua !== 'object') return false;
    return q.pairs.every((p, i) => ua[i] === p.right);
  }
  return false;
};

// Check if today is a new study day (for streak)
export function updateStreak(lastStudyDate, currentStreak) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayTs = today.getTime();

  if (!lastStudyDate) return { streak: 1, lastDate: todayTs };

  const last = new Date(lastStudyDate);
  last.setHours(0, 0, 0, 0);
  const diff = Math.round((todayTs - last.getTime()) / (1000 * 60 * 60 * 24));

  if (diff === 0) return { streak: currentStreak, lastDate: lastStudyDate }; // Same day
  if (diff === 1) return { streak: currentStreak + 1, lastDate: todayTs }; // Next day
  return { streak: 1, lastDate: todayTs }; // Gap — reset streak
}

export function downloadJSON(data, filename) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
