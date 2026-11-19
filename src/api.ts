/**
 * ---------------------------------------------------------------------------
 * All in One Accessibility - API service
 * ---------------------------------------------------------------------------
 * Calls to the Skynet Technologies APIs. Sanity Studio has no server of its
 * own, so these run in the admin's browser (like assets/js/route.js in the
 * HTML version of the reference app). The actions resolve with the same JSON
 * shapes as the reference router (docs/API.md):
 *
 *   fetchWidgetSettings  Load settings ({not_registered: true} for a new website; never registers)
 *   registerDomain       Register the free widget for a new website (once), with no_required_eu
 *   getDashboardLink     Dashboard sign-in link, manage_domain from check-website (paid plans)
 *   getScanDetails       Accessibility Score tab: scan results of a domain (paid plans)
 *   saveSettings         widget-setting-update-platform (Save Changes)
 *   noRequiredEu         ipapi.co EU check, only right before registerDomain
 */

/* eslint-disable camelcase -- field names are the Skynet API's (snake_case) */

import {
  AIOA_API_BASE,
  AIOA_CHECK_WEBSITE_API,
  AIOA_GEO_API,
  AIOA_GEO_TIMEOUT,
  AIOA_HTTP_TIMEOUT,
  AIOA_PLATFORM,
  AIOA_SCAN_API,
  AIOA_SCAN_LANG,
  AIOA_SCORE_LEVELS,
  AIOA_UPDATE_API,
  AIOA_WIDGET_SETTINGS_API,
} from './config'
import {isValidDomain, isValidEmail, normalizeDomain} from './util'

/* =======================================================================
 * Types
 * ===================================================================== */

/** Any JSON value */
// eslint-disable-next-line no-use-before-define -- recursive type
export type Json = string | number | boolean | null | Json[] | JsonObject
export interface JsonObject {
  [key: string]: Json
}

/** Form fields sent to an API (null / undefined are sent as empty strings) */
export type Fields = Record<string, string | number | null | undefined>

export interface ErrorResult {
  error: string
  /** registerDomain: registered, but the settings are not ready yet */
  pending?: true
}

/** fetchWidgetSettings / registerDomain: the widget-settings "Data" object, with the mobile fields on a paid plan */
export type WidgetSettings = JsonObject

/** fetchWidgetSettings, for a website that is not registered yet (the page then calls registerDomain) */
export interface NotRegistered {
  not_registered: true
}

/** getDashboardLink */
export interface DashboardLink {
  link: string
}

/** getScanDetails, when there are no finished scan results yet */
export interface NoScan {
  no_scan: true
  in_progress: boolean
  message: string
}

export interface Ratio {
  fixed: number
  total: number
  percentage: number
}

/** getScanDetails: what the score card shows */
export interface ScoreSummary {
  domain: string
  score: number
  level: string
  status: string
  violations: Ratio
  alt_text: Ratio
  pages: {scanned: number; total: number}
  last_scan: string
  report_url: string
}

// Widget position for mobile (Paid Features): missing from widget-settings, see withMobileFields()
const MOBILE_FIELDS = [
  'is_mobile_position',
  'is_widget_custom_position_mobile',
  'widget_position_mobile',
  'widget_position_top_mobile',
  'widget_position_bottom_mobile',
  'widget_position_left_mobile',
  'widget_position_right_mobile',
  'widget_position_vertical_center_offset_mobile',
  'widget_position_horizontal_center_offset_mobile',
] as const

const INVALID_DOMAIN = 'A valid domain is required, for example example.com or localhost.'

/* =======================================================================
 * Actions
 * ===================================================================== */

/**
 * Load the widget settings of a domain. Never registers anything: a domain that
 * is not registered yet answers {not_registered: true}, and the page then calls
 * registerDomain (once).
 */
export async function fetchWidgetSettings(
  domain: string,
): Promise<WidgetSettings | NotRegistered | ErrorResult> {
  const url = normalizeDomain(domain)
  if (!isValidDomain(url)) {
    return {error: INVALID_DOMAIN}
  }

  const data = await getSettingsData(url)
  if (data === false) {
    return {error: 'Unable to load widget settings. Please try again.'}
  }
  if (data === null) {
    return {not_registered: true}
  }
  return data
}

/**
 * Register the free widget for a domain (add-user-domain), then wait for its settings.
 * The page calls it only after fetchWidgetSettings answered not_registered, and at
 * most once per website. widget-settings is checked again first, so a website that
 * is already registered is never registered twice, and nothing is registered when
 * the API can't be reached.
 */
