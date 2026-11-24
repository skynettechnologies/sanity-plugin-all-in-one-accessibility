/**
 * Appearance Design tab: widget color, widget size, widget position, icon type
 * and icon size (the settings/* partials of the reference app).
 */

import type {RefObject} from 'react'

import {
  AIOA_DEFAULT_COLOR,
  AIOA_ICON_SIZES,
  AIOA_ICON_TYPE_COUNT,
  AIOA_PRESET_COLORS,
} from '../config'
import {
  type AppearanceState,
  isValidIconSize,
  OFFSET_MAX,
  POSITION_HINT,
  POSITION_MESSAGE,
  SIZE_HINT,
  SIZE_MAX,
  SIZE_MESSAGE,
  SIZE_MIN,
  type XDir,
  type YDir,
} from '../form'
import {iconUrl} from '../icons'
import {aioaSlug, parseHex} from '../util'
import {cssVars, PositionGrid, WholeNumberInput} from './fields'

export type AppearanceRefs = {
  colorcode: RefObject<HTMLInputElement | null>
  iconSizeCustom: RefObject<HTMLInputElement | null>
  x: RefObject<HTMLInputElement | null>
  y: RefObject<HTMLInputElement | null>
}

type Update = (patch: Partial<AppearanceState>) => void

interface Props {
  state: AppearanceState
  /** Change the form (marks it as unsaved) */
  update: Update
  /** Change the form without marking it as unsaved (blur checks) */
  setQuietly: Update
  refs: AppearanceRefs
}

export function AppearanceTab({state, update, setQuietly, refs}: Props) {
  return (
    <>
      <div className="aioa-columns">
        <ColorSection state={state} update={update} setQuietly={setQuietly} refs={refs} />
        <WidgetSizeSection state={state} update={update} />
      </div>
      <PositionSection state={state} update={update} refs={refs} />
      <IconTypeSection state={state} update={update} />
      <IconSizeSection state={state} update={update} refs={refs} />
    </>
  )
}

/* ---------- Widget color ---------- */

/** Apply a color to the hex field, the picker, the presets and the previews */
export function colorPatch(value: string): Partial<AppearanceState> {
  const hex = parseHex(value) || AIOA_DEFAULT_COLOR
  return {color: hex, colorText: hex, colorError: false}
}

function ColorSection({state, update, setQuietly, refs}: Props) {
  return (
    <section className="aioa-card" aria-labelledby="aioa-color-title">
      <div className="aioa-card-head">
        <div>
          <h2 id="aioa-color-title">Widget color</h2>
          <p className="aioa-desc">Pick a color or enter a hex code.</p>
        </div>
        {/* Live preview: the widget button in the chosen color and icon type */}
        <div className="aioa-live" aria-hidden="true">
          <span className="aioa-live-icon">
            <img src={iconUrl(state.iconType)} alt="" />
          </span>
          <span className="aioa-live-text">
            Live
            <br />
            preview
          </span>
        </div>
      </div>

      {/* Picker + hex code + reset */}
      <div className="aioa-color-row">
        <input
          type="color"
          className="aioa-swatch"
          value={`#${state.color.toLowerCase()}`}
          aria-label="Open color picker"
          onChange={(e) => update(colorPatch(e.target.value))}
        />
        <div className={`aioa-affix aioa-hex${state.colorError ? ' is-invalid' : ''}`}>
          <span className="aioa-affix-text" aria-hidden="true">
            #
          </span>
          <input
            ref={refs.colorcode}
            type="text"
            id="aioa-colorcode"
            value={state.colorText}
            maxLength={7}
            spellCheck={false}
            autoComplete="off"
            aria-label="Hex color code"
            aria-describedby="aioa-colorcode-hint aioa-colorcode-error"
            aria-invalid={state.colorError}
            onChange={(e) => {
              const clean = e.target.value
                .replace(/[^0-9a-f]/gi, '')
                .slice(0, 6)
                .toUpperCase()
              // Applied at 6 digits; the field keeps what was typed
              update(
                clean.length === 6 ? {...colorPatch(clean), colorText: clean} : {colorText: clean},
              )
            }}
            onBlur={(e) => {
              const hex = parseHex(e.target.value)
              setQuietly(hex ? colorPatch(hex) : {colorError: true})
            }}
          />
        </div>
        <button
          type="button"
          className="aioa-btn"
          onClick={() => update(colorPatch(AIOA_DEFAULT_COLOR))}
        >
          Reset
        </button>
      </div>
      <p className="aioa-hint" id="aioa-colorcode-hint">
        For example: FF5733
      </p>
      <p className="aioa-error" id="aioa-colorcode-error" hidden={!state.colorError}>
        Enter a valid hex color code, for example FF5733.
      </p>

      {/* Presets */}
      <div className="aioa-presets" role="group" aria-label="Preset colors">
        {AIOA_PRESET_COLORS.map(([hex, name]) => (
          <button
            key={hex}
            type="button"
            className="aioa-preset"
            style={cssVars({'--c': `#${hex}`})}
            aria-pressed={state.color === hex}
            aria-label={`${name} #${hex}`}
            title={name}
            onClick={() => update(colorPatch(hex))}
          />
        ))}
      </div>
    </section>
  )
}

