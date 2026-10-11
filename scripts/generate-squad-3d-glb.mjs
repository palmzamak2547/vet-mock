import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import fs from 'node:fs';
import path from 'node:path';

// Polyfill FileReader for Node.js
class SimpleFileReader {
  readAsArrayBuffer(blob) {
    blob.arrayBuffer().then((buf) => {
      this.result = buf;
      if (typeof this.onloadend === 'function') this.onloadend();
    });
  }
}
globalThis.FileReader = SimpleFileReader;

// Helper: Clay / Vinyl PBR Material
function clayMat(color, options = {}) {
  return new THREE.MeshStandardMaterial({
    color,
    roughness: options.roughness ?? 0.52,
    metalness: options.metalness ?? 0.04,
    transparent: options.transparent ?? false,
    opacity: options.opacity ?? 1.0,
    ...options,
  });
}

// Helper: Eye Disks & Blush
function addCuteFace(headGroup, eyeY = 0.02, eyeZ = 0.245, eyeSpacing = 0.1, blushY = -0.04) {
  const eyeGeo = new THREE.CircleGeometry(0.032, 24);
  const eyeMat = new THREE.MeshBasicMaterial({ color: 0x1e293b });
  const eyeL = new THREE.Mesh(eyeGeo, eyeMat);
  eyeL.name = 'Eye_L';
  eyeL.position.set(-eyeSpacing, eyeY, eyeZ);
  const eyeR = new THREE.Mesh(eyeGeo, eyeMat);
  eyeR.name = 'Eye_R';
  eyeR.position.set(eyeSpacing, eyeY, eyeZ);
  headGroup.add(eyeL, eyeR);

  // Highlights
  const hiGeo = new THREE.CircleGeometry(0.011, 16);
  const hiMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const hiL = new THREE.Mesh(hiGeo, hiMat);
  hiL.position.set(-eyeSpacing + 0.01, eyeY + 0.012, eyeZ + 0.002);
  const hiR = new THREE.Mesh(hiGeo, hiMat);
  hiR.position.set(eyeSpacing + 0.01, eyeY + 0.012, eyeZ + 0.002);
  headGroup.add(hiL, hiR);

  // Secondary baby catchlight
  const hiSmallGeo = new THREE.CircleGeometry(0.005, 12);
  const hiSmallL = new THREE.Mesh(hiSmallGeo, hiMat);
  hiSmallL.position.set(-eyeSpacing - 0.008, eyeY - 0.008, eyeZ + 0.002);
  const hiSmallR = new THREE.Mesh(hiSmallGeo, hiMat);
  hiSmallR.position.set(eyeSpacing - 0.008, eyeY - 0.008, eyeZ + 0.002);
  headGroup.add(hiSmallL, hiSmallR);

  // Blush Cheeks
  const blushGeo = new THREE.CircleGeometry(0.038, 20);
  const blushMat = new THREE.MeshBasicMaterial({ color: 0xf472b6, transparent: true, opacity: 0.55 });
  const bL = new THREE.Mesh(blushGeo, blushMat);
  bL.name = 'Blush_L';
  bL.position.set(-eyeSpacing - 0.06, blushY, eyeZ - 0.015);
  const bR = new THREE.Mesh(blushGeo, blushMat);
  bR.name = 'Blush_R';
  bR.position.set(eyeSpacing + 0.06, blushY, eyeZ - 0.015);
  headGroup.add(bL, bR);
}

// Helper: Build Standard Chibi Animation Clips (Embedded in GLB)
function buildStandardClips(hasTail = false, defaultHeadY = 0.56, defaultArmAngle = 0.35) {
  // 1. Idle Loop (2.0s): Breathing, head sway, tail wag
  const idleTimes = [0, 1.0, 2.0];
  const bodyScaleTracks = new THREE.VectorKeyframeTrack(
    'Body.scale',
    idleTimes,
    [1, 1, 1,  1.02, 1.04, 1.02,  1, 1, 1]
  );
  const headPosTracks = new THREE.VectorKeyframeTrack(
    'Head.position',
    idleTimes,
    [0, defaultHeadY, 0,  0, defaultHeadY + 0.012, 0,  0, defaultHeadY, 0]
  );

  const qNeutral = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0));
  const qHeadTilt = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0.04));
  const headRotTracks = new THREE.QuaternionKeyframeTrack(
    'Head.quaternion',
    idleTimes,
    [qNeutral.x, qNeutral.y, qNeutral.z, qNeutral.w,
     qHeadTilt.x, qHeadTilt.y, qHeadTilt.z, qHeadTilt.w,
     qNeutral.x, qNeutral.y, qNeutral.z, qNeutral.w]
  );

  const qArmR_0 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, -defaultArmAngle));
  const qArmR_1 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, -defaultArmAngle - 0.08));
  const armRTracks = new THREE.QuaternionKeyframeTrack(
    'Arm_R.quaternion',
    idleTimes,
    [qArmR_0.x, qArmR_0.y, qArmR_0.z, qArmR_0.w,
     qArmR_1.x, qArmR_1.y, qArmR_1.z, qArmR_1.w,
     qArmR_0.x, qArmR_0.y, qArmR_0.z, qArmR_0.w]
  );

  const qArmL_0 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, defaultArmAngle));
  const qArmL_1 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, defaultArmAngle + 0.08));
  const armLTracks = new THREE.QuaternionKeyframeTrack(
    'Arm_L.quaternion',
    idleTimes,
    [qArmL_0.x, qArmL_0.y, qArmL_0.z, qArmL_0.w,
     qArmL_1.x, qArmL_1.y, qArmL_1.z, qArmL_1.w,
     qArmL_0.x, qArmL_0.y, qArmL_0.z, qArmL_0.w]
  );

  const idleTracks = [bodyScaleTracks, headPosTracks, headRotTracks, armRTracks, armLTracks];

  if (hasTail) {
    const qTail_0 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, -0.15, 0));
    const qTail_1 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0.15, 0));
    const tailTracks = new THREE.QuaternionKeyframeTrack(
      'Tail.quaternion',
      idleTimes,
      [qTail_0.x, qTail_0.y, qTail_0.z, qTail_0.w,
       qTail_1.x, qTail_1.y, qTail_1.z, qTail_1.w,
       qTail_0.x, qTail_0.y, qTail_0.z, qTail_0.w]
    );
    idleTracks.push(tailTracks);
  }

  const clipIdle = new THREE.AnimationClip('idle', 2.0, idleTracks);

  // 2. Wave Clip (1.5s): Arm_R waves enthusiastically
  const waveTimes = [0, 0.3, 0.6, 0.9, 1.2, 1.5];
  const qWaveUp = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, -2.0));
  const qWaveIn = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, -1.6));
  const qWaveOut = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, -2.2));

  const waveArmR = new THREE.QuaternionKeyframeTrack(
    'Arm_R.quaternion',
    waveTimes,
    [
      qArmR_0.x, qArmR_0.y, qArmR_0.z, qArmR_0.w,
      qWaveUp.x, qWaveUp.y, qWaveUp.z, qWaveUp.w,
      qWaveIn.x, qWaveIn.y, qWaveIn.z, qWaveIn.w,
      qWaveOut.x, qWaveOut.y, qWaveOut.z, qWaveOut.w,
      qWaveIn.x, qWaveIn.y, qWaveIn.z, qWaveIn.w,
      qArmR_0.x, qArmR_0.y, qArmR_0.z, qArmR_0.w,
    ]
  );

  const qHeadWave = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, -0.08));
  const waveHead = new THREE.QuaternionKeyframeTrack(
    'Head.quaternion',
    waveTimes,
    [
      qNeutral.x, qNeutral.y, qNeutral.z, qNeutral.w,
      qHeadWave.x, qHeadWave.y, qHeadWave.z, qHeadWave.w,
      qNeutral.x, qNeutral.y, qNeutral.z, qNeutral.w,
      qHeadWave.x, qHeadWave.y, qHeadWave.z, qHeadWave.w,
      qNeutral.x, qNeutral.y, qNeutral.z, qNeutral.w,
      qNeutral.x, qNeutral.y, qNeutral.z, qNeutral.w,
    ]
  );

  const clipWave = new THREE.AnimationClip('wave', 1.5, [waveArmR, waveHead]);

  // 3. Celebrate Clip (1.6s): Happy Jump, Both arms raised
  const celTimes = [0, 0.2, 0.45, 0.7, 0.95, 1.2, 1.6];
  const celRootPos = new THREE.VectorKeyframeTrack(
    'Mascot_Root.position',
    celTimes,
    [
      0, 0, 0,
      0, -0.03, 0,   // squash prep
      0, 0.16, 0,    // peak jump 1
      0, 0, 0,       // land
      0, 0.12, 0,    // peak jump 2
      0, 0, 0,       // land
      0, 0, 0,
    ]
  );

  const qCheerR = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, -2.3));
  const qCheerL = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 2.3));

  const celArmR = new THREE.QuaternionKeyframeTrack(
    'Arm_R.quaternion',
    celTimes,
    [
      qArmR_0.x, qArmR_0.y, qArmR_0.z, qArmR_0.w,
      qArmR_0.x, qArmR_0.y, qArmR_0.z, qArmR_0.w,
      qCheerR.x, qCheerR.y, qCheerR.z, qCheerR.w,
      qWaveUp.x, qWaveUp.y, qWaveUp.z, qWaveUp.w,
      qCheerR.x, qCheerR.y, qCheerR.z, qCheerR.w,
      qArmR_0.x, qArmR_0.y, qArmR_0.z, qArmR_0.w,
      qArmR_0.x, qArmR_0.y, qArmR_0.z, qArmR_0.w,
    ]
  );

  const celArmL = new THREE.QuaternionKeyframeTrack(
    'Arm_L.quaternion',
    celTimes,
    [
      qArmL_0.x, qArmL_0.y, qArmL_0.z, qArmL_0.w,
      qArmL_0.x, qArmL_0.y, qArmL_0.z, qArmL_0.w,
      qCheerL.x, qCheerL.y, qCheerL.z, qCheerL.w,
      qArmL_1.x, qArmL_1.y, qArmL_1.z, qArmL_1.w,
      qCheerL.x, qCheerL.y, qCheerL.z, qCheerL.w,
      qArmL_0.x, qArmL_0.y, qArmL_0.z, qArmL_0.w,
      qArmL_0.x, qArmL_0.y, qArmL_0.z, qArmL_0.w,
    ]
  );

  const qHeadJoy = new THREE.Quaternion().setFromEuler(new THREE.Euler(-0.15, 0, 0)); // look up with joy
  const celHead = new THREE.QuaternionKeyframeTrack(
    'Head.quaternion',
    celTimes,
    [
      qNeutral.x, qNeutral.y, qNeutral.z, qNeutral.w,
      qNeutral.x, qNeutral.y, qNeutral.z, qNeutral.w,
      qHeadJoy.x, qHeadJoy.y, qHeadJoy.z, qHeadJoy.w,
      qNeutral.x, qNeutral.y, qNeutral.z, qNeutral.w,
      qHeadJoy.x, qHeadJoy.y, qHeadJoy.z, qHeadJoy.w,
      qNeutral.x, qNeutral.y, qNeutral.z, qNeutral.w,
      qNeutral.x, qNeutral.y, qNeutral.z, qNeutral.w,
    ]
  );

  const clipCelebrate = new THREE.AnimationClip('celebrate', 1.6, [celRootPos, celArmR, celArmL, celHead]);

  return [clipIdle, clipWave, clipCelebrate];
}

