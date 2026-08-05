// ============================================================
// KnowledgeView — VetWiki (governed reference)
// ============================================================
// Reads like an edited veterinary reference, not a database UI.
//
// Why there are no emoji (2026-07-24, revised): the note corpus stores a
// per-topic emoji (notes-com5.js `icon`). It does NOT scale to a reference
// work — past ~100 topics the icons collide and turn arbitrary (🔪 🍄 🪱),
// add nothing to scanning a subject-grouped list, get announced before every
// title by screen readers, and pollute anything citable. No serious reference
// (Wikipedia, MSD Vet Manual, WOAH, UpToDate) puts an emoji in a title or row.
// So the wiki drops the emoji entirely: rows are anchored by a thin subject-
// toned rule, and hierarchy comes from type — subject heading, title, summary.
// (Palm's note: "when the data grows, are emoji even enough?" — no, so remove.)
//
// Wiki affordances added here: breadcrumb · in-wiki search · subject grouping ·
// table of contents · stable per-section anchors (deep-linkable + citable) ·
// review metadata · related topics.
// ============================================================

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { RichText } from '../lib/richtext.jsx';
import { SUBJECTS } from '../data/curriculum.js';
import {
  listTopics, loadTopic, provenanceSummary, resolveSource,
  EVIDENCE_LABEL, REVIEW_LABEL,
} from '../lib/vetwiki/index.js';
import ConflictNote from '../components/ConflictNote.jsx';
import { conflictsForTopic } from '../lib/vetwiki/conflict-index.js';
import { copyText } from '../lib/clipboard.js';
import { searchTopics } from '../lib/vetwiki/search.js';
import { wikiPath, wikiUrl, parseWikiPath, WIKI_BASE } from '../lib/vetwiki/url.js';
import WikiExplain from '../components/WikiExplain.jsx';
import ReportConcern from '../components/ReportConcern.jsx';

const TONE = {
  strong: 'var(--clr-sage-text)',
  ok: 'var(--clr-ocean)',
  weak: 'var(--clr-gold-text)',
  warn: 'var(--clr-rose-text)',
  muted: 'var(--clr-ink-soft)',
};

const subjectMeta = (id) => SUBJECTS.find((s) => s.id === id) || null;
const subjectName = (id) => subjectMeta(id)?.name || id.toUpperCase();

function StatusBadge({ label }) {
  if (!label) return null;
  return (
    <span className="vmx-qtype-badge"
      style={{ color: TONE[label.tone] || 'var(--clr-ink-soft)', borderColor: 'currentColor', background: 'transparent' }}>
      {label.th}
    </span>
  );
}

// ---- note-body renderer (bullets | sub | table | callout | string) ----
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
      <div style={{ margin: '0 0 12px' }}>
        <div style={{ fontWeight: 600, marginBottom: 4, color: 'var(--clr-ink)' }}><RichText text={item.sub} /></div>
        {(item.body || []).map((b, i) => <NoteBody key={i} item={b} />)}
      </div>
    );
  }
  if (item?.table) {
    const { headers = [], rows = [] } = item.table;
    return (
      <div style={{ overflowX: 'auto', margin: '0 0 12px' }}>
        <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: 13.5 }}>
          <thead><tr>{headers.map((h, i) => (
            <th key={i} style={{ textAlign: 'left', padding: '7px 10px', borderBottom: '2px solid var(--clr-border)', color: 'var(--clr-ink-soft)', whiteSpace: 'nowrap' }}><RichText text={h} /></th>
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

// Where a source we could follow disagrees with what the lecture taught.
// Both sides are shown on purpose. The exam is written by the lecturer, so the
// taught answer is still the one that scores — the reader needs to know the
// conflict exists without being told to answer against their own paper.
function VerifiedClaim({ claim }) {
  const ev = EVIDENCE_LABEL[claim.evidenceStatus];
  return (
    <div style={{ marginTop: 12, padding: '11px 13px', borderRadius: 10, background: 'var(--clr-surface-2)', borderLeft: '3px solid var(--clr-sage)' }}>
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
            <div key={i} style={{ fontSize: 11.5, color: 'var(--clr-ink-soft)', lineHeight: 1.5 }}>
              {src.url
                ? <a href={src.url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--clr-ocean)' }}>{src.citation}</a>
                : <span>{src.citation}</span>}
              {ref.locator ? `, ${ref.locator}` : ''}
            </div>
          );
        })}
      </div>
      {Array.isArray(claim.limitations) && claim.limitations.length > 0 && (
        <ul style={{ margin: '6px 0 0', paddingLeft: 18, fontSize: 11.5, color: 'var(--clr-ink-soft)' }}>
          {claim.limitations.map((l, i) => <li key={i}>{l}</li>)}
        </ul>
      )}
    </div>
  );
}

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
                  <span style={{ color: 'var(--clr-ink-soft)' }}>, {s.organization}</span>
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

