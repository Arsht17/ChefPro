import { useEffect, useRef, useState } from 'react'
import { Button } from '../ui/primitives'
import { Icon } from '../ui/Icon'
import { useApp } from '../../state/AppState'
import { chefById, lessonVideo } from '../../data'
import type { Technique } from '../../data/types'

/**
 * The nested preview. It opens *inside* the Techniques tab rather than
 * navigating away, and scrolls itself into view so it never expands silently
 * below the fold of the tab column.
 */
export function LessonPreview({ technique }: { technique: Technique }) {
  const { state, dispatch, notify } = useApp()
  const ref = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(true)
  const chef = chefById(technique.chefId)
  const skillLabel = state.skills.find((s) => s.id === technique.skillId)?.label

  const saved = state.savedTechniqueIds.includes(technique.id)

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [technique.id])

  const togglePlayback = () => {
    const video = videoRef.current
    if (!video) return
    if (video.paused) void video.play()
    else video.pause()
  }

  const startLearning = () => {
    const skill = state.skills.find((s) => s.id === technique.skillId)
    const next = Math.min(100, (skill?.percent ?? 0) + technique.impact)
    dispatch({ type: 'startLesson', techniqueId: technique.id })
    notify(
      `Started ${technique.title}`,
      `Saved to Continue Learning. ${skillLabel} ${skill?.percent ?? 0}% to ${next}%.`,
    )
  }

  return (
    <div
      ref={ref}
      className="flex flex-col gap-8 rounded-[16px] bg-charcoal p-8 text-text-inverse motion-safe:animate-[panelIn_220ms_ease-out] lg:flex-row lg:items-start"
    >
      <div className="flex min-w-0 flex-1 flex-col gap-8">
        <div className="flex flex-col gap-3">
          <span className="text-body-2xs font-bold uppercase">
            Currently Viewing
          </span>
          <h4 className="text-heading-l font-bold">{technique.title}</h4>
          <p className="max-w-[448px] text-body-s leading-5">
            {technique.description}
          </p>
          <p className="text-body-xs text-white/70">
            {chef?.name} &middot; {skillLabel}
          </p>
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full border border-stroke bg-bg-02 px-[13px] py-[5px] text-body-2xs font-bold tracking-[1px] text-text uppercase">
              {technique.minutes} Minutes
            </span>
            <span className="rounded-full border border-stroke bg-bg-02 px-[13px] py-[5px] text-body-2xs font-bold tracking-[1px] text-text uppercase">
              +{technique.impact}% {skillLabel}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          <Button onClick={startLearning} className="min-w-[168px] whitespace-nowrap">
            Start Learning
            <Icon name="arrowRight" size={16} />
          </Button>
          <Button
            variant="outline"
            className="whitespace-nowrap"
            disabled={saved}
            onClick={() => {
              dispatch({ type: 'saveTechnique', techniqueId: technique.id })
              notify('Saved to My Collection', technique.title)
            }}
          >
            <Icon name="save" size={14} />
            {saved ? 'Saved' : 'Save to Collection'}
          </Button>
        </div>
      </div>

      {/* Media slot (`2152:1203`). The MP4 plays muted on a loop; the exported
          Figma frame stays on as the poster so the slot is never blank while
          the video loads. The fe:play vector is the design's affordance, so it
          rides on top - but only while the video is paused, since a permanent
          play button over running footage would be a lie. */}
      <button
        type="button"
        onClick={togglePlayback}
        aria-label={`${playing ? 'Pause' : 'Play'} the ${technique.title} preview`}
        className="group relative aspect-square w-full max-w-[256px] shrink-0 cursor-pointer self-center overflow-hidden rounded-[24px] lg:self-start"
      >
        <video
          ref={videoRef}
          key={technique.id}
          src={lessonVideo.src}
          poster={lessonVideo.poster}
          autoPlay
          loop
          muted
          playsInline
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          className="absolute inset-0 size-full object-cover"
        />
        <span
          className={`absolute inset-0 flex items-center justify-center transition-opacity duration-200 ${
            playing ? 'opacity-0 group-hover:opacity-60' : 'opacity-100'
          }`}
        >
          <Icon name="playLg" size={90} className="text-white drop-shadow-lg" />
        </span>
      </button>
    </div>
  )
}
