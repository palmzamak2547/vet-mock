// What this browser can do, read once. In-app browsers (LINE, Facebook,
// Instagram, TikTok, X, WeChat) get the same page; only features they cannot
// run (speech recognition) are left out, never the content.

const ua = typeof navigator !== 'undefined' ? navigator.userAgent || '' : '';

export const IN_APP = /\bLine\/|FBAN|FBAV|FB_IAB|Instagram|BytedanceWebview|musical_ly|TikTok|Twitter|MicroMessenger|KAKAOTALK|; wv\)/i.test(ua);

// A student signed in only here meets vetmock.com's Chula wall in the reader,
// and Google will not sign in inside these apps. So there a library file opens
// as the file itself, and the label names the page to scroll to; everywhere
// else it opens VetMock's reader at that page.
export function openLink(item, inApp = IN_APP) {
  const page = item.page > 1 ? item.page : null;
  if (inApp && item.file) return { href: item.file, label: page ? `เปิดไฟล์ แล้วเลื่อนไปหน้า ${page}` : 'เปิดไฟล์' };
  return { href: item.open, label: page ? `เปิดหน้า ${page}` : 'เปิด' };
}
export const sourceHref = (source, inApp = IN_APP) => (inApp && source.file ? source.file : source.url);

export const TOUCH = typeof window !== 'undefined' && (matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window);

export const reducedMotion = () => typeof window !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;

const SR = typeof window !== 'undefined' ? window.SpeechRecognition || window.webkitSpeechRecognition : null;
export const CAN_LISTEN = !!SR && !IN_APP;
export const Recognition = SR;

export const CAN_SPEAK = typeof window !== 'undefined' && 'speechSynthesis' in window && typeof SpeechSynthesisUtterance !== 'undefined';
