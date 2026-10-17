// The question a thread is about, as the bank shows it: plate, number, stem and options, with
// its answer and explanation one tap away. It loads that one domain's file, which the practice
// site has usually cached already.

import { useEffect, useState } from 'react';
import { RichText } from '@vetmock/lib/richtext.jsx';
import { Link } from '../../components/Link.jsx';
import { Icon } from '../../components/Icon.jsx';
import { CARD_BY_ID, loadDomain } from '../../lib/bank.js';
import { LETTERS, plateNo } from '../../lib/format.js';
import { withQuery } from '../../router.js';

export function QuestionPeek({ no, domain }) {
  const card = CARD_BY_ID[domain];
  const [q, setQ] = useState(undefined);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!card || !no) { setQ(null); return undefined; }
    let live = true;
    setQ(undefined);
    loadDomain(domain).then((list) => { if (live) setQ(list.find((x) => String(x.id) === String(no)) || null); }).catch(() => { if (live) setQ(null); });
    return () => { live = false; };
  }, [domain, no]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!card || q === null) return null;
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
      {open && q.explain && <p className="peek-why"><RichText text={q.explain} /></p>}
      <div className="peek-go">
        <button type="button" className="btn btn-ghost btn-sm" onClick={() => setOpen((v) => !v)} aria-expanded={open}>{open ? 'ซ่อนเฉลย' : 'ดูเฉลย'}</button>
        <Link to={withQuery('/bank', { q: q.id, d: domain })} className="text-link">เปิดในคลัง <Icon name="arrowRight" size={16} /></Link>
      </div>
    </aside>
  );
}
