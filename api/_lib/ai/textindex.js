// ============================================================
// ai/textindex.js — one scan-friendly index over every VetMock text
// ============================================================
// The corpus the chat searches is ~15 M characters (governed VetWiki
// sections, every lecture-clip summary, year-2 notes the wiki does not carry,
// and every deliverable bank question). Segmenting all of it into Thai words
// at cold start was measured at ~2 s, so there is no word index. Instead the
// documents are concatenated, normalized once, into ONE string, and a query
// form is found with indexOf (Thai) or a global regex (Latin) over it; a hit
// position maps back to its document by binary search over the start offsets.
// Measured on the real corpus: ~21 forms in ~150 ms, regexes ~7 ms each. Hits
// per form are cached (LRU), so the second retrieval pass of a request, and
// the next student asking about the same disease, re-scan nothing.
//
// Scoring is tf-idf over CONCEPTS (concepts.js), with four rules taken from
// VetWiki's retrieval, where they were measured:
//   - specificity gate: when the question names a rare thing, a document that
//     matches none of the rare things is noise however many common words it
//     shares (rabies questions must not retrieve poultry vaccine programs);
//   - coverage: a document that answers more of the question ranks higher,
//     weighted by how specific each part is;
//   - sections are read inside their article (or clip): what a sibling section
//     says counts at half weight, so "20. การรักษาและ supportive care" of the
//     FPV lecture can answer "แล้วในแมวล่ะ รักษายังไง" although, as usual, it
//     never repeats the disease's name (measured: without this the treatment
//     sections were missed and a virus-history section was cited instead);
//   - length normalization: an omnibus page that mentions everything once
//     must not outrank the short section that is ABOUT the question.
// ============================================================

import { normalizeQuery } from '../../../src/lib/vetwiki/query-terms.js';

const TF_CAP = 8;
const CACHE_LIMIT = 600;

export class TextIndex {
  /** @param {Array<{ title?: string, text?: string, heading?: string }>} docs */
  constructor(docs) {
    this.docs = docs;
    const n = docs.length;
    this.starts = new Int32Array(n);
    this.titleEnds = new Int32Array(n);
    this.lens = new Int32Array(n);
    this.headings = new Array(n);
    // Sections of one article / one clip share a group (null: stands alone).
    this.groups = docs.map((d) => d.group || null);
    const parts = new Array(n);
    let pos = 0;
    for (let i = 0; i < n; i++) {
      const d = docs[i];
      const title = normalizeQuery(d.title || '');
      const text = normalizeQuery(d.text || '');
      // \u0001 \u0002 \u0003 never occur in normalized text, so no form can
      // match across a document boundary or across the title/body seam.
      const chunk = `\u0001${title}\u0002 ${text}\u0003`;
      this.starts[i] = pos;
      this.titleEnds[i] = pos + 1 + title.length;
      this.lens[i] = title.length + text.length;
      // The section's own heading only: an article TITLE that says
      // "Diagnosis" must not make every one of its sections the diagnosis one.
      this.headings[i] = normalizeQuery(d.heading || '');
      parts[i] = chunk;
      pos += chunk.length;
    }
    this.big = parts.join('');
    this.cache = new Map();
  }

  /** Document index holding character position `p`. */
  docAt(p) {
    let lo = 0;
    let hi = this.starts.length - 1;
    while (lo < hi) {
      const mid = (lo + hi + 1) >> 1;
      if (this.starts[mid] <= p) lo = mid; else hi = mid - 1;
    }
    return lo;
  }

  /** Map docIndex → { tf, title } for one form ({ thai } or { probe, re }). */
  hits(form) {
    const key = form.thai ? `t:${form.thai}` : `r:${form.re.source}`;
    const cached = this.cache.get(key);
    if (cached) {
      this.cache.delete(key);
      this.cache.set(key, cached);
      return cached;
    }
    const out = new Map();
    const add = (p) => {
      const d = this.docAt(p);
      const h = out.get(d);
      const inTitle = p < this.titleEnds[d];
      if (h) {
        if (h.tf < TF_CAP) h.tf += 1;
        if (inTitle) h.title = true;
      } else {
        out.set(d, { tf: 1, title: inTitle });
      }
    };
    const big = this.big;
    if (form.thai) {
      const f = form.thai;
      for (let i = big.indexOf(f); i >= 0; i = big.indexOf(f, i + f.length)) add(i);
    } else if (!form.probe || big.includes(form.probe)) {
      const re = new RegExp(form.re.source, 'g');
      for (let m = re.exec(big); m; m = re.exec(big)) {
        add(m.index);
        if (m[0].length === 0) re.lastIndex += 1;
      }
    }
    this.cache.set(key, out);
    if (this.cache.size > CACHE_LIMIT) this.cache.delete(this.cache.keys().next().value);
    return out;
  }