// -------------------------------------------------------------
// Pop Mart / Art Toy Sculpting Helpers
// -------------------------------------------------------------
function createChibiHeadGeometry() {
  const pts = [
    new THREE.Vector2(0.001, -0.22),
    new THREE.Vector2(0.09, -0.215),
    new THREE.Vector2(0.18, -0.19),
    new THREE.Vector2(0.25, -0.14),
    new THREE.Vector2(0.285, -0.05), // Chubby cheek apex
    new THREE.Vector2(0.282, 0.03),  // Eye line
    new THREE.Vector2(0.262, 0.11),  // Temple
    new THREE.Vector2(0.22, 0.18),   // Forehead
    new THREE.Vector2(0.15, 0.23),   // Crown
    new THREE.Vector2(0.001, 0.245), // Top
  ];
  const geo = new THREE.LatheGeometry(pts, 48);
  geo.computeVertexNormals();
  return geo;
}

function createChibiTorsoGeometry() {
  const pts = [
    new THREE.Vector2(0.001, -0.18),
    new THREE.Vector2(0.10, -0.175),
    new THREE.Vector2(0.19, -0.14),
    new THREE.Vector2(0.24, -0.06),  // Potbelly curve
    new THREE.Vector2(0.242, 0.01),  // Chubby waist
    new THREE.Vector2(0.22, 0.08),   // Chest
    new THREE.Vector2(0.175, 0.15),  // Shoulders
    new THREE.Vector2(0.13, 0.175),  // Neck
    new THREE.Vector2(0.001, 0.18),
  ];
  const geo = new THREE.LatheGeometry(pts, 40);
  geo.computeVertexNormals();
  return geo;
}

function addPopMartEyes(headGroup, eyeY = 0.025, eyeZ = 0.25, eyeSpacing = 0.118) {
  // 3D Glossy Acrylic Eyeball (Black resin)
  const eyeBallGeo = new THREE.SphereGeometry(0.044, 32, 24);
  eyeBallGeo.scale(1.0, 1.15, 0.5);
  const eyeBallMat = new THREE.MeshStandardMaterial({
    color: 0x0a0f1d,
    roughness: 0.03,
    metalness: 0.05,
  });

  // Dual-Layer 3D Sparkle / Catchlights
  const shineBigGeo = new THREE.SphereGeometry(0.014, 16, 16);
  const shineMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const shineSmallGeo = new THREE.SphereGeometry(0.0068, 12, 12);

  // Left Eye
  const eyeLGroup = new THREE.Group();
  eyeLGroup.name = 'Eye_L';
  eyeLGroup.position.set(-eyeSpacing, eyeY, eyeZ);

  const ballL = new THREE.Mesh(eyeBallGeo, eyeBallMat);
  eyeLGroup.add(ballL);

  const shineBigL = new THREE.Mesh(shineBigGeo, shineMat);
  shineBigL.position.set(0.014, 0.015, 0.018);
  eyeLGroup.add(shineBigL);

  const shineSmallL = new THREE.Mesh(shineSmallGeo, shineMat);
  shineSmallL.position.set(-0.012, -0.014, 0.018);
  eyeLGroup.add(shineSmallL);

  // Right Eye
  const eyeRGroup = new THREE.Group();
  eyeRGroup.name = 'Eye_R';
  eyeRGroup.position.set(eyeSpacing, eyeY, eyeZ);

  const ballR = new THREE.Mesh(eyeBallGeo, eyeBallMat);
  eyeRGroup.add(ballR);

  const shineBigR = new THREE.Mesh(shineBigGeo, shineMat);
  shineBigR.position.set(0.014, 0.015, 0.018);
  eyeRGroup.add(shineBigR);

  const shineSmallR = new THREE.Mesh(shineSmallGeo, shineMat);
  shineSmallR.position.set(-0.012, -0.014, 0.018);
  eyeRGroup.add(shineSmallR);

  headGroup.add(eyeLGroup, eyeRGroup);

  // 3D Soft Cheeks Blush
  const blushGeo = new THREE.SphereGeometry(0.052, 24, 16);
  blushGeo.scale(1.3, 0.7, 0.25);
  const blushMat = new THREE.MeshStandardMaterial({
    color: 0xf472b6,
    roughness: 0.7,
    transparent: true,
    opacity: 0.65,
  });
  const bL = new THREE.Mesh(blushGeo, blushMat);
  bL.name = 'Blush_L';
  bL.position.set(-eyeSpacing - 0.068, eyeY - 0.055, eyeZ - 0.02);
  bL.rotation.y = -0.35;
  bL.rotation.z = -0.15;

  const bR = new THREE.Mesh(blushGeo, blushMat);
  bR.name = 'Blush_R';
  bR.position.set(eyeSpacing + 0.068, eyeY - 0.055, eyeZ - 0.02);
  bR.rotation.y = 0.35;
  bR.rotation.z = 0.15;

  headGroup.add(bL, bR);
}

function buildCurvedHorn(isLeft = true) {
  const sign = isLeft ? -1 : 1;
  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(sign * 0.025, 0.035, 0.01),
    new THREE.Vector3(sign * 0.06, 0.075, 0.018),
    new THREE.Vector3(sign * 0.085, 0.105, 0.012),
  ]);
  const tubeGeo = new THREE.TubeGeometry(curve, 20, 0.025, 16, false);
  const hornMat = clayMat(0xffe89e, { roughness: 0.28, metalness: 0.05 });
  const hornMesh = new THREE.Mesh(tubeGeo, hornMat);

  const tipGeo = new THREE.SphereGeometry(0.024, 16, 12);
  const tipMesh = new THREE.Mesh(tipGeo, hornMat);
  tipMesh.position.set(sign * 0.085, 0.105, 0.012);
  hornMesh.add(tipMesh);

  return hornMesh;
}

function buildCalfEar(isLeft = true) {
  const earGroup = new THREE.Group();
  const sign = isLeft ? -1 : 1;

  const earGeo = new THREE.SphereGeometry(0.088, 24, 16);
  earGeo.scale(1.2, 0.6, 0.35);
  const earColor = isLeft ? 0x1e1b2e : 0xfcfcfc;
  const earMat = clayMat(earColor, { roughness: 0.4 });
  const earMesh = new THREE.Mesh(earGeo, earMat);
  earGroup.add(earMesh);

  const innerGeo = new THREE.SphereGeometry(0.068, 20, 14);
  innerGeo.scale(1.1, 0.5, 0.25);
  const innerMat = clayMat(0xfbcfe8, { roughness: 0.65 });
  const innerMesh = new THREE.Mesh(innerGeo, innerMat);
  innerMesh.position.set(0, 0, 0.02);
  earGroup.add(innerMesh);

  earGroup.rotation.z = sign * 0.55;
  earGroup.rotation.y = sign * 0.25;
  earGroup.rotation.x = 0.1;

  return earGroup;
}

function buildWellingtonBoot() {
  const bootGroup = new THREE.Group();
  const bootColor = 0x2d6a4f; // Emerald green satin rubber
  const bootMat = clayMat(bootColor, { roughness: 0.32 });
  const soleMat = clayMat(0x1b4332, { roughness: 0.45 });

  // Shaft
  const shaftGeo = new THREE.CylinderGeometry(0.062, 0.065, 0.13, 24);
  const shaft = new THREE.Mesh(shaftGeo, bootMat);
  shaft.position.y = 0.065;
  bootGroup.add(shaft);

  // Top Collar Rim (Beveled Cuff)
  const collarGeo = new THREE.TorusGeometry(0.063, 0.01, 12, 24);
  collarGeo.rotateX(Math.PI / 2);
  const collar = new THREE.Mesh(collarGeo, bootMat);
  collar.position.y = 0.125;
  bootGroup.add(collar);

  // Puffy Rounded Toe Box
  const toeGeo = new THREE.SphereGeometry(0.066, 24, 16);
  toeGeo.scale(1.05, 0.85, 1.35);
  const toe = new THREE.Mesh(toeGeo, bootMat);
  toe.position.set(0, 0.04, 0.05);
  bootGroup.add(toe);

  // Thick Outsole Sole
  const soleGeo = new THREE.CylinderGeometry(0.072, 0.075, 0.024, 24);
  soleGeo.scale(1.0, 1.0, 1.45);
  const sole = new THREE.Mesh(soleGeo, soleMat);
  sole.position.set(0, 0.012, 0.04);
  bootGroup.add(sole);

  return bootGroup;
}

