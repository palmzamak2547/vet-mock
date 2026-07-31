// ============================================================
// FacultyView — browse all instructors at a glance
// ============================================================
// Shows a sortable / searchable grid of every instructor whose
// research profile is in the knowledge base. Click a card → opens
// InstructorModal (lazy-loaded, same as TopicSelectView path).
//
// Filters:
//   • Search box (name / position / dept / research areas)
//   • Subject chip row (com3 / com4 / com5 / exotic / poultry)
//   • Department chip row (Medicine / Surgery / Pathology / ...)
//
// Reachable from:
//   • ⌘K palette → "👨‍🏫 Faculty" entry
//   • About page link
//   • setView('faculty') from anywhere
// ============================================================

import { lazy, Suspense, useEffect, useMemo, useState } from 'react';
import { ALL_INSTRUCTORS } from '../data/instructors.js';
import { SUBJECTS } from '../data/curriculum.js';
import BackBar from '../components/BackBar.jsx';

const InstructorModal = lazy(() => import('../components/InstructorModal.jsx'));

const SUBJECT_META = SUBJECTS.reduce((acc, s) => { acc[s.id] = s; return acc; }, {});

// ─────────────────────────────────────────────────────────────
// Department grouping — simplifies long dept names to chip labels
// ─────────────────────────────────────────────────────────────
const DEPT_RULES = [
  { id: 'medicine',     label: 'Medicine',      icon: '🩺', match: (d) => /medicine/i.test(d) && !/aquatic|public health/i.test(d) },
  { id: 'surgery',      label: 'Surgery',       icon: '🔪', match: (d) => /surgery/i.test(d) },
  { id: 'pathology',    label: 'Pathology',     icon: '🔬', match: (d) => /pathology/i.test(d) },
  { id: 'microbiology', label: 'Microbiology',  icon: '🦠', match: (d) => /microbiology/i.test(d) },
  { id: 'parasitology', label: 'Parasitology',  icon: '🪲', match: (d) => /parasitology/i.test(d) },
  { id: 'pharmacology', label: 'Pharmacology',  icon: '💊', match: (d) => /pharmacology/i.test(d) },
  { id: 'physiology',   label: 'Physiology',    icon: '❤️', match: (d) => /physiology/i.test(d) },
  { id: 'biochem',      label: 'Biochemistry',  icon: '🧪', match: (d) => /biochem/i.test(d) },
  { id: 'anatomy',      label: 'Anatomy',       icon: '🦴', match: (d) => /anatomy/i.test(d) },
  { id: 'vph',          label: 'VPH',           icon: '🧫', match: (d) => /public health|vph/i.test(d) },
  { id: 'reproduction', label: 'Reproduction',  icon: '🐎', match: (d) => /obstetrics|reproduction|theriogenology/i.test(d) },
  { id: 'husbandry',    label: 'Husbandry',     icon: '🌾', match: (d) => /husbandry/i.test(d) },
  { id: 'external',     label: 'External',      icon: '🌍', match: (d) => /zpot|betagro|industry/i.test(d) },
];

function classifyDept(deptString) {
  if (!deptString) return 'other';
  for (const rule of DEPT_RULES) {
    if (rule.match(deptString)) return rule.id;
  }
  return 'other';
}

const DEPT_META = DEPT_RULES.reduce((acc, r) => { acc[r.id] = r; return acc; }, {
  other: { id: 'other', label: 'Other', icon: '📂' },
});

