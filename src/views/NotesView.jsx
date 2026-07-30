import { useEffect, useMemo, useRef, useState } from 'react';
import { NOTES_COM5 } from '../data/notes-com5.js';
import { NOTES_COM3 } from '../data/notes-com3.js';
import { NOTES_COM4 } from '../data/notes-com4.js';
import { NOTES_ENGPROF } from '../data/notes-engprof.js';
import { NOTES_EXOTIC } from '../data/notes-exotic.js';
import { NOTES_REPRO_LECT } from '../data/notes-repro-lect.js';
import { NOTES_PRACTRUM } from '../data/notes-practrum.js';
import { NOTES_POULTRY } from '../data/notes-poultry.js';
import { NOTES_CLIAPPRUM } from '../data/notes-cliapprum.js';
// ── Y5 scaffolded notes (2026-05-12) — outlines from senior cache,
// sections source-cited to slide pages 1-3. Deep body content marked
// 🚧 รอเติม per IRON RULE 0 (no fabrication of medicine).
import { NOTES_Y5_ZOONOSES } from '../data/notes-y5-zoonoses.js';
import { NOTES_Y5_MILK_MEAT_HYGIENE } from '../data/notes-y5-milk-meat-hygiene.js';
import { NOTES_Y5_EQUINE_MEDICINE } from '../data/notes-y5-equine-medicine.js';
import { SUBJECTS } from '../data/curriculum.js';
import { RichText } from '../lib/richtext.jsx';
import { hasTopic } from '../lib/vetwiki/index.js';
import { FEATURE_FLAGS } from '../lib/feature-registry.js';
import BackBar from '../components/BackBar.jsx';
import ImageAnnotator from '../components/ImageAnnotator.jsx';
import TemplateLibrary from '../components/TemplateLibrary.jsx';

// ============================================================
// NotesView — ทวนเนื้อหา (study notes per topic)
// ============================================================
//
// Props:
//   subject: string (com3 | com5)
//   initialTopic: string | null    — open this topic by default
//   setSubject: function (optional, for in-view subject switching)
//   goBack, goHome
// ============================================================

const NOTES_BY_SUBJECT = {
  com5: NOTES_COM5,
  com4: NOTES_COM4,
  com3: NOTES_COM3,
  engprof: NOTES_ENGPROF,
  exotic: NOTES_EXOTIC,
  'repro-lect': NOTES_REPRO_LECT,
  practrum: NOTES_PRACTRUM,
  poultry: NOTES_POULTRY,
  cliapprum: NOTES_CLIAPPRUM,
  // Y5 scaffolded notes (top-3 priority subjects from cache inventory)
  zoonoses: NOTES_Y5_ZOONOSES,
  'milk-meat-hygiene': NOTES_Y5_MILK_MEAT_HYGIENE,
  'equine-medicine': NOTES_Y5_EQUINE_MEDICINE,
};

// Walk a section's structured body and collect all searchable text
// into a single lower-cased string. Done once per (topic, section)
// pair via a WeakMap cache, so the filter never re-stringifies the
// 5-20KB section tree on every keystroke.
//
// Previous implementation did `JSON.stringify(sec).toLowerCase()` per
// section per keystroke — for a 50-section topic that's ~500KB of
// string ops on every typed letter.
const _sectionHaystackCache = new WeakMap();
function getSectionHaystack(sec) {
  if (!sec || typeof sec !== 'object') return '';
  const cached = _sectionHaystackCache.get(sec);
  if (cached !== undefined) return cached;
  const buf = [];
  const walk = (v) => {
    if (v == null) return;
    if (typeof v === 'string') { buf.push(v); return; }
    if (typeof v === 'number' || typeof v === 'boolean') { buf.push(String(v)); return; }
    if (Array.isArray(v)) { for (const it of v) walk(it); return; }
    if (typeof v === 'object') {
      for (const k in v) walk(v[k]);
    }
  };
  walk(sec);
  const out = buf.join(' ').toLowerCase();
  _sectionHaystackCache.set(sec, out);
  return out;
}

