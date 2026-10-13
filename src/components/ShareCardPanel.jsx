// ============================================================
// ShareCardPanel: preview, options and the ways out for a share card
// ============================================================
// Shared by the term recap, the daily question and the score card.
//
// The image is drawn when the panel opens and whenever an option changes,
// never on the share tap: Safari only allows a share shortly after the tap,
// and the old cards rendered after it. The preview is the exact file that
// leaves, in the app's current theme unless the student picks the other.
//
// Inside LINE, Instagram or Facebook a file share is usually missing and a
// download does nothing, so the panel says to press and hold the picture
// (which is a real <img>, a data: URL there). It no longer offers the system
// browser: the answers live in the app's own browser, so the recap opened
// there was empty.
// ============================================================

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ensureCardFonts } from '../lib/share-card/fonts.js';
import { toBlob, feedCut } from '../lib/share-card/kit.js';
import { deliverCard, triggerDownload } from '../lib/share-card/share.js';
import { inAppBrowser, APP_NAMES } from '../lib/inapp.js';
import { copyText } from '../lib/clipboard.js';

const appTheme = () => (typeof document !== 'undefined' && document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light');

function readAsDataUrl(blob) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result));
    r.onerror = () => reject(r.error || new Error('read failed'));
    r.readAsDataURL(blob);
  });
}

function Seg({ label, value, options, onChange, disabled }) {
  return (
    <div role="group" aria-label={label} className="vmx-share-seg">
      {options.map(([id, text]) => (
        <button
          key={id}
          type="button"
          aria-pressed={value === id}
          disabled={disabled}
          onClick={() => onChange(id)}
        >
          {text}
        </button>
      ))}
    </div>
  );
}

/**
 * @param {{ draw: (theme: 'light'|'dark') => { card: { canvas: HTMLCanvasElement } } | Promise<...>,
 *   fileBase: string, title: string, shareText?: string, alt: string }} props
 */
