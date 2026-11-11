// ============================================================
// ProfileView — "โปรไฟล์": the student's own page
// ============================================================
// Read top to bottom, it answers in order:
//   who am I here         the identity card: the name and picture classmates
//                         see, edited in place with the row they will see
//   what is next          the coming papers from the timetable, the one goal
//   how far have I come   four weeks of answers as a small figure, the
//                         badges earned and the next one with how far it is
//   where do I stand      my own line on the board, a way to the board and
//                         to the groups (signed in)
//   the rest              reading, review, timetable, settings, the app
//
// A student with nothing yet gets one next thing to do instead of zeros.
//
// Every number is read from data the app already keeps (history, the streak
// record, the reading checklist, SR cards, the timetable, the board) and is
// said for what it is. The level is rebuilt from the synced history and
// review cards plus the quest points the account carries (lib/xp.js shownXp),
// so it is the same on every device.
//
// It works WITHOUT an account: everything but the identity and the board is
// local study data, and the identity card becomes the invitation to sign in.
// ============================================================

import { shownName, shownPicture } from '../lib/public-display.js';
import { useEffect, useMemo, useRef, useState } from 'react';
import BackBar from '../components/BackBar.jsx';
import ThemePicker from '../components/ThemePicker.jsx';
import PWAInstallChip from '../components/PWAInstallChip.jsx';
import NavIcon from '../components/NavIcon.jsx';
import IdentityEditor from '../components/IdentityEditor.jsx';
import ActivityFigure from '../components/ActivityFigure.jsx';
import { storage } from '../hooks/useStorage.js';
import { SUBJECTS, SUBJECTS_BY_YEAR, CURRENT_YEAR } from '../data/curriculum.js';
import { getNextClass, getCurrentClass, getUpcomingExams, examEndMs, examTitle, fmtThaiDate, SEMESTER } from '../data/schedule.js';
import { levelFor, xpForNextLevel } from '../lib/xp.js';
import { shownXp } from '../lib/xp-account.js';
import { earnedBadges, nextBadge } from '../lib/badges.js';
import { truncateThai } from '../lib/thai-text.js';
import { cohortForYear, isAutoName, showsOnBoards, boardStanding, pictureLabel } from '../lib/public-identity.js';
import {
  dayKey, rowTime, daysTrack, recentSessions, sessionWhen, subjectsStarted, topicsRead, classRowLabel,
} from '../lib/study-record.js';
import { streakShown } from '../hooks/utils.js';
import '../styles-profile.css';

/** Counts the hub shows. Pure, so the numbers can never disagree with the
 *  history the rest of the app renders. */
function useStats(history, streakData) {
  const rows = Array.isArray(history) ? history : [];
  const today = dayKey(Date.now());
  let todayCount = 0;
  let correctCount = 0;
  for (const row of rows) {
    if (!row) continue;
    // rowTime reads a timestamp or an ISO string, as the figure beside this
    // does; Number() alone dropped synced ISO rows the figure counted.
    const t = rowTime(row.date);
    if (t != null && dayKey(t) === today) todayCount += 1;
    if (row.correct === true) correctCount += 1;
  }
  return {
    total: rows.length,
    todayCount,
    correctCount,
    // The saved streak is the authority — it is the only number that knows
    // about a freeze. HomeView reads it the same way, so the hub cannot show
    // a streak the record does not agree with.
    // Read as of today (streakShown): a run that ended reads 0.
    streak: streakShown(streakData),
  };
}

const subjectName = (id) => SUBJECTS.find((s) => s.id === id)?.name || id;