export default function NotesView({ subject: subjectProp = 'com5', initialTopic = null, setSubject: setSubjectProp, goBack, goHome, onOpenWiki }) {
  const [activeSubject, setActiveSubjectLocal] = useState(subjectProp);
  const subject = activeSubject;
  // Memoised — only re-derives when subject changes. The previous
  // version recomputed topicIds + subjectMeta on every render
  // (including every keystroke in the search box).
  const { notes, subjectMeta, topicIds } = useMemo(() => {
    const n = NOTES_BY_SUBJECT[subject] || {};
    const sm = SUBJECTS.find((s) => s.id === subject);
    const ids = (sm?.topics || []).map((t) => t.id).filter((id) => n[id]);
    Object.keys(n).forEach((id) => { if (!ids.includes(id)) ids.push(id); });
    return { notes: n, subjectMeta: sm, topicIds: ids };
  }, [subject]);
  const [activeTopic, setActiveTopic] = useState(() => initialTopic && notes[initialTopic] ? initialTopic : topicIds[0]);
  const [search, setSearch] = useState('');
  // Debounced version drives the filter — 80ms below input-echo threshold
  // but plenty to coalesce a burst of fast typing.
  const [debouncedSearch, setDebouncedSearch] = useState('');
  useEffect(() => {
    if (search === debouncedSearch) return;
    const t = setTimeout(() => setDebouncedSearch(search), 80);
    return () => clearTimeout(t);
  }, [search, debouncedSearch]);

  // ✅ Derive a guaranteed-valid topic for the current subject. Using the
  //    activeTopic state directly leaves a render cycle with the previous
  //    subject's id (→ blank page) when the user switches subjects.
  const validTopic = topicIds.includes(activeTopic) ? activeTopic : topicIds[0];

  const switchSubject = (next) => {
    setActiveSubjectLocal(next);
    // Use curriculum order to pick first topic
    const nextSubject = SUBJECTS.find((s) => s.id === next);
    const nextNotes = NOTES_BY_SUBJECT[next] || {};
    const nextTopics = (nextSubject?.topics || []).map((t) => t.id).filter((id) => nextNotes[id]);
    if (nextTopics.length > 0) setActiveTopic(nextTopics[0]);
    if (setSubjectProp) setSubjectProp(next);
  };

  const availableSubjects = Object.keys(NOTES_BY_SUBJECT);

  const topic = notes[validTopic];
  const mainRef = useRef(null);
  const sectionRefs = useRef({});

  // Template picker → ImageAnnotator (in 'template' mode) bridge.
  // showTemplateLibrary controls the picker modal; activeTemplate (set
  // from the picker's onPick) opens the annotator with that SVG as the
  // canvas background. Closing either resets that piece of state only,
  // so the user can open the picker again without re-entering Notes.
  const [showTemplateLibrary, setShowTemplateLibrary] = useState(false);
  const [activeTemplate, setActiveTemplate] = useState(null);

  // Reset scroll + search when topic changes
  useEffect(() => {
    if (mainRef.current) mainRef.current.scrollTop = 0;
    setSearch('');
  }, [validTopic, subject]);

  if (!topic) {
    return (
      <>
        <BackBar onBack={goBack || goHome} label={goBack ? 'เลือก topic อื่น' : 'หน้าแรก'} />
        <div className="vmx-hero"><h1>ทวน <em>เนื้อหา</em></h1></div>
        <div className="vmx-empty">ยังไม่มีโน้ตสำหรับวิชานี้</div>
        <div className="vmx-btn-row">
          <button className="vmx-btn vmx-btn-ghost" onClick={goHome}>← หน้าแรก</button>
        </div>
      </>
    );
  }

  // Filter sections by search. Each section's haystack is cached in
  // a module-scope WeakMap (see getSectionHaystack) so a 50-section
  // topic doesn't re-stringify ~500KB of JSON on every keystroke.
  const filteredSections = useMemo(() => {
    const q = debouncedSearch.trim().toLowerCase();
    if (!q) return topic.sections;
    return topic.sections.filter((sec) => getSectionHaystack(sec).includes(q));
  }, [topic.sections, debouncedSearch]);

  return (
    <>
      <BackBar onBack={goBack || goHome} label={goBack ? 'เลือก topic อื่น' : 'หน้าแรก'} subtitle={`${subjectMeta?.icon || ''} ${subjectMeta?.name || ''}`} />
      <div className="vmx-hero">
        <h1>ทวน <em>เนื้อหา</em></h1>
        <p>
          {subjectMeta?.icon} {subjectMeta?.name}, เนื้อหาดึงจาก slide lecture 2026 + master compilation (ทุก section มี source citation)
        </p>
      </div>

      <div className="vmx-notes-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(220px, 280px) 1fr', gap: 16, alignItems: 'flex-start' }}>
        {/* Topic sidebar */}
        <div className="vmx-notes-sidebar" style={{ position: 'sticky', top: 16, display: 'flex', flexDirection: 'column', gap: 6 }}>
          {/* Subject switcher */}
          {availableSubjects.length > 1 && (
            <>
              <div style={{ fontSize: 11, fontFamily: 'JetBrains Mono, monospace', color: 'var(--clr-ink-soft)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>
                วิชา
              </div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
                {availableSubjects.map((sid) => {
                  const meta = SUBJECTS.find((s) => s.id === sid);
                  const active = sid === subject;
                  return (
                    <button
                      key={sid}
                      onClick={() => switchSubject(sid)}
                      style={{
                        all: 'unset',
                        cursor: 'pointer',
                        padding: '6px 12px',
                        borderRadius: 999,
                        background: active ? 'var(--clr-ink)' : 'var(--clr-surface)',
                        color: active ? 'var(--clr-bg)' : 'var(--clr-ink)',
                        border: '1px solid var(--clr-border)',
                        fontSize: 12,
                        fontWeight: active ? 600 : 500,
                      }}
                    >
                      {meta?.icon} {meta?.name}
                    </button>
                  );
                })}
              </div>
            </>
          )}
          <div style={{ fontSize: 11, fontFamily: 'JetBrains Mono, monospace', color: 'var(--clr-ink-soft)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>
            หัวข้อ
          </div>
          {topicIds.map((id) => {
            const t = notes[id];
            const active = id === validTopic;
            return (
              <button
                key={id}
                onClick={() => setActiveTopic(id)}
                style={{
                  all: 'unset',
                  display: 'block',
                  cursor: 'pointer',
                  padding: '10px 12px',
                  borderRadius: 10,
                  background: active ? 'var(--clr-rose-soft)' : 'var(--clr-surface)',
                  border: `1px solid ${active ? 'var(--clr-rose)' : 'var(--clr-border)'}`,
                  borderLeft: active ? '4px solid var(--clr-rose)' : '1px solid var(--clr-border)',
                  transition: 'all 0.12s',
                }}
              >
                <div style={{ fontSize: 13, fontWeight: active ? 600 : 500, lineHeight: 1.3 }}>
                  {t.icon} {t.title}
                </div>
                <div style={{ fontSize: 10, color: 'var(--clr-ink-soft)', fontStyle: 'italic', marginTop: 4 }}>
                  by Aj. {t.lecturer}
                </div>
                <div style={{ fontSize: 10, fontFamily: 'JetBrains Mono, monospace', color: 'var(--clr-ink-soft)', marginTop: 4 }}>
                  {t.sections.length} sections
                </div>
              </button>
            );
          })}
          <div className="vmx-btn-row" style={{ marginTop: 12, flexDirection: 'column' }}>
            <button className="vmx-btn vmx-btn-ghost vmx-btn-sm" onClick={() => window.print()} style={{ justifyContent: 'center' }}>🖨 พิมพ์</button>
            {goBack && <button className="vmx-btn vmx-btn-ghost vmx-btn-sm" onClick={goBack} style={{ justifyContent: 'center' }}>← ย้อนกลับ</button>}
            <button className="vmx-btn vmx-btn-ghost vmx-btn-sm" onClick={goHome} style={{ justifyContent: 'center' }}>หน้าแรก</button>
          </div>
        </div>

        {/* Main content */}
        <div ref={mainRef}>
          <div style={{ marginBottom: 16, padding: 16, borderRadius: 12, background: 'var(--clr-surface)', border: '1px solid var(--clr-border)' }}>
            <div style={{ fontSize: 11, fontFamily: 'JetBrains Mono, monospace', color: 'var(--clr-ink-soft)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>
              Topic, by Aj. {topic.lecturer}
            </div>
            <h2 style={{ margin: '0 0 8px', fontFamily: 'Fraunces, serif', fontSize: 22, fontWeight: 600 }}>
              {topic.icon} {topic.title}
            </h2>
            {topic.summary && (
              <div style={{ fontSize: 13, color: 'var(--clr-ink-soft)', lineHeight: 1.6, marginBottom: 12 }}>
                💡 <strong>TL;DR —</strong> {topic.summary}
              </div>
            )}
            {/* Cross-link to the governed VetWiki version — only for topics
                that actually have one, and only while the feature is on. */}
            {FEATURE_FLAGS.VETWIKI_ENABLED !== false && onOpenWiki && hasTopic(subject, validTopic) && (
              <button
                type="button"
                className="vmx-chip"
                onClick={() => onOpenWiki(subject, validTopic)}
                title="ดูหัวข้อนี้แบบบอกที่มาได้ทุกส่วน"
                style={{ marginBottom: 10, cursor: 'pointer' }}
              >
                🧬 ดูฉบับตรวจสอบได้ใน VetWiki
              </button>
            )}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
              <button
                type="button"
                onClick={() => setShowTemplateLibrary(true)}
                className="vmx-btn vmx-btn-ghost vmx-btn-sm"
                style={{ minHeight: 44 }}
                title="เปิดคลัง template (skeleton, ECG, dental, lab values…)"
              >
                🩻 วาดบน template
              </button>
            </div>
            <input
              type="search"
              placeholder="ค้นหาใน notes ของหัวข้อนี้..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: '100%', padding: '8px 12px', fontSize: 13, borderRadius: 8, border: '1px solid var(--clr-border)', background: 'var(--clr-bg)', color: 'var(--clr-ink)', fontFamily: 'inherit' }}
            />
          </div>

          {filteredSections.length === 0 && (
            <div className="vmx-empty">ไม่พบ section ที่ตรงกับ "{search}"</div>
          )}

          {/* highlight prop uses the debounced value so RichText doesn't
              re-walk every text node on every keystroke. The visible
              <input> still reads `search` for instant feedback. */}
          {filteredSections.map((section, idx) => (
            <SectionBlock key={idx} section={section} idx={idx} highlight={debouncedSearch} />
          ))}
        </div>
      </div>

      {showTemplateLibrary && (
        <TemplateLibrary
          onPick={(url) => setActiveTemplate(url)}
          onClose={() => setShowTemplateLibrary(false)}
        />
      )}
      {activeTemplate && (
        <ImageAnnotator
          mode="template"
          templateUrl={activeTemplate}
          alt="anatomy template"
          onClose={() => setActiveTemplate(null)}
        />
      )}
    </>
  );
}

// ── Single section ─────────────────────────────────────────────
function SectionBlock({ section, idx, highlight }) {
  const [open, setOpen] = useState(true);

  return (
    <div style={{ marginBottom: 16, borderRadius: 12, background: 'var(--clr-surface)', border: '1px solid var(--clr-border)', overflow: 'hidden' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{ all: 'unset', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 18px', width: '100%', boxSizing: 'border-box', borderBottom: open ? '1px solid var(--clr-border)' : 'none' }}
      >
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 10, fontFamily: 'JetBrains Mono, monospace', color: 'var(--clr-ink-soft)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 2 }}>
            §{idx + 1}
          </div>
          <div style={{ fontFamily: 'Fraunces, serif', fontSize: 17, fontWeight: 600, lineHeight: 1.3 }}>
            <RichText text={section.heading} highlight={highlight} />
          </div>
        </div>
        <div style={{ fontSize: 14, color: 'var(--clr-ink-soft)', marginLeft: 10 }}>{open ? '▾' : '▸'}</div>
      </button>

      {open && (
        <div style={{ padding: '16px 20px', fontSize: 14, lineHeight: 1.65 }}>
          {section.body.map((item, i) => <BodyItem key={i} item={item} highlight={highlight} />)}
          {section.source && (
            <div style={{ marginTop: 14, paddingTop: 10, borderTop: '1px dashed var(--clr-border)', fontSize: 11, fontFamily: 'JetBrains Mono, monospace', color: 'var(--clr-ink-soft)', fontStyle: 'italic' }}>
              ดึงจาก: {section.source}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Polymorphic body item renderer ─────────────────────────────
function BodyItem({ item, highlight }) {
  if (item == null) return null;

  if (typeof item === 'string') {
    return <p style={{ margin: '0 0 10px' }}><RichText text={item} highlight={highlight} /></p>;
  }

  if (item.bullets) {
    return (
      <ul style={{ margin: '0 0 12px', paddingLeft: 22, lineHeight: 1.7 }}>
        {item.bullets.map((b, i) => (
          <li key={i} style={{ marginBottom: 4 }}>
            <RichText text={typeof b === 'string' ? b : `${b.label}: ${b.value}`} highlight={highlight} />
          </li>
        ))}
      </ul>
    );
  }

  if (item.sub) {
    return (
      <div style={{ margin: '12px 0', paddingLeft: 14, borderLeft: '3px solid var(--clr-border)' }}>
        <div style={{ fontFamily: 'Fraunces, serif', fontWeight: 600, fontSize: 14, marginBottom: 8, color: 'var(--clr-ink)' }}>
          <RichText text={item.sub} highlight={highlight} />
        </div>
        {item.body?.map((b, i) => <BodyItem key={i} item={b} highlight={highlight} />)}
      </div>
    );
  }

  if (item.table) {
    const { headers, rows } = item.table;
    return (
      <div style={{ overflowX: 'auto', margin: '12px 0' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, lineHeight: 1.5 }}>
          <thead>
            <tr style={{ background: 'var(--clr-surface-2)' }}>
              {headers.map((h, i) => (
                <th key={i} style={{ padding: '8px 10px', borderBottom: '1px solid var(--clr-border)', textAlign: 'left', fontFamily: 'JetBrains Mono, monospace', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--clr-ink-soft)' }}>
                  <RichText text={h} highlight={highlight} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} style={{ borderBottom: '1px solid var(--clr-border)' }}>
                {row.map((cell, j) => (
                  <td key={j} style={{ padding: '8px 10px', verticalAlign: 'top' }}>
                    <RichText text={cell} highlight={highlight} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (item.callout) {
    const palette = {
      tip: { bg: 'rgba(74, 107, 74, 0.10)', border: 'var(--clr-sage)', icon: '💡' },
      warn: { bg: 'rgba(184, 137, 64, 0.12)', border: 'var(--clr-gold)', icon: '⚠️' },
      flag: { bg: 'var(--clr-rose-soft)', border: 'var(--clr-rose)', icon: '🚩' },
    };
    const p = palette[item.kind] || palette.tip;
    return (
      <div style={{ margin: '12px 0', padding: '10px 14px', borderRadius: 10, background: p.bg, borderLeft: `4px solid ${p.border}`, fontSize: 13, lineHeight: 1.6 }}>
        <span style={{ marginRight: 6 }}>{p.icon}</span>
        <RichText text={item.callout} highlight={highlight} />
      </div>
    );
  }

  return null;
}

// RichText is now imported from src/lib/richtext.jsx and used everywhere
