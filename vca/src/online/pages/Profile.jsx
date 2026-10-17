// A student's page: their mark, name, school and round, the practice they chose to show, and
// their threads. /me is the signed-in student's own. From someone else's page: a message, or a
// block, which hides them from each other's chat.

import { useEffect, useState } from 'react';
import { Link } from '../../components/Link.jsx';
import { Icon } from '../../components/Icon.jsx';
import { Figure } from '../../components/bits.jsx';
import { ShareButton } from '../../components/Share.jsx';
import { useTitle } from '../../lib/hooks.js';
import { navigate } from '../../router.js';
import NotFound from '../../pages/NotFound.jsx';
import { Avatar } from '../ui/Avatar.jsx';
import { JoinPrompt, Soon } from '../ui/bits.jsx';
import { PostCard } from '../ui/PostCard.jsx';
import { askJoin, askProfile } from '../ui/AccountButton.jsx';
import { MODE } from '../config.js';
import { ensureAccount, getBackend, useAccount } from '../account.js';
import { problemText } from '../shapes.js';
import '../community.css';

const joined = (iso) => (iso ? new Date(iso).toLocaleDateString('th-TH', { month: 'long', year: 'numeric', timeZone: 'Asia/Bangkok' }) : '');

function Stats({ stats }) {
  const figs = [
    stats.answered > 0 && <Figure key="a" value={stats.answered} unit="ข้อ">ฝึกไปแล้ว</Figure>,
    Number.isFinite(stats.accuracy) && stats.answered > 0 && <Figure key="c" value={stats.accuracy} unit="%">ตอบถูก</Figure>,
    stats.streak > 0 && <Figure key="s" value={stats.streak} unit="วัน">ฝึกต่อเนื่อง</Figure>,
    stats.mocks > 0 && <Figure key="m" value={stats.mocks} unit="ชุด">สอบจำลอง</Figure>,
  ].filter(Boolean);
  if (!figs.length) return null;
  return <section className="prof-stats" aria-label="สถิติการฝึก" style={{ '--n': figs.length }}>{figs}</section>;
}

