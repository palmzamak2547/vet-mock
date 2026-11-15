#!/usr/bin/env node
// ============================================================
// lint-voice.mjs — wording that reads as machine-written may only go down
// ============================================================
// Usage: node scripts/lint-voice.mjs [--list] [--group <g>] [--pattern <id>] [--file <part of a path>]
//                                    [--json <out.json>] [--write]
//
// The owner, 15 Nov 2026: "อย่ามีหลุดพวกคำพูดของAI ลงไปนะครับ พวกเรื่องภาษาคำพูดที่ใช้
// และTechnical term สำคัญมาก". A count that day found the long dash used as a
// separator about 4,800 times in notes, wrap-ups and explanations, and the
// usual companions beside it: ทำการ before a verb, มีความ before an adjective,
// essay connectors, importance openers, marketing words. A student reads them
// as text nobody wrote for them.
//
// This reads only what a person sees, in six groups:
//
//   interface  strings and JSX text of the screens (the files lint:ui-copy reads)
//   notes      the text of src/data/notes-*.js (headings, paragraphs, bullets, tables, callouts)
//   questions  stems, options, explanations, model answers and passages of src/data/questions-*.js
//   wrapups    the lines of src/data/wrapups/*.js
//   changelog  the update notes (src/data/changelog/, changelog.js) and the how-to (how-to.js)
//   docs       the prose of README.md and docs/*.md, code blocks left out
//
// Never a comment, a regular expression, a generated file, a source pointer
// (source, verified, examOrigin) or a quotation kept under a citation key.
//
// The patterns are data: scripts/voice-patterns.json holds each one with the
// reason, the rewrite to reach for, the groups it is read in, and sentences it
// must catch and must pass (the unit suite runs every pattern against its own
// examples). The counts live in docs/voice-budget.json, by pattern and group.
// A count above its number fails; the files that grew are named, with every
// finding in them. --write lowers the numbers after a cleanup and records a
// pattern that has no row yet; it never raises a number.
//
// A finding is a suspicion with a suggested rewrite, not a verdict on the
// sentence: keep the meaning, and never change a number, a dose, a unit or a
// term to clear one. scripts/fix-voice.mjs applies the rewrites that are
// mechanical.
// ============================================================

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { extractStrings, extractMarkdown, isCopy } from './lib/voice-text.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const PATTERNS_FILE = 'scripts/voice-patterns.json';
export const BUDGET_FILE = 'docs/voice-budget.json';
const NOTE = 'lint:voice budgets: findings by pattern and group (scripts/voice-patterns.json says what each pattern is and how to rewrite it). A number may only go down. "files" is where the findings were when the numbers were last written, so a count that grows can name the file. node scripts/lint-voice.mjs --list prints every finding; --write lowers the numbers after a cleanup.';

// A quotation or a pointer keeps the words of its source.
const CITED = new Set(['source', 'sourceText', 'quote', 'excerpt', 'evidence', 'citation', 'reference', 'references', 'transcript']);
const underCited = (r) => r.path !== '' && r.path.split('.').some((k) => CITED.has(k));
const keyed = (...keys) => { const set = new Set(keys); return (r) => set.has(r.key); };
const CHANGELOG_NAMES = new Set(['kind', 'scope', 'icon', 'version', 'date', 'src', 'file', 'has', 'feature', 'nav', 'id',
  'surface', 'color', 'bg', 't']);

const listDir = (root, dir, test) => {
  const abs = path.join(root, dir);
  if (!fs.existsSync(abs)) return [];
  return fs.readdirSync(abs).filter(test).sort().map((f) => `${dir}/${f}`);
};
const walkDir = (root, entry, test) => {
  const out = [];
  const walk = (rel) => {
    const abs = path.join(root, rel);
    if (!fs.existsSync(abs)) return;
    if (fs.statSync(abs).isFile()) { if (test(rel)) out.push(rel); return; }
    for (const name of fs.readdirSync(abs).sort()) walk(`${rel}/${name}`);
  };
  walk(entry);
  return out;
};

/**
 * The six groups: which files, and which of a file's strings a reader sees.
 * Order is the order of the report.
 */
