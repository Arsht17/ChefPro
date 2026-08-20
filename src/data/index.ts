import type {
  ActiveLesson,
  Chef,
  ChefEvent,
  Recipe,
  Skill,
  Technique,
} from './types'

import chefMarco from '../assets/img/chef-marco.webp'
import chefDaniel from '../assets/img/chef-daniel.webp'
import chefClaire from '../assets/img/chef-claire.webp'
import chefSofia from '../assets/img/chef-sofia.webp'
import marcoPortrait from '../assets/img/chef-marco-portrait.webp'
import lessonKnife from '../assets/img/lesson-knife.webp'
import lessonTruffle from '../assets/img/lesson-truffle.webp'
import avatarLarry from '../assets/img/avatar-larry.webp'
import lessonVideoFrame from '../assets/img/lesson-video-frame.webp'
import lessonVideoSrc from '../assets/video/lesson-sauce-reduction.mp4'

// Learn-card thumbnails, exported from the Figma tab rows.
import thSpecBasics from '../assets/img/food/t-spec-basics.webp'
import thTagliatelle from '../assets/img/food/t-tagliatelle.webp'
import thEmulsion from '../assets/img/food/t-emulsion.webp'
import thReduction from '../assets/img/food/t-reduction.webp'
import thTruffle from '../assets/img/food/r-truffle.webp'
import thRisotto from '../assets/img/food/r-risotto.webp'
import thSeabass from '../assets/img/food/r-seabass.webp'
import thRavioli from '../assets/img/food/r-ravioli.webp'
import thPappardelle from '../assets/img/food/r-pappardelle.webp'

/* ---------------------------------------------------------------------------
   Provenance
   Chef Marco Rossi's techniques, recipes, events, quote and match reasons are
   transcribed from the Figma file. The other three chefs are only drawn as
   cards there - no tab content exists for them - so their items are authored
   here to keep the flow working from any card. Marked AUTHORED below.
   --------------------------------------------------------------------------- */

export const user = {
  name: 'Larry',
  role: 'Student Chef',
  plan: 'Plus',
  avatar: avatarLarry,
  careerGoal: 'Become Sous Chef',
  goalPercent: 60,
  skillsCompleted: 4,
  skillsTotal: 6,
}

/* Order matters: the radar plots these clockwise from the top, which reproduces
   the Knife / Sauces / Plating / Pastry / Fermentation / Seafood ring in Figma. */
export const initialSkills: Skill[] = [
  { id: 'knife', label: 'Knife Skills', short: 'Knife', percent: 85 },
  { id: 'sauce', label: 'Sauce Techniques', short: 'Sauces', percent: 70 },
  { id: 'plating', label: 'Plating', short: 'Plating', percent: 45 },
  { id: 'pastry', label: 'Pastry', short: 'Pastry', percent: 30 },
  { id: 'fermentation', label: 'Fermentation', short: 'Fermentation', percent: 60 },
  { id: 'seafood', label: 'Seafood', short: 'Seafood', percent: 55 },
]

export const initialActivity = {
  lessonsCompleted: 4,
  recipesPracticed: 3,
  coursesActive: 2,
}

/** Lesson Preview media. The MP4 is the real asset; the exported Figma frame
 *  stays on as the poster, so the slot is never blank while the video loads or
 *  if autoplay is refused. */
export const lessonVideo: { poster: string; src?: string } = {
  poster: lessonVideoFrame,
  src: lessonVideoSrc,
}

/** Weekly Cooking Time bar chart - hours per day, Mon..Sun. Sums to 12.5. */
export const weeklyCookingHours = [1.2, 2.1, 2.7, 1.5, 0.9, 1.8, 2.3]

