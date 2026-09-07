import { getSupabase } from './supabase.js';

// Capture one principal and its token for the whole request. An SDK-wide
// account switch while fetch is pending cannot reassign the write.
export async function ownedRpc(owner, name, args, { signal } = {}) {
  const sb = await getSupabase();
  const { data: { session } = {} } = await sb.auth.getSession();
  if (!owner || session?.user?.id !== owner) throw new Error('กรุณาเข้าสู่บัญชีเดิมแล้วลองอีกครั้ง');
  const response = await fetch(`${sb.supabaseUrl}/rest/v1/rpc/${name}`, {
    method: 'POST', headers: { apikey: sb.supabaseKey, Authorization: `Bearer ${session.access_token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(args), signal: signal || AbortSignal.timeout(12_000),
  });
  if (!response.ok) throw new Error('ยังทำรายการไม่สำเร็จ ตรวจการเชื่อมต่อและสถานะห้องแล้วลองใหม่');
  return response.json();
}
