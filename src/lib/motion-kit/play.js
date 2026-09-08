import { element, random } from "./core.js";
import { createFollower } from "./mochi/follower.js";
export function createPlay(root, { variant = "memory", scope, assetBase = "./assets", onEvent = () => {
} } = {}) {
  const wrap = element("div", `vm-play vm-play-${variant}`), status = element("p", "vm-game-status");
  status.setAttribute("role", "status");
  root.append(wrap);
  let fx;
  function button(text, cls = "vm-button") {
    const b = element("button", cls, text);
    b.type = "button";
    wrap.append(b);
    return b;
  }
  if (variant === "fetch") {
    const b = button("โยนบอลให้ Mochi ↗", "vm-button vm-game-control");
    let turns = 0;
    status.textContent = "แตะพื้นที่ว่างเพื่อโยนบอล";
    wrap.append(status);
    fx = createFollower(root, { scope, kind: "fetch", onCatch: (n) => {
      status.textContent = `เก็บบอลแล้ว ${n} ครั้ง · เก่งมาก Mochi!`;
      onEvent({ type: "catch", count: n });
    } });
    scope.on(b, "click", () => {
      const r = root.getBoundingClientRect();
      turns++;
      fx.setTarget(r.width * (turns % 2 ? 0.73 : 0.27), r.height * (turns % 3 ? 0.62 : 0.4));
    });
  }
  if (variant === "memory") {
    const grid = element("div", "vm-memory"), symbols = ["☀", "☾", "✿", "♡"], rand = random(13), deck = [...symbols, ...symbols].map((s, i) => ({ s, k: rand(), i })).sort((a, b) => a.k - b.k);
    let opened = [], matched = 0, moves = 0, locked = false;
    status.textContent = "หาคู่ให้ครบ 4 คู่";
    wrap.append(grid, status);
    deck.forEach(({ s }, i) => {
      const b = element("button", "vm-memory-tile", "?");
      b.type = "button";
      b.dataset.symbol = s;
      b.setAttribute("aria-label", `เปิดการ์ดใบที่ ${i + 1}`);
      grid.append(b);
      scope.on(b, "click", () => {
        if (locked || b.getAttribute('aria-disabled') === 'true' || opened.includes(b)) return;
        b.textContent = s;
        b.classList.add("is-open");
        b.setAttribute("aria-label", `การ์ด ${s}`);
        opened.push(b);
        if (opened.length < 2) return;
        moves++;
        const [a, c] = opened;
        if (a.dataset.symbol === c.dataset.symbol) {
          a.setAttribute('aria-disabled', 'true');
          c.setAttribute('aria-disabled', 'true');
          a.classList.add("is-matched");
          c.classList.add("is-matched");
          opened = [];
          matched++;
          status.textContent = matched === 4 ? `ครบทุกคู่แล้ว! ใช้ ${moves} ตา ✦` : `เจอ ${matched}/4 คู่ · เล่น ${moves} ตา`;
          if (matched === 4) onEvent({ type: "win", moves });
        } else {
          locked = true;
          status.textContent = `ยังไม่ใช่คู่นี้ · เล่น ${moves} ตา`;
          scope.later(() => {
            for (const x of opened) {
              x.textContent = "?";
              x.classList.remove("is-open");
              x.setAttribute("aria-label", `เปิดการ์ดใบที่ ${[...grid.children].indexOf(x) + 1}`);
            }
            opened = [];
            locked = false;
          }, 850);
        }
      });
    });
  }
  if (variant === "bubbles") {
    const grid = element("div", "vm-bubbles");
    let n = 0;
    status.textContent = "จิ้มฟองได้ 0/12 ฟอง";
    wrap.append(grid, status);
    for (let i = 0; i < 12; i++) {
      const b = element("button", "vm-bubble");
      b.type = "button";
      b.setAttribute("aria-label", `จิ้มฟองที่ ${i + 1}`);
      b.style.setProperty("--i", i);
      grid.append(b);
      scope.on(b, "click", () => {
        if (b.getAttribute('aria-disabled') === 'true') return;
        b.setAttribute('aria-disabled', 'true');
        b.classList.add("is-popped");
        n++;
        status.textContent = n === 12 ? "หมดแล้ว! ไหล่เบาลงนิดหนึ่งไหม ♡" : `จิ้มฟองได้ ${n}/12 ฟอง`;
        scope.animate(b, [{ scale: 1, opacity: 1 }, { scale: 1.2, opacity: 0.4 }, { scale: 0.65, opacity: 0.15 }], { duration: 260 });
        onEvent({ type: "pop", count: n });
      });
    }
  }
  if (variant === "breath") {
    let labels = function() {
      const t = elapsed % 10, inhale = t < 4;
      const text = inhale ? "หายใจเข้า" : "หายใจออก";
      if (phase.textContent !== text) phase.textContent = text;
      const textCount = `${Math.ceil(inhale ? 4 - t : 10 - t)} วินาที`;
      if (count.textContent !== textCount) count.textContent = textCount;
    }, clock = function(token) {
      scope.later(() => {
        if (!running || token !== epoch) return;
        if (!scope.isPaused && scope.reduced()) elapsed += 0.25;
        if (!scope.isPaused) labels();
        clock(token);
      }, 250);
    };
    const circle = element("div", "vm-breath-circle"), phase = element("strong", "", "พร้อมเมื่อไหร่ก็ค่อยเริ่ม"), count = element("span", "", "รอบละ 10 วินาที");
    circle.append(phase, count);
    wrap.append(circle);
    const b = button("เริ่มหายใจไปด้วยกัน");
    let running = false, elapsed = 0, epoch = 0, stopBreath = null;
    scope.on(b, "click", () => {
      running = !running;
      epoch++;
      b.textContent = running ? "พักก่อน" : "เริ่มหายใจไปด้วยกัน";
      if (!running) {
        phase.textContent = "พักได้ตามสบาย";
        circle.style.scale = "1";
        stopBreath?.(); stopBreath = null;
      } else {
        elapsed = 0;
        labels();
        clock(epoch);
        stopBreath = scope.frame(animateBreath);
      }
      onEvent({ type: "breath", running });
    });
    function animateBreath(dt) {
      if (!running) return;
      elapsed += dt;
      const t = elapsed % 10, u = t < 4 ? t / 4 : 1 - (t - 4) / 6, e = u * u * u * (u * (u * 6 - 15) + 10);
      circle.style.scale = String(1 + e * 0.24);
      labels();
    }
    scope.on(root, "vm:motionchange", () => {
      if (scope.reduced()) circle.style.scale = "1";
    });
    status.textContent = "เข้า 4 วินาที · ออก 6 วินาที · ไม่ต้องฝืนจังหวะ";
    wrap.append(status);
  }
  return { element: wrap, destroy() {
    fx?.destroy();
    wrap.remove();
  } };
}
