import { useEffect, useState } from 'react';
import { QB } from '../data/questions.js';
import { hasSupabase } from '../lib/supabase.js';
import { getNextExam, fmtThaiDate, shortCountdown } from '../data/schedule.js';
import { SUBJECTS_BY_YEAR, YEARS, CURRENT_YEAR, visibleQuestionCount } from '../data/curriculum.js';
import { LATEST_CHANGELOG, SCOPE_LABELS } from '../data/changelog.js';
import { useLocalStorage } from '../hooks/useStorage.js';

// onlineCount/onlineStatus are now passed as props (hook lives in App
// so the WebSocket presence survives view changes — see App.jsx).
export default function HomeView({ setView, setMode, setSubject, setPracticeMode, setNumQuestions, setUseTimer, setTimePerQ, cardStats, bookmarks, customQuestions, user, profile, readingChecklist = {}, onlineCount = 0, onlineStatus = 'disabled', selectedYear = CURRENT_YEAR, setSelectedYear }) {
  // Year context — determines hero copy + reading checklist scope.
  // Only Y4 has actual exam schedule entries today; for scaffold years
  // we hide the countdown banner since `getNextExam('y5')` returns null.
  const yearMeta = YEARS.find((y) => y.id === selectedYear) || YEARS.find((y) => y.id === 4);
  const isScaffoldYear = !!yearMeta?.scaffold;
  const nextExam = getNextExam(`y${selectedYear}`);

  // Question count — show year-filtered count so PREVIEW years don't
  // mislead users with the global total.
  const totalQ = isScaffoldYear
    ? QB.filter((q) => q.year === selectedYear).length
    : QB.length + (customQuestions?.length || 0);

  // Reading checklist progress — scoped to the active year.
  const checklistTopics = (SUBJECTS_BY_YEAR[selectedYear] || [])
    .filter((s) => Array.isArray(s.topics) && s.topics.length > 0)
    .flatMap((s) => s.topics.map((t) => t.id));
  const readingDone = checklistTopics.filter((id) => readingChecklist[id]).length;
  const readingTotal = checklistTopics.length;

  // Changelog announcement banner — show until user dismisses this version
  const [lastSeenChangelog, setLastSeenChangelog] = useLocalStorage('vmx-last-seen-changelog', null);
  const [expanded, setExpanded] = useState(false);
  const showAnnouncement = LATEST_CHANGELOG && lastSeenChangelog !== LATEST_CHANGELOG.version;

  // (Removed dedicated IG banner from HomeView — Palm flagged the
  // home page had too many announcements. IG launch already lives in:
  //   1. Footer (every page)
  //   2. Changelog announcement (the v5.16.0 entry has the launch line)
  //   3. AboutView IG card (full QR + handle + tagline)
  // The single dismiss flag stays in localStorage in case we re-enable
  // it later for a future "follow us" push without losing prior opt-outs.)

  // Tick to keep the countdown banner fresh.
  //
  // Two cadences:
  //   • 1 min when an imminent countdown is shown (banner reads
  //     "อีก N นาที" / "อีก N ชม. M นาที" — needs minute granularity)
  //   • 5 min otherwise — keeps "X days left" accurate across day
  //     rollovers AND, more importantly, lets getNextExam roll forward
  //     when an exam finishes during the day (filtered out by exam-end
  //     time in schedule.js getNextExam, but only re-evaluated on
  //     re-render — without this tick, the banner would show a finished
  //     exam until the user did something else that re-rendered the
  //     home page).
  const [, setTick] = useState(0);
  const countdown = nextExam ? shortCountdown(nextExam) : null;
  useEffect(() => {
    const intervalMs = countdown ? 60_000 : 5 * 60_000;
    const id = setInterval(() => setTick((n) => n + 1), intervalMs);
    return () => clearInterval(id);
  }, [nextExam, countdown]);

  return (
    <>
      <div className="vmx-hero">
        <h1>
          {user ? (
            <>
              สวัสดี <em>{profile?.username || 'เพื่อน'}</em>
              <button
                onClick={() => setView('account-settings')}
                title="Account settings · เปลี่ยนรหัสผ่าน อีเมล หรือ logout"
                aria-label="Account settings"
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: 18,
                  marginLeft: 8,
                  padding: '4px 8px',
                  borderRadius: 999,
                  color: 'var(--clr-ink-soft)',
                  verticalAlign: 'middle',
                  lineHeight: 1,
                }}
              >
                ⚙️
              </button>
            </>
          ) : (
            <>อ่านแล้ว ลอง <em>ทำข้อสอบ</em> กันเถอะ</>
          )}
        </h1>
        <p>
          {isScaffoldYear
            ? <>🚧 <strong>{yearMeta.label}</strong> · {yearMeta.desc} · พรีวิว — รอเติมเนื้อหา</>
            : <>คลังข้อสอบ {totalQ} ข้อ · ปี 4 Vet 86 · By vet86 for vet86</>}
        </p>
        {setSelectedYear && (
          <button
            type="button"
            onClick={() => setView('year-select')}
            title="สลับชั้นปี"
            style={{
              marginTop: 10,
              padding: '6px 14px',
              borderRadius: 999,
              background: 'var(--clr-surface-2)',
              border: '1px solid var(--clr-border)',
              cursor: 'pointer',
              fontSize: 12,
              fontFamily: 'JetBrains Mono, monospace',
              color: 'var(--clr-ink)',
              letterSpacing: '0.05em',
            }}
          >
            🎓 เปลี่ยนปี
          </button>
        )}
        {onlineStatus === 'connected' && onlineCount > 0 && (
          <div
            title="จำนวนคนที่เปิดเว็บอยู่ตอนนี้ (อัพเดต realtime)"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              marginTop: 10,
              padding: '4px 10px',
              borderRadius: 999,
              background: 'rgba(74, 107, 74, 0.12)',
              border: '1px solid var(--clr-sage)',
              fontSize: 12,
              fontFamily: 'JetBrains Mono, monospace',
              color: 'var(--clr-ink)',
            }}
          >
            <span
              style={{
                display: 'inline-block',
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: 'var(--clr-sage)',
                animation: 'pulse 1.6s ease-in-out infinite',
              }}
            />
            <strong>{onlineCount}</strong> คนกำลังเรียนอยู่
          </div>
        )}
      </div>

      {/* Next exam countdown banner */}
      {nextExam && nextExam.daysLeft >= 0 && nextExam.daysLeft <= 30 && (
        <div onClick={() => setView('schedule')} style={{
          padding: 16, borderRadius: 16, marginBottom: 24, cursor: 'pointer',
          background: countdown ? 'var(--clr-rose-soft)' : (nextExam.daysLeft <= 7 ? 'var(--clr-rose-soft)' : 'var(--clr-surface)'),
          border: `2px solid ${countdown ? 'var(--clr-rose)' : (nextExam.daysLeft <= 7 ? 'var(--clr-rose)' : 'var(--clr-border)')}`,
          display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap',
        }}>
          <div style={{ fontSize: 36 }}>{nextExam.icon}</div>
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'var(--clr-ink-soft)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              สอบถัดไป
            </div>
            <div style={{ fontFamily: 'Fraunces, serif', fontWeight: 600, fontSize: 18, marginTop: 2 }}>
              {nextExam.title}
            </div>
            <div style={{ fontSize: 12, color: 'var(--clr-ink-soft)', marginTop: 2 }}>
              {fmtThaiDate(nextExam.date)} · ⏰ {nextExam.time}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            {countdown ? (
              <div style={{ fontFamily: 'Fraunces, serif', fontWeight: 700, fontSize: countdown.kind === 'imminent' ? 22 : 26, lineHeight: 1.15, color: 'var(--clr-rose)' }}>
                {countdown.text}
              </div>
            ) : (
              <>
                <div style={{ fontFamily: 'Fraunces, serif', fontWeight: 700, fontSize: 32, lineHeight: 1, color: nextExam.daysLeft <= 7 ? 'var(--clr-rose)' : 'var(--clr-ink)' }}>
                  {nextExam.daysLeft}
                </div>
                <div style={{ fontSize: 11, color: 'var(--clr-ink-soft)', textTransform: 'uppercase', fontFamily: 'JetBrains Mono, monospace' }}>
                  days left
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* What's-new announcement — auto-dismissed once seen */}
      {showAnnouncement && (
        <div
          style={{
            padding: 16,
            borderRadius: 14,
            marginBottom: 20,
            background: 'rgba(184, 137, 64, 0.08)',
            border: '1px solid var(--clr-gold)',
            position: 'relative',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, flexWrap: 'wrap' }}>
            <div style={{ fontSize: 28, lineHeight: 1 }}>🎉</div>
            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={{ fontSize: 11, fontFamily: 'JetBrains Mono, monospace', color: 'var(--clr-ink-soft)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                อัปเดตใหม่ · {LATEST_CHANGELOG.version} · {fmtThaiDate(LATEST_CHANGELOG.date)}
              </div>
              <div style={{ fontFamily: 'Fraunces, serif', fontSize: 17, fontWeight: 600, marginTop: 2, lineHeight: 1.3 }}>
                {LATEST_CHANGELOG.headline}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setLastSeenChangelog(LATEST_CHANGELOG.version)}
              aria-label="ปิดประกาศ"
              title="ปิดประกาศ"
              style={{
                all: 'unset',
                cursor: 'pointer',
                width: 28,
                height: 28,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--clr-ink-soft)',
                fontSize: 18,
                lineHeight: 1,
                background: 'var(--clr-bg)',
                border: '1px solid var(--clr-border)',
                flexShrink: 0,
              }}
            >
              ×
            </button>
          </div>

          {/* Detail list collapsed by default — Palm flagged the
              banner felt too long when items rendered eagerly. Show
              only on click; show only titles (no desc) to keep the
              expanded state compact. */}
          {expanded && (
            <ul style={{ margin: '12px 0 0', padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6 }}>
              {LATEST_CHANGELOG.changes.map((c, i) => (
                <li
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '6px 10px',
                    borderRadius: 8,
                    background: 'var(--clr-bg)',
                    border: '1px solid var(--clr-border)',
                    fontSize: 13,
                    lineHeight: 1.4,
                  }}
                >
                  <span style={{ fontSize: 14, flexShrink: 0 }}>{c.icon}</span>
                  <span style={{ flex: 1, minWidth: 0 }}>
                    {c.fromFeedback && <FeedbackChip />}
                    <strong style={{ color: 'var(--clr-ink)' }}>{c.title}</strong>
                  </span>
                  <KindPill kind={c.kind} />
                </li>
              ))}
            </ul>
          )}

          {LATEST_CHANGELOG.changes.length > 0 && (
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              style={{
                all: 'unset',
                cursor: 'pointer',
                marginTop: 8,
                fontSize: 12,
                color: 'var(--clr-ink-soft)',
                fontFamily: 'JetBrains Mono, monospace',
                textDecoration: 'underline',
              }}
            >
              {expanded
                ? '▴ ซ่อน'
                : `▾ ดูรายละเอียด (${LATEST_CHANGELOG.changes.length} รายการ)`}
            </button>
          )}
        </div>
      )}

      {/* PRIMARY: Subject Grid — natural mental model is "I want to study X subject" */}
      <div className="vmx-section-label">วิชาใน{yearMeta?.label || 'ปี 4'}</div>
      <SubjectGrid
        subjects={SUBJECTS_BY_YEAR[selectedYear] || []}
        questions={[...QB, ...(customQuestions || [])]}
        onPick={(s) => {
          if (s.scaffold) {
            // Scaffold subjects have no Qs/topics yet — just no-op
            // (could open a "subscribe for updates" modal later)
            return;
          }
          setSubject && setSubject(s.id);
          setView('topic-select');
        }}
      />

      {/* SECONDARY: Practice modes — cross-subject within selected year */}
      {!isScaffoldYear && (
        <>
          <div className="vmx-section-label" style={{ marginTop: 28 }}>โหมดซ้อม</div>
          <div className="vmx-mode-grid">
            <button className="vmx-mode-card" onClick={() => {
              setMode('quick');
              setSubject && setSubject('all');
              setPracticeMode && setPracticeMode('all');
              setView('config');
            }}>
              <div className="icon">📝</div>
              <div className="title">Quick Practice</div>
              <div className="sub">สุ่มข้อทุกวิชา · 5-50 ข้อ</div>
            </button>

            <button className="vmx-mode-card" onClick={() => {
              setMode('exam');
              setSubject && setSubject('all');
              setPracticeMode && setPracticeMode('all');
              if (setNumQuestions) setNumQuestions(50);
              if (setUseTimer) setUseTimer(true);
              if (setTimePerQ) setTimePerQ(60);
              setView('config');
            }}>
              <div className="icon">🎓</div>
              <div className="title">Exam Mode</div>
              <div className="sub">50 ข้อ × 60 วิ · เลียนข้อสอบจริง</div>
            </button>

            <button className="vmx-mode-card" onClick={() => { setMode('sr'); setView('sr-session'); }}>
              <div className="icon">🧠</div>
              <div className="title">Spaced Repetition</div>
              <div className="sub">
                {cardStats.due > 0
                  ? `${cardStats.due} ข้อทบทวนวันนี้ · ≈ ${Math.max(5, Math.ceil(cardStats.due / 5) * 5)} นาที`
                  : 'ทบทวนแบบ Anki'}
              </div>
              {cardStats.due > 0 && <div className="badge">{cardStats.due}</div>}
            </button>

            <button className="vmx-mode-card" onClick={() => { setPracticeMode('bookmarks'); setMode('quick'); setView('config'); }}>
              <div className="icon">🔖</div>
              <div className="title">Bookmarks</div>
              <div className="sub">
                {bookmarks.length > 0 ? `${bookmarks.length} ข้อที่บันทึก` : 'ยังไม่มีข้อที่บันทึก'}
              </div>
            </button>
          </div>
        </>
      )}

      {/* TERTIARY: Year tools — schedule, scores, reading, videos, analytics */}
      <div className="vmx-section-label" style={{ marginTop: 28 }}>เครื่องมือ{yearMeta?.label || 'ปี 4'}</div>
      <div className="vmx-mode-grid">
        <button className="vmx-mode-card" onClick={() => setView('schedule')}>
          <div className="icon">📅</div>
          <div className="title">ตารางสอบ</div>
          <div className="sub">
            {isScaffoldYear ? 'ยังไม่มีตาราง · ดูปี 4 ได้' : 'Final exam schedule'}
          </div>
        </button>

        <button className="vmx-mode-card" onClick={() => setView('reading-checklist')} style={{ borderColor: readingDone > 0 ? 'var(--clr-gold)' : undefined }}>
          <div className="icon">📚</div>
          <div className="title">รายการอ่าน</div>
          <div className="sub">
            {readingTotal > 0
              ? `${readingDone}/${readingTotal} หัวข้อ`
              : 'ยังไม่มีหัวข้อใน scope'}
          </div>
          {readingDone > 0 && <div className="badge" style={{ background: 'var(--clr-gold)' }}>{readingDone}</div>}
        </button>

        <button className="vmx-mode-card" onClick={() => setView('scores')}>
          <div className="icon">💰</div>
          <div className="title">สัดส่วนคะแนน</div>
          <div className="sub">Mid · Final · ฟรี · ทำงาน</div>
        </button>

        <button className="vmx-mode-card" onClick={() => setView('videos')}>
          <div className="icon">🎥</div>
          <div className="title">คลิปย้อนหลัง</div>
          <div className="sub">Video library แยกวิชา</div>
        </button>

        <button className="vmx-mode-card" onClick={() => setView('dashboard')}>
          <div className="icon">📊</div>
          <div className="title">Analytics</div>
          <div className="sub">สถิติ · จุดอ่อน · ประวัติ</div>
        </button>
      </div>

      {/* Multiplayer (cross-year, account-scoped) */}
      {hasSupabase && (
        <>
          <div className="vmx-section-label" style={{ marginTop: 28 }}>Multiplayer {!user && '(ต้อง login)'}</div>
          <div className="vmx-mode-grid">
            {user ? (
              <>
                <button className="vmx-mode-card" onClick={() => setView('groups')} style={{ borderColor: 'var(--clr-ocean)' }}>
                  <div className="icon">👥</div>
                  <div className="title">Study Groups</div>
                  <div className="sub">สร้างกลุ่ม · invite เพื่อน · แชร์ข้อสอบ</div>
                </button>
                <button className="vmx-mode-card" onClick={() => setView('leaderboard-global')} style={{ borderColor: 'var(--clr-gold)' }}>
                  <div className="icon">🏆</div>
                  <div className="title">Leaderboard</div>
                  <div className="sub">จัดอันดับคะแนนทั่วโลก</div>
                </button>
              </>
            ) : (
              <button className="vmx-mode-card" onClick={() => setView('auth')} style={{ borderColor: 'var(--clr-sage)' }}>
                <div className="icon">🔐</div>
                <div className="title">Login / Sign Up</div>
                <div className="sub">เพื่อใช้ Groups, Leaderboard, Cloud Sync</div>
              </button>
            )}
          </div>
        </>
      )}

      {/* Account / admin — cross-year */}
      <div className="vmx-section-label" style={{ marginTop: 28 }}>เกี่ยวกับ</div>
      <div className="vmx-mode-grid">
        <button className="vmx-mode-card" onClick={() => setView('question-manager')}>
          <div className="icon">➕</div>
          <div className="title">Question Manager</div>
          <div className="sub">เพิ่ม/แก้ข้อสอบเอง + Import/Export</div>
        </button>

        <button className="vmx-mode-card" onClick={() => setView('about')}>
          <div className="icon">ℹ️</div>
          <div className="title">เกี่ยวกับ VetMock</div>
          <div className="sub">ที่มา · Credits · Tech stack</div>
        </button>

        <button className="vmx-mode-card" onClick={() => setView('feedback')} style={{ borderColor: 'var(--clr-plum)' }}>
          <div className="icon">💌</div>
          <div className="title">แจ้งปัญหา / เสนอแนะ</div>
          <div className="sub">เจอ bug? อยากเสนอไอเดีย? ส่งมาเลย</div>
        </button>
      </div>

      <div style={{ marginTop: 30, padding: 16, borderRadius: 12, background: 'var(--clr-surface-2)', fontSize: 13, color: 'var(--clr-ink-soft)', lineHeight: 1.7 }}>
        💡 ใช้ Spaced Repetition ทุกวัน วันละ 15-30 นาที จะได้ผลดีที่สุด<br/>
        ⌨️ กด <span className="vmx-kbd">1-4</span> เพื่อเลือก MCQ, <span className="vmx-kbd">T/F</span>, <span className="vmx-kbd">Space</span> ข้อถัดไป<br/>
        🌙 สลับโหมดมืด/สว่างที่ปุ่มขวาบน
      </div>

      {/* If user dismissed announcement, give them a way to re-open it */}
      {!showAnnouncement && LATEST_CHANGELOG && (
        <div style={{ marginTop: 12, textAlign: 'right' }}>
          <button
            type="button"
            onClick={() => setLastSeenChangelog(null)}
            style={{
              all: 'unset',
              cursor: 'pointer',
              fontSize: 11,
              color: 'var(--clr-ink-soft)',
              fontFamily: 'JetBrains Mono, monospace',
              textDecoration: 'underline',
            }}
          >
            🔔 ดูสิ่งที่อัปเดตล่าสุด ({LATEST_CHANGELOG.version})
          </button>
        </div>
      )}
    </>
  );
}

