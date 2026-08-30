export default function SyncStatusNotice({
  online,
  justChanged,
  signedIn,
  sync,
  onRetry,
  onOfflineGame,
}) {
  // Storage failures are not an account matter. LOCAL_WRITE_FAILED means the
  // change was NOT saved anywhere — the student's finished set is gone — and
  // it can happen to anyone, because the write is to this device. Every error
  // used to be gated behind `signedIn`, so a signed-out student who was
  // online saw nothing at all: the component returned null and the loss went
  // unannounced. Cloud problems still require an account to be worth
  // mentioning; local ones never did.
  const localFailure = sync?.error?.code === 'LOCAL_WRITE_FAILED';
  const hasSyncProblem = (signedIn && (sync?.phase === 'offline' || sync?.phase === 'error'))
    || (sync?.phase === 'error' && localFailure);
  if (online && !justChanged && !hasSyncProblem) return null;

  const syncing = signedIn && ['hydrating', 'pending', 'syncing'].includes(sync?.phase);
  const message = !online
    ? (
      signedIn
        ? (sync?.pending
          ? '● ออฟไลน์ — บันทึกการเปลี่ยนแปลงไว้ในเครื่องแล้ว และจะซิงก์เมื่อเน็ตกลับ'
          : '● ออฟไลน์ — ใช้งานต่อได้ ข้อมูลใหม่จะเก็บไว้ในเครื่อง')
        : '● ออฟไลน์ — ใช้งานส่วนที่เปิดไว้แล้วได้ตามปกติ'
    )
    : hasSyncProblem
      // The generic fallback promises the local copy is intact, which is the
      // one thing that is NOT true when the local write is what failed.
      ? `● ${sync?.error?.message || (localFailure
        ? 'บันทึกลงเครื่องไม่สำเร็จ การเปลี่ยนแปลงล่าสุดอาจไม่ถูกเก็บไว้'
        : 'ยังซิงก์ข้อมูลกับบัญชีไม่ได้ ข้อมูลในเครื่องยังอยู่ครบ')}`
      : syncing
        ? '● กลับมาออนไลน์แล้ว — กำลังตรวจสอบและซิงก์ข้อมูล'
        : '● กลับมาออนไลน์แล้ว';

  // Losing a save is not good news, so it must not be painted in the same
  // green as "back online".
  const color = localFailure
    ? 'var(--clr-rose-text, #b3453f)'
    : (online ? 'var(--clr-sage, #4a6b4a)' : 'var(--clr-gold, #b88940)');
  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        padding: '8px 14px',
        marginBottom: 8,
        borderRadius: 8,
        fontSize: 13,
        background: online
          ? 'rgba(74, 107, 74, 0.12)'
          : 'rgba(184, 137, 64, 0.18)',
        color,
      }}
    >
      <span>{message}</span>
      <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
        {online && hasSyncProblem && sync?.error?.retryable !== false && (
          <button
            type="button"
            onClick={onRetry}
            className="vmx-btn vmx-btn-ghost vmx-btn-sm"
            style={{
              padding: '4px 10px',
              fontSize: 12,
              color,
              border: '1px solid currentColor',
              background: 'transparent',
            }}
          >
            ลองซิงก์อีกครั้ง
          </button>
        )}
        {!online && (
          <button
            type="button"
            onClick={onOfflineGame}
            className="vmx-btn vmx-btn-ghost vmx-btn-sm"
            style={{
              padding: '4px 10px',
              fontSize: 12,
              color,
              border: '1px solid currentColor',
              background: 'transparent',
            }}
            aria-label="เล่นมินิเกมระหว่างรอเน็ตกลับ"
          >
            🎮 เล่นเกม
          </button>
        )}
      </div>
    </div>
  );
}
