// One plate up close: what the domain holds, where its questions come from, how far the
// student has got, and the documents that cover it. Next and previous walk the wall.

import { useState } from 'react';
import { Link } from '../components/Link.jsx';
import { Icon } from '../components/Icon.jsx';
import { Meter, KindBadge, Plate, Words } from '../components/bits.jsx';
import { BANK, CARD_BY_ID, DOMAIN_CARDS, loadCatalog, loadLibrary, subjectName } from '../lib/bank.js';
import { statsFor } from '../lib/progress.js';
import { startSet } from '../lib/start.js';
import { useStartGuard } from '../components/StartGuard.jsx';
import { useAsync, useProgress, useTitle } from '../lib/hooks.js';
import { navigate, withQuery } from '../router.js';
import { num, pct, plateNo } from '../lib/format.js';
import { domainProfile } from '../data/almanac.js';
import { ShareButton } from '../components/Share.jsx';
import NotFound from './NotFound.jsx';

const PROFILE = domainProfile();

const loadShelves = () => loadLibrary().then((library) => library.shelves);

// With no topic list the one panel left takes the whole row.
const ONE_COLUMN = { gridTemplateColumns: 'minmax(0, 1fr)' };

/** A load that failed: said once, with the button that asks again. */
function LoadError({ what, onRetry }) {
  return (
    <p className="notice notice-error" role="alert"><Icon name="info" />{what}ไม่สำเร็จ <button type="button" className="text-link" onClick={onRetry}>ลองอีกครั้ง</button></p>
  );
}

