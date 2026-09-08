// Device-only appearance preferences. These are never mixed into study backups.
export const MOTION_STORAGE_KEY = 'vmx-motion-settings';
export const MOTION_CHANGE_EVENT = 'vmx-motion-settings-change';
export const MOTION_DEFAULTS = Object.freeze({ mode: 'auto', companion: true, loader: 'pages', celebration: 'pawburst' });
export const LOADER_CHOICES = Object.freeze(['pawsteps', 'orbital', 'pages', 'heartbeat', 'dots', 'helix', 'skeleton', 'progress']);
export const CELEBRATION_CHOICES = Object.freeze(['confetti', 'pawburst', 'fireflies', 'hearts', 'streak', 'chapter']);

export function normalizeMotionPreferences(value) {
  const v = value && typeof value === 'object' && !Array.isArray(value) ? value : {};
  return {
    mode: ['auto', 'quiet', 'off'].includes(v.mode) ? v.mode : MOTION_DEFAULTS.mode,
    companion: typeof v.companion === 'boolean' ? v.companion : MOTION_DEFAULTS.companion,
    loader: LOADER_CHOICES.includes(v.loader) ? v.loader : MOTION_DEFAULTS.loader,
    celebration: CELEBRATION_CHOICES.includes(v.celebration) ? v.celebration : MOTION_DEFAULTS.celebration,
  };
}
let current;
export function readMotionPreferences() {
  if (current) return current;
  try { current = normalizeMotionPreferences(JSON.parse(window.localStorage.getItem(MOTION_STORAGE_KEY))); }
  catch { current = { ...MOTION_DEFAULTS }; }
  return current;
}
export function motionIsReduced() {
  return readMotionPreferences().mode !== 'auto'
    || (typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches);
}
export function applyMotionPreference() {
  if (typeof document !== 'undefined') document.documentElement.dataset.vmxMotion = readMotionPreferences().mode;
}
export function saveMotionPreferences(patch) {
  current = normalizeMotionPreferences({ ...readMotionPreferences(), ...patch });
  let persisted = true;
  try { window.localStorage.setItem(MOTION_STORAGE_KEY, JSON.stringify(current)); } catch { persisted = false; }
  applyMotionPreference();
  window.dispatchEvent(new Event(MOTION_CHANGE_EVENT));
  return persisted;
}
export function subscribeMotionPreferences(callback) {
  const onStorage = (event) => {
    if (event.key !== MOTION_STORAGE_KEY && event.key !== null) return;
    current = undefined;
    applyMotionPreference();
    callback();
  };
  window.addEventListener(MOTION_CHANGE_EVENT, callback);
  window.addEventListener('storage', onStorage);
  return () => {
    window.removeEventListener(MOTION_CHANGE_EVENT, callback);
    window.removeEventListener('storage', onStorage);
  };
}
