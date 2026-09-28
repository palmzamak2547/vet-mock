"""Second, independent implementation of the M2 R pins, with SciPy/NumPy (M2-DESIGN.md 3).

Written by the rparity role on 2026-09-28. The pin for every M2 method is R 4.6.0 (research/tests/fixtures/r/out/
*.json, webR 0.6.0); this file recomputes what SciPy can, from the same input data (read from the `datasets`
block of each R file, so both sides see the same numbers), and writes scipy-crosscheck-m2.json: one row per
number with the R location it checks and a tolerance. research/tests/unit/rparity-m2.test.mjs compares every
row with the R file. A disagreement beyond the tolerance is a bug report on one side, not a choice.

Where SciPy has no function the formula is written out with NumPy and marked "formula"; where SciPy has an
independent algorithm (Boost's noncentral t and F, the studentized range, Dunnett's multivariate t, the
Kaplan-Meier estimator, the log-rank test, Shapiro-Wilk, Levene, Friedman) that is used.

Run:  PYTHONIOENCODING=utf-8 python scipy_crosscheck_m2.py   (writes scipy-crosscheck-m2.json beside it)
"""
import json
import math
import platform
from pathlib import Path

import numpy as np
import scipy
from scipy import stats

HERE = Path(__file__).parent
R_OUT = HERE.parent / "r" / "out"
ROWS = []


def rjson(name):
    return json.loads((R_OUT / f"{name}.json").read_text(encoding="utf-8"))


def f(x):
    x = float(x)
    if math.isnan(x):
        return None
    if math.isinf(x):
        return "Infinity" if x > 0 else "-Infinity"
    return x


def row(file, case, key, value, tol, index=None, how="scipy"):
    """tol: ('rel', r), ('abs', a) or ('absOrRel', a): within a absolute or 1e-6 relative."""
    ROWS.append({"file": file, "case": case, "key": key, "index": index, "scipy": f(value), "tol": tol[0], "bound": tol[1], "how": how})


def vec(file, case, key, values, tol, how="scipy"):
    for i, v in enumerate(values):
        row(file, case, key, v, tol, i, how)


REL12 = ("rel", 1e-12)
REL10 = ("rel", 1e-10)
REL8 = ("rel", 1e-8)
REL6 = ("rel", 1e-6)

# ------------------------------------------------------------------------------- friedman, normality
fr = rjson("friedman")
for case, name in (("roundingTimes", "roundingTimes"), ("rm", "rm")):
    y = np.array(fr["datasets"][name], dtype=float)
    res = stats.friedmanchisquare(*[y[:, j] for j in range(y.shape[1])])
    row("friedman", case, "statistic", res.statistic, REL12)
    row("friedman", case, "p", res.pvalue, REL10)

nm = rjson("normality")
for case, c in nm["cases"].items():
    if case.startswith("shapiro."):
        res = stats.shapiro(np.array(c["x"], dtype=float))
        row("normality", case, "W", res.statistic, REL6)
        row("normality", case, "p", res.pvalue, REL6)
    if case.startswith("qq."):
        x = np.array(c["x"], dtype=float)
        n = len(x)
        a = 3 / 8 if n <= 10 else 0.5
        pp = (np.arange(1, n + 1) - a) / (n + 1 - 2 * a)
        order = np.argsort(np.argsort(x, kind="stable"), kind="stable")
        vec("normality", case, "theoretical", stats.norm.ppf(pp)[order], REL12, "formula")

three = rjson("posthoc")
A = np.array([23, 25, 21, 27, 24], float)
B = np.array([30, 28, 33, 29, 31, 27], float)
C = np.array([26, 24, 28, 25, 29, 30, 27], float)
for case, center in (("brownForsythe.three", "median"), ("levene.three", "mean")):
    res = stats.levene(A, B, C, center=center)
    row("normality", case, "F", res.statistic, REL12)
    row("normality", case, "p", res.pvalue, REL10)

