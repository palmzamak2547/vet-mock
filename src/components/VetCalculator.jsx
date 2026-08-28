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

import { useState, useEffect, useMemo } from 'react';
import { drugDose as computeDrugDose } from '../hooks/utils.js';
import { useModalFocus } from '../hooks/useModalFocus.js';
import { VET_DRUGS, DRUG_CATEGORIES } from '../data/vet-drug-database.js';

const TABS = [
  { id: 'rer',          label: 'RER',         icon: '🔥' },
  { id: 'fluid',        label: 'Fluid',       icon: '💧' },
  { id: 'drug',         label: 'Drug dose',   icon: '💊' },
  { id: 'cri',          label: 'CRI rate',    icon: '⏱' },
  { id: 'transfusion',  label: 'Transfusion', icon: '🩸' },
  { id: 'dka',          label: 'DKA insulin', icon: '🍬' },
  { id: 'bsa',          label: 'BSA (chemo)', icon: '🎗' },
  { id: 'convert',      label: 'หน่วย',       icon: '🔁' },
  { id: 'drugdb',       label: 'Drug DB',    icon: '💊' },
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
      <Result label="RER (linear, 30·BW + 70)" value={fmt(linear, ' kcal/day')} accent />
      <Result label="RER (allometric, 70·BW^0.75)" value={fmt(allometric, ' kcal/day')} />
      <Note>
        ใช้ <strong>linear</strong> สำหรับ 2-30 kg (ง่าย แม่น)., <strong>allometric</strong>
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
        Deficit = BW × %dehyd × 10, Maintenance = 60 mL/kg/day (kitten/puppy 80-100),
        Shock bolus (90 mL/kg dog, 60 mL/kg cat) แยก — ให้บางส่วนแล้ว reassess.
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
      <Field label="Concentration (mg/mL, optional)" value={conc} onChange={setConc} placeholder="50" type="number" suffix="mg/mL" />
      <Result label="Total dose" value={fmt(totalMg, ' mg')} accent />
      <Result label="Volume to draw" value={fmt(totalMl, ' mL')} />
      <Note>
        ตัวอย่าง: Cefazolin 22 mg/kg, 20 kg dog → 440 mg, vial 100 mg/mL → 4.4 mL.
        <br />
        ระวัง: per-kg dose จากตำราเป็น <em>active drug</em>, concentration ใน vial บางครั้ง
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
  // (90 = blood volume mL/kg in dog, cats use 70)
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
        สูตร: V = BW × 90 (dog) หรือ 66 (cat) × (PCV_target − PCV_now) / PCV_donor.
        <br />
        Whole blood ใช้ 2× volume เทียบกับ pRBC., Transfusion rate: เริ่มช้า 0.25-1
        mL/kg/hr 15-30 นาที (test dose), monitor TPR + reaction signs.
      </Note>
    </div>
  );
}

// ── DKA Insulin CRI ────────────────────────────────────────────
function DKATab() {
  const [bw, setBw] = useState('');
  const [species, setSpecies] = useState('dog');
  const w = parseFloat(bw);
  // Standard: dog 2.2 U/kg/day, cat 1.1 U/kg/day, diluted in 250 mL NSS
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
        Macintire CRI: ใส่ insulin ทั้งหมด (จากด้านบน) ใน NSS 250 mL, run ที่ rate
        ตาม BG:
        <br />
        BG &gt; 250 → 10 mL/h, 200-250 → 7 mL/h, 150-200 → 5 mL/h, 100-150 → 5 mL/h
        + add D2.5%, &lt; 100 → STOP + dextrose.
        <br />
        ห้ามให้ insulin bolus IV, ต้อง correct fluid + electrolyte (K) ก่อน.
      </Note>
    </div>
  );
}

