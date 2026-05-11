import { lazy, Suspense, useState } from 'react';
import { QB } from '../data/questions.js';
import { SUBJECTS, hiddenTopicIdsFor } from '../data/curriculum.js';
import BackBar from '../components/BackBar.jsx';

// Lazy — pulls instructors data (~30KB) only when user clicks an
// instructor name to view their profile. Most users browse topics
// without ever opening this, so we keep it out of the main bundle.
const InstructorModal = lazy(() => import('../components/InstructorModal.jsx'));

// VCA-specific: cross-link map from VCA topic id → existing notes subject
// (where direct match exists). Click "📖 Notes" chip → navigate to NotesView
// with that subject. Other species (swine, equine) have video summaries
// only — no NotesView entry yet, so we omit chips for those.
const VCA_NOTES_MAP = {
  exotic:   { subject: 'exotic',   label: 'Notes Exotic' },
  poultry:  { subject: 'poultry',  label: 'Notes Poultry' },
  ruminant: { subject: 'cliapprum', label: 'Notes Cli App Ruminant' },
  dogcat:   { subject: 'com5',     label: 'Notes COM V (Dog-Cat)' },
};

export default function TopicSelectView({ subject, setSubject, setTopic, setView, goHome, mode, setMode, setNumQuestions, setUseTimer, setTimePerQ, customQuestions = [], readingChecklist = {} }) {
  const [openInstructor, setOpenInstructor] = useState(null);

  // Open instructor profile by lecturer string. Looks up via the
  // helper in instructors.js which handles "(KB)" tag stripping +
  // partial match against Thai/English names.
  const openInstructorFor = async (lecturerString) => {
    const mod = await import('../data/instructors.js');
    const found = mod.getInstructorByLecturerString(lecturerString);
    if (found) setOpenInstructor(found);
  };

  const subjectMeta = SUBJECTS.find((s) => s.id === subject);
  // Filter out topics flagged hidden:true — used to defer topics that
  // aren't yet in scope (e.g. exotic midterm weeks while everyone
  // focuses on Final). Questions assigned to those topics still exist
  // in QB; they just don't appear as a selectable topic until the
  // flag flips.
  const topics = (subjectMeta?.topics || []).filter((t) => !t.hidden);
  const allQuestions = [...QB, ...customQuestions];

  // Reading-checklist summary for this subject
  const subjReadDone = topics.filter((t) => readingChecklist[t.id]).length;

  // Collections: virtual "ทำรวม" cards that bundle topics by prefix
  // (e.g. รวมหมาหอน covers 9 mahahon-* topics, รวม Term Paper covers 12 group* topics).
  const collections = subjectMeta?.collections || [];

  // For "all" topicId we exclude Qs whose topic is hidden — keeps the
  // header count consistent with the visible topic tiles below it.
  const _hiddenTopics = hiddenTopicIdsFor(subject);
  const countFor = (topicId) => {
    if (topicId === 'all') {
      return allQuestions.filter((q) => q.subject === subject && !_hiddenTopics.has(q.topic)).length;
    }
    // Collection card: count by topic prefix
    const coll = collections.find((c) => c.id === topicId);
    if (coll?.topicPrefix) {
      return allQuestions.filter((q) => q.subject === subject && q.topic?.startsWith(coll.topicPrefix)).length;
    }
    return allQuestions.filter((q) => q.subject === subject && q.topic === topicId).length;
  };

  // Past paper detection — `source` field starts with "ข้อสอบเก่า" or
  // contains "FINAL 86" / "FRDC" master compilation keywords.
  const isPastPaperQ = (q) => {
    if (!q?.source) return false;
    const s = String(q.source);
    return /ข้อสอบเก่า|FINAL\s*86|past\s*paper/i.test(s);
  };
  const pastPaperCountFor = (topicId) => {
    if (topicId === 'all') return allQuestions.filter((q) => q.subject === subject && isPastPaperQ(q)).length;
    return allQuestions.filter((q) => q.subject === subject && q.topic === topicId && isPastPaperQ(q)).length;
  };

  const choose = (topicId) => {
    setTopic(topicId === 'all' ? null : topicId);
    setView('config');
  };

  return (
    <>
      <BackBar onBack={goHome} label="หน้าแรก" subtitle={`${subjectMeta?.icon || ''} ${subjectMeta?.name || ''}`} />
      <div className="vmx-hero">
        <h1>เลือก <em>หัวข้อ</em></h1>
        <p>{subjectMeta?.icon} {subjectMeta?.name}, เลือกเฉพาะหัวข้อที่จะสอบ หรือทั้งหมดก็ได้</p>
        {topics.length > 0 && (
          <div
            onClick={() => setView('reading-checklist')}
            title="เปิดรายการอ่าน"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              marginTop: 8,
              padding: '4px 10px',
              borderRadius: 999,
              background: 'rgba(184, 137, 64, 0.12)',
              border: '1px solid var(--clr-gold)',
              fontSize: 12,
              fontFamily: 'JetBrains Mono, monospace',
              color: 'var(--clr-ink)',
              cursor: 'pointer',
            }}
          >
            📚 อ่านแล้ว <strong>{subjReadDone}/{topics.length}</strong>
          </div>
        )}
      </div>

      {/* PRIMARY actions — promoted to top so users see "what can I do
          with this subject" before topic drill-down. Mirrors the home
          mode grid pattern but scoped to this subject. */}
      <div className="vmx-section-label">เลือกการกระทำ</div>
      <div className="vmx-mode-grid" style={{ marginBottom: 20 }}>
        <button
          className="vmx-mode-card"
          onClick={() => {
            if (setMode) setMode('quick');
            setTopic(null);
            setView('config');
          }}
          style={{ borderColor: subjectMeta?.color }}
        >
          <div className="icon">📝</div>
          <div className="title">ฝึกซ้อม</div>
          <div className="sub">สุ่ม {countFor('all')} ข้อในวิชานี้, ปรับจำนวน/เวลาได้</div>
        </button>

        <button
          className="vmx-mode-card"
          onClick={() => {
            if (setMode) setMode('exam');
            if (setNumQuestions) setNumQuestions(50);
            if (setUseTimer) setUseTimer(true);
            if (setTimePerQ) setTimePerQ(60);
            setTopic(null);
            setView('config');
          }}
          style={{ borderColor: subjectMeta?.color }}
        >
          <div className="icon">🎓</div>
          <div className="title">สอบจริง</div>
          <div className="sub">50 ข้อ × 60 วิ, เลียนข้อสอบจริง</div>
        </button>

        <button
          className="vmx-mode-card"
          onClick={() => setView('notes')}
        >
          <div className="icon">📖</div>
          <div className="title">Notes / สรุป</div>
          <div className="sub">อ่าน slide สรุป, อ้างอิง slide จริง</div>
        </button>

        <button
          className="vmx-mode-card"
          onClick={() => setView('videos')}
        >
          <div className="icon">🎥</div>
          <div className="title">คลิปย้อนหลัง</div>
          <div className="sub">Video library, YouTube playlist</div>
        </button>
      </div>

      {subjectMeta?.examFormat && (
        <ExamFormatBanner format={subjectMeta.examFormat} accent={subjectMeta.color} />
      )}

      {/* VCA-only: extra mock exam preset row (Quick 25 / Mock 100 / Marathon 200).
          The standard "สอบจริง 50" above already handles the 50-question case. */}
      {subject === 'vca' && (
        <>
          <div className="vmx-section-label" style={{ marginTop: 24 }}>🩵 VCA Mock Exam Presets (cross-species)</div>
          <div className="vmx-mode-grid" style={{ marginBottom: 20 }}>
            <button
              className="vmx-mode-card"
              onClick={() => {
                if (setMode) setMode('exam');
                if (setNumQuestions) setNumQuestions(25);
                if (setUseTimer) setUseTimer(true);
                if (setTimePerQ) setTimePerQ(60);
                setTopic(null);
                setView('config');
              }}
              style={{ borderColor: '#5db4d3' }}
            >
              <div className="icon">⚡</div>
              <div className="title">Quick 25</div>
              <div className="sub">25 ข้อ × 60 วิ, ทำ 25 นาที</div>
            </button>

            <button
              className="vmx-mode-card"
              onClick={() => {
                if (setMode) setMode('exam');
                if (setNumQuestions) setNumQuestions(100);
                if (setUseTimer) setUseTimer(true);
                if (setTimePerQ) setTimePerQ(60);
                setTopic(null);
                setView('config');
              }}
              style={{ borderColor: '#5db4d3' }}
            >
              <div className="icon">🎯</div>
              <div className="title">Mock 100</div>
              <div className="sub">100 ข้อ × 60 วิ, ~100 นาที</div>
            </button>

            <button
              className="vmx-mode-card"
              onClick={() => {
                if (setMode) setMode('exam');
                if (setNumQuestions) setNumQuestions(200);
                if (setUseTimer) setUseTimer(true);
                if (setTimePerQ) setTimePerQ(60);
                setTopic(null);
                setView('config');
              }}
              style={{ borderColor: '#5db4d3' }}
            >
              <div className="icon">🏁</div>
              <div className="title">Marathon 200</div>
              <div className="sub">200 ข้อ × 60 วิ, stamina training</div>
            </button>

            <button
              className="vmx-mode-card"
              onClick={() => {
                if (setMode) setMode('quick');
                if (setNumQuestions) setNumQuestions(316);
                if (setUseTimer) setUseTimer(false);
                setTopic(null);
                setView('config');
              }}
              style={{ borderColor: '#5db4d3' }}
            >
              <div className="icon">📚</div>
              <div className="title">All 316</div>
              <div className="sub">ทุกข้อ, ไม่จับเวลา, ฝึกล้วน</div>
            </button>
          </div>
        </>
      )}

      <div className="vmx-section-label">หรือเลือกหัวข้อเฉพาะ</div>
      <div className="vmx-subject-grid">
        {/* All-topics card */}
        <button
          key="all"
          className="vmx-subject-card"
          onClick={() => choose('all')}
        >
          <div className="accent" style={{ background: subjectMeta?.color || 'var(--clr-ink)' }}></div>
          <div className="icon">📚</div>
          <div className="title">รวมทุกหัวข้อ</div>
          <div className="sub">All topics in {subjectMeta?.name}</div>
          <div className="count">{countFor('all')} ข้อ</div>
        </button>

        {/* Collection cards — virtual "ทำรวม" bundles for grouped topic blocks */}
        {collections.map((c) => {
          const cnt = countFor(c.id);
          return (
            <button
              key={c.id}
              className="vmx-subject-card"
              disabled={cnt === 0}
              onClick={() => { if (cnt > 0) choose(c.id); }}
              style={{ opacity: cnt === 0 ? 0.5 : 1, cursor: cnt === 0 ? 'not-allowed' : 'pointer' }}
            >
              <div className="accent" style={{ background: c.accent || subjectMeta?.color || 'var(--clr-ink)' }}></div>
              <div className="icon">{c.label.match(/^\p{Emoji}/u)?.[0] || '📦'}</div>
              <div className="title">{c.label.replace(/^\p{Emoji}\s*/u, '')}</div>
              <div className="sub">{c.sub}</div>
              <div className="count">{cnt} ข้อ</div>
            </button>
          );
        })}

        {topics.map((t) => {
          const count = countFor(t.id);
          const ppCount = pastPaperCountFor(t.id);
          const ppPct = count > 0 ? Math.round((ppCount / count) * 100) : 0;
          const isEmpty = count === 0;
          const isRead = !!readingChecklist[t.id];
          return (
            <button
              key={t.id}
              className="vmx-subject-card"
              disabled={isEmpty}
              onClick={() => { if (!isEmpty) choose(t.id); }}
              style={{
                opacity: isEmpty ? 0.5 : 1,
                cursor: isEmpty ? 'not-allowed' : 'pointer',
                position: 'relative',
              }}
              title={isEmpty ? 'ยังไม่มีข้อสอบในหัวข้อนี้' : ''}
            >
              <div className="accent" style={{ background: subjectMeta?.color || 'var(--clr-ink)' }}></div>
              {isRead && (
                <div
                  aria-label="อ่านแล้ว"
                  title="อ่านแล้ว"
                  style={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    width: 22,
                    height: 22,
                    borderRadius: '50%',
                    background: 'var(--clr-sage)',
                    color: 'var(--clr-bg)',
                    fontSize: 12,
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                  }}
                >
                  ✓
                </div>
              )}
              <div className="icon">{t.icon || '📑'}</div>
              <div className="title">{t.label}</div>
              {t.lecturer && (
                <div
                  className="sub"
                  style={{ fontStyle: 'italic', cursor: 'pointer', textDecoration: 'underline dotted', textUnderlineOffset: 3 }}
                  onClick={(e) => { e.stopPropagation(); openInstructorFor(t.lecturer); }}
                  title="ดูโปรไฟล์อาจารย์ + งานวิจัย"
                >
                  by Aj. {t.lecturer}{t.lecturer_year && ` (${t.lecturer_year})`} 🔗
                </div>
              )}
              <div className="count" style={{ color: isEmpty ? 'var(--clr-rose)' : 'var(--clr-ink-soft)' }}>
                {isEmpty ? '🚧 รอข้อสอบเพิ่ม' : `${count} ข้อ`}
              </div>
              {ppCount > 0 && !isEmpty && (
                <div
                  title={`มีข้อสอบเก่า ${ppCount}/${count} ข้อ (${ppPct}% ของหัวข้อนี้) — ส่วนใหญ่หัวข้อนี้น่าจะออกในข้อสอบจริง`}
                  style={{
                    marginTop: 6,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4,
                    padding: '2px 8px',
                    borderRadius: 999,
                    background: 'rgba(184, 137, 64, 0.12)',
                    border: '1px solid var(--clr-gold)',
                    fontSize: 11,
                    fontFamily: 'JetBrains Mono, monospace',
                    color: 'var(--clr-gold)',
                  }}
                >
                  📚 อิงแนวเดิม {ppCount}/{count}, {ppPct}%
                </div>
              )}
              {t.lecturerNote && !isEmpty && (
                <div style={{ marginTop: 8, padding: '6px 8px', borderRadius: 6, background: 'var(--clr-surface-2)', fontSize: 10, color: 'var(--clr-ink-soft)', fontStyle: 'italic', textAlign: 'left', lineHeight: 1.4 }}>
                  ⚠️ {t.lecturerNote}
                </div>
              )}
              {/* VCA-only: cross-link chip → matched NotesView subject */}
              {subject === 'vca' && VCA_NOTES_MAP[t.id] && !isEmpty && (
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    if (setSubject) setSubject(VCA_NOTES_MAP[t.id].subject);
                    if (setTopic) setTopic(null);
                    setView('notes');
                  }}
                  title={`เปิด Notes: ${VCA_NOTES_MAP[t.id].label}`}
                  style={{
                    marginTop: 6,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4,
                    padding: '2px 8px',
                    borderRadius: 999,
                    background: 'rgba(93, 180, 211, 0.12)',
                    border: '1px solid #5db4d3',
                    fontSize: 11,
                    fontFamily: 'JetBrains Mono, monospace',
                    color: '#3a8aa8',
                    cursor: 'pointer',
                  }}
                >
                  📖 {VCA_NOTES_MAP[t.id].label}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom-row buttons removed — Notes/Videos moved to top action
          panel; "หน้าแรก" available via BackBar. Saves vertical space
          on long subjects (cliapprum has ~30 topic cards). */}

      {openInstructor && (
        <Suspense fallback={null}>
          <InstructorModal instructor={openInstructor} onClose={() => setOpenInstructor(null)} />
        </Suspense>
      )}
    </>
  );
}

