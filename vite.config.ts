import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

/**
 * `base` defaults to '/' so a Vercel (or any root-domain) deploy works with no
 * configuration. GitHub Pages serves the app from a project subpath instead, so
 * its workflow sets VITE_BASE=/ChefPro/ before building.
 */
export default defineConfig({
  base: process.env.VITE_BASE ?? '/',
  plugins: [react(), tailwindcss()],
})
