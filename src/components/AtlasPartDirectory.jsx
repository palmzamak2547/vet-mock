import { useMemo, useState } from 'react';
import { Check, ChevronDown, ChevronRight, Eye, EyeOff, Focus, Search } from 'lucide-react';

// Group only published parts. No system or anatomical identity is inferred
// from geometry; absent metadata stays in the source's existing group.
export default function AtlasPartDirectory({ parts, total, selected, visibleIds, query, onQuery,
  searchRef, onSelect, onToggle, onGroupVisibility, onReset, searchLabel = 'ค้นหากระดูก' }) {
  const groups = useMemo(() => {
    const result = new Map();
    for (const part of parts) {
      const label = part.systemLabel || part.group || 'ชิ้นส่วนอื่น';
      if (!result.has(label)) result.set(label, []);
      result.get(label).push(part);
    }
    return [...result].map(([label, items]) => ({ label, items }));
  }, [parts]);
  const [collapsed, setCollapsed] = useState(() => groups.filter((group) => group.items.length > 40).map((group) => group.label));
  const visible = new Set(visibleIds);
  return (
    <section className="vmx-atlas-directory" aria-label="รายชื่อโครงสร้าง">
      <div className="vmx-atlas-directory-heading">
        <h2>ชิ้นส่วน</h2><span>{parts.length}/{total}</span>
      </div>
      <label className="vmx-atlas-search">
        <Search size={17} aria-hidden="true" />
        <span className="vmx-sr-only">{searchLabel}</span>
        <input ref={searchRef} type="search" placeholder="ไทย / English / Latin"
          value={query} onChange={(event) => { setCollapsed([]); onQuery(event.target.value); }} />
      </label>
      <p className="vmx-atlas-directory-hint">เปิดดูเป็นหมวด · ซ่อนหรือดูเฉพาะหมวดได้</p>
      {groups.map(({ label, items }, index) => {
        const expanded = !collapsed.includes(label);
        const count = items.filter((item) => visible.has(item.id)).length;
        const allVisible = count === items.length;
        const target = `${query.trim() ? 'ผลค้นหาในหมวด' : 'หมวด'} ${label}`;
        const bodyId = `atlas-directory-group-${index}`;
        return (
          <section className="vmx-atlas-part-group" key={label} aria-label={`หมวด ${label}`}>
            <div className="vmx-atlas-group-heading">
              <button type="button" className="vmx-atlas-group-expand" aria-expanded={expanded}
                aria-controls={bodyId} onClick={() => setCollapsed((current) =>
                  current.includes(label) ? current.filter((value) => value !== label) : [...current, label])}>
                {expanded ? <ChevronDown size={16} aria-hidden="true" /> : <ChevronRight size={16} aria-hidden="true" />}
                <span>{label}<small>{count}/{items.length} ชิ้นที่แสดง</small></span>
              </button>
              <button type="button" className="vmx-atlas-eye" aria-label={`ดูเฉพาะ${target}`}
                title={`ดูเฉพาะ${target}`} onClick={() => onGroupVisibility(items.map((item) => item.id), 'isolate')}>
                <Focus size={16} aria-hidden="true" />
              </button>
              <button type="button" className="vmx-atlas-eye"
                aria-label={`${allVisible ? 'ซ่อน' : 'แสดง'}${target}`}
                aria-pressed={allVisible ? true : count ? 'mixed' : false}
                title={`${allVisible ? 'ซ่อน' : 'แสดง'}${target}`}
                onClick={() => onGroupVisibility(items.map((item) => item.id), allVisible ? 'hide' : 'show')}>
                {allVisible ? <Eye size={16} aria-hidden="true" /> : <EyeOff size={16} aria-hidden="true" />}
              </button>
            </div>
            <div id={bodyId} hidden={!expanded}>
              {expanded && items.map((item) => (
                <div className="vmx-atlas-part-row" key={item.id} data-selected={selected === item.id}>
                  <button type="button" className="vmx-atlas-select" aria-label={`เลือก ${item.en}`}
                    aria-pressed={selected === item.id} onClick={() => onSelect(item.id)}>
                    <span>{item.en}<small>{item.th}</small></span>
                    {selected === item.id && <Check size={15} aria-hidden="true" />}
                  </button>
                  <button type="button" className="vmx-atlas-eye"
                    aria-label={`${visible.has(item.id) ? 'ซ่อน' : 'แสดง'} ${item.en}`}
                    aria-pressed={visible.has(item.id)} onClick={() => onToggle(item.id)}>
                    {visible.has(item.id) ? <Eye size={16} aria-hidden="true" /> : <EyeOff size={16} aria-hidden="true" />}
                  </button>
                </div>
              ))}
            </div>
          </section>
        );
      })}
      {!parts.length && <p role="status">ไม่พบชื่อในชุดนี้</p>}
      <button type="button" className="vmx-atlas-show-all" onClick={onReset}>แสดงทุกชิ้นร่วมกัน</button>
    </section>
  );
}