// -------------------------------------------------------------
// 1. Moocha (มูชา) — Holstein Calf (Pop Mart / Art Toy Edition)
// -------------------------------------------------------------
function buildMoocha() {
  const root = new THREE.Group();
  root.name = 'Mascot_Root';

  // Body Group
  const bodyGroup = new THREE.Group();
  bodyGroup.name = 'Body';
  bodyGroup.position.y = 0.32;
  root.add(bodyGroup);

  // Torso Mesh (White Satin Calf Skin)
  const torsoGeo = createChibiTorsoGeometry();
  const bodyMat = clayMat(0xfcfcfc, { roughness: 0.38 });
  const torsoMesh = new THREE.Mesh(torsoGeo, bodyMat);
  bodyGroup.add(torsoMesh);

  // Denim Overalls (Dungarees)
  const dungareeMat = clayMat(0x3b82f6, { roughness: 0.68 });
  const dungareePts = [
    new THREE.Vector2(0.001, -0.175),
    new THREE.Vector2(0.105, -0.17),
    new THREE.Vector2(0.195, -0.135),
    new THREE.Vector2(0.245, -0.055),
    new THREE.Vector2(0.246, 0.015),
    new THREE.Vector2(0.222, 0.07),
    new THREE.Vector2(0.001, 0.07),
  ];
  const dungareeGeo = new THREE.LatheGeometry(dungareePts, 40);
  const dungareeMesh = new THREE.Mesh(dungareeGeo, dungareeMat);
  bodyGroup.add(dungareeMesh);

  // Front Overalls Bib (Curved plate covering chest)
  const bibGeo = new THREE.CylinderGeometry(0.19, 0.22, 0.12, 24, 1, false, -Math.PI / 3.2, Math.PI / 1.6);
  const bibMesh = new THREE.Mesh(bibGeo, dungareeMat);
  bibMesh.position.set(0, 0.065, 0.038);
  bodyGroup.add(bibMesh);

  // Kangaroo Front Pocket
  const pocketGeo = new THREE.BoxGeometry(0.13, 0.075, 0.018);
  const pocketMat = clayMat(0x2563eb, { roughness: 0.72 });
  const pocketMesh = new THREE.Mesh(pocketGeo, pocketMat);
  pocketMesh.position.set(0, 0.03, 0.245);
  bodyGroup.add(pocketMesh);

  // Overalls Shoulder Straps
  const strapCurveL = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.11, 0.11, 0.18),
    new THREE.Vector3(-0.13, 0.17, 0.08),
    new THREE.Vector3(-0.11, 0.11, -0.18),
  ]);
  const strapGeoL = new THREE.TubeGeometry(strapCurveL, 20, 0.016, 12, false);
  const strapL = new THREE.Mesh(strapGeoL, dungareeMat);

  const strapCurveR = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.11, 0.11, 0.18),
    new THREE.Vector3(0.13, 0.17, 0.08),
    new THREE.Vector3(0.11, 0.11, -0.18),
  ]);
  const strapGeoR = new THREE.TubeGeometry(strapCurveR, 20, 0.016, 12, false);
  const strapR = new THREE.Mesh(strapGeoR, dungareeMat);
  bodyGroup.add(strapL, strapR);

  // Metallic Gold Buttons
  const btnGeo = new THREE.SphereGeometry(0.016, 16, 16);
  btnGeo.scale(1.0, 1.0, 0.5);
  const btnMat = clayMat(0xf59e0b, { metalness: 0.85, roughness: 0.2 });
  const btnL = new THREE.Mesh(btnGeo, btnMat);
  btnL.position.set(-0.10, 0.105, 0.198);
  const btnR = new THREE.Mesh(btnGeo, btnMat);
  btnR.position.set(0.10, 0.105, 0.198);
  bodyGroup.add(btnL, btnR);

  // Holstein Black Cow Spots on Torso
  const spotGeo1 = new THREE.SphereGeometry(0.095, 20, 16);
  spotGeo1.scale(1.1, 0.7, 0.4);
  const spotMat = clayMat(0x1e1b2e, { roughness: 0.42 });
  const spot1 = new THREE.Mesh(spotGeo1, spotMat);
  spot1.position.set(0.13, 0.04, 0.18);
  spot1.rotation.y = 0.5;
  bodyGroup.add(spot1);

  const spotGeo2 = new THREE.SphereGeometry(0.11, 20, 16);
  spotGeo2.scale(1.2, 0.9, 0.4);
  const spot2 = new THREE.Mesh(spotGeo2, spotMat);
  spot2.position.set(-0.12, 0.08, -0.17);
  spot2.rotation.y = -0.5;
  bodyGroup.add(spot2);

  // Stethoscope around neck
  const stethCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.13, 0.20, 0.04),
    new THREE.Vector3(-0.08, 0.16, 0.18),
    new THREE.Vector3(0, 0.11, 0.235), // Y-joint
    new THREE.Vector3(0.08, 0.16, 0.18),
    new THREE.Vector3(0.13, 0.20, 0.04),
  ]);
  const stethTubeGeo = new THREE.TubeGeometry(stethCurve, 24, 0.012, 12, false);
  const stethMat = clayMat(0x0284c7, { roughness: 0.35 });
  const stethMesh = new THREE.Mesh(stethTubeGeo, stethMat);
  bodyGroup.add(stethMesh);

  // Stethoscope Chestpiece (Double-tier metallic bell)
  const chestpieceGroup = new THREE.Group();
  const bellGeo = new THREE.CylinderGeometry(0.034, 0.036, 0.012, 24);
  const bellMat = clayMat(0xe2e8f0, { metalness: 0.88, roughness: 0.15 });
  const bellMesh = new THREE.Mesh(bellGeo, bellMat);
  chestpieceGroup.add(bellMesh);

  const diaphragmGeo = new THREE.CylinderGeometry(0.028, 0.028, 0.005, 24);
  const diaphragmMat = clayMat(0x38bdf8, { roughness: 0.4 });
  const diaMesh = new THREE.Mesh(diaphragmGeo, diaphragmMat);
  diaMesh.position.y = 0.007;
  chestpieceGroup.add(diaMesh);

  chestpieceGroup.rotation.x = Math.PI / 2.1;
  chestpieceGroup.position.set(0, 0.065, 0.245);
  bodyGroup.add(chestpieceGroup);

  // -------------------------------------------------------------
  // Head Group
  // -------------------------------------------------------------
  const headGroup = new THREE.Group();
  headGroup.name = 'Head';
  headGroup.position.y = 0.56;

  // Head Mesh (Chubby Cheek Vinyl Sculpture)
  const headGeo = createChibiHeadGeometry();
  const headMesh = new THREE.Mesh(headGeo, bodyMat);
  headGroup.add(headMesh);

  // Holstein Black Cow Spot over Left Eye / Forehead
  const headSpotGeo = new THREE.SphereGeometry(0.145, 24, 20);
  headSpotGeo.scale(1.15, 0.95, 0.55);
  const headSpotMesh = new THREE.Mesh(headSpotGeo, spotMat);
  headSpotMesh.position.set(-0.12, 0.07, 0.17);
  headSpotMesh.rotation.z = 0.35;
  headGroup.add(headSpotMesh);

  // Secondary spot on top right rear
  const rearSpotGeo = new THREE.SphereGeometry(0.09, 16, 14);
  rearSpotGeo.scale(1.0, 0.8, 0.5);
  const rearSpotMesh = new THREE.Mesh(rearSpotGeo, spotMat);
  rearSpotMesh.position.set(0.14, 0.12, -0.14);
  headGroup.add(rearSpotMesh);

  // Cute Peach-Cream Snout / Muzzle
  const snoutGeo = new THREE.SphereGeometry(0.11, 32, 24);
  snoutGeo.scale(1.4, 0.85, 0.95);
  const snoutMat = clayMat(0xffcad4, { roughness: 0.42 });
  const snoutMesh = new THREE.Mesh(snoutGeo, snoutMat);
  snoutMesh.position.set(0, -0.055, 0.205);
  headGroup.add(snoutMesh);

  // 3D Nostrils
  const nosMat = clayMat(0xde7a8d, { roughness: 0.55 });
  const nosGeo = new THREE.SphereGeometry(0.016, 16, 12);
  nosGeo.scale(1.0, 0.75, 0.5);
  const nosL = new THREE.Mesh(nosGeo, nosMat);
  nosL.position.set(-0.048, -0.042, 0.29);
  nosL.rotation.z = 0.25;
  const nosR = new THREE.Mesh(nosGeo, nosMat);
  nosR.position.set(0.048, -0.042, 0.29);
  nosR.rotation.z = -0.25;
  headGroup.add(nosL, nosR);

  // 3D Happy Mouth Smile Line
  const smileCurve = new THREE.QuadraticBezierCurve3(
    new THREE.Vector3(-0.042, -0.088, 0.265),
    new THREE.Vector3(0, -0.104, 0.278),
    new THREE.Vector3(0.042, -0.088, 0.265)
  );
  const smileGeo = new THREE.TubeGeometry(smileCurve, 16, 0.0042, 8, false);
  const smileMat = clayMat(0xb91c1c, { roughness: 0.4 });
  const smileMesh = new THREE.Mesh(smileGeo, smileMat);
  headGroup.add(smileMesh);

  // Curved Baby Horns
  const hornL = buildCurvedHorn(true);
  hornL.position.set(-0.13, 0.22, 0.02);
  const hornR = buildCurvedHorn(false);
  hornR.position.set(0.13, 0.22, 0.02);
  headGroup.add(hornL, hornR);

  // Floppy Baby Calf Ears
  const earL = buildCalfEar(true);
  earL.position.set(-0.25, 0.08, 0.01);
  const earR = buildCalfEar(false);
  earR.position.set(0.25, 0.08, 0.01);
  headGroup.add(earL, earR);

  // Yellow Clinic Ear Tag on Right Ear
  const tagGroup = new THREE.Group();
  const tagGeo = new THREE.BoxGeometry(0.048, 0.072, 0.008);
  const tagMat = clayMat(0xfbbf24, { roughness: 0.35 });
  const tagMesh = new THREE.Mesh(tagGeo, tagMat);
  tagGroup.add(tagMesh);

  // Gold Ring Piercing Ear
  const ringGeo = new THREE.TorusGeometry(0.014, 0.0035, 12, 20);
  const ringMat = clayMat(0xf59e0b, { metalness: 0.9, roughness: 0.18 });
  const ringMesh = new THREE.Mesh(ringGeo, ringMat);
  ringMesh.position.y = 0.034;
  tagGroup.add(ringMesh);

  tagGroup.position.set(0.285, 0.05, 0.035);
  tagGroup.rotation.z = -0.4;
  tagGroup.rotation.y = 0.2;
  headGroup.add(tagGroup);

  // 3D Eyes, Catchlights & Blush
  addPopMartEyes(headGroup, 0.025, 0.245, 0.118);

  root.add(headGroup);

  // -------------------------------------------------------------
  // Arms
  // -------------------------------------------------------------
  const armColor = 0xfcfcfc;
  const armMat = clayMat(armColor, { roughness: 0.38 });

  // Left Arm (Chubby baby arm)
  const armL = new THREE.Group();
  armL.name = 'Arm_L';
  armL.position.set(-0.20, 0.34, 0.02);

  const armGeoL = new THREE.CylinderGeometry(0.042, 0.052, 0.18, 20);
  const armMeshL = new THREE.Mesh(armGeoL, armMat);
  armMeshL.position.y = -0.09;
  armL.add(armMeshL);

  const handGeoL = new THREE.SphereGeometry(0.052, 20, 16);
  const handMeshL = new THREE.Mesh(handGeoL, armMat);
  handMeshL.position.y = -0.17;
  armL.add(handMeshL);

  armL.rotation.z = 0.35;
  root.add(armL);

  // Right Arm
  const armR = new THREE.Group();
  armR.name = 'Arm_R';
  armR.position.set(0.20, 0.34, 0.02);

  const armGeoR = new THREE.CylinderGeometry(0.042, 0.052, 0.18, 20);
  const armMeshR = new THREE.Mesh(armGeoR, armMat);
  armMeshR.position.y = -0.09;
  armR.add(armMeshR);

  const handGeoR = new THREE.SphereGeometry(0.052, 20, 16);
  const handMeshR = new THREE.Mesh(handGeoR, armMat);
  handMeshR.position.y = -0.17;
  armR.add(handMeshR);

  armR.rotation.z = -0.35;
  root.add(armR);

  // -------------------------------------------------------------
  // Legs & Boots
  // -------------------------------------------------------------
  const legL = new THREE.Group();
  legL.name = 'Leg_L';
  legL.position.set(-0.11, 0.13, 0.02);
  const bootL = buildWellingtonBoot();
  bootL.position.y = -0.13;
  legL.add(bootL);
  root.add(legL);

  const legR = new THREE.Group();
  legR.name = 'Leg_R';
  legR.position.set(0.11, 0.13, 0.02);
  const bootR = buildWellingtonBoot();
  bootR.position.y = -0.13;
  legR.add(bootR);
  root.add(legR);

  // -------------------------------------------------------------
  // Tail
  // -------------------------------------------------------------
  const tailGroup = new THREE.Group();
  tailGroup.name = 'Tail';
  tailGroup.position.set(0, 0.26, -0.18);

  const tailCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0, -0.04, -0.06),
    new THREE.Vector3(0.03, -0.08, -0.11),
    new THREE.Vector3(0.05, -0.05, -0.15),
  ]);
  const tailTubeGeo = new THREE.TubeGeometry(tailCurve, 16, 0.014, 12, false);
  const tailTube = new THREE.Mesh(tailTubeGeo, bodyMat);
  tailGroup.add(tailTube);

  const tuftGeo = new THREE.SphereGeometry(0.028, 16, 12);
  tuftGeo.scale(1.0, 1.4, 0.8);
  const tuftMesh = new THREE.Mesh(tuftGeo, spotMat);
  tuftMesh.position.set(0.05, -0.05, -0.15);
  tailGroup.add(tuftMesh);

  root.add(tailGroup);

  return { root, clips: buildStandardClips(true, 0.56, 0.35) };
}

