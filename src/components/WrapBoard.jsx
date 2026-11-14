// ============================================================
// WrapBoard — the paper as a differential board (direction C)
// ============================================================
// Reading follows the course; a farm case does not. The board puts the
// paper in the order a case is worked: a step per question asked of the farm
// (how it spreads, how old, what the faeces look like, what an antibiotic
// did, how it is confirmed), each clue pointing to the diseases it suggests.
// A disease is one tap from its own card (the sheet on a phone, the pane
// beside the board on a wide screen), and once picked it is marked on every
// step it appears in, so the student sees all the ways to reach it.
//
// "ปิดชื่อโรคไว้ก่อน" covers every answer: the student reads the clue,
// names the disease, then taps to check. That choice is kept per device
// (lib/wrap-board.js, vmx-wrap-board-*); what has been uncovered belongs to
// this visit only. Every cell is a quoted piece of the wrap-up and each step
// cites the lines it quotes (lib/wrap-board.js refuses anything else).
// Nothing here touches sync or the exam session.
// ============================================================
import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useModalFocus } from '../hooks/useModalFocus.js';
import { readBoardPrefs, freshBoardPrefs, numberList } from '../lib/wrap-board.js';
import { slideWord } from '../lib/wrap-cite.js';
import { Cite, CitedText, Keywords, Line, SignalLabel } from './WrapParts.jsx';
import WrapSlide from './WrapSlide.jsx';

const WIDE = '(min-width: 1024px)';
const wideNow = () => { try { return window.matchMedia(WIDE).matches; } catch { return false; } };
function useWide() {
  const [wide, setWide] = useState(wideNow);
  useEffect(() => {
    let mq;
    try { mq = window.matchMedia(WIDE); } catch { return undefined; }
    const on = () => setWide(mq.matches);
    on();
    mq.addEventListener?.('change', on);
    return () => mq.removeEventListener?.('change', on);
  }, []);
  return wide;
}

function loadPrefs(key) {
  try { return readBoardPrefs(window.localStorage.getItem(key)); } catch { return freshBoardPrefs(); }
}

const KIND_WORD = { keywords: 'คีย์เวิร์ด', pitfall: 'ระวังสับสน', agent: 'เชื้อ' };

function EyeOff() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 3l18 18" />
      <path d="M10.6 5.1A9.7 9.7 0 0 1 12 5c5.5 0 9 7 9 7a16 16 0 0 1-2.6 3.4M6.6 6.6C4.2 8.2 3 12 3 12s3.5 7 9 7c1.6 0 3-.4 4.3-1.1" />
      <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
    </svg>
  );
}

/** One disease's card, beside the board or in the sheet. */
function Detail({ item, n, slide, base, course, onRead, headingRef }) {
  return (
    <div className="vmx-board-detail">
      <header className="vmx-board-detail-head">
        <span className="vmx-wrap-n" aria-hidden="true">{n}</span>
        <div>
          <h3 id="vmx-board-detail-h" ref={headingRef} tabIndex={-1}>{item.name}</h3>
          {item.th && <div className="vmx-wrap-th">{item.th}</div>}
        </div>
      </header>
      {item.agent && <p className="vmx-board-agent">{item.agent}</p>}
      {slide && (
        <figure className="vmx-board-slide">
          <figcaption>สไลด์ <span>{slide.title} หน้า {slide.page}</span></figcaption>
          <WrapSlide rec={slide} base={base} />
        </figure>
      )}
      {item.pitfall && (
        <div className="vmx-wrap-pitfall">
          <SignalLabel kind="pitfall">ระวังสับสน</SignalLabel>
          <p><CitedText text={item.pitfall} /></p>
        </div>
      )}
      {item.keywords?.length > 0 && (
        <div className="vmx-board-keys">
          <div className="vmx-board-sub">คีย์เวิร์ด <b>{item.keywords.length}</b></div>
          <Keywords keywords={item.keywords} rows />
        </div>
      )}
      {item.examined?.length > 0 && (
        <div className="vmx-wrap-list is-examined">
          <SignalLabel kind="examined">มีในข้อสอบเก่า</SignalLabel>
          <ul>{item.examined.map((l, i) => <Line key={i} line={l} course={course} />)}</ul>
        </div>
      )}
      {onRead && (
        <button type="button" className="vmx-deck-btn is-quiet vmx-board-read" onClick={() => onRead(n)}>
          อ่านหัวข้อ {n} แบบเต็ม
        </button>
      )}
    </div>
  );
}

