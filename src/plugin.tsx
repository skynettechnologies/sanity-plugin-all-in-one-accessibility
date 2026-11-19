/**
 * ---------------------------------------------------------------------------
 * All in One Accessibility - settings tool
 * ---------------------------------------------------------------------------
 * The All in One Accessibility® settings page as a Sanity Studio tool. Same
 * behavior as the reference app (docs/APP.md):
 *
 *   1. The website's settings load (fetchWidgetSettings). Loading never registers.
 *   2. A website that is not registered yet is registered for the free widget
 *      once: ipapi.co tells whether the admin is in the EU (no_required_eu), then
 *      registerDomain (add-user-domain) runs with the admin's name and email.
 *   3. The saved settings, the plan banner and the tabs for the plan are shown:
 *        free plan  Appearance Design · Paid Features · Accessibility Score (last two locked)
 *        paid plan  Accessibility Score · Paid Features · Appearance Design, plus "Dashboard"
 *   4. Save Changes sends the form to widget-setting-update-platform.
 *
 * Website:  the plugin's websiteUrl option, otherwise the Studio's own hostname
 *           (a domain or localhost, never an IP address).
 * Admin:    the plugin's username / email options, otherwise the signed-in Sanity user.
 * Theme:    follows the Studio appearance (System / Dark / Light), live (./theme.ts).
 */

/* eslint-disable camelcase -- field names are the Skynet API's (snake_case) */

import {useCallback, useEffect, useMemo, useRef, useState} from 'react'
import {type Tool, useCurrentUser} from 'sanity'

import {
  type ErrorResult,
  fetchWidgetSettings,
  getDashboardLink,
  getScanDetails,
  isObject,
  noRequiredEu,
  registerDomain,
  saveSettings,
  toInt,
  type WidgetSettings,
} from './api'
import {type AppearanceRefs, AppearanceTab} from './components/AppearanceTab'
import {cssVars} from './components/fields'
import {
  Header,
  PaidBanner,
  SiteStrip,
  TAB_ORDER,
  Tabs,
  UpgradeBanner,
  UpgradeUrlContext,
} from './components/Layout'
import {PaidFeaturesTab, type PaidRefs} from './components/PaidFeaturesTab'
import {ScoreTab, type ScoreView} from './components/ScoreTab'
import {ToastRegion, useToasts} from './components/Toasts'
import {REGISTER_AGAIN_AFTER, STORAGE_REGISTERED, STORAGE_TAB} from './config'
import {
  appearanceFrom,
  type AppearanceState,
  collect,
  emptyAppearance,
  type FocusTarget,
  paidFrom,
  type PaidState,
  problemToast,
  type TabName,
} from './form'
import {AIOA_CSS} from './styles'
import {useTheme} from './theme'
import {
  isValidDomain,
  normalizeDomain,
  PendingError,
  platformValue,
  storage,
  upgradeUrl,
} from './util'

/** Options of AllinOneAccessibilityPlugin() in sanity.config */
export interface AllinOneAccessibilityOptions {
  /** Website domain whose widget is set up, e.g. "www.example.com". Default: the Studio's hostname. */
  websiteUrl?: string
  /** Admin name sent once, when a new website is registered. Default: the signed-in user's name. */
  username?: string
  /** Admin email sent once, when a new website is registered. Default: the signed-in user's email. */
  email?: string
}

type View =
  | {name: 'load'}
  | {name: 'error'; title: string; message: string; retry: boolean}
  | {name: 'settings'}

const TABS: TabName[] = ['appearance', 'paid', 'score']

/** API answer -> result, or a thrown error (PendingError: the website is still being set up) */
function checkResult<T extends object>(result: T | ErrorResult): T {
  if (!isObject(result)) {
    throw new Error('Unexpected response from the server.')
  }
  if ('error' in result && typeof result.error === 'string') {
    throw result.pending ? new PendingError(result.error) : new Error(result.error)
  }
  return result as T
}

