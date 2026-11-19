/**
 * Paid Features tab: widget position for mobile, the two custom links and the
 * two widget switches (paid-features, paid/* partials of the reference app).
 * Free plan: blurred and inert under the upgrade card.
 */

/* eslint-disable camelcase -- field names are the Skynet API's (snake_case) */

import type {ReactNode, RefObject} from 'react'

import {
  checkLink,
  LINK_PLACEHOLDERS,
  type LinkName,
  mobileExact,
  type MobileXDir,
  type MobileYDir,
  OFFSET_MAX,
  type PaidState,
  POSITION_MESSAGE,
} from '../form'
import {iconUrl} from '../icons'
import {PositionGrid, WholeNumberInput} from './fields'
import {LinkIcon, ReportIcon, StatementIcon} from './icons'
import {Lockable} from './Layout'

export type PaidRefs = {
  mx: RefObject<HTMLInputElement | null>
  my: RefObject<HTMLInputElement | null>
  statement_link: RefObject<HTMLInputElement | null>
  report_problem_link: RefObject<HTMLInputElement | null>
}

type Update = (patch: Partial<PaidState>) => void

interface Props {
  state: PaidState
  locked: boolean
  iconType: string
  /** Change the form (marks it as unsaved) */
  update: Update
  /** Change the form without marking it as unsaved (blur checks) */
  setQuietly: Update
  refs: PaidRefs
}

export function PaidFeaturesTab({state, locked, iconType, update, setQuietly, refs}: Props) {
  const linkProps = {state, update, setQuietly, refs}
  return (
    <Lockable locked={locked} lockId="aioa-paid-lock" contentClassName="aioa-stack">
      <MobilePosition state={state} iconType={iconType} update={update} refs={refs} />
      <LinkCard
        name="statement_link"
        title="Enter custom accessibility statement link"
        icon={<StatementIcon />}
        {...linkProps}
      />
      <LinkCard
        name="report_problem_link"
        title="Enter custom report a problem link"
        icon={<ReportIcon />}
        {...linkProps}
      />
      <div className="aioa-pair">
        <ToggleCard
          id="aioa-widget-leave-page"
          label="Enable External Link Navigation On Widget"
          checked={state.widget_leave_page}
          onChange={(widget_leave_page) => update({widget_leave_page})}
        />
        <ToggleCard
          id="aioa-is-sound-disabled"
          label="Disable Open Close sound on Widget"
          checked={state.is_sound_disabled}
          onChange={(is_sound_disabled) => update({is_sound_disabled})}
        />
      </div>
    </Lockable>
  )
}

/* ---------- Widget position for mobile ---------- */

