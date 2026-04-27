import { useState, useEffect, useMemo } from 'react';

// ============================================================
// SmartGrader — rubric-based self-grading without an LLM
// ============================================================
// Replaces the old SelfGradeHint card. Three panels stacked:
//
//   1) AUTO-ANALYSIS — three meters computed from the answer text
//      • Word count vs target/soft/hard caps
//      • Keyword coverage (q.keywords intersected with the answer)
//      • Paraphrase risk (longest verbatim chunks lifted from the
//        source passage, ≥6 consecutive words)
//
//   2) RUBRIC CHECKLIST — for engprof essays (15 pt = 7 + 5 + 3)
//      we render a per-criterion checkbox group; each item carries
//      its own point value. The total auto-totals as boxes get
//      ticked. For short answers we render a 0/1/2 slider per
//      bullet of q.rubric.
//
//   3) CONFIDENCE CALIBRATION — the user predicts their score
//      before going through the rubric. Once they submit a
//      prediction, the gap (and a running average across all the
//      essays they've graded) is shown. This is the cool gimmick
//      — students chronically over- or under-estimate, and seeing
//      the bias makes them recalibrate.
//
// All grading state is per-question in localStorage:
//   vmx-grade-<qid>  →  { checks, predicted, predictedSubmitted }
//
// A separate aggregate localStorage key tracks calibration across
// the user's whole writing-grade history:
//   vmx-grade-calibration  →  [{qid, predicted, actual, ts}]
// ============================================================

// Engprof essay rubric — Final's 15-pt scheme.
const ESSAY_RUBRIC = [
  { cat: 'Content', max: 7, color: 'var(--clr-sage)', items: [
    { label: 'Topic sentence paraphrases main idea', pts: 1 },
    { label: 'All major supporting details covered', pts: 3 },
    { label: 'Captures author\'s key argument/conclusion', pts: 1 },
    { label: 'No personal opinion or new info added', pts: 1 },
    { label: 'Cites source ("In the article by [Author]...")', pts: 1 },
  ]},
  { cat: 'Organization & Grammar', max: 5, color: 'var(--clr-gold)', items: [
    { label: 'Logical paragraph flow', pts: 2 },
    { label: 'Transitions used (However / Moreover / On the other hand)', pts: 1 },
    { label: 'Subject-verb / tense consistency', pts: 1 },
    { label: 'Spelling and punctuation acceptable', pts: 1 },
  ]},
  { cat: 'Paraphrasing', max: 3, color: '#5c6b7d', items: [
    { label: 'Synonyms used (not lifted vocabulary)', pts: 1 },
    { label: 'Sentence structure changed (not just word swap)', pts: 1 },
    { label: 'Source explicitly cited (in-text reference)', pts: 1 },
  ]},
];

const SHORT_RUBRIC = [
  { label: 'Main concept identified correctly', pts: 1 },
  { label: 'Specific terminology / detail included', pts: 1 },
];

// Strip punctuation and normalize whitespace for fuzzy matching.
// Keep Thai (฀-๿) so Thai keywords match Thai answers.
function normalize(s) {
  return ' ' + (s || '').toLowerCase().replace(/[^a-z0-9฀-๿\s]/g, ' ').replace(/\s+/g, ' ') + ' ';
}

// Word-level fuzzy match: keyword found if its normalized form
// appears as a substring of the answer with word boundaries on
// both sides. Also accept ±s for trivial plural/singular swap.
function keywordCoverage(answer, keywords) {
  if (!keywords?.length) return null;
  const ans = normalize(answer);
  const found = [], missing = [];
  keywords.forEach((kw) => {
    const k = normalize(kw).trim();
    if (!k) return;
    const variants = [' ' + k + ' ', ' ' + k + 's ', ' ' + k.replace(/s$/, '') + ' '];
    const hit = variants.some((v) => v.length > 3 && ans.includes(v));
    (hit ? found : missing).push(kw);
  });
  return { found, missing, pct: keywords.length ? Math.round((found.length / keywords.length) * 100) : 0 };
}

