import { useState } from 'react';

const CONTACT_EMAIL = 'palmzamak2547@gmail.com';

export default function FeedbackView({ goHome, user, profile }) {
  const [formData, setFormData] = useState({
    type: 'Bug',
    subject: '',
    message: '',
    fromEmail: user?.email || '',
    fromName: profile?.username || '',
  });
  const [status, setStatus] = useState('idle'); // 'idle' | 'sending' | 'success' | 'error' | 'fallback'
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    if (!formData.message.trim()) {
      setError('กรุณากรอกข้อความ');
      return;
    }
    setError('');
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

      // API fail or not configured → fallback to mailto
      const errData = await resp.json().catch(() => ({}));
      console.warn('API error, falling back to mailto:', errData);
      setStatus('fallback');
      openMailto();

    } catch (err) {
      console.error('Network error:', err);
      setStatus('fallback');
      openMailto();
    }
  };

  const openMailto = () => {
    const body = `Type: ${formData.type}\nSubject: ${formData.subject}\nFrom: ${formData.fromName} <${formData.fromEmail}>\n\n${formData.message}\n\n---\nSent from VetMock`;
    const mailto = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(`[VetMock ${formData.type}] ${formData.subject || 'Feedback'}`)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
  };

  return (
    <>
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

        {status === 'fallback' && (
          <div style={{ padding: 16, borderRadius: 12, background: 'var(--clr-surface-2)', border: '1px solid var(--clr-gold)', marginBottom: 16 }}>
            ⚠️ <strong>เปิดแอป Email ของพี่</strong><br/>
            <span style={{ fontSize: 13, color: 'var(--clr-ink-soft)' }}>
              API ส่งอีเมลยังไม่ได้ตั้งค่า — เปิดแอปอีเมลเพื่อส่งด้วยตัวเอง<br/>
              <em>(เจ้าของเว็บต้อง setup RESEND_API_KEY ใน Vercel)</em>
            </span>
          </div>
        )}

        <form onSubmit={submit}>
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
            <input type="email" value={formData.fromEmail} onChange={(e) => setFormData({ ...formData, fromEmail: e.target.value })} placeholder="you@example.com" maxLength={254} />
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
              required
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
