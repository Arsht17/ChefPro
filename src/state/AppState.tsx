import {
  createContext,
  useContext,
  useMemo,
  useReducer,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import {
  chefById,
  defaultLessonThumbnail,
  initialActiveLessons,
  initialActivity,
  initialSkills,
  recipeById,
  techniqueById,
  user,
} from '../data'
import type { ActiveLesson, Skill } from '../data/types'

export type TabId = 'techniques' | 'recipes' | 'events'

export interface AppState {
  sidebarCollapsed: boolean
  /** Chef whose modal is open, or null. */
  activeChefId: string | null
  activeTab: TabId
  /** Technique shown in the inline Lesson Preview inside the modal. */
  previewTechniqueId: string | null
  activeLessons: ActiveLesson[]
  savedRecipeIds: string[]
  savedTechniqueIds: string[]
  reservedEventIds: string[]
  bookmarkedChefIds: string[]
  recentlyViewedChefIds: string[]
  skills: Skill[]
  activity: typeof initialActivity
}

const initialState: AppState = {
  sidebarCollapsed: true, // the Home frame draws the rail collapsed
  activeChefId: null,
  activeTab: 'techniques',
  previewTechniqueId: null,
  activeLessons: initialActiveLessons,
  savedRecipeIds: [],
  savedTechniqueIds: [],
  reservedEventIds: [],
  bookmarkedChefIds: [],
  recentlyViewedChefIds: [],
  skills: initialSkills,
  activity: initialActivity,
}

type Action =
  | { type: 'toggleSidebar' }
  | { type: 'openChef'; chefId: string; tab: TabId }
  | { type: 'closeChef' }
  | { type: 'setTab'; tab: TabId }
  | { type: 'openPreview'; techniqueId: string }
  | { type: 'closePreview' }
  | { type: 'startLesson'; techniqueId: string }
  | { type: 'saveTechnique'; techniqueId: string }
  | { type: 'saveRecipe'; recipeId: string }
  | { type: 'reserveEvent'; eventId: string }
  | { type: 'toggleBookmark'; chefId: string }
  | { type: 'reset' }

const clamp = (n: number) => Math.max(0, Math.min(100, n))

/** Continue Learning is a two-card rail in the Figma frame (11:901). */
const CONTINUE_LEARNING_SLOTS = 2

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'toggleSidebar':
      return { ...state, sidebarCollapsed: !state.sidebarCollapsed }

    case 'openChef':
      return {
        ...state,
        activeChefId: action.chefId,
        activeTab: action.tab,
        previewTechniqueId: null,
        recentlyViewedChefIds: [
          action.chefId,
          ...state.recentlyViewedChefIds.filter((id) => id !== action.chefId),
        ].slice(0, 8),
      }

    case 'closeChef':
      return { ...state, activeChefId: null, previewTechniqueId: null }

    case 'setTab':
      // Leaving a tab closes any preview opened inside it.
      return { ...state, activeTab: action.tab, previewTechniqueId: null }

    case 'openPreview':
      return { ...state, previewTechniqueId: action.techniqueId }

    case 'closePreview':
      return { ...state, previewTechniqueId: null }

    /* The moment the prototype has to prove itself: one action moves the
       lesson list, the skill bar, the activity counters and the goal ring. */
    case 'startLesson': {
      const technique = techniqueById(action.techniqueId)
      if (!technique) return state

      const already = state.activeLessons.some((l) => l.id === technique.id)
      const activeLessons: ActiveLesson[] = already
        ? state.activeLessons.map((l) =>
            l.id === technique.id
              ? { ...l, progress: clamp(l.progress + technique.impact) }
              : l,
          )
        : [
            {
              id: technique.id,
              title: technique.title,
              chefId: technique.chefId,
              progress: technique.impact,
              thumbnail: defaultLessonThumbnail,
            },
            ...state.activeLessons,
          ]
            // The frame draws exactly two Continue Learning cards, so a newly
            // started lesson takes the top slot and pushes the oldest out.
            .slice(0, CONTINUE_LEARNING_SLOTS)

      return {
        ...state,
        activeLessons,
        previewTechniqueId: null,
        activeChefId: null,
        skills: state.skills.map((s) =>
          s.id === technique.skillId
            ? { ...s, percent: clamp(s.percent + technique.impact) }
            : s,
        ),
        activity: {
          ...state.activity,
          lessonsCompleted: state.activity.lessonsCompleted + 1,
          coursesActive: already
            ? state.activity.coursesActive
            : state.activity.coursesActive + 1,
        },
      }
    }

    case 'saveTechnique':
      if (state.savedTechniqueIds.includes(action.techniqueId)) return state
      return {
        ...state,
        savedTechniqueIds: [...state.savedTechniqueIds, action.techniqueId],
      }

    case 'saveRecipe': {
      if (state.savedRecipeIds.includes(action.recipeId)) return state
      return {
        ...state,
        savedRecipeIds: [...state.savedRecipeIds, action.recipeId],
        activity: {
          ...state.activity,
          recipesPracticed: state.activity.recipesPracticed + 1,
        },
      }
    }

    case 'reserveEvent':
      if (state.reservedEventIds.includes(action.eventId)) return state
      return {
        ...state,
        reservedEventIds: [...state.reservedEventIds, action.eventId],
      }

    case 'toggleBookmark':
      return {
        ...state,
        bookmarkedChefIds: state.bookmarkedChefIds.includes(action.chefId)
          ? state.bookmarkedChefIds.filter((id) => id !== action.chefId)
          : [...state.bookmarkedChefIds, action.chefId],
      }

    case 'reset':
      return initialState

    default:
      return state
  }
}

