// ============================================================
// useLandingMotion — lightweight landing state choreography
// ============================================================
// Navigation highlighting is the only motion-layer behavior that carries
// information. IntersectionObserver updates it when a section crosses the
// reading band, so the landing does no per-frame scroll work and attaches no
// pointermove physics. Visual hover/press feedback stays in CSS and the page is
// fully functional when IntersectionObserver is unavailable.
// ============================================================

import { useEffect } from 'react';

export function useLandingMotion() {
  useEffect(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return undefined;

    const links = Array.from(document.querySelectorAll('.lp-navlink'));
    const pairs = links
      .map((link) => {
        const href = link.getAttribute('href') || '';
        const target = href.startsWith('#') ? document.getElementById(href.slice(1)) : null;
        return target ? { link, target } : null;
      })
      .filter(Boolean);

    if (pairs.length === 0) return undefined;

    const linkForTarget = new Map(pairs.map(({ link, target }) => [target, link]));
    const visibleTargets = new Set();
    const syncActiveLink = () => {
      const [nearest] = Array.from(visibleTargets).sort((a, b) => (
        Math.abs(a.getBoundingClientRect().top - 104)
        - Math.abs(b.getBoundingClientRect().top - 104)
      ));
      const current = nearest ? linkForTarget.get(nearest) : null;
      links.forEach((link) => link.classList.toggle('is-active', link === current));
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) visibleTargets.add(entry.target);
        else visibleTargets.delete(entry.target);
      });
      syncActiveLink();
    }, {
      // Observe the reading band below the sticky header, not the whole screen.
      rootMargin: '-96px 0px -55% 0px',
      threshold: [0, 0.01],
    });

    pairs.forEach(({ target }) => observer.observe(target));

    return () => {
      observer.disconnect();
      links.forEach((link) => link.classList.remove('is-active'));
    };
  }, []);
}