export const GROUPS = {
  interface: {
    files: (root) => ['src/views', 'src/components', 'src/lib', 'src/hooks', 'src/App.jsx', 'src/main.jsx', 'src/data/og-covers.js']
      .flatMap((entry) => walkDir(root, entry, (f) => /\.(jsx?|mjs)$/.test(f) && !/\.test\.|\.generated\.|(^|\/)vetwiki\//.test(f))),
    text: (r) => isCopy(r) && !underCited(r),
  },
  notes: {
    files: (root) => listDir(root, 'src/data', (f) => /^notes-.*\.js$/.test(f) && !/registry|generated/.test(f)),
    text: keyed('title', 'summary', 'heading', 'sub', 'body', 'bullets', 'label', 'value', 'callout', 'headers', 'rows'),
  },
  questions: {
    files: (root) => listDir(root, 'src/data', (f) => /^questions-.*\.js$/.test(f)),
    text: keyed('q', 'options', 'explain', 'model_answer', 'passage', 'passage_title', 'distractors', 'left', 'right'),
  },
  wrapups: {
    files: (root) => listDir(root, 'src/data/wrapups', (f) => f.endsWith('.js')),
    text: keyed('intro', 'formatNote', 'keywords', 'text', 'pitfall', 'agent', 'th', 'name'),
  },
  changelog: {
    files: (root) => [...listDir(root, 'src/data/changelog', (f) => f.endsWith('.js')), 'src/data/changelog.js', 'src/data/how-to.js']
      .filter((f) => fs.existsSync(path.join(root, f))),
    text: (r) => isCopy(r) && !CHANGELOG_NAMES.has(r.key),
  },
  docs: {
    markdown: true,
    files: (root) => ['README.md', ...listDir(root, 'docs', (f) => f.endsWith('.md'))].filter((f) => fs.existsSync(path.join(root, f))),
    text: () => true,
  },
};
export const GROUP_NAMES = Object.keys(GROUPS);

/** The patterns, compiled. Each: { id, name, why, rewrite, re, groups, hit, pass }. */
export function readPatterns(root = ROOT) {
  const data = JSON.parse(fs.readFileSync(path.join(root, PATTERNS_FILE), 'utf8'));
  return data.patterns.map((p) => {
    const flags = [...new Set(`${p.flags || ''}gu`)].join('');
    return { ...p, re: new RegExp(p.re, flags), groups: p.groups || GROUP_NAMES };
  });
}

/** What a reader sees in one file of a group. */
export function textsOf(group, source, file) {
  const g = GROUPS[group];
  const records = g.markdown ? extractMarkdown(source, file) : extractStrings(source, file);
  return records.filter((r) => g.text(r));
}

/** Every place one pattern matches in one text: the matched words and a little of what surrounds them. */
export function matchesIn(pattern, text) {
  const out = [];
  const { re } = pattern;
  re.lastIndex = 0;
  for (let m = re.exec(text); m; m = re.exec(text)) {
    const from = Math.max(0, m.index - 36);
    const to = Math.min(text.length, m.index + m[0].length + 44);
    out.push({
      index: m.index,
      match: m[0],
      around: `${from > 0 ? '…' : ''}${text.slice(from, to).replace(/\s+/g, ' ')}${to < text.length ? '…' : ''}`,
    });
    if (m[0] === '') re.lastIndex++;
  }
  return out;
}

/** The findings of some texts of one group. */
export function findingsIn(records, patterns, group) {
  const out = [];
  for (const p of patterns) {
    if (!p.groups.includes(group)) continue;
    for (const r of records) {
      for (const m of matchesIn(p, r.text)) {
        const line = r.line + (r.kind === 'tpl' ? (r.text.slice(0, m.index).match(/\n/g) || []).length : 0);
        out.push({ pattern: p.id, group, file: r.file, line, match: m.match, around: m.around });
      }
    }
  }
  return out;
}

/** Scan the tree: every finding, the count of each pattern in each group, and where they sit. */
export function scanTree({ root = ROOT, patterns = readPatterns(root), groups = GROUP_NAMES } = {}) {
  const findings = [];
  const scanned = {};
  for (const group of groups) {
    const files = GROUPS[group].files(root);
    let texts = 0;
    for (const file of files) {
      const records = textsOf(group, fs.readFileSync(path.join(root, file), 'utf8'), file);
      texts += records.length;
      findings.push(...findingsIn(records, patterns, group));
    }
    scanned[group] = { files: files.length, texts };
  }
  const counts = {};
  const files = {};
  for (const p of patterns) {
    counts[p.id] = Object.fromEntries(p.groups.filter((g) => groups.includes(g)).map((g) => [g, 0]));
    files[p.id] = {};
  }
  for (const f of findings) {
    counts[f.pattern][f.group]++;
    files[f.pattern][f.file] = (files[f.pattern][f.file] || 0) + 1;
  }
  return { findings, counts, files, scanned };
}

export function readBudget(root = ROOT) {
  const file = path.join(root, BUDGET_FILE);
  return fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : null;
}

/** Cells above their number, each with the files that hold more than they did, and cells below it. */
export function compare(result, budget) {
  const over = [];
  const under = [];
  for (const [pattern, byGroup] of Object.entries(result.counts)) {
    for (const [group, n] of Object.entries(byGroup)) {
      const cap = budget?.budget?.[pattern]?.[group] ?? 0;
      if (n > cap) {
        const was = budget?.files?.[pattern] || {};
        const grew = Object.entries(result.files[pattern])
          .filter(([file, count]) => count > (was[file] ?? 0) && result.findings.some((f) => f.pattern === pattern && f.group === group && f.file === file))
          .map(([file, count]) => ({ file, n: count, was: was[file] ?? 0 }));
        over.push({ pattern, group, n, cap, grew });
      } else if (n < cap) under.push({ pattern, group, n, cap });
    }
  }
  return { over, under, ok: over.length === 0 };
}

/**
 * The budget after a cleanup: a number never rises, a pattern with no row yet is recorded as counted,
 * and "files" follows the tree wherever the count is within its number.
 */
export function lowerBudget(budget, result) {
  const next = { note: NOTE, budget: {}, files: {} };
  for (const [pattern, byGroup] of Object.entries(result.counts)) {
    const old = budget?.budget?.[pattern];
    next.budget[pattern] = {};
    let within = true;
    for (const [group, n] of Object.entries(byGroup)) {
      const cap = old ? Math.min(n, old[group] ?? 0) : n;
      next.budget[pattern][group] = cap;
      if (n > cap) within = false;
    }
    const where = within ? result.files[pattern] : (budget?.files?.[pattern] || {});
    next.files[pattern] = Object.fromEntries(Object.entries(where).filter(([, n]) => n > 0).sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0)));
  }
  return next;
}

