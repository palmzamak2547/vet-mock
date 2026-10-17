// The frame every page sits in: the glass bar on top, the tab bar on a phone, the footer.
// A running set takes the whole screen; its own bar replaces these (pages/Session.jsx).

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link } from './Link.jsx';
import { Lockup } from './Mark.jsx';
import { Icon } from './Icon.jsx';
import { Nw } from './bits.jsx';
import { InstallLink } from './Install.jsx';
import { toggleTheme, useTheme } from '../lib/prefs.js';
import { useActiveSession } from '../lib/hooks.js';

const NAV = [
  { name: 'practice', to: '/practice', label: 'ฝึก', icon: 'target' },
  { name: 'mock', to: '/practice?mode=mock', label: 'สอบจำลอง', icon: 'timer', desktopOnly: true },
  { name: 'bank', to: '/bank', label: 'คลังข้อสอบ', short: 'คลัง', icon: 'stack' },
  { name: 'library', to: '/library', label: 'เอกสาร', icon: 'book' },
  { name: 'exam', to: '/exam', label: 'สนามสอบ', icon: 'calendar', desktopOnly: true },
  { name: 'progress', to: '/progress', label: 'ความคืบหน้า', short: 'ฉัน', icon: 'chart' },
];

function isOn(item, route) {
  if (item.name === 'home') return route.name === 'home';
  if (item.name === 'mock') return route.name === 'practice' && route.query.get('mode') === 'mock';
  if (item.name === 'practice') return (route.name === 'practice' && route.query.get('mode') !== 'mock') || route.name === 'domain';
  if (item.name === 'progress') return route.name === 'progress' || route.name === 'result';
  return route.name === item.name;
}

export function ThemeButton() {
  const { effective } = useTheme();
  const next = effective === 'dark' ? 'สว่าง' : 'มืด';
  return (
    <button
      type="button" className="icon-btn theme-btn"
      onClick={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        toggleTheme(r.left + r.width / 2, r.top + r.height / 2);
      }}
      aria-label={`เปลี่ยนเป็นธีม${next}`} title={`ธีม${next}`}
    >
      <Icon name={effective === 'dark' ? 'sun' : 'moon'} />
    </button>
  );
}

/** True once the page has moved off its top edge: the free-standing pieces take on glass. */
function useScrolled(threshold = 8) {
  const [scrolled, setScrolled] = useState(() => typeof window !== 'undefined' && window.scrollY > threshold);
  useEffect(() => {
    let raf = 0;
    const check = () => { raf = 0; setScrolled(window.scrollY > threshold); };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(check); };
    window.addEventListener('scroll', onScroll, { passive: true });
    check();
    return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(raf); };
  }, [threshold]);
  return scrolled;
}

/**
 * Three pieces that float apart: the mark on its own at the left, the sections as one glass
 * capsule in the middle, and on the right the theme and the way in. At the top of a page the
 * mark and the actions stand on the wall itself; once the page moves they take on glass too.
 */