export default function Domain({ route }) {
  const card = CARD_BY_ID[route.params.id];
  useTitle(card ? card.th : 'ไม่พบหมวดนี้');
  const progress = useProgress();
  const { guard, sheet } = useStartGuard();
  const catalog = useAsync(loadCatalog, 'catalog');
  const shelves = useAsync(loadShelves, 'shelves');
  const [busy, setBusy] = useState(null);
  if (!card) return <NotFound />;

  const s = statsFor(progress, card.id);
  const exam = PROFILE.get(card.id);
  const family = BANK.families.find((f) => f.id === card.family);
  const at = DOMAIN_CARDS.indexOf(card);
  const prev = DOMAIN_CARDS[at - 1];
  const next = DOMAIN_CARDS[at + 1];
  const detail = catalog.status === 'ready' ? catalog.value.domains[card.id] : null;
  // The catalog holds the rows ready to draw (names cleaned, near-duplicates merged); the card says
  // whether this domain has enough of them to list.
  const showTopics = card.topicCount > 0;
  const topics = detail?.shown ?? [];
  // One press asks again for everything on the page that failed to load.
  const retry = () => {
    if (catalog.status === 'error') catalog.retry();
    if (shelves.status === 'error') shelves.retry();
  };
  const docShelves = shelves.status === 'ready' ? shelves.value.filter((x) => x.domain === card.id) : [];

  const quick = (size, mode = 'practice') => guard(async () => {
    setBusy(`${mode}${size}`);
    const res = await startSet({ mode, domains: [card.id], size, status: s.seen < card.count ? 'unseen' : 'all' }).catch(() => null);
    setBusy(null);
    if (res?.ok) navigate('/session');
  });

  const kinds = [['vca', 'แนว VCA'], ['paper', 'ข้อสอบเก่า'], ['aligned', 'อิงแนวข้อสอบ'], ['lecture', 'จากเลกเชอร์'], ['course', 'คลังรายวิชา']].filter(([k]) => card.kinds[k]);

  return (
    <div className="wrap domain">
      <nav className="crumbs" aria-label="ตำแหน่ง">
        <Link to="/">หน้าแรก</Link><Icon name="chevronRight" size={14} />
        <span><span className="crumb-num">{family?.numeral}</span>{family?.th}</span>
        <ShareButton
          className="text-link crumbs-share" label="แชร์หมวดนี้" iconSize={16}
          path={`/d/${card.id}`} title={`${card.th} | VetMock VCA`}
          text={`ข้อสอบ VCA หมวด${card.th} ${num(card.count)} ข้อ พร้อมเฉลย`}
        />
      </nav>

      <header className="dhero glass">
        <Plate card={card} caption={false} className="dhero-plate" eager style={{ viewTransitionName: `plate-${card.id}` }} />
        <div className="dhero-copy">
          <p className="kicker"><span className="kicker-no">{plateNo(card.plate)}</span>{card.en}</p>
          <h1 className="page-h dhero-h"><Words text={card.thw} /></h1>
          <p className="dhero-n"><b>{num(card.count)}</b> ข้อ</p>
          {exam && (
            <p className="dhero-exam">
              <Link to="/exam" className="dhero-exam-link">
                ออกสอบราว <b>{pct(exam.share)}</b>
                {exam.move >= 3 ? <span className="tr tr-up">▲ ปี 68 ออกเพิ่ม</span> : exam.move <= -3 ? <span className="tr tr-down">▼ ปี 68 ออกน้อยลง</span> : null}
                <Icon name="arrowRight" size={14} />
              </Link>
            </p>
          )}
          <ul className="dhero-kinds" aria-label="ที่มาของข้อในหมวดนี้">
            {kinds.map(([k, th]) => <li key={k}><KindBadge kind={k} /><span>{num(card.kinds[k])}</span><span className="sr">{th}</span></li>)}
          </ul>
          {s.seen > 0 && (
            <div className="dhero-me">
              <Meter value={s.seen / card.count} label={`ทำแล้ว ${s.seen} จาก ${card.count}`} />
              <span className="dhero-me-t">
                <span>ทำแล้ว <b>{num(s.seen)}</b> ข้อ</span>
                <span>ถูก <b>{pct(s.accuracy)}</b></span>
                {s.wrong > 0 && <span>ยังพลาด <b>{num(s.wrong)}</b></span>}
              </span>
            </div>
          )}
          <div className="row-gap">
            <button type="button" className="btn btn-ink btn-lg" onClick={() => quick(10)} disabled={!!busy}>
              {busy === 'practice10' ? <>กำลังเตรียม<span className="spinner" aria-hidden="true" /></> : <>ฝึก 10 ข้อ <Icon name="arrowRight" /></>}
            </button>
            <Link to={withQuery('/practice', { mode: 'mock', d: [card.id] })} className="btn btn-glass glass btn-lg">สอบจำลองหมวดนี้</Link>
            <Link to={withQuery('/bank', { d: card.id })} className="btn btn-ghost btn-lg">เปิดในคลัง</Link>
          </div>
          <p className="hint">{s.seen >= card.count ? 'ทำครบทั้งหมวดแล้ว ชุดต่อไปจะสุ่มจากทุกข้อ' : 'ฝึก 10 ข้อจะเลือกข้อที่ยังไม่เคยทำให้ก่อน'}</p>
        </div>
      </header>

      <div className="dgrid2" style={showTopics ? undefined : ONE_COLUMN}>
        {showTopics && (
          <section className="panel glass" aria-labelledby="topics-h">
            <h2 id="topics-h" className="block-h">หัวข้อที่มีข้อสอบมากที่สุด</h2>
            {catalog.status === 'error' ? <LoadError what="โหลดหัวข้อ" onRetry={retry} /> : catalog.status !== 'ready' ? <p className="hint">กำลังโหลด…</p> : (
              <ul className="topics">
                {topics.map((t) => (
                  <li key={t.keys[0]}>
                    <Link to={withQuery('/practice', { d: [card.id], t: t.keys })} className="topic">
                      <span className="topic-name">{t.label}</span>
                      <span className="topic-n">{num(t.n)}</span>
                      <Icon name="arrowRight" size={16} />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}
        <section className="panel glass" aria-labelledby="from-h">
          <h2 id="from-h" className="block-h">มาจากรายวิชา</h2>
          {!showTopics && catalog.status === 'error' && <LoadError what="โหลดรายวิชา" onRetry={retry} />}
          {detail && (
            <ul className="from">
              {detail.subjects.map((x) => (
                <li key={x.id}><span>{x.id === 'vca' ? 'แนวข้อสอบ VCA' : subjectName(x.id)}</span><b>{num(x.n)}</b></li>
              ))}
            </ul>
          )}
          {docShelves.length > 0 && (
            <>
              <h2 className="block-h block-h-2">เอกสาร VCA ของหมวดนี้</h2>
              <ul className="from">
                {docShelves.map((x) => (
                  <li key={x.id}><Link to={withQuery('/library', { shelf: x.id })} className="text-link">{x.th}</Link><b>{num(x.count)} รายการ</b></li>
                ))}
              </ul>
            </>
          )}
          {shelves.status === 'error' && <LoadError what="โหลดเอกสาร" onRetry={retry} />}
        </section>
      </div>

      <nav className="walk" aria-label="หมวดถัดไปและก่อนหน้า">
        {prev ? <Link to={`/d/${prev.id}`} className="walk-a"><Icon name="arrowLeft" /><span><small>{plateNo(prev.plate)}</small>{prev.th}</span></Link> : <span />}
        {next ? <Link to={`/d/${next.id}`} className="walk-a walk-next"><span><small>{plateNo(next.plate)}</small>{next.th}</span><Icon name="arrowRight" /></Link> : <span />}
      </nav>
      {sheet}
    </div>
  );
}
