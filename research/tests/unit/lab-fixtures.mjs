// Pins and data for the lab role's tests (not a test file itself) [M2-DESIGN.md 3.1]. Every number below
// was printed by R 4.6.0 (2026-04-24) in webR 0.6.0 under Node with sprintf('%.17g') (mvtnorm 1.2.4 for
// the multivariate t). Sources, next to each block:
//   ARCH  = the M2 architect's run, work/loop-2026-09-26/research-m2/architect-r/lab.R, lab2.R, lab3.R
//           (outputs lab.out, lab2.out), the numbers quoted in docs/research/M2-DESIGN.md 3.1;
//   LAB   = the lab role's run, work/loop-2026-09-26/research-m2/lab-r/lab-extra.R, lab-dunnett.R,
//           lab-dunnett3.R (outputs beside them);
//   MP    = an independent 30-digit mpmath evaluation of the same Dunnett integral,
//           lab-r/dunnett_mp.py (Python 3, mpmath 1.3.0).
// The rparity role turns these into tests/fixtures/r/<name>.R and r/out/<name>.json; a difference is a
// finding, not a silent update. Made-up datasets (rm) are labelled so wherever they are shown.
// OWNER: lab role.
import assert from 'node:assert/strict';

// STATS_INJECT=1 (stats-fixtures.mjs) shifts every pinned value inside close(); closeAbs does the same
// for the absolute comparisons below, so one environment variable turns every lab pin red.
const INJECT = process.env.STATS_INJECT === '1';

/** |got - want| <= tol, with the injected shift of stats-fixtures.mjs. */
export function closeAbs(got, want, tol, label) {
  if (INJECT && typeof want === 'number' && want !== 0) want *= 1 + 1e-5;
  assert.equal(typeof got, 'number', `${label}: expected a number, got ${got}`);
  assert.ok(Math.abs(got - want) <= tol, `${label}: got ${got}, want ${want} (absolute error ${Math.abs(got - want).toExponential(3)} > ${tol})`);
}

// ------------------------------------------------------------------ data
/** R's warpbreaks (Tippett 1950): breaks, wool A rows 1-27 then B, tension L, M, H in blocks of 9. */
export const WARPBREAKS = [26, 30, 54, 25, 70, 52, 51, 26, 67, 18, 21, 29, 17, 12, 18, 35, 30, 36, 36, 21, 24, 18, 10, 43, 28, 15, 26,
  27, 14, 29, 19, 29, 31, 41, 20, 44, 42, 26, 19, 16, 39, 28, 21, 39, 29, 20, 21, 24, 17, 13, 15, 15, 16, 28];
export const WB_WOOL = WARPBREAKS.map((_, i) => (i < 27 ? 0 : 1));
export const WB_TENSION = WARPBREAKS.map((_, i) => Math.floor((i % 27) / 9));
/** warpbreaks[-c(1, 20, 37), ] (1-based rows dropped), the unbalanced case. */
export const WB_DROP = new Set([0, 19, 36]);

/** Made-up (ข้อมูลสมมุติ / made-up data): eight animals x four times, animals 1-4 group A, 5-8 group B. */
export const RM = [[45, 50, 55, 70], [42, 42, 45, 60], [36, 41, 43, 62], [39, 35, 40, 53], [51, 55, 59, 70], [44, 49, 56, 65], [40, 48, 51, 58], [47, 53, 57, 71]];
export const RM_GROUP = [0, 0, 0, 0, 1, 1, 1, 1];

/** RoundingTimes, the ?friedman.test example (Hollander and Wolfe 1973, p. 140): 22 players x 3 methods. */
export const ROUNDING = [[5.40, 5.50, 5.55], [5.85, 5.70, 5.75], [5.20, 5.60, 5.50], [5.55, 5.50, 5.40], [5.90, 5.85, 5.70], [5.45, 5.55, 5.60],
  [5.40, 5.40, 5.35], [5.45, 5.50, 5.35], [5.25, 5.15, 5.00], [5.85, 5.80, 5.70], [5.25, 5.20, 5.10], [5.65, 5.55, 5.45], [5.60, 5.35, 5.45],
  [5.05, 5.00, 4.95], [5.50, 5.50, 5.40], [5.45, 5.55, 5.50], [5.55, 5.55, 5.35], [5.45, 5.50, 5.55], [5.50, 5.45, 5.25], [5.65, 5.60, 5.40],
  [5.70, 5.65, 5.55], [6.30, 6.30, 6.25]];

