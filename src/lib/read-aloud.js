// ============================================================
// read-aloud — the player for a question's pre-generated clips and its
// เหตุผล, loaded on the first tap
// ============================================================
// A job reads either the question (stem, then each option with its label) or
// its explanation. Clips come from tts-shared.js; when a question has no
// complete set, or its first clip does not arrive within FIRST_WAIT_MS, the
// live voices read it instead (device mode), in sentence-sized pieces with
// the same controls: the device's own voice where it has a good one, else
// the cloud voice on this module's element, else whichever of the two still
// works, else a plain note saying why and what to do. State lives in
// read-aloud-store.js so the buttons and the bar render before this module
// loads.
//
// What the student gets: pause and resume, a scrubber over the whole job,
// previous and next point (the parts of a question, the lines of an
// explanation, else 10 s), speeds 0.75x to 2x, the place they stopped kept
// per job for the session, the lock-screen controls (Media Session), and the
// phrase being spoken highlighted in place (CSS Custom Highlight API, no DOM
// change, so nothing moves) with the page following it unless they scroll.
// ============================================================

import { playerElement, readAloud, RATES, savedRate, session, stopSampleSound } from './read-aloud-store.js';
import { getVoicePrefs, setVoicePrefs, subscribeVoicePrefs } from './voice-prefs.js';
import { sharedPlan, getSharedAudio, loadWords } from './tts-shared.js';
import { questionLang } from './tts-text.js';

const GAP_AFTER = { stem: 400, label: 60, option: 250 }; // ms between pieces, as the old chain
const GAP_SENTENCE = 120; // ms between two sentences of one piece
const CHARS_PER_SEC = 12; // a part's length until its clip arrives (Sarah and Kore read 11 to 13)
const HIGHLIGHT = 'vmx-reading';
// How long a tap waits for the first stored clip before the live voices read
// instead, and for a cloud voice's piece before the device's own voice does.
export const FIRST_WAIT_MS = 4000;
export const CLOUD_WAIT_MS = 4000;
// A device voice that has not started within this has no voice for the text.
// The first sentence of a session gets longer: a Windows voice took 2.7 s to
// start the first time (measured 16 Nov 2026), then half a second.
export const NO_START_MS = 2500;
export const NO_START_FIRST_MS = 6000;
let speechWarm = false;   // the device voice has spoken once this session
const OFFLINE_NOTE = 'ต่ออินเทอร์เน็ตแล้วลองอีกครั้ง';
const noVoiceNote = (lang) => (lang === 'en'
  ? 'เครื่องนี้ไม่มีเสียงอ่านภาษาอังกฤษ ต่ออินเทอร์เน็ตแล้วลองอีกครั้ง'
  : 'เครื่องนี้ไม่มีเสียงอ่านภาษาไทย เพิ่มได้ในการตั้งค่าเสียงของเครื่อง หรือต่ออินเทอร์เน็ตแล้วลองอีกครั้ง');
// The cloud voice answers signed-in Chula accounts only: online, the block is the sign-in.
const signInNote = (lang) => (lang === 'en'
  ? 'เครื่องนี้ไม่มีเสียงอ่านภาษาอังกฤษ เข้าสู่ระบบด้วยอีเมลจุฬาเพื่อใช้เสียงอ่านออนไลน์'
  : 'เครื่องนี้ไม่มีเสียงอ่านภาษาไทย เพิ่มได้ในการตั้งค่าเสียงของเครื่อง หรือเข้าสู่ระบบด้วยอีเมลจุฬาเพื่อใช้เสียงอ่านออนไลน์');
const failNote = (r) => (r.offline || !online() ? OFFLINE_NOTE : session.cloudRefused ? signInNote(r.live?.lang) : noVoiceNote(r.live?.lang));
const positions = new Map(); // job id -> { part, t, device }: where a student stopped
let run = null;              // the job being read, private to this module
let liveTts = null;          // tts.js, asked for at the tap so a fallback never waits for it
const loadLive = () => (liveTts ||= import('./tts.js').catch((e) => { liveTts = null; throw e; }));

