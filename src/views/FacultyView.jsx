// ============================================================
// FacultyView — browse all 17 instructors at a glance
// ============================================================
// Shows a sortable / searchable grid of every instructor whose
// research profile is in the knowledge base. Click a card → opens
// InstructorModal (lazy-loaded, same as TopicSelectView path).
//
// Reachable from:
//   • ⌘K palette → "👨‍🏫 Faculty" entry
//   • About page link
//   • setView('faculty') from anywhere
// ============================================================

import { lazy, Suspense, useMemo, useState } from 'react';
import { ALL_INSTRUCTORS } from '../data/instructors.js';
import { SUBJECTS } from '../data/curriculum.js';
import BackBar from '../components/BackBar.jsx';

const InstructorModal = lazy(() => import('../components/InstructorModal.jsx'));

const SUBJECT_META = SUBJECTS.reduce((acc, s) => { acc[s.id] = s; return acc; }, {});

export default function FacultyView({ goHome }) {
  const [openInstructor, setOpenInstructor] = useState(null);
  const [filter, setFilter] = useState(''); // text search
  const [subjectFilter, setSubjectFilter] = useState('all'); // 'all' | 'com3' | 'com4' | 'com5' | 'exotic'

  const filtered = useMemo(() => {
    const q = filter.trim().toLowerCase();
    return (ALL_INSTRUCTORS || []).filter((ins) => {
      // Subject filter
      if (subjectFilter !== 'all') {
        if (!(ins.subjects || []).includes(subjectFilter)) return false;
      }
      // Text filter (name, position, areas)
      if (q) {
        const hay = [
          ins.nameEn, ins.nameTh, ins.position, ins.department,
          ...(ins.areas || []),
        ].filter(Boolean).join(' ').toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    }).sort((a, b) => (a.nameEn || '').localeCompare(b.nameEn || ''));
  }, [filter, subjectFilter]);

  const subjectFilters = [
    { id: 'all', label: 'ทุกวิชา', icon: '👥' },
    { id: 'com3', label: 'COM III', icon: '🚨' },
    { id: 'com4', label: 'COM IV', icon: '🩺' },
    { id: 'com5', label: 'COM V', icon: '🐕' },
    { id: 'exotic', label: 'Exotic', icon: '🦜' },
  ];

  return (
    <>
      <BackBar onBack={goHome} label="หน้าแรก" />

      <div className="vmx-hero">
        <h1>👨‍🏫 อาจารย์ <em>ผู้สอน</em></h1>
        <p>{ALL_INSTRUCTORS.length} ท่านที่สอนวิชาในระบบ · กดที่การ์ดเพื่อดูประวัติ + งานวิจัย</p>
      </div>

      {/* Search + subject filter */}
      <div style={{
        display: 'flex',
        gap: 12,
        marginBottom: 20,
        flexWrap: 'wrap',
        alignItems: 'center',
      }}>
        <input
          type="text"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="🔍 ค้นชื่อ / ตำแหน่ง / สาขาวิจัย"
          style={{
            flex: '1 1 240px',
            minWidth: 0,
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
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {subjectFilters.map((sf) => {
            const active = subjectFilter === sf.id;
            return (
              <button
                key={sf.id}
                onClick={() => setSubjectFilter(sf.id)}
                className="vmx-nav-btn"
                style={{
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
      </div>

      {/* Result count */}
      <div style={{
        fontSize: 12,
        fontFamily: 'JetBrains Mono, monospace',
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
  const { nameEn, nameTh, position, areas, papers, subjects } = instructor;
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
      {/* Subject pills (top-right) */}
      <div style={{ position: 'absolute', top: 10, right: 12, display: 'flex', gap: 4, flexWrap: 'wrap' }}>
        {(subjects || []).map((sid) => {
          const meta = SUBJECT_META[sid];
          return (
            <span
              key={sid}
              style={{
                fontSize: 10,
                fontFamily: 'JetBrains Mono, monospace',
                color: meta?.color || 'var(--clr-ink-soft)',
                background: 'var(--clr-bg)',
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
      </div>

      {/* Name */}
      <div style={{ marginRight: 70 /* room for pills */ }}>
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
        fontFamily: 'JetBrains Mono, monospace',
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
