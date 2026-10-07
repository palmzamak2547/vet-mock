// ============================================================
// /api/move-in.js — vetmock.com's half of the move from vetmock.vercel.app
// ============================================================
// Every learner's study data lives in the old origin's localStorage and
// IndexedDB, and storage belongs to an origin, so a redirect alone would open
// vetmock.com empty. The old address (the inline bridge in index.html) POSTs a
// snapshot here as a form; this answers with a small page that writes it into
// vetmock.com's own storage and then sends an ACK back to the old address.
//
// Nothing is stored on the server, nothing personal travels in a URL, and the
// body is never logged. Keys vetmock.com does not have yet are copied as they
// were. Study data it already has is staged in an inbox that the app merges
// with the user-data-sync rules on its next boot (src/lib/origin-move.js);
// every other key keeps vetmock.com's value, the newer side.
// ============================================================

import { randomBytes } from 'node:crypto';

export const OLD_ORIGIN = 'https://vetmock.vercel.app';
export const NEW_HOST = 'vetmock.com';
// Vercel refuses request bodies over 4.5 MB; the bridge stops at 4.2 MB.
export const MAX_PAYLOAD = Math.floor(4.4 * 1024 * 1024);
// The USER_DATA_FIELDS local keys (src/lib/user-data-sync.js), listed here so
// this function does not bundle the app. tests/unit/move-in.test.mjs pins them.
export const FIELD_KEYS = Object.freeze([
  'vmx-bookmarks', 'vmx-history', 'vmx-pending-exam-results', 'vmx-notes',
  'vmx-sr-cards', 'vmx-custom-q', 'vmx-streak', 'vmx-reading-checklist',
]);

/** A path on this site, or '/'. Never another host, a backslash (browsers
 *  read /\x as //x) or a control character. */
export function safeTo(value) {
  return typeof value === 'string' && value.length <= 2048 && value[0] === '/' && value[1] !== '/'
    && !/[\u0000-\u001f\u007f\\]/.test(value) ? value : '/';
}

function formBody(req) {
  let body;
  try { body = req.body; } catch { return {}; }
  if (typeof body === 'string' || Buffer.isBuffer(body)) return Object.fromEntries(new URLSearchParams(String(body)));
  return body && typeof body === 'object' ? body : {};
}

function hostOf(req) {
  const raw = req.headers?.['x-forwarded-host'] || req.headers?.host || '';
  return String(Array.isArray(raw) ? raw[0] : raw).split(',')[0].trim().toLowerCase();
}

const escapeHtml = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

// The app's own palette (src/styles.css tokens), light and dark.
const CSS = [
  'body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px;box-sizing:border-box;',
  'background:#f6efe4;color:#2b2419;font:16px/1.6 system-ui,-apple-system,"Segoe UI",sans-serif;text-align:center}',
  'main{max-width:24rem}h1{margin:0 0 6px;font-size:18px;font-weight:600}p{margin:0;color:#5c4f3d;font-size:14px}',
  'a{display:inline-block;min-height:44px;padding:10px 12px;box-sizing:border-box;color:#4a6b4a;font-weight:600}',
  'i{display:block;width:10px;height:10px;margin:0 auto 16px;border-radius:50%;background:#4a6b4a;animation:vmx-move 1.2s ease-in-out infinite}',
  '@keyframes vmx-move{50%{opacity:.35;transform:scale(.8)}}[hidden]{display:none!important}',
  '@media (prefers-reduced-motion:reduce){i{animation:none}}',
  '@media (prefers-color-scheme:dark){body{background:#1a1612;color:#f0e6d2}p{color:#b8a890}a{color:#7ba87b}i{background:#7ba87b}}',
].join('');

