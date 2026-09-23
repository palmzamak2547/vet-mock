// Is the checked-in copy of a generated file the same as a fresh generation?
//
// Two differences are not differences:
//   • line endings. Windows checkouts run with core.autocrlf=true, so git hands
//     every generated module back with CRLF while the generator writes LF. A
//     byte comparison called byte-identical content stale, and on 23 Sep that
//     cost a whole release gate at lint:exam-scope.
//   • the `// Built: <timestamp>` line some generators stamp, which changes on
//     every run by design.
// Everything else is compared exactly: a lone \r, a changed character, a
// missing or extra line, trailing whitespace. The tolerance must never hide a
// real drift, which tests/unit/generated-check-line-endings.test.mjs pins.

const BUILT_LINE = /^\/\/ Built:.*$/gm;

export function normalizeGenerated(text) {
  return String(text ?? '').replace(/\r\n/g, '\n').replace(BUILT_LINE, '// Built:');
}

export function sameGenerated(current, fresh) {
  return normalizeGenerated(current) === normalizeGenerated(fresh);
}
