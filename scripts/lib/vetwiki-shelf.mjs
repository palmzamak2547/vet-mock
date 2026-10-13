// ============================================================
// vetwiki-shelf.mjs: the numbers and the cloth behind the VetWiki shelves
// ============================================================
// Pure functions, run at build time by npm run regen:wiki-registry, which
// writes what they count into the shelf module the index imports. The index
// stays metadata-only in the browser, so what a spine needs (topics,
// sections, checked points, conflicts, the newest check) and the corpus
// totals on the masthead are counted here, the same way stats.mjs counts them.
//
// Spine cloth: the hue of the subject's bookplate paper (subject-covers.js)
// in OKLCH, its chroma lifted to read as cloth, set at L 0.72 for the light
// theme (ink titles) and L 0.36 for the dark one (cream titles). Subjects on
// one shelf are kept apart (clothFor).
// ============================================================

const toLinear = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const toGamma = (c) => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055);

export function hexToOklch(hex) {
  const [r, g, b] = [1, 3, 5].map((i) => toLinear(parseInt(hex.slice(i, i + 2), 16) / 255));
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const B = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  return { L, C: Math.hypot(A, B), H: Math.atan2(B, A) };
}

function oklchToLinear({ L, C, H }) {
  const A = C * Math.cos(H);
  const B = C * Math.sin(H);
  const l = (L + 0.3963377774 * A + 0.2158037573 * B) ** 3;
  const m = (L - 0.1055613458 * A - 0.0638541728 * B) ** 3;
  const s = (L - 0.0894841775 * A - 1.291485548 * B) ** 3;
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
}

/** OKLCH to #rrggbb, chroma reduced until the colour is inside sRGB. */
export function oklchToHex({ L, C, H }) {
  let c = C;
  let rgb = oklchToLinear({ L, C: c, H });
  while (c > 0 && rgb.some((v) => v < -1e-4 || v > 1 + 1e-4)) {
    c = Math.max(0, c - 0.002);
    rgb = oklchToLinear({ L, C: c, H });
  }
  return `#${rgb.map((v) => Math.round(toGamma(Math.min(1, Math.max(0, v))) * 255).toString(16).padStart(2, '0')).join('')}`;
}

const okDistance = (a, b) => Math.hypot(a.L - b.L, a.C * Math.cos(a.H) - b.C * Math.cos(b.H), a.C * Math.sin(a.H) - b.C * Math.sin(b.H));

// ΔE_OK under 0.02 is a pair the eye takes for one colour on a shelf.
export const CLOTH_APART = 0.02;

/**
 * Light and dark cloth for each subject, in the order given, no two on one
 * shelf (`shelfOf`) closer than CLOTH_APART in either theme, measured on the
 * colours actually written (after the gamut clip). The paper's own hue comes
 * first, then turns of 0.2 rad either way; where that circle is crowded (a
 * low-chroma paper's is 0.22 round), the same turns with more chroma. The
 * old loop turned 0.4 rad, which moves a C 0.035 cloth only 0.014, gave up
 * after 16 turns and left COM IV and Repro Lecture 0.0045 apart.
 */
export function clothFor(papers, shelfOf = () => 0) {
  const placed = [];
  const out = {};
  const written = (c) => { const hex = oklchToHex(c); return { hex, ok: hexToOklch(hex) }; };
  for (const [id, paper] of papers) {
    const base = hexToOklch(paper);
    const chroma = Math.min(0.08, Math.max(0.035, base.C * 2.2));
    const shelf = shelfOf(id);
    const near = placed.filter((p) => p.shelf === shelf);
    let pick = null;
    for (const C of [chroma, chroma + 0.025, chroma + 0.05]) {
      for (let t = 0; t < 17 && !pick; t++) {
        const H = base.H + 0.2 * Math.ceil(t / 2) * (t % 2 ? 1 : -1);
        const light = written({ L: 0.72, C, H });
        const dark = written({ L: 0.36, C: C * 0.85, H });
        if (near.every((p) => okDistance(p.light.ok, light.ok) >= CLOTH_APART && okDistance(p.dark.ok, dark.ok) >= CLOTH_APART)) pick = { light, dark };
      }
      if (pick) break;
    }
    if (!pick) throw new Error(`vetwiki-shelf: no cloth for ${id} stays ${CLOTH_APART} from the others on its shelf`);
    placed.push({ shelf, ...pick });
    out[id] = { light: pick.light.hex, dark: pick.dark.hex };
  }
  return out;
}

/**
 * Per subject and in total: topics, sections, checked points, distinct
 * sources, conflicts, and the newest check date. `topics` is listTopics()
 * order, which is also the order of the shelves' volumes.
 */
export function buildShelf({ topics, loadTopic, provenanceSummary, covers, shelfOf = () => 0 }) {
  const subjects = new Map();
  const perTopic = {};
  const sources = new Set();
  const totals = { topics: 0, subjects: 0, sections: 0, claims: 0, sources: 0, conflicts: 0, conflictTopics: 0, newestReview: '' };
  for (const t of topics) {
    const k = loadTopic(t.subject, t.topic);
    const p = provenanceSummary(k);
    const conflicts = k.sections.reduce((n, s) => n + (s.corrections?.length || 0), 0);
    let newest = '';
    for (const s of k.sections) for (const c of s.claims || []) if (c.review?.reviewedAt > newest) newest = c.review.reviewedAt;
    perTopic[t.id] = { sections: k.sections.length, claims: p.verifiedClaimCount };
    const row = subjects.get(t.subject) || { topics: 0, sections: 0, claims: 0, conflicts: 0, newestReview: '' };
    row.topics += 1;
    row.sections += k.sections.length;
    row.claims += p.verifiedClaimCount;
    row.conflicts += conflicts;
    if (newest > row.newestReview) row.newestReview = newest;
    subjects.set(t.subject, row);
    totals.topics += 1;
    totals.sections += k.sections.length;
    totals.claims += p.verifiedClaimCount;
    totals.conflicts += conflicts;
    if (conflicts) totals.conflictTopics += 1;
    if (newest > totals.newestReview) totals.newestReview = newest;
    for (const s of p.sources) sources.add(s.work || s.id); // one work under several ids counts once (sources.js SAME_WORK)
  }
  totals.subjects = subjects.size;
  totals.sources = sources.size;
  const cloth = clothFor([...subjects.keys()].map((id) => [id, covers[id]?.paper || '#ECE6DA']), shelfOf);
  return {
    totals,
    subjects: Object.fromEntries([...subjects].map(([id, row]) => [id, { ...row, cloth: cloth[id] }])),
    topics: perTopic,
  };
}
