// Daily Quests — Duolingo-style. 3 quests reset at local midnight,
// seeded by date so the cohort sees a stable set (Wordle-pattern).
// Each quest tracks progress against a target; claim button awards XP.
// Bonus "🎉 ครบ" card unlocked when all 3 are claimed (+30 XP).
//
// Storage: one key per day → `vmx-quests-YYYY-MM-DD`. Old keys are
// pruned lazily on read (we cap retention at ~30 days).
//
// Events:
//   • `vmx-quests-changed` fires on progress / claim / generation
//
// Event types this module accepts via `recordQuestEvent`:
//   • 'answered'         { subject: string, correct: boolean }
//   • 'sr-graded'        { quality: 0..3 }
//   • 'notes-read'       { subject: string, topic: string }
//   • 'flashcard-created' { source?: string }

import { awardXp, XP_AWARDS } from './xp.js';
import { SUBJECTS } from '../data/curriculum.js';

// Subject-locked quests only make sense for the year that owns the subject —
// a ปี 3 student handed "ทำ 10 ข้อ COM III" (a year-4/5 subject) gets a daily
// mission they cannot complete without leaving their own year.
const SUBJECT_YEAR = new Map(SUBJECTS.map((s) => [s.id, s.year]));
function templateFitsYear(t, year) {
  if (!t.subject || !Number.isFinite(year)) return true;
  return SUBJECT_YEAR.get(t.subject) === year;
}

const EVENT_NAME = 'vmx-quests-changed';
const STORAGE_PREFIX = 'vmx-quests-';
const STREAK_KEY = 'vmx-quests-streak';
const BONUS_XP = 30;

// ── Quest template pool (~16) ─────────────────────────────────────
// Each template:
//   id           — stable string (used in seeded RNG + claimed bookkeeping)
//   label        — Thai-mixed copy. {N} is replaced with `target`.
//   icon         — leading glyph for the card
//   target       — integer threshold to complete
//   xp           — reward on claim
//   match(event) — predicate over { type, payload } returning a delta (number) to add
const QUEST_POOL = [
  {
    id: 'answer-10-any',
    label: 'ทำ {N} ข้อ (วิชาอะไรก็ได้)',
    icon: '🎯',
    target: 10,
    xp: 20,
    match: ({ type }) => (type === 'answered' ? 1 : 0),
  },
  {
    id: 'answer-15-any',
    label: 'ทำ {N} ข้อ (วิชาอะไรก็ได้)',
    icon: '📝',
    target: 15,
    xp: 25,
    match: ({ type }) => (type === 'answered' ? 1 : 0),
  },
  {
    id: 'answer-5-correct',
    label: 'ตอบถูก {N} ข้อ',
    icon: '✅',
    target: 5,
    xp: 20,
    match: ({ type, payload }) => (type === 'answered' && payload?.correct ? 1 : 0),
  },
  {
    id: 'answer-10-com3',
    label: 'ทำ {N} ข้อ COM III',
    icon: '🩺',
    target: 10,
    xp: 20,
    subject: 'com3',
    match: ({ type, payload }) => (type === 'answered' && payload?.subject === 'com3' ? 1 : 0),
  },
  {
    id: 'answer-10-com4',
    label: 'ทำ {N} ข้อ COM IV',
    icon: '🐾',
    target: 10,
    xp: 20,
    subject: 'com4',
    match: ({ type, payload }) => (type === 'answered' && payload?.subject === 'com4' ? 1 : 0),
  },
  {
    id: 'answer-10-com5',
    label: 'ทำ {N} ข้อ COM V',
    icon: '💉',
    target: 10,
    xp: 20,
    subject: 'com5',
    match: ({ type, payload }) => (type === 'answered' && payload?.subject === 'com5' ? 1 : 0),
  },
  {
    id: 'answer-8-repro',
    label: 'ทำ {N} ข้อ Repro',
    icon: '🐣',
    target: 8,
    xp: 18,
    subject: 'repro',
    match: ({ type, payload }) => (type === 'answered' && payload?.subject === 'repro' ? 1 : 0),
  },
  {
    id: 'answer-8-exotic',
    label: 'ทำ {N} ข้อ Exotic',
    icon: '🦜',
    target: 8,
    xp: 18,
    subject: 'exotic',
    match: ({ type, payload }) => (type === 'answered' && payload?.subject === 'exotic' ? 1 : 0),
  },
  {
    id: 'review-5-sr',
    label: 'ทบทวน {N} SR cards',
    icon: '🔁',
    target: 5,
    xp: 15,
    match: ({ type }) => (type === 'sr-graded' ? 1 : 0),
  },
  {
    id: 'review-10-sr',
    label: 'ทบทวน {N} SR cards',
    icon: '🧠',
    target: 10,
    xp: 22,
    match: ({ type }) => (type === 'sr-graded' ? 1 : 0),
  },
  {
    id: 'sr-easy-3',
    label: 'ตอบ SR ระดับ Easy {N} ครั้ง',
    icon: '⭐',
    target: 3,
    xp: 15,
    match: ({ type, payload }) => (type === 'sr-graded' && (payload?.quality ?? 0) >= 3 ? 1 : 0),
  },
  {
    id: 'read-1-topic',
    label: 'อ่าน {N} หัวข้อใน NotesView',
    icon: '📖',
    target: 1,
    xp: 10,
    match: ({ type }) => (type === 'notes-read' ? 1 : 0),
  },
  {
    id: 'read-3-topics',
    label: 'อ่าน {N} หัวข้อใน NotesView',
    icon: '📚',
    target: 3,
    xp: 18,
    match: ({ type }) => (type === 'notes-read' ? 1 : 0),
  },
  {
    id: 'flashcard-1',
    label: 'สร้าง {N} flashcard จาก summary',
    icon: '✨',
    target: 1,
    xp: 15,
    match: ({ type }) => (type === 'flashcard-created' ? 1 : 0),
  },
  {
    id: 'flashcard-3',
    label: 'สร้าง {N} flashcards จาก summary',
    icon: '🃏',
    target: 3,
    xp: 22,
    match: ({ type }) => (type === 'flashcard-created' ? 1 : 0),
  },
  {
    id: 'answer-20-mixed',
    label: 'ทำ {N} ข้อแบบ marathon',
    icon: '🏃',
    target: 20,
    xp: 35,
    match: ({ type }) => (type === 'answered' ? 1 : 0),
  },
];

