import { Link } from 'react-router-dom'

/**
 * Honest placeholder. These routes exist in the information architecture but
 * have no Figma frame, so nothing is invented for them - the page says so and
 * points back to what does exist.
 */
export function NotDesigned({
  title,
  summary,
}: {
  title: string
  summary: string
}) {
  return (
    <div className="flex max-w-[640px] flex-col gap-6">
      <h1 className="text-display-l text-text">{title}</h1>
      <p className="text-heading-l text-text-muted">{summary}</p>
      <div className="rounded-[24px] border border-dashed border-stroke bg-white/60 p-8">
        <p className="text-body-m text-text">
          This screen is in the ChefPro information architecture but has no
          design yet.
        </p>
        <p className="mt-3 text-body-s text-text-muted">
          It is left deliberately empty rather than filled with invented UI. The
          Home dashboard and My Collection are the built screens.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex rounded-[24px] bg-primary px-5 py-3 text-body-xs font-bold tracking-[0.6px] text-text-inverse uppercase transition-colors hover:bg-primary-hover"
        >
          Back to dashboard
        </Link>
      </div>
    </div>
  )
}