// ================= INDEX =================
function WikiIndex({ topics, onOpen, onOpenSection, goHome }) {
  const [q, setQ] = useState('');
  const query = q.trim();

  // Full-text across headings + body, so Thai queries hit English-titled
  // topics (the corpus has English titles over Thai bodies).
  const results = useMemo(() => searchTopics(query), [query]);
  const matchById = useMemo(() => {
    const m = new Map();
    for (const r of results) m.set(r.topic.id, r.matchedSections);
    return m;
  }, [results]);

  const groups = useMemo(() => {
    const by = new Map();
    for (const r of results) {
      if (!by.has(r.topic.subject)) by.set(r.topic.subject, []);
      by.get(r.topic.subject).push(r.topic);
    }
    return [...by.entries()];
  }, [results]);

  const total = topics.length;
  const shown = results.length;

  return (
    <div className="vmx-view" style={{ maxWidth: 780, margin: '0 auto' }}>
      <button type="button" className="vmx-btn vmx-btn-ghost vmx-btn-sm" onClick={goHome} style={{ marginBottom: 16 }}>← หน้าแรก</button>

      <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: 30, margin: '0 0 6px', letterSpacing: '-0.01em' }}>VetWiki</h1>
      <p style={{ color: 'var(--clr-ink-soft)', margin: '0 0 20px', lineHeight: 1.65, fontSize: 14.5, maxWidth: '60ch' }}>
        คลังความรู้ที่ตรวจสอบได้ — ทุกหัวข้อบอกได้ว่าเนื้อหามาจากไหน ส่วนไหนตรวจทานกับแหล่งอ้างอิงภายนอกแล้ว และส่วนไหนยังเป็นฉบับร่างจากโน้ตเลกเชอร์
      </p>

      <label htmlFor="vw-search" className="vmx-sr-only" style={{ position: 'absolute', left: -9999 }}>ค้นหาในวิกิ</label>
      <input
        id="vw-search" type="search" value={q} onChange={(e) => setQ(e.target.value)}
        placeholder="ค้นหาหัวข้อ เช่น rabies, วัคซีน, protozoa"
        className="vmx-fill-input"
        style={{ width: '100%', marginBottom: 8, boxSizing: 'border-box' }}
      />
      <div style={{ fontSize: 12, color: 'var(--clr-ink-soft)', marginBottom: 18, fontFamily: 'var(--vmx-mono)' }}>
        {query ? `${shown} / ${total} หัวข้อ` : `${total} หัวข้อ`}
      </div>

      {groups.length === 0 && (
        <div className="vmx-empty">ไม่พบหัวข้อที่ตรงกับ “{q}”</div>
      )}

      {groups.map(([subjectId, list]) => {
        const meta = subjectMeta(subjectId);
        return (
          <section key={subjectId} style={{ marginBottom: 26 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, paddingBottom: 7, marginBottom: 10, borderBottom: '1px solid var(--clr-border)' }}>
              <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: 17, margin: 0 }}>{subjectName(subjectId)}</h2>
              {meta?.code && <span style={{ fontFamily: 'var(--vmx-mono)', fontSize: 11, color: 'var(--clr-ink-soft)' }}>{meta.code}</span>}
            </div>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
              {list.map((t) => (
                <li key={t.id}>
                  <button
                    type="button" onClick={() => onOpen(t.id)}
                    style={{ all: 'unset', boxSizing: 'border-box', cursor: 'pointer', display: 'flex', gap: 11, alignItems: 'flex-start', width: '100%', padding: '11px 10px', borderRadius: 10, minHeight: 44 }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--clr-surface-2)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                  >
                    {/* No per-topic emoji — a reference list is grouped by subject,
                        so a decorative glyph per row is noise that stops scaling
                        once the corpus grows (Palm's "emoji won't scale" note).
                        A thin subject-toned rule anchors the row instead. */}
                    <span aria-hidden="true" style={{ alignSelf: 'stretch', width: 3, flexShrink: 0, borderRadius: 2, background: 'var(--clr-sage-soft)' }} />
                    <span style={{ flex: 1, minWidth: 0 }}>
                      <span style={{ display: 'block', fontSize: 15, fontWeight: 600, color: 'var(--clr-ocean)', lineHeight: 1.35 }}>
                        {t.title}
                        {/* Counted from corrections.js, so a row can only claim
                            a disagreement that is actually written down. */}
                        {conflictsForTopic(t.subject, t.topic).total > 0 && (
                          <span
                            title="มีจุดที่หลักฐานไม่ตรงกับที่บรรยาย"
                            style={{ marginLeft: 7, fontSize: 11, fontWeight: 700, color: 'var(--clr-rose-text)', fontFamily: 'var(--vmx-mono)' }}
                          >
                            !{conflictsForTopic(t.subject, t.topic).total}
                          </span>
                        )}
                      </span>
                      {t.summary && <span style={{ display: 'block', fontSize: 12.5, color: 'var(--clr-ink-soft)', lineHeight: 1.5, marginTop: 2 }}>{t.summary}</span>}
                      {/* Which sections matched — a hit is only useful if you
                          can see where in the article it landed. */}
                      {query && (matchById.get(t.id) || []).length > 0 && (
                        <span style={{ display: 'block', fontSize: 11.5, color: 'var(--clr-sage-text)', marginTop: 4, lineHeight: 1.5 }}>
                          พบใน: {(matchById.get(t.id) || []).slice(0, 3).map((s) => s.heading).join(', ')}
                          {(matchById.get(t.id) || []).length > 3 ? ` และอีก ${(matchById.get(t.id) || []).length - 3} หัวข้อ` : ''}
                        </span>
                      )}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}

// ================= ARTICLE =================
function WikiArticle({ topic: current, knowledge, prov, onBackToIndex, onOpen, related, goPractice, goNotes, onShowProv, shareUrl }) {
  const [copied, setCopied] = useState('');
  const copyTimer = useRef(null);
  useEffect(() => () => clearTimeout(copyTimer.current), []);

  // Deep-link: honour #section-id on mount so a cited section opens in place.
  useEffect(() => {
    const h = (window.location.hash || '').replace(/^#/, '');
    if (!h) return;
    const el = document.getElementById(h);
    if (el) el.scrollIntoView({ block: 'start', behavior: 'auto' });
  }, [knowledge?.id]);

  // Report what actually happened. The old version fired an unawaited
  // navigator.clipboard.writeText inside an empty catch and then claimed
  // success unconditionally — so on http, in a WebView, or with the
  // permission denied, the user saw "✓ คัดลอกแล้ว" with an empty clipboard.
  // lib/clipboard.js already implements the fallback chain.
  const copyAnchor = async (sectionId) => {
    const url = wikiUrl(window.location.origin, current.subject, current.topic, sectionId);
    const ok = await copyText(url);
    setCopied(ok ? sectionId : `fail:${sectionId}`);
    clearTimeout(copyTimer.current);
    copyTimer.current = setTimeout(() => setCopied(''), 1600);
  };

  const lastReviewed = useMemo(() => {
    const dates = [];
    for (const s of knowledge.sections) for (const c of s.claims || []) if (c.review?.reviewedAt) dates.push(c.review.reviewedAt);
    return dates.sort().pop() || null;
  }, [knowledge]);

  // Counted off the sections themselves rather than a second index, so the
  // headline number and the notes below it can never disagree.
  const conflictCount = useMemo(
    () => knowledge.sections.reduce((n, s) => n + (s.corrections?.length || 0), 0),
    [knowledge],
  );
  const firstConflictId = useMemo(
    () => knowledge.sections.find((s) => s.corrections?.length)?.id || '',
    [knowledge],
  );

  return (
    <div className="vmx-view" style={{ maxWidth: 780, margin: '0 auto' }}>
      {/* Breadcrumb */}
      <nav aria-label="breadcrumb" style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center', fontSize: 12.5, color: 'var(--clr-ink-soft)', marginBottom: 14 }}>
        <button type="button" onClick={onBackToIndex} style={{ all: 'unset', cursor: 'pointer', color: 'var(--clr-ocean)', minHeight: 44, display: 'inline-flex', alignItems: 'center' }}>VetWiki</button>
        <span aria-hidden="true">›</span>
        <span>{subjectName(current.subject)}</span>
        <span aria-hidden="true">›</span>
        <span style={{ color: 'var(--clr-ink)' }}>{knowledge.title}</span>
      </nav>

      {/* Title — plain text, no emoji (citable, screen-reader clean) */}
      <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: 28, margin: '0 0 8px', lineHeight: 1.2, letterSpacing: '-0.01em' }}>{knowledge.title}</h1>

      {/* Metadata line */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', fontSize: 12, color: 'var(--clr-ink-soft)', fontFamily: 'var(--vmx-mono)', marginBottom: 14 }}>
        {knowledge.lecturer && <span>บรรยาย: {knowledge.lecturer}</span>}
        <span>{knowledge.sections.length} หัวข้อย่อย</span>
        {prov?.verifiedClaimCount > 0 && <span style={{ color: 'var(--clr-sage-text)' }}>ตรวจทานแล้ว {prov.verifiedClaimCount} จุด</span>}
        {conflictCount > 0 && (
          <a
            href={`#${firstConflictId}`}
            onClick={(e) => { e.preventDefault(); document.getElementById(firstConflictId)?.scrollIntoView({ block: 'start', behavior: 'smooth' }); }}
            style={{ color: 'var(--clr-rose-text)', fontWeight: 700 }}
          >
            หลักฐานไม่ตรงกับที่บรรยาย {conflictCount} จุด
          </a>
        )}
        {lastReviewed && <span>ตรวจทานล่าสุด {lastReviewed}</span>}
      </div>

      {knowledge.summary && (
        <p style={{ fontSize: 15, lineHeight: 1.7, color: 'var(--clr-ink)', margin: '0 0 16px', paddingLeft: 14, borderLeft: '3px solid var(--clr-border)' }}>
          {knowledge.summary}
        </p>
      )}

      {/* Provenance trigger */}
      {prov && (
        <button type="button" onClick={onShowProv}
          style={{ all: 'unset', cursor: 'pointer', boxSizing: 'border-box', display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', padding: '10px 14px', borderRadius: 10, background: 'var(--clr-surface-2)', border: '1px solid var(--clr-border)', marginBottom: 16, minHeight: 44, width: '100%' }}>
          <span style={{ fontSize: 12.5, color: 'var(--clr-ink-soft)', flex: 1, minWidth: 0 }}>{prov.headline}</span>
          <span className="vmx-chip" style={{ fontSize: 12, fontWeight: 600, color: 'var(--clr-sage-text)' }}>VetMock รู้เรื่องนี้ได้อย่างไร?</span>
        </button>
      )}

      {/* Actions */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 22 }}>
        <button type="button" className="vmx-btn vmx-btn-primary vmx-btn-sm" onClick={goPractice}>ฝึกจากหัวข้อนี้</button>
        <button type="button" className="vmx-btn vmx-btn-ghost vmx-btn-sm" onClick={goNotes}>อ่านโน้ตเต็ม</button>
        <button type="button" className="vmx-btn vmx-btn-ghost vmx-btn-sm" onClick={onShowProv}>ดูแหล่งอ้างอิง</button>
        <button type="button" className="vmx-btn vmx-btn-ghost vmx-btn-sm"
          onClick={async () => { const ok = await copyText(shareUrl); setCopied(ok ? '__page__' : 'fail:__page__'); clearTimeout(copyTimer.current); copyTimer.current = setTimeout(() => setCopied(''), 1600); }}>
          {copied === '__page__' ? '✓ คัดลอกลิงก์แล้ว' : copied === 'fail:__page__' ? 'คัดลอกไม่สำเร็จ' : 'คัดลอกลิงก์'}
        </button>
      </div>

      {/* Table of contents */}
      {knowledge.sections.length > 2 && (
        <nav aria-label="สารบัญ" style={{ marginBottom: 22, padding: '14px 16px', borderRadius: 12, background: 'var(--clr-surface)', border: '1px solid var(--clr-border)' }}>
          <div style={{ fontFamily: 'var(--vmx-mono)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--clr-ink-soft)', marginBottom: 8 }}>สารบัญ</div>
          <ol style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 3 }}>
            {knowledge.sections.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`}
                  onClick={(e) => { e.preventDefault(); document.getElementById(s.id)?.scrollIntoView({ block: 'start', behavior: 'smooth' }); }}
                  style={{ fontSize: 13.5, color: 'var(--clr-ocean)', lineHeight: 1.6 }}>
                  {s.heading}
                </a>
                {(s.claims || []).some((c) => c.reviewStatus === 'verified') && (
                  <span title="มีจุดที่ตรวจทานกับแหล่งอ้างอิงแล้ว" style={{ color: 'var(--clr-sage-text)', fontSize: 11, marginLeft: 6 }}>✓</span>
                )}
                {s.corrections?.length > 0 && (
                  <span title="หลักฐานไม่ตรงกับที่บรรยาย" style={{ color: 'var(--clr-rose-text)', fontSize: 11, marginLeft: 5, fontWeight: 700 }}>!</span>
                )}
              </li>
            ))}
          </ol>
        </nav>
      )}

      {/* Sections */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 26 }}>
        {knowledge.sections.map((s) => {
          const rev = REVIEW_LABEL[s.reviewStatus];
          const noteRef = (s.sourceRefs || [])[0];
          return (
            <section key={s.id} id={s.id} style={{ scrollMarginTop: 70 }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', marginBottom: 8, paddingBottom: 6, borderBottom: '1px solid var(--clr-border)' }}>
                <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: 20, margin: 0, flex: 1, minWidth: 0, lineHeight: 1.3 }}>{s.heading}</h2>
                <StatusBadge label={rev} />
                <button type="button" onClick={() => copyAnchor(s.id)}
                  title="คัดลอกลิงก์มายังหัวข้อนี้" aria-label={`คัดลอกลิงก์: ${s.heading}`}
                  style={{ all: 'unset', cursor: 'pointer', color: copied === s.id ? 'var(--clr-sage-text)' : 'var(--clr-ink-soft)', fontSize: 13, minWidth: 44, minHeight: 44, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                  {copied === s.id ? '✓' : copied === `fail:${s.id}` ? '✕' : '#'}
                </button>
              </div>
              {s.body.map((item, i) => <NoteBody key={i} item={item} />)}
              {noteRef && <div style={{ marginTop: 4, fontSize: 11.5, color: 'var(--clr-ink-soft)' }}>ที่มา: {noteRef.locator}</div>}
              {(s.corrections || []).map((c, i) => <ConflictNote key={i} item={c} />)}
              {(s.claims || []).map((c) => <VerifiedClaim key={c.id} claim={c} />)}
              <ReportConcern topicId={knowledge.id} sectionId={s.id} sectionHeading={s.heading} />
            </section>
          );
        })}
      </div>

      {/* Grounded AI — answers only from this article, every claim sourced */}
      <WikiExplain knowledge={knowledge} onJumpToSection={(id) => document.getElementById(id)?.scrollIntoView({ block: 'start', behavior: 'smooth' })} />

      {/* Related topics in the same subject */}
      {related.length > 0 && (
        <section style={{ marginTop: 34, paddingTop: 16, borderTop: '1px solid var(--clr-border)' }}>
          <div style={{ fontFamily: 'var(--vmx-mono)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--clr-ink-soft)', marginBottom: 8 }}>ดูเพิ่มใน {subjectName(current.subject)}</div>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {related.map((r) => (
              <li key={r.id}>
                <button type="button" className="vmx-chip" onClick={() => onOpen(r.id)} style={{ cursor: 'pointer' }}>{r.title}</button>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

// ================= SHELL =================
export default function KnowledgeView({ subject, topic, setView, setSubject, setTopic, goHome, startExam }) {
  const topics = useMemo(() => listTopics(), []);
  // Opening VetWiki from the app lands on the index (a reference opens at its
  // contents); a direct subject+topic entry (e.g. from a note page) opens the
  // article itself.
  const [openId, setOpenId] = useState(() => (subject && topic && topics.some((t) => t.id === `${subject}--${topic}`) ? `${subject}--${topic}` : null));
  const [showProv, setShowProv] = useState(false);

  const current = openId ? topics.find((t) => t.id === openId) : null;
  const knowledge = useMemo(() => (current ? loadTopic(current.subject, current.topic) : null), [current]);
  const prov = useMemo(() => provenanceSummary(knowledge), [knowledge]);
  const related = useMemo(
    () => (current ? topics.filter((t) => t.subject === current.subject && t.id !== current.id) : []),
    [topics, current],
  );

  // Keep the address bar in step with what's on screen, so every article is
  // shareable/bookmarkable and browser Back/Forward behave as expected.
  const syncUrl = (id, replace = false) => {
    if (typeof window === 'undefined' || !window.history?.pushState) return;
    const t = id ? topics.find((x) => x.id === id) : null;
    const path = t ? wikiPath(t.subject, t.topic) : WIKI_BASE;
    if (window.location.pathname === path) return;
    window.history[replace ? 'replaceState' : 'pushState']({ vetwiki: id || null }, '', path);
  };

  const openTopic = (id) => { setOpenId(id); syncUrl(id); window.scrollTo({ top: 0, behavior: 'auto' }); };
  const backToIndex = () => { setOpenId(null); syncUrl(null); };

  // Normalise the URL on first paint (e.g. entering from the app's feature
  // button, which arrives at "/"), and follow Back/Forward.
  useEffect(() => {
    syncUrl(openId, true);
    const onPop = () => {
      const { subject: s, topic: t } = parseWikiPath(window.location.pathname);
      const id = s && t ? `${s}--${t}` : null;
      setOpenId(id && topics.some((x) => x.id === id) ? id : null);
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- mount + openId only
  }, [openId]);

  if (!current || !knowledge) {
    return <WikiIndex topics={topics} onOpen={openTopic} goHome={goHome} />;
  }

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
    <>
      <WikiArticle
        topic={current} knowledge={knowledge} prov={prov} related={related}
        onBackToIndex={backToIndex} onOpen={openTopic}
        goPractice={goPractice} goNotes={goNotes} onShowProv={() => setShowProv(true)}
        shareUrl={wikiUrl(typeof window!=='undefined'?window.location.origin:'', current.subject, current.topic)}
      />
      {showProv && prov && <ProvenancePanel prov={prov} onClose={() => setShowProv(false)} />}
    </>
  );
}
