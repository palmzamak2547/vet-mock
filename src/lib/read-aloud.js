// ============================================================
// read-aloud — the player for a question's pre-generated clips and its
// เหตุผล, loaded on the first tap
// ============================================================
// A job reads either the question (stem, then each option with its label) or
// its explanation (one clip). Clips come from tts-shared.js; when a question
// has no complete set, the live voices in tts.js read it instead (device
// mode: play and stop only). State lives in read-aloud-store.js so the
// buttons and the bar render before this module loads.
//
// What the student gets: pause and resume, a scrubber over the whole job,
// previous and next point (the parts of a question, the lines of an
// explanation, else 10 s), speeds 0.75x to 2x, the place they stopped kept
// per job for the session, the lock-screen controls (Media Session), and the
// phrase being spoken highlighted in place (CSS Custom Highlight API, no DOM
// change, so nothing moves) with the page following it unless they scroll.
// ============================================================

import { playerElement, readAloud, RATES, savedRate } from './read-aloud-store.js';
import { sharedPlan, getSharedAudio, loadWords } from './tts-shared.js';
import { questionLang } from './tts-text.js';

const GAP_AFTER = { stem: 400, label: 60, option: 250 }; // ms between pieces, as the old chain
const CHARS_PER_SEC = 12; // a part's length until its clip arrives (Sarah and Kore read 11 to 13)
const HIGHLIGHT = 'vmx-reading';
const positions = new Map(); // job id -> { part, t }: where a student stopped
let run = null;              // the job being read, private to this module

// ---- the element's events, wired once -----------------------------------
let wired = false;
function wire(el) {
  if (wired) return;
  wired = true;
  // Only a clip's events count: the silent sound primePlayer plays in the
  // tap also plays, ends and pauses, and its 'ended' once advanced a job
  // whose first clip was still downloading.
  const clip = () => Boolean(run) && !run.device && el.src.startsWith('blob:');
  el.addEventListener('playing', () => {
    if (!clip()) return;
    run.switching = false;
    readAloud.set({ status: 'playing', note: null });
    mediaState('playing');
    follow(run);
  });
  el.addEventListener('pause', () => {
    // A call, another app's sound or a headphone unplugged pauses the element
    // without us: show it paused, so play resumes it.
    if (!clip() || run.switching || el.ended) return;
    readAloud.set({ status: 'paused' });
    mediaState('paused');
  });
  el.addEventListener('ended', () => { if (clip() && !run.switching) afterPart(run); });
  el.addEventListener('timeupdate', () => { if (clip()) tick(run); });
  el.addEventListener('error', () => { if (clip()) failed(run, 'เล่นเสียงไม่ได้ ลองกดอีกครั้ง'); });
}

// ---- starting and stopping ------------------------------------------------
/**
 * job: { id, what: 'q' | 'explain', title, album, subject, stem, options,
 *        container(part) => Element | null }  (options in display order)
 */
export async function start(job) {
  if (run?.job.id === job.id) { toggle(); return; }
  stop();
  const el = playerElement();
  if (!el) return;
  wire(el);
  const r = run = { job, plan: null, i: 0, durs: [], words: [], device: false, abort: new AbortController(), url: null, gap: null, word: -1, switching: false };
  const rate = savedRate();
  readAloud.reset({ job: { id: job.id, what: job.what, title: job.title }, status: 'loading', rate });
  mediaSession(r);
  const options = job.what === 'q' ? job.options || [] : [];
  const stem = (job.what === 'q' ? job.stem : job.explain) || '';
  let plan = null;
  // A browser that cannot decode AAC in MP4 keeps the live voices rather
  // than download clips it cannot play.
  const aac = (() => { try { return Boolean(el.canPlayType('audio/mp4; codecs="mp4a.40.2"')); } catch { return false; } })();
  if (aac) {
    try {
      plan = await sharedPlan({ stem, options, lang: questionLang(stem, options), subject: job.subject, signal: r.abort.signal });
    } catch { plan = null; }
  }
  if (run !== r) return;
  if (!plan) { device(r, stem, options); return; }
  try { window.localStorage.setItem('vmx-tts-used', '1'); } catch { /* private mode */ }
  r.plan = plan;
  r.durs = plan.map((p) => p.text.length / CHARS_PER_SEC);
  readAloud.set({ duration: total(r), points: pointsOf(r).length });
  // The rest of the clips download behind the first, so they never share a
  // slow link with it; each one's real length replaces the estimate (unless
  // the live voices took the job over meanwhile: r.plan is null then).
  const measure = (i) => plan[i].buf.then((b) => {
    plan[i].ready = true;
    const d = mp4Seconds(b);
    if (run !== r || r.plan !== plan || !d) return;
    r.durs[i] = d;
    readAloud.set({ duration: total(r), points: pointsOf(r).length });
  }, () => {});
  plan[0].buf ||= getSharedAudio(plan[0], r.abort.signal);
  measure(0);
  plan[0].buf.then(() => plan.forEach((p, i) => {
    if (!i) return;
    p.buf ||= getSharedAudio(p, r.abort.signal);
    measure(i);
  }), () => {});
  plan.forEach((p, i) => { r.words[i] = loadWords(p); });
  const at = positions.get(job.id);
  await playPart(r, at?.part ?? 0, at?.t ?? 0);
}

