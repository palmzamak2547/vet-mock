// Canonical instructor lookup layer.
// The generated directory is source-audited from current university rosters,
// official researcher pages, and DOI/PubMed metadata. Keep aliases so older
// curriculum labels and common transliteration variants still resolve.
//
// This module carries every profile's papers and sources (about 1.2 MB), so
// only FacultyView and an opened profile (InstructorProfile.jsx) import it.
// A screen that needs to know who has a profile, or to search names, reads
// instructor-index.js instead.

import { INSTRUCTOR_DIRECTORY } from './instructors-directory.js';
import { createInstructorLookup } from '../lib/instructor-lookup.js';

export const INSTRUCTORS = Object.fromEntries(
  INSTRUCTOR_DIRECTORY.map((instructor) => [instructor.slug, instructor]),
);

export const ALL_INSTRUCTORS = INSTRUCTOR_DIRECTORY;

export function getInstructorBySlug(slug) {
  return INSTRUCTORS[slug] || null;
}

export const getInstructorByLecturerString = createInstructorLookup(ALL_INSTRUCTORS);
