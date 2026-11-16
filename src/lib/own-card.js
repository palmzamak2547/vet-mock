// own-card.js: the face of the student's own card, from the same readers the
// profile hub uses (the saved streak through streakShown, earnedBadges with
// it), so the card, the hub and the share image agree. A classmate's card is
// cardFace() with no numbers.
import { streakShown } from '../hooks/utils.js';
import { shownName, shownPicture } from './public-display.js';
import { cardAllowance, cardFace, shownPhoto, wearable } from './card-style.js';

export function ownCard({ card, user = null, profile = null, history = [], srCards = {}, streakData = null, selectedYear = null, theme = 'light', now = Date.now(), ownPicture = null } = {}) {
  const rows = Array.isArray(history) ? history : [];
  const streak = streakShown(streakData, now);
  const allowance = cardAllowance({ history: rows, srCards: srCards || {}, currentStreak: streak });
  const worn = wearable(card, allowance);
  const year = Number(selectedYear);
  const face = cardFace({
    card: worn,
    // A guest has no public name; the card says so plainly.
    name: user ? shownName(profile?.username) : 'นิสิต',
    picture: shownPicture(profile?.avatar_emoji),
    // the student's own upload ({ url, state }), shown as classmates see it
    photo: shownPhoto(ownPicture),
    yearLine: Number.isInteger(year) && year > 0 ? `ปี ${year}` : '',
    stats: { answered: rows.length, streak, trophies: allowance.badges.length },
    theme,
  });
  return { face, worn, allowance, streak };
}
