// ============================================================
// InstructorModal — bio + research papers for an instructor
// ============================================================
// Opens when user clicks an instructor name (e.g., from
// TopicSelectView lecturer label or ⌘K palette).
//
// Lazy-loaded — only ships when first opened. Pulls
// `INSTRUCTORS` data from src/data/instructors.js (separate chunk).
// ============================================================

import { useEffect } from 'react';

export default function InstructorModal({ instructor, onClose }) {
  // Esc to close
  useEffect(() => {
    const handle = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handle);
    return () => document.removeEventListener('keydown', handle);
  }, [onClose]);

  if (!instructor) return null;

  const { nameEn, nameTh, position, department, institution, email, profiles, areas, papers, notes } = instructor;

  return (
    <div className="vmx-modal-overlay" onClick={onClose}>
      <div
        className="vmx-modal"
        onClick={(e) => e.stopPropagation()}
        // Explicit max-height + overflow re-asserts the .vmx-modal
        // class defaults — defensive against any inline override
        // someone might add later, and guarantees scroll on desktop
        // when the profile has many papers/notes.
        style={{
          maxWidth: 720,
          maxHeight: 'min(90vh, calc(100dvh - 24px))',
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch',
        }}
        role="dialog"
        aria-label={`Instructor profile: ${nameEn}`}
      >
        {/* Header */}
        <div style={{ marginBottom: 20 }}>
          <div style={{
            fontSize: 11,
            fontFamily: 'JetBrains Mono, monospace',
            color: 'var(--clr-ink-soft)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            marginBottom: 6,
          }}>
            👨‍🏫 Faculty Profile
          </div>
          <h2 style={{ margin: 0, fontSize: 24, color: 'var(--clr-ink)' }}>
            {nameEn}
          </h2>
          {nameTh && (
            <div style={{ fontSize: 16, color: 'var(--clr-ink-soft)', marginTop: 4 }}>
              {nameTh}
            </div>
          )}
        </div>

        {/* Position + Department */}
        <div style={{
          padding: '12px 16px',
          background: 'var(--clr-surface-2)',
          borderRadius: 10,
          fontSize: 13,
          marginBottom: 20,
          lineHeight: 1.5,
        }}>
          <div style={{ fontWeight: 600 }}>{position}</div>
          <div style={{ color: 'var(--clr-ink-soft)', marginTop: 4 }}>{department}</div>
          <div style={{ color: 'var(--clr-ink-soft)', fontSize: 12, marginTop: 2 }}>{institution}</div>
          {email && (
            <div style={{ marginTop: 6, fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'var(--clr-ink-soft)' }}>
              {email}
            </div>
          )}
          {profiles && Object.keys(profiles).length > 0 && (
            <div style={{ marginTop: 8, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {Object.entries(profiles).map(([key, url]) => url && (
                <a key={key} href={url} target="_blank" rel="noopener noreferrer"
                   style={{
                     fontSize: 11,
                     fontFamily: 'JetBrains Mono, monospace',
                     color: 'var(--clr-rose)',
                     padding: '2px 8px',
                     border: '1px solid var(--clr-border)',
                     borderRadius: 999,
                     textDecoration: 'none',
                   }}>
                  {key === 'researchgate' ? 'ResearchGate ↗' :
                   key === 'scholar' ? 'Google Scholar ↗' :
                   key === 'pubmed' ? 'PubMed ↗' :
                   key === 'orcid' ? 'ORCID ↗' :
                   `${key} ↗`}
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Research areas */}
        {areas && areas.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <h3 style={{ fontSize: 13, fontFamily: 'JetBrains Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--clr-ink-soft)', margin: '0 0 8px' }}>
              Research Areas
            </h3>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {areas.map((a) => (
                <span key={a} style={{
                  padding: '4px 10px',
                  background: 'var(--clr-surface)',
                  border: '1px solid var(--clr-border)',
                  borderRadius: 999,
                  fontSize: 12,
                  color: 'var(--clr-ink)',
                }}>
                  {a}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Notable papers */}
        {papers && papers.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <h3 style={{ fontSize: 13, fontFamily: 'JetBrains Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--clr-ink-soft)', margin: '0 0 12px' }}>
              📑 Notable Papers, {papers.length}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {papers.map((p, i) => (
                <div key={i} style={{
                  padding: '12px 14px',
                  background: 'var(--clr-surface)',
                  border: '1px solid var(--clr-border)',
                  borderRadius: 10,
                }}>
                  <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--clr-ink)', lineHeight: 1.4 }}>
                    {p.url ? (
                      <a href={p.url} target="_blank" rel="noopener noreferrer"
                         style={{ color: 'inherit', textDecoration: 'underline' }}>
                        {p.title}
                      </a>
                    ) : (
                      p.title
                    )}
                  </div>
                  <div style={{
                    marginTop: 6,
                    fontSize: 11,
                    fontFamily: 'JetBrains Mono, monospace',
                    color: 'var(--clr-ink-soft)',
                  }}>
                    {p.year ? `${p.year}` : ''}
                    {p.journal ? `, ${p.journal}` : ''}
                    {p.authors ? `, ${p.authors}` : ''}
                  </div>
                  {p.summary && (
                    <div style={{
                      marginTop: 8,
                      fontSize: 13,
                      color: 'var(--clr-ink)',
                      lineHeight: 1.5,
                      paddingLeft: 12,
                      borderLeft: '2px solid var(--clr-gold)',
                    }}>
                      → {p.summary}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Notes */}
        {notes && notes.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <h3 style={{ fontSize: 13, fontFamily: 'JetBrains Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--clr-ink-soft)', margin: '0 0 8px' }}>
              Notes
            </h3>
            {notes.map((n, i) => (
              <div key={i} style={{
                fontSize: 13,
                color: 'var(--clr-ink)',
                lineHeight: 1.6,
                padding: '8px 12px',
                background: 'var(--clr-surface)',
                borderLeft: '3px solid var(--clr-sage)',
                borderRadius: '0 8px 8px 0',
                marginBottom: 6,
              }}>
                {n}
              </div>
            ))}
          </div>
        )}

        {/* Close button */}
        <div className="vmx-btn-row" style={{ marginTop: 20 }}>
          <button className="vmx-btn vmx-btn-ghost" onClick={onClose}>ปิด (esc)</button>
        </div>
      </div>
    </div>
  );
}
