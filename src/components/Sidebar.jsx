import React from 'react';
import { NAV_ITEMS, runNav, isNavActive } from '../lib/nav.js';
import NavIcon from './NavIcon.jsx';
import Wordmark from './Wordmark.jsx';

export default function Sidebar({ view, setView, goHome, setSubject, setPracticeMode, setMode, onMockExam }) {
  const handlers = { setView, goHome, setSubject, setPracticeMode, setMode, onMockExam };

  return (
    <aside className="vmx-sidebar">
      <button 
        type="button"
        className="vmx-logo vmx-logo-btn vmx-sidebar-brand"
        onClick={goHome}
        aria-label="VetMock — หน้าแรก"
      >
        <Wordmark size={24} />
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

    </aside>
  );
}
