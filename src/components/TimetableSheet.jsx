// ============================================================
// TimetableSheet: the exam timetable as a page to keep
// ============================================================
// Opened from the timetable page. The A4 page is drawn once when the sheet
// opens (lib/share-card/timetable-card.js) and the preview is that page: a
// PDF for the printer, a PNG for the phone. A course's syllabus and teaching
// timetable (lib/course-docs.js, `kind` 'syllabus' or 'teaching') use the
// same sheet with their own page (lib/share-card/course-doc-card.js).
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
import { drawSyllabus, drawTeaching } from '../lib/share-card/course-doc-card.js';
import { APP_NAMES, externalUrl, inAppBrowser } from '../lib/inapp.js';

const DRAW = { syllabus: drawSyllabus, teaching: drawTeaching };

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

// A canvas's memory goes when it has no pixels: iOS counts every canvas still
// alive against one budget, and the failed 2x page (35 MB) was still held
// while the 1.25x one was drawn.
const release = (canvas) => {
  if (!canvas) return;
  canvas.width = 0;
  canvas.height = 0;
};

// The picture of a document longer than one page: its pages one under the
// other, at most this wide, so two pages stay under a phone's canvas cap.
const STACK_W = 1550;

function stack(canvases) {
  const w = Math.min(STACK_W, canvases[0].width);
  const k = w / canvases[0].width;
  const out = document.createElement('canvas');
  out.width = w;
  out.height = Math.round(canvases.reduce((h, c) => h + c.height * k, 0));
  const ctx = out.getContext('2d');
  let y = 0;
  for (const c of canvases) {
    ctx.drawImage(c, 0, y, w, c.height * k);
    y += c.height * k;
  }
  return out;
}

async function drawPage(table) {
  await ensureCardFonts();
  for (const scale of SCALES) {
    let canvases = [];
    let tall = null;
    try {
      const { card, cards, problems } = await (DRAW[table.kind] || drawTimetable)(table, { scale });
      canvases = (cards || [card]).map((c) => c.canvas);
      // The picture first, then a JPEG a page for the PDF; the stacked
      // picture is let go before the JPEGs are made.
      tall = canvases.length > 1 ? stack(canvases) : null;
      const png = await toBlob(tall || canvases[0], 'image/png');
      release(tall);
      const jpegs = [];
      for (const c of canvases) jpegs.push(await toBlob(c, 'image/jpeg', 0.92));
      return { png, jpegs, pages: canvases.length, clean: problems.length === 0 };
    } catch {
      // Next scale.
    } finally {
      // Encoded or failed, the pages live on as their files.
      canvases.forEach(release);
      release(tall);
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
        // A sheet closed while the page was drawing has already run its
        // cleanup: a URL made now would never be revoked.
        if (!alive) return;
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
      const bytes = await timetablePdf(await Promise.all(page.jpegs.map((j) => j.arrayBuffer())), { title: `${table.title} ${table.kicker} ${table.semester}` });
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
          <p className="vmx-timetable-lede">
            {table.lede
              ? <>{table.subtitle}<br />{table.lede}{ready && page.pages > 1 ? `, ${page.pages} หน้า เลื่อนดูในกรอบ` : ''}</>
              : <>{table.kicker}, {table.range}<br />{table.subjects} วิชา บนหน้า A4 พร้อมพิมพ์</>}
          </p>
          {/* data-layout: whether the page's layout check found text off the
              page or overlapping; read by the e2e suite, never shown. */}
          <div
            className="vmx-share-preview vmx-timetable-preview"
            data-state={ready ? 'ready' : state}
            data-layout={ready ? (page.clean ? 'clean' : 'tight') : undefined}
            data-pages={ready ? page.pages : undefined}
            tabIndex={ready && page.pages > 1 ? 0 : undefined}
          >
            {ready ? (
              <img src={page.src} alt={`${table.title} ${table.kicker} ${table.range || table.subtitle}`} width={A4.w} height={A4.h * page.pages} />
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
