import { createMochi } from "./mochi/companion.js";
import { createMochiLab } from "./mochi/lab.js";
import { createFollower } from "./mochi/follower.js";
export { createMochi } from "./mochi/companion.js";
export { createMotion, STATES as MOCHI_STATES } from "./mochi/motion.js";
import { createScope, element } from "./core.js";
import { EFFECTS } from "./catalog.js";
import { createParticles } from "./particles.js";
import { createLoader } from "./loaders.js";
import { createInteraction } from "./interactions.js";
import { selectReadingItem } from './reading.js';
export { playFeedback, bindHoverFeedback } from './feedback.js';
import { createPlay } from "./play.js";
export { EFFECTS, GROUPS } from "./catalog.js";
export { createScope } from "./core.js";
export { createParticles, POINTER_PRESETS, BURST_PRESETS } from "./particles.js";
export { createLoader, LOADER_PRESETS } from "./loaders.js";
export { createInteraction, INTERACTION_PRESETS } from "./interactions.js";
export function mountEffect(root, id = "paw", options = {}) {
  const effect = EFFECTS.find((e) => e.id === id);
  if (!effect) throw new Error(`Unknown VetMock effect: ${id}`);
  const existing = new Set(root.childNodes);
  const scope = createScope(root, options), children = [], assetBase = options.assetBase || "./assets";
  root.classList.add("vm-host");
  root.dataset.effect = id;
  let api = {}, poster;
  const companions = [];
  function add(el) {
    root.append(el);
    children.push(el);
    return el;
  }
  function mascot(caption) {
    const content = element("div", "vm-stage-mascot"), seat = element("div", "vm-mascot-seat");
    content.append(seat, element("p", "", caption));
    add(content);
    poster = createMochi(seat, { scope, size: 250, interactive: false });
    companions.push(poster);
  }
  try {
  if (effect.group === "mochi") api = createMochiLab(root, { scope, id, onEvent: options.onEvent });
  if (effect.group === "cursor") {
    if (id === "mochi") api = createFollower(root, { scope, kind: "cursor" });
    else {
      mascot("เลื่อนเมาส์ หรือแตะพื้นที่รอบตัว Mochi");
      api = createParticles(root, { ...options, scope, preset: id, kind: "cursor", assetBase });
    }
  }
  if (effect.group === "loading") {
    const content = add(element("div", "vm-loader-demo"));
    content.append(element("span", "vm-demo-tag", "ตัวอย่างระหว่างรอโหลด"));
    api = createLoader(content, { scope, variant: id, progress: options.progress ?? 36 });
    if (id === "progress") {
      const label = element("label", "vm-range-label", "ปรับความคืบหน้าจริง "), slider = element("input");
      slider.type = "range";
      slider.min = "0";
      slider.max = "100";
      slider.value = options.progress ?? 36;
      slider.setAttribute("aria-label", "ความคืบหน้าเป็นเปอร์เซ็นต์");
      label.append(slider);
      content.append(label);
      scope.on(slider, "input", () => api.setProgress(slider.value));
    }
    content.append(element("p", "vm-footnote", id === "progress" ? "เชื่อม setProgress() กับงานที่โหลดจริงได้" : "แอนิเมชันรอโหลดแบบวนซ้ำ"));
  }
  if (effect.group === "interaction") api = createInteraction(root, { scope, variant: id, onEvent: options.onEvent });
  if (effect.group === "celebration") {
    mascot(id === "chapter" ? "อีกหนึ่งบทที่ทำสำเร็จแล้ว" : id === "streak" ? "มาเรียนด้วยกันต่ออีกวัน" : "เรื่องเล็ก ๆ ก็ฉลองได้");
    api = createParticles(root, { ...options, scope, preset: id, kind: "burst" });
    const b = add(element("button", "vm-button vm-celebrate-button", id === "chapter" ? "จบบทแล้ว ✓" : id === "streak" ? "ลองฉลองสตรีก ✦" : "ฉลองกัน ✦"));
    b.type = "button";
    scope.on(b, "click", () => {
      api.burst(id);
      poster?.setState(id === "chapter" || id === "streak" ? "celebrate" : "happy");
      options.onEvent?.({ type: "celebrate", variant: id });
    });
  }
  if (effect.group === "play") api = createPlay(root, { scope, variant: id, assetBase, onEvent: options.onEvent });
  if (effect.group === "ambient" && id !== "focus") {
    api = createParticles(root, { scope, preset: id, kind: "ambient" });
    if (id !== "garden") {
      mascot(id === "rain" ? "ฝนเบา ๆ ระหว่างพักสายตา" : "อยู่ในสวนเงียบ ๆ สักครู่");
    }
  }
  if (id === "focus") {
    let select = function(i) {
      current = i;
      selectReadingItem(bs, i);
      bs.forEach((b, j) => {
        b.classList.toggle("is-focused", i === j);
      });
    };
    const article = add(element("div", "vm-focus-article")), lines = ["ค่อย ๆ อ่านทีละบรรทัด", "ไม่จำเป็นต้องจำได้ทั้งหมดในครั้งเดียว", "เว้นพื้นที่ให้ตัวเองได้พักบ้าง", "แล้วเราจะกลับมาพร้อมใจกว่าเดิม"];
    let current = 0;
    const bs = lines.map((line, i) => {
      const b = element("button", "vm-focus-line", line);
      b.type = "button";
      article.append(b);
      scope.on(b, "click", () => select(i));
      return b;
    });
    const next = element("button", "vm-button vm-button-small", "บรรทัดถัดไป ↓");
    next.type = "button";
    article.append(next);
    scope.on(next, "click", () => select((current + 1) % lines.length));
    select(0);
  }
  return { id, scope, api, setEffect(next) {
    if (!api.setAction) return false;
    api.setAction(next);
    this.id = next;
    root.dataset.effect = next;
    return true;
  }, replay() {
    if (api.replay) api.replay();
    else api.burst?.(id);
  }, setProgress(v) {
    api.setProgress?.(v);
  }, setIntensity(v) {
    api.setIntensity?.(v);
  }, setPaused(v) {
    scope.setPaused(v);
  }, setQuiet(v) {
    scope.setQuiet(v);
  }, destroy() {
    api.destroy?.();
    companions.forEach((p) => p.destroy());
    scope.destroy();
    children.forEach((el) => el.remove());
    root.classList.remove("vm-host");
    delete root.dataset.effect;
  } };
  } catch (error) {
    scope.destroy(); api.destroy?.(); companions.forEach(p => p.destroy());
    for (const node of [...root.childNodes]) if (!existing.has(node)) node.remove();
    root.classList.remove('vm-host'); delete root.dataset.effect;
    throw error;
  }
}
export async function createMochi3D(host, options) {
  const module = await import("./mochi/companion-3d.js");
  return module.createMochi3D(host, options);
}
