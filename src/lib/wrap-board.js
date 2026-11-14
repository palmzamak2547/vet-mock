// ============================================================
// wrap-board.js — the wrap-up as a differential board
// ============================================================
// Reading mode follows the course topic by topic; a farm case does not. It
// arrives as what is seen: how the problem spreads in the herd, how old the
// pigs are, what the faeces look like, what an antibiotic did. The board
// lays the paper out in that order, a step per question asked of the farm,
// each clue pointing to the diseases it suggests, then how each is confirmed.
//
// Nothing on the board is written for it. A board file
// (src/data/wrapup-boards/) only ARRANGES the wrap-up's own lines: every cell
// is [words, item, line], and the words must be found in that line of that
// item, which also gives the cell its citation. resolveBoard checks each cell
// against the wrap-up the page loaded: a cell whose words are no longer in its
// line is dropped and listed (tests/unit/wrap-board.test.mjs fails on any
// for the shipped boards), and a board left with too little is no board at
// all, so the mode is not offered rather than drawn half empty.
//
// A line is named by its item (the start of the item's name, which must fit
// exactly one item) and a code: k<n> a keyword, e<n> what the lecturer
// stressed, x<n> what a past paper asked, p the pitfall, a the agent.
//
// The one thing kept per device is whether names start covered, under a
// vmx-wrap-board-* key; a missing or corrupt value starts with names shown.
// Nothing here touches sync or the exam session.
// ============================================================

export const BOARD_VERSION = 1;

/** Less than this and the paper shows no board at all. */
export const BOARD_MIN = Object.freeze({ steps: 2, rows: 4, items: 2 });

/** The localStorage key for one paper's board: vmx-wrap-board-<subject>-<term>-<phase>. */
export function boardKey(subject, term, phase) {
  const part = (v) => String(v ?? 'none').replace(/[^0-9A-Za-z_-]/g, '_');
  return `vmx-wrap-board-${part(subject)}-${part(term)}-${part(phase)}`;
}

export const freshBoardPrefs = () => ({ v: BOARD_VERSION, hide: false });

/** The saved preference, or a fresh one for anything missing, old or corrupt. */
export function readBoardPrefs(raw) {
  let v;
  try { v = typeof raw === 'string' ? JSON.parse(raw) : raw; } catch { return freshBoardPrefs(); }
  if (!v || typeof v !== 'object' || Array.isArray(v) || v.v !== BOARD_VERSION || typeof v.hide !== 'boolean') return freshBoardPrefs();
  return { v: BOARD_VERSION, hide: v.hide };
}

const KIND = { k: 'keywords', e: 'emphasis', x: 'examined', p: 'pitfall', a: 'agent' };
const fold = (s) => String(s ?? '').replace(/\s+/g, ' ').trim();

/** { text, src, kind } for an item's line code, or null. */
function lineOf(item, code) {
  const m = /^([kexpa])(\d*)$/.exec(String(code || ''));
  if (!m || !item) return null;
  const kind = KIND[m[1]];
  if (kind === 'pitfall' || kind === 'agent') return m[2] === '' && typeof item[kind] === 'string' ? { text: item[kind], src: null, kind } : null;
  const list = item[kind];
  const at = Number(m[2]);
  if (m[2] === '' || !Array.isArray(list) || !(at < list.length)) return null;
  const line = list[at];
  if (kind === 'keywords') return typeof line === 'string' ? { text: line, src: null, kind, at } : null;
  return line && typeof line.text === 'string' ? { text: line.text, src: line.src || null, kind, at } : null;
}

/**
 * The resolved board for this wrap-up, or null when the board is for another
 * paper or too little of it holds:
 * { title, frame, items: [n], steps: [{ title, rows: [{ clue: { text, n },
 *   note?, to: [{ kind: 'item', n, name, short, th, notes: [text] } | { kind: 'text', text, n }] }],
 *   cites: [{ n, kind, src? }] }], dropped: [why] }.
 * n is the item's number on the page (1-based, across lecturers).
 */
