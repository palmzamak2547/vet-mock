// ============================================================
// WrapUpView — the whole paper on one page, the night before
// ============================================================
// One card per disease or session, grouped by the lecturer who wrote that
// part of the paper: the keywords that identify it, what the lecturer
// stressed (each line with where it was said), and what past papers tested.
// Read top to bottom the night before, or jump from the index strip in a
// spare minute. Every line traces to a recording, a deck or a past paper —
// the ingest refuses anything that does not.
//
// The page reads; it does not grade. "ฝึกหัวข้อนี้" hands the topic to the
// same lecturer-practice start the topic screen uses, and "สไลด์ PDF" opens
// the deck in the reader, so nothing here has a second copy of that logic.
// ============================================================
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import BackBar from '../components/BackBar.jsx';
import { loadWrapUp } from '../data/exam-wrapups.js';
import { lecturerSetIn, FORMAT_LABEL } from '../data/lecturer-sets.js';
import { scopeForPhase, EXAM_SCOPE_LABEL } from '../lib/exam-scope.js';
import { oldContentLine, oldYearTag, termYearLabel } from '../lib/current-phase.js';
import { LECTURE_COVERS } from '../data/art.js';
import { Q_COUNTS_BY_TOPIC_BY_KIND_BY_SCOPE } from '../data/q-kind-counts.generated.js';
import { getLibraryCatalogFast, readerPayload, recordRecentDoc } from '../lib/library.js';
import { cohortIndex, itemCohorts, cohortList, originIndex } from '../lib/wrap-cohorts.js';
import { readingCopy } from '../lib/wrap-cite.js';
import { boardKey, resolveBoard } from '../lib/wrap-board.js';
import { BOARD_LOADERS } from '../data/wrapup-boards/index.js';
import { alertDialog } from '../lib/dialog.js';
import { READING_BAND, currentItem, progressLabel } from '../lib/wrap-progress.js';
import { introFolds } from '../lib/wrap-intro.js';

