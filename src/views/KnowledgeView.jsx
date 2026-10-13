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
import { RichText, keepSilentFinals } from '../lib/richtext.jsx';
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
import WikiShelves, { WikiFeatured, thaiDay } from '../components/WikiShelves.jsx';
import { Q_COUNTS_BY_TOPIC } from '../data/q-counts.js';
import { SHELF_TOTALS } from '../lib/vetwiki/shelf.generated.js';
import '../styles-wiki.css';

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
// A topic with a recorded disagreement between the lecture and the evidence.
const hasConflict = (t) => conflictCountFor(t.subject, t.topic) > 0;


// A note's shorthand runs up to 695 characters; the index row keeps about the
// first 140, cut between words, and the article shows it whole.
let teaserWords;
function summaryTeaser(s, max = 140) {
  const text = String(s || '');
  if (Array.from(text).length <= max) return text;
  if (teaserWords === undefined) {
    try { teaserWords = new Intl.Segmenter('th', { granularity: 'word' }); } catch { teaserWords = null; }
  }
  const words = teaserWords ? Array.from(teaserWords.segment(text), (x) => x.segment) : text.split(/(\s+)/);
  let out = '';
  for (const w of words) {
    if (Array.from(out + w).length > max) break;
    out += w;
  }
  return `${out.trimEnd()}…`;
}

// Topics whose title or summary holds the query (every topic for none): what
// a search shows at once, before the full text has been read.
function titleHitsFor(topics, query) {
  const normalized = query.toLocaleLowerCase();
  return topics
    .filter((entry) => !query || `${entry.title} ${entry.summary}`.toLocaleLowerCase().includes(normalized))
    .map((entry) => ({ topic: entry, matchedSections: [], inTitle: !!query }));
}

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
// Set by styles-wiki.css (.vw-body): 17 px Sarabun on a 30 px line.
function NoteBody({ item }) {
  if (typeof item === 'string') return <p><RichText text={item} /></p>;
  if (item?.bullets) {
    return (
      <ul>
        {item.bullets.map((b, i) => (
          <li key={i}>
            <RichText text={typeof b === 'string' ? b : `${b.label}: ${b.value}`} />
          </li>
        ))}
      </ul>
    );
  }
  if (item?.sub) {
    return (
      <div className="vw-body-sub">
        <div><RichText text={item.sub} /></div>
        {(item.body || []).map((b, i) => <NoteBody key={i} item={b} />)}
      </div>
    );
  }
  if (item?.table) {
    const { headers = [], rows = [] } = item.table;
    return (
      <div className="vw-table">
        <table>
          <thead><tr>{headers.map((h, i) => (
            <th key={i} style={{ whiteSpace: 'nowrap' }}><RichText text={h} /></th>
          ))}</tr></thead>
          <tbody>{rows.map((r, i) => (
            <tr key={i}>{r.map((c, j) => (
              <td key={j}><RichText text={c} /></td>
            ))}</tr>
          ))}</tbody>
        </table>
      </div>
    );
  }
  if (item?.callout) return <p className="vw-callout"><RichText text={item.callout} /></p>;
  return null;
}

