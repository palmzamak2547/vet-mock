// When the figure's drawing cannot load (a lost connection, a chunk the server
// no longer has), the explanation never shows a gap: it reads as the paragraph
// it was written as (explainSay), and without one the figure is written out in
// words. A passage's figure never shows which mark answers.
import test, { after, before } from 'node:test';
import assert from 'node:assert/strict';
import { bundleModule, installDom, mountElement, stubModule } from './helpers/mini-dom.mjs';

const FIG = '```figure bars\nhead: ระดับความเชื่อมั่น | ขนาดตัวอย่าง\nbar: 90% | 270\nbar: 95% | 384 | key\n```';
const TEXT = `ก่อนภาพ\n${FIG}\nหลังภาพ`;

let dom;
let failing;
let drawing;
before(async () => {
  dom = installDom();
  const entry = "export { default as RichBlocks } from './src/components/RichBlocks.jsx';";
  // The chunk throws as it loads, as a missing file would.
  failing = await bundleModule({ prefix: 'fig-fail-', contents: entry, plugins: [stubModule(/ExplainFigure\.jsx$/, "throw new Error('chunk failed to load');")] });
  // The chunk loads; it reports the marks it was handed.
  drawing = await bundleModule({ prefix: 'fig-draw-', contents: entry, plugins: [stubModule(/ExplainFigure\.jsx$/, "export default function Fig({ fig }) { return <figure data-keys={String((fig.bars || []).filter((b) => b.key).length)} />; }")] });
});
after(() => { failing?.dispose(); drawing?.dispose(); dom?.restore(); });

const settle = async (mod) => { for (let i = 0; i < 5; i++) await mod.act(async () => { await new Promise((r) => setTimeout(r, 0)); }); };

test('a figure that cannot load gives way to the whole paragraph', async (t) => {
  const { mod } = failing;
  const { container } = await mountElement(t, mod, dom.document, mod.createElement(mod.RichBlocks, { text: TEXT, say: 'ย่อหน้าเดิม 270 และ 384' }));
  await settle(mod);
  assert.equal(container.textContent, 'ย่อหน้าเดิม 270 และ 384');
});

test('without a paragraph, a figure that cannot load is written out in words, never left as a gap', async (t) => {
  const { mod } = failing;
  const { container } = await mountElement(t, mod, dom.document, mod.createElement(mod.RichBlocks, { text: TEXT }));
  await settle(mod);
  const text = container.textContent;
  assert.match(text, /ก่อนภาพ/);
  assert.match(text, /95%, 384/);
  assert.match(text, /หลังภาพ/);
  assert.doesNotMatch(text, /```|bar:|key/);
});

test('a passage figure is handed over with no mark flagged; an explanation keeps its mark', async (t) => {
  const { mod } = drawing;
  const shown = async (props) => {
    const { container } = await mountElement(t, mod, dom.document, mod.createElement(mod.RichBlocks, props));
    await settle(mod);
    let keys = null;
    const visit = (n) => { if (n.tagName === 'FIGURE' || n.tagName === 'figure') keys = n.getAttribute?.('data-keys') ?? n.attributes?.['data-keys']; (n.childNodes || []).forEach(visit); };
    visit(container);
    return keys;
  };
  assert.equal(await shown({ text: TEXT, passage: true }), '0');
  assert.equal(await shown({ text: TEXT, say: 'x' }), '1');
});
