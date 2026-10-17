// Chat: the open rooms everyone signed in shares, one per family of domains, and conversations
// between two people. A room opens on its last fifty messages, with the rest a tap away, and new
// ones arrive as they are sent. People you have blocked do not appear.

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Link } from '../../components/Link.jsx';
import { Icon } from '../../components/Icon.jsx';
import { ConfirmSheet } from '../../components/Sheet.jsx';
import { useMedia, useTitle } from '../../lib/hooks.js';
import { Avatar } from '../ui/Avatar.jsx';
import { AttachButton, MediaGrid, MediaTray, useMediaTray } from '../ui/Media.jsx';
import { JoinPrompt, ReportSheet, Soon } from '../ui/bits.jsx';
import { MODE } from '../config.js';
import { ensureAccount, getBackend, useAccount } from '../account.js';
import { OPEN_ROOMS, ROOM_BY_SLUG, ago, clockOf, groupMessages, problemText } from '../shapes.js';
import '../community.css';

const PAGE = 50;
const roomPath = (r) => `/chat/${r.kind === 'open' ? r.slug : r.id}`;
const roomName = (r) => (r.kind === 'open' ? ROOM_BY_SLUG[r.slug]?.name || r.slug : r.other?.name || 'แชทส่วนตัว');

function Text({ body }) {
  return String(body).split('\n').map((line, i) => (i ? [<br key={i} />, line] : line));
}

function RoomList({ rooms, current }) {
  const open = OPEN_ROOMS.map((o) => rooms.find((r) => r.kind === 'open' && r.slug === o.slug)).filter(Boolean);
  const direct = rooms.filter((r) => r.kind === 'direct' && r.other).sort((a, b) => String(b.lastMessageAt || '').localeCompare(String(a.lastMessageAt || '')));
  const item = (r, inner) => (
    <li key={r.id}>
      <Link to={roomPath(r)} className={`room-link${current?.id === r.id ? ' on' : ''}${r.unread ? ' is-unread' : ''}`} aria-current={current?.id === r.id ? 'page' : undefined}>
        {inner}
        {r.unread && <span className="room-dot"><span className="sr">มีข้อความใหม่</span></span>}
      </Link>
    </li>
  );
  return (
    <nav className="rooms" aria-label="ห้องแชท">
      <p className="rooms-h">ห้องเปิด</p>
      <ul>
        {open.map((r) => item(r, (
          <>
            <span className="room-ico" aria-hidden="true">#</span>
            <span className="room-text"><b>{ROOM_BY_SLUG[r.slug].name}</b><span>{ROOM_BY_SLUG[r.slug].about}</span></span>
          </>
        )))}
      </ul>
      <p className="rooms-h">ข้อความส่วนตัว</p>
      {direct.length ? (
        <ul>
          {direct.map((r) => item(r, (
            <>
              <Avatar profile={r.other} size={34} />
              <span className="room-text"><b>{r.other.name}</b><span>{r.lastMessageAt ? ago(r.lastMessageAt) : `@${r.other.handle}`}</span></span>
            </>
          )))}
        </ul>
      ) : <p className="rooms-none">กดส่งข้อความจากหน้าโปรไฟล์ของเพื่อนเพื่อคุยกันสองคน</p>}
    </nav>
  );
}

