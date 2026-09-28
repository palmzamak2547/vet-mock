// Randomisation lists and blinding codes from the seeded generator, downloaded as CSV with the seed and
// settings in the file [M2-DESIGN.md 7, 10.3]. Simple randomisation, permuted blocks (block sizes drawn
// from the sizes ticked) or blocks within strata (a farm, a pen). The seed is shown before the list is
// drawn; the same seed, stream and settings give the same list again, which is how a supervisor checks
// it. With blinding, each unit gets a code and the key (code to group) is its own file, kept apart until
// the analysis. Nothing is stored or sent: the files are the record. OWNER: ui-tools role.
import { useEffect, useMemo, useState } from 'react';
import { useT } from '../../../i18n/index.js';
import { getMethod } from '../../../lib/runtime/catalog.js';
import { download } from '../../../lib/runtime/export.js';
import { checkRandomisation, LIMITS } from '../../../lib/plan/randomise.js';
import { drawSeed, GENERATOR } from '../../../lib/plan/random.js';
import { useWs, errorInfo } from '../../ws-context.js';
import { buildSpec } from '../../lib/method-ui.js';
import { formatMoment } from '../../lib/era.js';
import { safeFileBase } from '../../lib/files.js';
import { keyPart } from '../../lib/keys.js';
import { Busy, ErrorBox, Field, Notice, PageHead, VerifiedBadge } from '../../components/Bits.jsx';
import Icon from '../../components/Icon.jsx';
import Rail from '../../components/Rail.jsx';
import TopBar from '../../components/TopBar.jsx';
import { PreviewTable } from './ToolBits.jsx';
import { SeedFields, SettingsList } from './SamplingPane.jsx';
import { TOOL_RAIL } from './tool-rail.js';
import { csvWithSettings, listTables } from './tools-model.js';

export const RANDOMISE_SCHEMES = Object.freeze(['block', 'stratified-block', 'simple']);
const SHOW = 60;

/** Block sizes offered: whole multiples of the ratio sum from 2 up to the limit, five at most. */
export function blockChoices(ratioSum) {
  const out = [];
  for (let k = 1; out.length < 5 && ratioSum * k <= LIMITS.maxBlock; k += 1) if (ratioSum * k >= 2) out.push(ratioSum * k);
  return out;
}