// Runs on vetmock.com. Reads the payload embedded beside it, checks its shape,
// writes it, and only then sends the ACK. Any failure shows the way back.
export const MOVE_IN_SCRIPT = `(function (w, d) {
  'use strict';
  var INBOX = 'vmx-move-inbox', RECEIVED = 'vmx-move-received', OWNER = 'vmx-user-sync-owner-v1';
  var MAX_VALUE = 2 * 1024 * 1024;
  function fail() {
    var busy = d.getElementById('vmx-move-busy'), failed = d.getElementById('vmx-move-fail');
    if (busy) busy.hidden = true;
    if (failed) failed.hidden = false;
  }
  function plain(o) { return !!o && typeof o === 'object' && !Array.isArray(o); }
  function text(p, enc) {
    var bin = w.atob(p.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((p.length + 3) % 4));
    var bytes = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    if (enc === 'js64') return Promise.resolve(new w.TextDecoder().decode(bytes));
    return new w.Response(new w.Blob([bytes]).stream().pipeThrough(new w.DecompressionStream('gzip'))).text();
  }
  function valid(data) {
    if (!plain(data) || data.v !== 1 || !plain(data.local)) return false;
    var keys = Object.keys(data.local);
    for (var i = 0; i < keys.length; i++) {
      var k = keys[i], v = data.local[k];
      if (k.indexOf('vmx-') !== 0 || k.indexOf('vmx-move-') === 0 || typeof v !== 'string' || v.length > MAX_VALUE) return false;
    }
    var idb = data.idb == null ? {} : data.idb;
    if (!plain(idb)) return false;
    var lists = [idb.pdf == null ? [] : idb.pdf, idb.events == null ? [] : idb.events];
    for (var j = 0; j < lists.length; j++) {
      if (!Array.isArray(lists[j])) return false;
      for (var n = 0; n < lists[j].length; n++) if (!plain(lists[j][n])) return false;
    }
    return true;
  }
  function mergeable(k, fields) {
    return fields.indexOf(k) >= 0 || k.indexOf('vmx-user-data-v1:') === 0 || k.indexOf('vmx-user-data-v2:') === 0;
  }
  function writeRecords(records) {
    if (!records.length) return Promise.resolve();
    return new Promise(function (resolve, reject) {
      var timer = w.setTimeout(function () { reject(new Error('idb-timeout')); }, 15000);
      var req = w.indexedDB.open(INBOX, 1);
      req.onupgradeneeded = function () { req.result.createObjectStore('records', { autoIncrement: true }); };
      req.onerror = function () { w.clearTimeout(timer); reject(req.error || new Error('idb-open')); };
      req.onsuccess = function () {
        var db = req.result, tx;
        try {
          tx = db.transaction('records', 'readwrite');
          var store = tx.objectStore('records');
          for (var i = 0; i < records.length; i++) store.add(records[i]);
        } catch (e) { w.clearTimeout(timer); db.close(); reject(e); return; }
        tx.oncomplete = function () { w.clearTimeout(timer); db.close(); resolve(); };
        tx.onerror = tx.onabort = function () { w.clearTimeout(timer); db.close(); reject(tx.error || new Error('idb-write')); };
      };
    });
  }
  function apply(data, cfg) {
    var ls = w.localStorage;
    var fresh = true;
    for (var i = 0; i < ls.length; i++) {
      var existing = ls.key(i);
      if (existing && existing.indexOf('vmx-') === 0 && existing.indexOf('vmx-move-') !== 0) { fresh = false; break; }
    }
    var names = Object.keys(data.local).sort(), fields = {}, copied = [], staged = 0;
    for (var n = 0; n < names.length; n++) {
      var k = names[n], v = data.local[k], current = ls.getItem(k);
      if (current === null) { ls.setItem(k, v); copied.push(k); }
      else if (current !== v && mergeable(k, cfg.fields)) { fields[k] = v; staged += 1; }
      // Anything else keeps vetmock.com's value: it is the newer side.
    }
    if (!fresh && (staged || copied.length)) {
      var raw = ls.getItem(INBOX), prior = null;
      if (raw !== null) {
        try { prior = JSON.parse(raw); } catch (e) { prior = null; }
        // Never overwrite an inbox; one that cannot be read is kept aside.
        if (!plain(prior) || !plain(prior.fields)) { ls.setItem(INBOX + '-unreadable', raw); prior = null; }
      }
      var owner = typeof data.local[OWNER] === 'string' ? data.local[OWNER]
        : (prior && typeof prior.owner === 'string' ? prior.owner : null);
      var mergedFields = {}, key;
      if (prior) for (key in prior.fields) if (Object.prototype.hasOwnProperty.call(prior.fields, key)) mergedFields[key] = prior.fields[key];
      for (key in fields) if (Object.prototype.hasOwnProperty.call(fields, key)) mergedFields[key] = fields[key];
      var mergedCopied = prior && Array.isArray(prior.copied) ? prior.copied.slice() : [];
      for (var c = 0; c < copied.length; c++) if (mergedCopied.indexOf(copied[c]) < 0) mergedCopied.push(copied[c]);
      ls.setItem(INBOX, JSON.stringify({ at: Date.now(), from: cfg.old, owner: owner, fields: mergedFields, copied: mergedCopied }));
    }
    var idb = data.idb || {}, pdf = idb.pdf || [], events = idb.events || [], records = [];
    for (var p = 0; p < pdf.length; p++) records.push({ db: 'pdf', value: pdf[p] });
    for (var e = 0; e < events.length; e++) records.push({ db: 'events', value: events[e] });
    return writeRecords(records).then(function () {
      ls.setItem(RECEIVED, JSON.stringify({
        at: Date.now(), hash: cfg.h, keys: names.length, pdf: pdf.length, events: events.length,
        signedIn: data.signedIn === true,
        dropped: Array.isArray(data.dropped) ? data.dropped.filter(function (x) { return x === 'events' || x === 'pdf'; }) : [],
      }));
    });
  }
  var cfg;
  try { cfg = JSON.parse(d.getElementById('vmx-move').textContent); } catch (e) { fail(); return; }
  Promise.resolve().then(function () { return text(cfg.p, cfg.enc); }).then(function (json) {
    var data = JSON.parse(json);
    if (!valid(data)) throw new Error('shape');
    return apply(data, cfg);
  }).then(function () {
    w.location.replace(cfg.old + '/?vmx-moved=' + encodeURIComponent(cfg.h) + '&to=' + encodeURIComponent(cfg.to));
  }).catch(fail);
})(window, document);`;

