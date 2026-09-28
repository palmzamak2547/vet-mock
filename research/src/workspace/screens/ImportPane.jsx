// Import [M1-DESIGN.md 8.1; workspace boards "Import" and "PhoneImport"]: the file is read in the
// engine, every conversion is listed with examples before anything is saved, the questions the
// program must not guess (era, two-digit years, missing reasons, identifiers Excel turned into dates)
// block the confirm button until answered, and the confirm button saves the raw table once with the
// recorded import step. Each answer re-runs intake's answerPreview, so the step, the codebook and the
// list always agree with what will be saved. The student's file is never changed.
// OWNER: ui-tools role (M2; workspace in M1).
//
// M2 [M2-DESIGN.md 4.1, 4.6, 5, 10.3]: SPSS files (.sav, .zsav) go through the same preview (the engine
// reads them; value labels, user-missing values and variable labels arrive as conversions and questions
// like any other). ImportFlow also takes a second file into a project, with a purpose: 'merge' (a farm
// file whose columns a merge step brings in) or 'double-entry' (a second typing of the same forms). The
// merge and compare panes embed it; the import pane links to them once the first file is in.
import { useEffect, useRef, useState } from 'react';
import { useT } from '../../i18n/index.js';
import { putDataset } from '../../lib/store/datasets.js';
import { answerPreview } from '../../lib/intake/preview.js';
import { navigate } from '../../router.js';
import { useWs, errorInfo } from '../ws-context.js';
import { canConfirm, openCount, piiConversions, plainConversions, questionsOf } from '../lib/import-questions.js';
import { applyHints, takePending } from './pending-file.js';
import { Busy, Chip, ErrorBox, PageHead, formatBytes } from '../components/Bits.jsx';
import Icon from '../components/Icon.jsx';
import Link from '../components/Link.jsx';
import { keyPart } from '../lib/keys.js';

export const DATA_ACCEPT = '.csv,.tsv,.txt,.xlsx,.xls,.sav,.zsav,text/csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,application/x-spss-sav';
const isXlsx = (name) => /\.xlsx?$/i.test(name || '');
export const isSav = (name) => /\.z?sav$/i.test(name || '');
const ENCODINGS = ['auto', 'utf-8', 'windows-874', 'utf-16le'];

function Pair({ from, to }) {
  return (
    <span className="rs-pair rs-mono">
      <span className="rs-cell-old">{from === '' ? '␣' : from}</span>
      <Icon name="arrow" size={14} />
      <span className="rs-cell-new">{to === '' ? '—' : to}</span>
    </span>
  );
}

function Examples({ conv }) {
  if (!conv.examples?.length) return null;
  return <div className="rs-row-wrap">{conv.examples.slice(0, 5).map((e, k) => <Pair key={k} from={e.from} to={e.to} />)}</div>;
}

function Where({ conv }) {
  const { t } = useT();
  if (!conv.count) return null;
  return <p className="rs-soft rs-small">{t('ws.import.where', { column: conv.params?.column || conv.column || '', n: conv.count.toLocaleString('en-US') })}</p>;
}

function ImportDone({ p }) {
  const { t, lang } = useT();
  const src = p.meta?.source || p.raw?.source;
  return (
    <>
      <PageHead eyebrow={t('ws.import.eyebrow')} title={t('ws.import.doneTitle')} sub={t('ws.import.doneSub')} />
      <div className="rs-panel rs-pad">
        <div className="rs-filecard">
          <Icon name="file" size={22} />
          <div className="rs-grow">
            <div className="rs-strong">{src?.fileName}</div>
            <div className="rs-soft rs-small rs-num">{t('ws.import.fileLine', { bytes: formatBytes(src?.bytes, lang), rows: (p.meta?.rowCount ?? 0).toLocaleString('en-US'), cols: p.meta?.colCount ?? 0 })}</div>
          </div>
          {src?.encoding ? <Chip>{src.encoding}</Chip> : null}
        </div>
        <p className="rs-soft">{t('ws.import.oneDataset')}</p>
      </div>
      <div className="rs-row-wrap">
        <Link to={`/app/p/${p.project.id}/codebook`} className="rs-btn rs-btn--primary">{t('ws.import.next')}<Icon name="arrow" size={18} /></Link>
        <Link to={`/app/p/${p.project.id}/data`} className="rs-btn">{t('ws.rail.data')}</Link>
      </div>
      <section className="rs-panel rs-pad rs-stack" aria-labelledby="rs-h-second">
        <h2 id="rs-h-second" className="rs-h3">{t('tools.second.title')}</h2>
        <p className="rs-soft rs-small">{t('tools.second.body')}</p>
        {(p.others || []).length ? (
          <ul className="rs-plainlist rs-small">
            {p.others.map((o) => <li key={o.meta.id}><span className="rs-strong">{o.meta.source?.fileName || o.meta.id}</span>{o.meta.purpose ? <span className="rs-soft"> {t(`tools.purpose.${o.meta.purpose === 'double-entry' ? 'doubleEntry' : 'merge'}`)}</span> : null}</li>)}
          </ul>
        ) : null}
        <div className="rs-row-wrap">
          <Link to={`/app/p/${p.project.id}/merge`} className="rs-btn">{t('tools.second.toMerge')}</Link>
          <Link to={`/app/p/${p.project.id}/compare`} className="rs-btn">{t('tools.second.toCompare')}</Link>
        </div>
      </section>
    </>
  );
}

