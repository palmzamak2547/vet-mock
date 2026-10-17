// Photos and video in the community: how they are drawn (a grid that keeps each picture's shape,
// a full-screen viewer, a video that loads only when played) and how they are attached (a tray
// that prepares and uploads each file the moment it is picked, so posting does not wait, and
// takes back what was never posted).

import { useCallback, useEffect, useRef, useState } from 'react';
import { Icon } from '../../components/Icon.jsx';
import { getBackend } from '../account.js';
import { ACCEPT_IMAGES, ACCEPT_MEDIA, MediaProblem, prepareFile } from '../media.js';
import { problemText } from '../shapes.js';
import '../community.css';

/** A file's address, signing a direct room's files first. */
function useMediaUrl(path, width) {
  const [url, setUrl] = useState('');
  useEffect(() => {
    if (!path) return undefined;
    let live = true;
    getBackend().then(async (b) => {
      await b.media.sign([path]).catch(() => {});
      if (live) setUrl(b.media.url(path, { width }));
    });
    return () => { live = false; };
  }, [path, width]);
  return url;
}

const clock = (s) => `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, '0')}`;

function Picture({ item, width, onOpen, cover = false }) {
  const src = useMediaUrl(item.path, width);
  const [loaded, setLoaded] = useState(false);
  return (
    <button type="button" className={`mg-item${loaded ? ' is-loaded' : ''}`} onClick={onOpen} aria-label={item.alt || 'ดูรูปเต็มจอ'}
      style={cover ? undefined : { aspectRatio: `${item.w} / ${item.h}` }}>
      {src && <img src={src} alt={item.alt || ''} loading="lazy" decoding="async" width={item.w} height={item.h} onLoad={() => setLoaded(true)} />}
    </button>
  );
}

function Video({ item, autoPlay = false }) {
  const src = useMediaUrl(item.path);
  const poster = useMediaUrl(item.poster, 960);
  return (
    <div className="mg-video" style={{ aspectRatio: `${item.w} / ${item.h}` }}>
      {src && (
        // preload none: nothing downloads until the student presses play.
        <video src={src} poster={poster || undefined} controls playsInline preload="none" autoPlay={autoPlay} aria-label={item.alt || 'วิดีโอ'} />
      )}
      <span className="mg-dur" aria-hidden="true">{clock(item.dur || 0)}</span>
    </div>
  );
}

function Thumb({ item }) {
  const src = useMediaUrl(item.kind === 'video' ? item.poster : item.path, 240);
  return (
    <span className="thumb">
      {src && <img src={src} alt="" loading="lazy" decoding="async" />}
      {item.kind === 'video' && <span className="thumb-play"><Icon name="play" size={16} /></span>}
    </span>
  );
}

/** A post's media as the board lists it: small squares, inside the card's link. */
export function MediaThumbs({ media }) {
  if (!media?.length) return null;
  const more = media.length - 3;
  return (
    <span className="thumbs" aria-label={media[0].kind === 'video' ? 'มีวิดีโอ' : `มีรูป ${media.length} รูป`}>
      {media.slice(0, 3).map((m) => <Thumb key={m.path} item={m} />)}
      {more > 0 && <span className="thumb thumb-more">+{more}</span>}
    </span>
  );
}

/** A row's media: one picture at its own shape, two to four in a grid, or one video. */
export function MediaGrid({ media, compact = false }) {
  const [open, setOpen] = useState(null);
  if (!media?.length) return null;
  if (media[0].kind === 'video') return <div className={`mg mg-one${compact ? ' mg-compact' : ''}`}><Video item={media[0]} /></div>;
  const n = media.length;
  return (
    <>
      <div className={`mg mg-${n === 1 ? 'one' : n}${compact ? ' mg-compact' : ''}`}>
        {media.map((m, i) => <Picture key={m.path} item={m} width={n === 1 ? 1200 : 720} cover={n > 1} onOpen={() => setOpen(i)} />)}
      </div>
      {open !== null && <Lightbox media={media} index={open} onClose={() => setOpen(null)} />}
    </>
  );
}

