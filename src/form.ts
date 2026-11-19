/**
 * ---------------------------------------------------------------------------
 * All in One Accessibility - settings form model
 * ---------------------------------------------------------------------------
 * The form state of the Appearance Design and Paid Features tabs, how saved
 * settings fill it, and how it is checked and turned into the fields of
 * widget-setting-update-platform. Same rules as settings-form.js and
 * paid-features.js in the reference app (docs/APP.md#page-sections).
 */

/* eslint-disable camelcase -- field names are the Skynet API's (snake_case) */

import type {Fields, JsonObject} from './api'
import {AIOA_DEFAULT_COLOR, AIOA_DEFAULTS, AIOA_ICON_SIZES, AIOA_POSITIONS} from './config'
import {parseHex, positionValue, wholeNumber} from './util'

/* =======================================================================
 * Types
 * ===================================================================== */

export type TabName = 'appearance' | 'paid' | 'score'

export type XDir = 'cust-pos-to-the-right' | 'cust-pos-to-the-left'
export type YDir = 'cust-pos-to-the-lower' | 'cust-pos-to-the-upper'
export type MobileXDir = 'left' | 'right' | 'center'
export type MobileYDir = 'top' | 'bottom'
export type LinkName = 'statement_link' | 'report_problem_link'

export const LINKS: readonly LinkName[] = ['statement_link', 'report_problem_link']

/** Appearance Design tab */
export interface AppearanceState {
  /** Hex field, as typed (without "#") */
  colorText: string
  /** Applied color: 6 uppercase hex digits (picker, presets, previews) */
  color: string
  colorError: boolean
  /** "0" Regular Size, "1" Oversize */
  widgetSize: string
  customPosition: boolean
  position: string
  x: string
  xDir: XDir
  y: string
  yDir: YDir
  /** "Enter a horizontal and a vertical position" is shown; the marks then follow what is typed */
  positionCheck: boolean
  iconType: string
  customSize: boolean
  iconSize: string
  iconSizeCustom: string
  /** "Enter an exact icon size from 20 to 150 px." is shown; the mark then follows what is typed */
  sizeCheck: boolean
}

/** Paid Features tab */
export interface PaidState {
  statement_link: string
  report_problem_link: string
  linkErrors: Record<LinkName, string>
  widget_leave_page: boolean
  is_sound_disabled: boolean
  /** Widget position for mobile switch */
  mobilePosition: boolean
  customPositionMobile: boolean
  positionMobile: string
  mx: string
  mxDir: MobileXDir
  my: string
  myDir: MobileYDir
  mobileCheck: boolean
}

/** Which field gets the focus when the form can't be saved */
export type FocusTarget =
  | 'colorcode'
  | 'iconSizeCustom'
  | 'x'
  | 'y'
  | 'mx'
  | 'my'
  | 'statement_link'
  | 'report_problem_link'

/** A field that needs a fix before saving */
export interface Problem {
  tab: TabName
  focus: FocusTarget
  /** Section name, used when several problems are listed in one toast */
  name: string
  /** Toast when it is the only problem */
  title: string
  message: string
}

export interface CollectResult {
  /** The form with every error mark (and links completed with https://) */
  appearance: AppearanceState
  paid: PaidState
  /** Fields for widget-setting-update-platform, or null when something is wrong */
  params: Fields | null
  /** Every problem, in page order (Appearance Design first); empty when the form can be saved */
  problems: Problem[]
}

export const POSITION_MESSAGE = 'Enter a horizontal and a vertical position from 0 to 250 px.'

/** Exact offsets are whole pixels from 0 to 250 */
export const OFFSET_MAX = 250

/** Exact icon size: whole pixels from 20 to 150 */
export const SIZE_MIN = 20
export const SIZE_MAX = 150
export const SIZE_MESSAGE = `Enter an exact icon size from ${SIZE_MIN} to ${SIZE_MAX} px.`

/** A valid exact icon size: a whole number from 20 to 150 */
export function isValidIconSize(value: string): boolean {
  const size = wholeNumber(value, null)
  return size !== null && size >= SIZE_MIN && size <= SIZE_MAX
}

