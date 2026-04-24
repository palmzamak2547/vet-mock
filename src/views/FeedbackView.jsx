import { useState } from 'react';

// Formspree endpoint — setup ที่ formspree.io (ฟรี 50/month)
// ถ้ายังไม่ได้ setup ก็จะ fallback เปิด mailto: แทน
const FORMSPREE_ENDPOINT = import.meta.env.VITE_FORMSPREE_ENDPOINT || '';
const CONTACT_EMAIL = 'palmzamak2547@gmail.com';

export default function FeedbackView({ goHome, user, profile }) {
  const [formData, setFormData] = useState({
    name: profile?.username || '',
    email: user?.email || '',
    type: 'bug',
    subject: '',
    message: '',
  });
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    if (!formData.message.trim()) return;
    setStatus('sending'); setError('');

    // Option 1: Formspree (recommended)
    if (FORMSPREE_ENDPOINT) {
      try {
        const res = await fetch(FORMSPREE_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({
            ...formData,
            _subject: `[VetMock ${formData.type}] ${formData.subject || 'No subject'}`,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
          }),
        });
        if (res.ok) setStatus('sent');
        else throw new Error('Failed');
      } catch (err) {
        setStatus('error'); setError('ส่งไม่สำเร็จ ลองเปิด email app แทนได้');
      }
      return;
    }

    // Option 2 (fallback): Open mailto link
    const body = `ประเภท: ${formData.type}\nชื่อ: ${formData.name}\nEmail: ${formData.email}\n\nข้อความ:\n${formData.message}\n\n---\nส่งจาก VetMock v5.0\nTime: ${new Date().toLocaleString('th-TH')}`;
    const mailto = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(`[VetMock ${formData.type}] ${formData.subject || 'Feedback'}`)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
    setStatus('sent');
  };

  if (status === 'sent') {
    return (
      <>
        <div className="vmx-results-hero">
          <div style={{ fontSize: 64, marginBottom: 12 }}>✉️</div>
          <div className="vmx-score-label">ส่งแล้ว!</div>
          <h2 style={{ fontFamily: 'Fraunces, serif', margin: '16px 0', fontSize: 24 }}>
            ขอบคุณมากครับ 🙏
          </h2>
          <p style={{ color: 'var(--clr-ink-soft)', fontSize: 14, lineHeight: 1.6, maxWidth: 440, margin: '0 auto' }}>
            ข้อความถึง {CONTACT_EMAIL} แล้ว<br/>
            Feedback ของคุณจะช่วยทำให้ VetMock ดีขึ้นสำหรับรุ่นน้องๆ
          </p>
        </div>
        <div className="vmx-btn-row" style={{ justifyContent: 'center' }}>
          <button className="vmx-btn vmx-btn-primary" onClick={goHome}>← กลับหน้าแรก</button>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="vmx-hero">
        <h1>💌 แจ้ง<em>ปัญหา / เสนอแนะ</em></h1>
        <p>เจอ bug? อยากเสนอไอเดียใหม่? ข้อสอบผิด? — ส่งมาได้เลย ไม่ต้องเกรงใจ</p>
      </div>

      <div className="vmx-config-panel" style={{ maxWidth: 540, margin: '0 auto' }}>
        <form onSubmit={submit}>
          <div className="vmx-form-group">
            <label>ประเภท</label>
            <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })}>
              <option value="bug">🐛 Bug / ข้อผิดพลาด</option>
              <option value="feature">💡 Feature request / ไอเดียใหม่</option>
              <option value="content">📝 ข้อสอบผิด / เฉลยผิด</option>
              <option value="schedule">📅 ข้อมูลตารางสอบผิด/อัพเดต</option>
              <option value="video">🎥 อยากเพิ่มคลิป YouTube</option>
              <option value="other">💬 อื่นๆ</option>
            </select>
          </div>

          <div className="vmx-form-group">
            <label>ชื่อ (ไม่จำเป็น)</label>
            <input type="text" value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="เช่น Ping Vet 86" />
          </div>

          <div className="vmx-form-group">
            <label>Email (ไม่จำเป็น — ไว้ติดต่อกลับถ้าต้องการ)</label>
            <input type="email" value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="you@example.com" />
          </div>

          <div className="vmx-form-group">
            <label>หัวข้อ</label>
            <input type="text" value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              placeholder="เช่น ข้อ 34 เฉลยผิด" />
          </div>

          <div className="vmx-form-group">
            <label>ข้อความ *</label>
            <textarea value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="อธิบายปัญหา หรือข้อเสนอแนะ อย่างละเอียด..."
              rows={6} required />
          </div>

          {status === 'error' && (
            <div style={{ padding: 12, borderRadius: 10, background: 'var(--clr-rose-soft)', fontSize: 13, marginBottom: 12 }}>
              ⚠️ {error}
            </div>
          )}

          <div style={{ fontSize: 12, color: 'var(--clr-ink-soft)', marginBottom: 16, fontStyle: 'italic' }}>
            💌 ข้อความจะส่งไปที่ <strong>{CONTACT_EMAIL}</strong>
          </div>

          <div className="vmx-btn-row">
            <button type="button" className="vmx-btn vmx-btn-ghost" onClick={goHome}>← ยกเลิก</button>
            <button type="submit" className="vmx-btn vmx-btn-primary" disabled={status === 'sending'}>
              {status === 'sending' ? 'กำลังส่ง...' : '💌 ส่ง'}
            </button>
          </div>
        </form>
      </div>

      <div style={{ marginTop: 30, padding: 16, borderRadius: 12, background: 'var(--clr-surface-2)', fontSize: 12, color: 'var(--clr-ink-soft)', lineHeight: 1.6 }}>
        💡 <strong>Tips สำหรับการรายงาน bug:</strong><br/>
        • บอกว่ากดปุ่มอะไร? เกิดอะไรขึ้น?<br/>
        • ถ่ายรูปหน้าจอส่งมาทาง email หลังจากส่งฟอร์มนี้ (ถ้ามีรูป)<br/>
        • บอก browser ที่ใช้ (Chrome, Safari, Firefox)<br/>
        • ข้อมูล feedback จะเก็บเป็นความลับ ไม่แชร์ให้คนอื่น
      </div>
    </>
  );
}