// ---- the element's events, wired once -----------------------------------
let wired = false;
function wire(el) {
  if (wired) return;
  wired = true;
  // Only a piece's events count: the silent sound primePlayer plays in the
  // tap also plays, ends and pauses, and its 'ended' once advanced a job
  // whose first clip was still downloading. A piece the device voice speaks
  // never uses the element.
  const clip = () => Boolean(run?.plan) && run.plan[run.i]?.src !== 'speech' && el.src.startsWith('blob:');
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
  el.addEventListener('error', () => {
    if (!clip()) return;
    if (run.plan[run.i].src === 'cloud') cloudFailed(run, run.i);
    else failed(run, 'เล่นเสียงไม่ได้ ลองกดอีกครั้ง');
  });
}

// ---- starting and stopping ------------------------------------------------
/**
 * job: { id, what: 'q' | 'explain', title, album, subject, stem, options,
 *        container(part) => Element | null }  (options in display order)
 * Optional: block(part), the element kept in view where it is not the one a
 * phrase is marked in; stemLabel, what the bar calls the stem.
 */
export async function start(job) {
  stopSampleSound();
  if (run?.job.id === job.id) { toggle(); return; }
  stop();
  const el = playerElement();
  if (!el) return;
  wire(el);
  const r = run = { job, plan: null, i: 0, durs: [], words: [], device: false, abort: new AbortController(), url: null, gap: null, word: -1, switching: false };
  const rate = savedRate();
  readAloud.reset({ job: { id: job.id, what: job.what, title: job.title, stemLabel: job.stemLabel }, status: 'loading', rate });
  mediaSession(r);
  // The live voices load beside the clips' manifest, and the device lists
  // its voices meanwhile: a fallback starts at once instead of after them.
  loadLive().then((m) => m.warmLive?.()).catch(() => {});
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
  if (!plan) { device(r); return; }
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
  const at = resumeAt(r);
  await playPart(r, at.part, at.t);
}

// Where this job stopped last, if it stopped in the same kind of reading
// (clips or live voices: their pieces are numbered differently).
function resumeAt(r) {
  const at = positions.get(r.job.id);
  if (!at || Boolean(at.device) !== r.device || at.part >= r.plan.length) return { part: 0, t: 0 };
  return { part: at.part, t: r.device ? 0 : at.t };
}

