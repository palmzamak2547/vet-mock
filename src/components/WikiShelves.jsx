// ============================================================
// WikiShelves: the VetWiki index as a library, one shelf per year
// ============================================================
// Each subject is a volume on its year's shelf. Its thickness is its number
// of topics and its height its number of subsections, counted at build time
// (lib/vetwiki/shelf.generated.js), so the index still loads no article. A
// spine pulls its volume out: the contents card opens under the shelf, and
// Escape or "ปิดเล่ม" puts it back with focus on the spine. The cloth is the
// subject's bookplate paper turned into cloth, light or dark with the theme.
// ============================================================

import { useEffect, useState } from 'react';
import { SHELF_SUBJECTS, SHELF_TOPICS } from '../lib/vetwiki/shelf.generated.js';
import { SUBJECT_COVERS } from '../data/subject-covers.js';
import { motionIsReduced } from '../lib/motion-preferences.js';
import { keepSilentFinals } from '../lib/richtext.jsx';

// The open volume belongs to this history entry, so Back from a chapter finds
// it open where it was; a fresh visit to the index starts with every volume in.
const pulledInHistory = () => {
  try { return window.history?.state?.vetwikiPulled || null; } catch { return null; }
};
const rememberPulled = (id) => {
  try { window.history?.replaceState({ ...(window.history.state || {}), vetwikiPulled: id }, ''); } catch { /* kept for this view only */ }
};

/** Spine size in px: thickness reads as page count, height as depth. */
export function spineSize({ topics = 0, sections = 0 } = {}) {
  // 1.5 px a topic from three up, never under the 44 px touch floor.
  const width = 44 + 1.5 * Math.max(0, topics - 3);
  // Subsections run from 20 to 239: on a logarithm the deepest stays in reach.
  const height = Math.round(180 + 32.25 * Math.log(Math.max(20, sections) / 20));
  return { width, height };
}

/** What a spine can carry: the name before a comma or a bracket. */
export function spineLabel(name) {
  return String(name || '').split(/,\s|\s\(/)[0];
}

/**
 * The spine title's size: 15 px, or smaller until the label fits the spine
 * (56 px are kept for the bands and the count), never under 14 px for Thai
 * or 13 px for Latin. Widths in em per base character, marks taking none.
 */
export function spineFontSize(label, height) {
  const bases = [...String(label).replace(/\p{M}/gu, '')];
  const em = bases.reduce((w, ch) => w + (/\p{Script=Thai}/u.test(ch) ? 0.62 : 0.55), 0) || 1;
  const thai = bases.some((ch) => /\p{Script=Thai}/u.test(ch));
  return Math.max(thai ? 14 : 13, Math.min(15, Math.floor((height - 56) / em)));
}

// "2026-10-06" as "6 ต.ค. 2569".
const TH_MONTHS = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
export function thaiDay(iso) {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(iso || ''));
  return m ? `${Number(m[3])} ${TH_MONTHS[Number(m[2]) - 1]} ${Number(m[1]) + 543}` : '';
}

const n = (v) => Number(v || 0).toLocaleString('en-US');

function Volume({ id, name, code, year, topics, onOpenTopic, onClose }) {
  const s = SHELF_SUBJECTS[id];
  const cover = SUBJECT_COVERS[id];
  return (
    <div className="vw-volume" id={`vw-volume-${id}`} role="region" aria-label={`สารบัญเล่ม ${name}`}
      style={{ '--vw-cloth': s.cloth.light, '--vw-cloth-dark': s.cloth.dark }}>
      <div className="vw-volume-cover" aria-hidden="true">
        {cover?.src && <span className="vw-volume-plate" style={{ '--vw-plate': `url(${cover.src})` }} />}
        <span className="vw-volume-cover-title">{spineLabel(name)}</span>
      </div>
      <div className="vw-volume-body">
        <p className="vw-volume-kicker">
          {year ? <span>ปี {year}</span> : null}
          {code ? <span>{code}</span> : null}
        </p>
        <h3 className="vw-volume-title">{name}</h3>
        <ul className="vw-volume-facts">
          <li><b>{n(s.topics)}</b> หัวข้อ</li>
          <li><b>{n(s.sections)}</b> หัวข้อย่อย</li>
          <li><b>{n(s.claims)}</b> จุดที่ตรวจทานแล้ว</li>
          {s.conflicts > 0 && <li className="is-conflict">หลักฐานไม่ตรงกับที่บรรยาย {n(s.conflicts)} จุด</li>}
          {s.newestReview && <li>ตรวจทานล่าสุด {thaiDay(s.newestReview)}</li>}
        </ul>
        <ol className="vw-volume-chapters">
          {topics.map((t, i) => (
            <li key={t.id}>
              <button type="button" onClick={() => onOpenTopic(t.id)}>
                <span className="vw-num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                <span>{keepSilentFinals(t.title)}</span>
              </button>
            </li>
          ))}
        </ol>
        <button type="button" className="vmx-btn vmx-btn-ghost vmx-btn-sm" onClick={onClose}>ปิดเล่ม</button>
      </div>
    </div>
  );
}

