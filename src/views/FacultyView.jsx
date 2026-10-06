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

import { lazy, memo, Suspense, useEffect, useMemo, useState } from 'react';
import { ALL_INSTRUCTORS } from '../data/instructors.js';
import { SUBJECTS } from '../data/curriculum.js';
import BackBar from '../components/BackBar.jsx';
import NavIcon from '../components/NavIcon.jsx';

const InstructorModal = lazy(() => import('../components/InstructorModal.jsx'));

const SUBJECT_META = SUBJECTS.reduce((acc, s) => { acc[s.id] = s; return acc; }, {});

// ─────────────────────────────────────────────────────────────
// Department grouping — simplifies long dept names to chip labels
// ─────────────────────────────────────────────────────────────
const DEPT_RULES = [
  { id: 'medicine',     label: 'Medicine',      icon: '🩺', match: (d) => /medicine|อายุรศาสตร์/i.test(d) && !/aquatic|public health|สาธารณสุข/i.test(d) },
  { id: 'surgery',      label: 'Surgery',       icon: '🔪', match: (d) => /surgery|ศัลยศาสตร์/i.test(d) },
  { id: 'pathology',    label: 'Pathology',     icon: '🔬', match: (d) => /pathology|พยาธิวิทยา/i.test(d) },
  { id: 'microbiology', label: 'Microbiology',  icon: '🦠', match: (d) => /microbiology|จุลชีววิทยา/i.test(d) },
  { id: 'parasitology', label: 'Parasitology',  icon: '🪲', match: (d) => /parasitology|ปรสิตวิทยา/i.test(d) },
  { id: 'pharmacology', label: 'Pharmacology',  icon: '💊', match: (d) => /pharmacology|เภสัชวิทยา/i.test(d) },
  { id: 'physiology',   label: 'Physiology',    icon: '❤️', match: (d) => /physiology|สรีรวิทยา/i.test(d) },
  { id: 'biochem',      label: 'Biochemistry',  icon: '🧪', match: (d) => /biochem|ชีวเคมี/i.test(d) },
  { id: 'anatomy',      label: 'Anatomy',       icon: '🦴', match: (d) => /anatomy|กายวิภาคศาสตร์/i.test(d) },
  { id: 'vph',          label: 'VPH',           icon: '🧫', match: (d) => /public health|vph|สัตวแพทยสาธารณสุข/i.test(d) },
  { id: 'reproduction', label: 'Reproduction',  icon: '🐎', match: (d) => /obstetrics|reproduction|theriogenology|สูติศาสตร์|สืบพันธุ์/i.test(d) },
  { id: 'husbandry',    label: 'Husbandry',     icon: '🌾', match: (d) => /husbandry|สัตวบาล/i.test(d) },
  { id: 'external',     label: 'External',      icon: '🌍', match: (d) => /zpot|betagro|industry|animal space|kasetsart|mahidol/i.test(d) },
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

const STATUS_META = {
  faculty: { label: 'บุคลากรปัจจุบัน', icon: '🏛️' },
  emeritus: { label: 'ศาสตราจารย์กิตติคุณ', icon: '🎓' },
  researcher: { label: 'โปรไฟล์นักวิจัย', icon: '🔬' },
  external: { label: 'วิทยากรภายนอก', icon: '🌍' },
  historical: { label: 'ข้อมูลผู้สอนย้อนหลัง', icon: '🗂️' },
};

export default function FacultyView({ goHome }) {
  const [openInstructor, setOpenInstructor] = useState(null);
  const [filter, setFilter] = useState('');
  // Debounced version drives the actual filter — typing fast no longer
  // recomputes the haystack 135× per keystroke.
  const [debouncedFilter, setDebouncedFilter] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [deptFilter, setDeptFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  // 13+ dept chips wrap into a label-less third row; collapsed by default
  // the row stays one line and the rest live behind this toggle.
  const [showAllDepts, setShowAllDepts] = useState(false);

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
        ins.institution, ins.nickname, ...(ins.aliases || []),
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

  const statusChips = useMemo(() => {
    const counts = {};
    for (const { ins } of instructorIndex) counts[ins.status] = (counts[ins.status] || 0) + 1;
    return Object.entries(counts)
      .filter(([id]) => STATUS_META[id])
      .map(([id, count]) => ({ id, count, ...STATUS_META[id] }));
  }, [instructorIndex]);

  const filtered = useMemo(() => {
    const q = debouncedFilter.trim().toLowerCase();
    const out = [];
    for (const entry of instructorIndex) {
      const { ins } = entry;
      if (subjectFilter !== 'all' && !(ins.subjects || []).includes(subjectFilter)) continue;
      if (deptFilter !== 'all' && entry._deptId !== deptFilter) continue;
      if (statusFilter !== 'all' && ins.status !== statusFilter) continue;
      if (q && !entry._hayLc.includes(q)) continue;
      out.push(entry);
    }
    // Sort by pre-lowered key with native compare — ASCII-only names
    // give the same order as localeCompare at ~20× the speed.
    out.sort((a, b) => (a._sortKey < b._sortKey ? -1 : a._sortKey > b._sortKey ? 1 : 0));
    return out.map((e) => e.ins);
  }, [instructorIndex, debouncedFilter, subjectFilter, deptFilter, statusFilter]);

  const subjectFilters = [
    { id: 'all', label: 'ทุกวิชา', icon: '👥' },
    { id: 'com3', label: 'COM III', icon: '🚨' },
    { id: 'com4', label: 'COM IV', icon: '🩺' },
    { id: 'com5', label: 'COM V', icon: '🐕' },
    { id: 'exotic', label: 'Exotic', icon: '🦜' },
    { id: 'poultry', label: 'Poultry', icon: '🐔' },
  ];

  // Collapsed = the six busiest depts; the active one is always kept
  // visible even when it falls outside the top six.
  const visibleDeptChips = useMemo(() => {
    if (showAllDepts) return departmentChips;
    const top = departmentChips.slice(0, 6);
    if (deptFilter !== 'all' && !top.some((dc) => dc.id === deptFilter)) {
      const active = departmentChips.find((dc) => dc.id === deptFilter);
      if (active) top.push(active);
    }
    return top;
  }, [departmentChips, showAllDepts, deptFilter]);
  const hiddenDeptCount = departmentChips.length - visibleDeptChips.length;
  const hasActiveFilters =
    subjectFilter !== 'all' || deptFilter !== 'all' || statusFilter !== 'all' || filter.trim() !== '';

  const clearAllFilters = () => {
    setFilter('');
    setDebouncedFilter('');
    setSubjectFilter('all');
    setDeptFilter('all');
    setStatusFilter('all');
  };

  return (
    <>
      <BackBar onBack={goHome} label="หน้าแรก" />

      <div className="vmx-hero">
        <h1>คณาจารย์และ<em>ผู้สอน</em></h1>
        <p>{ALL_INSTRUCTORS.length} โปรไฟล์, ผลงานวิจัยคัดเลือก {ALL_INSTRUCTORS.reduce((sum, ins) => sum + (ins.papers?.length || 0), 0)} รายการ, ตรวจสอบล่าสุด 12 ส.ค. 2569</p>
      </div>

      <div className="vmx-fac-toolbar">
        {/* Search */}
        <div className="vmx-fac-search">
          <span className="vmx-fac-search-icon" aria-hidden="true"><NavIcon name="search" size={16} /></span>
          <input
            type="text"
            aria-label="ค้นหาอาจารย์"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="ค้นชื่อ / ตำแหน่ง / ภาควิชา / สาขาวิจัย"
            autoComplete="off"
          />
          {filter && (
            <button
              type="button"
              className="vmx-fac-search-clear"
              onClick={() => setFilter('')}
              aria-label="ล้างคำค้นหา"
              title="ล้างคำค้นหา"
            >
              <NavIcon name="close" size={13} />
            </button>
          )}
        </div>

        {/* Subject filter */}
        <div className="vmx-fac-filter-group">
          <span className="vmx-fac-filter-label">วิชา</span>
          <div className="vmx-chip-row" role="group" aria-label="กรองตามวิชา">
            {subjectFilters.map((sf) => (
              <button
                key={sf.id}
                type="button"
                className={`vmx-chip${subjectFilter === sf.id ? ' active' : ''}`}
                aria-pressed={subjectFilter === sf.id}
                onClick={() => setSubjectFilter(sf.id)}
              >
                {sf.icon} {sf.label}
              </button>
            ))}
          </div>
        </div>

        {/* Department filter */}
        <div className="vmx-fac-filter-group">
          <span className="vmx-fac-filter-label">ภาควิชา</span>
          <div className="vmx-chip-row" role="group" aria-label="กรองตามภาควิชา">
            <button
              type="button"
              className={`vmx-chip${deptFilter === 'all' ? ' active' : ''}`}
              aria-pressed={deptFilter === 'all'}
              onClick={() => setDeptFilter('all')}
            >
              🏛️ ทุกภาค
            </button>
            {visibleDeptChips.map((dc) => (
              <button
                key={dc.id}
                type="button"
                className={`vmx-chip${deptFilter === dc.id ? ' active' : ''}`}
                aria-pressed={deptFilter === dc.id}
                onClick={() => setDeptFilter(dc.id)}
              >
                {dc.icon} {dc.label} <span style={{ opacity: 0.6 }}>{dc.count}</span>
              </button>
            ))}
            {hiddenDeptCount > 0 && (
              <button
                type="button"
                className="vmx-fac-chip-toggle"
                onClick={() => setShowAllDepts(true)}
                aria-label={`แสดงภาควิชาที่ซ่อนอีก ${hiddenDeptCount} ภาค`}
              >
                แสดงอีก {hiddenDeptCount} ภาค…
              </button>
            )}
          </div>
        </div>

        {/* Status filter */}
        <div className="vmx-fac-filter-group">
          <span className="vmx-fac-filter-label">สถานะ</span>
          <div className="vmx-chip-row" role="group" aria-label="กรองตามสถานะ">
            <button
              type="button"
              className={`vmx-chip${statusFilter === 'all' ? ' active' : ''}`}
              aria-pressed={statusFilter === 'all'}
              onClick={() => setStatusFilter('all')}
            >
              👥 ทุกสถานะ
            </button>
            {statusChips.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`vmx-chip${statusFilter === item.id ? ' active' : ''}`}
                aria-pressed={statusFilter === item.id}
                onClick={() => setStatusFilter(item.id)}
              >
                {item.icon} {item.label} <span style={{ opacity: 0.6 }}>{item.count}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Result count + reset */}
        <div className="vmx-fac-toolbar-foot">
          <span className="vmx-fac-count" role="status">
            แสดง {filtered.length} / {ALL_INSTRUCTORS.length} โปรไฟล์
          </span>
          {hasActiveFilters && (
            <button type="button" className="vmx-fac-clear" onClick={clearAllFilters}>
              ล้างตัวกรองทั้งหมด
            </button>
          )}
        </div>
      </div>

      {/* Faculty grid */}
      {filtered.length === 0 ? (
        <div className="vmx-empty">ไม่พบอาจารย์ที่ตรงกับ "{filter}"</div>
      ) : (
        <div className="vmx-fac-grid">
          {filtered.map((ins) => (
            <FacultyCard
              key={ins.slug}
              instructor={ins}
              onOpen={setOpenInstructor}
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

// Memoised with a stable onOpen (the state setter): every keystroke in the
// search box re-renders FacultyView, and without this every card on screen
// rendered again with it. A card now renders only when it first appears.
const FacultyCard = memo(function FacultyCard({ instructor, onOpen }) {
  const { nameEn, nameTh, position, department, areas, papers, subjects, status, verification } = instructor;
  const deptId = classifyDept(department);
  const deptMeta = DEPT_META[deptId];

  // One compact tag top-right: the first subject carries the identity,
  // the rest collapse into "+N" (the modal lists them all). Departments
  // without subject mapping keep the dept tag instead.
  const firstSubject = subjects?.length ? SUBJECT_META[subjects[0]] : null;
  const extraSubjects = Math.max((subjects?.length || 1) - 1, 0);
  const tag = firstSubject
    ? { label: `${firstSubject.icon || '📚'} ${firstSubject.name || subjects[0]}`, title: firstSubject.name || subjects[0], isSubject: true }
    : (deptMeta ? { label: `${deptMeta.icon} ${deptMeta.label}`, title: deptMeta.label, isSubject: false } : null);

  return (
    <button
      type="button"
      className="vmx-fac-card"
      onClick={() => onOpen(instructor)}
    >
      <div className="vmx-fac-card-head">
        <div className="vmx-fac-card-names">
          {nameTh && <div className="vmx-fac-card-name-th">{nameTh}</div>}
          <div className="vmx-fac-card-name-en">{nameEn}</div>
        </div>
        {tag && (
          <span
            className={`vmx-fac-card-tag${tag.isSubject ? ' is-subject' : ''}`}
            title={tag.title}
          >
            {tag.label}
          </span>
        )}
        {extraSubjects > 0 && (
          <span className="vmx-fac-card-tag-more" title={(subjects || []).slice(1).map((sid) => SUBJECT_META[sid]?.name || sid).join(', ')}>
            +{extraSubjects}
          </span>
        )}
      </div>

      {/* Position */}
      {position && (
        <div className="vmx-fac-card-position">{position}</div>
      )}

      {/* Research areas (max 3 visible) */}
      {areas && areas.length > 0 && (
        <div className="vmx-fac-card-areas">
          {areas.slice(0, 3).map((a) => (
            <span key={a} className="vmx-fac-card-area">{a}</span>
          ))}
          {areas.length > 3 && (
            <span className="vmx-fac-card-areas-more">+{areas.length - 3}</span>
          )}
        </div>
      )}

      {/* Paper count + verification */}
      <div className="vmx-fac-card-foot">
        <span>📑 ผลงานคัดเลือก {papers?.length || 0}</span>
        <span
          className={`vmx-fac-card-foot-status${verification?.status === 'verified' ? ' is-verified' : ''}`}
        >
          {verification?.status === 'verified' ? '✓ ยืนยันแล้ว' : STATUS_META[status]?.label || 'ตรวจสอบบางส่วน'}
        </span>
      </div>
    </button>
  );
});
