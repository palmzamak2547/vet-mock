import { useEffect, useRef } from 'react';
import GlyphText from './GlyphText.jsx';
import { IconHistory, IconMoon, IconNew, IconSun, IconClose, IconTrash } from './icons.jsx';

export function Header({ theme, onTheme, onNew, onHistory, hasChat }) {
  return (
    <header className="hdr no-print">
      <a className="brand" href="/" aria-label="VetMock AI หน้าแรก" onClick={(e) => { if (hasChat) { e.preventDefault(); onNew(); } }}>
        <img src="/brand/vetmock-logo.svg" width="28" height="28" alt="" />
        <span className="brand-word">VetMock</span>
        <GlyphText text="AI" className="brand-ai" />
      </a>
      <span className="preview-tag"><GlyphText text="Research preview" /></span>
      <nav className="hdr-actions" aria-label="เมนู">
        {hasChat && (
          <button type="button" className="icon-btn" onClick={onNew} aria-label="แชทใหม่" title="แชทใหม่"><IconNew /></button>
        )}
        <button type="button" className="icon-btn" onClick={onHistory} aria-label="ประวัติ" title="ประวัติ"><IconHistory /></button>
        <button type="button" className="icon-btn theme-btn" onClick={onTheme} aria-label={theme === 'dark' ? 'โหมดสว่าง' : 'โหมดมืด'} title={theme === 'dark' ? 'โหมดสว่าง' : 'โหมดมืด'}>
          <span className="theme-icons" data-t={theme}><IconSun /><IconMoon /></span>
        </button>
      </nav>
    </header>
  );
}

const fmtDay = new Intl.DateTimeFormat('th-TH', { day: 'numeric', month: 'short' });

export function History({ open, chats, currentId, onClose, onOpen, onDelete, onClear }) {
  const panel = useRef(null);
  const opener = useRef(null);
  useEffect(() => {
    if (!open) return undefined;
    opener.current = document.activeElement;
    const el = panel.current;
    requestAnimationFrame(() => el?.querySelector('button, a')?.focus());
    const onKey = (e) => {
      if (e.key === 'Escape') { e.preventDefault(); onClose(); }
      if (e.key === 'Tab' && el) {
        const f = [...el.querySelectorAll('button, a')].filter((x) => !x.disabled);
        if (!f.length) return;
        if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
        else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
      }
    };
    document.addEventListener('keydown', onKey);
    document.documentElement.dataset.lock = '1';
    return () => {
      document.removeEventListener('keydown', onKey);
      delete document.documentElement.dataset.lock;
      opener.current?.focus?.();
    };
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="sheet-wrap" onPointerDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <aside ref={panel} className="sheet" role="dialog" aria-modal="true" aria-label="ประวัติ">
        <div className="sheet-head">
          <h2>ประวัติ</h2>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="ปิด"><IconClose /></button>
        </div>
        {chats.length ? (
          <>
            <ul className="hist">
              {chats.map((c) => (
                <li key={c.id} className={c.id === currentId ? 'is-current' : ''}>
                  <button type="button" className="hist-open" onClick={() => onOpen(c.id)}>
                    <span className="hist-title">{c.title || 'บทสนทนา'}</span>
                    <span className="hist-day">{fmtDay.format(c.updated)}</span>
                  </button>
                  <button type="button" className="icon-btn hist-del" onClick={() => onDelete(c.id)} aria-label={`ลบ ${c.title || 'บทสนทนา'}`}><IconTrash size={18} /></button>
                </li>
              ))}
            </ul>
            <button type="button" className="link danger" onClick={onClear}>ลบทั้งหมด</button>
          </>
        ) : (
          <p className="hist-empty">ยังไม่มีบทสนทนา เก็บไว้ในเครื่องนี้เท่านั้น</p>
        )}
      </aside>
    </div>
  );
}

/** A specimen label: the ocean moves this element with the animal you tapped. */
export function Specimen({ elRef, info }) {
  return (
    <div ref={elRef} className="specimen" data-on="0" aria-live="polite">
      {info && (
        <>
          <span className="specimen-dot" />
          <span className="specimen-line" />
          <span className="specimen-text">
            <span className="specimen-th">{info.th}</span>
            <span className="specimen-sci">{info.sci}</span>
          </span>
        </>
      )}
    </div>
  );
}

const fmtN = new Intl.NumberFormat('en-US');

export function Footer({ stats }) {
  const items = stats
    ? [
      ['questions', 'ข้อสอบ'],
      ['wikiSections', 'หัวข้อ VetWiki'],
      ['noteSections', 'หัวข้อในโน้ต'],
      ['videos', 'สรุปคลิป'],
    ].filter(([k]) => Number.isFinite(stats[k]) && stats[k] > 0)
    : [];
  return (
    <footer className="ftr no-print">
      {items.length > 0 && (
        <dl className="ftr-stats">
          {items.map(([k, label]) => (
            <div key={k}>
              <dt>{label}</dt>
              <dd>{fmtN.format(stats[k])}</dd>
            </div>
          ))}
        </dl>
      )}
      <nav className="ftr-links" aria-label="VetMock">
        <a href="https://vetmock.com">VetMock</a>
        <a href="https://vetmock.com/wiki">VetWiki</a>
        <a href="https://research.vetmock.com">Research</a>
        <a href="https://vca.vetmock.com">VCA</a>
      </nav>
      <p className="ftr-note">
        <span>VetMock AI</span>
        <span>เครื่องมือช่วยเรียน ไม่ใช่คำแนะนำการรักษา</span>
      </p>
    </footer>
  );
}