/** M1-DESIGN.md section 7 datasets. */
export const THREE = { A: [23, 25, 21, 27, 24], B: [30, 28, 33, 29, 31, 27], C: [26, 24, 28, 25, 29, 30, 27] };
export const TWO = { g1: [5.1, 4.9, 6.2, 5.8, 6.0, 5.5, 5.3, 6.4], g2: [6.8, 7.1, 6.5, 7.4, 6.9, 7.8, 6.25, 7.0, 7.3, 6.6] };
export const QUANTILES = [2, 4, 4, 5, 7, 9, 10, 12];

/** R's chickwts (Anonymous 1948, in McNeil 1977), feeds in R's level order; casein is the control. */
export const CHICKWTS = {
  casein: [368, 390, 379, 260, 404, 318, 352, 359, 216, 222, 283, 332],
  horsebean: [179, 160, 136, 227, 217, 168, 108, 124, 143, 140],
  linseed: [309, 229, 181, 141, 260, 203, 148, 169, 213, 257, 244, 271],
  meatmeal: [325, 257, 303, 315, 380, 153, 263, 242, 206, 344, 258],
  soybean: [243, 230, 248, 327, 329, 250, 193, 271, 316, 267, 199, 171, 158, 248],
  sunflower: [423, 340, 392, 339, 341, 226, 320, 295, 334, 322, 297, 318],
};

