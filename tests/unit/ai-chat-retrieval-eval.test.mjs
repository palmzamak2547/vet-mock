// ============================================================
// ai-chat retrieval eval — questions as students type them
// ============================================================
// Each case in tests/fixtures/ai-retrieval-eval.json is a question as a
// student types it and the plan the planner (the production model) made for
// it, saved so the run needs no network. The search runs exactly as in the
// route: the question as typed, the planner's reading, chooseSearch() between
// them. A case passes when one of the first two cited sources is about what
// was asked (the `expect` pattern, read against title, topic and heading).
//
// Measured 2026-10-28 on 30 common questions: 23 passed before the fixes that
// came with this file, 30 after; 20 more from other fields (drugs, labs,
// anatomy, exotics): 14 pass, 6 are gaps the corpus has little on. Add a case
// whenever a student question finds the wrong sources; never loosen one. A
// case marked `todo` is a known miss, with the reason.

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import { loadCorpus } from '../../api/_lib/ai/corpus.js';
import { searchCorpus, selectDocs, chooseSearch } from '../../api/_lib/ai/retrieve.js';
import { heuristicPlan } from '../../api/_lib/ai/planner.js';

const cases = JSON.parse(readFileSync(new URL('../fixtures/ai-retrieval-eval.json', import.meta.url), 'utf8'));
const corpus = await loadCorpus();
const label = (r) => `${r.doc.title || ''} | ${r.doc.topic || ''} | ${r.doc.heading || ''}`;

for (const c of cases) {
  test(c.q, { todo: c.todo || false }, () => {
    const typedQuery = heuristicPlan([{ role: 'user', content: c.q }]).query_th;
    const typed = searchCorpus(corpus, { text: typedQuery, wikiQueries: [typedQuery] });
    const planned = searchCorpus(corpus, { text: c.plan.query_th, terms: c.plan.terms_en, wikiQueries: [c.plan.query_th, typedQuery] });
    const cited = selectDocs(chooseSearch(typed, planned).ranked).map(label);
    const about = new RegExp(c.expect, 'i');
    assert.ok(cited.slice(0, 2).some((t) => about.test(t)), `expected ${c.expect}, cited:\n${cited.slice(0, 2).join('\n')}`);
    // `never`: what must not be cited at all (another disease that shares a word or an abbreviation)
    if (c.never) {
      const wrong = new RegExp(c.never, 'i');
      assert.ok(!cited.some((t) => wrong.test(t)), `cited ${c.never}:\n${cited.join('\n')}`);
    }
  });
}