export default function FacultyView({ goHome }) {
  const [openInstructor, setOpenInstructor] = useState(null);
  const [filter, setFilter] = useState('');
  // Debounced version drives the actual filter — typing fast no longer
  // recomputes the haystack 135× per keystroke.
  const [debouncedFilter, setDebouncedFilter] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [deptFilter, setDeptFilter] = useState('all');

  useEffect(() => {
    if (filter === debouncedFilter) return;
    const t = setTimeout(() => setDebouncedFilter(filter), 80);
    return () => clearTimeout(t);
  }, [filter, debouncedFilter]);

  // Pre-lower-cased searchable haystack per instructor — computed ONCE
  // per mount (or when ALL_INSTRUCTORS changes, which never happens in
  // practice). Without this, every keystroke re-built and lowered 135
  // haystack strings from scratch.
  const instructorIndex = useMemo(() => {
    return (ALL_INSTRUCTORS || []).map((ins) => ({
      ins,
      _deptId: classifyDept(ins.department),
      _hayLc: [
        ins.nameEn, ins.nameTh, ins.position, ins.department,
        ...(ins.areas || []),
      ].filter(Boolean).join(' ').toLowerCase(),
      // Pre-lowered English name used as sort key. localeCompare is
      // ~20× slower than numeric < / > comparison, and since faculty
      // names are ASCII-Latin (no diacritics that need collation),
      // a plain lowercase string compare gives identical order.
      _sortKey: (ins.nameEn || '').toLowerCase(),
    }));
  }, []);

  // Compute department counts (for chip labels)
  const departmentCounts = useMemo(() => {
    const counts = {};
    for (const entry of instructorIndex) {
      counts[entry._deptId] = (counts[entry._deptId] || 0) + 1;
    }
    return counts;
  }, [instructorIndex]);

  // Department chips: sort by count desc
  const departmentChips = useMemo(() => {
    const ids = Object.keys(departmentCounts).filter((id) => departmentCounts[id] > 0);
    return ids
      .map((id) => ({ ...DEPT_META[id], count: departmentCounts[id] }))
      .sort((a, b) => b.count - a.count);
  }, [departmentCounts]);

  const filtered = useMemo(() => {
    const q = debouncedFilter.trim().toLowerCase();
    const out = [];
    for (const entry of instructorIndex) {
      const { ins } = entry;
      if (subjectFilter !== 'all' && !(ins.subjects || []).includes(subjectFilter)) continue;
      if (deptFilter !== 'all' && entry._deptId !== deptFilter) continue;
      if (q && !entry._hayLc.includes(q)) continue;
      out.push(entry);
    }
    // Sort by pre-lowered key with native compare — ASCII-only names
    // give the same order as localeCompare at ~20× the speed.
    out.sort((a, b) => (a._sortKey < b._sortKey ? -1 : a._sortKey > b._sortKey ? 1 : 0));
    return out.map((e) => e.ins);
  }, [instructorIndex, debouncedFilter, subjectFilter, deptFilter]);

  const subjectFilters = [
    { id: 'all', label: 'ทุกวิชา', icon: '👥' },
    { id: 'com3', label: 'COM III', icon: '🚨' },
    { id: 'com4', label: 'COM IV', icon: '🩺' },
    { id: 'com5', label: 'COM V', icon: '🐕' },
    { id: 'exotic', label: 'Exotic', icon: '🦜' },
    { id: 'poultry', label: 'Poultry', icon: '🐔' },
  ];

  return (
    <>
      <BackBar onBack={goHome} label="หน้าแรก" />

      <div className="vmx-hero">
        <h1>อาจารย์ <em>ผู้สอน</em></h1>
        <p>{ALL_INSTRUCTORS.length} ท่านที่มีโปรไฟล์ในฐานข้อมูล, กดที่การ์ดเพื่อดูประวัติ + งานวิจัย</p>
      </div>

      {/* Search */}
      <div style={{ marginBottom: 12 }}>
        <input
          type="text"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="ค้นชื่อ / ตำแหน่ง / ภาควิชา / สาขาวิจัย"
          style={{
            width: '100%',
            boxSizing: 'border-box',
            padding: '10px 14px',
            border: '1px solid var(--clr-border)',
            borderRadius: 999,
            background: 'var(--clr-surface)',
            color: 'var(--clr-ink)',
            fontFamily: 'inherit',
            fontSize: 14,
          }}
          autoComplete="off"
        />
      </div>

      {/* Subject filter chip row */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 8, alignItems: 'center' }}>
        <span style={{
          fontSize: 11, fontFamily: 'var(--vmx-mono)',
          color: 'var(--clr-ink-soft)', textTransform: 'uppercase',
          letterSpacing: '0.08em', marginRight: 4, minWidth: 60,
        }}>by subject</span>
        {subjectFilters.map((sf) => {
          const active = subjectFilter === sf.id;
          return (
            <button
              key={sf.id}
              onClick={() => setSubjectFilter(sf.id)}
              className="vmx-nav-btn"
              style={{
                padding: '4px 10px',
                fontSize: 12,
                background: active ? 'var(--clr-ink)' : 'transparent',
                color: active ? 'var(--clr-bg)' : 'var(--clr-ink-soft)',
                borderColor: active ? 'var(--clr-ink)' : 'var(--clr-border)',
              }}
            >
              {sf.icon} {sf.label}
            </button>
          );
        })}
      </div>

      {/* Department filter chip row */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16, alignItems: 'center' }}>
        <span style={{
          fontSize: 11, fontFamily: 'var(--vmx-mono)',
          color: 'var(--clr-ink-soft)', textTransform: 'uppercase',
          letterSpacing: '0.08em', marginRight: 4, minWidth: 60,
        }}>by dept</span>
        <button
          onClick={() => setDeptFilter('all')}
          className="vmx-nav-btn"
          style={{
            padding: '4px 10px',
            fontSize: 12,
            background: deptFilter === 'all' ? 'var(--clr-ink)' : 'transparent',
            color: deptFilter === 'all' ? 'var(--clr-bg)' : 'var(--clr-ink-soft)',
            borderColor: deptFilter === 'all' ? 'var(--clr-ink)' : 'var(--clr-border)',
          }}
        >
          🏛️ ทุกภาค
        </button>
        {departmentChips.map((dc) => {
          const active = deptFilter === dc.id;
          return (
            <button
              key={dc.id}
              onClick={() => setDeptFilter(dc.id)}
              className="vmx-nav-btn"
              style={{
                padding: '4px 10px',
                fontSize: 12,
                background: active ? 'var(--clr-ink)' : 'transparent',
                color: active ? 'var(--clr-bg)' : 'var(--clr-ink-soft)',
                borderColor: active ? 'var(--clr-ink)' : 'var(--clr-border)',
              }}
            >
              {dc.icon} {dc.label} <span style={{ opacity: 0.6 }}>,{dc.count}</span>
            </button>
          );
        })}
      </div>

      {/* Result count */}
      <div style={{
        fontSize: 12,
        fontFamily: 'var(--vmx-mono)',
        color: 'var(--clr-ink-soft)',
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        marginBottom: 12,
      }}>
        {filtered.length} / {ALL_INSTRUCTORS.length} instructors
      </div>

      {/* Faculty grid */}
      {filtered.length === 0 ? (
        <div className="vmx-empty">ไม่พบอาจารย์ที่ตรงกับ "{filter}"</div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 12,
        }}>
          {filtered.map((ins) => (
            <FacultyCard
              key={ins.slug}
              instructor={ins}
              onClick={() => setOpenInstructor(ins)}
            />
          ))}
        </div>
      )}

      <div className="vmx-btn-row" style={{ marginTop: 24 }}>
        <button className="vmx-btn vmx-btn-ghost" onClick={goHome}>← หน้าแรก</button>
      </div>

      {openInstructor && (
        <Suspense fallback={null}>
          <InstructorModal instructor={openInstructor} onClose={() => setOpenInstructor(null)} />
        </Suspense>
      )}
    </>
  );
}

