import { useEffect, useRef, useState } from 'react';
import { SUBJECT_COVERS } from '../data/subject-covers.js';

// The browser's own lazy loading starts every cover within a few screens: on
// a first phone visit Home asked for 21 covers (1.4 MB) while two were on
// screen, and they competed with the app's own code for the connection. The
// plate keeps its height and paper colour, so the art is asked for only once
// its card comes within about a screen of view.
const NEAR = '600px 0px';

/** Decorative bookplate. The card retains its name and action if art fails. */
export default function SubjectCover({ subjectId }) {
  const [failedSrc, setFailedSrc] = useState(null);
  const plate = useRef(null);
  const [near, setNear] = useState(() => typeof IntersectionObserver === 'undefined');
  useEffect(() => {
    if (near || !plate.current) return undefined;
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) { setNear(true); io.disconnect(); }
    }, { rootMargin: NEAR });
    io.observe(plate.current);
    return () => io.disconnect();
  }, [near]);
  // The aggregate is a study action, so it reuses the collection's open book.
  const cover = SUBJECT_COVERS[subjectId === 'all' ? 'senior-project' : subjectId];
  if (!cover) return null;

  return (
    <span
      ref={plate}
      className="vmx-subject-cover"
      aria-hidden="true"
      style={{ '--subject-paper': cover.paper }}
    >
      {near && (
        <img
          src={cover.src}
          alt=""
          width={512}
          height={512}
          loading="lazy"
          decoding="async"
          draggable="false"
          style={failedSrc === cover.src ? { visibility: 'hidden' } : undefined}
          onError={() => setFailedSrc(cover.src)}
        />
      )}
    </span>
  );
}
