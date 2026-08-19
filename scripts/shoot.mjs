// Screenshots the key states of the running dev server.
// Usage: node scripts/shoot.mjs [baseUrl] [outDir]
import puppeteer from 'puppeteer'
import { mkdir } from 'node:fs/promises'

const BASE = process.argv[2] ?? 'http://127.0.0.1:5178'
const OUT = process.argv[3] ?? 'shots'
await mkdir(OUT, { recursive: true })

const browser = await puppeteer.launch({
  headless: 'new',
  args: ['--force-device-scale-factor=1'],
})
const page = await browser.newPage()
const errors = []
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
page.on('pageerror', (e) => errors.push(String(e)))

const shot = async (name, opts = {}) => {
  await page.screenshot({ path: `${OUT}/${name}.png`, ...opts })
  console.log('shot', name)
}
const wait = (ms) => new Promise((r) => setTimeout(r, ms))

// Click the first element whose trimmed text matches.
const clickByText = async (selector, text) => {
  const handle = await page.evaluateHandle(
    (sel, txt) =>
      [...document.querySelectorAll(sel)].find(
        (el) => el.textContent.trim().toLowerCase().startsWith(txt.toLowerCase()),
      ) ?? null,
    selector,
    text,
  )
  const el = handle.asElement()
  if (!el) throw new Error(`no ${selector} matching "${text}"`)
  await el.click()
  await wait(450)
}

await page.setViewport({ width: 1920, height: 1200 })
await page.goto(`${BASE}/`, { waitUntil: 'networkidle0' })
await page.evaluate(() => localStorage.clear())
await page.reload({ waitUntil: 'networkidle0' })
await wait(600)

await shot('01-home', { fullPage: true })

// Sidebar expands on hover, without changing the pinned state
await page.hover('nav[aria-label="Main"]')
await wait(600)
await shot('02-sidebar-hover')
await page.mouse.move(900, 600)
await wait(500)

// Skill radar, expanded
await clickByText('button', 'Chef Skill Development')
await wait(700)
await shot('02b-skill-radar')
await clickByText('button', 'Chef Skill Development')
await wait(400)

// Open the modal via the chef card's TECHNIQUES action
await clickByText('button', 'Techniques')
await shot('03-modal-techniques')

// Open the inline lesson preview on Advanced Fondue Bases (4th row)
const previewButtons = await page.$$('button[aria-expanded]')
await previewButtons[previewButtons.length - 1].click()
await wait(700)
await shot('04-lesson-preview')

// Start Learning -> dashboard updates
await clickByText('button', 'Start Learning')
await wait(900)
await shot('05-after-start-learning', { fullPage: true })

// Reopen the modal, then drive the tabs by role so clicks cannot land on the
// dashboard buttons sitting behind the scrim.
await clickByText('button', 'Techniques')
await page.click('#tab-recipes')
await wait(500)
await shot('06-modal-recipes')

await page.click('#tab-events')
await wait(600)
await shot('07-modal-events')

await clickByText('#panel-events button', 'Reserve Spot')
await wait(400)
await shot('08-event-reserved')

// Close and look at My Collection
await page.keyboard.press('Escape')
await wait(400)
await page.goto(`${BASE}/#/collection`, { waitUntil: 'networkidle0' })
await wait(500)
await shot('09-collection', { fullPage: true })

// Narrower viewport - the compression order
await page.setViewport({ width: 1280, height: 900 })
await page.goto(`${BASE}/`, { waitUntil: 'networkidle0' })
await wait(600)
await shot('10-1280', { fullPage: true })

await page.setViewport({ width: 860, height: 900 })
await page.reload({ waitUntil: 'networkidle0' })
await wait(600)
await shot('11-860', { fullPage: true })

await browser.close()
console.log(errors.length ? `\nCONSOLE ERRORS:\n${errors.join('\n')}` : '\nno console errors')
