// The refusals the race RPCs raise (supabase/migrations/*_authenticated_races.sql),
// keyed by the exact RAISE EXCEPTION message PostgREST returns. Each one is
// something a retry can never fix, so none of them may read as a connection
// problem.
export const RACE_REFUSALS = Object.freeze({
  'Room unavailable': 'ไม่พบห้องนี้ หรือห้องหมดอายุแล้ว ตรวจรหัสห้องอีกครั้ง หรือสร้างห้องใหม่',
  'Race already started': 'ห้องนี้เริ่มแข่งไปแล้ว เข้าร่วมกลางทางไม่ได้ ขอรหัสห้องใหม่จากเพื่อน',
  'Room full': 'ห้องนี้เต็มแล้ว (รับได้ 10 คน) ให้เพื่อนสร้างห้องใหม่',
  'Too many rooms': 'สร้างห้องครบ 10 ห้องในชั่วโมงนี้แล้ว รอสักครู่แล้วสร้างใหม่',
});