const pad = (v, n) => String(v).padStart(n);

function table(result, budget, patterns) {
  const groups = GROUP_NAMES.filter((g) => result.scanned[g]);
  const lines = [`${'pattern'.padEnd(22)}${groups.map((g) => pad(g, 11)).join('')}`];
  for (const p of patterns) {
    const cells = groups.map((g) => {
      const n = result.counts[p.id][g];
      if (n === undefined) return pad('-', 11);
      const cap = budget?.budget?.[p.id]?.[g] ?? 0;
      return pad(n > cap ? `${n}>${cap}` : n, 11);
    });
    lines.push(`${p.id.padEnd(22)}${cells.join('')}`);
  }
  return lines.join('\n');
}

function main() {
  const args = process.argv.slice(2);
  const opt = (name) => { const k = args.indexOf(name); return k >= 0 ? args[k + 1] : null; };
  const patterns = readPatterns();
  const onlyGroup = opt('--group');
  const onlyPattern = opt('--pattern');
  const onlyFile = opt('--file');
  if (onlyGroup && !GROUPS[onlyGroup]) { console.error(`lint:voice: no group "${onlyGroup}" (${GROUP_NAMES.join(', ')})`); process.exitCode = 2; return; }
  if (onlyPattern && !patterns.some((p) => p.id === onlyPattern)) { console.error(`lint:voice: no pattern "${onlyPattern}"`); process.exitCode = 2; return; }

  const result = scanTree({ patterns });
  const budget = readBudget();
  const byId = new Map(patterns.map((p) => [p.id, p]));
  const show = (f) => `  ${f.file}:${f.line}  [${f.pattern}] ${f.around}`;

  const jsonOut = opt('--json');
  if (jsonOut) fs.writeFileSync(jsonOut, `${JSON.stringify({ counts: result.counts, scanned: result.scanned, findings: result.findings }, null, 1)}\n`);

  if (args.includes('--list')) {
    const rows = result.findings.filter((f) => (!onlyGroup || f.group === onlyGroup) && (!onlyPattern || f.pattern === onlyPattern) && (!onlyFile || f.file.includes(onlyFile)));
    for (const f of rows) console.log(show(f));
    console.log(`${rows.length} finding(s)`);
    return;
  }

  if (args.includes('--write')) {
    const next = lowerBudget(budget, result);
    fs.writeFileSync(path.join(ROOT, BUDGET_FILE), `${JSON.stringify(next, null, 2)}\n`);
    const total = Object.values(next.budget).reduce((sum, byGroup) => sum + Object.values(byGroup).reduce((a, b) => a + b, 0), 0);
    console.log(`lint:voice: wrote ${BUDGET_FILE}, ${total} findings allowed across ${patterns.length} patterns`);
    return;
  }

  if (!budget) {
    console.error(`lint:voice: ${BUDGET_FILE} is missing; run node scripts/lint-voice.mjs --write once to record it.`);
    process.exitCode = 1;
    return;
  }

  const { over, under, ok } = compare(result, budget);
  console.log(table(result, budget, patterns));
  if (!ok) {
    console.error('\nlint:voice: wording that reads as machine-written went up. Rewrite the new lines (same meaning, same numbers and terms):');
    for (const cell of over) {
      const p = byId.get(cell.pattern);
      console.error(`\n  ${cell.pattern} in ${cell.group}: ${cell.n} > ${cell.cap}. ${p.name}. Rewrite: ${p.rewrite}`);
      for (const g of cell.grew) {
        console.error(`  ${g.file}: ${g.n}, was ${g.was}`);
        result.findings.filter((f) => f.pattern === cell.pattern && f.file === g.file).slice(0, 12).forEach((f) => console.error(`  ${show(f)}`));
      }
    }
    console.error('\n  node scripts/lint-voice.mjs --list --pattern <id> --file <path> prints every finding of a file;');
    console.error('  node scripts/fix-voice.mjs <file> shows the mechanical rewrites without applying them.');
    process.exitCode = 1;
    return;
  }
  const files = Object.values(result.scanned).reduce((a, g) => a + g.files, 0);
  const texts = Object.values(result.scanned).reduce((a, g) => a + g.texts, 0);
  console.log(`\nlint:voice: OK, ${result.findings.length} findings in ${texts} texts of ${files} files, none above its number`);
  if (under.length) console.log(`  ${under.length} count(s) are below their number; node scripts/lint-voice.mjs --write lowers them.`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
