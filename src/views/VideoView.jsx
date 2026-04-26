import { useState, useEffect, useRef, useMemo } from 'react';
import { VIDEO_LIBRARY, getVideoId, getPlaylistId, getThumbnail, isPlaylistUrl, isChannelUrl } from '../data/videos.js';
import { SUBJECTS } from '../data/curriculum.js';
import { useLocalStorage } from '../hooks/useStorage.js';

// ── Playlist preview cache (first video thumbnail + count) ──────────
// Single in-memory map shared across cards so 6 cards in the grid don't
// each fire their own request. Backed by localStorage with a 24h TTL.
//
// Dedupe in-flight requests via a separate Map<id, Promise> so two
// cards mounting at the same moment with the same playlist id share
// one fetch — fixes thundering-herd on first paint after subject switch.
const PLAYLIST_PREVIEW_CACHE = new Map();
const INFLIGHT = new Map();
const PLAYLIST_TTL = 24 * 60 * 60 * 1000;
const SUBSCRIBERS = new Map(); // playlistId -> Set<setter>

function readCachedPreview(playlistId) {
  if (!playlistId) return null;
  if (PLAYLIST_PREVIEW_CACHE.has(playlistId)) return PLAYLIST_PREVIEW_CACHE.get(playlistId);
  try {
    const raw = window.localStorage.getItem('vmx-pl-preview-' + playlistId);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (Date.now() - (parsed?.cachedAt || 0) < PLAYLIST_TTL) {
      PLAYLIST_PREVIEW_CACHE.set(playlistId, parsed.data);
      return parsed.data;
    }
  } catch {}
  return null;
}

function fetchPreview(playlistId) {
  if (!playlistId) return Promise.resolve(null);
  if (PLAYLIST_PREVIEW_CACHE.has(playlistId)) return Promise.resolve(PLAYLIST_PREVIEW_CACHE.get(playlistId));
  const cached = readCachedPreview(playlistId);
  if (cached) return Promise.resolve(cached);
  if (INFLIGHT.has(playlistId)) return INFLIGHT.get(playlistId);

  const p = fetch(`/api/playlist?id=${encodeURIComponent(playlistId)}`)
    .then((r) => (r.ok ? r.json() : null))
    .then((json) => {
      if (!json?.items?.length) return null;
      const first = json.items[0];
      const data = {
        thumb: first.thumb || `https://img.youtube.com/vi/${first.id}/hqdefault.jpg`,
        firstTitle: first.title,
        count: json.count ?? json.items.length,
      };
      PLAYLIST_PREVIEW_CACHE.set(playlistId, data);
      try {
        window.localStorage.setItem('vmx-pl-preview-' + playlistId, JSON.stringify({ data, cachedAt: Date.now() }));
      } catch {}
      // Notify any subscribers (cards mounted before fetch finished)
      const subs = SUBSCRIBERS.get(playlistId);
      if (subs) subs.forEach((set) => set(data));
      return data;
    })
    .catch(() => null)
    .finally(() => { INFLIGHT.delete(playlistId); });

  INFLIGHT.set(playlistId, p);
  return p;
}

function usePlaylistPreview(playlistId) {
  const [preview, setPreview] = useState(() => readCachedPreview(playlistId));

  useEffect(() => {
    if (!playlistId) return;
    const cached = readCachedPreview(playlistId);
    if (cached) { setPreview(cached); return; }
    // Subscribe so that if another card kicks the fetch off, we get the result
    if (!SUBSCRIBERS.has(playlistId)) SUBSCRIBERS.set(playlistId, new Set());
    SUBSCRIBERS.get(playlistId).add(setPreview);
    fetchPreview(playlistId);
    return () => {
      const s = SUBSCRIBERS.get(playlistId);
      if (s) { s.delete(setPreview); if (!s.size) SUBSCRIBERS.delete(playlistId); }
    };
  }, [playlistId]);

  return preview;
}

