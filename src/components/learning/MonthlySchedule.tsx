import { useState } from 'react'
import type { ChefEvent } from '../../data/types'
import { Icon } from '../ui/Icon'

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

type Cell = { day: number; inMonth: boolean }

/* The Figma calendar (48:7269) is drawn with March 2026 starting on a Wednesday
   and its day cells are still named "May Days" from an earlier pass. March 1
   2026 is a Sunday, so the grid is computed here rather than copied - a
   prototype that reserves a real date must not show it on the wrong weekday.
   Figma's styling is followed exactly; only its arithmetic is not. */
function monthGrid(year: number, month: number): Cell[] {
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const leading = new Date(year, month, 1).getDay()
  const prevMonthDays = new Date(year, month, 0).getDate()
  const cells: Cell[] = []

  for (let i = leading; i > 0; i -= 1)
    cells.push({ day: prevMonthDays - i + 1, inMonth: false })
  for (let day = 1; day <= daysInMonth; day += 1) cells.push({ day, inMonth: true })

  // Figma greys the days either side of the month rather than leaving holes.
  let next = 1
  while (cells.length % 7 !== 0) cells.push({ day: next++, inMonth: false })
  return cells
}

export function MonthlySchedule({
  events,
  reservedIds,
}: {
  events: ChefEvent[]
  reservedIds: string[]
}) {
  // Opens on the real current month. The design frame draws March 2026, but the
  // header already runs a live clock - a calendar that disagreed with it would
  // read as broken.
  const [cursor, setCursor] = useState(() => {
    const now = new Date()
    return new Date(now.getFullYear(), now.getMonth(), 1)
  })
  const year = cursor.getFullYear()
  const month = cursor.getMonth()
  const cells = monthGrid(year, month)

  const today = new Date()
  const showsToday =
    year === today.getFullYear() && month === today.getMonth()
  const todayDate = today.getDate()

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
    <div className="flex flex-col gap-3 rounded-[24px] border border-stroke bg-bg-02 p-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => shift(-1)}
          className="inline-flex size-6 items-center justify-center rounded-[4px] bg-primary text-text-inverse transition-colors hover:bg-primary-hover"
          aria-label="Previous month"
        >
          <Icon name="chevron" size={16} className="-rotate-90" />
        </button>
        <span className="text-heading-xs font-bold text-text">{monthLabel}</span>
        <button
          onClick={() => shift(1)}
          className="inline-flex size-6 items-center justify-center rounded-[4px] bg-primary text-text-inverse transition-colors hover:bg-primary-hover"
          aria-label="Next month"
        >
          <Icon name="chevron" size={16} className="rotate-90" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {WEEKDAYS.map((day) => (
          <span
            key={day}
            className="text-center text-body-2xs font-bold uppercase tracking-[1px] text-text-muted"
          >
            {day}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-[6px]">
        {cells.map((cell, index) => {
          if (!cell.inMonth)
            return (
              <span
                key={`pad-${index}`}
                className="flex h-7 items-center justify-center text-body-s text-text-muted/50"
              >
                {cell.day}
              </span>
            )

          const dayEvents = eventsByDay.get(cell.day) ?? []
          const hasEvent = dayEvents.length > 0
          const isReserved = dayEvents.some((e) => reservedIds.includes(e.id))
          const isToday = showsToday && cell.day === todayDate

          return (
            <span
              key={`day-${cell.day}`}
              aria-current={isToday ? 'date' : undefined}
              title={hasEvent ? dayEvents.map((e) => e.title).join(', ') : undefined}
              className={[
                'flex h-7 items-center justify-center rounded-[4px] text-body-s transition-colors',
                isReserved
                  ? 'bg-numeral font-bold text-text-inverse'
                  : hasEvent
                    ? 'bg-primary font-bold text-text-inverse'
                    : 'text-text',
                /* Today is a charcoal outline, so it can sit on top of a red or
                   green fill instead of competing with it. Inset ring rather
                   than a border - a border would nudge the digit off centre. */
                isToday ? 'font-bold ring-1 ring-inset ring-charcoal' : '',
              ].join(' ')}
            >
              {cell.day}
              {isToday && <span className="sr-only"> - today</span>}
              {hasEvent && (
                <span className="sr-only">
                  {isReserved ? ' - spot reserved' : ' - event scheduled'}
                </span>
              )}
            </span>
          )
        })}
      </div>

      {/* Three keys no longer fit on one line in the card, so the row wraps
          rather than breaking a label across lines. */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <span className="flex items-center gap-1 whitespace-nowrap text-body-xs text-charcoal">
          <span aria-hidden="true" className="size-4 shrink-0 rounded-[4px] bg-primary" />
          Event day
        </span>
        <span className="flex items-center gap-1 whitespace-nowrap text-body-xs text-charcoal">
          <span aria-hidden="true" className="size-4 shrink-0 rounded-[4px] bg-numeral" />
          Reserved
        </span>
        <span className="flex items-center gap-1 whitespace-nowrap text-body-xs text-charcoal">
          <span
            aria-hidden="true"
            className="size-4 shrink-0 rounded-[4px] ring-1 ring-inset ring-charcoal"
          />
          Today
        </span>
      </div>
    </div>
  )
}
