// The set builder: one page, every choice visible, a summary that always says what Start will
// do. The URL carries the choices (?mode=mock&d=swine,equine&n=50), so a set can be shared or
// opened again from a domain page.

import { useMemo, useState } from 'react';
import { Link } from '../components/Link.jsx';
import { Icon } from '../components/Icon.jsx';
import { Seg, Words } from '../components/bits.jsx';
import { useStartGuard } from '../components/StartGuard.jsx';
import { BANK, CARD_BY_ID, DOMAIN_CARDS } from '../lib/bank.js';
import { ALL_DOMAINS, MOCK_SIZES, PER_QUESTION, PRACTICE_SIZES, emptyReason, startSet } from '../lib/start.js';
import { EXAM_SECONDS, FORMAT } from '../data/exam.js';
import { navigate, withQuery } from '../router.js';
import { useActiveSession, useProgress, useTitle } from '../lib/hooks.js';
import { statsFor } from '../lib/progress.js';
import { duration, num } from '../lib/format.js';

const list = (v) => (v ? v.split(',').map((s) => s.trim()).filter(Boolean) : []);

export default function Practice({ route }) {
  const q = route.query;
  const mode = q.get('mode') === 'mock' ? 'mock' : 'practice';
  useTitle(mode === 'mock' ? 'ตั้งชุดสอบจำลอง' : 'ตั้งชุดฝึก');
  const progress = useProgress();
  const active = useActiveSession();

  const [domains, setDomains] = useState(() => list(q.get('d')).filter((id) => CARD_BY_ID[id]));
  const sizes = mode === 'mock' ? MOCK_SIZES : PRACTICE_SIZES;
  const [pickedSize, setSize] = useState(() => Number(q.get('n')));
  // Switching between practice and mock changes the size options; an off-list size falls back.
  const size = sizes.includes(pickedSize) ? pickedSize : mode === 'mock' ? 50 : 20;
  // Only a pace the address names; with none, the exam's own (Number(null) would read as untimed).
  const [perQ, setPerQ] = useState(() => (q.has('s') && PER_QUESTION.includes(Number(q.get('s'))) ? Number(q.get('s')) : EXAM_SECONDS));
  const [mix, setMix] = useState(() => (q.get('mix') === 'bank' ? 'bank' : 'exam'));
  const [source, setSource] = useState(() => (['vca', 'paper'].includes(q.get('src')) ? q.get('src') : 'all'));
  const [status, setStatus] = useState(() => (['unseen', 'wrong'].includes(q.get('st')) ? q.get('st') : 'all'));
  const topics = list(q.get('t'));
  const [busy, setBusy] = useState(null); // { done, total } while loading
  const [error, setError] = useState(null);
  const { guard, sheet } = useStartGuard();

  // Keep the URL in step, without a history entry per tap.
  const sync = (next) => {
    const params = { mode: mode === 'mock' ? 'mock' : null, d: domains, n: size, s: mode === 'mock' ? perQ : null, mix: mix === 'bank' ? 'bank' : null, src: source === 'all' ? null : source, st: status === 'all' ? null : status, t: topics, ...next };
    navigate(withQuery('/practice', params), { replace: true });
  };
  const setMode = (m) => navigate(withQuery('/practice', { mode: m === 'mock' ? 'mock' : null, d: domains, mix: mix === 'bank' ? 'bank' : null, src: source === 'all' ? null : source, st: status === 'all' ? null : status, t: topics }), { replace: true });

  const chosen = domains.length ? domains : ALL_DOMAINS;
  const toggle = (id) => {
    const next = domains.includes(id) ? domains.filter((x) => x !== id) : [...domains, id];
    const clean = next.length === ALL_DOMAINS.length ? [] : next;
    setDomains(clean);
    sync({ d: clean });
  };

  // How many questions the filters leave. Exact where the index or the progress record can
  // say; with both a source and a status filter it is an upper bound, and the draw is exact.
  const pool = useMemo(() => {
    let total = 0; let exact = true;
    for (const id of chosen) {
      const card = CARD_BY_ID[id];
      const bySource = source === 'vca' ? card.kinds.vca : source === 'paper' ? card.kinds.vca + card.kinds.paper : card.count;
      const s = statsFor(progress, id);
      let n = bySource;
      if (status === 'unseen') { n = source === 'all' ? card.count - s.seen : Math.min(bySource, card.count - s.seen); exact = exact && source === 'all'; }
      if (status === 'wrong') { n = source === 'all' ? s.wrong : Math.min(bySource, s.wrong); exact = exact && source === 'all'; }
      total += Math.max(0, n);
    }
    if (topics.length) exact = false;
    return { total, exact };
  }, [chosen, source, status, progress, topics.length]);

  const count = Math.min(size, pool.total);
  const why = emptyReason({ status, narrowed: domains.length > 0 || source !== 'all' || topics.length > 0, count });
  // A full part as the centre sets it: 200 questions at its pace, drawn as the exam asks.
  const real = count === FORMAT.perPart && perQ === EXAM_SECONDS && mix === 'exam' && !domains.length;
  const minutes = mode === 'mock' && perQ ? (count * perQ) / 60 : count;

  const go = async () => {
    setError(null);
    setBusy({ done: 0, total: 0 });
    try {
      const res = await startSet({
        mode, domains, size, source, status, topics, mix, perQuestion: perQ,
        onProgress: (done, total) => setBusy({ done, total }),
      });
      if (!res.ok) { setError('empty'); setBusy(null); return; }
      navigate('/session');
    } catch {
      setError('load');
      setBusy(null);
    }
  };
  const onStart = () => guard(go);

  const familyRows = BANK.families.map((f) => ({ f, cards: DOMAIN_CARDS.filter((d) => d.family === f.id) }));

  return (
    <div className="wrap builder">
      <header className="page-head">
        <p className="kicker">{mode === 'mock' ? 'Mock exam' : 'Practice set'}</p>
        <h1 className="page-h">{mode === 'mock' ? 'ตั้งชุดสอบจำลอง' : 'ตั้งชุดฝึก'}</h1>
        <p className="page-p">{mode === 'mock'
          ? 'จับเวลาทั้งชุดเหมือนในห้องสอบ เฉลยและคะแนนรายหมวดวิชาจะเปิดหลังส่ง'
          : 'ตอบแล้วเห็นเฉลยกับเหตุผลทันที ครั้งหน้าเลือกเฉพาะข้อที่ยังไม่เคยทำหรือข้อที่เคยผิดได้'}</p>
      </header>

      <div className="builder-grid">
        <div className="builder-form glass">
          <Seg
            name="mode" label="วิธีซ้อม" value={mode} onChange={setMode} wide
            options={[
              { value: 'practice', label: 'ฝึกทีละข้อ', hint: 'เฉลยทันทีหลังตอบ' },
              { value: 'mock', label: 'สอบจำลอง', hint: 'จับเวลา เฉลยหลังส่ง' },
            ]}
          />

          <fieldset className="pick">
            <legend className="label">หมวดวิชา <span className="label-note">{domains.length ? `เลือกไว้ ${domains.length} หมวดวิชา` : 'ทุกหมวดวิชา'}</span></legend>
            <div className="pick-all">
              <button type="button" className="chip" aria-pressed={!domains.length} onClick={() => { setDomains([]); sync({ d: [] }); }}>
                ทุกหมวดวิชา<span className="chip-n">{num(BANK.total)}</span>
              </button>
            </div>
            {familyRows.map(({ f, cards }) => (
              <div key={f.id} className="pick-family">
                <span className="pick-fam"><span className="pick-num">{f.numeral}</span><Words text={f.thw} /></span>
                <div className="pick-chips">
                  {cards.map((d) => (
                    <button key={d.id} type="button" className="chip" aria-pressed={domains.includes(d.id)} onClick={() => toggle(d.id)}>
                      {d.th}<span className="chip-n">{num(d.count)}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </fieldset>

          {domains.length !== 1 && (
            <Seg
              name="mix" label="สัดส่วนหมวดวิชา" value={mix} onChange={(v) => { setMix(v); sync({ mix: v === 'bank' ? 'bank' : null }); }}
              options={[
                { value: 'exam', label: 'ตามที่ออกสอบ', hint: 'สถิติปี 66–68' },
                { value: 'bank', label: 'ตามจำนวนในคลัง', hint: 'หมวดวิชาใหญ่ได้มาก' },
              ]}
            />
          )}

          <Seg
            name="size" label="จำนวนข้อ" value={size} onChange={(v) => { setSize(v); sync({ n: v }); }}
            options={sizes.map((n) => ({ value: n, label: `${n} ข้อ`, disabled: pool.exact && n > pool.total && n !== sizes[0] }))}
          />

          {mode === 'mock' && (
            <Seg
              name="perq" label="เวลาต่อข้อ" value={perQ} onChange={(v) => { setPerQ(v); sync({ s: v }); }}
              options={PER_QUESTION.map((s) => ({ value: s, label: s ? `${s} วินาที` : 'ไม่จับเวลา', hint: s === EXAM_SECONDS ? 'เท่าสนามจริง' : s ? `ทั้งชุด ${duration(size * s * 1000)}` : 'ทำได้เรื่อย ๆ' }))}
            />
          )}

          <Seg
            name="source" label="ที่มาของข้อ" value={source} onChange={(v) => { setSource(v); sync({ src: v === 'all' ? null : v }); }}
            options={[
              { value: 'all', label: 'ทุกที่มา' },
              { value: 'paper', label: 'ข้อสอบเก่าและแนว VCA' },
              { value: 'vca', label: 'แนว VCA เท่านั้น' },
            ]}
          />

          <Seg
            name="status" label="เลือกจาก" value={status} onChange={(v) => { setStatus(v); sync({ st: v === 'all' ? null : v }); }}
            options={[
              { value: 'all', label: 'ทุกข้อ' },
              { value: 'unseen', label: 'ข้อที่ยังไม่เคยทำ' },
              { value: 'wrong', label: 'ข้อที่เคยตอบผิด' },
            ]}
          />

          {topics.length > 0 && (
            <div className="topic-note">
              <span className="label">เฉพาะหัวข้อ</span>
              <button type="button" className="chip on" onClick={() => sync({ t: [] })} aria-label="เอาตัวกรองหัวข้อออก">
                {topics.length} หัวข้อจากหน้าหมวดวิชา<Icon name="x" size={16} />
              </button>
            </div>
          )}
        </div>

        <aside className="builder-sum glass" aria-label="สรุปชุดนี้">
          <p className="sum-k">{mode === 'mock' ? 'ชุดสอบจำลอง' : 'ชุดฝึก'}</p>
          <p className="sum-n">{num(count)}<small>ข้อ</small></p>
          {mode === 'mock' && real && <p className="sum-real"><Icon name="target" size={16} />ยาวและเร็วเท่าข้อสอบจริง 1 หมวด</p>}
          <ul className="sum-list">
            <li><span>หมวดวิชา</span><b>{domains.length ? (domains.length <= 2 ? domains.map((id) => CARD_BY_ID[id].th).join('และ') : `${domains.length} หมวดวิชา`) : `ทั้ง ${ALL_DOMAINS.length} หมวดวิชา`}</b></li>
            <li><span>คัดจาก</span><b>{pool.exact ? '' : 'ไม่เกิน '}{num(pool.total)} ข้อ</b></li>
            <li><span>เวลา</span><b>{mode === 'mock' && !perQ ? 'ไม่จับเวลา' : `ราว ${duration(minutes * 60000)}`}</b></li>
          </ul>
          {why && <p className="sum-why" role="status"><Icon name="info" size={16} />{why}</p>}
          {error === 'empty' && <p className="notice"><Icon name="info" />ยังไม่มีข้อที่ตรงกับทุกตัวเลือก ลองเปลี่ยนเป็นทุกข้อหรือเพิ่มหมวดวิชา</p>}
          {error === 'load' && <p className="notice notice-error"><Icon name="info" />โหลดข้อสอบไม่สำเร็จ ตรวจการเชื่อมต่อแล้วลองอีกครั้ง</p>}
          <button type="button" className="btn btn-ink btn-lg btn-block" onClick={onStart} disabled={!!busy || count === 0}>
            {busy ? <>กำลังเตรียม {busy.total > 1 ? `${busy.done}/${busy.total} ข้อ` : ''}<span className="spinner" aria-hidden="true" /></> : <>{mode === 'mock' ? 'เริ่มสอบ' : 'เริ่มฝึก'} {num(count)} ข้อ <Icon name="arrowRight" /></>}
          </button>
          {active && <p className="sum-note">มีชุดที่ทำค้างไว้ <Link to="/session" className="text-link">ทำต่อ</Link></p>}
        </aside>
      </div>

      {sheet}
    </div>
  );
}