// -------------------------------------------------------------
// 2. Glidy (ไกลดี้) — Sugar Glider
// -------------------------------------------------------------
function buildGlidy() {
  const root = new THREE.Group();
  root.name = 'Mascot_Root';

  // Torso & Khaki Vest
  const bodyGeo = new THREE.CylinderGeometry(0.16, 0.19, 0.28, 24);
  const vestMesh = new THREE.Mesh(bodyGeo, clayMat(0xc2b280));
  vestMesh.name = 'Body';
  vestMesh.position.y = 0.28;
  root.add(vestMesh);

  // Satchel Leather Bag
  const bagGeo = new THREE.BoxGeometry(0.09, 0.07, 0.04);
  const bagMat = clayMat(0x8b5e3c);
  const bagMesh = new THREE.Mesh(bagGeo, bagMat);
  bagMesh.position.set(0.13, 0.23, 0.14);
  bagMesh.rotation.z = -0.2;
  vestMesh.add(bagMesh);

  // Head Group
  const headGroup = new THREE.Group();
  headGroup.name = 'Head';
  headGroup.position.y = 0.52;

  const headGeo = new THREE.SphereGeometry(0.24, 32, 24);
  headGeo.scale(1.18, 0.98, 1.0);
  const headMesh = new THREE.Mesh(headGeo, clayMat(0xe2e8f0));
  headGroup.add(headMesh);

  // Stripe
  const stripeGeo = new THREE.CylinderGeometry(0.028, 0.045, 0.28, 16);
  stripeGeo.scale(1.0, 1.0, 0.3);
  const stripeMat = clayMat(0x334155);
  const stripeMesh = new THREE.Mesh(stripeGeo, stripeMat);
  stripeMesh.position.set(0, 0.12, 0.20);
  headGroup.add(stripeMesh);

  // Big cute ears
  const earGeo = new THREE.ConeGeometry(0.11, 0.22, 16);
  earGeo.scale(1.1, 1.0, 0.35);
  const earMat = clayMat(0x334155);
  const earInnerMat = clayMat(0xfda4af);

  const earL = new THREE.Mesh(earGeo, earMat);
  earL.position.set(-0.20, 0.22, 0.0);
  earL.rotation.z = 0.45;

  const earLIn = new THREE.Mesh(earGeo, earInnerMat);
  earLIn.scale.set(0.7, 0.7, 0.5);
  earLIn.position.set(-0.20, 0.21, 0.02);
  earLIn.rotation.z = 0.45;

  const earR = new THREE.Mesh(earGeo, earMat);
  earR.position.set(0.20, 0.22, 0.0);
  earR.rotation.z = -0.45;

  const earRIn = new THREE.Mesh(earGeo, earInnerMat);
  earRIn.scale.set(0.7, 0.7, 0.5);
  earRIn.position.set(0.20, 0.21, 0.02);
  earRIn.rotation.z = -0.45;

  headGroup.add(earL, earLIn, earR, earRIn);

  // Nose
  const noseGeo = new THREE.SphereGeometry(0.02, 12, 8);
  noseGeo.scale(1.2, 0.8, 0.8);
  const noseMesh = new THREE.Mesh(noseGeo, clayMat(0xfda4af));
  noseMesh.position.set(0, -0.04, 0.24);
  headGroup.add(noseMesh);

  addCuteFace(headGroup, 0.02, 0.245, 0.12, -0.04);
  root.add(headGroup);

  // Fluffy curled tail
  const tailCurve = new THREE.QuadraticBezierCurve3(
    new THREE.Vector3(0, 0.16, -0.15),
    new THREE.Vector3(0.08, 0.30, -0.32),
    new THREE.Vector3(0.14, 0.46, -0.22)
  );
  const tailGeo = new THREE.TubeGeometry(tailCurve, 20, 0.045, 12, false);
  const tailMesh = new THREE.Mesh(tailGeo, clayMat(0xe2e8f0));
  tailMesh.name = 'Tail';
  root.add(tailMesh);

  // Arms
  const armGeo = new THREE.CylinderGeometry(0.038, 0.035, 0.16, 16);
  const armMat = clayMat(0xe2e8f0);

  const armL = new THREE.Mesh(armGeo, armMat);
  armL.name = 'Arm_L';
  armL.position.set(-0.20, 0.28, 0.03);
  armL.rotation.z = 0.4;

  const armR = new THREE.Mesh(armGeo, armMat);
  armR.name = 'Arm_R';
  armR.position.set(0.20, 0.28, 0.03);
  armR.rotation.z = -0.4;

  root.add(armL, armR);

  // Feet
  const footGeo = new THREE.SphereGeometry(0.05, 16, 10);
  footGeo.scale(1, 0.6, 1.4);
  const fL = new THREE.Mesh(footGeo, armMat);
  fL.name = 'Leg_L';
  fL.position.set(-0.09, 0.04, 0.04);
  const fR = new THREE.Mesh(footGeo, armMat);
  fR.name = 'Leg_R';
  fR.position.set(0.09, 0.04, 0.04);
  root.add(fL, fR);

  return { root, clips: buildStandardClips(true, 0.52, 0.4) };
}