// Where a source we could follow disagrees with what the lecture taught.
// Both sides are shown on purpose. The exam is written by the lecturer, so the
// taught answer is still the one that scores — the reader needs to know the
// conflict exists without being told to answer against their own paper.
function VerifiedClaim({ claim }) {
  const ev = EVIDENCE_LABEL[claim.evidenceStatus];
  return (
    <div className="vw-claim">
      <div className="vw-claim-head">
        <span>ตรวจทานกับแหล่งอ้างอิง</span>
        {ev && <StatusBadge label={ev} />}
      </div>
      <div className="vw-claim-text"><RichText text={claim.statement} /></div>
      <ul className="vw-claim-sources">
        {(claim.sourceRefs || []).map((ref, i) => {
          const src = resolveSource(ref);
          if (!src) return null;
          return (
            <li key={i}>
              {/* 185 cited sources carry a title but no citation line. */}
              {src.url
                ? <a href={src.url} target="_blank" rel="noopener noreferrer">{src.citation || src.title}</a>
                : <span>{src.citation || src.title}</span>}
              {ref.locator ? `, ${ref.locator}` : ''}
            </li>
          );
        })}
      </ul>
      {Array.isArray(claim.limitations) && claim.limitations.length > 0 && (
        <ul className="vw-claim-limits">
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
              <div style={{ fontSize: 12, color: 'var(--clr-ink-soft)' }}>หัวข้อย่อยรอตรวจทาน</div>
            </div>
          )}
          {(prov.metadataSectionCount || 0) > 0 && (
            <div style={{ flex: 1, minWidth: 130, padding: 12, borderRadius: 12, background: 'var(--clr-surface-2)' }}>
              <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--clr-ink-soft)' }}>{prov.metadataSectionCount}</div>
              <div style={{ fontSize: 12, color: 'var(--clr-ink-soft)' }}>หัวข้อย่อยที่ไม่ได้ตรวจทาน</div>
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
                    ? <a href={s.url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--clr-ocean-text)' }}>{s.citation || s.title}</a>
                    : <span>{s.citation || s.title}</span>}
                  <span style={{ color: 'var(--clr-ink-soft)' }}>, {s.organization}</span>
                </div>
              ))}
            </div>
          </>
        )}
        <p style={{ fontSize: 12, lineHeight: 1.5, color: 'var(--clr-ink-soft)', marginTop: 14, paddingTop: 12, borderTop: '1px dashed var(--clr-border)' }}>
          {prov.draftSectionCount > 0
            ? 'เนื้อหาที่รอตรวจทานมาจากโน้ตใน VetMock ยังไม่ได้เทียบกับแหล่งอ้างอิง ใช้เพื่อการเรียนรู้ ไม่ใช่คำแนะนำทางคลินิก'
            : 'ใช้เพื่อการเรียนรู้ ไม่ใช่คำแนะนำทางคลินิก จุดที่ตรวจทานแล้วทุกจุดบอกแหล่งอ้างอิงที่ตามไปอ่านได้'}
        </p>
      </div>
    </div>
  );
}

