#!/usr/bin/env node
// ============================================================
// lint-ui-copy.mjs — what the screens say, checked where it is written
// ============================================================
// Usage: node scripts/lint-ui-copy.mjs [--write] [--list]
//
// Three rules over the copy in src/views, src/components, src/lib (not
// *.generated.*), src/hooks, src/App.jsx and src/main.jsx:
//
//   1. No middle dot (·). The app separates clauses with a space, a comma or
//      a word. Budget 0.
//   2. No นักศึกษา. This is Chula; the reader is นิสิต. Budget 0.
//   3. English words the app already has Thai for (Log in, Sync, Export,
//      Next ...) may only go down. Each file's count is recorded in
//      docs/ui-copy-budget.json; a file over its number fails, a file with no
//      row may have none. --write lowers the numbers after a cleanup and
//      never raises one.
//
// Copy means every string, template and JSX text in those files, except:
//   - the first argument of replace/split/match/test/includes/RegExp and
//     friends: that is a pattern that cleans text, not text (a regex literal
//     such as /^[\d\s.·\-]+/ is not a string at all and is never read);
//   - console and logger output;
//   - text under a content key (explain, why, statement, rationale, source,
//     quote ...): question explanations and cited source text keep whatever
//     the source wrote, and are checked by the content lints instead;
//   - comments, which are never parsed as strings;
//   - an entry in the budget file's "allow" list, which names the file, the
//     exact text and the reason, and is reviewed like any other decision.
//
// The English-word rule reads a narrower set, the strings a screen renders
// (JSX text, aria-label/title/placeholder/alt, toast and dialog calls,
// label/title/body props), with the same token list and exclusions as the
// 2026-09 copy audit, so its numbers stay comparable with that audit.
// ============================================================

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from '@babel/parser';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const SCANNED = ['src/views', 'src/components', 'src/lib', 'src/hooks', 'src/App.jsx', 'src/main.jsx'];
export const BUDGET_FILE = 'docs/ui-copy-budget.json';

const MIDDLE_DOT = '·';
const STUDENT = 'นักศึกษา';

// Attributes that never carry copy; their values are not read at all.
const SKIP_ATTR = new Set(['className', 'id', 'key', 'type', 'href', 'src', 'style', 'data-testid', 'role', 'htmlFor',
  'name', 'rel', 'target', 'viewBox', 'd', 'fill', 'stroke', 'xmlns', 'points', 'transform', 'inputMode',
  'autoComplete', 'accept', 'method', 'lang', 'dir', 'loading', 'decoding', 'as', 'variant', 'size', 'tone', 'icon',
  'kind', 'mode', 'pose', 'mood', 'layout', 'align', 'fontFamily', 'strokeLinecap', 'strokeLinejoin', 'fillRule',
  'clipRule', 'preserveAspectRatio', 'textAnchor', 'dominantBaseline', 'gradientUnits', 'offset', 'stopColor',
  'crossOrigin', 'referrerPolicy', 'sandbox', 'allow', 'enterKeyHint', 'spellCheck', 'pattern', 'step', 'min',
  'max', 'to', 'path', 'route', 'view', 'testId']);
// Calls whose arguments are keys, selectors or queries rather than copy.
const SKIP_CALL = /\.(querySelector|querySelectorAll|getItem|setItem|removeItem|addEventListener|removeEventListener|getElementById|match|replace|split|test|startsWith|endsWith|includes|indexOf|join|from|select|eq|in|order|rpc|channel|on|invoke|storage|classList\.add|classList\.remove|classList\.toggle|setAttribute|getAttribute|closest)$/;
// A string in first position of these is a pattern, not text.
const PATTERN_CALL = /(^|\.)(replace|replaceAll|split|match|matchAll|test|search|includes|indexOf|lastIndexOf|startsWith|endsWith)$|^RegExp$/;
// Keys whose values are content (explanations, cited source text), not UI.
const CONTENT_KEYS = new Set(['explain', 'explanation', 'why', 'statement', 'rationale', 'source', 'sourceText',
  'quote', 'excerpt', 'evidence', 'citation', 'reference', 'references', 'transcript', 'summary', 'answer']);
const LOG_CALL = /^(skip)?call:(console|logger)\b|\.(console|logger)\./;

function calleeName(node) {
  if (!node) return '';
  if (node.type === 'Identifier') return node.name;
  if (node.type === 'MemberExpression' || node.type === 'OptionalMemberExpression')
    return `${calleeName(node.object)}.${node.property.name || node.property.value || ''}`;
  return node.type;
}

