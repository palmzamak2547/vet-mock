// ============================================================
// install-guide.js — which install steps are true for this browser
// ============================================================
// The install chip may only offer steps that work where the student is. See
// tests/unit/install-guide.test.mjs for what each rule is there to prevent.
//
// Pure on purpose: the caller reads the browser (user agent, platform, touch
// points, touch events on the document) and hands it in, so every rule here
// can be tested with a plain object.
// ============================================================

import { inAppBrowser } from './inapp.js';

/**
 * What the chip needs to know about this browser.
 *  - inApp: the app whose own browser this is (LINE, Facebook, ...), or null.
 *    Their browsers have no Add to Home Screen of Safari's, and LINE's iOS one
 *    writes "Safari" into its user agent, so Safari is never assumed from the
 *    word alone.
 *  - ipad: an iPad. Since iPadOS 13 it introduces itself as a Mac, so a Mac user
 *    agent with touch points, or with touch events on the document, is an iPad.
 *    That is the detection Apple sanctions; a real Mac has neither.
 *  - ios: an iPhone, iPod or iPad, in any browser.
 *  - iosSafari: Safari itself on one of those, not Chrome, Firefox or Edge (their
 *    UA tokens differ) and not an app's own browser.
 */
export function installEnvironment({ ua = '', platform = '', maxTouchPoints = 0, touchEnd = false } = {}) {
  const inApp = inAppBrowser(ua);
  const ipad = /iPad/.test(ua) || (platform === 'MacIntel' && maxTouchPoints > 1) || (/Macintosh/.test(ua) && touchEnd);
  const ios = ipad || /iPhone|iPod/.test(ua);
  const iosSafari = ios && !inApp && /Safari/.test(ua) && !/CriOS|FxiOS|EdgiOS/.test(ua);
  return { inApp, ios, ipad, iosSafari };
}

/**
 * The steps for adding VetMock to the Home Screen from Safari, in the order the
 * sheets come. Words in “quotes” are labels on screen, kept in English because
 * that is what the phone shows whatever its language; the chip prints them bold.
 *
 * From Apple's own guides: in iOS 26 the Share button sits behind a More button
 * (it is still a plain button on an iPad, and on an iPhone whose tab bar is set
 * to Bottom or Top); the action list may need "View More"; and "Open as Web App"
 * must be on, or the icon only opens Safari. Older iOS has no such switch.
 */
export function iosSteps({ ipad = false } = {}) {
  return [
    ipad
      ? 'กดปุ่ม “Share” ⬆ ที่แถบบนของ Safari'
      : 'กด ⋯ ข้างช่องที่อยู่ของ Safari แล้วเลือก “Share” (ถ้าเห็นปุ่ม Share ⬆ อยู่แล้ว กดปุ่มนั้นได้เลย)',
    'เลือก “Add to Home Screen” (เพิ่มที่หน้าจอโฮม) ถ้ายังไม่เห็น เลื่อนลงในรายการหรือกด “View More”',
    'เปิด “Open as Web App” ไว้ (ถ้ามี) แล้วกด “Add” มุมขวาบน',
  ];
}