export function stop() {
  const r = run;
  if (!r) return;
  run = null;
  r.abort.abort();
  clearTimeout(r.gap);
  cancelAnimationFrame(r.raf);
  if (r.device) import('./tts.js').then((m) => m.cancelSpeech()).catch(() => {});
  const el = playerElement();
  if (el && !r.device) {
    if (r.plan && !r.done) positions.set(r.job.id, { part: r.i, t: r.onElement === r.i && !r.loading ? el.currentTime || 0 : r.offset || 0 });
    r.switching = true;
    el.pause();
    el.removeAttribute('src');
    try { el.load(); } catch { /* nothing loaded */ }
  }
  if (r.url) URL.revokeObjectURL(r.url);
  clearHighlight();
  mediaSession(null);
  readAloud.reset();
}

// ---- controls ----------------------------------------------------------------
export function toggle() {
  const status = readAloud.get().status;
  if (status === 'playing' || status === 'loading') pause();
  else resume();
}

// The lock screen, a headset and a car send play and pause separately: a
// pause that arrives while paused must not start the speaker.
export function pause() {
  const r = run;
  if (!r) return;
  if (r.device) { stop(); return; }
  const status = readAloud.get().status;
  if (status !== 'playing' && status !== 'loading') return;
  // Paused between two pieces: the next one starts on resume.
  if (r.inGap) { clearTimeout(r.gap); r.inGap = false; r.gapPending = true; }
  r.paused = true;
  if (!r.loading) playerElement().pause();
  readAloud.set({ status: 'paused' });
  mediaState('paused');
}

export function resume() {
  const r = run;
  if (!r || r.device) return;
  const status = readAloud.get().status;
  if (status !== 'paused' && status !== 'error') return;
  r.paused = false;
  if (r.gapPending) { r.gapPending = false; afterGap(r); return; }
  // Still downloading the piece: playPart starts it when it arrives.
  if (r.loading) { readAloud.set({ status: 'loading', note: null }); return; }
  // The piece is not on the element (its download failed): fetch it again.
  if (r.onElement !== r.i) { playPart(r, r.i, r.offset || 0); return; }
  readAloud.set({ status: 'playing', note: null });
  playerElement().play().catch(() => failed(r, 'เล่นเสียงไม่ได้ ลองกดอีกครั้ง'));
}

export function seek(seconds) {
  const r = run;
  if (!r?.plan) return;
  let t = Math.max(0, Math.min(seconds, total(r) - 0.05));
  for (let i = 0; i < r.plan.length; i++) {
    if (t < r.durs[i] || i === r.plan.length - 1) {
      if (i === r.i) {
        // Still downloading: it starts there when it arrives.
        if (r.loading) { r.offset = t; readAloud.set({ time: before(r, i) + t }); return; }
        // On the element and not over: move within it. Over (the gap after
        // it) or never loaded (its download failed): playPart loads it.
        if (r.onElement === i && !r.inGap && !r.gapPending) { playerElement().currentTime = Math.min(t, r.durs[i]); tick(r); return; }
      }
      playPart(r, i, t);
      return;
    }
    t -= r.durs[i];
  }
}

