import { examScopeLabel } from '../lib/question-prediction.js';
import { scopeOfQuestion } from '../lib/exam-scope.js';
import { useRef, useState, useEffect, useMemo, useSyncExternalStore } from 'react';
import { subjectText, isAnswered, isCorrect } from '../hooks/utils.js';
import { SUBJECTS } from '../data/questions.js';
import { RichText } from '../lib/richtext.jsx';
import WikiLinkForQuestion from './WikiLinkForQuestion.jsx';
import { getShuffledOptions } from '../lib/option-shuffle.js';
import TermLinkedRichText from './TermLinkedRichText.jsx';
import RichBlocks from './RichBlocks.jsx';
import { hasTable, wholeExplain, wholeStem } from '../lib/rich-blocks.js';
import { displayStem } from '../lib/match-stem.js';
import { safeImageUrl } from '../lib/safe-url.js';
import SmartPassage from './SmartPassage.jsx';
import NavIcon from './NavIcon.jsx';
import ZoomableImage from './ZoomableImage.jsx';
import EvidenceSlot, { useEvidenceWarmup } from './EvidenceSlot.jsx';
import VoiceInputButton from './VoiceInputButton.jsx';
import HandwritingInput from './HandwritingInput.jsx';
import { useRevealTiming, RevealTimingToggle, REVEAL_ROW, REVEAL_LABELS, WrittenReveal } from './AnswerReveal.jsx';
import { unlockAudio } from '../lib/audio-unlock.js';
import { readAloud, primePlayer } from '../lib/read-aloud-store.js';
import ReadAloudBar from './ReadAloudBar.jsx';
import QSourceChip from './QSourceChip.jsx';
import { followsExamPattern, holdsTopicChip, topicChipText, TOPIC_CHIP_WAIT, flagChipText, SOURCE_LINE_WAIT } from '../lib/source-line.js';
import PinButton from './PinButton.jsx';
import { promptDialog, alertDialog } from '../lib/dialog.js';
import { sendFeedback } from '../lib/feedback-client.js';
import MatchDragDrop from './MatchDragDrop.jsx';
import MissCoach from './MissCoach.jsx';
import { MotionEnter, useMotionFeedback } from './MotionFeedback.jsx';
import { feedbackReaction, COMBO_MIN } from '../lib/mochi-reactions.js';
import { haptic } from '../lib/haptics.js';
import { useMotionPreferences } from '../hooks/useMotionPreferences.js';

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
function readFlags() {
  try { return JSON.parse(window.localStorage.getItem(FLAGS_KEY) || '{}'); } catch { return {}; }
}
function writeFlags(map) {
  try { window.localStorage.setItem(FLAGS_KEY, JSON.stringify(map)); } catch {}
}

// The question type as the exam card's meta row names it.
const TYPE_LABEL = {
  mcq: 'ปรนัย',
  tf: 'ถูก-ผิด',
  fill: 'เติมคำ',
  match: 'จับคู่',
  short: 'ตอบสั้น',
  essay: 'เขียนบรรยาย',
};

// Fill-in items checked with ตรวจคำตอบ in practice, by subject:id, for this
// page load. Outside the component because one instance serves the whole
// set (ExamView renders the card without a key) and a set may be revisited.
const FILL_CHECKED = new Set();

