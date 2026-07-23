// ============================================================
// KnowledgeView — VetWiki governed read page
// ============================================================
// The user-facing surface of the VetWiki knowledge foundation. Reuses the
// existing RichText renderer + vmx-* design kit; adds only the governance
// chrome (honest status in Thai, inline source markers, the
// "VetMock รู้เรื่องนี้ได้อย่างไร?" provenance panel, and 2-3 contextual
// actions that route into EXISTING features — practice + notes).
//
// Complex inside, simple outside: no enum values, no jargon — calm Thai.
// Additive route; original NotesView + routes untouched.
// ============================================================

import React, { useMemo, useState } from 'react';
import { RichText } from '../lib/richtext.jsx';
import {
  listTopics, loadTopic, provenanceSummary, resolveSource,
  EVIDENCE_LABEL, REVIEW_LABEL,
} from '../lib/vetwiki/index.js';

// tone → design token (reuse the palette, never hardcode hex)
const TONE = {
  strong: 'var(--clr-sage-text)',
  ok: 'var(--clr-ocean)',
  weak: 'var(--clr-gold-text)',
  warn: 'var(--clr-rose-text)',
  muted: 'var(--clr-ink-soft)',
};

function StatusBadge({ label }) {
  if (!label) return null;
  return (
    <span
      className="vmx-qtype-badge"
      style={{ color: TONE[label.tone] || 'var(--clr-ink-soft)', borderColor: 'currentColor', background: 'transparent' }}
    >
      {label.th}
    </span>
  );
}

// Minimal note-body renderer (bullets | sub | table | string). Kept local +
// small on purpose so the live NotesView is not refactored for this slice.
function NoteBody({ item }) {
  if (typeof item === 'string') return <p style={{ margin: '0 0 10px' }}><RichText text={item} /></p>;
  if (item?.bullets) {
    return (
      <ul style={{ margin: '0 0 10px', paddingLeft: 20 }}>
        {item.bullets.map((b, i) => (
          <li key={i} style={{ marginBottom: 4 }}>
            <RichText text={typeof b === 'string' ? b : `${b.label}: ${b.value}`} />
          </li>
        ))}
      </ul>
    );
  }
  if (item?.sub) {
    return (
      <div style={{ margin: '0 0 10px' }}>
        <div style={{ fontWeight: 600, marginBottom: 4, color: 'var(--clr-ink)' }}><RichText text={item.sub} /></div>
        {(item.body || []).map((b, i) => <NoteBody key={i} item={b} />)}
      </div>
    );
  }
  if (item?.table) {
    const { headers = [], rows = [] } = item.table;
    return (
      <div style={{ overflowX: 'auto', margin: '0 0 12px' }}>
        <table className="vmx-table" style={{ borderCollapse: 'collapse', width: '100%', fontSize: 13.5 }}>
          <thead><tr>{headers.map((h, i) => (
            <th key={i} style={{ textAlign: 'left', padding: '7px 10px', borderBottom: '2px solid var(--clr-border)', color: 'var(--clr-ink-soft)' }}><RichText text={h} /></th>
          ))}</tr></thead>
          <tbody>{rows.map((r, i) => (
            <tr key={i}>{r.map((c, j) => (
              <td key={j} style={{ padding: '7px 10px', borderBottom: '1px solid var(--clr-border)', verticalAlign: 'top' }}><RichText text={c} /></td>
            ))}</tr>
          ))}</tbody>
        </table>
      </div>
    );
  }
  if (item?.callout) return <p style={{ margin: '0 0 10px', padding: 10, borderRadius: 10, background: 'var(--clr-surface-2)' }}><RichText text={item.callout} /></p>;
  return null;
}

// One verified claim (shown under its section) — the honest provenance unit.
function VerifiedClaim({ claim }) {
  const ev = EVIDENCE_LABEL[claim.evidenceStatus];
  return (
    <div style={{ marginTop: 10, padding: '10px 12px', borderRadius: 12, background: 'var(--clr-surface-2)', borderLeft: '3px solid var(--clr-sage)' }}>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center', marginBottom: 5 }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--clr-sage-text)' }}>✓ ตรวจทานกับแหล่งอ้างอิง</span>
        {ev && <StatusBadge label={ev} />}
      </div>
      <div style={{ fontSize: 13.5, lineHeight: 1.6, color: 'var(--clr-ink)' }}><RichText text={claim.statement} /></div>
      <div style={{ marginTop: 6, display: 'flex', flexDirection: 'column', gap: 3 }}>
        {(claim.sourceRefs || []).map((ref, i) => {
          const src = resolveSource(ref);
          if (!src) return null;
          return (
            <div key={i} style={{ fontSize: 11.5, color: 'var(--clr-ink-soft)' }}>
              {src.url
                ? <a href={src.url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--clr-ocean)' }}>{src.citation}</a>
                : <span>{src.citation}</span>}
              {ref.locator ? ` · ${ref.locator}` : ''}
            </div>
          );
        })}
      </div>
      {Array.isArray(claim.limitations) && claim.limitations.length > 0 && (
        <div style={{ marginTop: 5, fontSize: 11.5, color: 'var(--clr-ink-soft)', fontStyle: 'italic' }}>
          ข้อจำกัด: {claim.limitations.join(' · ')}
        </div>
      )}
    </div>
  );
}

