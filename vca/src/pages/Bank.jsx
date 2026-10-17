// The bank, browsable: search every stem, option and explanation; open any question to see
// its answer and where it came from. Reading, not quizzing, so options keep their source order.

import { useDeferredValue, useEffect, useMemo, useRef, useState } from 'react';
import { RichText } from '@vetmock/lib/richtext.jsx';
import { Link } from '../components/Link.jsx';
import { Icon } from '../components/Icon.jsx';
import { TypingHint } from '../components/TypingHint.jsx';
import { KindBadge } from '../components/bits.jsx';
import { Provenance } from '../components/Question.jsx';
import { BANK, CARD_BY_ID, DOMAIN_CARDS, loadDomains } from '../lib/bank.js';
import { searchQuestions } from '../lib/search.js';
import { navigate, withQuery } from '../router.js';
import { useTitle, useTuck } from '../lib/hooks.js';
import { LETTERS, num, plateNo } from '../lib/format.js';

const PAGE = 30;

const BANK_EXAMPLES = ['Leptospira', 'พิษสุนัขบ้า', 'PCV2', 'ยาสลบ'];

function BankItem({ q, query, showAnswers }) {
  const [open, setOpen] = useState(false);
  const reveal = showAnswers || open;
  const card = CARD_BY_ID[q.domain];
  return (
    <li className="bk" data-reveal>
      <div className="bk-top">
        <span className="q-plate"><span className="q-plate-no">{plateNo(card.plate)}</span>{card.th}</span>
        <KindBadge kind={q.kind} />
        <span className="bk-no">No. {q.id}</span>
      </div>
      <p className="bk-stem"><RichText text={q.q} highlight={query} /></p>
      {q.image && <figure className="q-fig"><img src={q.image} alt={q.imageAlt || 'ภาพประกอบโจทย์'} loading="lazy" decoding="async" /></figure>}
      <ol className="bk-opts">
        {q.options.map((o, i) => (
          <li key={i} className={reveal && i === q.answer ? 'right' : ''}>
            <span className="bk-key" aria-hidden="true">{LETTERS[i]}</span>
            <span><RichText text={o} highlight={query} /></span>
            {reveal && i === q.answer && <span className="sr">คำตอบที่ถูก</span>}
          </li>
        ))}
      </ol>
      {reveal ? (
        <div className="bk-why">
          {q.explain && <p><RichText text={q.explain} highlight={query} /></p>}
          <Provenance q={q} />
        </div>
      ) : (
        <button type="button" className="btn btn-ghost btn-sm" onClick={() => setOpen(true)}>ดูเฉลยและคำอธิบาย</button>
      )}
    </li>
  );
}

