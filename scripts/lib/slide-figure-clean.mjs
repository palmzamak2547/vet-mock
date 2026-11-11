// ============================================================
// slide-figure-clean.mjs: one file per picture, and no template art
// ============================================================
// A lecture deck draws its template on every slide: the background, the
// corner logo, the strip of sky. The extractor took those as figures, so a
// note section showed the same blue rectangle three times and a student could
// not tell which picture was the lecture's. And a real figure the lecturer put
// on two or three slides was stored once per slide and shown once per slide.
//
// Two rules, both on exact bytes, both decided here and nowhere else:
//
//   1. Furniture. A picture whose bytes sit FURNITURE_MIN_REPEATS or more times
//      in one deck's folder is the deck's template and is taken out of the map
//      and off the disk. The number is 4 because of what the files showed on
//      11 Nov 2026, every group looked at: all 9 groups of four or more
//      (59, 56, 50, 39, 34, 30, 15, 5 and 4 copies) were template art, and all
//      81 groups of two or three were slide content (a labelled cell, an agar
//      plate, the inoculation routes of an egg). Three would have removed five
//      of those. A real figure that does repeat four times goes in
//      KEEP_REPEATED in scripts/extract-slide-figures.mjs, with what it shows.
//
//   2. One file per picture. Of the files that stay, byte-identical ones are
//      one picture: the first in figure order keeps its file, every section
//      that listed a copy lists that file instead, once, and the copies go.
//
//   3. Drawn shapes. A file whose pixels are a flat mask, a smoothly filled
//      shape or one flat colour is not a figure: the dark backdrop a slide
//      puts behind a photograph, an arrow, a gradient bar. The caller measures
//      the files (scripts/lib/slide-figure-shape.mjs holds the rule and its
//      numbers) and hands the plan the paths; they go as furniture does.
//
// The hand placements (the REKEYS table of scripts/extract-slide-figures.mjs)
// are applied here too, before and after the plan, so what is tested is what
// ships: cleanWithPlacements is the whole of `--clean`.
//
// Everything is planned from paths and hashes, so it is tested without a deck
// (tests/unit/slide-figure-clean.test.mjs) and run without one:
//   node scripts/extract-slide-figures.mjs --clean [--write]
// ============================================================

export const FURNITURE_MIN_REPEATS = 4;

/** '/figures/<subject>/<topic>': the folder one deck's figures are written to. */
export const deckOf = (figure) => String(figure).split('/').slice(0, 4).join('/');

const PAGE_RE = /\/p(\d+)-(\d+)\.[a-z0-9]+$/i;

/** Deck folder, then page, then place on the page: p2-0 comes before p10-0. */
export function figureOrder(a, b) {
  const da = deckOf(a);
  const db = deckOf(b);
  if (da !== db) return da < db ? -1 : 1;
  const ma = PAGE_RE.exec(a);
  const mb = PAGE_RE.exec(b);
  if (ma && mb) return Number(ma[1]) - Number(mb[1]) || Number(ma[2]) - Number(mb[2]) || (a < b ? -1 : a > b ? 1 : 0);
  return a < b ? -1 : a > b ? 1 : 0;
}

/**
 * What cleaning would do, from the files on disk and the map.
 *
 * @param {object} input
 * @param {Map<string, string>} input.files   figure path -> content hash, every file in the deck folders
 * @param {Record<string, string[]>} input.map   section id -> figure paths
 * @param {Iterable<string>} [input.keep]   figure paths a rule would take and that are real figures:
 *   one that repeats in its deck, one whose pixels read as a shape
 * @param {Iterable<string>} [input.prefer]   figure paths named elsewhere (a hand placement): among
 *   copies of one picture, such a path keeps its file instead of the first in figure order
 * @param {Iterable<string>} [input.shapes]   figure paths whose pixels are a drawn shape, not a picture
 * @param {number} [input.minRepeats]
 * @returns {{
 *   map: Record<string, string[]>,
 *   furniture: { deck: string, hash: string, files: string[] }[],
 *   shapes: string[],
 *   copies: { keep: string, drop: string[] }[],
 *   unlisted: string[],
 *   remove: string[],
 *   missing: string[],
 *   emptied: string[],
 * }}
 */
