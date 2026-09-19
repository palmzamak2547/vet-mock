// The one place that knows how to turn a stored transcript into "what was said".
//
// data-cache/plain/<id>.txt is NOT plain speech: it carries `# ...` headers and
// inline [m:ss] cues, and a cue can land in the MIDDLE of a word
// (`จากการ[9:33]สอบ`). Any check that compares a quote against it without
// removing those first reports every quote spanning a cue as altered.
//
// audit-quote-fidelity.mjs learned that the hard way and carried the fix
// inline. audit-shipped-quotes.mjs was written later, did not know, and made
// the same mistake — inflating one subject's count by 175 and nearly forcing a
// budget raise for a defect that did not exist. So the knowledge lives here now
// and both import it.
export function normaliseAudio(plain) {
  return plain
    .replace(/^#.*$/gm, '')
    .replace(/\[\d+:\d\d(?::\d\d)?\]/g, '')
    .replace(/\s+/g, '');
}

// Quoted spans as the RENDERER pairs them: split on the mark and take the odd
// segments. Never extract with a regex carrying a length floor — a floor skips
// a short quote and then pairs its closing mark with the next opening one,
// capturing the prose between two real quotes and reporting it as drift.
export function quotedSpans(line) {
  return line.split('"').filter((_, i) => i % 2 === 1);
}
