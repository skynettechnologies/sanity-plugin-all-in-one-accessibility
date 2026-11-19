/**
 * Accessibility Score tab (accessibility-score and score/card partials of the
 * reference app). Paid plan: the scan results, loaded the first time the tab
 * opens. Free plan: a sample card, blurred, under the upgrade card.
 */

import type {ScoreSummary} from '../api'
import {cssVars} from './fields'
import {Lockable} from './Layout'

export type ScoreView =
  | {status: 'idle'}
  | {status: 'loading'}
  | {status: 'error'; message: string}
  | {status: 'empty'}
  | {status: 'ready'; summary: ScoreSummary}

const LEVELS = ['compliant', 'semi', 'not']

/** Card values (strings as shown) */
interface CardValues {
  level: string
  status: string
  score: number
  violationsPct: string
  violationsCount: string
  altPct: string
  altCount: string
  pages: string
  pagesCount: string
  lastScan: string
  reportUrl: string
}

/** Example values behind the free plan blur */
const SAMPLE: CardValues = {
  level: 'compliant',
  status: 'Compliant',
  score: 98,
  violationsPct: '86.36%',
  violationsCount: '38 / 44',
  altPct: '0%',
  altCount: '0 / 0',
  pages: '13',
  pagesCount: '13 / 13',
  lastScan: '',
  reportUrl: '',
}

const num = (value: unknown) => Number(value) || 0

/** 96.15 -> "96.15%", 100 -> "100%" */
function percent(value: unknown): string {
  return `${Math.round(num(value) * 100) / 100}%`
}

/** "2026-06-27 05:24:30" (UTC) -> "Jun 27, 2026" */
function formatDate(value: string): string {
  const date = new Date(`${String(value).replace(' ', 'T')}Z`)
  return isNaN(date.getTime())
    ? ''
    : date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        timeZone: 'UTC',
      })
}

function valuesFrom(summary: ScoreSummary): CardValues {
  const violations = summary.violations || {}
  const altText = summary.alt_text || {}
  const pages = summary.pages || {}
  return {
    level: LEVELS.includes(summary.level) ? summary.level : 'not',
    status: summary.status || '',
    // Up to 99, never 100 (the summary is capped the same way)
    score: Math.max(0, Math.min(99, Math.round(num(summary.score)))),
    violationsPct: percent(violations.percentage),
    violationsCount: `${num(violations.fixed)} / ${num(violations.total)}`,
    altPct: percent(altText.percentage),
    altCount: `${num(altText.fixed)} / ${num(altText.total)}`,
    pages: String(num(pages.scanned)),
    pagesCount: `${num(pages.scanned)} / ${num(pages.total)}`,
    lastScan: formatDate(summary.last_scan),
    // Only https report links are offered
    reportUrl: /^https:\/\//i.test(summary.report_url || '') ? summary.report_url : '',
  }
}

export function ScoreTab({
  locked,
  view,
  onRetry,
}: {
  locked: boolean
  view: ScoreView
  onRetry: () => void
}) {
  if (locked) {
    return (
      <Lockable locked lockId="aioa-score-lock" center>
        <div aria-hidden="true">
          <ScoreCard values={SAMPLE} sample />
        </div>
      </Lockable>
    )
  }

  switch (view.status) {
    case 'ready':
      return <ScoreCard values={valuesFrom(view.summary)} />
    case 'error':
      return (
        <section className="aioa-card aioa-error-card">
          <h2>We couldn&apos;t load your accessibility score</h2>
          <p>{view.message}</p>
          <button type="button" className="aioa-btn aioa-btn-primary" onClick={onRetry}>
            Try again
          </button>
        </section>
      )
    case 'empty':
      return (
        <section className="aioa-card aioa-error-card">
          <h2>Scanning in progress</h2>
          <p>
            Website scanning is in progress. It may take a few days, depending on the number of web
            pages and other factors. Once it is complete, the system will send a confirmation to
            your registered email.
          </p>
        </section>
      )
    default:
      return (
        <div className="aioa-loading aioa-card" role="status">
          <span className="aioa-spinner" aria-hidden="true" />
          <span>Loading your accessibility score…</span>
        </div>
      )
  }
}

/** Status, score ring and three figures */
function ScoreCard({values, sample = false}: {values: CardValues; sample?: boolean}) {
  const stats: [string, string, string][] = [
    [values.violationsPct, values.violationsCount, 'Violations Remediated'],
    [values.altPct, values.altCount, 'Alt Text Remediated'],
    [values.pages, values.pagesCount, 'Web Pages Scanned'],
  ]
  const label = `Accessibility score ${values.score}%${values.status && !sample ? `, ${values.status}` : ''}`

  return (
    <section
      className="aioa-card aioa-score"
      data-level={values.level}
      aria-labelledby={sample ? undefined : 'aioa-score-title'}
    >
      <div className="aioa-score-head">
        <h2 id={sample ? undefined : 'aioa-score-title'}>Accessibility Score</h2>
        <p className="aioa-score-status">{values.status}</p>
      </div>

      <div className="aioa-score-body">
        {/* Score ring: --p is the score in percent */}
        <div
          className="aioa-donut"
          style={cssVars({'--p': values.score})}
          role="img"
          aria-label={label}
        >
          <svg viewBox="0 0 120 120" aria-hidden="true">
            <circle className="aioa-donut-track" cx="60" cy="60" r="52" />
            <circle className="aioa-donut-bar" cx="60" cy="60" r="52" pathLength={100} />
          </svg>
          <span className="aioa-donut-value" aria-hidden="true">
            <b>{values.score}</b>
            <small>%</small>
          </span>
        </div>

        <div className="aioa-score-stats">
          {stats.map(([value, count, statLabel]) => (
            <div key={statLabel} className="aioa-stat">
              <p className="aioa-stat-value">{value}</p>
              <p className="aioa-stat-label">{statLabel}</p>
              <p className="aioa-stat-count">{count}</p>
            </div>
          ))}
        </div>
      </div>

      {!sample && (
        <p className="aioa-score-foot">
          <span>{values.lastScan ? `Last scan: ${values.lastScan}` : ''}</span>
          {values.reportUrl && (
            <a href={values.reportUrl} target="_blank" rel="noopener noreferrer">
              Download PDF report<span className="visually-hidden"> (opens in a new tab)</span>
            </a>
          )}
        </p>
      )}
    </section>
  )
}
