// The entrance into the workspace at /app [M1-DESIGN.md 16]: a designed first screen and transition
// (the herd settles into the project list) that plays once per device, skippable, and is still
// under prefers-reduced-motion. Same performance rules as the front door. OWNER: landing role.
import { registerArea } from '../i18n/index.js';
import entrance from '../i18n/entrance.js';

registerArea('entrance', entrance);

/**
 * @param {{ onDone: () => void, projectCount: number }} props
 *   onDone is called when the transition ends or is skipped; projectCount lets the scene show the
 *   student's own number of projects (never a made-up one)
 */
export default function Entrance({ onDone }) {
  void onDone;
  return null;
}
