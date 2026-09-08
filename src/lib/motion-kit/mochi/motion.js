export const TAU = Math.PI * 2;
const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const smooth = (v) => {
  v = clamp(v);
  return v * v * v * (v * (v * 6 - 15) + 10);
};
const envelope = (t, a, b, c, d) => smooth((t - a) / (b - a)) * (1 - smooth((t - c) / (d - c)));
const bell = (u) => Math.sin(Math.PI * clamp(u)) ** 2;
export const STATES = {
  idle: { duration: 4.8, loop: true, label: "อยู่เป็นเพื่อน" },
  wave: { duration: 3.6, loop: false, label: "ทักทาย" },
  walk: { duration: 1.2, loop: true, label: "เดิน" },
  run: { duration: 0.72, loop: true, label: "วิ่งเหยาะ" },
  hop: { duration: 2.4, loop: false, label: "กระโดด" },
  dance: { duration: 3.6, loop: true, label: "เต้นดุ๊กดิ๊ก" },
  stretch: { duration: 4.8, loop: false, label: "บิดขี้เกียจ" },
  yawn: { duration: 4.4, loop: false, label: "หาว" },
  sleepy: { duration: 5.4, loop: true, label: "งีบ" },
  wake: { duration: 4, loop: false, label: "ตื่นแล้ว" },
  pet: { duration: 3.6, loop: false, label: "ลูบหัว" },
  treat: { duration: 4.2, loop: false, label: "รับขนม" },
  bow: { duration: 3.2, loop: false, label: "ชวนเล่น" },
  shake: { duration: 2.8, loop: false, label: "สะบัดตัว" },
  curious: { duration: 4.8, loop: true, label: "สงสัย" },
  peek: { duration: 4.6, loop: true, label: "จ๊ะเอ๋" },
  float: { duration: 4.4, loop: true, label: "ลอยเบา ๆ" },
  hearts: { duration: 3.8, loop: false, label: "ส่งหัวใจ" },
  highfive: { duration: 3.4, loop: false, label: "ไฮไฟว์" },
  read: { duration: 5.6, loop: true, label: "อ่านหนังสือ" },
  happy: { duration: 3.2, loop: false, label: "ดีใจ" },
  correct: { duration: 3.4, loop: false, label: "ตอบถูก" },
  encourage: { duration: 4, loop: false, label: "ให้กำลังใจ" },
  think: { duration: 4.8, loop: true, label: "กำลังคิด" },
  loading: { duration: 3.6, loop: true, label: "รอโหลด" },
  celebrate: { duration: 4.4, loop: false, label: "ฉลอง" },
  breathe: { duration: 10, loop: true, label: "หายใจ" }
};
export const neutralPose = () => ({
  x: 0,
  y: 0,
  rz: 0,
  ry: 0,
  sx: 1,
  sy: 1,
  headZ: 0,
  headX: 0,
  headY: 0,
  eye: 1,
  armL: -0.08,
  armR: 0.08,
  armLX: 0,
  armRX: 0,
  armLZ: 0,
  armRZ: 0,
  legL: 0,
  legR: 0,
  legLiftL: 0,
  legLiftR: 0,
  earL: 0,
  earR: 0,
  tail: 0,
  scarf: 0,
  book: 0,
  spark: 0,
  question: 0,
  zzz: 0,
  heart: 0,
  check: 0,
  gaze: 0,
  gazeY: 0,
  mouthOpen: 0,
  breath: 0,
  thinkArm: 0,
  bookTilt: 0
});
export const POSE_KEYS = Object.keys(neutralPose());
export function poseAt(state = "idle", seconds = 0, { clock = seconds, gazeX = 0, gazeY = 0, gaitPhase, loopPhase } = {}) {
  const meta = STATES[state] || STATES.idle;
  const t = meta.loop ? (seconds % meta.duration + meta.duration) % meta.duration : clamp(seconds, 0, meta.duration), u = t / meta.duration;
  const a = TAU * u, s = Math.sin(a), c = Math.cos(a), act = envelope(u, 0, 0.16, 0.78, 1), p = neutralPose();
  const slow = loopPhase === void 0 ? clock * TAU / 4.8 : loopPhase * TAU, blinkU = loopPhase === void 0 ? (clock + 0.7) % 4.7 / 4.7 : loopPhase;
  p.eye = 1 - 0.96 * bell((blinkU - 0.79) / 0.058);
  p.headZ = 0.018 * Math.sin(slow);
  p.y = 9e-3 * (1 - Math.cos(slow));
  p.sy = 1 + 7e-3 * Math.sin(slow);
  p.sx = 1 - 35e-4 * Math.sin(slow);
  p.earL = 0.026 * Math.sin(slow - 0.65);
  p.earR = -0.024 * Math.sin(slow - 1);
  p.tail = 0.18 * Math.sin(loopPhase === void 0 ? clock * TAU / 1.65 : loopPhase * TAU * 3);
  p.scarf = 0.025 * Math.sin(slow - 0.8);
  p.gaze = clamp(gazeX, -1, 1) * 0.045;
  p.gazeY = clamp(gazeY, -1, 1) * 0.018;
  p.headY = clamp(gazeX, -1, 1) * 0.16;
  p.headX = -clamp(gazeY, -1, 1) * 0.035;
  if (state === "wave") {
    p.armR += act * (2.12 + 0.22 * Math.sin(a * 3));
    p.armRZ = 0.14 * act;
    p.headZ -= 0.08 * act;
    p.tail += 0.22 * Math.sin(a * 4) * act;
  }
  if (state === "walk" || state === "run") {
    const g = gaitPhase ?? a, fast = state === "run", stride = fast ? 0.76 : 0.45, l = Math.sin(g), r = -l;
    p.legL = stride * l;
    p.legR = stride * r;
    p.legLiftL = 0.065 * Math.max(0, l) ** 2;
    p.legLiftR = 0.065 * Math.max(0, r) ** 2;
    p.armL = -0.08 - stride * 0.62 * l;
    p.armR = 0.08 + stride * 0.62 * l;
    p.y = (fast ? 0.095 : 0.038) * (1 - Math.cos(2 * g)) * 0.5;
    p.rz = 0.035 * l;
    p.headZ = -0.025 * l;
    p.headX = fast ? 0.06 : 0;
    p.earL = 0.11 * Math.sin(g - 0.65);
    p.earR = -0.075 * Math.sin(g - 0.9);
    p.tail = 0.35 * Math.sin(g * 2 - 0.6);
    p.scarf = 0.1 * Math.sin(g - 0.6);
    p.sy = 1 - 0.014 * Math.cos(g * 2);
    p.sx = 1 + 7e-3 * Math.cos(g * 2);
  }
  if (["hop", "happy", "celebrate"].includes(state)) {
    const h = state === "celebrate" ? bell((u - 0.2) / 0.56) : bell((u - 0.22) / 0.45), squat = bell((u - 0.02) / 0.2) + bell((u - 0.65) / 0.2);
    p.y = (state === "celebrate" ? 0.46 : 0.32) * h;
    p.sy = 1 - 0.075 * squat + 0.035 * h;
    p.sx = 1 + 0.038 * squat - 0.018 * h;
    p.armL -= h * (state === "celebrate" ? 2 : 0.7);
    p.armR += h * (state === "celebrate" ? 2 : 0.7);
    p.legL = -0.12 * h;
    p.legR = 0.12 * h;
    p.earL = 0.15 * Math.sin(a * 2 - 0.5) * act;
    p.earR = -0.12 * Math.sin(a * 2 - 0.8) * act;
    p.mouthOpen = 0.75 * act;
    p.spark = state === "celebrate" ? act : 0;
  }
  if (state === "dance") {
    p.x = 0.1 * s;
    p.rz = 0.11 * s;
    p.headZ = -0.08 * s;
    p.y = 0.055 * (1 - Math.cos(a * 2));
    p.armL = -0.7 - 0.45 * Math.sin(a + 0.5);
    p.armR = 0.7 + 0.45 * Math.sin(a + 0.5);
    p.legL = 0.26 * s;
    p.legR = -0.26 * s;
    p.mouthOpen = 0.65;
    p.earL = 0.14 * Math.sin(a - 0.5);
    p.earR = -0.1 * Math.sin(a - 0.8);
    p.tail = 0.5 * Math.sin(a * 2);
  }
  if (state === "stretch") {
    p.sy = 1 + 0.1 * act;
    p.sx = 1 - 0.035 * act;
    p.armL -= 2.5 * act;
    p.armR += 2.5 * act;
    p.headZ = 0.085 * Math.sin(a) * act;
    p.headX = -0.08 * act;
    p.eye = Math.min(p.eye, 1 - 0.82 * act);
  }
  if (state === "yawn") {
    p.headX = -0.12 * act;
    p.headZ = 0.08 * act;
    p.eye = Math.min(p.eye, 1 - 0.89 * act);
    p.mouthOpen = act;
    p.armR += 2 * act;
    p.armRX = -0.5 * act;
    p.sy += 0.03 * act;
  }
  if (state === "sleepy") {
    p.headZ = 0.15;
    p.headX = 0.13;
    p.eye = 0.07;
    p.y = 0.012 * (1 - c);
    p.sy = 1 + 0.014 * (1 - c);
    p.zzz = 0.8 + 0.2 * s;
    p.tail = 0.025 * s;
    p.gaze = 0;
    p.gazeY = 0;
  }
  if (state === "wake") {
    const asleep = 1 - smooth(u / 0.36);
    p.eye = Math.min(p.eye, 1 - 0.93 * asleep);
    p.headZ = 0.15 * asleep;
    p.headX = 0.13 * asleep;
    p.armL -= 1.4 * act;
    p.armR += 1.4 * act;
    p.sy += 0.06 * act;
    p.zzz = 0.8 * asleep;
  }
  if (state === "pet") {
    p.headZ = 0.1 * Math.sin(a) * act;
    p.headX = -0.06 * act;
    p.eye = Math.min(p.eye, 1 - 0.87 * act);
    p.tail = 0.55 * Math.sin(a * 5) * act;
    p.heart = 0.8 * act;
    p.mouthOpen = 0.35 * act;
  }
  if (state === "treat") {
    const sniff = envelope(u, 0, 0.16, 0.3, 0.5), chew = envelope(u, 0.3, 0.5, 0.75, 0.95);
    p.headX = 0.14 * sniff;
    p.headZ = 0.045 * Math.sin(a * 4) * chew;
    p.mouthOpen = chew * (0.48 + 0.25 * Math.sin(a * 7));
    p.armL = -0.08 - 0.55 * act;
    p.armR = 0.08 + 0.55 * act;
    p.armLX = -0.55 * act;
    p.armRX = -0.55 * act;
    p.heart = chew;
    p.tail = 0.55 * Math.sin(a * 4) * act;
  }
  if (state === "bow") {
    p.headX = 0.3 * act;
    p.headZ = -0.05 * act;
    p.sy = 1 - 0.13 * act;
    p.sx = 1 + 0.035 * act;
    p.armL = -0.08 - 0.4 * act;
    p.armR = 0.08 + 0.4 * act;
    p.armLX = -0.45 * act;
    p.armRX = -0.45 * act;
    p.tail = 0.65 * Math.sin(a * 5) * act;
  }
  if (state === "shake") {
    p.rz = 0.12 * Math.sin(a * 6) * act;
    p.headY = 0.23 * Math.sin(a * 6 - 0.45) * act;
    p.headZ = 0.1 * Math.sin(a * 6 - 0.3) * act;
    p.earL = 0.3 * Math.sin(a * 6 - 1) * act;
    p.earR = -0.22 * Math.sin(a * 6 - 1.3) * act;
    p.scarf = 0.2 * Math.sin(a * 6 - 1.2) * act;
    p.eye = Math.min(p.eye, 1 - 0.85 * act);
  }
  if (state === "curious" || state === "think") {
    p.headZ = 0.12 + 0.035 * s;
    p.headY += 0.04 * s;
    p.headX = -0.06;
    p.question = 0.85 + 0.15 * s;
    p.tail = 0.08 * s;
    if (state === "think") {
      p.armR = 2.9 + 0.04 * s;
      p.armRZ = 0.6;
      p.thinkArm = 1;
    }
  }
  if (state === "peek") {
    const hide = (1 - c) * 0.5;
    p.y = -0.35 * hide;
    p.headZ = 0.13 * s;
    p.armL = -0.08 - 2.65 * hide;
    p.armR = 0.08 + 2.65 * hide;
    p.armLX = -0.2 * hide;
    p.armRX = -0.2 * hide;
    p.eye = Math.min(p.eye, 1 - 0.93 * hide);
    p.mouthOpen = 0.5 * (1 - hide);
  }
  if (state === "float") {
    p.y = 0.16 + 0.095 * s;
    p.rz = 0.05 * Math.sin(a - 0.5);
    p.armL = -0.42 - 0.06 * s;
    p.armR = 0.42 + 0.06 * s;
    p.legL = 0.15 * Math.sin(a - 0.8);
    p.legR = -0.15 * Math.sin(a - 0.8);
    p.earL = 0.09 * Math.sin(a - 1);
    p.earR = -0.09 * Math.sin(a - 1.2);
    p.spark = 0.7;
  }
  if (state === "hearts" || state === "encourage") {
    p.headZ = 0.11 * act;
    p.headX = 0.04 * act;
    p.armL -= 0.72 * act;
    p.armR += 0.72 * act;
    p.armLX = -0.3 * act;
    p.armRX = -0.3 * act;
    p.heart = act;
    p.eye = Math.min(p.eye, 1 - 0.25 * act);
    p.mouthOpen = 0.35 * act;
  }
  if (state === "highfive" || state === "correct") {
    p.armR += 2.3 * act;
    p.armRZ = 0.22 * act;
    p.headZ = -0.07 * act;
    p.y = 0.045 * act;
    p.mouthOpen = 0.55 * act;
    p.check = state === "correct" ? act : 0;
    p.tail += 0.25 * Math.sin(a * 4) * act;
  }
  if (state === "read") {
    p.book = 1;
    p.bookTilt = 0.025 * s;
    p.headX = 0.14 + 0.025 * s;
    p.armL = 0.5;
    p.armR = -0.5;
    p.armLX = p.armRX = -0.8;
    p.armLZ = p.armRZ = 0.15;
    p.gaze = 0.025 * Math.sin(a);
    p.gazeY = -0.018;
    p.eye = Math.min(p.eye, 0.88);
    p.tail = 0.09 * s;
  }
  if (state === "loading") {
    p.headZ = 0.055 * s;
    p.armR = 0.3 + 0.11 * s;
    p.armL = -0.3 + 0.11 * s;
    p.spark = 0.75;
    p.y = 0.018 * (1 - c);
  }
  if (state === "breathe") {
    const phase = seconds % 10, b = phase < 4 ? smooth(phase / 4) : 1 - smooth((phase - 4) / 6);
    p.sy = 1 + 0.06 * b;
    p.sx = 1 + 0.022 * b;
    p.eye = 0.075;
    p.armR = 0.18 + 0.17 * b;
    p.armL = -p.armR;
    p.breath = b;
    p.y = 0.018 * b;
  }
  p.eye = clamp(p.eye, 0.055, 1);
  return p;
}
export function spring(value, velocity, target, omega, dt) {
  const x = value - target, j = velocity + omega * x, e = Math.exp(-omega * dt);
  return [target + (x + j * dt) * e, (velocity - omega * j * dt) * e];
}
const omegaFor = (k) => k === "eye" ? 55 : k.startsWith("leg") ? 35 : k.startsWith("ear") || k === "scarf" ? 15 : k === "tail" ? 23 : k === "y" ? 31 : 22;
export function createMotion({ state = "idle", speed = 1, onComplete = () => {
} } = {}) {
  if (!STATES[state]) throw new RangeError(`Unknown Mochi state: ${state}`);
  let current = state, elapsed = 0, clock = 0, accumulator = 0, loopOverride, gaze = { x: 0, y: 0 }, gaitPhase, finished = false;
  let value = poseAt(state, 0), previous = { ...value }, velocity = Object.fromEntries(POSE_KEYS.map((k) => [k, 0]));
  const step = 1 / 120;
  function setState(next, { loop, restart = true } = {}) {
    if (!STATES[next]) throw new RangeError(`Unknown Mochi state: ${next}`);
    if (next === current && !restart) return;
    current = next;
    elapsed = 0;
    loopOverride = loop;
    finished = false;
  }
  function simulate() {
    previous = { ...value };
    clock += step;
    elapsed += step * speed;
    const meta = STATES[current];
    if (!(loopOverride ?? meta.loop) && elapsed >= meta.duration && !finished) {
      const done = current;
      finished = true;
      setState("idle");
      onComplete(done);
    }
    const sample = loopOverride ?? STATES[current].loop ? elapsed % STATES[current].duration : elapsed;
    const goal = poseAt(current, sample, { clock, gazeX: gaze.x, gazeY: gaze.y, gaitPhase });
    for (const k of POSE_KEYS) [value[k], velocity[k]] = spring(value[k], velocity[k], goal[k], omegaFor(k), step);
  }
  return {
    setState,
    setSpeed(v) {
      speed = clamp(Number(v) || 1, 0.25, 2);
    },
    setGaze(x, y) {
      gaze = { x: clamp(x, -1, 1), y: clamp(y, -1, 1) };
    },
    setGaitPhase(v) {
      gaitPhase = v;
    },
    advance(dt) {
      accumulator += clamp(Number(dt) || 0, 0, 0.12);
      while (accumulator + 1e-10 >= step) {
        simulate();
        accumulator -= step;
      }
      const a = clamp(accumulator / step);
      return Object.fromEntries(POSE_KEYS.map((k) => [k, previous[k] + (value[k] - previous[k]) * a]));
    },
    pose() {
      return { ...value };
    },
    seek(seconds) {
      elapsed = Math.max(0, seconds);
      clock = elapsed;
      accumulator = 0;
      value = poseAt(current, elapsed, { clock });
      previous = { ...value };
      velocity = Object.fromEntries(POSE_KEYS.map((k) => [k, 0]));
      return { ...value };
    },
    get state() {
      return current;
    },
    get time() {
      return elapsed;
    },
    get clock() {
      return clock;
    },
    get velocity() {
      return { ...velocity };
    }
  };
}