// ── CRI rate (constant rate infusion) ──────────────────────────
// Solves the most common bedside need: "how much drug do I add to
// a 250 mL bag, and what pump rate gives me X µg/kg/min?"
//
// Inputs: BW, target dose (µg/kg/min), drug stock (mg/mL), bag size,
// fluid rate. Outputs: drug volume to add to bag and equivalent
// total dose per hour for double-checking.
function CRITab() {
  const [bw, setBw] = useState('');
  const [target, setTarget] = useState('');           // µg/kg/min
  const [stock, setStock] = useState('');             // mg/mL
  const [bag, setBag] = useState('250');              // mL
  const [rate, setRate] = useState('');               // mL/hr
  const w = parseFloat(bw);
  const t = parseFloat(target);
  const s = parseFloat(stock);
  const b = parseFloat(bag);
  const ml = parseFloat(rate);
  // 1 mg/kg/hr = 16.67 µg/kg/min → going via µg/kg/min for fewer slips
  // Required mg/hr at target dose = BW(kg) × target(µg/kg/min) × 60 / 1000
  const mgPerHr = isFinite(w) && isFinite(t) && w > 0 && t > 0 ? r(w * t * 60 / 1000, 3) : null;
  // Concentration needed in bag (mg/mL) so that running at given mL/hr delivers mgPerHr:
  const concNeeded = mgPerHr !== null && isFinite(ml) && ml > 0 ? r(mgPerHr / ml, 3) : null;
  // Drug volume (mL) to add to bag = (concNeeded × bag) / stock
  const drugMl = concNeeded !== null && isFinite(s) && isFinite(b) && s > 0 && b > 0
    ? r((concNeeded * b) / s, 2)
    : null;
  return (
    <div>
      <Field label="น้ำหนัก (kg)" value={bw} onChange={setBw} placeholder="20" type="number" />
      <Field label="Target dose (µg/kg/min)" value={target} onChange={setTarget} placeholder="5" type="number" suffix="µg/kg/min" />
      <Field label="Drug stock (mg/mL)" value={stock} onChange={setStock} placeholder="50" type="number" suffix="mg/mL" />
      <Field label="Bag size (mL)" value={bag} onChange={setBag} placeholder="250" type="number" suffix="mL" />
      <Field label="Pump rate (mL/hr)" value={rate} onChange={setRate} placeholder="10" type="number" suffix="mL/hr" />
      <Result label="Total dose / hr" value={fmt(mgPerHr, ' mg/hr')} />
      <Result label="Concentration ในถุง" value={fmt(concNeeded, ' mg/mL')} />
      <Result label="ดูดยาใส่ถุง" value={fmt(drugMl, ' mL')} accent />
      <Note>
        ตัวอย่าง dopamine 5 µg/kg/min, dog 20 kg, stock 40 mg/mL, bag 250 mL, pump 10 mL/hr
        → ดูดยา ≈ 1.5 mL ใส่ถุง.
        <br />
        เช็คผลซ้ำเสมอ: หมุนกลับ — concentration × pump rate ÷ BW × 1000/60 ควรได้ใกล้ target.
      </Note>
    </div>
  );
}

// ── Body Surface Area (m²) — for chemo dosing ───────────────────
// Standard formula: BSA = K × BW^(2/3) / 100, where K = 10.1 (dog)
// or 10.0 (cat). Used because chemo doses don't scale linearly with
// weight — small patients get over-dosed if you use mg/kg.
function BSATab() {
  const [bw, setBw] = useState('');
  const [species, setSpecies] = useState('dog');
  const [drugDose, setDrugDose] = useState('');
  const w = parseFloat(bw);
  const k = species === 'dog' ? 10.1 : 10.0;
  const bsa = isFinite(w) && w > 0 ? r(k * Math.pow(w, 2 / 3) / 100, 3) : null;
  const drug = parseFloat(drugDose);
  const totalMg = bsa !== null && isFinite(drug) && drug > 0 ? r(bsa * drug, 2) : null;
  return (
    <div>
      <ChipRow
        label="Species"
        options={[{ id: 'dog', label: '🐕 Dog (K=10.1)' }, { id: 'cat', label: '🐈 Cat (K=10.0)' }]}
        value={species}
        onChange={setSpecies}
      />
      <Field label="น้ำหนัก (kg)" value={bw} onChange={setBw} placeholder="15" type="number" />
      <Field label="Drug dose (mg/m², optional)" value={drugDose} onChange={setDrugDose} placeholder="250" type="number" suffix="mg/m²" />
      <Result label="BSA" value={fmt(bsa, ' m²')} accent />
      <Result label="Total drug dose" value={fmt(totalMg, ' mg')} />
      <Note>
        BSA = K × BW<sup>(2/3)</sup> / 100. Used for chemo (e.g., doxorubicin 30 mg/m²).
        <br />
        Cats &lt; 10 kg: capped doxorubicin to 1 mg/kg (BSA over-doses small cats — known
        weakness of the formula).
      </Note>
    </div>
  );
}