// ── Scope chip (วิชา / ระบบ) — inline, before the title ─────────
function ScopeChip({ scope }) {
  const meta = SCOPE_LABELS[scope];
  if (!meta) return null;
  return (
    <span
      title={`อัปเดตในส่วน: ${meta.label}`}
      style={{
        display: 'inline-block',
        padding: '1px 7px',
        marginRight: 6,
        marginBottom: 2,
        borderRadius: 999,
        background: meta.bg,
        color: meta.color,
        fontSize: 10,
        fontFamily: 'JetBrains Mono, monospace',
        fontWeight: 600,
        verticalAlign: 'middle',
        whiteSpace: 'nowrap',
      }}
    >
      {meta.icon} {meta.label}
    </span>
  );
}

// ── "จาก feedback" chip ─────────────────────────────────────────
// Marks changelog entries that came from a user's feedback form or
// email so the rest of the cohort sees their submissions actually
// shipped. Keep this entry-level (not version-level) — sometimes a
// release contains both feedback fixes and unrelated changes.
function FeedbackChip() {
  return (
    <span
      title="แก้จาก feedback ที่ส่งมา"
      style={{
        display: 'inline-block',
        padding: '1px 7px',
        marginRight: 6,
        marginBottom: 2,
        borderRadius: 999,
        background: 'rgba(184, 137, 64, 0.15)',
        color: 'var(--clr-gold)',
        fontSize: 10,
        fontFamily: 'JetBrains Mono, monospace',
        fontWeight: 600,
        verticalAlign: 'middle',
        whiteSpace: 'nowrap',
      }}
    >
      📨 จาก feedback
    </span>
  );
}