/** วันนี้ / พรุ่งนี้ / อีก N วัน, counted in Bangkok days by the timetable. */
const timeLeft = (days) => (days <= 0 ? 'วันนี้' : days === 1 ? 'พรุ่งนี้' : `อีก ${days} วัน`);

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
  themePref,
  setTheme = () => {},
  palette = 'default',
  setPalette = () => {},
  hasSupabase = true,
  selectedYear = null,
  onIdentitySaved = null,
  // Opens a subject's topic list; null keeps recent-activity rows as plain text.
  openSubject = null,
}) {
  const stats = useStats(history, streakData);
  const reviewCount = srCards && typeof srCards === 'object' ? Object.keys(srCards).length : 0;
  const accuracy = stats.total > 0 ? Math.round((stats.correctCount / stats.total) * 100) : null;

  // The app's one year: what App holds (vmx-selected-year), the year Home,
  // the leaderboard and the timetable use. The cohort is read from it.
  const year = Number(selectedYear ?? storage.get('vmx-selected-year', CURRENT_YEAR)) || CURRENT_YEAR;
  const cohort = cohortForYear(year, SEMESTER?.cohortNote);
  const yearSubjects = SUBJECTS_BY_YEAR[year] || [];
  const started = useMemo(() => subjectsStarted(readingChecklist, yearSubjects), [readingChecklist, yearSubjects]);
  const readCount = useMemo(() => topicsRead(readingChecklist, yearSubjects), [readingChecklist, yearSubjects]);
  const sessions = useMemo(() => recentSessions(history, { limit: 4 }), [history]);
  const month = useMemo(() => daysTrack(history, 28), [history]);
  const nextClass = getNextClass(year);
  const classNow = getCurrentClass(year);
  const classLabel = classRowLabel(nextClass, classNow, (s) => truncateThai(s, 22));

  // The coming papers, from the timetable: the next is the page's one goal.
  const papers = useMemo(() => {
    const now = Date.now();
    return getUpcomingExams(`y${year}`, new Date(now)).filter((e) => examEndMs(e) > now).slice(0, 3);
  }, [year]);
  const goal = papers[0] || null;
  const goalWeek = useMemo(() => {
    if (!goal) return 0;
    const from = Date.now() - 7 * 86400000;
    return (Array.isArray(history) ? history : []).filter((r) => r?.subject === goal.subject && (rowTime(r.date) ?? 0) >= from).length;
  }, [goal, history]);

  // One streak for the tile and the trophies: the saved streak the tile shows
  // is handed to the badge count, so the two can never disagree.
  const badges = useMemo(() => earnedBadges({ history: history || [], srCards: srCards || {}, currentStreak: stats.streak }), [history, srCards, stats.streak]);
  const upNext = useMemo(() => nextBadge({ history: history || [], srCards: srCards || {}, currentStreak: stats.streak }), [history, srCards, stats.streak]);

  // Level, the number the header chip shows too: one function of what
  // follows the account, the same on every device (lib/xp.js shownXp).
  const totalXp = shownXp({ history: history || [], srCards: srCards || {}, user });
  const level = levelFor(totalXp);
  const progress = xpForNextLevel(totalXp);
  const empty = stats.total === 0;

  return (
    <>
      <BackBar onBack={goHome || (() => setView('home'))} label="หน้าแรก" />

      <div className="vmx-hero vmx-profile-hero">
        <h1>โปรไฟล์</h1>
      </div>

      <div className="vmx-hub">
        <div className="vmx-hub-main">
          {user ? (
            <IdentityCard
              user={user}
              profile={profile}
              year={year}
              cohort={cohort}
              onSaved={onIdentitySaved}
              onYear={() => setView('year-select')}
            />
          ) : (
            <section className="vmx-dash-card vmx-profile-card vmx-hub-id is-guest" aria-labelledby="hub-guest">
              <span className="vmx-hub-pic" aria-hidden="true"><NavIcon name="user" size={24} /></span>
              <div className="vmx-hub-who">
                <h2 id="hub-guest" className="vmx-hub-name">ใช้งานแบบไม่เข้าสู่ระบบ</h2>
                <p className="vmx-hub-meta">ปี {year}{cohort ? ` รุ่น ${cohort}` : ''} ข้อมูลเรียนอยู่ในเครื่องนี้</p>
                <p className="vmx-hub-meta">เข้าสู่ระบบเพื่อเก็บความคืบหน้าลงบัญชี ใช้ต่อได้ทุกเครื่อง และตั้งชื่อที่เพื่อนเห็น</p>
                {hasSupabase && (
                  <button type="button" className="vmx-btn vmx-btn-primary vmx-btn-sm vmx-profile-signin" onClick={() => setView('auth')}>
                    เข้าสู่ระบบ
                  </button>
                )}
              </div>
            </section>
          )}

          {/* ── The one goal: the next paper ──────────────────────────── */}
          {goal ? (
            <section className="vmx-dash-card vmx-profile-card vmx-hub-goal" aria-labelledby="hub-goal">
              <h2 id="hub-goal">สอบถัดไป</h2>
              <div className="vmx-hub-goal-main">
                <div className="vmx-hub-goal-left">
                  <span className="vmx-hub-goal-days">{timeLeft(goal.daysLeft)}</span>
                  <span className="vmx-hub-goal-what">{examTitle(goal)}</span>
                  <span className="vmx-hub-meta">{fmtThaiDate(goal.date)}{goal.time ? ` เวลา ${goal.time}` : ''}</span>
                </div>
              </div>
              <p className="vmx-hub-meta">
                {goalWeek > 0 ? `7 วันที่ผ่านมาทำวิชานี้ ${goalWeek} ข้อ` : 'ยังไม่ได้ทำวิชานี้ใน 7 วันที่ผ่านมา'}
              </p>
              {typeof openSubject === 'function' && SUBJECTS.some((s) => s.id === goal.subject) && (
                <button type="button" className="vmx-btn vmx-btn-primary vmx-btn-sm" onClick={() => openSubject(goal.subject)}>
                  ฝึกวิชานี้
                </button>
              )}
              {papers.length > 1 && (
                <ul className="vmx-hub-papers" aria-label="สอบถัดจากนั้น">
                  {papers.slice(1).map((p) => (
                    <li key={p.id}>
                      <span>{examTitle(p)}</span>
                      <span className="vmx-hub-num">{timeLeft(p.daysLeft)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ) : null}

          {/* ── Progress, or the one next thing ───────────────────────── */}
          {empty ? (
            <section className="vmx-dash-card vmx-profile-card vmx-hub-empty" aria-labelledby="hub-start">
              <h2 id="hub-start">เริ่มจากข้อเดียว</h2>
              <p>ทำข้อแรกแล้วหน้านี้จะเริ่มเก็บสถิติ เหรียญ และกราฟการเรียนของคุณ</p>
              {goal && typeof openSubject === 'function' && SUBJECTS.some((s) => s.id === goal.subject) ? (
                <button type="button" className="vmx-btn vmx-btn-primary" onClick={() => openSubject(goal.subject)}>
                  เริ่มที่ {truncateThai(examTitle(goal), 24)}
                </button>
              ) : (
                <button type="button" className="vmx-btn vmx-btn-primary" onClick={() => setView('home')}>เลือกวิชาที่หน้าแรก</button>
              )}
            </section>
          ) : (
            <section className="vmx-dash-card vmx-profile-card" aria-labelledby="hub-progress">
              <h2 id="hub-progress">ความคืบหน้า</h2>
              <ActivityFigure days={month} />
              <dl className="vmx-hub-facts">
                <div><dt>วันต่อเนื่อง</dt><dd className="vmx-hub-num">{stats.streak}</dd></div>
                <div><dt>วันนี้</dt><dd className="vmx-hub-num">{stats.todayCount}</dd></div>
                <div><dt>ทั้งหมด</dt><dd className="vmx-hub-num">{stats.total.toLocaleString()}</dd></div>
                {accuracy !== null && <div><dt>ตอบถูก</dt><dd className="vmx-hub-num">{accuracy}%</dd></div>}
              </dl>

              <h3 className="vmx-hub-sub">เหรียญ</h3>
              {badges.length > 0 && (
                <ul className="vmx-hub-badges" aria-label={`ได้แล้ว ${badges.length} เหรียญ`}>
                  {badges.map((b) => (
                    <li key={b.id} title={b.why}>
                      <img src={b.src} alt="" width="48" height="48" decoding="async" />
                      <span>{b.label}</span>
                    </li>
                  ))}
                </ul>
              )}
              {upNext ? (
                <div className="vmx-hub-next">
                  <img src={upNext.src} alt="" width="40" height="40" decoding="async" className="is-locked" />
                  <div className="vmx-hub-next-body">
                    <span>เหรียญถัดไป <strong>{upNext.label}</strong></span>
                    <span className="vmx-hub-bar" aria-hidden="true">
                      <span style={{ transform: `scaleX(${Math.min(1, upNext.have / upNext.need)})` }} />
                    </span>
                    <span className="vmx-hub-meta vmx-hub-num">{upNext.have.toLocaleString()} จาก {upNext.need.toLocaleString()} {upNext.unit}</span>
                  </div>
                </div>
              ) : badges.length === 0 ? null : <p className="vmx-hub-meta">ได้ครบทุกเหรียญที่นับจากประวัติแล้ว</p>}

              <div className="vmx-hub-level">
                <span className="vmx-level-badge">Lv {level}</span>
                <span className="vmx-hub-meta">
                  {totalXp.toLocaleString()} XP อีก {(progress.needed - progress.current).toLocaleString()} XP ถึง Lv {progress.nextLevel}
                </span>
                <span className="vmx-hub-bar" aria-hidden="true"><span style={{ transform: `scaleX(${progress.pct / 100})` }} /></span>
              </div>

            </section>
          )}
        </div>

        <div className="vmx-hub-side">
          {user && hasSupabase && (
            <StandingStrip user={user} year={year} setView={setView} />
          )}

          {sessions.length > 0 && (
            <section className="vmx-dash-card vmx-profile-card" aria-labelledby="hub-recent">
              <h2 id="hub-recent">กิจกรรมล่าสุด</h2>
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
            </section>
          )}

          <section className="vmx-dash-card vmx-profile-card" aria-labelledby="hub-study">
            <h2 id="hub-study">การเรียนของฉัน</h2>
            {/* The full progress page also holds the backup import, so it stays
                one tap away even before the first answer. */}
            <Row label="ความคืบหน้าแบบละเอียด" note="กราฟ ความแม่นยำ หัวข้อที่อ่อน และไฟล์สำรอง" onClick={() => setView('dashboard')} />
            <Row label="สรุปช่วงสอบ" note="สรุปการเรียนตลอดช่วงสอบที่ผ่านมา" onClick={() => setView('phase-wrapped')} />
            {year === 4 && (
              <Row label="สัดส่วนคะแนนรายวิชา" note="โครงสร้างคะแนน ปี 4 เทอม 2" onClick={() => setView('scores')} />
            )}
            <Row
              label="รายการอ่าน"
              note={readCount > 0
                ? `อ่านแล้ว ${readCount} หัวข้อ${started.total > 0 ? ` เริ่มแล้ว ${started.started} จาก ${started.total} วิชา` : ''}`
                : 'เช็กหัวข้อที่อ่านแล้ว'}
              onClick={() => setView('reading-checklist')}
            />
            {/* A total, said as a total: srCards holds every card ever stored, due
                or not, while Home counts only the ones due in the chosen year and
                phase, so "in the queue" here would contradict Home. This is the
                one row for the review queue: the scheduling choice lives on its
                planner, so the note names where instead of a second row. */}
            <Row
              label="ทบทวนตามรอบ"
              note={`${reviewCount > 0 ? `มีการ์ดทั้งหมด ${reviewCount} ใบ ` : ''}ข้อที่ผิดกลับมาให้ทบทวน แอปเลือกวันให้เอง`}
              onClick={() => setView('sr-session')}
            />
            <Row label="ตารางเรียนและสอบ" note={classLabel || 'วิชาและวันที่เรียน'} onClick={() => setView('schedule')} />
            <Row label="กระดานทบทวน" note="รวมข้อและบันทึกที่เก็บไว้" onClick={() => setView('pinboard')} />
            {/* VetWiki left the bottom bar, so the hub names where it went: with
                the student's reading, not with the settings. */}
            <Row label="VetWiki" note="คลังความรู้ที่ตรวจสอบได้" onClick={() => setView('knowledge')} testId="profile-vetwiki-row" />
          </section>

          <section className="vmx-dash-card vmx-profile-card" aria-labelledby="hub-settings">
            <h2 id="hub-settings">การตั้งค่า</h2>
            <Row label="ตั้งค่าเสียงอ่าน" note="ความเร็วและช่วงพักของเสียงอ่าน" onClick={onVoiceSettings} />
            {/* Theme + motion: ThemePicker is the app's one owner of both, and it
                lives in the header as a popover. Mounting the same component here
                keeps them from drifting instead of growing a second copy. */}
            <div className="vmx-profile-theme">
              <span>ธีมและสี</span>
              <ThemePicker theme={theme} themePref={themePref} setTheme={setTheme} palette={palette} setPalette={setPalette} />
            </div>
            <Row label="เชื่อมแอป" note="ตารางสอบเข้าปฏิทิน การ์ด Anki และแอปที่เชื่อมได้" onClick={() => setView('connect-apps')} />
            {user && (
              <Row label="บัญชีและข้อมูล" note="วิธีเข้าสู่ระบบ ดาวน์โหลดข้อมูล ออกจากระบบ" onClick={() => setView('account-settings')} />
            )}
          </section>

          <section className="vmx-dash-card vmx-profile-card" aria-labelledby="hub-app">
            <h2 id="hub-app">แอปของฉัน</h2>
            <div className="vmx-profile-install">
              {/* The permanent place to install: ignores Home's "don't show again"
                  and explains the manual steps when the browser offers nothing. */}
              <PWAInstallChip hub />
            </div>
            <Row label="เกี่ยวกับ VetMock" note="ที่มาและผู้สร้าง" onClick={() => setView('about')} />
            <Row label="แจ้งปัญหา" note="บอกปัญหาหรือเสนอฟีเจอร์" onClick={() => setView('feedback')} />
          </section>
        </div>
      </div>
    </>
  );
}

// ── The identity card: tap to edit in place ──────────────────────────
function IdentityCard({ user, profile, year, cohort, onSaved, onYear }) {
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(null); // null | 'ok' | 'partial'
  const cardRef = useRef(null);
  const openRef = useRef(null);
  const name = profile?.username || '';
  const auto = isAutoName(name, user?.email, user);
  const picture = shownPicture(profile?.avatar_emoji);
  const shown = showsOnBoards(user);
  const headingId = 'hub-identity';

  // The confirmation stays where the change was made, then gets out of the way.
  useEffect(() => {
    if (!saved) return undefined;
    const t = setTimeout(() => setSaved(null), saved === 'ok' ? 4000 : 9000);
    return () => clearTimeout(t);
  }, [saved]);

  // Back to the card the student opened, once it is drawn again (an effect,
  // not a frame callback: WebKit dropped a focus sent before the commit).
  const refocus = useRef(false);
  useEffect(() => {
    if (editing || !refocus.current) return;
    refocus.current = false;
    openRef.current?.focus();
  }, [editing]);
  const close = (result) => {
    refocus.current = true;
    setEditing(false);
    if (result) setSaved(result);
  };

  return (
    <section ref={cardRef} className={`vmx-dash-card vmx-profile-card vmx-hub-id${editing ? ' is-editing' : ''}`} aria-labelledby={headingId}>
      <h2 id={headingId} className="vmx-sr-only">ตัวตนที่เพื่อนเห็น</h2>
      {!editing ? (
        <>
          <button
            ref={openRef}
            type="button"
            className="vmx-hub-id-open"
            onClick={() => { setSaved(null); setEditing(true); }}
            aria-label={`แก้ชื่อและรูปที่เพื่อนเห็น ตอนนี้ ${auto ? 'ยังไม่ได้ตั้งชื่อ' : name} รูป${pictureLabel(picture)}`}
            data-testid="hub-identity"
          >
            <span key={picture} className={`vmx-hub-pic${saved ? ' is-fresh' : ''}`} aria-hidden="true">{picture}</span>
            <span className="vmx-hub-who">
              <span className="vmx-hub-name">{auto ? 'ยังไม่ได้ตั้งชื่อ' : name}</span>
              <span className="vmx-hub-meta">ปี {year}{cohort ? ` รุ่น ${cohort}` : ''}</span>
              <span className={`vmx-hub-chip${shown ? '' : ' is-off'}`}>{shown ? 'แสดงบนกระดานอันดับ' : 'ไม่แสดงบนกระดานอันดับ'}</span>
            </span>
            <span className="vmx-hub-edit" aria-hidden="true">แก้ไข</span>
          </button>
          {auto && (
            <p className="vmx-hub-auto">
              {name ? `ตอนนี้เพื่อนเห็นคุณเป็น ${name} ซึ่งระบบตั้งให้` : 'ยังไม่มีชื่อที่คุณตั้งเอง'} แตะการ์ดเพื่อเลือกชื่อของคุณ
            </p>
          )}
          <div className="vmx-hub-id-foot">
            <span className="vmx-hub-meta">ประวัติ การ์ดทบทวน และรายการอ่านเก็บในบัญชี</span>
            <button type="button" className="vmx-hub-link" onClick={onYear}>เปลี่ยนชั้นปี</button>
          </div>
          <p className={`vmx-hub-saved${saved ? ' is-on' : ''}`} role="status" aria-live="polite">
            {saved === 'ok' ? 'บันทึกแล้ว เพื่อนเห็นแบบนี้ตั้งแต่ตอนนี้'
              : saved === 'partial' ? 'บันทึกชื่อและรูปแล้ว แต่เรื่องกระดานอันดับยังไม่ได้บันทึก แตะการ์ดเพื่อลองอีกครั้ง'
                : ''}
          </p>
        </>
      ) : (
        <IdentityEditor
          user={user}
          profile={profile}
          mode="edit"
          headingId={headingId}
          onCancel={() => close(null)}
          onSaved={(next, info) => { onSaved?.(next, info); close(info?.metaSaved === false ? 'partial' : 'ok'); }}
        />
      )}
    </section>
  );
}

// ── My own line on the board ─────────────────────────────────────────
function StandingStrip({ user, year, setView }) {
  const [state, setState] = useState({ status: 'loading', standing: null });
  const optedOut = !showsOnBoards(user);
  useEffect(() => {
    if (optedOut) { setState({ status: 'ready', standing: boardStanding(user, []) }); return undefined; }
    let alive = true;
    Promise.all([import('../lib/api.js'), import('../lib/leaderboard-gate.js')])
      .then(([api, gate]) => api.getLeaderboard({ year, scoreSource: 'server' }).then((rows) => gate.aggregateLeaderboard(rows || [])))
      .then((rows) => { if (alive) setState({ status: 'ready', standing: boardStanding(user, rows) }); })
      .catch(() => { if (alive) setState({ status: 'error', standing: null }); });
    return () => { alive = false; };
  }, [user, year, optedOut]);

  const s = state.standing;
  let line = 'กำลังดูอันดับของคุณ';
  if (state.status === 'error') line = 'ดูอันดับไม่ได้ตอนนี้ เปิดกระดานเพื่อลองอีกครั้ง';
  else if (s?.kind === 'hidden') line = 'คุณเลือกไม่แสดงบนกระดาน เพื่อนจึงไม่เห็นคะแนนของคุณ';
  else if (s?.kind === 'ranked') line = `อันดับ ${s.rank} จาก ${s.of} คนในปี ${year}`;
  // The board lists its first 200: past them the rank is not known here, and
  // the line says so rather than "not on the board".
  else if (s?.kind === 'absent') line = s.capped
    ? `ยังไม่อยู่ใน ${s.of} อันดับแรกของปี ${year} ทำชุดที่ระบบตรวจให้ได้คะแนนสูงขึ้นเพื่อขึ้นกระดาน`
    : `ยังไม่มีชื่อบนกระดานปี ${year} ส่งชุดที่ระบบตรวจอย่างน้อย 5 ข้อเพื่อขึ้นกระดาน`;

  return (
    <section className="vmx-dash-card vmx-profile-card vmx-hub-standing" aria-labelledby="hub-standing" aria-busy={state.status === 'loading' || undefined}>
      <h2 id="hub-standing">ในรุ่นของฉัน</h2>
      <p className={`vmx-hub-standing-line${s?.kind === 'ranked' ? ' is-ranked' : ''}`} data-testid="hub-standing">
        {s?.kind === 'ranked' ? (
          <><span className="vmx-hub-rank">{s.rank}</span><span>{line}</span></>
        ) : line}
      </p>
      <div className="vmx-hub-standing-go">
        <button type="button" className="vmx-btn vmx-btn-ghost vmx-btn-sm" onClick={() => setView('leaderboard-global')}>กระดานอันดับ</button>
        <button type="button" className="vmx-btn vmx-btn-ghost vmx-btn-sm" onClick={() => setView('groups')}>กลุ่มติว</button>
      </div>
    </section>
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
      <span className="vmx-profile-row-text">
        <span className="vmx-profile-row-label">{label}</span>
        {note && <span className="vmx-profile-row-note">{note}</span>}
      </span>
      <span aria-hidden="true" className="vmx-profile-row-go">→</span>
    </button>
  );
}
