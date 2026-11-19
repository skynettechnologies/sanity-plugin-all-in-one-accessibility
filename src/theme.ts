/**
 * ---------------------------------------------------------------------------
 * All in One Accessibility - light / dark theme
 * ---------------------------------------------------------------------------
 * The settings page follows the Studio's appearance (the user menu's
 * System / Dark / Light), live: System follows the computer's light / dark
 * setting, Dark and Light are used as set.
 *
 * The header toggle changes the Studio's appearance to the other theme, so the
 * Studio and the settings page always match (the user menu then shows Dark or
 * Light picked).
 *
 * When the Studio's appearance is fixed by its configuration and cannot be
 * changed, the toggle switches only this page. That choice is kept
 * (localStorage "aioa-theme", with the Studio theme it was made under) until
 * the Studio theme changes: then the page follows the Studio again.
 */

import {useCallback, useEffect, useState} from 'react'
import {useColorSchemeSetValue, useColorSchemeValue} from 'sanity'

import {STORAGE_THEME} from './config'
import {storage} from './util'

export type Scheme = 'light' | 'dark'

/** A theme picked with the toggle, and the Studio theme it was picked under */
interface ThemeChoice {
  theme: Scheme
  studio: Scheme
}

const isScheme = (value: unknown): value is Scheme => value === 'light' || value === 'dark'

/** The saved toggle choice. Values in an older format are dropped. */
function readChoice(): ThemeChoice | null {
  const saved = storage.get(STORAGE_THEME)
  if (!saved) {
    return null
  }
  try {
    const choice: unknown = JSON.parse(saved)
    if (
      choice &&
      typeof choice === 'object' &&
      isScheme((choice as ThemeChoice).theme) &&
      isScheme((choice as ThemeChoice).studio)
    ) {
      return choice as ThemeChoice
    }
  } catch {
    // not JSON: an older value
  }
  storage.remove(STORAGE_THEME)
  return null
}

/** The theme on screen and the header toggle */
export function useTheme(): {theme: Scheme; toggleTheme: () => void} {
  // The Studio's appearance, with System resolved to the computer's setting
  const studio: Scheme = useColorSchemeValue() === 'dark' ? 'dark' : 'light'
  // Changes the Studio's appearance; false when its configuration fixes it
  const setStudioScheme = useColorSchemeSetValue()

  const [choice, setChoice] = useState<ThemeChoice | null>(readChoice)

  // A page-only choice applies only while the Studio cannot be changed and has
  // the theme it was made under
  const active = !setStudioScheme && choice && choice.studio === studio ? choice : null
  const theme = active ? active.theme : studio

  useEffect(() => {
    if (choice && !active) {
      storage.remove(STORAGE_THEME)
      setChoice(null)
    }
  }, [choice, active])

  const toggleTheme = useCallback(() => {
    const next: Scheme = theme === 'dark' ? 'light' : 'dark'
    if (setStudioScheme) {
      // Change the Studio's appearance: the page follows it
      setStudioScheme(next)
      return
    }
    if (next === studio) {
      // Back to the Studio's theme: follow the Studio again
      storage.remove(STORAGE_THEME)
      setChoice(null)
      return
    }
    const picked = {theme: next, studio}
    storage.set(STORAGE_THEME, JSON.stringify(picked))
    setChoice(picked)
  }, [theme, studio, setStudioScheme])

  return {theme, toggleTheme}
}