// ── Unit Converter ──────────────────────────────────────────────
// Quick toggle between common bedside units. mg ↔ µg / mL ↔ drops /
// kg ↔ lb / °C ↔ °F. Done as a single typed value with all
// conversions shown — way faster than swapping tabs.
function ConvertTab() {
  const [mode, setMode] = useState('mass');
  const [val, setVal] = useState('');
  const v = parseFloat(val);
  const haveV = isFinite(v);
  let body = null;
  if (mode === 'mass') {
    body = (
      <>
        <Field label="ใส่ค่าใน mg" value={val} onChange={setVal} placeholder="100" type="number" suffix="mg" />
        <Result label="µg" value={fmt(haveV ? r(v * 1000, 2) : null)} />
        <Result label="g" value={fmt(haveV ? r(v / 1000, 4) : null)} />
        <Result label="grain" value={fmt(haveV ? r(v / 64.8, 4) : null)} />
      </>
    );
  } else if (mode === 'volume') {
    body = (
      <>
        <Field label="ใส่ค่าใน mL" value={val} onChange={setVal} placeholder="2" type="number" suffix="mL" />
        <Result label="หยด (drops, 20 gtt/mL)" value={fmt(haveV ? Math.round(v * 20) : null, ' gtt')} />
        <Result label="หยดเล็ก (60 gtt/mL)" value={fmt(haveV ? Math.round(v * 60) : null, ' µgtt')} />
        <Result label="L" value={fmt(haveV ? r(v / 1000, 4) : null)} />
        <Result label="tsp (5 mL)" value={fmt(haveV ? r(v / 5, 2) : null)} />
      </>
    );
  } else if (mode === 'weight') {
    body = (
      <>
        <Field label="ใส่ค่าใน kg" value={val} onChange={setVal} placeholder="10" type="number" suffix="kg" />
        <Result label="lb" value={fmt(haveV ? r(v * 2.2046, 2) : null)} />
        <Result label="g" value={fmt(haveV ? r(v * 1000, 0) : null)} />
        <Result label="oz" value={fmt(haveV ? r(v * 35.274, 1) : null)} />
      </>
    );
  } else if (mode === 'temp') {
    body = (
      <>
        <Field label="ใส่ค่าใน °C" value={val} onChange={setVal} placeholder="38.5" type="number" suffix="°C" />
        <Result label="°F" value={fmt(haveV ? r(v * 9 / 5 + 32, 1) : null)} />
        <Result label="K" value={fmt(haveV ? r(v + 273.15, 1) : null)} />
      </>
    );
  } else if (mode === 'rate') {
    body = (
      <>
        <Field label="ใส่ค่าใน mL/hr" value={val} onChange={setVal} placeholder="60" type="number" suffix="mL/hr" />
        <Result label="หยด/นาที (20 gtt/mL)" value={fmt(haveV ? r(v * 20 / 60, 1) : null, ' gtt/min')} />
        <Result label="หยดเล็ก/นาที (60 gtt/mL)" value={fmt(haveV ? r(v, 1) : null, ' µgtt/min')} />
        <Result label="mL/min" value={fmt(haveV ? r(v / 60, 2) : null)} />
      </>
    );
  }
  return (
    <div>
      <ChipRow
        label="ประเภท"
        options={[
          { id: 'mass',   label: '⚖ Mass' },
          { id: 'volume', label: '💧 Volume' },
          { id: 'weight', label: 'BW' },
          { id: 'temp',   label: '🌡 Temp' },
          { id: 'rate',   label: 'Rate' },
        ]}
        value={mode}
        onChange={(id) => { setMode(id); setVal(''); }}
      />
      {body}
      <Note>
        Macro drip set (10/15/20 gtt/mL), micro drip (60 gtt/mL).
        ในเด็ก/แมวเล็กควรใช้ micro เพราะคำนวณง่ายกว่า + bolus error น้อยกว่า.
      </Note>
    </div>
  );
}

