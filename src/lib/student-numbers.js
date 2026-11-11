// student-numbers.js — the three numbers a student's card shows, from the
// same readers the profile hub uses, so the card and the hub cannot disagree:
//   answered  every history row (the hub's useStats total)
//   streak    the saved streak as of today, streakShown (the hub's and
//             Home's "วันต่อเนื่อง"; it knows about a freeze)
//   trophies  earnedBadges() with that streak, the hub's trophy shelf
// All synced data; the device-only XP counter is never read.
import { streakShown } from '../hooks/utils.js';
import { earnedBadges } from './badges.js';

export function studentNumbers({ history = [], streakData = null, srCards = {}, badges = null, now = Date.now() } = {}) {
  const rows = Array.isArray(history) ? history : [];
  const streak = streakShown(streakData, now);
  return {
    answered: rows.length,
    streak,
    trophies: (badges || earnedBadges({ history: rows, srCards, currentStreak: streak })).length,
  };
}
