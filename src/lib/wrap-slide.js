// ============================================================
// wrap-slide.js — the real slide under a wrap-up line that cites it
// ============================================================
// A wrap-up line cites its deck page as text: "เดค Swine Enteric Diseases
// หน้า 97". Reading the words next to the slide they came from is easier to
// remember than the words alone, so the page shows that slide under the line.
//
// The pictures are the ones the answer evidence already serves
// (docs/ANSWER-EVIDENCE.md): a page is in the image store only when a
// question's evidence row cites it, and that row carries the page's size. So
// the index below is built from src/data/evidence/<subject>.generated.js, and
// a cited page that no row names has no picture: the line keeps its citation
// and shows nothing more. Never a guess: a deck is matched on its title,
// exactly after folding case, punctuation and spacing, and a title two
// documents share is dropped rather than picked.
// ============================================================

/** A deck title folded for matching: lower case, '&' as 'and', punctuation and spacing collapsed. */
export function normTitle(t) {
  return String(t ?? '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[\s_.,:;()[\]'"–—-]+/g, ' ')
    .trim();
}

// "เดค <title> หน้า <pages>": the title runs up to the last "หน้า" of the piece.
const DECK = /^\s*เดค\s+(.+)\s+หน้า\s+([0-9][0-9,\s–-]*)$/;

/**
 * The deck pages a citation names, in the order written:
 * [{ title, pages: [n, ...] }]. Only single pages are kept: a range
 * ("หน้า 1-10") cites a section, not one slide, so it gets no picture.
 */
export function deckCites(src) {
  const out = [];
  for (const piece of String(src ?? '').split(/\s*;\s*/)) {
    const m = DECK.exec(piece);
    if (!m) continue;
    const pages = m[2].split(/\s*,\s*/)
      .map((p) => p.trim())
      .filter((p) => /^\d+$/.test(p))
      .map(Number)
      .filter((n) => n > 0);
    if (pages.length) out.push({ title: m[1].trim(), pages });
  }
  return out;
}

/**
 * The pages that have a picture, from a subject's evidence index
 * ({ docs: [[sha16, slug, title, kind]], q: { id: [doc, page, w, h, boxes, hash] } }):
 * Map(normTitle → { sha16, title, kind, pages: Map(page → { w, h }) }).
 * A title shared by two different documents is left out.
 */
export function slideIndex(evidence) {
  const byTitle = new Map();
  const clash = new Set();
  const docs = Array.isArray(evidence?.docs) ? evidence.docs : [];
  docs.forEach((d, i) => {
    if (!Array.isArray(d) || !d[0]) return;
    const key = normTitle(d[2]);
    if (!key) return;
    const prior = byTitle.get(key);
    if (prior && prior.sha16 !== d[0]) { clash.add(key); return; }
    if (!prior) byTitle.set(key, { sha16: d[0], title: d[2], kind: d[3], doc: i, pages: new Map() });
  });
  for (const key of clash) byTitle.delete(key);
  const byDoc = new Map([...byTitle.values()].map((v) => [v.doc, v]));
  for (const row of Object.values(evidence?.q || {})) {
    if (!Array.isArray(row)) continue;
    const [doc, page, w, h] = row;
    const entry = byDoc.get(doc);
    if (entry && page > 0 && w > 0 && h > 0 && !entry.pages.has(page)) entry.pages.set(page, { w, h });
  }
  return byTitle;
}

/**
 * The first page a citation names that has a picture, as a record the
 * evidence frame reads ({ sha16, title, kind, page, w, h, boxes: [] }), or
 * null. The boxes stay empty: the highlights in the store mark what a
 * question asked, not what this line says, so the page is shown unmarked.
 */
export function slideFor(src, index) {
  if (!index?.size) return null;
  for (const { title, pages } of deckCites(src)) {
    const entry = index.get(normTitle(title));
    if (!entry) continue;
    for (const page of pages) {
      const size = entry.pages.get(page);
      if (size) return { sha16: entry.sha16, title: entry.title, kind: entry.kind, page, w: size.w, h: size.h, boxes: [] };
    }
  }
  return null;
}

/** Every deck page an item's lines cite, each with whether it has a picture: for the audit script and tests. */
export function itemSlideAudit(item, index) {
  const out = [];
  const lines = [...(item?.emphasis || []), ...(item?.examined || [])];
  for (const line of lines) {
    for (const { title, pages } of deckCites(line?.src)) {
      const entry = index?.get(normTitle(title));
      for (const page of pages) out.push({ title, page, deck: Boolean(entry), picture: Boolean(entry?.pages.has(page)) });
    }
  }
  return out;
}
