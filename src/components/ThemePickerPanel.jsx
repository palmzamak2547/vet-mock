// ThemePickerPanel — the body of the header's theme menu, loaded when the menu
// first opens (ThemePicker keeps only its button on first load). Its rows are
// rows of src/lib/prefs/table.js, written through the table, with the same
// names as the studio (prefs/labels.js); everything else is one tap away in
// "ปรับแต่ง".
import { useSyncExternalStore } from 'react';
import NavIcon from './NavIcon.jsx';
import MotionSettings from './MotionSettings.jsx';
import { prefRow, readPref, writePref, PREF_CHANGE_EVENT } from '../lib/prefs/table.js';
import { choiceLabel, PALETTE_DOTS } from '../lib/prefs/labels.js';

const sub = (cb) => { window.addEventListener(PREF_CHANGE_EVENT, cb); return () => window.removeEventListener(PREF_CHANGE_EVENT, cb); };
const usePref = (id) => useSyncExternalStore(sub, () => readPref(id), () => prefRow(id).def());
const ICON = { light: 'sun', dark: 'moon', system: 'settings' };
const heading = { fontSize: 14, color: 'var(--clr-ink-soft)', fontFamily: 'var(--vmx-mono)', marginBottom: 6 };

export default function ThemePickerPanel({ choose }) {
  const theme = usePref('theme');
  const palette = usePref('palette');
  return (
    <>
      <div style={heading}>สว่างหรือมืด</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginBottom: 12 }}>
        {prefRow('theme').choices.map((id) => (
          <button key={id} type="button" onClick={() => choose(() => writePref('theme', id))}
            className={`vmx-chip ${theme === id ? 'active' : ''}`} aria-pressed={theme === id}
            style={{ gap: 6, ...(id === 'system' ? { gridColumn: '1 / -1' } : {}) }}>
            <NavIcon name={ICON[id]} size={15} /> {choiceLabel('theme', id)}
          </button>
        ))}
      </div>
      <div style={heading}>สี</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 6 }}>
        {prefRow('palette').choices.filter((id) => id !== 'custom' || palette === 'custom').map((id) => (
          <button key={id} type="button" onClick={() => choose(() => writePref('palette', id))}
            className={`vmx-chip ${palette === id ? 'active' : ''}`} aria-pressed={palette === id}
            style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, padding: '5px 10px' }}>
            <span style={{ width: 12, height: 12, borderRadius: '50%', background: PALETTE_DOTS[id]?.[0] || 'var(--clr-sage)', border: '1px solid var(--clr-border)' }} />
            {choiceLabel('palette', id)}
          </button>
        ))}
      </div>
      <div className="vmx-theme-motion-settings"><MotionSettings /></div>
      <button type="button" className="vmx-btn vmx-btn-ghost vmx-btn-sm" style={{ width: '100%', marginTop: 8 }}
        onClick={() => choose(() => window.dispatchEvent(new Event('vmx-open-studio')))}>
        ปรับแต่งทั้งหมด
      </button>
    </>
  );
}
