import { useState, useEffect, useRef } from 'react';
import { VIDEO_LIBRARY, getVideoId, getPlaylistId, getThumbnail, isPlaylistUrl, isChannelUrl, getVideosBySubject } from '../data/videos.js';
import { SUBJECTS } from '../data/curriculum.js';
import { useLocalStorage } from '../hooks/useStorage.js';

export default function VideoView({ goHome }) {
  const [filter, setFilter] = useState('all');
  const [playing, setPlaying] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [editingIdx, setEditingIdx] = useState(null);
  const [customVideos, setCustomVideos] = useLocalStorage('vmx-custom-videos', []);

  const [form, setForm] = useState({
    subject: 'surg2',
    topic: '',
    url: '',
    author: '',
    duration: '',
  });

  // Combine built-in + custom
  const allVideos = [...VIDEO_LIBRARY, ...customVideos];
  const filtered = filter === 'all' ? allVideos : allVideos.filter((v) => v.subject === filter);

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
    if (!form.url.trim() || !form.topic.trim()) {
      alert('กรุณากรอก URL และหัวข้อ');
      return;
    }
    const newVid = { ...form, custom: true };
    if (editingIdx !== null) {
      const arr = [...customVideos];
      arr[editingIdx] = newVid;
      setCustomVideos(arr);
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

  return (
    <>
      <div className="vmx-hero">
        <h1>🎥 คลิป<em>ย้อนหลัง</em></h1>
        <p>คลิปจากช่อง <a href="https://www.youtube.com/@dai.1387" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--clr-sage)' }}>Dai (@dai.1387)</a> และคลิปอื่นๆ — คลิกเข้าไปเพื่อเลือกคลิปใน playlist ได้</p>
      </div>

      <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 20, flexWrap: 'wrap' }}>
        <div className="vmx-chip-row" style={{ flex: 1 }}>
          {SUBJECTS.map((s) => (
            <button key={s.id} className={`vmx-chip ${filter === s.id ? 'active' : ''}`} onClick={() => setFilter(s.id)}>
              {s.icon} {s.name}
            </button>
          ))}
        </div>
        <button className="vmx-btn vmx-btn-primary vmx-btn-sm" onClick={startAdd}>
          ➕ เพิ่มคลิป
        </button>
      </div>

      {/* Add/Edit modal */}
      {showAdd && <AddEditModal {...{ form, setForm, save, onClose: () => setShowAdd(false), editing: editingIdx !== null }} />}

      {/* Player modal */}
      {playing && <PlayerModal video={playing} onClose={() => setPlaying(null)} />}

      {filtered.length === 0 ? (
        <div className="vmx-empty">
          ยังไม่มีคลิปในวิชานี้ — กด "➕ เพิ่มคลิป" เพื่อเพิ่ม
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 14 }}>
          {filtered.map((v, idx) => {
            const subject = SUBJECTS.find((s) => s.id === v.subject);
            const thumb = getThumbnail(v.url);
            const playlist = isPlaylistUrl(v.url);
            const isChannel = isChannelUrl(v.url) && !getVideoId(v.url) && !getPlaylistId(v.url);
            const cIdx = v.custom ? customIdx(v) : -1;

            return (
              <div key={idx} className="vmx-mode-card" style={{ textAlign: 'left', padding: 0, overflow: 'hidden', position: 'relative' }}>
                <button onClick={() => setPlaying(v)} style={{ all: 'unset', cursor: 'pointer', display: 'block', width: '100%' }}>
                  {thumb ? (
                    <div style={{ width: '100%', aspectRatio: '16/9', background: '#000', position: 'relative', overflow: 'hidden' }}>
                      <img src={thumb} alt={v.topic} style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => { e.target.style.display = 'none'; }} />
                      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.3)', color: 'white', fontSize: 32 }}>▶️</div>
                      {v.duration && (
                        <div style={{ position: 'absolute', bottom: 8, right: 8, padding: '2px 6px', background: 'rgba(0,0,0,0.8)', color: 'white', borderRadius: 4, fontSize: 11, fontFamily: 'JetBrains Mono, monospace' }}>
                          {v.duration}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div style={{ width: '100%', aspectRatio: '16/9', background: playlist ? 'linear-gradient(135deg, #c26d6d, #e8d4a8)' : isChannel ? 'linear-gradient(135deg, #a8c0a8, #3d6b82)' : 'var(--clr-surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 4, color: 'white' }}>
                      <div style={{ fontSize: 50 }}>{playlist ? '📋' : isChannel ? '📺' : '🎬'}</div>
                      <div style={{ fontSize: 11, fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.1em', fontWeight: 600 }}>
                        {playlist ? 'PLAYLIST' : isChannel ? 'CHANNEL' : 'VIDEO'}
                      </div>
                      {playlist && (
                        <div style={{ fontSize: 10, marginTop: 4, opacity: 0.85 }}>คลิกเพื่อเลือกคลิป</div>
                      )}
                    </div>
                  )}
                  <div style={{ padding: 14 }}>
                    <div style={{ fontSize: 10, fontFamily: 'JetBrains Mono, monospace', color: subject?.color || 'var(--clr-ink-soft)', textTransform: 'uppercase', marginBottom: 4, letterSpacing: '0.08em' }}>
                      {subject?.icon} {subject?.name}
                    </div>
                    <div style={{ fontFamily: 'Fraunces, serif', fontWeight: 600, fontSize: 15, marginBottom: 4, lineHeight: 1.3 }}>
                      {v.topic}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--clr-ink-soft)', fontStyle: 'italic' }}>
                      by {v.author || 'Unknown'}
                    </div>
                  </div>
                </button>

                {v.custom && cIdx >= 0 && (
                  <div style={{ position: 'absolute', top: 8, right: 8, display: 'flex', gap: 4 }}>
                    <button className="vmx-btn vmx-btn-ghost vmx-btn-sm" style={{ padding: '4px 8px', fontSize: 11, background: 'rgba(255,255,255,0.9)' }}
                      onClick={(e) => { e.stopPropagation(); startEdit(cIdx); }}>✏️</button>
                    <button className="vmx-btn vmx-btn-ghost vmx-btn-sm" style={{ padding: '4px 8px', fontSize: 11, background: 'rgba(255,255,255,0.9)' }}
                      onClick={(e) => { e.stopPropagation(); deleteCustom(cIdx); }}>🗑</button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <div style={{ marginTop: 24, padding: 16, borderRadius: 12, background: 'var(--clr-surface-2)', fontSize: 13, color: 'var(--clr-ink-soft)', lineHeight: 1.6 }}>
        ⚠️ <strong>Disclaimer:</strong> คลิปเหล่านี้เป็นของเจ้าของช่องบน YouTube ต้นฉบับ ไม่ใช่ผลงานของ VetMock<br/>
        💡 คลิปที่เพิ่มเองจะเก็บใน browser ของพี่เท่านั้น (localStorage)
      </div>

      <div className="vmx-btn-row" style={{ marginTop: 24 }}>
        <button className="vmx-btn vmx-btn-ghost" onClick={goHome}>← หน้าแรก</button>
      </div>
    </>
  );
}

// ============================================================
// PlayerModal — เล่นคลิป + เลือกคลิปใน playlist ได้
// ============================================================
function PlayerModal({ video, onClose }) {
  const playlistId = getPlaylistId(video.url);
  const videoId = getVideoId(video.url);
  const isChannel = isChannelUrl(video.url) && !videoId && !playlistId;
  const [currentVideoId, setCurrentVideoId] = useState(videoId);
  const [showList, setShowList] = useState(!!playlistId);  // show list by default if playlist
  const [playlistItems, setPlaylistItems] = useState([]);
  const [loadingList, setLoadingList] = useState(false);
  const [listError, setListError] = useState('');

  // Race multiple CORS proxies in parallel — เอาตัวที่เร็วที่สุดที่สำเร็จ
  // แต่ละ proxy มี timeout 6 วินาที ถ้าทุกตัวล่ม → fallback เปิด YouTube
  useEffect(() => {
    if (!playlistId) return;
    const ctrl = new AbortController();
    setLoadingList(true);
    setListError('');

    const rssUrl = `https://www.youtube.com/feeds/videos.xml?playlist_id=${playlistId}`;
    const proxies = [
      (u) => `https://corsproxy.io/?${encodeURIComponent(u)}`,
      (u) => `https://api.allorigins.win/raw?url=${encodeURIComponent(u)}`,
      (u) => `https://api.codetabs.com/v1/proxy/?quest=${encodeURIComponent(u)}`,
      (u) => `https://thingproxy.freeboard.io/fetch/${u}`,
    ];

    const fetchOne = (makeProxy) => new Promise((resolve, reject) => {
      const t = setTimeout(() => reject(new Error('timeout')), 6000);
      fetch(makeProxy(rssUrl), { cache: 'no-store', signal: ctrl.signal })
        .then((r) => r.ok ? r.text() : Promise.reject(new Error(`HTTP ${r.status}`)))
        .then((xml) => {
          if (!xml || !xml.includes('<entry')) throw new Error('empty xml');
          const items = parseYouTubeRss(xml);
          if (!items.length) throw new Error('no items');
          clearTimeout(t);
          resolve(items);
        })
        .catch((e) => { clearTimeout(t); reject(e); });
    });

    Promise.any(proxies.map(fetchOne))
      .then((items) => {
        if (ctrl.signal.aborted) return;
        setPlaylistItems(items);
        if (!currentVideoId) setCurrentVideoId(items[0].id);
        setLoadingList(false);
      })
      .catch((err) => {
        if (ctrl.signal.aborted) return;
        console.warn('All playlist proxies failed:', err?.errors || err);
        setListError('ดึงรายการคลิปไม่ได้ — เปิดใน YouTube เพื่อเลือกคลิป');
        setLoadingList(false);
      });

    return () => ctrl.abort();
  }, [playlistId]);

  // Build embed URL
  let embedUrl = null;
  if (currentVideoId) {
    embedUrl = playlistId
      ? `https://www.youtube.com/embed/${currentVideoId}?autoplay=1&list=${playlistId}`
      : `https://www.youtube.com/embed/${currentVideoId}?autoplay=1`;
  } else if (playlistId) {
    embedUrl = `https://www.youtube.com/embed/videoseries?list=${playlistId}`;
  }

  return (
    <div className="vmx-modal-overlay" onClick={onClose}>
      <div className="vmx-modal" style={{ maxWidth: showList && playlistItems.length > 0 ? 1100 : 720, width: '95vw' }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, gap: 12, flexWrap: 'wrap' }}>
          <h2 style={{ margin: 0, fontSize: 18, flex: 1 }}>{video.topic}</h2>
          {playlistId && playlistItems.length > 0 && (
            <button
              className="vmx-btn vmx-btn-ghost vmx-btn-sm"
              onClick={() => setShowList(!showList)}
              style={{ flexShrink: 0 }}
            >
              {showList ? '🎬 ซ่อน list' : `📋 ดู list (${playlistItems.length})`}
            </button>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: showList && playlistItems.length > 0 ? 'minmax(0, 2fr) minmax(220px, 1fr)' : '1fr', gap: 12 }}>
          {/* Player */}
          <div>
            {embedUrl ? (
              <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, borderRadius: 12, overflow: 'hidden' }}>
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
                <div style={{ fontSize: 14, color: 'var(--clr-ink-soft)' }}>
                  เป็น link ของ channel — เปิด YouTube เพื่อเลือกดู
                </div>
              </div>
            ) : (
              <div style={{ padding: 20, background: 'var(--clr-rose-soft)', borderRadius: 12 }}>
                ⚠️ ไม่สามารถ embed ได้ — กรุณาเปิดใน YouTube
              </div>
            )}

            {currentVideoId && playlistItems.length > 0 && (() => {
              const idx = playlistItems.findIndex((p) => p.id === currentVideoId);
              const current = playlistItems[idx];
              return current ? (
                <div style={{ marginTop: 10, fontSize: 13, color: 'var(--clr-ink)' }}>
                  <strong>{idx + 1}.</strong> {current.title}
                </div>
              ) : null;
            })()}
          </div>

          {/* Playlist sidebar */}
          {showList && playlistId && (
            <div style={{ background: 'var(--clr-surface-2)', borderRadius: 12, padding: 12, maxHeight: 'min(60vh, 500px)', overflowY: 'auto' }}>
              <div style={{ fontSize: 12, fontFamily: 'JetBrains Mono, monospace', color: 'var(--clr-ink-soft)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
                📋 Playlist {playlistItems.length > 0 && `(${playlistItems.length})`}
              </div>

              {loadingList && (
                <div className="vmx-empty" style={{ padding: 20, fontSize: 12 }}>กำลังโหลด...</div>
              )}

              {listError && (
                <div style={{ padding: 12, fontSize: 12, color: 'var(--clr-ink-soft)', fontStyle: 'italic' }}>
                  ⚠️ {listError}<br/>
                  <a href={video.url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--clr-sage)', marginTop: 8, display: 'inline-block' }}>
                    เปิดใน YouTube →
                  </a>
                </div>
              )}

              {!loadingList && !listError && playlistItems.length === 0 && (
                <div style={{ padding: 12, fontSize: 12, color: 'var(--clr-ink-soft)', fontStyle: 'italic' }}>
                  ไม่มีคลิปใน playlist
                </div>
              )}

              {playlistItems.map((item, i) => {
                const active = item.id === currentVideoId;
                return (
                  <button
                    key={item.id}
                    onClick={() => setCurrentVideoId(item.id)}
                    style={{
                      width: '100%',
                      display: 'flex',
                      gap: 8,
                      padding: 8,
                      background: active ? 'var(--clr-ink)' : 'var(--clr-surface)',
                      color: active ? 'var(--clr-bg)' : 'var(--clr-ink)',
                      border: '1px solid var(--clr-border)',
                      borderRadius: 8,
                      marginBottom: 6,
                      cursor: 'pointer',
                      textAlign: 'left',
                      fontFamily: 'inherit',
                    }}
                  >
                    <img
                      src={`https://img.youtube.com/vi/${item.id}/default.jpg`}
                      alt=""
                      style={{ width: 60, height: 45, objectFit: 'cover', borderRadius: 4, flexShrink: 0 }}
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 11, fontFamily: 'JetBrains Mono, monospace', opacity: 0.6, marginBottom: 2 }}>
                        #{i + 1}
                      </div>
                      <div style={{ fontSize: 12, lineHeight: 1.3, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                        {item.title}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 12, flexWrap: 'wrap' }}>
          {currentVideoId && (
            <a className="vmx-btn vmx-btn-ghost vmx-btn-sm" href={`https://www.youtube.com/watch?v=${currentVideoId}${playlistId ? `&list=${playlistId}` : ''}`} target="_blank" rel="noopener noreferrer">
              เปิดใน YouTube →
            </a>
          )}
          {!currentVideoId && (
            <a className="vmx-btn vmx-btn-ghost vmx-btn-sm" href={video.url} target="_blank" rel="noopener noreferrer">
              เปิดใน YouTube →
            </a>
          )}
          <button className="vmx-btn vmx-btn-primary vmx-btn-sm" onClick={onClose}>ปิด</button>
        </div>
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
          <input
            type="text"
            value={form.topic}
            onChange={(e) => setForm({ ...form, topic: e.target.value })}
            placeholder="เช่น Cherry eye surgery"
          />
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

// ============================================================
// HELPER: Parse YouTube playlist RSS feed
// ============================================================
function parseYouTubeRss(xmlString) {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xmlString, 'text/xml');
    const entries = doc.getElementsByTagName('entry');
    const items = [];
    for (let i = 0; i < entries.length; i++) {
      const e = entries[i];
      const title = e.getElementsByTagName('title')[0]?.textContent || 'Untitled';
      const videoIdEl = e.getElementsByTagName('yt:videoId')[0];
      const id = videoIdEl?.textContent;
      if (id) items.push({ id, title });
    }
    return items;
  } catch (err) {
    console.error('RSS parse error:', err);
    return [];
  }
}