export function stop() {
  const r = run;
  if (!r) return;
  run = null;
  r.abort.abort();
  clearTimeout(r.gap);
  cancelAnimationFrame(r.raf);
  clearTimeout(r.watch);
  if (r.device) { r.utter = null; cancelDeviceSpeech(); }
  const el = playerElement();
  if (r.plan && !r.done) positions.set(r.job.id, { part: r.i, t: r.onElement === r.i && !r.loading && el ? el.currentTime || 0 : r.offset || 0, device: r.device });
  if (el && (!r.device || r.onElement != null || el.src.startsWith('blob:'))) {
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
  const status = readAloud.get().status;
  if (status !== 'playing' && status !== 'loading') return;
  // Paused between two pieces: the next one starts on resume.
  if (r.inGap) { clearTimeout(r.gap); r.inGap = false; r.gapPending = true; }
  r.paused = true;
  // A sentence the device voice is saying stops, and starts again on resume.
  if (r.plan?.[r.i]?.src === 'speech') { clearTimeout(r.watch); r.utter = null; cancelDeviceSpeech(); }
  else if (!r.loading && r.plan) playerElement().pause();
  readAloud.set({ status: 'paused' });
  mediaState('paused');
}

export function resume() {
  const r = run;
  if (!r) return;
  const status = readAloud.get().status;
  if (status !== 'paused' && status !== 'error') return;
  stopSampleSound();
  // A note that nothing can read this question: play starts it again from
  // its first choice of voice (the network or a voice may be back), also
  // when it failed before it had any pieces. The student's tap asks the
  // cloud voice once more (a sign-in since); nothing else re-asks it.
  if (r.dead) { const job = r.job; session.cloudRefused = false; stop(); start(job); return; }
  if (!r.plan) return;
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
  setVoicePrefs({ rate }); // applyPrefs below does the rest
}

// A stored clip plays faster or slower with its pitch kept (the browsers'
// default, set here so no engine drops it).
function setElementRate(el, rate) {
  el.defaultPlaybackRate = rate;
  el.playbackRate = rate;
  try { el.preservesPitch = true; el.mozPreservesPitch = true; el.webkitPreservesPitch = true; } catch { /* read-only in an old engine */ }
}

// The voice settings changed (the bar's sheet, or another tab): the speed
// applies at once, to a clip mid-word and to the device voice; a new tone or
// voice applies to the device voice from the sentence it is saying, which
// starts again. Tone does not change a stored clip: shifting a clip's pitch
// on the device without changing its speed would cost its quality.
let applied = getVoicePrefs();
function applyPrefs() {
  const prefs = getVoicePrefs();
  const was = applied;
  applied = prefs;
  const el = playerElement();
  if (prefs.rate !== readAloud.get().rate) {
    if (el) setElementRate(el, prefs.rate);
    readAloud.set({ rate: prefs.rate });
  }
  const r = run;
  if (!r?.live) return;
  // Only the voice for the language being read matters to this reading.
  const key = r.live.lang === 'en' ? 'voiceEn' : 'voiceTh';
  const voiceChanged = prefs[key] !== was[key];
  if (!voiceChanged && prefs.pitch === was.pitch && prefs.rate === was.rate) return;
  // A new voice is taken now, for the device pieces still to come, even while
  // a cloud piece plays.
  if (voiceChanged) {
    loadLive().then((m) => {
      if (run !== r) return;
      const v = m.voiceNow(r.live.lang);
      if (v.voice) Object.assign(r.live, v);
      restartSoon(r);
    }).catch(() => {});
  } else restartSoon(r);
}
// The sentence the device voice is saying starts again in the new settings,
// once the student stops tapping (each restart is a cancel and a speak, and
// some engines drop a speak that follows a cancel). The old utterance is let
// go first, so an engine that reports 'end' on cancel does not move on.
function restartSoon(r) {
  clearTimeout(r.retune);
  r.retune = setTimeout(() => {
    if (run !== r || r.paused || r.plan?.[r.i]?.src !== 'speech' || !r.utter) return;
    r.utter = null;
    clearTimeout(r.watch);
    playPart(r, r.i, 0);
  }, 250);
}
session.pause = () => pause();
subscribeVoicePrefs(applyPrefs);

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
  setTimeout(() => { if (run === r && r.i === i) keepBlockInView((r.job.block || r.job.container)?.(p.kind, p.option)); }, 60);
  if (p.src === 'speech') { speakPart(r, i); return; }
  if (p.src === 'cloud') aheadCloud(r, i);
  let buf;
  r.loading = true;
  // Nothing heard yet: the first stored clip gets FIRST_WAIT_MS before the
  // live voices read the question instead (a stalled link is not silence).
  const firstWait = !r.heard && !r.device;
  try {
    const got = p.src === 'cloud' ? cloudAudio(r, p) : (p.buf ||= getSharedAudio(p, r.abort.signal));
    buf = await (firstWait || p.src === 'cloud' ? withLimit(got, p.src === 'cloud' ? CLOUD_WAIT_MS : FIRST_WAIT_MS) : got);
  } catch {
    // Forget the failed download, so play fetches it again.
    p.buf = null;
    if (run !== r || r.i !== i) return;
    r.loading = false;
    if (p.src === 'cloud') { cloudFailed(r, i); return; }
    if (firstWait) { r.abort.abort(); r.abort = new AbortController(); device(r); return; }
    failed(r, 'โหลดเสียงไม่ได้ ลองกดอีกครั้ง');
    return;
  }
  p.ready = true;
  if (run !== r || r.i !== i) return;
  r.loading = false;
  r.switching = true;
  if (r.url) URL.revokeObjectURL(r.url);
  r.url = URL.createObjectURL(new Blob([buf], { type: p.src === 'cloud' ? 'audio/mpeg' : 'audio/mp4' }));
  el.muted = false;
  el.src = r.url;
  r.onElement = i;
  setElementRate(el, readAloud.get().rate);
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
    // A cloud piece the browser will not play: the device's own voice tries.
    if (run === r && p.src === 'cloud') { el.removeAttribute('src'); try { el.load(); } catch { /* nothing loaded */ } r.onElement = null; cloudFailed(r, i); return; }
    // Nothing heard yet (a browser that refuses the clip): the live voices try.
    if (run === r && !r.heard) {
      // The refused clip leaves the element, or the next tap's primePlayer
      // takes it for a paused job's clip and skips the prime.
      el.removeAttribute('src');
      try { el.load(); } catch { /* nothing loaded */ }
      r.onElement = null;
      r.plan = null;
      device(r);
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
  // Two sentences of one text: the pause of a sentence end, not of a new part.
  const nxt = r.plan[r.i + 1];
  const same = nxt.kind === p.kind && nxt.option === p.option && p.full != null && nxt.full === p.full;
  r.gap = setTimeout(() => afterGap(r), same ? GAP_SENTENCE : GAP_AFTER[p.kind] ?? 0);
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

// The live voices, for a question with no complete set of clips (offline
// with nothing cached, a subject the clips have not reached) or whose first
// clip did not come in time. The same pieces, points and controls as clips:
// sentence-sized pieces, each said by the device's own voice where it has a
// good one (instant, offline), else fetched from the cloud voice and played
// on this module's element (the next two fetched ahead). Either failing
// hands the rest to the other; both failing leaves a note saying why and
// what to do, and play tries again from the start.
async function device(r) {
  r.device = true;
  r.plan = null;
  r.onElement = null;
  r.heard = false;
  r.dead = false;
  r.words = [];
  r.wordsNow = null;
  readAloud.set({ device: true, status: 'loading', duration: 0, points: 0, note: null });
  let tts;
  try { tts = await loadLive(); } catch { if (run === r) dead(r, OFFLINE_NOTE); return; }
  if (run !== r) return;
  const job = r.job;
  const stem = (job.what === 'q' ? job.stem : job.explain) || '';
  const options = job.what === 'q' ? job.options || [] : [];
  let live;
  try { live = await tts.livePlan({ stem, options }); } catch { live = null; }
  if (run !== r) return;
  if (!live?.parts.length) { dead(r, noVoiceNote(live?.lang)); return; }
  r.live = live;
  // Which voice reads first: the rule the voice settings show and sample with.
  const first = tts.readerSource(live, session.cloudRefused);
  // The cloud voice already refused this visitor and the device has no voice:
  // say so at once, without asking the cloud again.
  if (first === 'cloud' && session.cloudRefused) { dead(r, signInNote(live.lang)); return; }
  r.plan = live.parts.map((p) => ({ ...p, src: first }));
  r.triedCloud = first === 'cloud';
  r.triedSpeech = first === 'speech';
  r.durs = r.plan.map((p) => Math.max(0.4, p.text.length / CHARS_PER_SEC));
  readAloud.set({ duration: total(r), points: pointsOf(r).length });
  const at = resumeAt(r);
  await playPart(r, at.part, 0);
}

// A piece said by the device's own voice. It reports its start and its end;
// one that never starts within NO_START_MS means this device has no voice
// for the text, and one that never ends is moved past after its longest time.
function speakPart(r, i) {
  const p = r.plan[i];
  r.loading = false;
  r.onElement = null;
  if (r.paused) { readAloud.set({ status: 'paused' }); return; }
  const synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
  if (!synth || typeof SpeechSynthesisUtterance === 'undefined') { speechFailed(r, i); return; }
  // Cancelled only when something is still queued, and a speak() right after
  // any cancel (a pause, a skip, a new speed) waits a moment: Chrome on
  // Android has dropped a speak() that comes straight after a cancel().
  if (synth.speaking || synth.pending) cancelDeviceSpeech();
  const settle = Date.now() - cancelledAt < SETTLE_MS;
  const u = new SpeechSynthesisUtterance(p.say);
  const v = r.live.voice;
  if (v) { u.voice = v; u.lang = v.lang; } else u.lang = r.live.lang === 'en' ? 'en-US' : 'th-TH';
  u.rate = Math.max(0.5, Math.min(2, (r.live.rate || 1) * (readAloud.get().rate || 1)));
  u.pitch = getVoicePrefs().pitch;
  r.utter = u;
  const mine = () => run === r && r.utter === u;
  let started = false;
  let t0 = Date.now();
  clearTimeout(r.watch);
  r.watch = setTimeout(() => { if (mine() && !started) { r.utter = null; cancelDeviceSpeech(); speechFailed(r, i); } }, speechWarm ? NO_START_MS : NO_START_FIRST_MS);
  u.onstart = () => {
    if (!mine()) return;
    started = true;
    speechWarm = true;
    r.heard = true;
    clearTimeout(r.watch);
    r.watch = setTimeout(() => { if (mine()) { r.utter = null; cancelDeviceSpeech(); afterPart(r); } }, 4000 + (p.say.length * 150) / (u.rate || 1));
    readAloud.set({ status: 'playing', note: null, time: before(r, i) });
    mediaState('playing');
    markPart(r, i);
  };
  u.onend = () => {
    if (!mine()) return;
    clearTimeout(r.watch);
    r.utter = null;
    // Some engines end without a start event: an end after a while is speech.
    if (!started && Date.now() - t0 < 250) { speechFailed(r, i); return; }
    r.heard = true;
    afterPart(r);
  };
  u.onerror = (e) => {
    if (!mine()) return;
    clearTimeout(r.watch);
    r.utter = null;
    if (e?.error === 'interrupted' || e?.error === 'canceled') return;
    if (!started) speechFailed(r, i); else afterPart(r);
  };
  if (settle) setTimeout(() => { if (mine()) { t0 = Date.now(); synth.speak(u); } }, SETTLE_MS);
  else synth.speak(u);
}

const SETTLE_MS = 60;
let cancelledAt = 0;
function cancelDeviceSpeech() {
  cancelledAt = Date.now();
  try { window.speechSynthesis?.cancel(); } catch { /* no speech */ }
}

// The device voice could not say a piece: the cloud voice reads from it on,
// once; then a note.
function speechFailed(r, i) {
  if (run !== r) return;
  // A voice the listener chose that does not speak (on this device, or in a
  // timed paper where the settings cannot be opened): the device's own
  // default voice reads at once, before the cloud is asked.
  if (r.live?.chosen && !r.triedDefault) {
    r.triedDefault = true;
    loadLive().then((m) => {
      if (run !== r) return;
      const v = m.voiceNow(r.live.lang, { ignoreChoice: true });
      if (v.voice && v.voice !== r.live.voice) { Object.assign(r.live, v, { chosen: false }); playPart(r, i, 0); } else speechFailed(r, i);
    }, () => speechFailed(r, i));
    return;
  }
  if (!r.triedCloud && online()) {
    r.triedCloud = true;
    for (let k = i; k < r.plan.length; k++) r.plan[k].src = 'cloud';
    playPart(r, i, 0);
    return;
  }
  dead(r, failNote(r));
}

// The cloud voice could not give a piece in time: the device's own voice, if
// it has any for the language (even a plain one), reads from it on.
function cloudFailed(r, i) {
  if (run !== r) return;
  const speechOk = typeof window !== 'undefined' && Boolean(window.speechSynthesis) && typeof SpeechSynthesisUtterance !== 'undefined';
  if (!r.triedSpeech && speechOk && r.live?.voice) {
    r.triedSpeech = true;
    r.triedCloud = true;
    for (let k = i; k < r.plan.length; k++) r.plan[k].src = 'speech';
    playPart(r, i, 0);
    return;
  }
  dead(r, failNote(r));
}

// Nothing could read it: say why, keep the bar up until the student closes
// it, and let play try the whole job again.
function dead(r, note) {
  if (run !== r) return;
  r.dead = true;
  failed(r, note);
}

const online = () => typeof navigator === 'undefined' || navigator.onLine !== false;

function cloudAudio(r, p) {
  if (!p.cloud) {
    p.cloud = loadLive().then((m) => m.cloudPiece(p.say, r.live.lang, r.abort.signal));
    // A request that never reached a server: this device is offline.
    p.cloud.catch((e) => {
      p.cloud = null;
      if (e?.name === 'TypeError') r.offline = true;
      if (/^tts 40[13]/.test(String(e?.message))) session.cloudRefused = true;
    });
  }
  return p.cloud;
}
// The next two cloud pieces download while this one plays, never all at once
// (the voice's server allows a few dozen requests in five minutes).
function aheadCloud(r, i) {
  for (let k = i + 1; k <= i + 2 && k < r.plan.length; k++) if (r.plan[k].src === 'cloud') cloudAudio(r, r.plan[k]).catch(() => {});
}

function withLimit(promise, ms) {
  let t;
  return Promise.race([
    promise,
    new Promise((_, reject) => { t = setTimeout(() => reject(new Error('timeout')), ms); }),
  ]).finally(() => clearTimeout(t));
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
  // No word timings (a cloud piece, a clip voiced a sentence at a time): the
  // sentence being said is marked whole.
  if (!r.words[i]) { markPart(r, i); return; }
  r.words[i].then((w) => {
    if (run === r && r.i === i && !w) markPart(r, i);
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

function highlight(r, i, k, k2 = k) {
  const p = r.plan[i];
  const box = r.job.container?.(p.kind, p.option);
  if (!box || typeof CSS === 'undefined' || !CSS.highlights || typeof Highlight === 'undefined') return;
  const from = p.from || 0;
  const range = phraseRange(box, p.full || p.text, from + k, from + k2);
  if (!range) return;
  CSS.highlights.set(HIGHLIGHT, new Highlight(range));
  keepInView(range);
}

// A piece that is one sentence of a longer text: that sentence, marked whole.
function markPart(r, i) {
  const p = r.plan?.[i];
  if (!p || !(p.segs > 1)) return;
  const n = (p.text.match(/\S+/g) || []).length;
  if (n) highlight(r, i, 0, n - 1);
}

// The DOM range of the kth word of the spoken text inside box. The spoken
// text is the shown text with symbols said in words ("> 700" is "มากกว่า
// 700"), so the two are matched character by character (longest common
// subsequence) once per box and text.
const maps = new WeakMap();
export function phraseRange(box, spoken, k, k2 = k) {
  let m = maps.get(box);
  if (!m || m.spoken !== spoken || m.shown !== box.textContent) m = mapText(box, spoken);
  maps.set(box, m);
  const tok = m.tokens[k];
  const tok2 = m.tokens[Math.min(k2, m.tokens.length - 1)] || tok;
  if (!tok) return null;
  let a = -1, b = -1;
  for (let c = tok[0]; c < tok2[1]; c++) { const d = m.map[c]; if (d >= 0) { if (a < 0) a = d; b = d; } }
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
