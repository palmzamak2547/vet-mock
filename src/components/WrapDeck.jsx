// ============================================================
// WrapDeck — the wrap-up as a revision deck, one item per card
// ============================================================
// Reading mode is the first pass; this is the second. A card shows only the
// item's name, with each part covered: the student recalls what they can,
// then opens it, and only after seeing it says "จำได้" or "ต้องทวน" — judging
// before seeing the answer flatters the memory. Cards marked ต้องทวน wait in
// a pile and come back in a round of their own. One item per screen keeps
// the load to one thing. "รอบเร็ว" is for the last minutes: the keywords and
// the usual mix-up only, uncovered, in larger type.
//
// The state is pure (lib/wrap-deck.js) and kept per device under a
// vmx-wrap-deck-* key; nothing here touches sync or the exam session.
// ============================================================
import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useModalFocus } from '../hooks/useModalFocus.js';
import {
  AGAIN, KNOWN, cardId, goTo, marked, rate, readDeck, restart, resume, segments, startRedo, tally,
} from '../lib/wrap-deck.js';
import { topicPractice } from '../lib/lecturer-count.js';
import { FORMAT_LABEL } from '../data/lecturer-sets.js';
import { Keywords, Line, SignalLabel } from './WrapParts.jsx';
import WrapSlide from './WrapSlide.jsx';

function loadState(key, ids) {
  try { return readDeck(window.localStorage.getItem(key), ids); } catch { return readDeck(null, ids); }
}

/** The parts of a card, in the order a student recalls them: what causes it, how to tell it, the trap, what was asked, what was stressed. */
function facetsOf(item) {
  const out = [];
  if (item.agent) out.push({ id: 'agent', label: 'เชื้อ' });
  if (item.keywords?.length) out.push({ id: 'keys', label: 'คีย์เวิร์ด', count: item.keywords.length });
  if (item.pitfall) out.push({ id: 'pitfall', label: 'ระวังสับสน', signal: 'pitfall' });
  if (item.examined?.length) out.push({ id: 'examined', label: 'มีในข้อสอบเก่า', signal: 'examined', count: item.examined.length });
  if (item.emphasis?.length) out.push({ id: 'emphasis', label: 'อาจารย์เน้น', signal: 'emphasis', count: item.emphasis.length });
  return out;
}
// "เปิดทั้งใบ" opens everything but the lecturer's long list, which is there to read when wanted.
const coreOf = (facets) => {
  const core = facets.filter((f) => f.id !== 'emphasis');
  return core.length ? core : facets;
};

function FacetBody({ facet, item, course }) {
  if (facet.id === 'agent') return <p className="vmx-deck-text">{item.agent}</p>;
  if (facet.id === 'keys') return <Keywords keywords={item.keywords} rows />;
  if (facet.id === 'pitfall') return <p className="vmx-deck-text">{item.pitfall}</p>;
  const lines = facet.id === 'examined' ? item.examined : item.emphasis;
  return <ul className="vmx-deck-lines">{lines.map((l, i) => <Line key={i} line={l} course={course} />)}</ul>;
}

