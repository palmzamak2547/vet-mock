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
import FeatureTip from '../components/FeatureTip.jsx';
import ReadingEffects from '../components/ReadingEffects.jsx';
import { RichText } from '../lib/richtext.jsx';
import { SUBJECTS, yearForSubject } from '../data/curriculum.js';
import { ownYearFirst, prefersCompactReading, storedSelectedYear } from '../lib/reading-layout.js';
import { motionIsReduced } from '../lib/motion-preferences.js';
import {
  listTopics, loadTopic, provenanceSummary, resolveSource,
  EVIDENCE_LABEL, REVIEW_LABEL,
} from '../lib/vetwiki/runtime.js';
import { conflictCountFor } from '../lib/vetwiki/conflict-summary.generated.js';
import { wikiPracticeTarget } from '../lib/vetwiki/practice-target.js';
import { copyText } from '../lib/clipboard.js';
import { wikiPath, wikiUrl, parseWikiPath, WIKI_BASE } from '../lib/vetwiki/url.js';
import ReportConcern from '../components/ReportConcern.jsx';
import SlideFigures from '../components/SlideFigures.jsx';
import { useModalFocus } from '../hooks/useModalFocus.js';
import StatePanel from '../components/StatePanel.jsx';
import Mochi from '../components/Mochi.jsx';

const ConflictNote = React.lazy(() => import('../components/ConflictNote.jsx'));

const TONE = {
  strong: 'var(--clr-sage-text)',
  ok: 'var(--clr-ocean-text)',
  weak: 'var(--clr-gold-text)',
  warn: 'var(--clr-rose-text)',
  muted: 'var(--clr-ink-soft)',
};

const subjectMeta = (id) => SUBJECTS.find((s) => s.id === id) || null;
const subjectName = (id) => subjectMeta(id)?.name || id.toUpperCase();
// A subject's group in the index, as a place to scroll to.
const subjectAnchor = (id) => `wiki-subject-${id}`;

// The newest open request (App's openNonce) this page has acted on. App keeps
// the subject and topic it last opened in its own state, so a mount from the
// Home tile or the menu arrives with a subject as well; only a request newer
// than this one moves the reader.
let actedOnOpenNonce = 0;

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
  if (typeof item === 'string') return <p style={{ margin: '0 0 12px', lineHeight: 1.75 }}><RichText text={item} /></p>;
  if (item?.bullets) {
    return (
      <ul style={{ margin: '0 0 12px', paddingLeft: 20, lineHeight: 1.7 }}>
        {item.bullets.map((b, i) => (
          <li key={i} style={{ marginBottom: 7 }}>
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
        <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: 14, lineHeight: 1.5 }}>
          <thead><tr>{headers.map((h, i) => (
            <th key={i} style={{ textAlign: 'left', padding: '9px 12px', borderBottom: '2px solid var(--clr-border)', color: 'var(--clr-ink-soft)', whiteSpace: 'nowrap' }}><RichText text={h} /></th>
          ))}</tr></thead>
          <tbody>{rows.map((r, i) => (
            <tr key={i}>{r.map((c, j) => (
              <td key={j} style={{ padding: '9px 12px', borderBottom: '1px solid var(--clr-border)', verticalAlign: 'top' }}><RichText text={c} /></td>
            ))}</tr>
          ))}</tbody>
        </table>
      </div>
    );
  }
  if (item?.callout) return <p style={{ margin: '0 0 12px', padding: '12px 14px', borderRadius: 10, background: 'var(--clr-surface-2)', lineHeight: 1.7 }}><RichText text={item.callout} /></p>;
  return null;
}