// ------------------------------------------------------------------ two-way ANOVA (R lm, drop1 / anova)
export const TWO_WAY = {
  // ARCH: options(contrasts = c('contr.sum', 'contr.poly')); drop1(lm(breaks ~ wool * tension), . ~ ., test = 'F')
  balancedIII: { ss: [450.6666666666697, 2034.2592592592646, 1002.777777777781], F: [3.7652883611186607, 8.4980466483580539, 4.1890689668510595], p: [0.058212975959558919, 0.00069262093671342711, 0.02104419072786275], rss: 5745.1111111111059, df: 48 },
  unbalancedIII: { ss: [667.85294117646936, 2272.3153594771284, 1011.0506535947716], F: [5.839167155309763, 9.9336458638570093, 4.4199054947824985], p: [0.019791796727819198, 0.00026711718104196493, 0.017678776764186867], rss: 5146.8611111111122, df: 45 },
  // ARCH: Type II by model comparison (deviance(lm(breaks ~ tension)) - deviance(lm(breaks ~ wool + tension)), ...)
  unbalancedII: { ss: [667.85294117646754, 2198.0020814479622, 1011.0506535947743], F: [5.8391671553097506, 9.6087781980001292, 4.4199054947825127], p: [0.019791796727819323, 0.00033502067145797901, 0.017678776764186641] },
  // LAB lab-extra.R: anova(lm(breaks ~ wool * tension)) (sequential, Type I)
  balancedI: { ss: [450.66666666666691, 2034.259259259258, 1002.7777777777762], F: [3.7652883611186332, 8.4980466483580166, 4.1890689668510346], p: [0.058212975959559793, 0.00069262093671344511, 0.021044190727863191] },
  unbalancedI: { ss: [628.90968325791857, 2198.0020814479694, 1011.0506535947736], F: [5.4986787355714561, 9.6087781980001612, 4.41990549478251], p: [0.02350156570081316, 0.00033502067145797066, 0.017678776764186704], rss: 5146.8611111111095 },
  // LAB: balanced Type II equals the other two
  balancedII: { ss: [450.66666666666606, 2034.25925925926, 1002.7777777777746] },
  // LAB: additive model, drop1(lm(breaks ~ wool + tension)) (Type II = Type III) and anova() (Type I)
  unbalancedAdditive: { ss: [667.85294117646936, 2198.0020814479622], F: [5.0973592079056482, 8.3880787656096238], p: [0.028647573390336939, 0.00076705842115041287], rss: 6157.9117647058838 },
  unbalancedAdditiveI: { ss: [628.90968325791937, 2198.0020814479644], p: [0.033450993804111512, 0.0007670584211504081] },
  // LAB: SS / (SS + deviance(fit)) on R's Type III SS (Cohen 1973's partial eta squared)
  unbalancedIIIEtaPartial: [0.11485568080750723, 0.30627595508547922, 0.16418725896490036],
  // LAB: aggregate(breaks ~ tension + wool, FUN = n, mean, sd), rows L-A, M-A, H-A, L-B, M-B, H-B
  unbalancedCells: { n: [8, 9, 8, 9, 8, 9], mean: [46.875, 24, 25, 28.222222222222221, 27.125, 18.777777777777779], sd: [17.860071188467945, 8.6602540378443873, 10.889050857234002, 9.8587242807801676, 8.5763378798046102, 4.8933060853010657] },
  // LAB: rowMeans / colMeans of the cell means (estimated marginal means) and the raw level means
  unbalancedEmm: { wool: [31.958333333333332, 24.708333333333332], tension: [37.548611111111114, 25.5625, 21.888888888888889] },
  unbalancedRaw: { wool: [31.640000000000001, 24.615384615384617], tension: [37, 25.470588235294116, 21.705882352941178] },
  // ARCH: TukeyHSD(aov(breaks ~ wool + tension), 'tension') and aov(breaks ~ wool * tension); pairs M-L, H-L, H-M
  tukeyAdditive: { diff: [-9.9999999999999858, -14.722222222222214, -4.7222222222222285], lwr: [-19.353420726843524, -24.075642949065752, -14.075642949065767], upr: [-0.6465792731564477, -5.3688014953786762, 4.6311985046213096], p: [0.03362621891137918, 0.0011217877170325297, 0.44742102143145668] },
  tukeyInteraction: { lwr: [-18.819647156951035, -23.541869379173264, -13.541869379173278], upr: [-1.1803528430489365, -5.902575065271165, 4.0974249347288207], p: [0.022855398402122584, 0.00055953922179385884, 0.40494419624975098] },
};

// ------------------------------------------------------------------ repeated measures (rm, made-up)
export const RM_PINS = {
  // ARCH: summary(aov(y ~ time + Error(subj/time))); anova(lm(W ~ 1), X = ~1, test = 'Spherical'); mauchly.test
  oneWay: {
    F: 102.72400756143638, p: 1.0361278220094827e-12, ssTime: 1940.7500000000011, ssError: 132.25000000000045, ssSubjects: 1005,
    gg: 0.74295583007441612, hf: 1.1060225141756919, pGG: 6.3544922112661984e-10, pHF: 1.0361278220094201e-12,
    mauchlyW: 0.3520329452001959, mauchlyP: 0.31497508421335702,
    // LAB: aggregate(y ~ time, mean and t interval)
    means: [43, 46.625, 50.75, 63.625], lwr: [39.003055505864246, 40.991266326679352, 44.74210579110359, 58.17137648523876], upr: [46.996944494135754, 52.258733673320648, 56.75789420889641, 69.078623514761233],
    etaPartial: 0.93620356970574048,
  },
  splitPlot: {
    betweenF: 4.3165098374679403, betweenP: 0.083007513791233611, timeF: 134.61849710982574, timeP: 1.619958068333379e-12,
    interactionF: 3.1734104046242431, interactionP: 0.049394457641948691,
    gg: 0.60829446256719732, hf: 0.86019024252514142, pGG: [2.5655093460439428e-08, 0.08498711332553617], pHF: [5.0612477592230915e-11, 0.059819340748629969],
    mauchlyW: 0.34779913618299102, mauchlyP: 0.42625680860736054,
    // LAB: summary(aov(y ~ grp * time + Error(subj/time))) sums of squares
    ssGroup: 420.5000000000004, ssSubjects: 584.49999999999795, ssTime: 1940.7500000000023, ssInteraction: 45.749999999999829, ssResidual: 86.500000000000909,
    // LAB: means per time within group (A T1..T4, B T1..T4) with t intervals
    means: [40.5, 42, 45.75, 61.25, 45.5, 51.25, 55.75, 66],
    lwr: [34.337219229718436, 32.191041716006112, 35.407049507827949, 50.120913528346307, 38.093259311102123, 45.992538342848995, 50.334383954025611, 56.541475469550072],
    upr: [46.662780770281564, 51.808958283993888, 56.092950492172051, 72.379086471653693, 52.906740688897877, 56.507461657151005, 61.165616045974389, 75.458524530449921],
  },
};

