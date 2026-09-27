// Page title and description per language [M1-DESIGN.md 15.4]. The static tags crawlers and link
// previews read (Open Graph, the 1200 x 630 image) are in research/index.html (runtime role); this
// hook keeps the live title and description in the reader's language. OWNER: landing role.
import { useEffect } from 'react';

function setMeta(selector, attr, value) {
  const el = document.head.querySelector(selector);
  if (el) el.setAttribute(attr, value);
}

/** @param {string} title @param {string} description */
export function useMeta(title, description) {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = title;
    setMeta('meta[name="description"]', 'content', description);
    setMeta('meta[property="og:title"]', 'content', title);
    setMeta('meta[property="og:description"]', 'content', description);
    return () => {
      document.title = prevTitle;
    };
  }, [title, description]);
}
