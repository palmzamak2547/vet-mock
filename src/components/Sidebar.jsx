import React from 'react';
import { useAuth } from '../hooks/useAuth.js';
import { hasSupabase, signOut } from '../lib/supabase.js';
import { NAV_ITEMS, runNav, isNavActive } from '../lib/nav.js';
import NavIcon from './NavIcon.jsx';

export default function Sidebar({ view, setView, goHome, setSubject, setPracticeMode, setMode, onMockExam }) {
  const { user, profile } = useAuth();
  const handlers = { setView, goHome, setSubject, setPracticeMode, setMode, onMockExam };

  const handleSignOut = async () => {
    try {
      await signOut();
      window.location.reload();
    } catch {}
  };

  return (
    <aside className="vmx-sidebar">
      <button 
        type="button"
        className="vmx-logo vmx-logo-btn" 
        onClick={goHome}
        style={{ marginBottom: '32px', paddingLeft: '16px', background: 'transparent' }}
      >
        Vet<span>Mock</span><span className="vmx-academy-badge">ACADEMY</span>
      </button>

      <nav className="vmx-sidebar-nav">
        {NAV_ITEMS.map(item => {
          const active = isNavActive(item.id, view);
          return (
            <button
              key={item.id}
              className={`vmx-btn vmx-btn-ghost vmx-sidebar-item ${active ? 'active' : ''}`}
              aria-current={active ? 'page' : undefined}
              onClick={() => runNav(item.id, handlers)}
            >
              <span className="vmx-sidebar-icon"><NavIcon name={item.icon} size={20} /></span>
              <span className="vmx-sidebar-label">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="vmx-sidebar-bottom">
        {user ? (
          <div className="vmx-sidebar-user">
            <span className="vmx-sidebar-username">{profile?.username || user.email?.split('@')[0]}</span>
            <button className="vmx-btn vmx-btn-ghost vmx-btn-sm" onClick={handleSignOut}>
              ออกระบบ
            </button>
          </div>
        ) : hasSupabase ? (
          <button className="vmx-btn vmx-btn-ghost vmx-btn-sm" onClick={() => setView('auth')} style={{ width: '100%' }}>
            เข้าสู่ระบบ
          </button>
        ) : null}
      </div>
    </aside>
  );
}
