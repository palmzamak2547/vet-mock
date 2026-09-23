import Mochi from '../components/Mochi.jsx';
import { useState, useEffect, useRef } from 'react';
import { thaiError } from '../lib/errors.js';
import { createGroup, joinGroupByCode, getMyGroups, leaveGroup } from '../lib/api.js';
import { confirmDialog, alertDialog } from '../lib/dialog.js';
import StatePanel from '../components/StatePanel.jsx';
import { EMPTY_ART } from '../data/art.js';

export default function GroupsView({ user, profile, goHome, setActiveGroup, setView }) {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [showJoin, setShowJoin] = useState(false);
  const [newName, setNewName] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [error, setError] = useState('');
  const [loadError, setLoadError] = useState('');
  // One create or join at a time. A double tap, or Enter and then a click,
  // used to send two requests before the first came back: two groups with the
  // same name and two invite codes, and only the second in the list. The ref
  // closes the gap between two taps in the same render, which state cannot;
  // the state is what disables the button.
  const busyRef = useRef(false);
  const [busy, setBusy] = useState(false);
  // Whose groups `groups` holds, and who is signed in now. An email link for
  // another account, opened in this browser while the list is on screen,
  // switches the session straight from one account to the other without
  // passing through signed-out, so this view stays mounted. The list is drawn
  // only for the account it was loaded for, and an answer that arrives for
  // the previous account (a load, a create) is dropped.
  const [listOwner, setListOwner] = useState(user.id);
  const ownerRef = useRef(user.id);
  const stillFor = (owner) => ownerRef.current === owner;

  const load = async () => {
    const owner = user.id;
    if (!stillFor(owner)) return;
    setLoading(true);
    setLoadError('');
    try {
      const rows = await getMyGroups(owner);
      if (stillFor(owner)) setGroups(rows);
    } catch (e) { if (stillFor(owner)) setLoadError(thaiError(e, 'โหลดกลุ่มไม่สำเร็จ')); }
    finally { if (stillFor(owner)) setLoading(false); }
  };

  useEffect(() => {
    ownerRef.current = user.id;
    if (listOwner !== user.id) {
      setGroups([]); setError('');
      setShowCreate(false); setShowJoin(false); setNewName(''); setJoinCode('');
      setListOwner(user.id);
    }
    load();
  }, [user.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const shownGroups = listOwner === user.id ? groups : [];
  const listLoading = loading || listOwner !== user.id;

  const handleCreate = async (e) => {
    e.preventDefault();
    if (busyRef.current) return;
    setError('');
    if (!newName.trim()) return;
    const owner = user.id;
    busyRef.current = true;
    setBusy(true);
    try {
      const g = await createGroup(newName.trim(), owner);
      if (!stillFor(owner)) return;
      // From the latest list, not the one this render captured: a first load
      // that lands while the create is out must not be overwritten.
      setGroups((prev) => [...prev, { ...g, role: 'admin' }]);
      setNewName(''); setShowCreate(false);
      alertDialog(`สร้างกลุ่ม "${g.name}" สำเร็จ!\nรหัส invite: ${g.code}\n\nส่งรหัสนี้ให้เพื่อนเพื่อ join`);
    } catch (e) { if (stillFor(owner)) setError(thaiError(e, 'ทำรายการไม่สำเร็จ ลองใหม่อีกครั้ง')); }
    finally { busyRef.current = false; setBusy(false); }
  };

  const handleJoin = async (e) => {
    e.preventDefault();
    if (busyRef.current) return;
    setError('');
    if (!joinCode.trim()) return;
    const owner = user.id;
    busyRef.current = true;
    setBusy(true);
    try {
      await joinGroupByCode(joinCode.trim(), owner);
      if (!stillFor(owner)) return;
      setJoinCode(''); setShowJoin(false);
      await load();
    } catch (e) { if (stillFor(owner)) setError(thaiError(e, 'ทำรายการไม่สำเร็จ ลองใหม่อีกครั้ง')); }
    finally { busyRef.current = false; setBusy(false); }
  };

  // The group page is told which account opened it, so it can refuse to draw
  // this group (name, invite code) if the session has moved on by then.
  const openGroup = (g) => { setActiveGroup({ ...g, openedBy: user.id }); setView('group-detail'); };

  const handleLeave = async (groupId) => {
    if (!(await confirmDialog({ title: 'ออกจากกลุ่มนี้?', confirmLabel: 'ออกจากกลุ่ม', tone: 'danger' }))) return;
    const owner = user.id;
    try { await leaveGroup(groupId, owner); if (stillFor(owner)) await load(); }
    catch (e) { if (stillFor(owner)) setError(thaiError(e, 'ทำรายการไม่สำเร็จ ลองใหม่อีกครั้ง')); }
  };

  return (
    <>
      <div className="vmx-hero">
        <Mochi state="hearts" size={44} slot="page-intro" className="vmx-hero-mochi" />
        <h1>กลุ่ม <em>ติว</em></h1>
        <p>สร้างกลุ่มแล้วส่ง code ให้เพื่อน หรือ join ด้วย code — แข่งคะแนน, เรียนไปด้วยกัน</p>
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
              <button type="submit" className="vmx-btn vmx-btn-primary vmx-btn-sm" disabled={busy}>สร้าง</button>
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
              <button type="submit" className="vmx-btn vmx-btn-primary vmx-btn-sm" disabled={busy}>Join</button>
            </div>
          </form>
        </div>
      )}

      {error && <div style={{ padding: 12, borderRadius: 10, background: 'var(--clr-rose-soft)', marginBottom: 16, fontSize: 13 }}>⚠️ {error}</div>}

      <div className="vmx-section-label">กลุ่มของฉัน ({shownGroups.length})</div>

      {listLoading ? (
        <StatePanel kind="loading" title="กำลังโหลดกลุ่มของคุณ…" />
      ) : loadError ? (
        <StatePanel kind="error" title="โหลดกลุ่มไม่สำเร็จ" body={loadError} actionLabel="ลองอีกครั้ง" onAction={load} />
      ) : shownGroups.length === 0 ? (
        <StatePanel art={EMPTY_ART.groups} title="ยังไม่มีกลุ่ม" body="สร้างกลุ่มใหม่ หรือ join ด้วย invite code เพื่อเริ่มติวกับเพื่อน" />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {shownGroups.map((g) => (
            <div key={g.id} className="vmx-dash-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className="vmx-pressable-card"
                  onClick={() => openGroup(g)}
                  style={{ flex: '1 1 220px', padding: 0 }}
                  aria-label={`เปิดกลุ่ม ${g.name}, code ${g.code}`}
                >
                  <h3 style={{ margin: 0 }}>{g.name}</h3>
                  <div style={{ fontFamily: 'var(--vmx-mono)', fontSize: 12, color: 'var(--clr-ink-soft)', marginTop: 4 }}>
                    Code: <strong style={{ color: 'var(--clr-gold-text)' }}>{g.code}</strong>, {g.role === 'admin' ? '👑 Admin' : 'Member'}
                  </div>
                </button>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button className="vmx-btn vmx-btn-primary vmx-btn-sm" onClick={() => openGroup(g)}>เปิด →</button>
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
