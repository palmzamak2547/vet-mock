import { useState } from 'react';
import BackBar from '../components/BackBar.jsx';

const CONTACT_EMAIL = 'palmzamak2547@gmail.com';

export default function FeedbackView({ goHome, user, profile }) {
  const [formData, setFormData] = useState({
    type: 'Bug',
    subject: '',
    message: '',
    fromEmail: user?.email || '',
    fromName: profile?.username || '',
  });
  // status: 'idle' | 'sending' | 'success' | 'api-error' | 'network-error'
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const [apiError, setApiError] = useState(null); // { code, message } from API failure

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
        setTimeout(() => {
          setFormData({ ...formData, subject: '', message: '' });
          setStatus('idle');
        }, 4000);
        return;
      }

      // API failure — surface error instead of silently opening mail app
      const errData = await resp.json().catch(() => ({}));
      console.warn('API error:', resp.status, errData);
      setApiError({
        code: resp.status,
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
        <h1>📮 <em>Feedback</em> & Bug Report</h1>
        <p>เจอ bug? มีข้อเสนอแนะ? หรืออยากแชร์ข้อสอบเพิ่ม? ส่งมาได้เลย — ส่งตรงไปที่อีเมล Vet 86</p>
      </div>

      <div className="vmx-config-panel" style={{ maxWidth: 600, margin: '0 auto' }}>
        {status === 'success' && (
          <div style={{ padding: 16, borderRadius: 12, background: 'rgba(74, 107, 74, 0.15)', border: '1px solid var(--clr-sage)', marginBottom: 16, textAlign: 'center' }}>
            ✅ <strong>ส่งสำเร็จ!</strong><br/>
            <span style={{ fontSize: 13, color: 'var(--clr-ink-soft)' }}>
              ข้อความถูกส่งไปที่ {CONTACT_EMAIL} แล้ว · ขอบคุณมาก! 🙏
            </span>
          </div>
        )}

        {(status === 'api-error' || status === 'network-error') && apiError && (
          <div style={{ padding: 16, borderRadius: 12, background: 'var(--clr-rose-soft)', border: '1px solid var(--clr-rose)', marginBottom: 16 }}>
            ❌ <strong>ส่งไม่สำเร็จ</strong>
            <div style={{ fontSize: 13, color: 'var(--clr-ink)', marginTop: 6, lineHeight: 1.6 }}>
              <code style={{ background: 'var(--clr-surface-2)', padding: '2px 8px', borderRadius: 4, fontSize: 12 }}>
                {apiError.code === 'network' ? 'NETWORK' : `HTTP ${apiError.code}`}
              </code>
              <span style={{ marginLeft: 8 }}>{apiError.message}</span>
            </div>
            <div style={{ fontSize: 12, color: 'var(--clr-ink-soft)', marginTop: 10, lineHeight: 1.6 }}>
              {apiError.code === 429 && '⏰ พักสักครู่ — ส่งได้ 3 ครั้ง/10 นาที'}
              {apiError.code === 500 && '⚠️ Server ยังตั้งค่า RESEND_API_KEY ไม่ครบ'}
              {apiError.code === 502 && '⚠️ Resend ตอบกลับ error — เช็ก "from" address หรือ verified domain ใน Resend dashboard'}
              {apiError.code === 403 && '⚠️ Origin not allowed — เช็ก allowedOrigin ใน api/_lib/rate-limit.js'}
              {apiError.code === 'network' && '⚠️ ตรวจสัญญาณอินเทอร์เน็ต'}
              {apiError.hint && (
                <div style={{ marginTop: 6, fontStyle: 'italic' }}>💡 {apiError.hint}</div>
              )}
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
            <label>ประเภท</label>
            <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })}>
              <option value="Bug">🐛 Bug Report</option>
              <option value="Feature">💡 Feature Request</option>
              <option value="Question">❓ Question</option>
              <option value="Content">📝 Content (เพิ่มข้อสอบ/ตารางสอบ)</option>
              <option value="Other">📨 Other</option>
            </select>
          </div>

          <div className="vmx-form-group">
            <label>ชื่อ (optional)</label>
            <input type="text" value={formData.fromName} onChange={(e) => setFormData({ ...formData, fromName: e.target.value })} placeholder="เช่น Vet86_PingP" maxLength={100} />
          </div>

          <div className="vmx-form-group">
            <label>Email (optional, ใส่ถ้าอยากให้ตอบกลับ)</label>
            <input
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
            <label>หัวข้อ</label>
            <input type="text" value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} placeholder="เช่น ข้อสอบ COM IV ตอบไม่ถูก" maxLength={200} />
          </div>

          <div className="vmx-form-group">
            <label>ข้อความ * <span style={{ fontSize: 11, color: 'var(--clr-ink-soft)', fontWeight: 'normal' }}>({formData.message.length}/5000)</span></label>
            <textarea
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
            {status === 'sending' ? '⏳ กำลังส่ง...' : status === 'success' ? '✅ ส่งสำเร็จแล้ว' : '📨 ส่งข้อความ'}
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
