import { useEffect, useState } from 'react'
import { Icon } from '../ui/Icon'
import { user } from '../../data'

/** Ticks once a second. The Figma frame freezes it at 23:40:15 and the
 *  state-change specimen shows 12:04:15, i.e. it is meant to run. */
function useClock() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(id)
  }, [])
  return now
}

const pad = (n: number) => String(n).padStart(2, '0')

function MetaPair({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-[6px]">
      <span className="text-meta text-text-muted">{label}</span>
      <span className="text-meta text-right text-text tabular-nums">{value}</span>
    </div>
  )
}

export function Header({ onToggleSidebar }: { onToggleSidebar: () => void }) {
  const now = useClock()
  const time = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`
  const date = `${pad(now.getDate())}/${pad(now.getMonth() + 1)}/${now.getFullYear()}`

  return (
    <header className="flex items-center gap-4 border-b border-stroke bg-bg-01 px-4 pt-6 pb-[25px] xl:px-8">
      {/* Logo hugs; the search container is the only thing that flexes. */}
      <div className="flex shrink-0 items-center gap-2 xl:pr-8">
        <button
          onClick={onToggleSidebar}
          className="flex size-10 items-center justify-center rounded-[4px] bg-primary text-text-inverse transition-colors hover:bg-primary-hover"
          aria-label="Toggle navigation"
        >
          <Icon name="logoChef" size={32} />
        </button>
        <span className="hidden text-heading-m tracking-[-0.5px] text-text sm:inline">
          ChefPRO
        </span>
      </div>

      <div className="min-w-0 flex-1">
        <form
          className="relative w-full max-w-[672px]"
          role="search"
          onSubmit={(e) => e.preventDefault()}
        >
          <label htmlFor="chefpro-search" className="sr-only">
            Search chefs, techniques and recipes
          </label>
          <Icon
            name="search"
            size={18}
            className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-text-muted"
          />
          <input
            id="chefpro-search"
            type="search"
            placeholder="What do you want to cook today?"
            /* Focus is stated by the field's own border, not the shared ring -
               a 2px outline around a 24px pill reads as a stray red halo. */
            className="h-[50px] w-full rounded-[24px] border border-stroke bg-bg-02 pr-[17px] pl-[49px] text-body-m text-text shadow-drop-02 transition-colors placeholder:text-text-muted focus:border-primary focus:outline-none focus-visible:border-primary focus-visible:outline-none"
          />
        </form>
      </div>

      <div className="flex shrink-0 items-center gap-4">
        <div className="hidden items-start gap-4 lg:flex">
          <MetaPair label="Time" value={time} />
          <MetaPair label="Date" value={date} />
        </div>

        <div className="flex items-center gap-2">
          <button
            className="flex size-6 items-center justify-center text-text transition-colors hover:text-primary-hover"
            aria-label="Notifications"
          >
            <Icon name="bell" size={24} />
          </button>
          <div className="flex items-center gap-3">
            <img
              src={user.avatar}
              alt={`${user.name} profile photo`}
              className="size-10 rounded-full border border-stroke object-cover"
            />
            {/* Both lines hang off the same left edge - Figma aligns the name
                to the start of the block (11:693), and only the wider role line
                made it look right-aligned. */}
            <div className="hidden flex-col items-start sm:flex">
              <span className="text-body-m text-text">{user.name}</span>
              <span className="text-body-xs text-text">{user.role}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
