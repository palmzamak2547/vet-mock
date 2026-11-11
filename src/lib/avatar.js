// ============================================================
// avatar.js — the picture a student shows, as ONE emoji in the database
// ============================================================
// profiles.avatar_emoji stays one emoji (text, at most 32 characters), so
// every old screen and every cached old build keeps showing something
// sensible. A VetMock character is chosen by its own emoji, none of which is
// one of the sixteen animals of the identity picker (public-identity.js
// PICTURES), so a student who picked the dog face keeps the dog face. New
// screens draw the character's portrait (public/art/avatars, made by
// scripts/make-avatars.mjs from the existing stills) through
// components/Avatar.jsx; any other emoji is drawn as itself.
// Small on purpose: this module is on first load with the header chip.
// ============================================================

/** One emoji per character, never shared: the mapping goes both ways. */
export const CHARACTER_EMOJI = Object.freeze({
  mochi: '🦮', pawsy: '🐕', mimi: '🐈', moocha: '🐄', porky: '🐖',
  clover: '🐎', oto: '🦦', chicky: '🐥', hootie: '🦉', glidy: '🐿️',
});
export const CHARACTER_IDS = Object.freeze(Object.keys(CHARACTER_EMOJI));
export const DEFAULT_AVATAR = '🐾';

// The variation selector (U+FE0F) is optional in what people store.
const bare = (s) => (typeof s === 'string' ? s.replace(/️/g, '').trim() : '');
const BY_EMOJI = new Map(CHARACTER_IDS.map((id) => [bare(CHARACTER_EMOJI[id]), id]));

/** The character an avatar emoji stands for, or null. */
export const characterFor = (emoji) => BY_EMOJI.get(bare(emoji)) || null;
export const portraitFor = (id) => (Object.hasOwn(CHARACTER_EMOJI, id) ? `/art/avatars/${id}.webp` : null);
