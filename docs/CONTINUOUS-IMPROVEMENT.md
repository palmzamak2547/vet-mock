# VetMock continuous improvement and shared coordination

The owner renewed this loop on 2026-09-30. It covers the study app, VetMock
Research, source accuracy, MyCourseVille coverage, design, performance and
platform reliability. Work through verified, useful slices. New architecture
needs an observed failure or a user need; reuse the existing curriculum, pool,
source registries, runtime and fixtures before adding another system.

Owner resumed on 2026-10-01 for review and real production. Keep the one claim
record below; new evidence is work/loop-20261001-release/. The prior closed-loop
receipt remains history. Production backend/schema, source, frontend alias and
real journeys must be recorded separately; no new automation follows from resume.

## One protocol across harnesses

Claude Code, Grok and other harnesses share [AGENTS.md](../AGENTS.md), this
protocol and [Launch Readiness](LAUNCH_READINESS.md). CLAUDE.md is a pointer,
not a second ruleset. Keep active ownership in one local file,
`work/loop-20260930/COORDINATION.md`; the coordinating task maintains it from
actual branch, worktree and process evidence. Local `.claude/` records, when
present, and lane `work/` records are evidence inputs, not parallel status authorities.

Use only currently available harnesses. The active coordination record overrides
historical provider lists; a named harness in an old guide is not an instruction
to invoke it or change its configured model or capabilities.

Each claim records the objective, branch/base, relative files or hunks, current
checks, blockers and next step. Use a separate worktree for competing changes.
Shared App, source, package and sync files need explicit hunk ownership; never
overwrite another harness's file or sweep its untracked work into a commit.
Reading its record does not mean it acknowledged a handoff. Mark acknowledgement
only after an actual reply; do not infer activity from a branch or process alone.

## Known lanes and evidence entrypoints

These names are coordination inputs to recheck, not claims that every lane is
currently running. The active local coordination record supersedes this table.

| Lane | Scope / existing record |
|---|---|
| Current improvement checkout | Dated checkpoint and acceptance: `docs/LAUNCH_READINESS.md`; active ownership: `work/loop-20260930/COORDINATION.md` |
| `research/m2` | `research/`; contracts `docs/research/M1-DESIGN.md` and `M2-DESIGN.md`; prior role records `work/loop-2026-09-26/research-m2/` |
| `sync/reland-0926` | Held sync candidate; prior review/simulator records `work/loop-2026-09-26/sync-reland/`; no release without its durability and rollout checks |
| `content/notes-0926` and other content lanes | Source notes/content and generated projections; verify the branch diff before assigning overlapping sources |
| `fix/bughunt-0926`, `fix/ex-tz-0927` and fixes | Prior bug-hunt inputs `work/loop-2026-09-26/bughunt-items.json` and `OPEN-ITEMS.md`; recheck main before reapplying anything |
| Primary dirty checkout | Preserve curriculum/docs and untracked `design/`/`scratchpad/`; both historical guide states are archived under `docs/handoff/history-2026-09-30/` |

The 2026-09-27 ledger's totals and local records are dated. Some `work/` files
exist only in the primary checkout or their originating lane. A new clone must
use committed source/current documentation and obtain the specific evidence
before asserting a historical item's present status.

## Loop acceptance

1. Refresh source/main, actual production state and the strongest alternative
   explanation. Choose one bounded slice and record its owner.
2. Trace every caller and the learner journey. Fix the common cause with the
   smallest complete change, retaining data, source evidence and accessibility.
3. Verify the observed failure and recovery at their real seam. Compare speed
   with matched inputs and quality; label missing measurements.
4. Run the applicable gates, keep broad browser gates quiet, and integrate only
   a stable tree. Research numerical methods retain reference fixtures and parity.
5. Release with one coordinated main push and the exact-SHA proof chain in
   Launch Readiness; verify the actual user journey and update the shared claim.
6. Replace superseded current status, retain detailed evidence in `work/`, and
   select the next evidenced need. Do not declare zero outstanding from an old
   ledger, a green build, an HTTP response or a platform-emulation result.

No new recurring automation is created by this protocol. Scheduling and cross-task
messages follow the owner's actual authorization and the available tool boundaries.
