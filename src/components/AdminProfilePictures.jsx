// ============================================================
// AdminProfilePictures — "รูปโปรไฟล์ที่ถูกรายงาน" on /app/admin
// ============================================================
// Pictures members reported, and pictures hidden by reports or by the admin,
// with hide and restore. Restoring clears that picture's reports, so it is not
// hidden again by the same reports. A list that cannot be read says so.
import { useEffect, useState } from 'react';
import { adminRpc } from '../lib/admin-api.js';
import { picturesFor, forgetPictures } from '../lib/profile-picture.js';
import ProfilePicture from './ProfilePicture.jsx';

const STATE = { shown: 'แสดงอยู่', hidden_reports: 'ซ่อนเพราะถูกรายงาน', hidden_admin: 'ผู้ดูแลซ่อน' };
const missing = (error) => /admin_profile_pictures|PGRST202|does not exist|404/i.test(String(error?.message || error?.code || ''));

export default function AdminProfilePictures({ tick }) {
  const [list, setList] = useState({ loading: true });
  const [pictures, setPictures] = useState({});
  const [round, setRound] = useState(0);
  const [busy, setBusy] = useState('');

  useEffect(() => {
    let alive = true;
    setList((prev) => (prev.rows ? prev : { loading: true }));
    adminRpc('admin_profile_pictures')
      .then((rows) => {
        if (!alive) return;
        const data = Array.isArray(rows) ? rows : [];
        setList({ rows: data });
        if (data.length) picturesFor(data.map((r) => r.user_id)).then((p) => { if (alive) setPictures(p); }, () => {});
      })
      .catch((error) => { if (alive) setList({ error, missing: missing(error) }); });
    return () => { alive = false; };
  }, [tick, round]);

  const setState = async (userId, state) => {
    setBusy(userId);
    try {
      await adminRpc('admin_set_profile_picture', { p_owner: userId, p_state: state });
      forgetPictures();
      setRound((n) => n + 1);
    } catch (error) {
      setList((prev) => ({ ...prev, actionError: error?.message || 'บันทึกไม่สำเร็จ' }));
    } finally {
      setBusy('');
    }
  };

  const rows = list.rows || [];
  return (
    <section id="ad-profile-pictures" className="ad-card">
      <div className="ad-card-head">
        <h2>รูปโปรไฟล์ที่ถูกรายงาน</h2>
        <p>รูปที่นิสิตใส่เองแล้วมีเพื่อนรายงาน หรือรูปที่ถูกซ่อนอยู่ รูปจะถูกซ่อนเองเมื่อมีผู้รายงานรูปเดียวกันครบ 3 คน และเจ้าของรูปเห็นข้อความแจ้งในหน้าโปรไฟล์ การแสดงรูปอีกครั้งจะล้างรายงานของรูปนั้น</p>
      </div>
      {list.loading ? <div className="ad-skeleton" style={{ width: '50%' }} /> : list.missing ? (
        <div className="ad-empty">ฐานข้อมูลยังไม่ได้ติดตั้งส่วนนี้ (migration 20261116120000_profile_pictures.sql)</div>
      ) : list.error ? (
        <div className="ad-empty">อ่านรายการไม่สำเร็จ ({list.error.message}) กดดึงใหม่เพื่อลองอีกครั้ง</div>
      ) : (
        <>
          <p className="ad-muted" role="status">{rows.length ? `${rows.length} รูป` : 'ไม่มีรูปที่ถูกรายงานหรือถูกซ่อน'}</p>
          {list.actionError && <p className="ad-muted" role="alert">{list.actionError}</p>}
          {rows.length > 0 && (
            <div className="ad-tablewrap">
              <table className="ad-table">
                <thead><tr><th>รูป</th><th>ชื่อ</th><th>สถานะ</th><th className="num">ผู้รายงาน</th><th /></tr></thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.user_id}>
                      <td><ProfilePicture picture={pictures[r.user_id]} emoji={null} size={48} ownerView /></td>
                      <td>{r.username || <span className="ad-muted">ไม่มีชื่อ</span>}</td>
                      <td>{STATE[r.state] || r.state}</td>
                      <td className="num">{Number(r.reports || 0)}</td>
                      <td>
                        {r.state === 'shown' || r.state === 'hidden_reports' ? (
                          <button type="button" className="vmx-btn vmx-btn-ghost vmx-btn-sm" disabled={busy === r.user_id} onClick={() => setState(r.user_id, 'hidden_admin')}>ซ่อน</button>
                        ) : null}
                        {r.state !== 'shown' ? (
                          <button type="button" className="vmx-btn vmx-btn-ghost vmx-btn-sm" disabled={busy === r.user_id} onClick={() => setState(r.user_id, 'shown')}>แสดงอีกครั้ง</button>
                        ) : null}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </section>
  );
}
