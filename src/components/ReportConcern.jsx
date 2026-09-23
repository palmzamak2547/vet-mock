// ============================================================
// ReportConcern — "flag something wrong" on a governed VetWiki section
// ============================================================
// A correctable knowledge base needs a low-friction way for a reader to say
// "this looks off". Reuses the feedback endpoint through lib/feedback-client.js
// (Resend + rate-limit) — a concern is just a structured feedback message tagged
// with the stable sectionId, so nothing new is built server-side. A failure
// shows the client's sentence for its cause, the same one the question flag
// and the feedback page show, and the concern stays in the box.
//
// Deliberately small + inline (a disclosure, not a modal): a governed page
// stays a calm reading surface until the reader chooses to open it.
// ============================================================

import React, { useState } from 'react';
import { sendFeedback } from '../lib/feedback-client.js';

export default function ReportConcern({ topicId, sectionId, sectionHeading }) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState('');
  const [state, setState] = useState('idle'); // idle | sending | done | error
  const [msg, setMsg] = useState('');

  const submit = async () => {
    const concern = text.trim();
    if (!concern || state === 'sending') return;
    setState('sending'); setMsg('');
    const result = await sendFeedback({
      type: 'VetWiki concern',
      subject: `VetWiki: ${sectionId}`,
      // The locator is machine-readable so a reviewer can jump straight to it.
      message: `หัวข้อ: ${sectionHeading}\nsection: ${sectionId}\ntopic: ${topicId}\n\nข้อกังวล:\n${concern}`,
    });
    if (result.ok) { setState('done'); return; }
    setState('error'); setMsg(result.messageTh);
  };

  if (state === 'done') {
    return (
      <div style={{ marginTop: 8, fontSize: 12, color: 'var(--clr-sage-text)' }}>
        ✓ ขอบคุณ — ส่งข้อกังวลให้ทีมตรวจทานแล้ว
      </div>
    );
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        style={{ all: 'unset', cursor: 'pointer', marginTop: 8, fontSize: 12, color: 'var(--clr-ink-soft)', minHeight: 44, display: 'inline-flex', alignItems: 'center' }}
        title="แจ้งว่าหัวข้อนี้มีข้อมูลที่อาจไม่ถูกต้อง"
      >
        ⚑ พบข้อมูลที่อาจไม่ถูกต้อง?
      </button>
    );
  }

  return (
    <div style={{ marginTop: 10, padding: 12, borderRadius: 10, background: 'var(--clr-surface-2)', border: '1px solid var(--clr-border)' }}>
      <label htmlFor={`concern-${sectionId}`} style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: 'var(--clr-ink)', marginBottom: 6 }}>
        แจ้งข้อกังวลเกี่ยวกับ “{sectionHeading}”
      </label>
      <textarea
        id={`concern-${sectionId}`}
        value={text}
        onChange={(e) => setText(e.target.value.slice(0, 1000))}
        rows={3}
        placeholder="เช่น ตัวเลข/ขนาดยา/แหล่งอ้างอิงตรงไหนที่อาจคลาดเคลื่อน"
        style={{ width: '100%', boxSizing: 'border-box', padding: 8, borderRadius: 8, border: '1px solid var(--clr-border)', fontFamily: 'inherit', fontSize: 13, lineHeight: 1.5, resize: 'vertical', background: 'var(--clr-bg)', color: 'var(--clr-ink)' }}
      />
      {msg && <div role="alert" style={{ fontSize: 12, color: 'var(--clr-rose-text)', marginTop: 6 }}>{msg}</div>}
      <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
        <button type="button" className="vmx-btn vmx-btn-primary vmx-btn-sm" onClick={submit} disabled={state === 'sending' || !text.trim()}>
          {state === 'sending' ? 'กำลังส่ง...' : 'ส่งข้อกังวล'}
        </button>
        <button type="button" className="vmx-btn vmx-btn-ghost vmx-btn-sm" onClick={() => { setOpen(false); setText(''); setState('idle'); setMsg(''); }}>
          ยกเลิก
        </button>
      </div>
      <div style={{ fontSize: 11.5, color: 'var(--clr-ink-soft)', marginTop: 6, lineHeight: 1.5 }}>
        ข้อกังวลจะถูกส่งให้ทีมตรวจทาน ไม่เปลี่ยนเนื้อหาทันที
      </div>
    </div>
  );
}
