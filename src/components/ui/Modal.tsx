import { useEffect, useRef, type ReactNode } from 'react'

const FOCUSABLE =
  'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])'

interface ModalProps {
  open: boolean
  onClose: () => void
  labelledBy: string
  children: ReactNode
}

/**
 * Dialog shell: scrim, Escape, focus trap, restore focus on close, and a body
 * scroll lock so the dashboard behind it stays put while remaining visible.
 */
export function Modal({ open, onClose, labelledBy, children }: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const restoreTo = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!open) return

    restoreTo.current = document.activeElement as HTMLElement | null

    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'

    // Focus the panel itself rather than the close button, so a screen reader
    // reads the chef's name before offering the dismiss control.
    panelRef.current?.focus()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation()
        onClose()
        return
      }
      if (event.key !== 'Tab') return

      const panel = panelRef.current
      if (!panel) return
      const items = Array.from(
        panel.querySelectorAll<HTMLElement>(FOCUSABLE),
      ).filter((el) => el.offsetParent !== null)
      if (items.length === 0) {
        event.preventDefault()
        return
      }

      const first = items[0]
      const last = items[items.length - 1]
      const active = document.activeElement

      if (event.shiftKey && (active === first || active === panel)) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && active === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown, true)
    return () => {
      document.removeEventListener('keydown', onKeyDown, true)
      document.body.style.overflow = overflow
      restoreTo.current?.focus?.()
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6"
      role="presentation"
    >
      <div
        className="absolute inset-0 bg-black/50 motion-safe:animate-[fadeIn_200ms_ease-out]"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        tabIndex={-1}
        /* Below lg the panel itself scrolls, so nothing is pinned and every
           section can be reached on a short phone screen. From lg up it clips
           and the content inside owns the scrolling. dvh keeps it clear of
           mobile browser toolbars. */
        className="no-scrollbar relative flex max-h-[calc(100dvh-1rem)] w-full max-w-[1152px] flex-col overflow-y-auto overscroll-contain rounded-[20px] bg-white shadow-drop-02 outline-none motion-safe:animate-[panelIn_220ms_ease-out] sm:max-h-[min(92vh,calc(100dvh-3rem))] sm:rounded-[24px] lg:overflow-hidden"
      >
        {children}
      </div>
    </div>
  )
}
