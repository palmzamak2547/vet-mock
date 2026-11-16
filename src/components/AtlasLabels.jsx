import { useEffect, useMemo, useRef, useState } from 'react';
import { ATLAS_LABELS } from '../data/atlas-labels.generated.js';
import { anchorVisible, labelPresentation, placeLabels, projectToScreen } from '../lib/atlas-labels.js';
import '../styles-atlas-labels.css';

// True when the specimen has an authored label set. The generated registry is
// reachable only through this chunk, so AtlasView imports the chunk and derives
// the toggle's disabled state from this answer; an empty registry is a no-op.
const NOTHING_HIDDEN = Object.freeze([]);

export function hasLabels(specimenId) {
  return Boolean(ATLAS_LABELS[specimenId]?.labels?.length);
}

// Parts a labeled specimen starts with hidden, so labels name structures the
// student can actually see (owner decision 13: the visible dog opens without
// its skin and muscle covering the labeled organs). Unlabeled specimens get an
// unchanged empty list.
export function defaultHiddenFor(specimenId) {
  return ATLAS_LABELS[specimenId]?.defaultHidden ?? NOTHING_HIDDEN;
}

// Drafted Latin per part id for a labeled specimen (owner decision 11 phase
// 2): AtlasView merges this into the part view it renders, so the inspector
// shows the Latin line and the directory search finds "Cor". The merge is
// runtime-only — nothing static imports the registry, so the atlas budget row
// stays byte-identical.
export function latinFor(specimenId) {
  const labels = ATLAS_LABELS[specimenId]?.labels ?? [];
  return new Map(labels.map((label) => [label.partId, label.latin]));
}

function applyMatrix([x, y, z], m) {
  return [m[0] * x + m[4] * y + m[8] * z + m[12], m[1] * x + m[5] * y + m[9] * z + m[13], m[2] * x + m[6] * y + m[10] * z + m[14]];
}

export default function AtlasLabels({
  specimenId,
  parts,
  mode,
  labelsVisible,
  exploded,
  sceneReady,
  selected,
  visibleIds,
  registerFrame,
  lastPayload,
}) {
  const labels = ATLAS_LABELS[specimenId]?.labels ?? [];
  const nameOf = useMemo(() => new Map(parts.map((part) => [part.id, part])), [parts]);
  const layer = useRef(null);
  const nodes = useRef(new Map());
  const leaders = useRef(new Map());
  // Label sizes, measured once per label and cleared when the stage resizes or
  // the web font arrives, so collisions are judged on the widths on screen.
  const sizes = useRef(new Map());
  const [stageSize, setStageSize] = useState(Infinity);

  useEffect(() => {
    sizes.current.clear();
  }, [stageSize]);
  useEffect(() => {
    let live = true;
    document.fonts?.ready?.then(() => { if (live) sizes.current.clear(); });
    return () => { live = false; };
  }, []);

  // The density rule reads the stage size, which changes on resize and
  // orientation only — never per orbit frame.
  useEffect(() => {
    const el = layer.current;
    if (!el) return undefined;
    const observer = new ResizeObserver(([entry]) => setStageSize(entry.contentRect.width));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const presentation = labelPresentation({ mode, labelsVisible, stageSize, exploded, sceneReady });

  // One clock: the scene fires this after every real render and state sync;
  // positions are written straight to style.transform (no React re-render).
  useEffect(() => {
    const apply = (payload) => {
      const el = layer.current;
      if (!el) return;
      if (!payload?.ready || presentation === 'hidden' || !labels.length) {
        el.hidden = true;
        return;
      }
      el.hidden = false;
      const clip = payload.clip;
      const items = [];
      for (const label of labels) {
        const node = nodes.current.get(label.partId);
        const leader = leaders.current.get(label.partId);
        if (!node) continue;
        const world = applyMatrix(label.display, payload.worldMatrix);
        const projected = projectToScreen(world, payload.viewProjection, payload.pane.width, payload.pane.height);
        const clipped = clip
          ? clip.normal[0] * world[0] + clip.normal[1] * world[1] + clip.normal[2] * world[2] + clip.constant < 0
          : false;
        const emphasized = label.partId === selected;
        const shown =
          visibleIds.includes(label.partId) &&
          anchorVisible({ visible: true, clipped, behindCamera: projected.behind, offFrustum: false });
        node.style.display = shown ? '' : 'none';
        if (leader) leader.style.display = 'none';
        if (!shown) continue;
        const x = payload.pane.left + projected.x;
        const y = payload.pane.top + projected.y;
        const dot = presentation === 'dots' && !emphasized;
        node.classList.toggle('is-dot', dot);
        node.classList.toggle('is-selected', emphasized);
        if (dot) {
          node.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
          continue;
        }
        let size = sizes.current.get(label.partId);
        if (!size || !size.w) {
          size = { w: node.offsetWidth, h: node.offsetHeight };
          sizes.current.set(label.partId, size);
        }
        items.push({ id: label.partId, x, y, w: size.w, h: size.h, first: emphasized });
      }
      // Every name stays text: a name that would cross another moves to the
      // other sides of its point, then further out with a leader line.
      const spots = placeLabels(items, { width: el.clientWidth || Infinity, height: el.clientHeight || Infinity });
      for (const spot of spots) {
        const node = nodes.current.get(spot.id);
        node.style.transform = `translate(${spot.left}px, ${spot.top}px)`;
        const leader = leaders.current.get(spot.id);
        if (!leader || !spot.leader) continue;
        const { x1, y1, x2, y2 } = spot.leader;
        leader.style.display = '';
        leader.style.width = `${Math.hypot(x2 - x1, y2 - y1)}px`;
        leader.style.transform = `translate(${x1}px, ${y1}px) rotate(${Math.atan2(y2 - y1, x2 - x1)}rad)`;
      }
    };
    registerFrame(apply);
    // Replay the scene's last payload: an idle scene renders no second frame,
    // so registration without a replay would wait for an interaction that may
    // never come (design M-9's mount request, as a replay).
    if (lastPayload?.current) apply(lastPayload.current);
    return () => registerFrame(null);
  }, [labels, presentation, selected, visibleIds, registerFrame, lastPayload]);

  // Non-interactive by design: the overlay never takes a pointer event, the
  // part directory stays the accessible list (aria-hidden here).
  return (
    <div className="vmx-atlas-labels-layer" ref={layer} aria-hidden="true" hidden>
      {labels.map((label) => {
        const meta = nameOf.get(label.partId);
        return (
          <span key={label.partId} className="vmx-atlas-label-group">
          <span
            className="vmx-atlas-leader"
            ref={(node) => {
              if (node) leaders.current.set(label.partId, node);
              else leaders.current.delete(label.partId);
            }}
            style={{ display: 'none' }}
          />
          <span
            className="vmx-atlas-label"
            ref={(node) => {
              if (node) nodes.current.set(label.partId, node);
              else nodes.current.delete(label.partId);
            }}
          >
            <b>{label.th || meta?.th || meta?.en}</b>
            <i lang="la">{label.latin}</i>
          </span>
          </span>
        );
      })}
    </div>
  );
}
