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
// were. A learner can move more than once (an old tab or an installed app
// keeps studying on the old address), so the page records a fingerprint of
// everything it carried (src/lib/move-base.js) and a later move takes what
// only the old address changed since, keeps what only vetmock.com changed,
// and merges what both changed: study data through an inbox the app merges
// with the user-data-sync rules on its next boot (src/lib/origin-move.js),
// tools by id, and any other key keeps vetmock.com's value as before.
//
// Whatever stops a move sends the learner back to the old address, which
// still holds everything, with the hash of the data that could not move, so
// the old address does not upload the same data again every session.
// ============================================================

import { randomBytes } from 'node:crypto';
import { rateLimit, clientIP } from './_lib/rate-limit.js';
import { moveBaseKit } from '../src/lib/move-base.js';

export const OLD_ORIGIN = 'https://vetmock.vercel.app';
export const NEW_HOST = 'vetmock.com';
// Vercel refuses request bodies over 4.5 MB; the bridge stops at 4.2 MB.
export const MAX_PAYLOAD = Math.floor(4.4 * 1024 * 1024);
// A shared quiz link (src/lib/share-link.js) of 200 questions is about
// 5,900 characters; index.html's bridge uses the same ceiling.
export const MAX_TO = 16 * 1024;
// A learner posts once, and again only after studying on the old address,
// but one campus network can put a whole class behind one address. Over it,
// the learner keeps working on the old address and tries another session.
export const MOVE_RATE = Object.freeze({ max: 120, windowMs: 10 * 60 * 1000 });
// The USER_DATA_FIELDS local keys (src/lib/user-data-sync.js), from the kit
// the page itself runs. tests/unit/move-base.test.mjs pins them.
export const FIELD_KEYS = Object.freeze(Object.keys(moveBaseKit().FIELD_BY_KEY));
const TOKEN = /^[0-9a-z]{1,32}$/;

/** A path on this site, or '/'. Never another host, a backslash (browsers
 *  read /\x as //x) or a control character. */
