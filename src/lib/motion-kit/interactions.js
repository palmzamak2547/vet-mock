import { element, svgPaw } from "./core.js";
export const INTERACTION_PRESETS = ["magnet", "tilt", "ripple", "flip", "bookmark", "reveal", "retry", "like", "accordion", "toast"];
export function createInteraction(root, { variant = "magnet", scope, onEvent = () => {
} } = {}) {
  if (!INTERACTION_PRESETS.includes(variant)) throw new Error(`Unknown interaction: ${variant}`);
  const wrap = element("div", "vm-interaction"), status = element("p", "vm-feedback", "ลองกดเล่นได้เลย");
  status.setAttribute("role", "status");
  root.append(wrap);
  let active = false;
  function button(text, cls = "vm-button") {
    const b = element("button", cls, text);
    b.type = "button";
    wrap.append(b);
    return b;
  }
  function feedback(text) {
    status.textContent = text;
    onEvent({ type: variant, value: text });
  }
  if (variant === "magnet") {
    const b = button("มาเริ่มอ่านกัน ↗");
    scope.on(b, "pointermove", (e) => {
      if (scope.reduced() || !scope.enabled() || e.pointerType === "touch") return;
      const r = wrap.getBoundingClientRect();
      b.style.translate = `${(e.clientX - r.left - r.width / 2) * 0.16}px ${(e.clientY - r.top - r.height / 2) * 0.22}px`;
    });
    scope.on(b, "pointerleave", () => b.style.translate = "0 0");
    scope.on(b, "click", () => {
      b.style.translate = "0 0";
      feedback("พร้อมแล้ว ไปทีละนิดด้วยกัน");
      scope.animate(b, [{ scale: 1 }, { scale: 0.94 }, { scale: 1 }]);
    });
  }
  if (variant === "tilt") {
    const card = button("", "vm-tilt vm-study-card");
    card.innerHTML = '<span class="vm-card-kicker">YOUR LITTLE STUDY BUDDY</span><span class="vm-card-paw">' + svgPaw() + "</span><strong>Small steps.<br>Big progress.</strong><span>เลื่อนเมาส์บนการ์ด · แตะเพื่อเด้ง</span>";
    scope.on(card, "pointermove", (e) => {
      if (scope.reduced() || !scope.enabled() || e.pointerType === "touch") return;
      const r = wrap.getBoundingClientRect();
      card.style.transform = `perspective(750px) rotateX(${(e.clientY - r.top - r.height / 2) * -0.045}deg) rotateY(${(e.clientX - r.left - r.width / 2) * 0.045}deg)`;
    });
    scope.on(card, "pointerleave", () => card.style.transform = "");
    scope.on(card, "click", () => {
      scope.animate(card, [{ scale: 1 }, { scale: 1.025 }, { scale: 1 }]);
      feedback("ทีละก้าวก็เป็นความก้าวหน้า");
    });
  }
  if (variant === "ripple") {
    const b = button("แตะให้ใจฟู", "vm-button vm-ripple-button");
    scope.on(b, "click", (e) => {
      const r = b.getBoundingClientRect(), ripple = element("i", "vm-ripple");
      ripple.style.left = `${e.detail ? e.clientX - r.left : r.width / 2}px`;
      ripple.style.top = `${e.detail ? e.clientY - r.top : r.height / 2}px`;
      b.append(ripple);
      const a = scope.animate(ripple, [{ transform: "translate(-50%,-50%) scale(0)", opacity: 0.45 }, { transform: "translate(-50%,-50%) scale(1)", opacity: 0 }], { duration: 650 });
      if (a) a.finished.finally(() => ripple.remove()).catch(() => {
      });
      else ripple.remove();
      feedback("ส่งความนุ่มนวลให้หนึ่งคลื่น");
    });
  }
  if (variant === "flip") {
    const card = button("", "vm-flip-card");
    card.setAttribute("aria-pressed", "false");
    card.innerHTML = '<span class="vm-flip-inner"><span class="vm-flip-front"><small>FLASHCARD / 01</small><strong>วันนี้อยากทำอะไร<br>ให้ตัวเองบ้าง?</strong><span>แตะเพื่อพลิก ↻</span></span><span class="vm-flip-back"><small>A LITTLE REMINDER</small><strong>พักให้พอ<br>แล้วค่อยไปต่อ ♡</strong><span>แตะเพื่อกลับด้าน ↻</span></span></span>';
    const sync = () => {
      card.querySelector(".vm-flip-front").setAttribute("aria-hidden", active);
      card.querySelector(".vm-flip-back").setAttribute("aria-hidden", !active);
    };
    sync();
    scope.on(card, "click", () => {
      active = !active;
      card.classList.toggle("is-flipped", active);
      card.setAttribute("aria-pressed", active);
      sync();
      feedback(active ? "เปิดคำตอบแล้ว" : "กลับมาด้านคำถามแล้ว");
    });
  }
  if (variant === "bookmark" || variant === "like") {
    const heart = variant === "like", b = button(heart ? "♡ ส่งกำลังใจ" : "☆ บันทึกไว้อ่าน");
    b.setAttribute("aria-pressed", "false");
    scope.on(b, "click", () => {
      active = !active;
      b.setAttribute("aria-pressed", active);
      b.textContent = heart ? active ? "♥ ส่งกำลังใจแล้ว" : "♡ ส่งกำลังใจ" : active ? "★ บันทึกแล้ว" : "☆ บันทึกไว้อ่าน";
      scope.animate(b, [{ transform: "scale(1)" }, { transform: "scale(1.16) rotate(-3deg)" }, { transform: "scale(1)" }]);
      feedback(active ? heart ? "Mochi ได้รับหัวใจแล้ว" : "บันทึกตัวอย่างนี้แล้ว" : "ยกเลิกแล้ว");
    });
  }
  if (variant === "reveal") {
    const paper = element("div", "vm-answer", "คำตอบ: เริ่มจากเรื่องเล็ก ๆ ที่ทำไหววันนี้"), b = button("เปิดเฉลย ✦");
    paper.hidden = true;
    b.setAttribute("aria-expanded", "false");
    wrap.prepend(paper);
    scope.on(b, "click", () => {
      active = !active;
      paper.hidden = !active;
      b.setAttribute("aria-expanded", active);
      b.textContent = active ? "ซ่อนเฉลย" : "เปิดเฉลย ✦";
      if (active) scope.animate(paper, [{ opacity: 0, transform: "translateY(12px)" }, { opacity: 1, transform: "translateY(0)" }]);
      feedback(active ? "เฉลยพร้อมแล้ว" : "ซ่อนเฉลยแล้ว");
    });
  }
  if (variant === "retry") {
    const b = button("ลองคำตอบนี้", "vm-button vm-button-warm");
    scope.on(b, "click", () => {
      scope.animate(b, [{ transform: "translateX(0)" }, { transform: "translateX(-7px)" }, { transform: "translateX(6px)" }, { transform: "translateX(-3px)" }, { transform: "translateX(0)" }], { duration: 380 });
      feedback("ยังไม่ใช่ แต่ลองใหม่ได้เสมอ ♡");
    });
  }
  if (variant === "accordion") {
    const details = element("details", "vm-details"), summary = element("summary", "", "จดหมายจาก Mochi"), content = element("div", "vm-details-body", "วันนี้ไม่ต้องเก่งทุกเรื่องก็ได้ แค่ค่อย ๆ เรียนรู้ในจังหวะของตัวเอง Mochi จะอยู่ข้าง ๆ นะ");
    details.append(summary, content);
    wrap.append(details);
    scope.on(details, "toggle", () => {
      if (details.open) scope.animate(content, [{ opacity: 0, transform: "translateY(-8px)" }, { opacity: 1, transform: "translateY(0)" }], { duration: 300 });
      feedback(details.open ? "เปิดจดหมายแล้ว" : "พับจดหมายแล้ว");
    });
  }
  if (variant === "toast") {
    const b = button("บันทึกโน้ต"), toast = element("div", "vm-toast", "✓ โน้ตตัวอย่างถูกบันทึกแล้ว");
    toast.setAttribute("role", "status");
    toast.hidden = true;
    wrap.append(toast);
    let version = 0;
    scope.on(b, "click", () => {
      version++;
      const v = version;
      toast.hidden = false;
      scope.animate(toast, [{ opacity: 0, transform: "translateY(18px)" }, { opacity: 1, transform: "translateY(0)" }]);
      scope.later(() => {
        if (v === version) toast.hidden = true;
      }, 3200);
      feedback("แสดงข้อความแจ้งเตือนแล้ว");
    });
  }
  wrap.append(status);
  return { element: wrap, destroy() {
    wrap.remove();
  } };
}