# ------------------------------------------------------------------------------------------ post hoc
groups = [A, B, C]
ns = np.array([len(g) for g in groups], float)
m = np.array([g.mean() for g in groups])
v = np.array([g.var(ddof=1) for g in groups])
pairs = [(1, 0), (2, 0), (2, 1)]
# Dunn (formula)
allv = np.concatenate(groups)
N = len(allv)
rk = stats.rankdata(allv)
cuts = np.cumsum([0] + [len(g) for g in groups])
Rbar = np.array([rk[cuts[i]:cuts[i + 1]].mean() for i in range(3)])
_, t = np.unique(allv, return_counts=True)
s2 = N * (N + 1) / 12 - np.sum(t ** 3 - t) / (12 * (N - 1))
z = [(Rbar[i] - Rbar[j]) / math.sqrt(s2 * (1 / ns[i] + 1 / ns[j])) for i, j in pairs]
vec("posthoc", "dunn.three", "z", z, REL12, "formula")
vec("posthoc", "dunn.three", "pRaw", [2 * stats.norm.sf(abs(x)) for x in z], REL10, "formula")
# Games-Howell with SciPy's studentized range (an independent integration from R's ptukey)
gh_p, gh_lo, gh_hi = [], [], []
for i, j in pairs:
    d = m[i] - m[j]
    se = math.sqrt(v[i] / ns[i] + v[j] / ns[j])
    df = (v[i] / ns[i] + v[j] / ns[j]) ** 2 / ((v[i] / ns[i]) ** 2 / (ns[i] - 1) + (v[j] / ns[j]) ** 2 / (ns[j] - 1))
    q = abs(d) / se * math.sqrt(2)
    gh_p.append(stats.studentized_range.sf(q, 3, df))
    crit = stats.studentized_range.ppf(0.95, 3, df) / math.sqrt(2)
    gh_lo.append(d - crit * se)
    gh_hi.append(d + crit * se)
vec("posthoc", "gamesHowell.three", "p", gh_p, REL6)
vec("posthoc", "gamesHowell.three", "lower", gh_lo, REL6)
vec("posthoc", "gamesHowell.three", "upper", gh_hi, REL6)
# Dunnett: scipy.stats.dunnett integrates the multivariate t by randomised quasi-Monte Carlo (seeded here);
# its accuracy is about 1e-5, so this row is a sanity check of the R pin, not a second pin at 1e-8.
dn = stats.dunnett(B, C, control=A, rng=np.random.default_rng(20260928))
vec("posthoc", "dunnett.three.controlA", "t", dn.statistic, REL12)
vec("posthoc", "dunnett.three.controlA", "p", dn.pvalue, ("abs", 1e-4))
ci = dn.confidence_interval(0.95)
vec("posthoc", "dunnett.three.controlA", "lower", ci.low, ("abs", 1e-3))
vec("posthoc", "dunnett.three.controlA", "upper", ci.high, ("abs", 1e-3))

# ----------------------------------------------------------------------------------------- two-way
aw = rjson("anova2")
wb = aw["datasets"]["warpbreaks"]


def sum_coded(levels, values):
    k = len(levels)
    cols = np.zeros((len(values), k - 1))
    for r, x in enumerate(values):
        i = levels.index(x)
        if i < k - 1:
            cols[r, i] = 1
        else:
            cols[r, :] = -1
    return cols


def rss(X, y):
    beta, *_ = np.linalg.lstsq(X, y, rcond=None)
    e = y - X @ beta
    return float(e @ e)


def type3(drop_rows):
    keep = [i for i in range(len(wb["breaks"])) if i + 1 not in drop_rows]
    y = np.array([wb["breaks"][i] for i in keep], float)
    a = sum_coded(wb["woolLevels"], [wb["wool"][i] for i in keep])
    b = sum_coded(wb["tensionLevels"], [wb["tension"][i] for i in keep])
    ab = np.column_stack([a[:, i] * b[:, j] for i in range(a.shape[1]) for j in range(b.shape[1])])
    one = np.ones((len(y), 1))
    full = np.hstack([one, a, b, ab])
    r_full = rss(full, y)
    ss = [rss(np.hstack([one, b, ab]), y) - r_full, rss(np.hstack([one, a, ab]), y) - r_full, rss(np.hstack([one, a, b]), y) - r_full]
    return ss, r_full


for case, drop in (("typeIII.balanced", []), ("typeIII.unbalanced", [1, 20, 37])):
    ss, r_full = type3(drop)
    vec("anova2", case, "ss", ss, REL10, "formula")
    row("anova2", case, "residualSs", r_full, REL10, how="formula")