// Where a source we could follow disagrees with what the lecture taught.
// Both sides are shown on purpose. The exam is written by the lecturer, so the
// taught answer is still the one that scores — the reader needs to know the
// conflict exists without being told to answer against their own paper.
function VerifiedClaim({ claim }) {
  const ev = EVIDENCE_LABEL[claim.evidenceStatus];
  return (
    <div style={{ marginTop: 12, padding: '12px 14px', borderRadius: 10, background: 'var(--clr-surface-2)', borderLeft: '3px solid var(--clr-sage)' }}>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center', marginBottom: 5 }}>
        <span style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--clr-sage-text)' }}>✓ ตรวจทานกับแหล่งอ้างอิง</span>
        {ev && <StatusBadge label={ev} />}
      </div>
      <div style={{ fontSize: 14, lineHeight: 1.65, color: 'var(--clr-ink)' }}><RichText text={claim.statement} /></div>
      <div style={{ marginTop: 6, display: 'flex', flexDirection: 'column', gap: 3 }}>
        {(claim.sourceRefs || []).map((ref, i) => {
          const src = resolveSource(ref);
          if (!src) return null;
          return (
            <div key={i} style={{ fontSize: 12.5, color: 'var(--clr-ink-soft)', lineHeight: 1.55 }}>
              {src.url
                ? <a href={src.url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--clr-ocean-text)' }}>{src.citation}</a>
                : <span>{src.citation}</span>}
              {ref.locator ? `, ${ref.locator}` : ''}
            </div>
          );
        })}
      </div>
      {Array.isArray(claim.limitations) && claim.limitations.length > 0 && (
        <ul style={{ margin: '6px 0 0', paddingLeft: 18, fontSize: 12.5, color: 'var(--clr-ink-soft)', lineHeight: 1.55 }}>
          {claim.limitations.map((l, i) => <li key={i}>{l}</li>)}
        </ul>
      )}
    </div>
  );
}

function ProvenancePanel({ prov, onClose }) {
  const dialogRef = useModalFocus({ onClose });
  return (
    <div className="vmx-modal-overlay" onClick={onClose}>
      <div ref={dialogRef} className="vmx-modal" role="dialog" aria-modal="true" aria-label="ที่มาของเนื้อหา" tabIndex={-1} data-vmx-modal="true" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 560 }}>
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
          {prov.draftSectionCount > 0 && (
            <div style={{ flex: 1, minWidth: 130, padding: 12, borderRadius: 12, background: 'var(--clr-surface-2)' }}>
              <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--clr-ink-soft)' }}>{prov.draftSectionCount}</div>
              <div style={{ fontSize: 12, color: 'var(--clr-ink-soft)' }}>หัวข้อรอตรวจทาน</div>
            </div>
          )}
          {(prov.metadataSectionCount || 0) > 0 && (
            <div style={{ flex: 1, minWidth: 130, padding: 12, borderRadius: 12, background: 'var(--clr-surface-2)' }}>
              <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--clr-ink-soft)' }}>{prov.metadataSectionCount}</div>
              <div style={{ fontSize: 12, color: 'var(--clr-ink-soft)' }}>ข้อมูลรายวิชา (ตาราง, เกณฑ์คะแนน)</div>
            </div>
          )}
        </div>
        {prov.sources.length > 0 && (
          <>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--clr-ink-soft)', textTransform: 'uppercase', marginBottom: 6 }}>แหล่งอ้างอิงที่ใช้ตรวจทาน</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {prov.sources.map((s) => (
                <div key={s.id} style={{ fontSize: 12.5, lineHeight: 1.5, color: 'var(--clr-ink)' }}>
                  {s.url
                    ? <a href={s.url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--clr-ocean-text)' }}>{s.citation}</a>
                    : <span>{s.citation}</span>}
                  <span style={{ color: 'var(--clr-ink-soft)' }}>, {s.organization}</span>
                </div>
              ))}
            </div>
          </>
        )}
        <p style={{ fontSize: 12, lineHeight: 1.5, color: 'var(--clr-ink-soft)', marginTop: 14, paddingTop: 12, borderTop: '1px dashed var(--clr-border)' }}>
          {prov.draftSectionCount > 0
            ? 'เนื้อหาที่รอตรวจทานมาจากโน้ตเลกเชอร์ ยังไม่ได้เทียบกับตำราต้นฉบับ — ใช้เพื่อการเรียนรู้ ไม่ใช่คำแนะนำทางคลินิก'
            : 'ใช้เพื่อการเรียนรู้ ไม่ใช่คำแนะนำทางคลินิก — ทุกจุดความรู้บอกแหล่งอ้างอิงที่ตามไปอ่านได้'}
        </p>
      </div>
    </div>
  );
}