export default function WrapBoard({ board, items, storageKey, course = '', slideOf = () => null, base = null, onRead = null }) {
  const [prefs, setPrefs] = useState(() => loadPrefs(storageKey));
  const loadedFor = useRef(storageKey);
  useEffect(() => {
    if (loadedFor.current === storageKey) return;
    loadedFor.current = storageKey;
    setPrefs(loadPrefs(storageKey));
  }, [storageKey]);
  const setHide = (hide) => {
    const next = { ...prefs, hide };
    setPrefs(next);
    setShown(new Set());
    try { window.localStorage.setItem(storageKey, JSON.stringify(next)); } catch { /* this visit only */ }
  };

  // Cells uncovered on this visit, by place on the board.
  const [shown, setShown] = useState(() => new Set());
  // The disease picked stays marked across the board; on a phone its card is
  // a sheet that closes without un-marking it.
  const [picked, setPicked] = useState(null);
  const [sheet, setSheet] = useState(false);
  const wide = useWide();

  const item = picked ? items[picked - 1] : null;
  const slide = item ? slideOf(item) : null;

  // The sheet on a phone: focus to its heading, back to the tapped disease on close.
  const lastTap = useRef(null);
  const headingRef = useRef(null);
  const close = () => {
    setSheet(false);
    const back = lastTap.current;
    window.requestAnimationFrame(() => back?.focus?.({ preventScroll: true }));
  };
  const sheetOpen = Boolean(item) && sheet && !wide;
  const sheetRef = useModalFocus({ active: sheetOpen, onClose: close, initialFocusRef: headingRef });
  // On a wide screen the pane is beside the board: a pick moves focus to it only from the keyboard.
  useEffect(() => {
    if (!wide || !picked) return;
    if (document.activeElement?.closest?.('.vmx-board-step')) headingRef.current?.focus({ preventScroll: true });
  }, [wide, picked]);
  useEffect(() => {
    if (!sheetOpen) return undefined;
    const before = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = before; };
  }, [sheetOpen]);

  const subtitle = useMemo(() => {
    const rest = board.items.filter((n) => n !== board.frame);
    const head = board.frame ? `โครงมาจากหัวข้อ ${board.frame} ` : '';
    return `${head}โรคบนกระดานคือหัวข้อ ${numberList(rest)} แตะชื่อโรคเพื่อดูรายละเอียด`;
  }, [board]);

  const open = (place, n, e) => {
    if (prefs.hide && !shown.has(place)) {
      setShown((s) => new Set(s).add(place));
      return;
    }
    if (n) {
      lastTap.current = e?.currentTarget || null;
      setPicked((cur) => (cur === n && wide ? null : n));
      setSheet(true);
    }
  };

  const detail = item ? (
    <Detail item={item} n={picked} slide={slide} base={base} course={course} onRead={onRead} headingRef={headingRef} />
  ) : null;

  return (
    <section className="vmx-board" data-hide={prefs.hide ? 'on' : 'off'} aria-label="กระดานแยกโรค">
      <header className="vmx-board-head">
        <h2>{board.titleParts.map((part, i) => <span key={i} className="vmx-board-phrase">{i ? ' ' : ''}{slideWord(part)}</span>)}</h2>
        <p className="vmx-board-lede">{subtitle}</p>
        <button type="button" className="vmx-board-hide" aria-pressed={prefs.hide} onClick={() => setHide(!prefs.hide)}>
          <EyeOff />
          ปิดชื่อโรคไว้ก่อน
        </button>
        {prefs.hide && <p className="vmx-board-hint">อ่านสิ่งที่เห็นในฟาร์ม นึกชื่อโรค แล้วแตะช่องเพื่อเปิดทีละช่อง</p>}
      </header>

      <div className={`vmx-board-body${wide ? ' is-wide' : ''}`}>
        <ol className="vmx-board-steps">
          {board.steps.map((step, si) => (
            <li key={step.title} className="vmx-board-step">
              <h3 className="vmx-board-step-h"><span className="vmx-board-stepn" aria-hidden="true">{si + 1}</span>{step.title}</h3>
              <ul className="vmx-board-rows">
                {step.rows.map((row, ri) => (
                  <li key={ri} className="vmx-board-row">
                    <div className="vmx-board-clue">{slideWord(row.clue.text)}</div>
                    <span className="vmx-board-arrow" aria-hidden="true">→</span>
                    <div className="vmx-board-to">
                      {row.note && <p className="vmx-board-note">{slideWord(row.note)}</p>}
                      {row.to.map((t, ti) => {
                        const place = `${si}.${ri}.${ti}`;
                        const covered = prefs.hide && !shown.has(place);
                        if (covered) {
                          return (
                            <button key={place} type="button" className="vmx-board-cover" onClick={(e) => open(place, null, e)} aria-label={`เปิดช่องนี้: ${slideWord(row.clue.text)}`}>
                              <EyeOff />แตะเพื่อเปิด
                            </button>
                          );
                        }
                        if (t.kind === 'text') {
                          return <div key={place} className="vmx-board-result">{slideWord(t.text)}</div>;
                        }
                        return (
                          <button
                            key={place}
                            type="button"
                            className={`vmx-board-node${picked === t.n ? ' is-picked' : ''}`}
                            aria-pressed={picked === t.n}
                            aria-haspopup={wide ? undefined : 'dialog'}
                            onClick={(e) => open(place, t.n, e)}
                          >
                            <span className="vmx-wrap-n" aria-hidden="true">{t.n}</span>
                            <span className="vmx-board-node-text">
                              <b>{t.short}</b>
                              {t.notes.map((note) => <span key={note}>{slideWord(note)}</span>)}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </li>
                ))}
              </ul>
              <div className="vmx-board-cite">
                <span className="vmx-board-cite-l">ที่มา</span>
                <ul>
                  {step.cites.map((c) => (
                    <li key={`${c.n}|${c.kind}|${c.src || ''}`}>
                      <span className="vmx-board-cite-n">หัวข้อ {c.n}</span>
                      {c.src ? <Cite src={c.src} course={course} /> : <small className="vmx-wrap-src">{KIND_WORD[c.kind] || ''}</small>}
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ol>

        {wide && (
          <aside className="vmx-board-pane" aria-label="รายละเอียดโรค">
            {detail || <p className="vmx-board-pane-empty">แตะชื่อโรคบนกระดาน รายละเอียดจะขึ้นที่นี่ และโรคนั้นจะถูกเน้นทุกขั้น</p>}
          </aside>
        )}
      </div>

      {sheetOpen && createPortal((
        <div className="vmx-deck-scrim" onClick={close}>
          <div
            ref={sheetRef}
            className="vmx-deck-sheet vmx-board-sheet"
            role="dialog"
            aria-modal="true"
            aria-labelledby="vmx-board-detail-h"
            data-vmx-modal="true"
            tabIndex={-1}
            onClick={(e) => e.stopPropagation()}
          >
            <button type="button" className="vmx-deck-sheet-x" aria-label="ปิด" onClick={close}>×</button>
            {detail}
          </div>
        </div>
      ), document.body)}
    </section>
  );
}
