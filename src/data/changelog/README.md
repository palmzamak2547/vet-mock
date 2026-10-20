# Release notes, one file per release

`npm run release:new -- minor` (or `patch`) writes `<version>.js` here with the next free number.
Each file is `export default { version, date, headline, changes }`, the same shape as an entry in
`../changelog.js`, which keeps every release up to 5.148.0. `scripts/regen-latest-changelog.mjs`
gathers this folder into the derived modules; `lint:changelog-latest` checks it. Only what a
student notices goes here (AGENTS.md Rule 2).
