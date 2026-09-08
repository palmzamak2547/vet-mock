import { clamp, element, svgPaw } from "./core.js";
export const LOADER_PRESETS = ["pawsteps", "orbital", "pages", "heartbeat", "dots", "helix", "skeleton", "progress"];
export function createLoader(root, { variant = "pawsteps", progress = 36, label = "Mochi กำลังเตรียมให้", scope } = {}) {
  if (!LOADER_PRESETS.includes(variant)) throw new Error(`Unknown loader: ${variant}`);
  const wrap = element("div", `vm-loader vm-loader-${variant}`), art = element("div", "vm-loader-art"), caption = element("p", "vm-loader-caption", label);
  art.setAttribute("aria-hidden", "true");
  wrap.setAttribute("role", "status");
  wrap.setAttribute("aria-live", "polite");
  wrap.append(art, caption);
  root.append(wrap);
  if (variant === "pawsteps") for (let i = 0; i < 4; i++) {
    const p = element("span");
    p.innerHTML = svgPaw();
    p.style.setProperty("--i", i);
    art.append(p);
  }
  if (variant === "orbital") {
    art.innerHTML = "<i></i><i></i><span>✦</span>";
  }
  if (variant === "pages") art.innerHTML = '<div class="vm-book"><i></i><i></i><i></i><i></i></div>';
  if (variant === "heartbeat") art.innerHTML = '<svg viewBox="0 0 220 80"><path class="pulse-track" d="M0 42H52L65 28 82 62 102 8 120 68 134 42H220"/><path class="pulse-line" d="M0 42H52L65 28 82 62 102 8 120 68 134 42H220"/></svg>';
  if (variant === "dots") for (let i = 0; i < 3; i++) {
    const dot = element("i");
    dot.style.setProperty("--i", i);
    art.append(dot);
  }
  if (variant === "helix") for (let i = 0; i < 8; i++) {
    const row = element("span");
    row.style.setProperty("--i", i);
    row.innerHTML = "<i></i><i></i>";
    art.append(row);
  }
  if (variant === "skeleton") art.innerHTML = '<div class="vm-skeleton-avatar"></div><div><i></i><i></i><i></i></div>';
  let fill, value;
  if (variant === "progress") {
    art.removeAttribute("aria-hidden");
    art.setAttribute("role", "progressbar");
    art.setAttribute("aria-label", label);
    art.setAttribute("aria-valuemin", "0");
    art.setAttribute("aria-valuemax", "100");
    fill = element("div", "vm-progress-fill");
    fill.innerHTML = svgPaw();
    value = element("b", "vm-progress-value");
    art.append(fill, value);
  }
  function setProgress(n) {
    if (!fill) return;
    const v = clamp(Math.round(Number(n) || 0), 0, 100);
    fill.style.width = `${v}%`;
    value.textContent = `${v}%`;
    art.setAttribute("aria-valuenow", v);
  }
  setProgress(progress);
  return { element: wrap, setProgress, setLabel(text) {
    caption.textContent = text;
  }, destroy() {
    wrap.remove();
  } };
}
