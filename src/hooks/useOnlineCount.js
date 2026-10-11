// ============================================================
// useOnlineCount — how many devices have the app open right now
// ============================================================
// Supabase Presence on the public channel 'vet-mock-online' (anonymous, no
// login). The number is shown only in the back-office (AdminView).
//
// How it works
// ────────────
//   • every tab subscribes → Supabase sends a presence sync to everyone
//   • the presence key is one id per device per day, kept in localStorage
//     ({ id, day }), so several tabs on one device merge under one key;
//     when storage is unavailable the tab falls back to a key of its own
//   • unique presence keys = devices open right now, not people: one
//     student on a phone and a laptop counts twice, and a device whose
//     storage is blocked counts once per tab
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
const DEVICE_KEY = 'vmx-online-device-v1';

/**
 * The presence key for this device: the same for every tab on one device
 * for one calendar day (UTC), a fresh one the next day. `storage` is
 * localStorage; a missing or throwing storage (private mode, blocked site
 * data) gives a per-tab key, so the count still works, one tab at a time.
 */
export function onlineDeviceKey(storage, now = new Date(), random = Math.random) {
  const day = now.toISOString().slice(0, 10);
  let saved = null;
  try { saved = JSON.parse(storage.getItem(DEVICE_KEY) || 'null'); } catch { saved = null; }
  if (saved && saved.day === day && typeof saved.id === 'string' && /^dev-[a-z0-9]{6,}$/.test(saved.id)) return saved.id;
  // A missing, stale, garbled or foreign value is replaced, never trusted.
  const id = `dev-${random().toString(36).slice(2, 10)}${now.getTime().toString(36)}`;
  try { storage.setItem(DEVICE_KEY, JSON.stringify({ id, day })); } catch {
    return `tab-${random().toString(36).slice(2, 10)}-${now.getTime()}`;
  }
  return id;
}

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

      // One key per device per day (see onlineDeviceKey), so a second tab on
      // the same device does not count again.
      const id = onlineDeviceKey(typeof window !== 'undefined' ? window.localStorage : undefined);

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