export default function QuestionComponent({ currentQ, currentAnswer, answerCurrent, isBookmarked, toggleBookmark, note, onNoteChange, showNote, setShowNote, revealAnswer, onOpenWiki, answerRun = 0 }) {
  // A verdict is fresh when this visit to the question began unanswered: the
  // student answered it just now. Coming back to a question answered earlier
  // shows its verdict again, but Mochi does not react and the phone stays
  // still. A new question id starts a new visit (this component is not
  // remounted between questions); recording it during render is idempotent.
  const visit = useRef({ id: null, startedAnswered: false });
  if (visit.current.id !== currentQ?.id) visit.current = { id: currentQ?.id, startedAnswered: isAnswered(currentAnswer) };
  const freshVerdict = !visit.current.startedAnswered && isAnswered(currentAnswer);
  // Count presses, not the value. This component is not remounted between
  // questions, so keying the "saved" bounce to isBookmarked replayed it on
  // plain navigation onto (or off) an already-bookmarked question — a save
  // confirmation for something the student never pressed.
  const [bookmarkPresses, setBookmarkPresses] = useState(0);
  const bookmarkMotion = useMotionFeedback('bookmark', bookmarkPresses);
  const compoundId = (currentQ?.subject || '?') + ':' + currentQ?.id;
  const figureSrc = safeImageUrl(currentQ?.image || currentQ?.imagePath);
  const figureAlt = currentQ?.imageAlt
    || `ภาพประกอบข้อ ${currentQ?.id || ''} วิชา ${currentQ?.subject || ''}`.trim();
  // A figure that would give the answer away belongs to the explanation: it
  // shows only after the answer is revealed, never above the options.
  const explainFigureSrc = safeImageUrl(currentQ?.explainImage);
  const explainFigure = explainFigureSrc ? (
    <ZoomableImage
      src={explainFigureSrc}
      alt={currentQ.explainImageAlt || `ภาพประกอบเฉลยข้อ ${currentQ?.id || ''}`.trim()}
      maxHeight={320}
    />
  ) : null;
  // The slide this answer rests on (docs/ANSWER-EVIDENCE.md). Its index and its
  // view load while the question is read, so it paints with the explanation.
  useEvidenceWarmup(currentQ?.subject);
  const evidence = <EvidenceSlot key={compoundId} q={currentQ} />;
  // The read-aloud (lib/read-aloud.js, loaded on the first tap) reads the
  // question, 'q', or its เหตุผล, 'explain'. Its state lives in a store small
  // enough to load with this card, so the buttons, the highlight and the bar
  // render before the engine arrives. Job ids carry the question's id.
  const jobPrefix = `${compoundId}:`;
  const reading = useSyncExternalStore(readAloud.subscribe, () => {
    const s = readAloud.get();
    return s.job?.id.startsWith(jobPrefix) ? `${s.job.what}|${s.kind || ''}|${s.option}` : '';
  }, () => '');
  const [readWhat = '', readKind = '', readOpt = '-1'] = reading.split('|');
  const readOption = readWhat === 'q' && readKind !== 'stem' ? Number(readOpt) : -1;
  const isSpeaking = readWhat === 'q';
  const engineRef = useRef(null);
  const [engine, setEngine] = useState(null);
  const stemRef = useRef(null);
  const explainRef = useRef(null);
  // Why the read-aloud could not start at all (its code did not load), { what, text }.
  const [ttsNote, setTtsNote] = useState(null);
  const [flagState, setFlagState] = useState(() => readFlags()[compoundId] || null);

  // Reset flag display when navigating to a new Q
  useEffect(() => { setFlagState(readFlags()[compoundId] || null); }, [compoundId]);

  // Leaving the question stops its read-aloud; where it stopped is kept for
  // the session, so coming back and pressing play resumes there.
  useEffect(() => () => {
    if (readAloud.get().job?.id.startsWith(jobPrefix)) engineRef.current?.stop();
    setTtsNote(null);
  }, [jobPrefix]);

  const loadEngine = () => (engineRef.current
    ? Promise.resolve(engineRef.current)
    : import('../lib/read-aloud.js').then((m) => { engineRef.current = m; setEngine(m); return m; }));
  const usedReadAloud = () => {
    try { return window.localStorage.getItem('vmx-tts-used') === '1'; } catch { return false; }
  };
  // The voice reads `say`: the stem together with the numbers that sit in the passage's table.
  const saysTable = wholeStem(currentQ) !== (currentQ?.q || '');
  // A matching stem shows without its old drag instruction (lib/match-stem.js); the voice
  // still reads the whole stem, so no phrase is marked in one that was shortened.
  const shownStem = displayStem(currentQ);
  const stemShortened = shownStem !== (currentQ?.q || '');
  // Likewise an explanation laid out as steps: the voice reads the paragraph it was written as.
  const saysParagraph = wholeExplain(currentQ) !== (currentQ?.explain || '');
  // What a job reads: options in the order the student sees them, so
  // "ตัวเลือก B" is the row with the B chip.
  const jobFor = (what) => ({
    id: `${jobPrefix}${what}`,
    what,
    title: what === 'q' ? 'อ่านคำถาม' : 'อ่านเหตุผล',
    album: SUBJECTS.find((s) => s.id === currentQ.subject)?.name || '',
    subject: currentQ.subject,
    stem: wholeStem(currentQ),
    options: Array.isArray(currentQ.options) ? getShuffledOptions(currentQ).displayOptions.map(String) : [],
    explain: wholeExplain(currentQ),
    stemLabel: saysTable ? 'โจทย์และตาราง' : undefined,
    // The element a piece is read from, for the phrase highlight. An option's row for its label too.
    // A stem read from `say`, or an explanation read from `explainSay`, is not the text on screen, so no
    // phrase is marked in it.
    container: (kind, option = -1) => (kind === 'stem'
      ? (what === 'q' ? (saysTable || stemShortened ? null : stemRef.current) : (saysParagraph ? null : explainRef.current))
      : stemRef.current?.closest('.vmx-question-card')?.querySelectorAll('.vmx-option')[option] || null),
    // The element kept above the bar while a piece is read: the table, while the voice says its numbers.
    block: (kind, option = -1) => (kind === 'stem' && what === 'q' && saysTable ? passageRef.current : null)
      || (kind === 'stem' ? (what === 'q' ? stemRef.current : explainRef.current)
        : stemRef.current?.closest('.vmx-question-card')?.querySelectorAll('.vmx-option')[option] || null),
  });

  // A student who has used read-aloud before gets this question's first clip
  // fetched ahead (its เหตุผล's once the panel shows), so a tap starts at once.
  // Everyone else gets only the connection to the clip host opened (DNS, TCP
  // and TLS are three round trips on a phone network).
  useEffect(() => {
    if (!currentQ?.subject) return;
    if (usedReadAloud()) {
      // The stem's clip is small (a few tens of KB); the explanation's is not,
      // so it comes ahead only for a student who listens to explanations.
      loadEngine().then((m) => m.warm(jobFor('q'), { clip: true })).catch(() => {});
    } else {
      try {
        if (!document.querySelector('link[rel="preconnect"][href="https://tts.vetmock.com"]')) {
          const link = document.createElement('link');
          link.rel = 'preconnect';
          link.href = 'https://tts.vetmock.com';
          link.crossOrigin = 'anonymous';
          document.head.appendChild(link);
        }
      } catch { /* a hint only */ }
    }
  }, [currentQ?.id]); // eslint-disable-line react-hooks/exhaustive-deps -- once per question
  const warmExplain = () => {
    if (!usedReadAloud()) return;
    let clip = false;
    try { clip = window.localStorage.getItem('vmx-explain-listened') === '1'; } catch { /* private mode */ }
    loadEngine().then((m) => m.warm(jobFor('explain'), { clip })).catch(() => {});
  };
  // The question this card shows now: a tap's job starts only if the card
  // still shows it once the engine has loaded.
  const prefixNow = useRef(jobPrefix);
  prefixNow.current = jobPrefix;

  // The read-aloud code loads on the first press; start it on pointer-down
  // so the tap's own delay overlaps the download.
  const preloadTts = () => { loadEngine().catch(() => {}); };

  // A tap on the control that is reading stops it; on the other control of
  // the same question it switches (the engine stops the first).
  const speak = async (what) => {
    // CRITICAL: iOS lets audio start only inside the tap. Prime the
    // read-aloud's own element, and the live voices', before any await.
    primePlayer();
    unlockAudio();
    if (readAloud.get().job?.id === `${jobPrefix}${what}`) { engineRef.current?.stop(); return; }
    setTtsNote(null);
    if (what === 'explain') { try { window.localStorage.setItem('vmx-explain-listened', '1'); } catch { /* private mode */ } }
    const job = jobFor(what);
    try {
      const m = await loadEngine();
      // A student who moved on while the engine loaded hears nothing late.
      if (prefixNow.current !== jobPrefix) return;
      m.start(job);
    } catch {
      setTtsNote({ what, text: 'อ่านออกเสียงไม่ได้ตอนนี้ ต่ออินเทอร์เน็ตแล้วลองกดอีกครั้ง' });
    }
  };

  // The เหตุผล row's read-aloud: a 44 px button drawn as a 32 px circle,
  // there from the panel's first paint, so nothing moves.
  const explainOn = readWhat === 'explain';
  const explainListen = currentQ?.explain ? (
    <button
      type="button"
      aria-label={explainOn ? 'หยุดอ่านออกเสียง' : 'อ่านเหตุผลออกเสียง'}
      aria-pressed={explainOn}
      className={`vmx-listen-btn${explainOn ? ' is-on' : ''}`}
      onClick={() => speak('explain')}
      onPointerDown={preloadTts}
      title={explainOn ? 'หยุดอ่าน' : 'อ่านออกเสียง'}
    >
      <span className="vmx-listen-dot"><NavIcon name={explainOn ? 'speaker-off' : 'speaker'} size={16} /></span>
    </button>
  ) : null;
  const explainNote = ttsNote?.what === 'explain' ? ttsNote.text : null;

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
      // Whether the mark landed: a full or blocked localStorage drops the
      // write silently, and then its absence after the send means nothing.
      const stored = readFlags()[compoundId]?.ts === entry.ts;
      // The report must actually REACH someone — for a long time this only
      // wrote localStorage, so students typed out real complaints about
      // wrong answer keys and nobody was ever told. The local flag above stays
      // as the student's own marker either way.
      //
      // Check that it actually ARRIVED. Fire-and-forget marked the question
      // as reported whatever happened, so a rate limit, an outage or simply
      // being offline left the student believing the team had been told when
      // nobody had — the same silence this button exists to end, one level
      // quieter. The client names the cause in the same sentence the feedback
      // page and the VetWiki concern box use: at the daily cap that is
      // "tomorrow, or email", never "try again later".
      const sent = await sendFeedback({
        type: 'content',
        subject: `แจ้งปัญหาข้อสอบ ${compoundId}`,
        message: `${entry.reason}\n\nข้อ: ${compoundId}\nโจทย์: ${String(currentQ?.q || '').slice(0, 300)}`,
      });
      if (!sent.ok) {
        console.warn('[flag] report not delivered:', sent.status, sent.reason);
        // Read the flags again: the student may have flagged another question
        // or withdrawn this one while the request was out, and the copy read
        // before it would write that back over them.
        const latest = readFlags();
        if (latest[compoundId]?.ts === entry.ts) {
          latest[compoundId] = { ...entry, delivered: false };
          writeFlags(latest);
        } else if (stored) {
          // Withdrawn meanwhile (and perhaps raised again, which sends its
          // own report): nothing of this one is left to warn about.
          return;
        }
        alertDialog({
          title: 'ส่งรายงานไม่สำเร็จ',
          body: `เครื่องหมายบนข้อนี้บันทึกไว้ในเครื่องแล้ว แต่ยังส่งถึงทีมงานไม่ได้ ${sent.messageTh}`,
        });
      }
    }
  };

  // Passage panel (for reading-comprehension questions) — handled by
  // SmartPassage component (see ./SmartPassage.jsx). It owns its own
  // open/closed state, highlight + pen overlays, and persistence.
  // We just hold a ref so the mobile FAB can scroll the passage into
  // view when the user taps "📄 Passage".
  const passageRef = useRef(null);

  // A written answer's เฉลย inside the session (AnswerReveal): when the
  // student has chosen "เฉลยได้ทันที", a button under the box opens the
  // keyword checklist and the model answer for this question; otherwise
  // nothing shows until the review, as before. ExamView never passes
  // revealAnswer, so a timed paper is untouched. Scoring is unchanged.
  const [writtenTiming, setWrittenTiming] = useRevealTiming();
  const [writtenRevealed, setWrittenRevealed] = useState(false);
  useEffect(() => { setWrittenRevealed(false); }, [currentQ.id]);
  const writtenReveal = Boolean(revealAnswer) && (currentQ.type === 'short' || currentQ.type === 'essay');
  const writtenRevealBar = writtenReveal ? (
    <div className="vmx-written-reveal-bar">
      <RevealTimingToggle mode={writtenTiming} onChange={setWrittenTiming} rowLabel={REVEAL_LABELS.writtenRow} endLabel={REVEAL_LABELS.end} />
      {writtenTiming === REVEAL_ROW && !writtenRevealed && (
        <button type="button" className="vmx-written-reveal-btn" onClick={() => setWrittenRevealed(true)}>ดูเฉลยข้อนี้</button>
      )}
    </div>
  ) : null;
  const writtenRevealPanel = writtenReveal && writtenTiming === REVEAL_ROW && writtenRevealed
    ? <WrittenReveal q={currentQ} answer={currentAnswer} subject={currentQ.subject} evidence={evidence} />
    : null;

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
  // glows red and locks, and q.explain shows inline. A fill-in item waits
  // for its ตรวจคำตอบ press (revealing while half-typing a blank would
  // flash misleading ✗ marks); match and the written kinds have their own
  // timing (AnswerReveal.jsx).
  const mcqRevealed = Boolean(revealAnswer)
    && currentQ.type === 'mcq'
    && typeof currentAnswer === 'number';
  const tfRevealed = Boolean(revealAnswer)
    && currentQ.type === 'tf'
    && (currentAnswer === true || currentAnswer === false);
  const tfOk = tfRevealed && currentAnswer === currentQ.answer;
  const mcqOk = mcqRevealed && currentAnswer === currentQ.answer;
  // Whether this question's key is on screen: a choice question's verdict, a
  // matching set with every row filled (MatchDragDrop's own rule), or a
  // written answer's เฉลย opened under its box. Until then the source line
  // names only the kind of source, because the full one can give the key
  // away. When the key waits for the end of the set (a timed paper, or
  // practice with instant answers off) nothing reveals here; Review shows
  // the full source.
  const matchFilled = currentQ.type === 'match' && Array.isArray(currentQ.pairs) && currentQ.pairs.length > 0
    && currentAnswer && typeof currentAnswer === 'object'
    && Object.values(currentAnswer).filter(Boolean).length === currentQ.pairs.length;
  // A fill-in item is typed, so it is answered when the student says so:
  // ตรวจคำตอบ, once every blank holds text, in practice only. The check is
  // kept for this page load (FILL_CHECKED) and locks the blanks, or the key
  // just read could be typed in and scored as the student's own. Emptied
  // blanks are a fresh start of the same question (a new set).
  const fillComplete = currentQ.type === 'fill' && Array.isArray(currentQ.blanks) && currentQ.blanks.length > 0
    && Array.isArray(currentAnswer) && currentQ.blanks.every((_, i) => String(currentAnswer[i] ?? '').trim().length > 0);
  if (currentQ.type === 'fill' && !isAnswered(currentAnswer)) FILL_CHECKED.delete(compoundId);
  const [fillCheckedNow, setFillCheckedNow] = useState(null);
  const fillRevealed = Boolean(revealAnswer) && fillComplete && FILL_CHECKED.has(compoundId);
  const fillOk = fillRevealed && isCorrect(currentQ, currentAnswer);
  const checkFill = () => {
    if (!revealAnswer || !fillComplete) return;
    FILL_CHECKED.add(compoundId);
    setFillCheckedNow(compoundId);
  };
  const keyShown = mcqRevealed || tfRevealed || fillRevealed || Boolean(revealAnswer && matchFilled) || Boolean(writtenRevealPanel);
  const essayBarColor =
    essayWords === 0 ? 'var(--clr-border)' :
    essayWords > hardMax ? 'var(--clr-rose)' :
    essayWords > softMax ? 'var(--clr-gold)' :
    'var(--clr-sage)';
  // Fill tokens belong to the progress bar; the number needs text contrast.
  const essayTextColor =
    essayWords === 0 ? 'var(--clr-ink-soft)' :
    essayWords > hardMax ? 'var(--clr-rose-text)' :
    essayWords > softMax ? 'var(--clr-gold-text)' :
    'var(--clr-sage-text)';

  // FAB action — smooth scroll passage into view, and open it if the
  // student had hidden it: a button that brings back a closed box brings back nothing.
  const [passageNudge, setPassageNudge] = useState(0);
  // The way back to the passage shows only while the passage is off screen: floating over the
  // table it names, it covered the table's last cells. (The bottom 140 px belong to the action row.)
  const [passageInView, setPassageInView] = useState(true);
  const hasPassage = Boolean(currentQ.passage);
  useEffect(() => {
    const el = passageRef.current;
    if (!hasPassage || !el || typeof IntersectionObserver === 'undefined') { setPassageInView(false); return undefined; }
    setPassageInView(true);
    const seen = new IntersectionObserver(([entry]) => setPassageInView(entry.isIntersecting), { rootMargin: '0px 0px -140px 0px' });
    seen.observe(el);
    return () => seen.disconnect();
  }, [compoundId, hasPassage]);
  const focusPassage = () => {
    setPassageNudge((n) => n + 1);
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
    <div ref={passageRef} className={`vmx-q-passage-pane${saysTable && readWhat === 'q' && readKind === 'stem' ? ' is-reading' : ''}`}>
      <SmartPassage
        text={currentQ.passage}
        title={currentQ.passage_title}
        defaultOpen={true}
        openSignal={passageNudge}
      />
    </div>
  );

  const contentBlock = (
    <div className="vmx-q-content-pane">
      <h2 ref={stemRef} className={`vmx-qtext${readWhat === 'q' && readKind === 'stem' ? ' is-reading' : ''}`}><TermLinkedRichText text={shownStem} subject={currentQ.subject} /></h2>

      {/* Data discrepancy flag — surfaces conflicts between past papers
          and current lecture content. See vault discrepancies.md +
          self-optimization rule 1d (hold to facts). */}
      {currentQ.flag && <FlagChip key={compoundId} flag={currentQ.flag} revealed={keyShown} />}

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
            readingOption={readOption}
          />
          {mcqRevealed && (
            <InstantFeedback
              // One panel per question: moving between two answered
              // questions used to keep the first one's panel, and with it
              // "answered just now".
              key={compoundId}
              ok={mcqOk}
              run={answerRun}
              fresh={freshVerdict}
              correctNode={Array.isArray(currentQ.options) && <RichText text={currentQ.options[currentQ.answer]} />}
              explain={currentQ.explain} listen={explainListen} listenNote={explainNote} explainRef={explainRef} reading={explainOn} onShown={warmExplain}
              figure={explainFigure}
              evidence={evidence}
              subject={currentQ.subject}
              coach={!mcqOk && <MissCoach key={currentQ.id} q={currentQ} chosen={currentAnswer} />}
              wikiLink={onOpenWiki && <WikiLinkForQuestion q={currentQ} onOpenWiki={onOpenWiki} correct={mcqOk} />}
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
                key={compoundId}
                ok={tfOk}
                run={answerRun}
                fresh={freshVerdict}
                correctNode={<>{correctIsTrue ? '✓ True' : '✗ False'}</>}
                // Say what the statement was even when the student got it
                // right: on a true/false question "คุณตอบถูก" and "ข้อความนี้ผิด"
                // are both true at once, and only one of them was on screen.
                alwaysShowCorrect
                explain={currentQ.explain} listen={explainListen} listenNote={explainNote} explainRef={explainRef} reading={explainOn} onShown={warmExplain}
                figure={explainFigure}
                evidence={evidence}
                subject={currentQ.subject}
                wikiLink={onOpenWiki && <WikiLinkForQuestion q={currentQ} onOpenWiki={onOpenWiki} correct={tfOk} />}
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
                readOnly={fillRevealed}
                onChange={(e) => { if (fillRevealed) return; const arr = currentAnswer ? [...currentAnswer] : []; arr[i] = e.target.value; answerCurrent(arr); }}
                onKeyDown={(e) => { if (e.key === 'Enter' && fillComplete && !fillRevealed && revealAnswer) { e.preventDefault(); checkFill(); } }}
                placeholder={`เติมในช่อง ____ ${currentQ.blanks.length > 1 ? '(' + (i + 1) + ')' : ''}`} />
            </div>
          ))}
          {revealAnswer && !fillRevealed && (
            <div className="vmx-written-reveal-bar">
              <button type="button" className="vmx-written-reveal-btn vmx-fill-check-btn" disabled={!fillComplete} onClick={checkFill}>ตรวจคำตอบ</button>
              {!fillComplete && <span className="vmx-fill-check-hint">เติมครบทุกช่องแล้วกดตรวจ</span>}
            </div>
          )}
          {fillRevealed && (
            <InstantFeedback
              key={compoundId}
              ok={fillOk}
              run={answerRun}
              fresh={fillCheckedNow === compoundId}
              correctNode={currentQ.blanks.length > 1
                ? <ol className="vmx-fill-key">{currentQ.blanks.map((b, i) => <li key={i}><RichText text={b} /></li>)}</ol>
                : <RichText text={currentQ.blanks[0]} />}
              explain={currentQ.explain} listen={explainListen} listenNote={explainNote} explainRef={explainRef} reading={explainOn} onShown={warmExplain}
              figure={explainFigure}
              evidence={evidence}
              subject={currentQ.subject}
              wikiLink={onOpenWiki && <WikiLinkForQuestion q={currentQ} onOpenWiki={onOpenWiki} correct={fillOk} />}
            />
          )}
        </div>
      )}

      {currentQ.type === 'match' && (
        <MatchDragDrop
          currentQ={currentQ}
          currentAnswer={currentAnswer}
          answerCurrent={answerCurrent}
          revealAnswer={revealAnswer}
        />
      )}

      {/* Short answer — free-form text input. Auto-grade does loose
          keyword matching against q.keywords; user can also self-grade
          or self-grade in Review since open-text grading is fuzzy. */}
      {currentQ.type === 'short' && (
        <div className="vmx-fill-row">
          <div className="vmx-fill-label" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
            <label htmlFor={`vmx-short-${currentQ.subject}-${currentQ.id}`}>คำตอบของคุณ (พิมพ์ตอบสั้นๆ)</label>
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
            placeholder="เขียนคำตอบสั้น ๆ 1 ถึง 3 ประโยค หรือกดไมค์เพื่อพูด"
            rows={3}
            style={{ minHeight: 70, fontFamily: 'inherit', resize: 'vertical', width: '100%', boxSizing: 'border-box', padding: 10 }}
            maxLength={1000}
          />
          <div style={{ marginTop: 4, fontSize: 14, color: 'var(--clr-ink-soft)', fontVariantNumeric: 'tabular-nums' }}>
            {(typeof currentAnswer === 'string' ? currentAnswer.length : 0).toLocaleString('th-TH')} / 1,000 ตัวอักษร
          </div>
          {/* Optional third way in: handwriting, transcribed into the same
              box so the student edits it before it is graded. */}
          <HandwritingInput
            key={compoundId}
            maxChars={1000}
            onText={(text) => {
              const cur = typeof currentAnswer === 'string' ? currentAnswer : '';
              const sep = cur && !cur.endsWith('\n') ? '\n' : '';
              answerCurrent((cur + sep + text).slice(0, 1000));
            }}
          />
          {writtenRevealBar}
          {writtenRevealPanel}
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
            <div style={{ fontVariantNumeric: 'tabular-nums', fontSize: 14, color: 'var(--clr-ink-soft)' }}>
              <strong style={{ color: essayTextColor }}>{essayWords}</strong>
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
          <HandwritingInput
            key={compoundId}
            maxChars={5000}
            onText={(text) => {
              const cur = essayText || '';
              const sep = cur && !cur.endsWith('\n') ? '\n' : '';
              answerCurrent((cur + sep + text).slice(0, 5000));
            }}
          />
          {writtenRevealBar}
          {writtenRevealPanel}
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
          <div style={{ marginTop: 6, fontSize: 14, color: 'var(--clr-ink-soft)', lineHeight: 1.5 }}>
            Target: <strong>{target}</strong> words, Soft cap: <strong>{softMax}</strong> (penalty −1), Hard cap: <strong>{hardMax}</strong> (penalty −2)
          </div>
        </div>
      )}

      {/* Trust layer — source / verified / examOrigin / flag.
          Collapsed by default to keep the card clean; tap to expand once the
          key is on screen. Keyed per question: an open panel on one question
          used to stay open on the next. */}
      <QSourceChip key={compoundId} q={currentQ} revealed={keyShown} />
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
        <button ref={bookmarkMotion} data-motion-feedback="bookmark" type="button" aria-label="บันทึกข้อนี้" aria-pressed={isBookmarked} className={`vmx-bookmark-btn ${isBookmarked ? 'active' : ''}`} onClick={() => { setBookmarkPresses((n) => n + 1); toggleBookmark(currentQ.id); }} title="บันทึกข้อนี้ (B)">
          <NavIcon name="star" size={18} filled={isBookmarked} />
        </button>
        <button type="button" aria-label="เปิดโน้ตของข้อนี้" aria-expanded={showNote} className={`vmx-note-btn ${note ? 'has-note' : ''}`} onClick={() => setShowNote(!showNote)} title="โน้ตของข้อนี้">
          <NavIcon name="note" size={18} filled={Boolean(note)} />
        </button>
        {/* Voice TTS — reads Q + options aloud (Web Speech API, no lib).
            Click again while speaking to stop. */}
        <button
          type="button"
          aria-label={isSpeaking ? 'หยุดอ่านออกเสียง' : 'อ่านคำถามออกเสียง'}
          aria-pressed={isSpeaking}
          className={`vmx-note-btn ${isSpeaking ? 'has-note' : ''}`}
          onClick={() => speak('q')}
          onPointerDown={preloadTts}
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
            so the row read as uneven — and 44px is the touch floor anyway.
            The toolbar's circle class owns its shape, like its four neighbours. */}
        <PinButton
          className="vmx-note-btn vmx-pin-btn"
          type="question"
          payload={{ subject: currentQ?.subject, id: currentQ?.id, stem: (currentQ?.q || '').slice(0, 80) }}
          label={(currentQ?.q || '').slice(0, 60)}
        />
      </div>
      {ttsNote?.what === 'q' && <p className="vmx-tts-note" role="status">{ttsNote.text}</p>}
      <ReadAloudBar jobPrefix={jobPrefix} engine={engine} />

      {/* The type, subject, topic and paper as separate parts of one quiet
          row — Thai, like the rest of the card, and never uppercased. The
          hairline between parts is CSS (.vmx-q-meta), so no separator is
          written into the copy, and the topic's emoji stays on the topic
          screen where it is the topic's identity, not chrome. */}
      <div className="vmx-qtype-badge vmx-q-meta">
        {(() => {
          const typeLabel = TYPE_LABEL[currentQ.type];
          const subj = SUBJECTS.find((s) => s.id === currentQ.subject);
          const topic = currentQ.topic && subj?.topics?.find((t) => t.id === currentQ.topic);
          // Only questions that carry exam-scope metadata say which paper
          // they belong to; a legacy question says nothing rather than guessing.
          const paper = examScopeLabel(scopeOfQuestion(currentQ));
          return (
            <>
              {typeLabel && <span>{typeLabel}</span>}
              <span>{subj?.name || currentQ.subject}</span>
              {topic && !holdsTopicChip(currentQ) && <span style={{ color: subjectText(subj?.color) }}>{topicChipText(topic.label)}</span>}
              {/* A label that would name the key waits for it (lib/source-line.js).
                  It and the line standing in for it share one grid cell, so the
                  row keeps the size the label needs and nothing moves when it
                  appears; the hidden one is neither seen nor read aloud. */}
              {topic && holdsTopicChip(currentQ) && (
                <span className="vmx-q-topic-hold" style={{ color: subjectText(subj?.color) }}>
                  <span aria-hidden={keyShown ? undefined : true}>{topicChipText(topic.label)}</span>
                  <span className="vmx-q-topic-wait" aria-hidden={keyShown ? true : undefined}>{TOPIC_CHIP_WAIT}</span>
                </span>
              )}
              {paper && <span className="vmx-scope-chip">{paper}</span>}
            </>
          );
        })()}
        {/* Only where the source line agrees: a sat paper, a marked exam
            point or a mock, never a row written from a lecture or a summary. */}
        {followsExamPattern(currentQ) && (
          <span className="vmx-origin-chip" title="คำถามนี้อิงตามแนวที่เคยพบในการสอบประเภทเดียวกัน">
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
        <div className={hasTable(currentQ.passage) ? "vmx-q-with-passage is-data" : "vmx-q-with-passage"}>
          {passageBlock}
          {contentBlock}
        </div>
      ) : (
        <>{contentBlock}</>
      )}

      {/* Mobile/tablet only — pinned bottom-right. CSS hides it on
          desktop because the side-by-side grid already keeps the
          passage in view. Tap → expand+scroll the passage block. */}
      {currentQ.passage && !passageInView && (
        <button
          type="button"
          className="vmx-passage-fab"
          onClick={focusPassage}
          aria-label={hasTable(currentQ.passage) ? 'กลับไปดูตาราง' : 'ดู passage'}
          title={hasTable(currentQ.passage) ? 'กลับไปดูตาราง' : 'ดู passage'}
        >
          <NavIcon name="book" size={16} /> {hasTable(currentQ.passage) ? 'ดูตาราง' : 'Passage'}
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
// The chip warns before the answer too, but what it opens waits for the key
// (5.189.2): a note that says which key the seniors marked, or that the
// answer "should be InPouch TF-Feline", named the key on 26 of the 94
// flagged questions, timed papers included. Exported for the leak test.
export function FlagChip({ flag, revealed = false }) {
  const [open, setOpen] = useState(false);
  const expanded = revealed && open;
  const sev = flag?.severity || 'unclear';
  // `text` is the accent as TEXT on a 12% tint of itself — the raw accents
  // read 2.65 there. The -text variants are what that role is for; border
  // and bg keep the accent, where nothing reads on top of it.
  const PALETTE = {
    major: { bg: 'rgba(194, 109, 109, 0.12)', border: 'var(--clr-rose)', text: 'var(--clr-rose-text)' },
    minor: { bg: 'rgba(184, 137, 64, 0.12)', border: 'var(--clr-gold)', text: 'var(--clr-gold-text)' },
    unclear: { bg: 'var(--clr-surface-2)', border: 'var(--clr-border)', text: 'var(--clr-ink-soft)' },
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
        onClick={() => { if (revealed) setOpen((o) => !o); }}
        aria-expanded={revealed ? open : undefined}
        aria-disabled={revealed ? undefined : true}
        style={{
          all: 'unset',
          cursor: revealed ? 'pointer' : 'default',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          padding: '4px 10px',
          background: palette.bg,
          border: `1px solid ${palette.border}`,
          borderRadius: 999,
          fontSize: 14,
          color: palette.text,
        }}
        title={revealed ? 'ข้อมูลขัดแย้ง — กดดูรายละเอียด' : 'ข้อมูลขัดแย้ง รายละเอียดแสดงหลังเห็นเฉลย'}
      >
        {/* One line flag; the severity is the word beside it and the colour. */}
        <NavIcon name="flag" size={13} filled /> {flagChipText(flag)} {revealed ? (open ? '▾' : '▸') : SOURCE_LINE_WAIT}
      </button>

      {expanded && (
        <div style={{
          marginTop: 8,
          padding: '12px 14px',
          background: palette.bg,
          borderLeft: `3px solid ${palette.border}`,
          borderRadius: '0 8px 8px 0',
          fontSize: 14,
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
function MCQOptions({ currentQ, currentAnswer, answerCurrent, revealed, readingOption = -1 }) {
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
            className={`vmx-option ${isSelected ? 'selected' : ''} ${stateClass}${readingOption === displayIdx ? ' is-reading' : ''}`}
            aria-pressed={isSelected}
            // aria-disabled, NOT disabled: a real `disabled` drops keyboard
            // focus to <body> the instant the options lock, so a student
            // answering by Enter loses their place on every question. This
            // keeps the button focusable and inert instead.
            aria-disabled={locked || undefined}
            onClick={() => { if (locked) return; answerCurrent(originalIdx); }}
          >
            <div className="vmx-option-indicator">
              <div className="vmx-option-letter">{chip}</div>
            </div>
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
function InstantFeedback({ ok, run = 0, fresh = false, correctNode, explain, listen = null, listenNote = null, explainRef = null, reading = false, onShown, figure = null, evidence = null, coach, wikiLink, subject, alwaysShowCorrect = false }) {
  // The panel mounts once per revealed answer; whether that answer was given
  // just now is fixed at mount, so a later re-render cannot replay anything.
  const [isFresh] = useState(fresh);
  const reaction = feedbackReaction({ ok, run });
  const { preferences } = useMotionPreferences();
  // A verdict given just now paints on its own first, and the explanation,
  // figure, coach and wiki link follow one frame later. Laying out that Thai
  // text was most of the tap (79 of 192 ms on a 4x-slowed phone, 22 Oct
  // baseline), and it sat between the tap and the ✓/✗ appearing. An answer
  // revisited later shows everything at once.
  const [rest, setRest] = useState(!isFresh);
  useEffect(() => {
    if (isFresh) haptic(reaction.haptic, preferences);
    if (rest) { onShown?.(); return undefined; }
    let timer = 0;
    // After the next paint: rAF runs just before it, the timeout just after.
    const frame = requestAnimationFrame(() => { timer = setTimeout(() => { setRest(true); onShown?.(); }, 0); });
    return () => { cancelAnimationFrame(frame); clearTimeout(timer); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps -- once per revealed answer
  const combo = ok && run >= COMBO_MIN;
  return (
    <MotionEnter effect="reveal" className={`vmx-instant-feedback ${ok ? 'is-ok' : 'is-no'}`} role="status">
      <div className="vmx-feedback-header">
        <div className="vmx-feedback-headline">
          {/* The verdict is the headline itself; the mono English kicker that
              sat above it said the same thing a second time in a language the
              card does not otherwise speak. */}
          <div className="v">{ok ? '✓ คุณตอบถูก' : '✗ ยังไม่ใช่ ดูเฉลยด้านล่าง'}</div>
          {/* How many correct in a row ends here, counted from the set's own
              verdicts (lib/mochi-reactions.js correctRun). */}
          {combo && <span className={`vmx-combo-chip${isFresh ? ' is-fresh' : ''}`}>ถูกติดกัน {run} ข้อ</span>}
        </div>
        {/* No Mochi stamp beside the verdict (Palm, 1 Nov 2026: "ดูแปลกตา"):
            the headline has the row to itself. */}
      </div>
      {/* "คุณตอบถูก", not "ถูกต้อง". On a true/false question the
          second reads as a verdict on the STATEMENT, and it sat directly above
          an explanation opening with "ไม่ถูกต้อง" — which is about the statement.
          Two lines, opposite words, neither saying whose.
          A miss points at the เฉลย row below rather than at a ✓: a false
          true/false statement's answer is "✗ False". */}
      {(alwaysShowCorrect || !ok) && correctNode != null && (
        <div className="a"><span className="k">เฉลย</span><div className="vmx-feedback-correct-val">{correctNode}</div></div>
      )}
      {rest && explain && (
        <div className={`w${reading ? ' is-reading' : ''}`}>
          <div className="vmx-feedback-explain-head"><span className="k">เหตุผล</span>{listen}</div>
          <div className="vmx-feedback-explain-body" ref={explainRef}><RichBlocks text={explain} renderText={(t) => <TermLinkedRichText text={t} subject={subject} />} /></div>
          {listenNote && <p className="vmx-tts-note" role="status">{listenNote}</p>}
        </div>
      )}
      {rest && figure}
      {rest && evidence}
      {rest && coach}
      {rest && wikiLink}
    </MotionEnter>
  );
}
