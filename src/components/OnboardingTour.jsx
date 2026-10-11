// ============================================================
// OnboardingTour — วิธีใช้: the goals a student has, taught step by step
// ============================================================
// Owner review (v5.141.6): "วิธีใช้งาน บอกแค่อันคร่าวๆ ยังไม่แนะนำการใช้ได้จริง".
// The old tour was seven paragraphs describing what exists. This one starts
// from what the student wants to do (ฝึกทุกวัน, เตรียมสอบ, ทบทวนข้อที่ผิด,
// อ่านสรุปแล้วพิมพ์เป็น PDF, ค้นหาและถาม, ใช้บนมือถือ). Each goal is two to
// four steps that name the exact button, and a step that has a place to go
// carries a button that goes there, the same way the bottom bar would.
//
// Contract with App.jsx (unchanged where it existed):
//   onDismiss, onStart, returnFocusRef   as before; onStart is "ลองทำ 1 ข้อเลย"
//   navHandlers   the bottom bar's own handler bundle (lib/nav.js runNav), so
//                 a go button means exactly what a bar tap means. Optional:
//                 without it the steps still teach, they just cannot carry
//                 anyone anywhere, and no dead button is drawn.
//   onOpenSearch  opens the search palette (optional, same rule)
//   step / onNext / onBack are no longer read: the guide keeps its own place.
//
// Content: data/how-to.js. Memory (goals opened, open-at-goal requests from a
// hint): lib/guide-progress.js. Styles: styles.css, the night-b block.
//
// Accessibility: one dialog named by the visible heading of the screen it
// shows; useModalFocus owns the trap, Escape and the return to the launcher.
// Moving between the list and a goal moves focus to the new heading, and
// back to the row the student came from, so a keyboard or screen reader never
// lands on <body> when the screen changes.
// ============================================================

import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { useModalFocus } from '../hooks/useModalFocus.js';
import NavIcon from './NavIcon.jsx';
import Mochi from './Mochi.jsx';
import HowToText from './HowToText.jsx';
import { GUIDE_REOPEN_HINT, featureInvoke, goLabel, guideContext, guidePathsFor } from '../data/how-to.js';
import { consumeGuidePath, markGuideSeen, peekGuidePath, readGuideProgress } from '../lib/guide-progress.js';
import { commandShortcutLabel, runNav } from '../lib/nav.js';
import { rememberViewIntent } from '../lib/feature-registry.js';

// One phone glyph the shared icon set does not have, drawn on the same grid
// and stroke as NavIcon so the list reads as one family.
function GuideIcon({ name, size = 20 }) {
  if (name !== 'phone') return <NavIcon name={name} size={size} />;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <rect x="7" y="2.5" width="10" height="19" rx="2.5" />
      <path d="M11 18.5h2" />
    </svg>
  );
}