/* ---------- Widget size ---------- */

// [value, id, label, css modifier, number of feature tiles in the outline]
const WIDGET_SIZES = [
  ['0', 'aioa-widget-size-regular', 'Regular Size', 'is-regular', 6],
  ['1', 'aioa-widget-size-over', 'Oversize', 'is-over', 9],
] as const

function WidgetSizeSection({state, update}: Pick<Props, 'state' | 'update'>) {
  return (
    <section className="aioa-card" aria-labelledby="aioa-widget-size-title">
      <h2 id="aioa-widget-size-title">Widget size</h2>
      <p className="aioa-desc">Size of the panel that opens on your website.</p>

      <fieldset className="aioa-fieldset">
        <legend className="visually-hidden">Select widget size</legend>
        <div className="aioa-size-options">
          {WIDGET_SIZES.map(([value, id, label, modifier, tiles]) => (
            <label key={value} className="aioa-choice aioa-size-choice" htmlFor={id}>
              {/* Outline of the open widget panel: header, feature tiles */}
              <span className={`aioa-panel ${modifier}`} aria-hidden="true">
                <span className="aioa-panel-head" />
                <span className="aioa-panel-grid">
                  {Array.from({length: tiles}, (_, i) => (
                    <i key={i} />
                  ))}
                </span>
              </span>
              <span className="aioa-choice-text">
                <input
                  type="radio"
                  id={id}
                  name="aioa_widget_size"
                  value={value}
                  checked={state.widgetSize === value}
                  aria-describedby={value === '1' ? 'aioa-widget-size-note' : undefined}
                  onChange={() => update({widgetSize: value})}
                />
                {label}
              </span>
            </label>
          ))}
        </div>
      </fieldset>
      <p className="aioa-hint" id="aioa-widget-size-note">
        Oversize only works on desktop view.
      </p>
    </section>
  )
}

/* ---------- Widget position ---------- */

