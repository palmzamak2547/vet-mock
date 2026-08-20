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
import { confirmDialog } from '../lib/dialog.js';
import NavIcon from './NavIcon.jsx';

export default function UserMenu({ profile, onLogout, onGroups, onLeaderboard, onAccount }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const triggerRef = useRef(null);
  const USER_MENU_W = 200;
  const anchorSide = useDropdownAnchor(ref, open, USER_MENU_W);

  useEffect(() => {
    if (!open) return;
    const handle = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    const handleEsc = (e) => {
      if (e.key !== 'Escape') return;
      setOpen(false);
      triggerRef.current?.focus();
    };
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
        ref={triggerRef}
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={`บัญชี ${profile.username}`}
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
        <span style={{ fontSize: 11, color: 'var(--clr-ink-soft)' }}>{open ? '▴' : '▾'}</span>
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
          {/* The header block doubles as the way into the profile — it is
              already the thing showing your name and avatar, so it is where
              people reach for to change them. */}
          {onAccount ? (
            <button
              type="button" role="menuitem"
              onClick={() => { setOpen(false); onAccount(); }}
              style={{
                all: 'unset', boxSizing: 'border-box', cursor: 'pointer', display: 'block', width: '100%',
                padding: '8px 12px', borderBottom: '1px solid var(--clr-border)', marginBottom: 4, borderRadius: 8,
              }}
            >
              <div style={{ fontSize: 11, fontFamily: 'var(--vmx-mono)', color: 'var(--clr-ink-soft)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                บัญชีของคุณ
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, fontWeight: 600, marginTop: 2 }}>
                <span style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {profile.avatar_emoji || '🐾'} {profile.username}
                </span>
                <span aria-hidden="true" style={{ color: 'var(--clr-ink-soft)', fontSize: 12 }}>›</span>
              </div>
              <div style={{ fontSize: 11, color: 'var(--clr-ink-soft)', marginTop: 3 }}>ดูและแก้ไขโปรไฟล์</div>
            </button>
          ) : (
            <div style={{ padding: '8px 12px', borderBottom: '1px solid var(--clr-border)', marginBottom: 4 }}>
              <div style={{ fontSize: 11, fontFamily: 'var(--vmx-mono)', color: 'var(--clr-ink-soft)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                บัญชีของคุณ
              </div>
              <div style={{ fontSize: 14, fontWeight: 600, marginTop: 2 }}>
                {profile.avatar_emoji || '🐾'} {profile.username}
              </div>
            </div>
          )}
          {onGroups && (
            <MenuItem icon="users" onClick={() => { setOpen(false); onGroups(); }}>กลุ่มติว</MenuItem>
          )}
          {onLeaderboard && (
            <MenuItem icon="trophy" onClick={() => { setOpen(false); onLeaderboard(); }}>อันดับคะแนน</MenuItem>
          )}
          {/* Until now the only route to this screen was the ⌘K palette — a
              shortcut most students never learn and cannot press on a phone.
              Everything about an account lives behind it: profile, password,
              passkeys, sign-out-everywhere, export, delete. */}
          <div style={{ height: 1, background: 'var(--clr-border)', margin: '4px 0' }} />
          <MenuItem icon="logout" danger onClick={async () => {
            setOpen(false);
            if (await confirmDialog({ title: 'ออกจากระบบ?', confirmLabel: 'ออกจากระบบ' })) onLogout();
          }}>ออกจากระบบ</MenuItem>
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
        color: danger ? 'var(--clr-rose-text)' : 'var(--clr-ink)',
        transition: 'background 0.1s',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--clr-surface-2)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
    >
      <NavIcon name={icon} size={17} />
      <span>{children}</span>
    </button>
  );
}
