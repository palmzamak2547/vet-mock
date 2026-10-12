// ============================================================
// ProfileView — "โปรไฟล์": the personal hub that replaced the VetWiki
// shortcut in the mobile bottom bar (owner feedback 2026-10-11).
// ============================================================
// One screen for the questions a student actually opens the app with:
//   • who am I here, how far along  (level, streak)
//   • how am I doing                 (สถิติของฉัน, the last seven days)
//   • what did I just do             (กิจกรรมล่าสุด)
//   • what am I reading / reviewing  (การเรียนของฉัน)
//   • how should it behave           (การตั้งค่า)
//   • how do I keep it on my phone   (แอปของฉัน)
//
// 2026-10-12: the owner asked for the personal things in one place — recent
// activity, level, streak, the timetable, which subjects are read, the
// reading list, a daily record. Everything here is read from data the app
// already keeps (history, the streak record, the reading checklist, XP, the
// timetable); nothing is invented, and a figure that has no data behind it
// is not shown.
//
// It works WITHOUT an account: everything above the sign-in line is local
// study data, and only the account row asks for one. Asking a guest to log in
// before they may change the reading font is not a request, it is a wall.
//
// Data comes from App as plain props (history, streakData, readingChecklist,
// srCards) — this screen computes counts and nothing else. It never fetches,
// never writes, and never owns state that another view owns. The two things
// it reads on its own are the device's chosen year (to name the year's
// subjects and timetable) and the XP record, both from the same store the
// rest of the app reads.
// ============================================================

import { useMemo } from 'react';
import BackBar from '../components/BackBar.jsx';
import ThemePicker from '../components/ThemePicker.jsx';
import PWAInstallChip from '../components/PWAInstallChip.jsx';
import NavIcon from '../components/NavIcon.jsx';
import { storage } from '../hooks/useStorage.js';
import { SUBJECTS, SUBJECTS_BY_YEAR, CURRENT_YEAR } from '../data/curriculum.js';
import { getNextClass, getCurrentClass } from '../data/schedule.js';
import { getXpState, levelFor, xpForNextLevel } from '../lib/xp.js';
import { truncateThai } from '../lib/thai-text.js';
import {
  dayKey, weekTrack, recentSessions, sessionWhen, subjectsStarted, classRowLabel,
} from '../lib/study-record.js';

/** Counts the hub shows. Pure, so the numbers can never disagree with the
 *  history the rest of the app renders. */
function useStats(history, streakData) {
  const rows = Array.isArray(history) ? history : [];
  const today = dayKey(Date.now());
  let todayCount = 0;
  let correctCount = 0;
  for (const row of rows) {
    if (!row) continue;
    if (Number(row.date) > 0 && dayKey(row.date) === today) todayCount += 1;
    if (row.correct === true) correctCount += 1;
  }
  return {
    total: rows.length,
    todayCount,
    correctCount,
    // The saved streak is the authority — it is the only number that knows
    // about a freeze. HomeView reads it the same way, so the hub cannot show
    // a streak the record does not agree with.
    streak: streakData?.lastDate ? (Number(streakData.streak) || 0) : 0,
  };
}

/** Read-topic count for the reading checklist row. Values are either the day
 *  it was read (timestamp) or `true` for a plain checkmark. */
function countRead(read) {
  if (!read || typeof read !== 'object') return 0;
  return Object.values(read).filter((value) => value !== false && value != null).length;
}

const subjectName = (id) => SUBJECTS.find((s) => s.id === id)?.name || id;

