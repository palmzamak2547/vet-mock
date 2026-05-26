// ============================================================
// UserMenu — profile pill with click-outside dropdown
// ============================================================
// Renders the logged-in user's avatar + username pill in the header.
// Click → opens a dropdown with Groups · Leaderboard · Logout.
//
// Extracted from App.jsx 2026-05-24 to slim the App monolith down.
// Same viewport-aware anchor logic as ThemePicker — see
// useDropdownAnchor hook + STABILITY.md rule 11.
// ============================================================

import { useState, useEffect, useRef } from 'react';
import { useDropdownAnchor } from '../hooks/useDropdownAnchor.js';

export default function UserMenu({ profile, onLogout, onGroups, onLeaderboard }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const USER_MENU_W = 200;
  const anchorSide = useDropdownAnchor(ref, open, USER_MENU_W);

  useEffect(() => {
    if (!open) return;
    const handle = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    const handleEsc = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', handle);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handle);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [open]);

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-haspopup="menu"
        style={{
          all: 'unset', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
          padding: '6px 12px 6px 6px', borderRadius: 999,
          background: open ? 'var(--clr-surface-2)' : 'var(--clr-surface)',
          border: '1px solid var(--clr-border)',
          fontSize: 13, fontWeight: 600,
          color: 'var(--clr-ink)',
          transition: 'background 0.12s',
        }}
      >
        <span style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--clr-surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>
          {profile.avatar_emoji || '🐾'}
        </span>
        <span style={{ maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {profile.username}
        </span>
        <span style={{ fontSize: 10, color: 'var(--clr-ink-soft)' }}>{open ? '▴' : '▾'}</span>
      </button>

      {open && (
        <div role="menu" style={{
          position: 'absolute', top: 'calc(100% + 6px)',
          ...(anchorSide === 'left' ? { left: 0 } : { right: 0 }),
          background: 'var(--clr-surface)', border: '1px solid var(--clr-border)',
          borderRadius: 12, boxShadow: 'var(--shadow-md)',
          minWidth: USER_MENU_W, maxWidth: 'calc(100vw - 24px)',
          padding: 6, zIndex: 20,
        }}>
          <div style={{ padding: '8px 12px', borderBottom: '1px solid var(--clr-border)', marginBottom: 4 }}>
            <div style={{ fontSize: 11, fontFamily: 'JetBrains Mono, monospace', color: 'var(--clr-ink-soft)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Signed in as
            </div>
            <div style={{ fontSize: 14, fontWeight: 600, marginTop: 2 }}>
              {profile.avatar_emoji || '🐾'} {profile.username}
            </div>
          </div>
          {onGroups && (
            <MenuItem icon="👥" onClick={() => { setOpen(false); onGroups(); }}>Study Groups</MenuItem>
          )}
          {onLeaderboard && (
            <MenuItem icon="🏆" onClick={() => { setOpen(false); onLeaderboard(); }}>Leaderboard</MenuItem>
          )}
          <div style={{ height: 1, background: 'var(--clr-border)', margin: '4px 0' }} />
          <MenuItem icon="⎋" danger onClick={() => {
            setOpen(false);
            if (confirm('ออกจากระบบ?')) onLogout();
          }}>ออกจากระบบ (Logout)</MenuItem>
        </div>
      )}
    </div>
  );
}

function MenuItem({ icon, children, onClick, danger }) {
  return (
    <button
      role="menuitem"
      onClick={onClick}
      style={{
        all: 'unset', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10,
        width: '100%', boxSizing: 'border-box', padding: '8px 12px',
        borderRadius: 8, fontSize: 13,
        color: danger ? 'var(--clr-rose)' : 'var(--clr-ink)',
        transition: 'background 0.1s',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--clr-surface-2)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
    >
      <span style={{ fontSize: 14 }}>{icon}</span>
      <span>{children}</span>
    </button>
  );
}
