import { useState } from 'react';
import { YEARS, SUBJECTS_BY_YEAR } from '../data/curriculum.js';
// Use precomputed counts (Phase 2 perf) — this view never reads Q
// content, only renders "ปี 4 · 2,012 ข้อ" style labels. The lightweight
// q-counts.js (~1 KB) replaces a static QB import that would have
// dragged every per-subject Q chunk into this view's load graph.
import { Q_COUNTS_BY_SUBJECT, Q_COUNTS_BY_YEAR } from '../data/q-counts.js';
import { detectCurrentPhase } from './PhaseSelectView.jsx';

// ──────────────────────────────────────────────────────────────
// YearSelectView — first-time front door for VetMock.
//
// Design choice (2026-05-12): the LIVE year (currently Vet 86 = ปี 4)
// is the only year with real data. Listing 5 dim placeholder rows on
// the first screen pollutes the user's first impression — and the
// double-stamp ("รอเติม" + "PREVIEW") is noise that says the same
// thing twice. New layout:
//   • LIVE year: single big primary card. Most users tap this.
//   • Other years: collapsed behind a small "ดูชั้นปีอื่น" expander.
// ──────────────────────────────────────────────────────────────

export default function YearSelectView({ goHome, selectedYear, setSelectedYear, setSelectedPhase, setView, firstTime = false }) {
  const [showAll, setShowAll] = useState(false);
  const liveYears = YEARS.filter((y) => !y.scaffold);
  const scaffoldYears = YEARS.filter((y) => y.scaffold);
  const liveQCount = liveYears.reduce((s, y) => s + (Q_COUNTS_BY_YEAR[y.id] || 0), 0);

  const goToYear = (y) => {
    setSelectedYear(y.id);
    // Y6 is block-based (rotation) → skip phase picker.
    if (y.id === 6) {
      if (setSelectedPhase) setSelectedPhase(null);
      setView('home');
    } else {
      if (setSelectedPhase) setSelectedPhase(detectCurrentPhase());
      setView(y.scaffold ? 'home' : 'phase-select');
    }
  };

  return (
    <>
      <div className="vmx-hero">
        {firstTime ? (
          <h1>เลือก <em>ชั้นปี</em></h1>
        ) : (
          <h1>เปลี่ยน <em>ชั้นปี</em></h1>
        )}
        <p>ปี 4 (Vet 86) เปิดเต็ม · ปีอื่นวางโครงรอเติมเนื้อหา</p>
      </div>

      {/* LIVE year cards — primary CTA */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
        {liveYears.map((y) => {
          const subjectCount = (SUBJECTS_BY_YEAR[y.id] || []).length;
          // Show STRICT year count + breakdown of cross-rotation Qs so the
          // year-pick count matches what HomeView shows when the user lands.
          // Counting `q.year === y.id` alone misses VCA (cross-species) +
          // any subject not strictly year-tagged. Each shown explicitly.
          // (Q_COUNTS_BY_YEAR is precomputed by regen-q-counts.mjs.)
          const qCount = Q_COUNTS_BY_YEAR[y.id] || 0;
          const vcaCount = Q_COUNTS_BY_SUBJECT['vca'] || 0;
          const totalCount = qCount + vcaCount;
          const isPicked = selectedYear === y.id && !firstTime;
          return (
            <button
              key={y.id}
              className="vmx-mode-card"
              onClick={() => goToYear(y)}
              style={{
                borderColor: isPicked ? 'var(--clr-sage)' : 'var(--clr-sage)',
                borderWidth: 2,
                background: isPicked ? 'rgba(74, 107, 74, 0.05)' : 'var(--clr-surface)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ fontSize: 40, lineHeight: 1 }}>🎓</div>
                <div style={{ flex: 1, textAlign: 'left' }}>
                  <div style={{ fontFamily: 'Fraunces, serif', fontWeight: 600, fontSize: 22, letterSpacing: '-0.015em', display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' }}>
                    <span>{y.label}</span>
                    <span style={{ fontSize: 11, fontFamily: 'JetBrains Mono, monospace', color: 'var(--clr-sage)', fontWeight: 700, letterSpacing: '0.08em', padding: '2px 8px', borderRadius: 999, background: 'rgba(74, 107, 74, 0.12)' }}>
                      LIVE
                    </span>
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--clr-ink-soft)', marginTop: 4 }}>
                    {y.desc}
                  </div>
                  <div style={{ marginTop: 8, fontSize: 11, fontFamily: 'JetBrains Mono, monospace', color: 'var(--clr-ink-soft)', letterSpacing: '0.04em' }}>
                    {totalCount.toLocaleString()} ข้อ · {subjectCount} วิชา
                    {vcaCount > 0 && (
                      <span style={{ marginLeft: 6, opacity: 0.7 }}>
                        ({qCount.toLocaleString()} ปี {y.id} + {vcaCount} VCA)
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Other years — collapsed behind a single toggle so they don't
          dominate the front door. New users almost always want the
          LIVE year. Expander reveals all scaffold years (PREVIEW). */}
      {scaffoldYears.length > 0 && (
        <>
          <button
            type="button"
            onClick={() => setShowAll((v) => !v)}
            style={{
              all: 'unset',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 14px',
              borderRadius: 10,
              background: 'var(--clr-surface)',
              border: '1px solid var(--clr-border)',
              fontSize: 13,
              color: 'var(--clr-ink-soft)',
              fontFamily: 'inherit',
              width: '100%',
              boxSizing: 'border-box',
              marginBottom: showAll ? 10 : 0,
            }}
            aria-expanded={showAll}
          >
            <span style={{ fontSize: 14 }}>{showAll ? '▾' : '▸'}</span>
            <span style={{ flex: 1 }}>
              ดูชั้นปีอื่น
              <span style={{ marginLeft: 8, fontSize: 11, fontFamily: 'JetBrains Mono, monospace', opacity: 0.6 }}>
                {scaffoldYears.length} ปี · รอเติม
              </span>
            </span>
          </button>
          {showAll && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 8, marginBottom: 16 }}>
              {scaffoldYears.map((y) => {
                const subjectCount = (SUBJECTS_BY_YEAR[y.id] || []).length;
                return (
                  <button
                    key={y.id}
                    onClick={() => goToYear(y)}
                    style={{
                      all: 'unset',
                      cursor: 'pointer',
                      padding: '12px 14px',
                      borderRadius: 12,
                      background: 'var(--clr-surface)',
                      border: '1px dashed var(--clr-border)',
                      opacity: 0.85,
                      fontFamily: 'inherit',
                    }}
                  >
                    <div style={{ fontSize: 18, marginBottom: 4 }}>🎓 {y.label}</div>
                    <div style={{ fontSize: 11, color: 'var(--clr-ink-soft)', lineHeight: 1.4 }}>
                      {y.desc}
                    </div>
                    <div style={{ marginTop: 6, fontSize: 10, fontFamily: 'JetBrains Mono, monospace', color: 'var(--clr-gold)', letterSpacing: '0.05em' }}>
                      {subjectCount} วิชา · รอเติม
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </>
      )}

      {!firstTime && (
        <div className="vmx-btn-row" style={{ marginTop: 16 }}>
          <button className="vmx-btn vmx-btn-ghost" onClick={goHome}>← หน้าแรก</button>
        </div>
      )}

      {firstTime && (
        <div style={{ marginTop: 20, padding: 12, borderRadius: 10, background: 'var(--clr-surface-2)', fontSize: 12, color: 'var(--clr-ink-soft)', textAlign: 'center', lineHeight: 1.55 }}>
          💡 ระบบจะจำให้ — ครั้งต่อไปเข้าหน้า dashboard เลย · เปลี่ยนปีได้ผ่านปุ่ม <strong>🎓 ปี N</strong> มุมบนซ้าย
        </div>
      )}
    </>
  );
}
