// The exam itself: how long until the next round, the two days it sits, what the paper is
// like, and where its questions have fallen over eleven years of the cohorts' almanac.

import { useMemo, useState } from 'react';
import { Link } from '../components/Link.jsx';
import { Icon } from '../components/Icon.jsx';
import { CountUp } from '../components/CountUp.jsx';
import { Figure, Nw, Words } from '../components/bits.jsx';
import { useStartGuard } from '../components/StartGuard.jsx';
import { CARD_BY_ID } from '../lib/bank.js';
import { EXAM_SECONDS, FORMAT, SOURCES, resultsLag, upcomingRound } from '../data/exam.js';
import { googleCalendarUrl, saveRoundCalendar } from '../lib/connect.js';
import { Sheet } from '../components/Sheet.jsx';
import { ShareButton } from '../components/Share.jsx';
import { GROUPS, NOTES, RECENT, SUBJECTS, YEARS, cellValue, domainProfile, recentMean, trend } from '../data/almanac.js';
import { daysBetween } from '../lib/dates.js';
import { num, pct, thaiDay } from '../lib/format.js';
import { progressStore } from '../lib/progress.js';
import { useProgress, useTitle, useToday } from '../lib/hooks.js';
import { startSet } from '../lib/start.js';
import { navigate } from '../router.js';
import '../styles/exam.css';

const SHORT = { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' };
const yy = (year) => String(year).slice(2);
/** A move worth marking: three questions or more, as the almanac marks it. */
const MARK = 3;

/** Days to the round: to its first day, or its last while it is under way; null without a round. */
function countdown(round, today) {
  if (!round) return null;
  const first = daysBetween(today, round.parts[0].date);
  return first >= 0 ? first : daysBetween(today, round.parts[round.parts.length - 1].date);
}

function Ticket({ part, i, round }) {
  const d = Number(part.date.slice(8, 10));
  return (
    <article className="ticket glass" style={{ '--i': i }} data-tilt="5" data-sheen aria-label={`หมวด ${part.part} ${thaiDay(part.date, SHORT)} ${part.from} ถึง ${part.to}`}>
      <div className="ticket-main">
        <p className="ticket-k">หมวด <b>{part.part}</b></p>
        <p className="ticket-date">{thaiDay(part.date, SHORT)}</p>
        <p className="ticket-time">{part.from}–{part.to}</p>
        <p className="ticket-meta"><span>{FORMAT.perPart} ข้อ</span><span>{FORMAT.minutesPerPart / 60} ชั่วโมง</span></p>
      </div>
      <div className="ticket-stub" aria-hidden="true">
        <span className="ticket-day">{d}</span>
        <span className="ticket-mon">{thaiDay(part.date, { month: 'short' })}</span>
        <span className="ticket-no">VCA {round}</span>
      </div>
    </article>
  );
}

/** Google Calendar's own icon (Wikimedia Commons, Google_Calendar_icon_(2020).svg). */
function GoogleCalendarMark() {
  return (
    <svg viewBox="-3.75 -3.75 200 200" width="28" height="28" aria-hidden="true" focusable="false">
      <path fill="#fff" d="M148.882,43.618l-47.368-5.263l-57.895,5.263L38.355,96.25l5.263,52.632l52.632,6.579l52.632-6.579l5.263-53.947L148.882,43.618z" />
      <path fill="#1A73E8" d="M65.211,125.276c-3.934-2.658-6.658-6.539-8.145-11.671l9.132-3.763c0.829,3.158,2.276,5.605,4.342,7.342c2.053,1.737,4.553,2.592,7.474,2.592c2.987,0,5.553-0.908,7.697-2.724s3.224-4.132,3.224-6.934c0-2.868-1.132-5.211-3.395-7.026s-5.105-2.724-8.5-2.724h-5.276v-9.039H76.5c2.921,0,5.382-0.789,7.382-2.368c2-1.579,3-3.737,3-6.487c0-2.447-0.895-4.395-2.684-5.855s-4.053-2.197-6.803-2.197c-2.684,0-4.816,0.711-6.395,2.145s-2.724,3.197-3.447,5.276l-9.039-3.763c1.197-3.395,3.395-6.395,6.618-8.987c3.224-2.592,7.342-3.895,12.342-3.895c3.697,0,7.026,0.711,9.974,2.145c2.947,1.434,5.263,3.421,6.934,5.947c1.671,2.539,2.5,5.382,2.5,8.539c0,3.224-0.776,5.947-2.329,8.184c-1.553,2.237-3.461,3.947-5.724,5.145v0.539c2.987,1.25,5.421,3.158,7.342,5.724c1.908,2.566,2.868,5.632,2.868,9.211s-0.908,6.776-2.724,9.579c-1.816,2.803-4.329,5.013-7.513,6.618c-3.197,1.605-6.789,2.421-10.776,2.421C73.408,129.263,69.145,127.934,65.211,125.276z" />
      <path fill="#1A73E8" d="M121.25,79.961l-9.974,7.25l-5.013-7.605l17.987-12.974h6.895v61.197h-9.895L121.25,79.961z" />
      <path fill="#EA4335" d="M148.882,196.25l47.368-47.368l-23.684-10.526l-23.684,10.526l-10.526,23.684L148.882,196.25z" />
      <path fill="#34A853" d="M33.092,172.566l10.526,23.684h105.263v-47.368H43.618L33.092,172.566z" />
      <path fill="#4285F4" d="M12.039-3.75C3.316-3.75-3.75,3.316-3.75,12.039v136.842l23.684,10.526l23.684-10.526V43.618h105.263l10.526-23.684L148.882-3.75H12.039z" />
      <path fill="#188038" d="M-3.75,148.882v31.579c0,8.724,7.066,15.789,15.789,15.789h31.579v-47.368H-3.75z" />
      <path fill="#FBBC04" d="M148.882,43.618v105.263h47.368V43.618l-23.684-10.526L148.882,43.618z" />
      <path fill="#1967D2" d="M196.25,43.618V12.039c0-8.724-7.066-15.789-15.789-15.789h-31.579v47.368H196.25z" />
    </svg>
  );
}

/** Apple's mark, for the calendar file Apple Calendar opens (Simple Icons path data, CC0). */
function AppleMark() {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" focusable="false">
      <path fill="currentColor" d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
    </svg>
  );
}

