// What the defect sweep (tests/e2e/defect-sweep.spec.js) finds that is meant to look that way.
// Each row: { detector, a?, b?, either?, text?, route?, state?, reason }. `a` and `b` are patterns over
// the two elements' signatures (tag.class, see signature() in defects.js), `either` lets them match in
// either order, `text` matches the finding's detail and texts. A matched finding stays in
// findings.json with `allowed` set to the reason, and is not counted against the baseline.
// A row is for a design that is right, never for a fault nobody has fixed yet: those are counted.
export const ALLOW = [
  {
    detector: 'clipped', a: /^span$/, text: /cut by a box around it \d\s*$/,
    reason: 'a number that counts up on rolling digits (the landing page, the progress page): each digit is a column of 0 to 9 in a box one digit high',
  },
  {
    detector: 'overlap', a: /^span$/, b: /^span$/, text: /^text over text by \d+x[12] px \d \d$/,
    reason: 'the same rolling digits: neighbouring numbers of one digit column touch by a pixel or two inside the box that shows one',
  },
  {
    detector: 'overlap', a: /vmx-wordmark-(phrase|tail)/, b: /vmx-wordmark-(phrase|tail)/,
    reason: 'the header wordmark turns between its phrases in one slot: the phrase going out is clipped away while the next comes in, so only one is ever seen (checked by eye, 15 Nov)',
  },
  {
    detector: 'overflow-x', a: /lp-marquee-viewport/,
    reason: 'the landing page marquee of subjects runs sideways on purpose, inside a viewport that hides its scrollbar',
  },
  {
    detector: 'shift', a: /^span\.lp-w$/,
    reason: 'the landing headline brings its words in one by one when the page opens: an entrance, not content moving',
  },
];