/** Full screen, one picture at a time: arrows and swipes move, Escape or a tap outside closes. */
export function Lightbox({ media, index, onClose }) {
  const [i, setI] = useState(index);
  const ref = useRef(null);
  const back = useRef(document.activeElement);
  const n = media.length;
  const go = useCallback((d) => setI((x) => (x + d + n) % n), [n]);
  useEffect(() => {
    ref.current?.focus();
    const was = back.current;
    const onKey = (e) => {
      if (e.key === 'Escape') { e.stopPropagation(); onClose(); }
      else if (e.key === 'ArrowRight') go(1);
      else if (e.key === 'ArrowLeft') go(-1);
    };
    document.addEventListener('keydown', onKey, true);
    const overflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey, true);
      document.documentElement.style.overflow = overflow;
      was?.focus?.({ preventScroll: true });
    };
  }, [go, onClose]);
  const touch = useRef(null);
  const item = media[i];
  const src = useMediaUrl(item.path);
  return (
    <div className="lb" role="dialog" aria-modal="true" aria-label={`รูป ${i + 1} จาก ${n}`} tabIndex={-1} ref={ref}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      onTouchStart={(e) => { touch.current = e.touches[0].clientX; }}
      onTouchEnd={(e) => { const dx = e.changedTouches[0].clientX - (touch.current ?? 0); if (Math.abs(dx) > 50 && n > 1) go(dx < 0 ? 1 : -1); }}>
      {src && <img className="lb-img" src={src} alt={item.alt || ''} />}
      <button type="button" className="lb-x icon-btn" onClick={onClose} aria-label="ปิด"><Icon name="x" /></button>
      {n > 1 && (
        <>
          <button type="button" className="lb-nav lb-prev icon-btn" onClick={() => go(-1)} aria-label="รูปก่อนหน้า"><Icon name="chevronLeft" /></button>
          <button type="button" className="lb-nav lb-next icon-btn" onClick={() => go(1)} aria-label="รูปถัดไป"><Icon name="chevronRight" /></button>
          <span className="lb-count" aria-hidden="true">{i + 1} / {n}</span>
        </>
      )}
    </div>
  );
}

let trayId = 0;

/**
 * The state of a composer's attachments. Each file is prepared (online/media.js) and uploaded as
 * soon as it is picked; `media` holds what is ready to post.
 * @param {{ kind: 'post'|'comment'|'chat', max: number, video: boolean, room?: string|null }} opts
 */