const POSITION_VALUES = AIOA_POSITIONS.flatMap((pos) => (pos ? [pos[0]] : []))
const ICON_SIZE_VALUES = AIOA_ICON_SIZES.map((size) => size[0])

/* =======================================================================
 * Saved settings -> form
 * ===================================================================== */

const isSet = (value: unknown) => value !== null && value !== undefined && value !== ''
const isOn = (value: unknown) => Number(value) === 1
const num = (value: unknown) => wholeNumber(value, 0)
/** The first value above 0, otherwise 0 */
const firstPositive = (...values: number[]) => values.find((value) => value > 0) ?? 0
const clampOffset = (value: unknown) => String(Math.min(Math.max(num(value), 0), OFFSET_MAX))

/** A grid value, or Bottom right for anything the grid doesn't have */
function gridPosition(value: unknown): string {
  const position = positionValue(value)
  return POSITION_VALUES.includes(position) ? position : 'bottom_right'
}

/** The form before any settings are loaded */
export function emptyAppearance(): AppearanceState {
  return appearanceFrom({})
}

/** Saved settings (widget-settings "Data") -> Appearance Design tab; anything missing falls back to the defaults */
export function appearanceFrom(result: JsonObject): AppearanceState {
  const hex =
    parseHex(result.widget_color_code || AIOA_DEFAULTS.widget_color_code) || AIOA_DEFAULT_COLOR
  const iconType = String(result.widget_icon_type || AIOA_DEFAULTS.widget_icon_type)
  const iconSize = String(result.widget_icon_size || AIOA_DEFAULTS.widget_icon_size)

  const right = num(result.widget_position_right)
  const left = num(result.widget_position_left)
  const bottom = num(result.widget_position_bottom)
  const top = num(result.widget_position_top)

  return {
    colorText: hex,
    color: hex,
    colorError: false,
    widgetSize: String(result.widget_size) === '1' ? '1' : '0',
    customPosition: Number(result.is_widget_custom_position) === 1,
    position: gridPosition(result.widget_position || AIOA_DEFAULTS.widget_position),
    // Exact horizontal offset: right wins over left; exact vertical offset: bottom wins over top
    x: String(firstPositive(right, left)),
    xDir: right > 0 || !(left > 0) ? 'cust-pos-to-the-right' : 'cust-pos-to-the-left',
    y: String(firstPositive(bottom, top)),
    yDir: bottom > 0 || !(top > 0) ? 'cust-pos-to-the-lower' : 'cust-pos-to-the-upper',
    positionCheck: false,
    iconType: /^aioa-icon-type-([1-9]|1\d|2\d)$/.test(iconType) ? iconType : 'aioa-icon-type-1',
    customSize: Number(result.is_widget_custom_size) === 1,
    iconSize: ICON_SIZE_VALUES.includes(iconSize) ? iconSize : 'aioa-medium-icon',
    iconSizeCustom: String(wholeNumber(result.widget_icon_size_custom, '') || ''),
    sizeCheck: false,
  }
}

/** Saved settings -> Paid Features tab */
export function paidFrom(result: JsonObject): PaidState {
  const r = result || {}

  // Horizontal: center offset first, then right wins over left (as on desktop)
  let mxDir: MobileXDir = 'right'
  let mx = clampOffset(r.widget_position_right_mobile)
  if (isSet(r.widget_position_horizontal_center_offset_mobile)) {
    mxDir = 'center'
    mx = clampOffset(r.widget_position_horizontal_center_offset_mobile)
  } else if (num(r.widget_position_left_mobile) > 0 && !(num(r.widget_position_right_mobile) > 0)) {
    mxDir = 'left'
    mx = clampOffset(r.widget_position_left_mobile)
  }

  // Vertical: bottom wins over top (as on desktop)
  let myDir: MobileYDir = 'bottom'
  let my = clampOffset(r.widget_position_bottom_mobile)
  if (num(r.widget_position_top_mobile) > 0 && !(num(r.widget_position_bottom_mobile) > 0)) {
    myDir = 'top'
    my = clampOffset(r.widget_position_top_mobile)
  }

  return {
    statement_link: typeof r.statement_link === 'string' ? r.statement_link : '',
    report_problem_link: typeof r.report_problem_link === 'string' ? r.report_problem_link : '',
    linkErrors: {statement_link: '', report_problem_link: ''},
    widget_leave_page: isOn(r.widget_leave_page),
    is_sound_disabled: isOn(r.is_sound_disabled),
    mobilePosition: isOn(r.is_mobile_position),
    customPositionMobile: isOn(r.is_widget_custom_position_mobile),
    positionMobile: gridPosition(r.widget_position_mobile),
    mx,
    mxDir,
    my,
    myDir,
    mobileCheck: false,
  }
}

