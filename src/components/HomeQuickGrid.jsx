// ============================================================
// HomeQuickGrid — the learn group as an icon grid at the top of Home
// ============================================================
// On a phone there is no rail, so the "เรียน & ทบทวน" destinations (VetWiki,
// the library, the reading list, the timetable, the notes, the pinboard, the
// clips, the atlas, the faculty index) had no persistent place: they sat in
// the feature menu at the bottom of a page that measured eight screens. This
// grid is the rail's second group drawn the way a phone draws its shortcuts
// (the icon grid under the search field that CUNEX, Trip.com and Grab open
// with): the same list, the same owner order and the same line icons as the
// rail, from lib/nav.js, so the two surfaces cannot disagree.
//
// It is CSS-gated to screens without the rail (below 1024px) and the feature
// menu hides its learn group on those screens, so each destination has ONE
// tile on a phone and ONE row on desktop — a consolidation, not a copy.
//
// The hint rides along as the tile's accessible name (visually hidden) so a
// tile is named exactly the way the feature menu's card is, and the owner
// order is applied by lib/nav.js, never here.
// ============================================================

import { useState } from 'react';
import NavIcon from './NavIcon.jsx';
import { FEATURES, visibleFeatures, rememberViewIntent } from '../lib/feature-registry.js';
import { featureLineIcon, splitForQuickGrid, homeMenuGroup, homeMenuVisible } from '../lib/nav.js';

const LIST_ID = 'vmx-quick-grid-list';
// FeatureMenu's heading, rendered on Home below this grid in every state.
const MENU_HEADING_ID = 'vmx-feature-menu-title';

/** The last tile of a super-app grid: everything else lives in the menu below. */
function openAllMenu() {
  if (typeof document === 'undefined') return;
  const heading = document.getElementById(MENU_HEADING_ID);
  if (!heading) return;
  const reduce = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
  heading.scrollIntoView?.({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  heading.setAttribute?.('tabindex', '-1');
  heading.focus?.({ preventScroll: true });
}

export default function HomeQuickGrid({
  setView,
  onPractice,
  signedIn = false,
  scaffold = false,
  hasSupabase = true,
  selectedYear,
  isAdmin = false,
}) {
  const [expanded, setExpanded] = useState(false);
  // Same gating and the same Home policy as the feature menu's learn group
  // (this grid replaces it below 1024px); `rail: false` opts a feature out
  // of every navigation surface (a lesson belongs to its subject page).
  const learn = visibleFeatures(
    FEATURES.filter((f) => homeMenuGroup(f) === 'learn' && f.rail !== false),
    { signedIn, scaffold, hasSupabase, selectedYear, isAdmin },
  ).filter((f) => homeMenuVisible(f, { isAdmin }));
  const { visible, rest } = splitForQuickGrid(learn);
  if (visible.length === 0) return null;
  const shown = expanded ? [...visible, ...rest] : visible;

  const dispatch = (inv) => {
    if (!inv) return;
    switch (inv.kind) {
      case 'view': rememberViewIntent(inv.intent); setView?.(inv.view); return;
      case 'practice': onPractice?.(inv); return;
      default: return;
    }
  };

  return (
    <section className="vmx-quick-grid" aria-label="เรียน & ทบทวน">
      <ul id={LIST_ID} className="vmx-quick-grid-list">
        {shown.map((f) => {
          const icon = featureLineIcon(f.id);
          return (
            <li key={f.id}>
              <button
                type="button"
                className="vmx-quick-tile"
                data-feature={f.id}
                onClick={() => dispatch(f.invoke)}
                title={f.hint || undefined}
              >
                <span className="vmx-quick-tile-icon" aria-hidden="true">
                  {icon ? <NavIcon name={icon} size={22} /> : f.icon}
                </span>
                <span className="vmx-quick-tile-label">{f.label}</span>
                {f.hint && <span className="vmx-sr-only"> {f.hint}</span>}
              </button>
            </li>
          );
        })}
        {rest.length === 0 && (
          <li>
            <button type="button" className="vmx-quick-tile is-more" data-all-menu="" onClick={openAllMenu}>
              <span className="vmx-quick-tile-icon" aria-hidden="true">
                <NavIcon name="more" size={22} />
              </span>
              <span className="vmx-quick-tile-label">เมนูทั้งหมด</span>
            </button>
          </li>
        )}
        {rest.length > 0 && (
          <li>
            <button
              type="button"
              className="vmx-quick-tile is-more"
              aria-expanded={expanded}
              aria-controls={LIST_ID}
              onClick={() => setExpanded((v) => !v)}
            >
              <span className="vmx-quick-tile-icon" aria-hidden="true">
                <NavIcon name={expanded ? 'close' : 'more'} size={22} />
              </span>
              <span className="vmx-quick-tile-label">{expanded ? 'แสดงน้อยลง' : `ดูอีก ${rest.length}`}</span>
            </button>
          </li>
        )}
      </ul>
    </section>
  );
}
