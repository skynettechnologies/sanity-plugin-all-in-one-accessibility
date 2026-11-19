/**
 * ---------------------------------------------------------------------------
 * All in One Accessibility - configuration
 * ---------------------------------------------------------------------------
 * Every fixed value the settings tool needs. The names match the reference
 * implementations (AIOA_* in config.php / config.ts), so the docs of the
 * PHP / TypeScript versions apply to this plugin too.
 *
 * Sanity Studio has no server of its own, so the API service (./api.ts) runs
 * in the browser, like the HTML version of the reference app. Every Skynet
 * endpoint below answers browsers with "Access-Control-Allow-Origin: *".
 */

/* ---------- Skynet Technologies API ---------- */

/** Base URL of the API that stores widget registrations and settings */
export const AIOA_API_BASE = 'https://ada.skynettechnologies.us/api/'

/** Saves the widget settings (POST, form fields, see saveSettings in ./api.ts) */
export const AIOA_UPDATE_API = `${AIOA_API_BASE}widget-setting-update-platform`

/** Platform sent to the API when a free widget is registered */
export const AIOA_PLATFORM = 'sanity'

/**
 * Settings endpoint the widget itself reads. Unlike widget-settings above, it returns
 * the widget position for mobile, so a paid plan's mobile fields are read from here.
 */
export const AIOA_WIDGET_SETTINGS_API = 'https://freeada.skynettechnologies.com/api/widget-settings'

/**
 * Plan details of a website (paid plans). Its "manage_domain" is the dashboard sign-in
 * link opened by the "Dashboard" button. POST "domain" (plain, not base64).
 */
export const AIOA_CHECK_WEBSITE_API = 'https://ada.skynettechnologies.us/check-website'

/**
 * EU check: the browser calls it once, only before a new website is registered. Its "in_eu"
 * sets no_required_eu for add-user-domain: in_eu true -> 0 (EU), otherwise 1 (not EU).
 */
export const AIOA_GEO_API = 'https://ipapi.co/json'

/** "Upgrade to Paid Plan" destination */
export const AIOA_UPGRADE_URL = 'https://ada.skynettechnologies.us/trial-subscription'

/** Seconds before a Skynet API call gives up */
export const AIOA_HTTP_TIMEOUT = 30

/** Milliseconds to wait for ipapi.co before registering as "not EU" */
export const AIOA_GEO_TIMEOUT = 8000

/* ---------- SkynetAccessibility Scanner API (Accessibility Score tab) ---------- */

/** Scan results of a domain. No trailing slash: ".../details/" answers with a 301 redirect. */
export const AIOA_SCAN_API = 'https://skynetaccessibilityscan.com/api/ada-scanner/domain/details'

/** Language of the scan texts */
export const AIOA_SCAN_LANG = 'en'

/** [minimum score, level (data-level), status label] */
export type ScoreLevel = readonly [number, 'compliant' | 'semi' | 'not', string]

/**
 * Score label by minimum score (checked from the top). The scanner's sample
 * report shows 81% as "Semi Compliant" and 98% as "Compliant".
 */
export const AIOA_SCORE_LEVELS: readonly ScoreLevel[] = [
  [85, 'compliant', 'Compliant'],
  [50, 'semi', 'Semi Compliant'],
  [0, 'not', 'Not Compliant'],
]

/* ---------- Widget options ---------- */

/** Number of icon types offered in the "Icon type" section (icons are bundled in ./icons.ts) */
export const AIOA_ICON_TYPE_COUNT = 29

/** Default widget color (hex without "#") */
export const AIOA_DEFAULT_COLOR = '420083'

/** [value sent to the API, label, grid x (0 / .5 / 1), grid y (0 / .5 / 1)] */
export type Position = readonly [string, string, number, number]

/**
 * Widget positions laid out as a 3 x 3 grid. null is the center cell that shows
 * the "Your website" preview. Older saves may hold "middel_left" / "middel_right";
 * they load as the same cell (positionValue in ./util.ts).
 * Used by Appearance Design (desktop) and Paid Features (widget position for mobile).
 */