/** Every string, template and JSX text in one module, with where it sits. */
export function extractStrings(source, file = '') {
  const out = [];
  let ast;
  try {
    ast = parse(source, { sourceType: 'module', plugins: ['jsx'], errorRecovery: true });
  } catch (error) {
    throw new Error(`${file}: ${error.message}`);
  }
  const push = (node, kind, ctx, text, flags) => {
    if (!text || !/\S/.test(text)) return;
    out.push({ file, line: node.loc.start.line, kind, ctx, text, ...flags });
  };
  const visit = (node, ctx, flags) => {
    if (!node || typeof node.type !== 'string') return;
    let myCtx = ctx;
    switch (node.type) {
      case 'ImportDeclaration': case 'ExportAllDeclaration': return;
      case 'ExportNamedDeclaration': if (node.source) return; break;
      case 'JSXAttribute': {
        const name = node.name.name?.name ? node.name.name.name : node.name.name;
        if (SKIP_ATTR.has(name)) return;
        myCtx = `attr:${name}`;
        break;
      }
      case 'CallExpression': case 'OptionalCallExpression': {
        const callee = calleeName(node.callee);
        if (/^(require|import)$/.test(callee) || SKIP_CALL.test(callee)) myCtx = `skipcall:${callee}`;
        else myCtx = `call:${callee}`;
        break;
      }
      case 'ObjectProperty': {
        const key = node.key.name || node.key.value;
        visit(node.value, `prop:${key}`, { ...flags, pattern: false, content: flags.content || CONTENT_KEYS.has(key) });
        if (node.computed) visit(node.key, ctx, { ...flags, pattern: false });
        return;
      }
      case 'VariableDeclarator': myCtx = `var:${node.id?.name || ''}`; break;
      case 'StringLiteral': push(node, 'str', ctx, node.value, flags); return;
      case 'TemplateLiteral': {
        const text = node.quasis.map((q, i) => q.value.cooked + (i < node.expressions.length ? '${}' : '')).join('');
        push(node, 'tpl', ctx, text, flags);
        for (const expression of node.expressions) visit(expression, ctx, { ...flags, pattern: false });
        return;
      }
      case 'JSXText': {
        const text = node.value.replace(/\s+/g, ' ').trim();
        push(node, 'jsx', ctx === 'root' ? 'jsx' : ctx, text, flags);
        return;
      }
      case 'JSXElement': {
        const name = node.openingElement.name;
        myCtx = `jsx:${name.name || (name.object ? `${name.object.name}.${name.property.name}` : '')}`;
        break;
      }
      case 'TaggedTemplateExpression':
        if (node.tag?.name === 'css' || node.tag?.property?.name === 'css') return;
        break;
      default: break;
    }
    const isCall = node.type === 'CallExpression' || node.type === 'OptionalCallExpression' || node.type === 'NewExpression';
    const patternCallee = isCall && PATTERN_CALL.test(calleeName(node.callee));
    for (const key of Object.keys(node)) {
      if (['loc', 'start', 'end', 'leadingComments', 'trailingComments', 'innerComments', 'extra'].includes(key)) continue;
      const value = node[key];
      if (Array.isArray(value)) {
        value.forEach((child, index) => {
          if (child && typeof child.type === 'string')
            visit(child, myCtx, { ...flags, pattern: patternCallee && key === 'arguments' && index === 0 });
        });
      } else if (value && typeof value.type === 'string') {
        visit(value, myCtx, { ...flags, pattern: false });
      }
    }
  };
  visit(ast.program, 'root', { pattern: false, content: false });
  return out;
}

// ── The English-word rule: the copy audit's own lists, unchanged ─────────────
const LEAK_EXCLUDED_FILES = /generated|vetwiki\/|tts-phonetic|id-migration|AdminView|PrivateNotes|admin-api|DomainDetail|PublicWiki|OAuthSetupHelp|motion-kit|\/lab\/|LabView|VetCalculator|ReviewQueueView|landing\/LandingBody|IgCardStudio|dicom|web-vitals/;
const LEAK_NON_UI = /console|logger|skipcall|call:(Error|new Error)|className|^var:(STORAGE|KEY)|prop:(id|kind|key|type|icon|color|bg|slot|view|scope|labelEn|kw)$/;
const isRendered = (s) => s.kind === 'jsx'
  || /^attr:(aria-label|title|placeholder|alt|label|confirmLabel|cancelLabel|body|note|rowLabel|endLabel|subtitle|ctaLabel)$/.test(s.ctx)
  || /^call:(setError|setInfo|setToast|setHint|alertDialog|showToast|flash|setMessage|setMsg|setStatus|thaiError|setNotice)/.test(s.ctx)
  || /^prop:(label|title|sub|cta|body|message|hint|text|desc)$/.test(s.ctx)
  || /^var:(message|caption|label|headline|advice)$/.test(s.ctx);
