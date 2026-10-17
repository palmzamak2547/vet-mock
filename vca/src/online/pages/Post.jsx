// One thread: the post, its likes, and its replies, which arrive as they are written. Its writer
// may edit or remove it; anyone signed in may reply, like, or report.

import { useCallback, useEffect, useState } from 'react';
import { Link } from '../../components/Link.jsx';
import { Icon } from '../../components/Icon.jsx';
import { ShareButton } from '../../components/Share.jsx';
import { useTitle } from '../../lib/hooks.js';
import { navigate, withQuery } from '../../router.js';
import { Avatar, Byline } from '../ui/Avatar.jsx';
import { JoinPrompt, PostChips, ReportSheet, Soon } from '../ui/bits.jsx';
import { QuestionPeek } from '../ui/QuestionPeek.jsx';
import { askJoin } from '../ui/AccountButton.jsx';
import { MODE } from '../config.js';
import { ensureAccount, getBackend, useAccount } from '../account.js';
import { ago, problemText } from '../shapes.js';
import '../community.css';

function Paragraphs({ text }) {
  return String(text).split(/\n{2,}/).map((p, i) => <p key={i}>{p.split('\n').map((line, j) => (j ? [<br key={j} />, line] : line))}</p>);
}

function Comment({ c, acts, child = false }) {
  const { me, canWrite, liked } = acts;
  return (
    <li className={`cmt${child ? ' cmt-child' : ''}${c.hidden ? ' is-hidden' : ''}`}>
      <Link to={c.author.handle ? `/u/${c.author.handle}` : '/community'} className="cmt-av" tabIndex={-1} aria-hidden="true"><Avatar profile={c.author} size={child ? 26 : 32} /></Link>
      <div className="cmt-main">
        <span className="cmt-top">
          {c.author.handle ? <Link to={`/u/${c.author.handle}`} className="cmt-who"><Byline profile={c.author} /></Link> : <Byline profile={c.author} />}
          <span className="post-when">{ago(c.createdAt)}{c.editedAt ? ' แก้ไขแล้ว' : ''}</span>
        </span>
        <div className="cmt-body"><Paragraphs text={c.body} /></div>
        {c.hidden && <p className="hint">ซ่อนไว้ระหว่างรอผู้ดูแลตรวจ เห็นได้เฉพาะคุณ</p>}
        <span className="cmt-acts">
          <button type="button" className={`act${liked.has(c.id) ? ' on' : ''}`} onClick={() => acts.like(c.id)} aria-pressed={liked.has(c.id)} aria-label={`ถูกใจ${c.likes ? ` ${c.likes} คน` : ''}`}><Icon name="heart" size={16} />{c.likes || ''}</button>
          {!child && canWrite && <button type="button" className="act" onClick={() => acts.reply(c.id)}><Icon name="reply" size={16} />ตอบ</button>}
          {c.author.id === me ? (
            <button type="button" className="act" onClick={() => acts.remove(c.id)}><Icon name="trash" size={16} />ลบ</button>
          ) : canWrite && (
            <button type="button" className="act" onClick={() => acts.report(c.id)}><Icon name="flag" size={16} />รายงาน</button>
          )}
        </span>
      </div>
    </li>
  );
}

