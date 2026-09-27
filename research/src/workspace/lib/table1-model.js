// Table 1 as a reader expects it [M1-DESIGN.md 7.4; workspace board "Table1"]. The engine returns
// Table 1 in long form (one row per variable, level, statistic and group: stats/table1.js); this
// pivots it into one block per level of organisation, one row per variable (and per category level),
// one column per group, with the cell text a paper prints: "30 (21 to 43)" for a median with its
// quartiles, "12.4 (3.1)" for a mean with its SD, "116 (24.2%)" for a count with its share of the
// known values, and the missing count of each variable under it. No p-values, no CI (G10). Numbers
// are formatted only here, through the injected stats formatter; nothing is recomputed.
// Pure. OWNER: workspace role.

const NUMERIC_STATS = new Set(['n', 'median', 'q1', 'q3', 'mean', 'sd', 'min', 'max']);

/**
 * @typedef {{ formatNumber: (x: number|null, o: { kind: string }) => string }} Fmt
 * @typedef {{ label: string, kind: 'variable'|'level'|'missing', cells: string[] }} T1Row
 * @typedef {{ id: string, unit: string, columns: string[], groups: string[], rows: T1Row[] }} T1Block
 */

const isBlock = (id) => /^table1\./.test(id) && id !== 'table1.groups' && id !== 'table1.inconsistentWithinCluster';

/**
 * @param {any} env the desc.table1 envelope
 * @param {{ t: (k: string, p?: object) => string, fmt: Fmt, labelOf?: (key: string) => string }} ctx
 * @returns {{ blocks: T1Block[], inconsistent: { variable: string, clusters: number }[] }}
 */
export function table1Blocks(env, ctx) {
  const { t, fmt } = ctx;
  const labelOf = ctx.labelOf || ((k) => k);
  const tables = env?.tables || [];
  const groupSizes = new Map(((tables.find((x) => x.id === 'table1.groups') || {}).rows || []).map((r) => [String(r[0]), r[1]]));
  const num = (v, kind = 'statistic') => (v === null || v === undefined ? '—' : fmt.formatNumber(v, { kind }));
  const blocks = [];
  for (const tb of tables) {
    if (!isBlock(tb.id)) continue;
    const unit = tb.id.slice('table1.'.length);
    const cols = tb.columns || [];
    const at = (name) => cols.indexOf(name);
    const [iVar, iLev, iStat, iGrp, iVal] = ['variable', 'level', 'stat', 'group', 'value'].map(at);
    const groups = [];
    const vars = [];
    const cell = new Map();
    for (const r of tb.rows || []) {
      const v = String(r[iVar]);
      const g = r[iGrp] === null || r[iGrp] === undefined ? 'all' : String(r[iGrp]);
      if (!groups.includes(g)) groups.push(g);
      if (!vars.some((x) => x.key === v)) vars.push({ key: v, levels: [], missing: [], numeric: false, stats: new Set() });
      const vr = vars.find((x) => x.key === v);
      const stat = String(r[iStat]);
      const level = r[iLev] === null || r[iLev] === undefined ? null : String(r[iLev]);
      vr.stats.add(stat);
      if (NUMERIC_STATS.has(stat) && level === null) vr.numeric = true;
      if (level !== null && !vr.levels.includes(level)) vr.levels.push(level);
      if (stat.startsWith('missing.') && !vr.missing.includes(stat)) vr.missing.push(stat);
      cell.set(`${v}|${level}|${stat}|${g}`, r[iVal]);
    }
    groups.sort((a, b) => (a === 'all' ? -1 : b === 'all' ? 1 : 0));
    const get = (v, level, stat, g) => cell.get(`${v}|${level}|${stat}|${g}`);
    const rows = [];
    for (const vr of vars) {
      const cat = vr.levels.length > 0 && !vr.numeric;
      const meanSd = vr.stats.has('mean');
      const statLabel = cat ? t('ws.table1.stat.nPercent') : meanSd ? t('ws.table1.stat.meanSd') : t('ws.table1.stat.medianIqr');
      if (cat) {
        rows.push({ label: t('ws.table1.rowLabel', { name: labelOf(vr.key), stat: statLabel }), kind: 'variable', cells: groups.map((g) => {
          const known = get(vr.key, null, 'known', g);
          return known === undefined ? '' : t('ws.table1.known', { n: num(known, 'count') });
        }) });
        for (const lv of vr.levels) {
          rows.push({ label: lv, kind: 'level', cells: groups.map((g) => {
            const c = get(vr.key, lv, 'count', g);
            const pc = get(vr.key, lv, 'percent', g);
            if (c === undefined) return '';
            return pc === null || pc === undefined ? `${num(c, 'count')} (—)` : `${num(c, 'count')} (${num(pc, 'percent')})`;
          }) });
        }
      } else {
        rows.push({ label: t('ws.table1.rowLabel', { name: labelOf(vr.key), stat: statLabel }), kind: 'variable', cells: groups.map((g) => {
          if (meanSd) {
            const m = get(vr.key, null, 'mean', g);
            if (m === undefined) return '';
            return `${num(m)} (${num(get(vr.key, null, 'sd', g))})`;
          }
          const md = get(vr.key, null, 'median', g);
          if (md === undefined) return '';
          return t('ws.table1.medianCell', { median: num(md), q1: num(get(vr.key, null, 'q1', g)), q3: num(get(vr.key, null, 'q3', g)) });
        }) });
        rows.push({ label: t('ws.table1.nKnown'), kind: 'level', cells: groups.map((g) => {
          const n = get(vr.key, null, 'n', g);
          return n === undefined ? '' : num(n, 'count');
        }) });
      }
      for (const ms of vr.missing) {
        const reason = ms.slice('missing.'.length);
        rows.push({ label: t(`ws.missing.${reason}`), kind: 'missing', cells: groups.map((g) => {
          const n = get(vr.key, null, ms, g);
          return n === undefined ? '0' : num(n, 'count');
        }) });
      }
    }
    const columns = [t('ws.table1.variable'), ...groups.map((g) => {
      const name = g === 'all' ? t('ws.table1.all') : g;
      const n = groupSizes.get(g);
      return g !== 'all' && n !== undefined && unit !== 'cluster' ? t('ws.table1.groupHead', { name, n: num(n, 'count') }) : name;
    })];
    blocks.push({ id: tb.id, unit, columns, groups, rows });
  }
  const bad = tables.find((x) => x.id === 'table1.inconsistentWithinCluster');
  const inconsistent = (bad?.rows || []).map((r) => ({ variable: labelOf(String(r[0])), clusters: r[1] }));
  return { blocks, inconsistent };
}

/**
 * One block as an export table (Word, CSV): rows indented by kind in the first cell.
 * @param {T1Block} block
 * @param {string} caption
 * @param {string} note
 */
export function table1Export(block, caption, note) {
  return {
    caption,
    columns: block.columns,
    rows: block.rows.map((r) => [r.kind === 'variable' ? r.label : `   ${r.label}`, ...r.cells]),
    note,
  };
}