// Motion is decided per effect: a jump or the strip following along is a
// convenience, so under reduced motion it lands at once instead of gliding.
const reducedMotion = () => {
  try { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch { return false; }
};
import NavIcon from '../components/NavIcon.jsx';
import { CitedText, Keywords, Line, SignalLabel, WrapCiteContext } from '../components/WrapParts.jsx';
import WrapDeck from '../components/WrapDeck.jsx';
import WrapBoard from '../components/WrapBoard.jsx';
import WrapSlide, { useSlideBase } from '../components/WrapSlide.jsx';
import { slideFor, slideIndex } from '../lib/wrap-slide.js';
import { deckKey } from '../lib/wrap-deck.js';
import { EVIDENCE_LOADERS } from '../data/evidence/loaders.generated.js';
import '../styles-wrap.css';
import { topicPractice } from '../lib/lecturer-count.js';
import { isChunkLoadError } from '../lib/chunk-error.js';

const TH_MONTH = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
function thaiDate(iso) {
  const [y, m, d] = String(iso || '').split('-').map(Number);
  return m ? `${d} ${TH_MONTH[m - 1]} ${y + 543}` : '';
}
const categoryOf = (format) => (format === 'mcq' ? 'mcq-only' : format);

const anchorId = (topic, n) => `wrap-${topic}-${n}`;

// What the lecturer sets know about each topic: the deck's cover, its
// library slug and the format that part of the paper takes.
// The set filed beside the wrap-up, in the same term: another year's formats
// must not stand behind this year's page, nor this year's behind an old one.
function deckIndex(subject, year, phase, term) {
  const map = new Map();
  for (const lec of (term ? lecturerSetIn(term, subject, year, phase) : null)?.lecturers || []) {
    for (const s of lec.sessions) {
      for (const deck of s.decks) {
        for (const topic of deck.topics) {
          if (!map.has(topic)) map.set(topic, { cover: deck.cover, doc: deck.doc || null, format: lec.format });
        }
      }
    }
  }
  return map;
}

// `slideAt(line)` is the slide element to draw under a line, or null: the
// item decides, so one page cited by three lines is drawn under the first.
function Bullets({ label, items, kind, course, slideAt = () => null }) {
  if (!items?.length) return null;
  return (
    <div className={`vmx-wrap-list is-${kind}`}>
      <SignalLabel kind={kind}>{label}</SignalLabel>
      <ul>
        {items.map((b, i) => <Line key={i} line={b} course={course} slide={slideAt(b)} />)}
      </ul>
    </div>
  );
}

// Four ways this page is used, and the student says which: the whole thing
// read the night before (the first pass), the keywords alone in a spare
// minute, one card at a time, recalling before looking (the second pass,
// components/WrapDeck.jsx), or the paper laid out as a farm case is worked,
// clue to disease (components/WrapBoard.jsx, only on a paper that has a
// board). The choice is remembered, because whoever wants one mode wants it
// every time; a paper without a board reads in full without forgetting it.
const MODE_KEY = 'vmx-wrap-mode';
const MODES = ['full', 'keys', 'deck', 'board'];
const readMode = () => {
  try { const m = localStorage.getItem(MODE_KEY); return MODES.includes(m) ? m : 'full'; } catch { return 'full'; }
};

// The paper's overview (lib/wrap-intro.js): longer than four lines on this screen, it opens folded to two
// with "อ่านต่อ", so the first section is on the first screen. Measured on the screen it is drawn on, before
// paint, and again when the width changes; once opened it stays open.
function WrapIntro({ text }) {
  const ref = useRef(null);
  const [folds, setFolds] = useState(false);
  const [open, setOpen] = useState(false);
  // The button leaves when pressed: the paragraph it opened takes the focus, so the keyboard is not dropped.
  const openIntro = () => {
    setOpen(true);
    window.requestAnimationFrame(() => ref.current?.focus({ preventScroll: true }));
  };
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    // scrollHeight is the whole text's height, folded or not.
    const measure = () => setFolds(introFolds(el.scrollHeight, parseFloat(getComputedStyle(el).lineHeight)));
    measure();
    if (typeof ResizeObserver !== 'function') return undefined;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [text]);
  const folded = folds && !open;
  // Folded, "อ่านต่อ" sits at the end of the second line instead of on a row of its own: on a 664 px phone
  // that row alone kept the first lecturer's part under the bottom bar.
  return (
    <div className={`vmx-wrap-intro-box${folded ? ' is-folded' : ''}`}>
      <p ref={ref} id="vmx-wrap-intro" tabIndex={-1} className={`vmx-wrap-intro${folded ? ' is-folded' : ''}`}><CitedText text={text} /></p>
      {folded && (
        <button type="button" className="vmx-wrap-intro-more" aria-expanded="false" aria-controls="vmx-wrap-intro" onClick={openIntro}>อ่านต่อ</button>
      )}
    </div>
  );
}

// While the page waits: the shape of what is coming, in the page's skeleton tone.
function Skeleton({ label }) {
  return (
    <div className="vmx-wrap-skel" role="status" aria-label={label}>
      <span className="vmx-skeleton vmx-skeleton-line" style={{ width: '40%' }} />
      <span className="vmx-skeleton vmx-skeleton-line" style={{ width: '75%', height: 28 }} />
      <span className="vmx-skeleton vmx-skeleton-card" />
      <span className="vmx-skeleton vmx-skeleton-card" />
    </div>
  );
}

