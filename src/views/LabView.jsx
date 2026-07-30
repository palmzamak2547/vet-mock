import { useState, useCallback, useEffect, Suspense, lazy } from 'react';
import { useMediaQuery } from '../lib/dicom/use-media-query.js';

const DicomViewport = lazy(() => import('../components/lab/DicomViewport.jsx'));
const CaseLibrary = lazy(() => import('../components/lab/CaseLibrary.jsx'));
const TagInspector = lazy(() => import('../components/lab/TagInspector.jsx'));

const RECENT_KEY = 'vmx-lab-recent-files';
const RECENT_MAX = 5;
const MAX_FILES = 2;  // Phase 9 — 2-up compare. Future phases may raise this.

// Check the DICOM magic-byte signature "DICM" at offset 128. Catches
// files exported without a .dcm extension (common when PACS dumps the
// SOP-Instance-UID as filename).
async function isDicomFile(file) {
  if (!file) return false;
  const lower = file.name.toLowerCase();
  if (lower.endsWith('.dcm') || lower.endsWith('.dicom')) return true;
  if (file.type === 'application/dicom') return true;
  if (file.size < 132) return false;
  try {
    const head = await file.slice(0, 200).arrayBuffer();
    const v = new Uint8Array(head);
    return v[128] === 0x44 && v[129] === 0x49 && v[130] === 0x43 && v[131] === 0x4D;
  } catch {
    return false;
  }
}

