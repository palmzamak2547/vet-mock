# Release notes, one file per release

`npm run release:new -- minor` (or `patch`) writes `<version>.js` here with the next free number,
checked against origin/main, every open pull request and every number reserved on the remote, and
then reserves it: the remote creates `refs/vmx-release/<version>` for one caller only
(`scripts/lib/release-reserve.mjs`), so two lanes that run it at the same moment, on any machines,
get different numbers. If the remote cannot be reached it says so loudly and the number is not
reserved. `--help` lists the options. Take the number when you open the pull request and keep it.
There is no queue and no renumbering at merge: Home announces every release a device has not seen
(`src/lib/changelog-seen.js`), so the order releases merge in does not matter. Each file is `export default { version, date, headline, changes }`, the same shape as an entry in
`../changelog.js`, which keeps every release from before pipeline v2. `scripts/regen-latest-changelog.mjs`
gathers this folder into the derived modules; `lint:changelog-latest` checks it. Only what a
student notices goes here (AGENTS.md Rule 2).

## Renumbering

This is the one place renumbering is written down. It is needed only when a number was taken
without a reservation (an unreachable remote, `--no-reserve`, or a number typed by hand) and another
pull request reached main with it first. `lint:release-number` (in `lint:data`, so in Build) fails
then, naming the file; GitHub also shows an add/add conflict on it.

1. `npm run release:new -- minor` (or `patch`): it reserves a new number and writes an empty file.
2. Move your entry into the new file: copy `headline` and `changes`, keep the new file's `version`
   and `date`, then delete your old `<old>.js` (main's file of that name is the other release's).
3. Rename `docs/releases/<old>.md` to `docs/releases/<new>.md` if you wrote one, and change the
   number in it and in the pull request's title.
4. Leave the old reservation alone: a number skipped is harmless, two releases on one number are not.
