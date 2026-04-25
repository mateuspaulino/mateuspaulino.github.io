import { useEffect, useState } from 'react'
import OfflineBanner from './components/OfflineBanner'
import ThemeToggle from './components/ThemeToggle'
import Footer from './components/Footer'
import HomePage from './components/HomePage'
import BlogIndexPage from './components/BlogIndexPage'
import BlogPostPage from './components/BlogPostPage'
import { useHashRoute } from './hooks/useHashRoute'

export default function App() {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') ||
        (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    }
    return 'light'
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => setTheme(t => t === 'light' ? 'dark' : 'light')

  const route = useHashRoute()

  // Reset scroll on every route change so opening a post doesn't leave the
  // reader halfway down the previous page.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [route])

  return (
    <>
      <OfflineBanner />
      <ThemeToggle theme={theme} onToggle={toggleTheme} />

      <main style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: '0 16px',
      }}>
        {renderRoute(route)}
      </main>

      <Footer />
    </>
  )
}

function renderRoute(route) {
  if (route === '/' || route === '') {
    return <HomePage />
  }
  if (route === '/blog') {
    return <BlogIndexPage />
  }
  if (route.startsWith('/blog/')) {
    const slug = decodeURIComponent(route.slice('/blog/'.length))
    return <BlogPostPage slug={slug} />
  }
  return <HomePage />
}
