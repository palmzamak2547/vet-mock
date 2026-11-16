import { useState } from 'react';
import NavIcon from '../NavIcon.jsx';
import { PEN_COLORS, RANGE_COLORS } from '../../lib/case-ops.js';
// The tools' styles and the sheet's, loaded with the tools: the sheet's opening waits for them.
import '../../styles-case.css';

// ============================================================
// CaseTools — the case reader's tools, in the three places they sit
// ============================================================
// The case reader design, section 4. One component, three layouts:
//   row   the pane on a tablet or a desktop, sticky at the top of the pane
//   rail  the sheet on a tablet or a desktop, floating at the left edge
//   bar   the sheet on a phone, in place of the bottom nav
// A toolbar, not an action row: buttons in DOM order. Every target is 44 px.
// The armed tool is shown by fill and aria-pressed, never by size, and the
// colour is one button that opens its swatches beside it, so no button moves
// when a tool or a colour is picked.
// ============================================================

export const TOOL_LABEL = { pen: 'ปากกา', highlighter: 'ปากกาไฮไลต์', eraser: 'ยางลบ' };

function ToolButton({ icon, label, pressed, disabled, title, onClick, children }) {
  return (
    <button
      type="button"
      className="vmx-case-tool"
      aria-label={label}
      title={title || label}
      aria-pressed={typeof pressed === 'boolean' ? pressed : undefined}
      disabled={disabled}
      onClick={onClick}
    >
      {icon ? <NavIcon name={icon} size={20} /> : null}
      {children}
    </button>
  );
}

/**
 * tool, onTool          the armed tool: 'pen' | 'highlighter' | 'eraser'
 * penReady              false where the pen does not write yet (the sheet, until slice 3)
 * penColor, rangeColor, onColor
 * canUndo, canRedo, onUndo, onRedo, onClear
 * writeSwitch           null when not offered, else { on, onToggle }
 * end                   what closes the row (the pane's อ่านเต็มจอ)
 */
