// ============================================================
// how-to-content.test.mjs — every sentence of the guide and the hints is true
// ============================================================
// Owner review (Palm, v5.141.6): "วิธีใช้งาน บอกแค่อันคร่าวๆ ยังไม่แนะนำการใช้
// ได้จริง". The rewrite teaches by doing: each goal is a few concrete steps
// that name the exact button, and a button that goes there. A guide like that
// is only worth having while every name it quotes is still on screen, so this
// suite is the contract:
//
//   - a button name in a step ({ui:...}) must appear, verbatim and outside a
//     comment, in the source file the step says owns it. When another lane
//     renames a button, this fails and the guide gets fixed in the same
//     change, instead of quietly teaching a control that no longer exists;
//   - destinations ({nav:...}, {feature:...}, go targets) must exist in the
//     shared registries the rail and the bottom bar read, so the guide never
//     names a destination the app does not have;
//   - the copy follows the house rules: plain Thai, no middle dot, no em dash,
//     no build or vendor words, nothing a phone cannot skim;
//   - the behaviour a step promises is checked where a string cannot prove it
//     (the dose card really answers the example the guide gives).
// ============================================================

import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

const root = new URL('../../', import.meta.url);
const read = (path) => readFileSync(new URL(path, root), 'utf8').replace(/\r\n/g, '\n');

