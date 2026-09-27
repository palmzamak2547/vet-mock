// The data grid [M1-DESIGN.md 17; competitor-gaps.md D4(a); workspace board "Data"]: virtualised rows
// (@tanstack/react-virtual, rows positioned with transform only), cells after the recipe, converted
// cells tinted with the file's text in the tooltip, missing cells as a dash with the reason, edited
// cells marked, derived columns labelled, personal-data columns left out. Keyboard: arrows move, Enter
// or F2 edits, Escape cancels, Enter saves the edit as a recipe step. OWNER: workspace role.
import { useEffect, useRef, useState } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useT } from '../../i18n/index.js';
import { MISSING_KEYS, cellCanonical, cellInfo } from '../lib/grid-model.js';
import { eraTag } from '../lib/era.js';

const ROW_H = 40;
const widthOf = (col) => (col?.kind === 'number' ? 108 : col?.kind === 'date' ? 128 : 150);

/**
 * @param {{ ctx: any, cols: { key: string, entry: any, derived: boolean }[], rows: number[], onEdit: (i: number, key: string, from: string, to: string) => void, onRowAction?: (i: number) => void, label: string }} props
 */
export default function DataGrid({ ctx, cols, rows, onEdit, onRowAction, label }) {
  const { t, lang } = useT();
  const scrollRef = useRef(null);
  const [active, setActive] = useState({ r: 0, c: 0 });
  const [editing, setEditing] = useState(null);
  const [draft, setDraft] = useState('');
  const focusWanted = useRef(false);
  const widths = [64, ...cols.map((c) => widthOf(ctx.table.columns[c.key]))];
  const total = widths.reduce((a, b) => a + b, 0);
  const virt = useVirtualizer({ count: rows.length, getScrollElement: () => scrollRef.current, estimateSize: () => ROW_H, overscan: 12 });

  useEffect(() => {
    if (active.r >= rows.length) setActive((a) => ({ ...a, r: Math.max(0, rows.length - 1) }));
  }, [rows.length, active.r]);

  useEffect(() => {
    if (!focusWanted.current) return;
    focusWanted.current = false;
    const el = scrollRef.current?.querySelector(`[data-cell="${active.r}:${active.c}"]`);
    el?.focus({ preventScroll: true });
  });

  const move = (dr, dc) => {
    const r = Math.max(0, Math.min(rows.length - 1, active.r + dr));
    const c = Math.max(0, Math.min(cols.length, active.c + dc));
    setActive({ r, c });
    virt.scrollToIndex(r, { align: 'auto' });
    focusWanted.current = true;
  };

  const startEdit = (r, c) => {
    if (c === 0) { onRowAction?.(rows[r]); return; }
    const col = cols[c - 1];
    if (!col || col.derived) return;
    const i = rows[r];
    setEditing({ r, c });
    setDraft(cellCanonical(ctx.table.columns[col.key], i));
  };

  const commit = () => {
    if (!editing) return;
    const col = cols[editing.c - 1];
    const i = rows[editing.r];
    const from = cellCanonical(ctx.table.columns[col.key], i);
    const to = draft.normalize('NFC').trim();
    setEditing(null);
    focusWanted.current = true;
    if (to !== from) onEdit(i, col.key, from, to);
  };

  const onKey = (e) => {
    if (editing) return;
    switch (e.key) {
      case 'ArrowDown': e.preventDefault(); move(1, 0); break;
      case 'ArrowUp': e.preventDefault(); move(-1, 0); break;
      case 'ArrowRight': e.preventDefault(); move(0, 1); break;
      case 'ArrowLeft': e.preventDefault(); move(0, -1); break;
      case 'PageDown': e.preventDefault(); move(10, 0); break;
      case 'PageUp': e.preventDefault(); move(-10, 0); break;
      case 'Home': e.preventDefault(); move(0, -cols.length); break;
      case 'End': e.preventDefault(); move(0, cols.length); break;
      case 'Enter':
      case 'F2': e.preventDefault(); startEdit(active.r, active.c); break;
      default: break;
    }
  };

  return (
    <div className="rs-grid-wrap">
      <div ref={scrollRef} className="rs-grid-scroll" role="grid" aria-label={label} aria-rowcount={rows.length + 1} aria-colcount={cols.length + 1} onKeyDown={onKey}>
        <div className="rs-grid-head" role="row" aria-rowindex={1} style={{ width: total }}>
          <div role="columnheader" aria-colindex={1} className="rs-gcell rs-gcell--head rs-gcell--num" style={{ width: widths[0] }}>{t('ws.grid.rowHead')}</div>
          {cols.map((c, k) => {
            const col = ctx.table.columns[c.key];
            const name = lang === 'en' ? c.entry.labelEn || c.entry.name : c.entry.labelTh || c.entry.name;
            return (
              <div key={c.key} role="columnheader" aria-colindex={k + 2} className={`rs-gcell rs-gcell--head${col?.kind === 'number' ? ' rs-gcell--num' : ''}`} style={{ width: widths[k + 1] }} title={c.entry.name}>
                <span className="rs-gcell-name">{name}</span>
                {col?.kind === 'date' ? <span className="rs-xsmall rs-soft">{eraTag(lang)}</span> : null}
                {c.derived ? <span className="rs-xsmall rs-soft">{t('ws.grid.derived')}</span> : null}
              </div>
            );
          })}
        </div>
        <div className="rs-grid-body" style={{ height: virt.getTotalSize(), width: total }}>
          {virt.getVirtualItems().map((vr) => {
            const i = rows[vr.index];
            const rowId = ctx.table.rowIds[i];
            const excluded = ctx.table.excluded?.[rowId];
            const rIsActive = active.r === vr.index;
            return (
              <div key={rowId} role="row" aria-rowindex={vr.index + 2} className={`rs-grid-row${excluded ? ' rs-grid-row--excluded' : ''}`} style={{ transform: `translateY(${vr.start}px)`, width: total }}>
                <div
                  role="rowheader"
                  aria-colindex={1}
                  data-cell={`${vr.index}:0`}
                  tabIndex={rIsActive && active.c === 0 ? 0 : -1}
                  className="rs-gcell rs-gcell--num rs-gcell--rowhead"
                  style={{ width: widths[0] }}
                  onClick={() => setActive({ r: vr.index, c: 0 })}
                  onDoubleClick={() => onRowAction?.(i)}
                  // Only an excluded row carries a tooltip; the internal row id (r1, r2) is not for people (review round 3).
                  title={excluded ? t('ws.grid.excludedTitle') : undefined}
                >
                  {/^n\d+$/.test(rowId) ? rowId : i + 1}
                </div>
                {cols.map((c, k) => {
                  const info = cellInfo(ctx, c.key, i, lang);
                  const isActive = rIsActive && active.c === k + 1;
                  const isEditing = editing && editing.r === vr.index && editing.c === k + 1;
                  const col = ctx.table.columns[c.key];
                  const cls = ['rs-gcell'];
                  if (col?.kind === 'number') cls.push('rs-gcell--num');
                  if (info.converted) cls.push('rs-gcell--conv');
                  if (info.edited) cls.push('rs-gcell--edit');
                  if (info.missing) cls.push('rs-gcell--miss');
                  const title = info.edited ? t('ws.grid.editedTitle') : info.converted || (info.missing && info.rawText) ? t('ws.grid.fileValue', { value: info.rawText }) : undefined;
                  return (
                    <div
                      key={c.key}
                      role="gridcell"
                      aria-colindex={k + 2}
                      aria-readonly={c.derived || undefined}
                      data-cell={`${vr.index}:${k + 1}`}
                      tabIndex={isActive ? 0 : -1}
                      className={cls.join(' ')}
                      style={{ width: widths[k + 1] }}
                      title={title}
                      onClick={() => setActive({ r: vr.index, c: k + 1 })}
                      onDoubleClick={() => startEdit(vr.index, k + 1)}
                    >
                      {isEditing ? (
                        <input
                          className="rs-gcell-input"
                          autoFocus
                          value={draft}
                          aria-label={t('ws.grid.editLabel', { column: c.entry.name })}
                          onChange={(e) => setDraft(e.target.value)}
                          onBlur={commit}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') { e.preventDefault(); commit(); }
                            else if (e.key === 'Escape') { e.preventDefault(); setEditing(null); focusWanted.current = true; }
                            e.stopPropagation();
                          }}
                        />
                      ) : info.missing ? (
                        <><span aria-hidden="true">—</span> <span className="rs-xsmall">{t(MISSING_KEYS[info.missing] || 'ws.missing.blank')}</span></>
                      ) : info.text}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
