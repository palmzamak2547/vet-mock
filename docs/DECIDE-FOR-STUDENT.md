# Decide for the student

Palm, 11 Nov 2026: "ส่วนที่ให้users ตัดสินใจเยอะๆ อยากให้ลดลงแล้วเราใช้จิตวิทยาตัดสินใจสิ่งที่ดีที่สุดและเข้าใจผู้ใช้ที่สุดให้แทนครับ จะได้ไม่รก", and "สร้างระบบที่ใช้จิตวิทยาในทุกๆส่วน ฝังลงไปในinfrastructure ให้แข็งแกร่ง เป็นระบบ และต่อยอดได้เรื่อยๆ".

A student should not have to decide things before studying that the app already knows. The app picks the best default from what it knows, says in one short line what it picked and why, and keeps one quiet way to change it. This lives in one place, `src/lib/decide.js`, so every screen follows the same rules.

## The principles

Every decision names the principle it applies in its file's header (`// Principle: ...`):

| Principle | What it means on screen |
|---|---|
| Default effect | The option already chosen is the best one for this student. Most people keep the default, so the default has to be right. |
| Fewer choices | One option shown, the rest one tap away (`ปรับเอง`, `โหมดอื่น`). Every extra visible choice costs reading time. |
| A stated reason | One short line of why (`จัดให้แล้ว: ...` then the reason). A default with a reason is trusted; a silent one looks like a trap. |
| Yours wins | A choice the student makes is remembered and used next time, and the line then says `ตามที่คุณตั้งไว้`. `กลับไปใช้ค่าที่จัดให้` forgets it. |
| Timely | The nearer the paper, the more exam-like: the exam-prep card comes first within 14 days of a paper, and a set within 14 days of its subject's paper points at the exam rung. Time is said as Home's clock says it (วันนี้, พรุ่งนี้, ใกล้สอบ), never as a count of calendar days the hero's hours could contradict, and a paper that has ended is not counted. |

## The registry

The engine is `src/lib/decide.js`; each decision is one file in `src/lib/decisions/`, registered with `defineDecision` and listed in `src/lib/decisions/index.js`. A screen imports only the decision it uses (Home loads `home-mode.js`, not the practice rules), and passes its exported id. Each entry has `id`, `auto(signals)` returning `{ value, why }`, `valid(value)`, and optionally `key` (the student's choice lives under `vmx-decide:<key>`), `merge(auto, stored, signals)` (a remembered choice that covers only some rows; `null` means it does not apply), and `read`/`clear` (a choice already stored under older keys).

| id | Where | Signals | What it decides |
|---|---|---|---|
| `practice.setup` | TopicSelectView applies it on a topic tap; ConfigView explains it | ladder rung (`recallLadderStep`), pool size, the clock and feedback now, pick method, days to the subject's next paper, whether the student has history | count, timer and seconds, instant feedback, pick method. It wraps `ladderPreset`, so a student who never opens `ปรับเอง` gets exactly the set the ladder always made. |
| `sr.setup` | SRSessionView's planning step | Home's plan size, due and new counts | year scope, subject, paper scope, size, scheduler. The rows keep their own `vmx-sr-*` keys; a value other than the default is the student's. |
| `phase.firstRun` | YearSelectView, then Home | the timetable's current paper (`detectCurrentPhase`) | the paper after the year is chosen; Home prints the why (`ตามตารางสอบ`) once beside the paper's label. With no paper to offer (no table, term over, stale year) the phase screen is shown as before. Phase logic itself stays in `current-phase.js` (AGENTS.md Rule 10). |
| `home.mode` | HomeView's practice modes | the cards Home can show, days to the next paper, wrong-answer count, weak-topic accuracy | which one card is shown first; the rest sit unchanged under `โหมดอื่น`. Home offers no wrong-answer card in that grid (the rail row and NextActionCard carry it), so that branch applies only where a screen offers one. |

`decide(id, signals, io)` returns `{ value, why, by }`, with `by` `'you'` or `'auto'`. `remember`, `rememberRows` and `forget` write and clear the student's choice. Rules are pure: no clock, no storage. The screen builds the signals (`src/lib/decide-signals.js` for practice), and storage is an injected `{ get, set, remove }` defaulting to localStorage, every access wrapped, so a blocked store only means the app's own default. `adjustOpen`/`setAdjustOpen` remember whether a screen's disclosure is open; `leaveWhy`/`takeWhy` carry a why to the next screen once (the first run's paper, shown on Home).

## Adding a decision

1. Find the choice a student makes before studying and the signals that already answer it. If no signal answers it, it is not a decision for this registry yet.
2. Add a file in `src/lib/decisions/` (a `// Principle:` header line, `defineDecision({...})`) and a line in its `index.js`: a pure `auto`, a `valid` that rejects anything the screen cannot use, and a `key` if the student can override it.
3. Add its table to `tests/unit/decide.test.mjs`: every branch of `auto`, an invalid stored value, a throwing store.
4. On the screen (the rules that came out of the first review):
   - A line may say `จัดให้แล้ว` only when the screen is exactly what the app decided (`follows` in ConfigView). Anything else (Panic, a curated pool, a Home card with its own settings, an empty or still-counting pool) says what the set is, or that it is still counting, and opens with its rows on screen.
   - A student's rows are remembered only from a set the app decided, never from Panic, a curated pool or an exam, and a remembered row that changes nothing is not called theirs.
   - The restore sits beside `ตามที่คุณตั้งไว้` and gives the focus to the start; a restore goes back to the rule's own preset, not to whatever the other rows are now.
   - A count is shown only once it is counted (the planner says `กำลังนับใบที่ถึงรอบ…` until its bank is in) and says what it holds (`25 ใบ (ค้างทบทวน 340, ใหม่ 1,200)`).
   - The practice screen keeps its sticky start bar in thumb reach: under the line while ปรับเอง is closed, after the rows while it is open. On Home, cards due for review stay in view beside the first mode.
   Then: the line (`จัดให้แล้ว:` or `ตั้งไว้แล้ว:`, the value, the why), the action under it, every option inside one disclosure (a real `<button aria-expanded aria-controls>` and a region, closed by default), `remember` on the student's change and `กลับไปใช้ค่าที่จัดให้` when `by === 'you'`. Reuse the `.vmx-decide*` classes in `src/styles.css`.
5. Keep what a student who never opens the disclosure gets identical to before, unless the owner decides otherwise.

## Never decided silently

These keep an explicit confirmation from the student and never go into this registry as a default:

- anything that changes scoring or a result (marking, pass marks, what counts as correct);
- anything that deletes or overwrites data (history, cards, notes, imports, sync choices);
- anything that hides content (a filter that would remove questions from every view, a paper filter that empties a set).

An exam's own settings stay on screen as well: on `สอบจริง` and `จำลองสนามสอบ` choosing the paper's conditions is what the screen is for.
