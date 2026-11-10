// A profile opened from a search row or a lecturer chip. Those screens hold
// only the slim index row (src/data/instructor-index.js); the directory with
// every paper and source is imported here, so it downloads when a profile is
// opened and not with the topic screen. A row whose slug the directory no
// longer has (a recent search saved before a rename) still opens with what
// the row itself carries.
import InstructorModal from './InstructorModal.jsx';
import { getInstructorBySlug } from '../data/instructors.js';

export default function InstructorProfile({ instructor, onClose }) {
  if (!instructor) return null;
  return <InstructorModal instructor={getInstructorBySlug(instructor.slug) || instructor} onClose={onClose} />;
}
