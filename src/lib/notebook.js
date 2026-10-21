// Notebooks: blank paper to write on, without a lecture PDF.
//
// A notebook is a PDF the app makes itself (pdf-lib, already used by the
// export), opened in the same reader as any deck, under a stable key
// `nb:<id>`. Its ink is stored and synced by that key like every document's,
// so a notebook gets every reader tool (pen, lasso, full screen, export) and
// adding a page regenerates the paper without touching the ink: pages are
// only ever appended, so page N stays page N.
//
// The list of notebooks (title, paper, page count) lives in this browser.

const KEY = 'vmx-notebooks-v1';
export const NOTEBOOK_MAX_PAGES = 200;

// A4 portrait in PDF points. Ruling follows paper students already know:
// 8 mm lines (wide-ruled school paper), a 5 mm grid and dot grid, and the
// Cornell layout (cue column 2.5 in, summary 2 in).
export const PAGE = { w: 595.28, h: 841.89 };
const MM = 72 / 25.4;
export const PAPERS = [
  { id: 'blank', label: 'ว่าง' },
  { id: 'lined', label: 'เส้นบรรทัด' },
  { id: 'grid', label: 'ตาราง' },
  { id: 'dot', label: 'จุด' },
  { id: 'cornell', label: 'Cornell' },
];

const read = () => {
  try {
    const v = JSON.parse(localStorage.getItem(KEY) || '[]');
    return Array.isArray(v) ? v.filter((n) => n && typeof n.id === 'string') : [];
  } catch { return []; }
};
const write = (list) => {
  try { localStorage.setItem(KEY, JSON.stringify(list)); return true; } catch { return false; }
};

export function listNotebooks() {
  return read().sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
}

export function createNotebook({ title, paper = 'lined', pages = 4, now = Date.now(), id } = {}) {
  const nb = {
    id: id || `${now.toString(36)}${Math.random().toString(36).slice(2, 8)}`,
    title: String(title || '').trim().slice(0, 80) || 'สมุดเล่มใหม่',
    paper: PAPERS.some((p) => p.id === paper) ? paper : 'lined',
    pages: Math.min(NOTEBOOK_MAX_PAGES, Math.max(1, Math.round(pages))),
    createdAt: now,
    updatedAt: now,
  };
  write([nb, ...read()]);
  return nb;
}

export function updateNotebook(id, patch, now = Date.now()) {
  const list = read();
  const i = list.findIndex((n) => n.id === id);
  if (i < 0) return null;
  const cur = list[i];
  const next = {
    ...cur,
    ...(patch.title !== undefined ? { title: String(patch.title).trim().slice(0, 80) || cur.title } : {}),
    // Pages only grow: shrinking would orphan the ink on the pages removed.
    ...(patch.pages !== undefined ? { pages: Math.min(NOTEBOOK_MAX_PAGES, Math.max(cur.pages, Math.round(patch.pages))) } : {}),
    updatedAt: now,
  };
  list[i] = next;
  write(list);
  return next;
}

export function removeNotebook(id) {
  const list = read();
  const next = list.filter((n) => n.id !== id);
  write(next);
  return next.length !== list.length;
}

export const notebookKey = (id) => `nb:${id}`;

/** Ruling lines for one page, in PDF points (origin bottom-left). Pure. */
export function rulingFor(paper, { w = PAGE.w, h = PAGE.h } = {}) {
  const lines = []; const dots = [];
  if (paper === 'lined' || paper === 'cornell') {
    const step = 8 * MM;
    const top = h - 30 * MM;
    for (let y = top; y > 15 * MM; y -= step) lines.push([0, y, w, y]);
    if (paper === 'lined') lines.push([25 * MM, 0, 25 * MM, h]); // the margin rule
  }
  if (paper === 'cornell') {
    lines.push([2.5 * 72, 2 * 72, 2.5 * 72, h - 22 * MM]); // cue column
    lines.push([0, 2 * 72, w, 2 * 72]); // summary
    lines.push([0, h - 22 * MM, w, h - 22 * MM]); // title band
  }
  if (paper === 'grid') {
    const step = 5 * MM;
    for (let x = step; x < w; x += step) lines.push([x, 0, x, h]);
    for (let y = step; y < h; y += step) lines.push([0, y, w, y]);
  }
  if (paper === 'dot') {
    const step = 5 * MM;
    for (let x = step; x < w; x += step) for (let y = step; y < h; y += step) dots.push([x, y]);
  }
  return { lines, dots };
}

/** The notebook as PDF bytes: `pages` sheets of its paper. The ruling is
 *  drawn once, on a template page, and every sheet shows that one XObject:
 *  a dot grid is ~2,400 marks, and copied per page a 200-page notebook was
 *  megabytes of the same dots. */
export async function buildNotebookPdf({ paper, pages }) {
  const { PDFDocument, rgb } = await import('pdf-lib');
  const doc = await PDFDocument.create();
  const n = Math.min(NOTEBOOK_MAX_PAGES, Math.max(1, pages));
  const { lines, dots } = rulingFor(paper);
  let sheet = null;
  if (lines.length || dots.length) {
    const tpl = await PDFDocument.create();
    const t = tpl.addPage([PAGE.w, PAGE.h]);
    const ink = rgb(0.72, 0.78, 0.86); // a pale blue-grey that recedes under ink
    for (const [x1, y1, x2, y2] of lines) {
      t.drawLine({ start: { x: x1, y: y1 }, end: { x: x2, y: y2 }, thickness: 0.6, color: ink });
    }
    for (const [x, y] of dots) t.drawCircle({ x, y, size: 0.9, color: ink });
    [sheet] = await doc.embedPdf(await tpl.save());
  }
  for (let i = 0; i < n; i += 1) {
    const page = doc.addPage([PAGE.w, PAGE.h]);
    if (sheet) page.drawPage(sheet, { x: 0, y: 0, width: PAGE.w, height: PAGE.h });
  }
  doc.setTitle('VetMock notebook');
  doc.setProducer('VetMock');
  return doc.save({ useObjectStreams: true });
}
