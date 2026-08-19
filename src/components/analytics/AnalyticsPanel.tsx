import { useState, type ReactNode } from 'react'
import { ProgressBar } from '../ui/primitives'
import { Icon } from '../ui/Icon'
import { useApp } from '../../state/AppState'
import { user, weeklyCookingHours } from '../../data'
import { useWeekdayIndex } from '../../lib/time'

/* --------------------------------------------------------------------------
   Career Goal ring
   -------------------------------------------------------------------------- */

function GoalRing({ percent }: { percent: number }) {
  const radius = 42
  const circumference = 2 * Math.PI * radius
  return (
    <svg viewBox="0 0 96 96" className="size-24 shrink-0" role="img"
      aria-label={`Career goal ${percent}% complete`}>
      <circle
        cx="48" cy="48" r={radius} fill="none"
        stroke="var(--color-stroke)" strokeWidth="8"
      />
      <circle
        cx="48" cy="48" r={radius} fill="none"
        stroke="var(--color-primary)" strokeWidth="8" strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={circumference * (1 - percent / 100)}
        transform="rotate(-90 48 48)"
        className="transition-[stroke-dashoffset] duration-700 ease-out"
      />
      <text
        x="48" y="48" textAnchor="middle" dominantBaseline="central"
        className="fill-[var(--color-text)] text-[20px] font-normal"
      >
        {percent}%
      </text>
    </svg>
  )
}

export function CareerGoal() {
  const { goalPercent, skillsCompleted } = useApp()
  return (
    <section>
      <h2 className="mb-6 text-heading-xs font-semibold text-text">
        Career Goal Progress
      </h2>
      <div className="flex items-center gap-6 rounded-[24px] border border-stroke bg-white p-6">
        <GoalRing percent={goalPercent} />
        <div className="min-w-0">
          <p className="text-body-m font-semibold text-text">
            Goal: {user.careerGoal}
          </p>
          <p className="mt-2 text-body-s text-text-muted">
            {skillsCompleted} of {user.skillsTotal} chef skills completed
          </p>
        </div>
      </div>
    </section>
  )
}

/* --------------------------------------------------------------------------
   Collapsible shell shared by the two analytics cards
   -------------------------------------------------------------------------- */

function Collapsible({
  title,
  children,
  extra,
  defaultOpen = false,
}: {
  title: string
  children: ReactNode
  extra: ReactNode
  defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <section>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="mb-6 flex w-full items-center justify-between gap-2 text-left text-heading-xs font-semibold text-text transition-colors hover:text-primary-hover"
      >
        {title}
        <Icon
          name="chevron"
          size={20}
          className={`transition-transform duration-200 ${open ? '' : 'rotate-180'}`}
        />
      </button>
      <div className="rounded-[24px] border border-stroke bg-white p-6">
        {children}
        {open && <div className="mt-6 border-t border-stroke pt-6">{extra}</div>}
      </div>
    </section>
  )
}

/* --------------------------------------------------------------------------
   Learning Activity
   -------------------------------------------------------------------------- */

const DAY_INITIALS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
const DAY_NAMES = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
]

