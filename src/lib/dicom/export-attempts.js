// Export the signed-in user's saved measurement attempts as CSV.
// Row-level security keeps this query scoped to the current account.

export async function fetchAndExportAttemptsCsv() {
  const { hasSupabase, getSupabase } = await import('../supabase.js');
  if (!hasSupabase) return { ok: false, reason: 'no-supabase' };
  const sb = await getSupabase();

  const { data: { user } } = await sb.auth.getUser();
  if (!user) return { ok: false, reason: 'no-auth' };

  const { data, error } = await sb
    .from('imaging_attempts')
    .select(`
      id, created_at, tool, numeric_result, secondary_result,
      classification, notes,
      case_id,
      cases:imaging_cases ( slug, title, species )
    `)
    .order('created_at', { ascending: false });
  if (error) {
    const msg = error.message || String(error);
    if (/schema cache|imaging_attempts|does not exist/i.test(msg)) {
      return { ok: false, reason: 'no-table' };
    }
    return { ok: false, reason: msg };
  }
  if (!data || data.length === 0) return { ok: false, reason: 'no-data' };

  const rows = data.map((attempt) => ({
    id: attempt.id,
    created_at: attempt.created_at,
    tool: attempt.tool,
    case_slug: attempt.cases?.slug ?? '',
    case_title: attempt.cases?.title ?? '',
    species: attempt.cases?.species ?? '',
    numeric_result: attempt.numeric_result ?? '',
    secondary_result: attempt.secondary_result ?? '',
    classification: attempt.classification ?? '',
    notes: (attempt.notes ?? '').replace(/\n/g, ' '),
  }));

  const headers = Object.keys(rows[0]);
  const csv = [
    headers.join(','),
    ...rows.map((row) => headers.map((header) => csvCell(row[header])).join(',')),
  ].join('\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `imaging_attempts_${new Date().toISOString().slice(0, 19).replace(/[:.]/g, '-')}.csv`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 60_000);

  return { ok: true, count: rows.length };
}

export function csvCell(value) {
  if (value === null || value === undefined) return '';
  let text = String(value);
  // Excel/Sheets can execute string cells beginning with a formula marker.
  // Notes and case titles are text, so prefix only string values; genuine
  // numeric measurements keep their numeric CSV representation.
  if (typeof value === 'string' && /^[\t\r\n ]*[=+\-@]/.test(text)) {
    text = `'${text}`;
  }
  if (/[",\n\r]/.test(text)) return `"${text.replace(/"/g, '""')}"`;
  return text;
}