# --------------------------------------------------------------------------------- repeated measures
rm = rjson("anovarm")
W = np.array(rm["datasets"]["rm"]["wide"], float)
grp = rm["datasets"]["rm"]["group"]


def epsilons(W, g=None):
    if g is None:
        R = W - W.mean(axis=0)
        dfres = W.shape[0] - 1
    else:
        R = W.copy()
        for lv in set(g):
            idx = [i for i, x in enumerate(g) if x == lv]
            R[idx] = W[idx] - W[idx].mean(axis=0)
        dfres = W.shape[0] - len(set(g))
    S = R.T @ R / dfres
    k = W.shape[1]
    p = k - 1
    H = np.zeros((k, p))  # orthonormal contrasts (Helmert, normalised)
    for j in range(p):
        H[: j + 1, j] = -1
        H[j + 1, j] = j + 1
        H[:, j] /= np.linalg.norm(H[:, j])
    lam = np.linalg.eigvalsh(H.T @ S @ H)
    gg = lam.sum() ** 2 / (p * (lam ** 2).sum())
    hf = ((dfres + 1) * p * gg - 2) / (p * (dfres - p * gg))
    return gg, hf


gg, hf = epsilons(W)
row("anovarm", "oneWay", "epsGG", gg, REL10, how="formula")
row("anovarm", "oneWay", "epsHF", hf, REL10, how="formula")
gg, hf = epsilons(W, grp)
row("anovarm", "splitPlot", "epsGG", gg, REL10, how="formula")
row("anovarm", "splitPlot", "epsHF", hf, REL10, how="formula")

# ----------------------------------------------------------------------------------- Hodges-Lehmann
hlj = rjson("hodgeslehmann")
c = hlj["cases"]["two.exact"]
row("hodgeslehmann", "two.exact", "estimate", np.median(np.subtract.outer(np.array(c["x"]), np.array(c["y"]))), REL10, how="formula")
c = hlj["cases"]["paired.exact"]
d = np.array(c["x"]) - np.array(c["y"])
walsh = [(d[i] + d[j]) / 2 for i in range(len(d)) for j in range(i, len(d))]
row("hodgeslehmann", "paired.exact", "estimate", np.median(walsh), REL10, how="formula")

# ------------------------------------------------------------------------------ noncentral and power
nc = rjson("noncentral")
for case, c in nc["cases"].items():
    if c["fn"] == "pnt":
        val = stats.nct.cdf(c["q"], c["df"], c["ncp"]) if c["lowerTail"] else stats.nct.sf(c["q"], c["df"], c["ncp"])
    else:
        val = stats.ncf.cdf(c["q"], c["df1"], c["df2"], c["ncp"]) if c["lowerTail"] else stats.ncf.sf(c["q"], c["df1"], c["df2"], c["ncp"])
    # R's pnt and pnbeta stop at an absolute error of 1e-12 and 1e-9 (noncentral.json notes): agreement is
    # 1e-6 relative or within that bound.
    row("noncentral", case, "p", val, ("absOrRel", 1e-12 if c["fn"] == "pnt" else 1e-9), how="scipy (Boost)")

pw = rjson("power")
c = pw["cases"]["anova.power"]
k, n = c["groups"], c["n"]
lam = (k - 1) * n * c["betweenVar"] / c["withinVar"]
row("power", "anova.power", "power", stats.ncf.sf(stats.f.isf(0.05, k - 1, k * (n - 1)), k - 1, k * (n - 1), lam), REL6, how="formula (power.anova.test)")
c = pw["cases"]["t.twoSample.power"]
n = c["n"]
df = 2 * (n - 1)
row("power", "t.twoSample.power", "power", stats.nct.sf(stats.t.isf(0.025, df), df, math.sqrt(n / 2) * c["delta"] / c["sd"]), REL6, how="formula (power.t.test, strict = FALSE)")
c = pw["cases"]["regression.power"]
u, vv, f2 = c["u"], c["v"], c["f2"]
row("power", "regression.power", "power", stats.ncf.sf(stats.f.isf(0.05, u, vv), u, vv, f2 * (u + vv + 1)), REL6, how="formula (pwr.f2.test)")
c = pw["cases"]["correlation.power"]
n, r = c["n"], c["r"]
tt = stats.t.isf(0.025, n - 2)
rc = math.sqrt(tt ** 2 / (tt ** 2 + n - 2))
zr = math.atanh(r) + r / (2 * (n - 1))
row("power", "correlation.power", "power", stats.norm.cdf((zr - math.atanh(rc)) * math.sqrt(n - 3)) + stats.norm.cdf((-zr - math.atanh(rc)) * math.sqrt(n - 3)), REL10, how="formula (pwr.r.test)")