// ── Drug Database — searchable / filterable by category & species ─
// Compiled from open-source veterinary references (Plumb's, BSAVA,
// MSD, FECAVA). Search by generic name, brand, or indication.
// Tap a drug to see its full card; enter BW to calculate total dose.
function DrugDBTab() {
  const [search, setSearch] = useState('');
  const [bw, setBw] = useState('');
  const [selectedCat, setSelectedCat] = useState(null);
  const [selectedSpec, setSelectedSpec] = useState(null);
  const [expandedDrug, setExpandedDrug] = useState(null);
  const w = parseFloat(bw);

  const filtered = useMemo(() => {
    let drugs = VET_DRUGS;
    if (selectedCat) drugs = drugs.filter((d) => d.category === selectedCat);
    if (selectedSpec) drugs = drugs.filter((d) => d.species === selectedSpec || d.species === 'both');
    const q = search.toLowerCase().trim();
    if (q) {
      drugs = drugs.filter((d) =>
        d.generic.toLowerCase().includes(q) ||
        d.brand.toLowerCase().includes(q) ||
        d.indication.toLowerCase().includes(q) ||
        d.category.toLowerCase().includes(q),
      );
    }
    return drugs;
  }, [search, selectedCat, selectedSpec]);

  const clearFilters = () => { setSearch(''); setSelectedCat(null); setSelectedSpec(null); };

  return (
    <div>
      {/* Search */}
      <div className="vmx-vetcalc-field-group">
        <div className="vmx-vetcalc-field-input-wrap">
          <input
            type="text"
            placeholder="ค้นหายา (ชื่อสามัญ/การค้า/ข้อบ่งใช้)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search drugs"
            className="vmx-vetcalc-field-input"
          />
        </div>
      </div>

      {/* Category chips */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16, maxHeight: 120, overflowY: 'auto' }}>
        {DRUG_CATEGORIES.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelectedCat(selectedCat === c.id ? null : c.id)}
            className={`vmx-vetcalc-tab-btn ${selectedCat === c.id ? 'active' : ''}`}
            type="button"
            style={{ fontSize: 12, padding: '6px 14px' }}
          >
            {c.icon} {c.label.split(' ')[0]}
          </button>
        ))}
      </div>

      {/* Species filter + BW */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-end', marginBottom: 16 }}>
        <div style={{ flex: 1, minWidth: 100 }}>
          <Field label="น้ำหนัก (kg)" value={bw} onChange={setBw} placeholder="10" type="number" />
        </div>
        <div style={{ paddingBottom: 16 }}>
          <ChipRow
            label="Species"
            options={[
              { id: 'dog', label: '🐕 Dog' },
              { id: 'cat', label: '🐈 Cat' },
            ]}
            value={selectedSpec}
            onChange={(id) => setSelectedSpec(selectedSpec === id ? null : id)}
          />
        </div>
      </div>

      {/* Results count */}
      <div style={{ fontSize: 12, color: 'var(--clr-ink-soft)', marginBottom: 12, fontFamily: 'var(--vmx-mono)', fontWeight: 600 }}>
        {filtered.length} รายการ
        {(selectedCat || selectedSpec) && (
          <button type="button" onClick={clearFilters} className="vmx-inline-action" style={{ marginLeft: 12, fontSize: 12 }}>ล้าง filter</button>
        )}
      </div>

      {/* Drug list */}
      <div style={{ maxHeight: 360, overflowY: 'auto', WebkitOverflowScrolling: 'touch', margin: '0 -8px', padding: '0 8px' }}>
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: 24, color: 'var(--clr-ink-soft)', fontSize: 14 }}>
            ไม่พบยา — ลองเปลี่ยนคำค้นหรือ filter
          </div>
        )}
        {filtered.map((drug) => {
          const isExpanded = expandedDrug === drug.id;
          // A 'fixed' dose is per animal, not per kg — multiplying it by
          // body weight is the whole reason methimazole read as a 5x
          // overdose. The field convention documented this unit from the
          // start; nothing implemented it.
          const dd = computeDrugDose(drug, w, selectedSpec);
          const perKg = dd.perKg;
          const hasW = isFinite(w) && w > 0;
          const doseLo = dd.lo;
          const doseHi = dd.hi;
          // The displayed unit comes from the DRUG, not from how small its
          // number happens to be. `doseLo > 1 ? 'mg' : 'µg'` labelled 26 of
          // 57 drugs µg when the answer was mg — a thousandfold
          // understatement on furosemide, pimobendan, enalapril and the
          // rest — and called insulin's IU µg as well.
          const outUnit = dd.unit;
          const sameDose = drug.doseLo === drug.doseHi;
          return (
            <div
              key={drug.id}
              style={{
                padding: isExpanded ? '14px 16px' : '12px 16px',
                marginBottom: 8,
                borderRadius: '12px',
                border: '1px solid var(--clr-border)',
                background: isExpanded ? 'var(--clr-surface-2)' : 'var(--clr-surface)',
                cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: isExpanded ? 'var(--shadow-md)' : 'none',
              }}
              onClick={() => setExpandedDrug(isExpanded ? null : drug.id)}
            >
              {/* Collapsed row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--clr-ink)' }}>
                    {drug.generic}
                    <span style={{ fontSize: 12, color: 'var(--clr-ink-soft)', marginLeft: 6, fontFamily: 'var(--vmx-mono)' }}>
                      {drug.species === 'dog' ? '🐕' : drug.species === 'cat' ? '🐈' : '🐕🐈'}
                    </span>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--clr-ink-soft)', marginTop: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {drug.brand} · {drug.indication}
                  </div>
                </div>
                <div style={{ fontSize: 13, fontFamily: 'var(--vmx-mono)', color: 'var(--clr-ink-soft)', whiteSpace: 'nowrap', textAlign: 'right', fontWeight: 600 }}>
                  {drug.doseLo}{drug.doseLo !== drug.doseHi ? `-${drug.doseHi}` : ''} {drug.unit}<br />
                  <span style={{ fontSize: 11, fontWeight: 400 }}>{drug.route} · {drug.freq}</span>
                </div>
              </div>

              {/* Expanded card */}
              {isExpanded && (
                <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--clr-border)' }}>
                  <div style={{ fontSize: 13, color: 'var(--clr-ink-soft)', marginBottom: 12, lineHeight: 1.6 }}>
                    <strong>ข้อบ่งใช้:</strong> {drug.indication}<br />
                    <strong>Route:</strong> {drug.route} · <strong>Frequency:</strong> {drug.freq}<br />
                    <strong>Brands:</strong> {drug.brand}
                  </div>

                  {/* Dose calculation */}
                  {(hasW || !perKg) ? (
                    <>
                    <Result
                      label={!perKg
                        ? 'Dose ต่อตัว (ไม่คูณน้ำหนัก)'
                        : (sameDose ? `Dose สำหรับ ${w} kg` : `Dose สำหรับ ${w} kg (${drug.doseLo}-${drug.doseHi} ${drug.unit})`)}
                      value={sameDose ? fmt(doseLo, ` ${outUnit}`) : `${fmt(doseLo)}-${fmt(doseHi)} ${outUnit}`}
                      accent
                    />
                    {dd.cappedFor && (
                      <div style={{ fontSize: 12, marginTop: 6, color: 'var(--clr-rose-text)', fontWeight: 600 }}>
                        ⚠️ จำกัดที่ {dd.cap} {drug.unit} สำหรับ{dd.cappedFor === 'cat' ? 'แมว' : 'สุนัข'} — ช่วงยาเต็มคือ {drug.doseLo}-{drug.doseHi} {drug.unit}
                      </div>
                    )}
                    </>
                  ) : (
                    <div style={{ fontSize: 12, color: 'var(--clr-ink-soft)', padding: '12px 0', textAlign: 'center', background: 'var(--clr-surface)', borderRadius: '8px', border: '1px dashed var(--clr-border)' }}>
                      ใส่น้ำหนักด้านบนเพื่อคำนวณ dose
                    </div>
                  )}

                  {drug.note && (
                    <Note>{drug.note}</Note>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <Note>
        💊 Drug database รวบรวมจาก Plumb's Veterinary Drug Handbook, BSAVA Small Animal
        Formulary, MSD และ FECAVA/WSAVA guidelines. Dose เป็น reference range — ตรวจสอบ
        กับ prescribing information + patient factors ก่อนใช้จริงเสมอ.
        <br />
        ⚠️ อ่านหมายเหตุของแต่ละยา — มีคำเตือนเฉพาะ (species-specific, breed sensitivity,
        organ impairment, drug interactions).
      </Note>
    </div>
  );
}

// ── Reusable mini form parts ───────────────────────────────────
function Field({ label, value, onChange, placeholder, type = 'text', suffix }) {
  return (
    <div className="vmx-vetcalc-field-group">
      <label className="vmx-vetcalc-field-label">
        {label}
      </label>
      <div className="vmx-vetcalc-field-input-wrap">
        <input
          type={type}
          inputMode={type === 'number' ? 'decimal' : undefined}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          aria-label={label}
          className="vmx-vetcalc-field-input"
        />
        {suffix && <span className="vmx-vetcalc-field-suffix">{suffix}</span>}
      </div>
    </div>
  );
}

function Result({ label, value, accent }) {
  return (
    <div className={`vmx-vetcalc-result ${accent ? 'accent' : ''}`}>
      <span className="vmx-vetcalc-result-label">{label}</span>
      <span className="vmx-vetcalc-result-value">{value}</span>
    </div>
  );
}

function Note({ children }) {
  return (
    <div className="vmx-vetcalc-note">
      {children}
    </div>
  );
}

function ChipRow({ label, options, value, onChange }) {
  return (
    <div style={{ marginBottom: 16 }} role="group" aria-label={label}>
      <div className="vmx-vetcalc-field-label">
        {label}
      </div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {options.map((o) => (
          <button
            key={o.id}
            onClick={() => onChange(o.id)}
            className={`vmx-vetcalc-tab-btn ${value === o.id ? 'active' : ''}`}
            type="button"
            aria-pressed={value === o.id}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────
// `showFab` (default true) controls whether this component renders
// its own floating button. Set to `false` when an external unified
// tools FAB drives opening — the parent dispatches a window event
// `vmx-open-vetcalc` to trigger the modal.
export default function VetCalculator({ showFab = true } = {}) {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('rer');
  const dialogRef = useModalFocus({ active: open, onClose: () => setOpen(false) });

  // External open trigger — lets a unified ToolsFAB (or any other
  // surface) open the calculator without depending on this component's
  // internal FAB or React state lifting. Listener stays light-weight
  // and idempotent.
  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener('vmx-open-vetcalc', onOpen);
    return () => window.removeEventListener('vmx-open-vetcalc', onOpen);
  }, []);

  return (
    <>
      {/* Floating button — fixed bottom-right. Hidden on print so the
          icon doesn't appear on printed quizzes/notes. Suppressed when
          an external ToolsFAB owns the launching surface. */}
      {showFab && (
      <button
        onClick={() => setOpen(true)}
        title="เครื่องคิดเลขสำหรับสัตวแพทย์ (RER, Fluid, Dose, Transfusion, DKA)"
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
      )}

      {open && (
        <div className="vmx-modal-overlay" onClick={() => setOpen(false)} style={{ backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)' }}>
          <div
            ref={dialogRef}
            className="vmx-vetcalc-modal"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="vmx-vetcalc-title"
            tabIndex={-1}
            data-vmx-modal="true"
          >
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 12, fontFamily: 'var(--vmx-mono)', color: 'var(--clr-ink-soft)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
                Vet Calculator
              </div>
              <h2 id="vmx-vetcalc-title" style={{ margin: '6px 0 0', fontSize: 26, fontFamily: 'Fraunces, serif', fontWeight: 800 }}>คำนวณคลินิก</h2>
              <p style={{ fontSize: 13, color: 'var(--clr-ink-soft)', margin: '6px 0 0', lineHeight: 1.5 }}>
                สูตรพื้นฐานที่นิสิต/สัตวแพทย์ใช้บ่อย, ทุกผลลัพธ์มีสูตรกำกับให้ตรวจมือซ้ำได้
              </p>
            </div>

            {/* Tab row */}
            <div className="vmx-vetcalc-tabs">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={`vmx-vetcalc-tab-btn ${activeTab === t.id ? 'active' : ''}`}
                  type="button"
                >
                  {t.icon} {t.label}
                </button>
              ))}
            </div>

            {/* Active tab body */}
            <div style={{ minHeight: 200 }}>
              {activeTab === 'rer'         && <RERTab />}
              {activeTab === 'fluid'       && <FluidTab />}
              {activeTab === 'drug'        && <DrugTab />}
              {activeTab === 'cri'         && <CRITab />}
              {activeTab === 'transfusion' && <TransfusionTab />}
              {activeTab === 'dka'         && <DKATab />}
              {activeTab === 'bsa'         && <BSATab />}
              {activeTab === 'convert'     && <ConvertTab />}
              {activeTab === 'drugdb'      && <DrugDBTab />}
            </div>

            <div className="vmx-btn-row" style={{ marginTop: 24, paddingTop: 16, borderTop: '1px dashed var(--clr-border)' }}>
              <button className="vmx-btn vmx-btn-ghost" onClick={() => setOpen(false)} type="button" style={{ width: '100%', justifyContent: 'center' }}>
                ปิด (esc)
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