// ------------------------------------------------------------------ Friedman (R friedman.test)
export const FRIEDMAN = {
  rounding: { statistic: 11.142857142857142, p: 0.003805040775511363 }, // ARCH; R's help page prints 11.143, 0.003805
  small: { blocks: [[1, 2, 3], [2, 3, 1], [3, 1, 2], [1, 3, 2], [2, 2, 3]], statistic: 0.73684210526315785, p: 0.69182582527051728 }, // LAB, a tie in block 5
};

// ------------------------------------------------------------------ post hoc on three (A, B, C)
export const POSTHOC = {
  // ARCH (base R formula; R printed combn order with the opposite sign, z below is later minus earlier)
  dunn: { z: [3.071648878177335, 1.6575109380998472, -1.5987038901905439], p: [0.0021287997492868008, 0.097416219307379912, 0.10988641282605553], holm: [0.0063863992478604024, 0.19483243861475982, 0.19483243861475982], bonferroni: [0.0063863992478604024, 0.29224865792213972, 0.32965923847816658], bh: [0.0063863992478604024, 0.10988641282605553, 0.10988641282605553] },
  dunnSidak: [0.0063728135300126628, 0.26470337067661065, 0.29476104834862726], // LAB: -expm1(3 * log1p(-p))
  // ARCH: Games-Howell by the formula with ptukey / qtukey
  gamesHowell: { diff: [5.6666666666666679, 3, -2.6666666666666679], se: [1.3333333333333333, 1.2909944487358056, 1.2018504251546631], df: [8.5191347753743756, 8.571428571428573, 10.69620253164557], q: [6.0104076400856554, 3.2863353450309969, 3.137858162210946], p: [0.0061227773509222594, 0.1057300616054494, 0.11290435458703274], lwr: [1.9049750114342983, -0.63789789428938004, -5.926382425667188], upr: [9.4283583218990366, 6.63789789428938, 0.59304909233385228] },
  // ARCH: mvtnorm pmvt TVPACK(abseps = 1e-14) by inclusion-exclusion, root by uniroot(tol = 1e-14)
  dunnett: { diff: [5.6666666666666679, 3], se: [1.3204937348218293, 1.2769010104452851], t: [4.2913241594677132, 2.3494381909478088], p: [0.0012076754107012144, 0.05803904825531514], crit: 2.4281518529165904, lwr: [2.4603073576942944, -0.10050955450378574], upr: [8.8730259756390417, 6.1005095545037857], lambda: [0.7385489458759964, 0.76376261582597338], df: 15 },
  // LAB lab-dunnett3.R: chickwts casein (control), horsebean, linseed, meatmeal; three comparisons, TVPACK in 3 dimensions
  dunnett3: { t: [-6.7446532331409363, -4.5388686125967066, -1.97639122164876], df: 41, lambda: [0.67419986246324204, 0.70710678118654757, 0.69156407480812465], p: [1.1277111189311739e-07, 0.0001426761120024711, 0.13658534985034276], crit: 2.4436468935863465, lwr: [-222.57854488283121, -161.27375300825815, -104.38314451871122], upr: [-104.18812178383544, -48.392913658408474, 11.034659670226461] },
  // LAB lab-dunnett.R: all six chickwts feeds, five comparisons. TVPACK stops at three dimensions, so R's
  // numbers here are GenzBretz(maxpts = 1e6, abseps = 1e-11): randomised, with `errGenz` its own error
  // estimate, and computed as 1 - P with P near 1, so its first value (4.3e-9) is not trustworthy; the test
  // checks that one against the Bonferroni bounds and the independent mpmath value instead.
  dunnett5: { t: [-6.9567775595644843, -4.6816193833021842, -2.0385501855198229, -3.575623513609643, 0.23817459501696497], df: 65, lambda: [0.67419986246324204, 0.70710678118654757, 0.69156407480812465, 0.73379938570534275, 0.70710678118654757], pGenz: [4.3165322427540787e-09, 7.2020878436163116e-05, 0.16704459201938704, 0.003063981018633477, 0.99945249150985738], errGenz: [1.023248535472221e-09, 1.0677319322712203e-06, 1.6389235784419518e-06, 2.4379898994084152e-06, 3.2938741921604665e-09], critGenz: 2.5785325289729388,
    // MP: 20-digit mpmath of the same integral (lab-r/dunnett_mp20.py, printed to 15 digits). GenzBretz's first
    // value is 6e-9 below it, six times its own error estimate; the others agree within that estimate.
    pMpmath: [1.02895425118044e-8, 7.24239839187274e-5, 0.167044879055166, 0.00306411940688524, 0.999452490392491] },
  // LAB: pairwise.t.test(y, g, p.adjust.method = 'none' and 'BH'); Sidak -expm1(3 log1p(-p))
  pairwiseT: { none: [0.00064292910359721261, 0.032914102022380508, 0.044066233952400641], bh: [0.0019287873107916378, 0.044066233952400641, 0.044066233952400641], sidak: [0.0019275475030546615, 0.095527948832463613, 0.12645877219912052] },
};

