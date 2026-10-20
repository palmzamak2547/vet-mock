// ============================================================
// VetWiki citations: one number per source in an article
// ============================================================
// An article numbers its sources in the order it first cites them, section by
// section and claim by claim, and a source keeps its number in every chip and
// in the list at the end. One work under several registry ids (sources.js
// SAME_WORK) is one source and one number, the way provenanceSummary counts
// them, so the strip's "แหล่งอ้างอิง N" is the length of the list. Pure: the
// caller passes the resolver (runtime.js resolveSource).
// ============================================================

/**
 * @returns {{ list: Array<{ n: number, src: object, sections: number[] }>,
 *             perSection: Array<Array<{ n: number, src: object, claims: Array<{ claim: object, locator: string }> }>> }}
 * `sections` in each list entry are the indexes of the sections citing it;
 * `perSection[i]` is section i's sources, in number order.
 */
export function articleCitations(sections, resolve) {
  const byWork = new Map();
  const list = [];
  const perSection = (sections || []).map((section, si) => {
    const here = new Map();
    for (const claim of section.claims || []) {
      for (const ref of claim.sourceRefs || []) {
        const src = resolve(ref);
        if (!src) continue;
        const work = src.work || src.id;
        let entry = byWork.get(work);
        if (!entry) {
          entry = { n: list.length + 1, src, sections: [] };
          byWork.set(work, entry);
          list.push(entry);
        }
        if (entry.sections[entry.sections.length - 1] !== si) entry.sections.push(si);
        let chip = here.get(work);
        if (!chip) {
          chip = { n: entry.n, src: entry.src, claims: [] };
          here.set(work, chip);
        }
        if (!chip.claims.some((c) => c.claim === claim)) chip.claims.push({ claim, locator: ref.locator || '' });
      }
    }
    return [...here.values()].sort((a, b) => a.n - b.n);
  });
  return { list, perSection };
}

// What kind of source, in a word. The registry's 'journal' and
// 'primary-literature' are two import batches of the same thing (both hold
// reviews and original studies), so both read วารสาร, where it was published,
// which is true of either.
export const SOURCE_KIND = {
  guideline: 'แนวทาง',
  textbook: 'ตำรา',
  journal: 'วารสาร',
  'primary-literature': 'วารสาร',
};

let words;
function clip(text, max) {
  const chars = Array.from(text);
  if (chars.length <= max) return text;
  if (words === undefined) {
    try { words = new Intl.Segmenter('th', { granularity: 'word' }); } catch { words = null; }
  }
  const parts = words ? Array.from(words.segment(text), (x) => x.segment) : text.split(/(\s+)/);
  let out = '';
  for (const p of parts) {
    if (Array.from(out + p).length > max) break;
    out += p;
  }
  return `${(out.replace(/[\s,;:.–—-]+$/u, '') || chars.slice(0, max).join(''))}…`;
}

/**
 * A chip's name for a source: the organisation's own acronym where it gives
 * one ("WOAH (World Organisation ...)", "World Health Organization (WHO)";
 * three letters at least, since "(NY)", "(US)" and "(FL)" are places),
 * else the organisation or journal without its parenthesis, else the first
 * author of the citation (the 26 book chapters with no organisation), cut
 * between words at 24 characters. The full name is in the drawer and the list.
 */
export function sourceShortName(src) {
  const org = String(src?.organization || '').trim();
  const name = org.match(/^([A-Z][A-Z&]{1,7})\s*\(/)?.[1]
    || org.match(/\(([A-Z][A-Z&]{2,7})[,)]/)?.[1]
    || org.replace(/\s*\([^)]*\)/g, '').trim()
    || String(src?.citation || '').match(/^[^\s,.]+/)?.[0]
    || String(src?.title || '').trim();
  return clip(name, 24);
}

/**
 * A source's citation as a reader sees it, or its title where it has none.
 * 1,722 imported citations joined a title that already ends in a full stop
 * with ". " and read "saliva of dogs.. J Infect Dis" (the importer is fixed
 * for new ones; the registry is left as it was imported).
 */
export function citationText(src) {
  return String(src?.citation || src?.title || '').replace(/([^.])\.\.(?=\s|$)/g, '$1.');
}

/** "WOAH 2023": the short name and the year, where the registry has one. */
export function sourceChipLabel(src) {
  const name = sourceShortName(src);
  return src?.year ? `${name} ${src.year}` : name;
}

// The article's checking history, built only from what the claims record: the
// day each was checked against its source (review.reviewedAt). Newest day
// first; for each day the claims, the sections they sit in (by index, in
// article order) and the distinct works they cite. No reviewer names: every
// claim's reviewer is the machine sentinel 'reference-verified' (schema.js).
export function reviewHistory(sections, resolve) {
  const days = new Map();
  (sections || []).forEach((section, si) => {
    for (const claim of section.claims || []) {
      const date = claim.review?.reviewedAt;
      if (!date) continue;
      let day = days.get(date);
      if (!day) days.set(date, (day = { date, claims: 0, sections: [], works: new Set() }));
      day.claims += 1;
      if (day.sections[day.sections.length - 1] !== si) day.sections.push(si);
      for (const ref of claim.sourceRefs || []) {
        const src = resolve(ref);
        if (src) day.works.add(src.work || src.id);
      }
    }
  });
  return [...days.values()]
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .map(({ works, ...day }) => ({ ...day, sources: works.size }));
}