// ── Subject Grid ──────────────────────────────────────────────
// Primary content of HomeView (across all years). Each card represents
// a subject in the current year, with LIVE state (counts, exam format)
// or PREVIEW state (faculty count from vault_lecturers, course code).
// LIVE cards link to TopicSelectView (= subject detail). PREVIEW cards
// are visually distinct + non-interactive (subjects without Qs yet).
function SubjectGrid({ subjects, questions, onPick }) {
  if (!subjects?.length) {
    return (
      <div style={{
        padding: 20,
        borderRadius: 12,
        background: 'var(--clr-surface-2)',
        fontSize: 13,
        color: 'var(--clr-ink-soft)',
        textAlign: 'center',
      }}>
        ยังไม่มีวิชาในปีนี้ — กลับไปเลือกปีอื่นได้
      </div>
    );
  }

  return (
    <div className="vmx-subject-grid">
      {subjects.map((s) => {
        const count = visibleQuestionCount(s.id, questions);
        const isScaffold = !!s.scaffold || count === 0;

        return (
          <button
            key={s.id}
            className="vmx-subject-card"
            onClick={() => onPick && onPick(s)}
            disabled={isScaffold}
            style={{
              opacity: isScaffold ? 0.55 : 1,
              cursor: isScaffold ? 'not-allowed' : 'pointer',
            }}
            title={isScaffold ? 'รอเติมเนื้อหา · ส่ง slide/notes มาช่วยได้' : ''}
          >
            <div className="accent" style={{ background: s.color }}></div>
            <div className="icon">{s.icon}</div>
            <div className="title">{s.name}</div>
            <div className="sub">{s.name_en}</div>
            <div className="count" style={{ color: isScaffold ? 'var(--clr-gold)' : 'var(--clr-ink-soft)' }}>
              {isScaffold
                ? `🚧 รอเติมเนื้อหา${s.vault_lecturers?.length ? ` · ${s.vault_lecturers.length} faculty` : ''}`
                : `${count} questions`}
            </div>
            {s.code && (
              <div style={{ fontSize: 10, fontFamily: 'JetBrains Mono, monospace', color: 'var(--clr-ink-soft)', opacity: 0.7, marginTop: 2 }}>
                {s.code}
              </div>
            )}
            {s.examFormat && !isScaffold && (
              <div style={{
                marginTop: 6,
                padding: '3px 8px',
                borderRadius: 999,
                background: 'var(--clr-surface-2)',
                fontSize: 10,
                fontFamily: 'JetBrains Mono, monospace',
                color: 'var(--clr-ink-soft)',
                display: 'inline-block',
                letterSpacing: '0.05em',
              }}>
                📝 {s.examFormat.weight}
                {s.examFormat.choiceCount && ` · ${s.examFormat.choiceCount} ช้อยส์`}
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}

// ── Small kind pill (เขียว/ทอง/กลาง) ────────────────────────────
function KindPill({ kind }) {
  const styles = {
    feature: { bg: 'rgba(74, 107, 74, 0.15)', color: 'var(--clr-sage)', label: 'ใหม่' },
    fix: { bg: 'rgba(184, 137, 64, 0.15)', color: 'var(--clr-gold)', label: 'แก้บั๊ก' },
    content: { bg: 'var(--clr-surface-2)', color: 'var(--clr-ink-soft)', label: 'เพิ่มเนื้อหา' },
  };
  const s = styles[kind] || styles.content;
  return (
    <span
      style={{
        marginLeft: 'auto',
        padding: '2px 8px',
        borderRadius: 999,
        background: s.bg,
        color: s.color,
        fontSize: 10,
        fontFamily: 'JetBrains Mono, monospace',
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        flexShrink: 0,
        alignSelf: 'flex-start',
      }}
    >
      {s.label}
    </span>
  );
}
