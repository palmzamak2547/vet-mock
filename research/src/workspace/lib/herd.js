// The herd picture on the prevalence screen [workspace board "Prevalence"]: one small group of dots
// per farm, filled dots for positives. It is drawn from the rows in use; the picture prints no numbers
// of its own (the numbers on that screen come from the engine's envelope). Pure.
// OWNER: workspace role.

const collator = typeof Intl !== 'undefined' ? new Intl.Collator('th', { numeric: true }) : null;

/**
 * @param {import('../../lib/runtime/types.js').WorkingTable} table
 * @param {string} clusterKey
 * @param {string} outcomeKey binary category column
 * @param {string} positive level value counted as positive
 * @returns {{ id: string, n: number, pos: number }[]} groups in Thai collation order of the farm id
 */
export function herdGroups(table, clusterKey, outcomeKey, positive) {
  const cl = table?.columns?.[clusterKey];
  const out = table?.columns?.[outcomeKey];
  if (!cl || !out || out.kind !== 'category') return [];
  const posIdx = (out.levels || []).indexOf(positive);
  const groups = new Map();
  for (let i = 0; i < table.rowIds.length; i += 1) {
    if (table.excluded?.[table.rowIds[i]]) continue;
    if ((out.missing?.[i] || 0) !== 0 || (cl.missing?.[i] || 0) !== 0) continue;
    const id = cl.kind === 'category' ? cl.levels[cl.values[i]] : String(cl.values[i]);
    const g = groups.get(id) || { id, n: 0, pos: 0 };
    g.n += 1;
    if (out.values[i] === posIdx) g.pos += 1;
    groups.set(id, g);
  }
  const list = [...groups.values()];
  list.sort((a, b) => (collator ? collator.compare(a.id, b.id) : a.id.localeCompare(b.id)));
  return list;
}

/**
 * Dot positions for the groups: `cols` groups per row, five dots per line inside a group.
 * @returns {{ width: number, height: number, dots: { x: number, y: number, pos: boolean }[], labels: { x: number, y: number, id: string }[] }}
 */
export function herdLayout(groups, { cols = 7, step = 12, cellW = 78, cellH = 70, perLine = 5, labels = true } = {}) {
  const maxN = Math.max(0, ...groups.map((g) => g.n));
  const lines = Math.max(1, Math.ceil(maxN / perLine));
  const h = Math.max(cellH, lines * step + (labels ? 26 : 10));
  const rows = Math.ceil(groups.length / cols);
  const dots = [];
  const lab = [];
  groups.forEach((g, gi) => {
    const x0 = (gi % cols) * cellW + (cellW - perLine * step) / 2 + step / 2;
    const y0 = Math.floor(gi / cols) * h + 6 + step / 2;
    for (let k = 0; k < g.n; k += 1) dots.push({ x: x0 + (k % perLine) * step, y: y0 + Math.floor(k / perLine) * step, pos: k < g.pos });
    if (labels) lab.push({ x: x0 + ((perLine - 1) * step) / 2, y: y0 + lines * step + 8, id: g.id });
  });
  return { width: Math.max(cellW, cols * cellW), height: Math.max(h, rows * h), dots, labels: lab };
}
