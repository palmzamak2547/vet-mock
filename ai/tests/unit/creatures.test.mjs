import test from 'node:test';
import assert from 'node:assert/strict';
import { Swimmer, School, Mesh, SPECIES, population, FLOATS } from '../../src/ocean/creatures.js';
import { rng } from '../../src/ocean/math.js';

const envFor = (W, H) => ({
  W, H, short: Math.min(W, H), t: 0, pace: 1, avoid: 0.25,
  pointer: { x: -1e4, y: -1e4, active: false },
  focus: null, content: null, mill: null, millSchool: null, schoolPull: null,
});

function finite(arr) {
  for (const v of arr) if (!Number.isFinite(v)) return false;
  return true;
}

test('every species has the names its specimen label shows', () => {
  for (const [key, s] of Object.entries(SPECIES)) {
    assert.ok(s.th && s.sci, key);
    assert.ok(s.color?.dark?.length === 3 && s.color?.light?.length === 3, key);
  }
});

test('a minute of swimming stays finite, keeps its spine and its sea (any frame rate, hitches, every mode)', () => {
  for (const [W, H] of [[390, 844], [1280, 800], [1920, 1080]]) {
    const env = envFor(W, H);
    const rand = rng(42);
    const pop = population(env);
    const swimmers = pop.list.map((k) => new Swimmer(k, rand, env));
    const school = new School(pop.school, rand, env);
    const mesh = new Mesh(9000);
    const steps = [1 / 30, 1 / 60, 1 / 120, 0.1];
    let t = 0;
    let i = 0;
    while (t < 60) {
      const dt = steps[i++ % steps.length];
      t += dt;
      env.t = t;
      // walk through the modes and the pointer the page can set
      env.mill = t > 20 && t < 30 ? { x: W / 2, y: H / 2 } : null;
      env.millSchool = env.mill ? { ...env.mill, r: env.short * 0.15 } : null;
      env.pointer = t > 35 && t < 40 ? { x: W * 0.5, y: H * 0.4, active: true } : { x: -1e4, y: -1e4, active: false };
      env.focus = t > 42 && t < 50 ? { x: W * 0.2, y: H * 0.45, w: W * 0.6, h: 110 } : null;
      if (t > 42 && t < 42.2) swimmers[0].curious = 8;
      for (const s of swimmers) s.update(dt, env);
      school.update(dt, env, swimmers.map((s) => ({ x: s.x, y: s.y, r: s.L * 0.55 })));
    }
    mesh.reset(W, H);
    for (const s of swimmers) {
      assert.ok(Number.isFinite(s.x) && Number.isFinite(s.y), `${s.key} position`);
      assert.ok(finite(s.jx) && finite(s.jy), `${s.key} spine`);
      for (let j = 1; j < s.N; j++) {
        const d = Math.hypot(s.jx[j] - s.jx[j - 1], s.jy[j] - s.jy[j - 1]);
        assert.ok(Math.abs(d - s.seg) < 1e-3, `${s.key} link ${j} keeps its length`);
      }
      // never lost far away: off-screen animals come back in
      assert.ok(s.x > -s.L * 3 && s.x < W + s.L * 3 && s.y > -s.L * 3 && s.y < H + s.L * 3, `${s.key} inside the sea`);
      s.write(mesh, 0.5);
    }
    school.write(mesh, 0.5, -0.6);
    assert.ok(finite(school.x) && finite(school.y), 'school');
    assert.ok(mesh.n > 0 && mesh.n < mesh.max, `mesh ${mesh.n} of ${mesh.max}`);
    assert.equal(mesh.n % 3, 0, 'whole triangles');
    assert.ok(finite(mesh.data.subarray(0, mesh.n * FLOATS)), 'mesh data finite');
  }
});

test('a tap finds the animal under it and nothing in open water', () => {
  const env = envFor(1280, 800);
  const s = new Swimmer('turtle', rng(3), env);
  s.update(1 / 60, env);
  assert.ok(s.hit(s.x, s.y) < 1);
  assert.ok(s.hit(s.x + 2000, s.y + 2000) > 1);
});