function FacultyCard({ instructor, onClick }) {
  const { nameEn, nameTh, position, department, areas, papers, subjects } = instructor;
  const deptId = classifyDept(department);
  const deptMeta = DEPT_META[deptId];

  return (
    <button
      onClick={onClick}
      style={{
        all: 'unset',
        cursor: 'pointer',
        background: 'var(--clr-surface)',
        border: '1px solid var(--clr-border)',
        borderRadius: 12,
        padding: '16px 18px',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        textAlign: 'left',
        transition: 'all 0.15s',
        position: 'relative',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--clr-ink-soft)';
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--clr-border)';
        e.currentTarget.style.transform = '';
      }}
    >
      {/* Top-right pills: subjects + dept */}
      <div style={{ position: 'absolute', top: 10, right: 12, display: 'flex', gap: 4, flexWrap: 'wrap', justifyContent: 'flex-end', maxWidth: 110 }}>
        {(subjects || []).map((sid) => {
          const meta = SUBJECT_META[sid];
          return (
            <span
              key={sid}
              style={{
                fontSize: 11,
                fontFamily: 'var(--vmx-mono)',
                // The subject's own colour identifies the tag, but as 11px
                // text on cream several of them land at 2.7-3.2:1. It carries
                // the identity just as well as the border and a faint fill,
                // with the label in readable ink.
                color: 'var(--clr-ink)',
                background: meta?.color ? `color-mix(in srgb, ${meta.color} 12%, var(--clr-bg))` : 'var(--clr-bg)',
                padding: '2px 6px',
                borderRadius: 999,
                border: `1px solid ${meta?.color || 'var(--clr-border)'}`,
                fontWeight: 600,
              }}
            >
              {meta?.icon || '📚'} {sid}
            </span>
          );
        })}
        {/* Dept pill — only show if no subjects (avoid clutter) */}
        {(!subjects || subjects.length === 0) && deptMeta && (
          <span
            style={{
              fontSize: 11,
              fontFamily: 'var(--vmx-mono)',
              color: 'var(--clr-ink-soft)',
              background: 'var(--clr-surface-2)',
              padding: '2px 6px',
              borderRadius: 999,
              border: '1px solid var(--clr-border)',
            }}
          >
            {deptMeta.icon} {deptMeta.label}
          </span>
        )}
      </div>

      {/* Name */}
      <div style={{ marginRight: 110 /* room for pills */ }}>
        <div style={{ fontFamily: 'Fraunces, serif', fontSize: 18, fontWeight: 600, color: 'var(--clr-ink)', lineHeight: 1.2 }}>
          {nameEn}
        </div>
        {nameTh && (
          <div style={{ fontSize: 13, color: 'var(--clr-ink-soft)', marginTop: 2 }}>
            {nameTh}
          </div>
        )}
      </div>

      {/* Position */}
      {position && (
        <div style={{ fontSize: 12, color: 'var(--clr-ink-soft)', lineHeight: 1.4 }}>
          {position}
        </div>
      )}

      {/* Research areas (max 3 visible) */}
      {areas && areas.length > 0 && (
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginTop: 4 }}>
          {areas.slice(0, 3).map((a) => (
            <span
              key={a}
              style={{
                fontSize: 11,
                padding: '2px 8px',
                background: 'var(--clr-surface-2)',
                borderRadius: 999,
                color: 'var(--clr-ink)',
              }}
            >
              {a}
            </span>
          ))}
          {areas.length > 3 && (
            <span style={{ fontSize: 11, color: 'var(--clr-ink-soft)', padding: '2px 4px' }}>
              +{areas.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Paper count */}
      <div style={{
        fontSize: 11,
        fontFamily: 'var(--vmx-mono)',
        color: 'var(--clr-ink-soft)',
        marginTop: 4,
        display: 'flex',
        alignItems: 'center',
        gap: 6,
      }}>
        📑 {papers?.length || 0} notable papers
      </div>
    </button>
  );
}
