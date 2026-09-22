// ============================================================
// AdminView — หลังบ้าน, for one account
// ============================================================
// Everything here is read from SECURITY DEFINER functions that check
// is_admin() first; the page asks the database whether it may look and
// shows a locked card if the answer is no. It never receives data it is
// not allowed to draw, so there is nothing to hide client-side.
//
// What it is for, in Palm's words: "มีตั้งแต่ตัวเลข ยันไปว่าใครเคยทำผิดข้อไหน
// บ้าง เผื่อจะเอาไปปรับปรุงคุณภาพโจทย์ โดยไม่ต้องรอคนแจ้ง" and then "ใส่ให้ครบ
// เลย ให้หน้า admin powerful ที่สุด". So the centre of the page is the
// questions table, ranked worst-first with quality flags, and around it
// every other number the system has: people and their sign-ins, exams,
// what the bank holds, what people keep, client errors, every table's row
// count, and the whole release history.
//
// Question text comes from the local bank (the database stores only ids),
// so the admin sees the stem beside the number without another round trip.
// ============================================================

import { useEffect, useMemo, useRef, useState } from 'react';
import { checkIsAdmin, adminRpc, isForbidden } from '../lib/admin-api.js';
import { qualityFlags, rankQuestions, answerDistribution, fillDaily, wrongRate } from '../lib/question-quality.js';
import { SUBJECTS_BY_YEAR } from '../data/curriculum.js';
import { QB_TOTAL, QB_BLOCKED_TOTAL, Q_VISIBLE_COUNTS_BY_SUBJECT, Q_VISIBLE_COUNTS_BY_YEAR, Q_PANIC_COUNTS_BY_SUBJECT } from '../data/q-counts.js';
import { CHANGELOG, SCOPE_LABELS } from '../data/changelog.js';
import { hasSupabase } from '../lib/supabase.js';
import PrivateNotes from '../components/PrivateNotes.jsx';

