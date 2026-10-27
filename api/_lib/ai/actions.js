// ============================================================
// ai/actions.js — a button into vetmock.com, re-grounded before it is shown
// ============================================================
// The chat may offer to open something in the app: a practice set, a
// subject's document shelf, a VetWiki article, a feature. Same trust rule as
// /api/agent-action: nothing reaches the student unless agent-actions.js's
// validator accepts it against the catalog built from live app data. A
// subject, topic or feature id the planner made up is rejected there, and
// the chat says so instead of linking somewhere that does not exist.
//
// The button text and the sentence under it are built here from the
// validated data, never taken from the model, so they cannot promise more
// than the link does. A practice button opens a set of REAL bank questions
// of that subject in the exam screen (the shared-quiz link), because a
// practice preset has no URL of its own.
// ============================================================

import { buildCatalog, validateAction } from '../agent-actions.js';
import { FEATURES } from '../../../src/lib/feature-registry.js';
import { featureLink, librarySubjectLink, questionSetLink, wikiLink } from './links.js';
import { sample } from './quiz.js';
import { clip } from './text.js';

let catalogCache = null;
const catalog = () => (catalogCache ||= buildCatalog());
const FEATURE_BY_ID = new Map(FEATURES.map((f) => [f.id, f]));

/** The model-free action request a plan describes, in agent-actions' shape. */
export function actionRequest({ type, subject, feature, num, wiki } = {}) {
  if (type === 'practice') return { type, params: { subject: subject || 'all', numQuestions: num || 10 } };
  if (type === 'library') return { type, params: { subject } };
  if (type === 'wiki') return wiki ? { type, params: { subject: wiki.subject, topic: wiki.topic } } : null;
  if (type === 'feature') return { type, params: { id: feature } };
  return null;
}

/**
 * @param {object} request   { type, subject, feature, num, wiki: { subject, topic } }
 * @param {object} o
 * @param {object} [o.corpus]  loadCorpus() result, for a practice set
 * @returns {{ card: object|null, reason?: string }}
 */
export function buildActionCard(request, { corpus = null, rng = Math.random } = {}) {
  const parsed = actionRequest(request);
  if (!parsed) return { card: null, reason: 'ยังไม่มีสิ่งที่ตรงกับคำสั่งนี้ในแอป' };
  const verdict = validateAction(parsed, catalog());
  if (!verdict.ok) return { card: null, reason: verdict.reason };
  const a = verdict.action;

  if (a.type === 'practice') {
    const n = a.invoke.numQuestions;
    const pool = (corpus?.docs || []).filter((d) => d.kind === 'question' && (a.invoke.subject === 'all' || d.subject === a.invoke.subject));
    const picked = sample(pool, Math.min(n, pool.length), rng).map((d) => d.q);
    const url = picked.length ? questionSetLink(picked) : null;
    if (!url) return { card: null, reason: 'วิชานี้ยังไม่มีข้อสอบในคลังที่เปิดเป็นชุดฝึกได้' };
    const name = a.invoke.subject === 'all' ? 'ทุกวิชา' : a.subjectName;
    return {
      card: {
        type: 'action',
        label: `เริ่มฝึก ${name} ${picked.length} ข้อ`,
        say: `สุ่มข้อสอบจริงจากคลัง ${name} ${picked.length} ข้อ แล้วเปิดในหน้าทำข้อสอบของ VetMock`,
        url,
      },
    };
  }
  if (a.type === 'library') {
    return {
      card: {
        type: 'action',
        label: `เปิดคลังเอกสาร ${clip(a.subjectName, 40)}`,
        say: `เปิดชั้นเอกสารของวิชา ${a.subjectName} ใน VetMock`,
        url: librarySubjectLink(a.subject),
      },
    };
  }
  if (a.type === 'wiki') {
    return {
      card: {
        type: 'action',
        label: `อ่าน ${clip(a.title, 48)}`,
        say: 'เปิดบทความนี้ใน VetWiki ของ VetMock',
        url: wikiLink(a.subject, a.topic),
      },
    };
  }
  if (a.type === 'feature') {
    const url = featureLink(FEATURE_BY_ID.get(a.id));
    // A feature without an address (a calculator popup) can be described,
    // never linked.
    if (!url) return { card: null, reason: 'ฟีเจอร์นี้เปิดได้จากในแอปเท่านั้น' };
    return {
      card: {
        type: 'action',
        label: `เปิด ${clip(a.label, 40)}`,
        say: `ไปที่หน้า ${a.label} บน vetmock.com`,
        url,
      },
    };
  }
  return { card: null, reason: 'ยังไม่มีสิ่งที่ตรงกับคำสั่งนี้ในแอป' };
}
