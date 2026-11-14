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
import { useEffect, useMemo, useRef, useState } from 'react';
import BackBar from '../components/BackBar.jsx';
import { loadWrapUp } from '../data/exam-wrapups.js';
import { lecturerSetIn, FORMAT_LABEL } from '../data/lecturer-sets.js';
import { scopeForPhase, EXAM_SCOPE_LABEL } from '../lib/exam-scope.js';
import { oldContentLine, oldYearTag, termYearLabel } from '../lib/current-phase.js';
import { LECTURE_COVERS } from '../data/art.js';
import { Q_COUNTS_BY_TOPIC_BY_KIND_BY_SCOPE } from '../data/q-kind-counts.generated.js';
import { getLibraryCatalogFast, readerPayload, recordRecentDoc } from '../lib/library.js';
import { humanSource } from '../lib/source-label.js';
import { cohortIndex, itemCohorts, cohortList } from '../lib/wrap-cohorts.js';
import { READING_BAND, currentItem, progressLabel } from '../lib/wrap-progress.js';

// Motion is decided per effect: a jump or the strip following along is a
// convenience, so under reduced motion it lands at once instead of gliding.
const reducedMotion = () => {
  try { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch { return false; }
};
import NavIcon from '../components/NavIcon.jsx';
import { Keywords, Line, SignalLabel } from '../components/WrapParts.jsx';
import WrapDeck from '../components/WrapDeck.jsx';
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

// Three ways this page is used, and the student says which: the whole thing
// read the night before (the first pass), the keywords alone in a spare
// minute, or one card at a time, recalling before looking (the second pass,
// components/WrapDeck.jsx). The choice is remembered, because whoever wants
// one mode wants it every time.
const MODE_KEY = 'vmx-wrap-mode';
const MODES = ['full', 'keys', 'deck'];
const readMode = () => {
  try { const m = localStorage.getItem(MODE_KEY); return MODES.includes(m) ? m : 'full'; } catch { return 'full'; }
};

export default function WrapUpView({ subject, subjectName = '', goBack, onStartTopic = null, onOpenDoc = null, selectedYear = null, selectedPhase = null }) {
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
  const [cohorts, setCohorts] = useState(null);
  useEffect(() => {
    let live = true;
    setCohorts(null);
    import('../data/exam-recurrence.generated.js')
      .then((m) => { if (live) setCohorts(cohortIndex(m.EXAM_RECURRENCE, m.EXAM_RECURRENCE_CLUSTERS, subject)); })
      .catch(() => {});
    return () => { live = false; };
  }, [subject]);

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
  const items = useMemo(() => (data ? data.groups.flatMap((g) => g.items.map((it) => ({ ...it, lecturer: g.lecturer }))) : []), [data]);
  const hasSlides = useMemo(() => Boolean(slides?.size) && items.some((it) => [...(it.emphasis || []), ...(it.examined || [])].some((l) => slideFor(l.src, slides))), [slides, items]);
  // The images' address is asked for once, and only when a line has a picture.
  const slideBase = useSlideBase(hasSlides && mode !== 'keys');
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
  const settled = patience || (slides !== null && (!hasSlides || mode === 'keys' || slideBase !== undefined));
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
  }, [data, mode, settled]);
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
        <p className="vmx-wrap-empty">กำลังโหลด</p>
      </div>
    );
  }

  // Numbering is by identity, not by name: อ.เกรียงวิชญ์'s omphalitis,
  // ascites and staphylococcosis are three items under one topic id, so
  // matching on topic (or on topic plus name) would number them wrong the
  // day two of them are renamed alike.
  const numberOf = new Map(data.groups.flatMap((g) => g.items).map((it, i) => [it, i + 1]));
  const unit = subject === 'avian-medicine' ? 'โรค' : 'หัวข้อ';

  return (
    <div className="vmx-wrap">
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
        {data.intro && mode !== 'deck' && <p className="vmx-wrap-intro">{data.intro}</p>}
        <div className="vmx-wrap-mode" role="group" aria-label="โหมดการอ่าน">
          <button type="button" className={mode === 'full' ? 'is-on' : ''} aria-pressed={mode === 'full'} onClick={() => pickMode('full')}>อ่านเต็ม</button>
          <button type="button" className={mode === 'keys' ? 'is-on' : ''} aria-pressed={mode === 'keys'} onClick={() => pickMode('keys')}>เฉพาะคีย์เวิร์ด</button>
          <button type="button" className={mode === 'deck' ? 'is-on' : ''} aria-pressed={mode === 'deck'} onClick={() => pickMode('deck')}>ทวนทีละใบ</button>
        </div>
        {mode === 'deck' && <p className="vmx-wrap-mode-note">นึกให้ได้ก่อน แล้วค่อยเปิดดู ใบที่ยังไม่แม่นจะวนกลับมาให้ทวนอีกรอบ</p>}
        {/* The key to the page, one kind of line per row, each with the
            icon the items use, so it is learned once here. The deck is
            read one card at a time and labels its own parts. */}
        {mode !== 'deck' && <ul className="vmx-wrap-legend" aria-label="วิธีอ่านหน้านี้">
          <li><span className="vmx-wrap-signal" /><span><b>คีย์เวิร์ด</b> คำที่ชี้โรคหรือหัวข้อนั้น</span></li>
          <li><span className="vmx-wrap-signal is-emphasis"><NavIcon name="said" size={16} /></span><span><b>อาจารย์เน้น</b> สิ่งที่ผู้สอนย้ำในคาบ แตะนาทีเพื่อเปิดคลิป</span></li>
          <li><span className="vmx-wrap-signal is-examined"><NavIcon name="sheet" size={16} /></span><span><b>มีในข้อสอบเก่า</b> ข้อเท็จจริงที่ข้อสอบเก่าหรือบันทึกรุ่นก่อนเคยถาม</span></li>
          <li><span className="vmx-wrap-signal is-pitfall"><NavIcon name="caution" size={16} /></span><span><b>ระวังสับสน</b> จุดที่มักสับสนกับโรคหรือหัวข้อใกล้กัน</span></li>
          <li><span className="vmx-wrap-signal" /><span><b>เคยออกกี่รุ่น</b> รุ่นพี่กี่รุ่นที่เจอข้อสอบเก่าของ{unit}นั้น</span></li>
          {hasSlides && slideBase && <li><span className="vmx-wrap-signal" /><span><b>สไลด์</b> หน้าที่บรรทัดนั้นอ้าง แตะเพื่อดูเต็มจอ</span></li>}
        </ul>}
      </header>

      {mode === 'deck' ? (
        <WrapDeck
          items={items}
          storageKey={deckKey(subject, data.source?.term, selectedPhase)}
          course={subjectName}
          slideOf={slideOfItem}
          base={slideBase}
          kindTable={kindTable}
          subject={subject}
          onStartTopic={onStartTopic}
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
            <b>{i + 1}</b> {mode === 'keys' && it.th ? it.th : it.name}
          </a>
        ))}
      </nav>

      {data.groups.map((g) => {
        const formatLabel = FORMAT_LABEL[g.format] || g.format;
        return (
          <section key={g.id} className="vmx-wrap-group" aria-label={g.lecturer}>
            <header className="vmx-wrap-group-head">
              <h2>{g.lecturer}</h2>
              <span className="vmx-lect-chip">{formatLabel}{oldYearTag(data.source)}</span>
              {g.formatNote && <p className="vmx-wrap-group-note">{data.source?.own === false ? `${termYearLabel(data.source.term)}: ` : ''}{humanSource(g.formatNote)}</p>}
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

                  {mode === 'full' && (
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

                  {mode === 'full' && it.pitfall && (
                    <div className="vmx-wrap-pitfall">
                      <SignalLabel kind="pitfall">ระวังสับสน</SignalLabel>
                      <p>{it.pitfall}</p>
                    </div>
                  )}

                  {mode === 'full' && (onStartTopic || doc) && (
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
  );
}
