import { clearCompletedExam } from '../lib/exam-recovery.js';
import { reportFailure } from '../lib/report-failure.js';
// The app's own practice mark, not any course's passing grade. It is named and
// shown next to the verdict because "ผ่านเกณฑ์" on its own reads as a faculty
// threshold, and this number applies across every subject and format the
// engine can auto-grade.
export const PRACTICE_PASS_PCT = 60;
import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { answerOutcome, isWritingType } from '../hooks/utils.js';
import BackBar from '../components/BackBar.jsx';
import ExamSaveNotice from '../components/ExamSaveNotice.jsx';
import DigitRoll from '../components/DigitRoll.jsx';
import ScoreBurst from '../components/ScoreBurst.jsx';
import MochiLive from '../components/MochiLive.jsx';
import StreakMoment from '../components/StreakMoment.jsx';
import { mochiResultPose } from '../lib/mochi-presence.js';
import { readStreakMoment, markStreakMomentSeen } from '../lib/streak-moment.js';
import { haptic } from '../lib/haptics.js';
import { shareableQuestions } from '../lib/share-link.js';
import { SUBJECTS } from '../data/curriculum.js';
import ShareSetSheet from '../components/ShareSetSheet.jsx';
import { drawScoreCard, SCORE_STRIP } from '../lib/share-card/score-card.js';
import { picture } from '../lib/share-card/kit.js';
import { MOCHI_POSE_ASSETS } from '../data/mochi-poses.generated.js';
import { hasTopic, articleForQuestion } from '../lib/vetwiki/registry-lite.js';
import { FEATURE_FLAGS } from '../lib/feature-registry.js';
import WeakSpots from '../components/WeakSpots.jsx';
import NavIcon from '../components/NavIcon.jsx';
import { useMotionPreferences } from '../hooks/useMotionPreferences.js';
import LadderStrip from '../components/LadderStrip.jsx';
import { ladderStep, ladderStepFor, ladderVerdict, rememberLadderStep } from '../lib/practice-ladder.js';

// Offered once ever, after the first set of a day: its own chunk, not every result's (1.7 KB gzip).
const ReminderOffer = lazy(() => import('../components/ReminderPicker.jsx').then((m) => ({ default: m.ReminderOffer })));

// Results already shown once in this page's life, by completion time: Back
// from the answers shows the page as it is, without its entrance again.
const shownResults = new Set();

