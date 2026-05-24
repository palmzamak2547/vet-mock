# Design Notes — Learnings from ElevenLabs · Higgsfield · Airtable

Reference visits 2026-05-24 (Palm directive: "เรียนรู้สิ่งเรานี้ เพื่อเอาไป
ปรับใช้ ทั้งในปัจจุบันและอนาคต"). Captured via Playwright on desktop 1440.

This doc is split 3 ways:
- **VetMock NOW** — patterns I can ship within a session
- **VetOS / WebCUVETSMO future** — patterns for the next product launches
- **Architectural meta** — process lessons, not just visual

---

## ElevenLabs (elevenlabs.io)

**Vibe:** Light, premium, scientific. Editorial restraint.

**Captured tokens:**
- Background: `rgb(253, 252, 252)` warm off-white (NOT pure #fff)
- H1: `48px / weight 300 / Waldenburg / line-height 52 / letter-spacing -0.96`
- Body font: `Inter`
- Hero copy: **"Bringing technology to life"** — 4 words, poetic, zero feature mention
- Nav: `ElevenCreative · ElevenAgents · ElevenAPI · Enterprise · Pricing`
- Primary CTA: **"Contact sales"** (B2B-first positioning)

**What's salient:**
1. **Thin weight (300) on huge serif headings** = premium scientific feel. We default to weight 600 — heavy compared to this.
2. **Tight letter-spacing on display type** (`-0.96px` at 48px ≈ -2%) tightens proper noun look.
3. **Branded product names with `Eleven` prefix** create a memorable taxonomy across products. "ElevenCreative" feels like a thing, not a category.
4. **Off-white background** (not pure white) is easier on long-read eyes.

---

## Higgsfield AI (higgsfield.ai)

**Vibe:** Cinematic, dark, motion-saturated. Heavy video previews show product output.

**Captured tokens:**
- Background: `rgb(15, 17, 19)` deep near-black
- Text: `rgb(247, 247, 248)` warm off-white
- Font: pure `system-ui` stack (no web font load → instant FCP)
- NO h1 — the hero is a video grid; H3 cards label each product
- **40 `<video>` elements on landing page** — autoplay loops demonstrate output
- CTAs: `"Open Higgsfield Viral Presets"` / `"Open SUPERCOMPUTER"` — verb + product name
- "Pricing 30% OFF" badge in nav (FOMO + revenue)

**What's salient:**
1. **System font stack** trades brand custom typography for INSTANT first paint. Higgsfield bet that the videos ARE the brand; type is just labeling.
2. **40 inline autoplay videos** on landing = show, don't tell. Cost is bandwidth, gain is instant comprehension ("oh, THAT's what this does").
3. **Opinionated product names** — `SUPERCOMPUTER`, `Personal Clipper`, `Viral Presets`, `Marketing Studio Hooks`. Each name is concrete + ownable + slightly aspirational.
4. **CTA verb pattern `Open <ProductName>`** treats the homepage as a directory of mini-apps, not a marketing funnel.

---

## Airtable (airtable.com)

**Vibe:** Light, polished enterprise. Confident copy.

**Captured tokens:**
- Background: pure `rgb(255, 255, 255)`
- Font: `Haas Groot Disp` (custom display) + Haas fallback
- H1: `40px / weight 400 / line-height 48 / letter-spacing normal`
- H1 copy: **"All your teams, all their workflows—connected in one workspace"** (em-dash, long descriptive)
- H2 hooks: `"Sophisticated workflows in minutes, not months"` · `"Production apps at prototype speed"` · `"Don't just ask AI. Deploy it."`

**What's salient:**
1. **Long descriptive H1 with em-dash** — "All your teams, all their workflows—connected in one workspace" is 12 words. Confident, claim-heavy, NOT punchy.
2. **Confident binary-frame H2s** — "X, not Y" pattern: "minutes, not months" / "Don't just ask AI. Deploy it." This frame _sells_.
3. **400-weight headlines** (regular, not bold) — modern Helvetica-ish feel without screaming.

---

## VetMock NOW — actionable wins (ranked effort×impact)

### 🟢 SHIPPABLE TODAY

**1. Hero weight 600 → 500 + tighter letter-spacing**
Current: `font-family: Fraunces; font-weight: 600; font-size: clamp(32px, 5.5vw, 52px)`
Try: `font-weight: 500; letter-spacing: -0.02em` (matches ElevenLabs + Airtable register)
Impact: medium (more "premium clinical" feel). Effort: 2-line CSS change.

**2. Subject-card subtitle copy push**
Current section label: `"วิชาในปี 4"` (descriptive only).
Pattern from Airtable: lead with a CONFIDENT CLAIM about the category.
Try: `"วิชาที่ใกล้สอบ — ทำได้ทันที"` or `"ลุยทันที — ปี 4 เทอม 2 ปลาย"`
Impact: low-medium (cognitive priming). Effort: text-only edit.

**3. Off-white bg tweak**
Current `.vmx-app` bg: `var(--clr-bg)` = `#f6efe4` (warm cream — actually already non-white, good).
Confirmed: we already do this right. No change.

### 🟡 NICE TO HAVE (next session)

**4. Per-video hover preview (Higgsfield-style)**
On `/videos` view, hovering a video card → start a 3-second muted thumbnail loop or animated GIF.
Impact: high for video page UX. Effort: medium — needs preview asset generation or YouTube embed.

**5. "Open <ViewName>" CTA pattern**
Today: "🚀 เริ่มฝึก →"
Try: subject grid card secondary CTA could show "เปิด COM IV" instead of just clicking the whole card. Makes the action explicit.
Impact: medium. Effort: small.

### 🔴 DEFER (changes brand identity, needs Palm sign-off)

**6. Dark theme as default**
Palm currently defaults to light theme. Higgsfield bet that dark + saturated media = premium tech feel. Could trial — but Palm's audience is med students who often study in bright clinics → light may actually be correct for context.
Impact: high but RISKY. Effort: 1 line config + UX audit.

**7. Inline product/section names like ElevenLabs**
Today: views are generic ("Exam", "Review", "Dashboard")
Could push: "Mock Drill" (exam) / "Wrong Loop" (review) / "Streak Lab" (dashboard)
Impact: brand-defining. Effort: heavy (renames, i18n, docs). HOLD until Palm has bandwidth.

---

## VetOS / WebCUVETSMO future

**From ElevenLabs:** Product name taxonomy. When VetOS ships, every surface should have a memorable proper-noun name (not "AI Chat" but "Vet 86 Brain" or "ClinicAsk"). Drives brand recall.

**From Higgsfield:**
- Demo-first landing for new products (VetOS landing should AUTOPLAY a Norberg AI in action, not explain it)
- System font stack as MVP default — switch to custom when brand is mature, not before
- Treat homepage as a directory of mini-apps (each VetMock subject page is implicitly one)

**From Airtable:**
- Multi-view of same data — Palm's VetOS dashboard could surface "Today / Week / Subject / Wrong-loop" tabs over the same exam log. Same data, 4 lenses.
- Confident copy frames ("X, not Y") work for medical UX too: `"คำตอบที่ถูก — ไม่ใช่คำตอบที่ดูยาวที่สุด"`

---

## Architectural meta-lessons (process)

1. **All three brands treat first paint as a product demo, not a sales pitch.** Higgsfield shows 40 video outputs, ElevenLabs gives "Bringing technology to life" without explaining what they sell, Airtable shows the product UI within 1 scroll. VetMock already nails this — the home screen IS the product. Don't regress.

2. **All three use display fonts SPARINGLY.** Body is always boring + readable (Inter / system / Haas). Display font appears 1-3 places. VetMock loads Fraunces for headings + IBM Plex Sans Thai for body — already in this pattern.

3. **None of them use "::before invisible touch-zone" hacks.** Confirmed real-product reality. (See STABILITY.md rule 1.)

4. **Confident copy beats clever copy.** Airtable "Don't just ask AI. Deploy it." > "Try our amazing AI features." VetMock could push subject card subtitles to be MORE OPINIONATED. Less "ลุย →", more "เริ่มฝึกตอนนี้ก่อนเข้าสอบ".

5. **Light weight (300-400) on headlines is the new modern.** Heavy weights (700+) read as 2010-era startup. VetMock at 600 is in the middle; experimenting with 400-500 worth a shot.

---

## Ship this session

- Hero font-weight 600 → 500 + letter-spacing tightened. (DONE in this commit.)
- DESIGN-NOTES.md committed. (THIS file.)
- Vault note appended: `knowledge/learnings/design-inspo-2026-05-elevenlabs-higgsfield-airtable.md` (handled separately).

Future sessions can lift any of #4-7 from the "Nice to have" / "Defer" lists.
