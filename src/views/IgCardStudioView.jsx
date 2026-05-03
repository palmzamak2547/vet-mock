// ============================================================
// IgCardStudioView — generate IG-ready Q cards for daily posts.
//
// Hidden route (no link from UI). Reach via:
//   • CommandPalette → "ig card studio"
//   • Or manually setView('ig-cards')
//
// Picks a random sample of questions, renders each as a 1080×1350
// portrait card (IG feed-friendly 4:5 aspect — bigger than 9:16 story
// because feed cropping is tighter), and bundles them as PNG downloads
// so the operator can drag into IG and queue for the week.
//
// Designed for low touch: pick subject, pick count, click "Generate",
// click "Download all". No deps beyond canvas + JSZip is too heavy for
// occasional admin use → we just download per-card.
// ============================================================

import { useState, useMemo } from 'react';
import { QB } from '../data/questions.js';
import { SUBJECTS } from '../data/curriculum.js';
import BackBar from '../components/BackBar.jsx';
import { shuffle } from '../hooks/utils.js';

// Render one Q card. Optimised for legibility on a phone-screen IG feed
// preview at 9:16-cropped size: keeps the question stem inside the
// safe vertical band, options below, and a "Answer in caption" pointer
// at the bottom — IG captions live below the image so this matches the
// reading flow.
function renderQCard({ question, brand = '@vetmock.cu' }) {
  const W = 1080, H = 1350;
  const canvas = document.createElement('canvas');
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext('2d');

  // Background — same warm palette as score cards
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, '#fdf6e9');
  bg.addColorStop(1, '#f5ead0');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // Speckle texture
  ctx.fillStyle = 'rgba(43, 36, 25, 0.04)';
  for (let i = 0; i < 60; i++) {
    const x = Math.random() * W, y = Math.random() * H, r = 1 + Math.random() * 2;
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
  }

  // Top label — VetMock + subject pill
  ctx.fillStyle = '#2b2419';
  ctx.font = '600 56px "Fraunces", Georgia, serif';
  ctx.textAlign = 'left';
  ctx.fillText('VetMock', 80, 130);

  const subj = SUBJECTS.find((s) => s.id === question.subject);
  if (subj) {
    ctx.fillStyle = subj.color || '#4a6b4a';
    const text = `${subj.icon || ''}  ${subj.name}`;
    ctx.font = '500 28px "JetBrains Mono", monospace';
    const tw = ctx.measureText(text).width;
    ctx.fillStyle = (subj.color || '#4a6b4a') + '24';
    ctx.beginPath();
    ctx.roundRect(80, 158, tw + 36, 56, 28);
    ctx.fill();
    ctx.fillStyle = subj.color || '#4a6b4a';
    ctx.fillText(text, 80 + 18, 196);
  }

  // Question stem — wrap text
  const stemFontSize = question.q.length > 280 ? 36 : question.q.length > 180 ? 42 : 48;
  ctx.fillStyle = '#2b2419';
  ctx.font = `500 ${stemFontSize}px "Fraunces", Georgia, serif`;
  ctx.textAlign = 'left';
  const stem = question.q.replace(/\*\*/g, '').replace(/★/g, ''); // remove star markers
  wrapText(ctx, stem, 80, 290, W - 160, stemFontSize * 1.4);

  // Options — only render for MCQ; otherwise show "ตอบในแคปชั่น ⬇"
  const optsTop = 290 + stemFontSize * 1.4 * Math.ceil(stem.length / Math.floor((W - 160) / (stemFontSize * 0.55))) + 60;
  if (question.type === 'mcq' && Array.isArray(question.options)) {
    ctx.font = '500 32px "JetBrains Mono", monospace';
    let y = Math.max(700, optsTop);
    const labels = ['A', 'B', 'C', 'D', 'E'];
    question.options.slice(0, 5).forEach((opt, i) => {
      const text = `${labels[i]}.  ${opt.replace(/\*\*/g, '').replace(/★/g, '')}`;
      ctx.fillStyle = '#3d342a';
      // simple wrap into 2 lines max
      wrapText(ctx, text, 100, y, W - 200, 42, 2);
      y += 88;
    });
  } else {
    ctx.font = '400 36px "Fraunces", serif';
    ctx.fillStyle = '#6b6055';
    ctx.fillText('ตอบในแคปชั่น ⬇', 80, 1100);
  }

  // Bottom — VetMock + IG handle
  ctx.fillStyle = '#2b2419';
  ctx.font = '500 32px "JetBrains Mono", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('vetmock.vercel.app · 📷 ' + brand, W / 2, 1280);

  return new Promise((resolve) => canvas.toBlob(resolve, 'image/png', 0.95));
}