export function resolveBoard(board, wrapup) {
  if (!board || !wrapup || board.v !== BOARD_VERSION) return null;
  if (board.subject !== wrapup.subject || board.exam !== wrapup.exam?.date) return null;
  const items = (wrapup.groups || []).flatMap((g) => g.items || []);
  const dropped = [];

  const find = (key) => {
    const hits = [];
    items.forEach((it, i) => { if (key && String(it?.name || '').startsWith(key)) hits.push(i); });
    return hits.length === 1 ? hits[0] : -1;
  };

  // A cell: its words, found in its line. Records the line for the step's citations.
  const cell = (spec, used, what) => {
    const [text, key, code] = Array.isArray(spec) ? spec : [];
    const i = find(key);
    const line = i >= 0 ? lineOf(items[i], code) : null;
    if (!line || !fold(text) || !fold(line.text).includes(fold(text))) {
      dropped.push(`${what}: "${text}" not in ${key} ${code}`);
      return null;
    }
    used.push({ n: i + 1, kind: line.kind, at: line.at ?? -1, src: line.src });
    return { text: fold(text), n: i + 1 };
  };

  const steps = [];
  const onBoard = new Set();
  for (const step of board.steps || []) {
    const used = [];
    const rows = [];
    for (const row of step.rows || []) {
      const rowUsed = [];
      const clue = cell(row.clue, rowUsed, `${step.title} clue`);
      if (!clue) continue;
      const to = [];
      for (const target of row.to || []) {
        if (target?.item !== undefined) {
          const i = find(target.item);
          if (i < 0) { dropped.push(`${step.title}: no single item named "${target.item}"`); continue; }
          const notes = (target.notes || []).map((spec) => cell(spec, rowUsed, `${step.title} note`)).filter(Boolean).map((c) => c.text);
          // The node is labelled by the key, the start of the item's own name
          // ("Colibacillosis" for "Colibacillosis: enterotoxigenic E. coli and
          // edema disease"); the card beside it carries the whole name.
          to.push({ kind: 'item', n: i + 1, name: items[i].name, short: fold(target.item), th: items[i].th || '', notes });
        } else {
          const t = cell(target?.text, rowUsed, `${step.title} result`);
          if (t) to.push({ kind: 'text', text: t.text, n: t.n });
        }
      }
      if (!to.length) { dropped.push(`${step.title}: "${clue.text}" points to nothing`); continue; }
      const note = row.note ? cell(row.note, rowUsed, `${step.title} row note`) : null;
      for (const t of to) if (t.kind === 'item') onBoard.add(t.n);
      used.push(...rowUsed);
      rows.push({ clue, to, ...(note ? { note: note.text } : {}) });
    }
    if (!rows.length) continue;
    // Each line the step quotes, once, in page order: a quoted keyword or
    // pitfall is cited as the item it belongs to.
    const seen = new Set();
    const cites = used
      .slice()
      .sort((a, b) => a.n - b.n || a.kind.localeCompare(b.kind) || a.at - b.at)
      .filter((u) => {
        const id = u.src ? `${u.n}|${u.kind}|${u.src}` : `${u.n}|${u.kind}`;
        if (seen.has(id)) return false;
        seen.add(id);
        return true;
      })
      .map((u) => (u.src ? { n: u.n, src: u.src, kind: u.kind } : { n: u.n, kind: u.kind }));
    steps.push({ title: fold(step.title), rows, cites });
  }

  const rowCount = steps.reduce((sum, s) => sum + s.rows.length, 0);
  if (steps.length < BOARD_MIN.steps || rowCount < BOARD_MIN.rows || onBoard.size < BOARD_MIN.items) return null;
  const frame = find(board.frame);
  return {
    title: fold(board.title),
    frame: frame >= 0 ? frame + 1 : null,
    items: [...onBoard].sort((a, b) => a - b),
    steps,
    dropped,
  };
}

/** "2, 3 และ 5": a list of item numbers as a sentence says it. */
export function numberList(ns) {
  const list = [...ns];
  if (list.length < 2) return list.join('');
  return `${list.slice(0, -1).join(', ')} และ ${list[list.length - 1]}`;
}