export async function registerDomain(req: {
  url: string
  username: string
  email: string
  /** "0" EU | "1" not EU */
  noRequiredEu: string
}): Promise<WidgetSettings | ErrorResult> {
  const url = normalizeDomain(req.url)
  if (!isValidDomain(url)) {
    return {error: INVALID_DOMAIN}
  }

  let data = await getSettingsData(url)

  // API not reachable: never register a website that may already be registered
  if (data === false) {
    return {error: 'Unable to load widget settings. Please try again.'}
  }

  if (data === null) {
    await register(url, req.username, req.email, req.noRequiredEu === '0' ? '0' : '1')
    data = await waitForSettings(url)
  }

  // Registered, but the settings did not appear yet: the page waits instead of registering again
  if (data === null) {
    return {
      error:
        'Your website was registered, but its settings are not ready yet. Please try again in a moment.',
      pending: true,
    }
  }

  return data
}

/**
 * Dashboard sign-in link of a paid plan: "manage_domain" from check-website.
 * The page loads it once the plan is known as paid, so the "Dashboard" button
 * opens it at once. Only the link is passed on; api_key and the rest are dropped.
 */
export async function getDashboardLink(domain: string): Promise<DashboardLink | ErrorResult> {
  const url = normalizeDomain(domain)
  if (!isValidDomain(url)) {
    return {error: INVALID_DOMAIN}
  }

  const res = await post(AIOA_CHECK_WEBSITE_API, {domain: url})
  if (res === null) {
    return {error: 'Unable to load the dashboard link right now.'}
  }

  const link = toStr(res.manage_domain)
  if (!/^https:\/\//i.test(link)) {
    return {error: `No dashboard link was found for ${url}.`}
  }

  return {link}
}

/**
 * Accessibility Score tab: the scan results of a domain, trimmed to what the score card shows,
 * with Alt Text Remediated from check-website's alt_count (asked only when there are scan results).
 *
 * No finished results yet ("Scanning in progress"):
 *   not scanned yet  {"Data": [], "status": 404, "msg": "Domain details not found ..."}
 *   scan running     {"Data": {...partial...}, "status": 201, "msg": "Domain scan is currently in progress. ..."}
 */
export async function getScanDetails(domain: string): Promise<ScoreSummary | NoScan | ErrorResult> {
  const url = normalizeDomain(domain)
  if (!isValidDomain(url)) {
    return {error: 'Enter a valid domain, for example example.com or localhost'}
  }

  const res = await post(AIOA_SCAN_API, {lang_code: AIOA_SCAN_LANG, website: base64(url)})
  if (res === null) {
    return {error: 'Unable to load the accessibility score right now. Please try again.'}
  }

  const data = res.Data
  const inProgress = toInt(res.status) === 201
  if (inProgress || isEmpty(data) || !isObject(data)) {
    return {no_scan: true, in_progress: inProgress, message: toStr(res.msg)}
  }

  // Alt Text Remediated comes from check-website (alt_count)
  const site = await post(AIOA_CHECK_WEBSITE_API, {domain: url})

  return scoreSummary(data, isObject(site) ? site.alt_count : null)
}

/**
 * Save the widget settings (widget-setting-update-platform). The response body is not
 * read; any non-2xx status rejects. Fields: docs/API.md#widget-setting-update-platform.
 */
export async function saveSettings(fields: Fields): Promise<void> {
  const response = await fetch(AIOA_UPDATE_API, {
    method: 'POST',
    body: formBody(fields),
    credentials: 'omit',
  })
  if (!response.ok) {
    throw new Error(`Request failed (${response.status})`)
  }
}

/**
 * Is the admin in the EU? ipapi.co (from the admin's browser).
 * Resolves with no_required_eu: "0" when in_eu is true, otherwise "1"
 * (also when ipapi.co fails, is rate limited or takes longer than 8 seconds).
 */
export async function noRequiredEu(): Promise<string> {
  const controller = new AbortController()
  const timer = window.setTimeout(() => controller.abort(), AIOA_GEO_TIMEOUT)
  try {
    const res = await fetch(AIOA_GEO_API, {credentials: 'omit', signal: controller.signal})
    const data: unknown = await res.json()
    return isObject(data) && data.in_eu === true ? '0' : '1'
  } catch {
    return '1'
  } finally {
    window.clearTimeout(timer)
  }
}

/* =======================================================================
 * Internal
 * ===================================================================== */

/**
 * Register the free widget for a domain (add-user-domain).
 *   name            the admin's name, or the website when none is known
 *   email           the admin's email, or no-reply@<website> (without "www.") when none is known
 *   no_required_eu  "0" the admin is in the EU, "1" not in the EU
 *   aioa_icon_type, aioa_icon_size, aioa_icon_size_mb
 *                   the widget icon defaults for a new website: icon type 1, Medium size on desktop and mobile
 */
