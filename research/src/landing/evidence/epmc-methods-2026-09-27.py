"""Europe PMC METHODS-section counts for capabilities the Research Studio plan does not yet cover.
Same query base as work/research-studio/evidence/epmc_counts.py (CUVET 2021-2026, full text)."""
import json, time, urllib.parse, urllib.request
API = "https://www.ebi.ac.uk/europepmc/webservices/rest/search"
BASE = 'AFF:"Faculty of Veterinary Science, Chulalongkorn University" AND PUB_YEAR:[2021 TO 2026]'
TERMS = {
  "two-way ANOVA": '("two-way ANOVA" OR "two way ANOVA" OR "two-way analysis of variance" OR "factorial ANOVA")',
  "repeated-measures ANOVA": '("repeated measures ANOVA" OR "repeated-measures ANOVA" OR "repeated measures analysis of variance")',
  "Dunnett": '("Dunnett")',
  "Dunn post hoc": '("Dunn\'s" OR "Dunn test" OR "Dunn post hoc")',
  "Friedman": '("Friedman test")',
  "nonlinear/dose-response IC50 EC50": '("IC50" OR "EC50" OR "dose-response curve" OR "nonlinear regression" OR "non-linear regression")',
  "standard curve / 4PL": '("standard curve" OR "four-parameter logistic" OR "4PL" OR "four parameter logistic")',
  "qPCR 2-ddCt": '("2-ΔΔCt" OR "2^-ΔΔCt" OR "ΔΔCt" OR "delta delta Ct" OR "comparative Ct" OR "2-ΔΔCT" OR "Livak")',
  "Kaplan-Meier / log-rank": '("Kaplan-Meier" OR "Kaplan Meier" OR "log-rank" OR "log rank test")',
  "Cox": '("Cox proportional" OR "Cox regression")',
  "ROC / AUC": '("ROC curve" OR "receiver operating characteristic")',
  "Bland-Altman": '("Bland-Altman" OR "Bland Altman")',
  "Passing-Bablok / Deming": '("Passing-Bablok" OR "Passing Bablok" OR "Deming regression")',
  "PCA / cluster / heatmap": '("principal component analysis" OR "PCA" OR "hierarchical clustering" OR "heatmap" OR "heat map")',
  "MIC50/MIC90": '("MIC50" OR "MIC90" OR "MIC 50" OR "MIC 90")',
  "noncompartmental PK": '("noncompartmental" OR "non-compartmental" OR "pharmacokinetic parameters")',
  "Poisson / negative binomial": '("Poisson regression" OR "negative binomial")',
  "meta-analysis": '("meta-analysis" OR "meta analysis" OR "systematic review")',
  "map / GIS / spatial": '("QGIS" OR "ArcGIS" OR "spatial analysis" OR "kernel density" OR "SaTScan")',
  "questionnaire / Cronbach": '("questionnaire" OR "Cronbach")',
  "randomization / blinding": '("randomly allocated" OR "randomly assigned" OR "randomized" OR "randomised" OR "blinded")',
  "Shapiro-Wilk": '("Shapiro-Wilk" OR "Shapiro Wilk")',
  "Excel": '("Microsoft Excel" OR "MS Excel")',
  "REDCap / Kobo / ODK / Google Forms": '("REDCap" OR "KoboToolbox" OR "Kobo Toolbox" OR "ODK" OR "Open Data Kit" OR "Google Form" OR "Google Forms")',
  "WHONET": '("WHONET")',
  "Bayesian latent class": '("latent class" OR "Hui-Walter" OR "Hui and Walter")',
}
def count(q):
    u = API + "?" + urllib.parse.urlencode({"query": q, "format": "json", "pageSize": 1, "resultType": "lite"})
    with urllib.request.urlopen(u, timeout=60) as r:
        n = int(json.load(r).get("hitCount", 0))
    time.sleep(0.34)
    return n
out = {"checked": time.strftime("%Y-%m-%d"), "base": BASE, "with_full_text": count(f"({BASE}) AND HAS_FT:Y"), "methods": {}}
for k, t in TERMS.items():
    out["methods"][k] = count(f"({BASE}) AND METHODS:{t}")
json.dump(out, open(__file__.replace(".py", ".json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print(json.dumps(out["methods"], ensure_ascii=False))
print("full text:", out["with_full_text"])
