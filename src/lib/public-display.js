// ============================================================
// public-display.js — how another member's name and picture are DRAWN
// ============================================================
// The database takes almost anything through the API today (a blank name,
// zero-width or bidi characters, a 10-digit number; any 32 characters as the
// "avatar", so "อาจารย์" could stand in front of a name). Until the
// migration in docs/releases/pending/student-profile.md lands, every
// surface that shows a member draws them through these two functions:
// header, boards, groups, comments, the reading-now list, races.
// tests/unit/student-identity.test.mjs walks the source tree so a new
// surface cannot skip them. Small and dependency-free: the header is in the
// first load.
// ============================================================

/** The pictures a student can pick: animals a vet student meets. */
export const PICTURES = Object.freeze([
  { emoji: '🐾', label: 'รอยเท้า' },
  { emoji: '🐶', label: 'สุนัข' },
  { emoji: '🐱', label: 'แมว' },
  { emoji: '🐰', label: 'กระต่าย' },
  { emoji: '🐹', label: 'แฮมสเตอร์' },
  { emoji: '🐴', label: 'ม้า' },
  { emoji: '🐮', label: 'วัว' },
  { emoji: '🐷', label: 'หมู' },
  { emoji: '🐑', label: 'แกะ' },
  { emoji: '🐐', label: 'แพะ' },
  { emoji: '🐔', label: 'ไก่' },
  { emoji: '🦆', label: 'เป็ด' },
  { emoji: '🐢', label: 'เต่า' },
  { emoji: '🐠', label: 'ปลา' },
  { emoji: '🦜', label: 'นกแก้ว' },
  { emoji: '🐍', label: 'งู' },
]);
export const DEFAULT_PICTURE = '🐾';
export const STAND_IN = 'นิสิต';
export const isPicture = (value) => PICTURES.some((p) => p.emoji === value);

// Invisible characters that let two names look the same, or reorder text.
export const INVISIBLE = /[\u0000-\u001f\u007f-\u009f­؜᠎​-‏‪-‮⁠-⁯﻿]/g;

/** A member's picture as drawn: one from the set, else the paw. */
export const shownPicture = (value) => (isPicture(value) ? value : DEFAULT_PICTURE);

// A Chula student number is 10 digits, a Thai phone number 9 or 10, a
// national id 13: a run of 8 or more digits (any script, \p{Nd}, after NFKC
// so full-width digits count) not broken by a separator is drawn as one of
// them. Shorter runs ("ploy55555", "vet86 2567") are ordinary names. A new
// name is held to a stricter rule when it is chosen (public-identity.js).
export const ID_DIGITS = 8;
const ID_RUN = new RegExp(`\\p{Nd}{${ID_DIGITS},}`, 'u');
export const looksLikeAnId = (value) => ID_RUN.test(String(value ?? '').normalize('NFKC'));

/** A member's name as drawn: no invisible or bidi characters, one space,
 *  and "นิสิต" for a blank name, a digit run long enough to be an id
 *  (looksLikeAnId) or anything that reads as an email or a web address. */
export function shownName(value, fallback = STAND_IN) {
  const n = String(value ?? '').normalize('NFKC').replace(INVISIBLE, '').replace(/\s+/g, ' ').trim();
  if (!n) return fallback;
  if (looksLikeAnId(n)) return fallback;
  if (/@|https?:|www\./i.test(n)) return fallback;
  return n;
}
