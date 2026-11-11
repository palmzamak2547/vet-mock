// ============================================================
// card-trophies.js — what the card may wear, from what the student did
// ============================================================
// Trophies are the only earned part of the card. They come from
// earnedBadges() and nextBadge() over the synced history with the saved
// streak (the profile hub's own readers, lib/badges.js), never from the
// device-only XP counter, so a card looks the same on every device and agrees
// with the hub. Backdrops, palettes and characters are free from the first
// minute and are not here.
// ============================================================

import { earnedBadges, nextBadge } from './badges.js';
import { CARD_FRAMES } from './prefs/card-token.js';

/** Frame -> the badge that earns it ('plain' is free). */
export const FRAME_EARNED_BY = Object.freeze({ plain: null, ledger: 'questions-100', gilt: 'streak-7', foil: 'streak-30', seal: 'questions-1000' });
export const FRAME_LABEL = Object.freeze({ plain: 'เส้นบาง', ledger: 'เส้นคู่', gilt: 'ขอบทอง', foil: 'ฟอยล์', seal: 'ตราประทับ' });

/** Everything the card may wear for this student's data
 *  ({ history, srCards, currentStreak }, as the hub passes them). */
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

/** The hub's next trophy (nextBadge), with the frame it brings, or null. */
export function nextTrophy(src = {}) {
  const next = nextBadge(src);
  if (!next) return null;
  const frame = Object.entries(FRAME_EARNED_BY).find(([, by]) => by === next.id)?.[0] || null;
  return { id: next.id, label: next.label, left: Math.max(1, next.need - next.have), unit: next.unit, frame };
}
