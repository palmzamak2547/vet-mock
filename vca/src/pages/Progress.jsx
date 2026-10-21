// What this device remembers: how much of each domain has been seen and how much of it is
// known now, the days studied, the sets finished, and the questions still missed. Nothing
// leaves the device unless the student exports it.

import { useEffect, useRef, useState } from 'react';
import { Link } from '../components/Link.jsx';
import { Icon } from '../components/Icon.jsx';
import { Meter, Words, BusyLabel } from '../components/bits.jsx';
import { Plan } from '../components/Plan.jsx';
import { Sheet } from '../components/Sheet.jsx';
import { BANK, DOMAIN_CARDS } from '../lib/bank.js';
import { emptyProgress, normalizeProgress, progressStore, statsFor, streak, wrongKeys } from '../lib/progress.js';
import { normalizeResults, resultsStore, RESULTS_KEPT } from '../lib/session.js';
import { useStartGuard } from '../components/StartGuard.jsx';
import { startSet } from '../lib/start.js';
import { useProgress, useResults, useTitle } from '../lib/hooks.js';
import { localDay, previousDay } from '../lib/dates.js';
import { navigate, withQuery } from '../router.js';
import { num, pct, plateNo, thaiDateTime } from '../lib/format.js';

function Activity({ days }) {
  const today = localDay();
  const list = [];
  let d = today;
  for (let i = 0; i < 21; i += 1) { list.unshift(d); d = previousDay(d); }
  const max = Math.max(1, ...list.map((x) => days[x] || 0));
  const label = (x) => new Date(`${x}T12:00:00`).toLocaleDateString('th-TH', { day: 'numeric', month: 'short' });
  if (!list.some((x) => days[x])) {
    return (
      <figure className="activity">
        <figcaption className="label">21 วันที่ผ่านมา</figcaption>
        <p className="hint">{Object.keys(days).length ? 'ไม่มีวันที่ฝึกในช่วงนี้' : 'ยังไม่มีวันที่ฝึก'}</p>
      </figure>
    );
  }
  return (
    <figure className="activity">
      <figcaption className="label">21 วันที่ผ่านมา</figcaption>
      <ol className="activity-bars">
        {list.map((x) => (
          <li key={x} className={x === today ? 'today' : ''} title={`${label(x)} ทำ ${days[x] || 0} ข้อ`}>
            <i style={{ height: `${Math.max(days[x] ? 8 : 2, ((days[x] || 0) / max) * 100)}%` }} className={days[x] ? 'on' : ''} />
            <span className="sr">{label(x)} ทำ {days[x] || 0} ข้อ</span>
          </li>
        ))}
      </ol>
      <div className="activity-axis" aria-hidden="true"><span>{label(list[0])}</span><span>วันนี้</span></div>
    </figure>
  );
}

