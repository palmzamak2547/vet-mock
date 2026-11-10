// Who has a profile, and how a lecturer string finds them, without the
// profiles themselves. The topic screen and the search palette read this
// (about a tenth of the directory); src/data/instructors.js holds the full
// records and loads when a profile opens.

import { INSTRUCTOR_INDEX } from './instructor-index.generated.js';
import { createInstructorLookup } from '../lib/instructor-lookup.js';

export { INSTRUCTOR_INDEX };

/** The index row a curriculum lecturer string names, or null. */
export const findInstructorByLecturerString = createInstructorLookup(INSTRUCTOR_INDEX);