/**
 * @param {{ years: Array<[number, string[]]>, ownYear: number|null,
 *   topicsBySubject: Map<string, Array<{id,title}>>, subjectInfo: (id) => {name, code},
 *   onOpenTopic: (id) => void }} props
 */
export default function WikiShelves({ years, ownYear, topicsBySubject, subjectInfo, onOpenTopic }) {
  const [pulled, setPulled] = useState(() => {
    const id = typeof window === 'undefined' ? null : pulledInHistory();
    return id && SHELF_SUBJECTS[id] && years.some(([, ids]) => ids.includes(id)) ? id : null;
  });
  const [said, setSaid] = useState('');
  const spineOf = (id) => (typeof document === 'undefined' ? null : document.getElementById(`vw-spine-${id}`));
  const pull = (id) => {
    const next = pulled === id ? null : id;
    setPulled(next);
    rememberPulled(next);
    setSaid(next ? `เปิดเล่ม ${subjectInfo(next).name} มี ${SHELF_SUBJECTS[next]?.topics || 0} หัวข้อ` : 'ปิดเล่มแล้ว');
  };
  const putBack = () => {
    const id = pulled;
    setPulled(null);
    rememberPulled(null);
    setSaid('ปิดเล่มแล้ว');
    spineOf(id)?.focus();
  };
  // A volume out of sight (opened below the fold, where a phone's shelf takes
  // up to three boards, or found open on the way Back) is brought up to its
  // top, smoothly unless motion is reduced, by the system or in the app.
  useEffect(() => {
    if (!pulled || typeof document === 'undefined') return;
    const el = document.getElementById(`vw-volume-${pulled}`);
    const r = el?.getBoundingClientRect();
    if (!r || (r.top < window.innerHeight - 120 && r.bottom > 88)) return;
    el.scrollIntoView({ block: 'start', behavior: motionIsReduced() ? 'auto' : 'smooth' });
  }, [pulled]);
  // Escape puts the open volume back from anywhere on the page: Safari does
  // not focus a button it clicks, so a key event never reached the shelves.
  useEffect(() => {
    if (!pulled || typeof document === 'undefined') return undefined;
    const esc = (e) => { if (e.key === 'Escape' && !e.defaultPrevented) putBack(); };
    document.addEventListener('keydown', esc);
    return () => document.removeEventListener('keydown', esc);
  });

  // Arrow keys walk the spines (each shelf is one Tab stop).
  const onKeyDown = (e) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    const row = [...e.currentTarget.querySelectorAll('.vw-spine')];
    const at = row.indexOf(document.activeElement);
    if (at < 0) return;
    e.preventDefault();
    row[Math.max(0, Math.min(row.length - 1, at + (e.key === 'ArrowRight' ? 1 : -1)))]?.focus();
  };

  return (
    <div className="vw-library" onKeyDown={onKeyDown}>
      <p className="vmx-sr-only" role="status" aria-live="polite">{said}</p>
      {years.map(([year, ids]) => {
        // One Tab stop a shelf (its open volume's spine, or its first), so
        // Tab reaches an open volume's chapters next instead of after every
        // spine left on the shelf; the arrow keys walk the spines.
        const stop = ids.includes(pulled) ? pulled : ids.find((id) => SHELF_SUBJECTS[id]);
        return (
        <section key={year} className="vw-shelf" aria-labelledby={`vw-shelf-${year}`}>
          <h2 className="vw-year" id={`vw-shelf-${year}`}>
            {year ? `ปี ${year}` : 'วิชาอื่น'}
            {year && year === ownYear ? <small>ปีของคุณ</small> : null}
            <small>{ids.length} เล่ม</small>
          </h2>
          <ul className="vw-spines" style={{ '--vw-row-h': `${Math.max(0, ...ids.map((id) => (SHELF_SUBJECTS[id] ? spineSize(SHELF_SUBJECTS[id]).height : 0)))}px` }}>
            {ids.map((id) => {
              const s = SHELF_SUBJECTS[id];
              if (!s) return null;
              const { width, height } = spineSize(s);
              const { name } = subjectInfo(id);
              const label = spineLabel(name);
              return (
                <li key={id} style={{
                  '--vw-spine-w': `${width}px`, '--vw-spine-h': `${height}px`, '--vw-spine-type': `${spineFontSize(label, height)}px`,
                  '--vw-cloth': s.cloth.light, '--vw-cloth-dark': s.cloth.dark,
                }}>
                  <button
                    type="button"
                    id={`vw-spine-${id}`}
                    className="vw-spine"
                    aria-expanded={pulled === id}
                    aria-controls={pulled === id ? `vw-volume-${id}` : undefined}
                    aria-label={`${name}, ${s.topics} หัวข้อ`}
                    tabIndex={id === stop ? 0 : -1}
                    onClick={() => pull(id)}
                  >
                    <span className="vw-spine-title" aria-hidden="true">{label}</span>
                    <span className="vw-spine-count" aria-hidden="true">{s.topics}</span>
                  </button>
                </li>
              );
            })}
          </ul>
          {pulled && ids.includes(pulled) && (
            <Volume
              id={pulled}
              {...subjectInfo(pulled)}
              year={year}
              topics={topicsBySubject.get(pulled) || []}
              onOpenTopic={onOpenTopic}
              onClose={putBack}
            />
          )}
        </section>
        );
      })}
      <p className="vw-shelf-legend">ความหนาของเล่มคือจำนวนหัวข้อ ความสูงคือจำนวนหัวข้อย่อย</p>
    </div>
  );
}

