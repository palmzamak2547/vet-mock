// ============================================================
// BottomNav — mobile primary navigation (<1024px). Renders the SAME
// canonical destinations as the desktop Sidebar (from lib/nav.js) so the
// two never diverge. Hidden on desktop (CSS) and mid-exam (the caller
// gates it with the same !FOCUS_VIEWS check the Sidebar/Header use).
// ============================================================
import React from 'react';
import { NAV_ITEMS, runNav, isNavActive } from '../lib/nav.js';
import NavIcon from './NavIcon.jsx';

export default function BottomNav({ view, handlers }) {
  return (
    <nav className="vmx-bottom-nav" aria-label="เมนูหลัก">
      {NAV_ITEMS.map((item) => {
        const active = isNavActive(item.id, view);
        return (
          <button
            key={item.id}
            type="button"
            className={`vmx-bottom-nav-item ${active ? 'active' : ''}`}
            aria-current={active ? 'page' : undefined}
            onClick={() => runNav(item.id, handlers)}
          >
            {/* The pill behind the icon is the phone-side twin of the
                sidebar's sliding marker: a soft tint that scales in on the
                active row. A real element with pointer-events off, never a
                ::before hit-zone (STABILITY.md rule 1). */}
            <span className="vmx-bottom-nav-icon">
              <span className="vmx-bottom-nav-pill" aria-hidden="true" />
              <NavIcon name={item.icon} />
            </span>
            <span className="vmx-bottom-nav-label">{item.short}</span>
          </button>
        );
      })}
    </nav>
  );
}
