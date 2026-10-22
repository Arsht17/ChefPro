import { Button, Tag } from '../ui/primitives'
import { Icon } from '../ui/Icon'
import { LessonPreview } from './LessonPreview'
import { MonthlySchedule } from './MonthlySchedule'
import { useApp } from '../../state/AppState'
import { eventsFor, recipesFor, techniquesFor } from '../../data'
import type { Chef } from '../../data/types'

/** Shared row shell for a technique or recipe. Figma: 24px padding, r24, a 40px
 *  rounded thumbnail, Sora Bold 14/20 title and a Regular 12/16 meta line where
 *  duration and level are separated by a bullet. */
function LearnRow({
  title,
  minutes,
  level,
  thumbnail,
  children,
}: {
  title: string
  minutes: number
  level: string
  thumbnail: string
  children: React.ReactNode
}) {
  return (
    <div className="flex items-center gap-4 rounded-[24px] bg-white p-6 shadow-drop-01">
      <img
        src={thumbnail}
        alt={title}
        className="size-10 shrink-0 rounded-[8px] object-cover"
      />
      <div className="min-w-0 flex-1">
        <p className="truncate text-body-s font-bold text-text">{title}</p>
        <p className="mt-1.5 flex items-center gap-3 text-body-xs text-text-muted">
          <span>{minutes} min</span>
          <span aria-hidden="true">&bull;</span>
          <span>{level}</span>
        </p>
      </div>
      {children}
    </div>
  )
}

export function TechniquesPanel({ chef }: { chef: Chef }) {
  const { state, dispatch } = useApp()
  const items = techniquesFor(chef.id)
  const previewed = items.find((t) => t.id === state.previewTechniqueId)

  return (
    <div className="flex flex-col gap-4">
      {items.map((technique) => {
        const open = state.previewTechniqueId === technique.id
        return (
          <div key={technique.id} className="flex flex-col gap-4">
            <LearnRow
              title={technique.title}
              minutes={technique.minutes}
              level={technique.level}
              thumbnail={technique.thumbnail}
            >
              {/* PREVIEW / CLOSE toggle - Technice-Button variant 3 */}
              <Button
                onClick={() =>
                  dispatch(
                    open
                      ? { type: 'closePreview' }
                      : { type: 'openPreview', techniqueId: technique.id },
                  )
                }
                aria-expanded={open}
                className={open ? 'bg-primary-hover' : ''}
              >
                {open ? 'Close' : 'Preview'}
              </Button>
            </LearnRow>
            {open && previewed && <LessonPreview technique={previewed} />}
          </div>
        )
      })}
    </div>
  )
}

export function RecipesPanel({ chef }: { chef: Chef }) {
  const { state, dispatch, notify } = useApp()
  const items = recipesFor(chef.id)

  return (
    <div className="flex flex-col gap-4">
      {items.map((recipe) => {
        const saved = state.savedRecipeIds.includes(recipe.id)
        return (
          <LearnRow
            key={recipe.id}
            title={recipe.title}
            minutes={recipe.minutes}
            level={recipe.level}
            thumbnail={recipe.thumbnail}
          >
            <Button
              disabled={saved}
              onClick={() => {
                dispatch({ type: 'saveRecipe', recipeId: recipe.id })
                notify('Saved to My Collection', recipe.title)
              }}
            >
              {saved ? 'Saved ✓' : 'Cook This'}
            </Button>
          </LearnRow>
        )
      })}

      <div className="flex flex-col gap-4 rounded-[16px] bg-charcoal p-8 text-text-inverse sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="text-heading-xs font-semibold">Want custom suggestions?</p>
          <p className="mt-2 text-body-s text-white/80">
            {chef.name.replace('Chef ', '')} can tailor recipes to your available
            equipment and local pantry.
          </p>
        </div>
        <Button
          className="shrink-0"
          onClick={() =>
            notify('Request sent', `${chef.name} will reply in your inbox.`)
          }
        >
          <Icon name="save" size={14} />
          Contact
        </Button>
      </div>
    </div>
  )
}

export function EventsPanel({ chef }: { chef: Chef }) {
  const { state, dispatch, notify } = useApp()
  const items = eventsFor(chef.id)

  return (
    <div className="grid gap-10 lg:grid-cols-12 lg:items-start">
      <div className="lg:col-span-5">
        <h4 className="mb-4 text-heading-xs font-bold leading-[28px] text-text">
          Monthly Schedule
        </h4>
        <MonthlySchedule
          events={items}
          reservedIds={state.reservedEventIds}
        />
      </div>

      <div className="min-w-0 lg:col-span-7">
        <h4 className="mb-4 text-heading-xs font-bold leading-[28px] text-text">
          Upcoming Events
        </h4>
        <div className="flex flex-col gap-4">
          {items.map((event) => {
            const reserved = state.reservedEventIds.includes(event.id)
            return (
              <div
                key={event.id}
                className="flex flex-col gap-4 rounded-[24px] bg-surface p-6 shadow-drop-01"
              >
                <div className="flex flex-col gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <Tag>{event.minutes} min</Tag>
                    <Tag>{event.format}</Tag>
                  </div>
                  <p className="text-heading-s font-bold leading-[22.5px] text-text">
                    {event.title}
                  </p>
                </div>
                <p className="text-body-s text-text-muted">{event.description}</p>
                {/* The design frame omits the date, but the calendar alone does
                    not say which event falls on a highlighted day - so the card
                    states it. */}
                <p className="text-body-xs text-text-muted">
                  {new Date(`${event.date}T00:00:00`).toLocaleDateString(undefined, {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
                <Button
                  variant={reserved ? 'success' : 'primary'}
                  className="self-start"
                  disabled={reserved}
                  onClick={() => {
                    dispatch({ type: 'reserveEvent', eventId: event.id })
                    notify(
                      'Spot Reserved',
                      `${event.title} — added to your learning schedule.`,
                    )
                  }}
                >
                  {reserved ? 'Reserved' : 'Reserve Spot'}
                </Button>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
