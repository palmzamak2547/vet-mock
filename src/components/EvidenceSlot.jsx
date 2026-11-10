import { useEffect, useState } from 'react';

// The slide under a revealed answer (docs/ANSWER-EVIDENCE.md). This file is
// all the question card carries: the lookup, the view and its styles are one
// lazy chunk (AnswerEvidence.jsx), asked for while the first question is read,
// and each subject's index follows as its questions come up.
let runtime = null;
let job = null;
const load = () => {
  job ||= import('./AnswerEvidence.jsx').then((m) => { runtime = m; }, () => { job = null; });
  return job;
};

/** Bring the view, a subject's index and the images' address into memory. Never rejects. */
export const warmEvidence = (subject) => load().then(() => runtime?.warm(subject)).catch(() => {});

/** Warm up while the question is on screen, so its slide can paint together with the explanation. */
export function useEvidenceWarmup(subject) {
  useEffect(() => { if (subject) warmEvidence(subject); }, [subject]);
}

/**
 * `late`: a review list may let a slide arrive after its row (the row is not
 * under the student's finger). The practice card may not: a slide that was
 * not ready when the answer appeared stays out, because a block arriving late
 * would push the next button away from the tap.
 */
export default function EvidenceSlot({ q, late = false }) {
  const [rec, setRec] = useState(() => runtime?.lookup(q));
  useEffect(() => {
    if (rec !== undefined || !late) return undefined;
    let live = true;
    warmEvidence(q.subject).then(() => { if (live && runtime) setRec(runtime.lookup(q) || null); });
    return () => { live = false; };
  }, [q, late, rec]);
  const View = runtime?.default;
  return rec && View ? <View rec={rec} late={late} /> : null;
}
