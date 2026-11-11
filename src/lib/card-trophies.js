// ============================================================
// card-trophies.js — what the card may wear, from what the student did
// ============================================================
// Trophies are the only earned part of the card. They come from
// earnedBadges() over the synced history (and the counts the screen hands
// in), never from the device-only XP counter, so a card looks the same on
// every device. Backdrops, palettes and characters are free from the first
// minute and are not here.
// ============================================================

import { earnedBadges, longestDayStreak, answersInHourRange } from './badges.js';
import { CARD_FRAMES } from './prefs/card-token.js';

/** Frame -> the badge that earns it ('plain' is free). */
export const FRAME_EARNED_BY = Object.freeze({ plain: null, ledger: 'questions-100', gilt: 'streak-7', foil: 'streak-30', seal: 'questions-1000' });
export const FRAME_LABEL = Object.freeze({ plain: 'เส้นบาง', ledger: 'เส้นคู่', gilt: 'ขอบทอง', foil: 'ฟอยล์', seal: 'ตราประทับ' });

/** Everything the card may wear for this student's data. */
export function cardAllowance(src = {}) {
  const badges = earnedBadges(src);
  const earned = new Set(badges.map((b) => b.id));
  const frames = CARD_FRAMES.filter((f) => !FRAME_EARNED_BY[f] || earned.has(FRAME_EARNED_BY[f]));
  return { badges, earned, frames };
}

/** The card as it may be shown: anything not earned falls back to the free choice. */
export function wearable(card, allowance) {
  return {
    ...card,
    frame: allowance.frames.includes(card.frame) ? card.frame : 'plain',
    title: card.title && allowance.earned.has(card.title) ? card.title : null,
    trophies: (card.trophies || []).filter((id) => allowance.earned.has(id)),
  };
}

// Measurable distances to the next trophies, nearest share first.
const LADDER = [
  ['streak-7', 7, (s) => s.streak, 'วัน'],
  ['questions-100', 100, (s) => s.answered, 'ข้อ'],
  ['streak-30', 30, (s) => s.streak, 'วัน'],
  ['night-owl', 50, (s) => s.night, 'ข้อหลังสี่ทุ่ม'],
  ['early-bird', 50, (s) => s.early, 'ข้อก่อนแปดโมง'],
  ['questions-1000', 1000, (s) => s.answered, 'ข้อ'],
];

/**
 * The one trophy to name next: { id, left, unit, frame } or null when every
 * measurable one is earned. `frame` names the frame it brings, if any.
 */
export function nextTrophy(src = {}, earned = cardAllowance(src).earned) {
  const history = src.history || [];
  const s = { streak: longestDayStreak(history), answered: history.length, night: answersInHourRange(history, 22, 4), early: answersInHourRange(history, 5, 8) };
  let best = null;
  for (const [id, target, read, unit] of LADDER) {
    if (earned.has(id)) continue;
    const left = Math.max(1, target - read(s));
    const share = left / target;
    if (!best || share < best.share) best = { id, left, unit, share };
  }
  if (!best) return null;
  const frame = Object.entries(FRAME_EARNED_BY).find(([, by]) => by === best.id)?.[0] || null;
  return { id: best.id, left: best.left, unit: best.unit, frame };
}