// The "VetMock รู้เรื่องนี้ได้อย่างไร?" panel — progressive disclosure.
function ProvenancePanel({ prov, onClose }) {
  return (
    <div className="vmx-modal-overlay" onClick={onClose} onKeyDown={(e) => { if (e.key === 'Escape') onClose(); }}>
      <div className="vmx-modal" role="dialog" aria-modal="true" aria-label="ที่มาของเนื้อหา" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 560 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <h2 style={{ margin: 0, fontSize: 19 }}>VetMock รู้เรื่องนี้ได้อย่างไร?</h2>
          <button type="button" className="vmx-btn vmx-btn-ghost vmx-btn-sm" onClick={onClose} aria-label="ปิด">✕</button>
        </div>
        <p style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--clr-ink)', margin: '0 0 14px' }}>{prov.headline}</p>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 14 }}>
          <div style={{ flex: 1, minWidth: 130, padding: 12, borderRadius: 12, background: 'var(--clr-surface-2)' }}>
            <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--clr-sage-text)' }}>{prov.verifiedClaimCount}</div>
            <div style={{ fontSize: 12, color: 'var(--clr-ink-soft)' }}>จุดที่ตรวจทานกับแหล่งอ้างอิงแล้ว</div>
          </div>
          <div style={{ flex: 1, minWidth: 130, padding: 12, borderRadius: 12, background: 'var(--clr-surface-2)' }}>
            <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--clr-ink-soft)' }}>{prov.draftSectionCount}</div>
            <div style={{ fontSize: 12, color: 'var(--clr-ink-soft)' }}>หัวข้อจากโน้ต (ฉบับร่าง)</div>
          </div>
        </div>
        {prov.sources.length > 0 && (
          <>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--clr-ink-soft)', textTransform: 'uppercase', marginBottom: 6 }}>แหล่งอ้างอิงที่ใช้ตรวจทาน</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {prov.sources.map((s) => (
                <div key={s.id} style={{ fontSize: 12.5, lineHeight: 1.5, color: 'var(--clr-ink)' }}>
                  {s.url
                    ? <a href={s.url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--clr-ocean)' }}>{s.citation}</a>
                    : <span>{s.citation}</span>}
                  <span style={{ color: 'var(--clr-ink-soft)' }}>{' '}· {s.organization}</span>
                </div>
              ))}
            </div>
          </>
        )}
        <p style={{ fontSize: 11.5, lineHeight: 1.5, color: 'var(--clr-ink-soft)', marginTop: 14, paddingTop: 12, borderTop: '1px dashed var(--clr-border)' }}>
          เนื้อหาที่ยังเป็นฉบับร่างมาจากโน้ตเลกเชอร์ ยังไม่ได้เทียบกับตำราต้นฉบับ — ใช้เพื่อการเรียนรู้ ไม่ใช่คำแนะนำทางคลินิก
        </p>
      </div>
    </div>
  );
}

