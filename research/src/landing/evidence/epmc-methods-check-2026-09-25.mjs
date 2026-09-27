// Independent re-count of statistical-method mentions in the METHODS section of
// Europe PMC full texts with a CUVET affiliation, 2021-2026. Read-only web queries.
// Usage: node epmc-methods-check.mjs
const API = 'https://www.ebi.ac.uk/europepmc/webservices/rest/search';
const BASE = 'AFF:"Faculty of Veterinary Science, Chulalongkorn University" AND PUB_YEAR:[2021 TO 2026]';
const T = {
  anova: '("ANOVA" OR "analysis of variance")',
  ttest: '("t-test" OR "t test")',
  chisq: '("chi-square" OR "chi-squared" OR "chi square")',
  fisher: '("Fisher\'s exact" OR "Fisher exact")',
  mwu: '("Mann-Whitney" OR "Wilcoxon")',
  kw: '("Kruskal-Wallis")',
  logistic: '("logistic regression")',
  mixed: '("mixed model" OR "mixed-effects" OR "mixed effects" OR "random effect" OR "random effects" OR "multilevel" OR "hierarchical model")',
  gee: '("generalized estimating equation" OR "generalised estimating equation")',
  herd: '("herd" OR "farm")',
  iccdeff: '("intraclass correlation" OR "intra-class correlation" OR "design effect")',
  survival: '("Kaplan-Meier" OR "log-rank" OR "Cox proportional")',
  posthoc: '("Bonferroni" OR "Tukey" OR "Holm" OR "Dunn")',
  kappa: '("kappa")',
  sesp: '("sensitivity" AND "specificity")',
  samplesize: '("sample size")',
  spss: '("SPSS")',
};
async function count(q) {
  const u = `${API}?${new URLSearchParams({ query: q, format: 'json', pageSize: '1', resultType: 'lite' })}`;
  const r = await fetch(u);
  const j = await r.json();
  await new Promise((res) => setTimeout(res, 350));
  return Number(j.hitCount || 0);
}
const out = {};
out.all = await count(BASE);
out.fullText = await count(`(${BASE}) AND HAS_FT:Y`);
for (const [k, t] of Object.entries(T)) out[k] = await count(`(${BASE}) AND METHODS:${t}`);
out.herd_and_chisq = await count(`(${BASE}) AND METHODS:${T.herd} AND METHODS:${T.chisq}`);
out.herd_and_mixed_or_gee = await count(`(${BASE}) AND METHODS:${T.herd} AND (METHODS:${T.mixed} OR METHODS:${T.gee})`);
out.herd_and_chisq_not_mixed_gee = await count(`(${BASE}) AND METHODS:${T.herd} AND METHODS:${T.chisq} AND NOT (METHODS:${T.mixed} OR METHODS:${T.gee})`);
out.checked = new Date().toISOString().slice(0, 10);
console.log(JSON.stringify(out, null, 2));
