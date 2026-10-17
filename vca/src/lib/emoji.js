// Emoji, told apart from the symbols a sentence needs.
//
// What draws as a picture: an emoji by default (a bulb, a cross, a pig), a symbol the emoji
// selector (U+FE0F) turns into one (the warning sign), a lone warning sign (the bank uses it as a
// bullet) and a keycap. The text symbols stay: ® ↔ ♂ ♀ ♥ ✓ ✗ are what a drug name, a sex mark or a
// right/wrong mark needs, and nobody draws them as a picture.
//
// Nothing here uses a look-behind (Safari before 16.4 cannot parse one) or a property newer than
// ES2018 (Extended_Pictographic), because this file ships to phones. The code points are written
// as \u{...} so no invisible character sits in the source.

const PICTURE = String.raw`(?:[0-9#*]\u{FE0F}?\u{20E3}|\p{Emoji_Presentation}|\p{Emoji}\u{FE0F}|\u{26A0})`;

/** One emoji with whatever joins to it: a variation selector, a skin tone, a ZWJ sequence. */
export const EMOJI_SOURCE = String.raw`${PICTURE}(?:\u{FE0F}|[\u{1F3FB}-\u{1F3FF}]|\u{200D}${PICTURE})*`;

const EVERY = new RegExp(EMOJI_SOURCE, 'gu');
const ANY = new RegExp(EMOJI_SOURCE, 'u');

/** The text without its emoji; spacing around them is left as it was. */
export const stripEmoji = (text) => String(text ?? '').replace(EVERY, '');

export const hasEmoji = (text) => ANY.test(String(text ?? ''));
