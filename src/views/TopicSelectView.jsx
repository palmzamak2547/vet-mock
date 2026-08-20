import { lazy, Suspense, useState } from 'react';
import BackBar from '../components/BackBar.jsx';
import NavIcon from '../components/NavIcon.jsx';
import { createStudyCatalog } from '../lib/study-catalog.js';

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

export default function TopicSelectView({ subject, setSubject, setTopic, setView, goHome, mode, setMode, setNumQuestions, setUseTimer, setTimePerQ, customQuestions = [], readingChecklist = {}, onOpenWiki, onOpenVideos }) {
  const [openInstructor, setOpenInstructor] = useState(null);
  const [activeSection, setActiveSection] = useState('topics');
  // Palm bug 2026-05-20: subjects with 50+ topics in curriculum but only
  // ~30 with Qs (e.g. COM I has 31 filled + 26 empty) flooded the view
  // with disabled "🚧 รอข้อสอบเพิ่ม" cards. Collapse empties behind a
  // toggle so the default view focuses on what users can actually do.
  const [showEmptyTopics, setShowEmptyTopics] = useState(false);

  // Open instructor profile by lecturer string. Looks up via the
  // helper in instructors.js which handles "(KB)" tag stripping +
  // partial match against Thai/English names.
  const openInstructorFor = async (lecturerString) => {
    const mod = await import('../data/instructors.js');
    const found = mod.getInstructorByLecturerString(lecturerString);
    if (found) setOpenInstructor(found);
  };

  const catalog = createStudyCatalog({ customQuestions, readingChecklist });
  const subjectPage = catalog.browse({ subject });
  const subjectMeta = subjectPage.subject;
  const topics = subjectPage.topics || [];
  const resources = subjectPage.resources || {};

  // Reading-checklist summary for this subject
  const subjReadDone = subjectPage.progress?.read || 0;

  // Collections: virtual "ทำรวม" cards that bundle topics by prefix
  // (e.g. รวมหมาหอน covers 9 mahahon-* topics, รวม Term Paper covers 12 group* topics).
  const collections = subjectPage.collections || [];

  // Counts are generated metadata plus a tiny custom-question overlay. This
  // view no longer scans or forces the full Q bank to load just to render.
  const countFor = (topicId) => {
    if (topicId === 'all') return resources.questions?.count || 0;
    const coll = collections.find((c) => c.id === topicId);
    if (coll) return coll.questionCount || 0;
    return topics.find((topic) => topic.id === topicId)?.questionCount || 0;
  };

  const pastPaperCountFor = (topicId) => {
    if (topicId === 'all') return resources.questions?.pastPaperCount || 0;
    return topics.find((topic) => topic.id === topicId)?.pastPaperCount || 0;
  };

  const hasTopicContent = (entry) => Boolean(
    entry?.questionCount > 0
    || entry?.resources?.notes?.enabled
    || entry?.resources?.wiki?.enabled
    || (subject === 'vca' && VCA_NOTES_MAP[entry?.id]),
  );

  const runStudyAction = (studyAction) => {
    const next = catalog.open(studyAction);
    if (next.status !== 'ready') return;
    const state = next.state || {};
    if (state.subject && setSubject) setSubject(state.subject);
    if (Object.prototype.hasOwnProperty.call(state, 'topic') && setTopic) setTopic(state.topic);
    if (state.mode && setMode) setMode(state.mode);
    if (next.view === 'knowledge' && onOpenWiki) {
      onOpenWiki(state.subject || subject, state.topic || null);
      return;
    }
    if (next.view === 'videos' && onOpenVideos) {
      onOpenVideos(state.subject || subject);
      return;
    }
    setView(next.view);
  };

  const choose = (topicId) => {
    const available = countFor(topicId);
    if (setMode) setMode('quick');
    if (setNumQuestions && available > 0) setNumQuestions(Math.min(10, available));
    setTopic(topicId === 'all' ? null : topicId);
    setView('config');
  };

  return (
    <>
      <BackBar onBack={goHome} label="หน้าแรก" subtitle={subjectMeta?.name || ''} />
      <div className="vmx-hero">
        <h1>เลือก <em>หัวข้อ</em></h1>
        <p>{subjectMeta?.name}, เลือกเฉพาะหัวข้อที่จะสอบ หรือเลือกทำรวมทั้งวิชา</p>
        {topics.length > 0 && (
          <button
            type="button"
            onClick={() => setView('reading-checklist')}
            aria-label={`เปิดรายการอ่าน อ่านแล้ว ${subjReadDone} จาก ${topics.length} หัวข้อ`}
            title="เปิดรายการอ่าน"
            className="vmx-topic-progress"
          >
            อ่านแล้ว <strong>{subjReadDone}/{topics.length}</strong>
          </button>
        )}
      </div>

      <div className="vmx-section-tabs" role="tablist" aria-label="เลือกสิ่งที่ต้องการทำในวิชานี้">
        <button
          type="button"
          role="tab"
          id="vmx-topic-tab-topics"
          aria-controls="vmx-topic-panel-topics"
          aria-selected={activeSection === 'topics'}
          className={activeSection === 'topics' ? 'active' : ''}
          onClick={() => setActiveSection('topics')}
        >
          ฝึกตามหัวข้อ
        </button>
        <button
          type="button"
          role="tab"
          id="vmx-topic-tab-resources"
          aria-controls="vmx-topic-panel-resources"
          aria-selected={activeSection === 'resources'}
          className={activeSection === 'resources' ? 'active' : ''}
          onClick={() => setActiveSection('resources')}
        >
          สื่อเรียนและโหมดสอบ
        </button>
      </div>

      {activeSection === 'resources' && (
      <section id="vmx-topic-panel-resources" role="tabpanel" aria-labelledby="vmx-topic-tab-resources">
      {/* PRIMARY actions — promoted to top so users see "what can I do
          with this subject" before topic drill-down. Mirrors the home
          mode grid pattern but scoped to this subject. */}
      <div className="vmx-section-label">สื่อเรียนและโหมดฝึก</div>
      <div className="vmx-mode-grid" style={{ marginBottom: 20 }}>
        <button
          className="vmx-mode-card"
          disabled={!resources.questions?.available}
          onClick={() => {
            if (setMode) setMode('quick');
            setTopic(null);
            setView('config');
          }}
          style={{ borderColor: subjectMeta?.color, opacity: resources.questions?.available ? 1 : 0.55 }}
        >
          <div className="icon"><NavIcon name="practice" size={20} /></div>
          <div className="title">ฝึกซ้อม</div>
          <div className="sub">{resources.questions?.available ? `สุ่ม ${countFor('all')} ข้อในวิชานี้, ปรับจำนวน/เวลาได้` : 'ยังไม่มีข้อสอบในวิชานี้'}</div>
        </button>

        <button
          className="vmx-mode-card"
          disabled={!resources.questions?.available}
          onClick={() => {
            if (setMode) setMode('exam');
            if (setNumQuestions) setNumQuestions(50);
            if (setUseTimer) setUseTimer(true);
            if (setTimePerQ) setTimePerQ(60);
            setTopic(null);
            setView('config');
          }}
          style={{ borderColor: subjectMeta?.color, opacity: resources.questions?.available ? 1 : 0.55 }}
        >
          <div className="icon"><NavIcon name="exam" size={20} /></div>
          <div className="title">สอบจริง</div>
          <div className="sub">{resources.questions?.available ? '50 ข้อ × 60 วิ, เลียนข้อสอบจริง' : 'ยังไม่มีข้อสอบในวิชานี้'}</div>
        </button>

        <button
          className="vmx-mode-card"
          disabled={!resources.notes?.available}
          onClick={() => runStudyAction(resources.notes?.action)}
          style={{ opacity: resources.notes?.available ? 1 : 0.55 }}
        >
          <div className="icon"><NavIcon name="note" size={20} /></div>
          <div className="title">สรุปบทเรียน</div>
          <div className="sub">{resources.notes?.available ? `${resources.notes.count} หัวข้อ, อ้างอิงแหล่งที่มา` : 'ยังไม่มี Notes ในวิชานี้'}</div>
        </button>

        <button
          className="vmx-mode-card"
          disabled={!resources.videos?.available}
          onClick={() => runStudyAction(resources.videos?.action)}
          style={{ opacity: resources.videos?.available ? 1 : 0.55 }}
        >
          <div className="icon"><NavIcon name="video" size={20} /></div>
          <div className="title">คลิปย้อนหลัง</div>
          <div className="sub">{resources.videos?.available ? `${resources.videos.count} ชุดวิดีโอ` : 'ยังไม่มีคลิปในวิชานี้'}</div>
        </button>

        <button
          className="vmx-mode-card"
          disabled={!resources.wiki?.available}
          onClick={() => runStudyAction(resources.wiki?.action)}
          style={{ opacity: resources.wiki?.available ? 1 : 0.55 }}
        >
          <div className="icon"><NavIcon name="wiki" size={20} /></div>
          <div className="title">VetWiki</div>
          <div className="sub">{resources.wiki?.available ? `${resources.wiki.count} บทความ เชื่อมจาก Notes` : 'ยังไม่มีบทความในวิชานี้'}</div>
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
                if (setNumQuestions) setNumQuestions(countFor('all'));
                if (setUseTimer) setUseTimer(false);
                setTopic(null);
                setView('config');
              }}
              style={{ borderColor: '#5db4d3' }}
            >
              <div className="icon">📚</div>
              <div className="title">All {countFor('all')}</div>
              <div className="sub">ทุกข้อ, ไม่จับเวลา, ฝึกล้วน</div>
            </button>
          </div>
        </>
      )}
      </section>
      )}

      {activeSection === 'topics' && (
      <section id="vmx-topic-panel-topics" role="tabpanel" aria-labelledby="vmx-topic-tab-topics">
      <div className="vmx-section-label">เลือกหัวข้อที่จะฝึก</div>
      <div className="vmx-topic-grid">
        {/* All-topics card */}
        <button
          key="all"
          className="vmx-subject-card"
          disabled={!resources.questions?.available}
          onClick={() => choose('all')}
          style={{ opacity: resources.questions?.available ? 1 : 0.5, cursor: resources.questions?.available ? 'pointer' : 'not-allowed' }}
        >
          <div className="accent" style={{ background: subjectMeta?.color || 'var(--clr-ink)' }}></div>
          <div className="icon"><NavIcon name="practice" size={22} /></div>
          <div className="title">รวมทุกหัวข้อ</div>
          <div className="sub">{subjectMeta?.name} ทุกหัวข้อ</div>
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

        {/* A topic is useful when any connected resource is ready. Notes-only
            topics stay visible instead of being disabled just because the Q
            bank is still empty. */}
        {(() => {
          const topicEntries = topics.map((t) => ({ t, count: countFor(t.id) }));
          const ready = topicEntries.filter(({ t }) => hasTopicContent(t));
          const empty = topicEntries.filter(({ t }) => !hasTopicContent(t));
          const visible = showEmptyTopics ? [...ready, ...empty] : ready;
          return visible.map(({ t, count }) => {
          const ppCount = pastPaperCountFor(t.id);
          const ppPct = count > 0 ? Math.round((ppCount / count) * 100) : 0;
          const hasQuestions = count > 0;
          const hasNotesForTopic = t.resources?.notes?.enabled;
          const hasWikiForTopic = t.resources?.wiki?.enabled;
          const isEmpty = !hasTopicContent(t);
          const isRead = t.read;
          const primaryLabelBase = hasQuestions
            ? `ฝึกข้อสอบ ${t.label} ${count} ข้อ`
            : hasNotesForTopic
              ? `อ่าน Notes ${t.label}`
              : `หัวข้อ ${t.label} ยังไม่มีเนื้อหาพร้อมใช้`;
          const primaryLabel = `${primaryLabelBase}${isRead ? ', อ่านแล้ว' : ''}`;
          const openPrimary = () => {
            if (hasQuestions) choose(t.id);
            else if (hasNotesForTopic) runStudyAction(t.resources.notes);
          };
          return (
            <article
              key={t.id}
              className="vmx-topic-card"
              style={{
                opacity: isEmpty ? 0.5 : 1,
                position: 'relative',
              }}
            >
              <div className="accent" style={{ background: subjectMeta?.color || 'var(--clr-ink)' }}></div>
              <button
                type="button"
                className="vmx-topic-main"
                disabled={isEmpty}
                onClick={openPrimary}
                aria-label={primaryLabel}
                title={isEmpty ? 'ยังไม่มีข้อสอบ, Notes หรือ VetWiki ในหัวข้อนี้' : primaryLabel}
              >
                {isRead && <span className="vmx-topic-read" aria-hidden="true" title="อ่านแล้ว">✓</span>}
                <span className="title">{t.label}</span>
                <span className="count" style={{ color: isEmpty ? 'var(--clr-rose-text)' : 'var(--clr-ink-soft)' }}>
                  {hasQuestions ? `${count} ข้อ` : hasNotesForTopic ? 'มีสรุปและ VetWiki' : 'รอเนื้อหาเพิ่ม'}
                </span>
                {ppCount > 0 && hasQuestions && (
                  <span className="vmx-topic-past" title={`มีข้อสอบเก่า ${ppCount}/${count} ข้อ (${ppPct}% ของหัวข้อนี้)`}>
                    อิงแนวเดิม {ppCount}/{count}, {ppPct}%
                  </span>
                )}
                {t.lecturerNote && !isEmpty && (
                  <span className="vmx-topic-note">⚠️ {t.lecturerNote}</span>
                )}
              </button>

              {!isEmpty && (t.lecturer || hasNotesForTopic || hasWikiForTopic || (subject === 'vca' && VCA_NOTES_MAP[t.id])) && (
                <div className="vmx-topic-actions" aria-label={`แหล่งเรียน ${t.label}`}>
                  {t.lecturer && (
                    <button type="button" className="vmx-topic-action is-wide" onClick={() => openInstructorFor(t.lecturer)} title="ดูโปรไฟล์อาจารย์ + งานวิจัย">
                      <NavIcon name="user" size={15} /> อาจารย์ {t.lecturer}{t.lecturer_year && ` (${t.lecturer_year})`}
                    </button>
                  )}
                  {hasNotesForTopic && (
                    <button type="button" className="vmx-topic-action" onClick={() => runStudyAction(t.resources.notes)}>
                      <NavIcon name="note" size={15} /> สรุป
                    </button>
                  )}
                  {hasWikiForTopic && (
                    <button type="button" className="vmx-topic-action" onClick={() => runStudyAction(t.resources.wiki)}>
                      <NavIcon name="wiki" size={15} /> VetWiki
                    </button>
                  )}
                  {subject === 'vca' && VCA_NOTES_MAP[t.id] && (
                    <button
                      type="button"
                      className="vmx-topic-action"
                      onClick={() => {
                        if (setSubject) setSubject(VCA_NOTES_MAP[t.id].subject);
                        if (setTopic) setTopic(null);
                        setView('notes');
                      }}
                      title={`เปิด Notes: ${VCA_NOTES_MAP[t.id].label}`}
                    >
                      <NavIcon name="note" size={15} /> {VCA_NOTES_MAP[t.id].label}
                    </button>
                  )}
                </div>
              )}
            </article>
          );
        });
        })()}
      </div>

      {/* Content-empty topic disclosure — only render when curriculum topics
          have no connected questions, Notes, or VetWiki article yet. */}
      {(() => {
        const emptyCount = topics.filter((t) => !hasTopicContent(t)).length;
        if (emptyCount === 0) return null;
        return (
          <div style={{
            marginTop: 12,
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
            padding: '12px 14px',
            borderRadius: 10,
            background: 'var(--clr-surface-2)',
            border: '1px dashed var(--clr-border)',
            fontSize: 13,
            color: 'var(--clr-ink-soft)',
          }}>
            <button
              type="button"
              onClick={() => setShowEmptyTopics((v) => !v)}
              style={{
                all: 'unset',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                fontWeight: 600,
                color: 'var(--clr-ink)',
              }}
              aria-expanded={showEmptyTopics}
            >
              <span aria-hidden="true">{showEmptyTopics ? '▾' : '▸'}</span>
              {showEmptyTopics ? 'ซ่อนหัวข้อที่ยังไม่มีเนื้อหา' : `แสดงหัวข้อที่ยังไม่มีเนื้อหา (${emptyCount} หัวข้อ)`}
            </button>
            <div style={{ fontSize: 12, lineHeight: 1.5 }}>
              หัวข้อในแผนการสอนที่ยังไม่มีข้อสอบหรือสรุปพร้อมใช้ คุณแจ้งขอเพิ่มได้จากเมนู "แจ้งปัญหา"
            </div>
          </div>
        );
      })()}
      </section>
      )}

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
      <div style={{ fontSize: 11, fontFamily: 'var(--vmx-mono)', color: 'var(--clr-ink-soft)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
        รูปแบบของชุดโจทย์ฝึก
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

      <div style={{ marginTop: 8, fontSize: 11, fontStyle: 'italic', color: 'var(--clr-ink-soft)' }}>
        โปรดยืนยันกับอาจารย์/หัวปีอีกครั้งก่อนวันสอบจริง
      </div>
    </div>
  );
}