// -------------------------------------------------------------
// 3. Porky (พอร์กี้) — Swine Specialist Piglet
// -------------------------------------------------------------
function buildPorky() {
  const root = new THREE.Group();
  root.name = 'Mascot_Root';

  // Torso / Scrubs
  const bodyGeo = new THREE.CylinderGeometry(0.19, 0.23, 0.32, 24);
  const scrubsMesh = new THREE.Mesh(bodyGeo, clayMat(0xbae6fd));
  scrubsMesh.name = 'Body';
  scrubsMesh.position.y = 0.32;
  root.add(scrubsMesh);

  // Clipboard attached to Torso
  const clipBoardGeo = new THREE.BoxGeometry(0.12, 0.17, 0.015);
  const clipBoardMat = clayMat(0xd4a373);
  const cbMesh = new THREE.Mesh(clipBoardGeo, clipBoardMat);
  cbMesh.position.set(0.19, 0.32, 0.14);
  cbMesh.rotation.y = -0.3;
  cbMesh.rotation.z = 0.1;
  scrubsMesh.add(cbMesh);

  // Head Group
  const headGroup = new THREE.Group();
  headGroup.name = 'Head';
  headGroup.position.y = 0.56;

  const headGeo = new THREE.SphereGeometry(0.25, 32, 24);
  headGeo.scale(1.15, 0.98, 1.0);
  const headMesh = new THREE.Mesh(headGeo, clayMat(0xfce7f3));
  headGroup.add(headMesh);

  // Disc Snout
  const snoutGeo = new THREE.CylinderGeometry(0.065, 0.07, 0.04, 24);
  snoutGeo.scale(1.2, 0.8, 1.0);
  const snoutMesh = new THREE.Mesh(snoutGeo, clayMat(0xf472b6));
  snoutMesh.rotation.x = Math.PI / 2;
  snoutMesh.position.set(0, -0.04, 0.24);
  headGroup.add(snoutMesh);

  // Nostrils
  const nosGeo = new THREE.SphereGeometry(0.012, 10, 8);
  const nosMat = clayMat(0xdb2777);
  const nosL = new THREE.Mesh(nosGeo, nosMat);
  nosL.position.set(-0.032, -0.04, 0.265);
  const nosR = new THREE.Mesh(nosGeo, nosMat);
  nosR.position.set(0.032, -0.04, 0.265);
  headGroup.add(nosL, nosR);

  // Floppy ears
  const earGeo = new THREE.ConeGeometry(0.08, 0.15, 16);
  earGeo.scale(1.1, 1.0, 0.35);
  const earMat = clayMat(0xf472b6);
  const earL = new THREE.Mesh(earGeo, earMat);
  earL.position.set(-0.20, 0.16, 0.08);
  earL.rotation.set(0.4, 0, 0.6);
  const earR = new THREE.Mesh(earGeo, earMat);
  earR.position.set(0.20, 0.16, 0.08);
  earR.rotation.set(0.4, 0, -0.6);
  headGroup.add(earL, earR);

  addCuteFace(headGroup, 0.03, 0.245, 0.10, -0.03);
  root.add(headGroup);

  // Arms
  const armGeo = new THREE.CylinderGeometry(0.042, 0.038, 0.17, 16);
  const armMat = clayMat(0xbae6fd);

  const armL = new THREE.Mesh(armGeo, armMat);
  armL.name = 'Arm_L';
  armL.position.set(-0.22, 0.32, 0.02);
  armL.rotation.z = 0.35;

  const armR = new THREE.Mesh(armGeo, armMat);
  armR.name = 'Arm_R';
  armR.position.set(0.20, 0.32, 0.06);
  armR.rotation.z = -0.3;

  root.add(armL, armR);

  // Boots
  const bootGeo = new THREE.CylinderGeometry(0.06, 0.065, 0.15, 16);
  const bootMat = clayMat(0x2d5a27);
  const bL = new THREE.Mesh(bootGeo, bootMat);
  bL.name = 'Leg_L';
  bL.position.set(-0.10, 0.08, 0.02);
  const bR = new THREE.Mesh(bootGeo, bootMat);
  bR.name = 'Leg_R';
  bR.position.set(0.10, 0.08, 0.02);
  root.add(bL, bR);

  // Piggy curly tail
  const tailGeo = new THREE.TorusGeometry(0.04, 0.015, 8, 16, Math.PI * 1.5);
  const tailMesh = new THREE.Mesh(tailGeo, clayMat(0xf472b6));
  tailMesh.name = 'Tail';
  tailMesh.position.set(0, 0.20, -0.19);
  root.add(tailMesh);

  return { root, clips: buildStandardClips(true, 0.56, 0.35) };
}

// -------------------------------------------------------------
// 4. Oto (โอโตะ) — Sea Otter
// -------------------------------------------------------------
function buildOto() {
  const root = new THREE.Group();
  root.name = 'Mascot_Root';

  // Torso / Life Vest
  const bodyGeo = new THREE.CylinderGeometry(0.18, 0.22, 0.32, 24);
  const vestMesh = new THREE.Mesh(bodyGeo, clayMat(0xf97316));
  vestMesh.name = 'Body';
  vestMesh.position.y = 0.32;
  root.add(vestMesh);

  // Test tube
  const tubeGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.14, 16);
  const tubeMat = clayMat(0x38bdf8, { transparent: true, opacity: 0.75, roughness: 0.1 });
  const tubeMesh = new THREE.Mesh(tubeGeo, tubeMat);
  tubeMesh.position.set(0.22, 0.34, 0.15);
  tubeMesh.rotation.z = -0.2;
  vestMesh.add(tubeMesh);

  // Head Group
  const headGroup = new THREE.Group();
  headGroup.name = 'Head';
  headGroup.position.y = 0.56;

  const headGeo = new THREE.SphereGeometry(0.24, 32, 24);
  headGeo.scale(1.12, 0.98, 1.0);
  const headMesh = new THREE.Mesh(headGeo, clayMat(0x78350f));
  headGroup.add(headMesh);

  // Cream muzzle
  const muzzleGeo = new THREE.SphereGeometry(0.12, 20, 16);
  muzzleGeo.scale(1.3, 0.8, 0.7);
  const muzzleMat = clayMat(0xfef3c7);
  const muzzleMesh = new THREE.Mesh(muzzleGeo, muzzleMat);
  muzzleMesh.position.set(0, -0.05, 0.19);
  headGroup.add(muzzleMesh);

  // Nose
  const noseGeo = new THREE.SphereGeometry(0.03, 16, 12);
  noseGeo.scale(1.3, 0.8, 0.7);
  const noseMesh = new THREE.Mesh(noseGeo, clayMat(0x0f172a, { roughness: 0.2 }));
  noseMesh.position.set(0, -0.02, 0.26);
  headGroup.add(noseMesh);

  // Goggles
  const goggleRimGeo = new THREE.TorusGeometry(0.055, 0.015, 12, 24);
  const goggleRimMat = clayMat(0x38bdf8);
  const lensGeo = new THREE.CircleGeometry(0.05, 20);
  const lensMat = clayMat(0xa5f3fc, { transparent: true, opacity: 0.8, roughness: 0.1 });

  const goggleL = new THREE.Mesh(goggleRimGeo, goggleRimMat);
  goggleL.position.set(-0.08, 0.15, 0.18);
  const lensL = new THREE.Mesh(lensGeo, lensMat);
  lensL.position.set(-0.08, 0.15, 0.18);

  const goggleR = new THREE.Mesh(goggleRimGeo, goggleRimMat);
  goggleR.position.set(0.08, 0.15, 0.18);
  const lensR = new THREE.Mesh(lensGeo, lensMat);
  lensR.position.set(0.08, 0.15, 0.18);

  headGroup.add(goggleL, lensL, goggleR, lensR);

  // Ears
  const earGeo = new THREE.SphereGeometry(0.045, 16, 12);
  const earMat = clayMat(0x78350f);
  const earL = new THREE.Mesh(earGeo, earMat);
  earL.position.set(-0.24, 0.08, 0.0);
  const earR = new THREE.Mesh(earGeo, earMat);
  earR.position.set(0.24, 0.08, 0.0);
  headGroup.add(earL, earR);

  addCuteFace(headGroup, 0.02, 0.245, 0.10, -0.04);
  root.add(headGroup);

  // Paddle Tail
  const tailGeo = new THREE.CylinderGeometry(0.05, 0.08, 0.28, 16);
  tailGeo.scale(1.4, 1.0, 0.4);
  const tailMesh = new THREE.Mesh(tailGeo, earMat);
  tailMesh.name = 'Tail';
  tailMesh.position.set(0, 0.14, -0.16);
  tailMesh.rotation.x = -Math.PI / 4;
  root.add(tailMesh);

  // Arms
  const armGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.16, 16);
  const aL = new THREE.Mesh(armGeo, earMat);
  aL.name = 'Arm_L';
  aL.position.set(-0.21, 0.30, 0.02);
  aL.rotation.z = 0.35;

  const aR = new THREE.Mesh(armGeo, earMat);
  aR.name = 'Arm_R';
  aR.position.set(0.21, 0.32, 0.08);
  aR.rotation.z = -0.3;

  root.add(aL, aR);

  // Feet
  const footGeo = new THREE.SphereGeometry(0.065, 16, 10);
  footGeo.scale(1.2, 0.5, 1.5);
  const fL = new THREE.Mesh(footGeo, earMat);
  fL.name = 'Leg_L';
  fL.position.set(-0.11, 0.04, 0.04);
  const fR = new THREE.Mesh(footGeo, earMat);
  fR.name = 'Leg_R';
  fR.position.set(0.11, 0.04, 0.04);
  root.add(fL, fR);

  return { root, clips: buildStandardClips(true, 0.56, 0.35) };
}