// Prefetch every known playlist with a small concurrency cap so we
// don't hammer the serverless function (and don't hit YouTube quota).
async function prefetchAll(playlistIds, concurrency = 3) {
  const todo = playlistIds.filter((id) => !PLAYLIST_PREVIEW_CACHE.has(id) && !readCachedPreview(id));
  let i = 0;
  const workers = Array.from({ length: Math.min(concurrency, todo.length) }, async () => {
    while (i < todo.length) {
      const id = todo[i++];
      await fetchPreview(id);
    }
  });
  await Promise.all(workers);
}

// ============================================================
// VideoView — main page (grid of subject cards / playlist tiles)
// ============================================================

export default function VideoView({ goHome }) {
  const [filter, setFilter] = useState('all');
  const [playing, setPlaying] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [editingIdx, setEditingIdx] = useState(null);
  const [customVideos, setCustomVideos] = useLocalStorage('vmx-custom-videos', []);
  const [watched, setWatched] = useLocalStorage('vmx-watched-videos', {});

  const [form, setForm] = useState({ subject: 'surg2', topic: '', url: '', author: '', duration: '' });

  const allVideos = [...VIDEO_LIBRARY, ...customVideos];
  const filtered = filter === 'all' ? allVideos : allVideos.filter((v) => v.subject === filter);

  // Prefetch every playlist preview as soon as VideoView mounts so subject
  // filter switches feel instant (thumbnails are ready in the cache by then).
  useEffect(() => {
    const ids = allVideos
      .map((v) => getPlaylistId(v.url))
      .filter((id) => id);
    if (ids.length) prefetchAll(ids).catch(() => {});
    // Run once per mount — cache is module-level, customVideos changes don't matter much
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startAdd = () => {
    setForm({ subject: filter !== 'all' ? filter : 'surg2', topic: '', url: '', author: '', duration: '' });
    setEditingIdx(null);
    setShowAdd(true);
  };

  const startEdit = (idx) => {
    const v = customVideos[idx];
    setForm({ subject: v.subject, topic: v.topic, url: v.url, author: v.author || '', duration: v.duration || '' });
    setEditingIdx(idx);
    setShowAdd(true);
  };

  const save = () => {
    if (!form.url.trim() || !form.topic.trim()) { alert('กรุณากรอก URL และหัวข้อ'); return; }
    const newVid = { ...form, custom: true };
    if (editingIdx !== null) {
      const arr = [...customVideos]; arr[editingIdx] = newVid; setCustomVideos(arr);
    } else {
      setCustomVideos([...customVideos, newVid]);
    }
    setShowAdd(false);
  };

  const deleteCustom = (idx) => {
    if (!confirm('ลบคลิปนี้?')) return;
    setCustomVideos(customVideos.filter((_, i) => i !== idx));
  };

  const customIdx = (vid) => customVideos.findIndex((v) => v.url === vid.url && v.topic === vid.topic);
  const markWatched = (videoId) => {
    if (!videoId) return;
    setWatched({ ...watched, [videoId]: { watchedAt: Date.now() } });
  };

  const watchedCount = Object.keys(watched).length;

  return (
    <>
      <div className="vmx-hero">
        <h1>🎥 คลิป<em>ย้อนหลัง</em></h1>
        <p>
          คลิปจากช่อง <a href="https://www.youtube.com/@dai.1387" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--clr-sage)' }}>Dai (@dai.1387)</a> และอื่นๆ — คลิกเข้าไปเพื่อเลือกคลิปใน playlist ได้
          {watchedCount > 0 && <> · 👁 ดูแล้ว <strong>{watchedCount}</strong> คลิป</>}
        </p>
      </div>

      <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 20, flexWrap: 'wrap' }}>
        <div className="vmx-chip-row" style={{ flex: 1 }}>
          {SUBJECTS.map((s) => (
            <button key={s.id} className={`vmx-chip ${filter === s.id ? 'active' : ''}`} onClick={() => setFilter(s.id)}>
              {s.icon} {s.name}
            </button>
          ))}
        </div>
        <button className="vmx-btn vmx-btn-primary vmx-btn-sm" onClick={startAdd}>➕ เพิ่มคลิป</button>
      </div>

      {showAdd && <AddEditModal {...{ form, setForm, save, onClose: () => setShowAdd(false), editing: editingIdx !== null }} />}
      {playing && <PlayerModal video={playing} onClose={() => setPlaying(null)} watched={watched} markWatched={markWatched} />}

      {filtered.length === 0 ? (
        <div className="vmx-empty">ยังไม่มีคลิปในวิชานี้ — กด "➕ เพิ่มคลิป" เพื่อเพิ่ม</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {filtered.map((v, idx) => (
            <VideoCard
              key={idx}
              video={v}
              onPlay={() => setPlaying(v)}
              onEdit={v.custom ? () => startEdit(customIdx(v)) : null}
              onDelete={v.custom ? () => deleteCustom(customIdx(v)) : null}
              watched={watched}
            />
          ))}
        </div>
      )}

      <div style={{ marginTop: 24, padding: 16, borderRadius: 12, background: 'var(--clr-surface-2)', fontSize: 13, color: 'var(--clr-ink-soft)', lineHeight: 1.6 }}>
        ⚠️ <strong>Disclaimer:</strong> คลิปเหล่านี้เป็นของเจ้าของช่องบน YouTube ต้นฉบับ ไม่ใช่ผลงานของ VetMock<br/>
        💡 คลิปที่เพิ่มเอง + ประวัติการดู เก็บใน browser ของพี่เท่านั้น (localStorage)
      </div>

      <div className="vmx-btn-row" style={{ marginTop: 24 }}>
        <button className="vmx-btn vmx-btn-ghost" onClick={goHome}>← หน้าแรก</button>
      </div>
    </>
  );
}

