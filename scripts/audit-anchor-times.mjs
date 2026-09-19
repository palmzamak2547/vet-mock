// Does the [mm:ss] actually point at where that sentence was said?
//
// A quote can be word-perfect and still carry a timestamp nobody can use. One
// summary earlier this week shipped with ten anchors that pointed nowhere —
// every quote was real, so audit-quote-fidelity passed, and a student clicking
// the timestamp would have landed on a different part of the lecture. Quotes
// and anchors are two separate claims and need two separate checks.
//
// How: data-cache/transcripts/<id>.json carries per-segment start times. Build
// one whitespace-free string of the whole lecture plus an offset→seconds map,
// then for each line that has both a quoted Thai span and an anchor, find every
// place that span was said and keep the occurrence NEAREST the anchor. A
// lecturer repeats himself, so the first occurrence is the wrong one to measure
// against; the nearest is the charitable reading, and if even that is far away
// the anchor is wrong.
//
//   node scripts/audit-anchor-times.mjs <videoId> [...ids]     # default: staged
//
// Exit 1 only for an anchor past the end of the clip, which points at nothing
// and has no honest reading. A span that was said but sits far from its anchor
// is reported for a human to read — see the note at the bottom for why that one
// cannot be decided by a substring search.

import { readFileSync, existsSync, readdirSync } from 'node:fs';

const TOLERANCE_S = 120;
const MIN_SPAN = 8; // shorter spans match too many places to locate honestly

const THAI = /[฀-๿]/;
const strip = (s) => s.replace(/\s+/g, '');

function timedIndex(id) {
  const p = `data-cache/transcripts/${id}.json`;
  if (!existsSync(p)) return null;
  const j = JSON.parse(readFileSync(p, 'utf8'));
  const segs = j.segments || [];
  let text = '';
  const marks = []; // [offsetInText, startSeconds]
  for (const s of segs) {
    marks.push([text.length, Number(s.start) || 0]);
    text += strip(String(s.text || ''));
  }
  return { text, marks, duration: Number(j.duration) || 0 };
}

function timeAt(idx, marks) {
  // last mark at or before idx
  let lo = 0; let hi = marks.length - 1; let ans = 0;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (marks[mid][0] <= idx) { ans = marks[mid][1]; lo = mid + 1; } else hi = mid - 1;
  }
  return ans;
}

function anchorsOn(line) {
  const out = [];
  for (const m of line.matchAll(/\[(\d+):(\d{2})(?:-(\d+):(\d{2}))?/g)) {
    const a = Number(m[1]) * 60 + Number(m[2]);
    const b = m[3] === undefined ? a : Number(m[3]) * 60 + Number(m[4]);
    out.push([a, b]);
  }
  return out;
}

function audit(id) {
  const md = `data-cache/generated/${id}.md`;
  if (!existsSync(md)) return { id, skipped: 'no summary' };
  const idx = timedIndex(id);
  if (!idx) return { id, skipped: 'no timed transcript' };

  const problems = [];
  const past = [];
  let checked = 0;
  for (const line of readFileSync(md, 'utf8').split('\n')) {
    const anchors = anchorsOn(line);
    if (!anchors.length) continue;
    // A line passes when at least one of its quoted spans lands on one of its
    // anchors. The first run of this script flagged five spans across two
    // equine summaries and every one was a BACK-REFERENCE — a line quoting a
    // phrase from earlier in the lecture in order to compare it with what the
    // anchor points at, saying so in Thai in the same sentence
    // ("คำเดียวกันนี้ปรากฏเต็มกว่าที่ [33:41]"). One span landing is the anchor doing its
    // job; the rest of that line is commentary about it. Limitation stated
    // rather than hidden: a good anchor beside a bad one on one line passes,
    // which is why this stays an on-demand check and not part of lint:all.
    const lineProblems = [];
    let anyLanded = false;
    for (const [a, b] of anchors) {
      if (idx.duration && a > idx.duration + 5) {
        past.push(`anchor past the clip (${a}s > ${idx.duration}s): ${line.slice(0, 90)}`);
      }
    }
    for (const q of line.matchAll(/"([^"\n]{8,})"/g)) {
      const span = strip(q[1]);
      if (!THAI.test(span) || span.length < MIN_SPAN) continue;
      // Every place it was said.
      const hits = [];
      let from = 0;
      for (;;) {
        const at = idx.text.indexOf(span, from);
        if (at < 0) break;
        hits.push(timeAt(at, idx.marks));
        from = at + 1;
        if (hits.length > 64) break;
      }
      if (!hits.length) continue; // absent spans are audit-quote-fidelity's job
      checked += 1;
      // Nearest occurrence to any anchor on this line.
      let best = Infinity;
      for (const [a, b] of anchors) {
        for (const t of hits) {
          const d = t < a ? a - t : t > b ? t - b : 0;
          if (d < best) best = d;
        }
      }
      if (best > TOLERANCE_S) {
        const say = anchors.map(([a, b]) => (a === b ? `${a}s` : `${a}-${b}s`)).join(',');
        lineProblems.push(`off by ${best}s (anchor ${say}, said at ${hits.slice(0, 3).join('/')}s): "${q[1].slice(0, 60)}"`);
      } else {
        anyLanded = true;
      }
    }
    if (!anyLanded) problems.push(...lineProblems);
  }
  return { id, checked, problems, past };
}

const args = process.argv.slice(2);
const ids = args.length
  ? args
  : readdirSync('data-cache/generated').filter((f) => f.endsWith('.md')).map((f) => f.replace(/\.md$/, ''));

let bad = 0;
let pastClip = 0;
for (const id of ids) {
  const r = audit(id);
  if (r.skipped) { if (args.length) console.log(`- ${id}: ${r.skipped}`); continue; }
  if (r.past.length) {
    pastClip += r.past.length;
    console.error(`✖ ${id}: ${r.past.length} anchor(s) past the end of the clip`);
    for (const p of r.past.slice(0, 8)) console.error(`    ${p}`);
  }
  if (r.problems.length) {
    bad += r.problems.length;
    console.log(`⚠ ${id}: ${r.problems.length} of ${r.checked} anchored quotes sit far from their anchor — read them`);
    for (const p of r.problems.slice(0, 12)) console.log(`    ${p}`);
  } else {
    console.log(`✅ ${id}: ${r.checked} anchored quotes, every one within ${TOLERANCE_S}s`);
  }
}
// What this tool may and may not decide on its own.
//
// An anchor past the end of the clip is fabricated and nothing excuses it, so
// that fails. "This span was said, but not near this anchor" is different: it is
// also the exact shape of an honest back-reference to a PARAPHRASE, which no
// substring search can recognise. ha7c8qpdsA4 line 206 is the worked example —
// it quotes "ลิตรที่ 5-7" while anchoring [146:49], and reading the transcript at
// 8817 s shows the lecturer saying "บริเวณที่กระเพาะอยู่ประมาณลิตร 5-7" there, the same
// sound without the ที่. The note is right; the search cannot see it. So those
// are reported for a human to read and do not fail the run. A tool that cries
// wolf on correct work gets ignored, and then it catches nothing.
if (pastClip) {
  console.error('\nAn anchor past the end of the clip points at nothing. Fix the number or drop it.');
  process.exit(1);
}
if (bad) {
  console.log('\nRead each one before changing anything: a span that was said but sits far from its '
    + 'anchor is either a wrong number or a back-reference to a paraphrase, and only reading tells you which.');
}
