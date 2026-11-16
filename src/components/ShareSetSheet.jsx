// ============================================================
// ShareSetSheet: the one way to send a finished set to a friend
// ============================================================
// Opened by "ส่งให้เพื่อน" on the results screen. It shows the set as the
// friend will get it, makes the short /s/<code> link (lib/share-link.js), and
// hands it out: LINE, the system share sheet where the browser has one, or a
// copy. The link and the message carry the question ids only: no score, no
// time, no name, nothing the student typed. The score picture is an option of
// this sheet ("สตอรี่"), offered where the results screen offered it before.
// ============================================================

import { useMemo, useState } from 'react';
import { useModalFocus } from '../hooks/useModalFocus.js';
import { buildShortShareUrl } from '../lib/share-link.js';
import { copyText } from '../lib/clipboard.js';
import NavIcon from './NavIcon.jsx';
import SharedSetCard, { sharedSetWords } from './SharedSetCard.jsx';
import ShareCardPanel from './ShareCardPanel.jsx';

/** The message that goes with the link: fixed words, the subject and the count. */
export function shareSetMessage(items, url) {
  const w = sharedSetWords(items);
  const what = w.title === 'ชุดโจทย์' ? 'ชุดโจทย์' : `ชุดโจทย์ ${w.title}`;
  return `${what} ${items.length} ข้อ ลองทำดูนะ\n${url}`;
}

export default function ShareSetSheet({ questions, note = '', story = null, onRace, onClose }) {
  const dialogRef = useModalFocus({ onClose });
  const url = useMemo(() => buildShortShareUrl(questions), [questions]);
  const text = url ? shareSetMessage(questions, url) : '';
  const [hint, setHint] = useState('');
  const [showStory, setShowStory] = useState(false);
  const canShare = typeof navigator !== 'undefined' && typeof navigator.share === 'function';

  const say = (words) => { setHint(words); };
  const copy = async () => {
    const res = await copyText(url);
    say(res.ok ? 'คัดลอกลิงก์แล้ว วางส่งเพื่อนได้เลย' : 'คัดลอกไม่สำเร็จ กดค้างที่ลิงก์ด้านบนเพื่อคัดลอก');
  };
  const other = async () => {
    try {
      await navigator.share({ text });
    } catch (err) {
      if (err?.name !== 'AbortError') copy();
    }
  };

  return (
    <div className="vmx-modal-overlay vmx-sheet-overlay" style={{ zIndex: 1100 }} onClick={(e) => { e.stopPropagation(); onClose?.(); }}>
      <div
        ref={dialogRef}
        className="vmx-modal vmx-share-sheet vmx-send-sheet"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="vmx-send-title"
        tabIndex={-1}
        data-vmx-modal="true"
      >
        <div className="vmx-share-head">
          <h2 id="vmx-send-title">{showStory ? 'สตอรี่' : 'ส่งให้เพื่อน'}</h2>
          <button type="button" className="vmx-btn vmx-btn-ghost" onClick={showStory ? () => setShowStory(false) : onClose}>
            {showStory ? 'กลับ' : 'ปิด'}
          </button>
        </div>
        {showStory && story ? <ShareCardPanel title="รูปคะแนน" {...story} /> : (
          <>
            <p className="vmx-send-lead">เพื่อนจะได้รับแบบนี้ ไม่มีคะแนนของคุณ</p>
            <SharedSetCard items={questions} />
            {url ? (
              <>
                <p className="vmx-send-link" data-testid="share-link">{url}</p>
                <a
                  className="vmx-btn vmx-btn-primary vmx-send-line"
                  href={`https://line.me/R/share?text=${encodeURIComponent(text)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  ส่งใน LINE
                </a>
                <div className="vmx-send-row">
                  <button type="button" className="vmx-btn vmx-btn-ghost" onClick={copy}>
                    <NavIcon name="link" size={16} /> คัดลอกลิงก์
                  </button>
                  {canShare ? (
                    <button type="button" className="vmx-btn vmx-btn-ghost" onClick={other}>แอปอื่น</button>
                  ) : null}
                  {story ? (
                    <button type="button" className="vmx-btn vmx-btn-ghost" onClick={() => setShowStory(true)}>สตอรี่</button>
                  ) : null}
                </div>
                <p className="vmx-send-hint" role="status" aria-live="polite">{hint}</p>
              </>
            ) : null}
            {note ? <p className="vmx-invite-note">{note}</p> : null}
            {onRace ? (
              <button type="button" className="vmx-send-race" onClick={onRace}>
                <span><strong>ทำพร้อมกันตอนนี้</strong> เปิดห้องให้เพื่อนเข้ามาทำด้วย</span>
                <span aria-hidden="true">›</span>
              </button>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}
