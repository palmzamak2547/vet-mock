// ============================================================
// AGENTS.md and the roadmap — the guide states what is true now
// ============================================================
// Every agent starts from AGENTS.md, and the data-integrity roadmap is what
// the next person restructuring the gate will plan from. A wrong fact there
// sends work in the wrong direction, so the facts that went wrong once are
// pinned here.

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (path) => readFileSync(new URL(path, import.meta.url), 'utf8').replace(/\r\n/g, '\n');
const agents = read('../../AGENTS.md');
const roadmap = read('../../docs/DATA-INTEGRITY-ROADMAP.md');

// The text from a heading to the next heading of the same or higher level.
const section = (text, startsWith) => {
  const lines = text.split('\n');
  const at = lines.findIndex((l) => l.startsWith(startsWith));
  assert.ok(at >= 0, `missing heading ${startsWith}`);
  const level = startsWith.match(/^#+/)[0].length;
  const end = lines.findIndex((l, i) => i > at && /^#+ /.test(l) && l.match(/^#+/)[0].length <= level);
  return lines.slice(at, end < 0 ? undefined : end).join('\n');
};

// Thai "วินาที" (second) contains "นาที" (minute); a minute is นาที not preceded by วิ.
const MINUTES = /(?<!วิ)นาที/;

test('the gate timing is the measured one: the build takes seconds, not 23 minutes (STAB-03)', () => {
  assert.doesNotMatch(agents, /48-minute/, 'no preserved gate log is 48 minutes long');
  const g = section(roadmap, '## G.');
  const rows = g.split('\n').filter((l) => /^\|\s*`[^`]+`/.test(l));
  const build = rows.filter((l) => /^\|\s*`(vite )?build`/.test(l));
  assert.ok(build.length > 0, 'the G table has a build row');
  for (const row of build) assert.doesNotMatch(row, MINUTES, `build is measured in seconds: ${row}`);
  const playwright = rows.filter((l) => /^\|\s*`playwright`/.test(l));
  assert.ok(playwright.length > 0, 'the G table has a playwright row');
});

test('every timing in the G table names the log line or CI run it came from (STAB-03)', () => {
  const g = section(roadmap, '## G.');
  const rows = g.split('\n').filter((l) => /^\|\s*`[^`]+`/.test(l) && /\d/.test(l));
  assert.ok(rows.length >= 4, 'build, lint:all, test:unit and playwright each have a row');
  for (const row of rows) {
    assert.match(row, /gate[\w.-]*\s*`|CI run \d{8,}/, `name the source of: ${row}`);
  }
});
