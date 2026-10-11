// buddy-stats.js — localStorage-backed stats & selection for VetMock Study Squad companions
//
// Tracks:
// - Selected study companion (buddyId)
// - Focus minutes accumulated per companion
// - Total study sessions completed with companion
//
// Both keys are device-wide on purpose: they sit beside the Pomodoro history
// they come from ('vmx-pomodoro', also device-wide). Exam scores used to be
// added here on every Results mount; nothing displayed them, a Back or a
// reload counted the same exam again and every account on the browser shared
// them, so that recording was removed. A screen that wants it back should key
// each exam on its completion time and scope the key per account (and add it
// to src/lib/account-local-purge.js).

const BUDDY_STATS_KEY = 'vmx-buddy-stats';
export const SELECTED_BUDDY_KEY = 'vmx-selected-buddy';
// Fired on window after the pick or the stats change; useBuddy listens.
export const BUDDY_CHANGED_EVENT = 'vmx-buddy-changed';
// The answer getSelectedBuddy gives when nothing was picked. Screens that show
// "your buddy" read lib/buddy.js instead, where no pick means Mochi.
export const DEFAULT_BUDDY = 'moocha';

function broadcast() {
  try {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event(BUDDY_CHANGED_EVENT));
    }
  } catch {
    /* ignore outside browser */
  }
}

/** Get the currently selected study companion id */
export function getSelectedBuddy() {
  try {
    if (typeof localStorage === 'undefined') return DEFAULT_BUDDY;
    return localStorage.getItem(SELECTED_BUDDY_KEY) || DEFAULT_BUDDY;
  } catch {
    return DEFAULT_BUDDY;
  }
}

/** The companion the student explicitly picked, or null when they never
 *  picked one (getSelectedBuddy answers the default in that case). */
export function getPickedBuddy() {
  try {
    if (typeof localStorage === 'undefined') return null;
    return localStorage.getItem(SELECTED_BUDDY_KEY) || null;
  } catch {
    return null;
  }
}

/** Set the active study companion id */
export function setSelectedBuddy(buddyId) {
  try {
    if (!buddyId || typeof buddyId !== 'string') return;
    localStorage.setItem(SELECTED_BUDDY_KEY, buddyId);
    broadcast();
  } catch {
    /* ignore storage errors */
  }
}

/** Load all companion stats */
export function getAllBuddyStats() {
  try {
    if (typeof localStorage === 'undefined') return {};
    const raw = localStorage.getItem(BUDDY_STATS_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

/** Get stats for a specific companion */
export function getBuddyStats(buddyId) {
  const all = getAllBuddyStats();
  const entry = all[buddyId] || {};
  return {
    minutes: Number(entry.minutes) || 0,
    questions: Number(entry.questions) || 0,
    sessions: Number(entry.sessions) || 0,
  };
}

/** Record focus minutes completed alongside a companion */
export function recordBuddyFocus(buddyId, minutes = 25) {
  if (!buddyId || minutes <= 0) return;
  try {
    const all = getAllBuddyStats();
    const current = all[buddyId] || { minutes: 0, questions: 0, sessions: 0 };
    all[buddyId] = {
      minutes: (current.minutes || 0) + Math.round(minutes),
      questions: current.questions || 0,
      sessions: (current.sessions || 0) + 1,
      lastActive: Date.now(),
    };
    localStorage.setItem(BUDDY_STATS_KEY, JSON.stringify(all));
    broadcast();
  } catch {
    /* ignore storage errors */
  }
}

/** Format accumulated minutes into user-friendly Thai string */
export function formatBuddyTime(totalMinutes = 0) {
  if (totalMinutes <= 0) return '0 นาที';
  if (totalMinutes < 60) return `${totalMinutes} นาที`;
  const hours = Math.floor(totalMinutes / 60);
  const rem = totalMinutes % 60;
  if (rem === 0) return `${hours} ชม.`;
  return `${hours} ชม. ${rem} นาที`;
}