export function getQuestPoolSize() {
  return QUEST_POOL.length;
}

// ── Date helpers ──────────────────────────────────────────────────
function todayKey() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function storageKeyFor(date) {
  return STORAGE_PREFIX + date;
}

// Seeded RNG so all users on the same date get the same daily 3.
// Mulberry32 + FNV-1a 32-bit hash of the date string → cheap, deterministic.
function hashSeed(str) {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

function mulberry32(seed) {
  let s = seed >>> 0;
  return function next() {
    s = (s + 0x6D2B79F5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pickDailyTemplates(date, year) {
  const rng = mulberry32(hashSeed(date + '-vetmock' + (Number.isFinite(year) ? `-y${year}` : '')));
  const pool = QUEST_POOL.filter((t) => templateFitsYear(t, year));
  const picked = [];
  for (let i = 0; i < 3 && pool.length > 0; i++) {
    const idx = Math.floor(rng() * pool.length);
    picked.push(pool.splice(idx, 1)[0]);
  }
  return picked;
}

// ── In-memory cache to avoid JSON.parse churn on every render ─────
let cache = { date: '', state: null };

function readState(date, year) {
  if (cache.date === date && cache.state) return cache.state;
  try {
    const raw = typeof window !== 'undefined' ? window.localStorage?.getItem(storageKeyFor(date)) : null;
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.quests)) {
        cache = { date, state: parsed };
        return parsed;
      }
    }
  } catch {}
  // Generate fresh
  const templates = pickDailyTemplates(date, year);
  const fresh = {
    date,
    quests: templates.map((t) => ({
      id: t.id,
      label: t.label.replace('{N}', String(t.target)),
      icon: t.icon,
      target: t.target,
      xp: t.xp,
      progress: 0,
      claimed: false,
    })),
    bonusClaimed: false,
  };
  persist(fresh);
  pruneOldKeys(date);
  cache = { date, state: fresh };
  return fresh;
}

function persist(state) {
  try {
    window.localStorage?.setItem(storageKeyFor(state.date), JSON.stringify(state));
    cache = { date: state.date, state };
  } catch {}
}

function pruneOldKeys(currentDate) {
  try {
    const cutoffMs = Date.now() - 30 * 24 * 60 * 60 * 1000;
    for (let i = 0; i < (window.localStorage?.length || 0); i++) {
      const k = window.localStorage.key(i);
      if (!k || !k.startsWith(STORAGE_PREFIX) || k === storageKeyFor(currentDate)) continue;
      const date = k.slice(STORAGE_PREFIX.length);
      const t = Date.parse(date);
      if (Number.isFinite(t) && t < cutoffMs) {
        window.localStorage.removeItem(k);
      }
    }
  } catch {}
}

function dispatch() {
  try {
    window.dispatchEvent(new CustomEvent(EVENT_NAME));
  } catch {}
}

// ── Public API ────────────────────────────────────────────────────

export function getTodaysQuests(year) {
  const date = todayKey();
  const state = readState(date, year);
  return state.quests.map((q) => ({
    ...q,
    complete: q.progress >= q.target,
    pct: Math.min(100, Math.round((q.progress / Math.max(1, q.target)) * 100)),
  }));
}

export function getBonusState(year) {
  const state = readState(todayKey(), year);
  const allClaimed = state.quests.length > 0 && state.quests.every((q) => q.claimed);
  return {
    available: allClaimed && !state.bonusClaimed,
    claimed: state.bonusClaimed,
    xp: BONUS_XP,
  };
}

export function recordQuestEvent(eventType, payload = {}) {
  const date = todayKey();
  const state = readState(date);
  const event = { type: eventType, payload };
  let changed = false;
  const nextQuests = state.quests.map((q) => {
    if (q.claimed || q.progress >= q.target) return q;
    const tpl = QUEST_POOL.find((t) => t.id === q.id);
    if (!tpl) return q;
    const delta = tpl.match(event);
    if (!delta) return q;
    changed = true;
    return { ...q, progress: Math.min(q.target, q.progress + delta) };
  });
  if (!changed) return;
  persist({ ...state, quests: nextQuests });
  dispatch();
}

export function claimQuestReward(questId) {
  const date = todayKey();
  const state = readState(date);
  const quest = state.quests.find((q) => q.id === questId);
  if (!quest || quest.claimed || quest.progress < quest.target) return false;
  const nextQuests = state.quests.map((q) => (q.id === questId ? { ...q, claimed: true } : q));
  persist({ ...state, quests: nextQuests });
  awardXp(quest.xp, 'quest:' + questId);
  // Streak credit — mark today as a "quest day" if not already
  bumpQuestStreak(date);
  dispatch();
  return true;
}

export function claimBonusReward() {
  const date = todayKey();
  const state = readState(date);
  if (state.bonusClaimed) return false;
  const allClaimed = state.quests.length > 0 && state.quests.every((q) => q.claimed);
  if (!allClaimed) return false;
  persist({ ...state, bonusClaimed: true });
  awardXp(BONUS_XP, 'quest:bonus');
  dispatch();
  return true;
}

// ── Streak (consecutive days with ≥1 quest claimed) ───────────────
function readStreak() {
  try {
    const raw = window.localStorage?.getItem(STREAK_KEY);
    if (!raw) return { streak: 0, lastDate: '' };
    return JSON.parse(raw);
  } catch {
    return { streak: 0, lastDate: '' };
  }
}

function bumpQuestStreak(date) {
  try {
    const cur = readStreak();
    if (cur.lastDate === date) return;
    const yest = new Date(date + 'T00:00:00');
    yest.setDate(yest.getDate() - 1);
    const y = yest.getFullYear();
    const m = String(yest.getMonth() + 1).padStart(2, '0');
    const d = String(yest.getDate()).padStart(2, '0');
    const yesterday = `${y}-${m}-${d}`;
    const nextStreak = cur.lastDate === yesterday ? cur.streak + 1 : 1;
    window.localStorage?.setItem(STREAK_KEY, JSON.stringify({ streak: nextStreak, lastDate: date }));
  } catch {}
}

export function getQuestStreak() {
  return readStreak().streak || 0;
}

export const QUEST_EVENT = EVENT_NAME;
