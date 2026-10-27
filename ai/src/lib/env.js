// What this browser can do, read once. In-app browsers (LINE, Facebook,
// Instagram, TikTok, X, WeChat) get the same page; only features they cannot
// run (speech recognition) are left out, never the content.

const ua = typeof navigator !== 'undefined' ? navigator.userAgent || '' : '';

export const IN_APP = /\bLine\/|FBAN|FBAV|FB_IAB|Instagram|BytedanceWebview|musical_ly|TikTok|Twitter|MicroMessenger|KAKAOTALK|; wv\)/i.test(ua);

export const TOUCH = typeof window !== 'undefined' && (matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window);

export const reducedMotion = () => typeof window !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;

const SR = typeof window !== 'undefined' ? window.SpeechRecognition || window.webkitSpeechRecognition : null;
export const CAN_LISTEN = !!SR && !IN_APP;
export const Recognition = SR;

export const CAN_SPEAK = typeof window !== 'undefined' && 'speechSynthesis' in window && typeof SpeechSynthesisUtterance !== 'undefined';
