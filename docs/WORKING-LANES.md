# Working lanes

How several contributors work on this repository at the same time, on any
machine. The short rules are in `AGENTS.md` (Gitflow & parallel harnesses) and
the long ones in `docs/GITFLOW.md`; this page is what to do, in order.

## 1. Claim before you start

Work in flight is claimed in GitHub issue #253, which every machine can read.
Read it before you start, and comment to claim: what you will change, the
branch, and the files you expect to touch. Comment again when you finish or
drop it. A branch name alone claims nothing.

## 2. One owner per branch

A branch has one owner. Do not push to another contributor's branch and do not
stage another lane's files. Work in your own worktree, cut from `origin/main`,
and add files by exact path.

## 3. Take the release number when the pull request opens

Run `npm run release:new -- minor` (or `patch`) when you open the pull request
and keep the number. It checks `origin/main`, every open pull request and every
worktree on the same computer, and holds a lock so two runs in the same second
take two numbers. Two computers that run it in the same minute can still pick
one number: the second pull request then shows a conflict on the release file,
and running the command again picks the next one. Work that changes nothing a
student can notice takes no number.

## 4. CI on the pull request is the gate

Open the pull request as a draft (`gh pr create --draft`). A draft runs Build
only, so you can push as often as you like. When it is done, mark it ready once
(`gh pr ready`): that runs the full set, including the browsers. A busy local
machine is not a reason to skip a check, it is the reason to let CI run the
changed specs. Read a failure from the run, fix it, push again.

## 5. Every lint in one pass

`npm run lint:data` is one chain and stops at its first failure, which hides
every later one. `npm run lint:data:all` runs every step of that chain on its
own, to the end, and prints one table: step, pass or fail, seconds and the
first lines of each failure. It exits 1 when any step failed. It reads the chain
from `package.json`, so a lint added to `lint:data` runs there with no second
edit. Build runs it, so a red Build names every failing lint at once.

## 6. Pictures of screens from CI

To see a changed screen without building on your machine, put the label
`screens` on the pull request, or start the workflow Screens by hand
(`only`: part of a screen's name, `ref`: a branch or commit). It builds, runs
`npm run hunt:screens`, and keeps the pictures and `summary.md` as an artifact
for 7 days. The phone pictures are 390 x 664, the viewport of the e2e phone.
A pull request without the label never runs it.

## 7. Main heals from a flake once

When "Smoke e2e" fails on `main` at its first attempt, the workflow Main rerun
once reruns only the failed jobs, one time. If that second attempt also fails,
it opens an issue titled `main is red: Smoke e2e at <short sha>` listing the
failed jobs with links (or comments on the open issue with that title).
Production waits on that check, so an open issue of that title is the first
thing to read. It never reruns twice and never acts on a pull request.

## 8. The gate for a change to a screen

A change to a screen is judged at 390 x 664 first (the real first screen of a
phone browser), then at 1280:

1. One primary action a student sees within a second; everything else is quieter.
2. Count the controls, chips and labels in the first screenful, before and after: after is lower, or equal with a reason.
3. The primary action sits under the thumb; targets are 44 px or more; a rare or destructive action is not beside the primary one.
4. Sources, statistics, settings and explanations of the interface open on demand.
5. Related things sit together on one spacing scale; at most three text sizes in a card.
6. The short Thai word a student says aloud; no English fragment inside a Thai sentence; each thing said once.
7. Empty, loading, error, offline and long-text states look intended; nothing jumps when data arrives.
8. After a tap, the result and the next step are visible.
9. Text: the characters of interface text in the first screenful go down, never up; no paragraph above the primary action.
10. Reading: the meaning-carrying word first; a heading of two balanced lines at most; a button label that never wraps; a number on the line of its unit; Thai text never justified; the answer, then the reason, then the detail.