function failureSection(oldOrigin, title, visible) {
  return `<section id="vmx-move-fail"${visible ? '' : ' hidden'}>`
    + `<h1>${escapeHtml(title)}</h1><p>ข้อมูลทั้งหมดยังอยู่ที่ที่อยู่เดิม</p>`
    + `<p><a href="${escapeHtml(oldOrigin)}/?vmx-move=retry">ลองอีกครั้ง</a>`
    + `<a href="${escapeHtml(oldOrigin)}/?vmx-move=hold">ใช้ที่อยู่เดิมต่อ</a></p></section>`;
}

function page(nonce, main, data = null) {
  // `<` is escaped so the data block can never close its own script element.
  const json = data ? JSON.stringify(data).replace(/</g, '\\u003c') : null;
  return '<!doctype html>\n<html lang="th">\n<head>\n<meta charset="utf-8">\n'
    + '<meta name="viewport" content="width=device-width, initial-scale=1">\n<meta name="robots" content="noindex">\n'
    + `<title>VetMock</title>\n<style nonce="${nonce}">${CSS}</style>\n</head>\n<body>\n<main>${main}</main>\n`
    + (json ? `<script type="application/json" id="vmx-move">${json}</script>\n<script nonce="${nonce}">${MOVE_IN_SCRIPT}</script>\n` : '')
    + '</body>\n</html>\n';
}

function send(res, status, nonce, html) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Robots-Tag', 'noindex');
  res.setHeader('Referrer-Policy', 'no-referrer');
  res.setHeader('Content-Security-Policy',
    `default-src 'none'; script-src 'nonce-${nonce}'; style-src 'nonce-${nonce}'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'`);
  return res.end(html);
}

export function createMoveInHandler({
  oldOrigin = OLD_ORIGIN,
  newHost = NEW_HOST,
  makeNonce = () => randomBytes(16).toString('base64'),
} = {}) {
  const refused = (res, nonce, status, title) => send(res, status, nonce, page(nonce, failureSection(oldOrigin, title, true)));

  return async function handler(req, res) {
    const nonce = makeNonce();
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST');
      return refused(res, nonce, 405, 'หน้านี้ใช้ตอนย้ายข้อมูลเท่านั้น');
    }
    const body = formBody(req);
    const to = safeTo(body.to);

    // vetmock.com still redirecting to the old host replays this POST there
    // (a 307), with Origin: null after the cross-origin hop, so the host is
    // checked first. Nothing is read; the learner keeps working where they were.
    if (hostOf(req) !== newHost) {
      res.statusCode = 303;
      res.setHeader('Location', `${oldOrigin}/?vmx-move=hold&to=${encodeURIComponent(to)}`);
      res.setHeader('Cache-Control', 'no-store');
      return res.end();
    }
    if (req.headers?.origin !== oldOrigin) return refused(res, nonce, 403, 'คำขอนี้ไม่ได้มาจากที่อยู่เดิมของ VetMock');

    const { p, enc, h } = body;
    if (typeof p === 'string' && p.length > MAX_PAYLOAD) return refused(res, nonce, 413, 'ข้อมูลมากเกินกว่าจะย้ายในครั้งเดียว');
    if (!['gz64', 'js64'].includes(enc) || typeof p !== 'string' || !/^[A-Za-z0-9_-]+$/.test(p)
      || typeof h !== 'string' || !/^[0-9a-z]{1,32}$/.test(h)) {
      return refused(res, nonce, 400, 'ย้ายข้อมูลไม่สำเร็จ');
    }
    const busy = '<section id="vmx-move-busy" role="status"><i aria-hidden="true"></i>'
      + '<h1>กำลังย้ายข้อมูลการเรียนของคุณ</h1><p>ใช้เวลาไม่กี่วินาที อย่าเพิ่งปิดหน้านี้</p></section>'
      + failureSection(oldOrigin, 'ย้ายข้อมูลไม่สำเร็จ', false);
    return send(res, 200, nonce, page(nonce, busy, { p, enc, h, to, old: oldOrigin, fields: FIELD_KEYS }));
  };
}

export default createMoveInHandler();