export default function Progress() {
  useTitle('ความคืบหน้า');
  const progress = useProgress();
  const results = useResults();
  const { guard, sheet: guardSheet } = useStartGuard();
  const all = statsFor(progress);
  const missed = wrongKeys(progress);
  const [busy, setBusy] = useState(false);
  const [sheet, setSheet] = useState(null); // 'reset' | 'import'
  const [importState, setImportState] = useState(null);
  const [saved, setSaved] = useState(null); // the file just written, for a few seconds
  const fileRef = useRef(null);

  useEffect(() => {
    if (!saved) return undefined;
    const t = setTimeout(() => setSaved(null), 4000);
    return () => clearTimeout(t);
  }, [saved]);

  const retryMissed = () => missed.length && guard(async () => {
    setBusy(true);
    const keys = missed.slice(0, 50);
    const domains = [...new Set(keys.map((k) => progress.q[k].d))];
    const res = await startSet({ mode: 'practice', domains, keys, size: keys.length, label: 'ฝึกข้อที่พลาด' }).catch(() => null);
    setBusy(false);
    if (res?.ok) navigate('/session');
  });

  const exportData = () => {
    const blob = new Blob([JSON.stringify({ app: 'vetmock-vca', v: 1, exportedAt: new Date().toISOString(), progress, results }, null, 1)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `vetmock-vca-${localDay()}.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    setSaved(a.download);
  };

  const onFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    try {
      if (file.size > 5 * 1024 * 1024) throw new Error('size');
      const raw = JSON.parse(await file.text());
      if (raw?.app !== 'vetmock-vca' || raw.v !== 1) throw new Error('shape');
      const p = normalizeProgress(raw.progress);
      const r = normalizeResults(raw.results);
      setImportState({ ok: true, progress: p, results: r, seen: Object.keys(p.q).length });
    } catch {
      setImportState({ ok: false });
    }
    setSheet('import');
  };

  return (
    <div className="wrap progress">
      <header className="page-head">
        <p className="kicker">Your progress</p>
        <h1 className="page-h">ความคืบหน้า</h1>
        <p className="page-p">ทุกคำตอบเก็บไว้ในเครื่องนี้เท่านั้น ไม่ต้องมีบัญชี และไม่มีข้อมูลส่งออกไปที่ไหน</p>
      </header>

      <section className="band glass progress-band" aria-label="ภาพรวม">
        <div className="fig"><div className="fig-n">{num(all.seen)}<small>/{num(BANK.total)}</small></div><div className="fig-t">ข้อที่เคยทำ <b>{pct(all.seen / BANK.total, all.seen ? 1 : 0)}</b> ของคลัง</div></div>
        <div className="fig"><div className="fig-n">{all.seen ? pct(all.accuracy) : '–'}</div><div className="fig-t">ตอบถูกในครั้งล่าสุด</div></div>
        <div className="fig"><div className="fig-n">{num(streak(progress, localDay()))}<small>วัน</small></div><div className="fig-t">ทำติดกันถึงวันนี้</div></div>
        <div className="fig"><div className="fig-n">{num(results.length)}</div><div className="fig-t">ชุดที่ทำจบ (เก็บล่าสุด {RESULTS_KEPT} ชุด)</div></div>
      </section>

      <div className="progress-grid">
        <section className="panel glass">
          <Activity days={progress.days} />
        </section>
        <section className="panel glass missed" aria-labelledby="missed-h">
          <h2 id="missed-h" className="block-h">ข้อที่ยังพลาด</h2>
          <p className="missed-n">{num(missed.length)}<small>ข้อ</small></p>
          <p className="hint">ข้อที่คำตอบล่าสุดยังผิด ตอบถูกเมื่อไหร่จะหายไปจากรายการเอง</p>
          <div className="row-gap">
            {missed.length > 0 ? (
              <>
                <button type="button" className="btn btn-ink" onClick={retryMissed} disabled={busy}>
                  <BusyLabel busy={busy}>ฝึก{missed.length > 50 ? ' 50 ข้อล่าสุด' : 'ทั้งหมด'} <Icon name="arrowRight" /></BusyLabel>
                </button>
                <Link to={withQuery('/practice', { st: 'wrong' })} className="btn btn-ghost">เลือกหมวดเอง</Link>
              </>
            ) : (
              <Link to="/practice" className="btn btn-ghost">เริ่มฝึก <Icon name="arrowRight" /></Link>
            )}
          </div>
        </section>
      </div>

      <div className="sec-tight"><Plan compact /></div>

      <section className="mastery glass" aria-labelledby="mastery-h">
        <div className="mastery-top">
          <h2 id="mastery-h" className="block-h">รายหมวด</h2>
          <span className="hint mastery-key"><span><i className="key-bar" aria-hidden="true" />ทำไปแล้ว</span><span><b>%</b> ตอบถูกครั้งล่าสุด</span></span>
        </div>
        {BANK.families.map((f) => (
          <div key={f.id} className="mastery-fam">
            <h3 className="mastery-fh"><span className="pick-num">{f.numeral}</span><Words text={f.thw} /></h3>
            <ul className="mrows">
              {DOMAIN_CARDS.filter((d) => d.family === f.id).map((d) => {
                const s = statsFor(progress, d.id);
                return (
                  <li key={d.id} className="mrow" data-reveal>
                    <Link to={`/d/${d.id}`} className="mrow-name"><span className="drow-pl">{plateNo(d.plate)}</span>{d.th}</Link>
                    <Meter value={s.seen / d.count} label={`ทำแล้ว ${s.seen} จาก ${d.count} ข้อ`} />
                    <span className="mrow-n">{num(s.seen)}/{num(d.count)}</span>
                    <span className={`mrow-acc${s.seen ? '' : ' none'}`}>{s.seen ? pct(s.accuracy) : '–'}</span>
                    <Link to={withQuery('/practice', { d: [d.id], st: s.seen < d.count ? 'unseen' : 'wrong' })} className="icon-btn" aria-label={`ฝึกหมวด${d.th}`}><Icon name="arrowRight" /></Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </section>

      <section className="history" aria-labelledby="history-h">
        <h2 id="history-h" className="block-h">ชุดที่ทำจบ</h2>
        {results.length === 0 ? (
          <p className="hint">ยังไม่มี ทำชุดแรกให้จบแล้วผลจะมาอยู่ตรงนี้</p>
        ) : (
          <ol className="hist-list">
            {results.map((r) => (
              <li key={r.id}>
                <Link to={`/result/${r.id}`} className="hist">
                  <span className="hist-score">{Math.round((r.correct / r.total) * 100)}<small>%</small></span>
                  <span className="hist-main">
                    <b>{r.mode === 'mock' ? 'สอบจำลอง' : r.meta?.retry ? 'ฝึกข้อที่พลาด' : 'ฝึกทีละข้อ'} {num(r.total)} ข้อ</b>
                    <span className="hist-sub"><span>{thaiDateTime(r.finishedAt)}</span><span>ถูก {num(r.correct)} ข้อ</span></span>
                  </span>
                  <Icon name="chevronRight" />
                </Link>
              </li>
            ))}
          </ol>
        )}
      </section>

      <section className="data glass" aria-labelledby="data-h">
        <div>
          <h2 id="data-h" className="block-h">ข้อมูลในเครื่องนี้</h2>
          <p className="hint">ส่งออกเป็นไฟล์ไว้ย้ายไปอีกเครื่องหรือเก็บสำรอง การนำเข้าจะแทนที่ข้อมูลในเครื่องนี้ทั้งหมด</p>
        </div>
        <div className="row-gap">
          <button type="button" className="btn btn-ghost" onClick={exportData}><Icon name={saved ? 'check' : 'download'} />{saved ? 'บันทึกไฟล์แล้ว' : 'ส่งออก'}</button>
          <button type="button" className="btn btn-ghost" onClick={() => fileRef.current?.click()}><Icon name="upload" />นำเข้า</button>
          <button type="button" className="btn btn-danger" onClick={() => setSheet('reset')} disabled={!all.seen && !results.length}><Icon name="trash" />ล้างข้อมูล</button>
          <input ref={fileRef} type="file" accept="application/json,.json" hidden onChange={onFile} />
          <span className="sr" role="status">{saved ? `บันทึกไฟล์ ${saved} แล้ว` : ''}</span>
        </div>
      </section>

      <Sheet open={sheet === 'reset'} onClose={() => setSheet(null)} title="ล้างความคืบหน้าทั้งหมด?">
        <p className="sheet-p">คำตอบ {num(all.seen)} ข้อ ผล {num(results.length)} ชุด และวันสอบที่ตั้งไว้จะหายจากเครื่องนี้ ย้อนกลับไม่ได้ ถ้าอยากเก็บไว้ ส่งออกก่อน</p>
        <div className="sheet-actions">
          <button type="button" className="btn btn-ghost" onClick={() => setSheet(null)} data-autofocus>ยกเลิก</button>
          <button type="button" className="btn btn-danger" onClick={() => { progressStore.set(emptyProgress()); resultsStore.set([]); setSheet(null); }}>ล้างข้อมูล</button>
        </div>
      </Sheet>

      <Sheet open={sheet === 'import'} onClose={() => { setSheet(null); setImportState(null); }} title="นำเข้าข้อมูล">
        {importState?.ok ? (
          <>
            <p className="sheet-p">ไฟล์นี้มีคำตอบ {num(importState.seen)} ข้อ และผล {num(importState.results.length)} ชุด จะแทนที่ข้อมูลเดิมในเครื่องนี้ ({num(all.seen)} ข้อ, {num(results.length)} ชุด)</p>
            <div className="sheet-actions">
              <button type="button" className="btn btn-ghost" onClick={() => { setSheet(null); setImportState(null); }} data-autofocus>ยกเลิก</button>
              <button type="button" className="btn btn-ink" onClick={() => { progressStore.set(importState.progress); resultsStore.set(importState.results); setSheet(null); setImportState(null); }}>แทนที่ด้วยไฟล์นี้</button>
            </div>
          </>
        ) : (
          <p className="sheet-p">อ่านไฟล์นี้ไม่ได้ ใช้ไฟล์ที่ส่งออกจากหน้านี้ (ชื่อขึ้นต้นด้วย vetmock-vca) ขนาดไม่เกิน 5 MB</p>
        )}
      </Sheet>
      {guardSheet}
    </div>
  );
}