/* Deliberately NOT persisted.
   This ships as a one-visit prototype, so every load has to open on the
   designed starting point: Continue Learning showing exactly the two lessons
   from the Figma frame (Knife Precision 65%, Truffle Pasta 40%), skills at
   85/70/45/30/60/55, activity at 4/3/2. State lives in memory, so it keeps
   accumulating for as long as the visitor stays in the app - navigating
   between routes, opening chefs, starting lessons - and resets on reload. */

export interface Toast {
  id: number
  title: string
  body?: string
}

interface AppContextValue {
  state: AppState
  dispatch: (action: Action) => void
  toasts: Toast[]
  notify: (title: string, body?: string) => void
  dismissToast: (id: number) => void
  /** Derived: goal ring recalculated from skills, not stored. */
  goalPercent: number
  skillsCompleted: number
}

const AppContext = createContext<AppContextValue | null>(null)

/* The Figma frame states two numbers the skill list does not actually produce:
   a 60% goal ring, and "4 of 6 chef skills completed". Reconciled as:

   - completed = skills at or above 55%. The seeded list (85/70/45/30/60/55)
     gives exactly 4, matching the frame.
   - the ring is seeded at the designed 60% and then moved by the change in
     average skill level, so learning visibly advances it without pretending
     the designed 60 was derived from anything. */
const COMPLETION_THRESHOLD = 55
const SEED_SKILL_AVERAGE =
  initialSkills.reduce((sum, s) => sum + s.percent, 0) / initialSkills.length

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState)
  const [toasts, setToasts] = useState<Toast[]>([])
  const toastId = useRef(0)

  const value = useMemo<AppContextValue>(() => {
    const completed = state.skills.filter(
      (s) => s.percent >= COMPLETION_THRESHOLD,
    ).length
    const average =
      state.skills.reduce((sum, s) => sum + s.percent, 0) / state.skills.length

    const notify = (title: string, body?: string) => {
      const id = ++toastId.current
      setToasts((current) => [...current, { id, title, body }])
      window.setTimeout(
        () => setToasts((current) => current.filter((t) => t.id !== id)),
        4000,
      )
    }

    return {
      state,
      dispatch,
      toasts,
      notify,
      dismissToast: (id: number) =>
        setToasts((current) => current.filter((t) => t.id !== id)),
      goalPercent: Math.max(
        0,
        Math.min(100, Math.round(user.goalPercent + (average - SEED_SKILL_AVERAGE))),
      ),
      skillsCompleted: completed,
    }
  }, [state, toasts])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used inside AppStateProvider')
  return ctx
}

/** Title for a saved item, whichever catalogue it came from. */
export function savedItemTitle(id: string) {
  return recipeById(id)?.title ?? techniqueById(id)?.title ?? id
}

export function chefNameFor(id: string) {
  return chefById(id)?.name ?? 'ChefPro'
}

export { user }
