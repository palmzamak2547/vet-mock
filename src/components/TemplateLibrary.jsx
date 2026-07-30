// ============================================================
// TemplateLibrary — picker modal for anatomy / diagram templates
// ============================================================
//
// Surfaces a grid of pre-made SVG templates (skeleton outlines,
// heart diagrams, ECG paper, dental charts, lab forms) that the
// user can drop into ImageAnnotator and draw on top of.
//
// Rationale: vet students sketch the same anatomy over and over
// while studying. A blank "draw the dog skeleton" pad means they
// spend more time drawing bones than thinking about pathology.
// These templates give them a working canvas in one tap.
//
// Templates live in /public/templates/*.svg (same-origin → no
// CORS taint when composited onto the annotator canvas).
// ============================================================

import { useEffect } from 'react';

const TEMPLATES = [
  {
    url: '/templates/dog-skeleton.svg',
    title: 'โครงกระดูกสุนัข',
    subtitle: 'Canine skeleton (lateral)',
    category: '🦴 โครงกระดูก',
  },
  {
    url: '/templates/cat-skeleton.svg',
    title: 'โครงกระดูกแมว',
    subtitle: 'Feline skeleton (lateral)',
    category: '🦴 โครงกระดูก',
  },
  {
    url: '/templates/dog-heart-anatomy.svg',
    title: 'หัวใจสุนัข 4 ห้อง',
    subtitle: 'Canine heart — RA/RV/LA/LV',
    category: '❤️ Cardio',
  },
  {
    url: '/templates/kidney-anatomy.svg',
    title: 'ไต — sagittal',
    subtitle: 'Cortex / medulla / pelvis',
    category: '🫘 Renal',
  },
  {
    url: '/templates/ecg-strip.svg',
    title: 'ECG strip เปล่า',
    subtitle: '25 mm/s, 10 mm/mV grid',
    category: 'ECG/Lab',
  },
  {
    url: '/templates/lab-values-blank-template.svg',
    title: 'Lab values',
    subtitle: 'HCT / WBC / BUN / Crea / ALT / ALP / Ca / P',
    category: 'ECG/Lab',
  },
  {
    url: '/templates/dental-chart-dog.svg',
    title: 'Dental chart สุนัข',
    subtitle: 'Triadan 101–110 / 201–210 / 301–311 / 401–411',
    category: '🦷 ทันตกรรม',
  },
  {
    url: '/templates/dental-chart-cat.svg',
    title: 'Dental chart แมว',
    subtitle: 'Triadan 101–109 / 201–209 / 301–309 / 401–409',
    category: '🦷 ทันตกรรม',
  },
];

export default function TemplateLibrary({ onPick, onClose }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div
      className="vmx-modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-label="คลัง template — anatomy / diagram"
    >
      <div
        className="vmx-modal"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: 900,
          width: 'min(900px, calc(100vw - 24px))',
          maxHeight: 'min(90vh, calc(100dvh - 24px))',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div style={{ marginBottom: 12 }}>
          <div
            style={{
              fontSize: 11,
              fontFamily: 'JetBrains Mono, monospace',
              color: 'var(--clr-ink-soft)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
            }}
          >
            🩻 Template library
          </div>
          <h2 style={{ margin: '4px 0 0', fontSize: 20 }}>เลือก template เพื่อวาดทับ</h2>
          <p style={{ margin: '6px 0 0', fontSize: 13, color: 'var(--clr-ink-soft)', lineHeight: 1.5 }}>
            แต่ละ template เป็น outline เปล่า — เปิดในกระดานวาด แล้วทำ label / mark lesion / hatch
            anatomy ได้ตามต้องการ
          </p>
        </div>

        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            paddingRight: 4,
            marginRight: -4,
            WebkitOverflowScrolling: 'touch',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
              gap: 12,
            }}
          >
            {TEMPLATES.map((t) => (
              <button
                key={t.url}
                type="button"
                onClick={() => {
                  onPick?.(t.url);
                  onClose?.();
                }}
                style={{
                  all: 'unset',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
                  padding: 12,
                  minHeight: 44,
                  borderRadius: 12,
                  background: 'var(--clr-surface)',
                  border: '1px solid var(--clr-border)',
                  transition: 'transform 0.12s, border-color 0.12s',
                  boxSizing: 'border-box',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--clr-rose)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--clr-border)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div
                  style={{
                    width: '100%',
                    aspectRatio: '4 / 5',
                    background: '#ffffff',
                    borderRadius: 8,
                    border: '1px solid var(--clr-border)',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <img
                    src={t.url}
                    alt={t.title}
                    loading="lazy"
                    style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
                  />
                </div>
                <div>
                  <div
                    style={{
                      fontSize: 10,
                      fontFamily: 'JetBrains Mono, monospace',
                      color: 'var(--clr-ink-soft)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                      marginBottom: 4,
                    }}
                  >
                    {t.category}
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.3 }}>{t.title}</div>
                  <div
                    style={{
                      fontSize: 11,
                      color: 'var(--clr-ink-soft)',
                      fontStyle: 'italic',
                      marginTop: 2,
                      lineHeight: 1.3,
                    }}
                  >
                    {t.subtitle}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="vmx-btn-row" style={{ marginTop: 12 }}>
          <button className="vmx-btn vmx-btn-ghost" onClick={onClose} type="button">
            ปิด (esc)
          </button>
        </div>
      </div>
    </div>
  );
}
