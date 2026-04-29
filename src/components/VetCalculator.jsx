// ============================================================
// VetCalculator — floating widget for clinical calculations
// ============================================================
//
// A small bottom-right floating button (🧮) opens a modal with
// 5 tabs covering the formulas vet students hit most often:
//
//   • RER          — resting energy requirement (kcal/day)
//   • Fluid        — total daily fluid (deficit + maintenance + ongoing)
//   • Drug dose    — total mg from BW × mg/kg
//   • Transfusion  — pRBC volume to raise PCV by N
//   • DKA insulin  — regular insulin CRI rate (dog/cat)
//
// Lazy-loaded from App.jsx so the floating button doesn't add to
// the main bundle. Self-contained — no external state, no API calls.
// All formulas have a "Why" caption so users can verify the math
// (and learn the formula instead of just plugging numbers).
// ============================================================

import { useState, useEffect } from 'react';

const TABS = [
  { id: 'rer',          label: 'RER',         icon: '🔥' },
  { id: 'fluid',        label: 'Fluid',       icon: '💧' },
  { id: 'drug',         label: 'Drug dose',   icon: '💊' },
  { id: 'transfusion',  label: 'Transfusion', icon: '🩸' },
  { id: 'dka',          label: 'DKA insulin', icon: '🍬' },
];

// Helpers — round to N decimals; never NaN-display
const r = (n, d = 1) => (isFinite(n) ? +n.toFixed(d) : null);
const fmt = (n, suffix = '') => (n === null || n === undefined ? '—' : `${n}${suffix}`);

// ── Resting Energy Requirement ─────────────────────────────────
function RERTab() {
  const [bw, setBw] = useState('');
  const w = parseFloat(bw);
  // Linear formula (30·BW + 70) is the workhorse for 2-30 kg.
  // Allometric (70·BW^0.75) is more accurate for the extremes —
  // show both so users can see when they diverge.
  const linear = isFinite(w) && w > 0 ? r(30 * w + 70, 0) : null;
  const allometric = isFinite(w) && w > 0 ? r(70 * Math.pow(w, 0.75), 0) : null;
  return (
    <div>
      <Field label="น้ำหนัก (kg)" value={bw} onChange={setBw} placeholder="20" type="number" />
      <Result label="RER (linear · 30·BW + 70)" value={fmt(linear, ' kcal/day')} accent />
      <Result label="RER (allometric · 70·BW^0.75)" value={fmt(allometric, ' kcal/day')} />
      <Note>
        💡 ใช้ <strong>linear</strong> สำหรับ 2-30 kg (ง่าย แม่น). · <strong>allometric</strong>
        สำหรับ &lt; 2 kg หรือ &gt; 30 kg.
        <br />
        Maintenance = RER × illness factor (1.0-1.4) แต่ในสัตว์ป่วยปกติเริ่มที่ RER เลย
        แล้วค่อยเพิ่มถ้าน้ำหนักลด.
      </Note>
    </div>
  );
}

// ── Daily Fluid Rate ───────────────────────────────────────────
function FluidTab() {
  const [bw, setBw] = useState('');
  const [pct, setPct] = useState('');
  const [hours, setHours] = useState('24');
  const [ongoing, setOngoing] = useState('0');
  const w = parseFloat(bw);
  const dehyd = parseFloat(pct);
  const hr = parseFloat(hours);
  const og = parseFloat(ongoing) || 0;
  // Deficit (mL) = BW(kg) × dehyd(%) × 10 (because 1 kg = 1000 mL,
  // % = /100, so /100 × 1000 = ×10)
  const deficit = isFinite(w) && isFinite(dehyd) && w > 0 && dehyd >= 0 ? r(w * dehyd * 10, 0) : null;
  const maint = isFinite(w) && w > 0 ? r(w * 60, 0) : null; // 60 mL/kg/day default
  const total = deficit !== null && maint !== null ? deficit + maint + og : null;
  const ratePerHr = total !== null && isFinite(hr) && hr > 0 ? r(total / hr, 1) : null;
  return (
    <div>
      <Field label="น้ำหนัก (kg)" value={bw} onChange={setBw} placeholder="4" type="number" />
      <Field label="% Dehydration" value={pct} onChange={setPct} placeholder="7" type="number" suffix="%" />
      <Field label="แก้ภายในกี่ชม." value={hours} onChange={setHours} placeholder="24" type="number" suffix="hr" />
      <Field label="Ongoing loss (vomit/diarrhea, mL)" value={ongoing} onChange={setOngoing} placeholder="0" type="number" suffix="mL" />
      <Result label="Deficit" value={fmt(deficit, ' mL')} />
      <Result label="Maintenance (60 mL/kg/d)" value={fmt(maint, ' mL/day')} />
      <Result label="รวม / วัน" value={fmt(total, ' mL/day')} />
      <Result label="Rate / hour" value={fmt(ratePerHr, ' mL/hr')} accent />
      <Note>
        💡 Deficit = BW × %dehyd × 10 · Maintenance = 60 mL/kg/day (kitten/puppy 80-100) ·
        Shock bolus (90 mL/kg dog · 60 mL/kg cat) แยก — ให้บางส่วนแล้ว reassess.
      </Note>
    </div>
  );
}