const RANGES = [[7, '7 วัน'], [30, '30 วัน'], [90, '90 วัน'], [0, 'ทั้งหมด']];
const rangeName = (days) => RANGES.find(([d]) => d === days)?.[1] || '';
const SECTIONS = [
  ['overview', 'ภาพรวม'], ['questions', 'โจทย์'], ['subjects', 'วิชา'], ['people', 'คน'], ['exams', 'ชุดสอบ'],
  ['content', 'คลัง'], ['community', 'ชุมชน'], ['errors', 'ข้อผิดพลาด'], ['notes', 'บันทึก'], ['database', 'ฐานข้อมูล'], ['releases', 'เวอร์ชัน'],
];
const KIND_LABEL = { feature: 'ฟีเจอร์', add: 'เพิ่ม', fix: 'แก้บั๊ก', content: 'เนื้อหา', change: 'ปรับ' };
const KIND_TONE = { feature: 'info', add: 'info', fix: 'warn', content: 'good', change: 'good' };
const ALL_SUBJECTS = Object.values(SUBJECTS_BY_YEAR).flat();
const subjectName = (id) => ALL_SUBJECTS.find((s) => s.id === id)?.name || id || '—';
const TH_MONTHS = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
const fmtWhen = (iso) => {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return `${d.getDate()} ${TH_MONTHS[d.getMonth()]} ${String(d.getFullYear() + 543).slice(-2)}, ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
};
// A bare date ('2026-09-14') is parsed as UTC midnight by Date; split it
// instead so the label is the day the database meant.
const ymd = (s) => String(s || '').slice(0, 10).split('-').map(Number);
const fmtDay = (s) => { const [, m, d] = ymd(s); return m ? `${d} ${TH_MONTHS[m - 1]}` : '—'; };
const fmtDate = (s) => { const [y, m, d] = ymd(s); return m ? `${d} ${TH_MONTHS[m - 1]} ${String(y + 543).slice(-2)}` : '—'; };
const n = (v) => (v == null ? '—' : Number(v).toLocaleString('en-US'));
const pct = (a, b) => (b > 0 ? `${Math.round((a / b) * 100)}%` : '—');
const mins = (sec) => (sec == null ? '—' : sec < 60 ? `${sec} วิ` : `${Math.round(sec / 60)} นาที`);
const bytes = (b) => (b == null ? '—' : b > 1e9 ? `${(b / 1e9).toFixed(1)} GB` : `${Math.round(b / 1e6)} MB`);
const sum = (obj) => Object.values(obj || {}).reduce((s, v) => s + Number(v || 0), 0);
// Only mcq keys are option indexes; a true/false key is a boolean and a fill
// key is a list, so the option-distribution flag gets null for those.
const keyIndex = (q) => (Number.isInteger(q?.answer) ? q.answer : null);
const rowKeys = (toggle) => (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } };

/** The whole bank, by id, loaded once the page is allowed to render. All
 *  banks are fetched in one wave; a stem appears beside its number as soon
 *  as the last chunk lands. */
function useBank(enabled) {
  const [bank, setBank] = useState(null);
  useEffect(() => {
    if (!enabled || bank) return undefined;
    let alive = true;
    import('../data/bank-registry.generated.js').then(async ({ BANK_REGISTRY }) => {
      const lists = await Promise.all(BANK_REGISTRY.map((entry) => entry.load().catch(() => [])));
      const map = new Map();
      for (const list of lists) for (const q of list) map.set(Number(q.id), q);
      if (alive) setBank(map);
    }).catch(() => { if (alive) setBank(new Map()); });
    return () => { alive = false; };
  }, [enabled, bank]);
  return bank;
}

function Kpi({ label, value, sub, focus, live }) {
  return (
    <div className={`ad-kpi${focus ? ' is-focus' : ''}`}>
      <i>{live ? <span className="ad-live" aria-hidden="true" /> : null}{label}</i>
      <b>{value}</b>
      {sub ? <small>{sub}</small> : null}
    </div>
  );
}

/** One series of daily attempts. Bars on a baseline, hover tooltip, no legend
 *  (one series: the title names it). */
function DailyChart({ daily, days }) {
  const rows = useMemo(() => fillDaily(daily, days), [daily, days]);
  const [hover, setHover] = useState(null);
  const host = useRef(null);
  const W = 640; const H = 170; const padL = 30; const padB = 22; const padT = 10;
  const max = Math.max(1, ...rows.map((r) => r.attempts));
  const innerW = W - padL - 8; const innerH = H - padB - padT;
  const step = innerW / Math.max(1, rows.length);
  const barW = Math.max(2, Math.min(18, step * 0.62));
  const y = (v) => padT + innerH - (v / max) * innerH;
  const ticks = [...new Set([0, Math.round(max / 2), max])];
  const labelEvery = rows.length > 40 ? 10 : rows.length > 14 ? 7 : 1;
  // The tip is centred on its bar but never past the card's edges, where the
  // app shell clips it.
  const tipLeft = hover == null ? 0 : Math.min(86, Math.max(14, ((padL + hover * step + step / 2) / W) * 100));
  return (
    <div className="ad-chart" ref={host} onMouseLeave={() => setHover(null)}>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`ข้อที่ตอบต่อวัน ${rows.length} วัน สูงสุด ${max} ข้อ`}>
        {ticks.map((t) => (
          <g key={t}>
            <line className="grid" x1={padL} x2={W - 8} y1={y(t)} y2={y(t)} />
            <text x={padL - 6} y={y(t) + 3} textAnchor="end">{t}</text>
          </g>
        ))}
        {rows.map((r, i) => {
          const x = padL + i * step + (step - barW) / 2;
          const h = r.attempts ? Math.max(3, innerH - (y(r.attempts) - padT)) : 0;
          return (
            <g key={r.d}>
              {r.attempts
                ? <rect className={`bar${hover === i ? ' is-hover' : ''}`} x={x} y={y(r.attempts)} width={barW} height={h} rx={3} />
                : <rect className="bar is-empty" x={x} y={y(0) - 2} width={barW} height={2} rx={1} />}
              <rect className="hit" x={padL + i * step} y={padT} width={step} height={innerH} onMouseEnter={() => setHover(i)} />
              {i % labelEvery === 0 && <text x={x + barW / 2} y={H - 6} textAnchor="middle">{fmtDay(r.d)}</text>}
            </g>
          );
        })}
      </svg>
      {hover != null && rows[hover] && (
        <div className="ad-tip" style={{ left: `${tipLeft}%`, top: `${(y(rows[hover].attempts) / H) * 100}%` }}>
          <div>{fmtDay(rows[hover].d)}</div>
          <div><b>{rows[hover].attempts}</b> ข้อ, ถูก {pct(rows[hover].correct, rows[hover].attempts)}, {rows[hover].users} คน</div>
        </div>
      )}
    </div>
  );
}

function Flags({ flags }) {
  if (!flags.length) return <span className="ad-muted">—</span>;
  return <span className="ad-flags">{flags.map((f) => <span key={f.key} className={`ad-flag ${f.tone}`}>{f.label}</span>)}</span>;
}

/** {a: 3, b: 5} -> chips "a 3", "b 5". For the small breakdowns. */
function KeyValues({ map, label }) {
  const entries = Object.entries(map || {}).sort((a, b) => Number(b[1]) - Number(a[1]));
  if (!entries.length) return <span className="ad-muted">{label ? `${label}: ` : ''}ไม่มี</span>;
  return <span className="ad-kv">{label ? <span className="ad-muted">{label}</span> : null}{entries.map(([k, v]) => <span key={k}><span>{k}</span><b>{n(v)}</b></span>)}</span>;
}

function QuestionDetail({ row, question, onOpen, onClose }) {
  const [detail, setDetail] = useState(null);
  const [err, setErr] = useState(null);
  useEffect(() => {
    let alive = true;
    setDetail(null); setErr(null);
    adminRpc('admin_question_detail', { qid: row.question_id })
      .then((d) => { if (alive) setDetail(d); })
      .catch((e) => { if (alive) setErr(e); });
    return () => { alive = false; };
  }, [row.question_id]);
  const answers = detail?.answers || row.answers || {};
  const dist = answerDistribution(answers);
  const total = dist.reduce((s, d) => s + d.count, 0);
  // A true/false key is stored as the words true/false, not an index.
  const tf = question?.type === 'tf' ? { yes: Number(answers.true || 0), no: Number(answers.false || 0) } : null;
  const copy = () => { try { navigator.clipboard?.writeText(String(row.question_id)); } catch { /* clipboard is a nicety */ } };
  // fill / short / essay keep their key in other fields; mcq and tf use options + answer index.
  const keyText = question && !question.options
    ? (question.blanks?.join(', ') || question.model_answer || (typeof question.answer === 'boolean' ? (question.answer ? 'ถูก' : 'ผิด') : question.answer != null && typeof question.answer !== 'object' ? String(question.answer) : null))
    : null;
  return (
    <div className="ad-detail" role="region" aria-label={`รายละเอียดข้อ ${row.question_id}`}>
      <div className="ad-detail-head">
        <div>
          <div className="ad-id">ข้อ {row.question_id}, {subjectName(row.subject)}{question?.topic ? `, ${question.topic}` : ''}</div>
          <h3>{question?.q || 'ไม่พบข้อนี้ในคลังของ build นี้ (อาจถูกลบหรือย้าย id)'}</h3>
        </div>
        <div className="ad-actions">
          {question && <button type="button" className="vmx-btn vmx-btn-primary vmx-btn-sm" onClick={() => onOpen?.(row.question_id)}>เปิดข้อนี้</button>}
          <button type="button" className="vmx-btn vmx-btn-ghost vmx-btn-sm" onClick={copy}>คัดลอก id</button>
          <button type="button" className="vmx-btn vmx-btn-ghost vmx-btn-sm" onClick={onClose}>ปิด</button>
        </div>
      </div>
      <div className="ad-detail-grid">
        <div>
          <div className="ad-muted" style={{ marginBottom: 6 }}>ตัวเลือก และจำนวนครั้งที่ถูกเลือก{total || tf ? ` (จาก ${tf ? tf.yes + tf.no : total} ครั้งที่มีข้อมูลตัวเลือก)` : ' (ยังไม่มีข้อมูลว่าเลือกข้อไหน)'}</div>
          {question?.options ? (
            <div className="ad-options">
              {question.options.map((opt, i) => {
                const c = dist.find((d) => d.index === i)?.count || 0;
                return (
                  <div key={i} className={`ad-option${i === question.answer ? ' is-key' : ''}`}>
                    <span className="letter">{String.fromCharCode(65 + i)}</span>
                    <span className="text" title={opt}>{opt}</span>
                    <span className="ad-bar"><span><span style={{ width: total ? `${Math.round((c / total) * 100)}%` : 0, background: i === question.answer ? 'var(--clr-sage)' : undefined }} /></span></span>
                    <span className="count">{c}</span>
                  </div>
                );
              })}
            </div>
          ) : tf ? (
            <div className="ad-options">
              {[['ถูก', tf.yes, question.answer === true], ['ผิด', tf.no, question.answer === false]].map(([label, c, key]) => (
                <div key={label} className={`ad-option${key ? ' is-key' : ''}`}>
                  <span className="letter">{key ? '✓' : ''}</span>
                  <span className="text">{label}</span>
                  <span className="ad-bar"><span><span style={{ width: tf.yes + tf.no ? `${Math.round((c / (tf.yes + tf.no)) * 100)}%` : 0, background: key ? 'var(--clr-sage)' : undefined }} /></span></span>
                  <span className="count">{c}</span>
                </div>
              ))}
            </div>
          ) : <p className="ad-muted">{question ? `ข้อแบบ ${question.type || 'ไม่ระบุ'} ไม่มีตัวเลือก` : 'ไม่มีตัวเลือกให้แสดง'}{keyText ? `, เฉลย: ${keyText}` : ''}</p>}
        </div>
        <div>
          <div className="ad-muted" style={{ marginBottom: 6 }}>ใครเคยทำข้อนี้ ผิดกี่ครั้ง</div>
          {err && <p className="ad-muted">{isForbidden(err) ? 'ไม่มีสิทธิ์' : 'โหลดไม่สำเร็จ'}</p>}
          {!detail && !err && <div className="ad-skeleton" style={{ width: '60%' }} />}
          {detail && (
            <ul className="ad-list">
              {detail.users.map((u) => (
                <li key={u.user_id}><span>{u.avatar || '🐾'} {u.username || 'ไม่มีชื่อ'}</span><span>ผิด {u.wrong}/{u.attempts}, ล่าสุด {fmtWhen(u.last_at)}</span></li>
              ))}
              {detail.users.length === 0 && <li><span className="ad-muted">ยังไม่มีใครทำ</span><span /></li>}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

function UserDetail({ row, bank, onClose }) {
  const [detail, setDetail] = useState(null);
  const [err, setErr] = useState(null);
  useEffect(() => {
    let alive = true;
    setDetail(null); setErr(null);
    adminRpc('admin_user_detail', { uid: row.user_id })
      .then((d) => { if (alive) setDetail(d); })
      .catch((e) => { if (alive) setErr(e); });
    return () => { alive = false; };
  }, [row.user_id]);
  return (
    <div className="ad-detail" role="region" aria-label={`รายละเอียดผู้ใช้ ${row.username || ''}`}>
      <div className="ad-detail-head">
        <div>
          <h3>{row.avatar || '🐾'} {row.username || 'ไม่มีชื่อ'}</h3>
          <div className="ad-id">{row.email || 'ไม่มีอีเมล'}{row.providers ? `, เข้าด้วย ${row.providers}` : ''}, สมัคร {fmtWhen(row.created_at)}, เข้าระบบล่าสุด {fmtWhen(row.last_sign_in_at)}</div>
        </div>
        <button type="button" className="vmx-btn vmx-btn-ghost vmx-btn-sm" onClick={onClose}>ปิด</button>
      </div>
      {err && <p className="ad-muted">{isForbidden(err) ? 'ไม่มีสิทธิ์' : 'โหลดไม่สำเร็จ'}</p>}
      {!detail && !err && <div className="ad-skeleton" style={{ width: '50%' }} />}
      {detail && (
        <div className="ad-detail-grid">
          <div>
            <div className="ad-muted" style={{ marginBottom: 6 }}>รายวิชา</div>
            <ul className="ad-list">
              {detail.subjects.map((s) => <li key={s.subject}><span>{subjectName(s.subject)}</span><span>{s.correct}/{s.attempts} ({pct(s.correct, s.attempts)})</span></li>)}
              {detail.subjects.length === 0 && <li><span className="ad-muted">ยังไม่มีประวัติ</span><span /></li>}
            </ul>
          </div>
          <div>
            <div className="ad-muted" style={{ marginBottom: 6 }}>ข้อที่เคยผิด</div>
            <ul className="ad-list">
              {detail.wrong.map((w) => (
                <li key={w.question_id}>
                  <span title={bank?.get(Number(w.question_id))?.q || ''}><span className="ad-id">{w.question_id}</span> {(bank?.get(Number(w.question_id))?.q || subjectName(w.subject)).slice(0, 48)}</span>
                  <span>ผิด {w.wrong}/{w.attempts}</span>
                </li>
              ))}
              {detail.wrong.length === 0 && <li><span className="ad-muted">ยังไม่เคยผิดสักข้อ</span><span /></li>}
            </ul>
          </div>
          <div>
            <div className="ad-muted" style={{ marginBottom: 6 }}>ชุดสอบที่ส่ง</div>
            <ul className="ad-list">
              {detail.exams.map((e, i) => <li key={i}><span>{subjectName(e.subject)} ({e.mode})</span><span>{e.correct}/{e.total}, {fmtWhen(e.at)}</span></li>)}
              {detail.exams.length === 0 && <li><span className="ad-muted">ยังไม่เคยส่งชุดสอบ</span><span /></li>}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

/** The whole release history, searchable, twenty at a time. */
function Releases() {
  const [q, setQ] = useState('');
  const [shown, setShown] = useState(20);
  const needle = q.trim().toLowerCase();
  const list = useMemo(() => (needle
    ? CHANGELOG.filter((r) => [r.version, r.headline, ...r.changes.flatMap((c) => [c.title, c.desc])].some((s) => String(s || '').toLowerCase().includes(needle)))
    : CHANGELOG), [needle]);
  const kinds = useMemo(() => CHANGELOG.flatMap((r) => r.changes).reduce((m, c) => { m[c.kind] = (m[c.kind] || 0) + 1; return m; }, {}), []);
  const first = CHANGELOG[CHANGELOG.length - 1];
  return (
    <>
      <section className="ad-kpis" aria-label="สรุปเวอร์ชัน">
        <Kpi label="เวอร์ชันปัจจุบัน" value={CHANGELOG[0]?.version || '—'} sub={fmtDate(CHANGELOG[0]?.date)} />
        <Kpi label="รีลีสทั้งหมด" value={n(CHANGELOG.length)} sub={first ? `ตั้งแต่ ${fmtDate(first.date)}` : ''} />
        <Kpi label="รายการเปลี่ยนแปลง" value={n(sum(kinds))} sub={Object.entries(kinds).map(([k, v]) => `${KIND_LABEL[k] || k} ${v}`).join(', ')} />
      </section>
      <div className="ad-card">
        <div className="ad-card-head">
          <h2>ประวัติทุกเวอร์ชัน</h2>
          <input className="ad-search" type="search" value={q} onChange={(e) => { setQ(e.target.value); setShown(20); }} placeholder="ค้นเวอร์ชัน หัวข้อ หรือรายละเอียด" aria-label="ค้นหาในประวัติเวอร์ชัน" />
        </div>
        {list.length === 0 && <div className="ad-empty">ไม่พบ "{q}"</div>}
        <div className="ad-releases">
          {list.slice(0, shown).map((r) => (
            <details key={r.version} className="ad-release">
              <summary>
                <span className="ad-release-v">{r.version}</span>
                <span className="ad-release-h">{r.headline}</span>
                <span className="ad-release-d">{fmtDate(r.date)}, {r.changes.length} รายการ</span>
              </summary>
              <ul className="ad-release-list">
                {r.changes.map((c, i) => (
                  <li key={i}>
                    <span className={`ad-flag ${KIND_TONE[c.kind] || 'info'}`}>{KIND_LABEL[c.kind] || c.kind}</span>
                    {c.scope && SCOPE_LABELS[c.scope] ? <span className="ad-id">{SCOPE_LABELS[c.scope].label}</span> : <span />}
                    <b>{c.title}</b>
                    {c.desc ? <p>{c.desc}</p> : null}
                  </li>
                ))}
              </ul>
            </details>
          ))}
        </div>
        {shown < list.length && (
          <div className="ad-actions" style={{ marginTop: 12 }}>
            <button type="button" className="vmx-btn vmx-btn-ghost vmx-btn-sm" onClick={() => setShown((s) => s + 20)}>แสดงอีก 20 (เหลือ {n(list.length - shown)})</button>
          </div>
        )}
      </div>
    </>
  );
}

export default function AdminView({ goHome, user, onOpenQuestion, onlineCount = 0, onlineStatus = 'disabled' }) {
  const [gate, setGate] = useState(hasSupabase ? 'checking' : 'nobackend');
  // `range` is the chip that is pressed; `data.range` is the range the numbers
  // on screen were loaded for. They differ while a switch is loading or after
  // it failed, and every label next to a number follows `data.range`.
  const [range, setRange] = useState(30);
  const [data, setData] = useState(null);
  const [err, setErr] = useState(null); // { range, error } of the request that failed
  const [openQ, setOpenQ] = useState(null);
  const [openU, setOpenU] = useState(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!hasSupabase) return undefined;
    if (!user?.id) { setGate('signedout'); return undefined; }
    let alive = true;
    setGate('checking');
    checkIsAdmin().then((ok) => { if (alive) setGate(ok ? 'ok' : 'denied'); }).catch(() => { if (alive) setGate('denied'); });
    return () => { alive = false; };
  }, [user?.id]);

  useEffect(() => {
    if (gate !== 'ok') return undefined;
    let alive = true;
    setErr(null);
    // Four of these five expand every user_data.history (admin_history), and
    // users_list always expands all of it. Measured on production 2026-09-23
    // with EXPLAIN ANALYZE at ทั้งหมด, the worst case: 12,777 history rows took
    // 76 ms to expand, and each report ran in 93 to 144 ms. The cost is linear
    // at about 6 µs a row, so a report reaches 1 s somewhere past 120,000 rows.
    // Expand once per request (one report RPC) only when it gets near that.
    Promise.all([
      adminRpc('admin_overview', { days: range }),
      adminRpc('admin_questions', { days: range, min_attempts: 3, lim: 80 }),
      adminRpc('admin_subjects', { days: range }),
      adminRpc('admin_users_list', { days: range }),
      adminRpc('admin_extras', { days: range }),
    ]).then(([overview, questions, subjects, users, extras]) => {
      if (alive) setData({ range, overview, questions: rankQuestions(questions), subjects, users, extras });
    }).catch((e) => { if (alive) { setErr({ range, error: e }); if (isForbidden(e)) setGate('denied'); } });
    return () => { alive = false; };
  }, [gate, range, tick]);

  const bank = useBank(gate === 'ok');

  if (gate !== 'ok') {
    return (
      <div className="ad-locked" aria-live="polite">
        <span aria-hidden="true" style={{ fontSize: 34 }}>🐾</span>
        <h1>{gate === 'checking' ? 'กำลังตรวจสิทธิ์' : 'หน้านี้เปิดให้เฉพาะผู้ดูแล'}</h1>
        <p>{gate === 'nobackend'
          ? 'เครื่องนี้ไม่ได้ต่อกับฐานข้อมูล จึงไม่มีอะไรให้ดู'
          : gate === 'checking' ? 'ถามฐานข้อมูลอยู่ว่าบัญชีนี้เปิดดูได้ไหม'
            : gate === 'signedout' ? 'ยังไม่ได้ล็อกอิน หน้านี้ตรวจสิทธิ์จากบัญชี ไม่ใช่จากเครื่อง'
              : 'บัญชีที่ล็อกอินอยู่ไม่มีสิทธิ์ ข้อมูลไม่ได้ถูกส่งมาที่เครื่องนี้'}</p>
        <button type="button" className="vmx-btn vmx-btn-ghost vmx-btn-sm" onClick={goHome}>กลับหน้าแรก</button>
      </div>
    );
  }

  const o = data?.overview;
  const x = data?.extras;
  const flagged = (data?.questions || []).map((row) => ({ row, flags: qualityFlags(row, keyIndex(bank?.get(Number(row.question_id)))) })).filter((f) => f.flags.length);
  const rangeLabel = rangeName(data ? data.range : range);
  const failed = err?.range === range ? err.error : null;
  const rangeStatus = !data || data.range === range ? null
    : failed ? `โหลดช่วง ${rangeName(range)} ไม่สำเร็จ (${failed.message}) ตัวเลขที่เห็นยังเป็นของช่วง ${rangeLabel} กดดึงใหม่เพื่อลองอีกครั้ง`
      : `กำลังโหลดช่วง ${rangeName(range)} ตัวเลขที่เห็นยังเป็นของช่วง ${rangeLabel}`;
  const panicTotal = sum(Q_PANIC_COUNTS_BY_SUBJECT);
  const onlineText = onlineStatus === 'connected' ? n(onlineCount) : onlineStatus === 'loading' ? '…' : '—';
  const onlineSub = onlineStatus === 'connected' ? 'แท็บที่เปิดอยู่ตอนนี้ รวมของคุณ' : onlineStatus === 'loading' ? 'กำลังต่อ realtime' : 'realtime ไม่ต่อ';
  const toggleQ = (row) => { setOpenQ((cur) => (cur?.question_id === row.question_id ? null : row)); setOpenU(null); };
  const toggleU = (u) => { setOpenU((cur) => (cur?.user_id === u.user_id ? null : u)); setOpenQ(null); };

  return (
    <div className="ad-root">
      <header className="ad-head">
        <div>
          <h1>หลังบ้าน</h1>
          <p>สถิติทั้งหมดของ VetMock อ่านสดจากฐานข้อมูล เห็นได้เฉพาะบัญชีนี้ ตัวเลขที่ขึ้นกับช่วงเวลาคือช่วง {rangeLabel}{o?.generated_at ? `, ดึงเมื่อ ${fmtWhen(o.generated_at)}` : ''}</p>
          {rangeStatus && <p role="status">{rangeStatus}</p>}
        </div>
        <div className="ad-range" role="group" aria-label="ช่วงเวลา">
          {RANGES.map(([d, label]) => <button key={d} type="button" className={d === range ? 'is-on' : ''} aria-pressed={d === range} onClick={() => { setRange(d); setOpenQ(null); setOpenU(null); }}>{label}</button>)}
          <button type="button" className="vmx-btn vmx-btn-ghost vmx-btn-sm" onClick={() => setTick((t) => t + 1)}>ดึงใหม่</button>
        </div>
      </header>

      <nav className="ad-nav" aria-label="ส่วนของหน้า">
        {SECTIONS.map(([id, label]) => <a key={id} href={`#ad-${id}`}>{label}</a>)}
      </nav>

      {failed && !rangeStatus && !isForbidden(failed) && <div className="ad-card"><p className="ad-muted">โหลดไม่สำเร็จ: {failed.message}</p></div>}
      {!data && !failed && <div className="ad-card"><div className="ad-skeleton" style={{ width: '40%', marginBottom: 10 }} /><div className="ad-skeleton" style={{ width: '70%' }} /></div>}

      {data && (
        <>
          <section id="ad-overview" className="ad-kpis" aria-label="ตัวเลขหลัก">
            <Kpi label="โจทย์ที่ควรดู" value={n(flagged.length)} sub={flagged[0] ? `เริ่มที่ข้อ ${flagged[0].row.question_id}` : 'ยังไม่มีสัญญาณ'} focus />
            <Kpi label="ออนไลน์ตอนนี้" value={onlineText} sub={onlineSub} live={onlineStatus === 'connected'} />
            <Kpi label="บัญชี" value={n(o.accounts_total)} sub={`ใหม่ ${n(o.accounts_new)} ใน ${rangeLabel}`} />
            <Kpi label="เข้าระบบ" value={n(x.signins_range)} sub={`บัญชีที่เข้าระบบใน ${rangeLabel}`} />
            <Kpi label="คนที่ทำโจทย์" value={n(o.users_active)} sub={`ซิงก์ ${n(o.users_synced)} บัญชี`} />
            <Kpi label="ข้อที่ตอบ" value={n(o.attempts)} sub={`${n(o.questions_touched)} ข้อไม่ซ้ำ`} />
            <Kpi label="ความแม่น" value={pct(o.correct, o.attempts)} sub={`ถูก ${n(o.correct)} ข้อ`} />
            <Kpi label="ชุดสอบที่ส่ง" value={n(o.exams)} sub={o.exams_avg_pct != null ? `เฉลี่ย ${o.exams_avg_pct}%` : 'ยังไม่มี'} />
          </section>

          <section className="ad-card">
            <div className="ad-card-head"><h2>ข้อที่ตอบต่อวัน</h2><p>ทุกคนรวมกัน เอาเมาส์วางเพื่อดูวันนั้น</p></div>
            <DailyChart daily={o.daily} days={data.range} />
          </section>

          <section id="ad-questions" className="ad-card">
            <div className="ad-card-head">
              <h2>โจทย์ที่คนผิดบ่อย</h2>
              <p>เรียงจากสัดส่วนผิดมากไปน้อย นับเฉพาะข้อที่ถูกทำอย่างน้อย 3 ครั้ง กดแถวเพื่อดูว่าใครผิดและเลือกข้อไหน</p>
            </div>
            {data.questions.length === 0 ? <div className="ad-empty">ยังไม่มีข้อไหนถูกทำถึง 3 ครั้งในช่วงนี้</div> : (
              <div className="ad-tablewrap">
                <table className="ad-table">
                  <thead><tr><th>ข้อ</th><th>วิชา</th><th className="num">ทำ</th><th>ผิด</th><th className="num">คนที่ผิด</th><th>สัญญาณ</th><th className="num">ล่าสุด</th></tr></thead>
                  <tbody>
                    {data.questions.map((row) => {
                      const q = bank?.get(Number(row.question_id));
                      const flags = qualityFlags(row, keyIndex(q));
                      const open = openQ?.question_id === row.question_id;
                      return (
                        <tr key={row.question_id} className={`is-row${open ? ' is-open' : ''}`} role="button" aria-expanded={open} tabIndex={0} onClick={() => toggleQ(row)} onKeyDown={rowKeys(() => toggleQ(row))}>
                          <td><span className="ad-id">{row.question_id}</span><span className="ad-stem" title={q?.q || ''}>{q?.q || (bank ? 'ไม่พบใน build นี้' : 'กำลังโหลดคลัง')}</span></td>
                          <td>{subjectName(row.subject)}</td>
                          <td className="num">{n(row.attempts)}</td>
                          <td><span className="ad-bar"><span><span style={{ width: `${Math.round(wrongRate(row) * 100)}%` }} /></span><span className="num">{Math.round(wrongRate(row) * 100)}%</span></span></td>
                          <td className="num">{row.users_wrong}/{row.users}</td>
                          <td><Flags flags={flags} /></td>
                          <td className="num">{fmtWhen(row.last_at)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
            {openQ && <QuestionDetail row={openQ} question={bank?.get(Number(openQ.question_id))} onOpen={onOpenQuestion} onClose={() => setOpenQ(null)} />}
          </section>

          <section id="ad-subjects" className="ad-card">
            <div className="ad-card-head"><h2>รายวิชา</h2><p>ข้อที่แตะ เทียบกับข้อที่มีในคลัง และขนาด Panic pool ของวิชานั้น</p></div>
            <div className="ad-tablewrap">
              <table className="ad-table">
                <thead><tr><th>วิชา</th><th className="num">คน</th><th className="num">ทำ</th><th>ความแม่น</th><th className="num">ข้อที่แตะ / ในคลัง</th><th className="num">Panic</th></tr></thead>
                <tbody>
                  {data.subjects.map((s) => (
                    <tr key={s.subject}>
                      <td>{subjectName(s.subject)}</td>
                      <td className="num">{s.users}</td>
                      <td className="num">{n(s.attempts)}</td>
                      <td><span className="ad-bar is-good"><span><span style={{ width: s.attempts ? `${Math.round((s.correct / s.attempts) * 100)}%` : 0 }} /></span><span className="num">{pct(s.correct, s.attempts)}</span></span></td>
                      <td className="num">{s.questions} / {n(Q_VISIBLE_COUNTS_BY_SUBJECT[s.subject] ?? 0)}</td>
                      <td className="num">{n(Q_PANIC_COUNTS_BY_SUBJECT[s.subject] ?? 0)}</td>
                    </tr>
                  ))}
                  {data.subjects.length === 0 && <tr><td colSpan={6} className="ad-empty">ยังไม่มีข้อมูลในช่วงนี้</td></tr>}
                </tbody>
              </table>
            </div>
          </section>

          <section id="ad-people" className="ad-card">
            <div className="ad-card-head"><h2>คนที่ใช้</h2><p>ทุกบัญชี เรียงจากที่เคลื่อนไหวล่าสุด กดแถวเพื่อดูวิชา ข้อที่เคยผิด และชุดสอบ</p></div>
            <div className="ad-kv-row">
              <KeyValues map={x.identities} label="วิธีเข้าระบบ" />
              <span className="ad-muted">เข้าระบบล่าสุด: {(x.recent_signins || []).slice(0, 6).map((s) => `${s.username || 'ไม่มีชื่อ'} ${fmtWhen(s.at)}`).join(', ') || 'ยังไม่มี'}</span>
            </div>
            <div className="ad-tablewrap">
              <table className="ad-table">
                <thead><tr><th>ชื่อ</th><th>อีเมล</th><th className="num">สมัคร</th><th className="num">เข้าระบบล่าสุด</th><th className="num">ทำใน {rangeLabel}</th><th className="num">ทั้งหมด</th><th>ความแม่น</th><th className="num">streak</th><th className="num">ชุดสอบ</th></tr></thead>
                <tbody>
                  {data.users.map((u) => {
                    const open = openU?.user_id === u.user_id;
                    return (
                      <tr key={u.user_id} className={`is-row${open ? ' is-open' : ''}`} role="button" aria-expanded={open} tabIndex={0} onClick={() => toggleU(u)} onKeyDown={rowKeys(() => toggleU(u))}>
                        <td>{u.avatar || '🐾'} {u.username || <span className="ad-muted">ไม่มีชื่อ</span>}</td>
                        <td><span className="ad-id">{u.email || '—'}</span></td>
                        <td className="num">{fmtWhen(u.created_at)}</td>
                        <td className="num">{fmtWhen(u.last_sign_in_at)}</td>
                        <td className="num">{n(u.attempts_range)}</td>
                        <td className="num">{n(u.attempts)}</td>
                        <td><span className="ad-bar is-good"><span><span style={{ width: u.attempts ? `${Math.round((u.correct / u.attempts) * 100)}%` : 0 }} /></span><span className="num">{pct(u.correct, u.attempts)}</span></span></td>
                        <td className="num">{n(u.streak)}</td>
                        <td className="num">{n(u.exams)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {openU && <UserDetail row={openU} bank={bank} onClose={() => setOpenU(null)} />}
          </section>

          <section id="ad-exams" className="ad-card">
            <div className="ad-card-head"><h2>ชุดสอบล่าสุด</h2><p>40 ชุดล่าสุดที่ถูกส่ง ทุกคน</p></div>
            {(x.recent_exams || []).length === 0 ? <div className="ad-empty">ยังไม่มีใครส่งชุดสอบ</div> : (
              <div className="ad-tablewrap">
                <table className="ad-table">
                  <thead><tr><th>ใคร</th><th>วิชา</th><th>แบบ</th><th className="num">ได้</th><th className="num">%</th><th className="num">ใช้เวลา</th><th className="num">ปี / เทอม</th><th className="num">เมื่อ</th></tr></thead>
                  <tbody>
                    {x.recent_exams.map((e, i) => (
                      <tr key={i}>
                        <td>{e.avatar || '🐾'} {e.username || <span className="ad-muted">ไม่มีชื่อ</span>}</td>
                        <td>{subjectName(e.subject)}</td>
                        <td>{e.mode}</td>
                        <td className="num">{e.correct}/{e.total}</td>
                        <td className="num">{e.pct}%</td>
                        <td className="num">{mins(e.duration_sec)}</td>
                        <td className="num">{e.year ?? '—'} / {e.phase || '—'}</td>
                        <td className="num">{fmtWhen(e.at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <section id="ad-content" className="ad-card">
            <div className="ad-card-head"><h2>คลังเนื้อหา</h2><p>ตัวเลขฝั่งซ้ายมาจาก build นี้ ฝั่งขวาจากฐานข้อมูล</p></div>
            <div className="ad-kpis">
              <Kpi label="โจทย์ที่เปิดให้ทำ" value={n(QB_TOTAL)} sub={`กันไว้ ${n(QB_BLOCKED_TOTAL)} ข้อ`} />
              <Kpi label="Panic pool" value={n(panicTotal)} sub="ข้อสอบเก่าและข้อที่รุ่นพี่ชี้" />
              <Kpi label="เอกสารในคลัง" value={n(sum(x.library?.by_status))} sub={bytes(x.library?.bytes)} />
              <Kpi label="เคสภาพรังสี" value={n(x.imaging?.cases)} sub={`${n(x.imaging?.files)} ไฟล์, ทำไป ${n(x.imaging?.attempts)} ครั้ง`} />
            </div>
            <div className="ad-kv-row">
              <KeyValues map={Object.fromEntries(Object.entries(Q_VISIBLE_COUNTS_BY_YEAR).map(([y, c]) => [`ปี ${y}`, c]))} label="โจทย์ตามชั้นปี" />
              <KeyValues map={x.library?.by_status} label="เอกสารตามสถานะ" />
              <KeyValues map={x.library?.by_kind} label="ตามชนิด" />
              <KeyValues map={Object.fromEntries(Object.entries(x.library?.by_year || {}).map(([y, c]) => [y === '?' ? 'ไม่ระบุปี' : `ปี ${y}`, c]))} label="ตามชั้นปี" />
            </div>
            <div className="ad-card-head" style={{ marginTop: 14 }}><h2 style={{ fontSize: 16 }}>สิ่งที่คนเก็บไว้</h2><p>รวมทุกบัญชีที่ซิงก์</p></div>
            <div className="ad-kpis">
              <Kpi label="บุ๊กมาร์ก" value={n(x.stash?.bookmarks)} />
              <Kpi label="โน้ต" value={n(x.stash?.notes)} />
              <Kpi label="การ์ด SR" value={n(x.stash?.sr_cards)} />
              <Kpi label="โจทย์ที่แต่งเอง" value={n(x.stash?.custom_questions)} />
              <Kpi label="รายการอ่านที่ติ๊ก" value={n(x.stash?.reading_checklist)} />
              <Kpi label="PDF ที่จด" value={n(x.stash?.pdf_annotations)} sub="เอกสารที่มีเส้นหมึก" />
            </div>
          </section>

          <section id="ad-community" className="ad-card">
            <div className="ad-card-head"><h2>ชุมชน</h2><p>กลุ่ม ผู้ร่วมเขียนโจทย์ และโจทย์ที่ส่งเข้ามารอตรวจ</p></div>
            <div className="ad-detail-grid">
              <div>
                <div className="ad-muted" style={{ marginBottom: 6 }}>กลุ่ม</div>
                <ul className="ad-list">
                  {(x.groups || []).map((g) => <li key={g.code}><span>{g.name} <span className="ad-id">{g.code}</span></span><span>{n(g.members)} คน, {fmtWhen(g.at)}</span></li>)}
                  {(x.groups || []).length === 0 && <li><span className="ad-muted">ยังไม่มีกลุ่ม</span><span /></li>}
                </ul>
              </div>
              <div>
                <div className="ad-muted" style={{ marginBottom: 6 }}>ผู้ร่วมเขียนโจทย์</div>
                <ul className="ad-list">
                  {(x.contributors || []).map((c, i) => <li key={i}><span>{c.name || 'ไม่มีชื่อ'} <span className="ad-id">{c.role}</span></span><span>คะแนน {n(c.score)}, ส่ง {n(c.submissions)}, ผ่าน {n(c.approved)}, ตรวจ {n(c.reviews)}</span></li>)}
                  {(x.contributors || []).length === 0 && <li><span className="ad-muted">ยังไม่มี</span><span /></li>}
                </ul>
              </div>
              <div>
                <div className="ad-muted" style={{ marginBottom: 6 }}>โจทย์ที่ส่งเข้ามา ({n(o.submissions_open)} รอตรวจ)</div>
                <ul className="ad-list">
                  {(x.submissions || []).map((s) => <li key={s.id}><span title={s.q_text || ''}>{subjectName(s.subject)}: {(s.q_text || '').slice(0, 40)} <span className="ad-id">{s.status}</span></span><span>{s.by || '—'}, {fmtWhen(s.at)}</span></li>)}
                  {(x.submissions || []).length === 0 && <li><span className="ad-muted">ยังไม่มีใครส่ง</span><span /></li>}
                </ul>
              </div>
            </div>
          </section>

          <section id="ad-errors" className="ad-card">
            <div className="ad-card-head"><h2>ข้อผิดพลาดฝั่งผู้ใช้</h2><p>รายงานจากเบราว์เซอร์ของผู้ใช้ เก็บย้อนหลัง 14 วัน แยกตามวัน เวอร์ชัน และหน้า</p></div>
            {(x.errors || []).length === 0 ? <div className="ad-empty">ไม่มีรายงานใน 14 วันที่ผ่านมา</div> : (
              <div className="ad-tablewrap">
                <table className="ad-table">
                  <thead><tr><th>วัน</th><th>เวอร์ชัน</th><th>หน้า</th><th>ชนิด</th><th>หมวด</th><th className="num">ครั้ง</th></tr></thead>
                  <tbody>
                    {x.errors.map((e, i) => (
                      <tr key={i}><td className="num">{fmtDate(e.day)}</td><td><span className="ad-id">{e.release}</span></td><td>{e.view}</td><td>{e.kind}</td><td>{e.category}</td><td className="num">{n(e.count)}</td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <PrivateNotes />

          <section id="ad-database" className="ad-card">
            <div className="ad-card-head"><h2>ฐานข้อมูล</h2><p>จำนวนแถวของทุกตาราง และสัญญาณอื่นที่เก็บอยู่</p></div>
            <div className="ad-detail-grid">
              <div className="ad-tablewrap">
                <table className="ad-table">
                  <thead><tr><th>ตาราง</th><th className="num">แถว</th></tr></thead>
                  <tbody>
                    {(x.tables || []).map((t) => <tr key={t.name}><td><span className="ad-id">{t.name}</span></td><td className="num">{n(t.rows)}</td></tr>)}
                  </tbody>
                </table>
              </div>
              <div>
                <div className="ad-kv-row" style={{ marginBottom: 12 }}>
                  <KeyValues map={x.event_kinds} label="เหตุการณ์ที่บันทึก" />
                </div>
                <div className="ad-muted" style={{ marginBottom: 6 }}>ชีพจรรายวัน (daily_q_pulse)</div>
                <ul className="ad-list">
                  {(x.pulse || []).slice(0, 14).map((p) => <li key={p.d}><span>{fmtDate(p.d)}</span><span>{n(p.attempts)} ข้อ, ถูก {pct(p.correct, p.attempts)}</span></li>)}
                  {(x.pulse || []).length === 0 && <li><span className="ad-muted">ยังไม่มี</span><span /></li>}
                </ul>
              </div>
            </div>
          </section>

          <div id="ad-releases" className="ad-root" style={{ gap: 12 }}>
            <Releases />
          </div>

          <p className="ad-stamp">ประวัติที่ซิงก์ทั้งหมด {n(o.history_rows_total)} แถว, คำตอบที่บันทึกตัวเลือกด้วย {n(o.attempt_events)} ครั้ง, เอกสารในคลัง {n(o.library_docs)} ไฟล์, โจทย์รอตรวจ {n(o.submissions_open)} ข้อ</p>
        </>
      )}
    </div>
  );
}
