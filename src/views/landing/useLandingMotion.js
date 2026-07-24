// ============================================================
// useLandingMotion — the landing's full motion layer
// ============================================================
// Recreates the design's motion system (design_handoff_vetmock_landing
// initMotion). Everything here is PROGRESSIVE ENHANCEMENT: it only runs
// on a fine pointer (mouse/trackpad) with motion allowed, and is fully
// removed on cleanup — content + functionality are complete without it.
//
// Features:
//   1. Scroll-progress rail (left, desktop >1100px) — Observe → Interpret
//      → Decide → Verify → Improve, fills as you scroll.
//   2. Scroll-spy nav underline — the active section's nav link gets the
//      sage "diagnostic underline" (.is-active).
//   3. Magnetic primary buttons — drift ≤ a few px toward the cursor.
//   4. Cursor tilt on cards (≤3°) — subject/stat/mode cards.
//   5. Diagnostic spotlight — a soft sage glow follows the cursor inside
//      the exam/lab question cards.
//
// Disabled under prefers-reduced-motion and on coarse/touch pointers.
// ============================================================

import { useEffect } from 'react';

const STAGES = ['Observe', 'Interpret', 'Decide', 'Verify', 'Improve'];

export function useLandingMotion() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const fine = window.matchMedia && window.matchMedia('(pointer:fine)').matches;

    const cleanups = [];
    const add = (el, ev, fn, opts) => { el.addEventListener(ev, fn, opts); cleanups.push(() => el.removeEventListener(ev, fn, opts)); };

    // ---- 1 + 2: scroll-progress rail + scroll-spy nav underline ----
    let rail = null;
    if (!reduce && window.innerWidth > 1000) {
      rail = document.createElement('div');
      rail.className = 'lp-rail';
      rail.setAttribute('aria-hidden', 'true');
      rail.innerHTML = STAGES.map((s, i) =>
        `<div class="lp-rail-item" data-i="${i}"><span class="lp-rail-dot"></span><span class="lp-rail-label">${s}</span></div>`
      ).join('');
      document.body.appendChild(rail);
      cleanups.push(() => rail && rail.remove());
    }

    const links = Array.from(document.querySelectorAll('.lp-navlink'));
    const onScroll = () => {
      const h = Math.max(1, document.body.scrollHeight - window.innerHeight);
      const f = window.scrollY / h;
      if (rail) {
        const active = Math.min(STAGES.length - 1, Math.floor(f * STAGES.length + 0.001));
        rail.querySelectorAll('[data-i]').forEach((el, i) => {
          el.classList.toggle('is-on', i <= active);
          el.classList.toggle('is-current', i === active);
        });
      }
      // scroll-spy: last nav link whose target is above the 120px line
      let cur = null;
      for (const a of links) {
        const href = a.getAttribute('href');
        if (!href || href[0] !== '#') continue;
        const target = document.querySelector(href);
        if (target && target.getBoundingClientRect().top < 120) cur = a;
      }
      links.forEach((a) => a.classList.toggle('is-active', a === cur));
    };
    add(window, 'scroll', onScroll, { passive: true });
    onScroll();

    // The pointer-driven effects below only make sense with a real cursor.
    if (!fine || reduce) return () => cleanups.forEach((fn) => fn());

    // ---- 3: magnetic primary buttons ----
    document.querySelectorAll('.lp-root .vmx-btn-primary').forEach((b) => {
      const move = (e) => {
        const r = b.getBoundingClientRect();
        b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.16}px, ${(e.clientY - r.top - r.height / 2) * 0.2}px)`;
      };
      const leave = () => { b.style.transform = ''; };
      add(b, 'pointermove', move);
      add(b, 'pointerleave', leave);
    });

    // ---- 4: ≤3° cursor tilt on cards ----
    document.querySelectorAll('.lp-root .vmx-subject-card, .lp-root .vmx-stat-card').forEach((c) => {
      const move = (e) => {
        const r = c.getBoundingClientRect();
        c.style.transform = `perspective(720px) rotateX(${-(((e.clientY - r.top) / r.height) - 0.5) * 3}deg) rotateY(${(((e.clientX - r.left) / r.width) - 0.5) * 3}deg) translateY(-2px)`;
      };
      const leave = () => { c.style.transform = ''; };
      add(c, 'pointermove', move);
      add(c, 'pointerleave', leave);
    });

    // ---- 5: diagnostic spotlight inside question cards ----
    const spot = document.createElement('div');
    spot.className = 'lp-spotlight';
    spot.setAttribute('aria-hidden', 'true');
    document.body.appendChild(spot);
    cleanups.push(() => spot.remove());
    document.querySelectorAll('.lp-root .vmx-question-card').forEach((card) => {
      const move = (e) => {
        spot.style.left = `${e.clientX - 150}px`;
        spot.style.top = `${e.clientY - 150}px`;
        spot.style.opacity = '1';
      };
      const leave = () => { spot.style.opacity = '0'; };
      add(card, 'pointermove', move);
      add(card, 'pointerleave', leave);
    });

    return () => cleanups.forEach((fn) => fn());
  }, []);
}
