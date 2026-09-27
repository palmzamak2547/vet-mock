// Report [M1-DESIGN.md 17; workspace board "Report"]: the methods and results draft in Thai and English,
// built from the kept results and the recipe (never typed numbers), with copy buttons, a STROBE-Vet
// check of what the draft covers, the counts at each step, and the fingerprint of the data it was
// computed on. Kept results that no longer match the current data are listed as not current, never
// recomputed silently. OWNER: workspace role.
import { useMemo } from 'react';
import { useT, translate } from '../../i18n/index.js';
import { DESIGNS } from '../../lib/epi/design.js';
import { describeStep } from '../../lib/intake/recipe.js';
import { getMethod } from '../../lib/runtime/catalog.js';
import { download } from '../../lib/runtime/export.js';
import { useWs } from '../ws-context.js';
import { buildDraft } from '../report/build.js';
import { strobeStatus } from '../report/strobe.js';
import { copyParagraph } from '../lib/clipboard.js';
import { formatMoment } from '../lib/era.js';
import { isStale } from '../lib/result-model.js';
import { FMT, safeFileBase } from '../components/ResultView.jsx';
import { Notice, PageHead } from '../components/Bits.jsx';
import Icon from '../components/Icon.jsx';
import Link from '../components/Link.jsx';
import Paragraphs from '../components/Paragraphs.jsx';

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** @param {{ p: any }} props */
export default function ReportPane({ p }) {
  const { t, lang } = useT();
  const { notify } = useWs();
  const designRow = DESIGNS.find((d) => d.id === p.project.design) || null;
  const nameKeyOf = (id) => getMethod(id)?.nameKey || null;
  const steps = p.meta?.steps || [];
  const drafts = useMemo(() => {
    const data = { analyses: p.analyses, steps, project: p.project, table: p.table, codebook: p.codebook };
    const make = (lg) => {
      const tl = (k, params) => translate(lg, k, params);
      try {
        return buildDraft(data, { t: tl, fmt: FMT, lang: lg, nameKeyOf, designNameKey: designRow?.nameKey || null, describeStep, designRow });
      } catch {
        return { methods: '', results: '', stale: [], used: [] };
      }
    };
    return { th: make('th'), en: make('en') };
  }, [p.analyses, steps, p.project, p.table, p.codebook, designRow]);
  const stale = p.analyses.filter((a) => isStale(a, p.table?.fingerprint));
  const strobe = strobeStatus({ analyses: p.analyses, steps, codebook: p.codebook });
  const fp = p.table?.fingerprint || '';

  const copy = async (text, lg) => {
    const how = await copyParagraph(text, { lang: lg });
    notify(how === 'failed' ? 'ws.copy.failed' : 'ws.copy.paragraph', {}, how === 'failed' ? 'error' : 'ok');
    if (how !== 'failed') await p.log('download', { what: 'report-clipboard', lang: lg });
  };

  const downloadDraft = async () => {
    const html = `<!doctype html><html><head><meta charset="utf-8"><title>${esc(p.project.name)}</title></head><body style="font-family: Sarabun, 'TH Sarabun New', sans-serif; max-width: 48rem; margin: 2rem auto; line-height: 1.6;">`
      + `<h1>${esc(p.project.name)}</h1>`
      + `<h2>${esc(t('ws.report.methods'))}</h2><p lang="th">${esc(drafts.th.methods)}</p><p lang="en">${esc(drafts.en.methods)}</p>`
      + `<h2>${esc(t('ws.report.results'))}</h2><p lang="th">${esc(drafts.th.results)}</p><p lang="en">${esc(drafts.en.results)}</p>`
      + `<p style="font-size: 0.85em;">sha256 ${esc(fp)}</p></body></html>`;
    download(new Blob([html], { type: 'text/html;charset=utf-8' }), `${safeFileBase(p.project.name)}-report.html`);
    await p.log('download', { what: 'report-html' });
    notify('ws.report.downloaded', {}, 'ok');
  };

  const assoc = p.analyses.find((a) => a.envelope?.provenance?.rowsUsed !== undefined && a.envelope?.method?.id !== 'desc.table1');
  const clusterKey = p.codebook?.clusterKey;
  const clusterCount = useMemo(() => {
    const col = clusterKey ? p.table?.columns?.[clusterKey] : null;
    if (!col) return null;
    const seen = new Set();
    for (let i = 0; i < p.table.rowIds.length; i += 1) if (!p.table.excluded?.[p.table.rowIds[i]] && !(col.missing?.[i])) seen.add(col.values[i]);
    return seen.size;
  }, [clusterKey, p.table]);

  return (
    <>
      <PageHead
        eyebrow={t('ws.report.eyebrow')}
        title={t('ws.report.title')}
        sub={t('ws.report.sub')}
        right={(
          <button type="button" className="rs-btn" onClick={downloadDraft} disabled={!p.analyses.length}>
            <Icon name="down" size={18} />
            {t('ws.report.download')}
          </button>
        )}
      />
      {stale.length ? (
        <Notice tone="warn" title={t('ws.report.staleTitle', { n: stale.length })}>
          {t('ws.report.staleBody')}
          <ul className="rs-plainlist">
            {stale.map((a) => <li key={a.id}><Link to={`/app/p/${p.project.id}/r/${a.id}`}>{t(nameKeyOf(a.spec?.method) || 'ws.report.result')}</Link></li>)}
          </ul>
        </Notice>
      ) : null}
      {!p.analyses.length ? <Notice tone="info" title={t('ws.report.emptyTitle')}>{t('ws.report.emptyBody')}</Notice> : null}
      <div className="rs-report">
        <article className="rs-panel rs-pad rs-stack">
          <h2 className="rs-h2">{t('ws.report.methods')}</h2>
          <Paragraphs label={t('ws.report.methods')} th={drafts.th.methods} en={drafts.en.methods} onCopy={copy} />
          <hr className="rs-hr" />
          <h2 className="rs-h2">{t('ws.report.results')}</h2>
          <Paragraphs label={t('ws.report.results')} th={drafts.th.results} en={drafts.en.results} onCopy={copy} />
        </article>
        <aside className="rs-report-side">
          <section className="rs-panel rs-pad" aria-labelledby="rs-h-kept">
            <h2 id="rs-h-kept" className="rs-h3">{t('ws.report.kept', { n: p.analyses.length })}</h2>
            <ul className="rs-plainlist rs-kept">
              {p.analyses.map((a) => (
                <li key={a.id} className="rs-kept-item">
                  <Link to={`/app/p/${p.project.id}/r/${a.id}`}>{t(nameKeyOf(a.spec?.method) || 'ws.report.result')}</Link>
                  <span className="rs-soft rs-xsmall">{formatMoment(a.createdAt, lang, { time: true })}{isStale(a, p.table?.fingerprint) ? ` ${t('ws.report.notCurrent')}` : ''}</span>
                </li>
              ))}
            </ul>
          </section>
          <section className="rs-panel rs-pad" aria-labelledby="rs-h-strobe">
            <h2 id="rs-h-strobe" className="rs-h3">{t('ws.report.strobe')}</h2>
            <ul className="rs-plainlist rs-strobe">
              {strobe.map((s) => (
                <li key={s.item} className={`rs-strobe-item${s.ok ? '' : ' rs-strobe-item--open'}`}>
                  <Icon name={s.ok ? 'check' : 'alert'} size={18} />
                  <span className="rs-num rs-strong">{s.item}</span>
                  <span>
                    <span className="rs-strong">{t(`ws.strobe.${s.key}.title`)}</span>
                    <span className="rs-soft rs-small"> {s.ok ? t(`ws.strobe.${s.key}.ok`) : t(`ws.strobe.${s.key}.open`)}</span>
                  </span>
                </li>
              ))}
            </ul>
          </section>
          <section className="rs-panel rs-pad" aria-labelledby="rs-h-flow">
            <h2 id="rs-h-flow" className="rs-h3">{t('ws.report.flow')}</h2>
            <ol className="rs-flow">
              {clusterCount !== null ? <li><span className="rs-flow-big rs-num">{clusterCount.toLocaleString('en-US')}</span><span className="rs-soft rs-small">{t('ws.report.flowClusters')}</span></li> : null}
              {p.table ? <li><span className="rs-flow-big rs-num">{p.table.rowIds.length.toLocaleString('en-US')}</span><span className="rs-soft rs-small">{t('ws.report.flowRows')}</span></li> : null}
              {assoc ? <li><span className="rs-flow-big rs-num">{assoc.envelope.provenance.rowsUsed.toLocaleString('en-US')}</span><span className="rs-soft rs-small">{t('ws.report.flowUsed', { method: t(nameKeyOf(assoc.envelope.method.id) || 'ws.report.result') })}</span></li> : null}
            </ol>
          </section>
          {fp ? (
            <section className="rs-panel rs-pad">
              <h2 className="rs-h3">{t('ws.report.fingerprint')}</h2>
              <p className="rs-soft rs-small">{t('ws.report.fingerprintNote')}</p>
              <p className="rs-mono rs-small rs-break">sha256 {fp.match(/.{1,4}/g).slice(0, 8).join(' ')}</p>
            </section>
          ) : null}
        </aside>
      </div>
    </>
  );
}
