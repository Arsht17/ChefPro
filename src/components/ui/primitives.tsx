import type { ButtonHTMLAttributes, ReactNode } from 'react'
import michelinStar from '../../assets/img/michelin-star.webp'

/* ---------------------------------------------------------------------------
   Button
   One pill shape across the design: rounded-24, Sora Bold 12/16 uppercase with
   0.6px tracking. Hover is always Primary-hover (#E05E5E) - the token added to
   the design system, and the rule every interactive red surface follows.
   --------------------------------------------------------------------------- */

type ButtonVariant = 'primary' | 'outline' | 'ghost'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  children: ReactNode
}

const BUTTON_BASE =
  'inline-flex items-center justify-center gap-[6px] rounded-[24px] px-5 py-3 ' +
  'text-body-xs font-bold uppercase tracking-[0.6px] leading-4 ' +
  'transition-colors duration-200 disabled:opacity-60 disabled:cursor-default'

const BUTTON_VARIANTS: Record<ButtonVariant, string> = {
  primary:
    'bg-primary text-text-inverse hover:bg-primary-hover disabled:hover:bg-primary',
  outline:
    'border border-stroke text-text-inverse hover:bg-primary-hover hover:border-primary-hover',
  ghost: 'border border-stroke text-text hover:bg-primary-hover hover:text-text-inverse',
}

export function Button({
  variant = 'primary',
  className = '',
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      {...rest}
      className={`${BUTTON_BASE} ${BUTTON_VARIANTS[variant]} ${className}`}
    >
      {children}
    </button>
  )
}

/* ---------------------------------------------------------------------------
   Tag - the pill used for cuisine, duration and impact chips.
   --------------------------------------------------------------------------- */

export function Tag({
  children,
  tone = 'light',
}: {
  children: ReactNode
  tone?: 'light' | 'onDark'
}) {
  const styles =
    tone === 'light'
      ? 'bg-bg-02 border-stroke text-text'
      : 'bg-white/20 border-white/10 text-text-inverse backdrop-blur-[6px]'
  return (
    <span
      className={`inline-flex items-center rounded-full border px-[13px] py-[5px] text-body-2xs font-bold uppercase tracking-[1px] leading-[15px] ${styles}`}
    >
      {children}
    </span>
  )
}

/* ---------------------------------------------------------------------------
   Michelin badge. Sofia Alvarez has no star, and the design still shows the
   badge - reading "NO STAR" - so the count drives the label, not visibility.
   --------------------------------------------------------------------------- */

export function StarBadge({ stars }: { stars: number }) {
  const label = stars === 0 ? 'No star' : `${stars} Star`
  return (
    <span className="inline-flex shrink-0 items-center gap-[2px] rounded-[24px] bg-primary px-2 py-1">
      <img src={michelinStar} alt="" className="h-[18px] w-6 object-contain" />
      <span className="text-body-2xs leading-[15px] text-text-inverse uppercase">
        {label}
      </span>
    </span>
  )
}

/* ---------------------------------------------------------------------------
   ProgressBar
   Percentage is written next to every bar, never carried by the fill alone
   (brief 18: do not communicate state through colour alone).
   --------------------------------------------------------------------------- */

export function ProgressBar({
  percent,
  height = 10,
  label,
}: {
  percent: number
  height?: number
  label?: string
}) {
  return (
    <div
      className="w-full overflow-hidden rounded-full bg-text-muted/25"
      style={{ height }}
      role="progressbar"
      aria-valuenow={Math.round(percent)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
    >
      <div
        className="h-full rounded-full bg-primary transition-[width] duration-500 ease-out"
        style={{ width: `${Math.max(0, Math.min(100, percent))}%` }}
      />
    </div>
  )
}