# ---------------------------------------------------------------------------------------------- GLM


def irls(X, y, family, offset=None):
    off = np.zeros(len(y)) if offset is None else offset
    mu = (y + 0.5) / 2 if family == "binomial" else y + 0.1
    eta = np.log(mu / (1 - mu)) if family == "binomial" else np.log(mu)
    dev_old = np.inf
    for _ in range(100):
        if family == "binomial":
            mu = 1 / (1 + np.exp(-eta))
            w = mu * (1 - mu)
            zz = eta - off + (y - mu) / w
        else:
            mu = np.exp(eta)
            w = mu
            zz = eta - off + (y - mu) / mu
        XtW = X.T * w
        beta = np.linalg.solve(XtW @ X, XtW @ zz)
        eta = X @ beta + off
        if family == "binomial":
            mu = 1 / (1 + np.exp(-eta))
            dev = -2 * np.sum(y * np.log(mu) + (1 - y) * np.log(1 - mu))
        else:
            mu = np.exp(eta)
            dev = 2 * np.sum(np.where(y > 0, y * np.log(y / mu), 0) - (y - mu))
        if abs(dev - dev_old) / (abs(dev) + 0.1) < 1e-14:
            break
        dev_old = dev
    w = mu * (1 - mu) if family == "binomial" else mu
    V = np.linalg.inv((X.T * w) @ X)
    return beta, V, dev, mu


gl = rjson("glm")
inf = gl["datasets"]["infert"]
n = len(inf["case"])
lv = inf["educationLevels"]
X = np.column_stack([np.ones(n)] + [[1.0 if e == l else 0.0 for e in inf["education"]] for l in lv[1:]] + [inf["spontaneous"], inf["induced"]])
beta, V, dev, _ = irls(X, np.array(inf["case"], float), "binomial")
vec("glm", "logistic.infert", "B", beta, REL6, "formula (IRLS to 1e-14)")
vec("glm", "logistic.infert", "SE", np.sqrt(np.diag(V)), ("rel", 1e-5), "formula (IRLS to 1e-14)")
row("glm", "logistic.infert", "deviance", dev, REL6, how="formula (IRLS to 1e-14)")

dc = gl["datasets"]["doctors"]
ages = ["35-44", "45-54", "55-64", "65-74", "75-84"]
X = np.column_stack([np.ones(10), [1.0 if s == "yes" else 0.0 for s in dc["smoke"]]] + [[1.0 if a == l else 0.0 for a in dc["age"]] for l in ages[1:]])
beta, V, dev, mu = irls(X, np.array(dc["deaths"], float), "poisson", np.log(np.array(dc["py"], float)))
vec("glm", "poisson.doctors", "B", beta, REL6, "formula (IRLS to 1e-14)")
# R stops IRLS when the deviance changes by less than 1e-8 and reports the SE from that iteration's weights; this
# fit runs to 1e-14, so the SE agree to about 3e-6 (the engine mirrors glm.control and is pinned at 1e-6).
vec("glm", "poisson.doctors", "SE", np.sqrt(np.diag(V)), ("rel", 1e-5), "formula (IRLS to 1e-14)")
row("glm", "poisson.doctors", "deviance", dev, REL6, how="formula (IRLS to 1e-14)")
y = np.array(dc["deaths"], float)
row("glm", "poisson.doctors", "pearsonX2", np.sum((y - mu) ** 2 / mu), REL6, how="formula")

rb = rjson("robust")
sd = rb["datasets"]["sero"]
n = len(sd["pos"])
X = np.column_stack([np.ones(n), sd["age24"], sd["vacNo"], sd["herd"]])
y = np.array(sd["pos"], float)
beta, V, dev, mu = irls(X, y, "binomial")
farms = sorted(set(sd["farm"]))
U = np.zeros((len(farms), X.shape[1]))
for i in range(n):
    U[farms.index(sd["farm"][i])] += (y[i] - mu[i]) * X[i]
