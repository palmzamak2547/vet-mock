// Night-owl military rank — a humour ladder that ranks how hard the
// user burns the midnight oil. Ranks are EARNED FROM HISTORY, not a
// separate counter: every `vmx-history` entry already carries a full
// epoch-ms timestamp (`date`), so we just count how many answers were
// submitted inside the late-night window (23:00–04:59 local time).
//
// No storage of its own → nothing to sync, nothing to back up, nothing
// to corrupt. Rank demotes automatically if history is cleared.
//
// Rank ladder follows the real Thai army enlisted → officer → general
// chain (10 ranks). Thresholds are cumulative late-night answers:
//   0→1 = สิบเอก, then 5, 15, 30, 50, 75, 105, 140, 180, 230.
// Early ranks are cheap so the first โต้รุ้ง session already promotes;
// the general ranks need months of bad sleep habits.

export const NIGHT_START_HOUR = 23; // first late-night hour (23:xx)
export const NIGHT_END_HOUR = 4;    // last late-night hour (04:xx), 05:00+ is "morning"

export const NIGHT_RANKS = Object.freeze([
  { id: 'recruit',    label: 'พลทหารนอนเยอะ',   icon: '😴', min: 0,   blurb: 'ยังนอนเต็มอิ่ม หวังให้เป็นแบบนี้ต่อไป' },
  { id: 'sgt',        label: 'สิบเอกนอนเยอะ',   icon: '🛌', min: 1,   blurb: 'เริ่มมีคืนที่หลับไม่พอ แต่ยังไม่ถึงขั้นอันตราย' },
  { id: '2lt',        label: 'ร้อยตรีนอนสบาย',  icon: '🌜', min: 5,   blurb: 'คืนนี้นอนได้ พรุ่งนี้ค่อยว่ากัน' },
  { id: '1lt',        label: 'ร้อยโทตีหนึ่ง',    icon: '🕐', min: 15,  blurb: 'ตีหนึ่งแล้วยังตื่น ข้อสอบไม่หนีไปไหน' },
  { id: 'cpt',        label: 'ร้อยเอกตีสอง',     icon: '🕑', min: 30,  blurb: 'ตีสองเป็นเวลาอันตราย ระวังพลาดเพราะง่วง' },
  { id: 'maj',        label: 'พันตรีตีสาม',      icon: '🕒', min: 50,  blurb: 'ตีสาม นี่เริ่มจะออกนอกกรอบแล้วนะ' },
  { id: 'ltcol',      label: 'พันโทตีสี่',       icon: '🕓', min: 75,  blurb: 'ตีสี่ยังไม่นอน กาแฟไม่ช่วยอะไรแล้ว' },
  { id: 'col',        label: 'พันเอกเช้ามืด',    icon: '🌅', min: 105, blurb: 'เช้ามืดแล้ว นี่ขนาดอดนอนข้ามคืน' },
  { id: 'majgen',     label: 'พลตรีนอนน้อย',     icon: '🦉', min: 140, blurb: 'นอนน้อยเป็นล่ำ ระวังสุขภาพหน่อยนะ' },
  { id: 'ltgen',      label: 'พลโทนอนน้อย',     icon: '🌙', min: 180, blurb: 'ระดับนอนน้อยขั้นสูง ควรพิจารณาพักผ่อนบ้าง' },
  { id: 'gen',        label: 'พลเอกนอนน้อย',    icon: '👑', min: 230, blurb: 'ยศสูงสุดแห่งการอดนอน คืนนี้ได้นอนไหม?' },
]);

// Is a given hour (0-23) inside the late-night window (23:00–04:59)?
export function isNightHour(hour) {
  const h = Number(hour);
  if (!Number.isFinite(h)) return false;
  return h >= NIGHT_START_HOUR || h <= NIGHT_END_HOUR;
}

// Count late-night answers from a history array. Entries look like
// { date: epochMs, ... } — the timestamp is the session SUBMIT time
// (finishExam stamps Date.now() once per session, matching how XP /
// quests / streak already read it). Malformed rows are skipped, not
// thrown on — gamification must never break on bad data.
export function countNightAnswers(history) {
  if (!Array.isArray(history)) return 0;
  let night = 0;
  for (const h of history) {
    const ms = Number(h?.date);
    if (!Number.isFinite(ms) || ms <= 0) continue;
    if (isNightHour(new Date(ms).getHours())) night++;
  }
  return night;
}

// Resolve the current rank object for a given late-night count.
// Returns the HIGHEST rank whose `min` threshold is met (always at
// least 'recruit', so callers can render unconditionally).
export function rankForNightCount(nightCount) {
  const n = Math.max(0, Math.floor(Number(nightCount) || 0));
  let cur = NIGHT_RANKS[0];
  for (const r of NIGHT_RANKS) {
    if (n >= r.min) cur = r;
    else break;
  }
  return cur;
}

// Rank index in the ladder (0-based) — useful for progress math.
export function rankIndex(rank) {
  return NIGHT_RANKS.findIndex((r) => r.id === rank?.id);
}

// Progress toward the NEXT rank: { current, needed, pct, hasNext }.
// At max rank, hasNext=false and pct=100.
export function nextRankProgress(nightCount) {
  const n = Math.max(0, Math.floor(Number(nightCount) || 0));
  const idx = rankIndex(rankForNightCount(n));
  const next = NIGHT_RANKS[idx + 1];
  if (!next) return { current: n, needed: 0, pct: 100, hasNext: false };
  const floor = NIGHT_RANKS[idx].min;
  const span = next.min - floor;
  const current = n - floor;
  const needed = Math.max(1, next.min - n);
  const pct = Math.min(100, Math.round((current / Math.max(1, span)) * 100));
  return { current, needed, pct, hasNext: true, next };
}

// Full snapshot from a history array — everything the UI needs.
export function getNightStats(history) {
  const nightCount = countNightAnswers(history);
  const rank = rankForNightCount(nightCount);
  return { nightCount, rank, progress: nextRankProgress(nightCount) };
}

// Compute the rank BEFORE and AFTER adding `newEntries` — the caller
// (finishExam) compares them to detect a promotion without persisting
// anything. Returns { before, after, promoted } where promoted is
// true only when the ladder index moved UP (downgrades never toast).
export function computePromotion(historyBefore, newEntries) {
  const before = rankForNightCount(countNightAnswers(historyBefore));
  const afterRank = rankForNightCount(
    countNightAnswers(historyBefore) + countNightAnswers(newEntries)
  );
  return {
    before,
    after: afterRank,
    promoted: rankIndex(afterRank) > rankIndex(before),
  };
}

export const NIGHT_RANK_EVENT = 'vmx-night-rank-promoted';

// The promotion is decided in finishExam, before React has switched to the
// results view, so a listener mounted by ResultsView is not there yet when
// NIGHT_RANK_EVENT fires — the banner never showed. The promotion is also
// stashed here; ResultsView takes it on mount. One-shot, in memory only: a
// reload after submitting forgets it, and the rank itself still shows on
// the dashboard card.
let pendingPromotion = null;
export function stashPromotion(detail) {
  pendingPromotion = detail && detail.from && detail.to ? detail : null;
}
export function takePromotion() {
  const p = pendingPromotion;
  pendingPromotion = null;
  return p;
}