/* =======================================================================
 * Links (Paid Features)
 * ===================================================================== */

/** Link names in the "Check the fields marked in red" toast */
const LINK_NAMES: Record<LinkName, string> = {
  statement_link: 'Accessibility statement link',
  report_problem_link: 'Report a problem link',
}

export const LINK_PLACEHOLDERS: Record<LinkName, string> = {
  statement_link: 'https://www.yourwebsite.com/accessibility-statement',
  report_problem_link: 'https://www.yourwebsite.com/report-a-problem',
}

/** "www.example.com/page" -> "https://www.example.com/page" (links typed without a scheme) */
export function withScheme(value: string): string {
  const text = String(value || '').trim()
  if (text && !/^[a-z][a-z0-9+.-]*:/i.test(text) && /^[^\s/]+\.[^\s/]+/.test(text)) {
    return `https://${text}`
  }
  return text
}

/** Empty, or an http(s) link to a real domain */
export function isValidLink(value: string): boolean {
  if (!value) {
    return true
  }
  try {
    const url = new URL(value)
    return (url.protocol === 'https:' || url.protocol === 'http:') && url.hostname.includes('.')
  } catch {
    return false
  }
}

/** Complete a link with https:// when needed and check it: [new value, error message] */
export function checkLink(name: LinkName, value: string): [string, string] {
  const completed = withScheme(value)
  const error = isValidLink(completed)
    ? ''
    : `Enter a full link that starts with https://, for example ${LINK_PLACEHOLDERS[name]}`
  return [completed, error]
}

/** The exact mobile position is in use (both values are then required) */
export function mobileExact(paid: PaidState): boolean {
  return paid.mobilePosition && paid.customPositionMobile
}

/* =======================================================================
 * Form -> save fields
 * ===================================================================== */

/**
 * Check every field and build the fields for widget-setting-update-platform.
 * Every invalid field is marked at the same time, not only the first one, and
 * the problems come back in page order: color, exact position, exact icon size,
 * then (paid plans) the exact mobile position and the two links.
 * The Paid Features fields are added on a paid plan only.
 */