// -------------------------------------------------------------
// 5. Clover (โคลเวอร์) — Chestnut Foal (Baby Pony)
// -------------------------------------------------------------
function buildClover() {
  const root = new THREE.Group();
  root.name = 'Mascot_Root';

  // Torso / Green Vet Jacket
  const bodyGeo = new THREE.CylinderGeometry(0.17, 0.21, 0.34, 24);
  const coatMesh = new THREE.Mesh(bodyGeo, clayMat(0x14532d));
  coatMesh.name = 'Body';
  coatMesh.position.y = 0.34;
  root.add(coatMesh);

  // Head Group
  const headGroup = new THREE.Group();
  headGroup.name = 'Head';
  headGroup.position.y = 0.58;

  const headGeo = new THREE.SphereGeometry(0.24, 32, 24);
  headGeo.scale(1.05, 1.05, 1.15);
  const headMesh = new THREE.Mesh(headGeo, clayMat(0x9a3412));
  headGroup.add(headMesh);

  // Muzzle
  const snoutGeo = new THREE.SphereGeometry(0.085, 20, 16);
  snoutGeo.scale(1.1, 0.85, 1.2);
  const snoutMesh = new THREE.Mesh(snoutGeo, clayMat(0x7c2d12));
  snoutMesh.position.set(0, -0.06, 0.22);
  headGroup.add(snoutMesh);

  // Star mark
  const starGeo = new THREE.CircleGeometry(0.035, 5);
  const starMat = clayMat(0xffffff);
  const starMesh = new THREE.Mesh(starGeo, starMat);
  starMesh.position.set(0, 0.10, 0.245);
  headGroup.add(starMesh);

  // Golden Mane
  const maneGeo = new THREE.SphereGeometry(0.12, 16, 12);
  maneGeo.scale(0.8, 1.6, 0.9);
  const maneMat = clayMat(0xfde047);
  const maneMesh = new THREE.Mesh(maneGeo, maneMat);
  maneMesh.position.set(-0.06, 0.18, 0.08);
  maneMesh.rotation.z = 0.25;
  headGroup.add(maneMesh);

  // Ears
  const earGeo = new THREE.ConeGeometry(0.065, 0.18, 16);
  earGeo.scale(1.0, 1.0, 0.4);
  const earMat = clayMat(0x9a3412);
  const earL = new THREE.Mesh(earGeo, earMat);
  earL.position.set(-0.14, 0.25, 0.0);
  earL.rotation.z = 0.2;
  const earR = new THREE.Mesh(earGeo, earMat);
  earR.position.set(0.14, 0.25, 0.0);
  earR.rotation.z = -0.2;
  headGroup.add(earL, earR);

  addCuteFace(headGroup, 0.03, 0.255, 0.10, -0.03);
  root.add(headGroup);

  // Tail
  const tailGeo = new THREE.CylinderGeometry(0.03, 0.07, 0.25, 16);
  const tailMesh = new THREE.Mesh(tailGeo, maneMat);
  tailMesh.name = 'Tail';
  tailMesh.position.set(0, 0.22, -0.20);
  tailMesh.rotation.x = -Math.PI / 3;
  root.add(tailMesh);

  // Coat Sleeves / Arms (Anthropomorphic front legs)
  const armGeo = new THREE.CylinderGeometry(0.04, 0.038, 0.18, 16);
  const sleeveMat = clayMat(0x14532d); // Green vet blazer sleeves
  const hoofMat = clayMat(0x292524);

  const armL = new THREE.Group();
  armL.name = 'Arm_L';
  const aLMesh = new THREE.Mesh(armGeo, sleeveMat);
  const hoofL = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.042, 0.03, 16), hoofMat);
  hoofL.position.y = -0.09;
  armL.add(aLMesh, hoofL);
  armL.position.set(-0.21, 0.34, 0.02);
  armL.rotation.z = 0.35;

  const armR = new THREE.Group();
  armR.name = 'Arm_R';
  const aRMesh = new THREE.Mesh(armGeo, sleeveMat);
  const hoofR = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.042, 0.03, 16), hoofMat);
  hoofR.position.y = -0.09;
  armR.add(aRMesh, hoofR);
  armR.position.set(0.21, 0.34, 0.02);
  armR.rotation.z = -0.35;

  root.add(armL, armR);

  // Back Legs
  const legGeo = new THREE.CylinderGeometry(0.035, 0.04, 0.16, 16);
  const legMat = clayMat(0x9a3412);
  const lL = new THREE.Mesh(legGeo, legMat);
  lL.name = 'Leg_L';
  lL.position.set(-0.09, 0.08, 0.02);

  const lR = new THREE.Mesh(legGeo, legMat);
  lR.name = 'Leg_R';
  lR.position.set(0.09, 0.08, 0.02);

  root.add(lL, lR);

  return { root, clips: buildStandardClips(true, 0.58, 0.35) };
}

// -------------------------------------------------------------
// 6. Chicky (ชิคกี้) — Fluffy Yellow Chick (Poultry & Avian Medicine)
// -------------------------------------------------------------
function buildChicky() {
  const root = new THREE.Group();
  root.name = 'Mascot_Root';

  const chickYellow = 0xfde047;
  const beakOrange = 0xf97316;
  const scrubTeal = 0x0d9488;
  const feetOrange = 0xea580c;

  // Body: Round egg-shaped torso
  const bodyGeo = new THREE.SphereGeometry(0.24, 24, 20);
  bodyGeo.scale(1.0, 1.05, 0.95);
  const bodyMesh = new THREE.Mesh(bodyGeo, clayMat(chickYellow));
  bodyMesh.name = 'Body';
  bodyMesh.position.y = 0.28;
  root.add(bodyMesh);

  // Soft eggshell diaper / mini doctor apron
  const apronGeo = new THREE.CylinderGeometry(0.25, 0.23, 0.14, 24, 1, true);
  const apronMesh = new THREE.Mesh(apronGeo, clayMat(0xf8fafc));
  apronMesh.position.set(0, 0.24, 0);
  root.add(apronMesh);

  // Stethoscope around neck
  const stethTorus = new THREE.TorusGeometry(0.18, 0.016, 12, 24);
  const stethMesh = new THREE.Mesh(stethTorus, clayMat(scrubTeal));
  stethMesh.rotation.x = Math.PI / 2;
  stethMesh.position.set(0, 0.38, 0);
  root.add(stethMesh);

  // Head Group (parent for bone tracking)
  const headGroup = new THREE.Group();
  headGroup.name = 'Head';
  headGroup.position.set(0, 0.54, 0);

  // Big round head
  const headGeo = new THREE.SphereGeometry(0.26, 28, 24);
  const headMesh = new THREE.Mesh(headGeo, clayMat(chickYellow));
  headMesh.name = 'Head_Mesh';
  headGroup.add(headMesh);

  // Feather tuft crest on top
  for (let i = -1; i <= 1; i++) {
    const tuftGeo = new THREE.ConeGeometry(0.04, 0.12, 12);
    const tuft = new THREE.Mesh(tuftGeo, clayMat(0xfef08a));
    tuft.position.set(i * 0.04, 0.26, -0.02);
    tuft.rotation.z = -i * 0.2;
    headGroup.add(tuft);
  }

  // Surgeon cap on head
  const capGeo = new THREE.CylinderGeometry(0.14, 0.15, 0.07, 20);
  const capMesh = new THREE.Mesh(capGeo, clayMat(scrubTeal));
  capMesh.position.set(0, 0.24, 0.02);
  headGroup.add(capMesh);

  // Tiny red cross on cap
  const crossGeo1 = new THREE.BoxGeometry(0.04, 0.012, 0.005);
  const crossGeo2 = new THREE.BoxGeometry(0.012, 0.04, 0.005);
  const crossMat = clayMat(0xef4444);
  const c1 = new THREE.Mesh(crossGeo1, crossMat);
  const c2 = new THREE.Mesh(crossGeo2, crossMat);
  c1.position.set(0, 0.24, 0.16);
  c2.position.set(0, 0.24, 0.16);
  headGroup.add(c1, c2);

  // Beak: Cute orange cone
  const beakGeo = new THREE.ConeGeometry(0.055, 0.08, 16);
  const beakMesh = new THREE.Mesh(beakGeo, clayMat(beakOrange));
  beakMesh.rotation.x = Math.PI / 2;
  beakMesh.position.set(0, -0.02, 0.26);
  headGroup.add(beakMesh);

  addCuteFace(headGroup, 0.03, 0.25, 0.09, -0.04);
  root.add(headGroup);

  // Little Tail Feather
  const tailGeo = new THREE.ConeGeometry(0.05, 0.12, 12);
  const tailMesh = new THREE.Mesh(tailGeo, clayMat(0xfef08a));
  tailMesh.name = 'Tail';
  tailMesh.rotation.x = -Math.PI / 2.5;
  tailMesh.position.set(0, 0.26, -0.22);
  root.add(tailMesh);

  // Wings (Arm_L and Arm_R)
  const wingGeo = new THREE.ConeGeometry(0.065, 0.18, 16);
  wingGeo.scale(1.0, 1.0, 0.4);
  const wingMat = clayMat(chickYellow);

  const armL = new THREE.Group();
  armL.name = 'Arm_L';
  const wL = new THREE.Mesh(wingGeo, wingMat);
  wL.rotation.z = Math.PI / 4;
  wL.position.set(-0.06, -0.06, 0);
  armL.add(wL);
  armL.position.set(-0.20, 0.32, 0.02);
  armL.rotation.z = 0.3;

  const armR = new THREE.Group();
  armR.name = 'Arm_R';
  const wR = new THREE.Mesh(wingGeo, wingMat);
  wR.rotation.z = -Math.PI / 4;
  wR.position.set(0.06, -0.06, 0);
  armR.add(wR);
  armR.position.set(0.20, 0.32, 0.02);
  armR.rotation.z = -0.3;

  root.add(armL, armR);

  // Little Feet (Leg_L and Leg_R)
  const footGeo = new THREE.BoxGeometry(0.08, 0.03, 0.12);
  const footMat = clayMat(feetOrange);

  const legL = new THREE.Mesh(footGeo, footMat);
  legL.name = 'Leg_L';
  legL.position.set(-0.09, 0.03, 0.04);

  const legR = new THREE.Mesh(footGeo, footMat);
  legR.name = 'Leg_R';
  legR.position.set(0.09, 0.03, 0.04);

  root.add(legL, legR);

  return { root, clips: buildStandardClips(true, 0.54, 0.3) };
}

