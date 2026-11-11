// A lecturer's portrait on a faculty card and in the profile, or a monogram of
// the name's initials. The box is the same size either way, so nothing moves
// when the picture arrives. The picture is drawn only for a member the wall
// gives the image address to (src/lib/instructor-portrait.js).
import { useEffect, useState } from 'react';
import { evidenceBase, knownBase } from '../lib/evidence.js';
import { initialsOf, portraitUrl } from '../lib/instructor-portrait.js';

/** The member's image address: a string, null (none for this viewer), undefined while asking. */
function useImageBase(wanted) {
  const [base, setBase] = useState(() => (wanted ? knownBase() : null));
  useEffect(() => {
    if (!wanted || base !== undefined) return undefined;
    let live = true;
    evidenceBase().then((got) => { if (live) setBase(got); });
    return () => { live = false; };
  }, [wanted, base]);
  return base;
}

export default function InstructorPortrait({ instructor, size = 48, className = '' }) {
  const base = useImageBase(Boolean(instructor?.photo));
  const [failed, setFailed] = useState(false);
  const src = failed ? null : portraitUrl(base, instructor);
  const name = instructor?.nameTh || instructor?.nameEn || '';
  const box = { width: size, height: size };
  return (
    <span
      className={`vmx-portrait${className ? ` ${className}` : ''}`}
      style={{ ...box, fontSize: Math.round(size * 0.36) }}
      data-portrait={src ? 'photo' : 'monogram'}
    >
      {src ? (
        <img
          src={src}
          alt={name}
          width={size}
          height={size}
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
        />
      ) : (
        <span aria-hidden="true">{initialsOf(instructor)}</span>
      )}
    </span>
  );
}
