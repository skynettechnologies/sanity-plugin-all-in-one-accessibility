/**
 * Form controls shared by the Appearance Design and Paid Features tabs.
 */

import {type CSSProperties, forwardRef, type InputHTMLAttributes} from 'react'

import {AIOA_POSITIONS} from '../config'
import {aioaSlug, wholeNumber} from '../util'

const BLOCKED_KEYS = ['.', ',', 'e', 'E', '+', '-']

type NumberInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'value' | 'onChange' | 'type'
> & {
  value: string
  onValueChange: (value: string) => void
  /** Keep the value between 0 and clampMax while typing (also sets min / max) */
  clampMax?: number
}

/**
 * Whole numbers only: ".", ",", "e", "+" and "-" can't be typed, and a pasted
 * value such as "0.500" becomes a whole number (0). With max, the value is also
 * kept between 0 and clampMax while typing. Empty stays empty.
 */
export const WholeNumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
  function WholeNumberInput({value, onValueChange, clampMax, ...rest}, ref) {
    return (
      <input
        {...rest}
        ref={ref}
        type="number"
        step={1}
        inputMode="numeric"
        min={clampMax === undefined ? rest.min : 0}
        max={clampMax ?? rest.max}
        value={value}
        onKeyDown={(e) => {
          if (!e.ctrlKey && !e.metaKey && BLOCKED_KEYS.includes(e.key)) {
            e.preventDefault()
          }
        }}
        onChange={(e) => {
          const number = wholeNumber(e.target.value, null)
          if (number === null) {
            onValueChange('')
            return
          }
          onValueChange(
            String(clampMax === undefined ? number : Math.min(Math.max(number, 0), clampMax)),
          )
        }}
      />
    )
  },
)

/**
 * 3 x 3 grid of preset positions. Each option has a small screen (or phone)
 * glyph with a dot where the icon goes; the center cell is a mini website
 * whose icon moves to the selected position.
 */
export function PositionGrid({
  name,
  idPrefix,
  legend,
  centerLabel,
  value,
  phone = false,
  iconSrc,
  hidden,
  id,
  onChange,
}: {
  name: string
  idPrefix: string
  legend: string
  centerLabel: string
  value: string
  phone?: boolean
  iconSrc: string
  hidden?: boolean
  id?: string
  onChange: (position: string) => void
}) {
  const selected = AIOA_POSITIONS.find((pos) => pos?.[0] === value)
  const gx = selected ? selected[2] : 1
  const gy = selected ? selected[3] : 1

  return (
    <fieldset className="aioa-fieldset widget-position" id={id} hidden={hidden}>
      <legend className="visually-hidden">{legend}</legend>
      <div className="aioa-pos-grid">
        {AIOA_POSITIONS.map((pos) => {
          if (pos === null) {
            return (
              <div key="center" className="aioa-pos-center" aria-hidden="true">
                <span className="aioa-mini-label">{centerLabel}</span>
                <span className="aioa-mini-widget" style={cssVars({'--gx': gx, '--gy': gy})}>
                  <img src={iconSrc} alt="" />
                </span>
              </div>
            )
          }
          const optionId = `${idPrefix}-${aioaSlug(pos[0])}`
          return (
            <div key={pos[0]} className="aioa-pos-option">
              <input
                type="radio"
                className="aioa-radio"
                id={optionId}
                name={name}
                value={pos[0]}
                checked={value === pos[0]}
                onChange={() => onChange(pos[0])}
              />
              <label htmlFor={optionId} className="aioa-pos-label">
                <span
                  className={`aioa-glyph${phone ? ' is-phone' : ''}`}
                  style={cssVars({'--gx': pos[2], '--gy': pos[3]})}
                  aria-hidden="true"
                >
                  <i />
                </span>
                {pos[1]}
              </label>
            </div>
          )
        })}
      </div>
    </fieldset>
  )
}

/** Inline style with CSS custom properties */
export function cssVars(vars: Record<string, string | number>): CSSProperties {
  return vars as CSSProperties
}
