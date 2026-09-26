import { getSupabase } from './supabase.js';

const GENERIC_FAILURE = 'ยังทำรายการไม่สำเร็จ ตรวจการเชื่อมต่อและสถานะห้องแล้วลองใหม่';

// Capture one principal and its token for the whole request. An SDK-wide
// account switch while fetch is pending cannot reassign the write.
//
// A refusal keeps what the server said (status, code, message) on the error.
// A caller that knows its RPC's refusals passes `refusals`, a map from the
// server's RAISE message to the Thai sentence to show; anything else keeps
// the generic message.
export async function ownedRpc(owner, name, args, { signal, refusals } = {}) {
  const sb = await getSupabase();
  const { data: { session } = {} } = await sb.auth.getSession();
  if (!owner || session?.user?.id !== owner) throw new Error('กรุณาเข้าสู่บัญชีเดิมแล้วลองอีกครั้ง');
  const response = await fetch(`${sb.supabaseUrl}/rest/v1/rpc/${name}`, {
    method: 'POST', headers: { apikey: sb.supabaseKey, Authorization: `Bearer ${session.access_token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(args), signal: signal || AbortSignal.timeout(12_000),
  });
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    const serverMessage = typeof body?.message === 'string' ? body.message : null;
    const known = serverMessage && refusals && Object.prototype.hasOwnProperty.call(refusals, serverMessage)
      ? refusals[serverMessage] : null;
    const error = new Error(known || GENERIC_FAILURE);
    error.status = response.status;
    error.code = typeof body?.code === 'string' ? body.code : null;
    error.serverMessage = serverMessage;
    error.refused = !!known;
    throw error;
  }
  return response.json();
}