export const chefs: Chef[] = [
  {
    id: 'marco',
    name: 'Chef Marco Rossi',
    restaurant: "Osteria dell'Orto",
    city: 'Florence',
    michelinStars: 1,
    tags: ['Italian', 'Pasta Mastery'],
    description:
      'Specializing in traditional Tuscan techniques with a modern farm-to-table approach.',
    quote:
      "“Modernizing tradition while respecting the seasons. My journey through Florence's gardens to the plate involves precision, patience, and the perfect sauce.”",
    focus: 'Italian Cuisine',
    specialty: 'Sauce Techniques',
    currentTheme: 'Seasonal Spring',
    rating: 4.9,
    reviewCount: '1.2k',
    image: chefMarco,
    focusY: 0.1,
    portrait: marcoPortrait,
    matchReasons: [
      {
        title: 'Career Goal Alignment',
        body: "Marco's transition from local trattoria to Michelin star matches your 'Professional Growth' track.",
      },
      {
        title: 'Skill Match: High',
        body: "Focuses heavily on Mother Sauces, which you've identified as a priority area for Q2 development.",
      },
      {
        title: 'Recommended Next Steps',
        body: "Completing his 'Spring Reductions' module will unlock the 'Advanced Plating' certification.",
      },
    ],
  },
  {
    id: 'daniel',
    name: 'Chef Daniel Kim',
    restaurant: 'Seoul Soul',
    city: 'New York',
    michelinStars: 1,
    tags: ['Korean Fusion', 'Fermentation'],
    description:
      'Pioneer of modern Korean flavors, blending traditional fermentation with global contemporary techniques.',
    quote:
      '“Fermentation is patience made edible. Every jar on my shelf is a conversation between time and technique.”',
    focus: 'Korean Fusion',
    specialty: 'Fermentation',
    currentTheme: 'Living Larder',
    rating: 4.8,
    reviewCount: '940',
    image: chefDaniel,
    focusY: 15.1,
    portrait: chefDaniel,
    matchReasons: [
      {
        title: 'Career Goal Alignment',
        body: 'Running a fermentation programme is a common differentiator in sous chef interviews.',
      },
      {
        title: 'Skill Match: Medium',
        body: 'Fermentation sits at 60% for you - his beginner ladder is built for exactly that level.',
      },
      {
        title: 'Recommended Next Steps',
        body: 'Start with the kimchi base before attempting the aged gochujang module.',
      },
    ],
  },
  {
    id: 'claire',
    name: 'Chef Claire Dubois',
    restaurant: "L'Etoile d'Or",
    city: 'Paris',
    michelinStars: 1,
    tags: ['Pastry', 'French'],
    description:
      'Renowned for intricate sugar work and revolutionary French pâtisserie foundations.',
    quote:
      '“Pâtisserie forgives nothing and teaches everything. Weigh twice, temper once.”',
    focus: 'French Pâtisserie',
    specialty: 'Pastry',
    currentTheme: 'Sugar & Structure',
    rating: 4.9,
    reviewCount: '1.6k',
    image: chefClaire,
    focusY: 13.4,
    portrait: chefClaire,
    matchReasons: [
      {
        title: 'Career Goal Alignment',
        body: 'Pastry is your weakest skill at 30% - the fastest available lift toward a rounded sous chef profile.',
      },
      {
        title: 'Skill Match: Foundational',
        body: 'Her foundations course assumes no prior pâtisserie experience.',
      },
      {
        title: 'Recommended Next Steps',
        body: 'Pâte à choux first; the sugar work modules build directly on it.',
      },
    ],
  },
  {
    id: 'sofia',
    name: 'Chef Sofia Alvarez',
    restaurant: 'Raíces',
    city: 'Mexico City',
    michelinStars: 0,
    tags: ['Mexican', 'Molecular'],
    description:
      'Redefining Mexican heritage through advanced molecular gastronomy and indigenous ingredients.',
    quote:
      '“Heritage is not a museum. I cook the milpa the way my grandmother did, with instruments she never had.”',
    focus: 'Mexican Heritage',
    specialty: 'Plating',
    currentTheme: 'Milpa Modern',
    rating: 4.7,
    reviewCount: '780',
    image: chefSofia,
    focusY: 18,
    portrait: chefSofia,
    matchReasons: [
      {
        title: 'Career Goal Alignment',
        body: 'Plating is the skill most visible on the pass - it moves fastest in a sous chef assessment.',
      },
      {
        title: 'Skill Match: Medium',
        body: 'Your plating sits at 45%; her compositions are built to be copied before they are adapted.',
      },
      {
        title: 'Recommended Next Steps',
        body: 'Work the three-element plate before the molecular garnish set.',
      },
    ],
  },
]