export default function ShareCardPanel({ draw, fileBase, title, shareText = '', alt }) {
  const [theme, setTheme] = useState(appTheme);
  const [format, setFormat] = useState('story');
  const [image, setImage] = useState(null); // { key, blob, src }
  const [state, setState] = useState('rendering'); // rendering | ready | error
  const [hint, setHint] = useState('');
  const [holdHint, setHoldHint] = useState(false);
  // One cache per drawing function: new numbers mean new pictures.
  const cache = useMemo(() => new Map(), [draw]);
  const urls = useRef([]);
  const alive = useRef(true);
  const sharing = useRef(false);
  // The newest request wins: switching theme then shape quickly used to let
  // the first drawing, finishing last, replace the second and leave the
  // preview on its placeholder.
  const latest = useRef(0);
  const inApp = typeof navigator !== 'undefined' ? inAppBrowser(navigator.userAgent) : null;
  const key = `${theme}-${format}`;
  const canCopyImage = typeof window !== 'undefined' && typeof window.ClipboardItem === 'function'
    && typeof navigator !== 'undefined' && typeof navigator.clipboard?.write === 'function';

  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
      for (const u of urls.current) URL.revokeObjectURL(u);
    };
  }, []);

  const render = useCallback(async () => {
    const ticket = ++latest.current;
    const hit = cache.get(key);
    if (hit) { setImage(hit); setState('ready'); return; }
    setState('rendering');
    try {
      await ensureCardFonts();
      const { card, problems = [] } = await draw(theme);
      const canvas = format === 'post' ? feedCut(card) : card.canvas;
      const blob = await toBlob(canvas, 'image/png');
      // Closed while drawing: a URL made now would never be revoked.
      if (!alive.current) return;
      let src;
      if (inApp) src = await readAsDataUrl(blob);
      else { src = URL.createObjectURL(blob); urls.current.push(src); }
      const entry = { key, blob, src, clean: problems.length === 0 };
      cache.set(key, entry);
      if (ticket !== latest.current) return;
      setImage(entry);
      setState('ready');
    } catch {
      if (ticket === latest.current) setState('error');
    }
  }, [cache, draw, format, inApp, key, theme]);

  useEffect(() => { render(); }, [render]);

  const flash = (msg) => {
    setHint(msg);
    setTimeout(() => setHint((cur) => (cur === msg ? '' : cur)), 3200);
  };
  const filename = `${fileBase}-${format === 'post' ? '4x5' : '9x16'}-${theme}.png`;
  const ready = state === 'ready' && image?.key === key;

  async function onShare() {
    // A second tap while the share sheet is open would be refused by the
    // browser, and used to fall through to a download.
    if (!ready || sharing.current) return;
    sharing.current = true;
    try {
      const { outcome } = await deliverCard(image.blob, { filename, title, text: shareText });
      if (outcome === 'shared') flash('แชร์แล้ว');
      else if (outcome === 'show') setHoldHint(true);
      else if (outcome === 'downloaded') flash('บันทึกรูปลงเครื่องแล้ว');
    } finally {
      sharing.current = false;
    }
  }

  function onSave() {
    if (!ready) return;
    if (inApp) { setHoldHint(true); return; }
    triggerDownload(image.blob, filename);
    flash('บันทึกรูปลงเครื่องแล้ว');
  }

  async function onCopyImage() {
    if (!ready) return;
    try {
      await navigator.clipboard.write([new window.ClipboardItem({ 'image/png': image.blob })]);
      flash('คัดลอกรูปแล้ว วางในแชตได้เลย');
    } catch {
      flash('คัดลอกรูปไม่ได้ ใช้บันทึกรูปแทน');
    }
  }

  async function onCopyText() {
    const res = await copyText(shareText);
    flash(res.ok ? 'คัดลอกข้อความแล้ว' : 'คัดลอกไม่ได้ ลองอีกครั้ง');
  }

  return (
    <div className="vmx-share-panel">
      <div className="vmx-share-options">
        <Seg label="ธีมของรูป" value={theme} onChange={(v) => { setTheme(v); setHoldHint(false); }}
          options={[['light', 'สว่าง'], ['dark', 'มืด']]} />
        <Seg label="สัดส่วนรูป" value={format} onChange={(v) => { setFormat(v); setHoldHint(false); }}
          options={[['story', 'สตอรี่ 9:16'], ['post', 'โพสต์ 4:5']]} />
      </div>

      {/* data-layout: whether the layout check found text outside the frame
          or overlapping; read by the e2e suite, never shown. */}
      <div
        className="vmx-share-preview"
        data-format={format}
        data-theme-pick={theme}
        data-state={ready ? 'ready' : state}
        data-layout={ready ? (image.clean ? 'clean' : 'tight') : undefined}
      >
        {ready ? (
          <img src={image.src} alt={alt} width={1080} height={format === 'post' ? 1350 : 1920} />
        ) : state === 'error' ? (
          <div className="vmx-share-preview-msg">
            <p>สร้างรูปไม่สำเร็จ</p>
            <button type="button" className="vmx-btn vmx-btn-ghost" onClick={render}>ลองอีกครั้ง</button>
          </div>
        ) : (
          <div className="vmx-share-preview-msg" aria-hidden="true" />
        )}
      </div>

      {holdHint && (
        <div className="vmx-share-hold" role="note">
          <strong>กดค้างที่รูปด้านบน แล้วเลือกบันทึกรูป</strong>
          <span>{APP_NAMES[inApp] || 'แอปนี้'} บันทึกไฟล์จากหน้าเว็บโดยตรงไม่ได้</span>
        </div>
      )}

      <div className="vmx-share-actions">
        <button type="button" className="vmx-btn vmx-btn-primary" onClick={onShare} disabled={!ready}>แชร์รูป</button>
        <button type="button" className="vmx-btn vmx-btn-ghost" onClick={onSave} disabled={!ready}>บันทึกรูป</button>
        {canCopyImage && !inApp && (
          <button type="button" className="vmx-btn vmx-btn-ghost" onClick={onCopyImage} disabled={!ready}>คัดลอกรูป</button>
        )}
        {shareText && <button type="button" className="vmx-btn vmx-btn-ghost" onClick={onCopyText}>คัดลอกข้อความ</button>}
      </div>
      <p className="vmx-share-status" role="status" aria-live="polite">{state === 'rendering' ? 'กำลังสร้างรูป' : hint}</p>
    </div>
  );
}