// The columns a phone shows before the table is scrolled sideways: only these play their
// entrance there (exam.css); the rest are off screen and simply appear.
const NEAR_COLS = 7;

function Cell({ cell, col }) {
  const v = cellValue(cell);
  if (cell === null) return <td className="alm-none"><span aria-label="ไม่มีบันทึก">–</span></td>;
  if (v === null) return <td className="alm-word">{cell}</td>;
  const heat = Math.min(1, v / 40);
  return (
    <td className={`alm-c${heat >= 0.55 ? ' is-deep' : ''}`} style={{ '--v': heat.toFixed(3), '--col': col }}>
      <span className={`alm-v${col < NEAR_COLS ? ' is-near' : ''}`}>{Array.isArray(cell) ? cell.join('+') : v}</span>
    </td>
  );
}

function Trend({ value }) {
  if (value === null) return <span className="tr tr-none">–</span>;
  const shown = `${value > 0 ? '+' : value < 0 ? '−' : '±'}${Math.abs(value).toFixed(1)}`;
  return <span className={`tr${value >= MARK ? ' tr-up' : value <= -MARK ? ' tr-down' : ''}`}>{shown}</span>;
}

export default function Exam() {
  useTitle('สนามสอบ');
  const progress = useProgress();
  const today = useToday();
  const round = upcomingRound(today);
  const days = countdown(round, today);
  // Once the round is under way its first day has passed: the day to count to is the last.
  const examDay = round ? (round.parts[0].date >= today ? round.parts[0].date : round.parts[round.parts.length - 1].date) : null;
  const mine = round && (progress.examDate === round.parts[0].date || progress.examDate === examDay);
  const lag = resultsLag();
  const { guard, sheet } = useStartGuard();
  const [busy, setBusy] = useState(null);
  const [failed, setFailed] = useState(false);
  const [calendar, setCalendar] = useState(false);

  // Domains by how often the exam asked them in the three latest years.
  const asks = useMemo(() => {
    const rows = [...domainProfile()].map(([id, p]) => ({ id, ...p }))
      .sort((a, b) => (a.id === null) - (b.id === null) || b.mean - a.mean);
    return { rows, top: Math.max(...rows.map((r) => r.share)), total: rows.reduce((sum, r) => sum + r.mean, 0) };
  }, []);

  // The almanac's quick read: the subjects that moved most in the latest year.
  const movers = useMemo(() => {
    const moved = SUBJECTS.map((s) => ({ en: s.en, t: trend(s) })).filter((s) => s.t !== null);
    return {
      up: moved.filter((s) => s.t >= MARK).sort((a, b) => b.t - a.t).slice(0, 4),
      down: moved.filter((s) => s.t <= -MARK).sort((a, b) => a.t - b.t).slice(0, 3),
    };
  }, []);

  const rehearse = (size) => guard(async () => {
    setFailed(false);
    setBusy({ size, done: 0, total: 0 });
    try {
      const res = await startSet({
        mode: 'mock', size, perQuestion: EXAM_SECONDS, mix: 'exam', label: 'exam',
        onProgress: (done, total) => setBusy({ size, done, total }),
      });
      if (res.ok) navigate('/session');
      else { setBusy(null); setFailed(true); }
    } catch {
      setBusy(null);
      setFailed(true);
    }
  });

  const setMine = () => progressStore.set((s) => ({ ...s, examDate: examDay }));

  return (
    <div className="exam">
      <section className="wrap xhero" aria-labelledby="xhero-h">
        <div className="xhero-text">
          <p className="kicker">The next sitting</p>
          {round ? (
            <>
              <h1 id="xhero-h" className="xhero-h" tabIndex={-1}>
                {days === 0 ? <span className="xhero-today">สอบวันนี้</span> : (
                  <><span className="xhero-pre">อีก</span><CountUp className="xhero-n" value={days} duration={1400} /><span className="xhero-unit">วัน</span></>
                )}
              </h1>
              <p className="xhero-sub"><Nw>สอบ VCA รอบ {round.id}</Nw> <Nw>ประกาศผล {thaiDay(round.results)}</Nw></p>
              <div className="xhero-actions">
                <button type="button" className="btn btn-ink btn-lg" onClick={setMine} disabled={mine} aria-pressed={mine}>
                  {mine ? <><Icon name="check" />ตั้งเป็นวันสอบแล้ว</> : <><Icon name="target" />ใช้เป็นวันสอบของฉัน</>}
                </button>
                <button type="button" className="btn btn-glass btn-lg glass cal-btn" onClick={() => setCalendar(true)}>
                  <Icon name="calendar" />ลงปฏิทิน
                </button>
                <ShareButton
                  className="btn btn-ghost btn-lg" label="แชร์"
                  path="/exam" title="สนามสอบ VCA"
                  text={`สอบ VCA รอบ ${round.id} อีก ${num(days)} วัน มาซ้อมด้วยกัน`}
                />
              </div>
              <p className="xhero-src">
                <a href={SOURCES[round.source].url} target="_blank" rel="noopener noreferrer" className="text-link">ประกาศศูนย์ประเมินฯ ที่ 10/2568 <Icon name="arrowUpRight" size={14} /></a>
              </p>
            </>
          ) : (
            <>
              <h1 id="xhero-h" className="xhero-h xhero-wait" tabIndex={-1}>รอประกาศ<wbr />รอบถัดไป</h1>
              <p className="xhero-sub">ศูนย์ประเมินฯ มักประกาศกำหนดการทั้งปีช่วงเดือนพฤศจิกายน</p>
              <p className="xhero-src">
                <a href={SOURCES.council.url} target="_blank" rel="noopener noreferrer" className="text-link">ดูประกาศล่าสุด <Icon name="arrowUpRight" size={14} /></a>
              </p>
            </>
          )}
        </div>
        {round && (
          <div className="tickets">
            {round.parts.map((p, i) => <Ticket key={p.part} part={p} i={i} round={round.id} />)}
          </div>
        )}
      </section>

      <section className="wrap band glass" aria-label="รูปแบบข้อสอบ" data-reveal>
        <Figure value={FORMAT.perPart} unit="ข้อ">ต่อหมวด สอบ<b>สองหมวด</b></Figure>
        <Figure value={FORMAT.minutesPerPart / 60} unit="ชม.">ต่อหมวด</Figure>
        <Figure value={EXAM_SECONDS} unit="วินาที">ต่อข้อ</Figure>
        <Figure value={FORMAT.feePerPart} unit="บาท">ค่าสมัครต่อหมวด</Figure>
      </section>

      <section className="wrap rehearse glass" aria-labelledby="rehearse-h" data-reveal data-sheen>
        <div>
          <h2 id="rehearse-h" className="rehearse-h">ซ้อมให้เหมือนวันจริง</h2>
          <p className="rehearse-p"><Nw>{FORMAT.perPart} ข้อใน {FORMAT.minutesPerPart / 60} ชั่วโมง</Nw> <Nw>คละหมวดตามที่ข้อสอบจริงถาม</Nw></p>
        </div>
        <div className="rehearse-go">
          <button type="button" className="btn btn-ink btn-lg" onClick={() => rehearse(FORMAT.perPart)} disabled={!!busy}>
            {busy?.size === FORMAT.perPart
              ? <>กำลังเตรียม {busy.total ? `${busy.done}/${busy.total}` : ''}<span className="spinner" aria-hidden="true" /></>
              : <><Icon name="timer" />เริ่มสนามจริง</>}
          </button>
          <button type="button" className="btn btn-glass btn-lg glass" onClick={() => rehearse(50)} disabled={!!busy}>
            {busy?.size === 50 ? <>กำลังเตรียม<span className="spinner" aria-hidden="true" /></> : <>ฉบับสั้น <span className="btn-meta">50 ข้อ 45 นาที</span></>}
          </button>
        </div>
        {failed && <p className="notice notice-error"><Icon name="info" />โหลดข้อสอบไม่สำเร็จ ตรวจการเชื่อมต่อแล้วลองอีกครั้ง</p>}
      </section>

      <section className="wrap sec" aria-labelledby="asks-h">
        <div className="sec-head" data-reveal>
          <div>
            <p className="kicker">Where the questions fall</p>
            <h2 id="asks-h" className="sec-h">ข้อสอบออกหมวดไหนบ้าง</h2>
          </div>
          <p className="sec-note"><Icon name="info" size={16} /><span>สัดส่วนจากข้อที่รุ่นพี่จำได้หลังสอบ <Nw>ปี 66–68</Nw> <Nw>ไม่ใช่ตัวเลขทางการ</Nw></span></p>
        </div>
        <ol className="asks" data-reveal>
          {asks.rows.map((r, i) => {
            const card = r.id && CARD_BY_ID[r.id];
            const body = (
              <>
                <span className="ask-rank" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                {card ? <img className="ask-art" src={card.art} alt="" width="40" height="40" loading="lazy" decoding="async" /> : <span className="ask-art ask-art-none" aria-hidden="true" />}
                <span className="ask-name">{card ? <Words text={card.thw} /> : <>อื่น ๆ <small>Physiology, Nutrition</small></>}</span>
                <span className="ask-bar" aria-hidden="true"><i style={{ '--w': (r.share / asks.top).toFixed(3) }} /></span>
                <span className="ask-pct">{pct(r.share)}</span>
                <span className="ask-move">{Math.abs(r.move) >= MARK && (
                  <span className={r.move > 0 ? 'tr tr-up' : 'tr tr-down'} title="ปี 68 เทียบค่าเฉลี่ยปี 66–67">
                    <span aria-hidden="true">{r.move > 0 ? '▲' : '▼'}</span>
                    <span className="sr">{r.move > 0 ? 'ปี 68 ออกเพิ่ม' : 'ปี 68 ออกลดลง'}</span>{Math.abs(r.move).toFixed(r.move % 1 ? 1 : 0)}
                  </span>
                )}</span>
              </>
            );
            return (
              <li key={r.id || 'other'} className="ask" style={{ '--i': Math.min(i, 12) }}>
                {card ? <Link to={`/d/${r.id}`} className="ask-row">{body}</Link> : <div className="ask-row ask-row-other">{body}</div>}
              </li>
            );
          })}
        </ol>
        <p className="asks-legend">
          <span><span className="tr tr-up">▲</span><span className="tr tr-down">▼</span> ปี 68 เทียบค่าเฉลี่ยปี 66–67</span>
          <span>แต่ละปีบันทึกได้ราว <Nw>{num(Math.round(asks.total))} จาก {num(FORMAT.perPart * 2)} ข้อ</Nw></span>
        </p>
      </section>

      <section className="wrap sec" aria-labelledby="alm-h">
        <div className="sec-head" data-reveal>
          <div>
            <p className="kicker">Almanac {YEARS[0]}–{YEARS[YEARS.length - 1]}</p>
            <h2 id="alm-h" className="sec-h"><Words text={`${YEARS.length} ปีที่|รุ่นพี่จดไว้`} /></h2>
          </div>
          <div className="movers" aria-label="วิชาที่เปลี่ยนมากในปี 68">
            <p><span className="movers-k">ปี 68 ขึ้น</span>{movers.up.map((m) => <span key={m.en} className="mover">{m.en} <Trend value={m.t} /></span>)}</p>
            <p><span className="movers-k">ปี 68 ลด</span>{movers.down.map((m) => <span key={m.en} className="mover">{m.en} <Trend value={m.t} /></span>)}</p>
          </div>
        </div>
        <div className="alm-scroll" role="region" aria-labelledby="alm-h" tabIndex={0} data-reveal>
          <table className="alm">
            <caption className="sr">จำนวนข้อที่บันทึกได้ของแต่ละวิชา ปี {YEARS[0]} ถึง {YEARS[YEARS.length - 1]} พร้อมค่าเฉลี่ยปี 66 ถึง 68 และทิศทางปี 68</caption>
            <thead>
              <tr>
                <th scope="col" className="alm-subj">วิชา</th>
                {YEARS.map((y) => <th scope="col" key={y} className={RECENT.includes(y) ? 'is-recent' : undefined}>{yy(y)}</th>)}
                <th scope="col" className="alm-avg">เฉลี่ย<br /><small>66–68</small></th>
                <th scope="col" className="alm-tr">ทิศทาง</th>
              </tr>
            </thead>
            {GROUPS.map((g) => (
              <tbody key={g.id}>
                <tr className="alm-group"><th scope="colgroup" colSpan={YEARS.length + 3}><span>{g.th}</span></th></tr>
                {SUBJECTS.filter((s) => s.group === g.id).map((s) => (
                  <tr key={s.en}>
                    <th scope="row" className="alm-subj">{s.en}{s.note && <sup><a href={`#note-${s.note}`} aria-label={`หมายเหตุ ${s.note}`}>{s.note}</a></sup>}</th>
                    {s.y.map((c, i) => <Cell key={YEARS[i]} cell={c} col={i} />)}
                    <td className="alm-avg">{recentMean(s).toFixed(1)}</td>
                    <td className="alm-tr"><Trend value={trend(s)} /></td>
                  </tr>
                ))}
              </tbody>
            ))}
            <tfoot>
              <tr>
                <th scope="row" className="alm-subj">รวมที่บันทึกได้</th>
                {YEARS.map((y) => <td key={y}>{num(SUBJECTS.reduce((sum, s) => sum + (cellValue(s.y[YEARS.indexOf(y)]) ?? 0), 0))}</td>)}
                <td colSpan={2} />
              </tr>
            </tfoot>
          </table>
        </div>
        <div className="alm-key" aria-hidden="true">
          <span>0</span><i className="alm-scale" /><span>40 ข้อ</span>
          <span className="alm-key-none">– ไม่มีบันทึก ไม่ใช่ศูนย์</span>
        </div>
      </section>

      <section className="wrap sec sec-last notes" aria-labelledby="notes-h" data-reveal>
        <h2 id="notes-h" className="notes-h">หมายเหตุและที่มา</h2>
        <ol className="notes-list">
          {Object.entries(NOTES).map(([n, text]) => <li key={n} id={`note-${n}`} value={n}>{text}</li>)}
        </ol>
        <ul className="notes-more">
          <li>ตัวเลขทั้งหมดคือข้อที่นิสิตจำได้หลังสอบและจัดวิชาได้ ไม่ใช่ตัวเลขทางการ ปี 58–65 บันทึกไว้ 23–25 วิชา ปี 66–68 บันทึก 38–40 วิชา ผลรวมข้ามปีจึงเทียบกันตรง ๆ ไม่ได้</li>
          <li>ค่าแบบ a+b นับรวมเป็นตัวเลขเดียว ปีที่ไม่มีบันทึกนับเป็น 0 ในค่าเฉลี่ย 3 ปี ส่วน “med” ไม่นับ</li>
          <li>One health / Food safety อ่านเป็น one health + food safety ตามลำดับชื่อ Physiology และ Nutrition ยังไม่มีหมวดในคลัง</li>
          {lag.length > 0 && <li>ผลสอบออกหลังวันสอบ {Math.min(...lag)}–{Math.max(...lag)} วัน ในรอบที่มีประกาศ</li>}
        </ul>
        <ul className="notes-src">
          {Object.entries(SOURCES).map(([id, s]) => (
            <li key={id}>
              <span className="notes-kind">{s.kind}</span>
              {s.url ? <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-link">{s.th}</a> : <span>{s.th}</span>}
            </li>
          ))}
        </ul>
      </section>

      {round && (
        <Sheet open={calendar} onClose={() => setCalendar(false)} title="ลงปฏิทิน">
          <p className="sheet-p">สองวันของรอบ {round.id} พร้อมเตือนล่วงหน้าหนึ่งวัน</p>
          <ul className="cal-list">
            {round.parts.map((p, i) => (
              <li key={p.part}>
                <a className="cal-opt has-logo" href={googleCalendarUrl(round, p)} target="_blank" rel="noopener noreferrer" data-autofocus={i === 0 ? true : undefined}>
                  <span className="cal-logo"><GoogleCalendarMark /></span>
                  <span className="cal-app">Google Calendar หมวด {p.part}</span>
                  <span className="cal-how">{thaiDay(p.date, SHORT)} {p.from}–{p.to}</span>
                  <Icon name="arrowUpRight" />
                </a>
              </li>
            ))}
            <li>
              <button type="button" className="cal-opt has-logo" onClick={() => { saveRoundCalendar(round); setCalendar(false); }}>
                <span className="cal-logo cal-logo-apple"><AppleMark /></span>
                <span className="cal-app">Apple Calendar, Outlook และแอปอื่น</span>
                <span className="cal-how">ไฟล์ .ics ที่มีทั้งสองวัน</span>
                <Icon name="download" />
              </button>
            </li>
          </ul>
        </Sheet>
      )}
      {sheet}
    </div>
  );
}
