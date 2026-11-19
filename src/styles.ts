/**
 * ---------------------------------------------------------------------------
 * All in One Accessibility - styles
 * ---------------------------------------------------------------------------
 * The reference app's assets/css/*.css (tokens, base, components, banners,
 * settings, tabs, paid, score, responsive), scoped to the plugin root
 * (.aioa-root) so nothing leaks into Sanity Studio:
 *   - the color tokens live on .aioa-root instead of :root, and the dark theme
 *     on .aioa-root[data-theme="dark"] (the tool always sets data-theme)
 *   - element rules (reset, headings, links, inputs) are prefixed with
 *     :where(.aioa-root), which keeps their original specificity
 *   - #site-text, #save-area and #mobile-position-body became classes
 */

export const AIOA_CSS = `
/* ===== tokens.css ===== */

.aioa-root {
  /* Brand */
  --brand: #420083;
  --widget-color: #420083;      /* chosen widget color, set by assets/js/settings-form.js */

  /* Surfaces and text */
  --bg: #f4f4f6;
  --surface: #ffffff;
  --surface-2: #f7f7f9;         /* light fill: sub panels, field add-ons */
  --border: #dcdce2;
  --border-strong: #b9b9c3;
  --text: #1f1f24;
  --muted: #5f5f6b;
  --link: #420083;

  /* Selection and focus */
  --accent: #420083;
  --accent-soft: #f3eefa;
  --focus: #6d28d9;

  /* Primary button */
  --btn-primary: #420083;
  --btn-primary-hover: #33006a;

  /* Status */
  --success: #15803d;
  --success-soft: #e8f5ec;
  --warning: #b45309;
  --warning-soft: #fdf3e2;
  --danger: #b42318;

  /* Shape: one radius for blocks, a smaller one for things inside them */
  --radius: 10px;               /* cards, notices, save bar, toasts */
  --radius-sm: 7px;             /* buttons, inputs, options */

  /* Height of buttons, inputs and the color swatch */
  --control-h: 42px;
  --shadow: 0 1px 2px rgba(0, 0, 0, .05);

  /* White check mark: selected icon badge, upgrade banner list */
  --check-white: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23fff' stroke-width='3.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M5 12.5l4.5 4.5L19 7.5'/%3E%3C/svg%3E");

  color-scheme: light;
}

.aioa-root[data-theme="dark"] {
  --bg: #141417;
  --surface: #1d1d21;
  --surface-2: #26262b;
  --border: #34343b;
  --border-strong: #4c4c55;
  --text: #ececf1;
  --muted: #a3a3ae;
  --link: #c4a8ff;
  --accent: #a78bfa;
  --accent-soft: rgba(167, 139, 250, .12);
  --focus: #c4a8ff;
  --btn-primary: #6d28d9;
  --btn-primary-hover: #5b21b6;
  --success: #4ade80;
  --success-soft: rgba(74, 222, 128, .12);
  --warning: #fbbf24;
  --warning-soft: rgba(251, 191, 36, .12);
  --danger: #f87171;
  --shadow: none;
  color-scheme: dark;
}


/* ===== base.css ===== */

/* ---------- Reset ---------- */

.aioa-root, :where(.aioa-root) *, :where(.aioa-root) *::before, :where(.aioa-root) *::after { box-sizing: border-box; }
:where(.aioa-root) [hidden] { display: none !important; }

.aioa-root {
  /* The tool fills the Studio pane and scrolls itself, so the save bar and lock card can stick */
  height: 100%;
  overflow-y: auto;
  margin: 0;
  font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  font-size: 15px;
  line-height: 1.5;
  color: var(--text);
  background: var(--bg);
  -webkit-font-smoothing: antialiased;
}

:where(.aioa-root) :is(h1, h2, h3, p) { margin: 0; }
:where(.aioa-root) a { color: var(--link); }
:where(.aioa-root) :is(button, input, select) { font: inherit; color: inherit; }
:where(.aioa-root) :focus-visible { outline: 2px solid var(--focus); outline-offset: 2px; }

/* Hidden on screen, still read by screen readers */
.visually-hidden {
  position: absolute !important; width: 1px; height: 1px; padding: 0; margin: -1px;
  overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0;
}

/* ---------- Page ---------- */

.aioa-page { max-width: 900px; margin: 0 auto; padding: 24px 20px 44px; }

/* ---------- Header ---------- */

.aioa-header {
  display: flex; align-items: center; justify-content: space-between; gap: 16px;
  margin-bottom: 22px; padding-bottom: 18px; border-bottom: 1px solid var(--border);
}
.aioa-brand { display: flex; align-items: center; gap: 12px; min-width: 0; }
.aioa-logo { width: 48px; height: 48px; flex-shrink: 0; }
.aioa-logo-circle { fill: var(--brand); } /* official logo purple in both themes */
.aioa-brand h1 { font-size: 22px; font-weight: 800; letter-spacing: -.01em; line-height: 1.2; }
.aioa-brand h1 sup { font-size: .55em; font-weight: 700; }
.aioa-brand p { font-size: 13.5px; color: var(--muted); }

/* Theme toggle: moon in light mode, sun in dark mode */
.aioa-theme-toggle .i-sun { display: none; }
.aioa-theme-toggle[data-mode="dark"] .i-sun { display: block; }
.aioa-theme-toggle[data-mode="dark"] .i-moon { display: none; }

/* ===== components.css ===== */

/* ---------- Buttons ---------- */

.aioa-btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 8px;
  min-height: var(--control-h); padding: 0 18px; border-radius: var(--radius-sm);
  border: 1px solid var(--border-strong); background: var(--surface); color: var(--text);
  font-weight: 600; text-decoration: none; white-space: nowrap; cursor: pointer;
}
.aioa-btn:hover { background: var(--surface-2); }
.aioa-btn-primary { border-color: var(--btn-primary); background: var(--btn-primary); color: #fff; }
.aioa-btn-primary:hover { border-color: var(--btn-primary-hover); background: var(--btn-primary-hover); }
.aioa-btn[disabled] { opacity: .7; cursor: progress; }

/* Square button with only an icon (theme toggle) */
.aioa-btn-icon { width: var(--control-h); padding: 0; }
.aioa-btn-icon svg { width: 20px; height: 20px; }

/* Spinner shown in busy buttons and while loading */
.aioa-spinner {
  width: 18px; height: 18px; flex-shrink: 0; border-radius: 50%;
  border: 2px solid currentColor; border-right-color: transparent; animation: aioa-spin .7s linear infinite;
}
@keyframes aioa-spin { to { transform: rotate(360deg); } }

/* ---------- Cards ---------- */

.aioa-card {
  min-width: 0; padding: 22px; border-radius: var(--radius);
  background: var(--surface); border: 1px solid var(--border); box-shadow: var(--shadow);
}
.aioa-card h2 { font-size: 17px; font-weight: 700; }
.aioa-desc { margin: 2px 0 18px; font-size: 14px; color: var(--muted); }

/* ---------- Form fields ---------- */

.aioa-fieldset { min-width: 0; margin: 0; padding: 0; border: 0; }
.aioa-label { font-weight: 600; }
.aioa-hint { margin-top: 7px; font-size: 13.5px; color: var(--muted); }
.aioa-error { margin-top: 7px; font-size: 13.5px; color: var(--danger); }

.aioa-select {
  width: 100%; height: var(--control-h); padding: 0 12px; border-radius: var(--radius-sm);
  border: 1px solid var(--border-strong); background: var(--surface); color: var(--text);
}
.aioa-select:focus { outline: none; border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-soft); }

/* Input with a fixed text before or after it ("#", "https://", "px") */
.aioa-affix {
  display: flex; height: var(--control-h); overflow: hidden; border-radius: var(--radius-sm);
  border: 1px solid var(--border-strong); background: var(--surface);
}
.aioa-affix:focus-within { border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-soft); }
.aioa-affix.is-invalid { border-color: var(--danger); }
.aioa-affix input { flex: 1; min-width: 0; padding: 0 12px; border: 0; background: transparent; outline: none; }
.aioa-affix-text { display: grid; place-items: center; padding: 0 12px; background: var(--surface-2); color: var(--muted); }
.aioa-affix-text:first-child { border-right: 1px solid var(--border); }
.aioa-affix-text:last-child { border-left: 1px solid var(--border); }

/* Native checkboxes and radios in the brand color */
:where(.aioa-root) :is(input[type="checkbox"], input[type="radio"]) { width: 18px; height: 18px; margin: 0; flex-shrink: 0; accent-color: var(--accent); }
.aioa-check { display: inline-flex; align-items: center; gap: 10px; margin-bottom: 16px; cursor: pointer; }

/* ---------- Loading / error ---------- */

.aioa-loading { display: flex; align-items: center; justify-content: center; gap: 12px; padding: 88px 0; color: var(--muted); }
.aioa-error-card { display: grid; justify-items: center; gap: 9px; padding: 44px 22px; text-align: center; }
.aioa-error-card p { color: var(--muted); }

/* ---------- Toasts ---------- */

.aioa-toasts { position: fixed; top: 16px; left: 16px; right: 16px; z-index: 100; display: grid; justify-items: end; gap: 9px; pointer-events: none; }
.aioa-toast {
  pointer-events: auto; display: flex; align-items: flex-start; gap: 11px; width: 100%; max-width: 370px; padding: 14px;
  border-radius: var(--radius); background: var(--surface); border: 1px solid var(--border); box-shadow: 0 8px 24px rgba(0, 0, 0, .12);
}
.aioa-toast.is-leaving { opacity: 0; transition: opacity .2s ease; }
.aioa-toast-ic { width: 24px; height: 24px; flex-shrink: 0; display: grid; place-items: center; border-radius: 50%; color: #fff; }
.aioa-toast-ic svg { width: 14px; height: 14px; }
.aioa-toast.is-success .aioa-toast-ic { background: #16a34a; }
.aioa-toast.is-error .aioa-toast-ic { background: #dc2626; }
.aioa-toast-body { flex: 1; min-width: 0; }
.aioa-toast-body strong { display: block; font-weight: 600; }
.aioa-toast-body p { font-size: 13.5px; color: var(--muted); }
.aioa-toast-body a { display: inline-block; margin-top: 4px; font-size: 13.5px; font-weight: 600; }
.aioa-toast-close { width: 26px; height: 26px; flex-shrink: 0; display: grid; place-items: center; padding: 0; border: 0; border-radius: 5px; background: none; color: var(--muted); cursor: pointer; }
.aioa-toast-close:hover { background: var(--surface-2); color: var(--text); }
.aioa-toast-close svg { width: 15px; height: 15px; }

/* ===== banners.css ===== */

/* ---------- Notice ---------- */

.aioa-notice {
  display: flex; align-items: center; flex-wrap: wrap; gap: 14px 24px; padding: 20px 22px;
  border-radius: var(--radius); background: var(--surface); border: 1px solid var(--border); box-shadow: var(--shadow);
}
.aioa-notice-body { flex: 1; min-width: 240px; }
.aioa-notice h2 { margin: 7px 0 3px; font-size: 18px; font-weight: 700; }
.aioa-notice-body p:last-child { color: var(--muted); }
.aioa-notice-action { display: flex; flex-direction: column; align-items: center; gap: 5px; }

/* Small status label: "Paid plan active" */
.aioa-tag {
  display: inline-block; padding: 2px 9px; border-radius: 5px;
  font-size: 12.5px; font-weight: 600; background: var(--accent-soft); color: var(--accent);
}
.aioa-tag.is-success { background: var(--success-soft); color: var(--success); }

/* ---------- Upgrade banner (free plan) ---------- */

/* Solid brand purple (no gradient or glows) with a faded figure in the corner */
.aioa-upgrade {
  position: relative; overflow: hidden; isolation: isolate; padding: 23px 26px 18px; border-radius: var(--radius); color: #fff;
  background: #420083;
}
.aioa-upgrade-watermark { position: absolute; right: -35px; top: -27px; z-index: -1; width: 205px; height: 205px; opacity: .08; pointer-events: none; }

.aioa-upgrade-head { display: flex; align-items: flex-start; justify-content: space-between; flex-wrap: wrap; gap: 18px 24px; }
.aioa-upgrade-intro { flex: 1; min-width: 240px; }
.aioa-upgrade-intro > p:not(.aioa-upgrade-tag) { color: #e6dbff; }
.aioa-upgrade-intro strong { color: #fff; }
.aioa-upgrade h2 { margin: 10px 0 3px; font-size: 23px; font-weight: 700; }

/* "Free plan active" label with a green dot */
.aioa-upgrade-tag {
  display: inline-flex; align-items: center; gap: 7px; padding: 2px 9px; border-radius: 5px;
  font-size: 12.5px; font-weight: 600; background: rgba(255, 255, 255, .14); color: #f0e8ff;
}
.aioa-upgrade-tag i { width: 7px; height: 7px; border-radius: 50%; background: #4ade80; }

/* 190+ languages / 12 profiles */
.aioa-upgrade-points { display: flex; flex-wrap: wrap; gap: 5px 20px; margin: 12px 0 0; padding: 0; list-style: none; font-weight: 600; }
.aioa-upgrade-points li { display: flex; align-items: center; gap: 7px; }
.aioa-upgrade-points li::before {
  content: ""; width: 18px; height: 18px; flex-shrink: 0; border-radius: 50%;
  background: rgba(255, 255, 255, .2) var(--check-white) center / 11px no-repeat;
}

.aioa-upgrade-cta { display: flex; flex-direction: column; align-items: center; gap: 7px; }
.aioa-upgrade-cta small { font-size: 12.5px; color: #dccbff; }
.aioa-btn-white {
  display: inline-flex; align-items: center; justify-content: center; gap: 9px; min-height: 44px; padding: 0 20px;
  border-radius: var(--radius-sm); background: #fff; color: #420083; font-weight: 700; text-decoration: none; white-space: nowrap;
}
.aioa-btn-white:hover { background: #f3eefa; }
.aioa-btn-white svg { width: 17px; height: 17px; }

.aioa-upgrade-note { margin-top: 16px; padding-top: 13px; border-top: 1px solid rgba(255, 255, 255, .16); font-size: 13.5px; color: #d3c1f3; }
.aioa-upgrade-note b { color: #fff; }

/* ---------- Site line ---------- */

/* Dot and text on one row; a long domain wraps inside the text */
.aioa-site { display: flex; align-items: flex-start; gap: 9px; margin: 14px 2px 0; color: var(--muted); }
.aioa-site strong { color: var(--text); font-weight: 600; word-break: break-all; }
.aioa-site-dot { width: 9px; height: 9px; flex-shrink: 0; margin-top: 7px; border-radius: 50%; background: var(--success); }
.aioa-site-text { min-width: 0; }

/* ===== settings.css ===== */

/* ---------- Layout ---------- */

.aioa-form { display: grid; gap: 18px; margin-top: 18px; }
.aioa-columns { display: grid; grid-template-columns: minmax(0, 1.3fr) minmax(0, 1fr); gap: 18px; }

/* Radio that is hidden but still focusable; its label shows the choice (icon options) */
.aioa-radio { position: absolute; width: 1px; height: 1px; margin: 0; opacity: 0; pointer-events: none; }

/* Bordered option with a visible native radio (widget size) */
.aioa-choice {
  display: flex; align-items: center; gap: 10px; padding: 12px 14px; cursor: pointer;
  border: 1px solid var(--border); border-radius: var(--radius-sm); background: var(--surface);
}
.aioa-choice:hover { border-color: var(--border-strong); }
.aioa-choice:has(input:checked) { border-color: var(--accent); background: var(--accent-soft); }

/* ---------- Widget color ---------- */

/* Title on the left, "Live preview" chip on the right */
.aioa-card-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; }
.aioa-live {
  display: flex; align-items: center; gap: 9px; flex-shrink: 0; padding: 5px 14px 5px 5px;
  border: 1px solid var(--border); border-radius: 999px; background: var(--surface-2);
}
.aioa-live-icon { width: 42px; height: 42px; display: grid; place-items: center; border-radius: 50%; background: var(--widget-color); }
.aioa-live-icon img { width: 28px; height: 28px; object-fit: contain; }
.aioa-live-text { font-size: 11.5px; font-weight: 600; line-height: 1.2; letter-spacing: .04em; text-transform: uppercase; color: var(--muted); }

.aioa-color-row { display: flex; align-items: center; gap: 10px; }
.aioa-swatch {
  width: var(--control-h); height: var(--control-h); flex-shrink: 0; padding: 3px; cursor: pointer;
  border: 1px solid var(--border-strong); border-radius: var(--radius-sm); background: var(--surface);
}
.aioa-swatch::-webkit-color-swatch-wrapper { padding: 0; }
.aioa-swatch::-webkit-color-swatch { border: 0; border-radius: 4px; }
.aioa-swatch::-moz-color-swatch { border: 0; border-radius: 4px; }
.aioa-hex { flex: 1; min-width: 0; max-width: 220px; }
.aioa-hex input { text-transform: uppercase; font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; }

/* Preset colors; the selected one gets a ring */
.aioa-presets { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 16px; }
.aioa-preset {
  width: 28px; height: 28px; padding: 0; border: 0; border-radius: 50%; cursor: pointer;
  background: var(--c); box-shadow: inset 0 0 0 1px rgba(128, 128, 128, .35);
}
.aioa-preset[aria-pressed="true"] { box-shadow: 0 0 0 2px var(--surface), 0 0 0 4px var(--c); }

/* ---------- Widget size ---------- */

.aioa-size-options { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
.aioa-size-choice { flex-direction: column; align-items: stretch; gap: 12px; padding: 14px; }
.aioa-choice-text { display: flex; align-items: center; gap: 9px; font-weight: 600; }

/* Outline of the open widget panel: same height, the oversize panel is wider (3 columns) */
.aioa-panel {
  align-self: center; display: flex; flex-direction: column; gap: 5px; height: 90px; padding-bottom: 5px;
  overflow: hidden; border: 1px solid var(--border-strong); border-radius: 5px; background: var(--surface);
}
.aioa-panel.is-regular { width: 58px; }
.aioa-panel.is-over { width: 84px; }
.aioa-panel-head { flex-shrink: 0; height: 12px; background: var(--widget-color); }
.aioa-panel-grid { display: grid; gap: 3px; padding: 0 5px; }
.is-regular .aioa-panel-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.is-over .aioa-panel-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
.aioa-panel-grid i { aspect-ratio: 1.2; border-radius: 2px; border: 1px solid var(--border); background: var(--surface-2); }

/* ---------- Widget position ---------- */

.aioa-pos-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 10px; }
.aioa-pos-option { position: relative; min-width: 0; }
.aioa-pos-label {
  display: flex; align-items: center; gap: 12px; height: 100%; min-height: 60px; padding: 9px 14px; cursor: pointer;
  border: 1px solid var(--border); border-radius: var(--radius-sm); background: var(--surface); font-weight: 600;
}
.aioa-pos-label:hover { border-color: var(--border-strong); }
.aioa-radio:checked + .aioa-pos-label { border-color: var(--accent); background: var(--accent-soft); color: var(--accent); }
.aioa-radio:focus-visible + .aioa-pos-label { outline: 2px solid var(--focus); outline-offset: 2px; }

/* Small screen with a dot where the icon goes (--gx / --gy: 0, .5 or 1) */
.aioa-glyph { position: relative; flex-shrink: 0; width: 28px; height: 20px; border: 1.5px solid currentColor; border-radius: 5px; opacity: .5; }
.aioa-glyph i {
  position: absolute; width: 7px; height: 7px; border-radius: 50%; background: currentColor;
  left: calc(2px + var(--gx) * (100% - 11px)); top: calc(2px + var(--gy) * (100% - 11px));
}
.aioa-radio:checked + .aioa-pos-label .aioa-glyph { opacity: 1; }

/* Center cell: mini website. "Your website" sits in its browser bar, so the
   icon below can move to any of the 8 positions without covering the text. */
.aioa-pos-center {
  position: relative; overflow: hidden; min-height: 60px; color: var(--muted);
  border: 1px solid var(--border-strong); border-radius: var(--radius-sm); background: var(--surface-2);
}
.aioa-mini-label {
  position: absolute; top: 0; left: 0; right: 0; height: 15px; overflow: hidden; white-space: nowrap;
  background: var(--border); font-size: 10.5px; line-height: 15px; text-align: center;
}
/* 24px button, 6px from the sides, between the browser bar (15px) and the bottom edge (4px gaps) */
.aioa-mini-widget {
  position: absolute; z-index: 1; display: grid; place-items: center; width: 24px; height: 24px; border-radius: 50%;
  background: var(--widget-color); box-shadow: 0 2px 4px rgba(0, 0, 0, .3);
  left: calc(6px + var(--gx) * (100% - 36px)); top: calc(19px + var(--gy) * (100% - 47px));
  transition: left .3s ease, top .3s ease;
}
.aioa-mini-widget img { display: block; width: 16px; height: 16px; object-fit: contain; }

/* Exact offsets / exact size */
.aioa-subpanel { display: grid; gap: 12px; padding: 16px; border-radius: var(--radius-sm); background: var(--surface-2); border: 1px solid var(--border); }
.aioa-subpanel .aioa-hint { margin-top: 0; }
.aioa-offset-row { display: grid; grid-template-columns: 105px 140px minmax(0, 175px); align-items: center; gap: 10px; }
.aioa-size-input { max-width: 170px; }

/* ---------- Icon type and icon size ---------- */

/* Each icon is shown as the real widget button: a circle in the widget color */
.aioa-icon-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(64px, 1fr)); gap: 12px; }
.aioa-icon-option { position: relative; }
.aioa-icon-label { display: grid; justify-items: center; gap: 7px; cursor: pointer; }
.aioa-icon { position: relative; display: grid; place-items: center; width: 60px; aspect-ratio: 1; border-radius: 50%; background: var(--widget-color); }
.aioa-icon img { width: 62%; height: 62%; object-fit: contain; pointer-events: none; }
.aioa-radio:checked + .aioa-icon-label .aioa-icon { box-shadow: 0 0 0 3px var(--surface), 0 0 0 5px var(--accent); }
/* Check badge on the selected icon so it is easy to spot */
.aioa-radio:checked + .aioa-icon-label .aioa-icon::after {
  content: ""; position: absolute; top: -6px; right: -6px; width: 21px; height: 21px; border-radius: 50%;
  background: var(--btn-primary) var(--check-white) center / 12px no-repeat; box-shadow: 0 0 0 2px var(--surface);
}
.aioa-radio:focus-visible + .aioa-icon-label .aioa-icon { outline: 2px solid var(--focus); outline-offset: 7px; }
.aioa-icon-caption { font-size: 13.5px; color: var(--muted); }
.aioa-radio:checked + .aioa-icon-label .aioa-icon-caption { color: var(--text); font-weight: 600; }

/* Icon size: each circle at its own diameter (--d, set in the icon-size partial), bottoms aligned */
.aioa-size-row { --scale: 1; display: flex; flex-wrap: wrap; align-items: flex-end; gap: 14px 22px; }
.aioa-size-row .aioa-icon { width: calc(var(--d) * var(--scale)); }

/* ---------- Save bar ---------- */

.aioa-savebar {
  position: sticky; bottom: 14px; z-index: 10; display: flex; align-items: center; justify-content: space-between; gap: 14px;
  padding: 12px 14px 12px 20px; border-radius: var(--radius); background: var(--surface); border: 1px solid var(--border);
  box-shadow: 0 4px 16px rgba(0, 0, 0, .08);
}
.aioa-save-state { display: flex; align-items: center; gap: 9px; font-weight: 500; color: var(--muted); }
.aioa-save-state i { width: 9px; height: 9px; flex-shrink: 0; border-radius: 50%; background: var(--success); }
.aioa-savebar.is-dirty .aioa-save-state { color: var(--text); }
.aioa-savebar.is-dirty .aioa-save-state i { background: #d97706; }

.aioa-after-note { font-size: 13.5px; color: var(--muted); text-align: center; }

/* ===== tabs.css ===== */

/* ---------- Tabs ---------- */

/* Three equal tabs in a white bar; the open tab is filled with the brand purple */
.aioa-tabs {
  display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 5px; margin-top: 22px; padding: 5px;
  border-radius: var(--radius); background: var(--surface); border: 1px solid var(--border); box-shadow: var(--shadow);
}
.aioa-tab {
  display: flex; align-items: center; justify-content: center; gap: 9px; min-width: 0; min-height: var(--control-h); padding: 6px 12px;
  border: 0; border-radius: var(--radius-sm); background: none; color: var(--muted); font-weight: 600; text-align: center; cursor: pointer;
}
.aioa-tab:hover { background: var(--surface-2); color: var(--text); }
.aioa-tab[aria-selected="true"] { background: var(--btn-primary); color: #fff; }

/* Small lock on the paid tabs while the plan is free */
.aioa-tab-lock { display: inline-grid; place-items: center; width: 20px; height: 20px; flex-shrink: 0; border-radius: 50%; background: var(--warning-soft); color: var(--warning); }
.aioa-tab-lock svg { width: 12px; height: 12px; }
.aioa-tab[aria-selected="true"] .aioa-tab-lock { background: rgba(255, 255, 255, .2); color: #fff; }

/* ---------- Panels ---------- */

.aioa-tabpanel, .aioa-stack { display: grid; gap: 18px; min-width: 0; }
.aioa-tabpanel:focus-visible { outline-offset: 6px; border-radius: var(--radius); }

/* Wrapper of the save bar (hidden on tabs with nothing to save, see tabs.js). No box of its own,
   so the bar stays sticky across the whole form. */
.aioa-save-area { display: contents; }

/* ---------- Free plan lock ---------- */

.aioa-lockable { position: relative; }
.aioa-lockable.is-locked .aioa-lock-content { filter: blur(5px); opacity: .6; pointer-events: none; user-select: none; }

/* Overlay over the whole tab; the card stays in view while the tab scrolls */
.aioa-lock { position: absolute; inset: 0; z-index: 5; padding: 64px 16px 16px; }
.aioa-lock.is-center { display: grid; place-items: center; padding: 16px; }
.aioa-lock-card {
  position: sticky; top: 96px; display: grid; justify-items: center; gap: 14px; max-width: 520px; margin: 0 auto; padding: 28px 28px 26px;
  text-align: center; border-radius: var(--radius); background: var(--surface); border: 1px solid var(--border);
  box-shadow: 0 16px 40px rgba(0, 0, 0, .14);
}
.aioa-lock-icon { display: grid; place-items: center; width: 42px; height: 42px; border-radius: 50%; background: var(--accent-soft); color: var(--accent); }
.aioa-lock-icon svg { width: 20px; height: 20px; }
.aioa-lock-text { font-size: 19px; font-weight: 700; line-height: 1.35; }

/* ===== paid.css ===== */

/* ---------- Link fields ---------- */

/* Card title with a purple icon tile; the title is also the field label */
.aioa-feature-title { display: flex; align-items: center; gap: 12px; margin-bottom: 14px; font-size: 17px; font-weight: 700; }
.aioa-feature-title label { cursor: pointer; }
.aioa-feature-icon { display: grid; place-items: center; width: 32px; height: 32px; flex-shrink: 0; border-radius: var(--radius-sm); background: var(--btn-primary); color: #fff; }
.aioa-feature-icon svg { width: 18px; height: 18px; }

/* Link icon inside the field */
.aioa-affix-icon { display: grid; place-items: center; padding-left: 13px; color: var(--muted); }
.aioa-affix-icon svg { width: 18px; height: 18px; }
.aioa-link-input input { padding-left: 10px; }

/* ---------- Switches ---------- */

.aioa-pair { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 18px; }
.aioa-toggle-card { display: flex; align-items: center; gap: 14px; padding: 18px 22px; font-weight: 600; cursor: pointer; }
.aioa-toggle-card:hover { border-color: var(--border-strong); }

/* Native checkbox drawn as a switch (role="switch" in the markup) */
:where(.aioa-root) input[type="checkbox"].aioa-switch {
  -webkit-appearance: none; appearance: none; position: relative; width: 42px; height: 24px; margin: 0; flex-shrink: 0;
  border-radius: 999px; background: var(--border-strong); cursor: pointer; transition: background-color .15s ease;
}
.aioa-switch::before {
  content: ""; position: absolute; top: 3px; left: 3px; width: 18px; height: 18px; border-radius: 50%;
  background: #fff; box-shadow: 0 1px 2px rgba(0, 0, 0, .3); transition: transform .15s ease;
}
:where(.aioa-root) input[type="checkbox"].aioa-switch:checked { background: var(--btn-primary); }
.aioa-switch:checked::before { transform: translateX(18px); }

@media (forced-colors: active) {
  :where(.aioa-root) input[type="checkbox"].aioa-switch { border: 1px solid CanvasText; }
  .aioa-switch::before { background: CanvasText; }
  :where(.aioa-root) input[type="checkbox"].aioa-switch:checked { background: Highlight; }
}

/* ---------- Widget position for mobile ---------- */

.aioa-switch-head { display: flex; align-items: center; gap: 14px; }
.aioa-switch-head h2 label { cursor: pointer; }
.aioa-mobile-body { margin-top: 18px; }

/* Same grid as the desktop position (settings.css); the glyphs are phone shaped */
.aioa-glyph.is-phone { width: 16px; height: 24px; border-radius: 4px; }

/* ===== score.css ===== */

.aioa-score { --level: var(--success); }
.aioa-score[data-level="semi"] { --level: var(--warning); }
.aioa-score[data-level="not"] { --level: var(--danger); }

.aioa-score-head h2 { font-size: 18px; }
.aioa-score-status { margin-top: 2px; font-weight: 700; color: var(--level); }

.aioa-score-body { display: flex; align-items: center; gap: 28px; margin-top: 18px; }

/* Score ring: the bar covers --p of 100 (pathLength), starting at the top */
.aioa-donut { position: relative; width: 124px; height: 124px; flex-shrink: 0; }
.aioa-donut svg { display: block; width: 100%; height: 100%; transform: rotate(-90deg); }
.aioa-donut circle { fill: none; stroke-width: 13; }
.aioa-donut-track { stroke: var(--border); }
.aioa-donut-bar { stroke: var(--level); stroke-dasharray: var(--p) 100; transition: stroke-dasharray .6s ease; }
.aioa-donut-value { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; gap: 1px; }
.aioa-donut-value b { font-size: 30px; font-weight: 800; line-height: 1; }
.aioa-donut-value small { margin-top: 8px; font-size: 14px; font-weight: 700; }

/* Three figures with thin dividers */
.aioa-score-stats { flex: 1; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); }
.aioa-stat { min-width: 0; padding: 2px 18px; border-left: 1px solid var(--border); }
.aioa-stat:first-child { padding-left: 0; border-left: 0; }
.aioa-stat-value { font-size: 26px; font-weight: 800; line-height: 1.15; }
.aioa-stat-label { margin-top: 3px; font-size: 13.5px; font-weight: 600; line-height: 1.3; }
.aioa-stat-count { margin-top: 6px; font-size: 13.5px; color: var(--muted); }

/* Last scan + PDF report */
.aioa-score-foot {
  display: flex; flex-wrap: wrap; justify-content: space-between; gap: 6px 16px; margin-top: 18px; padding-top: 14px;
  border-top: 1px solid var(--border); font-size: 13.5px; color: var(--muted);
}
.aioa-score-foot a { font-weight: 600; }

/* ===== responsive.css ===== */

@media (max-width: 720px) {
  .aioa-columns, .aioa-pair { grid-template-columns: 1fr; }
}

@media (max-width: 600px) {
  .aioa-page { padding: 16px 16px 36px; }
  .aioa-logo { width: 42px; height: 42px; }
  .aioa-brand h1 { font-size: 18px; }
  .aioa-card { padding: 18px; }
  .aioa-notice { padding: 18px; }

  /* Full width buttons in the notices */
  .aioa-notice-action { width: 100%; }
  .aioa-notice-action .aioa-btn { width: 100%; }
  .aioa-upgrade { padding: 18px 18px 16px; }
  .aioa-upgrade h2 { font-size: 21px; }
  .aioa-upgrade-cta, .aioa-btn-white { width: 100%; }

  /* Position options: glyph above the label */
  .aioa-pos-label { flex-direction: column; justify-content: center; gap: 5px; padding: 9px 4px; font-size: 13px; text-align: center; }

  /* Live preview chip: icon only */
  .aioa-live { padding: 4px; }
  .aioa-live-text { display: none; }

  .aioa-offset-row { grid-template-columns: 1fr 1fr; }
  .aioa-offset-row .aioa-label { grid-column: 1 / -1; }

  .aioa-icon-grid { grid-template-columns: repeat(auto-fill, minmax(52px, 1fr)); gap: 10px; }
  .aioa-icon-grid .aioa-icon { width: 48px; }
  /* Icon sizes: keep all five on one row (the "Extra small" caption is wider than its circle) */
  .aioa-size-row { --scale: .7; gap: 12px 10px; }
  .aioa-size-row .aioa-icon-caption { font-size: 12.5px; }

  /* Tabs: labels may wrap to two lines, lock in the corner */
  .aioa-tabs { gap: 4px; padding: 4px; }
  .aioa-tab { position: relative; min-height: 54px; padding: 8px 6px; font-size: 13px; line-height: 1.25; }
  .aioa-tab-lock { position: absolute; top: 4px; right: 4px; width: 18px; height: 18px; }

  /* Paid Features */
  .aioa-feature-title { font-size: 16px; }
  .aioa-toggle-card { padding: 16px 18px; }

  /* Lock card */
  .aioa-lock { padding: 40px 10px 10px; }
  .aioa-lock-card { padding: 22px 18px; }
  .aioa-lock-text { font-size: 17px; }

  /* Score: ring above the three figures */
  .aioa-score-body { flex-direction: column; gap: 20px; }
  .aioa-score-stats { width: 100%; }
  .aioa-stat { padding: 0 10px; }
  .aioa-stat-value { font-size: 20px; }
  .aioa-stat-label, .aioa-stat-count { font-size: 12.5px; }
}

@media (max-width: 420px) {
  .aioa-size-row { justify-content: space-between; column-gap: 6px; }
}

@media (prefers-reduced-motion: reduce) {
  :where(.aioa-root) *, :where(.aioa-root) *::before, :where(.aioa-root) *::after { animation-duration: .01ms !important; animation-iteration-count: 1 !important; transition-duration: .01ms !important; }
}
`