export default function WrapUpView({ subject, subjectName = '', goBack, onStartTopic = null, onOpenDoc = null, onOpenQuestion = null, selectedYear = null, selectedPhase = null }) {
  const [data, setData] = useState(null);
  // 'none': this paper has no wrap-up. An Error: it exists but did not load
  // (offline, or a release replaced its file), which needs a retry, not
  // "ยังไม่มี".
  const [failed, setFailed] = useState(null);
  const [attempt, setAttempt] = useState(0);
  const [mode, setMode] = useState(readMode);
  const pickMode = (m) => {
    setMode(m);
    try { localStorage.setItem(MODE_KEY, m); } catch {}
  };
  useEffect(() => {
    let live = true;
    setData(null);
    setFailed(null);
    loadWrapUp(subject, selectedYear, selectedPhase)
      .then((w) => { if (live) { if (w) setData(w); else setFailed('none'); } })
      .catch((err) => { if (live) setFailed(err instanceof Error ? err : new Error(String(err))); });
    return () => { live = false; };
  }, [subject, selectedYear, selectedPhase, attempt]);

  // Which senior cohorts sat each past paper the page cites, from the bank's
  // own recurrence file. It loads beside the page and never before it: the
  // text reads at once, and the "เคยออก N รุ่น" tags join it when they arrive.
  // A failed load only leaves the tags out.
  // The same file names each cited question by the paper it was sat on.
  const [cohorts, setCohorts] = useState(null);
  const [origins, setOrigins] = useState(null);
  useEffect(() => {
    let live = true;
    setCohorts(null);
    setOrigins(null);
    import('../data/exam-recurrence.generated.js')
      .then((m) => {
        if (!live) return;
        setCohorts(cohortIndex(m.EXAM_RECURRENCE, m.EXAM_RECURRENCE_CLUSTERS, subject));
        setOrigins(originIndex(m.EXAM_RECURRENCE, subject));
      })
      .catch(() => {});
    return () => { live = false; };
  }, [subject]);
  // A cited question opens through the app's own one-question path; one that
  // is gone from the bank says so.
  const cite = useMemo(() => ({
    origins,
    openQuestion: onOpenQuestion ? async (id) => {
      const opened = await onOpenQuestion(id);
      if (!opened) alertDialog('ไม่พบข้อนี้ในคลังแล้ว อาจถูกแก้ไขหรือนำออกไป');
    } : null,
  }), [origins, onOpenQuestion]);

  // The differential board, when this paper has one that still holds against
  // its wrap-up (lib/wrap-board.js): undefined while it loads, null for none.
  const [board, setBoard] = useState(undefined);
  useEffect(() => {
    let live = true;
    setBoard(undefined);
    if (!data) return () => { live = false; };
    const load = Object.hasOwn(BOARD_LOADERS, subject) ? BOARD_LOADERS[subject] : null;
    if (!load) { setBoard(null); return () => { live = false; }; }
    load().then((m) => { if (live) setBoard(resolveBoard(m.BOARD, data)); }, () => { if (live) setBoard(null); });
    return () => { live = false; };
  }, [data, subject]);
  const shownMode = mode === 'board' && board === null ? 'full' : mode;

  // The deck under way on a phone keeps only its own bar above the card.
  const [deckStarted, setDeckStarted] = useState(false);

  // "อ่านหัวข้อ N แบบเต็ม" from the board: reading mode, at that item.
  const [readAt, setReadAt] = useState(null);
  const readItem = (n) => { pickMode('full'); setReadAt(n); };
  useEffect(() => {
    if (readAt === null || shownMode !== 'full') return;
    const el = document.querySelector(`.vmx-wrap-item[data-n="${readAt - 1}"]`);
    if (el) el.scrollIntoView({ behavior: 'auto', block: 'start' });
    setReadAt(null);
  }, [readAt, shownMode]);

  // Which cited deck pages have a picture (lib/wrap-slide.js): the answer
  // evidence's own record for this subject, loaded beside the page like the
  // cohort tags. Without it, or offline, the lines keep their citations.
  const [slides, setSlides] = useState(null);
  useEffect(() => {
    let live = true;
    setSlides(null);
    const load = Object.hasOwn(EVIDENCE_LOADERS, subject) ? EVIDENCE_LOADERS[subject] : null;
    if (!load) { setSlides(new Map()); return () => { live = false; }; }
    load().then((m) => { if (live) setSlides(slideIndex(m.EVIDENCE)); }, () => { if (live) setSlides(new Map()); });
    return () => { live = false; };
  }, [subject, attempt]);
  // What the page draws: the same wrap-up with สไลด์ for the authors' เดค (lib/wrap-cite.js).
  const shown = useMemo(() => readingCopy(data), [data]);
  const items = useMemo(() => (shown ? shown.groups.flatMap((g) => g.items.map((it) => ({ ...it, lecturer: g.lecturer }))) : []), [shown]);
  const hasSlides = useMemo(() => Boolean(slides?.size) && items.some((it) => [...(it.emphasis || []), ...(it.examined || [])].some((l) => slideFor(l.src, slides))), [slides, items]);
  // The images' address is asked for once, and only when a line has a picture.
  const slideBase = useSlideBase(hasSlides && shownMode !== 'keys');
  // The page is drawn once, with its frames: it waits for the record of
  // pictures and, when a line has one, for the wall's answer, so no frame
  // pushes a line down after the student has started reading. A slow answer
  // is waited for 1.5 s at most; after that a frame may still join.
  const [patience, setPatience] = useState(false);
  useEffect(() => {
    setPatience(false);
    const t = setTimeout(() => setPatience(true), 1500);
    return () => clearTimeout(t);
  }, [subject, attempt]);
  const settled = patience || (slides !== null && (!hasSlides || shownMode === 'keys' || slideBase !== undefined));
  const slideOfItem = useMemo(() => (it) => {
    if (!slides) return null;
    for (const l of [...(it.emphasis || []), ...(it.examined || [])]) {
      const rec = slideFor(l.src, slides);
      if (rec) return rec;
    }
    return null;
  }, [slides]);

  const decks = useMemo(() => deckIndex(subject, selectedYear, selectedPhase, data?.source?.term), [subject, selectedYear, selectedPhase, data?.source?.term]);
  const covers = LECTURE_COVERS[subject] || {};
  const kindTable = Q_COUNTS_BY_TOPIC_BY_KIND_BY_SCOPE[selectedPhase]?.[subject] || {};

  // The catalog rows for the "สไลด์ PDF" pills, snapshot first, fresh after.
  const [docsBySlug, setDocsBySlug] = useState(null);
  useEffect(() => {
    if (!onOpenDoc) return undefined;
    let live = true;
    const index = (r) => new Map((r?.docs || []).filter((d) => d?.slug).map((d) => [d.slug, d]));
    const { stale, fresh } = getLibraryCatalogFast();
    stale.then((s) => { if (live && s) setDocsBySlug((cur) => cur || index(s)); }).catch(() => {});
    fresh.then((f) => { if (live) setDocsBySlug(index(f)); }).catch(() => {});
    return () => { live = false; };
  }, [onOpenDoc]);

  useEffect(() => {
    try { window.scrollTo({ top: 0, behavior: 'instant' }); } catch {}
  }, [subject]);

  // Where the student is: the item in the reading band under the sticky
  // index, reported by an IntersectionObserver as items cross it (never a
  // scroll listener). Without the observer the strip simply stays on item 1.
  const [here, setHere] = useState(0);
  const indexRef = useRef(null);
  useEffect(() => {
    setHere(0);
    if (!data || typeof IntersectionObserver === 'undefined') return undefined;
    const inBand = new Set();
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        const n = Number(e.target.dataset.n);
        if (e.isIntersecting) inBand.add(n); else inBand.delete(n);
      }
      setHere((last) => currentItem(inBand, last));
    }, { rootMargin: READING_BAND, threshold: 0 });
    document.querySelectorAll('.vmx-wrap-item[data-n]').forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [data, shownMode, settled]);
  // The strip follows: the marked chip is brought into view inside the strip
  // only (never the page), and only when it is out of sight.
  useEffect(() => {
    const nav = indexRef.current;
    const chip = nav?.querySelector('[aria-current="location"]');
    if (!nav || !chip) return;
    const pinned = nav.querySelector('.vmx-wrap-where')?.offsetWidth || 0;
    const left = chip.offsetLeft - pinned - 6;
    const right = chip.offsetLeft + chip.offsetWidth;
    if (left >= nav.scrollLeft && right <= nav.scrollLeft + nav.clientWidth) return;
    try { nav.scrollTo({ left: Math.max(0, left), behavior: reducedMotion() ? 'auto' : 'smooth' }); } catch { nav.scrollLeft = Math.max(0, left); }
  }, [here]);

  const jump = (e, id) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth', block: 'start' });
  };

  if (failed === 'none') {
    return (
      <div className="vmx-wrap">
        <BackBar onBack={goBack} label="หน้าหัวข้อ" />
        <p className="vmx-wrap-empty">ยังไม่มี wrap-up ของวิชานี้</p>
      </div>
    );
  }
  if (failed) {
    const chunk = isChunkLoadError(failed);
    const offline = typeof navigator !== 'undefined' && navigator.onLine === false;
    return (
      <div className="vmx-wrap">
        <BackBar onBack={goBack} label="หน้าหัวข้อ" />
        <div role="alert" className="vmx-wrap-empty">
          <p>{offline
            ? 'ยังไม่ได้ต่ออินเทอร์เน็ต จึงเปิด wrap-up ไม่ได้ ต่ออินเทอร์เน็ตแล้วกดลองอีกครั้ง'
            : chunk
              ? 'โหลด wrap-up ไม่สำเร็จ ถ้าลองแล้วยังไม่ได้ ให้โหลดหน้านี้ใหม่'
              : 'เปิด wrap-up ไม่สำเร็จ กดลองอีกครั้ง'}</p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
            <button type="button" className="vmx-btn vmx-btn-primary vmx-btn-sm" onClick={() => setAttempt((n) => n + 1)}>ลองอีกครั้ง</button>
            {chunk && !offline && <button type="button" className="vmx-btn vmx-btn-ghost vmx-btn-sm" onClick={() => window.location.reload()}>โหลดหน้านี้ใหม่</button>}
          </div>
        </div>
      </div>
    );
  }
  if (!data || !settled) {
    return (
      <div className="vmx-wrap">
        <BackBar onBack={goBack} label="หน้าหัวข้อ" />
        <Skeleton label="กำลังโหลด wrap-up" />
      </div>
    );
  }

  // Numbering is by identity, not by name: อ.เกรียงวิชญ์'s omphalitis,
  // ascites and staphylococcosis are three items under one topic id, so
  // matching on topic (or on topic plus name) would number them wrong the
  // day two of them are renamed alike.
  const numberOf = new Map(shown.groups.flatMap((g) => g.items).map((it, i) => [it, i + 1]));
  const unit = subject === 'avian-medicine' ? 'โรค' : 'หัวข้อ';

  return (
    <WrapCiteContext.Provider value={cite}>
    <div className="vmx-wrap" data-mode={shownMode} data-deck-started={shownMode === 'deck' && deckStarted ? 'yes' : undefined}>
      <BackBar onBack={goBack} label="หน้าหัวข้อ" />

      <header className="vmx-wrap-hero">
        <div className="vmx-wrap-eyebrow">Wrap-up {EXAM_SCOPE_LABEL[scopeForPhase(selectedPhase)] || ''}</div>
        {/* Another year's wrap-up: the exam date below and the emphasis are that year's. */}
        {oldContentLine(data.source) && <p className="vmx-old-content">{oldContentLine(data.source)}</p>}
        <h1>{subjectName || subject}</h1>
        <div className="vmx-wrap-meta">
          <span className="vmx-wrap-pill">สอบ {thaiDate(data.exam?.date)} {data.exam?.time || ''}</span>
          <span className="vmx-wrap-pill">{items.length} {unit}</span>
          <span className="vmx-wrap-pill">{data.groups.length} อาจารย์</span>
        </div>
        {/* The deck is the second pass: the paper's overview was read on the
            first, and on a phone it would push the card off the first screen. */}
        {shown.intro && shownMode !== 'deck' && shownMode !== 'board' && <WrapIntro text={shown.intro} />}
        <div className="vmx-wrap-mode" role="group" aria-label="โหมดการอ่าน">
          <button type="button" className={shownMode === 'full' ? 'is-on' : ''} aria-pressed={shownMode === 'full'} onClick={() => pickMode('full')}>อ่านเต็ม</button>
          <button type="button" className={shownMode === 'keys' ? 'is-on' : ''} aria-pressed={shownMode === 'keys'} onClick={() => pickMode('keys')}>เฉพาะคีย์เวิร์ด</button>
          <button type="button" className={shownMode === 'deck' ? 'is-on' : ''} aria-pressed={shownMode === 'deck'} onClick={() => pickMode('deck')}>ทวนทีละใบ</button>
          {/* Offered once this paper's board holds; kept in place while it loads for a student who chose it. */}
          {(board || (board === undefined && mode === 'board')) && (
            <button type="button" className={shownMode === 'board' ? 'is-on' : ''} aria-pressed={shownMode === 'board'} onClick={() => pickMode('board')}>แยกโรค</button>
          )}
        </div>
        {/* The key to the page, one kind of line per row, each with the
            icon the items use, so it is learned once here. The deck is
            read one card at a time and labels its own parts. */}
        {/* The key is read once, so it opens on demand (the clutter gate, point 4): about 250 px under the
            mode buttons pushed the first lecturer's part off a 727 px phone. */}
        {shownMode !== 'deck' && shownMode !== 'board' && <details className="vmx-wrap-howto">
          <summary>ความหมายของแต่ละบรรทัด</summary>
          <ul className="vmx-wrap-legend" aria-label="วิธีอ่านหน้านี้">
          <li><span className="vmx-wrap-signal" /><span><b>คีย์เวิร์ด</b> คำที่ชี้โรคหรือหัวข้อนั้น</span></li>
          <li><span className="vmx-wrap-signal is-emphasis"><NavIcon name="said" size={16} /></span><span><b>อาจารย์เน้น</b> สิ่งที่ผู้สอนย้ำในคาบ แตะนาทีเพื่อเปิดคลิป</span></li>
          <li><span className="vmx-wrap-signal is-examined"><NavIcon name="sheet" size={16} /></span><span><b>มีในข้อสอบเก่า</b> ข้อเท็จจริงที่ข้อสอบเก่าหรือบันทึกรุ่นก่อนเคยถาม</span></li>
          <li><span className="vmx-wrap-signal is-pitfall"><NavIcon name="caution" size={16} /></span><span><b>ระวังสับสน</b> จุดที่มักสับสนกับโรคหรือหัวข้อใกล้กัน</span></li>
          <li><span className="vmx-wrap-signal" /><span><b>เคยออกกี่รุ่น</b> รุ่นพี่กี่รุ่นที่เจอข้อสอบเก่าของ{unit}นั้น</span></li>
          {hasSlides && slideBase && <li><span className="vmx-wrap-signal" /><span><b>สไลด์</b> หน้าที่บรรทัดนั้นอ้าง แตะเพื่อดูเต็มจอ</span></li>}
          </ul>
        </details>}
      </header>

      {shownMode === 'board' ? (
        board ? (
          <WrapBoard
            board={board}
            items={items}
            storageKey={boardKey(subject, data.source?.term, selectedPhase)}
            course={subjectName}
            slideOf={slideOfItem}
            base={slideBase}
            onRead={readItem}
          />
        ) : <Skeleton label="กำลังโหลดกระดานแยกโรค" />
      ) : shownMode === 'deck' ? (
        <WrapDeck
          items={items}
          storageKey={deckKey(subject, data.source?.term, selectedPhase)}
          course={subjectName}
          slideOf={slideOfItem}
          base={slideBase}
          kindTable={kindTable}
          subject={subject}
          onStartTopic={onStartTopic}
          onStarted={setDeckStarted}
        />
      ) : (<>

      {/* The index is also the progress strip: "5 จาก 28" stays pinned at its
          start and the item being read is marked, so a look up says how far
          the student is and how much is left. */}
      <nav ref={indexRef} className="vmx-wrap-index" aria-label={`สารบัญ ${items.length} ${unit}`}>
        <span className="vmx-wrap-where">{progressLabel(here, items.length)}</span>
        {items.map((it, i) => (
          <a
            key={anchorId(it.topic, i)}
            href={`#${anchorId(it.topic, i)}`}
            onClick={(e) => jump(e, anchorId(it.topic, i))}
            className={i === here ? 'is-here' : undefined}
            aria-current={i === here ? 'location' : undefined}
          >
            <b>{i + 1}</b> {shownMode === 'keys' && it.th ? it.th : it.name}
          </a>
        ))}
      </nav>

      {shown.groups.map((g) => {
        const formatLabel = FORMAT_LABEL[g.format] || g.format;
        return (
          <section key={g.id} className="vmx-wrap-group" aria-label={g.lecturer}>
            <header className="vmx-wrap-group-head">
              <h2>{g.lecturer}</h2>
              <span className="vmx-lect-chip">{formatLabel}{oldYearTag(data.source)}</span>
              {g.formatNote && <p className="vmx-wrap-group-note">{data.source?.own === false ? `${termYearLabel(data.source.term)}: ` : ''}<CitedText text={g.formatNote} human /></p>}
            </header>

            {g.items.map((it) => {
              const n = numberOf.get(it);
              const deck = decks.get(it.topic);
              const art = deck ? covers[deck.cover] : null;
              // The same rule as the lecturer card (lib/lecturer-count.js):
              // 'all' sums every kind, a matching deck counts the set that
              // covers it from another topic, and a topic with nothing in
              // the lecturer's format offers every format instead.
              const lecFormat = deck?.format || g.format;
              const { format, count, fellBack } = topicPractice(kindTable, [it.topic], lecFormat);
              const doc = deck?.doc && docsBySlug ? docsBySlug.get(deck.doc) : null;
              // The slide each line cites, drawn under the first line that
              // cites that page (lib/wrap-slide.js); the rest keep the text.
              const drawn = new Set();
              const slideAt = (line) => {
                if (!slides || typeof slideBase !== 'string') return null;
                const rec = slideFor(line.src, slides);
                const id = rec && `${rec.sha16}#${rec.page}`;
                if (!rec || drawn.has(id)) return null;
                drawn.add(id);
                return <WrapSlide rec={rec} base={slideBase} />;
              };
              // History, never a forecast: the cohorts that were asked this
              // item's cited past papers. No resolved cohort, no tag.
              const seen = cohorts ? itemCohorts(it, cohorts) : [];
              return (
                <article key={anchorId(it.topic, n - 1)} id={anchorId(it.topic, n - 1)} data-n={n - 1} className="vmx-wrap-item">
                  <div className="vmx-wrap-item-head">
                    <span className="vmx-wrap-n" aria-hidden="true">{n}</span>
                    <div className="vmx-wrap-title">
                      <h3>{it.name}</h3>
                      {it.th && <div className="vmx-wrap-th">{it.th}</div>}
                      {it.agent && <div className="vmx-wrap-agent">{it.agent}</div>}
                      {seen.length > 0 && (
                        <div className="vmx-wrap-seen"><b>เคยออก {seen.length} รุ่น</b> <span>({cohortList(seen)})</span></div>
                      )}
                    </div>
                    {art && <img className="vmx-wrap-cover" src={art.src} alt="" loading="lazy" decoding="async" />}
                  </div>

                  <Keywords keywords={it.keywords} />

                  {shownMode === 'full' && (
                    <div className="vmx-wrap-cols">
                      <Bullets label="อาจารย์เน้น" items={it.emphasis} kind="emphasis" course={subjectName} slideAt={slideAt} />
                      {it.examined?.length ? (
                        <Bullets label="มีในข้อสอบเก่า" items={it.examined} kind="examined" course={subjectName} slideAt={slideAt} />
                      ) : (
                        // Say it plainly. An empty column could mean either
                        // "nothing was found" or "nobody looked", and those
                        // are not the same thing to someone revising.
                        <div className="vmx-wrap-list is-examined">
                          <SignalLabel kind="examined">มีในข้อสอบเก่า</SignalLabel>
                          <p className="vmx-wrap-none">ยังไม่พบข้อสอบเก่าหรือบันทึกรุ่นก่อนที่ถามหัวข้อนี้</p>
                        </div>
                      )}
                    </div>
                  )}

                  {shownMode === 'full' && it.pitfall && (
                    <div className="vmx-wrap-pitfall">
                      <SignalLabel kind="pitfall">ระวังสับสน</SignalLabel>
                      <p><CitedText text={it.pitfall} /></p>
                    </div>
                  )}

                  {shownMode === 'full' && (onStartTopic || doc) && (
                    <div className="vmx-wrap-actions">
                      {onStartTopic && count > 0 && (
                        <button
                          type="button"
                          className="vmx-lect-btn"
                          onClick={() => onStartTopic({ subjectId: subject, topics: [it.topic], questionCategory: categoryOf(format) })}
                        >
                          {fellBack
                            ? `ยังไม่มีข้อแบบ${FORMAT_LABEL[lecFormat] || lecFormat} ฝึกรวมทุกประเภท (${count} ข้อ)`
                            : `ฝึกแบบ${FORMAT_LABEL[format] || format} (${count} ${format === 'match' ? 'ชุด' : 'ข้อ'})`}
                        </button>
                      )}
                      {doc && (
                        <button type="button" className="vmx-lect-doc" title={doc.title} onClick={() => { recordRecentDoc(doc); onOpenDoc(readerPayload(doc)); }}>
                          สไลด์ PDF
                        </button>
                      )}
                    </div>
                  )}
                </article>
              );
            })}
          </section>
        );
      })}
      </>)}

      <footer className="vmx-wrap-foot">
        ทุกบรรทัดอ้างคลิปบันทึกคาบ สไลด์ หรือข้อสอบเก่าที่ระบุไว้ ถ้าเนื้อหาในคาบกับสไลด์ต่างกัน ยึดสไลด์เป็นหลักและตัดที่ยืนยันไม่ได้ออก
      </footer>
    </div>
    </WrapCiteContext.Provider>
  );
}
