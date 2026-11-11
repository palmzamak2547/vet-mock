// practice.setup — how a practice set opens from a topic (src/lib/decide.js)
// Principle: default effect + a stated reason; the ladder rung the student is
// on sets the whole set, and yours wins row by row.
// Applied by TopicSelectView's topic tap, explained by ConfigView; both build
// the signals with practiceSignals() in src/lib/decide-signals.js.
import { defineDecision, intIn, validRows } from '../decide.js';
import { ladderPreset } from '../practice-ladder.js';

const capTo = (n, available) => (Number.isFinite(available) && available > 0 ? Math.min(n, Math.floor(available)) : n);
// Timely: near the subject's paper the line points at the exam rung. No day
// count, which could disagree with Home's clock; a paper already over is not
// counted (decide-signals.js reads the paper's end time).
const nearClause = (days) => (Number.isInteger(days) && days >= 0 && days <= 14
  ? ' ใกล้สอบแล้ว ลองขั้นแบบสอบใน "ปรับเอง"' : '');

export const PRACTICE_SETUP = defineDecision({
  id: 'practice.setup',
  key: 'practice.setup',
  valid: validRows({
    // The pool-size chip can offer a whole bank (several thousand questions).
    numQuestions: (v) => intIn(v, 1, 20000),
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
    // The order the set really gets: rung 1 asks for the gentle order unless
    // the level pick is on (ConfigView's `gentle`), and says "probably" as the
    // ladder does, since difficulty is mostly a proxy. The why never repeats
    // the line above it (5.214): the clock and the answer are already there.
    const order = value.pick === 'adaptive' ? 'เลือกข้อตามระดับของคุณ' : 'ข้อที่น่าจะง่ายมาก่อน';
    const base = step === 'timed' ? 'ขั้นใช้ความรู้ ขั้นล่าสุดที่คุณฝึก'
      : s.hasHistory ? `ขั้นทำความเข้าใจ ${order}`
        : `เริ่มขั้นแรก ${order}`;
    return { value, why: base + nearClause(s.daysToPaper) };
  },
  merge(auto, stored, s = {}) {
    const value = { ...auto, ...stored };
    value.numQuestions = capTo(value.numQuestions, s.available);
    value.step = value.useTimer ? 'timed' : 'understand';
    return value;
  },
});
