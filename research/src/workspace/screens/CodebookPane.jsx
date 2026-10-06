// Codebook [M1-DESIGN.md 8.3; workspace board "Codebook"]: what one row is, whether animals sit in
// groups (farms), and per column the Thai and English label, type, role, level of organisation,
// reference and positive level, missing codes and personal-data hiding. Asked once at import,
// editable later, saved compare-and-set, exported with every result. OWNER: ui-tools role (M2; workspace
// in M1). M2 [M2-DESIGN.md 12.4]: each category gets a Thai and an English label, so English paragraphs
// and tables name a level as the student wrote it in English (the value itself when left empty).
import { useEffect, useMemo, useRef, useState } from 'react';
import { useT } from '../../i18n/index.js';
import { checkCodebook, resolveColumnVisibility } from '../../lib/intake/codebook.js';
import { Chip, Notice, PageHead } from '../components/Bits.jsx';
import Icon from '../components/Icon.jsx';
import Link from '../components/Link.jsx';
import { keyPart } from '../lib/keys.js';
import '../../styles/tools.css';

const TYPES = ['continuous', 'count', 'binary', 'nominal', 'ordinal', 'date', 'id', 'text'];
const ROLES = ['outcome', 'exposure', 'confounder', 'group', 'cluster', 'id', 'pair', 'rater', 'time', 'none'];
const LEVELS = ['animal', 'farm', 'pen', 'household', 'litter', 'sample', 'visit', 'region'];
const UNITS = ['animal', 'sample', 'visit', 'farm'];

const clone = (v) => JSON.parse(JSON.stringify(v));

/**
 * Whether a sideways-scrolling box has more to show on either side. The codebook is wider than the
 * page on every screen (review round 3: at 1440 its last column was clipped with no cue), so the box
 * shows a shadow on each side that still hides columns. State changes only when a side flips.
 */
function useScrollEdges() {
  const ref = useRef(null);
  const [edges, setEdges] = useState({ left: false, right: false });
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const update = () => {
      const left = el.scrollLeft > 2;
      const right = el.scrollLeft + el.clientWidth < el.scrollWidth - 2;
      setEdges((e) => (e.left === left && e.right === right ? e : { left, right }));
    };
    update();
    el.addEventListener('scroll', update, { passive: true });
    let ro = null;
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(update);
      ro.observe(el);
      if (el.firstElementChild) ro.observe(el.firstElementChild);
    }
    return () => {
      el.removeEventListener('scroll', update);
      ro?.disconnect();
    };
  }, []);
  return [ref, edges];
}

