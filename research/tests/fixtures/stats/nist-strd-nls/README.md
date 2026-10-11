NIST/ITL Statistical Reference Datasets for nonlinear regression (public domain, US government work), for the lab
role's nonlinear least-squares core [M3-DESIGN.md 3.1.1]. Downloaded 2026-10-08 from
https://www.itl.nist.gov/div898/strd/nls/data/LINKS/DATA/<name>.dat

- Lower level of difficulty: Misra1a, Chwirut2, DanWood, Misra1b
- Higher level of difficulty: Rat42, Rat43, MGH09, Thurber, BoxBOD, Eckerle4

The files are unchanged. NIST's headers carry the model, two sets of starting values (Start 1, Start 2), the
certified parameter values with their standard deviations, the residual sum of squares, the residual standard
deviation and the degrees of freedom; the tests parse them from the file, so no number is typed twice. Each test
codes the model and its analytic Jacobian as the file states it.

Fixture declaration for scripts/regen-verified.mjs (`fixture.json`): family `nist-strd`, kind `crosscheck`, methods
`nls.fourPL`, `nls.doseResponse`, `nls.equation` (they share the core). It is a second check, not a pin: the sets
exercise the shared least-squares core with NIST's own models, never the 4PL, 5PL or curve equations, their EC50 or
the concentrations read off a curve, so they do not make those methods "verified against NIST" (fix-stats finding
14). R 4.6.0 (tests/fixtures/r/out/nonlinear.json) remains their pin.

Assertions (tests/unit/stats-nls.test.mjs): log relative error (LRE, capped at 15) of every certified value from
both starting points, at least 6 for the lower sets and at least 5 for the higher sets that converge. A higher set
that does not converge from Start 1 must return `lab.invalid.notConverged`, never wrong numbers; the notes record
which sets those are. The standard deviations are s^2 (J'J)^-1 at the solution (M3-DESIGN.md C2), which is how NIST
computed them.
