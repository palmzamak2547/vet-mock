// ============================================================
// IgCardStudioView — generate IG-ready Q cards for daily posts.
//
// Hidden route (no link from UI). Reach via:
//   • CommandPalette → "ig card studio"
//   • Or manually setView('ig-cards')
//
// Picks a random sample of questions and draws each as a 1080×1350 feed
// post (lib/share-card/ig-card.js), in the same type and colour system as
// the app's share cards, light or dark. Each card downloads on its own; a
// zip library would be heavy for an occasional admin task.
// ============================================================

import { useState, useMemo, useEffect, useRef } from 'react';
import { QB, loadQB } from '../data/questions.js';
import { isQuestionDeliverable } from '../data/question-delivery.generated.js';
import { SUBJECTS } from '../data/curriculum.js';
import BackBar from '../components/BackBar.jsx';
import { shuffle } from '../hooks/utils.js';
import { IG_BACKGROUNDS } from '../data/art.js';
import { drawIgCard } from '../lib/share-card/ig-card.js';
import { ensureCardFonts } from '../lib/share-card/fonts.js';
import { toBlob } from '../lib/share-card/kit.js';
import { triggerDownload } from '../lib/share-card/share.js';
import { isTextOnlyQuestion } from '../lib/question-surfaces.js';

// A decoded 1080x1350 plate from IG_BACKGROUNDS. Every plate leaves its
// middle as flat paper, so the question that lands there stays readable.
// A failed load returns null and the card falls back to plain paper.
function loadBackdrop(src) {
  if (!src) return Promise.resolve(null);
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

// Subjects by year, then by Thai name: the bank's own order is the order
// they were added in.
const SUBJECT_OPTIONS = [...SUBJECTS].sort((a, b) => (a.year ?? 99) - (b.year ?? 99) || String(a.name).localeCompare(String(b.name), 'th'));

const appTheme = () => (typeof document !== 'undefined' && document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light');

export default function IgCardStudioView({ goHome }) {
  const [subject, setSubject] = useState('all');
  const [count, setCount] = useState(7);
  const [bgId, setBgId] = useState('none');
  const [theme, setTheme] = useState(appTheme);
  const [cards, setCards] = useState([]);
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);
  const urls = useRef([]);
  // QB is lazy-loaded and mutated in place. Without this tick, opening the
  // studio before the bank finished loading froze the pool at 0 questions
  // and the generate button stayed dead forever.
  const [qbTick, setQbTick] = useState(QB.length);
  // A swallowed load failure left the bank at 0 forever, and the line below
  // kept saying it was being prepared. Track the outcome so the three states
  // (loading, failed, loaded-but-nothing-matches) can be told apart.
  const [qbFailed, setQbFailed] = useState(false);
  useEffect(() => {
    if (QB.length > 0) return undefined;
    let alive = true;
    loadQB()
      .then(() => { if (alive) setQbTick(QB.length); })
      .catch((err) => { console.warn('[ig-studio] question bank failed to load:', err?.message); if (alive) setQbFailed(true); });
    return () => { alive = false; };
  }, []);
  useEffect(() => () => { for (const u of urls.current) URL.revokeObjectURL(u); }, []);

  const pool = useMemo(() => {
    const deliverable = QB.filter(isQuestionDeliverable);
    const filtered = subject === 'all' ? deliverable : deliverable.filter((q) => q.subject === subject);
    // The card carries the stem and up to five lettered options, nothing else.
    return filtered.filter((q) => isTextOnlyQuestion(q)
      && (q.type === 'tf' || (q.type === 'mcq' && q.options?.length >= 2 && q.options.length <= 5)));
  }, [subject, qbTick]);

  const generate = async () => {
    if (busy) return;
    setBusy(true);
    setFailed(false);
    for (const u of urls.current) URL.revokeObjectURL(u);
    urls.current = [];
    setCards([]);
    // A card that throws must not leave the button saying it is still busy.
    try {
      await ensureCardFonts();
      const backdrop = theme === 'light' ? await loadBackdrop(IG_BACKGROUNDS.find((b) => b.id === bgId)?.src || null) : null;
      const built = [];
      for (const q of shuffle([...pool])) {
        if (built.length >= count) break;
        const subjectName = SUBJECTS.find((s) => s.id === q.subject)?.name || '';
        const { card, problems } = drawIgCard(q, { theme, subjectName, backdrop });
        // Too long for one post even at the smallest type: draw another instead.
        if (problems.length) continue;
        const blob = await toBlob(card.canvas, 'image/png');
        const url = URL.createObjectURL(blob);
        urls.current.push(url);
        built.push({ q, url, blob, subjectName, theme });
      }
      setCards(built);
    } catch (err) {
      console.warn('[ig-studio] a card could not be drawn:', err?.message);
      setFailed(true);
    } finally {
      setBusy(false);
    }
  };

  const fileName = (card, i) => `vetmock-q${card.q.id}-${i + 1}-${card.theme}.png`;
  const downloadAll = () => cards.forEach((c, i) => setTimeout(() => triggerDownload(c.blob, fileName(c, i)), i * 200));

  return (
    <>
      <BackBar onBack={goHome} label="หน้าแรก" />
      <div className="vmx-hero">
        <h1>สร้างการ์ด <em>Instagram</em></h1>
        <p>การ์ดคำถามขนาด 1080×1350 (สัดส่วน 4:5) พร้อมโพสต์ เฉลยใส่ในแคปชัน</p>
      </div>

      <div className="vmx-dash-card" style={{ marginBottom: 16 }}>
        <h3>ตั้งค่า</h3>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center', marginTop: 8 }}>
          {/* The subject names are long, so an intrinsically-sized select ran
              past the right edge on a phone and got clipped. Cap it to the
              row and let the label shrink. */}
          <label style={{ fontSize: 13, minWidth: 0, maxWidth: '100%', display: 'inline-flex', alignItems: 'center', flexWrap: 'wrap', gap: 4 }}>
            วิชา:
            <select value={subject} onChange={(e) => setSubject(e.target.value)} style={{ padding: '6px 10px', borderRadius: 8, maxWidth: '100%', minWidth: 0, minHeight: 44 }}>
              <option value="all">ทุกวิชา</option>
              {SUBJECT_OPTIONS.map((s) => (
                <option key={s.id} value={s.id}>{s.year ? `ปี ${s.year} ` : ''}{s.name}</option>
              ))}
            </select>
          </label>
          <label style={{ fontSize: 13, display: 'inline-flex', alignItems: 'center', gap: 4, minHeight: 44 }}>
            จำนวน:
            <input type="number" min="1" max="30" value={count} onChange={(e) => setCount(Math.max(1, Math.min(30, parseInt(e.target.value, 10) || 7)))} style={{ width: 72, padding: '6px 10px', borderRadius: 8, minHeight: 44, boxSizing: 'border-box' }} />
          </label>
          <div role="group" aria-label="ธีมของการ์ด" className="vmx-share-seg">
            {[['light', 'สว่าง'], ['dark', 'มืด']].map(([id, label]) => (
              <button key={id} type="button" aria-pressed={theme === id} disabled={busy} onClick={() => setTheme(id)}>{label}</button>
            ))}
          </div>
          <label style={{ fontSize: 13, display: 'inline-flex', alignItems: 'center', gap: 4, minHeight: 44 }}>
            ลาย:
            <select
              value={bgId}
              onChange={(e) => setBgId(e.target.value)}
              disabled={theme === 'dark'}
              title={theme === 'dark' ? 'ลายพื้นใช้กับการ์ดสว่างเท่านั้น' : undefined}
              style={{ padding: '6px 10px', borderRadius: 8, maxWidth: '100%', minWidth: 0, minHeight: 44 }}
            >
              {IG_BACKGROUNDS.map((b) => (
                <option key={b.id} value={b.id}>{b.label}</option>
              ))}
            </select>
          </label>
          <button className="vmx-btn vmx-btn-primary" onClick={generate} disabled={busy || pool.length === 0} style={{ minHeight: 44 }}>
            {busy ? 'กำลังสร้าง…' : `สร้างการ์ด ${count} ใบ`}
          </button>
          {cards.length > 0 && (
            <button className="vmx-btn vmx-btn-ghost" onClick={downloadAll} style={{ minHeight: 44 }}>
              บันทึกทั้งหมด ({cards.length})
            </button>
          )}
        </div>
        <div style={{ fontSize: 12, color: 'var(--clr-ink-soft)', marginTop: 8 }} role="status">
          {failed
            ? 'สร้างการ์ดไม่สำเร็จ ลองกดสร้างอีกครั้ง'
            : pool.length > 0
              ? `สุ่มจากข้อสอบ ${pool.length.toLocaleString()} ข้อ (แบบตัวเลือกและถูก/ผิด ที่ไม่มีรูปหรือบทอ่าน)`
              : qbFailed
                ? 'โหลดคลังข้อสอบไม่สำเร็จ ตรวจอินเทอร์เน็ตแล้วเปิดหน้านี้ใหม่'
                : qbTick === 0
                  ? 'กำลังเตรียมคลังข้อสอบ…'
                  : subject === 'all'
                    ? 'ยังไม่มีข้อสอบแบบตัวเลือกหรือถูก/ผิดให้ทำการ์ด'
                    : 'วิชานี้ยังไม่มีข้อสอบแบบตัวเลือกหรือถูก/ผิด ลองเลือกวิชาอื่นหรือเลือกทุกวิชา'}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
        {cards.map((card, i) => (
          <div key={card.q.id} className="vmx-dash-card" style={{ padding: 12 }}>
            <img src={card.url} alt={`การ์ดคำถามข้อ ${i + 1}: ${card.subjectName}`} width={1080} height={1350} style={{ width: '100%', height: 'auto', borderRadius: 8, display: 'block' }} />
            <div style={{ fontSize: 12, color: 'var(--clr-ink-soft)', marginTop: 8 }}>
              ข้อ {card.q.id}, {card.subjectName || card.q.subject}{card.q.topic ? `, ${card.q.topic}` : ''}
            </div>
            <button className="vmx-btn vmx-btn-ghost" onClick={() => triggerDownload(card.blob, fileName(card, i))} style={{ marginTop: 8, width: '100%', minHeight: 44 }}>
              บันทึกรูป
            </button>
          </div>
        ))}
      </div>
    </>
  );
}