export default function LabView({ goHome }) {
  const isMobile = useMediaQuery('(max-width: 600px)');
  const [files, setFiles] = useState([]);  // 0–MAX_FILES DICOMs
  const [currentCase, setCurrentCase] = useState(null);
  const [showCases, setShowCases] = useState(false);
  // Tracks WHERE the current files came from so the viewer's Back
  // button can return to the right step (library vs drop zone)
  // instead of always dropping the user back at lab-home.
  const [fileSource, setFileSource] = useState(null);  // 'drag' | 'library' | null
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState(null);
  const [recent, setRecent] = useState([]);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [syncEnabled, setSyncEnabled] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);
  const [demoError, setDemoError] = useState(null);
  // Public cases for the demo CTA. Fetched once on mount so the CTA's
  // label matches what would actually open — was previously hard-coded
  // "น้องคอฟฟี่" but the underlying query used createdAt DESC so it
  // would open whichever case was newest. Now: label === action target.
  const [demoCases, setDemoCases] = useState([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(RECENT_KEY);
      if (raw) setRecent(JSON.parse(raw));
    } catch { /* corrupt JSON; ignore */ }
    try {
      // One-time first-visit hint. Suppressed forever once dismissed.
      const seen = localStorage.getItem('vmx-lab-onboarded');
      if (!seen) setShowOnboarding(true);
    } catch { /* ignore */ }

    // Fetch public cases ONCE on mount so the demo CTA label is in
    // sync with the actual data — sorts oldest-first (ASC) so the
    // "founding" CUVET case stays as the demo and new cases get
    // discovered through Browse instead.
    (async () => {
      try {
        const { hasSupabase, getSupabase } = await import('../lib/supabase.js');
        if (!hasSupabase) return;
        const sb = await getSupabase();
        const { data, error } = await sb
          .from('imaging_cases')
          .select('id, slug, title, species, signalment, history, body_part, learning_objectives, difficulty, license, source_url, attribution, credibility')
          .eq('status', 'public')
          .order('created_at', { ascending: true });
        if (error) {
          // Pre-migration or RLS issue — silently skip; CTA falls back
          // to disabled / fetch-on-click failure message.
          return;
        }
        if (data) setDemoCases(data);
      } catch { /* network/Supabase down — CTA still works via on-click fetch */ }
    })();
  }, []);

  const dismissOnboarding = useCallback(() => {
    setShowOnboarding(false);
    try { localStorage.setItem('vmx-lab-onboarded', '1'); } catch { /* noop */ }
  }, []);

  const addToRecent = useCallback((f) => {
    if (!f) return;
    const entry = { name: f.name, size: f.size, lastModified: f.lastModified || Date.now() };
    setRecent((prev) => {
      const next = [entry, ...prev.filter((p) => !(p.name === entry.name && p.size === entry.size))].slice(0, RECENT_MAX);
      try { localStorage.setItem(RECENT_KEY, JSON.stringify(next)); } catch { /* quota or private mode */ }
      return next;
    });
  }, []);

  const handleFiles = useCallback(async (fileList) => {
    if (!fileList || fileList.length === 0) return;
    const arr = Array.from(fileList).slice(0, MAX_FILES);
    const validated = [];
    const bad = [];
    for (const f of arr) {
      if (await isDicomFile(f)) {
        validated.push(f);
        addToRecent(f);
      } else {
        bad.push(f.name);
      }
    }
    if (validated.length === 0) {
      setError(`ไฟล์ไม่ใช่ DICOM: ${bad.join(', ')}`);
      return;
    }
    const skippedExtras = fileList.length > MAX_FILES ? fileList.length - MAX_FILES : 0;
    let msg = null;
    if (bad.length > 0) msg = `บางไฟล์ไม่ใช่ DICOM (ข้าม): ${bad.join(', ')}`;
    if (skippedExtras > 0) msg = `${msg ? msg + ', ' : ''}ตอนนี้รองรับสูงสุด ${MAX_FILES} ไฟล์ (ข้าม ${skippedExtras})`;
    setError(msg);
    setFiles(validated);
    setCurrentCase(null);
    setFileSource('drag');
  }, [addToRecent]);

  const onDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    handleFiles(e.dataTransfer?.files);
  }, [handleFiles]);

  const onDragOver = useCallback((e) => {
    e.preventDefault();
    setDragging(true);
  }, []);

  const onDragLeave = useCallback((e) => {
    if (e.currentTarget.contains(e.relatedTarget)) return;
    setDragging(false);
  }, []);

  const onFileInput = useCallback((e) => handleFiles(e.target.files), [handleFiles]);

  const clearRecent = useCallback(() => {
    setRecent([]);
    try { localStorage.removeItem(RECENT_KEY); } catch { /* noop */ }
  }, []);

  const removeRecentAt = useCallback((idx) => {
    setRecent((prev) => {
      const next = prev.filter((_, i) => i !== idx);
      try {
        if (next.length === 0) localStorage.removeItem(RECENT_KEY);
        else localStorage.setItem(RECENT_KEY, JSON.stringify(next));
      } catch { /* noop */ }
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    setFiles([]);
    setCurrentCase(null);
    setError(null);
    setFileSource(null);
  }, []);

  // Context-aware Back from viewer: if user came from the case library,
  // return to the library list (keeps their browse state mental model);
  // if from drag-drop, fall back to the drop zone. Either way, files
  // are cleared so the next pick is a clean state.
  const backFromViewer = useCallback(() => {
    setFiles([]);
    setCurrentCase(null);
    setError(null);
    if (fileSource === 'library') {
      setShowCases(true);  // → back to case grid
    } else {
      setShowCases(false); // → back to drop zone
    }
    setFileSource(null);
  }, [fileSource]);

  const removeFileAt = useCallback((idx) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
  }, []);

  const handleBack = useCallback(() => {
    if (typeof window !== 'undefined' && window.location.hash === '#lab') {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }
    goHome?.();
  }, [goHome]);

  const handleOpenCase = useCallback((openedFiles, caseMeta) => {
    // CaseLibrary may pass a single File or an array of Files.
    const arr = Array.isArray(openedFiles) ? openedFiles : [openedFiles];
    setFiles(arr.slice(0, MAX_FILES));
    setCurrentCase(caseMeta);
    setShowCases(false);
    setFileSource('library');
  }, []);

  // Threaded into the viewer header to show "Source: ... License: ..."
  // for any public case we display. Attribution is REQUIRED by CC-BY
  // and CC-BY-SA so it's not optional polish — it's compliance.
  const caseAttributionLine = (
    currentCase?.attribution || currentCase?.license || currentCase?.source_url
  ) ? (
    <div style={attributionRowStyle}>
      {currentCase?.license && <span>📜 <strong>{currentCase.license}</strong></span>}
      {currentCase?.source_url && currentCase.source_url !== 'internal' && (
        <span>, <a href={currentCase.source_url} target="_blank" rel="noopener noreferrer" style={{ color: '#3a5a8a' }}>source ↗</a></span>
      )}
      {currentCase?.attribution && (
        <div style={{ marginTop: 3, fontSize: '0.7rem', color: '#777' }}>{currentCase.attribution}</div>
      )}
    </div>
  ) : null;

  // Open the EXACT case shown in the demo CTA's label. The button
  // disables itself if demoCases is empty so this should never be
  // called without a target — but we guard anyway.
  const tryDemo = useCallback(async () => {
    if (demoCases.length === 0) {
      setDemoError('ยังไม่มี public case');
      return;
    }
    setDemoLoading(true);
    setDemoError(null);
    try {
      const { getSupabase } = await import('../lib/supabase.js');
      const sb = await getSupabase();
      const c = demoCases[0];  // same as displayed in CTA
      const { data: caseFiles, error: fErr } = await sb
        .from('imaging_case_files')
        .select('id, view_name, storage_path')
        .eq('case_id', c.id)
        .order('display_order');
      if (fErr) throw fErr;
      if (!caseFiles?.length) throw new Error('Case ไม่มี DICOM file');
      const fetched = await Promise.all(caseFiles.slice(0, MAX_FILES).map(async (row) => {
        const { data: signed, error: sErr } = await sb.storage.from('lab-dicom').createSignedUrl(row.storage_path, 600);
        if (sErr) throw sErr;
        const res = await fetch(signed.signedUrl);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const buf = await res.arrayBuffer();
        return new File([buf], `${c.slug}_${row.view_name}.dcm`, { type: 'application/dicom' });
      }));
      handleOpenCase(fetched, c);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('[tryDemo]', e);
      setDemoError(e?.message || String(e));
    } finally {
      setDemoLoading(false);
    }
  }, [demoCases, handleOpenCase]);

  const subView = files.length > 0 ? 'viewer' : (showCases ? 'cases' : 'home');
  const firstFile = files[0];  // for header label

  return (
    <div style={{ padding: isMobile ? 10 : 20, maxWidth: 1400, margin: '0 auto' }}>
      <header style={headerStyle}>
        <div>
          <h1 style={{ fontSize: '1.4rem', margin: 0 }}>Imaging Practice Lab</h1>
          {/* Consolidated subtitle — replaces the old standalone yellow
              disclaimer banner. Liability stays visible on every visit
              (always rendered, not dismissible) but takes a single line
              instead of 50 px of vertical clutter. */}
          <p style={{ fontSize: '0.78rem', color: '#666', margin: '4px 0 0', lineHeight: 1.4 }}>
            ฝึกอ่านภาพ + DICOM viewer, <span style={{ color: '#c66' }}>Experimental</span>
            <span style={{ color: '#888' }}>, เพื่อการเรียนรู้, ไม่ใช้แทนการ workup ผู้ป่วยจริง</span>
          </p>
        </div>
        <button onClick={handleBack} className="vmx-btn vmx-btn-ghost vmx-btn-sm">← Home</button>
      </header>

      {showOnboarding && subView === 'home' && (
        <div style={onboardingStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
            <div style={{ flex: 1 }}>
              <strong style={{ fontSize: '0.95rem' }}>👋 ยินดีต้อนรับ Imaging Practice Lab</strong>
              <ul style={{ margin: '8px 0 0', paddingLeft: 22, fontSize: '0.85rem', lineHeight: 1.6, color: '#555' }}>
                <li>ลาก DICOM (<code>.dcm</code>) ลงด้านล่าง — ลากครั้งละ 2 ไฟล์ได้ (เปิด side-by-side)</li>
                <li>เปิด viewer แล้วกด <kbd style={kbdInlineStyle}>?</kbd> ดู 16 keyboard shortcuts</li>
                <li>มี Norberg + VHS + Length/Angle ครบ, Anonymize ก่อน share ภาพออก</li>
                <li>ไฟล์ render ใน browser ล้วน — ไม่ขึ้น server</li>
                <li>เข้าครั้งหน้า bookmark URL <code>#lab</code> ตรงๆ ได้เลย</li>
              </ul>
            </div>
            <button onClick={dismissOnboarding} className="vmx-tap" style={onboardingCloseStyle} aria-label="ปิดคำแนะนำ">✕</button>
          </div>
        </div>
      )}

      {subView === 'home' && (
        <>
          {/* ── HERO — primary action: try a curated case in 1 click ── */}
          <button
            onClick={tryDemo}
            disabled={demoLoading || demoCases.length === 0}
            style={{
              ...heroDemoBtnStyle,
              padding: isMobile ? '14px 16px' : '18px 22px',
              opacity: demoCases.length === 0 ? 0.5 : 1,
              cursor: demoCases.length === 0 ? 'not-allowed' : 'pointer',
            }}
            title={
              demoCases.length === 0
                ? 'ยังไม่มี public case, ลาก DICOM ของตัวเองด้านล่างแทน'
                : `เปิด: ${demoCases[0].title}`
            }
          >
            {demoLoading ? (
              'กำลังโหลด demo case...'
            ) : demoCases.length === 0 ? (
              'ยังไม่มี public case, ลาก DICOM ด้านล่างแทน'
            ) : (
              <>
                <span style={{ fontSize: isMobile ? '1.05rem' : '1.15rem' }}>
                  ▶️ ลอง demo: <strong>{demoCases[0].title}</strong>
                </span>
                {demoCases.length > 1 && (
                  <span style={{ display: 'block', fontWeight: 400, fontSize: '0.78rem', opacity: 0.85, marginTop: 4 }}>
                    case แรกจาก {demoCases.length} cases, กด Browse ด้านล่างดูทั้งหมด
                  </span>
                )}
              </>
            )}
          </button>
          {demoError && (
            <p style={{ color: '#c00', fontSize: '0.82rem', margin: '8px 0 0', textAlign: 'center' }}>
              โหลด demo ไม่สำเร็จ: {demoError}
            </p>
          )}

          {/* ── SECONDARY actions — Browse + Upload side-by-side ── */}
          <div style={secondaryGridStyle(isMobile)}>
            <button
              onClick={() => setShowCases(true)}
              style={secondaryCardStyle}
              title="ดู 17 cases ทั้งหมด — filter ตาม modality (X-ray/CT/MRI/US)"
            >
              <div style={{ fontSize: '1.6rem', marginBottom: 4 }}>📚</div>
              <div style={{ fontWeight: 600, fontSize: '0.92rem' }}>
                Browse case library
              </div>
              <div style={{ fontSize: '0.75rem', color: '#888', marginTop: 2 }}>
                {demoCases.length > 0 ? `${demoCases.length} cases, X-ray / CT / MRI / US` : 'ดู cases ทั้งหมด'}
              </div>
            </button>

            <label
              onDrop={onDrop}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              style={{
                ...secondaryCardStyle,
                ...(dragging ? secondaryCardDraggingStyle : {}),
                cursor: 'pointer',
                display: 'block',
              }}
              title="Drag .dcm ลงตรงนี้ หรือคลิกเลือกไฟล์, render ใน browser ล้วน, ไม่ upload"
            >
              <div style={{ fontSize: '1.6rem', marginBottom: 4 }}>📁</div>
              <div style={{ fontWeight: 600, fontSize: '0.92rem' }}>
                Upload DICOM ของคุณ
              </div>
              <div style={{ fontSize: '0.75rem', color: '#888', marginTop: 2 }}>
                Drag .dcm, ครั้งละ {MAX_FILES} ไฟล์, ไม่ขึ้น server
              </div>
              <input
                type="file"
                accept=".dcm,application/dicom"
                multiple
                onChange={onFileInput}
                style={{ display: 'none' }}
              />
            </label>
          </div>

          {error && (
            <p style={{ color: '#c00', fontSize: '0.82rem', margin: '4px 0 0', textAlign: 'center' }}>
              {error}
            </p>
          )}

          <AdvancedToolsRow />

          {recent.length > 0 && (
            <div style={recentBoxStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <strong style={{ fontSize: '0.85rem', color: '#555' }}>🕘 Recent files</strong>
                <button
                  onClick={clearRecent}
                  style={{ fontSize: '0.7rem', color: '#888', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
                >
                  ล้าง
                </button>
              </div>
              <div style={{ fontSize: '0.75rem', color: '#777', marginBottom: 6 }}>
                File blobs ไม่ persist ข้าม session, เห็นรายการที่นี่แล้วลากไฟล์เดิมจาก disk เพื่อ re-open
              </div>
              <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                {recent.map((r, i) => (
                  <li key={i} style={{ fontSize: '0.8rem', color: '#666', padding: '4px 0', borderTop: i > 0 ? '1px solid #eee' : 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                    <span style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      📄 <span style={{ color: '#333' }}>{r.name}</span>, {(r.size / 1024).toFixed(0)} KB, {new Date(r.lastModified).toLocaleString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </span>
                    <button
                      onClick={() => removeRecentAt(i)}
                      title="ลบจากประวัติ"
                      aria-label="ลบไฟล์นี้จากประวัติ"
                      style={{ width: 20, height: 20, padding: 0, border: 'none', background: 'none', color: '#aaa', cursor: 'pointer', fontSize: '0.85rem', flexShrink: 0 }}
                    >×</button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}

      {subView === 'cases' && (
        <Suspense fallback={<div style={loadingFallbackStyle}>กำลังโหลด case library...</div>}>
          <CaseLibrary onOpenCase={handleOpenCase} onBack={() => setShowCases(false)} />
        </Suspense>
      )}

      {subView === 'viewer' && files.length > 0 && (
        <div>
          <div style={viewerHeaderStyle}>
            <div style={{ fontSize: '0.88rem', color: '#555' }}>
              {currentCase ? (
                <>
                  <strong>Case: {currentCase.title}</strong>,
                  <span style={{ color: '#777' }}>
                    {' '}{[currentCase.species, currentCase.signalment].filter(Boolean).join(', ')}
                  </span>
                </>
              ) : (
                <>
                  📄 {files.length === 1
                    ? `${firstFile.name}, ${(firstFile.size / 1024).toFixed(0)} KB`
                    : `Study (${files.length} views): ${files.map(f => f.name).join(' + ')}`}
                </>
              )}
            </div>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
              {files.length >= 2 && (
                <label style={syncToggleStyle} title="Sync zoom + pan + W/L across both viewports">
                  <input
                    type="checkbox"
                    checked={syncEnabled}
                    onChange={(e) => setSyncEnabled(e.target.checked)}
                    style={{ marginRight: 5 }}
                  />
                  Sync views
                </label>
              )}
              {files.length === 1 && <AnonymizeButton file={firstFile} />}
              <button
                onClick={backFromViewer}
                className="vmx-btn vmx-btn-ghost vmx-btn-sm"
                title={fileSource === 'library' ? 'กลับไปหน้า Case Library' : 'กลับไปหน้าเลือกไฟล์'}
              >
                {fileSource === 'library' ? '← Back to library' : '← Back to drop zone'}
              </button>
            </div>
          </div>

          {currentCase?.history && (
            <div style={historyCardStyle}>
              <strong>History:</strong> {currentCase.history}
            </div>
          )}

          {caseAttributionLine}

          {/* Single viewport or 2-up grid depending on file count */}
          <div style={files.length >= 2 ? studyGridStyle : undefined}>
            {files.map((f, idx) => (
              <ViewerPane
                key={`${f.name}-${f.size}-${f.lastModified || 0}`}
                file={f}
                index={idx}
                canRemove={files.length > 1}
                onRemove={() => removeFileAt(idx)}
                caseId={currentCase?.id || null}
                syncEnabled={syncEnabled && files.length > 1}
              />
            ))}
          </div>

          {currentCase?.learning_objectives?.length > 0 && (
            <div style={objectivesCardStyle}>
              <strong>Learning objectives:</strong>
              <ul style={{ margin: '6px 0 0', paddingLeft: 22 }}>
                {currentCase.learning_objectives.map((obj, i) => <li key={i}>{obj}</li>)}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// "🧪 Advanced / senior-project tools" row at the bottom of Lab home.
// Kept quiet (one ghost-text line) so first-time learners aren't
// distracted; power users can find:
//   • CSV export of own saved imaging_attempts (for AI training data)
//   • Sample AI JSON download (shows the AI overlay schema)
//   • Link to the AI integration spec
function AdvancedToolsRow() {
  const [busy, setBusy] = useState(null);  // 'csv' | 'ai-sample' | null
  const [msg, setMsg] = useState(null);

  const exportCsv = async () => {
    setBusy('csv');
    setMsg(null);
    try {
      const mod = await import('../lib/dicom/export-attempts.js');
      const res = await mod.fetchAndExportAttemptsCsv();
      if (res.ok) {
        setMsg({ kind: 'ok', text: `ดาวน์โหลด ${res.count} attempt(s)` });
      } else {
        const labels = {
          'no-supabase': 'Supabase ไม่ตั้งค่า',
          'no-auth': 'ต้อง sign in ก่อน export',
          'no-table': 'Migration ยังไม่ apply',
          'no-data': 'ยังไม่มี attempt ที่บันทึก',
        };
        setMsg({ kind: 'err', text: labels[res.reason] || res.reason });
      }
    } catch (e) {
      setMsg({ kind: 'err', text: e?.message || String(e) });
    } finally {
      setBusy(null);
      setTimeout(() => setMsg(null), 5000);
    }
  };

  const downloadSample = async () => {
    setBusy('ai-sample');
    try {
      const mod = await import('../lib/dicom/export-attempts.js');
      mod.downloadSampleAiJson();
      setMsg({ kind: 'ok', text: 'Downloaded vmx-lab-ai-sample.json — drop it on viewer via 🤖 Load AI' });
    } catch (e) {
      setMsg({ kind: 'err', text: e?.message || String(e) });
    } finally {
      setBusy(null);
      setTimeout(() => setMsg(null), 5000);
    }
  };

  return (
    <div style={advancedRowStyle}>
      <details style={{ width: '100%' }}>
        <summary style={advancedSummaryStyle}>
          Advanced — senior project tools (CSV, AI sample, spec)
        </summary>
        <div style={{ marginTop: 8, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button
            onClick={exportCsv}
            disabled={busy === 'csv'}
            className="vmx-btn vmx-btn-ghost vmx-btn-sm"
            title="Export your saved imaging_attempts as CSV (RLS-scoped to you)"
          >
            {busy === 'csv' ? 'exporting...' : 'Export my attempts (CSV)'}
          </button>
          <button
            onClick={downloadSample}
            disabled={busy === 'ai-sample'}
            className="vmx-btn vmx-btn-ghost vmx-btn-sm"
            title="ดาวน์โหลด AI prediction JSON sample, drop ผ่าน 🤖 Load AI เพื่อดู overlay"
          >
            Sample AI JSON
          </button>
          <a
            href="https://github.com/palmzamak2547/vet-mock/blob/main/src/lib/dicom/AI-INTEGRATION.md"
            target="_blank"
            rel="noopener noreferrer"
            className="vmx-btn vmx-btn-ghost vmx-btn-sm"
            style={{ textDecoration: 'none' }}
          >
            AI integration spec ↗
          </a>
        </div>
        {msg && (
          <div style={{ marginTop: 6, fontSize: '0.78rem', color: msg.kind === 'err' ? '#c33' : '#3a7' }}>
            {msg.text}
          </div>
        )}
      </details>
    </div>
  );
}

// One viewport's wrapper: filename header + optional remove button +
// the Cornerstone-backed DicomViewport itself. Each pane operates an
// independent engine + tool group — there's no cross-pane sync yet,
// each toolbar controls only its own viewport.
function ViewerPane({ file, index, canRemove, onRemove, caseId, syncEnabled }) {
  const [showTags, setShowTags] = useState(false);
  return (
    <div style={paneStyle}>
      <div style={paneHeaderStyle}>
        <span>
          <strong>View {index + 1}:</strong>{' '}
          <span style={{ color: '#888', fontSize: '0.75rem' }}>{file.name}</span>
        </span>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <button
            onClick={() => setShowTags((s) => !s)}
            className="vmx-btn vmx-btn-ghost vmx-btn-sm"
            title="ดู DICOM tags ทั้งหมด"
          >
            Info
          </button>
          <AnonymizeButton file={file} />
          {canRemove && (
            <button
              onClick={onRemove}
              aria-label="Remove this view"
              style={removePaneBtnStyle}
              title="ปิด view นี้"
            >
              ✕
            </button>
          )}
        </div>
      </div>
      <Suspense fallback={<div style={loadingFallbackStyle}>กำลังโหลด viewer...</div>}>
        <DicomViewport file={file} caseId={caseId} syncEnabled={syncEnabled} />
      </Suspense>
      {showTags && (
        <Suspense fallback={null}>
          <TagInspector file={file} onClose={() => setShowTags(false)} />
        </Suspense>
      )}
    </div>
  );
}

// Lazy-loads the anonymizer module + dicom-parser only when needed.
function AnonymizeButton({ file }) {
  const [status, setStatus] = useState('idle');
  const [summary, setSummary] = useState(null);

  const run = async () => {
    setStatus('working');
    setSummary(null);
    try {
      const mod = await import('../lib/dicom/anonymizer.js');
      const { file: anon, stripped } = await mod.anonymizeDicom(file);
      mod.downloadFile(anon);
      setSummary({ count: stripped.length, names: stripped.map(s => s.label) });
      setStatus('done');
      setTimeout(() => setStatus('idle'), 6000);
    } catch (e) {
      setStatus('error');
      setSummary({ error: e?.message || String(e) });
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={run}
        disabled={status === 'working'}
        className="vmx-btn vmx-btn-ghost vmx-btn-sm"
        title="Strip PII tags + download anonymized copy"
      >
        {status === 'working' ? 'anon...' : status === 'done' ? 'Downloaded' : 'Anonymize'}
      </button>
      {summary && status !== 'working' && (
        <div style={anonSummaryStyle}>
          {summary.error ? (
            <span style={{ color: '#c33' }}>❌ {summary.error}</span>
          ) : (
            <>
              <strong>Stripped {summary.count} tags</strong>
              <ul style={{ margin: '4px 0 0', paddingLeft: 18, fontSize: '0.7rem' }}>
                {summary.names.slice(0, 6).map((n) => <li key={n}>{n}</li>)}
                {summary.names.length > 6 && <li>… +{summary.names.length - 6} more</li>}
              </ul>
              <div style={{ fontSize: '0.65rem', color: '#888', marginTop: 4 }}>
                Saved as <code>{file.name.replace(/\.dcm$/i, '')}_anon.dcm</code>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

// ─── styles ───────────────────────────────────────────────────

const headerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 16,
  gap: 12,
  flexWrap: 'wrap',
};

// Kept for any view that still references it (none after Wave UX —
// disclaimer is now inlined in the page subtitle).
const disclaimerStyle = {
  fontSize: '0.8rem',
  color: '#7a5a00',
  padding: '8px 12px',
  background: '#fff8e1',
  border: '1px solid #ffd54f',
  borderRadius: 6,
  marginBottom: 16,
};

const modeButtonsStyle = {
  display: 'flex',
  gap: 12,
  marginBottom: 16,
  alignItems: 'center',
  flexWrap: 'wrap',
};

const viewerHeaderStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 12,
  gap: 8,
  flexWrap: 'wrap',
};

const attributionRowStyle = {
  marginBottom: 12,
  padding: '8px 12px',
  background: '#f0f4f8',
  border: '1px solid #d0dce8',
  borderRadius: 6,
  fontSize: '0.78rem',
  color: '#456',
};

const historyCardStyle = {
  fontSize: '0.85rem',
  color: '#555',
  padding: '8px 12px',
  background: '#f8f6f0',
  border: '1px solid #e8e0c8',
  borderRadius: 6,
  marginBottom: 12,
};

const objectivesCardStyle = {
  marginTop: 12,
  fontSize: '0.85rem',
  color: '#555',
  padding: '10px 14px',
  background: '#f0f5f0',
  border: '1px solid #cce0cc',
  borderRadius: 6,
};

const loadingFallbackStyle = {
  padding: 40,
  textAlign: 'center',
  color: '#888',
};

const demoCtaWrapStyle = {
  marginBottom: 16,
};

const demoCtaBtnStyle = {
  width: '100%',
  padding: '16px 20px',
  background: 'linear-gradient(135deg, #4a6b4a 0%, #6b8a5a 100%)',
  color: '#fff',
  border: 'none',
  borderRadius: 10,
  cursor: 'pointer',
  fontSize: '1rem',
  fontWeight: 600,
  boxShadow: '0 2px 8px rgba(74,107,74,0.25)',
  transition: 'transform 100ms, box-shadow 100ms',
};

// Hero (Phase Wave UX) — same sage gradient as old CTA but stretches
// to fill width + slightly bigger padding. Removed the wrapping div
// since the button is now the hero itself.
const heroDemoBtnStyle = {
  display: 'block',
  width: '100%',
  background: 'linear-gradient(135deg, #4a6b4a 0%, #6b8a5a 100%)',
  color: '#fff',
  border: 'none',
  borderRadius: 12,
  fontWeight: 600,
  boxShadow: '0 3px 10px rgba(74,107,74,0.28)',
  transition: 'transform 100ms, box-shadow 100ms',
  marginBottom: 12,
  textAlign: 'center',
};

const secondaryGridStyle = (isMobile) => ({
  display: 'grid',
  gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
  gap: 10,
  marginBottom: 12,
});

const secondaryCardStyle = {
  padding: '14px 16px',
  background: '#fafafa',
  border: '1px solid #e0e0e0',
  borderRadius: 10,
  textAlign: 'center',
  cursor: 'pointer',
  transition: 'background 120ms, border-color 120ms',
  fontFamily: 'inherit',
  color: '#333',
};

const secondaryCardDraggingStyle = {
  background: '#f0f8f0',
  borderColor: '#4a6b4a',
  borderWidth: 2,
  borderStyle: 'dashed',
};

const advancedRowStyle = {
  marginTop: 16,
  padding: '8px 14px',
  background: '#f6f4ef',
  border: '1px solid #e5dfd0',
  borderRadius: 6,
  fontSize: '0.82rem',
};

const advancedSummaryStyle = {
  cursor: 'pointer',
  color: '#666',
  fontSize: '0.82rem',
  userSelect: 'none',
};

const recentBoxStyle = {
  marginTop: 16,
  padding: '10px 14px',
  background: '#fafafa',
  border: '1px solid #e8e8e8',
  borderRadius: 6,
};

const onboardingStyle = {
  padding: '12px 16px',
  background: '#eef5ff',
  border: '1px solid #b8d4ff',
  borderRadius: 8,
  marginBottom: 16,
};

const onboardingCloseStyle = {
  width: 28,
  height: 28,
  border: '1px solid #b8d4ff',
  background: '#fff',
  borderRadius: 4,
  cursor: 'pointer',
  fontSize: '0.85rem',
  color: '#456',
  flexShrink: 0,
};

const syncToggleStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  padding: '6px 11px',
  background: '#fff',
  border: '1px solid #ccc',
  borderRadius: 4,
  cursor: 'pointer',
  fontSize: '0.82rem',
  color: '#333',
  whiteSpace: 'nowrap',
  minHeight: 36,
  boxSizing: 'border-box',
};

const kbdInlineStyle = {
  display: 'inline-block',
  padding: '1px 6px',
  background: '#fff',
  border: '1px solid #ccc',
  borderRadius: 3,
  fontFamily: 'monospace',
  fontSize: '0.78rem',
};

const studyGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
  gap: 12,
};

const paneStyle = {
  border: '1px solid #ddd',
  borderRadius: 8,
  background: '#fff',
  padding: 8,
};

const paneHeaderStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 8,
  padding: '4px 6px',
  fontSize: '0.85rem',
  color: '#555',
  flexWrap: 'wrap',
  gap: 6,
};

const removePaneBtnStyle = {
  width: 24,
  height: 24,
  borderRadius: 4,
  border: '1px solid #ccc',
  background: '#fff',
  cursor: 'pointer',
  color: '#666',
  fontSize: '0.85rem',
  lineHeight: 1,
  padding: 0,
};

const anonSummaryStyle = {
  position: 'absolute',
  top: '100%',
  right: 0,
  marginTop: 4,
  padding: '8px 10px',
  background: '#fff',
  border: '1px solid #ccc',
  borderRadius: 6,
  fontSize: '0.78rem',
  minWidth: 220,
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  zIndex: 100,
};
