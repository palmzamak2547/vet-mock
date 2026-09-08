import { mascotSVG } from "./svg-art.js";
const n = (x) => Number(x.toFixed(4)), deg = (x) => n(x * 180 / Math.PI);
export function createRig2D(host, { label = "Mochi เพื่อนอ่านหนังสือของ VetMock", shadow = true } = {}) {
  const wrapper = document.createElement("div");
  wrapper.className = "vm-mochi-rig";
  wrapper.innerHTML = mascotSVG("idle", 0, { label, shadow });
  host.append(wrapper);
  const svg = wrapper.firstElementChild, rig = Object.fromEntries([...svg.querySelectorAll("[data-rig]")].map((el) => [el.dataset.rig, el]));
  rig.body.insertBefore(rig.armL, rig.book);
  rig.body.insertBefore(rig.armR, rig.book);
  function attr(key, name, value) {
    rig[key]?.setAttribute(name, String(value));
  }
  function render(p, t = 0) {
    attr("body", "transform", `translate(${n(p.x * 100)} ${n(-p.y * 90)}) translate(256 425) rotate(${-deg(p.rz)}) scale(${n(p.sx)} ${n(p.sy)}) translate(-256 -425)`);
    attr("head", "transform", `translate(${n(256 + p.headY * 26)} ${n(285 + p.headX * 18)}) rotate(${-deg(p.headZ)}) scale(${n(1 - Math.abs(p.headY) * 0.16)} ${n(1 - p.headX * 0.1)}) translate(-256 -285)`);
    attr("tail", "transform", `rotate(${deg(p.tail)} 193 373)`);
    for (const side of ["L", "R"]) {
      const x = side === "L" ? 194 : 318, foot = side === "L" ? 224 : 288, eye = side === "L" ? 211 : 302;
      attr(`arm${side}`, "transform", `translate(0 ${n(p[`arm${side}X`] * 7)}) rotate(${-deg(p[`arm${side}`])} ${x} 325)`);
      attr(`leg${side}`, "transform", `translate(0 ${-n(p[`legLift${side}`] * 100)}) rotate(${n(deg(p[`leg${side}`]) * 0.7)} ${foot} 406)`);
      attr(`eye${side}`, "transform", `translate(${n(eye + p.gaze * 65)} ${n(200 - p.gazeY * 120)}) scale(1 ${n(Math.max(0.055, p.eye))})`);
    }
    attr("earL", "transform", `rotate(${-deg(p.earL)} 170 145)`);
    attr("earR", "transform", `rotate(${-deg(p.earR)} 322 135)`);
    attr("scarf", "transform", `rotate(${deg(p.scarf)} 308 315)`);
    attr("mouth", "opacity", n(p.mouthOpen));
    attr("mouth", "transform", `translate(258 249) scale(1 ${n(0.45 + p.mouthOpen * 0.55)}) translate(-258 -249)`);
    attr("book", "opacity", n(p.book));
    attr("book", "transform", `translate(0 ${n(p.bookTilt * 30)})`);
    for (const key of ["spark", "question", "zzz", "heart", "check"]) attr(key, "opacity", n(p[key]));
    attr("spark", "transform", `rotate(${n(Math.sin(t * 0.5) * 12)} 256 250)`);
    attr("heart", "transform", `translate(370 ${n(198 - Math.sin(t * 2) * 5)}) scale(${n(0.7 + p.heart * 0.3)})`);
    attr("zzz", "transform", `translate(0 ${n(Math.sin(t * 1.2) * 5)})`);
    attr("breath", "r", n(150 + p.breath * 16));
    attr("breath", "opacity", n(p.breath * 0.26));
    attr("shadow", "rx", n(84 * Math.max(0.65, 1 - p.y * 0.5)));
    attr("shadow", "opacity", n(0.09 * Math.max(0.35, 1 - p.y)));
  }
  return { element: wrapper, svg, rig, render, destroy() {
    wrapper.remove();
  } };
}
