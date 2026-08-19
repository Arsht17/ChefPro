import { Link } from 'react-router-dom'
import { useApp } from '../state/AppState'
import { chefById, recipeById, techniqueById } from '../data'
import { Icon } from '../components/ui/Icon'

function Empty({ children }: { children: React.ReactNode }) {
  return (
    <p className="rounded-[16px] border border-dashed border-stroke bg-white/60 p-6 text-body-s text-text-muted">
      {children}
    </p>
  )
}

function Row({ title, meta }: { title: string; meta: string }) {
  return (
    <li className="flex items-center gap-4 rounded-[16px] border border-stroke bg-white p-4">
      <span
        aria-hidden="true"
        className="flex size-10 shrink-0 items-center justify-center rounded-[8px] bg-bg-01 text-text"
      >
        <Icon name="navCollection" size={20} />
      </span>
      <div className="min-w-0">
        <p className="truncate text-body-m text-text">{title}</p>
        <p className="text-body-xs text-text-muted">{meta}</p>
      </div>
    </li>
  )
}

/** Built because Save Recipe has to land somewhere real. Deliberately plain -
 *  there is no Figma frame for this screen. */
export function Collection() {
  const { state } = useApp()

  const recipes = state.savedRecipeIds.map(recipeById).filter(Boolean)
  const techniques = state.savedTechniqueIds.map(techniqueById).filter(Boolean)
  const chefs = state.bookmarkedChefIds.map(chefById).filter(Boolean)

  return (
    <div className="flex max-w-[880px] flex-col gap-10">
      <header>
        <h1 className="text-display-l text-text">My Collection</h1>
        <p className="text-heading-l text-text-muted">
          Everything you have saved while exploring.
        </p>
      </header>

      <section className="flex flex-col gap-4">
        <h2 className="text-heading-xl font-semibold text-text">Saved Recipes</h2>
        {recipes.length === 0 ? (
          <Empty>
            Nothing saved yet. Open a chef from{' '}
            <Link to="/" className="text-primary underline">
              the dashboard
            </Link>{' '}
            and use <strong>Cook This</strong> on the Recipes tab.
          </Empty>
        ) : (
          <ul className="flex flex-col gap-3">
            {recipes.map((recipe) => (
              <Row
                key={recipe!.id}
                title={recipe!.title}
                meta={`${recipe!.minutes} min • ${recipe!.level} • ${chefById(recipe!.chefId)?.name}`}
              />
            ))}
          </ul>
        )}
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-heading-xl font-semibold text-text">
          Saved Techniques
        </h2>
        {techniques.length === 0 ? (
          <Empty>
            Use <strong>Save to Collection</strong> inside a lesson preview.
          </Empty>
        ) : (
          <ul className="flex flex-col gap-3">
            {techniques.map((technique) => (
              <Row
                key={technique!.id}
                title={technique!.title}
                meta={`${technique!.minutes} min • ${technique!.level} • ${chefById(technique!.chefId)?.name}`}
              />
            ))}
          </ul>
        )}
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-heading-xl font-semibold text-text">Favorite Chefs</h2>
        {chefs.length === 0 ? (
          <Empty>Use the bookmark control on any chef card.</Empty>
        ) : (
          <ul className="flex flex-col gap-3">
            {chefs.map((chef) => (
              <Row
                key={chef!.id}
                title={chef!.name}
                meta={`${chef!.restaurant}, ${chef!.city}`}
              />
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
