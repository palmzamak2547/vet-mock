import { useState } from 'react';
import { VIDEO_LIBRARY, getYouTubeId, getYouTubeThumbnail, getVideosBySubject } from '../data/videos.js';
import { SUBJECTS } from '../data/curriculum.js';

export default function VideoView({ goHome }) {
  const [filter, setFilter] = useState('all');
  const [playing, setPlaying] = useState(null); // video object

  const videos = getVideosBySubject(filter);

  return (
    <>
      <div className="vmx-hero">
        <h1>🎥 คลิป<em>ย้อนหลัง</em></h1>
        <p>รวมคลิป YouTube ที่เกี่ยวข้องแต่ละวิชา — อยากเพิ่มคลิปไหนก็ส่งมาได้</p>
      </div>

      {/* Filter chips */}
      <div style={{ marginBottom: 20 }}>
        <div className="vmx-chip-row">
          {SUBJECTS.map((s) => (
            <button key={s.id}
              className={`vmx-chip ${filter === s.id ? 'active' : ''}`}
              onClick={() => setFilter(s.id)}>
              {s.icon} {s.name}
            </button>
          ))}
        </div>
      </div>

      {/* Video player modal */}
      {playing && (
        <div className="vmx-modal-overlay" onClick={() => setPlaying(null)}>
          <div className="vmx-modal" style={{ maxWidth: 720 }} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ marginBottom: 12 }}>{playing.topic}</h2>
            <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, borderRadius: 12, overflow: 'hidden', marginBottom: 12 }}>
              <iframe
                src={`https://www.youtube.com/embed/${getYouTubeId(playing.url)}?autoplay=1`}
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={playing.topic}
              />
            </div>
            <div style={{ fontSize: 13, color: 'var(--clr-ink-soft)', marginBottom: 12 }}>
              by {playing.author} · {playing.duration}
              {playing.tags && playing.tags.map((t) => <span key={t} className="vmx-tag-pill">#{t}</span>)}
            </div>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <a className="vmx-btn vmx-btn-ghost vmx-btn-sm" href={playing.url} target="_blank" rel="noopener noreferrer">เปิดใน YouTube →</a>
              <button className="vmx-btn vmx-btn-primary vmx-btn-sm" onClick={() => setPlaying(null)}>ปิด</button>
            </div>
          </div>
        </div>
      )}

      {/* Video grid */}
      {videos.length === 0 ? (
        <div className="vmx-empty">ยังไม่มีคลิปในวิชานี้ — ส่งคลิปที่คิดว่ามีประโยชน์ผ่านฟอร์มแจ้งได้</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 14 }}>
          {videos.map((v, i) => {
            const subj = SUBJECTS.find((s) => s.id === v.subject);
            const thumb = getYouTubeThumbnail(v.url);
            return (
              <button key={i} className="vmx-mode-card" onClick={() => setPlaying(v)} style={{ textAlign: 'left', padding: 0, overflow: 'hidden' }}>
                {thumb ? (
                  <div style={{ width: '100%', aspectRatio: '16/9', background: '#000', position: 'relative', overflow: 'hidden' }}>
                    <img src={thumb} alt={v.topic} style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => { e.target.style.display = 'none'; }} />
                    <div style={{
                      position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: 'rgba(0,0,0,0.3)', color: 'white', fontSize: 32,
                    }}>▶️</div>
                    <div style={{
                      position: 'absolute', bottom: 8, right: 8, padding: '2px 6px',
                      background: 'rgba(0,0,0,0.8)', color: 'white', borderRadius: 4,
                      fontSize: 11, fontFamily: 'JetBrains Mono, monospace',
                    }}>{v.duration}</div>
                  </div>
                ) : (
                  <div style={{ width: '100%', aspectRatio: '16/9', background: 'var(--clr-surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40 }}>
                    🎬
                  </div>
                )}
                <div style={{ padding: 14 }}>
                  <div style={{ fontSize: 10, fontFamily: 'JetBrains Mono, monospace', color: subj?.color || 'var(--clr-ink-soft)', textTransform: 'uppercase', marginBottom: 4, letterSpacing: '0.08em' }}>
                    {subj?.icon} {subj?.name}
                  </div>
                  <div style={{ fontFamily: 'Fraunces, serif', fontWeight: 600, fontSize: 15, marginBottom: 4, lineHeight: 1.3 }}>
                    {v.topic}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--clr-ink-soft)', fontStyle: 'italic' }}>
                    by {v.author}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      <div style={{ marginTop: 24, padding: 16, borderRadius: 12, background: 'var(--clr-surface-2)', fontSize: 13, color: 'var(--clr-ink-soft)', lineHeight: 1.6 }}>
        ⚠️ <strong>Disclaimer:</strong> คลิปเหล่านี้เป็นของเจ้าของช่องบน YouTube ต้นฉบับ ไม่ใช่ผลงานของ VetMock<br/>
        💡 ถ้ามีคลิปดีๆ อยากแนะนำ หรือ link เสีย → ส่งผ่านฟอร์มแจ้งบัค
      </div>

      <div className="vmx-btn-row" style={{ marginTop: 24 }}>
        <button className="vmx-btn vmx-btn-ghost" onClick={goHome}>← หน้าแรก</button>
      </div>
    </>
  );
}
