// ============================================================
// id-migration.js — one-time migration of user-stored Q IDs
// ============================================================
//
// On 2026-05-13 we renumbered 165 duplicate Q IDs across the exotic /
// engprof / repro-lect subjects into reserved 50000+/51000+/52000+
// ranges. See `scripts/renumber-dup-ids.mjs`.
//
// Scope of user-data impact:
//   • `history` entries store BOTH `subject` and `questionId` → migrate
//     so analytics + dashboard pages keep correct links.
//   • `bookmarks`, `srCards`, `notes`, `vmx-grade-*` are bare-id keyed.
//     Pre-renumber they ambiguously pointed to whichever subject was
//     first in import order (always com3 for exotic-collisions, com4
//     for engprof, etc.). Post-renumber those bare-id entries still
//     point to the SAME Q (the kept side). No migration needed.
//
// Idempotent: gated by `vmx-id-migration-v1` flag in localStorage.
// Safe to call on every boot — no-op after first run.
// ============================================================

import migrationMap from './id-migration-map.json' with { type: 'json' };

const FLAG_KEY = 'vmx-id-migration-v1';

export function applyIdMigration() {
  if (typeof window === 'undefined') return; // SSR safety
  try {
    if (window.localStorage.getItem(FLAG_KEY) === '1') return;
  } catch { return; }

  let migratedCount = 0;

  // ── history: { subject, questionId } pairs ──────────────────
  try {
    const raw = window.localStorage.getItem('vmx-history');
    if (raw) {
      const history = JSON.parse(raw);
      if (Array.isArray(history)) {
        let changed = 0;
        for (const h of history) {
          if (!h?.subject || h.questionId == null) continue;
          const key = `${h.subject}:${h.questionId}`;
          if (migrationMap[key] != null) {
            h.questionId = migrationMap[key];
            changed++;
          }
        }
        if (changed > 0) {
          window.localStorage.setItem('vmx-history', JSON.stringify(history));
          migratedCount += changed;
        }
      }
    }
  } catch (e) {
    console.warn('[id-migration] history migration failed:', e?.message);
  }

  // ── Mark complete ───────────────────────────────────────────
  try {
    window.localStorage.setItem(FLAG_KEY, '1');
    if (migratedCount > 0) {
      console.info(`[id-migration v1] migrated ${migratedCount} history entries`);
    }
  } catch {}
}

// Helper for supabase pullUserData — same logic but accepts a raw
// history array (not localStorage). Returns the migrated array.
// Pre-migration cloud data benefits from the same fix on restore.
export function migrateHistoryArray(history) {
  if (!Array.isArray(history)) return history;
  let changed = 0;
  for (const h of history) {
    if (!h?.subject || h.questionId == null) continue;
    const key = `${h.subject}:${h.questionId}`;
    if (migrationMap[key] != null) {
      h.questionId = migrationMap[key];
      changed++;
    }
  }
  if (changed > 0) {
    console.info(`[id-migration v1] migrated ${changed} cloud history entries`);
  }
  return history;
}
