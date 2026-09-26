# Study journey continuity

Candidate 5.132.0 / SWv197, based on released `3e6fb3eb` (5.131.0).

## Changes

- `DashboardView`: native date parsing lets numeric and legacy ISO history share the charts. Missing/invalid dates remain in history but do not invent a study day. Curriculum `yearForSubject` replaces a one-time map over the initially empty lazy question bank.
- `ReadingChecklistView`: uses canonical subject/topic scope plus known semester. Unknown metadata remains reachable; opposite-paper/term marks stay stored. Rejected writes show an error and cannot leave a celebration armed for a later remote update.
- `ScheduleView`: generated per-paper counts and the existing pool builder over personal questions determine usable practice. A named timetable paper sets its phase and clears the previous topic. A class with Notes but no practice for that paper opens reading. The explicit named-content fallback in the exam engine is unchanged.
- `App` and `NotesView`: native history entries carry Notes subject/topic and return context. Back returns to the checklist, schedule or original Wiki URL. Checklist/calendar scroll waits for the view chunk to commit; Wiki returns to its article heading because its body loads separately. A pending view cannot steal focus from an open modal.

No added dependency, database/schema change, medical content edit, new learning store, forced reload or worker takeover. SW changes only its release version.

## Evidence and limits

Focused regressions exercise actual Dashboard rendering, real scope/pool logic, failed writes, timed chunk failure/retry, native Back/Forward, actual persisted question sets and backup import. The delayed checklist return failed at scroll 163 versus the original 3129; unrelated Wiki navigation returned Rabies instead of the saved milk topic before the history fix.

Browser coverage runs on Chromium desktop/mobile, WebKit mobile and Firefox desktop. Full release-gate and exact deployment receipts are recorded separately in `work/study-loop-0926/RELEASE-STATUS.md` after verification. Focused logs, screenshots and red-before evidence are retained in that directory.

Ordinary hard reload still follows the existing stateful-route rules; this does not turn Notes into a shareable route. The Notes retry path preserves its return entry. Physical iOS, real assistive technology and new signed-in multi-device tests are outside this change's proof.

## Concurrent integration

Merge only the scoped App/Notes hunks alongside the bughunt lane. Preserve security `69e7f158` and the sync/content/research worktrees. No SQL replay, Archive Worker upload or secret change is part of this release. `AGENTS.md` is the canonical shared handoff.