// Points: the parts of a question; within one clip, the start of each line
// of its text, or every 10 s when it is one paragraph.
export function next() { jump(+1); }
export function prev() { jump(-1); }
function jump(dir) {
  const r = run;
  if (!r?.plan) return;
  const now = readAloud.get().time;
  const pts = pointsOf(r);
  if (pts.length > 1) {
    const target = dir > 0 ? pts.find((p) => p > now + 0.3) : [...pts].reverse().find((p) => p < now - 1.5);
    if (target != null) seek(target);
    else if (dir < 0) seek(0);
    else { r.done = true; positions.delete(r.job.id); stop(); } // past the last point: done, as at the end
    return;
  }
  seek(now + dir * 10);
}

export function setRate(rate) {
  if (!RATES.includes(rate)) return;
  try { window.localStorage.setItem('vmx-read-aloud-rate', String(rate)); } catch { /* private mode */ }
  const el = playerElement();
  if (el) { el.defaultPlaybackRate = rate; el.playbackRate = rate; }
  readAloud.set({ rate });
}

/** For a student who has used read-aloud: the manifests ahead of the tap, and
 *  with clip, the first clip and its timings too (never on Save-Data). */
export async function warm(job, { clip = false } = {}) {
  const options = job.what === 'q' ? job.options || [] : [];
  const stem = (job.what === 'q' ? job.stem : job.explain) || '';
  const save = typeof navigator !== 'undefined' && navigator.connection?.saveData;
  try {
    const plan = await sharedPlan({ stem, options, lang: questionLang(stem, options), subject: job.subject, prefetch: clip && !save });
    if (plan && clip && !save) loadWords(plan[0]);
  } catch { /* a hint only */ }
}

// ---- playing a part ----------------------------------------------------------
async function playPart(r, i, offset = 0) {
  clearTimeout(r.gap);
  // A pause taken in the gap belongs to the piece that was next, not this one.
  r.inGap = false;
  r.gapPending = false;
  r.i = i;
  r.offset = offset;
  r.word = -1;
  clearHighlight();
  // The old piece stops now: left playing while this one downloads, its
  // 'ended' would act on the new index.
  const el = playerElement();
  if (r.onElement != null && r.onElement !== i) { r.switching = true; el.pause(); }
  const p = r.plan[i];
  // 'loading' only while the clip is still on its way: a ready one would
  // flash the spinner and speak "loading" between every two pieces.
  readAloud.set({ part: i, kind: p.kind, option: p.option, time: before(r, i) + offset, ...(p.ready && !r.paused ? {} : { status: r.paused ? 'paused' : 'loading' }) });
  // The piece being read comes up above the bar (which renders a moment
  // after the first one starts), unless the student is scrolling.
  setTimeout(() => { if (run === r && r.i === i) keepBlockInView(r.job.container?.(p.kind, p.option)); }, 60);
  let buf;
  r.loading = true;
  try {
    buf = await (p.buf ||= getSharedAudio(p, r.abort.signal));
  } catch {
    // Forget the failed download, so play fetches it again.
    p.buf = null;
    if (run === r && r.i === i) { r.loading = false; failed(r, 'โหลดเสียงไม่ได้ ลองกดอีกครั้ง'); }
    return;
  }
  p.ready = true;
  if (run !== r || r.i !== i) return;
  r.loading = false;
  r.switching = true;
  if (r.url) URL.revokeObjectURL(r.url);
  r.url = URL.createObjectURL(new Blob([buf], { type: 'audio/mp4' }));
  el.muted = false;
  el.src = r.url;
  r.onElement = i;
  el.defaultPlaybackRate = readAloud.get().rate;
  el.playbackRate = readAloud.get().rate;
  // r.offset, not offset: a seek made while the piece downloaded moved it.
  const at = r.offset;
  if (at > 0) el.addEventListener('loadedmetadata', () => { if (run === r && r.i === i) el.currentTime = Math.min(at, el.duration || at); }, { once: true });
  if (r.paused) { readAloud.set({ status: 'paused' }); return; }
  try {
    await el.play();
  } catch (e) {
    // A newer piece took the element (a fast tap on next): not a failure.
    if (e?.name === 'AbortError') return;
    r.switching = false;
    // Nothing heard yet (a browser that refuses the clip): the live voices try.
    if (run === r && !r.heard) {
      // They never use the element: the refused clip leaves it, or the next
      // tap's primePlayer takes it for a paused job's clip and skips the prime.
      el.removeAttribute('src');
      try { el.load(); } catch { /* nothing loaded */ }
      r.plan = null;
      device(r, (r.job.what === 'q' ? r.job.stem : r.job.explain) || '', r.job.what === 'q' ? r.job.options || [] : []);
    }
    else if (run === r) failed(r, 'เล่นเสียงไม่ได้ ลองกดอีกครั้ง');
    return;
  }
  if (run !== r) return;
  r.heard = true;
}