export function planClean({ files, map, keep = [], prefer = [], shapes = [], minRepeats = FURNITURE_MIN_REPEATS }) {
  const kept = new Set(keep);
  const preferred = new Set(prefer);
  const drawn = new Set(shapes);
  const paths = [...files.keys()].sort(figureOrder);

  // 1. Furniture: the same bytes, minRepeats or more times, inside one deck folder.
  const perDeck = new Map();
  for (const p of paths) {
    const key = `${deckOf(p)}\n${files.get(p)}`;
    if (!perDeck.has(key)) perDeck.set(key, []);
    perDeck.get(key).push(p);
  }
  const furniture = [];
  const gone = new Set();
  for (const [key, list] of perDeck) {
    if (list.length < minRepeats || list.some((p) => kept.has(p))) continue;
    const [deck, hash] = key.split('\n');
    furniture.push({ deck, hash, files: list });
    for (const p of list) gone.add(p);
  }
  furniture.sort((a, b) => b.files.length - a.files.length || figureOrder(a.files[0], b.files[0]));

  // 1b. Drawn shapes among what is left: out of the map and off the disk too.
  const shapeFiles = paths.filter((p) => drawn.has(p) && !gone.has(p) && !kept.has(p));
  for (const p of shapeFiles) gone.add(p);

  // 2. One file per picture among what stays: the first in figure order keeps
  //    its file, unless a copy is named elsewhere, which then keeps its own.
  const sameBytes = new Map();
  for (const p of paths) {
    if (gone.has(p)) continue;
    const hash = files.get(p);
    if (!sameBytes.has(hash)) sameBytes.set(hash, []);
    sameBytes.get(hash).push(p);
  }
  const alias = new Map();
  const copies = [];
  for (const list of sameBytes.values()) {
    if (list.length < 2) continue;
    const keepPath = list.find((p) => preferred.has(p)) || list[0];
    const drop = list.filter((p) => p !== keepPath);
    for (const p of drop) alias.set(p, keepPath);
    copies.push({ keep: keepPath, drop });
  }

  // 3. The map: furniture out, copies pointed at their one file, each picture once a section.
  const out = {};
  const missing = new Set();
  const emptied = [];
  const used = new Set();
  for (const [id, figs] of Object.entries(map)) {
    const seen = new Set();
    const next = [];
    for (const fig of figs) {
      if (gone.has(fig)) continue;
      if (!files.has(fig)) { missing.add(fig); next.push(fig); continue; }
      const one = alias.get(fig) || fig;
      if (seen.has(one)) continue;
      seen.add(one);
      next.push(one);
      used.add(one);
    }
    if (next.length) out[id] = next;
    else emptied.push(id);
  }

  // 4. A file no section lists is not shown anywhere, so it does not stay either.
  const unlisted = paths.filter((p) => !gone.has(p) && !alias.has(p) && !used.has(p));
  const remove = [...gone, ...alias.keys(), ...unlisted].sort(figureOrder);

  return { map: out, furniture, shapes: shapeFiles, copies, unlisted, remove, missing: [...missing].sort(figureOrder), emptied };
}

// ── Figures placed by hand ───────────────────────────────────────────
// A row of the table (REKEYS in scripts/extract-slide-figures.mjs):
//   { figure, to: [topic, heading], label }  file it under that note section
//   { figure, drop }                         take it out of the map
// One figure may have several `to` rows: it is then shown in each section.

/**
 * The hand placements applied to a map. Two passes, so applying the table
 * twice gives the same map byte for byte: every listed figure leaves every
 * section first, then each placement is appended in table order.
 *
 * @param {object} input
 * @param {Record<string, string[]>} input.map
 * @param {{ figure: string, to?: [string, string], drop?: string }[]} input.rows
 * @param {(figure: string) => boolean} input.exists   whether the figure's file is there
 * @param {(subject: string, topic: string, heading: string) => string | null} input.sectionOf
 *   the id of that note section, or null when the notes have no such section
 * @param {string | null} [input.onlySubject]   apply one subject's rows only
 * @returns {{ map: Record<string, string[]>, problems: string[] }}
 */