export const AIOA_POSITIONS: readonly (Position | null)[] = [
  ['top_left', 'Top left', 0, 0],
  ['top_center', 'Top center', 0.5, 0],
  ['top_right', 'Top right', 1, 0],
  ['middle_left', 'Middle left', 0, 0.5],
  null,
  ['middle_right', 'Middle right', 1, 0.5],
  ['bottom_left', 'Bottom left', 0, 1],
  ['bottom_center', 'Bottom center', 0.5, 1],
  ['bottom_right', 'Bottom right', 1, 1],
]

/**
 * Icon sizes for desktop: [value sent to the API, label, preview circle diameter in px].
 * The preview circles shrink from Big to Extra small, like the real icon.
 */
export const AIOA_ICON_SIZES: readonly (readonly [string, string, number])[] = [
  ['aioa-big-icon', 'Big', 84],
  ['aioa-medium-icon', 'Medium', 74],
  ['aioa-default-icon', 'Default', 64],
  ['aioa-small-icon', 'Small', 54],
  ['aioa-extra-small-icon', 'Extra small', 44],
]

/** Quick color presets shown under the color picker: [hex, name] */
export const AIOA_PRESET_COLORS: readonly (readonly [string, string])[] = [
  ['420083', 'Purple (default)'],
  ['1D4ED8', 'Blue'],
  ['0E7490', 'Teal'],
  ['15803D', 'Green'],
  ['B91C1C', 'Red'],
  ['C2410C', 'Orange'],
  ['BE185D', 'Pink'],
  ['111827', 'Charcoal'],
]

/** Settings used until the settings of a registered website are loaded (API field names) */
/* eslint-disable camelcase */
export const AIOA_DEFAULTS = {
  widget_position: 'bottom_right',
  widget_color_code: `#${AIOA_DEFAULT_COLOR}`,
  widget_icon_type: 'aioa-icon-type-1',
  widget_icon_size: 'aioa-default-icon',
  widget_size: '0',
} as const
/* eslint-enable camelcase */

/* ---------- Browser storage keys ---------- */

/** Page-only toggle choice when the Studio appearance is fixed (JSON, see ./theme.ts) */
export const STORAGE_THEME = 'aioa-theme'

/** "appearance", "paid" or "score": the tab the admin last picked */
export const STORAGE_TAB = 'aioa-tab-picked'

/** Prefix of "aioa-registered:<website>": when the website was sent for registration */
export const STORAGE_REGISTERED = 'aioa-registered:'

/** No second registration of a website before this many ms */
export const REGISTER_AGAIN_AFTER = 10 * 60 * 1000

/* ---------- Artwork ---------- */

/** Accessibility figure used by the header logo, the tool icon and the upgrade banner (69 x 69 view box) */
export const AIOA_LOGO_PATH =
  'M34.38,0A34.394,34.394,0,1,1,10.072,10.073,34.394,34.394,0,0,1,34.38,0Zm-.218,41.511-5,13.839a2.752,2.752,0,0,1-1.443,1.583A2.8,2.8,0,0,1,24,55.59a2.832,2.832,0,0,1-.1-2.149l3.491-9.667a14.235,14.235,0,0,0,.654-2.239,23.446,23.446,0,0,0,.3-2.361c.134-1.416.229-2.949.3-4.421s.125-2.9.163-4.08c.05-1.472-.346-1.567-1.527-1.846l-.25-.056-10.073-1.9a2.8,2.8,0,1,1,1.018-5.484L28.8,23.421c.431.039.85.09,1.293.14a32.187,32.187,0,0,0,4.017.3,45.275,45.275,0,0,0,5-.353c.5-.056.979-.118,1.455-.163l10.212-1.914a2.764,2.764,0,0,1,2.848,4.281v.034a2.8,2.8,0,0,1-1.8,1.169l-9.782,1.836c-.325.073-.615.125-.875.163-1.018.174-1.522.263-1.461,1.712.045,1.058.174,2.323.341,3.643.2,1.55.453,3.2.722,4.7a22.945,22.945,0,0,0,.559,2.546c.224.76.441,1.538.778,2.474l3.409,9.457a2.8,2.8,0,1,1-5.253,1.909l-5.02-13.814-.559-1.024-.559,1Zm.218-29.949a4.942,4.942,0,1,1-3.487,1.446,4.942,4.942,0,0,1,3.487-1.446ZM54.722,14.04a28.774,28.774,0,1,0,8.393,20.341A28.774,28.774,0,0,0,54.722,14.04Z'
