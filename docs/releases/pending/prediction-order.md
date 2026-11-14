# Prediction order (pending, no release number)

Notes for the reviewer. No ordering changed, so nothing reaches a student: no changelog line, no
Thai line, no release number. Builds on `claude/data-scorecard`.

## What it adds

- `scripts/lib/topic-backtest.mjs`, `scripts/lib/topic-backtest-inputs.mjs`,
  `scripts/topic-backtest.mjs`: a topic-level backtest of the past-paper order. For each recorded
  paper (`EXAM_RECURRENCE`) with 5 or more items and an earlier cohort behind it, only earlier
  cohorts' papers are seen; each scorer ranks the subject's topics, and the paper is scored by the
  share of its items in the top 3, 5 and half of the topics, and by Spearman's rho. About 3 s, no
  install, writes nothing.
- `tests/unit/topic-backtest.test.mjs`: ties at the top-k boundary, Spearman with average ranks,
  the candidates' arithmetic, a reproducible bootstrap, and a hidden paper scored from earlier
  cohorts only.
- `docs/DATA-INTEGRITY-ROADMAP.md`: "Topic-level backtest", the rule and the result.

## The result

The rule was written before the first run: beat today's order at share@5 with a 98.75% paired
bootstrap interval above zero, win 60% of untied papers, lose nothing at share@3, share@half or rho,
and lose no more than 2 points in any subject with enough data. 32 papers, 818 items, 12 subjects.

| share@5, mean over papers | uniform | today's order | last cohort | cohort frequency | recency | mean share | frequency + this term's teaching |
|---|---|---|---|---|---|---|---|
| all subjects | 31.9 | 39.7 | 49.9 | 55.0 | 54.0 | 56.5 | 55.2 |

Every candidate beats uniform clearly. None passes against today's order: all are about one point
behind at half the topics, and 7.5 to 10.3 points behind in equine-medicine (three Vet 85 papers,
one of them a station). So `panicPool` and every other ordering are unchanged. The scorecard's
property 6 is unchanged too: the plan added the topic figure to it only for a passing candidate.

## Matching-rule fix

`sameItem` (`scripts/regen-exam-recurrence.mjs`) now keeps two items apart when both stems gloss
what they ask about in brackets and neither gloss shares a Latin word with the other stem. It
dropped bracketed text everywhere, so 13 distinct milk-meat-hygiene items (212030 to 212042, "which
pest-control principle is X") sat in 2 same-item groups; now 2 pairs remain (212034/212035 share
"curtain"; 212038 has no bracket). No other cluster in the bank moves (74 clusters, 15 across
cohorts, before and after) and no topic count changes. `exam-recurrence.generated.js` is
regenerated. Guard: 212030/212031 as a `distinct` pair in `tests/fixtures/exam-recurrence-pairs.json`,
red on the old rule, green on the new. Reading terms inside brackets as well was tried first and
split two real COM III same items (IVDD breeds, Cushing response), so it was not kept.

## Check in review

- The current order at topic level is taken as each topic's count of band-0 questions a student of
  the hidden cohort could have had (the shuffle inside band 0 weights topics by it), with undated
  items kept as in the item-level backtest. Dropping undated items makes today's order stronger
  (39.7 to 48.4) and the verdict the same.
- The teaching prior uses this term's syllabus on older cohorts, so the backtest can show only that
  it does no harm.
