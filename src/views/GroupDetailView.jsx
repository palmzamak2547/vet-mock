import Mochi from '../components/Mochi.jsx';
import { shownName, shownPicture } from '../lib/public-display.js';
import BoardPresenceNotice from '../components/BoardPresenceNotice.jsx';
import { useState, useEffect, useRef } from 'react';
import { getGroupMembers, getGroupLeaderboard, leaveGroup, deleteGroup } from '../lib/api.js';
import { leaveRule } from '../lib/group-membership.js';
import { qualifiesForLeaderboard } from '../lib/leaderboard-gate.js';
import { copyText } from '../lib/clipboard.js';
import { SUBJECTS } from '../data/questions.js';
import { confirmDialog, alertDialog } from '../lib/dialog.js';
import { thaiError } from '../lib/errors.js';
import StatePanel from '../components/StatePanel.jsx';
import ProfilePicture, { usePictures } from '../components/ProfilePicture.jsx';
import { reportPicture, PICTURE_WORDS } from '../lib/profile-picture.js';

// "รายงานรูปนี้" under another member's own picture. A picture several members
// report is hidden from everyone but its owner, who is told on their profile.
function ReportPicture({ ownerId, name }) {
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);
  const report = async () => {
    const yes = await confirmDialog({
      title: 'รายงานรูปนี้',
      body: `รายงานรูปของ ${name} ว่าไม่เหมาะสม เมื่อมีเพื่อนรายงานรูปเดียวกันหลายคน รูปจะถูกซ่อน และผู้ดูแล VetMock จะเห็นรายการนี้`,
      confirmLabel: 'รายงาน',
      tone: 'danger',
    });
    if (!yes) return;
    setBusy(true);
    const done = await reportPicture(ownerId);
    setBusy(false);
    setNote(done.ok ? PICTURE_WORDS.reported : PICTURE_WORDS[done.problem === 'offline' ? 'offline' : 'report_failed']);
  };
  return (
    <div style={{ marginTop: 8 }}>
      {note ? (
        <p role="status" style={{ fontSize: 14, margin: 0, color: 'var(--clr-ink-soft)' }}>{note}</p>
      ) : (
        <button type="button" className="vmx-hub-link" style={{ fontSize: 14 }} disabled={busy} onClick={report}>รายงานรูปนี้</button>
      )}
    </div>
  );
}

// A group page is two independent requests, one per tab. (A third tab for
// shared questions was removed: the app never had a way to share one.)
const SECTIONS = ['members', 'leaderboard'];
const ALL_PENDING = { members: true, leaderboard: true };
const NONE_FAILED = { members: '', leaderboard: '' };

