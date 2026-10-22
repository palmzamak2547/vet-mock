// A finished set: the score, how each domain went, and every question with its answer and
// reason. The questions missed can be practised again in one tap.

import { useState } from 'react';
import { Link } from '../components/Link.jsx';
import { Icon } from '../components/Icon.jsx';
import { Ring, Meter, BusyLabel } from '../components/bits.jsx';
import { CountUp } from '../components/CountUp.jsx';
import { Question } from '../components/Question.jsx';
import { CARD_BY_ID, loadItems, questionByKey } from '../lib/bank.js';
import { byDomain, weakestFirst } from '../lib/session.js';
import { quickStart, startSet } from '../lib/start.js';
import { useAsync, useResults, useTitle } from '../lib/hooks.js';
import { navigate, withQuery } from '../router.js';
import { duration, LETTERS, num, pct, plateNo, thaiDate } from '../lib/format.js';
import { useStartGuard } from '../components/StartGuard.jsx';
import { ShareButton } from '../components/Share.jsx';
import { ExportSheet } from '../components/ExportSheet.jsx';
import { localDay } from '../lib/dates.js';

/** "17 ต.ค. 2569 14:05": the day with its Buddhist-era year, as the site writes a date everywhere else, then the time. */
const finishedOn = (ts) => `${thaiDate(ts)} ${new Date(ts).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}`;

const FILTERS = [
  { id: 'all', th: 'ทุกข้อ' },
  { id: 'wrong', th: 'ข้อที่ผิด' },
  { id: 'right', th: 'ข้อที่ถูก' },
  { id: 'skip', th: 'ไม่ได้ตอบ' },
  { id: 'flag', th: 'ปักธง' },
];

