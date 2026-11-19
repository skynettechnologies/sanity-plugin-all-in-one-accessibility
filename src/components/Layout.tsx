/**
 * Page chrome: header, plan banners, site line, tabs and the free plan lock.
 * Same markup and classes as the reference partials (header, upgrade-banner,
 * paid-banner, site-strip, tabs, lock).
 */

import {
  createContext,
  type KeyboardEvent,
  type ReactNode,
  useContext,
  useEffect,
  useRef,
} from 'react'

import {AIOA_UPGRADE_URL} from '../config'
import type {TabName} from '../form'
import {ArrowIcon, LockIcon, LogoIcon, MoonIcon, SunIcon, WatermarkIcon} from './icons'

/**
 * "Upgrade to Paid Plan" link with the website, email and name (upgradeUrl in ../util),
 * used by the upgrade banner and the lock overlays of the paid tabs.
 */
export const UpgradeUrlContext = createContext(AIOA_UPGRADE_URL)

/* ---------- Header ---------- */

export function Header({
  theme,
  onToggleTheme,
}: {
  theme: 'light' | 'dark'
  onToggleTheme: () => void
}) {
  const label = theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
  return (
    <header className="aioa-header">
      <div className="aioa-brand">
        <LogoIcon />
        <div>
          <h1>
            All in One Accessibility<sup>&reg;</sup>
          </h1>
          <p>Powered by Skynet Technologies</p>
        </div>
      </div>

      {/* Theme toggle: shows the moon in light mode and the sun in dark mode */}
      <button
        type="button"
        className="aioa-btn aioa-btn-icon aioa-theme-toggle"
        data-mode={theme}
        aria-label={label}
        title={label}
        onClick={onToggleTheme}
      >
        <MoonIcon />
        <SunIcon />
      </button>
    </header>
  )
}

/* ---------- Plan banners ---------- */

/** Free plan: purple "Upgrade to Paid Plan" banner */
export function UpgradeBanner() {
  const upgradeHref = useContext(UpgradeUrlContext)
  return (
    <section className="aioa-upgrade" aria-labelledby="aioa-upgrade-title">
      <WatermarkIcon />
      <div className="aioa-upgrade-head">
        <div className="aioa-upgrade-intro">
          <p className="aioa-upgrade-tag">
            <i aria-hidden="true" />
            Free plan active
          </p>
          <h2 id="aioa-upgrade-title">With 24 Features</h2>
          <p>
            Upgrade to unlock <strong>90+ Premium Accessibility Features</strong> and make your
            website even more inclusive.
          </p>
          <ul className="aioa-upgrade-points">
            <li>190+ Supported languages</li>
            <li>12 Accessibility Profiles</li>
          </ul>
        </div>
        <div className="aioa-upgrade-cta">
          <a
            href={upgradeHref}
            target="_blank"
            rel="noopener noreferrer"
            className="aioa-btn-white"
          >
            Upgrade to Paid Plan
            <ArrowIcon />
            <span className="visually-hidden">(opens in a new tab)</span>
          </a>
          <small>10-day free trial &middot; Cancel anytime</small>
        </div>
      </div>
      <p className="aioa-upgrade-note">
        <b>NOTE:</b> Currently, All in One Accessibility is dedicated to enhancing accessibility
        specifically for websites and online stores.
      </p>
    </section>
  )
}

/** Paid plan notice with the "Dashboard" button */
export function PaidBanner({
  busy,
  onDashboard,
}: {
  busy: boolean
  onDashboard: (button: HTMLButtonElement) => void
}) {
  return (
    <section className="aioa-notice" aria-labelledby="aioa-paid-title">
      <div className="aioa-notice-body">
        <p className="aioa-tag is-success">Paid plan active</p>
        <h2 id="aioa-paid-title">All pro features are unlocked</h2>
        <p>Manage features, accessibility reports and widget analytics from your dashboard.</p>
      </div>
      <div className="aioa-notice-action">
        <button
          type="button"
          className="aioa-btn aioa-btn-primary"
          disabled={busy}
          aria-busy={busy || undefined}
          onClick={(e) => onDashboard(e.currentTarget)}
        >
          {busy ? (
            <>
              <span className="aioa-spinner" aria-hidden="true" />
              <span>Opening…</span>
            </>
          ) : (
            <>
              Dashboard
              <span className="visually-hidden">(opens in a new tab)</span>
            </>
          )}
        </button>
      </div>
    </section>
  )
}