// ================= INDEX =================
// Exported for tests: mounted alone, its own state can be driven.
export function WikiIndex({ topics, onOpen, onOpenSection, goHome, focusSubject = null }) {
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
    const metadataHits = titleHitsFor(topics, query);
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
  // The render before that effect runs still holds the previous query's state
  // (a frame of "พบ 210 จาก 210" and every row while typing "z"). Until it
  // catches up, a query shows its title hits, no count and no empty state.
  const settled = searchState.query === query;
  const titleHits = useMemo(() => titleHitsFor(topics, query), [topics, query]);
  const results = settled ? searchState.results : titleHits;
  const searching = !!query && (!settled || searchState.loading);
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
  // The library (one shelf per year) or the list, remembered on this device.
  // A search always lists; a subject asked for by name opens in the list.
  const [layout, setLayoutState] = useState(() => {
    if (focusSubject) return 'list';
    try { return localStorage.getItem('vmx-wiki-layout') === 'list' ? 'list' : 'shelf'; } catch { return 'shelf'; }
  });
  const setLayout = (next) => {
    setLayoutState(next);
    try { localStorage.setItem('vmx-wiki-layout', next); } catch { /* the choice lasts this visit */ }
  };
  const [onlyConflicts, setOnlyConflicts] = useState(false);
  // The filter belongs to the list; a search lists every hit (its control is
  // hidden while searching, so it must not quietly cut the results).
  const filtering = onlyConflicts && !query;
  const showShelves = !query && layout === 'shelf';
  // "ดูหัวข้อที่มีจุดเหล่านี้" at the foot of the page: the filtered list for
  // this visit (the reader's own choice of view is not overwritten), with the
  // filter's control brought into view and focused.
  const filterRef = useRef(null);
  const [jumpToFilter, setJumpToFilter] = useState(0);
  useEffect(() => {
    if (jumpToFilter) filterRef.current?.focus();
  }, [jumpToFilter]);
  // The count is read out once it has settled and typing has paused, not on
  // every keystroke (the visible line above it updates at once).
  const [announce, setAnnounce] = useState('');
  useEffect(() => {
    if (!query || searching) { setAnnounce(''); return undefined; }
    const t = window.setTimeout(() => setAnnounce(results.length
      ? `พบ ${results.length} จาก ${topics.length} หัวข้อ`
      : `ไม่พบหัวข้อที่ตรงกับ ${query}`), 600);
    return () => window.clearTimeout(t);
  }, [query, searching, results.length, topics.length]);
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
  // One heading per year, the reader's own first, then the later years first:
  // the registry order alone mixed years with no label (COM V, then year 5).
  const yearGroups = useMemo(() => {
    const by = new Map();
    for (const g of groups) {
      const y = yearForSubject(g[0]) || 0;
      if (!by.has(y)) by.set(y, []);
      by.get(y).push(g);
    }
    const rank = (y) => (y === ownYear ? -100 : -y);
    return [...by.entries()].sort((a, b) => rank(a[0]) - rank(b[0]));
  }, [groups, ownYear]);
  // "เฉพาะหัวข้อที่มีหลักฐานไม่ตรงกับที่บรรยาย": the list cut to those topics.
  const listGroups = useMemo(() => (filtering
    ? yearGroups
      .map(([y, subjects]) => [y, subjects
        .map(([id, list]) => [id, list.filter(hasConflict)])
        .filter(([, list]) => list.length)])
      .filter(([, subjects]) => subjects.length)
    : yearGroups), [yearGroups, filtering]);
  const shelfYears = useMemo(() => yearGroups.map(([y, subjects]) => [y, subjects.map(([id]) => id)]), [yearGroups]);
  const topicsBySubject = useMemo(() => new Map(groups), [groups]);
  // The flagship to start from, and the five topics with the most practice
  // questions in the reader's year (every year without one). Ranked, not
  // counted: a practice set serves only as many as it is asked for.
  const flagship = useMemo(() => topics.find((t) => t.flagship) || null, [topics]);
  const ranked = useMemo(() => topics
    .filter((t) => t.id !== flagship?.id && (!ownYear || yearForSubject(t.subject) === ownYear))
    .map((t, i) => ({ t, i, count: Q_COUNTS_BY_TOPIC[t.subject]?.[t.topic] || 0 }))
    .filter((r) => r.count > 0)
    .sort((a, b) => b.count - a.count || a.i - b.i)
    .slice(0, 5)
    .map((r) => r.t), [topics, flagship, ownYear]);

  return (
    <div className="vmx-view vw vw-index">
      <Mochi state="read" size={44} slot="wiki-index" className="vmx-hero-mochi" />
      <button type="button" className="vw-home" onClick={goHome}>← หน้าแรก</button>

      <header className="vw-mast">
        <h1 className="vw-wordmark">Vet<em>Wiki</em></h1>
        {/* Kept whole: on a phone the line used to end on its last word alone.
            "ความรู้ที่เชื่อมถึงกัน" went: articles do not link across subjects yet. */}
        <p className="vw-tagline"><span>ความรู้ที่บอกได้ว่ามาจากไหน</span></p>
        {/* Says what the data holds: checked points are the key statements of
            a section, not every sentence in it. */}
        <p className="vw-lede">
          ทุกหัวข้อบอกได้ว่าเนื้อหามาจากไหน จุดที่ตรวจทานกับแหล่งอ้างอิงภายนอกแล้วมีแหล่งให้ตามไปอ่าน และหัวข้อย่อยที่ไม่ได้ตรวจทานมีป้ายบอกไว้
        </p>
        <ul className="vw-totals" aria-label="ในคลังนี้">
          <li><b>{SHELF_TOTALS.topics.toLocaleString('en-US')}</b>หัวข้อ</li>
          <li><b>{SHELF_TOTALS.sections.toLocaleString('en-US')}</b>หัวข้อย่อย</li>
          <li><b>{SHELF_TOTALS.claims.toLocaleString('en-US')}</b>จุดที่ตรวจทานแล้ว</li>
          <li><b>{SHELF_TOTALS.sources.toLocaleString('en-US')}</b>แหล่งอ้างอิง</li>
        </ul>
      </header>

      <FeatureTip id="knowledge" surface="index" />

      <label htmlFor="vw-search" className="vmx-sr-only" style={{ position: 'absolute', left: -9999 }}>ค้นหาในวิกิ</label>
      <input
        id="vw-search" type="search" value={q} onChange={(e) => setQ(e.target.value)}
        placeholder="ค้นชื่อโรค อาการ หรือคำในเนื้อหา"
        className="vw-search"
      />
      {/* The count shows during a search; the masthead already says how many. */}
      <p className="vw-search-count">
        {query
          ? searching ? 'กำลังค้นหาในเนื้อหาทุกหัวข้อ…' : `พบ ${shown} จาก ${total} หัวข้อ`
          : ''}
      </p>
      <p className="vmx-sr-only" role="status">{announce}</p>

      {/* An incomplete search is a different answer from "found nothing", so it
          is never presented as a finished one. -1 means the whole full-text
          pass failed and only titles and summaries were matched. */}
      {query && !searching && searchState.incomplete ? (
        <div className="vw-notice">
          {searchState.incomplete === -1
            ? 'ค้นได้เฉพาะชื่อหัวข้อและคำโปรย เพราะโหลดเนื้อหาไม่สำเร็จ ผลจึงยังไม่ครบ'
            : `ค้นไม่ครบ ${searchState.incomplete} วิชา เพราะโหลดเนื้อหาไม่สำเร็จ`}
          <button className="vmx-btn vmx-btn-ghost vmx-btn-sm" onClick={retrySearch} style={{ marginInlineStart: 8 }}>
            ค้นอีกครั้ง
          </button>
        </div>
      ) : null}

      {!query && (
        <div className="vw-view-bar">
          <div className="vw-view-switch" role="group" aria-label="มุมมอง">
            <button type="button" aria-pressed={showShelves} onClick={() => setLayout('shelf')}>ชั้นหนังสือ</button>
            <button type="button" aria-pressed={!showShelves} onClick={() => setLayout('list')}>รายการ</button>
          </div>
          {!showShelves && (
            <button type="button" ref={filterRef} className="vw-filter" aria-pressed={onlyConflicts} onClick={() => setOnlyConflicts((v) => !v)}>
              เฉพาะหัวข้อที่มีหลักฐานไม่ตรงกับที่บรรยาย
            </button>
          )}
        </div>
      )}

      {showShelves && flagship && (
        <WikiFeatured
          flagship={flagship}
          ranked={ranked}
          heading={ownYear ? `หัวข้อที่มีโจทย์ฝึกมากที่สุดในปี ${ownYear}` : 'หัวข้อที่มีโจทย์ฝึกมากที่สุด'}
          subjectInfo={(id) => ({ name: subjectName(id), code: subjectMeta(id)?.code || '' })}
          onOpenTopic={onOpen}
        />
      )}

      {showShelves && (
        <WikiShelves
          years={shelfYears}
          ownYear={ownYear}
          topicsBySubject={topicsBySubject}
          subjectInfo={(id) => ({ name: subjectName(id), code: subjectMeta(id)?.code || '' })}
          onOpenTopic={onOpen}
        />
      )}

      {query && !searching && groups.length === 0 && (
        <div className="vmx-empty">
          ไม่พบหัวข้อที่ตรงกับ “{q}”
          {/* One way on from an empty result: back to every subject. */}
          <div style={{ marginTop: 10 }}>
            <button type="button" className="vmx-btn vmx-btn-ghost vmx-btn-sm" onClick={() => setQ('')}>ล้างคำค้น</button>
          </div>
        </div>
      )}

      {!showShelves && listGroups.map(([year, yearList]) => (
        <React.Fragment key={year}>
          <h2 className="vw-year">
            {year ? `ปี ${year}` : 'วิชาอื่น'}
            {year && year === ownYear ? <small>ปีของคุณ</small> : null}
          </h2>
          {yearList.map(([subjectId, list]) => {
            const meta = subjectMeta(subjectId);
            // A subject asked for by name (the search card's VetWiki button)
            // starts open, folded or not; a tap still wins.
            const open = query || filtering ? true
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
                <h3 className="vmx-wiki-subject-heading">
                  {/* Searching or filtering, every subject shows its rows, so a
                      toggle here would do nothing now and fold the subject later. */}
                  {query || filtering ? <span className="vmx-wiki-subject-row">{label}</span> : (
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
                </h3>
                {open && (
                <ul className="vw-topics">
                  {list.map((t) => (
                    <li key={t.id}>
                      <button type="button" className="vw-topic" onClick={() => onOpen(t.id)}>
                        {/* No per-topic emoji: a reference list is grouped by
                            subject, so a decorative glyph per row is noise that
                            stops scaling once the corpus grows. A thin
                            subject-toned rule anchors the row instead. */}
                        <span aria-hidden="true" className="vw-topic-rule" />
                        <span className="vw-topic-text">
                          <span className="vw-topic-title">{keepSilentFinals(t.title)}</span>
                          {/* Counted from corrections.js, so a row can only claim
                              a disagreement that is actually written down, in the
                              article header's own words. */}
                          {conflictCountFor(t.subject, t.topic) > 0 && (
                            <span
                              title="มีจุดที่หลักฐานไม่ตรงกับที่บรรยาย"
                              className="vw-conflict-chip"
                            >
                              หลักฐานไม่ตรงกับที่บรรยาย {conflictCountFor(t.subject, t.topic)} จุด
                            </span>
                          )}
                          {t.summary && <span className="vw-topic-summary">{keepSilentFinals(summaryTeaser(t.summary))}</span>}
                        </span>
                      </button>
                      {/* Which sections matched: a hit is only useful if you can
                          see where in the article it landed, and go there. Each
                          heading is its own control, outside the row button. */}
                      {query && (matchById.get(t.id) || []).length > 0 && (
                        <div className="vw-found">
                          พบใน:{' '}
                          {(matchById.get(t.id) || []).slice(0, 3).map((s, i) => (
                            <React.Fragment key={s.id}>
                              {i > 0 ? ', ' : ''}
                              <button
                                type="button"
                                onClick={() => onOpenSection?.(t.id, s.id)}
                                title={`เปิดที่หัวข้อย่อย ${s.heading}`}
                              >
                                {keepSilentFinals(s.heading)}
                              </button>
                            </React.Fragment>
                          ))}
                          {(matchById.get(t.id) || []).length > 3 ? ` และอีก ${(matchById.get(t.id) || []).length - 3} หัวข้อย่อย` : ''}
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
                )}
              </section>
            );
          })}
        </React.Fragment>
      ))}

      {!query && (
        <footer className="vw-colophon">
          <p>
            <b>หลักฐานไม่ตรงกับที่บรรยาย {SHELF_TOTALS.conflicts.toLocaleString('en-US')} จุด ใน {SHELF_TOTALS.conflictTopics.toLocaleString('en-US')} หัวข้อ</b>
            {' '}แต่ละจุดแสดงทั้งที่บรรยายสอนและที่แหล่งอ้างอิงพบ พร้อมคำแนะนำเวลาสอบ
          </p>
          <button type="button" className="vmx-btn vmx-btn-ghost vmx-btn-sm" onClick={() => { setLayoutState('list'); setOnlyConflicts(true); setJumpToFilter((n) => n + 1); }}>
            ดูหัวข้อที่มีจุดเหล่านี้
          </button>
          {SHELF_TOTALS.newestReview && <p className="vw-colophon-date">ตรวจทานครั้งล่าสุด {thaiDay(SHELF_TOTALS.newestReview)}</p>}
        </footer>
      )}
    </div>
  );
}

// ================= ARTICLE =================
function WikiArticle({ topic: current, knowledge, prov, onBackToIndex, onOpen, related, chapter, goPractice, practiceLabel, goNotes, onShowProv, shareUrl }) {
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
  const [tocOpen, setTocOpen] = useState(() => !prefersCompactReading());
  const backToContents = () => {
    setTocOpen(true);
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
    // copyText answers { ok, ... }; the object itself is always truthy.
    const { ok } = await copyText(url);
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

  // One "แชร์" menu in place of three buttons: copy the link, the phone's own
  // share sheet where there is one, and print (where saving a PDF lives).
  const [shareOpen, setShareOpen] = useState(false);
  const shareRef = useRef(null);
  const shareButtonRef = useRef(null);
  // Closed from the keyboard or by choosing an item, the menu hands focus back
  // to แชร์ (it used to drop to <body>); a tap elsewhere keeps its own focus.
  const closeShare = () => { setShareOpen(false); shareButtonRef.current?.focus(); };
  useEffect(() => {
    if (!shareOpen) return undefined;
    const away = (e) => { if (!shareRef.current?.contains(e.target)) setShareOpen(false); };
    const esc = (e) => { if (e.key === 'Escape') { setShareOpen(false); shareButtonRef.current?.focus(); } };
    document.addEventListener('pointerdown', away);
    document.addEventListener('keydown', esc);
    return () => { document.removeEventListener('pointerdown', away); document.removeEventListener('keydown', esc); };
  }, [shareOpen]);
  // The menu opens upward when there is no room under the button: on a phone
  // the button can sit just above the tab bar, which covered the menu.
  const [shareUp, setShareUp] = useState(false);
  const toggleShare = () => {
    if (!shareOpen) {
      const r = shareButtonRef.current?.getBoundingClientRect();
      const nav = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--vmx-bottom-nav-h')) || 0;
      setShareUp(!!r && r.bottom + 170 > window.innerHeight - nav && r.top > 170);
    }
    setShareOpen((v) => !v);
  };
  // Tabbing out of the menu closes it. Only a move to another element counts:
  // Safari does not focus a button it clicks, so a click on an item blurs to
  // nothing and must not close the menu before the click lands.
  const onShareBlur = (e) => {
    if (e.relatedTarget && !shareRef.current?.contains(e.relatedTarget)) setShareOpen(false);
  };
  const copyPage = async () => {
    closeShare();
    const { ok } = await copyText(shareUrl);
    setCopied(ok ? '__page__' : 'fail:__page__');
    clearTimeout(copyTimer.current);
    copyTimer.current = setTimeout(() => setCopied(''), 1600);
  };
  const canShare = typeof navigator !== 'undefined' && typeof navigator.share === 'function';
  const sharePage = async () => {
    closeShare();
    try { await navigator.share({ title: knowledge.title, url: shareUrl }); } catch { /* closed, or refused: nothing to undo */ }
  };
  // What a copy did, read out: the button's own label changes out of sight
  // of a screen reader.
  const copiedSaid = !copied ? '' : copied.startsWith('fail:') ? 'คัดลอกไม่สำเร็จ'
    : copied === '__page__' ? 'คัดลอกลิงก์แล้ว' : 'คัดลอกลิงก์หัวข้อย่อยแล้ว';
  const sourceCount = prov?.sources?.length || 0;

  return (
    <div className="vmx-view vw vw-article">
      <Mochi state="read" size={36} slot="wiki-reading" className="vmx-hero-mochi" />
      <FeatureTip id="knowledge" surface="article" />
      {/* Breadcrumb, with the chapter's place in its subject */}
      <nav aria-label="breadcrumb" className="vw-crumbs">
        <button type="button" onClick={onBackToIndex}>VetWiki</button>
        <span aria-hidden="true">›</span>
        <span>{subjectName(current.subject)}</span>
        {chapter && <span className="vw-chapter">หัวข้อที่ {chapter.index} จาก {chapter.count}</span>}
      </nav>

      {/* Title: plain text, no emoji (citable, screen-reader clean) */}
      <h1 className="vw-title">{keepSilentFinals(knowledge.title, 't')}</h1>
      {/* A person or nothing: "TBD" names nobody (topics built from MSD
          tables have no lecturer at all; tests/unit/wiki-bylines.test.mjs). */}
      {knowledge.lecturer && !/^tbd\b/i.test(knowledge.lecturer) && <p className="vw-byline">บรรยายโดย {knowledge.lecturer}</p>}
      {knowledge.summary && <p className="vw-dek">{keepSilentFinals(knowledge.summary, 'd')}</p>}

      {/* Provenance: one strip in place of the meta line, the provenance box
          and the sources button. An absent count is left out, not shown as 0,
          which would read as "checked and found none"; an article with no
          checked point says so in words instead. */}
      {prov && prov.verifiedClaimCount === 0 && <p className="vw-strip-note">{prov.headline}</p>}
      {/* Sources and the review date exist only with checked points, so with
          neither checked points nor conflicts the strip would be an empty box. */}
      {prov && (prov.verifiedClaimCount > 0 || conflictCount > 0) && (
        <div className="vw-strip">
          {prov.verifiedClaimCount > 0 && (
            <button type="button" className="vw-strip-cell" onClick={onShowProv}>
              <b>{prov.verifiedClaimCount.toLocaleString('en-US')}</b>
              <span>จุดที่ตรวจทานแล้ว</span>
            </button>
          )}
          {sourceCount > 0 && (
            <button type="button" className="vw-strip-cell" onClick={onShowProv}>
              <b>{sourceCount.toLocaleString('en-US')}</b>
              <span>แหล่งอ้างอิง</span>
            </button>
          )}
          {conflictCount > 0 && (
            <a
              href={`#${firstConflictId}`}
              className="vw-strip-cell is-conflict"
              onClick={(e) => { e.preventDefault(); jumpTo(document.getElementById(firstConflictId)); }}
            >
              <b aria-hidden="true">{conflictCount}</b>
              <span aria-hidden="true">หลักฐานไม่ตรงกับที่บรรยาย</span>
              <span className="vmx-sr-only">หลักฐานไม่ตรงกับที่บรรยาย {conflictCount} จุด</span>
            </a>
          )}
          {lastReviewed && (
            <button type="button" className="vw-strip-cell is-date" onClick={onShowProv}>
              <b>{thaiDay(lastReviewed)}</b>
              <span>ตรวจทานล่าสุด</span>
            </button>
          )}
        </div>
      )}
      {prov && (
        <button type="button" className="vw-how" onClick={onShowProv}>VetMock รู้เรื่องนี้ได้อย่างไร?</button>
      )}

      {/* Actions */}
      <div className="vw-actions">
        <button type="button" className="vmx-btn vmx-btn-primary vmx-btn-sm" onClick={goPractice}>{practiceLabel}</button>
        <button type="button" className="vmx-btn vmx-btn-ghost vmx-btn-sm" onClick={goNotes}>อ่านโน้ตเต็ม</button>
        <div className="vw-share" ref={shareRef} onBlur={onShareBlur}>
          <button type="button" ref={shareButtonRef} className="vmx-btn vmx-btn-ghost vmx-btn-sm" aria-expanded={shareOpen} onClick={toggleShare}>
            {copied === '__page__' ? '✓ คัดลอกลิงก์แล้ว' : copied === 'fail:__page__' ? 'คัดลอกไม่สำเร็จ' : 'แชร์'}
          </button>
          {shareOpen && (
            <ul className={`vw-share-menu${shareUp ? ' is-up' : ''}`}>
              <li><button type="button" onClick={copyPage}>คัดลอกลิงก์</button></li>
              {canShare && <li><button type="button" onClick={sharePage}>ส่งผ่านแอปอื่น</button></li>}
              <li>
                <button type="button" onClick={() => { closeShare(); window.print(); }}
                  title="พิมพ์ หรือเลือกบันทึกเป็น PDF จากหน้าพิมพ์ของเบราว์เซอร์">
                  พิมพ์หรือบันทึก PDF
                </button>
              </li>
            </ul>
          )}
        </div>
      </div>
      <p className="vmx-sr-only" role="status">{copiedSaid}</p>

      {/* Contents: numbered, and marked only where something differs from the
          norm (1,625 of 1,783 sections are checked, so a tick on each was noise). */}
      {knowledge.sections.length > 2 && (
        <nav ref={tocRef} tabIndex={-1} className="vmx-wiki-toc vw-toc" aria-label="สารบัญ">
          <div className="vw-toc-head">
            {/* Folded at first on a phone: nine entries pushed the first
                section a screen and a half down. */}
            <h2>
              <button type="button" className="vw-toc-toggle" aria-expanded={tocOpen} onClick={() => setTocOpen((v) => !v)}>
                สารบัญ {knowledge.sections.length} หัวข้อย่อย
                <span aria-hidden="true">{tocOpen ? '▾' : '▸'}</span>
              </button>
            </h2>
            {tocOpen && conflictCount > 0 && (
              <p><span className="vw-flag" aria-hidden="true">!</span> คือมีจุดที่หลักฐานไม่ตรงกับที่บรรยาย</p>
            )}
          </div>
          {tocOpen && (
          <ol className={knowledge.sections.length > 6 ? 'is-long' : undefined}>
            {knowledge.sections.map((s, i) => (
              <li key={s.id}>
                <span className="vw-num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                <a href={`#${s.id}`}
                  className="vmx-wiki-toc-link"
                  onClick={(e) => { e.preventDefault(); jumpTo(document.getElementById(s.id)); }}>
                  {keepSilentFinals(s.heading)}
                </a>
                {s.corrections?.length > 0 && (
                  <span className="vw-flag" title="หลักฐานไม่ตรงกับที่บรรยาย">
                    <span aria-hidden="true">!</span>
                    <span className="vmx-sr-only">มีจุดที่หลักฐานไม่ตรงกับที่บรรยาย</span>
                  </span>
                )}
                {s.reviewStatus === 'metadata' && <span className="vw-meta-tag">{REVIEW_LABEL.metadata.th}</span>}
              </li>
            ))}
          </ol>
          )}
        </nav>
      )}

      {/* Sections */}
      <ReadingEffects contentKey={knowledge.id}>
      <div className="vw-sections">
        {knowledge.sections.map((s, i) => {
          // The checked state is the norm and goes unmarked; only an exception
          // (course logistics, a draft) carries a badge.
          const rev = s.reviewStatus === 'verified' ? null : REVIEW_LABEL[s.reviewStatus];
          const noteRef = (s.sourceRefs || [])[0];
          return (
            <section key={s.id} id={s.id} className="vw-section">
              <div className="vw-h2row">
                <span className="vw-num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                <h2 className="vw-h2">{keepSilentFinals(s.heading)}</h2>
                <StatusBadge label={rev} />
                <button type="button" onClick={() => copyAnchor(s.id)}
                  className={`vw-anchor${copied === s.id ? ' is-done' : ''}`}
                  title="คัดลอกลิงก์มายังหัวข้อนี้" aria-label={`คัดลอกลิงก์: ${s.heading}`}>
                  {copied === s.id ? '✓' : copied === `fail:${s.id}` ? '✕' : '#'}
                </button>
              </div>
              <div className="vw-body">
                {s.body.map((item, j) => <NoteBody key={j} item={item} />)}
              </div>
              {/* Real figures from the lecture deck this section cites: the
                  neuroanatomy articles were describing structures the
                  extracted slides already show. */}
              <SlideFigures sectionId={s.id} source={noteRef?.locator || ''} />
              {/* "ที่มา", not "ที่มาในเลกเชอร์": 547 sections come from Vet 85
                  summaries, MSD tables or VetMock's own catalog pages. */}
              {noteRef && <div className="vw-source">ที่มา: {noteRef.locator}</div>}
              {(s.corrections || []).map((c, k) => (
                <React.Suspense key={k} fallback={<div className="vmx-skeleton" style={{ height: 72, borderRadius: 10, marginTop: 12 }} />}>
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
        <section className="vw-more">
          <h2>ดูเพิ่มใน {subjectName(current.subject)}</h2>
          <ul>
            {related.map((r) => (
              <li key={r.id}>
                <button type="button" className="vmx-chip" onClick={() => onOpen(r.id)} style={{ cursor: 'pointer' }}>{keepSilentFinals(r.title)}</button>
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
  // "หัวข้อที่ 3 จาก 7": the article's place in its subject, in the registry's
  // order, which is the course's (lib/vetwiki/index.js).
  const chapter = useMemo(() => {
    if (!current) return null;
    const list = topics.filter((t) => t.subject === current.subject);
    return { index: list.findIndex((t) => t.id === current.id) + 1, count: list.length };
  }, [topics, current]);

  // Keep the address bar in step with what's on screen, so every article is
  // shareable/bookmarkable and browser Back/Forward behave as expected.
  const syncUrl = (id, replace = false) => {
    if (typeof window === 'undefined' || !window.history?.pushState) return;
    const t = id ? topics.find((x) => x.id === id) : null;
    const path = t ? wikiPath(t.subject, t.topic) : WIKI_BASE;
    if (window.location.pathname === path) return;
    window.history[replace ? 'replaceState' : 'pushState']({ vetwiki: id || null }, '', path);
  };

  // Opening an article ends a subject request (the search card's VetWiki
  // button): coming back, the index opens in the reader's own view again.
  const openTopic = (id) => { setIndexFocus(null); setOpenId(id); syncUrl(id); window.scrollTo({ top: 0, behavior: 'auto' }); };
  // A search hit's matched heading: the article, at that section. WikiArticle
  // scrolls to the address's #section once the article has loaded.
  const openSection = (id, sectionId) => {
    const t = topics.find((x) => x.id === id);
    if (!t) return;
    setIndexFocus(null);
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
        topic={current} knowledge={knowledge} prov={prov} related={related} chapter={chapter}
        onBackToIndex={backToIndex} onOpen={openTopic}
        goPractice={goPractice} practiceLabel={practice.label} goNotes={goNotes} onShowProv={() => setShowProv(true)}
        shareUrl={wikiUrl(typeof window!=='undefined'?window.location.origin:'', current.subject, current.topic)}
      />
      {showProv && prov && <ProvenancePanel prov={prov} onClose={() => setShowProv(false)} />}
    </>
  );
}