export function TopBar({ route }) {
  const session = useActiveSession();
  const scrolled = useScrolled();
  const listRef = useRef(null);
  const indRef = useRef(null);
  const active = NAV.findIndex((item) => isOn(item, route));

  // The active pill slides to the link it marks.
  useLayoutEffect(() => {
    const list = listRef.current;
    const ind = indRef.current;
    if (!list || !ind) return undefined;
    const place = () => {
      const link = list.querySelectorAll('.topnav-link')[active];
      if (!link) { ind.style.opacity = '0'; return; }
      ind.style.opacity = '1';
      ind.style.setProperty('--x', `${link.offsetLeft}px`);
      ind.style.setProperty('--w', `${link.offsetWidth}px`);
    };
    place();
    list.classList.add('has-ind');
    document.fonts?.ready?.then(place);
    window.addEventListener('resize', place);
    return () => window.removeEventListener('resize', place);
  }, [active]);

  return (
    <header className={`topbar${scrolled ? ' is-scrolled' : ''}`}>
      <nav className="topbar-in" aria-label="หลัก">
        <Link to="/" className="brand cap" aria-label="VetMock VCA หน้าแรก"><Lockup size={30} /></Link>
        <div className="topnav glass" ref={listRef}>
          <span className="topnav-ind" ref={indRef} aria-hidden="true" />
          <ul className="topnav-list">
            {NAV.map((item, i) => (
              <li key={item.name}>
                <Link to={item.to} className={`topnav-link${i === active ? ' on' : ''}`} aria-current={i === active ? 'page' : undefined}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="topbar-act">
          <span className="cap cap-round"><ThemeButton /></span>
          {session ? (
            <Link to="/session" className="btn btn-ink btn-sm">ทำต่อ <span className="btn-meta">{session.cursor + 1}/{session.items.length}</span></Link>
          ) : (
            <Link to="/practice" className="btn btn-ink btn-sm">เริ่มฝึก</Link>
          )}
        </div>
      </nav>
    </header>
  );
}

export function TabBar({ route }) {
  const items = [{ name: 'home', to: '/', label: 'หน้าแรก', icon: 'home' }, ...NAV.filter((i) => !i.desktopOnly)];
  const active = items.findIndex((item) => isOn(item, route));
  return (
    <nav className="tabbar glass" aria-label="หลัก">
      <span className={`tab-ind${active < 0 ? ' off' : ''}`} style={{ '--i': Math.max(0, active) }} aria-hidden="true" />
      {items.map((item, i) => (
        <Link key={item.name} to={item.to} className={`tab${i === active ? ' on' : ''}`} aria-current={i === active ? 'page' : undefined}>
          <Icon name={item.icon} size={22} />
          <span>{item.short || item.label}</span>
        </Link>
      ))}
    </nav>
  );
}

/**
 * The footer is the gallery's last wall, painted cobalt, and along its floor a print runs the
 * full width: Stefano della Bella's horseman asking the way (1649), inked in the wall's own
 * blue on cream paper by day and in cream on the blue at night, as a two-colour print would be.
 */
export function Footer() {
  return (
    <footer className="footer">
      <div className="wrap footer-in">
        <div className="footer-brand">
          <Lockup size={30} />
          <p className="footer-tag"><Nw>ซ้อมสอบใบประกอบฯ</Nw> <Nw>ให้เหมือนวันจริง</Nw></p>
        </div>
        <nav className="footer-cols" aria-label="ลิงก์ท้ายหน้า">
          <div>
            <h2 className="footer-h">ซ้อม</h2>
            <ul>
              <li><Link to="/practice">ฝึกทีละข้อ</Link></li>
              <li><Link to="/practice?mode=mock">สอบจำลอง</Link></li>
              <li><Link to="/exam">สนามสอบ</Link></li>
              <li><Link to="/progress">ความคืบหน้า</Link></li>
            </ul>
          </div>
          <div>
            <h2 className="footer-h">คลัง</h2>
            <ul>
              <li><Link to="/bank">คลังข้อสอบ</Link></li>
              <li><Link to="/library">เอกสาร VCA</Link></li>
              <li><Link to="/about">ที่มาของข้อสอบ</Link></li>
            </ul>
          </div>
          <div>
            <h2 className="footer-h">VetMock</h2>
            <ul>
              <li><a href="https://vetmock.com/">vetmock.com <Icon name="arrowUpRight" size={14} /></a></li>
              <li><a href="https://research.vetmock.com/">Research <Icon name="arrowUpRight" size={14} /></a></li>
              <li><a href="https://vetmock.com/app/feedback">ส่งความเห็น <Icon name="arrowUpRight" size={14} /></a></li>
              <li><InstallLink className="foot-btn" /></li>
            </ul>
          </div>
        </nav>
      </div>
      <div className="wrap footer-base">
        <p>ข้อสอบในเว็บนี้มีไว้ฝึกซ้อม ไม่ใช่ข้อสอบจริง และไม่ได้จัดทำโดย<Nw>สัตวแพทยสภา</Nw></p>
        <p className="foot-credit">
          ภาพพิมพ์ Stefano della Bella <i>A Lost Horseman Enquiring the Way</i> (1649) <Nw>The Cleveland Museum of Art</Nw>
        </p>
      </div>
      <div className="foot-print" data-reveal aria-hidden="true">
        <span className="foot-ink" />
      </div>
    </footer>
  );
}
