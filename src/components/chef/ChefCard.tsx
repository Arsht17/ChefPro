import { Icon, type IconName } from '../ui/Icon'
import { StarBadge, Tag } from '../ui/primitives'
import { useApp, type TabId } from '../../state/AppState'
import type { Chef } from '../../data/types'

const ACTIONS: { tab: TabId; label: string; icon: IconName }[] = [
  { tab: 'techniques', label: 'Techniques', icon: 'techniques' },
  { tab: 'recipes', label: 'Recipes', icon: 'recipes' },
  { tab: 'events', label: 'Events', icon: 'events' },
]

export function ChefCard({ chef }: { chef: Chef }) {
  const { state, dispatch } = useApp()
  const bookmarked = state.bookmarkedChefIds.includes(chef.id)
  const open = (tab: TabId) => dispatch({ type: 'openChef', chefId: chef.id, tab })

  return (
    /* Hover is an elevation lift, not a colour change - the card is a white
       surface carrying a photograph, and Figma's variant2 only moves the
       shadow: 0 1px 4px 0 becomes 0 0 4px 2px, so the card stops dropping and
       starts glowing evenly. Shadow only - no lift. The focus ring comes with
       it, since a shadow is not a keyboard-visible cue.

       The whole card opens the modal via a stretched overlay button rather than
       an onClick on the article: it keeps one real <button> for the card and
       avoids nesting it around the bookmark and the three tab actions, which
       are separate controls sitting above it in the stacking order. */
    <article className="group relative flex h-[540px] w-[481px] max-w-[calc(100vw-4rem)] shrink-0 snap-start flex-col overflow-hidden rounded-[24px] bg-white shadow-drop-01 transition-shadow duration-200 ease-out hover:shadow-card-hover focus-within:shadow-card-hover">
      <button
        onClick={() => open('techniques')}
        tabIndex={-1}
        aria-hidden="true"
        className="absolute inset-0 z-0 cursor-pointer"
      />

      <div className="pointer-events-none relative h-[254px] w-full shrink-0 overflow-hidden">
        {/* Figma's fill, per card:
              url(...) lightgray <x> <y> / 100% <height>% no-repeat
            The height differs by card because the sources do - Marco's photo is
            square (189.37%), the other three are 2:3 portraits (284.06%).
            Expressed here as `100% auto`, which derives that height from the
            image itself and so cannot stretch, plus the chef's own focal point.
            The framing is static; hover only drains the colour, so the card
            settles back while the shadow lifts. */}
        <div
          role="img"
          aria-label={`${chef.name} at ${chef.restaurant}`}
          style={{
            backgroundImage: `url("${chef.image}")`,
            backgroundPosition: `center ${chef.focusY}%`,
          }}
          className="absolute inset-0 bg-[lightgray] bg-[length:100%_auto] bg-no-repeat transition-[filter] duration-300 ease-out group-hover:saturate-[0.55] group-focus-within:saturate-[0.55]"
        />
        <button
          onClick={() => dispatch({ type: 'toggleBookmark', chefId: chef.id })}
          aria-pressed={bookmarked}
          aria-label={
            bookmarked
              ? `Remove ${chef.name} from favourites`
              : `Save ${chef.name} to favourites`
          }
          className={`pointer-events-auto absolute top-4 right-4 z-10 flex size-[50px] items-center justify-center rounded-full border backdrop-blur-[6px] transition-colors ${
            bookmarked
              ? 'border-primary-hover bg-primary-hover text-text-inverse'
              : 'border-white/10 bg-white/20 text-text-inverse hover:bg-primary-hover'
          }`}
        >
          <Icon name="bookmark" size={24} />
        </button>
      </div>

      <div className="pointer-events-none relative z-10 flex flex-1 flex-col gap-3 p-8">
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-2">
            <div className="flex items-start justify-between gap-3">
              {/* The accessible name for the whole-card action lives here. */}
              <h3 className="text-heading-m text-text">
                <button
                  onClick={() => open('techniques')}
                  className="pointer-events-auto text-left after:absolute after:inset-0 after:content-['']"
                >
                  {chef.name}
                  <span className="sr-only"> - open chef details</span>
                </button>
              </h3>
              <StarBadge stars={chef.michelinStars} />
            </div>
            <p className="text-body-s text-text">
              {chef.restaurant}, {chef.city}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {chef.tags.map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </div>

          <p className="text-body-s leading-[22.75px] text-text">
            {chef.description}
          </p>
        </div>

        <div className="mt-auto flex items-center justify-center gap-2">
          {ACTIONS.map((action) => (
            <button
              key={action.tab}
              onClick={() => open(action.tab)}
              className="group/action pointer-events-auto relative z-20 flex flex-1 flex-col items-center gap-1 rounded-[16px] py-2 transition-colors"
            >
              <span className="flex size-10 items-center justify-center rounded-full bg-bg-01 text-text transition-colors group-hover/action:bg-primary-hover group-hover/action:text-text-inverse">
                <Icon name={action.icon} size={24} />
              </span>
              <span className="text-body-2xs font-normal tracking-[0.5px] text-text-muted uppercase transition-colors group-hover/action:text-text">
                {action.label}
              </span>
              <span className="sr-only">for {chef.name}</span>
            </button>
          ))}
        </div>
      </div>
    </article>
  )
}
