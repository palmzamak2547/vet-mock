// ============================================================
// AdminFailures — "ล้มเหลวใน 24 ชั่วโมง" on /app/admin
// ============================================================
// The one screen that answers "did anything fail, and did every automation
// run". Each part loads and fails on its own, and a part that cannot be read
// says so: an empty table here must always mean nothing failed.
// ============================================================
import { useEffect, useState } from 'react';
import { adminRpc } from '../lib/admin-api.js';
import { fetchAutomations, recordMissing, UNREADABLE } from '../lib/failure-report.js';

const TH_MONTHS = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
const fmtWhen = (value) => {
  const d = new Date(value || '');
  if (Number.isNaN(d.getTime())) return '—';
  return `${d.getDate()} ${TH_MONTHS[d.getMonth()]}, ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
};
const n = (v) => (v == null ? '—' : Number(v).toLocaleString('en-US'));
const KIND = { error: 'error', rejection: 'promise', render: 'หน้าพัง', save: 'บันทึกไม่สำเร็จ', sync: 'ซิงก์ไม่สำเร็จ', chunk: 'โหลดหน้าไม่ได้', load: 'โหลดข้อมูลไม่ได้' };
const FLAG = { ok: ['good', 'ปกติ'], running: ['info', 'กำลังรัน'], late: ['warn', 'ไม่ได้รันตามเวลา'], failed: ['alarm', 'ล้มเหลว'], unknown: ['warn', 'อ่านไม่ได้'] };

export default function AdminFailures({ tick }) {
  const [record, setRecord] = useState({ loading: true });
  const [autos, setAutos] = useState(null);
  useEffect(() => {
    let alive = true;
    setRecord({ loading: true });
    adminRpc('admin_failures', { p_hours: 24 })
      .then((data) => { if (alive) setRecord({ data }); })
      .catch((error) => { if (alive) setRecord({ error, missing: recordMissing(error) }); });
    fetchAutomations().then((rows) => { if (alive) setAutos(rows); });
    return () => { alive = false; };
  }, [tick]);

  const d = record.data;
  const errors = d?.errors || [];
  const total = errors.reduce((s, e) => s + Number(e.count || 0), 0);
  const badAutos = (autos || []).filter((a) => a.state !== 'ok' && a.state !== 'running').length;
  const setup = (d?.setup_failures || []).reduce((s, f) => s + Number(f.count || 0), 0);

  return (
    <section id="ad-failures" className="ad-card">
      <div className="ad-card-head">
        <h2>ล้มเหลวใน 24 ชั่วโมง</h2>
        <p>สิ่งที่พังในเบราว์เซอร์ของนิสิต บัญชีใหม่ที่สร้างโปรไฟล์ไม่สำเร็จ และงานอัตโนมัติทุกตัว จำนวนเป็นค่าต่ำสุด: แต่ละเบราว์เซอร์ส่งได้ 20 รายงานต่อหน้า และแต่ละ IP 50 รายงานต่อวัน (นิสิตที่ใช้เน็ตมหาวิทยาลัยใช้ IP ร่วมกัน) ส่วนที่อ่านไม่ได้จะบอกว่าอ่านไม่ได้</p>
      </div>

      {record.loading ? <div className="ad-skeleton" style={{ width: '60%' }} /> : record.missing ? (
        <div className="ad-empty">ฐานข้อมูลยังไม่ได้ติดตั้งบันทึกนี้ (migration 20261115230000_failure_record.sql) จำนวนรวมยังอยู่ในหัวข้อข้อผิดพลาดด้านล่าง</div>
      ) : record.error ? (
        <div className="ad-empty">อ่านบันทึกไม่สำเร็จ ({record.error.message}) กดดึงใหม่เพื่อลองอีกครั้ง</div>
      ) : (
        <>
          <p className="ad-muted" role="status">
            {total ? `${n(total)} ครั้ง ใน ${n(errors.length)} แบบ` : 'ไม่มีอะไรพังในเบราว์เซอร์ของนิสิต'}
            {d.without_profile ? `, บัญชีที่ไม่มีโปรไฟล์ ${n(d.without_profile)}` : ''}
            {setup ? `, สร้างบัญชีไม่ครบ ${n(setup)} ครั้งใน 30 วัน` : ''}
          </p>
          {errors.length > 0 && (
            <div className="ad-tablewrap">
              <table className="ad-table">
                <thead><tr><th>ชนิด</th><th>หน้า</th><th>ข้อความ</th><th>เวอร์ชัน</th><th className="num">ครั้งทั้งวัน</th><th>ล่าสุด</th></tr></thead>
                <tbody>
                  {errors.map((e, i) => (
                    <tr key={i}>
                      <td>{KIND[e.kind] || e.kind}</td>
                      <td>{e.view}</td>
                      <td><span className="ad-id">{e.category}</span> {e.message || <span className="ad-muted">ไม่มีข้อความ</span>}{e.frame ? <> <span className="ad-id">{e.frame}</span></> : null}</td>
                      <td><span className="ad-id">{e.release}</span></td>
                      <td className="num">{n(e.count)}</td>
                      <td className="num">{fmtWhen(e.last_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {d.without_profile > 0 && (
            <p className="ad-muted">บัญชีที่ไม่มีโปรไฟล์ได้โปรไฟล์คืนเองเมื่อเจ้าของเข้าแอปครั้งถัดไป</p>
          )}
        </>
      )}

      <p className="ad-subhead" role="heading" aria-level="3">งานอัตโนมัติ</p>
      {!autos ? <div className="ad-skeleton" style={{ width: '40%' }} /> : (
        <>
          <p className="ad-muted" role="status">{badAutos ? `${badAutos} งานต้องดู` : 'ทุกงานรันตามเวลาและผ่าน'}</p>
          <div className="ad-tablewrap">
            <table className="ad-table">
              <thead><tr><th>งาน</th><th>สถานะ</th><th>รายละเอียด</th><th>รอบล่าสุด</th></tr></thead>
              <tbody>
                {autos.map((a) => {
                  const [tone, label] = FLAG[a.state] || FLAG.unknown;
                  return (
                    <tr key={a.file}>
                      <td>{a.name}</td>
                      <td><span className={`ad-flag ${tone}`}>{label}</span></td>
                      <td>{a.detail}</td>
                      <td className="num">{a.url ? <a href={a.url} target="_blank" rel="noreferrer">{fmtWhen(a.at)}</a> : '—'}</td>
                    </tr>
                  );
                })}
                <tr>
                  <td>งานตั้งเวลาในฐานข้อมูล (pg_cron)</td>
                  {!d ? <><td><span className="ad-flag warn">อ่านไม่ได้</span></td><td>ต้องติดตั้งบันทึกด้านบนก่อน</td><td>—</td></>
                    : d.db_jobs == null ? <><td><span className="ad-flag info">ไม่มี</span></td><td>ฐานข้อมูลไม่ได้เปิด pg_cron จึงไม่มีงานตั้งเวลา</td><td>—</td></>
                    : <><td><span className={`ad-flag ${d.db_jobs.some((j) => j.active && j.last_status && j.last_status !== 'succeeded') ? 'alarm' : 'good'}`}>{n(d.db_jobs.length)} งาน</span></td>
                        <td>{d.db_jobs.map((j) => `${j.name} ${j.last_status || 'ยังไม่เคยรัน'}`).join(', ') || 'ไม่มีงาน'}</td><td>—</td></>}
                </tr>
                {UNREADABLE.map((u) => (
                  <tr key={u.name}><td>{u.name}</td><td><span className="ad-flag info">ดูจากที่อื่น</span></td><td>{u.where}</td><td>—</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </section>
  );
}
