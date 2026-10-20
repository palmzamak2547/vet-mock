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
//
// ── Which rows, in which order (2026-10-12) ─────────────────────────────
// The group used to rank itself by how often this student opened each
// destination. The owner's review of 5.141.6 starred four of them for the
// first level — VetWiki, คลังเอกสาร, รายการอ่าน, ตารางเรียน & สอบ — and
// crossed Atlas, the clips and the faculty index out of it (not out of the
// app). A starred, fixed list beats a per-student ranking here: the rows
// stay where the hand learned them, and the order is one the owner chose.
// The order and the overflow split live in lib/nav.js, which the phone's
// quick grid reads too, so the two surfaces show one list.
// ============================================================

import React, { useState } from 'react';
import { NAV_ITEMS, navItemsFor, runNav, isNavActive, splitLearnForRail, featureLineIcon } from '../lib/nav.js';
import { featuresByCategory, visibleFeatures } from '../lib/feature-registry.js';
import { LATEST_CHANGELOG } from '../data/latest-changelog.generated.js';
import NavIcon from './NavIcon.jsx';
import Wordmark from './Wordmark.jsx';
import Mochi from './Mochi.jsx';

export default function Sidebar({
  view, setView, goHome, setSubject, setPracticeMode, setMode, onMockExam,
  signedIn = false, hasSupabase = true, scaffold = false, selectedYear,
}) {
  // The overflow row reveals the rest of the learn group in place; the search
  // palette is a different tool and stays on its own button.
  const [expanded, setExpanded] = useState(false);
  const handlers = { setView, goHome, setSubject, setPracticeMode, setMode, onMockExam };
  // The rail's own slice of the one list; the marker's row index comes from
  // this slice, so it lands on the row that is actually drawn.
  const railItems = navItemsFor('rail');
  const activeIndex = railItems.findIndex((item) => isNavActive(item.id, view));

  // Destinations the primary rows already own. 'profile' is one of the
  // canonical nav items now, so it drops out of the learn group by the same
  // rule; VetWiki ('knowledge') is no longer a primary row — it moved out of
  // the bottom bar into the profile hub — so it belongs back in this group
  // rather than disappearing from the rail entirely.
  const primaryViews = new Set(NAV_ITEMS.map((item) => item.id));
  const learnAll = visibleFeatures(featuresByCategory('learn'), {
    signedIn, hasSupabase, scaffold, selectedYear,
  }).filter((f) => f.invoke?.kind === 'view'
    && !primaryViews.has(f.invoke.view)
    // A feature can opt out of the rail. Lessons do: they belong to one
    // subject and one year, and the rail is the same list for everybody.
    && f.rail !== false);

  // The rail is a shortcut list, not a site map — the palette is the site
  // map. The starred rows are the list; everything else is one row away.
  const { visible: learn, rest: learnRest } = splitLearnForRail(learnAll);

  const renderLearnRow = (f) => {
    const active = view === f.invoke.view;
    // The rail draws line icons, not emoji — a decision made when
    // the mobile bottom bar was built and one this group has to
    // keep, or the two halves of the same list would speak two
    // visual languages. Anything not mapped falls back to the
    // registry's emoji, so a newly registered learn feature still
    // appears instead of vanishing.
    const icon = featureLineIcon(f.id);
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
          {icon ? <NavIcon name={icon} size={17} /> : f.icon}
        </span>
        <span className="vmx-sidebar-label">{f.label}</span>
      </button>
    );
  };

  return (
    <aside className="vmx-sidebar">
      <button
        type="button"
        className="vmx-logo vmx-logo-btn vmx-sidebar-brand"
        onClick={goHome}
        aria-label="VetMock — หน้าแรก"
      >
        <Wordmark size={24} cycle />
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
          {railItems.map((item) => {
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
              {learn.map(renderLearnRow)}
              {expanded && learnRest.map(renderLearnRow)}
              {learnRest.length > 0 && (
                <button
                  type="button"
                  className="vmx-nav-row is-secondary vmx-sidebar-more"
                  aria-expanded={expanded}
                  title={expanded ? undefined : learnRest.map((f) => f.label).join(', ')}
                  onClick={() => setExpanded((open) => !open)}
                >
                  <span className="vmx-sidebar-icon" aria-hidden="true"><NavIcon name="more" size={17} /></span>
                  <span className="vmx-sidebar-label">{expanded ? 'แสดงน้อยลง' : 'ทั้งหมด'}</span>
                  {!expanded && <span className="vmx-sidebar-count" aria-hidden="true">+{learnRest.length}</span>}
                </button>
              )}
            </div>
          </>
        )}
      </nav>

      <div className="vmx-sidebar-foot">
        <span className="vmx-sidebar-version">v{LATEST_CHANGELOG.version}</span>
        <Mochi size={36} slot="chrome" />
      </div>
    </aside>
  );
}
