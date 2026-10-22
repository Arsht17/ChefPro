import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

/**
 * `base` defaults to '/' so a Vercel (or any root-domain) deploy works with no
 * configuration. GitHub Pages serves the app from a project subpath instead, so
 * its workflow sets VITE_BASE=/ChefPro/ before building.
 */
/**
 * Open Graph tags in index.html need an absolute origin. Vercel exposes the
 * production domain at build time; other hosts can set VITE_SITE_URL directly.
 */
process.env.VITE_SITE_URL ??= process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : ''

export default defineConfig({
  base: process.env.VITE_BASE ?? '/',
  plugins: [react(), tailwindcss()],
})
