// ============================================================
// library-courses.js — คลังเอกสาร: วิชาที่อยู่นอก curriculum.js
// ============================================================
// Library rows carry a subject id. For the 52 vet-faculty courses that id is
// a curriculum.js subject (matched by its `code:` field — full coverage,
// verified against the 2026-08-28 MyCourseVille dump). The five courses below
// are the remainder: gen-ed and other-faculty courses the curriculum has no
// reason to carry. Their id is the course number itself, and this file is
// only how that number gets a name and an icon on the shelf.
//
// Names are the registrar titles exactly as MyCourseVille lists them
// (section suffix dropped) — not translations, not guesses.

export const EXTERNAL_COURSES = [
  { code: '0295100', name: 'Exploring Biomedical Engineering World', icon: '⚙️' },
  { code: '2207363', name: 'Ethics', icon: '📜' },
  { code: '2305106', name: 'Plants and Humanity', icon: '🌿' },
  { code: '3200106', name: 'Fundamental Oral Biology for Oral Health', icon: '🦷' },
  { code: '5100101', name: 'Population and Development', icon: '👥' },
];
