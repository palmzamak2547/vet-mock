// ============================================================
// useOnlineCount — realtime "X คนกำลังเรียนอยู่" via Supabase Presence
// ============================================================
// แสดงจำนวนคนที่เปิดเว็บอยู่ ณ ตอนนี้ (anonymous, ไม่ต้อง login)
//
// How it works
// ────────────
//   • Supabase Realtime channel "online-users" w/ Presence config
//   • ทุก tab subscribe → Supabase ส่ง presence sync event ให้ทุกคน
//   • นับจำนวน unique presence keys = จำนวนคนที่ active อยู่
//
// Performance
// ───────────
//   • SDK โหลดแบบ lazy (รอ requestIdleCallback หรือ 1.5s) — ไม่บล็อก
//     initial paint
//   • ส่ง heartbeat ~30s (Supabase default) → < 1 KB/min/user
//   • Update lag ~1-2 วิ (WebSocket push)
//
// Free tier capacity (Supabase): 200 concurrent connections — เพียงพอ
// สำหรับ Vet 86 (~60 คน) แม้ทุกคนเปิดพร้อมกันใกล้สอบ
// ============================================================

import { useEffect, useState } from 'react';
import { getSupabase, hasSupabase } from '../lib/supabase.js';

const CHANNEL_NAME = 'vet-mock-online';

export function useOnlineCount() {
  const [count, setCount] = useState(0);
  // status: 'disabled' (no Supabase env) | 'loading' | 'connected' | 'error'
  const [status, setStatus] = useState(hasSupabase ? 'loading' : 'disabled');

  useEffect(() => {
    if (!hasSupabase) return;

    let channel = null;
    let cancelled = false;
    let retries = 0;
    let retryTimer;

    const start = async () => {
      // ── Defer SDK load so it doesn't block initial paint ──
      await new Promise((resolve) => {
        if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
          window.requestIdleCallback(resolve, { timeout: 2000 });
        } else {
          setTimeout(resolve, 1500);
        }
      });
      if (cancelled) return;

      let supabase;
      try {
        supabase = await getSupabase();
      } catch {
        if (!cancelled) setStatus('error');
        return;
      }
      if (!supabase || cancelled) return;

      // Random anon ID per tab (regenerated on refresh — that's OK for a counter)
      const id = `anon-${Math.random().toString(36).slice(2, 10)}-${Date.now()}`;

      const joined = supabase.channel(CHANNEL_NAME, {
        config: { presence: { key: id } },
      });
      channel = joined;

      joined
        .on('presence', { event: 'sync' }, () => {
          if (cancelled || channel !== joined) return;
          const state = joined.presenceState();
          setCount(Object.keys(state).length);
        })
        .subscribe(async (subStatus) => {
          if (cancelled || channel !== joined) return;
          if (subStatus === 'SUBSCRIBED') {
            await joined.track({ online_at: new Date().toISOString() });
            if (cancelled || channel !== joined) return;
            setStatus('connected');
          } else if (subStatus === 'CHANNEL_ERROR' || subStatus === 'TIMED_OUT') {
            setStatus('error');
            // The previous page's channel may still be closing, or a proxy
            // timed out; a fresh subscribe usually lands. Three tries, then
            // the count honestly says it is not connected.
            if (retries < 3) {
              retries += 1;
              const old = channel; channel = null;
              try { old?.unsubscribe(); } catch {}
              retryTimer = setTimeout(() => { if (!cancelled) start(); }, 8000);
            }
          }
        });
    };

    start();

    return () => {
      cancelled = true;
      clearTimeout(retryTimer);
      if (channel) {
        try {
          channel.unsubscribe();
        } catch {}
      }
    };
  }, []);

  return { count, status };
}