G = len(farms)
Vcl = V @ (U.T @ U) @ V * G / (G - 1)
vec("robust", "logistic.serosurvey", "B", beta, REL6, "formula (IRLS to 1e-14)")
vec("robust", "logistic.serosurvey", "robustSE", np.sqrt(np.diag(Vcl)), ("rel", 1e-5), "formula (sandwich, HC0 with G/(G-1); R's last-iteration weights, see the glm note)")

# ----------------------------------------------------------------------------------------- survival
sv = rjson("survival")
aml = sv["datasets"]["aml"]
t_all = np.array(aml["time"], float)
e_all = np.array(aml["status"], int)
km_case = sv["cases"]["km.byGroup.log-log"]
kmp = sv["cases"]["km.byGroup.plain"]
for st in ("Maintained", "Nonmaintained"):
    idx = [i for i, x in enumerate(aml["x"]) if x == st]
    tt, ee = t_all[idx], e_all[idx]
    cd = stats.CensoredData(uncensored=tt[ee == 1], right=tt[ee == 0])
    res = stats.ecdf(cd)
    sf = res.sf
    rows_r = [i for i, x in enumerate(km_case["values"]["stratum"]) if x == st]
    q = sf.quantiles
    for i in rows_r:
        tq = km_case["values"]["time"][i]
        j = int(np.where(q == tq)[0][0])
        ROWS.append({"file": "survival", "case": "km.byGroup.log-log", "key": "surv", "index": i, "scipy": f(sf.probabilities[j]), "tol": "rel", "bound": 1e-12, "how": "scipy.stats.ecdf"})
    for method, case in (("log-log", "km.byGroup.log-log"), ("linear", "km.byGroup.plain")):
        with np.errstate(all="ignore"):
            ci = sf.confidence_interval(0.95, method=method)
        for i in rows_r:
            tq = km_case["values"]["time"][i]
            j = int(np.where(q == tq)[0][0])
            lo, hi = ci.low.probabilities[j], ci.high.probabilities[j]
            if sf.probabilities[j] > 0 and 0 < lo:
                ROWS.append({"file": "survival", "case": case, "key": "lower", "index": i, "scipy": f(lo), "tol": "rel", "bound": 1e-10, "how": f"scipy.stats.ecdf ({method})"})
            if sf.probabilities[j] > 0 and hi < 1:
                ROWS.append({"file": "survival", "case": case, "key": "upper", "index": i, "scipy": f(hi), "tol": "rel", "bound": 1e-10, "how": f"scipy.stats.ecdf ({method})"})
xm = stats.CensoredData(uncensored=t_all[:11][e_all[:11] == 1], right=t_all[:11][e_all[:11] == 0])
xn = stats.CensoredData(uncensored=t_all[11:][e_all[11:] == 1], right=t_all[11:][e_all[11:] == 0])
lr = stats.logrank(xm, xn)
row("survival", "logrank", "statistic", lr.statistic ** 2, REL10, how="scipy.stats.logrank (z squared)")
row("survival", "logrank", "p", lr.pvalue, REL10, how="scipy.stats.logrank")

# ------------------------------------------------------------------------------------------ measure
rc = rjson("roc")
rd = rc["datasets"]["roc"]
status = np.array(rd["status"])


def delong(mk):
    pos, neg = mk[status == 1], mk[status == 0]
    psi = (pos[:, None] > neg[None, :]).astype(float) + 0.5 * (pos[:, None] == neg[None, :])
    auc = psi.mean()
    v10, v01 = psi.mean(axis=1), psi.mean(axis=0)
    return auc, v10, v01


out = {}
for key in ("marker1", "marker2"):
    mk = np.array(rd[key], float)
    auc, v10, v01 = delong(mk)
    out[key] = (auc, v10, v01)
    u = stats.mannwhitneyu(mk[status == 1], mk[status == 0]).statistic
    row("roc", key, "auc", u / (12 * 18), REL12, how="scipy.stats.mannwhitneyu")
    var = v10.var(ddof=1) / len(v10) + v01.var(ddof=1) / len(v01)
    row("roc", key, "variance", var, REL10, how="formula (DeLong 1988)")
