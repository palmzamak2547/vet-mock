// ============================================================
// StudyBuddiesPanel — who's currently online + what they study
// ============================================================
// Reads the realtime presence map produced by useStudyBuddies. Renders
// a compact card on HomeView grouping buddies by current subject so
// you can see "🩺 5 คนเรียน COM IV อยู่" + click to jump there.
//
// Self is hidden from the list (we know we're online). Empty list (no
// other buddies online) is hidden completely — no point showing an
// empty card.
// ============================================================

import { useMemo } from 'react';
import { SUBJECTS } from '../data/curriculum.js';

export default function StudyBuddiesPanel({ buddies = {}, selfUserId, onJumpToSubject }) {
  const grouped = useMemo(() => {
    const map = new Map();
    let countOthers = 0;
    for (const [k, b] of Object.entries(buddies)) {
      if (k === selfUserId) continue;
      countOthers++;
      const key = b.subject || '_idle';
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(b);
    }
    const groups = Array.from(map.entries()).map(([subj, list]) => {
      const meta = SUBJECTS.find((s) => s.id === subj);
      return {
        subjectId: subj,
        subjectMeta: meta,
        list,
      };
    });
    // Sort: largest groups first, idle last
    groups.sort((a, b) => {
      if (a.subjectId === '_idle') return 1;
      if (b.subjectId === '_idle') return -1;
      return b.list.length - a.list.length;
    });
    return { groups, total: countOthers };
  }, [buddies, selfUserId]);

  if (grouped.total === 0) return null;

  return (
    <div className="vmx-dash-card" style={{ padding: 14, marginBottom: 18 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
        <h3 style={{ margin: 0, fontSize: 15 }}>👥 เพื่อนร่วมรุ่นที่ออนไลน์</h3>
        <span style={{ fontSize: 11, color: 'var(--clr-ink-soft)', fontFamily: 'JetBrains Mono, monospace' }}>{grouped.total} คน</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {grouped.groups.map((g) => {
          const m = g.subjectMeta;
          const idle = g.subjectId === '_idle' || !m;
          return (
            <button
              key={g.subjectId}
              type="button"
              onClick={() => !idle && onJumpToSubject?.(g.subjectId)}
              disabled={idle}
              style={{
                all: 'unset',
                cursor: idle ? 'default' : 'pointer',
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '8px 10px', borderRadius: 8,
                background: idle ? 'transparent' : 'var(--clr-surface)',
                border: idle ? '1px dashed var(--clr-border)' : '1px solid var(--clr-border)',
                opacity: idle ? 0.65 : 1,
              }}
              title={idle ? 'ออนไลน์ (ยังไม่เลือกวิชา)' : `ไปยัง ${m.name}`}
            >
              <span style={{ fontSize: 18 }}>{m?.icon || '💤'}</span>
              <span style={{ flex: 1, fontSize: 13 }}>
                <strong>{m?.name || 'ยังไม่เลือกวิชา'}</strong>
                <span style={{ marginLeft: 8, color: 'var(--clr-ink-soft)' }}>
                  {g.list.length} คน — {g.list.slice(0, 3).map((b) => `${b.avatar || '🐾'} ${b.username || 'guest'}`).join(', ')}
                  {g.list.length > 3 && ` … +${g.list.length - 3}`}
                </span>
              </span>
              {!idle && <span style={{ fontSize: 11, color: 'var(--clr-ink-soft)' }}>→</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