/**
 * "เริ่มอ่านที่นี่": the flagship topic as a book you can open, and beside it
 * the topics with the most practice questions, ranked, the basis in the
 * heading. The book's thickness is its subject's spine width.
 * @param {{ flagship: {id, subject, title}, ranked: Array<{id, subject, title}>,
 *   heading: string, subjectInfo: (id) => {name, code}, onOpenTopic: (id) => void }} props
 */
export function WikiFeatured({ flagship, ranked, heading, subjectInfo, onOpenTopic }) {
  const s = SHELF_SUBJECTS[flagship.subject];
  const cover = SUBJECT_COVERS[flagship.subject];
  const [sections, claims] = SHELF_TOPICS[flagship.id] || [0, 0];
  const { name } = subjectInfo(flagship.subject);
  return (
    <section className="vw-featured" aria-labelledby="vw-featured-kicker">
      <button
        type="button"
        className="vw-book"
        onClick={() => onOpenTopic(flagship.id)}
        aria-label={`อ่านหัวข้อ ${flagship.title}`}
        style={{ '--vw-cloth': s?.cloth.light, '--vw-cloth-dark': s?.cloth.dark, '--vw-book-depth': `${s ? spineSize(s).width : 44}px` }}
      >
        <span className="vw-book-kicker" aria-hidden="true"><span>VetWiki</span><span>{spineLabel(name)}</span></span>
        {cover?.src && <span className="vw-book-plate" aria-hidden="true" style={{ '--vw-plate': `url(${cover.src})` }} />}
        {/* A cover sets each language on its own line, so "โรคพิษสุนัขบ้า" never breaks after "Rabies —". */}
        <span className="vw-book-title" aria-hidden="true">
          {flagship.title.split(/\s+[—–]\s+/).map((part, i) => <span key={i}>{part}</span>)}
        </span>
      </button>
      <div className="vw-featured-text">
        <p className="vw-featured-kicker" id="vw-featured-kicker">เริ่มอ่านที่นี่</p>
        <h2 className="vw-featured-title">{keepSilentFinals(flagship.title)}</h2>
        <p className="vw-featured-meta">
          <span>{name}</span>
          {sections > 0 && <span>{n(sections)} หัวข้อย่อย</span>}
          {claims > 0 && <span>ตรวจทานแล้ว {n(claims)} จุด</span>}
        </p>
        <button type="button" className="vmx-btn vmx-btn-primary vmx-btn-sm" onClick={() => onOpenTopic(flagship.id)}>อ่านหัวข้อนี้</button>
        {ranked.length > 0 && (
          <>
            <h3 className="vw-ranked-head">{heading}</h3>
            <ol className="vw-ranked">
              {ranked.map((r, i) => (
                <li key={r.id}>
                  <button type="button" onClick={() => onOpenTopic(r.id)}>
                    <span className="vw-ranked-num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                    <span className="vw-ranked-title">{keepSilentFinals(r.title)}</span>
                    <span className="vw-ranked-subject">{subjectInfo(r.subject).name}</span>
                  </button>
                </li>
              ))}
            </ol>
          </>
        )}
      </div>
    </section>
  );
}
