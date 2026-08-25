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
  // p.9 is "Interior anatomy of udder", which is what the question citing it asks about.
  "RC 1 Introduction to Milk Hygiene 2026": "Y.5 Term1 Mid/Milk Hygiene and Meat Inspection/1._RC_Milk_Introduction_2026-1028759-17845483640968.pdf",
  // p.3 is "Edema mechanism — Hydrostatic pressure / Oncotic pressure / Vascular permeability".
  "Edema / Effusion 2026 (POA)": "Y.5 Term1 Mid/Clinical Problem Solving in Companion Animal Medicine/edema2026_POA_chula-717188-17835715802594.pdf",
  // NOT aliased on purpose: "Global One Health Activity Network 2026" p.18 looks
  // like a filename match, but that page is a MODULE REFLECTION exercise, not the
  // CDC priority-zoonoses figure the question asks about, and no One Health deck
  // on disk contains that phrase at all. Guessing here would attach a figure from
  // the wrong page of the right-looking deck.
};
