import { useEffect, useState } from 'react';
import { QB } from '../data/questions.js';
import { hasSupabase } from '../lib/supabase.js';
import { getNextExam, fmtThaiDate, shortCountdown } from '../data/schedule.js';
import { useOnlineCount } from '../hooks/useOnlineCount.js';
import { SUBJECTS_BY_YEAR } from '../data/curriculum.js';
import { LATEST_CHANGELOG } from '../data/changelog.js';
import { useLocalStorage } from '../hooks/useStorage.js';

export default function HomeView({ setView, setMode, setSubject, setPracticeMode, setNumQuestions, setUseTimer, setTimePerQ, cardStats, bookmarks, customQuestions, user, profile, readingChecklist = {} }) {
  const totalQ = QB.length + (customQuestions?.length || 0);
  const nextExam = getNextExam('y4');
  const { count: onlineCount, status: onlineStatus } = useOnlineCount();

  // Reading checklist progress (year 4 only — current year)
  const checklistTopics = (SUBJECTS_BY_YEAR[4] || [])
    .filter((s) => Array.isArray(s.topics) && s.topics.length > 0)
    .flatMap((s) => s.topics.map((t) => t.id));
  const readingDone = checklistTopics.filter((id) => readingChecklist[id]).length;
  const readingTotal = checklistTopics.length;

  // Changelog announcement banner — show until user dismisses this version
  const [lastSeenChangelog, setLastSeenChangelog] = useLocalStorage('vmx-last-seen-changelog', null);
  const [expanded, setExpanded] = useState(false);
  const showAnnouncement = LATEST_CHANGELOG && lastSeenChangelog !== LATEST_CHANGELOG.version;

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
          {user ? <>สวัสดี <em>{profile?.username || 'เพื่อน'}</em></> : <>อ่านแล้ว ลอง <em>ทำข้อสอบ</em> กันเถอะ</>}
        </h1>
        <p>คลังข้อสอบ {totalQ} ข้อ · ปี 4 Vet 86 · By vet86 for vet86</p>
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

          <ul style={{ margin: '12px 0 0', padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6 }}>
            {(expanded ? LATEST_CHANGELOG.changes : LATEST_CHANGELOG.changes.slice(0, 3)).map((c, i) => (
              <li
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 10,
                  padding: '8px 10px',
                  borderRadius: 8,
                  background: 'var(--clr-bg)',
                  border: '1px solid var(--clr-border)',
                  fontSize: 13,
                  lineHeight: 1.5,
                }}
              >
                <span style={{ fontSize: 16, flexShrink: 0 }}>{c.icon}</span>
                <span>
                  <strong style={{ color: 'var(--clr-ink)' }}>{c.title}</strong>
                  <span style={{ color: 'var(--clr-ink-soft)' }}> — {c.desc}</span>
                </span>
                <KindPill kind={c.kind} />
              </li>
            ))}
          </ul>

          {LATEST_CHANGELOG.changes.length > 3 && (
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              style={{
                all: 'unset',
                cursor: 'pointer',
                marginTop: 10,
                fontSize: 12,
                color: 'var(--clr-ink-soft)',
                fontFamily: 'JetBrains Mono, monospace',
                textDecoration: 'underline',
              }}
            >
              {expanded
                ? '▴ แสดงน้อยลง'
                : `▾ ดูทั้งหมด (อีก ${LATEST_CHANGELOG.changes.length - 3} รายการ)`}
            </button>
          )}
        </div>
      )}

      <div className="vmx-section-label">โหมดการเรียน</div>
      <div className="vmx-mode-grid">
        <button className="vmx-mode-card" onClick={() => { setMode('quick'); setView('subject-select'); }}>
          <div className="icon">📝</div>
          <div className="title">Quick Practice</div>
          <div className="sub">สุ่มข้อสอบ 5-50 ข้อ พร้อมจับเวลา</div>
        </button>

        <button className="vmx-mode-card" onClick={() => {
          setMode('exam');
          if (setNumQuestions) setNumQuestions(50);
          if (setUseTimer) setUseTimer(true);
          if (setTimePerQ) setTimePerQ(60);
          setView('subject-select');
        }}>
          <div className="icon">🎓</div>
          <div className="title">Exam Mode</div>
          <div className="sub">เริ่มต้น 50 ข้อ × 60 วิ (ปรับได้)</div>
        </button>

        <button className="vmx-mode-card" onClick={() => { setMode('sr'); setView('sr-session'); }}>
          <div className="icon">🧠</div>
          <div className="title">Spaced Repetition</div>
          <div className="sub">
            {cardStats.due > 0 ? `${cardStats.due} ข้อที่ต้องทบทวนวันนี้` : 'ทบทวนแบบ Anki'}
          </div>
          {cardStats.due > 0 && <div className="badge">{cardStats.due}</div>}
        </button>

        <button className="vmx-mode-card" onClick={() => setView('schedule')}>
          <div className="icon">📅</div>
          <div className="title">ตารางสอบ</div>
          <div className="sub">Final Exam Schedule · ปี 4</div>
        </button>

        <button className="vmx-mode-card" onClick={() => { setSubject && setSubject('com5'); setView('notes'); }} style={{ borderColor: 'var(--clr-sage)' }}>
          <div className="icon">📖</div>
          <div className="title">ทวนเนื้อหา</div>
          <div className="sub">Study notes อ้างอิง slide จริง · COM III + COM IV + COM V</div>
        </button>

        <button className="vmx-mode-card" onClick={() => setView('reading-checklist')} style={{ borderColor: 'var(--clr-gold)' }}>
          <div className="icon">📚</div>
          <div className="title">รายการอ่าน</div>
          <div className="sub">
            {readingTotal > 0
              ? `${readingDone}/${readingTotal} หัวข้อ · ติ๊กที่อ่านเสร็จแล้ว`
              : 'ติ๊กหัวข้อที่อ่านเสร็จแล้ว — track progress'}
          </div>
          {readingDone > 0 && <div className="badge" style={{ background: 'var(--clr-gold)' }}>{readingDone}</div>}
        </button>

        <button className="vmx-mode-card" onClick={() => setView('scores')}>
          <div className="icon">💰</div>
          <div className="title">สัดส่วนคะแนน</div>
          <div className="sub">Mid · Final · ฟรี · ทำงาน — แต่ละวิชา</div>
        </button>

        <button className="vmx-mode-card" onClick={() => setView('videos')}>
          <div className="icon">🎥</div>
          <div className="title">คลิปย้อนหลัง</div>
          <div className="sub">Video library จาก YouTube แยกวิชา</div>
        </button>

        <button className="vmx-mode-card" onClick={() => setView('dashboard')}>
          <div className="icon">📊</div>
          <div className="title">Analytics</div>
          <div className="sub">ดูสถิติ จุดอ่อน และประวัติ</div>
        </button>

        <button className="vmx-mode-card" onClick={() => { setPracticeMode('bookmarks'); setMode('quick'); setView('config'); }}>
          <div className="icon">🔖</div>
          <div className="title">Bookmarks</div>
          <div className="sub">
            {bookmarks.length > 0 ? `${bookmarks.length} ข้อที่บันทึก` : 'ยังไม่มีข้อที่บันทึก'}
          </div>
        </button>

        <button className="vmx-mode-card" onClick={() => setView('question-manager')}>
          <div className="icon">➕</div>
          <div className="title">Question Manager</div>
          <div className="sub">เพิ่ม/แก้ไขข้อสอบเอง + Import/Export</div>
        </button>
      </div>

      {hasSupabase && (
        <>
          <div className="vmx-section-label">Multiplayer {!user && '(ต้อง login)'}</div>
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

      <div className="vmx-section-label">เพิ่มเติม</div>
      <div className="vmx-mode-grid">
        <button className="vmx-mode-card" onClick={() => setView('year-select')}>
          <div className="icon">🎓</div>
          <div className="title">เลือกชั้นปี</div>
          <div className="sub">ตอนนี้มีแค่ปี 4 (Vet 86) · ปีอื่นกำลังทำ</div>
        </button>

        <button className="vmx-mode-card" onClick={() => setView('about')}>
          <div className="icon">ℹ️</div>
          <div className="title">เกี่ยวกับ VetMock</div>
          <div className="sub">ที่มาของข้อสอบ · Credits · Tech stack</div>
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
