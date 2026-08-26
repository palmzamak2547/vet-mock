// ============================================================
// ReadingChecklistView — รายการอ่าน (study progress checklist)
// ============================================================
// Per request from user "pppppvet86" — เชื่อกับ pain point ของ COM
// ที่มี 14+ คาบ ลืมว่าอ่านไปถึงไหน
//
// Data shape (state owned by App.jsx): canonical subject/topic keys with a
// legacy bare-topic fallback handled by study-progress.js.
// ============================================================

import { SUBJECTS_BY_YEAR } from '../data/curriculum.js';
import { hasNoteTopic } from '../data/notes-registry.generated.js';
import NavIcon from '../components/NavIcon.jsx';
import { isTopicRead, setTopicRead } from '../lib/study-progress.js';

export default function ReadingChecklistView({
  selectedYear = 4,
  readingChecklist = {},
  setReadingChecklist,
  goHome,
  goBack,
  setSubject,
  setTopic,
  setView,
}) {
  // Filter out hidden topics globally — the same `hidden: true` flag that
  // hides topics in TopicSelectView (and excludes them from visibleQuestionCount)
  // must also hide them from the reading checklist; otherwise non-Final topics
  // (e.g. Poultry midterm scope, Exotic week 1-6) show up in รายการอ่าน.
  const subjects = (SUBJECTS_BY_YEAR[selectedYear] || [])
    .map((s) => ({ ...s, topics: Array.isArray(s.topics) ? s.topics.filter((t) => !t.hidden) : [] }))
    .filter((s) => s.topics.length > 0);

  const toggle = (subjectId, topicId) => {
    setReadingChecklist((prev) => setTopicRead(prev, subjectId, topicId));
  };

  const setSubjectAll = (subj, value) => {
    setReadingChecklist((prev) => {
      let next = prev;
      const completedAt = Date.now();
      // subj.topics is already filtered (no hidden topics) — safe to iterate
      subj.topics.forEach((t) => {
        next = setTopicRead(next, subj.id, t.id, value, completedAt);
      });
      return next;
    });
  };

  // Overall stats (counts visible topics only — hidden already filtered above)
  const totalTopics = subjects.reduce((acc, s) => acc + s.topics.length, 0);
  const totalDone = subjects.reduce((acc, s) => acc + s.topics.filter((t) => isTopicRead(readingChecklist, s.id, t.id)).length, 0);
  const overallPct = totalTopics > 0 ? Math.round((totalDone / totalTopics) * 100) : 0;

  return (
    <>
      <div className="vmx-hero">
        <h1>รายการ <em>อ่าน</em></h1>
        <p>ติ๊กหัวข้อที่อ่านเสร็จแล้ว ดูเหลือต้องอ่านอีกกี่คาบ, เก็บไว้ในเครื่อง (sync cloud ถ้า login)</p>
      </div>

      {/* Overall progress card */}
      <div
        style={{
          padding: 18,
          borderRadius: 14,
          background: 'var(--clr-surface)',
          border: '1px solid var(--clr-border)',
          marginBottom: 20,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
          <div style={{ fontSize: 12, fontFamily: 'var(--vmx-mono)', color: 'var(--clr-ink-soft)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            ภาพรวม
          </div>
          <div style={{ fontFamily: 'Fraunces, serif', fontWeight: 700, fontSize: 22, color: 'var(--clr-ink)' }}>
            {totalDone}/{totalTopics} <span style={{ fontSize: 14, color: 'var(--clr-ink-soft)', fontWeight: 400 }}>{overallPct}%</span>
          </div>
        </div>
        <ProgressBar pct={overallPct} />
      </div>

      {/* Per-subject groups */}
      {subjects.map((subj) => {
        const done = subj.topics.filter((t) => isTopicRead(readingChecklist, subj.id, t.id)).length;
        const total = subj.topics.length;
        const pct = total > 0 ? Math.round((done / total) * 100) : 0;
        const allDone = done === total;
        return (
          <div
            key={subj.id}
            style={{
              marginBottom: 20,
              padding: 16,
              borderRadius: 14,
              background: 'var(--clr-surface)',
              border: '1px solid var(--clr-border)',
              borderLeft: `4px solid ${subj.color}`,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10, marginBottom: 10, flexWrap: 'wrap' }}>
              <div>
                <div style={{ fontFamily: 'Fraunces, serif', fontWeight: 600, fontSize: 17, lineHeight: 1.2 }}>
                  {subj.icon} {subj.name}
                </div>
                <div style={{ fontSize: 12, color: 'var(--clr-ink-soft)', marginTop: 2 }}>
                  {done}/{total} หัวข้อ, {pct}%
                </div>
              </div>
              <button
                type="button"
                className="vmx-btn vmx-btn-ghost vmx-btn-sm"
                onClick={() => setSubjectAll(subj, !allDone)}
                title={allDone ? 'ติ๊กทุกหัวข้อออก' : 'ติ๊กทุกหัวข้อ'}
                style={{ fontSize: 11 }}
              >
                {allDone ? '↺ ล้างทั้งหมด' : '✓ ติ๊กทั้งหมด'}
              </button>
            </div>
            <ProgressBar pct={pct} accent={subj.color} />

            <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
              {subj.topics.map((t) => {
                const checked = isTopicRead(readingChecklist, subj.id, t.id);
                return (
                  <div
                    key={t.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      padding: '10px 12px',
                      borderRadius: 10,
                      background: checked ? 'rgba(74, 107, 74, 0.08)' : 'var(--clr-bg)',
                      border: `1px solid ${checked ? 'var(--clr-sage)' : 'var(--clr-border)'}`,
                      transition: 'all 0.12s',
                    }}
                  >
                    {/* Tap whole row to toggle */}
                    <button
                      type="button"
                      className="vmx-tap"
                      aria-pressed={checked}
                      onClick={() => toggle(subj.id, t.id)}
                      aria-label={checked ? `ยกเลิก ${t.label}` : `อ่านแล้ว ${t.label}`}
                      style={{
                        all: 'unset',
                        cursor: 'pointer',
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        minWidth: 0,
                      }}
                    >
                      <Checkbox checked={checked} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            fontSize: 14,
                            fontWeight: checked ? 400 : 500,
                            color: checked ? 'var(--clr-ink-soft)' : 'var(--clr-ink)',
                            textDecoration: checked ? 'line-through' : 'none',
                            lineHeight: 1.35,
                            wordBreak: 'break-word',
                          }}
                        >
                          {t.icon} {t.label}
                        </div>
                        {t.lecturer && (
                          <div style={{ fontSize: 11, color: 'var(--clr-ink-soft)', fontStyle: 'italic', marginTop: 2 }}>
                            by Aj. {t.lecturer}
                          </div>
                        )}
                      </div>
                    </button>

                    {/* Quick jump to the exact note topic when one exists. */}
                    {hasNoteTopic(subj.id, t.id) && (
                      <button
                        type="button"
                        onClick={() => { setSubject(subj.id); setTopic?.(t.id); setView('notes'); }}
                        aria-label={`เปิด Notes ${t.label}`}
                        title="ไปดูสรุปหัวข้อนี้"
                        style={{
                          all: 'unset',
                          cursor: 'pointer',
                          padding: '4px 10px',
                          minHeight: 'var(--touch-min)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          boxSizing: 'border-box',
                          borderRadius: 999,
                          background: 'var(--clr-surface)',
                          border: '1px solid var(--clr-border)',
                          fontSize: 11,
                          color: 'var(--clr-ink-soft)',
                          fontFamily: 'var(--vmx-mono)',
                          flexShrink: 0,
                        }}
                      >
                        <NavIcon name="wiki" size={16} />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {totalTopics === 0 && (
        <div className="vmx-empty">ยังไม่มีหัวข้อ — รอข้อมูล curriculum</div>
      )}

      <div className="vmx-btn-row" style={{ marginTop: 24 }}>
        {goBack && <button className="vmx-btn vmx-btn-ghost" onClick={goBack}>← ย้อนกลับ</button>}
        <button className="vmx-btn vmx-btn-ghost" onClick={goHome}>หน้าแรก</button>
      </div>
    </>
  );
}

// ── Progress bar ────────────────────────────────────────────────
function ProgressBar({ pct, accent = 'var(--clr-sage)' }) {
  return (
    <div style={{ height: 6, background: 'var(--clr-surface-2)', borderRadius: 999, overflow: 'hidden' }}>
      <div
        style={{
          width: `${Math.max(0, Math.min(100, pct))}%`,
          height: '100%',
          background: accent,
          transition: 'width 0.3s ease',
        }}
      />
    </div>
  );
}

// ── Checkbox visual ─────────────────────────────────────────────
function Checkbox({ checked }) {
  return (
    <div
      style={{
        width: 22,
        height: 22,
        borderRadius: 6,
        border: `2px solid ${checked ? 'var(--clr-sage)' : 'var(--clr-border)'}`,
        background: checked ? 'var(--clr-sage)' : 'transparent',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        transition: 'all 0.12s',
      }}
    >
      {checked && (
        <span style={{ color: 'var(--clr-bg)', fontSize: 14, fontWeight: 800, lineHeight: 1 }}>
          ✓
        </span>
      )}
    </div>
  );
}
