# ChefPro

A working front-end prototype of **ChefPro**, a professional learning platform for
chefs: discover mentors, learn techniques, attend events, and track skill development.

Built from a Figma design as a connected product prototype — not a set of static
screens. Every number on the dashboard moves in response to what you do.

**Live:** https://arsht17.github.io/ChefPro/

---

## The flow it has to prove

1. Land on the **Home dashboard** — Larry's recommendations, two lessons in progress, and
   current analytics.
2. Click **Techniques**, **Recipes** or **Events** on a chef card → the **Chef Details
   Modal** opens over a dimmed dashboard, on the tab you clicked.
3. Switch tabs inside the modal — content changes in place, no navigation.
4. Hit **Preview** on a technique → the **Lesson Preview** expands *inline*. The row
   button flips to **Close**.
5. Hit **Start Learning**, and the dashboard is visibly different:
   - the lesson joins **Continue Learning** with a Resume CTA
   - its skill advances — *Sauce Techniques 70% → 85%*
   - **Lessons Completed** 4 → 5, **Courses Active** 2 → 3
   - the **Career Goal** ring recalculates
   - a toast confirms what changed

Plus: **Cook This** saves a recipe to My Collection and increments Recipes Practiced;
**Reserve Spot** confirms an event and lights its day on the calendar; the sidebar
collapses on click and expands on hover.

**State is deliberately not persisted.** This ships as a one-visit prototype, so every
load opens on the designed starting point - Continue Learning showing exactly the two
lessons from the Figma frame. State lives in memory, so it keeps accumulating for as
long as the visitor stays in the app and resets on reload.

## Stack

- **Vite + React 19 + TypeScript**
- **Tailwind CSS v4**, with the Figma variables declared as design tokens in
  `src/index.css`. Token names mirror the Figma variable names one-for-one
  (`primary color`, `Primary-hover`, `Numeral color`, `charcoal color`, …) so the two
  stay greppable against each other. No component carries a raw hex.
- **Sora**, self-hosted as woff2 — no external font dependency at runtime
- **react-router-dom** (HashRouter, because GitHub Pages has no SPA rewrite)
- One `AppStateProvider` — `useReducer`, in memory. No component library; the design
  system is specific enough that fighting one would cost more than it saves.

## Running it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build
npm run preview
```

`npm run shots` drives a headless Chrome over the key states and writes PNGs to
`shots/` — how the screens in review were captured. It needs Puppeteer, which is
deliberately **not** a dependency (it would pull a ~150 MB Chromium into every deploy
build). Install it only when you want screenshots:

```bash
npm i -D puppeteer && npm run shots
```

## Assets

Icons and photography are exported from the Figma file. Icons render through a CSS
`mask` so a single exported SVG can take `currentColor` — the nav needs that, since the
active pill flips both label and icon to white.

Photography is converted to sized WebP by `scripts/optimize-images.mjs`
(10.1 MB of source PNG → 410 KB). Re-run it after re-exporting.

## Known gaps, deliberately left

- **The 2 Michelin Star lock** (a Plus-tier boundary in the brief) is **not built**.
  Nothing in the Figma file expresses a locked state — every chef shown is 1 star or
  none, and the Plus card advertises "0-1 Michelin star chefs". Building it would have
  meant inventing a screen.
- **Chef Discovery, Chef Academy, Recently Viewed, Your Plan, Settings** are routes in
  the information architecture with no design. They render an honest placeholder rather
  than invented UI. **My Collection** is built simply, because Save Recipe has to land
  somewhere real.
- **Tab content for Daniel, Claire and Sofia is authored**, not from Figma — only Marco
  Rossi has techniques, recipes and events in the design. Marked `AUTHORED` in
  `src/data/index.ts`.
- **No mobile design exists.** The layout is desktop-first and degrades sensibly: the
  search bar is the first thing to compress (below 1414px), the analytics column drops
  under the main column below 1280, and the rail hides below 768. This is derived
  behaviour, not a designed breakpoint.

## The lesson video

The Lesson Preview media slot plays `src/assets/video/lesson-sauce-reduction.mp4`
(2.1 MB) muted, looping and inline. The exported Figma frame stays on as the `poster`,
so the slot is never blank while the video loads or if a browser refuses autoplay.

The play vector from the design sits on top, but only while the video is paused -
clicking the slot toggles playback. A permanent play button over running footage would
be claiming something untrue about the control.

The clip is the largest single asset in the build. If the deployed page needs to be
leaner, re-encode it rather than dropping it: at 2.7s it is short enough that a lower
bitrate is invisible.

## Where the build corrects the design

- **The Events calendar.** Figma draws March 2026 starting on a Wednesday, with day
  cells still named "May Days" from an earlier pass. March 1 2026 is a Sunday, so the
  grid is computed. A prototype that reserves a real date should not show it on the
  wrong weekday.
- **Career goal numbers.** The frame states a 60% ring and "4 of 6 chef skills
  completed"; the skill list (85/70/45/30/60/55) produces neither directly. Reconciled
  in `src/state/AppState.tsx`: completion counts skills at 55%+ (which gives exactly 4),
  and the ring is seeded at the designed 60 and moved by the change in average skill.
