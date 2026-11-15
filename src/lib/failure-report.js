// ============================================================
// failure-report.js — what /app/admin shows under "ล้มเหลวใน 24 ชั่วโมง"
// ============================================================
// Two reads, each failing on its own:
//   1. admin_failures (supabase/migrations/20261115230000_failure_record.sql):
//      browser failures counted in the last 24 hours, failed account set-ups,
//      accounts left without a profile, scheduled database jobs.
//   2. Every automation's last run, from GitHub's public API (the repository
//      is public; connect-src already allows api.github.com). A scheduled
//      workflow that stopped running is as silent as one that fails, so each
//      row also says how old its last run may be before it reads as late.
// ============================================================

const REPO = 'palmzamak2547/vet-mock';
const HOUR = 3_600_000;

// file: the workflow; event/branch narrow the run that counts; maxAgeHours:
// older than this reads as late (null: runs only when something changes).
export const AUTOMATIONS = [
  { file: 'production-watch.yml', name: 'เฝ้าระบบจริงทุก 6 ชั่วโมง', event: 'schedule', maxAgeHours: 14 },
  { file: 'dependency-updates.yml', name: 'อัปเดตแพ็กเกจประจำวัน', event: 'schedule', maxAgeHours: 30 },
  { file: 'android.yml', name: 'แอป Android บน emulator (ทุกสัปดาห์)', event: null, maxAgeHours: 8 * 24 },
  { file: 'build.yml', name: 'Build บน main', event: 'push', branch: 'main', maxAgeHours: null },
  { file: 'smoke-e2e.yml', name: 'Smoke e2e บน main', event: 'push', branch: 'main', maxAgeHours: null },
];

// Vercel's cron cannot be read from the browser: name it so nobody assumes
// the list above is everything.
export const UNREADABLE = [
  { name: 'ปลุกฐานข้อมูลทุกวัน (Vercel cron /api/ai-chat?warm=1)', where: 'Vercel, โปรเจกต์ vetmock, แท็บ Cron Jobs' },
];

export function runsUrl({ file, event, branch }) {
  const params = new URLSearchParams({ per_page: '1' });
  if (event) params.set('event', event);
  if (branch) params.set('branch', branch);
  return `https://api.github.com/repos/${REPO}/actions/workflows/${file}/runs?${params}`;
}

/** One row: ok, late, failed, running, unknown. */
export function automationVerdict(automation, run, now = Date.now()) {
  if (!run) return { state: 'unknown', detail: 'ยังไม่เคยรัน' };
  const at = Date.parse(run.created_at || run.run_started_at || '');
  const ageHours = Number.isFinite(at) ? (now - at) / HOUR : Infinity;
  if (run.status && run.status !== 'completed') return { state: 'running', at, url: run.html_url, detail: 'กำลังรัน' };
  if (run.conclusion && !['success', 'skipped', 'neutral'].includes(run.conclusion)) {
    return { state: 'failed', at, url: run.html_url, detail: `รอบล่าสุด ${run.conclusion}` };
  }
  if (automation.maxAgeHours != null && ageHours > automation.maxAgeHours) {
    return { state: 'late', at, url: run.html_url, detail: `ไม่ได้รันมา ${Math.round(ageHours)} ชั่วโมง (ควรรันภายใน ${automation.maxAgeHours})` };
  }
  return { state: 'ok', at, url: run.html_url, detail: 'รอบล่าสุดผ่าน' };
}

export async function fetchAutomations(fetchImpl = fetch, now = Date.now()) {
  return Promise.all(AUTOMATIONS.map(async (a) => {
    try {
      const res = await fetchImpl(runsUrl(a), { headers: { Accept: 'application/vnd.github+json' }, signal: AbortSignal.timeout(8000) });
      if (!res.ok) return { ...a, state: 'unknown', detail: `อ่านจาก GitHub ไม่ได้ (status ${res.status})` };
      const body = await res.json();
      return { ...a, ...automationVerdict(a, body?.workflow_runs?.[0], now) };
    } catch (e) {
      return { ...a, state: 'unknown', detail: `อ่านจาก GitHub ไม่ได้ (${e?.name || 'error'})` };
    }
  }));
}

/** admin_failures not yet in the database reads as "not installed", never as "nothing failed". */
export const recordMissing = (error) => ['PGRST202', '42883'].includes(String(error?.code || ''))
  || /could not find the function|does not exist/i.test(String(error?.message || ''));