function MobilePosition({
  state,
  iconType,
  update,
  refs,
}: Pick<Props, 'state' | 'iconType' | 'update' | 'refs'>) {
  /** Switch / exact-position changes: the "required" marks go away when the exact position is no longer used */
  const setMode = (patch: Partial<PaidState>) => {
    const next = {...state, ...patch}
    update(mobileExact(next) ? patch : {...patch, mobileCheck: false})
  }
  // Once the "required" message shows, the marks follow what is typed
  const setOffset = (patch: Partial<PaidState>) => {
    const next = {...state, ...patch}
    update(
      state.mobileCheck
        ? {...patch, mobileCheck: next.mx.trim() === '' || next.my.trim() === ''}
        : patch,
    )
  }
  const xInvalid = state.mobileCheck && state.mx.trim() === ''
  const yInvalid = state.mobileCheck && state.my.trim() === ''

  return (
    <section className="aioa-card" aria-labelledby="aioa-mobile-position-title">
      <div className="aioa-switch-head">
        <input
          type="checkbox"
          role="switch"
          className="aioa-switch"
          id="aioa-is-mobile-position"
          checked={state.mobilePosition}
          aria-controls="aioa-mobile-position-body"
          onChange={(e) => setMode({mobilePosition: e.target.checked})}
        />
        <h2 id="aioa-mobile-position-title">
          <label htmlFor="aioa-is-mobile-position">Widget position for mobile</label>
        </h2>
      </div>

      <div
        className="aioa-mobile-body"
        id="aioa-mobile-position-body"
        hidden={!state.mobilePosition}
      >
        {/* Preset grid <-> exact offsets */}
        <label className="aioa-check">
          <input
            type="checkbox"
            checked={state.customPositionMobile}
            aria-controls="aioa-mobile-custom aioa-mobile-preset"
            onChange={(e) => setMode({customPositionMobile: e.target.checked})}
          />
          Set an exact position in pixels
        </label>

        <PositionGrid
          id="aioa-mobile-preset"
          name="aioa_position_mobile"
          idPrefix="aioa-mobile-position"
          legend="Widget icon position on mobile"
          centerLabel="Mobile view"
          phone
          value={state.positionMobile}
          iconSrc={iconUrl(iconType)}
          hidden={state.customPositionMobile}
          onChange={(positionMobile) => update({positionMobile})}
        />

        {/* Exact offsets */}
        <div className="aioa-subpanel" id="aioa-mobile-custom" hidden={!state.customPositionMobile}>
          <div className="aioa-offset-row">
            <label className="aioa-label" htmlFor="aioa-mobile-x">
              Horizontal
            </label>
            <div className={`aioa-affix${xInvalid ? ' is-invalid' : ''}`}>
              <WholeNumberInput
                ref={refs.mx}
                id="aioa-mobile-x"
                clampMax={OFFSET_MAX}
                value={state.mx}
                aria-describedby="aioa-mobile-range-hint aioa-mobile-pos-error"
                aria-invalid={xInvalid}
                onValueChange={(mx) => setOffset({mx})}
              />
              <span className="aioa-affix-text" aria-hidden="true">
                px
              </span>
            </div>
            <select
              className="aioa-select"
              aria-label="Horizontal direction (mobile)"
              value={state.mxDir}
              onChange={(e) => update({mxDir: e.target.value as MobileXDir})}
            >
              <option value="left">To the left</option>
              <option value="right">To the right</option>
              <option value="center">Center</option>
            </select>
          </div>
          <div className="aioa-offset-row">
            <label className="aioa-label" htmlFor="aioa-mobile-y">
              Vertical
            </label>
            <div className={`aioa-affix${yInvalid ? ' is-invalid' : ''}`}>
              <WholeNumberInput
                ref={refs.my}
                id="aioa-mobile-y"
                clampMax={OFFSET_MAX}
                value={state.my}
                aria-describedby="aioa-mobile-range-hint aioa-mobile-pos-error"
                aria-invalid={yInvalid}
                onValueChange={(my) => setOffset({my})}
              />
              <span className="aioa-affix-text" aria-hidden="true">
                px
              </span>
            </div>
            <select
              className="aioa-select"
              aria-label="Vertical direction (mobile)"
              value={state.myDir}
              onChange={(e) => update({myDir: e.target.value as MobileYDir})}
            >
              <option value="top">To the top</option>
              <option value="bottom">To the bottom</option>
            </select>
          </div>
          <p className="aioa-hint" id="aioa-mobile-range-hint">
            0 - 250px are permitted values
          </p>
          <p className="aioa-error" id="aioa-mobile-pos-error" hidden={!state.mobileCheck}>
            {state.mobileCheck ? POSITION_MESSAGE : ''}
          </p>
        </div>
      </div>
    </section>
  )
}

/* ---------- Custom links ---------- */

function LinkCard({
  name,
  title,
  icon,
  state,
  update,
  setQuietly,
  refs,
}: Pick<Props, 'state' | 'update' | 'setQuietly' | 'refs'> & {
  name: LinkName
  title: string
  icon: ReactNode
}) {
  const id = `aioa-${name}`
  const error = state.linkErrors[name]

  return (
    <section className="aioa-card" aria-labelledby={`${id}-title`}>
      <h2 className="aioa-feature-title" id={`${id}-title`}>
        <span className="aioa-feature-icon" aria-hidden="true">
          {icon}
        </span>
        <label htmlFor={id}>{title}</label>
      </h2>
      <div className={`aioa-affix aioa-link-input${error ? ' is-invalid' : ''}`}>
        <span className="aioa-affix-icon" aria-hidden="true">
          <LinkIcon />
        </span>
        <input
          ref={refs[name]}
          type="url"
          id={id}
          inputMode="url"
          autoComplete="off"
          spellCheck={false}
          placeholder={LINK_PLACEHOLDERS[name]}
          aria-describedby={`${id}-error`}
          aria-invalid={Boolean(error)}
          value={state[name]}
          onChange={(e) =>
            update({[name]: e.target.value, linkErrors: {...state.linkErrors, [name]: ''}})
          }
          onBlur={(e) => {
            // A link typed without a scheme gets https:// added
            const [value, linkError] = checkLink(name, e.target.value)
            setQuietly({[name]: value, linkErrors: {...state.linkErrors, [name]: linkError}})
          }}
        />
      </div>
      <p className="aioa-error" id={`${id}-error`} hidden={!error}>
        {error}
      </p>
    </section>
  )
}

/* ---------- Switches ---------- */

function ToggleCard({
  id,
  label,
  checked,
  onChange,
}: {
  id: string
  label: string
  checked: boolean
  onChange: (value: boolean) => void
}) {
  return (
    <label className="aioa-card aioa-toggle-card" htmlFor={id}>
      <input
        type="checkbox"
        role="switch"
        className="aioa-switch"
        id={id}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span>{label}</span>
    </label>
  )
}