export default function Tool() {
  const { t, lang } = useT();
  const { engine, engineError } = useWs();
  const [menu, setMenu] = useState(false);
  const [scheme, setScheme] = useState('block');
  const [arms, setArms] = useState([{ label: 'A', ratio: '1' }, { label: 'B', ratio: '1' }]);
  const [units, setUnits] = useState('');
  const [strata, setStrata] = useState([{ name: '', n: '' }]);
  const [sizes, setSizes] = useState([4]);
  const [blinding, setBlinding] = useState(true);
  const [seed, setSeed] = useState(() => String(drawSeed()));
  const [stream, setStream] = useState(String(GENERATOR.defaultStream));
  const [env, setEnv] = useState(null);
  const [ran, setRan] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const cat = getMethod('design.randomisation');

  useEffect(() => { document.title = `${t('ws.rail.randomise')} | ${t('common.appName')}`; }, [t]);

  const ratioSum = arms.reduce((a, x) => a + (Number(x.ratio) || 0), 0);
  const choices = useMemo(() => blockChoices(Math.max(1, ratioSum)), [ratioSum]);
  useEffect(() => {
    // Keep only block sizes that still fit the ratio; offer the smallest two by default.
    setSizes((s) => {
      const kept = s.filter((x) => choices.includes(x));
      return kept.length ? kept : choices.slice(0, Math.min(2, choices.length)).slice(-1);
    });
  }, [choices]);

  const params = {
    arms: arms.map((a) => a.label.trim()),
    ratio: arms.map((a) => Number(a.ratio)),
    seed: Number(seed),
    stream: stream === '' ? GENERATOR.defaultStream : Number(stream),
    ...(scheme === 'stratified-block' ? { strata: strata.map((s) => s.name.trim()), strataN: strata.map((s) => Number(s.n)) } : { n: Number(units) }),
  };
  const options = { scheme, blockSizes: sizes, blinding };
  const check = checkRandomisation(params, options);
  const empty = scheme === 'stratified-block' ? strata.every((s) => s.n === '') : units === '';

  const run = async () => {
    setBusy(true);
    setError(null);
    try {
      const spec = buildSpec({ method: 'design.randomisation', params, options });
      const e = await engine.run(spec, null, null);
      setEnv(e);
      setRan({ params, options, at: new Date() });
    } catch (err) {
      setError(errorInfo(err));
    } finally {
      setBusy(false);
    }
  };

  const list = env?.status === 'ok' ? env.tables.find((tb) => tb.id === 'list') : null;
  const armTable = env?.status === 'ok' ? env.tables.find((tb) => tb.id === 'arms') : null;
  const stratified = ran?.options.scheme === 'stratified-block';
  const heads = { unit: t('tools.random.unit'), stratum: t('tools.random.stratum'), block: t('tools.random.block'), arm: t('tools.random.arm'), code: t('tools.random.code') };

  const settings = () => (ran ? [
    [t('tools.csv.program'), t('common.appName')],
    [t('tools.csv.generator'), `${GENERATOR.name} (${GENERATOR.reference})`],
    [t('tools.csv.seed'), ran.params.seed],
    [t('tools.csv.stream'), ran.params.stream],
    [t('tools.random.scheme'), t(`tools.random.scheme.${keyPart(ran.options.scheme)}`)],
    [t('tools.random.arms'), ran.params.arms.map((a, i) => `${a} (${ran.params.ratio[i]})`).join('; ')],
    ...(ran.options.scheme !== 'simple' ? [[t('tools.random.blockSizes'), ran.options.blockSizes.join('; ')]] : []),
    ...(stratified ? [[t('tools.random.strata'), ran.params.strata.map((s, i) => `${s} (${ran.params.strataN[i]})`).join('; ')]] : [[t('tools.random.units'), ran.params.n]]),
    [t('tools.random.blinding'), ran.options.blinding ? t('tools.yes') : t('tools.no')],
    [t('tools.csv.made'), formatMoment(ran.at, lang, { time: true })],
    [t('tools.csv.reproduce'), t('tools.csv.reproduceBody')],
  ] : []);

  const files = list ? listTables(list.rows, heads, stratified) : null;
  const save = (which) => {
    const word = t(`tools.random.file.${which}`);
    const table = which === 'full' ? files.full : which === 'codes' ? files.codes : files.key;
    const extra = which === 'key' ? [[t('tools.random.keyWarning'), t('tools.random.keyWarningBody')]] : [];
    const blob = new Blob([csvWithSettings([...settings(), ...extra], table)], { type: 'text/csv;charset=utf-8' });
    download(blob, `${safeFileBase(`${word}-${ran.params.seed}`)}.csv`);
  };

  const setArm = (i, patch) => setArms((l) => l.map((a, j) => (j === i ? { ...a, ...patch } : a)));
  const setStratum = (i, patch) => setStrata((l) => l.map((s, j) => (j === i ? { ...s, ...patch } : s)));
  const cutNotes = (env?.guard?.notes || []).filter((x) => x.id === 'plan');

  return (
    <div className="rs-ws">
      <TopBar crumb={t('tools.random.crumb')} onMenu={() => setMenu((v) => !v)} menuOpen={menu} />
      <div className="rs-ws-body">
        <Rail pane="randomise" items={TOOL_RAIL} open={menu} onClose={() => setMenu(false)} fileLineKey="ws.ss.noFile" />
        <main id="rs-main" className="rs-main">
          <PageHead eyebrow={t('ws.rail.group.tools')} title={t('tools.random.title')} sub={t('tools.random.sub')} />
          {engineError ? <ErrorBox error={engineError} /> : null}
          <div className="rs-analysis">
            <section className="rs-analysis-setup rs-panel rs-pad rs-stack" aria-labelledby="rs-h-rand">
              <div className="rs-row">
                <h2 id="rs-h-rand" className="rs-h3 rs-grow">{t('tools.settings')}</h2>
                <VerifiedBadge show={Boolean(cat?.verified)} />
              </div>
              <fieldset className="rs-fieldset">
                <legend className="rs-field-label">{t('tools.random.scheme')}</legend>
                {RANDOMISE_SCHEMES.map((s) => (
                  <label key={s} className="rs-radio">
                    <input type="radio" name="rs-rand-scheme" checked={scheme === s} onChange={() => setScheme(s)} />
                    <span><span className="rs-strong">{t(`tools.random.scheme.${keyPart(s)}`)}</span> <span className="rs-soft rs-small">{t(`tools.random.schemeHint.${keyPart(s)}`)}</span></span>
                  </label>
                ))}
              </fieldset>
              <fieldset className="rs-fieldset">
                <legend className="rs-field-label">{t('tools.random.arms')}</legend>
                <p className="rs-field-hint">{t('tools.random.armsHint')}</p>
                {arms.map((a, i) => (
                  <div key={i} className="rs-condrow rs-tl-pair">
                    <input aria-label={t('tools.random.armName', { n: i + 1 })} className="rs-input" value={a.label} maxLength={40} onChange={(e) => setArm(i, { label: e.target.value })} />
                    <input aria-label={t('tools.random.armRatio', { n: i + 1 })} className="rs-input rs-input--num" inputMode="numeric" value={a.ratio} onChange={(e) => setArm(i, { ratio: e.target.value.trim() })} />
                    {arms.length > 2 ? <button type="button" className="rs-iconbtn" aria-label={t('tools.remove')} onClick={() => setArms((l) => l.filter((_, j) => j !== i))}><Icon name="trash" size={16} /></button> : null}
                  </div>
                ))}
                {arms.length < LIMITS.maxArms ? <button type="button" className="rs-btn rs-btn--sm" onClick={() => setArms((l) => [...l, { label: String.fromCharCode(65 + l.length), ratio: '1' }])}><Icon name="plus" size={16} />{t('tools.random.addArm')}</button> : null}
              </fieldset>
              {scheme === 'stratified-block' ? (
                <fieldset className="rs-fieldset">
                  <legend className="rs-field-label">{t('tools.random.strata')}</legend>
                  <p className="rs-field-hint">{t('tools.random.strataHint')}</p>
                  {strata.map((s, i) => (
                    <div key={i} className="rs-condrow rs-tl-pair">
                      <input aria-label={t('tools.random.stratumName', { n: i + 1 })} placeholder={t('tools.random.stratumPlaceholder', { n: i + 1 })} className="rs-input" value={s.name} maxLength={60} onChange={(e) => setStratum(i, { name: e.target.value })} />
                      <input aria-label={t('tools.random.stratumUnits', { n: i + 1 })} placeholder={t('tools.random.unitsShort')} className="rs-input rs-input--num" inputMode="numeric" value={s.n} onChange={(e) => setStratum(i, { n: e.target.value.trim() })} />
                      {strata.length > 1 ? <button type="button" className="rs-iconbtn" aria-label={t('tools.remove')} onClick={() => setStrata((l) => l.filter((_, j) => j !== i))}><Icon name="trash" size={16} /></button> : null}
                    </div>
                  ))}
                  {strata.length < LIMITS.maxStrata ? <button type="button" className="rs-btn rs-btn--sm" onClick={() => setStrata((l) => [...l, { name: '', n: '' }])}><Icon name="plus" size={16} />{t('tools.random.addStratum')}</button> : null}
                </fieldset>
              ) : (
                <Field label={t('tools.random.units')} hint={t('tools.random.unitsHint', { max: LIMITS.maxUnits.toLocaleString('en-US') })} htmlFor="rs-rand-n">
                  <input id="rs-rand-n" className="rs-input rs-num" inputMode="numeric" value={units} onChange={(e) => setUnits(e.target.value.trim())} />
                </Field>
              )}
              {scheme !== 'simple' ? (
                <fieldset className="rs-fieldset">
                  <legend className="rs-field-label">{t('tools.random.blockSizes')}</legend>
                  <p className="rs-field-hint">{t('tools.random.blockSizesHint', { sum: ratioSum })}</p>
                  <div className="rs-row-wrap">
                    {choices.map((b) => (
                      <label key={b} className="rs-check">
                        <input type="checkbox" checked={sizes.includes(b)} onChange={() => setSizes((s) => (s.includes(b) ? s.filter((x) => x !== b) : [...s, b].sort((x, y) => x - y)))} />
                        <span className="rs-num">{b}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>
              ) : null}
              <label className="rs-switch">
                <input type="checkbox" checked={blinding} onChange={(e) => setBlinding(e.target.checked)} />
                <span>{t('tools.random.blindingLabel')}</span>
              </label>
              <p className="rs-soft rs-small">{t('tools.random.blindingHint')}</p>
              <SeedFields seed={seed} setSeed={setSeed} stream={stream} setStream={setStream} idPrefix="rs-rand" />
              {!check.ok && !empty ? <p className="rs-small rs-rose-text" role="status">{t(check.key, check.params || {})}</p> : null}
              <button type="button" className="rs-btn rs-btn--primary rs-btn--block" disabled={!engine || busy || !check.ok || !cat?.shipped} onClick={run}>
                <Icon name="lock" size={18} />
                {t('tools.random.run')}
              </button>
              {cat && !cat.shipped ? <Notice tone="info">{t('ws.analysis.notReadyBody')}</Notice> : null}
              <p className="rs-soft rs-small">{t('tools.random.notStored')}</p>
            </section>
            <section className="rs-analysis-result rs-stack" aria-live="polite" aria-busy={busy || undefined}>
              {busy ? <Busy label={t('ws.analysis.running')} /> : null}
              <ErrorBox error={error} />
              {env && env.status !== 'ok' ? (
                <Notice tone="stop" title={t('tools.invalidTitle')}>
                  {cutNotes.map((x, i) => <p key={i}>{t(x.key, x.params || {})}</p>)}
                </Notice>
              ) : null}
              {list ? (
                <>
                  <h2 className="rs-h2">{t('tools.random.resultTitle')}</h2>
                  <p className="rs-strong">{t('tools.random.done', { n: list.rows.length.toLocaleString('en-US'), seed: ran.params.seed })}</p>
                  {cutNotes.map((x, i) => <Notice key={i} tone="info">{t(x.key, x.params || {})}</Notice>)}
                  <PreviewTable
                    caption={t('tools.random.armsCaption')}
                    head={[...(stratified ? [heads.stratum] : [t('tools.random.all')]), heads.arm, t('tools.random.count')]}
                    rows={armTable.rows.map((r) => [...(stratified ? [r[0]] : [t('tools.random.all')]), r[1], r[2].toLocaleString('en-US')])}
                  />
                  <PreviewTable
                    caption={t('tools.random.listCaption')}
                    head={files.full.columns}
                    rows={files.full.rows.slice(0, SHOW).map((r) => r.map((c) => (c === null ? '' : String(c))))}
                    note={list.rows.length > SHOW ? t('tools.random.listMore', { n: (list.rows.length - SHOW).toLocaleString('en-US') }) : undefined}
                  />
                  <SettingsList items={settings()} />
                  <section className="rs-panel rs-pad rs-stack" aria-labelledby="rs-h-rand-files">
                    <h3 id="rs-h-rand-files" className="rs-h3">{t('tools.random.filesTitle')}</h3>
                    <div className="rs-row-wrap">
                      <button type="button" className="rs-btn" onClick={() => save('full')}><Icon name="down" size={18} />{t('tools.random.downloadFull')}</button>
                      {ran.options.blinding ? <button type="button" className="rs-btn" onClick={() => save('codes')}><Icon name="down" size={18} />{t('tools.random.downloadCodes')}</button> : null}
                      {ran.options.blinding ? <button type="button" className="rs-btn" onClick={() => save('key')}><Icon name="lock" size={18} />{t('tools.random.downloadKey')}</button> : null}
                    </div>
                    <p className="rs-soft rs-small">{ran.options.blinding ? t('tools.random.filesBlind') : t('tools.random.filesOpen')}</p>
                  </section>
                </>
              ) : !busy && !env ? <p className="rs-soft">{t('tools.random.empty')}</p> : null}
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