// ── Drug Dose ──────────────────────────────────────────────────
function DrugTab() {
  const [bw, setBw] = useState('');
  const [dose, setDose] = useState('');
  const [conc, setConc] = useState('');
  const w = parseFloat(bw);
  const d = parseFloat(dose);
  const c = parseFloat(conc);
  const totalMg = isFinite(w) && isFinite(d) && w > 0 && d > 0 ? r(w * d, 2) : null;
  const totalMl = totalMg !== null && isFinite(c) && c > 0 ? r(totalMg / c, 2) : null;
  return (
    <div>
      <Field label="น้ำหนัก (kg)" value={bw} onChange={setBw} placeholder="20" type="number" />
      <Field label="Dose (mg/kg)" value={dose} onChange={setDose} placeholder="2.2" type="number" />
      <Field label="Concentration (mg/mL · optional)" value={conc} onChange={setConc} placeholder="50" type="number" suffix="mg/mL" />
      <Result label="Total dose" value={fmt(totalMg, ' mg')} accent />
      <Result label="Volume to draw" value={fmt(totalMl, ' mL')} />
      <Note>
        💡 ตัวอย่าง: Cefazolin 22 mg/kg · 20 kg dog → 440 mg · vial 100 mg/mL → 4.4 mL.
        <br />
        ระวัง: per-kg dose จากตำราเป็น <em>active drug</em> · concentration ใน vial บางครั้ง
        เป็น <em>salt form</em> (e.g., enrofloxacin base vs HCl) — เช็คหน้า prescribing info.
      </Note>
    </div>
  );
}

// ── Blood Transfusion (pRBC) ───────────────────────────────────
function TransfusionTab() {
  const [bw, setBw] = useState('');
  const [pcvNow, setPcvNow] = useState('');
  const [pcvTarget, setPcvTarget] = useState('25');
  const [pcvDonor, setPcvDonor] = useState('60');
  const w = parseFloat(bw);
  const now = parseFloat(pcvNow);
  const target = parseFloat(pcvTarget);
  const donor = parseFloat(pcvDonor);
  // Standard formula: vol (mL) = BW(kg) × 90 × (PCV_target − PCV_now) / PCV_donor
  // (90 = blood volume mL/kg in dog · cats use 70)
  const [species, setSpecies] = useState('dog');
  const bvFactor = species === 'cat' ? 66 : 90;
  const vol = isFinite(w) && isFinite(now) && isFinite(target) && isFinite(donor) && w > 0 && donor > 0
    ? r(w * bvFactor * (target - now) / donor, 0)
    : null;
  return (
    <div>
      <ChipRow
        label="Species"
        options={[{ id: 'dog', label: '🐕 Dog (90 mL/kg)' }, { id: 'cat', label: '🐈 Cat (66 mL/kg)' }]}
        value={species}
        onChange={setSpecies}
      />
      <Field label="น้ำหนัก (kg)" value={bw} onChange={setBw} placeholder="15" type="number" />
      <Field label="PCV ปัจจุบัน (%)" value={pcvNow} onChange={setPcvNow} placeholder="12" type="number" suffix="%" />
      <Field label="PCV เป้าหมาย (%)" value={pcvTarget} onChange={setPcvTarget} placeholder="25" type="number" suffix="%" />
      <Field label="PCV ของ donor / unit (%)" value={pcvDonor} onChange={setPcvDonor} placeholder="60" type="number" suffix="%" />
      <Result label="Volume of pRBC ที่ต้องให้" value={fmt(vol, ' mL')} accent />
      <Note>
        💡 สูตร: V = BW × 90 (dog) หรือ 66 (cat) × (PCV_target − PCV_now) / PCV_donor.
        <br />
        Whole blood ใช้ 2× volume เทียบกับ pRBC. · Transfusion rate: เริ่มช้า 0.25-1
        mL/kg/hr 15-30 นาที (test dose) · monitor TPR + reaction signs.
      </Note>
    </div>
  );
}

