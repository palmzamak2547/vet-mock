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

import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import FeatureTip from '../components/FeatureTip.jsx';
import ReadingEffects from '../components/ReadingEffects.jsx';
import { RichText, keepSilentFinals } from '../lib/richtext.jsx';
import { SUBJECTS, yearForSubject } from '../data/curriculum.js';
import { ownYearFirst, prefersCompactReading, storedSelectedYear } from '../lib/reading-layout.js';
import { motionIsReduced } from '../lib/motion-preferences.js';
import {
  listTopics, loadTopic, provenanceSummary, resolveSource,
  REVIEW_LABEL,
} from '../lib/vetwiki/runtime.js';
import { articleCitations, citationText } from '../lib/vetwiki/cite.js';
import { isTopicRead, setTopicRead, topicProgressKey } from '../lib/study-progress.js';
import { SectionEvidence, SourceList } from '../components/WikiEvidence.jsx';
import { conflictCountFor } from '../lib/vetwiki/conflict-summary.generated.js';
import { wikiPracticeTarget } from '../lib/vetwiki/practice-target.js';
import { copyText } from '../lib/clipboard.js';
import { wikiPath, wikiUrl, parseWikiPath, WIKI_BASE } from '../lib/vetwiki/url.js';
import ReportConcern from '../components/ReportConcern.jsx';
import SlideFigures from '../components/SlideFigures.jsx';
import OptionalFeature from '../components/OptionalFeature.jsx';
import { useModalFocus } from '../hooks/useModalFocus.js';
import StatePanel from '../components/StatePanel.jsx';
import Mochi from '../components/Mochi.jsx';
import WikiShelves, { WikiFeatured, thaiDay } from '../components/WikiShelves.jsx';
import { Q_COUNTS_BY_TOPIC } from '../data/q-counts.js';
import { SHELF_TOTALS, SHELF_RELATED } from '../lib/vetwiki/shelf.generated.js';
import '../styles-wiki.css';

const ConflictNote = React.lazy(() => import('../components/ConflictNote.jsx'));
// The card kit, the bookplate and Mochi load only when a card is asked for.
const WikiTopicCard = React.lazy(() => import('../components/WikiTopicCard.jsx'));

const TONE = {
  strong: 'var(--clr-sage-text)',
  ok: 'var(--clr-ocean-text)',
  weak: 'var(--clr-gold-text)',
  warn: 'var(--clr-rose-text)',
  muted: 'var(--clr-ink-soft)',
};

