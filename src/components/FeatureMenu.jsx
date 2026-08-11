// ============================================================
// FeatureMenu — categorized feature grid for HomeView
// ============================================================
// Renders the app's features grouped under the 4 categories from the
// feature registry. Replaces what used to be a sprawl of scattered
// HomeView sections ("เครื่องมือปีX" row + footer text-links + a
// "บัญชี + ชุมชน" row) that grew รก as features piled up. One registry
// → this grid AND the ⌘K palette, so the two never drift.
//
// The 3 PRIMARY study modes (Quick / Exam / SR) stay as HomeView's
// hero cards above this menu, so we hide primary features here to avoid
// duplication — this menu is "everything else, organized".
//
// Invoke dispatch mirrors CommandPalette.runItem so behaviour is
// identical whether the user taps a card here or hits it via search.
// ============================================================

import { useState } from 'react';
import { FEATURE_CATEGORIES, featuresByCategory, visibleFeatures } from '../lib/feature-registry.js';
import { commandShortcutLabel } from '../lib/nav.js';

const PREVIEW_LIMIT = 4;

export default function FeatureMenu({
  setView,
  onPractice,
  onSketch,
  onVoiceSettings,
  signedIn = false,
  scaffold = false,
  hasSupabase = true,
  selectedYear,
}) {
  const [expanded, setExpanded] = useState({});
  const shortcutLabel = commandShortcutLabel();
  const dispatch = (inv) => {
    if (!inv) return;
    switch (inv.kind) {
      case 'view': setView?.(inv.view); return;
      case 'practice': onPractice?.(inv); return;
      case 'event': try { window.dispatchEvent(new Event(inv.event)); } catch { /* no-op */ } return;
      case 'sketch': onSketch?.(); return;
      case 'voice': onVoiceSettings?.(); return;
      case 'external': if (inv.url) window.location.assign(inv.url); return;
      default: return;
    }
  };

  return (
    <section className="vmx-feature-menu" aria-labelledby="vmx-feature-menu-title">
      <div className="vmx-feature-menu-intro">
        <div>
          <h2 id="vmx-feature-menu-title">สำรวจเครื่องมือ</h2>
          <p>เมนูรองจัดเป็นหมวด — เปิดดูเพิ่มเมื่อจำเป็น</p>
        </div>
        <span className="vmx-feature-menu-hint">ค้นหาเร็วด้วย <kbd>{shortcutLabel}</kbd></span>
      </div>
      {FEATURE_CATEGORIES.map((cat) => {
        // Skip 'practice' — HomeView's hero section already owns the
        // "📝 ฝึก & สอบ" label (Quick / Exam / SR), and Race has its own
        // chip near the daily-Q row. Rendering practice here too would put
        // a SECOND "📝 ฝึก & สอบ" header on the page when signed in (race +
        // review-queue are the only non-primary practice features, both
        // auth-gated). They stay in the registry so ⌘K still finds them.
        if (cat.id === 'practice') return null;
        // Hide primary (hero) features here — they're shown above. Then
        // apply auth/scaffold/backend visibility so we don't render
        // dead cards (e.g. Leaderboard when signed out).
        const feats = visibleFeatures(
          featuresByCategory(cat.id).filter((f) => !f.primary),
          { signedIn, scaffold, hasSupabase, selectedYear }
        );
        if (feats.length === 0) return null;
        const isExpanded = Boolean(expanded[cat.id]);
        const shown = isExpanded ? feats : feats.slice(0, PREVIEW_LIMIT);
        const hiddenCount = Math.max(0, feats.length - PREVIEW_LIMIT);
        const gridId = `vmx-feature-grid-${cat.id}`;
        return (
          <section key={cat.id} className="vmx-feature-group" aria-labelledby={`${gridId}-title`}>
            <div className="vmx-feature-group-heading">
              <h3 id={`${gridId}-title`}><span aria-hidden>{cat.icon}</span> {cat.label}</h3>
              <span>{feats.length} รายการ</span>
            </div>
            <div id={gridId} className="vmx-feature-grid">
              {shown.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  className="vmx-feature-card"
                  onClick={() => dispatch(f.invoke)}
                  title={f.hint || ''}
                >
                  <span className="vmx-feature-card-icon" aria-hidden>{f.icon}</span>
                  <span className="vmx-feature-card-copy">
                    <span className="vmx-feature-card-title">{f.label}</span>
                    {f.hint && <span className="vmx-feature-card-sub">{f.hint}</span>}
                  </span>
                  <span className="vmx-feature-card-arrow" aria-hidden>›</span>
                </button>
              ))}
            </div>
            {hiddenCount > 0 && (
              <button
                type="button"
                className="vmx-feature-more"
                aria-expanded={isExpanded}
                aria-controls={gridId}
                onClick={() => setExpanded((current) => ({ ...current, [cat.id]: !isExpanded }))}
              >
                {isExpanded ? 'แสดงน้อยลง' : `ดูอีก ${hiddenCount} รายการ`}
                <span aria-hidden>{isExpanded ? ' ↑' : ' ↓'}</span>
              </button>
            )}
          </section>
        );
      })}
    </section>
  );
}
