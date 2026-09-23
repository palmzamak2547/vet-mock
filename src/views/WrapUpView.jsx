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
import { useEffect, useMemo, useState } from 'react';
import BackBar from '../components/BackBar.jsx';
import { loadWrapUp, selfNumbered } from '../data/exam-wrapups.js';
import { LECTURER_SETS, FORMAT_LABEL } from '../data/lecturer-sets.js';
import { LECTURE_COVERS } from '../data/art.js';
import { Q_COUNTS_BY_TOPIC_BY_KIND_BY_SCOPE } from '../data/q-kind-counts.generated.js';
import { getLibraryCatalogFast, readerPayload, recordRecentDoc } from '../lib/library.js';
import { humanSource } from '../lib/source-label.js';
import { keyTerm } from '../lib/wrap-keyline.js';

const TH_MONTH = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
function thaiDate(iso) {
  const [y, m, d] = String(iso || '').split('-').map(Number);
  return m ? `${d} ${TH_MONTH[m - 1]} ${y + 543}` : '';
}
const categoryOf = (format) => (format === 'mcq' ? 'mcq-only' : format);

const anchorId = (topic, n) => `wrap-${topic}-${n}`;

// What the lecturer sets know about each topic: the deck's cover, its
// library slug and the format that part of the paper takes.
function deckIndex(subject) {
  const map = new Map();
  for (const lec of LECTURER_SETS[subject]?.lecturers || []) {
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

function Bullets({ label, items, kind }) {
  if (!items?.length) return null;
  return (
    <div className={`vmx-wrap-list is-${kind}`}>
      <div className="vmx-wrap-list-label">{label}</div>
      <ul>
        {items.map((b, i) => (
          <li key={i}>
            <span>{b.text}</span>
            {b.src && <small className="vmx-wrap-src">{humanSource(b.src)}</small>}
          </li>
        ))}
      </ul>
    </div>
  );
}

// Two ways this page is read, and the student says which: the whole thing
// the night before, or the keywords alone in a spare minute. The choice is
// remembered, because whoever wants one mode wants it every time.
const MODE_KEY = 'vmx-wrap-mode';
const readMode = () => {
  try { return localStorage.getItem(MODE_KEY) === 'keys' ? 'keys' : 'full'; } catch { return 'full'; }
};

export default function WrapUpView({ subject, subjectName = '', goBack, onStartTopic = null, onOpenDoc = null, selectedPhase = '1-mid' }) {
  const [data, setData] = useState(null);
  const [failed, setFailed] = useState(false);
  const [mode, setMode] = useState(readMode);
  const pickMode = (m) => {
    setMode(m);
    try { localStorage.setItem(MODE_KEY, m); } catch {}
  };
  useEffect(() => {
    let live = true;
    setData(null);
    setFailed(false);
    loadWrapUp(subject)
      .then((w) => { if (live) { if (w) setData(w); else setFailed(true); } })
      .catch(() => { if (live) setFailed(true); });
    return () => { live = false; };
  }, [subject]);

  const decks = useMemo(() => deckIndex(subject), [subject]);
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

  const jump = (e, id) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  if (failed) {
    return (
      <div className="vmx-wrap">
        <BackBar onBack={goBack} label="หน้าหัวข้อ" />
        <p className="vmx-wrap-empty">ยังไม่มี wrap-up ของวิชานี้</p>
      </div>
    );
  }
  if (!data) {
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
  const items = data.groups.flatMap((g) => g.items);
  const numberOf = new Map(items.map((it, i) => [it, i + 1]));
  const unit = subject === 'avian-medicine' ? 'โรค' : 'หัวข้อ';

  return (
    <div className="vmx-wrap">
      <BackBar onBack={goBack} label="หน้าหัวข้อ" />

      <header className="vmx-wrap-hero">
        <div className="vmx-wrap-eyebrow">Wrap-up กลางภาค</div>
        <h1>{subjectName || subject}</h1>
        <div className="vmx-wrap-meta">
          <span className="vmx-wrap-pill">สอบ {thaiDate(data.exam?.date)} {data.exam?.time || ''}</span>
          <span className="vmx-wrap-pill">{items.length} {unit}</span>
          <span className="vmx-wrap-pill">{data.groups.length} อาจารย์</span>
        </div>
        {data.intro && <p className="vmx-wrap-intro">{data.intro}</p>}
        <div className="vmx-wrap-mode" role="group" aria-label="โหมดการอ่าน">
          <button type="button" className={mode === 'full' ? 'is-on' : ''} aria-pressed={mode === 'full'} onClick={() => pickMode('full')}>อ่านเต็ม</button>
          <button type="button" className={mode === 'keys' ? 'is-on' : ''} aria-pressed={mode === 'keys'} onClick={() => pickMode('keys')}>เฉพาะคีย์เวิร์ด</button>
        </div>
        <p className="vmx-wrap-legend">
          <b>คีย์เวิร์ด</b> คำที่ชี้โรคหรือหัวข้อนั้น <b>อาจารย์เน้น</b> สิ่งที่ผู้สอนย้ำในคาบ พร้อมนาทีในคลิปหรือหน้าสไลด์ <b>มีในข้อสอบเก่า</b> ข้อเท็จจริงที่ข้อสอบเก่าหรือบันทึกรุ่นก่อนเคยถาม
        </p>
      </header>

      <nav className="vmx-wrap-index" aria-label={`สารบัญ ${items.length} ${unit}`}>
        {items.map((it, i) => (
          <a key={anchorId(it.topic, i)} href={`#${anchorId(it.topic, i)}`} onClick={(e) => jump(e, anchorId(it.topic, i))}>
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
              <span className="vmx-lect-chip">{formatLabel}</span>
              {g.formatNote && <p className="vmx-wrap-group-note">{g.formatNote}</p>}
            </header>

            {g.items.map((it) => {
              const n = numberOf.get(it);
              const deck = decks.get(it.topic);
              const art = deck ? covers[deck.cover] : null;
              const format = deck?.format || g.format;
              const count = (kindTable[it.topic] || {})[format] || 0;
              const doc = deck?.doc && docsBySlug ? docsBySlug.get(deck.doc) : null;
              // A list the lecturer numbered is printed as written; a plain one
              // leads each 'Term — explanation' line with the term in bold.
              const numbered = selfNumbered(it.keywords);
              return (
                <article key={anchorId(it.topic, n - 1)} id={anchorId(it.topic, n - 1)} className="vmx-wrap-item">
                  <div className="vmx-wrap-item-head">
                    <span className="vmx-wrap-n" aria-hidden="true">{n}</span>
                    <div className="vmx-wrap-title">
                      <h3>{it.name}</h3>
                      {it.th && <div className="vmx-wrap-th">{it.th}</div>}
                      {it.agent && <div className="vmx-wrap-agent">{it.agent}</div>}
                    </div>
                    {art && <img className="vmx-wrap-cover" src={art.src} alt="" loading="lazy" decoding="async" />}
                  </div>

                  {/* Short keywords are chips; a line to memorise (a definition
                      with its clauses, a numbered principle) reads as a row.
                      When the lecturer's own numbering is already in the text
                      ("1 Emerging Infectious Diseases", "2 Public Health"), the
                      list must not add a second set of numbers beside it. */}
                  {it.keywords?.length > 0 && (it.keywords.some((k) => k.length > 44) ? (
                    <ul className={`vmx-wrap-keylist${numbered ? ' is-self-numbered' : ''}`} aria-label="คีย์เวิร์ดและรายการที่ต้องจำ">
                      {it.keywords.map((k) => {
                        const parts = numbered ? null : keyTerm(k);
                        return <li key={k}>{parts ? <><b>{parts.term}</b>{' — '}{parts.rest}</> : k}</li>;
                      })}
                    </ul>
                  ) : (
                    <div className="vmx-wrap-keys" aria-label="คีย์เวิร์ด">
                      {it.keywords.map((k) => <span key={k} className="vmx-wrap-key">{k}</span>)}
                    </div>
                  ))}

                  {mode === 'full' && (
                    <div className="vmx-wrap-cols">
                      <Bullets label="อาจารย์เน้น" items={it.emphasis} kind="emphasis" />
                      {it.examined?.length ? (
                        <Bullets label="มีในข้อสอบเก่า" items={it.examined} kind="examined" />
                      ) : (
                        // Say it plainly. An empty column could mean either
                        // "nothing was found" or "nobody looked", and those
                        // are not the same thing to someone revising.
                        <div className="vmx-wrap-list is-examined">
                          <div className="vmx-wrap-list-label">มีในข้อสอบเก่า</div>
                          <p className="vmx-wrap-none">ยังไม่พบข้อสอบเก่าหรือบันทึกรุ่นก่อนที่ถามหัวข้อนี้</p>
                        </div>
                      )}
                    </div>
                  )}

                  {mode === 'full' && it.pitfall && (
                    <p className="vmx-wrap-pitfall"><b>ระวังสับสน</b> {it.pitfall}</p>
                  )}

                  {mode === 'full' && (onStartTopic || doc) && (
                    <div className="vmx-wrap-actions">
                      {onStartTopic && count > 0 && (
                        <button
                          type="button"
                          className="vmx-lect-btn"
                          onClick={() => onStartTopic({ subjectId: subject, topics: [it.topic], questionCategory: categoryOf(format) })}
                        >
                          ฝึกแบบ{FORMAT_LABEL[format] || format} ({count} {format === 'match' ? 'ชุด' : 'ข้อ'})
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

      <footer className="vmx-wrap-foot">
        ทุกบรรทัดอ้างคลิปบันทึกคาบ สไลด์ หรือข้อสอบเก่าที่ระบุไว้ ถ้าเนื้อหาในคาบกับสไลด์ต่างกัน ยึดสไลด์เป็นหลักและตัดที่ยืนยันไม่ได้ออก
      </footer>
    </div>
  );
}
