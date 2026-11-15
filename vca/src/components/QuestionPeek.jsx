// The question a thread is about, as the bank shows it: plate, number, stem and options, with
// its answer and explanation one tap away. It loads the one shard that holds the question (a few
// KB), found through its domain's index.

import { useEffect, useState } from 'react';
import { RichText } from '@vetmock/lib/richtext.jsx';
import { Link } from './Link.jsx';
import { Icon } from './Icon.jsx';
import { Explain } from './Question.jsx';
import { CARD_BY_ID, loadQuestionByNumber } from '../lib/bank.js';
import { LETTERS, plateNo } from '../lib/format.js';
import { withQuery } from '../router.js';
import { twinUrl } from '../lib/twin.js';

/**
 * @param {{ no: string|number, domain: string, twin?: boolean, missing?: any }} props
 *   twin: also link the same question in the VetMock app; missing: what to show when it is not there
 */
export function QuestionPeek({ no, domain, twin = false, missing = null }) {
  const card = CARD_BY_ID[domain];
  const [q, setQ] = useState(undefined);
  const [open, setOpen] = useState(false);
  // Not there (null) and could not be loaded (failed) are different: a student who is offline
  // must not read that the question was taken out of the bank.
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!card || !no) { setQ(null); return undefined; }
    let live = true;
    setQ(undefined);
    setFailed(false);
    loadQuestionByNumber(domain, no)
      .then((found) => { if (live) setQ(found); })
      .catch(() => { if (live) setFailed(true); });
    return () => { live = false; };
  }, [domain, no, attempt]); // eslint-disable-line react-hooks/exhaustive-deps

  if (failed) {
    return (
      <div className="peek peek-failed" role="status">
        <p>เปิดข้อนี้ไม่ได้ ตอนนี้อาจไม่ได้ต่อเน็ต</p>
        <button type="button" className="btn btn-ghost btn-sm" onClick={() => setAttempt((n) => n + 1)}>ลองอีกครั้ง</button>
      </div>
    );
  }
  if (!card || q === null) return missing;
  if (q === undefined) return <div className="peek skel-card" aria-busy="true"><span className="skel skel-line w40" /><span className="skel skel-line w80" /></div>;
  return (
    <aside className="peek" aria-label={`ข้อ No. ${q.id}`}>
      <div className="peek-top">
        <span className="q-plate"><span className="q-plate-no">{plateNo(card.plate)}</span>{card.th}</span>
        <span className="peek-no">No. {q.id}</span>
      </div>
      <p className="peek-stem"><RichText text={q.q} /></p>
      {q.image && <figure className="q-fig"><img src={q.image} alt={q.imageAlt || 'ภาพประกอบโจทย์'} loading="lazy" decoding="async" /></figure>}
      <ol className="peek-opts">
        {q.options.map((o, i) => (
          <li key={i} className={open && i === q.answer ? 'right' : ''}>
            <span className="bk-key" aria-hidden="true">{LETTERS[i]}</span>
            <span><RichText text={o} /></span>
            {open && i === q.answer && <span className="sr">คำตอบที่ถูก</span>}
          </li>
        ))}
      </ol>
      {open && q.explain && <p className="peek-why"><Explain text={q.explain} /></p>}
      <div className="peek-go">
        <button type="button" className="btn btn-ghost btn-sm" onClick={() => setOpen((v) => !v)} aria-expanded={open}>{open ? 'ซ่อนเฉลย' : 'ดูเฉลย'}</button>
        <Link to={withQuery('/bank', { q: q.id, d: domain })} className="text-link">เปิดในคลัง <Icon name="arrowRight" size={16} /></Link>
        {twin && twinUrl(q) && <a href={twinUrl(q)} className="text-link">เปิดข้อนี้ใน VetMock <Icon name="arrowUpRight" size={14} /></a>}
      </div>
    </aside>
  );
}
