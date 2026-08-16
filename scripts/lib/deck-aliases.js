// Decks whose citation name is not their filename.
//
// `verified` records the name the lecturer used ("Aquaculture_Industry_Tech");
// the file on disk is called something else ("Aquactic med 2026.pdf"). Matching
// on the filename alone left six questions looking unfixable when the deck was
// sitting right there. Each alias below was confirmed by reading the cited
// page, not by the names looking similar:
//
//   Aquaculture_Industry_Tech p.79 -> "Vaccine was not effective / Effective
//   vaccine"; p.82 -> "Efficacy test (Laboratory trial)"; p.8 -> "Feed
//   conversion ratio". All three are what the questions citing those pages ask
//   about.

export const DECK_ALIASES = {
  Aquaculture_Industry_Tech: 'Y.5 Term1 Mid/Aquatic Med/Aquactic med 2026.pdf',
};
