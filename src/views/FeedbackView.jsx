import { useState, useEffect, useRef } from 'react';
import BackBar from '../components/BackBar.jsx';

const CONTACT_EMAIL = 'palmzamak2547@gmail.com';

export default function FeedbackView({ goHome, user, profile, prefill, clearPrefill }) {
  // Prefill arrives from contextual entry points (e.g. clicking a
  // scaffold subject card on HomeView). Apply once on mount, then
  // tell App to clear so a manual revisit doesn't reuse stale context.
  const [formData, setFormData] = useState(() => ({
    type: prefill?.type || 'Bug',
    subject: prefill?.subject || '',
    message: prefill?.message || '',
    fromEmail: user?.email || '',
    fromName: profile?.username || '',
  }));
  useEffect(() => {
    if (prefill && clearPrefill) clearPrefill();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only on mount
  }, []);
  // status: 'idle' | 'sending' | 'success' | 'api-error' | 'network-error'
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const [apiError, setApiError] = useState(null); // { code, message } from API failure

  // Track the success-reset timer so we can cancel it if the user
  // navigates away before it fires — otherwise setState ran on an
  // unmounted component (React warns + can leak the closure).
  const resetTimerRef = useRef(null);
  useEffect(() => () => { if (resetTimerRef.current) clearTimeout(resetTimerRef.current); }, []);

  const submit = async (e) => {
    e.preventDefault();
    if (!formData.message.trim()) {
      setError('กรุณากรอกข้อความ');
      return;
    }
    setError('');
    setApiError(null);
    setStatus('sending');

    try {
      const resp = await fetch('/api/send-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (resp.ok) {
        setStatus('success');
        if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
        resetTimerRef.current = setTimeout(() => {
          setFormData((prev) => ({ ...prev, subject: '', message: '' }));
          setStatus('idle');
          resetTimerRef.current = null;
        }, 4000);
        return;
      }

      // API failure — surface error instead of silently opening mail app
      const errData = await resp.json().catch(() => ({}));
      console.warn('API error:', resp.status, errData);
      setApiError({
        code: resp.status,
        reason: errData.reason || null,
        message: errData.error || `HTTP ${resp.status}`,
        hint: errData.hint || null,
      });
      setStatus('api-error');

    } catch (err) {
      console.error('Network error:', err);
      setApiError({ code: 'network', message: err?.message || 'Network error' });
      setStatus('network-error');
    }
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
        {status === 'success' && (
          <div style={{ padding: 16, borderRadius: 12, background: 'rgba(74, 107, 74, 0.15)', border: '1px solid var(--clr-sage)', marginBottom: 16, textAlign: 'center' }}>
            ✅ <strong>ส่งสำเร็จ!</strong><br/>
            <span style={{ fontSize: 13, color: 'var(--clr-ink-soft)' }}>
              ข้อความถูกส่งไปที่ {CONTACT_EMAIL} แล้ว, ขอบคุณมาก! 🙏
            </span>
          </div>
        )}

        {(status === 'api-error' || status === 'network-error') && apiError && (
          <div style={{ padding: 16, borderRadius: 12, background: 'var(--clr-rose-soft)', border: '1px solid var(--clr-rose)', marginBottom: 16 }}>
            ❌ <strong>ส่งไม่สำเร็จ</strong>
            {/* One Thai sentence the student can act on. This panel used to
                print an HTTP status chip, the server's raw English text and a
                hint naming Resend + env vars — deployment detail on a student's
                screen, and the 500 line asserted a missing RESEND_API_KEY for
                every 500 including plain crashes. Diagnostics stay in the
                console (already logged where apiError is built). */}
            <div style={{ fontSize: 13, color: 'var(--clr-ink)', marginTop: 8, lineHeight: 1.6 }}>
              {apiError.code === 429
                ? (apiError.reason === 'daily_cap'
                  ? 'วันนี้ระบบรับข้อความครบโควตาแล้ว พรุ่งนี้ส่งได้อีก หรือใช้ปุ่มเปิดแอปอีเมลด้านล่างส่งถึงทีมงานได้เลย'
                  : 'ส่งถี่เกินไป พักสักครู่แล้วลองใหม่ (ส่งได้ 3 ครั้งต่อ 10 นาที)')
                : apiError.code === 'network'
                  ? 'เชื่อมต่อไม่ได้ ตรวจอินเทอร์เน็ตแล้วลองใหม่'
                  : 'ระบบส่งข้อความขัดข้องชั่วคราว ใช้ปุ่มเปิดแอปอีเมลด้านล่างส่งถึงทีมงานได้เลย'}
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
            <select id="vmx-feedback-type" value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })}>
              <option value="Bug">🐛 Bug Report</option>
              <option value="Feature">Feature Request</option>
              <option value="Question">❓ Question</option>
              <option value="Content">Content (เพิ่มข้อสอบ/ตารางสอบ)</option>
              <option value="Other">📨 Other</option>
            </select>
          </div>

          <div className="vmx-form-group">
            <label htmlFor="vmx-feedback-name">ชื่อ (optional)</label>
            <input id="vmx-feedback-name" type="text" value={formData.fromName} onChange={(e) => setFormData({ ...formData, fromName: e.target.value })} placeholder="เช่น Vet86_PingP" maxLength={100} />
          </div>

          <div className="vmx-form-group">
            <label htmlFor="vmx-feedback-email">Email (optional, ใส่ถ้าอยากให้ตอบกลับ)</label>
            <input
              id="vmx-feedback-email"
              type="text"
              inputMode="email"
              autoComplete="email"
              value={formData.fromEmail}
              onChange={(e) => setFormData({ ...formData, fromEmail: e.target.value })}
              placeholder="you@example.com"
              maxLength={254}
            />
          </div>

          <div className="vmx-form-group">
            <label htmlFor="vmx-feedback-subject">หัวข้อ</label>
            <input id="vmx-feedback-subject" type="text" value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} placeholder="เช่น ข้อสอบ COM IV ตอบไม่ถูก" maxLength={200} />
          </div>

          <div className="vmx-form-group">
            <label htmlFor="vmx-feedback-message">ข้อความ * <span style={{ fontSize: 11, color: 'var(--clr-ink-soft)', fontWeight: 'normal' }}>({formData.message.length}/5000)</span></label>
            <textarea
              id="vmx-feedback-message"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value.slice(0, 5000) })}
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
