import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowLeftRight,
  BookOpen,
  Check,
  ChevronRight,
  Eye,
  Focus,
  RotateCcw,
  Share2,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Box,
  GraduationCap,
  Download,
  Layers,
  Columns2,
  Image,
  WifiOff,
  Maximize2,
  X,
  Moon,
  Sun,
} from 'lucide-react';
import { ATLAS_CATALOG, getAtlasSpecimen } from '../data/atlas-catalog.js';
import {
  readAtlasLocation,
  atlasSharePath,
  filterAtlasParts,
  visibleAtlasParts,
  atlasGroupVisibility,
} from '../lib/atlas-workspace.js';
import '../styles-atlas.css';
import AtlasPartDirectory from '../components/AtlasPartDirectory.jsx';
import { useAtlasOffline } from '../lib/atlas-offline.js';
const AtlasScene = lazy(() => import('../components/AtlasScene.jsx'));
const formatBytes = (value) =>
  value < 1000000 ? `${Math.round(value / 1000)} KB` : `${(value / 1000000).toFixed(1)} MB`;

export default function AtlasView({ goHome, theme, onToggleTheme }) {
  const shellReady = useAtlasOffline();
  const [location, setLocation] = useState(() => readAtlasLocation(window.location.hash));
  const [mode, setMode] = useState(location.compareId ? 'compare' : 'explore');
  const [filter, setFilter] = useState('all'),
    [query, setQuery] = useState('');
  const [hidden, setHidden] = useState([]),
    [isolated, setIsolated] = useState(false);
  const [exploded, setExploded] = useState(0),
    [coloured, setColoured] = useState(true),
    [ghost, setGhost] = useState(false),
    [cut, setCut] = useState(0);
  const [quality, setQuality] = useState('quick'),
    [staticMode, setStaticMode] = useState(false),
    [attempt, setAttempt] = useState(0);
  const [status, setStatus] = useState({ kind: 'loading', views: [] });
  const [systemsExpanded, setSystemsExpanded] = useState(false);
  const [revealed, setRevealed] = useState(false),
    [round, setRound] = useState(0);
  const [notice, setNotice] = useState(''),
    [shareFallback, setShareFallback] = useState('');
  const [command, setCommand] = useState({ kind: 'reset', seq: 0 });
  const sequence = useRef(0),
    search = useRef(null),
    stage = useRef(null),
    downloadUrl = useRef(null);
  const specimen = getAtlasSpecimen(location.specimenId);
  const comparison = mode === 'compare' && location.compareId ? getAtlasSpecimen(location.compareId) : null;
  const part = specimen.parts.find((item) => item.id === location.selected) || specimen.parts[0];
  const segmented = specimen.kind === 'segmented',
    recall = mode === 'recall',
    hideAnswer = recall && !revealed;
  const ready = status.kind === 'ready' && !staticMode;
  const visibleIds = useMemo(
    () => visibleAtlasParts(specimen, part.id, hidden, isolated),
    [specimen, part.id, hidden, isolated],
  );
  const parts = useMemo(() => filterAtlasParts(specimen, query), [specimen, query]);
  const systems = useMemo(() => {
    const groups = new Map();
    for (const item of specimen.parts) {
      if (!item.systemLabel) continue;
      if (!groups.has(item.systemLabel)) groups.set(item.systemLabel, []);
      groups.get(item.systemLabel).push(item.id);
    }
    return [...groups].map(([label, ids]) => ({ label, ids }));
  }, [specimen]);
  const species = [
    ...new Map(
      ATLAS_CATALOG.map((item) => [item.speciesId, { id: item.speciesId, label: item.species }]),
    ).values(),
  ];
  const run = useCallback((kind) => setCommand({ kind, seq: ++sequence.current }), []);
  const reset = useCallback(() => {
    setHidden([]);
    setIsolated(recall);
    setExploded(0);
    setCut(0);
    setGhost(false);
    run('reset');
  }, [recall, run]);
  useEffect(() => {
    const previous = document.title;
    document.title = recall
      ? 'ทบทวนชื่อโครงสร้าง | VetMock Atlas'
      : `${specimen.titleEn}${comparison ? ` × ${comparison.titleEn}` : ''} | VetMock Atlas`;
    return () => {
      document.title = previous;
    };
  }, [specimen.titleEn, comparison?.titleEn, recall]);
  useEffect(() => {
    if (!recall) window.history.replaceState(window.history.state, '', atlasSharePath(location));
  }, [location, recall]);
  useEffect(() => {
    const restore = () => {
      if (
        window.location.pathname !== '/app/atlas' ||
        (window.location.hash && !/^#(?:specimen|part|compare)=/.test(window.location.hash))
      )
        return;
      const next = readAtlasLocation(window.location.hash);
      setLocation(next);
      setMode(next.compareId ? 'compare' : 'explore');
      setHidden([]);
      setIsolated(false);
      setCut(0);
      setExploded(0);
    };
    window.addEventListener('popstate', restore);
    window.addEventListener('hashchange', restore);
    return () => {
      window.removeEventListener('popstate', restore);
      window.removeEventListener('hashchange', restore);
    };
  }, []);
  useEffect(
    () => () => {
      if (downloadUrl.current) URL.revokeObjectURL(downloadUrl.current);
    },
    [],
  );
  useEffect(() => {
    const keyboard = (event) => {
      if (
        event.defaultPrevented ||
        event.ctrlKey ||
        event.metaKey ||
        event.altKey ||
        /INPUT|TEXTAREA|SELECT/.test(event.target?.tagName) ||
        event.target?.isContentEditable
      )
        return;
      if (event.key === '/' && segmented && !recall) {
        event.preventDefault();
        search.current?.focus();
        return;
      }
      if (!ready || !stage.current?.contains(event.target)) return;
      const actions = {
        ArrowLeft: 'left',
        ArrowRight: 'right',
        ArrowUp: 'up',
        ArrowDown: 'down',
        '+': 'zoom-in',
        '=': 'zoom-in',
        '-': 'zoom-out',
        f: 'fit',
        r: 'reset',
      };
      if (actions[event.key]) {
        event.preventDefault();
        if (event.key === 'r') reset();
        else run(actions[event.key]);
      }
    };
    window.addEventListener('keydown', keyboard);
    return () => window.removeEventListener('keydown', keyboard);
  }, [ready, segmented, recall, run, reset]);
  const clearView = () => {
    setHidden([]);
    setIsolated(false);
    setExploded(0);
    setCut(0);
    setGhost(false);
    setQuery('');
    setNotice('');
    setShareFallback('');
  };
  const chooseSpecimen = (id) => {
    const next = getAtlasSpecimen(id);
    if (next.id === specimen.id) {
      reset();
      return;
    }
    clearView();
    setRevealed(false);
    setRound(0);
    setStatus({ kind: 'loading', views: [] });
    const nextCompare =
      mode === 'compare'
        ? location.compareId !== next.id
          ? location.compareId
          : ATLAS_CATALOG.find((item) => item.id !== next.id)?.id
        : null;
    setLocation({ specimenId: next.id, selected: next.parts[0].id, compareId: nextCompare });
    if (mode === 'recall') setMode('explore');
    run('reset');
  };
  const enterMode = (next) => {
    clearView();
    setMode(next);
    setRevealed(false);
    setRound(0);
    if (next === 'compare') {
      const other =
        ATLAS_CATALOG.find((item) => item.speciesId !== specimen.speciesId) ||
        ATLAS_CATALOG.find((item) => item.id !== specimen.id);
      setLocation((current) => ({ ...current, compareId: current.compareId || other?.id }));
    } else {
      setLocation((current) => ({
        ...current,
        compareId: null,
        selected: next === 'recall' ? specimen.parts[0].id : current.selected,
      }));
      setIsolated(next === 'recall');
    }
    run('reset');
  };
  const selectPart = useCallback((id) => {
    setLocation((current) =>
      getAtlasSpecimen(current.specimenId).parts.some((part) => part.id === id)
        ? { ...current, selected: id }
        : current,
    );
    setHidden((current) => current.filter((item) => item !== id));
    setNotice('');
    setShareFallback('');
  }, []);
  const changeVisibility = (ids, action) => {
    const next = new Set(atlasGroupVisibility(specimen, visibleIds, ids, action));
    setIsolated(false);
    setHidden(specimen.parts.filter((item) => !next.has(item.id)).map((item) => item.id));
  };
  const retry = () => {
    setStaticMode(false);
    setStatus({ kind: 'loading', views: [] });
    setAttempt((value) => value + 1);
  };
  const share = async () => {
    const url = new URL(atlasSharePath(location), window.location.origin).href;
    try {
      if (!navigator.clipboard?.writeText) throw new Error();
      await navigator.clipboard.writeText(url);
      setNotice('คัดลอกลิงก์ตัวอย่างและชิ้นส่วนที่เลือกแล้ว');
    } catch {
      setShareFallback(url);
      setNotice('คัดลอกอัตโนมัติไม่ได้ เลือกลิงก์เพื่อคัดลอก');
    }
  };
  const exportImage = useCallback(
    (blob) => {
      if (!blob) {
        setNotice('บันทึกภาพไม่ได้ ลองใหม่อีกครั้ง');
        return;
      }
      if (downloadUrl.current) URL.revokeObjectURL(downloadUrl.current);
      downloadUrl.current = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl.current;
      link.download = `vetmock-atlas-${specimen.id}${comparison ? `-vs-${comparison.id}` : ''}.png`;
      link.click();
      setNotice('เตรียมภาพพร้อมแหล่งอ้างอิงให้ดาวน์โหลดแล้ว');
    },
    [specimen.id, comparison?.id],
  );
  const fullscreen = async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else if (stage.current?.requestFullscreen) await stage.current.requestFullscreen();
      else setNotice('เบราว์เซอร์นี้ไม่รองรับเต็มจอ ใช้การหมุนจอเป็นแนวนอนได้');
    } catch {
      setNotice('เปิดเต็มจอไม่ได้ ใช้การหมุนจอเป็นแนวนอนได้');
    }
  };

  return (
    <div className="vmx-atlas-view vmx-atlas-v2">
      <header className="vmx-atlas-masthead">
        <button type="button" className="vmx-atlas-home" onClick={goHome} aria-label="กลับ VetMock">
          <ArrowLeft size={18} aria-hidden="true" />
          <span>VetMock</span>
        </button>
        <div className="vmx-atlas-brand">
          <h1>
            Atlas<span>สัตว์ต่างชนิด มองโครงสร้างร่วมกัน</span>
          </h1>
          <p>สำรวจ · เปรียบเทียบ · เข้าใจ</p>
        </div>
        <div className="vmx-atlas-header-actions">
          {onToggleTheme && (
            <button
              type="button"
              onClick={onToggleTheme}
              aria-label={theme === 'dark' ? 'เปลี่ยนเป็นโหมดสว่าง' : 'เปลี่ยนเป็นโหมดมืด'}
            >
              {theme === 'dark' ? (
                <Sun size={18} aria-hidden="true" />
              ) : (
                <Moon size={18} aria-hidden="true" />
              )}
            </button>
          )}
          <button type="button" onClick={share} aria-label="แชร์ตัวอย่าง Atlas">
            <Share2 size={18} aria-hidden="true" />
          </button>
          <a href="#atlas-evidence" aria-label="ไปยังแหล่งอ้างอิง">
            <BookOpen size={18} aria-hidden="true" />
          </a>
        </div>
      </header>

      <section className="vmx-atlas-collection" aria-label="เลือกตัวอย่างสัตว์">
        <div className="vmx-atlas-collection-title">
          <span>คอลเลกชันกายวิภาค</span>
          <span>
            {ATLAS_CATALOG.length} ตัวอย่าง · {species.length} ชนิดสัตว์
          </span>
          <label>
            <span className="vmx-sr-only">กรองชนิดสัตว์</span>
            <select value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="all">สัตว์ทุกชนิด</option>
              {species.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="vmx-atlas-specimens">
          {ATLAS_CATALOG.filter((item) => filter === 'all' || item.speciesId === filter).map((item) => (
            <button
              type="button"
              key={item.id}
              className="vmx-atlas-specimen"
              aria-label={`เปิด ${item.title}`}
              aria-pressed={specimen.id === item.id}
              onClick={() => chooseSpecimen(item.id)}
            >
              <img src={item.poster} alt="" width="72" height="72" loading="lazy" />
              <span>
                <strong>{item.title}</strong>
                <small>{item.titleEn}</small>
                <em>
                  {item.kind === 'segmented' ? `${item.parts.length} ชิ้นที่เลือกได้` : 'ดูทั้งตัวอย่าง'}
                </em>
              </span>
              {specimen.id === item.id && <Check size={16} aria-hidden="true" />}
            </button>
          ))}
        </div>
      </section>

      <div className="vmx-atlas-topline">
        <div className="vmx-atlas-modes" role="group" aria-label="วิธีเรียน">
          <button type="button" aria-pressed={mode === 'explore'} onClick={() => enterMode('explore')}>
            <Box size={17} aria-hidden="true" />
            สำรวจ
          </button>
          <button type="button" aria-pressed={mode === 'compare'} onClick={() => enterMode('compare')}>
            <Columns2 size={17} aria-hidden="true" />
            เปรียบเทียบ
          </button>
          {segmented && (
            <button type="button" aria-pressed={recall} disabled={!ready} onClick={() => enterMode('recall')}>
              <GraduationCap size={18} aria-hidden="true" />
              ทบทวนชื่อ
            </button>
          )}
        </div>
        <label className="vmx-atlas-quality">
          <span>คุณภาพ</span>
          <select
            value={quality}
            disabled={staticMode}
            onChange={(e) => {
              setQuality(e.target.value);
              setStatus({ kind: 'loading', views: [] });
            }}
          >
            <option value="quick">ภาพเร็ว · {formatBytes(specimen.profiles.quick.bytes)}</option>
            <option value="detail">รายละเอียด · {formatBytes(specimen.profiles.detail.bytes)}</option>
          </select>
        </label>
      </div>
      {comparison && (
        <div className="vmx-atlas-compare-bar">
          <ArrowLeftRight size={18} aria-hidden="true" />
          <strong>{specimen.title}</strong>
          <span>เทียบกับ</span>
          <select
            aria-label="ตัวอย่างที่เปรียบเทียบ"
            value={comparison.id}
            onChange={(e) => {
              setLocation((current) => ({ ...current, compareId: e.target.value }));
              setStatus({ kind: 'loading', views: [] });
            }}
          >
            {ATLAS_CATALOG.filter((item) => item.id !== specimen.id).map((item) => (
              <option key={item.id} value={item.id}>
                {item.title}
              </option>
            ))}
          </select>
          <span className="vmx-atlas-scale-note">ปรับขนาดให้พอดีจอ ไม่ใช่มาตราส่วนจริง</span>
        </div>
      )}

      {systems.length > 0 && !recall && (
        <div>
          {systems.length > 4 && (
            <button className="vmx-atlas-system-toggle" type="button"
              aria-expanded={systemsExpanded} aria-controls="atlas-system-options"
              onClick={() => setSystemsExpanded(value => !value)}>
              <Layers size={16} aria-hidden="true" />
              ชั้นโครงสร้าง · {systems.length} ระบบ {systemsExpanded ? '−' : '+'}
            </button>
          )}
        <div id="atlas-system-options" className="vmx-atlas-systems" role="group" aria-label="ชั้นโครงสร้าง"
          hidden={systems.length > 4 && !systemsExpanded}>
          {systems.map(({ label, ids }) => {
            const count = ids.filter((id) => visibleIds.includes(id)).length;
            const shown = count === ids.length;
            return (
              <button type="button" key={label} aria-label={`${shown ? 'ปิด' : 'เปิด'}ชั้น ${label}`}
                aria-pressed={shown ? true : count ? 'mixed' : false}
                onClick={() => changeVisibility(ids, shown ? 'hide' : 'show')}>
                <Layers size={16} aria-hidden="true" />
                <span>{label}<small>{count}/{ids.length}</small></span>
              </button>
            );
          })}
          {specimen.parts.some(part => part.representation === 'muscle-path') && (
            <span>เส้นแสดงแนวจำลอง ไม่ใช่รูปร่างกล้ามเนื้อ</span>
          )}
        </div>
        </div>
      )}
      <div className="vmx-atlas-workspace">
        <section
          className={`vmx-atlas-stage${comparison ? ' is-comparing' : ''}`}
          aria-label="พื้นที่สำรวจโมเดล"
          ref={stage}
        >
          <div className="vmx-atlas-stage-heading">
            <div>
              <span className="vmx-atlas-eyebrow">
                {specimen.speciesEn.toUpperCase()} / {specimen.collectionLabel || (segmented ? 'BONE COLLECTION' : 'SKULL COLLECTION')}
              </span>
              <h2>{specimen.titleEn}</h2>
            </div>
            {segmented && (
              <span>
                {visibleIds.length} / {specimen.parts.length} ชิ้นที่แสดง
              </span>
            )}
            <button
              type="button"
              className="vmx-atlas-fullscreen"
              onClick={fullscreen}
              aria-label="สลับเต็มจอ"
              title="สลับเต็มจอ"
            >
              <Maximize2 size={18} aria-hidden="true" />
            </button>
          </div>
          <div
            className={`vmx-atlas-render${comparison ? ' is-comparing' : ''}`}
            data-atlas-state={staticMode ? 'static' : status.kind}
            data-model-stored={status.views?.[0]?.stored ? 'true' : 'false'}
            data-comparison-state={
              comparison ? (staticMode ? 'static' : status.views?.[1]?.kind || 'loading') : 'none'
            }
          >
            <div className={`vmx-atlas-posters${comparison ? ' is-comparing' : ''}`}>
              {[specimen, comparison].filter(Boolean).map((item, index) => (
                <div
                  key={item.id}
                  aria-hidden={!staticMode && status.views?.[index]?.kind === 'ready'}
                  style={{
                    visibility: !staticMode && status.views?.[index]?.kind === 'ready' ? 'hidden' : 'visible',
                  }}
                >
                  <img src={item.poster} alt={`ภาพตัวอย่างจากโมเดล ${item.title}`} width="600" height="600" />
                  <span>
                    {status.views?.[index]?.kind === 'error'
                      ? 'ภาพตัวอย่าง · 3D ยังไม่พร้อม'
                      : staticMode
                        ? 'ภาพตัวอย่างจากโมเดล'
                        : 'กำลังเปิด 3D…'}
                  </span>
                </div>
              ))}
            </div>
            {!staticMode && (
              <Suspense fallback={null}>
                <AtlasScene
                  key={attempt}
                  {...{ specimen, comparison, quality, exploded, coloured, ghost, cut, command, visibleIds }}
                  selected={part.id}
                  onSelect={recall ? () => {} : selectPart}
                  onStatus={setStatus}
                  onExport={exportImage}
                />
              </Suspense>
            )}
            {comparison && (
              <div className="vmx-atlas-pane-names">
                <span>A · {specimen.species}</span>
                <span>B · {comparison.species}</span>
              </div>
            )}
            {ready && segmented && (
              <div className="vmx-atlas-selected-tag">
                {hideAnswer ? `ชิ้นที่ ${round + 1}` : part.en} · {visibleIds.length}/{specimen.parts.length}
              </div>
            )}
          </div>
          {status.kind === 'loading' && !staticMode && (
            <div className="vmx-atlas-progress" role="status">
              <progress max="100" value={status.views?.[0]?.progress || 0} />
              <span>กำลังเปิด 3D {status.views?.[0]?.progress || 0}%</span>
            </div>
          )}
          {status.kind === 'error' && !staticMode && (
            <div className="vmx-atlas-failure" role="alert">
              <p>{status.message || 'ยังแสดงโมเดลไม่ได้'}</p>
              <button type="button" onClick={retry}>
                ลองใหม่
              </button>
            </div>
          )}
          {comparison && status.views?.[1]?.kind === 'error' && !staticMode && (
            <div className="vmx-atlas-failure" role="alert">
              <p>ภาพเปรียบเทียบเปิดไม่ได้: {status.views[1].message}</p>
              <button type="button" onClick={retry}>
                ลองใหม่ทั้งสองภาพ
              </button>
            </div>
          )}
          {ready && visibleIds.length === 0 && (
            <div className="vmx-atlas-failure" role="status">
              <p>ซ่อนชิ้นส่วนทั้งหมดแล้ว</p>
              <button type="button" onClick={reset}>
                แสดงทั้งหมด
              </button>
            </div>
          )}
          <div className="vmx-atlas-camera" role="group" aria-label="ควบคุมมุมมอง">
            <button
              type="button"
              disabled={!ready}
              onClick={() => run('left')}
              aria-label="หมุนโมเดลไปทางซ้าย"
              title="หมุนโมเดลไปทางซ้าย"
            >
              <RotateCcw size={18} aria-hidden="true" />
            </button>
            <button
              type="button"
              disabled={!ready}
              onClick={() => run('right')}
              aria-label="หมุนโมเดลไปทางขวา"
              title="หมุนโมเดลไปทางขวา"
            >
              <RotateCw size={18} aria-hidden="true" />
            </button>
            <button
              type="button"
              disabled={!ready}
              onClick={() => run('zoom-in')}
              aria-label="ขยายโมเดล"
              title="ขยายโมเดล"
            >
              <ZoomIn size={18} aria-hidden="true" />
            </button>
            <button
              type="button"
              disabled={!ready}
              onClick={() => run('zoom-out')}
              aria-label="ย่อโมเดล"
              title="ย่อโมเดล"
            >
              <ZoomOut size={18} aria-hidden="true" />
            </button>
            <button
              type="button"
              disabled={!ready}
              onClick={() => run('fit')}
              aria-label="จัดทุกชิ้นให้พอดีจอ"
              title="จัดทุกชิ้นให้พอดีจอ"
            >
              <Focus size={18} aria-hidden="true" />
            </button>
            <button
              type="button"
              disabled={!ready}
              onClick={reset}
              aria-label="คืนมุมมองเริ่มต้น"
              title="คืนมุมมองเริ่มต้น"
            >
              <RotateCcw size={18} aria-hidden="true" />
              <span>คืนค่า</span>
            </button>
            <span className="vmx-atlas-camera-divider" />
            <button
              type="button"
              aria-pressed={staticMode}
              disabled={recall}
              onClick={() => {
                if (!staticMode) reset();
                setStaticMode(!staticMode);
                if (staticMode) setStatus({ kind: 'loading', views: [] });
              }}
              aria-label="สลับภาพนิ่ง"
              title="สลับภาพนิ่ง"
            >
              <Image size={18} aria-hidden="true" />
            </button>
            <button
              type="button"
              disabled={!ready || recall}
              onClick={() => run('export')}
              aria-label="บันทึกภาพพร้อมอ้างอิง"
              title="บันทึกภาพพร้อมอ้างอิง"
            >
              <Download size={18} aria-hidden="true" />
            </button>
          </div>
          <div className="vmx-atlas-stage-footer">
            <span>
              {staticMode
                ? 'ภาพตัวอย่างจากโมเดล · เปิด 3D เพื่อหมุนมุมมอง'
                : `ลากเพื่อหมุน · กางนิ้วเพื่อซูม${comparison ? ' · กล้องขยับพร้อมกัน' : ''}`}
            </span>
            {shellReady &&
              status.views?.length > 0 &&
              status.views.every((view) => view.kind === 'ready' && view.stored) && (
                <span>
                  <WifiOff size={12} aria-hidden="true" />
                  โมเดลพร้อมเปิดซ้ำแบบออฟไลน์
                </span>
              )}
          </div>
          <details className="vmx-atlas-visibility">
            <summary>
              <Layers size={16} aria-hidden="true" />
              การมองเห็น{cut > 0 ? ' · กำลังตัดผิวโมเดล' : ''}
            </summary>
            <div>
              {segmented && (
                <>
                  <label className="vmx-atlas-explode">
                    <span>
                      แยกชิ้นส่วน <output>{exploded}%</output>
                    </span>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="1"
                      value={exploded}
                      disabled={!ready || recall}
                      onChange={(e) => setExploded(Number(e.target.value))}
                      onPointerUp={() => run('fit')}
                      onKeyUp={() => run('fit')}
                      aria-label="ระยะแยกชิ้นส่วน"
                    />
                  </label>
                  <label className="vmx-atlas-colour">
                    <input
                      type="checkbox"
                      checked={coloured}
                      disabled={!ready || recall}
                      onChange={(e) => setColoured(e.target.checked)}
                    />
                    แยกสีแต่ละชิ้น
                  </label>
                  <label className="vmx-atlas-colour">
                    <input
                      type="checkbox"
                      checked={ghost}
                      disabled={!ready || recall}
                      onChange={(e) => setGhost(e.target.checked)}
                    />
                    ทำชิ้นรอบข้างโปร่งใส
                  </label>
                </>
              )}
              <label className="vmx-atlas-explode">
                <span>
                  เปิดผิวโมเดล <output>{cut}%</output>
                </span>
                <input
                  type="range"
                  min="0"
                  max="90"
                  step="5"
                  value={cut}
                  disabled={!ready || recall}
                  onChange={(e) => setCut(Number(e.target.value))}
                  aria-label="ระดับการเปิดผิวโมเดล"
                />
              </label>
              <p>การเปิดผิวช่วยดูช่องว่างในโมเดล ไม่ใช่ภาพ CT ตัดขวางหรือข้อมูลเนื้อเยื่อภายใน</p>
            </div>
          </details>
        </section>

        <aside className="vmx-atlas-inspector" aria-label="รายละเอียดชิ้นส่วน">
          {recall && (
            <div className="vmx-atlas-recall">
              <span className="vmx-atlas-eyebrow">
                ทบทวนชื่อ · {round + 1}/{specimen.parts.length}
              </span>
              <h2>{hideAnswer ? 'ชิ้นนี้ชื่ออะไร?' : 'เทียบกับคำตอบของคุณ'}</h2>
              <p>หมุนดูรูปร่าง แล้วลองนึกชื่อก่อนเปิดคำตอบ</p>
              {hideAnswer ? (
                <button type="button" className="vmx-btn vmx-btn-primary" onClick={() => setRevealed(true)}>
                  แสดงคำตอบ
                </button>
              ) : (
                <button
                  type="button"
                  className="vmx-btn vmx-btn-primary"
                  onClick={() => {
                    const next = (round + 1) % specimen.parts.length;
                    setRound(next);
                    selectPart(specimen.parts[next].id);
                    setRevealed(false);
                    run('focus');
                  }}
                >
                  {round === specimen.parts.length - 1 ? 'เริ่มรอบใหม่' : 'ชิ้นถัดไป'}
                  <ChevronRight size={16} aria-hidden="true" />
                </button>
              )}
            </div>
          )}
          {!hideAnswer && (
            <>
              <div className="vmx-atlas-detail-title">
                <span className="vmx-atlas-eyebrow">
                  {segmented ? part.group : specimen.speciesEn}
                  {part.side ? ` · ${part.side}ของสัตว์` : ''}
                </span>
                <h2>{part.en}</h2>
                <p>{part.th}</p>
                {part.latin && <em lang="la">{part.latin}</em>}
                {!segmented && <em>{specimen.scientificName}</em>}
              </div>
              {segmented && !recall && (
                <div className="vmx-atlas-part-actions">
                  <button
                    type="button"
                    disabled={!ready}
                    onClick={() => {
                      setHidden((current) => current.filter((id) => id !== part.id));
                      run('focus');
                    }}
                  >
                    <Focus size={16} aria-hidden="true" />
                    โฟกัสชิ้นนี้
                  </button>
                  <button
                    type="button"
                    disabled={!ready}
                    aria-pressed={isolated}
                    onClick={() => {
                      setHidden((current) => current.filter((id) => id !== part.id));
                      setIsolated(!isolated);
                      run(isolated ? 'fit' : 'focus');
                    }}
                  >
                    <Eye size={16} aria-hidden="true" />
                    {isolated ? 'กลับไปดูร่วมกัน' : 'ดูเฉพาะชิ้นนี้'}
                  </button>
                  {part.pair && (
                    <button
                      type="button"
                      onClick={() => {
                        selectPart(part.pair);
                        setHidden([]);
                        setIsolated(false);
                        run('fit');
                      }}
                    >
                      <ArrowLeftRight size={16} aria-hidden="true" />
                      เทียบกับอีกข้าง
                    </button>
                  )}
                </div>
              )}
              <div className="vmx-atlas-reference">
                <span className="vmx-atlas-eyebrow">
                  <BookOpen size={14} aria-hidden="true" />
                  ที่มาที่ตรวจสอบได้
                </span>
                <a href={specimen.sourceUrl} target="_blank" rel="noopener noreferrer">
                  {specimen.institution}
                </a>
                <p>{specimen.authors}</p>
                {part.navPage && (
                  <>
                    <a
                      href="https://wava-amav.org/wava-documents.html"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Nomina Anatomica Veterinaria
                    </a>
                    <p>
                      6th ed. (2017) · Osteologia หน้า {part.navPage}
                      <br />
                      หน้า {part.pdfPage} ในไฟล์ PDF
                    </p>
                  </>
                )}
                <span className="vmx-atlas-review-note">
                  {segmented
                    ? specimen.terminologyReview === 'nav-checked'
                      ? 'ชื่อศัพท์เทียบ NAV แล้ว · รูปร่างหลังแปลงและคำไทยยังรอทบทวน'
                      : 'ชื่อโครงสร้างตามต้นทาง · ยังรอตรวจศัพท์ รูปร่าง และคำไทย'
                    : 'ตัวอย่างจากแหล่งต้นทาง ไม่ได้แทนความแปรผันทั้งหมดของสัตว์ชนิดนี้'}
                </span>
              </div>
              {!segmented && (
                <div className="vmx-atlas-observe">
                  <h3>ลองสังเกต</h3>
                  <p>
                    หมุนดูจากหลายมุม แล้วใช้โหมดเปรียบเทียบดูความต่างของรูปร่าง ช่องเปิด และขอบกระดูก
                    โดยอ่านแหล่งอ้างอิงประกอบ
                  </p>
                </div>
              )}
            </>
          )}
          {segmented && !recall && (
            <AtlasPartDirectory
              key={specimen.id}
              parts={parts}
              total={specimen.parts.length}
              selected={part.id}
              visibleIds={visibleIds}
              query={query}
              onQuery={setQuery}
              searchRef={search}
              searchLabel={specimen.partSearchLabel}
              onSelect={selectPart}
              onReset={reset}
              onToggle={(id) => {
                changeVisibility([id], visibleIds.includes(id) ? 'hide' : 'show');
              }}
              onGroupVisibility={(ids, action) => {
                changeVisibility(ids, action);
                run('fit');
              }}
            />
          )}
        </aside>
      </div>
      {notice && (
        <p className="vmx-atlas-notice" role="status">
          {notice}
          <button type="button" onClick={() => setNotice('')} aria-label="ปิดข้อความ">
            <X size={14} aria-hidden="true" />
          </button>
        </p>
      )}
      {shareFallback && (
        <input
          className="vmx-atlas-share-url"
          aria-label="ลิงก์ชิ้นส่วนสำหรับคัดลอก"
          readOnly
          value={shareFallback}
          onFocus={(e) => e.target.select()}
        />
      )}
      <section className="vmx-atlas-scope" id="atlas-evidence" aria-label="ขอบเขตและแหล่งอ้างอิง">
        <div>
          <h2>อ่านโมเดลอย่างมีบริบท</h2>
          <p>{specimen.scope} สีและระยะแยกชิ้นใช้ช่วยมอง ไม่ใช่สีเนื้อเยื่อหรือตำแหน่งจริง</p>
          {comparison && (
            <p>
              <strong>{comparison.title}:</strong> {comparison.scope}
            </p>
          )}
        </div>
        <details>
          <summary>แหล่งที่มา ตำราอ่านต่อ และสิทธิ์ใช้งาน</summary>
          <div className="vmx-atlas-source-body">
            {[specimen, comparison].filter(Boolean).map((item) => (
              <p key={item.id}>
                <strong>{item.title}:</strong>{' '}
                <a href={item.sourceOverview} target="_blank" rel="noopener noreferrer">
                  {item.authors}
                </a>{' '}
                ·{' '}
                <a href={item.licenseUrl} target="_blank" rel="noopener noreferrer">
                  {item.license}
                </a>
                {item.licenseNoticeUrl && <> · <a href={item.licenseNoticeUrl} target="_blank" rel="noopener noreferrer">ประกาศลิขสิทธิ์ต้นฉบับ</a></>}
                {item.sourceManifest && <> · <a href={item.sourceManifest} target="_blank" rel="noopener noreferrer">ข้อมูลพิกัดและที่มาของชิ้นส่วน</a></>}
              </p>
            ))}
            <p>
              คงรูปร่างจากไฟล์ต้นทาง ปรับพิกัดเพื่อแสดงผล ลดรายละเอียดผิว และสร้างภาพตัวอย่างจากโมเดลจริง
              การตรวจชื่อและที่มาไม่ใช่การรับรองความถูกต้องทางคลินิก ·{' '}
              <a href="/atlas/ATTRIBUTION.md" target="_blank" rel="noopener noreferrer">
                เครดิตและรายละเอียดการดัดแปลง
              </a>
            </p>
            <p>
              <strong>ตำราอ่านต่อ:</strong> ใช้สำหรับศึกษาและตรวจทานประกอบ
              ไม่ได้หมายความว่าตรวจโมเดลเทียบครบทุกหน้าแล้ว
            </p>
            <ul>
              {specimen.reading.map((book) => (
                <li key={book.title}>
                  <a href={book.url} target="_blank" rel="noopener noreferrer">
                    {book.title}
                  </a>{' '}
                  · {book.edition} · {book.locator}
                </li>
              ))}
            </ul>
          </div>
        </details>
      </section>
    </div>
  );
}