export default function ResultsView({
  saveStatus,
  score,
  questions,
  answers,
  goHome,
  setView,
  mode,
  // Whether the set ran against a clock: with `mode` it says which rung of
  // the practice ladder the set was (lib/practice-ladder.js).
  useTimer = null,
  selectedYear = 4,
  selectedPhase,
  // Phase 2 (2026-05-18): "next play" CTAs need to relaunch exam
  // rounds without the user manually navigating Subject → Config.
  // App.jsx passes startExam + state setters so we can fire 1-tap
  // continue / redo flows.
  startExam,
  setSubject,
  setTopic,
  setPracticeMode,
  setMode,
  setNumQuestions,
  setUseTimer,
  replayQuestions,
  // Round 2B 2026-05-18: when this session came from a challenge link,
  // app parses `?sc=…&by=…` and passes the parsed payload. Drives the
  // post-exam comparison panel + win/lose framing.
  challengeSender,
  // 'redo' for the wrong-answer round opened from this page: its keys were
  // just on screen, so it never sets a personal best.
  sessionKind,
  // The set was drawn from past papers only (the topic screen's ข้อสอบเก่า
  // switch, the config screen's ข้อที่ใช้ row). Its next sets continue it.
  pastOnly = false,
  // Round 3 2026-05-18: examStartTime → compute receiver elapsed time
  // for "เทียบคะแนน/เวลา" (Phase 5 spec). When this user later shares
  // the same set, their own time goes into the URL for THEIR receiver.
  examStartTime,
  // When the set was submitted. Results unmounts while the student reads the
  // answers, and a browser Back mounts it again: timing to Date.now() made a
  // one-minute set read six minutes after five minutes in the review, and
  // that was the time shown, compared and shared.
  completedAt,
}) {
  // Receiver's elapsed time (seconds from start to submit). Round to int
  // because URL/display granularity is per-second. Null when start time
  // is missing (e.g. legacy session).
  const receiverDurationSec = useMemo(() => {
    if (!Number.isFinite(examStartTime) || examStartTime <= 0) return null;
    const end = Number.isFinite(completedAt) ? completedAt : Date.now();
    const ms = end - examStartTime;
    if (ms <= 0) return null;
    return Math.max(1, Math.min(9999, Math.round(ms / 1000)));
  }, [examStartTime, completedAt]);
  // Fire confetti once on mount for a perfect auto-graded score.
  // Lazy-imported so the canvas/animation code never hits the
  // main bundle. Guarded by useRef so React StrictMode's double
  // Clear the in-flight exam key once we're safely mounted with a
  // score in hand. App.jsx now keeps the key (tagged submitted)
  // through finishExam so a chunk-load failure mid-deploy doesn't
  // strand the user on a blank screen — ReviewView can replay.
  useEffect(() => {
    if (!saveStatus?.committed) return;
    // A copy left behind is never offered back (App reads a saved, submitted set as finished), so
    // the student has nothing to do about it and sees nothing; the failure is counted for the owner.
    try { clearCompletedExam(window.localStorage, saveStatus.owner, saveStatus.sessionId); } catch (error) { reportFailure('save', error); }
  }, [saveStatus?.committed, saveStatus?.owner, saveStatus?.sessionId]);

  // A late-night promotion is no longer said here: the score is what a student
  // came to this screen for. finishExam leaves it in the stash, and the night
  // rank card on Progress takes it (components/NightRankCard.jsx).

  // One mascot on the result, Mochi's reaction beside the score: the Study
  // Squad companion card under it (with its 3D model) went on 11 Nov 2026,
  // a second mascot between the score and what to do.
  const { preferences: motionPrefs } = useMotionPreferences();
  // The first look at this result gets its entrance: Mochi's reaction, the
  // cards in turn and, after the first set of a day, the day count.
  const [firstLook] = useState(() => !shownResults.has(completedAt));
  const [moment] = useState(() => {
    const found = readStreakMoment(completedAt);
    return found ? { ...found, first: !found.seen } : null;
  });
  useEffect(() => {
    if (Number.isFinite(completedAt)) shownResults.add(completedAt);
    markStreakMomentSeen(completedAt);
  }, [completedAt]);

  // mount in dev doesn't trigger the burst twice.
  // Personal-best tracking — per-subject highest pct ever recorded in
  // a 5+ Q session. A new best of 60% and up gets its own confetti burst
  // on top of the score-based one; no banner, the score is said once.
  const firedRef = useRef(false);
  useEffect(() => {
    if (firedRef.current) return;
    if (score.total === 0) return;
    // Tiered confetti: perfect score = full burst (3 sources), 90%+ = single
    // burst, 80%+ = small celebration. pct uses correct/total directly to
    // avoid the 99.5%→round-to-100% false-fire.
    const ratio = score.correct / score.total;
    const pct = Math.round(ratio * 100);
    const isPerfect = score.correct === score.total;
    const isExcellent = !isPerfect && ratio >= 0.9 && score.total >= 5;
    const isGood = !isPerfect && !isExcellent && ratio >= 0.8 && score.total >= 5;

    // ── Personal-best detection (only for sessions ≥5 Q in a single subject)
    let isPB = false;
    try {
      const subj = questions[0]?.subject;
      const allSameSubj = subj && questions.every((q) => q.subject === subj);
      if (sessionKind !== 'redo' && allSameSubj && score.total >= 5) {
        const raw = window.localStorage.getItem('vmx-personal-best');
        const map = raw ? JSON.parse(raw) : {};
        const prev = map[subj] || 0;
        if (pct > prev) {
          map[subj] = pct;
          window.localStorage.setItem('vmx-personal-best', JSON.stringify(map));
          // Only flag as PB (banner + confetti) when ≥60%. Below that we
          // still record the new high-water mark in localStorage but
          // don't celebrate — first-time users hitting 10% shouldn't
          // see "NEW PERSONAL BEST" since the prior baseline was just 0.
          if (pct >= 60) {
            isPB = true;
          }
        }
      }
    } catch {}

    if (!isPerfect && !isExcellent && !isGood && !isPB) return;
    firedRef.current = true;
    let cancelled = false, started = false, clearBurst;
    const burstTimers = [];
    const later = (fn, delay) => burstTimers.push(setTimeout(() => { if (!cancelled) fn(); }, delay));
    import('../lib/confetti.js').then((m) => {
      if (cancelled) return;
      started = true;
      clearBurst = m.clearConfetti;
      if (isPerfect) {
        m.fireConfetti({ count: 140, preset: 'confetti' });
        later(() => m.fireConfetti({ count: 80, originXRatio: 0.2 }), 250);
        later(() => m.fireConfetti({ count: 80, originXRatio: 0.8 }), 500);
      } else if (isExcellent) {
        m.fireConfetti({ count: 90, preset: 'fireflies' });
      } else if (isGood) {
        m.fireConfetti({ count: 50 });
      }
      if (isPB) {
        // Distinct PB burst (gold) — fires after the score burst
        later(() => m.fireConfetti({ count: 60, originXRatio: 0.5, preset: 'streak' }), 700);
      }
    }).catch(() => {});
    return () => { cancelled = true; burstTimers.forEach(clearTimeout); clearBurst?.(); if (!started) firedRef.current = false; };
  }, [score.correct, score.total, questions]);

  // Split writing from auto-graded for the result counts so writing
  // questions don't show up as "wrong" — they need self-grading.
  const autoQs = questions.filter((q) => !isWritingType(q));
  const writingQs = questions.filter((q) => isWritingType(q));
  const wrongCount = autoQs.filter((q) => answerOutcome(q, answers[q.id]) === 'wrong').length;
  const skipCount = autoQs.filter((q) => answerOutcome(q, answers[q.id]) === 'skipped').length;
  const writingAttempted = writingQs.filter((q) => {
    const ua = answers[q.id];
    return typeof ua === 'string' && ua.trim().length > 0;
  }).length;

  // One verdict for the whole screen. Exact counts, not the rounded
  // percentage: 59.5% rounds to 60 and would otherwise read as having reached
  // the mark. Every place that speaks about the bar reads this — the message,
  // the banner and the colour of the big number — because when the message
  // used the rounded value and the banner used the exact one, a 28/47 session
  // said "ถึงเกณฑ์ซ้อมของแอปแล้ว" and "ยังไม่ถึงเกณฑ์ซ้อมของแอป (60%)" on the
  // same screen, in green.
  const reached = score.total > 0 && score.correct / score.total >= PRACTICE_PASS_PCT / 100;

  // Pick a message that matches what the user actually did:
  // pure-writing sessions don't have a percentage, so a "low score"
  // pep-talk is misleading. Show a writing-specific message instead.
  const msg = autoQs.length === 0
    ? (writingAttempted === writingQs.length && writingQs.length > 0
        ? 'เขียนครบแล้ว ไปเทียบคำตอบกับเกณฑ์ในหน้าเฉลย'
        : writingAttempted > 0
          ? 'เขียนได้บางส่วนแล้ว ใช้หน้าเฉลยช่วยเติมส่วนที่ขาด'
          : 'ยังไม่ได้เขียนคำตอบ ลองเริ่มจากชุดสั้นก่อน')
    // The exact counts, not the rounded percent: 199/200 rounds to 100.
    : score.total > 0 && score.correct === score.total ? 'ถูกทุกข้อ รักษาความแม่นด้วยการทบทวนตามรอบ'
    : score.total > 0 && score.correct / score.total >= 0.8 ? 'แม่นดีมาก ลองเพิ่มจำนวนข้อหรือเปิดจับเวลา'
    : reached ? 'ถึงเกณฑ์ซ้อมของแอปแล้ว ทบทวนข้อที่ผิดเพื่อปิดจุดอ่อน'
    : score.pct >= 40 ? 'ยังมีจุดที่ควรทบทวน เริ่มจากข้อที่ผิดในรอบนี้'
    : 'กลับไปทบทวนหัวข้อนี้ แล้วลองชุดสั้นอีกครั้ง';

  const isExam = mode === 'exam';
  // A strong result over a real set earns a one-shot confetti burst behind
  // the score. Three questions is the floor so 1/1 does not throw a party.
  // Both gates use the exact counts, not the rounded pct: 199/200 rounds to
  // 100 and 79.5% rounds to 80, and neither should count.
  const celebrate = autoQs.length >= 3 && score.total > 0 && score.correct / score.total >= 0.8;
  const perfect = score.total > 0 && score.correct === score.total;

  // A genuine high point, once: a perfect set of five or more, or a round
  // day count. The phone ticks; inside the Android app the app may offer a
  // store review (it decides how rarely, never during a set).
  const highPointDone = useRef(false);
  useEffect(() => {
    if (!firstLook || highPointDone.current) return;
    highPointDone.current = true;
    const perfectSet = perfect && autoQs.length >= 5;
    const milestone = Boolean(moment?.first && moment.milestone);
    if (perfectSet || milestone) haptic('milestone', motionPrefs);
    try {
      if (perfectSet) window.VetMockApp?.happyMoment?.('perfect-set');
      else if (milestone) window.VetMockApp?.happyMoment?.('streak-milestone');
    } catch {}
  }, []); // eslint-disable-line react-hooks/exhaustive-deps -- once per first look
  const resultPose = mochiResultPose(score, autoQs.length);

  // ── What to do next (work/results-design, direction 1) ──────────────
  // One filled button under the thumb, then at most three choices: the
  // answers, sending the set to a friend, and one next-step row. Everything
  // here comes from the set in memory; nothing waits on the network.
  const subj0 = questions[0]?.subject || null;
  const topic0 = questions[0]?.topic || null;
  const ctxSubj = subj0 && questions.every((q) => q.subject === subj0) ? subj0 : null;
  const ctxTopic = ctxSubj && topic0 && questions.every((q) => q.topic === topic0) ? topic0 : null;
  const subjMeta = ctxSubj ? SUBJECTS.find((s) => s.id === ctxSubj) : null;
  const subjLabel = subjMeta?.name || ctxSubj || '';
  const topicMeta = ctxTopic ? subjMeta?.topics?.find((item) => item.id === ctxTopic) : null;
  const topicLabel = topicMeta?.label ? topicMeta.label.replace(/^[\d\s.\-]+/, '').trim().slice(0, 42) : 'หัวข้อนี้';
  const scopeLine = ctxSubj ? (ctxTopic && topicMeta ? `${subjLabel}, ${topicLabel}` : subjLabel) : '';

  // What to do again: the questions answered wrong and the ones left blank
  // (a timed paper leaves blanks, and they are misses the student can fix
  // now too), in the set's order.
  const missedQs = autoQs.filter((q) => answerOutcome(q, answers[q.id]) !== 'correct');
  const skippedMissed = missedQs.filter((q) => answerOutcome(q, answers[q.id]) === 'skipped').length;
  const hasMissed = missedQs.length > 0;
  const missedLabel = skippedMissed === 0
    ? { title: `แก้ข้อที่ผิด ${missedQs.length} ข้อ`, sub: 'ทำซ้ำเฉพาะข้อที่ผิดในรอบนี้', key: `ดูเฉลยข้อที่ผิด ${missedQs.length} ข้อ` }
    : skippedMissed === missedQs.length
      ? { title: `ทำข้อที่ข้ามไป ${missedQs.length} ข้อ`, sub: 'ข้อในรอบนี้ที่ยังไม่ได้ตอบ', key: `ดูเฉลยข้อที่ข้ามไป ${missedQs.length} ข้อ` }
      : { title: `ทำข้อที่ผิดและข้ามไป ${missedQs.length} ข้อ`, sub: `ผิด ${missedQs.length - skippedMissed} ข้อ ยังไม่ได้ตอบ ${skippedMissed} ข้อ`, key: `ดูเฉลยข้อที่ผิดและข้ามไป ${missedQs.length} ข้อ` };

  const handleRedoWrong = () => {
    if (missedQs.length === 0) return;
    if (typeof replayQuestions === 'function') {
      replayQuestions(missedQs);
    } else {
      // Fallback: cross-history wrong via practiceMode='wrong'
      startExam?.({
        practiceMode: 'wrong', subject: 'all', topic: null, questionCategory: 'all',
        numQuestions: Math.max(5, Math.min(missedQs.length, 20)), useTimer: false,
      });
    }
  };
  const handleContinueMore = (n) => {
    if (!startExam) return;
    startExam({
      mode: 'quick', practiceMode: 'all', subject: ctxSubj || 'all', topic: ctxTopic || null,
      questionCategory: 'all', numQuestions: n, useTimer: false, onlyPastPaper: pastOnly,
      // "อีก" means more, not again: a topic can hold fewer questions than the
      // row offers, and the set was padded with the ones just answered.
      excludeIds: new Set((questions || []).map((q) => `${q.subject}:${q.id}`)),
    });
  };

  // ── The practice ladder: which rung this set was, and what it earned ──
  // A redo round reuses questions the student just saw, so it never climbs.
  const stepId = ladderStepFor({ mode, useTimer: Boolean(useTimer) });
  const verdict = sessionKind === 'redo'
    ? { kind: 'redo', step: stepId, next: stepId, ratio: score.total > 0 ? score.correct / score.total : 0 }
    : ladderVerdict({ stepId, correct: score.correct, total: score.total, passPct: PRACTICE_PASS_PCT });
  const nextStep = ladderStep(verdict.next);
  const launchStep = (id) => {
    rememberLadderStep(id);
    if (!startExam) return;
    const step = ladderStep(id);
    if (id === 'exam') {
      // An exam rung is the whole subject: a paper is a subject, not one topic.
      startExam({
        mode: 'exam', practiceMode: 'all', subject: ctxSubj || 'all', topic: null, questionCategory: 'all',
        numQuestions: step.count, useTimer: true, timePerQ: 60, onlyPastPaper: pastOnly,
      });
      return;
    }
    startExam({
      mode: 'quick', practiceMode: 'all', subject: ctxSubj || 'all', topic: ctxTopic || null, questionCategory: 'all',
      numQuestions: step.count, useTimer: step.useTimer, timePerQ: 60, onlyPastPaper: pastOnly,
      ...(id === 'understand' ? { gentle: true } : {}),
    });
  };
  // Past the top rung: the exam config screen, where the subject is chosen.
  const openExamConfig = () => {
    rememberLadderStep('exam');
    setMode?.('exam'); setSubject?.('all'); setTopic?.(null); setPracticeMode?.('all');
    setNumQuestions?.(50); setUseTimer?.(true);
    setView('config');
  };
  // Said once in each row it applies to, after the set's name.
  const pastTag = pastOnly ? ', ข้อสอบเก่า' : '';
  const scopeName = `${ctxTopic ? topicLabel : ctxSubj ? subjLabel : 'ทุกวิชาในปีนี้'}${pastTag}`;
  const ladderRow = verdict.kind === 'up'
    ? {
        icon: 'progress', onClick: () => launchStep(verdict.next),
        label: `ขั้นต่อไป ${nextStep.label} ${nextStep.count} ข้อ`,
        sub: verdict.next === 'exam' ? `ทั้งวิชา ${subjLabel || 'ที่เลือก'}${pastTag} นาฬิกาเดียวทั้งชุด` : `${scopeName} จับเวลาต่อข้อ`,
      }
    : verdict.kind === 'done'
      ? { icon: 'progress', onClick: openExamConfig, label: 'ซ้อมสอบชุดต่อไป', sub: 'เลือกวิชาได้ในหน้าถัดไป' }
      : verdict.kind === 'redo'
        ? null
        : {
            icon: 'progress', onClick: () => launchStep(verdict.next),
            label: verdict.kind === 'back' && verdict.next !== verdict.step
              ? `กลับขั้น ${nextStep.n} ${nextStep.label}`
              : `ทำขั้น ${nextStep.n} อีกชุด ${nextStep.count} ข้อ`,
            sub: scopeName,
          };
  const moreRow = startExam ? {
    icon: 'practice', onClick: () => handleContinueMore(5),
    label: ctxTopic ? 'ทำหัวข้อนี้อีก 5 ข้อ' : ctxSubj ? `ทำ${subjLabel}อีก 5 ข้อ` : 'ทำต่ออีก 5 ข้อ',
    sub: `${ctxTopic ? topicLabel : ctxSubj ? subjLabel : 'สุ่มจากทุกวิชาในปีนี้'}${pastTag}`,
  } : null;

  // The set's VetWiki page, when the whole set is one governed topic
  // (articleForQuestion is the judged mapping, so past-paper compilations
  // whose topic is the compilation's name still find theirs).
  const article = useMemo(() => {
    if (FEATURE_FLAGS.VETWIKI_ENABLED === false) return null;
    if (ctxSubj && ctxTopic && hasTopic(ctxSubj, ctxTopic)) return { subject: ctxSubj, topic: ctxTopic };
    const seen = new Map();
    for (const q of questions || []) {
      const a = articleForQuestion(q);
      if (a) seen.set(`${a.subject}|${a.topic}`, a);
      if (seen.size > 1) return null;
    }
    return seen.size === 1 ? [...seen.values()][0] : null;
  }, [questions, ctxSubj, ctxTopic]);
  const openArticle = () => { setSubject?.(article.subject); setTopic?.(article.topic); setView('knowledge'); };
  const openReview = () => setView('review');

  // One filled button, by what the moment needs. Practice showed every key
  // during the set, so fixing the misses leads; an exam showed none, so its
  // key leads. More than half wrong means the gap is the topic: its summary
  // first, the redo as the next step.
  const lowScore = autoQs.length > 0 && score.total > 0 && score.correct / score.total < 0.5;
  const redoRow = hasMissed ? { icon: 'repeat', onClick: handleRedoWrong, label: missedLabel.title, sub: missedLabel.sub } : null;
  let primary;
  let side = { label: 'ดูเฉลย', onClick: openReview };
  let nextRow;
  if (autoQs.length === 0) {
    primary = { label: 'ดูเฉลยและให้คะแนนข้อเขียน', sub: 'ตรวจเองตามเกณฑ์ในหน้าเฉลย', onClick: openReview };
    side = null;
    nextRow = null;
  } else if (isExam && hasMissed) {
    primary = { label: missedLabel.key, sub: 'คำตอบที่ถูกพร้อมเหตุผล', onClick: openReview };
    side = { label: missedLabel.title, onClick: handleRedoWrong };
    nextRow = ladderRow;
  } else if (hasMissed && lowScore && article) {
    primary = { label: 'อ่านสรุปเรื่องนี้ก่อน', sub: scopeLine || 'สรุปที่ตรวจที่มาได้ทุกส่วน', onClick: openArticle };
    nextRow = { ...redoRow, label: `แล้ว${missedLabel.title}` };
  } else if (hasMissed) {
    primary = redoRow;
    nextRow = ladderRow || moreRow;
  } else if (ladderRow && verdict.kind !== 'hold' && verdict.kind !== 'back') {
    primary = ladderRow;
    nextRow = moreRow;
  } else {
    primary = moreRow || { label: 'ดูเฉลย', sub: 'คำตอบที่ถูกพร้อมเหตุผล', onClick: openReview };
    nextRow = ladderRow;
  }

  // A link carries only bank questions: one the student wrote lives in their
  // own store and a friend's app cannot find it (lib/share-link.js).
  const shareable = shareableQuestions(questions);
  const unshareableNote = shareable.length === 0
    ? 'ข้อที่สร้างเองแชร์ผ่านลิงก์ไม่ได้'
    : shareable.length < (questions?.length || 0)
      ? `ลิงก์มีเฉพาะข้อจากคลัง ${shareable.length} ข้อ ข้อที่สร้างเองแชร์ผ่านลิงก์ไม่ได้`
      : '';
  const [sharing, setSharing] = useState(false);
  // The score picture, an option of the share sheet where it was offered
  // before (a writing set, or 70% and up). The picture is drawn when opened.
  const storySubject = new Set(questions.map((q) => q.subject)).size === 1 ? questions[0].subject : 'all';
  const storySubjectName = storySubject !== 'all' ? (SUBJECTS.find((s) => s.id === storySubject)?.name || null) : null;
  const storyDraw = useCallback(async (theme) => {
    const total = autoQs.length;
    const isWritingOnly = total === 0;
    const [mochi, strip] = await Promise.all([
      picture(MOCHI_POSE_ASSETS[isWritingOnly ? 'read' : mochiResultPose({ correct: score.correct, total }, total)]),
      picture(SCORE_STRIP),
    ]);
    return drawScoreCard({
      pct: score.pct, correct: score.correct, total, passPct: PRACTICE_PASS_PCT, mode, subjectName: storySubjectName,
      isWritingOnly, writingDone: writingAttempted, writingTotal: writingQs.length, completedAt,
    }, { theme, mochi, strip });
  }, [score.pct, score.correct, autoQs.length, mode, storySubjectName, writingAttempted, writingQs.length, completedAt]);
  const story = (autoQs.length === 0 || score.pct >= 70) ? {
    draw: storyDraw,
    fileBase: `vetmock-score-${storySubject}-${score.pct}`,
    shareText: autoQs.length === 0
      ? `เขียนตอบ ${writingAttempted}/${writingQs.length} ข้อใน VetMock ลองดูที่ vetmock.com`
      : `ทำข้อสอบ${storySubjectName ? ` ${storySubjectName}` : ''} ใน VetMock ได้ ${score.pct}% (${score.correct}/${autoQs.length}) ลองดูที่ vetmock.com`,
    alt: autoQs.length === 0
      ? `เขียนตอบ ${writingAttempted} จาก ${writingQs.length} ข้อ`
      : `${storySubjectName || 'หลายวิชา'} ได้ ${score.pct}% ถูก ${score.correct} จาก ${autoQs.length} ข้อ`,
  } : null;

  const paced = firstLook ? ' is-paced' : '';
  const timeWords = receiverDurationSec != null && receiverDurationSec > 0 ? ` ใน ${fmtDuration(receiverDurationSec)}` : '';
  const verdictWord = autoQs.length === 0 ? 'ชุดข้อเขียน' : reached ? 'ถึงเกณฑ์ซ้อมแล้ว' : 'ยังไม่ถึงเกณฑ์ซ้อม';

  return (
    <div className="vmx-results">
      <BackBar onBack={goHome} label="หน้าแรก" mochi={false} />
      <div className="vmx-results-grid">
        {/* The score, said once: verdict word, number, the fraction with the
            time, and the bar with one tick at the practice mark. */}
        <section className={`vmx-res-card vmx-res-step${paced}`} aria-label="ผลชุดนี้">
          {celebrate && <ScoreBurst strong={perfect} />}
          <div className="vmx-res-card-head">
            <div className="vmx-res-card-words">
              {scopeLine ? <p className="vmx-res-scope">{scopeLine}</p> : null}
              <p className={`vmx-res-verdict ${autoQs.length === 0 ? 'is-writing' : reached ? 'is-pass' : 'is-review'}`}>{verdictWord}</p>
              {autoQs.length > 0 ? (
                <h2 className={`vmx-score-big${reached ? ' pass' : ''}`}>
                  <DigitRoll value={score.pct} /><span className="vmx-score-unit">%</span>
                </h2>
              ) : (
                <h2 className="vmx-score-big is-writing">
                  <NavIcon name="pen" size={56} /><span className="vmx-sr-only">ข้อเขียน</span>
                </h2>
              )}
            </div>
            {/* Mochi reacts once to this result on the rig and settles on the
                still: celebrating from 80%, encouraging below. */}
            <MochiLive pose={resultPose} play={firstLook ? resultPose : null} size={72} slot="result" className="vmx-result-mochi" />
          </div>
          {autoQs.length > 0 ? (
            <>
              <p className="vmx-score-frac">
                {`ถูก ${score.correct} จาก ${autoQs.length} ข้อ${timeWords}${skipCount > 0 ? ` ข้าม ${skipCount} ข้อ` : ''}`}
              </p>
              <div className="vmx-benchmark-container" aria-label={`เกณฑ์ซ้อมของแอป ${PRACTICE_PASS_PCT}% ทำได้ ${score.pct}%`}>
                <div className="vmx-benchmark-track">
                  <div
                    className={`vmx-benchmark-fill ${reached ? 'is-pass' : 'is-review'}`}
                    style={{ width: `${Math.min(100, Math.max(0, score.pct))}%` }}
                  />
                  <div className="vmx-benchmark-target" style={{ left: `${PRACTICE_PASS_PCT}%` }}>
                    <div className="vmx-benchmark-flag">{PRACTICE_PASS_PCT}%</div>
                  </div>
                </div>
              </div>
              {writingQs.length > 0 ? <p className="vmx-res-note">{`มีข้อเขียน ${writingQs.length} ข้อ ตรวจเองตามเกณฑ์ในหน้าเฉลย`}</p> : null}
            </>
          ) : (
            <>
              <p className="vmx-score-frac">{`เขียนเสร็จ ${writingAttempted} จาก ${writingQs.length} ข้อ${timeWords}`}</p>
              <p className="vmx-res-note">{msg}</p>
            </>
          )}
        </section>

        <div className="vmx-res-actions">
          {/* A result that could not be saved says so right under the score. */}
          <ExamSaveNotice status={saveStatus} />

          {/* The one filled button: pinned under the thumb on a phone, at the
              top of this column on a wide screen. */}
          {primary ? (
            <div className={`vmx-res-thumb vmx-res-step${paced}`} style={{ '--res-delay': '70ms' }}>
              <button type="button" className="vmx-res-primary" onClick={primary.onClick}>
                <span className="vmx-res-primary-words">
                  <span className="vmx-res-primary-label">{primary.label}</span>
                  {primary.sub ? <span className="vmx-res-primary-sub">{primary.sub}</span> : null}
                </span>
                <span className="vmx-res-primary-arrow" aria-hidden="true">→</span>
              </button>
            </div>
          ) : null}

          <div className={`vmx-res-pair vmx-res-step${paced}`} style={{ '--res-delay': '126ms' }}>
            {side ? (
              <button type="button" className="vmx-btn vmx-btn-ghost" onClick={side.onClick}>{side.label}</button>
            ) : null}
            <button type="button" className="vmx-btn vmx-btn-ghost" onClick={() => setSharing(true)} aria-haspopup="dialog">
              <NavIcon name="users" size={16} /> ส่งให้เพื่อน
            </button>
          </div>

          {nextRow ? (
            <button type="button" className={`vmx-res-next vmx-res-step${paced}`} style={{ '--res-delay': '182ms' }} onClick={nextRow.onClick}>
              <span className="vmx-res-next-icon" aria-hidden="true"><NavIcon name={nextRow.icon} size={20} /></span>
              <span className="vmx-res-next-words">
                <span className="vmx-res-next-label">{nextRow.label}</span>
                {nextRow.sub ? <span className="vmx-res-next-sub">{nextRow.sub}</span> : null}
              </span>
              <span className="vmx-res-next-go" aria-hidden="true">›</span>
            </button>
          ) : null}

          {/* Old challenge links (`?qset=...&sc=`) still carry the sender's
              score, and the friend still sees the comparison. */}
          {challengeSender?.senderScore && autoQs.length > 0 && (
            <ChallengeComparisonBox
              sender={challengeSender}
              receiverScore={{ correct: score.correct, total: autoQs.length }}
              receiverTimeSec={receiverDurationSec}
            />
          )}

          {/* The pattern across the misses, on tap only. */}
          <WeakSpots
            wrongQs={autoQs.filter((q) => answerOutcome(q, answers[q.id]) === 'wrong')}
            answers={answers}
          />
          {wrongCount > 0 ? <p className="vmx-res-note">ข้อที่พลาดซ้ำครั้งที่สองจะกลับมาในคิวทบทวนเอง</p> : null}

          {autoQs.length > 0 && sessionKind !== 'redo' ? (
            <section className="vmx-next-ladder" aria-labelledby="vmx-next-ladder-title">
              <h3 id="vmx-next-ladder-title" className="vmx-next-ladder-title">บันไดฝึก</h3>
              <LadderStrip
                done={verdict.step}
                next={verdict.next !== verdict.step ? verdict.next : null}
                labelledBy="vmx-next-ladder-title"
              />
            </section>
          ) : null}

          {/* Not about this result, so after it: the first set of a day's
              day count, and once ever a daily reminder. */}
          <StreakMoment moment={moment} />
          {moment && (
            <Suspense fallback={null}>
              <ReminderOffer usual={moment.usual} />
            </Suspense>
          )}
        </div>
      </div>
      {sharing && (
        <ShareSetSheet
          questions={shareable}
          note={unshareableNote}
          story={story}
          onRace={() => { setSharing(false); setView('race'); }}
          onClose={() => setSharing(false)}
        />
      )}
    </div>
  );
}

