# Pending: Thai house style, its detector, and the audit

No release number taken and no pull request opened; this rides in a later wave. Nothing a student sees changes in this branch, so it needs no changelog entry (Rule 2).

## What is in the branch

- `docs/THAI-STYLE.md`: the house style for every Thai word a student reads. English summary at the top, then principles with the reason each helps a tired reader, the patterns that read as translated or machine-written in this product with their plain forms, tone per surface (button, field label, error, empty state, confirmation, toast, loading, explanation, note, wrap-up line, release note), terms, 38 before and after pairs from real strings, and a list of the calls that are taste rather than rule.
- `scripts/lint-thai-style.mjs` with `docs/thai-style-budget.json`: eleven patterns counted per rule and per file; a file over its number fails, a file with no row may have none, `--write` only lowers. It reuses `extractStrings` from `lint-ui-copy.mjs`, so it reads the same copy and skips the same things (patterns, console, comments, content keys, vetwiki/, generated files), plus `src/data/changelog/` and `src/data/how-to.js`.
- `tests/unit/lint-thai-style.test.mjs`: each rule has strings it must catch, taken from the product, and ordinary Thai it must pass (ทำการ์ด, ความสามารถ, ถูกต้อง, ถูกตั้งแต่ครั้งแรก, ตอบถูกเพิ่มขึ้น, ชื่อนี้ถูกใช้แล้ว, รายการโปรด, ไม่มีการคุมสอบ); budget arithmetic; the tree within its budget; every rule points at a section that exists in the guide.
- `package.json`: `lint:thai-style`, added to `lint:data` right after `lint:ui-copy`.

## Counts on main 77d2cbe8 (the recorded budget)

| Rule | Hits | Plain form |
|---|---|---|
| please (กรุณา, โปรด) | 94 | start with the verb |
| thai-exclamation | 30 | drop "!" |
| passive-thuk (ถูกเก็บ, ถูกส่ง ...) | 22 | active or topic-first |
| hype (สุดยอด, เทพ!, สู้ๆ ...) | 9 | the number and the next step |
| riap-roi (เรียบร้อย) | 8 | แล้ว |
| mii-kan-event (มีการเปลี่ยนแปลง ...) | 3 | the verb |
| samart-dai (สามารถ...ได้) | 3 | ...ได้ / ...ไม่ได้ |
| dam-noen-kan (ดำเนินการ) | 2 | both are "ดำเนินการต่อด้วย Google", kept on purpose |
| tham-kan, in-order-to, essay-connector | 0 | already blocked |

Total 171.

## Checks run

- `node scripts/lint-thai-style.mjs`: OK within budget.
- `node --test tests/unit/lint-thai-style.test.mjs`: 17 pass.
- `tests/unit/gate.test.mjs` and `tests/unit/lint-ui-copy.test.mjs` with the setup import: 42 pass (the gate test resolves every `lint:data` leaf, so the new entry is valid).
- Not run: the full `lint:data` and unit suite (CI is the gate).

## For the reviewer

- The audit with ready-to-paste proposals, grouped by screen in the order students see them, is outside the repository at `C:/dev/vetmock-hunt/copy/FINDINGS.md` (210 rows: 159 from the detector, 51 found by reading). A fix wave should run `node scripts/lint-thai-style.mjs --write` in the same commit as each batch so the budget follows.
- Calls I was unsure about, listed for the owner:
  1. "ดำเนินการต่อด้วย Google" is Google's own Thai button text; kept and budgeted rather than rewritten.
  2. "โน้ต" means both a subject's study notes and the student's own notes, and Home calls the study notes "สรุป". The guide follows lint:ui-copy (Notes is โน้ต) and leaves the choice of one name to the owner.
  3. The night rank is spelled "โต้รุ้ง" throughout (feature name); the dictionary form is "โต้รุ่ง". Listed as a finding, not changed.
  4. Em dashes between Thai clauses (203 strings), "คุณ" where Thai would drop the subject (124 strings), decorative emoji and "คลิก" are in the guide as taste, not in the gate.
  5. Character voices (Mochi, the study buddy, the Pomodoro companion) still count in the hype and exclamation rules; the guide lets them stay playful without shouting.
