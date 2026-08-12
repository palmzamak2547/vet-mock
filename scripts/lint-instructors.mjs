#!/usr/bin/env node

// Quality gate for the public instructor directory. It prevents stale
// spellings, source-free profiles, and real lecturer labels that do not map to
// a canonical profile from silently returning to the curriculum.

import { SUBJECTS_BY_YEAR } from '../src/data/curriculum.js';
import {
  ALL_INSTRUCTORS,
  INSTRUCTORS,
  getInstructorByLecturerString,
} from '../src/data/instructors.js';

const MINIMUM_PROFILE_COUNT = 140;
const ALLOWED_STATUSES = new Set(['faculty', 'emeritus', 'researcher', 'external', 'historical']);
const STALE_PRIMARY_SPELLINGS = [
  'ฐูนิชา ชาญชัยเดชาชัย',
  'Ekasingh Sareung',
  'Kannaporn Suriyaphol',
  'Sompis Junlaboothdi',
];

const PLACEHOLDER_PATTERNS = [
  /^TBD\b/i,
  /^COM III Final\b/i,
  /^Term Paper Group\b/i,
  /^Surgery staff\b/i,
  /^Surgery\/สูติฯ staff$/i,
  /^ST, TS, RJ, JSi, ES$/i,
  /^CN, CK, PD, AC, TA, SP \+ Husb Staff$/i,
  /^อ\.วิมล \+ อ\.เอกพล \(Surgery\)$/u,
  /^CULI Eng Vet Prof II$/i,
  /^DLD guest$/i,
  /^อ\.น้ำ$/u,
];

const ORGANIZATION_SLUGS = new Set(['culi-eng-vet-prof-i']);
const errors = [];
const warnings = [];

function fail(message) {
  errors.push(message);
}

function validHttpUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

function normalizedIdentity(value = '') {
  return String(value)
    .normalize('NFKC')
    .toLocaleLowerCase('th')
    .replace(/[^\p{L}\p{N}]+/gu, '');
}

function collectCurriculum(value, context = {}, result = { lecturers: [], slugs: [] }) {
  if (Array.isArray(value)) {
    value.forEach((entry) => collectCurriculum(entry, context, result));
    return result;
  }
  if (!value || typeof value !== 'object') return result;

  const nextContext = {
    year: value.year ?? context.year,
    subjectId: value.code && value.id ? value.id : context.subjectId,
    topicId: value.lecturer && value.id ? value.id : context.topicId,
  };

  for (const [key, entry] of Object.entries(value)) {
    if (key === 'lecturer' && typeof entry === 'string') {
      result.lecturers.push({ value: entry, ...nextContext });
      continue;
    }
    if (key === 'vault_lecturers' && Array.isArray(entry)) {
      entry.forEach((slug) => result.slugs.push({ slug, ...nextContext }));
      continue;
    }
    collectCurriculum(entry, nextContext, result);
  }
  return result;
}

if (ALL_INSTRUCTORS.length < MINIMUM_PROFILE_COUNT) {
  fail(`directory shrank to ${ALL_INSTRUCTORS.length}; expected at least ${MINIMUM_PROFILE_COUNT}`);
}