export default function ProfileView({
  goHome,
  setView,
  user = null,
  profile = null,
  history,
  streakData,
  readingChecklist,
  srCards,
  onVoiceSettings,
  theme = 'light',
  setTheme = () => {},
  palette = 'default',
  setPalette = () => {},
  hasSupabase = true,
  // Opens a subject's topic list; null keeps recent-activity rows as plain text.
  openSubject = null,
}) {
  const stats = useStats(history, streakData);
  const readCount = countRead(readingChecklist);
  const reviewCount = srCards && typeof srCards === 'object' ? Object.keys(srCards).length : 0;
  const displayName = profile?.username || user?.user_metadata?.username || '';
  const accuracy = stats.total > 0 ? Math.round((stats.correctCount / stats.total) * 100) : null;

  // The device's year: the same key App reads, so the subjects and the
  // timetable named here are the ones Home shows.
  const year = Number(storage.get('vmx-selected-year', CURRENT_YEAR)) || CURRENT_YEAR;
  const yearSubjects = SUBJECTS_BY_YEAR[year] || [];
  const started = useMemo(() => subjectsStarted(readingChecklist, yearSubjects), [readingChecklist, yearSubjects]);
  const week = useMemo(() => weekTrack(history), [history]);
  const weekTotal = week.reduce((sum, d) => sum + d.count, 0);
  const sessions = useMemo(() => recentSessions(history, { limit: 4 }), [history]);
  const nextClass = getNextClass(year);
  const classNow = getCurrentClass(year);
  const classLabel = classRowLabel(nextClass, classNow, (s) => truncateThai(s, 22));

  // Level, from the same record the header chip reads. A new student sees
  // Lv 0 with the first step named, not a blank: here it is a record, not a
  // scoreboard in the header.
  const xp = getXpState();
  const level = levelFor(xp.totalXp);
  const progress = xpForNextLevel(xp.totalXp);

  return (
    <>
      <BackBar onBack={goHome || (() => setView('home'))} label="หน้าแรก" />

      <div className="vmx-hero vmx-profile-hero">
        <h1>โปรไฟล์ <em>ของฉัน</em></h1>
        <p>สถิติ การเรียน และการตั้งค่ารวมอยู่ในที่เดียว</p>
      </div>

      {/* ── Who, and how far along ───────────────────────────────────── */}
      <div className="vmx-dash-card vmx-profile-card vmx-profile-identity">
        <span className="vmx-profile-avatar" aria-hidden="true">
          {user ? (profile?.avatar_emoji || '🐾') : <NavIcon name="user" size={22} />}
        </span>
        <div className="vmx-profile-who">
          {user ? (
            <>
              <div className="vmx-profile-name">{displayName || 'บัญชีของฉัน'}</div>
              <div className="vmx-profile-note">
                เข้าสู่ระบบแล้ว{profile?.year ? `, ปี ${profile.year}` : ''} — ความคืบหน้าถูกเก็บไว้ในบัญชี
              </div>
            </>
          ) : (
            <>
              {/* Signed-out guests get the invitation instead of an empty
                  box — and still get every setting below it. */}
              <div className="vmx-profile-name">กำลังใช้งานแบบไม่เข้าสู่ระบบ — ข้อมูลเรียนอยู่ในเครื่องนี้</div>
              <div className="vmx-profile-note">
                เข้าสู่ระบบเพื่อเก็บความคืบหน้าลงบัญชี ใช้ต่อได้ทุกเครื่องโดยไม่ต้องเริ่มใหม่
              </div>
              {hasSupabase && (
                <button
                  type="button"
                  className="vmx-btn vmx-btn-primary vmx-btn-sm vmx-profile-signin"
                  onClick={() => setView('auth')}
                >
                  เข้าสู่ระบบ
                </button>
              )}
            </>
          )}
        </div>
        <div className="vmx-level" title={`${xp.totalXp.toLocaleString()} XP ทั้งหมด`}>
          <span className="vmx-level-badge">Lv {level}</span>
          <span className="vmx-level-meta">
            {xp.totalXp > 0
              ? `${xp.totalXp.toLocaleString()} XP, อีก ${(progress.needed - progress.current).toLocaleString()} XP ถึง Lv ${progress.nextLevel}`
              : stats.total === 0
                ? 'ตอบข้อแรกเพื่อเริ่มสะสม XP'
                : `0 XP ในเครื่องนี้, อีก ${(progress.needed - progress.current).toLocaleString()} XP ถึง Lv ${progress.nextLevel}`}
          </span>
          <span className="vmx-level-bar" aria-hidden="true">
            <span style={{ width: `${progress.pct}%` }} />
          </span>
        </div>
      </div>

      {/* ── Stats ─────────────────────────────────────────────────────── */}
      <div className="vmx-dash-card vmx-profile-card">
        <h2>สถิติของฉัน</h2>
        <div className="vmx-stat-grid vmx-profile-stats">
          <div className="vmx-stat-card">
            <div className="vmx-stat-num">{stats.streak}</div>
            <div className="vmx-stat-lbl">วันต่อเนื่อง</div>
          </div>
          <div className="vmx-stat-card">
            <div className="vmx-stat-num">{stats.todayCount}</div>
            <div className="vmx-stat-lbl">ข้อวันนี้</div>
          </div>
          <div className="vmx-stat-card">
            <div className="vmx-stat-num">{stats.total}</div>
            <div className="vmx-stat-lbl">ข้อทั้งหมด</div>
          </div>
        </div>
        {accuracy !== null && (
          <div className="vmx-profile-note">ตอบถูกรวม {accuracy}% จาก {stats.total} ข้อที่ทำไว้</div>
        )}
        {/* The daily record: the last seven days, each with what was done.
            Same helper as Home's rhythm strip, so the two agree. */}
        <div className="vmx-week" role="group" aria-label="บันทึกการเรียน 7 วันล่าสุด">
          <div className="vmx-week-head">
            <span>7 วันล่าสุด</span>
            <span>{weekTotal > 0 ? `${weekTotal} ข้อ` : 'ยังไม่ได้ฝึก'}</span>
          </div>
          <ol className="vmx-week-strip">
            {week.map((d) => (
              <li
                key={d.date}
                className={`${d.studied ? 'is-on' : ''}${d.isToday ? ' is-today' : ''}`}
                title={`${d.dowLabel} ${d.day}: ${d.count > 0 ? `${d.count} ข้อ` : d.isToday ? 'วันนี้' : 'ยังไม่ได้ฝึก'}`}
              >
                <span className="vmx-week-dow">{d.dowLabel}</span>
                <span className="vmx-week-day">{d.day}</span>
                <span className="vmx-week-count">{d.count > 0 ? d.count : ''}</span>
              </li>
            ))}
          </ol>
        </div>
        {/* The full progress page, the phase summary and (year 4) the score
            weights: the statistics destinations, all one tap from here, so
            the phone bar can give its progress slot to the review queue. */}
        <Row
          label="ความคืบหน้า"
          note="กราฟ ความแม่นยำ และหัวข้อที่อ่อน"
          onClick={() => setView('dashboard')}
        />
        <Row
          label="สรุปช่วงสอบ"
          note="สรุปการเรียนตลอดช่วงสอบที่ผ่านมา"
          onClick={() => setView('phase-wrapped')}
        />
        {year === 4 && (
          <Row
            label="สัดส่วนคะแนนรายวิชา"
            note="โครงสร้างคะแนน ปี 4 เทอม 2"
            onClick={() => setView('scores')}
          />
        )}
      </div>

      {/* ── Recent activity, as sessions ──────────────────────────────── */}
      {sessions.length > 0 && (
        <div className="vmx-dash-card vmx-profile-card">
          <h2>กิจกรรมล่าสุด</h2>
          <ul className="vmx-activity">
            {sessions.map((s, i) => {
              const parts = (
                <>
                  <span className="vmx-activity-when">{sessionWhen(s.startedAt)}</span>
                  <span className="vmx-activity-what">
                    <strong>{s.subject === 'all' ? 'หลายวิชา' : subjectName(s.subject)}</strong> {s.total} ข้อ ถูก {s.correct}
                  </span>
                </>
              );
              // Only a real subject can be opened; a cross-subject set ('all')
              // or an unknown id stays a plain line.
              const canOpen = typeof openSubject === 'function' && SUBJECTS.some((x) => x.id === s.subject);
              return (
                <li key={`${s.startedAt}-${i}`} className={canOpen ? 'vmx-activity-item' : 'vmx-activity-row'}>
                  {canOpen
                    ? (
                      <button type="button" className="vmx-activity-row vmx-activity-open" onClick={() => openSubject(s.subject)}>
                        {parts}
                      </button>
                    )
                    : parts}
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* ── Study lists ───────────────────────────────────────────────── */}
      <div className="vmx-dash-card vmx-profile-card">
        <h2>การเรียนของฉัน</h2>
        <Row
          label="รายการอ่าน"
          note={readCount > 0
            ? `อ่านแล้ว ${readCount} หัวข้อ${started.total > 0 ? `, เริ่มแล้ว ${started.started} จาก ${started.total} วิชา` : ''}`
            : 'เช็กหัวข้อที่อ่านแล้ว'}
          onClick={() => setView('reading-checklist')}
        />
        {/* A total, said as a total: srCards holds every card ever stored, due
            or not, while Home counts only the ones due in the chosen year and
            phase, so "in the queue" here would contradict Home. */}
        <Row
          label="ทบทวนตามรอบ"
          note={reviewCount > 0 ? `มีการ์ดทั้งหมด ${reviewCount} ใบ` : 'ใบที่ผิดจะกลับมาตามรอบ'}
          onClick={() => setView('sr-session')}
        />
        <Row
          label="ตารางเรียน & สอบ"
          note={classLabel || 'วิชาและวันที่เรียน'}
          onClick={() => setView('schedule')}
        />
        <Row
          label="กระดานทบทวน"
          note="รวมข้อและบันทึกที่เก็บไว้"
          onClick={() => setView('pinboard')}
        />
        {/* VetWiki left the bottom bar, so the hub names where it went: with
            the student's reading, not with the settings. */}
        <Row
          label="VetWiki"
          note="คลังความรู้ที่ตรวจสอบได้"
          onClick={() => setView('knowledge')}
          testId="profile-vetwiki-row"
        />
      </div>

      {/* ── Settings ──────────────────────────────────────────────────── */}
      <div className="vmx-dash-card vmx-profile-card">
        <h2>การตั้งค่า</h2>
        <Row
          label="เสียงอ่านออก"
          note="ความเร็วและเสียงพากย์"
          onClick={onVoiceSettings}
        />
        {/* Theme + motion: ThemePicker is the app's one owner of both, and it
            lives in the header as a popover. Mounting the same component here
            keeps them from drifting instead of growing a second copy. */}
        <div className="vmx-profile-theme">
          <span>ธีมและสี</span>
          <ThemePicker theme={theme} setTheme={setTheme} palette={palette} setPalette={setPalette} />
        </div>
        {/* The scheduler choice (SM-2 or FSRS) lives on the review planner,
            where its effect is visible; this row names where, no second copy. */}
        <Row
          label="ระบบจัดตารางทบทวน"
          note="เลือก SM-2 หรือ FSRS ได้ในหน้าเตรียมทบทวน"
          onClick={() => setView('sr-session')}
        />
        {user && (
          <Row
            label="บัญชี"
            note="รหัสผ่าน อีเมล และข้อมูลส่วนตัว"
            onClick={() => setView('account-settings')}
          />
        )}
      </div>

      {/* ── The app itself ────────────────────────────────────────────── */}
      <div className="vmx-dash-card vmx-profile-card">
        <h2>แอปของฉัน</h2>
        <div className="vmx-profile-install">
          {/* The permanent place to install: ignores Home's "don't show again"
              and explains the manual steps when the browser offers nothing. */}
          <PWAInstallChip hub />
        </div>
        <Row
          label="เกี่ยวกับ VetMock"
          note="ที่มาและผู้สร้าง"
          onClick={() => setView('about')}
        />
        <Row
          label="แจ้งปัญหา"
          note="บอกปัญหาหรือเสนอฟีเจอร์"
          onClick={() => setView('feedback')}
        />
      </div>

      <div className="vmx-btn-row" style={{ justifyContent: 'center', marginTop: 8 }}>
        <button className="vmx-btn vmx-btn-ghost vmx-btn-sm" onClick={() => setView('home')}>← หน้าแรก</button>
      </div>
    </>
  );
}

// One destination row. Rows are the shape this hub is made of, so they get a
// component rather than the same eight inline styles four times over.
//
// A row is a navigation line, not a button: it carries its own class
// (`vmx-profile-row`, declared in styles.css) and nothing else, the same way
// the rail's rows carry `.vmx-nav-row` instead of `.vmx-btn`. Composing a row
// from `.vmx-btn` is what docs/DESIGN_SYSTEM.md rules out — that class sets
// justify-content:center at equal specificity but later in the file, so it
// silently won over the row's own layout and the sidebar's icons scattered
// 14px. Box, alignment, spacing, hover and keyboard focus all belong to the
// class; nothing here may re-declare them inline, or the two start competing
// on source order again. Only the copy inside the row keeps its own sizes.
function Row({ label, note, onClick, testId }) {
  return (
    <button
      type="button"
      className="vmx-profile-row"
      onClick={onClick}
      data-testid={testId}
    >
      <span style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <span style={{ fontSize: 14, color: 'var(--clr-ink)' }}>{label}</span>
        {note && <span style={{ fontSize: 12, color: 'var(--clr-ink-soft)', marginTop: 2 }}>{note}</span>}
      </span>
      <span aria-hidden="true" style={{ color: 'var(--clr-ink-soft)', flex: '0 0 auto' }}>→</span>
    </button>
  );
}
