// ============================================================
// The title a lecture summary is shown and saved under
// ============================================================
// Four preclinic-orientation summaries were filed with `title: null`, so the
// modal heading was empty and saving the summary threw on `title.replace`.
// VIDEO_META cannot fill the gap: it is derived from these same entries and
// carries the same null. What the entry does hold is its own markdown, and a
// summary's first `# ` heading is the lecture's name as it was written down.
// With neither, the screen says what the thing is rather than nothing.
// ============================================================

export const SUMMARY_TITLE_FALLBACK = 'สรุปคลิปบรรยาย';

/** The summary's first H1 (`# ...`), or '' when it has none. */
export function summaryHeading(markdown) {
  const m = /^#[ \t]+(.+)$/m.exec(String(markdown ?? ''));
  return m ? m[1].trim() : '';
}

/** The title on record, else the summary's own first heading, else ''. */
export function recordedSummaryTitle(summary) {
  const own = typeof summary?.title === 'string' ? summary.title.trim() : '';
  return own || summaryHeading(summary?.summary);
}

/** What the modal shows as the heading: never empty. */
export function summaryTitle(summary) {
  return recordedSummaryTitle(summary) || SUMMARY_TITLE_FALLBACK;
}

/** A file name for the saved summary; Thai letters and marks are kept. */
export function summaryFileName(summary) {
  const base = recordedSummaryTitle(summary).replace(/[^\p{L}\p{M}\p{N}.-]+/gu, '_').replace(/^_+|_+$/g, '');
  return `${base || summary?.videoId || 'summary'}.md`;
}
