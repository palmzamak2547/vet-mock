// The front door. The hero is a vitrine: the domain prints hang on the wall behind a pane of
// glass, and on the glass is a real VCA question to answer before reading anything else.
// Words are few on purpose; the numbers, the prints and the buttons say the rest.

import { useMemo, useState } from 'react';
import { Link } from '../components/Link.jsx';
import { Icon } from '../components/Icon.jsx';
import { Question } from '../components/Question.jsx';
import { Plan } from '../components/Plan.jsx';
import { Countdown } from '../components/Countdown.jsx';
import { CountUp } from '../components/CountUp.jsx';
import { useStartGuard } from '../components/StartGuard.jsx';
import { Plate, Meter, Nw, Figure, Kbd, Words } from '../components/bits.jsx';
import { BANK, CARD_BY_ID, DOMAIN_CARDS } from '../lib/bank.js';
import { SAMPLES } from '../generated/bank.js';
import { getShuffledOptions } from '@vetmock/lib/option-shuffle.js';
import { num, plateNo, pct } from '../lib/format.js';
import { useActiveSession, useProgress, useTitle } from '../lib/hooks.js';
import { statsFor, streak, wrongKeys } from '../lib/progress.js';
import { quickStart, startSet } from '../lib/start.js';
import { localDay } from '../lib/dates.js';
import { navigate } from '../router.js';
import { haptic } from '../lib/motion.js';

// The wall: nine prints, each at its own depth behind the glass.
const WALL = [
  ['equine', 10], ['swine', 6], ['aquatic', 12],
  ['avian', 7], ['ruminant', 4], ['small-animal', 9],
  ['exotic', 11], ['theriogenology', 5], ['zoonoses', 8],
];

function SampleCard() {
  const [at, setAt] = useState(0);
  const [choice, setChoice] = useState(null);
  const q = SAMPLES[at % SAMPLES.length];
  const order = useMemo(() => getShuffledOptions(q).displayToOriginal, [q]);
  if (!q) return null;
  const card = CARD_BY_ID[q.domain];
  const answer = (orig) => { setChoice(orig); haptic(orig === q.answer ? 10 : [8, 50, 8]); };
  return (
    <div className="sample glass">
      <div className="sample-top">
        <span className="sample-tag"><span className="dot" aria-hidden="true" />ลองข้อนี้</span>
        {card && <span className="q-plate"><span className="q-plate-no">{plateNo(card.plate)}</span>{card.th}</span>}
        <span className="sample-no">No. {q.id}</span>
      </div>
      <div className="q-swap" key={q.id}>
        <Question q={q} order={order} choice={choice} revealed={choice != null} onChoose={answer} mode="sample" stemId="sample-stem" showProvenance={false} head={false} />
      </div>
      <div className="sample-foot">
        {choice == null
          ? (
            <span className="hand-note">
              <svg viewBox="0 0 40 28" aria-hidden="true" focusable="false"><path d="M36 24 C 22 24, 10 18, 6 5 M2 11 L 6 4 L 11 9" /></svg>
              <span className="keys-only">ลองคลิกดูสักข้อ</span><span className="touch-only">ลองแตะดูสักข้อ</span>
            </span>
          )
          : <button type="button" className="btn btn-ghost btn-sm" onClick={() => { setChoice(null); setAt((n) => n + 1); }}>ลองอีกข้อ <Icon name="arrowRight" size={18} /></button>}
      </div>
    </div>
  );
}

function Desk({ onMissed }) {
  const progress = useProgress();
  const session = useActiveSession();
  const all = statsFor(progress);
  const missed = wrongKeys(progress);
  if (!session && !all.seen) return null;
  return (
    <section className="desk glass" aria-label="ที่ค้างไว้" data-reveal>
      {session && (
        <Link to="/session" className="desk-resume">
          <span className="desk-k">{session.mode === 'mock' ? 'สอบจำลองที่ค้าง' : 'ชุดที่ค้าง'}</span>
          <span className="desk-v">ข้อ {session.cursor + 1}/{session.items.length}</span>
          <span className="btn btn-ink btn-sm">ทำต่อ <Icon name="arrowRight" size={18} /></span>
        </Link>
      )}
      {all.seen > 0 && (
        <div className="desk-stats">
          <div><b><CountUp value={all.seen} /></b><span>ข้อที่ทำ</span></div>
          <div><b>{pct(all.accuracy)}</b><span>ถูกล่าสุด</span></div>
          <div><b><CountUp value={streak(progress, localDay())} /></b><span>วันติดกัน</span></div>
          {missed.length > 0 && !session && (
            <button type="button" className="desk-more" onClick={() => onMissed(missed)}>
              <Icon name="refresh" size={16} />ฝึกข้อที่พลาด {num(Math.min(missed.length, 50))}
            </button>
          )}
          <Link to="/progress" className="desk-more">ดูทั้งหมด <Icon name="arrowRight" size={16} /></Link>
        </div>
      )}
    </section>
  );
}