  /**
   * Rank documents for a set of concepts.
   * @param {Array<object>} concepts  from buildConcepts
   * @param {object} o
   * @param {string[]} [o.facetWords]  heading words of what the question asks for
   * @param {(doc, i) => boolean} [o.filter]
   * @param {(i) => number} [o.boost]  multiplier per document (VetWiki rank)
   * @param {number} [o.limit]
   * @returns {{ results: Array<{ i, score, coverage, matched: number[] }>, idf: number[], anyRare: boolean }}
   */
  rank(concepts, { facetWords = [], filter = null, boost = null, limit = 60 } = {}) {
    const N = Math.max(1, this.docs.length);
    const per = concepts.map((c) => {
      const m = new Map();
      for (const f of c.forms) {
        for (const [d, h] of this.hits(f)) {
          const cur = m.get(d);
          if (!cur) m.set(d, { tf: h.tf, title: h.title });
          else {
            if (h.tf > cur.tf) cur.tf = h.tf;
            if (h.title) cur.title = true;
          }
        }
      }
      return m;
    });
    const idf = per.map((m) => (m.size ? Math.log(1 + N / m.size) : 0));
    const ceiling = Math.log(1 + N);
    const coreIdf = concepts.map((c, i) => (c.core && idf[i] > 0 ? idf[i] : 0));
    const maxCore = Math.max(0, ...coreIdf);
    const rare = concepts.map((c, i) => c.core && idf[i] > 0 && idf[i] >= 0.55 * maxCore);
    const anyRare = rare.some(Boolean);
    // A core concept the corpus never uses weighs the most: it is the part of
    // the question nothing here answers, and it keeps coverage honest.
    const mass = concepts.map((c, i) => (c.core ? (idf[i] > 0 ? idf[i] : ceiling) * c.weight : 0));
    const totalMass = mass.reduce((a, b) => a + b, 0);

    const acc = new Map();
    // group → (concept → best contribution of any section in it)
    const groupBest = new Map();
    const groupRare = new Set();
    per.forEach((m, ci) => {
      const w = concepts[ci].weight * idf[ci];
      if (w <= 0) return;
      for (const [d, h] of m) {
        let s = acc.get(d);
        if (!s) { s = { score: 0, mass: 0, rare: false, matched: [] }; acc.set(d, s); }
        const contribution = w * (1 + Math.log(h.tf)) * (h.title ? 1.6 : 1);
        s.score += contribution;
        s.mass += mass[ci];
        if (rare[ci]) s.rare = true;
        s.matched.push(ci);
        const g = this.groups[d];
        if (!g) continue;
        let best = groupBest.get(g);
        if (!best) { best = new Map(); groupBest.set(g, best); }
        if (contribution > (best.get(ci) || 0)) best.set(ci, contribution);
        if (rare[ci]) groupRare.add(g);
      }
    });
    // Evidence from sibling sections, at half weight.
    for (const [d, s] of acc) {
      const best = this.groups[d] ? groupBest.get(this.groups[d]) : null;
      if (!best) continue;
      for (const [ci, contribution] of best) {
        if (s.matched.includes(ci)) continue;
        s.score += 0.5 * contribution;
        s.mass += 0.5 * mass[ci];
      }
    }

    const results = [];
    const groupTop = new Map();
    for (const [d, s] of acc) {
      // The article vouches for its sections: a rare word anywhere in it is
      // enough to let a section through the gate.
      if (anyRare && !s.rare && !(this.groups[d] && groupRare.has(this.groups[d]))) continue;
      if (filter && !filter(this.docs[d], d)) continue;
      let score = s.score / Math.sqrt(Math.max(1, this.lens[d] / 1500));
      const coverage = totalMass ? s.mass / totalMass : 0;
      score *= Math.pow(Math.max(coverage, 0.05), 0.75);
      if (boost) score *= boost(d) || 1;
      const facet = facetWords.length > 0 && facetWords.some((w) => this.headings[d].includes(w));
      results.push({ i: d, score, coverage, matched: s.matched, facet });
      const g = this.groups[d];
      if (g && score > (groupTop.get(g)?.score || 0)) groupTop.set(g, { score, coverage });
    }
    // The section headed with what the question asks for (Treatment,
    // Diagnosis, อาการ ...) is the answer inside an article that is about the
    // question, even when a sibling repeats the disease name more often: it
    // takes most of its article's best score before the facet lift.
    for (const r of results) {
      if (!r.facet) continue;
      const top = this.groups[r.i] ? groupTop.get(this.groups[r.i]) : null;
      if (top && top.score * 0.9 > r.score) {
        r.score = top.score * 0.9;
        r.coverage = Math.max(r.coverage, top.coverage * 0.9);
      }
      r.score *= 1.4;
    }
    results.sort((a, b) => b.score - a.score || a.i - b.i);
    return { results: results.slice(0, limit), idf, anyRare };
  }
}