export default function Bank({ route }) {
  useTitle('คลังข้อสอบ');
  const toolsRef = useRef(null);
  useTuck(toolsRef);
  const initialQ = route.query.get('q') || '';
  const [query, setQuery] = useState(initialQ);
  const [domain, setDomain] = useState(() => (CARD_BY_ID[route.query.get('d')] ? route.query.get('d') : 'all'));
  const [source, setSource] = useState(() => (['vca', 'paper'].includes(route.query.get('src')) ? route.query.get('src') : 'all'));
  const [showAnswers, setShowAnswers] = useState(false);
  const [limit, setLimit] = useState(PAGE);
  const [state, setState] = useState({ status: 'loading', done: 0, total: 0, questions: [] });
  const [attempt, setAttempt] = useState(0);
  const deferred = useDeferredValue(query);
  const cache = useRef(new WeakMap());

  const ids = domain === 'all' ? DOMAIN_CARDS.map((d) => d.id) : [domain];
  const idsKey = ids.join(',');
  useEffect(() => {
    let live = true;
    setState((s) => ({ ...s, status: 'loading', done: 0, total: ids.length }));
    loadDomains(ids, (done, total) => { if (live) setState((s) => ({ ...s, done, total })); })
      .then((questions) => { if (live) setState({ status: 'ready', done: ids.length, total: ids.length, questions }); },
        () => { if (live) setState((s) => ({ ...s, status: 'error' })); });
    return () => { live = false; };
  }, [idsKey, attempt]); // eslint-disable-line react-hooks/exhaustive-deps

  // The address keeps the search, so a result can be sent to a friend or found again.
  useEffect(() => {
    const t = setTimeout(() => navigate(withQuery('/bank', { q: deferred.trim(), d: domain === 'all' ? null : domain, src: source === 'all' ? null : source }), { replace: true }), 350);
    return () => clearTimeout(t);
  }, [deferred, domain, source]);
  useEffect(() => { setLimit(PAGE); }, [deferred, domain, source]);

  const results = useMemo(() => {
    let list = state.questions;
    if (source === 'vca') list = list.filter((q) => q.kind === 'vca');
    if (source === 'paper') list = list.filter((q) => q.kind === 'vca' || q.kind === 'paper');
    return searchQuestions(list, deferred, cache.current);
  }, [state.questions, source, deferred]);

  const total = domain === 'all' ? BANK.total : CARD_BY_ID[domain].count;

  return (
    <div className="wrap bank">
      <header className="page-head">
        <p className="kicker">The bank</p>
        <h1 className="page-h">คลังข้อสอบ</h1>
        <p className="page-p">ค้นทุกโจทย์ ตัวเลือก และคำอธิบายใน {num(BANK.total)} ข้อ พิมพ์ได้ทั้งไทยและอังกฤษ เว้นวรรคเพื่อค้นหลายคำพร้อมกัน</p>
      </header>

      <div className="bank-tools glass" ref={toolsRef}>
        <label className="search">
          <Icon name="search" />
          <span className="sr">ค้นหาในคลังข้อสอบ</span>
          <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="เช่น Leptospira, พิษสุนัขบ้า, PCV2, ยาสลบ" autoComplete="off" enterKeyHint="search" />
          {/* Each example finds questions in the bank (11, 34, 18 and 48 on 18 Oct). */}
          <TypingHint examples={BANK_EXAMPLES} />
        </label>
        <div className="bank-filters">
          <label className="select">
            <span className="sr">หมวด</span>
            <select value={domain} onChange={(e) => setDomain(e.target.value)}>
              <option value="all">ทุกหมวด ({num(BANK.total)})</option>
              {DOMAIN_CARDS.map((d) => <option key={d.id} value={d.id}>{d.th} ({num(d.count)})</option>)}
            </select>
            <Icon name="chevronDown" size={18} />
          </label>
          <label className="select">
            <span className="sr">ที่มา</span>
            <select value={source} onChange={(e) => setSource(e.target.value)}>
              <option value="all">ทุกที่มา</option>
              <option value="paper">ข้อสอบเก่าและแนว VCA</option>
              <option value="vca">แนว VCA เท่านั้น</option>
            </select>
            <Icon name="chevronDown" size={18} />
          </label>
          <button type="button" className="chip" aria-pressed={showAnswers} onClick={() => setShowAnswers((v) => !v)}>
            <Icon name="eye" size={18} />แสดงเฉลยทุกข้อ
          </button>
        </div>
      </div>

      <div className="bank-status" role="status" aria-live="polite">
        {state.status === 'loading' && <><span className="spinner" aria-hidden="true" />กำลังโหลดคลัง {state.total > 1 ? `${state.done}/${state.total} หมวด` : ''}</>}
        {state.status === 'error' && <span className="notice notice-error"><Icon name="info" />โหลดคลังไม่สำเร็จ <button type="button" className="text-link" onClick={() => setAttempt((n) => n + 1)}>ลองอีกครั้ง</button></span>}
        {state.status === 'ready' && (deferred.trim()
          ? <>พบ <b>{num(results.length)}</b> ข้อ จาก {num(total)} ข้อ</>
          : <>{num(results.length)} ข้อ{domain !== 'all' && <Link to={`/d/${domain}`} className="text-link status-link">ไปหน้าหมวดนี้ <Icon name="arrowRight" size={14} /></Link>}</>)}
      </div>

      {/* Holds the list's place while the bank loads, so the footer does not show and then jump. */}
      {state.status === 'loading' && <div className="bk-wait" aria-hidden="true" />}

      {state.status === 'ready' && results.length === 0 && (
        <div className="empty">
          <h2>ไม่พบข้อที่ตรงกับคำค้น</h2>
          <p>ลองคำที่สั้นลง สะกดแบบอื่น หรือเลือกทุกหมวด</p>
        </div>
      )}

      {state.status === 'ready' && results.length > 0 && (
        <>
          <ol className="bk-list">
            {results.slice(0, limit).map((q) => <BankItem key={q.key} q={q} query={deferred.trim()} showAnswers={showAnswers} />)}
          </ol>
          {results.length > limit && (
            <div className="more">
              <button type="button" className="btn btn-ghost" onClick={() => setLimit((n) => n + PAGE)}>แสดงอีก {num(Math.min(PAGE, results.length - limit))} ข้อ</button>
              <span className="hint">แสดง {num(limit)} จาก {num(results.length)}</span>
            </div>
          )}
        </>
      )}
    </div>
  );
}
