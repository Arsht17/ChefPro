import logoChef from '../../assets/icons/logo-chef.svg'
import search from '../../assets/icons/search.svg'
import bell from '../../assets/icons/bell.svg'
import bookmark from '../../assets/icons/bookmark.svg'
import techniques from '../../assets/icons/techniques.svg'
import recipes from '../../assets/icons/recipes.svg'
import events from '../../assets/icons/events.svg'
import navHome from '../../assets/icons/nav-home.svg'
import navDiscovery from '../../assets/icons/nav-discovery.svg'
import navAcademy from '../../assets/icons/nav-academy.svg'
import navCollection from '../../assets/icons/nav-collection.svg'
import navRecent from '../../assets/icons/nav-recent.svg'
import navPlan from '../../assets/icons/nav-plan.svg'
import navSettings from '../../assets/icons/nav-settings.svg'
import play from '../../assets/icons/play.svg'
import playLg from '../../assets/icons/play-lg.svg'
import close from '../../assets/icons/close.svg'
import arrowRight from '../../assets/icons/arrow-right.svg'
import save from '../../assets/icons/save.svg'
import chevron from '../../assets/icons/chevron.svg'
import aiSparkle from '../../assets/icons/ai-sparkle.svg'

/* Every glyph is the SVG Figma exported, rendered as a CSS mask so it inherits
   currentColor. The nav needs that: the active pill flips label AND icon to
   white, and Figma solves it by exporting two differently-filled copies. */
export const icons = {
  logoChef,
  search,
  bell,
  bookmark,
  techniques,
  recipes,
  events,
  navHome,
  navDiscovery,
  navAcademy,
  navCollection,
  navRecent,
  navPlan,
  navSettings,
  play,
  playLg,
  close,
  arrowRight,
  save,
  chevron,
  aiSparkle,
} as const

export type IconName = keyof typeof icons

interface IconProps {
  name: IconName
  /** px. Icons are square everywhere in this design. */
  size?: number
  className?: string
}

export function Icon({ name, size = 24, className = '' }: IconProps) {
  // The URL must be quoted. Vite inlines small SVGs as data: URIs whose markup
  // contains single quotes, and an unquoted url() carrying quotes is invalid
  // CSS - the whole declaration gets dropped and the mask silently becomes a
  // solid block.
  const source = `url("${icons[name]}")`
  return (
    <span
      aria-hidden="true"
      className={`icon-mask inline-block shrink-0 ${className}`}
      style={{
        width: size,
        height: size,
        maskImage: source,
        WebkitMaskImage: source,
      }}
    />
  )
}