// -------------------------------------------------------------
// 7. Pawsy (พาวซี่) — Golden Puppy (Small Animal Medicine & Surgery)
// -------------------------------------------------------------
function buildPawsy() {
  const root = new THREE.Group();
  root.name = 'Mascot_Root';

  const pupGold = 0xd97706;
  const pupCream = 0xfef3c7;
  const coatWhite = 0xf8fafc;
  const stethBlue = 0x2563eb;
  const noseDark = 0x1e293b;

  // Body: Doctor Lab Coat
  const bodyGeo = new THREE.CylinderGeometry(0.18, 0.22, 0.32, 24);
  const bodyMesh = new THREE.Mesh(bodyGeo, clayMat(coatWhite));
  bodyMesh.name = 'Body';
  bodyMesh.position.y = 0.32;
  root.add(bodyMesh);

  // Coat Collar / Lapels
  const lapelGeo = new THREE.BoxGeometry(0.06, 0.16, 0.02);
  const lapelMat = clayMat(coatWhite, { roughness: 0.4 });
  const lapL = new THREE.Mesh(lapelGeo, lapelMat);
  lapL.position.set(-0.08, 0.40, 0.18);
  lapL.rotation.z = -0.2;
  const lapR = new THREE.Mesh(lapelGeo, lapelMat);
  lapR.position.set(0.08, 0.40, 0.18);
  lapR.rotation.z = 0.2;
  root.add(lapL, lapR);

  // Stethoscope
  const stethGeo = new THREE.TorusGeometry(0.16, 0.015, 12, 24);
  const stethMesh = new THREE.Mesh(stethGeo, clayMat(stethBlue));
  stethMesh.rotation.x = Math.PI / 2.2;
  stethMesh.position.set(0, 0.40, 0.05);
  root.add(stethMesh);

  // Stethoscope Bell
  const bellMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.01, 16), clayMat(0x94a3b8));
  bellMesh.rotation.x = Math.PI / 2;
  bellMesh.position.set(0, 0.28, 0.22);
  root.add(bellMesh);

  // Head Group
  const headGroup = new THREE.Group();
  headGroup.name = 'Head';
  headGroup.position.set(0, 0.58, 0);

  // Round head
  const headGeo = new THREE.SphereGeometry(0.26, 28, 24);
  const headMesh = new THREE.Mesh(headGeo, clayMat(pupGold));
  headMesh.name = 'Head_Mesh';
  headGroup.add(headMesh);

  // Cream muzzle
  const snoutGeo = new THREE.SphereGeometry(0.12, 20, 16);
  snoutGeo.scale(1.1, 0.75, 0.9);
  const snoutMesh = new THREE.Mesh(snoutGeo, clayMat(pupCream));
  snoutMesh.position.set(0, -0.06, 0.20);
  headGroup.add(snoutMesh);

  // Truffle nose
  const noseMesh = new THREE.Mesh(new THREE.SphereGeometry(0.035, 16, 12), clayMat(noseDark));
  noseMesh.position.set(0, -0.03, 0.29);
  headGroup.add(noseMesh);

  // Floppy Puppy Ears
  const earGeo = new THREE.ConeGeometry(0.08, 0.22, 16);
  earGeo.scale(1.2, 1.0, 0.5);
  const earMat = clayMat(0xb45309);
  const earL = new THREE.Mesh(earGeo, earMat);
  earL.position.set(-0.21, 0.10, 0);
  earL.rotation.z = 1.2;
  earL.rotation.y = 0.2;
  const earR = new THREE.Mesh(earGeo, earMat);
  earR.position.set(0.21, 0.10, 0);
  earR.rotation.z = -1.2;
  earR.rotation.y = -0.2;
  headGroup.add(earL, earR);

  addCuteFace(headGroup, 0.04, 0.25, 0.10, -0.04);
  root.add(headGroup);

  // Wagging Puppy Tail
  const tailGeo = new THREE.CylinderGeometry(0.025, 0.04, 0.20, 12);
  const tailMesh = new THREE.Mesh(tailGeo, clayMat(pupGold));
  tailMesh.name = 'Tail';
  tailMesh.position.set(0, 0.24, -0.19);
  tailMesh.rotation.x = -Math.PI / 3;
  root.add(tailMesh);

  // Arms (Doctor coat sleeves + golden paws)
  const armGeo = new THREE.CylinderGeometry(0.042, 0.04, 0.18, 16);
  const sleeveMat = clayMat(coatWhite);
  const pawMat = clayMat(pupGold);

  const armL = new THREE.Group();
  armL.name = 'Arm_L';
  const aLMesh = new THREE.Mesh(armGeo, sleeveMat);
  const pawL = new THREE.Mesh(new THREE.SphereGeometry(0.042, 16, 12), pawMat);
  pawL.position.y = -0.10;
  armL.add(aLMesh, pawL);
  armL.position.set(-0.21, 0.35, 0.02);
  armL.rotation.z = 0.35;

  const armR = new THREE.Group();
  armR.name = 'Arm_R';
  const aRMesh = new THREE.Mesh(armGeo, sleeveMat);
  const pawR = new THREE.Mesh(new THREE.SphereGeometry(0.042, 16, 12), pawMat);
  pawR.position.y = -0.10;
  armR.add(aRMesh, pawR);
  armR.position.set(0.21, 0.35, 0.02);
  armR.rotation.z = -0.35;

  root.add(armL, armR);

  // Legs & Paws
  const legGeo = new THREE.CylinderGeometry(0.045, 0.045, 0.16, 16);
  const legMat = clayMat(0x334155);
  const legL = new THREE.Mesh(legGeo, legMat);
  legL.name = 'Leg_L';
  legL.position.set(-0.09, 0.08, 0.02);
  const legR = new THREE.Mesh(legGeo, legMat);
  legR.name = 'Leg_R';
  legR.position.set(0.09, 0.08, 0.02);
  root.add(legL, legR);

  return { root, clips: buildStandardClips(true, 0.58, 0.35) };
}

// -------------------------------------------------------------
// 8. Mimi (มีมี่) — Calico Fold Kitten (Feline Practice)
// -------------------------------------------------------------
function buildMimi() {
  const root = new THREE.Group();
  root.name = 'Mascot_Root';

  const catWhite = 0xffffff;
  const calicoGinger = 0xf97316;
  const calicoSlate = 0x64748b;
  const scrubsMint = 0x34d399;
  const innerPink = 0xf472b6;

  // Body: Mint Surgical Scrubs
  const bodyGeo = new THREE.CylinderGeometry(0.17, 0.21, 0.30, 24);
  const bodyMesh = new THREE.Mesh(bodyGeo, clayMat(scrubsMint));
  bodyMesh.name = 'Body';
  bodyMesh.position.y = 0.31;
  root.add(bodyMesh);

  // Paw Print pocket badge
  const pocketGeo = new THREE.BoxGeometry(0.08, 0.08, 0.01);
  const pocketMesh = new THREE.Mesh(pocketGeo, clayMat(0x059669));
  pocketMesh.position.set(0.08, 0.34, 0.19);
  root.add(pocketMesh);

  // Head Group
  const headGroup = new THREE.Group();
  headGroup.name = 'Head';
  headGroup.position.set(0, 0.57, 0);

  // Round cat head
  const headGeo = new THREE.SphereGeometry(0.26, 28, 24);
  const headMesh = new THREE.Mesh(headGeo, clayMat(catWhite));
  headMesh.name = 'Head_Mesh';
  headGroup.add(headMesh);

  // Calico Ginger patch over right eye & ear
  const patchGeo = new THREE.SphereGeometry(0.13, 16, 16);
  patchGeo.scale(1.1, 0.9, 0.8);
  const patchMesh = new THREE.Mesh(patchGeo, clayMat(calicoGinger));
  patchMesh.position.set(0.12, 0.10, 0.14);
  headGroup.add(patchMesh);

  // Slate gray spot on back head
  const spotMesh = new THREE.Mesh(new THREE.SphereGeometry(0.10, 16, 12), clayMat(calicoSlate));
  spotMesh.position.set(-0.13, 0.12, -0.12);
  headGroup.add(spotMesh);

  // Folded / Perky Cat Ears
  const earGeo = new THREE.ConeGeometry(0.07, 0.13, 16);
  earGeo.scale(1.0, 1.0, 0.4);
  const earL = new THREE.Mesh(earGeo, clayMat(catWhite));
  earL.position.set(-0.16, 0.22, 0.04);
  earL.rotation.z = 0.4;
  earL.rotation.x = -0.2;

  const earR = new THREE.Mesh(earGeo, clayMat(calicoGinger));
  earR.position.set(0.16, 0.22, 0.04);
  earR.rotation.z = -0.4;
  earR.rotation.x = -0.2;

  // Inner ear pink
  const inGeo = new THREE.ConeGeometry(0.04, 0.08, 12);
  inGeo.scale(1.0, 1.0, 0.3);
  const inMat = clayMat(innerPink);
  const inL = new THREE.Mesh(inGeo, inMat);
  inL.position.set(-0.16, 0.21, 0.06);
  inL.rotation.z = 0.4;
  inL.rotation.x = -0.2;
  const inR = new THREE.Mesh(inGeo, inMat);
  inR.position.set(0.16, 0.21, 0.06);
  inR.rotation.z = -0.4;
  inR.rotation.x = -0.2;
  headGroup.add(earL, earR, inL, inR);

  // Cat Nose
  const catNose = new THREE.Mesh(new THREE.ConeGeometry(0.02, 0.03, 12), inMat);
  catNose.rotation.x = Math.PI;
  catNose.position.set(0, -0.01, 0.26);
  headGroup.add(catNose);

  // Cheek tufts
  const cheekGeo = new THREE.SphereGeometry(0.07, 12, 10);
  cheekGeo.scale(1.0, 0.6, 0.5);
  const chL = new THREE.Mesh(cheekGeo, clayMat(catWhite));
  chL.position.set(-0.06, -0.04, 0.24);
  const chR = new THREE.Mesh(cheekGeo, clayMat(catWhite));
  chR.position.set(0.06, -0.04, 0.24);
  headGroup.add(chL, chR);

  addCuteFace(headGroup, 0.03, 0.25, 0.09, -0.04);
  root.add(headGroup);

  // Tail
  const tailGeo = new THREE.CylinderGeometry(0.025, 0.035, 0.24, 16);
  const tailMesh = new THREE.Mesh(tailGeo, clayMat(calicoGinger));
  tailMesh.name = 'Tail';
  tailMesh.position.set(0, 0.24, -0.20);
  tailMesh.rotation.x = -Math.PI / 3;
  root.add(tailMesh);

  // Arms
  const armGeo = new THREE.CylinderGeometry(0.038, 0.036, 0.17, 16);
  const sleeveMat = clayMat(scrubsMint);
  const pawMat = clayMat(catWhite);

  const armL = new THREE.Group();
  armL.name = 'Arm_L';
  const aLMesh = new THREE.Mesh(armGeo, sleeveMat);
  const pawL = new THREE.Mesh(new THREE.SphereGeometry(0.04, 16, 12), pawMat);
  pawL.position.y = -0.09;
  armL.add(aLMesh, pawL);
  armL.position.set(-0.20, 0.33, 0.02);
  armL.rotation.z = 0.35;

  const armR = new THREE.Group();
  armR.name = 'Arm_R';
  const aRMesh = new THREE.Mesh(armGeo, sleeveMat);
  const pawR = new THREE.Mesh(new THREE.SphereGeometry(0.04, 16, 12), pawMat);
  pawR.position.y = -0.09;
  armR.add(aRMesh, pawR);
  armR.position.set(0.20, 0.33, 0.02);
  armR.rotation.z = -0.35;

  root.add(armL, armR);

  // Legs & Pants
  const legGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.15, 16);
  const legMat = clayMat(0x059669);
  const legL = new THREE.Mesh(legGeo, legMat);
  legL.name = 'Leg_L';
  legL.position.set(-0.085, 0.08, 0.02);
  const legR = new THREE.Mesh(legGeo, legMat);
  legR.name = 'Leg_R';
  legR.position.set(0.085, 0.08, 0.02);
  root.add(legL, legR);

  return { root, clips: buildStandardClips(true, 0.57, 0.35) };
}