// ================= INDEX =================
function WikiIndex({ topics, onOpen, onOpenSection, goHome, focusSubject = null }) {
  // Survive the stale-deploy reload. When a subject chunk fails to load, the
  // app reloads to pick up a fresh deploy — correct, and not something to
  // remove — but it took the student's search term with it, so a recovery in
  // the middle of typing looked like the app had simply forgotten.
  const [q, setQ] = useState(() => {
    try { return sessionStorage.getItem('vmx-wiki-q') || ''; } catch { return ''; }
  });
  useEffect(() => {
    try {
      if (q) sessionStorage.setItem('vmx-wiki-q', q);
      else sessionStorage.removeItem('vmx-wiki-q');
    } catch { /* storage disabled: the query simply does not survive */ }
  }, [q]);
  const query = q.trim();
  const [searchState, setSearchState] = useState(() => ({
    query: '',
    loading: false,
    results: topics.map((entry) => ({ topic: entry, matchedSections: [], inTitle: false })),
  }));
  // Bumped by "ค้นอีกครั้ง" while offline. Without it the retry button could not
  // re-run the search, because the effect's inputs (query, topics) had not changed.
  const [retryNonce, setRetryNonce] = useState(0);
  // Native ESM remembers a failed import for the life of the document, so once
  // the connection is back only a reload can complete the full-text search
  // (the query above survives it). Offline, retry in place so the click never
  // lands on the browser's offline page. Same rule as NotesView.retryLoad.
  const retrySearch = () => {
    if (navigator.onLine !== false) {
      window.location.reload();
      return;
    }
    setRetryNonce((n) => n + 1);
  };

  // Opening the index stays metadata-only. Full note bodies are imported only
  // after someone starts typing, then cached by the browser for the session.
  useEffect(() => {
    if (!query) {
      setSearchState({
        query: '',
        loading: false,
        results: topics.map((entry) => ({ topic: entry, matchedSections: [], inTitle: false })),
      });
      return undefined;
    }
    let active = true;
    const normalized = query.toLocaleLowerCase();
    const metadataHits = topics
      .filter((entry) => `${entry.title} ${entry.summary}`.toLocaleLowerCase().includes(normalized))
      .map((entry) => ({ topic: entry, matchedSections: [], inTitle: true }));
    setSearchState({ query, loading: true, results: metadataHits });
    const timer = window.setTimeout(() => {
      import('../lib/vetwiki/runtime-search.js')
        .then(({ searchTopics }) => searchTopics(query))
        .then((results) => {
          // A partial search must say so. Falling back silently to
          // title-and-summary matches made "ค้นครบแล้วแต่เจอเท่านี้" out of
          // "ค้นไม่ครบ", which is a different answer to the student's question.
          if (active) setSearchState({ query, loading: false, results, incomplete: results.incompleteSubjects || 0 });
        })
        .catch(() => {
          if (active) setSearchState({ query, loading: false, results: metadataHits, incomplete: -1 });
        });
    }, 120);
    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [query, topics, retryNonce]);
  const results = searchState.results;
  const matchById = useMemo(() => {
    const m = new Map();
    for (const r of results) m.set(r.topic.id, r.matchedSections);
    return m;
  }, [results]);

  // The reader's own year first; on a phone every subject starts folded, so
  // the index is a short list of subjects instead of a 33,000px column of
  // 210 summaries. A search opens every subject it found something in.
  const [ownYear] = useState(() => storedSelectedYear());
  const [subjectsOpenByDefault] = useState(() => !prefersCompactReading());
  const [subjectToggles, setSubjectToggles] = useState(() => new Map());
  const groups = useMemo(() => {
    const by = new Map();
    for (const r of results) {
      if (!by.has(r.topic.subject)) by.set(r.topic.subject, []);
      by.get(r.topic.subject).push(r.topic);
    }
    return ownYearFirst([...by.entries()], ([subjectId]) => yearForSubject(subjectId), ownYear);
  }, [results, ownYear]);

  const total = topics.length;
  const shown = results.length;

  return (
    <div className="vmx-view" style={{ maxWidth: 780, margin: '0 auto' }}>
      <Mochi state="read" size={44} slot="wiki-index" className="vmx-hero-mochi" />
      <button type="button" className="vmx-btn vmx-btn-ghost vmx-btn-sm" onClick={goHome} style={{ marginBottom: 16 }}>← หน้าแรก</button>

      <h1 style={{ fontFamily: 'var(--vmx-display)', fontSize: 30, margin: '0 0 6px', letterSpacing: '-0.01em' }}>VetWiki</h1>
      <p style={{ color: 'var(--clr-ink-soft)', margin: '0 0 20px', lineHeight: 1.65, fontSize: 14.5, maxWidth: '60ch' }}>
        คลังความรู้ที่ตรวจสอบได้ — ทุกจุดความรู้ผ่านการตรวจทานกับแหล่งอ้างอิงภายนอกแล้ว และทุกหัวข้อบอกได้ว่าเนื้อหามาจากไหน (ข้อมูลรายวิชา เช่น ตารางสอนหรือเกณฑ์คะแนน แยกประกาศไว้ชัดเจน)
      </p>

      <FeatureTip id="knowledge" surface="index" />

      <label htmlFor="vw-search" className="vmx-sr-only" style={{ position: 'absolute', left: -9999 }}>ค้นหาในวิกิ</label>
      <input
        id="vw-search" type="search" value={q} onChange={(e) => setQ(e.target.value)}
        placeholder="ค้นหาหัวข้อ เช่น rabies, วัคซีน, protozoa"
        className="vmx-fill-input"
        style={{ width: '100%', marginBottom: 8, boxSizing: 'border-box' }}
      />
      <div style={{ fontSize: 12, color: 'var(--clr-ink-soft)', marginBottom: 18, fontFamily: 'var(--vmx-mono)' }}>
        {query
          ? searchState.loading ? 'กำลังค้นหาในเนื้อหาทุกหัวข้อ…' : `${shown} / ${total} หัวข้อ`
          : `${total} หัวข้อ`}
      </div>

      {/* An incomplete search is a different answer from "found nothing", so it
          is never presented as a finished one. -1 means the whole full-text
          pass failed and only titles and summaries were matched. */}
      {query && !searchState.loading && searchState.incomplete ? (
        <div style={{ padding: 10, borderRadius: 10, background: 'var(--clr-gold-soft)', marginBottom: 14, fontSize: 12.5 }}>
          {searchState.incomplete === -1
            ? 'ค้นได้เฉพาะชื่อหัวข้อและคำโปรย เพราะโหลดเนื้อหาไม่สำเร็จ ผลจึงยังไม่ครบ'
            : `ค้นไม่ครบ ${searchState.incomplete} วิชา เพราะโหลดเนื้อหาไม่สำเร็จ`}
          <button className="vmx-btn vmx-btn-ghost vmx-btn-sm" onClick={retrySearch} style={{ marginInlineStart: 8 }}>
            ค้นอีกครั้ง
          </button>
        </div>
      ) : null}

      {groups.length === 0 && (
        <div className="vmx-empty">
          ไม่พบหัวข้อที่ตรงกับ “{q}”
          {/* One way on from an empty result: back to every subject. */}
          <div style={{ marginTop: 10 }}>
            <button type="button" className="vmx-btn vmx-btn-ghost vmx-btn-sm" onClick={() => setQ('')}>ล้างคำค้น</button>
          </div>
        </div>
      )}

      {groups.map(([subjectId, list]) => {
        const meta = subjectMeta(subjectId);
        // A subject asked for by name (the search card's VetWiki button)
        // starts open, folded or not; a tap still wins.
        const open = query ? true
          : subjectToggles.has(subjectId) ? subjectToggles.get(subjectId)
          : subjectId === focusSubject || subjectsOpenByDefault;
        const label = (
          <>
            <span className="vmx-wiki-subject-title">
              <span className="vmx-wiki-subject-name">{subjectName(subjectId)}</span>
              {meta?.code && <span className="vmx-wiki-subject-code">{meta.code}</span>}
            </span>
            <span className="vmx-wiki-subject-count">{list.length} หัวข้อ</span>
          </>
        );
        return (
          <section key={subjectId} id={subjectAnchor(subjectId)} className="vmx-wiki-subject" style={{ scrollMarginTop: 'var(--space-4)' }}>
            <h2 className="vmx-wiki-subject-heading">
              {query ? <span className="vmx-wiki-subject-row">{label}</span> : (
                <button
                  type="button"
                  className="vmx-wiki-subject-row vmx-wiki-subject-toggle"
                  aria-expanded={open}
                  onClick={() => setSubjectToggles((prev) => new Map(prev).set(subjectId, !open))}
                >
                  {label}
                  <span aria-hidden="true" className="vmx-wiki-subject-chevron">{open ? '▾' : '▸'}</span>
                </button>
              )}
            </h2>
            {open && (
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
                      <span style={{ display: 'block', fontSize: 15, fontWeight: 600, color: 'var(--clr-ocean-text)', lineHeight: 1.35 }}>
                        {t.title}
                        {/* Counted from corrections.js, so a row can only claim
                            a disagreement that is actually written down. The
                            words are the article header's own: a bare "!6"
                            explained only by a title meant nothing on a phone. */}
                        {conflictCountFor(t.subject, t.topic) > 0 && (
                          <span
                            title="มีจุดที่หลักฐานไม่ตรงกับที่บรรยาย"
                            style={{ display: 'inline-block', marginLeft: 7, padding: '0 8px', border: '1px solid currentColor', borderRadius: 999, fontSize: 11.5, fontWeight: 600, lineHeight: 1.6, color: 'var(--clr-rose-text)', whiteSpace: 'nowrap', verticalAlign: 'middle' }}
                          >
                            หลักฐานไม่ตรงกับที่บรรยาย {conflictCountFor(t.subject, t.topic)} จุด
                          </span>
                        )}
                      </span>
                      {t.summary && <span style={{ display: 'block', fontSize: 13, color: 'var(--clr-ink-soft)', lineHeight: 1.55, marginTop: 2, overflowWrap: 'anywhere' }}>{t.summary}</span>}
                    </span>
                  </button>
                  {/* Which sections matched — a hit is only useful if you can
                      see where in the article it landed, and go there. Outside
                      the row button: each heading is its own control, and
                      opens the article at that section. */}
                  {query && (matchById.get(t.id) || []).length > 0 && (
                    <div style={{ fontSize: 12, color: 'var(--clr-sage-text)', lineHeight: 1.5, padding: '0 10px 8px 24px', marginTop: -6 }}>
                      พบใน:{' '}
                      {(matchById.get(t.id) || []).slice(0, 3).map((s, i) => (
                        <React.Fragment key={s.id}>
                          {i > 0 ? ', ' : ''}
                          <button
                            type="button"
                            onClick={() => onOpenSection?.(t.id, s.id)}
                            title={`เปิดที่หัวข้อ ${s.heading}`}
                            style={{ all: 'unset', cursor: 'pointer', color: 'inherit', textDecoration: 'underline', textUnderlineOffset: 2, padding: '2px 0' }}
                          >
                            {s.heading}
                          </button>
                        </React.Fragment>
                      ))}
                      {(matchById.get(t.id) || []).length > 3 ? ` และอีก ${(matchById.get(t.id) || []).length - 3} หัวข้อ` : ''}
                    </div>
                  )}
                </li>
              ))}
            </ul>
            )}
          </section>
        );
      })}
    </div>
  );
}

