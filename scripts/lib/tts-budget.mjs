// ============================================================
// tts-budget: the spending rules of scripts/tts-clips.mjs, apart from its
// network calls so a test can hold them to account
// ============================================================
// Every rule fails closed: a balance that cannot be read, or a paid run with
// no floor, stops the spending instead of letting it pass unnoticed.
// ============================================================

// The transcription check's credits (the ElevenLabs plan, shared with other
// work) never go below `floor`. readBalance() gives the credits left, read
// again every `every` checks; this run's own spend since the read counts too.
// allow(estimate) answers 'ok' (buy the check), 'floor' (no check, the floor
// is near) or 'unreadable' (the balance could not be read: stop the run).
export function scribeGate({ readBalance, floor, every = 40 }) {
  let left = null;
  let spent = 0;
  let checks = 0;
  let unreadable = null;
  return {
    async allow(estimate) {
      if (unreadable) return 'unreadable';
      if (left == null || checks % every === 0) {
        let value = NaN;
        try { value = Number(await readBalance()); } catch (e) { unreadable = `cannot read the transcription balance (${String(e?.message || e).slice(0, 80)})`; return 'unreadable'; }
        if (!Number.isFinite(value)) { unreadable = 'cannot read the transcription balance'; return 'unreadable'; }
        left = value;
        spent = 0;
      }
      if (left - spent - estimate < floor) return 'floor';
      checks++;
      return 'ok';
    },
    spend(cost) { spent += Number.isFinite(cost) && cost > 0 ? cost : 0; },
    get checks() { return checks; },
    get spent() { return spent; },
    get reason() { return unreadable; },
  };
}

// The credits left on an ElevenLabs subscription answer, or NaN when it does
// not carry both numbers (a key without the user-read permission answers
// 401 with { detail }).
export function elevenLeft(j) {
  const limit = Number(j?.character_limit);
  const count = Number(j?.character_count);
  return j && j.character_limit != null && j.character_count != null && Number.isFinite(limit) && Number.isFinite(count) ? limit - count : NaN;
}

// A paid generation must carry a floor (--keep-remaining) or a cap
// (--max-credits): without either it would spend the whole balance.
export function paidRunProblem({ paid, maxCredits, keepRemaining, dry = false, generating = true }) {
  if (!paid || dry || !generating) return null;
  if (Number.isFinite(maxCredits) && maxCredits > 0) return null;
  if (Number.isFinite(keepRemaining) && keepRemaining > 0) return null;
  return 'a paid generation needs --keep-remaining <credits> or --max-credits <credits>';
}

// The clips a run voices: not made yet, and, unless retried on purpose, not
// one that already failed its check twice (each try is paid).
export const clipsToMake = (queue, { done, failed, retryFailed = false }) =>
  queue.filter((k) => !done.has(k) && (retryFailed || !failed.has(k)));

// A whole-subject manifest. A subject once served stays served unless the run
// says --unpublish: a top-up run without --publish must not take it back to
// the old voice. wasComplete is the published manifest's flag, or null when it
// could not be read; then only --publish or --unpublish may write it.
export function wholeSubjectManifest({ have, whole, publish, unpublish, wasComplete }) {
  if (unpublish) return { complete: false, keys: have };
  if (publish) return { complete: whole, keys: have };
  if (wasComplete == null) return null;
  return { complete: wasComplete === true && whole, keys: have };
}
