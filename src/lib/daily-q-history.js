// ============================================================
// daily-q-history — emoji-grid history for the Wordle-style share
// ============================================================
//
// Walks back N days from today reading the per-day key that
// `recordTodaysQAnswer` already writes (`vmx-todays-q-{YYYY-MM-DD}`),
// classifying each day as 'correct' | 'wrong' | 'missed'. No new
// storage, no migration — purely a read-only projection of the
// existing daily-q records.
//
// The grid is the share artifact: 🟢 / 🔴 / ⚫️ per day, oldest →
// newest left-to-right, capped at 7 days. Today is always the last
// cell, even when it's still "missed" — it'll flip to 🟢/🔴 the
// moment the user answers.
//
// Plain-Thai month labels match the rest of VetMock copy (no English
// abbreviations like "May 17") — feels native to the audience.
// ============================================================

import { getDailyQResultForDate, todayKey } from './daily-q.js';

const THAI_MONTHS = [
  'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
  'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.',
];

function pad2(n) { return String(n).padStart(2, '0'); }

function dateKeyFromDate(d) {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

// Thai short date for the share text — "17 พ.ค. 2026" reads as
// natural as the rest of the app's Thai copy. Buddhist Era + Latin
// year would muddy the share line, so we keep CE for readability.
export function formatThaiShortDate(dateStr) {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-').map(Number);
  if (!y || !m || !d) return dateStr;
  return `${d} ${THAI_MONTHS[m - 1]} ${y}`;
}

// Walk back `days` days, oldest first. Each row carries the date,
// the localStorage key, and the inferred status. `today` is always
// the last row regardless of whether it was answered yet.
export function getDailyQHistory(days = 7) {
  const out = [];
  const today = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = dateKeyFromDate(d);
    const result = getDailyQResultForDate(key); // 'correct' | 'wrong' | null
    out.push({
      date: key,
      key,
      status: result === null ? 'missed' : result,
    });
  }
  return out;
}

// Emoji choices: green/red circles for hits/misses + ⚫️ for un-answered.
// We pick FILLED circles (🟢🔴) over outlines because filled glyphs
// render consistently across iOS, Android, Windows, web. ⚫️ is the
// black-circle EMOJI presentation (U+26AB) — not the geometric U+25CF —
// so it lands at the same visual weight as the colored circles on every
// platform (tested in Apple Color Emoji + Segoe UI Emoji).
const EMOJI = {
  correct: '🟢',
  wrong: '🔴',
  missed: '⚫️',
};

export function formatEmojiGrid(history) {
  if (!Array.isArray(history) || history.length === 0) return '';
  return history.map((row) => EMOJI[row.status] || EMOJI.missed).join('');
}

export function daysCorrect(history) {
  if (!Array.isArray(history)) return 0;
  return history.filter((r) => r.status === 'correct').length;
}

export function daysCompleted(history) {
  if (!Array.isArray(history)) return 0;
  return history.filter((r) => r.status === 'correct' || r.status === 'wrong').length;
}

// Composes the clipboard payload. Keep this lean: 4 lines max so it
// fits in a single LINE/IG DM message without truncation, and the URL
// auto-linkifies in every chat app we care about.
export function buildShareText({ history, streak, todayDate, todayStatus }) {
  const grid = formatEmojiGrid(history);
  const correct = daysCorrect(history);
  const total = history?.length || 0;
  const dateStr = formatThaiShortDate(todayDate || todayKey());
  const streakLine = streak > 0 ? ` · streak ${streak} 🔥` : '';
  // Suffix the today line with a tiny tag so the reader knows whether
  // today's emoji is settled or still pending — friendlier than just
  // a bare grid.
  const todayTag =
    todayStatus === 'correct' ? ' (วันนี้ ✓)' :
    todayStatus === 'wrong' ? ' (วันนี้ ลองพรุ่งนี้)' :
    '';
  return [
    `VetMock · ข้อวันนี้ · ${dateStr}${todayTag}`,
    `${grid} · ${correct}/${total} days${streakLine}`,
    'https://vetmock.vercel.app',
  ].join('\n');
}

// Export the emoji map so the visual share card can reuse the SAME
// glyphs that go into the text payload — keeps text + image perfectly
// in sync if we ever change a color.
export { EMOJI as DAILY_Q_EMOJI };
