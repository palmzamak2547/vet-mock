// ============================================================
// HeaderBar — app header (brand · study context · account tools)
// ============================================================
// Three zones, in reading order:
//   1. brand      — wordmark → home
//   2. context    — "ปี 4 | ทม.1 กลาง" as ONE segmented control (what am
//                   I studying right now), each half switching its own axis
//   3. tools      — search · saved · streak · XP · account · theme
//
// De-slop pass 2026-07-24: this used to carry 11 controls and 8 emoji in a
// single row. The 📖 Wiki and 📊 Analytics buttons were removed outright —
// both are now first-class destinations in the Sidebar (desktop) and the
// BottomNav (mobile), so the header was duplicating navigation. Saved
// questions stays (it is NOT in those navs) but only appears when there is
// something saved, instead of sitting there permanently disabled. Emoji are
// replaced by line icons or plain text: a header is chrome, not decoration.
//
// Pure presentation driven by props — no internal state. The header is
// hidden by the caller on full-screen views (exam/results/review/auth/
// year-select); this component assumes it's being rendered, so the
// view-gating stays in App.jsx.
// ============================================================

import { Suspense, lazy } from 'react';
import { hasSupabase } from '../lib/supabase.js';
import UserMenu from './UserMenu.jsx';
import ThemePicker from './ThemePicker.jsx';
import NavIcon from './NavIcon.jsx';
import { commandShortcutLabel } from '../lib/nav.js';
import Wordmark from './Wordmark.jsx';

// XP chip — Lv N · XXX XP · thin progress bar. Lazy because the
// gamification isn't critical for first paint.
const XpChip = lazy(() => import('./XpChip.jsx'));

// Text only — the phase is context, and 4 different emoji across 4 phases
// read as decoration rather than meaning.
const PHASE_PILL_LABELS = {
  '1-mid': 'ทม.1 กลาง',
  '1-final': 'ทม.1 ปลาย',
  '2-mid': 'ทม.2 กลาง',
  '2-final': 'ทม.2 ปลาย',
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
  const showYear = selectedYearStored !== null && view !== 'year-select';
  const showPhase = selectedPhase && view !== 'phase-select' && view !== 'year-select';
  const savedCount = bookmarks?.length || 0;
  const shortcutLabel = commandShortcutLabel();

  return (
    <header className="vmx-header">
      <div className="vmx-header-context">
        <button
          type="button"
          className="vmx-logo vmx-logo-btn"
          onClick={goHome}
          aria-label="VetMock — หน้าแรก"
        >
          <Wordmark size={22} />
        </button>

        {/* Study context — one control, two axes. Grouping them says "this
            is where you are" instead of reading as two loose buttons. */}
        {(showYear || showPhase) && (
          <div className="vmx-context-group">
            {showYear && (
              <button
                type="button"
                className="vmx-context-pill"
                onClick={() => setView('year-select')}
                aria-label={`สลับชั้นปี — ปัจจุบันปี ${selectedYear}`}
              >
                ปี {selectedYear}
              </button>
            )}
            {showYear && showPhase && <span className="vmx-context-sep" aria-hidden="true" />}
            {showPhase && (
              <button
                type="button"
                className="vmx-context-pill"
                onClick={() => setView('phase-select')}
                aria-label="สลับช่วงสอบ (Phase)"
              >
                {PHASE_PILL_LABELS[selectedPhase] || selectedPhase}
              </button>
            )}
          </div>
        )}
      </div>

      <div className="vmx-header-right">
        <button
          className="vmx-cmdk-btn"
          onClick={() => setPaletteOpen(true)}
          title={`ค้นหาทุกอย่าง (${shortcutLabel})`}
          aria-label="ค้นหา"
        >
          <NavIcon name="search" size={16} />
          <kbd className="vmx-cmdk-kbd">{shortcutLabel}</kbd>
        </button>
        {/* Saved questions — only when there is something saved. A
            permanently-disabled button is clutter, not an affordance. */}
        {savedCount > 0 && (
          <button
            className="vmx-theme-btn vmx-saved-btn"
            onClick={() => {
              setPracticeMode('bookmarks');
              setMode('quick');
              setView('config');
            }}
            title={`ทำข้อที่บันทึกไว้ ${savedCount} ข้อ`}
            aria-label={`ข้อที่บันทึกไว้ ${savedCount} ข้อ`}
          >
            <NavIcon name="bookmark" size={18} />
            <span className="vmx-saved-count">{savedCount}</span>
          </button>
        )}

        {streakData.streak > 0 && (
          <div className={`vmx-streak ${streakData.streak >= 3 ? 'vmx-streak-pulse' : ''}`} title={`ทำข้อสอบติดต่อกัน ${streakData.streak} วัน`}>
            <NavIcon name="flame" size={15} />
            {streakData.streak}
          </div>
        )}
        <Suspense fallback={null}>
          <XpChip />
        </Suspense>

        {user && profile && (
          <UserMenu profile={profile} onLogout={handleSignOut} onGroups={() => setView('groups')} onLeaderboard={() => setView('leaderboard-global')} onAccount={() => setView('account-settings')} />
        )}
        {!user && hasSupabase && (
          <button className="vmx-btn vmx-btn-ghost vmx-btn-sm" onClick={() => setView('auth')}>เข้าสู่ระบบ</button>
        )}
        <ThemePicker theme={theme} setTheme={setTheme} palette={palette} setPalette={setPalette} />
      </div>
    </header>
  );
}