function DomainCard({ card, progress, lead = false }) {
  const s = statsFor(progress, card.id);
  return (
    <Link to={`/d/${card.id}`} className={`dcard glass${lead ? ' dcard-lead' : ''}`} data-sheen data-tilt="6">
      <img className="dcard-art" src={card.art} alt="" width="512" height="512" loading="lazy" decoding="async" style={{ viewTransitionName: `plate-${card.id}` }} />
      <span className="dcard-pl">{plateNo(card.plate)}</span>
      <h4 className="dcard-th"><Words text={card.thw} /></h4>
      <span className="dcard-en">{card.en}</span>
      <span className="dcard-n"><b>{num(card.count)}</b> ข้อ</span>
      {s.seen > 0 && (
        <span className="dcard-me">
          <Meter value={s.seen / card.count} label={`ทำแล้ว ${s.seen} จาก ${card.count} ข้อ`} />
          <span className="dcard-me-t"><span>ทำแล้ว {pct(s.seen / card.count)}</span><span>ถูก {pct(s.accuracy)}</span></span>
        </span>
      )}
    </Link>
  );
}

const KIND_ROWS = [
  { kind: 'vca', th: 'แนว VCA' },
  { kind: 'paper', th: 'ข้อสอบเก่า' },
  { kind: 'aligned', th: 'อิงแนวข้อสอบ' },
  { kind: 'lecture', th: 'จากเลกเชอร์' },
  { kind: 'course', th: 'คลังรายวิชา' },
];

