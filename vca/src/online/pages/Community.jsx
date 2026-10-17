// The board: questions about questions, tips, and how the exam went, open for anyone to read.
// Filters live in the address (?kind= &d= &q=), so a filtered board can be shared; ?q= is a
// question's catalogue number, which is where "talk this over" from a question lands.

import { useEffect, useMemo, useState } from 'react';
import { Link } from '../../components/Link.jsx';
import { Icon } from '../../components/Icon.jsx';
import { useTitle } from '../../lib/hooks.js';
import { CARD_BY_ID, DOMAIN_CARDS } from '../../lib/bank.js';
import { navigate, withQuery } from '../../router.js';
import { JoinPrompt, KindSeg, Soon } from '../ui/bits.jsx';
import { PostCard } from '../ui/PostCard.jsx';
import { askJoin } from '../ui/AccountButton.jsx';
import { QuestionPeek } from '../ui/QuestionPeek.jsx';
import { MODE } from '../config.js';
import { ensureAccount, getBackend, useAccount } from '../account.js';
import '../community.css';

export default function Community({ route }) {
  useTitle('ชุมชน');
  const account = useAccount();
  const kind = route.query.get('kind') || '';
  const domain = route.query.get('d') || '';
  const questionNo = Number(route.query.get('q')) || null;
  const [feed, setFeed] = useState({ status: 'loading', posts: [], next: null });
  const [moreBusy, setMoreBusy] = useState(false);
  const filters = useMemo(() => ({ kind, domain, questionNo }), [kind, domain, questionNo]);

  useEffect(() => { ensureAccount(); }, []);
  useEffect(() => {
    if (MODE === 'off') return undefined;
    let live = true;
    setFeed((f) => ({ ...f, status: 'loading' }));
    getBackend().then((b) => b.board.list({ kind: kind || null, domain: domain || null, questionNo }))
      .then((r) => { if (live) setFeed({ status: 'ready', posts: r.posts, next: r.next }); })
      .catch(() => { if (live) setFeed({ status: 'error', posts: [], next: null }); });
    return () => { live = false; };
  }, [filters]); // eslint-disable-line react-hooks/exhaustive-deps

  if (MODE === 'off') return <Soon />;
  const setFilter = (patch) => navigate(withQuery('/community', { kind, d: domain, q: questionNo, ...patch }), { replace: true });
  const more = async () => {
    setMoreBusy(true);
    try {
      const b = await getBackend();
      const r = await b.board.list({ kind: kind || null, domain: domain || null, questionNo, before: feed.next });
      setFeed((f) => ({ ...f, posts: [...f.posts, ...r.posts.filter((p) => !f.posts.some((x) => x.id === p.id))], next: r.next }));
    } catch { /* the button stays for another try */ }
    setMoreBusy(false);
  };
  const canPost = account.status === 'in' && account.profile;
  const composeHref = withQuery('/community/new', { q: questionNo, d: domain, kind });

  return (
    <div className="wrap board">
      <header className="page-head board-head">
        <div>
          <p className="kicker">The commons</p>
          <h1 className="page-h">ชุมชน</h1>
          <p className="page-p">ถามข้อที่ติด แชร์เทคนิค เล่าประสบการณ์สอบ กับเพื่อนที่สอบ VCA รอบเดียวกัน</p>
        </div>
        <div className="board-go">
          {canPost && <Link to={composeHref} className="btn btn-ink"><Icon name="plus" size={18} />ตั้งกระทู้</Link>}
          <Link to="/chat" className="btn btn-ghost"><Icon name="chat" size={18} />แชท</Link>
        </div>
      </header>

      {!canPost && <JoinPrompt what="ตั้งกระทู้และตอบ" />}

      <div className="board-filters">
        <KindSeg value={kind} onChange={(v) => setFilter({ kind: v })} withAll name="board-kind" />
        <label className="select">
          <span className="sr">หมวด</span>
          <select value={domain} onChange={(e) => setFilter({ d: e.target.value })}>
            <option value="">ทุกหมวด</option>
            {DOMAIN_CARDS.map((d) => <option key={d.id} value={d.id}>{d.th}</option>)}
          </select>
          <Icon name="chevronDown" size={18} />
        </label>
        {questionNo && (
          <button type="button" className="chip on" onClick={() => setFilter({ q: '' })} aria-label={`เลิกกรองข้อ No. ${questionNo}`}>
            No. {questionNo}<Icon name="x" size={16} />
          </button>
        )}
      </div>

      {/* The domains the student follows (their profile), one tap each. */}
      {account.profile?.focus?.length > 0 && !questionNo && (
        <div className="board-mine" role="group" aria-label="หมวดของคุณ">
          <span className="board-mine-k">หมวดของคุณ</span>
          {account.profile.focus.filter((d) => CARD_BY_ID[d]).map((d) => (
            <button key={d} type="button" className="chip" aria-pressed={domain === d} onClick={() => setFilter({ d: domain === d ? '' : d })}>{CARD_BY_ID[d].th}</button>
          ))}
        </div>
      )}

      {questionNo && domain && <QuestionPeek no={questionNo} domain={domain} />}
      {questionNo && canPost && (
        <p className="board-about-q">
          <span>กระทู้เกี่ยวกับข้อ No. {questionNo}</span>
          <Link to={withQuery('/community/new', { q: questionNo, d: domain })} className="text-link">ตั้งกระทู้เกี่ยวกับข้อนี้ <Icon name="arrowRight" size={16} /></Link>
        </p>
      )}

      {feed.status === 'loading' && feed.posts.length === 0 && (
        <div className="posts" aria-busy="true">{[0, 1, 2].map((i) => <div key={i} className="post-card skel-card"><span className="skel skel-line w60" /><span className="skel skel-line w80" /><span className="skel skel-line w40" /></div>)}</div>
      )}
      {feed.status === 'error' && <p className="notice notice-error" role="alert"><Icon name="info" size={18} />โหลดกระทู้ไม่สำเร็จ ลองรีเฟรชอีกครั้ง</p>}
      {feed.status === 'ready' && feed.posts.length === 0 && (
        <div className="empty">
          {/* "In this filter" only when a filter is set: an empty board with none is just empty. */}
          <p className="empty-h">{questionNo ? 'ยังไม่มีกระทู้เกี่ยวกับข้อนี้' : kind || domain ? 'ยังไม่มีกระทู้ในตัวกรองนี้' : 'ยังไม่มีกระทู้'}</p>
          <p className="hint">เปิดประเด็นแรกได้เลย</p>
          {canPost ? (
            <Link to={composeHref} className="btn btn-ink"><Icon name="plus" size={18} />ตั้งกระทู้แรก</Link>
          ) : account.status !== 'idle' && account.status !== 'loading' && (
            <button type="button" className="btn btn-ink" onClick={askJoin}><Icon name="plus" size={18} />ตั้งกระทู้แรก</button>
          )}
        </div>
      )}
      <ol className="posts">
        {feed.posts.map((p, i) => <PostCard key={p.id} post={p} i={i} />)}
      </ol>
      {feed.next && (
        <div className="more">
          <button type="button" className="btn btn-ghost" onClick={more} disabled={moreBusy}>
            {moreBusy && <span className="spinner" aria-hidden="true" />}ดูกระทู้ก่อนหน้า
          </button>
        </div>
      )}
    </div>
  );
}