export default function SettingsPage({tool}: {tool?: Tool<AllinOneAccessibilityOptions>}) {
  const options = tool?.options ?? {}
  const currentUser = useCurrentUser()

  /* ---------- Website and admin ---------- */

  // An invalid websiteUrl never falls back to the hostname
  const activeDomain = useMemo(() => {
    const domain = normalizeDomain(platformValue(options.websiteUrl) || window.location.hostname)
    return isValidDomain(domain) ? domain : ''
  }, [options.websiteUrl])

  const adminName = platformValue(options.username) || currentUser?.name || ''
  const adminEmail = platformValue(options.email) || currentUser?.email || ''

  // Read when the website is registered (the latest values)
  const admin = useRef({name: '', email: ''})
  admin.current = {name: adminName, email: adminEmail}

  // "Upgrade to Paid Plan" links: carry the website, email and name to the trial form
  const upgradeHref = useMemo(
    () => upgradeUrl(activeDomain, adminName, adminEmail),
    [activeDomain, adminName, adminEmail],
  )

  /* ---------- Theme: the Studio appearance; the toggle changes it ---------- */

  const {theme, toggleTheme} = useTheme()

  /* ---------- State ---------- */

  const {toasts, toast, dismiss} = useToasts()
  const [view, setView] = useState<View>({name: 'load'})
  const [isPaid, setIsPaid] = useState(false)
  const [tab, setTab] = useState<TabName>('appearance')
  const [appearance, setAppearance] = useState<AppearanceState>(emptyAppearance)
  const [paid, setPaid] = useState<PaidState>(() => paidFrom({}))
  const [dirty, setDirty] = useState(false)
  const [saving, setSaving] = useState(false)
  const [score, setScore] = useState<ScoreView>({status: 'idle'})
  const [dashboardBusy, setDashboardBusy] = useState(false)

  // Latest form values for Save Changes
  const latest = useRef({appearance, paid, isPaid})
  latest.current = {appearance, paid, isPaid}

  const updateAppearance = useCallback((patch: Partial<AppearanceState>) => {
    setAppearance((state) => ({...state, ...patch}))
    setDirty(true)
  }, [])
  const setAppearanceQuietly = useCallback((patch: Partial<AppearanceState>) => {
    setAppearance((state) => ({...state, ...patch}))
  }, [])
  const updatePaid = useCallback((patch: Partial<PaidState>) => {
    setPaid((state) => ({...state, ...patch}))
    setDirty(true)
  }, [])
  const setPaidQuietly = useCallback((patch: Partial<PaidState>) => {
    setPaid((state) => ({...state, ...patch}))
  }, [])

  /* ---------- Focus (first invalid field) ---------- */

  const appearanceRefs: AppearanceRefs = {
    colorcode: useRef<HTMLInputElement>(null),
    iconSizeCustom: useRef<HTMLInputElement>(null),
    x: useRef<HTMLInputElement>(null),
    y: useRef<HTMLInputElement>(null),
  }
  const paidRefs: PaidRefs = {
    mx: useRef<HTMLInputElement>(null),
    my: useRef<HTMLInputElement>(null),
    statement_link: useRef<HTMLInputElement>(null),
    report_problem_link: useRef<HTMLInputElement>(null),
  }
  const pendingFocus = useRef<FocusTarget | null>(null)

  // After the render that shows the field's tab
  useEffect(() => {
    const target = pendingFocus.current
    if (target) {
      pendingFocus.current = null
      const refs: Record<FocusTarget, {current: HTMLInputElement | null}> = {
        ...appearanceRefs,
        ...paidRefs,
      }
      refs[target].current?.focus()
    }
  })

  /* ---------- Tabs ---------- */

  /** Show a tab chosen by the admin, and remember it for the next visit */
  const selectTab = useCallback((name: TabName) => {
    setTab(name)
    storage.set(STORAGE_TAB, name)
  }, [])

  /* ---------- Dashboard (paid plans) ---------- */

  // The one getDashboardLink request of this page, the link once loaded, or why it failed
  const dashboard = useRef<{request: Promise<string> | null; link: string; failure: Error | null}>({
    request: null,
    link: '',
    failure: null,
  })

  const loadDashboard = useCallback(() => {
    if (dashboard.current.request) {
      return
    }
    const request = getDashboardLink(activeDomain).then((result) => {
      const value = 'link' in result ? result.link : ''
      // Only ever open an https link
      if (!value || !/^https:\/\//i.test(value)) {
        throw new Error(('error' in result && result.error) || 'Unable to load the dashboard link.')
      }
      dashboard.current.link = value
      return value
    })
    dashboard.current.request = request
    request.catch((err: Error) => {
      dashboard.current.failure = err
    })
  }, [activeDomain])

  /** Point a tab at the link; when the browser blocked the tab, offer the link in a toast */
  const openIn = (win: Window | null, url: string) => {
    if (win && !win.closed) {
      win.opener = null
      win.location.href = url
    } else {
      toast('success', 'Your dashboard link is ready', 'Your browser blocked the new tab.', {
        href: url,
        label: 'Open dashboard',
      })
    }
  }

  const showDashboardError = (err: unknown) => {
    const reason =
      err instanceof TypeError
        ? 'Please check your connection.'
        : (err instanceof Error && err.message) || ''
    toast(
      'error',
      'Could not open the dashboard',
      `${reason ? `${reason} ` : ''}Reload the page to try again.`,
    )
  }

  const openDashboard = () => {
    const {link, failure, request} = dashboard.current
    if (link) {
      openIn(window.open('', '_blank'), link)
      return
    }
    if (failure || !request) {
      showDashboardError(failure)
      return
    }

    // Still loading: open the tab now (inside the click, so popup blockers allow it)
    // and point it at the link when the request that is already running finishes
    const win = window.open('', '_blank')
    if (win) {
      try {
        win.document.title = 'Opening dashboard…'
        win.document.body.style.cssText =
          'font-family:system-ui,sans-serif;display:grid;place-items:center;min-height:90vh;color:#420083'
        win.document.body.textContent = 'Opening your All in One Accessibility dashboard…'
      } catch {
        // the new tab is not scriptable, the link still works
      }
    }
    setDashboardBusy(true)
    request
      .then((url) => openIn(win, url))
      .catch((err) => {
        if (win && !win.closed) {
          win.close()
        }
        showDashboardError(err)
      })
      .finally(() => setDashboardBusy(false))
  }

  /* ---------- Load and register ---------- */

  const register = useRef<{promise: Promise<WidgetSettings> | null; settled: boolean}>({
    promise: null,
    settled: false,
  })
  const euRequest = useRef<Promise<string> | null>(null)

  const showError = useCallback(
    (message: string, title = "We couldn't load your widget settings") => {
      setView({name: 'error', title, message, retry: Boolean(activeDomain)})
    },
    [activeDomain],
  )

  /**
   * Register the free widget for the website, at most once: once per page, and not
   * again within 10 minutes (also after a reload) while its settings are syncing.
   */
  const registerWebsite = useCallback((): Promise<WidgetSettings> => {
    const current = register.current
    if (current.promise && !current.settled) {
      return current.promise // already running (e.g. a second load while registering)
    }
    const sentAt = Number(storage.get(STORAGE_REGISTERED + activeDomain)) || 0
    if (current.promise || (sentAt > 0 && Date.now() - sentAt < REGISTER_AGAIN_AFTER)) {
      return Promise.reject(
        new PendingError(
          'Your website was just registered, and its settings are not ready yet. Please try again in a moment.',
        ),
      )
    }
    storage.set(STORAGE_REGISTERED + activeDomain, String(Date.now()))

    // ipapi.co: at most once per page
    euRequest.current ??= noRequiredEu()
    const promise = euRequest.current
      .then((noRequiredEuValue) =>
        registerDomain({
          url: activeDomain,
          username: admin.current.name,
          email: admin.current.email,
          noRequiredEu: noRequiredEuValue,
        }),
      )
      .then((result) => checkResult<WidgetSettings>(result))

    current.promise = promise
    current.settled = false
    const settle = () => {
      current.settled = true
    }
    promise.then(settle, settle)
    return promise
  }, [activeDomain])

  /** Show the saved settings, the plan (banner, tab order and locks) and the site line */
  const applyResult = useCallback(
    (result: WidgetSettings) => {
      storage.remove(STORAGE_REGISTERED + activeDomain) // registered: nothing left to wait for

      // 1 = free plan, anything else = paid plan
      const paidPlan = toInt(result.is_free_widget) !== 1
      const order = paidPlan ? TAB_ORDER.paid : TAB_ORDER.free
      const stored = storage.get(STORAGE_TAB) as TabName

      setAppearance(appearanceFrom(result))
      setPaid(paidFrom(result))
      setIsPaid(paidPlan)
      setTab(TABS.includes(stored) ? stored : order[0])
      setDirty(false)
      setView({name: 'settings'})

      // Paid plan: load the Dashboard link now, so the button opens it without waiting
      if (paidPlan) {
        loadDashboard()
      }
    },
    [activeDomain, loadDashboard],
  )

  const loadSettings = useCallback(() => {
    if (!activeDomain) {
      showError(
        'No valid website domain was found. Set websiteUrl in the plugin options in sanity.config, or open the Studio on your website domain or on localhost (not an IP address).',
        'A valid domain is required',
      )
      return
    }

    setView({name: 'load'})

    fetchWidgetSettings(activeDomain)
      .then((result) => checkResult(result))
      .then((result) =>
        'not_registered' in result && result.not_registered
          ? registerWebsite()
          : (result as WidgetSettings),
      )
      .then(applyResult)
      .catch((err: unknown) => {
        if (err instanceof PendingError) {
          showError(err.message, 'Your widget is being set up')
        } else {
          showError((err instanceof Error && err.message) || 'Please try again.')
        }
      })
  }, [activeDomain, applyResult, registerWebsite, showError])

  // Start once (React StrictMode runs effects twice in development)
  const started = useRef(false)
  useEffect(() => {
    if (!started.current) {
      started.current = true
      loadSettings()
    }
  }, [loadSettings])

  /* ---------- Accessibility Score (paid plans) ---------- */

  const scoreLoaded = useRef(false)

  /** Load the score of the website (once, unless forced by Try again) */
  const loadScore = useCallback(
    (force = false) => {
      if (!isPaid || (scoreLoaded.current && !force)) {
        return
      }
      scoreLoaded.current = true
      setScore({status: 'loading'})

      getScanDetails(activeDomain)
        .then((result) => {
          const summary = checkResult(result)
          if ('no_scan' in summary) {
            setScore({status: 'empty'}) // not scanned yet, or the scan is still running
            return
          }
          setScore({status: 'ready', summary})
        })
        .catch((err: unknown) => {
          scoreLoaded.current = false // try again the next time the tab opens
          setScore({
            status: 'error',
            message: (err instanceof Error && err.message) || 'Please try again.',
          })
        })
    },
    [activeDomain, isPaid],
  )

  useEffect(() => {
    if (view.name === 'settings' && tab === 'score') {
      loadScore()
    }
  }, [loadScore, tab, view.name])

  /* ---------- Save Changes ---------- */

  const save = () => {
    const current = latest.current
    const result = collect(current.appearance, current.paid, activeDomain, current.isPaid)
    setAppearance(result.appearance)
    setPaid(result.paid)

    // Every invalid field is marked in red; go to the first one and show one toast for all
    const [first] = result.problems
    if (first || !result.params) {
      if (first) {
        if (first.tab !== tab) {
          selectTab(first.tab)
        }
        pendingFocus.current = first.focus
        const {title, message} = problemToast(result.problems)
        toast('error', title, message)
      }
      return
    }

    setSaving(true)
    saveSettings(result.params)
      .then(() => {
        setDirty(false)
        toast(
          'success',
          'Settings saved successfully!',
          'It may take a few seconds for changes to appear on your website.',
        )
      })
      .catch(() => {
        toast('error', 'Something went wrong.', 'Your settings were not saved. Please try again.')
      })
      .finally(() => setSaving(false))
  }

  /* ---------- Render ---------- */

  // Nothing to save on the score tab, nor on the locked Paid Features tab (free plan)
  const showSave = tab === 'appearance' || (tab === 'paid' && isPaid)

  return (
    <div
      className="aioa-root"
      data-theme={theme}
      style={cssVars({'--widget-color': `#${appearance.color}`})}
    >
      <style>{AIOA_CSS}</style>

      <div className="aioa-page">
        <Header theme={theme} onToggleTheme={toggleTheme} />

        <main>
          {view.name === 'load' && (
            <div className="aioa-loading" role="status">
              <span className="aioa-spinner" aria-hidden="true" />
              <span>Loading your widget settings…</span>
            </div>
          )}

          {view.name === 'error' && (
            <section className="aioa-card aioa-error-card">
              <h2>{view.title}</h2>
              <p>{view.message}</p>
              {view.retry && (
                <button type="button" className="aioa-btn aioa-btn-primary" onClick={loadSettings}>
                  Try again
                </button>
              )}
            </section>
          )}

          {view.name === 'settings' && (
            <UpgradeUrlContext.Provider value={upgradeHref}>
              {isPaid ? (
                <PaidBanner busy={dashboardBusy} onDashboard={openDashboard} />
              ) : (
                <UpgradeBanner />
              )}
              <SiteStrip domain={activeDomain} />

              <Tabs
                order={isPaid ? TAB_ORDER.paid : TAB_ORDER.free}
                current={tab}
                locked={!isPaid}
                onSelect={selectTab}
              />

              {/* Enter never submits the form */}
              <form className="aioa-form" noValidate onSubmit={(e) => e.preventDefault()}>
                <div
                  className="aioa-tabpanel"
                  role="tabpanel"
                  id="aioa-panel-appearance"
                  aria-labelledby="aioa-tab-appearance"
                  tabIndex={0}
                  hidden={tab !== 'appearance'}
                >
                  <AppearanceTab
                    state={appearance}
                    update={updateAppearance}
                    setQuietly={setAppearanceQuietly}
                    refs={appearanceRefs}
                  />
                </div>

                <div
                  className="aioa-tabpanel"
                  role="tabpanel"
                  id="aioa-panel-paid"
                  aria-labelledby="aioa-tab-paid"
                  tabIndex={0}
                  hidden={tab !== 'paid'}
                >
                  <PaidFeaturesTab
                    state={paid}
                    locked={!isPaid}
                    iconType={appearance.iconType}
                    update={updatePaid}
                    setQuietly={setPaidQuietly}
                    refs={paidRefs}
                  />
                </div>

                <div
                  className="aioa-tabpanel"
                  role="tabpanel"
                  id="aioa-panel-score"
                  aria-labelledby="aioa-tab-score"
                  tabIndex={0}
                  hidden={tab !== 'score'}
                >
                  <ScoreTab locked={!isPaid} view={score} onRetry={() => loadScore(true)} />
                </div>

                {/* Save bar; stays at the bottom of the screen while scrolling */}
                <div className="aioa-save-area" hidden={!showSave}>
                  <div className={`aioa-savebar${dirty ? ' is-dirty' : ''}`}>
                    <p className="aioa-save-state">
                      <i aria-hidden="true" />
                      <span>{dirty ? 'You have unsaved changes' : 'All changes saved'}</span>
                    </p>
                    <button
                      type="button"
                      className="aioa-btn aioa-btn-primary"
                      disabled={saving}
                      aria-busy={saving || undefined}
                      onClick={save}
                    >
                      {saving ? (
                        <>
                          <span className="aioa-spinner" aria-hidden="true" />
                          <span>Saving…</span>
                        </>
                      ) : (
                        'Save Changes'
                      )}
                    </button>
                  </div>
                  <p className="aioa-after-note">
                    It may take a few seconds for changes to appear on your website. If you
                    don&apos;t see them, clear your browser cache or check in a private window.
                  </p>
                </div>
              </form>
            </UpgradeUrlContext.Provider>
          )}
        </main>
      </div>

      <ToastRegion toasts={toasts} onDismiss={dismiss} />
    </div>
  )
}