// ARCH: Sidak and BH closed forms for p = 0.01, 0.04, 0.03, 0.005 (R p.adjust(method = 'BH'))
export const PADJUST = { p: [0.01, 0.04, 0.03, 0.005], sidak: [0.03940399, 0.15065344, 0.11470719, 0.019850499375], bh: [0.02, 0.040000000000000001, 0.039999999999999994, 0.02] };

// ------------------------------------------------------------------ diagnostics
export const DIAG = {
  // ARCH: shapiro.test
  shapiro: {
    g1: { W: 0.9634429275632348, p: 0.84218478817386655 },
    g2: { W: 0.99148531053242916, p: 0.99828865494813035 },
    quantiles: { W: 0.95223780578850037, p: 0.73375964349156608 },
    threeResid: { W: 0.95069928258865433, p: 0.43609214517293049 },
    n3: { W: 0.96428571428571419, p: 0.6368868450289632 },
    rt1: { W: 0.94677759274081952, p: 0.27226113315470202 },
  },
  // ARCH: qqnorm(two$g1)$x and qqnorm(RoundingTimes[, 1])$x, in data order
  qqG1: [-0.85249503427469386, -1.4342001596863794, 0.85249503427469386, 0.15250597424624424, 0.47278912099226722, -0.15250597424624437, -0.47278912099226728, 1.4342001596863794],
  qqRt1: [-0.82549449092923566, 0.99820117215288662, -1.4894700423279403, 0.17174708963751187, 1.4894700423279401, -0.53751910620277288, -0.67448975019608171, -0.4099833221873368, -1.2074140502222019, 1.2074140502222019, -0.99820117215288662, 0.5375191062027731, 0.40998332218733663, -2.0004235691059797, -0.05699967435837431, -0.28880935507446337, 0.28880935507446337, -0.17174708963751173, 0.05699967435837431, 0.67448975019608171, 0.82549449092923566, 2.0004235691059802],
  // ARCH: anova(lm(abs(y - ave(y, g, FUN = median)) ~ g)); LAB: the same with the mean (Levene 1960)
  brownForsythe: { F: 0.013312624805857532, p: 0.9867872413739025 },
  levene: { F: 0.013416815742397102, p: 0.98668461530932183 },
};
