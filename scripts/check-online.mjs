// ============================================================
// check-online.mjs — count current online users on vetmock
// ============================================================
// Subscribes to the same realtime channel HomeView uses
// ('vet-mock-online') as a *passive observer* (does NOT track itself
// → won't pad the count). After 4 s it prints the presence count and
// exits. Use before pushing to verify nobody is mid-exam.
// ============================================================

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const env = readFileSync(join(here, '..', '.env.local'), 'utf8');
const url = env.match(/^VITE_SUPABASE_URL=(.+)$/m)?.[1]?.trim();
const key = env.match(/^VITE_SUPABASE_ANON_KEY=(.+)$/m)?.[1]?.trim();
if (!url || !key) {
  console.error('Missing VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY in .env.local');
  process.exit(1);
}

const CHANNEL = 'vet-mock-online';
const supabase = createClient(url, key);
const channel = supabase.channel(CHANNEL, { config: { presence: { key: 'OBSERVER-' + Date.now() } } });

let printed = false;
const report = (label) => {
  if (printed) return;
  printed = true;
  const state = channel.presenceState();
  const keys = Object.keys(state);
  const flat = keys.flatMap((k) => state[k].map((p) => ({ key: k, ...p })));
  console.log(`[${label}] online users: ${keys.length}`);
  if (keys.length) {
    console.log('Presences:');
    flat.forEach((p, i) => console.log(`  ${i + 1}. key=${p.key.slice(0, 30)}…  online_at=${p.online_at || '—'}`));
  }
  channel.unsubscribe().finally(() => process.exit(0));
};

channel
  .on('presence', { event: 'sync' }, () => report('sync'))
  .subscribe((status) => {
    if (status === 'SUBSCRIBED') {
      // Observer mode — do NOT call channel.track() so we aren't counted.
      // Wait a bit for sync to fire; if it doesn't, force-report.
      setTimeout(() => report('timeout'), 4000);
    } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
      console.error('Channel error:', status);
      process.exit(1);
    }
  });
