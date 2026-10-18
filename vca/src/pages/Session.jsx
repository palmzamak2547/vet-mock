// A running set, full screen. Practice reveals each answer and its reason at once; a mock exam
// keeps its answers open until it is submitted, against a clock that keeps running when the
// page is closed, as in the exam room.
//
// Keys: 1-5 or A-E choose (by physical key, so a Thai keyboard layout works too), Space
// chooses the focused option, Enter continues, ← → move between questions outside the option
// list, F flags, G opens the question map.

import { useCallback, useEffect, useRef, useState } from 'react';
import { Question } from '../components/Question.jsx';
import { Icon } from '../components/Icon.jsx';
import { haptic } from '../lib/motion.js';
import { Kbd } from '../components/bits.jsx';
import { Sheet } from '../components/Sheet.jsx';
import { Link } from '../components/Link.jsx';
import { isWithdrawn, itemsReady, loadItems, questionByKey } from '../lib/bank.js';
import { choose, finish, go, isExpired, keepResult, refreshItems, resultsStore, sessionStore, tally, toggleFlag } from '../lib/session.js';
import { progressStore, recordAnswer, recordAnswers } from '../lib/progress.js';
import { useActiveSession, useNow, useTitle } from '../lib/hooks.js';
import { navigate } from '../router.js';
import { clock, num } from '../lib/format.js';

const KEY_ROW = { Digit1: 0, Digit2: 1, Digit3: 2, Digit4: 3, Digit5: 4, Digit6: 5, Numpad1: 0, Numpad2: 1, Numpad3: 2, Numpad4: 3, Numpad5: 4, Numpad6: 5, KeyA: 0, KeyB: 1, KeyC: 2, KeyD: 3, KeyE: 4 };

/**
 * The questions behind the set's items, fetched as the shards that hold them (nothing more of the
 * bank). A set just made has them already, and opens ready; one resumed after a reload asks the
 * browser's cache or the network for them.
 */
function useQuestionsFor(session) {
  const id = session?.id;
  const [state, setState] = useState(() => ({ status: session && !itemsReady(session.items) ? 'loading' : 'ready', done: 0, total: 0 }));
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const items = sessionStore.get()?.items;
    if (!items) return undefined;
    // Everything is here already (a set just made): nothing to fetch, and no second render to say so.
    if (itemsReady(items)) { setState((s) => (s.status === 'ready' ? s : { status: 'ready', done: 0, total: 0 })); return undefined; }
    let live = true;
    setState({ status: 'loading', done: 0, total: items.length });
    loadItems(items, (done, total) => { if (live) setState((s) => (s.status === 'loading' ? { ...s, done, total } : s)); })
      .then(() => { if (live) setState({ status: 'ready', done: 0, total: 0 }); },
        () => { if (live) setState((s) => ({ ...s, status: 'error' })); });
    return () => { live = false; };
  }, [id, attempt]);
  return { ...state, retry: () => setAttempt((n) => n + 1) };
}

/** The clock alone re-renders four times a second; the question does not. */
function RunTimer({ deadline, onExpire }) {
  const now = useNow(250, true);
  const left = Math.max(0, deadline - now);
  const expired = left <= 0;
  useEffect(() => { if (expired) onExpire(); }, [expired, onExpire]);
  const warn = left < 5 * 60e3;
  const urgent = left < 60e3;
  return (
    <span className={`run-timer${warn ? ' warn' : ''}${urgent ? ' urgent' : ''}`} role="timer" aria-live="off" aria-label={`เหลือเวลา ${clock(left)}`}>
      <Icon name="clock" size={18} />{clock(left)}
    </span>
  );
}