// ================= ARTICLE =================
function WikiArticle({ topic: current, knowledge, prov, onBackToIndex, onOpen, related, goPractice, practiceLabel, goNotes, onShowProv, shareUrl }) {
  const [copied, setCopied] = useState('');
  const copyTimer = useRef(null);
  useEffect(() => () => clearTimeout(copyTimer.current), []);

  // Long articles get a way back to their contents: a small pill appears once
  // the contents box has scrolled away above, and hides again when it is in
  // view. An observer, not a scroll listener, decides.
  // The pill stands aside at the end of the article, where the related
  // topics would sit under it (the end marker counts as reached 200px early).
  const tocRef = useRef(null);
  const endRef = useRef(null);
  const [tocAway, setTocAway] = useState(false);
  const [endNear, setEndNear] = useState(false);
  useEffect(() => {
    const el = tocRef.current;
    const end = endRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return undefined;
    const io = new IntersectionObserver(([entry]) => {
      setTocAway(!entry.isIntersecting && entry.boundingClientRect.top < 0);
    });
    io.observe(el);
    const endIo = end ? new IntersectionObserver(([entry]) => setEndNear(entry.isIntersecting), { rootMargin: '0px 0px 200px 0px' }) : null;
    if (end) endIo.observe(end);
    return () => { io.disconnect(); endIo?.disconnect(); };
  }, [knowledge?.id]);
  const jumpTo = (el) => el?.scrollIntoView({ block: 'start', behavior: motionIsReduced() ? 'auto' : 'smooth' });
  const backToContents = () => {
    jumpTo(tocRef.current);
    tocRef.current?.focus({ preventScroll: true });
  };

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
    <div className="vmx-view" style={{ maxWidth: 680, margin: '0 auto' }}>
      <Mochi state="read" size={36} slot="wiki-reading" className="vmx-hero-mochi" />
      <FeatureTip id="knowledge" surface="article" />
      {/* Breadcrumb */}
      <nav aria-label="breadcrumb" style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center', fontSize: 12.5, color: 'var(--clr-ink-soft)', marginBottom: 14 }}>
        <button type="button" onClick={onBackToIndex} style={{ all: 'unset', cursor: 'pointer', color: 'var(--clr-ocean-text)', minHeight: 44, display: 'inline-flex', alignItems: 'center' }}>VetWiki</button>
        <span aria-hidden="true">›</span>
        <span>{subjectName(current.subject)}</span>
        <span aria-hidden="true">›</span>
        <span style={{ color: 'var(--clr-ink)' }}>{knowledge.title}</span>
      </nav>

      {/* Title — plain text, no emoji (citable, screen-reader clean) */}
      <h1 style={{ fontFamily: 'var(--vmx-display)', fontSize: 28, margin: '0 0 8px', lineHeight: 1.2, letterSpacing: '-0.01em' }}>{knowledge.title}</h1>

      {/* Metadata line */}
      {/* Body face: the mono face has no Thai, so บรรยาย and จุด used to fall
          back to another font in the middle of the line. */}
      <div className="vmx-wiki-meta">
        {knowledge.lecturer && <span>บรรยาย: {knowledge.lecturer}</span>}
        <span>{knowledge.sections.length} หัวข้อย่อย</span>
        {prov?.verifiedClaimCount > 0 && <span style={{ color: 'var(--clr-sage-text)' }}>ตรวจทานแล้ว {prov.verifiedClaimCount} จุด</span>}
        {conflictCount > 0 && (
          <a
            href={`#${firstConflictId}`}
            className="vmx-wiki-meta-link"
            onClick={(e) => { e.preventDefault(); jumpTo(document.getElementById(firstConflictId)); }}
            style={{ color: 'var(--clr-rose-text)', fontWeight: 700 }}
          >
            หลักฐานไม่ตรงกับที่บรรยาย {conflictCount} จุด
          </a>
        )}
        {lastReviewed && <span>ตรวจทานล่าสุด {lastReviewed}</span>}
      </div>

      {knowledge.summary && (
        <p style={{ fontSize: 16, lineHeight: 1.75, color: 'var(--clr-ink)', margin: '0 0 18px', paddingLeft: 14, borderLeft: '3px solid var(--clr-border)' }}>
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
        <button type="button" className="vmx-btn vmx-btn-primary vmx-btn-sm" onClick={goPractice}>{practiceLabel}</button>
        <button type="button" className="vmx-btn vmx-btn-ghost vmx-btn-sm" onClick={goNotes}>อ่านโน้ตเต็ม</button>
        <button type="button" className="vmx-btn vmx-btn-ghost vmx-btn-sm" onClick={onShowProv}>ดูแหล่งอ้างอิง</button>
        <button type="button" className="vmx-btn vmx-btn-ghost vmx-btn-sm"
          onClick={async () => { const ok = await copyText(shareUrl); setCopied(ok ? '__page__' : 'fail:__page__'); clearTimeout(copyTimer.current); copyTimer.current = setTimeout(() => setCopied(''), 1600); }}>
          {copied === '__page__' ? '✓ คัดลอกลิงก์แล้ว' : copied === 'fail:__page__' ? 'คัดลอกไม่สำเร็จ' : 'คัดลอกลิงก์'}
        </button>
        {/* The same print entry the notes page has; the browser's print sheet
            is where saving as PDF lives. Print styles drop the controls. */}
        <button type="button" className="vmx-btn vmx-btn-ghost vmx-btn-sm" onClick={() => window.print()}
          title="พิมพ์ หรือเลือกบันทึกเป็น PDF จากหน้าพิมพ์ของเบราว์เซอร์">
          พิมพ์
        </button>
      </div>

      {/* Table of contents */}
      {knowledge.sections.length > 2 && (
        <nav ref={tocRef} tabIndex={-1} className="vmx-wiki-toc" aria-label="สารบัญ" style={{ marginBottom: 22, padding: '14px 16px', borderRadius: 12, background: 'var(--clr-surface)', border: '1px solid var(--clr-border)', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ fontFamily: 'var(--vmx-mono)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--clr-ink-soft)', marginBottom: 8 }}>สารบัญ</div>
          <ol style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 3 }}>
            {knowledge.sections.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`}
                  className="vmx-wiki-toc-link"
                  onClick={(e) => { e.preventDefault(); jumpTo(document.getElementById(s.id)); }}
                  style={{ fontSize: 14, color: 'var(--clr-ocean-text)', lineHeight: 1.6 }}>
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
      <ReadingEffects contentKey={knowledge.id}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 30 }}>
        {knowledge.sections.map((s) => {
          const rev = REVIEW_LABEL[s.reviewStatus];
          const noteRef = (s.sourceRefs || [])[0];
          return (
            <section key={s.id} id={s.id} style={{ scrollMarginTop: 70 }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', marginBottom: 8, paddingBottom: 6, borderBottom: '1px solid var(--clr-border)' }}>
                <h2 style={{ fontFamily: 'var(--vmx-display)', fontSize: 20, margin: 0, flex: 1, minWidth: 0, lineHeight: 1.3 }}>{s.heading}</h2>
                <StatusBadge label={rev} />
                <button type="button" onClick={() => copyAnchor(s.id)}
                  title="คัดลอกลิงก์มายังหัวข้อนี้" aria-label={`คัดลอกลิงก์: ${s.heading}`}
                  style={{ all: 'unset', cursor: 'pointer', color: copied === s.id ? 'var(--clr-sage-text)' : 'var(--clr-ink-soft)', fontSize: 13, minWidth: 44, minHeight: 44, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                  {copied === s.id ? '✓' : copied === `fail:${s.id}` ? '✕' : '#'}
                </button>
              </div>
              {s.body.map((item, i) => <NoteBody key={i} item={item} />)}
              {/* Real figures from the lecture deck this section cites —
                  the neuroanatomy articles were describing structures the
                  extracted slides already show. */}
              <SlideFigures sectionId={s.id} source={noteRef?.locator || ''} />
              {noteRef && <div style={{ marginTop: 4, fontSize: 12.5, color: 'var(--clr-ink-soft)' }}>ที่มา: {noteRef.locator}</div>}
              {(s.corrections || []).map((c, i) => (
                <React.Suspense key={i} fallback={<div className="vmx-skeleton" style={{ height: 72, borderRadius: 10, marginTop: 12 }} />}>
                  <ConflictNote item={c} />
                </React.Suspense>
              ))}
              {(s.claims || []).map((c) => <VerifiedClaim key={c.id} claim={c} />)}
              <ReportConcern topicId={knowledge.id} sectionId={s.id} sectionHeading={s.heading} />
            </section>
          );
        })}
      </div>

      </ReadingEffects>
      {tocAway && !endNear && (
        <button type="button" className="vmx-wiki-toc-return" onClick={backToContents}>
          <span aria-hidden="true">↑</span> สารบัญ
        </button>
      )}
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
      <div ref={endRef} aria-hidden="true" className="vmx-reading-end" />
    </div>
  );
}

// ================= SHELL =================
export default function KnowledgeView({ subject, topic, openNonce = 0, setView, setSubject, setTopic, goHome, startExam }) {
  const topics = useMemo(() => listTopics(), []);
  // Opening VetWiki from the app lands on the index (a reference opens at its
  // contents); a direct subject+topic entry (e.g. from a note page) opens the
  // article itself.
  const [openId, setOpenId] = useState(() => (subject && topic && topics.some((t) => t.id === `${subject}--${topic}`) ? `${subject}--${topic}` : null));
  // The subject the index was last asked to show ({ subject, nonce }).
  const [indexFocus, setIndexFocus] = useState(null);
  const [showProv, setShowProv] = useState(false);
  const [articleLoad, setArticleLoad] = useState({ id: null, status: 'idle', data: null, error: '' });

  const current = openId ? topics.find((t) => t.id === openId) : null;
  useEffect(() => {
    if (!current) {
      setArticleLoad({ id: null, status: 'idle', data: null, error: '' });
      return undefined;
    }
    let active = true;
    setArticleLoad({ id: current.id, status: 'loading', data: null, error: '' });
    loadTopic(current.subject, current.topic)
      .then((data) => {
        if (!active) return;
        if (!data) throw new Error('ไม่พบบทความนี้ในคลังความรู้');
        setArticleLoad({ id: current.id, status: 'ready', data, error: '' });
      })
      .catch((error) => {
        if (!active) return;
        setArticleLoad({
          id: current.id,
          status: 'error',
          data: null,
          error: error?.message || 'โหลดบทความไม่สำเร็จ',
        });
      });
    return () => { active = false; };
  }, [current]);
  const knowledge = articleLoad.id === current?.id ? articleLoad.data : null;
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
  // A search hit's matched heading: the article, at that section. WikiArticle
  // scrolls to the address's #section once the article has loaded.
  const openSection = (id, sectionId) => {
    const t = topics.find((x) => x.id === id);
    if (!t) return;
    setOpenId(id);
    if (typeof window !== 'undefined' && window.history?.pushState) {
      window.history.pushState({ vetwiki: id }, '', wikiPath(t.subject, t.topic, sectionId));
    }
    window.scrollTo({ top: 0, behavior: 'auto' });
  };
  const backToIndex = () => { setOpenId(null); syncUrl(null); };

  // Follow the props when they change. `openId` is otherwise only ever read in
  // the mount initializer, so choosing a different article from the command
  // palette while this view was already open changed nothing: App saw the same
  // view and returned early, and the previous article stayed on screen with its
  // old URL and heading.
  //
  // The dep list is deliberately [subject, topic, openNonce] and NOT openId or
  // topics: adding those would make leaving an article (backToIndex, which does
  // not write App state) immediately bounce back into it. openNonce is what
  // makes asking for the SAME article twice work — App still holds the article
  // the student just left, so setting subject/topic to those values changes
  // nothing and React bails out before this effect would ever run.
  useEffect(() => {
    const fresh = openNonce > actedOnOpenNonce;
    if (fresh) actedOnOpenNonce = openNonce;
    const id = subject && topic ? `${subject}--${topic}` : null;
    if (!id) {
      // A subject with no topic (the search card's VetWiki button): the
      // index, with that subject open and in view. It used to land on every
      // subject folded on a phone, and from inside an article on nothing.
      if (fresh && subject && topics.some((t) => t.subject === subject)) {
        // An earlier search (kept by WikiIndex) would list only its own hits.
        try { sessionStorage.removeItem('vmx-wiki-q'); } catch { /* the index still opens */ }
        setOpenId(null);
        syncUrl(null);
        setIndexFocus({ subject, nonce: openNonce });
      }
      return;
    }
    if (id === openId) return;
    if (!topics.some((t) => t.id === id)) return;
    setOpenId(id);
    syncUrl(id);
    window.scrollTo({ top: 0, behavior: 'auto' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subject, topic, openNonce]);

  // Runs after the index has rendered the asked-for subject open.
  useEffect(() => {
    if (!indexFocus) return;
    const el = typeof document === 'undefined' ? null : document.getElementById(subjectAnchor(indexFocus.subject));
    el?.scrollIntoView?.({ block: 'start', behavior: motionIsReduced() ? 'auto' : 'smooth' });
  }, [indexFocus]);

  // Normalise the URL on first paint (e.g. entering from the app's feature
  // button, which arrives at "/"), and follow Back/Forward. Topic buttons
  // already sync their own URL. A popstate-derived openId must not sync again:
  // doing so while this view unmounts would rewrite the destination `/` as
  // `/wiki`, leaving the address bar out of step with the restored app view.
  useEffect(() => {
    syncUrl(openId, true);
    const onPop = () => {
      const { subject: s, topic: t } = parseWikiPath(window.location.pathname);
      const id = s && t ? `${s}--${t}` : null;
      setOpenId(id && topics.some((x) => x.id === id) ? id : null);
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- mount only; URL-owning actions sync explicitly
  }, []);

  if (!current) {
    // A new request remounts the index, so its search box starts from the
    // cleared search and the asked-for subject starts open.
    return (
      <WikiIndex topics={topics} onOpen={openTopic} onOpenSection={openSection} goHome={goHome}
        key={indexFocus ? `focus-${indexFocus.nonce}` : 'index'} focusSubject={indexFocus?.subject || null} />
    );
  }

  if (!knowledge) {
    const failed = articleLoad.id === current.id && articleLoad.status === 'error';
    return (
      <div>
        <button type="button" className="vmx-btn vmx-btn-ghost vmx-btn-sm" onClick={backToIndex} style={{ marginBottom: 16 }}>
          ← สารบัญ VetWiki
        </button>
        <StatePanel
          kind={failed ? 'error' : 'loading'}
          title={failed ? 'โหลดบทความไม่สำเร็จ' : `กำลังเปิด ${current.title}…`}
          body={failed ? articleLoad.error : 'กำลังโหลดเฉพาะเนื้อหาของวิชานี้'}
          actionLabel={failed ? 'ลองอีกครั้ง' : undefined}
          onAction={failed ? () => window.location.reload() : undefined}
        />
      </div>
    );
  }

  // A topic with no questions of its own opens the whole subject directly;
  // see lib/vetwiki/practice-target.js.
  const practice = wikiPracticeTarget(current.subject, current.topic);
  const goPractice = () => {
    if (!startExam) return;
    startExam({
      mode: 'quick', subject: current.subject,
      topic: practice.topic,
      practiceMode: 'all', useTimer: false,
    });
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
        goPractice={goPractice} practiceLabel={practice.label} goNotes={goNotes} onShowProv={() => setShowProv(true)}
        shareUrl={wikiUrl(typeof window!=='undefined'?window.location.origin:'', current.subject, current.topic)}
      />
      {showProv && prov && <ProvenancePanel prov={prov} onClose={() => setShowProv(false)} />}
    </>
  );
}