// Comments are removed before a label is looked up, so a label that survives
// only in a comment ("the button used to say X") does not count as present.
// Only comments that cannot be anything else are removed: JSX comments,
// block comments that open a line, and whole-line // comments. A bare /* in
// the middle of a line is left alone, because `accept="image/*"` is code and
// a greedy strip from it would delete real buttons up to the next */.
function code(path) {
  return read(path)
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, ' ')
    .replace(/^[ \t]*\/\*[\s\S]*?\*\//gm, ' ')
    .split('\n')
    .filter((line) => !/^\s*\/\//.test(line))
    .join('\n');
}

const {
  GUIDE_PATHS, FEATURE_TIPS, GUIDE_REOPEN_HINT, parseHowTo, resolveSegment, pickTip, goLabel, guidePathsFor,
} = await import('../../src/data/how-to.js');
const { NAV_ITEMS } = await import('../../src/lib/nav.js');
const { FEATURES } = await import('../../src/lib/feature-registry.js');
const { APP_VIEW_ROUTES } = await import('../../src/lib/view-route.js');

const navIds = new Set(NAV_ITEMS.map((n) => n.id));
const featureById = new Map(FEATURES.map((f) => [f.id, f]));
const appSource = read('src/App.jsx');
const renderedView = (view) => Object.hasOwn(APP_VIEW_ROUTES, view)
  || new RegExp(`view === '${view}'`).test(appSource);

// Every string a student reads, with where it came from for the message.
function* copyOf() {
  for (const p of GUIDE_PATHS) {
    yield [`${p.id}.title`, p.title];
    yield [`${p.id}.summary`, p.summary];
    if (p.intro) yield [`${p.id}.intro`, p.intro];
    if (p.start) yield [`${p.id}.start`, p.start];
    for (const [i, s] of p.steps.entries()) {
      yield [`${p.id}.steps[${i}].text`, s.text];
      if (s.note) yield [`${p.id}.steps[${i}].note`, s.note];
      if (s.go?.label) yield [`${p.id}.steps[${i}].go.label`, s.go.label];
    }
  }
  for (const [id, entry] of Object.entries(FEATURE_TIPS)) {
    for (const [i, t] of entry.tips.entries()) {
      yield [`tip.${id}[${i}].title`, t.title];
      yield [`tip.${id}[${i}].text`, t.text];
    }
  }
}

// Every placeholder-bearing string with the files that must hold its labels.
function* evidenceUnits() {
  for (const p of GUIDE_PATHS) {
    for (const [i, s] of p.steps.entries()) {
      yield { where: `${p.id}.steps[${i}]`, texts: [s.text, s.note].filter(Boolean), src: s.src || [], check: s.check || [] };
    }
  }
  for (const [id, entry] of Object.entries(FEATURE_TIPS)) {
    for (const [i, t] of entry.tips.entries()) {
      yield { where: `tip.${id}[${i}]`, texts: [t.title, t.text], src: t.src || [], check: t.check || [] };
    }
  }
}

const plain = (text) => parseHowTo(text).map(resolveSegment).join('');

test('the guide is a short list of real goals, each a few steps a phone can skim', () => {
  assert.ok(GUIDE_PATHS.length >= 4 && GUIDE_PATHS.length <= 7, `${GUIDE_PATHS.length} goals: more than seven is a menu, not a guide`);
  const ids = GUIDE_PATHS.map((p) => p.id);
  assert.equal(new Set(ids).size, ids.length, 'two goals share an id');
  for (const p of GUIDE_PATHS) {
    assert.ok(p.title && p.summary && p.icon, `${p.id} lacks a title, summary or icon`);
    assert.ok(p.steps.length >= 2 && p.steps.length <= 4, `${p.id} has ${p.steps.length} steps; a goal is 2 to 4`);
    assert.ok([...p.title].length <= 34, `${p.id} title is too long for one line on a phone`);
    assert.ok([...plain(p.summary)].length <= 64, `${p.id} summary is too long`);
    for (const [i, s] of p.steps.entries()) {
      assert.ok([...plain(s.text)].length <= 96, `${p.id}.steps[${i}] reads ${[...plain(s.text)].length} characters; keep a step to one glance`);
      if (s.note) assert.ok([...plain(s.note)].length <= 90, `${p.id}.steps[${i}].note is too long`);
    }
  }
});

test('every placeholder names something the app really has', () => {
  for (const unit of evidenceUnits()) {
    for (const text of unit.texts) {
      for (const seg of parseHowTo(text)) {
        if (seg.t === 'nav') assert.ok(navIds.has(seg.id), `${unit.where}: {nav:${seg.id}} is not a bottom-bar or rail destination`);
        if (seg.t === 'feature') {
          const f = featureById.get(seg.id);
          assert.ok(f, `${unit.where}: {feature:${seg.id}} is not in the feature registry`);
          // A guide shown to everyone must not lean on a feature that hides
          // for signed-out students or exists only for the admin account.
          assert.ok(!f.auth && !f.adminOnly, `${unit.where}: {feature:${seg.id}} is hidden for some students`);
        }
      }
    }
  }
});

test('every quoted button name is on screen in the file that owns it', () => {
  for (const unit of evidenceUnits()) {
    const labels = unit.texts.flatMap((text) => parseHowTo(text).filter((s) => s.t === 'ui').map((s) => s.v));
    if (labels.length) assert.ok(unit.src.length, `${unit.where} quotes ${labels.join(', ')} without naming the file that shows it`);
    for (const file of unit.src) assert.ok(existsSync(new URL(file, root)), `${unit.where}: ${file} does not exist`);
    const sources = unit.src.map(code);
    for (const label of labels) {
      assert.ok(sources.some((s) => s.includes(label)), `${unit.where}: "${label}" is not rendered by ${unit.src.join(' or ')}`);
    }
    for (const { file, has } of unit.check) {
      assert.ok(code(file).includes(has), `${unit.where}: evidence "${has}" is gone from ${file}`);
    }
  }
});

test('every go button leads to a destination the app renders', () => {
  for (const p of GUIDE_PATHS) {
    for (const [i, s] of p.steps.entries()) {
      const go = s.go;
      if (!go) continue;
      const where = `${p.id}.steps[${i}].go`;
      const kinds = ['nav', 'feature', 'view', 'search'].filter((k) => go[k]);
      assert.equal(kinds.length, 1, `${where} must name exactly one destination`);
      if (go.nav) assert.ok(navIds.has(go.nav), `${where}: ${go.nav} is not a nav destination`);
      if (go.feature) {
        const f = featureById.get(go.feature);
        assert.ok(f?.invoke?.kind === 'view', `${where}: ${go.feature} does not open a screen`);
        assert.ok(renderedView(f.invoke.view), `${where}: the app renders no ${f.invoke.view} screen`);
      }
      if (go.view) {
        assert.ok(renderedView(go.view), `${where}: the app renders no ${go.view} screen`);
        assert.ok(go.label, `${where}: a plain view needs a label to say where it goes`);
      }
      assert.match(goLabel(go), /\S/, `${where} has no button text`);
    }
  }
});

test('the copy follows the house rules', () => {
  const banned = [
    [/·/, 'a middle dot'],
    [/—/, 'an em dash'],
    [/ข้อสอบเก่า/, 'ข้อสอบเก่า'],
    [/\b(AI|GPT|LLM|Claude|Anthropic|OpenAI|DeepSeek|Gemini|model)\b/i, 'a vendor or model word'],
    [/ปัญญาประดิษฐ์|โมเดล|แชตบอต/, 'a model word in Thai'],
    [/\b(beta|placeholder|coming soon|Phase \d)\b/i, 'a build word'],
    [/เร็ว ๆ นี้|เร็วๆ นี้/, 'a promise of something not built'],
  ];
  for (const [where, text] of copyOf()) {
    const shown = plain(text);
    for (const [re, name] of banned) assert.doesNotMatch(shown, re, `${where} contains ${name}: ${shown}`);
    assert.doesNotMatch(text, /\{(?!(nav|feature|ui):)[^}]*\}/, `${where} has a placeholder the renderer does not know`);
  }
});

test('placeholders parse into text and labels, and resolve from the shared registries', () => {
  const segs = parseHowTo('กด {nav:subject-select} แล้วกด {ui:เริ่มฝึก} หรือเปิด {feature:sr-session}');
  assert.deepEqual(segs.map((s) => s.t), ['text', 'nav', 'text', 'ui', 'text', 'feature']);
  assert.equal(resolveSegment(segs[1]), NAV_ITEMS.find((n) => n.id === 'subject-select').label);
  assert.equal(resolveSegment(segs[3]), 'เริ่มฝึก');
  assert.equal(resolveSegment(segs[5]), featureById.get('sr-session').label);
  assert.deepEqual(parseHowTo('ไม่มีปุ่ม').map((s) => s.t), ['text']);
  assert.deepEqual(parseHowTo(''), []);
});

