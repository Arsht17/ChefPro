import { useEffect, useRef } from 'react'
import { Modal } from '../ui/Modal'
import { Icon, type IconName } from '../ui/Icon'
import { Button, StarBadge, Tag } from '../ui/primitives'
import {
  EventsPanel,
  RecipesPanel,
  TechniquesPanel,
} from '../learning/TabPanels'
import { useApp, type TabId } from '../../state/AppState'
import { chefById, eventsFor, recipesFor, techniquesFor } from '../../data'

const TABS: { id: TabId; label: string; icon: IconName }[] = [
  { id: 'techniques', label: 'Techniques', icon: 'techniques' },
  { id: 'recipes', label: 'Recipes', icon: 'recipes' },
  { id: 'events', label: 'Events', icon: 'events' },
]

export function ChefModal() {
  const { state, dispatch, notify } = useApp()
  const chef = state.activeChefId ? chefById(state.activeChefId) : undefined
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])
  const tabColumn = useRef<HTMLDivElement>(null)

  // Switching tabs returns the column to the top; content length differs a lot
  // between Techniques and Events.
  useEffect(() => {
    tabColumn.current?.scrollTo({ top: 0 })
  }, [state.activeTab])

  if (!chef) return null

  const close = () => dispatch({ type: 'closeChef' })

  /* Roving tabindex: arrows move between tabs, Home/End jump to the ends. */
  const onTabKeyDown = (event: React.KeyboardEvent, index: number) => {
    const keys: Record<string, number> = {
      ArrowRight: index + 1,
      ArrowLeft: index - 1,
      Home: 0,
      End: TABS.length - 1,
    }
    const next = keys[event.key]
    if (next === undefined) return
    event.preventDefault()
    const bounded = (next + TABS.length) % TABS.length
    dispatch({ type: 'setTab', tab: TABS[bounded].id })
    tabRefs.current[bounded]?.focus()
  }

  const counts = [
    { value: techniquesFor(chef.id).length, label: 'Lessons' },
    { value: recipesFor(chef.id).length, label: 'Recipes' },
    { value: eventsFor(chef.id).length, label: 'Events' },
  ]

  return (
    <Modal open onClose={close} labelledBy="chef-modal-title">
      {/* Hero - fixed. Keeps the chef's identity and the dismiss control
          reachable no matter how far the panels below are scrolled. */}
      <div className="relative shrink-0 overflow-hidden bg-charcoal px-6 pt-8 pb-6">
        {/* Portrait bleeds off the right edge; the copy sits on the solid
            left half, as the frame composes it. */}
        <img
          src={chef.portrait}
          alt={`${chef.name} portrait`}
          className="absolute inset-y-0 right-0 h-full w-[55%] object-cover object-top"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-charcoal from-40% via-charcoal/85 to-charcoal/10"
        />
        <div className="relative flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            <p className="text-body-s font-semibold text-text-inverse">
              Master Instructor
            </p>
            <h2
              id="chef-modal-title"
              className="text-[38px] leading-[44px] font-bold text-text-inverse"
            >
              {chef.name}
            </h2>
            <p className="text-heading-m font-semibold text-text-inverse">
              {chef.restaurant}, {chef.city}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <StarBadge stars={chef.michelinStars} />
            {chef.tags.map((tag) => (
              <Tag key={tag} tone="onDark">
                {tag}
              </Tag>
            ))}
          </div>
          <p className="max-w-[640px] text-body-s leading-[22.75px] font-semibold text-text-inverse">
            {chef.quote}
          </p>
        </div>

        <button
          onClick={close}
          aria-label="Close chef details"
          className="absolute top-6 right-6 flex size-[50px] items-center justify-center rounded-full border border-white/10 bg-white/20 text-text-inverse backdrop-blur-[6px] transition-colors hover:bg-primary-hover"
        >
          <Icon name="close" size={24} />
        </button>
      </div>

      {/* Meta strip - fixed */}
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-4 border-b border-stroke bg-white px-8 py-6">
        <div className="flex flex-wrap gap-8">
          {[
            { label: 'Focus', value: chef.focus },
            { label: 'Specialty', value: chef.specialty },
            { label: 'Current Theme', value: chef.currentTheme },
          ].map((item) => (
            <div key={item.label}>
              <p className="text-body-2xs font-bold tracking-[0.5px] text-text-muted uppercase">
                {item.label}
              </p>
              <p className="text-body-s text-text">{item.value}</p>
            </div>
          ))}
        </div>
        <div className="flex gap-8">
          {counts.map((count) => (
            <div key={count.label} className="text-center">
              {/* Counts are Numeral green - the colour the design reserves for
                  quantities and positive metrics. */}
              <p className="text-heading-s font-bold text-numeral">{count.value}</p>
              <p className="text-body-2xs font-bold text-text-muted uppercase">
                {count.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll region - two columns, each owning its own overflow so the hero
          never leaves the viewport. */}
      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <div
          ref={tabColumn}
          className="no-scrollbar min-h-0 flex-1 overflow-y-auto overscroll-contain bg-bg-01 px-8 py-6"
        >
          {/* Sticky: the tab strip scrolls with the panel in Figma, but losing
              it behind a long Techniques list makes the tabs unreachable. */}
          {/* Sticky strip. It must cover the full gutter of the scrolling
              column - the negative margins pull it over the column's own
              padding so rows cannot show through above or below it. */}
          <div
            role="tablist"
            aria-label="Chef content"
            className="sticky -top-6 z-10 -mx-8 -mt-6 mb-4 flex gap-6 bg-bg-01 px-8 pt-6 pb-3"
          >
            {TABS.map((tab, index) => {
              const selected = state.activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  ref={(el) => {
                    tabRefs.current[index] = el
                  }}
                  role="tab"
                  id={`tab-${tab.id}`}
                  aria-selected={selected}
                  aria-controls={`panel-${tab.id}`}
                  tabIndex={selected ? 0 : -1}
                  onKeyDown={(event) => onTabKeyDown(event, index)}
                  onClick={() => dispatch({ type: 'setTab', tab: tab.id })}
                  className={`flex items-center justify-center gap-1 border-b-2 pb-2 transition-colors ${
                    selected
                      ? 'border-primary text-text'
                      : 'border-transparent text-text hover:border-primary-hover hover:text-primary-hover'
                  }`}
                >
                  <span className="flex size-10 items-center justify-center">
                    <Icon name={tab.icon} size={24} />
                  </span>
                  <span className="text-body-s font-bold tracking-[0.5px] uppercase">
                    {tab.label}
                  </span>
                </button>
              )
            })}
          </div>

          <div
            role="tabpanel"
            id={`panel-${state.activeTab}`}
            aria-labelledby={`tab-${state.activeTab}`}
            tabIndex={0}
          >
            {state.activeTab === 'techniques' && <TechniquesPanel chef={chef} />}
            {state.activeTab === 'recipes' && <RecipesPanel chef={chef} />}
            {state.activeTab === 'events' && <EventsPanel chef={chef} />}
          </div>
        </div>

        <aside className="no-scrollbar min-h-0 w-full shrink-0 overflow-y-auto overscroll-contain border-t border-stroke bg-white px-8 py-6 lg:w-[380px] lg:border-t-0 lg:border-l">
          <h3 className="mb-6 text-heading-xs font-semibold text-text">
            Why this chef matches your goals?
          </h3>
          <ol className="flex flex-col">
            {chef.matchReasons.map((reason, index) => (
              <li
                key={reason.title}
                className={`relative flex flex-col gap-2 border-l-2 border-primary pl-[26px] ${
                  index === 0 ? '' : 'pt-4'
                }`}
              >
                <span
                  aria-hidden="true"
                  className="absolute top-0 -left-[9px] size-4 rounded-full border-4 border-white bg-primary"
                />
                <p className="text-heading-xs font-bold text-text">{reason.title}</p>
                <p className="text-body-s leading-[22.75px] text-text-muted">
                  {reason.body}
                </p>
              </li>
            ))}
          </ol>

          <div className="mt-8 rounded-[24px] bg-bg-01 p-6">
            <p className="text-heading-xs font-semibold text-text">Chef Rating</p>
            <p className="mt-3 flex items-start gap-1">
              <span className="text-rating-score font-bold text-text">
                {chef.rating.toFixed(1)}
              </span>
              <span className="self-center text-rating-denom text-[#808080]">
                / 5.0
              </span>
            </p>
            <p className="mt-3 text-body-xs text-text">
              Based on {chef.reviewCount} student reviews
            </p>
            <Button
              variant="primary"
              className="mt-4"
              onClick={() => notify('Thanks!', 'Your review form is on its way.')}
            >
              Leave a review
            </Button>
          </div>
        </aside>
      </div>
    </Modal>
  )
}
