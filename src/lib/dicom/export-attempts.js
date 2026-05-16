// Phase C — export the user's own saved measurement attempts as
// CSV. Useful for Palm's senior-project AI training pipeline: dump
// all your Norberg/VHS measurements + computed values + case refs
// into a spreadsheet, feed to model training, ground-truth labels.
//
// RLS keeps it user-scoped: each user only gets their own rows.
// For admin-level all-user export, use service-role from a script.

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

  // Flatten: case info via the joined cases relation
  const rows = data.map((a) => ({
    id: a.id,
    created_at: a.created_at,
    tool: a.tool,
    case_slug: a.cases?.slug ?? '',
    case_title: a.cases?.title ?? '',
    species: a.cases?.species ?? '',
    numeric_result: a.numeric_result ?? '',
    secondary_result: a.secondary_result ?? '',
    classification: a.classification ?? '',
    notes: (a.notes ?? '').replace(/\n/g, ' '),
  }));

  const headers = Object.keys(rows[0]);
  const csv = [
    headers.join(','),
    ...rows.map((r) => headers.map((h) => csvCell(r[h])).join(',')),
  ].join('\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `imaging_attempts_${new Date().toISOString().slice(0, 19).replace(/[:.]/g, '-')}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 60_000);

  return { ok: true, count: rows.length };
}

function csvCell(v) {
  if (v === null || v === undefined) return '';
  const s = String(v);
  // RFC 4180-ish escape: wrap in quotes if commas/quotes/newlines
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

// Sample AI prediction JSON — matches the schema in
// src/lib/dicom/AI-INTEGRATION.md. Downloaded so devs can see
// the format without reading the doc, then drop it back via
// 🤖 Load AI to see what the overlay looks like.
export function downloadSampleAiJson() {
  const sample = {
    type: 'vmx-lab-measurement',
    version: 1,
    model: 'sample-ai-v0',
    note: 'This is a SAMPLE prediction. Replace with your model output.',
    created_at: new Date().toISOString(),
    predictions: {
      norberg: {
        points: {
          left_femoral_head:   { world: [600, 900, 0], confidence: 0.93 },
          right_femoral_head:  { world: [900, 900, 0], confidence: 0.91 },
          left_acetabular_rim: { world: [550, 850, 0], confidence: 0.84 },
          right_acetabular_rim:{ world: [950, 850, 0], confidence: 0.82 },
        },
        left_angle: 105.2,
        right_angle: 103.7,
        classification: 'Borderline',
      },
      vhs: {
        points: {
          long_axis_start:  { world: [400, 500, 0] },
          long_axis_end:    { world: [700, 800, 0] },
          short_axis_start: { world: [420, 700, 0] },
          short_axis_end:   { world: [670, 690, 0] },
          vertebra_start:   { world: [200, 600, 0] },
          vertebra_end:     { world: [200, 650, 0] },
        },
        Lv: 5.6, Sv: 4.2, vhs: 9.8,
      },
      annotations: [
        { type: 'point', world: [500, 750, 0], label: 'Sample ROI', confidence: 0.7 },
      ],
    },
  };

  const blob = new Blob([JSON.stringify(sample, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'vmx-lab-ai-sample.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 60_000);
}
