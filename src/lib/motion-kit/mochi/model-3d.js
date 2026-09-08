import * as THREE from "three";
import { STATES, poseAt } from "./motion.js";
export { STATES };
export function buildMochi({ detail = 24 } = {}) {
  const root = new THREE.Group();
  root.name = "Mochi";
  const rig = {}, m = {};
  const palette = { cream: "#F8E3BD", muzzle: "#FFF0D6", caramel: "#CB955F", inner: "#DCA66E", blush: "#F0B08E", ink: "#38251B", green: "#446C47", darkgreen: "#2E4E35", gold: "#C5A05A", page: "#FFF4D9", pageLine: "#CABB96", pink: "#D88979" };
  for (const [k, color] of Object.entries(palette)) m[k] = new THREE.MeshStandardMaterial({ color, roughness: k === "ink" ? 0.27 : 0.78, metalness: k === "gold" ? 0.3 : 0 });
  const white = new THREE.MeshBasicMaterial({ color: "#FFFDF6" });
  const ballGeo = new THREE.SphereGeometry(1, detail, Math.max(12, detail / 2));
  const group = (name, parent, pos = [0, 0, 0]) => {
    let g = new THREE.Group();
    g.name = name;
    g.position.set(...pos);
    parent.add(g);
    rig[name] = g;
    return g;
  };
  const ball = (name, parent, pos, scale, mat) => {
    let o = new THREE.Mesh(ballGeo, mat);
    o.name = name;
    o.position.set(...pos);
    o.scale.set(...scale);
    o.castShadow = true;
    o.receiveShadow = true;
    parent.add(o);
    return o;
  };
  const tube = (name, parent, points, r, mat) => {
    let curve = new THREE.CatmullRomCurve3(points.map((p) => new THREE.Vector3(...p)));
    let o = new THREE.Mesh(new THREE.TubeGeometry(curve, Math.max(12, points.length * 5), r, 8, false), mat);
    o.name = name;
    o.castShadow = true;
    parent.add(o);
    return o;
  };
  const shape = (name, parent, coords, depth, mat, pos = [0, 0, 0]) => {
    let s = new THREE.Shape();
    coords.forEach(([x, y], i) => i ? s.lineTo(x, y) : s.moveTo(x, y));
    s.closePath();
    let o = new THREE.Mesh(new THREE.ExtrudeGeometry(s, { depth, bevelEnabled: true, bevelSegments: 3, steps: 1, bevelSize: 0.035, bevelThickness: 0.025 }), mat);
    o.name = name;
    o.position.set(...pos);
    parent.add(o);
    return o;
  };
  const paw = (parent, pos, scale, mat) => {
    let g = group(`Paw_${Object.keys(rig).length}`, parent, pos);
    g.scale.setScalar(scale);
    ball("Pad", g, [0, 0, 0], [0.1, 0.075, 0.017], mat);
    [[-0.105, 0.1], [-0.035, 0.155], [0.052, 0.148], [0.12, 0.08]].forEach(([x, y], i) => ball(`ToePad_${i}`, g, [x, y, 2e-3], [0.039, 0.05, 0.018], mat));
    return g;
  };
  const body = group("Body", root);
  ball("Torso", body, [0, 1.02, 0], [0.62, 0.77, 0.42], m.cream);
  ball("Belly", body, [0, 0.94, 0.305], [0.43, 0.49, 0.17], m.muzzle);
  const tail = group("Tail", body, [-0.47, 0.66, -0.17]);
  tube("TailMesh", tail, [[0, 0, 0], [-0.25, 0.1, 0], [-0.41, 0.3, 0], [-0.42, 0.51, 0.01]], 0.095, m.cream);
  ball("TailTip", tail, [-0.42, 0.51, 0.01], [0.095, 0.095, 0.095], m.cream);
  for (const [side, x] of [["L", -0.29], ["R", 0.29]]) {
    const leg = group(`Leg${side}`, body, [x, 0.51, 0]);
    ball(`LegMesh${side}`, leg, [0, -0.15, 0.02], [0.2, 0.31, 0.19], m.cream);
    ball(`Foot${side}`, leg, [0, -0.34, 0.135], [0.225, 0.17, 0.29], m.cream);
    for (const dx of [-0.07, 0.065]) tube(`ToeSeam${side}${dx}`, leg, [[dx, -0.33, 0.411], [dx, -0.38, 0.411], [dx, -0.41, 0.392]], 9e-3, m.caramel);
    const arm = group(`Arm${side}`, body, [Math.sign(x) * 0.57, 1.37, 0]);
    ball(`ArmMesh${side}`, arm, [Math.sign(x) * 0.035, -0.31, 0.075], [0.19, 0.4, 0.2], m.cream);
    ball(`Hand${side}`, arm, [Math.sign(x) * 0.04, -0.56, 0.1], [0.19, 0.2, 0.21], m.cream);
    paw(arm, [Math.sign(x) * 0.04, -0.54, 0.309], 0.8, m.caramel);
  }
  const thinkingArm = group("ThinkShoulder", body, [0.57, 1.37, 0.3]);
  ball("ThinkingUpperArm", thinkingArm, [0, 0, 0], [0.17, 0.17, 0.37], m.cream);
  tube("ScarfNeckBand", body, Array.from({ length: 17 }, (_, i) => {
    const a = i * Math.PI / 8;
    return [0.44 * Math.cos(a), 1.56, 0.33 * Math.sin(a)];
  }), 0.052, m.green);
  shape("Bandana", body, [[-0.48, 1.58], [0.46, 1.58], [0.4, 1.37], [0, 1.08], [-0.4, 1.37]], 0.04, m.green, [0, 0, 0.387]);
  tube("ScarfFold", body, [[-0.43, 1.58, 0.43], [0, 1.47, 0.51], [0.43, 1.58, 0.43]], 0.023, m.darkgreen);
  shape("ScarfKnot", body, [[0.43, 1.49], [0.7, 1.61], [0.68, 1.47], [0.82, 1.34], [0.57, 1.35]], 0.06, m.green, [0, 0, 0.11]);
  paw(body, [0.065, 1.31, 0.46], 0.7, m.muzzle);
  tube("Stethoscope", body, [[-0.39, 1.56, 0.47], [-0.4, 1.19, 0.51], [-0.25, 0.92, 0.5], [0.1, 0.91, 0.53], [0.36, 1.15, 0.53], [0.37, 1.55, 0.46]], 0.028, m.darkgreen);
  ball("Chestpiece", body, [-0.17, 0.88, 0.57], [0.13, 0.13, 0.049], m.gold);
  ball("ChestpieceInset", body, [-0.17, 0.88, 0.615], [0.089, 0.089, 0.015], m.gold);
  const head = group("Head", body, [0, 1.79, 0]);
  ball("HeadMesh", head, [0, 0.56, 0], [1.01, 0.89, 0.71], m.cream);
  const earL = group("EarL", head, [-0.72, 1.09, -0.015]);
  const el = ball("FloppyEar", earL, [-0.17, -0.36, 0.015], [0.27, 0.61, 0.24], m.caramel);
  el.rotation.z = -0.26;
  const eli = ball("FloppyEarInner", earL, [-0.18, -0.36, 0.184], [0.16, 0.4, 0.06], m.inner);
  eli.rotation.z = -0.26;
  const earR = group("EarR", head, [0.6, 1.23, -0.03]);
  const er = ball("FoldedEarTop", earR, [0.16, 0.015, 0], [0.31, 0.35, 0.23], m.caramel);
  er.rotation.z = 0.6;
  const erf = ball("FoldedEarTip", earR, [0.34, -0.18, 0.2], [0.3, 0.23, 0.19], m.caramel);
  erf.rotation.z = -0.45;
  for (const [side, x] of [["L", -0.4], ["R", 0.4]]) {
    const eye = group(`Eye${side}`, head, [x, 0.6, 0.633]);
    ball(`EyeMesh${side}`, eye, [0, 0, 0], [0.125, 0.165, 0.077], m.ink);
    ball(`EyeGlint${side}`, eye, [0.039, 0.066, 0.069], [0.039, 0.039, 0.014], white);
    ball(`EyeSoftGlint${side}`, eye, [-0.028, -0.061, 0.063], [0.015, 0.015, 0.01], m.caramel);
    ball(`Cheek${side}`, head, [Math.sign(x) * 0.64, 0.25, 0.511], [0.145, 0.125, 0.031], m.blush);
  }
  ball("MuzzleL", head, [-0.14, 0.295, 0.665], [0.265, 0.219, 0.12], m.muzzle);
  ball("MuzzleR", head, [0.14, 0.295, 0.665], [0.265, 0.219, 0.12], m.muzzle);
  const nose = shape("Nose", head, [[-0.1, 0.435], [0.1, 0.435], [0.065, 0.378], [0, 0.345], [-0.065, 0.378]], 0.045, m.ink, [0, 0, 0.79]);
  tube("SmileL", head, [[0, 0.35, 0.82], [0, 0.25, 0.804], [-0.075, 0.19, 0.792], [-0.16, 0.205, 0.789], [-0.18, 0.24, 0.786]], 0.018, m.ink);
  tube("SmileR", head, [[0, 0.25, 0.804], [0.075, 0.19, 0.792], [0.16, 0.205, 0.789], [0.18, 0.24, 0.786]], 0.018, m.ink);
  const mouth = group("HappyMouth", head, [0, 0.145, 0.715]);
  ball("OpenMouth", mouth, [0, 0, 0], [0.098, 0.096, 0.059], m.ink);
  ball("Tongue", mouth, [0.015, -0.04, 0.05], [0.055, 0.031, 0.013], m.pink);
  const tuft = ball("ForeheadTuft", head, [-0.14, 1.36, 0.19], [0.28, 0.12, 0.2], m.cream);
  tuft.rotation.z = 0.17;
  const book = group("Book", body, [0, 0.82, 0.76]);
  for (const side of [-1, 1]) {
    const page = group(`BookPage${side}`, book);
    page.rotation.y = side * 0.24;
    shape(`BookCover${side}`, page, [[0, -0.2], [side * 0.51, -0.13], [side * 0.51, 0.37], [0, 0.28]], 0.035, m.green, [0, 0, -0.025]);
    shape(`Paper${side}`, page, [[side * 0.015, -0.15], [side * 0.465, -0.09], [side * 0.465, 0.34], [side * 0.015, 0.245]], 0.022, m.page, [0, 0, 0.038]);
    for (let i = 0; i < 3; i++) tube(`Print${side}${i}`, page, [[side * 0.1, 0.19 - i * 0.09, 0.095], [side * 0.37, 0.235 - i * 0.09, 0.095]], 6e-3, m.pageLine);
  }
  const effects = group("Effects", root);
  const spark = group("Sparkles", effects);
  for (let i = 0; i < 6; i++) {
    const star = group(`Star${i}`, spark, [Math.cos(i * Math.PI / 3) * 1.4, 1.9 + Math.sin(i * Math.PI / 3) * 1.22, 0.04]);
    shape(`StarMesh${i}`, star, [[0, 0.11], [0.033, 0.033], [0.11, 0], [0.033, -0.033], [0, -0.11], [-0.033, -0.033], [-0.11, 0], [-0.033, 0.033]], 0.03, i % 2 ? m.green : m.gold);
  }
  const check = group("Check", effects, [1.2, 2.85, 0.2]);
  ball("CheckBadge", check, [0, 0, 0], [0.26, 0.26, 0.07], m.green);
  tube("CheckMark", check, [[-0.12, 0, 0.09], [-0.035, -0.085, 0.09], [0.13, 0.13, 0.09]], 0.035, m.muzzle);
  const heart = group("Heart", effects, [1.23, 2.41, 0.14]);
  const hs = new THREE.Shape();
  hs.moveTo(0, -0.2);
  hs.bezierCurveTo(-0.5, 0.05, -0.24, 0.42, 0, 0.2);
  hs.bezierCurveTo(0.24, 0.42, 0.5, 0.05, 0, -0.2);
  heart.add(new THREE.Mesh(new THREE.ExtrudeGeometry(hs, { depth: 0.05, bevelEnabled: true, bevelSize: 0.02, bevelThickness: 0.02, bevelSegments: 3 }), m.pink));
  const question = group("Question", effects, [1.16, 3, 0]);
  tube("QuestionMark", question, [[-0.11, 0.17, 0], [-0.08, 0.27, 0], [0.07, 0.29, 0], [0.14, 0.2, 0], [0.1, 0.1, 0], [0, 0.04, 0], [0, -0.03, 0]], 0.035, m.green);
  ball("QuestionDot", question, [0, -0.16, 0], [0.038, 0.038, 0.038], m.green);
  const zzz = group("SleepZ", effects, [1.15, 2.66, 0]);
  for (let i = 0; i < 3; i++) {
    let x = i * 0.21, y = i * 0.35, s = 0.1 + i * 0.024;
    tube(`Z${i}`, zzz, [[x - s, y + s, 0], [x + s, y + s, 0], [x - s, y - s, 0], [x + s, y - s, 0]], 0.016, m.green);
  }
  const original = /* @__PURE__ */ new Map();
  root.traverse((o) => {
    original.set(o.name, { pos: o.position.clone(), scale: o.scale.clone(), q: o.quaternion.clone() });
  });
  const applyPose = (p, t = 0) => {
    body.position.set(p.x, p.y, 0);
    body.rotation.set(0, p.ry, p.rz);
    body.scale.set(p.sx, p.sy, 1);
    head.rotation.set(p.headX, p.headY, p.headZ);
    rig.ArmL.rotation.set(p.armLX, 0, p.armL);
    rig.ArmR.rotation.set(p.armRX, 0, p.armR);
    rig.LegL.rotation.x = p.legL;
    rig.LegR.rotation.x = p.legR;
    rig.LegL.position.y = 0.51 + p.legLiftL;
    rig.LegR.position.y = 0.51 + p.legLiftR;
    rig.ArmL.position.z = p.armLZ;
    rig.ArmR.position.z = p.armRZ;
    thinkingArm.scale.setScalar(Math.max(1e-3, p.thinkArm));
    earL.rotation.z = p.earL;
    earR.rotation.z = p.earR;
    tail.rotation.y = p.tail;
    root.getObjectByName("ScarfKnot").rotation.x = p.scarf;
    for (const side of ["L", "R"]) {
      const eye = rig[`Eye${side}`], base = original.get(`Eye${side}`).pos;
      eye.scale.y = Math.max(0.055, p.eye);
      eye.position.x = base.x + p.gaze;
      eye.position.y = base.y + p.gazeY;
    }
    mouth.scale.setScalar(Math.max(1e-3, p.mouthOpen));
    book.scale.setScalar(Math.max(1e-3, p.book));
    book.rotation.x = p.bookTilt;
    spark.scale.setScalar(Math.max(1e-3, p.spark));
    spark.rotation.y = 0.18 * Math.sin(t);
    heart.scale.setScalar(Math.max(1e-3, p.heart));
    check.scale.setScalar(Math.max(1e-3, p.check));
    question.scale.setScalar(Math.max(1e-3, p.question));
    zzz.scale.setScalar(Math.max(1e-3, p.zzz));
    root.updateMatrixWorld(true);
  };
  const apply = (state, t) => applyPose(poseAt(state, t), t);
  apply("idle", 0);
  return { root, rig, apply, applyPose, palette, original };
}
export function bakeClips(model, fps = 30) {
  const names = ["Body", "Head", "ArmL", "ArmR", "LegL", "LegR", "EarL", "EarR", "Tail", "EyeL", "EyeR", "HappyMouth", "Book", "Sparkles", "Heart", "Check", "Question", "SleepZ", "ThinkShoulder", "ScarfKnot"];
  return Object.entries(STATES).map(([state, meta]) => {
    const times = [], data = {};
    for (const name of names) data[name] = { position: [], quaternion: [], scale: [] };
    const n = Math.round(meta.duration * fps);
    for (let i = 0; i <= n; i++) {
      const t = i / fps, wrap = i === n && meta.loop;
      times.push(t);
      model.applyPose(poseAt(state, wrap ? 0 : t, { loopPhase: wrap ? 0 : i / n }), wrap ? 0 : i / n * Math.PI * 2);
      for (const name of names) {
        const o = model.rig[name] || model.root.getObjectByName(name);
        data[name].position.push(...o.position);
        data[name].quaternion.push(...o.quaternion);
        data[name].scale.push(...o.scale);
      }
    }
    const tracks = [];
    for (const name of names) for (const prop of ["position", "quaternion", "scale"]) {
      const Track = prop === "quaternion" ? THREE.QuaternionKeyframeTrack : THREE.VectorKeyframeTrack;
      tracks.push(new Track(`${name}.${prop}`, times, data[name][prop]));
    }
    const clip = new THREE.AnimationClip(state, meta.duration, tracks);
    clip.optimize();
    return clip;
  });
}
