import { useState, useEffect, useRef } from 'react';
import BackBar from '../components/BackBar.jsx';
import {
  sendFeedback,
  FEEDBACK_EMAIL as CONTACT_EMAIL,
  loadFeedbackDraft,
  saveFeedbackDraft,
} from '../lib/feedback-client.js';

export default function FeedbackView({ goHome, user, profile, prefill, clearPrefill }) {
  // An unsent draft survives the view: what the student typed before a failed
  // send, a reload or a switch of view is mirrored to localStorage and
  // restored here. The draft is the student's own words, so it wins over a
  // contextual prefill, which fills only the fields the draft left empty.
  const [draftRestored, setDraftRestored] = useState(() => Boolean(loadFeedbackDraft()));
  const [formData, setFormData] = useState(() => {
    const draft = loadFeedbackDraft();
    return {
      type: draft?.type || prefill?.type || 'Bug',
      subject: draft?.subject || prefill?.subject || '',
      message: draft?.message || prefill?.message || '',
      fromEmail: user?.email || '',
      fromName: profile?.username || '',
    };
  });
  // One door for the inputs, so the "restored" notice retires itself the
  // moment the student changes anything and the mirror stays current.
  const updateForm = (patch) => {
    setFormData((prev) => ({ ...prev, ...patch }));
    if (draftRestored) setDraftRestored(false);
  };
  useEffect(() => {
    if (prefill && clearPrefill) clearPrefill();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only on mount
  }, []);
  // Mirror every edit; the mirror clears itself when the form empties,
  // including the success timer's reset of what was sent.
  useEffect(() => {
    saveFeedbackDraft(formData);
  }, [formData]);
  // status: 'idle' | 'sending' | 'success' | 'api-error' | 'network-error'
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const [apiError, setApiError] = useState(null); // sendFeedback's failed result: { status, reason, messageTh }

  // Track the success-reset timer so we can cancel it if the user
  // navigates away before it fires — otherwise setState ran on an
  // unmounted component (React warns + can leak the closure).
  const resetTimerRef = useRef(null);
  useEffect(() => () => { if (resetTimerRef.current) clearTimeout(resetTimerRef.current); }, []);

  // The copy button is the way out when sending failed AND the mail app is
  // not an option (shared device, no mail account): the composed text goes
  // to the clipboard ready for email or a chat.
  const [copied, setCopied] = useState(false);
  const copyTimerRef = useRef(null);
  useEffect(() => () => { if (copyTimerRef.current) clearTimeout(copyTimerRef.current); }, []);
  const copyDraft = async () => {
    try {
      const signature = (formData.fromName || formData.fromEmail)
        ? `\n— ${formData.fromName || 'ไม่ระบุชื่อ'}${formData.fromEmail ? ` <${formData.fromEmail}>` : ''}`
        : '';
      await navigator.clipboard.writeText(
        `[VetMock ${formData.type}] ${formData.subject || 'Feedback'}\n\n${formData.message}${signature}`,
      );
      setCopied(true);
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
      copyTimerRef.current = setTimeout(() => setCopied(false), 2500);
    } catch {
      // Clipboard can be denied; the mailto fallback below still works.
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!formData.message.trim()) {
      setError('กรุณากรอกข้อความ');
      return;
    }
    setError('');
    setApiError(null);
    setStatus('sending');
    // The inputs stay editable while this is in flight and during the success
    // panel, so a student can already be typing the next report. The reset
    // below clears only what was actually sent.
    const sent = formData;

    const result = await sendFeedback(sent);
    if (result.ok) {
      setStatus('success');
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
      resetTimerRef.current = setTimeout(() => {
        setFormData((prev) => (prev.subject === sent.subject && prev.message === sent.message
          ? { ...prev, subject: '', message: '' }
          : prev));
        setStatus('idle');
        resetTimerRef.current = null;
      }, 4000);
      return;
    }

    // Failure: surface it instead of silently opening the mail app. The form
    // keeps the text; the panel shows the client's sentence for the cause.
    console.warn('[feedback] not sent:', result.status, result.reason);
    setApiError(result);
    setStatus(result.reason === 'offline' ? 'network-error' : 'api-error');
  };

  const openMailto = () => {
    const body = `Type: ${formData.type}\nSubject: ${formData.subject}\nFrom: ${formData.fromName} <${formData.fromEmail}>\n\n${formData.message}\n\n---\nSent from VetMock`;
    const mailto = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(`[VetMock ${formData.type}] ${formData.subject || 'Feedback'}`)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
  };

  return (
    <>
      <BackBar onBack={goHome} label="หน้าแรก" />
      <div className="vmx-hero">
        <h1>แจ้งปัญหา <em>และข้อเสนอแนะ</em></h1>
        <p>เจอ bug? มีข้อเสนอแนะ? หรืออยากแชร์ข้อสอบเพิ่ม? ส่งมาได้เลย — ส่งตรงไปที่อีเมล Vet 86</p>
      </div>

      <div className="vmx-config-panel" style={{ maxWidth: 600, margin: '0 auto' }}>
        {draftRestored && status !== 'success' && (
          <div
            role="status"
            style={{ padding: 10, borderRadius: 8, background: 'var(--clr-surface-2)', border: '1px solid var(--clr-border)', fontSize: 13, color: 'var(--clr-ink-soft)', marginBottom: 16 }}
          >
            📝 กู้คืนข้อความที่พิมพ์ค้างไว้จากครั้งก่อนให้แล้ว แก้ต่อหรือส่งได้เลย
          </div>
        )}

        {status === 'success' && (
          <div style={{ padding: 16, borderRadius: 12, background: 'rgba(74, 107, 74, 0.15)', border: '1px solid var(--clr-sage)', marginBottom: 16, textAlign: 'center' }}>
            ✅ <strong>ส่งสำเร็จ!</strong><br/>
            <span style={{ fontSize: 13, color: 'var(--clr-ink-soft)' }}>
              ข้อความถูกส่งไปที่ {CONTACT_EMAIL} แล้ว, ขอบคุณมาก! 🙏
              {formData.fromEmail ? ' ใส่อีเมลไว้ ทีมงานตอบกลับทางอีเมลได้' : ''}
            </span>
          </div>
        )}

        {(status === 'api-error' || status === 'network-error') && apiError && (
          <div style={{ padding: 16, borderRadius: 12, background: 'var(--clr-rose-soft)', border: '1px solid var(--clr-rose)', marginBottom: 16 }}>
            ❌ <strong>ส่งไม่สำเร็จ</strong>
            {/* One Thai sentence the student can act on, from
                lib/feedback-client.js: the question flag and the VetWiki
                concern box show the same one for the same cause. This panel
                used to print an HTTP status chip, the server's raw English
                text and a hint naming Resend + env vars. Diagnostics stay in
                the console (logged in submit). */}
            <div style={{ fontSize: 13, color: 'var(--clr-ink)', marginTop: 8, lineHeight: 1.6 }}>
              {apiError.messageTh}
            </div>
            <div style={{ marginTop: 12, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <button
                type="button"
                className="vmx-btn vmx-btn-ghost vmx-btn-sm"
                onClick={() => { setStatus('idle'); setApiError(null); }}
              >
                ลองใหม่
              </button>
              <button
                type="button"
                className="vmx-btn vmx-btn-ghost vmx-btn-sm"
                onClick={copyDraft}
              >
                {copied ? '📋 คัดลอกแล้ว' : '📋 คัดลอกข้อความ'}
              </button>
              <button
                type="button"
                className="vmx-btn vmx-btn-ghost vmx-btn-sm"
                onClick={openMailto}
              >
                💌 เปิดแอปอีเมลแทน
              </button>
            </div>
          </div>
        )}

        <form onSubmit={submit} noValidate>
          <div className="vmx-form-group">
            <label htmlFor="vmx-feedback-type">ประเภท</label>
            <select id="vmx-feedback-type" value={formData.type} onChange={(e) => updateForm({ type: e.target.value })}>
              <option value="Bug">🐛 Bug Report</option>
              <option value="Feature">Feature Request</option>
              <option value="Question">❓ Question</option>
              <option value="Content">Content (เพิ่มข้อสอบ/ตารางสอบ)</option>
              <option value="Other">📨 Other</option>
            </select>
          </div>

          <div className="vmx-form-group">
            <label htmlFor="vmx-feedback-name">ชื่อ (optional)</label>
            <input id="vmx-feedback-name" type="text" value={formData.fromName} onChange={(e) => updateForm({ fromName: e.target.value })} placeholder="เช่น Vet86_PingP" maxLength={100} />
          </div>

          <div className="vmx-form-group">
            <label htmlFor="vmx-feedback-email">Email (optional, ใส่ถ้าอยากให้ตอบกลับ)</label>
            <input
              id="vmx-feedback-email"
              type="text"
              inputMode="email"
              autoComplete="email"
              value={formData.fromEmail}
              onChange={(e) => updateForm({ fromEmail: e.target.value })}
              placeholder="you@example.com"
              maxLength={254}
            />
          </div>

          <div className="vmx-form-group">
            <label htmlFor="vmx-feedback-subject">หัวข้อ</label>
            <input id="vmx-feedback-subject" type="text" value={formData.subject} onChange={(e) => updateForm({ subject: e.target.value })} placeholder="เช่น ข้อสอบ COM IV ตอบไม่ถูก" maxLength={200} />
          </div>

          <div className="vmx-form-group">
            <label htmlFor="vmx-feedback-message">ข้อความ * <span style={{ fontSize: 11, color: 'var(--clr-ink-soft)', fontWeight: 'normal' }}>({formData.message.length}/5000)</span></label>
            <textarea
              id="vmx-feedback-message"
              value={formData.message}
              onChange={(e) => updateForm({ message: e.target.value.slice(0, 5000) })}
              placeholder="อธิบายปัญหา/ข้อเสนอแนะ..."
              style={{ minHeight: 140 }}
              maxLength={5000}
            />
          </div>

          {error && (
            <div style={{ padding: 10, borderRadius: 8, background: 'var(--clr-rose-soft)', color: 'var(--clr-ink)', fontSize: 13, marginBottom: 12 }}>
              ⚠️ {error}
            </div>
          )}

          <button
            type="submit"
            className="vmx-btn vmx-btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '14px' }}
            disabled={status === 'sending' || status === 'success'}
          >
            {status === 'sending' ? 'กำลังส่ง...' : status === 'success' ? 'ส่งสำเร็จแล้ว' : '📨 ส่งข้อความ'}
          </button>
        </form>

        <div style={{ marginTop: 20, fontSize: 12, color: 'var(--clr-ink-soft)', textAlign: 'center', lineHeight: 1.6 }}>
          💌 ส่งตรงไปที่ <strong>{CONTACT_EMAIL}</strong>
        </div>
      </div>

      <div className="vmx-btn-row" style={{ marginTop: 20 }}>
        <button className="vmx-btn vmx-btn-ghost" onClick={goHome}>← หน้าแรก</button>
      </div>
    </>
  );
}
