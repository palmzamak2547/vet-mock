import { useEffect, useRef, useState } from 'react';
import { IN_APP } from '../lib/env.js';
import {
  shareText, lineUrl, markdownWithSources, htmlWithSources, ankiTsv, reviewTimes,
  googleCalendarUrl, icsFile, download, copyRich,
} from '../lib/share.js';

export const toast = (text) => window.dispatchEvent(new CustomEvent('vmai:toast', { detail: text }));

/** One answer, sent where the student keeps things. Order follows use: a Thai
 *  student's first move is LINE, then notes, then review. Download-based
 *  targets are left out inside in-app browsers, which do not save files. */
export default function ShareMenu({ question, answer, sources, quiz, getHtml, onClose, anchor }) {
  const panel = useRef(null);
  const [placeAbove, setPlaceAbove] = useState(true);

  useEffect(() => {
    const r = anchor?.getBoundingClientRect();
    if (r) setPlaceAbove(r.top > 360);
    const onDown = (e) => { if (!panel.current?.contains(e.target) && !anchor?.contains(e.target)) onClose(); };
    const onKey = (e) => { if (e.key === 'Escape') { e.preventDefault(); onClose(); anchor?.focus(); } };
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    requestAnimationFrame(() => panel.current?.querySelector('a, button')?.focus());
    return () => { document.removeEventListener('pointerdown', onDown); document.removeEventListener('keydown', onKey); };
  }, [anchor, onClose]);

  const title = `ทบทวน: ${question.length > 60 ? `${question.slice(0, 58)}…` : question}`;
  const details = shareText(question, answer, 700);
  const times = reviewTimes();
  const done = (msg) => { toast(msg); onClose(); };
  const open = (url) => window.open(url, '_blank', 'noopener,noreferrer');

  const items = [
    { id: 'line', name: 'LINE', act: 'ส่งข้อความ', href: lineUrl(shareText(question, answer)) },
    {
      id: 'notion', name: 'Notion', act: 'วางในหน้าใหม่',
      run: async () => {
        await navigator.clipboard.writeText(markdownWithSources(question, answer, sources));
        open('https://www.notion.so/new');
        done('คัดลอกแล้ว วางในหน้า Notion ได้เลย');
      },
    },
    {
      id: 'google-docs', name: 'Google Docs', act: 'วางในเอกสารใหม่',
      run: async () => {
        await copyRich(htmlWithSources(question, getHtml(), sources), markdownWithSources(question, answer, sources));
        open('https://docs.new');
        done('คัดลอกแล้ว วางใน Google Docs ได้เลย');
      },
    },
    quiz?.length && !IN_APP && {
      id: 'anki', name: 'Anki', act: `การ์ด ${quiz.length} ใบ`,
      run: () => { download('vetmock-ai-anki.txt', ankiTsv(quiz), 'text/plain;charset=utf-8'); done('ดาวน์โหลดแล้ว ใน Anki เลือก File แล้ว Import'); },
    },
    { id: 'google-calendar', name: 'Google Calendar', act: 'เตือนพรุ่งนี้ 20:00', href: googleCalendarUrl(title, details, times[0]) },
    !IN_APP && {
      id: 'apple-calendar', name: 'Apple Calendar', act: 'เตือน 1, 3, 7 วัน',
      run: () => { download('vetmock-ai-review.ics', icsFile(title, details, times), 'text/calendar;charset=utf-8'); done('ดาวน์โหลดแล้ว เปิดไฟล์เพื่อเพิ่มลงปฏิทิน'); },
    },
    !IN_APP && {
      id: 'outlook', name: 'Outlook', act: 'เตือน 1, 3, 7 วัน',
      run: () => { download('vetmock-ai-review.ics', icsFile(title, details, times), 'text/calendar;charset=utf-8'); done('ดาวน์โหลดแล้ว เปิดไฟล์เพื่อเพิ่มลง Outlook'); },
    },
  ].filter(Boolean);

  const canShare = typeof navigator !== 'undefined' && !!navigator.share;

  return (
    <div ref={panel} className={`share-menu${placeAbove ? ' is-above' : ''}`} role="dialog" aria-label="ส่งต่อ">
      <ul className="share-grid">
        {items.map((it) => (
          <li key={it.id}>
            {it.href ? (
              <a className="share-app" href={it.href} target="_blank" rel="noopener noreferrer" onClick={() => onClose()}>
                <img src={`/brand/${it.id}.svg`} alt="" width="36" height="36" />
                <span className="share-name">{it.name}</span>
                <span className="share-act">{it.act}</span>
              </a>
            ) : (
              <button type="button" className="share-app" onClick={() => it.run().catch?.(() => toast('ทำไม่สำเร็จ ลองอีกครั้ง'))}>
                <img src={`/brand/${it.id}.svg`} alt="" width="36" height="36" />
                <span className="share-name">{it.name}</span>
                <span className="share-act">{it.act}</span>
              </button>
            )}
          </li>
        ))}
      </ul>
      <div className="share-more">
        {canShare && (
          <button type="button" className="link" onClick={() => navigator.share({ title: question, text: shareText(question, answer) }).then(onClose, () => {})}>แอปอื่น</button>
        )}
        {!IN_APP && <button type="button" className="link" onClick={() => { onClose(); setTimeout(() => window.print(), 60); }}>พิมพ์หรือ PDF</button>}
      </div>
    </div>
  );
}

/** The one place every action reports what happened. */
export function Toasts() {
  const [msg, setMsg] = useState(null);
  useEffect(() => {
    let t;
    const on = (e) => { setMsg(e.detail); clearTimeout(t); t = setTimeout(() => setMsg(null), 2600); };
    window.addEventListener('vmai:toast', on);
    return () => { window.removeEventListener('vmai:toast', on); clearTimeout(t); };
  }, []);
  return (
    <div className="toast-wrap" aria-live="polite" role="status">
      {msg && <p key={msg} className="toast">{msg}</p>}
    </div>
  );
}
