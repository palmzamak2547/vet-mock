# Release notes, one file per release

`npm run release:new -- minor` (or `patch`) writes `<version>.js` here with the next free number,
checked against origin/main and every open pull request (`--help` prints the usage). Take it when
you open the pull request and keep it; a collision (an add/add conflict on the file) is resolved by
taking another number. There is no queue and no renumbering at merge: Home announces every release
a device has not seen (`src/lib/changelog-seen.js`), so the order releases merge in does not matter.
Each file is `export default { version, date, headline, changes }`, the same shape as an entry in
`../changelog.js`, which keeps every release from before pipeline v2. `scripts/regen-latest-changelog.mjs`
gathers this folder into the derived modules; `lint:changelog-latest` checks it. Only what a
student notices goes here (AGENTS.md Rule 2).

## Renumbering

This is the one place renumbering is written down. It is needed when another pull request reached
main with your number first. `lint:release-number` (in `lint:data`, so in Build) fails then, naming
the file; GitHub also shows an add/add conflict on it.

1. `npm run release:new -- minor` (or `patch`): it writes an empty file with the next free number.
2. Move your entry into the new file: copy `headline` and `changes`, keep the new file's `version`
   and `date`, then delete your old `<old>.js` from your branch (main's file of that name is the
   other release's).
3. Rename `docs/releases/<old>.md` to `docs/releases/<new>.md` if you wrote one, and change the
   number in it and in the pull request's title.
