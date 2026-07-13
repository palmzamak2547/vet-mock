// ============================================================
// HeaderBar — app header (logo · year/phase pills · quick actions)
// ============================================================
// Extracted from App.jsx 2026-05-27 (round-2 slim). A cohesive unit:
// brand logo (→ home) · year pill · phase pill · ⌘K search · analytics ·
// bookmarks · streak · XP chip · UserMenu · ThemePicker.
//
// Pure presentation driven by props — no internal state. The header is
// hidden by the caller on full-screen views (exam/results/review/auth/
// year-select); this component assumes it's being rendered, so the
// view-gating stays in App.jsx.
//
// XpChip is lazy-loaded here (was lazy in App.jsx) since the header is
// its only consumer. UserMenu + ThemePicker are already standalone.
// ============================================================

import { Suspense, lazy } from 'react';
import { hasSupabase } from '../lib/supabase.js';
import UserMenu from './UserMenu.jsx';
import ThemePicker from './ThemePicker.jsx';

// XP chip — Lv N · XXX XP · thin progress bar. Lazy because the
// gamification isn't critical for first paint.
const XpChip = lazy(() => import('./XpChip.jsx'));

const PHASE_PILL_LABELS = {
  '1-mid': '📚 ทม.1 กลาง',
  '1-final': '🎯 ทม.1 ปลาย',
  '2-mid': '📖 ทม.2 กลาง',
  '2-final': '🏁 ทม.2 ปลาย',
};

const PILL_STYLE = {
  padding: '4px 12px',
  borderRadius: 999,
  background: 'var(--clr-surface)',
  border: '1px solid var(--clr-border)',
  cursor: 'pointer',
  fontSize: 12,
  fontFamily: 'JetBrains Mono, monospace',
  color: 'var(--clr-ink)',
  letterSpacing: '0.04em',
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
};

export default function HeaderBar({
  view, setView, goHome,
  selectedYear, selectedYearStored, selectedPhase,
  setPaletteOpen,
  bookmarks, setPracticeMode, setMode,
  streakData,
  user, profile, handleSignOut,
  theme, setTheme, palette, setPalette,
}) {
  return (
    <header className="vmx-header">
      <div className="vmx-header-context">
        <button
          type="button"
          className="vmx-logo vmx-logo-btn"
          onClick={goHome}
          aria-label="VetMock — หน้าแรก"
        >
          Vet<span>Mock</span>
        </button>
        {/* Year pill — visible on every page after pick, persistent year
            context. Click → year-select. Hidden during the first-time
            picker flow (selectedYearStored === null). */}
        {selectedYearStored !== null && view !== 'year-select' && (
          <button
            type="button"
            className="vmx-link-btn"
            onClick={() => setView('year-select')}
            title="สลับชั้นปี"
            aria-label={`สลับชั้นปี — ปัจจุบันปี ${selectedYear}`}
            style={PILL_STYLE}
          >
            🎓 ปี {selectedYear}
            <span style={{ opacity: 0.5, fontSize: 10 }}>▾</span>
          </button>
        )}
        {/* Phase pill — separate from year so user can switch phase without
            losing year context. Hidden if no phase set (e.g. Y6 block-based)
            or on the picker views themselves. */}
        {selectedPhase && view !== 'phase-select' && view !== 'year-select' && (
          <button
            type="button"
            className="vmx-link-btn"
            onClick={() => setView('phase-select')}
            title="สลับ phase สอบ"
            aria-label="สลับช่วงสอบ (Phase)"
            style={PILL_STYLE}
          >
            {PHASE_PILL_LABELS[selectedPhase] || selectedPhase}
            <span style={{ opacity: 0.5, fontSize: 10 }}>▾</span>
          </button>
        )}
      </div>
      <div className="vmx-header-right">
        <button
          className="vmx-cmdk-btn"
          onClick={() => setPaletteOpen(true)}
          title="Quick search (⌘K / Ctrl+K)"
          aria-label="เปิด command palette"
        >
          <span style={{ fontSize: 13 }}>🔍</span>
          <kbd className="vmx-cmdk-kbd">⌘K</kbd>
        </button>
        {/* Quick-access icons — analytics + bookmarks. Rely on flex-wrap
            to drop them to the next row on small screens. */}
        <button
          className="vmx-theme-btn vmx-header-secondary"
          onClick={() => setView('dashboard')}
          title="Analytics, ดูสถิติ + ประวัติ"
          aria-label="Analytics"
        >📊</button>
        <button
          className="vmx-theme-btn vmx-header-secondary"
          onClick={() => {
            if (bookmarks.length === 0) return;
            setPracticeMode('bookmarks');
            setMode('quick');
            setView('config');
          }}
          disabled={bookmarks.length === 0}
          title={bookmarks.length === 0 ? 'ยังไม่มีข้อที่บันทึก' : `Bookmarks, ทำ ${bookmarks.length} ข้อที่บันทึก`}
          aria-label="Bookmarks"
          style={{
            position: 'relative',
            opacity: bookmarks.length === 0 ? 0.45 : 1,
            cursor: bookmarks.length === 0 ? 'not-allowed' : 'pointer',
          }}
        >
          🔖
          {bookmarks.length > 0 && (
            <span style={{
              position: 'absolute',
              top: -4,
              right: -4,
              minWidth: 16,
              height: 16,
              padding: '0 4px',
              borderRadius: 8,
              background: 'var(--clr-rose)',
              color: 'white',
              fontSize: 10,
              fontFamily: 'JetBrains Mono, monospace',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              lineHeight: 1,
            }}>{bookmarks.length}</span>
          )}
        </button>
        {streakData.streak > 0 && <div className="vmx-streak">🔥 {streakData.streak}</div>}
        <Suspense fallback={null}>
          <XpChip />
        </Suspense>
        {user && profile && (
          <UserMenu profile={profile} onLogout={handleSignOut} onGroups={() => setView('groups')} onLeaderboard={() => setView('leaderboard-global')} />
        )}
        {!user && hasSupabase && (
          <button className="vmx-btn vmx-btn-ghost vmx-btn-sm" onClick={() => setView('auth')}>Login</button>
        )}
        <ThemePicker theme={theme} setTheme={setTheme} palette={palette} setPalette={setPalette} />
      </div>
    </header>
  );
}