// ─── Exam-format banner (shows up when subject has examFormat metadata) ───
function ExamFormatBanner({ format, accent }) {
  const items = [];
  if (format.weight) items.push({ k: 'สัดส่วนวิชา', v: format.weight });
  if (format.perSession) items.push({ k: 'จำนวนข้อ', v: format.perSession });
  if (format.totalEstimate) items.push({ k: 'รวมประมาณ', v: format.totalEstimate });
  if (format.choiceCount) items.push({ k: 'รูปแบบ', v: `MCQ ${format.choiceCount} ช้อยส์ (A-${String.fromCharCode(64 + format.choiceCount)})` });

  return (
    <div style={{
      padding: '14px 18px',
      borderRadius: 12,
      borderLeft: `4px solid ${accent || 'var(--clr-ink)'}`,
      background: 'var(--clr-surface)',
      border: '1px solid var(--clr-border)',
      marginBottom: 20,
    }}>
      <div style={{ fontSize: 11, fontFamily: 'JetBrains Mono, monospace', color: 'var(--clr-ink-soft)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
        📝 รูปแบบของชุดโจทย์ฝึก
      </div>

      {items.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 18px', marginBottom: format.notes?.length || format.questionTypes?.length ? 10 : 0 }}>
          {items.map((it) => (
            <div key={it.k} style={{ fontSize: 13 }}>
              <span style={{ color: 'var(--clr-ink-soft)' }}>{it.k}: </span>
              <strong style={{ color: 'var(--clr-ink)' }}>{it.v}</strong>
            </div>
          ))}
        </div>
      )}

      {format.questionTypes?.length > 0 && (
        <ul style={{ margin: '6px 0 0', paddingLeft: 20, fontSize: 12.5, lineHeight: 1.7, color: 'var(--clr-ink)' }}>
          {format.questionTypes.map((q, i) => (
            <li key={i}>
              {q.topic} — <code style={{ background: 'var(--clr-surface-2)', padding: '1px 6px', borderRadius: 4, fontSize: 11 }}>{q.type}</code>
              {q.count && <span style={{ color: 'var(--clr-ink-soft)' }}>, {q.count}</span>}
            </li>
          ))}
        </ul>
      )}

      {format.notes?.length > 0 && (
        <div style={{ marginTop: 10, padding: '8px 12px', borderRadius: 8, background: 'var(--clr-surface-2)', fontSize: 12, lineHeight: 1.6 }}>
          {format.notes.map((n, i) => <div key={i}>{n}</div>)}
        </div>
      )}

      <div style={{ marginTop: 8, fontSize: 10, fontStyle: 'italic', color: 'var(--clr-ink-soft)' }}>
        โปรดยืนยันกับอาจารย์/หัวปีอีกครั้งก่อนวันสอบจริง
      </div>
    </div>
  );
}
