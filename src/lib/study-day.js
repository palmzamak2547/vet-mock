// The study day: one rule for every "today" a student reads.
//
// Days are Bangkok's (UTC+7, no daylight saving), never the device's. The
// streak and Home's "วันนี้ N ข้อ" already counted Bangkok days, while the
// daily question, the XP chip, quests and the daily goal card counted the
// device's: on a phone set to another zone the two kinds split for hours a
// day (on a UTC phone from 00:00 to 07:00 Bangkok, the streak had moved to
// the new day and the daily question, its tick and "วันนี้" XP had not).
// Keys keep their YYYY-MM-DD shape, so on a phone in Bangkok nothing stored
// changes meaning.
const BANGKOK_OFFSET_MS = 7 * 60 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;

/** Bangkok calendar day of an instant as YYYY-MM-DD; '' for a value that is not a time. */
export const dayKey = (value) => {
  const b = new Date(new Date(value).getTime() + BANGKOK_OFFSET_MS);
  return Number.isNaN(b.getTime()) ? '' : b.toISOString().slice(0, 10);
};

/** The YYYY-MM-DD key `n` days before `key` (calendar arithmetic, no zone). */
export const dayKeyBefore = (key, n = 1) => {
  const t = Date.parse(`${key}T00:00:00Z`);
  return Number.isNaN(t) ? '' : new Date(t - n * DAY_MS).toISOString().slice(0, 10);
};

/** The instant a Bangkok day key begins. */
export const dayKeyStart = (key) => Date.parse(`${key}T00:00:00Z`) - BANGKOK_OFFSET_MS;
