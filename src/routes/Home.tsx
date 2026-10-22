import { ChefCard } from '../components/chef/ChefCard'
import { ChefCardRow } from '../components/chef/ChefCardRow'
import { Button, ProgressBar } from '../components/ui/primitives'
import { Icon } from '../components/ui/Icon'
import {
  CareerGoal,
  LearningActivity,
  SkillDevelopment,
} from '../components/analytics/AnalyticsPanel'
import { useApp } from '../state/AppState'
import { chefById, chefs, techniqueById, user } from '../data'

function ContinueLearning() {
  const { state, dispatch, notify } = useApp()

  return (
    <section className="flex flex-col gap-6">
      <h2 className="text-heading-xl font-semibold text-text">Continue Learning</h2>
      <div className="flex flex-col gap-6">
        {state.activeLessons.map((lesson) => {
          const chef = chefById(lesson.chefId)
          return (
            <article
              key={lesson.id}
              className="flex flex-wrap items-center gap-6 rounded-[24px] bg-white p-6 shadow-drop-01 sm:flex-nowrap sm:gap-8"
            >
              <div className="relative h-20 w-32 shrink-0 overflow-hidden rounded-[16px]">
                <img
                  src={lesson.thumbnail}
                  alt={lesson.title}
                  className="absolute inset-0 size-full object-cover"
                />
                <span className="absolute inset-0 flex items-center justify-center text-white">
                  <Icon name="play" size={24} />
                </span>
              </div>

              <div className="flex min-w-[200px] flex-1 flex-col gap-3">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <h3 className="text-heading-s text-text">{lesson.title}</h3>
                    {chef && (
                      <p className="text-body-xs text-text-muted">{chef.name}</p>
                    )}
                  </div>
                  <span className="text-body-s text-numeral tabular-nums">
                    {lesson.progress}%
                  </span>
                </div>
                <ProgressBar
                  percent={lesson.progress}
                  label={`${lesson.title} progress`}
                />
              </div>

              <Button
                className="shrink-0"
                onClick={() => {
                  // Resume reopens the lesson's context: its chef, on the tab
                  // the lesson came from.
                  const technique = techniqueById(lesson.id)
                  if (technique) {
                    dispatch({
                      type: 'openChef',
                      chefId: technique.chefId,
                      tab: 'techniques',
                    })
                    dispatch({ type: 'openPreview', techniqueId: technique.id })
                  } else if (chef) {
                    dispatch({
                      type: 'openChef',
                      chefId: chef.id,
                      tab: 'recipes',
                    })
                  } else {
                    notify('Resuming', lesson.title)
                  }
                }}
              >
                Resume
                <span className="sr-only"> {lesson.title}</span>
              </Button>
            </article>
          )
        })}
      </div>
    </section>
  )
}

export function Home() {
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-10 xl:flex-row">
      <div className="flex min-w-0 flex-1 flex-col gap-10">
        <section>
          <h1 className="text-display-l text-text">Hello {user.name},</h1>
          <p className="text-heading-l text-text">
            Explore chefs and techniques matched to your learning goals.
          </p>
        </section>

        <section className="flex flex-col gap-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="text-heading-xl font-semibold text-text">
                Recommended for You
              </h2>
              <p className="mt-2 flex items-center gap-2 text-text-muted">
                <Icon name="aiSparkle" size={24} className="text-text-muted" />
                <span className="text-body-m">
                  Based on your skills and recent activity.
                </span>
              </p>
            </div>
            <button className="text-body-s font-semibold text-text underline-offset-4 transition-colors hover:text-primary-hover hover:underline">
              View all chefs
            </button>
          </div>

          {/* The row deliberately ends mid-card at any width - that clipped
              card is the affordance saying it scrolls. */}
          <ChefCardRow>
            {chefs.map((chef) => (
              <ChefCard key={chef.id} chef={chef} />
            ))}
          </ChefCardRow>
        </section>

        <ContinueLearning />
      </div>

      <aside className="flex w-full shrink-0 flex-col gap-8 xl:w-[348px]">
        <CareerGoal />
        <LearningActivity />
        <SkillDevelopment />
      </aside>
    </div>
  )
}