function PositionSection({state, update, refs}: Omit<Props, 'setQuietly'>) {
  // Once the "required" message shows, the marks follow what is typed
  const setOffset = (patch: Partial<AppearanceState>) => {
    const next = {...state, ...patch}
    update(
      state.positionCheck
        ? {...patch, positionCheck: next.x.trim() === '' || next.y.trim() === ''}
        : patch,
    )
  }
  const xInvalid = state.positionCheck && state.x.trim() === ''
  const yInvalid = state.positionCheck && state.y.trim() === ''

  return (
    <section className="aioa-card" aria-labelledby="aioa-position-title">
      <h2 id="aioa-position-title">Widget position</h2>
      <p className="aioa-desc">Where the accessibility icon appears on your website.</p>

      {/* Preset grid <-> exact offsets */}
      <label className="aioa-check">
        <input
          type="checkbox"
          checked={state.customPosition}
          aria-controls="aioa-custom-position aioa-position-grid"
          onChange={(e) =>
            update(
              e.target.checked
                ? {customPosition: true}
                : {customPosition: false, positionCheck: false},
            )
          }
        />
        Set an exact position in pixels
      </label>

      <PositionGrid
        id="aioa-position-grid"
        name="aioa_position"
        idPrefix="aioa-position"
        legend="Widget icon position"
        centerLabel="Your website"
        value={state.position}
        iconSrc={iconUrl(state.iconType)}
        hidden={state.customPosition}
        onChange={(position) => update({position})}
      />

      {/* Exact offsets (0 - 500 px) */}
      <div className="aioa-subpanel" id="aioa-custom-position" hidden={!state.customPosition}>
        <div className="aioa-offset-row">
          <label className="aioa-label" htmlFor="aioa-position-x">
            Horizontal
          </label>
          <div className={`aioa-affix${xInvalid ? ' is-invalid' : ''}`}>
            <WholeNumberInput
              ref={refs.x}
              id="aioa-position-x"
              clampMax={OFFSET_MAX}
              value={state.x}
              aria-describedby="aioa-pos-range-hint aioa-pos-error"
              aria-invalid={xInvalid}
              onValueChange={(x) => setOffset({x})}
            />
            <span className="aioa-affix-text" aria-hidden="true">
              px
            </span>
          </div>
          <select
            className="aioa-select"
            aria-label="Horizontal direction"
            value={state.xDir}
            onChange={(e) => update({xDir: e.target.value as XDir})}
          >
            <option value="cust-pos-to-the-right">To the right</option>
            <option value="cust-pos-to-the-left">To the left</option>
          </select>
        </div>
        <div className="aioa-offset-row">
          <label className="aioa-label" htmlFor="aioa-position-y">
            Vertical
          </label>
          <div className={`aioa-affix${yInvalid ? ' is-invalid' : ''}`}>
            <WholeNumberInput
              ref={refs.y}
              id="aioa-position-y"
              clampMax={OFFSET_MAX}
              value={state.y}
              aria-describedby="aioa-pos-range-hint aioa-pos-error"
              aria-invalid={yInvalid}
              onValueChange={(y) => setOffset({y})}
            />
            <span className="aioa-affix-text" aria-hidden="true">
              px
            </span>
          </div>
          <select
            className="aioa-select"
            aria-label="Vertical direction"
            value={state.yDir}
            onChange={(e) => update({yDir: e.target.value as YDir})}
          >
            <option value="cust-pos-to-the-lower">To the bottom</option>
            <option value="cust-pos-to-the-upper">To the top</option>
          </select>
        </div>
        <p className="aioa-hint" id="aioa-pos-range-hint">
          {POSITION_HINT}
        </p>
        {/* Stays empty while hidden, so screen readers never read a stale message */}
        <p className="aioa-error" id="aioa-pos-error" hidden={!state.positionCheck}>
          {state.positionCheck ? POSITION_MESSAGE : ''}
        </p>
      </div>
    </section>
  )
}

/* ---------- Icon type ---------- */

function IconTypeSection({state, update}: Pick<Props, 'state' | 'update'>) {
  return (
    <section className="aioa-card" aria-labelledby="aioa-icon-type-title">
      <h2 id="aioa-icon-type-title">Icon type</h2>
      <p className="aioa-desc">The icon visitors click to open the widget.</p>

      <fieldset className="aioa-fieldset">
        <legend className="visually-hidden">Select icon type</legend>
        <div className="aioa-icon-grid">
          {Array.from({length: AIOA_ICON_TYPE_COUNT}, (_, i) => {
            const value = `aioa-icon-type-${i + 1}`
            const id = `aioa-type-${i + 1}`
            return (
              <div key={value} className="aioa-icon-option">
                <input
                  type="radio"
                  className="aioa-radio"
                  id={id}
                  name="aioa_icon_type"
                  value={value}
                  checked={state.iconType === value}
                  onChange={() => update({iconType: value})}
                />
                <label htmlFor={id} className="aioa-icon-label">
                  <span className="aioa-icon">
                    <img src={iconUrl(value)} alt="" width="32" height="32" />
                  </span>
                  <span className="visually-hidden">Type {i + 1}</span>
                </label>
              </div>
            )
          })}
        </div>
      </fieldset>
    </section>
  )
}

