export default function AuthRequiredState({ onSignIn, onHome }) {
  return (
    <section
      className="vmx-empty"
      aria-labelledby="vmx-auth-required-title"
      style={{ maxWidth: 480, margin: '48px auto', textAlign: 'center' }}
    >
      <div aria-hidden style={{ fontSize: 36, marginBottom: 12 }}>🔒</div>
      <h1 id="vmx-auth-required-title" style={{ fontSize: 22, margin: '0 0 8px' }}>
        หน้านี้ใช้บัญชี VetMock
      </h1>
      <p style={{ margin: '0 0 20px', color: 'var(--clr-ink-soft)', lineHeight: 1.6 }}>
        เข้าสู่ระบบเพื่อเปิดข้อมูลกลุ่ม อันดับ และการตั้งค่าบัญชี
      </p>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 10, flexWrap: 'wrap' }}>
        <button type="button" className="vmx-btn vmx-btn-primary" onClick={onSignIn}>
          เข้าสู่ระบบ
        </button>
        <button type="button" className="vmx-btn vmx-btn-ghost" onClick={onHome}>
          กลับหน้าแรก
        </button>
      </div>
    </section>
  );
}
