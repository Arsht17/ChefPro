import { useEffect, useState } from 'react'

/**
 * Monday-first weekday index: 0 = Monday … 6 = Sunday.
 *
 * The charts are laid out M–S, but `Date.getDay()` counts from Sunday, so the
 * two disagree by one position every single day of the week except Sunday.
 */
export function weekdayIndex(date: Date) {
  return (date.getDay() + 6) % 7
}

/**
 * Today's weekday index, kept correct across a date change.
 *
 * The dashboard is a long-lived page - someone can leave it open past midnight
 * - so this schedules a single update for the next local midnight rather than
 * polling. Re-arming after each fire keeps it accurate across DST shifts too,
 * because the next boundary is recomputed from the clock rather than assumed
 * to be 24 hours later.
 */
export function useWeekdayIndex() {
  const [index, setIndex] = useState(() => weekdayIndex(new Date()))

  useEffect(() => {
    let timer: number

    const scheduleNextMidnight = () => {
      const now = new Date()
      const midnight = new Date(now)
      midnight.setHours(24, 0, 0, 0)
      // One second past the boundary, so the new date has definitely landed.
      timer = window.setTimeout(() => {
        setIndex(weekdayIndex(new Date()))
        scheduleNextMidnight()
      }, midnight.getTime() - now.getTime() + 1000)
    }

    scheduleNextMidnight()
    return () => window.clearTimeout(timer)
  }, [])

  return index
}