export const techniques: Technique[] = [
  // Marco - transcribed from Figma
  {
    id: 't-spec-basics',
    chefId: 'marco',
    title: 'Specification Basics',
    minutes: 18,
    level: 'Beginner',
    skillId: 'knife',
    description:
      'Read a kitchen spec sheet the way a head chef does, and cut to it every time.',
    impact: 6,
    thumbnail: thSpecBasics,
  },
  {
    id: 't-tagliatelle',
    chefId: 'marco',
    title: 'Traditional Handmade Tagliatelle',
    minutes: 18,
    level: 'Intermediate',
    skillId: 'pastry',
    description:
      'Egg dough by hand, rested and rolled to the thickness Florence expects.',
    impact: 8,
    thumbnail: thTagliatelle,
  },
  {
    id: 't-emulsion',
    chefId: 'marco',
    title: 'Emulsion & Texture Controls',
    minutes: 18,
    level: 'Intermediate',
    skillId: 'sauce',
    description:
      'Hold an emulsion under heat, and rescue one that has already split.',
    impact: 10,
    thumbnail: thEmulsion,
  },
  {
    // Row four in the Figma Techniques tab, and the brief's worked example.
    // +15 on Sauce Techniques takes the seeded 70% to the 85% the Figma
    // state-change pair shows.
    id: 't-reduction',
    chefId: 'marco',
    title: 'Sauce Reduction Techniques',
    minutes: 12,
    level: 'Intermediate',
    skillId: 'sauce',
    description:
      'Learn the structural foundations of professional Italian base sauces using traditional reduction methods.',
    impact: 15,
    thumbnail: thReduction,
  },
  // AUTHORED - no Figma tab content exists for the chefs below
  {
    id: 't-kimchi',
    chefId: 'daniel',
    title: 'Kimchi Base & Brine Ratios',
    minutes: 22,
    level: 'Beginner',
    skillId: 'fermentation',
    description: 'Salt ratios, timing and temperature for a brine that keeps.',
    impact: 10,
    thumbnail: thRisotto,
  },
  {
    id: 't-gochujang',
    chefId: 'daniel',
    title: 'Aged Gochujang Depth',
    minutes: 26,
    level: 'Advanced',
    skillId: 'fermentation',
    description: 'Building and reading a long ferment across a six-month cycle.',
    impact: 14,
    thumbnail: thEmulsion,
  },
  {
    id: 't-banchan',
    chefId: 'daniel',
    title: 'Precision Cuts for Banchan',
    minutes: 16,
    level: 'Intermediate',
    skillId: 'knife',
    description: 'Uniform julienne and batonnet at service speed.',
    impact: 7,
    thumbnail: thSpecBasics,
  },
  {
    id: 't-choux',
    chefId: 'claire',
    title: 'Pâte à Choux Foundations',
    minutes: 20,
    level: 'Beginner',
    skillId: 'pastry',
    description: 'Panade, egg incorporation and the bake that guarantees lift.',
    impact: 12,
    thumbnail: thTagliatelle,
  },
  {
    id: 't-sugar',
    chefId: 'claire',
    title: 'Pulled & Blown Sugar Work',
    minutes: 28,
    level: 'Advanced',
    skillId: 'pastry',
    description: 'Temperature stages, isomalt handling and safe pulling.',
    impact: 16,
    thumbnail: thPappardelle,
  },
  {
    id: 't-plating-3',
    chefId: 'sofia',
    title: 'The Three-Element Plate',
    minutes: 18,
    level: 'Beginner',
    skillId: 'plating',
    description: 'Composition, negative space and reading the plate as a frame.',
    impact: 10,
    thumbnail: thRavioli,
  },
  {
    id: 't-aguachile',
    chefId: 'sofia',
    title: 'Aguachile & Raw Fish Handling',
    minutes: 21,
    level: 'Intermediate',
    skillId: 'seafood',
    description:
      'Sourcing, curing windows and acid balance for raw preparations.',
    impact: 11,
    thumbnail: thSeabass,
  },
]

