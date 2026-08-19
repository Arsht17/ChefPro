import { useState } from 'react'
import type { ChefEvent } from '../../data/types'

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

/* The Figma calendar is drawn with March 2026 starting on a Wednesday, and its
   day cells are still named "May Days" from an earlier pass. March 1 2026 is a
   Sunday, so the grid is computed here rather than copied - a prototype that
   reserves a real date should not show it on the wrong weekday. */
function monthGrid(year: number, month: number) {
  const first = new Date(year, month, 1)
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const leading = first.getDay()
  const cells: (number | null)[] = Array.from({ length: leading }, () => null)
  for (let day = 1; day <= daysInMonth; day += 1) cells.push(day)
  while (cells.length % 7 !== 0) cells.push(null)
  return cells
}

export function MonthlySchedule({
  events,
  reservedIds,
}: {
  events: ChefEvent[]
  reservedIds: string[]
}) {
  // Seeded to the month the design shows.
  const [cursor, setCursor] = useState(() => new Date(2026, 2, 1))
  const year = cursor.getFullYear()
  const month = cursor.getMonth()
  const cells = monthGrid(year, month)

  const eventsByDay = new Map<number, ChefEvent[]>()
  for (const event of events) {
    const date = new Date(`${event.date}T00:00:00`)
    if (date.getFullYear() !== year || date.getMonth() !== month) continue
    const list = eventsByDay.get(date.getDate()) ?? []
    list.push(event)
    eventsByDay.set(date.getDate(), list)
  }

  const monthLabel = cursor.toLocaleDateString(undefined, {
    month: 'long',
    year: 'numeric',
  })
  const shift = (delta: number) => setCursor(new Date(year, month + delta, 1))

  return (
    <div className="w-[263px] rounded-[16px] border border-stroke bg-white p-6">
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={() => shift(-1)}
          className="flex size-6 items-center justify-center rounded text-text transition-colors hover:text-primary-hover"
          aria-label="Previous month"
        >
          &#8249;
        </button>
        <span className="text-heading-xs font-semibold text-text">{monthLabel}</span>
        <button
          onClick={() => shift(1)}
          className="flex size-6 items-center justify-center rounded text-text transition-colors hover:text-primary-hover"
          aria-label="Next month"
        >
          &#8250;
        </button>
      </div>

      <div className="mb-2 grid grid-cols-7 gap-1">
        {WEEKDAYS.map((day) => (
          <span
            key={day}
            className="text-center text-body-2xs font-bold text-text-muted"
          >
            {day}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, index) => {
          if (day === null) return <span key={`pad-${index}`} />
          const dayEvents = eventsByDay.get(day) ?? []
          const hasEvent = dayEvents.length > 0
          const isReserved = dayEvents.some((e) => reservedIds.includes(e.id))

          return (
            <span
              key={day}
              title={hasEvent ? dayEvents.map((e) => e.title).join(', ') : undefined}
              className={[
                'flex aspect-square items-center justify-center rounded-[6px] text-body-xs transition-colors',
                isReserved
                  ? 'bg-primary font-bold text-text-inverse'
                  : hasEvent
                    ? 'border border-primary font-bold text-primary'
                    : 'text-text',
              ].join(' ')}
            >
              {day}
              {hasEvent && (
                <span className="sr-only">
                  {isReserved ? ' - spot reserved' : ' - event scheduled'}
                </span>
              )}
            </span>
          )
        })}
      </div>

      <p className="mt-4 flex items-center gap-2 text-body-2xs text-text-muted">
        <span
          aria-hidden="true"
          className="inline-block size-3 rounded-[4px] border border-primary"
        />
        Event day
        <span
          aria-hidden="true"
          className="ml-2 inline-block size-3 rounded-[4px] bg-primary"
        />
        Reserved
      </p>
    </div>
  )
}
