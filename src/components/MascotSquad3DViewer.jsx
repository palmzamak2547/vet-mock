import { useCallback, useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { useMotionPreferences } from '../hooks/useMotionPreferences.js';
import { MOCHI_BUDDY, buddyById, buddyModel } from '../lib/buddy.js';
import { createPoseClips, fitFrame, ringPoints } from '../lib/buddy-3d.js';
import MascotStill from './MascotStill.jsx';
import '../styles-buddy.css';

/**
 * MascotSquad3DViewer — one study buddy in 3D.
 *
 * The screen says which buddy (`id`; Results still passes `initialId`) and
 * owns the choice: the Mochi page puts the buddy row above it, Pomodoro and
 * Results show the buddy they celebrate with. A buddy change swaps the model
 * inside the same renderer and the newcomer waves hello.
 *
 *   - Drag to spin with damping and inertia (touch: sideways only, so an
 *     up-down swipe still scrolls the page)
 *   - Zoom with ctrl/cmd + wheel, a trackpad pinch, or the wheel once the
 *     stage has been clicked; double-click or "กลับด้านหน้า" faces it again
 *   - Head tracking toward a mouse, added on top of the playing clip
 *   - Idle, wave and celebrate clips; confetti on celebrate (none under
 *     reduced motion, where idle holds the rest pose)
 *
 * Framing: the camera distance is solved per model and per stage size
 * (lib/buddy-3d.js fitFrame), so a narrow phone, a rotated phone and a tall
 * or small mascot all fit with the same margin.
 *
 * Lifecycle: one WebGLRenderer per mount. A late model after a newer pick is
 * thrown away; the shown model is replaced only when the next one is ready,
 * so the pedestal is never empty. Everything is disposed on swap and unmount
 * and the GL context is released. Drawing stops off-screen, in a hidden tab,
 * and once nothing moves (reduced motion settles to a still frame); a 120 Hz
 * screen draws at 60. A lost GPU context (a phone reclaiming memory while the
 * app was in the background) shows the picture until the context returns;
 * a device that cannot draw 3D at all, or a model that fails, shows the
 * picture with a short note.
 */

// The figure is drawn about 330 CSS px tall with MSAA and no textures. Past
// 1.5 device pixels per CSS pixel the soft vinyl edges look the same, while the
// fill cost grows with the square: DPR 2 draws 1.78x and DPR 3 draws 4x the
// pixels of 1.5, on the phones whose battery it drains. A phone that reports
// 2 GB or less draws at 1 (0.44x the pixels of 1.5) with a smaller shadow map.
const MAX_PIXEL_RATIO = 1.5;
const LOW_MEMORY_GB = 2;
const CONFETTI_MS = 2000;
const FOV = 30;
// Pedestal radius (its cylinder is 0.55 top, 0.58 bottom, 0.035 tall).
const PEDESTAL_R = 0.58;
// The camera looks 2 degrees down at the figure's middle. With the figure
// about 0.9 tall at about 2.4 away, the pedestal top then reads as an
// ellipse of minor/major ~0.22, the view the stage was tuned with
// (camera 0.55 up, 2.4 back), now kept for every model and stage.
const ELEVATION = THREE.MathUtils.degToRad(2);
// Mochi's own model stands about 3.3 units tall; the clinic mascots follow
// the 0.80-0.90 m blueprint (docs/squad-3d-blueprints.md).
const MOCHI_HEIGHT = 0.86;
// A model slower than this to arrive shows the new buddy's picture meanwhile.
const SLOW_SWAP_MS = 250;
// 60 fps is enough for a figure; a 120 Hz phone skips every other frame.
const MIN_FRAME_S = 1 / 60 - 0.002;
// After any change the loop runs at least this long, so a 0.25 s cross-fade
// into a held (reduced motion) idle finishes instead of freezing half-way.
const KEEP_ALIVE_MS = 400;
// A flick keeps turning and slows exponentially: v(t) = v0 e^(-t/tau). The
// spin was tuned as "keep 92% per 60 Hz frame", so tau = -1 / (60 ln 0.92)
// = 0.2 s, and a flick travels v0 * tau in all. Velocity is measured in
// rad/s from the pointer's own timestamps, so a 120 Hz screen (half the
// distance per event) flicks as far as a 60 Hz one. Capped at two turns a
// second; a finger resting 80 ms before lifting flicks nothing.
const FLING_TAU = 0.2;
const FLING_MAX = 4 * Math.PI;
const FLING_REST_MS = 80;
const YAW_PER_PX = 0.008;
const PITCH_PER_PX = 0.005;
// A tap, not a drag (under 6 px and 350 ms), says hi: the buddy waves.
const TAP_SLOP_PX = 6;
const TAP_MS = 350;

// The motion was tuned as per-frame factors at 60 fps. These apply the same
// factors per elapsed time, so a 120 Hz phone neither spins nor settles twice
// as fast.
const perFrame = (factor, delta) => 1 - Math.pow(1 - factor, delta * 60);
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

function disposeTree(root) {
  root?.traverse?.((obj) => {
    // Lights own their shadow map render target.
    if (obj.isLight) obj.dispose?.();
    obj.geometry?.dispose?.();
    const mats = obj.material ? (Array.isArray(obj.material) ? obj.material : [obj.material]) : [];
    for (const mat of mats) {
      for (const value of Object.values(mat)) if (value?.isTexture) value.dispose();
      mat.dispose?.();
    }
  });
}

function themeColor(el, name) {
  try {
    const value = getComputedStyle(el).getPropertyValue(name).trim();
    return /^(#|rgb|hsl)/i.test(value) ? value : null;
  } catch {
    return null;
  }
}

function lowMemory() {
  try {
    const gb = navigator?.deviceMemory;
    return typeof gb === 'number' && gb > 0 && gb <= LOW_MEMORY_GB;
  } catch {
    return false;
  }
}

const newTrack = () => ({ yaw: 0, pitch: 0, applied: false, offset: new THREE.Quaternion(), inverse: new THREE.Quaternion(), euler: new THREE.Euler(0, 0, 0, 'YXZ') });
const TAU = Math.PI * 2;
// How far from facing front (radians, either way round) before the
// "กลับด้านหน้า" control appears.
const OFF_FRONT = 0.12;
const angleFromFront = (y) => Math.abs(((y % TAU) + TAU + Math.PI) % TAU - Math.PI);

async function buildMochiModel() {
  const [{ buildMochi }, { poseAt, STATES }] = await Promise.all([
    import('../lib/motion-kit/mochi/model-3d.js'),
    import('../lib/motion-kit/mochi/motion.js'),
  ]);
  const model = buildMochi({ detail: 20 });
  const root = model.root;
  // Measured by the body alone: the sparkle, heart and Z effects float
  // around it, resting at a thousandth of their size.
  const body = root.getObjectByName('Body') || root;
  root.updateMatrixWorld(true);
  const box = new THREE.Box3().setFromObject(body);
  const height = Math.max(0.001, box.max.y - box.min.y);
  root.scale.setScalar(MOCHI_HEIGHT / height);
  const { mixer, actions } = createPoseClips(model, poseAt, STATES);
  return { root, mixer, actions, frameBy: body };
}

export default function MascotSquad3DViewer({ id, initialId, initialAction = 'idle', greet = true }) {
  const { reduced } = useMotionPreferences();
  const wantedId = buddyById(id) ? id : buddyById(initialId) ? initialId : MOCHI_BUDDY.id;
  const character = buddyById(wantedId) || MOCHI_BUDDY;
  const [currentAction, setCurrentAction] = useState('idle');
  const [modelState, setModelState] = useState('loading');
  // Which buddy the model on stage is (null before the first arrives).
  const [shownId, setShownId] = useState(null);
  const [slow, setSlow] = useState(false);
  const [glFailed, setGlFailed] = useState(false);
  const [lost, setLost] = useState(false);
  const [offFront, setOffFront] = useState(false);
  const [host, setHost] = useState(null);
  const [stage, setStage] = useState(null);
  const [finePointer] = useState(() => {
    try { return Boolean(window.matchMedia?.('(pointer: fine)').matches); } catch { return false; }
  });

  const reducedRef = useRef(reduced);
  const actionsRef = useRef({});
  const celebratingRef = useRef(false);
  const confettiTimerRef = useRef(0);
  const wakeRef = useRef(() => {});
  // A preference changed while the viewer is open applies at once.
  useEffect(() => {
    reducedRef.current = reduced;
    if (actionsRef.current.idle) actionsRef.current.idle.paused = reduced;
    if (reduced) {
      clearTimeout(confettiTimerRef.current);
      confettiTimerRef.current = 0;
      celebratingRef.current = false;
    }
    wakeRef.current();
  }, [reduced]);
  // The first model plays the action the screen asked for (Pomodoro and
  // Results celebrate); a buddy picked later waves hello. Read through refs:
  // a screen re-rendering with a new prop value must not reload the model.
  const firstRef = useRef(true);
  const initialActionRef = useRef(initialAction);
  const greetRef = useRef(greet);
  initialActionRef.current = initialAction;
  greetRef.current = greet;
  const headRef = useRef(null);
  const trackRef = useRef(null);
  if (!trackRef.current) trackRef.current = newTrack();
  const mixerRef = useRef(null);
  const shownRef = useRef(null);

  // Interaction controls
  const mouseTargetRef = useRef({ x: 0, y: 0 });
  const isDraggingRef = useRef(false);
  const dragIsTouchRef = useRef(false);
  const prevPointerRef = useRef({ x: 0, y: 0, t: 0 });
  const downRef = useRef({ x: 0, y: 0, t: 0, moved: true });
  const readyRef = useRef(false);
  const rotTargetRef = useRef({ x: 0, y: 0 });
  const rotVelocityRef = useRef({ x: 0, y: 0 });
  // Zoom is a factor on the fitted distance: 1 is the framed view.
  const zoomRef = useRef(1);

  const stopConfetti = useCallback(() => {
    clearTimeout(confettiTimerRef.current);
    confettiTimerRef.current = 0;
    celebratingRef.current = false;
  }, []);

  const startConfetti = useCallback(() => {
    if (reducedRef.current) return;
    clearTimeout(confettiTimerRef.current);
    celebratingRef.current = true;
    confettiTimerRef.current = setTimeout(() => {
      celebratingRef.current = false;
      confettiTimerRef.current = 0;
    }, CONFETTI_MS);
  }, []);

  // Wave and celebrate play once and hand back to idle (the mixer's
  // 'finished' listener is added per model, below).
  const playClip = useCallback((clipName) => {
    setCurrentAction(clipName);
    const actions = actionsRef.current;
    const target = actions[clipName];
    if (!target || !mixerRef.current) return;
    for (const [key, action] of Object.entries(actions)) {
      if (key !== clipName) action.fadeOut(0.25);
    }
    target.reset();
    if (clipName === 'idle') {
      target.setLoop(THREE.LoopRepeat, Infinity);
      // Reduced motion holds the rest pose instead of the breathing loop.
      target.paused = reducedRef.current;
    } else {
      target.setLoop(THREE.LoopOnce, 1);
      target.clampWhenFinished = true;
    }
    target.fadeIn(0.25).play();
    if (clipName === 'celebrate') startConfetti();
    wakeRef.current();
  }, [startConfetti]);

  // Whether the view will come to rest away from the front: judged at the
  // flick's landing angle (target + v * tau), not where the finger left it.
  const noteFront = () => {
    const yaw = rotTargetRef.current.y + rotVelocityRef.current.y * FLING_TAU;
    const pitch = rotTargetRef.current.x + rotVelocityRef.current.x * FLING_TAU;
    setOffFront(angleFromFront(yaw) > OFF_FRONT || Math.abs(pitch) > OFF_FRONT || Math.abs(zoomRef.current - 1) > 0.05);
  };
  const pointerTime = (e) => (Number.isFinite(e?.timeStamp) && e.timeStamp > 0 ? e.timeStamp : performance.now());

  // Pointer handlers: orbit and head tracking
  const handlePointerDown = (e) => {
    const el = e.currentTarget || host;
    isDraggingRef.current = true;
    dragIsTouchRef.current = e.pointerType === 'touch';
    prevPointerRef.current = { x: e.clientX, y: e.clientY, t: pointerTime(e) };
    downRef.current = { x: e.clientX, y: e.clientY, t: pointerTime(e), moved: false };
    rotVelocityRef.current = { x: 0, y: 0 };
    try { el?.setPointerCapture?.(e.pointerId); } catch { /* not capturable */ }
    // A click gives the stage focus, which is what lets the plain wheel zoom.
    if (e.pointerType !== 'touch') {
      try { el?.focus?.({ preventScroll: true }); } catch { /* not focusable */ }
    }
    if (el?.style) el.style.cursor = 'grabbing';
    wakeRef.current();
  };

  const handlePointerMove = (e) => {
    const el = e.currentTarget || host;
    if (!el) return;
    if (isDraggingRef.current) {
      const prev = prevPointerRef.current;
      const t = pointerTime(e);
      const down = downRef.current;
      if (!down.moved && Math.hypot(e.clientX - down.x, e.clientY - down.y) > TAP_SLOP_PX) down.moved = true;
      const dt = Math.max(0.001, (t - prev.t) / 1000);
      const yaw = (e.clientX - prev.x) * YAW_PER_PX;
      // On touch only the sideways part turns the model; vertical swipes
      // belong to the page (touch-action: pan-y).
      const tilt = dragIsTouchRef.current ? 0 : (e.clientY - prev.y) * PITCH_PER_PX;
      prevPointerRef.current = { x: e.clientX, y: e.clientY, t };
      rotTargetRef.current.y += yaw;
      rotTargetRef.current.x = clamp(rotTargetRef.current.x + tilt, -0.35, 0.35);
      // rad/s, smoothed over the last few events so one jittery sample
      // cannot decide the flick.
      const v = rotVelocityRef.current;
      rotVelocityRef.current = {
        x: clamp(0.6 * (tilt / dt) + 0.4 * v.x, -FLING_MAX, FLING_MAX),
        y: clamp(0.6 * (yaw / dt) + 0.4 * v.y, -FLING_MAX, FLING_MAX),
      };
    } else {
      const rect = el.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouseTargetRef.current = { x: clamp(x, -1, 1), y: clamp(y, -1, 1) };
    }
    wakeRef.current();
  };

  const handlePointerUp = (e) => {
    const wasDragging = isDraggingRef.current;
    isDraggingRef.current = false;
    // A finger that came to rest before lifting does not flick, and under
    // reduced motion nothing keeps spinning after the finger lifts.
    if (wasDragging && (reducedRef.current || pointerTime(e) - prevPointerRef.current.t > FLING_REST_MS)) rotVelocityRef.current = { x: 0, y: 0 };
    const el = e?.currentTarget || host;
    if (el?.style) el.style.cursor = 'grab';
    // A poke says hi: a tap on the buddy (not a turn) makes it wave.
    const down = downRef.current;
    if (wasDragging && !down.moved && pointerTime(e) - down.t < TAP_MS && readyRef.current) playClip('wave');
    down.moved = true;
    noteFront();
    wakeRef.current();
  };

  // Facing front again glides back, or under reduced motion is there at once.
  const snapRef = useRef(false);
  const handleResetView = () => {
    rotTargetRef.current = { x: 0, y: 0 };
    rotVelocityRef.current = { x: 0, y: 0 };
    zoomRef.current = 1;
    mouseTargetRef.current = { x: 0, y: 0 };
    snapRef.current = reducedRef.current;
    setOffFront(false);
    wakeRef.current();
  };

  // The stage: renderer, camera, lights, pedestal and confetti. Built once
  // per mount, on an element React renders no children into.
  useEffect(() => {
    if (!host) return undefined;
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
    } catch {
      // three r163+ needs WebGL2. Old iOS, blocked GPUs and some in-app
      // browsers refuse it; show the still picture, not the crash panel.
      setGlFailed(true);
      return undefined;
    }

    const small = lowMemory();
    const width = host.clientWidth || 320;
    const height = host.clientHeight || 330;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(FOV, width / height, 0.05, 40);
    // Framing before any model: the pedestal alone, as if the figure were the
    // blueprint's 0.85 m. Replaced by the model's own frame when it arrives.
    const frame = { points: [...ringPoints(PEDESTAL_R, 0), ...ringPoints(PEDESTAL_R, -0.035), ...ringPoints(0.3, 0.85)], distance: 2.4, target: new THREE.Vector3(0, 0.45, 0), shown: 2.4 };
    const reframe = () => {
      const fitted = fitFrame({ points: frame.points, fov: FOV, aspect: camera.aspect, elevation: ELEVATION });
      frame.distance = fitted.distance;
      frame.target.copy(fitted.target);
    };
    const placeCamera = (d) => {
      camera.position.set(frame.target.x, frame.target.y + Math.sin(ELEVATION) * d, frame.target.z + Math.cos(ELEVATION) * d);
      camera.lookAt(frame.target);
    };
    reframe();
    frame.shown = frame.distance;
    placeCamera(frame.shown);

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, small ? 1 : MAX_PIXEL_RATIO));
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    const canvas = renderer.domElement;
    canvas.style.display = 'block';
    host.appendChild(canvas);

    // Studio toy showcase lighting
    scene.add(new THREE.AmbientLight(0xfff8f0, 0.7));
    scene.add(new THREE.HemisphereLight(0xfffbf0, 0xdcfce7, 0.5));
    const keyLight = new THREE.DirectionalLight(0xfff5eb, 2.0);
    keyLight.position.set(1.6, 2.6, 1.8);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = small ? 512 : 1024;
    keyLight.shadow.mapSize.height = small ? 512 : 1024;
    keyLight.shadow.bias = -0.0005;
    keyLight.shadow.radius = 3;
    scene.add(keyLight);
    const fillLight = new THREE.DirectionalLight(0xdbeafe, 1.0);
    fillLight.position.set(-1.8, 1.5, 1.0);
    scene.add(fillLight);
    // Rim light for the glowing art-toy outline
    const rimLight = new THREE.DirectionalLight(0xffffff, 2.2);
    rimLight.position.set(0.6, 2.0, -2.0);
    scene.add(rimLight);

    // Display pedestal (ฐานวางฟิกเกอร์) and its accent ring take the theme's
    // surface and border colours, so the stage is dark in dark mode.
    const pedMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.35, metalness: 0.05 });
    const pedestal = new THREE.Mesh(new THREE.CylinderGeometry(0.55, PEDESTAL_R, 0.035, 36), pedMat);
    pedestal.position.y = -0.018;
    pedestal.receiveShadow = true;
    scene.add(pedestal);
    const ringGeo = new THREE.TorusGeometry(0.555, 0.004, 12, 36);
    ringGeo.rotateX(Math.PI / 2);
    const ringMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.3, metalness: 0.2 });
    scene.add(new THREE.Mesh(ringGeo, ringMat));

    // Ground shadow disk
    const shadowPlane = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 1.4), new THREE.ShadowMaterial({ opacity: 0.22 }));
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = 0.002;
    shadowPlane.receiveShadow = true;
    scene.add(shadowPlane);

    // Confetti for the celebration
    const pCount = 45;
    const pGeo = new THREE.BufferGeometry();
    const pPositions = new Float32Array(pCount * 3);
    const pVelocities = [];
    for (let i = 0; i < pCount; i++) {
      pPositions[i * 3] = (Math.random() - 0.5) * 0.6;
      pPositions[i * 3 + 1] = 0.4 + Math.random() * 0.4;
      pPositions[i * 3 + 2] = (Math.random() - 0.5) * 0.6;
      pVelocities.push({
        x: (Math.random() - 0.5) * 0.015,
        y: 0.01 + Math.random() * 0.02,
        z: (Math.random() - 0.5) * 0.015,
      });
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));
    const pMat = new THREE.PointsMaterial({ color: 0xffd166, size: 0.035, transparent: true, opacity: 0 });
    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    const modelGroup = new THREE.Group();
    scene.add(modelGroup);

    const stageObj = { modelGroup, loader: new GLTFLoader(), disposed: false, frameModel: null, wake: null };

    // A model arrives (not yet in the turned group, so its box is its own):
    // stand it on the pedestal, centre it, and frame it. The frame jumps with
    // the model: the newcomer appears at once, the camera with it.
    stageObj.frameModel = (root, measure = root) => {
      root.updateMatrixWorld(true);
      const box = new THREE.Box3().setFromObject(measure);
      if (!Number.isFinite(box.min.y)) return;
      root.position.y -= box.min.y;
      root.position.x -= (box.min.x + box.max.x) / 2;
      root.position.z -= (box.min.z + box.max.z) / 2;
      root.updateMatrixWorld(true);
      box.setFromObject(measure);
      // A circle that holds the figure seen from above, so turning it with a
      // finger never pushes it out of frame.
      const r = Math.min(PEDESTAL_R * 1.4, Math.max(Math.abs(box.min.x), Math.abs(box.max.x), Math.abs(box.min.z), Math.abs(box.max.z)) * Math.SQRT2);
      frame.points = [
        ...ringPoints(PEDESTAL_R, 0), ...ringPoints(PEDESTAL_R, -0.035),
        ...ringPoints(r, box.max.y), ...ringPoints(r, box.max.y * 0.5),
      ];
      reframe();
      frame.shown = frame.distance * zoomRef.current;
    };

    let dirty = true;
    const step = (delta) => {
      const head = headRef.current;
      const track = trackRef.current;
      // Take last frame's tracking offset off before the mixer runs. three's
      // mixer skips writing a value that did not change since its last write,
      // so an offset left on an unchanged pose would stack up every frame.
      if (head && track.applied) head.quaternion.multiply(track.inverse);
      track.applied = false;
      mixerRef.current?.update(delta);

      let moving = false;
      // 360 orbit damping and rotation
      if (!isDraggingRef.current) {
        // Exact over the frame: x += v tau (1 - e^(-dt/tau)), v *= e^(-dt/tau).
        const v = rotVelocityRef.current;
        const decay = Math.exp(-delta / FLING_TAU);
        rotTargetRef.current.y += v.y * FLING_TAU * (1 - decay);
        rotTargetRef.current.x = clamp(rotTargetRef.current.x + v.x * FLING_TAU * (1 - decay), -0.35, 0.35);
        v.y *= decay;
        v.x *= decay;
        // Below a thousandth of a radian a second the turn is invisible.
        if (Math.abs(v.y) + Math.abs(v.x) > 1e-3) moving = true; else { v.y = 0; v.x = 0; }
      } else {
        moving = true;
      }
      const snap = snapRef.current;
      snapRef.current = false;
      const rotAlpha = snap ? 1 : perFrame(0.15, delta);
      modelGroup.rotation.y = THREE.MathUtils.lerp(modelGroup.rotation.y, rotTargetRef.current.y, rotAlpha);
      modelGroup.rotation.x = THREE.MathUtils.lerp(modelGroup.rotation.x, rotTargetRef.current.x, rotAlpha);
      if (Math.abs(modelGroup.rotation.y - rotTargetRef.current.y) + Math.abs(modelGroup.rotation.x - rotTargetRef.current.x) > 1e-4) moving = true;

      // Smooth camera zoom and reframing
      const want = frame.distance * zoomRef.current;
      frame.shown = THREE.MathUtils.lerp(frame.shown, want, snap ? 1 : perFrame(0.1, delta));
      if (Math.abs(frame.shown - want) > 1e-4) moving = true; else frame.shown = want;
      placeCamera(frame.shown);

      // Head tracking, applied on top of whatever the clip wrote this frame
      if (head) {
        if (!isDraggingRef.current) {
          const a = perFrame(0.1, delta);
          const yaw = mouseTargetRef.current.x * 0.45;
          const pitch = -mouseTargetRef.current.y * 0.25;
          track.yaw = THREE.MathUtils.lerp(track.yaw, yaw, a);
          track.pitch = THREE.MathUtils.lerp(track.pitch, pitch, a);
          if (Math.abs(track.yaw - yaw) + Math.abs(track.pitch - pitch) > 1e-4) moving = true;
        }
        track.euler.set(track.pitch, track.yaw, 0);
        track.offset.setFromEuler(track.euler);
        head.quaternion.multiply(track.offset);
        track.inverse.copy(track.offset).invert();
        track.applied = true;
      }

      // Confetti
      if (celebratingRef.current) {
        moving = true;
        pMat.opacity = THREE.MathUtils.lerp(pMat.opacity, 0.9, perFrame(0.1, delta));
        const pos = pGeo.attributes.position.array;
        const s = delta * 60;
        for (let i = 0; i < pCount; i++) {
          pos[i * 3] += pVelocities[i].x * s;
          pos[i * 3 + 1] += pVelocities[i].y * s;
          pos[i * 3 + 2] += pVelocities[i].z * s;
          if (pos[i * 3 + 1] > 1.2) pos[i * 3 + 1] = 0.4;
        }
        pGeo.attributes.position.needsUpdate = true;
      } else if (pMat.opacity > 0.001) {
        moving = true;
        pMat.opacity = THREE.MathUtils.lerp(pMat.opacity, 0, perFrame(0.1, delta));
      } else {
        pMat.opacity = 0;
      }

      // A clip still playing keeps the loop alive; a paused idle (reduced
      // motion) does not.
      for (const action of Object.values(actionsRef.current)) {
        if (action.isRunning?.() && !action.paused) { moving = true; break; }
      }

      renderer.render(scene, camera);
      dirty = false;
      return moving;
    };

    // The loop runs only while the stage is on screen, the tab visible, the
    // context alive and something is moving; wake() restarts it.
    let raf = 0;
    let running = false;
    let inView = true;
    let contextLost = false;
    let last = 0;
    let acc = 0;
    let aliveUntil = 0;
    const stop = () => {
      running = false;
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    };
    const loop = (time) => {
      raf = requestAnimationFrame(loop);
      acc += clamp((time - last) / 1000, 0, 0.1);
      last = time;
      if (acc < MIN_FRAME_S) return;
      const delta = Math.min(acc, 0.1);
      acc = 0;
      try {
        if (!step(delta) && !dirty && time >= aliveUntil) stop();
      } catch {
        stop();
        setGlFailed(true);
      }
    };
    const start = () => {
      if (running || stageObj.disposed || contextLost) return;
      running = true;
      last = performance.now();
      acc = MIN_FRAME_S;
      raf = requestAnimationFrame(loop);
    };
    const sync = () => {
      if (inView && !document.hidden && !contextLost) start();
      else stop();
    };
    const wake = () => {
      dirty = true;
      aliveUntil = performance.now() + KEEP_ALIVE_MS;
      sync();
    };
    stageObj.wake = wake;
    wakeRef.current = wake;

    let io = null;
    if (typeof IntersectionObserver === 'function') {
      io = new IntersectionObserver((entries) => {
        const entry = entries[entries.length - 1];
        if (!entry) return;
        inView = entry.isIntersecting;
        if (inView) wake(); else stop();
      });
      io.observe(host);
    }
    const onVisibility = () => { if (document.hidden) stop(); else wake(); };
    document.addEventListener('visibilitychange', onVisibility);

    // A size change (rotation, a sidebar, the dvh bar) refits the frame.
    const resize = () => {
      const w = host.clientWidth;
      const h = host.clientHeight;
      if (!w || !h) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      reframe();
      frame.shown = frame.distance * zoomRef.current;
      wake();
    };
    let ro = null;
    if (typeof ResizeObserver === 'function') {
      ro = new ResizeObserver(resize);
      ro.observe(host);
    } else {
      window.addEventListener('resize', resize);
    }

    // A plain wheel scrolls the page past the card. Zoom needs ctrl/cmd (a
    // trackpad pinch arrives as ctrl + wheel) or a click on the stage first.
    const onWheel = (e) => {
      if (!(e.ctrlKey || e.metaKey || document.activeElement === host)) return;
      e.preventDefault();
      zoomRef.current = clamp(zoomRef.current + e.deltaY * 0.0008, 0.62, 1.5);
      setOffFront(Math.abs(zoomRef.current - 1) > 0.05 || angleFromFront(rotTargetRef.current.y) > OFF_FRONT);
      wake();
    };
    host.addEventListener('wheel', onWheel, { passive: false });

    // A phone may take the GPU back while the app is in the background. The
    // context usually returns: show the picture meanwhile, then carry on.
    // three's renderer restores its own state on 'webglcontextrestored'.
    const onContextLost = (event) => {
      if (stageObj.disposed) return;
      event?.preventDefault?.();
      contextLost = true;
      stop();
      setLost(true);
    };
    const onContextRestored = () => {
      if (stageObj.disposed) return;
      contextLost = false;
      setLost(false);
      wake();
    };
    canvas.addEventListener('webglcontextlost', onContextLost);
    canvas.addEventListener('webglcontextrestored', onContextRestored);

    const applyTheme = () => {
      const surface = themeColor(host, '--clr-surface');
      const border = themeColor(host, '--clr-border');
      if (surface) pedMat.color.setStyle(surface);
      if (border) ringMat.color.setStyle(border);
      wake();
    };
    applyTheme();
    let mo = null;
    if (typeof MutationObserver === 'function') {
      mo = new MutationObserver(applyTheme);
      mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'data-theme', 'data-palette', 'style'] });
    }

    try {
      renderer.render(scene, camera);
    } catch {
      setGlFailed(true);
    }
    sync();
    setStage(stageObj);

    return () => {
      stageObj.disposed = true;
      stop();
      wakeRef.current = () => {};
      io?.disconnect();
      ro?.disconnect();
      mo?.disconnect();
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVisibility);
      host.removeEventListener('wheel', onWheel);
      canvas.removeEventListener('webglcontextlost', onContextLost);
      canvas.removeEventListener('webglcontextrestored', onContextRestored);
      // The model on stage goes with the scene.
      const shown = shownRef.current;
      try { shown?.mixer?.stopAllAction?.(); } catch { /* already stopped */ }
      shownRef.current = null;
      headRef.current = null;
      mixerRef.current = null;
      actionsRef.current = {};
      // A throw here would reach the screen's error boundary; a context that
      // is already lost may refuse the calls, which is fine.
      try { disposeTree(scene); } catch { /* already released */ }
      try { renderer.dispose(); } catch { /* already released */ }
      try { renderer.forceContextLoss(); } catch { /* already lost */ }
      if (canvas.parentNode === host) host.removeChild(canvas);
      setStage(null);
    };
  }, [host]);

  // The model: loaded into the existing stage and swapped in when ready, so
  // the pedestal is never left empty between two buddies.
  useEffect(() => {
    if (!stage) return undefined;
    let cancelled = false;
    const model = buddyModel(wantedId);
    const first = firstRef.current;
    setModelState((s) => (s === 'ready' ? 'ready' : 'loading'));
    setSlow(false);
    const slowTimer = setTimeout(() => { if (!cancelled) setSlow(true); }, SLOW_SWAP_MS);

    const release = (entry) => {
      try {
        entry?.mixer?.stopAllAction?.();
        if (entry?.root) entry.mixer?.uncacheRoot?.(entry.root);
        if (entry?.root) {
          entry.root.parent?.remove(entry.root);
          disposeTree(entry.root);
        }
      } catch { /* the stage may already be gone */ }
    };

    const show = ({ root, mixer = null, actions = {}, frameBy = root }) => {
      if (cancelled || stage.disposed) {
        release({ root, mixer });
        return;
      }
      clearTimeout(slowTimer);
      let head = null;
      root.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
        // Exactly 'Head': four models also carry an unanimated 'Head_Mesh'
        // sphere under it, which a substring match used to end on.
        if (!head && child.name === 'Head') head = child;
      });
      // The outgoing buddy leaves only now, with the newcomer ready.
      release(shownRef.current);
      stopConfetti();
      stage.frameModel?.(root, frameBy);
      stage.modelGroup.add(root);
      // A new buddy greets the student face on.
      if (!first) {
        rotTargetRef.current = { x: 0, y: 0 };
        rotVelocityRef.current = { x: 0, y: 0 };
        stage.modelGroup.rotation.set(0, 0, 0);
        zoomRef.current = 1;
        setOffFront(false);
      }
      trackRef.current = newTrack();
      headRef.current = head;
      mixerRef.current = mixer;
      actionsRef.current = actions;
      shownRef.current = { root, mixer, id: wantedId };
      firstRef.current = false;
      if (mixer) {
        mixer.addEventListener('finished', (event) => {
          if (event.action !== actions.idle) playClip('idle');
        });
        const asked = first ? initialActionRef.current : (greetRef.current ? 'wave' : 'idle');
        const wanted = reducedRef.current ? 'idle' : asked;
        playClip(actions[wanted] ? wanted : 'idle');
      }
      setShownId(wantedId);
      setSlow(false);
      setModelState('ready');
      stage.wake?.();
    };

    const fail = () => {
      if (cancelled) return;
      clearTimeout(slowTimer);
      // The picked buddy cannot be shown in 3D; the last one must not stand in.
      release(shownRef.current);
      shownRef.current = null;
      headRef.current = null;
      mixerRef.current = null;
      actionsRef.current = {};
      setShownId(null);
      setModelState('failed');
    };

    if (model?.kind === 'mochi') {
      buildMochiModel().then(show, fail);
    } else if (model?.kind === 'glb') {
      stage.loader.load(
        model.url,
        (gltf) => {
          const actions = {};
          let mixer = null;
          if (gltf.animations?.length) {
            mixer = new THREE.AnimationMixer(gltf.scene);
            for (const clip of gltf.animations) {
              const name = clip.name.toLowerCase();
              if (name.includes('idle')) actions.idle = mixer.clipAction(clip);
              if (name.includes('wave')) actions.wave = mixer.clipAction(clip);
              if (name.includes('celebrat')) actions.celebrate = mixer.clipAction(clip);
            }
          }
          show({ root: gltf.scene, mixer, actions });
        },
        undefined,
        fail,
      );
    } else {
      fail();
    }

    return () => {
      cancelled = true;
      clearTimeout(slowTimer);
    };
  }, [stage, wantedId, playClip, stopConfetti]);

  // Timers that belong to the whole mount.
  useEffect(() => () => {
    clearTimeout(confettiTimerRef.current);
    confettiTimerRef.current = 0;
  }, []);

  const ready = modelState === 'ready' && shownId === wantedId && !lost;
  readyRef.current = ready;
  // The canvas shows once a model stands on it; a quick swap keeps the last
  // buddy until the next is ready. The wanted buddy's picture holds the stage
  // before the first model, during a slow swap and while the GPU is away.
  const canvasVisible = shownId !== null && !lost && !(slow && shownId !== wantedId);
  const showPicture = !glFailed && modelState !== 'failed' && !canvasVisible;

  const actionButton = (clip, label) => (
    <button
      type="button"
      className="vmx-buddy-action"
      onClick={() => playClip(clip)}
      disabled={!ready}
      aria-pressed={currentAction === clip}
    >
      {label}
    </button>
  );

  return (
    <div className="vmx-buddy-viewer">
      <div className="vmx-buddy-stage">
        {glFailed ? (
          <MascotStill mascot={character} note="อุปกรณ์นี้เปิดภาพ 3D ไม่ได้ จึงแสดงเป็นภาพนิ่งแทน" />
        ) : (
          <>
            {/* The canvas host holds only the canvas: React renders no
                children into it, so appending the canvas cannot fight React. */}
            <div
              ref={setHost}
              className="vmx-buddy-stage-canvas"
              data-mascot-canvas=""
              data-ready={canvasVisible ? '' : undefined}
              role="img"
              aria-label={character.alt}
              tabIndex={-1}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              onDoubleClick={handleResetView}
              style={{ touchAction: 'pan-y' }}
            />

            <span className="vmx-buddy-pedestal" aria-hidden="true" data-hidden={showPicture ? undefined : ''} />
            <img
              key={character.src}
              className="vmx-buddy-stage-picture"
              src={character.src}
              alt=""
              aria-hidden="true"
              data-hidden={showPicture ? undefined : ''}
              decoding="async"
            />

            {modelState === 'failed' && (
              <div className="vmx-buddy-stage-fallback">
                <MascotStill mascot={character} note="โหลดโมเดล 3D ไม่สำเร็จ จึงแสดงเป็นภาพนิ่งแทน" />
              </div>
            )}

            {/* Only while there is a model to turn: not over the picture
                that stands in during loading or a lost GPU context. */}
            {canvasVisible && (
              <p className="vmx-buddy-hint" aria-hidden="true">
                {finePointer ? 'ลากเพื่อหมุน คลิกที่ภาพแล้วเลื่อนล้อเพื่อซูม' : 'ลากซ้ายขวาเพื่อหมุน'}
              </p>
            )}

            {offFront && modelState !== 'failed' && (
              <button type="button" className="vmx-buddy-face" onClick={handleResetView}>
                กลับด้านหน้า
              </button>
            )}
          </>
        )}
      </div>

      {/* Animation controls. Under reduced motion idle is a still rest pose,
          so a button for it would do nothing; the two one-shot moves stay. */}
      {!glFailed && modelState !== 'failed' && (
        <div className="vmx-buddy-actions">
          {!reduced && actionButton('idle', 'หายใจ')}
          {actionButton('wave', 'โบกมือ')}
          {actionButton('celebrate', 'ดีใจ')}
        </div>
      )}
    </div>
  );
}
