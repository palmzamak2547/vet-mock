// ============================================================
// IdentityStep — the first-run "how classmates will see you" sheet
// ============================================================
// Shown once per account (identity-gate.js decides when): on Home only, never
// over an exam, a set or a set waiting to be resumed. Skipping counts as
// seen: the step does not come back, and the identity card on the profile
// hub stays the place to change it. The step is recorded on the device at
// once and in the account when it is saved or skipped, so a second phone
// does not ask again.
// ============================================================

import { useEffect, useId, useRef } from 'react';
import IdentityEditor from './IdentityEditor.jsx';
import { useModalFocus } from '../hooks/useModalFocus.js';
import { saveIdentity } from '../lib/identity-write.js';
import { identityIntroDue, introSeen, markIntroSeen } from '../lib/identity-gate.js';
import '../styles-profile.css';

/** The whole gate, here rather than in App so the first load carries none of
 *  it. App only mounts this on Home with nothing in progress. */
export default function IdentityStep({ user, profile, view = 'home', onSaved, onClose, onShown }) {
  // Once open, the sheet stays until it closes itself: saving writes
  // identity_intro_done before the name when the student hides from the
  // board, and the gate reading that flag must not take the sheet away
  // while the name write can still be refused.
  const open = useRef(false);
  if (open.current) return <IdentitySheet user={user} profile={profile} onSaved={onSaved} onClose={onClose} onShown={onShown} />;
  let seen = false;
  try { seen = introSeen(window.localStorage, user?.id); } catch { seen = false; }
  if (!identityIntroDue({ user, profile, view, seen })) return null;
  open.current = true;
  return <IdentitySheet user={user} profile={profile} onSaved={onSaved} onClose={onClose} onShown={onShown} />;
}

function IdentitySheet({ user, profile, onSaved, onClose, onShown }) {
  const headingId = useId();
  useEffect(() => { onShown?.(); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const firstRef = useRef(null);
  const done = () => {
    try { markIntroSeen(window.localStorage, user?.id); } catch { /* private mode */ }
    onClose?.();
  };
  const skip = () => {
    // Recorded in the account too, best effort; the device flag is enough here.
    saveIdentity({ introDone: true }).catch(() => {});
    done();
  };
  const dialogRef = useModalFocus({ active: true, onClose: skip, initialFocusRef: firstRef });

  return (
    <div className="vmx-id-step-scrim">
      <div ref={dialogRef} className="vmx-id-step" role="dialog" aria-modal="true" aria-labelledby={headingId}>
        <h2 id={headingId} ref={firstRef} tabIndex={-1}>เพื่อนจะเห็นคุณแบบไหน</h2>
        <p className="vmx-id-step-lead">ชื่อและรูปนี้ขึ้นบนกระดาน กลุ่มติว และความเห็น เปลี่ยนได้เสมอที่หน้าโปรไฟล์</p>
        <IdentityEditor
          user={user}
          profile={profile}
          mode="intro"
          headingId={headingId}
          onSkip={skip}
          onSaved={(next, info) => { onSaved?.(next, info); done(); }}
        />
      </div>
    </div>
  );
}
