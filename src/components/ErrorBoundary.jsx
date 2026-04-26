// ============================================================
// ErrorBoundary
// ============================================================
// Catches render errors in any child subtree and shows a friendly
// fallback instead of crashing the whole app to a blank page.
//
// Usage:
//   <ErrorBoundary onReset={goHome}>
//     <SomeView />
//   </ErrorBoundary>
//
// React doesn't yet support function-component error boundaries — we
// have to use a class. The fallback UI is intentionally tiny so it
// works even if styles haven't loaded.
// ============================================================

import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    // Log to console in dev; could ship to an error service later.
    console.error('[ErrorBoundary]', error, info);
  }

  reset = () => {
    this.setState({ error: null });
    if (this.props.onReset) this.props.onReset();
  };

  render() {
    if (this.state.error) {
      const msg = this.state.error?.message || String(this.state.error);
      return (
        <div style={{
          margin: '40px auto',
          maxWidth: 560,
          padding: 24,
          borderRadius: 16,
          background: 'var(--clr-rose-soft, #f5e6e6)',
          border: '1px solid var(--clr-rose, #c26d6d)',
          color: 'var(--clr-ink, #2d2418)',
          fontFamily: 'inherit',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: 36, marginBottom: 8 }}>😿</div>
          <h2 style={{ margin: '0 0 8px', fontFamily: 'Fraunces, serif', fontSize: 20 }}>
            หน้านี้ขัดข้อง
          </h2>
          <p style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--clr-ink-soft, #6b6357)' }}>
            มีบางอย่างผิดพลาดในหน้านี้ — ลองกลับหน้าแรกแล้วเข้าใหม่<br/>
            ถ้าเจอบ่อย ช่วย <strong>แจ้งปัญหา</strong> ให้รู้ได้นะ
          </p>
          <details style={{ marginTop: 12, fontSize: 11, color: 'var(--clr-ink-soft, #6b6357)', textAlign: 'left' }}>
            <summary style={{ cursor: 'pointer' }}>รายละเอียด (technical)</summary>
            <pre style={{
              marginTop: 8,
              padding: 10,
              background: 'rgba(0,0,0,0.05)',
              borderRadius: 6,
              fontSize: 10,
              fontFamily: 'JetBrains Mono, monospace',
              overflow: 'auto',
              maxHeight: 160,
            }}>{msg}</pre>
          </details>
          <div style={{ marginTop: 16, display: 'flex', gap: 8, justifyContent: 'center' }}>
            <button
              onClick={this.reset}
              style={{
                padding: '10px 20px',
                borderRadius: 999,
                border: '1px solid var(--clr-ink, #2d2418)',
                background: 'var(--clr-ink, #2d2418)',
                color: 'var(--clr-bg, #faf7f0)',
                cursor: 'pointer',
                fontSize: 14,
                fontWeight: 600,
              }}
            >
              ↻ กลับหน้าแรก
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
