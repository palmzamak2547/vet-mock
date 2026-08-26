import { useRef, useState, useEffect, useMemo } from 'react';
import { subjectText } from '../hooks/utils.js';
import { SUBJECTS } from '../data/questions.js';
import { RichText } from '../lib/richtext.jsx';
import TermLinkedRichText from './TermLinkedRichText.jsx';
import { safeImageUrl } from '../lib/safe-url.js';
import SmartPassage from './SmartPassage.jsx';
import NavIcon from './NavIcon.jsx';
import ZoomableImage from './ZoomableImage.jsx';
import VoiceInputButton from './VoiceInputButton.jsx';
import { unlockAudio } from '../lib/audio-unlock.js';
import QSourceChip from './QSourceChip.jsx';
import PinButton from './PinButton.jsx';
import { promptDialog } from '../lib/dialog.js';

// Strip RichText markup so TTS reads naturally — markdown bold/italic
// markers and HTML entities sound weird as speech.
function stripForSpeech(s) {
  if (!s) return '';
  return String(s)
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/_([^_]+)_/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/[#>~]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// Q-flag persistence — stored in localStorage as { 'subject:id': { reason, ts } }.
// Cross-machine sync needs Supabase schema; deferred to a future session.
const FLAGS_KEY = 'vmx-q-flags';
// ─── Per-question stable option shuffle ────────────────────────────
// Palm lint audit 2026-05-20: `npm run lint:questions` flagged 17 topic
// groups with severe position bias (e.g. comp-repro-pregnancy 100% at
// index 0). Rather than rewrite every Q manually, we shuffle option
// order at render time so the correct-answer position is randomized.
//
// Requirements:
//  • Stable per Q — same shuffle every render so the user doesn't see
//    options jump after re-render / re-mount.
//  • Stable across navigation — answer index is mapped through the
//    permutation so `answers[q.id]` still stores the ORIGINAL index
//    (compatible with isCorrect / ResultsView / ReviewView untouched).
//  • Pure of q.id — same Q always gets same display order for a given
//    page-load (no jitter), but DIFFERENT users on DIFFERENT loads see
//    different orders (mulberry32 seeded by `(q.id ^ session-seed)`).
//
// Session seed = once per page-load in module scope, so a user revisiting
// the same Q within a session sees the same order; a new tab reseeds.
const SESSION_SEED = (() => {
  try {
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
      const buf = new Uint32Array(1);
      crypto.getRandomValues(buf);
      return buf[0];
    }
  } catch {}
  return ((Date.now() & 0xffffffff) ^ (Math.random() * 0xffffffff)) >>> 0;
})();

function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Derives a stable display permutation for the given question.
 * Returns { displayOptions, displayToOriginal, originalToDisplay }
 * where displayOptions is the rendered array and the two index maps
 * translate between visual-order and source-order indices.
 *
 * Honors `q.noShuffle === true` for questions whose options have a
 * meaningful order (e.g. "All of the above" / chronological steps /
 * Likert scales). Caller can opt out per-question without disabling
 * the global behavior.
 */
function getShuffledOptions(q) {
  const options = Array.isArray(q?.options) ? q.options : [];
  if (options.length <= 1 || q?.noShuffle === true) {
    const identity = options.map((_, i) => i);
    return {
      displayOptions: options.slice(),
      displayToOriginal: identity,
      originalToDisplay: identity,
    };
  }
  // Detect "All/None of the above" by text — keep those pinned to the
  // bottom even when shuffling the rest.
  const TAIL_RE = /^(?:ถูก(?:ทั้ง|ทุก)|ผิด(?:ทั้ง|ทุก)|all of the above|none of the above|ทั้ง[ก-ฮa-z]+|ข้อ\s*[a-zก-ฮ]\s*และ)/i;
  const tailIndices = [];
  const headIndices = [];
  for (let i = 0; i < options.length; i++) {
    const txt = String(options[i] || '').trim();
    if (TAIL_RE.test(txt)) tailIndices.push(i);
    else headIndices.push(i);
  }
  // Seed: (q.id ^ session) so a given user sees consistent order for a
  // question across a session, but two users on the same Q see different
  // orders. Falls back to subject:id hash if id is missing.
  const idNum = Number.isFinite(q?.id)
    ? q.id
    : Array.from(String((q?.subject || '') + ':' + (q?.id || ''))).reduce(
        (h, ch) => ((h * 31) + ch.charCodeAt(0)) >>> 0,
        0
      );
  const rand = mulberry32((idNum ^ SESSION_SEED) >>> 0);
  // Fisher-Yates on the HEAD only; tails preserved.
  const shuffledHead = headIndices.slice();
  for (let i = shuffledHead.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [shuffledHead[i], shuffledHead[j]] = [shuffledHead[j], shuffledHead[i]];
  }
  const displayToOriginal = shuffledHead.concat(tailIndices);
  const originalToDisplay = new Array(options.length);
  for (let d = 0; d < displayToOriginal.length; d++) {
    originalToDisplay[displayToOriginal[d]] = d;
  }
  const displayOptions = displayToOriginal.map((origIdx) => options[origIdx]);
  return { displayOptions, displayToOriginal, originalToDisplay };
}

function readFlags() {
  try { return JSON.parse(window.localStorage.getItem(FLAGS_KEY) || '{}'); } catch { return {}; }
}
function writeFlags(map) {
  try { window.localStorage.setItem(FLAGS_KEY, JSON.stringify(map)); } catch {}
}

export default function QuestionComponent({ currentQ, currentAnswer, answerCurrent, isBookmarked, toggleBookmark, note, onNoteChange, showNote, setShowNote, revealAnswer }) {
  const compoundId = (currentQ?.subject || '?') + ':' + currentQ?.id;
  const figureSrc = safeImageUrl(currentQ?.image || currentQ?.imagePath);
  const figureAlt = currentQ?.imageAlt
    || `ภาพประกอบข้อ ${currentQ?.id || ''} วิชา ${currentQ?.subject || ''}`.trim();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [flagState, setFlagState] = useState(() => readFlags()[compoundId] || null);

  // Reset flag display when navigating to a new Q
  useEffect(() => { setFlagState(readFlags()[compoundId] || null); }, [compoundId]);

  // Stop speech + cleanup when component unmounts or Q changes. The
  // controller flag lets in-flight `speakQuestion` bail between chunks
  // even if a user mashes 🔊 on a new Q before the previous finished.
  const speakControllerRef = useRef({ cancelled: false });
  const ttsModuleRef = useRef(null);
  useEffect(() => {
    return () => {
      speakControllerRef.current.cancelled = true;
      ttsModuleRef.current?.cancelSpeech?.();
      setIsSpeaking(false);
    };
  }, [currentQ?.id]);

  const speakQ = async () => {
    // CRITICAL: prime audio synchronously BEFORE any await. iOS Safari
    // (and stricter browsers) require .play() to happen inside a user
    // gesture; speakQuestion() crosses an `await` boundary which would
    // otherwise lose the gesture context and silently block playback.
    unlockAudio();

    if (isSpeaking) {
      // Toggle off — abort the in-flight chain and cancel the queue
      speakControllerRef.current.cancelled = true;
      ttsModuleRef.current?.cancelSpeech?.();
      setIsSpeaking(false);
      return;
    }
    // Fresh controller per speak action
    const controller = { cancelled: false };
    speakControllerRef.current = controller;
    const stem = stripForSpeech(currentQ.q || '');
    const options = Array.isArray(currentQ.options)
      ? currentQ.options.map((o) => stripForSpeech(o))
      : [];
    try {
      // TTS is an optional feature. Keep its speech/IndexedDB providers out
      // of the core exam chunk and load them only after an explicit tap.
      const tts = await import('../lib/tts.js');
      ttsModuleRef.current = tts;
      if (controller.cancelled) return;
      tts.speakQuestion({
        stem,
        options,
        controller,
        onStart: () => setIsSpeaking(true),
        onEnd: () => { if (!controller.cancelled) setIsSpeaking(false); },
      });
    } catch {
      if (!controller.cancelled) setIsSpeaking(false);
    }
  };

  const toggleFlag = async () => {
    const map = readFlags();
    if (map[compoundId]) {
      delete map[compoundId];
      writeFlags(map);
      setFlagState(null);
    } else {
      const reason = await promptDialog({
        title: 'แจ้งปัญหาข้อนี้',
        body: 'กรอกรายละเอียดสั้นๆ เช่น เฉลยผิด, ภาษางง, ตัวเลือกซ้ำ',
        placeholder: 'อธิบายสั้นๆ',
        maxLength: 200,
        multiline: true,
        confirmLabel: 'แจ้งปัญหา',
      });
      if (!reason || !reason.trim()) return;
      const entry = { reason: reason.trim().slice(0, 200), ts: Date.now() };
      map[compoundId] = entry;
      writeFlags(map);
      setFlagState(entry);
    }
  };

  // Passage panel (for reading-comprehension questions) — handled by
  // SmartPassage component (see ./SmartPassage.jsx). It owns its own
  // open/closed state, highlight + pen overlays, and persistence.
  // We just hold a ref so the mobile FAB can scroll the passage into
  // view when the user taps "📄 Passage".
  const passageRef = useRef(null);

  // Word count for essay-type writing questions
  const essayText = (currentQ.type === 'essay' && typeof currentAnswer === 'string') ? currentAnswer : '';
  const essayWords = essayText.trim() ? essayText.trim().split(/\s+/).length : 0;
  const target = currentQ.target_words || 150;
  const softMax = currentQ.soft_max_words || 180;
  const hardMax = currentQ.hard_max_words || 200;

  // ─── Instant feedback (โหมดฝึก) ────────────────────────────────
  // When `revealAnswer` is on (practice modes only — ExamView never
  // sets it in exam mode), choice questions reveal their verdict the
  // moment they are answered: correct option glows green, a wrong pick
  // glows red and locks, and q.explain shows inline. Fill/match/short/
  // essay keep submit-time grading — revealing while half-typing a
  // blank would just flash misleading ✗ marks.
  const mcqRevealed = Boolean(revealAnswer)
    && currentQ.type === 'mcq'
    && typeof currentAnswer === 'number';
  const tfRevealed = Boolean(revealAnswer)
    && currentQ.type === 'tf'
    && (currentAnswer === true || currentAnswer === false);
  const tfOk = tfRevealed && currentAnswer === currentQ.answer;
  const mcqOk = mcqRevealed && currentAnswer === currentQ.answer;
  const essayBarColor =
    essayWords === 0 ? 'var(--clr-border)' :
    essayWords > hardMax ? 'var(--clr-rose)' :
    essayWords > softMax ? 'var(--clr-gold)' :
    'var(--clr-sage)';

  // FAB action — smooth scroll passage into view. SmartPassage manages
  // open/closed itself; we don't need to force it open from here.
  const focusPassage = () => {
    requestAnimationFrame(() => {
      try {
        passageRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } catch {
        passageRef.current?.scrollIntoView();
      }
    });
  };

  // Header (bookmark + note + badge + image) renders at top regardless
  // of layout. Below it, when a passage exists, the passage and the
  // question content split into a 2-column grid on wide screens (CSS
  // class `vmx-q-with-passage` does the responsive switch — see
  // styles.js). On narrow screens they stack as before, plus a FAB
  // appears for one-tap "back to passage" access.
  const passageBlock = currentQ.passage && (
    <div ref={passageRef} className="vmx-q-passage-pane">
      <SmartPassage
        text={currentQ.passage}
        title={currentQ.passage_title}
        defaultOpen={true}
      />
    </div>
  );

  const contentBlock = (
    <div className="vmx-q-content-pane">
      <h2 className="vmx-qtext"><TermLinkedRichText text={currentQ.q} /></h2>

      {/* Data discrepancy flag — surfaces conflicts between past papers
          and current lecture content. See vault discrepancies.md +
          self-optimization rule 1d (hold to facts). */}
      {currentQ.flag && <FlagChip flag={currentQ.flag} />}

      {showNote && (
        <div className="vmx-note-panel">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
            <div style={{ fontSize: 12, color: 'var(--clr-ink-soft)', fontFamily: 'var(--vmx-mono)' }}>NOTE</div>
            <VoiceInputButton
              size={26}
              onAppend={(text) => {
                const cur = note || '';
                const sep = cur && !cur.endsWith(' ') && !cur.endsWith('\n') ? ' ' : '';
                onNoteChange((cur + sep + text).slice(0, 5000));
              }}
            />
          </div>
          <textarea className="vmx-note-textarea" aria-label="บันทึกส่วนตัวสำหรับข้อนี้" value={note || ''} onChange={(e) => onNoteChange(e.target.value.slice(0, 5000))} placeholder="จดโน้ตที่นี่..." maxLength={5000} />
        </div>
      )}

      {currentQ.type === 'mcq' && (
        <>
          <MCQOptions
            currentQ={currentQ}
            currentAnswer={currentAnswer}
            answerCurrent={answerCurrent}
            revealed={mcqRevealed}
          />
          {mcqRevealed && (
            <InstantFeedback
              ok={mcqOk}
              correctNode={Array.isArray(currentQ.options) && <RichText text={currentQ.options[currentQ.answer]} />}
              explain={currentQ.explain}
            />
          )}
        </>
      )}

      {currentQ.type === 'tf' && (() => {
        // Reveal classes mirror MCQOptions: the correct button glows
        // green, a wrong PICK glows red (an unpicked incorrect option
        // stays neutral); both lock once revealed.
        const tfClass = (isAnswer) => {
          if (!tfRevealed) return '';
          if (currentQ.answer === isAnswer) return 'reveal-correct';
          return currentAnswer === isAnswer ? 'reveal-wrong' : '';
        };
        const correctIsTrue = currentQ.answer === true;
        return (
          <>
            <div className="vmx-tf-row" role="group" aria-label="เลือกคำตอบ True หรือ False">
              <button
                type="button"
                aria-pressed={currentAnswer === true}
                aria-disabled={tfRevealed || undefined}
                className={`vmx-tf-btn ${currentAnswer === true ? 'selected-true' : ''} ${tfClass(true)}`}
                onClick={() => { if (tfRevealed) return; answerCurrent(true); }}
              >✓ True</button>
              <button
                type="button"
                aria-pressed={currentAnswer === false}
                aria-disabled={tfRevealed || undefined}
                className={`vmx-tf-btn ${currentAnswer === false ? 'selected-false' : ''} ${tfClass(false)}`}
                onClick={() => { if (tfRevealed) return; answerCurrent(false); }}
              >✗ False</button>
            </div>
            {tfRevealed && (
              <InstantFeedback
                ok={tfOk}
                correctNode={<>{correctIsTrue ? '✓ True' : '✗ False'}</>}
                explain={currentQ.explain}
              />
            )}
          </>
        );
      })()}

      {currentQ.type === 'fill' && (
        <div className="vmx-fill-row">
          {currentQ.blanks.map((_, i) => (
            <div key={i}>
              <label className="vmx-fill-label" htmlFor={`vmx-fill-${currentQ.subject}-${currentQ.id}-${i}`}>
                {currentQ.blanks.length > 1 ? `ช่องที่ ${i + 1}` : 'คำตอบ'}
              </label>
              <input id={`vmx-fill-${currentQ.subject}-${currentQ.id}-${i}`} type="text" className="vmx-fill-input" value={(currentAnswer && currentAnswer[i]) || ''}
                onChange={(e) => { const arr = currentAnswer ? [...currentAnswer] : []; arr[i] = e.target.value; answerCurrent(arr); }}
                placeholder={`เติมในช่อง ____ ${currentQ.blanks.length > 1 ? '(' + (i + 1) + ')' : ''}`} />
            </div>
          ))}
        </div>
      )}

      {currentQ.type === 'match' && (
        <div className="vmx-match-row">
          {currentQ.pairs.map((pair, i) => (
            <div key={i} className="vmx-match-item">
              <div className="vmx-match-left"><RichText text={pair.left} /></div>
              <select className="vmx-match-select" value={(currentAnswer && currentAnswer[i]) || ''}
                aria-label={`จับคู่รายการที่ ${i + 1}`}
                onChange={(e) => { const obj = currentAnswer ? { ...currentAnswer } : {}; obj[i] = e.target.value; answerCurrent(obj); }}>
                <option value="">— เลือก —</option>
                {currentQ.pairs.map((p, j) => <option key={j} value={p.right}>{p.right.replace(/\*\*/g, '').replace(/\*/g, '')}</option>)}
              </select>
            </div>
          ))}
        </div>
      )}

      {/* Short answer — free-form text input. Auto-grade does loose
          keyword matching against q.keywords; user can also self-grade
          or self-grade in Review since open-text grading is fuzzy. */}
      {currentQ.type === 'short' && (
        <div className="vmx-fill-row">
          <div className="vmx-fill-label" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
            <label htmlFor={`vmx-short-${currentQ.subject}-${currentQ.id}`}>Your answer (พิมพ์ตอบสั้นๆ)</label>
            <VoiceInputButton
              size={28}
              onAppend={(text) => {
                const cur = typeof currentAnswer === 'string' ? currentAnswer : '';
                const sep = cur && !cur.endsWith(' ') ? ' ' : '';
                answerCurrent((cur + sep + text).slice(0, 1000));
              }}
            />
          </div>
          <textarea
            id={`vmx-short-${currentQ.subject}-${currentQ.id}`}
            className="vmx-fill-input"
            value={typeof currentAnswer === 'string' ? currentAnswer : ''}
            onChange={(e) => answerCurrent(e.target.value.slice(0, 1000))}
            placeholder="เขียนคำตอบสั้นๆ (1-3 ประโยค) — กดไมค์เพื่อพูดได้"
            rows={3}
            style={{ minHeight: 70, fontFamily: 'inherit', resize: 'vertical', width: '100%', boxSizing: 'border-box', padding: 10 }}
            maxLength={1000}
          />
          <div style={{ marginTop: 4, fontSize: 11, color: 'var(--clr-ink-soft)', fontFamily: 'var(--vmx-mono)' }}>
            {(typeof currentAnswer === 'string' ? currentAnswer.length : 0)}/1000 chars
          </div>
        </div>
      )}

      {/* Essay / Summary — full writing question with live word counter.
          target_words / soft_max_words / hard_max_words drive the bar
          color (sage → gold → rose) so the user self-regulates length
          against the Final's penalty zones. */}
      {currentQ.type === 'essay' && (
        <div style={{ marginTop: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, marginBottom: 6 }}>
            <div className="vmx-fill-label" style={{ marginBottom: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
              <label htmlFor={`vmx-essay-${currentQ.subject}-${currentQ.id}`}>Your summary</label>
              <VoiceInputButton
                size={28}
                lang={(currentQ.passage_lang === 'en' || currentQ.lang === 'en') ? 'en-US' : 'th-TH'}
                onAppend={(text) => {
                  const cur = essayText || '';
                  const sep = cur && !cur.endsWith(' ') ? ' ' : '';
                  answerCurrent((cur + sep + text).slice(0, 5000));
                }}
              />
            </div>
            <div style={{ fontFamily: 'var(--vmx-mono)', fontSize: 12, color: 'var(--clr-ink-soft)' }}>
              <strong style={{ color: essayBarColor }}>{essayWords}</strong>
              <span> / target {target} words</span>
              {essayWords > hardMax && <span style={{ color: 'var(--clr-rose-text)', marginLeft: 8 }}>, −2 pts (เกิน {hardMax})</span>}
              {essayWords > softMax && essayWords <= hardMax && <span style={{ color: 'var(--clr-gold-text)', marginLeft: 8 }}>, −1 pt (เกิน {softMax})</span>}
            </div>
          </div>
          <textarea
            id={`vmx-essay-${currentQ.subject}-${currentQ.id}`}
            value={essayText}
            onChange={(e) => answerCurrent(e.target.value.slice(0, 5000))}
            placeholder={`เขียน summary ~${target} คำ — ใช้ paraphrasing techniques (เปลี่ยน synonyms, structure, ฯลฯ), จับ main idea + key supporting details, ห้ามใส่ opinion`}
            rows={12}
            maxLength={5000}
            style={{
              width: '100%', boxSizing: 'border-box',
              minHeight: 240, padding: 12, fontFamily: 'inherit', fontSize: 14, lineHeight: 1.6,
              border: '1px solid var(--clr-border)', borderRadius: 10, background: 'var(--clr-bg)', color: 'var(--clr-ink)',
              resize: 'vertical',
            }}
          />
          {/* Word-count bar (visual) */}
          <div style={{ marginTop: 8, height: 4, background: 'var(--clr-surface-2)', borderRadius: 999, overflow: 'hidden' }}>
            <div
              style={{
                height: '100%',
                width: `${Math.min(100, (essayWords / hardMax) * 100)}%`,
                background: essayBarColor,
                transition: 'width 0.2s, background 0.2s',
              }}
            />
          </div>
          <div style={{ marginTop: 6, fontSize: 11, color: 'var(--clr-ink-soft)', lineHeight: 1.5 }}>
            Target: <strong>{target}</strong> words, Soft cap: <strong>{softMax}</strong> (penalty −1), Hard cap: <strong>{hardMax}</strong> (penalty −2)
          </div>
        </div>
      )}

      {/* Trust layer — source / verified / examOrigin / flag.
          Collapsed by default to keep the card clean; tap to expand. */}
      <QSourceChip q={currentQ} />
    </div>
  );

  return (
    <div className="vmx-question-card">
      {/* One flex row instead of five independently absolute-positioned
          buttons. The old layout hard-coded right: 20 / 64 / 108 / 152 / 196 —
          a 44px pitch — while the 44px WCAG floor made each button 44px wide,
          so they touched on desktop; and the ≤640px rules moved only the first
          two to a 40px pitch, leaving the last three overlapping and out of
          line. Spacing now comes from `gap`, so size and spacing cannot
          disagree again. */}
      <div className="vmx-q-toolbar">
        <button type="button" aria-label="บันทึกข้อนี้" aria-pressed={isBookmarked} className={`vmx-bookmark-btn ${isBookmarked ? 'active' : ''}`} onClick={() => toggleBookmark(currentQ.id)} title="บันทึกข้อนี้ (B)">
          <NavIcon name="star" size={18} filled={isBookmarked} />
        </button>
        <button type="button" aria-label="เปิดโน้ตของข้อนี้" aria-expanded={showNote} className={`vmx-note-btn ${note ? 'has-note' : ''}`} onClick={() => setShowNote(!showNote)} title="โน้ตของข้อนี้ (N)">
          <NavIcon name="note" size={18} filled={Boolean(note)} />
        </button>
        {/* Voice TTS — reads Q + options aloud (Web Speech API, no lib).
            Click again while speaking to stop. */}
        <button
          type="button"
          aria-label={isSpeaking ? 'หยุดอ่านออกเสียง' : 'อ่านคำถามออกเสียง'}
          aria-pressed={isSpeaking}
          className={`vmx-note-btn ${isSpeaking ? 'has-note' : ''}`}
          onClick={speakQ}
          title={isSpeaking ? 'หยุดอ่าน' : 'อ่านออกเสียง'}
        >
          <NavIcon name={isSpeaking ? 'speaker-off' : 'speaker'} size={18} />
        </button>
        {/* Q quality flag — local-only for now (Supabase schema TBD). */}
        <button
          type="button"
          aria-label={flagState ? `ยกเลิกการแจ้งปัญหา: ${flagState.reason}` : 'แจ้งปัญหาข้อนี้'}
          aria-pressed={Boolean(flagState)}
          className={`vmx-note-btn ${flagState ? 'has-note' : ''}`}
          onClick={toggleFlag}
          title={flagState ? `ยกเลิกการแจ้งปัญหา: ${flagState.reason}` : 'แจ้งปัญหาข้อนี้'}
        >
          <NavIcon name="flag" size={18} filled={Boolean(flagState)} />
        </button>
        {/* Pin → adds this Q to the personal Pinboard. */}
        {/* Not `compact`: its 36px inline size sat next to four 44px controls,
            so the row read as uneven — and 44px is the touch floor anyway. */}
        <PinButton
          type="question"
          payload={{ subject: currentQ?.subject, id: currentQ?.id, stem: (currentQ?.q || '').slice(0, 80) }}
          label={(currentQ?.q || '').slice(0, 60)}
        />
      </div>

      <div className="vmx-qtype-badge">
        {/* Thai, like the rest of the card — this chip sits directly above a
            Thai stem and a Thai subject name. */}
        {currentQ.type === 'mcq' && 'ปรนัย'}
        {currentQ.type === 'tf' && 'ถูก-ผิด'}
        {currentQ.type === 'fill' && 'เติมคำ'}
        {currentQ.type === 'match' && 'จับคู่'}
        {currentQ.type === 'short' && 'ตอบสั้น'}
        {currentQ.type === 'essay' && 'เขียนบรรยาย'}
        {(() => {
          const subj = SUBJECTS.find((s) => s.id === currentQ.subject);
          const topic = currentQ.topic && subj?.topics?.find((t) => t.id === currentQ.topic);
          return (
            <>
              {', '}{subj?.name || currentQ.subject}
              {topic && <>, <span style={{ color: subjectText(subj?.color) }}>{topic.icon} {topic.label.replace(/^คาบ\s*\d+(-\d+)?\s*,\s*/, '')}</span></>}
            </>
          );
        })()}
        {currentQ.examOrigin && (
          <span title="คำถามนี้อิงตามแนวที่เคยพบในการสอบประเภทเดียวกัน" style={{ marginLeft: 8, padding: '2px 8px', borderRadius: 999, background: 'var(--clr-gold-soft)', color: 'var(--clr-ink)', fontSize: 11, fontWeight: 700, fontFamily: 'var(--vmx-mono)' }}>
            อิงแนวเดิม
          </span>
        )}
      </div>

      {figureSrc && (
        <ZoomableImage
          src={figureSrc}
          alt={figureAlt}
          caption={currentQ.imageCaption}
          credit={currentQ.imageCredit}
          sourceUrl={currentQ.imageSourceUrl}
          maxHeight={420}
        />
      )}

      {/* Layout switch: with-passage = grid on wide / stacked on narrow */}
      {currentQ.passage ? (
        <div className="vmx-q-with-passage">
          {passageBlock}
          {contentBlock}
        </div>
      ) : (
        <>{contentBlock}</>
      )}

      {/* Mobile/tablet only — pinned bottom-right. CSS hides it on
          desktop because the side-by-side grid already keeps the
          passage in view. Tap → expand+scroll the passage block. */}
      {currentQ.passage && (
        <button
          type="button"
          className="vmx-passage-fab"
          onClick={focusPassage}
          aria-label="ดู passage"
          title="ดู passage"
        >
          📄 Passage
        </button>
      )}
    </div>
  );
}

// ────────────────────────────────────────────────────────────────
// FlagChip — visual warning that a question has a known data
// conflict between past paper answer and current lecture content.
// Severity color: major=rose, minor=gold, unclear=ink-soft.
// Click expands to show note + sources.
// ────────────────────────────────────────────────────────────────
function FlagChip({ flag }) {
  const [open, setOpen] = useState(false);
  const sev = flag?.severity || 'unclear';
  // `text` is the accent as TEXT on a 12% tint of itself — the raw accents
  // read 2.65 there. The -text variants are what that role is for; border
  // and bg keep the accent, where nothing reads on top of it.
  const PALETTE = {
    major: { bg: 'rgba(194, 109, 109, 0.12)', border: 'var(--clr-rose)', text: 'var(--clr-rose-text)', icon: '⚠️' },
    minor: { bg: 'rgba(184, 137, 64, 0.12)', border: 'var(--clr-gold)', text: 'var(--clr-gold-text)', icon: '⚡' },
    unclear: { bg: 'var(--clr-surface-2)', border: 'var(--clr-border)', text: 'var(--clr-ink-soft)', icon: '❓' },
  };
  // Was `}[sev] || palette.unclear`, reading `palette` inside its own
  // initializer: any severity in the data that is not one of these three
  // keys threw "Cannot access 'palette' before initialization" and took
  // the question card down with it. Nothing in the bank uses a fourth
  // value today, which is the only reason it never fired.
  const palette = PALETTE[sev] || PALETTE.unclear;

  return (
    <div style={{ marginTop: 12 }}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        style={{
          all: 'unset',
          cursor: 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          padding: '4px 10px',
          background: palette.bg,
          border: `1px solid ${palette.border}`,
          borderRadius: 999,
          fontSize: 11,
          fontFamily: 'var(--vmx-mono)',
          color: palette.text,
        }}
        title="ข้อมูลขัดแย้ง — กดดูรายละเอียด"
      >
        {palette.icon} ข้อมูลขัดแย้ง, {sev.toUpperCase()} {open ? '▾' : '▸'}
      </button>

      {open && (
        <div style={{
          marginTop: 8,
          padding: '12px 14px',
          background: palette.bg,
          borderLeft: `3px solid ${palette.border}`,
          borderRadius: '0 8px 8px 0',
          fontSize: 13,
          lineHeight: 1.6,
          color: 'var(--clr-ink)',
        }}>
          <div>{flag.note}</div>
          {flag.sources?.length > 0 && (
            <div style={{
              marginTop: 8,
              fontSize: 11,
              fontFamily: 'var(--vmx-mono)',
              color: 'var(--clr-ink-soft)',
            }}>
              Sources: {flag.sources.join(', ')}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── MCQ option renderer with stable per-Q shuffle ─────────────────
function MCQOptions({ currentQ, currentAnswer, answerCurrent, revealed }) {
  // Recompute permutation only when the question id changes — `useMemo`
  // keeps option order stable across re-renders triggered by note
  // typing, bookmark toggles, timer ticks, etc.
  const { displayOptions, displayToOriginal, originalToDisplay } = useMemo(
    () => getShuffledOptions(currentQ),
    [currentQ?.id, currentQ?.subject, currentQ?.options]
  );
  if (!displayOptions.length) {
    return <div className="vmx-empty">ข้อนี้ไม่มี options — ข้อมูลผิดรูปแบบ</div>;
  }
  // `currentAnswer` is the ORIGINAL index (the source-of-truth stored
  // in `answers[q.id]`). Map to display index for "selected" styling.
  const selectedDisplayIdx = typeof currentAnswer === 'number'
    ? originalToDisplay[currentAnswer]
    : undefined;
  // Instant feedback: once revealed with an answer on record, options
  // lock (first instinct counts) and the correct one + a wrong pick
  // get verdict colors. The letter chip swaps to ✓ / ✗ accordingly.
  const locked = Boolean(revealed) && typeof currentAnswer === 'number';
  return (
    <div className="vmx-options" role="group" aria-label="ตัวเลือกคำตอบ">
      {displayOptions.map((opt, displayIdx) => {
        const originalIdx = displayToOriginal[displayIdx];
        const isSelected = selectedDisplayIdx === displayIdx;
        const isAnswer = originalIdx === currentQ.answer;
        let stateClass = '';
        let chip = String.fromCharCode(65 + displayIdx);
        if (locked) {
          if (isAnswer) {
            stateClass = 'is-correct';
            chip = '✓';
          } else if (isSelected) {
            stateClass = 'is-wrong';
            chip = '✗';
          }
        }
        return (
          <button
            type="button"
            key={originalIdx}
            className={`vmx-option ${isSelected ? 'selected' : ''} ${stateClass}`}
            aria-pressed={isSelected}
            // aria-disabled, NOT disabled: a real `disabled` drops keyboard
            // focus to <body> the instant the options lock, so a student
            // answering by Enter loses their place on every question. This
            // keeps the button focusable and inert instead.
            aria-disabled={locked || undefined}
            onClick={() => { if (locked) return; answerCurrent(originalIdx); }}
          >
            <div className="vmx-option-letter">{chip}</div>
            <div className="vmx-option-text"><RichText text={opt} /></div>
          </button>
        );
      })}
    </div>
  );
}

// ─── InstantFeedback — inline verdict panel for practice mode ──────
// Shows ✓/✗ headline, the correct answer when missed, and q.explain.
// Mirrors ReviewView's answer rows so the visual language carries over
// when the student later opens full review.
function InstantFeedback({ ok, correctNode, explain }) {
  return (
    <div className={`vmx-instant-feedback ${ok ? 'is-ok' : 'is-no'}`} role="status">
      <div className="v">{ok ? '✓ ถูกต้อง!' : '✗ ยังไม่ใช่ — คำตอบที่ถูกถูกทำเครื่องหมาย ✓ ไว้'}</div>
      {!ok && correctNode != null && (
        <div className="a"><span className="k">เฉลย</span>{correctNode}</div>
      )}
      {explain && (
        <div className="w"><span className="k">Why</span><RichText text={explain} /></div>
      )}
    </div>
  );
}