const seenSlugs = new Set();
const seenNames = new Map();
for (const instructor of ALL_INSTRUCTORS) {
  const label = instructor.slug || '(missing slug)';
  if (!instructor.slug) fail('profile missing slug');
  if (seenSlugs.has(instructor.slug)) fail(`duplicate slug: ${instructor.slug}`);
  seenSlugs.add(instructor.slug);

  for (const [field, value] of [['nameEn', instructor.nameEn], ['nameTh', instructor.nameTh]]) {
    if (!value?.trim()) fail(`${label}: missing ${field}`);
    const identity = normalizedIdentity(value);
    if (!identity) continue;
    const existing = seenNames.get(identity);
    if (existing && existing !== instructor.slug) fail(`duplicate canonical name: ${value} (${existing}, ${instructor.slug})`);
    seenNames.set(identity, instructor.slug);
  }

  if (/^(?:prof(?:essor)?|assoc(?:iate)?\s+prof(?:essor)?|asst\.?\s+prof(?:essor)?|dr\.?|dvm|md)\b/i.test(instructor.nameEn || '')) {
    fail(`${label}: English canonical name still contains a title (${instructor.nameEn})`);
  }
  if (/^[^,]+,\s*[A-Z](?:\.|$)/.test(instructor.nameEn || '')) {
    fail(`${label}: English canonical name is an abbreviated citation (${instructor.nameEn})`);
  }
  if (!ALLOWED_STATUSES.has(instructor.status)) fail(`${label}: invalid status ${instructor.status}`);
  if (!instructor.department?.trim()) fail(`${label}: missing department/unit`);
  if (!instructor.institution?.trim()) fail(`${label}: missing institution`);
  if (!Array.isArray(instructor.areas) || instructor.areas.length === 0) fail(`${label}: missing research areas`);
  if (!Array.isArray(instructor.papers) || instructor.papers.length === 0) fail(`${label}: missing source-verified research`);
  if (instructor.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(instructor.email)) fail(`${label}: invalid email`);

  for (const paper of instructor.papers || []) {
    if (!paper.title?.trim()) fail(`${label}: publication missing title`);
    if (!Number.isInteger(paper.year) || paper.year < 1900 || paper.year > 2100) fail(`${label}: publication has invalid year (${paper.title})`);
    if (!validHttpUrl(paper.url)) fail(`${label}: publication has invalid URL (${paper.title})`);
    if (!paper.verifiedBy?.trim()) fail(`${label}: publication missing verification source (${paper.title})`);
  }

  const sources = instructor.verification?.sources;
  if (!Array.isArray(sources) || sources.length === 0) fail(`${label}: missing identity verification sources`);
  for (const source of sources || []) {
    if (!source.label?.trim() || !validHttpUrl(source.url)) fail(`${label}: invalid verification source`);
  }
  if (instructor.verification?.publicationsFound !== instructor.papers?.length) {
    fail(`${label}: publicationsFound does not match selected publication count`);
  }
}

const curriculum = collectCurriculum(SUBJECTS_BY_YEAR);
const lecturerValues = [...new Map(curriculum.lecturers.map((entry) => [entry.value, entry])).values()];

for (const entry of lecturerValues) {
  const placeholder = PLACEHOLDER_PATTERNS.some((pattern) => pattern.test(entry.value));
  if (!placeholder && !getInstructorByLecturerString(entry.value)) {
    fail(`unmapped lecturer "${entry.value}" (${entry.subjectId || 'unknown subject'} / ${entry.topicId || 'unknown topic'})`);
  }
  if (STALE_PRIMARY_SPELLINGS.some((spelling) => entry.value.includes(spelling))) {
    fail(`stale lecturer spelling remains in curriculum: ${entry.value}`);
  }
}

const curriculumSlugs = [...new Set(curriculum.slugs.map((entry) => entry.slug))];
for (const slug of curriculumSlugs) {
  if (!INSTRUCTORS[slug] && !ORGANIZATION_SLUGS.has(slug)) fail(`unknown vault_lecturers slug: ${slug}`);
}

const nicknameOnly = lecturerValues.filter((entry) => /^อ\.น้ำ$/u.test(entry.value));
if (nicknameOnly.length) {
  warnings.push('nickname-only label "อ.น้ำ" is intentionally unresolved; no reliable public source identifies the full name');
}

if (errors.length) {
  console.error(`Instructor lint failed with ${errors.length} error(s):`);
  errors.forEach((error) => console.error(`  - ${error}`));
  process.exitCode = 1;
} else {
  console.log(`Instructor lint passed: ${ALL_INSTRUCTORS.length} profiles, ${lecturerValues.length} unique curriculum lecturer labels, ${curriculumSlugs.length} profile slugs.`);
}

warnings.forEach((warning) => console.warn(`Warning: ${warning}`));
