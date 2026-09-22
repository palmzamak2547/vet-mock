// ============================================================
// AGENTS.md and the roadmap — the guide states what is true now
// ============================================================
// Every agent starts from AGENTS.md, and the data-integrity roadmap is what
// the next person restructuring the gate will plan from. A wrong fact there
// sends work in the wrong direction, so the facts that went wrong once are
// pinned here.

import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';

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

// ── ORG-15: the guide above the session log ─────────────────────
// The guide is everything before the first dated entry or the session-log
// heading. Every path it names must exist, so a guide line cannot keep
// pointing at a file, folder or script that was removed.
const GUIDE_END = /^## (?:\d{4}-\d{2}-\d{2}\b|.*\bSession log\b)/m;
const guideOf = (text) => {
  const m = text.match(GUIDE_END);
  return m ? text.slice(0, m.index) : text;
};
const guide = guideOf(agents);
const ROOT = new URL('../../', import.meta.url);
const TOP = /^(?:src|api|scripts|tests|docs|supabase|public|wiki|db)\//;

test('the guide states none of the facts that went stale (ORG-15)', () => {
  assert.doesNotMatch(agents, /v5\.122\.1/, 'the source version is read from package.json, not written here');
  assert.doesNotMatch(agents, /db:push/, 'the schema lives in supabase/migrations, not a pushed drizzle schema');
  assert.doesNotMatch(agents, /shadcn-space/, 'no component folder of that name exists');
});

test('every repo path the guide names exists (ORG-15)', () => {
  const missing = [];
  for (const [, token] of guide.matchAll(/`([^`\s]+)`/g)) {
    if (!TOP.test(token)) continue;
    // A glob or brace names a family of files; its folder must still exist.
    const glob = token.search(/[*{<]/);
    const path = glob < 0 ? token : token.slice(0, token.lastIndexOf('/', glob) + 1);
    if (!existsSync(new URL(path, ROOT))) missing.push(token);
  }
  assert.deepEqual(missing, [], 'the guide names paths that are not in the repository');
});

test('the guide names every stylesheet the app imports (ORG-15)', () => {
  const sources = [];
  const walk = (dir) => {
    for (const name of readdirSync(dir)) {
      const url = new URL(name, dir);
      if (statSync(url).isDirectory()) {
        if (name !== 'data') walk(new URL(`${name}/`, dir)); // question banks import no CSS
      } else if (/\.(?:js|jsx|mjs)$/.test(name)) sources.push(readFileSync(url, 'utf8'));
    }
  };
  walk(new URL('src/', ROOT));
  const imported = new Set();
  for (const text of sources) {
    for (const [, name] of text.matchAll(/^import\s+['"](?:\.{1,2}\/)+(styles[\w-]*\.css)['"]/gm)) imported.add(name);
  }
  assert.ok(imported.has('styles.css'), 'the scan finds the main stylesheet');
  const unnamed = [...imported].filter((name) => !guide.includes(`src/${name}`)).sort();
  assert.deepEqual(unnamed, [], 'name these in the Styles row of Where Things Live');
});

test('every npm script the guide tells an agent to run exists (ORG-15)', () => {
  const { scripts } = JSON.parse(readFileSync(new URL('package.json', ROOT), 'utf8'));
  const named = [...guide.matchAll(/npm run ([\w:-]+)/g)].map((m) => m[1]);
  assert.ok(named.includes('lint:all'), 'the scan finds the commands block');
  const missing = [...new Set(named)].filter((name) => !(name in scripts)).sort();
  assert.deepEqual(missing, [], 'the guide names npm scripts that package.json does not have');
});