function WeeklyChart() {
  /* Figma draws Wednesday in Culinary Red because that is the day the frame was
     made. The red bar marks *today*, so it follows the clock the same way the
     header's time and date do - open the dashboard on Friday and Friday is
     red. */
  const today = useWeekdayIndex()
  const max = Math.max(...weeklyCookingHours)
  const total = weeklyCookingHours.reduce((a, b) => a + b, 0)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-2">
        <p className="text-body-s text-text">Weekly Cooking Time</p>
        <p className="text-body-s font-bold text-numeral">{total.toFixed(1)} hrs</p>
      </div>

      <div className="flex flex-col gap-1">
        {/* Today is Culinary Red; the rest of the week sits in the same muted
            grey as a progress track, over a baseline rule. */}
        <div className="flex h-[72px] items-end gap-1 border-b border-text-muted/25">
          {weeklyCookingHours.map((hours, index) => (
            <div
              key={index}
              className={`min-w-px flex-1 rounded-t-[8px] transition-colors duration-300 ${
                index === today ? 'bg-primary' : 'bg-text-muted/25'
              }`}
              style={{ height: `${(hours / max) * 100}%` }}
              title={`${DAY_NAMES[index]}: ${hours} hrs${index === today ? ' (today)' : ''}`}
            />
          ))}
        </div>

        <div className="flex gap-1">
          {DAY_INITIALS.map((day, index) => (
            <span
              key={index}
              aria-current={index === today ? 'date' : undefined}
              className={`flex-1 text-center text-body-2xs text-text ${
                index === today ? 'font-bold' : ''
              }`}
            >
              {day}
              {index === today && <span className="sr-only"> (today)</span>}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

export function LearningActivity() {
  const { state } = useApp()
  const rows = [
    {
      icon: 'techniques',
      label: 'Lessons Completed',
      sub: `${state.activity.lessonsCompleted} this week`,
      value: state.activity.lessonsCompleted,
    },
    {
      icon: 'recipes',
      label: 'Recipes Practiced',
      sub: `${state.activity.recipesPracticed} new dishes`,
      value: state.activity.recipesPracticed,
    },
    {
      icon: 'navAcademy',
      label: 'Courses Active',
      sub: `${state.activity.coursesActive} in progress`,
      value: state.activity.coursesActive,
    },
  ] as const

  return (
    <Collapsible title="Learning Activity" extra={<WeeklyChart />}>
      <ul className="flex flex-col gap-4">
        {rows.map((row) => (
          <li key={row.label} className="flex items-center gap-4">
            {/* Fully round chip (Figma: border-radius 99px) on Back 01. */}
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-bg-01 text-text">
              <Icon name={row.icon} size={20} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-body-s font-bold text-text">{row.label}</p>
              <p className="text-body-xs text-text-muted">{row.sub}</p>
            </div>
            <span className="text-heading-xs font-bold text-numeral tabular-nums">
              {row.value}
            </span>
          </li>
        ))}
      </ul>
    </Collapsible>
  )
}

/* --------------------------------------------------------------------------
   Chef Skill Development
   -------------------------------------------------------------------------- */

function SkillRadar({
  skills,
}: {
  skills: { label: string; short: string; percent: number }[]
}) {
  /* The viewBox is sized to the *labels*, not to the plot. Anchoring alone is
     not enough: "FERMENTATION" sits on the left at 10px bold, so it needs
     roughly 76px of room outside the rings or the SVG edge crops it. Margins
     are derived from the longest label rather than guessed, so renaming a
     skill cannot silently clip it again. */
  const RADIUS = 105
  const LABEL_GAP = 14
  const CHAR_WIDTH = 6.4 // 10px Sora Bold, measured
  const longest = Math.max(...skills.map((s) => s.short.length))
  const marginX = Math.ceil(longest * CHAR_WIDTH) + LABEL_GAP
  const marginY = 24

  const width = RADIUS * 2 + marginX * 2
  const height = RADIUS * 2 + marginY * 2
  const cx = width / 2
  const cy = height / 2

  const points = skills.map((skill, index) => {
    const angle = (Math.PI * 2 * index) / skills.length - Math.PI / 2
    const distance = (skill.percent / 100) * RADIUS
    const cos = Math.cos(angle)
    const sin = Math.sin(angle)
    return {
      x: cx + cos * distance,
      y: cy + sin * distance,
      lx: cx + cos * (RADIUS + LABEL_GAP),
      ly: cy + sin * (RADIUS + LABEL_GAP),
      anchor: (cos < -0.1 ? 'end' : cos > 0.1 ? 'start' : 'middle') as
        | 'end'
        | 'start'
        | 'middle',
      label: skill.short,
    }
  })

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="w-full"
      role="img"
      aria-label={skills.map((s) => `${s.label} ${s.percent}%`).join(', ')}
    >
      {[0.25, 0.5, 0.75, 1].map((ring) => (
        <circle
          key={ring} cx={cx} cy={cy} r={RADIUS * ring}
          fill="none" stroke="var(--color-stroke)" strokeWidth="1"
        />
      ))}
      <polygon
        points={points.map((p) => `${p.x},${p.y}`).join(' ')}
        fill="var(--color-primary)" fillOpacity="0.25"
        stroke="var(--color-primary)" strokeWidth="2"
        className="transition-all duration-500"
      />
      {points.map((p) => (
        <text
          key={p.label}
          x={p.lx}
          y={p.ly}
          textAnchor={p.anchor}
          dominantBaseline="middle"
          className="fill-[var(--color-text)] text-[10px] font-bold uppercase"
        >
          {p.label}
        </text>
      ))}
    </svg>
  )
}

export function SkillDevelopment() {
  const { state, notify } = useApp()
  const weakest = [...state.skills].sort((a, b) => a.percent - b.percent)[0]

  return (
    <Collapsible
      title="Chef Skill Development"
      extra={
        <div className="flex flex-col gap-6">
          <SkillRadar skills={state.skills} />
          <button
            onClick={() =>
              notify(
                'Improve weak skills',
                `${weakest.label} is your lowest at ${weakest.percent}%.`,
              )
            }
            className="w-full rounded-[24px] bg-primary px-5 py-2.5 text-body-xs font-bold tracking-[0.6px] text-text-inverse uppercase transition-colors hover:bg-primary-hover"
          >
            Improve Weak Skills
          </button>
        </div>
      }
    >
      <ul className="flex flex-col gap-4">
        {state.skills.map((skill) => (
          <li key={skill.id}>
            <div className="mb-2 flex items-center justify-between gap-2">
              <span className="text-body-xs font-bold tracking-[0.6px] text-text uppercase">
                {skill.label}
              </span>
              <span className="text-body-xs font-bold text-numeral tabular-nums">
                {skill.percent}%
              </span>
            </div>
            <ProgressBar
              percent={skill.percent}
              height={8}
              label={`${skill.label} skill level`}
            />
          </li>
        ))}
      </ul>
    </Collapsible>
  )
}
