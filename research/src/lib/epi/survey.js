// Design-based interval for a proportion with farms as the sampling units (survey 4.5: svydesign(ids =
// ~farm), svyciprop method 'logit' or 'mean'), the 'survey' farm route of freq.proportion [M2-DESIGN.md
// 3.3.4].
// OWNER: measure role. STUB(m2): each export throws until its owner fills it in.

/**
 * @param {Uint8Array|boolean[]} positive
 * @param {Int32Array|number[]} cluster
 * @param {{ method: 'logit'|'mean', confLevel: number }} opts
 * @returns {{ p: number, se: number, df: number, ci: [number, number] }}
 */
export function surveyProportion(positive, cluster, opts) {
  throw new Error('not implemented: epi/survey.surveyProportion');
}