export const LEAKS = [
  [/\b[Ll]og ?[Ii]n\b/, 'เข้าสู่ระบบ'], [/\b[Ll]ogout\b/, 'ออกจากระบบ'], [/\baccount\b/i, 'บัญชี'], [/\bdevice\b/i, 'อุปกรณ์/เครื่อง'],
  [/\b[Bb]ookmarks?\b/, 'บุ๊กมาร์ก'], [/\b[Ss]ession\b/, 'รอบ/ชุด'], [/\b[Ss]ync\b/, 'ซิงก์'], [/\b(Prev|Next)\b/, 'ก่อนหน้า/ถัดไป'],
  [/\bCopy link\b/, 'คัดลอกลิงก์'], [/\b[Pp]laylist\b|PLAYLIST/, 'เพลย์ลิสต์'], [/\bNow playing\b/, 'กำลังเล่น'], [/\b[Ss]treak\b/, 'วันต่อเนื่อง'],
  [/\bDaily Q\b/, 'ข้อวันนี้'], [/\bSources:/, 'แหล่งอ้างอิง'], [/\bNOTE\b|\bNotes?\b/, 'โน้ต'], [/\b(Total [Cc]ards|Mastered|Due tomorrow|Cards Reviewed)\b/, 'ทบทวนตามรอบ'],
  [/\bnext:/, 'รอบถัดไป'], [/\b(Midterm|Final)\b/, 'กลางภาค/ปลายภาค'], [/\bspaced repetition\b/i, 'ทบทวนตามรอบ'], [/\bSR pool\b/, 'ทบทวนตามรอบ'],
  [/\bDisclaimer\b/, 'หมายเหตุ'], [/\b(Username|Bio|User ID|Cohort|Avatar)\b/, 'ชื่อผู้ใช้/รุ่น/รูปโปรไฟล์'], [/\bDanger Zone\b/, 'ลบบัญชี'], [/\bExport\b/, 'ส่งออก'],
  [/\b(Bug Report|Feature Request|Question|Other)\b/, 'แจ้งปัญหา/ขอฟีเจอร์/คำถาม/อื่นๆ'], [/\bYour (answer|summary)\b/, 'คำตอบของคุณ'], [/\bwords\b|\bchars\b/, 'คำ/ตัวอักษร'],
  [/\b(WRITING|SHORT)\b/, 'ข้อเขียน/ตอบสั้น'], [/\bCode:/, 'รหัส'], [/\bJoin\b/, 'เข้าร่วม'], [/\bMembers\b/, 'สมาชิก'], [/\bRACE CODE\b/, 'รหัสห้อง'],
  [/\bHome\b/, 'หน้าแรก'], [/\bquest\b/i, 'ภารกิจ'], [/\b[Mm]odal\b/, 'หน้าต่าง'], [/\bCommand palette\b/i, 'ช่องค้นหา'], [/\bTip:/, 'เคล็ดลับ'],
  [/\bthreshold\b/, 'เกณฑ์'], [/\battempts\b/, 'ครั้ง'], [/\blifetime\b/, 'ทุกปี'], [/\bUnknown\b/, 'ไม่ระบุ'], [/\bauto-save\b/, 'บันทึกอัตโนมัติ'],
  [/\bembed\b/, 'เล่นในแอป'], [/\bsingle-player\b/, 'ไม่เข้าสู่ระบบ'], [/\blist\b/, 'รายการ'], [/\bLearning Curve\b/i, 'กราฟความแม่นยำ'], [/\bdrill\b/, 'ฝึก'],
];

/** Sort one module's strings into the three rules. */
export function findIssues(records, { allow = [] } = {}) {
  const allowed = (r) => allow.some((a) => a.file === r.file && a.text === r.text);
  const isCopy = (r) => !r.pattern && !r.content && !LOG_CALL.test(r.ctx) && !allowed(r);
  const dots = records.filter((r) => r.text.includes(MIDDLE_DOT) && isCopy(r));
  const students = records.filter((r) => r.text.includes(STUDENT) && isCopy(r));
  const leaks = [];
  for (const r of records) {
    if (r.ctx.startsWith('skipcall:') || LEAK_EXCLUDED_FILES.test(r.file) || LEAK_NON_UI.test(r.ctx) || !isRendered(r)) continue;
    const hit = LEAKS.find(([re]) => re.test(r.text));
    if (hit) leaks.push({ ...r, token: r.text.match(hit[0])[0], thai: hit[1] });
  }
  return { dots, students, leaks };
}

function listFiles(root) {
  const files = [];
  const walk = (p) => {
    if (!fs.existsSync(p)) return;
    const stat = fs.statSync(p);
    if (stat.isFile()) {
      if (/\.(jsx?|mjs)$/.test(p) && !/\.test\.|\.generated\./.test(p)) files.push(p);
      return;
    }
    for (const name of fs.readdirSync(p).sort()) walk(path.join(p, name));
  };
  for (const entry of SCANNED) walk(path.join(root, entry));
  return files;
}

