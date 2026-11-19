/**
 * ---------------------------------------------------------------------------
 * All in One Accessibility - small helpers
 * ---------------------------------------------------------------------------
 * Validation and conversion helpers shared by the API service and the UI.
 * Same rules as AIOA.util in the reference app's assets/js/core.js and the
 * validation helpers of its API service.
 */

import {AIOA_UPGRADE_URL} from './config'

/** Website host: a domain name such as "example.com", or "localhost". Never an IP address. */
export const DOMAIN_RE =
  /^(?:localhost|(?=.{3,253}$)(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63})$/

/** An email address the registration accepts (the same cases as PHP's FILTER_VALIDATE_EMAIL) */
const EMAIL_RE =
  /^(?=.{1,254}$)(?=[^@]{1,64}@)[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?\.)+(?![0-9]+$)[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?$/

/** Normalize user input such as "https://www.Example.com/shop" to "www.example.com". */
export function normalizeDomain(value: unknown): string {
  return String(value ?? '')
    .trim()
    .toLowerCase()
    .replace(/^[a-z][a-z0-9+.-]*:\/\//, '') // scheme
    .replace(/[/?#].*$/, '') // path, query, hash
    .replace(/:\d+$/, '') // port
    .replace(/^\.+|\.+$/g, '')
}

/** True for a website host: a domain name such as "example.com", or "localhost" */
export function isValidDomain(domain: string): boolean {
  return DOMAIN_RE.test(domain)
}

export function isValidEmail(email: string): boolean {
  return EMAIL_RE.test(email)
}

/**
 * A value from the platform. Raw placeholders such as "{email}" count as missing,
 * like aioa_request() in the reference app.
 */
export function platformValue(value: unknown): string {
  const text = typeof value === 'string' ? value : ''
  return /^\{.*\}$/.test(text.trim()) ? '' : text.replace(/[{}]/g, '').trim()
}

/** Email check for the upgrade link (same as the reference app's plan.js) */
const UPGRADE_EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * "Upgrade to Paid Plan" link (the banner and the lock overlays) with what the trial
 * form can fill in, for example
 *   …/trial-subscription?website=example.com&email=dev@example.com&first_name=Jane&last_name=Doe
 * website is the website shown, email the admin's email (only a valid one), first_name the
 * first word of the admin's name and last_name the rest. Empty values are left out.
 */
export function upgradeUrl(website: string, name: string, email: string): string {
  const words = String(name || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
  const cleanEmail = String(email || '').trim()
  const query = [
    ['website', website],
    ['email', UPGRADE_EMAIL_RE.test(cleanEmail) ? cleanEmail : ''],
    ['first_name', words[0] || ''],
    ['last_name', words.slice(1).join(' ')],
  ]
    .filter((pair) => pair[1] !== '')
    .map((pair) => `${pair[0]}=${encodeURIComponent(pair[1]).replace(/%40/g, '@')}`)
    .join('&')

  if (!query) {
    return AIOA_UPGRADE_URL
  }
  return AIOA_UPGRADE_URL + (AIOA_UPGRADE_URL.includes('?') ? '&' : '?') + query
}

/** "#abc" / "aabbcc" -> "AABBCC", or null when the value is not a hex color */
export function parseHex(value: unknown): string | null {
  let hex = String(value ?? '')
    .trim()
    .replace(/^#/, '')
  if (/^[0-9a-f]{3}$/i.test(hex)) {
    hex = hex
      .split('')
      .map((c) => c + c)
      .join('')
  }
  return /^[0-9a-f]{6}$/i.test(hex) ? hex.toUpperCase() : null
}

/**
 * Saved widget position -> grid value. Older saves use the spelling
 * "middel_left" / "middel_right"; the grid uses "middle_left" / "middle_right".
 */
export function positionValue(value: unknown): string {
  return String(value ?? '').replace(/^middel_/, 'middle_')
}

/** Whole number from a field or API value ("40", 40.7, "0.500" -> 40, 40, 0); fallback when empty or not a number */
export function wholeNumber<T>(value: unknown, fallback: T): number | T {
  if (value === null || value === undefined || String(value).trim() === '') {
    return fallback
  }
  const number = Math.trunc(Number(value))
  return Number.isFinite(number) ? number : fallback
}

/** Element id slug: "top_left" => "top-left", "aioa-extra-small-icon" => "extra-small". */
export function aioaSlug(value: string): string {
  return value.replaceAll('aioa-', '').replaceAll('-icon', '').replaceAll('_', '-')
}

/** localStorage that never throws (storage may be blocked) */
export const storage = {
  get(key: string): string {
    try {
      return window.localStorage.getItem(key) || ''
    } catch {
      return ''
    }
  },
  set(key: string, value: string): void {
    try {
      window.localStorage.setItem(key, value)
    } catch {
      // storage blocked
    }
  },
  remove(key: string): void {
    try {
      window.localStorage.removeItem(key)
    } catch {
      // storage blocked
    }
  },
}

/** An error with the "pending" flag: the website is registered, but its settings are not ready yet */
export class PendingError extends Error {
  pending = true as const
}
