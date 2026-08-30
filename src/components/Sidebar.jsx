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
//  • The icon lives in a fixed-width slot, so labels share a left edge too.
//
//  • The active row was a bordered pill that read as a different component
//    from its neighbours. It is now a soft tint plus one accent marker that
//    SLIDES between rows.
//
// ── Why there is a second group ─────────────────────────────────────────
// The rail listed 5 destinations. The app registers 34 features, and the
// "learn" category alone holds 8 — including a 1,496-document library and
// 400 video summaries — none of which had any persistent navigation. They
// were reachable only from the Home grid, the tools button, or ⌘K, which
// means a student who does not already know they exist never finds them.
// The empty lower half was not a decoration problem; it was an unused
// navigation surface.
//
// The group is DERIVED from feature-registry, never hand-listed, so it
// cannot drift from the tools menu or the command palette, and it inherits
// the same auth / scaffold-year / feature-flag gating those surfaces use.
//
// Duplicates are excluded by rule rather than by taste: any learn feature
// whose destination is already a primary row is dropped. That removes
// VetWiki (already above) and "สรุปบทเรียน", whose registry entry points at
// the subject picker — the same screen "ฝึกข้อสอบ" opens. Listing both
// would put two rows next to each other that go to the same place. Wiring
// notes to open notes directly is a product change, not a nav change, so it
// is not smuggled in here.
// ============================================================

import React from 'react';
import { NAV_ITEMS, runNav, isNavActive } from '../lib/nav.js';
import { featuresByCategory, visibleFeatures } from '../lib/feature-registry.js';
import { LATEST_CHANGELOG } from '../data/changelog.js';
import NavIcon from './NavIcon.jsx';
import Wordmark from './Wordmark.jsx';

export default function Sidebar({
  view, setView, goHome, setSubject, setPracticeMode, setMode, onMockExam,
  signedIn = false, hasSupabase = true, scaffold = false, selectedYear,
}) {
  const handlers = { setView, goHome, setSubject, setPracticeMode, setMode, onMockExam };
  const activeIndex = NAV_ITEMS.findIndex((item) => isNavActive(item.id, view));

  // The rail draws line icons, not emoji — a decision made when the mobile
  // bottom bar was built and one this group has to keep, or the two halves
  // of the same list would speak two visual languages. Anything not mapped
  // falls back to the registry's emoji, so a newly registered learn feature
  // still appears instead of vanishing.
  const LINE_ICON = {
    videos: 'video',
    faculty: 'users',
    'reading-checklist': 'bookmark',
    schedule: 'calendar',
    pinboard: 'pin',
    library: 'files',
  };

  // Destinations the primary rows already own — see the note above.
  const primaryViews = new Set(NAV_ITEMS.map((item) => (item.id === 'wiki' ? 'knowledge' : item.id)));
  const learn = visibleFeatures(featuresByCategory('learn'), {
    signedIn, hasSupabase, scaffold, selectedYear,
  }).filter((f) => f.invoke?.kind === 'view' && !primaryViews.has(f.invoke.view));

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

        {learn.length > 0 && (
          <>
            <p className="vmx-sidebar-heading vmx-sidebar-heading-2">เรียน &amp; ทบทวน</p>
            <div className="vmx-sidebar-list">
              {learn.map((f) => {
                const active = view === f.invoke.view;
                return (
                  <button
                    key={f.id}
                    type="button"
                    className={`vmx-nav-row is-secondary${active ? ' is-active' : ''}`}
                    aria-current={active ? 'page' : undefined}
                    title={f.hint || undefined}
                    onClick={() => setView(f.invoke.view)}
                  >
                    <span className="vmx-sidebar-icon" aria-hidden="true">
                      {LINE_ICON[f.id]
                        ? <NavIcon name={LINE_ICON[f.id]} size={17} />
                        : f.icon}
                    </span>
                    <span className="vmx-sidebar-label">{f.label}</span>
                  </button>
                );
              })}
            </div>
          </>
        )}
      </nav>

      <div className="vmx-sidebar-foot">
        <span className="vmx-sidebar-version">v{LATEST_CHANGELOG.version}</span>
      </div>
    </aside>
  );
}
