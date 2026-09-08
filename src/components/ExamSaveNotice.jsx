import Mochi from './Mochi.jsx';

export default function ExamSaveNotice({ status }) {
  if (!status || (!status.localError && !status.pendingCount && !status.detailError)) return null;
  return (
    <section role="status" aria-label="สถานะการบันทึกผลสอบ" style={{ padding: 14, margin: '0 0 16px', border: '1px solid var(--clr-border)', borderRadius: 12, background: 'var(--clr-surface)' }}>
      <p style={{ margin: '0 0 10px', color: 'var(--clr-ink)', fontSize: 14 }}>
        <Mochi state={status.localError || status.detailError ? 'encourage' : 'loading'} size={36} slot="save" className="vmx-status-mochi" />
        {status.localError || status.detailError || status.error || `ผลสอบ ${status.pendingCount} ชุดบันทึกในเครื่องแล้ว และ${status.sending ? 'กำลังส่งเข้าบัญชี' : 'รอส่งเข้าบัญชีเมื่อเชื่อมต่อได้'}`}
      </p>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <button type="button" className="vmx-btn vmx-btn-ghost" disabled={status.sending && !status.localError} onClick={status.localError ? status.retryLocal : status.detailError ? status.retryDetails : status.retry}>ลองบันทึกอีกครั้ง</button>
        {status.localError && <button type="button" className="vmx-btn vmx-btn-primary" onClick={status.exportRecovery}>ดาวน์โหลดข้อมูลสำรอง</button>}
        {status.detailError && <button type="button" className="vmx-btn vmx-btn-primary" onClick={status.exportDetails}>สำรองรายละเอียดชุดนี้</button>}
      </div>
    </section>
  );
}
