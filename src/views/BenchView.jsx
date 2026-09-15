// ============================================================
// BenchView — Module 5 as something you work through, not read
// ============================================================
// The deck is 19 slides that a student scrolls past in four minutes and
// keeps nothing from. The content here is the same deck (data in
// src/data/epi-module5.js, grounded slide by slide), but every place the
// lecture asks a question, the question is asked — you answer before the
// answer appears, and what you cleared is remembered.
//
// The screening bench sits inside sections 3 and 4, where the lecture puts
// its two worked numbers, rather than being a separate toy.
import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { MODULE5, ALL_CHECKS } from '../data/epi-module5.js';
import ScreeningBench from '../components/ScreeningBench.jsx';

const PROGRESS_KEY = 'vmx-epi-m5-progress-v1';

function readProgress() {
  try {
    const raw = window.localStorage.getItem(PROGRESS_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    return Array.isArray(parsed) ? new Set(parsed.filter((v) => typeof v === 'string')) : new Set();
  } catch {
    return new Set();
  }
}

function writeProgress(set) {
  try {
    window.localStorage.setItem(PROGRESS_KEY, JSON.stringify([...set]));
  } catch {
    // Out of room, or storage disabled. The lesson still works for this
    // sitting; only the memory of it is lost, which is not worth an error.
  }
}

/** A column count that the items actually fill, so the last row is never a
 *  single stranded card. Five in three columns is 3 + 2, which reads as a
 *  list; four in three is 3 + 1, which reads as a bug. */
function columnsFor(n) {
  if (n <= 3) return n;
  if (n % 3 === 0) return 3;
  if (n % 2 === 0) return 2;
  return 3;
}

// ── blocks ───────────────────────────────────────────────────────
function Block({ block }) {
  switch (block.t) {
    case 'p':
      return <p className="vmx-lesson-p">{block.text}</p>;
    case 'quote':
      return <blockquote className="vmx-lesson-quote">{block.text}</blockquote>;
    case 'note':
      return <p className="vmx-lesson-note">{block.text}</p>;
    case 'key':
      return (
        <div className="vmx-lesson-key">
          {block.title && <p className="vmx-lesson-key__title">{block.title}</p>}
          <p className="vmx-lesson-key__text">{block.text}</p>
        </div>
      );
    case 'warn':
      return (
        <div className="vmx-lesson-warn">
          {block.title && <p className="vmx-lesson-key__title">{block.title}</p>}
          <p className="vmx-lesson-key__text">{block.text}</p>
        </div>
      );
    case 'prompt':
      return <p className="vmx-lesson-prompt">{block.text}</p>;
    case 'table':
      return (
        <div className="vmx-lesson-tablewrap">
          <table className="vmx-lesson-table">
            <thead>
              <tr>{block.head.map((h) => <th key={h} scope="col">{h}</th>)}</tr>
            </thead>
            <tbody>
              {block.rows.map((row) => (
                <tr key={row[0]}>
                  {row.map((cell, i) => (i === 0
                    ? <th key={i} scope="row">{cell}</th>
                    : <td key={i}>{cell}</td>))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case 'cards':
      return (
        <div className="vmx-lesson-cards">
          {block.title && <p className="vmx-lesson-cards__title">{block.title}</p>}
          {/* An explicit column count, not auto-fit: four items in a
              three-column track leaves one card alone on its own row, which
              reads as a mistake rather than a list. */}
          <ul className="vmx-lesson-cards__grid" style={{ '--cols': columnsFor(block.items.length) }}>
            {block.items.map((it, i) => (
              <li key={it.label} className="vmx-lesson-card">
                {block.numbered && <span className="vmx-lesson-card__n">{i + 1}</span>}
                <span className="vmx-lesson-card__label">{it.label}</span>
                {it.text && <span className="vmx-lesson-card__text">{it.text}</span>}
              </li>
            ))}
          </ul>
        </div>
      );
    case 'cycle':
      return (
        <div className="vmx-lesson-cycle">
          {block.title && <p className="vmx-lesson-cards__title">{block.title}</p>}
          <ol className={`vmx-lesson-cycle__steps ${block.linear ? 'is-linear' : ''}`}>
            {block.steps.map((s) => <li key={s}>{s}</li>)}
          </ol>
          {block.note && <p className="vmx-lesson-note">{block.note}</p>}
          {!block.linear && <p className="vmx-lesson-cycle__loop">แล้ววนกลับไปที่ข้อแรก</p>}
        </div>
      );
    case 'compare':
      return (
        <div className="vmx-lesson-compare">
          {block.title && <p className="vmx-lesson-cards__title">{block.title}</p>}
          <div className="vmx-lesson-compare__grid">
            {[block.left, block.right].map((side) => (
              <div key={side.label} className={`vmx-lesson-compare__side is-${side.tone}`}>
                <p className="vmx-lesson-compare__label">{side.label}</p>
                <table className="vmx-lesson-table">
                  <thead>
                    <tr>{block.head.map((h) => <th key={h} scope="col">{h}</th>)}</tr>
                  </thead>
                  <tbody>
                    {side.rows.map(([label, before, after, tone]) => (
                      <tr key={label}>
                        <th scope="row">{label}</th>
                        <td>{before}</td>
                        <td className={`vmx-lesson-compare__after ${tone ? `is-${tone}` : ''}`}>
                          {after}
                          {tone === 'alarm' && <span className="vmx-sr-only"> (แย่ลง)</span>}
                          {tone === 'good' && <span className="vmx-sr-only"> (ดีขึ้น)</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
          {block.note && <p className="vmx-lesson-note">{block.note}</p>}
        </div>
      );
    case 'reading':
      return (
        <div className="vmx-lesson-cards">
          {block.title && <p className="vmx-lesson-cards__title">{block.title}</p>}
          <ul className="vmx-lesson-reading">
            {block.items.map((r) => <li key={r}>{r}</li>)}
          </ul>
        </div>
      );
    case 'bench':
      return (
        <div className="vmx-lesson-bench">
          {block.note && <p className="vmx-lesson-note">{block.note}</p>}
          <ScreeningBench />
        </div>
      );
    default:
      return null;
  }
}

// ── a check ──────────────────────────────────────────────────────
function Check({ check, cleared, onClear }) {
  const [picked, setPicked] = useState(null);
  const answered = picked !== null;
  const correct = answered && picked === check.answer;

  const choose = (i) => {
    if (answered) return;
    setPicked(i);
    if (i === check.answer) onClear(check.id);
  };

  return (
    <div className={`vmx-check ${answered ? 'is-answered' : ''} ${cleared && !answered ? 'is-cleared' : ''}`}>
      <p className="vmx-check__q">
        {check.q}
        {cleared && !answered && <span className="vmx-check__done" title="เคยตอบถูกแล้ว">ตอบถูกแล้ว</span>}
      </p>
      <ul className="vmx-check__options">
        {check.options.map((opt, i) => {
          const isAnswer = i === check.answer;
          const state = !answered ? '' : (isAnswer ? 'is-right' : (i === picked ? 'is-wrong' : ''));
          return (
            <li key={opt}>
              <button
                type="button"
                className={`vmx-check__option ${state}`}
                onClick={() => choose(i)}
                disabled={answered}
                aria-pressed={picked === i}
              >
                <span className="vmx-check__mark" aria-hidden="true">{String.fromCharCode(97 + i)}</span>
                <span>{opt}</span>
              </button>
            </li>
          );
        })}
      </ul>
      {answered && (
        <div className={`vmx-check__why ${correct ? 'is-right' : 'is-wrong'}`}>
          <p className="vmx-check__verdict">{correct ? 'ถูกต้อง' : 'ยังไม่ใช่'}</p>
          <p>{check.why}</p>
        </div>
      )}
    </div>
  );
}

// ── the view ─────────────────────────────────────────────────────
export default function BenchView({ goHome }) {
  const [cleared, setCleared] = useState(() => (typeof window === 'undefined' ? new Set() : readProgress()));
  // Each Check keeps its own pick; bumping this remounts them on reset so
  // every check can be answered again, not only counted again.
  const [resetCount, setResetCount] = useState(0);
  const [active, setActive] = useState(MODULE5.sections[0].id);
  const sectionRefs = useRef({});

  const onClear = useCallback((id) => {
    setCleared((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      writeProgress(next);
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    setCleared(new Set());
    writeProgress(new Set());
    setResetCount((n) => n + 1);
  }, []);

  const total = ALL_CHECKS.length;
  const done = useMemo(() => ALL_CHECKS.filter((c) => cleared.has(c.id)).length, [cleared]);

  // Which section is on screen, so the contents list can say where you are
  // without the page having to be a router.
  useEffect(() => {
    const els = MODULE5.sections.map((s) => sectionRefs.current[s.id]).filter(Boolean);
    if (!els.length || typeof IntersectionObserver === 'undefined') return undefined;
    const io = new IntersectionObserver(
      (entries) => {
        const top = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (top?.target?.dataset?.section) setActive(top.target.dataset.section);
      },
      { rootMargin: '-80px 0px -60% 0px', threshold: 0 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const jump = (id) => {
    sectionRefs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const groups = [
    { id: 'core', label: 'บทเรียนหลัก', minutes: 60 },
    { id: 'extended', label: 'ช่วงขยาย', minutes: 30 },
  ];

  return (
    <div className="vmx-lesson">
      <header className="vmx-lesson__head">
        <div className="vmx-lesson__headmain">
          <p className="vmx-lesson__eyebrow">{MODULE5.module} &nbsp;&#124;&nbsp; {MODULE5.course}</p>
          <h1 className="vmx-lesson__title">{MODULE5.title}</h1>
          <p className="vmx-lesson__sub">{MODULE5.subtitle}</p>
          <p className="vmx-lesson__by">{MODULE5.lecturer}</p>
        </div>
        <div className="vmx-lesson__progress">
          <p className="vmx-lesson__progresslabel">
            ตอบถูกแล้ว <b>{done}</b> จาก {total} ข้อ
          </p>
          <div
            className="vmx-lesson__bar"
            role="progressbar"
            aria-valuenow={done}
            aria-valuemin={0}
            aria-valuemax={total}
            aria-label="ความคืบหน้าของบทเรียน"
          >
            <span style={{ width: `${(done / total) * 100}%` }} />
          </div>
          {done > 0 && (
            <button type="button" className="vmx-lesson__reset" onClick={reset}>
              เริ่มนับใหม่
            </button>
          )}
        </div>
      </header>

      <p className="vmx-lesson__disclaimer">{MODULE5.disclaimer}</p>

      <div className="vmx-lesson__body">
        <nav className="vmx-lesson__toc" aria-label="สารบัญบทเรียน">
          {groups.map((g) => (
            <div key={g.id} className="vmx-lesson__tocgroup">
              <p className="vmx-lesson__tochead">{g.label} ({g.minutes} นาที)</p>
              <ol className="vmx-lesson__toclist">
                {MODULE5.sections.filter((s) => s.group === g.id).map((s) => {
                  const n = MODULE5.sections.indexOf(s) + 1;
                  const sectionChecks = s.checks.filter((c) => cleared.has(c.id)).length;
                  return (
                    <li key={s.id}>
                      <button
                        type="button"
                        className={`vmx-lesson__tocitem ${active === s.id ? 'is-active' : ''}`}
                        onClick={() => jump(s.id)}
                      >
                        <span className="vmx-lesson__tocn">{n}</span>
                        <span className="vmx-lesson__toclabel">{s.title}</span>
                        {s.checks.length > 0 && (
                          <span className={`vmx-lesson__toccount ${sectionChecks === s.checks.length ? 'is-full' : ''}`}>
                            {sectionChecks}/{s.checks.length}
                          </span>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ol>
            </div>
          ))}
        </nav>

        <div className="vmx-lesson__main">
          {MODULE5.sections.map((s, i) => (
            <section
              key={s.id}
              className="vmx-lesson__section"
              data-section={s.id}
              ref={(el) => { sectionRefs.current[s.id] = el; }}
              aria-labelledby={`h-${s.id}`}
            >
              <div className="vmx-lesson__sectionhead">
                <span className="vmx-lesson__sectionn">{String(i + 1).padStart(2, '0')}</span>
                <h2 className="vmx-lesson__sectiontitle" id={`h-${s.id}`}>{s.title}</h2>
                <span className="vmx-lesson__sectionmin">{s.minutes} นาที</span>
              </div>
              {s.blocks.map((b, bi) => <Block key={bi} block={b} />)}
              {s.checks.length > 0 && (
                <div className="vmx-lesson__checks">
                  <p className="vmx-lesson__checkshead">ลองตอบดู</p>
                  {s.checks.map((c) => (
                    <Check key={`${c.id}:${resetCount}`} check={c} cleared={cleared.has(c.id)} onClear={onClear} />
                  ))}
                </div>
              )}
            </section>
          ))}

          <footer className="vmx-lesson__foot">
            <p>
              เนื้อหาทั้งหมดมาจากสไลด์ {MODULE5.module} วิชา{MODULE5.course} ({MODULE5.courseNo}) โดย{MODULE5.lecturer}
              ซึ่งอยู่ในคลังเอกสารของแอป ตัวเลขในโต๊ะทดลองคำนวณสดจากค่าที่ตั้ง ไม่ได้พิมพ์ค้างไว้
            </p>
            {goHome && (
              <button type="button" className="vmx-btn vmx-btn-ghost vmx-btn-sm" onClick={goHome}>
                กลับหน้าแรก
              </button>
            )}
          </footer>
        </div>
      </div>
    </div>
  );
}