export default function OnboardingTour({ onDismiss, onStart, returnFocusRef, navHandlers = null, onOpenSearch = null }) {
  // Which goals this student can follow (their year decides whether the
  // question goals exist yet), read once for the life of the dialog.
  const paths = useMemo(() => guidePathsFor(guideContext()), []);
  const ids = useMemo(() => paths.map((p) => p.id), [paths]);

  // A hint's "ดูวิธีใช้เรื่องนี้ทั้งหมด" asks for one goal. Peeked here,
  // consumed after commit, so a render StrictMode throws away cannot eat it.
  const [requested] = useState(() => peekGuidePath());
  const [screen, setScreen] = useState(() => (ids.includes(requested) ? requested : null));
  const [direction, setDirection] = useState('in');
  const [progress, setProgress] = useState(() => readGuideProgress(ids));
  const shortcut = useMemo(() => commandShortcutLabel(), []);

  const titleId = useId();
  const introId = useId();
  const initialFocusRef = useRef(null);
  const titleRef = useRef(null);
  const rowRefs = useRef(new Map());
  const cameFromRef = useRef(null);
  const settledRef = useRef(false);

  useEffect(() => { consumeGuidePath(requested); }, [requested]);
  useEffect(() => {
    if (screen) setProgress(markGuideSeen(screen, ids));
  }, [screen, ids]);

  const dialogRef = useModalFocus({ onClose: onDismiss, returnFocusRef, initialFocusRef });
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previousOverflow; };
  }, []);

  // Focus follows the screen. The first paint is useModalFocus's job.
  useEffect(() => {
    if (!settledRef.current) { settledRef.current = true; return; }
    const target = screen ? titleRef.current : rowRefs.current.get(cameFromRef.current);
    if (!target) return;
    target.focus({ preventScroll: true });
    target.scrollIntoView?.({ block: 'nearest' });
  }, [screen]);

  const openPath = (id) => {
    cameFromRef.current = id;
    setDirection('forward');
    setScreen(id);
  };
  const showList = () => {
    setDirection('back');
    setScreen(null);
  };

  const canGo = (go) => {
    if (!go) return false;
    if (go.search) return typeof onOpenSearch === 'function';
    if (go.nav === 'mock-exam') return typeof navHandlers?.onMockExam === 'function';
    return typeof navHandlers?.setView === 'function';
  };
  const runGo = (go) => {
    if (!canGo(go)) return;
    onDismiss?.();
    if (go.search) { onOpenSearch(); return; }
    if (go.nav) { runNav(go.nav, navHandlers); return; }
    // The registry's own invoke for a feature (an intent such as "notes"
    // survives the subject picker), exactly as the Home menu dispatches it.
    const target = go.feature ? featureInvoke(go.feature) : { view: go.view };
    rememberViewIntent(target?.intent || null);
    if (target?.view) navHandlers.setView(target.view);
  };

  const seen = new Set(progress.seen);
  const seenCount = paths.filter((p) => seen.has(p.id)).length;
  const allSeen = seenCount === paths.length;
  const index = screen ? ids.indexOf(screen) : -1;
  const path = index >= 0 ? paths[index] : null;
  const nextPath = path ? paths[index + 1] || null : null;
  const describedBy = path ? (path.intro ? introId : undefined) : introId;

  const closeButton = (
    <button type="button" className="vmx-icon-close vmx-guide-close" aria-label="ปิดวิธีใช้" onClick={onDismiss}>
      <NavIcon name="close" size={16} />
    </button>
  );

  const list = (
    <>
      <div className="vmx-guide-head">
        <span className="vmx-guide-mochi" aria-hidden="true">
          <Mochi state={allSeen ? 'happy' : 'wave'} size={44} animate slot="guide" />
        </span>
        {closeButton}
      </div>
      <div className="vmx-guide-scroll">
        <h2 id={titleId} className="vmx-guide-title">วิธีใช้ VetMock</h2>
        <p id={introId} className="vmx-guide-intro">เลือกสิ่งที่อยากทำ แล้วทำตามทีละขั้น ทุกขั้นบอกชื่อปุ่มที่ต้องกด</p>
        {seenCount > 0 && (
          <p className="vmx-guide-progress">
            <span className="vmx-guide-pips" aria-hidden="true">
              {paths.map((p) => <i key={p.id} className={seen.has(p.id) ? 'is-seen' : undefined} />)}
            </span>
            {allSeen ? 'ดูครบทุกเรื่องแล้ว' : `ดูแล้ว ${seenCount} จาก ${paths.length} เรื่อง`}
          </p>
        )}
        <ul className="vmx-guide-list" role="list">
          {paths.map((p, i) => {
            const done = seen.has(p.id);
            return (
              <li key={p.id}>
                <button
                  type="button"
                  className={`vmx-guide-row${done ? ' is-seen' : ''}${done && direction === 'back' && cameFromRef.current === p.id ? ' is-fresh' : ''}`}
                  onClick={() => openPath(p.id)}
                  ref={(el) => {
                    if (el) rowRefs.current.set(p.id, el); else rowRefs.current.delete(p.id);
                    if (el && i === 0 && !screen) initialFocusRef.current = el;
                  }}
                >
                  <span className="vmx-guide-row-icon" aria-hidden="true">
                    {done ? <NavIcon name="check" size={20} /> : <GuideIcon name={p.icon} />}
                  </span>
                  <span className="vmx-guide-row-copy">
                    <span className="vmx-guide-row-title">{p.title}</span>
                    <span className="vmx-guide-row-sub">{p.summary}</span>
                    {done && <span className="vmx-sr-only">ดูแล้ว</span>}
                  </span>
                  <span className="vmx-guide-row-arrow" aria-hidden="true">›</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="vmx-guide-foot">
        <p className="vmx-guide-reopen">{GUIDE_REOPEN_HINT}</p>
        <button type="button" className="vmx-btn vmx-btn-ghost" onClick={onDismiss}>ปิด</button>
      </div>
    </>
  );

  const goal = path && (
    <>
      <div className="vmx-guide-head">
        <button type="button" className="vmx-guide-back" onClick={showList}>
          <span aria-hidden="true">‹</span> ทุกเรื่อง
        </button>
        {closeButton}
      </div>
      <div className="vmx-guide-scroll">
        <p className="vmx-guide-eyebrow">
          <GuideIcon name={path.icon} size={16} />
          <span>เรื่องที่ {index + 1} จาก {paths.length}</span>
        </p>
        <h2
          id={titleId}
          className="vmx-guide-title"
          tabIndex={-1}
          ref={(el) => {
            titleRef.current = el;
            if (el) initialFocusRef.current = el;
          }}
        >
          {path.title}
        </h2>
        {path.intro && <p id={introId} className="vmx-guide-intro">{path.intro}</p>}
        <ol className="vmx-guide-steps" role="list">
          {path.steps.map((s, i) => (
            <li key={i} className="vmx-guide-step">
              <span className="vmx-guide-step-num" aria-hidden="true">{i + 1}</span>
              <div className="vmx-guide-step-body">
                <p className="vmx-guide-step-text"><HowToText text={s.text} /></p>
                {s.note && <p className="vmx-guide-step-note"><HowToText text={s.note} /></p>}
                {s.keys === 'palette' && (
                  <p className="vmx-guide-step-keys">คีย์ลัด <kbd className="vmx-kbd">{shortcut}</kbd></p>
                )}
                {canGo(s.go) && (
                  <button type="button" className="vmx-guide-go" onClick={() => runGo(s.go)}>
                    {goLabel(s.go)} <span aria-hidden="true">→</span>
                  </button>
                )}
              </div>
            </li>
          ))}
        </ol>
        {path.start && typeof onStart === 'function' && (
          <button type="button" className="vmx-btn vmx-btn-ghost vmx-guide-start" onClick={onStart}>
            {path.start}
          </button>
        )}
      </div>
      <div className="vmx-guide-foot">
        <button
          type="button"
          className="vmx-btn vmx-btn-primary vmx-guide-next"
          onClick={() => (nextPath ? openPath(nextPath.id) : onDismiss?.())}
          aria-label={nextPath ? `เรื่องถัดไป: ${nextPath.title}` : undefined}
        >
          {nextPath ? 'เรื่องถัดไป' : 'เสร็จแล้ว'}
        </button>
      </div>
    </>
  );

  return (
    <div className="vmx-tour-overlay">
      <div className="vmx-tour-backdrop" aria-hidden="true" onClick={onDismiss} />
      <div
        ref={dialogRef}
        tabIndex="-1"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={describedBy}
        data-vmx-modal="true"
        className="vmx-tour-dialog vmx-guide"
      >
        <div key={screen || 'list'} className={`vmx-guide-screen is-${direction}`}>
          {goal || list}
        </div>
      </div>
    </div>
  );
}