export const recipes: Recipe[] = [
  // Marco - transcribed from Figma
  { id: 'r-truffle', chefId: 'marco', title: 'Truffle Pasta Preparation', minutes: 18, level: 'Beginner', skillId: 'pastry', thumbnail: thTruffle },
  { id: 'r-risotto', chefId: 'marco', title: 'Wild Mushroom Risotto', minutes: 18, level: 'Beginner', skillId: 'sauce', thumbnail: thRisotto },
  { id: 'r-seabass', chefId: 'marco', title: 'Pan-Seared Sea Bass', minutes: 18, level: 'Beginner', skillId: 'seafood', thumbnail: thSeabass },
  { id: 'r-ravioli', chefId: 'marco', title: 'Lobster Ravioli with Butter Sauce', minutes: 18, level: 'Intermediate', skillId: 'sauce', thumbnail: thRavioli },
  { id: 'r-pappardelle', chefId: 'marco', title: 'Pappardelle with Slow-Braised Beef Ragu', minutes: 18, level: 'Advanced', skillId: 'sauce', thumbnail: thPappardelle },
  // AUTHORED
  { id: 'r-bibimbap', chefId: 'daniel', title: 'Seasonal Vegetable Bibimbap', minutes: 24, level: 'Beginner', skillId: 'fermentation', thumbnail: thRisotto },
  { id: 'r-jjigae', chefId: 'daniel', title: 'Aged Kimchi Jjigae', minutes: 20, level: 'Intermediate', skillId: 'fermentation', thumbnail: thEmulsion },
  { id: 'r-eclair', chefId: 'claire', title: 'Vanilla Bean Éclair', minutes: 26, level: 'Intermediate', skillId: 'pastry', thumbnail: thTagliatelle },
  { id: 'r-tatin', chefId: 'claire', title: 'Tarte Tatin, Caramel Forward', minutes: 22, level: 'Advanced', skillId: 'pastry', thumbnail: thPappardelle },
  { id: 'r-mole', chefId: 'sofia', title: 'Mole Verde with Charred Milpa', minutes: 30, level: 'Advanced', skillId: 'plating', thumbnail: thRavioli },
  { id: 'r-scallop', chefId: 'sofia', title: 'Scallop Aguachile', minutes: 15, level: 'Beginner', skillId: 'seafood', thumbnail: thSeabass },
]

/* Event dates are pinned to a day-of-month in whatever month the app is opened,
   not to fixed calendar dates. The Monthly Schedule opens on the current month,
   so hardcoded dates would leave it empty and the two legend keys pointing at
   nothing. `day` is clamped to the month's length, so 30 still lands inside
   February. */
const eventDate = (day: number) => {
  const now = new Date()
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()
  const d = new Date(now.getFullYear(), now.getMonth(), Math.min(day, lastDay))
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

export const events: ChefEvent[] = [
  // Marco - transcribed from Figma
  {
    id: 'e-sauces',
    chefId: 'marco',
    title: 'Modern Italian Sauces Masterclass',
    date: eventDate(24),
    minutes: 90,
    format: 'Live Online',
    description:
      "Deep dive into traditional mother sauces and their modern applications in Chef Marco's kitchen.",
  },
  {
    id: 'e-qa',
    chefId: 'marco',
    title: 'Chef Q&A: Seasonal Menus',
    date: eventDate(30),
    minutes: 45,
    format: 'Live Online',
    description:
      'Open interactive session focusing on spring ingredient sourcing and creating a cohesive seasonal menu.',
  },
  // AUTHORED
  {
    id: 'e-ferment',
    chefId: 'daniel',
    title: 'Fermentation Lab: Reading a Ferment',
    date: eventDate(18),
    minutes: 60,
    format: 'Live Online',
    description:
      'Taste-along session judging four ferments at different stages, with troubleshooting for stalled batches.',
  },
  {
    id: 'e-sugar',
    chefId: 'claire',
    title: 'Sugar Work Clinic',
    date: eventDate(21),
    minutes: 75,
    format: 'Live Online',
    description:
      'Small-group clinic on temperature control, isomalt handling and recovering a seized batch.',
  },
  {
    id: 'e-plating',
    chefId: 'sofia',
    title: 'Plating Studio: Negative Space',
    date: eventDate(26),
    minutes: 45,
    format: 'Live Online',
    description:
      'Build three plates from the same components and critique them against each other on the call.',
  },
]

/** Continue Learning, as the Home frame seeds it. */
export const initialActiveLessons: ActiveLesson[] = [
  {
    id: 'l-knife-precision',
    title: 'Knife Precision Techniques',
    chefId: 'marco',
    progress: 65,
    thumbnail: lessonKnife,
  },
  {
    id: 'r-truffle',
    title: 'Truffle Pasta Preparation',
    chefId: 'marco',
    progress: 40,
    thumbnail: lessonTruffle,
  },
]

/** Fallback art for lessons started during the session. */
export const defaultLessonThumbnail = lessonKnife

export const chefById = (id: string) => chefs.find((c) => c.id === id)
export const techniqueById = (id: string) => techniques.find((t) => t.id === id)
export const recipeById = (id: string) => recipes.find((r) => r.id === id)
export const techniquesFor = (chefId: string) =>
  techniques.filter((t) => t.chefId === chefId)
export const recipesFor = (chefId: string) =>
  recipes.filter((r) => r.chefId === chefId)
export const eventsFor = (chefId: string) =>
  events.filter((e) => e.chefId === chefId)
