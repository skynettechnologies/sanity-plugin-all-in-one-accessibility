/**
 * Inline SVG icons used by the settings tool (same artwork as the reference views).
 */

import {AIOA_LOGO_PATH} from '../config'

const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const

/** Header logo: the accessibility figure on a purple circle */
export function LogoIcon() {
  return (
    <svg className="aioa-logo" viewBox="0 0 81.296 81.296" aria-hidden="true" focusable="false">
      <circle className="aioa-logo-circle" cx="40.648" cy="40.648" r="40.648" />
      <path fill="#fff" transform="translate(6.249 6.244)" d={AIOA_LOGO_PATH} />
    </svg>
  )
}

/** Large faded figure in the corner of the upgrade banner */
export function WatermarkIcon() {
  return (
    <svg
      className="aioa-upgrade-watermark"
      viewBox="0 0 69 69"
      fill="#fff"
      aria-hidden="true"
      focusable="false"
    >
      <path d={AIOA_LOGO_PATH} />
    </svg>
  )
}

export function MoonIcon() {
  return (
    <svg className="i-moon" viewBox="0 0 24 24" strokeWidth="2" aria-hidden="true" {...stroke}>
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
    </svg>
  )
}

export function SunIcon() {
  return (
    <svg className="i-sun" viewBox="0 0 24 24" strokeWidth="2" aria-hidden="true" {...stroke}>
      <circle cx="12" cy="12" r="4.5" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  )
}

export function LockIcon({strokeWidth = 2.2}: {strokeWidth?: number}) {
  return (
    <svg viewBox="0 0 24 24" strokeWidth={strokeWidth} aria-hidden="true" {...stroke}>
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </svg>
  )
}

export function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" strokeWidth="2.5" aria-hidden="true" {...stroke}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  )
}

export function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" strokeWidth="3" aria-hidden="true" {...stroke}>
      <path d="M5 12.5l4.5 4.5L19 7.5" />
    </svg>
  )
}

export function AlertIcon() {
  return (
    <svg viewBox="0 0 24 24" strokeWidth="3" aria-hidden="true" {...stroke}>
      <path d="M12 7v6M12 17v.5" />
    </svg>
  )
}

export function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" strokeWidth="2.5" aria-hidden="true" {...stroke}>
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  )
}

/** Chain link inside the Paid Features link fields */
export function LinkIcon() {
  return (
    <svg viewBox="0 0 24 24" strokeWidth="2" aria-hidden="true" {...stroke}>
      <path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1" />
      <path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" />
    </svg>
  )
}

/** Accessibility statement (list) */
export function StatementIcon() {
  return (
    <svg viewBox="0 0 24 24" strokeWidth="2.2" aria-hidden="true" {...stroke}>
      <path d="M9 7h8M9 12h8M9 17h8" />
      <circle cx="5.5" cy="7" r=".6" fill="currentColor" />
      <circle cx="5.5" cy="12" r=".6" fill="currentColor" />
      <circle cx="5.5" cy="17" r=".6" fill="currentColor" />
    </svg>
  )
}

/** Report a problem (warning triangle) */
export function ReportIcon() {
  return (
    <svg viewBox="0 0 24 24" strokeWidth="2.2" aria-hidden="true" {...stroke}>
      <path d="M12 4l9 16H3z" />
      <path d="M12 10v4M12 17v.5" />
    </svg>
  )
}
