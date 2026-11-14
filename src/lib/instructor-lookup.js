// ============================================================
// instructor-lookup.js — a lecturer string to the person it names
// ============================================================
// Curriculum topics carry free-text lecturer strings ("ผศ.น.สพ.ดร. ... (KB)",
// "Dr. ...", a nickname). This turns one into the directory entry it names,
// or null. It works on any list of rows that carry names: the full directory
// (src/data/instructors.js) and the slim index the topic screen and the
// search palette load (src/data/instructor-index.js) share this one matcher,
// so a string resolves to the same person whichever list is in memory
// (tests/unit/instructor-index.test.mjs checks every curriculum string).
// ============================================================

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

/** (lecturerString) => the row of `list` it names, or null. */
export function createInstructorLookup(list) {
  const index = list.map((instructor) => ({
    instructor,
    names: [
      instructor.nameEn,
      instructor.nameTh,
      instructor.nickname,
      ...(instructor.aliases || []),
    ].map(normalizeInstructorName).filter((name) => name.length >= 4),
  }));

  return function findInstructor(lecturerString) {
    const query = normalizeInstructorName(lecturerString);
    if (query.length < 4) return null;

    for (const entry of index) {
      if (entry.names.includes(query)) return entry.instructor;
    }

    // Curriculum labels sometimes append a role or topic after the name.
    // Only accept containment for reasonably long values to avoid collisions.
    for (const entry of index) {
      if (entry.names.some((name) => (
        Math.min(name.length, query.length) >= 7
        && (query.includes(name) || name.includes(query))
      ))) return entry.instructor;
    }

    return null;
  };
}