// ============================================================
// VideoCard — single tile in the main grid
// ============================================================
function VideoCard({ video, onPlay, onEdit, onDelete, watched }) {
  const subject = SUBJECTS.find((s) => s.id === video.subject);
  const playlist = isPlaylistUrl(video.url);
  const isChannel = isChannelUrl(video.url) && !getVideoId(video.url) && !getPlaylistId(video.url);
  const videoId = getVideoId(video.url);
  const isWatched = videoId && watched[videoId];

  return (
    <div className="vmx-mode-card" style={{ textAlign: 'left', padding: 0, overflow: 'hidden', position: 'relative', transition: 'transform 0.15s ease, box-shadow 0.15s ease' }}>
      <button
        onClick={onPlay}
        style={{ all: 'unset', cursor: 'pointer', display: 'block', width: '100%' }}
        onMouseEnter={(e) => { e.currentTarget.parentElement.style.transform = 'translateY(-2px)'; e.currentTarget.parentElement.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)'; }}
        onMouseLeave={(e) => { e.currentTarget.parentElement.style.transform = ''; e.currentTarget.parentElement.style.boxShadow = ''; }}
      >
        <ThumbnailWithPlayOverlay video={video} subject={subject} playlist={playlist} isChannel={isChannel} />
        <div style={{ padding: 14 }}>
          <div style={{ fontSize: 10, fontFamily: 'JetBrains Mono, monospace', color: subject?.color || 'var(--clr-ink-soft)', textTransform: 'uppercase', marginBottom: 4, letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: 6 }}>
            <span>{subject?.icon} {subject?.name}</span>
            {isWatched && <span title="ดูแล้ว" style={{ color: 'var(--clr-sage)' }}>· ✓ ดูแล้ว</span>}
          </div>
          <div style={{ fontFamily: 'Fraunces, serif', fontWeight: 600, fontSize: 15, marginBottom: 4, lineHeight: 1.3 }}>
            {video.topic}
          </div>
          <div style={{ fontSize: 12, color: 'var(--clr-ink-soft)', fontStyle: 'italic' }}>
            by {video.author || 'Unknown'}
          </div>
        </div>
      </button>

      {(onEdit || onDelete) && (
        <div style={{ position: 'absolute', top: 8, right: 8, display: 'flex', gap: 4 }}>
          {onEdit && (
            <button className="vmx-btn vmx-btn-ghost vmx-btn-sm" style={{ padding: '4px 8px', fontSize: 11, background: 'rgba(255,255,255,0.95)' }}
              onClick={(e) => { e.stopPropagation(); onEdit(); }}>✏️</button>
          )}
          {onDelete && (
            <button className="vmx-btn vmx-btn-ghost vmx-btn-sm" style={{ padding: '4px 8px', fontSize: 11, background: 'rgba(255,255,255,0.95)' }}
              onClick={(e) => { e.stopPropagation(); onDelete(); }}>🗑</button>
          )}
        </div>
      )}
    </div>
  );
}

function ThumbnailWithPlayOverlay({ video, subject, playlist, isChannel }) {
  // Single videos use direct YouTube thumbnail; playlists use first-video preview from API
  const playlistId = playlist ? getPlaylistId(video.url) : null;
  const playlistPreview = usePlaylistPreview(playlistId);
  const directThumb = !playlist && !isChannel ? getThumbnail(video.url, 'hq') : null;
  const [errored, setErrored] = useState(false);

  const thumbSrc = directThumb || playlistPreview?.thumb;

  if (thumbSrc && !errored) {
    return (
      <div style={{ width: '100%', aspectRatio: '16/9', background: '#000', position: 'relative', overflow: 'hidden' }}>
        <img src={thumbSrc} alt={video.topic} loading="lazy"
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease' }}
          onError={() => setErrored(true)}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = ''; }}
        />
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(to top, rgba(0,0,0,0.4), transparent 60%)' }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(0,0,0,0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 22, paddingLeft: 4 }}>
            {playlist ? '📋' : '▶'}
          </div>
        </div>
        {/* Single video duration */}
        {!playlist && video.duration && (
          <div style={{ position: 'absolute', bottom: 8, right: 8, padding: '2px 7px', background: 'rgba(0,0,0,0.85)', color: 'white', borderRadius: 4, fontSize: 11, fontFamily: 'JetBrains Mono, monospace', fontWeight: 600 }}>
            {video.duration}
          </div>
        )}
        {/* Playlist count badge (top-left ribbon) */}
        {playlist && playlistPreview && (
          <div style={{ position: 'absolute', top: 8, left: 8, padding: '3px 9px', background: 'rgba(0,0,0,0.78)', color: 'white', borderRadius: 6, fontSize: 11, fontFamily: 'JetBrains Mono, monospace', fontWeight: 600, letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: 5 }}>
            📋 PLAYLIST · {playlistPreview.count}
          </div>
        )}
      </div>
    );
  }

  // Fallback / channel / loading playlist — gradient placeholder
  const bg = playlist
    ? 'linear-gradient(135deg, #c26d6d, #e8d4a8)'
    : isChannel
      ? 'linear-gradient(135deg, #a8c0a8, #3d6b82)'
      : 'var(--clr-surface-2)';
  return (
    <div style={{ width: '100%', aspectRatio: '16/9', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 4, color: 'white' }}>
      <div style={{ fontSize: 50 }}>{playlist ? '📋' : isChannel ? '📺' : '🎬'}</div>
      <div style={{ fontSize: 11, fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.1em', fontWeight: 600 }}>
        {playlist ? 'PLAYLIST' : isChannel ? 'CHANNEL' : 'VIDEO'}
      </div>
      {playlist && (
        <div style={{ fontSize: 10, marginTop: 4, opacity: 0.85 }}>กำลังโหลดหน้าปก…</div>
      )}
    </div>
  );
}

// ============================================================
// PlayerModal — full-featured: search, prev/next, watched, kbd nav
// ============================================================
function PlayerModal({ video, onClose, watched, markWatched }) {
  const playlistId = getPlaylistId(video.url);
  const videoId = getVideoId(video.url);
  const isChannel = isChannelUrl(video.url) && !videoId && !playlistId;
  const [currentVideoId, setCurrentVideoId] = useState(videoId);
  const [showList, setShowList] = useState(false);
  const [playlistItems, setPlaylistItems] = useState([]);
  const [loadingList, setLoadingList] = useState(false);
  const [listError, setListError] = useState('');
  const [listNote, setListNote] = useState('');
  const [search, setSearch] = useState('');
  const sidebarRef = useRef(null);
  const activeItemRef = useRef(null);
  const searchInputRef = useRef(null);

  // Fetch playlist items
  useEffect(() => {
    if (!playlistId) return;
    const ctrl = new AbortController();
    setLoadingList(true);
    setListError(''); setListNote('');

    (async () => {
      try {
        const r = await fetch(`/api/playlist?id=${encodeURIComponent(playlistId)}`, { signal: ctrl.signal });
        if (!r.ok) throw new Error(`api ${r.status}`);
        const data = await r.json();
        if (ctrl.signal.aborted) return;
        const items = data?.items || [];
        setPlaylistItems(items);
        if (items.length > 0) {
          setShowList(true);
          if (!currentVideoId) setCurrentVideoId(items[0].id);
        } else if (data?.note) {
          setListNote(data.note);
        }
        setLoadingList(false);
      } catch (err) {
        if (ctrl.signal.aborted) return;
        console.warn('playlist fetch failed:', err?.message);
        setListError('ดึงรายการคลิปไม่ได้ — ใช้ปุ่ม Playlist ในเครื่องเล่น (≡) หรือเปิดบน YouTube');
        setLoadingList(false);
      }
    })();
    return () => ctrl.abort();
  }, [playlistId]);

  // Mark watched after 5 seconds of being on the video
  useEffect(() => {
    if (!currentVideoId) return;
    const t = setTimeout(() => markWatched(currentVideoId), 5000);
    return () => clearTimeout(t);
  }, [currentVideoId]);

  // Filtered items for search
  const filteredItems = useMemo(() => {
    if (!search.trim()) return playlistItems;
    const q = search.toLowerCase();
    return playlistItems.filter((it) => it.title.toLowerCase().includes(q));
  }, [playlistItems, search]);

  const currentIdx = playlistItems.findIndex((p) => p.id === currentVideoId);
  const goPrev = () => { if (currentIdx > 0) setCurrentVideoId(playlistItems[currentIdx - 1].id); };
  const goNext = () => { if (currentIdx >= 0 && currentIdx < playlistItems.length - 1) setCurrentVideoId(playlistItems[currentIdx + 1].id); };

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key === 'Escape') { onClose(); return; }
      if (e.key === 'ArrowLeft') { e.preventDefault(); goPrev(); }
      if (e.key === 'ArrowRight') { e.preventDefault(); goNext(); }
      if (e.key === '/' && playlistItems.length > 0) { e.preventDefault(); searchInputRef.current?.focus(); }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [currentIdx, playlistItems.length, onClose]);

  // Auto-scroll active item into view
  useEffect(() => {
    if (activeItemRef.current && sidebarRef.current) {
      activeItemRef.current.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }, [currentVideoId]);

  // Build embed URL
  let embedUrl = null;
  if (currentVideoId) {
    embedUrl = playlistId
      ? `https://www.youtube.com/embed/${currentVideoId}?autoplay=1&list=${playlistId}&rel=0&modestbranding=1`
      : `https://www.youtube.com/embed/${currentVideoId}?autoplay=1&rel=0&modestbranding=1`;
  } else if (playlistId) {
    embedUrl = `https://www.youtube.com/embed/videoseries?list=${playlistId}&rel=0&modestbranding=1`;
  }

  const currentItem = playlistItems[currentIdx];

  return (
    <div className="vmx-modal-overlay" onClick={onClose}>
      <div className="vmx-modal" style={{ maxWidth: showList && playlistItems.length > 0 ? 1200 : 800, width: '100%', padding: 0, overflow: 'hidden' }} onClick={(e) => e.stopPropagation()}>

        {/* Header bar */}
        <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--clr-border)', display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 200 }}>
            <h2 style={{ margin: 0, fontSize: 17, fontFamily: 'Fraunces, serif', fontWeight: 600 }}>{video.topic}</h2>
            {playlistItems.length > 0 && (
              <div style={{ fontSize: 11, color: 'var(--clr-ink-soft)', fontFamily: 'JetBrains Mono, monospace', marginTop: 2 }}>
                📋 {playlistItems.length} คลิป
                {currentIdx >= 0 && <> · กำลังเล่น <strong>{currentIdx + 1} / {playlistItems.length}</strong></>}
              </div>
            )}
          </div>
          {playlistId && playlistItems.length > 0 && (
            <button
              className="vmx-btn vmx-btn-ghost vmx-btn-sm"
              onClick={() => setShowList(!showList)}
              style={{ flexShrink: 0 }}
              title="แสดง / ซ่อน list"
            >
              {showList ? '🎬 ซ่อน list' : `📋 ดู list (${playlistItems.length})`}
            </button>
          )}
          <button className="vmx-btn vmx-btn-ghost vmx-btn-sm" onClick={onClose} style={{ flexShrink: 0, fontSize: 18, padding: '4px 10px' }} title="ปิด (Esc)">✕</button>
        </div>

        <div className="vmx-player-grid" style={{ display: 'grid', gridTemplateColumns: showList && playlistItems.length > 0 ? 'minmax(0, 2.2fr) minmax(280px, 1fr)' : '1fr', gap: 0 }}>
          {/* Player column */}
          <div style={{ padding: 18, paddingRight: showList && playlistItems.length > 0 ? 12 : 18 }}>
            {embedUrl ? (
              <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, borderRadius: 12, overflow: 'hidden', background: '#000', boxShadow: '0 4px 16px rgba(0,0,0,0.18)' }}>
                <iframe
                  src={embedUrl}
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={video.topic}
                />
              </div>
            ) : isChannel ? (
              <div style={{ padding: 30, background: 'var(--clr-surface-2)', borderRadius: 12, textAlign: 'center' }}>
                <div style={{ fontSize: 40, marginBottom: 8 }}>📺</div>
                <div style={{ fontSize: 14, color: 'var(--clr-ink-soft)' }}>เป็น link ของ channel — เปิด YouTube เพื่อเลือกดู</div>
              </div>
            ) : (
              <div style={{ padding: 20, background: 'var(--clr-rose-soft)', borderRadius: 12 }}>⚠️ ไม่สามารถ embed ได้ — กรุณาเปิดใน YouTube</div>
            )}

            {/* Now playing line + prev/next controls */}
            {playlistItems.length > 0 && currentItem && (
              <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                <button className="vmx-btn vmx-btn-ghost vmx-btn-sm" onClick={goPrev} disabled={currentIdx <= 0} title="ก่อนหน้า (←)" style={{ padding: '6px 12px' }}>← Prev</button>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div style={{ fontSize: 10, fontFamily: 'JetBrains Mono, monospace', color: 'var(--clr-ink-soft)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    Now playing · #{currentIdx + 1}
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--clr-ink)', marginTop: 2 }}>
                    {currentItem.title}
                  </div>
                  {currentItem.channel && (
                    <div style={{ fontSize: 11, color: 'var(--clr-ink-soft)', fontStyle: 'italic', marginTop: 1 }}>by {currentItem.channel}</div>
                  )}
                </div>
                <button className="vmx-btn vmx-btn-primary vmx-btn-sm" onClick={goNext} disabled={currentIdx < 0 || currentIdx >= playlistItems.length - 1} title="ถัดไป (→)" style={{ padding: '6px 12px' }}>Next →</button>
              </div>
            )}

            {/* Multi-channel playlist note */}
            {playlistId && !loadingList && playlistItems.length === 0 && (listNote || listError) && (
              <div style={{ marginTop: 14, padding: '10px 12px', borderRadius: 10, background: 'var(--clr-surface-2)', border: '1px solid var(--clr-border)', fontSize: 12, color: 'var(--clr-ink-soft)', lineHeight: 1.6 }}>
                💡 <strong>ดึงรายการคลิปไม่ได้</strong> — playlist อาจรวมจากหลายช่อง<br/>
                <span style={{ fontSize: 11 }}>
                  คลิกปุ่ม <kbd style={{ padding: '1px 6px', background: 'var(--clr-bg)', borderRadius: 4, fontFamily: 'JetBrains Mono, monospace' }}>≡</kbd> ในเครื่องเล่น หรือ
                  <a href={video.url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--clr-sage)', marginLeft: 4, textDecoration: 'underline' }}>เปิดใน YouTube →</a>
                </span>
              </div>
            )}

            {/* Footer actions */}
            <div style={{ marginTop: 14, display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
              <a className="vmx-btn vmx-btn-ghost vmx-btn-sm" href={currentVideoId ? `https://www.youtube.com/watch?v=${currentVideoId}${playlistId ? `&list=${playlistId}` : ''}` : video.url} target="_blank" rel="noopener noreferrer">
                เปิดใน YouTube ↗
              </a>
              {currentVideoId && (
                <button className="vmx-btn vmx-btn-ghost vmx-btn-sm" onClick={() => {
                  navigator.clipboard?.writeText(currentVideoId ? `https://www.youtube.com/watch?v=${currentVideoId}${playlistId ? `&list=${playlistId}` : ''}` : video.url);
                  alert('คัดลอกลิงก์แล้ว');
                }}>📋 Copy link</button>
              )}
              <div style={{ flex: 1 }} />
              <span style={{ fontSize: 10, color: 'var(--clr-ink-soft)', fontFamily: 'JetBrains Mono, monospace', opacity: 0.7 }}>
                ⌨ ← → · / · Esc
              </span>
            </div>
          </div>

          {/* Sidebar */}
          {showList && playlistId && playlistItems.length > 0 && (
            <div className="vmx-player-sidebar" style={{ background: 'var(--clr-surface-2)', borderLeft: '1px solid var(--clr-border)', display: 'flex', flexDirection: 'column', maxHeight: 'min(80vh, 700px)' }}>
              <div style={{ padding: '12px 14px', borderBottom: '1px solid var(--clr-border)', display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ fontSize: 11, fontFamily: 'JetBrains Mono, monospace', color: 'var(--clr-ink-soft)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', justifyContent: 'space-between' }}>
                  <span>📋 Playlist</span>
                  <span>{filteredItems.length}/{playlistItems.length}</span>
                </div>
                {playlistItems.length >= 6 && (
                  <input
                    ref={searchInputRef}
                    type="search"
                    placeholder="🔍 ค้นหา (กด /)"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{ padding: '6px 10px', fontSize: 12, borderRadius: 6, border: '1px solid var(--clr-border)', background: 'var(--clr-bg)', color: 'var(--clr-ink)', fontFamily: 'inherit' }}
                  />
                )}
              </div>

              <div ref={sidebarRef} style={{ flex: 1, overflowY: 'auto', padding: 8 }}>
                {filteredItems.length === 0 && search && (
                  <div style={{ padding: 16, textAlign: 'center', fontSize: 12, color: 'var(--clr-ink-soft)', fontStyle: 'italic' }}>
                    ไม่พบคลิปที่ตรงกับ "{search}"
                  </div>
                )}
                {filteredItems.map((item) => {
                  const realIdx = playlistItems.findIndex((p) => p.id === item.id);
                  const active = item.id === currentVideoId;
                  const isWatched = watched && watched[item.id];
                  return (
                    <button
                      key={item.id}
                      ref={active ? activeItemRef : null}
                      onClick={() => setCurrentVideoId(item.id)}
                      style={{
                        all: 'unset',
                        display: 'flex',
                        gap: 10,
                        padding: 8,
                        marginBottom: 4,
                        cursor: 'pointer',
                        borderRadius: 8,
                        background: active ? 'var(--clr-rose-soft)' : 'transparent',
                        borderLeft: active ? '3px solid var(--clr-rose)' : '3px solid transparent',
                        transition: 'background 0.12s',
                      }}
                      onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = 'var(--clr-bg)'; }}
                      onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = 'transparent'; }}
                    >
                      <div style={{ position: 'relative', flexShrink: 0, width: 96, height: 56, borderRadius: 6, overflow: 'hidden', background: '#000' }}>
                        <img
                          src={item.thumb || `https://img.youtube.com/vi/${item.id}/mqdefault.jpg`}
                          alt=""
                          loading="lazy"
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          onError={(e) => { e.target.src = `https://img.youtube.com/vi/${item.id}/default.jpg`; }}
                        />
                        {item.duration && (
                          <div style={{ position: 'absolute', bottom: 3, right: 3, padding: '0px 5px', background: 'rgba(0,0,0,0.85)', color: 'white', borderRadius: 3, fontSize: 10, fontFamily: 'JetBrains Mono, monospace', fontWeight: 600 }}>
                            {item.duration}
                          </div>
                        )}
                        {active && (
                          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.4)', color: 'white', fontSize: 18 }}>▶</div>
                        )}
                      </div>
                      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <div>
                          <div style={{ fontSize: 10, fontFamily: 'JetBrains Mono, monospace', color: 'var(--clr-ink-soft)', marginBottom: 2, display: 'flex', alignItems: 'center', gap: 4 }}>
                            <span>#{realIdx + 1}</span>
                            {isWatched && <span title="ดูแล้ว" style={{ color: 'var(--clr-sage)' }}>✓</span>}
                          </div>
                          <div style={{ fontSize: 12, lineHeight: 1.35, color: 'var(--clr-ink)', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', fontWeight: active ? 600 : 400 }}>
                            {item.title}
                          </div>
                        </div>
                        {item.channel && (
                          <div style={{ fontSize: 10, color: 'var(--clr-ink-soft)', fontStyle: 'italic', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {item.channel}
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Loading state if list pending and no items */}
        {loadingList && playlistId && (
          <div style={{ position: 'absolute', top: 70, right: 18, padding: '4px 10px', borderRadius: 6, background: 'var(--clr-surface-2)', fontSize: 11, color: 'var(--clr-ink-soft)', fontFamily: 'JetBrains Mono, monospace' }}>
            ⏳ กำลังโหลด list...
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// AddEditModal — form to add/edit custom video
// ============================================================
function AddEditModal({ form, setForm, save, onClose, editing }) {
  return (
    <div className="vmx-modal-overlay" onClick={onClose}>
      <div className="vmx-modal" onClick={(e) => e.stopPropagation()}>
        <h2>{editing ? 'แก้ไขคลิป' : 'เพิ่มคลิป YouTube'}</h2>

        <div className="vmx-form-group">
          <label>YouTube URL *</label>
          <input
            type="url"
            value={form.url}
            onChange={(e) => setForm({ ...form, url: e.target.value })}
            placeholder="https://youtu.be/xxx หรือ playlist link"
            autoFocus
          />
          {form.url && (
            <div style={{ fontSize: 11, fontFamily: 'JetBrains Mono, monospace', color: 'var(--clr-ink-soft)', marginTop: 6 }}>
              {getVideoId(form.url) && `✓ Video ID: ${getVideoId(form.url)}`}
              {!getVideoId(form.url) && getPlaylistId(form.url) && `📋 Playlist ID: ${getPlaylistId(form.url)}`}
              {!getVideoId(form.url) && !getPlaylistId(form.url) && isChannelUrl(form.url) && `📺 Channel link`}
              {!getVideoId(form.url) && !getPlaylistId(form.url) && !isChannelUrl(form.url) && `⚠️ ไม่ใช่ YouTube URL ที่ถูกต้อง`}
            </div>
          )}
        </div>

        <div className="vmx-form-group">
          <label>หัวข้อ *</label>
          <input type="text" value={form.topic} onChange={(e) => setForm({ ...form, topic: e.target.value })} placeholder="เช่น Cherry eye surgery" />
        </div>

        <div className="vmx-form-group">
          <label>วิชา</label>
          <select value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })}>
            {SUBJECTS.filter((s) => s.id !== 'all').map((s) => (
              <option key={s.id} value={s.id}>{s.icon} {s.name}</option>
            ))}
          </select>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <div className="vmx-form-group">
            <label>ผู้สร้าง (optional)</label>
            <input value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} placeholder="Dai" />
          </div>
          <div className="vmx-form-group">
            <label>ความยาว (optional)</label>
            <input value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} placeholder="10:30 หรือ Playlist" />
          </div>
        </div>

        <div className="vmx-btn-row">
          <button className="vmx-btn vmx-btn-ghost" onClick={onClose}>ยกเลิก</button>
          <button className="vmx-btn vmx-btn-primary" onClick={save}>💾 บันทึก</button>
        </div>
      </div>
    </div>
  );
}