/** @param {{ p: ReturnType<typeof import('./useProject.js').useProject> }} props */
export default function ImportPane({ p }) {
  if (p.meta) return <ImportDone p={p} />;
  return <ImportFlow p={p} purpose="analysis" />;
}

/**
 * Choose a file, read it, answer the questions, confirm. `purpose` 'analysis' is the project's first
 * dataset (the page this pane shows); 'merge' and 'double-entry' add a second file and call onDone with
 * its stored meta instead of moving to the codebook.
 * @param {{ p: any, purpose?: 'analysis'|'merge'|'double-entry', onDone?: (meta: any) => void, onCancel?: () => void }} props
 */
export function ImportFlow({ p, purpose = 'analysis', onDone, onCancel }) {
  const { t, lang } = useT();
  const second = purpose !== 'analysis';
  const { db, owner, engine, engineError, notify, bumpProjects } = useWs();
  const [file, setFile] = useState(null);
  const [sheets, setSheets] = useState(null);
  const [opts, setOpts] = useState({ encoding: 'auto', sheet: null, headerRow: 0 });
  const [preview, setPreview] = useState(null);
  // Questions the student answered, so their card says so instead of "chosen from the file".
  const [chosenByYou, setChosenByYou] = useState(() => new Set());
  const [phase, setPhase] = useState('pick');
  const [progress, setProgress] = useState(null);
  const [error, setError] = useState(null);
  const [drag, setDrag] = useState(false);
  const input = useRef(null);
  // An example dataset's codebook hints and the tool to open next (pending-file.js), when it came from one.
  const extra = useRef({ hints: null, next: null });

  useEffect(() => {
    const got = takePending(p.project.id, second ? purpose : 'analysis');
    if (got?.file) {
      extra.current = { hints: got.hints, next: got.next };
      setFile(got.file);
    }
  }, [p.project.id, second, purpose]);

  useEffect(() => {
    if (!file || !engine) return undefined;
    let live = true;
    (async () => {
      setPhase('reading');
      setError(null);
      setProgress(null);
      try {
        let sheet = opts.sheet;
        if (isXlsx(file.name) && sheets === null) {
          const res = await engine.sheets(await file.arrayBuffer());
          if (!live) return;
          setSheets(res.sheets || []);
          sheet = sheet || res.sheets?.[0] || null;
          if (sheet !== opts.sheet) { setOpts((o) => ({ ...o, sheet })); return; }
        }
        const bytes = await file.arrayBuffer();
        const pv = await engine.parse({ bytes, fileName: file.name, format: 'auto', encoding: opts.encoding, sheet, headerRow: opts.headerRow }, (pr) => { if (live) setProgress(pr); });
        if (!live) return;
        setPreview(pv);
        setPhase('preview');
      } catch (err) {
        if (!live) return;
        setError(errorInfo(err));
        setPhase('pick');
      }
    })();
    return () => { live = false; };
  }, [file, engine, opts, sheets]);

  const pick = (f) => {
    if (!f) return;
    setSheets(null);
    setPreview(null);
    setOpts({ encoding: 'auto', sheet: null, headerRow: 0 });
    setChosenByYou(new Set());
    setFile(f);
  };

  const answer = (questionId, value) => {
    setChosenByYou((set) => new Set(set).add(questionId));
    try {
      setPreview((pv) => answerPreview(pv, { [questionId]: value }));
    } catch (err) {
      setError(errorInfo(err));
    }
  };

  const open = openCount(preview);
  const ok = canConfirm(preview);

  const confirm = async () => {
    if (!ok) return;
    setPhase('saving');
    if (second) {
      const meta = await p.addDataset({ ...preview, codebook: applyHints(preview.codebook, extra.current.hints) }, purpose);
      if (meta) {
        notify('tools.second.saved', { n: preview.raw.rowCount.toLocaleString('en-US') }, 'ok');
        onDone?.(meta);
      } else setPhase('preview');
      return;
    }
    try {
      // putDataset links the dataset to the project and logs the import in one transaction.
      await putDataset(db, owner, p.project.id, { raw: preview.raw, codebook: applyHints(preview.codebook, extra.current.hints), steps: [preview.importStep] });
      notify('ws.import.saved', { n: preview.raw.rowCount.toLocaleString('en-US') }, 'ok');
      bumpProjects();
      await p.reload();
      navigate(`/app/p/${p.project.id}/${extra.current.next || 'codebook'}`);
    } catch (err) {
      setError(errorInfo(err));
      setPhase('preview');
    }
  };

  const src = preview?.raw?.source;
  const questions = questionsOf(preview);
  const plain = plainConversions(preview);
  const pii = piiConversions(preview);
  const farmCols = (preview?.codebook?.columns || []).filter((c) => c.level === 'farm');
  // One count per concept, the same everywhere on this screen (review round 1): what was found is the
  // cards shown; the questions, the automatic conversions, the notes and the hidden columns add up to it.
  const answered = questions.filter((q) => !q.waiting).length;
  const found = questions.length + plain.applied.length + plain.shown.length + pii.length;
  const toApply = plain.applied.length + answered;

  return (
    <>
      {second ? (
        <div className="rs-stack">
          <h2 className="rs-h2">{t(purpose === 'merge' ? 'tools.second.mergeTitle' : 'tools.second.compareTitle')}</h2>
          <p className="rs-soft">{t(purpose === 'merge' ? 'tools.second.mergeSub' : 'tools.second.compareSub')}</p>
        </div>
      ) : <PageHead eyebrow={t('ws.import.eyebrow')} title={t('ws.import.title')} sub={t('ws.import.sub')} />}
      {engineError ? <ErrorBox error={engineError} /> : null}
      <ErrorBox error={error} />
      {phase === 'pick' || (!file && !preview) ? (
        <div
          className={`rs-drop rs-drop--big${drag ? ' rs-drop--on' : ''}`}
          onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
          onDragLeave={() => setDrag(false)}
          onDrop={(e) => { e.preventDefault(); setDrag(false); pick(e.dataTransfer?.files?.[0]); }}
        >
          <Icon name="upload" size={34} />
          <p className="rs-strong">{t('ws.projects.dropTitle')}</p>
          <p className="rs-soft rs-small">{t('ws.projects.dropFormats')} {t('tools.import.savFormats')}</p>
          <button type="button" className="rs-btn rs-btn--primary" onClick={() => input.current?.click()}>{t('ws.projects.chooseFile')}</button>
          {second && onCancel ? <button type="button" className="rs-btn rs-btn--quiet" onClick={onCancel}>{t('ws.action.cancel')}</button> : null}
          <input ref={input} type="file" accept={DATA_ACCEPT} className="rs-visually-hidden" tabIndex={-1} aria-hidden="true" onChange={(e) => { pick(e.target.files?.[0]); e.target.value = ''; }} />
          <p className="rs-soft rs-small">{t('ws.projects.dropNote')}</p>
        </div>
      ) : null}
      {phase === 'reading' ? <Busy label={progress?.total ? t('ws.import.readingProgress', { done: progress.done.toLocaleString('en-US'), total: progress.total.toLocaleString('en-US') }) : t('ws.import.reading')} /> : null}
      {phase === 'saving' ? <Busy label={t('ws.import.saving')} /> : null}

      {preview && (phase === 'preview' || phase === 'saving') ? (
        <div className="rs-import">
          <section className="rs-import-main" aria-labelledby="rs-h-found">
            <div className="rs-panel">
              {isSav(src?.fileName) ? <p className="rs-pad rs-soft rs-small rs-bordertop">{t('tools.import.savNote')}</p> : null}
              <div className="rs-filecard rs-pad">
                <Icon name="file" size={22} />
                <div className="rs-grow">
                  <div className="rs-strong">{src?.fileName}</div>
                  <div className="rs-soft rs-small rs-num">{t('ws.import.fileLine', { bytes: formatBytes(src?.bytes, lang), rows: preview.raw.rowCount.toLocaleString('en-US'), cols: preview.raw.header.length })}</div>
                </div>
                {!isXlsx(src?.fileName) ? (
                  <label className="rs-field rs-field--inline">
                    <span className="rs-field-label">{t('ws.import.encoding')}</span>
                    <select className="rs-select" value={opts.encoding} onChange={(e) => setOpts((o) => ({ ...o, encoding: e.target.value }))}>
                      {ENCODINGS.map((en) => <option key={en} value={en}>{t(`ws.import.encoding.${keyPart(en)}`)}</option>)}
                    </select>
                  </label>
                ) : null}
                {sheets && sheets.length > 1 ? (
                  <label className="rs-field rs-field--inline">
                    <span className="rs-field-label">{t('ws.import.sheet')}</span>
                    <select className="rs-select" value={opts.sheet || ''} onChange={(e) => setOpts((o) => ({ ...o, sheet: e.target.value }))}>
                      {sheets.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </label>
                ) : null}
                <label className="rs-field rs-field--inline">
                  <span className="rs-field-label">{t('ws.import.headerRow')}</span>
                  <input className="rs-input rs-input--num" type="number" min="1" max="50" inputMode="numeric" value={opts.headerRow + 1} onChange={(e) => setOpts((o) => ({ ...o, headerRow: Math.max(0, Math.min(49, (Number(e.target.value) || 1) - 1)) }))} />
                </label>
              </div>
              <div className="rs-pad rs-bordertop">
                <h2 className="rs-h3">{t('ws.import.readCheck')}</h2>
                <p>{t('ws.import.headerReads', { header: preview.raw.header.slice(0, 4).join(', ') })}</p>
                <p className="rs-soft rs-small">{t('ws.import.encodingHint')}</p>
              </div>
            </div>

            <h2 id="rs-h-found" className="rs-h2">{open ? t('ws.import.found', { n: found, k: open }) : t('ws.import.foundNone', { n: found })}</h2>
            {questions.length ? (
              <ul className="rs-convlist">
                {questions.map((q) => (
                  <li key={q.questionId} className={`rs-conv rs-conv--ask${q.waiting ? '' : ' rs-conv--answered'}`}>
                    <span className="rs-conv-icon"><Icon name={q.waiting ? 'alert' : 'check'} size={22} /></span>
                    <div className="rs-conv-body">
                      <h3 className="rs-h3">{t(q.conv.key, q.conv.params)}</h3>
                      <Where conv={q.conv} />
                      <Examples conv={q.conv} />
                      {q.related.map((c, k) => (
                        <div key={k} className="rs-stack">
                          <p className="rs-small">{t(c.key, c.params)}</p>
                          <Examples conv={c} />
                        </div>
                      ))}
                      <div className="rs-row-wrap" role="radiogroup" aria-label={t(q.conv.key, q.conv.params)}>
                        {q.options.map((o) => (
                          <button key={o.value} type="button" role="radio" aria-checked={q.answer === o.value} className={`rs-btn rs-btn--sm${q.answer === o.value ? ' rs-btn--chosen' : ''}`} onClick={() => answer(q.questionId, o.value)} disabled={phase === 'saving'}>
                            {t(o.key, o.params)}
                          </button>
                        ))}
                      </div>
                      <p className="rs-soft rs-small">{q.waiting ? t('ws.import.noGuess') : chosenByYou.has(q.questionId) ? t('ws.import.youChose') : t('ws.import.answeredCanChange')}</p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : null}
            {plain.applied.length ? (
              <>
                <h2 className="rs-h3 rs-soft">{t('ws.import.converted', { n: plain.applied.length })}</h2>
                <ul className="rs-convlist">
                  {plain.applied.map((c, i) => (
                    <li key={i} className="rs-conv">
                      <span className="rs-conv-icon rs-conv-icon--ok"><Icon name="check" size={22} /></span>
                      <div className="rs-conv-body">
                        <h3 className="rs-h3">{t(c.key, c.params)}</h3>
                        <Where conv={c} />
                        <Examples conv={c} />
                      </div>
                    </li>
                  ))}
                </ul>
              </>
            ) : null}
            {plain.shown.length ? (
              <>
                <h2 className="rs-h3 rs-soft">{t('ws.import.shownOnly', { n: plain.shown.length })}</h2>
                <ul className="rs-convlist">
                  {plain.shown.map((c, i) => (
                    <li key={i} className="rs-conv">
                      <span className="rs-conv-icon"><Icon name="info" size={22} /></span>
                      <div className="rs-conv-body">
                        <h3 className="rs-h3">{t(c.key, c.params)}</h3>
                        <Where conv={c} />
                        <Examples conv={c} />
                      </div>
                    </li>
                  ))}
                </ul>
              </>
            ) : null}
            {pii.length ? (
              <>
              <h2 className="rs-h3 rs-soft">{t('ws.import.hiddenTitle', { n: pii.length })}</h2>
              <ul className="rs-convlist">
                {pii.map((c, k) => (
                  <li key={k} className="rs-conv">
                    <span className="rs-conv-icon rs-conv-icon--ok"><Icon name="eyeOff" size={22} /></span>
                    <div className="rs-conv-body">
                      <h3 className="rs-h3">{t(c.key, c.params)}</h3>
                      <p className="rs-soft rs-small">{t('ws.import.piiNote')}</p>
                    </div>
                  </li>
                ))}
              </ul>
              </>
            ) : null}
          </section>

          <aside className="rs-import-side">
            <section className="rs-panel rs-pad" aria-labelledby="rs-h-recipe">
              <h2 id="rs-h-recipe" className="rs-h3">{t('ws.import.stepsTitle')}</h2>
              <p className="rs-soft rs-small">{t('ws.import.stepsSub')}</p>
              <ol className="rs-steps">
                <li className="rs-step"><span className="rs-step-n rs-num" aria-hidden="true">1</span><span>{t('ws.import.stepImport', { n: toApply })}</span></li>
                {questions.filter((q) => q.waiting).map((q, k) => (
                  <li key={q.questionId} className="rs-step rs-step--wait">
                    <span className="rs-step-n rs-num" aria-hidden="true">{k + 2}</span>
                    <span>{t(q.conv.key, q.conv.params)}</span>
                    <Chip tone="gold">{t('ws.import.waiting')}</Chip>
                  </li>
                ))}
              </ol>
            </section>
            {farmCols.length ? (
              <section className="rs-panel rs-pad">
                <h2 className="rs-h3">{t('ws.import.levelsTitle')}</h2>
                <p className="rs-soft rs-small">{t('ws.import.levelsBody', { n: farmCols.length })}</p>
                <div className="rs-row-wrap">{farmCols.map((c) => <Chip key={c.key}>{c.name}</Chip>)}</div>
              </section>
            ) : null}
            <div className="rs-panel rs-pad rs-confirmbox">
              <p><strong>{t('ws.import.summary', { answered, asked: questions.length, auto: plain.applied.length })}</strong> {open ? <span className="rs-soft">{t('ws.import.summaryOpen', { n: open })}</span> : null}</p>
              {open ? (preview.blocking || []).map((b, k) => <p key={k} className="rs-soft rs-small">{t(b.key, b.params)}</p>) : null}
              <button type="button" className="rs-btn rs-btn--primary rs-btn--block" disabled={!ok || phase === 'saving' || p.busy} onClick={confirm}>
                {open ? t('ws.import.confirmWait', { n: open }) : second ? t('tools.second.confirm', { n: preview.raw.rowCount.toLocaleString('en-US') }) : t('ws.import.confirm', { n: preview.raw.rowCount.toLocaleString('en-US') })}
              </button>
              <button type="button" className="rs-btn rs-btn--quiet" onClick={() => { setFile(null); setPreview(null); setPhase('pick'); }}>{t('ws.import.otherFile')}</button>
            </div>
          </aside>
        </div>
      ) : null}
    </>
  );
}
