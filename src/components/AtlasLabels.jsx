import { useEffect, useMemo, useRef, useState } from 'react';
import { ATLAS_LABELS } from '../data/atlas-labels.generated.js';
import { anchorVisible, labelPresentation, projectToScreen } from '../lib/atlas-labels.js';
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
  // Each name's box, measured once while it is drawn as a name (collision pass).
  const sizes = useRef(new Map());
  const retries = useRef(0);
  const [stageSize, setStageSize] = useState(Infinity);

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
      const entries = [];
      for (const label of labels) {
        const node = nodes.current.get(label.partId);
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
        if (!shown) continue;
        entries.push({ partId: label.partId, node, emphasized,
          x: payload.pane.left + projected.x, y: payload.pane.top + projected.y });
      }
      // Collision pass: a name whose box would cross one already placed is
      // drawn as a dot at its point instead (the part list still names it).
      // The selected part is placed first, so it always keeps its name.
      entries.sort((p, q) => Number(q.emphasized) - Number(p.emphasized));
      const placed = [];
      let unmeasured = false;
      for (const { partId, node, emphasized, x, y } of entries) {
        let dot = presentation === 'dots' && !emphasized;
        if (!dot) {
          let size = sizes.current.get(partId);
          if (!size) {
            // Measured as a name, once per label (a dot has no name box).
            node.classList.remove('is-dot');
            size = { w: node.offsetWidth, h: node.offsetHeight };
            if (size.w && size.h) sizes.current.set(partId, size);
            else size = null;
          }
          if (size) {
            const box = { l: x - size.w / 2, r: x + size.w / 2, t: y - size.h * 1.18, b: y - size.h * 0.18 };
            if (placed.some((o) => box.l < o.r && box.r > o.l && box.t < o.b && box.b > o.t)) dot = true;
            else placed.push(box);
          } else {
            // Not laid out yet: a dot until the next frame can measure it.
            unmeasured = true;
            dot = !emphasized;
          }
        }
        node.style.transform = dot
          ? `translate(${x}px, ${y}px) translate(-50%, -50%)`
          : `translate(${x}px, ${y}px) translate(-50%, -118%)`;
        node.classList.toggle('is-dot', dot);
        node.classList.toggle('is-selected', emphasized);
      }
      // An idle scene draws no next frame: ask for one while a name is unmeasured.
      if (unmeasured && retries.current < 30) {
        retries.current += 1;
        requestAnimationFrame(() => apply(payload));
      } else if (!unmeasured) {
        retries.current = 0;
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
          <span
            key={label.partId}
            className="vmx-atlas-label"
            ref={(node) => {
              if (node) nodes.current.set(label.partId, node);
              else nodes.current.delete(label.partId);
            }}
          >
            <b>{label.th || meta?.th || meta?.en}</b>
            <i lang="la">{label.latin}</i>
          </span>
        );
      })}
    </div>
  );
}