export default function KnowledgeView({ subject, topic, setView, setSubject, setTopic, goHome, startExam }) {
  const topics = useMemo(() => listTopics(), []);
  const [openId, setOpenId] = useState(() => (subject && topic ? `${subject}--${topic}` : (topics[0]?.id || null)));
  const [showProv, setShowProv] = useState(false);

  const current = openId ? topics.find((t) => t.id === openId) : null;
  const knowledge = useMemo(() => (current ? loadTopic(current.subject, current.topic) : null), [current]);
  const prov = useMemo(() => provenanceSummary(knowledge), [knowledge]);

  // ---- Index (no topic open) ----
  if (!current || !knowledge) {
    return (
      <div className="vmx-view" style={{ maxWidth: 780, margin: '0 auto' }}>
        <button type="button" className="vmx-btn vmx-btn-ghost vmx-btn-sm" onClick={goHome} style={{ marginBottom: 14 }}>← กลับ</button>
        <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: 26, margin: '0 0 6px' }}>VetWiki</h1>
        <p style={{ color: 'var(--clr-ink-soft)', margin: '0 0 20px', lineHeight: 1.6 }}>คลังความรู้ที่ตรวจสอบได้ — ทุกหัวข้อบอกได้ว่ามาจากไหน ส่วนไหนตรวจทานกับแหล่งอ้างอิงแล้ว</p>
        <div style={{ display: 'grid', gap: 12 }}>
          {topics.map((t) => (
            <button key={t.id} type="button" className="vmx-subject-card" onClick={() => setOpenId(t.id)} style={{ textAlign: 'left', cursor: 'pointer' }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <div style={{ fontSize: 28 }}>{t.icon}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 16 }}>{t.title}</div>
                  {t.summary && <div style={{ fontSize: 12.5, color: 'var(--clr-ink-soft)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.summary}</div>}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // ---- Governed read page ----
  const goPractice = () => {
    if (!startExam) return;
    startExam({ mode: 'quick', subject: current.subject, topic: current.topic, practiceMode: 'all', useTimer: false });
  };
  const goNotes = () => {
    if (setSubject) setSubject(current.subject);
    if (setTopic) setTopic(current.topic);
    setView('notes');
  };

  return (
    <div className="vmx-view" style={{ maxWidth: 780, margin: '0 auto' }}>
      <button type="button" className="vmx-btn vmx-btn-ghost vmx-btn-sm" onClick={() => setOpenId(null)} style={{ marginBottom: 14 }}>← VetWiki</button>

      {/* Header */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 8 }}>
        <div style={{ fontSize: 34, lineHeight: 1 }}>{knowledge.icon}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: 24, margin: '0 0 4px', lineHeight: 1.2 }}>{knowledge.title}</h1>
          {knowledge.lecturer && <div style={{ fontSize: 12.5, color: 'var(--clr-ink-soft)' }}>บรรยายโดย {knowledge.lecturer}</div>}
        </div>
      </div>
      {knowledge.summary && <p style={{ fontSize: 14.5, lineHeight: 1.6, color: 'var(--clr-ink)', margin: '0 0 14px' }}>{knowledge.summary}</p>}

      {/* Provenance line + trigger */}
      {prov && (
        <button type="button" onClick={() => setShowProv(true)}
          style={{ all: 'unset', cursor: 'pointer', display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', padding: '10px 14px', borderRadius: 12, background: 'var(--clr-surface-2)', border: '1px solid var(--clr-border)', marginBottom: 18, minHeight: 44, boxSizing: 'border-box' }}>
          <span style={{ fontSize: 12.5, color: 'var(--clr-ink-soft)', flex: 1, minWidth: 0 }}>{prov.headline}</span>
          <span className="vmx-chip" style={{ fontSize: 12, fontWeight: 600, color: 'var(--clr-sage-text)' }}>VetMock รู้เรื่องนี้ได้อย่างไร?</span>
        </button>
      )}

      {/* Contextual actions (reuse existing features) */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
        <button type="button" className="vmx-btn vmx-btn-primary vmx-btn-sm" onClick={goPractice}>ฝึกจากหัวข้อนี้</button>
        <button type="button" className="vmx-btn vmx-btn-ghost vmx-btn-sm" onClick={goNotes}>อ่านโน้ตเต็ม</button>
        <button type="button" className="vmx-btn vmx-btn-ghost vmx-btn-sm" onClick={() => setShowProv(true)}>ดูแหล่งอ้างอิง</button>
      </div>

      {/* Sections */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {knowledge.sections.map((s) => {
          const rev = REVIEW_LABEL[s.reviewStatus];
          const noteRef = (s.sourceRefs || [])[0];
          return (
            <section key={s.id} className="vmx-question-card" style={{ padding: 18 }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', marginBottom: 10 }}>
                <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: 18, margin: 0, flex: 1, minWidth: 0 }}>{s.heading}</h2>
                <StatusBadge label={rev} />
              </div>
              {s.body.map((item, i) => <NoteBody key={i} item={item} />)}
              {noteRef && (
                <div style={{ marginTop: 6, fontSize: 11.5, color: 'var(--clr-ink-soft)' }}>ที่มา: {noteRef.locator}</div>
              )}
              {(s.claims || []).map((c) => <VerifiedClaim key={c.id} claim={c} />)}
            </section>
          );
        })}
      </div>

      {showProv && prov && <ProvenancePanel prov={prov} onClose={() => setShowProv(false)} />}
    </div>
  );
}
