import { useEffect, useState } from 'react'

/**
 * Tiny hash-based router. Returns the current path (e.g. `/`, `/blog`,
 * `/blog/some-slug`) derived from `location.hash`.
 *
 * We deliberately stay dependency-free: the portfolio is a static SPA hosted
 * as a single index.html, and hash routing means `#/blog/foo` keeps working
 * on any host (including `file://` previews) without server rewrites.
 */
export function useHashRoute() {
  const [route, setRoute] = useState(() => readRoute())

  useEffect(() => {
    const onChange = () => setRoute(readRoute())
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])

  return route
}

function readRoute() {
  if (typeof window === 'undefined') return '/'
  const raw = window.location.hash.replace(/^#/, '')
  if (!raw || raw === '/') return '/'
  return raw.startsWith('/') ? raw : `/${raw}`
}

/**
 * Build a hash href for use with `<a href={...}>`. Keeps call sites readable
 * and avoids accidental `href="/blog"` (which would attempt a real navigation
 * away from the SPA).
 */
export function hashHref(path) {
  return `#${path.startsWith('/') ? path : `/${path}`}`
}
