// Installing the site as an app. Chrome and Edge hand over an install prompt, which is kept
// until the student asks for it; Safari has none, so the page explains the share-sheet steps.

const installStore = { prompt: null, listeners: new Set() };

/** Listen from boot: the browser fires its prompt once, early. */
export function watchInstall() {
  if (typeof window === 'undefined') return;
  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    installStore.prompt = event;
    installStore.listeners.forEach((fn) => fn());
  });
  window.addEventListener('appinstalled', () => {
    installStore.prompt = null;
    installStore.listeners.forEach((fn) => fn());
  });
}

export const canPrompt = () => !!installStore.prompt;
export const onInstallChange = (fn) => { installStore.listeners.add(fn); return () => installStore.listeners.delete(fn); };

/** Running as an installed app already. */
export function isInstalled() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia?.('(display-mode: standalone)').matches || window.navigator.standalone === true;
}

/** Which instructions to show when there is no prompt. */
export function platform() {
  const ua = typeof navigator === 'undefined' ? '' : navigator.userAgent;
  if (/\bLine\//i.test(ua)) return 'line';
  if (/iphone|ipad|ipod/i.test(ua) || (/macintosh/i.test(ua) && navigator.maxTouchPoints > 1)) return 'ios';
  if (/android/i.test(ua)) return 'android';
  return 'desktop';
}

export async function promptInstall() {
  const event = installStore.prompt;
  if (!event) return false;
  installStore.prompt = null;
  await event.prompt();
  const choice = await event.userChoice.catch(() => null);
  installStore.listeners.forEach((fn) => fn());
  return choice?.outcome === 'accepted';
}