function ReviewItem({ it, index, open, onToggle, flagged }) {
  const q = questionByKey(it.key);
  const state = it.choice === null ? 'skip' : it.correct ? 'right' : 'wrong';
  const headId = `rv-${index}`;
  return (
    <li className={`rv rv-${state}`}>
      <button type="button" className="rv-head" aria-expanded={open} aria-controls={`${headId}-body`} onClick={onToggle}>
        <span className="rv-no">{index + 1}</span>
        <span className={`rv-dot rv-dot-${state}`} aria-hidden="true">{state === 'right' ? <Icon name="check" size={14} strokeWidth={2.4} /> : state === 'wrong' ? <Icon name="x" size={14} strokeWidth={2.4} /> : null}</span>
        <span className="rv-stem">{q ? q.q.replace(/\*\*|`/g, '') : 'ข้อนี้ไม่อยู่ในคลังแล้ว'}</span>
        <span className="rv-meta">
          {flagged && <Icon name="flag" size={14} />}
          {state === 'wrong' && <span>ตอบ {LETTERS[it.order.indexOf(it.choice)]} เฉลย {LETTERS[it.order.indexOf(it.answer)]}</span>}
          {state === 'skip' && <span>ข้ามไป เฉลย {LETTERS[it.order.indexOf(it.answer)]}</span>}
        </span>
        <Icon name="chevronDown" size={18} className="rv-chev" />
      </button>
      {open && q && (
        <div className="rv-body" id={`${headId}-body`}>
          <Question q={q} order={it.order} choice={it.choice} revealed mode="review" number={index + 1} stemId={`${headId}-stem`} />
        </div>
      )}
    </li>
  );
}

export default function Result({ route }) {
  const results = useResults();
  const { guard, sheet } = useStartGuard();
  const result = results.find((r) => r.id === route.params.id);
  useTitle(result ? `ผล ${pct(result.correct / result.total)}` : 'ไม่พบผลนี้');
  // The text of the questions in this result, as the shards that hold them (nothing more of the bank).
  const data = useAsync(() => (result ? loadItems(result.items) : Promise.resolve()), result?.id ?? '');
  const [filter, setFilter] = useState('all');
  const [open, setOpen] = useState(() => new Set());
  const [busy, setBusy] = useState(false);
  const [exporting, setExporting] = useState(false);

  if (!result) {
    return (
      <div className="wrap">
        <div className="empty">
          <p className="kicker">Not found</p>
          <h1 className="page-h">ไม่พบผลชุดนี้</h1>
          <p>ผลเก็บไว้ในเครื่องที่ใช้ทำ และเก็บล่าสุด 30 ชุด</p>
          <Link to="/progress" className="btn btn-ink">ดูผลทั้งหมด</Link>
        </div>
      </div>
    );
  }

  const score = result.total ? result.correct / result.total : 0;
  const rows = weakestFirst(byDomain(result));
  // Across two domains or more, the weakest one is a tap away; with one, "ฝึกข้อที่พลาด" is that tap.
  const weak = rows.length > 1 && rows[0].correct < rows[0].total ? CARD_BY_ID[rows[0].domain] : null;
  const missed = result.items.filter((it) => !it.correct);
  const counts = {
    all: result.items.length,
    wrong: result.items.filter((it) => it.choice !== null && !it.correct).length,
    right: result.correct,
    skip: result.items.filter((it) => it.choice === null).length,
    flag: result.flags.length,
  };
  const shown = result.items.map((it, i) => ({ it, i })).filter(({ it }) => {
    if (filter === 'wrong') return it.choice !== null && !it.correct;
    if (filter === 'right') return it.correct;
    if (filter === 'skip') return it.choice === null;
    if (filter === 'flag') return result.flags.includes(it.key);
    return true;
  });

  const retry = () => missed.length && guard(async () => {
    setBusy(true);
    const res = await startSet({ mode: 'practice', domains: [...new Set(missed.map((it) => it.domain))], keys: missed.map((it) => it.key), size: missed.length, label: 'ฝึกข้อที่พลาด' }).catch(() => null);
    setBusy(false);
    if (res?.ok) navigate('/session');
  });
  const practiseWeak = () => guard(async () => {
    setBusy(true);
    const res = await startSet({ mode: 'practice', domains: [weak.id], size: 10, prefer: 'unseen' }).catch(() => null);
    setBusy(false);
    if (res?.ok) navigate('/session');
  });
  const again = withQuery('/practice', { mode: result.mode === 'mock' ? 'mock' : null, d: result.meta?.domains || [], n: result.meta?.size, s: result.meta?.perQuestion || null, src: result.meta?.source === 'all' ? null : result.meta?.source, st: result.meta?.status === 'all' ? null : result.meta?.status });
  // Written as a tutor would write it on the paper, in the tutor's hand.
  const verdict = score >= 0.8 ? 'แม่นมาก!' : score >= 0.6 ? 'ไปได้ดี' : score >= 0.4 ? 'ยังมีที่ต้องเก็บ' : 'เริ่มจากข้อที่พลาดก่อน';
  const quick = result.meta?.label === 'quick';
  const another = () => guard(async () => {
    setBusy(true);
    const res = await quickStart().catch(() => null);
    setBusy(false);
    if (res?.ok) navigate('/session');
  });

  return (
    <div className="wrap result">
      <header className="result-hero glass">
        <Ring value={score} size={196} stroke={7}>
          <span className="ring-n"><CountUp value={Math.round(score * 100)} duration={1100} /><small>%</small></span>
          <span className="ring-t">ถูก {num(result.correct)} จาก {num(result.total)}</span>
        </Ring>
        <div className="result-copy">
          <p className="kicker">{result.mode === 'mock' ? 'Mock exam result' : 'Practice result'}</p>
          <h1 className="page-h verdict-hand">
            {verdict}
            <svg className="swash" viewBox="0 0 240 16" preserveAspectRatio="none" aria-hidden="true" focusable="false"><path d="M4 11 C 58 3, 150 2, 236 8" /></svg>
          </h1>
          <ul className="result-facts">
            <li><Icon name="calendar" size={16} />{finishedOn(result.finishedAt)}</li>
            {result.mode === 'mock' && <li><Icon name="clock" size={16} />ใช้เวลา {duration(result.durationMs)}{result.limitSec ? ` จาก ${duration(result.limitSec * 1000)}` : ''}</li>}
            {result.expired && <li className="warn"><Icon name="timer" size={16} />หมดเวลา ระบบส่งให้อัตโนมัติ</li>}
            {result.endedEarly && <li><Icon name="info" size={16} />จบก่อนครบชุด นับเฉพาะข้อที่ตอบ</li>}
          </ul>
          <div className="row-gap">
            {quick && (
              <button type="button" className={`btn ${missed.length ? 'btn-glass glass' : 'btn-ink'}`} onClick={another} disabled={busy}>
                อีก 10 ข้อ <Icon name="arrowRight" />
              </button>
            )}
            {missed.length > 0 && (
              <button type="button" className="btn btn-ink" onClick={retry} disabled={busy}>
                <BusyLabel busy={busy}>ฝึกข้อที่พลาด {num(missed.length)} ข้อ <Icon name="arrowRight" /></BusyLabel>
              </button>
            )}
            <Link to={again} className="btn btn-ghost">ทำชุดใหม่แบบเดิม</Link>
          </div>
          <div className="result-out">
            <button type="button" className="text-link" onClick={() => setExporting(true)} disabled={data.status !== 'ready'}>
              <Icon name="download" size={16} />ส่งออกไป Anki, Quizlet, Sheets
            </button>
            <ShareButton
              className="text-link" label="ชวนเพื่อนมาซ้อม"
              path="/" title="VetMock VCA"
              text={score >= 0.6 ? `ซ้อมสอบ VCA ได้ ${Math.round(score * 100)}% จาก ${num(result.total)} ข้อ มาซ้อมด้วยกัน` : 'มาซ้อมสอบ VCA ด้วยกัน เฉลยทุกข้อ ไม่ต้องสมัคร'}
            />
          </div>
        </div>
      </header>

      {data.status === 'ready' && (
        <ExportSheet
          open={exporting} onClose={() => setExporting(false)}
          stamp={localDay(result.finishedAt)}
          items={result.items.map((it) => ({ q: questionByKey(it.key), order: it.order, domainName: CARD_BY_ID[it.domain]?.th || it.domain, missed: !it.correct }))}
        />
      )}

      <section className="result-domains glass" aria-labelledby="by-domain">
        <h2 id="by-domain" className="block-h">รายหมวด</h2>
        <ul className="drows">
          {rows.map((r, i) => {
            const card = CARD_BY_ID[r.domain];
            return (
              <li key={r.domain} className="drow" style={{ '--i': Math.min(i, 12) }}>
                <Link to={`/d/${r.domain}`} className="drow-name"><span className="drow-pl">{card ? plateNo(card.plate) : ''}</span>{card?.th || r.domain}</Link>
                <Meter value={r.correct / r.total} label={`ถูก ${r.correct} จาก ${r.total}`} tone={r.correct / r.total >= 0.6 ? 'verd' : r.correct / r.total >= 0.4 ? 'brass' : 'cinn'} />
                <span className="drow-n">{r.correct}/{r.total}</span>
              </li>
            );
          })}
        </ul>
        {weak && (
          <button type="button" className="btn btn-ghost btn-block drows-next" onClick={practiseWeak} disabled={busy}>
            ฝึก{weak.th} 10 ข้อ <Icon name="arrowRight" />
          </button>
        )}
      </section>

      <section className="review" aria-labelledby="review-h">
        <div className="review-top">
          <h2 id="review-h" className="block-h">ทบทวนทีละข้อ</h2>
          <div className="filters" role="group" aria-label="แสดง">
            {FILTERS.filter((f) => f.id === 'all' || counts[f.id] > 0).map((f) => (
              <button key={f.id} type="button" className="chip" aria-pressed={filter === f.id} onClick={() => setFilter(f.id)}>
                {f.th}<span className="chip-n">{counts[f.id]}</span>
              </button>
            ))}
          </div>
        </div>
        {data.status === 'loading' && <p className="hint" role="status">กำลังโหลดเฉลย…</p>}
        {data.status === 'error' && <p className="notice notice-error"><Icon name="info" />โหลดเฉลยไม่สำเร็จ <button type="button" className="text-link" onClick={data.retry}>ลองอีกครั้ง</button></p>}
        {data.status === 'ready' && (
          <ol className="rv-list">
            {shown.map(({ it, i }) => (
              <ReviewItem
                key={it.key} it={it} index={i} flagged={result.flags.includes(it.key)}
                open={open.has(it.key)}
                onToggle={() => setOpen((s) => { const n = new Set(s); if (n.has(it.key)) n.delete(it.key); else n.add(it.key); return n; })}
              />
            ))}
          </ol>
        )}
      </section>
      {sheet}
    </div>
  );
}