// "6 นาที" for the line under the score; under a minute in seconds.
function fmtDuration(sec) {
  if (sec < 60) return `${sec} วินาที`;
  return `${Math.round(sec / 60)} นาที`;
}


// Format seconds → "M:SS" for human-readable elapsed time.
function fmtTimeSec(n) {
  if (!Number.isFinite(n) || n <= 0) return '—';
  const m = Math.floor(n / 60);
  const s = Math.floor(n % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}

// ─── ChallengeComparisonBox — Round 2B/3 (2026-05-18) ────────────
// Visible only when receiver finishes a challenge that included
// sender score in the URL. Round 3 adds elapsed-time comparison
// per Palm spec "เทียบคะแนน/เวลา". Layout: verdict header → 2-col
// score+time table (sender · receiver) → 1-line summary.
function ChallengeComparisonBox({ sender, receiverScore, receiverTimeSec }) {
  if (!sender?.senderScore || !receiverScore) return null;
  const s = sender.senderScore;
  const r = receiverScore;
  // Compare by accuracy %; same total in practice (same Q set), but
  // we don't strictly assume so. Win/lose/tie at the rounded-pct level.
  const sPct = s.total > 0 ? Math.round((s.correct / s.total) * 100) : 0;
  const rPct = r.total > 0 ? Math.round((r.correct / r.total) * 100) : 0;
  const verdict = rPct > sPct ? 'win' : rPct < sPct ? 'lose' : 'tie';
  const verdictMeta = {
    win:  { icon: 'trophy', label: 'คุณชนะ!',  copy: `${r.correct}/${r.total} ดีกว่า ${s.correct}/${s.total} ของผู้ส่ง, ขอบราเดอร์`, tint: 'var(--clr-right)', text: 'var(--clr-right-text)' },
    lose: { icon: 'repeat', label: 'เกือบแล้ว', copy: `ผู้ส่งได้ ${s.correct}/${s.total}, คุณ ${r.correct}/${r.total} — ลองอีกชุดดู`, tint: 'var(--clr-rose)', text: 'var(--clr-rose-text)' },
    tie:  { icon: 'users', label: 'เสมอ',     copy: `ได้เท่ากัน ${r.correct}/${r.total} ทั้งคู่ — เพื่อนสนิทแล้ว`, tint: 'var(--clr-part)', text: 'var(--clr-part-text)' },
  }[verdict];
  // Theme tokens, not fixed hex: the kicker and icon take the -text token
  // (4.5:1 on the tint in both themes), the border and the tint the base.

  // Time race: only render when BOTH sides have a valid duration. With
  // the same score, faster wins. Otherwise time is informational only
  // (we don't override the score-based verdict — score is the canonical
  // win/lose, time is the bragging-rights tiebreaker shown alongside).
  const hasTimes = Number.isFinite(sender.senderTimeSec) && sender.senderTimeSec > 0
    && Number.isFinite(receiverTimeSec) && receiverTimeSec > 0;
  const fasterReceiver = hasTimes && receiverTimeSec < sender.senderTimeSec;
  const fasterSender = hasTimes && receiverTimeSec > sender.senderTimeSec;

  return (
    <div style={{
      marginTop: 18,
      padding: '14px 16px',
      borderRadius: 14,
      background: `linear-gradient(135deg, color-mix(in srgb, ${verdictMeta.tint} 12%, transparent), color-mix(in srgb, ${verdictMeta.tint} 5%, transparent))`,
      border: `2px solid ${verdictMeta.tint}`,
    }}>
      <div className="vmx-kicker" style={{ color: verdictMeta.text, marginBottom: 6 }}>
        ผลการท้า {sender.senderName ? `จาก ${sender.senderName}` : 'จากเพื่อน'}
      </div>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: hasTimes ? 12 : 0 }}>
        <div style={{ display: 'inline-flex', flexShrink: 0, color: verdictMeta.text }} aria-hidden><NavIcon name={verdictMeta.icon} size={32} /></div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: 'var(--vmx-display)', fontWeight: 700, fontSize: 18, color: 'var(--clr-ink)' }}>
            {verdictMeta.label}
          </div>
          <div style={{ fontSize: 14, color: 'var(--clr-ink-soft)', marginTop: 2, lineHeight: 1.45 }}>
            {verdictMeta.copy}
          </div>
        </div>
      </div>

      {/* Round 3 "เทียบเวลา" side-by-side row. Only when both sides
          carry a time payload — keeps legacy links (sc but no t)
          rendering cleanly. */}
      {hasTimes && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 10,
          padding: 10,
          borderRadius: 10,
          background: 'rgba(0,0,0,0.04)',
          fontVariantNumeric: 'tabular-nums',
          fontSize: 14,
        }}>
          <div>
            <div className="vmx-eyebrow" style={{ marginBottom: 4 }}>
              ผู้ส่ง{sender.senderName ? `, ${sender.senderName}` : ''}
            </div>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--clr-ink)' }}>
              {s.correct}/{s.total}, เวลา {fmtTimeSec(sender.senderTimeSec)}
              {fasterSender && <span style={{ marginLeft: 6, fontSize: 14, color: 'var(--clr-gold-text)' }}>เร็วกว่า</span>}
            </div>
          </div>
          <div>
            <div className="vmx-eyebrow" style={{ marginBottom: 4 }}>
              คุณ
            </div>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--clr-ink)' }}>
              {r.correct}/{r.total}, เวลา {fmtTimeSec(receiverTimeSec)}
              {fasterReceiver && <span style={{ marginLeft: 6, fontSize: 14, color: 'var(--clr-sage-text)' }}>เร็วกว่า</span>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
