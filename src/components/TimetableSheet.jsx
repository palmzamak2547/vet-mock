// ============================================================
// TimetableSheet: the exam timetable as a page to keep
// ============================================================
// Opened from the timetable page. The A4 page is drawn once when the sheet
// opens (lib/share-card/timetable-card.js) and the preview is that page: a
// PDF for the printer, a PNG for the phone.
//
// Inside LINE, Instagram or Facebook a download does nothing, so the sheet
// says to press and hold the picture, and inside LINE it offers the system
// browser: unlike a share card, the timetable needs nothing from this one.
// ============================================================

import { useEffect, useRef, useState } from 'react';
import { useModalFocus } from '../hooks/useModalFocus.js';
import { ensureCardFonts } from '../lib/share-card/fonts.js';
import { toBlob } from '../lib/share-card/kit.js';
import { deliverCard, triggerDownload } from '../lib/share-card/share.js';
import { A4, drawTimetable, timetablePdf } from '../lib/share-card/timetable-card.js';
import { APP_NAMES, externalUrl, inAppBrowser } from '../lib/inapp.js';

function readAsDataUrl(blob) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result));
    r.onerror = () => reject(r.error || new Error('read failed'));
    r.readAsDataURL(blob);
  });
}

// ponytail: one smaller retry for a phone whose canvas cap is under 8.7 MP.
const SCALES = [2, 1.25];

async function drawPage(table) {
  await ensureCardFonts();
  for (const scale of SCALES) {
    try {
      const { card, problems } = await drawTimetable(table, { scale });
      const png = await toBlob(card.canvas, 'image/png');
      const jpeg = await toBlob(card.canvas, 'image/jpeg', 0.92);
      return { png, jpeg, clean: problems.length === 0 };
    } catch {
      // Next scale.
    }
  }
  throw new Error('the page could not be drawn');
}

export default function TimetableSheet({ table, onClose }) {
  const dialogRef = useModalFocus({ onClose });
  const [page, setPage] = useState(null);
  const [state, setState] = useState('rendering'); // rendering | ready | error
  const [attempt, setAttempt] = useState(0);
  const [hint, setHint] = useState('');
  const [hold, setHold] = useState(false);
  const busy = useRef(false);
  const inApp = typeof navigator !== 'undefined' ? inAppBrowser(navigator.userAgent) : null;
  const outside = inApp && typeof window !== 'undefined' ? externalUrl(inApp, window.location.href) : null;

  useEffect(() => {
    let alive = true;
    let url = null;
    setState('rendering');
    drawPage(table)
      .then(async (drawn) => {
        const src = inApp ? await readAsDataUrl(drawn.png) : URL.createObjectURL(drawn.png);
        if (!src.startsWith('data:')) url = src;
        if (!alive) return;
        setPage({ ...drawn, src });
        setState('ready');
      })
      .catch(() => { if (alive) setState('error'); });
    return () => {
      alive = false;
      if (url) URL.revokeObjectURL(url);
    };
  }, [table, inApp, attempt]);

  const ready = state === 'ready' && page;
  const flash = (msg) => {
    setHint(msg);
    setTimeout(() => setHint((cur) => (cur === msg ? '' : cur)), 3200);
  };

  async function onPdf() {
    if (!ready || busy.current) return;
    if (inApp) { setHold(true); return; }
    busy.current = true;
    try {
      const bytes = await timetablePdf(await page.jpeg.arrayBuffer(), { title: `${table.title} ${table.kicker} ${table.semester}` });
      triggerDownload(new Blob([bytes], { type: 'application/pdf' }), `${table.file}.pdf`);
      flash('ดาวน์โหลด PDF แล้ว');
    } catch {
      flash('สร้าง PDF ไม่สำเร็จ ลองอีกครั้ง');
    } finally {
      busy.current = false;
    }
  }

  async function onImage() {
    if (!ready || busy.current) return;
    busy.current = true;
    try {
      const { outcome } = await deliverCard(page.png, { filename: `${table.file}.png`, title: table.title });
      if (outcome === 'shared') flash('แชร์แล้ว');
      else if (outcome === 'show') setHold(true);
      else if (outcome === 'downloaded') flash('บันทึกรูปลงเครื่องแล้ว');
    } finally {
      busy.current = false;
    }
  }

  return (
    <div className="vmx-modal-overlay" style={{ zIndex: 1100 }} onClick={(e) => { e.stopPropagation(); onClose?.(); }}>
      <div
        ref={dialogRef}
        className="vmx-modal vmx-share-sheet vmx-timetable-sheet"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="vmx-timetable-title"
        tabIndex={-1}
        data-vmx-modal="true"
      >
        <div className="vmx-share-head">
          <h2 id="vmx-timetable-title">{table.title}</h2>
          <button type="button" className="vmx-btn vmx-btn-ghost" onClick={onClose}>ปิด</button>
        </div>
        <div className="vmx-share-panel">
          <p className="vmx-timetable-lede">{table.kicker}, {table.range}<br />{table.subjects} วิชา บนหน้า A4 พร้อมพิมพ์</p>
          {/* data-layout: whether the page's layout check found text off the
              page or overlapping; read by the e2e suite, never shown. */}
          <div
            className="vmx-share-preview vmx-timetable-preview"
            data-state={ready ? 'ready' : state}
            data-layout={ready ? (page.clean ? 'clean' : 'tight') : undefined}
          >
            {ready ? (
              <img src={page.src} alt={`${table.title} ${table.kicker} ${table.range}`} width={A4.w} height={A4.h} />
            ) : state === 'error' ? (
              <div className="vmx-share-preview-msg">
                <p>จัดหน้าไม่สำเร็จ</p>
                <button type="button" className="vmx-btn vmx-btn-ghost" onClick={() => setAttempt((n) => n + 1)}>ลองอีกครั้ง</button>
              </div>
            ) : (
              <div className="vmx-share-preview-msg" aria-hidden="true" />
            )}
          </div>

          {hold && (
            <div className="vmx-share-hold" role="note">
              <strong>กดค้างที่รูปด้านบน แล้วเลือกบันทึกรูป</strong>
              <span>{APP_NAMES[inApp] || 'แอปนี้'} ดาวน์โหลดไฟล์จากหน้าเว็บโดยตรงไม่ได้</span>
              {outside
                ? <a className="vmx-btn vmx-btn-ghost" href={outside}>เปิดในเบราว์เซอร์เพื่อดาวน์โหลด PDF</a>
                : <span>ถ้าต้องการไฟล์ PDF ให้เปิด vetmock.com ใน Safari หรือ Chrome</span>}
            </div>
          )}

          <div className="vmx-share-actions">
            <button type="button" className="vmx-btn vmx-btn-primary" onClick={onPdf} disabled={!ready}>ดาวน์โหลด PDF</button>
            <button type="button" className="vmx-btn vmx-btn-ghost" onClick={onImage} disabled={!ready}>บันทึกเป็นรูป</button>
          </div>
          <p className="vmx-share-status" role="status" aria-live="polite">{state === 'rendering' ? 'กำลังจัดหน้า' : hint}</p>
        </div>
      </div>
    </div>
  );
}
