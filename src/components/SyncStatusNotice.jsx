import Mochi from './Mochi.jsx';
import { useState } from 'react';
import { downloadJSON } from '../hooks/utils.js';
import { confirmDialog, alertDialog } from '../lib/dialog.js';
import { thaiError } from '../lib/errors.js';

export default function SyncStatusNotice({
  online,
  justChanged,
  signedIn,
  sync,
  onRetry,
  onOfflineGame,
}) {
  const [resolving, setResolving] = useState(false);
  const recovery = signedIn ? sync?.recovery : null;
  if (recovery) {
    const choose = async (choice) => {
      const resolve = sync.resolveRecovery;
      if (resolving || !online || typeof resolve !== 'function') return;
      setResolving(true);
      try {
        const agreed = await confirmDialog({
          title: choice === 'local' ? 'ใช้ข้อมูลในเครื่องชุดนี้?' : 'ใช้ข้อมูลล่าสุดจากบัญชี?',
          body: recovery.kind === 'custom-id'
            ? 'ข้อมูลและการแก้ไขที่ยังค้างส่งทั้งหมดจะเก็บไว้เป็นสำเนา แล้วเปิดข้อมูลบัญชีแทน กรุณาดาวน์โหลดสำเนาที่รวมการแก้ไขล่าสุดก่อนเลือก จากนั้นนำข้อสอบที่ต้องการเข้าใหม่'
            : choice === 'local'
            ? 'ค่าที่ต่างกันในบัญชีจะเปลี่ยนตามสำเนาในเครื่องชุดนี้ การแก้ไขใหม่ที่เพิ่งทำยังอยู่ ควรดาวน์โหลดสำเนาก่อนเลือก'
            : 'หยุดนำข้อมูลค้างชุดนี้ไปเขียนทับบัญชี การแก้ไขใหม่ที่เพิ่งทำยังอยู่ และสำเนาชุดเดิมยังเก็บไว้ในเครื่อง ควรดาวน์โหลดสำเนาก่อนเลือก',
          confirmLabel: choice === 'local' ? 'ใช้ข้อมูลในเครื่อง' : 'ใช้ข้อมูลบัญชี',
        });
        if (!agreed) return;
        const result = await resolve(choice);
        if (result?.accepted === false) await alertDialog(thaiError(result.error, 'ยังเปลี่ยนข้อมูลไม่ได้ สำเนาเดิมยังอยู่ กรุณาลองอีกครั้ง'));
      } catch (error) {
        await alertDialog(thaiError(error, 'ยังเปลี่ยนข้อมูลไม่ได้ สำเนาเดิมยังอยู่ กรุณาลองอีกครั้ง'));
      } finally { setResolving(false); }
    };
    const exportCopies = () => {
      try {
        downloadJSON({ ...recovery.local, syncRecovery: { kind: recovery.kind, account: recovery.account,
          exportedAt: new Date().toISOString() } }, `vetmock-sync-recovery-${Date.now()}.json`);
      } catch (error) { alertDialog(thaiError(error, 'ดาวน์โหลดสำเนาไม่สำเร็จ กรุณาลองอีกครั้ง')); }
    };
    return <section className="vmx-config-panel" aria-label="ตรวจข้อมูลก่อนซิงก์">
      <p role="status">{recovery.message || 'มีข้อมูลในเครื่องกับบัญชีต่างกัน กรุณาสำรองและเลือกข้อมูลที่ต้องการใช้'}</p>
      {recovery.kind === 'custom-id' && <p>สำรองข้อมูลและการแก้ไขค้างทั้งหมดก่อนใช้ข้อมูลบัญชี จากนั้นนำข้อสอบที่ต้องการเข้าใหม่ผ่านหน้าจัดการข้อสอบเพื่อเก็บเป็นคนละข้อ</p>}
      <div className="vmx-btn-row">
        <button type="button" className="vmx-btn vmx-btn-ghost" onClick={exportCopies}>ดาวน์โหลดสำเนาทั้งสองชุด</button>
        {recovery.kind !== 'custom-id' && <button type="button" className="vmx-btn vmx-btn-ghost"
          disabled={!online || resolving || !recovery.account} onClick={() => choose('local')}>ใช้ข้อมูลในเครื่อง</button>}
        <button type="button" className="vmx-btn vmx-btn-ghost"
          disabled={!online || resolving || !recovery.account} onClick={() => choose('account')}>ใช้ข้อมูลบัญชี</button>
        {!recovery.account && online && <button type="button" className="vmx-btn vmx-btn-ghost" onClick={onRetry}>ลองอ่านข้อมูลบัญชีอีกครั้ง</button>}
      </div>
      {!online && <p>ออฟไลน์อยู่ สำรองข้อมูลได้ทันที และเลือกข้อมูลเมื่อเชื่อมต่ออีกครั้ง</p>}
    </section>;
  }
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
      <span>
        <Mochi state={hasSyncProblem ? 'encourage' : online ? 'happy' : 'sleepy'} size={28} slot="connection" className="vmx-status-mochi" />{message}
        {/* When the device is full, say WHICH keys are using the room. A
            screenshot of this line is what ends the guessing. */}
        {localFailure && sync?.error?.detail && (
          <span style={{ display: 'block', fontSize: 11.5, opacity: 0.8, marginTop: 2, fontFamily: 'var(--vmx-mono)' }}>
            {sync.error.detail}
          </span>
        )}
      </span>
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