function afterPart(r) {
  const p = r.plan[r.i];
  if (r.i >= r.plan.length - 1) {
    r.done = true;
    positions.delete(r.job.id);
    stop();
    return;
  }
  if (r.paused) { r.gapPending = true; return; }
  r.inGap = true;
  r.gap = setTimeout(() => afterGap(r), GAP_AFTER[p.kind] ?? 0);
}
function afterGap(r) {
  r.inGap = false;
  if (run !== r) return;
  playPart(r, r.i + 1, 0);
}

function failed(r, note) {
  if (run !== r) return;
  readAloud.set({ status: 'error', note });
  mediaState('paused');
}

// The live voices, for a question with no complete set of clips: offline with
// nothing cached, or a subject the clips have not reached.
async function device(r, stem, options) {
  r.device = true;
  readAloud.set({ device: true, status: 'loading', duration: 0, points: 0 });
  let tts;
  try { tts = await import('./tts.js'); } catch { failed(r, 'ต่ออินเทอร์เน็ตแล้วลองอีกครั้ง'); return; }
  if (run !== r) return;
  // The signal aborts the voices' downloads the moment the job stops.
  r.controller = { cancelled: false, signal: r.abort.signal };
  r.abort.signal.addEventListener('abort', () => { r.controller.cancelled = true; }, { once: true });
  tts.speakQuestion({
    stem,
    options,
    subject: r.job.subject,
    controller: r.controller,
    skipShared: true,
    onStart: () => { if (run === r) readAloud.set({ status: 'playing' }); },
    // A failure is followed by an end: the note stays up until the student
    // closes the bar, instead of going down with the job at once.
    onEnd: () => { if (run === r && !r.failed) { r.done = true; stop(); } },
    onFail: (why) => { r.failed = true; failed(r, why === 'offline'
      ? 'ต่ออินเทอร์เน็ตแล้วลองอีกครั้ง'
      : 'เครื่องนี้ไม่มีเสียงอ่านภาษานี้'); },
  });
}

// ---- time, words and the highlight --------------------------------------
const total = (r) => r.durs.reduce((a, b) => a + b, 0);
const before = (r, i) => r.durs.slice(0, i).reduce((a, b) => a + b, 0);

function pointsOf(r) {
  if (!r.plan) return [];
  if (r.plan.length > 1) return r.plan.map((_, i) => before(r, i)).filter((t, i) => r.plan[i].kind !== 'option');
  // One clip: the starts of its lines, read off its word timings.
  const w = r.wordsNow?.[0];
  const text = r.plan[0].text;
  if (!w || !text.includes('\n')) return [];
  const starts = [0];
  let k = 0;
  for (const m of text.matchAll(/\S+/g)) {
    if (k > 0 && /\n/.test(text.slice(0, m.index).match(/\s*$/)[0])) starts.push(w[k]);
    k++;
  }
  return starts;
}

let lastMedia = 0;
function tick(r) {
  const el = playerElement();
  const time = before(r, r.i) + (el.currentTime || 0);
  readAloud.set({ time });
  moveWord(r);
  const now = performance.now();
  if (now - lastMedia > 1000) {
    lastMedia = now;
    try { navigator.mediaSession?.setPositionState?.({ duration: Math.max(total(r), time), playbackRate: el.playbackRate || 1, position: time }); } catch { /* bad numbers */ }
  }
}