function wrapText(ctx, text, x, y, maxW, lineH, maxLines = 999) {
  const words = text.split(/(\s+)/);
  let line = '', n = 0;
  for (const w of words) {
    const test = line + w;
    if (ctx.measureText(test).width > maxW && line) {
      ctx.fillText(line.trim(), x, y);
      line = w;
      y += lineH;
      n++;
      if (n >= maxLines) {
        ctx.fillText(line.trim() + '…', x, y);
        return;
      }
    } else {
      line = test;
    }
  }
  if (line.trim()) ctx.fillText(line.trim(), x, y);
}

export default function IgCardStudioView({ goHome }) {
  const [subject, setSubject] = useState('all');
  const [count, setCount] = useState(7);
  const [cards, setCards] = useState([]);
  const [busy, setBusy] = useState(false);

  const pool = useMemo(() => {
    const filtered = subject === 'all' ? QB : QB.filter((q) => q.subject === subject);
    // Prefer past-paper sourceType when present, ตัด writing-only Qs
    const usable = filtered.filter((q) => q.type === 'mcq' || q.type === 'tf');
    return usable;
  }, [subject]);

  const generate = async () => {
    if (busy) return;
    setBusy(true); setCards([]);
    const picks = shuffle([...pool]).slice(0, count);
    const built = [];
    for (const q of picks) {
      const blob = await renderQCard({ question: q });
      if (blob) built.push({ q, url: URL.createObjectURL(blob), blob });
    }
    setCards(built);
    setBusy(false);
  };

  const downloadOne = (card, i) => {
    const a = document.createElement('a');
    a.href = card.url;
    a.download = `vetmock-q${card.q.id}-${i + 1}.png`;
    document.body.appendChild(a); a.click(); a.remove();
  };

  const downloadAll = () => cards.forEach((c, i) => setTimeout(() => downloadOne(c, i), i * 200));

  return (
    <>
      <BackBar onBack={goHome} label="หน้าแรก" />
      <div className="vmx-hero">
        <h1>IG Card <em>Studio</em></h1>
        <p>Generate Q cards พร้อมโพสต์ลง Instagram · 1080×1350 · 4:5 ratio</p>
      </div>

      <div className="vmx-dash-card" style={{ marginBottom: 16 }}>
        <h3>⚙️ ตั้งค่า</h3>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center', marginTop: 8 }}>
          <label style={{ fontSize: 13 }}>
            วิชา:&nbsp;
            <select value={subject} onChange={(e) => setSubject(e.target.value)} style={{ padding: '6px 10px', borderRadius: 8 }}>
              {SUBJECTS.map((s) => (
                <option key={s.id} value={s.id}>{s.icon} {s.name}</option>
              ))}
            </select>
          </label>
          <label style={{ fontSize: 13 }}>
            จำนวน:&nbsp;
            <input type="number" min="1" max="30" value={count} onChange={(e) => setCount(Math.max(1, Math.min(30, parseInt(e.target.value) || 7)))} style={{ width: 60, padding: '6px 10px', borderRadius: 8 }} />
          </label>
          <button className="vmx-btn vmx-btn-primary" onClick={generate} disabled={busy || pool.length === 0}>
            {busy ? '⏳ Generating…' : `🎨 Generate ${count} cards`}
          </button>
          {cards.length > 0 && (
            <button className="vmx-btn vmx-btn-ghost" onClick={downloadAll}>
              ⬇ Download all ({cards.length})
            </button>
          )}
        </div>
        <div style={{ fontSize: 12, color: 'var(--clr-ink-soft)', marginTop: 8 }}>
          Pool: {pool.length} questions (MCQ + T/F · ตัด writing) · subject = {subject}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
        {cards.map((card, i) => (
          <div key={card.q.id} className="vmx-dash-card" style={{ padding: 12 }}>
            <img src={card.url} alt={`card ${i + 1}`} style={{ width: '100%', borderRadius: 8, display: 'block' }} />
            <div style={{ fontSize: 11, color: 'var(--clr-ink-soft)', marginTop: 8, fontFamily: 'JetBrains Mono, monospace' }}>
              Q{card.q.id} · {card.q.subject} · {card.q.topic || '—'}
            </div>
            <button className="vmx-btn vmx-btn-ghost" onClick={() => downloadOne(card, i)} style={{ marginTop: 8, width: '100%', fontSize: 12 }}>
              ⬇ Download PNG
            </button>
          </div>
        ))}
      </div>
    </>
  );
}