const subjectMeta = (id) => SUBJECTS.find((s) => s.id === id) || null;
const subjectName = (id) => subjectMeta(id)?.name || id.toUpperCase();
// รายการอ่าน lists a course's topics that are not hidden: 198 of the 210 wiki
// topics (11 are VetWiki-only pages from MSD tables and catalogs, 1 hidden), and
// only those can be marked read or counted as read.
const inReadingList = (subject, topic) => !!subjectMeta(subject)?.topics?.some((t) => t.id === topic && !t.hidden);
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
                    ? <a href={s.url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--clr-ocean-text)' }}>{citationText(s)}</a>
                    : <span>{citationText(s)}</span>}
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
export function WikiIndex({ topics, onOpen, onOpenSection, goHome, focusSubject = null, readingChecklist = null }) {
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
          isListed={(t) => inReadingList(t.subject, t.topic)}
          isRead={(t) => !!readingChecklist && inReadingList(t.subject, t.topic) && isTopicRead(readingChecklist, t.subject, t.topic)}
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
const pad2 = (i) => String(i + 1).padStart(2, '0');

function ConflictLegend() {
  return <p className="vw-legend"><span className="vw-flag" aria-hidden="true">!</span> คือมีจุดที่หลักฐานไม่ตรงกับที่บรรยาย</p>;
}

// The contents: one list for the box in the page, the rail beside it and the
// phone's sheet. Marked only where something differs from the norm (1,625 of
// 1,783 sections are checked, so a tick on each was noise); the section being
// read carries aria-current and the rail's ink bar.
function TocList({ sections, active, onJump, long = false, activeRef = null }) {
  return (
    <ol className={long ? 'is-long' : undefined}>
      {sections.map((s, i) => (
        <li key={s.id} className={i === active ? 'is-active' : undefined}>
          <span className="vw-num" aria-hidden="true">{pad2(i)}</span>
          <a href={`#${s.id}`}
            ref={i === active ? activeRef : undefined}
            className="vmx-wiki-toc-link"
            aria-current={i === active ? 'location' : undefined}
            onClick={(e) => { e.preventDefault(); onJump(s.id); }}>
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
  );
}

// The phone's contents: the pill opens it over the page, focus starts on the
// entry being read (in view, though there can be 127), stays inside, and
// Escape or a tap outside closes it; choosing an entry goes there.
function TocSheet({ sections, active, conflictCount, onJump, onClose }) {
  const activeRef = useRef(null);
  const dialogRef = useModalFocus({ onClose, initialFocusRef: activeRef });
  useLayoutEffect(() => {
    const sheet = dialogRef.current;
    const a = activeRef.current;
    if (!sheet || !a) return;
    sheet.scrollTop += a.getBoundingClientRect().top - sheet.getBoundingClientRect().top - sheet.clientHeight / 3;
  }, [dialogRef]);
  return (
    <div className="vmx-modal-overlay vw-sheet-overlay" onClick={onClose}>
      <div ref={dialogRef} className="vw-sheet" role="dialog" aria-modal="true" aria-labelledby="vw-sheet-title" tabIndex={-1}
        data-vmx-modal="true" onClick={(e) => e.stopPropagation()}>
        <div className="vw-sheet-head">
          <h2 id="vw-sheet-title">
            สารบัญ <span aria-hidden="true">{active + 1}/{sections.length}</span>
            <span className="vmx-sr-only">อ่านถึงหัวข้อย่อยที่ {active + 1} จาก {sections.length}</span>
          </h2>
          <button type="button" className="vmx-btn vmx-btn-ghost vmx-btn-sm" onClick={onClose} aria-label="ปิด">✕</button>
        </div>
        {conflictCount > 0 && <ConflictLegend />}
        <TocList sections={sections} active={active} onJump={onJump} activeRef={activeRef} />
      </div>
    </div>
  );
}

// "ทำเครื่องหมายว่าอ่านแล้ว" writes รายการอ่าน itself (lib/study-progress.js,
// synced with the account), so the stamp here and the tick there are one fact.
// The date shows only when the list holds one.
function ReadMark({ current, reading }) {
  const [said, setSaid] = useState('');
  const { checklist, setChecklist } = reading;
  const read = isTopicRead(checklist, current.subject, current.topic);
  const stored = read ? (checklist[topicProgressKey(current.subject, current.topic)] ?? checklist[current.topic]) : null;
  const when = Number.isFinite(stored) && stored > 0 ? thaiDay(new Date(stored).toLocaleDateString('en-CA')) : '';
  const meta = subjectMeta(current.subject);
  // The pressed button gives way to the other one: focus follows it, or a
  // keyboard or screen reader user was left on <body> at the end of the page.
  const buttonRef = useRef(null);
  const handOver = useRef(false);
  useEffect(() => {
    if (!handOver.current) return;
    handOver.current = false;
    buttonRef.current?.focus();
  }, [read]);
  const mark = (value) => {
    handOver.current = true;
    const saved = setChecklist((prev) => setTopicRead(prev, current.subject, current.topic, value));
    setSaid(saved?.accepted === false ? 'บันทึกไม่สำเร็จ โปรดลองใหม่'
      : value ? 'บันทึกในรายการอ่านแล้ว' : 'เอาออกจากรายการอ่านแล้ว');
  };
  return (
    <div className="vw-readmark">
      {read ? (
        <>
          <Mochi state="happy" size={52} slot="wiki-end" className="vw-readmark-mochi" />
          <p className="vw-stamp">
            <b>อ่านแล้ว</b>
            <span>{[meta?.code, meta?.name].filter(Boolean).join(' ')}</span>
            {when && <span>{when}</span>}
          </p>
          <button type="button" ref={buttonRef} className="vw-quiet" onClick={() => mark(false)}>ยกเลิกว่าอ่านแล้ว</button>
        </>
      ) : (
        <button type="button" ref={buttonRef} className="vmx-btn vmx-btn-primary" onClick={() => mark(true)}>ทำเครื่องหมายว่าอ่านแล้ว</button>
      )}
      <p className={`vw-readmark-said${said.startsWith('บันทึกไม่') ? ' is-fail' : ''}`} role="status">{said}</p>
    </div>
  );
}

// The end of a chapter: mark it read, the topics either side of it, the ones
// that check against the same sources, and the rest of its volume.
function ChapterEnd({ current, siblings, prev, next, neighbours, reading, checklist, onOpen }) {
  // Read as รายการอ่าน counts it: only a topic it lists can be read.
  const isRead = (t) => !!checklist && inReadingList(t.subject, t.topic) && isTopicRead(checklist, t.subject, t.topic);
  return (
    <section className="vw-end" aria-label="ท้ายหัวข้อ">
      {reading && <ReadMark current={current} reading={reading} />}
      {(prev || next) && (
        <nav className="vw-pager" aria-label="หัวข้ออื่นในวิชานี้">
          {prev && (
            <button type="button" className="vw-pager-btn is-prev" onClick={() => onOpen(prev.id)}>
              <span><span aria-hidden="true">← </span>หัวข้อก่อนหน้า</span>
              <b>{keepSilentFinals(prev.title)}</b>
            </button>
          )}
          {next && (
            <button type="button" className="vw-pager-btn is-next" onClick={() => onOpen(next.id)}>
              <span>หัวข้อถัดไป<span aria-hidden="true"> →</span></span>
              <b>{keepSilentFinals(next.title)}</b>
            </button>
          )}
        </nav>
      )}
      {neighbours.length > 0 && (
        <div className="vw-end-block">
          <h2>หัวข้อที่อ้างแหล่งเดียวกัน</h2>
          <ul className="vw-end-list">
            {neighbours.map(({ topic: t, shared }) => (
              <li key={t.id}>
                <button type="button" onClick={() => onOpen(t.id)}>
                  <b>{keepSilentFinals(t.title)}</b>
                  <span>
                    {t.subject !== current.subject ? `${subjectName(t.subject)}, ` : ''}ใช้แหล่งอ้างอิงร่วมกัน {shared} แหล่ง
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      {siblings.length > 1 && (
        <div className="vw-end-block">
          <h2>ในเล่มเดียวกัน</h2>
          <ol className="vw-end-list is-volume">
            {siblings.map((t, i) => (
              <li key={t.id}>
                {t.id === current.id ? (
                  <span className="is-here" aria-current="page">
                    <span className="vw-num" aria-hidden="true">{pad2(i)}</span>
                    <b>{keepSilentFinals(t.title)}</b>
                    <span>หัวข้อนี้</span>
                  </span>
                ) : (
                  <button type="button" onClick={() => onOpen(t.id)}>
                    <span className="vw-num" aria-hidden="true">{pad2(i)}</span>
                    <b>{keepSilentFinals(t.title)}</b>
                    {isRead(t) && <span className="vw-read-mark">อ่านแล้ว</span>}
                  </button>
                )}
              </li>
            ))}
          </ol>
        </div>
      )}
    </section>
  );
}

// One section of an article, memoised: the reading position changes the
// article's state at every section boundary, and a 127-section article
// re-rendered every section's text each time.
const Section = React.memo(function Section({ s, i, chips, knowledgeId, copiedState, onCopyAnchor, onGoToSource }) {
  // The checked state is the norm and goes unmarked; only an exception
  // (course logistics, a draft) carries a badge.
  const rev = s.reviewStatus === 'verified' ? null : REVIEW_LABEL[s.reviewStatus];
  const noteRef = (s.sourceRefs || [])[0];
  return (
    <section id={s.id} className="vw-section">
      <div className="vw-section-text">
        <div className="vw-h2row">
          <span className="vw-num" aria-hidden="true">{pad2(i)}</span>
          <h2 className="vw-h2" tabIndex={-1}>{keepSilentFinals(s.heading)}</h2>
          <StatusBadge label={rev} />
          <button type="button" onClick={() => onCopyAnchor(s.id)}
            className={`vw-anchor${copiedState === 'done' ? ' is-done' : ''}`}
            title="คัดลอกลิงก์มายังหัวข้อย่อยนี้" aria-label={`คัดลอกลิงก์: ${s.heading}`}>
            {copiedState === 'done' ? '✓' : copiedState === 'fail' ? '✕' : '#'}
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
      </div>
      <SectionEvidence chips={chips} onGoToSource={onGoToSource} />
      <div className="vw-section-report">
        <ReportConcern topicId={knowledgeId} sectionId={s.id} sectionHeading={s.heading} />
      </div>
    </section>
  );
});

function WikiArticle({ topic: current, knowledge, prov, onBackToIndex, onOpen, chapter, siblings, prev, next, neighbours, reading, checklist, goPractice, practiceLabel, goNotes, onShowProv, shareUrl }) {
  const [copied, setCopied] = useState('');
  const copyTimer = useRef(null);
  useEffect(() => () => clearTimeout(copyTimer.current), []);
  const sections = knowledge.sections;

  // Sources numbered across the article (lib/vetwiki/cite.js): the chips under
  // each section and the list at the end share the numbers.
  const cites = useMemo(() => articleCitations(sections, resolveSource), [sections]);

  // On a phone the contents box sits in the page; once it is above the
  // screen, a pill offers it again. It stands aside from the end of the
  // chapter on (reached 200 px early), where it would cover the mark-read
  // button and the topics either side. Measured in the frame handler below,
  // not observed: a jump past the box (a shared #section link, the sheet)
  // never makes it intersect, so an observer never said it was away.
  const tocRef = useRef(null);
  const endRef = useRef(null);
  const [tocAway, setTocAway] = useState(false);
  const [endNear, setEndNear] = useState(false);
  const [tocOpen, setTocOpen] = useState(() => !prefersCompactReading());
  const [sheetOpen, setSheetOpen] = useState(false);

  // Where the reader is: the section whose top has passed 30% of the screen,
  // how far through the article, and whether the contents box and the end
  // are on screen, in one frame-throttled scroll handler. The progress lines
  // take a transform by ref (no render per frame; a state that has not
  // changed renders nothing); they carry information, so they keep tracking
  // under reduced motion, without easing.
  const mainRef = useRef(null);
  const barRef = useRef(null);
  const railRef = useRef(null);
  const railFillRef = useRef(null);
  const [active, setActive] = useState(0);
  useEffect(() => {
    const main = mainRef.current;
    if (!main) return undefined;
    const els = sections.map((s) => document.getElementById(s.id));
    let frame = 0;
    const measure = () => {
      frame = 0;
      const line = window.innerHeight * 0.3;
      let at = 0;
      for (let i = 0; i < els.length; i++) {
        if (els[i] && els[i].getBoundingClientRect().top <= line) at = i;
        else break;
      }
      setActive(at);
      // display:none (the rail's widths) measures 0: never away.
      if (tocRef.current) setTocAway(tocRef.current.getBoundingClientRect().bottom < 0);
      if (endRef.current) setEndNear(endRef.current.getBoundingClientRect().top < window.innerHeight + 200);
      const r = main.getBoundingClientRect();
      const span = r.height - window.innerHeight;
      const p = span > 0 ? Math.min(1, Math.max(0, -r.top / span)) : 1;
      if (barRef.current) barRef.current.style.transform = `scaleX(${p})`;
      if (railFillRef.current) railFillRef.current.style.transform = `scaleY(${p})`;
    };
    const onScroll = () => { if (!frame) frame = window.requestAnimationFrame(measure); };
    measure();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [sections]);
  // A long rail scrolls inside itself; keep the entry being read in view
  // without moving the page (scrollIntoView would). Measured against the rail
  // itself: an entry's offsetTop counts from the list, under the heading and
  // the legend, and was 33 to 85 px short.
  useEffect(() => {
    const rail = railRef.current;
    const li = rail?.querySelector('li.is-active');
    if (!rail || !li || rail.scrollHeight <= rail.clientHeight) return;
    const top = li.getBoundingClientRect().top - rail.getBoundingClientRect().top;
    if (top < 0 || top + li.offsetHeight > rail.clientHeight) {
      rail.scrollTop += top - rail.clientHeight / 3;
    }
  }, [active]);

  // An in-page jump moves focus as a real link would, to the section's
  // heading (or the list entry), so Tab carries on from there.
  const jumpTo = useCallback((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ block: 'start', behavior: motionIsReduced() ? 'auto' : 'smooth' });
    const target = el.classList.contains('vw-section') ? el.querySelector('.vw-h2') : el;
    target?.focus({ preventScroll: true });
  }, []);
  const goToSource = useCallback((n) => jumpTo(`vw-src-${n}`), [jumpTo]);
  const jumpFromSheet = (id) => {
    setSheetOpen(false);
    // After the sheet has handed focus back to the pill, take it on.
    window.requestAnimationFrame(() => jumpTo(id));
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
  const copyAnchor = useCallback(async (sectionId) => {
    const url = wikiUrl(window.location.origin, current.subject, current.topic, sectionId);
    // copyText answers { ok, ... }; the object itself is always truthy.
    const { ok } = await copyText(url);
    setCopied(ok ? sectionId : `fail:${sectionId}`);
    clearTimeout(copyTimer.current);
    copyTimer.current = setTimeout(() => setCopied(''), 1600);
  }, [current.subject, current.topic]);

  const lastReviewed = useMemo(() => {
    const dates = [];
    for (const s of sections) for (const c of s.claims || []) if (c.review?.reviewedAt) dates.push(c.review.reviewedAt);
    return dates.sort().pop() || null;
  }, [sections]);

  // Counted off the sections themselves rather than a second index, so the
  // headline number and the notes below it can never disagree.
  const conflictCount = useMemo(
    () => sections.reduce((n, s) => n + (s.corrections?.length || 0), 0),
    [sections],
  );
  const firstConflictId = useMemo(
    () => sections.find((s) => s.corrections?.length)?.id || '',
    [sections],
  );

  // One "แชร์" menu in place of three buttons: copy the link, the phone's own
  // share sheet where there is one, and print (where saving a PDF lives).
  const [shareOpen, setShareOpen] = useState(false);
  const [cardOpen, setCardOpen] = useState(false);
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
  // the button can sit just above the tab bar, which covered the menu. Four
  // items of 44 px, the menu's 8 px padding and its 6 px offset make 198.
  const [shareUp, setShareUp] = useState(false);
  const toggleShare = () => {
    if (!shareOpen) {
      const r = shareButtonRef.current?.getBoundingClientRect();
      const nav = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--vmx-bottom-nav-h')) || 0;
      setShareUp(!!r && r.bottom + 210 > window.innerHeight - nav && r.top > 210);
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
  const sourceCount = cites.list.length;
  const hasToc = sections.length > 2;

  return (
    <div className="vmx-view vw vw-article">
      <Mochi state="read" size={36} slot="wiki-reading" className="vmx-hero-mochi" />
      <FeatureTip id="knowledge" surface="article" />
      <div className={`vw-grid${hasToc ? ' has-rail' : ''}`}>
        <div className="vw-main" ref={mainRef}>
          <div className="vw-progress" aria-hidden="true"><span ref={barRef} /></div>
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
                <a href="#vw-sources" className="vw-strip-cell"
                  onClick={(e) => { e.preventDefault(); jumpTo('vw-sources'); }}>
                  <b>{sourceCount.toLocaleString('en-US')}</b>
                  <span>แหล่งอ้างอิง</span>
                </a>
              )}
              {conflictCount > 0 && (
                <a
                  href={`#${firstConflictId}`}
                  className="vw-strip-cell is-conflict"
                  onClick={(e) => { e.preventDefault(); jumpTo(firstConflictId); }}
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
                  <li><button type="button" onClick={() => { closeShare(); setCardOpen(true); }}>บันทึกเป็นภาพการ์ด</button></li>
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

          {/* Contents in the page, where the rail has no room. */}
          {hasToc && (
            <nav ref={tocRef} tabIndex={-1} className="vmx-wiki-toc vw-toc" aria-label="สารบัญในหน้า">
              <div className="vw-toc-head">
                {/* Folded at first on a phone: nine entries pushed the first
                    section a screen and a half down. */}
                <h2>
                  <button type="button" className="vw-toc-toggle" aria-expanded={tocOpen} onClick={() => setTocOpen((v) => !v)}>
                    สารบัญ {sections.length} หัวข้อย่อย
                    <span aria-hidden="true">{tocOpen ? '▾' : '▸'}</span>
                  </button>
                </h2>
                {tocOpen && conflictCount > 0 && <ConflictLegend />}
              </div>
              {tocOpen && <TocList sections={sections} active={active} onJump={jumpTo} long={sections.length > 6} />}
            </nav>
          )}

          {/* Sections */}
          <ReadingEffects contentKey={knowledge.id}>
          <div className="vw-sections">
            {sections.map((s, i) => (
              <Section key={s.id} s={s} i={i} chips={cites.perSection[i]} knowledgeId={knowledge.id}
                copiedState={copied === s.id ? 'done' : copied === `fail:${s.id}` ? 'fail' : ''}
                onCopyAnchor={copyAnchor} onGoToSource={goToSource} />
            ))}
          </div>
          </ReadingEffects>

          <div ref={endRef} aria-hidden="true" className="vmx-reading-end" />
          <ChapterEnd current={current} siblings={siblings} prev={prev} next={next}
            neighbours={neighbours} reading={reading} checklist={checklist} onOpen={onOpen} />
          <SourceList list={cites.list} sections={sections} onJump={jumpTo} />
        </div>
        {/* The contents beside the article where there is room, after it in
            the page so Tab reaches the title first (styles-wiki.css places it). */}
        {hasToc && (
          <nav ref={railRef} className="vw-rail" aria-label="สารบัญ">
            <p className="vw-rail-head">สารบัญ</p>
            {conflictCount > 0 && <ConflictLegend />}
            <div className="vw-rail-list">
              <span className="vw-rail-track" aria-hidden="true"><span ref={railFillRef} /></span>
              <TocList sections={sections} active={active} onJump={jumpTo} />
            </div>
          </nav>
        )}
      </div>
      {/* Kept while its sheet is open (the sheet covers it): closing the sheet
          hands focus back to it, and it used to be gone, leaving <body>. */}
      {hasToc && (sheetOpen || (tocAway && !endNear)) && (
        <button type="button" className="vmx-wiki-toc-return" aria-haspopup="dialog" aria-expanded={sheetOpen}
          aria-label={`สารบัญ อ่านถึงหัวข้อย่อยที่ ${active + 1} จาก ${sections.length}`} onClick={() => setSheetOpen(true)}>
          สารบัญ <span className="vw-pill-count" aria-hidden="true">{active + 1}/{sections.length}</span>
        </button>
      )}
      {sheetOpen && (
        <TocSheet sections={sections} active={active} conflictCount={conflictCount}
          onJump={jumpFromSheet} onClose={() => setSheetOpen(false)} />
      )}
      {cardOpen && (
        <OptionalFeature label="การ์ดหัวข้อ" onClose={() => setCardOpen(false)}>
          <WikiTopicCard
            subject={current.subject} topic={current.topic} title={knowledge.title}
            subjectName={subjectName(current.subject)} chapter={chapter}
            claims={prov?.verifiedClaimCount || 0} sources={sourceCount} conflicts={conflictCount}
            url={shareUrl} onClose={() => setCardOpen(false)}
          />
        </OptionalFeature>
      )}
    </div>
  );
}

// ================= SHELL =================
export default function KnowledgeView({ subject, topic, openNonce = 0, setView, setSubject, setTopic, goHome, startExam, readingChecklist, setReadingChecklist }) {
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
  // The article's volume, in the registry's order, which is the course's
  // (lib/vetwiki/index.js): "หัวข้อที่ 3 จาก 7", the topics either side, and
  // the volume's contents at the end.
  const siblings = useMemo(
    () => (current ? topics.filter((t) => t.subject === current.subject) : []),
    [topics, current],
  );
  const chapter = useMemo(() => {
    if (!current) return null;
    return { index: siblings.findIndex((t) => t.id === current.id) + 1, count: siblings.length };
  }, [siblings, current]);
  // Topics that check against at least two of the same sources, counted when
  // the registry is built (scripts/lib/vetwiki-shelf.mjs).
  const neighbours = useMemo(
    () => (current ? (SHELF_RELATED[current.id] || [])
      .map(([id, shared]) => ({ topic: topics.find((t) => t.id === id), shared }))
      .filter((x) => x.topic) : []),
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
      <WikiIndex topics={topics} onOpen={openTopic} onOpenSection={openSection} goHome={goHome} readingChecklist={readingChecklist}
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

  // Only a topic รายการอ่าน lists can be marked read here (198 of 210; 11
  // are VetWiki-only pages from MSD tables and catalogs, 1 is hidden).
  const reading = inReadingList(current.subject, current.topic) && setReadingChecklist
    ? { checklist: readingChecklist || {}, setChecklist: setReadingChecklist } : null;

  return (
    <>
      <WikiArticle key={current.id}
        topic={current} knowledge={knowledge} prov={prov} chapter={chapter} siblings={siblings}
        checklist={readingChecklist || null}
        prev={siblings[chapter.index - 2] || null} next={siblings[chapter.index] || null}
        neighbours={neighbours} reading={reading}
        onBackToIndex={backToIndex} onOpen={openTopic}
        goPractice={goPractice} practiceLabel={practice.label} goNotes={goNotes} onShowProv={() => setShowProv(true)}
        shareUrl={wikiUrl(typeof window!=='undefined'?window.location.origin:'', current.subject, current.topic)}
      />
      {showProv && prov && <ProvenancePanel prov={prov} onClose={() => setShowProv(false)} />}
    </>
  );
}
