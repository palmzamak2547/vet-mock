import * as THREE from "three";
import { buildMochi } from "./model-3d.js";
export function createRig3D(host, { label = "Mochi 3D", onError = () => {
} } = {}) {
  let disposed = false, renderer;
  try {
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "low-power" });
  } catch (error) {
    onError(error);
    throw error;
  }
  const scene = new THREE.Scene(), camera = new THREE.PerspectiveCamera(30, 1, 0.1, 30), model = buildMochi({ detail: 20 });
  camera.position.set(3.2, 2.65, 8.4);
  camera.lookAt(0, 1.78, 0);
  renderer.setPixelRatio(Math.min(globalThis.devicePixelRatio || 1, 1.5));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.domElement.className = "vm-mochi-webgl";
  renderer.domElement.setAttribute("role", "img");
  renderer.domElement.setAttribute("aria-label", label);
  host.append(renderer.domElement);
  scene.add(model.root, new THREE.HemisphereLight("#FFF3DD", "#8B9E7C", 2.15));
  const key = new THREE.DirectionalLight("#FFF3DC", 3);
  key.position.set(-3, 6, 5);
  key.castShadow = true;
  key.shadow.mapSize.set(512, 512);
  key.shadow.camera.left = -3;
  key.shadow.camera.right = 3;
  key.shadow.camera.top = 4;
  key.shadow.camera.bottom = -3;
  key.shadow.bias = -1e-3;
  key.shadow.normalBias = 0.035;
  scene.add(key);
  const rim = new THREE.DirectionalLight("#FFFFFF", 1.8);
  rim.position.set(4, 4, -3);
  scene.add(rim);
  const fill = new THREE.DirectionalLight("#E7F0D9", 0.6);
  fill.position.set(4, 2, 3);
  scene.add(fill);
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(10, 10), new THREE.ShadowMaterial({ opacity: 0.12 }));
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = 0.015;
  floor.receiveShadow = true;
  scene.add(floor);
  let angle = 0.36, targetAngle = 0.36, lastPose, lastTime = 0, lost = false;
  function draw() {
    if (!disposed && !lost) renderer.render(scene, camera);
  }
  function resize() {
    if (disposed) return;
    const r = host.getBoundingClientRect(), w = Math.max(1, r.width), h = Math.max(1, r.height);
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    draw();
  }
  const observer = typeof ResizeObserver !== "undefined" ? new ResizeObserver(resize) : null;
  observer?.observe(host);
  const onLost = (e) => {
    e.preventDefault();
    lost = true;
    onError(new Error("WebGL context lost"));
  };
  const onRestored = () => {
    lost = false;
    if (lastPose) model.applyPose(lastPose, lastTime);
    resize();
  };
  renderer.domElement.addEventListener("webglcontextlost", onLost);
  renderer.domElement.addEventListener("webglcontextrestored", onRestored);
  resize();
  return { canvas: renderer.domElement, model, render(p, t = 0, dt = 1 / 60) {
    if (disposed) return;
    lastPose = p;
    lastTime = t;
    model.applyPose(p, t);
    angle += (targetAngle - angle) * (1 - Math.exp(-Math.max(0, dt) * 10));
    camera.position.set(Math.sin(angle) * 8.9, 2.65, Math.cos(angle) * 8.9);
    camera.lookAt(0, 1.78, 0);
    draw();
  }, setView(v, { instant = false } = {}) {
    targetAngle = { front: 0, threequarter: 0.36, side: Math.PI / 2, back: Math.PI }[v] ?? 0.36;
    if (instant) angle = targetAngle;
  }, get stats() {
    return { drawCalls: renderer.info.render.calls, triangles: renderer.info.render.triangles };
  }, destroy() {
    if (disposed) return;
    disposed = true;
    observer?.disconnect();
    renderer.domElement.removeEventListener("webglcontextlost", onLost);
    renderer.domElement.removeEventListener("webglcontextrestored", onRestored);
    const geometries = /* @__PURE__ */ new Set(), materials = /* @__PURE__ */ new Set();
    scene.traverse((o) => {
      if (o.geometry) geometries.add(o.geometry);
      if (o.material) for (const m of Array.isArray(o.material) ? o.material : [o.material]) materials.add(m);
    });
    geometries.forEach((g) => g.dispose());
    materials.forEach((m) => m.dispose());
    renderer.dispose();
    renderer.forceContextLoss();
    renderer.domElement.remove();
  } };
}