test('a goal that leans on a feature this year does not have is left out', () => {
  // Year 6 has no question bank yet (curriculum YEARS scaffold), so a step
  // built on a practice-only feature must not be offered there.
  const scaffoldOnly = guidePathsFor({ selectedYear: 6, scaffold: true, hasSupabase: true });
  for (const p of scaffoldOnly) {
    for (const s of p.steps) {
      for (const seg of [s.text, s.note].filter(Boolean).flatMap(parseHowTo)) {
        if (seg.t === 'feature') assert.ok(!featureById.get(seg.id).hideOnScaffold, `${p.id} offers ${seg.id} on a year with no questions`);
      }
    }
    assert.ok(p.steps.length >= 1, `${p.id} was offered with no steps left`);
  }
  const normal = guidePathsFor({ selectedYear: 5, scaffold: false, hasSupabase: true });
  assert.equal(normal.length, GUIDE_PATHS.length, 'a normal year lost a goal');
});

test('the hints rotate through their own list and honour the surface they are on', () => {
  for (const [id, entry] of Object.entries(FEATURE_TIPS)) {
    assert.ok(entry.tips.length >= 1, `${id} has no hint`);
    assert.ok(GUIDE_PATHS.some((p) => p.id === entry.guide), `${id} points at a guide goal that does not exist`);
    const first = pickTip(id, { turn: 0, surface: entry.tips[0].surface || null });
    assert.equal(first, entry.tips[0], `${id}: the first day must show the first hint`);
  }
  const notes = FEATURE_TIPS.notes.tips;
  assert.equal(pickTip('notes', { turn: notes.length }), notes[0], 'rotation does not wrap');
  const article = FEATURE_TIPS.knowledge.tips.filter((t) => t.surface === 'article');
  assert.ok(article.length, 'the article page has no hint of its own');
  assert.equal(pickTip('knowledge', { turn: 0, surface: 'article' }), article[0]);
  assert.equal(pickTip('missing-id', { turn: 0 }), null);
});

test('the notes hint leads with printing to PDF, the owner\'s own example', () => {
  // "เนื้อหาสามารถกดปริ้น pdf file ได้" — the first hint a student meets on the
  // notes page names the print button and where it is.
  const first = FEATURE_TIPS.notes.tips[0];
  assert.match(plain(first.title + first.text), /PDF/);
  assert.ok(parseHowTo(first.text).some((s) => s.t === 'ui' && s.v === 'พิมพ์'));
});

test('every hint id has a mount and every mount has a hint', () => {
  const views = ['LibraryView', 'KnowledgeView', 'NotesView', 'VideoView', 'ScheduleView'];
  const mounted = new Map();
  for (const v of views) {
    for (const m of code(`src/views/${v}.jsx`).matchAll(/<FeatureTip\s+id="([^"]+)"(?:\s+surface="([^"]+)")?/g)) {
      mounted.set(`${m[1]}${m[2] ? `:${m[2]}` : ''}`, v);
    }
  }
  for (const key of mounted.keys()) {
    const [id, surface] = key.split(':');
    assert.ok(FEATURE_TIPS[id], `${mounted.get(key)} mounts a hint "${id}" with no content`);
    if (surface) assert.ok(pickTip(id, { turn: 0, surface }), `${mounted.get(key)} asks for a ${surface} hint that does not exist`);
  }
  for (const id of Object.keys(FEATURE_TIPS)) {
    assert.ok([...mounted.keys()].some((k) => k.split(':')[0] === id), `hint "${id}" is written but never mounted`);
  }
});

test('the dose example the search goal gives really returns a dose card', async () => {
  const step = GUIDE_PATHS.find((p) => p.id === 'search').steps.find((s) => /kg/.test(s.text));
  assert.ok(step, 'the search goal no longer teaches the dose card');
  const example = step.text.match(/[a-z]+ \d+ kg \S+/)?.[0];
  const { detectDoseIntent } = await import('../../src/lib/omni-intents.js');
  assert.equal(detectDoseIntent(example)?.kind, 'dose', `"${example}" does not open a dose card`);
});

test('the guide tells a closing student where to find it again, and that button exists', () => {
  assert.match(GUIDE_REOPEN_HINT, /วิธีใช้/, 'the reopen hint does not name the button');
  for (const [re, name] of [[/·/, 'a middle dot'], [/—/, 'an em dash']]) assert.doesNotMatch(GUIDE_REOPEN_HINT, re, name);
  // The Home hero button is the permanent way back (HomeView belongs to
  // another lane): a visible text node that says วิธีใช้, wired to the tour.
  const home = code('src/views/HomeView.jsx');
  assert.ok(home.includes('onOpenTour('), 'Home no longer opens the guide');
  assert.match(home, />[^<{]*วิธีใช้[^<{]*</, 'Home no longer shows a วิธีใช้ button to reopen the guide');
});

test('About describes the guide without a step count that will go stale', () => {
  const about = code('src/views/AboutView.jsx');
  assert.doesNotMatch(about, /ทัวร์แนะนำ \d+ ขั้น/, 'About still promises a fixed number of tour steps');
});