function Room({ room, me, blocked, onRead }) {
  const [messages, setMessages] = useState(null);
  const [older, setOlder] = useState(false);
  const [people, setPeople] = useState(() => new Map());
  const known = useRef(new Set());
  const [text, setText] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [picked, setPicked] = useState(null);
  const [report, setReport] = useState(null);
  // The message the student was just asked to confirm deleting; `open` closes the sheet, the id stays while it leaves.
  const [ask, setAsk] = useState({ open: false, id: null });
  const [fresh, setFresh] = useState(0);
  const scroller = useRef(null);
  const input = useRef(null);
  const atEnd = useRef(true);
  const keep = useRef(null);
  const touch = useMedia('(pointer: coarse)');
  const info = room.kind === 'open' ? ROOM_BY_SLUG[room.slug] : null;
  // A direct room's files go to the private bucket, under the room.
  const tray = useMediaTray({ kind: 'chat', max: 1, video: true, room: room.kind === 'direct' ? room.id : null });
  const said = (m) => (m.body.trim() ? m.body : m.media?.[0]?.kind === 'video' ? 'วิดีโอ' : m.media?.length ? 'รูปภาพ' : '');

  const meet = useCallback(async (list) => {
    const missing = [...new Set(list.map((m) => m.authorId))].filter((id) => !known.current.has(id));
    if (!missing.length) return;
    for (const id of missing) known.current.add(id);
    const b = await getBackend();
    const found = await b.profiles.byIds(missing).catch(() => []);
    setPeople((cur) => { const next = new Map(cur); for (const p of found) next.set(p.id, p); return next; });
  }, []);

  useEffect(() => {
    let live = true;
    let stop = () => {};
    (async () => {
      const b = await getBackend();
      const list = await b.chat.messages(room.id, { limit: PAGE });
      if (!live) return;
      atEnd.current = true;
      setMessages(list);
      setOlder(list.length === PAGE);
      meet(list);
      b.chat.markRead(room.id).then(() => onRead(room.id)).catch(() => {});
      stop = b.chat.watch(room.id, (ev) => {
        setMessages((cur) => {
          if (!cur) return cur;
          if (ev.type === 'delete') return cur.filter((m) => m.id !== ev.message.id);
          if (ev.type === 'update') return cur.map((m) => (m.id === ev.message.id ? { ...m, ...ev.message } : m));
          return cur.some((m) => m.id === ev.message.id) ? cur : [...cur, ev.message];
        });
        if (ev.type !== 'insert' || ev.message.authorId === me) return;
        meet([ev.message]);
        if (!atEnd.current) setFresh((n) => n + 1);
        b.chat.markRead(room.id).then(() => onRead(room.id)).catch(() => {});
      });
    })().catch(() => { if (live) { setMessages([]); setError('โหลดข้อความไม่สำเร็จ ลองรีเฟรช'); } });
    return () => { live = false; stop(); };
  }, [room.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // Stay at the newest message while reading there; keep the place when older ones load above.
  useLayoutEffect(() => {
    const el = scroller.current;
    if (!el || !messages) return;
    if (keep.current != null) {
      el.scrollTop = el.scrollHeight - keep.current;
      keep.current = null;
    } else if (atEnd.current) {
      el.scrollTop = el.scrollHeight;
    }
  }, [messages]);

  const onScroll = () => {
    const el = scroller.current;
    atEnd.current = el.scrollHeight - el.scrollTop - el.clientHeight < 72;
    if (atEnd.current && fresh) setFresh(0);
  };
  const toEnd = () => {
    const el = scroller.current;
    el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
    setFresh(0);
  };
  const loadOlder = async () => {
    if (!messages?.length) return;
    const b = await getBackend();
    const list = await b.chat.messages(room.id, { before: messages[0].id, limit: PAGE }).catch(() => []);
    keep.current = scroller.current.scrollHeight - scroller.current.scrollTop;
    setOlder(list.length === PAGE);
    meet(list);
    setMessages((cur) => [...list.filter((m) => !cur.some((x) => x.id === m.id)), ...cur]);
  };

  const send = async () => {
    const body = text.trim();
    if ((!body && !tray.media.length) || sending || tray.busy) return;
    setSending(true);
    setError('');
    try {
      const b = await getBackend();
      const m = await b.chat.send(room.id, body, replyTo, tray.media);
      tray.done();
      atEnd.current = true;
      setMessages((cur) => (cur.some((x) => x.id === m.id) ? cur : [...cur, m]));
      setText('');
      setReplyTo(null);
      if (input.current) input.current.style.height = '';
    } catch (err) {
      setError(problemText(err));
    }
    setSending(false);
    if (document.activeElement !== input.current) input.current?.focus({ preventScroll: true });
  };
  const remove = async (id) => {
    try {
      const b = await getBackend();
      await b.chat.remove(id);
      setMessages((cur) => cur.filter((m) => m.id !== id));
    } catch (err) { setError(problemText(err)); }
  };
  const grow = (el) => { el.style.height = 'auto'; el.style.height = `${Math.min(el.scrollHeight, 168)}px`; };

  const visible = useMemo(() => (messages || []).filter((m) => !blocked.has(m.authorId)), [messages, blocked]);
  const groups = useMemo(() => groupMessages(visible), [visible]);
  const byId = useMemo(() => new Map(visible.map((m) => [m.id, m])), [visible]);
  const who = (id) => (id === me ? null : people.get(id));
  const replying = replyTo ? byId.get(replyTo) : null;

  return (
    <section className="room" aria-label={roomName(room)}>
      <header className="room-head">
        <Link to="/chat" className="icon-btn room-back" aria-label="กลับไปรายการห้อง"><Icon name="arrowLeft" /></Link>
        {info ? (
          <div className="room-title"><h2><span aria-hidden="true">#</span>{info.name}</h2><p>{info.about}</p></div>
        ) : room.other ? (
          <Link to={`/u/${room.other.handle}`} className="room-title room-who">
            <Avatar profile={room.other} size={36} />
            <span><h2>{room.other.name}</h2><p>@{room.other.handle}</p></span>
          </Link>
        ) : <div className="room-title"><h2>แชทส่วนตัว</h2></div>}
      </header>

      <div className="room-scroll" ref={scroller} onScroll={onScroll}>
        {messages === null ? (
          <div className="room-wait" role="status"><span className="spinner" aria-hidden="true" />กำลังโหลดข้อความ</div>
        ) : (
          <>
            {older && <div className="room-older"><button type="button" className="btn btn-ghost btn-sm" onClick={loadOlder}>ข้อความก่อนหน้า</button></div>}
            {!visible.length && (
              <div className="room-empty">
                <p className="empty-h">{info ? 'ยังเงียบอยู่' : `เริ่มคุยกับ ${room.other?.name || 'เพื่อน'}`}</p>
                <p className="hint">{info ? 'ทักทายเป็นคนแรกได้เลย' : 'ข้อความในห้องนี้เห็นกันแค่สองคน'}</p>
              </div>
            )}
            <ol className="msgs" aria-live="polite" aria-relevant="additions">
              {groups.map((g) => {
                if (g.divider) return <li key={g.key} className="msgs-day"><span>{g.divider}</span></li>;
                const mine = g.authorId === me;
                const p = who(g.authorId);
                const last = g.messages[g.messages.length - 1];
                return (
                  <li key={g.key} className={`mgroup${mine ? ' is-me' : ''}`}>
                    {!mine && (p?.handle ? <Link to={`/u/${p.handle}`} className="mgroup-av" tabIndex={-1} aria-hidden="true"><Avatar profile={p} size={32} /></Link> : <span className="mgroup-av"><Avatar profile={p} size={32} /></span>)}
                    <div className="mgroup-main">
                      {!mine && <p className="mgroup-who">{p?.handle ? <Link to={`/u/${p.handle}`}>{p.name}</Link> : (p?.name || 'ผู้ใช้')}</p>}
                      {g.messages.map((m) => {
                        const quoted = m.replyTo ? byId.get(m.replyTo) : null;
                        return (
                          <div key={m.id} className={`msg${m.hidden ? ' is-hidden' : ''}${picked === m.id ? ' is-picked' : ''}`} onClick={() => setPicked(picked === m.id ? null : m.id)}>
                            {m.replyTo && (
                              <p className="msg-quote">{quoted ? <><b>{quoted.authorId === me ? 'คุณ' : who(quoted.authorId)?.name || 'ผู้ใช้'}</b> {said(quoted).slice(0, 80)}</> : 'ตอบข้อความก่อนหน้า'}</p>
                            )}
                            {m.body.trim() && <p className="msg-body" title={clockOf(m.createdAt)}><Text body={m.body} /></p>}
                            <MediaGrid media={m.media} compact />
                            {m.hidden && <p className="msg-note">ซ่อนไว้ระหว่างรอผู้ดูแลตรวจ</p>}
                            <span className="msg-acts">
                              <button type="button" className="act" onClick={(e) => { e.stopPropagation(); setReplyTo(m.id); setPicked(null); input.current?.focus({ preventScroll: true }); }}><Icon name="reply" size={15} />ตอบ</button>
                              {mine ? (
                                <button type="button" className="act" onClick={(e) => { e.stopPropagation(); setAsk({ open: true, id: m.id }); }}><Icon name="trash" size={15} />ลบ</button>
                              ) : (
                                <button type="button" className="act" onClick={(e) => { e.stopPropagation(); setReport(m.id); }}><Icon name="flag" size={15} />รายงาน</button>
                              )}
                            </span>
                          </div>
                        );
                      })}
                      <time className="mgroup-time" dateTime={last.createdAt}>{clockOf(last.createdAt)}</time>
                    </div>
                  </li>
                );
              })}
            </ol>
          </>
        )}
      </div>
      {fresh > 0 && <button type="button" className="room-fresh" onClick={toEnd}><Icon name="chevronDown" size={16} />ข้อความใหม่ {fresh}</button>}

      <form className="room-compose" onSubmit={(e) => { e.preventDefault(); send(); }}>
        {replying && (
          <p className="room-replying">
            <Icon name="reply" size={15} />
            <span>ตอบ <b>{replying.authorId === me ? 'ตัวเอง' : who(replying.authorId)?.name || 'ผู้ใช้'}</b> {said(replying).slice(0, 60)}</span>
            <button type="button" className="icon-btn" onClick={() => setReplyTo(null)} aria-label="ยกเลิกการตอบ"><Icon name="x" size={16} /></button>
          </p>
        )}
        {error && <p className="form-error" role="alert">{error}</p>}
        <MediaTray tray={tray} />
        <div className="room-input">
          <AttachButton tray={tray} className="icon-btn room-attach" />
          <label className="sr" htmlFor="chat-input">ข้อความ</label>
          <textarea
            id="chat-input" ref={input} rows={1} maxLength={2000} value={text} placeholder={info ? `ส่งข้อความถึง #${info.name}` : 'ส่งข้อความ'}
            onChange={(e) => { setText(e.target.value); grow(e.target); }}
            onKeyDown={(e) => {
              // A keyboard sends with Enter (Shift+Enter for a new line); a phone's return key is a new line.
              if (e.key === 'Enter' && !e.shiftKey && !touch && !e.nativeEvent.isComposing) { e.preventDefault(); send(); }
            }}
          />
          {/* Pressing send leaves the cursor in the box, so a phone's keyboard stays up between messages. */}
          <button type="submit" className="room-send" disabled={(!text.trim() && !tray.media.length) || sending || tray.busy} aria-label="ส่ง" onMouseDown={(e) => e.preventDefault()}>
            {sending ? <span className="spinner" aria-hidden="true" /> : <Icon name="send" size={20} />}
          </button>
        </div>
      </form>
      {report && <ReportSheet target="message" id={report} onClose={() => setReport(null)} />}
      <ConfirmSheet
        open={ask.open}
        onClose={() => setAsk((a) => ({ ...a, open: false }))}
        onConfirm={() => { setAsk((a) => ({ ...a, open: false })); remove(ask.id); }}
        title="ลบข้อความนี้?" confirm="ลบข้อความ"
      >
        ข้อความนี้จะหายไปจากห้อง ย้อนกลับไม่ได้
      </ConfirmSheet>
    </section>
  );
}

export default function Chat({ route }) {
  const account = useAccount();
  const param = route.params.room || null;
  const [rooms, setRooms] = useState(null);
  const [blocked, setBlocked] = useState(() => new Set());
  const [failed, setFailed] = useState(false);
  const signedIn = account.status === 'in' && !!account.profile;
  const current = rooms && param ? rooms.find((r) => (r.kind === 'open' ? r.slug === param : r.id === param)) || null : null;
  useTitle(current ? roomName(current) : 'แชท');

  useEffect(() => { ensureAccount(); }, []);
  const load = useCallback(async () => {
    try {
      const b = await getBackend();
      const [list, blocks] = await Promise.all([b.chat.rooms(), b.safety.blocked().catch(() => new Set())]);
      setRooms(list.filter((r) => r.kind === 'open' || !blocks.has(r.other?.id)));
      setBlocked(blocks);
      setFailed(false);
    } catch { setFailed(true); }
  }, []);
  useEffect(() => {
    if (MODE === 'off' || !signedIn) return undefined;
    load();
    // A conversation someone else starts shows up when the student comes back to the tab.
    const again = () => { if (document.visibilityState === 'visible') load(); };
    document.addEventListener('visibilitychange', again);
    return () => document.removeEventListener('visibilitychange', again);
  }, [signedIn, load]);
  // A direct room opened a moment ago may not be in the list yet.
  useEffect(() => { if (rooms && param && !current && !ROOM_BY_SLUG[param]) load(); }, [param]); // eslint-disable-line react-hooks/exhaustive-deps

  const onRead = useCallback((id) => setRooms((list) => list?.map((r) => (r.id === id ? { ...r, unread: false } : r)) || list), []);

  if (MODE === 'off') return <Soon />;

  if (!signedIn) {
    return (
      <div className="wrap chat chat-out">
        <header className="page-head">
          <p className="kicker">The common room</p>
          <h1 className="page-h">แชท</h1>
          <p className="page-p">ห้องคุยตามหมวดวิชาสำหรับคนที่กำลังเตรียมสอบ และแชทส่วนตัวกับเพื่อน</p>
        </header>
        {account.status === 'idle' || account.status === 'loading' ? (
          <div className="skel-card"><span className="skel skel-line w60" /><span className="skel skel-line w40" /></div>
        ) : (
          <>
            <JoinPrompt what="คุยในห้องแชท" />
            <ul className="chat-preview">
              {OPEN_ROOMS.map((r) => (
                <li key={r.slug}><span className="room-ico" aria-hidden="true">#</span><span className="room-text"><b>{r.name}</b><span>{r.about}</span></span></li>
              ))}
            </ul>
          </>
        )}
      </div>
    );
  }

  return (
    <div className={`wrap chat${param ? ' in-room' : ''}`}>
      <div className="chat-frame">
        <aside className="chat-side">
          <header className="chat-head">
            <p className="kicker">The common room</p>
            <h1 className="chat-h">แชท</h1>
          </header>
          {failed && <p className="notice notice-error" role="alert"><Icon name="info" size={18} />โหลดห้องแชทไม่สำเร็จ ลองรีเฟรชอีกครั้ง</p>}
          {rooms ? <RoomList rooms={rooms} current={current} /> : <div className="room-wait"><span className="spinner" aria-hidden="true" /></div>}
        </aside>
        {current ? (
          <Room key={current.id} room={current} me={account.user.id} blocked={blocked} onRead={onRead} />
        ) : (
          <div className="room room-none">
            {rooms && param ? (
              <><p className="empty-h">ไม่พบห้องนี้</p><Link to="/chat" className="btn btn-ghost btn-sm">กลับไปรายการห้อง</Link></>
            ) : (
              <><Icon name="chat" size={28} /><p className="empty-h">เลือกห้องเพื่อเริ่มคุย</p><p className="hint">ห้องเปิดอ่านและคุยได้ทุกคนที่เข้าสู่ระบบ</p></>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