/** "Widget installed on <domain>" */
export function SiteStrip({domain}: {domain: string}) {
  return (
    <p className="aioa-site">
      <span className="aioa-site-dot" aria-hidden="true" />
      <span className="aioa-site-text">
        Widget installed on <strong>{domain}</strong>
      </span>
    </p>
  )
}

/* ---------- Tabs ---------- */

export const TAB_LABELS: Record<TabName, string> = {
  appearance: 'Appearance Design',
  paid: 'Paid Features',
  score: 'Accessibility Score',
}

/** Tab order per plan */
export const TAB_ORDER: Record<'paid' | 'free', TabName[]> = {
  paid: ['score', 'paid', 'appearance'],
  free: ['appearance', 'paid', 'score'],
}

/**
 * ARIA tabs: click a tab, or use the arrow keys, Home and End on the tab row.
 * The paid tabs show a lock badge while the plan is free.
 */
export function Tabs({
  order,
  current,
  locked,
  onSelect,
}: {
  order: TabName[]
  current: TabName
  locked: boolean
  onSelect: (tab: TabName, focus?: boolean) => void
}) {
  const refs = useRef<Partial<Record<TabName, HTMLButtonElement | null>>>({})

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const targets: Record<string, number> = {
      ArrowRight: index + 1,
      ArrowLeft: index - 1,
      Home: 0,
      End: order.length - 1,
    }
    const target = targets[e.key]
    if (target === undefined) {
      return
    }
    e.preventDefault()
    const tab = order[(target + order.length) % order.length]
    onSelect(tab)
    refs.current[tab]?.focus()
  }

  return (
    <div className="aioa-tabs" role="tablist" aria-label="Settings">
      {order.map((tab, index) => (
        <button
          key={tab}
          ref={(el) => {
            refs.current[tab] = el
          }}
          type="button"
          role="tab"
          className="aioa-tab"
          id={`aioa-tab-${tab}`}
          aria-controls={`aioa-panel-${tab}`}
          aria-selected={tab === current}
          tabIndex={tab === current ? 0 : -1}
          onClick={() => onSelect(tab)}
          onKeyDown={(e) => onKeyDown(e, index)}
        >
          <span className="aioa-tab-label">{TAB_LABELS[tab]}</span>
          {tab !== 'appearance' && locked && (
            <span className="aioa-tab-lock">
              <LockIcon />
              <span className="visually-hidden">(paid plan)</span>
            </span>
          )}
        </button>
      ))}
    </div>
  )
}

/* ---------- Free plan lock ---------- */

/**
 * A paid tab's content. On the free plan the content is blurred and inert
 * (cannot be focused or read out), with the upgrade card on top.
 */
export function Lockable({
  locked,
  lockId,
  center = false,
  children,
  contentClassName = '',
}: {
  locked: boolean
  lockId: string
  center?: boolean
  children: ReactNode
  contentClassName?: string
}) {
  const contentRef = useRef<HTMLDivElement>(null)
  const upgradeHref = useContext(UpgradeUrlContext)

  // Set as a DOM property: works with React 18 and 19
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.inert = locked
    }
  }, [locked])

  return (
    <div className={`aioa-lockable${locked ? ' is-locked' : ''}`}>
      <div ref={contentRef} className={`aioa-lock-content ${contentClassName}`.trim()}>
        {children}
      </div>
      {locked && (
        <div className={`aioa-lock${center ? ' is-center' : ''}`}>
          <div className="aioa-lock-card" role="group" aria-labelledby={`${lockId}-text`}>
            <span className="aioa-lock-icon" aria-hidden="true">
              <LockIcon />
            </span>
            <p className="aioa-lock-text" id={`${lockId}-text`}>
              Try a 10-day free trial to view all 90+ features.
            </p>
            <a
              href={upgradeHref}
              target="_blank"
              rel="noopener noreferrer"
              className="aioa-btn aioa-btn-primary"
            >
              Upgrade to Paid Plan
              <span className="visually-hidden">(opens in a new tab)</span>
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