// Find longest runs of ≥minWords consecutive words from the
// passage that appear verbatim in the answer. Naïve O(n·m·k)
// but answers ≤200 words and passages ≤800 words make it cheap.
function copyDetector(passage, answer, minWords = 6) {
  if (!passage || !answer) return [];
  const aw = normalize(answer).trim().split(/\s+/).filter((x) => x.length > 1);
  const pw = normalize(passage).trim().split(/\s+/).filter((x) => x.length > 1);
  if (aw.length < minWords || pw.length < minWords) return [];
  const out = [];
  let i = 0;
  while (i <= aw.length - minWords) {
    let bestLen = 0;
    for (let j = 0; j <= pw.length - minWords; j++) {
      let k = 0;
      while (i + k < aw.length && j + k < pw.length && aw[i + k] === pw[j + k]) k++;
      if (k > bestLen) bestLen = k;
    }
    if (bestLen >= minWords) {
      out.push(aw.slice(i, i + bestLen).join(' '));
      i += bestLen;
    } else {
      i++;
    }
  }
  return out;
}

export default function SmartGrader({ q, userAnswer }) {
  const isEssay = q.type === 'essay';
  const ans = typeof userAnswer === 'string' ? userAnswer : '';
  const trimmedAns = ans.trim();
  const wordCount = trimmedAns ? trimmedAns.split(/\s+/).length : 0;
  const target = q.target_words || 150;
  const softMax = q.soft_max_words || 180;
  const hardMax = q.hard_max_words || 200;

  // Auto analyses
  const coverage = useMemo(() => keywordCoverage(ans, q.keywords), [ans, q.keywords]);
  const copied = useMemo(() => copyDetector(q.passage || '', ans, isEssay ? 6 : 4), [q.passage, ans, isEssay]);

  // Per-question saved state
  const storageKey = `vmx-grade-${q.id}`;
  const [checks, setChecks] = useState({});
  const [predicted, setPredicted] = useState('');
  const [predictedSubmitted, setPredictedSubmitted] = useState(false);
  const [shortGrade, setShortGrade] = useState({});

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) || '{}');
      setChecks(saved.checks || {});
      setShortGrade(saved.shortGrade || {});
      setPredicted(saved.predicted ?? '');
      setPredictedSubmitted(!!saved.predictedSubmitted);
    } catch {
      setChecks({}); setShortGrade({}); setPredicted(''); setPredictedSubmitted(false);
    }
  }, [storageKey]);

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify({ checks, shortGrade, predicted, predictedSubmitted }));
    } catch {}
  }, [storageKey, checks, shortGrade, predicted, predictedSubmitted]);

  // Build a flat list of rubric items so totals are easy to compute.
  // Each item gets a stable key (cat-itemLabel) so checks survive renders.
  const flatItems = useMemo(() => {
    if (isEssay) {
      const items = [];
      ESSAY_RUBRIC.forEach((g) => g.items.forEach((it) => items.push({ key: `${g.cat}::${it.label}`, ...it, cat: g.cat, color: g.color })));
      return items;
    }
    return [];
  }, [isEssay]);

  const maxScore = isEssay
    ? ESSAY_RUBRIC.reduce((s, g) => s + g.max, 0)
    : SHORT_RUBRIC.reduce((s, x) => s + x.pts, 0);

  // Word-count penalty applies only to essays.
  const wcPenalty = isEssay
    ? (wordCount > hardMax ? 2 : wordCount > softMax ? 1 : 0)
    : 0;

  // Tally rubric points
  const rubricScore = isEssay
    ? flatItems.reduce((s, it) => s + (checks[it.key] ? it.pts : 0), 0)
    : SHORT_RUBRIC.reduce((s, it, i) => s + (Number(shortGrade[i]) || 0), 0);

  const total = Math.max(0, rubricScore - wcPenalty);
  const pct = maxScore > 0 ? Math.round((total / maxScore) * 100) : 0;

  // ── Confidence calibration ──
  // When the user enters a prediction and clicks "เริ่มตรวจ", we
  // record both the prediction and the eventual rubric total to a
  // shared list keyed by qid. Re-grading the same question updates
  // its entry rather than appending so the average stays stable.
  const submitPrediction = () => {
    const n = parseFloat(predicted);
    if (!Number.isFinite(n) || n < 0 || n > maxScore) return;
    setPredictedSubmitted(true);
  };

  // Once predictedSubmitted becomes true and the rubric has been
  // touched at least once, persist the calibration entry. Updating
  // an existing entry keeps the running average honest.
  useEffect(() => {
    if (!predictedSubmitted) return;
    const touched = Object.keys(checks).length > 0 || Object.keys(shortGrade).length > 0;
    if (!touched) return;
    try {
      const arr = JSON.parse(localStorage.getItem('vmx-grade-calibration') || '[]');
      const idx = arr.findIndex((e) => e.qid === q.id);
      const entry = { qid: q.id, predicted: parseFloat(predicted), actual: total, max: maxScore, ts: Date.now() };
      if (idx >= 0) arr[idx] = entry; else arr.push(entry);
      // Cap history at 50 most recent
      const trimmed = arr.slice(-50);
      localStorage.setItem('vmx-grade-calibration', JSON.stringify(trimmed));
    } catch {}
  }, [predictedSubmitted, checks, shortGrade, total, predicted, q.id, maxScore]);

  const calibration = useMemo(() => {
    try {
      const arr = JSON.parse(localStorage.getItem('vmx-grade-calibration') || '[]');
      if (arr.length < 2) return null;
      const diffs = arr.map((e) => e.predicted - e.actual);
      const mean = diffs.reduce((s, x) => s + x, 0) / diffs.length;
      const absMean = diffs.reduce((s, x) => s + Math.abs(x), 0) / diffs.length;
      return { count: arr.length, bias: mean, mae: absMean };
    } catch {
      return null;
    }
  }, [predictedSubmitted, total]);

  // ── Render ──
  return (
    <div style={{ marginTop: 12, padding: 12, borderRadius: 12, background: 'var(--clr-bg)', border: '1px solid var(--clr-border)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10, flexWrap: 'wrap', gap: 8 }}>
        <div style={{ fontSize: 11, fontFamily: 'JetBrains Mono, monospace', color: 'var(--clr-ink-soft)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>
          🎯 Smart Self-Grade
        </div>
        <ScoreBadge total={total} max={maxScore} pct={pct} touched={Object.keys(checks).length + Object.keys(shortGrade).length > 0} />
      </div>

      {/* ── Auto-analysis dashboard ── */}
      <AutoAnalysis
        wordCount={wordCount} target={target} softMax={softMax} hardMax={hardMax}
        coverage={coverage}
        copied={copied}
        hasAnswer={!!trimmedAns}
        isEssay={isEssay}
      />

      {/* ── Confidence calibration prompt ── */}
      {trimmedAns && (
        <CalibrationBlock
          predicted={predicted} setPredicted={setPredicted}
          submitted={predictedSubmitted} onSubmit={submitPrediction}
          maxScore={maxScore}
          actual={total} calibration={calibration}
          touched={Object.keys(checks).length + Object.keys(shortGrade).length > 0}
        />
      )}

      {/* ── Rubric checklist ── */}
      {trimmedAns && (
        isEssay ? (
          <EssayRubric checks={checks} setChecks={setChecks} wcPenalty={wcPenalty} />
        ) : (
          <ShortRubric grade={shortGrade} setGrade={setShortGrade} rubric={q.rubric} />
        )
      )}

      {!trimmedAns && (
        <div style={{ padding: 12, fontSize: 12, color: 'var(--clr-ink-soft)', fontStyle: 'italic', textAlign: 'center' }}>
          ⏭ ข้อนี้ยังไม่ได้ตอบ — ข้ามไปข้อถัดไปได้
        </div>
      )}
    </div>
  );
}

// ── Score badge in the header ──
function ScoreBadge({ total, max, pct, touched }) {
  if (!touched) return (
    <div style={{ fontSize: 11, padding: '4px 10px', borderRadius: 999, background: 'var(--clr-surface-2)', color: 'var(--clr-ink-soft)', fontFamily: 'JetBrains Mono, monospace' }}>
      ติ๊กเกณฑ์เพื่อให้คะแนน
    </div>
  );
  const color = pct >= 75 ? 'var(--clr-sage)' : pct >= 50 ? 'var(--clr-gold)' : 'var(--clr-rose)';
  return (
    <div style={{ display: 'inline-flex', alignItems: 'baseline', gap: 6, padding: '4px 12px', borderRadius: 999, background: color, color: '#fff', fontFamily: 'JetBrains Mono, monospace', fontWeight: 700 }}>
      <span style={{ fontSize: 16 }}>{total}</span>
      <span style={{ fontSize: 11, opacity: 0.85 }}>/ {max}</span>
      <span style={{ fontSize: 10, opacity: 0.85 }}>· {pct}%</span>
    </div>
  );
}

// ── Auto-analysis (3 meters) ──
function AutoAnalysis({ wordCount, target, softMax, hardMax, coverage, copied, hasAnswer, isEssay }) {
  if (!hasAnswer) return null;
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 8, marginBottom: 12 }}>
      {/* Word count */}
      {isEssay && (
        <Meter
          icon="📊"
          label="Word count"
          value={`${wordCount} / ${target}`}
          status={
            wordCount > hardMax ? { color: 'rose', text: `เกิน ${hardMax} (-2 pts)` } :
            wordCount > softMax ? { color: 'gold', text: `เกิน ${softMax} (-1 pt)` } :
            wordCount < target * 0.6 ? { color: 'rose', text: `สั้นเกินไป` } :
            wordCount > target * 1.0 ? { color: 'gold', text: `ใกล้ขีด` } :
            { color: 'sage', text: `OK` }
          }
        />
      )}

      {/* Keyword coverage */}
      {coverage && (
        <Meter
          icon="🔑"
          label="Keyword coverage"
          value={`${coverage.found.length}/${coverage.found.length + coverage.missing.length}`}
          status={
            coverage.pct >= 80 ? { color: 'sage', text: `${coverage.pct}% — ครบ` } :
            coverage.pct >= 50 ? { color: 'gold', text: `${coverage.pct}% — พอใช้` } :
            { color: 'rose', text: `${coverage.pct}% — ไม่ครบ` }
          }
          detail={coverage.missing.length > 0 ? (
            <div style={{ fontSize: 10, marginTop: 4 }}>
              <span style={{ color: 'var(--clr-ink-soft)' }}>ขาด:</span>{' '}
              {coverage.missing.slice(0, 4).map((m, i) => (
                <span key={i} style={{ display: 'inline-block', padding: '1px 6px', margin: '2px 3px 0 0', borderRadius: 999, background: 'var(--clr-rose-soft, rgba(184, 88, 88, 0.12))', color: 'var(--clr-rose)', fontSize: 10 }}>{m}</span>
              ))}
              {coverage.missing.length > 4 && <span style={{ color: 'var(--clr-ink-soft)' }}>+{coverage.missing.length - 4}</span>}
            </div>
          ) : null}
        />
      )}

      {/* Paraphrase risk */}
      <Meter
        icon="📝"
        label="Paraphrase check"
        value={copied.length === 0 ? 'OK' : `${copied.length} chunk${copied.length > 1 ? 's' : ''}`}
        status={
          copied.length === 0 ? { color: 'sage', text: 'ไม่ copy passage' } :
          copied.length === 1 ? { color: 'gold', text: 'พบ 1 ช่วง — เสี่ยง' } :
          { color: 'rose', text: 'copy เยอะ — แก้ paraphrase' }
        }
        detail={copied.length > 0 ? (
          <div style={{ fontSize: 10, marginTop: 4, fontStyle: 'italic', color: 'var(--clr-rose)' }}>
            "{copied[0].slice(0, 50)}{copied[0].length > 50 ? '...' : ''}"
          </div>
        ) : null}
      />
    </div>
  );
}