/** What is left to revise: the pile mid-deck, or the end of the deck. */
function Summary({ state, ids, items, done, onJump, onRedo, onResume, onRestart, practice, headingRef, headingId }) {
  const t = tally(state, ids);
  const again = marked(state, ids, AGAIN);
  return (
    <div className="vmx-deck-sum">
      <h2 id={headingId} ref={headingRef} tabIndex={-1}>
        {done && !again.length ? 'จำได้ครบทุกใบที่ผ่านมา' : `ต้องทวน ${again.length} ใบ`}
      </h2>
      <p className="vmx-deck-sum-line">
        ผ่านไปแล้ว <b>{t.seen}</b> จาก {t.total} ใบ จำได้ <b>{t.known}</b> ต้องทวน <b>{t.again}</b>
      </p>
      {again.length > 0 && (
        <ol className="vmx-deck-pile">
          {again.map((id) => {
            const i = ids.indexOf(id);
            const it = items[i];
            return (
              <li key={id}>
                <button type="button" onClick={() => onJump(i)}>
                  <span className="vmx-wrap-n" aria-hidden="true">{i + 1}</span>
                  <span className="vmx-deck-pile-text">
                    <b>{it.name}</b>
                    {it.keywords?.[0] && <span>{it.keywords[0]}</span>}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      )}
      <div className="vmx-deck-sum-actions">
        {again.length > 0 && (
          <button type="button" className="vmx-deck-btn is-primary" onClick={onRedo}>ทวน {again.length} ใบนี้อีกรอบ</button>
        )}
        {practice}
        {done
          ? <button type="button" className="vmx-deck-btn" onClick={onRestart}>เริ่มสำรับใหม่</button>
          : <button type="button" className="vmx-deck-btn is-quiet" onClick={onResume}>ทวนต่อจากใบที่ {state.pos + 1}</button>}
      </div>
    </div>
  );
}

export default function WrapDeck({ items, storageKey, course = '', slideOf = () => null, base = null, kindTable = {}, subject, onStartTopic = null }) {
  const ids = useMemo(() => items.map(cardId), [items]);
  const [state, setState] = useState(() => loadState(storageKey, ids));
  // Another paper, or the content changed under a kept page: read that paper's deck.
  const loadedFor = useRef(storageKey);
  useEffect(() => {
    if (loadedFor.current === storageKey) return;
    loadedFor.current = storageKey;
    setState(loadState(storageKey, ids));
  }, [storageKey, ids]);
  useEffect(() => {
    try { window.localStorage.setItem(storageKey, JSON.stringify(state)); } catch { /* kept for this visit only */ }
  }, [storageKey, state]);

  const item = items[state.pos];
  const facets = useMemo(() => (item ? facetsOf(item) : []), [item]);
  const core = useMemo(() => coreOf(facets), [facets]);
  const [open, setOpen] = useState(() => new Set());
  const quick = state.pace === 'quick';
  const back = quick || core.every((f) => open.has(f.id));
  const slide = item ? slideOf(item) : null;

  // A new card starts covered, its title takes the focus (a screen reader reads
  // it), and the page returns to the card's top: one card, one screen.
  const deckRef = useRef(null);
  const titleRef = useRef(null);
  const sumRef = useRef(null);
  const firstRender = useRef(true);
  useEffect(() => {
    setOpen(new Set());
    if (firstRender.current) { firstRender.current = false; return; }
    const top = deckRef.current?.getBoundingClientRect().top;
    if (top !== undefined && top < 0) {
      try { window.scrollBy({ top: top - 8, behavior: 'auto' }); } catch { /* old browser: stays */ }
    }
    (state.done ? sumRef.current : titleRef.current)?.focus({ preventScroll: true });
  }, [state.pos, state.done, state.queue?.length]);

  // The pile's count pops when a card lands on it, which says where the card
  // went; only when it grows, never when a redo round takes cards off. The
  // pop is CSS (styles-wrap.css, the chip spring) and off under reduced motion.
  const pileRef = useRef(null);
  const againCount = marked(state, ids, AGAIN).length;
  const lastAgain = useRef(againCount);
  const [grew, setGrew] = useState(0);
  useEffect(() => {
    if (againCount > lastAgain.current) setGrew((g) => g + 1);
    lastAgain.current = againCount;
  }, [againCount]);

  const [pileOpen, setPileOpen] = useState(false);
  const closePile = () => {
    setPileOpen(false);
    window.requestAnimationFrame(() => pileRef.current?.focus({ preventScroll: true }));
  };
  const pileHeading = useRef(null);
  const sheetRef = useModalFocus({ active: pileOpen, onClose: closePile, initialFocusRef: pileHeading });

  const toggle = (id) => setOpen((cur) => {
    const next = new Set(cur);
    if (next.has(id)) next.delete(id); else next.add(id);
    return next;
  });
  const reveal = () => setOpen(new Set(core.map((f) => f.id)));
  const mark = (m) => setState((s) => rate(s, ids, m));
  const jump = (i) => { setPileOpen(false); setState((s) => goTo(resume(s), ids, i)); };
  const setPace = (p) => setState((s) => ({ ...s, pace: p }));

  // The keyboard does what a tap does: Space opens the card, 1 is ต้องทวน,
  // 2 is จำได้ (in the quick round, ถัดไป), the arrows move without marking.
  // Marks wait for the open card, as the buttons do.
  const keys = useRef(null);
  keys.current = { back, quick, done: state.done, reveal, mark, pos: state.pos };
  useEffect(() => {
    const onKey = (e) => {
      if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey) return;
      const t = e.target;
      if (t?.closest?.('input, textarea, select, [contenteditable="true"]')) return;
      if (document.querySelector('[data-vmx-modal="true"]')) return;
      const k = keys.current;
      if (k.done) return;
      if (e.key === ' ' && !t?.closest?.('button, a')) {
        e.preventDefault();
        if (!k.quick) k.reveal();
      } else if (e.key === '1' && k.back) {
        k.mark(AGAIN);
      } else if (e.key === '2' && k.back) {
        k.mark(k.quick ? null : KNOWN);
      } else if (e.key === 'ArrowRight' && !t?.closest?.('[role="group"]')) {
        setState((s) => goTo(s, ids, s.pos + 1));
      } else if (e.key === 'ArrowLeft' && !t?.closest?.('[role="group"]')) {
        setState((s) => goTo(s, ids, s.pos - 1));
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [ids]);

  if (!items.length || !item) {
    return <p className="vmx-wrap-empty">wrap-up นี้ยังไม่มีหัวข้อให้ทวนทีละใบ อ่านแบบเต็มได้ตามปกติ</p>;
  }
  const segs = segments(state, ids);
  const t = tally(state, ids);
  const againIds = marked(state, ids, AGAIN);
  const againTopics = [...new Set(againIds.map((id) => items[ids.indexOf(id)].topic))];
  const drill = onStartTopic && againTopics.length ? topicPractice(kindTable, againTopics, 'all') : null;
  const practice = drill && drill.count > 0 ? (
    <button type="button" className="vmx-deck-btn" onClick={() => onStartTopic({ subjectId: subject, topics: againTopics, questionCategory: 'all' })}>
      ฝึกโจทย์ของใบที่ต้องทวน แบบ{FORMAT_LABEL.all || 'ทุกประเภท'} ({drill.count} ข้อ)
    </button>
  ) : null;
  const summaryProps = {
    state, ids, items, onJump: jump,
    onRedo: () => { setPileOpen(false); setState((s) => startRedo(s, ids)); },
    onResume: () => { closePile(); setState(resume); },
    onRestart: () => setState(restart),
    practice,
  };
  const inRound = Boolean(state.queue);
  const showSlide = slide && (quick || open.has('keys'));

  return (
    <section ref={deckRef} className="vmx-deck" data-pace={state.pace} data-face={back ? 'back' : 'front'} aria-label="ทวนทีละใบ">
      <div className="vmx-deck-bar">
        <div className="vmx-wrap-mode vmx-deck-pace" role="group" aria-label="จังหวะการทวน">
          <button type="button" className={!quick ? 'is-on' : ''} aria-pressed={!quick} onClick={() => setPace('full')}>รอบเต็ม</button>
          <button type="button" className={quick ? 'is-on' : ''} aria-pressed={quick} onClick={() => setPace('quick')}>รอบเร็ว</button>
        </div>
        <button ref={pileRef} type="button" className="vmx-deck-pile-btn" aria-haspopup="dialog" onClick={() => setPileOpen(true)}>
          ต้องทวน <b key={grew} className={grew ? 'is-new' : undefined}>{againCount}</b>
        </button>
      </div>

      {/* Each card is a segment: known, still to revise, the one on screen.
          A look says how far and how it went; the words say it to everyone. */}
      <div className="vmx-deck-progress">
        <div className="vmx-deck-segs" aria-hidden="true">
          {segs.map((s, i) => <i key={ids[i]} className={s ? `is-${s}` : undefined} />)}
        </div>
        <div className="vmx-deck-where">
          <span aria-live="polite">{state.done ? `ครบ ${t.total} ใบ` : `ใบที่ ${state.pos + 1} จาก ${t.total}`}{inRound ? ` รอบทวน เหลือ ${state.queue.length} ใบ` : ''}</span>
          <span className="vmx-deck-lect">{quick ? 'รอบเร็ว: คีย์เวิร์ดกับระวังสับสน' : item.lecturer}</span>
        </div>
      </div>

      {state.done ? (
        <Summary {...summaryProps} done headingRef={sumRef} />
      ) : (
        <>
          <article key={ids[state.pos]} className={`vmx-deck-card${showSlide ? ' has-slide' : ''}`} aria-labelledby="vmx-deck-title">
            <div className="vmx-deck-main">
              <header className="vmx-deck-head">
                <span className="vmx-wrap-n" aria-hidden="true">{state.pos + 1}</span>
                <div>
                  <h2 id="vmx-deck-title" ref={titleRef} tabIndex={-1}>{item.name}</h2>
                  {item.th && <div className="vmx-wrap-th">{item.th}</div>}
                </div>
              </header>

              {quick ? (
                <div className="vmx-deck-quick">
                  <Keywords keywords={item.keywords} rows />
                  {item.pitfall && (
                    <div className="vmx-wrap-pitfall">
                      <SignalLabel kind="pitfall">ระวังสับสน</SignalLabel>
                      <p>{item.pitfall}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="vmx-deck-facets">
                  {facets.map((f) => {
                    const isOpen = open.has(f.id);
                    const bodyId = `vmx-deck-${f.id}`;
                    return (
                      <section key={f.id} className={`vmx-deck-facet is-${f.id}${isOpen ? ' is-open' : ''}`}>
                        <button type="button" className="vmx-deck-facet-h" aria-expanded={isOpen} aria-controls={bodyId} onClick={() => toggle(f.id)}>
                          {f.signal
                            ? <SignalLabel kind={f.signal} as="span">{f.label}{f.count ? <b>{f.count}</b> : null}</SignalLabel>
                            : <span className="vmx-deck-facet-l">{f.label}{f.count ? <b>{f.count}</b> : null}</span>}
                          <span className="vmx-deck-cover">{isOpen ? 'ปิด' : 'แตะเพื่อเปิด'}</span>
                        </button>
                        {isOpen && <div id={bodyId} className="vmx-deck-facet-b"><FacetBody facet={f} item={item} course={course} /></div>}
                      </section>
                    );
                  })}
                </div>
              )}
            </div>

            {showSlide && (
              <aside className="vmx-deck-aside" aria-label="สไลด์ที่อ้าง">
                <div className="vmx-deck-aside-l">สไลด์ <span>{slide.title} หน้า {slide.page}</span></div>
                <WrapSlide rec={slide} base={base} />
              </aside>
            )}
          </article>

          <div className="vmx-deck-foot">
            {!back ? (
              <>
                <p className="vmx-deck-hint">นึกก่อน แล้วค่อยเปิด</p>
                <button type="button" className="vmx-deck-btn is-primary is-wide" onClick={reveal}>เปิดทั้งใบ</button>
              </>
            ) : (
              <div className="vmx-deck-rate">
                <button type="button" className="vmx-deck-btn is-again" onClick={() => mark(AGAIN)}>ต้องทวน</button>
                <button type="button" className="vmx-deck-btn is-primary" onClick={() => mark(quick ? null : KNOWN)}>{quick ? 'ถัดไป' : 'จำได้'}</button>
              </div>
            )}
            <p className="vmx-deck-keys" aria-hidden="true"><kbd>Space</kbd> เปิดทั้งใบ <kbd>1</kbd> ต้องทวน <kbd>2</kbd> {quick ? 'ถัดไป' : 'จำได้'} <kbd>←</kbd><kbd>→</kbd> เลื่อนใบ</p>
          </div>
        </>
      )}

      {pileOpen && createPortal((
        <div className="vmx-deck-scrim" onClick={closePile}>
          <div
            ref={sheetRef}
            className="vmx-deck-sheet"
            role="dialog"
            aria-modal="true"
            aria-labelledby="vmx-deck-sum-h"
            data-vmx-modal="true"
            tabIndex={-1}
            onClick={(e) => e.stopPropagation()}
          >
            <button type="button" className="vmx-deck-sheet-x" aria-label="ปิด" onClick={closePile}>×</button>
            <Summary {...summaryProps} done={false} headingRef={pileHeading} headingId="vmx-deck-sum-h" />
          </div>
        </div>
      ), document.body)}
    </section>
  );
}
