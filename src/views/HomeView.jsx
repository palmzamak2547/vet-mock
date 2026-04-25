import { QB } from '../data/questions.js';
import { hasSupabase } from '../lib/supabase.js';
import { getNextExam, fmtThaiDate } from '../data/schedule.js';

export default function HomeView({ setView, setMode, setSubject, setPracticeMode, cardStats, bookmarks, customQuestions, user, profile }) {
  const totalQ = QB.length + (customQuestions?.length || 0);
  const nextExam = getNextExam('y4');

  return (
    <>
      <div className="vmx-hero">
        <h1>
          {user ? <>สวัสดี <em>{profile?.username || 'เพื่อน'}</em></> : <>อ่านแล้ว ลอง <em>ทำข้อสอบ</em> กันเถอะ</>}
        </h1>
        <p>คลังข้อสอบ {totalQ} ข้อ · ปี 4 Vet 86 · By vet86 for vet86</p>
      </div>

      {/* Next exam countdown banner */}
      {nextExam && nextExam.daysLeft >= 0 && nextExam.daysLeft <= 30 && (
        <div onClick={() => setView('schedule')} style={{
          padding: 16, borderRadius: 16, marginBottom: 24, cursor: 'pointer',
          background: nextExam.daysLeft <= 7 ? 'var(--clr-rose-soft)' : 'var(--clr-surface)',
          border: `2px solid ${nextExam.daysLeft <= 7 ? 'var(--clr-rose)' : 'var(--clr-border)'}`,
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
              {fmtThaiDate(nextExam.date)}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: 'Fraunces, serif', fontWeight: 700, fontSize: 32, lineHeight: 1, color: nextExam.daysLeft <= 7 ? 'var(--clr-rose)' : 'var(--clr-ink)' }}>
              {nextExam.daysLeft === 0 ? 'วันนี้!' : nextExam.daysLeft}
            </div>
            {nextExam.daysLeft > 0 && (
              <div style={{ fontSize: 11, color: 'var(--clr-ink-soft)', textTransform: 'uppercase', fontFamily: 'JetBrains Mono, monospace' }}>
                days left
              </div>
            )}
          </div>
        </div>
      )}

      <div className="vmx-section-label">โหมดการเรียน</div>
      <div className="vmx-mode-grid">
        <button className="vmx-mode-card" onClick={() => { setMode('quick'); setView('subject-select'); }}>
          <div className="icon">📝</div>
          <div className="title">Quick Practice</div>
          <div className="sub">สุ่มข้อสอบ 5-50 ข้อ พร้อมจับเวลา</div>
        </button>

        <button className="vmx-mode-card" onClick={() => { setMode('exam'); setView('subject-select'); }}>
          <div className="icon">🎓</div>
          <div className="title">Exam Mode</div>
          <div className="sub">สอบจริงจัง 50 ข้อ 50 นาที</div>
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
    </>
  );
}
