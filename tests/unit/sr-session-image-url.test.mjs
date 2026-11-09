// ============================================================
// sr-session-image-url.test.mjs — the review card loads figures only from trusted hosts
// ============================================================
// safe-url.js sets the rule: every <img src> for a shared or custom question
// runs its URL through safeImageUrl, so a figure on a host outside the
// allow-list (a tracking pixel in a shared question pack) is never
// requested. Question.jsx and ReviewView check imagePath. The spaced-review
// card passed it to ZoomableImage as given, so a custom question that shows
// no figure in a practice set called that host every time its card came up
// for review (the site CSP allows any https image).
//
// The real view is compiled from source and mounted under react-dom. The
// session is started with its own button, the answer is shown with its own
// button, and every <img> the card draws is read back. Mochi, the motion
// wrappers and the components that draw no question figure are stood in
// for; ZoomableImage is the real one.
// ============================================================
import test, { after, before } from 'node:test';
import assert from 'node:assert/strict';

import { BANK_REGISTRY } from '../../src/data/bank-registry.generated.js';
import { safeImageUrl } from '../../src/lib/safe-url.js';
import {
  bundleModule, buttonsWithText, click, findAll, installDom, mountElement, repoRoot,
} from './helpers/mini-dom.mjs';

// One plugin for every stand-in, so each specifier is answered with its own source.
const STAND_INS = [
  // The card under test is a custom question, so the banks are not loaded.
  [/(^|[\\/])data[\\/]questions\.js$/, [
    "export { SUBJECTS } from './src/data/curriculum.js';",
    'export const QB = [];',
    'export const loadQB = async () => QB;',
    'export const loadQBForYear = async () => QB;',
    'export const isQBYearLoaded = () => true;',
    'export const isQBFullyLoaded = () => true;',
  ].join('\n')],
  [/[\\/]Mochi\.jsx$/, 'export default function Mochi() { return null; }'],
  [/[\\/]MotionFeedback\.jsx$/, [
    'export function MotionEnter({ children, className }) { return <div className={className}>{children}</div>; }',
    'export function MotionButton({ effect, ...props }) { return <button type="button" {...props} />; }',
  ].join('\n')],
  [/[\\/](WikiLinkForQuestion|SmartPassage|ImageOcclusionCard|ClozeCard)\.jsx$/, 'export default function StandIn() { return null; }'],
];
const standIns = {
  name: 'sr-session-stand-ins',
  setup(b) {
    STAND_INS.forEach(([filter], index) => {
      b.onResolve({ filter }, () => ({ path: String(index), namespace: 'sr-session-stand-in' }));
    });
    b.onLoad({ filter: /.*/, namespace: 'sr-session-stand-in' }, (args) => ({
      contents: STAND_INS[Number(args.path)][1], loader: 'jsx', resolveDir: repoRoot,
    }));
  },
};

let dom;
let bundle;
let mod;

before(async () => {
  dom = installDom();
  bundle = await bundleModule({
    prefix: 'sr-session-image-',
    contents: "export { default as SRSessionView } from './src/views/SRSessionView.jsx';",
    plugins: [standIns],
  });
  mod = bundle.mod;
});

after(() => {
  bundle?.dispose();
  dom?.restore();
});

const TRACKER = 'https://tracker.example/p.gif?u=student';
const STEM = 'Rabies is a zoonosis';
const customQuestion = (fields) => ({ id: 910001, type: 'tf', subject: 'one-health', q: STEM, answer: true, ...fields });
const hasClass = (node, cls) => (node.getAttribute('class') || '').split(/\s+/).includes(cls);

/** Start a review of one custom question and return the src of every <img> on its card. */
async function cardImages(t, question, { reveal = false } = {}) {
  const { container } = await mountElement(t, mod, dom.document, mod.createElement(mod.SRSessionView, {
    srCards: {}, setSrCards: () => ({ accepted: true }), goHome: () => {}, customQuestions: [question], selectedYear: 4,
  }));
  const [start] = buttonsWithText(container, 'เริ่ม Session');
  assert.ok(start, 'the planning step offers to start');
  await click(mod, start);
  await mod.act(async () => {});
  const [card] = findAll(container, (n) => hasClass(n, 'vmx-flashcard'));
  assert.ok(card, 'the review card is on screen');
  assert.ok(card.textContent.includes(STEM), 'the card shows the question');
  if (reveal) {
    const [show] = buttonsWithText(container, 'แสดงคำตอบ');
    assert.ok(show, 'the card offers to show the answer');
    await click(mod, show);
    assert.ok(findAll(card, (n) => hasClass(n, 'back')).length === 1, 'the answer side is shown');
  }
  return findAll(container, (n) => n.tagName === 'IMG').map((n) => n.getAttribute('src'));
}

test('an imagePath on a host outside the allow-list is never drawn on the review card', async (t) => {
  assert.deepEqual(await cardImages(t, customQuestion({ imagePath: TRACKER })), []);
});

test('no figure field of the card draws an untrusted host, before or after the answer', async (t) => {
  const question = customQuestion({ image: TRACKER, imagePath: `${TRACKER}&f=path`, explainImage: `${TRACKER}&f=explain` });
  assert.deepEqual(await cardImages(t, question, { reveal: true }), []);
});

test('a figure on this site or on an allow-listed host still shows on the card', async (t) => {
  const bankPath = '/images/vca-2569/p2-001-horse-vision.jpg';
  assert.deepEqual(await cardImages(t, customQuestion({ imagePath: bankPath })), [bankPath]);
  const imgur = 'https://i.imgur.com/abc123.png';
  assert.deepEqual(await cardImages(t, customQuestion({ imagePath: imgur })), [imgur]);
});

test('every figure path the banks ship passes the check and loads the same file', async () => {
  const BASE = 'https://vetmock.com';
  const paths = new Set();
  for (const entry of BANK_REGISTRY) for (const q of await entry.load()) if (q.imagePath != null) paths.add(q.imagePath);
  assert.ok(paths.size > 0, 'the banks carry figure paths');
  for (const path of paths) {
    const safe = safeImageUrl(path);
    assert.ok(safe, `${path} would be hidden on the review card`);
    assert.equal(new URL(safe, BASE).href, new URL(path, BASE).href, `${path} would load another file`);
  }
});

test('the review card renders without a React warning', () => {
  assert.deepEqual(dom.consoleErrors, []);
});
