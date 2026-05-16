import { useState, useEffect, useMemo } from 'react';
import dicomParser from 'dicom-parser';
import { TAG_DICT } from '../../lib/dicom/tag-dict.js';

// PII-sensitive tag names — highlighted with a warning badge so users
// know what would be stripped by the anonymizer.
const PII_TAGS = new Set([
  'PatientName', 'PatientID', 'PatientBirthDate', 'PatientSex',
  'PatientAge', 'PatientWeight', 'PatientAddress', 'PatientComments',
  'MedicalAlerts', 'Allergies', 'AccessionNumber',
  'ReferringPhysicianName', 'NameOfPhysiciansReadingStudy',
  'InstitutionName', 'InstitutionAddress', 'StationName',
  'InstitutionalDepartmentName', 'DeviceSerialNumber',
  'OperatorsName', 'PerformingPhysicianName', 'ResponsiblePerson',
]);

export default function TagInspector({ file, onClose }) {
  const [tags, setTags] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [piiOnly, setPiiOnly] = useState(false);

  useEffect(() => {
    if (!file) return;
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const buf = await file.arrayBuffer();
        const dataSet = dicomParser.parseDicom(new Uint8Array(buf));
        const arr = [];
        for (const tagId of Object.keys(dataSet.elements)) {
          const el = dataSet.elements[tagId];
          const name = TAG_DICT[tagId] || '(unknown)';
          let value = '';
          try {
            const s = dataSet.string(tagId);
            value = s !== undefined ? s : `(${el.length} bytes binary)`;
          } catch {
            value = `(${el.length} bytes binary)`;
          }
          arr.push({
            tagId,
            tagPretty: tagId.replace(/^x(....)(....)$/, '($1,$2)').toUpperCase(),
            name,
            value: value.slice(0, 400),
            length: el.length,
            isPii: PII_TAGS.has(name),
          });
        }
        // Sort by tag ID
        arr.sort((a, b) => a.tagId.localeCompare(b.tagId));
        if (!cancelled) setTags(arr);
      } catch (e) {
        if (!cancelled) setError(e?.message || String(e));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [file]);

  const filtered = useMemo(() => {
    let list = tags;
    if (piiOnly) list = list.filter((t) => t.isPii);
    if (filter) {
      const f = filter.toLowerCase();
      list = list.filter((t) =>
        t.name.toLowerCase().includes(f) ||
        t.tagId.includes(f) ||
        t.value.toLowerCase().includes(f),
      );
    }
    return list;
  }, [tags, filter, piiOnly]);

  const piiPresent = useMemo(() => tags.filter((t) => t.isPii && t.value.trim() && !/^[\s\0]*$/.test(t.value)).length, [tags]);

  return (
    <div style={panelStyle}>
      <div style={panelHeaderStyle}>
        <strong>🔍 DICOM Tag Inspector</strong>
        <button onClick={onClose} aria-label="Close" style={closeBtnStyle}>✕</button>
      </div>

      <div style={subHeaderStyle}>
        <div style={{ fontSize: '0.75rem', color: '#666' }}>
          📄 {file?.name} · {tags.length} tags · {piiPresent > 0 && (
            <span style={{ color: '#c33' }}>⚠️ {piiPresent} PII tag(s) present (un-anonymized)</span>
          )}
        </div>
      </div>

      <div style={searchRowStyle}>
        <input
          type="text"
          placeholder="ค้นหาตาม name, tag, หรือ value..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={searchInputStyle}
        />
        <label style={{ fontSize: '0.75rem', color: '#555', whiteSpace: 'nowrap', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={piiOnly}
            onChange={(e) => setPiiOnly(e.target.checked)}
            style={{ marginRight: 4 }}
          />
          PII only
        </label>
      </div>

      {loading && <div style={loadingStyle}>กำลังอ่าน DICOM tags...</div>}
      {error && <div style={errorStyle}>❌ {error}</div>}

      {!loading && !error && (
        <div style={tableWrapStyle}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.75rem' }}>
            <thead>
              <tr style={{ background: '#f0f0f0', position: 'sticky', top: 0 }}>
                <th style={thStyle}>Tag</th>
                <th style={thStyle}>Name</th>
                <th style={thStyle}>Value</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t) => (
                <tr key={t.tagId} style={{ borderBottom: '1px solid #eee', background: t.isPii ? '#fff8f0' : 'transparent' }}>
                  <td style={tdStyle}><code>{t.tagPretty}</code></td>
                  <td style={tdStyle}>
                    {t.name}
                    {t.isPii && <span style={piiBadgeStyle}>PII</span>}
                  </td>
                  <td style={{ ...tdStyle, fontFamily: 'monospace', wordBreak: 'break-all', color: t.value === '' || /^[\s\0]*$/.test(t.value) ? '#aaa' : '#333' }}>
                    {t.value === '' || /^[\s\0]*$/.test(t.value) ? '(empty)' : t.value}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={3} style={{ padding: 16, textAlign: 'center', color: '#888' }}>ไม่พบ tag</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const panelStyle = {
  position: 'fixed',
  top: '5vh',
  right: 20,
  width: 'min(620px, 90vw)',
  maxHeight: '90vh',
  background: '#fff',
  border: '1px solid #ccc',
  borderRadius: 8,
  boxShadow: '0 8px 28px rgba(0,0,0,0.2)',
  zIndex: 1000,
  display: 'flex',
  flexDirection: 'column',
};

const panelHeaderStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '10px 14px',
  borderBottom: '1px solid #eee',
  background: '#f8f8f8',
  borderRadius: '8px 8px 0 0',
};

const closeBtnStyle = {
  width: 26,
  height: 26,
  border: '1px solid #ccc',
  background: '#fff',
  borderRadius: 4,
  cursor: 'pointer',
  fontSize: '0.85rem',
  lineHeight: 1,
};

const subHeaderStyle = {
  padding: '6px 14px',
  borderBottom: '1px solid #f0f0f0',
};

const searchRowStyle = {
  display: 'flex',
  gap: 10,
  padding: '8px 14px',
  alignItems: 'center',
  borderBottom: '1px solid #f0f0f0',
};

const searchInputStyle = {
  flex: 1,
  padding: '5px 8px',
  fontSize: '0.8rem',
  border: '1px solid #ccc',
  borderRadius: 4,
};

const tableWrapStyle = {
  overflow: 'auto',
  flex: 1,
  padding: '0 4px 8px',
};

const thStyle = {
  textAlign: 'left',
  padding: '6px 8px',
  borderBottom: '1px solid #ddd',
  fontWeight: 600,
  color: '#444',
  fontSize: '0.72rem',
};

const tdStyle = {
  padding: '5px 8px',
  verticalAlign: 'top',
};

const piiBadgeStyle = {
  display: 'inline-block',
  marginLeft: 6,
  padding: '0 5px',
  fontSize: '0.65rem',
  background: '#c33',
  color: '#fff',
  borderRadius: 2,
  fontWeight: 700,
};

const loadingStyle = { padding: 30, textAlign: 'center', color: '#888' };
const errorStyle = { padding: 16, color: '#c33' };
