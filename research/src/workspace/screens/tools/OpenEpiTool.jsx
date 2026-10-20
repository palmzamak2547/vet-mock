// OpenEpi quick epidemiologic calculator suite without a data file.
// Supports 2x2 tables, diagnostic test evaluation, proportion intervals, person-time rates,
// and a directory of original OpenEpi modules with cross-links.
import { useEffect, useMemo, useRef, useState } from 'react';
import { registerArea, useT } from '../../../i18n/index.js';
import openepi from '../../../i18n/openepi.js';
import { PageHead, Field } from '../../components/Bits.jsx';
import Icon from '../../components/Icon.jsx';
import Rail from '../../components/Rail.jsx';
import TopBar from '../../components/TopBar.jsx';
import Link from '../../components/Link.jsx';
import { TOOL_RAIL } from './tool-rail.js';
import { formatNumber, formatP, formatCi } from '../../../lib/stats/format.js';
import { copyParagraph } from '../../lib/clipboard.js';
import { copyTable } from '../../../lib/runtime/export.js';
import { useWs } from '../../ws-context.js';
import {
  computeTwoByTwo,
  computeDiagnostic,
  computeProportionMethods,
  computePersonTimeRates,
} from './openepi-calc.js';
import '../../../styles/tools.css';

// This screen is lazy, so its words load with it (see i18n/openepi.js).
registerArea('openepi', openepi);

const TABS = Object.freeze(['twobytwo', 'diagnostic', 'proportion', 'persontime', 'modules']);
const CONF_LEVELS = Object.freeze([0.9, 0.95, 0.99]);