export default function Session() {
  const session = useActiveSession();
  useTitle(session ? (session.mode === 'mock' ? 'สอบจำลอง' : 'ฝึกทีละข้อ') : 'ไม่มีชุดที่กำลังทำ');
  const data = useQuestionsFor(session);
  const done = useRef(false);
  const [sheet, setSheet] = useState(null); // 'map' | 'submit' | 'exit' | null
  const stemRef = useRef(null);
  const nextRef = useRef(null);
  // Which way the student moved, fixed per question so an answer never replays the slide.
  const lastCursor = useRef(session?.cursor ?? 0);
  const swap = useRef({ key: null, dir: 'next' });
  const here = session?.items[session.cursor]?.key ?? null;
  if (here !== swap.current.key) swap.current = { key: here, dir: session && session.cursor < lastCursor.current ? 'prev' : 'next' };
  const dir = swap.current.dir;
  useEffect(() => { if (session) lastCursor.current = session.cursor; });

  const timed = session?.deadline != null;

  const complete = useCallback(({ early = false } = {}) => {
    const s = sessionStore.get();
    if (!s || done.current) return;
    done.current = true;
    // A question held back since the set was made (its domain's index no longer lists it) does not count.
    let result = finish(s, Date.now(), { paused: (key) => { const it = s.items.find((x) => x.key === key); return !!it && isWithdrawn(it.domain, key); } });
    if (s.mode === 'practice' && early) {
      const answered = result.items.filter((it) => it.choice !== null);
      if (!answered.length) { sessionStore.set(null); navigate('/practice', { replace: true }); return; }
      result = { ...result, items: answered, total: answered.length, answered: answered.length, correct: answered.filter((it) => it.correct).length, endedEarly: true };
    }
    if (s.mode === 'mock') {
      const answers = result.items.filter((it) => it.choice !== null).map((it) => ({ key: it.key, domain: it.domain, correct: it.correct, at: result.finishedAt }));
      progressStore.set((p) => recordAnswers(p, answers));
    }
    resultsStore.set((list) => keepResult(list, result));
    sessionStore.set(null);
    navigate(`/result/${result.id}`, { replace: true });
  }, []);

  // A deadline that passed while the page was closed hands the exam in on arrival; one that
  // passes now is RunTimer's to report.
  useEffect(() => {
    const s = sessionStore.get();
    if (s && s.deadline != null && isExpired(s, Date.now())) complete();
  }, [complete]);

  // Once the questions are loaded, grade the set against them as they are now (a key corrected
  // since the set was made would otherwise be marked one way on screen and another in the score).
  useEffect(() => {
    if (data.status !== 'ready') return;
    const s = sessionStore.get();
    if (!s) return;
    const next = refreshItems(s, questionByKey);
    if (next !== s) sessionStore.set(next);
  }, [data.status, session?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const item = session?.items[session.cursor];
  const q = item ? questionByKey(item.key) : null;
  const answer = item ? session.answers[item.key] : null;
  const revealed = session?.mode === 'practice' && !!answer;
  const last = session ? session.cursor === session.items.length - 1 : false;

  const moveTo = useCallback((index) => {
    const s = sessionStore.get();
    if (!s) return;
    const next = go(s, index);
    if (next !== s) {
      sessionStore.set(next);
      window.scrollTo({ top: 0 });
      requestAnimationFrame(() => stemRef.current?.querySelector('.q-stem')?.focus({ preventScroll: true }));
    }
  }, []);

  const onChoose = useCallback((orig) => {
    const s = sessionStore.get();
    const it = s?.items[s.cursor];
    if (!it) return;
    const next = choose(s, it.key, orig);
    if (next === s) return;
    sessionStore.set(next);
    haptic(s.mode === 'practice' ? (orig === it.answer ? 10 : [8, 50, 8]) : 6);
    if (s.mode === 'practice') {
      progressStore.set((p) => recordAnswer(p, { key: it.key, domain: it.domain, correct: orig === it.answer }));
      // Continue sits where the thumb is; Enter follows it there.
      requestAnimationFrame(() => {
        nextRef.current?.focus({ preventScroll: true });
        const why = document.querySelector('.run .why');
        if (why && why.getBoundingClientRect().top > window.innerHeight - 160) why.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  }, []);

  const advance = useCallback(() => {
    const s = sessionStore.get();
    if (!s) return;
    const it = s.items[s.cursor];
    if (s.mode === 'practice' && !s.answers[it.key] && questionByKey(it.key)) return;
    if (s.cursor === s.items.length - 1) {
      if (s.mode === 'practice') complete();
      else setSheet('submit');
      return;
    }
    moveTo(s.cursor + 1);
  }, [complete, moveTo]);

  // Keys from a capture listener, so the option buttons never see an Enter they would click.
  useEffect(() => {
    const onKey = (e) => {
      if (sheet || e.metaKey || e.ctrlKey || e.altKey) return;
      const t = e.target;
      if (t instanceof HTMLElement && (t.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(t.tagName))) return;
      const s = sessionStore.get();
      if (!s) return;
      const it = s.items[s.cursor];
      const onOption = t instanceof HTMLElement && t.getAttribute('role') === 'radio';
      if (e.code in KEY_ROW) {
        const row = KEY_ROW[e.code];
        if (row < it.order.length) { e.preventDefault(); onChoose(it.order[row]); }
        return;
      }
      if (e.key === 'Enter') {
        if (!onOption && t instanceof HTMLElement && (t.tagName === 'BUTTON' || t.tagName === 'A')) return;
        e.preventDefault();
        advance();
        return;
      }
      if ((e.key === 'ArrowRight' || e.key === 'ArrowLeft') && !onOption) {
        e.preventDefault();
        if (e.key === 'ArrowLeft') moveTo(s.cursor - 1);
        else advance();
        return;
      }
      if (e.code === 'KeyF' && s.mode === 'mock') { e.preventDefault(); sessionStore.set(toggleFlag(s, it.key)); return; }
      if (e.code === 'KeyG') { e.preventDefault(); setSheet('map'); }
    };
    document.addEventListener('keydown', onKey, true);
    return () => document.removeEventListener('keydown', onKey, true);
  }, [sheet, onChoose, advance, moveTo]);

  if (!session) {
    return (
      <div className="wrap run-empty">
        <div className="empty">
          <p className="kicker">No set open</p>
          <h1 className="page-h">ยังไม่มีชุดที่กำลังทำ</h1>
          <p>ตั้งชุดฝึกหรือสอบจำลองใหม่ได้เลย ผลของชุดที่ทำเสร็จแล้วอยู่ในหน้าความคืบหน้า</p>
          <div className="row-gap">
            <Link to="/practice" className="btn btn-ink">ตั้งชุดฝึก</Link>
            <Link to="/progress" className="btn btn-ghost">ความคืบหน้า</Link>
          </div>
        </div>
      </div>
    );
  }

  const t = tally(session);
  const flagged = session.flags.includes(item.key);

  return (
    <div className={`run run-${session.mode}`}>
      <h1 className="sr">{session.mode === 'mock' ? 'สอบจำลอง' : 'ฝึกทีละข้อ'} ข้อ {session.cursor + 1} จาก {session.items.length}</h1>
      <header className="run-bar glass">
        <button type="button" className="icon-btn" onClick={() => setSheet('exit')} aria-label="พักหรือจบชุดนี้"><Icon name="x" /></button>
        <div className="run-progress">
          <span className="run-count"><span className="run-count-k">ข้อ </span><b key={session.cursor} className="tick">{session.cursor + 1}</b><span> / {session.items.length}</span></span>
          <span className="run-line" aria-hidden="true"><i style={{ width: `${(t.answered / t.total) * 100}%` }} /></span>
        </div>
        {timed && <RunTimer deadline={session.deadline} onExpire={complete} />}
        {session.mode === 'mock' && (
          <button type="button" className="icon-btn" aria-pressed={flagged} onClick={() => sessionStore.set(toggleFlag(sessionStore.get(), item.key))} aria-label={flagged ? 'เอาธงออก' : 'ปักธงข้อนี้'} title="ปักธง (F)">
            <Icon name="flag" />
          </button>
        )}
        <button type="button" className="icon-btn" onClick={() => setSheet('map')} aria-label="แผนผังข้อสอบ" title="แผนผังข้อ (G)"><Icon name="grid" /></button>
      </header>

      <div className="run-body" ref={stemRef}>
        {data.status === 'error' ? (
          <div className="run-card glass">
            <p className="notice notice-error"><Icon name="info" />โหลดข้อสอบไม่สำเร็จ ชุดนี้ยังเก็บไว้ครบ ตรวจการเชื่อมต่อแล้วลองอีกครั้ง</p>
            <button type="button" className="btn btn-ink" onClick={data.retry}><Icon name="refresh" />ลองอีกครั้ง</button>
          </div>
        ) : data.status !== 'ready' ? (
          <div className="run-card glass run-loading" role="status">
            <div className="skel-card" aria-hidden="true">
              <span className="skel skel-line w40" />
              <span className="skel skel-line w80" />
              <span className="skel skel-line w60" />
              {[0, 1, 2, 3, 4].map((i) => <span key={i} className="skel skel-opt" />)}
            </div>
            <span className="run-loading-t">กำลังโหลดข้อสอบ {data.total > 1 && data.done ? `${data.done}/${data.total} ข้อ` : ''}</span>
          </div>
        ) : !q ? (
          <div className="run-card glass">
            <p className="notice"><Icon name="info" />ข้อนี้ถูกพักไว้ระหว่างตรวจเฉลยใหม่ ข้ามไปข้อถัดไปได้เลย ข้อนี้ไม่นับคะแนน</p>
          </div>
        ) : (
          <div className="run-card glass">
            <div key={item.key} className={`q-swap${dir === 'prev' ? ' from-prev' : ''}`}>
              <Question
                q={q} order={item.order} choice={answer?.choice ?? null} revealed={revealed}
                onChoose={revealed ? undefined : onChoose}
                mode={session.mode}
              />
            </div>
            {session.mode === 'mock' && flagged && <p className="run-flag"><Icon name="flag" size={16} />ปักธงไว้ ตรวจอีกครั้งก่อนส่ง</p>}
          </div>
        )}
      </div>

      <footer className="run-actions glass">
        {session.mode === 'practice' ? (
          revealed || !q ? (
            <>
              <span className="run-hint">{q ? <span className="keys-only">กด <Kbd>Enter</Kbd> ไปต่อ</span> : null}</span>
              <button type="button" ref={nextRef} className="btn btn-ink btn-lg" onClick={advance}>
                {last ? 'ดูผลชุดนี้' : 'ข้อถัดไป'} <Icon name="arrowRight" />
              </button>
            </>
          ) : (
            <span className="run-hint"><span className="keys-only">เลือกคำตอบ หรือกด <Kbd>1</Kbd>–<Kbd>{Math.min(item.order.length, 5)}</Kbd></span><span className="touch-only">แตะคำตอบที่เลือก</span></span>
          )
        ) : (
          <>
            <button type="button" className="btn btn-ghost" onClick={() => moveTo(session.cursor - 1)} disabled={session.cursor === 0}>
              <Icon name="arrowLeft" /><span className="hide-sm">ก่อนหน้า</span>
            </button>
            <span className="run-hint run-hint-mid">
              <span>ตอบแล้ว {num(t.answered)}/{num(t.total)}</span>
              {t.flagged ? <span className="run-flags" aria-label={`ปักธง ${t.flagged} ข้อ`}><Icon name="flag" size={14} />{t.flagged}</span> : null}
            </span>
            {last ? (
              <button type="button" ref={nextRef} className="btn btn-ink" onClick={() => setSheet('submit')}>ส่งคำตอบ</button>
            ) : (
              <button type="button" ref={nextRef} className="btn btn-ink" onClick={advance}>ถัดไป <Icon name="arrowRight" /></button>
            )}
          </>
        )}
      </footer>

      <Sheet open={sheet === 'map'} onClose={() => setSheet(null)} title="แผนผังข้อสอบ" wide>
        <ol className="qmap">
          {session.items.map((it, i) => {
            const a = session.answers[it.key];
            let cls = a ? 'a' : '';
            if (session.mode === 'practice' && a) cls = a.choice === it.answer ? 'ok' : 'no';
            return (
              <li key={it.key}>
                <button
                  type="button"
                  className={`qmap-cell ${cls}${i === session.cursor ? ' here' : ''}${session.flags.includes(it.key) ? ' flag' : ''}`}
                  onClick={() => { setSheet(null); moveTo(i); }}
                  data-autofocus={i === session.cursor ? true : undefined}
                  aria-label={`ข้อ ${i + 1}${a ? ' ตอบแล้ว' : ' ยังไม่ตอบ'}${session.flags.includes(it.key) ? ' ปักธง' : ''}`}
                  aria-current={i === session.cursor ? 'step' : undefined}
                >{i + 1}</button>
              </li>
            );
          })}
        </ol>
        <div className="qmap-key">
          <span><i className="qk a" />ตอบแล้ว</span>
          {session.mode === 'mock' && <span><i className="qk flag" />ปักธง</span>}
          {session.mode === 'practice' && <><span><i className="qk ok" />ถูก</span><span><i className="qk no" />ผิด</span></>}
          <span><i className="qk" />ยังไม่ตอบ</span>
        </div>
        {session.mode === 'mock' && (
          <div className="sheet-actions">
            <button type="button" className="btn btn-ink" onClick={() => setSheet('submit')}>ส่งคำตอบ</button>
          </div>
        )}
      </Sheet>

      <Sheet open={sheet === 'submit'} onClose={() => setSheet(null)} title="ส่งคำตอบทั้งชุด?">
        <ul className="submit-tally">
          <li><b>{num(t.answered)}</b>ตอบแล้ว</li>
          <li className={t.unanswered ? 'warn' : ''}><b>{num(t.unanswered)}</b>ยังไม่ตอบ</li>
          <li><b>{num(t.flagged)}</b>ปักธง</li>
        </ul>
        <p className="sheet-p">{t.unanswered ? 'ข้อที่ยังไม่ตอบนับเป็นข้อผิด ' : ''}ส่งแล้วจะเห็นคะแนน เฉลย และคำอธิบายของทุกข้อ</p>
        <div className="sheet-actions">
          <button type="button" className="btn btn-ghost" onClick={() => setSheet(null)} data-autofocus>กลับไปตรวจ</button>
          <button type="button" className="btn btn-ink" onClick={() => complete()}>ส่งเลย</button>
        </div>
      </Sheet>

      <Sheet open={sheet === 'exit'} onClose={() => setSheet(null)} title={session.mode === 'mock' ? 'ออกจากห้องสอบ?' : 'พักชุดนี้?'}>
        <p className="sheet-p">{session.mode === 'mock'
          ? 'ชุดนี้เก็บไว้ในเครื่อง กลับมาทำต่อได้ แต่เวลายังเดินต่อเหมือนในห้องสอบจริง'
          : 'ชุดนี้เก็บไว้ในเครื่อง กลับมาทำต่อจากข้อเดิมได้ทุกเมื่อ'}</p>
        <div className="sheet-stack">
          <button type="button" className="btn btn-ink btn-block" onClick={() => { setSheet(null); navigate('/'); }} data-autofocus>พักไว้ก่อน กลับหน้าแรก</button>
          {session.mode === 'mock'
            ? <button type="button" className="btn btn-ghost btn-block" onClick={() => setSheet('submit')}>ส่งคำตอบตอนนี้</button>
            : <button type="button" className="btn btn-ghost btn-block" onClick={() => { setSheet(null); complete({ early: true }); }} disabled={!t.answered}>{t.answered ? `จบตรงนี้ ดูผล ${t.answered} ข้อที่ตอบ` : 'จบตรงนี้'}</button>}
          <button type="button" className="btn btn-danger btn-block" onClick={() => { setSheet(null); sessionStore.set(null); navigate('/practice'); }}>ทิ้งชุดนี้</button>
        </div>
        <p className="sheet-fine">{session.mode === 'mock'
          ? 'ถ้าทิ้งชุด คำตอบในชุดนี้จะไม่ถูกนับ เพราะสอบจำลองนับคะแนนตอนส่ง'
          : 'คำตอบที่ฝึกไปแล้วยังนับในความคืบหน้า แม้จะทิ้งชุด'}</p>
      </Sheet>
    </div>
  );
}
