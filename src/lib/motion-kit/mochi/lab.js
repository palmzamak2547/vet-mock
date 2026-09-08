import { element, localPoint } from "../core.js";
import { createMochi } from "./companion.js";
import { STATES } from "./motion.js";
import { MOCHI_ACTIONS } from "./actions.js";
const sequence = ["wave", "walk", "run", "hop", "dance", "stretch", "curious", "highfive", "pet", "read", "sleepy", "wake"];
export function createMochiLab(root, { scope, id = "mochi-hello", onEvent = () => {
} } = {}) {
  const wrap = element("div", "vm-mochi-lab"), viewport = element("div", "vm-mochi-viewport"), tools = element("div", "vm-mochi-tools"), modes = element("div", "vm-mochi-modes"), actions = element("div", "vm-mochi-actions");
  const status = element("p", "vm-mochi-status", "เลือกท่าใหม่ได้เลย Mochi จะขยับต่อให้");
  status.setAttribute("role", "status");
  function button(text, cls) {
    const b = element("button", cls || "vm-mochi-tool", text);
    b.type = "button";
    return b;
  }
  const b2 = button("2D"), b3 = button("3D"), replay = button("เล่นอีกครั้ง ↻", "vm-button vm-button-small"), view = button("หมุนมุมมอง ↻");
  view.hidden = true;
  b2.setAttribute("aria-pressed", "true");
  b3.setAttribute("aria-pressed", "false");
  modes.append(b2, b3);
  const speedLabel = element("label", "vm-mochi-speed", "จังหวะ "), speed = document.createElement("input"), speedText = element("output", "", "1×");
  speed.type = "range";
  speed.min = ".5";
  speed.max = "1.5";
  speed.step = ".1";
  speed.value = "1";
  speed.setAttribute("aria-label", "ความเร็ว Mochi");
  speedLabel.append(speed, speedText);
  tools.append(modes, speedLabel, view);
  const poseLabel = element('label', 'vm-mochi-pose', 'ท่าของ Mochi '), pose = element('select');
  pose.setAttribute('aria-label', 'ท่าของ Mochi ทั้ง 27 ท่า');
  for (const [value, meta] of Object.entries(STATES)) {
    const option = element('option', '', meta.label); option.value = value; pose.append(option);
  }
  poseLabel.append(pose);
  tools.append(poseLabel);
  actions.append(replay);
  wrap.append(tools, viewport, status, actions);
  root.append(wrap);
  let selected = id, disposed = false, rig3 = null, loading3 = false, mode = "2d", requestedMode = "2d", camera = 0, autoTime = 0, autoIndex = 0, lastPat = -10;
  const pet = createMochi(viewport, { scope, size: "100%", state: MOCHI_ACTIONS[id]?.[0] || "idle", onComplete: (state) => {
    if (selected !== "mochi-showcase") status.textContent = "Mochi รอเล่นต่ออยู่ · กดอีกครั้งได้เลย";
    onEvent({ type: "mochi-complete", state });
  } });
  const draw3 = scope.frame((dt, t) => {
    if (rig3 && mode === "3d") rig3.render(pet.displayPose, pet.motion.clock, dt);
    if (selected === "mochi-showcase") {
      autoTime += dt;
      if (autoTime > 4.5) {
        autoTime = 0;
        autoIndex = (autoIndex + 1) % sequence.length;
        pet.setState(sequence[autoIndex]);
      }
    }
  });
  function setAction(next) {
    if (!MOCHI_ACTIONS[next]) throw new RangeError(`Unknown Mochi action: ${next}`);
    selected = next;
    autoTime = 0;
    autoIndex = 0;
    pet.setState(next === "mochi-showcase" ? sequence[0] : MOCHI_ACTIONS[next][0]);
    pose.value = pet.state;
    replay.textContent = { "mochi-pet": "ลูบหัวอีกที ♡", "mochi-treat": "ส่งขนมให้ Mochi", "mochi-five": "ไฮไฟว์ ✋" }[next] || "เล่นอีกครั้ง ↻";
    status.textContent = next === "mochi-showcase" ? "ท่าต่อกันอัตโนมัติ · เลือก 2D หรือ 3D ได้" : next === "mochi-pet" ? "ลากเบา ๆ บนหัว หรือกดลูบหัวด้านล่าง" : "ลองเปลี่ยนท่าขณะน้องขยับได้เลย";
    if (scope.reduced() && rig3) rig3.render(pet.motion.pose(), 0, 0);
  }
  async function setMode(next) {
    if (disposed) return;
    requestedMode = next;
    if (next === "3d" && !rig3) {
      if (loading3) return;
      loading3 = true;
      b3.textContent = "กำลังเตรียม…";
      try {
        const { createRig3D } = await import("./renderer-3d.js");
        if (disposed || requestedMode !== '3d') return;
        rig3 = createRig3D(viewport, { onError: () => {
          if (!disposed) {
            status.textContent = "อุปกรณ์นี้แสดง 3D ไม่ได้ ใช้ 2D ต่อได้เลย";
            mode = "2d";
            requestedMode = "2d";
            view.hidden = true;
            pet.element.hidden = false;
            pet.refresh();
            if (rig3) rig3.canvas.hidden = true;
            b2.setAttribute("aria-pressed", "true");
            b3.setAttribute("aria-pressed", "false");
            const failedRig = rig3;
            rig3 = null;
            failedRig?.destroy();
          }
        } });
      } catch {
        if (!disposed) status.textContent = "อุปกรณ์นี้แสดง 3D ไม่ได้ ใช้ 2D ต่อได้เลย";
        return;
      } finally {
        loading3 = false;
        if (!disposed) b3.textContent = "3D";
      }
    }
    if (disposed || requestedMode !== next) {
      if (rig3) rig3.canvas.hidden = mode !== "3d";
      return;
    }
    mode = next;
    pet.element.hidden = mode === "3d";
    if (mode === "2d") pet.refresh();
    if (rig3) {
      rig3.canvas.hidden = mode !== "3d";
      rig3.render(pet.displayPose, pet.motion.clock, 1 / 60);
    }
    view.hidden = mode !== "3d";
    b2.setAttribute("aria-pressed", mode === "2d");
    b3.setAttribute("aria-pressed", mode === "3d");
  }
  scope.on(b2, "click", () => setMode("2d"));
  scope.on(b3, "click", () => setMode("3d"));
  const replayPose = () => {
    if (selected === 'mochi-showcase') { setAction(selected); return; }
    pet.setState(pose.value);
    if (scope.reduced() || scope.isPaused) rig3?.render(pet.displayPose, pet.motion.clock, 0);
  };
  scope.on(replay, "click", replayPose);
  scope.on(pose, 'change', () => {
    selected = null;
    replay.textContent = 'เล่นท่านี้อีกครั้ง';
    replayPose();
    status.textContent = STATES[pose.value].label;
  });
  scope.on(speed, "input", () => {
    pet.setSpeed(Number(speed.value));
    speedText.textContent = `${Number(speed.value).toFixed(1)}×`;
  });
  scope.on(view, "click", () => {
    camera = (camera + 1) % 4;
    rig3?.setView(["threequarter", "front", "side", "back"][camera], { instant: scope.reduced() || scope.isPaused });
    if (scope.reduced() || scope.isPaused) rig3?.render(pet.motion.pose(), pet.motion.clock, 0);
  });
  scope.on(viewport, "pointermove", (e) => {
    if (!scope.enabled() || selected !== "mochi-pet" || scope.time - lastPat < 1.1) return;
    const r = viewport.getBoundingClientRect(), p = localPoint(e, viewport);
    if (p.y > r.height * 0.18 && p.y < r.height * 0.55 && p.x > r.width * 0.2 && p.x < r.width * 0.8) {
      lastPat = scope.time;
      pet.setState("pet");
      status.textContent = "Mochi ชอบให้ลูบหัว ♡";
    }
  }, { passive: true });
  scope.on(root, "vm:motionchange", () => {
    if (rig3 && scope.reduced()) rig3.render(pet.motion.pose(), 0, 0);
  });
  setAction(id);
  return { element: wrap, pet, setAction, replay() {
    replayPose();
  }, get mode() {
    return mode;
  }, setMode, destroy() {
    if (disposed) return;
    disposed = true;
    draw3();
    rig3?.destroy();
    pet.destroy();
    wrap.remove();
  } };
}
