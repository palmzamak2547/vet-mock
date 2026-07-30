export default function SyncStatusNotice({
  online,
  justChanged,
  signedIn,
  sync,
  onRetry,
  onOfflineGame,
}) {
  const hasSyncProblem = signedIn && (sync?.phase === 'offline' || sync?.phase === 'error');
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
      ? `● ${sync?.error?.message || 'ยังซิงก์ข้อมูลกับบัญชีไม่ได้ ข้อมูลในเครื่องยังอยู่ครบ'}`
      : syncing
        ? '● กลับมาออนไลน์แล้ว — กำลังตรวจสอบและซิงก์ข้อมูล'
        : '● กลับมาออนไลน์แล้ว';

  const color = online ? 'var(--clr-sage, #4a6b4a)' : 'var(--clr-gold, #b88940)';
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