// Every frame while a part with word timings plays: move the highlight to
// the phrase being spoken, and keep it on screen.
function follow(r) {
  cancelAnimationFrame(r.raf);
  const i = r.i;
  r.words[i]?.then((w) => {
    if (run !== r || r.i !== i || !w) return;
    r.wordsNow = { ...(r.wordsNow || {}), [i]: w };
    if (r.plan.length === 1) readAloud.set({ points: pointsOf(r).length });
    const el = playerElement();
    const loop = () => {
      if (run !== r || r.i !== i || el.paused) return; // 'playing' starts it again
      moveWord(r);
      r.raf = requestAnimationFrame(loop);
    };
    loop();
  });
}

// The word the voice is on. Frames stop in a hidden tab, so the element's
// timeupdate (tick) moves it too.
function moveWord(r) {
  const w = r.wordsNow?.[r.i];
  if (!w) return;
  const t = playerElement().currentTime;
  let k = w.length - 1;
  while (k > 0 && w[k] > t + 0.05) k--;
  if (k !== r.word) { r.word = k; highlight(r, r.i, k); }
}

function clearHighlight() {
  try { CSS.highlights?.delete(HIGHLIGHT); } catch { /* no API */ }
}

function highlight(r, i, k) {
  const box = r.job.container?.(r.plan[i].kind);
  if (!box || typeof CSS === 'undefined' || !CSS.highlights || typeof Highlight === 'undefined') return;
  const range = phraseRange(box, r.plan[i].text, k);
  if (!range) return;
  CSS.highlights.set(HIGHLIGHT, new Highlight(range));
  keepInView(range);
}

// The DOM range of the kth word of the spoken text inside box. The spoken
// text is the shown text with symbols said in words ("> 700" is "มากกว่า
// 700"), so the two are matched character by character (longest common
// subsequence) once per box and text.
const maps = new WeakMap();
export function phraseRange(box, spoken, k) {
  let m = maps.get(box);
  if (!m || m.spoken !== spoken || m.shown !== box.textContent) m = mapText(box, spoken);
  maps.set(box, m);
  const tok = m.tokens[k];
  if (!tok) return null;
  let a = -1, b = -1;
  for (let c = tok[0]; c < tok[1]; c++) { const d = m.map[c]; if (d >= 0) { if (a < 0) a = d; b = d; } }
  if (a < 0) return null;
  const range = document.createRange();
  const at = (off) => { let n = 0; while (n < m.nodes.length - 1 && m.starts[n + 1] <= off) n++; return [m.nodes[n], off - m.starts[n]]; };
  try {
    range.setStart(...at(a));
    range.setEnd(...at(b + 1));
  } catch { return null; }
  return range;
}

export function mapText(box, spoken) {
  const nodes = [], starts = [];
  let shown = '';
  const walker = document.createTreeWalker(box, NodeFilter.SHOW_TEXT);
  for (let n = walker.nextNode(); n; n = walker.nextNode()) { nodes.push(n); starts.push(shown.length); shown += n.data; }
  return { spoken, shown, nodes, starts, tokens: [...spoken.matchAll(/\S+/g)].map((t) => [t.index, t.index + t[0].length]), map: align(spoken, shown) };
}

// map[i] = the index in b of a[i], or -1: a longest common subsequence,
// case-insensitive, inside a band around the diagonal. The two texts differ
// only where a symbol is said in words, so they never drift far apart, and
// the band keeps the longest explanation near 0.3 M cells instead of 2.8 M.
export function align(a, b) {
  const n = a.length, m = b.length;
  const A = a.toLowerCase(), B = b.toLowerCase();
  const blank = (c) => c === ' ' || c === '\n' || c === '\t' || c === '\u00a0';
  const W = Math.abs(m - n) + 96; // half the band's width
  const width = 2 * W + 1;
  const mid = (i) => Math.round((i * m) / Math.max(1, n));
  const L = new Uint16Array((n + 1) * width);
  const get = (i, j) => {
    if (i >= n || j >= m) return 0;
    const d = j - mid(i) + W;
    return d < 0 || d >= width ? 0 : L[i * width + d];
  };
  for (let i = n - 1; i >= 0; i--) {
    const c = mid(i);
    for (let j = Math.min(m - 1, c + W); j >= Math.max(0, c - W); j--) {
      L[i * width + (j - c + W)] = A[i] === B[j] && !blank(A[i])
        ? get(i + 1, j + 1) + 1
        : Math.max(get(i + 1, j), get(i, j + 1));
    }
  }
  const map = new Int32Array(n).fill(-1);
  let i = 0, j = 0;
  while (i < n && j < m) {
    if (j < mid(i) - W) { j++; continue; }
    if (j > mid(i) + W) { i++; continue; }
    if (A[i] === B[j] && !blank(A[i])) { map[i++] = j++; }
    else if (get(i + 1, j) >= get(i, j + 1)) i++;
    else j++;
  }
  return map;
}

