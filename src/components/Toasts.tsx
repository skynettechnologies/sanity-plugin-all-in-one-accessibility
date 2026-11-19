/**
 * Toast notifications in the top right (ui.js toast() in the reference app).
 * Success toasts stay 5 s, errors 8 s, toasts with a link 15 s.
 */

import {useCallback, useEffect, useRef, useState} from 'react'

import {AlertIcon, CheckIcon, CloseIcon} from './icons'

export type ToastType = 'success' | 'error'

export interface ToastAction {
  href: string
  label: string
}

interface ToastItem {
  id: number
  type: ToastType
  title: string
  message: string
  action?: ToastAction
  leaving: boolean
}

export type ShowToast = (
  type: ToastType,
  title: string,
  message?: string,
  action?: ToastAction,
) => void

/** Links stay longer so there is time to click them */
function toastDuration(type: ToastType, hasAction: boolean): number {
  if (hasAction) {
    return 15000
  }
  return type === 'error' ? 8000 : 5000
}

/** Toast list + toast() to add one */
export function useToasts() {
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const nextId = useRef(1)
  const timers = useRef(new Set<number>())

  const later = useCallback((fn: () => void, ms: number) => {
    const timer = window.setTimeout(() => {
      timers.current.delete(timer)
      fn()
    }, ms)
    timers.current.add(timer)
  }, [])

  const remove = useCallback((id: number) => {
    setToasts((list) => list.filter((t) => t.id !== id))
  }, [])

  const dismiss = useCallback(
    (id: number) => {
      setToasts((list) => list.map((t) => (t.id === id ? {...t, leaving: true} : t)))
      later(() => remove(id), 200)
    },
    [later, remove],
  )

  const toast = useCallback<ShowToast>(
    (type, title, message = '', action) => {
      const id = nextId.current++
      setToasts((list) => [...list, {id, type, title, message, action, leaving: false}])
      later(() => dismiss(id), toastDuration(type, Boolean(action)))
    },
    [dismiss, later],
  )

  useEffect(() => {
    const pending = timers.current
    return () => pending.forEach((timer) => window.clearTimeout(timer))
  }, [])

  return {toasts, toast, dismiss}
}

export function ToastRegion({
  toasts,
  onDismiss,
}: {
  toasts: ToastItem[]
  onDismiss: (id: number) => void
}) {
  return (
    <div className="aioa-toasts" aria-live="polite">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`aioa-toast is-${t.type}${t.leaving ? ' is-leaving' : ''}`}
          role={t.type === 'error' ? 'alert' : undefined}
        >
          <span className="aioa-toast-ic" aria-hidden="true">
            {t.type === 'success' ? <CheckIcon /> : <AlertIcon />}
          </span>
          <div className="aioa-toast-body">
            <strong>{t.title}</strong>
            <p>{t.message}</p>
            {t.action && (
              <a href={t.action.href} target="_blank" rel="noopener noreferrer">
                {t.action.label}
              </a>
            )}
          </div>
          <button
            type="button"
            className="aioa-toast-close"
            aria-label="Dismiss notification"
            onClick={() => onDismiss(t.id)}
          >
            <CloseIcon />
          </button>
        </div>
      ))}
    </div>
  )
}
