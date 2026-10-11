// ============================================================
// ProfileView — "โปรไฟล์": the personal hub that replaced the VetWiki
// shortcut in the mobile bottom bar (owner feedback 2026-10-11).
// ============================================================
// One screen for the four questions a student actually opens the app with:
//   • how am I doing  (สถิติของฉัน)
//   • what am I reading / reviewing (การเรียนของฉัน)
//   • how should it behave (การตั้งค่า)
//   • how do I keep it on my phone (แอปของฉัน)
//
// It works WITHOUT an account: everything above the sign-in line is local
// study data, and only the account row asks for one. Asking a guest to log in
// before they may change the reading font is not a request, it is a wall.
//
// Data comes from App as plain props (history, streakData, readingChecklist,
// srCards) — this screen computes counts and nothing else. It never fetches,
// never writes, and never owns state that another view owns.
// ============================================================

import BackBar from '../components/BackBar.jsx';
import ThemePicker from '../components/ThemePicker.jsx';
import PWAInstallChip from '../components/PWAInstallChip.jsx';

// Local-day key in the browser's own zone. The app is read in Bangkok and the
// fixtures pin Asia/Bangkok, so `en-CA` keeps this a plain YYYY-MM-DD compare.
const dayKey = (value) => new Date(value).toLocaleDateString('en-CA');

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
}) {
  const stats = useStats(history, streakData);
  const readCount = countRead(readingChecklist);
  const reviewCount = srCards && typeof srCards === 'object' ? Object.keys(srCards).length : 0;
  const displayName = profile?.username || user?.user_metadata?.username || '';
  const accuracy = stats.total > 0 ? Math.round((stats.correctCount / stats.total) * 100) : null;

  return (
    <>
      <BackBar onBack={goHome || (() => setView('home'))} label="หน้าแรก" />

      <div className="vmx-hero">
        <h1>โปรไฟล์ <em>ของฉัน</em></h1>
        <p>สถิติ การเรียน และการตั้งค่ารวมอยู่ในที่เดียว</p>
      </div>

      {/* Who this is. Signed-out guests get the invitation instead of an
          empty box — and still get every setting below it. */}
      {user ? (
        <div className="vmx-dash-card" style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
          <span aria-hidden="true" style={{ fontSize: 28, lineHeight: 1 }}>{profile?.avatar_emoji || '🐾'}</span>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontFamily: 'var(--vmx-display)', fontWeight: 600, fontSize: 16, color: 'var(--clr-ink)' }}>
              {displayName || 'บัญชีของฉัน'}
            </div>
            <div style={{ fontSize: 12, color: 'var(--clr-ink-soft)', marginTop: 2 }}>
              เข้าสู่ระบบแล้ว{profile?.year ? `, ปี ${profile.year}` : ''} — ความคืบหน้าถูกเก็บไว้ในบัญชี
            </div>
          </div>
        </div>
      ) : (
        <div className="vmx-dash-card" style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--clr-ink)' }}>
            กำลังใช้งานแบบไม่เข้าสู่ระบบ — ข้อมูลเรียนอยู่ในเครื่องนี้
          </div>
          <div style={{ fontSize: 13, lineHeight: 1.7, color: 'var(--clr-ink-soft)', marginTop: 6 }}>
            เข้าสู่ระบบเพื่อเก็บความคืบหน้าลงบัญชี ใช้ต่อได้ทุกเครื่องโดยไม่ต้องเริ่มใหม่
          </div>
          {hasSupabase && (
            <button
              type="button"
              className="vmx-btn vmx-btn-primary vmx-btn-sm"
              style={{ marginTop: 12 }}
              onClick={() => setView('auth')}
            >
              เข้าสู่ระบบ
            </button>
          )}
        </div>
      )}

      {/* ── Stats ─────────────────────────────────────────────────────── */}
      <div className="vmx-dash-card" style={{ marginBottom: 16 }}>
        <h2>สถิติของฉัน</h2>
        <div className="vmx-stat-grid" style={{ marginBottom: 16 }}>
          <div className="vmx-stat-card">
            <div className="vmx-stat-num">{stats.streak}</div>
            <div style={{ fontSize: 12, color: 'var(--clr-ink-soft)', marginTop: 6 }}>วันต่อเนื่อง</div>
          </div>
          <div className="vmx-stat-card">
            <div className="vmx-stat-num">{stats.todayCount}</div>
            <div style={{ fontSize: 12, color: 'var(--clr-ink-soft)', marginTop: 6 }}>ข้อวันนี้</div>
          </div>
          <div className="vmx-stat-card">
            <div className="vmx-stat-num">{stats.total}</div>
            <div style={{ fontSize: 12, color: 'var(--clr-ink-soft)', marginTop: 6 }}>ข้อทั้งหมด</div>
          </div>
        </div>
        {accuracy !== null && (
          <div style={{ fontSize: 13, color: 'var(--clr-ink-soft)', marginBottom: 12 }}>
            ตอบถูกรวม {accuracy}% จาก {stats.total} ข้อที่ทำไว้
          </div>
        )}
        <Row
          label="ความคืบหน้า"
          note="กราฟและหัวข้อที่อ่อน"
          onClick={() => setView('dashboard')}
        />
      </div>

      {/* ── Study lists ───────────────────────────────────────────────── */}
      <div className="vmx-dash-card" style={{ marginBottom: 16 }}>
        <h2>การเรียนของฉัน</h2>
        <Row
          label="รายการอ่าน"
          note={readCount > 0 ? `อ่านแล้ว ${readCount} หัวข้อ` : 'เช็กหัวข้อที่อ่านแล้ว'}
          onClick={() => setView('reading-checklist')}
        />
        <Row
          label="ทบทวนตามรอบ"
          note={reviewCount > 0 ? `${reviewCount} ใบอยู่ในคิว` : 'ใบที่ผิดจะกลับมาตามรอบ'}
          onClick={() => setView('sr-session')}
        />
        <Row
          label="ตารางเรียน"
          note="วิชาและวันที่เรียน"
          onClick={() => setView('schedule')}
        />
        <Row
          label="กระดานทบทวน"
          note="รวมข้อและบันทึกที่เก็บไว้"
          onClick={() => setView('pinboard')}
        />
      </div>

      {/* ── Settings ──────────────────────────────────────────────────── */}
      <div className="vmx-dash-card" style={{ marginBottom: 16 }}>
        <h2>การตั้งค่า</h2>
        <Row
          label="เสียงอ่านออก"
          note="ความเร็วและเสียงพากย์"
          onClick={onVoiceSettings}
        />
        {/* Theme + motion: ThemePicker is the app's one owner of both, and it
            lives in the header as a popover. Mounting the same component here
            keeps them from drifting instead of growing a second copy. */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '8px 0' }}>
          <span style={{ fontSize: 14, color: 'var(--clr-ink)' }}>ธีมและสี</span>
          <ThemePicker theme={theme} setTheme={setTheme} palette={palette} setPalette={setPalette} />
        </div>
        {user && (
          <Row
            label="บัญชี"
            note="รหัสผ่าน อีเมล และข้อมูลส่วนตัว"
            onClick={() => setView('account-settings')}
          />
        )}
        {/* VetWiki left the bottom bar, so the hub names where it went. */}
        <Row
          label="VetWiki"
          note="คลังความรู้ที่ตรวจสอบได้"
          onClick={() => setView('knowledge')}
          testId="profile-vetwiki-row"
        />
      </div>

      {/* ── The app itself ────────────────────────────────────────────── */}
      <div className="vmx-dash-card" style={{ marginBottom: 16 }}>
        <h2>แอปของฉัน</h2>
        <div style={{ marginBottom: 12 }}>
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