export default function Post({ route }) {
  const id = route.params.id;
  const account = useAccount();
  const [post, setPost] = useState(undefined);
  const [comments, setComments] = useState([]);
  const [liked, setLiked] = useState(new Set());
  const [reply, setReply] = useState({ to: null, body: '' });
  const [busy, setBusy] = useState(false);
  const [report, setReport] = useState(null);
  const [error, setError] = useState('');
  useTitle(post?.title || 'กระทู้');
  const me = account.user?.id;
  const canWrite = account.status === 'in' && account.profile;

  const loadComments = useCallback(async () => {
    const b = await getBackend();
    const list = await b.board.comments(id);
    setComments(list);
    return list;
  }, [id]);

  useEffect(() => { ensureAccount(); }, []);
  useEffect(() => {
    if (MODE === 'off') return undefined;
    let live = true;
    let stop = () => {};
    (async () => {
      const b = await getBackend();
      // A failed request is not a missing post: say which it was.
      const p = await b.board.get(id).catch(() => 'error');
      if (!live) return;
      setPost(p);
      if (!p || p === 'error') return;
      const list = await loadComments();
      // Left (or the account changed) while comments loaded: the cleanup already ran.
      if (!live) return;
      stop = b.board.watchComments(id, () => { loadComments(); });
      if (account.status === 'in') setLiked(await b.board.myLikes({ posts: [id], comments: list.map((c) => c.id) }));
    })();
    return () => { live = false; stop(); };
  }, [id, account.status]); // eslint-disable-line react-hooks/exhaustive-deps

  if (MODE === 'off') return <Soon />;
  if (post === undefined) return <div className="wrap thread"><div className="skel-card"><span className="skel skel-line w60" /><span className="skel skel-line w80" /></div></div>;
  if (post === 'error') return (
      <div className="wrap thread empty" role="alert">
        <p className="empty-h">โหลดไม่สำเร็จ</p>
        <p className="hint">ตรวจการเชื่อมต่อแล้วลองอีกครั้ง</p>
        <button type="button" className="btn btn-ink" onClick={() => window.location.reload()}>ลองอีกครั้ง</button>
      </div>
    );
  if (post === null) {
    return (
      <div className="wrap thread empty">
        <p className="empty-h">ไม่พบกระทู้นี้</p>
        <p className="hint">อาจถูกลบหรือซ่อนไว้ระหว่างรอตรวจ</p>
        <Link to="/community" className="btn btn-ink">กลับไปชุมชน</Link>
      </div>
    );
  }

  const toggleLike = async (target, targetId) => {
    if (!canWrite) { askJoin(); return; }
    const on = !liked.has(targetId);
    setLiked((s) => { const n = new Set(s); if (on) n.add(targetId); else n.delete(targetId); return n; });
    const bump = (x) => ({ ...x, likes: Math.max(0, x.likes + (on ? 1 : -1)) });
    if (target === 'post') setPost(bump); else setComments((cs) => cs.map((c) => (c.id === targetId ? bump(c) : c)));
    try { const b = await getBackend(); await b.board.like(target, targetId, on); } catch { /* the next load corrects the count */ }
  };
  const send = async (e) => {
    e.preventDefault();
    if (!reply.body.trim()) return;
    setBusy(true); setError('');
    try {
      const b = await getBackend();
      await b.board.comment(id, reply.body.trim(), reply.to);
      setReply({ to: null, body: '' });
      await loadComments();
    } catch (err) {
      setError(problemText(err));
    } finally { setBusy(false); }
  };
  const removePost = async () => {
    if (!window.confirm('ลบกระทู้นี้และคำตอบทั้งหมด?')) return;
    try {
      const b = await getBackend();
      await b.board.remove(id);
      navigate('/community', { replace: true });
    } catch (err) { setError(problemText(err)); }
  };
  const removeComment = async (cid) => {
    if (!window.confirm('ลบคำตอบนี้?')) return;
    try {
      const b = await getBackend();
      await b.board.removeComment(cid);
      await loadComments();
    } catch (err) { setError(problemText(err)); }
  };

  const top = comments.filter((c) => !c.parentId);
  const repliesTo = (cid) => comments.filter((c) => c.parentId === cid);
  const acts = {
    me, canWrite, liked,
    like: (cid) => toggleLike('comment', cid),
    reply: (cid) => { setReply((r) => ({ ...r, to: cid })); document.getElementById('reply-body')?.focus(); },
    remove: removeComment,
    report: (cid) => setReport({ target: 'comment', id: cid }),
  };

  return (
    <div className="wrap thread">
      <nav className="crumbs" aria-label="ตำแหน่ง">
        <Link to="/community">ชุมชน</Link>
        <Icon name="chevronRight" size={16} />
        <span>กระทู้</span>
      </nav>
      <article className={`thread-post${post.hidden ? ' is-hidden' : ''}`}>
        <header className="thread-head">
          <PostChips post={post} />
          <h1 className="thread-title">{post.title}</h1>
          <Link to={post.author.handle ? `/u/${post.author.handle}` : '/community'} className="thread-by">
            <Avatar profile={post.author} size={40} />
            <span><Byline profile={post.author} /><span className="post-when">{ago(post.createdAt)}{post.editedAt ? ' แก้ไขแล้ว' : ''}</span></span>
          </Link>
        </header>
        {post.hidden && <p className="notice">กระทู้นี้ถูกซ่อนไว้ระหว่างรอผู้ดูแลตรวจ เห็นได้เฉพาะคุณ</p>}
        <div className="thread-body"><Paragraphs text={post.body} /></div>
        {post.questionNo && (post.domain ? <QuestionPeek no={post.questionNo} domain={post.domain} /> : (
          <Link to={withQuery('/bank', { q: post.questionNo })} className="thread-q"><Icon name="search" size={18} />เปิดข้อ No. {post.questionNo} ในคลัง</Link>
        ))}
        <footer className="thread-acts">
          <button type="button" className={`act act-lg${liked.has(post.id) ? ' on' : ''}`} onClick={() => toggleLike('post', post.id)} aria-pressed={liked.has(post.id)}>
            <Icon name="heart" size={18} />{post.likes ? `${post.likes} ถูกใจ` : 'ถูกใจ'}
          </button>
          <ShareButton path={`/community/p/${post.id}`} title={post.title} text={`${post.title} | ชุมชน VetMock VCA`} label="แชร์" className="act act-lg" iconSize={18} />
          {post.author.id === me ? (
            <>
              <Link to={`/community/p/${post.id}/edit`} className="act act-lg"><Icon name="edit" size={18} />แก้ไข</Link>
              <button type="button" className="act act-lg" onClick={removePost}><Icon name="trash" size={18} />ลบ</button>
            </>
          ) : canWrite && (
            <button type="button" className="act act-lg" onClick={() => setReport({ target: 'post', id: post.id })}><Icon name="flag" size={18} />รายงาน</button>
          )}
        </footer>
      </article>

      <section className="cmts" aria-labelledby="cmts-h">
        <h2 id="cmts-h" className="block-h">{comments.length ? `${comments.length} คำตอบ` : 'ยังไม่มีคำตอบ'}</h2>
        <ol className="cmt-list">
          {top.map((c) => (
            <li key={c.id} className="cmt-thread">
              <ol><Comment c={c} acts={acts} /></ol>
              {repliesTo(c.id).length > 0 && <ol className="cmt-replies">{repliesTo(c.id).map((r) => <Comment key={r.id} c={r} acts={acts} child />)}</ol>}
            </li>
          ))}
        </ol>
        {canWrite ? (
          <form className="composer" onSubmit={send}>
            {reply.to && (
              <p className="composer-to">ตอบ {comments.find((c) => c.id === reply.to)?.author.name}<button type="button" className="icon-btn" onClick={() => setReply({ to: null, body: reply.body })} aria-label="ยกเลิกการตอบกลับ"><Icon name="x" size={16} /></button></p>
            )}
            <label className="sr" htmlFor="reply-body">คำตอบ</label>
            <textarea id="reply-body" rows={3} maxLength={4000} placeholder="เขียนคำตอบ" value={reply.body} onChange={(e) => setReply({ ...reply, body: e.target.value })} />
            {error && <p className="form-error" role="alert">{error}</p>}
            <button type="submit" className="btn btn-ink btn-sm" disabled={busy || !reply.body.trim()} onMouseDown={(e) => e.preventDefault()}>
              {busy ? <span className="spinner" aria-hidden="true" /> : <Icon name="send" size={16} />}ส่งคำตอบ
            </button>
          </form>
        ) : <JoinPrompt what="ตอบกระทู้" />}
      </section>
      {report && <ReportSheet target={report.target} id={report.id} onClose={() => setReport(null)} />}
    </div>
  );
}
