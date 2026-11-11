// Every reader of a question's explanation or passage, listed. A figure
// (src/lib/figure-spec.js) is drawn only by RichBlocks and SmartPassage; any
// reader that cannot draw it (the voice, a model, Anki, a printed proof, a
// search index, a generator, the VCA bank) reads the whole text through
// explainText / passageText / wholeExplain (src/lib/rich-blocks.js), so it
// never meets the markup and never loses what the figure says.
//
// A new file that reads `.explain` or `.passage` fails here until it is put in
// READERS with what it does.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { explainText, passageText, readableText, wholeExplain } from '../../src/lib/rich-blocks.js';

const HELPER = /\b(explainText|passageText|readableText|wholeExplain)\b/;
// draws: renders through RichBlocks / SmartPassage, which draw the figure (or fall back to explainSay).
// helper: reads through one of the helpers.
// raw: reads the text as data on purpose (an editor, a lint, a patch tool, a check that a field exists,
//      a header search that the figure cannot hold, or a type that cannot carry a figure).
const READERS = {
  'api/_lib/ai/corpus.js': 'helper',
  'api/_lib/ai/quiz.js': 'helper',
  'api/study-coach.js': 'helper',
  'api/grade-summary.js': 'raw', // a summary's own passage, not a question's
  'scripts/apply-y4-patches.mjs': 'raw',
  'scripts/audit-coherence.mjs': 'helper',
  'scripts/batch-narrating-explains.mjs': 'raw',
  'scripts/build-question-bank.mjs': 'raw', // drafts to a bank file, field for field
  'scripts/lib/answer-leak.mjs': 'helper',
  'scripts/lib/question-standard.mjs': 'helper',
  'scripts/lint-q-dupes.mjs': 'helper',
  'scripts/lint-question-figures.mjs': 'raw',
  'scripts/lint-question-tables.mjs': 'raw',
  'scripts/provenance/build.mjs': 'helper',
  'scripts/provenance/pdf.mjs': 'helper',
  'scripts/regen-exam-recurrence.mjs': 'helper',
  'scripts/regen-glossary-related.mjs': 'helper',
  'scripts/regen-written-questions.mjs': 'helper',
  'scripts/report-glossary-gaps.mjs': 'helper',
  'scripts/report-source-conflicts.mjs': 'helper',
  'scripts/tts-clips.mjs': 'helper',
  'scripts/video-analyse.mjs': 'helper',
  'scripts/wiki-link-candidates.mjs': 'helper',
  'scripts/workflows/explain-rewrite.mjs': 'raw',
  'scripts/workflows/table-fix.mjs': 'raw',
  'src/App.jsx': 'raw', // a comment
  'src/components/AnswerReveal.jsx': 'draws',
  'src/components/MatchDragDrop.jsx': 'raw', // matching questions carry no figure (lint)
  'src/components/MissCoach.jsx': 'raw', // looks for the house header, which a figure cannot hold
  'src/components/Question.jsx': 'draws',
  'src/components/SmartGrader.jsx': 'helper',
  'src/components/TodaysQModal.jsx': 'draws',
  'src/lib/adaptive-select.js': 'raw', // whether a passage exists
  'src/lib/anki-export.js': 'helper',
  'src/lib/question-surfaces.js': 'raw', // whether a passage exists
  'src/lib/read-aloud.js': 'raw', // reads the job Question.jsx builds from wholeExplain
  'src/lib/rich-blocks.js': 'raw',
  'src/views/QuestionManagerView.jsx': 'raw', // the editor
  'src/views/ReviewView.jsx': 'draws',
  'src/views/SRSessionView.jsx': 'draws',
  'vca/scripts/build-bank.mjs': 'helper', // the VCA app reads only what this writes
};

const READS = /\.(explain|passage)\b(?!Say|_title|Image)/;
function sources(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) return e.name === 'node_modules' || full.replace(/\\/g, '/') === 'src/data' ? [] : sources(full);
    return /\.(m?js|jsx|cjs)$/.test(e.name) ? [full.replace(/\\/g, '/')] : [];
  });
}

test('every reader of an explanation or a passage is listed, and each one that cannot draw reads through a helper', () => {
  const found = ['api', 'scripts', 'src', 'vca/scripts'].flatMap(sources).filter((f) => READS.test(fs.readFileSync(f, 'utf8')));
  const unlisted = found.filter((f) => !READERS[f]);
  assert.deepEqual(unlisted, [], 'new readers: list them in READERS with what they do');
  for (const [file, how] of Object.entries(READERS)) {
    if (!fs.existsSync(file)) continue;
    if (how === 'helper') assert.match(fs.readFileSync(file, 'utf8'), HELPER, `${file} reads the text without the helper`);
    if (how === 'draws') assert.match(fs.readFileSync(file, 'utf8'), /RichBlocks|SmartPassage/, `${file} does not draw through RichBlocks`);
  }
});

const FIG = '```figure bars\nhead: ระดับความเชื่อมั่น | ขนาดตัวอย่าง\nbar: 90% | 270\nbar: 95% | 384 | key\n```';

test('a reader gets the paragraph, or the figure in words, never the markup', () => {
  const q = { explain: `ก่อน\n${FIG}\nหลัง`, explainSay: 'ย่อหน้าเดิม 270 384', passage: `ตาราง\n${FIG}` };
  assert.equal(explainText(q), 'ย่อหน้าเดิม 270 384');
  assert.equal(wholeExplain(q), 'ย่อหน้าเดิม 270 384');
  const words = passageText(q);
  assert.ok(!words.includes('```') && !/\bkey\b|bar:|head:/.test(words), words);
  assert.match(words, /95%, 384/);
  assert.equal(readableText('plain | text'), 'plain | text');
  assert.equal(explainText({ explain: 'no figure', explainSay: 'kept for the voice' }), 'no figure');
});
