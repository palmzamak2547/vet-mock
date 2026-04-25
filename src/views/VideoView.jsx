import { useState, useEffect } from 'react';
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

  // Get index of custom video (for delete/edit)
  const customIdx = (vid) => customVideos.findIndex((v) => v.url === vid.url && v.topic === vid.topic);

  return (
    <>
      <div className="vmx-hero">
        <h1>🎥 คลิป<em>ย้อนหลัง</em></h1>
        <p>รวมคลิป YouTube ที่เกี่ยวข้อง — เพิ่ม link ของช่อง <a href="https://www.youtube.com/@dai.1387" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--clr-sage)' }}>Dai (@dai.1387)</a> และคลิปอื่นๆ ได้เอง</p>
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
      {showAdd && (
        <div className="vmx-modal-overlay" onClick={() => setShowAdd(false)}>
          <div className="vmx-modal" onClick={(e) => e.stopPropagation()}>
            <h2>{editingIdx !== null ? 'แก้ไขคลิป' : 'เพิ่มคลิป YouTube'}</h2>

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
              <button className="vmx-btn vmx-btn-ghost" onClick={() => setShowAdd(false)}>ยกเลิก</button>
              <button className="vmx-btn vmx-btn-primary" onClick={save}>💾 บันทึก</button>
            </div>
          </div>
        </div>
      )}

      {/* Video player modal */}
      {playing && (
        <div className="vmx-modal-overlay" onClick={() => setPlaying(null)}>
          <div className="vmx-modal" style={{ maxWidth: 720 }} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ marginBottom: 12 }}>{playing.topic}</h2>

            {(() => {
              const videoId = getVideoId(playing.url);
              const playlistId = getPlaylistId(playing.url);
              const isChannel = isChannelUrl(playing.url);

              if (videoId) {
                // Single video (with optional playlist context)
                const src = playlistId
                  ? `https://www.youtube.com/embed/${videoId}?autoplay=1&list=${playlistId}`
                  : `https://www.youtube.com/embed/${videoId}?autoplay=1`;
                return (
                  <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, borderRadius: 12, overflow: 'hidden', marginBottom: 12 }}>
                    <iframe src={src}
                      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen title={playing.topic} />
                  </div>
                );
              }

              if (playlistId) {
                // Playlist only — embed playlist player
                return (
                  <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, borderRadius: 12, overflow: 'hidden', marginBottom: 12 }}>
                    <iframe src={`https://www.youtube.com/embed/videoseries?list=${playlistId}`}
                      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen title={playing.topic} />
                  </div>
                );
              }

              if (isChannel) {
                return (
                  <div style={{ padding: 30, background: 'var(--clr-surface-2)', borderRadius: 12, textAlign: 'center', marginBottom: 12 }}>
                    <div style={{ fontSize: 40, marginBottom: 8 }}>📺</div>
                    <div style={{ fontSize: 14, color: 'var(--clr-ink-soft)', marginBottom: 12 }}>
                      เป็น link ของ channel — ต้องเปิด YouTube เพื่อเลือก playlist/video
                    </div>
                  </div>
                );
              }

              return (
                <div style={{ padding: 20, background: 'var(--clr-rose-soft)', borderRadius: 12, marginBottom: 12 }}>
                  ⚠️ ไม่สามารถ embed ได้ — กรุณาเปิดใน YouTube
                </div>
              );
            })()}

            <div style={{ fontSize: 13, color: 'var(--clr-ink-soft)', marginBottom: 12 }}>
              by {playing.author || 'Unknown'} · {playing.duration || '—'}
              {playing.tags && playing.tags.map((t) => <span key={t} className="vmx-tag-pill" style={{ marginLeft: 6 }}>#{t}</span>)}
            </div>

            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
              <a className="vmx-btn vmx-btn-ghost vmx-btn-sm" href={playing.url} target="_blank" rel="noopener noreferrer">เปิดใน YouTube →</a>
              <button className="vmx-btn vmx-btn-primary vmx-btn-sm" onClick={() => setPlaying(null)}>ปิด</button>
            </div>
          </div>
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="vmx-empty">
          ยังไม่มีคลิปในวิชานี้ — กด "➕ เพิ่มคลิป" เพื่อเพิ่ม
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 14 }}>
          {filtered.map((v, idx) => {
            const subject = SUBJECTS.find((s) => s.id === v.subject);
            const thumb = getThumbnail(v.url);
            const isPlaylist = isPlaylistUrl(v.url);
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
                    <div style={{ width: '100%', aspectRatio: '16/9', background: isPlaylist ? 'linear-gradient(135deg, var(--clr-rose-soft), var(--clr-gold-soft))' : isChannel ? 'linear-gradient(135deg, var(--clr-sage-soft), var(--clr-ocean))' : 'var(--clr-surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 4 }}>
                      <div style={{ fontSize: 40 }}>{isPlaylist ? '📋' : isChannel ? '📺' : '🎬'}</div>
                      <div style={{ fontSize: 11, color: 'var(--clr-ink-soft)', fontFamily: 'JetBrains Mono, monospace' }}>
                        {isPlaylist ? 'PLAYLIST' : isChannel ? 'CHANNEL' : 'VIDEO'}
                      </div>
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
                    {v.note && (
                      <div style={{ marginTop: 8, fontSize: 11, color: 'var(--clr-rose)', fontStyle: 'italic' }}>
                        💡 {v.note}
                      </div>
                    )}
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
        💡 คลิปที่เพิ่มเองจะเก็บใน browser ของพี่เท่านั้น (localStorage) ไม่แชร์กับคนอื่น<br/>
        📨 ถ้าอยากให้คลิปแชร์กับเพื่อน → ส่ง link มาทาง <a href="#" onClick={(e) => { e.preventDefault(); }} style={{ color: 'var(--clr-sage)' }}>Feedback</a> จะอัพเดตเข้าไปใน built-in library
      </div>

      <div className="vmx-btn-row" style={{ marginTop: 24 }}>
        <button className="vmx-btn vmx-btn-ghost" onClick={goHome}>← หน้าแรก</button>
      </div>
    </>
  );
}
