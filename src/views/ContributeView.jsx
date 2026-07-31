// ============================================================
// ContributeView — Q submission form (4-tier review pipeline)
// ============================================================
// Any signed-in user can submit a proposed exam question. Flow:
//   TIER 0  auto-screen (DB lint + schema)
//   TIER 1  peer review — 2 verified contributors approve
//   TIER 2  Palm final review (founder queue)
//   TIER 3  publish into Q bank
//
// Lib does the heavy lifting (validation mirrored to DB, RPC
// dispatch, reputation lookup). This view is purely a form +
// "my submissions" list with live validation feedback.
// ============================================================
import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import BackBar from '../components/BackBar.jsx';
import {
  CONTRIBUTION_SOURCE_TYPES,
  validateSubmission,
  submitProposal,
  fetchMyReputation,
  fetchMySubmissions,
  statusMeta,
  ROLE_META,
  ensureContributorRow,
} from '../lib/contributions.js';
import { SUBJECTS_BY_YEAR } from '../data/curriculum.js';

// ─── Relative-time formatter (Thai) ────────────────────────────
function relTime(iso) {
  if (!iso) return '';
  const then = new Date(iso).getTime();
  const diff = Math.max(0, Date.now() - then);
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'เมื่อสักครู่';
  if (m < 60) return `${m} นาทีที่แล้ว`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} ชั่วโมงที่แล้ว`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d} วันที่แล้ว`;
  return new Date(iso).toLocaleDateString('th-TH', { day: 'numeric', month: 'short' });
}

// ─── Shared styles (CSS-in-JS to stay in line with FeedbackView) ──
const LABEL_STYLE = {
  display: 'block',
  fontFamily: 'var(--vmx-mono)',
  fontSize: 11,
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  color: 'var(--clr-ink-soft)',
  marginBottom: 6,
};
const FIELD_WRAP = { marginBottom: 16 };
const ERROR_TEXT = { fontSize: 12, color: 'var(--clr-rose-text)', marginTop: 4, lineHeight: 1.5 };
const CARD_BASE = {
  padding: 16,
  borderRadius: 14,
  background: 'var(--clr-surface)',
  border: '1px solid var(--clr-border)',
};

// ─── Empty payload factory ─────────────────────────────────────
function emptyPayload(defaultYear = 4) {
  return {
    year: defaultYear,
    subject: '',
    topic: '',
    q_type: 'mcq',
    q_text: '',
    options: ['', ''],
    answer_idx: 0,
    explain_text: '',
    difficulty: 3,
    source_type: '',
    source_ref: '',
    contributor_note: '',
  };
}

