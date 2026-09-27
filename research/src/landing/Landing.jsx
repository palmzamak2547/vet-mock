// The front door at / [M1-DESIGN.md 15]. Port of work/research-studio/design/ (WebGL herd, scroll
// story) plus the chapter "what CUVET papers use" from the Europe PMC counts, the closing call and the
// footer with sources. Header state (chapter, scrolled, footer reached) lives in data attributes on
// the root, written only when they change, so CSS transitions do the motion and nothing re-renders
// per frame. OWNER: landing role.
import { useEffect, useMemo, useRef } from 'react';
import { registerArea, useT } from '../i18n/index.js';
import landing from '../i18n/landing.js';
import Story from './story/Story.jsx';
import MethodsChapter from './chart/MethodsChapter.jsx';
import SiteHeader from './shell/SiteHeader.jsx';
import SiteFooter, { CtaSection } from './shell/SiteFooter.jsx';
import { useMeta } from './shell/meta.js';
import { useReducedMotion } from './shell/theme.js';
import '../styles/landing.css';

registerArea('landing', landing);

export default function Landing() {
  const { t } = useT();
  const reduce = useReducedMotion();
  const rootRef = useRef(null);
  useMeta(t('landing.meta.title'), t('landing.meta.description'));

  // One writer for the header state. The story reports its chapter (-1 when it is off screen); the
  // methods chapter and the footer report whether they are in view.
  const chrome = useMemo(() => {
    const st = { story: 0, papers: false, scrolled: false, written: '' };
    const write = () => {
      const root = rootRef.current;
      if (!root) return;
      const chapter = st.papers ? 5 : Math.max(0, st.story);
      const key = `${chapter}|${st.scrolled ? 1 : 0}`;
      if (key === st.written) return;
      st.written = key;
      root.setAttribute('data-chapter', String(chapter));
      root.setAttribute('data-scrolled', st.scrolled ? '1' : '0');
    };
    return {
      story(chapter, scrolled) {
        st.story = chapter;
        st.scrolled = scrolled;
        write();
      },
      papers(inView) {
        st.papers = inView;
        st.scrolled = window.scrollY > 24;
        write();
      },
    };
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    const papers = root.querySelector('#rs-papers');
    const footer = root.querySelector('[data-rs="footer"]');
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.target === papers) chrome.papers(e.isIntersecting);
          if (e.target === footer && e.isIntersecting) root.setAttribute('data-footer', '1');
        }
      },
      { rootMargin: '0px 0px -40% 0px' },
    );
    if (papers) io.observe(papers);
    if (footer) io.observe(footer);
    return () => io.disconnect();
  }, [chrome]);

  // Smooth anchor scrolling on this page only, and never under reduced motion.
  useEffect(() => {
    if (reduce) return undefined;
    const html = document.documentElement;
    const prev = html.style.scrollBehavior;
    html.style.scrollBehavior = 'smooth';
    return () => {
      html.style.scrollBehavior = prev;
    };
  }, [reduce]);

  return (
    <div className="rs-landing" ref={rootRef} data-chapter="0" data-scrolled="0" data-footer="0" data-reduce={reduce ? 'true' : 'false'}>
      <SiteHeader />
      <main id="rs-main" tabIndex={-1}>
        <Story chrome={chrome} />
        <MethodsChapter />
        <CtaSection />
      </main>
      <SiteFooter />
    </div>
  );
}
