// Primary references for the methods a report cites, so the methods paragraph can name its sources and
// the student can take them to Zotero or EndNote as RIS or BibTeX [M2-DESIGN.md 6.5]. Every DOI below was
// resolved on api.crossref.org on the date in `checked`, and title, journal, year, volume, issue and
// first page were taken from that record (capitals of all-caps titles lowered; the end page added from the
// article where Crossref gives only the first). A reference without a DOI keeps doi null, never a guessed
// one. `methods` lists the catalogue ids whose methods sentence cites the reference. OWNER: report role.

/**
 * @typedef {{ id: string, methods: string[], type: 'article'|'book', authors: string[], title: string, year: number,
 *   journal?: string, volume?: string, issue?: string, pages?: string, doi: string|null, checked: string }} Reference
 */

const CHECKED = '2026-09-28';

/** @type {readonly Reference[]} */
export const REFERENCES = Object.freeze([
  { id: 'wilson1927', methods: ['freq.proportion'], type: 'article', authors: ['Wilson, Edwin B.'], title: 'Probable inference, the law of succession, and statistical inference', year: 1927, journal: 'Journal of the American Statistical Association', volume: '22', issue: '158', pages: '209-212', doi: '10.1080/01621459.1927.10502953', checked: CHECKED },
  { id: 'roganGladen1978', methods: ['freq.truePrevalence'], type: 'article', authors: ['Rogan, Walter J.', 'Gladen, Beth'], title: 'Estimating prevalence from the results of a screening test', year: 1978, journal: 'American Journal of Epidemiology', volume: '107', issue: '1', pages: '71-76', doi: '10.1093/oxfordjournals.aje.a112510', checked: CHECKED },
  { id: 'mantelHaenszel1959', methods: ['epi.mantelHaenszel'], type: 'article', authors: ['Mantel, Nathan', 'Haenszel, William'], title: 'Statistical aspects of the analysis of data from retrospective studies of disease', year: 1959, journal: 'Journal of the National Cancer Institute', volume: '22', issue: '4', pages: '719-748', doi: '10.1093/jnci/22.4.719', checked: CHECKED },
  { id: 'friedman1937', methods: ['test.friedman'], type: 'article', authors: ['Friedman, Milton'], title: 'The use of ranks to avoid the assumption of normality implicit in the analysis of variance', year: 1937, journal: 'Journal of the American Statistical Association', volume: '32', issue: '200', pages: '675-701', doi: '10.1080/01621459.1937.10503522', checked: CHECKED },
  { id: 'greenhouseGeisser1959', methods: ['anova.repeated'], type: 'article', authors: ['Greenhouse, Samuel W.', 'Geisser, Seymour'], title: 'On methods in the analysis of profile data', year: 1959, journal: 'Psychometrika', volume: '24', issue: '2', pages: '95-112', doi: '10.1007/BF02289823', checked: CHECKED },
  { id: 'huynhFeldt1976', methods: ['anova.repeated'], type: 'article', authors: ['Huynh, Huynh', 'Feldt, Leonard S.'], title: 'Estimation of the Box correction for degrees of freedom from sample data in randomized block and split-plot designs', year: 1976, journal: 'Journal of Educational Statistics', volume: '1', issue: '1', pages: '69-82', doi: '10.3102/10769986001001069', checked: CHECKED },
  { id: 'mauchly1940', methods: ['anova.repeated'], type: 'article', authors: ['Mauchly, John W.'], title: 'Significance test for sphericity of a normal n-variate distribution', year: 1940, journal: 'The Annals of Mathematical Statistics', volume: '11', issue: '2', pages: '204-209', doi: '10.1214/aoms/1177731915', checked: CHECKED },
  { id: 'dunn1964', methods: ['posthoc.dunn'], type: 'article', authors: ['Dunn, Olive Jean'], title: 'Multiple comparisons using rank sums', year: 1964, journal: 'Technometrics', volume: '6', issue: '3', pages: '241-252', doi: '10.1080/00401706.1964.10490181', checked: CHECKED },
  { id: 'gamesHowell1976', methods: ['posthoc.gamesHowell'], type: 'article', authors: ['Games, Paul A.', 'Howell, John F.'], title: "Pairwise multiple comparison procedures with unequal N's and/or variances: a Monte Carlo study", year: 1976, journal: 'Journal of Educational Statistics', volume: '1', issue: '2', pages: '113-125', doi: '10.3102/10769986001002113', checked: CHECKED },
  { id: 'dunnett1955', methods: ['posthoc.dunnett'], type: 'article', authors: ['Dunnett, Charles W.'], title: 'A multiple comparison procedure for comparing several treatments with a control', year: 1955, journal: 'Journal of the American Statistical Association', volume: '50', issue: '272', pages: '1096-1121', doi: '10.1080/01621459.1955.10501294', checked: CHECKED },
  { id: 'royston1995', methods: ['diag.shapiro'], type: 'article', authors: ['Royston, Patrick'], title: 'Remark AS R94: a remark on algorithm AS 181: the W-test for normality', year: 1995, journal: 'Applied Statistics', volume: '44', issue: '4', pages: '547-551', doi: '10.2307/2986146', checked: CHECKED },
  { id: 'brownForsythe1974', methods: ['diag.brownForsythe'], type: 'article', authors: ['Brown, Morton B.', 'Forsythe, Alan B.'], title: 'Robust tests for the equality of variances', year: 1974, journal: 'Journal of the American Statistical Association', volume: '69', issue: '346', pages: '364-367', doi: '10.1080/01621459.1974.10482955', checked: CHECKED },
  { id: 'hodgesLehmann1963', methods: ['test.mannWhitney', 'test.wilcoxonSignedRank'], type: 'article', authors: ['Hodges, J. L.', 'Lehmann, E. L.'], title: 'Estimates of location based on rank tests', year: 1963, journal: 'The Annals of Mathematical Statistics', volume: '34', issue: '2', pages: '598-611', doi: '10.1214/aoms/1177704172', checked: CHECKED },
  { id: 'nelderWedderburn1972', methods: ['reg.logistic', 'reg.poisson'], type: 'article', authors: ['Nelder, J. A.', 'Wedderburn, R. W. M.'], title: 'Generalized linear models', year: 1972, journal: 'Journal of the Royal Statistical Society. Series A (General)', volume: '135', issue: '3', pages: '370-384', doi: '10.2307/2344614', checked: CHECKED },
  { id: 'liangZeger1986', methods: ['route.robust'], type: 'article', authors: ['Liang, Kung-Yee', 'Zeger, Scott L.'], title: 'Longitudinal data analysis using generalized linear models', year: 1986, journal: 'Biometrika', volume: '73', issue: '1', pages: '13-22', doi: '10.1093/biomet/73.1.13', checked: CHECKED },
  { id: 'kaplanMeier1958', methods: ['surv.kaplanMeier'], type: 'article', authors: ['Kaplan, E. L.', 'Meier, Paul'], title: 'Nonparametric estimation from incomplete observations', year: 1958, journal: 'Journal of the American Statistical Association', volume: '53', issue: '282', pages: '457-481', doi: '10.1080/01621459.1958.10501452', checked: CHECKED },
  { id: 'delong1988', methods: ['roc.delong'], type: 'article', authors: ['DeLong, Elizabeth R.', 'DeLong, David M.', 'Clarke-Pearson, Daniel L.'], title: 'Comparing the areas under two or more correlated receiver operating characteristic curves: a nonparametric approach', year: 1988, journal: 'Biometrics', volume: '44', issue: '3', pages: '837-845', doi: '10.2307/2531595', checked: CHECKED },
  { id: 'youden1950', methods: ['roc.delong'], type: 'article', authors: ['Youden, W. J.'], title: 'Index for rating diagnostic tests', year: 1950, journal: 'Cancer', volume: '3', issue: '1', pages: '32-35', doi: '10.1002/1097-0142(1950)3:1<32::AID-CNCR2820030106>3.0.CO;2-3', checked: CHECKED },
  { id: 'blandAltman1986', methods: ['agree.blandAltman'], type: 'article', authors: ['Bland, J. Martin', 'Altman, Douglas G.'], title: 'Statistical methods for assessing agreement between two methods of clinical measurement', year: 1986, journal: 'The Lancet', volume: '327', issue: '8476', pages: '307-310', doi: '10.1016/S0140-6736(86)90837-8', checked: CHECKED },
  { id: 'blandAltman1999', methods: ['agree.blandAltman'], type: 'article', authors: ['Bland, J. Martin', 'Altman, Douglas G.'], title: 'Measuring agreement in method comparison studies', year: 1999, journal: 'Statistical Methods in Medical Research', volume: '8', issue: '2', pages: '135-160', doi: '10.1177/096228029900800204', checked: CHECKED },
  { id: 'cronbach1951', methods: ['rel.cronbach'], type: 'article', authors: ['Cronbach, Lee J.'], title: 'Coefficient alpha and the internal structure of tests', year: 1951, journal: 'Psychometrika', volume: '16', issue: '3', pages: '297-334', doi: '10.1007/BF02310555', checked: CHECKED },
  { id: 'feldt1965', methods: ['rel.cronbach'], type: 'article', authors: ['Feldt, Leonard S.'], title: 'The approximate sampling distribution of Kuder-Richardson reliability coefficient twenty', year: 1965, journal: 'Psychometrika', volume: '30', issue: '3', pages: '357-370', doi: '10.1007/BF02289499', checked: CHECKED },
  { id: 'strobeVet2016', methods: ['report.strobe'], type: 'article', authors: ["O'Connor, A. M.", 'Sargeant, J. M.', 'Dohoo, I. R.', 'Erb, H. N.', 'Cevallos, M.', 'Egger, M.', 'Ersbøll, A. K.', 'Martin, S. W.', 'Nielsen, L. R.', 'Pearl, D. L.', 'Pfeiffer, D. U.', 'Sanchez, J.', 'Torrence, M. E.', 'Vigre, H.', 'Waldner, C.', 'Ward, M. P.'], title: 'Explanation and elaboration document for the STROBE-Vet statement: Strengthening the Reporting of Observational Studies in Epidemiology, Veterinary Extension', year: 2016, journal: 'Journal of Veterinary Internal Medicine', volume: '30', issue: '6', pages: '1896-1928', doi: '10.1111/jvim.14592', checked: CHECKED },
  // ARRIVE 2.0 (checked against PubMed 32663219 on 2026-09-28): the reporting guideline for animal experiments, cited
  // instead of STROBE-Vet when the project's design is a laboratory or animal experiment (review round 2).
  { id: 'arrive2020', methods: ['report.arrive'], type: 'article', authors: ['Percie du Sert, N.', 'Hurst, V.', 'Ahluwalia, A.', 'Alam, S.', 'Avey, M. T.', 'Baker, M.', 'Browne, W. J.', 'Clark, A.', 'Cuthill, I. C.', 'Dirnagl, U.', 'Emerson, M.', 'Garner, P.', 'Holgate, S. T.', 'Howells, D. W.', 'Karp, N. A.', 'Lazic, S. E.', 'Lidster, K.', 'MacCallum, C. J.', 'Macleod, M.', 'Pearl, E. J.', 'Petersen, O. H.', 'Rawle, F.', 'Reynolds, P.', 'Rooney, K.', 'Sena, E. S.', 'Silberberg, S. D.', 'Steckler, T.', 'Würbel, H.'], title: 'The ARRIVE guidelines 2.0: updated guidelines for reporting animal research', year: 2020, journal: 'PLoS Biology', volume: '18', issue: '7', pages: 'e3000410', doi: '10.1371/journal.pbio.3000410', checked: CHECKED },
]);

/**
 * The references the given analyses cite, in the order of first mention, each once. A farm route cites its
 * own source ('route.<id>'); a report with a participant flow cites STROBE-Vet.
 * @param {{ method: string, route?: string|null }[]} used
 * @param {{ flow?: boolean }} [opts]
 * @returns {Reference[]}
 */
export function referencesFor(used, opts = {}) {
  const keys = [];
  for (const u of used || []) {
    if (u?.method) keys.push(u.method);
    if (u?.route && u.route !== 'none') keys.push(`route.${u.route}`);
  }
  // An animal experiment reports against ARRIVE 2.0; an observational study against STROBE-Vet.
  if (opts.flow) keys.push(opts.design === 'experiment' ? 'report.arrive' : 'report.strobe');
  const out = [];
  for (const k of keys) for (const r of REFERENCES) if (r.methods.includes(k) && !out.includes(r)) out.push(r);
  return out;
}