export default function ContributeView({ goHome, setView, user, selectedYear = 4 }) {
  // ─── Auth gate ───────────────────────────────────────────────
  if (!user) {
    return (
      <>
        <BackBar onBack={goHome} label="หน้าแรก" />
        <div className="vmx-hero">
          <h1><em>ส่งคำถาม</em> ให้ Q bank</h1>
          <p>Login ก่อนเพื่อส่งคำถาม — แต่ละ Q จะผ่าน 4-tier review (auto-screen → peer × 2 → Palm → publish) ก่อนเข้า bank</p>
        </div>
        <div style={{ ...CARD_BASE, maxWidth: 480, margin: '24px auto', textAlign: 'center' }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>🔐</div>
          <p style={{ marginBottom: 16, color: 'var(--clr-ink-soft)', lineHeight: 1.6 }}>
            ต้องล็อกอินด้วยบัญชี VetMock ก่อนถึงจะส่งคำถามได้
          </p>
          <button
            type="button"
            className="vmx-btn vmx-btn-primary"
            style={{ padding: '12px 20px' }}
            onClick={() => setView && setView('auth')}
          >
            Login เพื่อส่งคำถาม →
          </button>
        </div>
      </>
    );
  }

  // ─── Form state ─────────────────────────────────────────────
  const [payload, setPayload] = useState(() => emptyPayload(selectedYear));
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null); // {kind: 'ok'|'err', msg}
  const [warningsDismissed, setWarningsDismissed] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // ─── Reputation + submissions ───────────────────────────────
  const [rep, setRep] = useState(null);
  const [mySubs, setMySubs] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [loadingSubs, setLoadingSubs] = useState(true);

  const toastTimerRef = useRef(null);
  useEffect(() => () => { if (toastTimerRef.current) clearTimeout(toastTimerRef.current); }, []);

  const refreshAll = useCallback(async () => {
    setLoadingSubs(true);
    try {
      await ensureContributorRow();
      const [r, s] = await Promise.all([fetchMyReputation(), fetchMySubmissions(20)]);
      setRep(r);
      setMySubs(s || []);
    } catch (e) {
      console.warn('[contribute] refresh failed', e);
    } finally {
      setLoadingSubs(false);
    }
  }, []);

  useEffect(() => { refreshAll(); }, [refreshAll]);

  // ─── Derived: subject options + topic options ───────────────
  const subjectOptions = useMemo(
    () => (SUBJECTS_BY_YEAR[payload.year] || []),
    [payload.year]
  );
  const currentSubject = useMemo(
    () => subjectOptions.find((s) => s.id === payload.subject),
    [subjectOptions, payload.subject]
  );
  const topicOptions = currentSubject?.topics || [];

  // ─── Live validation ─────────────────────────────────────────
  const validation = useMemo(() => validateSubmission(payload), [payload]);
  const errorByField = useMemo(() => {
    const map = {};
    for (const e of validation.errors) {
      if (!map[e.field]) map[e.field] = [];
      map[e.field].push(e.msg);
    }
    return map;
  }, [validation.errors]);

  // ─── Patch helper ────────────────────────────────────────────
  const patch = (next) => setPayload((p) => ({ ...p, ...next }));

  // ─── Option ops ──────────────────────────────────────────────
  const setOption = (i, val) => {
    const next = [...payload.options];
    next[i] = val;
    patch({ options: next });
  };
  const addOption = () => {
    if (payload.options.length >= 6) return;
    patch({ options: [...payload.options, ''] });
  };
  const removeOption = (i) => {
    if (payload.options.length <= 2) return;
    const next = payload.options.filter((_, idx) => idx !== i);
    let nextAnswer = payload.answer_idx;
    if (nextAnswer === i) nextAnswer = 0;
    else if (nextAnswer > i) nextAnswer -= 1;
    patch({ options: next, answer_idx: nextAnswer });
  };

  // ─── Submit handler ──────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validation.canSubmit || submitting) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      await submitProposal(payload);
      setPayload(emptyPayload(payload.year));
      setWarningsDismissed(false);
      // Toast
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
      setToast({ kind: 'ok', msg: 'ส่งแล้ว — Q เข้าคิวรีวิว (auto-screen → peer × 2 → Palm)' });
      toastTimerRef.current = setTimeout(() => setToast(null), 4500);
      // Refresh "my submissions" + reputation (count bumps)
      refreshAll();
    } catch (err) {
      console.error('[contribute] submit failed', err);
      setSubmitError(err?.message || 'ส่งไม่สำเร็จ — ลองใหม่อีกครั้ง');
    } finally {
      setSubmitting(false);
    }
  };

  // ─── Render ──────────────────────────────────────────────────
  const roleMeta = rep?.role ? (ROLE_META[rep.role] || ROLE_META.contributor) : ROLE_META.contributor;
  const showWarnings = validation.warnings.length > 0 && !warningsDismissed;

  return (
    <>
      <BackBar onBack={goHome} label="หน้าแรก" />
      <div className="vmx-hero">
        <h1>ส่ง<em>คำถาม</em>ให้ Q bank</h1>
        <p>
          ทุก Q ผ่าน 4-tier review: <strong>auto-screen</strong> → <strong>peer × 2</strong> → <strong>Palm final</strong> → publish เข้า bank
        </p>
      </div>

      {/* Reputation chip */}
      <div style={{ maxWidth: 600, margin: '0 auto 16px', display: 'flex', justifyContent: 'center' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 12,
          padding: '8px 14px', borderRadius: 999,
          background: 'var(--clr-surface)', border: `1px solid ${roleMeta.color}55`,
        }}>
          <span style={{ fontSize: 18 }}>{roleMeta.icon}</span>
          <span style={{ fontWeight: 600, color: roleMeta.color }}>{roleMeta.label}</span>
          <span style={{ width: 1, height: 16, background: 'var(--clr-border)' }} />
          <span style={{ fontFamily: '"JetBrains Mono", "IBM Plex Sans Thai", monospace', fontSize: 12, color: 'var(--clr-ink-soft)' }}>
            score <strong style={{ color: 'var(--clr-ink)' }}>{rep?.score ?? 0}</strong>
          </span>
          <span style={{ width: 1, height: 16, background: 'var(--clr-border)' }} />
          <span style={{ fontFamily: '"JetBrains Mono", "IBM Plex Sans Thai", monospace', fontSize: 12, color: 'var(--clr-ink-soft)' }}>
            approved <strong style={{ color: 'var(--clr-ink)' }}>{rep?.approved_count ?? 0}</strong>
          </span>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div style={{
          maxWidth: 600, margin: '0 auto 16px', padding: 14, borderRadius: 12,
          background: toast.kind === 'ok' ? 'rgba(74, 107, 74, 0.15)' : 'var(--clr-rose-soft)',
          border: `1px solid ${toast.kind === 'ok' ? 'var(--clr-sage)' : 'var(--clr-rose)'}`,
          textAlign: 'center', fontSize: 14,
        }}>
          {toast.msg}
        </div>
      )}

      <div style={{ ...CARD_BASE, maxWidth: 600, margin: '0 auto' }}>
        <form onSubmit={handleSubmit} noValidate>
          {/* Year + Subject */}
          <div style={{ display: 'grid', gridTemplateColumns: '110px 1fr', gap: 12, ...FIELD_WRAP }}>
            <div>
              <label style={LABEL_STYLE}>ชั้นปี</label>
              <select
                value={payload.year}
                onChange={(e) => patch({ year: Number(e.target.value), subject: '', topic: '' })}
                style={{ width: '100%', minHeight: 44 }}
              >
                {[1, 2, 3, 4, 5, 6].map((y) => (
                  <option key={y} value={y}>ปี {y}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={LABEL_STYLE}>วิชา *</label>
              <select
                value={payload.subject}
                onChange={(e) => patch({ subject: e.target.value, topic: '' })}
                style={{ width: '100%', minHeight: 44 }}
              >
                <option value="">— เลือกวิชา —</option>
                {subjectOptions.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.icon ? `${s.icon} ` : ''}{s.name}
                  </option>
                ))}
              </select>
              {errorByField.subject && <div style={ERROR_TEXT}>⚠️ {errorByField.subject[0]}</div>}
            </div>
          </div>

          {/* Topic (optional, filtered by subject) */}
          {topicOptions.length > 0 && (
            <div style={FIELD_WRAP}>
              <label style={LABEL_STYLE}>หัวข้อย่อย (optional)</label>
              <select
                value={payload.topic}
                onChange={(e) => patch({ topic: e.target.value })}
                style={{ width: '100%', minHeight: 44 }}
              >
                <option value="">— ไม่ระบุ —</option>
                {topicOptions.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.icon ? `${t.icon} ` : ''}{t.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Question type */}
          <div style={FIELD_WRAP}>
            <label style={LABEL_STYLE}>รูปแบบคำถาม</label>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {[
                { id: 'mcq', label: 'MCQ (เลือก 1)' },
                { id: 'tf', label: 'True / False' },
                { id: 'multi', label: 'Multi-select' },
              ].map((t) => {
                const active = payload.q_type === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => patch({ q_type: t.id })}
                    style={{
                      flex: '1 1 100px',
                      minHeight: 44,
                      padding: '8px 12px',
                      borderRadius: 10,
                      border: `1px solid ${active ? 'var(--clr-sage)' : 'var(--clr-border)'}`,
                      background: active ? 'rgba(74, 107, 74, 0.12)' : 'var(--clr-surface)',
                      color: 'var(--clr-ink)',
                      fontSize: 13,
                      fontWeight: active ? 600 : 400,
                      cursor: 'pointer',
                    }}
                  >
                    {t.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Question stem */}
          <div style={FIELD_WRAP}>
            <label style={LABEL_STYLE}>
              โจทย์ * <span style={{ fontWeight: 'normal', textTransform: 'none', letterSpacing: 0 }}>
                ({payload.q_text.length}/2000)
              </span>
            </label>
            <textarea
              value={payload.q_text}
              onChange={(e) => patch({ q_text: e.target.value.slice(0, 2000) })}
              placeholder="เช่น สุนัขพันธุ์ Doberman 7 ปี เพศผู้ มาด้วยอาการ syncope ออกกำลังกายแล้วเป็นลม ผล echo พบ..."
              style={{ width: '100%', minHeight: 110, padding: 10, borderRadius: 8 }}
              maxLength={2000}
            />
            {errorByField.q_text && <div style={ERROR_TEXT}>⚠️ {errorByField.q_text[0]}</div>}
          </div>

          {/* Options + correct-answer radio */}
          <div style={FIELD_WRAP}>
            <label style={LABEL_STYLE}>
              ตัวเลือก * <span style={{ fontWeight: 'normal', textTransform: 'none', letterSpacing: 0 }}>
                ({payload.options.length}/6, กดวงกลมเพื่อระบุข้อที่ถูก)
              </span>
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {payload.options.map((opt, i) => {
                const isCorrect = payload.answer_idx === i;
                const hasErr = errorByField[`options[${i}]`];
                return (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: 8, borderRadius: 10,
                    background: isCorrect ? 'rgba(74, 107, 74, 0.08)' : 'transparent',
                    border: `1px solid ${isCorrect ? 'var(--clr-sage)' : 'var(--clr-border)'}`,
                  }}>
                    <button
                      type="button"
                      onClick={() => patch({ answer_idx: i })}
                      aria-label={`ทำเครื่องหมายตัวเลือก ${i + 1} เป็นคำตอบที่ถูก`}
                      style={{
                        width: 28, height: 28, borderRadius: '50%',
                        border: `2px solid ${isCorrect ? 'var(--clr-sage)' : 'var(--clr-border)'}`,
                        background: isCorrect ? 'var(--clr-sage)' : 'transparent',
                        color: isCorrect ? 'white' : 'var(--clr-ink-soft)',
                        fontSize: 13, fontWeight: 700,
                        cursor: 'pointer', flexShrink: 0,
                      }}
                    >
                      {isCorrect ? '✓' : String.fromCharCode(65 + i)}
                    </button>
                    <input
                      type="text"
                      value={opt}
                      onChange={(e) => setOption(i, e.target.value)}
                      placeholder={`ตัวเลือก ${String.fromCharCode(65 + i)}`}
                      maxLength={500}
                      style={{ flex: 1, minHeight: 40, padding: '8px 10px', borderRadius: 6 }}
                    />
                    {payload.options.length > 2 && (
                      <button
                        type="button"
                        onClick={() => removeOption(i)}
                        aria-label={`ลบตัวเลือก ${i + 1}`}
                        style={{
                          width: 32, height: 32, borderRadius: 8,
                          border: '1px solid var(--clr-border)',
                          background: 'var(--clr-surface)',
                          color: 'var(--clr-ink-soft)', fontSize: 16,
                          cursor: 'pointer', flexShrink: 0,
                        }}
                      >
                        ×
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
            {payload.options.length < 6 && (
              <button
                type="button"
                onClick={addOption}
                className="vmx-btn vmx-btn-ghost vmx-btn-sm"
                style={{ marginTop: 8 }}
              >
                + เพิ่มตัวเลือก
              </button>
            )}
            {errorByField.options && <div style={ERROR_TEXT}>⚠️ {errorByField.options[0]}</div>}
            {errorByField.answer_idx && <div style={ERROR_TEXT}>⚠️ {errorByField.answer_idx[0]}</div>}
          </div>

          {/* Explain / rationale */}
          <div style={FIELD_WRAP}>
            <label style={LABEL_STYLE}>
              เฉลย + อธิบายเหตุผล * <span style={{ fontWeight: 'normal', textTransform: 'none', letterSpacing: 0 }}>
                ({payload.explain_text.length} ตัวอักษร, ขั้นต่ำ 30)
              </span>
            </label>
            <textarea
              value={payload.explain_text}
              onChange={(e) => patch({ explain_text: e.target.value.slice(0, 5000) })}
              placeholder="ทำไมข้อ X ถึงถูก, ทำไมข้อ Y, Z ถึงผิด, อ้างอิงสไลด์/ตำราหน้าไหน"
              style={{ width: '100%', minHeight: 120, padding: 10, borderRadius: 8 }}
              maxLength={5000}
            />
            {errorByField.explain_text && <div style={ERROR_TEXT}>⚠️ {errorByField.explain_text[0]}</div>}
          </div>

          {/* Difficulty slider */}
          <div style={FIELD_WRAP}>
            <label style={LABEL_STYLE}>
              ความยาก: <span style={{ color: 'var(--clr-ink)' }}>
                {['', '⭐ ง่ายมาก', '⭐⭐ ง่าย', '⭐⭐⭐ กลาง', '⭐⭐⭐⭐ ยาก', '⭐⭐⭐⭐⭐ ยากมาก'][payload.difficulty]}
              </span>
            </label>
            <input
              type="range"
              min={1}
              max={5}
              step={1}
              value={payload.difficulty}
              onChange={(e) => patch({ difficulty: Number(e.target.value) })}
              style={{ width: '100%' }}
            />
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              fontSize: 10, fontFamily: '"JetBrains Mono", "IBM Plex Sans Thai", monospace',
              color: 'var(--clr-ink-soft)', marginTop: 2,
            }}>
              <span>1</span><span>2</span><span>3</span><span>4</span><span>5</span>
            </div>
          </div>

          {/* Source type + ref */}
          <div style={FIELD_WRAP}>
            <label style={LABEL_STYLE}>ประเภทแหล่งที่มา *</label>
            <select
              value={payload.source_type}
              onChange={(e) => patch({ source_type: e.target.value })}
              style={{ width: '100%', minHeight: 44 }}
            >
              <option value="">— เลือกประเภท —</option>
              {CONTRIBUTION_SOURCE_TYPES.map((t) => (
                <option key={t.id} value={t.id}>{t.label}</option>
              ))}
            </select>
            {errorByField.source_type && <div style={ERROR_TEXT}>⚠️ {errorByField.source_type[0]}</div>}
          </div>

          <div style={FIELD_WRAP}>
            <label style={LABEL_STYLE}>อ้างอิงแหล่งที่มา *</label>
            <input
              type="text"
              value={payload.source_ref}
              onChange={(e) => patch({ source_ref: e.target.value.slice(0, 300) })}
              placeholder='เช่น "Aj. Nan slide สัปดาห์ 3 หน้า 12" หรือ "Ettinger 8th ed., Ch. 251"'
              maxLength={300}
              style={{ width: '100%', minHeight: 44, padding: '8px 10px', borderRadius: 8 }}
            />
            {errorByField.source_ref && <div style={ERROR_TEXT}>⚠️ {errorByField.source_ref[0]}</div>}
          </div>

          {/* Contributor note */}
          <div style={FIELD_WRAP}>
            <label style={LABEL_STYLE}>โน้ตถึง reviewer (optional)</label>
            <textarea
              value={payload.contributor_note}
              onChange={(e) => patch({ contributor_note: e.target.value.slice(0, 1000) })}
              placeholder="เช่น 'จุดที่ไม่แน่ใจคือ option C — ขอ peer ช่วยเช็คให้หน่อย'"
              style={{ width: '100%', minHeight: 70, padding: 10, borderRadius: 8 }}
              maxLength={1000}
            />
          </div>

          {/* Banned-word lint errors (academic_safety bucket) */}
          {errorByField.academic_safety && (
            <div style={{
              padding: 12, borderRadius: 10, background: 'var(--clr-rose-soft)',
              border: '1px solid var(--clr-rose)', marginBottom: 12, fontSize: 13,
            }}>
              <strong>⛔ academic-safety lint:</strong>
              <ul style={{ margin: '6px 0 0', paddingLeft: 18, lineHeight: 1.6 }}>
                {errorByField.academic_safety.map((m, i) => <li key={i}>{m}</li>)}
              </ul>
            </div>
          )}

          {/* Warnings panel (non-blocking) */}
          {showWarnings && (
            <div style={{
              padding: 12, borderRadius: 10,
              background: 'rgba(184, 137, 64, 0.12)',
              border: '1px solid var(--clr-gold)',
              marginBottom: 12, fontSize: 13,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <strong>ข้อสังเกต ({validation.warnings.length})</strong>
                <button
                  type="button"
                  onClick={() => setWarningsDismissed(true)}
                  aria-label="ปิดข้อสังเกต"
                  style={{
                    background: 'transparent', border: 'none',
                    color: 'var(--clr-ink-soft)', cursor: 'pointer', fontSize: 16,
                  }}
                >×</button>
              </div>
              <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.6 }}>
                {validation.warnings.map((w, i) => <li key={i}>{w.msg}</li>)}
              </ul>
            </div>
          )}

          {/* Submit error */}
          {submitError && (
            <div style={{
              padding: 12, borderRadius: 10, background: 'var(--clr-rose-soft)',
              border: '1px solid var(--clr-rose)', marginBottom: 12, fontSize: 13,
            }}>
              ❌ {submitError}
            </div>
          )}

          {/* Ready banner */}
          <div style={{
            padding: 10, borderRadius: 10,
            background: validation.canSubmit ? 'rgba(74, 107, 74, 0.12)' : 'rgba(184, 137, 64, 0.10)',
            border: `1px solid ${validation.canSubmit ? 'var(--clr-sage)' : 'var(--clr-gold)'}`,
            marginBottom: 14, fontSize: 13, textAlign: 'center',
          }}>
            {validation.canSubmit
              ? 'พร้อมส่ง — ทุกอย่างผ่าน auto-screen'
              : `ยังมี ${validation.errors.length} จุดที่ต้องแก้ก่อนส่ง`}
          </div>

          <button
            type="submit"
            className="vmx-btn vmx-btn-primary"
            style={{
              width: '100%', justifyContent: 'center',
              padding: '14px', fontSize: 15,
              opacity: validation.canSubmit && !submitting ? 1 : 0.55,
              cursor: validation.canSubmit && !submitting ? 'pointer' : 'not-allowed',
            }}
            disabled={!validation.canSubmit || submitting}
          >
            {submitting ? 'กำลังส่ง...' : '📨 ส่งคำถามเข้า review queue'}
          </button>
        </form>
      </div>

      {/* ─── My Submissions ─────────────────────────────────────── */}
      <div style={{ maxWidth: 600, margin: '28px auto 0' }}>
        <h2 style={{
          fontFamily: 'Fraunces, "Times New Roman", serif',
          fontSize: 20, marginBottom: 4,
        }}>
          คำถามที่ส่งล่าสุด
        </h2>
        <p style={{ fontSize: 12, color: 'var(--clr-ink-soft)', marginBottom: 14 }}>
          {mySubs.length > 0
            ? `${mySubs.length} รายการ, แตะเพื่อดูรายละเอียด`
            : loadingSubs ? 'กำลังโหลด...' : 'ยังไม่มีคำถามที่ส่ง — เริ่มส่งข้อแรกได้เลย ⬆️'}
        </p>

        {mySubs.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {mySubs.map((s) => {
              const meta = statusMeta(s.status);
              const isOpen = expandedId === s.id;
              const isPositive = s.status === 'approved' || s.status === 'published';
              const isNegative = s.status === 'screen_failed' || s.status === 'peer_failed' || s.status === 'rejected';
              const preview = (s.q_text || '').slice(0, 80) + ((s.q_text || '').length > 80 ? '…' : '');
              return (
                <div
                  key={s.id}
                  onClick={() => setExpandedId(isOpen ? null : s.id)}
                  style={{
                    ...CARD_BASE,
                    padding: 12,
                    cursor: 'pointer',
                    borderLeft: `4px solid ${meta.color}`,
                    transition: 'transform 0.1s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: 4,
                      fontSize: 11, padding: '2px 8px', borderRadius: 999,
                      background: `${meta.color}22`, color: meta.color, fontWeight: 600,
                    }}>
                      <span>{meta.icon}</span>
                      <span>{meta.label}</span>
                    </span>
                    {isPositive && <span style={{ color: 'var(--clr-sage)' }}>✓</span>}
                    <span style={{
                      marginLeft: 'auto', fontSize: 11,
                      color: 'var(--clr-ink-soft)',
                      fontFamily: '"JetBrains Mono", "IBM Plex Sans Thai", monospace',
                    }}>
                      {relTime(s.created_at)}
                    </span>
                  </div>
                  <div style={{ fontSize: 14, lineHeight: 1.5, marginBottom: 4 }}>
                    {preview || <em style={{ color: 'var(--clr-ink-soft)' }}>(no stem)</em>}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--clr-ink-soft)', fontFamily: '"JetBrains Mono", "IBM Plex Sans Thai", monospace' }}>
                    {s.subject || '—'}{s.topic ? `, ${s.topic}` : ''}
                  </div>

                  {/* Inline summary of failure reason */}
                  {isNegative && (s.rejection_reason || (Array.isArray(s.screen_log) && s.screen_log.length > 0)) && (
                    <div style={{
                      marginTop: 8, padding: 8, borderRadius: 6,
                      background: 'var(--clr-rose-soft)', fontSize: 12, lineHeight: 1.5,
                    }}>
                      {s.rejection_reason && <div>📌 {s.rejection_reason}</div>}
                      {Array.isArray(s.screen_log) && s.screen_log.slice(0, 2).map((line, i) => (
                        <div key={i} style={{ marginTop: 4 }}>• {typeof line === 'string' ? line : (line?.msg || JSON.stringify(line))}</div>
                      ))}
                      {Array.isArray(s.screen_log) && s.screen_log.length > 2 && (
                        <div style={{ marginTop: 4, fontStyle: 'italic' }}>+ อีก {s.screen_log.length - 2} ข้อ...</div>
                      )}
                    </div>
                  )}

                  {/* Expanded full Q + timestamps */}
                  {isOpen && (
                    <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid var(--clr-border)', fontSize: 13, lineHeight: 1.6 }}>
                      <div style={{ marginBottom: 8 }}>
                        <strong style={{ fontSize: 11, color: 'var(--clr-ink-soft)', textTransform: 'uppercase' }}>โจทย์เต็ม</strong>
                        <div style={{ marginTop: 4 }}>{s.q_text}</div>
                      </div>
                      <div style={{
                        fontSize: 11, color: 'var(--clr-ink-soft)',
                        fontFamily: '"JetBrains Mono", "IBM Plex Sans Thai", monospace', lineHeight: 1.8,
                      }}>
                        <div>created: {new Date(s.created_at).toLocaleString('th-TH')}</div>
                        {s.reviewed_at && <div>reviewed: {new Date(s.reviewed_at).toLocaleString('th-TH')}</div>}
                        {s.approved_at && <div>approved: {new Date(s.approved_at).toLocaleString('th-TH')}</div>}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="vmx-btn-row" style={{ marginTop: 24, marginBottom: 16 }}>
        <button className="vmx-btn vmx-btn-ghost" onClick={goHome}>← หน้าแรก</button>
      </div>
    </>
  );
}
