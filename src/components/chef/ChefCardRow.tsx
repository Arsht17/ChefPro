import { useCallback, useRef, type ReactNode } from 'react'

/**
 * Horizontal card rail.
 *
 * Two things it has to solve beyond `overflow-x: auto`:
 *
 * 1. Left-button drag scrolling. Without it the only ways through the row are
 *    the middle-button autoscroll or a horizontal trackpad gesture, which is
 *    not discoverable on a mouse. A wheel over the rail is mapped to the
 *    horizontal axis for the same reason.
 * 2. Room for the card shadows. A scroll container clips at its padding box, so
 *    the outer cards lose their shadow unless the padding is wider than the
 *    blur. The padding is pulled back out with a matching negative margin, so
 *    the cards still line up with the heading above them.
 * 3. Filling the column. The row takes whatever width the main column gives it
 *    rather than being pinned to the Figma frame's 1359px - that number is one
 *    artboard size, not a layout rule, and hard-coding it left the rail
 *    stranded mid-screen on a wide display. The cards keep their designed
 *    481px, so the row still overflows at any realistic window size.
 */
export function ChefCardRow({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const drag = useRef({ active: false, moved: false, startX: 0, startScroll: 0 })

  const onPointerDown = useCallback((event: React.PointerEvent) => {
    // Left button only. The drag deliberately starts anywhere, including on
    // the card's own open-modal button - the click is swallowed on release if
    // the pointer actually moved, so a drag never opens a chef.
    if (event.button !== 0) return
    if ((event.target as HTMLElement).closest('input')) return
    const el = ref.current
    if (!el) return
    drag.current = {
      active: true,
      moved: false,
      startX: event.clientX,
      startScroll: el.scrollLeft,
    }
  }, [])

  const onPointerMove = useCallback((event: React.PointerEvent) => {
    const el = ref.current
    if (!el || !drag.current.active) return
    const dx = event.clientX - drag.current.startX
    if (!drag.current.moved && Math.abs(dx) < 4) return
    if (!drag.current.moved) {
      drag.current.moved = true
      el.setPointerCapture(event.pointerId)
      el.style.cursor = 'grabbing'
      el.style.scrollSnapType = 'none'
    }
    el.scrollLeft = drag.current.startScroll - dx
  }, [])

  const endDrag = useCallback((event: React.PointerEvent) => {
    const el = ref.current
    if (!el) return
    if (drag.current.moved) {
      // Swallow the click that would otherwise open a chef modal on release.
      const swallow = (e: Event) => e.stopPropagation()
      el.addEventListener('click', swallow, { capture: true, once: true })
      window.setTimeout(() => {
        el.removeEventListener('click', swallow, { capture: true })
      }, 0)
      if (el.hasPointerCapture(event.pointerId)) {
        el.releasePointerCapture(event.pointerId)
      }
    }
    drag.current.active = false
    el.style.cursor = ''
    el.style.scrollSnapType = ''
  }, [])

  const onWheel = useCallback((event: React.WheelEvent) => {
    const el = ref.current
    if (!el || event.deltaX !== 0) return
    const max = el.scrollWidth - el.clientWidth
    if (max <= 0) return
    const next = el.scrollLeft + event.deltaY
    // Only claim the gesture while there is somewhere left to go, so the page
    // keeps scrolling once the rail bottoms out.
    if (next > 0 && next < max) {
      event.preventDefault()
      el.scrollLeft = next
    }
  }, [])

  return (
    <div
      ref={ref}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onWheel={onWheel}
      tabIndex={0}
      role="region"
      aria-label="Recommended chefs, scrollable"
      className="no-scrollbar -mx-4 -mt-3 flex w-[calc(100%+2rem)] cursor-grab snap-x snap-proximity gap-6 overflow-x-auto px-4 pt-3 pb-4"
    >
      {children}
    </div>
  )
}