/* ---------- Icon size ---------- */

function IconSizeSection({state, update, refs}: Omit<Props, 'setQuietly'>) {
  return (
    <section className="aioa-card" aria-labelledby="aioa-icon-size-title">
      <h2 id="aioa-icon-size-title">Icon size for desktop</h2>
      <p className="aioa-desc">Pick a preset size or set an exact size in pixels.</p>

      {/* Preset sizes <-> exact size */}
      <label className="aioa-check">
        <input
          type="checkbox"
          checked={state.customSize}
          aria-controls="aioa-custom-size aioa-icon-sizes"
          onChange={(e) =>
            update(e.target.checked ? {customSize: true} : {customSize: false, sizeCheck: false})
          }
        />
        Set an exact size in pixels
      </label>

      {/* Preset sizes, each drawn at its own size and in the selected icon type */}
      <fieldset
        className="aioa-fieldset widget-icon"
        id="aioa-icon-sizes"
        hidden={state.customSize}
      >
        <legend className="visually-hidden">Select icon size for desktop</legend>
        <div className="aioa-size-row">
          {AIOA_ICON_SIZES.map(([value, label, diameter]) => {
            const id = `aioa-size-${aioaSlug(value)}`
            return (
              <div key={value} className="aioa-icon-option">
                <input
                  type="radio"
                  className="aioa-radio"
                  id={id}
                  name="aioa_icon_size"
                  value={value}
                  checked={state.iconSize === value}
                  onChange={() => update({iconSize: value})}
                />
                <label htmlFor={id} className="aioa-icon-label">
                  <span className="aioa-icon" style={cssVars({'--d': `${Math.trunc(diameter)}px`})}>
                    <img src={iconUrl(state.iconType)} alt="" />
                  </span>
                  <span className="aioa-icon-caption">{label}</span>
                </label>
              </div>
            )
          })}
        </div>
      </fieldset>

      {/* Exact size (24 - 150 px), checked when saving */}
      <div className="aioa-subpanel" id="aioa-custom-size" hidden={!state.customSize}>
        <label className="aioa-label" htmlFor="aioa-icon-size-custom">
          Exact icon size
        </label>
        <div className={`aioa-affix aioa-size-input${state.sizeCheck ? ' is-invalid' : ''}`}>
          <WholeNumberInput
            ref={refs.iconSizeCustom}
            id="aioa-icon-size-custom"
            min={SIZE_MIN}
            max={SIZE_MAX}
            value={state.iconSizeCustom}
            aria-describedby="aioa-size-range-hint aioa-size-error"
            aria-invalid={state.sizeCheck}
            onValueChange={(iconSizeCustom) =>
              // Once the message shows, the mark follows what is typed
              update(
                state.sizeCheck
                  ? {iconSizeCustom, sizeCheck: !isValidIconSize(iconSizeCustom)}
                  : {iconSizeCustom},
              )
            }
          />
          <span className="aioa-affix-text" aria-hidden="true">
            px
          </span>
        </div>
        <p className="aioa-hint" id="aioa-size-range-hint">
          {SIZE_HINT}
        </p>
        {/* Stays empty while hidden, so screen readers never read a stale message */}
        <p className="aioa-error" id="aioa-size-error" hidden={!state.sizeCheck}>
          {state.sizeCheck ? SIZE_MESSAGE : ''}
        </p>
      </div>
    </section>
  )
}