// -------------------------------------------------------------
// 9. Hootie (ฮูตตี้) — Barn Owl Detective (Epidemiology & One Health)
// -------------------------------------------------------------
function buildHootie() {
  const root = new THREE.Group();
  root.name = 'Mascot_Root';

  const owlLatte = 0xa8a29e;
  const owlCream = 0xfafaf9;
  const capeGreen = 0x15803d;
  const goldBrass = 0xeab308;
  const beakGold = 0xd97706;

  // Body: Chubby owl torso with cream belly
  const bodyGeo = new THREE.SphereGeometry(0.23, 24, 20);
  bodyGeo.scale(1.0, 1.1, 0.95);
  const bodyMesh = new THREE.Mesh(bodyGeo, clayMat(owlLatte));
  bodyMesh.name = 'Body';
  bodyMesh.position.y = 0.30;
  root.add(bodyMesh);

  // Cream Belly bib
  const bibGeo = new THREE.SphereGeometry(0.18, 20, 16);
  bibGeo.scale(0.85, 1.0, 0.5);
  const bibMesh = new THREE.Mesh(bibGeo, clayMat(owlCream));
  bibMesh.position.set(0, 0.28, 0.14);
  root.add(bibMesh);

  // Detective Cape / Collar
  const capeGeo = new THREE.CylinderGeometry(0.18, 0.26, 0.16, 24, 1, true);
  const capeMesh = new THREE.Mesh(capeGeo, clayMat(capeGreen));
  capeMesh.position.set(0, 0.36, 0);
  root.add(capeMesh);

  // Head Group
  const headGroup = new THREE.Group();
  headGroup.name = 'Head';
  headGroup.position.set(0, 0.56, 0);

  // Round owl head
  const headGeo = new THREE.SphereGeometry(0.26, 28, 24);
  const headMesh = new THREE.Mesh(headGeo, clayMat(owlLatte));
  headMesh.name = 'Head_Mesh';
  headGroup.add(headMesh);

  // Heart-shaped face disks
  const faceL = new THREE.Mesh(new THREE.CircleGeometry(0.11, 24), clayMat(owlCream));
  faceL.position.set(-0.08, 0.02, 0.23);
  const faceR = new THREE.Mesh(new THREE.CircleGeometry(0.11, 24), clayMat(owlCream));
  faceR.position.set(0.08, 0.02, 0.23);
  headGroup.add(faceL, faceR);

  // Round Detective Glasses Frame
  const glassGeo = new THREE.TorusGeometry(0.075, 0.012, 12, 24);
  const glassMat = clayMat(goldBrass, { metalness: 0.8, roughness: 0.2 });
  const gL = new THREE.Mesh(glassGeo, glassMat);
  gL.position.set(-0.09, 0.02, 0.25);
  const gR = new THREE.Mesh(glassGeo, glassMat);
  gR.position.set(0.09, 0.02, 0.25);
  const bridge = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.01, 0.01), glassMat);
  bridge.position.set(0, 0.02, 0.255);
  headGroup.add(gL, gR, bridge);

  // Small curved owl beak
  const beakGeo = new THREE.ConeGeometry(0.04, 0.09, 16);
  const beakMesh = new THREE.Mesh(beakGeo, clayMat(beakGold));
  beakMesh.rotation.x = Math.PI / 1.7;
  beakMesh.position.set(0, -0.04, 0.26);
  headGroup.add(beakMesh);

  // Ear Tuft Feathers
  for (let sign of [-1, 1]) {
    const tuft = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.12, 12), clayMat(0x78716c));
    tuft.position.set(sign * 0.18, 0.22, 0.02);
    tuft.rotation.z = -sign * 0.5;
    headGroup.add(tuft);
  }

  addCuteFace(headGroup, 0.02, 0.25, 0.09, -0.05);
  root.add(headGroup);

  // Tail Feathers
  const tailGeo = new THREE.BoxGeometry(0.12, 0.03, 0.14);
  const tailMesh = new THREE.Mesh(tailGeo, clayMat(0x78716c));
  tailMesh.name = 'Tail';
  tailMesh.position.set(0, 0.20, -0.22);
  tailMesh.rotation.x = -0.4;
  root.add(tailMesh);

  // Wing Arms
  const wingGeo = new THREE.ConeGeometry(0.07, 0.20, 16);
  wingGeo.scale(1.0, 1.0, 0.45);
  const wingMat = clayMat(owlLatte);

  const armL = new THREE.Group();
  armL.name = 'Arm_L';
  const wL = new THREE.Mesh(wingGeo, wingMat);
  wL.rotation.z = Math.PI / 4;
  wL.position.set(-0.06, -0.07, 0);
  armL.add(wL);
  armL.position.set(-0.21, 0.34, 0.02);
  armL.rotation.z = 0.35;

  const armR = new THREE.Group();
  armR.name = 'Arm_R';
  const wR = new THREE.Mesh(wingGeo, wingMat);
  wR.rotation.z = -Math.PI / 4;
  wR.position.set(0.06, -0.07, 0);
  armR.add(wR);
  armR.position.set(0.21, 0.34, 0.02);
  armR.rotation.z = -0.35;

  root.add(armL, armR);

  // Owl Talons
  const talonGeo = new THREE.BoxGeometry(0.07, 0.03, 0.10);
  const talonMat = clayMat(beakGold);
  const legL = new THREE.Mesh(talonGeo, talonMat);
  legL.name = 'Leg_L';
  legL.position.set(-0.08, 0.04, 0.03);
  const legR = new THREE.Mesh(talonGeo, talonMat);
  legR.name = 'Leg_R';
  legR.position.set(0.08, 0.04, 0.03);
  root.add(legL, legR);

  return { root, clips: buildStandardClips(true, 0.56, 0.35) };
}

// -------------------------------------------------------------
// Generator & Exporter Runner
// -------------------------------------------------------------
async function exportCharacter(name, buildFn, outputDirs) {
  const scene = new THREE.Scene();
  const { root, clips } = buildFn();
  scene.add(root);

  const exporter = new GLTFExporter();
  const glbBuffer = await exporter.parseAsync(scene, { binary: true, animations: clips });
  const buffer = Buffer.from(glbBuffer);

  for (const dir of outputDirs) {
    fs.mkdirSync(dir, { recursive: true });
    const dest = path.join(dir, `${name}.glb`);
    fs.writeFileSync(dest, buffer);
    console.log(`✓ Exported ${name}.glb (${(buffer.length / 1024).toFixed(1)} KB) with ${clips.length} embedded clips -> ${dest}`);
  }
}

async function main() {
  const target = process.argv[2]?.toLowerCase();
  console.log(`>>> Baking 3D GLB Character Models (Target: ${target || 'all'})...`);

  const outputDirs = [
    '/Users/kasem/Documents/vet-mock-main/public/art/models',
    '/Users/kasem/Documents/vet-mock-landing-demo/public/art/models',
  ];

  const builders = {
    moocha: buildMoocha,
    glidy: buildGlidy,
    porky: buildPorky,
    oto: buildOto,
    clover: buildClover,
    chicky: buildChicky,
    pawsy: buildPawsy,
    mimi: buildMimi,
    hootie: buildHootie,
  };

  if (target && builders[target]) {
    await exportCharacter(target, builders[target], outputDirs);
  } else {
    for (const [name, fn] of Object.entries(builders)) {
      await exportCharacter(name, fn, outputDirs);
    }
  }

  console.log('>>> Finished baking GLB models successfully!');
}

main().catch(console.error);
