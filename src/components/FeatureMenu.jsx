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

import { FEATURE_CATEGORIES, featuresByCategory, visibleFeatures } from '../lib/feature-registry.js';

export default function FeatureMenu({
  setView,
  onPractice,
  onSketch,
  onVoiceSettings,
  signedIn = false,
  scaffold = false,
  hasSupabase = true,
}) {
  const dispatch = (inv) => {
    if (!inv) return;
    switch (inv.kind) {
      case 'view': setView?.(inv.view); return;
      case 'practice': onPractice?.(inv); return;
      case 'event': try { window.dispatchEvent(new Event(inv.event)); } catch { /* no-op */ } return;
      case 'sketch': onSketch?.(); return;
      case 'voice': onVoiceSettings?.(); return;
      default: return;
    }
  };

  return (
    <div style={{ marginTop: 28 }}>
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
          { signedIn, scaffold, hasSupabase }
        );
        if (feats.length === 0) return null;
        return (
          <div key={cat.id} style={{ marginBottom: 8 }}>
            <div className="vmx-section-label">
              {cat.icon} {cat.label}
            </div>
            <div className="vmx-mode-grid">
              {feats.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  className="vmx-mode-card"
                  onClick={() => dispatch(f.invoke)}
                  title={f.hint || ''}
                >
                  <div className="icon">{f.icon}</div>
                  <div className="title">{f.label}</div>
                  {f.hint && <div className="sub">{f.hint}</div>}
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