export function Home() {
  useTitle('');
  const progress = useProgress();
  const { guard, sheet } = useStartGuard();
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState('');
  const lib = BANK.library;

  // A start that cannot load its questions says so, rather than spinning back to the button.
  const go = (run) => guard(async () => {
    setBusy(true);
    setFailed('');
    const res = await run().catch(() => null);
    setBusy(false);
    if (res?.ok) { navigate('/session'); return; }
    setFailed(res?.reason === 'empty' ? 'ยังไม่มีข้อที่ตรงกับชุดนี้ ลองตั้งชุดเองได้' : navigator.onLine === false ? 'ตอนนี้ออฟไลน์อยู่ ข้อสอบชุดนี้ยังไม่เคยเปิดในเครื่องนี้ ต่อเน็ตแล้วลองอีกครั้ง' : 'โหลดข้อสอบไม่สำเร็จ ตรวจการเชื่อมต่อแล้วลองอีกครั้ง');
  });
  const startQuick = () => go(() => quickStart());
  const startMissed = (keys) => go(() => {
    const list = keys.slice(0, 50);
    return startSet({ mode: 'practice', domains: [...new Set(list.map((k) => progress.q[k].d))], keys: list, size: list.length, label: 'missed' });
  });

  let cell = 0;
  return (
    <>
      <section className="hero wrap">
        <div className="hero-copy">
          <Countdown />
          <h1 className="hero-h">
            <Nw>ซ้อมสอบใบประกอบฯ</Nw><wbr /> <Nw>ให้เหมือน<em>วันจริง</em></Nw>
          </h1>
          <p className="lede">
            <Nw><b><CountUp value={BANK.total} /> ข้อ</b></Nw> <Nw>ครบ <b>{BANK.domains.length} หมวด</b></Nw> <Nw>เฉลยทุกข้อ</Nw> <Nw>ไม่ต้องสมัคร</Nw>
          </p>
          <div className="ctas">
            <button type="button" className="btn btn-ink btn-lg" onClick={startQuick} disabled={busy}>
              {busy ? <>กำลังเตรียม<span className="spinner" aria-hidden="true" /></> : <>เริ่มเลย <span className="btn-meta">10 ข้อ</span><Icon name="arrowRight" /></>}
            </button>
            <Link to="/practice?mode=mock" className="btn btn-glass btn-lg glass"><Icon name="timer" />สอบจำลอง</Link>
          </div>
          {failed && <p className="notice notice-error start-fail" role="alert"><Icon name="info" />{failed}</p>}
          <p className="fine"><Link to="/practice" className="text-link">ตั้งชุดเอง <Icon name="arrowRight" size={16} /></Link></p>
        </div>
        <div className="vitrine" data-parallax>
          <div className="wall" aria-hidden="true">
            {WALL.map(([id, depth], i) => CARD_BY_ID[id] && <Plate key={id} card={CARD_BY_ID[id]} eager={i < 6} style={{ '--i': i, '--d': depth }} />)}
          </div>
          <SampleCard />
        </div>
      </section>

      <div className="wrap"><Desk onMissed={startMissed} /></div>

      <section className="wrap band glass" aria-label="คลังในตัวเลข" data-reveal>
        <Figure value={BANK.total} unit="ข้อ">มีเฉลยและเหตุผล<b>ทุกข้อ</b></Figure>
        <Figure value={BANK.kinds.paper} unit="ข้อ"><b>ข้อสอบเก่า</b>ที่รุ่นพี่จดไว้</Figure>
        <Figure value={BANK.domains.length} unit="หมวด">ที่ข้อสอบถาม</Figure>
        <Figure value={lib.documents} unit="รายการ">เอกสาร VCA <b><CountUp value={lib.pages} /> หน้า</b></Figure>
      </section>

      <section className="wrap sec" aria-labelledby="collection-h">
        <div className="sec-head" data-reveal>
          <div>
            <p className="kicker">The collection</p>
            <h2 id="collection-h" className="sec-h">ทุกหมวดที่ VCA ถาม</h2>
          </div>
        </div>
        {/* One wall: each family opens with its wall text, as a gallery hangs it between
            exhibits, and the last cell draws from every domain. 4 + 19 + 1 cells close the
            grid at four, three and two columns alike. */}
        <div className="dgrid">
          {BANK.families.map((f, fi) => {
            const cards = DOMAIN_CARDS.filter((d) => d.family === f.id);
            // On a phone the wall text spans the row; a family with an odd number of cells
            // there opens with one wide plate, so its rows close.
            const cells = cards.length + (fi === BANK.families.length - 1 ? 1 : 0);
            return [
              <div key={f.id} className="cell cell-text" data-reveal style={{ '--i': Math.min(cell++, 10) }}>
                <div className="walltext">
                  <span className="walltext-n" aria-hidden="true">{f.numeral}</span>
                  <h3 className="walltext-h"><Words text={f.thw} /></h3>
                  <span className="walltext-en">{f.en}</span>
                  <span className="walltext-meta"><span>{cards.length} หมวด</span><span>{num(cards.reduce((a, d) => a + d.count, 0))} ข้อ</span></span>
                </div>
              </div>,
              ...cards.map((d, i) => (
                <div key={d.id} className="cell" data-lead={i === 0 && cells % 2 === 1 ? '' : undefined} data-reveal style={{ '--i': Math.min(cell++, 10) }}>
                  <DomainCard card={d} progress={progress} lead={i === 0 && cells % 2 === 1} />
                </div>
              )),
            ];
          })}
          <div className="cell" data-reveal style={{ '--i': Math.min(cell++, 10) }}>
            <Link to="/practice" className="dcard dcard-all" data-sheen data-tilt="6">
              <span className="dcard-pl">All plates</span>
              <h4 className="dcard-th">คละทุกหมวด</h4>
              <span className="dcard-en">Every domain, as the exam asks</span>
              {/* The wall's index: one chip of paper per plate, in plate order. */}
              <span className="dcard-index" aria-hidden="true">
                {DOMAIN_CARDS.map((d, i) => <i key={d.id} style={{ '--paper': d.paper, '--j': i }} />)}
              </span>
              <span className="dcard-go">ตั้งชุด <Icon name="arrowRight" size={18} /></span>
            </Link>
          </div>
        </div>
      </section>

      <section className="wrap sec" aria-labelledby="modes-h">
        <div className="sec-head" data-reveal>
          <div>
            <p className="kicker">Three ways in</p>
            <h2 id="modes-h" className="sec-h">สามวิธีซ้อม</h2>
          </div>
        </div>
        <div className="modes">
          <div className="cell" data-reveal style={{ '--i': 0 }}>
            <Link to="/practice" className="mode glass" data-sheen data-tilt="4">
              <div className="mode-vis" aria-hidden="true">
                <span className="mv-opt"><i>B</i><span className="mv-t">Trichodina, formalin</span></span>
                <span className="mv-opt mv-right"><i>A</i><span className="mv-t">Ichthyophthirius, เกลือ</span><Icon name="check" size={16} strokeWidth={2.2} /></span>
                <span className="mv-why"><b>ทำไม</b> วงจรชีวิตของ Ich …</span>
              </div>
              <h3><Icon name="target" size={20} />ฝึกทีละข้อ</h3>
              <p>ตอบปุ๊บ รู้ปั๊บ พร้อมเหตุผล</p>
              <p className="mode-keys keys-only"><Kbd>1</Kbd>–<Kbd>5</Kbd> เลือก <Kbd>Enter</Kbd> ไปต่อ</p>
            </Link>
          </div>
          <div className="cell" data-reveal style={{ '--i': 1 }}>
            <Link to="/practice?mode=mock" className="mode glass" data-sheen data-tilt="4">
              <div className="mode-vis" aria-hidden="true">
                <span className="mv-timer"><Icon name="clock" size={16} />1:12:34</span>
                <span className="mv-dots">{Array.from({ length: 20 }, (_, i) => <i key={i} className={i < 11 ? 'a' : i === 13 ? 'f' : ''} style={{ '--i': i }} />)}</span>
              </div>
              <h3><Icon name="timer" size={20} />สอบจำลอง</h3>
              <p>จับเวลาจริง ปักธงได้ ส่งแล้วดูผลรายหมวด</p>
            </Link>
          </div>
          <div className="cell" data-reveal style={{ '--i': 2 }}>
            <Link to="/progress" className="mode glass" data-sheen data-tilt="4">
              <div className="mode-vis mv-stack" aria-hidden="true">
                <span><Icon name="x" size={14} strokeWidth={2.2} />Strongylus vulgaris …</span>
                <span><Icon name="x" size={14} strokeWidth={2.2} />Brucella S19 …</span>
                <span><Icon name="x" size={14} strokeWidth={2.2} />Lernea spp. …</span>
              </div>
              <h3><Icon name="refresh" size={20} />ทบทวนข้อที่พลาด</h3>
              <p>ข้อที่ผิดจะถูกเก็บไว้ ให้กลับมาฝึกจนแม่น</p>
            </Link>
          </div>
        </div>
      </section>

      <section className="wrap sec" aria-labelledby="source-h">
        <div className="sec-head" data-reveal>
          <div>
            <p className="kicker">Provenance</p>
            <h2 id="source-h" className="sec-h">ข้อสอบมาจากไหน</h2>
          </div>
          <Link to="/about" className="text-link">วิธีคัดข้อสอบ <Icon name="arrowRight" size={16} /></Link>
        </div>
        <div className="source glass" data-reveal>
          <div className="stack-bar" role="img" aria-label={KIND_ROWS.map((r) => `${r.th} ${BANK.kinds[r.kind]} ข้อ`).join(', ')}>
            {KIND_ROWS.map((r, i) => <i key={r.kind} className={`k-${r.kind}`} style={{ flexGrow: BANK.kinds[r.kind], '--i': i }} />)}
          </div>
          <ul className="source-legend">
            {KIND_ROWS.map((r) => (
              <li key={r.kind}>
                <span className={`swatch k-${r.kind}`} aria-hidden="true" />
                <span className="source-k">{r.th}</span>
                <span className="source-n">{num(BANK.kinds[r.kind])}</span>
              </li>
            ))}
          </ul>
          <p className="source-held"><Icon name="info" size={16} />อีก {num(BANK.held)} ข้อที่เฉลยยังไม่ชัด <b>พักไว้ก่อน</b></p>
        </div>
      </section>

      <section className="wrap sec" aria-labelledby="lib-h">
        <div className="libteaser glass" data-reveal data-sheen>
          <div className="libteaser-copy">
            <p className="kicker">The archive</p>
            <h2 id="lib-h" className="sec-h">เอกสาร VCA <CountUp value={lib.documents} /> รายการ</h2>
            <p className="sec-p">ข้อสอบเก่าและเอกสารติวรวม <Nw><CountUp value={lib.pages} /> หน้า</Nw>{lib.firstYear ? <> <Nw>ย้อนไปถึงปี {lib.firstYear}</Nw></> : null}</p>
            <Link to="/library" className="btn btn-ink"><Icon name="book" />เปิดชั้นเอกสาร</Link>
          </div>
          <ul className="shelf-chips">
            {lib.shelves.map((s) => (
              <li key={s.id}><Link to={`/library?shelf=${s.id}`} className="chip"><Words text={s.th} /><span className="chip-n">{s.count}</span></Link></li>
            ))}
          </ul>
        </div>
      </section>

      <div className="wrap sec sec-last" data-reveal><Plan /></div>
      {sheet}
    </>
  );
}
