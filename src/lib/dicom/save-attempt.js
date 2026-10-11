// Helper for persisting a measurement attempt to imaging_attempts.
// Returns { ok: true, id } on success, { ok: false, reason } on
// failure. The reason is one of a closed set; reasonLabel turns it into a
// line the student can read. The database's own message never reaches the
// screen.
//
// Reasons:
//   'no-supabase'    Supabase env not configured
//   'no-auth'        User not signed in (auth.uid() needed for RLS)
//   'no-table'       imaging_attempts table not migrated yet (PGRST205, 42P01)
//   'no-permission'  the database refused the row (42501, row-level security)
//   'invalid'        a check constraint refused the row (23514)
//   'failed'         anything else
//
// The error CODE decides, never the words in the message: an RLS refusal and a
// check-constraint error both name imaging_attempts, and read as a missing
// migration when matched on the text.

export async function saveAttempt({ tool, measurement_json, numeric_result, secondary_result, classification, caseId, notes }) {
  let hasSb, getSb;
  try {
    ({ hasSupabase: hasSb, getSupabase: getSb } = await import('../supabase.js'));
  } catch {
    return { ok: false, reason: 'no-supabase' };
  }
  if (!hasSb) return { ok: false, reason: 'no-supabase' };
  let sb;
  try { sb = await getSb(); } catch { return { ok: false, reason: 'no-supabase' }; }

  const { data: { user } } = await sb.auth.getUser();
  if (!user) return { ok: false, reason: 'no-auth' };

  const { data, error } = await sb
    .from('imaging_attempts')
    .insert({
      user_id: user.id,
      case_id: caseId || null,
      tool,
      measurement_json,
      numeric_result,
      secondary_result,
      classification,
      notes,
    })
    .select('id')
    .single();

  if (error) return { ok: false, reason: classifySaveError(error) };
  return { ok: true, id: data?.id };
}

/** Which of the closed reasons a Supabase/PostgREST error is, by its code. */
export function classifySaveError(error) {
  const code = String(error?.code ?? '');
  if (code === 'PGRST205' || code === '42P01') return 'no-table';
  if (code === '42501') return 'no-permission';
  if (code === '23514') return 'invalid';
  return 'failed';
}

const FAILED_LABEL = 'บันทึกผลไม่สำเร็จตอนนี้ ลองใหม่ภายหลัง';
const REASON_LABELS = new Map([
  ['no-supabase', 'การบันทึกผลยังไม่เปิดใช้'],
  ['no-auth', 'เข้าสู่ระบบก่อนจึงจะบันทึกผลได้'],
  ['no-table', FAILED_LABEL],
  ['no-permission', 'เข้าสู่ระบบใหม่แล้วลองบันทึกอีกครั้ง'],
  ['invalid', 'ค่าที่วัดได้ไม่ครบ ลองวัดใหม่แล้วบันทึก'],
  ['failed', FAILED_LABEL],
]);

/** Student Thai for a reason. A value outside the set reads as a plain failure. */
export function reasonLabel(reason) {
  return REASON_LABELS.get(reason) ?? FAILED_LABEL;
}
