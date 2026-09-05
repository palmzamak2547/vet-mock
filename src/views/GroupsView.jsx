import { useState, useEffect } from 'react';
import { thaiError } from '../lib/errors.js';
import { createGroup, joinGroupByCode, getMyGroups, leaveGroup } from '../lib/api.js';
import { confirmDialog, alertDialog } from '../lib/dialog.js';
import StatePanel from '../components/StatePanel.jsx';

export default function GroupsView({ user, profile, goHome, setActiveGroup, setView }) {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [showJoin, setShowJoin] = useState(false);
  const [newName, setNewName] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [error, setError] = useState('');
  const [loadError, setLoadError] = useState('');

  const load = async () => {
    setLoading(true);
    setLoadError('');
    try { setGroups(await getMyGroups(user.id)); }
    catch (e) { setLoadError(thaiError(e, 'โหลดกลุ่มไม่สำเร็จ')); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    if (!newName.trim()) return;
    try {
      const g = await createGroup(newName.trim(), user.id);
      setGroups([...groups, { ...g, role: 'admin' }]);
      setNewName(''); setShowCreate(false);
      alertDialog(`สร้างกลุ่ม "${g.name}" สำเร็จ!\nรหัส invite: ${g.code}\n\nส่งรหัสนี้ให้เพื่อนเพื่อ join`);
    } catch (e) { setError(thaiError(e, 'ทำรายการไม่สำเร็จ ลองใหม่อีกครั้ง')); }
  };

  const handleJoin = async (e) => {
    e.preventDefault();
    setError('');
    if (!joinCode.trim()) return;
    try {
      await joinGroupByCode(joinCode.trim(), user.id);
      setJoinCode(''); setShowJoin(false);
      await load();
    } catch (e) { setError(thaiError(e, 'ทำรายการไม่สำเร็จ ลองใหม่อีกครั้ง')); }
  };

  const handleLeave = async (groupId) => {
    if (!(await confirmDialog({ title: 'ออกจากกลุ่มนี้?', confirmLabel: 'ออกจากกลุ่ม', tone: 'danger' }))) return;
    try { await leaveGroup(groupId, user.id); await load(); }
    catch (e) { setError(thaiError(e, 'ทำรายการไม่สำเร็จ ลองใหม่อีกครั้ง')); }
  };

  return (
    <>
      <div className="vmx-hero">
        <h1>กลุ่ม <em>ติว</em></h1>
        <p>สร้างกลุ่มแล้วส่ง code ให้เพื่อน หรือ join ด้วย code — แชร์ข้อสอบ, แข่งคะแนน, เรียนไปด้วยกัน</p>
      </div>

      <div className="vmx-btn-row" style={{ marginBottom: 24, justifyContent: 'flex-start' }}>
        <button className="vmx-btn vmx-btn-primary" onClick={() => { setShowCreate(!showCreate); setShowJoin(false); }}>สร้างกลุ่ม</button>
        <button className="vmx-btn vmx-btn-ghost" onClick={() => { setShowJoin(!showJoin); setShowCreate(false); }}>🔑 Join ด้วย Code</button>
      </div>

      {showCreate && (
        <div className="vmx-config-panel">
          <form onSubmit={handleCreate}>
            <div className="vmx-form-group">
              <label htmlFor="vmx-group-name">ชื่อกลุ่ม</label>
              <input id="vmx-group-name" value={newName} onChange={(e) => setNewName(e.target.value.slice(0, 60))} placeholder="เช่น Vet 86 Final Exam" maxLength={60} required autoFocus />
            </div>
            <div className="vmx-btn-row">
              <button type="button" className="vmx-btn vmx-btn-ghost vmx-btn-sm" onClick={() => setShowCreate(false)}>ยกเลิก</button>
              <button type="submit" className="vmx-btn vmx-btn-primary vmx-btn-sm">สร้าง</button>
            </div>
          </form>
        </div>
      )}

      {showJoin && (
        <div className="vmx-config-panel">
          <form onSubmit={handleJoin}>
            <div className="vmx-form-group">
              <label htmlFor="vmx-group-code">รหัส Invite (6 ตัวอักษร)</label>
              <input id="vmx-group-code" value={joinCode} onChange={(e) => setJoinCode(e.target.value.toUpperCase())} placeholder="ABC123" maxLength={6} required autoFocus style={{ fontFamily: 'var(--vmx-mono)', fontSize: 18, letterSpacing: '0.2em', textAlign: 'center' }} />
            </div>
            <div className="vmx-btn-row">
              <button type="button" className="vmx-btn vmx-btn-ghost vmx-btn-sm" onClick={() => setShowJoin(false)}>ยกเลิก</button>
              <button type="submit" className="vmx-btn vmx-btn-primary vmx-btn-sm">Join</button>
            </div>
          </form>
        </div>
      )}

      {error && <div style={{ padding: 12, borderRadius: 10, background: 'var(--clr-rose-soft)', marginBottom: 16, fontSize: 13 }}>⚠️ {error}</div>}

      <div className="vmx-section-label">กลุ่มของฉัน ({groups.length})</div>

      {loading ? (
        <StatePanel kind="loading" title="กำลังโหลดกลุ่มของคุณ…" />
      ) : loadError ? (
        <StatePanel kind="error" title="โหลดกลุ่มไม่สำเร็จ" body={loadError} actionLabel="ลองอีกครั้ง" onAction={load} />
      ) : groups.length === 0 ? (
        <StatePanel title="ยังไม่มีกลุ่ม" body="สร้างกลุ่มใหม่ หรือ join ด้วย invite code เพื่อเริ่มติวกับเพื่อน" />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {groups.map((g) => (
            <div key={g.id} className="vmx-dash-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className="vmx-pressable-card"
                  onClick={() => { setActiveGroup(g); setView('group-detail'); }}
                  style={{ flex: '1 1 220px', padding: 0 }}
                  aria-label={`เปิดกลุ่ม ${g.name}, code ${g.code}`}
                >
                  <h3 style={{ margin: 0 }}>{g.name}</h3>
                  <div style={{ fontFamily: 'var(--vmx-mono)', fontSize: 12, color: 'var(--clr-ink-soft)', marginTop: 4 }}>
                    Code: <strong style={{ color: 'var(--clr-gold-text)' }}>{g.code}</strong>, {g.role === 'admin' ? '👑 Admin' : 'Member'}
                  </div>
                </button>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button className="vmx-btn vmx-btn-primary vmx-btn-sm" onClick={() => { setActiveGroup(g); setView('group-detail'); }}>เปิด →</button>
                  <button className="vmx-btn vmx-btn-ghost vmx-btn-sm" onClick={() => handleLeave(g.id)}>ออก</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="vmx-btn-row" style={{ marginTop: 30 }}>
        <button className="vmx-btn vmx-btn-ghost" onClick={goHome}>← หน้าแรก</button>
      </div>
    </>
  );
}
