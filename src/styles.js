export const STYLES = `
:root, [data-theme="light"] {
  --clr-bg: #f6efe4;
  --clr-surface: #fdf8ef;
  --clr-surface-2: #f0e6d2;
  --clr-ink: #2b2419;
  --clr-ink-soft: #5c4f3d;
  --clr-sage: #4a6b4a;
  --clr-sage-soft: #a8c0a8;
  --clr-rose: #c26d6d;
  --clr-rose-soft: #e8b8b8;
  --clr-gold: #b88940;
  --clr-gold-soft: #e8d4a8;
  --clr-ocean: #3d6b82;
  --clr-plum: #7d4a7d;
  --clr-border: #d8c9a8;
  --shadow-sm: 0 1px 2px rgba(43, 36, 25, 0.08);
  --shadow-md: 0 4px 12px rgba(43, 36, 25, 0.08), 0 2px 4px rgba(43, 36, 25, 0.05);
}

[data-theme="dark"] {
  --clr-bg: #1a1612;
  --clr-surface: #2b2419;
  --clr-surface-2: #3a3126;
  --clr-ink: #f0e6d2;
  --clr-ink-soft: #b8a890;
  --clr-sage: #7ba87b;
  --clr-sage-soft: #4a6b4a;
  --clr-rose: #d89090;
  --clr-rose-soft: #8b4f4f;
  --clr-gold: #d4a556;
  --clr-gold-soft: #8b6a30;
  --clr-ocean: #6b94a8;
  --clr-plum: #b07ab0;
  --clr-border: #524332;
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.3);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.4);
}

* { box-sizing: border-box; }

.vmx-app {
  font-family: 'IBM Plex Sans Thai', 'Fraunces', system-ui, sans-serif;
  color: var(--clr-ink);
  background: var(--clr-bg);
  min-height: 100vh;
  padding: 24px 16px 48px;
  background-image:
    radial-gradient(at 12% 8%, rgba(168, 192, 168, 0.15) 0px, transparent 50%),
    radial-gradient(at 88% 92%, rgba(232, 184, 184, 0.12) 0px, transparent 50%);
  transition: background 0.3s, color 0.3s;
}

.vmx-container { max-width: 820px; margin: 0 auto; }

.vmx-header {
  display: flex; justify-content: space-between; align-items: center;
  padding-bottom: 20px; margin-bottom: 28px;
  border-bottom: 1px dashed var(--clr-border);
  gap: 12px; flex-wrap: wrap;
}
.vmx-logo { font-family: 'Fraunces', serif; font-weight: 800; font-size: 22px; letter-spacing: -0.02em; cursor: pointer; }
.vmx-logo span { color: var(--clr-rose); font-style: italic; font-weight: 500; }
.vmx-header-right { display: flex; gap: 10px; align-items: center; }
.vmx-subtitle { font-size: 12px; color: var(--clr-ink-soft); letter-spacing: 0.08em; text-transform: uppercase; }
.vmx-streak { display: inline-flex; align-items: center; gap: 4px; padding: 6px 12px; background: var(--clr-surface); border: 1px solid var(--clr-border); border-radius: 999px; font-size: 13px; font-weight: 600; color: var(--clr-gold); }
.vmx-theme-btn { width: 36px; height: 36px; border-radius: 50%; border: 1px solid var(--clr-border); background: var(--clr-surface); cursor: pointer; font-size: 16px; display: flex; align-items: center; justify-content: center; transition: all 0.15s; color: var(--clr-ink); }
.vmx-theme-btn:hover { border-color: var(--clr-ink); }

.vmx-nav { display: flex; gap: 8px; margin-bottom: 20px; flex-wrap: wrap; }
.vmx-nav-btn { padding: 8px 14px; border-radius: 999px; border: 1px solid var(--clr-border); background: transparent; font-size: 12px; font-family: 'JetBrains Mono', monospace; color: var(--clr-ink-soft); cursor: pointer; transition: all 0.15s; }
.vmx-nav-btn:hover { border-color: var(--clr-ink); color: var(--clr-ink); }
.vmx-nav-btn.active { background: var(--clr-ink); color: var(--clr-bg); border-color: var(--clr-ink); }

.vmx-hero { margin-bottom: 40px; }
.vmx-hero h1 { font-family: 'Fraunces', serif; font-weight: 600; font-size: clamp(32px, 5.5vw, 52px); line-height: 0.95; letter-spacing: -0.03em; margin: 0 0 12px; color: var(--clr-ink); }
.vmx-hero h1 em { font-style: italic; color: var(--clr-sage); font-weight: 500; }
.vmx-hero p { font-size: 15px; color: var(--clr-ink-soft); max-width: 520px; line-height: 1.6; }

.vmx-section-label { font-size: 11px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: var(--clr-ink-soft); margin: 0 0 16px; display: flex; align-items: center; gap: 10px; }
.vmx-section-label::before, .vmx-section-label::after { content: ''; flex: 1; height: 1px; background: var(--clr-border); }

.vmx-mode-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 14px; margin-bottom: 40px; }
.vmx-mode-card { background: var(--clr-surface); border: 1px solid var(--clr-border); border-radius: 18px; padding: 24px; cursor: pointer; transition: all 0.2s; text-align: left; display: flex; flex-direction: column; gap: 10px; position: relative; overflow: hidden; color: var(--clr-ink); font-family: inherit; }
.vmx-mode-card:hover { transform: translateY(-3px); box-shadow: var(--shadow-md); border-color: var(--clr-ink); }
.vmx-mode-card .icon { font-size: 36px; line-height: 1; }
.vmx-mode-card .title { font-family: 'Fraunces', serif; font-weight: 600; font-size: 20px; letter-spacing: -0.015em; color: var(--clr-ink); }
.vmx-mode-card .sub { font-size: 13px; color: var(--clr-ink-soft); line-height: 1.5; }
.vmx-mode-card .badge { position: absolute; top: 12px; right: 12px; font-family: 'JetBrains Mono', monospace; font-size: 10px; padding: 3px 8px; border-radius: 999px; background: var(--clr-gold); color: var(--clr-surface); font-weight: 600; letter-spacing: 0.05em; }

.vmx-subject-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 14px; margin-bottom: 40px; }
.vmx-subject-card { background: var(--clr-surface); border: 1px solid var(--clr-border); border-radius: 16px; padding: 20px; cursor: pointer; transition: all 0.2s; text-align: left; display: flex; flex-direction: column; gap: 8px; position: relative; overflow: hidden; color: var(--clr-ink); font-family: inherit; }
.vmx-subject-card:hover { transform: translateY(-2px); box-shadow: var(--shadow-md); border-color: var(--clr-ink); }
.vmx-subject-card .icon { font-size: 28px; line-height: 1; }
.vmx-subject-card .title { font-family: 'Fraunces', serif; font-weight: 600; font-size: 18px; letter-spacing: -0.015em; color: var(--clr-ink); }
.vmx-subject-card .sub { font-size: 12px; color: var(--clr-ink-soft); font-style: italic; }
.vmx-subject-card .count { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: var(--clr-ink-soft); margin-top: 4px; }
.vmx-subject-card .accent { position: absolute; top: 0; right: 0; width: 6px; height: 100%; }

.vmx-config-panel { background: var(--clr-surface); border: 1px solid var(--clr-border); border-radius: 20px; padding: 28px; margin-bottom: 20px; }
.vmx-config-row { margin-bottom: 24px; }
.vmx-config-row:last-child { margin-bottom: 0; }
.vmx-label { font-size: 13px; font-weight: 600; margin-bottom: 10px; display: block; color: var(--clr-ink); }
.vmx-chip-row { display: flex; flex-wrap: wrap; gap: 8px; }
.vmx-chip { padding: 8px 16px; border: 1px solid var(--clr-border); background: var(--clr-bg); border-radius: 999px; cursor: pointer; font-size: 13px; font-family: 'JetBrains Mono', monospace; transition: all 0.15s; color: var(--clr-ink-soft); }
.vmx-chip:hover { border-color: var(--clr-ink); }
.vmx-chip.active { background: var(--clr-ink); color: var(--clr-bg); border-color: var(--clr-ink); }

.vmx-toggle-row { display: flex; gap: 10px; align-items: center; }
.vmx-toggle { position: relative; width: 44px; height: 24px; background: var(--clr-surface-2); border-radius: 999px; cursor: pointer; transition: background 0.2s; border: 1px solid var(--clr-border); }
.vmx-toggle.on { background: var(--clr-sage); border-color: var(--clr-sage); }
.vmx-toggle::after { content: ''; position: absolute; top: 2px; left: 2px; width: 18px; height: 18px; border-radius: 50%; background: var(--clr-surface); transition: all 0.2s; box-shadow: 0 1px 2px rgba(0,0,0,0.2); }
.vmx-toggle.on::after { left: 22px; }

.vmx-btn { padding: 14px 28px; border-radius: 999px; border: none; cursor: pointer; font-family: 'IBM Plex Sans Thai', sans-serif; font-size: 14px; font-weight: 600; transition: all 0.15s; display: inline-flex; align-items: center; gap: 8px; }
.vmx-btn-primary { background: var(--clr-ink); color: var(--clr-bg); }
.vmx-btn-primary:hover { transform: translateY(-1px); box-shadow: var(--shadow-md); }
.vmx-btn-primary:disabled { opacity: 0.4; cursor: not-allowed; }
.vmx-btn-ghost { background: transparent; color: var(--clr-ink); border: 1px solid var(--clr-border); }
.vmx-btn-ghost:hover { background: var(--clr-surface); border-color: var(--clr-ink); }
.vmx-btn-sm { padding: 8px 16px; font-size: 12px; }
.vmx-btn-row { display: flex; gap: 10px; justify-content: space-between; align-items: center; margin-top: 20px; flex-wrap: wrap; }

.vmx-exam-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.vmx-progress { font-family: 'JetBrains Mono', monospace; font-size: 13px; color: var(--clr-ink-soft); }
.vmx-progress strong { color: var(--clr-ink); font-size: 16px; }
.vmx-timer { font-family: 'JetBrains Mono', monospace; font-size: 16px; font-weight: 600; padding: 6px 14px; border-radius: 999px; background: var(--clr-surface); border: 1px solid var(--clr-border); color: var(--clr-ink); }
.vmx-timer.warn { background: var(--clr-rose); color: var(--clr-surface); border-color: var(--clr-rose); animation: pulse 1s infinite; }
@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.7; } }
.vmx-progress-bar { height: 3px; background: var(--clr-surface-2); border-radius: 999px; overflow: hidden; margin-bottom: 28px; }
.vmx-progress-fill { height: 100%; background: var(--clr-ink); transition: width 0.3s; }

.vmx-question-card { background: var(--clr-surface); border: 1px solid var(--clr-border); border-radius: 20px; padding: 32px; margin-bottom: 20px; box-shadow: var(--shadow-sm); position: relative; }
.vmx-bookmark-btn { position: absolute; top: 20px; right: 20px; width: 36px; height: 36px; border-radius: 50%; border: 1px solid var(--clr-border); background: var(--clr-bg); cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 18px; transition: all 0.15s; color: var(--clr-ink); }
.vmx-bookmark-btn:hover { border-color: var(--clr-gold); }
.vmx-bookmark-btn.active { background: var(--clr-gold); border-color: var(--clr-gold); color: var(--clr-surface); }
.vmx-note-btn { position: absolute; top: 20px; right: 64px; width: 36px; height: 36px; border-radius: 50%; border: 1px solid var(--clr-border); background: var(--clr-bg); cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 16px; transition: all 0.15s; color: var(--clr-ink); }
.vmx-note-btn:hover { border-color: var(--clr-ocean); }
.vmx-note-btn.has-note { background: var(--clr-ocean); color: var(--clr-surface); border-color: var(--clr-ocean); }

.vmx-qtype-badge { display: inline-block; font-family: 'JetBrains Mono', monospace; font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase; padding: 3px 10px; border-radius: 999px; background: var(--clr-surface-2); color: var(--clr-ink-soft); margin-bottom: 16px; border: 1px solid var(--clr-border); }
.vmx-qtext { font-size: 17px; line-height: 1.55; margin-bottom: 24px; color: var(--clr-ink); }
.vmx-qimage { width: 100%; max-width: 400px; border-radius: 12px; border: 1px solid var(--clr-border); margin-bottom: 20px; display: block; }

.vmx-options { display: flex; flex-direction: column; gap: 10px; }
.vmx-option { display: flex; align-items: flex-start; gap: 12px; padding: 14px 16px; background: var(--clr-bg); border: 1px solid var(--clr-border); border-radius: 12px; cursor: pointer; transition: all 0.15s; text-align: left; color: var(--clr-ink); font-family: inherit; }
.vmx-option:hover { border-color: var(--clr-ink); background: var(--clr-surface-2); }
.vmx-option.selected { border-color: var(--clr-ink); background: var(--clr-ink); color: var(--clr-bg); }
.vmx-option-letter { width: 26px; height: 26px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-family: 'Fraunces', serif; font-weight: 600; font-size: 14px; background: var(--clr-surface); border: 1px solid var(--clr-border); flex-shrink: 0; color: var(--clr-ink); }
.vmx-option.selected .vmx-option-letter { background: var(--clr-surface); color: var(--clr-ink); border-color: var(--clr-surface); }
.vmx-option-text { font-size: 15px; line-height: 1.4; flex: 1; }

.vmx-tf-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.vmx-tf-btn { padding: 24px; border-radius: 16px; border: 1px solid var(--clr-border); background: var(--clr-bg); cursor: pointer; transition: all 0.15s; font-family: 'Fraunces', serif; font-weight: 600; font-size: 20px; color: var(--clr-ink); }
.vmx-tf-btn:hover { border-color: var(--clr-ink); }
.vmx-tf-btn.selected-true { background: var(--clr-sage); color: var(--clr-surface); border-color: var(--clr-sage); }
.vmx-tf-btn.selected-false { background: var(--clr-rose); color: var(--clr-surface); border-color: var(--clr-rose); }

.vmx-fill-row { display: flex; flex-direction: column; gap: 12px; }
.vmx-fill-label { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: var(--clr-ink-soft); margin-bottom: 4px; }
.vmx-fill-input { width: 100%; padding: 12px 16px; border-radius: 10px; border: 1px solid var(--clr-border); background: var(--clr-bg); font-family: 'IBM Plex Sans Thai', sans-serif; font-size: 15px; transition: all 0.15s; color: var(--clr-ink); }
.vmx-fill-input:focus { outline: none; border-color: var(--clr-ink); background: var(--clr-surface); }

.vmx-match-row { display: flex; flex-direction: column; gap: 12px; }
.vmx-match-item { display: flex; gap: 12px; align-items: center; padding: 12px; background: var(--clr-bg); border-radius: 10px; border: 1px solid var(--clr-border); flex-wrap: wrap; }
.vmx-match-left { font-size: 14px; flex: 1; color: var(--clr-ink-soft); min-width: 140px; }
.vmx-match-select { padding: 8px 12px; border-radius: 8px; border: 1px solid var(--clr-border); background: var(--clr-surface); font-family: 'IBM Plex Sans Thai', sans-serif; font-size: 14px; cursor: pointer; min-width: 160px; color: var(--clr-ink); }

.vmx-note-panel { background: var(--clr-surface-2); border: 1px solid var(--clr-border); border-radius: 12px; padding: 14px; margin-bottom: 16px; }
.vmx-note-textarea { width: 100%; min-height: 80px; padding: 10px; border-radius: 8px; border: 1px solid var(--clr-border); background: var(--clr-surface); font-family: inherit; font-size: 14px; resize: vertical; color: var(--clr-ink); }

.vmx-results-hero { text-align: center; padding: 40px 20px; background: var(--clr-surface); border: 1px solid var(--clr-border); border-radius: 24px; margin-bottom: 24px; box-shadow: var(--shadow-md); }
.vmx-score-big { font-family: 'Fraunces', serif; font-weight: 800; font-size: 96px; line-height: 1; letter-spacing: -0.04em; margin: 0; color: var(--clr-ink); }
.vmx-score-big.pass { color: var(--clr-sage); }
.vmx-score-big.fail { color: var(--clr-rose); }
.vmx-score-label { font-family: 'JetBrains Mono', monospace; font-size: 12px; letter-spacing: 0.15em; text-transform: uppercase; color: var(--clr-ink-soft); margin: 8px 0 20px; }
.vmx-score-frac { font-size: 22px; font-weight: 600; color: var(--clr-ink); }
.vmx-score-msg { font-family: 'Fraunces', serif; font-style: italic; font-size: 20px; color: var(--clr-ink-soft); margin-top: 16px; }

.vmx-stat-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 12px; margin-bottom: 24px; }
.vmx-stat-card { background: var(--clr-surface); border: 1px solid var(--clr-border); border-radius: 14px; padding: 16px; text-align: center; }
.vmx-stat-num { font-family: 'Fraunces', serif; font-weight: 600; font-size: 32px; line-height: 1; color: var(--clr-ink); }
.vmx-stat-lbl { font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--clr-ink-soft); margin-top: 6px; }

.vmx-review-item { background: var(--clr-surface); border: 1px solid var(--clr-border); border-radius: 16px; padding: 20px; margin-bottom: 12px; }
.vmx-review-item.correct { border-left: 4px solid var(--clr-sage); }
.vmx-review-item.wrong { border-left: 4px solid var(--clr-rose); }
.vmx-review-item.skipped { border-left: 4px solid var(--clr-gold); background: var(--clr-surface-2); }
.vmx-review-head { display: flex; justify-content: space-between; gap: 12px; margin-bottom: 10px; font-family: 'JetBrains Mono', monospace; font-size: 11px; color: var(--clr-ink-soft); letter-spacing: 0.08em; text-transform: uppercase; flex-wrap: wrap; }
.vmx-review-result { font-weight: 700; }
.vmx-review-result.ok { color: var(--clr-sage); }
.vmx-review-result.no { color: var(--clr-rose); }
.vmx-review-q { font-size: 15px; line-height: 1.5; margin-bottom: 12px; color: var(--clr-ink); }
.vmx-review-ans { padding: 10px 14px; border-radius: 10px; margin-bottom: 8px; font-size: 13px; background: var(--clr-bg); color: var(--clr-ink); }
.vmx-review-ans .k { font-family: 'JetBrains Mono', monospace; font-size: 10px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--clr-ink-soft); margin-right: 8px; }
.vmx-review-ans.correct-ans { background: rgba(74, 107, 74, 0.1); border: 1px solid rgba(74, 107, 74, 0.2); }
.vmx-review-explain { margin-top: 10px; padding: 12px; border-radius: 10px; background: var(--clr-surface-2); font-size: 13px; line-height: 1.5; color: var(--clr-ink-soft); border-left: 3px solid var(--clr-gold); }
.vmx-review-explain .k { font-family: 'Fraunces', serif; font-style: italic; font-weight: 600; color: var(--clr-gold); margin-right: 8px; }

.vmx-dash-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 14px; margin-bottom: 24px; }
.vmx-dash-card { background: var(--clr-surface); border: 1px solid var(--clr-border); border-radius: 16px; padding: 20px; }
.vmx-dash-card h3 { font-family: 'Fraunces', serif; font-size: 18px; margin: 0 0 14px; font-weight: 600; letter-spacing: -0.01em; color: var(--clr-ink); }
.vmx-bar { height: 8px; background: var(--clr-surface-2); border-radius: 999px; overflow: hidden; margin: 4px 0 12px; }
.vmx-bar-fill { height: 100%; background: var(--clr-sage); border-radius: 999px; transition: width 0.4s; }
.vmx-bar-fill.mid { background: var(--clr-gold); }
.vmx-bar-fill.low { background: var(--clr-rose); }
.vmx-subj-row { display: flex; justify-content: space-between; margin-bottom: 4px; font-size: 13px; align-items: center; color: var(--clr-ink); }
.vmx-subj-row .pct { font-family: 'JetBrains Mono', monospace; color: var(--clr-ink-soft); }
.vmx-tag-pill { display: inline-block; padding: 4px 10px; border-radius: 999px; background: var(--clr-surface-2); border: 1px solid var(--clr-border); font-size: 11px; font-family: 'JetBrains Mono', monospace; color: var(--clr-ink-soft); margin: 3px; }
.vmx-tag-pill.weak { background: var(--clr-rose-soft); border-color: var(--clr-rose); color: var(--clr-ink); }
.vmx-empty { text-align: center; padding: 40px 20px; color: var(--clr-ink-soft); font-style: italic; }

.vmx-sr-grade { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-top: 16px; }
.vmx-sr-btn { padding: 14px 8px; border-radius: 12px; border: 1px solid var(--clr-border); background: var(--clr-surface); cursor: pointer; font-family: inherit; transition: all 0.15s; text-align: center; color: var(--clr-ink); }
.vmx-sr-btn:hover { transform: translateY(-2px); box-shadow: var(--shadow-md); }
.vmx-sr-btn .label { font-family: 'Fraunces', serif; font-weight: 600; font-size: 16px; margin-bottom: 4px; }
.vmx-sr-btn .sub { font-family: 'JetBrains Mono', monospace; font-size: 10px; color: var(--clr-ink-soft); letter-spacing: 0.05em; }
.vmx-sr-btn.again { border-color: var(--clr-rose); }
.vmx-sr-btn.again .label { color: var(--clr-rose); }
.vmx-sr-btn.hard { border-color: var(--clr-gold); }
.vmx-sr-btn.hard .label { color: var(--clr-gold); }
.vmx-sr-btn.good { border-color: var(--clr-sage); }
.vmx-sr-btn.good .label { color: var(--clr-sage); }
.vmx-sr-btn.easy { border-color: var(--clr-ocean); }
.vmx-sr-btn.easy .label { color: var(--clr-ocean); }

.vmx-flashcard { background: var(--clr-surface); border: 1px solid var(--clr-border); border-radius: 20px; padding: 40px; min-height: 300px; text-align: center; margin-bottom: 16px; box-shadow: var(--shadow-sm); display: flex; flex-direction: column; justify-content: center; }
.vmx-flashcard .front { font-size: 20px; line-height: 1.5; color: var(--clr-ink); }
.vmx-flashcard .back { font-size: 17px; line-height: 1.5; color: var(--clr-ink); border-top: 1px dashed var(--clr-border); padding-top: 20px; margin-top: 20px; }
.vmx-flashcard .back .answer { font-family: 'Fraunces', serif; font-weight: 600; font-size: 22px; color: var(--clr-sage); margin-bottom: 12px; }

.vmx-form-group { margin-bottom: 16px; }
.vmx-form-group label { display: block; font-size: 13px; font-weight: 600; margin-bottom: 6px; color: var(--clr-ink); }
.vmx-form-group input, .vmx-form-group textarea, .vmx-form-group select { width: 100%; padding: 10px 14px; border-radius: 10px; border: 1px solid var(--clr-border); background: var(--clr-bg); font-family: inherit; font-size: 14px; color: var(--clr-ink); }
.vmx-form-group input:focus, .vmx-form-group textarea:focus { outline: none; border-color: var(--clr-ink); background: var(--clr-surface); }
.vmx-form-group textarea { min-height: 80px; resize: vertical; }

.vmx-modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 20px; }
.vmx-modal { background: var(--clr-surface); border-radius: 20px; padding: 28px; max-width: 500px; width: 100%; max-height: 90vh; overflow-y: auto; }
.vmx-modal h2 { font-family: 'Fraunces', serif; margin: 0 0 16px; font-size: 24px; color: var(--clr-ink); }

.vmx-footer { margin-top: 48px; padding-top: 20px; border-top: 1px dashed var(--clr-border); text-align: center; font-size: 12px; color: var(--clr-ink-soft); font-style: italic; }

.vmx-kbd { display: inline-block; padding: 2px 6px; border-radius: 4px; background: var(--clr-surface-2); border: 1px solid var(--clr-border); font-family: 'JetBrains Mono', monospace; font-size: 11px; color: var(--clr-ink-soft); }

@media (max-width: 640px) {
  .vmx-btn-row { flex-direction: column-reverse; gap: 10px; }
  .vmx-btn-row .vmx-btn { width: 100%; justify-content: center; }
  .vmx-subject-grid, .vmx-mode-grid { grid-template-columns: 1fr; }
  .vmx-tf-row { grid-template-columns: 1fr; }
  .vmx-question-card { padding: 24px 20px; }
  .vmx-bookmark-btn { top: 14px; right: 14px; }
  .vmx-note-btn { top: 14px; right: 58px; }
  .vmx-sr-grade { grid-template-columns: repeat(2, 1fr); }
}
`;
