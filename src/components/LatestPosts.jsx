import { hashHref } from '../hooks/useHashRoute'
import { getLatestPosts } from '../posts'
import PostCard from './PostCard'

/**
 * Home-page strip showing the most recent blog posts. Defaults to just the
 * single most recent entry; pass `count` to surface more. Renders nothing if
 * the registry is empty so the home page degrades gracefully.
 */
export default function LatestPosts({ count = 1 }) {
  const latest = getLatestPosts(count)
  if (latest.length === 0) return null

  const heading = latest.length === 1 ? 'LATEST POST' : 'LATEST POSTS'

  return (
    <section id="blog" style={{
      maxWidth: '640px',
      margin: '0 auto',
      padding: '60px 20px',
      textAlign: 'center',
    }}>
      <h2 style={{
        fontFamily: 'var(--font-pixel)',
        fontSize: 'clamp(10px, 2.5vw, 14px)',
        marginBottom: '8px',
        letterSpacing: '2px',
      }}>
        {'> '}{heading}
      </h2>
      <p style={{
        fontFamily: 'var(--font-terminal)',
        fontSize: '18px',
        color: 'var(--text-muted)',
        marginBottom: '28px',
      }}>
        Notes on the boring stuff that makes software good.
      </p>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '16px',
      }}>
        {latest.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>

      <a
        href={hashHref('/blog')}
        style={{
          display: 'inline-block',
          marginTop: '28px',
          fontFamily: 'var(--font-terminal)',
          fontSize: '20px',
          color: 'var(--text-muted)',
        }}
      >
        $ ls /blog  <span style={{ opacity: 0.6 }}># all posts →</span>
      </a>
    </section>
  )
}