export function applyPlacements({ map, rows, exists, sectionOf, onlySubject = null }) {
  const mine = rows.filter((r) => !onlySubject || r.figure.split('/')[2] === onlySubject);
  const problems = [];
  const moves = [];
  for (const r of mine) {
    // A dropped figure is in no section, so the clean has removed its file.
    if (!r.to) continue;
    if (!exists(r.figure)) { problems.push(`${r.figure}: no such file`); continue; }
    const to = sectionOf(r.figure.split('/')[2], r.to[0], r.to[1]);
    if (!to) { problems.push(`${r.figure}: no section "${r.to[1]}" in ${r.to[0]}`); continue; }
    if (moves.some(([figure, id]) => figure === r.figure && id === to)) { problems.push(`${r.figure}: placed twice under "${r.to[1]}"`); continue; }
    moves.push([r.figure, to]);
  }
  const listed = new Set(mine.map((r) => r.figure));
  const out = {};
  for (const [id, figs] of Object.entries(map)) {
    const kept = figs.filter((f) => !listed.has(f));
    if (kept.length) out[id] = kept;
  }
  for (const [figure, to] of moves) (out[to] ||= []).push(figure);
  return { map: out, problems };
}

/**
 * The whole of `--clean`: the map and the disk with no template art, no drawn
 * shape, one file per picture and no file that no section lists, with the hand
 * placements applied before and after, so the result is what `--rekey` would
 * write too.
 *
 * A hand-placed figure keeps its own file among copies of one picture, and the
 * section that showed a copy then shows that file. The table decides where a
 * listed figure goes, so the placement pass after the plan would take it out
 * of that section again, without a word: neuroanat--midbrain/p8-1, the same
 * drawing as the hand-placed p18-0, left the section it stood in on 11 Nov
 * 2026. That is now a problem, with the row to add, never a silent loss.
 *
 * @param {object} input
 * @param {Record<string, string[]>} input.map
 * @param {Map<string, string>} input.files   figure path -> content hash
 * @param {{ figure: string, to?: [string, string], drop?: string }[]} input.rows
 * @param {Iterable<string>} [input.keep]
 * @param {Iterable<string>} [input.shapes]
 * @param {(figure: string) => boolean} [input.exists]
 * @param {(subject: string, topic: string, heading: string) => string | null} input.sectionOf
 * @returns {{ problems: string[], plan?: ReturnType<typeof planClean>, map?: Record<string, string[]> }}
 */
export function cleanWithPlacements({ map, files, rows, keep = [], shapes = [], exists = (figure) => files.has(figure), sectionOf }) {
  const first = applyPlacements({ map, rows, exists, sectionOf });
  if (first.problems.length) return { problems: first.problems };
  // A figure placed by hand keeps its own file among copies of one picture,
  // so the table goes on naming a file that exists.
  const placed = new Set(rows.filter((r) => r.to).map((r) => r.figure));
  const plan = planClean({ files, map: first.map, keep, shapes, prefer: placed });
  const problems = plan.remove.filter((p) => placed.has(p))
    .map((p) => `${p}: placed by hand in REKEYS, and it is template art, a drawn shape or a second file of one picture; keep one file for the picture`);
  for (const p of plan.missing) problems.push(`${p}: listed in the map, no such file`);
  if (problems.length) return { problems };
  const last = applyPlacements({ map: plan.map, rows, exists, sectionOf });
  if (last.problems.length) return { problems: last.problems };
  // What the plan pointed at a hand-placed file and the table then took away.
  const copyOf = new Map(plan.copies.flatMap((c) => c.drop.map((d) => [d, c.keep])));
  for (const [id, figs] of Object.entries(first.map)) {
    for (const fig of figs) {
      const keptFile = copyOf.get(fig);
      if (!keptFile || !placed.has(keptFile) || (last.map[id] || []).includes(keptFile)) continue;
      problems.push(`${fig}: the same picture as the hand-placed ${keptFile}, and section ${id} shows it. Add a REKEYS row placing ${keptFile} in that section too, or a drop row for ${fig}`);
    }
  }
  return problems.length ? { problems } : { problems, plan, map: last.map };
}

/**
 * Which extracted source images are a deck's template, before any is picked:
 * `pdfimages` writes one file per place an image is drawn, so an image drawn
 * on four or more places of the deck comes out as four or more identical
 * files. Skipping them first leaves a page's three slots to its real figures.
 *
 * @param {Iterable<[string, string]>} hashes   extracted file -> content hash
 * @returns {Set<string>} the hashes that are furniture
 */
export function furnitureHashes(hashes, minRepeats = FURNITURE_MIN_REPEATS) {
  const count = new Map();
  for (const [, hash] of hashes) count.set(hash, (count.get(hash) || 0) + 1);
  return new Set([...count].filter(([, n]) => n >= minRepeats).map(([hash]) => hash));
}
