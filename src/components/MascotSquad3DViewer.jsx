import { useCallback, useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { SQUAD_MASCOTS } from '../data/art.js';
import { useMotionPreferences } from '../hooks/useMotionPreferences.js';
import MascotStill from './MascotStill.jsx';

/**
 * MascotSquad3DViewer
 * Interactive 3D viewer for the VetMock Study Squad.
 *   - Drag to spin with damping and inertia (touch: horizontal drags only,
 *     so a vertical swipe still scrolls the page)
 *   - Zoom with ctrl/cmd + wheel, a trackpad pinch, or the wheel once the
 *     canvas has been clicked
 *   - Double-click or the button resets the camera
 *   - Head tracking toward the mouse, added on top of the playing clip
 *   - Idle, wave and celebrate clips from the GLB; a confetti burst on
 *     celebrate (none under reduced motion)
 *
 * Lifecycle: one WebGLRenderer per mount. The model swaps inside it when the
 * student picks another mascot; a load that finishes after a newer pick is
 * thrown away. Everything is disposed on swap and unmount, the GL context is
 * released, and drawing stops while the canvas is off-screen or the tab is
 * hidden. When the device cannot draw 3D, the context is lost or the model
 * fails to load, the mascot's 2D picture is shown with a short note.
 */

// The figure is drawn about 330 CSS px tall with MSAA and no textures. Past
// 1.5 device pixels per CSS pixel the soft vinyl edges look the same, while the
// fill cost grows with the square: DPR 2 draws 1.78x and DPR 3 draws 4x the
// pixels of 1.5, on the phones whose battery it drains.
const MAX_PIXEL_RATIO = 1.5;
const CONFETTI_MS = 2000;
const MODEL_PATH = (id) => `/art/models/${id}.glb`;

// The motion was tuned as per-frame factors at 60 fps. These apply the same
// factors per elapsed time, so a 120 Hz phone neither spins nor settles twice
// as fast.
const perFrame = (factor, delta) => 1 - Math.pow(1 - factor, delta * 60);
const keep = (factor, delta) => Math.pow(factor, delta * 60);
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

function disposeTree(root) {
  root?.traverse?.((obj) => {
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

const newTrack = () => ({ yaw: 0, pitch: 0, applied: false, offset: new THREE.Quaternion(), inverse: new THREE.Quaternion(), euler: new THREE.Euler(0, 0, 0, 'YXZ') });

const touchMin = 'var(--touch-min)';

export default function MascotSquad3DViewer({ initialId = 'moocha', initialAction = 'idle', onSelectCharacter }) {
  const { reduced } = useMotionPreferences();
  const [currentId, setCurrentId] = useState(() => (SQUAD_MASCOTS[initialId] ? initialId : 'moocha'));
  const [currentAction, setCurrentAction] = useState('idle');
  const [modelState, setModelState] = useState('loading');
  const [glFailed, setGlFailed] = useState(false);
  const [host, setHost] = useState(null);
  const [stage, setStage] = useState(null);
  const [finePointer] = useState(() => {
    try { return Boolean(window.matchMedia?.('(pointer: fine)').matches); } catch { return false; }
  });

  const reducedRef = useRef(reduced);
  useEffect(() => { reducedRef.current = reduced; }, [reduced]);
  // The first model plays the action the screen asked for (Pomodoro and
  // Results celebrate); a model picked later starts on idle.
  const pendingActionRef = useRef(initialAction);
  const headRef = useRef(null);
  const trackRef = useRef(newTrack());
  const mixerRef = useRef(null);
  const actionsRef = useRef({});
  const celebratingRef = useRef(false);
  const confettiTimerRef = useRef(0);

  // Interaction controls
  const mouseTargetRef = useRef({ x: 0, y: 0 });
  const isDraggingRef = useRef(false);
  const dragIsTouchRef = useRef(false);
  const prevPointerRef = useRef({ x: 0, y: 0 });
  const rotTargetRef = useRef({ x: 0, y: 0 });
  const rotVelocityRef = useRef({ x: 0, y: 0 });
  const cameraDistRef = useRef(2.4);

  const character = SQUAD_MASCOTS[currentId] || SQUAD_MASCOTS.moocha;

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
  }, [startConfetti]);

  // Pointer handlers: orbit and head tracking
  const handlePointerDown = (e) => {
    const el = e.currentTarget || host;
    isDraggingRef.current = true;
    dragIsTouchRef.current = e.pointerType === 'touch';
    prevPointerRef.current = { x: e.clientX, y: e.clientY };
    try { el?.setPointerCapture?.(e.pointerId); } catch { /* not capturable */ }
    // A click gives the canvas focus, which is what lets the plain wheel zoom.
    if (e.pointerType !== 'touch') {
      try { el?.focus?.({ preventScroll: true }); } catch { /* not focusable */ }
    }
    if (el?.style) el.style.cursor = 'grabbing';
  };

  const handlePointerMove = (e) => {
    const el = e.currentTarget || host;
    if (!el) return;
    if (isDraggingRef.current) {
      const deltaX = e.clientX - prevPointerRef.current.x;
      const deltaY = e.clientY - prevPointerRef.current.y;
      prevPointerRef.current = { x: e.clientX, y: e.clientY };
      // On touch only the horizontal part turns the model; vertical swipes
      // belong to the page (touch-action: pan-y).
      const tilt = dragIsTouchRef.current ? 0 : deltaY * 0.005;
      rotVelocityRef.current = { x: tilt, y: deltaX * 0.008 };
      rotTargetRef.current.y += deltaX * 0.008;
      rotTargetRef.current.x = clamp(rotTargetRef.current.x + tilt, -0.35, 0.35);
    } else {
      const rect = el.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouseTargetRef.current = { x: clamp(x, -1, 1), y: clamp(y, -1, 1) };
    }
  };

  const handlePointerUp = (e) => {
    isDraggingRef.current = false;
    const el = e?.currentTarget || host;
    if (el?.style) el.style.cursor = 'grab';
  };

  const handleResetView = () => {
    rotTargetRef.current = { x: 0, y: 0 };
    rotVelocityRef.current = { x: 0, y: 0 };
    cameraDistRef.current = 2.4;
    mouseTargetRef.current = { x: 0, y: 0 };
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

    const width = host.clientWidth || 320;
    const height = host.clientHeight || 330;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(30, width / height, 0.1, 20);
    camera.position.set(0, 0.55, cameraDistRef.current);
    camera.lookAt(0, 0.5, 0);

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, MAX_PIXEL_RATIO));
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
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
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
    const pedestal = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.58, 0.035, 36), pedMat);
    pedestal.position.y = -0.018;
    pedestal.receiveShadow = true;
    scene.add(pedestal);
    const ringGeo = new THREE.TorusGeometry(0.555, 0.004, 12, 36);
    ringGeo.rotateX(Math.PI / 2);
    const ringMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.3, metalness: 0.2 });
    scene.add(new THREE.Mesh(ringGeo, ringMat));
    const applyTheme = () => {
      const surface = themeColor(host, '--clr-surface');
      const border = themeColor(host, '--clr-border');
      if (surface) pedMat.color.setStyle(surface);
      if (border) ringMat.color.setStyle(border);
    };
    applyTheme();

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

    const stageObj = { modelGroup, loader: new GLTFLoader(), disposed: false };

    const step = (delta) => {
      const head = headRef.current;
      const track = trackRef.current;
      // Take last frame's tracking offset off before the mixer runs. three's
      // mixer skips writing a value that did not change since its last write,
      // so an offset left on an unchanged pose would stack up every frame.
      if (head && track.applied) head.quaternion.multiply(track.inverse);
      track.applied = false;
      mixerRef.current?.update(delta);

      // 360 orbit damping and rotation
      if (!isDraggingRef.current) {
        const k = keep(0.92, delta);
        rotVelocityRef.current.y *= k;
        rotVelocityRef.current.x *= k;
        rotTargetRef.current.y += rotVelocityRef.current.y * delta * 60;
        rotTargetRef.current.x += rotVelocityRef.current.x * delta * 60;
      }
      const rotAlpha = perFrame(0.15, delta);
      modelGroup.rotation.y = THREE.MathUtils.lerp(modelGroup.rotation.y, rotTargetRef.current.y, rotAlpha);
      modelGroup.rotation.x = THREE.MathUtils.lerp(modelGroup.rotation.x, rotTargetRef.current.x, rotAlpha);

      // Smooth camera zoom
      camera.position.z = THREE.MathUtils.lerp(camera.position.z, cameraDistRef.current, perFrame(0.1, delta));

      // Head tracking, applied on top of whatever the clip wrote this frame
      if (head) {
        if (!isDraggingRef.current) {
          const a = perFrame(0.1, delta);
          track.yaw = THREE.MathUtils.lerp(track.yaw, mouseTargetRef.current.x * 0.45, a);
          track.pitch = THREE.MathUtils.lerp(track.pitch, -mouseTargetRef.current.y * 0.25, a);
        }
        track.euler.set(track.pitch, track.yaw, 0);
        track.offset.setFromEuler(track.euler);
        head.quaternion.multiply(track.offset);
        track.inverse.copy(track.offset).invert();
        track.applied = true;
      }

      // Confetti
      if (celebratingRef.current) {
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
        pMat.opacity = THREE.MathUtils.lerp(pMat.opacity, 0, perFrame(0.1, delta));
      } else {
        pMat.opacity = 0;
      }

      renderer.render(scene, camera);
    };

    // The loop runs only while the canvas is on screen and the tab visible.
    let raf = 0;
    let running = false;
    let inView = true;
    let last = 0;
    const stop = () => {
      running = false;
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    };
    const loop = (time) => {
      raf = requestAnimationFrame(loop);
      const delta = clamp((time - last) / 1000, 0, 0.1);
      last = time;
      try {
        step(delta);
      } catch {
        stop();
        setGlFailed(true);
      }
    };
    const start = () => {
      if (running || stageObj.disposed) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(loop);
    };
    const sync = () => {
      if (inView && !document.hidden) start();
      else stop();
    };

    let io = null;
    if (typeof IntersectionObserver === 'function') {
      io = new IntersectionObserver((entries) => {
        const entry = entries[entries.length - 1];
        if (!entry) return;
        inView = entry.isIntersecting;
        sync();
      });
      io.observe(host);
    }
    const onVisibility = () => sync();
    document.addEventListener('visibilitychange', onVisibility);

    const resize = () => {
      const w = host.clientWidth;
      const h = host.clientHeight;
      if (!w || !h) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    let ro = null;
    if (typeof ResizeObserver === 'function') {
      ro = new ResizeObserver(resize);
      ro.observe(host);
    } else {
      window.addEventListener('resize', resize);
    }

    // A plain wheel scrolls the page past the card. Zoom needs ctrl/cmd (a
    // trackpad pinch arrives as ctrl + wheel) or a click on the canvas first.
    const onWheel = (e) => {
      if (!(e.ctrlKey || e.metaKey || document.activeElement === host)) return;
      e.preventDefault();
      cameraDistRef.current = clamp(cameraDistRef.current + e.deltaY * 0.002, 1.5, 3.6);
    };
    host.addEventListener('wheel', onWheel, { passive: false });

    const onContextLost = () => {
      if (stageObj.disposed) return;
      stop();
      setGlFailed(true);
    };
    canvas.addEventListener('webglcontextlost', onContextLost);

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
      io?.disconnect();
      ro?.disconnect();
      mo?.disconnect();
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVisibility);
      host.removeEventListener('wheel', onWheel);
      canvas.removeEventListener('webglcontextlost', onContextLost);
      disposeTree(scene);
      renderer.dispose();
      renderer.forceContextLoss();
      if (canvas.parentNode === host) host.removeChild(canvas);
      setStage(null);
    };
  }, [host]);

  // The model: loaded into the existing stage, swapped when the student
  // picks another mascot.
  useEffect(() => {
    if (!stage) return undefined;
    let cancelled = false;
    let root = null;
    let mixer = null;
    headRef.current = null;
    mixerRef.current = null;
    actionsRef.current = {};
    trackRef.current = newTrack();
    setModelState('loading');

    stage.loader.load(
      MODEL_PATH(currentId),
      (gltf) => {
        // A pick made while this was loading wins; the late model is dropped.
        if (cancelled || stage.disposed) {
          disposeTree(gltf.scene);
          return;
        }
        root = gltf.scene;
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
        stage.modelGroup.add(root);
        headRef.current = head;

        if (gltf.animations?.length) {
          mixer = new THREE.AnimationMixer(root);
          const actions = {};
          for (const clip of gltf.animations) {
            const name = clip.name.toLowerCase();
            if (name.includes('idle')) actions.idle = mixer.clipAction(clip);
            if (name.includes('wave')) actions.wave = mixer.clipAction(clip);
            if (name.includes('celebrat')) actions.celebrate = mixer.clipAction(clip);
          }
          mixer.addEventListener('finished', (event) => {
            if (event.action !== actions.idle) playClip('idle');
          });
          mixerRef.current = mixer;
          actionsRef.current = actions;
          const wanted = reducedRef.current ? 'idle' : pendingActionRef.current;
          pendingActionRef.current = 'idle';
          playClip(actions[wanted] ? wanted : 'idle');
        }
        setModelState('ready');
      },
      undefined,
      () => {
        if (!cancelled) setModelState('failed');
      },
    );

    return () => {
      cancelled = true;
      stopConfetti();
      if (mixer) {
        mixer.stopAllAction();
        if (root) mixer.uncacheRoot(root);
      }
      if (root) {
        root.parent?.remove(root);
        disposeTree(root);
      }
      headRef.current = null;
      mixerRef.current = null;
      actionsRef.current = {};
    };
  }, [stage, currentId, playClip, stopConfetti]);

  const actionButton = (clip, label) => (
    <button
      type="button"
      onClick={() => playClip(clip)}
      disabled={modelState !== 'ready'}
      style={{
        minHeight: touchMin,
        padding: '6px 14px',
        borderRadius: '10px',
        border: '1px solid var(--clr-border)',
        background: currentAction === clip ? 'var(--clr-ink)' : 'var(--clr-surface)',
        color: currentAction === clip ? 'var(--clr-surface)' : 'var(--clr-ink)',
        fontSize: '0.78rem',
        cursor: modelState === 'ready' ? 'pointer' : 'default',
        opacity: modelState === 'ready' ? 1 : 0.6,
        transition: 'all 0.2s ease',
      }}
    >
      {label}
    </button>
  );

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        background: 'var(--clr-surface-2, rgba(255, 255, 255, 0.8))',
        backdropFilter: 'blur(12px)',
        border: '1px solid var(--clr-border)',
        borderRadius: '20px',
        padding: '20px',
        boxShadow: '0 12px 32px rgba(0,0,0,0.06)',
        width: '100%',
        maxWidth: '440px',
        margin: '0 auto',
      }}
    >
      {/* Squad character switcher */}
      <div role="group" aria-label="เลือกคู่หู" style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
        {Object.values(SQUAD_MASCOTS).map((m) => {
          const isSelected = m.id === currentId;
          return (
            <button
              key={m.id}
              type="button"
              aria-pressed={isSelected}
              onClick={() => {
                setCurrentId(m.id);
                handleResetView();
                onSelectCharacter?.(m);
              }}
              style={{
                minHeight: touchMin,
                padding: '6px 12px',
                borderRadius: '20px',
                border: isSelected ? '2px solid var(--clr-sage)' : '1px solid var(--clr-border)',
                background: isSelected ? 'var(--clr-sage-soft)' : 'var(--clr-surface)',
                color: isSelected ? 'var(--clr-sage-text)' : 'var(--clr-ink-soft)',
                fontWeight: isSelected ? 600 : 500,
                fontSize: '0.82rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              {m.nameTh}
            </button>
          );
        })}
      </div>

      {/* Stage */}
      <div
        style={{
          width: '100%',
          height: '330px',
          position: 'relative',
          borderRadius: '16px',
          overflow: 'hidden',
          background: 'radial-gradient(circle at center 60%, var(--clr-surface) 0%, var(--clr-surface-2) 100%)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {glFailed ? (
          <MascotStill mascot={character} note="อุปกรณ์นี้เปิดภาพ 3D ไม่ได้ จึงแสดงเป็นภาพนิ่งแทน" />
        ) : (
          <>
            {/* The canvas host holds only the canvas: React renders no
                children into it, so appending the canvas cannot fight React. */}
            <div
              ref={setHost}
              data-mascot-canvas=""
              role="img"
              aria-label={character.alt}
              tabIndex={-1}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              onDoubleClick={handleResetView}
              style={{
                position: 'absolute',
                inset: 0,
                cursor: 'grab',
                touchAction: 'pan-y',
                userSelect: 'none',
                outline: 'none',
              }}
            />

            {modelState === 'loading' && (
              <div style={{ position: 'absolute', fontSize: '0.85rem', color: 'var(--clr-ink-soft)', pointerEvents: 'none' }}>
                กำลังโหลดโมเดล 3D...
              </div>
            )}
            {modelState === 'failed' && (
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--clr-surface)' }}>
                <MascotStill mascot={character} note="โหลดโมเดล 3D ไม่สำเร็จ จึงแสดงเป็นภาพนิ่งแทน" />
              </div>
            )}

            {/* Orbit hint */}
            <div
              style={{
                position: 'absolute',
                bottom: '10px',
                right: '10px',
                fontSize: '0.72rem',
                color: 'var(--clr-ink-soft)',
                background: 'var(--clr-surface)',
                padding: '3px 8px',
                borderRadius: '6px',
                border: '1px solid var(--clr-border)',
                pointerEvents: 'none',
                opacity: 0.85,
              }}
            >
              {finePointer ? '🔄 ลากเพื่อหมุน คลิกที่ภาพแล้วเลื่อนล้อเพื่อซูม' : '🔄 ลากซ้ายขวาเพื่อหมุน'}
            </div>

            {/* Reset view */}
            <button
              type="button"
              onClick={handleResetView}
              title="รีเซ็ตมุมมองด้านหน้า"
              style={{
                position: 'absolute',
                top: '8px',
                right: '8px',
                minHeight: touchMin,
                fontSize: '0.75rem',
                background: 'var(--clr-surface)',
                border: '1px solid var(--clr-border)',
                borderRadius: '6px',
                padding: '4px 10px',
                color: 'var(--clr-ink-soft)',
                cursor: 'pointer',
              }}
            >
              🧭 รีเซ็ต
            </button>
          </>
        )}
      </div>

      {/* Character info */}
      <div style={{ textAlign: 'center', marginTop: '12px' }}>
        <h3 style={{ margin: 0, fontSize: '1.15rem', color: 'var(--clr-ink)', fontWeight: 600 }}>
          {character.nameTh} ({character.name})
        </h3>
        <p style={{ margin: '3px 0 0 0', fontSize: '0.82rem', color: 'var(--clr-sage-text)', fontWeight: 500 }}>
          {character.role}
        </p>
        <p style={{ margin: '3px 0 0 0', fontSize: '0.78rem', color: 'var(--clr-ink-soft)' }}>
          {character.species}
        </p>
      </div>

      {/* Animation controls */}
      {!glFailed && (
        <div style={{ display: 'flex', gap: '8px', marginTop: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
          {actionButton('idle', '🌿 หายใจ')}
          {actionButton('wave', '👋 โบกมือ')}
          {actionButton('celebrate', '🎉 ดีใจ')}
        </div>
      )}
    </div>
  );
}
