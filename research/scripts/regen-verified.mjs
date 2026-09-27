// Writes src/lib/runtime/verified.generated.js from the fixture declarations [M1-DESIGN.md 13.5].
// A fixture file declares itself with a top-level `_fixture`: { family, kind: 'pin'|'crosscheck', methods: [...] }
// (JSON) or an exported `FIXTURE` object (JS). Only kind 'pin' counts toward "ตรวจเทียบแล้ว": R 4.6.0
// outputs, NIST StRD, the course, the serosurvey numbers checked by an independent program.
// A declaration counts only when some tests/unit/*.test.mjs file references the fixture's path, and
// that test must fail when a wrong value is injected (proved once per module, recorded in the role
// notes). `--check` exits 1 when the generated file is stale.
// OWNER: runtime role. Until implemented it only reports.
console.log('regen-verified: not implemented yet (runtime role). VERIFIED stays empty, so no method shows the verified badge.');
