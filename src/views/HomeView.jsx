import { QB } from '../data/questions.js';
import { hasSupabase } from '../lib/supabase.js';

export default function HomeView({ setView, setMode, setSubject, setPracticeMode, cardStats, bookmarks, customQuestions, user, profile }) {
  const totalQ = QB.length + (customQuestions?.length || 0);
  return (
    <>
      <div className="vmx-hero">
        <h1>
          {user ? <>สวัสดี <em>{profile?.username || 'เพื่อน'}</em></> : <>อ่านแล้ว ลอง <em>ทำข้อสอบ</em> กันเถอะ</>}
        </h1>
        <p>คลังข้อสอบ {totalQ} ข้อ · Spaced Repetition · Exam Mode · Groups & Leaderboard</p>
      </div>

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
                  <div className="badge" style={{ background: 'var(--clr-ocean)' }}>LIVE</div>
                </button>
                <button className="vmx-mode-card" onClick={() => setView('leaderboard-global')} style={{ borderColor: 'var(--clr-gold)' }}>
                  <div className="icon">🏆</div>
                  <div className="title">Global Leaderboard</div>
                  <div className="sub">จัดอันดับคะแนนทั่วโลก</div>
                </button>
              </>
            ) : (
              <button className="vmx-mode-card" onClick={() => setView('auth')} style={{ borderColor: 'var(--clr-sage)' }}>
                <div className="icon">🔐</div>
                <div className="title">Login / Sign Up</div>
                <div className="sub">เพื่อใช้ Groups, Leaderboard, Cloud Sync</div>
                <div className="badge" style={{ background: 'var(--clr-sage)' }}>NEW</div>
              </button>
            )}
          </div>
        </>
      )}

      <div className="vmx-section-label">Tips</div>
      <div style={{ fontSize: 13, color: 'var(--clr-ink-soft)', lineHeight: 1.6 }}>
        💡 ใช้ Spaced Repetition ทุกวัน วันละ 15-30 นาที จะได้ผลดีที่สุด<br/>
        ⌨️ กด <span className="vmx-kbd">1-4</span> เพื่อเลือก MCQ, <span className="vmx-kbd">T/F</span>, <span className="vmx-kbd">Space</span> ข้อถัดไป<br/>
        🌙 สลับโหมดมืด/สว่างที่ปุ่มขวาบน<br/>
        {hasSupabase && !user && <>🔐 Login เพื่อซิงค์ progress ข้ามเครื่อง + แข่งกับเพื่อน</>}
      </div>
    </>
  );
}
