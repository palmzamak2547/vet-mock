import React from 'react';
import { useAuth } from '../hooks/useAuth.js';
import { hasSupabase, signOut } from '../lib/supabase.js';

export default function Sidebar({ view, setView, goHome, setSubject, setPracticeMode, setMode, onMockExam }) {
  const { user, profile } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      window.location.reload();
    } catch {}
  };

  const navItems = [
    { id: 'home', label: 'เรียนรู้', icon: '🏠' },
    { id: 'subject-select', label: 'ฝึกข้อสอบ', icon: '🎯' },
    { id: 'mock-exam', label: 'Mock Exam', icon: '⏱️' },
    { id: 'dashboard', label: 'ความคืบหน้า', icon: '📊' },
    { id: 'wiki', label: 'Wiki', icon: '📖' },
  ];

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
        {navItems.map(item => {
          const isActive = view === item.id || (item.id === 'subject-select' && view === 'topic-select');
          return (
            <button
              key={item.id}
              className={`vmx-btn vmx-btn-ghost vmx-sidebar-item ${isActive ? 'active' : ''}`}
              onClick={() => {
                if (item.id === 'mock-exam') { onMockExam && onMockExam(); return; }
                if (item.id === 'subject-select') {
                  setSubject('all');
                  setPracticeMode('all');
                  setMode('quick');
                }
                setView(item.id);
              }}
            >
              <span className="vmx-sidebar-icon" aria-hidden="true">{item.icon}</span>
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