export function collect(
  appearanceIn: AppearanceState,
  paidIn: PaidState,
  domain: string,
  isPaid: boolean,
): CollectResult {
  let appearance = appearanceIn
  let paid = paidIn
  const problems: Problem[] = []

  /* ---------- Appearance Design ---------- */

  const hex = parseHex(appearance.colorText)
  if (!hex) {
    appearance = {...appearance, colorError: true}
    problems.push({
      tab: 'appearance',
      focus: 'colorcode',
      name: 'Widget color',
      title: 'Invalid color',
      message: 'Enter a valid hex color code, for example FF5733.',
    })
  }

  // Exact position: an empty field is never saved as 0
  if (appearance.customPosition && (appearance.x.trim() === '' || appearance.y.trim() === '')) {
    appearance = {...appearance, positionCheck: true}
    problems.push({
      tab: 'appearance',
      focus: appearance.x.trim() === '' ? 'x' : 'y',
      name: 'Widget position',
      title: 'Position missing',
      message:
        'Enter the exact position (0 - 250 px), or turn off "Set an exact position in pixels".',
    })
  }

  // Exact icon size: a whole number from 20 to 150 px
  if (appearance.customSize && !isValidIconSize(appearance.iconSizeCustom)) {
    appearance = {...appearance, sizeCheck: true}
    problems.push({
      tab: 'appearance',
      focus: 'iconSizeCustom',
      name: 'Icon size for desktop',
      title: 'Invalid icon size',
      message: SIZE_MESSAGE,
    })
  }

  /* ---------- Paid Features (paid plans only) ---------- */

  if (isPaid) {
    // Exact mobile position: an empty field is never saved as 0
    if (mobileExact(paid) && (paid.mx.trim() === '' || paid.my.trim() === '')) {
      paid = {...paid, mobileCheck: true}
      problems.push({
        tab: 'paid',
        focus: paid.mx.trim() === '' ? 'mx' : 'my',
        name: 'Widget position for mobile (Paid Features)',
        title: 'Mobile position missing',
        message: 'Enter the exact mobile position (0 - 250 px) on the Paid Features tab.',
      })
    }

    // Both links are completed with https:// when needed and checked
    const linkErrors = {...paid.linkErrors}
    const links = {
      statement_link: paid.statement_link,
      report_problem_link: paid.report_problem_link,
    }
    for (const name of LINKS) {
      const [value, error] = checkLink(name, links[name])
      links[name] = value
      linkErrors[name] = error
      if (error) {
        problems.push({
          tab: 'paid',
          focus: name,
          name: `${LINK_NAMES[name]} (Paid Features)`,
          title: 'Invalid link',
          message: 'Check the links on the Paid Features tab.',
        })
      }
    }
    paid = {...paid, ...links, linkErrors}
  }

  if (problems.length || !hex) {
    return {appearance, paid, params: null, problems}
  }

  /* ---------- Save fields ---------- */

  // Whole pixels only (the fields never hold decimals, see WholeNumberInput)
  const iconSizeCustom = String(wholeNumber(appearance.iconSizeCustom, ''))

  // Exact offsets: only the chosen direction of each axis is sent
  // (empty only while the exact position is off: then 0)
  const x = wholeNumber(appearance.x, 0)
  const y = wholeNumber(appearance.y, 0)

  const params: Fields = {
    u: domain,
    widget_position: appearance.position,
    is_widget_custom_position: appearance.customPosition ? 1 : 0,
    is_widget_custom_size: appearance.customSize ? 1 : 0,
    widget_color_code: `#${hex}`,
    widget_icon_type: appearance.iconType,
    widget_icon_size: appearance.iconSize,
    widget_size: appearance.widgetSize,
    widget_icon_size_custom: iconSizeCustom,
    widget_position_right: appearance.xDir === 'cust-pos-to-the-right' ? x : null,
    widget_position_left: appearance.xDir === 'cust-pos-to-the-left' ? x : null,
    widget_position_top: appearance.yDir === 'cust-pos-to-the-upper' ? y : null,
    widget_position_bottom: appearance.yDir === 'cust-pos-to-the-lower' ? y : null,
  }

  if (isPaid) {
    const mx = num(paid.mx)
    const my = num(paid.my)
    const offsetX = (direction: MobileXDir) => (paid.mxDir === direction ? mx : '')
    const offsetY = (direction: MobileYDir) => (paid.myDir === direction ? my : '')

    Object.assign(params, {
      statement_link: paid.statement_link,
      report_problem_link: paid.report_problem_link,
      widget_leave_page: paid.widget_leave_page ? 1 : 0,
      is_sound_disabled: paid.is_sound_disabled ? 1 : 0,
      is_mobile_position: paid.mobilePosition ? 1 : 0,
      is_widget_custom_position_mobile: paid.customPositionMobile ? 1 : 0,
      widget_position_mobile: paid.positionMobile,
      widget_position_right_mobile: offsetX('right'),
      widget_position_left_mobile: offsetX('left'),
      widget_position_horizontal_center_offset_mobile: offsetX('center'),
      widget_position_bottom_mobile: offsetY('bottom'),
      widget_position_top_mobile: offsetY('top'),
      widget_position_vertical_center_offset_mobile: '', // no vertical center option: always cleared
    })
  }

  return {appearance, paid, params, problems}
}

/** "A", "A and B", "A, B and C" */
function joinNames(names: string[]): string {
  return names.length > 1
    ? `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}`
    : names[0]
}

/**
 * The toast for the problems: a single problem's own toast, or one toast that
 * lists every section marked in red.
 */
export function problemToast(problems: Problem[]): {title: string; message: string} {
  if (problems.length === 1) {
    return {title: problems[0].title, message: problems[0].message}
  }
  return {
    title: 'Check the fields marked in red',
    message: `${joinNames(problems.map((p) => p.name))} need a fix before you can save.`,
  }
}
