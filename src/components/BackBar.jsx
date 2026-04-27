// ============================================================
// BackBar — sticky top-left back affordance shared across views
// ============================================================
// Pre-feedback the only "back" was a ghost button at the bottom of
// each view. On long pages (Notes, Schedule, Review) it scrolled
// out of sight and several students said they couldn't find how
// to leave a sub-view.
//
// Drop <BackBar onBack={...} label="..." /> at the top of any
// sub-view to add a chip-sized arrow button that's always near
// the title and stays within thumb reach on mobile.
//
// Use the matching .vmx-back-chip / .vmx-back-bar styles in
// styles.js — they mirror the bottom ghost button so the two
// affordances feel like the same control at different positions.
// ============================================================
export default function BackBar({ onBack, label = 'ย้อนกลับ', subtitle }) {
  if (!onBack) return null;
  return (
    <div className="vmx-back-bar">
      <button type="button" className="vmx-back-chip" onClick={onBack} aria-label={label}>
        <span className="arrow">←</span>
        <span>{label}</span>
      </button>
      {subtitle && (
        <span style={{ fontSize: 12, color: 'var(--clr-ink-soft)', fontStyle: 'italic' }}>
          {subtitle}
        </span>
      )}
    </div>
  );
}