export default function Profile({ route }) {
  const handle = route.params.handle || null;
  const account = useAccount();
  const mine = account.profile && (!handle || account.profile.handle === handle);
  const [found, setFound] = useState(undefined);
  const [posts, setPosts] = useState(null);
  const [blocked, setBlocked] = useState(false);
  const [busy, setBusy] = useState('');
  const [error, setError] = useState('');
  // Your own page follows your edits as you make them.
  const profile = mine ? account.profile : found;
  useTitle(profile ? `${profile.name} (@${profile.handle})` : handle ? `@${handle}` : 'โปรไฟล์ของฉัน');

  useEffect(() => { ensureAccount(); }, []);
  // /me, and a page whose handle you just changed, go to your current address.
  useEffect(() => {
    if (!account.profile) return;
    if (!handle || (found && found.id === account.profile.id && found.handle !== account.profile.handle)) {
      navigate(`/u/${account.profile.handle}`, { replace: true });
    }
  }, [handle, account.profile, found]);

  useEffect(() => {
    if (MODE === 'off' || !handle) return undefined;
    let live = true;
    setFound(undefined);
    setPosts(null);
    (async () => {
      const b = await getBackend();
      const p = await b.profiles.byHandle(handle).catch(() => null);
      if (!live) return;
      setFound(p);
      if (!p) return;
      const r = await b.board.list({ authorId: p.id, limit: 30 }).catch(() => ({ posts: [] }));
      if (live) setPosts(r.posts);
    })();
    return () => { live = false; };
  }, [handle]);

  useEffect(() => {
    if (account.status !== 'in' || !found || mine) return undefined;
    let live = true;
    getBackend().then((b) => b.safety.blocked()).then((set) => { if (live) setBlocked(set.has(found.id)); }).catch(() => {});
    return () => { live = false; };
  }, [account.status, found, mine]);

  if (MODE === 'off') return <Soon />;
  if (!handle) {
    if (account.status === 'idle' || account.status === 'loading') return <div className="wrap prof"><div className="skel-card"><span className="skel skel-line w40" /></div></div>;
    return (
      <div className="wrap prof">
        <header className="page-head"><p className="kicker">Your page</p><h1 className="page-h">โปรไฟล์ของฉัน</h1></header>
        <JoinPrompt what="มีโปรไฟล์ในชุมชน" />
      </div>
    );
  }
  if (found === null && !mine) return <NotFound />;
  if (!profile) {
    return <div className="wrap prof"><div className="prof-hero"><span className="skel prof-skel-av" /><div className="skel-card"><span className="skel skel-line w60" /><span className="skel skel-line w40" /></div></div></div>;
  }

  const message = async () => {
    if (account.status !== 'in' || !account.profile) { askJoin(); return; }
    setBusy('message'); setError('');
    try {
      const b = await getBackend();
      const room = await b.chat.openDirect(profile.id);
      navigate(`/chat/${room}`);
    } catch (err) { setError(problemText(err)); setBusy(''); }
  };
  const toggleBlock = async () => {
    if (!blocked && !window.confirm(`บล็อก ${profile.name}? จะไม่เห็นข้อความของกันและกันในแชท และส่งข้อความหากันไม่ได้`)) return;
    setBusy('block'); setError('');
    try {
      const b = await getBackend();
      if (blocked) await b.safety.unblock(profile.id); else await b.safety.block(profile.id);
      setBlocked(!blocked);
    } catch (err) { setError(problemText(err)); }
    setBusy('');
  };

  const facts = [
    profile.school && { icon: 'book', text: profile.school },
    profile.cohort && { icon: 'users', text: profile.cohort },
    profile.round && { icon: 'calendar', text: `สอบรอบ ${profile.round}` },
    profile.createdAt && { icon: 'clock', text: `เข้าร่วมเมื่อ ${joined(profile.createdAt)}` },
  ].filter(Boolean);

  return (
    <div className="wrap prof">
      <section className="prof-hero">
        <Avatar profile={profile} size={112} ring />
        <div className="prof-main">
          <p className="kicker">{mine ? 'Your page' : 'Member'}</p>
          <h1 className="prof-name">{profile.name}</h1>
          <p className="prof-handle">@{profile.handle}</p>
          {profile.bio && <p className="prof-bio">{profile.bio}</p>}
          {facts.length > 0 && (
            <ul className="prof-facts">
              {facts.map((f) => <li key={f.text}><Icon name={f.icon} size={16} />{f.text}</li>)}
            </ul>
          )}
          <div className="prof-go">
            {mine ? (
              <button type="button" className="btn btn-ink btn-sm" onClick={askProfile}><Icon name="edit" size={16} />แก้ไขโปรไฟล์</button>
            ) : (
              <>
                {!blocked && (
                  <button type="button" className="btn btn-ink btn-sm" onClick={message} disabled={busy === 'message'}>
                    {busy === 'message' ? <span className="spinner" aria-hidden="true" /> : <Icon name="chat" size={16} />}ส่งข้อความ
                  </button>
                )}
                {account.status === 'in' && account.profile && (
                  <button type="button" className="btn btn-ghost btn-sm" onClick={toggleBlock} disabled={busy === 'block'} aria-pressed={blocked}>
                    <Icon name="shield" size={16} />{blocked ? 'เลิกบล็อก' : 'บล็อก'}
                  </button>
                )}
              </>
            )}
            <ShareButton path={`/u/${profile.handle}`} title={`${profile.name} (@${profile.handle})`} text={`${profile.name} ในชุมชน VetMock VCA`} label="แชร์" className="btn btn-ghost btn-sm" iconSize={16} />
          </div>
          {error && <p className="form-error" role="alert">{error}</p>}
          {blocked && <p className="hint">บล็อกไว้แล้ว ไม่เห็นข้อความของกันและกันในแชท</p>}
        </div>
      </section>

      <Stats stats={profile.stats || {}} />

      <section className="prof-posts" aria-labelledby="prof-posts-h">
        <h2 id="prof-posts-h" className="block-h">{mine ? 'กระทู้ของฉัน' : `กระทู้ของ ${profile.name}`}</h2>
        {posts === null ? (
          <div className="posts" aria-busy="true"><div className="post-card skel-card"><span className="skel skel-line w60" /><span className="skel skel-line w80" /></div></div>
        ) : posts.length === 0 ? (
          <div className="empty prof-empty">
            <p className="empty-h">ยังไม่มีกระทู้</p>
            {mine && <Link to="/community/new" className="btn btn-ink btn-sm"><Icon name="plus" size={16} />ตั้งกระทู้แรก</Link>}
          </div>
        ) : (
          <ol className="posts">{posts.map((p, i) => <PostCard key={p.id} post={p} i={i} />)}</ol>
        )}
      </section>
    </div>
  );
}