export default function GroupDetailView({ group, user, goBack, onEditIdentity = null }) {
  const [tab, setTab] = useState('leaderboard'); // 'leaderboard' | 'members'
  const [members, setMembers] = useState([]);
  const pictures = usePictures(members.map((m) => m.id), tab === 'members');
  const [leaderboard, setLeaderboard] = useState([]);
  // Each section loads, fails and retries on its own. One Promise.allSettled
  // behind one spinner made the tab on screen wait for the slowest hidden
  // request, and a failed section was only a banner: its own tab then drew an
  // empty list, as though the group had no members or nobody had scored.
  const [pending, setPending] = useState(ALL_PENDING);
  const [failed, setFailed] = useState(NONE_FAILED);
  // Errors from an action the student took (leave, delete), separate from a
  // load failure, which replaces its own section with a panel.
  const [actionError, setActionError] = useState('');
  const [leaving, setLeaving] = useState(false);
  // The newest request per section. An answer to an older one (a reload
  // overtook it, or the page left this group) is dropped rather than drawn
  // over the newer answer.
  const latest = useRef({ members: 0, leaderboard: 0 });

  const show = {
    members: setMembers,
    // Same min-questions gate as the global board — a 2-question
    // sprint topping a group board is the same luck problem.
    leaderboard: (rows) => setLeaderboard((Array.isArray(rows) ? rows : []).filter(qualifiesForLeaderboard)),
  };

  // Resolves once every requested section has settled, each having painted
  // the moment its own answer arrived.
  const load = (keys = SECTIONS) => {
    const request = { members: getGroupMembers, leaderboard: getGroupLeaderboard };
    const all = (value) => Object.fromEntries(keys.map((key) => [key, value]));
    setPending((p) => ({ ...p, ...all(true) }));
    setFailed((f) => ({ ...f, ...all('') }));
    return Promise.allSettled(keys.map((key) => {
      const ticket = ++latest.current[key];
      const settle = (apply) => {
        if (latest.current[key] !== ticket) return;
        apply();
        setPending((p) => ({ ...p, [key]: false }));
      };
      return request[key](group.id).then(
        (rows) => settle(() => show[key](rows)),
        (err) => settle(() => setFailed((f) => ({ ...f, [key]: thaiError(err, 'โหลดข้อมูลกลุ่มไม่สำเร็จ') }))),
      );
    }));
  };
  const retryFailed = () => load(SECTIONS.filter((key) => failed[key]));

  // GroupsView records which account opened the group. If the session is now
  // another account (a direct switch while this page is open, or a sign-out
  // and a different sign-in with the page still selected), nothing of the
  // group is fetched or drawn, its invite code included: back to the list,
  // which loads the new account's groups.
  const foreign = group.openedBy != null && group.openedBy !== user.id;

  useEffect(() => {
    if (foreign) { goBack(); return undefined; }
    load();
    // Leaving the group or the account makes every answer in flight stale.
    return () => { for (const key of SECTIONS) latest.current[key] += 1; };
  }, [group.id, user.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const status = pending[tab] ? 'loading' : failed[tab] ? 'error' : 'ready';
  // The tab on screen speaks for itself; this is for a failure out of sight.
  const hiddenFailure = status !== 'error' && SECTIONS.some((key) => key !== tab && failed[key]);

  // Robust copy: Clipboard API → execCommand fallback for in-app browsers
  // (LINE / FB WebView) where navigator.clipboard is absent or rejects.
  const copyCode = async () => {
    const r = await copyText(group.code);
    if (r.ok) {
      alertDialog(`คัดลอกรหัส ${group.code} แล้ว ส่งให้เพื่อนได้เลย!`);
    } else {
      // Surface the code so the user can long-press to copy manually
      alertDialog(`คัดลอกอัตโนมัติไม่ได้บนเบราว์เซอร์นี้ กดค้างที่รหัสนี้แล้วเลือกคัดลอก:\n\n${group.code}`);
    }
  };

  // Leaving sits at the foot of the page, away from the tabs, and always asks
  // first. The last admin cannot leave (the group would have nobody to look
  // after it); they may delete the group instead. Until the member list has
  // loaded nobody is offered either, since the rule reads it.
  const rule = pending.members || failed.members ? null : leaveRule(members, user.id);
  const leave = async () => {
    if (leaving || !rule?.canLeave) return;
    if (!(await confirmDialog({ title: 'ออกจากกลุ่มนี้?', body: 'กลับเข้ามาใหม่ได้ด้วยรหัสกลุ่ม', confirmLabel: 'ออกจากกลุ่ม', tone: 'danger' }))) return;
    setActionError('');
    setLeaving(true);
    try { await leaveGroup(group.id, user.id); goBack(); }
    catch (e) { setActionError(thaiError(e, 'ออกจากกลุ่มไม่สำเร็จ ลองใหม่อีกครั้ง')); }
    finally { setLeaving(false); }
  };
  const removeGroup = async () => {
    if (leaving || !rule?.canDelete) return;
    if (!(await confirmDialog({ title: 'ลบกลุ่มนี้?', body: 'คุณเป็นผู้ดูแลคนเดียวของกลุ่มนี้ จึงออกจากกลุ่มไม่ได้ ลบกลุ่มแล้วสมาชิกทุกคนจะออกจากกลุ่ม และรหัสนี้จะใช้ไม่ได้อีก ย้อนกลับไม่ได้', confirmLabel: 'ลบกลุ่ม', tone: 'danger' }))) return;
    setActionError('');
    setLeaving(true);
    try { await deleteGroup(group.id); goBack(); }
    catch (e) { setActionError(thaiError(e, 'ลบกลุ่มไม่สำเร็จ ลองใหม่อีกครั้ง')); }
    finally { setLeaving(false); }
  };

  if (foreign) return null;

  return (
    <>
      <div className="vmx-hero">
        <Mochi state="hearts" size={44} slot="page-intro" className="vmx-hero-mochi" />
        <h1><em>{group.name}</em></h1>
        <p>
          รหัสกลุ่ม <strong style={{ color: 'var(--clr-gold-text)', fontFamily: 'var(--vmx-mono)' }}>{group.code}</strong>
          {', '}<button type="button" className="vmx-footer-link" onClick={copyCode} style={{ border: 0, background: 'transparent', padding: 0, color: 'inherit', font: 'inherit', textDecoration: 'underline' }}>คัดลอก</button>
          {', '}สมาชิก {members.length} คน
        </p>
      </div>

      <div className="vmx-nav" style={{ marginBottom: 24 }}>
        <button className={`vmx-nav-btn ${tab === 'leaderboard' ? 'active' : ''}`} onClick={() => setTab('leaderboard')}>อันดับคะแนน</button>
        <button className={`vmx-nav-btn ${tab === 'members' ? 'active' : ''}`} onClick={() => setTab('members')}>👤 สมาชิก ({members.length})</button>
      </div>

      {actionError && <div style={{ padding: 12, borderRadius: 10, background: 'var(--clr-rose-soft)', marginBottom: 16, fontSize: 14 }}>⚠️ {actionError}</div>}

      {hiddenFailure && (
        <div style={{ padding: 12, borderRadius: 10, background: 'var(--clr-gold-soft)', marginBottom: 16, fontSize: 14 }}>
          ⚠️ บางส่วนของกลุ่มโหลดไม่สำเร็จ{' '}
          <button className="vmx-btn vmx-btn-ghost vmx-btn-sm" onClick={retryFailed} style={{ marginInlineStart: 8 }}>ลองอีกครั้ง</button>
        </div>
      )}

      {status === 'loading' && <StatePanel kind="loading" title="กำลังโหลดข้อมูลกลุ่ม…" />}
      {status === 'error' && <StatePanel kind="error" title="โหลดข้อมูลกลุ่มไม่สำเร็จ" body={failed[tab]} actionLabel="ลองอีกครั้ง" onAction={retryFailed} />}

      {status === 'ready' && tab === 'leaderboard' && (
        <div>
          <div style={{ marginBottom: 12, fontSize: 14, color: 'var(--clr-ink-soft)' }}>
            อันดับจากผลดีที่สุดของสมาชิกแต่ละคนที่ระบบตรวจคะแนนแล้ว (อย่างน้อย 5 ข้อ) สมาชิกที่ปิดการแสดงบนอันดับจะไม่ปรากฏ
          </div>
          <BoardPresenceNotice user={user} rows={leaderboard} scope="group" onEdit={onEditIdentity} />
          {leaderboard.length === 0 ? (
            <div className="vmx-empty">ยังไม่มีใครทำข้อสอบในกลุ่มนี้ — ลองเป็นคนแรกกันเถอะ 💪</div>
          ) : (
            leaderboard.map((r, idx) => (
              <div key={r.id} className="vmx-review-item" style={{ background: idx === 0 ? 'rgba(184, 137, 64, 0.1)' : 'var(--clr-surface)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: idx < 3 ? 'var(--clr-gold)' : 'var(--clr-surface-2)', color: idx < 3 ? 'var(--clr-surface)' : 'var(--clr-ink)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--vmx-display)', fontWeight: 700, fontSize: 18, flexShrink: 0 }}>
                    {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : idx + 1}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: 'var(--vmx-display)', fontWeight: 600, fontSize: 16 }}>
                      {shownPicture(r.profiles?.avatar_emoji)} {shownName(r.profiles?.username, 'ไม่ระบุชื่อ')}
                      {r.user_id === user.id && <span style={{ marginLeft: 8, fontSize: 14, color: 'var(--clr-sage-text)', fontStyle: 'italic' }}>(คุณ)</span>}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--clr-ink-soft)', fontFamily: 'var(--vmx-mono)', marginTop: 2 }}>
                      {r.mode === 'exam' ? 'สอบ' : 'ฝึก'}, {r.subject ? SUBJECTS.find((s) => s.id === r.subject)?.name : 'ทุกวิชา'}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontFamily: 'var(--vmx-display)', fontWeight: 700, fontSize: 22, color: r.pct >= 80 ? 'var(--clr-right-text)' : r.pct >= 60 ? 'var(--clr-part-text)' : 'var(--clr-rose-text)' }}>{r.pct}%</div>
                    <div style={{ fontSize: 11, color: 'var(--clr-ink-soft)', fontFamily: 'var(--vmx-mono)' }}>{r.correct}/{r.total}</div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {status === 'ready' && tab === 'members' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
          {members.map((m) => (
            <div key={m.id} className="vmx-dash-card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 40, marginBottom: 8, display: 'flex', justifyContent: 'center' }}>
                <ProfilePicture picture={pictures[m.id]} emoji={m.avatar_emoji} size={56} className="vmx-member-pic" />
              </div>
              <div style={{ fontFamily: 'var(--vmx-display)', fontWeight: 600, fontSize: 16 }}>
                {shownName(m.username)}
                {m.id === user.id && <div style={{ fontSize: 14, color: 'var(--clr-sage-text)', fontStyle: 'italic' }}>(คุณ)</div>}
              </div>
              {m.role === 'admin' && <div style={{ fontSize: 14, color: 'var(--clr-gold-text)', marginTop: 4 }}>👑 ผู้ดูแล</div>}
              {m.id !== user.id && pictures[m.id]?.url && pictures[m.id]?.state === 'shown' && (
                <ReportPicture ownerId={m.id} name={shownName(m.username)} />
              )}
            </div>
          ))}
        </div>
      )}

      <div className="vmx-btn-row" style={{ marginTop: 30 }}>
        <button className="vmx-btn vmx-btn-ghost" onClick={goBack}>← กลับกลุ่มทั้งหมด</button>
      </div>

      {rule && (
        <section aria-label="ออกจากกลุ่ม" style={{ marginTop: 40, paddingTop: 16, borderTop: '1px solid var(--clr-border)' }}>
          {rule.canLeave ? (
            <button type="button" className="vmx-btn vmx-btn-ghost" onClick={leave} disabled={leaving}>ออกจากกลุ่ม</button>
          ) : (
            <button type="button" className="vmx-btn vmx-btn-ghost" onClick={removeGroup} disabled={leaving}>ลบกลุ่ม</button>
          )}
        </section>
      )}
    </>
  );
}
