// Canonical instructor lookup layer.
// The generated directory is source-audited from current university rosters,
// official researcher pages, and DOI/PubMed metadata. Keep aliases so older
// curriculum labels and common transliteration variants still resolve.

import { INSTRUCTOR_DIRECTORY } from './instructors-directory.js';

export const INSTRUCTORS = Object.fromEntries(
  INSTRUCTOR_DIRECTORY.map((instructor) => [instructor.slug, instructor]),
);

export const ALL_INSTRUCTORS = INSTRUCTOR_DIRECTORY;

const TITLE_PATTERN = /(?:ศาสตราจารย์|รองศาสตราจารย์|ผู้ช่วยศาสตราจารย์|professor|associate professor|assistant professor|assoc\.?\s*prof\.?|asst\.?\s*prof\.?|prof\.?|lecturer|instructor|นายสัตวแพทย์|สัตวแพทย์หญิง|น\.สพ\.|สพ\.ญ\.|ผศ\.|รศ\.|ศ\.|อ\.|ดร\.|dr\.?|dvm|phd)/giu;

function normalizeInstructorName(value = '') {
  return String(value)
    .normalize('NFKC')
    .replace(/\([^)]*\)|\[[^\]]*\]/g, ' ')
    .replace(TITLE_PATTERN, ' ')
    .toLocaleLowerCase('th')
    .replace(/[^\p{L}\p{N}]+/gu, '')
    .trim();
}

const LOOKUP_INDEX = ALL_INSTRUCTORS.map((instructor) => ({
  instructor,
  names: [
    instructor.nameEn,
    instructor.nameTh,
    instructor.nickname,
    ...(instructor.aliases || []),
  ].map(normalizeInstructorName).filter((name) => name.length >= 4),
}));

export function getInstructorBySlug(slug) {
  return INSTRUCTORS[slug] || null;
}

export function getInstructorByLecturerString(lecturerString) {
  const query = normalizeInstructorName(lecturerString);
  if (query.length < 4) return null;

  for (const entry of LOOKUP_INDEX) {
    if (entry.names.includes(query)) return entry.instructor;
  }

  // Curriculum labels sometimes append a role or topic after the name.
  // Only accept containment for reasonably long values to avoid collisions.
  for (const entry of LOOKUP_INDEX) {
    if (entry.names.some((name) => (
      Math.min(name.length, query.length) >= 7
      && (query.includes(name) || name.includes(query))
    ))) return entry.instructor;
  }

  return null;
}