function register(
  url: string,
  name: string,
  email: string,
  noRequiredEuValue: string,
): Promise<JsonObject | null> {
  const cleanName = String(name ?? '').trim()
  const cleanEmail = String(email ?? '').trim()

  return post(`${AIOA_API_BASE}add-user-domain`, {
    name: cleanName === '' ? url : cleanName,
    email: isValidEmail(cleanEmail) ? cleanEmail : `no-reply@${url.replace(/^www\./, '')}`,
    company_name: '',
    website: base64(url),
    package_type: 'free-widget',
    start_date: `${new Date().toISOString().slice(0, 19)}+0000`, // UTC, e.g. 2026-11-02T09:30:00+0000
    end_date: '',
    price: '',
    discount_price: '0',
    platform: AIOA_PLATFORM,
    api_key: '',
    is_trial_period: '',
    is_free_widget: '1',
    no_required_eu: noRequiredEuValue,
    bill_address: '',
    country: '',
    state: '',
    city: '',
    post_code: '',
    transaction_id: '',
    subscr_id: '',
    payment_source: '',
    // Widget icon defaults for a new website: icon type 1, Medium size on desktop and mobile
    aioa_icon_type: 'aioa-icon-type-1',
    aioa_icon_size: 'aioa-medium-icon',
    aioa_icon_size_mb: 'aioa-medium-icon',
  })
}

/**
 * Settings of a registered domain, null when the domain is not registered,
 * or false when the API could not be reached or did not answer with JSON.
 */
async function getSettingsData(url: string): Promise<WidgetSettings | false | null> {
  const res = await post(`${AIOA_API_BASE}widget-settings`, {website_url: url})
  if (res === null) {
    return false
  }
  const data = res.Data
  if (isEmpty(data) || !isObject(data)) {
    return null
  }
  return withMobileFields(url, data)
}

/**
 * Add the widget position for mobile (Paid Features) to the settings of a paid plan.
 * widget-settings leaves these fields out; the widget's own settings endpoint
 * returns them. Fields widget-settings already sent win. When the call fails the
 * settings are returned as they are and the page uses its defaults.
 */
async function withMobileFields(url: string, data: WidgetSettings): Promise<WidgetSettings> {
  // Same rule as the page: anything but is_free_widget = 1 is a paid plan
  if (toInt(data.is_free_widget) === 1) {
    return data
  }

  const res = await post(AIOA_WIDGET_SETTINGS_API, {website_url: url})
  const widget = res ? res.Data : null
  if (!isObject(widget)) {
    return data
  }

  const merged: WidgetSettings = {...data}
  for (const field of MOBILE_FIELDS) {
    if (!Object.prototype.hasOwnProperty.call(merged, field) && field in widget) {
      merged[field] = widget[field]
    }
  }
  return merged
}

/** Poll for the settings of a domain that was just registered (the API needs a moment to sync). */
async function waitForSettings(url: string, attempts = 3): Promise<WidgetSettings | null> {
  for (let i = 0; i < attempts; i++) {
    await new Promise((resolve) => window.setTimeout(resolve, 1000))
    const data = await getSettingsData(url)
    if (data) {
      return data
    }
  }
  return null
}

/**
 * Score card values from the scanner's "Data":
 *   score       success_percentage, rounded, 0 - 99 (100 is shown as 99), labeled with AIOA_SCORE_LEVELS
 *   violations  fixed / total violations (summary)
 *   alt_text    images from check-website's alt_count (see altText)
 *   pages       scanned / selected pages
 * A check's total is its fixed plus its still open (total_error) violations.
 */
function scoreSummary(data: JsonObject, altCount: unknown): ScoreSummary {
  // Up to 99, never 100: a scanner score of 100 is shown as 99
  const score = Math.max(0, Math.min(99, phpRound(toFloat(data.success_percentage))))

  const level =
    AIOA_SCORE_LEVELS.find((candidate) => score >= candidate[0]) ??
    AIOA_SCORE_LEVELS[AIOA_SCORE_LEVELS.length - 1]

  // Every check: fixed by the widget, or still waiting for a manual fix (API spelling)
  const groups = isObject(data.acessibility_voilation) ? data.acessibility_voilation : {}
  const checks = [...asList(groups.voilation_remediated), ...asList(groups.require_manual_action)]

  let fixed = 0
  let total = 0
  for (const check of checks) {
    if (!isObject(check)) {
      continue
    }
    const checkFixed = toInt(check.total_fixed)
    fixed += checkFixed
    total += checkFixed + toInt(check.total_error)
  }

  // The summary wins when the API sends it
  const summary = data.summary
  if (isObject(summary) && isSet(summary.total_violations) && isSet(summary.total_fixed)) {
    fixed = toInt(summary.total_fixed)
    total = toInt(summary.total_violations)
  }

  const reportUrl = toStr(data.pdf_report_url)

  return {
    domain: toStr(data.domain),
    score,
    level: level[1],
    status: level[2],
    violations: ratio(fixed, total),
    alt_text: altText(altCount),
    pages: {
      scanned: toInt(data.total_scan_pages),
      total: toInt(data.total_selected_pages ?? data.total_pages ?? 0),
    },
    last_scan: toStr(data.last_scan),
    report_url: /^https:\/\//i.test(reportUrl) ? reportUrl : '',
  }
}