export function useMediaTray({ kind, max, video, room = null }) {
  const [items, setItems] = useState([]);
  const sent = useRef(new Set());
  const used = useRef(false);
  const live = useRef(true);
  const patch = (id, p) => { if (live.current) setItems((list) => list.map((x) => (x.id === id ? { ...x, ...p } : x))); };

  const add = useCallback(async (files) => {
    const picked = [...files];
    if (!picked.length) return;
    const current = items.filter((x) => x.status !== 'error');
    const hasVideo = current.some((x) => x.kind === 'video');
    const wantVideo = picked.some((f) => /^video\//.test(f.type) || /\.(mp4|webm|mov|m4v)$/i.test(f.name));
    let note = '';
    let take = picked;
    if (hasVideo || (wantVideo && (current.length || picked.length > 1))) {
      // A video stands alone.
      note = 'วิดีโอแนบได้ทีละหนึ่งไฟล์ และแนบคู่กับรูปไม่ได้';
      take = wantVideo && !current.length ? [picked.find((f) => /^video\//.test(f.type) || /\.(mp4|webm|mov|m4v)$/i.test(f.name))] : picked.filter((f) => !/^video\//.test(f.type)).slice(0, hasVideo ? 0 : max - current.length);
    } else if (current.length + picked.length > max) {
      note = `แนบได้สูงสุด ${max} รูป`;
      take = picked.slice(0, Math.max(0, max - current.length));
    }
    const fresh = take.map((file) => ({ id: ++trayId, status: 'working', kind: /^video\//.test(file.type) ? 'video' : 'image', preview: URL.createObjectURL(file), file, note: '' }));
    setItems((list) => [...list.filter((x) => x.status !== 'error'), ...fresh, ...(note ? [{ id: ++trayId, status: 'error', note }] : [])]);
    for (const it of fresh) {
      try {
        const prepared = await prepareFile(it.file, { video });
        const b = await getBackend();
        const path = await b.media.upload(kind, prepared, { room });
        sent.current.add(path);
        let poster = null;
        if (prepared.kind === 'video') {
          poster = await b.media.upload(kind, prepared.poster, { room, name: path.split('/').pop().replace(/\.\w+$/, '') });
          sent.current.add(poster);
        }
        patch(it.id, { status: 'ready', kind: prepared.kind, item: { path, kind: prepared.kind, w: prepared.w, h: prepared.h, poster, dur: prepared.dur ?? null } });
      } catch (err) {
        patch(it.id, { status: 'error', note: err instanceof MediaProblem ? err.message : problemText(err) });
      }
    }
  }, [items, kind, max, video, room]);

  const remove = useCallback((id) => {
    setItems((list) => {
      const gone = list.find((x) => x.id === id);
      if (gone?.preview) URL.revokeObjectURL(gone.preview);
      if (gone?.item) {
        const paths = [gone.item.path, gone.item.poster].filter(Boolean);
        for (const p of paths) sent.current.delete(p);
        getBackend().then((b) => b.media.discard(paths)).catch(() => {});
      }
      return list.filter((x) => x.id !== id);
    });
  }, []);

  /** After posting: the files now belong to the row; clear the tray without removing them. */
  const done = useCallback(() => {
    used.current = true;
    sent.current.clear();
    setItems((list) => { for (const x of list) if (x.preview) URL.revokeObjectURL(x.preview); return []; });
    used.current = false;
  }, []);

  // Leaving without posting takes the uploaded files back. (Set live on mount too: a component
  // mounted twice, as React's strict mode does, would otherwise never hear its uploads finish.)
  useEffect(() => {
    live.current = true;
    return () => {
      live.current = false;
      const left = [...sent.current];
      if (left.length && !used.current) getBackend().then((b) => b.media.discard(left)).catch(() => {});
    };
  }, []);

  const ready = items.filter((x) => x.status === 'ready');
  return {
    items, add, remove, done, max, video,
    busy: items.some((x) => x.status === 'working'),
    media: ready.map((x) => x.item),
    full: ready.some((x) => x.kind === 'video') || items.filter((x) => x.status !== 'error').length >= max,
  };
}

/** The paperclip: opens the file picker (or the camera roll on a phone). */
export function AttachButton({ tray, className = 'icon-btn', label }) {
  const input = useRef(null);
  return (
    <>
      <button type="button" className={className} onClick={() => input.current?.click()} disabled={tray.full} aria-label={label || (tray.video ? 'แนบรูปหรือวิดีโอ' : 'แนบรูป')} title={label || (tray.video ? 'แนบรูปหรือวิดีโอ' : 'แนบรูป')}>
        <Icon name="image" size={20} />{label && <span>{label}</span>}
      </button>
      <input ref={input} type="file" hidden multiple={tray.max > 1} accept={tray.video ? ACCEPT_MEDIA : ACCEPT_IMAGES}
        onChange={(e) => { tray.add(e.target.files); e.target.value = ''; }} />
    </>
  );
}

/** What is attached, with a way to take each one off. */
export function MediaTray({ tray }) {
  if (!tray.items.length) return null;
  return (
    <ul className="tray" aria-label="ไฟล์ที่แนบ">
      {tray.items.map((x) => (x.status === 'error' && !x.preview ? (
        <li key={x.id} className="tray-note" role="alert"><Icon name="info" size={16} />{x.note}<button type="button" className="text-link" onClick={() => tray.remove(x.id)}>ปิด</button></li>
      ) : (
        <li key={x.id} className={`tray-item is-${x.status}`}>
          {x.kind === 'video' ? <video src={x.preview} muted playsInline preload="metadata" /> : <img src={x.preview} alt="" />}
          {x.status === 'working' && <span className="tray-veil"><span className="spinner" aria-hidden="true" /><span className="sr">กำลังอัปโหลด</span></span>}
          {x.status === 'error' && <span className="tray-veil tray-bad" title={x.note}><Icon name="info" size={18} /><span className="sr">{x.note}</span></span>}
          <button type="button" className="tray-x" onClick={() => tray.remove(x.id)} aria-label="เอาไฟล์นี้ออก"><Icon name="x" size={14} /></button>
        </li>
      )))}
    </ul>
  );
}
