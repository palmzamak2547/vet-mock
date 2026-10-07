import { useState } from 'react';
import { SUBJECT_COVERS } from '../data/subject-covers.js';

/** Decorative bookplate. The card retains its name and action if art fails. */
export default function SubjectCover({ subjectId }) {
  const [failedSrc, setFailedSrc] = useState(null);
  // The aggregate is a study action, so it reuses the collection's open book.
  const cover = SUBJECT_COVERS[subjectId === 'all' ? 'senior-project' : subjectId];
  if (!cover) return null;

  return (
    <span
      className="vmx-subject-cover"
      aria-hidden="true"
      style={{ '--subject-paper': cover.paper }}
    >
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
    </span>
  );
}
