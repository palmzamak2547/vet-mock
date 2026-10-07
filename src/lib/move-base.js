// ============================================================
// move-base — the fingerprints both halves of the origin move share
// ============================================================
// A learner can move from vetmock.vercel.app more than once: an old tab that
// was never reloaded keeps studying there, and so can an installed app that
// shares the browser's storage. A later move has to know which side changed a
// value since the last one, or vetmock.com's earlier copy wins every key and
// that later study is lost. So the page /api/move-in serves records, in
// localStorage `vmx-move-base`, a fingerprint of every value the old address
// sent; the next move compares both sides against it.
//
// Fingerprints go three levels deep, because one key can hold a whole
// workspace: a key's raw text; each user-data field inside a study snapshot;
// and each item of the fields whose items change in place (notes, review
// cards, ...), so a card reviewed on the old address is carried even when the
// learner reviewed other cards on vetmock.com meanwhile.
//
// moveBaseKit is self-contained on purpose. api/move-in.js embeds its source
// in the page it serves and src/lib/origin-move.js imports it, so the two
// sides fingerprint with the same code. It may use nothing outside its body.
// ============================================================

export function moveBaseKit() {
  // The USER_DATA_FIELDS local keys and empty values (src/lib/user-data-sync.js),
  // and the fields whose items change in place, by how an item is keyed.
  // tests/unit/move-base.test.mjs pins all three to user-data-sync.js.
  var FIELD_BY_KEY = {
    'vmx-bookmarks': 'bookmarks',
    'vmx-history': 'history',
    'vmx-pending-exam-results': 'pendingExamResults',
    'vmx-notes': 'notes',
    'vmx-sr-cards': 'srCards',
    'vmx-custom-q': 'customQuestions',
    'vmx-streak': 'streakData',
    'vmx-reading-checklist': 'readingChecklist'
  };
  var EMPTY = {
    bookmarks: '[]', history: '[]', pendingExamResults: '[]', notes: '{}', srCards: '{}',
    customQuestions: '[]', streakData: '{"streak":0,"lastDate":null}', readingChecklist: '{}'
  };
  var ITEMS = { notes: 'object', srCards: 'object', readingChecklist: 'object', customQuestions: 'array', pendingExamResults: 'array' };
  // The tools local-extras.js keeps (LOCAL_EXTRA_FIELDS) and how two copies
  // of each join. `by-id` lists carry numeric ids; a custom clip is known by
  // its url and topic; the two maps are keyed by video id.
  var EXTRAS = {
    'vmx-video-notes': 'video-notes', 'vmx-pinboard': 'by-id', 'vmx-user-flashcards': 'by-id',
    'vmx-image-occlusion-decks': 'by-id', 'vmx-custom-videos': 'clips', 'vmx-watched-videos': 'watched'
  };
  var BUNDLE = 'vmx-local-extras-v1';
  var V1 = 'vmx-user-data-v1:', V2 = 'vmx-user-data-v2:';

  function own(o, k) { return Object.prototype.hasOwnProperty.call(o, k); }
  function plain(v) { return !!v && typeof v === 'object' && !Array.isArray(v); }
  function hex(n) { return ('0000000' + (n >>> 0).toString(16)).slice(-8); }
  function json(v) {
    try { var s = JSON.stringify(v); return typeof s === 'string' ? s : null; } catch (e) { return null; }
  }
  // 64 bits, FNV-style: the same mix the bridge in index.html uses.
  function digest(s) {
    var a = 0x811c9dc5, b = 0x9e3779b9;
    for (var i = 0; i < s.length; i++) {
      var c = s.charCodeAt(i);
      a = Math.imul(a ^ c, 0x01000193);
      b = Math.imul(b ^ c, 0x5bd1e995);
    }
    a = Math.imul(a ^ (a >>> 15), 0x2c1b3c6d) ^ b;
    b = Math.imul(b ^ (b >>> 13), 0x297a2d39) ^ a;
    return hex(a) + hex(b);
  }
  // 32 bits, for one item among many.
  function short(s) {
    var a = 0x811c9dc5;
    for (var i = 0; i < s.length; i++) a = Math.imul(a ^ s.charCodeAt(i), 0x01000193);
    return hex(Math.imul(a ^ (a >>> 15), 0x2c1b3c6d));
  }
  // user-data-sync.js stableItemKey, character for character.
  function stableKey(item) {
    if (item && typeof item === 'object') {
      if (item.id !== undefined) return 'id:' + item.id;
      if (item.questionId !== undefined && item.date !== undefined) {
        return 'history:' + item.date + ':' + (item.subject || '') + ':' + item.questionId;
      }
    }
    try { return 'json:' + JSON.stringify(item); } catch (e) { return 'value:' + String(item); }
  }
  // One field's fingerprint: `h` for the whole value, `i` per item where
  // items change in place. `i` has no prototype, so an item named
  // "__proto__" is just another key.
  function print(field, value) {
    var s = json(value);
    if (s === null) return null;
    var out = { h: digest(s) }, kind = ITEMS[field], i, k;
    if (kind === 'object' && plain(value)) {
      out.i = Object.create(null);
      for (k in value) if (own(value, k)) out.i[k] = short(json(value[k]) || '');
    } else if (kind === 'array' && Array.isArray(value)) {
      out.i = Object.create(null);
      for (i = 0; i < value.length; i++) out.i[stableKey(value[i])] = short(json(value[i]) || '');
    }
    return out;
  }
  // The user-data fields one stored key holds: a field key holds its field,
  // a v1 snapshot holds them by name, a v2 snapshot under `base`.
  function fieldsOf(key, raw) {
    var value;
    try { value = JSON.parse(raw); } catch (e) { return null; }
    if (own(FIELD_BY_KEY, key)) { var one = {}; one[FIELD_BY_KEY[key]] = value; return one; }
    if (key.indexOf(V1) === 0) return plain(value) ? value : null;
    if (key.indexOf(V2) === 0) return plain(value) && value.version === 2 && plain(value.base) ? value.base : null;
    return null;
  }
  function slots(key, raw) {
    var fields = fieldsOf(key, raw), out = {}, any = false;
    if (!fields) return null;
    for (var f in EMPTY) {
      if (!own(fields, f)) continue;
      var p = print(f, fields[f]);
      if (p) { out[f] = p; any = true; }
    }
    return any ? out : null;
  }
  // A field key holding nothing but its empty value: nothing there to keep.
  function isEmpty(field, raw) {
    try { return own(EMPTY, field) && json(JSON.parse(raw)) === EMPTY[field]; } catch (e) { return false; }
  }

  function validExtra(kind, value) {
    return kind === 'video-notes' || kind === 'watched' ? plain(value) : Array.isArray(value);
  }
  function idOf(kind, item) {
    if (!item || typeof item !== 'object') return 'json:' + json(item);
    if (kind === 'clips') return typeof item.url === 'string' ? 'clip:' + item.url + '\n' + item.topic : 'json:' + json(item);
    return typeof item.id === 'number' || typeof item.id === 'string' ? typeof item.id + ':' + item.id : 'json:' + json(item);
  }
  // Every item of `mine`, then each item of `theirs` under an id `mine`
  // does not hold. An id both hold keeps `mine`'s copy.
  function byId(kind, mine, theirs) {
    var seen = Object.create(null), out = [], i, id;
    for (i = 0; i < mine.length; i++) { out.push(mine[i]); seen[idOf(kind, mine[i])] = true; }
    for (i = 0; i < theirs.length; i++) {
      id = idOf(kind, theirs[i]);
      if (!seen[id]) { seen[id] = true; out.push(theirs[i]); }
    }
    return out;
  }
  // Two copies of one tool joined, neither hiding the other: lists by id,
  // the video maps key by key (a watched mark keeps its later time, a
  // video's notes join by id). Where both hold the same id, `mine` stays.
  function mergeExtra(kind, mine, theirs) {
    if (kind === 'by-id' || kind === 'clips') return byId(kind, mine, theirs);
    var out = Object.create(null), k, j;
    for (k in theirs) if (own(theirs, k)) out[k] = theirs[k];
    for (k in mine) {
      if (!own(mine, k)) continue;
      var a = mine[k], b = own(theirs, k) ? theirs[k] : undefined;
      if (b === undefined) out[k] = a;
      else if (kind === 'watched') out[k] = Number(b && b.watchedAt) > Number(a && a.watchedAt) ? b : a;
      else if (plain(a) && plain(b) && Array.isArray(a.notes) && Array.isArray(b.notes)) {
        var bucket = Object.create(null);
        for (j in a) if (own(a, j)) bucket[j] = a[j];
        bucket.notes = byId('by-id', a.notes, b.notes);
        bucket.lastUpdated = Math.max(Number(a.lastUpdated) || 0, Number(b.lastUpdated) || 0);
        out[k] = bucket;
      } else out[k] = a;
    }
    return out;
  }

  return {
    FIELD_BY_KEY: FIELD_BY_KEY, EMPTY: EMPTY, ITEMS: ITEMS, EXTRAS: EXTRAS, BUNDLE: BUNDLE, V1: V1, V2: V2,
    digest: digest, short: short, stableKey: stableKey, print: print, fieldsOf: fieldsOf, slots: slots,
    isEmpty: isEmpty, validExtra: validExtra, mergeExtra: mergeExtra
  };
}
