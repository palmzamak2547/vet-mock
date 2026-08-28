// ============================================================
// mcv-manifest.mjs — MyCourseVille dump → an ingest manifest
// ============================================================
// The MCP that talks to MyCourseVille can only be driven from a Claude
// session, not from a script, so the two halves are separate on purpose:
// the session writes a raw dump, this turns it into a manifest, and
// ingest-library.mjs is the only thing that touches credentials. You can
// read the manifest and know exactly what is about to be mirrored.
//
//   node scripts/mcv-manifest.mjs --dump=.mcv/dump.json --out=.mcv/manifest.json
//
// The dump is { courses: [...], materials: { <cv_cid>: { folders: {...} } } }.
//
// Course numbers carry the year: Chula's are 7 digits and the FIFTH is the
// study year — 3106414 is year 4. That is how the shelf gets its year
// filter without anyone hand-tagging 3,600 files.
//
// Checked against this account's own history rather than assumed, because
// the first guess (fourth digit) was wrong: every faculty course in
// 2022/1 has a 1 there, 2023/1 a 2, and so on to 2026/1 with a 5 —
// matching the year Palm actually sat them.

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

const arg = (n, d = null) => {
  const hit = process.argv.find((a) => a.startsWith(`--${n}=`));
  return hit ? hit.slice(n.length + 3) : d;
};

/** Chula course number → study year, or null when it does not follow the
 *  convention (2302171 Chemistry is a Faculty of Science service course
 *  and its digits say nothing about vet study years). */
export function yearFromCourseNo(courseNo, facultyPrefix = '31') {
  const s = String(courseNo || '');
  if (!/^\d{7}$/.test(s)) return null;
  if (!s.startsWith(facultyPrefix)) return null;
  const y = Number(s[4]);
  return y >= 1 && y <= 6 ? y : null;
}

/** MyCourseVille's own year/semester for the term the course ran in.
 *  academic_year in library_docs is a CE year, which is what these are. */
export function termOf(course) {
  const year = Number(course.year);
  const semester = Number(course.semester);
  return {
    academicYear: Number.isFinite(year) ? year : null,
    semester: [1, 2, 3].includes(semester) ? semester : null,
  };
}

export function buildManifest(dump) {
  const out = [];
  const byId = new Map((dump.courses || []).map((c) => [String(c.cv_cid), c]));

  for (const [cid, mat] of Object.entries(dump.materials || {})) {
    const course = byId.get(String(cid));
    if (!course) continue;
    const { academicYear, semester } = termOf(course);
    const year = yearFromCourseNo(course.course_no);

    for (const [folder, files] of Object.entries(mat.folders || {})) {
      for (const f of files || []) {
        if (!f?.url) continue;
        out.push({
          name: f.name || '',
          url: f.url,
          folder,
          courseNo: course.course_no,
          courseTitle: course.title,
          // `subject` mirrors curriculum.js ids elsewhere in this repo, and
          // nothing here can produce one honestly — a course number is not
          // a subject id. Left null so the shelf filters by year/term until
          // somebody maps them deliberately, rather than inventing ids that
          // silently fail to match the question bank.
          subject: null,
          year,
          semester,
          academicYear,
        });
      }
    }
  }
  // Stable order so a re-run of the manifest is diffable.
  out.sort((a, b) => (a.courseNo + a.folder + a.name).localeCompare(b.courseNo + b.folder + b.name, 'en'));
  return out;
}

function main() {
  const dumpPath = arg('dump');
  const outPath = arg('out', '.mcv/manifest.json');
  if (!dumpPath) {
    console.error('usage: node scripts/mcv-manifest.mjs --dump=<dump.json> [--out=<manifest.json>]');
    process.exit(1);
  }
  const manifest = buildManifest(JSON.parse(readFileSync(dumpPath, 'utf8')));

  const mirrorable = manifest.filter((m) => /^https?:\/\/mycourseville/i.test(m.url));
  const external = manifest.length - mirrorable.length;
  const byYear = {};
  for (const m of manifest) byYear[m.year ?? '?'] = (byYear[m.year ?? '?'] || 0) + 1;

  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, JSON.stringify(manifest, null, 1));
  console.log(`${manifest.length} file(s) → ${outPath}`);
  console.log(`  ${mirrorable.length} mirrorable, ${external} external (Drive and the like — catalogued, not copied)`);
  console.log(`  by study year: ${Object.entries(byYear).sort().map(([k, v]) => `${k}:${v}`).join('  ')}`);
}

// argv[1] is undefined when this module is imported rather than run (a
// test, or `node -e`), and reading .replace off it took the whole module
// down with it.
const entry = process.argv[1]?.replace(/\\/g, '/');
if (entry && import.meta.url.endsWith(entry.split('/').pop())) main();