/** @param {{ p: any }} props */
export default function CodebookPane({ p }) {
  const { t, lang } = useT();
  const [draft, setDraft] = useState(() => clone(p.meta.codebook));
  const [issues, setIssues] = useState([]);
  const [scrollRef, edges] = useScrollEdges();
  useEffect(() => { setDraft(clone(p.meta.codebook)); }, [p.meta.codebook]);
  const dirty = useMemo(() => JSON.stringify(draft) !== JSON.stringify(p.meta.codebook), [draft, p.meta.codebook]);

  const setCol = (key, patch) => setDraft((d) => ({ ...d, columns: d.columns.map((c) => (c.key === key ? { ...c, ...patch } : c)) }));
  const setLevel = (key, value, patch) => setDraft((d) => ({ ...d, columns: d.columns.map((c) => (c.key === key ? { ...c, levels: (c.levels || []).map((l) => (l.value === value ? { ...l, ...patch } : l)) } : c)) }));
  const clusterCandidates = draft.columns.filter((c) => ['id', 'nominal'].includes(c.type) || c.role === 'cluster');
  const cluster = draft.columns.find((c) => c.key === draft.clusterKey);
  const effectiveColumns = new Map((p.codebook?.columns || []).map((c) => [c.key, c]));

  const save = async () => {
    let res;
    try { res = checkCodebook(draft); } catch { res = { ok: true, issues: [] }; }
    setIssues(res.issues || []);
    if (!res.ok) return;
    await p.commitCodebook(draft);
  };

  const issueFor = (key) => issues.filter((i) => i.column === key);

  return (
    <>
      <PageHead
        eyebrow={t('ws.codebook.eyebrow')}
        title={t('ws.codebook.title')}
        sub={t('ws.codebook.sub')}
        right={<Link to={`/app/p/${p.project.id}/design`} className="rs-btn rs-btn--primary">{t('ws.codebook.next')}<Icon name="arrow" size={18} /></Link>}
      />
      <div className="rs-grid2">
        <div className="rs-panel rs-pad">
          <div className="rs-eyebrow" id="rs-cb-unit">{t('ws.codebook.unitLabel')}</div>
          <div className="rs-row-wrap" role="radiogroup" aria-labelledby="rs-cb-unit">
            {UNITS.map((u) => (
              <button key={u} type="button" role="radio" aria-checked={draft.unitOfAnalysis === u} className={`rs-btn${draft.unitOfAnalysis === u ? ' rs-btn--chosen' : ''}`} onClick={() => setDraft((d) => ({ ...d, unitOfAnalysis: u }))}>
                {draft.unitOfAnalysis === u ? <Icon name="check" size={18} /> : null}
                {t(`ws.codebook.unit.${u}`)}
              </button>
            ))}
          </div>
        </div>
        <div className={`rs-panel rs-pad${draft.clusterKey ? ' rs-panel--gold' : ''}`}>
          <label className="rs-eyebrow" htmlFor="rs-cb-cluster">{t('ws.codebook.clusterLabel')}</label>
          <select id="rs-cb-cluster" className="rs-select" value={draft.clusterKey || ''} onChange={(e) => setDraft((d) => ({ ...d, clusterKey: e.target.value || null }))}>
            <option value="">{t('ws.codebook.clusterNone')}</option>
            {clusterCandidates.map((c) => { const label = lang === 'en' ? c.labelEn : c.labelTh; return <option key={c.key} value={c.key}>{label && label !== c.name ? `${c.name} (${label})` : c.name}</option>; })}
          </select>
          <p className="rs-soft rs-small">{cluster ? t('ws.codebook.clusterOn', { column: cluster.name }) : t('ws.codebook.clusterOff')}</p>
        </div>
      </div>
      {issues.length ? <Notice tone="stop" title={t('ws.codebook.issuesTitle')} role="alert">{issues.map((i, k) => <div key={k}>{t(i.key, i.params)}</div>)}</Notice> : null}
      <section className="rs-panel" aria-labelledby="rs-h-vars">
        <h2 id="rs-h-vars" className="rs-visually-hidden">{t('ws.codebook.variables')}</h2>
        <div className="rs-tablescroll" data-more-left={edges.left ? 'true' : 'false'} data-more-right={edges.right ? 'true' : 'false'}>
        <div className="rs-tablewrap" ref={scrollRef}>
          <table className="rs-table rs-table--form">
            <thead>
              <tr>
                <th scope="col" className="rs-sticky-col">{t('ws.codebook.col.name')}</th>
                <th scope="col">{t('ws.codebook.col.labelTh')}</th>
                <th scope="col">{t('ws.codebook.col.labelEn')}</th>
                <th scope="col">{t('ws.codebook.col.type')}</th>
                <th scope="col">{t('ws.codebook.col.role')}</th>
                <th scope="col">{t('ws.codebook.col.level')}</th>
                <th scope="col">{t('ws.codebook.col.levels')}</th>
                <th scope="col">{t('ws.codebook.col.missing')}</th>
                <th scope="col">{t('ws.codebook.col.hidden')}</th>
              </tr>
            </thead>
            <tbody>
              {draft.columns.map((c) => {
                const lv = (c.levels || []).map((l) => l.value);
                const id = (f) => `rs-cb-${c.key}-${f}`;
                const effective = effectiveColumns.get(c.key);
                const hidden = resolveColumnVisibility(c, effective?.hidden).hidden;
                const pii = c.pii || effective?.pii;
                return (
                  <tr key={c.key} className={issueFor(c.key).length ? 'rs-row--issue' : ''}>
                    <th scope="row" className="rs-sticky-col">
                      <div className="rs-strong">{c.name}</div>
                      {/^d\d+$/.test(c.key) ? <Chip>{t('ws.codebook.derived')}</Chip> : null}
                      {pii ? <Chip icon="eyeOff">{t(`ws.pii.${keyPart(pii)}`)}</Chip> : null}
                      {c.key === draft.clusterKey ? <Chip tone="gold">{t('ws.codebook.isCluster')}</Chip> : null}
                      {issueFor(c.key).map((i, k) => <div key={k} className="rs-issue">{t(i.key, i.params)}</div>)}
                    </th>
                    <td><input id={id('th')} aria-label={t('ws.codebook.controlFor', { control: t('ws.codebook.col.labelTh'), column: c.name })} className="rs-input" value={c.labelTh || ''} onChange={(e) => setCol(c.key, { labelTh: e.target.value })} /></td>
                    <td><input id={id('en')} aria-label={t('ws.codebook.controlFor', { control: t('ws.codebook.col.labelEn'), column: c.name })} lang="en" className="rs-input" value={c.labelEn || ''} onChange={(e) => setCol(c.key, { labelEn: e.target.value })} /></td>
                    <td>
                      <select aria-label={t('ws.codebook.controlFor', { control: t('ws.codebook.col.type'), column: c.name })} className="rs-select rs-select--type" value={c.type} onChange={(e) => setCol(c.key, { type: e.target.value })}>
                        {TYPES.map((v) => <option key={v} value={v}>{t(`ws.type.${v}`)}</option>)}
                      </select>
                    </td>
                    <td>
                      <select aria-label={t('ws.codebook.controlFor', { control: t('ws.codebook.col.role'), column: c.name })} className="rs-select rs-select--role" value={c.role} onChange={(e) => setCol(c.key, { role: e.target.value })}>
                        {ROLES.map((v) => <option key={v} value={v}>{t(`ws.cbrole.${v}`)}</option>)}
                      </select>
                    </td>
                    <td>
                      <select aria-label={t('ws.codebook.controlFor', { control: t('ws.codebook.col.level'), column: c.name })} className="rs-select rs-select--level" value={c.level} onChange={(e) => setCol(c.key, { level: e.target.value })}>
                        {LEVELS.map((v) => <option key={v} value={v}>{t(`ws.level.${v}`)}</option>)}
                      </select>
                    </td>
                    <td>
                      {lv.length ? (
                        <div className="rs-stack">
                          {['binary', 'nominal', 'ordinal'].includes(c.type) ? (
                            <label className="rs-field--mini">
                              <span className="rs-soft rs-xsmall">{t('ws.codebook.reference')}</span>
                              <select className="rs-select rs-select--sm" value={c.reference || ''} onChange={(e) => setCol(c.key, { reference: e.target.value || null })}>
                                <option value="">{t('ws.codebook.none')}</option>
                                {lv.map((v) => <option key={v} value={v}>{v}</option>)}
                              </select>
                            </label>
                          ) : null}
                          {c.type === 'binary' ? (
                            <label className="rs-field--mini">
                              <span className="rs-soft rs-xsmall">{t('ws.codebook.positive')}</span>
                              <select className="rs-select rs-select--sm" value={c.positive || ''} onChange={(e) => setCol(c.key, { positive: e.target.value || null })}>
                                <option value="">{t('ws.codebook.none')}</option>
                                {lv.map((v) => <option key={v} value={v}>{v}</option>)}
                              </select>
                            </label>
                          ) : null}
                          <details className="rs-tl-levels">
                            <summary className="rs-soft rs-xsmall">{t('ws.codebook.levelCount', { n: lv.length })} {t('tools.codebook.labelsOpen')}</summary>
                            <table className="rs-table rs-table--compact">
                              <caption className="rs-visually-hidden">{t('tools.codebook.labelsCaption', { column: c.name })}</caption>
                              <thead><tr><th scope="col">{t('tools.codebook.value')}</th><th scope="col">{t('ws.codebook.col.labelTh')}</th><th scope="col">{t('ws.codebook.col.labelEn')}</th></tr></thead>
                              <tbody>
                                {(c.levels || []).map((l) => (
                                  <tr key={l.value}>
                                    <th scope="row" className="rs-mono">{l.value}</th>
                                    <td><input className="rs-input rs-input--sm" aria-label={t('tools.codebook.levelTh', { value: l.value, column: c.name })} value={l.labelTh || ''} onChange={(e) => setLevel(c.key, l.value, { labelTh: e.target.value })} /></td>
                                    <td><input className="rs-input rs-input--sm" lang="en" aria-label={t('tools.codebook.levelEn', { value: l.value, column: c.name })} value={l.labelEn || ''} placeholder={l.value} onChange={(e) => setLevel(c.key, l.value, { labelEn: e.target.value })} /></td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                            <p className="rs-soft rs-xsmall">{t('tools.codebook.labelsHint')}</p>
                          </details>
                        </div>
                      ) : <span className="rs-soft">—</span>}
                    </td>
                    <td>
                      {(c.missingCodes || []).length ? (
                        <ul className="rs-plainlist rs-small">
                          {c.missingCodes.map((m, k) => <li key={k}><span className="rs-mono">{m.code === '' ? t('ws.codebook.blank') : `"${m.code}"`}</span> {t(`ws.missing.${keyPart(m.reason)}`)}</li>)}
                        </ul>
                      ) : <span className="rs-soft">—</span>}
                    </td>
                    <td>
                      <label className="rs-switch">
                        <input type="checkbox" checked={hidden} onChange={(e) => setCol(c.key, { hidden: e.target.checked, hiddenExplicit: true })} />
                        <span>{hidden ? t('ws.codebook.hiddenYes') : t('ws.codebook.hiddenNo')}</span>
                      </label>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        </div>
      </section>
      <p className="rs-soft rs-small">{t('ws.codebook.derivedNote')}</p>
      <div className="rs-savebar">
        <span className="rs-soft rs-small">{dirty ? t('ws.codebook.unsaved') : t('ws.codebook.allSaved')}</span>
        <button type="button" className="rs-btn" disabled={!dirty || p.busy} onClick={() => { setDraft(clone(p.meta.codebook)); setIssues([]); }}>{t('ws.action.discard')}</button>
        <button type="button" className="rs-btn rs-btn--primary" disabled={!dirty || p.busy} onClick={save}>{t('ws.codebook.save')}</button>
      </div>
    </>
  );
}
