import { useEffect, useRef } from 'react';
import * as T from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { loadAtlasAsset } from '../lib/atlas-cache.js';
import { atlasFitDistance, atlasMotionValue } from '../lib/atlas-workspace.js';
import { atlasIsTap } from '../lib/atlas.js';

// Comparison shares one WebGL context, with independently clipped viewports.
export default function AtlasScene({
  specimen,
  comparison,
  quality,
  selected,
  visibleIds,
  exploded,
  coloured,
  ghost,
  cut,
  command,
  onSelect,
  onStatus,
  onExport,
}) {
  const host = useRef(null),
    leftPane = useRef(null),
    rightPane = useRef(null);
  const engine = useRef(null),
    latest = useRef(null),
    savedPose = useRef(null);
  latest.current = {
    selected,
    visibleIds,
    exploded,
    coloured,
    ghost,
    cut,
    command,
    onSelect,
    onStatus,
    onExport,
  };
  useEffect(() => {
    const el = host.current;
    let disposed = false,
      departed = false,
      frame = 0,
      inView = true,
      lost = false,
      syncing = false,
      activeIndex = 0,
      lastCommand = null;
    let displayedExplosion = latest.current.exploded,
      targetExplosion = displayedExplosion,
      lastMotionTime = performance.now();
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const abort = new AbortController(),
      timeout = setTimeout(() => abort.abort(), 45000);
    const viewData = [specimen, comparison].filter(Boolean);
    const states = viewData.map(() => ({ kind: 'loading', progress: 0 }));
    const emit = () => {
      if (!disposed && !departed)
        latest.current.onStatus({
          kind: lost || states[0].kind === 'error' ? 'error' : states[0].kind,
          message: lost ? 'การแสดงผล 3D หยุดชั่วคราว กดลองใหม่ได้' : states[0].message,
          views: states.map((state) => ({ ...state })),
        });
    };
    let renderer;
    try {
      renderer = new T.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
    } catch {
      clearTimeout(timeout);
      states[0] = {
        kind: 'error',
        message: 'อุปกรณ์นี้เปิดภาพ 3D ไม่ได้ ใช้ภาพตัวอย่างและแหล่งอ้างอิงด้านล่างได้',
      };
      emit();
      return undefined;
    }
    const pagehide = event => {
      // BFCache keeps this document alive; a real navigation does not.
      if (event.persisted) return;
      departed = true;
      abort.abort();
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
    };
    window.addEventListener('pagehide', pagehide);
    const canvas = renderer.domElement;
    canvas.setAttribute('aria-hidden', 'true');
    el.prepend(canvas);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, quality === 'detail' ? 2 : 1.5));
    renderer.setClearColor(0, 0);
    renderer.outputColorSpace = T.SRGBColorSpace;
    renderer.localClippingEnabled = true;
    const panes = [leftPane.current, rightPane.current];
    const views = viewData.map((data, index) => {
      const scene = new T.Scene();
      scene.add(new T.HemisphereLight(0xffffff, 0x726b62, 2.4));
      const key = new T.DirectionalLight(0xffffff, 2.1);
      key.position.set(-3, 5, -4);
      scene.add(key);
      const fill = new T.DirectionalLight(0xffffff, 0.9);
      fill.position.set(3, -1, 3);
      scene.add(fill);
      const camera = new T.PerspectiveCamera(35, 1, 0.01, 100);
      camera.position.set(2.5, 1.5, -4);
      const controls = new OrbitControls(camera, panes[index]);
      controls.enableDamping = true;
      controls.dampingFactor = 0.13;
      controls.minDistance = 0.2;
      controls.maxDistance = 16;
      return {
        data,
        scene,
        camera,
        controls,
        clipping: new T.Plane(new T.Vector3(0, 0, -1), 2),
        pane: panes[index],
        model: null,
        meshes: [],
        cleanups: [],
        cameraMotion: null,
        fittedExplosion: displayedExplosion,
      };
    });
    function requestRender() {
      if (!disposed && !departed && !lost && !frame && inView && !document.hidden) frame = requestAnimationFrame(render);
    }
    function render() {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      if (disposed || departed || lost || document.hidden || !inView) return;
      const now = performance.now();
      const elapsed = now - lastMotionTime;
      lastMotionTime = now;
      displayedExplosion = atlasMotionValue(displayedExplosion, targetExplosion, elapsed, reducedMotion.matches);
      placeParts(displayedExplosion);
      let moving = displayedExplosion !== targetExplosion;
      for (const view of views) {
        const motion = view.cameraMotion;
        if (!motion) continue;
        const progress = reducedMotion.matches ? 1 : Math.min(1, (now - motion.started) / 240);
        const eased = progress * progress * (3 - 2 * progress);
        view.camera.position.lerpVectors(motion.fromPosition, motion.position, eased);
        view.controls.target.lerpVectors(motion.fromTarget, motion.target, eased);
        if (progress === 1) view.cameraMotion = null;
        else moving = true;
      }
      views[activeIndex].controls.update();
      const rect = el.getBoundingClientRect();
      renderer.setScissorTest(false);
      renderer.clear();
      renderer.setScissorTest(true);
      for (const view of views) {
        const pane = view.pane.getBoundingClientRect();
        if (pane.width < 1 || pane.height < 1) continue;
        const x = pane.left - rect.left,
          y = rect.bottom - pane.bottom;
        renderer.setViewport(x, y, pane.width, pane.height);
        renderer.setScissor(x, y, pane.width, pane.height);
        renderer.render(view.scene, view.camera);
      }
      if (moving) requestRender();
    }
    function placeParts(amount) {
      for (const view of views) for (const mesh of view.meshes) {
        mesh.position.copy(mesh.userData.originalPosition)
          .addScaledVector(mesh.userData.explodeDirection, (amount / 100) * 1.2);
      }
    }
    function copyPose(from) {
      syncing = true;
      for (const view of views) {
        if (view === from) continue;
        // Flush an old gesture before copying; only the active control damps.
        view.controls.enableDamping = false;
        view.controls.update();
        view.controls.enableDamping = true;
        view.camera.position.copy(from.camera.position);
        view.camera.quaternion.copy(from.camera.quaternion);
        view.controls.target.copy(from.controls.target);
      }
      syncing = false;
    }
    function fit(view, selectionOnly = false, reset = false, smooth = false) {
      if (!view.model) return;
      view.model.updateMatrixWorld(true);
      const box = new T.Box3();
      for (const mesh of view.meshes)
        if (mesh.visible && (!selectionOnly || mesh.name === latest.current.selected))
          box.expandByObject(mesh);
      if (box.isEmpty()) return;
      const sphere = box.getBoundingSphere(new T.Sphere());
      const direction = reset
        ? new T.Vector3(0.12, 0.28, -1).normalize()
        : view.camera.position.clone().sub(view.controls.target).normalize();
      const fromPosition = view.camera.position.clone();
      const fromTarget = view.controls.target.clone();
      view.controls.target.copy(sphere.center);
      view.camera.position
        .copy(sphere.center)
        .addScaledVector(direction, atlasFitDistance(sphere.radius, view.camera.fov, view.camera.aspect));
      view.fittedExplosion = targetExplosion;
      view.cameraMotion = null;
      if (smooth && !reducedMotion.matches) {
        view.cameraMotion = {
          fromPosition, fromTarget, position: view.camera.position.clone(),
          target: view.controls.target.clone(), started: performance.now(),
        };
        view.camera.position.copy(fromPosition);
        view.controls.target.copy(fromTarget);
      }
      syncing = true;
      view.controls.update();
      syncing = false;
    }
    const accent = new T.Color();
    const readColours = () => accent.set(getComputedStyle(el).getPropertyValue('--clr-sage').trim());
    readColours();
    function exportView() {
      render();
      try {
        const output = document.createElement('canvas');
        output.width = Math.min(1920, Math.max(960, canvas.width));
        const imageHeight = Math.round((canvas.height * output.width) / canvas.width);
        output.height = imageHeight + 74 + viewData.length * 54;
        const ctx = output.getContext('2d'),
          style = getComputedStyle(el);
        ctx.fillStyle = getComputedStyle(el.parentElement).backgroundColor;
        ctx.fillRect(0, 0, output.width, imageHeight);
        ctx.drawImage(canvas, 0, 0, output.width, imageHeight);
        ctx.fillStyle = style.getPropertyValue('--clr-surface').trim();
        ctx.fillRect(0, imageHeight, output.width, output.height - imageHeight);
        ctx.fillStyle = style.getPropertyValue('--clr-ink').trim();
        const selectedPart = specimen.parts.find((part) => part.id === latest.current.selected);
        const selectionLabel = specimen.kind === 'segmented' && selectedPart ? `${selectedPart.en} · ` : '';
        ctx.font = '600 22px sans-serif';
        ctx.fillText(
          `VetMock Atlas · ${selectionLabel}${viewData.map((view) => view.titleEn).join(' / ')}`,
          20,
          imageHeight + 32,
          output.width - 40,
        );
        ctx.font = '14px sans-serif';
        viewData.forEach((view, index) => {
          const y = imageHeight + 56 + index * 54;
          ctx.fillText(`${view.titleEn} · ${view.authors} · ${view.license}`, 20, y, output.width - 40);
          ctx.fillText(view.sourceUrl, 20, y + 20, output.width - 40);
        });
        ctx.fillText(
          'Display sizes are normalised. Surface view only; not a diagnostic image.',
          20,
          output.height - 16,
          output.width - 40,
        );
        output.toBlob((blob) => {
          if (!disposed && !departed) latest.current.onExport?.(blob);
        }, 'image/png');
      } catch {
        latest.current.onExport?.(null);
      }
    }
    function applyState() {
      if (disposed || departed) return;
      const value = latest.current,
        visible = new Set(value.visibleIds);
      if (targetExplosion !== value.exploded && displayedExplosion === targetExplosion)
        lastMotionTime = performance.now();
      targetExplosion = value.exploded;
      if (reducedMotion.matches) displayedExplosion = targetExplosion;
      views.forEach((view, index) => {
        if (!view.model) return;
        view.clipping.constant = 1.4 - (value.cut / 100) * 2.8;
        for (const mesh of view.meshes) {
          mesh.visible = index > 0 || visible.has(mesh.name);
          const isSelected = index === 0 && view.data.kind === 'segmented' && mesh.name === value.selected;
          mesh.material.color.copy(
            isSelected
              ? accent
              : value.coloured && view.data.kind === 'segmented'
                ? mesh.userData.colour
                : mesh.userData.boneColour,
          );
          mesh.material.emissive.copy(accent);
          mesh.material.emissiveIntensity = isSelected ? 0.12 : 0;
          const translucent = index === 0 && value.ghost && !isSelected && view.data.kind === 'segmented';
          mesh.material.transparent = translucent;
          mesh.material.opacity = translucent ? 0.16 : 1;
          mesh.material.depthWrite = !translucent;
          mesh.material.clippingPlanes = value.cut > 0 ? [view.clipping] : null;
        }
      });
      if (value.command !== lastCommand) {
        lastCommand = value.command;
        const kind = value.command?.kind;
        if (['fit', 'reset', 'focus'].includes(kind)) {
          // Fit the destination pose once, then animate without measuring every frame.
          placeParts(targetExplosion);
          views.forEach((view, index) => fit(view, kind === 'focus' && index === 0,
            kind === 'reset', view.fittedExplosion !== targetExplosion));
          placeParts(displayedExplosion);
        }
        if (['left', 'right', 'up', 'down', 'zoom-in', 'zoom-out'].includes(kind)) {
          const view = views[0],
            offset = view.camera.position.clone().sub(view.controls.target);
          activeIndex = 0;
          if (kind.startsWith('zoom'))
            offset.setLength(T.MathUtils.clamp(offset.length() * (kind === 'zoom-in' ? 0.8 : 1.25), 0.2, 16));
          else
            offset.applyAxisAngle(
              kind === 'up' || kind === 'down' ? new T.Vector3(1, 0, 0) : new T.Vector3(0, 1, 0),
              ['left', 'up'].includes(kind) ? Math.PI / 8 : -Math.PI / 8,
            );
          view.camera.position.copy(view.controls.target).add(offset);
          syncing = true;
          view.controls.update();
          syncing = false;
          copyPose(view);
        }
        if (kind === 'export') exportView();
      }
      requestRender();
    }
    engine.current = { sync: applyState };
    for (const [index, view] of views.entries()) {
      view.controls.addEventListener('start', () => {
        activeIndex = index;
        views.forEach((item) => { item.cameraMotion = null; });
      });
      view.controls.addEventListener('change', () => {
        if (!syncing) copyPose(view);
        requestRender();
      });
      let start = null;
      const pointers = new Set(),
        ray = new T.Raycaster(),
        pointer = new T.Vector2();
      const down = (event) => {
        pointers.add(event.pointerId);
        start =
          pointers.size === 1 && event.button === 0
            ? {
                pointerId: event.pointerId,
                x: event.clientX,
                y: event.clientY,
                moved: false,
                time: performance.now(),
              }
            : null;
      };
      const move = (event) => {
        if (start && Math.hypot(start.x - event.clientX, start.y - event.clientY) > 6) start.moved = true;
      };
      const up = (event) => {
        const tap =
          !start?.moved &&
          pointers.size === 1 &&
          performance.now() - (start?.time || 0) < 700 &&
          atlasIsTap(start, {
            pointerId: event.pointerId,
            x: event.clientX,
            y: event.clientY,
            button: event.button,
          });
        pointers.delete(event.pointerId);
        start = null;
        if (!tap || index !== 0 || !view.model || view.data.kind !== 'segmented') return;
        const rect = view.pane.getBoundingClientRect();
        pointer.set(
          ((event.clientX - rect.left) / rect.width) * 2 - 1,
          (-(event.clientY - rect.top) / rect.height) * 2 + 1,
        );
        ray.setFromCamera(pointer, view.camera);
        const hit = ray
          .intersectObjects(
            view.meshes.filter((mesh) => mesh.visible),
            false,
          )
          .find((hit) => latest.current.cut <= 0 || view.clipping.distanceToPoint(hit.point) >= 0);
        if (hit) latest.current.onSelect(hit.object.name);
      };
      const cancel = () => {
        pointers.clear();
        start = null;
      };
      view.pane.addEventListener('pointerdown', down);
      view.pane.addEventListener('pointermove', move);
      view.pane.addEventListener('pointerup', up);
      view.pane.addEventListener('pointercancel', cancel);
      view.pane.addEventListener('lostpointercapture', cancel);
      window.addEventListener('blur', cancel);
      view.cleanups.push(() => {
        view.pane.removeEventListener('pointerdown', down);
        view.pane.removeEventListener('pointermove', move);
        view.pane.removeEventListener('pointerup', up);
        view.pane.removeEventListener('pointercancel', cancel);
        view.pane.removeEventListener('lostpointercapture', cancel);
        window.removeEventListener('blur', cancel);
      });
    }
    const resize = new ResizeObserver(() => {
      renderer.setSize(Math.max(1, el.clientWidth), Math.max(1, el.clientHeight), false);
      // A resize can interrupt separation. Frame the destination, not a
      // transient pose that the moving parts would immediately outgrow.
      placeParts(targetExplosion);
      for (const view of views) {
        const rect = view.pane.getBoundingClientRect();
        view.camera.aspect = Math.max(1, rect.width) / Math.max(1, rect.height);
        view.camera.updateProjectionMatrix();
        fit(view);
      }
      placeParts(displayedExplosion);
      requestRender();
    });
    resize.observe(el);
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      if (inView) requestRender();
    });
    observer.observe(el);
    const theme = new MutationObserver(() => {
      readColours();
      applyState();
    });
    theme.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class', 'data-theme', 'data-palette', 'style'],
    });
    const visibility = () => {
      if (!document.hidden) requestRender();
    };
    document.addEventListener('visibilitychange', visibility);
    const contextLost = (event) => {
      event.preventDefault();
      lost = true;
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      emit();
    };
    canvas.addEventListener('webglcontextlost', contextLost);
    emit();
    Promise.all(
      views.map(async (view, index) => {
        let persisted = false;
        try {
          const loaded = await loadAtlasAsset(view.data.profiles[quality], {
            signal: abort.signal,
            onProgress: (progress) => {
              states[index].progress = progress;
              emit();
            },
            onStored: (stored) => {
              persisted = stored;
              if (states[index].kind === 'ready') {
                states[index].stored = stored;
                emit();
              }
            },
          });
          if (disposed || departed) return;
          const gltf = await new GLTFLoader().parseAsync(loaded.bytes, '');
          const meshes = [];
          gltf.scene.traverse((mesh) => {
            if (mesh.isMesh) meshes.push(mesh);
          });
          if (disposed || departed) {
            meshes.forEach((mesh) => {
              mesh.geometry.dispose();
              mesh.material.dispose();
            });
            return;
          }
          view.model = gltf.scene;
          view.meshes = meshes;
          const expected = view.data.parts.map((part) => part.id);
          if (
            meshes.length !== expected.length ||
            meshes.some((mesh) => !expected.includes(mesh.name)) ||
            new Set(meshes.map((mesh) => mesh.name)).size !== meshes.length
          )
            throw new Error('ชื่อชิ้นส่วนไม่ตรงกับข้อมูลต้นฉบับ');
          const bounds = new T.Box3().setFromObject(view.model),
            sphere = bounds.getBoundingSphere(new T.Sphere());
          view.model.scale.setScalar(1 / sphere.radius);
          view.model.position.copy(sphere.center).multiplyScalar(-1 / sphere.radius);
          for (const [partIndex, mesh] of meshes.entries()) {
            mesh.geometry.computeBoundingBox();
            mesh.userData.originalPosition = mesh.position.clone();
            mesh.userData.explodeDirection = mesh.geometry.boundingBox
              .getCenter(new T.Vector3())
              .sub(sphere.center)
              .normalize();
            mesh.userData.colour = new T.Color().setHSL((partIndex * 0.137 + 0.04) % 1, 0.2, 0.68);
            mesh.userData.boneColour = new T.Color(0xe0d7c4);
            const partMetadata = view.data.parts.find((part) => part.id === mesh.name);
            if (partMetadata?.representation === 'muscle-path') {
              mesh.userData.colour.set(getComputedStyle(el).getPropertyValue('--clr-rose').trim());
            } else if (partMetadata?.representation === 'source-segment') {
              mesh.userData.colour.copy(mesh.userData.boneColour);
            }
            mesh.material.dispose();
            mesh.material = new T.MeshStandardMaterial({ roughness: 0.7, side: T.DoubleSide });
          }
          view.scene.add(view.model);
          applyState();
          fit(view, false, true);
          if (savedPose.current?.id === specimen.id && savedPose.current?.compareId === comparison?.id) {
            const pose = savedPose.current.poses[index];
            if (pose) {
              view.camera.position.fromArray(pose.position);
              view.controls.target.fromArray(pose.target);
              syncing = true;
              view.controls.update();
              syncing = false;
            }
          }
          states[index] = {
            kind: 'ready',
            progress: 100,
            cached: loaded.cached,
            stored: loaded.stored || persisted,
          };
          emit();
          requestRender();
        } catch (error) {
          states[index] = {
            kind: 'error',
            message: abort.signal.aborted
              ? 'โหลดโมเดลนานเกินไป ลองใหม่เมื่ออินเทอร์เน็ตพร้อม'
              : error.message || 'เปิดโมเดลไม่ได้ ลองใหม่ได้',
          };
          emit();
        }
      }),
    ).finally(() => clearTimeout(timeout));
    return () => {
      savedPose.current = {
        id: specimen.id,
        compareId: comparison?.id,
        poses: views.map((view) => ({
          position: view.camera.position.toArray(),
          target: view.controls.target.toArray(),
        })),
      };
      disposed = true;
      engine.current = null;
      abort.abort();
      clearTimeout(timeout);
      if (frame) cancelAnimationFrame(frame);
      resize.disconnect();
      observer.disconnect();
      theme.disconnect();
      document.removeEventListener('visibilitychange', visibility);
      window.removeEventListener('pagehide', pagehide);
      canvas.removeEventListener('webglcontextlost', contextLost);
      for (const view of views) {
        view.cleanups.forEach((cleanup) => cleanup());
        view.controls.dispose();
        view.meshes.forEach((mesh) => {
          mesh.geometry.dispose();
          mesh.material.dispose();
        });
      }
      renderer.dispose();
      renderer.forceContextLoss();
      canvas.remove();
    };
  }, [specimen.id, comparison?.id, quality]);
  useEffect(() => {
    engine.current?.sync();
  }, [selected, visibleIds, exploded, coloured, ghost, cut, command]);
  return (
    <div className={`vmx-atlas-scene-host${comparison ? ' is-comparing' : ''}`} ref={host}>
      <div
        className="vmx-atlas-interaction"
        ref={leftPane}
        role="img"
        tabIndex={0}
        aria-label={`โมเดล ${specimen.title} ลากหรือลูกศรเพื่อหมุน กางนิ้วหรือบวกและลบเพื่อซูม`}
      />
      {comparison && (
        <div
          className="vmx-atlas-interaction"
          ref={rightPane}
          role="img"
          tabIndex={0}
          aria-label={`โมเดลเปรียบเทียบ ${comparison.title} ใช้ลูกศรเพื่อหมุน`}
        />
      )}
    </div>
  );
}