function Meter({ icon, label, value, status, detail }) {
  const colorMap = {
    sage: { bg: 'rgba(74, 107, 74, 0.10)', border: 'var(--clr-sage)', ink: 'var(--clr-sage)' },
    gold: { bg: 'rgba(184, 137, 64, 0.10)', border: 'var(--clr-gold)', ink: 'var(--clr-gold)' },
    rose: { bg: 'rgba(184, 88, 88, 0.10)', border: 'var(--clr-rose)', ink: 'var(--clr-rose)' },
  };
  const c = colorMap[status?.color] || colorMap.sage;
  return (
    <div style={{ padding: 10, borderRadius: 10, background: c.bg, border: `1px solid ${c.border}` }}>
      <div style={{ fontSize: 10, fontFamily: 'JetBrains Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--clr-ink-soft)', marginBottom: 4 }}>
        {icon} {label}
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
        <span style={{ fontSize: 18, fontWeight: 700, color: 'var(--clr-ink)' }}>{value}</span>
        <span style={{ fontSize: 11, color: c.ink, fontWeight: 600 }}>{status?.text}</span>
      </div>
      {detail}
    </div>
  );
}

// ── Confidence calibration block ──
function CalibrationBlock({ predicted, setPredicted, submitted, onSubmit, maxScore, actual, calibration, touched }) {
  if (!submitted) {
    return (
      <div style={{ marginBottom: 12, padding: 10, borderRadius: 10, background: 'rgba(74, 107, 74, 0.06)', border: '1px dashed var(--clr-sage)' }}>
        <div style={{ fontSize: 11, fontFamily: 'JetBrains Mono, monospace', color: 'var(--clr-sage)', fontWeight: 700, marginBottom: 6 }}>
          🔮 ทายคะแนนตัวเองก่อน
        </div>
        <div style={{ fontSize: 12, color: 'var(--clr-ink)', lineHeight: 1.5, marginBottom: 8 }}>
          คาดว่าคำตอบจะได้กี่คะแนน (0-{maxScore}) ก่อนตรวจตาม rubric · เก็บสถิติ self-calibration ระยะยาว
        </div>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
          <input
            type="number" min={0} max={maxScore} step={0.5}
            value={predicted}
            onChange={(e) => setPredicted(e.target.value)}
            placeholder={`0-${maxScore}`}
            style={{ width: 80, padding: '6px 10px', borderRadius: 8, border: '1px solid var(--clr-border)', background: 'var(--clr-bg)', color: 'var(--clr-ink)', fontFamily: 'JetBrains Mono, monospace', fontSize: 14 }}
          />
          <button
            onClick={onSubmit}
            disabled={!predicted}
            style={{ padding: '6px 14px', borderRadius: 8, border: 'none', background: predicted ? 'var(--clr-sage)' : 'var(--clr-surface-2)', color: '#fff', fontSize: 12, cursor: predicted ? 'pointer' : 'not-allowed', fontWeight: 600 }}
          >
            ทาย → เริ่มตรวจ
          </button>
        </div>
      </div>
    );
  }

  const gap = touched ? actual - parseFloat(predicted) : null;
  return (
    <div style={{ marginBottom: 12, padding: 10, borderRadius: 10, background: 'rgba(74, 107, 74, 0.06)', border: '1px solid var(--clr-sage)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
        <div>
          <div style={{ fontSize: 11, fontFamily: 'JetBrains Mono, monospace', color: 'var(--clr-sage)', fontWeight: 700, marginBottom: 4 }}>
            🔮 Prediction
          </div>
          <div style={{ fontSize: 13, color: 'var(--clr-ink)' }}>
            คาดว่า <strong>{predicted}</strong>/{maxScore}
            {touched && (
              <>
                {' → ตรวจจริง '}
                <strong>{actual}/{maxScore}</strong>
                {' '}
                <span style={{
                  color: Math.abs(gap) <= 1 ? 'var(--clr-sage)' : Math.abs(gap) <= 2 ? 'var(--clr-gold)' : 'var(--clr-rose)',
                  fontWeight: 600,
                }}>
                  ({gap > 0 ? '+' : ''}{gap.toFixed(1)})
                </span>
              </>
            )}
          </div>
        </div>
        {calibration && calibration.count >= 3 && (
          <div style={{ fontSize: 11, color: 'var(--clr-ink-soft)', textAlign: 'right' }}>
            <div>Avg bias (n={calibration.count}):</div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', color: Math.abs(calibration.bias) < 0.5 ? 'var(--clr-sage)' : 'var(--clr-gold)' }}>
              {calibration.bias > 0 ? `แม่นยำ มากเกิน +${calibration.bias.toFixed(1)} pts` : calibration.bias < -0.1 ? `ถ่อมตัว เกิน ${calibration.bias.toFixed(1)} pts` : 'แม่นมาก!'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Essay rubric checklist ──
function EssayRubric({ checks, setChecks, wcPenalty }) {
  const toggle = (key) => setChecks((c) => ({ ...c, [key]: !c[key] }));
  return (
    <div>
      <div style={{ fontSize: 11, fontFamily: 'JetBrains Mono, monospace', color: 'var(--clr-ink-soft)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6, fontWeight: 700 }}>
        📋 Rubric checklist
      </div>
      {ESSAY_RUBRIC.map((g) => {
        const earned = g.items.reduce((s, it) => s + (checks[`${g.cat}::${it.label}`] ? it.pts : 0), 0);
        return (
          <div key={g.cat} style={{ marginBottom: 8, padding: 10, borderRadius: 10, background: 'var(--clr-surface-2)', border: '1px solid var(--clr-border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
              <strong style={{ fontSize: 13, color: g.color }}>{g.cat}</strong>
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: 'var(--clr-ink)', fontWeight: 600 }}>
                {earned} / {g.max} pts
              </span>
            </div>
            {g.items.map((it) => {
              const k = `${g.cat}::${it.label}`;
              const on = !!checks[k];
              return (
                <label key={k} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: '4px 0', cursor: 'pointer', fontSize: 12, lineHeight: 1.45 }}>
                  <input
                    type="checkbox"
                    checked={on}
                    onChange={() => toggle(k)}
                    style={{ marginTop: 2, accentColor: g.color, cursor: 'pointer' }}
                  />
                  <span style={{ flex: 1, color: on ? 'var(--clr-ink)' : 'var(--clr-ink-soft)', textDecoration: on ? 'none' : 'none' }}>
                    {it.label}
                  </span>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'var(--clr-ink-soft)', minWidth: 32, textAlign: 'right' }}>
                    +{it.pts}
                  </span>
                </label>
              );
            })}
          </div>
        );
      })}
      {wcPenalty > 0 && (
        <div style={{ padding: 8, borderRadius: 8, background: 'rgba(184, 88, 88, 0.10)', border: '1px solid var(--clr-rose)', fontSize: 12, color: 'var(--clr-rose)' }}>
          ⚠️ Word-count penalty: −{wcPenalty} pts
        </div>
      )}
    </div>
  );
}

// ── Short answer rubric ──
function ShortRubric({ grade, setGrade, rubric }) {
  const set = (i, v) => setGrade((g) => ({ ...g, [i]: v }));
  return (
    <div>
      <div style={{ fontSize: 11, fontFamily: 'JetBrains Mono, monospace', color: 'var(--clr-ink-soft)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6, fontWeight: 700 }}>
        📋 Self-grade
      </div>
      {SHORT_RUBRIC.map((it, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 8px', marginBottom: 4, borderRadius: 8, background: 'var(--clr-surface-2)', border: '1px solid var(--clr-border)' }}>
          <span style={{ fontSize: 12, flex: 1 }}>{it.label}</span>
          <div style={{ display: 'flex', gap: 4 }}>
            {[0, 0.5, 1].map((v) => (
              <button
                key={v}
                onClick={() => set(i, v)}
                style={{
                  width: 32, height: 28, borderRadius: 6,
                  border: '1px solid var(--clr-border)',
                  background: (Number(grade[i]) || 0) === v ? 'var(--clr-sage)' : 'var(--clr-bg)',
                  color: (Number(grade[i]) || 0) === v ? '#fff' : 'var(--clr-ink)',
                  fontSize: 11, fontFamily: 'JetBrains Mono, monospace',
                  cursor: 'pointer',
                }}
              >{v}</button>
            ))}
          </div>
        </div>
      ))}
      {rubric && (
        <div style={{ marginTop: 6, fontSize: 11, color: 'var(--clr-ink-soft)', fontStyle: 'italic' }}>
          📋 จาก KEY: {rubric}
        </div>
      )}
    </div>
  );
}