(a1, p1, n1), (a2, p2, n2) = out["marker1"], out["marker2"]
cov = np.cov(p1, p2)[0, 1] / len(p1) + np.cov(n1, n2)[0, 1] / len(n1)
row("roc", "paired.delong", "covariance", cov, REL10, how="formula (DeLong 1988)")
vd = (p1.var(ddof=1) + p2.var(ddof=1) - 2 * np.cov(p1, p2)[0, 1]) / len(p1) + (n1.var(ddof=1) + n2.var(ddof=1) - 2 * np.cov(n1, n2)[0, 1]) / len(n1)
zz = (a1 - a2) / math.sqrt(vd)
row("roc", "paired.delong", "z", zz, REL10, how="formula (DeLong 1988)")
row("roc", "paired.delong", "p", 2 * stats.norm.sf(abs(zz)), REL10, how="formula (DeLong 1988)")

ba = rjson("blandaltman")
wr = np.array(ba["datasets"]["pefr"]["wright"], float)
mw = np.array(ba["datasets"]["pefr"]["mini"], float)
d = wr - mw
row("blandaltman", "absolute.196", "meanDifference", d.mean(), REL12, how="formula")
row("blandaltman", "absolute.196", "sd", d.std(ddof=1), REL12, how="formula")
row("blandaltman", "absolute.196", "loaLower", d.mean() - 1.96 * d.std(ddof=1), REL12, how="formula")
lin = stats.linregress((wr + mw) / 2, d)
row("blandaltman", "proportionalBias", "slope", lin.slope, REL10, how="scipy.stats.linregress")
row("blandaltman", "proportionalBias", "p", lin.pvalue, REL10, how="scipy.stats.linregress")

cr = rjson("cronbach")
Xi = np.array(cr["datasets"]["items"], float)
k = Xi.shape[1]
alpha = k / (k - 1) * (1 - Xi.var(axis=0, ddof=1).sum() / Xi.sum(axis=1).var(ddof=1))
row("cronbach", "items", "alpha", alpha, REL12, how="formula")
n = Xi.shape[0]
row("cronbach", "items", "feldtLower", 1 - (1 - alpha) * stats.f.ppf(0.975, n - 1, (n - 1) * (k - 1)), REL10, how="formula (Feldt 1965)")
row("cronbach", "items", "feldtUpper", 1 - (1 - alpha) * stats.f.ppf(0.025, n - 1, (n - 1) * (k - 1)), REL10, how="formula (Feldt 1965)")

su = rjson("survey")
sz = np.array(su["datasets"]["serosurvey"]["n"], float)
ps = np.array(su["datasets"]["serosurvey"]["positives"], float)
G = len(sz)
p = ps.sum() / sz.sum()
zg = (ps - p * sz) / sz.sum()
se = math.sqrt(G / (G - 1) * np.sum((zg - zg.mean()) ** 2))
tq = stats.t.ppf(0.975, G - 1)
row("survey", "serosurvey", "p", p, REL12, how="formula (ratio estimator)")
row("survey", "serosurvey", "se", se, REL10, how="formula (Taylor linearisation, clusters with replacement)")
row("survey", "serosurvey", "meanLower", p - tq * se, REL10, how="formula")
lo = math.log(p / (1 - p)) - tq * se / (p * (1 - p))
hi = math.log(p / (1 - p)) + tq * se / (p * (1 - p))
row("survey", "serosurvey", "logitLower", 1 / (1 + math.exp(-lo)), REL8, how="formula (logit, delta method)")
row("survey", "serosurvey", "logitUpper", 1 / (1 + math.exp(-hi)), REL8, how="formula (logit, delta method)")

OUT = {
    "_fixture": {"family": "scipy-1.17.1", "kind": "crosscheck", "methods": [], "note": "A second implementation of the M2 R pins; not a pin itself."},
    "_meta": {"script": "research/tests/fixtures/crosscheck/scipy_crosscheck_m2.py", "python": platform.python_version(), "scipy": scipy.__version__, "numpy": np.__version__},
    "rows": ROWS,
}
(HERE / "scipy-crosscheck-m2.json").write_text(json.dumps(OUT, indent=1, ensure_ascii=False) + "\n", encoding="utf-8")
print(f"wrote {len(ROWS)} rows with SciPy {scipy.__version__}, NumPy {np.__version__}")