// ── DKA Insulin CRI ────────────────────────────────────────────
function DKATab() {
  const [bw, setBw] = useState('');
  const [species, setSpecies] = useState('dog');
  const w = parseFloat(bw);
  // Standard: dog 2.2 U/kg/day · cat 1.1 U/kg/day · diluted in 250 mL NSS
  const totalU = isFinite(w) && w > 0 ? r(w * (species === 'dog' ? 2.2 : 1.1), 2) : null;
  // Common protocol — Macintire's CRI uses 100 mL/h fixed rate but
  // adjusts insulin amount in the bag depending on glucose
  return (
    <div>
      <ChipRow
        label="Species"
        options={[{ id: 'dog', label: '🐕 Dog (2.2 U/kg/d)' }, { id: 'cat', label: '🐈 Cat (1.1 U/kg/d)' }]}
        value={species}
        onChange={setSpecies}
      />
      <Field label="น้ำหนัก (kg)" value={bw} onChange={setBw} placeholder="10" type="number" />
      <Result label="Regular insulin / 24 hr" value={fmt(totalU, ' U')} accent />
      <Result label="Diluted ใน NSS" value={fmt(totalU !== null ? r(totalU, 2) : null, ' U → 250 mL bag')} />
      <Note>
        💡 Macintire CRI: ใส่ insulin ทั้งหมด (จากด้านบน) ใน NSS 250 mL · run ที่ rate
        ตาม BG:
        <br />
        BG &gt; 250 → 10 mL/h · 200-250 → 7 mL/h · 150-200 → 5 mL/h · 100-150 → 5 mL/h
        + add D2.5% · &lt; 100 → STOP + dextrose.
        <br />
        ⚠️ ห้ามให้ insulin bolus IV · ต้อง correct fluid + electrolyte (K) ก่อน.
      </Note>
    </div>
  );
}