export function safeTo(value) {
  return typeof value === 'string' && value.length <= MAX_TO && value[0] === '/' && value[1] !== '/'
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
// writes it, and only then sends the ACK. Any failure goes back to the old
// address with the hash it could not move; the links stay on the page.
export const MOVE_IN_SCRIPT = `(function (w, d) {
  'use strict';
  var KIT = (${moveBaseKit.toString()})();
  var INBOX = 'vmx-move-inbox', RECEIVED = 'vmx-move-received', BASE = 'vmx-move-base';
  var OWNER = 'vmx-user-sync-owner-v1', GUEST = KIT.V2 + 'anonymous';
  var cfg = null;
  function fail() {
    var busy = d.getElementById('vmx-move-busy'), failed = d.getElementById('vmx-move-fail');
    if (busy) busy.hidden = true;
    if (failed) failed.hidden = false;
    if (cfg) w.location.replace(cfg.old + '/?vmx-move=hold&failed=' + encodeURIComponent(cfg.h) + '&to=' + encodeURIComponent(cfg.to));
  }
  function own(o, k) { return Object.prototype.hasOwnProperty.call(o, k); }
  function plain(o) { return !!o && typeof o === 'object' && !Array.isArray(o); }
  function parsed(raw) { try { return { v: JSON.parse(raw) }; } catch (e) { return { bad: true }; } }
  function copy(o) { var out = {}; for (var k in o) if (own(o, k)) out[k] = o[k]; return out; }
  // Whom a store's field keys mirror: "anonymous" or an account id.
  function principal(raw) { var v = raw == null ? null : parsed(raw).v; return typeof v === 'string' && v ? v : 'anonymous'; }
  function text(p, enc) {
    var bin = w.atob(p.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((p.length + 3) % 4));
    var bytes = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    if (enc === 'js64') return Promise.resolve(new w.TextDecoder().decode(bytes));
    return new w.Response(new w.Blob([bytes]).stream().pipeThrough(new w.DecompressionStream('gzip'))).text();
  }
  // The payload limit bounds the size; one value may be most of it (a deck of photos).
  function valid(data) {
    if (!plain(data) || data.v !== 1 || !plain(data.local)) return false;
    var keys = Object.keys(data.local);
    for (var i = 0; i < keys.length; i++) {
      var k = keys[i], v = data.local[k];
      if (k.indexOf('vmx-') !== 0 || k.indexOf('vmx-move-') === 0 || typeof v !== 'string') return false;
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
  function mergeable(k) {
    return own(KIT.FIELD_BY_KEY, k) || k.indexOf(KIT.V1) === 0 || k.indexOf(KIT.V2) === 0;
  }
  // What the old address sent at the last move, key by key (src/lib/move-base.js).
  function readBase(ls) {
    var b = parsed(ls.getItem(BASE)).v;
    return {
      keys: plain(b) && plain(b.keys) ? b.keys : {},
      slots: plain(b) && plain(b.slots) ? b.slots : {},
      extras: plain(b) && plain(b.extras) ? b.extras : {},
    };
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
  function apply(data) {
    var ls = w.localStorage, local = data.local;
    var fresh = true;
    for (var i = 0; i < ls.length; i++) {
      var existing = ls.key(i);
      if (existing && existing.indexOf('vmx-') === 0 && existing.indexOf('vmx-move-') !== 0) { fresh = false; break; }
    }
    var base = readBase(ls);
    var next = { v: 1, keys: copy(base.keys), slots: copy(base.slots), extras: copy(base.extras) };
    // Field keys mirror whoever their store has signed in. Another owner's
    // never fill this workspace; with no owner here yet, the old one is copied too.
    var owner = principal(own(local, OWNER) ? local[OWNER] : null);
    var hereOwner = ls.getItem(OWNER);
    var sameOwner = hereOwner === null || principal(hereOwner) === owner;
    // When the old store's own snapshot travels, its field keys only mirror it.
    var mirrors = own(local, KIT.V2 + encodeURIComponent(owner));
    var names = Object.keys(local).sort(), fields = {}, pend = { keys: {}, slots: {} };
    var copied = [], decided = {}, staged = 0;
    function tracked(k) {
      if (k.indexOf(KIT.V2) === 0) return true;
      if (k.indexOf(KIT.V1) === 0) return !own(local, KIT.V2 + k.slice(KIT.V1.length));
      return own(KIT.FIELD_BY_KEY, k) && !mirrors;
    }
    // Both sides now hold v: what the next move compares against.
    function agree(k, v) {
      next.keys[k] = KIT.digest(v);
      var s = tracked(k) ? KIT.slots(k, v) : null;
      if (s) next.slots[k] = s; else delete next.slots[k];
    }
    function take(k, v) { ls.setItem(k, v); copied.push(k); agree(k, v); }
    for (var n = 0; n < names.length; n++) {
      var k = names[n], v = local[k];
      if (own(KIT.EXTRAS, k) || k === KIT.BUNDLE) continue; // tools: below
      var field = own(KIT.FIELD_BY_KEY, k) ? KIT.FIELD_BY_KEY[k] : null;
      if (field && !sameOwner) continue;
      var c = ls.getItem(k);
      decided[k] = true;
      if (c === null) { take(k, v); continue; }
      if (c === v) { agree(k, v); continue; }
      if (field && KIT.isEmpty(field, c)) { take(k, v); continue; } // an empty mirror: nothing here to keep
      var b = own(base.keys, k) ? base.keys[k] : null, hv = KIT.digest(v);
      if (b !== null && KIT.digest(c) === b) { take(k, v); continue; } // only the old address changed it
      if (b !== null && hv === b) continue; // only vetmock.com changed it
      if (mergeable(k) && !(field && mirrors)) {
        fields[k] = v; staged += 1; pend.keys[k] = hv;
        var sl = tracked(k) ? KIT.slots(k, v) : null;
        if (sl) pend.slots[k] = sl;
        continue;
      }
      // Both changed it: vetmock.com keeps its own, as before.
      next.keys[k] = hv;
      delete next.slots[k];
    }

    // Tools (local-extras.js) are read through a restored bundle when one
    // exists. Each side's are read the way that side shows them and joined;
    // a bundle is never copied over the other side's tools.
    var oldBundle = own(local, KIT.BUNDLE) ? parsed(local[KIT.BUNDLE]).v : null;
    if (!plain(oldBundle)) oldBundle = null;
    var hereBundleRaw = ls.getItem(KIT.BUNDLE);
    var hereBundle = hereBundleRaw === null ? null : parsed(hereBundleRaw).v;
    if (!plain(hereBundle)) hereBundle = null;
    var bundleChanged = false;
    for (var x in KIT.EXTRAS) {
      if (!own(KIT.EXTRAS, x)) continue;
      var kind = KIT.EXTRAS[x], fromBundle = !!oldBundle && own(oldBundle, x);
      if (!fromBundle && !own(local, x)) continue;
      var hereRaw = ls.getItem(x), inHereBundle = !!hereBundle && own(hereBundle, x);
      var theirs = fromBundle ? { v: oldBundle[x] } : parsed(local[x]);
      if (theirs.bad || !KIT.validExtra(kind, theirs.v)) {
        // Not something its own app could show: carried as it was, only where nothing is.
        if (!fromBundle && hereRaw === null && !inHereBundle) ls.setItem(x, local[x]);
        continue;
      }
      var so = JSON.stringify(theirs.v), ho = KIT.digest(so);
      var mine = inHereBundle ? { v: hereBundle[x] } : hereRaw === null ? null : parsed(hereRaw);
      var result;
      if (!mine || mine.bad || !KIT.validExtra(kind, mine.v)) result = theirs.v;
      else {
        var sm = JSON.stringify(mine.v), hb = own(base.extras, x) ? base.extras[x] : null;
        if (sm === so) result = undefined;
        else if (hb !== null && KIT.digest(sm) === hb) result = theirs.v; // only the old address changed it
        else if (hb !== null && ho === hb) result = undefined; // only vetmock.com changed it
        else result = KIT.mergeExtra(kind, mine.v, theirs.v);
      }
      if (result !== undefined) {
        if (hereBundle) { hereBundle[x] = result; bundleChanged = true; }
        else ls.setItem(x, !fromBundle && result === theirs.v ? local[x] : JSON.stringify(result));
      }
      next.extras[x] = ho;
    }
    if (bundleChanged) ls.setItem(KIT.BUNDLE, JSON.stringify(hereBundle));

    var raw = ls.getItem(INBOX);
    if (!fresh && (staged || copied.length || raw !== null)) {
      var prior = null, key;
      if (raw !== null) {
        prior = parsed(raw).v;
        // Never overwrite an inbox; one that cannot be read is kept aside.
        if (!plain(prior) || !plain(prior.fields)) { ls.setItem(INBOX + '-unreadable', raw); prior = null; }
      }
      // An earlier move's entry stays unless this move decided that key
      // again; another owner's field keys never join this owner's.
      var priorBase = prior && plain(prior.base) ? prior.base : {};
      var priorOwner = !prior || principal(prior.owner) === owner;
      var mergedFields = {}, mergedBase = { keys: {}, slots: {} };
      if (prior) {
        for (key in prior.fields) {
          if (!own(prior.fields, key) || own(decided, key) || (!priorOwner && own(KIT.FIELD_BY_KEY, key))) continue;
          mergedFields[key] = prior.fields[key];
          if (plain(priorBase.keys) && own(priorBase.keys, key)) mergedBase.keys[key] = priorBase.keys[key];
          if (plain(priorBase.slots) && own(priorBase.slots, key)) mergedBase.slots[key] = priorBase.slots[key];
        }
      }
      for (key in fields) if (own(fields, key)) mergedFields[key] = fields[key];
      for (key in pend.keys) if (own(pend.keys, key)) mergedBase.keys[key] = pend.keys[key];
      for (key in pend.slots) if (own(pend.slots, key)) mergedBase.slots[key] = pend.slots[key];
      var mergedCopied = prior && Array.isArray(prior.copied) ? prior.copied.slice() : [];
      for (var cp = 0; cp < copied.length; cp++) if (mergedCopied.indexOf(copied[cp]) < 0) mergedCopied.push(copied[cp]);
      if (Object.keys(mergedFields).length || mergedCopied.length) {
        ls.setItem(INBOX, JSON.stringify({
          at: Date.now(), from: cfg.old,
          owner: own(local, OWNER) ? local[OWNER] : (prior && typeof prior.owner === 'string' ? prior.owner : null),
          oldGuest: own(local, GUEST), fields: mergedFields, base: mergedBase, copied: mergedCopied,
        }));
      } else if (prior) ls.removeItem(INBOX);
    }
    var idb = data.idb || {}, pdf = idb.pdf || [], events = idb.events || [], records = [];
    for (var p = 0; p < pdf.length; p++) records.push({ db: 'pdf', value: pdf[p] });
    for (var e = 0; e < events.length; e++) records.push({ db: 'events', value: events[e] });
    return writeRecords(records).then(function () {
      ls.setItem(BASE, JSON.stringify(next));
      ls.setItem(RECEIVED, JSON.stringify({
        at: Date.now(), hash: cfg.h, keys: names.length, pdf: pdf.length, events: events.length,
        signedIn: data.signedIn === true,
      }));
    });
  }
  try { cfg = JSON.parse(d.getElementById('vmx-move').textContent); } catch (e) { cfg = null; fail(); return; }
  Promise.resolve().then(function () { return text(cfg.p, cfg.enc); }).then(function (json) {
    var data = JSON.parse(json);
    if (!valid(data)) throw new Error('shape');
    return apply(data);
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

// `returnTo`: a refusal sends the learner back by itself; the links in
// `main` stay for a browser that does not follow.
function page(nonce, main, data = null, returnTo = null) {
  // `<` is escaped so the data block can never close its own script element.
  const json = data ? JSON.stringify(data).replace(/</g, '\\u003c') : null;
  return '<!doctype html>\n<html lang="th">\n<head>\n<meta charset="utf-8">\n'
    + '<meta name="viewport" content="width=device-width, initial-scale=1">\n<meta name="robots" content="noindex">\n'
    + `<title>VetMock</title>\n<style nonce="${nonce}">${CSS}</style>\n</head>\n<body>\n<main>${main}</main>\n`
    + (json ? `<script type="application/json" id="vmx-move">${json}</script>\n<script nonce="${nonce}">${MOVE_IN_SCRIPT}</script>\n` : '')
    + (returnTo ? `<script nonce="${nonce}">window.location.replace(${JSON.stringify(String(returnTo)).split('<').join('\\x3c')});</script>\n` : '')
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
  limit = (req) => rateLimit(`move-in:${clientIP(req)}`, MOVE_RATE.max, MOVE_RATE.windowMs),
} = {}) {
  // Back to the old address, holding the tab there. `failed` names the data
  // that could not move, so the old address does not send it again.
  const backTo = (to, failed = null) => `${oldOrigin}/?vmx-move=hold${failed ? `&failed=${encodeURIComponent(failed)}` : ''}`
    + `&to=${encodeURIComponent(to)}`;
  const refused = (res, nonce, status, title, returnTo = null) => send(res, status, nonce,
    page(nonce, failureSection(oldOrigin, title, true), null, returnTo));

  return async function handler(req, res) {
    const nonce = makeNonce();
    const body = formBody(req);
    const to = safeTo(body.to);
    const h = typeof body.h === 'string' && TOKEN.test(body.h) ? body.h : null;

    // vetmock.com still redirecting to the old host replays this POST there
    // (a 307), with Origin: null after the cross-origin hop, so the host is
    // checked first, for any method. Nothing is read; the learner keeps
    // working where they were.
    if (hostOf(req) !== newHost) {
      res.statusCode = 303;
      res.setHeader('Location', backTo(to));
      res.setHeader('Cache-Control', 'no-store');
      return res.end();
    }
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST');
      return refused(res, nonce, 405, 'หน้านี้ใช้ตอนย้ายข้อมูลเท่านั้น');
    }
    // Over the limit, or the shared counter unreachable: not this data's
    // fault, so nothing is marked failed and the next session tries again.
    let quota;
    try { quota = await limit(req); } catch { quota = { ok: false, unavailable: true, retryAfter: 30 }; }
    if (!quota?.ok) {
      res.setHeader('Retry-After', String(Math.max(1, Number(quota?.retryAfter) || 30)));
      return refused(res, nonce, quota?.unavailable ? 503 : 429, 'ตอนนี้ยังย้ายข้อมูลไม่ได้ ลองอีกครั้งภายหลัง', backTo(to));
    }
    if (req.headers?.origin !== oldOrigin) {
      return refused(res, nonce, 403, 'คำขอนี้ไม่ได้มาจากที่อยู่เดิมของ VetMock', backTo(to, h));
    }

    const { p, enc } = body;
    if (typeof p === 'string' && p.length > MAX_PAYLOAD) {
      return refused(res, nonce, 413, 'ข้อมูลมากเกินกว่าจะย้ายในครั้งเดียว', backTo(to, h));
    }
    if (!['gz64', 'js64'].includes(enc) || typeof p !== 'string' || !/^[A-Za-z0-9_-]+$/.test(p) || !h) {
      return refused(res, nonce, 400, 'ย้ายข้อมูลไม่สำเร็จ', backTo(to, h));
    }
    const busy = '<section id="vmx-move-busy" role="status"><i aria-hidden="true"></i>'
      + '<h1>กำลังย้ายข้อมูลการเรียนของคุณ</h1><p>ใช้เวลาไม่กี่วินาที อย่าเพิ่งปิดหน้านี้</p></section>'
      + failureSection(oldOrigin, 'ย้ายข้อมูลไม่สำเร็จ', false);
    return send(res, 200, nonce, page(nonce, busy, { p, enc, h, to, old: oldOrigin }));
  };
}

export default createMoveInHandler();