// Keep the phrase on screen, above the bar, unless the student scrolled in
// the last 4 s: they are reading something else, and the page must not fight them.
let manualAt = 0;
if (typeof window !== 'undefined') {
  for (const type of ['wheel', 'touchmove', 'keydown']) window.addEventListener(type, () => { manualAt = performance.now(); }, { passive: true });
}
function visibleBand() {
  const bar = document.querySelector('.vmx-read-bar')?.getBoundingClientRect();
  return { top: 88, bottom: (bar ? bar.top : window.innerHeight) - 16 };
}
function scrollBy(delta) {
  if (!delta) return;
  const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  window.scrollBy({ top: delta, behavior: reduce ? 'auto' : 'smooth' });
}
function keepInView(range) {
  if (performance.now() - manualAt < 4000) return;
  const rect = range.getBoundingClientRect();
  const { top, bottom } = visibleBand();
  scrollBy(rect.bottom > bottom ? rect.bottom - bottom + 48 : rect.top < top ? rect.top - top - 48 : 0);
}
// A block (the stem, an option row, the เหตุผล): at least its first lines
// between the header and the bar.
function keepBlockInView(el) {
  if (!el || performance.now() - manualAt < 4000) return;
  const rect = el.getBoundingClientRect();
  const { top, bottom } = visibleBand();
  const head = Math.min(rect.bottom, rect.top + 120);
  scrollBy(rect.top < top ? rect.top - top : head > bottom ? Math.min(rect.top - top, head - bottom + 24) : 0);
}

// ---- the lock screen and the media keys -------------------------------------
function mediaSession(r) {
  const ms = typeof navigator !== 'undefined' ? navigator.mediaSession : null;
  if (!ms) return;
  try { ms.metadata = r && typeof MediaMetadata !== 'undefined' ? new MediaMetadata({ title: r.job.title, artist: 'VetMock', album: r.job.album || '' }) : null; } catch { /* old Safari */ }
  const on = {
    play: resume, pause, stop,
    previoustrack: prev, nexttrack: next,
    seekbackward: () => seek(readAloud.get().time - 10),
    seekforward: () => seek(readAloud.get().time + 10),
    seekto: (d) => seek(d.seekTime),
  };
  for (const [action, fn] of Object.entries(on)) { try { ms.setActionHandler(action, r ? fn : null); } catch { /* unsupported action */ } }
  mediaState(r ? 'playing' : 'none');
}
function mediaState(s) {
  try { if (navigator.mediaSession) navigator.mediaSession.playbackState = s; } catch { /* old browser */ }
}

// Seconds in an MP4 (AAC) clip, from its movie header: the scrubber's real
// length as soon as a clip arrives, without decoding it.
export function mp4Seconds(buf) {
  try {
    const v = new DataView(buf);
    for (let i = 0; i + 32 < v.byteLength; i++) {
      if (v.getUint32(i) !== 0x6d766864) continue; // 'mvhd'
      const version = v.getUint8(i + 4);
      const scale = version === 1 ? v.getUint32(i + 24) : v.getUint32(i + 16);
      const dur = version === 1 ? v.getUint32(i + 28) * 2 ** 32 + v.getUint32(i + 32) : v.getUint32(i + 20);
      return scale ? dur / scale : 0;
    }
  } catch { /* not an MP4 */ }
  return 0;
}
