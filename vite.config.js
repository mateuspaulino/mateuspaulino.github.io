import { copyFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * Public base path for built assets.
 *
 * - User/org page (default): `https://mateuspaulino.github.io/` \u2192 `/`
 * - Project page:             `https://<user>.github.io/<repo>/` \u2192 `/<repo>/`
 * - Custom domain (CNAME):    `/`
 *
 * Override at build time with `VITE_BASE`, e.g. `VITE_BASE=/portfolio/ npm run build`.
 */
const BASE = process.env.VITE_BASE ?? '/'

// https://vite.dev/config/
export default defineConfig({
  base: BASE,
  plugins: [
    react(),
    // GitHub Pages serves /404.html for any unknown path. Hash routing means
    // we shouldn't hit it, but if someone deep-links to `/portfolio/blog/foo`
    // (no `#`), Pages would 404. Copy index.html to 404.html so the SPA still
    // boots and the hash router can take over.
    {
      name: 'github-pages-404-fallback',
      apply: 'build',
      closeBundle() {
        const dist = resolve(__dirname, 'dist')
        copyFileSync(resolve(dist, 'index.html'), resolve(dist, '404.html'))
      },
    },
  ],
})