export function readBudget(root = ROOT) {
  const file = path.join(root, BUDGET_FILE);
  return fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : null;
}

/** Scan the tree. Returns what each rule found, and what fails. */
export function lintTree({ root = ROOT, budget = readBudget(root) } = {}) {
  const found = { dots: [], students: [], leaks: [] };
  for (const abs of listFiles(root)) {
    const file = path.relative(root, abs).split(path.sep).join('/');
    const issues = findIssues(extractStrings(fs.readFileSync(abs, 'utf8'), file), { allow: budget?.allow || [] });
    for (const rule of Object.keys(found)) found[rule].push(...issues[rule]);
  }
  const leakCounts = {};
  for (const leak of found.leaks) leakCounts[leak.file] = (leakCounts[leak.file] || 0) + 1;
  const caps = budget?.englishLeaks || {};
  const over = Object.entries(leakCounts)
    .filter(([file, n]) => n > (caps[file] ?? 0))
    .map(([file, n]) => ({ file, n, cap: caps[file] ?? 0 }));
  const lowered = Object.entries(caps)
    .filter(([file, cap]) => (leakCounts[file] || 0) < cap)
    .map(([file, cap]) => ({ file, n: leakCounts[file] || 0, cap }));
  return { ...found, leakCounts, over, lowered, ok: !found.dots.length && !found.students.length && !over.length };
}

/** New English-leak numbers: never above the old ones, files at zero dropped. */
export function lowerBudget(budget, leakCounts) {
  const englishLeaks = {};
  const first = !budget?.englishLeaks;
  for (const [file, n] of Object.entries(leakCounts).sort()) {
    const cap = first ? n : Math.min(n, budget.englishLeaks[file] ?? 0);
    if (cap > 0) englishLeaks[file] = cap;
  }
  return { ...budget, englishLeaks };
}

function main() {
  const args = process.argv.slice(2);
  const budget = readBudget();
  const result = lintTree({ budget });
  const where = (r) => `  ${r.file}:${r.line}  ${r.text.replace(/\s+/g, ' ').slice(0, 110)}`;
  if (args.includes('--list')) {
    for (const leak of result.leaks) console.log(`${where(leak)}  [${leak.token} -> ${leak.thai}]`);
  }
  if (args.includes('--write')) {
    const next = lowerBudget(budget || {
      note: 'lint:ui-copy English-word budget, per file. A number may only go down; a file with no row may have none. Middle dots and นักศึกษา have no budget: they fail outright. "allow" names text that keeps a middle dot on purpose, with the reason.',
      allow: [],
    }, result.leakCounts);
    fs.writeFileSync(path.join(ROOT, BUDGET_FILE), `${JSON.stringify(next, null, 2)}\n`);
    const total = Object.values(next.englishLeaks).reduce((a, b) => a + b, 0);
    console.log(`lint:ui-copy — wrote ${BUDGET_FILE}: ${total} English words across ${Object.keys(next.englishLeaks).length} files`);
    return;
  }
  if (!budget) {
    console.error(`lint:ui-copy — ${BUDGET_FILE} is missing; run node scripts/lint-ui-copy.mjs --write once to record it.`);
    process.exitCode = 1;
    return;
  }
  if (result.dots.length) {
    console.error(`lint:ui-copy — ${result.dots.length} middle dot(s) in UI copy. Use a space, a comma or a word:`);
    result.dots.forEach((r) => console.error(where(r)));
  }
  if (result.students.length) {
    console.error(`lint:ui-copy — ${result.students.length} นักศึกษา in UI copy. The reader is นิสิต:`);
    result.students.forEach((r) => console.error(where(r)));
  }
  if (result.over.length) {
    console.error('lint:ui-copy — English words the app already has Thai for, over the file budget:');
    for (const { file, n, cap } of result.over) {
      console.error(`  ${file}: ${n} > budget ${cap}`);
      result.leaks.filter((l) => l.file === file).forEach((l) => console.error(`  ${where(l)}  [${l.token} -> ${l.thai}]`));
    }
  }
  if (!result.ok) {
    process.exitCode = 1;
    return;
  }
  const total = result.leaks.length;
  console.log(`lint:ui-copy — OK (0 middle dots, 0 นักศึกษา, ${total} English words within budget)`);
  if (result.lowered.length) {
    console.log(`  ${result.lowered.length} file(s) are under their English-word budget; run --write to lower it:`);
    result.lowered.forEach(({ file, n, cap }) => console.log(`  ${file}: ${n} < ${cap}`));
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