export default function CaseTools({
  layout = 'row', tool, onTool, penReady = true, penColor, rangeColor, onColor,
  canUndo, canRedo, onUndo, onRedo, onClear, writeSwitch = null, end = null,
}) {
  const [flyout, setFlyout] = useState(null);   // 'color' | 'more' | null
  const colorFor = tool === 'pen' ? 'pen' : 'range';
  const swatches = colorFor === 'pen' ? PEN_COLORS : RANGE_COLORS;
  const current = colorFor === 'pen' ? penColor : rangeColor;
  const shown = swatches.find((c) => c.id === current) || swatches[0];
  const penTitle = penReady ? TOOL_LABEL.pen : 'ปากกาในหน้าอ่านเต็มจอยังไม่เปิดใช้ เขียนด้วยปากกาได้ในกรอบเคสบนหน้าคำถาม';
  // The rail has room for dividers; in the pane's row (42% of a card) every pixel goes to 44 px targets.
  const sep = layout === 'rail' ? <span className="vmx-case-tools-sep" aria-hidden="true" /> : null;
  const toggle = (which) => setFlyout((f) => (f === which ? null : which));

  const undoRedo = (
    <>
      <ToolButton icon="undo" label="ย้อนกลับ" disabled={!canUndo} onClick={onUndo} />
      {layout !== 'bar' && <ToolButton icon="redo" label="ทำซ้ำ" disabled={!canRedo} onClick={onRedo} />}
    </>
  );

  return (
    <div className={`vmx-case-tools is-${layout}`} role="toolbar" aria-label="เครื่องมือเขียนบนเคส" aria-orientation={layout === 'rail' ? 'vertical' : 'horizontal'}>
      {writeSwitch && (
        <button
          type="button"
          className="vmx-case-tool vmx-case-write"
          aria-pressed={writeSwitch.on}
          onClick={writeSwitch.onToggle}
          title="เปิดแล้วนิ้วเดียวเขียน สองนิ้วเลื่อนหน้า"
        >
          <NavIcon name="hand" size={20} />
          <span className="vmx-case-write-label">เขียนด้วยนิ้ว</span>
        </button>
      )}
      {['pen', 'highlighter', 'eraser'].map((t) => (
        <ToolButton
          key={t}
          icon={t}
          label={TOOL_LABEL[t]}
          title={t === 'pen' ? penTitle : undefined}
          pressed={tool === t}
          disabled={t === 'pen' && !penReady}
          onClick={() => { setFlyout(null); onTool(t); }}
        />
      ))}
      {sep}
      <span className="vmx-case-flyout-anchor">
        <button
          type="button"
          className="vmx-case-tool"
          aria-label={`สี${colorFor === 'pen' ? 'ปากกา' : 'ไฮไลต์'}: ${shown.label}`}
          title="เลือกสี"
          aria-expanded={flyout === 'color'}
          onClick={() => toggle('color')}
        >
          <span className="vmx-case-swatch" style={{ background: shown.dot || shown.value }} aria-hidden="true" />
        </button>
        {flyout === 'color' && (
          <span className="vmx-case-flyout" role="group" aria-label="สี">
            {swatches.map((c) => (
              <button
                key={c.id}
                type="button"
                className="vmx-case-tool"
                aria-label={c.label}
                aria-pressed={c.id === current}
                onClick={() => { onColor(colorFor, c.id); setFlyout(null); }}
              >
                <span className="vmx-case-swatch" style={{ background: c.dot || c.value }} aria-hidden="true" />
              </button>
            ))}
          </span>
        )}
      </span>
      {sep}
      {undoRedo}
      {sep}
      {layout === 'bar' ? (
        <span className="vmx-case-flyout-anchor">
          <ToolButton icon="more" label="เพิ่มเติม" pressed={undefined} onClick={() => toggle('more')} />
          {flyout === 'more' && (
            <span className="vmx-case-flyout is-menu" role="group" aria-label="เพิ่มเติม">
              <ToolButton icon="redo" label="ทำซ้ำ" disabled={!canRedo} onClick={() => { setFlyout(null); onRedo(); }} />
              <ToolButton icon="trash" label="ล้างทั้งหมด" onClick={() => { setFlyout(null); onClear(); }} />
            </span>
          )}
        </span>
      ) : (
        <ToolButton icon="trash" label="ล้างทั้งหมด" onClick={onClear} />
      )}
      {end}
    </div>
  );
}

/** ไฮไลต์ offered beside a finger's selection. */
export function PickBar({ rect, onPick, onClose }) {
  const style = rect ? { top: Math.max(8, rect.bottom + 8), left: Math.max(8, Math.min(rect.left, (typeof window !== 'undefined' ? window.innerWidth : 400) - 160)) } : undefined;
  return (
    <div className="vmx-case-markbar" style={style} role="group" aria-label="ข้อความที่เลือก">
      <button type="button" className="vmx-case-tool vmx-case-markbar-del is-pick" onClick={onPick}>ไฮไลต์</button>
      <button type="button" className="vmx-case-tool" aria-label="ปิด" onClick={onClose}><NavIcon name="close" size={18} /></button>
    </div>
  );
}

/** The small bar a tap on a highlight opens: its colour, or remove it. */
export function MarkBar({ rect, onColor, onRemove, onClose }) {
  const style = rect ? { top: Math.max(8, rect.top - 56), left: Math.max(8, Math.min(rect.left, (typeof window !== 'undefined' ? window.innerWidth : 400) - 240)) } : undefined;
  return (
    <div className="vmx-case-markbar" style={style} role="group" aria-label="ไฮไลต์นี้">
      {RANGE_COLORS.map(({ id, label, dot }) => (
        <button key={id} type="button" className="vmx-case-tool" aria-label={label} onClick={() => onColor(id)}>
          <span className="vmx-case-swatch" style={{ background: dot }} aria-hidden="true" />
        </button>
      ))}
      <button type="button" className="vmx-case-tool vmx-case-markbar-del" onClick={onRemove}>ลบ</button>
      <button type="button" className="vmx-case-tool" aria-label="ปิด" onClick={onClose}><NavIcon name="close" size={18} /></button>
    </div>
  );
}
