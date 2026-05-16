// Helper for persisting a measurement attempt to imaging_attempts.
// Returns { ok: true, id } on success, { ok: false, reason } on
// failure with a UI-friendly reason string.
//
// Reasons:
//   'no-supabase'  Supabase env not configured
//   'no-auth'      User not signed in (auth.uid() needed for RLS)
//   'no-table'     imaging_attempts table not migrated yet
//   '<msg>'        any other Supabase error

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

  if (error) {
    const msg = error.message || String(error);
    if (/schema cache|imaging_attempts|does not exist/i.test(msg)) {
      return { ok: false, reason: 'no-table' };
    }
    return { ok: false, reason: msg };
  }
  return { ok: true, id: data?.id };
}

export function reasonLabel(reason) {
  if (reason === 'no-supabase') return 'Supabase ยังไม่ตั้งค่า';
  if (reason === 'no-auth') return 'ต้อง sign in เข้า VetMock ก่อน save';
  if (reason === 'no-table') return 'Migration ยังไม่ apply (อ่าน supabase/README-imaging-lab.md)';
  return `บันทึกไม่สำเร็จ: ${reason}`;
}