/**
 * Alt Text Remediated from check-website's alt_count. Only images with a missing alt tag
 * still need work:
 *   fixed  total_decorative_images + total_update_alt_text + total_other_images
 *   total  fixed + total_missing_alt_tag
 * No alt_count (check-website failed or sent none): 0 / 0.
 */
function altText(altCount: unknown): Ratio {
  const count = isObject(altCount) ? altCount : {}
  const images = (key: string) => Math.max(0, toInt(count[key]))

  const fixed =
    images('total_decorative_images') +
    images('total_update_alt_text') +
    images('total_other_images')
  return ratio(fixed, fixed + images('total_missing_alt_tag'))
}

/** {fixed: 38, total: 44, percentage: 86.36} */
function ratio(fixed: number, total: number): Ratio {
  return {fixed, total, percentage: total > 0 ? phpRound((fixed / total) * 100, 2) : 0}
}

/** Form body; null / undefined values are sent as empty strings */
function formBody(fields: Fields): URLSearchParams {
  const body = new URLSearchParams()
  for (const [key, value] of Object.entries(fields)) {
    body.append(key, value === null || value === undefined ? '' : String(value))
  }
  return body
}

/**
 * POST form fields to a URL and decode the JSON answer.
 *
 * @returns Decoded JSON object (also for 4xx answers with a JSON body), or null
 *   on a network / JSON error or timeout. Redirects are not followed.
 */
async function post(url: string, fields: Fields): Promise<JsonObject | null> {
  const controller = new AbortController()
  const timer = window.setTimeout(() => controller.abort(), AIOA_HTTP_TIMEOUT * 1000)
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {Accept: 'application/json'},
      body: formBody(fields),
      credentials: 'omit',
      redirect: 'manual',
      signal: controller.signal,
    })
    const decoded: unknown = JSON.parse(await response.text())
    return isObject(decoded) ? decoded : null
  } catch {
    return null // network error, timeout or not JSON
  } finally {
    window.clearTimeout(timer)
  }
}

/* ---------- Small conversions (API values may be numbers, numeric strings or null) ---------- */

function toFloat(value: unknown): number {
  if (typeof value === 'boolean') {
    return value ? 1 : 0
  }
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : 0
  }
  if (typeof value === 'string') {
    const match = /^\s*[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?/.exec(value)
    return match ? parseFloat(match[0]) : 0
  }
  return 0
}

export function toInt(value: unknown): number {
  const number = toFloat(value)
  return Number.isFinite(number) ? Math.trunc(number) : 0
}

export function toStr(value: unknown): string {
  if (value === null || value === undefined || value === false || typeof value === 'object') {
    return ''
  }
  return value === true ? '1' : String(value)
}

export function isObject(value: unknown): value is JsonObject {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

/** Not null or undefined */
function isSet(value: unknown): boolean {
  return value !== null && value !== undefined
}

function asList(value: unknown): unknown[] {
  return Array.isArray(value) ? value : []
}

/** Empty like PHP's empty(): missing, null, false, 0, "", "0", [] or {} */
function isEmpty(value: unknown): boolean {
  if (
    value === null ||
    value === undefined ||
    value === false ||
    value === 0 ||
    value === '' ||
    value === '0'
  ) {
    return true
  }
  if (typeof value === 'object') {
    return Object.keys(value).length === 0
  }
  return false
}

/** Round half away from zero, like PHP's round() */
function phpRound(value: number, precision = 0): number {
  const factor = 10 ** precision
  const shifted = Number((Math.abs(value) * factor).toPrecision(15))
  const result = Math.floor(shifted + 0.5) / factor
  return value < 0 ? -result : result
}

/** base64 of a UTF-8 string (domains are ASCII, but stay safe) */
function base64(value: string): string {
  let binary = ''
  for (const byte of new TextEncoder().encode(value)) {
    binary += String.fromCharCode(byte)
  }
  return window.btoa(binary)
}
