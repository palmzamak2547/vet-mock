// practice.setup — how a practice set opens from a topic (src/lib/decide.js)
// Principle: default effect + a stated reason; the ladder rung the student is
// on sets the whole set, and yours wins row by row.
// Applied by TopicSelectView's topic tap, explained by ConfigView; both build
// the signals with practiceSignals() in src/lib/decide-signals.js.
import { defineDecision, intIn, validRows } from '../decide.js';
import { ladderPreset } from '../practice-ladder.js';

const capTo = (n, available) => (Number.isFinite(available) && available > 0 ? Math.min(n, Math.floor(available)) : n);
const daysClause = (days) => (!Number.isInteger(days) || days < 0 || days > 14 ? ''
  : days === 0 ? ', สอบวิชานี้วันนี้' : `, อีก ${days} วันสอบวิชานี้`);

export const PRACTICE_SETUP = defineDecision({
  id: 'practice.setup',
  key: 'practice.setup',
  valid: validRows({
    numQuestions: (v) => intIn(v, 1, 1000),
    useTimer: (v) => typeof v === 'boolean',
    timePerQ: (v) => intIn(v, 5, 3600),
    instantFeedback: (v) => typeof v === 'boolean',
    pick: (v) => v === 'random' || v === 'adaptive',
  }),
  // The exact set a topic tap has always made: ladderPreset on the recalled
  // rung (never the exam rung), capped to the pool.
  auto(s = {}) {
    const step = s.step === 'timed' ? 'timed' : 'understand';
    const available = Number.isFinite(s.available) && s.available > 0 ? s.available : null;
    const preset = ladderPreset(step, { available, timePerQ: s.timePerQ });
    const value = {
      step,
      numQuestions: preset.numQuestions,
      useTimer: preset.useTimer,
      timePerQ: preset.timePerQ,
      // Rung 1 is built on the answer after every question; rung 2 keeps the
      // student's feedback switch, as the topic tap always has.
      instantFeedback: preset.useTimer ? s.instantFeedback !== false : true,
      pick: s.pick === 'adaptive' ? 'adaptive' : 'random',
    };
    const base = step === 'timed' ? 'ขั้นใช้ความรู้ที่คุณขึ้นมาแล้ว จับเวลาทีละข้อ'
      : s.hasHistory ? 'ขั้นทำความเข้าใจ ข้อง่ายก่อน เห็นเฉลยทุกข้อ'
        : 'เริ่มขั้นแรก ข้อง่ายก่อน เห็นเฉลยทุกข้อ';
    return { value, why: base + daysClause(s.daysToPaper) };
  },
  merge(auto, stored, s = {}) {
    const value = { ...auto, ...stored };
    value.numQuestions = capTo(value.numQuestions, s.available);
    value.step = value.useTimer ? 'timed' : 'understand';
    return value;
  },
});