export default function OpenEpiTool() {
  const { t, lang } = useT();
  const { notify } = useWs();
  const [menu, setMenu] = useState(false);
  const [activeTab, setActiveTab] = useState('twobytwo');
  const tabRefs = useRef({});

  useEffect(() => {
    document.title = `${t('tools.openepi.title')} | ${t('common.appName')}`;
  }, [t]);

  const onTabKey = (e) => {
    const i = TABS.indexOf(activeTab);
    const next = e.key === 'ArrowRight' ? TABS[(i + 1) % TABS.length]
      : e.key === 'ArrowLeft' ? TABS[(i - 1 + TABS.length) % TABS.length]
      : e.key === 'Home' ? TABS[0]
      : e.key === 'End' ? TABS[TABS.length - 1]
      : null;
    if (!next) return;
    e.preventDefault();
    setActiveTab(next);
    tabRefs.current[next]?.focus();
  };

  const selectTab = (tabId) => {
    setActiveTab(tabId);
    tabRefs.current[tabId]?.focus();
  };

  return (
    <div className="rs-ws">
      <TopBar crumb={t('tools.openepi.crumb')} onMenu={() => setMenu((v) => !v)} menuOpen={menu} />
      <div className="rs-ws-body">
        <Rail pane="openEpi" items={TOOL_RAIL} open={menu} onClose={() => setMenu(false)} fileLineKey="ws.ss.noFile" />
        <main id="rs-main" className="rs-main">
          <PageHead
            eyebrow={t('tools.openepi.eyebrow')}
            title={t('tools.openepi.title')}
            sub={t('tools.openepi.sub')}
            action={
              <a
                href="https://www.openepi.com/Menu/OE_Menu.htm"
                target="_blank"
                rel="noopener noreferrer"
                className="rs-btn rs-btn--secondary rs-row"
              >
                <span>{t('tools.openepi.openEpiLink')}</span>
                <Icon name="arrow" size={16} />
              </a>
            }
          />

          {/* Interactive Method Selector Guide */}
          <FlowSelector activeTab={activeTab} onSelect={selectTab} t={t} />

          <div className="rs-tabs" role="tablist" aria-label={t('tools.openepi.title')}>
            {TABS.map((tabId) => (
              <button
                key={tabId}
                ref={(el) => { tabRefs.current[tabId] = el; }}
                type="button"
                role="tab"
                aria-selected={activeTab === tabId}
                tabIndex={activeTab === tabId ? 0 : -1}
                onKeyDown={onTabKey}
                className={`rs-tab${activeTab === tabId ? ' rs-tab--on' : ''}`}
                onClick={() => selectTab(tabId)}
              >
                {t(`tools.openepi.tab.${tabId}`)}
              </button>
            ))}
          </div>

          {activeTab === 'twobytwo' && <TwoByTwoPane t={t} lang={lang} notify={notify} />}
          {activeTab === 'diagnostic' && <DiagnosticPane t={t} lang={lang} notify={notify} />}
          {activeTab === 'proportion' && <ProportionPane t={t} lang={lang} notify={notify} />}
          {activeTab === 'persontime' && <PersonTimePane t={t} lang={lang} notify={notify} />}
          {activeTab === 'modules' && <ModulesPane t={t} />}
        </main>
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Interactive Flow Selector
// -----------------------------------------------------------------------------
function FlowSelector({ activeTab, onSelect, t }) {
  return (
    <div className="rs-tl-flow-nav" role="region" aria-label={t('tools.openepi.flow.title')}>
      {TABS.map((tabId) => {
        const titleKey = tabId === 'twobytwo' ? 'tools.openepi.flow.card2x2Title'
          : tabId === 'diagnostic' ? 'tools.openepi.flow.cardDxTitle'
          : tabId === 'proportion' ? 'tools.openepi.flow.cardPropTitle'
          : tabId === 'persontime' ? 'tools.openepi.flow.cardPtTitle'
          : 'tools.openepi.flow.cardDirTitle';
        const descKey = tabId === 'twobytwo' ? 'tools.openepi.flow.card2x2Desc'
          : tabId === 'diagnostic' ? 'tools.openepi.flow.cardDxDesc'
          : tabId === 'proportion' ? 'tools.openepi.flow.cardPropDesc'
          : tabId === 'persontime' ? 'tools.openepi.flow.cardPtDesc'
          : 'tools.openepi.flow.cardDirDesc';
        const active = activeTab === tabId;
        return (
          <button
            key={tabId}
            type="button"
            className={`rs-tl-flow-card${active ? ' rs-tl-flow-card--on' : ''}`}
            onClick={() => onSelect(tabId)}
            aria-pressed={active}
          >
            <div className="rs-tl-flow-card-head">
              <span>{t(titleKey)}</span>
              {active && <span className="rs-chip rs-chip--gold rs-chip--inline">{t('tools.openepi.openEpiBadge')}</span>}
            </div>
            <p className="rs-tl-flow-card-desc">{t(descKey)}</p>
          </button>
        );
      })}
    </div>
  );
}

// -----------------------------------------------------------------------------
// Epidemiological Interpretation Box
// -----------------------------------------------------------------------------
function InterpretationBox({ title, text, onCopyText, onCopyTable, isSignificant, t }) {
  return (
    <section className="rs-tl-summary-box rs-stack" aria-label={title}>
      <div className="rs-tl-summary-head">
        <h3 className="rs-tl-summary-title">
          <Icon name="check" size={16} />
          <span>{title}</span>
        </h3>
        {isSignificant !== undefined && (
          <span className={`rs-chip ${isSignificant ? 'rs-chip--gold' : ''} rs-chip--inline`}>
            {isSignificant ? t('tools.openepi.statSig') : t('tools.openepi.notStatSig')}
          </span>
        )}
      </div>
      <p className="rs-tl-summary-text">{text}</p>
      <div className="rs-tl-summary-actions">
        {onCopyText && (
          <button type="button" className="rs-btn rs-btn--sm rs-row" onClick={onCopyText}>
            <Icon name="copy" size={14} />
            <span>{t('tools.openepi.interpretation.copy')}</span>
          </button>
        )}
        {onCopyTable && (
          <button type="button" className="rs-btn rs-btn--secondary rs-btn--sm rs-row" onClick={onCopyTable}>
            <Icon name="table" size={14} />
            <span>{t('tools.openepi.table.copy')}</span>
          </button>
        )}
      </div>
    </section>
  );
}

// -----------------------------------------------------------------------------
// Two by Two Table Pane
// -----------------------------------------------------------------------------
function TwoByTwoPane({ t, lang, notify }) {
  const [a, setA] = useState('32');
  const [b, setB] = useState('68');
  const [c, setC] = useState('11');
  const [d, setD] = useState('89');
  const [design, setDesign] = useState('cohort');
  const [confLevel, setConfLevel] = useState(0.95);
  const [zeroCell, setZeroCell] = useState('none');
  const [preset, setPreset] = useState('prrs');

  const na = Math.max(0, parseInt(a, 10) || 0);
  const nb = Math.max(0, parseInt(b, 10) || 0);
  const nc = Math.max(0, parseInt(c, 10) || 0);
  const nd = Math.max(0, parseInt(d, 10) || 0);

  const res = useMemo(() => {
    return computeTwoByTwo({ a: na, b: nb, c: nc, d: nd, design, confLevel, zeroCell });
  }, [na, nb, nc, nd, design, confLevel, zeroCell]);

  const applyPreset = (key) => {
    setPreset(key);
    if (key === 'prrs') {
      setA('32');
      setB('68');
      setC('11');
      setD('89');
      setDesign('cohort');
    } else if (key === 'mastitis') {
      setA('28');
      setB('72');
      setC('12');
      setD('88');
      setDesign('cohort');
    } else if (key === 'parvo') {
      setA('45');
      setB('15');
      setC('12');
      setD('48');
      setDesign('caseControl');
    } else if (key === 'avianFlu') {
      setA('24');
      setB('96');
      setC('8');
      setD('112');
      setDesign('crossSectional');
    }
  };

  const clear = () => {
    setPreset('');
    setA('0');
    setB('0');
    setC('0');
    setD('0');
  };

  const { marginals, measures, tests } = res;

  // Clinical interpretation sentence
  const conf = String(Math.round(confLevel * 100));
  const interpretationText = useMemo(() => {
    const pStr = formatP(tests.uncorrected.p);
    if (design === 'cohort' && measures.RR) {
      return t('tools.openepi.interp.rr', {
        conf,
        est: formatNumber(measures.RR.value, { kind: 'ratio' }),
        ci: formatCi(measures.RR, lang),
        p: pStr,
        rd: formatNumber(measures.RD.value, { kind: 'proportion' }),
      });
    }
    if (design === 'caseControl' && measures.OR) {
      return t('tools.openepi.interp.or', {
        conf,
        est: formatNumber(measures.OR.value, { kind: 'ratio' }),
        ci: formatCi(measures.OR, lang),
        p: pStr,
      });
    }
    if (design === 'crossSectional' && measures.PR) {
      return t('tools.openepi.interp.pr', {
        conf,
        est: formatNumber(measures.PR.value, { kind: 'ratio' }),
        ci: formatCi(measures.PR, lang),
        p: pStr,
        rd: formatNumber(measures.PD.value, { kind: 'proportion' }),
      });
    }
    return '';
  }, [design, measures, tests, conf, lang, t]);

  const copyInterp = async () => {
    if (!interpretationText) return;
    const resHow = await copyParagraph(interpretationText, { lang });
    notify(resHow === 'failed' ? 'ws.copy.failed' : 'tools.openepi.interpretation.copied', {}, resHow === 'failed' ? 'error' : 'ok');
  };

  const copyTableData = async () => {
    const columns = [
      t('tools.openepi.twobytwo.measure'),
      t('tools.openepi.twobytwo.estimate'),
      t('tools.openepi.twobytwo.ci'),
      t('tools.openepi.twobytwo.methodUsed'),
    ];
    const rows = [];
    if (design === 'cohort') {
      if (measures.RR) rows.push([t('tools.openepi.twobytwo.rr'), formatNumber(measures.RR.value, { kind: 'ratio' }), formatCi(measures.RR, lang), measures.RR.ciMethod || '']);
      if (measures.RD) rows.push([t('tools.openepi.twobytwo.rd'), formatNumber(measures.RD.value, { kind: 'proportion' }), formatCi(measures.RD, lang), measures.RD.ciMethod || '']);
      if (measures.AFe) rows.push([t('tools.openepi.twobytwo.afe'), formatNumber(measures.AFe.value, { kind: 'proportion' }), formatCi(measures.AFe, lang), measures.AFe.ciMethod || '']);
      if (measures.AFp) rows.push([t('tools.openepi.twobytwo.afp'), formatNumber(measures.AFp.value, { kind: 'proportion' }), formatCi(measures.AFp, lang), measures.AFp.ciMethod || '']);
      if (measures.OR) rows.push([t('tools.openepi.twobytwo.or'), formatNumber(measures.OR.value, { kind: 'ratio' }), formatCi(measures.OR, lang), measures.OR.ciMethod || '']);
    } else if (design === 'caseControl') {
      if (measures.OR) rows.push([t('tools.openepi.twobytwo.or'), formatNumber(measures.OR.value, { kind: 'ratio' }), formatCi(measures.OR, lang), measures.OR.ciMethod || '']);
      if (measures.AFeEst) rows.push([t('tools.openepi.twobytwo.afeEst'), formatNumber(measures.AFeEst.value, { kind: 'proportion' }), formatCi(measures.AFeEst, lang), measures.AFeEst.ciMethod || '']);
      if (measures.AFpEst) rows.push([t('tools.openepi.twobytwo.afpEst'), formatNumber(measures.AFpEst.value, { kind: 'proportion' }), formatCi(measures.AFpEst, lang), measures.AFpEst.ciMethod || '']);
    } else if (design === 'crossSectional') {
      if (measures.PR) rows.push([t('tools.openepi.twobytwo.pr'), formatNumber(measures.PR.value, { kind: 'ratio' }), formatCi(measures.PR, lang), measures.PR.ciMethod || '']);
      if (measures.POR) rows.push([t('tools.openepi.twobytwo.por'), formatNumber(measures.POR.value, { kind: 'ratio' }), formatCi(measures.POR, lang), measures.POR.ciMethod || '']);
      if (measures.PD) rows.push([t('tools.openepi.twobytwo.rd'), formatNumber(measures.PD.value, { kind: 'proportion' }), formatCi(measures.PD, lang), measures.PD.ciMethod || '']);
      if (measures.AFe) rows.push([t('tools.openepi.twobytwo.afe'), formatNumber(measures.AFe.value, { kind: 'proportion' }), formatCi(measures.AFe, lang), measures.AFe.ciMethod || '']);
      if (measures.AFp) rows.push([t('tools.openepi.twobytwo.afp'), formatNumber(measures.AFp.value, { kind: 'proportion' }), formatCi(measures.AFp, lang), measures.AFp.ciMethod || '']);
    }
    const resHow = await copyTable({
      caption: `${t('tools.openepi.twobytwo.title')} (${t(`tools.openepi.twobytwo.design${design.charAt(0).toUpperCase() + design.slice(1)}`)})`,
      columns,
      rows,
    });
    notify(resHow === 'failed' ? 'ws.copy.failed' : 'tools.openepi.table.copied', {}, resHow === 'failed' ? 'error' : 'ok');
  };

  const isSig = tests.uncorrected.p != null && tests.uncorrected.p < 1 - confLevel;

  return (
    <div className="rs-tl-epi-grid">
      <div className="rs-panel rs-pad rs-stack">
        <div className="rs-row">
          <h2 className="rs-h3 rs-grow">{t('tools.openepi.twobytwo.title')}</h2>
          <span className="rs-chip rs-chip--gold rs-chip--inline">{t('tools.openepi.openEpiBadge')}</span>
        </div>
        <p className="rs-soft rs-small">{t('tools.openepi.twobytwo.desc')}</p>

        {/* Veterinary Presets Selector */}
        {/* The example numbers are made up; say so where they are chosen, not only in the aria-label. */}
        <p className="rs-soft rs-xsmall">{t('tools.openepi.preset.label')}</p>
        <div className="rs-tl-preset-bar">
          <select
            className="rs-select rs-tl-preset-select"
            value={preset}
            onChange={(e) => applyPreset(e.target.value)}
            aria-label={t('tools.openepi.preset.label')}
          >
            <option value="">{t('tools.openepi.preset.select')}</option>
            <option value="prrs">{t('tools.openepi.preset.twobytwo.prrs')}</option>
            <option value="mastitis">{t('tools.openepi.preset.twobytwo.mastitis')}</option>
            <option value="parvo">{t('tools.openepi.preset.twobytwo.parvo')}</option>
            <option value="avianFlu">{t('tools.openepi.preset.twobytwo.avianFlu')}</option>
          </select>
          <button type="button" className="rs-btn rs-btn--sm" onClick={clear}>
            {t('tools.openepi.twobytwo.clear')}
          </button>
        </div>

        <div className="rs-formgrid">
          <Field label={t('tools.openepi.twobytwo.studyDesign')} htmlFor="oe-design">
            <select id="oe-design" className="rs-select" value={design} onChange={(e) => setDesign(e.target.value)}>
              <option value="cohort">{t('tools.openepi.twobytwo.designCohort')}</option>
              <option value="caseControl">{t('tools.openepi.twobytwo.designCaseControl')}</option>
              <option value="crossSectional">{t('tools.openepi.twobytwo.designCrossSectional')}</option>
            </select>
          </Field>
          <Field label={t('tools.openepi.twobytwo.confLevel')} htmlFor="oe-conf">
            <select id="oe-conf" className="rs-select" value={String(confLevel)} onChange={(e) => setConfLevel(Number(e.target.value))}>
              {CONF_LEVELS.map((cVal) => (
                <option key={cVal} value={String(cVal)}>{`${Math.round(cVal * 100)}%`}</option>
              ))}
            </select>
          </Field>
        </div>

        <label className="rs-check">
          <input
            type="checkbox"
            checked={zeroCell === 'haldane'}
            onChange={(e) => setZeroCell(e.target.checked ? 'haldane' : 'none')}
          />
          <span className="rs-small">{t('tools.openepi.twobytwo.haldane')}</span>
        </label>
        <p className="rs-soft rs-xsmall">{t('tools.openepi.twobytwo.haldaneHint')}</p>

        {/* 2x2 Matrix with Cell Guides */}
        <div className="rs-tablewrap">
          <table className="rs-tl-table2x2">
            <thead>
              <tr>
                <th className="rs-tl-th-side">{t('tools.openepi.twobytwo.exposure')}</th>
                <th>{t('tools.openepi.twobytwo.diseasePos')}</th>
                <th>{t('tools.openepi.twobytwo.diseaseNeg')}</th>
                <th className="rs-tl-td-tot">{t('tools.openepi.twobytwo.total')}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row" className="rs-tl-th-side">{t('tools.openepi.twobytwo.exposed')}</th>
                <td>
                  <div className="rs-tl-cell-wrap">
                    <input
                      type="number"
                      min="0"
                      className="rs-input rs-tl-input-cell"
                      value={a}
                      onChange={(e) => setA(e.target.value)}
                      aria-label={`${t('tools.openepi.twobytwo.exposed')} ${t('tools.openepi.twobytwo.diseasePos')}`}
                    />
                    <span className="rs-tl-cell-hint">{t('tools.openepi.cell.a')}</span>
                  </div>
                </td>
                <td>
                  <div className="rs-tl-cell-wrap">
                    <input
                      type="number"
                      min="0"
                      className="rs-input rs-tl-input-cell"
                      value={b}
                      onChange={(e) => setB(e.target.value)}
                      aria-label={`${t('tools.openepi.twobytwo.exposed')} ${t('tools.openepi.twobytwo.diseaseNeg')}`}
                    />
                    <span className="rs-tl-cell-hint">{t('tools.openepi.cell.b')}</span>
                  </div>
                </td>
                <td className="rs-tl-td-tot">{formatNumber(marginals.n1, { kind: 'count' })}</td>
              </tr>
              <tr>
                <th scope="row" className="rs-tl-th-side">{t('tools.openepi.twobytwo.unexposed')}</th>
                <td>
                  <div className="rs-tl-cell-wrap">
                    <input
                      type="number"
                      min="0"
                      className="rs-input rs-tl-input-cell"
                      value={c}
                      onChange={(e) => setC(e.target.value)}
                      aria-label={`${t('tools.openepi.twobytwo.unexposed')} ${t('tools.openepi.twobytwo.diseasePos')}`}
                    />
                    <span className="rs-tl-cell-hint">{t('tools.openepi.cell.c')}</span>
                  </div>
                </td>
                <td>
                  <div className="rs-tl-cell-wrap">
                    <input
                      type="number"
                      min="0"
                      className="rs-input rs-tl-input-cell"
                      value={d}
                      onChange={(e) => setD(e.target.value)}
                      aria-label={`${t('tools.openepi.twobytwo.unexposed')} ${t('tools.openepi.twobytwo.diseaseNeg')}`}
                    />
                    <span className="rs-tl-cell-hint">{t('tools.openepi.cell.d')}</span>
                  </div>
                </td>
                <td className="rs-tl-td-tot">{formatNumber(marginals.n0, { kind: 'count' })}</td>
              </tr>
              <tr>
                <th scope="row" className="rs-tl-th-side rs-tl-td-tot">{t('tools.openepi.twobytwo.total')}</th>
                <td className="rs-tl-td-tot">{formatNumber(marginals.m1, { kind: 'count' })}</td>
                <td className="rs-tl-td-tot">{formatNumber(marginals.m0, { kind: 'count' })}</td>
                <td className="rs-tl-td-tot">{formatNumber(marginals.N, { kind: 'count' })}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="rs-stack">
        {/* Executive Clinical Interpretation */}
        {interpretationText && (
          <InterpretationBox
            title={t('tools.openepi.interpretation.title')}
            text={interpretationText}
            onCopyText={copyInterp}
            onCopyTable={copyTableData}
            isSignificant={isSig}
            t={t}
          />
        )}

        <section className="rs-panel rs-pad rs-stack" aria-labelledby="oe-res-assoc">
          <div className="rs-row">
            <h2 id="oe-res-assoc" className="rs-h3 rs-grow">{t('tools.openepi.twobytwo.results')}</h2>
            <button type="button" className="rs-btn rs-btn--secondary rs-btn--sm rs-row" onClick={copyTableData}>
              <Icon name="table" size={14} />
              <span>{t('tools.openepi.table.copy')}</span>
            </button>
          </div>

          <div className="rs-tablewrap">
            <table className="rs-table rs-table--compact">
              <thead>
                <tr>
                  <th scope="col">{t('tools.openepi.twobytwo.measure')}</th>
                  <th scope="col" className="rs-r">{t('tools.openepi.twobytwo.estimate')}</th>
                  <th scope="col" className="rs-r">{t('tools.openepi.twobytwo.ci')}</th>
                  <th scope="col">{t('tools.openepi.twobytwo.methodUsed')}</th>
                </tr>
              </thead>
              <tbody>
                {design === 'cohort' && (
                  <>
                    <MeasureRow name={t('tools.openepi.twobytwo.rr')} valObj={measures.RR} kind="ratio" lang={lang} />
                    <MeasureRow name={t('tools.openepi.twobytwo.rd')} valObj={measures.RD} kind="proportion" lang={lang} />
                    <MeasureRow name={t('tools.openepi.twobytwo.afe')} valObj={measures.AFe} kind="proportion" lang={lang} />
                    <MeasureRow name={t('tools.openepi.twobytwo.afp')} valObj={measures.AFp} kind="proportion" lang={lang} />
                    <MeasureRow name={t('tools.openepi.twobytwo.or')} valObj={measures.OR} kind="ratio" lang={lang} />
                  </>
                )}
                {design === 'caseControl' && (
                  <>
                    <MeasureRow name={t('tools.openepi.twobytwo.or')} valObj={measures.OR} kind="ratio" lang={lang} />
                    <MeasureRow name={t('tools.openepi.twobytwo.afeEst')} valObj={measures.AFeEst} kind="proportion" lang={lang} />
                    <MeasureRow name={t('tools.openepi.twobytwo.afpEst')} valObj={measures.AFpEst} kind="proportion" lang={lang} />
                  </>
                )}
                {design === 'crossSectional' && (
                  <>
                    <MeasureRow name={t('tools.openepi.twobytwo.pr')} valObj={measures.PR} kind="ratio" lang={lang} />
                    <MeasureRow name={t('tools.openepi.twobytwo.por')} valObj={measures.POR} kind="ratio" lang={lang} />
                    <MeasureRow name={t('tools.openepi.twobytwo.rd')} valObj={measures.PD} kind="proportion" lang={lang} />
                    <MeasureRow name={t('tools.openepi.twobytwo.afe')} valObj={measures.AFe} kind="proportion" lang={lang} />
                    <MeasureRow name={t('tools.openepi.twobytwo.afp')} valObj={measures.AFp} kind="proportion" lang={lang} />
                  </>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rs-panel rs-pad rs-stack" aria-labelledby="oe-res-tests">
          <h2 id="oe-res-tests" className="rs-h3">{t('tools.openepi.twobytwo.tests')}</h2>
          <div className="rs-tablewrap">
            <table className="rs-table rs-table--compact">
              <thead>
                <tr>
                  <th scope="col">{t('tools.openepi.twobytwo.testName')}</th>
                  <th scope="col" className="rs-r">{t('tools.openepi.twobytwo.statistic')}</th>
                  <th scope="col" className="rs-r">{t('tools.openepi.twobytwo.df')}</th>
                  <th scope="col" className="rs-r">{t('tools.openepi.twobytwo.pValue')}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{t('tools.openepi.twobytwo.chisqUncorrected')}</td>
                  <td className="rs-r">{formatNumber(tests.uncorrected.stat, { kind: 'statistic', digits: 3 })}</td>
                  <td className="rs-r">1</td>
                  <td className="rs-r rs-strong">{formatP(tests.uncorrected.p)}</td>
                </tr>
                <tr>
                  <td>{t('tools.openepi.twobytwo.chisqYates')}</td>
                  <td className="rs-r">{formatNumber(tests.yates.stat, { kind: 'statistic', digits: 3 })}</td>
                  <td className="rs-r">1</td>
                  <td className="rs-r rs-strong">{formatP(tests.yates.p)}</td>
                </tr>
                <tr>
                  <td>{t('tools.openepi.twobytwo.chisqMh')}</td>
                  <td className="rs-r">{formatNumber(tests.mantelHaenszel.stat, { kind: 'statistic', digits: 3 })}</td>
                  <td className="rs-r">1</td>
                  <td className="rs-r rs-strong">{formatP(tests.mantelHaenszel.p)}</td>
                </tr>
                <tr>
                  <td>{t('tools.openepi.twobytwo.fisherExact')}</td>
                  <td className="rs-r">—</td>
                  <td className="rs-r">—</td>
                  <td className="rs-r rs-strong">{formatP(tests.fisher.p)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}

function MeasureRow({ name, valObj, kind = 'statistic', lang }) {
  if (!valObj) return null;
  const ciStr = valObj.ci && valObj.ci[0] !== null ? formatCi(valObj, lang) : '—';
  return (
    <tr>
      <th scope="row">{name}</th>
      <td className="rs-r rs-strong">{formatNumber(valObj.value, { kind })}</td>
      <td className="rs-r">{ciStr}</td>
      <td><span className="rs-soft rs-xsmall">{valObj.ciMethod || '—'}</span></td>
    </tr>
  );
}

// -----------------------------------------------------------------------------
// Diagnostic Test & Screening Pane
// -----------------------------------------------------------------------------
function DiagnosticPane({ t, lang, notify }) {
  const [tp, setTp] = useState('42');
  const [fp, setFp] = useState('4');
  const [fn, setFn] = useState('8');
  const [tn, setTn] = useState('146');
  const [confLevel, setConfLevel] = useState(0.95);
  const [prior, setPrior] = useState('0.08');
  const [preset, setPreset] = useState('fip');

  const nTp = Math.max(0, parseInt(tp, 10) || 0);
  const nFp = Math.max(0, parseInt(fp, 10) || 0);
  const nFn = Math.max(0, parseInt(fn, 10) || 0);
  const nTn = Math.max(0, parseInt(tn, 10) || 0);
  const priorVal = parseFloat(prior);

  const res = useMemo(() => {
    return computeDiagnostic({
      TP: nTp,
      FP: nFp,
      FN: nFn,
      TN: nTn,
      confLevel,
      priorProb: Number.isFinite(priorVal) && priorVal > 0 && priorVal < 1 ? priorVal : null,
    });
  }, [nTp, nFp, nFn, nTn, confLevel, priorVal]);

  const applyPreset = (key) => {
    setPreset(key);
    if (key === 'fip') {
      setTp('42');
      setFp('4');
      setFn('8');
      setTn('146');
      setPrior('0.08');
    } else if (key === 'tb') {
      setTp('35');
      setFp('15');
      setFn('15');
      setTn('235');
      setPrior('0.05');
    } else if (key === 'heartworm') {
      setTp('76');
      setFp('2');
      setFn('4');
      setTn('118');
      setPrior('0.15');
    }
  };

  const clear = () => {
    setPreset('');
    setTp('0');
    setFp('0');
    setFn('0');
    setTn('0');
  };

  const { counts, metrics, dor, postTest } = res;

  // Diagnostic clinical interpretation narrative
  const interpretationText = useMemo(() => {
    if (metrics.Se?.value == null || metrics.Sp?.value == null) return '';
    return t('tools.openepi.interp.dx', {
      conf: String(Math.round(confLevel * 100)),
      se: formatNumber(metrics.Se.value, { kind: 'proportion' }),
      seCi: formatCi(metrics.Se, lang),
      sp: formatNumber(metrics.Sp.value, { kind: 'proportion' }),
      spCi: formatCi(metrics.Sp, lang),
      lrp: formatNumber(metrics.LRpos.value, { kind: 'ratio' }),
      lrn: formatNumber(metrics.LRneg.value, { kind: 'ratio' }),
    });
  }, [metrics, confLevel, lang, t]);

  const copyInterp = async () => {
    if (!interpretationText) return;
    const resHow = await copyParagraph(interpretationText, { lang });
    notify(resHow === 'failed' ? 'ws.copy.failed' : 'tools.openepi.interpretation.copied', {}, resHow === 'failed' ? 'error' : 'ok');
  };

  const copyTableData = async () => {
    const columns = [
      t('tools.openepi.twobytwo.measure'),
      t('tools.openepi.twobytwo.estimate'),
      t('tools.openepi.twobytwo.ci'),
      t('tools.openepi.twobytwo.methodUsed'),
    ];
    const rows = [
      [t('tools.openepi.dx.se'), formatNumber(metrics.Se.value, { kind: 'proportion' }), formatCi(metrics.Se, lang), metrics.Se.ciMethod || ''],
      [t('tools.openepi.dx.sp'), formatNumber(metrics.Sp.value, { kind: 'proportion' }), formatCi(metrics.Sp, lang), metrics.Sp.ciMethod || ''],
      [t('tools.openepi.dx.ppv'), formatNumber(metrics.PPV.value, { kind: 'proportion' }), formatCi(metrics.PPV, lang), metrics.PPV.ciMethod || ''],
      [t('tools.openepi.dx.npv'), formatNumber(metrics.NPV.value, { kind: 'proportion' }), formatCi(metrics.NPV, lang), metrics.NPV.ciMethod || ''],
      [t('tools.openepi.dx.lrPos'), formatNumber(metrics.LRpos.value, { kind: 'ratio' }), formatCi(metrics.LRpos, lang), metrics.LRpos.ciMethod || ''],
      [t('tools.openepi.dx.lrNeg'), formatNumber(metrics.LRneg.value, { kind: 'ratio' }), formatCi(metrics.LRneg, lang), metrics.LRneg.ciMethod || ''],
      ...(dor ? [[t('tools.openepi.dx.dor'), formatNumber(dor.value, { kind: 'ratio' }), formatCi({ value: dor.value, ci: dor.ci, kind: 'ratio' }, lang), 'log']] : []),
      [t('tools.openepi.dx.accuracy'), formatNumber(metrics.accuracy.value, { kind: 'proportion' }), formatCi(metrics.accuracy, lang), metrics.accuracy.ciMethod || ''],
      [t('tools.openepi.dx.prevalence'), formatNumber(metrics.prevalence.value, { kind: 'proportion' }), formatCi(metrics.prevalence, lang), metrics.prevalence.ciMethod || ''],
    ];
    const resHow = await copyTable({
      caption: t('tools.openepi.dx.title'),
      columns,
      rows,
    });
    notify(resHow === 'failed' ? 'ws.copy.failed' : 'tools.openepi.table.copied', {}, resHow === 'failed' ? 'error' : 'ok');
  };

  return (
    <div className="rs-tl-epi-grid">
      <div className="rs-panel rs-pad rs-stack">
        <div className="rs-row">
          <h2 className="rs-h3 rs-grow">{t('tools.openepi.dx.title')}</h2>
          <span className="rs-chip rs-chip--gold rs-chip--inline">{t('tools.openepi.openEpiBadge')}</span>
        </div>
        <p className="rs-soft rs-small">{t('tools.openepi.dx.desc')}</p>

        {/* Veterinary Presets Selector */}
        {/* The example numbers are made up; say so where they are chosen, not only in the aria-label. */}
        <p className="rs-soft rs-xsmall">{t('tools.openepi.preset.label')}</p>
        <div className="rs-tl-preset-bar">
          <select
            className="rs-select rs-tl-preset-select"
            value={preset}
            onChange={(e) => applyPreset(e.target.value)}
            aria-label={t('tools.openepi.preset.label')}
          >
            <option value="">{t('tools.openepi.preset.select')}</option>
            <option value="fip">{t('tools.openepi.preset.dx.fip')}</option>
            <option value="tb">{t('tools.openepi.preset.dx.tb')}</option>
            <option value="heartworm">{t('tools.openepi.preset.dx.heartworm')}</option>
          </select>
          <button type="button" className="rs-btn rs-btn--sm" onClick={clear}>
            {t('tools.openepi.twobytwo.clear')}
          </button>
        </div>

        <div className="rs-formgrid">
          <Field label={t('tools.openepi.twobytwo.confLevel')} htmlFor="dx-conf">
            <select id="dx-conf" className="rs-select" value={String(confLevel)} onChange={(e) => setConfLevel(Number(e.target.value))}>
              {CONF_LEVELS.map((cVal) => (
                <option key={cVal} value={String(cVal)}>{`${Math.round(cVal * 100)}%`}</option>
              ))}
            </select>
          </Field>
          <Field label={t('tools.openepi.dx.priorProb')} htmlFor="dx-prior">
            <input
              id="dx-prior"
              type="number"
              step="0.01"
              min="0.001"
              max="0.999"
              className="rs-input"
              value={prior}
              onChange={(e) => setPrior(e.target.value)}
            />
          </Field>
        </div>

        {/* Diagnostic 2x2 Matrix with Cell Guides */}
        <div className="rs-tablewrap">
          <table className="rs-tl-table2x2">
            <thead>
              <tr>
                <th className="rs-tl-th-side">{t('tools.openepi.dx.title')}</th>
                <th>{t('tools.openepi.dx.refPos')}</th>
                <th>{t('tools.openepi.dx.refNeg')}</th>
                <th className="rs-tl-td-tot">{t('tools.openepi.twobytwo.total')}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row" className="rs-tl-th-side">{t('tools.openepi.dx.testPos')}</th>
                <td>
                  <div className="rs-tl-cell-wrap">
                    <input
                      type="number"
                      min="0"
                      className="rs-input rs-tl-input-cell"
                      value={tp}
                      onChange={(e) => setTp(e.target.value)}
                      aria-label={t('tools.openepi.dx.tp')}
                    />
                    <span className="rs-tl-cell-hint">{t('tools.openepi.cell.tp')}</span>
                  </div>
                </td>
                <td>
                  <div className="rs-tl-cell-wrap">
                    <input
                      type="number"
                      min="0"
                      className="rs-input rs-tl-input-cell"
                      value={fp}
                      onChange={(e) => setFp(e.target.value)}
                      aria-label={t('tools.openepi.dx.fp')}
                    />
                    <span className="rs-tl-cell-hint">{t('tools.openepi.cell.fp')}</span>
                  </div>
                </td>
                <td className="rs-tl-td-tot">{formatNumber(counts.tpos, { kind: 'count' })}</td>
              </tr>
              <tr>
                <th scope="row" className="rs-tl-th-side">{t('tools.openepi.dx.testNeg')}</th>
                <td>
                  <div className="rs-tl-cell-wrap">
                    <input
                      type="number"
                      min="0"
                      className="rs-input rs-tl-input-cell"
                      value={fn}
                      onChange={(e) => setFn(e.target.value)}
                      aria-label={t('tools.openepi.dx.fn')}
                    />
                    <span className="rs-tl-cell-hint">{t('tools.openepi.cell.fn')}</span>
                  </div>
                </td>
                <td>
                  <div className="rs-tl-cell-wrap">
                    <input
                      type="number"
                      min="0"
                      className="rs-input rs-tl-input-cell"
                      value={tn}
                      onChange={(e) => setTn(e.target.value)}
                      aria-label={t('tools.openepi.dx.tn')}
                    />
                    <span className="rs-tl-cell-hint">{t('tools.openepi.cell.tn')}</span>
                  </div>
                </td>
                <td className="rs-tl-td-tot">{formatNumber(counts.tneg, { kind: 'count' })}</td>
              </tr>
              <tr>
                <th scope="row" className="rs-tl-th-side rs-tl-td-tot">{t('tools.openepi.twobytwo.total')}</th>
                <td className="rs-tl-td-tot">{formatNumber(counts.dpos, { kind: 'count' })}</td>
                <td className="rs-tl-td-tot">{formatNumber(counts.dneg, { kind: 'count' })}</td>
                <td className="rs-tl-td-tot">{formatNumber(counts.N, { kind: 'count' })}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="rs-stack">
        {/* Executive Clinical Interpretation */}
        {interpretationText && (
          <InterpretationBox
            title={t('tools.openepi.interpretation.title')}
            text={interpretationText}
            onCopyText={copyInterp}
            onCopyTable={copyTableData}
            t={t}
          />
        )}

        <section className="rs-panel rs-pad rs-stack" aria-labelledby="dx-res-params">
          <div className="rs-row">
            <h2 id="dx-res-params" className="rs-h3 rs-grow">{t('tools.openepi.twobytwo.results')}</h2>
            <button type="button" className="rs-btn rs-btn--secondary rs-btn--sm rs-row" onClick={copyTableData}>
              <Icon name="table" size={14} />
              <span>{t('tools.openepi.table.copy')}</span>
            </button>
          </div>

          <div className="rs-tablewrap">
            <table className="rs-table rs-table--compact">
              <thead>
                <tr>
                  <th scope="col">{t('tools.openepi.twobytwo.measure')}</th>
                  <th scope="col" className="rs-r">{t('tools.openepi.twobytwo.estimate')}</th>
                  <th scope="col" className="rs-r">{t('tools.openepi.twobytwo.ci')}</th>
                  <th scope="col">{t('tools.openepi.twobytwo.methodUsed')}</th>
                </tr>
              </thead>
              <tbody>
                <MeasureRow name={t('tools.openepi.dx.se')} valObj={metrics.Se} kind="proportion" lang={lang} />
                <MeasureRow name={t('tools.openepi.dx.sp')} valObj={metrics.Sp} kind="proportion" lang={lang} />
                <MeasureRow name={t('tools.openepi.dx.ppv')} valObj={metrics.PPV} kind="proportion" lang={lang} />
                <MeasureRow name={t('tools.openepi.dx.npv')} valObj={metrics.NPV} kind="proportion" lang={lang} />
                <MeasureRow name={t('tools.openepi.dx.lrPos')} valObj={metrics.LRpos} kind="ratio" lang={lang} />
                <MeasureRow name={t('tools.openepi.dx.lrNeg')} valObj={metrics.LRneg} kind="ratio" lang={lang} />
                {dor && (
                  <tr>
                    <th scope="row">{t('tools.openepi.dx.dor')}</th>
                    <td className="rs-r rs-strong">{formatNumber(dor.value, { kind: 'ratio' })}</td>
                    <td className="rs-r">{formatCi({ value: dor.value, ci: dor.ci, kind: 'ratio' }, lang)}</td>
                    <td><span className="rs-soft rs-xsmall">log</span></td>
                  </tr>
                )}
                <MeasureRow name={t('tools.openepi.dx.accuracy')} valObj={metrics.accuracy} kind="proportion" lang={lang} />
                <MeasureRow name={t('tools.openepi.dx.prevalence')} valObj={metrics.prevalence} kind="proportion" lang={lang} />
              </tbody>
            </table>
          </div>
        </section>

        {postTest && (
          <section className="rs-panel rs-pad rs-stack" aria-labelledby="dx-post-test">
            <h2 id="dx-post-test" className="rs-h3">{t('tools.openepi.dx.postTestTitle')}</h2>

            {/* Visual Probability Shift Bars (Fagan Meter) */}
            <div className="rs-tl-fagan-bars">
              <div className="rs-tl-fagan-item">
                <div className="rs-tl-fagan-labels">
                  <span>{t('tools.openepi.fagan.preTest')}</span>
                  <span>{formatNumber(postTest.priorProb, { kind: 'proportion' })}</span>
                </div>
                <div className="rs-tl-fagan-track">
                  <div
                    className="rs-tl-fagan-fill rs-tl-fagan-fill--base"
                    style={{ width: `${Math.min(100, Math.max(0, postTest.priorProb * 100))}%` }}
                  />
                </div>
              </div>

              <div className="rs-tl-fagan-item">
                <div className="rs-tl-fagan-labels">
                  <span>{t('tools.openepi.fagan.postPos')}</span>
                  <span className="rs-strong">{formatNumber(postTest.postProbPos, { kind: 'proportion' })}</span>
                </div>
                <div className="rs-tl-fagan-track">
                  <div
                    className="rs-tl-fagan-fill rs-tl-fagan-fill--pos"
                    style={{ width: `${Math.min(100, Math.max(0, postTest.postProbPos * 100))}%` }}
                  />
                </div>
              </div>

              <div className="rs-tl-fagan-item">
                <div className="rs-tl-fagan-labels">
                  <span>{t('tools.openepi.fagan.postNeg')}</span>
                  <span>{formatNumber(postTest.postProbNeg, { kind: 'proportion' })}</span>
                </div>
                <div className="rs-tl-fagan-track">
                  <div
                    className="rs-tl-fagan-fill rs-tl-fagan-fill--neg"
                    style={{ width: `${Math.min(100, Math.max(0, postTest.postProbNeg * 100))}%` }}
                  />
                </div>
              </div>
            </div>

            <p className="rs-soft rs-small">
              {t('tools.openepi.dx.postPosExpl', {
                pre: formatNumber(postTest.priorProb, { kind: 'proportion' }),
                post: formatNumber(postTest.postProbPos, { kind: 'proportion' }),
              })}
            </p>
            <p className="rs-soft rs-small">
              {t('tools.openepi.dx.postNegExpl', {
                pre: formatNumber(postTest.priorProb, { kind: 'proportion' }),
                post: formatNumber(postTest.postProbNeg, { kind: 'proportion' }),
              })}
            </p>
          </section>
        )}
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Single Proportion Confidence Limits Pane
// -----------------------------------------------------------------------------
function ProportionPane({ t, lang, notify }) {
  const [x, setX] = useState('18');
  const [n, setN] = useState('120');
  const [confLevel, setConfLevel] = useState(0.95);
  const [preset, setPreset] = useState('lepto');

  const nx = Math.max(0, parseInt(x, 10) || 0);
  const nn = Math.max(0, parseInt(n, 10) || 0);

  const res = useMemo(() => {
    return computeProportionMethods(nx, nn, confLevel);
  }, [nx, nn, confLevel]);

  const applyPreset = (key) => {
    setPreset(key);
    if (key === 'lepto') {
      setX('18');
      setN('120');
    } else if (key === 'asf') {
      setX('3');
      setN('500');
    } else if (key === 'mastitis') {
      setX('45');
      setN('150');
    }
  };

  const clear = () => {
    setPreset('');
    setX('0');
    setN('100');
  };

  const interpretationText = useMemo(() => {
    if (!res) return '';
    return t('tools.openepi.interp.prop', {
      p: formatNumber(res.p, { kind: 'proportion' }),
      n: String(nn),
      conf: String(Math.round(confLevel * 100)),
      ci: formatCi(res.wilson, lang),
    });
  }, [res, nn, confLevel, lang, t]);

  const copyInterp = async () => {
    if (!interpretationText) return;
    const resHow = await copyParagraph(interpretationText, { lang });
    notify(resHow === 'failed' ? 'ws.copy.failed' : 'tools.openepi.interpretation.copied', {}, resHow === 'failed' ? 'error' : 'ok');
  };

  const copyTableData = async () => {
    if (!res) return;
    const columns = [
      t('tools.openepi.twobytwo.methodUsed'),
      t('tools.openepi.twobytwo.ci'),
    ];
    const rows = [
      [t('tools.openepi.prop.wilson'), formatCi(res.wilson, lang)],
      [t('tools.openepi.prop.exact'), formatCi(res.exact, lang)],
      [t('tools.openepi.prop.agresti'), formatCi(res.agresti, lang)],
      [t('tools.openepi.prop.wald'), formatCi(res.wald, lang)],
    ];
    const resHow = await copyTable({
      caption: `${t('tools.openepi.prop.title')} (x=${nx}, n=${nn}, p=${formatNumber(res.p, { kind: 'proportion' })})`,
      columns,
      rows,
    });
    notify(resHow === 'failed' ? 'ws.copy.failed' : 'tools.openepi.table.copied', {}, resHow === 'failed' ? 'error' : 'ok');
  };

  return (
    <div className="rs-tl-epi-grid">
      <div className="rs-panel rs-pad rs-stack">
        <div className="rs-row">
          <h2 className="rs-h3 rs-grow">{t('tools.openepi.prop.title')}</h2>
          <span className="rs-chip rs-chip--gold rs-chip--inline">{t('tools.openepi.openEpiBadge')}</span>
        </div>
        <p className="rs-soft rs-small">{t('tools.openepi.prop.desc')}</p>

        {/* Veterinary Presets Selector */}
        {/* The example numbers are made up; say so where they are chosen, not only in the aria-label. */}
        <p className="rs-soft rs-xsmall">{t('tools.openepi.preset.label')}</p>
        <div className="rs-tl-preset-bar">
          <select
            className="rs-select rs-tl-preset-select"
            value={preset}
            onChange={(e) => applyPreset(e.target.value)}
            aria-label={t('tools.openepi.preset.label')}
          >
            <option value="">{t('tools.openepi.preset.select')}</option>
            <option value="lepto">{t('tools.openepi.preset.prop.lepto')}</option>
            <option value="asf">{t('tools.openepi.preset.prop.asf')}</option>
            <option value="mastitis">{t('tools.openepi.preset.prop.mastitis')}</option>
          </select>
          <button type="button" className="rs-btn rs-btn--sm" onClick={clear}>
            {t('tools.openepi.twobytwo.clear')}
          </button>
        </div>

        <div className="rs-formgrid">
          <Field label={t('tools.openepi.prop.numerator')} htmlFor="prop-x">
            <input
              id="prop-x"
              type="number"
              min="0"
              max={n}
              className="rs-input"
              value={x}
              onChange={(e) => setX(e.target.value)}
            />
          </Field>
          <Field label={t('tools.openepi.prop.denominator')} htmlFor="prop-n">
            <input
              id="prop-n"
              type="number"
              min="1"
              className="rs-input"
              value={n}
              onChange={(e) => setN(e.target.value)}
            />
          </Field>
          <Field label={t('tools.openepi.twobytwo.confLevel')} htmlFor="prop-conf">
            <select id="prop-conf" className="rs-select" value={String(confLevel)} onChange={(e) => setConfLevel(Number(e.target.value))}>
              {CONF_LEVELS.map((cVal) => (
                <option key={cVal} value={String(cVal)}>{`${Math.round(cVal * 100)}%`}</option>
              ))}
            </select>
          </Field>
        </div>
      </div>

      <div className="rs-stack">
        {/* Executive Clinical Interpretation */}
        {interpretationText && (
          <InterpretationBox
            title={t('tools.openepi.interpretation.title')}
            text={interpretationText}
            onCopyText={copyInterp}
            onCopyTable={copyTableData}
            t={t}
          />
        )}

        {!res && <p className="rs-issue rs-small" role="alert">{t('tools.openepi.prop.invalid')}</p>}
        {res && (
        <section className="rs-panel rs-pad rs-stack" aria-labelledby="prop-res-head">
          <div className="rs-row">
            <h2 id="prop-res-head" className="rs-h3 rs-grow">{t('tools.openepi.twobytwo.results')}</h2>
            <button type="button" className="rs-btn rs-btn--secondary rs-btn--sm rs-row" onClick={copyTableData}>
              <Icon name="table" size={14} />
              <span>{t('tools.openepi.table.copy')}</span>
            </button>
          </div>

          <div className="rs-deflist">
            <div className="rs-defrow">
              <dt>{t('tools.openepi.twobytwo.estimate')}</dt>
              <dd className="rs-strong">{formatNumber(res.p, { kind: 'proportion' })}</dd>
            </div>
          </div>

          <div className="rs-tablewrap">
            <table className="rs-table rs-table--compact">
              <thead>
                <tr>
                  <th scope="col">{t('tools.openepi.twobytwo.methodUsed')}</th>
                  <th scope="col" className="rs-r">{t('tools.openepi.twobytwo.ci')}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">{t('tools.openepi.prop.wilson')}</th>
                  <td className="rs-r rs-strong">{formatCi(res.wilson, lang)}</td>
                </tr>
                <tr>
                  <th scope="row">{t('tools.openepi.prop.exact')}</th>
                  <td className="rs-r rs-strong">{formatCi(res.exact, lang)}</td>
                </tr>
                <tr>
                  <th scope="row">{t('tools.openepi.prop.agresti')}</th>
                  <td className="rs-r rs-strong">{formatCi(res.agresti, lang)}</td>
                </tr>
                <tr>
                  <th scope="row">{t('tools.openepi.prop.wald')}</th>
                  <td className="rs-r rs-strong">{formatCi(res.wald, lang)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {(nx < 5 || (nn - nx) < 5) && (
            <p className="rs-soft rs-small rs-issue">
              {t('tools.openepi.prop.waldWarn')}
            </p>
          )}
        </section>
        )}
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Person-Time Rates Pane
// -----------------------------------------------------------------------------
function PersonTimePane({ t, lang, notify }) {
  const [a, setA] = useState('24');
  const [pt1, setPt1] = useState('1200');
  const [c, setC] = useState('8');
  const [pt0, setPt0] = useState('1200');
  const [multiplier, setMultiplier] = useState(1000);
  const [confLevel, setConfLevel] = useState(0.95);
  const [preset, setPreset] = useState('lameness');

  const na = Math.max(0, parseInt(a, 10) || 0);
  // Person-time is used as entered (0.5 animal-years is valid); 0 or blank gives no result.
  const nPt1 = parseFloat(pt1) || 0;
  const nc = Math.max(0, parseInt(c, 10) || 0);
  const nPt0 = parseFloat(pt0) || 0;

  const res = useMemo(() => {
    return computePersonTimeRates({
      a: na,
      pt1: nPt1,
      c: nc,
      pt0: nPt0,
      multiplier,
      confLevel,
    });
  }, [na, nPt1, nc, nPt0, multiplier, confLevel]);

  const applyPreset = (key) => {
    setPreset(key);
    if (key === 'lameness') {
      setA('24');
      setPt1('1200');
      setC('8');
      setPt0('1200');
      setMultiplier(1000);
    } else if (key === 'colic') {
      setA('18');
      setPt1('600');
      setC('6');
      setPt0('800');
      setMultiplier(1000);
    }
  };

  const clear = () => {
    setPreset('');
    setA('0');
    setPt1('1000');
    setC('0');
    setPt0('1000');
  };

  const interpretationText = useMemo(() => {
    if (!res) return '';
    return t('tools.openepi.interp.pt', {
      conf: String(Math.round(confLevel * 100)),
      r1: formatNumber(res.scaledR1, { kind: 'statistic', digits: 2 }),
      r0: formatNumber(res.scaledR0, { kind: 'statistic', digits: 2 }),
      irr: formatNumber(res.irr, { kind: 'ratio' }),
      ci: formatCi({ value: res.irr, ci: res.irrExactCi, kind: 'ratio' }, lang),
      p: formatP(res.test.p),
    });
  }, [res, confLevel, lang, t]);

  const copyInterp = async () => {
    if (!interpretationText) return;
    const resHow = await copyParagraph(interpretationText, { lang });
    notify(resHow === 'failed' ? 'ws.copy.failed' : 'tools.openepi.interpretation.copied', {}, resHow === 'failed' ? 'error' : 'ok');
  };

  const copyTableData = async () => {
    if (!res) return;
    const columns = [
      t('tools.openepi.twobytwo.measure'),
      t('tools.openepi.twobytwo.estimate'),
      t('tools.openepi.twobytwo.ci'),
    ];
    const rows = [
      [t('tools.openepi.pt.rate1'), formatNumber(res.scaledR1, { kind: 'statistic', digits: 2 }), formatCi(res.rate1Ci, lang)],
      [t('tools.openepi.pt.rate2'), formatNumber(res.scaledR0, { kind: 'statistic', digits: 2 }), formatCi(res.rate0Ci, lang)],
      [t('tools.openepi.pt.irrExact'), formatNumber(res.irr, { kind: 'ratio' }), formatCi({ value: res.irr, ci: res.irrExactCi, kind: 'ratio' }, lang)],
      [t('tools.openepi.pt.irrWald'), formatNumber(res.irr, { kind: 'ratio' }), formatCi({ value: res.irr, ci: res.irrWaldCi, kind: 'ratio' }, lang)],
      [t('tools.openepi.pt.rateDiff'), formatNumber(res.rd, { kind: 'difference', digits: 2 }), formatCi({ value: res.rd, ci: res.rdCi, kind: 'difference', digits: 2 }, lang)],
      ...(res.afe !== null ? [[t('tools.openepi.twobytwo.afe'), formatNumber(res.afe, { kind: 'proportion' }), '—']] : []),
      ...(res.afp !== null ? [[t('tools.openepi.twobytwo.afp'), formatNumber(res.afp, { kind: 'proportion' }), '—']] : []),
    ];
    const resHow = await copyTable({
      caption: t('tools.openepi.pt.title'),
      columns,
      rows,
    });
    notify(resHow === 'failed' ? 'ws.copy.failed' : 'tools.openepi.table.copied', {}, resHow === 'failed' ? 'error' : 'ok');
  };

  const isSig = res?.test?.p != null && res.test.p < 1 - confLevel;

  return (
    <div className="rs-tl-epi-grid">
      <div className="rs-panel rs-pad rs-stack">
        <div className="rs-row">
          <h2 className="rs-h3 rs-grow">{t('tools.openepi.pt.title')}</h2>
          <span className="rs-chip rs-chip--gold rs-chip--inline">{t('tools.openepi.openEpiBadge')}</span>
        </div>
        <p className="rs-soft rs-small">{t('tools.openepi.pt.desc')}</p>

        {/* Veterinary Presets Selector */}
        {/* The example numbers are made up; say so where they are chosen, not only in the aria-label. */}
        <p className="rs-soft rs-xsmall">{t('tools.openepi.preset.label')}</p>
        <div className="rs-tl-preset-bar">
          <select
            className="rs-select rs-tl-preset-select"
            value={preset}
            onChange={(e) => applyPreset(e.target.value)}
            aria-label={t('tools.openepi.preset.label')}
          >
            <option value="">{t('tools.openepi.preset.select')}</option>
            <option value="lameness">{t('tools.openepi.preset.pt.lameness')}</option>
            <option value="colic">{t('tools.openepi.preset.pt.colic')}</option>
          </select>
          <button type="button" className="rs-btn rs-btn--sm" onClick={clear}>
            {t('tools.openepi.twobytwo.clear')}
          </button>
        </div>

        <div className="rs-formgrid">
          <Field label={t('tools.openepi.pt.unit')} htmlFor="pt-mult">
            <select id="pt-mult" className="rs-select" value={String(multiplier)} onChange={(e) => setMultiplier(Number(e.target.value))}>
              <option value="100">{t('tools.openepi.pt.per100')}</option>
              <option value="1000">{t('tools.openepi.pt.per1000')}</option>
              <option value="10000">{t('tools.openepi.pt.per10000')}</option>
            </select>
          </Field>
          <Field label={t('tools.openepi.twobytwo.confLevel')} htmlFor="pt-conf">
            <select id="pt-conf" className="rs-select" value={String(confLevel)} onChange={(e) => setConfLevel(Number(e.target.value))}>
              {CONF_LEVELS.map((cVal) => (
                <option key={cVal} value={String(cVal)}>{`${Math.round(cVal * 100)}%`}</option>
              ))}
            </select>
          </Field>
        </div>

        <div className="rs-tl-box">
          <h3 className="rs-h3">{t('tools.openepi.pt.group1')}</h3>
          <div className="rs-formgrid">
            <Field label={t('tools.openepi.pt.cases')} htmlFor="pt-a">
              <input id="pt-a" type="number" min="0" className="rs-input" value={a} onChange={(e) => setA(e.target.value)} />
            </Field>
            <Field label={t('tools.openepi.pt.time')} htmlFor="pt-pt1">
              <input id="pt-pt1" type="number" min="0" step="any" className="rs-input" value={pt1} onChange={(e) => setPt1(e.target.value)} />
            </Field>
          </div>
        </div>

        <div className="rs-tl-box">
          <h3 className="rs-h3">{t('tools.openepi.pt.group2')}</h3>
          <div className="rs-formgrid">
            <Field label={t('tools.openepi.pt.cases')} htmlFor="pt-c">
              <input id="pt-c" type="number" min="0" className="rs-input" value={c} onChange={(e) => setC(e.target.value)} />
            </Field>
            <Field label={t('tools.openepi.pt.time')} htmlFor="pt-pt0">
              <input id="pt-pt0" type="number" min="0" step="any" className="rs-input" value={pt0} onChange={(e) => setPt0(e.target.value)} />
            </Field>
          </div>
        </div>
      </div>

      {res && (
        <div className="rs-stack">
          {/* Executive Clinical Interpretation */}
          {interpretationText && (
            <InterpretationBox
              title={t('tools.openepi.interpretation.title')}
              text={interpretationText}
              onCopyText={copyInterp}
              onCopyTable={copyTableData}
              isSignificant={isSig}
              t={t}
            />
          )}

          <section className="rs-panel rs-pad rs-stack" aria-labelledby="pt-res-head">
            <div className="rs-row">
              <h2 id="pt-res-head" className="rs-h3 rs-grow">{t('tools.openepi.twobytwo.results')}</h2>
              <button type="button" className="rs-btn rs-btn--secondary rs-btn--sm rs-row" onClick={copyTableData}>
                <Icon name="table" size={14} />
                <span>{t('tools.openepi.table.copy')}</span>
              </button>
            </div>

            <div className="rs-tablewrap">
              <table className="rs-table rs-table--compact">
                <thead>
                  <tr>
                    <th scope="col">{t('tools.openepi.twobytwo.measure')}</th>
                    <th scope="col" className="rs-r">{t('tools.openepi.twobytwo.estimate')}</th>
                    <th scope="col" className="rs-r">{t('tools.openepi.twobytwo.ci')}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row">{t('tools.openepi.pt.rate1')}</th>
                    <td className="rs-r rs-strong">{formatNumber(res.scaledR1, { kind: 'statistic', digits: 2 })}</td>
                    <td className="rs-r">{formatCi(res.rate1Ci, lang)}</td>
                  </tr>
                  <tr>
                    <th scope="row">{t('tools.openepi.pt.rate2')}</th>
                    <td className="rs-r rs-strong">{formatNumber(res.scaledR0, { kind: 'statistic', digits: 2 })}</td>
                    <td className="rs-r">{formatCi(res.rate0Ci, lang)}</td>
                  </tr>
                  <tr>
                    <th scope="row">{t('tools.openepi.pt.irrExact')}</th>
                    <td className="rs-r rs-strong">{formatNumber(res.irr, { kind: 'ratio' })}</td>
                    <td className="rs-r">{formatCi({ value: res.irr, ci: res.irrExactCi, kind: 'ratio' }, lang)}</td>
                  </tr>
                  <tr>
                    <th scope="row">{t('tools.openepi.pt.irrWald')}</th>
                    <td className="rs-r rs-strong">{formatNumber(res.irr, { kind: 'ratio' })}</td>
                    <td className="rs-r">{formatCi({ value: res.irr, ci: res.irrWaldCi, kind: 'ratio' }, lang)}</td>
                  </tr>
                  <tr>
                    <th scope="row">{t('tools.openepi.pt.rateDiff')}</th>
                    <td className="rs-r rs-strong">{formatNumber(res.rd, { kind: 'difference', digits: 2 })}</td>
                    <td className="rs-r">{formatCi({ value: res.rd, ci: res.rdCi, kind: 'difference', digits: 2 }, lang)}</td>
                  </tr>
                  {res.afe !== null && (
                    <tr>
                      <th scope="row">{t('tools.openepi.twobytwo.afe')}</th>
                      <td className="rs-r rs-strong">{formatNumber(res.afe, { kind: 'proportion' })}</td>
                      <td className="rs-r">—</td>
                    </tr>
                  )}
                  {res.afp !== null && (
                    <tr>
                      <th scope="row">{t('tools.openepi.twobytwo.afp')}</th>
                      <td className="rs-r rs-strong">{formatNumber(res.afp, { kind: 'proportion' })}</td>
                      <td className="rs-r">—</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="rs-deflist">
              <div className="rs-defrow">
                <dt>{t('tools.openepi.pt.poissonTest')}</dt>
                <dd className="rs-strong">{formatP(res.test.p)}</dd>
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

// -----------------------------------------------------------------------------
// OpenEpi Directory & References Pane
// -----------------------------------------------------------------------------
function ModulesPane({ t }) {
  return (
    <div className="rs-stack">
      <div className="rs-panel rs-pad rs-stack">
        <h2 className="rs-h3">{t('tools.openepi.dir.title')}</h2>
        <p className="rs-soft rs-small">{t('tools.openepi.dir.lead')}</p>
        <div>
          <a
            href="https://www.openepi.com/Menu/OE_Menu.htm"
            target="_blank"
            rel="noopener noreferrer"
            className="rs-btn rs-btn--primary rs-row"
          >
            <span>{t('tools.openepi.dir.originalLink')}</span>
            <Icon name="arrow" size={16} />
          </a>
        </div>
      </div>

      <div className="rs-grid2">
        {/* Counts group */}
        <div className="rs-tl-dir-card">
          <h3>{t('tools.openepi.dir.countsGroup')}</h3>
          <ul className="rs-tl-dir-list">
            <li className="rs-tl-dir-item">
              <span>Two by Two Table (2x2)</span>
              <a href="https://www.openepi.com/TwobyTwo/TwobyTwo.htm" target="_blank" rel="noopener noreferrer" className="rs-plainlink rs-small">
                {t('tools.openepi.dir.openExternal')}
              </a>
            </li>
            <li className="rs-tl-dir-item">
              <span>Diagnostic Test / Screening</span>
              <a href="https://www.openepi.com/DiagnosticTest/DiagnosticTest.htm" target="_blank" rel="noopener noreferrer" className="rs-plainlink rs-small">
                {t('tools.openepi.dir.openExternal')}
              </a>
            </li>
            <li className="rs-tl-dir-item">
              <span>Proportion CI</span>
              <a href="https://www.openepi.com/Proportion/Proportion.htm" target="_blank" rel="noopener noreferrer" className="rs-plainlink rs-small">
                {t('tools.openepi.dir.openExternal')}
              </a>
            </li>
            <li className="rs-tl-dir-item">
              <span>Standardized Mortality Ratio (SMR)</span>
              <a href="https://www.openepi.com/SMR/SMR.htm" target="_blank" rel="noopener noreferrer" className="rs-plainlink rs-small">
                {t('tools.openepi.dir.openExternal')}
              </a>
            </li>
            <li className="rs-tl-dir-item">
              <span>Dose-Response / Trend</span>
              <a href="https://www.openepi.com/DoseResponse/DoseResponse.htm" target="_blank" rel="noopener noreferrer" className="rs-plainlink rs-small">
                {t('tools.openepi.dir.openExternal')}
              </a>
            </li>
            <li className="rs-tl-dir-item">
              <span>R by C Table</span>
              <a href="https://www.openepi.com/RbyC/RbyC.htm" target="_blank" rel="noopener noreferrer" className="rs-plainlink rs-small">
                {t('tools.openepi.dir.openExternal')}
              </a>
            </li>
            <li className="rs-tl-dir-item">
              <span>Matched Case-Control</span>
              <a href="https://www.openepi.com/MatchCC/MatchCC.htm" target="_blank" rel="noopener noreferrer" className="rs-plainlink rs-small">
                {t('tools.openepi.dir.openExternal')}
              </a>
            </li>
          </ul>
        </div>

        {/* Person Time group */}
        <div className="rs-tl-dir-card">
          <h3>{t('tools.openepi.dir.ptGroup')}</h3>
          <ul className="rs-tl-dir-list">
            <li className="rs-tl-dir-item">
              <span>1 Rate (Incidence Rate CI)</span>
              <a href="https://www.openepi.com/PersonTime1/PersonTime1.htm" target="_blank" rel="noopener noreferrer" className="rs-plainlink rs-small">
                {t('tools.openepi.dir.openExternal')}
              </a>
            </li>
            <li className="rs-tl-dir-item">
              <span>Compare 2 Rates</span>
              <a href="https://www.openepi.com/PersonTime2/PersonTime2.htm" target="_blank" rel="noopener noreferrer" className="rs-plainlink rs-small">
                {t('tools.openepi.dir.openExternal')}
              </a>
            </li>
          </ul>
        </div>

        {/* Sample Size group */}
        <div className="rs-tl-dir-card">
          <h3>{t('tools.openepi.dir.ssGroup')}</h3>
          <ul className="rs-tl-dir-list">
            <li className="rs-tl-dir-item">
              <span>Proportion / Cross-Sectional</span>
              <Link to="/app/tools/sample-size" className="rs-plainlink rs-small">
                {t('tools.openepi.dir.openInternal')}
              </Link>
            </li>
            <li className="rs-tl-dir-item">
              <span>Unmatched Case-Control</span>
              <Link to="/app/tools/sample-size" className="rs-plainlink rs-small">
                {t('tools.openepi.dir.openInternal')}
              </Link>
            </li>
            <li className="rs-tl-dir-item">
              <span>Cohort / Clinical Trial</span>
              <Link to="/app/tools/sample-size" className="rs-plainlink rs-small">
                {t('tools.openepi.dir.openInternal')}
              </Link>
            </li>
            <li className="rs-tl-dir-item">
              <span>Mean Difference</span>
              <Link to="/app/tools/sample-size" className="rs-plainlink rs-small">
                {t('tools.openepi.dir.openInternal')}
              </Link>
            </li>
          </ul>
        </div>

        {/* Power group */}
        <div className="rs-tl-dir-card">
          <h3>{t('tools.openepi.dir.powerGroup')}</h3>
          <ul className="rs-tl-dir-list">
            <li className="rs-tl-dir-item">
              <span>ANOVA, t-test, Correlation</span>
              <Link to="/app/tools/power" className="rs-plainlink rs-small">
                {t('tools.openepi.dir.openInternal')}
              </Link>
            </li>
            <li className="rs-tl-dir-item">
              <span>Unmatched Case-Control Power</span>
              <a href="https://www.openepi.com/Power/PowerCC.htm" target="_blank" rel="noopener noreferrer" className="rs-plainlink rs-small">
                {t('tools.openepi.dir.openExternal')}
              </a>
            </li>
            <li className="rs-tl-dir-item">
              <span>Cohort Study Power</span>
              <a href="https://www.openepi.com/Power/PowerCohort.htm" target="_blank" rel="noopener noreferrer" className="rs-plainlink rs-small">
                {t('tools.openepi.dir.openExternal')}
              </a>
            </li>
            <li className="rs-tl-dir-item">
              <span>Clinical Trial Power</span>
              <a href="https://www.openepi.com/Power/PowerRCT.htm" target="_blank" rel="noopener noreferrer" className="rs-plainlink rs-small">
                {t('tools.openepi.dir.openExternal')}
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
