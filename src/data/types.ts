export type SkillId =
  | 'knife'
  | 'sauce'
  | 'plating'
  | 'pastry'
  | 'fermentation'
  | 'seafood'

export type Level = 'Beginner' | 'Intermediate' | 'Advanced'

export interface Skill {
  id: SkillId
  label: string
  /** Radar labels are terse in the design: "Sauces", not "Sauce Techniques". */
  short: string
  /** Percent 0-100. Seeded from Figma, then moved by the learning flow. */
  percent: number
}

export interface MatchReason {
  title: string
  body: string
}

export interface Chef {
  id: string
  name: string
  restaurant: string
  city: string
  michelinStars: number
  tags: string[]
  description: string
  quote: string
  focus: string
  specialty: string
  currentTheme: string
  rating: number
  reviewCount: string
  /** Card/hero imagery. */
  image: string
  /**
   * Vertical focal point of the card image, 0-100.
   * Figma positions each card photo by hand (`top: -27.75%` and friends). Those
   * offsets are converted here to a background-position percentage, so the fill
   * can be `100% auto` - which preserves the source aspect. Marco's photo is
   * square, the other three are 2:3 portraits; a single shared height percentage
   * squashed them.
   */
  focusY: number
  portrait: string
  matchReasons: MatchReason[]
}

export interface Technique {
  id: string
  chefId: string
  title: string
  minutes: number
  level: Level
  skillId: SkillId
  description: string
  /** Percentage points this lesson adds to its skill when started. */
  impact: number
  thumbnail: string
}

export interface Recipe {
  id: string
  chefId: string
  title: string
  minutes: number
  level: Level
  skillId: SkillId
  thumbnail: string
}

export interface ChefEvent {
  id: string
  chefId: string
  title: string
  /** ISO date. The Events calendar highlights these days. */
  date: string
  minutes: number
  format: string
  description: string
}

export interface ActiveLesson {
  id: string
  title: string
  chefId: string
  progress: number
  thumbnail: string
}
