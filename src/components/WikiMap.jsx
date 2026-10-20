import React, { useMemo } from 'react';
import { useModalFocus } from '../hooks/useModalFocus.js';
import { wikiPath } from '../lib/vetwiki/url.js';

// The map of VetWiki: every year, subject and topic as one tree, drawn after
// the Encyclopédie's "Système figuré des connaissances humaines" (1751) that
// opens it from the index colophon. Built from the same year groups as the
// shelves, so it never lists a topic the index does not. Every leaf is a real
// link (a new tab works); a plain click opens the article in place.
// The branches draw on once, staggered geometrically so the last starts by
// 200 ms whatever the count (delay = 200 (1 - 0.8^k)); with reduced motion or
// the device's quiet motion mode the tree is simply there (styles-wiki.css).
export default function WikiMap({ yearGroups, nameOf, isRead, onOpen, onClose }) {
  const dialogRef = useModalFocus({ onClose });
  const totals = useMemo(() => {
    let subjects = 0, topics = 0;
    for (const [, list] of yearGroups) for (const [, ts] of list) { subjects += 1; topics += ts.length; }
    return { subjects, topics };
  }, [yearGroups]);
  let k = 0;
  const delay = () => `${Math.round(200 * (1 - 0.8 ** k++))}ms`;

  return (
    <div className="vmx-modal-overlay vw-map-overlay" onClick={onClose}>
      <div ref={dialogRef} className="vw-map" role="dialog" aria-modal="true" aria-labelledby="vw-map-title"
        tabIndex={-1} data-vmx-modal="true" onClick={(e) => e.stopPropagation()}>
        <header className="vw-map-head">
          <div>
            <h2 id="vw-map-title">แผนที่ VetWiki</h2>
            <p>{totals.topics.toLocaleString('en-US')} หัวข้อ ใน {totals.subjects} วิชา แตกกิ่งแบบแผนผังความรู้ของ Encyclopédie (1751)</p>
          </div>
          <button type="button" className="vmx-btn vmx-btn-ghost vmx-btn-sm vw-map-close" onClick={onClose}>ปิด</button>
        </header>
        <ol className="vw-tree">
          {yearGroups.map(([year, list]) => (
            <li key={year ?? 'other'} className="vw-tree-year" style={{ '--vw-d': delay() }}>
              <span className="vw-tree-node">{year ? `ปี ${year}` : 'วิชาอื่น'}</span>
              <ol>
                {list.map(([id, ts]) => (
                  <li key={id} className="vw-tree-subject" style={{ '--vw-d': delay() }}>
                    <span className="vw-tree-node">{nameOf(id)}</span>
                    <ol>
                      {ts.map((t) => (
                        <li key={t.id}>
                          <a href={wikiPath(t.subject, t.topic)}
                            onClick={(e) => {
                              if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
                              e.preventDefault();
                              onOpen(t.id);
                            }}>
                            {t.title}
                            {isRead(t) && <span className="vw-read-mark">อ่านแล้ว</span>}
                          </a>
                        </li>
                      ))}
                    </ol>
                  </li>
                ))}
              </ol>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
