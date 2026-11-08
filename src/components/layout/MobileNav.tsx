import { useEffect, useRef } from 'react'
import { Icon } from '../ui/Icon'
import { Sidebar } from './Sidebar'

/**
 * Phone navigation. Below `md` the rail has no room, so the header's menu
 * button opens the same nav as a slide-in panel over the dashboard. It behaves
 * like a dialog: scrim, Escape, focus moved in and handed back on close, and
 * the page behind locked. It also closes itself if the window grows past `md`,
 * where the rail takes over again.
 */
export function MobileNav({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return

    const restoreTo = document.activeElement as HTMLElement | null
    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'
    panelRef.current?.querySelector<HTMLElement>('a[href]')?.focus()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    const desktop = window.matchMedia('(min-width: 768px)')
    const onResize = () => {
      if (desktop.matches) onClose()
    }

    document.addEventListener('keydown', onKeyDown)
    desktop.addEventListener('change', onResize)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      desktop.removeEventListener('change', onResize)
      document.body.style.overflow = overflow
      restoreTo?.focus?.()
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 md:hidden" role="presentation">
      <div
        className="absolute inset-0 bg-black/50 motion-safe:animate-[fadeIn_200ms_ease-out]"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation"
        className="absolute inset-y-0 left-0 flex w-[min(320px,85vw)] flex-col overflow-hidden rounded-r-[24px] bg-white shadow-drop-02 motion-safe:animate-[drawerIn_220ms_ease-out]"
      >
        <div className="flex shrink-0 items-center justify-between px-6 pt-6">
          <div className="flex items-center gap-2">
            <span className="flex size-10 items-center justify-center rounded-[4px] bg-primary text-text-inverse">
              <Icon name="logoChef" size={32} />
            </span>
            <span className="text-heading-m tracking-[-0.5px] text-text">ChefPRO</span>
          </div>
          <button
            onClick={onClose}
            aria-label="Close navigation"
            className="flex size-10 items-center justify-center rounded-full text-text transition-colors hover:bg-primary-hover hover:text-text-inverse"
          >
            <Icon name="close" size={24} />
          </button>
        </div>
        <div className="min-h-0 flex-1">
          <Sidebar collapsed={false} drawer onNavigate={onClose} />
        </div>
      </div>
    </div>
  )
}
