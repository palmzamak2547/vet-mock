// ============================================================
// Sidebar — the desktop left rail
// ============================================================
// Rebuilt 2026-08-30. What was wrong was not the taste, it was the craft:
//
//  • Rows were built out of `.vmx-btn`, which sets `justify-content: center`
//    800 lines further down styles.css. `.vmx-sidebar-item` declared
//    `flex-start` at equal specificity, so source order silently won and
//    every icon sat at a different x — measured spread 14px across five
//    rows, with the brand on a sixth alignment. The intent was written down
//    and simply never reached the screen. Rows now have their own class and
//    inherit nothing from the button system, so that fight cannot restart.
//
//  • The icon now lives in a fixed-width slot, so labels share a left edge
//    too — not just the icons.
//
//  • The active row was a bordered pill that read as a different component
//    from its neighbours. It is now a soft tint plus one accent marker that
//    SLIDES between rows, which is also the bit of life the rail was
//    missing. One element, one transform, compositor-only.
//
// The 494px of empty space below the nav is closed with craft, not filler.
// Streak, XP, search and the year/phase control all live in the header
// already; repeating them here would duplicate state that must then agree —
// the exact class of bug this app spent a day removing. The foot carries the
// version only, which anchors the column and cannot disagree with anything.
// ============================================================

import React from 'react';
import { NAV_ITEMS, runNav, isNavActive } from '../lib/nav.js';
import { LATEST_CHANGELOG } from '../data/changelog.js';
import NavIcon from './NavIcon.jsx';
import Wordmark from './Wordmark.jsx';

export default function Sidebar({ view, setView, goHome, setSubject, setPracticeMode, setMode, onMockExam }) {
  const handlers = { setView, goHome, setSubject, setPracticeMode, setMode, onMockExam };
  const activeIndex = NAV_ITEMS.findIndex((item) => isNavActive(item.id, view));

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

      <nav className="vmx-sidebar-nav" aria-label="เมนูหลัก">
        <p className="vmx-sidebar-heading">เมนู</p>
        {/* The marker is positioned from --vmx-nav-active, so the row
            geometry below is the single source for where it lands.
            'โหมดสอบ' is an action that ends up on the config view, so it has
            no persistent active row — the marker hides rather than lying. */}
        <div
          className="vmx-sidebar-list vmx-stagger"
          style={activeIndex >= 0 ? { '--vmx-nav-active': activeIndex } : undefined}
        >
          {activeIndex >= 0 && <span className="vmx-sidebar-marker" aria-hidden="true" />}
          {NAV_ITEMS.map((item) => {
            const active = isNavActive(item.id, view);
            return (
              <button
                key={item.id}
                type="button"
                className={`vmx-nav-row${active ? ' is-active' : ''}`}
                aria-current={active ? 'page' : undefined}
                onClick={() => runNav(item.id, handlers)}
              >
                <span className="vmx-sidebar-icon"><NavIcon name={item.icon} size={20} /></span>
                <span className="vmx-sidebar-label">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      <div className="vmx-sidebar-foot">
        <span className="vmx-sidebar-version">v{LATEST_CHANGELOG.version}</span>
      </div>
    </aside>
  );
}