// ── Reusable mini form parts ───────────────────────────────────
function Field({ label, value, onChange, placeholder, type = 'text', suffix }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <label style={{ display: 'block', fontSize: 12, color: 'var(--clr-ink-soft)', marginBottom: 4, fontFamily: 'JetBrains Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        {label}
      </label>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <input
          type={type}
          inputMode={type === 'number' ? 'decimal' : undefined}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          style={{
            flex: 1,
            padding: '8px 10px',
            fontSize: 14,
            borderRadius: 8,
            border: '1px solid var(--clr-border)',
            background: 'var(--clr-bg)',
            color: 'var(--clr-ink)',
            fontFamily: 'inherit',
          }}
        />
        {suffix && <span style={{ fontSize: 11, color: 'var(--clr-ink-soft)', fontFamily: 'JetBrains Mono, monospace', minWidth: 30 }}>{suffix}</span>}
      </div>
    </div>
  );
}

function Result({ label, value, accent }) {
  return (
    <div style={{
      padding: '10px 14px',
      borderRadius: 10,
      marginBottom: 8,
      background: accent ? 'var(--clr-rose-soft)' : 'var(--clr-surface-2)',
      border: `1px solid ${accent ? 'var(--clr-rose)' : 'var(--clr-border)'}`,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'baseline',
      gap: 12,
      flexWrap: 'wrap',
    }}>
      <span style={{ fontSize: 12, color: 'var(--clr-ink-soft)' }}>{label}</span>
      <span style={{
        fontFamily: 'Fraunces, serif',
        fontWeight: accent ? 700 : 600,
        fontSize: accent ? 18 : 15,
        color: accent ? 'var(--clr-rose)' : 'var(--clr-ink)',
      }}>{value}</span>
    </div>
  );
}

function Note({ children }) {
  return (
    <div style={{
      marginTop: 12,
      padding: '10px 14px',
      borderRadius: 10,
      background: 'rgba(74, 107, 74, 0.08)',
      borderLeft: '3px solid var(--clr-sage)',
      fontSize: 12,
      lineHeight: 1.6,
      color: 'var(--clr-ink-soft)',
    }}>
      {children}
    </div>
  );
}

function ChipRow({ label, options, value, onChange }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <label style={{ display: 'block', fontSize: 12, color: 'var(--clr-ink-soft)', marginBottom: 4, fontFamily: 'JetBrains Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        {label}
      </label>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {options.map((o) => (
          <button
            key={o.id}
            onClick={() => onChange(o.id)}
            className={`vmx-chip ${value === o.id ? 'active' : ''}`}
            type="button"
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────
export default function VetCalculator() {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('rer');

  // Esc closes modal · only attach when open so we don't waste a
  // global listener on every page when the calc is dormant.
  useEffect(() => {
    if (!open) return;
    const handle = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', handle);
    return () => document.removeEventListener('keydown', handle);
  }, [open]);

  return (
    <>
      {/* Floating button — fixed bottom-right. Hidden on print so the
          icon doesn't appear on printed quizzes/notes. */}
      <button
        onClick={() => setOpen(true)}
        title="เครื่องคิดเลขสำหรับสัตวแพทย์ (RER · Fluid · Dose · Transfusion · DKA)"
        aria-label="เปิดเครื่องคิดเลขสัตวแพทย์"
        className="vmx-vetcalc-fab"
        style={{
          position: 'fixed',
          right: 16,
          bottom: 'max(16px, env(safe-area-inset-bottom))',
          zIndex: 900,
          width: 52,
          height: 52,
          borderRadius: '50%',
          border: '1px solid var(--clr-border)',
          background: 'var(--clr-surface)',
          fontSize: 22,
          cursor: 'pointer',
          boxShadow: '0 4px 14px rgba(0, 0, 0, 0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--clr-ink)',
          fontFamily: 'inherit',
          transition: 'transform 0.15s, box-shadow 0.15s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 6px 18px rgba(0, 0, 0, 0.22)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = '';
          e.currentTarget.style.boxShadow = '0 4px 14px rgba(0, 0, 0, 0.15)';
        }}
      >
        🧮
      </button>

      {open && (
        <div className="vmx-modal-overlay" onClick={() => setOpen(false)}>
          <div
            className="vmx-modal"
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: 560,
              maxHeight: 'min(90vh, calc(100dvh - 24px))',
              overflowY: 'auto',
              WebkitOverflowScrolling: 'touch',
            }}
            role="dialog"
            aria-label="Vet Calculator"
          >
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 11, fontFamily: 'JetBrains Mono, monospace', color: 'var(--clr-ink-soft)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                🧮 Vet Calculator
              </div>
              <h2 style={{ margin: '4px 0 0', fontSize: 22 }}>คำนวณคลินิก</h2>
              <p style={{ fontSize: 12, color: 'var(--clr-ink-soft)', margin: '4px 0 0' }}>
                สูตรพื้นฐานที่นิสิต/สัตวแพทย์ใช้บ่อย · ทุกผลลัพธ์มีสูตรกำกับให้ตรวจมือซ้ำได้
              </p>
            </div>

            {/* Tab row */}
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
              {TABS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={`vmx-chip ${activeTab === t.id ? 'active' : ''}`}
                  type="button"
                >
                  {t.icon} {t.label}
                </button>
              ))}
            </div>

            {/* Active tab body */}
            <div>
              {activeTab === 'rer'         && <RERTab />}
              {activeTab === 'fluid'       && <FluidTab />}
              {activeTab === 'drug'        && <DrugTab />}
              {activeTab === 'transfusion' && <TransfusionTab />}
              {activeTab === 'dka'         && <DKATab />}
            </div>

            <div className="vmx-btn-row" style={{ marginTop: 18 }}>
              <button className="vmx-btn vmx-btn-ghost" onClick={() => setOpen(false)} type="button">
                ปิด (esc)
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
